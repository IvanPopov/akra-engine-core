/// <reference path="../debug.ts" />

/// <reference path="PassInputBlend.ts" />
/// <reference path="VariableContainer.ts" />


module akra.fx {
    export class ComponentPassInputBlend implements IAFXComponentPassInputBlend {
        private _pUniformsContainer: VariableContainer = null;
        private _pForeignsContainer: VariableContainer = null;
        private _pTexturesContainer: VariableContainer = null;

        private _pFreePassInputBlendList: IAFXPassInputBlend[] = null;

        getUniforms(): IAFXVariableContainer {
            return this._pUniformsContainer;
        }

        getTextures(): IAFXVariableContainer {
            return this._pTexturesContainer;
        }

        getForeigns(): IAFXVariableContainer {
            return this._pForeignsContainer;
        }

        constructor() {
            this._pUniformsContainer = new VariableContainer();
            this._pForeignsContainer = new VariableContainer();
            this._pTexturesContainer = new VariableContainer();

            for (var i: uint = 0; i < 16; i++) {
                this._pTexturesContainer.addSystemEntry("TEXTURE" + i.toString(), EAFXShaderVariableType.k_Texture);
            }
        }

        addDataFromPass(pPass: IAFXPassInstruction): void {
            var pUniformMap: IAFXVariableDeclMap = pPass._getFullUniformMap();
            var pForeignMap: IAFXVariableDeclMap = pPass._getFullForeignMap();
            var pTextureMap: IAFXVariableDeclMap = pPass._getFullTextureMap();

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

        getPassInput(): IAFXPassInputBlend {
            if (this._pFreePassInputBlendList.length === 0) {
                this.generateNewPassInputs();
            }

            return this._pFreePassInputBlendList.pop();
        }

        releasePassInput(pInput: IAFXPassInputBlend): void {
            this._pFreePassInputBlendList.push(pInput);
        }

        private addUniformVariable(pVariable: IAFXVariableDeclInstruction,
            sPrevName: string, sPrevRealName: string): void {
            var sName: string = pVariable._getName();
            var sRealName: string = pVariable._getRealName();

            var pHasVar: IAFXVariableDeclInstruction = this._pUniformsContainer.getVarByRealName(sRealName);

            if (isDefAndNotNull(pHasVar) && !pHasVar._getType()._isEqual(pVariable._getType())) {
                debug.warn("You used uniforms with the same real-names('" + sRealName + "'). Now we don`t work very well with that.");
                return;
            }

            this._pUniformsContainer.add(pVariable);
        }

        private generateNewPassInputs(nCount: uint = 5): void {
            for (var i: uint = 0; i < nCount; i++) {
                var pPassInput: IAFXPassInputBlend = new PassInputBlend(this);
                this._pFreePassInputBlendList.push(pPassInput);
            }
        }
    }
}

