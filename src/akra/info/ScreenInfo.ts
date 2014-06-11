/// <reference path="../idl/IScreenInfo.ts" />


module akra.info {
	
	export class ScreenInfo implements IScreenInfo {
		private _pScreen: Screen = window["screen"];

		getWidth(): int {
			return this._pScreen.width;
		}

		getHeight(): int {
			return this._pScreen.height;
		}

		getAspect(): float {
			return this._pScreen.width / this._pScreen.height;
		}

		getPixelDepth(): int {
			return this._pScreen.pixelDepth;
		}

		getColorDepth(): int {
			return this._pScreen.colorDepth;
		}

		getAvailHeight(): int {
			return this._pScreen.availHeight;
		}

		getAvailWidth(): int {
			return this._pScreen.availWidth;
		}
	}

}