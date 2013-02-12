#ifndef IPACKERFORMAT_TS
#define IPACKERFORMAT_TS

module akra {
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

		/**
		 * Какие поля надо сохранять
		 */
		members?: { 
			[field: string]: string;
			[field: string]: IPackerCodec;
		};

		/**
		 * Какой конструктор использовать, при воссоздании объекта
		 */
		ctor?: string;

		/**
		 * Есть ли базовые классы.
		 */
		base?: string[];

		/**
		 * Какие типы данных, вложенные в этои, сохранять не надо
		 */
		blacklist?: {
			[type: string]: bool;
		};
	}

	export interface IPackerFormat {
		[type: string]: string;
		[type: string]: IPackerCodec;
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

#endif
