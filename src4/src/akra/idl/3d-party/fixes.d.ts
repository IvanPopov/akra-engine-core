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
}

interface FileWriter extends FileSaver {
    position: number;
    length: number;

    write (data: Blob): void;
    seek (offset: number): void;
    truncate (size: number): void;
}

interface FileSystem {
    name: string;
    root: DirectoryEntry;
}

interface FileWriterCallback {
    /*handleEvent*/ (fileWriter: FileWriter): void;
}

interface Metadata {
    modificationTime: Date;
    size: number;
}

interface MetadataCallback {
    /*handleEvent*/ (metadata: Metadata): void;
}

interface VoidCallback {
    /*handleEvent*/ (): void;
}

interface ErrorCallback {
    /*handleEvent*/ (err: DOMError): void;
}

interface EntryCallback {
    /*handleEvent*/ (entry: Entry): void;
}

interface FileSystemCallback {
    /*handleEvent*/ (filesystem: FileSystem): void;
}

interface EntriesCallback {
    /*handleEvent*/ (entries: Entry[]): void;
}


interface FileCallback {
    /*handleEvent*/ (file: File): void;
}

interface QuotaCallback {
    /*handleEvent*/ (nGrantedBytes: number): void;
}

interface Flags {
    create?: boolean;
    exclusive?: boolean;
}

interface WebkitStorageInfo {
	requestQuota(type: number, size: number, quotaCallback: QuotaCallback): void;
}

interface Window {
	storageInfo: WebkitStorageInfo;
}

interface Entry {
    isFile: boolean;
    isDirectory: boolean;
    name: string;
    fullPath: string;
    filesystem: FileSystem;
    getMetadata (successCallback: MetadataCallback, errorCallback?: ErrorCallback): void;
    moveTo (parent: DirectoryEntry, newName?: string, successCallback?: EntryCallback, errorCallback?: ErrorCallback): void;
    copyTo (parent: DirectoryEntry, newName?: string, successCallback?: EntryCallback, errorCallback?: ErrorCallback): void;
    toURL (): string;
    remove (successCallback: VoidCallback, errorCallback?: ErrorCallback): void;
    getParent (successCallback: EntryCallback, errorCallback?: ErrorCallback): void;
}

interface DirectoryReader {
    readEntries (successCallback: EntriesCallback, errorCallback?: ErrorCallback): void;
}


interface DirectoryEntry extends Entry {
    createReader (): DirectoryReader;
    getFile (path: string, options?: Flags, successCallback?: EntryCallback, errorCallback?: ErrorCallback): void;
    getDirectory (path: string, options?: Flags, successCallback?: EntryCallback, errorCallback?: ErrorCallback): void;
    removeRecursively (successCallback: VoidCallback, errorCallback?: ErrorCallback): void;
}

interface FileEntry extends Entry {
    createWriter (successCallback: FileWriterCallback, errorCallback?: ErrorCallback): void;
    file (successCallback: FileCallback, errorCallback?: ErrorCallback): void;
    //file (path: string, options: Flags, successCallback: FileCallback, errorCallback?: ErrorCallback): void;
}

interface Window {
    TEMPORARY: number;
    PERSISTENT: number;
    requestFileSystem (type: number, size: number, successCallback: FileSystemCallback, errorCallback: ErrorCallback): void;
    resolveLocalFileSystemURL (url: string, successCallback: EntryCallback, errorCallback: ErrorCallback): void;
}


/***************************************************************
 * Gamepad API
 **************************************************************/

//BlobBuilder
interface BlobBuilder {
    append(data: any, endings?: string): void;
    getBlob(contentType?: string): Blob;
}
declare var BlobBuilder: {
    prototype: BlobBuilder;
    new (): BlobBuilder;
}

//default JS function
declare function unescape(s: string): string;