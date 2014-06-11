module akra {
	export interface IConverter<ARRAY_TYPE> {
	    (data: string, output: ARRAY_TYPE, from?: int): uint;
	}
	
	export interface IConvertionTableRow<ARRAY_TYPE> {
	    type: any; 
	    converter: IConverter<ARRAY_TYPE>;
	}
	
	export interface IConvertionTable {
	    [type: string]: IConvertionTableRow<any[]>;
	}
	
}
