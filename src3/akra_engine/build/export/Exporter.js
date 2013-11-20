/// <reference path="../idl/AIDocument.ts" />
/// <reference path="../idl/AIAnimationController.ts" />
/// <reference path="../idl/AIAnimation.ts" />
/// <reference path="../idl/AIAnimationBlend.ts" />
/// <reference path="../idl/AIAnimationContainer.ts" />
/// <reference path="../idl/AIAnimationTrack.ts" />
define(["require", "exports", "io", "logger", "info"], function(require, exports, __io__, __logger__, __info__) {
    var io = __io__;
    var logger = __logger__;
    var info = __info__;

    var Exporter = (function () {
        function Exporter() {
            this._pLibrary = {};
            this._pDocument = null;
            //записаны ли сцены в документе?
            this._bScenesWrited = false;
            //assset
            this._sTitle = null;
            this._sSubject = null;
            this._pKeywords = null;
            //contributor
            this._sAuthor = null;
            this._sComments = null;
            this._sCopyright = null;
            this._sSourceData = null;
        }
        /** inline */ Exporter.prototype.writeAnimation = function (pAnimation) {
            switch (pAnimation.type) {
                case 0 /* ANIMATION */:
                    this.makeEntry(3 /* k_Animation */, pAnimation);
                    break;
                case 4 /* BLEND */:
                    this.makeEntry(4 /* k_AnimationBlend */, pAnimation);
                    break;
                case 3 /* CONTAINER */:
                    this.makeEntry(5 /* k_AnimationContainer */, pAnimation);
                    break;
                default:
                    logger.critical("unknown animation detected!");
            }
        };

        /** inline */ Exporter.prototype.writeController = function (pController) {
            this.makeEntry(2 /* k_Controller */, pController);
        };

        Exporter.prototype.clear = function () {
            this._bScenesWrited = false;
            this._pLibrary = {};
        };

        /** inline */ Exporter.prototype.findLibraryEntry = function (iGuid) {
            return this._pLibrary[iGuid];
        };

        /** inline */ Exporter.prototype.findEntry = function (iGuid) {
            return this.findLibraryEntry(iGuid).entry;
        };

        /** inline */ Exporter.prototype.findEntryData = function (iGuid) {
            return this.findLibraryEntry(iGuid).data;
        };

        Exporter.prototype.isSceneWrited = function () {
            return this._bScenesWrited;
        };

        Exporter.prototype.isEntryExists = function (iGuid) {
            return isDefAndNotNull(this._pLibrary[iGuid]);
        };

        Exporter.prototype.makeEntry = function (eType, pData) {
            if (!this.isEntryExists(pData.getGuid())) {
                this.writeEntry(eType, { guid: pData.getGuid(), data: pData, entry: null });
            }
        };

        Exporter.prototype.writeEntry = function (eType, pEntry) {
            if (isDefAndNotNull(pEntry.entry)) {
                return;
            }

            logger.assert(this.encodeEntry(eType, pEntry), "cannot encode entry with type: " + eType);
            this._pLibrary[pEntry.guid] = pEntry;
            pEntry.entry.guid = pEntry.guid;
        };

        Exporter.prototype.encodeEntry = function (eType, pEntry) {
            switch (eType) {
                case 2 /* k_Controller */:
                    pEntry.entry = this.encodeControllerEntry(pEntry.data);
                    break;
                case 3 /* k_Animation */:
                    pEntry.entry = this.encodeAnimationEntry(pEntry.data);
                    break;
                case 4 /* k_AnimationBlend */:
                    pEntry.entry = this.encodeAnimationBlendEntry(pEntry.data);
                    break;
                case 5 /* k_AnimationContainer */:
                    pEntry.entry = this.encodeAnimationContainerEntry(pEntry.data);
                    break;
                default:
                    logger.warn("unknown entry type detected: " + eType);
            }

            return isDefAndNotNull(pEntry.entry);
        };

        Exporter.prototype.encodeAnimationBaseEntry = function (pAnimation) {
            var pEntry = {
                name: pAnimation.name,
                targets: [],
                type: 0 /* k_Unknown */,
                extra: null
            };

            var pTargets = pAnimation.getTargetList();

            for (var i = 0; i < pTargets.length; ++i) {
                if (this.isSceneWrited()) {
                    logger.critical("TODO: scene writed");
                }

                pEntry.targets.push({ name: pTargets[i].name, target: null });
            }

            return pEntry;
        };

        Exporter.prototype.encodeAnimationFrameEntry = function (pFrame) {
            var pEntry = {
                time: pFrame.time,
                weight: pFrame.weight,
                matrix: [],
                type: pFrame.type
            };

            pEntry.matrix['$type'] = "Float32Array";

            var pMatrix = pFrame.toMatrix();

            for (var i = 0; i < pMatrix.data.length; ++i) {
                pEntry.matrix.push(pMatrix.data[i]);
            }

            return pEntry;
        };

        Exporter.prototype.encodeAnimationTrack = function (pTrack) {
            var pEntry = {
                interpolation: 0,
                keyframes: [],
                targetName: pTrack.targetName,
                target: null
            };

            if (this.isSceneWrited()) {
                logger.critical("TODO: write track target");
            }

            for (var i = 0; i < pTrack.totalFrames; ++i) {
                var pFrame = this.encodeAnimationFrameEntry(pTrack.getKeyFrame(i));
                pEntry.keyframes.push(pFrame);
            }
            ;

            return pEntry;
        };

        Exporter.prototype.encodeAnimationEntry = function (pAnimation) {
            var pEntry = this.encodeAnimationBaseEntry(pAnimation);
            pEntry.tracks = [];
            pEntry.type = 3 /* k_Animation */;

            for (var i = 0; i < pAnimation.totalTracks; ++i) {
                var pTrack = this.encodeAnimationTrack(pAnimation.getTrack(i));
                pEntry.tracks.push(pTrack);
            }
            ;

            return pEntry;
        };

        Exporter.prototype.encodeAnimationContainerEntry = function (pContainer) {
            var pAnimation = pContainer.getAnimation();

            var pEntry = this.encodeAnimationBaseEntry(pContainer);

            pEntry.enable = pContainer.isEnabled();
            pEntry.startTime = pContainer.getStartTime();
            pEntry.speed = pContainer.getSpeed();
            pEntry.loop = pContainer.inLoop();
            pEntry.reverse = pContainer.isReversed();
            pEntry.pause = pContainer.isPaused();
            pEntry.leftInfinity = pContainer.inLeftInfinity();
            pEntry.rightInfinity = pContainer.inRightInfinity();

            pEntry.animation = pAnimation.getGuid();
            pEntry.type = 5 /* k_AnimationContainer */;

            this.writeAnimation(pAnimation);

            return pEntry;
        };

        Exporter.prototype.encodeAnimationBlendEntry = function (pBlend) {
            var pEntry = this.encodeAnimationBaseEntry(pBlend);

            pEntry.animations = [];
            pEntry.type = 4 /* k_AnimationBlend */;

            for (var i = 0, n = pBlend.totalAnimations; i < n; ++i) {
                var pAnimation = pBlend.getAnimation(i);

                var pBlendElement = {
                    animation: pAnimation.getGuid(),
                    weight: pBlend.getAnimationWeight(i),
                    // acceleration: pBlend.getAnimationAcceleration(i),
                    mask: pBlend.getAnimationMask(i)
                };

                this.writeAnimation(pAnimation);
                pEntry.animations.push(pBlendElement);
            }

            return pEntry;
        };

        Exporter.prototype.encodeControllerEntry = function (pController) {
            var pEntry = {
                type: 2 /* k_Controller */,
                animations: [],
                options: 0,
                name: pController.name
            };

            for (var i = 0, n = pController.totalAnimations; i < n; ++i) {
                var pAnimation = pController.getAnimation(i);
                this.writeAnimation(pAnimation);
                pEntry.animations.push(pAnimation.getGuid());
            }

            return pEntry;
        };

        Exporter.prototype.toolInfo = function () {
            return [
                Exporter.TOOL,
                "Version " + Exporter.VERSION,
                "Browser " + info.browser.name + ", " + info.browser.version + " (" + info.browser.os + ")"
            ].join(";");
        };

        Exporter.prototype.createUnit = function () {
            return {
                name: "meter",
                meter: 1.
            };
        };

        Exporter.prototype.createContributor = function () {
            return {
                author: this._sAuthor,
                authoringTool: this.toolInfo(),
                comments: this._sComments,
                copyright: this._sCopyright,
                sourceData: this._sSourceData
            };
        };

        Exporter.prototype.createAsset = function () {
            return {
                unit: this.createUnit(),
                upAxis: Exporter.UP_AXIS,
                title: this._sTitle,
                subject: this._sSubject,
                created: Exporter.getDate(),
                modified: Exporter.getDate(),
                contributor: this.createContributor(),
                keywords: this._pKeywords
            };
        };

        Exporter.prototype.createDocument = function () {
            var pDocument = {
                asset: this.createAsset(),
                library: [],
                scenes: null
            };

            var pLibrary = this._pLibrary;

            for (var iGuid in pLibrary) {
                var pLibEntry = pLibrary[iGuid];
                pDocument.library.push(pLibEntry.entry);
            }

            return pDocument;
        };

        Exporter.prototype.export = function (eFormat) {
            if (typeof eFormat === "undefined") { eFormat = 0 /* JSON */; }
            var pDocument = this.createDocument();

            if (eFormat === 0 /* JSON */) {
                return Exporter.exportAsJSON(pDocument);
            } else if (eFormat === 1 /* BINARY_JSON */) {
                return Exporter.exportAsJSONBinary(pDocument);
            }

            return null;
        };

        Exporter.prototype.saveAs = function (sName, eFormat) {
            saveAs(this.export(eFormat), sName);
        };

        Exporter.exportAsJSON = function (pDocument) {
            return new Blob([JSON.stringify(pDocument)], { type: "application/json;charset=utf-8" });
        };

        Exporter.exportAsJSONBinary = function (pDocument) {
            return new Blob([io.dump(pDocument)], { type: "application/octet-stream" });
        };

        Exporter.getDate = function () {
            return (new Date()).toString();
        };
        Exporter.VERSION = "0.0.1";
        Exporter.UP_AXIS = "Y_UP";
        Exporter.TOOL = "Akra Engine exporter";
        return Exporter;
    })();

    
    return Exporter;
});
//# sourceMappingURL=Exporter.js.map
