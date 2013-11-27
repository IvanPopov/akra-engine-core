module akra {
	﻿export enum EFileDataTypes {
	    ARRAY_BUFFER,
	    DATA_URL,
	    TEXT
	}
	
	export interface IDropFunc {
	    (file: File, content: string, format: EFileDataTypes, e: DragEvent): void;
	    (file: File, content: Blob, format: EFileDataTypes, e: DragEvent): void;
	    (file: File, content: ArrayBuffer, format: EFileDataTypes, e: DragEvent): void;
	}
	
	export interface IFileDropAreaOptions {
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
