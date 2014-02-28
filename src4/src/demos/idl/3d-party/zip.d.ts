interface ZipEntry {
	filename: string;
	directory: boolean;
	compressedSize: number;
	uncompressedSize: number;
	lastModDate: Date;
	lastModDateRaw: number;
	comment: string;
	crc32: number;

	getData(
		writer: ZipWriter, 
		onend: (data: any) => void, 
		onprogress?: (index: number, maxValue: number) => void, 
		checkCrc32?: boolean): void;
}

interface ZipWriter {

}

interface ZipReader {
	getEntries(callback: (entries: ZipEntry[]) => void): void;
	close(callback?: Function): void;
}

interface ZipWriter {

}

interface ZipBlobReaderConstructor {
	new (blob: Blob): ZipReader;
}

interface ZipArrayBufferReaderConstructor {
	new (ab: ArrayBuffer): ZipReader;
}

interface ZipData64URIReaderConstructor {
	new (dataURI: string): ZipReader;
}

interface Zip {

}

interface ZipStatic {
	workerScriptsPath: string;

	BlobReader: ZipBlobReaderConstructor;
	ArrayBufferReader: ZipArrayBufferReaderConstructor;
	Data64URIReader: ZipData64URIReaderConstructor;

	BlobWriter: {new (entry?: ZipEntry): ZipWriter;};
	TextWriter: {new (entry?: ZipEntry): ZipWriter;};
	ArrayBufferWriter: {new (entry?: ZipEntry): ZipWriter;};

	createReader(
		reader: ZipReader, 
		callback: (reader: ZipReader) => void, 
		onerror?: (err: Error) => void): void;
}

declare var zip: ZipStatic;