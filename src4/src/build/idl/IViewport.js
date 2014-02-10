/// <reference path="IViewportState.ts" />
/// <reference path="IRect2d.ts" />
/// <reference path="IColor.ts" />
/// <reference path="IRenderTarget.ts" />
/// <reference path="ICamera.ts" />
/// <reference path="IRenderableObject.ts" />
/// <reference path="IClickable.ts" />
/// <reference path="IColor.ts" />
/// <reference path="IRID.ts" />
/// <reference path="IRect2d.ts" />
/// <reference path="IViewportState.ts" />
var akra;
(function (akra) {
    ;

    (function (EViewportTypes) {
        EViewportTypes[EViewportTypes["DEFAULT"] = -1] = "DEFAULT";
        EViewportTypes[EViewportTypes["DSVIEWPORT"] = 1] = "DSVIEWPORT";
        EViewportTypes[EViewportTypes["SHADOWVIEWPORT"] = 2] = "SHADOWVIEWPORT";
        EViewportTypes[EViewportTypes["COLORVIEWPORT"] = 3] = "COLORVIEWPORT";
        EViewportTypes[EViewportTypes["TEXTUREVIEWPORT"] = 4] = "TEXTUREVIEWPORT";
    })(akra.EViewportTypes || (akra.EViewportTypes = {}));
    var EViewportTypes = akra.EViewportTypes;
})(akra || (akra = {}));
//# sourceMappingURL=IViewport.js.map
