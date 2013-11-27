var akra;
(function (akra) {
    /// <reference path="GamepadMap.ts" />
    /// <reference path="KeyMap.ts" />
    (function (control) {
        function createGamepadMap() {
            return new GamepadMap();
        }
        control.createGamepadMap = createGamepadMap;

        function createKeymap(target) {
            return new KeyMap(target);
        }
        control.createKeymap = createKeymap;
    })(akra.control || (akra.control = {}));
    var control = akra.control;
})(akra || (akra = {}));
