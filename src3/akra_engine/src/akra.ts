/// <reference path="idl/AEDataTypes.ts" />
/// <reference path="idl/AIEngine.ts" />
/// <reference path="idl/3d-party/has.d.ts" />

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
export import core = require("core");
export import webgl = require("webgl");

console.log(AEDataTypes.FLOAT);

export function createEngine(): AIEngine {
    return new core.Engine;
}


