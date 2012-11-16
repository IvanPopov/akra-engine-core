#ifndef IHARDWARETEXTURE_TS
#define IHARDWARETEXTURE_TS

module akra {

	export interface IHardwareObject {
		//getGuid(): int;

		isValid(): bool;
		release(): void;
	}

}

#endif

