#ifndef IRESOURCECODE_TS
#define IRESOURCECODE_TS

module akra {
	export enum EResourceCodes {
		INVALID_CODE = 0xFFFFFFFF
	};

	export interface IResourceCode {
		family: int;
		type: int;
		/** Пеерводит текущее состояние идентифиакора в невалидное */
		setInvalid(): void;
		/** operator "<" */
		less(pSrc: IResourceCode): bool;
		/** operator = */
		eq(pSrc: IResourceCode): IResourceCode;

		valueOf(): int;
		toNumber(): int;
	}
}

#endif
