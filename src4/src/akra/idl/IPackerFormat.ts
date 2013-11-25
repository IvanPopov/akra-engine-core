module akra {
	interface IPackerBlacklist {
		[type: string]: Function;
	};
	
	interface IPackerCodec {
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
	
	interface IPackerFormat {
		[type: string]: string;
		[type: string]: IPackerCodec;
	}
	
	//вспомогательный класс, для разрешения форматов, при упаковке данных
	interface IPackerTemplate {
		getType(iType: int): any;
		getTypeId(sType: string): int;
	
		set(pFormat: IPackerFormat): void;
	
		detectType(pObject: any): string;
		resolveType(sType: string): string;
		properties(sType): IPackerCodec;
		data(): IPackerFormat;
	}
	
}
