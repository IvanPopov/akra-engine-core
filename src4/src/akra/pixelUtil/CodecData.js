var akra;
(function (akra) {
    /// <reference path="../logger.ts" />
    /// <reference path="../idl/ICodec.ts" />
    (function (pixelUtil) {
        var CodecData = (function () {
            function CodecData() {
            }
            Object.defineProperty(CodecData.prototype, "dataType", {
                get: function () {
                    akra.logger.critical("CodecData.dataType is virtual");
                    return "CodecData";
                },
                enumerable: true,
                configurable: true
            });
            return CodecData;
        })();
        pixelUtil.CodecData = CodecData;
    })(akra.pixelUtil || (akra.pixelUtil = {}));
    var pixelUtil = akra.pixelUtil;
})(akra || (akra = {}));
