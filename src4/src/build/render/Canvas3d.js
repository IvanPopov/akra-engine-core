/// <reference path="../idl/ICanvas3d.ts" />
/// <reference path="../idl/IRenderer.ts" />
/// <reference path="../idl/IUtilTimer.ts" />
/// <reference path="../idl/ICanvasInfo.ts" />
/// <reference path="../util/UtilTimer.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="RenderTarget.ts" />
    (function (render) {
        var Canvas3d = (function (_super) {
            __extends(Canvas3d, _super);
            function Canvas3d(pRenderer) {
                _super.call(this, pRenderer);
                // private _useHarwareAntialiasing: boolean = false;
                this._isFullscreen = false;
                this._isPrimary = false;
                this._bAutoDeactivatedOnFocusChange = false;
                this._pRenderer = pRenderer;
            }
            Canvas3d.prototype.getLeft = function () {
                return 0;
            };
            Canvas3d.prototype.setLeft = function (iLeft) {
            };

            Canvas3d.prototype.getTop = function () {
                return 0;
            };
            Canvas3d.prototype.setTop = function (iTop) {
            };

            Canvas3d.prototype.getType = function () {
                return 2 /* TYPE_3D */;
            };

            Canvas3d.prototype.create = function (sName, iWidth, iHeight, isFullscreen) {
                if (typeof isFullscreen === "undefined") { isFullscreen = false; }
                return false;
            };

            Canvas3d.prototype.destroy = function () {
            };

            Canvas3d.prototype.setFullscreen = function (isFullscreen) {
            };

            Canvas3d.prototype.setVisible = function (bVisible) {
            };
            Canvas3d.prototype.setDeactivateOnFocusChange = function (bDeactivate) {
                this._bAutoDeactivatedOnFocusChange = bDeactivate;
            };

            Canvas3d.prototype.isFullscreen = function () {
                return this._isFullscreen;
            };

            Canvas3d.prototype.isVisible = function () {
                return true;
            };

            Canvas3d.prototype.isClosed = function () {
                return false;
            };

            Canvas3d.prototype.isPrimary = function () {
                return this._isPrimary;
            };

            Canvas3d.prototype.isDeactivatedOnFocusChange = function () {
                return this._bAutoDeactivatedOnFocusChange;
            };

            Canvas3d.prototype.resize = function (iWidth, iHeight) {
            };
            return Canvas3d;
        })(akra.render.RenderTarget);
        render.Canvas3d = Canvas3d;
    })(akra.render || (akra.render = {}));
    var render = akra.render;
})(akra || (akra = {}));
//# sourceMappingURL=Canvas3d.js.map
