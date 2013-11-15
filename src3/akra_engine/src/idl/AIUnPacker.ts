// AIUnPacker interface
// [write description here...]

/// <reference path="AIBinReader.ts" />


/// <reference path="AIPackerTemplate.ts" />

interface AIUnPacker extends AIBinReader {
	template: AIPackerTemplate;

	read(): any;
}