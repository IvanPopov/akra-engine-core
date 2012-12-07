#ifndef WEBGL_TS
#define WEBGL_TS

#include "IPixelBox.ts"
#include "PixelFormat.ts"
#include "common.ts"
/* ClearBufferMask */
#define GL_DEPTH_BUFFER_BIT               0x00000100
#define GL_STENCIL_BUFFER_BIT             0x00000400
#define GL_COLOR_BUFFER_BIT               0x00004000

/* BeginMode */
#define GL_POINTS                         0x0000
#define GL_LINES                          0x0001
#define GL_LINE_LOOP                      0x0002
#define GL_LINE_STRIP                     0x0003
#define GL_TRIANGLES                      0x0004
#define GL_TRIANGLE_STRIP                 0x0005
#define GL_TRIANGLE_FAN                   0x0006

/* AlphaFunction (not supported in ES20) */
/*      NEVER */
/*      LESS */
/*      EQUAL */
/*      LEQUAL */
/*      GREATER */
/*      NOTEQUAL */
/*      GEQUAL */
/*      ALWAYS */

/* BlendingFactorDest */
#define GL_ZERO                           0
#define GL_ONE                            1
#define GL_SRC_COLOR                      0x0300
#define GL_ONE_MINUS_SRC_COLOR            0x0301
#define GL_SRC_ALPHA                      0x0302
#define GL_ONE_MINUS_SRC_ALPHA            0x0303
#define GL_DST_ALPHA                      0x0304
#define GL_ONE_MINUS_DST_ALPHA            0x0305

/* BlendingFactorSrc */
/*      ZERO */
/*      ONE */
#define GL_DST_COLOR                      0x0306
#define GL_ONE_MINUS_DST_COLOR            0x0307
#define GL_SRC_ALPHA_SATURATE             0x0308
/*      SRC_ALPHA */
/*      ONE_MINUS_SRC_ALPHA */
/*      DST_ALPHA */
/*      ONE_MINUS_DST_ALPHA */

/* BlendEquationSeparate */
#define GL_FUNC_ADD                       0x8006
#define GL_BLEND_EQUATION                 0x8009
#define GL_BLEND_EQUATION_RGB             0x8009   /* same as BLEND_EQUATION */
#define GL_BLEND_EQUATION_ALPHA           0x883D

/* BlendSubtract */
#define GL_FUNC_SUBTRACT                  0x800A
#define GL_FUNC_REVERSE_SUBTRACT          0x800B

/* Separate Blend Functions */
#define GL_BLEND_DST_RGB                  0x80C8
#define GL_BLEND_SRC_RGB                  0x80C9
#define GL_BLEND_DST_ALPHA                0x80CA
#define GL_BLEND_SRC_ALPHA                0x80CB
#define GL_CONSTANT_COLOR                 0x8001
#define GL_ONE_MINUS_CONSTANT_COLOR       0x8002
#define GL_CONSTANT_ALPHA                 0x8003
#define GL_ONE_MINUS_CONSTANT_ALPHA       0x8004
#define GL_BLEND_COLOR                    0x8005

/* Buffer Objects */
#define GL_ARRAY_BUFFER                   0x8892
#define GL_ELEMENT_ARRAY_BUFFER           0x8893
#define GL_ARRAY_BUFFER_BINDING           0x8894
#define GL_ELEMENT_ARRAY_BUFFER_BINDING   0x8895

#define GL_STREAM_DRAW                    0x88E0
#define GL_STATIC_DRAW                    0x88E4
#define GL_DYNAMIC_DRAW                   0x88E8

#define GL_BUFFER_SIZE                    0x8764
#define GL_BUFFER_USAGE                   0x8765

#define GL_CURRENT_VERTEX_ATTRIB          0x8626

/* CullFaceMode */
#define GL_FRONT                          0x0404
#define GL_BACK                           0x0405
#define GL_FRONT_AND_BACK                 0x0408

/* DepthFunction */
/*      NEVER */
/*      LESS */
/*      EQUAL */
/*      LEQUAL */
/*      GREATER */
/*      NOTEQUAL */
/*      GEQUAL */
/*      ALWAYS */

/* EnableCap */
/* TEXTURE_2D */
#define GL_CULL_FACE                      0x0B44
#define GL_BLEND                          0x0BE2
#define GL_DITHER                         0x0BD0
#define GL_STENCIL_TEST                   0x0B90
#define GL_DEPTH_TEST                     0x0B71
#define GL_SCISSOR_TEST                   0x0C11
#define GL_POLYGON_OFFSET_FILL            0x8037
#define GL_SAMPLE_ALPHA_TO_COVERAGE       0x809E
#define GL_SAMPLE_COVERAGE                0x80A0

/* ErrorCode */
#define GL_NO_ERROR                       0
#define GL_INVALID_ENUM                   0x0500
#define GL_INVALID_VALUE                  0x0501
#define GL_INVALID_OPERATION              0x0502
#define GL_OUT_OF_MEMORY                  0x0505

/* FrontFaceDirection */
#define GL_CW                             0x0900
#define GL_CCW                            0x0901

/* GetPName */
#define GL_LINE_WIDTH                     0x0B21
#define GL_ALIASED_POINT_SIZE_RANGE       0x846D
#define GL_ALIASED_LINE_WIDTH_RANGE       0x846E
#define GL_CULL_FACE_MODE                 0x0B45
#define GL_FRONT_FACE                     0x0B46
#define GL_DEPTH_RANGE                    0x0B70
#define GL_DEPTH_WRITEMASK                0x0B72
#define GL_DEPTH_CLEAR_VALUE              0x0B73
#define GL_DEPTH_FUNC                     0x0B74
#define GL_STENCIL_CLEAR_VALUE            0x0B91
#define GL_STENCIL_FUNC                   0x0B92
#define GL_STENCIL_FAIL                   0x0B94
#define GL_STENCIL_PASS_DEPTH_FAIL        0x0B95
#define GL_STENCIL_PASS_DEPTH_PASS        0x0B96
#define GL_STENCIL_REF                    0x0B97
#define GL_STENCIL_VALUE_MASK             0x0B93
#define GL_STENCIL_WRITEMASK              0x0B98
#define GL_STENCIL_BACK_FUNC              0x8800
#define GL_STENCIL_BACK_FAIL              0x8801
#define GL_STENCIL_BACK_PASS_DEPTH_FAIL   0x8802
#define GL_STENCIL_BACK_PASS_DEPTH_PASS   0x8803
#define GL_STENCIL_BACK_REF               0x8CA3
#define GL_STENCIL_BACK_VALUE_MASK        0x8CA4
#define GL_STENCIL_BACK_WRITEMASK         0x8CA5
#define GL_VIEWPORT                       0x0BA2
#define GL_SCISSOR_BOX                    0x0C10
/*      SCISSOR_TEST */
#define GL_COLOR_CLEAR_VALUE              0x0C22
#define GL_COLOR_WRITEMASK                0x0C23
#define GL_UNPACK_ALIGNMENT               0x0CF5
#define GL_PACK_ALIGNMENT                 0x0D05
#define GL_MAX_TEXTURE_SIZE               0x0D33
#define GL_MAX_VIEWPORT_DIMS              0x0D3A
#define GL_SUBPIXEL_BITS                  0x0D50
#define GL_RED_BITS                       0x0D52
#define GL_GREEN_BITS                     0x0D53
#define GL_BLUE_BITS                      0x0D54
#define GL_ALPHA_BITS                     0x0D55
#define GL_DEPTH_BITS                     0x0D56
#define GL_STENCIL_BITS                   0x0D57
#define GL_POLYGON_OFFSET_UNITS           0x2A00
/*      POLYGON_OFFSET_FILL */
#define GL_POLYGON_OFFSET_FACTOR          0x8038
#define GL_TEXTURE_BINDING_2D             0x8069
#define GL_SAMPLE_BUFFERS                 0x80A8
#define GL_SAMPLES                        0x80A9
#define GL_SAMPLE_COVERAGE_VALUE          0x80AA
#define GL_SAMPLE_COVERAGE_INVERT         0x80AB

/* GetTextureParameter */
/*      TEXTURE_MAG_FILTER */
/*      TEXTURE_MIN_FILTER */
/*      TEXTURE_WRAP_S */
/*      TEXTURE_WRAP_T */

#define GL_COMPRESSED_TEXTURE_FORMATS     0x86A3

/* HintMode */
#define GL_DONT_CARE                      0x1100
#define GL_FASTEST                        0x1101
#define GL_NICEST                         0x1102

/* HintTarget */
#define GL_GENERATE_MIPMAP_HINT            0x8192

/* DataType */
#define GL_BYTE                           0x1400
#define GL_UNSIGNED_BYTE                  0x1401
#define GL_SHORT                          0x1402
#define GL_UNSIGNED_SHORT                 0x1403
#define GL_INT                            0x1404
#define GL_UNSIGNED_INT                   0x1405
#define GL_FLOAT                          0x1406
#define GL_UNSIGNED_INT_8_8_8_8_REV       0x8367

/* PixelFormat */
#define GL_DEPTH_COMPONENT                0x1902
#define GL_ALPHA                          0x1906
#define GL_RGB                            0x1907
#define GL_RGBA                           0x1908
#define GL_BGR 							  0x80E0 
#define GL_BGRA 						  0x80E1
#define GL_LUMINANCE                      0x1909
#define GL_LUMINANCE_ALPHA                0x190A

/* PixelType */
/*      UNSIGNED_BYTE */
#define GL_UNSIGNED_SHORT_4_4_4_4         0x8033
#define GL_UNSIGNED_SHORT_5_5_5_1         0x8034
#define GL_UNSIGNED_SHORT_5_6_5           0x8363

/* Shaders */
#define GL_FRAGMENT_SHADER                  0x8B30
#define GL_VERTEX_SHADER                    0x8B31
#define GL_MAX_VERTEX_ATTRIBS               0x8869
#define GL_MAX_VERTEX_UNIFORM_VECTORS       0x8DFB
#define GL_MAX_VARYING_VECTORS              0x8DFC
#define GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS 0x8B4D
#define GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS   0x8B4C
#define GL_MAX_TEXTURE_IMAGE_UNITS          0x8872
#define GL_MAX_FRAGMENT_UNIFORM_VECTORS     0x8DFD
#define GL_SHADER_TYPE                      0x8B4F
#define GL_DELETE_STATUS                    0x8B80
#define GL_LINK_STATUS                      0x8B82
#define GL_VALIDATE_STATUS                  0x8B83
#define GL_ATTACHED_SHADERS                 0x8B85
#define GL_ACTIVE_UNIFORMS                  0x8B86
#define GL_ACTIVE_ATTRIBUTES                0x8B89
#define GL_SHADING_LANGUAGE_VERSION         0x8B8C
#define GL_CURRENT_PROGRAM                  0x8B8D

/* StencilFunction */
#define GL_NEVER                          0x0200
#define GL_LESS                           0x0201
#define GL_EQUAL                          0x0202
#define GL_LEQUAL                         0x0203
#define GL_GREATER                        0x0204
#define GL_NOTEQUAL                       0x0205
#define GL_GEQUAL                         0x0206
#define GL_ALWAYS                         0x0207

/* StencilOp */
/*      ZERO */
#define GL_KEEP                           0x1E00
#define GL_REPLACE                        0x1E01
#define GL_INCR                           0x1E02
#define GL_DECR                           0x1E03
#define GL_INVERT                         0x150A
#define GL_INCR_WRAP                      0x8507
#define GL_DECR_WRAP                      0x8508

/* StringName */
#define GL_VENDOR                         0x1F00
#define GL_RENDERER                       0x1F01
#define GL_VERSION                        0x1F02

/* TextureMagFilter */
#define GL_NEAREST                        0x2600
#define GL_LINEAR                         0x2601

/* TextureMinFilter */
/*      NEAREST */
/*      LINEAR */
#define GL_NEAREST_MIPMAP_NEAREST         0x2700
#define GL_LINEAR_MIPMAP_NEAREST          0x2701
#define GL_NEAREST_MIPMAP_LINEAR          0x2702
#define GL_LINEAR_MIPMAP_LINEAR           0x2703

/* TextureParameterName */
#define GL_TEXTURE_MAG_FILTER             0x2800
#define GL_TEXTURE_MIN_FILTER             0x2801
#define GL_TEXTURE_WRAP_S                 0x2802
#define GL_TEXTURE_WRAP_T                 0x2803

/* TextureTarget */
#define GL_TEXTURE_2D                     0x0DE1
#define GL_TEXTURE                        0x1702

#define GL_TEXTURE_CUBE_MAP               0x8513
#define GL_TEXTURE_BINDING_CUBE_MAP       0x8514
#define GL_TEXTURE_CUBE_MAP_POSITIVE_X    0x8515
#define GL_TEXTURE_CUBE_MAP_NEGATIVE_X    0x8516
#define GL_TEXTURE_CUBE_MAP_POSITIVE_Y    0x8517
#define GL_TEXTURE_CUBE_MAP_NEGATIVE_Y    0x8518
#define GL_TEXTURE_CUBE_MAP_POSITIVE_Z    0x8519
#define GL_TEXTURE_CUBE_MAP_NEGATIVE_Z    0x851A
#define GL_MAX_CUBE_MAP_TEXTURE_SIZE      0x851C

/* TextureUnit */
#define GL_TEXTURE0                       0x84C0
#define GL_TEXTURE1                       0x84C1
#define GL_TEXTURE2                       0x84C2
#define GL_TEXTURE3                       0x84C3
#define GL_TEXTURE4                       0x84C4
#define GL_TEXTURE5                       0x84C5
#define GL_TEXTURE6                       0x84C6
#define GL_TEXTURE7                       0x84C7
#define GL_TEXTURE8                       0x84C8
#define GL_TEXTURE9                       0x84C9
#define GL_TEXTURE10                      0x84CA
#define GL_TEXTURE11                      0x84CB
#define GL_TEXTURE12                      0x84CC
#define GL_TEXTURE13                      0x84CD
#define GL_TEXTURE14                      0x84CE
#define GL_TEXTURE15                      0x84CF
#define GL_TEXTURE16                      0x84D0
#define GL_TEXTURE17                      0x84D1
#define GL_TEXTURE18                      0x84D2
#define GL_TEXTURE19                      0x84D3
#define GL_TEXTURE20                      0x84D4
#define GL_TEXTURE21                      0x84D5
#define GL_TEXTURE22                      0x84D6
#define GL_TEXTURE23                      0x84D7
#define GL_TEXTURE24                      0x84D8
#define GL_TEXTURE25                      0x84D9
#define GL_TEXTURE26                      0x84DA
#define GL_TEXTURE27                      0x84DB
#define GL_TEXTURE28                      0x84DC
#define GL_TEXTURE29                      0x84DD
#define GL_TEXTURE30                      0x84DE
#define GL_TEXTURE31                      0x84DF
#define GL_ACTIVE_TEXTURE                 0x84E0

/* TextureWrapMode */
#define GL_REPEAT                         0x2901
#define GL_CLAMP_TO_EDGE                  0x812F
#define GL_MIRRORED_REPEAT                0x8370

/* Uniform Types */
#define GL_FLOAT_VEC2                     0x8B50
#define GL_FLOAT_VEC3                     0x8B51
#define GL_FLOAT_VEC4                     0x8B52
#define GL_INT_VEC2                       0x8B53
#define GL_INT_VEC3                       0x8B54
#define GL_INT_VEC4                       0x8B55
#define GL_BOOL                           0x8B56
#define GL_BOOL_VEC2                      0x8B57
#define GL_BOOL_VEC3                      0x8B58
#define GL_BOOL_VEC4                      0x8B59
#define GL_FLOAT_MAT2                     0x8B5A
#define GL_FLOAT_MAT3                     0x8B5B
#define GL_FLOAT_MAT4                     0x8B5C
#define GL_SAMPLER_2D                     0x8B5E
#define GL_SAMPLER_CUBE                   0x8B60

/* Vertex Arrays */
#define GL_VERTEX_ATTRIB_ARRAY_ENABLED        0x8622
#define GL_VERTEX_ATTRIB_ARRAY_SIZE           0x8623
#define GL_VERTEX_ATTRIB_ARRAY_STRIDE         0x8624
#define GL_VERTEX_ATTRIB_ARRAY_TYPE           0x8625
#define GL_VERTEX_ATTRIB_ARRAY_NORMALIZED     0x886A
#define GL_VERTEX_ATTRIB_ARRAY_POINTER        0x8645
#define GL_VERTEX_ATTRIB_ARRAY_BUFFER_BINDING 0x889F

/* Shader Source */
#define GL_COMPILE_STATUS                 0x8B81

/* Shader Precision-Specified Types */
#define GL_LOW_FLOAT                      0x8DF0
#define GL_MEDIUM_FLOAT                   0x8DF1
#define GL_HIGH_FLOAT                     0x8DF2
#define GL_LOW_INT                        0x8DF3
#define GL_MEDIUM_INT                     0x8DF4
#define GL_HIGH_INT                       0x8DF5

/* Framebuffer Object. */
#define GL_FRAMEBUFFER                    0x8D40
#define GL_RENDERBUFFER                   0x8D41

#define GL_RGBA4                          0x8056
#define GL_RGB5_A1                        0x8057
#define GL_RGB565                         0x8D62
#define GL_DEPTH_COMPONENT16              0x81A5
#define GL_STENCIL_INDEX                  0x1901
#define GL_STENCIL_INDEX8                 0x8D48
#define GL_DEPTH_STENCIL                  0x84F9

#define GL_RENDERBUFFER_WIDTH             0x8D42
#define GL_RENDERBUFFER_HEIGHT            0x8D43
#define GL_RENDERBUFFER_INTERNAL_FORMAT   0x8D44
#define GL_RENDERBUFFER_RED_SIZE          0x8D50
#define GL_RENDERBUFFER_GREEN_SIZE        0x8D51
#define GL_RENDERBUFFER_BLUE_SIZE         0x8D52
#define GL_RENDERBUFFER_ALPHA_SIZE        0x8D53
#define GL_RENDERBUFFER_DEPTH_SIZE        0x8D54
#define GL_RENDERBUFFER_STENCIL_SIZE      0x8D55

#define GL_FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE           0x8CD0
#define GL_FRAMEBUFFER_ATTACHMENT_OBJECT_NAME           0x8CD1
#define GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL         0x8CD2
#define GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE 0x8CD3

#define GL_COLOR_ATTACHMENT0              0x8CE0
#define GL_DEPTH_ATTACHMENT               0x8D00
#define GL_STENCIL_ATTACHMENT             0x8D20
#define GL_DEPTH_STENCIL_ATTACHMENT       0x821A

#define GL_NONE                           0

#define GL_FRAMEBUFFER_COMPLETE                      0x8CD5
#define GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT         0x8CD6
#define GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT 0x8CD7
#define GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS         0x8CD9
#define GL_FRAMEBUFFER_UNSUPPORTED                   0x8CDD

#define GL_FRAMEBUFFER_BINDING            0x8CA6
#define GL_RENDERBUFFER_BINDING           0x8CA7
#define GL_MAX_RENDERBUFFER_SIZE          0x84E8

#define GL_INVALID_FRAMEBUFFER_OPERATION  0x0506

/* WebGL-specific enums */
#define GL_UNPACK_FLIP_Y_WEBGL            0x9240
#define GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL 0x9241
#define GL_CONTEXT_LOST_WEBGL             0x9242
#define GL_UNPACK_COLORSPACE_CONVERSION_WEBGL 0x9243
#define GL_BROWSER_DEFAULT_WEBGL          0x9244

#define GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG      0x8C00
#define GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG      0x8C01
#define GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG     0x8C02
#define GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG     0x8C03
#define GL_COMPRESSED_RGB_S3TC_DXT1_EXT         0x83F0
#define GL_COMPRESSED_RGBA_S3TC_DXT1_EXT        0x83F1
#define GL_COMPRESSED_RGBA_S3TC_DXT3_EXT        0x83F2
#define GL_COMPRESSED_RGBA_S3TC_DXT5_EXT        0x83F3
#define GL_RED_EXT                 				0x1903
#define GL_RG_EXT                  				0x8227
#define GL_R8_EXT                 					0x8229
#define GL_RG8_EXT                 				0x822B

#define GL_HALF_FLOAT_OES 						0x8D61


//WebGL Extensions 

#define OES_texture_float "OES_texture_float"
#define OES_texture_half_float "OES_texture_half_float"
#define OES_standard_derivatives "OES_standard_derivatives"
#define OES_vertex_array_object "OES_vertex_array_object"
#define OES_element_index_uint "OES_element_index_uint"
#define WEBGL_debug_renderer_info "WEBGL_debug_renderer_info"
#define WEBGL_debug_shaders "WEBGL_debug_shaders"
#define EXT_texture_filter_anisotropic "EXT_texture_filter_anisotropic"

//draft

#define WEBGL_lose_context "WEBGL_lose_context"
#define WEBGL_depth_texture "WEBGL_depth_texture"
#define WEBGL_compressed_texture_s3tc "WEBGL_compressed_texture_s3tc"
#define WEBGL_compressed_texture_atc "WEBGL_compressed_texture_atc"
#define WEBGL_compressed_texture_pvrtc "WEBGL_compressed_texture_pvrtc"
#define WEBGL_color_buffer_float "WEBGL_color_buffer_float"
#define EXT_color_buffer_half_float "EXT_color_buffer_half_float"

//Future
#define EXT_texture_rg "EXT_texture_rg"


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

	var pSupportedExtensionList: string[] = null;

    export function createContext(
            pCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.createElement("canvas"), 
            pOptions?: { antialias?: bool; }): WebGLRenderingContext {

    	var pContext: WebGLRenderingContext = null;
		
		try {
			pContext = pCanvas.getContext("webgl", pOptions) || 
				pCanvas.getContext("experimental-webgl", pOptions);
    	}
		catch (e) {}

		if (!pContext) {
			debug_warning("cannot get 3d device");
		}

		return pContext;
    }

	(function (pContext: WebGLRenderingContext): void {
		if (!pContext) {
			return;
		}

		maxTextureSize 					= pContext.getParameter(GL_MAX_TEXTURE_SIZE);
		maxCubeMapTextureSize 			= pContext.getParameter(GL_MAX_CUBE_MAP_TEXTURE_SIZE);
		maxViewPortSize 				= pContext.getParameter(GL_MAX_VIEWPORT_DIMS);

		maxTextureImageUnits 			= pContext.getParameter(GL_MAX_TEXTURE_IMAGE_UNITS);
		maxVertexAttributes 			= pContext.getParameter(GL_MAX_VERTEX_ATTRIBS);
		maxVertexTextureImageUnits 		= pContext.getParameter(GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS);
		maxCombinedTextureImageUnits 	= pContext.getParameter(GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS);

		stencilBits 					= pContext.getParameter(GL_STENCIL_BITS);
		colorBits 						= [
									        pContext.getParameter(GL_RED_BITS),
									        pContext.getParameter(GL_GREEN_BITS),
									        pContext.getParameter(GL_BLUE_BITS)
	   									];

	    alphaBits 						= pContext.getParameter(GL_ALPHA_BITS);
	    multisampleType 				= pContext.getParameter(GL_SAMPLE_COVERAGE_VALUE);

	    //TODO: real checking of possinility of using textures
	    hasNonPowerOf2Textures 			= false; 

	    pSupportedExtensionList = pContext.getSupportedExtensions();
	})(createContext());

	export function hasExtension(sExtName: string): bool {
		var i: uint = 0;
		for(i = 0; i < pSupportedExtensionList.length; i++){
			if(sExtName === pSupportedExtensionList[i]){
				return true;
			}
		}
		return false;
	}

	export function getWebGLOriginFormat(eFormat: EPixelFormats): int {
		switch(eFormat){
			case EPixelFormats.A8:
                return GL_ALPHA;

            case EPixelFormats.L8:
            case EPixelFormats.L16:
                return GL_LUMINANCE;
            
            case EPixelFormats.FLOAT16_RGB:
            	return webgl.hasExtension(OES_texture_half_float) ? GL_RGB : 0;

            case EPixelFormats.FLOAT16_RGBA:
            	return webgl.hasExtension(OES_texture_half_float) ? GL_RGBA : 0;

           	case EPixelFormats.FLOAT16_R:
            case EPixelFormats.R8:
                return webgl.hasExtension(EXT_texture_rg) ? GL_RED_EXT : 0;

            case EPixelFormats.FLOAT16_GR:
            case EPixelFormats.RG8:
                return webgl.hasExtension(EXT_texture_rg) ? GL_RG_EXT : 0;

            case EPixelFormats.BYTE_LA:
            case EPixelFormats.SHORT_GR:
                return GL_LUMINANCE_ALPHA;

            // PVRTC compressed formats
            case EPixelFormats.PVRTC_RGB2:
                return webgl.hasExtension(WEBGL_compressed_texture_pvrtc) ? GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG : 0;
            case EPixelFormats.PVRTC_RGB4:
                return webgl.hasExtension(WEBGL_compressed_texture_pvrtc) ? GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG : 0;
            case EPixelFormats.PVRTC_RGBA2:
                return webgl.hasExtension(WEBGL_compressed_texture_pvrtc) ? GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG : 0;
            case EPixelFormats.PVRTC_RGBA4:
                return webgl.hasExtension(WEBGL_compressed_texture_pvrtc) ? GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG : 0;

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
                return webgl.hasExtension(WEBGL_compressed_texture_s3tc) ? GL_COMPRESSED_RGBA_S3TC_DXT1_EXT : 0;

            case EPixelFormats.DXT3:
                return webgl.hasExtension(WEBGL_compressed_texture_s3tc) ? GL_COMPRESSED_RGBA_S3TC_DXT3_EXT : 0;

            case EPixelFormats.DXT5:
                return webgl.hasExtension(WEBGL_compressed_texture_s3tc) ? GL_COMPRESSED_RGBA_S3TC_DXT5_EXT : 0;

            case EPixelFormats.FLOAT32_GR:
            case EPixelFormats.FLOAT32_R:

            default:
                return 0;    
        }
             
	}

	export function getWebGLOriginDataType(eFormat: EPixelFormats): int {
		switch(eFormat){
			case EPixelFormats.A8:
            case EPixelFormats.L8:
            case EPixelFormats.L16:
            case EPixelFormats.R8G8B8:
            case EPixelFormats.B8G8R8:
            case EPixelFormats.BYTE_LA:
                return GL_UNSIGNED_BYTE;
            case EPixelFormats.R5G6B5:
            case EPixelFormats.B5G6R5:
                return GL_UNSIGNED_SHORT_5_6_5;
            case EPixelFormats.A4R4G4B4:
				return GL_UNSIGNED_SHORT_4_4_4_4;
            case EPixelFormats.A1R5G5B5:
                return GL_UNSIGNED_SHORT_5_5_5_1;
            
            case EPixelFormats.X8B8G8R8:
            case EPixelFormats.A8B8G8R8:
                return GL_UNSIGNED_INT_8_8_8_8_REV;
            case EPixelFormats.X8R8G8B8:
            case EPixelFormats.A8B8G8R8:
            case EPixelFormats.A8R8G8B8:
                return GL_UNSIGNED_INT_8_8_8_8_REV;
            case EPixelFormats.B8G8R8A8:
                return GL_UNSIGNED_BYTE;
            case EPixelFormats.R8G8B8A8:
                return GL_UNSIGNED_BYTE;

            case EPixelFormats.FLOAT16_R:
            case EPixelFormats.FLOAT16_GR:
            case EPixelFormats.FLOAT16_RGB:
            case EPixelFormats.FLOAT16_RGBA:
                return webgl.hasExtension(OES_texture_half_float) ? GL_HALF_FLOAT_OES : 0;

            case EPixelFormats.R8:
            case EPixelFormats.RG8:
                return webgl.hasExtension(EXT_texture_rg) ? GL_UNSIGNED_BYTE : 0;

            case EPixelFormats.FLOAT32_R:
            case EPixelFormats.FLOAT32_GR:
            case EPixelFormats.FLOAT32_RGB:
            case EPixelFormats.FLOAT32_RGBA:
                return GL_FLOAT;
            case EPixelFormats.DXT1:
            case EPixelFormats.DXT3:
            case EPixelFormats.DXT5:
            case EPixelFormats.R3G3B2:
            case EPixelFormats.A2R10G10B10:
            case EPixelFormats.A2B10G10R10:
            case EPixelFormats.SHORT_RGBA:
            case EPixelFormats.SHORT_RGB:
            case EPixelFormats.SHORT_GR:
                // TODO not supported
            default:
                return 0;
		}
	}

	export function getWebGLInternalFormat(eFormat: EPixelFormats, isHWGamma: bool): int {
        switch (eFormat) {
            case EPixelFormats.L8:
            case EPixelFormats.L16:
                return GL_LUMINANCE;

            case EPixelFormats.A8:
                return GL_ALPHA;

            case EPixelFormats.BYTE_LA:
                return GL_LUMINANCE_ALPHA;

            case EPixelFormats.PVRTC_RGB2:
                return webgl.hasExtension(WEBGL_compressed_texture_pvrtc) ? GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG : 0;
            case EPixelFormats.PVRTC_RGB4:
                return webgl.hasExtension(WEBGL_compressed_texture_pvrtc) ? GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG : 0;
            case EPixelFormats.PVRTC_RGBA2:
                return webgl.hasExtension(WEBGL_compressed_texture_pvrtc) ? GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG : 0;
            case EPixelFormats.PVRTC_RGBA4:
                return webgl.hasExtension(WEBGL_compressed_texture_pvrtc) ? GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG : 0;
                
            case EPixelFormats.X8B8G8R8:
            case EPixelFormats.X8R8G8B8:
			case EPixelFormats.A8B8G8R8:
            case EPixelFormats.A8R8G8B8:
            case EPixelFormats.B8G8R8A8:
            case EPixelFormats.A1R5G5B5:
            case EPixelFormats.A4R4G4B4:
                return GL_RGBA;
            case EPixelFormats.R5G6B5:
            case EPixelFormats.B5G6R5:
            case EPixelFormats.R8G8B8:
            case EPixelFormats.B8G8R8:
                return GL_RGB;

            case EPixelFormats.FLOAT16_R:
            case EPixelFormats.FLOAT32_R:
            case EPixelFormats.R8:
                return webgl.hasExtension(EXT_texture_rg) ? GL_RED_EXT : 0;
            case EPixelFormats.FLOAT16_GR:
            case EPixelFormats.FLOAT32_GR:
            case EPixelFormats.RG8:
                return webgl.hasExtension(EXT_texture_rg) ? GL_RED_EXT : 0;

            case EPixelFormats.A4L4:
            case EPixelFormats.R3G3B2:
            case EPixelFormats.A2R10G10B10:
            case EPixelFormats.A2B10G10R10:
            case EPixelFormats.FLOAT16_RGBA:
            case EPixelFormats.FLOAT32_RGB:
            case EPixelFormats.FLOAT32_RGBA:
            case EPixelFormats.SHORT_RGBA:
            case EPixelFormats.SHORT_RGB:
            case EPixelFormats.SHORT_GR:
			
			case EPixelFormats.DXT1:
				if (!isHWGamma)
					return webgl.hasExtension(WEBGL_compressed_texture_s3tc) ? GL_COMPRESSED_RGBA_S3TC_DXT1_EXT : 0;
            case EPixelFormats.DXT3:
				if (!isHWGamma)
	                return webgl.hasExtension(WEBGL_compressed_texture_s3tc) ? GL_COMPRESSED_RGBA_S3TC_DXT3_EXT : 0;
            case EPixelFormats.DXT5:
				if (!isHWGamma)
	                return webgl.hasExtension(WEBGL_compressed_texture_s3tc) ? GL_COMPRESSED_RGBA_S3TC_DXT3_EXT : 0;

            default:
                return 0;
        }
    }

    export function getClosestWebGLInternalFormat(eFormat: EPixelFormats, isHWGamma: bool): int {
        var iGLFormat = webgl.getWebGLInternalFormat(eFormat, isHWGamma);
        
        if (iGLFormat === GL_NONE) {
            if (isHWGamma) {
                // TODO not supported
                return 0;
            }
            else {
                return GL_RGBA;
            }
        }
        else {
            return iGLFormat;
        }
    }

    export function getClosestAkraFormat(iGLFormat: int, iGLDataType: int): EPixelFormats {
        switch (iGLFormat) {

            case GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG:
                return webgl.hasExtension(WEBGL_compressed_texture_pvrtc) ? EPixelFormats.PVRTC_RGB2 : EPixelFormats.A8R8G8B8;
            case GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG:
                return webgl.hasExtension(WEBGL_compressed_texture_pvrtc) ? EPixelFormats.PVRTC_RGBA2 : EPixelFormats.A8R8G8B8;
            case GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG:
                return webgl.hasExtension(WEBGL_compressed_texture_pvrtc) ? EPixelFormats.PVRTC_RGB4 : EPixelFormats.A8R8G8B8;
            case GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG:
                return webgl.hasExtension(WEBGL_compressed_texture_pvrtc) ? EPixelFormats.PVRTC_RGBA4 : EPixelFormats.A8R8G8B8;

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
            	};
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
                return webgl.hasExtension(WEBGL_compressed_texture_s3tc) ? EPixelFormats.DXT1 : EPixelFormats.A8R8G8B8;

            case GL_COMPRESSED_RGBA_S3TC_DXT3_EXT:
                return webgl.hasExtension(WEBGL_compressed_texture_s3tc) ? EPixelFormats.DXT3 : EPixelFormats.A8R8G8B8;
            case GL_COMPRESSED_RGBA_S3TC_DXT5_EXT:
                return webgl.hasExtension(WEBGL_compressed_texture_s3tc) ? EPixelFormats.DXT5 : EPixelFormats.A8R8G8B8;
      
            case GL_R8_EXT:
                return webgl.hasExtension(EXT_texture_rg) ? EPixelFormats.R8 : EPixelFormats.A8R8G8B8;
            case GL_RG8_EXT:
                return webgl.hasExtension(EXT_texture_rg) ? EPixelFormats.RG8 : EPixelFormats.A8R8G8B8;

            default:
                //TODO: not supported
                return EPixelFormats.A8R8G8B8;
        };
    }

    export function getMaxMipmaps(iWidth: int, iHeight: int, iDepth: int, eFormat: EPixelFormats) : int {
		var iCount: int = 0;
        if((iWidth > 0) && (iHeight > 0)) {
            do {
                if(iWidth>1)		iWidth = iWidth/2;
                if(iHeight>1)		iHeight = iHeight/2;
                if(iDepth>1)		iDepth = iDepth/2;
                /*
                 NOT needed, compressed formats will have mipmaps up to 1x1
                 if(PixelUtil::isValidExtent(width, height, depth, format))
                 count ++;
                 else
                 break;
                 */
                
                iCount ++;
            } while(!(iWidth === 1 && iHeight === 1 && iDepth === 1));
        }		
		return iCount;
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
                        pDest[iDstPtr + x] = ((pSource[iSrcPtr + x]&0x000F)<<12) |   // B
                                    		 ((pSource[iSrcPtr + x]&0x00F0)<<4)  |   // G
                                    		 ((pSource[iSrcPtr + x]&0x0F00)>>4)  |   // R
                                    	     ((pSource[iSrcPtr + x]&0xF000)>>12);    // A
                    }

                    iSrcPtr += pSource.rowPitch;
                    iDstPtr += pDest.rowPitch;
                }

                iSrcPtr += iSrcSliceSkip;
                iDstPtr += iDstSliceSkip;
            }    
        }	
	}

}

#endif