var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="../../../akra.ts" />
var akra;
(function (akra) {
    (function (core) {
        (function (pool) {
            (function (resources) {
                var VideoBuffer = (function (_super) {
                    __extends(VideoBuffer, _super);
                    function VideoBuffer() {
                        _super.apply(this, arguments);

                    }
                    VideoBuffer.prototype.clone = function (pSrc) {
                        return false;
                    };
                    VideoBuffer.prototype.isValid = function () {
                        return false;
                    };
                    VideoBuffer.prototype.isDynamic = function () {
                        return false;
                    };
                    VideoBuffer.prototype.isStatic = function () {
                        return false;
                    };
                    VideoBuffer.prototype.isStream = function () {
                        return false;
                    };
                    VideoBuffer.prototype.isReadable = function () {
                        return false;
                    };
                    VideoBuffer.prototype.isRAMBufferPresent = function () {
                        return false;
                    };
                    VideoBuffer.prototype.isSoftware = function () {
                        return false;
                    };
                    VideoBuffer.prototype.isAlignment = function () {
                        return false;
                    };
                    VideoBuffer.prototype.getHardwareBuffer = function () {
                        return null;
                    };
                    VideoBuffer.prototype.getOptions = function () {
                        return 0;
                    };
                    VideoBuffer.prototype.getVertexData = function (iOffset, iCount, pDecl) {
                        return null;
                    };
                    VideoBuffer.prototype.getEmptyVertexData = function (iCount, pDecl, ppVertexDataIn) {
                        return null;
                    };
                    VideoBuffer.prototype.freeVertexData = function (pVertexData) {
                        return false;
                    };
                    VideoBuffer.prototype.allocateData = function (pDecl, pData) {
                        return null;
                    };
                    return VideoBuffer;
                })(resources.Texture);
                resources.VideoBuffer = VideoBuffer;                
            })(pool.resources || (pool.resources = {}));
            var resources = pool.resources;
        })(core.pool || (core.pool = {}));
        var pool = core.pool;
    })(akra.core || (akra.core = {}));
    var core = akra.core;
})(akra || (akra = {}));
