// AIAFXSamplerState interface
// [write description here...]

/// <reference path="AITexture.ts" />

interface AIAFXSamplerStateMap {
	[index: string]: AIAFXSamplerState;
	[index: uint]: AIAFXSamplerState;
}

interface AIAFXSamplerStateListMap {
	[index: string]: AIAFXSamplerState[];
	[index: uint]: AIAFXSamplerState[];
}

interface AIAFXSamplerState {
	textureName: string;
	texture: AITexture;

	wrap_s: AETextureWrapModes;
	wrap_t: AETextureWrapModes;

	mag_filter: AETextureFilters;
	min_filter: AETextureFilters;
}
