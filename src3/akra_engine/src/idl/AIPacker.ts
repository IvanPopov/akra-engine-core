/// <reference path="AIBinWriter.ts" />
/// <reference path="AIPackerFormat.ts" />


interface AIPackerOptions {
	header?: boolean;
}

interface AIPacker extends AIBinWriter {
	getTemplate(): AIPackerTemplate;
	write(pData: any, sType?: string, bHeader?: boolean): boolean;
}
