#ifndef COLOR_TS
#define COLOR_TS

// #define color(...) Color.stackCeil.set(__VA_ARGS__)

#include "IColor.ts"
#include "math/math.ts"


module akra.util {

	export class Color implements IColor {
		r: float;
		g: float;
		b: float;
		a: float;

		constructor ();
		constructor (cColor: IColor);
		constructor (pData: ArrayBufferView);
		constructor (r: float, g: float, b: float, a: float);
		constructor (r: float, g: float, b: float);
		constructor (fGray: float, fAlpha: float);
		constructor (fGray: float);
		constructor (r?: any, g?: any, b?: any, a?: any) {
			this.set.apply(this, arguments);
		}

		get html(): string {
			// LOG(this.r, this.g, this.b);
			var r = math.round(this.r * 255).toString(16);
			var g = math.round(this.g * 255).toString(16);
			var b = math.round(this.b * 255).toString(16);
			r = r.length < 2? "0" + r: r;
			g = g.length < 2? "0" + g: g;
			b = b.length < 2? "0" + b: b;
			// LOG(r, g, b);
			return "#" + r + g + b;
		}

		get htmlRgba(): string {
			return "rgba(" + 
				math.floor(255 * this.r) + ", " + 
				math.floor(255 * this.g) + ", " + 
				math.floor(255 * this.b) + ", "
				+ this.a + ")"
		}

		get rgba(): uint {
			var val32: uint = 0;
	        // Convert to 32bit pattern
	        val32 = <uint>(this.a * 255) << 24;
	        val32 += <uint>(this.b * 255) << 16;
	        val32 += <uint>(this.g * 255) << 8;
	        val32 += <uint>(this.r * 255);
	        val32 = val32 >>> 0;
	        return val32;
		}

		get argb(): uint {
			var val32: uint = 0;
	        // Convert to 32bit pattern
	        val32 = <uint>(this.b * 255) << 24;
	        val32 += <uint>(this.g * 255) << 16;
	        val32 += <uint>(this.r * 255) << 8;
	        val32 += <uint>(this.a * 255);
	        val32 = val32 >>> 0;
	        return val32;
		}
		
		get bgra(): uint {
	        var val32: uint = 0;
	        // Convert to 32bit pattern
	        val32 = <uint>(this.a * 255) << 24;
	        val32 += <uint>(this.r * 255) << 16;
	        val32 += <uint>(this.g * 255) << 8;
	        val32 += <uint>(this.b * 255);
	        val32 = val32 >>> 0;
	        return val32;
		}

		get abgr(): uint {
			var val32: uint = 0;
	        // Convert to 32bit pattern
	        val32 = <uint>(this.r * 255) << 24;
	        val32 += <uint>(this.g * 255) << 16;
	        val32 += <uint>(this.b * 255) << 8;
	        val32 += <uint>(this.a * 255);
	        val32 = val32 >>> 0;
	        return val32;
		}

		set rgba(c: uint) {
			var val32: uint = c;

	        // Convert from 32bit pattern
	        this.a = ((val32 >> 24) & 0xFF) / 255.0;
	        this.b = ((val32 >> 16) & 0xFF) / 255.0;
	        this.g = ((val32 >> 8) & 0xFF) / 255.0;
	        this.r = (val32 & 0xFF) / 255.0;

		}

		set argb(c: uint) {
			var val32: uint = c;

	        // Convert from 32bit pattern
	        this.b = ((val32 >> 24) & 0xFF) / 255.0;
	        this.g = ((val32 >> 16) & 0xFF) / 255.0;
	        this.r = ((val32 >> 8) & 0xFF) / 255.0;
	        this.a = (val32 & 0xFF) / 255.0;

		}

		set bgra(c: uint) {
			var val32: uint = c;

	        // Convert from 32bit pattern
	        this.a = ((val32 >> 24) & 0xFF) / 255.0;
	        this.r = ((val32 >> 16) & 0xFF) / 255.0;
	        this.g = ((val32 >> 8) & 0xFF) / 255.0;
	        this.b = (val32 & 0xFF) / 255.0;

		}

		set abgr(c: uint) {
			var val32: uint = c;

	        // Convert from 32bit pattern
	        this.r = ((val32 >> 24) & 0xFF) / 255.0;
	        this.g = ((val32 >> 16) & 0xFF) / 255.0;
	        this.b = ((val32 >> 8) & 0xFF) / 255.0;
	        this.a = (val32 & 0xFF) / 255.0;

		}

		set(): IColor;
		set(cColor: IColorValue): IColor;
		set(pData: ArrayBufferView): IColor;
		set(cColor: IColor): IColor;
		set(r: float, g: float, b: float, a: float): IColor;
		set(r: float, g: float, b: float): IColor;
		set(fGray: float, fAlpha: float): IColor;
		set(fGray: float): IColor;
		set(r?: any, g?: any, b?: any, a?: any): IColor {
			switch (arguments.length) {
				case 0:
					this.r = this.g = this.b = 0.;
					this.a = 1.;
					break;
				case 1:
					if (isInt(arguments[0])) {
						this.r = this.g = this.b = <uint>r;
						this.a = 1.;
					}
					else if (isDef(arguments[0].buffer)) {
						var c: ArrayBufferView = <ArrayBufferView>arguments[0];
						this.r = c[0];
						this.g = c[1];
						this.b = c[2];
						this.a = c[3];
					}
					else {
						var v: IColorValue = <IColorValue>arguments[0];
						this.r = v.r;
						this.g = v.g;
						this.b = v.b;
						this.a = v.a;
					}
					break;
				case 2:
					this.r = this.g = this.b = <uint>r;
					this.a = <uint>g;
					break;
				case 3:
				case 4:
					this.r = <uint>r;
					this.g = <uint>g;
					this.b = <uint>b;
					this.a = isDef(a)? <uint>a: 1.;
					break;
			}

			return this;
		}

        saturate(): IColor {
        	if (this.r < 0.)
                this.r = 0.;
            else if (this.r > 1.)
                this.r = 1.;

            if (this.g < 0.)
                this.g = 0.;
            else if (this.g > 1.)
                this.g = 1.;

            if (this.b < 0.)
                this.b = 0.;
            else if (this.b > 1.)
                this.b = 1.;

            if (this.a < 0.)
                this.a = 0.;
            else if (this.a > 1.)
                this.a = 1.;

        	return this;
        }

		/** As saturate, except that this colour value is unaffected and
		    the saturated colour value is returned as a copy. */
		saturateCopy(): IColor {
			var ret: IColor = new Color(this);
            ret.saturate();
            return ret;
		}

		add(cColor: IColor, ppDest: IColor = new Color): IColor {

            ppDest.r = this.r + cColor.r;
            ppDest.g = this.g + cColor.g;
            ppDest.b = this.b + cColor.b;
            ppDest.a = this.a + cColor.a;

            return ppDest;
		}

		subtract(cColor: IColor, ppDest: IColor = new Color): IColor {
			ppDest.r = this.r - cColor.r;
            ppDest.g = this.g - cColor.g;
            ppDest.b = this.b - cColor.b;
            ppDest.a = this.a - cColor.a;

            return ppDest;
		}

		multiply(cColor: IColor, ppDest?: IColor): IColor;
		multiply(fScalar: float, ppDest?: IColor): IColor;
		multiply(fScalar: any, ppDest: IColor = new Color): IColor {
			if (isNumber(fScalar)) {
				var f: float = <float>fScalar;
				ppDest.r = this.r * f;
	            ppDest.g = this.g * f;
	            ppDest.b = this.b * f;
	            ppDest.a = this.a * f;
			}
			else {
				var c: IColor = <IColor>arguments[0];
				ppDest.r = this.r * c.r;
	            ppDest.g = this.g * c.g;
	            ppDest.b = this.b * c.b;
	            ppDest.a = this.a * c.a;
			}

            return ppDest;
		}
		

		divide(cColor: IColor, ppDest?: IColor): IColor;
		divide(fScalar: float, ppDest?: IColor): IColor;
		divide(fScalar: any, ppDest: IColor = new Color): IColor {
			if (isNumber(fScalar)) {
				var f: float = <float>fScalar;
				ppDest.r = this.r / f;
	            ppDest.g = this.g / f;
	            ppDest.b = this.b / f;
	            ppDest.a = this.a / f;
			}
			else {
				var c: IColor = <IColor>arguments[0];
				ppDest.r = this.r / c.r;
	            ppDest.g = this.g / c.g;
	            ppDest.b = this.b / c.b;
	            ppDest.a = this.a / c.a;
			}
			
            return ppDest;
		}

		setHSB(fHue: float, fSaturation: float, fBrightness: float): IColor {
			// wrap hue
			if (fHue > 1.0) {
				fHue -= <int>fHue;
			}
			else if (fHue < 0.0) {
				fHue += <int>fHue + 1;
			}

			// clamp saturation / fBrightness
			fSaturation = math.min(fSaturation, 1.0);
			fSaturation = math.max(fSaturation, 0.0);
			fBrightness = math.min(fBrightness, 1.0);
			fBrightness = math.max(fBrightness, 0.0);

			if (fBrightness == 0.0) {   
				// early exit, this has to be black
				this.r = this.g = this.b = 0.0;
				return;
			}

			if (fSaturation == 0.0) {   
				// early exit, this has to be grey

				this.r = this.g = this.b = fBrightness;
				return;
			}


			var fHueDomain: float  = fHue * 6.0;
			if (fHueDomain >= 6.0)
			{
				// wrap around, and allow mathematical errors
				fHueDomain = 0.0;
			}

			var domain: uint = <uint>fHueDomain;
			var f1: float = fBrightness * (1 - fSaturation);
			var f2: float = fBrightness * (1 - fSaturation * (fHueDomain - domain));
			var f3: float = fBrightness * (1 - fSaturation * (1 - (fHueDomain - domain)));

			switch (domain) {
			case 0:
				// red domain; green ascends
				this.r = fBrightness;
				this.g = f3;
				this.b = f1;
				break;
			case 1:
				// yellow domain; red descends
				this.r = f2;
				this.g = fBrightness;
				this.b = f1;
				break;
			case 2:
				// green domain; blue ascends
				this.r = f1;
				this.g = fBrightness;
				this.b = f3;
				break;
			case 3:
				// cyan domain; green descends
				this.r = f1;
				this.g = f2;
				this.b = fBrightness;
				break;
			case 4:
				// blue domain; red ascends
				this.r = f3;
				this.g = f1;
				this.b = fBrightness;
				break;
			case 5:
				// magenta domain; blue descends
				this.r = fBrightness;
				this.g = f1;
				this.b = f2;
				break;
			}

			return this;
		}

		getHSB(pHsb: float[] = [0., 0., 0.]): float[] {
			var vMin: float = math.min(this.r, math.min(this.g, this.b));
			var vMax: float = math.max(this.r, math.max(this.g, this.b));
			var delta: float = vMax - vMin;

			var brightness: float = vMax;
			var hue: float = 0.;
			var saturation: float;

			if (math.isRealEqual(delta, 0.0, 1e-6)) {
				// grey
				hue = 0.;
				saturation = 0.;
			}
			else {
				// a colour
				saturation = delta / vMax;

				var deltaR: float = (((vMax - this.r) / 6.0) + (delta / 2.0)) / delta;
				var deltaG: float = (((vMax - this.g) / 6.0) + (delta / 2.0)) / delta;
				var deltaB: float = (((vMax - this.b) / 6.0) + (delta / 2.0)) / delta;

				if (math.isRealEqual(this.r, vMax))
					hue = deltaB - deltaG;
				else if (math.isRealEqual(this.g, vMax))
					hue = 0.3333333 + deltaR - deltaB;
				else if (math.isRealEqual(this.b, vMax)) 
					hue = 0.6666667 + deltaG - deltaR;

				if (hue < 0.0) 
					hue += 1.0;
				if (hue > 1.0)
					hue -= 1.0;
			}

			pHsb[0] = hue;
			pHsb[1] = saturation;
			pHsb[2] = brightness;

			return pHsb;
		}

		toString(): string {
			return "{R: " + this.r + ", G: " + this.g + ", B: " + this.b + ", A: " + this.a + "} " + 
			"( 0x" + this.rgba.toString(16) + " )";
		}

		static toFloat32Array(pValue: IColorValue): Float32Array {
			var pArr: Float32Array = new Float32Array(4);
			
			pArr[0] = pValue.r;
			pArr[1] = pValue.g;
			pArr[2] = pValue.b;
			pArr[3] = pValue.a;

			return pArr;
		}

		static BLACK: IColor = new Color(0);
		static WHITE: IColor = new Color(0xFF, 0xFF, 0xFF);
		static ZERO: IColor = new Color(0., 0., 0., 0.);

		static isEqual(c1: IColorValue, c2: IColorValue): bool {
			return 	c1.r === c2.r && 
					c1.g === c2.g && 
					c1.b === c2.b && 
					c1.a === c2.a;
		}

		#include "colors.ts"

		ALLOCATE_STORAGE(Color, 20);
	}

	var pVariousColors: string[] = ["BLUE", "BLUE_VIOLET", "BROWN", "CADET_BLUE", "CHARTREUSE", "CRIMSON", "CYAN", 
		"DEEP_PINK", "DEEP_SKY_BLUE", "DODGER_BLUE", "FIRE_BRICK", "FUCHSIA", "GOLD", "GREEN", "GREEN_YELLOW", 
		"HOT_PINK", "LAWN_GREEN", "LIME", "LIME_GREEN", "MAGENTA", "MEDIUM_BLUE", "MEDIUM_ORCHID", "MEDIUM_SPRING_GREEN",
		"MEDIUM_VIOLET_RED", "ORANGE", "ORANGE_RED", "PURPLE", "RED", "SPRING_GREEN", "STEEL_BLUE", "TOMATO", "TURQUOISE", 
		"VIOLET", "WHEAT", "YELLOW", "YELLOW_GREEN"];
	var iVariousColor: int = 0;

	export function randomColor(bVarious: bool = false): IColor {
		if (!bVarious) {
			return new Color(Math.random(), Math.random(), Math.random(), 1.);
		}

		if (iVariousColor === pVariousColors.length) {
			iVariousColor = 0;
		}

		return (<any>Color)[pVariousColors[iVariousColor ++]] || Color.WHITE;
	}

	export inline function colorToVec4(pValue: IColorValue): IVec4 {
		return vec4(pValue.r, pValue.g, pValue.b, pValue.a);
	}

	export function color(...argv: any[]): IColor {
		var pColor: IColor = Color.stackCeil;
		return pColor.set.apply(pColor, arguments);
	}
}

module akra {
	export var Color = util.Color;
	export var color = util.color;
}



#endif
