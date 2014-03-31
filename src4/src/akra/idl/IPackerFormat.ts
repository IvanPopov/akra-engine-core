module akra {
	export interface IPackerBlacklist {
		[type: string]: Function;
	};
	
	export interface IPackerCodec {
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
	
	export interface IPackerFormat {
		//[type: string]: string;
		//[type: string]: IPackerCodec;
		[type: string]: any;
	}
	
	//вспомогательный класс, для разрешения форматов, при упаковке данных
	export interface IPackerTemplate {
		getType(iType: int): any;
		getTypeId(sType: string): int;
	
		set(pFormat: IPackerFormat): void;
	
		detectType(pObject: any): string;
		resolveType(sType: string): string;
		properties(sType): IPackerCodec;
		data(): IPackerFormat;
	}
	
}
