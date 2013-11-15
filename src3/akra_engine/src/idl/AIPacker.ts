// AIPacker interface
// [write description here...]


module akra {

interface AIPackerOptions {
	header?: boolean;
}

interface AIPacker extends AIBinWriter {
	template: AIPackerTemplate;

	write(pData: any, sType?: string, bHeader?: boolean): boolean;
}
}

#endif
