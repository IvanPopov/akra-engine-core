/// <reference path="../idl/AIDocument.ts" />
/// <reference path="../idl/AIMap.ts" />
/// <reference path="../idl/AIAnimationContainer.ts" />
/// <reference path="../idl/AIAnimationBlend.ts" />
define(["require", "exports", "logger", "io", "conv", "math/Mat4"], function(require, exports, __logger__, __io__, __conv__, __Mat4__) {
    var logger = __logger__;
    var io = __io__;
    var conv = __conv__;

    //import animation = require("animation");
    var Mat4 = __Mat4__;

    var Importer = (function () {
        function Importer(_pEngine) {
            this._pEngine = _pEngine;
            this._pDocument = null;
            this._pLibrary = {};
        }
        /** inline */ Importer.prototype.getEngine = function () {
            return this._pEngine;
        };

        /** inline */ Importer.prototype.getDocument = function () {
            return this._pDocument;
        };

        /** inline */ Importer.prototype.getLibrary = function () {
            return this._pLibrary;
        };

        Importer.prototype.import = function (pData, eFormat) {
            if (typeof eFormat === "undefined") { eFormat = 0 /* JSON */; }
            if (eFormat !== 0 /* JSON */ && eFormat !== 1 /* BINARY_JSON */) {
                logger.critical("TODO: Add support for all formats");
            }

            if (eFormat === 0 /* JSON */) {
                this.loadDocument(this.importFromJSON(pData));
            } else if (eFormat === 1 /* BINARY_JSON */) {
                this.loadDocument(this.importFromBinaryJSON(pData));
            }

            return this;
        };

        Importer.prototype.loadDocument = function (pDocument) {
            this._pDocument = pDocument;
            this.updateLibrary();
            return this;
        };

        Importer.prototype.importFromBinaryJSON = function (pData) {
            return io.undump(pData);
        };

        Importer.prototype.importFromJSON = function (pData) {
            var sData = null;

            if (isArrayBuffer(pData)) {
                sData = conv.abtos(pData);
            } else if (isString(pData)) {
                sData = pData;
            } else if (isBlob(pData)) {
                logger.critical("TODO: Blob support!");
            } else {
                return pData;
            }

            return JSON.parse(sData);
        };

        Importer.prototype.updateLibrary = function () {
            var pDocument = this.getDocument();
            var pLibrary = this.getLibrary();

            for (var i = 0; i < pDocument.library.length; ++i) {
                var pEntry = pDocument.library[i];
                var iGuid = pEntry.guid;

                pLibrary[iGuid] = { guid: iGuid, data: null, entry: pEntry };
            }
            ;
        };

        Importer.prototype.findEntries = function (eType, fnCallback) {
            var pLibrary = this.getLibrary();
            var i = 0;

            for (var iGuid in pLibrary) {
                var pEntry = pLibrary[iGuid];

                if (!isNull(pEntry.entry) && pEntry.entry.type === eType) {
                    if (fnCallback.call(this, pEntry, i++) === false) {
                        return;
                    }
                }
            }
        };

        Importer.prototype.findEntryByIndex = function (eType, i) {
            var pEntry = null;
            this.findEntries(eType, function (pLibEntry, n) {
                pEntry = pLibEntry;

                if (i === n) {
                    return false;
                }
            });

            return pEntry;
        };

        Importer.prototype.find = function (eType, fnCallback) {
            var _this = this;
            this.findEntries(eType, function (pEntry, n) {
                if (fnCallback.call(_this, pEntry.data, n) === false) {
                    return;
                }
            });
        };

        Importer.prototype.findByIndex = function (eType, i) {
            if (typeof i === "undefined") { i = 0; }
            return this.findEntryByIndex(eType, i).data;
        };

        Importer.prototype.findFirst = function (eType) {
            return this.findByIndex(eType, 0);
        };

        Importer.prototype.getController = function (iContrller) {
            if (typeof iContrller === "undefined") { iContrller = 0; }
            return this.decodeEntry(this.findEntryByIndex(2 /* k_Controller */, iContrller).entry);
        };

        Importer.prototype.decodeEntry = function (pEntry) {
            if (isNull(pEntry)) {
                return null;
            }

            var pData = this.getLibrary()[pEntry.guid].data;

            if (!isNull(pData)) {
                return pData;
            }

            switch (pEntry.type) {
                case 2 /* k_Controller */:
                    pData = this.decodeControllerEntry(pEntry);
                    break;
                case 3 /* k_Animation */:
                    pData = this.decodeAnimationEntry(pEntry);
                    break;
                case 4 /* k_AnimationBlend */:
                    pData = this.decodeAnimationBlendEntry(pEntry);
                    break;
                case 5 /* k_AnimationContainer */:
                    pData = this.decodeAnimationContainerEntry(pEntry);
                    break;
            }

            if (!isNull(pData)) {
                this.registerData(pEntry.guid, pData);
                return pData;
            }

            logger.warn("USED UNKNOWN TYPE FOR DECODING!!", pEntry.type);
            return null;
        };

        Importer.prototype.registerData = function (iGuid, pData) {
            var pLibEntry = this.getLibrary()[iGuid];
            pLibEntry.data = pData;
        };

        Importer.prototype.decodeInstance = function (iGuid) {
            var pLibEntry = this.getLibrary()[iGuid];

            if (!isNull(pLibEntry.data)) {
                return pLibEntry.data;
            }

            return this.decodeEntry(pLibEntry.entry);
        };

        Importer.prototype.decodeEntryList = function (pEntryList, fnCallback) {
            if (isNull(pEntryList)) {
                return;
            }

            for (var i = 0; i < pEntryList.length; ++i) {
                fnCallback.call(this, this.decodeEntry(pEntryList[i]));
            }
        };

        Importer.prototype.decodeInstanceList = function (pInstances, fnCallback) {
            for (var i = 0; i < pInstances.length; ++i) {
                fnCallback.call(this, this.decodeInstance(pInstances[i]), i);
            }
        };

        Importer.prototype.decodeAnimationFrame = function (pEntry) {
            var pFrame = new animation.PositionFrame(pEntry.time, new Mat4(pEntry.matrix), pEntry.weight);

            //FIXME: avoid capability problems
            pFrame.type = isInt(pEntry.type) ? pEntry.type : 1 /* SPHERICAL */;
            return pFrame;
        };

        Importer.prototype.decodeAnimationTrack = function (pEntry) {
            var pTrack = animation.createTrack(pEntry.targetName);

            for (var i = 0; i < pEntry.keyframes.length; ++i) {
                pTrack.keyFrame(this.decodeAnimationFrame(pEntry.keyframes[i]));
            }
            ;

            return pTrack;
        };

        Importer.prototype.decodeAnimationEntry = function (pEntry) {
            var pAnimation = animation.createAnimation(pEntry.name);

            pAnimation.extra = pEntry.extra;

            for (var i = 0; i < pEntry.tracks.length; ++i) {
                pAnimation.push(this.decodeAnimationTrack(pEntry.tracks[i]));
            }
            ;

            return pAnimation;
        };

        Importer.prototype.decodeAnimationBlendEntry = function (pEntry) {
            var pBlend = animation.createBlend(pEntry.name);

            pBlend.extra = pEntry.extra;

            for (var i = 0; i < pEntry.animations.length; ++i) {
                var pElement = pEntry.animations[i];

                var pAnimation = this.decodeInstance(pElement.animation);
                var fWeight = pElement.weight;
                var pMask = pElement.mask;

                // var fAcceleration: float = pEntry.acceleration;
                pBlend.setAnimation(i, pAnimation);
                pBlend.setAnimationWeight(i, fWeight);
                pBlend.setAnimationMask(i, pMask);
            }
            ;

            return pBlend;
        };

        Importer.prototype.decodeAnimationContainerEntry = function (pEntry) {
            var pAnimation = this.decodeInstance(pEntry.animation);
            var pContainer = animation.createContainer(pAnimation, pEntry.name);

            pContainer.extra = pEntry.extra;

            if (!pEntry.enable) {
                pContainer.disable();
            }

            pContainer.setStartTime(pEntry.startTime);
            pContainer.setSpeed(pEntry.speed);
            pContainer.useLoop(pEntry.loop);
            pContainer.reverse(pEntry.reverse);
            pContainer.pause(pEntry.pause);
            pContainer.leftInfinity(pEntry.leftInfinity);
            pContainer.rightInfinity(pEntry.rightInfinity);

            return pContainer;
        };

        Importer.prototype.decodeControllerEntry = function (pEntry) {
            var pController = this.getEngine().createAnimationController(pEntry.name, pEntry.options);
            pController.name = pEntry.name;

            this.decodeInstanceList(pEntry.animations, function (pAnimation) {
                pController.addAnimation(pAnimation);
            });

            return pController;
        };
        return Importer;
    })();

    
    return Importer;
});
//# sourceMappingURL=Importer.js.map
