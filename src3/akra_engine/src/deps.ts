/// <reference path="idl/AIEngine.ts" />


import logger = require("logger");
import path = require("path");
import uri = require("uri");
import io = require("io");
import afx = require("afx");
import zip = require("zip");
import info = require("info");
import config = require("config");
import conv = require("conv");


export function getLowerLevel(pDeps: AIDependens) {
    var c: AIDependens = pDeps;

    while (isDefAndNotNull(c)) {
        if (!isDefAndNotNull(c.deps)) {
            return c;
        }

        c = c.deps;
    }

    return c;
}

export function getTopLevel(pDeps: AIDependens) {
    var c: AIDependens = pDeps;

    while (isDefAndNotNull(c)) {
        if (!isDefAndNotNull(c.parent))
            return c;

        c = c.parent;
    }

    return c;
}


export function calcDepth(pDeps: AIDependens): int {
    var c: AIDependens = pDeps;
    var d: int = 0;

    while (isDefAndNotNull(c)) {
        d++;
        c = c.deps;
    }

    return d;
}



export function eachLevel(pDeps: AIDependens, fn: (pDeps: AIDependens, pParentDeps: AIDependens) => void): void {
    var p: AIDependens = pDeps.parent || null;
    var c: AIDependens = pDeps;

    while (isDefAndNotNull(c)) {
        fn(c, p);
        p = c;
        c = c.deps;
    }
}

/**
 * Recursive walk
 */
export function walk(pDeps: AIDependens,
    fn: (pDeps: AIDependens, i: int, iDepth: uint, pParentDeps: AIDependens) => void,
    iDepth: uint = 0,
    fnEnd: Function = null,
    pParentDeps: AIDependens = null
    ): void {

    var pFiles: AIDep[] = pDeps.files;

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


export function each(pDeps: AIDependens, fn: (pDep: AIDep) => void): void {
    walk(pDeps, (pDeps: AIDependens, i: int): void => {
        fn(pDeps.files[i]);
    });
}

/**
 * Fill <loaded/total> fields for AIDependens
 * Fill <parent/depth> fields for AIDependens
 * Fill <index/deps> fields for AIDep
 *
 * Fill <status> fields for AIDep
 * Make the <path> absolute for AIDep
 */
export function normalize(pDeps: AIDependens, sRoot: string = null, iDepth: int = 0): void {
    sRoot = isString(sRoot) ? sRoot : document.location.pathname;

    eachLevel(pDeps, (pDeps: AIDependens, pParentDeps: AIDependens): void => {
        pDeps.loaded = 0;
        pDeps.total = isArray(pDeps.files) ? pDeps.files.length : 0;

        pDeps.parent = pParentDeps;
        pDeps.depth = isNull(pParentDeps) ? iDepth : pParentDeps.depth + 1;
    });

    walk(pDeps, (pDeps: AIDependens, i: int, iDepth: uint): void => {
        var pDep: AIDep = pDeps.files[i];

        pDep.index = i;
        pDep.deps = pDeps;

        pDep.status = AEDependenceStatuses.NOT_LOADED;
        pDep.path = uri.resolve(pDeps.files[i].path, pDeps.root || sRoot);
    })
}

export function detectType(pDep: AIDep): string {
    return pDep.type || path.parse(pDep.path).ext || "";
}

export function createResources(pEngine: AIEngine, pDeps: AIDependens): void {
    var pRmgr: AIResourcePoolManager = pEngine.getResourceManager();
    each(pDeps, (pDep: AIDep): void => {
        var sResource: string = pDep.name || pDep.path;
        var sExt: string = detectType(pDep);

        switch (sExt.toLowerCase()) {
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

/** Add one dependency to another. */
export function linkDeps(pParent: AIDependens, pChild: AIDependens): void {
    pParent = getLowerLevel(pParent);
    pParent.deps = pChild;

    eachLevel(getTopLevel(pParent), (pDeps: AIDependens, pParentDeps: AIDependens) => {
        pDeps.depth = isNull(pParentDeps) ? 0 : pParentDeps.depth + 1;
        pDeps.parent = pParentDeps;
    });
}


function updateStatus(pDep: AIDep, eStatus: AEDependenceStatuses): void {
    pDep.status = eStatus;

    if (eStatus === AEDependenceStatuses.LOADED) {
        pDep.deps.loaded++;
    }
}

function handleResourceEventOnce(
    pRsc: AIResourcePoolItem,
    sSignal: string,
    fnHandler: (pItem: AIResourcePoolItem) => void): void {

    var fn = (pItem: AIResourcePoolItem): void => {
        fnHandler(pItem);
        pRsc.unbind(sSignal, fn);
    }

	pRsc.bind(sSignal, fn);
}

export function loadMap(
    pEngine: AIEngine,
    pDep: AIDep,
    fnLoaded: (e: Error, pDep: AIDep) => void,
    fnChanged: (pDep: AIDep, pProgress: any) => void): void {

    var pFile: AIFile = io.fopen(pDep.path, "rj");

    pFile.read((pErr: Error, pMap: AIDependens): void => {
        if (!isNull(pErr)) {
            fnLoaded(pErr, null);
        }

        pFile.close();

        var pCurrDeps: AIDependens = pDep.deps;
        var pNextDeps: AIDependens = pCurrDeps.deps;

        normalize(pMap, pDep.path, pCurrDeps.depth + 1);
        createResources(pEngine, pMap);

        var iMapDepth: int = calcDepth(pMap);

        pCurrDeps.deps = null;

        linkDeps(pCurrDeps, pMap);
        linkDeps(pCurrDeps, pNextDeps);

        updateStatus(pDep, AEDependenceStatuses.LOADED);
        fnLoaded(null, pDep);
    });
}

export function loadGrammar(
    pEngine: AIEngine,
    pDep: AIDep,
    fnLoaded: (e: Error, pDep: AIDep) => void,
    fnChanged: (pDep: AIDep, pProgress: any) => void): void {

    var pGrammar: AIFile = io.fopen(pDep.path, "r");

    pGrammar.read((e: Error, sData: string): void => {
        if (!isNull(e)) {
            fnLoaded(e, null);
        }

        //WARNING: only for HLSL grammar files.
        afx.initParser(sData);

        pGrammar.close();
        updateStatus(pDep, AEDependenceStatuses.LOADED);
        fnLoaded(null, pDep);
    });
}

function loadFromPool(
    pPool: AIResourcePool,
    pDep: AIDep,
    fnLoaded: (e: Error, pDep: AIDep) => void,
    fnChanged: (pDep: AIDep, pProgress: any) => void): void {

    var sResource: string = pDep.name || pDep.path;
    var pRes: AIResourcePoolItem = pPool.findResource(sResource);

    if (pRes.loadResource(pDep.path)) {
        handleResourceEventOnce(pRes, "loaded", (pItem: AIResourcePoolItem): void => {
            updateStatus(pDep, AEDependenceStatuses.LOADED);
            fnLoaded(null, pDep);
        });
    }
    else {
        fnLoaded(new Error("could not load resource: " + pDep.path), null);
    }
}

export function loadAFX(
    pEngine: AIEngine,
    pDep: AIDep,
    fnLoaded: (e: Error, pDep: AIDep) => void,
    fnChanged: (pDep: AIDep, pProgress: any) => void): void {
    loadFromPool(pEngine.getResourceManager().effectDataPool, pDep, fnLoaded, fnChanged);
}

export function loadImage(
    pEngine: AIEngine,
    pDep: AIDep,
    fnLoaded: (e: Error, pDep: AIDep) => void,
    fnChanged: (pDep: AIDep, pProgress: any) => void): void {

    loadFromPool(pEngine.getResourceManager().imagePool, pDep, fnLoaded, fnChanged);
}

export function loadDAE(
    pEngine: AIEngine,
    pDep: AIDep,
    fnLoaded: (e: Error, pDep: AIDep) => void,
    fnChanged: (pDep: AIDep, pProgress: any) => void): void {

    loadFromPool(pEngine.getResourceManager().colladaPool, pDep, fnLoaded, fnChanged);
}

export function loadCustom(
    pEngine: AIEngine,
    pDep: AIDep,
    fnLoaded: (e: Error, pDep: AIDep) => void,
    fnChanged: (pDep: AIDep, pProgress: any) => void): void {

    var pFile: AIFile = io.fopen(pDep.path, "r");

    pFile.read((pErr: Error, sData: string): void => {
        if (!isNull(pErr)) {
            fnLoaded(pErr, null);
        }

        pFile.close();

        //content will be added into dependen desc.
        pDep.content = sData;

        updateStatus(pDep, AEDependenceStatuses.LOADED);
        fnLoaded(null, pDep);
    });
}

export function loadJSON(
    pEngine: AIEngine,
    pDep: AIDep,
    fnLoaded: (e: Error, pDep: AIDep) => void,
    fnChanged: (pDep: AIDep, pProgress: any) => void): void {

    var pFile: AIFile = io.fopen(pDep.path, "rj");

    pFile.read((pErr: Error, pData: Object): void => {
        if (!isNull(pErr)) {
            fnLoaded(pErr, null);
        }

        pFile.close();
        pDep.content = pData;
        updateStatus(pDep, AEDependenceStatuses.LOADED);
        fnLoaded(null, pDep);
    });
}

export function loadBSON(
    pEngine: AIEngine,
    pDep: AIDep,
    fnLoaded: (e: Error, pDep: AIDep) => void,
    fnChanged: (pDep: AIDep, pProgress: any) => void): void {

    var pFile: AIFile = io.fopen(pDep.path, "rb");

    pFile.read((pErr: Error, pBuffer: ArrayBuffer): void => {
        if (!isNull(pErr)) {
            fnLoaded(pErr, null);
        }

        pFile.close();
        pDep.content = undump(pBuffer);

        updateStatus(pDep, AEDependenceStatuses.LOADED);
        fnLoaded(null, pDep);
    });
}

//load ARA

/** @const */
var ARA_INDEX = config.deps.archiveIndex || ".map";
/** @const */
var ETAG_FILE = config.deps.etag.file || ".etag";
var FORCE_ETAG_CHECKING: boolean = config.deps.etag.forceCheck || false;

//TODO: CREATE CORRECT UNPACKING FOR DATA_URI RESOURCES, NOW USED UNSAFE HASH <TMP>
//NEEED UNIQUE HASH!!!!

function forceExtractARADependence(pEntry: ZipEntry, sPath: string, fnCallback: Function): void {
    // console.log("forceExtractARADependence(", pEntry.filename, ")");

    pEntry.getData(new zip.ArrayBufferWriter(), (data: ArrayBuffer): void => {
        var pCopy: AIFile = io.fopen(sPath, "w+b");

        pCopy.write(data, (e: Error) => {
            if (e) throw e;

            logger.log("unpacked to local filesystem: ", pEntry.filename);
            // alert("unpacked to local filesystem: " + pEntry.filename);

            var pCrc32: AIFile = io.fopen(sPath + ".crc32", "w+");
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
    return "filesystem:" + info.uri.scheme + "//" + info.uri.host + "/temporary/" + sEntry + "/" + sFilename;
}

function extractARADependence(pEntry: ZipEntry, sHash: string, fnCallback: Function): void {
    var sPath: string = createARADLocalName(pEntry.filename, sHash);
    var pCRC32File: AIFile = io.fopen(sPath + ".crc32", "r");

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
    pEngine: AIEngine,
    pArchiveDep: AIDep,
    fnLoaded: (e: Error, pDep: AIDep) => void,
    fnChanged: (pDep: AIDep, pProgress: any) => void): void {

    var sArchivePath: string = pArchiveDep.path;
    //hash is required to create a unique path for the local file system
    var sArchiveHash: string = "tmp";
    var pArchive: AIFile = null;
    var pPrimaryDep: AIDependens = pArchiveDep.deps;
    //binary data obtained immediately from the DATA URI
    var pUri: AIDataURI = null;
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
        sArchiveHash = conv.utf8tob64(sArchivePath);
        pArchive = io.fopen(sArchivePath, "rb");
    }



    updateStatus(pArchiveDep, AEDependenceStatuses.CHECKING);
    fnChanged(pArchiveDep, null);

    var fnArchiveLoaded = (pARADeps: AIDependens): void => {
        linkDeps(pPrimaryDep, pARADeps);

        createResources(pEngine, pARADeps);
        updateStatus(pArchiveDep, AEDependenceStatuses.LOADED);
        fnLoaded(null, pArchiveDep);
    }

	var fnLoadArchive = (): void => {
        updateStatus(pArchiveDep, AEDependenceStatuses.LOADING);
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
                    var pARADeps: AIDependens = <AIDependens>JSON.parse(data);

                    var fnSuccesss: Function = (sLocalPath: string): void => {
                        nUnpacked++;

                        updateStatus(pArchiveDep, AEDependenceStatuses.UNPACKING);
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
                    each(pARADeps, (pDep: AIDep): void => {
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
            updateStatus(pArchiveDep, AEDependenceStatuses.UNPACKING);
            fnChanged(pArchiveDep, null);

            zip.createReader(new zip.Data64URIReader(sBase64Data),
                fnZipReadedCallback, (err: Error): void => {
                    console.log(err);
                });
        }


		var fnArchiveReadedCallback = (err: Error, pData: ArrayBuffer): void => {
            updateStatus(pArchiveDep, AEDependenceStatuses.UNPACKING);
            fnChanged(pArchiveDep, null);

            zip.createReader(new zip.ArrayBufferReader(pData),
                fnZipReadedCallback, (err: Error): void => {
                    console.log(err);
                });
        }

		if (pArchive) {
            pArchive.read(fnArchiveReadedCallback, (nLoaded: uint, nTotal: uint): void => {
                updateStatus(pArchiveDep, AEDependenceStatuses.LOADING);
                fnChanged(pArchiveDep, { loaded: nLoaded, total: nTotal });
            });
        }
        else {
            fnDataURIReaded(sBase64Data);
        }
    }

	if (!isNull(pArchive)) {
        //non data-uri cases
        pArchive.open((err: Error, pMeta: AIFileMeta): void => {
            if (FORCE_ETAG_CHECKING) {
                var pETag: AIFile = io.fopen(createARADLocalName(ETAG_FILE, sArchiveHash), "r+");

                pETag.read((e: Error, sETag: string) => {
                    if (!isNull(e) || !isString(pMeta.eTag) || sETag !== pMeta.eTag) {
                        if (has("DEBUG")) {
                            logger.log(sArchivePath, "ETAG not verified.", pMeta.eTag);
                        }

                        if (isDefAndNotNull(pMeta.eTag)) {
                            pETag.write(pMeta.eTag);
                        }

                        fnLoadArchive();
                        return;
                    }

                    if (has("DEBUG")) {
                        logger.log(sArchivePath, "ETAG verified successfully!", sETag);
                    }

                    io.fopen(createARADLocalName(ARA_INDEX, sArchiveHash), "rj").read((e: Error, pMap: AIDependens): void => {
                        normalize(pMap, "");
                        each(pMap, (pDep: AIDep): void => {
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


export function loadDependence(
    pEngine: AIEngine,
    pDeps: AIDependens,
    fnLoaded: (e: Error, pDeps: AIDependens) => void,
    fnChanged: (pDep: AIDep, pProgress: any) => void): void {

    //if got empty dependency.
    if (!isArray(pDeps.files) || pDeps.files.length === 0) {
        if (isDefAndNotNull(pDeps.deps)) {
            loadDependence(pEngine, pDeps.deps, fnLoaded, fnChanged);
        }
        else {
            //deps with out subdeps and files
            fnLoaded(null, pDeps);
        }
    }

    //walk single deps level
    each({ files: pDeps.files }, (pDep: AIDep): void => {
        //pDep.status = AEDependenceStatuses.LOADING;
        //this.changeDepStatus(pDep);
        updateStatus(pDep, AEDependenceStatuses.LOADING);
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
    pEngine: AIEngine,
    pDeps: AIDependens,
    sRoot: string,
    fnLoaded: (e: Error, pDeps: AIDependens) => void,
    fnChanged: (pDep: AIDep, pProgress: any) => void
    ): void {

    normalize(pDeps, pDeps.root || sRoot);
    createResources(this.getEngine(), pDeps);
    loadDependence(pEngine, pDeps,
        (e: Error, pDeps: AIDependens) => {
            //get dependencies, contained dep
            var pDeps: AIDependens = pDep.deps;

            if (pDeps.loaded < pDeps.total) {
                return;
            }

            if (isDefAndNotNull(pDeps)) {
                loadDependence(pEngine, pDeps, fnLoaded, fnChanged);
            }
            else {
                fnLoaded(null, pDeps);
            }
        },
        fnChanged);
}