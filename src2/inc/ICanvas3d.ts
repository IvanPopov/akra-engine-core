#ifndef ICANVAS3D_TS
#define ICANVAS3D_TS

#include "ICanvas.ts"

module akra {
	export interface ICanvas3d extends ICanvas, IRenderTarget {
		left: int;
		top: int;


		create(sName: string, iWidth: uint, iHeight: uint, isFullscreen?: bool): bool;
		destroy(): void;

		setFullscreen(isFullscreen?: bool): void;
		setVisible(bVisible?: bool): void;
		setDeactivateOnFocusChange(bDeactivate?: bool): void;

		isFullscreen(): bool;
		isVisible(): bool;
		isDeactivatedOnFocusChange(): bool;


		resize(iWidth: uint, iHeight: uint): void;

		signal resized(iWidth: uint, iHeight: uint): void;
	}
}

#endif
