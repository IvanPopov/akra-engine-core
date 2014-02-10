/// <reference path="../idl/IRay3d.ts" />
/// <reference path="../math/math.ts" />
var akra;
(function (akra) {
    (function (geometry) {
        var Vec3 = akra.math.Vec3;

        var Ray3d = (function () {
            function Ray3d() {
                this.point = new Vec3();
                this.normal = new Vec3();
            }
            return Ray3d;
        })();
        geometry.Ray3d = Ray3d;
    })(akra.geometry || (akra.geometry = {}));
    var geometry = akra.geometry;
})(akra || (akra = {}));
//# sourceMappingURL=Ray3d.js.map
