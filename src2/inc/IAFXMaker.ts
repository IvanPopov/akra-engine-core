#ifndef IAFXMAKER_TS
#define IAFXMAKER_TS

#include "IShaderProgram.ts"
#include "IUnique.ts"

module akra {
	export interface IAFXMakerMap {
		[index: string]: IAFXMaker;
		[index: uint]: IAFXMaker;
	}

	export interface IAFXMaker extends IUnique {
		_create(sVertex: string, sPixel: string): bool;
		//_initInput(): bool;
	}
}

#endif