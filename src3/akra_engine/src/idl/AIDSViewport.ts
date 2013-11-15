// AIDSViewport interface
// [write description here...]

/// <reference path="AIRID.ts" />


/// <reference path="AIColor.ts" />

interface AIDSViewport extends AIViewport {
	/** readonly */ effect: AIEffect;
	/** readonly */ depth: AITexture;
	/** readonly */ view: AIRenderableObject;

	getSkybox(): AITexture;
	setSkybox(pSkyTexture: AITexture): void;

	setFXAA(bValue?: boolean): void;
	isFXAA(): boolean;
	
	highlight(iRid: int): void;
	highlight(pObject: AISceneObject, pRenderable?: AIRenderableObject): void;
	highlight(pPair: AIRIDPair): void;

	_getRenderId(x: uint, y: uint): int;
	_getDeferredTexValue(iTex: int, x: uint, y: uint): AIColor;

	signal addedSkybox(pSkyTexture: AITexture): void;
}