define(["require", "exports"], function(require, exports) {
    exports.math = {
        stackSize: 256
    };

    exports.unknownCode = 0;
    exports.unknownMessage = "Unknown code.";
    exports.unknownName = "unknown";
    exports.defaultName = "default";

    //global
    exports.debug = has("DEBUG");
    exports.data = "";
    exports.version = "0.1.1";

    //material
    exports.material = {
        name: exports.defaultName
    };

    //uniq sid
    var total = 0;
    exports.sid = function () {
        return ++total;
    };
});
//# sourceMappingURL=cfg.js.map
