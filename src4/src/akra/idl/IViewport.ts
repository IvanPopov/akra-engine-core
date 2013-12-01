
/// <reference path="IViewportState.ts" />
/// <reference path="IRect2d.ts" />
/// <reference path="IColor.ts" />
/// <reference path="IRenderTarget.ts" />
/// <reference path="ICamera.ts" />
/// <reference path="IRenderableObject.ts" />
/// <reference path="IClickable.ts" />
/// <reference path="IColor.ts" />
/// <reference path="IRID.ts" />
/// <reference path="IRect2d.ts" />
/// <reference path="IViewportState.ts" />

module akra {
	export interface IDepthRange {
		min: float;
		max: float;
	};
	
	export enum EViewportTypes {
		DEFAULT = -1,
		DSVIEWPORT = 1,
		SHADOWVIEWPORT = 2,
		COLORVIEWPORT,
		TEXTUREVIEWPORT
	}
	
	export interface IViewport extends IEventProvider, IClickable {
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

		backgroundColor: IColor;
		depthClear: float;

		type: EViewportTypes;

		viewportDimensionsChanged: ISignal<{ (pViewport: IViewport): void; }>;
		viewportCameraChanged: ISignal<{ (pViewport: IViewport): void; }>;
		render: ISignal<{ (pViewport: IViewport, pTechnique: IRenderTechnique, iPass: int, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void; }>;

		update(): void;
		destroy(): void;

		hide(bValue?: boolean): void;

		startFrame(): void;
		renderObject(pRenderable: IRenderableObject): void;
		endFrame(): void;

		clear(iBuffers?: uint, cColor?: IColor, fDepth?: float, iStencil?: uint): void;

		enableSupportFor3DEvent(iType: int): int;
		is3DEventSupported(eType: E3DEventTypes): boolean;
		touch(): void;

		pick(x: uint, y: uint): IRIDPair;

		getObject(x: uint, y: uint): ISceneObject;
		getRenderable(x: uint, y: uint): IRenderableObject;

		getTarget(): IRenderTarget;
		getCamera(): ICamera;
		setCamera(pCamera: ICamera): boolean;
		getDepth(x: uint, y: uint): float;
		getDepthRange(): IDepthRange;

		setDimensions(fLeft: float, fTop: float, fWidth: float, fHeight: float): boolean;
		setDimensions(pRect: IRect2d): boolean;

		getActualDimensions(): IRect2d;

		projectPoint(v3fPoint: IVec3, v3fDestination?: IVec3): IVec3;
		unprojectPoint(x: uint, y: uint, v3fDestination?: IVec3): IVec3;
		unprojectPoint(pPos: IPoint, v3fDestination?: IVec3): IVec3;

		//iBuffers=FBT_COLOUR|FBT_DEPTH
		setClearEveryFrame(isClear: boolean, iBuffers?: uint): void;
		getClearEveryFrame(): boolean;
		getClearBuffers(): uint;

		setDepthParams(bDepthTest: boolean, bDepthWrite: boolean, eDepthFunction: ECompareFunction): void;
		setCullingMode(eCullingMode: ECullingMode): void;

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
		_updateDimensions(pDimensions: IRect2d): void;

		_getViewportState(): IViewportState;
		_setTarget(pTarget: IRenderTarget): void;
	}
	
}
