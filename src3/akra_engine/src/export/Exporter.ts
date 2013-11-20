/// <reference path="../idl/AIDocument.ts" />
/// <reference path="../idl/AIAnimationController.ts" />
/// <reference path="../idl/AIAnimation.ts" />
/// <reference path="../idl/AIAnimationBlend.ts" />
/// <reference path="../idl/AIAnimationContainer.ts" />
/// <reference path="../idl/AIAnimationTrack.ts" />

import io = require("io");
import logger = require("logger");
import info = require("info");

class Exporter {
    static VERSION = "0.0.1";
    static UP_AXIS: string = "Y_UP";
    static TOOL: string = "Akra Engine exporter";

    protected _pLibrary: AILibrary = <AILibrary><any>{};
    protected _pDocument: AIDocument = null;

    //записаны ли сцены в документе?
    protected _bScenesWrited: boolean = false;

    //assset
    protected _sTitle: string = null;
    protected _sSubject: string = null;
    protected _pKeywords: string[] = null;

    //contributor
    protected _sAuthor: string = null;
    protected _sComments: string = null;
    protected _sCopyright: string = null;
    protected _sSourceData: string = null;

    /** inline */ writeAnimation(pAnimation: AIAnimationBase): void {
        switch (pAnimation.type) {
            case AEAnimationTypes.ANIMATION:
                this.makeEntry(AEDocumentEntry.k_Animation, pAnimation);
                break;
            case AEAnimationTypes.BLEND:
                this.makeEntry(AEDocumentEntry.k_AnimationBlend, pAnimation);
                break;
            case AEAnimationTypes.CONTAINER:
                this.makeEntry(AEDocumentEntry.k_AnimationContainer, pAnimation);
                break;
            default:
                logger.critical("unknown animation detected!");
        }
    }

    /** inline */ writeController(pController: AIAnimationController): void {
        this.makeEntry(AEDocumentEntry.k_Controller, pController);
    }

    clear(): void {
        this._bScenesWrited = false;
        this._pLibrary = <AILibrary><any>{};
    }

    /** inline */ findLibraryEntry(iGuid: int): AILibraryEntry {
        return this._pLibrary[iGuid];
    }

    /** inline */ findEntry(iGuid: int): AIDataEntry {
        return this.findLibraryEntry(iGuid).entry;
    }

    /** inline */ findEntryData(iGuid: int): any {
        return this.findLibraryEntry(iGuid).data;
    }

    protected /** inline */ isSceneWrited(): boolean {
        return this._bScenesWrited;
    }

    protected /** inline */ isEntryExists(iGuid: int): boolean {
        return isDefAndNotNull(this._pLibrary[iGuid]);
    }

    protected makeEntry(eType: AEDocumentEntry, pData: AIUnique): void {
        if (!this.isEntryExists(pData.getGuid())) {
            this.writeEntry(eType, { guid: pData.getGuid(), data: pData, entry: null });
        }
    }

    protected writeEntry(eType: AEDocumentEntry, pEntry: AILibraryEntry): void {
        if (isDefAndNotNull(pEntry.entry)) {
            return;
        }

        logger.assert(this.encodeEntry(eType, pEntry), "cannot encode entry with type: " + eType);
        this._pLibrary[pEntry.guid] = pEntry;
        pEntry.entry.guid = pEntry.guid;
    }

    protected encodeEntry(eType: AEDocumentEntry, pEntry: AILibraryEntry): boolean {
        switch (eType) {
            case AEDocumentEntry.k_Controller:
                pEntry.entry = this.encodeControllerEntry(<AIAnimationController>pEntry.data);
                break;
            case AEDocumentEntry.k_Animation:
                pEntry.entry = this.encodeAnimationEntry(<AIAnimation>pEntry.data);
                break;
            case AEDocumentEntry.k_AnimationBlend:
                pEntry.entry = this.encodeAnimationBlendEntry(<AIAnimationBlend>pEntry.data);
                break;
            case AEDocumentEntry.k_AnimationContainer:
                pEntry.entry = this.encodeAnimationContainerEntry(<AIAnimationContainer>pEntry.data);
                break;
            default:
                logger.warn("unknown entry type detected: " + eType);
        }

        return isDefAndNotNull(pEntry.entry);
    }

    protected encodeAnimationBaseEntry(pAnimation: AIAnimationBase): AIDataEntry {
        var pEntry: AIAnimationBaseEntry = {
            name: pAnimation.name,
            targets: [],
            type: AEDocumentEntry.k_Unknown,
            extra: null
        }

			var pTargets: AIAnimationTarget[] = pAnimation.getTargetList();

        for (var i = 0; i < pTargets.length; ++i) {
            if (this.isSceneWrited()) {
                logger.critical("TODO: scene writed");
            }

            pEntry.targets.push({ name: pTargets[i].name, target: null });
        }

        return pEntry;
    }

    protected encodeAnimationFrameEntry(pFrame: AIPositionFrame): AIAnimationFrameEntry {
        var pEntry: AIAnimationFrameEntry = {
            time: pFrame.time,
            weight: pFrame.weight,
            matrix: [],
            type: <int>pFrame.type
        };


        pEntry.matrix['$type'] = "Float32Array";

        var pMatrix: AIMat4 = pFrame.toMatrix();

        for (var i = 0; i < pMatrix.data.length; ++i) {
            pEntry.matrix.push(pMatrix.data[i]);
        }

        return pEntry;
    }

    protected encodeAnimationTrack(pTrack: AIAnimationTrack): AIAnimationTrackEntry {
        var pEntry: AIAnimationTrackEntry = {
            interpolation: 0, /*TODO: real interpolation mode*/
            keyframes: [],
            targetName: pTrack.targetName,
            target: null
        };

        if (this.isSceneWrited()) {
            logger.critical("TODO: write track target");
        }

        for (var i: int = 0; i < pTrack.totalFrames; ++i) {
            var pFrame: AIAnimationFrameEntry = this.encodeAnimationFrameEntry(<AIPositionFrame>pTrack.getKeyFrame(i));
            pEntry.keyframes.push(pFrame);
        };

        return pEntry;
    }

    protected encodeAnimationEntry(pAnimation: AIAnimation): AIDataEntry {
        var pEntry: AIAnimationEntry = <AIAnimationEntry>this.encodeAnimationBaseEntry(pAnimation);
        pEntry.tracks = [];
        pEntry.type = AEDocumentEntry.k_Animation;

        for (var i: int = 0; i < pAnimation.totalTracks; ++i) {
            var pTrack: AIAnimationTrackEntry = this.encodeAnimationTrack(pAnimation.getTrack(i));
            pEntry.tracks.push(pTrack);
        };

        return pEntry;
    }

    protected encodeAnimationContainerEntry(pContainer: AIAnimationContainer): AIDataEntry {
        var pAnimation: AIAnimationBase = pContainer.getAnimation();

        var pEntry: AIAnimationContainerEntry = <AIAnimationContainerEntry>this.encodeAnimationBaseEntry(pContainer);

        pEntry.enable = pContainer.isEnabled();
        pEntry.startTime = pContainer.getStartTime();
        pEntry.speed = pContainer.getSpeed();
        pEntry.loop = pContainer.inLoop();
        pEntry.reverse = pContainer.isReversed();
        pEntry.pause = pContainer.isPaused();
        pEntry.leftInfinity = pContainer.inLeftInfinity();
        pEntry.rightInfinity = pContainer.inRightInfinity();

        pEntry.animation = pAnimation.getGuid();
        pEntry.type = AEDocumentEntry.k_AnimationContainer;

        this.writeAnimation(pAnimation);

        return pEntry;
    }

    protected encodeAnimationBlendEntry(pBlend: AIAnimationBlend): AIDataEntry {
        var pEntry: AIAnimationBlendEntry = <AIAnimationBlendEntry>this.encodeAnimationBaseEntry(pBlend);

        pEntry.animations = []
			pEntry.type = AEDocumentEntry.k_AnimationBlend;

        for (var i = 0, n: int = pBlend.totalAnimations; i < n; ++i) {
            var pAnimation: AIAnimationBase = pBlend.getAnimation(i);

            var pBlendElement: AIAnimationBlendElementEntry = {
                animation: pAnimation.getGuid(),
                weight: pBlend.getAnimationWeight(i),
                // acceleration: pBlend.getAnimationAcceleration(i),
                mask: pBlend.getAnimationMask(i)
            };

            this.writeAnimation(pAnimation);
            pEntry.animations.push(pBlendElement);
        }


        return pEntry;
    }

    protected encodeControllerEntry(pController: AIAnimationController): AIDataEntry {
        var pEntry: AIControllerEntry = {
            type: AEDocumentEntry.k_Controller,

            animations: [],
            options: 0,
            name: pController.name
        };

        for (var i = 0, n: int = pController.totalAnimations; i < n; ++i) {
            var pAnimation: AIAnimationBase = pController.getAnimation(i);
            this.writeAnimation(pAnimation);
            pEntry.animations.push(pAnimation.getGuid());
        }

        return pEntry;
    }


    protected toolInfo(): string {
        return [
            Exporter.TOOL,
            "Version " + Exporter.VERSION,
            "Browser " + info.browser.name + ", " + info.browser.version + " (" + info.browser.os + ")"
        ].join(";");
    }

    protected createUnit(): AIUnit {
			return {
            name: "meter",
            meter: 1.
        }
		}

    protected createContributor(): AIContributor {
			return {
            author: this._sAuthor,
            authoringTool: this.toolInfo(),
            comments: this._sComments,
            copyright: this._sCopyright,
            sourceData: this._sSourceData
        }
		}

    protected createAsset(): AIAsset {
			return {
            unit: this.createUnit(),
            upAxis: Exporter.UP_AXIS,
            title: this._sTitle,
            subject: this._sSubject,
            created: Exporter.getDate(),
            modified: Exporter.getDate(),
            contributor: this.createContributor(),
            keywords: this._pKeywords
        }
		}

    createDocument(): AIDocument {
        var pDocument: AIDocument = {
            asset: this.createAsset(),
            library: [],
            scenes: null
        }

			var pLibrary: AILibrary = this._pLibrary;

        for (var iGuid in pLibrary) {
            var pLibEntry: AILibraryEntry = pLibrary[iGuid];
            pDocument.library.push(pLibEntry.entry);
        }

        return pDocument;
    }

    export(eFormat: AEDocumentFormat = AEDocumentFormat.JSON): Blob {
        var pDocument: AIDocument = this.createDocument();

        if (eFormat === AEDocumentFormat.JSON) {
            return Exporter.exportAsJSON(pDocument);
        }
        else if (eFormat === AEDocumentFormat.BINARY_JSON) {
            return Exporter.exportAsJSONBinary(pDocument);
        }

        return null;
    }

    saveAs(sName: string, eFormat?: AEDocumentFormat): void {
        saveAs(this.export(eFormat), sName);
    }

    static exportAsJSON(pDocument: AIDocument): Blob {
        return new Blob([JSON.stringify(pDocument/*, null, "\t"*/)], { type: "application/json;charset=utf-8" });
    }

    static exportAsJSONBinary(pDocument: AIDocument): Blob {
        return new Blob([io.dump(pDocument)], { type: "application/octet-stream" });
    }

    protected static /** inline */ getDate(): string {
        return (new Date()).toString();
    }
}

export = Exporter;