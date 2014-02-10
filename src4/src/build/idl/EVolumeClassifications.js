var akra;
(function (akra) {
    (function (EVolumeClassifications) {
        EVolumeClassifications[EVolumeClassifications["NO_RELATION"] = 0] = "NO_RELATION";
        EVolumeClassifications[EVolumeClassifications["EQUAL"] = 1] = "EQUAL";
        EVolumeClassifications[EVolumeClassifications["A_CONTAINS_B"] = 2] = "A_CONTAINS_B";
        EVolumeClassifications[EVolumeClassifications["B_CONTAINS_A"] = 3] = "B_CONTAINS_A";
        EVolumeClassifications[EVolumeClassifications["INTERSECTING"] = 4] = "INTERSECTING";
    })(akra.EVolumeClassifications || (akra.EVolumeClassifications = {}));
    var EVolumeClassifications = akra.EVolumeClassifications;
})(akra || (akra = {}));
//# sourceMappingURL=EVolumeClassifications.js.map
