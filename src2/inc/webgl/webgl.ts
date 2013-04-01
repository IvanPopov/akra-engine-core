#ifndef WEBGL_TS
#define WEBGL_TS

#include "webgl.d.ts"

#include "IPixelBox.ts"
#include "PixelFormat.ts"
#include "common.ts"
#include "IHardwareBuffer.ts"

#include "bf/bitflags.ts"
#include "math/math.ts"

#include "IRenderer.ts"
#include "pixelUtil/pixelUtil.ts"

#define GLSL_VS_SHADER_MIN "void main(void){gl_Position = vec4(0., 0., 0., 1.);}"
#define GLSL_FS_SHADER_MIN "void main(void){}"

#define GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext)\
	var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();\
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
	export var hasNonPowerOf2Textures: bool = false;

    export var isANGLE: bool = false;

    var isSupported: bool = false;
	export var pSupportedExtensionList: string[] = null;
	// var pLoadedExtensionList: Object = null;

    function makeDebugContext(pWebGLContext: WebGLRenderingContext): WebGLRenderingContext {
        if (isDef((<any>window).WebGLDebugUtils)) {
            pWebGLContext = WebGLDebugUtils.makeDebugContext(pWebGLContext, 
                (err: int, funcName: string, args: IArguments): void => {
                    debug_print(__CALLSTACK__);
                    throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
                },
                (funcName: string, args: IArguments): void => {   
                   LOG("gl." + funcName + "(" + WebGLDebugUtils.glFunctionArgsToString(funcName, args) + ")");   
                });
        }

        return pWebGLContext;
    }

    export function loadExtension(pWebGLContext: WebGLRenderingContext, sExtName: string): bool {
        var pWebGLExtentionList: Object = (<any>pWebGLContext).extentionList = (<any>pWebGLContext).extentionList || {};
        var pWebGLExtension: Object;

        if (!hasExtension(sExtName)) {
            WARNING("Extension " + sExtName + " unsupported for this platform.");
            return false;
        }

        if (pWebGLExtension = pWebGLContext.getExtension(sExtName)) {
            
            if (isDefAndNotNull(pWebGLExtentionList[sExtName])) {
                debug_print("Extension " + sExtName + " already loaded for this context.");
                return true;
            }

            pWebGLExtentionList[sExtName] = pWebGLExtension;

            debug_print("loaded WebGL extension: ", sExtName);

            for (var j in pWebGLExtension) {
                if (isFunction(pWebGLExtension[j])) {
                    //debug_print("created func WebGLRenderingContext::" + j + "(...)");
                    pWebGLContext[j] = function () {
                        pWebGLContext[j] = new Function(
                            "var t = this.extentionList[" + sExtName + "];" + 
                            "t." + j + ".apply(t, arguments);");
                    }

                }
                else {
                    //debug_print("created const WebGLRenderingContext::" + j + " = " + pWebGLExtension[j]);
                    pWebGLContext[j] = pWebGLExtension[j];
                }
            }

            return true;
        }

        WARNING("cannot load extension: ", sExtName);
        return false;
    }


    function checkIsAngle(pWebGLContext: WebGLRenderingContext): bool {
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

        var pVertexShader: WebGLShader = pWebGLContext.createShader(GL_VERTEX_SHADER);
        var pFragmentShader: WebGLShader = pWebGLContext.createShader(GL_FRAGMENT_SHADER);

        pWebGLContext.shaderSource(pVertexShader, sVertex);
        pWebGLContext.compileShader(pVertexShader);
        pWebGLContext.shaderSource(pFragmentShader, sFragment);
        pWebGLContext.compileShader(pFragmentShader);  

        pWebGLContext.attachShader(pProgram, pVertexShader);
        pWebGLContext.attachShader(pProgram, pFragmentShader);

        pWebGLContext.linkProgram(pProgram);

        if (!pWebGLContext.getProgramParameter(pProgram, GL_LINK_STATUS)) {
            debug_error("cannot compile GLSL shader for ANGLE renderer");
            
            debug_print(pWebGLContext.getShaderInfoLog(pVertexShader));
            debug_print(pWebGLContext.getShaderSource(pVertexShader) || sVertex);

            debug_print(pWebGLContext.getShaderInfoLog(pFragmentShader));
            debug_print(pWebGLContext.getShaderSource(pFragmentShader) || sFragment);
            
            return false;
        }

        return pWebGLContext.getProgramParameter(pProgram, GL_ACTIVE_UNIFORMS) == 1 && 
            pWebGLContext.getActiveUniform(pProgram, 0).name != "s[0].b[0]";
    }

    function setupContext(pWebGLContext: WebGLRenderingContext): WebGLRenderingContext {     
        //test context not created yet
        if (isNull(pSupportedExtensionList)) {
            return pWebGLContext;
        }

        for (var i: int = 0; i < pSupportedExtensionList.length; ++ i) {
            if (!loadExtension(pWebGLContext, pSupportedExtensionList[i])) {
                pSupportedExtensionList.splice(i, 1);
            }
        }
         
        return pWebGLContext;
    }

    export var isEnabled = (): bool => isSupported;

    export function createContext(
            pCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.createElement("canvas"), 
            pOptions?: { antialias?: bool; }): WebGLRenderingContext {

    	var pWebGLContext: WebGLRenderingContext = null;
		
		try {
			pWebGLContext = pCanvas.getContext("webgl", pOptions) || 
				pCanvas.getContext("experimental-webgl", pOptions);
    	}
		catch (e) {}

		if (isDefAndNotNull(pWebGLContext)) {
#ifdef WEBGL_DEBUG
            return makeDebugContext(setupContext(pWebGLContext));
#else
            return setupContext(pWebGLContext);
#endif            
		}
        
        debug_warning("cannot get 3d device");
        
		return null;
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
	    //pSupportedExtensionList.push(WEBGL_DEBUG_SHADERS, WEBGL_DEBUG_RENDERER_INFO);
#endif
        isSupported = true;

        isANGLE = checkIsAngle(pWebGLContext);

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


	export function getWebGLFormat(eFormat: EPixelFormats): int {
	
        switch(eFormat)
        {
			case EPixelFormats.L8:              
            case EPixelFormats.L16:     
                return GL_LUMINANCE;

            case EPixelFormats.A8:
                return GL_ALPHA;           

            case EPixelFormats.A4L4: 
            case EPixelFormats.BYTE_LA:
                return GL_LUMINANCE_ALPHA;       
   
            case EPixelFormats.R5G6B5:
                return 0;          
            case EPixelFormats.B5G6R5:
                return GL_RGB;          
            case EPixelFormats.R3G3B2:
                return 0;
            case EPixelFormats.A4R4G4B4:
            case EPixelFormats.A1R5G5B5:
                return GL_RGBA;  

            case EPixelFormats.R8G8B8:
                return 0;
            case EPixelFormats.B8G8R8:         
                return GL_RGB;       
            case EPixelFormats.A8R8G8B8:
                return 0;
            case EPixelFormats.A8B8G8R8:
                return GL_RGBA;       
            case EPixelFormats.B8G8R8A8:       
            case EPixelFormats.R8G8B8A8:       
            case EPixelFormats.X8R8G8B8:   
                return 0;     
            case EPixelFormats.X8B8G8R8:
               return GL_RGBA; 

            case EPixelFormats.A2R10G10B10:
                return 0;
            case EPixelFormats.A2B10G10R10:
                return GL_RGBA; 

            case EPixelFormats.DXT1:  
                return GL_COMPRESSED_RGBA_S3TC_DXT1_EXT;         
            case EPixelFormats.DXT2:   
                return 0;        
            case EPixelFormats.DXT3:    
                return GL_COMPRESSED_RGBA_S3TC_DXT3_EXT;       
            case EPixelFormats.DXT4:  
                return 0;         
            case EPixelFormats.DXT5:
                return GL_COMPRESSED_RGBA_S3TC_DXT5_EXT;
            case EPixelFormats.FLOAT16_R:
                return 0;    
            case EPixelFormats.FLOAT16_RGB:
                return GL_RGB;  
            case EPixelFormats.FLOAT16_RGBA:
                 return GL_RGBA;  
            case EPixelFormats.FLOAT32_R:
                return 0;      
            case EPixelFormats.FLOAT32_RGB:
                return GL_RGB;
            case EPixelFormats.FLOAT32_RGBA:
                return GL_RGBA;
            case EPixelFormats.FLOAT16_GR:   
            case EPixelFormats.FLOAT32_GR:
                return 0;   

            case EPixelFormats.FLOAT32_DEPTH:  
            case EPixelFormats.DEPTH32:         
            case EPixelFormats.DEPTH16:
            case EPixelFormats.DEPTH8:
                return GL_DEPTH_COMPONENT;

            case EPixelFormats.DEPTH24STENCIL8:
                return GL_DEPTH_STENCIL;

            case EPixelFormats.SHORT_RGBA:  
                return GL_RGBA;  
            case EPixelFormats.SHORT_GR: 
                return 0;      
            case EPixelFormats.SHORT_RGB: 
                return GL_RGB; 

            case EPixelFormats.PVRTC_RGB2:     
                return GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG
            case EPixelFormats.PVRTC_RGBA2:   
                return GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG  
            case EPixelFormats.PVRTC_RGB4:    
                return GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG
            case EPixelFormats.PVRTC_RGBA4:  
                return GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG; 
            
            case EPixelFormats.R8:         
            case EPixelFormats.RG8:            
                return 0;    

            default:
                WARNING("getWebGLFormat unknown format",eFormat);
                return 0;    
        }
             
	}

    export function isWebGLFormatSupport(eFormat: EPixelFormats):bool
    {
        switch(eFormat)
        {
            case EPixelFormats.DXT1:        
            case EPixelFormats.DXT3:        
            case EPixelFormats.DXT5:
                return webgl.hasExtension(WEBGL_COMPRESSED_TEXTURE_S3TC);
            case EPixelFormats.PVRTC_RGB2:     
            case EPixelFormats.PVRTC_RGBA2:    
            case EPixelFormats.PVRTC_RGB4:    
            case EPixelFormats.PVRTC_RGBA4:  
                return webgl.hasExtension(WEBGL_COMPRESSED_TEXTURE_PVRTC);
            case EPixelFormats.DEPTH32:         
            case EPixelFormats.DEPTH16:
            case EPixelFormats.DEPTH24STENCIL8: 
                return webgl.hasExtension(WEBGL_DEPTH_TEXTURE);
            case EPixelFormats.DEPTH32:         
            case EPixelFormats.DEPTH16:
            case EPixelFormats.DEPTH24STENCIL8: 
                return webgl.hasExtension(WEBGL_DEPTH_TEXTURE);
            case EPixelFormats.FLOAT16_RGB:
            case EPixelFormats.FLOAT16_RGBA:
                 return webgl.hasExtension(OES_TEXTURE_HALF_FLOAT);  
            case EPixelFormats.FLOAT32_RGB:
            case EPixelFormats.FLOAT32_RGBA:
                 return webgl.hasExtension(OES_TEXTURE_FLOAT);

        }
        
        if(getWebGLFormat(eFormat)&&getWebGLDataType(eFormat))
        {
            switch(eFormat)
            {
                case EPixelFormats.FLOAT32_DEPTH:
                case EPixelFormats.L16:
                    return false;
            }
            return true;
        }

        return false;
    }


	export function getWebGLDataType(eFormat: EPixelFormats): int {
		switch(eFormat)
        {
            case EPixelFormats.L8:
                return GL_UNSIGNED_BYTE;           
            case EPixelFormats.L16:     
                return GL_UNSIGNED_SHORT;

            case EPixelFormats.A8:
                return GL_UNSIGNED_BYTE;           

            case EPixelFormats.A4L4: 
                return 0;
            case EPixelFormats.BYTE_LA:
                return GL_UNSIGNED_BYTE;       
   
            case EPixelFormats.R5G6B5:
            case EPixelFormats.B5G6R5:
                return GL_UNSIGNED_SHORT_5_6_5;            
            case EPixelFormats.R3G3B2:
                return 0;
            case EPixelFormats.A4R4G4B4:
                return GL_UNSIGNED_SHORT_4_4_4_4;
            case EPixelFormats.A1R5G5B5:
                return GL_UNSIGNED_SHORT_5_5_5_1;  

            case EPixelFormats.R8G8B8:
            case EPixelFormats.B8G8R8:         
            case EPixelFormats.A8R8G8B8:
            case EPixelFormats.A8B8G8R8:
            case EPixelFormats.B8G8R8A8:       
            case EPixelFormats.R8G8B8A8:       
            case EPixelFormats.X8R8G8B8:  
            case EPixelFormats.X8B8G8R8:
               return GL_UNSIGNED_BYTE; 

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
                 return GL_HALF_FLOAT_OES;  

            case EPixelFormats.FLOAT32_R: 
            case EPixelFormats.FLOAT32_RGB:
            case EPixelFormats.FLOAT32_RGBA:
            case EPixelFormats.FLOAT16_GR:   
            case EPixelFormats.FLOAT32_GR:
                return GL_FLOAT;   

            case EPixelFormats.FLOAT32_DEPTH:
                return GL_FLOAT; 

            case EPixelFormats.DEPTH8:
                return GL_UNSIGNED_BYTE;
            case EPixelFormats.DEPTH16:
                return GL_UNSIGNED_SHORT;
            case EPixelFormats.DEPTH32:
                return GL_UNSIGNED_INT;
            case EPixelFormats.DEPTH24STENCIL8:
                return GL_UNSIGNED_INT_24_8_WEBGL;

            case EPixelFormats.SHORT_RGBA:  
            case EPixelFormats.SHORT_GR: 
            case EPixelFormats.SHORT_RGB: 
               return GL_UNSIGNED_SHORT; 

            case EPixelFormats.PVRTC_RGB2:     
            case EPixelFormats.PVRTC_RGBA2:    
            case EPixelFormats.PVRTC_RGB4:    
            case EPixelFormats.PVRTC_RGBA4:  
                return 0; 

            case EPixelFormats.R8:         
            case EPixelFormats.RG8:            
                return GL_UNSIGNED_BYTE;    

            default:
                CRITICAL_ERROR("getWebGLFormat unknown format");
                return 0;    
        }
	}



	export function getWebGLInternalFormat(eFormat: EPixelFormats): int 
    {
        if(!pixelUtil.isCompressed(eFormat))
        {
            return getWebGLFormat(eFormat);
        }
        else
        {
            switch(eFormat)
            {
                case EPixelFormats.DXT1:  
                    return GL_COMPRESSED_RGBA_S3TC_DXT1_EXT;         
                case EPixelFormats.DXT2:   
                    return 0;        
                case EPixelFormats.DXT3:    
                    return GL_COMPRESSED_RGBA_S3TC_DXT3_EXT;       
                case EPixelFormats.DXT4:  
                    return 0;         
                case EPixelFormats.DXT5:
                    return GL_COMPRESSED_RGBA_S3TC_DXT5_EXT;
                case EPixelFormats.PVRTC_RGB2:     
                    return GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG
                case EPixelFormats.PVRTC_RGBA2:   
                    return GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG  
                case EPixelFormats.PVRTC_RGB4:    
                    return GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG
                case EPixelFormats.PVRTC_RGBA4:  
                    return GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG; 
            }
        }
    }

    export function getWebGLPrimitiveType(eType: EPrimitiveTypes): int {
        switch (eType) {
            case EPrimitiveTypes.POINTLIST: 
                return GL_POINTS;
            case EPrimitiveTypes.LINELIST: 
                return GL_LINES;
            case EPrimitiveTypes.LINELOOP: 
                return GL_LINE_LOOP;
            case EPrimitiveTypes.LINESTRIP: 
                return GL_LINE_STRIP;
            case EPrimitiveTypes.TRIANGLELIST: 
                return GL_TRIANGLES;
            case EPrimitiveTypes.TRIANGLESTRIP: 
                return GL_TRIANGLE_STRIP;
            case EPrimitiveTypes.TRIANGLEFAN: 
                return GL_TRIANGLE_FAN;
        }

        return GL_POINTS;
    }

    //не знаю что делает эта функция
    export function getClosestWebGLInternalFormat(eFormat: EPixelFormats, isHWGamma?: bool = false): int {
        var iGLFormat:int = webgl.getWebGLInternalFormat(eFormat);
        
        if (iGLFormat === GL_NONE) 
        {
            if (isHWGamma) {
                // TODO not supported
                return 0;
            }
            else {
                return GL_RGBA;
            }
        }
        else 
        {
            return iGLFormat;
        }
    }

    /**
     * Convert GL format to EPixelFormat.
     */
    export function getClosestAkraFormat(iGLFormat: int, iGLDataType: int): EPixelFormats {
        switch (iGLFormat) {

            case GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG:
                return webgl.hasExtension(WEBGL_COMPRESSED_TEXTURE_PVRTC) ? EPixelFormats.PVRTC_RGB2 : EPixelFormats.A8R8G8B8;
            case GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG:
                return webgl.hasExtension(WEBGL_COMPRESSED_TEXTURE_PVRTC) ? EPixelFormats.PVRTC_RGBA2 : EPixelFormats.A8R8G8B8;
            case GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG:
                return webgl.hasExtension(WEBGL_COMPRESSED_TEXTURE_PVRTC) ? EPixelFormats.PVRTC_RGB4 : EPixelFormats.A8R8G8B8;
            case GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG:
                return webgl.hasExtension(WEBGL_COMPRESSED_TEXTURE_PVRTC) ? EPixelFormats.PVRTC_RGBA4 : EPixelFormats.A8R8G8B8;

            case GL_LUMINANCE:
                return EPixelFormats.L8;
            case GL_ALPHA:
                return EPixelFormats.A8;
            case GL_LUMINANCE_ALPHA:
                return EPixelFormats.BYTE_LA;
                
            case GL_RGB:
                switch(iGLDataType) {
	                case GL_UNSIGNED_SHORT_5_6_5:
	                    return EPixelFormats.B5G6R5;
	                default:
	                    return EPixelFormats.R8G8B8;
            	}
            case GL_RGBA:
                switch(iGLDataType) {
	                case GL_UNSIGNED_SHORT_5_5_5_1:
	                    return EPixelFormats.A1R5G5B5;
	                case GL_UNSIGNED_SHORT_4_4_4_4:
	                    return EPixelFormats.A4R4G4B4;
	                default:
	                    return EPixelFormats.A8B8G8R8;
	            }

            case GL_BGRA:
                return EPixelFormats.A8B8G8R8;

            case GL_COMPRESSED_RGB_S3TC_DXT1_EXT:
            case GL_COMPRESSED_RGBA_S3TC_DXT1_EXT:
                return webgl.hasExtension(WEBGL_COMPRESSED_TEXTURE_S3TC) ? EPixelFormats.DXT1 : EPixelFormats.A8R8G8B8;

            case GL_COMPRESSED_RGBA_S3TC_DXT3_EXT:
                return webgl.hasExtension(WEBGL_COMPRESSED_TEXTURE_S3TC) ? EPixelFormats.DXT3 : EPixelFormats.A8R8G8B8;
            case GL_COMPRESSED_RGBA_S3TC_DXT5_EXT:
                return webgl.hasExtension(WEBGL_COMPRESSED_TEXTURE_S3TC) ? EPixelFormats.DXT5 : EPixelFormats.A8R8G8B8;
      
            case GL_R8_EXT:
                return webgl.hasExtension(EXT_TEXTURE_RG) ? EPixelFormats.R8 : EPixelFormats.A8R8G8B8;
            case GL_RG8_EXT:
                return webgl.hasExtension(EXT_TEXTURE_RG) ? EPixelFormats.RG8 : EPixelFormats.A8R8G8B8;

            default:
                //TODO: not supported
                return EPixelFormats.A8R8G8B8;
        }
    }

    export function optionalPO2(iValue: uint) : uint {
        if (webgl.hasNonPowerOf2Textures) {
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

            for(z = pSource.front; z < pSource.back; z++) {
                for(y = pSource.top; y < pSource.bottom; y++) {
                    for(x = 0; x < k; x++) {
                        pDest[iDstPtr + x] = ((pSource[iSrcPtr + x]&0x000F)<<12) |   /* B*/
                                    		 ((pSource[iSrcPtr + x]&0x00F0)<<4)  |   /* G*/
                                    		 ((pSource[iSrcPtr + x]&0x0F00)>>4)  |   /* R*/
                                    	     ((pSource[iSrcPtr + x]&0xF000)>>12);    /* A*/
                    }

                    iSrcPtr += pSource.rowPitch;
                    iDstPtr += pDest.rowPitch;
                }

                iSrcPtr += iSrcSliceSkip;
                iDstPtr += iDstSliceSkip;
            }    
        }	
	}

	export function checkFBOAttachmentFormat(eFormat: EPixelFormats): bool {
		return false;
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

        if (checkFBOAttachmentFormat(eFormat)){
            return eFormat;
        }

        /// If none at all, return to default
		return EPixelFormats.A8R8G8B8;
	}

}

#endif