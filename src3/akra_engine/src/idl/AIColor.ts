// AIColor interface
// [write description here...]

/// <reference path="AIColorValue.ts" />

interface AIColor extends AIColorValue {
	rgba: uint;
	argb: uint;
	bgra: uint;
	abgr: uint;

	/** readonly */ html: string;
	/** readonly */ htmlRgba: string;

	set(cColor: AIColorValue): AIColor;
	set(cColor: AIColor): AIColor;
	set(r?: float, g?: float, b?: float, a?: float): AIColor;
	set(fGray: float, fAlpha: float): AIColor;

	/** Clamps colour value to the range [0, 1].
	 */
	saturate(): void;

	/** As saturate, except that this colour value is unaffected and
		the saturated colour value is returned as a copy. */
	saturateCopy(): AIColor;

	add(cColor: AIColor, ppDest?: AIColor): AIColor;
	subtract(cColor: AIColor, ppDest?: AIColor): AIColor;
	multiply(cColor: AIColor, ppDest?: AIColor): AIColor;
	multiply(fScalar: float, ppDest?: AIColor): AIColor;
	divide(cColor: AIColor, ppDest?: AIColor): AIColor;
	divide(fScalar: float, ppDest?: AIColor): AIColor;

	/** Set a colour value from Hue, Saturation and Brightness.
		@param hue Hue value, scaled to the [0,1] range as opposed to the 0-360
		@param saturation Saturation level, [0,1]
		@param brightness Brightness level, [0,1]
	*/
	setHSB(fHue: float, fSaturation: float, fBrightness: float): AIColor;

	/** Convert the current colour to Hue, Saturation and Brightness values. 
		@param hue Output hue value, scaled to the [0,1] range as opposed to the 0-360
		@param saturation Output saturation level, [0,1]
		@param brightness Output brightness level, [0,1]
	*/

	getHSB(pHsb?: float[]): float[];

	toString(): string;
}

