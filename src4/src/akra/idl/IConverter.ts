module akra {
	interface IConverter<ARRAY_TYPE> {
	    (data: string, output: ARRAY_TYPE, from?: int): uint;
	}
	
	interface IConvertionTableRow<ARRAY_TYPE> {
	    type: any; 
	    converter: IConverter<ARRAY_TYPE>;
	}
	
	interface IConvertionTable {
	    [type: string]: IConvertionTableRow<any[]>;
	}
	
}
