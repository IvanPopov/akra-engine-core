// AIRenderMethod interface
// [write description here...]

/// <reference path="AIResourcePoolItem.ts" />
/// <reference path="AIRenderer.ts" />
/// <reference path="AIEffect.ts" />
/// <reference path="AISurfaceMaterial.ts" />
/// <reference path="AIAFXPassInputBlend.ts" />
/// <reference path="AERenderStates.ts" />

interface AIRenderMethod extends AIResourcePoolItem {
	effect: AIEffect;
	surfaceMaterial: AISurfaceMaterial;
	material: AIMaterial;

	setForeign(sName: string, pValue: any, iPass?: uint): void;
	setUniform(sName: string, pValue: any, iPass?: uint): void;
	setTexture(sName: string, pValue: AITexture, iPass?: uint): void;		
	setRenderState(eState: AERenderStates, eValue: AERenderStateValues, iPass?: uint): void;

	setSamplerTexture(sName: string, pTexture: AITexture, iPass?: uint): void;
	setSamplerTexture(sName: string, sTexture: string, iPass?: uint): void;
	
	isEqual(pRenderMethod: AIRenderMethod): boolean;

	_getPassInput(iPass: uint): AIAFXPassInputBlend;
}
