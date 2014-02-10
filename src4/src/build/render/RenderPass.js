/// <reference path="../idl/IRenderPass.ts" />
/// <reference path="../guid.ts" />
var akra;
(function (akra) {
    (function (render) {
        var RenderPass = (function () {
            function RenderPass(pTechnique, iPass) {
                this.guid = akra.guid();
                this._pTechnique = null;
                this._pRenderTarget = null;
                this._iPassNumber = 0;
                this._pInput = null;
                this._isActive = true;
                this._pTechnique = pTechnique;
                this._iPassNumber = iPass;
            }
            RenderPass.prototype.setForeign = function (sName, fValue) {
                this._pInput.setForeign(sName, fValue);
            };

            RenderPass.prototype.setTexture = function (sName, pTexture) {
                this._pInput.setTexture(sName, pTexture);
            };

            RenderPass.prototype.setUniform = function (sName, pValue) {
                this._pInput.setUniform(sName, pValue);
            };

            RenderPass.prototype.setStruct = function (sName, pValue) {
                this._pInput.setStruct(sName, pValue);
            };

            RenderPass.prototype.setRenderState = function (eState, eValue) {
                this._pInput.setRenderState(eState, eValue);
            };

            RenderPass.prototype.setSamplerTexture = function (sName, pTexture) {
                this._pInput.setSamplerTexture(sName, pTexture);
            };

            //  setSamplerState(sName: string, pState: IAFXSamplerState): void {
            // 	this._pInput.setSamplerState(sName, pState);
            // }
            RenderPass.prototype.getRenderTarget = function () {
                return this._pRenderTarget;
            };

            RenderPass.prototype.setRenderTarget = function (pTarget) {
                this._pRenderTarget = pTarget;
            };

            RenderPass.prototype.getPassInput = function () {
                return this._pInput;
            };

            RenderPass.prototype.setPassInput = function (pInput, isNeedRelocate) {
                if (isNeedRelocate) {
                    //pInput._copyFrom(pInput);
                }

                if (!akra.isNull(this._pInput)) {
                    this._pInput._release();
                }

                this._pInput = pInput;
            };

            RenderPass.prototype.blend = function (sComponentName, iPass) {
                return this._pTechnique.addComponent(sComponentName, this._iPassNumber, iPass);
            };

            RenderPass.prototype.activate = function () {
                this._isActive = true;
            };

            RenderPass.prototype.deactivate = function () {
                this._isActive = false;
            };

            RenderPass.prototype.isActive = function () {
                return this._isActive;
            };

            RenderPass.prototype.relocateOldInput = function (pNewInput) {
                //TODO: copy old uniforms to new
            };
            return RenderPass;
        })();
        render.RenderPass = RenderPass;
    })(akra.render || (akra.render = {}));
    var render = akra.render;
})(akra || (akra = {}));
//# sourceMappingURL=RenderPass.js.map
