define(["require", "exports", "control/GamepadMap", "control/KeyMap"], function(require, exports, __GamepadMap__, __KeyMap__) {
    var GamepadMap = __GamepadMap__;
    var KeyMap = __KeyMap__;

    function createGamepadMap() {
        return new GamepadMap();
    }
    exports.createGamepadMap = createGamepadMap;

    function createKeymap(target) {
        return new KeyMap(target);
    }
    exports.createKeymap = createKeymap;
});
//# sourceMappingURL=control.js.map
