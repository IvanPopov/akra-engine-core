/// <reference path="../idl/AICodec.ts" />
/// <reference path="../idl/AIMap.ts" />

import logger = require("logger");


class Codec implements AICodec {
    private static _pMapCodecs: AIMap<AICodec> = <AIMap<AICodec>>{};

    static registerCodec(pCodec: AICodec): void {

        if (!isDef(Codec._pMapCodecs[pCodec.getType()])) {
            Codec._pMapCodecs[pCodec.getType()] = pCodec;
        }
        else {
            logger.critical(pCodec.getType() + " already has a registered codec. ");
        }
    }

    static isCodecRegistered(pCodec: AICodec): boolean {
        return isDef(Codec._pMapCodecs[pCodec.getType()]);
    }

    static unRegisterCodec(pCodec: AICodec): void {
        delete Codec._pMapCodecs[pCodec.getType()];
    }

    static getExtension(): string[] {
        var pExt: string[] = <string[]>Array();
        var sExt: string = "";
        for (sExt in Codec._pMapCodecs) {
            pExt.push(sExt)
			}
        return pExt;
    }

    static getCodec(sExt: string): AICodec;
    static getCodec(pMagicNumber: Uint8Array): AICodec;
    static getCodec(pMagicNumber: any): AICodec {
        var sExt: string = "";
        if (isString(pMagicNumber)) {
            if (isDef(Codec._pMapCodecs[pMagicNumber])) {
                return Codec._pMapCodecs[pMagicNumber];
            }
            else {
                logger.critical("Can not find codec for " + pMagicNumber);
                return null;
            }
        }
        else {
            for (sExt in Codec._pMapCodecs) {
                var sExt1: string = Codec._pMapCodecs[sExt].magicNumberToFileExt(pMagicNumber);
                if (sExt1) {
                    if (sExt1 == Codec._pMapCodecs[sExt].getType()) {
                        return Codec._pMapCodecs[sExt];
                    }
                    else {
                        return Codec.getCodec(sExt1);
                    }

                }
            }
        }
        return null;
    }


    magicNumberMatch(pMagicNumber: Uint8Array): boolean {
        return !(this.magicNumberToFileExt(pMagicNumber).length == 0);
    }

    magicNumberToFileExt(pMagicNumber: Uint8Array): string {
        logger.critical("Codec.magicNumberToFileExt is virtual");
        return null;
    }

    getType(): string {
        logger.critical("Codec.getType is virtual");
        return null;
    }

    getDataType(): string {
        logger.critical("Codec.getDataType is virtual");
        return null;
    }

    code(pInput: Uint8Array, pData: AICodecData): Uint8Array {
        logger.critical("Codec.code is virtual");
        return null;
    }
    decode(pData: Uint8Array, pCodecData: AICodecData): Uint8Array {
        logger.critical("Codec.decode is virtual");
        return null;
    }

}



export = Codec;