var akra;
(function (akra) {
    var Vec2 = (function () {
        function Vec2() { }
        return Vec2;
    })();
    akra.Vec2 = Vec2;    
})(akra || (akra = {}));
var akra;
(function (akra) {
    var Vec3 = (function () {
        function Vec3(x, y, z) {
            switch(arguments.length) {
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
        Vec3.prototype.set = function (x, y, z) {
            switch(arguments.length) {
                case 0:
                case 1: {
                    if(typeof x === "number") {
                        this.x = this.y = this.z = x || 0;
                    } else {
                        this.x = x.x;
                        this.y = x.y;
                        this.z = x.z;
                    }
                    break;

                }
                case 2: {
                    if(typeof x === "number") {
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
        Vec3.v = new Vec3();
        return Vec3;
    })();
    akra.Vec3 = Vec3;    
    Vec3.v = new Vec3();
})(akra || (akra = {}));
var akra;
(function (akra) {
    var Engine = (function () {
        function Engine() {
            this.pRenderer = null;
            this.pResourceManager = null;
            this.pDisplayManager = null;
            this.pParticleManager = null;
            this.pSpriteManager = null;
            this.pLightManager = null;
        }
        Engine.prototype.create = function () {
            return false;
        };
        Engine.prototype.run = function () {
            return false;
        };
        Engine.prototype.setupWorldOcTree = function () {
        };
        Engine.prototype.pause = function (isPause) {
        };
        Engine.prototype.showStats = function (isShow) {
        };
        Engine.prototype.fullscreen = function () {
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
        Engine.prototype.getRootNode = function () {
        };
        Engine.prototype.getSceneTree = function () {
        };
        Engine.prototype.getDefaultCamera = function () {
        };
        Engine.prototype.getActiveViewport = function () {
            return {
                width: 0,
                height: 0,
                x: 0,
                y: 0
            };
        };
        Engine.prototype.getWorldExtents = function () {
            return {
            };
        };
        Engine.prototype.getDevice = function () {
            return null;
        };
        Engine.prototype.getWindowTitle = function () {
            return "";
        };
        Engine.prototype.getCurrentRenderStage = function () {
            return 0;
        };
        Engine.prototype.getActiveCamera = function () {
        };
        Engine.prototype.setActiveCamera = function (pCamera) {
            return null;
        };
        Engine.prototype.inFullscreenMode = function () {
            return false;
        };
        Engine.prototype.displayManager = function () {
            return null;
        };
        Engine.prototype.particleManager = function () {
            return null;
        };
        Engine.prototype.spriteManager = function () {
            return null;
        };
        Engine.prototype.lightManager = function () {
            return null;
        };
        return Engine;
    })();
    akra.Engine = Engine;    
})(akra || (akra = {}));
var v2 = new akra.Vec3(1, 2, 3);
var v = new akra.Vec3(10);
console.log((new akra.Vec3()).set(v.z, v2.z, v2.y).toString());
