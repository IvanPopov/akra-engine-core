/// <reference path="IEventProvider.ts" />
/// <reference path="3d-party/gamepad.d.ts" />
var akra;
(function (akra) {
    (function (EGamepadCodes) {
        EGamepadCodes[EGamepadCodes["FACE_1"] = 0] = "FACE_1";
        EGamepadCodes[EGamepadCodes["FACE_2"] = 1] = "FACE_2";
        EGamepadCodes[EGamepadCodes["FACE_3"] = 2] = "FACE_3";
        EGamepadCodes[EGamepadCodes["FACE_4"] = 3] = "FACE_4";
        EGamepadCodes[EGamepadCodes["LEFT_SHOULDER"] = 4] = "LEFT_SHOULDER";
        EGamepadCodes[EGamepadCodes["RIGHT_SHOULDER"] = 5] = "RIGHT_SHOULDER";
        EGamepadCodes[EGamepadCodes["LEFT_SHOULDER_BOTTOM"] = 6] = "LEFT_SHOULDER_BOTTOM";
        EGamepadCodes[EGamepadCodes["RIGHT_SHOULDER_BOTTOM"] = 7] = "RIGHT_SHOULDER_BOTTOM";
        EGamepadCodes[EGamepadCodes["SELECT"] = 8] = "SELECT";
        EGamepadCodes[EGamepadCodes["START"] = 9] = "START";
        EGamepadCodes[EGamepadCodes["LEFT_ANALOGUE_STICK"] = 10] = "LEFT_ANALOGUE_STICK";
        EGamepadCodes[EGamepadCodes["RIGHT_ANALOGUE_STICK"] = 11] = "RIGHT_ANALOGUE_STICK";
        EGamepadCodes[EGamepadCodes["PAD_TOP"] = 12] = "PAD_TOP";
        EGamepadCodes[EGamepadCodes["PAD_BOTTOM"] = 13] = "PAD_BOTTOM";
        EGamepadCodes[EGamepadCodes["PAD_LEFT"] = 14] = "PAD_LEFT";
        EGamepadCodes[EGamepadCodes["PAD_RIGHT"] = 15] = "PAD_RIGHT";
    })(akra.EGamepadCodes || (akra.EGamepadCodes = {}));
    var EGamepadCodes = akra.EGamepadCodes;

    (function (EGamepadAxis) {
        EGamepadAxis[EGamepadAxis["LEFT_ANALOGUE_HOR"] = 0] = "LEFT_ANALOGUE_HOR";
        EGamepadAxis[EGamepadAxis["LEFT_ANALOGUE_VERT"] = 1] = "LEFT_ANALOGUE_VERT";
        EGamepadAxis[EGamepadAxis["RIGHT_ANALOGUE_HOR"] = 2] = "RIGHT_ANALOGUE_HOR";
        EGamepadAxis[EGamepadAxis["RIGHT_ANALOGUE_VERT"] = 3] = "RIGHT_ANALOGUE_VERT";
    })(akra.EGamepadAxis || (akra.EGamepadAxis = {}));
    var EGamepadAxis = akra.EGamepadAxis;
})(akra || (akra = {}));
//# sourceMappingURL=IGamepadMap.js.map
