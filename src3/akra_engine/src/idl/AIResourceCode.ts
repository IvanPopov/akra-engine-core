// AIResourceCode interface
// [write description here...]

enum AEResourceCodes {
	INVALID_CODE = 0xFFFFFFFF
}

interface AIResourceCode {
	family: int;
	type: int;
	/** Пеерводит текущее состояние идентифиакора в невалидное */
	setInvalid(): void;
	/** operator "<" */
	less(pSrc: AIResourceCode): boolean;
	/** operator = */
	eq(pSrc: AIResourceCode): AIResourceCode;

	valueOf(): int;
	toNumber(): int;
}

