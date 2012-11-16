#ifndef IHARDWARERENDERBUFFER_TS
#define IHARDWARERENDERBUFFER_TS

#include "IHardwareObject.ts"

module akra {

	export interface IHardwareRenderBuffer extends IHardwareObject {
		activate(): void;
		deactivate(): void;

		getParameter(eParam: int): any;
		setParameter(eParam: int, eValue: int): void;
		
		setStorage(internalformat: int, width: uint, height: uint): void;
	}

}

#endif

