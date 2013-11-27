/// <reference path="idl/AIEngine.ts" />
/// <reference path="idl/AIDeps.ts" />
define(["require", "exports", "logger", "path", "uri", "io", "zip", "info", "config", "conv"], function(require, exports, __logger__, __path__, __uri__, __io__, __zip__, __info__, __config__, __conv__) {
    var logger = __logger__;
    var path = __path__;
    var uri = __uri__;
    var io = __io__;

    //import fx = require("fx");
    var zip = __zip__;
    var info = __info__;
    var config = __config__;
    var conv = __conv__;

    function getLowerLevel(pDeps) {
        var c = pDeps;

        while (isDefAndNotNull(c)) {
            if (!isDefAndNotNull(c.deps)) {
                return c;
            }

            c = c.deps;
        }

        return c;
    }
    exports.getLowerLevel = getLowerLevel;

    function getTopLevel(pDeps) {
        var c = pDeps;

        while (isDefAndNotNull(c)) {
            if (!isDefAndNotNull(c.parent))
                return c;

            c = c.parent;
        }

        return c;
    }
    exports.getTopLevel = getTopLevel;

    function calcDepth(pDeps) {
        var c = pDeps;
        var d = 0;

        while (isDefAndNotNull(c)) {
            d++;
            c = c.deps;
        }

        return d;
    }
    exports.calcDepth = calcDepth;

    function eachLevel(pDeps, fn) {
        var p = pDeps.parent || null;
        var c = pDeps;

        while (isDefAndNotNull(c)) {
            fn(c, p);
            p = c;
            c = c.deps;
        }
    }
    exports.eachLevel = eachLevel;

    /**
    * Recursive walk
    */
    function walk(pDeps, fn, iDepth, fnEnd, pParentDeps) {
        if (typeof iDepth === "undefined") { iDepth = 0; }
        if (typeof fnEnd === "undefined") { fnEnd = null; }
        if (typeof pParentDeps === "undefined") { pParentDeps = null; }
        var pFiles = pDeps.files;

        if (isDefAndNotNull(pFiles)) {
            for (var i = 0; i < pFiles.length; ++i) {
                fn(pDeps, i, iDepth, pParentDeps);
            }
        }

        if (isDefAndNotNull(pDeps.deps)) {
            exports.walk(pDeps.deps, fn, ++iDepth, fnEnd, pDeps);
        } else if (isFunction(fnEnd)) {
            fnEnd();
        }
    }
    exports.walk = walk;

    function each(pDeps, fn) {
        exports.walk(pDeps, function (pDeps, i) {
            fn(pDeps.files[i]);
        });
    }
    exports.each = each;

    /**
    * Fill <loaded/total> fields for AIDependens
    * Fill <parent/depth> fields for AIDependens
    * Fill <index/deps> fields for AIDep
    *
    * Fill <status> fields for AIDep
    * Make the <path> absolute for AIDep
    */
    function normalize(pDeps, sRoot, iDepth) {
        if (typeof sRoot === "undefined") { sRoot = null; }
        if (typeof iDepth === "undefined") { iDepth = 0; }
        sRoot = isString(sRoot) ? sRoot : document.location.pathname;

        exports.eachLevel(pDeps, function (pDeps, pParentDeps) {
            pDeps.loaded = 0;
            pDeps.total = isArray(pDeps.files) ? pDeps.files.length : 0;

            pDeps.parent = pParentDeps;
            pDeps.depth = isNull(pParentDeps) ? iDepth : pParentDeps.depth + 1;
        });

        exports.walk(pDeps, function (pDeps, i, iDepth) {
            var pDep = pDeps.files[i];

            pDep.index = i;
            pDep.deps = pDeps;

            pDep.status = 0 /* NOT_LOADED */;
            pDep.path = uri.resolve(pDeps.files[i].path, pDeps.root || sRoot);
        });
    }
    exports.normalize = normalize;

    function detectType(pDep) {
        return pDep.type || path.parse(pDep.path).ext || "";
    }
    exports.detectType = detectType;

    function createResources(pEngine, pDeps) {
        var pRmgr = pEngine.getResourceManager();
        exports.each(pDeps, function (pDep) {
            var sResource = pDep.name || pDep.path;
            var sExt = exports.detectType(pDep);

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
    exports.createResources = createResources;

    /** Add one dependency to another. */
    function linkDeps(pParent, pChild) {
        pParent = exports.getLowerLevel(pParent);
        pParent.deps = pChild;

        exports.eachLevel(exports.getTopLevel(pParent), function (pDeps, pParentDeps) {
            pDeps.depth = isNull(pParentDeps) ? 0 : pParentDeps.depth + 1;
            pDeps.parent = pParentDeps;
        });
    }
    exports.linkDeps = linkDeps;

    function updateStatus(pDep, eStatus) {
        pDep.status = eStatus;

        if (eStatus === 4 /* LOADED */) {
            pDep.deps.loaded++;
        }
    }

    function handleResourceEventOnce(pRsc, sSignal, fnHandler) {
        var fn = function (pItem) {
            fnHandler(pItem);
            pRsc.unbind(sSignal, fn);
        };

        pRsc.bind(sSignal, fn);
    }

    function loadMap(pEngine, pDep, fnLoaded, fnChanged) {
        var pFile = io.fopen(pDep.path, "rj");

        pFile.read(function (pErr, pMap) {
            if (!isNull(pErr)) {
                fnLoaded(pErr, null);
            }

            pFile.close();

            var pCurrDeps = pDep.deps;
            var pNextDeps = pCurrDeps.deps;

            exports.normalize(pMap, pDep.path, pCurrDeps.depth + 1);
            exports.createResources(pEngine, pMap);

            var iMapDepth = exports.calcDepth(pMap);

            pCurrDeps.deps = null;

            exports.linkDeps(pCurrDeps, pMap);
            exports.linkDeps(pCurrDeps, pNextDeps);

            updateStatus(pDep, 4 /* LOADED */);
            fnLoaded(null, pDep);
        });
    }
    exports.loadMap = loadMap;

    //export function loadGrammar(
    //    pEngine: AIEngine,
    //    pDep: AIDep,
    //    fnLoaded: (e: Error, pDep: AIDep) => void,
    //    fnChanged: (pDep: AIDep, pProgress: any) => void): void {
    //    var pGrammar: AIFile = io.fopen(pDep.path, "r");
    //    pGrammar.read((e: Error, sData: string): void => {
    //        if (!isNull(e)) {
    //            fnLoaded(e, null);
    //        }
    //        //WARNING: only for HLSL grammar files.
    //        afx.initParser(sData);
    //        pGrammar.close();
    //        updateStatus(pDep, AEDependenceStatuses.LOADED);
    //        fnLoaded(null, pDep);
    //    });
    //}
    function loadFromPool(pPool, pDep, fnLoaded, fnChanged) {
        var sResource = pDep.name || pDep.path;
        var pRes = pPool.findResource(sResource);

        if (pRes.loadResource(pDep.path)) {
            handleResourceEventOnce(pRes, "loaded", function (pItem) {
                updateStatus(pDep, 4 /* LOADED */);
                fnLoaded(null, pDep);
            });
        } else {
            fnLoaded(new Error("could not load resource: " + pDep.path), null);
        }
    }

    function loadAFX(pEngine, pDep, fnLoaded, fnChanged) {
        loadFromPool(pEngine.getResourceManager().effectDataPool, pDep, fnLoaded, fnChanged);
    }
    exports.loadAFX = loadAFX;

    function loadImage(pEngine, pDep, fnLoaded, fnChanged) {
        loadFromPool(pEngine.getResourceManager().imagePool, pDep, fnLoaded, fnChanged);
    }
    exports.loadImage = loadImage;

    function loadDAE(pEngine, pDep, fnLoaded, fnChanged) {
        loadFromPool(pEngine.getResourceManager().colladaPool, pDep, fnLoaded, fnChanged);
    }
    exports.loadDAE = loadDAE;

    function loadCustom(pEngine, pDep, fnLoaded, fnChanged) {
        var pFile = io.fopen(pDep.path, "r");

        pFile.read(function (pErr, sData) {
            if (!isNull(pErr)) {
                fnLoaded(pErr, null);
            }

            pFile.close();

            //content will be added into dependen desc.
            pDep.content = sData;

            updateStatus(pDep, 4 /* LOADED */);
            fnLoaded(null, pDep);
        });
    }
    exports.loadCustom = loadCustom;

    function loadJSON(pEngine, pDep, fnLoaded, fnChanged) {
        var pFile = io.fopen(pDep.path, "rj");

        pFile.read(function (pErr, pData) {
            if (!isNull(pErr)) {
                fnLoaded(pErr, null);
            }

            pFile.close();
            pDep.content = pData;
            updateStatus(pDep, 4 /* LOADED */);
            fnLoaded(null, pDep);
        });
    }
    exports.loadJSON = loadJSON;

    function loadBSON(pEngine, pDep, fnLoaded, fnChanged) {
        var pFile = io.fopen(pDep.path, "rb");

        pFile.read(function (pErr, pBuffer) {
            if (!isNull(pErr)) {
                fnLoaded(pErr, null);
            }

            pFile.close();
            pDep.content = io.undump(pBuffer);

            updateStatus(pDep, 4 /* LOADED */);
            fnLoaded(null, pDep);
        });
    }
    exports.loadBSON = loadBSON;

    //load ARA
    /** @const */
    var ARA_INDEX = config.deps.archiveIndex || ".map";

    /** @const */
    var ETAG_FILE = config.deps.etag.file || ".etag";
    var FORCE_ETAG_CHECKING = config.deps.etag.forceCheck || false;

    //TODO: CREATE CORRECT UNPACKING FOR DATA_URI RESOURCES, NOW USED UNSAFE HASH <TMP>
    //NEEED UNIQUE HASH!!!!
    function forceExtractARADependence(pEntry, sPath, fnCallback) {
        // console.log("forceExtractARADependence(", pEntry.filename, ")");
        pEntry.getData(new zip.ArrayBufferWriter(), function (data) {
            var pCopy = io.fopen(sPath, "w+b");

            pCopy.write(data, function (e) {
                if (e)
                    throw e;

                logger.log("unpacked to local filesystem: ", pEntry.filename);

                // alert("unpacked to local filesystem: " + pEntry.filename);
                var pCrc32 = io.fopen(sPath + ".crc32", "w+");
                pCrc32.write(String(pEntry.crc32), function (e) {
                    if (e)
                        throw e;
                    fnCallback(sPath);
                    pCrc32.close();
                });

                pCopy.close();
            });
        });
    }

    function createARADLocalName(sFilename, sEntry) {
        return "filesystem:" + info.uri.scheme + "//" + info.uri.host + "/temporary/" + sEntry + "/" + sFilename;
    }

    function extractARADependence(pEntry, sHash, fnCallback) {
        var sPath = createARADLocalName(pEntry.filename, sHash);
        var pCRC32File = io.fopen(sPath + ".crc32", "r");

        pCRC32File.isExists(function (e, bExists) {
            if (bExists) {
                pCRC32File.read(function (e, data) {
                    if (parseInt(data) === pEntry.crc32) {
                        console.log("skip unpacking for dep.: ", sPath);
                        fnCallback(sPath);
                    } else {
                        forceExtractARADependence(pEntry, sPath, fnCallback);
                    }

                    pCRC32File.close();
                });

                return;
            }

            forceExtractARADependence(pEntry, sPath, fnCallback);
        });
    }

    function loadARA(pEngine, pArchiveDep, fnLoaded, fnChanged) {
        var sArchivePath = pArchiveDep.path;

        //hash is required to create a unique path for the local file system
        var sArchiveHash = "tmp";
        var pArchive = null;
        var pPrimaryDep = pArchiveDep.deps;

        //binary data obtained immediately from the DATA URI
        var pUri = null;
        var sBase64Data = null;

        if (sArchivePath.substr(0, 5) === "data:") {
            //is data URI
            //data URI required cross-origin policy, and cannot be loaded with XMLHTTPRequest :(
            pUri = uri.parseDataURI(sArchivePath);
            logger.presume(pUri.base64, "only base64 decoded ARA resources supported.", sArchivePath);
            sBase64Data = pUri.data;
        } else {
            sArchiveHash = conv.utf8tob64(sArchivePath);
            pArchive = io.fopen(sArchivePath, "rb");
        }

        updateStatus(pArchiveDep, 2 /* CHECKING */);
        fnChanged(pArchiveDep, null);

        var fnArchiveLoaded = function (pARADeps) {
            exports.linkDeps(pPrimaryDep, pARADeps);

            exports.createResources(pEngine, pARADeps);
            updateStatus(pArchiveDep, 4 /* LOADED */);
            fnLoaded(null, pArchiveDep);
        };

        var fnLoadArchive = function () {
            updateStatus(pArchiveDep, 1 /* LOADING */);
            fnChanged(pArchiveDep, null);

            var fnZipReadedCallback = function (pZipReader) {
                pZipReader.getEntries(function (pEntries) {
                    var pEntryMap = {};
                    var nTotal = 0;
                    var nUnpacked = 0;

                    for (var i = 0; i < pEntries.length; ++i) {
                        if (pEntries[i].directory)
                            continue;
                        pEntryMap[pEntries[i].filename] = pEntries[i];
                        nTotal++;
                    }

                    var pMapEntry = pEntryMap[ARA_INDEX];

                    logger.assert(isDefAndNotNull(pMapEntry), "ARA dependences found, but headers corrupted.");

                    pMapEntry.getData(new zip.TextWriter(), function (data) {
                        var pARADeps = JSON.parse(data);

                        var fnSuccesss = function (sLocalPath) {
                            nUnpacked++;

                            updateStatus(pArchiveDep, 3 /* UNPACKING */);
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

                        exports.normalize(pARADeps, "");
                        exports.each(pARADeps, function (pDep) {
                            var sPath = pDep.path;
                            var pEntry = pEntryMap[sPath];

                            logger.assert(isDefAndNotNull(pEntry), "Cannot resolve ARA dependence: " + sPath);
                            delete pEntryMap[sPath];

                            extractARADependence(pEntry, sArchiveHash, function (sLocalPath) {
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

            var fnDataURIReaded = function (sBase64Data) {
                updateStatus(pArchiveDep, 3 /* UNPACKING */);
                fnChanged(pArchiveDep, null);

                zip.createReader(new zip.Data64URIReader(sBase64Data), fnZipReadedCallback, function (err) {
                    console.log(err);
                });
            };

            var fnArchiveReadedCallback = function (err, pData) {
                updateStatus(pArchiveDep, 3 /* UNPACKING */);
                fnChanged(pArchiveDep, null);

                zip.createReader(new zip.ArrayBufferReader(pData), fnZipReadedCallback, function (err) {
                    console.log(err);
                });
            };

            if (pArchive) {
                pArchive.read(fnArchiveReadedCallback, function (nLoaded, nTotal) {
                    updateStatus(pArchiveDep, 1 /* LOADING */);
                    fnChanged(pArchiveDep, { loaded: nLoaded, total: nTotal });
                });
            } else {
                fnDataURIReaded(sBase64Data);
            }
        };

        if (!isNull(pArchive)) {
            //non data-uri cases
            pArchive.open(function (err, pMeta) {
                if (FORCE_ETAG_CHECKING) {
                    var pETag = io.fopen(createARADLocalName(ETAG_FILE, sArchiveHash), "r+");

                    pETag.read(function (e, sETag) {
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

                        io.fopen(createARADLocalName(ARA_INDEX, sArchiveHash), "rj").read(function (e, pMap) {
                            exports.normalize(pMap, "");
                            exports.each(pMap, function (pDep) {
                                pDep.path = createARADLocalName(pDep.path, sArchiveHash);
                            });

                            fnArchiveLoaded(pMap);
                        });
                    });
                } else {
                    fnLoadArchive();
                }
            });
        } else {
            fnLoadArchive();
        }
    }
    exports.loadARA = loadARA;

    function loadDependences(pEngine, pDeps, fnLoaded, fnChanged) {
        if (!isArray(pDeps.files) || pDeps.files.length === 0) {
            if (isDefAndNotNull(pDeps.deps)) {
                exports.loadDependences(pEngine, pDeps.deps, fnLoaded, fnChanged);
            } else {
                //deps with out subdeps and files
                fnLoaded(null, pDeps);
            }
        }

        //walk single deps level
        exports.each({ files: pDeps.files }, function (pDep) {
            //pDep.status = AEDependenceStatuses.LOADING;
            //this.changeDepStatus(pDep);
            updateStatus(pDep, 1 /* LOADING */);
            fnChanged(pDep, null);

            var sExt = exports.detectType(pDep);

            switch (sExt.toLowerCase()) {
                case "ara":
                    //akra resource archive
                    exports.loadARA(pEngine, pDep, fnLoaded, fnChanged);
                    break;

                case "fx":
                case "afx":
                    exports.loadAFX(pEngine, pDep, fnLoaded, fnChanged);
                    break;
                case "jpeg":
                case "jpg":
                case "png":
                case "gif":
                case "bmp":
                case "dds":
                    exports.loadImage(pEngine, pDep, fnLoaded, fnChanged);
                    break;
                case "dae":
                    exports.loadDAE(pEngine, pDep, fnLoaded, fnChanged);
                    break;
                case "json":
                    exports.loadJSON(pEngine, pDep, fnLoaded, fnChanged);
                    break;
                case "bson":
                    exports.loadBSON(pEngine, pDep, fnLoaded, fnChanged);
                    break;
                case "txt":
                    exports.loadCustom(pEngine, pDep, fnLoaded, fnChanged);
                    break;
                case "map":
                    exports.loadMap(pEngine, pDep, fnLoaded, fnChanged);
                    break;
                default:
                    logger.warn("dependence " + pDep.path + " unknown, and will be skipped.");
            }
        });
    }
    exports.loadDependences = loadDependences;

    /**
    * @param pEngine Engine instance.
    * @param pDeps Dependencies list.
    * @param sRoot Default root path for loading resources. (config.data for ex.)
    * @param fnLoaded All loaded?
    * @param fnStatusChanged
    */
    function load(pEngine, pDeps, sRoot, fnLoaded, fnChanged) {
        exports.normalize(pDeps, pDeps.root || sRoot);
        exports.createResources(this.getEngine(), pDeps);
        exports.loadDependences(pEngine, pDeps, function (e, pDeps) {
            //get dependencies, contained dep
            var pDeps = pDep.deps;

            if (pDeps.loaded < pDeps.total) {
                return;
            }

            if (isDefAndNotNull(pDeps)) {
                exports.loadDependences(pEngine, pDeps, fnLoaded, fnChanged);
            } else {
                fnLoaded(null, pDeps);
            }
        }, fnChanged);
    }
    exports.load = load;
});
//# sourceMappingURL=deps.js.map
