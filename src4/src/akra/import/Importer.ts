/// <reference path="../idl/AIDocument.ts" />
/// <reference path="../idl/AIMap.ts" />
/// <reference path="../idl/AIAnimationContainer.ts" />
/// <reference path="../idl/AIAnimationBlend.ts" />

import logger = require("logger");
import io = require("io");
import conv = require("conv");
//import animation = require("animation");

import Mat4 = require("math/Mat4");

class Importer {

    private _pDocument: AIDocument = null;
    private _pLibrary: AILibrary = <AILibrary><any>{};

    constructor(private _pEngine: AIEngine) {

    }

    /** inline */ getEngine(): AIEngine {
        return this._pEngine;
    }

    /** inline */ getDocument(): AIDocument {
        return this._pDocument;
    }

    /** inline */ getLibrary(): AILibrary {
        return this._pLibrary;
    }

    ///** inline */ getLibrary(): I

    import(pData: string, eFormat?: AEDocumentFormat): Importer;
    import(pData: Object, eFormat?: AEDocumentFormat): Importer;
    import(pData: ArrayBuffer, eFormat?: AEDocumentFormat): Importer;
    import(pData: Blob, eFormat?: AEDocumentFormat): Importer;
    import(pData: any, eFormat: AEDocumentFormat = AEDocumentFormat.JSON): Importer {
        if (eFormat !== AEDocumentFormat.JSON && eFormat !== AEDocumentFormat.BINARY_JSON) {
            logger.critical("TODO: Add support for all formats");
        }

        if (eFormat === AEDocumentFormat.JSON) {
            this.loadDocument(this.importFromJSON(pData));
        }
        else if (eFormat === AEDocumentFormat.BINARY_JSON) {
            this.loadDocument(this.importFromBinaryJSON(<ArrayBuffer>pData));
        }

        return this;
    }

    loadDocument(pDocument: AIDocument): Importer {
        this._pDocument = pDocument;
        this.updateLibrary();
        return this;
    }


    protected importFromBinaryJSON(pData: ArrayBuffer): AIDocument {
        return io.undump(pData);
    }

    protected importFromJSON(pData): AIDocument {
        var sData: string = null;

        if (isArrayBuffer(pData)) {
            sData = conv.abtos(<ArrayBuffer>pData);
        }
        else if (isString(pData)) {
            sData = <string>pData;
        }
        else if (isBlob(pData)) {
            logger.critical("TODO: Blob support!");
        }
        else {
            return <AIDocument>pData;
        }

        return JSON.parse(sData);/*<AIDocument>util.parseJSON(sData);*/
    }

    protected updateLibrary(): void {
        var pDocument: AIDocument = this.getDocument();
        var pLibrary: AILibrary = this.getLibrary();

        for (var i: int = 0; i < pDocument.library.length; ++i) {
            var pEntry: AIDataEntry = pDocument.library[i];
            var iGuid: int = pEntry.guid;

            pLibrary[iGuid] = { guid: iGuid, data: null, entry: pEntry };
        };
    }

    protected findEntries(eType: AEDocumentEntry, fnCallback: (pEntry: AILibraryEntry, n?: uint) => boolean): void {
        var pLibrary: AILibrary = this.getLibrary();
        var i: uint = 0;

        for (var iGuid in pLibrary) {
            var pEntry: AILibraryEntry = pLibrary[iGuid];

            if (!isNull(pEntry.entry) && pEntry.entry.type === eType) {
                if (fnCallback.call(this, pEntry, i++) === false) {
                    return;
                }
            }
        }
    }

    protected findEntryByIndex(eType: AEDocumentEntry, i: uint): AILibraryEntry {
        var pEntry: AILibraryEntry = null;
        this.findEntries(eType, (pLibEntry: AILibraryEntry, n?: uint): boolean => {
            pEntry = pLibEntry;

            if (i === n) {
                return false;
            }
        });

        return pEntry;
    }

    protected find(eType: AEDocumentEntry, fnCallback: (pData: any, n?: uint) => boolean): void {
        this.findEntries(eType, (pEntry: AILibraryEntry, n?: uint): boolean => {
            if (fnCallback.call(this, pEntry.data, n) === false) {
                return;
            }
        });
    }

    protected /** inline */ findByIndex(eType: AEDocumentEntry, i: uint = 0): any {
        return this.findEntryByIndex(eType, i).data;
    }

    protected /** inline */ findFirst(eType: AEDocumentEntry): any {
        return this.findByIndex(eType, 0);
    }

    getController(iContrller: int = 0): AIAnimationController {
        return <AIAnimationController>this.decodeEntry(this.findEntryByIndex(AEDocumentEntry.k_Controller, iContrller).entry);
    }

    protected decodeEntry(pEntry: AIDataEntry): any {
        if (isNull(pEntry)) {
            return null;
        }

        var pData: any = this.getLibrary()[pEntry.guid].data;

        if (!isNull(pData)) {
            return pData;
        }

        switch (pEntry.type) {
            case AEDocumentEntry.k_Controller:
                pData = this.decodeControllerEntry(<AIControllerEntry>pEntry);
                break;
            case AEDocumentEntry.k_Animation:
                pData = this.decodeAnimationEntry(<AIAnimationEntry>pEntry);
                break;
            case AEDocumentEntry.k_AnimationBlend:
                pData = this.decodeAnimationBlendEntry(<AIAnimationBlendEntry>pEntry);
                break;
            case AEDocumentEntry.k_AnimationContainer:
                pData = this.decodeAnimationContainerEntry(<AIAnimationContainerEntry>pEntry);
                break;
        }

        if (!isNull(pData)) {
            this.registerData(pEntry.guid, pData);
            return pData;
        }

        logger.warn("USED UNKNOWN TYPE FOR DECODING!!", pEntry.type);
        return null;
    }

    protected registerData(iGuid: int, pData: any): void {
        var pLibEntry: AILibraryEntry = this.getLibrary()[iGuid];
        pLibEntry.data = pData;
    }

    protected decodeInstance(iGuid: int): any {
        var pLibEntry: AILibraryEntry = this.getLibrary()[iGuid];

        if (!isNull(pLibEntry.data)) {
            return pLibEntry.data;
        }

        return this.decodeEntry(pLibEntry.entry);
    }

    protected decodeEntryList(pEntryList: AIDataEntry[], fnCallback: (pData: any) => void): void {
        if (isNull(pEntryList)) {
            return;
        }

        for (var i: int = 0; i < pEntryList.length; ++i) {
            fnCallback.call(this, this.decodeEntry(pEntryList[i]));
        }
    }

    protected decodeInstanceList(pInstances: int[], fnCallback: (pData: any, n?: int) => void): void {
        for (var i: int = 0; i < pInstances.length; ++i) {
            fnCallback.call(this, this.decodeInstance(pInstances[i]), i);
        }
    }

    protected decodeAnimationFrame(pEntry: AIAnimationFrameEntry): AIPositionFrame {
        var pFrame: AIPositionFrame = new animation.PositionFrame(pEntry.time, new Mat4(pEntry.matrix), pEntry.weight);
        //FIXME: avoid capability problems
        pFrame.type = isInt(pEntry.type) ? pEntry.type : AEAnimationInterpolations.SPHERICAL;
        return pFrame;
    }

    protected decodeAnimationTrack(pEntry: AIAnimationTrackEntry): AIAnimationTrack {
        var pTrack: AIAnimationTrack = animation.createTrack(pEntry.targetName);

        //TODO: decode base entry
        //TODO: set interpolation mode
        //TODO: set target

        for (var i: int = 0; i < pEntry.keyframes.length; ++i) {
            pTrack.keyFrame(this.decodeAnimationFrame(pEntry.keyframes[i]));
        };

        return pTrack;
    }

    protected decodeAnimationEntry(pEntry: AIAnimationEntry): AIAnimation {
        var pAnimation: AIAnimation = animation.createAnimation(pEntry.name);

        pAnimation.extra = pEntry.extra;

        //TODO: load read targets!!

        for (var i: int = 0; i < pEntry.tracks.length; ++i) {
            pAnimation.push(this.decodeAnimationTrack(pEntry.tracks[i]));
        };

        return pAnimation;
    }

    protected decodeAnimationBlendEntry(pEntry: AIAnimationBlendEntry): AIAnimationBlend {
        var pBlend: AIAnimationBlend = animation.createBlend(pEntry.name);

        pBlend.extra = pEntry.extra;

        //TODO: decode base entry!
        //TODO: set targets

        for (var i: int = 0; i < pEntry.animations.length; ++i) {
            var pElement: AIAnimationBlendElementEntry = pEntry.animations[i];

            var pAnimation: AIAnimationBase = <AIAnimationBase>this.decodeInstance(pElement.animation);
            var fWeight: float = pElement.weight;
            var pMask: AIMap<float> = pElement.mask;
            // var fAcceleration: float = pEntry.acceleration;

            pBlend.setAnimation(i, pAnimation);
            pBlend.setAnimationWeight(i, fWeight);
            pBlend.setAnimationMask(i, pMask);
        };

        return pBlend;
    }

    protected decodeAnimationContainerEntry(pEntry: AIAnimationContainerEntry): AIAnimationContainer {
        var pAnimation: AIAnimationBase = this.decodeInstance(pEntry.animation);
        var pContainer: AIAnimationContainer = animation.createContainer(pAnimation, pEntry.name);

        pContainer.extra = pEntry.extra;

        //TODO: decode base entry!
        //TODO: set targets

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
    }

    protected decodeControllerEntry(pEntry: AIControllerEntry): AIAnimationController {
        var pController: AIAnimationController = this.getEngine().createAnimationController(pEntry.name, pEntry.options);
        pController.name = pEntry.name;

        this.decodeInstanceList(pEntry.animations, (pAnimation: AIAnimationBase) => {
            pController.addAnimation(pAnimation);
        });

        return pController;
    }
}


export = Importer;