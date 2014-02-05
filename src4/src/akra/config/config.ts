/// <reference path="../idl/IAjaxParams.ts" />
/// <reference path="../idl/IRenderer.ts" />

/// <reference path="../uri/uri.ts" />

declare var AE_DEBUG: boolean;
declare var AE_VERSION: string;

module akra.config {
	//unknown constants
	export var unknown = {
		code: 0,
		message: "Unknown code.",
		name: "unknown"
	}

	//global
	export var DEBUG: boolean = AE_DEBUG;
	export var VERSION: string = AE_VERSION;
	export var WEBGL: boolean = true;
	export var UI: boolean = false;


	//temporary 
	export var DEBUG_PARSER: boolean = false;
	export var SKY: boolean = true;
	export var SKY_GPU: boolean = false;
	export var AFX_ENABLE_TEXT_EFFECTS: boolean = true;
	export var __VIEW_INTERNALS__: boolean = false;
	export var DETAILED_LOG: boolean = false;
	export var LOGGER_API: boolean = true;
	export var CRYPTO_API: boolean = false;
	export var FILEDROP_API: boolean = false;
	export var WEBGL_DEBUG: boolean = false;
	export var PROFILE_MAKER: boolean = false;
	export var PROFILE_TESSEALLATION: boolean = false;
	

	export var SHADOW_DISCARD_DISTANCE: float = 70.;
	//////////////////////

	///render targets
	///end of render targets

	//path to data folder
	export var data = config['data'] || uri.currentPath();

	//default <any> name
	export var defaultName: string = "default";

	export var renderer = ERenderers.UNKNOWN;

	if (WEBGL) {
		renderer = ERenderers.WEBGL;
	}

	//default ajax parameters
	export var ajax = {
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

	export var threading = {
		min: 0, //the minimum number of threads created on startup
		max: 4,  //the maximum number of threads created on startup
		idleTime: 30, //maximum IDLE time (sec)
	};

	export var io = {
		//thread file config
		tfile: {
			interface: "FileInterface.t.js",
			local: "../../../src2/data/js/LocalFile.t.js",
			remote: "../../../src2/data/js/RemoteFile.t.js"
		},
		//local file config
		local: {
			filesystemLimit: 32 * 1024 * 1024 //32 mb
		}
	}

	export var deps = {
		archiveIndex: ".map",
		etag: {
			file: ".etag",
			forceCheck: false
		}
	}


	export var net = {
		port: 1337 //websocket port
	}


	export var rpc = {
		deferredCallsLimit: 20000,
		reconnectTimeout: 2500,
		systemRoutineInterval: 10000,
		callbackLifetime: 60000,
		maxCallbacksCount: -1,
		procListName: "proc_list",
		callsFrequency: -1
	}

	export var material = {
		name: defaultName,
		default: {
			diffuse: .5, //any color view can be used, like "#888888" or {r: .5, g: .5, b: .5}
			ambient: .5,
			specular: .5,
			emissive: .5,
			shininess: 50.
		}
	}

	export var fx = {
		grammar: "grammars/HLSL.gr"
	}

	export var terrain = {
		useMegaTexture: true,
		roam: {
			tessellationThread: "TessellationThread.t.js"
		}
	}

	export var webgl = {
		preparedFramebuffersNum: 32,
		indexbufferMinSize: 1024,
		vertexbufferMinSize: 1024,
		vertexTextureMinSize: 32
	}

	export var addons = {

	}
}

