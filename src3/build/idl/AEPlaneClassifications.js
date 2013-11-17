var AEPlaneClassifications;
(function (AEPlaneClassifications) {
    /**
    * ax+by+cz+d=0
    * PLANE_FRONT - объект находится перед плоскостью, то есть по направлению нормали
    * PLANE_BACK - объект находится за плостостью, то есть против направления нормали
    */
    AEPlaneClassifications[AEPlaneClassifications["PLANE_FRONT"] = 0] = "PLANE_FRONT";
    AEPlaneClassifications[AEPlaneClassifications["PLANE_BACK"] = 1] = "PLANE_BACK";
    AEPlaneClassifications[AEPlaneClassifications["PLANE_INTERSECT"] = 2] = "PLANE_INTERSECT";
})(AEPlaneClassifications || (AEPlaneClassifications = {}));
//# sourceMappingURL=AEPlaneClassifications.js.map
