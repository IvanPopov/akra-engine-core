/// <reference path="idl/AIAjaxParams.ts" />
/// <reference path="idl/AIRenderer.ts" />
/// <reference path="idl/common.d.ts" />
define(["require", "exports", "conv"], function(require, exports, __conv__) {
    var conv = __conv__;

    //unknown constants
    exports.unknown = {
        code: 0,
        message: "Unknown code.",
        name: "unknown"
    };

    //global
    exports.DEBUG = has("DEBUG");

    //path to data folder
    exports.data = "";

    //current version
    exports.version = "0.1.1";

    //default <any> name
    exports.defaultName = "default";

    exports.renderer = 0 /* UNKNOWN */;

    if (has("WEBGL")) {
        exports.renderer = 1 /* WEBGL */;
    }

    //default ajax parameters
    exports.ajax = {
        async: false,
        statusCode: {},
        success: null,
        error: null,
        beforeSend: null,
        data: null,
        cache: false,
        contentType: "application/x-www-form-urlencoded",
        dataType: "text",
        type: "get",
        timeout: 0
    };

    exports.threading = {
        min: 0,
        max: 4,
        idleTime: 30
    };

    exports.io = {
        //thread file config
        tfile: {
            interface: "FileInterface.t.js",
            local: "LocalFile.t.js",
            remote: "RemoteFile.t.js"
        },
        //local file config
        local: {
            filesystemLimit: 32 * 1024 * 1024
        }
    };

    exports.deps = {
        archiveIndex: ".map",
        etag: {
            file: ".etag",
            forceCheck: false
        }
    };

    exports.net = {
        port: 1337
    };

    exports.rpc = {
        deferredCallsLimit: 20000,
        reconnectTimeout: 2500,
        systemRoutineInterval: 10000,
        callbackLifetime: 60000,
        maxCallbacksCount: -1,
        procListName: "proc_list",
        callsFrequency: -1
    };

    exports.material = {
        name: exports.defaultName,
        default: {
            diffuse: .5,
            ambient: .5,
            specular: .5,
            emissive: .5,
            shininess: 50.
        }
    };

    exports.fx = {
        grammar: "grammars/HLSL.gr"
    };

    if (!exports.DEBUG) {
        var buildInlineThread = function (sInterface, sLogic) {
            return conv.toURL("var $INTERFACE_DEFINED = true;\n" + sLogic + "\n" + sInterface, "application/javascript");
        };

        var ifaceContent = __STRINGIFY__(__MINIFY__(__CONTENT__("/js/FileInterface.t.js")));
        var localContent = __STRINGIFY__(__MINIFY__(__CONTENT__("/js/LocalFile.t.js")));
        var remoteContent = __STRINGIFY__(__MINIFY__(__CONTENT__("/js/RemoteFile.t.js")));

        exports.io.tfile.interface = null;
        exports.io.tfile.local = buildInlineThread(ifaceContent, localContent);
        exports.io.tfile.remote = buildInlineThread(ifaceContent, remoteContent);
    }
});
//# sourceMappingURL=config.js.map
