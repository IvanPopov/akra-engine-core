/// <reference path="../idl/AEDataTypes.ts">
define(["require", "exports", "logger"], function(require, exports, __logger__) {
    var logger = __logger__;

    function size(eType) {
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
                logger.error("unknown data/image type used");
        }
    }
    exports.size = size;
});
//# sourceMappingURL=dataType.js.map
