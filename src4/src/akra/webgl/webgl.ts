/// <reference path="../idl/3d-party/webgl.d.ts" />
/// <reference path="../idl/EPixelFormats.ts" />
/// <reference path="../idl/IHardwareBuffer.ts" />
/// <reference path="../idl/IPixelBox.ts" />
/// <reference path="../idl/EPrimitiveTypes.ts" />

/// <reference path="../common.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../debug.ts" />
/// <reference path="../bf/bf.ts" />
/// <reference path="../math/math.ts" />
/// <reference path="../pixelUtil/pixelUtil.ts" />

module akra.webgl {

	export var maxTextureSize: uint = 0;
	export var maxCubeMapTextureSize: uint = 0;
	export var maxViewPortSize: uint = 0;
	
	export var maxTextureImageUnits: uint = 0;
	export var maxVertexAttributes: uint = 0;
	export var maxVertexTextureImageUnits: uint = 0;
	export var maxCombinedTextureImageUnits: uint = 0;

	export var maxColorAttachments: uint = 1;

	export var stencilBits: uint = 0;
	export var colorBits: uint[] = [0, 0, 0];
	export var alphaBits: uint = 0;
	export var multisampleType: float = 0.;

	export var shaderVersion: float = 0;
	export var hasNonPowerOf2Textures: boolean = false;

	export var ANGLE: boolean = false;

	var isSupported: boolean = false;
	var pSupportedExtensionList: string[] = null;

	//todo: replace with constants (use <const> keyword)


	//WebGL Extensions 

	export var OES_TEXTURE_FLOAT = "OES_texture_float";
	export var OES_TEXTURE_HALF_FLOAT = "OES_texture_half_float";
	export var OES_STANDARD_DERIVATIVES = "OES_standard_derivatives";
	export var OES_VERTEX_ARRAY_OBJECT = "OES_vertex_array_object";
	export var OES_ELEMENT_INDEX_UINT = "OES_element_index_uint";
	export var WEBGL_DEBUG_RENDERER_INFO = "WEBGL_debug_renderer_info";
	export var WEBGL_DEBUG_SHADERS = "WEBGL_debug_shaders";
	export var EXT_TEXTURE_FILTER_ANISOTROPIC = "EXT_texture_filter_anisotropic";

	//draft

	export var WEBGL_LOSE_CONTEXT = "WEBGL_lose_context";
	export var WEBGL_DEPTH_TEXTURE = "WEBGL_depth_texture";
	export var WEBGL_COMPRESSED_TEXTURE_S3TC = "WEBGL_compressed_texture_s3tc";
	export var WEBGL_COMPRESSED_TEXTURE_ATC = "WEBGL_compressed_texture_atc";
	export var WEBGL_COMPRESSED_TEXTURE_PVRTC = "WEBGL_compressed_texture_pvrtc";
	export var WEBGL_COLOR_BUFFER_FLOAT = "WEBGL_color_buffer_float";
	export var EXT_COLOR_BUFFER_HALF_FLOAT = "EXT_color_buffer_half_float";


	//Future
	export var EXT_TEXTURE_RG = "EXT_texture_rg";
	export var OES_DEPTH24 = "OES_depth24";
	export var OES_DEPTH32 = "OES_depth32";
	export var OES_PACKED_DEPTH_STENCIL = "OES_packed_depth_stencil";
	export var EXT_TEXTURE_NPOT_2D_MIPMAP = "EXT_texture_npot_2D_mipmap";

	export var GLSL_VS_SHADER_MIN: string = "void main(void){gl_Position = vec4(0., 0., 0., 1.);}";
	export var GLSL_FS_SHADER_MIN: string = "void main(void){}";


	function makeDebugContext(pWebGLContext: WebGLRenderingContext): WebGLRenderingContext {
		if (isDef((<any>window).WebGLDebugUtils)) {
			pWebGLContext = WebGLDebugUtils.makeDebugContext(pWebGLContext,
				(err: int, funcName: string, args: IArguments): void => {
					//debug.log(__CALLSTACK__);
					throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
				},
				(funcName: string, args: IArguments): void => {
					logger.log("gl." + funcName + "(" + WebGLDebugUtils.glFunctionArgsToString(funcName, args) + ")");
				});
		}

		return pWebGLContext;
	}

	export function loadExtension(pWebGLContext: WebGLRenderingContext, sExtName: string): boolean {
		var pWebGLExtentionList: Object = (<any>pWebGLContext).extentionList = (<any>pWebGLContext).extentionList || {};
		var pWebGLExtension: Object;

		if (!hasExtension(sExtName)) {
			logger.warn("Extension " + sExtName + " unsupported for this platform.");
			return false;
		}
		if (pWebGLExtension = pWebGLContext.getExtension(sExtName)) {

			if (isDefAndNotNull(pWebGLExtentionList[sExtName])) {
				// debug.log("Extension " + sExtName + " already loaded for this context.");
				return true;
			}

			pWebGLExtentionList[sExtName] = pWebGLExtension;

			//debug.log("loaded WebGL extension: ", sExtName);

			for (var j in pWebGLExtension) {
				if (isFunction(pWebGLExtension[j])) {
					//debug.log("created func WebGLRenderingContext::" + j + "(...)");
					pWebGLContext[j] = function () {
						pWebGLContext[j] = new Function(
							"var t = this.extentionList[" + sExtName + "];" +
							"t." + j + ".apply(t, arguments);");
					}

				}
				else {
					//debug.log("created const WebGLRenderingContext::" + j + " = " + pWebGLExtension[j]);
					pWebGLContext[j] = pWebGLExtension[j];
				}
			}

			return true;
		}

		logger.warn("cannot load extension: ", sExtName);
		return false;
	}


	function checkIsAngle(pWebGLContext: WebGLRenderingContext): boolean {
		var pProgram: WebGLProgram = pWebGLContext.createProgram();

		var sVertex: string = "\
			attribute vec3 pos;\
			struct S {\
			  vec3 b[1];\
			};\
			uniform S s[1];\
			void main(void) {\
			  float t = s[0].b[0].x;\
			  gl_Position = vec4(pos, 1. + t);\
			}";

		var sFragment: string = "void main(void){}";

		var pVertexShader: WebGLShader = pWebGLContext.createShader(gl.VERTEX_SHADER);
		var pFragmentShader: WebGLShader = pWebGLContext.createShader(gl.FRAGMENT_SHADER);

		pWebGLContext.shaderSource(pVertexShader, sVertex);
		pWebGLContext.compileShader(pVertexShader);
		pWebGLContext.shaderSource(pFragmentShader, sFragment);
		pWebGLContext.compileShader(pFragmentShader);

		pWebGLContext.attachShader(pProgram, pVertexShader);
		pWebGLContext.attachShader(pProgram, pFragmentShader);

		pWebGLContext.linkProgram(pProgram);

		if (!pWebGLContext.getProgramParameter(pProgram, gl.LINK_STATUS)) {
			//debug.error("cannot compile GLSL shader for ANGLE renderer");

			//debug.log(pWebGLContext.getShaderInfoLog(pVertexShader));
			//debug.log(pWebGLContext.getShaderSource(pVertexShader) || sVertex);

			//debug.log(pWebGLContext.getShaderInfoLog(pFragmentShader));
			//debug.log(pWebGLContext.getShaderSource(pFragmentShader) || sFragment);

			return false;
		}

		//debug.assert(pWebGLContext.getProgramParameter(pProgram, gl.ACTIVE_UNIFORMS) > 0,
		//    "no uniforms founded in angle test shader!");

		return pWebGLContext.getActiveUniform(pProgram, 0).name != "s[0].b[0]";
	}

	function setupContext(pWebGLContext: WebGLRenderingContext): WebGLRenderingContext {
		//test context not created yet
		if (isNull(pSupportedExtensionList)) {
			return pWebGLContext;
		}

		for (var i: int = 0; i < pSupportedExtensionList.length; ++i) {
			if (!loadExtension(pWebGLContext, pSupportedExtensionList[i])) {
				pSupportedExtensionList.splice(i, 1);
			}
		}

		return pWebGLContext;
	}

	export var isEnabled = (): boolean => isSupported;

	export function createContext(
		pCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.createElement("canvas"),
		pOptions?: WebGLContextAttributes): WebGLRenderingContext {

		var pWebGLContext: WebGLRenderingContext = null;

		try {
			pWebGLContext = pCanvas.getContext("webgl", pOptions) ||
			pCanvas.getContext("experimental-webgl", pOptions);
		}
		catch (e) {
			if (config.DEBUG) {
				throw e;
			}
		}

		if (isDefAndNotNull(pWebGLContext)) {
			if (config.WEBGL_DEBUG) {
				return makeDebugContext(setupContext(pWebGLContext));
			}
			else {
				return setupContext(pWebGLContext);
			}
		}

		//debug.warn("cannot get 3d device");

		return null;
	}

	(function (pWebGLContext: WebGLRenderingContext): void {
		if (!pWebGLContext) {
			return;
		}



		maxTextureSize = pWebGLContext.getParameter(gl.MAX_TEXTURE_SIZE);
		maxCubeMapTextureSize = pWebGLContext.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
		maxViewPortSize = pWebGLContext.getParameter(gl.MAX_VIEWPORT_DIMS);

		maxTextureImageUnits = pWebGLContext.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
		maxVertexAttributes = pWebGLContext.getParameter(gl.MAX_VERTEX_ATTRIBS);
		maxVertexTextureImageUnits = pWebGLContext.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
		maxCombinedTextureImageUnits = pWebGLContext.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);

		stencilBits = pWebGLContext.getParameter(gl.STENCIL_BITS);
		colorBits = [
			pWebGLContext.getParameter(gl.RED_BITS),
			pWebGLContext.getParameter(gl.GREEN_BITS),
			pWebGLContext.getParameter(gl.BLUE_BITS)
		];

		alphaBits = pWebGLContext.getParameter(gl.ALPHA_BITS);
		multisampleType = pWebGLContext.getParameter(gl.SAMPLE_COVERAGE_VALUE);

		pSupportedExtensionList = pWebGLContext.getSupportedExtensions();

		if (config.DEBUG) {
			//pSupportedExtensionList.push(WEBGL.DEBUG_SHADERS, WEBGL.DEBUG_RENDERER_INFO);
		}

		isSupported = true;

		ANGLE = checkIsAngle(pWebGLContext);

		
		debug.log("WebGL running under " + (ANGLE ? "ANGLE/DirectX" : "Native GL"));
	})(createContext());

	export function hasExtension(sExtName: string): boolean {
		for (var i: int = 0; i < pSupportedExtensionList.length; ++i) {
			if (pSupportedExtensionList[i].search(sExtName) != -1) {
				return true;
			}
		}

		return false;
	}

	export function getWebGLUsage(iFlags: int): int {
		if (bf.testAny(iFlags, EHardwareBufferFlags.DYNAMIC)) {
			return gl.DYNAMIC_DRAW;
		}
		else if (bf.testAny(iFlags, EHardwareBufferFlags.STREAM)) {
			return gl.STREAM_DRAW;
		}

		return gl.STATIC_DRAW;
	}


	export function getWebGLFormat(eFormat: EPixelFormats): int {

		switch (eFormat) {
			case EPixelFormats.L8:
			case EPixelFormats.L16:
				return gl.LUMINANCE;

			case EPixelFormats.A8:
				return gl.ALPHA;

			case EPixelFormats.A4L4:
			case EPixelFormats.BYTE_LA:
				return gl.LUMINANCE_ALPHA;

			case EPixelFormats.R5G6B5:
				return 0;
			case EPixelFormats.B5G6R5:
				return gl.RGB;
			case EPixelFormats.R3G3B2:
				return 0;
			case EPixelFormats.A4R4G4B4:
			case EPixelFormats.A1R5G5B5:
				return gl.RGBA;

			case EPixelFormats.R8G8B8:
			case EPixelFormats.B8G8R8:
				return gl.RGB;

			case EPixelFormats.A8R8G8B8:
			case EPixelFormats.A8B8G8R8:
				return gl.RGBA;

			case EPixelFormats.B8G8R8A8:
			case EPixelFormats.R8G8B8A8:
			case EPixelFormats.X8R8G8B8:
			case EPixelFormats.X8B8G8R8:
				return gl.RGBA;

			case EPixelFormats.A2R10G10B10:
				return 0;
			case EPixelFormats.A2B10G10R10:
				return gl.RGBA;

			case EPixelFormats.DXT1:
				return gl.COMPRESSED_RGBA_S3TC_DXT1_EXT;
			case EPixelFormats.DXT2:
				return 0;
			case EPixelFormats.DXT3:
				return gl.COMPRESSED_RGBA_S3TC_DXT3_EXT;
			case EPixelFormats.DXT4:
				return 0;
			case EPixelFormats.DXT5:
				return gl.COMPRESSED_RGBA_S3TC_DXT5_EXT;
			case EPixelFormats.FLOAT16_R:
				return 0;
			case EPixelFormats.FLOAT16_RGB:
				return gl.RGB;
			case EPixelFormats.FLOAT16_RGBA:
				return gl.RGBA;
			case EPixelFormats.FLOAT32_R:
				return 0;
			case EPixelFormats.FLOAT32_RGB:
				return gl.RGB;
			case EPixelFormats.FLOAT32_RGBA:
				return gl.RGBA;
			case EPixelFormats.FLOAT16_GR:
			case EPixelFormats.FLOAT32_GR:
				return 0;

			case EPixelFormats.FLOAT32_DEPTH:
			case EPixelFormats.DEPTH32:
			case EPixelFormats.DEPTH16:
			case EPixelFormats.DEPTH8:
				return gl.DEPTH_COMPONENT;

			case EPixelFormats.DEPTH24STENCIL8:
				return gl.DEPTH_STENCIL;

			case EPixelFormats.SHORT_RGBA:
				return gl.RGBA;
			case EPixelFormats.SHORT_GR:
				return 0;
			case EPixelFormats.SHORT_RGB:
				return gl.RGB;

			case EPixelFormats.PVRTC_RGB2:     
				return gl.COMPRESSED_RGB_PVRTC_2BPPV1_IMG
			case EPixelFormats.PVRTC_RGBA2:   
				return gl.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
			case EPixelFormats.PVRTC_RGB4:    
				return gl.COMPRESSED_RGB_PVRTC_4BPPV1_IMG
			case EPixelFormats.PVRTC_RGBA4:
				return gl.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;

			case EPixelFormats.R8:
			case EPixelFormats.RG8:
				return 0;

			default:
				logger.warn("getWebGLFormat unknown format", eFormat);
				return 0;
		}

	}

	export function isWebGLFormatSupport(eFormat: EPixelFormats): boolean {
		switch (eFormat) {
			case EPixelFormats.DXT1:
			case EPixelFormats.DXT3:
			case EPixelFormats.DXT5:
				return hasExtension(WEBGL_COMPRESSED_TEXTURE_S3TC);
			case EPixelFormats.PVRTC_RGB2:
			case EPixelFormats.PVRTC_RGBA2:
			case EPixelFormats.PVRTC_RGB4:
			case EPixelFormats.PVRTC_RGBA4:
				return hasExtension(WEBGL_COMPRESSED_TEXTURE_PVRTC);
			case EPixelFormats.DEPTH32:
			case EPixelFormats.DEPTH16:
			case EPixelFormats.DEPTH24STENCIL8:
				return hasExtension(WEBGL_DEPTH_TEXTURE);
			case EPixelFormats.DEPTH32:
			case EPixelFormats.DEPTH16:
			case EPixelFormats.DEPTH24STENCIL8:
				return hasExtension(WEBGL_DEPTH_TEXTURE);
			case EPixelFormats.FLOAT16_RGB:
			case EPixelFormats.FLOAT16_RGBA:
				return hasExtension(OES_TEXTURE_HALF_FLOAT);
			case EPixelFormats.FLOAT32_RGB:
			case EPixelFormats.FLOAT32_RGBA:
				return hasExtension(OES_TEXTURE_FLOAT);

		}

		if (getWebGLFormat(eFormat) && getWebGLDataType(eFormat)) {
			// switch(eFormat)
			// {
			//     case EPixelFormats.FLOAT32_DEPTH:
			//     case EPixelFormats.L16:
			//         return false;
			// }
			return true;
		}

		return false;
	}


	export function getWebGLDataType(eFormat: EPixelFormats): int {
		switch (eFormat) {
			case EPixelFormats.L8:
				return gl.UNSIGNED_BYTE;
			case EPixelFormats.L16:
				//return gl.UNSIGNED_SHORT;
				return gl.UNSIGNED_BYTE;

			case EPixelFormats.A8:
				return gl.UNSIGNED_BYTE;

			case EPixelFormats.A4L4:
				return 0;
			case EPixelFormats.BYTE_LA:
				return gl.UNSIGNED_BYTE;

			case EPixelFormats.R5G6B5:
			case EPixelFormats.B5G6R5:
				return gl.UNSIGNED_SHORT_5_6_5;
			case EPixelFormats.R3G3B2:
				return 0;
			case EPixelFormats.A4R4G4B4:
				return gl.UNSIGNED_SHORT_4_4_4_4;
			case EPixelFormats.A1R5G5B5:
				return gl.UNSIGNED_SHORT_5_5_5_1;

			case EPixelFormats.R8G8B8:
			case EPixelFormats.B8G8R8:
			case EPixelFormats.A8R8G8B8:
			case EPixelFormats.A8B8G8R8:
			case EPixelFormats.B8G8R8A8:
			case EPixelFormats.R8G8B8A8:
			case EPixelFormats.X8R8G8B8:
			case EPixelFormats.X8B8G8R8:
				return gl.UNSIGNED_BYTE;

			case EPixelFormats.A2R10G10B10:
				return 0;
			case EPixelFormats.A2B10G10R10:
				return 0;

			case EPixelFormats.DXT1:
			case EPixelFormats.DXT2:
			case EPixelFormats.DXT3:
			case EPixelFormats.DXT4:
			case EPixelFormats.DXT5:
				return 0;

			case EPixelFormats.FLOAT16_R:
			case EPixelFormats.FLOAT16_RGB:
			case EPixelFormats.FLOAT16_RGBA:
				return gl.HALF_FLOAT_OES;

			case EPixelFormats.FLOAT32_R:
			case EPixelFormats.FLOAT32_RGB:
			case EPixelFormats.FLOAT32_RGBA:
			case EPixelFormats.FLOAT16_GR:
			case EPixelFormats.FLOAT32_GR:
				return gl.FLOAT;

			case EPixelFormats.FLOAT32_DEPTH:
				return gl.FLOAT;

			case EPixelFormats.DEPTH8:
				return gl.UNSIGNED_BYTE;
			case EPixelFormats.DEPTH16:
				return gl.UNSIGNED_SHORT;
			case EPixelFormats.DEPTH32:
				return gl.UNSIGNED_INT;
			case EPixelFormats.DEPTH24STENCIL8:
				return gl.UNSIGNED_INT_24_8_WEBGL;

			case EPixelFormats.SHORT_RGBA:
			case EPixelFormats.SHORT_GR:
			case EPixelFormats.SHORT_RGB:
				return gl.UNSIGNED_SHORT;

			case EPixelFormats.PVRTC_RGB2:
			case EPixelFormats.PVRTC_RGBA2:
			case EPixelFormats.PVRTC_RGB4:
			case EPixelFormats.PVRTC_RGBA4:
				return 0;

			case EPixelFormats.R8:
			case EPixelFormats.RG8:
				return gl.UNSIGNED_BYTE;

			default:
				logger.critical("getWebGLFormat unknown format");
				return 0;
		}
	}



	export function getWebGLInternalFormat(eFormat: EPixelFormats): int {
		if (!pixelUtil.isCompressed(eFormat)) {
			return getWebGLFormat(eFormat);
		}
		else {
			switch (eFormat) {
				case EPixelFormats.DXT1:
					return gl.COMPRESSED_RGBA_S3TC_DXT1_EXT;
				case EPixelFormats.DXT2:
					return 0;
				case EPixelFormats.DXT3:
					return gl.COMPRESSED_RGBA_S3TC_DXT3_EXT;
				case EPixelFormats.DXT4:
					return 0;
				case EPixelFormats.DXT5:
					return gl.COMPRESSED_RGBA_S3TC_DXT5_EXT;
				case EPixelFormats.PVRTC_RGB2:     
					return gl.COMPRESSED_RGB_PVRTC_2BPPV1_IMG
				case EPixelFormats.PVRTC_RGBA2:   
					return gl.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
				case EPixelFormats.PVRTC_RGB4:    
					return gl.COMPRESSED_RGB_PVRTC_4BPPV1_IMG
				case EPixelFormats.PVRTC_RGBA4:
					return gl.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
			}
		}
	}

	export function getWebGLPrimitiveType(eType: EPrimitiveTypes): int {
		switch (eType) {
			case EPrimitiveTypes.POINTLIST:
				return gl.POINTS;
			case EPrimitiveTypes.LINELIST:
				return gl.LINES;
			case EPrimitiveTypes.LINELOOP:
				return gl.LINE_LOOP;
			case EPrimitiveTypes.LINESTRIP:
				return gl.LINE_STRIP;
			case EPrimitiveTypes.TRIANGLELIST:
				return gl.TRIANGLES;
			case EPrimitiveTypes.TRIANGLESTRIP:
				return gl.TRIANGLE_STRIP;
			case EPrimitiveTypes.TRIANGLEFAN:
				return gl.TRIANGLE_FAN;
		}

		return gl.POINTS;
	}

	//не знаю что делает эта функция
	export function getClosestWebGLInternalFormat(eFormat: EPixelFormats, isHWGamma: boolean = false): int {
		var iGLFormat: int = getWebGLInternalFormat(eFormat);

		if (iGLFormat === gl.NONE) {
			if (isHWGamma) {
				// TODO not supported
				return 0;
			}
			else {
				return gl.RGBA;
			}
		}
		else {
			return iGLFormat;
		}
	}

	/**
	 * Convert GL format to EPixelFormat.
	 */
	export function getClosestAkraFormat(iGLFormat: int, iGLDataType: int): EPixelFormats {
		switch (iGLFormat) {

			case gl.COMPRESSED_RGB_PVRTC_2BPPV1_IMG:
				return hasExtension(WEBGL_COMPRESSED_TEXTURE_PVRTC) ? EPixelFormats.PVRTC_RGB2 : EPixelFormats.A8R8G8B8;
			case gl.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG:
				return hasExtension(WEBGL_COMPRESSED_TEXTURE_PVRTC) ? EPixelFormats.PVRTC_RGBA2 : EPixelFormats.A8R8G8B8;
			case gl.COMPRESSED_RGB_PVRTC_4BPPV1_IMG:
				return hasExtension(WEBGL_COMPRESSED_TEXTURE_PVRTC) ? EPixelFormats.PVRTC_RGB4 : EPixelFormats.A8R8G8B8;
			case gl.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG:
				return hasExtension(WEBGL_COMPRESSED_TEXTURE_PVRTC) ? EPixelFormats.PVRTC_RGBA4 : EPixelFormats.A8R8G8B8;

			case gl.LUMINANCE:
				return EPixelFormats.L8;
			case gl.ALPHA:
				return EPixelFormats.A8;
			case gl.LUMINANCE_ALPHA:
				return EPixelFormats.BYTE_LA;

			case gl.RGB:
				switch (iGLDataType) {
					case gl.UNSIGNED_SHORT_5_6_5:
						return EPixelFormats.B5G6R5;
					default:
						return EPixelFormats.R8G8B8;
				}

			case gl.RGBA:
				switch (iGLDataType) {
					case gl.UNSIGNED_SHORT_5_5_5_1:
						return EPixelFormats.A1R5G5B5;
					case gl.UNSIGNED_SHORT_4_4_4_4:
						return EPixelFormats.A4R4G4B4;
					case gl.FLOAT:
						return EPixelFormats.FLOAT32_RGBA;
					default:
						return EPixelFormats.R8G8B8A8;
					// return EPixelFormats.A8B8G8R8;
				}

			case gl.BGRA:
				return EPixelFormats.A8B8G8R8;

			case gl.COMPRESSED_RGB_S3TC_DXT1_EXT:
			case gl.COMPRESSED_RGBA_S3TC_DXT1_EXT:
				return hasExtension(WEBGL_COMPRESSED_TEXTURE_S3TC) ? EPixelFormats.DXT1 : EPixelFormats.A8R8G8B8;

			case gl.COMPRESSED_RGBA_S3TC_DXT3_EXT:
				return hasExtension(WEBGL_COMPRESSED_TEXTURE_S3TC) ? EPixelFormats.DXT3 : EPixelFormats.A8R8G8B8;
			case gl.COMPRESSED_RGBA_S3TC_DXT5_EXT:
				return hasExtension(WEBGL_COMPRESSED_TEXTURE_S3TC) ? EPixelFormats.DXT5 : EPixelFormats.A8R8G8B8;

			case gl.R8_EXT:
				return hasExtension(EXT_TEXTURE_RG) ? EPixelFormats.R8 : EPixelFormats.A8R8G8B8;
			case gl.RG8_EXT:
				return hasExtension(EXT_TEXTURE_RG) ? EPixelFormats.RG8 : EPixelFormats.A8R8G8B8;

			case gl.DEPTH_COMPONENT:
				switch (iGLDataType) {
					case gl.FLOAT:
						return EPixelFormats.FLOAT32_DEPTH;
					case gl.UNSIGNED_INT:
						return EPixelFormats.DEPTH32;
					case gl.UNSIGNED_SHORT:
						return EPixelFormats.DEPTH16;
					case gl.UNSIGNED_BYTE:
						return EPixelFormats.DEPTH8;
				}

			case gl.DEPTH_STENCIL:
				return EPixelFormats.DEPTH24STENCIL8;


			default:
				//TODO: not supported
				return EPixelFormats.A8R8G8B8;
		}
	}

	export function optionalPO2(iValue: uint): uint {
		if (hasNonPowerOf2Textures) {
			return iValue;
		}
		else {
			return math.ceilingPowerOfTwo(<uint>iValue);
		}
	}


	export function convertToWebGLformat(pSource: IPixelBox, pDest: IPixelBox): void {
		// Always need to convert PF_A4R4G4B4, GL expects the colors to be in the 
		// reverse order
		if (pDest.format == EPixelFormats.A4R4G4B4) {
			// Convert PF_A4R4G4B4 -> PF_B4G4R4A4
			// Reverse pixel order
			var iSrcPtr: uint = (pSource.left + pSource.top * pSource.rowPitch + pSource.front * pSource.slicePitch);
			var iDstPtr: uint = (pDest.left + pDest.top * pDest.rowPitch + pDest.front * pDest.slicePitch);
			var iSrcSliceSkip: uint = pSource.getSliceSkip();
			var iDstSliceSkip: uint = pDest.getSliceSkip();
			var k: int = pSource.right - pSource.left;
			var x: int = 0,
				y: int = 0,
				z: int = 0;

			for (z = pSource.front; z < pSource.back; z++) {
				for (y = pSource.top; y < pSource.bottom; y++) {
					for (x = 0; x < k; x++) {
						pDest[iDstPtr + x] = ((pSource[iSrcPtr + x] & 0x000F) << 12) |   /* B*/
						((pSource[iSrcPtr + x] & 0x00F0) << 4) |   /* G*/
						((pSource[iSrcPtr + x] & 0x0F00) >> 4) |   /* R*/
						((pSource[iSrcPtr + x] & 0xF000) >> 12);    /* A*/
					}

					iSrcPtr += pSource.rowPitch;
					iDstPtr += pDest.rowPitch;
				}

				iSrcPtr += iSrcSliceSkip;
				iDstPtr += iDstSliceSkip;
			}
		}
	}

	export function checkFBOAttachmentFormat(eFormat: EPixelFormats): boolean {
		if (eFormat === EPixelFormats.R8G8B8A8 || eFormat === EPixelFormats.R8G8B8) {
			return true;
		}
		else if (eFormat === EPixelFormats.A8B8G8R8) {
			return true;
		}
		else if (eFormat === EPixelFormats.FLOAT32_RGBA) {
			// return hasExtension(WEBGL.COLOR_BUFFER_FLOAT);
			return hasExtension(OES_TEXTURE_FLOAT);
		}
		else if (eFormat === EPixelFormats.FLOAT16_RGBA) {
			// return hasExtension(EXT_COLOR_BUFFER_HALF_FLOAT);
			return hasExtension(OES_TEXTURE_HALF_FLOAT);
		}
		else if (eFormat === EPixelFormats.DEPTH32) {
			return true;
		}
		else {
			return false;
		}

	}

	export function checkReadPixelFormat(eFormat: EPixelFormats): boolean {
		if (eFormat === EPixelFormats.R8G8B8A8 || eFormat === EPixelFormats.R8G8B8) {
			return true;
		}
		// else if(eFormat === EPixelFormats.A8B8G8R8){
		//     return true;
		// }
		else if (eFormat === EPixelFormats.FLOAT32_RGBA) {
			//hasExtension(WEBGL.COLOR_BUFFER_FLOAT) || hasExtension(EXT_COLOR_BUFFER_HALF_FLOAT);
			return false;
		}
		else {
			return false;
		}

	}



	export function checkCopyTexImage(eFormat: EPixelFormats): boolean {
		switch (eFormat) {
			case EPixelFormats.R8G8B8A8:
			case EPixelFormats.R8G8B8:
			case EPixelFormats.L8:
			case EPixelFormats.L16:
			case EPixelFormats.A8:
				return true;

			default:
				return false;
		}
	}

	export function getSupportedAlternative(eFormat: EPixelFormats): EPixelFormats {
		if (checkFBOAttachmentFormat(eFormat)) {
			return eFormat;
		}

		/// Find first alternative
		var pct: EPixelComponentTypes = pixelUtil.getComponentType(eFormat);

		switch (pct) {
			case EPixelComponentTypes.BYTE:
				eFormat = EPixelFormats.A8R8G8B8;
				break;
			case EPixelComponentTypes.SHORT:
				eFormat = EPixelFormats.SHORT_RGBA;
				break;
			case EPixelComponentTypes.FLOAT16:
				eFormat = EPixelFormats.FLOAT16_RGBA;
				break;
			case EPixelComponentTypes.FLOAT32:
				eFormat = EPixelFormats.FLOAT32_RGBA;
				break;
			case EPixelComponentTypes.COUNT:
			default:
				break;
		}

		if (checkFBOAttachmentFormat(eFormat)) {
			return eFormat;
		}

		/// If none at all, return to default
		return EPixelFormats.A8R8G8B8;
	}
}
