#ifndef CODEC_TS
#define CODEC_TS

#include "PixelFormat.ts"
#include "bf/bitflags.ts"
#include "math/math.ts"
#include "IColor.ts"
#include "PixelBox.ts"

module akra 
{
	export class Codec implements ICodec
	{
		protected static _pMapCodecs: Array=new Array()

		static registerCodec(pCodec: Codec):void
		{
			if(!isDef(self._pMapCodecs[pCodec.getType()]))
			{
				self._pMapCodecs[pCodec.getType()]=getCodec(sExtension):Array;
			}
			else
			{
				CRITICAL_ERROR(,pCodec->getType() + " already has a registered codec. ");
			}
		}

		static isCodecRegistered(pCodec: Codec):boolean
		{
			return isDef(self._pMapCodecs[pCodec.getType()]);
		}

		static unRegisterCodec(pCodec: Codec):void
		{
			delete self._pMapCodecs[pCodec.getType()];
		}

		static getExtension():Array
		{
			return self._pMapCodecs.slice(0,self._pMapCodecs.length)
		}


		static getCodec(pMagicNumber: Uint8Array):Codec
		{
			var sExt: String;
			if(isString(pMagicNumber))
			{
				if(isDef(self._pMapCodecs[pMagicNumber])
				{
					return self._pMapCodecs[pMagicNumber];
				}
				else
				{
					CRITICAL_ERROR(,"Can not find codec for "+pMagicNumber);
					return null;
				}
			}
			else
			{
				for(sExt in self._pMapCodecs)
				{
					var sExt1:string=self._pMapCodecs[sExt].magicNumberToFileExt(pMagicNumber);
					if(sExt1)
					{
						if(sExt1==self._pMapCodecs[sExt].getType())
						{
							return self._pMapCodecs[sExt];
						}
						else
						{
							return this.getCodec(sExt1);
						}

					}
				}
			}

		}
		return null;

		magicNumberMatch(pMagicNumber: Uint8Array):bool
		{
			return !(this.magicNumberToFileExt(pMagicNumber).length==0); 
		}

	}

	export class CodecData implements ICodecData
	{

		getDataType(): String{
			return "CodecData";
		}
	}

	
}



	#endif