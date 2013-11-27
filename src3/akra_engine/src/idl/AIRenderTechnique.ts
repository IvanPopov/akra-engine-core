// AIRenderTechnique interface
// [write description here...]

/// <reference path="AIEventProvider.ts" />
/// <reference path="AIAFXComposer.ts" />
/// <reference path="AISceneObject.ts" />
/// <reference path="AIRenderPass.ts" />


/// <reference path="AIRenderPass.ts" />
/// <reference path="AIRenderMethod.ts" />
/// <reference path="AIAFXComponentBlend.ts" />

interface AIRenderTechnique extends AIEventProvider {
	/** readonly */ totalPasses: uint;
	/** readonly */ modified: uint;
/** readonly */ data: AIAFXComponentBlend;

	destroy(): void;

	getPass(n: uint): AIRenderPass;
	getMethod(): AIRenderMethod;

	setMethod(pMethod: AIRenderMethod);
	isReady(): boolean;

	setState(sName: string, pValue: any): void;
	setForeign(sName: string, pValue: any): void;
	setStruct(sName: string, pValue: any): void;

	setTextureBySemantics(sName: string, pValue: any): void;
	setShadowSamplerArray(sName: string, pValue: any): void;
	setVec2BySemantic(sName: string, pValue: any): void;

	addComponent(iComponentHandle: int, iShift?: int, iPass?: uint): boolean;
	addComponent(pComponent: AIAFXComponent, iShift?: int, iPass?: uint): boolean;
	addComponent(sComponent: string, iShift?: int, iPass?: uint): boolean;

	delComponent(iComponentHandle: int, iShift?: int, iPass?: uint): boolean;
	delComponent(sComponent: string, iShift?: int, iPass?: uint): boolean;
	delComponent(pComponent: AIAFXComponent, iShift?: int, iPass?: uint): boolean;

	hasComponent(sComponent: string, iShift?: int, iPass?: uint): boolean;
	hasOwnComponent(sComponent: string, iShift?: int, iPass?: uint): boolean;
	
	hasPostEffect(): boolean;
	
	isPostEffectPass(iPass: uint): boolean;
	isLastPass(iPass: uint): boolean;
	isFirstPass(iPass: uint): boolean;

	isFreeze(): boolean;

	updatePasses(bSaveOldUniformValue: boolean): void;

	_blockPass(iPass: uint): void;

	_setPostEffectsFrom(iPass: uint): void;
	
	_setComposer(pComposer: AIAFXComposer): void;
	_getComposer(): AIAFXComposer;
	_renderTechnique(pViewport: AIViewport, pRenderable: AIRenderableObject, pSceneObject: AISceneObject): void;

	signal render(iPass: uint, pRenderable: AIRenderableObject, pSceneObject: AISceneObject, pViewport: AIViewport): void;
}