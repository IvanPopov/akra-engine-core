#ifndef IAFXSAMPLERSTATE_TS
#define IAFXSAMPLERSTATE_TS

#include "ITexture.ts"

module akra {
	export interface IAFXSamplerStateMap {
		[index: string]: IAFXSamplerState;
		[index: uint]: IAFXSamplerState;
	}

	export interface IAFXSamplerStateListMap {
		[index: string]: IAFXSamplerState[];
		[index: uint]: IAFXSamplerState[];
	}

	export interface IAFXSamplerState {
		textureName: string;
		texture: ITexture;

		wrap_s: uint;
		wrap_t: uint;

		mag_filter: uint;
		min_filter: uint;
	}
}

#endif