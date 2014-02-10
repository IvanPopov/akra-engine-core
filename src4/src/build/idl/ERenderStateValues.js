var akra;
(function (akra) {
    (function (ERenderStateValues) {
        ERenderStateValues[ERenderStateValues["UNDEF"] = 0] = "UNDEF";

        ERenderStateValues[ERenderStateValues["TRUE"] = 1] = "TRUE";
        ERenderStateValues[ERenderStateValues["FALSE"] = 2] = "FALSE";
        ERenderStateValues[ERenderStateValues["ZERO"] = 3] = "ZERO";
        ERenderStateValues[ERenderStateValues["ONE"] = 4] = "ONE";
        ERenderStateValues[ERenderStateValues["SRCCOLOR"] = 5] = "SRCCOLOR";
        ERenderStateValues[ERenderStateValues["INVSRCCOLOR"] = 6] = "INVSRCCOLOR";
        ERenderStateValues[ERenderStateValues["SRCALPHA"] = 7] = "SRCALPHA";
        ERenderStateValues[ERenderStateValues["INVSRCALPHA"] = 8] = "INVSRCALPHA";
        ERenderStateValues[ERenderStateValues["DESTALPHA"] = 9] = "DESTALPHA";
        ERenderStateValues[ERenderStateValues["INVDESTALPHA"] = 10] = "INVDESTALPHA";
        ERenderStateValues[ERenderStateValues["DESTCOLOR"] = 11] = "DESTCOLOR";
        ERenderStateValues[ERenderStateValues["INVDESTCOLOR"] = 12] = "INVDESTCOLOR";
        ERenderStateValues[ERenderStateValues["SRCALPHASAT"] = 13] = "SRCALPHASAT";
        ERenderStateValues[ERenderStateValues["NONE"] = 14] = "NONE";
        ERenderStateValues[ERenderStateValues["CW"] = 15] = "CW";
        ERenderStateValues[ERenderStateValues["CCW"] = 16] = "CCW";
        ERenderStateValues[ERenderStateValues["FRONT"] = 17] = "FRONT";
        ERenderStateValues[ERenderStateValues["BACK"] = 18] = "BACK";
        ERenderStateValues[ERenderStateValues["FRONT_AND_BACK"] = 19] = "FRONT_AND_BACK";
        ERenderStateValues[ERenderStateValues["NEVER"] = 20] = "NEVER";
        ERenderStateValues[ERenderStateValues["LESS"] = 21] = "LESS";
        ERenderStateValues[ERenderStateValues["EQUAL"] = 22] = "EQUAL";
        ERenderStateValues[ERenderStateValues["LESSEQUAL"] = 23] = "LESSEQUAL";
        ERenderStateValues[ERenderStateValues["GREATER"] = 24] = "GREATER";
        ERenderStateValues[ERenderStateValues["NOTEQUAL"] = 25] = "NOTEQUAL";
        ERenderStateValues[ERenderStateValues["GREATEREQUAL"] = 26] = "GREATEREQUAL";
        ERenderStateValues[ERenderStateValues["ALWAYS"] = 27] = "ALWAYS";
    })(akra.ERenderStateValues || (akra.ERenderStateValues = {}));
    var ERenderStateValues = akra.ERenderStateValues;
})(akra || (akra = {}));
//# sourceMappingURL=ERenderStateValues.js.map
