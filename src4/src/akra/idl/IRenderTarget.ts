
/// <reference path="IDepthBuffer.ts" />
/// <reference path="IFrameStats.ts" />
/// <reference path="ICamera.ts" />
/// <reference path="IPixelBuffer.ts" />
/// <reference path="ITexture.ts" />
/// <reference path="IPixelBox.ts" />

module akra {
	export enum EFramebuffer {
		FRONT,
		BACK,
		AUTO
	};

	export enum EStatFlags {
		NONE		   = 0,
		FPS			= 1,
		AVG_FPS		= 2,
		BEST_FPS	   = 4,
		WORST_FPS	  = 8,
		TRIANGLE_COUNT = 16,
		ALL			= 0xFFFF
	};

	export enum E3DEventTypes {
		CLICK = 0x01,
		MOUSEMOVE = 0x02,
		MOUSEDOWN = 0x04,
		MOUSEUP = 0x08,
		MOUSEOVER = 0x10,
		MOUSEOUT = 0x20,
		DRAGSTART = 0x40,
		DRAGSTOP = 0x80,
		DRAGGING = 0x100,
		MOUSEWHEEL = 0x200
	}

	export interface IRenderTarget extends IEventProvider {
		name: string;
		width: uint;
		height: uint;


		colorDepth: uint;

		totalViewports: uint;

		priority: int;

		getRenderer(): IRenderer;

		getDepthBuffer(): IDepthBuffer;

		attachDepthBuffer(pBuffer: IDepthBuffer): boolean;
		attachDepthPixelBuffer(pBuffer: IPixelBuffer): boolean;
		attachDepthTexture(pTexture: ITexture): boolean;

		detachDepthBuffer(): void;
		detachDepthTexture(): void;
		detachDepthPixelBuffer(): void;

		enableSupportFor3DEvent(iType: int): int;
		is3DEventSupported(eType: E3DEventTypes): boolean;

		destroy(): void;

		update(): void;
		updateStats(): void;

		getCustomAttribute(sName: string): any;

		addViewport(pViewport: IViewport): IViewport;

		getViewport(iIndex: int): IViewport;
		getViewportByZIndex(iZIndex: int): IViewport;
		hasViewportByZIndex(iZIndex: int): boolean;
		removeViewport(iZIndex: int): boolean;
		removeAllViewports(): uint;

		getPolygonCount(): uint;

		getStatistics(): IFrameStats;
		getLastFPS(): float;
		getAverageFPS(): float;
		getBestFPS(): float;
		getWorstFPS(): float;

		getBestFrameTime(): float;
		getWorstFrameTime(): float;
		resetStatistics(): void;

		isActive(): boolean;
		setActive(isActive?: boolean): void;
		setAutoUpdated(isAutoUpdate?: boolean): void;
		isAutoUpdated(): boolean;
		isPrimary(): boolean;

		readPixels(ppDest?: IPixelBox, eFramebuffer?: EFramebuffer): IPixelBox;

		_beginUpdate(): void;
		_updateViewport(iZIndex: int, bUpdateStatistics?: boolean): void;
		_updateViewport(pViewport: IViewport, bUpdateStatistics?: boolean): void;
		_updateAutoUpdatedViewports(bUpdateStatistics?: boolean): void;
		_endUpdate(): void;


		preUpdate: ISignal<{ (pTarget: IRenderTarget): void; }>;
		postUpdate: ISignal<{ (pTarget: IRenderTarget): void; }>;

		viewportPreUpdate: ISignal<{ (pTarget: IRenderTarget, pViewport: IViewport): void; }>;
		viewportPostUpdate: ISignal<{ (pTarget: IRenderTarget, pViewport: IViewport): void; }>;
		viewportAdded: ISignal<{ (pTarget: IRenderTarget, pViewport: IViewport): void; }>;
		viewportRemoved: ISignal<{ (pTarget: IRenderTarget, pViewport: IViewport): void; }>;

		resized: ISignal<{ (pTarget: IRenderTarget, iWidth: uint, iHeight: uint): void; }>;

		cameraRemoved: ISignal<{ (pTarget: IRenderTarget, pCamera: ICamera): void; }>;
	}

}
