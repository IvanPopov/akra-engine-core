
import debug = require("debug");

import PassInputBlend = require("fx/PassInputBlend");
import VariableContainer = require("fx/VariableContainer");


class ComponentPassInputBlend implements AIAFXComponentPassInputBlend {
    private _pUniformsContainer: VariableContainer = null;
    private _pForeignsContainer: VariableContainer = null;
    private _pTexturesContainer: VariableContainer = null;

    private _pFreePassInputBlendList: AIAFXPassInputBlend[] = null;

    get uniforms(): AIAFXVariableContainer {
        return this._pUniformsContainer;
    }

    get textures(): AIAFXVariableContainer {
        return this._pTexturesContainer;
    }

    get foreigns(): AIAFXVariableContainer {
        return this._pForeignsContainer;
    }

    constructor() {
        this._pUniformsContainer = new VariableContainer();
        this._pForeignsContainer = new VariableContainer();
        this._pTexturesContainer = new VariableContainer();

        for (var i: uint = 0; i < 16; i++) {
            this._pTexturesContainer.addSystemEntry("TEXTURE" + i.toString(), AEAFXShaderVariableType.k_Texture);
        }
    }

    addDataFromPass(pPass: AIAFXPassInstruction): void {
        var pUniformMap: AIAFXVariableDeclMap = pPass._getFullUniformMap();
        var pForeignMap: AIAFXVariableDeclMap = pPass._getFullForeignMap();
        var pTextureMap: AIAFXVariableDeclMap = pPass._getFullTextureMap();

        for (var i in pForeignMap) {
            this._pForeignsContainer.add(pForeignMap[i]);
        }

        for (var i in pTextureMap) {
            this._pTexturesContainer.add(pTextureMap[i]);
        }

        for (var i in pUniformMap) {
            this.addUniformVariable(pUniformMap[i], "", "");
        }

    }

    finalizeInput(): void {
        this._pUniformsContainer.finalize();
        this._pForeignsContainer.finalize();
        this._pTexturesContainer.finalize();

        this._pFreePassInputBlendList = [];

        this.generateNewPassInputs();
    }

    getPassInput(): AIAFXPassInputBlend {
        if (this._pFreePassInputBlendList.length === 0) {
            this.generateNewPassInputs();
        }

        return this._pFreePassInputBlendList.pop();
    }

    releasePassInput(pInput: AIAFXPassInputBlend): void {
        this._pFreePassInputBlendList.push(pInput);
    }

    private addUniformVariable(pVariable: AIAFXVariableDeclInstruction,
        sPrevName: string, sPrevRealName: string): void {
        var sName: string = pVariable.getName();
        var sRealName: string = pVariable.getRealName();

        var pHasVar: AIAFXVariableDeclInstruction = this._pUniformsContainer.getVarByRealName(sRealName);

        if (isDefAndNotNull(pHasVar) && !pHasVar.getType().isEqual(pVariable.getType())) {
            debug.warn("You used uniforms with the same real-names. Now we don`t work very well with that.");
            return;
        }

        this._pUniformsContainer.add(pVariable);
    }

    private generateNewPassInputs(nCount: uint = 5): void {
        for (var i: uint = 0; i < nCount; i++) {
            var pPassInput: AIAFXPassInputBlend = new PassInputBlend(this);
            this._pFreePassInputBlendList.push(pPassInput);
        }
    }
}


export = ComponentPassInputBlend;