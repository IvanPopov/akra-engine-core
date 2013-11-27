// AIMegaTexture interface
// [write description here...]

/// <reference path="AIViewport.ts" />
/// <reference path="AIRenderPass.ts" />
/// <reference path="AISceneObject.ts" />
/// <reference path="AIEventProvider.ts" />
/// <reference path="AIImg.ts" />

interface AIMegaTexture extends AIEventProvider {
	manualMinLevelLoad: boolean;

	init(pObject: AISceneObject, sSurfaceTextures: string): void;
	prepareForRender(pViewport: AIViewport): void;
	applyForRender(pRenderPass: AIRenderPass): void;
	
	getWidthOrig(iLevel: uint): uint;
	getHeightOrig(iLevel: uint): uint;

	setMinLevelTexture(pImg: AIImg);
}
