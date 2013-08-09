#ifndef IAFXPASSINPUTBLEND_TS
#define IAFXPASSINPUTBLEND_TS

#include "IAFXSamplerState.ts"
#include "ISurfaceMaterial.ts"

module akra {
	IFACE(IRenderStateMap)

	export interface IAFXPassInputBlend {
		samplers: IAFXSamplerStateMap;
		samplerArrays: IAFXSamplerStateListMap;
		samplerArrayLength: IntMap;

		uniforms: any; /* all uniforms without samlers */
		foreigns: any;
		textures: any;

		samplerKeys: uint[];
		samplerArrayKeys: uint[];

		uniformKeys: uint[];
		foreignKeys: uint[];
		textureKeys: uint[];

		renderStates: IRenderStateMap;

		samplerHash: string;
		isNeedUpdateSamplerHash(): bool;

		hasUniform(sName: string): bool;
		hasTexture(sName: string): bool;
		hasForeign(sName: string): bool;
		
		setUniform(sName: string, pValue: any): void;
		setTexture(sName: string, pValue: any): void;
		setForeign(sName: string, pValue: any): void;

		setSampler(sName: string, pState: IAFXSamplerState): void;
		setSamplerArray(sName: string, pSamplerArray: IAFXSamplerState[]): void;
		
		setSamplerTexture(sName: string, sTexture: string): void;
		setSamplerTexture(sName: string, pTexture: ITexture): void;

		setStruct(sName: string, pValue: any): void;

		setSurfaceMaterial(pMaterial: ISurfaceMaterial): void;

		setRenderState(eState: ERenderStates, eValue: ERenderStateValues): void;

		_getForeignVarNameIndex(sName: string): uint;
		_getForeignVarNameByIndex(iNameIndex: uint): string;
		
		_getUniformVarNameIndex(sName: string): uint;
		_getUniformVarNameByIndex(iNameIndex: uint): string;
		
		_getUniformVar(iNameIndex: uint): IAFXVariableDeclInstruction;
		_getUniformLength(iNameIndex: uint): uint;
		_getUniformType(iNameIndex: uint): EAFXShaderVariableType;

		_getSamplerState(iNameIndex: uint): IAFXSamplerState;
		_getSamplerTexture(iNameIndex: uint): ITexture;

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