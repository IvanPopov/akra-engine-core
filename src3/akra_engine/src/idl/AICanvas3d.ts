// AICanvas3d interface
// [write description here...]

/// <reference path="AICanvas.ts" />


/// <reference path="AIPoint.ts" />

interface AICanvas3d extends AICanvas, AIRenderTarget {
	left: int;
	top: int;


	create(sName: string, iWidth?: uint, iHeight?: uint, isFullscreen?: boolean): boolean;
	destroy(): void;

	setFullscreen(isFullscreen?: boolean): void;
	setVisible(bVisible?: boolean): void;
	setDeactivateOnFocusChange(bDeactivate?: boolean): void;

	isFullscreen(): boolean;
	isVisible(): boolean;
	isDeactivatedOnFocusChange(): boolean;


	resize(iWidth: uint, iHeight: uint): void;
}