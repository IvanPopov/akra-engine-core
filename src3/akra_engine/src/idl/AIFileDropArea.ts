enum AEFileDataTypes {
    ARRAY_BUFFER,
    DATA_URL,
    TEXT
}

interface AIDropFunc {
    (file: File, content: string, format: AEFileDataTypes, e: DragEvent): void;
    (file: File, content: Blob, format: AEFileDataTypes, e: DragEvent): void;
    (file: File, content: ArrayBuffer, format: AEFileDataTypes, e: DragEvent): void;
}

interface AIFileDropAreaOptions {
    beforedrop?: Function;
    drop?: AIDropFunc;
    dragover?: Function;
    dragleave?: Function;
    dragenter?: Function;
    //cls?: string;
    format?: AEFileDataTypes;
    verify?: (file: File, e: DragEvent) => boolean;
}