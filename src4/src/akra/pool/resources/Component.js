var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (pool) {
        /// <reference path="../../idl/IAFXComponent.ts" />
        /// <reference path="../../common.ts" />
        /// <reference path="../ResourcePoolItem.ts" />
        /// <reference path="../../fx/fx.ts" />
        (function (resources) {
            var Component = (function (_super) {
                __extends(Component, _super);
                function Component() {
                    _super.call(this);
                    this._pTechnique = null;
                    this._pComposer = null;
                }
                Component.prototype.create = function () {
                    this._pComposer = this.getManager().getEngine().getComposer();
                };

                Component.prototype.getTechnique = function () {
                    return this._pTechnique;
                };

                Component.prototype.setTechnique = function (pTechnique) {
                    this._pTechnique = pTechnique;
                };

                Component.prototype.isPostEffect = function () {
                    return akra.isNull(this._pTechnique) ? false : this._pTechnique.isPostEffect();
                };

                Component.prototype.getName = function () {
                    return this._pTechnique.getName();
                };

                Component.prototype.getTotalPasses = function () {
                    return this._pTechnique.totalOwnPasses();
                };

                Component.prototype.getHash = function (iShift, iPass) {
                    return this.guid.toString() + ">" + iShift.toString() + ">" + (iPass === akra.fx.ALL_PASSES ? "A" : iPass.toString());
                };
                return Component;
            })(pool.ResourcePoolItem);
            resources.Component = Component;
        })(pool.resources || (pool.resources = {}));
        var resources = pool.resources;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
