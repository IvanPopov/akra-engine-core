// AIUnPacker interface

/// <reference path="AIBinReader.ts" />
/// <reference path="AIPackerFormat.ts" />

interface AIUnPacker extends AIBinReader {
	getTemplate(): AIPackerTemplate;

	read(): any;
}
