export import Color = require("color/Color");
export import Vec4 = require("math/Vec4");


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



export function random(bVarious: boolean = false): AIColor {
    if (!bVarious) {
        return new Color(Math.random(), Math.random(), Math.random(), 1.);
    }

    if (iVariousColor === pVariousColors.length) {
        iVariousColor = 0;
    }

    return (<any>Color)[pVariousColors[iVariousColor++]] || Color.WHITE;
}

/** inline */ function toVec4(cSrc: AIColorValue, vDst: AIVec4 = new Vec4): AIVec4 {
    return vDst.set(cSrc.r, cSrc.g, cSrc.b, cSrc.a);
}



export var ALICE_BLUE: AIColor = new Color("#f0f8ff");
export var ANTIQUE_WHITE: AIColor = new Color("#faebd7");
export var AQUA: AIColor = new Color("#00ffff");
export var AQUA_MARINE: AIColor = new Color("#7fffd4");
export var AZURE: AIColor = new Color("#f0ffff");
export var BEIGE: AIColor = new Color("#f5f5dc");
export var BISQUE: AIColor = new Color("#ffe4c4");
export var BLANCHED_ALMOND: AIColor = new Color("#ffebcd");
export var BLUE: AIColor = new Color("#0000ff");
export var BLUE_VIOLET: AIColor = new Color("#8a2be2");
export var BROWN: AIColor = new Color("#a52a2a");
export var BURLY_WOOD: AIColor = new Color("#deb887");
export var CADET_BLUE: AIColor = new Color("#5f9ea0");
export var CHARTREUSE: AIColor = new Color("#7fff00");
export var CHOCOLATE: AIColor = new Color("#d2691e");
export var CORAL: AIColor = new Color("#ff7f50");
export var CORNFLOWER_BLUE: AIColor = new Color("#6495ed");
export var CORNSILK: AIColor = new Color("#fff8dc");
export var CRIMSON: AIColor = new Color("#dc143c");
export var CYAN: AIColor = new Color("#00ffff");
export var DARK_BLUE: AIColor = new Color("#00008b");
export var DARK_CYAN: AIColor = new Color("#008b8b");
export var DARK_GOLDEN_ROD: AIColor = new Color("#b8860b");
export var DARK_GRAY: AIColor = new Color("#a9a9a9");
export var DARK_GREEN: AIColor = new Color("#006400");
export var DARK_KHAKI: AIColor = new Color("#bdb76b");
export var DARK_MAGENTA: AIColor = new Color("#8b008b");
export var DARK_OLIVE_GREEN: AIColor = new Color("#556b2f");
export var DARK_ORANGE: AIColor = new Color("#ff8c00");
export var DARK_ORCHID: AIColor = new Color("#9932cc");
export var DARK_RED: AIColor = new Color("#8b0000");
export var DARK_SALMON: AIColor = new Color("#e9967a");
export var DARK_SEA_GREEN: AIColor = new Color("#8fbc8f");
export var DARK_SLATE_BLUE: AIColor = new Color("#483d8b");
export var DARK_SLATE_GRAY: AIColor = new Color("#2f4f4f");
export var DARK_TURQUOISE: AIColor = new Color("#00ced1");
export var DARK_VIOLET: AIColor = new Color("#9400d3");
export var DEEP_PINK: AIColor = new Color("#ff1493");
export var DEEP_SKY_BLUE: AIColor = new Color("#00bfff");
export var DIM_GRAY: AIColor = new Color("#696969");
export var DIM_GREY: AIColor = new Color("#696969");
export var DODGER_BLUE: AIColor = new Color("#1e90ff");
export var FIRE_BRICK: AIColor = new Color("#b22222");
export var FLORAL_WHITE: AIColor = new Color("#fffaf0");
export var FOREST_GREEN: AIColor = new Color("#228b22");
export var FUCHSIA: AIColor = new Color("#ff00ff");
export var GAINSBORO: AIColor = new Color("#dcdcdc");
export var GHOST_WHITE: AIColor = new Color("#f8f8ff");
export var GOLD: AIColor = new Color("#ffd700");
export var GOLDEN_ROD: AIColor = new Color("#daa520");
export var GRAY: AIColor = new Color("#808080");
export var GREEN: AIColor = new Color("#008000");
export var GREEN_YELLOW: AIColor = new Color("#adff2f");
export var HONEY_DEW: AIColor = new Color("#f0fff0");
export var HOT_PINK: AIColor = new Color("#ff69b4");
export var INDIAN_RED: AIColor = new Color("#cd5c5c");
export var INDIGO: AIColor = new Color("#4b0082");
export var IVORY: AIColor = new Color("#fffff0");
export var KHAKI: AIColor = new Color("#f0e68c");
export var LAVENDER: AIColor = new Color("#e6e6fa");
export var LAVENDER_BLUSH: AIColor = new Color("#fff0f5");
export var LAWN_GREEN: AIColor = new Color("#7cfc00");
export var LEMON_CHIFFON: AIColor = new Color("#fffacd");
export var LIGHT_BLUE: AIColor = new Color("#add8e6");
export var LIGHT_CORAL: AIColor = new Color("#f08080");
export var LIGHT_CYAN: AIColor = new Color("#e0ffff");
export var LIGHT_GOLDEN_ROD_YELLOW: AIColor = new Color("#fafad2");
export var LIGHT_GRAY: AIColor = new Color("#d3d3d3");
export var LIGHT_GREEN: AIColor = new Color("#90ee90");
export var LIGHT_PINK: AIColor = new Color("#ffb6c1");
export var LIGHT_SALMON: AIColor = new Color("#ffa07a");
export var LIGHT_SEA_GREEN: AIColor = new Color("#20b2aa");
export var LIGHT_SKY_BLUE: AIColor = new Color("#87cefa");
export var LIGHT_SLATE_GRAY: AIColor = new Color("#778899");
export var LIGHT_STEEL_BLUE: AIColor = new Color("#b0c4de");
export var LIGHT_YELLOW: AIColor = new Color("#ffffe0");
export var LIME: AIColor = new Color("#00ff00");
export var LIME_GREEN: AIColor = new Color("#32cd32");
export var LINEN: AIColor = new Color("#faf0e6");
export var MAGENTA: AIColor = new Color("#ff00ff");
export var MAROON: AIColor = new Color("#800000");
export var MEDIUM_AQUA_MARINE: AIColor = new Color("#66cdaa");
export var MEDIUM_BLUE: AIColor = new Color("#0000cd");
export var MEDIUM_ORCHID: AIColor = new Color("#ba55d3");
export var MEDIUM_PURPLE: AIColor = new Color("#9370db");
export var MEDIUM_SEA_GREEN: AIColor = new Color("#3cb371");
export var MEDIUM_SLATE_BLUE: AIColor = new Color("#7b68ee");
export var MEDIUM_SPRING_GREEN: AIColor = new Color("#00fa9a");
export var MEDIUM_TURQUOISE: AIColor = new Color("#48d1cc");
export var MEDIUM_VIOLET_RED: AIColor = new Color("#c71585");
export var MIDNIGHT_BLUE: AIColor = new Color("#191970");
export var MINT_CREAM: AIColor = new Color("#f5fffa");
export var MISTY_ROSE: AIColor = new Color("#ffe4e1");
export var MOCCASIN: AIColor = new Color("#ffe4b5");
export var NAVAJO_WHITE: AIColor = new Color("#ffdead");
export var NAVY: AIColor = new Color("#000080");
export var OLD_LACE: AIColor = new Color("#fdf5e6");
export var OLIVE: AIColor = new Color("#808000");
export var OLIVE_DRAB: AIColor = new Color("#6b8e23");
export var ORANGE: AIColor = new Color("#ffa500");
export var ORANGE_RED: AIColor = new Color("#ff4500");
export var ORCHID: AIColor = new Color("#da70d6");
export var PALE_GOLDEN_ROD: AIColor = new Color("#eee8aa");
export var PALE_GREEN: AIColor = new Color("#98fb98");
export var PALE_TURQUOISE: AIColor = new Color("#afeeee");
export var PALE_VIOLET_RED: AIColor = new Color("#db7093");
export var PAPAYA_WHIP: AIColor = new Color("#ffefd5");
export var PEACH_PUFF: AIColor = new Color("#ffdab9");
export var PERU: AIColor = new Color("#cd853f");
export var PINK: AIColor = new Color("#ffc0cb");
export var PLUM: AIColor = new Color("#dda0dd");
export var POWDER_BLUE: AIColor = new Color("#b0e0e6");
export var PURPLE: AIColor = new Color("#800080");
export var RED: AIColor = new Color("#ff0000");
export var ROSY_BROWN: AIColor = new Color("#bc8f8f");
export var ROYAL_BLUE: AIColor = new Color("#4169e1");
export var SADDLE_BROWN: AIColor = new Color("#8b4513");
export var SALMON: AIColor = new Color("#fa8072");
export var SANDY_BROWN: AIColor = new Color("#f4a460");
export var SEA_GREEN: AIColor = new Color("#2e8b57");
export var SEA_SHELL: AIColor = new Color("#fff5ee");
export var SIENNA: AIColor = new Color("#a0522d");
export var SILVER: AIColor = new Color("#c0c0c0");
export var SKY_BLUE: AIColor = new Color("#87ceeb");
export var SLATE_BLUE: AIColor = new Color("#6a5acd");
export var SLATE_GRAY: AIColor = new Color("#708090");
export var SNOW: AIColor = new Color("#fffafa");
export var SPRING_GREEN: AIColor = new Color("#00ff7f");
export var STEEL_BLUE: AIColor = new Color("#4682b4");
export var TAN: AIColor = new Color("#d2b48c");
export var TEAL: AIColor = new Color("#008080");
export var THISTLE: AIColor = new Color("#d8bfd8");
export var TOMATO: AIColor = new Color("#ff6347");
export var TURQUOISE: AIColor = new Color("#40e0d0");
export var VIOLET: AIColor = new Color("#ee82ee");
export var WHEAT: AIColor = new Color("#f5deb3");
export var WHITE_SMOKE: AIColor = new Color("#f5f5f5");
export var YELLOW: AIColor = new Color("#ffff00");
export var YELLOW_GREEN: AIColor = new Color("#9acd32"); 