/// <reference path="../../idl/IRenderMethod.ts" />
/// <reference path="../../idl/IAFXComposer.ts" />
/// <reference path="../../idl/IAFXPassInputBlend.ts" />
/// <reference path="../../common.ts" />
/// <reference path="../../fx/fx.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (pool) {
        /// <reference path="../ResourcePoolItem.ts" />
        (function (resources) {
            var RenderMethod = (function (_super) {
                __extends(RenderMethod, _super);
                function RenderMethod() {
                    _super.apply(this, arguments);
                    this._pEffect = null;
                    this._pSurfaceMaterial = null;
                    this._pPassInputList = null;
                    this._nTotalPasses = 0;
                }
                RenderMethod.prototype.getEffect = function () {
                    return this._pEffect;
                };

                RenderMethod.prototype.setEffect = function (pEffect) {
                    if (!akra.isNull(this._pEffect)) {
                        this.unsync(this._pEffect, 1 /* LOADED */);
                        this._pEffect.altered.disconnect(this, this.updateEffect, 1 /* BROADCAST */);
                        this._pEffect.release();
                    }

                    this._pEffect = pEffect;

                    if (!akra.isNull(pEffect)) {
                        this.sync(this._pEffect, 1 /* LOADED */);
                        this._pEffect.altered.connect(this, this.updateEffect, 1 /* BROADCAST */);
                        this._pEffect.addRef();
                    }

                    this.updateEffect(pEffect);
                };

                RenderMethod.prototype.getSurfaceMaterial = function () {
                    return this._pSurfaceMaterial;
                };

                RenderMethod.prototype.setSurfaceMaterial = function (pMaterial) {
                    if (!akra.isNull(this._pSurfaceMaterial)) {
                        this.unsync(this._pSurfaceMaterial, 1 /* LOADED */);
                        this._pSurfaceMaterial.altered.disconnect(this, this.notifyAltered, 1 /* BROADCAST */);
                        this._pSurfaceMaterial.release();
                    }

                    this._pSurfaceMaterial = pMaterial;

                    if (!akra.isNull(pMaterial)) {
                        this.sync(this._pSurfaceMaterial, 1 /* LOADED */);
                        this._pSurfaceMaterial.altered.connect(this, this.notifyAltered, 1 /* BROADCAST */);
                    }

                    this._pSurfaceMaterial.addRef();

                    this.notifyAltered();
                };

                RenderMethod.prototype.getMaterial = function () {
                    return this.getSurfaceMaterial().getMaterial();
                };

                RenderMethod.prototype.isEqual = function (pRenderMethod) {
                    return false;
                };

                RenderMethod.prototype.setForeign = function (sName, pValue, iPass) {
                    if (typeof iPass === "undefined") { iPass = akra.fx.ALL_PASSES; }
                    if (iPass === akra.fx.ALL_PASSES) {
                        for (var i = 0; i < this._nTotalPasses; i++) {
                            this.setForeign(sName, pValue, i);
                        }

                        return;
                    }

                    if (iPass < 0 || iPass >= this._nTotalPasses) {
                        akra.debug.error("RenderMethod::setForeign : wrong number of pass (" + iPass + ")");
                        return;
                    }

                    this._pPassInputList[iPass].setForeign(sName, pValue);
                };

                RenderMethod.prototype.setUniform = function (sName, pValue, iPass) {
                    if (typeof iPass === "undefined") { iPass = akra.fx.ALL_PASSES; }
                    if (iPass === akra.fx.ALL_PASSES) {
                        for (var i = 0; i < this._nTotalPasses; i++) {
                            this.setUniform(sName, pValue, i);
                        }

                        return;
                    }

                    if (iPass < 0 || iPass >= this._nTotalPasses) {
                        akra.debug.error("RenderMethod::setUniform : wrong number of pass (" + iPass + ")");
                        return;
                    }

                    this._pPassInputList[iPass].setUniform(sName, pValue);
                };

                RenderMethod.prototype.setTexture = function (sName, pValue, iPass) {
                    if (typeof iPass === "undefined") { iPass = akra.fx.ALL_PASSES; }
                    if (iPass === akra.fx.ALL_PASSES) {
                        for (var i = 0; i < this._nTotalPasses; i++) {
                            this.setTexture(sName, pValue, i);
                        }

                        return;
                    }

                    if (iPass < 0 || iPass >= this._nTotalPasses) {
                        akra.debug.error("RenderMethod::setTexture : wrong number of pass (" + iPass + ")");
                        return;
                    }

                    this._pPassInputList[iPass].setTexture(sName, pValue);
                };

                RenderMethod.prototype.setRenderState = function (eState, eValue, iPass) {
                    if (typeof iPass === "undefined") { iPass = akra.fx.ALL_PASSES; }
                    if (iPass === akra.fx.ALL_PASSES) {
                        for (var i = 0; i < this._nTotalPasses; i++) {
                            this.setRenderState(eState, eValue, i);
                        }

                        return;
                    }

                    if (iPass < 0 || iPass >= this._nTotalPasses) {
                        akra.debug.error("RenderMethod::setRenderState : wrong number of pass (" + iPass + ")");
                        return;
                    }

                    this._pPassInputList[iPass].setRenderState(eState, eValue);
                };

                RenderMethod.prototype.setSamplerTexture = function (sName, pTexture, iPass) {
                    if (typeof iPass === "undefined") { iPass = akra.fx.ALL_PASSES; }
                    if (iPass === akra.fx.ALL_PASSES) {
                        for (var i = 0; i < this._nTotalPasses; i++) {
                            this.setSamplerTexture(sName, pTexture, i);
                        }

                        return;
                    }

                    if (iPass < 0 || iPass >= this._nTotalPasses) {
                        akra.debug.error("RenderMethod::setSamplerTexture : wrong number of pass (" + iPass + ")");
                        return;
                    }

                    this._pPassInputList[iPass].setSamplerTexture(sName, pTexture);
                };

                RenderMethod.prototype._getPassInput = function (iPass) {
                    return this._pPassInputList[iPass];
                };

                RenderMethod.prototype.updateEffect = function (pEffect) {
                    if (akra.isNull(pEffect)) {
                        for (var i = 0; i < this._nTotalPasses; i++) {
                            var pOldInput = this._pPassInputList[i];

                            if (akra.isDefAndNotNull(pOldInput)) {
                                pOldInput._release();
                                this._pPassInputList[i] = null;
                            }
                        }

                        this._nTotalPasses = 0;
                        this.notifyAltered();
                        return;
                    }

                    var pComposer = this.getManager().getEngine().getComposer();
                    var iTotalPasses = pEffect.getTotalPasses();

                    if (akra.isNull(this._pPassInputList)) {
                        this._pPassInputList = new Array(iTotalPasses);
                        this._nTotalPasses = 0;
                    }

                    for (var i = 0; i < iTotalPasses; i++) {
                        var pNewInput = pComposer.getPassInputBlendForEffect(pEffect, i);
                        var pOldInput = this._pPassInputList[i];

                        if (akra.isDefAndNotNull(pOldInput) && akra.isDefAndNotNull(pNewInput)) {
                            if (pNewInput._isFromSameBlend(pOldInput)) {
                                return;
                            }

                            pNewInput._copyFrom(pOldInput);
                            pOldInput._release();
                        }

                        this._pPassInputList[i] = pNewInput;
                    }

                    if (this._nTotalPasses > iTotalPasses) {
                        for (var i = iTotalPasses; i < this._nTotalPasses; i++) {
                            var pOldInput = this._pPassInputList[i];

                            if (akra.isDefAndNotNull(pOldInput)) {
                                pOldInput._release();
                                this._pPassInputList[i] = null;
                            }
                        }
                    }

                    this._nTotalPasses = iTotalPasses;

                    this.notifyAltered();
                };
                return RenderMethod;
            })(akra.pool.ResourcePoolItem);
            resources.RenderMethod = RenderMethod;
        })(pool.resources || (pool.resources = {}));
        var resources = pool.resources;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
//# sourceMappingURL=RenderMethod.js.map
