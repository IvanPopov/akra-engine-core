/// <reference path="../idl/AICodec.ts" />

import logger = require("logger");

class CodecData implements AICodecData {

    /** inline */ get dataType(): string {
        logger.critical("CodecData.dataType is virtual");
        return "CodecData";
    }
}

export = CodecData;