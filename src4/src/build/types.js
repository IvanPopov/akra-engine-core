/// <reference path="idl/EDataTypes.ts" />
/// <reference path="logger.ts" />
var akra;
(function (akra) {
    function sizeof(eType) {
        switch (eType) {
            case 5120 /* BYTE */:
            case 5121 /* UNSIGNED_BYTE */:
                return 1;
            case 5122 /* SHORT */:
            case 5123 /* UNSIGNED_SHORT */:
                return 2;
            case 5124 /* INT */:
            case 5125 /* UNSIGNED_INT */:
            case 5126 /* FLOAT */:
                return 4;
            default:
                akra.logger.error("unknown data/image type used");
        }
    }
    akra.sizeof = sizeof;
})(akra || (akra = {}));
//# sourceMappingURL=types.js.map
