#ifndef CODEC_TS
#define CODEC_TS

#include "ICodec.ts"

module akra 
{
	export interface ICodecMap {
        	[index: string]: ICodec;
    	};


	export class Codec implements ICodec
	{
		

		private static _pMapCodecs: ICodecMap =<ICodecMap>{};

		static registerCodec(pCodec: ICodec):void
		{

			if(!isDef(Codec._pMapCodecs[pCodec.getType()]))
			{
				Codec._pMapCodecs[pCodec.getType()]=pCodec;
			}
			else
			{
				CRITICAL_ERROR(pCodec.getType() + " already has a registered codec. ");
			}
		}

		static isCodecRegistered(pCodec: ICodec):bool
		{
			return isDef(Codec._pMapCodecs[pCodec.getType()]);
		}

		static unRegisterCodec(pCodec: ICodec):void
		{
			delete Codec._pMapCodecs[pCodec.getType()];
		}

		static getExtension():string[]
		{
			var pExt:string[];
			var sExt:string;
			for(sExt in Codec._pMapCodecs)
			{
				pExt.push(sExt)
			}
			return pExt;
		}

		static getCodec(sExt: string):ICodec;
		static getCodec(pMagicNumber: Uint8Array):ICodec;
		static getCodec(pMagicNumber: any):ICodec
		{
			var sExt: string;
			if(isString(pMagicNumber))
			{
				if(isDef(Codec._pMapCodecs[pMagicNumber]))
				{
					return Codec._pMapCodecs[pMagicNumber];
				}
				else
				{
					CRITICAL_ERROR("Can not find codec for "+pMagicNumber);
					return null;
				}
			}
			else
			{
				for(sExt in Codec._pMapCodecs)
				{
					var sExt1:string=Codec._pMapCodecs[sExt].magicNumberToFileExt(pMagicNumber);
					if(sExt1)
					{
						if(sExt1==Codec._pMapCodecs[sExt].getType())
						{
							return Codec._pMapCodecs[sExt];
						}
						else
						{
							return Codec.getCodec(sExt1);
						}

					}
				}
			}
			return null;
		}
		

		magicNumberMatch(pMagicNumber: Uint8Array):bool
		{
			return !(this.magicNumberToFileExt(pMagicNumber).length==0); 
		}

		magicNumberToFileExt(pMagicNumber: Uint8Array):string
		{
			CRITICAL_ERROR("Codec.magicNumberToFileExt is virtual");
			return null;
		}

		getType():string
		{
			CRITICAL_ERROR("Codec.getType is virtual");
			return null;
		}

		getDataType():string
		{
			CRITICAL_ERROR("Codec.getDataType is virtual");
			return null;
		}

		code(pInput:Uint8Array,pData:ICodecData):Uint8Array
		{
			CRITICAL_ERROR("Codec.code is virtual");
			return null;
		}
		decode(pData:Uint8Array,pCodecData:ICodecData):Uint8Array
		{
			CRITICAL_ERROR("Codec.decode is virtual");
			return null;
		}



	}

	export class CodecData implements ICodecData
	{

		inline get dataType(): string{
			CRITICAL_ERROR("CodecData.dataType is virtual");
			return "CodecData";
		}
	}

}



	#endif