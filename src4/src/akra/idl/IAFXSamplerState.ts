
/// <reference path="ITexture.ts" />

module akra {
	interface IAFXSamplerStateMap {
		[index: string]: IAFXSamplerState;
		[index: uint]: IAFXSamplerState;
	}
	
	interface IAFXSamplerStateListMap {
		[index: string]: IAFXSamplerState[];
		[index: uint]: IAFXSamplerState[];
	}
	
	interface IAFXSamplerState {
		textureName: string;
		texture: ITexture;
	
		wrap_s: ETextureWrapModes;
		wrap_t: ETextureWrapModes;
	
		mag_filter: ETextureFilters;
		min_filter: ETextureFilters;
	}
	
}
