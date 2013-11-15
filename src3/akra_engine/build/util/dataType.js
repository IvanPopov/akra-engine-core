/// <reference path="../idl/AEDataTypes.ts">
define(["require", "exports"], function(require, exports) {
    function size(eType) {
        switch (eType) {
            case 5120 /* BYTE */:
            case 5121 /* UNSIGNED_BYTE */:
                return 1;
            case 5122 /* SHORT */:
            case 5123 /* UNSIGNED_SHORT */:
                //case EImageTypes.UNSIGNED_SHORT_4_4_4_4:
                //case EImageTypes.UNSIGNED_SHORT_5_5_5_1:
                //case EImageTypes.UNSIGNED_SHORT_5_6_5:
                return 2;
            case 5124 /* INT */:
            case 5125 /* UNSIGNED_INT */:
            case 5126 /* FLOAT */:
                return 4;
            default:
                throw new Error("unknown data/image type used");
        }
    }
    exports.size = size;
});
//# sourceMappingURL=dataType.js.map
