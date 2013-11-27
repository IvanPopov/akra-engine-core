/// <reference path="../idl/AIRay3d.ts" />
define(["require", "exports", "math/Vec3"], function(require, exports, __Vec3__) {
    var Vec3 = __Vec3__;

    var Ray3d = (function () {
        function Ray3d() {
            this.point = new Vec3();
            this.normal = new Vec3();
        }
        return Ray3d;
    })();

    
    return Ray3d;
});
//# sourceMappingURL=Ray3d.js.map
