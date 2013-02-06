#ifndef ICODEC_TS
#define ICODEC_TS

module akra {

	export interface ICodec{

		static registerCodec(pCodec: Codec):void;
		static isCodecRegistered(pCodec: Codec):boolean;
		static unRegisterCodec(pCodec: Codec):void;
		static getExtension():Array;

		static getCodec(pMagicNumber: Uint8Array):ICodec;
		static getCodec(sExt: String):ICodec;

		getType():String;
		getDataType():String;
		magicNumberMatch(pMagicNumber: Uint8Array):bool;
		magicNumberToFileExt(pMagicNumber: Uint8Array):String;

		code(pInput:Uint8Array,pData:ICodecData):Uint8Array;
		decode(pData:Uint8Array,pCodecData:ICodecData):Uint8Array;


	}
	

	export interface ICodecData{
		dataType(): String;
	}

}

#endif 