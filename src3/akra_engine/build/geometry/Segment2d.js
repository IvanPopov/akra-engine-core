/// <reference path="../idl/AISegment2d.ts" />
define(["require", "exports", "geometry/Ray2d"], function(require, exports, __Ray2d__) {
    var Ray2d = __Ray2d__;

    var Segment2d = (function () {
        function Segment2d() {
            this.ray = new Ray2d();
            this.distance = 0.;
        }
        Object.defineProperty(Segment2d.prototype, "point", {
            get: function () {
                return this.ray.point;
            },
            set: function (v2fPoint) {
                this.ray.point.set(v2fPoint);
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Segment2d.prototype, "normal", {
            get: function () {
                return this.ray.normal;
            },
            set: function (v2fNormal) {
                this.ray.normal.set(v2fNormal);
            },
            enumerable: true,
            configurable: true
        });
        return Segment2d;
    })();
});
//# sourceMappingURL=Segment2d.js.map
