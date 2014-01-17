/// <reference path="../idl/ICanvas3d.ts" />
/// <reference path="../idl/IRenderer.ts" />
/// <reference path="../idl/IUtilTimer.ts" />
/// <reference path="../idl/ICanvasInfo.ts" />
/// <reference path="../util/UtilTimer.ts" />

/// <reference path="RenderTarget.ts" />


module akra.render {
	export class Canvas3d extends RenderTarget implements ICanvas3d {
		// private _useHarwareAntialiasing: boolean = false;

		protected _isFullscreen: boolean = false;
		protected _isPrimary: boolean = false;
		protected _bAutoDeactivatedOnFocusChange: boolean = false;

		left: int = 0;
		top: int = 0;

		get type(): ECanvasTypes {
			return ECanvasTypes.TYPE_3D;
		}


		constructor (pRenderer: IRenderer) {
			super(pRenderer);
			this._pRenderer = pRenderer;
		}


		create(sName: string, iWidth?: uint, iHeight?: uint, isFullscreen: boolean = false): boolean {
			return false;
		}

		destroy(): void {}

		setFullscreen(isFullscreen?: boolean): void {}

		setVisible(bVisible?: boolean): void {}
		setDeactivateOnFocusChange(bDeactivate?: boolean): void {
			this._bAutoDeactivatedOnFocusChange = bDeactivate;
		}

		 isFullscreen(): boolean {
			return this._isFullscreen;
		}

		isVisible(): boolean {
			return true;
		}

		isClosed(): boolean {
			return false;
		}

		isPrimary(): boolean {
			return this._isPrimary;
		}

		isDeactivatedOnFocusChange(): boolean {
			return this._bAutoDeactivatedOnFocusChange;
		}


		resize(iWidth: uint, iHeight: uint): void {

		}
	}
}
