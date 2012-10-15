var akra;
(function (akra) {
    var Vec2 = (function () {
        function Vec2(x, y) {
            this.x = 0;
            this.y = 0;
            switch(arguments.length) {
                case 0: {
                    this.x = this.y = 0;
                    break;

                }
                case 1: {
                    this.set(x);
                    break;

                }
                case 2: {
                    this.set(x, y);

                }
            }
        }
        Vec2.prototype.set = function (x, y) {
            switch(arguments.length) {
                case 0: {
                    this.x = this.y = 0;
                    break;

                }
                case 1: {
                    if(akra.isFloat(x)) {
                        this.x = x;
                        this.y = x;
                    } else {
                        this.x = x.x;
                        this.y = x.y;
                    }
                    break;

                }
                case 2: {
                    this.x = x;
                    this.y = y;

                }
            }
            return this;
        };
        return Vec2;
    })();
    akra.Vec2 = Vec2;    
})(akra || (akra = {}));
var akra;
(function (akra) {
    var Vec3 = (function () {
        function Vec3(x, y, z) {
            switch(arguments.length) {
                case 0: {
                    this.x = this.y = this.z = 0;
                    break;

                }
                case 1: {
                    this.set(x);
                    break;

                }
                case 2: {
                    this.set(x, y);
                    break;

                }
                case 3: {
                    this.set(x, y, z);

                }
            }
        }
        Object.defineProperty(Vec3.prototype, "xy", {
            get: function () {
                return new akra.Vec2(this.x, this.y);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec3.prototype, "xz", {
            get: function () {
                return new akra.Vec2(this.x, this.z);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec3.prototype, "yx", {
            get: function () {
                return new akra.Vec2(this.y, this.x);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec3.prototype, "yz", {
            get: function () {
                return new akra.Vec2(this.y, this.z);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec3.prototype, "zx", {
            get: function () {
                return new akra.Vec2(this.z, this.x);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec3.prototype, "zy", {
            get: function () {
                return new akra.Vec2(this.z, this.y);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec3.prototype, "xyz", {
            get: function () {
                return new Vec3(this.x, this.y, this.z);
            },
            enumerable: true,
            configurable: true
        });
        Vec3.prototype.set = function (x, y, z) {
            switch(arguments.length) {
                case 0:
                case 1: {
                    if(akra.isFloat(x)) {
                        this.x = this.y = this.z = x || 0;
                    } else {
                        this.x = x.x;
                        this.y = x.y;
                        this.z = x.z;
                    }
                    break;

                }
                case 2: {
                    if(akra.isFloat(x)) {
                        this.x = x;
                        this.y = y.x;
                        this.z = y.y;
                    } else {
                        this.x = x.x;
                        this.y = x.y;
                        this.z = y;
                    }
                    break;

                }
                case 3: {
                    this.x = x;
                    this.y = y;
                    this.z = z;

                }
            }
            return this;
        };
        Vec3.prototype.add = function (v3fVec, v3fDest) {
            if(!v3fDest) {
                v3fDest = this;
            }
            v3fDest.x = this.x + v3fVec.x;
            v3fDest.y = this.y + v3fVec.y;
            v3fDest.z = this.z + v3fVec.z;
            return this;
        };
        Vec3.prototype.toString = function () {
            return "[x: " + this.x + ", y: " + this.y + ", z: " + this.z + "]";
        };
        Vec3.v3f = new Vec3();
        return Vec3;
    })();
    akra.Vec3 = Vec3;    
})(akra || (akra = {}));
var akra;
(function (akra) {
    var Vec4 = (function () {
        function Vec4(x, y, z, w) {
            switch(arguments.length) {
                case 0: {
                    this.x = this.y = this.z = this.w = 0;
                    break;

                }
                case 1: {
                    this.set(x);
                    break;

                }
                case 2: {
                    this.set(x, y);
                    break;

                }
                case 4: {
                    this.set(x, y, z, w);
                    break;

                }
            }
        }
        Vec4.prototype.set = function (x, y, z, w) {
            switch(arguments.length) {
                case 0: {
                    this.x = this.y = this.z = this.w = 0;
                    break;

                }
                case 1: {
                    if(akra.isFloat(x)) {
                        this.x = this.y = this.z = this.w = x;
                    } else {
                        this.x = x.x;
                        this.y = x.y;
                        this.z = x.z;
                        this.w = x.w;
                    }
                    break;

                }
                case 2: {
                    if(akra.isFloat(x)) {
                        this.x = x;
                        this.y = y.x;
                        this.z = y.y;
                        this.w = y.z;
                    } else {
                        if(akra.isFloat(y)) {
                            this.x = x.x;
                            this.y = x.y;
                            this.z = x.z;
                            this.w = y;
                        } else {
                            this.x = x.x;
                            this.y = x.y;
                            this.z = y.x;
                            this.w = y.y;
                        }
                    }
                    break;

                }
                case 4: {
                    this.x = x;
                    this.y = y;
                    this.z = z;
                    this.w = w;

                }
            }
            return this;
        };
        return Vec4;
    })();
    akra.Vec4 = Vec4;    
})(akra || (akra = {}));
var akra;
(function (akra) {
    var Mat2 = (function () {
        function Mat2(f11, f12, f21, f22) {
            this.pData = new Float32Array(4);
            switch(arguments.length) {
                case 1: {
                    this.set(f11);
                    break;

                }
                case 4: {
                    this.set(f11, f12, f21, f22);
                    break;

                }
            }
        }
        Mat2.prototype.set = function (f11, f12, f21, f22) {
            var pData = this.pData;
            switch(arguments.length) {
                case 1: {
                    if(akra.isFloat(f11)) {
                        pData[0] = pData[1] = pData[2] = pData[3] = f11;
                    } else {
                    }
                    break;

                }
                case 4: {
                    pData[0] = f11;
                    pData[1] = f21;
                    pData[2] = f12;
                    pData[3] = f22;
                    break;

                }
            }
            return this;
        };
        return Mat2;
    })();
    akra.Mat2 = Mat2;    
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (geometry) {
        var Rect3d = (function () {
            function Rect3d(x0, y0, z0, x1, y1, z1) {
            }
            return Rect3d;
        })();
        geometry.Rect3d = Rect3d;        
    })(akra.geometry || (akra.geometry = {}));
    var geometry = akra.geometry;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var Singleton = (function () {
            function Singleton() {
                var _constructor = (this).constructor;
                akra.assert(!akra.isDef(_constructor._pInstance), 'Singleton class may be created only one time.');
                _constructor._pInstance = this;
            }
            return Singleton;
        })();        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var URI = (function () {
            function URI(pUri) {
                this.sScheme = null;
                this.sUserinfo = null;
                this.sHost = null;
                this.nPort = 0;
                this.sPath = null;
                this.sQuery = null;
                this.sFragment = null;
                if(pUri) {
                    this.set(pUri);
                }
            }
            Object.defineProperty(URI.prototype, "urn", {
                get: function () {
                    return (this.sPath ? this.sPath : '') + (this.sQuery ? '?' + this.sQuery : '') + (this.sFragment ? '#' + this.sFragment : '');
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "url", {
                get: function () {
                    return (this.sScheme ? this.sScheme : '') + this.authority;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "authority", {
                get: function () {
                    return (this.sHost ? '//' + (this.sUserinfo ? this.sUserinfo + '@' : '') + this.sHost + (this.nPort ? ':' + this.nPort : '') : '');
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "scheme", {
                get: function () {
                    return this.sScheme;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "protocol", {
                get: function () {
                    if(!this.sScheme) {
                        return this.sScheme;
                    }
                    return (this.sScheme.substr(0, this.sScheme.lastIndexOf(':')));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "userinfo", {
                get: function () {
                    return this.sUserinfo;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "host", {
                get: function () {
                    return this.sHost;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "port", {
                get: function () {
                    return this.nPort;
                },
                set: function (iPort) {
                    this.nPort = iPort;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "path", {
                get: function () {
                    return this.sPath;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "query", {
                get: function () {
                    return this.sQuery;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "fragment", {
                get: function () {
                    return this.sFragment;
                },
                enumerable: true,
                configurable: true
            });
            URI.prototype.set = function (pData) {
                if(akra.isString(pData)) {
                    var pUri = URI.uriExp.exec(pData);
                    akra.debug_assert(pUri !== null, 'Invalid URI format used.\nused uri: ' + pData);
                    if(!pUri) {
                        return null;
                    }
                    this.sScheme = pUri[1] || null;
                    this.sUserinfo = pUri[2] || null;
                    this.sHost = pUri[3] || null;
                    this.nPort = parseInt(pUri[4]) || null;
                    this.sPath = pUri[5] || pUri[6] || null;
                    this.sQuery = pUri[7] || null;
                    this.sFragment = pUri[8] || null;
                    return this;
                } else {
                    if(pData instanceof URI) {
                        return this.set(pData.toString());
                    }
                }
                akra.debug_error('Unexpected data type was used.');
                return null;
            };
            URI.prototype.toString = function () {
                return this.url + this.urn;
            };
            URI.uriExp = new RegExp("^([a-z0-9+.-]+:)?(?:\\/\\/(?:((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(?::(\\d*))?(\\/(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?|(\\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})*(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?)(?:\\?((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?$", "i");
            return URI;
        })();
        util.URI = URI;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    akra.parseURI = function (sUri) {
        return new akra.util.URI(sUri);
    };
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var KeyMap = (function () {
            function KeyMap() { }
            return KeyMap;
        })();
        util.KeyMap = KeyMap;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var GamepadMap = (function () {
            function GamepadMap() { }
            return GamepadMap;
        })();
        util.GamepadMap = GamepadMap;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (util) {
        var BrowserInfo = (function (_super) {
            __extends(BrowserInfo, _super);
            function BrowserInfo() {
                _super.apply(this, arguments);

                this.sBrowser = null;
                this.sVersion = null;
                this.sOS = null;
                this.sVersionSearch = null;
            }
            Object.defineProperty(BrowserInfo.prototype, "name", {
                get: function () {
                    return this.sBrowser;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BrowserInfo.prototype, "version", {
                get: function () {
                    return this.sVersion;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BrowserInfo.prototype, "os", {
                get: function () {
                    return this.sOS;
                },
                enumerable: true,
                configurable: true
            });
            BrowserInfo.prototype.init = function () {
                this.sBrowser = this.searchString(BrowserInfo.dataBrowser) || "An unknown browser";
                this.sVersion = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
                this.sOS = this.searchString(BrowserInfo.dataOS) || "an unknown OS";
            };
            BrowserInfo.prototype.searchString = function (pDataBrowser) {
                for(var i = 0; i < pDataBrowser.length; i++) {
                    var sData = pDataBrowser[i].string;
                    var dataProp = pDataBrowser[i].prop;
                    this.sVersionSearch = pDataBrowser[i].versionSearch || pDataBrowser[i].identity;
                    if(sData) {
                        if(sData.indexOf(pDataBrowser[i].subString) != -1) {
                            return pDataBrowser[i].identity;
                        }
                    } else {
                        if(dataProp) {
                            return pDataBrowser[i].identity;
                        }
                    }
                }
                return null;
            };
            BrowserInfo.prototype.searchVersion = function (sData) {
                var iStartIndex = sData.indexOf(this.sVersionSearch);
                if(iStartIndex == -1) {
                    return null;
                }
                iStartIndex = sData.indexOf('/', iStartIndex + 1);
                if(iStartIndex == -1) {
                    return null;
                }
                var iEndIndex = sData.indexOf(' ', iStartIndex + 1);
                if(iEndIndex == -1) {
                    iEndIndex = sData.indexOf(';', iStartIndex + 1);
                    if(iEndIndex == -1) {
                        return null;
                    }
                    return sData.slice(iStartIndex + 1);
                }
                return sData.slice((iStartIndex + 1), iEndIndex);
            };
            BrowserInfo.dataBrowser = [
                {
                    string: navigator.userAgent,
                    subString: "Chrome",
                    identity: "Chrome"
                }, 
                {
                    string: navigator.userAgent,
                    subString: "OmniWeb",
                    versionSearch: "OmniWeb/",
                    identity: "OmniWeb"
                }, 
                {
                    string: navigator.vendor,
                    subString: "Apple",
                    identity: "Safari",
                    versionSearch: "Version"
                }, 
                {
                    prop: window.opera,
                    identity: "Opera",
                    versionSearch: "Version"
                }, 
                {
                    string: navigator.vendor,
                    subString: "iCab",
                    identity: "iCab"
                }, 
                {
                    string: navigator.vendor,
                    subString: "KDE",
                    identity: "Konqueror"
                }, 
                {
                    string: navigator.userAgent,
                    subString: "Firefox",
                    identity: "Firefox"
                }, 
                {
                    string: navigator.vendor,
                    subString: "Camino",
                    identity: "Camino"
                }, 
                {
                    string: navigator.userAgent,
                    subString: "Netscape",
                    identity: "Netscape"
                }, 
                {
                    string: navigator.userAgent,
                    subString: "MSIE",
                    identity: "Explorer",
                    versionSearch: "MSIE"
                }, 
                {
                    string: navigator.userAgent,
                    subString: "Gecko",
                    identity: "Mozilla",
                    versionSearch: "rv"
                }, 
                {
                    string: navigator.userAgent,
                    subString: "Mozilla",
                    identity: "Netscape",
                    versionSearch: "Mozilla"
                }
            ];
            BrowserInfo.dataOS = [
                {
                    string: navigator.platform,
                    subString: "Win",
                    identity: "Windows"
                }, 
                {
                    string: navigator.platform,
                    subString: "Mac",
                    identity: "Mac"
                }, 
                {
                    string: navigator.userAgent,
                    subString: "iPhone",
                    identity: "iPhone/iPod"
                }, 
                {
                    string: navigator.platform,
                    subString: "Linux",
                    identity: "Linux"
                }
            ];
            return BrowserInfo;
        })(util.Singleton);
        util.BrowserInfo = BrowserInfo;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var ApiInfo = (function (_super) {
            __extends(ApiInfo, _super);
            function ApiInfo() {
                        _super.call(this);
                this.bWebGL = false;
                this.bWebAudio = false;
                this.bFile = false;
                this.bFileSystem = false;
                this.bWebWorker = false;
                this.bTransferableObjects = false;
                this.bLocalStorage = false;
                this.bWebSocket = false;
                var pApi = {
                };
                this.bWebAudio = ((window).AudioContext && (window).webkitAudioContext ? true : false);
                this.bFile = ((window).File && (window).FileReader && (window).FileList && (window).Blob ? true : false);
                this.bFileSystem = (this.bFile && (window).URL && (window).requestFileSystem ? true : false);
                this.bWebWorker = akra.isDef((window).Worker);
                this.bLocalStorage = akra.isDef((window).localStorage);
                this.bWebSocket = akra.isDef((window).WebSocket);
            }
            Object.defineProperty(ApiInfo.prototype, "webGL", {
                get: function () {
                    if(!this.bWebGL) {
                        this.bWebGL = ((window).WebGLRenderingContext || this.checkWebGL() ? true : false);
                    }
                    return this.bWebGL;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "transferableObjects", {
                get: function () {
                    if(!this.bTransferableObjects) {
                        this.bTransferableObjects = (this.bWebWorker && this.chechTransferableObjects() ? true : false);
                    }
                    return this.bTransferableObjects;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "file", {
                get: function () {
                    return this.bFile;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "fileSystem", {
                get: function () {
                    return this.bFileSystem;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "webAudio", {
                get: function () {
                    return this.bWebAudio;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "webWorker", {
                get: function () {
                    return this.bWebWorker;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "localStorage", {
                get: function () {
                    return this.bLocalStorage;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "webSocket", {
                get: function () {
                    return this.bWebSocket;
                },
                enumerable: true,
                configurable: true
            });
            ApiInfo.prototype.checkWebGL = function () {
                var pCanvas;
                var pDevice;
                try  {
                    pCanvas = document.createElement('canvas');
                    pDevice = pCanvas.getContext('webgl', {
                    }) || pCanvas.getContext('experimental-webgl', {
                    });
                    if(pDevice) {
                        return true;
                    }
                } catch (e) {
                }
                return false;
            };
            ApiInfo.prototype.chechTransferableObjects = function () {
                var pBlob = new Blob([
                    "onmessage = function(e) { postMessage(true); }"
                ]);
                var sBlobURL = (window).URL.createObjectURL(pBlob);
                var pWorker = new Worker(sBlobURL);
                var pBuffer = new ArrayBuffer(1);
                try  {
                    pWorker.postMessage(pBuffer, [
                        pBuffer
                    ]);
                } catch (e) {
                    akra.debug_print('transferable objects not supported in your browser...');
                }
                pWorker.terminate();
                if(pBuffer.byteLength) {
                    return false;
                }
                return true;
            };
            return ApiInfo;
        })(util.Singleton);
        util.ApiInfo = ApiInfo;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var ScreenInfo = (function () {
            function ScreenInfo() { }
            Object.defineProperty(ScreenInfo.prototype, "width", {
                get: function () {
                    return screen.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScreenInfo.prototype, "height", {
                get: function () {
                    return screen.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScreenInfo.prototype, "aspect", {
                get: function () {
                    return screen.width / screen.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScreenInfo.prototype, "pixelDepth", {
                get: function () {
                    return screen.pixelDepth;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScreenInfo.prototype, "colorDepth", {
                get: function () {
                    return screen.colorDepth;
                },
                enumerable: true,
                configurable: true
            });
            return ScreenInfo;
        })();
        util.ScreenInfo = ScreenInfo;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var DeviceInfo = (function (_super) {
            __extends(DeviceInfo, _super);
            function DeviceInfo() {
                        _super.call(this);
                this.nMaxTextureSize = 0;
                this.nMaxCubeMapTextureSize = 0;
                this.nMaxViewPortSize = 0;
                this.nMaxTextureImageUnits = 0;
                this.nMaxVertexAttributes = 0;
                this.nMaxVertexTextureImageUnits = 0;
                this.nMaxCombinedTextureImageUnits = 0;
                this.nMaxColorAttachments = 1;
                this.nStencilBits = 0;
                this.pColorBits = [
                    0, 
                    0, 
                    0
                ];
                this.nAlphaBits = 0;
                this.fMultisampleType = 0;
                this.fShaderVersion = 0;
                var pDevice = akra.createDevice();
                if(!pDevice) {
                    return;
                }
                this.nMaxTextureSize = pDevice.getParameter(pDevice.MAX_TEXTURE_SIZE);
                this.nMaxCubeMapTextureSize = pDevice.getParameter(pDevice.MAX_CUBE_MAP_TEXTURE_SIZE);
                this.nMaxViewPortSize = pDevice.getParameter(pDevice.MAX_VIEWPORT_DIMS);
                this.nMaxTextureImageUnits = pDevice.getParameter(pDevice.MAX_TEXTURE_IMAGE_UNITS);
                this.nMaxVertexAttributes = pDevice.getParameter(pDevice.MAX_VERTEX_ATTRIBS);
                this.nMaxVertexTextureImageUnits = pDevice.getParameter(pDevice.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
                this.nMaxCombinedTextureImageUnits = pDevice.getParameter(pDevice.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
                this.nStencilBits = pDevice.getParameter(pDevice.STENCIL_BITS);
                this.pColorBits = [
                    pDevice.getParameter(pDevice.RED_BITS), 
                    pDevice.getParameter(pDevice.GREEN_BITS), 
                    pDevice.getParameter(pDevice.BLUE_BITS)
                ];
                this.nAlphaBits = pDevice.getParameter(pDevice.ALPHA_BITS);
                this.fMultisampleType = pDevice.getParameter(pDevice.SAMPLE_COVERAGE_VALUE);
            }
            Object.defineProperty(DeviceInfo.prototype, "maxTextureSize", {
                get: function () {
                    return this.nMaxTextureSize;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "maxCubeMapTextureSize", {
                get: function () {
                    return this.nMaxCubeMapTextureSize;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "maxViewPortSize", {
                get: function () {
                    return this.nMaxViewPortSize;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "maxTextureImageUnits", {
                get: function () {
                    return this.nMaxTextureImageUnits;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "maxVertexAttributes", {
                get: function () {
                    return this.nMaxVertexAttributes;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "maxVertexTextureImageUnits", {
                get: function () {
                    return this.nMaxVertexTextureImageUnits;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "maxCombinedTextureImageUnits", {
                get: function () {
                    return this.nMaxCombinedTextureImageUnits;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "maxColorAttachments", {
                get: function () {
                    return this.nMaxColorAttachments;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "stencilBits", {
                get: function () {
                    return this.nStencilBits;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "colorBits", {
                get: function () {
                    return this.pColorBits;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "alphaBits", {
                get: function () {
                    return this.nAlphaBits;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "multisampleType", {
                get: function () {
                    return this.fMultisampleType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "shaderVersion", {
                get: function () {
                    return this.fShaderVersion;
                },
                enumerable: true,
                configurable: true
            });
            DeviceInfo.prototype.getExtention = function (pDevice, csExtension) {
                var pExtentions;
                var sExtention;
                var pExtention = null;
                pExtentions = pDevice.getSupportedExtensions();
                for(var i in pExtentions) {
                    sExtention = pExtentions[i];
                    if(sExtention.search(csExtension) != -1) {
                        pExtention = pDevice.getExtension(sExtention);
                        akra.trace('extension successfuly loaded: ' + sExtention);
                    }
                }
                return pExtention;
            };
            DeviceInfo.prototype.checkFormat = function (pDevice, eFormat) {
                switch(eFormat) {
                    case akra.ImageFormats.RGB_DXT1:
                    case akra.ImageFormats.RGBA_DXT1:
                    case akra.ImageFormats.RGBA_DXT2:
                    case akra.ImageFormats.RGBA_DXT3:
                    case akra.ImageFormats.RGBA_DXT4:
                    case akra.ImageFormats.RGBA_DXT5: {
                        for(var i in pDevice) {
                            if(akra.isNumber(pDevice[i]) && pDevice[i] == eFormat) {
                                return true;
                            }
                        }
                        return false;

                    }
                    case akra.ImageFormats.RGB8:
                    case akra.ImageFormats.RGBA8:
                    case akra.ImageFormats.RGBA4:
                    case akra.ImageFormats.RGB5_A1:
                    case akra.ImageFormats.RGB565: {
                        return true;

                    }
                    default: {
                        return false;

                    }
                }
            };
            return DeviceInfo;
        })(util.Singleton);
        util.DeviceInfo = DeviceInfo;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    var ResourcePool = (function () {
        function ResourcePool() { }
        ResourcePool.prototype.initialize = function () {
            return false;
        };
        ResourcePool.prototype.isInitialized = function () {
            return false;
        };
        ResourcePool.prototype.clean = function () {
            return false;
        };
        ResourcePool.prototype.destroy = function () {
            return false;
        };
        ResourcePool.prototype.destroyAll = function () {
            return false;
        };
        ResourcePool.prototype.disableAll = function () {
            return false;
        };
        ResourcePool.prototype.restoreAll = function () {
            return false;
        };
        ResourcePool.prototype.registerResourcePool = function () {
        };
        ResourcePool.prototype.unregisterResourcePool = function () {
        };
        ResourcePool.prototype.findResourceHandle = function () {
            return 0;
        };
        return ResourcePool;
    })();
    akra.ResourcePool = ResourcePool;    
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (scene) {
        var Node = (function () {
            function Node() {
                this.sName = null;
            }
            Object.defineProperty(Node.prototype, "name", {
                get: function () {
                    return this.sName;
                },
                set: function (sName) {
                    this.sName = sName;
                },
                enumerable: true,
                configurable: true
            });
            return Node;
        })();
        scene.Node = Node;        
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (scene) {
        var SceneNode = (function (_super) {
            __extends(SceneNode, _super);
            function SceneNode(pEngine) {
                        _super.call(this);
                this.pEngine = null;
                this.pEngine = pEngine;
            }
            return SceneNode;
        })(scene.Node);
        scene.SceneNode = SceneNode;        
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (scene) {
        var SceneObject = (function (_super) {
            __extends(SceneObject, _super);
            function SceneObject(pEngine) {
                        _super.call(this, pEngine);
            }
            return SceneObject;
        })(scene.SceneNode);
        scene.SceneObject = SceneObject;        
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (scene) {
        (function (objects) {
            var Camera = (function (_super) {
                __extends(Camera, _super);
                function Camera(pEngine) {
                                _super.call(this, pEngine);
                }
                return Camera;
            })(scene.SceneObject);
            objects.Camera = Camera;            
        })(scene.objects || (scene.objects = {}));
        var objects = scene.objects;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (scene) {
        var OcTree = (function () {
            function OcTree() { }
            return OcTree;
        })();
        scene.OcTree = OcTree;        
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
var akra;
(function (akra) {
    var Engine = (function () {
        function Engine(sCanvasId) {
            if (typeof sCanvasId === "undefined") { sCanvasId = null; }
            this.useHWAA = false;
            this.isShowCursorWhenFullscreen = false;
            this.iCreationWidth = 0;
            this.iCreationHeight = 0;
            this.isActive = false;
            this.isDeviceLost = false;
            this.isFrameMoving = true;
            this.isSingleStep = true;
            this.isFrameReady = false;
            this.fTime = 0;
            this.fElapsedTime = 0;
            this.fUpdateTimeCount = 0;
            this.fFPS = 0;
            this.sDeviceStats = "";
            this.sFrameStats = "";
            this.pFonts = null;
            this.isShowStats = false;
            this.pCanvas = null;
            this.pDevice = null;
            this.pRenderer = null;
            this.pResourceManager = null;
            this.pDisplayManager = null;
            this.pParticleManager = null;
            this.pSpriteManager = null;
            this.pLightManager = null;
            this.pRootNode = null;
            this.pDefaultCamera = null;
            this.pActiveCamera = null;
            this.pSceneTree = null;
            this.pWorldExtents = null;
            this.pRenderList = null;
            this.pRenderState = null;
            this.pause(true);
            if(sCanvasId) {
                this.create(sCanvasId);
            }
        }
        Engine.pKeymap = new akra.util.KeyMap();
        Engine.pGamepad = new akra.util.GamepadMap();
        Object.defineProperty(Engine.prototype, "displayManager", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "particleManager", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "spriteManager", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "lightManager", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "rootNode", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "sceneTree", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "defaultCamera", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "activeViewport", {
            get: function () {
                return {
                    width: 0,
                    height: 0,
                    x: 0,
                    y: 0
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "worldExtents", {
            get: function () {
                return {
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "device", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "activeCamera", {
            get: function () {
                return null;
            },
            set: function (pCamera) {
                return;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "time", {
            get: function () {
                return this.fTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "elapsedTime", {
            get: function () {
                return this.fElapsedTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "fps", {
            get: function () {
                return this.fFPS;
            },
            enumerable: true,
            configurable: true
        });
        Engine.prototype.create = function (pCanvas) {
            if(akra.isString(pCanvas)) {
                this.pCanvas = document.getElementById(pCanvas);
            } else {
                this.pCanvas = pCanvas;
            }
            this.pRootNode = new akra.scene.SceneNode(this);
            this.pRootNode.name = ".root";
            this.pDefaultCamera = new akra.scene.objects.Camera(this);
            this.pDefaultCamera.name = ".default";
            this.pSceneTree = new akra.scene.OcTree();
            this.pActiveCamera = this.pDefaultCamera;
            this.iCreationWidth = this.pCanvas.width;
            this.iCreationHeight = this.pCanvas.height;
            this.pDevice = akra.createDevice(this.pCanvas, {
                antialias: this.useHWAA
            });
            if(!this.pDevice) {
                akra.debug_warning('cannot create device object');
                return false;
            }
            this.initDe;
            return false;
        };
        Engine.prototype.run = function () {
            return false;
        };
        Engine.prototype.setupWorldOcTree = function (pWorldExtents) {
        };
        Engine.prototype.pause = function (isPause) {
        };
        Engine.prototype.showStats = function (isShow) {
        };
        Engine.prototype.fullscreen = function () {
            return false;
        };
        Engine.prototype.inFullscreenMode = function () {
            return false;
        };
        Engine.prototype.notifyOneTimeSceneInit = function () {
            return false;
        };
        Engine.prototype.notifyRestoreDeviceObjects = function () {
            return false;
        };
        Engine.prototype.notifyDeleteDeviceObjects = function () {
            return false;
        };
        Engine.prototype.notifyUpdateScene = function () {
            return false;
        };
        Engine.prototype.notifyPreUpdateScene = function () {
            return false;
        };
        Engine.prototype.notifyInitDeviceObjects = function () {
            return false;
        };
        Engine.prototype.updateCamera = function () {
        };
        Engine.prototype.updateStats = function () {
        };
        Engine.prototype.initDefaultStates = function () {
            this.pRenderState = {
                mesh: {
                    isSkinning: false
                },
                isAdvancedIndex: false,
                lights: {
                    omni: 0,
                    project: 0,
                    omniShadows: 0,
                    projectShadows: 0
                }
            };
            return true;
        };
        Engine.prototype.initialize3DEnvironment = function () {
            return false;
        };
        Engine.prototype.render3DEnvironment = function () {
            return false;
        };
        Engine.prototype.cleanup3DEnvironment = function () {
            return false;
        };
        Engine.prototype.invalidateDeviceObjects = function () {
            return false;
        };
        Engine.prototype.frameMove = function () {
            return false;
        };
        Engine.prototype.render = function () {
            return false;
        };
        Engine.prototype.finalCleanup = function () {
            return null;
        };
        return Engine;
    })();
    akra.Engine = Engine;    
})(akra || (akra = {}));
var akra;
(function (akra) {
    akra.DEBUG = true;
    function typeOf(x) {
        var s = typeof x;
        if(s === "object") {
            if(x) {
                if(x instanceof Array) {
                    return 'array';
                } else {
                    if(x instanceof Object) {
                        return s;
                    }
                }
                var sClassName = Object.prototype.toString.call(x);
                if(sClassName == '[object Window]') {
                    return 'object';
                }
                if((sClassName == '[object Array]' || typeof x.length == 'number' && typeof x.splice != 'undefined' && typeof x.propertyIsEnumerable != 'undefined' && !x.propertyIsEnumerable('splice'))) {
                    return 'array';
                }
                if((sClassName == '[object Function]' || typeof x.call != 'undefined' && typeof x.propertyIsEnumerable != 'undefined' && !x.propertyIsEnumerable('call'))) {
                    return 'function';
                }
            } else {
                return 'null';
            }
        } else {
            if(s == 'function' && typeof x.call == 'undefined') {
                return 'object';
            }
        }
        return s;
    }
    akra.typeOf = typeOf;
    ; ;
    akra.isDef = function (x) {
        return x !== undefined;
    };
    akra.isNull = function (x) {
        return x === null;
    };
    akra.isBoolean = function (x) {
        return typeof x === "boolean";
    };
    akra.isString = function (x) {
        return typeof x === "string";
    };
    akra.isNumber = function (x) {
        return typeof x === "number";
    };
    akra.isFloat = akra.isNumber;
    akra.isInt = akra.isNumber;
    akra.isFunction = function (x) {
        return typeOf(x) === "function";
    };
    akra.isObject = function (x) {
        var type = typeOf(x);
        return type == 'object' || type == 'array' || type == 'function';
    };
    if(!akra.isDef(console.assert)) {
        console.assert = function (isOK) {
            var pParams = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                pParams[_i] = arguments[_i + 1];
            }
            if(!isOK) {
                akra.trace('---------------------------');
                akra.trace.apply(null, pParams);
                throw new Error("[assertion failed]");
            }
        };
    }
    akra.trace = console.log.bind(console);
    akra.assert = console.assert.bind(console);
    akra.warning = console.warn.bind(console);
    akra.error = console.error.bind(console);
    akra.debug_print = function (pArg) {
        var pParams = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            pParams[_i] = arguments[_i + 1];
        }
        if(akra.DEBUG) {
            akra.trace.apply(null, arguments);
        }
    };
    akra.debug_assert = function (isOK) {
        var pParams = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            pParams[_i] = arguments[_i + 1];
        }
        if(akra.DEBUG) {
            akra.assert.apply(null, arguments);
        }
    };
    akra.debug_warning = function (pArg) {
        var pParams = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            pParams[_i] = arguments[_i + 1];
        }
        if(akra.DEBUG) {
            akra.warning.apply(null, arguments);
        }
    };
    akra.debug_error = function (pArg) {
        var pParams = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            pParams[_i] = arguments[_i + 1];
        }
        if(akra.DEBUG) {
            akra.error.apply(null, arguments);
        }
    };
    function initDevice(pDevice) {
        return pDevice;
    }
    akra.initDevice = initDevice;
    function createDevice(pCanvas, pOptions) {
        if (typeof pCanvas === "undefined") { pCanvas = document.createElement("canvas"); }
        var pDevice = null;
        try  {
            pDevice = pCanvas.getContext("webgl", pOptions) || pCanvas.getContext("experimental-webgl", pOptions);
        } catch (e) {
        }
        if(!pDevice) {
            akra.debug_warning("cannot get 3d device");
        }
        return initDevice(pDevice);
    }
    akra.createDevice = createDevice;
    akra.MIN_INT32 = 4294967295;
    akra.MAX_INT32 = 2147483647;
    akra.MIN_INT16 = 65535;
    akra.MAX_INT16 = 32767;
    akra.MIN_INT8 = 255;
    akra.MAX_INT8 = 127;
    akra.MIN_UINT32 = 0;
    akra.MAX_UINT32 = 4294967295;
    akra.MIN_UINT16 = 0;
    akra.MAX_UINT16 = 65535;
    akra.MIN_UINT8 = 0;
    akra.MAX_UINT8 = 255;
    akra.SIZE_FLOAT64 = 8;
    akra.SIZE_REAL64 = 8;
    akra.SIZE_FLOAT32 = 4;
    akra.SIZE_REAL32 = 4;
    akra.SIZE_INT32 = 4;
    akra.SIZE_UINT32 = 4;
    akra.SIZE_INT16 = 2;
    akra.SIZE_UINT16 = 2;
    akra.SIZE_INT8 = 1;
    akra.SIZE_UINT8 = 1;
    akra.SIZE_BYTE = 1;
    akra.SIZE_UBYTE = 1;
    akra.MAX_FLOAT64 = Number.MAX_VALUE;
    akra.MIN_FLOAT64 = -Number.MAX_VALUE;
    akra.TINY_FLOAT64 = Number.MIN_VALUE;
    akra.MAX_REAL64 = Number.MAX_VALUE;
    akra.MIN_REAL64 = -Number.MAX_VALUE;
    akra.TINY_REAL64 = Number.MIN_VALUE;
    akra.MAX_FLOAT32 = 3.4e+38;
    akra.MIN_FLOAT32 = -3.4e+38;
    akra.TINY_FLOAT32 = 1.5e-45;
    akra.MAX_REAL32 = 3.4e+38;
    akra.MIN_REAL32 = -3.4e+38;
    akra.TINY_REAL32 = 1.5e-45;
    (function (DataTypes) {
        DataTypes._map = [];
        DataTypes.BYTE = 5120;
        DataTypes.UNSIGNED_BYTE = 5121;
        DataTypes.SHORT = 5122;
        DataTypes.UNSIGNED_SHORT = 5123;
        DataTypes.INT = 5124;
        DataTypes.UNSIGNED_INT = 5125;
        DataTypes.FLOAT = 5126;
    })(akra.DataTypes || (akra.DataTypes = {}));
    var DataTypes = akra.DataTypes;
    ; ;
    (function (DataTypeSizes) {
        DataTypeSizes._map = [];
        DataTypeSizes.BYTES_PER_BYTE = 1;
        DataTypeSizes.BYTES_PER_UNSIGNED_BYTE = 1;
        DataTypeSizes.BYTES_PER_UBYTE = 1;
        DataTypeSizes.BYTES_PER_SHORT = 2;
        DataTypeSizes.BYTES_PER_UNSIGNED_SHORT = 2;
        DataTypeSizes.BYTES_PER_USHORT = 2;
        DataTypeSizes.BYTES_PER_INT = 4;
        DataTypeSizes.BYTES_PER_UNSIGNED_INT = 4;
        DataTypeSizes.BYTES_PER_UINT = 4;
        DataTypeSizes.BYTES_PER_FLOAT = 4;
    })(akra.DataTypeSizes || (akra.DataTypeSizes = {}));
    var DataTypeSizes = akra.DataTypeSizes;
    ; ;
    (function (ResourceTypes) {
        ResourceTypes._map = [];
        ResourceTypes.SURFACE = 1;
        ResourceTypes._map[2] = "VOLUME";
        ResourceTypes.VOLUME = 2;
        ResourceTypes._map[3] = "TEXTURE";
        ResourceTypes.TEXTURE = 3;
        ResourceTypes._map[4] = "VOLUMETEXTURE";
        ResourceTypes.VOLUMETEXTURE = 4;
        ResourceTypes._map[5] = "CUBETEXTURE";
        ResourceTypes.CUBETEXTURE = 5;
        ResourceTypes._map[6] = "VERTEXBUFFER";
        ResourceTypes.VERTEXBUFFER = 6;
        ResourceTypes._map[7] = "INDEXBUFFER";
        ResourceTypes.INDEXBUFFER = 7;
        ResourceTypes.FORCE_DWORD = 2147483647;
    })(akra.ResourceTypes || (akra.ResourceTypes = {}));
    var ResourceTypes = akra.ResourceTypes;
    ; ;
    (function (PrimitiveTypes) {
        PrimitiveTypes._map = [];
        PrimitiveTypes.POINTLIST = 0;
        PrimitiveTypes._map[1] = "LINELIST";
        PrimitiveTypes.LINELIST = 1;
        PrimitiveTypes._map[2] = "LINELOOP";
        PrimitiveTypes.LINELOOP = 2;
        PrimitiveTypes._map[3] = "LINESTRIP";
        PrimitiveTypes.LINESTRIP = 3;
        PrimitiveTypes._map[4] = "TRIANGLELIST";
        PrimitiveTypes.TRIANGLELIST = 4;
        PrimitiveTypes._map[5] = "TRIANGLESTRIP";
        PrimitiveTypes.TRIANGLESTRIP = 5;
        PrimitiveTypes._map[6] = "TRIANGLEFAN";
        PrimitiveTypes.TRIANGLEFAN = 6;
    })(akra.PrimitiveTypes || (akra.PrimitiveTypes = {}));
    var PrimitiveTypes = akra.PrimitiveTypes;
    ; ;
    (function (ImageFormats) {
        ImageFormats._map = [];
        ImageFormats.RGB = 6407;
        ImageFormats.RGB8 = 6407;
        ImageFormats.BGR8 = 32864;
        ImageFormats.RGBA = 6408;
        ImageFormats.RGBA8 = 6408;
        ImageFormats.BGRA8 = 6409;
        ImageFormats.RGBA4 = 32854;
        ImageFormats.BGRA4 = 32857;
        ImageFormats.RGB5_A1 = 32855;
        ImageFormats.BGR5_A1 = 32856;
        ImageFormats.RGB565 = 36194;
        ImageFormats.BGR565 = 36195;
        ImageFormats.RGB_DXT1 = 33776;
        ImageFormats.RGBA_DXT1 = 33777;
        ImageFormats.RGBA_DXT2 = 33780;
        ImageFormats.RGBA_DXT3 = 33778;
        ImageFormats.RGBA_DXT4 = 33781;
        ImageFormats.RGBA_DXT5 = 33779;
        ImageFormats.DEPTH_COMPONENT = 6402;
        ImageFormats.ALPHA = 6406;
        ImageFormats.LUMINANCE = 6409;
        ImageFormats.LUMINANCE_ALPHA = 6410;
    })(akra.ImageFormats || (akra.ImageFormats = {}));
    var ImageFormats = akra.ImageFormats;
    ; ;
    (function (ImageShortFormats) {
        ImageShortFormats._map = [];
        ImageShortFormats.RGB = 6407;
        ImageShortFormats.RGBA = 6408;
    })(akra.ImageShortFormats || (akra.ImageShortFormats = {}));
    var ImageShortFormats = akra.ImageShortFormats;
    ; ;
    (function (ImageTypes) {
        ImageTypes._map = [];
        ImageTypes.UNSIGNED_BYTE = 5121;
        ImageTypes.UNSIGNED_SHORT_4_4_4_4 = 32819;
        ImageTypes.UNSIGNED_SHORT_5_5_5_1 = 32820;
        ImageTypes.UNSIGNED_SHORT_5_6_5 = 33635;
        ImageTypes.FLOAT = 5126;
    })(akra.ImageTypes || (akra.ImageTypes = {}));
    var ImageTypes = akra.ImageTypes;
    ; ;
    (function (TextureFilters) {
        TextureFilters._map = [];
        TextureFilters.NEAREST = 9728;
        TextureFilters.LINEAR = 9729;
        TextureFilters.NEAREST_MIPMAP_NEAREST = 9984;
        TextureFilters.LINEAR_MIPMAP_NEAREST = 9985;
        TextureFilters.NEAREST_MIPMAP_LINEAR = 9986;
        TextureFilters.LINEAR_MIPMAP_LINEAR = 9987;
    })(akra.TextureFilters || (akra.TextureFilters = {}));
    var TextureFilters = akra.TextureFilters;
    ; ;
    (function (TextureWrapModes) {
        TextureWrapModes._map = [];
        TextureWrapModes.REPEAT = 10497;
        TextureWrapModes.CLAMP_TO_EDGE = 33071;
        TextureWrapModes.MIRRORED_REPEAT = 33648;
    })(akra.TextureWrapModes || (akra.TextureWrapModes = {}));
    var TextureWrapModes = akra.TextureWrapModes;
    ; ;
    (function (TextureParameters) {
        TextureParameters._map = [];
        TextureParameters.MAG_FILTER = 10240;
        TextureParameters._map[10241] = "MIN_FILTER";
        TextureParameters.MIN_FILTER = 10241;
        TextureParameters._map[10242] = "WRAP_S";
        TextureParameters.WRAP_S = 10242;
        TextureParameters._map[10243] = "WRAP_T";
        TextureParameters.WRAP_T = 10243;
    })(akra.TextureParameters || (akra.TextureParameters = {}));
    var TextureParameters = akra.TextureParameters;
    ; ;
    (function (TextureTypes) {
        TextureTypes._map = [];
        TextureTypes.TEXTURE_2D = 3553;
        TextureTypes.TEXTURE = 5890;
        TextureTypes.TEXTURE_CUBE_MAP = 34067;
        TextureTypes.TEXTURE_BINDING_CUBE_MAP = 34068;
        TextureTypes.TEXTURE_CUBE_MAP_POSITIVE_X = 34069;
        TextureTypes.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070;
        TextureTypes.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071;
        TextureTypes.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072;
        TextureTypes.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073;
        TextureTypes.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074;
        TextureTypes.MAX_CUBE_MAP_TEXTURE_SIZE = 34076;
    })(akra.TextureTypes || (akra.TextureTypes = {}));
    var TextureTypes = akra.TextureTypes;
    ; ;
    (function (GLSpecifics) {
        GLSpecifics._map = [];
        GLSpecifics.UNPACK_ALIGNMENT = 3317;
        GLSpecifics.PACK_ALIGNMENT = 3333;
        GLSpecifics.UNPACK_FLIP_Y_WEBGL = 37440;
        GLSpecifics.UNPACK_PREMULTIPLY_ALPHA_WEBGL = 37441;
        GLSpecifics.CONTEXT_LOST_WEBGL = 37442;
        GLSpecifics.UNPACK_COLORSPACE_CONVERSION_WEBGL = 37443;
        GLSpecifics.BROWSER_DEFAULT_WEBGL = 37444;
    })(akra.GLSpecifics || (akra.GLSpecifics = {}));
    var GLSpecifics = akra.GLSpecifics;
    ; ;
    (function (BufferMasks) {
        BufferMasks._map = [];
        BufferMasks.DEPTH_BUFFER_BIT = 256;
        BufferMasks.STENCIL_BUFFER_BIT = 1024;
        BufferMasks.COLOR_BUFFER_BIT = 16384;
    })(akra.BufferMasks || (akra.BufferMasks = {}));
    var BufferMasks = akra.BufferMasks;
    ; ;
    (function (BufferUsages) {
        BufferUsages._map = [];
        BufferUsages.STREAM_DRAW = 35040;
        BufferUsages.STATIC_DRAW = 35044;
        BufferUsages.DYNAMIC_DRAW = 35048;
    })(akra.BufferUsages || (akra.BufferUsages = {}));
    var BufferUsages = akra.BufferUsages;
    ; ;
    (function (BufferTypes) {
        BufferTypes._map = [];
        BufferTypes.ARRAY_BUFFER = 34962;
        BufferTypes.ELEMENT_ARRAY_BUFFER = 34963;
        BufferTypes.FRAME_BUFFER = 36160;
        BufferTypes.RENDER_BUFFER = 36161;
    })(akra.BufferTypes || (akra.BufferTypes = {}));
    var BufferTypes = akra.BufferTypes;
    ; ;
    (function (AttachmentTypes) {
        AttachmentTypes._map = [];
        AttachmentTypes.COLOR_ATTACHMENT0 = 36064;
        AttachmentTypes.DEPTH_ATTACHMENT = 36096;
        AttachmentTypes.STENCIL_ATTACHMENT = 36128;
        AttachmentTypes.DEPTH_STENCIL_ATTACHMENT = 33306;
    })(akra.AttachmentTypes || (akra.AttachmentTypes = {}));
    var AttachmentTypes = akra.AttachmentTypes;
    ; ;
    (function (ShaderTypes) {
        ShaderTypes._map = [];
        ShaderTypes.PIXEL = 35632;
        ShaderTypes._map[35633] = "VERTEX";
        ShaderTypes.VERTEX = 35633;
    })(akra.ShaderTypes || (akra.ShaderTypes = {}));
    var ShaderTypes = akra.ShaderTypes;
    ; ;
    (function (RenderStates) {
        RenderStates._map = [];
        RenderStates.ZENABLE = 7;
        RenderStates.ZWRITEENABLE = 14;
        RenderStates.SRCBLEND = 19;
        RenderStates.DESTBLEND = 20;
        RenderStates.CULLMODE = 22;
        RenderStates.ZFUNC = 23;
        RenderStates.DITHERENABLE = 26;
        RenderStates.ALPHABLENDENABLE = 27;
        RenderStates._map[28] = "ALPHATESTENABLE";
        RenderStates.ALPHATESTENABLE = 28;
    })(akra.RenderStates || (akra.RenderStates = {}));
    var RenderStates = akra.RenderStates;
    ; ;
    (function (BlendModes) {
        BlendModes._map = [];
        BlendModes.ZERO = 0;
        BlendModes.ONE = 1;
        BlendModes.SRCCOLOR = 768;
        BlendModes.INVSRCCOLOR = 769;
        BlendModes.SRCALPHA = 770;
        BlendModes.INVSRCALPHA = 771;
        BlendModes.DESTALPHA = 772;
        BlendModes.INVDESTALPHA = 773;
        BlendModes.DESTCOLOR = 774;
        BlendModes.INVDESTCOLOR = 775;
        BlendModes.SRCALPHASAT = 776;
    })(akra.BlendModes || (akra.BlendModes = {}));
    var BlendModes = akra.BlendModes;
    ; ;
    (function (CmpFuncs) {
        CmpFuncs._map = [];
        CmpFuncs.NEVER = 1;
        CmpFuncs.LESS = 2;
        CmpFuncs.EQUAL = 3;
        CmpFuncs.LESSEQUAL = 4;
        CmpFuncs.GREATER = 5;
        CmpFuncs.NOTEQUAL = 6;
        CmpFuncs.GREATEREQUAL = 7;
        CmpFuncs.ALWAYS = 8;
    })(akra.CmpFuncs || (akra.CmpFuncs = {}));
    var CmpFuncs = akra.CmpFuncs;
    ; ;
    (function (CullModes) {
        CullModes._map = [];
        CullModes.NONE = 0;
        CullModes.CW = 1028;
        CullModes.CCW = 1029;
        CullModes.FRONT_AND_BACK = 1032;
    })(akra.CullModes || (akra.CullModes = {}));
    var CullModes = akra.CullModes;
    ; ;
    (function (TextureUnits) {
        TextureUnits._map = [];
        TextureUnits.TEXTURE = 33984;
    })(akra.TextureUnits || (akra.TextureUnits = {}));
    var TextureUnits = akra.TextureUnits;
    ; ;
            function getTypeSize(eType) {
        switch(eType) {
            case DataTypes.BYTE:
            case DataTypes.UNSIGNED_BYTE: {
                return 1;

            }
            case DataTypes.SHORT:
            case DataTypes.UNSIGNED_SHORT:
            case ImageTypes.UNSIGNED_SHORT_4_4_4_4:
            case ImageTypes.UNSIGNED_SHORT_5_5_5_1:
            case ImageTypes.UNSIGNED_SHORT_5_6_5: {
                return 2;

            }
            case DataTypes.INT:
            case DataTypes.UNSIGNED_INT:
            case DataTypes.FLOAT: {
                return 4;

            }
            default: {
                akra.error('unknown data/image type used');

            }
        }
        return 0;
    }
    akra.getTypeSize = getTypeSize;
    (window).URL = (window).URL ? (window).URL : (window).webkitURL ? (window).webkitURL : null;
    (window).BlobBuilder = (window).WebKitBlobBuilder || (window).MozBlobBuilder || (window).BlobBuilder;
    (window).requestFileSystem = (window).requestFileSystem || (window).webkitRequestFileSystem;
    (window).requestAnimationFrame = (window).requestAnimationFrame || (window).webkitRequestAnimationFrame || (window).mozRequestAnimationFrame;
    (window).WebSocket = (window).WebSocket || (window).MozWebSocket;
})(akra || (akra = {}));
; ;
var DemoApp = (function (_super) {
    __extends(DemoApp, _super);
    function DemoApp() {
        _super.apply(this, arguments);

    }
    DemoApp.prototype.oneTimeSceneInit = function () {
        this.notifyOneTimeSceneInit();
        this.setupWorldOcTree(new akra.geometry.Rect3d(-500, 500, -500, 500, 0, 500));
        return true;
    };
    return DemoApp;
})(akra.Engine);
var pApp = new DemoApp();
if(!pApp.create('canvas') || !pApp.run()) {
    akra.error('cannot create and run application.');
}
