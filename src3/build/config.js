define(["require", "exports"], function(require, exports) {
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
});
//# sourceMappingURL=config.js.map
