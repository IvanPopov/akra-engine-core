/// <reference path="../idl/IAjaxParams.ts" />
/// <reference path="../idl/IRenderer.ts" />

/// <reference path="../uri/uri.ts" />

declare var AE_DEBUG: boolean;
declare var AE_VERSION: string;
declare var AE_THREAD_FILEINTERFACE: string;
declare var AE_THREAD_LOCALFILE: string;
declare var AE_THREAD_REMOTEFILE: string;

module akra.config {

	export var DEBUG: boolean = AE_DEBUG;
	export var VERSION: string = AE_VERSION;
	export var WEBGL: boolean = true;

	/**
	 * Will be TRUE if ui extension presented.
	 */
	export var UI: boolean = false;

	/** 
	 * Display debugging information while parsing effects. 
	 */
	export var AFX_DEBUG_PARSER: boolean = false;

	/**
	 * If there is support for loading effects in text form, is TRUE.
	 */
	export var AFX_ENABLE_TEXT_EFFECTS: boolean = true;

	/**
	 * Use GPU for pre-calculation of atmospheric scattering.
	 */  
	export var USE_ATMOSPHERIC_SCATTERING_GPU_MODE: boolean = false;

	/**
	 * Do not use this, if you dont know what it.
	 * @debug
	 */
	export var __VIEW_INTERNALS__: boolean = false;

	/**
	 * If [WebGLDebugUtils](https://www.khronos.org/registry/webgl/sdk/debug/webgl-debug.js) presented,
	 * they will use to create a context.
	 */
	export var WEBGL_DEBUG: boolean = false;

	/**
	 * Calculate profile information for terrain tesselation
	 * @debug
	 */
	export var PROFILE_TESSEALLATION: boolean = false;

	/**
	 * Distance in meters, after which the shadow of the object will not be rendered.
	 */
	export var SHADOW_DISCARD_DISTANCE: float = 70.;

	//path to data folder
	export var data = config['data'] || uri.currentPath();

	//required deps for Akra Engine
	export var coreDeps: IDependens = {
		files: [
			{
				path: AE_CORE_DEPENDENCIES.path,
				type: AE_CORE_DEPENDENCIES.type
			}
		]
	};

	/** Unknown constants. */
	export var unknown = {
		code: 0,
		message: "Unknown code.",
		name: "unknown"
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
			interface: AE_THREAD_FILEINTERFACE,
			local: AE_THREAD_LOCALFILE,
			remote: AE_THREAD_REMOTEFILE
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

