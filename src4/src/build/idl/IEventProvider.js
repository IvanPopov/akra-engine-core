/// <reference path="IUnique.ts" />
var akra;
(function (akra) {
    (function (EEventTypes) {
        EEventTypes[EEventTypes["UNICAST"] = 0] = "UNICAST";
        EEventTypes[EEventTypes["BROADCAST"] = 1] = "BROADCAST";
    })(akra.EEventTypes || (akra.EEventTypes = {}));
    var EEventTypes = akra.EEventTypes;
})(akra || (akra = {}));
//# sourceMappingURL=IEventProvider.js.map
