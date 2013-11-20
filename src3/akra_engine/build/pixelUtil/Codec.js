/// <reference path="../idl/AICodec.ts" />
/// <reference path="../idl/AIMap.ts" />
define(["require", "exports", "logger"], function(require, exports, __logger__) {
    var logger = __logger__;

    var Codec = (function () {
        function Codec() {
        }
        Codec.registerCodec = function (pCodec) {
            if (!isDef(Codec._pMapCodecs[pCodec.getType()])) {
                Codec._pMapCodecs[pCodec.getType()] = pCodec;
            } else {
                logger.critical(pCodec.getType() + " already has a registered codec. ");
            }
        };

        Codec.isCodecRegistered = function (pCodec) {
            return isDef(Codec._pMapCodecs[pCodec.getType()]);
        };

        Codec.unRegisterCodec = function (pCodec) {
            delete Codec._pMapCodecs[pCodec.getType()];
        };

        Codec.getExtension = function () {
            var pExt = Array();
            var sExt = "";
            for (sExt in Codec._pMapCodecs) {
                pExt.push(sExt);
            }
            return pExt;
        };

        Codec.getCodec = function (pMagicNumber) {
            var sExt = "";
            if (isString(pMagicNumber)) {
                if (isDef(Codec._pMapCodecs[pMagicNumber])) {
                    return Codec._pMapCodecs[pMagicNumber];
                } else {
                    logger.critical("Can not find codec for " + pMagicNumber);
                    return null;
                }
            } else {
                for (sExt in Codec._pMapCodecs) {
                    var sExt1 = Codec._pMapCodecs[sExt].magicNumberToFileExt(pMagicNumber);
                    if (sExt1) {
                        if (sExt1 == Codec._pMapCodecs[sExt].getType()) {
                            return Codec._pMapCodecs[sExt];
                        } else {
                            return Codec.getCodec(sExt1);
                        }
                    }
                }
            }
            return null;
        };

        Codec.prototype.magicNumberMatch = function (pMagicNumber) {
            return !(this.magicNumberToFileExt(pMagicNumber).length == 0);
        };

        Codec.prototype.magicNumberToFileExt = function (pMagicNumber) {
            logger.critical("Codec.magicNumberToFileExt is virtual");
            return null;
        };

        Codec.prototype.getType = function () {
            logger.critical("Codec.getType is virtual");
            return null;
        };

        Codec.prototype.getDataType = function () {
            logger.critical("Codec.getDataType is virtual");
            return null;
        };

        Codec.prototype.code = function (pInput, pData) {
            logger.critical("Codec.code is virtual");
            return null;
        };
        Codec.prototype.decode = function (pData, pCodecData) {
            logger.critical("Codec.decode is virtual");
            return null;
        };
        Codec._pMapCodecs = {};
        return Codec;
    })();

    
    return Codec;
});
//# sourceMappingURL=Codec.js.map
