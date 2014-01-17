var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (pool) {
        /// <reference path="../../idl/IDepthBuffer.ts" />
        /// <reference path="../../idl/IRenderTarget.ts" />
        /// <reference path="../ResourcePoolItem.ts" />
        (function (resources) {
            var DepthBuffer = (function (_super) {
                __extends(DepthBuffer, _super);
                function DepthBuffer() {
                    _super.call(this);
                    this._iBitDepth = 0;
                    this._iWidth = 0;
                    this._iHeight = 0;
                    this._isManual = false;
                    this._pAttachedRenderTargetsList = null;
                }
                Object.defineProperty(DepthBuffer.prototype, "bitDepth", {
                    get: function () {
                        return this._iBitDepth;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(DepthBuffer.prototype, "width", {
                    get: function () {
                        return this._iWidth;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(DepthBuffer.prototype, "height", {
                    get: function () {
                        return this._iHeight;
                    },
                    enumerable: true,
                    configurable: true
                });

                DepthBuffer.prototype.create = function (iBitDepth, iWidth, iHeight, isManual) {
                    this._iBitDepth = iBitDepth;
                    this._iWidth = iWidth;
                    this._iHeight = iHeight;
                    this._isManual = isManual;
                    this._pAttachedRenderTargetsList = [];

                    this.notifyCreated();

                    return true;
                };

                DepthBuffer.prototype.destroy = function () {
                    this.detachFromAllRenderTargets();
                    this._pAttachedRenderTargetsList = null;
                };

                DepthBuffer.prototype.destroyResource = function () {
                    this.destroy();
                    this.notifyDestroyed();
                    return true;
                };

                DepthBuffer.prototype.isManual = function () {
                    return this._isManual;
                };

                DepthBuffer.prototype.isCompatible = function (pTarget) {
                    if (this._iWidth >= pTarget.width && this._iHeight >= pTarget.height) {
                        return true;
                    }

                    return false;
                };

                DepthBuffer.prototype._notifyRenderTargetAttached = function (pTarget) {
                    akra.logger.assert(this._pAttachedRenderTargetsList.indexOf(pTarget) === -1, "RenderTarget alrady has been attached to this DepthBuffer");

                    this._pAttachedRenderTargetsList.push(pTarget);
                };

                DepthBuffer.prototype._notifyRenderTargetDetached = function (pTarget) {
                    var index = this._pAttachedRenderTargetsList.indexOf(pTarget);
                    akra.logger.assert(index !== -1, "Can not detach RenderTarget from DepthBuffer beacuse it hasn`t been attached to it");

                    this._pAttachedRenderTargetsList.splice(index, 1);
                };

                DepthBuffer.prototype.detachFromAllRenderTargets = function () {
                    var i = 0;
                    for (i = 0; i < this._pAttachedRenderTargetsList.length; i++) {
                        //If we call, detachDepthBuffer, we'll invalidate the iterators
                        this._pAttachedRenderTargetsList[i].detachDepthBuffer();
                    }

                    this._pAttachedRenderTargetsList.clear();
                };
                return DepthBuffer;
            })(pool.ResourcePoolItem);
            resources.DepthBuffer = DepthBuffer;
        })(pool.resources || (pool.resources = {}));
        var resources = pool.resources;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
