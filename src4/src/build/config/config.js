/// <reference path="../idl/IAjaxParams.ts" />
/// <reference path="../idl/IRenderer.ts" />
/// <reference path="../uri/uri.ts" />

var akra;
(function (akra) {
    (function (config) {
        //unknown constants
        config.unknown = {
            code: 0,
            message: "Unknown code.",
            name: "unknown"
        };

        //global
        config.DEBUG = AE_DEBUG;
        config.VERSION = AE_VERSION;
        config.WEBGL = true;
        config.UI = false;

        //temporary
        config.DEBUG_PARSER = false;
        config.SKY = true;
        config.SKY_GPU = false;
        config.AFX_ENABLE_TEXT_EFFECTS = true;
        config.__VIEW_INTERNALS__ = false;
        config.DETAILED_LOG = false;
        config.LOGGER_API = true;
        config.CRYPTO_API = false;
        config.FILEDROP_API = false;
        config.WEBGL_DEBUG = false;
        config.PROFILE_MAKER = false;
        config.PROFILE_TESSEALLATION = false;

        config.SHADOW_DISCARD_DISTANCE = 70.;

        //////////////////////
        ///render targets
        ///end of render targets
        //path to data folder
        config.data = config['data'] || akra.uri.currentPath();

        //default <any> name
        config.defaultName = "default";

        config.renderer = 0 /* UNKNOWN */;

        if (config.WEBGL) {
            config.renderer = 1 /* WEBGL */;
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
                local: "../../../src2/data/js/LocalFile.t.js",
                remote: "../../../src2/data/js/RemoteFile.t.js"
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

        config.terrain = {
            useMegaTexture: true,
            roam: {
                tessellationThread: "TessellationThread.t.js"
            }
        };

        config.webgl = {
            preparedFramebuffersNum: 32,
            indexbufferMinSize: 1024,
            vertexbufferMinSize: 1024,
            vertexTextureMinSize: 32
        };

        config.addons = {};
    })(akra.config || (akra.config = {}));
    var config = akra.config;
})(akra || (akra = {}));
//# sourceMappingURL=config.js.map
