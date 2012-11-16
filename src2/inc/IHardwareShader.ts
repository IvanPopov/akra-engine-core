#ifndef IHARDWARESHADER_TS
#define IHARDWARESHADER_TS

#include "IHardwareObject.ts"

module akra {

	export interface IHardwareShader extends IHardwareObject {
		type: int;

		getParameter(eParam: int): any;
		getInfoLog(): string;
		getSource(): string;
		setSource(sSource: string): void;
	}

}

#endif

