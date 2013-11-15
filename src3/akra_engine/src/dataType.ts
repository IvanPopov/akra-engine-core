/// <reference path="../idl/AEDataTypes.ts">

import logger = require("logger");

export function size(eType: AEDataTypes): number {
    switch (eType) {
        case AEDataTypes.BYTE:
        case AEDataTypes.UNSIGNED_BYTE:
            return 1;
        case AEDataTypes.SHORT:
        case AEDataTypes.UNSIGNED_SHORT:
            return 2;
        case AEDataTypes.INT:
        case AEDataTypes.UNSIGNED_INT:
        case AEDataTypes.FLOAT:
            return 4;
        default:
            logger.error("unknown data/image type used");
    }
}
