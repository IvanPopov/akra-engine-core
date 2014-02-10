/// <reference path="Color.ts" />
/// <reference path="../math/Vec4.ts" />
var akra;
(function (akra) {
    (function (color) {
        var Vec4 = akra.math.Vec4;

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
                return new akra.color.Color(Math.random(), Math.random(), Math.random(), 1.);
            }

            if (iVariousColor === pVariousColors.length) {
                iVariousColor = 0;
            }

            return akra.color.Color[pVariousColors[iVariousColor++]] || akra.color.Color.WHITE;
        }
        color.random = random;

        /**  */ function toVec4(cSrc, vDst) {
            if (typeof vDst === "undefined") { vDst = new Vec4; }
            return vDst.set(cSrc.r, cSrc.g, cSrc.b, cSrc.a);
        }

        color.ZERO = new akra.color.Color(0., 0., 0., 0.);

        color.ALICE_BLUE = new akra.color.Color("#f0f8ff");
        color.ANTIQUE_WHITE = new akra.color.Color("#faebd7");
        color.AQUA = new akra.color.Color("#00ffff");
        color.AQUA_MARINE = new akra.color.Color("#7fffd4");
        color.AZURE = new akra.color.Color("#f0ffff");
        color.BEIGE = new akra.color.Color("#f5f5dc");
        color.BISQUE = new akra.color.Color("#ffe4c4");
        color.BLANCHED_ALMOND = new akra.color.Color("#ffebcd");
        color.BLUE = new akra.color.Color("#0000ff");
        color.BLUE_VIOLET = new akra.color.Color("#8a2be2");
        color.BROWN = new akra.color.Color("#a52a2a");
        color.BURLY_WOOD = new akra.color.Color("#deb887");
        color.CADET_BLUE = new akra.color.Color("#5f9ea0");
        color.CHARTREUSE = new akra.color.Color("#7fff00");
        color.CHOCOLATE = new akra.color.Color("#d2691e");
        color.CORAL = new akra.color.Color("#ff7f50");
        color.CORNFLOWER_BLUE = new akra.color.Color("#6495ed");
        color.CORNSILK = new akra.color.Color("#fff8dc");
        color.CRIMSON = new akra.color.Color("#dc143c");
        color.CYAN = new akra.color.Color("#00ffff");
        color.DARK_BLUE = new akra.color.Color("#00008b");
        color.DARK_CYAN = new akra.color.Color("#008b8b");
        color.DARK_GOLDEN_ROD = new akra.color.Color("#b8860b");
        color.DARK_GRAY = new akra.color.Color("#a9a9a9");
        color.DARK_GREEN = new akra.color.Color("#006400");
        color.DARK_KHAKI = new akra.color.Color("#bdb76b");
        color.DARK_MAGENTA = new akra.color.Color("#8b008b");
        color.DARK_OLIVE_GREEN = new akra.color.Color("#556b2f");
        color.DARK_ORANGE = new akra.color.Color("#ff8c00");
        color.DARK_ORCHID = new akra.color.Color("#9932cc");
        color.DARK_RED = new akra.color.Color("#8b0000");
        color.DARK_SALMON = new akra.color.Color("#e9967a");
        color.DARK_SEA_GREEN = new akra.color.Color("#8fbc8f");
        color.DARK_SLATE_BLUE = new akra.color.Color("#483d8b");
        color.DARK_SLATE_GRAY = new akra.color.Color("#2f4f4f");
        color.DARK_TURQUOISE = new akra.color.Color("#00ced1");
        color.DARK_VIOLET = new akra.color.Color("#9400d3");
        color.DEEP_PINK = new akra.color.Color("#ff1493");
        color.DEEP_SKY_BLUE = new akra.color.Color("#00bfff");
        color.DIM_GRAY = new akra.color.Color("#696969");
        color.DIM_GREY = new akra.color.Color("#696969");
        color.DODGER_BLUE = new akra.color.Color("#1e90ff");
        color.FIRE_BRICK = new akra.color.Color("#b22222");
        color.FLORAL_WHITE = new akra.color.Color("#fffaf0");
        color.FOREST_GREEN = new akra.color.Color("#228b22");
        color.FUCHSIA = new akra.color.Color("#ff00ff");
        color.GAINSBORO = new akra.color.Color("#dcdcdc");
        color.GHOST_WHITE = new akra.color.Color("#f8f8ff");
        color.GOLD = new akra.color.Color("#ffd700");
        color.GOLDEN_ROD = new akra.color.Color("#daa520");
        color.GRAY = new akra.color.Color("#808080");
        color.GREEN = new akra.color.Color("#008000");
        color.GREEN_YELLOW = new akra.color.Color("#adff2f");
        color.HONEY_DEW = new akra.color.Color("#f0fff0");
        color.HOT_PINK = new akra.color.Color("#ff69b4");
        color.INDIAN_RED = new akra.color.Color("#cd5c5c");
        color.INDIGO = new akra.color.Color("#4b0082");
        color.IVORY = new akra.color.Color("#fffff0");
        color.KHAKI = new akra.color.Color("#f0e68c");
        color.LAVENDER = new akra.color.Color("#e6e6fa");
        color.LAVENDER_BLUSH = new akra.color.Color("#fff0f5");
        color.LAWN_GREEN = new akra.color.Color("#7cfc00");
        color.LEMON_CHIFFON = new akra.color.Color("#fffacd");
        color.LIGHT_BLUE = new akra.color.Color("#add8e6");
        color.LIGHT_CORAL = new akra.color.Color("#f08080");
        color.LIGHT_CYAN = new akra.color.Color("#e0ffff");
        color.LIGHT_GOLDEN_ROD_YELLOW = new akra.color.Color("#fafad2");
        color.LIGHT_GRAY = new akra.color.Color("#d3d3d3");
        color.LIGHT_GREEN = new akra.color.Color("#90ee90");
        color.LIGHT_PINK = new akra.color.Color("#ffb6c1");
        color.LIGHT_SALMON = new akra.color.Color("#ffa07a");
        color.LIGHT_SEA_GREEN = new akra.color.Color("#20b2aa");
        color.LIGHT_SKY_BLUE = new akra.color.Color("#87cefa");
        color.LIGHT_SLATE_GRAY = new akra.color.Color("#778899");
        color.LIGHT_STEEL_BLUE = new akra.color.Color("#b0c4de");
        color.LIGHT_YELLOW = new akra.color.Color("#ffffe0");
        color.LIME = new akra.color.Color("#00ff00");
        color.LIME_GREEN = new akra.color.Color("#32cd32");
        color.LINEN = new akra.color.Color("#faf0e6");
        color.MAGENTA = new akra.color.Color("#ff00ff");
        color.MAROON = new akra.color.Color("#800000");
        color.MEDIUM_AQUA_MARINE = new akra.color.Color("#66cdaa");
        color.MEDIUM_BLUE = new akra.color.Color("#0000cd");
        color.MEDIUM_ORCHID = new akra.color.Color("#ba55d3");
        color.MEDIUM_PURPLE = new akra.color.Color("#9370db");
        color.MEDIUM_SEA_GREEN = new akra.color.Color("#3cb371");
        color.MEDIUM_SLATE_BLUE = new akra.color.Color("#7b68ee");
        color.MEDIUM_SPRING_GREEN = new akra.color.Color("#00fa9a");
        color.MEDIUM_TURQUOISE = new akra.color.Color("#48d1cc");
        color.MEDIUM_VIOLET_RED = new akra.color.Color("#c71585");
        color.MIDNIGHT_BLUE = new akra.color.Color("#191970");
        color.MINT_CREAM = new akra.color.Color("#f5fffa");
        color.MISTY_ROSE = new akra.color.Color("#ffe4e1");
        color.MOCCASIN = new akra.color.Color("#ffe4b5");
        color.NAVAJO_WHITE = new akra.color.Color("#ffdead");
        color.NAVY = new akra.color.Color("#000080");
        color.OLD_LACE = new akra.color.Color("#fdf5e6");
        color.OLIVE = new akra.color.Color("#808000");
        color.OLIVE_DRAB = new akra.color.Color("#6b8e23");
        color.ORANGE = new akra.color.Color("#ffa500");
        color.ORANGE_RED = new akra.color.Color("#ff4500");
        color.ORCHID = new akra.color.Color("#da70d6");
        color.PALE_GOLDEN_ROD = new akra.color.Color("#eee8aa");
        color.PALE_GREEN = new akra.color.Color("#98fb98");
        color.PALE_TURQUOISE = new akra.color.Color("#afeeee");
        color.PALE_VIOLET_RED = new akra.color.Color("#db7093");
        color.PAPAYA_WHIP = new akra.color.Color("#ffefd5");
        color.PEACH_PUFF = new akra.color.Color("#ffdab9");
        color.PERU = new akra.color.Color("#cd853f");
        color.PINK = new akra.color.Color("#ffc0cb");
        color.PLUM = new akra.color.Color("#dda0dd");
        color.POWDER_BLUE = new akra.color.Color("#b0e0e6");
        color.PURPLE = new akra.color.Color("#800080");
        color.RED = new akra.color.Color("#ff0000");
        color.ROSY_BROWN = new akra.color.Color("#bc8f8f");
        color.ROYAL_BLUE = new akra.color.Color("#4169e1");
        color.SADDLE_BROWN = new akra.color.Color("#8b4513");
        color.SALMON = new akra.color.Color("#fa8072");
        color.SANDY_BROWN = new akra.color.Color("#f4a460");
        color.SEA_GREEN = new akra.color.Color("#2e8b57");
        color.SEA_SHELL = new akra.color.Color("#fff5ee");
        color.SIENNA = new akra.color.Color("#a0522d");
        color.SILVER = new akra.color.Color("#c0c0c0");
        color.SKY_BLUE = new akra.color.Color("#87ceeb");
        color.SLATE_BLUE = new akra.color.Color("#6a5acd");
        color.SLATE_GRAY = new akra.color.Color("#708090");
        color.SNOW = new akra.color.Color("#fffafa");
        color.SPRING_GREEN = new akra.color.Color("#00ff7f");
        color.STEEL_BLUE = new akra.color.Color("#4682b4");
        color.TAN = new akra.color.Color("#d2b48c");
        color.TEAL = new akra.color.Color("#008080");
        color.THISTLE = new akra.color.Color("#d8bfd8");
        color.TOMATO = new akra.color.Color("#ff6347");
        color.TURQUOISE = new akra.color.Color("#40e0d0");
        color.VIOLET = new akra.color.Color("#ee82ee");
        color.WHEAT = new akra.color.Color("#f5deb3");
        color.WHITE_SMOKE = new akra.color.Color("#f5f5f5");
        color.YELLOW = new akra.color.Color("#ffff00");
        color.YELLOW_GREEN = new akra.color.Color("#9acd32");
    })(akra.color || (akra.color = {}));
    var color = akra.color;
})(akra || (akra = {}));
//# sourceMappingURL=colors.js.map
