/// <reference path="../idl/AICodec.ts" />
define(["require", "exports", "logger"], function(require, exports, __logger__) {
    var logger = __logger__;

    var CodecData = (function () {
        function CodecData() {
        }
        Object.defineProperty(CodecData.prototype, "dataType", {
            get: /** inline */ function () {
                logger.critical("CodecData.dataType is virtual");
                return "CodecData";
            },
            enumerable: true,
            configurable: true
        });
        return CodecData;
    })();

    
    return CodecData;
});
//# sourceMappingURL=CodecData.js.map
