/// <reference path="../idl/ICanvasInfo.ts" />
/// <reference path="../idl/IURI.ts" />
/// <reference path="../path/path.ts" />
/// <reference path="../uri/uri.ts" />
var akra;
(function (akra) {
    /// <reference path="BrowserInfo.ts" />
    /// <reference path="ApiInfo.ts" />
    /// <reference path="ScreenInfo.ts" />
    (function (info) {
        function canvas(id) {
            var pCanvas = akra.isString(id) ? document.getElementById(id) : id;

            return {
                width: pCanvas.offsetWidth,
                height: pCanvas.offsetHeight,
                id: pCanvas.id
            };
        }
        info.canvas = canvas;

        info.browser = new akra.info.BrowserInfo;
        info.api = new akra.info.ApiInfo;
        info.screen = new akra.info.ScreenInfo;
        info.uri = akra.uri.parse(document.location.href);

        (function (is) {
            /**
            * show status - online or offline
            */
            var online;

            /**
            * perform test on mobile device
            */
            var mobile = (/mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i).test(navigator.userAgent.toLowerCase());
            var linux = info.browser.getOS() === 'Linux';
            var windows = info.browser.getOS() === 'Windows';
            var mac = info.browser.getOS() === 'Mac';
            var iPhone = info.browser.getOS() === 'iPhone';

            var Opera = info.browser.getName() === "Opera";
        })(info.is || (info.is = {}));
        var is = info.is;

        //TODO: move it to [akra.info.is] module, when typescript access this.
        Object.defineProperty(is, 'online', {
            get: function () {
                return navigator.onLine;
            }
        });
    })(akra.info || (akra.info = {}));
    var info = akra.info;
})(akra || (akra = {}));
//# sourceMappingURL=info.js.map
