/// <reference path="../logger.ts" />
/// <reference path="../idl/ICodec.ts" />
module akra.pixelUtil {
    export class CodecData implements ICodecData {

        getDataType(): string {
            logger.critical("CodecData.dataType is virtual");
            return "CodecData";
        }
    }
}

