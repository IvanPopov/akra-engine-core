/// <reference path="../idl/IApiInfo.ts" />
/// <reference path="../idl/3d-party/zip.d.ts" />
/// <reference path="../common.ts" />
/// <reference path="../util/Singleton.ts" />
/// <reference path="../webgl/webgl.ts" />
/// <reference path="../logger.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (info) {
        var Singleton = akra.util.Singleton;

        var ApiInfo = (function (_super) {
            __extends(ApiInfo, _super);
            function ApiInfo() {
                _super.call(this);
                this._bWebAudio = false;
                this._bFile = false;
                this._bFileSystem = false;
                this._bWebWorker = false;
                this._bTransferableObjects = false;
                this._bLocalStorage = false;
                this._bWebSocket = false;
                this._bGamepad = false;
                this._bPromise = false;

                var pApi = {};

                this._bWebAudio = (window.AudioContext && window.webkitAudioContext ? true : false);
                this._bFile = (window.File && window.FileReader && window.FileList && window.Blob ? true : false);
                this._bFileSystem = (this._bFile && window.URL && (window.requestFileSystem || window.webkitRequestFileSystem) ? true : false);
                this._bWebWorker = akra.isDef(window.Worker);
                this._bLocalStorage = akra.isDef(window.localStorage);
                this._bWebSocket = akra.isDef(window.WebSocket);
                this._bGamepad = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads || (navigator.userAgent.indexOf('Firefox/') != -1);
                this._bPromise = akra.isDefAndNotNull(window.Promise);
            }
            ApiInfo.prototype.getWebGL = function () {
                return akra.webgl.isEnabled();
            };

            ApiInfo.prototype.getTransferableObjects = function () {
                if (!this._bTransferableObjects) {
                    this._bTransferableObjects = (this._bWebWorker && this.chechTransferableObjects() ? true : false);
                }

                return this._bTransferableObjects;
            };

            ApiInfo.prototype.getFile = function () {
                return this._bFile;
            };

            ApiInfo.prototype.getFileSystem = function () {
                return this._bFileSystem;
            };

            ApiInfo.prototype.getWebAudio = function () {
                return this._bWebAudio;
            };

            ApiInfo.prototype.getWebWorker = function () {
                return this._bWebWorker;
            };

            ApiInfo.prototype.getLocalStorage = function () {
                return this._bLocalStorage;
            };

            ApiInfo.prototype.getWebSocket = function () {
                return this._bWebSocket;
            };

            ApiInfo.prototype.getGamepad = function () {
                return this._bGamepad;
            };

            ApiInfo.prototype.getZip = function () {
                return akra.isDefAndNotNull(window["zip"]);
            };

            ApiInfo.prototype.getPromise = function () {
                return this._bPromise;
            };

            ApiInfo.prototype.chechTransferableObjects = function () {
                var pBlob = new Blob(["onmessage = function(e) { postMessage(true); }"], { "type": "text\/javascript" });
                var sBlobURL = window.URL.createObjectURL(pBlob);
                var pWorker = new Worker(sBlobURL);

                var pBuffer = new ArrayBuffer(1);

                try  {
                    pWorker.postMessage(pBuffer, [pBuffer]);
                } catch (e) {
                    akra.logger.log('transferable objects not supported in your browser...');
                }

                pWorker.terminate();

                if (pBuffer.byteLength) {
                    return false;
                }

                return true;
            };
            return ApiInfo;
        })(Singleton);
        info.ApiInfo = ApiInfo;
    })(akra.info || (akra.info = {}));
    var info = akra.info;
})(akra || (akra = {}));
//# sourceMappingURL=ApiInfo.js.map
