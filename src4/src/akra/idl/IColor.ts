
/// <reference path="IColorValue.ts" />

module akra {
	export interface IColor extends IColorValue {
		getRgba(): uint;
		setRgba(iValue: uint): void;

		getArgb(): uint;
		setArgb(iValue: uint): void;

		getBgra(): uint;
		setBgra(iValue: uint): void;

		getAbgr(): uint;
		setAbgr(iValue: uint): void;
	
		getHtml(): string;
		getHtmlRgba(): string;
	
		set(cColor: IColorValue): IColor;
		set(cColor: IColor): IColor;
		set(r?: float, g?: float, b?: float, a?: float): IColor;
		set(fGray: float, fAlpha: float): IColor;
	
		/** Clamps colour value to the range [0, 1].
		 */
		saturate(): void;
	
		/** As saturate, except that this colour value is unaffected and
			the saturated colour value is returned as a copy. */
		saturateCopy(): IColor;
	
		add(cColor: IColor, ppDest?: IColor): IColor;
		subtract(cColor: IColor, ppDest?: IColor): IColor;
		multiply(cColor: IColor, ppDest?: IColor): IColor;
		multiply(fScalar: float, ppDest?: IColor): IColor;
		divide(cColor: IColor, ppDest?: IColor): IColor;
		divide(fScalar: float, ppDest?: IColor): IColor;
	
		/** Set a colour value from Hue, Saturation and Brightness.
			@param hue Hue value, scaled to the [0,1] range as opposed to the 0-360
			@param saturation Saturation level, [0,1]
			@param brightness Brightness level, [0,1]
		*/
		setHSB(fHue: float, fSaturation: float, fBrightness: float): IColor;
	
		/** Convert the current colour to Hue, Saturation and Brightness values. 
			@param hue Output hue value, scaled to the [0,1] range as opposed to the 0-360
			@param saturation Output saturation level, [0,1]
			@param brightness Output brightness level, [0,1]
		*/
	
		getHSB(pHsb?: float[]): float[];
	
		toString(): string;
	}
	
	
}
