#ifndef UTILDEPSMANAGER_TS
#define UTILDEPSMANAGER_TS

///3d-party/zip.js/", scripts: ["zip.js", "zip-ext.js", "inflate.js"

/// @ZIP_JS: |content({data}/3d-party/zip.js/zip.js)|minify()
/// @ZIP_EXT_JS: |content({data}/3d-party/zip.js/zip-ext.js)|minify()
/// @INFLATE_JS: |content({data}/3d-party/zip.js/inflate.js)|minify()

"@ZIP_JS"
"@ZIP_EXT_JS"
"@INFLATE_JS"

#include "common.ts"
#include "IDepsManager.ts"
#include "IEngine.ts"
#include "io/files.ts"

#include "util/EffectParser.ts"
#include "util/URI.ts"

#include "include.ts"

#define ARA_INDEX ".map"
#define ETAG_FILE ".etag"

declare function unescape(s: string): string;

module akra.util.deps {
	export enum EStates {
		IDLE,
		LOADING
	}

	export var FORCE_ETAG_CHECKING: bool = true;

	function utf8_to_b64( str: string ): string {
	    return window.btoa(unescape(encodeURIComponent( str )));
	}

	function findLastLevel(pDeps: IDependens) {
		var c: IDependens = pDeps;

		while (isDefAndNotNull(c)) {
			if (!isDefAndNotNull(c.deps)) {
				return c;
			}

			c = c.deps;
		}

		return c;
	}

	function findFirstLevel(pDeps: IDependens) {
		var c: IDependens = pDeps;

		while (isDefAndNotNull(c)) {
			if (!isDefAndNotNull(c.parent)) 
				return c;
			
			c = c.parent;
		}

		return c;
	}

	function createARADLocalName(sFilename: string, sEntry: string): string {
		return "filesystem:" + info.uri.scheme + "//" + info.uri.host + "/temporary/" + sEntry + "/" + sFilename;
	}


	function calcDepth(pDeps: IDependens): int {
		var c: IDependens = pDeps;
		var d: int = 0;

		while (isDefAndNotNull(c)) {
			d ++;
			c = c.deps;
		}

		return d;
	}


	class Manager implements IDepsManager {
		protected _eState: EStates = EStates.IDLE;
		protected _pEngine: IEngine;
		protected _pDeps: IDependens = null;
		protected _sRoot: string = null;

		inline get root(): string { return this._sRoot; }

		constructor (pEngine: IEngine) {
			this._pEngine = pEngine;
		}



		inline getEngine(): IEngine { return this._pEngine; }

		load(pDeps: IDependens, sRoot: string = akra.DATA): bool {
			if (!isDefAndNotNull(pDeps)) {
				return false;
			}

			if (this._eState !== EStates.IDLE) {
				WARNING("deps manager in loading state");
				return false;
			}

			console.time("LOADING");

			this._eState = EStates.LOADING;
			this._sRoot = sRoot;

			this.normalizeDeps(pDeps, pDeps.root || sRoot);
			this.createResources(pDeps);
			this.loadDeps(pDeps);

			return true;
		}

		walk(pDeps: IDependens, 
			fn: (pDeps: IDependens, i: int, iDepth: uint, pParentDeps: IDependens) => void, 
			iDepth: uint = 0, 
			fnEnd: Function = null, 
			pParentDeps: IDependens = null): void {

			var pFiles: IDep[] = pDeps.files;

			if (isDefAndNotNull(pFiles)) {
				//normilize pathes to deps
				for (var i: int = 0; i < pFiles.length; ++ i) {
					fn.call(this, pDeps, i, iDepth, pParentDeps);
				}
			}

			if (isDefAndNotNull(pDeps.deps)) {
				this.walk(pDeps.deps, fn, ++ iDepth, fnEnd, pDeps);
			}
			else if (isFunction(fnEnd)) {
				fnEnd.call(this);
			}
		}

		each(pDeps: IDependens, fn: (pDep: IDep) => void): void {
			this.walk(pDeps, (pDeps: IDependens, i: int): void => {
				fn(pDeps.files[i]);
			});
		}

		private changeDepStatus(pDep: IDep, eStatus: EDependenceStatuses, pInfo: any = null): void {
			pDep.status = eStatus;

			if (eStatus === EDependenceStatuses.LOADED) {
				pDep.deps.loaded ++;
			}

			this.statusChanged(pDep, pInfo);

			if (eStatus === EDependenceStatuses.LOADED) {
				this.dependencyLoaded(pDep);
			}
		}

		private normalizeDeps(pDeps: IDependens, sRoot: string, iDepth: int = 0): void {
			sRoot = isString(sRoot)? sRoot: document.location.pathname;

			this.eachDeps(pDeps, (pDeps: IDependens, pParentDeps: IDependens): void => {
				pDeps.loaded = 0;
				pDeps.total = isArray(pDeps.files)? pDeps.files.length: 0;

				pDeps.parent = pParentDeps;
				pDeps.depth = isNull(pParentDeps)? iDepth: pParentDeps.depth + 1;
			});

			this.walk(pDeps, (pDeps: IDependens, i: int, iDepth: uint): void => {
				var pDep: IDep = pDeps.files[i];
				
				pDep.index = i;
				pDep.deps = pDeps;

				pDep.status = EDependenceStatuses.NOT_LOADED;
				pDep.path = path.resolve(pDeps.files[i].path, pDeps.root || sRoot);
			});
		}

		private eachDeps(pDeps: IDependens, fn: (pDeps: IDependens, pParentDeps: IDependens) => void): void {
			var p: IDependens = pDeps.parent || null;
			var c: IDependens = pDeps;

			while (isDefAndNotNull(c)) {
				fn(c, p);
				p = c;
				c = c.deps;
			}
		}


		private linkDeps(pParent: IDependens, pChild: IDependens): void {
			pParent = findLastLevel(pParent);
			pParent.deps = pChild;
			
			this.eachDeps(findFirstLevel(pParent), (pDeps: IDependens, pParentDeps: IDependens) => {
				pDeps.depth = isNull(pParentDeps)? 0: pParentDeps.depth + 1;
				pDeps.parent = pParentDeps;
			});
		}

		createResources(pDeps: IDependens): void {
			var pRmgr: IResourcePoolManager = this.getEngine().getResourceManager();
			this.each(pDeps, (pDep: IDep): void => {
				var sResource: string = pDep.name || pDep.path;

				switch ((path.info(pDep.path).ext || pDep.type || "").toLowerCase()) {
					case "fx":
					case "afx":
						if (!pRmgr.effectDataPool.findResource(sResource)) {
							pRmgr.effectDataPool.createResource(sResource);
						}
						break;
					case "jpg":
					case "jpeg":
					case "png":
					case "bmp":
					case "gif":
					case "dds":
						if (!pRmgr.imagePool.findResource(sResource)) {
							pRmgr.imagePool.createResource(sResource);
						}
						break;
					case "dae":
						if (!pRmgr.colladaPool.findResource(sResource)) {
							pRmgr.colladaPool.createResource(sResource);
						}
						break;
				}
			});
		}

		private inline getResourceManager(): IResourcePoolManager {
			return this.getEngine().getResourceManager();
		}

		private loadMap(pDep: IDep): void {
			var pFile: IFile = io.fopen(pDep.path, "rj");

			pFile.read((pErr: Error, pMap: IDependens): void => {
				if (!isNull(pErr)) {
					this.error(pErr);
				}
				
				pFile.close();
				
				
				var pCurrDeps: IDependens = pDep.deps;
				var pNextDeps: IDependens = pCurrDeps.deps;

				this.normalizeDeps(pMap, pDep.path, pCurrDeps.depth + 1);
				this.createResources(pMap);

				var iMapDepth: int = calcDepth(pMap);

				pCurrDeps.deps = null;

				this.linkDeps(pCurrDeps, pMap);
				this.linkDeps(pCurrDeps, pNextDeps);

				this.changeDepStatus(pDep, EDependenceStatuses.LOADED);
			});	
		}

		private loadGrammar(pDep: IDep): void {
			var pGrammar: IFile = io.fopen(pDep.path, "r");

			pGrammar.read((e: Error, sData: string): void => {
				if (!isNull(e)) {
					this.error(e);
				}

				//WARNING: only for HLSL grammar files.
				util.initAFXParser(sData);

				this.changeDepStatus(pDep, EDependenceStatuses.LOADED);
				pGrammar.close();
			});	
		}


		private forceExtractARADependence(pEntry: ZipEntry, sPath: string, fnCallback: Function): void {
			// console.log("forceExtractARADependence(", pEntry.filename, ")");
			console.time("unzip: " + sPath);
			pEntry.getData(new zip.ArrayBufferWriter(), (data: ArrayBuffer): void => {
				// console.log(sPath);
				var pCopy: IFile = fopen(sPath, "w+b");
				console.timeEnd("unzip: " + sPath);
				console.time("w+ local fs.: " + sPath);

				pCopy.write(data, (e: Error) => {
					if (e) throw e;

					debug_print("unpacked to local filesystem: ", pEntry.filename);
					// alert("unpacked to local filesystem: " + pEntry.filename);

					var pCrc32: IFile = fopen(sPath + ".crc32", "w+");
					pCrc32.write(String(pEntry.crc32), (e: Error) => {
						if (e) throw e;
						fnCallback(sPath);
						pCrc32.close();
					});

					console.timeEnd("w+ local fs.: " + sPath);
					// debugger;
					pCopy.close();
				});
			});
		}

		private extractARADependence(pEntry: ZipEntry, sHash: string, fnCallback: Function): void {
			var sPath: string = createARADLocalName(pEntry.filename, sHash);
			var pCRC32File: IFile = fopen(sPath + ".crc32", "r");
			
			pCRC32File.isExists((e: Error, bExists: bool) => {
				if (bExists) {
					pCRC32File.read((e: Error, data: string) => {
						if (parseInt(data) === pEntry.crc32) {
							console.log("skip unpacking: ", sPath);
							fnCallback(sPath);
						}
						else {
							this.forceExtractARADependence(pEntry, sPath, fnCallback);
						}

						pCRC32File.close();
					});

					return;
				}

				this.forceExtractARADependence(pEntry, sPath, fnCallback);
			});
		}

		//TODO: CREATE CORRECT UNPACKING FOR DATA_URI RESOURCES, NOW USED UNSAFE HASH <TMP>
		//NEEED UNIQUE HASH!!!!

		private loadARA(pArchiveDep: IDep): void {
			if (!info.api.zip) {

				js({path: this.root + "/3d-party/zip.js/", scripts: ["zip.js", "zip-ext.js", "inflate.js"]}, (e: Event): void => {
					ASSERT(isNull(e), "Zip loader must be specified");
					zip.workerScriptsPath = this.root + "/3d-party/zip.js/";

					this.loadARA(pArchiveDep);
				});

				return;
			}


			var sArchivePath: string = pArchiveDep.path;

			console.time("load ARA <" + sArchivePath + ">");
			// debugger;

			//hash is required to create a unique path for the local file system
			var sArchiveHash: string = "tmp";
			var pArchive: IFile = null;
			var pPrimaryDep: IDependens = pArchiveDep.deps;
			//binary data obtained immediately from the DATA URI
			var pUri: IDataURI = null;
			var sBase64Data: string = null;

			//api method very slow in this case: 
			//		path.uri(sArchivePath).scheme === "data:" 
			if (sArchivePath.substr(0, 5) === "data:") {
				//is data URI
				//data URI required cross-origin policy, and cannot be loaded with XMLHTTPRequest :(

				pUri = path.decodeDataURI(sArchivePath);
				debug_assert(pUri.base64, "only base64 decoded ARA resources supported.", sArchivePath);
				sBase64Data = pUri.data;
			}
			else {
				sArchiveHash = path.resolve(sArchivePath).md5();
				pArchive = io.fopen(sArchivePath, "rb");
			}



			this.changeDepStatus(pArchiveDep, EDependenceStatuses.CHECKING);

			var fnArchiveLoaded = (pARADeps: IDependens): void => {
				this.linkDeps(pPrimaryDep, pARADeps);

				this.createResources(pARADeps);
				this.changeDepStatus(pArchiveDep, EDependenceStatuses.LOADED);
			}

			var fnLoadArchive = (fnLoaded?: Function): void => {
				this.changeDepStatus(pArchiveDep, EDependenceStatuses.LOADING);

				var fnZipReadedCallback = (pZipReader: ZipReader): void => {
					pZipReader.getEntries((pEntries: ZipEntry[]): void => {
						console.timeEnd("UNPACKING");
						var pEntryMap: {[path: string]: ZipEntry;} = {};
						var nTotal: uint = 0;
						var nUnpacked: uint = 0;

						for (var i: int = 0; i < pEntries.length; ++ i) {
							if (pEntries[i].directory) continue;
							pEntryMap[pEntries[i].filename] = pEntries[i];
							nTotal ++;
						}

						console.log("expected unpacking: ", nTotal);

						var pMapEntry: ZipEntry = pEntryMap[ARA_INDEX];

						ASSERT(isDefAndNotNull(pMapEntry), "ARA dependences found, but headers corrupted.");

						pMapEntry.getData(new zip.TextWriter(), (data: string): void => {
							var pARADeps: IDependens = <IDependens>JSON.parse(data);

							var fnSuccesss: Function = (sLocalPath: string): void => {
								nUnpacked ++;

								this.changeDepStatus(pArchiveDep, EDependenceStatuses.UNPACKING, {loaded: nUnpacked, total: nTotal});

								if (nUnpacked < nTotal) return;
								
								debug_print("ARA dependences successfully loaded: ", sArchivePath);
								console.timeEnd("load ARA <" + sArchivePath + ">");

								if (fnLoaded) {
									fnLoaded();
								}

								// alert("ARA dependences successfully loaded: " + sArchivePath);

								pZipReader.close();
								//id data-uri used, archive is null
								pArchive && pArchive.close();
								
								fnArchiveLoaded(pARADeps);
							};

							this.normalizeDeps(pARADeps, "");
							this.each(pARADeps, (pDep: IDep): void => {
								var sPath: string = pDep.path;
								var pEntry: ZipEntry = pEntryMap[sPath];

								ASSERT(isDefAndNotNull(pEntry), "Cannot resolve ARA dependence: " + sPath);
								delete pEntryMap[sPath];
								
								this.extractARADependence(pEntry, sArchiveHash, (sLocalPath: string): void => {
									pDep.path = sLocalPath;
									fnSuccesss(sLocalPath);
								});
							});

							//Extract all files that were not included in the. MAP file
							for (var sPath in pEntryMap) {
								// console.log("unmapped deps: ", sPath);
								this.extractARADependence(pEntryMap[sPath], sArchiveHash, fnSuccesss);
							}
						});
					});
				};

				var fnDataURIReaded = (sBase64Data: string): void => {
					this.changeDepStatus(pArchiveDep, EDependenceStatuses.UNPACKING);
					// debugger;
					zip.createReader(new zip.Data64URIReader(sBase64Data), 
						fnZipReadedCallback, 
						(err: Error): void => {
							console.log(err);
						}
					);
				}	


				var fnArchiveReadedCallback = (err: Error, pData: ArrayBuffer): void => {
					
					this.changeDepStatus(pArchiveDep, EDependenceStatuses.UNPACKING);
					console.time("UNPACKING");
					
					zip.createReader(new zip.ArrayBufferReader(pData), 
						fnZipReadedCallback, 
						(err: Error): void => {
							console.log(err);
						}
					);
				}

				if (pArchive) {
					pArchive.read(fnArchiveReadedCallback, (nLoaded: uint, nTotal: uint): void => {
						this.changeDepStatus(pArchiveDep, EDependenceStatuses.LOADING, {loaded: nLoaded, total: nTotal});
					});
				}	
				else {
					fnDataURIReaded(sBase64Data);
				}
			}

			if (!isNull(pArchive)) {
				//non data-uri cases
				pArchive.open((err: Error, pMeta: IFileMeta): void => {
					if (FORCE_ETAG_CHECKING) {
						var pETag: IFile = fopen(createARADLocalName(ETAG_FILE, sArchiveHash), "r+");

						pETag.read((e: Error, sETag: string) => {
							if (!isNull(e) || !isString(pMeta.eTag) || sETag !== pMeta.eTag) {
								debug_print(sArchivePath, "ETAG not verified.", pMeta.eTag);

								fnLoadArchive((): void => {
									if (isDefAndNotNull(pMeta.eTag)) {
										pETag.write(pMeta.eTag);
									}
								});
								return;
							}

							debug_print(sArchivePath, "ETAG verified successfully!", sETag);
							
							fopen(createARADLocalName(ARA_INDEX, sArchiveHash), "rj").read((e: Error, pMap: IDependens): void => {
								this.normalizeDeps(pMap, "");
								this.each(pMap, (pDep: IDep): void => {
									pDep.path = createARADLocalName(pDep.path, sArchiveHash);
								});

								fnArchiveLoaded(pMap);
							});
						});
					}
					else {
						fnLoadArchive();
					}
				});
			}
			else {
				fnLoadArchive();
			}
		}

	

		private loadAFX(pDep: IDep): void {
			var sResource: string = pDep.name || pDep.path;
			var pRes: IResourcePoolItem = this.getResourceManager().effectDataPool.findResource(sResource);

			if (pRes.loadResource(pDep.path)) {
				this.handleResourceEventOnce(pRes, SIGNAL(loaded), (pItem: IResourcePoolItem): void => {
						this.changeDepStatus(pDep, EDependenceStatuses.LOADED);
					}
				);
			}
			else {
				this.error(new Error("could not load resource: " + pDep.path));
			}
		}

		private loadImage(pDep: IDep): void {
			var sResource: string = pDep.name || pDep.path;
			var pRes: IResourcePoolItem = this.getResourceManager().imagePool.findResource(sResource);

			if (pRes.loadResource(pDep.path)) {
				this.handleResourceEventOnce(pRes, SIGNAL(loaded), (pItem: IResourcePoolItem): void => {
					this.changeDepStatus(pDep, EDependenceStatuses.LOADED);
				});
			}
			else {
				this.error(new Error("could not load resource: " + pDep.path));
			}
		}

		private loadDAE(pDep: IDep): void {
			var sResource: string = pDep.name || pDep.path;
			var pRes: IResourcePoolItem = this.getResourceManager().colladaPool.findResource(sResource);

			if (pRes.loadResource(pDep.path)) {
				this.handleResourceEventOnce(pRes, SIGNAL(loaded), (pItem: IResourcePoolItem): void => {
						this.changeDepStatus(pDep, EDependenceStatuses.LOADED);
				});
			}
			else {
				this.error(new Error("could not load resource: " + pDep.path));
			}
		}

		private loadCustom(pDep: IDep): void {
			var pFile: IFile = io.fopen(pDep.path, "r");

			pFile.read((pErr: Error, sData: string): void => {
				if (!isNull(pErr)) {
					this.error(pErr);
				}
				
				pFile.close();

				pDep.content = sData;
				this.changeDepStatus(pDep, EDependenceStatuses.LOADED);
			});	
		}

		private loadJSON(pDep: IDep): void {
			var pFile: IFile = io.fopen(pDep.path, "rj");

			pFile.read((pErr: Error, pData: Object): void => {
				if (!isNull(pErr)) {
					this.error(pErr);
				}
				
				pFile.close();
				pDep.content = pData;
				this.changeDepStatus(pDep, EDependenceStatuses.LOADED);
			});	
		}

		private loadBSON(pDep: IDep): void {
			var pFile: IFile = io.fopen(pDep.path, "rb");

			pFile.read((pErr: Error, pBuffer: ArrayBuffer): void => {
				if (!isNull(pErr)) {
					this.error(pErr);
				}
				
				pFile.close();
				pDep.content = akra.io.undump(pBuffer);

				this.changeDepStatus(pDep, EDependenceStatuses.LOADED);
			});	
		}

		private loadDeps(pDeps: IDependens): void {
			//if got empty dependency.
			if (!isArray(pDeps.files) || pDeps.files.length === 0) {
				if (isDefAndNotNull(pDeps.deps)) {
					this.loadDeps(pDeps.deps);
				}
				else {
					this.loaded(pDeps);
				}
			}

			//walk single deps level
			this.each({files: pDeps.files}, (pDep: IDep): void => {
				this.changeDepStatus(pDep, EDependenceStatuses.LOADING);
								
				switch ((path.info(pDep.path).ext || pDep.type || "").toLowerCase()) {
					case "ara":
						//akra resource archive
						this.loadARA(pDep);
						break;
					case "gr":
						this.loadGrammar(pDep);
						break;
					case "fx":
					case "afx":
						this.loadAFX(pDep);
						break;
					case "jpeg":
					case "jpg":
					case "png":
					case "gif":
					case "bmp":
					case "dds":
						this.loadImage(pDep);
						break;
					case "dae":
						this.loadDAE(pDep);
						break;
					case "json":
						this.loadJSON(pDep);
						break;
					case "bson":
						this.loadBSON(pDep);
						break;
					case "txt":
						this.loadCustom(pDep);
						break;
					case "map":
						this.loadMap(pDep);
						break;
					default:
						WARNING("dependence " + pDep.path + " unknown, and will be skipped.");
				}	

			});
		}

		private handleResourceEventOnce(pRsc: IResourcePoolItem, sSignal: string, fnHandler: (pItem: IResourcePoolItem) => void): void {
			var fn: (pItem: IResourcePoolItem) => void;
			
			fn = (pItem: IResourcePoolItem): void => {
				fnHandler(pItem);
				pRsc.unbind(sSignal, fn);
			}

			pRsc.bind(sSignal, fn);
		}

		dependencyLoaded(pFile: IDep): void {
			var pDeps: IDependens = pFile.deps;

			if (pDeps.loaded < pDeps.total) {
				return;
			}

			if (isDefAndNotNull(pDeps.deps)) {
				this.loadDeps(pDeps.deps);
			}
			else {
				this.loaded(pDeps);
			}
		}

		CREATE_EVENT_TABLE(Manager);
		BROADCAST(statusChanged, CALL(file, info));
		
		loaded(pDeps: IDependens): void {
			console.timeEnd("LOADING");
			this._eState = EStates.IDLE;
			EMIT_BROADCAST(loaded, _CALL(pDeps));
		}

		error(pErr: Error): void {
			if (true) throw pErr;
			EMIT_BROADCAST(error, _CALL(pErr));
		}

	}

	export function createManager(pEngine: IEngine): IDepsManager {
		debug_assert(isDefAndNotNull(pEngine));
		return new Manager(pEngine);
	}
}

#endif
