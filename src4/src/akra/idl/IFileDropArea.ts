module akra {
	﻿enum EFileDataTypes {
	    ARRAY_BUFFER,
	    DATA_URL,
	    TEXT
	}
	
	interface IDropFunc {
	    (file: File, content: string, format: EFileDataTypes, e: DragEvent): void;
	    (file: File, content: Blob, format: EFileDataTypes, e: DragEvent): void;
	    (file: File, content: ArrayBuffer, format: EFileDataTypes, e: DragEvent): void;
	}
	
	interface IFileDropAreaOptions {
	    beforedrop?: Function;
	    drop?: IDropFunc;
	    dragover?: Function;
	    dragleave?: Function;
	    dragenter?: Function;
	    //cls?: string;
	    format?: EFileDataTypes;
	    verify?: (file: File, e: DragEvent) => boolean;
	}
}
