interface AIPackerBlacklist {
	[type: string]: Function;
};

interface AIPackerCodec {
	/**
	 * Как читать данные кодека
	 * @type {String | () => any}
	 */
	read?: any;
	/**
	 * Как писать данные
	 * @type{String | (pData: any) => void}
	 */
	write?: any;
}

interface AIPackerFormat {
	[type: string]: string;
	[type: string]: AIPackerCodec;
}

//вспомогательный класс, для разрешения форматов, при упаковке данных
interface AIPackerTemplate {
	getType(iType: int): any;
	getTypeId(sType: string): int;

	set(pFormat: AIPackerFormat): void;

	detectType(pObject: any): string;
	resolveType(sType: string): string;
	properties(sType): AIPackerCodec;
	data(): AIPackerFormat;
}
