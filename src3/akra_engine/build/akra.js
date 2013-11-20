/// <reference path="idl/AEDataTypes.ts" />
/// <reference path="idl/AIEngine.ts" />
/// <reference path="idl/3d-party/has.d.ts" />
define(["require", "exports", "core"], function(require, exports, __core__) {
    /**
    * Build parameters
    */
    has.add("WEBGL", true);

    has.add("LOGGER_API", true);

    //has.add("FILEDROP_API", true);
    //has.add("CRYPTO_API", true)
    /** @deprecated Use GUI_API insted. */
    //has.add("GUI", true);
    /** @deprecated */
    has.add("SKY", true);

    //has.add("WEBGL_DEBUG", true);
    has.add("AFX_ENABLE_TEXT_EFFECTS", true);

    //has.add("DETAILED_LOG", true);
    /** trace all render entry */
    //has.add("__VIEW_INTERNALS__", true)
    //import common = require("common");
    var core = __core__;
    exports.core = core;
    

    console.log(5126 /* FLOAT */);

    function createEngine() {
        return new exports.core.Engine();
    }
    exports.createEngine = createEngine;
});
//# sourceMappingURL=akra.js.map
