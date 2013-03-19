#ifndef CANVAS3D_TS
#define CANVAS3D_TS

#include "ICanvas3d.ts"
#include "IRenderer.ts"
#include "IUtilTimer.ts"
#include "ICanvasInfo.ts"
#include "util/UtilTimer.ts"
#include "render/RenderTarget.ts"


module akra.render {
	export class Canvas3d extends RenderTarget implements ICanvas3d {
		// private _useHarwareAntialiasing: bool = false;

		protected _isFullscreen: bool = false;
		protected _isPrimary: bool = false;
		protected _bAutoDeactivatedOnFocusChange: bool = false;

		left: int = 0;
		top: int = 0;

		get type(): ECanvasTypes {
			return ECanvasTypes.TYPE_3D;
		}


		constructor (pRenderer: IRenderer) {
			super(pRenderer);
			this._pRenderer = pRenderer;
		}


		create(sName: string, iWidth: uint, iHeight: uint, isFullscreen: bool = false): bool {
			return false;
		}

		destroy(): void {}

		setFullscreen(isFullscreen?: bool): void {}

		setVisible(bVisible?: bool): void {}
		setDeactivateOnFocusChange(bDeactivate?: bool): void {
			this._bAutoDeactivatedOnFocusChange = bDeactivate;
		}

		inline isFullscreen(): bool {
			return this._isFullscreen;
		}

		isVisible(): bool {
			return true;
		}

		isClosed(): bool {
			return false;
		}

		isPrimary(): bool {
			return this._isPrimary;
		}

		isDeactivatedOnFocusChange(): bool {
			return this._bAutoDeactivatedOnFocusChange;
		}


		resize(iWidth: uint, iHeight: uint): void {

		}

		BROADCAST(resized, VOID);
	}
}

#endif