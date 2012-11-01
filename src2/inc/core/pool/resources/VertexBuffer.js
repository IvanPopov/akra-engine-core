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
                var VertexBuffer = (function (_super) {
                    __extends(VertexBuffer, _super);
                    function VertexBuffer() {
                        _super.apply(this, arguments);

                    }
                    VertexBuffer.prototype.clone = function (pSrc) {
                        return false;
                    };
                    VertexBuffer.prototype.isValid = function () {
                        return false;
                    };
                    VertexBuffer.prototype.isDynamic = function () {
                        return false;
                    };
                    VertexBuffer.prototype.isStatic = function () {
                        return false;
                    };
                    VertexBuffer.prototype.isStream = function () {
                        return false;
                    };
                    VertexBuffer.prototype.isReadable = function () {
                        return false;
                    };
                    VertexBuffer.prototype.isRAMBufferPresent = function () {
                        return false;
                    };
                    VertexBuffer.prototype.isSoftware = function () {
                        return false;
                    };
                    VertexBuffer.prototype.isAlignment = function () {
                        return false;
                    };
                    VertexBuffer.prototype.getHardwareBuffer = function () {
                        return null;
                    };
                    VertexBuffer.prototype.getOptions = function () {
                        return 0;
                    };
                    VertexBuffer.prototype.getVertexData = function (iOffset, iCount, pDecl) {
                        return null;
                    };
                    VertexBuffer.prototype.getEmptyVertexData = function (iCount, pDecl, ppVertexDataIn) {
                        return null;
                    };
                    VertexBuffer.prototype.freeVertexData = function (pVertexData) {
                        return false;
                    };
                    VertexBuffer.prototype.allocateData = function (pDecl, pData) {
                        return null;
                    };
                    return VertexBuffer;
                })(pool.ResourcePoolItem);
                resources.VertexBuffer = VertexBuffer;                
            })(pool.resources || (pool.resources = {}));
            var resources = pool.resources;
        })(core.pool || (core.pool = {}));
        var pool = core.pool;
    })(akra.core || (akra.core = {}));
    var core = akra.core;
})(akra || (akra = {}));
