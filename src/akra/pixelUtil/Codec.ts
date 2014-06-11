/// <reference path="../idl/ICodec.ts" />
/// <reference path="../idl/IMap.ts" />
/// <reference path="../logger.ts" />

module akra.pixelUtil {

	export class Codec implements ICodec {
		private static _pMapCodecs: IMap<ICodec> = <IMap<ICodec>>{};

		static registerCodec(pCodec: ICodec): void {

			if (!isDef(Codec._pMapCodecs[pCodec.getType()])) {
				Codec._pMapCodecs[pCodec.getType()] = pCodec;
			}
			else {
				logger.critical(pCodec.getType() + " already has a registered codec. ");
			}
		}

		static isCodecRegistered(pCodec: ICodec): boolean {
			return isDef(Codec._pMapCodecs[pCodec.getType()]);
		}

		static unRegisterCodec(pCodec: ICodec): void {
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

		static getCodec(sExt: string): ICodec;
		static getCodec(pMagicNumber: Uint8Array): ICodec;
		static getCodec(pMagicNumber: any): ICodec {
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
			debug.critical("Codec.magicNumberToFileExt is virtual");
			return null;
		}

		getType(): string {
			debug.critical("Codec.getType is virtual");
			return null;
		}

		getDataType(): string {
			debug.critical("Codec.getDataType is virtual");
			return null;
		}

		code(pInput: Uint8Array, pData: ICodecData): Uint8Array {
			debug.critical("Codec.code is virtual");
			return null;
		}
		decode(pData: Uint8Array, pCodecData: ICodecData): Uint8Array {
			debug.critical("Codec.decode is virtual");
			return null;
		}

	}

}