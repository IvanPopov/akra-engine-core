var akra;
(function (akra) {
    (function (EPlaneClassifications) {
        /**
        * ax+by+cz+d=0
        * PLANE_FRONT - объект находится перед плоскостью, то есть по направлению нормали
        * PLANE_BACK - объект находится за плостостью, то есть против направления нормали
        */
        EPlaneClassifications[EPlaneClassifications["PLANE_FRONT"] = 0] = "PLANE_FRONT";
        EPlaneClassifications[EPlaneClassifications["PLANE_BACK"] = 1] = "PLANE_BACK";
        EPlaneClassifications[EPlaneClassifications["PLANE_INTERSECT"] = 2] = "PLANE_INTERSECT";
    })(akra.EPlaneClassifications || (akra.EPlaneClassifications = {}));
    var EPlaneClassifications = akra.EPlaneClassifications;
})(akra || (akra = {}));
//# sourceMappingURL=EPlaneClassifications.js.map
