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
var akra;
(function (akra) {
    (function (deps) {
        function getLowerLevel(pDeps) {
            var c = pDeps;

            while (akra.isDefAndNotNull(c)) {
                if (!akra.isDefAndNotNull(c.deps)) {
                    return c;
                }

                c = c.deps;
            }

            return c;
        }
        deps.getLowerLevel = getLowerLevel;

        function getTopLevel(pDeps) {
            var c = pDeps;

            while (akra.isDefAndNotNull(c)) {
                if (!akra.isDefAndNotNull(c.parent))
                    return c;

                c = c.parent;
            }

            return c;
        }
        deps.getTopLevel = getTopLevel;

        function calcDepth(pDeps) {
            var c = pDeps;
            var d = 0;

            while (akra.isDefAndNotNull(c)) {
                d++;
                c = c.deps;
            }

            return d;
        }
        deps.calcDepth = calcDepth;

        function eachLevel(pDeps, fn) {
            var p = pDeps.parent || null;
            var c = pDeps;

            while (akra.isDefAndNotNull(c)) {
                fn(c, p);
                p = c;
                c = c.deps;
            }
        }
        deps.eachLevel = eachLevel;

        /**
        * Recursive walk
        */
        function walk(pDeps, fn, iDepth, fnEnd, pParentDeps) {
            if (typeof iDepth === "undefined") { iDepth = 0; }
            if (typeof fnEnd === "undefined") { fnEnd = null; }
            if (typeof pParentDeps === "undefined") { pParentDeps = null; }
            var pFiles = pDeps.files;

            if (akra.isDefAndNotNull(pFiles)) {
                for (var i = 0; i < pFiles.length; ++i) {
                    fn(pDeps, i, iDepth, pParentDeps);
                }
            }

            if (akra.isDefAndNotNull(pDeps.deps)) {
                walk(pDeps.deps, fn, ++iDepth, fnEnd, pDeps);
            } else if (akra.isFunction(fnEnd)) {
                fnEnd();
            }
        }
        deps.walk = walk;

        function each(pDeps, fn) {
            walk(pDeps, function (pDeps, i) {
                fn(pDeps.files[i]);
            });
        }
        deps.each = each;

        /**
        * Fill <loaded/total> fields for IDependens
        * Fill <parent/depth> fields for IDependens
        * Fill <index/deps> fields for IDep
        *
        * Fill <status> fields for IDep
        * Make the <path> absolute for IDep
        */
        function normalize(pDeps, sRoot, iDepth) {
            if (typeof sRoot === "undefined") { sRoot = null; }
            if (typeof iDepth === "undefined") { iDepth = 0; }
            sRoot = akra.isString(sRoot) ? sRoot : akra.uri.here().toString();

            eachLevel(pDeps, function (pDeps, pParentDeps) {
                pDeps.loaded = 0;
                pDeps.total = akra.isArray(pDeps.files) ? pDeps.files.length : 0;

                pDeps.parent = pParentDeps;
                pDeps.depth = akra.isNull(pParentDeps) ? iDepth : pParentDeps.depth + 1;
            });

            walk(pDeps, function (pDeps, i, iDepth) {
                var pDep = pDeps.files[i];

                pDep.index = i;
                pDep.deps = pDeps;
                pDep.primary = false;

                pDep.status = 0 /* NOT_LOADED */;
                pDep.path = akra.uri.resolve(pDeps.files[i].path, pDeps.root || sRoot);
            });
        }
        deps.normalize = normalize;

        function detectType(pDep) {
            return pDep.type || akra.path.parse(pDep.path).getExt() || "";
        }
        deps.detectType = detectType;

        function detectSize(pDep) {
            return 0;
            //var sExt: string = detectType(pDep);
            //switch (sExt.toLowerCase()) {
            //	case "ara":
            //	case "jpeg":
            //	case "jpg":
            //	case "png":
            //	case "gif":
            //	case "bmp":
            //	case "dds":
            //	case "bson":
            //	case "gr":
            //	case "fx":
            //	case "afx":
            //	case "dae":
            //	case "json":
            //	case "txt":
            //	case "map":
            //	default:
            //		logger.warn("dependence " + pDep.path + " unknown, and will be skipped.");
            //}
        }
        deps.detectSize = detectSize;

        function createResources(pEngine, pDeps) {
            var pRmgr = pEngine.getResourceManager();
            each(pDeps, function (pDep) {
                var sResource = pDep.name || pDep.path;
                var sExt = detectType(pDep);

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
        deps.createResources = createResources;

        /** Add one dependency to another. */
        function linkDeps(pParent, pChild) {
            pParent = getLowerLevel(pParent);
            pParent.deps = pChild;

            eachLevel(getTopLevel(pParent), function (pDeps, pParentDeps) {
                pDeps.depth = akra.isNull(pParentDeps) ? 0 : pParentDeps.depth + 1;
                pDeps.parent = pParentDeps;
            });
        }
        deps.linkDeps = linkDeps;

        function updateStatus(pDep, eStatus) {
            pDep.status = eStatus;

            if (eStatus === 5 /* LOADED */) {
                pDep.deps.loaded++;
            }
        }

        // Resource item 'loaded' event callback.
        function handleResourceEventOnce(pRsc, sSignal, fnHandler) {
            var fn = function (pItem) {
                fnHandler(pItem);
                pRsc.loaded.disconnect(fn);
            };

            pRsc.loaded.connect(fn);
        }

        function loadMap(pEngine, pDep, fnLoaded, fnChanged) {
            var pFile = akra.io.fopen(pDep.path, "rj");

            updateStatus(pDep, 3 /* LOADING */);
            fnChanged(pDep, null);

            pFile.read(function (pErr, pMap) {
                if (!akra.isNull(pErr)) {
                    fnLoaded(pErr, null);
                }

                pFile.close();

                var pCurrDeps = pDep.deps;
                var pNextDeps = pCurrDeps.deps;

                normalize(pMap, pDep.path, pCurrDeps.depth + 1);
                createResources(pEngine, pMap);

                var iMapDepth = calcDepth(pMap);

                pCurrDeps.deps = null;

                linkDeps(pCurrDeps, pMap);
                linkDeps(pCurrDeps, pNextDeps);

                updateStatus(pDep, 5 /* LOADED */);
                fnLoaded(null, pDep);
            });
        }
        deps.loadMap = loadMap;

        function loadGrammar(pEngine, pDep, fnLoaded, fnChanged) {
            var pGrammar = akra.io.fopen(pDep.path, "r");

            updateStatus(pDep, 3 /* LOADING */);
            fnChanged(pDep, null);

            pGrammar.read(function (e, sData) {
                if (!akra.isNull(e)) {
                    fnLoaded(e, null);
                }

                //WARNING: only for HLSL grammar files.
                akra.fx.initAFXParser(sData);

                pGrammar.close();

                updateStatus(pDep, 5 /* LOADED */);
                fnLoaded(null, pDep);
            });
        }
        deps.loadGrammar = loadGrammar;

        function loadFromPool(pPool, pDep, fnLoaded, fnChanged) {
            var sResource = pDep.name || pDep.path;
            var pRes = pPool.findResource(sResource);

            updateStatus(pDep, 3 /* LOADING */);
            fnChanged(pDep, null);

            handleResourceEventOnce(pRes, "loaded", function (pItem) {
                updateStatus(pDep, 5 /* LOADED */);
                fnLoaded(null, pDep);
            });

            if (!pRes.loadResource(pDep.path)) {
                fnLoaded(new Error("could not load resource: " + pDep.path), null);
            }
        }

        /** loade */
        function loadAFX(pEngine, pDep, fnLoaded, fnChanged) {
            loadFromPool(pEngine.getResourceManager().getEffectDataPool(), pDep, fnLoaded, fnChanged);
        }
        deps.loadAFX = loadAFX;

        function loadImage(pEngine, pDep, fnLoaded, fnChanged) {
            loadFromPool(pEngine.getResourceManager().getImagePool(), pDep, fnLoaded, fnChanged);
        }
        deps.loadImage = loadImage;

        function loadDAE(pEngine, pDep, fnLoaded, fnChanged) {
            loadFromPool(pEngine.getResourceManager().getColladaPool(), pDep, fnLoaded, fnChanged);
        }
        deps.loadDAE = loadDAE;

        function loadCustom(pEngine, pDep, fnLoaded, fnChanged) {
            var pFile = akra.io.fopen(pDep.path, "r");

            updateStatus(pDep, 3 /* LOADING */);
            fnChanged(pDep, null);

            pFile.read(function (pErr, sData) {
                if (!akra.isNull(pErr)) {
                    fnLoaded(pErr, null);
                }

                pFile.close();

                //content will be added into dependen desc.
                pDep.content = sData;

                updateStatus(pDep, 5 /* LOADED */);
                fnLoaded(null, pDep);
            });
        }
        deps.loadCustom = loadCustom;

        function loadJSON(pEngine, pDep, fnLoaded, fnChanged) {
            var pFile = akra.io.fopen(pDep.path, "rj");

            updateStatus(pDep, 3 /* LOADING */);
            fnChanged(pDep, null);

            pFile.read(function (pErr, pData) {
                if (!akra.isNull(pErr)) {
                    fnLoaded(pErr, null);
                }

                pFile.close();
                pDep.content = pData;
                updateStatus(pDep, 5 /* LOADED */);
                fnLoaded(null, pDep);
            });
        }
        deps.loadJSON = loadJSON;

        function loadBSON(pEngine, pDep, fnLoaded, fnChanged) {
            var pFile = akra.io.fopen(pDep.path, "rb");

            updateStatus(pDep, 3 /* LOADING */);
            fnChanged(pDep, null);

            pFile.read(function (pErr, pBuffer) {
                if (!akra.isNull(pErr)) {
                    fnLoaded(pErr, null);
                }

                pFile.close();
                pDep.content = akra.io.undump(pBuffer);

                updateStatus(pDep, 5 /* LOADED */);
                fnLoaded(null, pDep);
            });
        }
        deps.loadBSON = loadBSON;

        //load ARA
        /** @const */
        var ARA_INDEX = akra.config.deps.archiveIndex || ".map";

        /** @const */
        var ETAG_FILE = akra.config.deps.etag.file || ".etag";
        var FORCE_ETAG_CHECKING = akra.config.deps.etag.forceCheck || false;

        function forceExtractARADependence(pEntry, sPath, cb) {
            pEntry.getData(new zip.ArrayBufferWriter(), function (pData) {
                var pCopy = akra.io.fopen(sPath, "w+b");

                pCopy.write(pData, function (e) {
                    if (e) {
                        return cb(e, null);
                    }

                    akra.debug.log("Unpacked to local filesystem " + pEntry.filename + ".");

                    var pCrc32 = akra.io.fopen(sPath + ".crc32", "w+");
                    pCrc32.write(String(pEntry.crc32), function (e) {
                        cb(e, sPath);
                        pCrc32.close();
                    });

                    pCopy.close();
                });
            });
        }

        function createARADLocalName(sFilename, sEntry) {
            return "filesystem:" + akra.info.uri.getScheme() + "//" + akra.info.uri.getHost() + "/temporary/" + sEntry + "/" + sFilename;
        }

        function extractARADependence(pEntry, sHash, cb) {
            var sPath = createARADLocalName(pEntry.filename, sHash);
            var pCRC32File = akra.io.fopen(sPath + ".crc32", "r");

            pCRC32File.isExists(function (e, bExists) {
                if (e) {
                    return cb(e, null);
                }

                if (bExists) {
                    pCRC32File.read(function (e, data) {
                        if (parseInt(data) === pEntry.crc32) {
                            akra.debug.log("Skip unpacking for " + sPath + ".");
                            cb(null, sPath);
                        } else {
                            forceExtractARADependence(pEntry, sPath, cb);
                        }

                        pCRC32File.close();
                    });

                    return;
                }

                forceExtractARADependence(pEntry, sPath, cb);
            });
        }

        function loadARA(pEngine, pArchiveDep, fnLoaded, fnChanged) {
            var sArchivePath = pArchiveDep.path;

            //hash is required to create a unique path for the local file system
            //FIXME: md5 to slow for data URI files...
            var sArchiveHash = akra.crypto.md5(sArchivePath);
            var pArchive = null;
            var pPrimaryDep = pArchiveDep.deps;

            //binary data obtained immediately from the DATA URI
            var pUri = null;
            var sBase64Data = null;

            //api method very slow in this case:
            //		path.uri(sArchivePath).scheme === "data:"
            if (sArchivePath.substr(0, 5) === "data:") {
                //is data URI
                //data URI required cross-origin policy, and cannot be loaded with XMLHTTPRequest :(
                pUri = akra.uri.parseDataURI(sArchivePath);
                akra.debug.assert(pUri.base64, "only base64 decoded ARA resources supported.", sArchivePath);
                sBase64Data = pUri.data;
            } else {
                pArchive = akra.io.fopen(sArchivePath, "rb");
            }

            updateStatus(pArchiveDep, 2 /* CHECKING */);
            fnChanged(pArchiveDep, null);

            var fnArchiveLoaded = function (pARADeps) {
                linkDeps(pPrimaryDep, pARADeps);
                createResources(pEngine, pARADeps);
                updateStatus(pArchiveDep, 5 /* LOADED */);
                fnLoaded(null, pArchiveDep);
            };

            var fnLoadArchive = function () {
                updateStatus(pArchiveDep, 3 /* LOADING */);
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

                        akra.logger.assert(akra.isDefAndNotNull(pMapEntry), "ARA dependences found, but headers corrupted.");

                        pMapEntry.getData(new zip.TextWriter(), function (data) {
                            var pARADeps = JSON.parse(data);

                            var fnSuccesss = function (e, sLocalPath) {
                                if (e) {
                                    return fnLoaded(e, pArchiveDep);
                                }

                                nUnpacked++;

                                updateStatus(pArchiveDep, 4 /* UNPACKING */);
                                fnChanged(pArchiveDep, { loaded: nUnpacked, total: nTotal });

                                // All .map dependencies unpacked??
                                if (nUnpacked < nTotal) {
                                    return;
                                }

                                akra.logger.info("%cDependences loaded: ", "color: green;", sArchivePath);

                                pZipReader.close();

                                //id data-uri used, archive is null
                                pArchive && pArchive.close();

                                fnArchiveLoaded(pARADeps);
                            };

                            normalize(pARADeps, "");
                            each(pARADeps, function (pDep) {
                                var sPath = pDep.path;
                                var pEntry = pEntryMap[sPath];

                                akra.logger.assert(akra.isDefAndNotNull(pEntry), "Cannot resolve dependence: " + sPath);
                                delete pEntryMap[sPath];

                                extractARADependence(pEntry, sArchiveHash, function (e, sLocalPath) {
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

                var fnDataURIReaded = function (sBase64Data) {
                    updateStatus(pArchiveDep, 4 /* UNPACKING */);
                    fnChanged(pArchiveDep, null);

                    zip.createReader(new zip.Data64URIReader(sBase64Data), fnZipReadedCallback, function (err) {
                        fnLoaded(err, null);
                    });
                };

                var fnArchiveReadedCallback = function (err, pData) {
                    updateStatus(pArchiveDep, 4 /* UNPACKING */);
                    fnChanged(pArchiveDep, null);

                    zip.createReader(new zip.ArrayBufferReader(pData), fnZipReadedCallback, function (err) {
                        akra.logger.error(err);
                    });
                };

                if (pArchive) {
                    pArchive.read(fnArchiveReadedCallback, function (nLoaded, nTotal) {
                        updateStatus(pArchiveDep, 3 /* LOADING */);
                        fnChanged(pArchiveDep, { loaded: nLoaded, total: nTotal });
                    });
                } else {
                    fnDataURIReaded(sBase64Data);
                }
            };

            if (!akra.isNull(pArchive)) {
                //non data-uri cases
                pArchive.open(function (err, pMeta) {
                    if (FORCE_ETAG_CHECKING) {
                        var pETag = akra.io.fopen(createARADLocalName(ETAG_FILE, sArchiveHash), "r+");

                        pETag.read(function (e, sETag) {
                            if (!akra.isNull(e) || !akra.isString(pMeta.eTag) || sETag !== pMeta.eTag) {
                                if (akra.config.DEBUG) {
                                    akra.logger.log(sArchivePath, "ETAG not verified.", pMeta.eTag);
                                }

                                if (akra.isDefAndNotNull(pMeta.eTag)) {
                                    pETag.write(pMeta.eTag);
                                }

                                fnLoadArchive();
                                return;
                            }

                            if (akra.config.DEBUG) {
                                akra.logger.log(sArchivePath, "ETAG verified successfully!", sETag);
                            }

                            akra.io.fopen(createARADLocalName(ARA_INDEX, sArchiveHash), "rj").read(function (e, pMap) {
                                normalize(pMap, "");
                                each(pMap, function (pDep) {
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
        deps.loadARA = loadARA;

        function loadDependences(pEngine, pDeps, fnLoaded, fnChanged) {
            if (typeof fnChanged === "undefined") { fnChanged = null; }
            //if got empty dependency.
            if (!akra.isArray(pDeps.files) || pDeps.files.length === 0) {
                if (akra.isDefAndNotNull(pDeps.deps)) {
                    loadDependences(pEngine, pDeps.deps, fnLoaded, fnChanged);
                } else {
                    //deps with out subdeps and files
                    fnLoaded(null, pDeps);
                }
            }

            //walk single deps level
            each({ files: pDeps.files }, function (pDep) {
                updateStatus(pDep, 1 /* INITIALIZATION */);
                fnChanged(pDep, null);

                var sExt = detectType(pDep);

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
                        akra.logger.warn("dependence " + pDep.path + " unknown, and will be skipped.");
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
        function load(pEngine, pDeps, sRoot, fnLoaded, fnChanged) {
            if (typeof fnChanged === "undefined") { fnChanged = function () {
            }; }
            normalize(pDeps, pDeps.root || sRoot);
            createResources(pEngine, pDeps);

            var iTotalNumber = 0;
            var iTotalByteLength = 0;

            //mark initial dependencies as primary
            walk(pDeps, function (pDeps, i, iDepth) {
                var pDep = pDeps.files[i];
                pDep.primary = false;

                iTotalNumber++;
                iTotalByteLength += detectSize(pDep);
            });

            //определяем число первичных зависимостей, которое надо загрузить
            //определяем размер первичных зависимостей
            function dependacyLoaded(e, pDep) {
                //get dependencies, contained dep
                var pDeps = pDep.deps;

                //notify loaded for all resources
                fnChanged(pDep, null);

                if (pDeps.loaded < pDeps.total) {
                    return;
                }

                if (akra.isDefAndNotNull(pDeps.deps)) {
                    loadDependences(pEngine, pDeps.deps, dependacyLoaded, fnChanged);
                } else {
                    fnLoaded(null, pDeps);
                }
            }

            loadDependences(pEngine, pDeps, dependacyLoaded, fnChanged);
        }
        deps.load = load;

        function createDependenceByPath(sPath, sType) {
            return {
                files: [{ path: sPath, type: sType }]
            };
        }
        deps.createDependenceByPath = createDependenceByPath;
    })(akra.deps || (akra.deps = {}));
    var deps = akra.deps;
})(akra || (akra = {}));
//# sourceMappingURL=deps.js.map
