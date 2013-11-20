/// <reference path="../idl/AISegment3d.ts" />
define(["require", "exports", "geometry/Ray3d"], function(require, exports, __Ray3d__) {
    var Ray3d = __Ray3d__;

    var Segment3d = (function () {
        function Segment3d() {
            this.ray = new Ray3d();
            this.distance = 0.;
        }
        Object.defineProperty(Segment3d.prototype, "point", {
            get: function () {
                return this.ray.point;
            },
            set: function (v3fPoint) {
                this.ray.point.set(v3fPoint);
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Segment3d.prototype, "normal", {
            get: function () {
                return this.ray.normal;
            },
            set: function (v3fNormal) {
                this.ray.normal.set(v3fNormal);
            },
            enumerable: true,
            configurable: true
        });

        return Segment3d;
    })();
});
//# sourceMappingURL=Segment3d.js.map
