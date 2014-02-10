/// <reference path="../debug.ts" />
var akra;
(function (akra) {
    /// <reference path="PassInputBlend.ts" />
    /// <reference path="VariableContainer.ts" />
    (function (fx) {
        var ComponentPassInputBlend = (function () {
            function ComponentPassInputBlend() {
                this._pUniformsContainer = null;
                this._pForeignsContainer = null;
                this._pTexturesContainer = null;
                this._pFreePassInputBlendList = null;
                this._pUniformsContainer = new akra.fx.VariableContainer();
                this._pForeignsContainer = new akra.fx.VariableContainer();
                this._pTexturesContainer = new akra.fx.VariableContainer();

                for (var i = 0; i < 16; i++) {
                    this._pTexturesContainer.addSystemEntry("TEXTURE" + i.toString(), 2 /* k_Texture */);
                }
            }
            ComponentPassInputBlend.prototype.getUniforms = function () {
                return this._pUniformsContainer;
            };

            ComponentPassInputBlend.prototype.getTextures = function () {
                return this._pTexturesContainer;
            };

            ComponentPassInputBlend.prototype.getForeigns = function () {
                return this._pForeignsContainer;
            };

            ComponentPassInputBlend.prototype.addDataFromPass = function (pPass) {
                var pUniformMap = pPass._getFullUniformMap();
                var pForeignMap = pPass._getFullForeignMap();
                var pTextureMap = pPass._getFullTextureMap();

                for (var i in pForeignMap) {
                    this._pForeignsContainer.add(pForeignMap[i]);
                }

                for (var i in pTextureMap) {
                    this._pTexturesContainer.add(pTextureMap[i]);
                }

                for (var i in pUniformMap) {
                    this.addUniformVariable(pUniformMap[i], "", "");
                }
            };

            ComponentPassInputBlend.prototype.finalizeInput = function () {
                this._pUniformsContainer.finalize();
                this._pForeignsContainer.finalize();
                this._pTexturesContainer.finalize();

                this._pFreePassInputBlendList = [];

                this.generateNewPassInputs();
            };

            ComponentPassInputBlend.prototype.getPassInput = function () {
                if (this._pFreePassInputBlendList.length === 0) {
                    this.generateNewPassInputs();
                }

                return this._pFreePassInputBlendList.pop();
            };

            ComponentPassInputBlend.prototype.releasePassInput = function (pInput) {
                this._pFreePassInputBlendList.push(pInput);
            };

            ComponentPassInputBlend.prototype.addUniformVariable = function (pVariable, sPrevName, sPrevRealName) {
                var sName = pVariable.getName();
                var sRealName = pVariable.getRealName();

                var pHasVar = this._pUniformsContainer.getVarByRealName(sRealName);

                if (akra.isDefAndNotNull(pHasVar) && !pHasVar.getType().isEqual(pVariable.getType())) {
                    akra.debug.warn("You used uniforms with the same real-names. Now we don`t work very well with that.");
                    return;
                }

                this._pUniformsContainer.add(pVariable);
            };

            ComponentPassInputBlend.prototype.generateNewPassInputs = function (nCount) {
                if (typeof nCount === "undefined") { nCount = 5; }
                for (var i = 0; i < nCount; i++) {
                    var pPassInput = new akra.fx.PassInputBlend(this);
                    this._pFreePassInputBlendList.push(pPassInput);
                }
            };
            return ComponentPassInputBlend;
        })();
        fx.ComponentPassInputBlend = ComponentPassInputBlend;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=ComponentPassInputBlend.js.map
