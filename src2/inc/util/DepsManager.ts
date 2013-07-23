#ifndef DEPSMANAGER_TS
#define DEPSMANAGER_TS

#include "common.ts"
#include "IDepsManager.ts"
#include "IEngine.ts"
#include "io/files.ts"

#include "util/EffectParser.ts"
#include "util/URI.ts"

#define ARA_INDEX ".map"

declare function unescape(s: string): string;

module akra.util {
	export enum EDepsManagerStates {
		IDLE,
		LOADING
	}

	function utf8_to_b64( str: string ): string {
	    return window.btoa(unescape(encodeURIComponent( str )));
	}

	class DepsManager implements IDepsManager {
		protected _eState: EDepsManagerStates = EDepsManagerStates.IDLE;
		protected _pEngine: IEngine;
		protected _pDeps: IDependens = null;

		constructor (pEngine: IEngine) {
			this._pEngine = pEngine;
		}

		inline getEngine(): IEngine { return this._pEngine; }
		inline get target(): IDependens { return this._pDeps; }
 
		load(pDeps: IDependens, sRoot: string = null): bool {
			if (!isDefAndNotNull(pDeps)) {
				return false;
			}

			if (this._eState === EDepsManagerStates.LOADING) {
				WARNING("deps manager in loading state");
				return false;
			}

			if (info.api.zip) {
				zip.workerScriptsPath = sRoot + "/3d-party/zip.js/";
			}

			this._pDeps = pDeps;

			this.generateDepInfo(pDeps);
			this.normalizeDepsPaths(pDeps, pDeps.root || sRoot);
			this.createDepsResources(pDeps);
			this.loadDeps(pDeps);

			return true;
		}

		walk(pDeps: IDependens, fn: (pDeps: IDependens, i: int, iDepth?: uint) => void, iDepth: uint = 0, fnEnd?: Function): void {
			var pFiles: IDep[] = pDeps.files;

			if (isDefAndNotNull(pFiles)) {
				//normilize pathes to deps
				for (var i: int = 0; i < pFiles.length; ++ i) {
					fn.call(this, pDeps, i, iDepth);
				}
			}

			if (isDefAndNotNull(pDeps.deps)) {
				this.walk(pDeps.deps, fn, ++ iDepth);
			}
			else if (isFunction(fnEnd)) {
				fnEnd.call(this);
			}
		}

		private generateDepInfo(pDeps: IDependens): void {
			var pCurr: IDependens = pDeps;
			var pInfo: number[] = [];

			
			while (isDefAndNotNull(pCurr)) {
				pInfo.push(pCurr.files? pCurr.files.length: 0);
				pCurr = pCurr.deps;
			}

			this.depInfo(pInfo);
		}

		normalizeDepsPaths(pDeps: IDependens, sRoot: string): void {
			sRoot = isString(sRoot)? sRoot: document.location.pathname;

			this.walk(pDeps, (pDeps: IDependens, i: int): void => {
				pDeps.files[i].path = path.resolve(pDeps.files[i].path, pDeps.root || sRoot);
			});
		}

		createDepsResources(pDeps: IDependens): void {
			var pRmgr: IResourcePoolManager = this.getEngine().getResourceManager();
			this.walk(pDeps, (pDeps: IDependens, i: int, iDepth?: uint): void => {
				var pFiles: IDep[] = pDeps.files;
				var sResource: string = pFiles[i].name || pFiles[i].path;

				switch (path.info(pFiles[i].path).ext.toLowerCase()) {
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

		private loadGrammar(pDep: IDependens, i: int, iDepth?: uint): void {
			var pManager: DepsManager = this;
			var pFiles: IDep[] = pDep.files;
			var pGrammar: IFile = io.fopen(pFiles[i].path, "r");

			pGrammar.read((pErr: Error, sData: string): void => {
				if (!isNull(pErr)) {
					pManager.error(pErr);
				}

				//WARNING: only for HLSL grammar files.
				util.initAFXParser(sData);
				pManager._onDependencyLoad(pDep, iDepth, i, sData);
				pGrammar.close();
			});	
		}

		private createARADLocalName(pEntry: ZipEntry, sHash: string): string {
			return "filesystem:" + info.uri.scheme + "//" + info.uri.host + "/temporary/" + sHash + "/" + pEntry.filename;
		}


		private forceExtractARADependence(pEntry: ZipEntry, sPath: string, fnCallback: Function): void {
			// console.log("forceExtractARADependence(", pEntry.filename, ")");

			pEntry.getData(new zip.ArrayBufferWriter(), (data: ArrayBuffer): void => {
				// console.log(sPath);
				var pCopy: IFile = fopen(sPath, "w+b");
				
				pCopy.write(data, (e: Error) => {
					if (e) throw e;

					LOG("unpacked to local filesystem: ", pEntry.filename);
					// alert("unpacked to local filesystem: " + pEntry.filename);

					var pCrc32: IFile = fopen(sPath + ".crc32", "w+");
					pCrc32.write(String(pEntry.crc32), (e: Error) => {
						if (e) throw e;
						fnCallback(sPath);
						pCrc32.close();
					});

					pCopy.close();
				});


			});
		}

		private extractARADependence(pEntry: ZipEntry, sHash: string, fnCallback: Function): void {
			var sPath: string = this.createARADLocalName(pEntry, sHash);
			var pCRC32File: IFile = fopen(sPath + ".crc32", "r");
			
			pCRC32File.isExists((e: Error, bExists: bool) => {
				if (bExists) {
					pCRC32File.read((e: Error, data: string) => {
						if (parseInt(data) === pEntry.crc32) {
							console.log("skip unpacking for dep.: ", sPath);
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

		private loadARA(pPrimaryDep: IDependens, n: int, iPrimaryDepth?: uint): void {
			ASSERT(info.api.zip, "Zip loader must be specified");

			var pManager: DepsManager = this;
			var pFiles: IDep[] = pPrimaryDep.files;
			var sArchivePath: string = pFiles[n].path;
			var sArchiveHash: string = utf8_to_b64(sArchivePath);
			var pArchive: IFile = io.fopen(sArchivePath, "rb");
			var pLLDep: IDependens = DepsManager.findLastLevel(pPrimaryDep);

			pArchive.read((err: Error, pData: ArrayBuffer): void => {
				zip.createReader(new zip.ArrayBufferReader(pData), 
					(pZipReader: ZipReader): void => {
						pZipReader.getEntries((pEntries: ZipEntry[]): void => {

							var pEntryMap: {[path: string]: ZipEntry;} = {};
							var nTotal: uint = -1;

							for (var i: int = 0; i < pEntries.length; ++ i) {
								if (pEntries[i].directory) continue;
								pEntryMap[pEntries[i].filename] = pEntries[i];
								nTotal ++;
							}

							var pMapEntry: ZipEntry = pEntryMap[ARA_INDEX];

							delete pEntryMap[ARA_INDEX];
							ASSERT(isDefAndNotNull(pMapEntry), "ARA dependences found, but headers corrupted.");

							pMapEntry.getData(new zip.TextWriter(), (data: string): void => {
								var pARADeps: IDependens = <IDependens>JSON.parse(data);

								var fnSuccesss: Function = (sLocalPath: string): void => {
									nTotal --;

									if (nTotal > 0) return;
									
									console.log("ARA dependences successfully loaded: ", sArchivePath);
									// alert("ARA dependences successfully loaded: " + sArchivePath);

									pZipReader.close();
									pLLDep.deps = pARADeps;

									this.generateDepInfo(this.target);

									pManager.createDepsResources(pARADeps);
									pManager._onDependencyLoad(pPrimaryDep, iPrimaryDepth, n, pArchive);

									pArchive.close();
								};

								pManager.normalizeDepsPaths(pARADeps, "");
								pManager.walk(pARADeps, (pDep: IDependens, i: int, iDepth?: uint): void => {
									var sPath: string = pDep.files[i].path;
									var pEntry: ZipEntry = pEntryMap[sPath];

									ASSERT(isDefAndNotNull(pEntry), "Cannot resolve ARA dependence: " + sPath);
									delete pEntryMap[sPath];
									
									this.extractARADependence(pEntry, sArchiveHash, (sLocalPath: string): void => {
										pDep.files[i].path = sLocalPath;
										fnSuccesss(sLocalPath);
									});
								});

								for (var sPath in pEntryMap) {
									// console.log("unmapped deps: ", sPath);
									this.extractARADependence(pEntryMap[sPath], sArchiveHash, fnSuccesss);
								}
							});
						});
					}, 
					(err: Error): void => {
						console.log(err);
					}
				);
			});
		}

	

		private loadAFX(pDep: IDependens, i: int, iDepth?: uint): void {
			var pFiles: IDep[] = pDep.files;
			var pManager: DepsManager = this;
			var sResource: string = pFiles[i].name || pFiles[i].path;
			var pRes: IResourcePoolItem = this.getResourceManager().effectDataPool.findResource(sResource);
							// console.log(pRes, sResource);
			if (pRes.loadResource(pFiles[i].path)) {
				pManager._handleResourceEventOnce(pRes, SIGNAL(loaded),
					(pItem: IResourcePoolItem): void => {
						pManager._onDependencyLoad(pDep, iDepth, i, pRes);
					}
				);
			}
			else {
				this.error(new Error("could not load resource: " + pFiles[i].path));
			}
		}

		private loadImage(pDep: IDependens, i: int, iDepth?: uint): void {
			var pFiles: IDep[] = pDep.files;
			var pManager: DepsManager = this;
			var sResource: string = pFiles[i].name || pFiles[i].path;
			var pRes: IResourcePoolItem = this.getResourceManager().imagePool.findResource(sResource);

			if (pRes.loadResource(pFiles[i].path)) {
				pManager._handleResourceEventOnce(pRes, SIGNAL(loaded), (pItem: IResourcePoolItem): void => {
					pManager._onDependencyLoad(pDep, iDepth, i, pRes);
				});
			}
			else {
				this.error(new Error("could not load resource: " + pFiles[i].path));
			}
		}

		private loadDAE(pDep: IDependens, i: int, iDepth?: uint): void {
			var pFiles: IDep[] = pDep.files;
			var sResource: string = pFiles[i].name || pFiles[i].path;
			var pRes: IResourcePoolItem = this.getResourceManager().colladaPool.findResource(sResource);
			var pManager: DepsManager = this;

			if (pRes.loadResource(pFiles[i].path)) {
				pManager._handleResourceEventOnce(pRes, SIGNAL(loaded), 
					(pItem: IResourcePoolItem): void => {pManager._onDependencyLoad(pDep, iDepth, i, pRes);
				});
			}
			else {
				this.error(new Error("could not load resource: " + pFiles[i].path));
			}
		}

		private loadCustom(pDep: IDependens, i: int, iDepth?: uint): void {
			var pFiles: IDep[] = pDep.files;
			var pManager: DepsManager = this;
			var pFile: IFile = io.fopen(pFiles[i].path, "r");
			pFile.read((pErr: Error, sData: string): void => {
				if (!isNull(pErr)) {
					pManager.error(pErr);
				}
 				
 				if (isFunction(pDep.loader)) {
					pDep.loader(pDep, sData);
				}
				
				pManager._onDependencyLoad(pDep, iDepth, i, sData);
				pFile.close();
			});	
		}

		private loadJSON(pDep: IDependens, i: int, iDepth?: uint): void {
	    	var pFiles: IDep[] = pDep.files;
			var pManager: DepsManager = this;
			var pFile: IFile = io.fopen(pFiles[i].path, "rj");

			pFile.read((pErr: Error, pData: Object): void => {
				if (!isNull(pErr)) {
					pManager.error(pErr);
				}
				
				pManager._onDependencyLoad(pDep, iDepth, i, pData);
				pFile.close();
			});	
		}

		private loadBSON(pDep: IDependens, i: int, iDepth?: uint): void {
	    	var pFiles: IDep[] = pDep.files;
			var pManager: DepsManager = this;
			var pFile: IFile = io.fopen(pFiles[i].path, "rb");

			pFile.read((pErr: Error, pBuffer: ArrayBuffer): void => {
				if (!isNull(pErr)) {
					pManager.error(pErr);
				}
				
				pManager._onDependencyLoad(pDep, iDepth, i, akra.io.undump(pBuffer));
				pFile.close();
			});	
		}

		private loadDeps(pDeps: IDependens, iDepth: uint = 0): void {
			//if got empty dependency.
			if (!isArray(pDeps.files) || pDeps.files.length === 0) {
				this._onDependencyLoad(pDeps, iDepth, -1);
			}

			//walk single deps level
			this.walk({files: pDeps.files}, (pDep: IDependens, i: int, iDepth?: uint): void => {
				// console.log(pDeps);
				var sPath: string = pDeps.files[i].path;
				
				this.preload(pDeps, pDeps.files[i]);
				
				if (isDefAndNotNull(pDeps.type)) {
					if (pDeps.type == "text") {
						this.loadCustom(pDeps, i, iDepth);
					}
				}
				
				switch (path.info(sPath).ext.toLowerCase()) {
					case "ara":
						//akra resource archive
						this.loadARA(pDeps, i, iDepth);
						break;
					case "gr":
						this.loadGrammar(pDeps, i, iDepth);
						break;
					case "fx":
					case "afx":
						this.loadAFX(pDeps, i, iDepth);
						break;
					case "jpeg":
					case "jpg":
					case "png":
					case "gif":
					case "bmp":
					case "dds":
						this.loadImage(pDeps, i, iDepth);
						break;
					case "dae":
						this.loadDAE(pDeps, i, iDepth);
						break;
					case "json":
						this.loadJSON(pDeps, i, iDepth);
						break;
					case "bson":
						this.loadBSON(pDeps, i, iDepth);
						break;
					default:
						WARNING("dependence " + sPath + " unknown, and will be skipped.");
				}	

			}, iDepth);
		}

		_handleResourceEventOnce(pRsc: IResourcePoolItem, sSignal: string, fnHandler: (pItem: IResourcePoolItem) => void): void {
			var fn: (pItem: IResourcePoolItem) => void;
			
			fn = (pItem: IResourcePoolItem): void => {
				fnHandler(pItem);
				pRsc.unbind(sSignal, fn);
			}

			pRsc.bind(sSignal, fn);
		}

		_onDependencyLoad(pDeps: IDependens, iDepth: uint, n: int, pData: any = null): void {
			var pFile: IDep = null;
			if (n != -1) {
				pFile = pDeps.files[n];
				pDeps.files[n] = null;
			}

			var nRestDepsInLevel: uint = 0;
			var nLoadedDepsInLevel: uint = 0;
			var nTotalDepsInLevel: uint = 0;
			
			if (isArray(pDeps.files)) {
				for (var i: int = 0; i < pDeps.files.length; ++ i) {
					if (!isNull(pDeps.files[i])) {
						nRestDepsInLevel ++;
					}
				};

				nTotalDepsInLevel = pDeps.files.length;
				nLoadedDepsInLevel = nTotalDepsInLevel - nRestDepsInLevel;
			}

			// LOG(pDeps, "lvl: ", iDepth, "loaded", nLoadedDepsInLevel, "/", nTotalDepsInLevel);
			this.loadedDep(iDepth, nLoadedDepsInLevel, nTotalDepsInLevel, pDeps, pFile, pData);
			
			if (nRestDepsInLevel > 0) {
				return;
			}

			if (isDefAndNotNull(pDeps.deps)) {
				this.loadDeps(pDeps.deps, iDepth + 1);
			}
			else {
				this.loaded(pDeps);
			}
		}

		static findLastLevel(pDeps: IDependens) {
			var pCurr: IDependens = pDeps;

			while (isDefAndNotNull(pCurr)) {
				if (!isDefAndNotNull(pCurr.deps)) {
					return pCurr;
				}

				pCurr = pCurr.deps;
			}

			return pDeps;
		}


		static countFiles(d: IDependens): uint {
			var c: IDependens = d;
			var n: number = 0;
			
			while (isDefAndNotNull(c)) {
				n += c.files? c.files.length: 0;
				c = c.deps;
			}

			return n;
		}

		CREATE_EVENT_TABLE(DepsManager);
		BROADCAST(loaded, CALL(deps));
		BROADCAST(preload, CALL(dep, file));
		BROADCAST(depInfo, CALL(info));
		BROADCAST(loadedDep, CALL(depth, loaded, total, dep, file, data));
		// BROADCAST(error, CALL(pErr));
		
		error(pErr: Error): void {
			if (true) throw pErr;
			EMIT_BROADCAST(error, _CALL(pErr));
		}

	}

	export function createDepsManager(pEngine: IEngine): IDepsManager {
		debug_assert(isDefAndNotNull(pEngine));
		return new DepsManager(pEngine);
	}
}

#endif
