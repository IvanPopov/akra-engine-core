interface AIConverter<ARRAY_TYPE> {
    (data: string, output: ARRAY_TYPE, from?: int): uint;
}

interface AIConvertionTableRow<ARRAY_TYPE> {
    type: any; 
    converter: AIConverter<ARRAY_TYPE>;
}

interface AIConvertionTable {
    [type: string]: AIConvertionTableRow<any[]>;
}
