#ifndef IRENDERTARGET_TS
#define IRENDERTARGET_TS

#include "IDepthBuffer.ts"
#include "IFrameStats.ts"

module akra {
	export enum EFramebuffer {
		FRONT, 	
		BACK, 	
		AUTO 	
	};

	export interface IRenderTarget {
		name: string;
		width: uint;
		height: uint;
		colorDepth: uint;

		totalViewports: uint;

		priority: int;

		getDepthBuffer(): IDepthBuffer;
		signal attachDepthBuffer(pBuffer: IDepthBuffer): bool;
		signal detachDepthBuffer();

		signal update(): void;
		signal updateStats(): void;
		signal preUpdate(): void;
		signal postUpdate(): void;

		signal viewportPreUpdate(pViewport: IViewport): void;
		signal viewportPostUpdate(pViewport: IViewport): void;
		signal viewportAdded(pViewport: IViewport): void;
		signal viewportRemoved(pViewport: IViewport): void;

		addViewport(pCamera: ICamera, iZIndex?: uint, fLeft?: float, fTop?: float, fWidth?: float, fHeight?: float): IViewport;
		getViewport(iIndex: int): IViewport;
		getViewportByZIndex(iZIndex: int): IViewport;
		hasViewportByZIndex(iZIndex: int): bool;
		removeViewport(iZIndex: int): bool;
		removeAllViewports(): uint;

		getPolygonCount(): uint;

		getStatistics(): IFrameStats;
		getLastFPS(): float;
		getAverageFPS(): float;
		getBestFPS(): float;
		getWorstFPS(): float;

		getBestFrameTime(): float;
		getWorstFrameTime(): float;
		resetStatistics(): float;

		isActive(): bool;
		setActive(isActive?: bool): void;
		setAutoUpdated(isAutoUpdate?: bool): void;
		isAutoUpdated(): bool;

		readPixels(ppDest?: IPixelBox, eFramebuffer?: EFramebuffer): IPixelBox;
	}
}

#endif
