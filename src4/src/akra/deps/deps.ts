/// <reference path="../idl/IEngine.ts" />
/// <reference path="../idl/IDeps.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../path/path.ts" />
/// <reference path="../uri/uri.ts" />
/// <reference path="../io/io.ts" />
/// <reference path="../idl/3d-party/zip.d.ts" />
/// <reference path="../info/info.ts" />
/// <reference path="../conv/conv.ts" />
/// <reference path="../config/config.ts" />
/// <reference path="../crypto/md5.ts" />

module akra.deps {
	export function getLowerLevel(pDeps: IDependens) {
		var c: IDependens = pDeps;

		while (isDefAndNotNull(c)) {
			if (!isDefAndNotNull(c.deps)) {
				return c;
			}

			c = c.deps;
		}

		return c;
	}

	export function getTopLevel(pDeps: IDependens) {
		var c: IDependens = pDeps;

		while (isDefAndNotNull(c)) {
			if (!isDefAndNotNull(c.parent))
				return c;

			c = c.parent;
		}

		return c;
	}


	export function calcDepth(pDeps: IDependens): int {
		var c: IDependens = pDeps;
		var d: int = 0;

		while (isDefAndNotNull(c)) {
			d++;
			c = c.deps;
		}

		return d;
	}



	export function eachLevel(pDeps: IDependens, fn: (pDeps: IDependens, pParentDeps: IDependens) => void): void {
		var p: IDependens = pDeps.parent || null;
		var c: IDependens = pDeps;

		while (isDefAndNotNull(c)) {
			fn(c, p);
			p = c;
			c = c.deps;
		}
	}

	/**
	 * Recursive walk
	 */
	export function walk(pDeps: IDependens,
		fn: (pDeps: IDependens, i: int, iDepth: uint, pParentDeps: IDependens) => void,
		iDepth: uint = 0,
		fnEnd: Function = null,
		pParentDeps: IDependens = null
		): void {

		var pFiles: IDep[] = pDeps.files;

		if (isDefAndNotNull(pFiles)) {
			//normilize pathes to deps
			for (var i: int = 0; i < pFiles.length; ++i) {
				fn(pDeps, i, iDepth, pParentDeps);
			}
		}

		if (isDefAndNotNull(pDeps.deps)) {
			walk(pDeps.deps, fn, ++iDepth, fnEnd, pDeps);
		}
		else if (isFunction(fnEnd)) {
			fnEnd();
		}
	}


	export function each(pDeps: IDependens, fn: (pDep: IDep) => void): void {
		walk(pDeps, (pDeps: IDependens, i: int): void => {
			fn(pDeps.files[i]);
		});
	}

	/**
	 * Fill <loaded/total> fields for IDependens
	 * Fill <parent/depth> fields for IDependens
	 * Fill <index/deps> fields for IDep
	 *
	 * Fill <status> fields for IDep
	 * Make the <path> absolute for IDep
	 */
	export function normalize(pDeps: IDependens, sRoot: string = null, iDepth: int = 0): void {
		sRoot = isString(sRoot) ? sRoot : document.location.pathname;

		eachLevel(pDeps, (pDeps: IDependens, pParentDeps: IDependens): void => {
			pDeps.loaded = 0;
			pDeps.total = isArray(pDeps.files) ? pDeps.files.length : 0;

			pDeps.parent = pParentDeps;
			pDeps.depth = isNull(pParentDeps) ? iDepth : pParentDeps.depth + 1;
		});

		walk(pDeps, (pDeps: IDependens, i: int, iDepth: uint): void => {
			var pDep: IDep = pDeps.files[i];

			pDep.index = i;
			pDep.deps = pDeps;

			pDep.status = EDependenceStatuses.NOT_LOADED;
			pDep.path = uri.resolve(pDeps.files[i].path, pDeps.root || sRoot);
		})
}

	export function detectType(pDep: IDep): string {
		return pDep.type || path.parse(pDep.path).getExt() || "";
	}

	export function createResources(pEngine: IEngine, pDeps: IDependens): void {
		var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
		each(pDeps, (pDep: IDep): void => {
			var sResource: string = pDep.name || pDep.path;
			var sExt: string = detectType(pDep);

			switch (sExt.toLowerCase()) {
				case "fx":
				case "afx":
					if (!pRmgr.getEffectDataPool().findResource(sResource)) {
						pRmgr.getEffectDataPool().createResource(sResource);
					}
					break;
				case "jpg":
				case "jpeg":
				case "png":
				case "bmp":
				case "gif":
				case "dds":
					if (!pRmgr.getImagePool().findResource(sResource)) {
						pRmgr.getImagePool().createResource(sResource);
					}
					break;
				case "dae":
					if (!pRmgr.getColladaPool().findResource(sResource)) {
						pRmgr.getColladaPool().createResource(sResource);
					}
					break;
			}
		});
	}

	/** Add one dependency to another. */
	export function linkDeps(pParent: IDependens, pChild: IDependens): void {
		pParent = getLowerLevel(pParent);
		pParent.deps = pChild;

		eachLevel(getTopLevel(pParent), (pDeps: IDependens, pParentDeps: IDependens) => {
			pDeps.depth = isNull(pParentDeps) ? 0 : pParentDeps.depth + 1;
			pDeps.parent = pParentDeps;
		});
	}


	function updateStatus(pDep: IDep, eStatus: EDependenceStatuses): void {
		pDep.status = eStatus;

		if (eStatus === EDependenceStatuses.LOADED) {
			pDep.deps.loaded++;
		}
	}

	function handleResourceEventOnce(
		pRsc: IResourcePoolItem,
		sSignal: string,
		fnHandler: (pItem: IResourcePoolItem) => void): void {

		var fn = (pItem: IResourcePoolItem): void => {
			fnHandler(pItem);
			pRsc.loaded.disconnect(fn);
		}

	    pRsc.loaded.connect(fn);
	}

	export function loadMap(
		pEngine: IEngine,
		pDep: IDep,
		fnLoaded: (e: Error, pDep: IDep) => void,
		fnChanged: (pDep: IDep, pProgress: any) => void): void {

		var pFile: IFile = io.fopen(pDep.path, "rj");

		pFile.read((pErr: Error, pMap: IDependens): void => {
			if (!isNull(pErr)) {
				fnLoaded(pErr, null);
			}

			pFile.close();

			var pCurrDeps: IDependens = pDep.deps;
			var pNextDeps: IDependens = pCurrDeps.deps;

			normalize(pMap, pDep.path, pCurrDeps.depth + 1);
			createResources(pEngine, pMap);

			var iMapDepth: int = calcDepth(pMap);

			pCurrDeps.deps = null;

			linkDeps(pCurrDeps, pMap);
			linkDeps(pCurrDeps, pNextDeps);

			updateStatus(pDep, EDependenceStatuses.LOADED);
			fnLoaded(null, pDep);
		});
	}

	export function loadGrammar(
		pEngine: IEngine,
		pDep: IDep,
		fnLoaded: (e: Error, pDep: IDep) => void,
		fnChanged: (pDep: IDep, pProgress: any) => void): void {

		var pGrammar: IFile = io.fopen(pDep.path, "r");

		pGrammar.read((e: Error, sData: string): void => {
			if (!isNull(e)) {
				fnLoaded(e, null);
			}
			//WARNING: only for HLSL grammar files.
			fx.initAFXParser(sData);

			pGrammar.close();

			updateStatus(pDep, EDependenceStatuses.LOADED);
			fnLoaded(null, pDep);
		});
	}

	function loadFromPool(
		pPool: IResourcePool<IResourcePoolItem>,
		pDep: IDep,
		fnLoaded: (e: Error, pDep: IDep) => void,
		fnChanged: (pDep: IDep, pProgress: any) => void): void {

		var sResource: string = pDep.name || pDep.path;
		var pRes: IResourcePoolItem = pPool.findResource(sResource);

		if (pRes.loadResource(pDep.path)) {
			handleResourceEventOnce(pRes, "loaded", (pItem: IResourcePoolItem): void => {
				updateStatus(pDep, EDependenceStatuses.LOADED);
				fnLoaded(null, pDep);
			});
		}
		else {
			fnLoaded(new Error("could not load resource: " + pDep.path), null);
		}
	}

	export function loadAFX(
		pEngine: IEngine,
		pDep: IDep,
		fnLoaded: (e: Error, pDep: IDep) => void,
		fnChanged: (pDep: IDep, pProgress: any) => void): void {
		loadFromPool(pEngine.getResourceManager().getEffectDataPool(), pDep, fnLoaded, fnChanged);
	}

	export function loadImage(
		pEngine: IEngine,
		pDep: IDep,
		fnLoaded: (e: Error, pDep: IDep) => void,
		fnChanged: (pDep: IDep, pProgress: any) => void): void {

		loadFromPool(pEngine.getResourceManager().getImagePool(), pDep, fnLoaded, fnChanged);
	}

	export function loadDAE(
		pEngine: IEngine,
		pDep: IDep,
		fnLoaded: (e: Error, pDep: IDep) => void,
		fnChanged: (pDep: IDep, pProgress: any) => void): void {

		loadFromPool(pEngine.getResourceManager().getColladaPool(), pDep, fnLoaded, fnChanged);
	}

	export function loadCustom(
		pEngine: IEngine,
		pDep: IDep,
		fnLoaded: (e: Error, pDep: IDep) => void,
		fnChanged: (pDep: IDep, pProgress: any) => void): void {

		var pFile: IFile = io.fopen(pDep.path, "r");

		pFile.read((pErr: Error, sData: string): void => {
			if (!isNull(pErr)) {
				fnLoaded(pErr, null);
			}

			pFile.close();

			//content will be added into dependen desc.
			pDep.content = sData;

			updateStatus(pDep, EDependenceStatuses.LOADED);
			fnLoaded(null, pDep);
		});
	}

	export function loadJSON(
		pEngine: IEngine,
		pDep: IDep,
		fnLoaded: (e: Error, pDep: IDep) => void,
		fnChanged: (pDep: IDep, pProgress: any) => void): void {

		var pFile: IFile = io.fopen(pDep.path, "rj");

		pFile.read((pErr: Error, pData: Object): void => {
			if (!isNull(pErr)) {
				fnLoaded(pErr, null);
			}

			pFile.close();
			pDep.content = pData;
			updateStatus(pDep, EDependenceStatuses.LOADED);
			fnLoaded(null, pDep);
		});
	}

	export function loadBSON(
		pEngine: IEngine,
		pDep: IDep,
		fnLoaded: (e: Error, pDep: IDep) => void,
		fnChanged: (pDep: IDep, pProgress: any) => void): void {

		var pFile: IFile = io.fopen(pDep.path, "rb");

		pFile.read((pErr: Error, pBuffer: ArrayBuffer): void => {
			if (!isNull(pErr)) {
				fnLoaded(pErr, null);
			}

			pFile.close();
			pDep.content = io.undump(pBuffer);

			updateStatus(pDep, EDependenceStatuses.LOADED);
			fnLoaded(null, pDep);
		});
	}

	//load ARA

	/** @const */
	var ARA_INDEX = config.deps.archiveIndex || ".map";
	/** @const */
	var ETAG_FILE = config.deps.etag.file || ".etag";
	var FORCE_ETAG_CHECKING: boolean = config.deps.etag.forceCheck || false;

	function forceExtractARADependence(pEntry: ZipEntry, sPath: string, fnCallback: Function): void {
		// console.log("forceExtractARADependence(", pEntry.filename, ")");

		pEntry.getData(new zip.ArrayBufferWriter(), (data: ArrayBuffer): void => {
			var pCopy: IFile = io.fopen(sPath, "w+b");

			pCopy.write(data, (e: Error) => {
				if (e) throw e;

				logger.log("unpacked to local filesystem: ", pEntry.filename);
				// alert("unpacked to local filesystem: " + pEntry.filename);

				var pCrc32: IFile = io.fopen(sPath + ".crc32", "w+");
				pCrc32.write(String(pEntry.crc32), (e: Error) => {
					if (e) throw e;
					fnCallback(sPath);
					pCrc32.close();
				});

				pCopy.close();
			});
		});
	}

	function createARADLocalName(sFilename: string, sEntry: string): string {
		return "filesystem:" + info.uri.getScheme() + "//" + info.uri.getHost() + "/temporary/" + sEntry + "/" + sFilename;
	}

	function extractARADependence(pEntry: ZipEntry, sHash: string, fnCallback: Function): void {
		var sPath: string = createARADLocalName(pEntry.filename, sHash);
		var pCRC32File: IFile = io.fopen(sPath + ".crc32", "r");

		pCRC32File.isExists((e: Error, bExists: boolean) => {
			if (bExists) {
				pCRC32File.read((e: Error, data: string) => {
					if (parseInt(data) === pEntry.crc32) {
						console.log("skip unpacking for dep.: ", sPath);
						fnCallback(sPath);
					}
					else {
						forceExtractARADependence(pEntry, sPath, fnCallback);
					}

					pCRC32File.close();
				});

				return;
			}

			forceExtractARADependence(pEntry, sPath, fnCallback);
		});
	}

	export function loadARA(
		pEngine: IEngine,
		pArchiveDep: IDep,
		fnLoaded: (e: Error, pDep: IDep) => void,
		fnChanged: (pDep: IDep, pProgress: any) => void): void {

		var sArchivePath: string = pArchiveDep.path;
		//hash is required to create a unique path for the local file system
		//FIXME: md5 to slow for data URI files...
		var sArchiveHash: string = crypto.md5(sArchivePath);
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

			pUri = uri.parseDataURI(sArchivePath);
			logger.presume(pUri.base64, "only base64 decoded ARA resources supported.", sArchivePath);
			sBase64Data = pUri.data;
		}
		else {
			pArchive = io.fopen(sArchivePath, "rb");
		}



		updateStatus(pArchiveDep, EDependenceStatuses.CHECKING);
		fnChanged(pArchiveDep, null);

		var fnArchiveLoaded = (pARADeps: IDependens): void => {
			linkDeps(pPrimaryDep, pARADeps);

			createResources(pEngine, pARADeps);
			updateStatus(pArchiveDep, EDependenceStatuses.LOADED);
			fnLoaded(null, pArchiveDep);
		}

	var fnLoadArchive = (): void => {
			updateStatus(pArchiveDep, EDependenceStatuses.LOADING);
			fnChanged(pArchiveDep, null);

			var fnZipReadedCallback = (pZipReader: ZipReader): void => {
				pZipReader.getEntries((pEntries: ZipEntry[]): void => {

					var pEntryMap: { [path: string]: ZipEntry; } = {};
					var nTotal: uint = 0;
					var nUnpacked: uint = 0;

					for (var i: int = 0; i < pEntries.length; ++i) {
						if (pEntries[i].directory) continue;
						pEntryMap[pEntries[i].filename] = pEntries[i];
						nTotal++;
					}

					var pMapEntry: ZipEntry = pEntryMap[ARA_INDEX];

					logger.assert(isDefAndNotNull(pMapEntry), "ARA dependences found, but headers corrupted.");

					pMapEntry.getData(new zip.TextWriter(), (data: string): void => {
						var pARADeps: IDependens = <IDependens>JSON.parse(data);

						var fnSuccesss: Function = (sLocalPath: string): void => {
							nUnpacked++;

							updateStatus(pArchiveDep, EDependenceStatuses.UNPACKING);
							fnChanged(pArchiveDep, { loaded: nUnpacked, total: nTotal });

							if (nUnpacked < nTotal) {
								return;
							}

							logger.log("ARA dependences successfully loaded: ", sArchivePath);

							pZipReader.close();
							//id data-uri used, archive is null
							pArchive && pArchive.close();

							fnArchiveLoaded(pARADeps);
						};

						normalize(pARADeps, "");
						each(pARADeps, (pDep: IDep): void => {
							var sPath: string = pDep.path;
							var pEntry: ZipEntry = pEntryMap[sPath];

							logger.assert(isDefAndNotNull(pEntry), "Cannot resolve ARA dependence: " + sPath);
							delete pEntryMap[sPath];

							extractARADependence(pEntry, sArchiveHash, (sLocalPath: string): void => {
								pDep.path = sLocalPath;
								fnSuccesss(sLocalPath);
							});
						});

						for (var sPath in pEntryMap) {
							extractARADependence(pEntryMap[sPath], sArchiveHash, fnSuccesss);
						}
					});
				});
			};

			var fnDataURIReaded = (sBase64Data: string): void => {
				updateStatus(pArchiveDep, EDependenceStatuses.UNPACKING);
				fnChanged(pArchiveDep, null);

				zip.createReader(new zip.Data64URIReader(sBase64Data),
					fnZipReadedCallback, (err: Error): void => {
						console.log(err);
					});
			}


		var fnArchiveReadedCallback = (err: Error, pData: ArrayBuffer): void => {
				updateStatus(pArchiveDep, EDependenceStatuses.UNPACKING);
				fnChanged(pArchiveDep, null);

				zip.createReader(new zip.ArrayBufferReader(pData),
					fnZipReadedCallback, (err: Error): void => {
						console.log(err);
					});
			}

		if (pArchive) {
				pArchive.read(fnArchiveReadedCallback, (nLoaded: uint, nTotal: uint): void => {
					updateStatus(pArchiveDep, EDependenceStatuses.LOADING);
					fnChanged(pArchiveDep, { loaded: nLoaded, total: nTotal });
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
					var pETag: IFile = io.fopen(createARADLocalName(ETAG_FILE, sArchiveHash), "r+");

					pETag.read((e: Error, sETag: string) => {
						if (!isNull(e) || !isString(pMeta.eTag) || sETag !== pMeta.eTag) {
							if (config.DEBUG) {
								logger.log(sArchivePath, "ETAG not verified.", pMeta.eTag);
							}

							if (isDefAndNotNull(pMeta.eTag)) {
								pETag.write(pMeta.eTag);
							}

							fnLoadArchive();
							return;
						}

						if (config.DEBUG) {
							logger.log(sArchivePath, "ETAG verified successfully!", sETag);
						}

						io.fopen(createARADLocalName(ARA_INDEX, sArchiveHash), "rj").read((e: Error, pMap: IDependens): void => {
							normalize(pMap, "");
							each(pMap, (pDep: IDep): void => {
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


	export function loadDependences(
		pEngine: IEngine,
		pDeps: IDependens,
		fnLoaded: (e: Error, pDeps: IDependens) => void,
		fnChanged: (pDep: IDep, pProgress: any) => void): void {

		//if got empty dependency.
		if (!isArray(pDeps.files) || pDeps.files.length === 0) {
			if (isDefAndNotNull(pDeps.deps)) {
				loadDependences(pEngine, pDeps.deps, fnLoaded, fnChanged);
			}
			else {
				//deps with out subdeps and files
				fnLoaded(null, pDeps);
			}
		}

		//walk single deps level
		each({ files: pDeps.files }, (pDep: IDep): void => {
			//pDep.status = EDependenceStatuses.LOADING;
			//this.changeDepStatus(pDep);
			updateStatus(pDep, EDependenceStatuses.LOADING);
			fnChanged(pDep, null);

			var sExt: string = detectType(pDep);

			switch (sExt.toLowerCase()) {
				case "ara":
					//akra resource archive
					loadARA(pEngine, pDep, fnLoaded, fnChanged);
					break;
				case "gr":
					loadGrammar(pEngine, pDep, fnLoaded, fnChanged);
					break;
				case "fx":
				case "afx":
					loadAFX(pEngine, pDep, fnLoaded, fnChanged);
					break;
				case "jpeg":
				case "jpg":
				case "png":
				case "gif":
				case "bmp":
				case "dds":
					loadImage(pEngine, pDep, fnLoaded, fnChanged);
					break;
				case "dae":
					loadDAE(pEngine, pDep, fnLoaded, fnChanged);
					break;
				case "json":
					loadJSON(pEngine, pDep, fnLoaded, fnChanged);
					break;
				case "bson":
					loadBSON(pEngine, pDep, fnLoaded, fnChanged);
					break;
				case "txt":
					loadCustom(pEngine, pDep, fnLoaded, fnChanged);
					break;
				case "map":
					loadMap(pEngine, pDep, fnLoaded, fnChanged);
					break;
				default:
					logger.warn("dependence " + pDep.path + " unknown, and will be skipped.");
			}
		});
	}

	/**
	 * @param pEngine Engine instance.
	 * @param pDeps Dependencies list.
	 * @param sRoot Default root path for loading resources. (config.data for ex.)
	 * @param fnLoaded All loaded?
	 * @param fnStatusChanged
	 */
	export function load(
		pEngine: IEngine,
		pDeps: IDependens,
		sRoot: string,
		fnLoaded: (e: Error, pDeps: IDependens) => void,
		fnChanged: (pDep: IDep, pProgress: any) => void
		): void {

		normalize(pDeps, pDeps.root || sRoot);
		createResources(pEngine, pDeps);

		function dependacyLoaded(e: Error, pDep: IDep): void {
			//get dependencies, contained dep
			var pDeps: IDependens = pDep.deps;

			if (pDeps.loaded < pDeps.total) {
				return;
			}

			if (isDefAndNotNull(pDeps.deps)) {
				loadDependences(pEngine, pDeps.deps, dependacyLoaded, fnChanged);
			}
			else {
				fnLoaded(null, pDeps);
			}
		}

		loadDependences(pEngine, pDeps,
			dependacyLoaded,
			fnChanged);
	}

}