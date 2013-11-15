// AIRenderTarget interface
// [write description here...]

/// <reference path="AIDepthBuffer.ts" />
/// <reference path="AIFrameStats.ts" />
/// <reference path="AICamera.ts" />
/// <reference path="AIPixelBuffer.ts" />
/// <reference path="AITexture.ts" />
/// <reference path="AIPixelBox.ts" />

enum AEFramebuffer {
	FRONT, 	
	BACK, 	
	AUTO 	
};

enum AEStatFlags {
	NONE		   = 0,
	FPS			= 1,
	AVG_FPS		= 2,
	BEST_FPS	   = 4,
	WORST_FPS	  = 8,
	TRIANGLE_COUNT = 16,
	ALL			= 0xFFFF
};

enum AE3DEventTypes {
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

interface AIRenderTarget extends AIEventProvider {
	name: string;
	width: uint;
	height: uint;
	

	colorDepth: uint;

	totalViewports: uint;

	priority: int;

	getRenderer(): AIRenderer;

	getDepthBuffer(): AIDepthBuffer;

	attachDepthBuffer(pBuffer: AIDepthBuffer): boolean;
	attachDepthPixelBuffer(pBuffer: AIPixelBuffer): boolean;
	attachDepthTexture(pTexture: AITexture): boolean;

	detachDepthBuffer(): void;
	detachDepthTexture(): void;
	detachDepthPixelBuffer(): void; 

	enableSupportFor3DEvent(iType: int): int;
	is3DEventSupported(eType: AE3DEventTypes): boolean;	

	destroy(): void;

	update(): void;
	updateStats(): void;

	getCustomAttribute(sName: string): any;

	addViewport(pViewport: AIViewport): AIViewport;

	getViewport(iIndex: int): AIViewport;
	getViewportByZIndex(iZIndex: int): AIViewport;
	hasViewportByZIndex(iZIndex: int): boolean;
	removeViewport(iZIndex: int): boolean;
	removeAllViewports(): uint;

	getPolygonCount(): uint;

	getStatistics(): AIFrameStats;
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

	readPixels(ppDest?: AIPixelBox, eFramebuffer?: AEFramebuffer): AIPixelBox;

	_beginUpdate(): void;
	_updateViewport(iZIndex: int, bUpdateStatistics?: boolean): void;
	_updateViewport(pViewport: AIViewport, bUpdateStatistics?: boolean): void;
	_updateAutoUpdatedViewports(bUpdateStatistics?: boolean): void;
	_endUpdate(): void;

	signal preUpdate(): void;
	signal postUpdate(): void;

	signal viewportPreUpdate(pViewport: AIViewport): void;
	signal viewportPostUpdate(pViewport: AIViewport): void;
	signal viewportAdded(pViewport: AIViewport): void;
	signal viewportRemoved(pViewport: AIViewport): void;

	signal resized(width: uint, height: uint): void;

	signal cameraRemoved(pCamera: AICamera): void;
}
