/// <reference path="../idl/AIApiInfo.ts" />
/// <reference path="../idl/3d-party/zip.d.ts" />
/// <reference path="../idl/common.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "util/Singleton", "webgl", "logger"], function(require, exports, __Singleton__, __webgl__, __logger__) {
    var Singleton = __Singleton__;
    var webgl = __webgl__;
    var logger = __logger__;

    var Info = (function (_super) {
        __extends(Info, _super);
        function Info() {
            _super.call(this);
            this._bWebAudio = false;
            this._bFile = false;
            this._bFileSystem = false;
            this._bWebWorker = false;
            this._bTransferableObjects = false;
            this._bLocalStorage = false;
            this._bWebSocket = false;
            this._bGamepad = false;

            var pApi = {};

            this._bWebAudio = ((window).AudioContext && (window).webkitAudioContext ? true : false);
            this._bFile = ((window).File && (window).FileReader && (window).FileList && (window).Blob ? true : false);
            this._bFileSystem = (this._bFile && (window).URL && (window).requestFileSystem ? true : false);
            this._bWebWorker = isDef((window).Worker);
            this._bLocalStorage = isDef((window).localStorage);
            this._bWebSocket = isDef((window).WebSocket);
            this._bGamepad = !!(navigator).webkitGetGamepads || !!(navigator).webkitGamepads || (navigator.userAgent.indexOf('Firefox/') != -1);
        }
        Object.defineProperty(Info.prototype, "webGL", {
            get: /** inline */ function () {
                return webgl.isEnabled();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Info.prototype, "transferableObjects", {
            get: function () {
                if (!this._bTransferableObjects) {
                    this._bTransferableObjects = (this._bWebWorker && this.chechTransferableObjects() ? true : false);
                }

                return this._bTransferableObjects;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Info.prototype, "file", {
            get: /** inline */ function () {
                return this._bFile;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Info.prototype, "fileSystem", {
            get: /** inline */ function () {
                return this._bFileSystem;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Info.prototype, "webAudio", {
            get: /** inline */ function () {
                return this._bWebAudio;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Info.prototype, "webWorker", {
            get: /** inline */ function () {
                return this._bWebWorker;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Info.prototype, "localStorage", {
            get: /** inline */ function () {
                return this._bLocalStorage;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Info.prototype, "webSocket", {
            get: /** inline */ function () {
                return this._bWebSocket;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Info.prototype, "gamepad", {
            get: /** inline */ function () {
                return this._bGamepad;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Info.prototype, "zip", {
            get: /** inline */ function () {
                return isDefAndNotNull(window["zip"]);
            },
            enumerable: true,
            configurable: true
        });

        Info.prototype.chechTransferableObjects = function () {
            var pBlob = new Blob(["onmessage = function(e) { postMessage(true); }"], { "type": "text\/javascript" });
            var sBlobURL = (window).URL.createObjectURL(pBlob);
            var pWorker = new Worker(sBlobURL);

            var pBuffer = new ArrayBuffer(1);

            try  {
                pWorker.postMessage(pBuffer, [pBuffer]);
            } catch (e) {
                logger.log('transferable objects not supported in your browser...');
            }

            pWorker.terminate();

            if (pBuffer.byteLength) {
                return false;
            }

            return true;
        };
        return Info;
    })(Singleton);

    
    return Info;
});
//# sourceMappingURL=ApiInfo.js.map
