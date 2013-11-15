// AIAFXPassInputBlend interface
// [write description here...]

/// <reference path="AIAFXSamplerState.ts" />
/// <reference path="AISurfaceMaterial.ts" />
/// <reference path="AIUnique.ts" />
/// <reference path="AERenderStates.ts" />
/// <reference path="AIAFXComponentBlend.ts" />
/// <reference path="AIMap.ts" />
/// <reference path="AIAFXInstruction.ts" />

interface AIAFXPassInputStateInfo {
	uniformKey: uint;
	foreignKey: uint;
	samplerKey: uint;
	renderStatesKey: uint;
};

interface AIAFXPassInputBlend extends AIUnique {
	samplers: AIAFXSamplerStateMap;
	samplerArrays: AIAFXSamplerStateListMap;
	samplerArrayLength: AIIntMap;

	uniforms: any; /* all uniforms without samlers */
	foreigns: any;
	textures: any;

	samplerKeys: uint[];
	samplerArrayKeys: uint[];

	uniformKeys: uint[];
	foreignKeys: uint[];
	textureKeys: uint[];

	renderStates: AIRenderStateMap;

	/** readonly */ statesInfo: AIAFXPassInputStateInfo;

	hasUniform(sName: string): boolean;
	hasTexture(sName: string): boolean;
	hasForeign(sName: string): boolean;
	
	setUniform(sName: string, pValue: any): void;
	setTexture(sName: string, pValue: any): void;
	setForeign(sName: string, pValue: any): void;

	setSampler(sName: string, pState: AIAFXSamplerState): void;
	setSamplerArray(sName: string, pSamplerArray: AIAFXSamplerState[]): void;
	
	setSamplerTexture(sName: string, sTexture: string): void;
	setSamplerTexture(sName: string, pTexture: AITexture): void;

	setStruct(sName: string, pValue: any): void;

	setSurfaceMaterial(pMaterial: AISurfaceMaterial): void;

	setRenderState(eState: AERenderStates, eValue: AERenderStateValues): void;

	_getForeignVarNameIndex(sName: string): uint;
	_getForeignVarNameByIndex(iNameIndex: uint): string;
	
	_getUniformVarNameIndex(sName: string): uint;
	_getUniformVarNameByIndex(iNameIndex: uint): string;
	
	_getUniformVar(iNameIndex: uint): AIAFXVariableDeclInstruction;
	_getUniformLength(iNameIndex: uint): uint;
	_getUniformType(iNameIndex: uint): AEAFXShaderVariableType;

	_getSamplerState(iNameIndex: uint): AIAFXSamplerState;
	_getSamplerTexture(iNameIndex: uint): AITexture;

	_getTextureForSamplerState(pSamplerState: AIAFXSamplerState): AITexture;


	_release(): void;

	_isFromSameBlend(pInput: AIAFXPassInputBlend): boolean;
	_getBlend(): AIAFXComponentPassInputBlend;
	_copyFrom(pInput: AIAFXPassInputBlend): void;

	_copyUniformsFromInput(pInput: AIAFXPassInputBlend): void;
	_copySamplersFromInput(pInput: AIAFXPassInputBlend): void;
	_copyForeignsFromInput(pInput: AIAFXPassInputBlend): void;
	_copyRenderStatesFromInput(pInput: AIAFXPassInputBlend): void;

	_getLastPassBlendId(): uint;
	_getLastShaderId(): uint;
	_setPassBlendId(id: uint): void;
	_setShaderId(id: uint): void;
}
