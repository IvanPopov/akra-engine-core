/// <reference path="../idl/IRay2d.ts" />
/// <reference path="../math/math.ts" />
var akra;
(function (akra) {
    (function (geometry) {
        var Vec2 = akra.math.Vec2;

        var Ray2d = (function () {
            function Ray2d() {
                this.point = new Vec2();
                this.normal = new Vec2();
            }
            return Ray2d;
        })();
        geometry.Ray2d = Ray2d;
    })(akra.geometry || (akra.geometry = {}));
    var geometry = akra.geometry;
})(akra || (akra = {}));
//# sourceMappingURL=Ray2d.js.map
