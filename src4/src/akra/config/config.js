var akra;
(function (akra) {
    /// <reference path="../idl/IAjaxParams.ts" />
    /// <reference path="../idl/IRenderer.ts" />
    (function (config) {
        //unknown constants
        config.unknown = {
            code: 0,
            message: "Unknown code.",
            name: "unknown"
        };

        //global
        config.DEBUG = true;
        config.WEBGL = true;

        //temporary
        config.SKY = true;
        config.AFX_ENABLE_TEXT_EFFECTS;
        config.__VIEW_INTERNALS__ = true;
        config.DETAILED_LOG = false;
        config.LOGGER_API = true;
        config.CRYPTO_API = false;
        config.FILEDROP_API = false;
        config.WEBGL_DEBUG = false;

        //////////////////////
        //path to data folder
        config.data = "";

        //current version
        config.version = "0.1.1";

        //default <any> name
        config.defaultName = "default";

        config.renderer = akra.ERenderers.UNKNOWN;

        if (config.WEBGL) {
            config.renderer = akra.ERenderers.WEBGL;
        }

        //default ajax parameters
        config.ajax = {
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

        config.threading = {
            min: 0,
            max: 4,
            idleTime: 30
        };

        config.io = {
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

        config.deps = {
            archiveIndex: ".map",
            etag: {
                file: ".etag",
                forceCheck: false
            }
        };

        config.net = {
            port: 1337
        };

        config.rpc = {
            deferredCallsLimit: 20000,
            reconnectTimeout: 2500,
            systemRoutineInterval: 10000,
            callbackLifetime: 60000,
            maxCallbacksCount: -1,
            procListName: "proc_list",
            callsFrequency: -1
        };

        config.material = {
            name: config.defaultName,
            default: {
                diffuse: .5,
                ambient: .5,
                specular: .5,
                emissive: .5,
                shininess: 50.
            }
        };

        config.fx = {
            grammar: "grammars/HLSL.gr"
        };
    })(akra.config || (akra.config = {}));
    var config = akra.config;
})(akra || (akra = {}));
