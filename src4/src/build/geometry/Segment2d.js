/// <reference path="../idl/ISegment2d.ts" />
/// <reference path="Ray2d.ts" />
var akra;
(function (akra) {
    (function (geometry) {
        var Segment2d = (function () {
            function Segment2d() {
                this.ray = new akra.geometry.Ray2d();
                this.distance = 0.;
            }
            Segment2d.prototype.getPoint = function () {
                return this.ray.point;
            };

            Segment2d.prototype.setPoint = function (v2fPoint) {
                this.ray.point.set(v2fPoint);
            };

            Segment2d.prototype.getNormal = function () {
                return this.ray.normal;
            };

            Segment2d.prototype.setNormal = function (v2fNormal) {
                this.ray.normal.set(v2fNormal);
            };
            return Segment2d;
        })();
        geometry.Segment2d = Segment2d;
    })(akra.geometry || (akra.geometry = {}));
    var geometry = akra.geometry;
})(akra || (akra = {}));
//# sourceMappingURL=Segment2d.js.map
