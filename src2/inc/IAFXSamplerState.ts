#ifndef IAFXSAMPLERSTATE_TS
#define IAFXSAMPLERSTATE_TS

#include "ITexture.ts"

module akra {
	textureName: string;
	texture: ITexture;

	wrap_s: uint;
	wrap_t: uint;

	mag_filter: uint;
	min_filter: uint;
}

#endif