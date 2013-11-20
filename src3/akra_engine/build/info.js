/// <reference path="idl/AICanvasInfo.ts" />
/// <reference path="idl/AIURI.ts" />
define(["require", "exports", "info/BrowserInfo", "info/ApiInfo", "info/ScreenInfo"], function(require, exports, __BrowserInfo__, __ApiInfo__, __ScreenInfo__) {
    var BrowserInfo = __BrowserInfo__;
    var ApiInfo = __ApiInfo__;
    var ScreenInfo = __ScreenInfo__;
    
    

    function canvas(id) {
        var pCanvas = isString(id) ? document.getElementById(id) : id;

        return {
            width: pCanvas.offsetWidth,
            height: pCanvas.offsetHeight,
            id: pCanvas.id
        };
    }
    exports.canvas = canvas;

    exports.browser = new BrowserInfo();
    exports.api = new ApiInfo();
    exports.screen = new ScreenInfo();
    exports.uri = exports.uri.parse(document.location.href);

    (function (is) {
        /**
        * show status - online or offline
        */
        var online;

        /**
        * perform test on mobile device
        */
        var mobile = (/mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i).test(navigator.userAgent.toLowerCase());
        var linux = exports.browser.os === 'Linux';
        var windows = exports.browser.os === 'Windows';
        var mac = exports.browser.os === 'Mac';
        var iPhone = exports.browser.os === 'iPhone';

        var Opera = exports.browser.name === "Opera";
    })(exports.is || (exports.is = {}));
    var is = exports.is;

    //TODO: move it to [akra.info.is] module, when typescript access this.
    Object.defineProperty(is, 'online', {
        get: function () {
            return navigator.onLine;
        }
    });
});
//# sourceMappingURL=info.js.map
