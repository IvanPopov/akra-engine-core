#ifndef IAFXPASSINPUTBLEND_TS
#define IAFXPASSINPUTBLEND_TS

#include "IAFXSamplerState.ts"
#include "ISurfaceMaterial.ts"

module akra {
	export interface IAFXPassInputBlend {
		samplers: IAFXSamplerStateMap;
		samplerArrays: IAFXSamplerStateListMap;
		samplerArrayLength: IntMap;
		uniforms: any; /* all uniforms without samlers */
		foreigns: any;
		textures: any;

		samplerKeys: string[];
		samplerArrayKeys: string[];
		uniformKeys: string[];
		foreignKeys: string[];
		textureKeys: string[];

		hasTexture(sName: string): bool;
		hasUniform(sName: string): bool;
		
		setUniform(sName: string, pValue: any): void;
		setForeign(sName: string, pValue: any): void;
		setTexture(sName: string, pValue: any): void;

		setSamplerTexture(sName: string, pTexture: any): void;

		setSurfaceMaterial(pMaterial: ISurfaceMaterial): void;

		_getTextureForSamplerState(pSamplerState: IAFXSamplerState): ITexture;

		_release(): void;

		_isNeedToCalcBlend(): bool;
		_isNeedToCalcShader(): bool;

		_getLastPassBlendId(): uint;
		_getLastShaderId(): uint;
		_setPassBlendId(id: uint): void;
		_setShaderId(id: uint): void;
	}
}

#endif