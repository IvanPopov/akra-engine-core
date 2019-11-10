/// <reference path="../idl/IAjaxParams.ts" />
/// <reference path="../idl/IRenderer.ts" />

/// <reference path="../uri/uri.ts" />

declare var AE_DEBUG: boolean;
declare var AE_VERSION: string;
declare var AE_THREAD_FILEINTERFACE: { content: any; format: string};
declare var AE_THREAD_LOCALFILE: { content: any; format: string };
declare var AE_THREAD_REMOTEFILE: { content: any; format: string };
declare var AE_THREAD_TESSELATION: { content: any; format: string };
declare var AE_WEBGL_DEBUG: boolean;

module akra.config {

	export var DEBUG: boolean = AE_DEBUG;
	export var VERSION: string = AE_VERSION;
	export var WEBGL: boolean = true;

	/**
	 * Will be TRUE if ui extension presented.
	 */
	export const UI: boolean = false;

	/** 
	 * Display debugging information while parsing effects. 
	 */
	export const AFX_DEBUG_PARSER: boolean = true;

	/**
	 * If there is support for loading effects in text form, is TRUE.
	 */
	export const AFX_ENABLE_TEXT_EFFECTS: boolean = true;

	/**
	 * Use GPU for pre-calculation of atmospheric scattering.
	 */  
	export const USE_ATMOSPHERIC_SCATTERING_GPU_MODE: boolean = false;

	/**
	 * Do not use this, if you dont know what it.
	 * @debug
	 */
	export const __VIEW_INTERNALS__: boolean = false;

	/**
	 * If [WebGLDebugUtils](https://www.khronos.org/registry/webgl/sdk/debug/webgl-debug.js) presented,
	 * they will use to create a context.
	 */
	export const WEBGL_DEBUG: boolean = AE_WEBGL_DEBUG;

	/**
	 * Calculate profile information for terrain tesselation
	 * @debug
	 */
	export const PROFILE_TESSEALLATION: boolean = false;

	//path to data folder
	export var data = config['data'] || uri.currentPath();

	//required deps for Akra Engine
	export var coreDeps: IDependens = {
		files: [AE_CORE_DEPENDENCIES]
	};

	/** Unknown constants. */
	export var unknown = {
		"code": 0,
		"message": "Unknown code.",
		"name": "unknown"
	}


	/** Default <any> name */
	export var defaultName: string = "default";

	/** Type of used renderer. Default to ERenderers::WEBGL. */
	export var renderer = ERenderers.UNKNOWN;

	if (WEBGL) {
		renderer = ERenderers.WEBGL;
	}

	/** Ajax default parameters. */
	export var ajax = {
		"async": false,
		"statusCode": {},
		"success": null,
		"error": null,
		"beforeSend": null,
		"data": null,
		"cache": false,
		"contentType": "application/x-www-form-urlencoded",
		"dataType": "text",
		"type": "get",
		"timeout": 0
	};

	export var threading = {
		"min": 0, //the minimum number of threads created on startup
		"max": 4,  //the maximum number of threads created on startup
		"idleTime": 30, //maximum IDLE time (sec)
	};


	export var render = {
		shadows: {
			enabled: true,
			/**
			 * Distance in meters, after which the shadow of the object will not be rendered.
			 */
			discardDistance: 70. 
		}
	};
	
	
	export var io = {
		//thread file config
		"tfile": {
			"iface": AE_THREAD_FILEINTERFACE,
			"local": AE_THREAD_LOCALFILE,
			"remote": AE_THREAD_REMOTEFILE
		},
		//local file config
		"local": {
			"filesystemLimit": 32 * 1024 * 1024 //32 mb
		}
	}

	// URL.createObjectURL(new Blob([], { type: "application/javascript" }))

	export var deps = {
		"archiveIndex": ".map",
		"etag": {
			"file": ".etag",
			"forceCheck": true
		}
	}


	export var net = {
		"port": 1337 //websocket port
	}


	export var rpc = {
		"deferredCallsLimit": 20000,
		"reconnectTimeout": 2500,
		"systemRoutineInterval": 10000,
		"callbackLifetime": 60000,
		"maxCallbacksCount": -1,
		"procListName": "proc_list",
		"callsFrequency": -1
	}

	export var material = {
		"name": defaultName,
		"default": {
			"diffuse": .5, //any color view can be used, like "#888888" or {r: .5, g: .5, b: .5}
			"ambient": .5,
			"specular": .5,
			"emissive": .5,
			"shininess": 0.2,
			"transparency": 1.
		}
	}

	export var fx = {
		grammar: "grammars/HLSL.gr"
	}

	export var terrain = {
		"useMegaTexture": true,
		"roam": {
			"tessellationThread": AE_THREAD_TESSELATION
		}
	}

	export var webgl = {
		"preparedFramebuffersNum": 32,
		"indexbufferMinSize": 1024,
		"vertexbufferMinSize": 1024,
		"vertexTextureMinSize": 32,

		"extensionsBlackList": [/*"WEBGL_compressed_texture_s3tc"*/]
	}

	export var addons = {

	}
}

