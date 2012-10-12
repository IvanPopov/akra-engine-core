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
var akra;
(function (akra) {
    (function (util) {
        var BrowserInfo = (function () {
            function BrowserInfo() {
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
                    var t = 0;
                    var k = 5;
                    var g = t + k;
                    t++ , k++;
                    var f = 15.5;
                    var n = 1;
                    f = f + k + n;
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
        })();
        util.BrowserInfo = BrowserInfo;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var ApiInfo = (function () {
            function ApiInfo() { }
            return ApiInfo;
        })();
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
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
            this.pDevice = null;
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
                var className = Object.prototype.toString.call(x);
                if(className == '[object Window]') {
                    return 'object';
                }
                if((className == '[object Array]' || typeof x.length == 'number' && typeof x.splice != 'undefined' && typeof x.propertyIsEnumerable != 'undefined' && !x.propertyIsEnumerable('splice'))) {
                    return 'array';
                }
                if((className == '[object Function]' || typeof x.call != 'undefined' && typeof x.propertyIsEnumerable != 'undefined' && !x.propertyIsEnumerable('call'))) {
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
