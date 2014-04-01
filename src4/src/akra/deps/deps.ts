/// <reference path="../idl/3d-party/es6-promises.d.ts" />
/// <reference path="../idl/3d-party/zip.d.ts" />

/// <reference path="../idl/IEngine.ts" />
/// <reference path="../idl/IDeps.ts" />
/// <reference path="../idl/EIO.ts" />

/// <reference path="../logger.ts" />
/// <reference path="../path/path.ts" />
/// <reference path="../uri/uri.ts" />
/// <reference path="../io/io.ts" />
/// <reference path="../info/info.ts" />
/// <reference path="../conv/conv.ts" />
/// <reference path="../config/config.ts" />
/// <reference path="../crypto/md5.ts" />

module akra.deps {

	//var EXTENSIONS = {
	//	ARA: EIO.IN | EIO.BIN,
	//	JPEG: EIO.IN | EIO.BIN,
	//	JPG: EIO.IN | EIO.BIN,
	//	PNG: EIO.IN | EIO.BIN,
	//	GIF: EIO.IN | EIO.BIN,
	//	BMP: EIO.IN | EIO.BIN,
	//	DDS: EIO.IN | EIO.BIN,
	//	BSON: EIO.IN | EIO.BIN,

	//	GR: EIO.IN,
	//	FX: EIO.IN,
	//	AFX: EIO.IN,
	//	DAE: EIO.IN,
	//	JSON: EIO.IN | EIO.JSON,
	//	TXT: EIO.IN,
	//	MAP: EIO.IN | EIO.JSON
	//};

	interface IDepEngine {
		type: string;
		poolSelector: (pRsmgr: IResourcePoolManager) => IResourcePool<any>;
		handler: IDepHandler;
	}

	var pRegistredDeps: { [type: string]: IDepEngine; } = <any>{};


	/**
	 * @param sType Resource string type.
	 * @param isResource Is the resource dependence?
	 */
	export function addDependenceHandler(
		pTypes: string[],
		fnPoolSelector: (pRsmgr: IResourcePoolManager) => IResourcePool<any>,
		fnHandler: IDepHandler): void {
		for (var i = 0; i < pTypes.length; ++i) {
			var sType: string = pTypes[i].toLowerCase();
			pRegistredDeps[sType] = { type: sType, poolSelector: fnPoolSelector || null, handler: fnHandler };
		}
	}

	function findDepHandler(pDep: IDep): IDepEngine {
		var sExt: string = getType(pDep);
		var pDepEngine: IDepEngine = pRegistredDeps[sExt];
		return pDepEngine || null;
	}

	/** Get lowest level of deps. */
	export function getLowestLevel(pDeps: IDependens) {
		var c: IDependens = pDeps;

		while (isDefAndNotNull(c)) {
			if (!isDefAndNotNull(c.deps)) {
				return c;
			}

			c = c.deps;
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
		var p: IDependens = null;
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

	function countFilesOnLevel(pDeps: IDependens): uint {
		return isArray(pDeps.files) ? pDeps.files.length : 0;
	}


	function findNotEmptyLevel(pDeps: IDependens): IDependens {
		if (!isDefAndNotNull(pDeps)) {
			return null;
		}

		if (!countFilesOnLevel(pDeps)) {
			return findNotEmptyLevel(pDeps.deps);
		}

		return pDeps;
	}

	export function countFiles(pDeps: IDependens): uint {
		var iTotal: uint = 0;

		eachLevel(pDeps, (pDeps: IDependens) => {
			iTotal += countFilesOnLevel(pDeps);
		});

		return iTotal;
	}

	/**
	 * Make the <path> absolute for IDep
	 */
	export function normalize(pDeps: IDependens, sRoot: string = null, iDepth: int = 0): void {
		sRoot = isString(sRoot) ? sRoot : uri.here().toString();

		walk(pDeps, (pDeps: IDependens, i: int, iDepth: uint): void => {
			var pDep: IDep = pDeps.files[i];
			pDep.path = uri.resolve(pDeps.files[i].path, pDeps.root || sRoot);
		});
	}

	export function getType(pDep: IDep): string {
		return (pDep.type || path.parse(pDep.path).getExt() || "").toLowerCase();
	}

	function computeProperties(pDeps: IDependens, cb: (e: Error, iLength: uint) => void): void {
		var pAll: Promise<uint>[] = [];

		each(pDeps, (pDep: IDep): void => {
			pAll.push(new Promise<uint>((fnResolve: (iSize: uint) => void, fnReject: (e: Error) => void) => {
				var fnSuccess = (iSize: uint) => {
					var pStats: IDepStats = {
						status: EDependenceStatuses.PENDING,
						byteLength: iSize,
						bytesLoaded: 0,
						unpacked: 0.
					};

					pDep.stats = pStats;

					fnResolve(pStats.byteLength);
				};

				if (uri.parse(pDep.path).getScheme() === "data:") {
					setTimeout(fnSuccess, 1, uri.parseDataURI(pDep.path).data.length);
					return;
				}

				io.fopen(pDep.path).open((e: Error, pMeta: IFileMeta) => {
					if (e) {
						return fnReject(e);
					}

					if (!pMeta.size) {
						return fnReject(new Error("could not determ byte length of " + pDep.path));
					}

					fnSuccess(pMeta.size);
				});
			}));
		});

		Promise.all<uint>(pAll).then((pValues: uint[]): void => {
			cb(null, pValues.reduce((a, b) => { return parseInt(<any>a) + parseInt(<any>b); }));
		}, <any>cb);
	}

	function createResources(pEngine: IEngine, pDeps: IDependens): void {
		var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
		each(pDeps, (pDep: IDep): void => {
			var sResource: string = pDep.name || pDep.path;
			var pDepEngine: IDepEngine = findDepHandler(pDep);

			if (!isDefAndNotNull(pDepEngine) || isNull(pDepEngine.poolSelector)) {
				return null;
			}

			var pPool: IResourcePool<any> = pDepEngine.poolSelector(pRmgr);

			if (!pPool.findResource(sResource)) {
				pPool.createResource(sResource);
			}
		});
	}


	// Resource item 'loaded' event callback.
	function handleResourceEventOnce(
		pRsc: IResourcePoolItem,
		sSignal: string,
		fnHandler: (pItem: IResourcePoolItem) => void): void {
		//TODO: collect loading error from resource.
		var fn = (pItem: IResourcePoolItem): void => {
			fnHandler(pItem);
			pRsc.loaded.disconnect(fn);
		}

	    pRsc.loaded.connect(fn);
	}


	function loadFromPool(
		pPool: IResourcePool<IResourcePoolItem>,
		pDep: IDep,
		cb: (pDep: IDep, eStatus: EDependenceStatuses, pData?: any) => void): void {

		var sResource: string = pDep.name || pDep.path;
		var pRes: IResourcePoolItem = pPool.findResource(sResource);

		cb(pDep, EDependenceStatuses.LOADING);

		handleResourceEventOnce(pRes, "loaded", (pItem: IResourcePoolItem): void => {
			cb(pDep, EDependenceStatuses.LOADED, pRes);
		});

		if (!pRes.loadResource(pDep.path)) {
			cb(pDep, EDependenceStatuses.REJECTED, new Error("could not load resource: " + pDep.path));
		}
	}

	export function loadResource(
		pEngine: IEngine,
		pDep: IDep,
		cb: (pDep: IDep, eStatus: EDependenceStatuses, pData?: any) => void): void {
			loadFromPool(findDepHandler(pDep).poolSelector(pEngine.getResourceManager()), pDep, cb);
	}

	//redirect events from load() function to cb() of custom dep. 
	function redirectProgress(pDep: IDep, cb: (pDep: IDep, eStatus: EDependenceStatuses, pData?: any) => void): (e: IDepEvent) => void {
		return (e: IDepEvent): void => {
			switch (e.source.stats.status) {
				case EDependenceStatuses.CHECKING:
					return cb(pDep, EDependenceStatuses.CHECKING);
				case EDependenceStatuses.UNPACKING:
				case EDependenceStatuses.EXTRACTION:
					return cb(pDep, EDependenceStatuses.UNPACKING, e.unpacked);
				case EDependenceStatuses.DOWNLOADING:
					return cb(pDep, EDependenceStatuses.DOWNLOADING, { loaded: e.bytesLoaded, total: e.bytesTotal });
			}
		}
	}

	export function loadMap(
		pEngine: IEngine,
		pDep: IDep,
		cb: (pDep: IDep, eStatus: EDependenceStatuses, pData?: any) => void): void {

		var pFile: IFile = io.fopen(pDep.path, EIO.IN | EIO.JSON);

		cb(pDep, EDependenceStatuses.LOADING, null);

		pFile.read((e: Error, pMap: IDependens): void => {
			pFile.close();

			if (!isNull(e)) {
				return cb(pDep, EDependenceStatuses.REJECTED, e);
			}


			load(pEngine, pMap, pDep.path,
				(e: Error): void => {
					if (e) {
						return cb(pDep, EDependenceStatuses.REJECTED, e);
					}

					cb(pDep, EDependenceStatuses.LOADED, pMap);
				},
				redirectProgress(pDep, cb));
		});
	}

	export function loadGrammar(
		pEngine: IEngine,
		pDep: IDep,
		cb: (pDep: IDep, eStatus: EDependenceStatuses, pData?: any) => void): void {

		var pGrammar: IFile = io.fopen(pDep.path);

		cb(pDep, EDependenceStatuses.LOADING);

		pGrammar.read((e: Error, sData: string): void => {
			pGrammar.close();

			if (!isNull(e)) {
				return cb(pDep, EDependenceStatuses.REJECTED, e);
			}

			//WARNING: only for HLSL grammar files.
			fx.initAFXParser(sData);

			cb(pDep, EDependenceStatuses.LOADED, sData);
		});
	}


	export function loadCustom(
		pEngine: IEngine,
		pDep: IDep,
		cb: (pDep: IDep, eStatus: EDependenceStatuses, pData?: any) => void): void {

		var pFile: IFile = io.fopen(pDep.path);

		cb(pDep, EDependenceStatuses.LOADING);

		pFile.read((pErr: Error, sData: string): void => {
			pFile.close();

			if (!isNull(pErr)) {
				return cb(pDep, EDependenceStatuses.REJECTED, pErr);
			}

			cb(pDep, EDependenceStatuses.LOADED, sData);
		});
	}

	export function loadJSON(
		pEngine: IEngine,
		pDep: IDep,
		cb: (pDep: IDep, eStatus: EDependenceStatuses, pData?: any) => void): void {

		var pFile: IFile = io.fopen(pDep.path, EIO.IN | EIO.JSON);

		cb(pDep, EDependenceStatuses.LOADING);

		pFile.read((pErr: Error, pData: Object): void => {
			pFile.close();

			if (!isNull(pErr)) {
				return cb(pDep, EDependenceStatuses.REJECTED, pErr);
			}

			cb(pDep, EDependenceStatuses.LOADED, pData);
		});
	}

	export function loadBSON(
		pEngine: IEngine,
		pDep: IDep,
		cb: (pDep: IDep, eStatus: EDependenceStatuses, pData?: any) => void): void {

		var pFile: IFile = io.fopen(pDep.path, EIO.IN | EIO.BINARY);

		cb(pDep, EDependenceStatuses.LOADING);

		pFile.read((pErr: Error, pBuffer: ArrayBuffer): void => {
			pFile.close();

			if (!isNull(pErr)) {
				return cb(pDep, EDependenceStatuses.REJECTED, pErr);
			}

			cb(pDep, EDependenceStatuses.LOADED, io.undump(pBuffer));
		});
	}

	//load ARA

	/** @const */
	var ARA_INDEX = config.deps.archiveIndex || ".map";
	/** @const */
	var ETAG_FILE = config.deps.etag.file || ".etag";
	/** @const */
	var FORCE_ETAG_CHECKING: boolean = config.deps.etag.forceCheck || false;

	function forceExtractARADependence(pEntry: ZipEntry, sPath: string, cb: (e: Error, sPath: string) => void): void {
		pEntry.getData(new zip.ArrayBufferWriter(), (pData: ArrayBuffer): void => {
			var pCopy: IFile = io.fopen(sPath, EIO.IN | EIO.OUT | EIO.TRUNC | EIO.BIN);

			pCopy.write(pData, (e: Error) => {
				if (e) {
					return cb(e, null);
				}

				debug.log("Unpacked to local filesystem " + pEntry.filename + ".");

				var pCrc32: IFile = io.fopen(sPath + ".crc32", EIO.IN | EIO.OUT | EIO.TRUNC);
				pCrc32.write(String(pEntry.crc32), (e: Error) => {
					cb(e, sPath);
					pCrc32.close();
				});

				pCopy.close();
			});
		});
	}

	function createARADLocalName(sFilename: string, sEntry: string): string {
		return "filesystem:" + info.uri.getScheme() + "//" + info.uri.getHost() + "/temporary/" + sEntry + "/" + sFilename;
	}

	function extractARADependence(pEntry: ZipEntry, sHash: string, cb: (e: Error, sPath: string) => void): void {
		var sPath: string = createARADLocalName(pEntry.filename, sHash);
		var pCRC32File: IFile = io.fopen(sPath + ".crc32");

		pCRC32File.isExists((e: Error, bExists: boolean) => {
			if (e) {
				return cb(e, null);
			}

			if (bExists) {
				pCRC32File.read((e: Error, data: string) => {
					if (parseInt(data) === pEntry.crc32) {
						debug.log("Skip unpacking for " + sPath + ".");
						cb(null, sPath);
					}
					else {
						forceExtractARADependence(pEntry, sPath, cb);
					}

					pCRC32File.close();
				});

				return;
			}

			forceExtractARADependence(pEntry, sPath, cb);
		});
	}

	export function loadARA(
		pEngine: IEngine,
		pArchiveDep: IDep,
		cb: (pDep: IDep, eStatus: EDependenceStatuses, pData?: any) => void): void {

		var sArchivePath: string = pArchiveDep.path;
		//hash is required to create a unique path for the local file system
		//FIXME: md5 to slow for data URI files...
		var sArchiveHash: string = crypto.md5(sArchivePath);
		var pArchive: IFile = null;
		//binary data obtained immediately from the DATA URI
		var pUri: IDataURI = null;
		var sBase64Data: string = null;

		if (uri.parse(sArchivePath).getScheme() === "data:") {
			//data URI required cross-origin policy, and cannot be loaded with XMLHTTPRequest :(
			pUri = uri.parseDataURI(sArchivePath);

			logger.assert(pUri.base64, "only base64 decoded ARA resources supported.", sArchivePath);
			sBase64Data = pUri.data;
		}
		else {
			pArchive = io.fopen(sArchivePath, EIO.IN | EIO.BIN);
		}

		cb(pArchiveDep, EDependenceStatuses.CHECKING);

		/**
		 * @param pARADeps Deps formed from archive.
		 */
		var fnArchiveLoaded = (pARADeps: IDependens): void => {
			load(pEngine, pARADeps, null, (e: Error) => {
				if (e) {
					return cb(pArchiveDep, EDependenceStatuses.REJECTED, e);
				}

				cb(pArchiveDep, EDependenceStatuses.LOADED, null);
			}, redirectProgress(pArchiveDep, cb));
		};

		var fnLoadArchive = (): void => {
			cb(pArchiveDep, EDependenceStatuses.LOADING);

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

						var fnSuccesss = (e: Error, sLocalPath: string): void => {
							if (e) {
								return cb(pArchiveDep, EDependenceStatuses.REJECTED, e);
							}

							nUnpacked++;

							cb(pArchiveDep, EDependenceStatuses.EXTRACTION, { loaded: nUnpacked, total: nTotal });

							// All .map dependencies unpacked??
							if (nUnpacked < nTotal) {
								return;
							}

							logger.info("%cDependences loaded: ", "color: green;", sArchivePath);

							pZipReader.close();
							//id data-uri used, archive is null
							pArchive && pArchive.close();

							fnArchiveLoaded(pARADeps);
						};

						normalize(pARADeps, "");
						each(pARADeps, (pDep: IDep): void => {
							var sPath: string = pDep.path;
							var pEntry: ZipEntry = pEntryMap[sPath];

							logger.assert(isDefAndNotNull(pEntry), "Cannot resolve dependence: " + sPath);
							delete pEntryMap[sPath];

							extractARADependence(pEntry, sArchiveHash,
								(e: Error, sLocalPath: string): void => {
									pDep.path = sLocalPath;
									fnSuccesss(e, sLocalPath);
								});
						});

						for (var sPath in pEntryMap) {
							extractARADependence(pEntryMap[sPath], sArchiveHash, fnSuccesss);
						}
					});
				});
			};

			var fnDataURIReaded = (sBase64Data: string): void => {
				cb(pArchiveDep, EDependenceStatuses.UNPACKING, 0.);

				zip.createReader(new zip.Data64URIReader(sBase64Data),
					fnZipReadedCallback, (e: Error): void => {
						cb(pArchiveDep, EDependenceStatuses.REJECTED, e);
					});
			};


			var fnArchiveReadedCallback = (e: Error, pData: ArrayBuffer): void => {
				if (e) {
					return cb(pArchiveDep, EDependenceStatuses.REJECTED, e);
				}

				cb(pArchiveDep, EDependenceStatuses.UNPACKING, 0.);

				zip.createReader(new zip.ArrayBufferReader(pData),
					fnZipReadedCallback, (e: Error): void => {
						cb(pArchiveDep, EDependenceStatuses.REJECTED, e);
					});
			};

			if (pArchive) {
				pArchive.read(fnArchiveReadedCallback, (nLoaded: uint, nTotal: uint): void => {
					cb(pArchiveDep, EDependenceStatuses.DOWNLOADING, { loaded: nLoaded, total: nTotal });
				});
			}
			else {
				cb(pArchiveDep, EDependenceStatuses.DOWNLOADING, { loaded: sBase64Data.length, total: sBase64Data.length });
				fnDataURIReaded(sBase64Data);
			}
		}

	if (!isNull(pArchive)) {
			//non data-uri cases
			pArchive.open((err: Error, pMeta: IFileMeta): void => {
				if (FORCE_ETAG_CHECKING) {
					var pETag: IFile = io.fopen(createARADLocalName(ETAG_FILE, sArchiveHash), EIO.IN | EIO.OUT);

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

						debug.log(sArchivePath, "ETAG verified successfully!", sETag);

						io.fopen(createARADLocalName(ARA_INDEX, sArchiveHash), EIO.IN | EIO.JSON).read((e: Error, pMap: IDependens): void => {
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


	function loadDependencesLevel(
		pEngine: IEngine,
		pDeps: IDependens,
		fnDep: (pDep: IDep, eStatus: EDependenceStatuses, pData?: any) => void): void {

		var cb = fnDep;

		//walk single deps level
		each({ files: pDeps.files }, (pDep: IDep): void => {
			cb(pDep, EDependenceStatuses.INITIALIZATION, null);
			var pDepEngine: IDepEngine = findDepHandler(pDep);

			if (!isDefAndNotNull(pDepEngine)) {
				logger.warn("dependence " + pDep.path + " unknown, and will be skipped.");
				return;
			}

			pDepEngine.handler(pEngine, pDep, cb);
		});
	}

	addDependenceHandler(["ara"], null, loadARA);
	addDependenceHandler(["gr"], null, loadGrammar);
	addDependenceHandler(["fx", "afx"],
		(pRmgr: IResourcePoolManager) => pRmgr.getEffectDataPool(), loadResource);
	addDependenceHandler(["jpeg", "jpg", "png", "gif", "bmp", "dds"],
		(pRmgr: IResourcePoolManager) => pRmgr.getImagePool(), loadResource);
	addDependenceHandler(["dae"], (pRmgr: IResourcePoolManager) => pRmgr.getColladaPool(), loadResource);
	addDependenceHandler(["obj"], (pRmgr: IResourcePoolManager) => pRmgr.getObjPool(), loadResource);
	addDependenceHandler(["json"], null, loadJSON);
	addDependenceHandler(["bson"], null, loadBSON);
	addDependenceHandler(["txt"], null, loadCustom);
	addDependenceHandler(["map"], null, loadMap);

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
		fnProgress: (e: IDepEvent) => void = (e): void => { }
		): void {

		normalize(pDeps, pDeps.root || sRoot);
		createResources(pEngine, pDeps);

		var pDepsPointer: IDependens = findNotEmptyLevel(pDeps);

		var nTotalFiles: uint = countFiles(pDeps);
		var iBeginTime: uint = time();

		var pProgress: IDepEvent = {
			source: null,
			unpacked: 0,
			time: 0,
			loaded: 0,
			total: 0,
			bytesLoaded: 0,
			bytesTotal: 0,
		};


		computeProperties(pDepsPointer, (e: Error, iBytesTotal: uint) => {
			if (e) return fnLoaded(e, pDeps);

			if (isNull(pDeps)) {
				return fnLoaded(null, pDeps);
			}

			function countLoadedOnLevel(pDeps: IDependens): uint {
				var n: uint = 0;
				each({ files: pDeps.files }, (pDep: IDep) => {
					if (pDep.stats.status === EDependenceStatuses.LOADED) {
						n++;
					}
				});

				return n;
			}

			/** @param pDep Dependence, which generates change in progress. */
			function notifyProgress(pDep: IDep): void {
				var nDeps: uint = 0;
				var nLoadedOnLevel: uint = countLoadedOnLevel(pDeps);
				var nLoaded: uint = 0;
				var fUnpacked: uint = 0;
				var iBytesLoaded: uint = 0;
				var iBytesTotal: uint = 0;
				var eStatus: EDependenceStatuses = pDep.stats.status;

				each(pDeps, (pDep: IDep) => {
					var pStats: IDepStats = pDep.stats;
					iBytesLoaded += pStats.bytesLoaded;
					fUnpacked += (pStats.unpacked || 0.) * /*pStats.byteLength*/ 1.;
					iBytesTotal += pStats.byteLength;
					nDeps++;

					if (pStats.status === EDependenceStatuses.LOADED) {
						nLoaded++;
					}
				});

				///< Dependence, which generates change in progress.
				pProgress.source = pDep;

				pProgress.time = time() - iBeginTime;

				// prevent similar events
				if (eStatus === EDependenceStatuses.DOWNLOADING && pProgress.bytesLoaded == iBytesLoaded) {
					return;
				}

				pProgress.bytesLoaded = iBytesLoaded;
				pProgress.bytesTotal = iBytesTotal;

				fUnpacked /= <float>/* iBytesTotal */ nTotalFiles;

				// prevent similar events
				if (eStatus === EDependenceStatuses.UNPACKING && pProgress.unpacked == fUnpacked) {
					return;
				}

				pProgress.unpacked = fUnpacked;

				// prevent similar events
				if (eStatus === EDependenceStatuses.LOADED && pProgress.loaded == nLoaded) {
					return;
				}

				pProgress.loaded = nLoaded;
				pProgress.total = nTotalFiles;


				fnProgress(pProgress);
			}

			/** Watch deps states. */
			function depWatcher(pDep: IDep, eStatus: EDependenceStatuses, pData?): void {
				pDep.stats.status = eStatus;

				switch (eStatus) {
					case EDependenceStatuses.REJECTED:
						return fnLoaded(<Error>arguments[2], pDepsPointer);

					case EDependenceStatuses.DOWNLOADING:
						pDep.stats.bytesLoaded = arguments[2].loaded;
						notifyProgress(pDep);
						return;
					case EDependenceStatuses.UNPACKING:
						pDep.stats.unpacked = <float>arguments[2] || 0.;
						notifyProgress(pDep);
						return;

					case EDependenceStatuses.EXTRACTION:
						pDep.stats.unpacked = <float>arguments[2].loaded / <float>arguments[2].total;
						notifyProgress(pDep);
						return;

					case EDependenceStatuses.LOADED:
						pDep.stats.bytesLoaded = pDep.stats.byteLength;
						pDep.stats.unpacked = 1.;
						pDep.content = arguments[2] || null;

						notifyProgress(pDep);

						//all loaded
						if (countLoadedOnLevel(pDepsPointer) === countFilesOnLevel(pDepsPointer)) {
							pDepsPointer = findNotEmptyLevel(pDepsPointer.deps);

							if (pDepsPointer) {
								loadDependencesLevel(pEngine, pDepsPointer, depWatcher);
							}
							else {
								fnLoaded(null, pDeps);
							}
						}

						return;
				}
			}

			loadDependencesLevel(pEngine, pDepsPointer, depWatcher);
		});
	}

	export function link(pParent: IDependens, pChild: IDependens): IDependens {
		while (isDefAndNotNull(pParent.files)) {
			if (!isDefAndNotNull(pParent.deps)) {
				pParent.deps = pChild;
				return pParent;
			}

			pParent = pParent.deps;
		}

		pParent.deps = pChild;
		return pParent;
	}

	export function createDependenceByPath(sPath: string, sType?: string, sRoot?: string): IDependens {
		return {
			root: sRoot,
			files: [{ path: sPath, type: sType }]
		};
	}
}