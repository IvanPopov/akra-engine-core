
/// <reference path="IEventProvider.ts" />
/// <reference path="IAFXComposer.ts" />
/// <reference path="ISceneObject.ts" />
/// <reference path="IRenderPass.ts" />


/// <reference path="IRenderPass.ts" />
/// <reference path="IRenderMethod.ts" />
/// <reference path="IAFXComponentBlend.ts" />

module akra {
	export interface IRenderTechnique extends IEventProvider {
		getTotalPasses(): uint;
		getModified(): uint;

		destroy(): void;

		getPass(n: uint): IRenderPass;
		getMethod(): IRenderMethod;

		setMethod(pMethod: IRenderMethod);
		isReady(): boolean;

		setState(sName: string, pValue: any): void;
		setForeign(sName: string, pValue: any): void;
		setStruct(sName: string, pValue: any): void;

		setTextureBySemantics(sName: string, pValue: any): void;
		setShadowSamplerArray(sName: string, pValue: any): void;
		setVec2BySemantic(sName: string, pValue: any): void;

		addComponent(iComponentHandle: int, iShift?: int, iPass?: uint): boolean;
		addComponent(pComponent: IAFXComponent, iShift?: int, iPass?: uint): boolean;
		addComponent(sComponent: string, iShift?: int, iPass?: uint): boolean;

		delComponent(iComponentHandle: int, iShift?: int, iPass?: uint): boolean;
		delComponent(sComponent: string, iShift?: int, iPass?: uint): boolean;
		delComponent(pComponent: IAFXComponent, iShift?: int, iPass?: uint): boolean;

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

		_setComposer(pComposer: IAFXComposer): void;
		_getComposer(): IAFXComposer;
		_renderTechnique(pViewport: IViewport, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;

		render: ISignal<{ (pTech: IRenderTechnique, iPass: int, pRenderable: IRenderableObject, pSceneObject: ISceneObject, pViewport: IViewport): void; }>;
	}
}
