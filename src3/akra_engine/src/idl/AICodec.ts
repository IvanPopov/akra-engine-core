// AICodec interface
// [write description here...]


interface AICodec {

	getType():string;
	getDataType():string;
	magicNumberMatch(pMagicNumber: Uint8Array):boolean;
	magicNumberToFileExt(pMagicNumber: Uint8Array):string;

	code(pInput:Uint8Array,pData:AICodecData):Uint8Array;
	decode(pData:Uint8Array,pCodecData:AICodecData):Uint8Array;


}


interface AICodecData {
	dataType: string;
}

