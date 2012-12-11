#ifndef WEBGL_TS
#define WEBGL_TS

#include "webgl.d.ts"

#include "IPixelBox.ts"
#include "PixelFormat.ts"
#include "common.ts"
#include "IHardwareBuffer.ts"

#define GLSL_VS_SHADER_MIN "void main(void){gl_Position = vec4(0., 0., 0., 1.);}"
#define GLSL_FS_SHADER_MIN "void main(void){}"

#define GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext)\
	var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getManager().getEngine().getRenderer();\
	var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

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

	var pSupportedExtensionList: string[] = null;
	var pLoadedExtensionList: Object = null;

    export function createContext(
            pCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.createElement("canvas"), 
            pOptions?: { antialias?: bool; }): WebGLRenderingContext {

    	var pWebGLContext: WebGLRenderingContext = null;
		
		try {
			pWebGLContext = pCanvas.getContext("webgl", pOptions) || 
				pCanvas.getContext("experimental-webgl", pOptions);
    	}
		catch (e) {}

		if (!pWebGLContext) {
			debug_warning("cannot get 3d device");
		}

		return pWebGLContext;
    }

	(function (pWebGLContext: WebGLRenderingContext): void {
		if (!pWebGLContext) {
			return;
		}

		maxTextureSize 					= pWebGLContext.getParameter(GL_MAX_TEXTURE_SIZE);
		maxCubeMapTextureSize 			= pWebGLContext.getParameter(GL_MAX_CUBE_MAP_TEXTURE_SIZE);
		maxViewPortSize 				= pWebGLContext.getParameter(GL_MAX_VIEWPORT_DIMS);

		maxTextureImageUnits 			= pWebGLContext.getParameter(GL_MAX_TEXTURE_IMAGE_UNITS);
		maxVertexAttributes 			= pWebGLContext.getParameter(GL_MAX_VERTEX_ATTRIBS);
		maxVertexTextureImageUnits 		= pWebGLContext.getParameter(GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS);
		maxCombinedTextureImageUnits 	= pWebGLContext.getParameter(GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS);

		stencilBits 					= pWebGLContext.getParameter(GL_STENCIL_BITS);
		colorBits 						= [
									        pWebGLContext.getParameter(GL_RED_BITS),
									        pWebGLContext.getParameter(GL_GREEN_BITS),
									        pWebGLContext.getParameter(GL_BLUE_BITS)
	   									];

	    alphaBits 						= pWebGLContext.getParameter(GL_ALPHA_BITS);
	    multisampleType 				= pWebGLContext.getParameter(GL_SAMPLE_COVERAGE_VALUE);

	    pSupportedExtensionList 		= pWebGLContext.getSupportedExtensions();

#ifdef DEBUG	    
	    pSupportedExtensionList.push(WEBGL_DEBUG_SHADERS, WEBGL_DEBUG_RENDERER_INFO);
#endif
	    var pWebGLExtentionList: Object = {};
	    var pWebGLExtension: Object;
	    
	    for (var i: int = 0; i < pSupportedExtensionList.length; ++ i) {
	        if (pWebGLExtension = pWebGLContext.getExtension(pSupportedExtensionList[i])) {
	            pWebGLExtentionList[pSupportedExtensionList[i]] = pWebGLExtension;

	            debug_print("loaded WebGL extension: %1", pSupportedExtensionList[i]);

	            for (var j in pWebGLExtension) {
	                if (isFunction(pWebGLExtension[j])) {

	                    pWebGLContext[j] = function () {
	                        pWebGLContext[j] = new Function(
	                            "var t = this.pWebGLExtentionList[" + pSupportedExtensionList[i] + "];" + 
	                            "t." + j + ".apply(t, arguments);");
	                    }

	                }
	                else {
	                    pWebGLContext[j] = pWebGLExtentionList[pSupportedExtensionList[i]][j];
	                }
	            }
	        }
	        else {
	            WARNING("cannot load extension: %1", pSupportedExtensionList[i]);
	            pSupportedExtensionList.splice(i, 1);
	        }
	    }


	    (<any>pWebGLContext).pWebGLExtentionList = pWebGLExtentionList;
	    pLoadedExtensionList = pWebGLExtentionList;

	})(createContext());

	export function hasExtension(sExtName: string): bool {
        for (var i: int = 0; i < pSupportedExtensionList.length; ++ i) {
            if (pSupportedExtensionList[i].search(sExtName) != -1) {
                return true;
            }
        }

        return false;
	}

	export function getWebGLUsage(iFlags: int): int {
		if (TEST_ANY(iFlags, EHardwareBufferFlags.DYNAMIC)) {
	        return GL_DYNAMIC_DRAW;
	    }
	    else if (TEST_ANY(iFlags, EHardwareBufferFlags.STREAM)) {
	        return GL_STREAM_DRAW;
	    }

	    return GL_STATIC_DRAW;
	}

	export function getWebGLOriginFormat(eFormat: EPixelFormats): int {
		switch(eFormat){
			case EPixelFormats.A8:
                return GL_ALPHA;

            case EPixelFormats.L8:
            case EPixelFormats.L16:
                return GL_LUMINANCE;
            
            case EPixelFormats.FLOAT16_RGB:
            	return webgl.hasExtension(OES_TEXTURE_HALF_FLOAT) ? GL_RGB : 0;

            case EPixelFormats.FLOAT16_RGBA:
            	return webgl.hasExtension(OES_TEXTURE_HALF_FLOAT) ? GL_RGBA : 0;

           	case EPixelFormats.FLOAT16_R:
            case EPixelFormats.R8:
                return webgl.hasExtension(EXT_TEXTURE_RG) ? GL_RED_EXT : 0;

            case EPixelFormats.FLOAT16_GR:
            case EPixelFormats.RG8:
                return webgl.hasExtension(EXT_TEXTURE_RG) ? GL_RG_EXT : 0;

            case EPixelFormats.BYTE_LA:
            case EPixelFormats.SHORT_GR:
                return GL_LUMINANCE_ALPHA;

            // PVRTC compressed formats
            case EPixelFormats.PVRTC_RGB2:
                return webgl.hasExtension(WEBGL_COMPRESSED_TEXTURE_PVRTC) ? GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG : 0;
            case EPixelFormats.PVRTC_RGB4:
                return webgl.hasExtension(WEBGL_COMPRESSED_TEXTURE_PVRTC) ? GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG : 0;
            case EPixelFormats.PVRTC_RGBA2:
                return webgl.hasExtension(WEBGL_COMPRESSED_TEXTURE_PVRTC) ? GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG : 0;
            case EPixelFormats.PVRTC_RGBA4:
                return webgl.hasExtension(WEBGL_COMPRESSED_TEXTURE_PVRTC) ? GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG : 0;

            case EPixelFormats.R5G6B5:
            case EPixelFormats.B5G6R5:
            case EPixelFormats.R8G8B8:
            case EPixelFormats.B8G8R8:
                return GL_RGB;

            case EPixelFormats.A1R5G5B5:
                return GL_BGRA;

            case EPixelFormats.A4R4G4B4:
            case EPixelFormats.X8R8G8B8:
            case EPixelFormats.A8R8G8B8:
            case EPixelFormats.B8G8R8A8:
            case EPixelFormats.X8B8G8R8:
            case EPixelFormats.A8B8G8R8:
                return GL_RGBA;

            case EPixelFormats.DXT1:
                return webgl.hasExtension(WEBGL_COMPRESSED_TEXTURE_S3TC) ? GL_COMPRESSED_RGBA_S3TC_DXT1_EXT : 0;

            case EPixelFormats.DXT3:
                return webgl.hasExtension(WEBGL_COMPRESSED_TEXTURE_S3TC) ? GL_COMPRESSED_RGBA_S3TC_DXT3_EXT : 0;

            case EPixelFormats.DXT5:
                return webgl.hasExtension(WEBGL_COMPRESSED_TEXTURE_S3TC) ? GL_COMPRESSED_RGBA_S3TC_DXT5_EXT : 0;

            case EPixelFormats.FLOAT32_GR:
            case EPixelFormats.FLOAT32_R:

            default:
                return 0;    
        }
             
	}
	
	export function getWebGLOriginDataType(eFormat: EPixelFormats): int {
		return 0;
	}

	export function convertToWebGLformat(pSource: IPixelBox, pDest: IPixelBox): void {
	
	}

}

#endif