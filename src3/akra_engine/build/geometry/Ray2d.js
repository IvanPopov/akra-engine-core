/// <reference path="../idl/AIRay2d.ts" />
define(["require", "exports", "math/Vec2"], function(require, exports, __Vec2__) {
    var Vec2 = __Vec2__;

    var Ray2d = (function () {
        function Ray2d() {
            this.point = new Vec2();
            this.normal = new Vec2();
        }
        return Ray2d;
    })();

    
    return Ray2d;
});
//# sourceMappingURL=Ray2d.js.map
