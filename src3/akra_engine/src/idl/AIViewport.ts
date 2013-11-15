// AIViewport interface
// [write description here...]

/// <reference path="AIViewportState.ts" />
/// <reference path="AIRect2d.ts" />
/// <reference path="AIColor.ts" />
/// <reference path="AIRenderTarget.ts" />
/// <reference path="AICamera.ts" />
/// <reference path="AIRenderableObject.ts" />
/// <reference path="AIClickable.ts" />
/// <reference path="AIColor.ts" />
/// <reference path="AIRID.ts" />
/// <reference path="AIRect2d.ts" />
/// <reference path="AIViewportState.ts" />

interface AIDepthRange {
	min: float;
	max: float;
};

enum AEViewportTypes {
	DEFAULT = -1,
	DSVIEWPORT = 1,
	SHADOWVIEWPORT = 2,
	COLORVIEWPORT,
	TEXTUREVIEWPORT
}

interface AIViewport extends AIEventProvider, AIClickable {
	left: float;
	top: float;
	width: float;
	height: float;

	//in pixels
	actualLeft: uint;
	actualTop: uint;
	actualWidth: uint;
	actualHeight: uint;

	zIndex: int;

	backgroundColor: AIColor;
	depthClear: float;

	/** readonly */ type: AEViewportTypes;

	update(): void;
	destroy(): void;

	hide(bValue?: boolean): void;

	startFrame(): void;
	renderObject(pRenderable: AIRenderableObject): void;
	endFrame(): void;

	clear(iBuffers?: uint, cColor?: AIColor, fDepth?: float, iStencil?: uint): void;

	enableSupportFor3DEvent(iType: int): int;
	is3DEventSupported(eType: AE3DEventTypes): boolean;
	touch(): void;

	pick(x: uint, y: uint): AIRIDPair;

	getObject(x: uint, y: uint): AISceneObject;
	getRenderable(x: uint, y: uint): AIRenderableObject;

	getTarget(): AIRenderTarget;
	getCamera(): AICamera;
	setCamera(pCamera: AICamera): boolean;
	getDepth(x: uint, y: uint): float;
	getDepthRange(): AIDepthRange;

	setDimensions(fLeft: float, fTop: float, fWidth: float, fHeight: float): boolean;
	setDimensions(pRect: AIRect2d): boolean;

	getActualDimensions(): AIRect2d;

	projectPoint(v3fPoint: AIVec3, v3fDestination?: AIVec3): AIVec3;
	unprojectPoint(x: uint, y: uint, v3fDestination?: AIVec3): AIVec3;
	unprojectPoint(pPos: AIPoint, v3fDestination?: AIVec3): AIVec3;

	//iBuffers=FBT_COLOUR|FBT_DEPTH
	setClearEveryFrame(isClear: boolean, iBuffers?: uint): void;
	getClearEveryFrame(): boolean;
	getClearBuffers(): uint;

	setDepthParams(bDepthTest: boolean, bDepthWrite: boolean, eDepthFunction: AECompareFunction): void;
	setCullingMode(eCullingMode: AECullingMode): void;

	setAutoUpdated(bValue?: boolean): void;
	isAutoUpdated(): boolean;

	isUpdated(): boolean;
	/**
	 * Is mouse under the viewport?
	 */
	isMouseCaptured(): boolean;

	_clearUpdatedFlag(): void;
	_updateImpl(): void;

	_getNumRenderedPolygons(): uint;
	_updateDimensions(pDimensions: AIRect2d): void;

	_getViewportState(): AIViewportState;
	_setTarget(pTarget: AIRenderTarget): void;


	signal viewportDimensionsChanged(): void;
	signal viewportCameraChanged(): void;
	signal render(pTechnique: AIRenderTechnique, iPass: int, pRenderable: AIRenderableObject, pSceneObject: AISceneObject);
}
