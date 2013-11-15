/// <reference path="../idl/AEDataTypes.ts">

export function size(eType: AEDataTypes): number {
    switch (eType) {
        case AEDataTypes.BYTE:
        case AEDataTypes.UNSIGNED_BYTE:
            return 1;
        case AEDataTypes.SHORT:
        case AEDataTypes.UNSIGNED_SHORT:
            //case EImageTypes.UNSIGNED_SHORT_4_4_4_4:
            //case EImageTypes.UNSIGNED_SHORT_5_5_5_1:
            //case EImageTypes.UNSIGNED_SHORT_5_6_5:
            return 2;
        case AEDataTypes.INT:
        case AEDataTypes.UNSIGNED_INT:
        case AEDataTypes.FLOAT:
            return 4;
        default:
            throw new Error("unknown data/image type used");
    }
}
