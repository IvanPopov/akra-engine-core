
module akra {
	export enum EResourceCodes {
		INVALID_CODE = 0xFFFFFFFF
	}
	
	export interface IResourceCode {
		getFamily(): int;
		setFamily(iFamily: int): void;

		getType(): int;
		setType(iType: int): void;

		/** Пеерводит текущее состояние идентифиакора в невалидное */
		setInvalid(): void;
		/** operator "<" */
		less(pSrc: IResourceCode): boolean;
		/** operator = */
		eq(pSrc: IResourceCode): IResourceCode;
	
		valueOf(): int;
		toNumber(): int;
	}
	
	
}
