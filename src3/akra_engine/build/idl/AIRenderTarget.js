// AIRenderTarget interface
// [write description here...]
/// <reference path="AIDepthBuffer.ts" />
/// <reference path="AIFrameStats.ts" />
/// <reference path="AICamera.ts" />
/// <reference path="AIPixelBuffer.ts" />
/// <reference path="AITexture.ts" />
/// <reference path="AIPixelBox.ts" />
var AEFramebuffer;
(function (AEFramebuffer) {
    AEFramebuffer[AEFramebuffer["FRONT"] = 0] = "FRONT";
    AEFramebuffer[AEFramebuffer["BACK"] = 1] = "BACK";
    AEFramebuffer[AEFramebuffer["AUTO"] = 2] = "AUTO";
})(AEFramebuffer || (AEFramebuffer = {}));
;

var AEStatFlags;
(function (AEStatFlags) {
    AEStatFlags[AEStatFlags["NONE"] = 0] = "NONE";
    AEStatFlags[AEStatFlags["FPS"] = 1] = "FPS";
    AEStatFlags[AEStatFlags["AVG_FPS"] = 2] = "AVG_FPS";
    AEStatFlags[AEStatFlags["BEST_FPS"] = 4] = "BEST_FPS";
    AEStatFlags[AEStatFlags["WORST_FPS"] = 8] = "WORST_FPS";
    AEStatFlags[AEStatFlags["TRIANGLE_COUNT"] = 16] = "TRIANGLE_COUNT";
    AEStatFlags[AEStatFlags["ALL"] = 0xFFFF] = "ALL";
})(AEStatFlags || (AEStatFlags = {}));
;

var AE3DEventTypes;
(function (AE3DEventTypes) {
    AE3DEventTypes[AE3DEventTypes["CLICK"] = 0x01] = "CLICK";
    AE3DEventTypes[AE3DEventTypes["MOUSEMOVE"] = 0x02] = "MOUSEMOVE";
    AE3DEventTypes[AE3DEventTypes["MOUSEDOWN"] = 0x04] = "MOUSEDOWN";
    AE3DEventTypes[AE3DEventTypes["MOUSEUP"] = 0x08] = "MOUSEUP";
    AE3DEventTypes[AE3DEventTypes["MOUSEOVER"] = 0x10] = "MOUSEOVER";
    AE3DEventTypes[AE3DEventTypes["MOUSEOUT"] = 0x20] = "MOUSEOUT";
    AE3DEventTypes[AE3DEventTypes["DRAGSTART"] = 0x40] = "DRAGSTART";
    AE3DEventTypes[AE3DEventTypes["DRAGSTOP"] = 0x80] = "DRAGSTOP";
    AE3DEventTypes[AE3DEventTypes["DRAGGING"] = 0x100] = "DRAGGING";
    AE3DEventTypes[AE3DEventTypes["MOUSEWHEEL"] = 0x200] = "MOUSEWHEEL";
})(AE3DEventTypes || (AE3DEventTypes = {}));
//# sourceMappingURL=AIRenderTarget.js.map
