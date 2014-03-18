/// <reference path="../../Lib/akra.d.ts" />
declare module akra {
    enum EFileDataTypes {
        ARRAY_BUFFER = 0,
        DATA_URL = 1,
        TEXT = 2,
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
        format?: EFileDataTypes;
        verify?: (file: File, e: DragEvent) => boolean;
    }
}
declare module akra.addons.filedrop {
    function addHandler(element: HTMLElement, options: akra.IFileDropAreaOptions): boolean;
    function addHandler(element: HTMLElement, ondrop: akra.IDropFunc): boolean;
    function removeHandler(element: HTMLElement): void;
}
