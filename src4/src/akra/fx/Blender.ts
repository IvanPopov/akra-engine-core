/// <reference path="../idl/AIAFXBlender.ts" />
/// <reference path="../idl/AIAFXInstruction.ts" />

import HashTree = require("util/HashTree");
import debug = require("debug");
import logger = require("logger");
import ComponentBlend = require("fx/ComponentBlend");
import PassBlend = require("fx/PassBlend");

import fx = require("fx");
import DEFAULT_SHIFT = fx.DEFAULT_SHIFT;
import ALL_PASSES = fx.ALL_PASSES;

class Blender implements AIAFXBlender {
    private _pComposer: AIAFXComposer = null;


    private _pComponentBlendByHashMap: AIAFXComponentBlendMap = null;

    private _pBlendWithComponentMap: AIAFXComponentBlendMap = null;
    private _pBlendWithBlendMap: AIAFXComponentBlendMap = null;

    private _pPassBlendByHashMap: AIAFXPassBlendMap = null;
    private _pPassBlendByIdMap: AIAFXPassBlendMap = null;

    private _pPassBlendHashTree: HashTree<AIAFXPassBlend> = null;

    constructor(pComposer: AIAFXComposer) {
        this._pComposer = pComposer;

        this._pComponentBlendByHashMap = <AIAFXComponentBlendMap>{};

        this._pBlendWithComponentMap = <AIAFXComponentBlendMap>{};
        this._pBlendWithBlendMap = <AIAFXComponentBlendMap>{};

        this._pPassBlendByHashMap = <AIAFXPassBlendMap>{};
        this._pPassBlendByIdMap = <AIAFXPassBlendMap>{};

        this._pPassBlendHashTree = new HashTree();
    }

    addComponentToBlend(pComponentBlend: AIAFXComponentBlend,
        pComponent: AIAFXComponent, iShift: int, iPass: uint): AIAFXComponentBlend {

        if (!isNull(pComponentBlend) && pComponentBlend.containComponent(pComponent, iShift, iPass)) {
            debug.warn("You try to add already used component '" + pComponent.findResourceName() + "' in blend.");
            return pComponentBlend;
        }

        if (iShift === DEFAULT_SHIFT) {
            if (pComponent.isPostEffect()) {
                iShift = pComponentBlend.getTotalPasses();
            }
            else {
                iShift = 0;
            }
        }

        var sBlendPartHash: string = isDefAndNotNull(pComponentBlend) ? pComponentBlend.getGuid().toString() : "";
        var sComponentPartHash: string = pComponent.getHash(iShift, iPass);
        var sShortHash: string = sBlendPartHash + "+" + sComponentPartHash;

        if (isDef(this._pBlendWithComponentMap[sShortHash])) {
            return this._pBlendWithComponentMap[sShortHash];
        }

        var pNewBlend: AIAFXComponentBlend = null;

        if (isNull(pComponentBlend)) {
            pNewBlend = new ComponentBlend(this._pComposer);
        }
        else {
            pNewBlend = pComponentBlend.clone();
        }

        var pTechnique: AIAFXTechniqueInstruction = pComponent.getTechnique();
        var pTechComponentList: AIAFXComponent[] = pTechnique.getFullComponentList();
        var pTechComponentShiftList: int[] = pTechnique.getFullComponentShiftList();

        if (iPass === ALL_PASSES) {
            if (!isNull(pTechComponentList)) {
                for (var i: uint = 0; i < pTechComponentList.length; i++) {
                    pNewBlend.addComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift, ALL_PASSES);
                }
            }

            pNewBlend.addComponent(pComponent, iShift, ALL_PASSES);
        }
        else {
            if (!isNull(pTechComponentList)) {
                for (var i: uint = 0; i < pTechComponentList.length; i++) {
                    pNewBlend.addComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift, iPass - pTechComponentShiftList[i]);
                }
            }

            pNewBlend.addComponent(pComponent, iShift, iPass);
        }

        this._pBlendWithComponentMap[sShortHash] = pNewBlend;

        var sNewBlendHash: string = pNewBlend.getHash();

        if (isDef(this._pComponentBlendByHashMap[sNewBlendHash])) {
            return this._pComponentBlendByHashMap[sNewBlendHash];
        }
        else {
            this._pComponentBlendByHashMap[sNewBlendHash] = pNewBlend;
        }

        return pNewBlend;
    }

    removeComponentFromBlend(pComponentBlend: AIAFXComponentBlend,
        pComponent: AIAFXComponent, iShift: int, iPass: uint): AIAFXComponentBlend {
        if (isNull(pComponentBlend)) {
            logger.warn("You try to remove component '" + pComponent.getName() +
                "' with shift " + iShift.toString() + " from empty blend.");
            return null;
        }

        var pComponentInfo: AIAFXComponentInfo = pComponentBlend.findAddedComponentInfo(pComponent, iShift, iPass);
        if (isNull(pComponentInfo)) {
            logger.warn("You try to remove component '" + pComponent.getName() +
                "' with shift " + iShift.toString() + " from blend that not contain it.");
            return null;
        }

        if (iShift === DEFAULT_SHIFT) {
            if (pComponent.isPostEffect()) {
                iShift = pComponentInfo.shift;
            }
            else {
                iShift = 0;
            }
        }

        var sBlendPartHash: string = isDefAndNotNull(pComponentBlend) ? pComponentBlend.getGuid().toString() : "";
        var sComponentPartHash: string = pComponent.getHash(iShift, iPass);
        var sShortHash: string = sBlendPartHash + "-" + sComponentPartHash;

        if (isDef(this._pBlendWithComponentMap[sShortHash])) {
            return this._pBlendWithComponentMap[sShortHash];
        }

        var pNewBlend: AIAFXComponentBlend = pComponentBlend.clone();

        var pTechnique: AIAFXTechniqueInstruction = pComponent.getTechnique();
        var pTechComponentList: AIAFXComponent[] = pTechnique.getFullComponentList();
        var pTechComponentShiftList: int[] = pTechnique.getFullComponentShiftList();

        if (iPass === ALL_PASSES) {
            if (!isNull(pTechComponentList)) {
                for (var i: uint = 0; i < pTechComponentList.length; i++) {
                    pNewBlend.removeComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift, ALL_PASSES);
                }
            }

            pNewBlend.removeComponent(pComponent, iShift, ALL_PASSES);
        }
        else {
            if (!isNull(pTechComponentList)) {
                for (var i: uint = 0; i < pTechComponentList.length; i++) {
                    pNewBlend.removeComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift, iPass - pTechComponentShiftList[i]);
                }
            }

            pNewBlend.removeComponent(pComponent, iShift, iPass);
        }

        this._pBlendWithComponentMap[sShortHash] = pNewBlend;

        var sNewBlendHash: string = pNewBlend.getHash();

        if (isDef(this._pComponentBlendByHashMap[sNewBlendHash])) {
            return this._pComponentBlendByHashMap[sNewBlendHash];
        }
        else {
            this._pComponentBlendByHashMap[sNewBlendHash] = pNewBlend;
        }

        return pNewBlend;
    }

    addBlendToBlend(pComponentBlend: AIAFXComponentBlend,
        pAddBlend: AIAFXComponentBlend, iShift: int): AIAFXComponentBlend {

        //TODO: ADD CORRECT BLENDING FOR POSTEFFECTS
        if (isNull(pComponentBlend)) {
            return pAddBlend;
        }

        if (isNull(pAddBlend)) {
            return pComponentBlend;
        }

        var sShortHash: string = pComponentBlend.getGuid().toString() + "+" + pAddBlend.getGuid().toString();
        if (isDef(this._pBlendWithBlendMap[sShortHash])) {
            return this._pBlendWithBlendMap[sShortHash];
        }

        var pNewBlend: AIAFXComponentBlend = pComponentBlend.clone();

        var pAddComponentInfoList: AIAFXComponentInfo[] = pAddBlend._getComponentInfoList();

        for (var i: uint = 0; i < pAddComponentInfoList.length; i++) {
            pNewBlend.addComponent(pAddComponentInfoList[i].component,
                pAddComponentInfoList[i].shift + iShift,
                pAddComponentInfoList[i].pass);
        }

        this._pBlendWithBlendMap[sShortHash] = pNewBlend;

        var sNewBlendHash: string = pNewBlend.getHash();

        if (isDef(this._pComponentBlendByHashMap[sNewBlendHash])) {
            return this._pComponentBlendByHashMap[sNewBlendHash];
        }
        else {
            this._pComponentBlendByHashMap[sNewBlendHash] = pNewBlend;
        }

        return pNewBlend;
    }

    generatePassBlend(pPassList: AIAFXPassInstruction[],
        pStates: any, pForeigns: any, pUniforms: any): AIAFXPassBlend {

        this._pPassBlendHashTree.release();

        for (var i: uint = 0; i < pPassList.length; i++) {
            var pPass: AIAFXPassInstruction = pPassList[i];

            pPass.evaluate(pStates, pForeigns, pUniforms);

            var pVertexShader: AIAFXFunctionDeclInstruction = pPass.getVertexShader();
            var pPixelShader: AIAFXFunctionDeclInstruction = pPass.getPixelShader();

            this._pPassBlendHashTree.has(isNull(pVertexShader) ? 0 : pVertexShader.getGuid());
            this._pPassBlendHashTree.has(isNull(pPixelShader) ? 0 : pPixelShader.getGuid());
        }

        var pBlend: AIAFXPassBlend = this._pPassBlendHashTree.getContent();
        if (!pBlend) {
            var pNewPassBlend: AIAFXPassBlend = new PassBlend(this._pComposer);
            var isOk: boolean = pNewPassBlend.initFromPassList(pPassList);

            if (!isOk) {
                return null;
            }

            this._pPassBlendHashTree.addContent(pNewPassBlend);
            this._pPassBlendByIdMap[pNewPassBlend.getGuid()] = pNewPassBlend;
            return pNewPassBlend;
        }
        else {
            return pBlend;
        }
    }

    getPassBlendById(id: uint): AIAFXPassBlend {
        return this._pPassBlendByIdMap[id] || null;
    }
}

export = Blender;