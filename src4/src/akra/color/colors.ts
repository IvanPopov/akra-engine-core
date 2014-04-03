/// <reference path="Color.ts" />
/// <reference path="../math/Vec4.ts" />

module akra.color {
	import Vec4 = math.Vec4;

	var iVariousColor: int = 0;
	var pVariousColors: string[] = [
		"BLUE",
		"BLUE_VIOLET",
		"BROWN",
		"CADET_BLUE",
		"CHARTREUSE",
		"CRIMSON",
		"CYAN",
		"DEEP_PINK",
		"DEEP_SKY_BLUE",
		"DODGER_BLUE",
		"FIRE_BRICK",
		"FUCHSIA",
		"GOLD",
		"GREEN",
		"GREEN_YELLOW",
		"HOT_PINK",
		"LAWN_GREEN",
		"LIME",
		"LIME_GREEN",
		"MAGENTA",
		"MEDIUM_BLUE",
		"MEDIUM_ORCHID",
		"MEDIUM_SPRING_GREEN",
		"MEDIUM_VIOLET_RED",
		"ORANGE",
		"ORANGE_RED",
		"PURPLE",
		"RED",
		"SPRING_GREEN",
		"STEEL_BLUE",
		"TOMATO",
		"TURQUOISE",
		"VIOLET",
		"WHEAT",
		"YELLOW",
		"YELLOW_GREEN"
	];



	export function random(bVarious: boolean = false): IColor {
		if (!bVarious) {
			return new Color(Math.random(), Math.random(), Math.random(), 1.);
		}

		if (iVariousColor === pVariousColors.length) {
			iVariousColor = 0;
		}

		return (<any>color)[pVariousColors[iVariousColor++]] || Color.WHITE;
	}

	/**  */ function toVec4(cSrc: IColorValue, vDst: IVec4 = new Vec4): IVec4 {
		return vDst.set(cSrc.r, cSrc.g, cSrc.b, cSrc.a);
	}

	export var ZERO: IColor = new Color(0., 0., 0., 0.);

	export var ALICE_BLUE: IColor = new Color("#f0f8ff");
	export var ANTIQUE_WHITE: IColor = new Color("#faebd7");
	export var AQUA: IColor = new Color("#00ffff");
	export var AQUA_MARINE: IColor = new Color("#7fffd4");
	export var AZURE: IColor = new Color("#f0ffff");
	export var BEIGE: IColor = new Color("#f5f5dc");
	export var BISQUE: IColor = new Color("#ffe4c4");
	export var BLANCHED_ALMOND: IColor = new Color("#ffebcd");
	export var BLACK: IColor = new Color("#000000");
	export var BLUE: IColor = new Color("#0000ff");
	export var BLUE_VIOLET: IColor = new Color("#8a2be2");
	export var BROWN: IColor = new Color("#a52a2a");
	export var BURLY_WOOD: IColor = new Color("#deb887");
	export var CADET_BLUE: IColor = new Color("#5f9ea0");
	export var CHARTREUSE: IColor = new Color("#7fff00");
	export var CHOCOLATE: IColor = new Color("#d2691e");
	export var CORAL: IColor = new Color("#ff7f50");
	export var CORNFLOWER_BLUE: IColor = new Color("#6495ed");
	export var CORNSILK: IColor = new Color("#fff8dc");
	export var CRIMSON: IColor = new Color("#dc143c");
	export var CYAN: IColor = new Color("#00ffff");
	export var DARK_BLUE: IColor = new Color("#00008b");
	export var DARK_CYAN: IColor = new Color("#008b8b");
	export var DARK_GOLDEN_ROD: IColor = new Color("#b8860b");
	export var DARK_GRAY: IColor = new Color("#a9a9a9");
	export var DARK_GREEN: IColor = new Color("#006400");
	export var DARK_KHAKI: IColor = new Color("#bdb76b");
	export var DARK_MAGENTA: IColor = new Color("#8b008b");
	export var DARK_OLIVE_GREEN: IColor = new Color("#556b2f");
	export var DARK_ORANGE: IColor = new Color("#ff8c00");
	export var DARK_ORCHID: IColor = new Color("#9932cc");
	export var DARK_RED: IColor = new Color("#8b0000");
	export var DARK_SALMON: IColor = new Color("#e9967a");
	export var DARK_SEA_GREEN: IColor = new Color("#8fbc8f");
	export var DARK_SLATE_BLUE: IColor = new Color("#483d8b");
	export var DARK_SLATE_GRAY: IColor = new Color("#2f4f4f");
	export var DARK_TURQUOISE: IColor = new Color("#00ced1");
	export var DARK_VIOLET: IColor = new Color("#9400d3");
	export var DEEP_PINK: IColor = new Color("#ff1493");
	export var DEEP_SKY_BLUE: IColor = new Color("#00bfff");
	export var DIM_GRAY: IColor = new Color("#696969");
	export var DIM_GREY: IColor = new Color("#696969");
	export var DODGER_BLUE: IColor = new Color("#1e90ff");
	export var FIRE_BRICK: IColor = new Color("#b22222");
	export var FLORAL_WHITE: IColor = new Color("#fffaf0");
	export var FOREST_GREEN: IColor = new Color("#228b22");
	export var FUCHSIA: IColor = new Color("#ff00ff");
	export var GAINSBORO: IColor = new Color("#dcdcdc");
	export var GHOST_WHITE: IColor = new Color("#f8f8ff");
	export var GOLD: IColor = new Color("#ffd700");
	export var GOLDEN_ROD: IColor = new Color("#daa520");
	export var GRAY: IColor = new Color("#808080");
	export var GREEN: IColor = new Color("#008000");
	export var GREEN_YELLOW: IColor = new Color("#adff2f");
	export var HONEY_DEW: IColor = new Color("#f0fff0");
	export var HOT_PINK: IColor = new Color("#ff69b4");
	export var INDIAN_RED: IColor = new Color("#cd5c5c");
	export var INDIGO: IColor = new Color("#4b0082");
	export var IVORY: IColor = new Color("#fffff0");
	export var KHAKI: IColor = new Color("#f0e68c");
	export var LAVENDER: IColor = new Color("#e6e6fa");
	export var LAVENDER_BLUSH: IColor = new Color("#fff0f5");
	export var LAWN_GREEN: IColor = new Color("#7cfc00");
	export var LEMON_CHIFFON: IColor = new Color("#fffacd");
	export var LIGHT_BLUE: IColor = new Color("#add8e6");
	export var LIGHT_CORAL: IColor = new Color("#f08080");
	export var LIGHT_CYAN: IColor = new Color("#e0ffff");
	export var LIGHT_GOLDEN_ROD_YELLOW: IColor = new Color("#fafad2");
	export var LIGHT_GRAY: IColor = new Color("#d3d3d3");
	export var LIGHT_GREEN: IColor = new Color("#90ee90");
	export var LIGHT_PINK: IColor = new Color("#ffb6c1");
	export var LIGHT_SALMON: IColor = new Color("#ffa07a");
	export var LIGHT_SEA_GREEN: IColor = new Color("#20b2aa");
	export var LIGHT_SKY_BLUE: IColor = new Color("#87cefa");
	export var LIGHT_SLATE_GRAY: IColor = new Color("#778899");
	export var LIGHT_STEEL_BLUE: IColor = new Color("#b0c4de");
	export var LIGHT_YELLOW: IColor = new Color("#ffffe0");
	export var LIME: IColor = new Color("#00ff00");
	export var LIME_GREEN: IColor = new Color("#32cd32");
	export var LINEN: IColor = new Color("#faf0e6");
	export var MAGENTA: IColor = new Color("#ff00ff");
	export var MAROON: IColor = new Color("#800000");
	export var MEDIUM_AQUA_MARINE: IColor = new Color("#66cdaa");
	export var MEDIUM_BLUE: IColor = new Color("#0000cd");
	export var MEDIUM_ORCHID: IColor = new Color("#ba55d3");
	export var MEDIUM_PURPLE: IColor = new Color("#9370db");
	export var MEDIUM_SEA_GREEN: IColor = new Color("#3cb371");
	export var MEDIUM_SLATE_BLUE: IColor = new Color("#7b68ee");
	export var MEDIUM_SPRING_GREEN: IColor = new Color("#00fa9a");
	export var MEDIUM_TURQUOISE: IColor = new Color("#48d1cc");
	export var MEDIUM_VIOLET_RED: IColor = new Color("#c71585");
	export var MIDNIGHT_BLUE: IColor = new Color("#191970");
	export var MINT_CREAM: IColor = new Color("#f5fffa");
	export var MISTY_ROSE: IColor = new Color("#ffe4e1");
	export var MOCCASIN: IColor = new Color("#ffe4b5");
	export var NAVAJO_WHITE: IColor = new Color("#ffdead");
	export var NAVY: IColor = new Color("#000080");
	export var OLD_LACE: IColor = new Color("#fdf5e6");
	export var OLIVE: IColor = new Color("#808000");
	export var OLIVE_DRAB: IColor = new Color("#6b8e23");
	export var ORANGE: IColor = new Color("#ffa500");
	export var ORANGE_RED: IColor = new Color("#ff4500");
	export var ORCHID: IColor = new Color("#da70d6");
	export var PALE_GOLDEN_ROD: IColor = new Color("#eee8aa");
	export var PALE_GREEN: IColor = new Color("#98fb98");
	export var PALE_TURQUOISE: IColor = new Color("#afeeee");
	export var PALE_VIOLET_RED: IColor = new Color("#db7093");
	export var PAPAYA_WHIP: IColor = new Color("#ffefd5");
	export var PEACH_PUFF: IColor = new Color("#ffdab9");
	export var PERU: IColor = new Color("#cd853f");
	export var PINK: IColor = new Color("#ffc0cb");
	export var PLUM: IColor = new Color("#dda0dd");
	export var POWDER_BLUE: IColor = new Color("#b0e0e6");
	export var PURPLE: IColor = new Color("#800080");
	export var RED: IColor = new Color("#ff0000");
	export var ROSY_BROWN: IColor = new Color("#bc8f8f");
	export var ROYAL_BLUE: IColor = new Color("#4169e1");
	export var SADDLE_BROWN: IColor = new Color("#8b4513");
	export var SALMON: IColor = new Color("#fa8072");
	export var SANDY_BROWN: IColor = new Color("#f4a460");
	export var SEA_GREEN: IColor = new Color("#2e8b57");
	export var SEA_SHELL: IColor = new Color("#fff5ee");
	export var SIENNA: IColor = new Color("#a0522d");
	export var SILVER: IColor = new Color("#c0c0c0");
	export var SKY_BLUE: IColor = new Color("#87ceeb");
	export var SLATE_BLUE: IColor = new Color("#6a5acd");
	export var SLATE_GRAY: IColor = new Color("#708090");
	export var SNOW: IColor = new Color("#fffafa");
	export var SPRING_GREEN: IColor = new Color("#00ff7f");
	export var STEEL_BLUE: IColor = new Color("#4682b4");
	export var TAN: IColor = new Color("#d2b48c");
	export var TEAL: IColor = new Color("#008080");
	export var THISTLE: IColor = new Color("#d8bfd8");
	export var TOMATO: IColor = new Color("#ff6347");
	export var TURQUOISE: IColor = new Color("#40e0d0");
	export var VIOLET: IColor = new Color("#ee82ee");
	export var WHEAT: IColor = new Color("#f5deb3");
	export var WHITE: IColor = new Color("#ffffff");
	export var WHITE_SMOKE: IColor = new Color("#f5f5f5");
	export var YELLOW: IColor = new Color("#ffff00");
	export var YELLOW_GREEN: IColor = new Color("#9acd32");
}