
/// <reference path="IAFXSamplerState.ts" />
/// <reference path="ISurfaceMaterial.ts" />
/// <reference path="IUnique.ts" />
/// <reference path="ERenderStates.ts" />
/// <reference path="IAFXComponentBlend.ts" />
/// <reference path="IMap.ts" />
/// <reference path="IAFXInstruction.ts" />

module akra {
	export interface IAFXPassInputStateInfo {
		uniformKey: uint;
		foreignKey: uint;
		samplerKey: uint;
		renderStatesKey: uint;
	};
	
	export interface IAFXPassInputBlend extends IUnique {
		samplers: IAFXSamplerStateMap;
		samplerArrays: IAFXSamplerStateListMap;
		samplerArrayLength: IIntMap;
	
		uniforms: any; /* all uniforms without samlers */
		foreigns: any;
		textures: any;
	
		samplerKeys: uint[];
		samplerArrayKeys: uint[];
	
		uniformKeys: uint[];
		foreignKeys: uint[];
		textureKeys: uint[];
	
		renderStates: IMap<ERenderStateValues>;
	
		/** readonly */ statesInfo: IAFXPassInputStateInfo;
	
		hasUniform(sName: string): boolean;
		hasTexture(sName: string): boolean;
		hasForeign(sName: string): boolean;
		
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
	
		_isFromSameBlend(pInput: IAFXPassInputBlend): boolean;
		_getBlend(): IAFXComponentPassInputBlend;
		_copyFrom(pInput: IAFXPassInputBlend): void;
	
		_copyUniformsFromInput(pInput: IAFXPassInputBlend): void;
		_copySamplersFromInput(pInput: IAFXPassInputBlend): void;
		_copyForeignsFromInput(pInput: IAFXPassInputBlend): void;
		_copyRenderStatesFromInput(pInput: IAFXPassInputBlend): void;
	
		_getLastPassBlendId(): uint;
		_getLastShaderId(): uint;
		_setPassBlendId(id: uint): void;
		_setShaderId(id: uint): void;
	}
	
}
