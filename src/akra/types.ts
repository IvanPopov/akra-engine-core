/// <reference path="idl/EDataTypes.ts" />
/// <reference path="logger.ts" />

module akra {
    export function sizeof(eType: EDataTypes): uint {
        switch (eType) {
            case EDataTypes.BYTE:
            case EDataTypes.UNSIGNED_BYTE:
                return 1;
            case EDataTypes.SHORT:
            case EDataTypes.UNSIGNED_SHORT:
                return 2;
            case EDataTypes.INT:
            case EDataTypes.UNSIGNED_INT:
            case EDataTypes.FLOAT:
                return 4;
            default:
                logger.error("unknown data/image type used");
        }
    }
}
