/// <reference path="../../idl/IEffect.ts" />
/// <reference path="../ResourcePoolItem.ts" />
/// <reference path="../../idl/IAFXComposer.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (pool) {
        /// <reference path="../../debug.ts" />
        /// <reference path="../../fx/fx.ts" />
        (function (resources) {
            var Effect = (function (_super) {
                __extends(Effect, _super);
                function Effect() {
                    _super.call(this);
                    this._nTotalPasses = 0;
                    this._nTotalComponents = 0;
                }
                Effect.prototype.getTotalComponents = function () {
                    return this._nTotalComponents;
                };

                Effect.prototype.getTotalPasses = function () {
                    return this._nTotalPasses;
                };

                Effect.prototype.isEqual = function (pEffect) {
                    return false;
                };
                Effect.prototype.isReplicated = function () {
                    return false;
                };
                Effect.prototype.isMixid = function () {
                    return false;
                };
                Effect.prototype.isParameterUsed = function (pParam, iPass) {
                    return false;
                };

                Effect.prototype.createResource = function () {
                    this.notifyLoaded();
                    return true;
                };

                Effect.prototype.replicable = function (bValue) {
                    return;
                };
                Effect.prototype.miscible = function (bValue) {
                    return;
                };

                Effect.prototype.addComponent = function (pComponent, iShift, iPass) {
                    if (typeof iShift === "undefined") { iShift = akra.fx.DEFAULT_SHIFT; }
                    if (typeof iPass === "undefined") { iPass = akra.fx.ALL_PASSES; }
                    var pComponentPool = this.getManager().getComponentPool();

                    if (akra.isInt(pComponent)) {
                        pComponent = pComponentPool.getResource(pComponent);
                    } else if (akra.isString(pComponent)) {
                        pComponent = pComponentPool.findResource(pComponent);
                    }

                    if (!akra.isDef(pComponent) || akra.isNull(pComponent)) {
                        akra.debug.error("Bad component for add: ", pComponent);
                        return false;
                    }

                    if (!this.getComposer().addComponentToEffect(this, pComponent, iShift, iPass)) {
                        akra.debug.error("Can not add component '" + pComponent.findResourceName() + "'");
                        return false;
                    }

                    this._nTotalComponents = this.getComposer().getComponentCountForEffect(this);
                    this._nTotalPasses = this.getComposer().getTotalPassesForEffect(this);

                    this.notifyAltered();

                    if (this.getTotalComponents() === 1) {
                        this.notifyRestored();
                    }

                    return true;
                };

                Effect.prototype.delComponent = function (pComponent, iShift, iPass) {
                    if (typeof iShift === "undefined") { iShift = akra.fx.DEFAULT_SHIFT; }
                    if (typeof iPass === "undefined") { iPass = akra.fx.ALL_PASSES; }
                    var pComponentPool = this.getManager().getComponentPool();

                    if (akra.isInt(pComponent)) {
                        pComponent = pComponentPool.getResource(pComponent);
                    } else if (akra.isString(pComponent)) {
                        pComponent = pComponentPool.findResource(pComponent);
                    }

                    if (!akra.isDef(pComponent) || akra.isNull(pComponent)) {
                        akra.debug.error("Bad component for delete: ", pComponent);
                        return false;
                    }

                    if (!this.getComposer().removeComponentFromEffect(this, pComponent, iShift, iPass)) {
                        akra.debug.error("Can not delete component '" + pComponent.findResourceName() + "'");
                        return false;
                    }

                    this._nTotalComponents = this.getComposer().getComponentCountForEffect(this);
                    this._nTotalPasses = this.getComposer().getTotalPassesForEffect(this);

                    this.notifyAltered();

                    if (this.getTotalComponents() === 0) {
                        this.notifyDisabled();
                    }

                    return true;
                };

                Effect.prototype.hasComponent = function (sComponent, iShift, iPass) {
                    if (typeof iShift === "undefined") { iShift = akra.fx.ANY_SHIFT; }
                    if (typeof iPass === "undefined") { iPass = akra.fx.ANY_PASS; }
                    var pComponentPool = this.getManager().getComponentPool();
                    var pComponent = null;

                    pComponent = pComponentPool.findResource(sComponent);

                    if (akra.isNull(pComponent)) {
                        return false;
                    }

                    return this.getComposer().hasComponentForEffect(this, pComponent, iShift, iPass);
                };

                Effect.prototype.activate = function (iShift) {
                    if (typeof iShift === "undefined") { iShift = 0; }
                    return this.getComposer().activateEffectResource(this, iShift);
                };

                Effect.prototype.deactivate = function () {
                    return this.getComposer().deactivateEffectResource(this);
                };

                Effect.prototype.findParameter = function (pParam, iPass) {
                    return null;
                };

                Effect.prototype.getComposer = function () {
                    return this.getManager().getEngine().getComposer();
                };
                return Effect;
            })(akra.pool.ResourcePoolItem);
            resources.Effect = Effect;
        })(pool.resources || (pool.resources = {}));
        var resources = pool.resources;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
//# sourceMappingURL=Effect.js.map
