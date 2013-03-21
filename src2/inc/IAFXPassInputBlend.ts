#ifndef IAFXPASSINPUTBLEND_TS
#define IAFXPASSINPUTBLEND_TS

#include "IAFXSamplerState.ts"
#include "ISurfaceMaterial.ts"

module akra {
	export enum EAFXShaderVariableType {
        k_NotVar = 0,
        
        k_Texture = 2,
        
        k_Float,
        k_Int,
        k_Bool,

        k_Float2,
        k_Int2,
        k_Bool2,

        k_Float3,
        k_Int3,
        k_Bool3,

        k_Float4,
        k_Int4,
        k_Bool4,

        k_Float2x2,
        k_Float3x3,
        k_Float4x4,

        k_Sampler2D,
        k_SamplerCUBE,

        k_CustomSystem,
        k_Complex
    }

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

		_getUnifromLength(sName: string): uint;
		_getUniformType(sName: string): EAFXShaderVariableType;

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