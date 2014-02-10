/// <reference path="IDepthBuffer.ts" />
/// <reference path="IFrameStats.ts" />
/// <reference path="ICamera.ts" />
/// <reference path="IPixelBuffer.ts" />
/// <reference path="ITexture.ts" />
/// <reference path="IPixelBox.ts" />
var akra;
(function (akra) {
    (function (EFramebuffer) {
        EFramebuffer[EFramebuffer["FRONT"] = 0] = "FRONT";
        EFramebuffer[EFramebuffer["BACK"] = 1] = "BACK";
        EFramebuffer[EFramebuffer["AUTO"] = 2] = "AUTO";
    })(akra.EFramebuffer || (akra.EFramebuffer = {}));
    var EFramebuffer = akra.EFramebuffer;
    ;

    (function (EStatFlags) {
        EStatFlags[EStatFlags["NONE"] = 0] = "NONE";
        EStatFlags[EStatFlags["FPS"] = 1] = "FPS";
        EStatFlags[EStatFlags["AVG_FPS"] = 2] = "AVG_FPS";
        EStatFlags[EStatFlags["BEST_FPS"] = 4] = "BEST_FPS";
        EStatFlags[EStatFlags["WORST_FPS"] = 8] = "WORST_FPS";
        EStatFlags[EStatFlags["TRIANGLE_COUNT"] = 16] = "TRIANGLE_COUNT";
        EStatFlags[EStatFlags["ALL"] = 0xFFFF] = "ALL";
    })(akra.EStatFlags || (akra.EStatFlags = {}));
    var EStatFlags = akra.EStatFlags;
    ;

    (function (E3DEventTypes) {
        E3DEventTypes[E3DEventTypes["CLICK"] = 0x01] = "CLICK";
        E3DEventTypes[E3DEventTypes["MOUSEMOVE"] = 0x02] = "MOUSEMOVE";
        E3DEventTypes[E3DEventTypes["MOUSEDOWN"] = 0x04] = "MOUSEDOWN";
        E3DEventTypes[E3DEventTypes["MOUSEUP"] = 0x08] = "MOUSEUP";
        E3DEventTypes[E3DEventTypes["MOUSEOVER"] = 0x10] = "MOUSEOVER";
        E3DEventTypes[E3DEventTypes["MOUSEOUT"] = 0x20] = "MOUSEOUT";
        E3DEventTypes[E3DEventTypes["DRAGSTART"] = 0x40] = "DRAGSTART";
        E3DEventTypes[E3DEventTypes["DRAGSTOP"] = 0x80] = "DRAGSTOP";
        E3DEventTypes[E3DEventTypes["DRAGGING"] = 0x100] = "DRAGGING";
        E3DEventTypes[E3DEventTypes["MOUSEWHEEL"] = 0x200] = "MOUSEWHEEL";
    })(akra.E3DEventTypes || (akra.E3DEventTypes = {}));
    var E3DEventTypes = akra.E3DEventTypes;
})(akra || (akra = {}));
//# sourceMappingURL=IRenderTarget.js.map
