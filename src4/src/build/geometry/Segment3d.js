/// <reference path="../idl/ISegment3d.ts" />
/// <reference path="Ray3d.ts" />
var akra;
(function (akra) {
    (function (geometry) {
        var Segment3d = (function () {
            function Segment3d() {
                this.ray = new akra.geometry.Ray3d();
                this.distance = 0.;
            }
            Segment3d.prototype.getPoint = function () {
                return this.ray.point;
            };

            Segment3d.prototype.setPoint = function (v3fPoint) {
                this.ray.point.set(v3fPoint);
            };

            Segment3d.prototype.getNormal = function () {
                return this.ray.normal;
            };

            Segment3d.prototype.setNormal = function (v3fNormal) {
                this.ray.normal.set(v3fNormal);
            };
            return Segment3d;
        })();
        geometry.Segment3d = Segment3d;
    })(akra.geometry || (akra.geometry = {}));
    var geometry = akra.geometry;
})(akra || (akra = {}));
//# sourceMappingURL=Segment3d.js.map
