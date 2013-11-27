/// <reference path="../idl/AIScreenInfo.ts" />
define(["require", "exports"], function(require, exports) {
    var ScreenInfo = (function () {
        function ScreenInfo() {
        }
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

    
    return ScreenInfo;
});
//# sourceMappingURL=ScreenInfo.js.map
