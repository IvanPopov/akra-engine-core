/// <reference path="GamepadMap.ts" />
/// <reference path="KeyMap.ts" />
var akra;
(function (akra) {
    (function (control) {
        function createGamepadMap() {
            return new akra.control.GamepadMap;
        }
        control.createGamepadMap = createGamepadMap;

        function createKeymap(target) {
            return new akra.control.KeyMap(target);
        }
        control.createKeymap = createKeymap;
    })(akra.control || (akra.control = {}));
    var control = akra.control;
})(akra || (akra = {}));
//# sourceMappingURL=control.js.map
