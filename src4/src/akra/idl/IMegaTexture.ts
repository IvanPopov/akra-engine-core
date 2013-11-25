
/// <reference path="IViewport.ts" />
/// <reference path="IRenderPass.ts" />
/// <reference path="ISceneObject.ts" />
/// <reference path="IEventProvider.ts" />
/// <reference path="IImg.ts" />

module akra {
	interface IMegaTexture extends IEventProvider {
		manualMinLevelLoad: boolean;
	
		init(pObject: ISceneObject, sSurfaceTextures: string): void;
		prepareForRender(pViewport: IViewport): void;
		applyForRender(pRenderPass: IRenderPass): void;
		
		getWidthOrig(iLevel: uint): uint;
		getHeightOrig(iLevel: uint): uint;
	
		setMinLevelTexture(pImg: IImg);
	}
	
}
