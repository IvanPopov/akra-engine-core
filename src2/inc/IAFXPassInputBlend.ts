#ifndef IAFXPASSINPUTBLEND_TS
#define IAFXPASSINPUTBLEND_TS

#include "IAFXSamplerState.ts"
#include "ISurfaceMaterial.ts"

module akra {
	IFACE(IRenderStateMap)
	
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
        k_SamplerVertexTexture,

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

		renderStates: IRenderStateMap;

		hasTexture(sName: string): bool;
		hasUniform(sName: string): bool;
		
		setUniform(sName: string, pValue: any): void;
		setForeign(sName: string, pValue: any): void;
		setTexture(sName: string, pValue: any): void;

		setSampler(sName: string, pState: IAFXSamplerState): void;
		setSamplerArray(sName: string, pSamplerArray: IAFXSamplerState[]): void;
		
		setSamplerTexture(sName: string, sTexture: string): void;
		setSamplerTexture(sName: string, pTexture: ITexture): void;

		setStruct(sName: string, pValue: any): void;

		setSurfaceMaterial(pMaterial: ISurfaceMaterial): void;

		setRenderState(eState: ERenderStates, eValue: ERenderStateValues): void;

		_getSamplerState(sName: string): IAFXSamplerState;
		_getSamplerTexture(sName: string): ITexture;
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

		_getAFXUniformVar(sName: string): IAFXVariableDeclInstruction;
	}
}

#endif