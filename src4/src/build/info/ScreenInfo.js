/// <reference path="../idl/IScreenInfo.ts" />
var akra;
(function (akra) {
    (function (info) {
        var ScreenInfo = (function () {
            function ScreenInfo() {
            }
            ScreenInfo.prototype.getWidth = function () {
                return akra.info.screen.getWidth();
            };

            ScreenInfo.prototype.getHeight = function () {
                return akra.info.screen.getHeight();
            };

            ScreenInfo.prototype.getAspect = function () {
                return akra.info.screen.getWidth() / akra.info.screen.getHeight();
            };

            ScreenInfo.prototype.getPixelDepth = function () {
                return akra.info.screen.getPixelDepth();
            };

            ScreenInfo.prototype.getColorDepth = function () {
                return akra.info.screen.getColorDepth();
            };
            return ScreenInfo;
        })();
        info.ScreenInfo = ScreenInfo;
    })(akra.info || (akra.info = {}));
    var info = akra.info;
})(akra || (akra = {}));
//# sourceMappingURL=ScreenInfo.js.map
