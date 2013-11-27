
/// <reference path="ICanvas.ts" />


/// <reference path="IPoint.ts" />

module akra {
	export interface ICanvas3d extends ICanvas, IRenderTarget {
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
}
