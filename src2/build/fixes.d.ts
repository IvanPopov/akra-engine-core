//interface float extends Number {
//}

//declare var float: {
//    new (value?: any): Number;
//    (value?: any): Number;
//    prototype: Number;
    
//}

//interface int extends Number {
//}

//declare var int: {
//    new (value?: any): Number;
//    (value?: any): int;
//    prototype: int;
//}

//interface uint extends Number {
//}

////declare var uint: {
////    new (value?: any): Number;
////    (value?: any): uint;
////    prototype: uint;
////}

//interface long extends Number {
//}

//declare var long: {
//    new (value?: any): Number;
//    (value?: any): long;
//    prototype: long;
//}

//interface double extends Number {
//}

//declare var double: {
//    new (value?: any): Number;
//    (value?: any): double;
//    prototype: double;
//}

interface DOMString extends String {

}

/****************************************************************
 * File System API
 ****************************************************************/

interface FileError extends Error {
	code: number;
	NOT_FOUND_ERR: number;
	SECURITY_ERR: number;
	ABORT_ERR: number;
	NOT_READABLE_ERR: number;
	ENCODING_ERR: number;
	NO_MODIFICATION_ALLOWED_ERR: number;
	INVALID_STATE_ERR: number;
	SYNTAX_ERR: number;
	INVALID_MODIFICATION_ERR: number;
	QUOTA_EXCEEDED_ERR: number;
	TYPE_MISMATCH_ERR: number;
	PATH_EXISTS_ERR: number;
}

declare var FileError: {
    prototype: FileError;
    new(): FileError;
    NOT_FOUND_ERR: number;
	SECURITY_ERR: number;
	ABORT_ERR: number;
	NOT_READABLE_ERR: number;
	ENCODING_ERR: number;
	NO_MODIFICATION_ALLOWED_ERR: number;
	INVALID_STATE_ERR: number;
	SYNTAX_ERR: number;
	INVALID_MODIFICATION_ERR: number;
	QUOTA_EXCEEDED_ERR: number;
	TYPE_MISMATCH_ERR: number;
	PATH_EXISTS_ERR: number;
}


interface NavigatorID {
	vendor: string;
}

interface Window {
	opera: string;
}

declare function requestAnimationFrame(callback: FrameRequestCallback, element: HTMLElement): number;

interface FileSaver extends EventTarget {
    abort (): void;

    INIT: number;
    WRITING: number;
    DONE: number;
    
    readyState: number;
    error: DOMError;
    onwritestart: Function;
    onprogress: Function;
    onwrite: Function;
    onabort: Function;
    onerror: Function;
    onwriteend: Function;
};

interface FileWriter extends FileSaver {
    position: number;
    length: number;

    write (data: Blob): void;
    seek (offset: number): void;
    truncate (size: number): void;
};

interface FileSystem {
    name: DOMString;
    root: DirectoryEntry;
};

interface FileWriterCallback {
    /*handleEvent*/ (fileWriter: FileWriter): void;
};

interface Metadata {
    modificationTime: Date;
    size: number;
};

interface MetadataCallback {
    /*handleEvent*/ (metadata: Metadata): void;
};

interface VoidCallback {
    /*handleEvent*/ (): void;
};

interface ErrorCallback {
    /*handleEvent*/ (err: DOMError): void;
};

interface EntryCallback {
    /*handleEvent*/ (entry: Entry): void;
};

interface FileSystemCallback {
    /*handleEvent*/ (filesystem: FileSystem): void;
};

interface EntriesCallback {
    /*handleEvent*/ (entries: Entry[]): void;
};


interface FileCallback {
    /*handleEvent*/ (file: File): void;
};

interface QuotaCallback {
    /*handleEvent*/ (nGrantedBytes: number): void;
};

interface Flags {
    create?: bool;
    exclusive?: bool;
};

interface WebkitStorageInfo {
	requestQuota(type: number, size: number, quotaCallback: QuotaCallback): void;
}

interface Window {
	storageInfo: WebkitStorageInfo;
}

interface Entry {
    isFile: bool;
    isDirectory: bool;
    name: DOMString;
    fullPath: DOMString;
    filesystem: FileSystem;
    getMetadata (successCallback: MetadataCallback, errorCallback?: ErrorCallback): void;
    moveTo (parent: DirectoryEntry, newName?: DOMString, successCallback?: EntryCallback, errorCallback?: ErrorCallback): void;
    copyTo (parent: DirectoryEntry, newName?: DOMString, successCallback?: EntryCallback, errorCallback?: ErrorCallback): void;
    toURL (): DOMString;
    remove (successCallback: VoidCallback, errorCallback?: ErrorCallback): void;
    getParent (successCallback: EntryCallback, errorCallback?: ErrorCallback): void;
};

interface DirectoryReader {
    readEntries (successCallback: EntriesCallback, errorCallback?: ErrorCallback): void;
};


interface DirectoryEntry extends Entry {
    createReader (): DirectoryReader;
    getFile (path: DOMString, options?: Flags, successCallback?: EntryCallback, errorCallback?: ErrorCallback): void;
    getDirectory (path: DOMString, options?: Flags, successCallback?: EntryCallback, errorCallback?: ErrorCallback): void;
    removeRecursively (successCallback: VoidCallback, errorCallback?: ErrorCallback): void;
};

interface FileEntry extends Entry {
    createWriter (successCallback: FileWriterCallback, errorCallback?: ErrorCallback): void;
    file (successCallback: FileCallback, errorCallback?: ErrorCallback): void;
    //file (path: DOMString, options: Flags, successCallback: FileCallback, errorCallback?: ErrorCallback): void;
};

interface Window {
    TEMPORARY: number;
    PERSISTENT: number;
    requestFileSystem (type: number, size: number, successCallback: FileSystemCallback, errorCallback: ErrorCallback): void;
    resolveLocalFileSystemURL (url: DOMString, successCallback: EntryCallback, errorCallback: ErrorCallback): void;
};

