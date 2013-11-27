/// <reference path="IUnique.ts" />
var akra;
(function (akra) {
    (function (EEventType) {
        EEventType[EEventType["UNICAST"] = 0] = "UNICAST";
        EEventType[EEventType["BROADCAST"] = 1] = "BROADCAST";
    })(akra.EEventType || (akra.EEventType = {}));
    var EEventType = akra.EEventType;
})(akra || (akra = {}));
