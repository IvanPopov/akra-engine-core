
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
		TEXTUREVIEWPORT,
		LPPVIEWPORT,
		FORWARDVIEWPORT,
		MIRRORVIEWPORT
	}
	
	export interface IViewport extends IEventProvider, IClickable, IControllable {
		getLeft(): float;
		getTop(): float;
		getWidth(): float;
		getHeight(): float;

		//in pixels
		getActualLeft(): uint;
		getActualTop(): uint;
		getActualWidth(): uint;
		getActualHeight(): uint;

		getZIndex(): int;

		getType(): EViewportTypes;

		getBackgroundColor(): IColor;
		setBackgroundColor(cColor: IColor): void;

		getDepthClear(): float;
		setDepthClear(fDepth: float): void;

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

		getTarget(): IRenderTarget;
		getCamera(): ICamera;
		setCamera(pCamera: ICamera): boolean;

		setDimensions(fLeft: float, fTop: float, fWidth: float, fHeight: float): boolean;
		setDimensions(pRect: IRect2d): boolean;

		getActualDimensions(): IRect2d;

		//iBuffers=FBT_COLOUR|FBT_DEPTH
		setClearEveryFrame(isClear: boolean, iBuffers?: uint): void;
		getClearEveryFrame(): boolean;
		getClearBuffers(): uint;

		setDepthParams(bDepthTest: boolean, bDepthWrite: boolean, eDepthFunction: ECompareFunction): void;
		setCullingMode(eCullingMode: ECullingMode): void;

		setAutoUpdated(bValue?: boolean): void;
		isAutoUpdated(): boolean;

		isUpdated(): boolean;

		_setDefaultRenderMethod(sMethod: string): void;

		_clearUpdatedFlag(): void;
		_updateImpl(): void;

		_getNumRenderedPolygons(): uint;
		_updateDimensions(bEmitEvent?: boolean): void;

		_getViewportState(): IViewportState;
		_setTarget(pTarget: IRenderTarget): void;

		_onRender(pTechnique: IRenderTechnique, iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;
	}
	
}
