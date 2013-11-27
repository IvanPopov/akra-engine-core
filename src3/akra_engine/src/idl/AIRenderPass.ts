// AIRenderPass interface
// [write description here...]

/// <reference path="AIUnique.ts" />
/// <reference path="AIRenderTarget.ts" />
/// <reference path="AIAFXPassInputBlend.ts" />


interface AIRenderPass extends AIUnique {
	setForeign(sName: string, fValue: float): void;
	setTexture(sName: string, pTexture: AITexture): void;
	setUniform(sName: string, pValue: any): void;
	setStruct(sName: string, pValue: any): void;
	setRenderState(eState: AERenderStates, eValue: AERenderStateValues): void;

	setSamplerTexture(sName: string, sTexture: string): void;
	setSamplerTexture(sName: string, pTexture: AITexture): void;

	getRenderTarget(): AIRenderTarget;
	setRenderTarget(pTarget: AIRenderTarget): void;

	getPassInput(): AIAFXPassInputBlend;
	setPassInput(pInput: AIAFXPassInputBlend, isNeedRelocate: boolean): void;

	blend(sComponentName: string, iPass: uint): boolean;

	activate(): void;
	deactivate(): void;
	isActive(): boolean;
}	

