define(["require", "exports", "color/Color", "math/Vec4"], function(require, exports, __Color__, __Vec4__) {
    var Color = __Color__;
    exports.Color = Color;
    var Vec4 = __Vec4__;
    exports.Vec4 = Vec4;

    var iVariousColor = 0;
    var pVariousColors = [
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

    function random(bVarious) {
        if (typeof bVarious === "undefined") { bVarious = false; }
        if (!bVarious) {
            return new exports.Color(Math.random(), Math.random(), Math.random(), 1.);
        }

        if (iVariousColor === pVariousColors.length) {
            iVariousColor = 0;
        }

        return (exports.Color)[pVariousColors[iVariousColor++]] || exports.Color.WHITE;
    }
    exports.random = random;

    /** inline */ function toVec4(cSrc, vDst) {
        if (typeof vDst === "undefined") { vDst = new exports.Vec4(); }
        return vDst.set(cSrc.r, cSrc.g, cSrc.b, cSrc.a);
    }

    exports.ZERO = new exports.Color(0., 0., 0., 0.);

    exports.ALICE_BLUE = new exports.Color("#f0f8ff");
    exports.ANTIQUE_WHITE = new exports.Color("#faebd7");
    exports.AQUA = new exports.Color("#00ffff");
    exports.AQUA_MARINE = new exports.Color("#7fffd4");
    exports.AZURE = new exports.Color("#f0ffff");
    exports.BEIGE = new exports.Color("#f5f5dc");
    exports.BISQUE = new exports.Color("#ffe4c4");
    exports.BLANCHED_ALMOND = new exports.Color("#ffebcd");
    exports.BLUE = new exports.Color("#0000ff");
    exports.BLUE_VIOLET = new exports.Color("#8a2be2");
    exports.BROWN = new exports.Color("#a52a2a");
    exports.BURLY_WOOD = new exports.Color("#deb887");
    exports.CADET_BLUE = new exports.Color("#5f9ea0");
    exports.CHARTREUSE = new exports.Color("#7fff00");
    exports.CHOCOLATE = new exports.Color("#d2691e");
    exports.CORAL = new exports.Color("#ff7f50");
    exports.CORNFLOWER_BLUE = new exports.Color("#6495ed");
    exports.CORNSILK = new exports.Color("#fff8dc");
    exports.CRIMSON = new exports.Color("#dc143c");
    exports.CYAN = new exports.Color("#00ffff");
    exports.DARK_BLUE = new exports.Color("#00008b");
    exports.DARK_CYAN = new exports.Color("#008b8b");
    exports.DARK_GOLDEN_ROD = new exports.Color("#b8860b");
    exports.DARK_GRAY = new exports.Color("#a9a9a9");
    exports.DARK_GREEN = new exports.Color("#006400");
    exports.DARK_KHAKI = new exports.Color("#bdb76b");
    exports.DARK_MAGENTA = new exports.Color("#8b008b");
    exports.DARK_OLIVE_GREEN = new exports.Color("#556b2f");
    exports.DARK_ORANGE = new exports.Color("#ff8c00");
    exports.DARK_ORCHID = new exports.Color("#9932cc");
    exports.DARK_RED = new exports.Color("#8b0000");
    exports.DARK_SALMON = new exports.Color("#e9967a");
    exports.DARK_SEA_GREEN = new exports.Color("#8fbc8f");
    exports.DARK_SLATE_BLUE = new exports.Color("#483d8b");
    exports.DARK_SLATE_GRAY = new exports.Color("#2f4f4f");
    exports.DARK_TURQUOISE = new exports.Color("#00ced1");
    exports.DARK_VIOLET = new exports.Color("#9400d3");
    exports.DEEP_PINK = new exports.Color("#ff1493");
    exports.DEEP_SKY_BLUE = new exports.Color("#00bfff");
    exports.DIM_GRAY = new exports.Color("#696969");
    exports.DIM_GREY = new exports.Color("#696969");
    exports.DODGER_BLUE = new exports.Color("#1e90ff");
    exports.FIRE_BRICK = new exports.Color("#b22222");
    exports.FLORAL_WHITE = new exports.Color("#fffaf0");
    exports.FOREST_GREEN = new exports.Color("#228b22");
    exports.FUCHSIA = new exports.Color("#ff00ff");
    exports.GAINSBORO = new exports.Color("#dcdcdc");
    exports.GHOST_WHITE = new exports.Color("#f8f8ff");
    exports.GOLD = new exports.Color("#ffd700");
    exports.GOLDEN_ROD = new exports.Color("#daa520");
    exports.GRAY = new exports.Color("#808080");
    exports.GREEN = new exports.Color("#008000");
    exports.GREEN_YELLOW = new exports.Color("#adff2f");
    exports.HONEY_DEW = new exports.Color("#f0fff0");
    exports.HOT_PINK = new exports.Color("#ff69b4");
    exports.INDIAN_RED = new exports.Color("#cd5c5c");
    exports.INDIGO = new exports.Color("#4b0082");
    exports.IVORY = new exports.Color("#fffff0");
    exports.KHAKI = new exports.Color("#f0e68c");
    exports.LAVENDER = new exports.Color("#e6e6fa");
    exports.LAVENDER_BLUSH = new exports.Color("#fff0f5");
    exports.LAWN_GREEN = new exports.Color("#7cfc00");
    exports.LEMON_CHIFFON = new exports.Color("#fffacd");
    exports.LIGHT_BLUE = new exports.Color("#add8e6");
    exports.LIGHT_CORAL = new exports.Color("#f08080");
    exports.LIGHT_CYAN = new exports.Color("#e0ffff");
    exports.LIGHT_GOLDEN_ROD_YELLOW = new exports.Color("#fafad2");
    exports.LIGHT_GRAY = new exports.Color("#d3d3d3");
    exports.LIGHT_GREEN = new exports.Color("#90ee90");
    exports.LIGHT_PINK = new exports.Color("#ffb6c1");
    exports.LIGHT_SALMON = new exports.Color("#ffa07a");
    exports.LIGHT_SEA_GREEN = new exports.Color("#20b2aa");
    exports.LIGHT_SKY_BLUE = new exports.Color("#87cefa");
    exports.LIGHT_SLATE_GRAY = new exports.Color("#778899");
    exports.LIGHT_STEEL_BLUE = new exports.Color("#b0c4de");
    exports.LIGHT_YELLOW = new exports.Color("#ffffe0");
    exports.LIME = new exports.Color("#00ff00");
    exports.LIME_GREEN = new exports.Color("#32cd32");
    exports.LINEN = new exports.Color("#faf0e6");
    exports.MAGENTA = new exports.Color("#ff00ff");
    exports.MAROON = new exports.Color("#800000");
    exports.MEDIUM_AQUA_MARINE = new exports.Color("#66cdaa");
    exports.MEDIUM_BLUE = new exports.Color("#0000cd");
    exports.MEDIUM_ORCHID = new exports.Color("#ba55d3");
    exports.MEDIUM_PURPLE = new exports.Color("#9370db");
    exports.MEDIUM_SEA_GREEN = new exports.Color("#3cb371");
    exports.MEDIUM_SLATE_BLUE = new exports.Color("#7b68ee");
    exports.MEDIUM_SPRING_GREEN = new exports.Color("#00fa9a");
    exports.MEDIUM_TURQUOISE = new exports.Color("#48d1cc");
    exports.MEDIUM_VIOLET_RED = new exports.Color("#c71585");
    exports.MIDNIGHT_BLUE = new exports.Color("#191970");
    exports.MINT_CREAM = new exports.Color("#f5fffa");
    exports.MISTY_ROSE = new exports.Color("#ffe4e1");
    exports.MOCCASIN = new exports.Color("#ffe4b5");
    exports.NAVAJO_WHITE = new exports.Color("#ffdead");
    exports.NAVY = new exports.Color("#000080");
    exports.OLD_LACE = new exports.Color("#fdf5e6");
    exports.OLIVE = new exports.Color("#808000");
    exports.OLIVE_DRAB = new exports.Color("#6b8e23");
    exports.ORANGE = new exports.Color("#ffa500");
    exports.ORANGE_RED = new exports.Color("#ff4500");
    exports.ORCHID = new exports.Color("#da70d6");
    exports.PALE_GOLDEN_ROD = new exports.Color("#eee8aa");
    exports.PALE_GREEN = new exports.Color("#98fb98");
    exports.PALE_TURQUOISE = new exports.Color("#afeeee");
    exports.PALE_VIOLET_RED = new exports.Color("#db7093");
    exports.PAPAYA_WHIP = new exports.Color("#ffefd5");
    exports.PEACH_PUFF = new exports.Color("#ffdab9");
    exports.PERU = new exports.Color("#cd853f");
    exports.PINK = new exports.Color("#ffc0cb");
    exports.PLUM = new exports.Color("#dda0dd");
    exports.POWDER_BLUE = new exports.Color("#b0e0e6");
    exports.PURPLE = new exports.Color("#800080");
    exports.RED = new exports.Color("#ff0000");
    exports.ROSY_BROWN = new exports.Color("#bc8f8f");
    exports.ROYAL_BLUE = new exports.Color("#4169e1");
    exports.SADDLE_BROWN = new exports.Color("#8b4513");
    exports.SALMON = new exports.Color("#fa8072");
    exports.SANDY_BROWN = new exports.Color("#f4a460");
    exports.SEA_GREEN = new exports.Color("#2e8b57");
    exports.SEA_SHELL = new exports.Color("#fff5ee");
    exports.SIENNA = new exports.Color("#a0522d");
    exports.SILVER = new exports.Color("#c0c0c0");
    exports.SKY_BLUE = new exports.Color("#87ceeb");
    exports.SLATE_BLUE = new exports.Color("#6a5acd");
    exports.SLATE_GRAY = new exports.Color("#708090");
    exports.SNOW = new exports.Color("#fffafa");
    exports.SPRING_GREEN = new exports.Color("#00ff7f");
    exports.STEEL_BLUE = new exports.Color("#4682b4");
    exports.TAN = new exports.Color("#d2b48c");
    exports.TEAL = new exports.Color("#008080");
    exports.THISTLE = new exports.Color("#d8bfd8");
    exports.TOMATO = new exports.Color("#ff6347");
    exports.TURQUOISE = new exports.Color("#40e0d0");
    exports.VIOLET = new exports.Color("#ee82ee");
    exports.WHEAT = new exports.Color("#f5deb3");
    exports.WHITE_SMOKE = new exports.Color("#f5f5f5");
    exports.YELLOW = new exports.Color("#ffff00");
    exports.YELLOW_GREEN = new exports.Color("#9acd32");
});
//# sourceMappingURL=color.js.map
