var akra;
(function (akra) {
    /// <reference path="../logger.ts" />
    /// <reference path="../idl/ICodec.ts" />
    (function (pixelUtil) {
        var CodecData = (function () {
            function CodecData() {
            }
            CodecData.prototype.getDataType = function () {
                akra.logger.critical("CodecData.dataType is virtual");
                return "CodecData";
            };
            return CodecData;
        })();
        pixelUtil.CodecData = CodecData;
    })(akra.pixelUtil || (akra.pixelUtil = {}));
    var pixelUtil = akra.pixelUtil;
})(akra || (akra = {}));
//# sourceMappingURL=CodecData.js.map
