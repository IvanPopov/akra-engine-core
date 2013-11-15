// AIRenderer interface
// [write description here...]

/// <reference path="AIEventProvider.ts" />
/// <reference path="AIRenderQueue.ts" />
/// <reference path="AIViewportState.ts" />


/// <reference path="AIAFXComponent.ts" />
/// <reference path="AIAFXEffect.ts" />
/// <reference path="AIRenderableObject.ts" />
/// <reference path="AISceneObject.ts" />
/// <reference path="AIBufferMap.ts" />
/// <reference path="AIShaderProgram.ts" />
/// <reference path="AISurfaceMaterial.ts" />
/// <reference path="AIVertexData.ts" />
/// <reference path="AIVertexBuffer.ts" />
/// <reference path="AITexture.ts" />
/// <reference path="AIIndexBuffer.ts" />
/// <reference path="AIRenderResource.ts" />
/// <reference path="AIRenderEntry.ts" />
/// <reference path="AIViewport.ts" />
/// <reference path="AIColor.ts" />
/// <reference path="AIEngine.ts" />
/// <reference path="AIRenderTarget.ts" />
/// <reference path="AICanvas3d.ts" />
/// <reference path="AIViewportState.ts" />

// #define CAPABILITYVALUE(category, value) ((category << (32 - 4)) | (1 << value))

interface IRendererOptions extends WebGLContextAttributes {
	canvas?: HTMLCanvasElement;
}

//API SPECIFIFC CONSTANTS



enum AERenderCapabilitiesCategory {
	C_COMMON = 0,
	C_COMMON_2 = 1,
	C_WEBGL = 2,

	COUNT = 3
}

enum AERenderCapabilities {
// 	AUTOMIPMAP			  = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 0),
// 	BLENDING				= CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 1),
// 	/// Supports anisotropic texture filtering
// 	ANISOTROPY			  = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 2),
// 	/// Supports fixed-function DOT3 texture blend
// 	DOT3					= CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 3),
// 	/// Supports cube mapping
// 	CUBEMAPPING			 = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 4),
// 	/// Supports hardware stencil buffer
// 	HWSTENCIL			   = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 5),
// 	/// Supports hardware vertex and index buffers
// 	VBO					 = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 7),
// 	/// Supports vertex programs (vertex shaders)
// 	VERTEX_PROGRAM		  = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 9),
// 	/// Supports fragment programs (pixel shaders)
// 	FRAGMENT_PROGRAM		= CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 10),
// 	/// Supports performing a scissor test to exclude areas of the screen
// 	SCISSOR_TEST			= CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 11),
// 	/// Supports separate stencil updates for both front and back faces
// 	TWO_SIDED_STENCIL	   = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 12),
// 	/// Supports wrapping the stencil value at the range extremeties
// 	STENCIL_WRAP			= CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 13),
// 	/// Supports hardware occlusion queries
// 	HWOCCLUSION			 = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 14),
// 	/// Supports user clipping planes
// 	USER_CLIP_PLANES		= CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 15),
// 	/// Supports the VET_UBYTE4 vertex element type
// 	VERTEX_FORMAT_UBYTE4	= CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 16),
// 	/// Supports infinite far plane projection
// 	INFINITE_FAR_PLANE	  = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 17),
// 	/// Supports hardware render-to-texture (bigger than framebuffer)
// 	HWRENDER_TO_TEXTURE	 = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 18),
// 	/// Supports float textures and render targets
// 	TEXTURE_FLOAT		   = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 19),
// 	/// Supports non-power of two textures
// 	NON_POWER_OF_2_TEXTURES = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 20),
// 	/// Supports 3d (volume) textures
// 	TEXTURE_3D			  = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 21),
// 	/// Supports basic point sprite rendering
// 	POINT_SPRITES		   = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 22),
// 	/// Supports extra point parameters (minsize, maxsize, attenuation)
// 	POINT_EXTENDED_PARAMETERS = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 23),
// 	/// Supports vertex texture fetch
// 	VERTEX_TEXTURE_FETCH = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 24),
// 	/// Supports mipmap LOD biasing
// 	MIPMAP_LOD_BIAS = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 25),
// 	/// Supports hardware geometry programs
// 	GEOMETRY_PROGRAM = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 26),
// 	/// Supports rendering to vertex buffers
// 	HWRENDER_TO_VERTEX_BUFFER = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON, 27),

// 	/// Supports compressed textures
// 	TEXTURE_COMPRESSION = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON_2, 0),
// 	/// Supports compressed textures in the DXT/ST3C formats
// 	TEXTURE_COMPRESSION_DXT = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON_2, 1),
// 	/// Supports compressed textures in the VTC format
// 	TEXTURE_COMPRESSION_VTC = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON_2, 2),
// 	/// Supports compressed textures in the PVRTC format
// 	TEXTURE_COMPRESSION_PVRTC = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON_2, 3),
// 	/// Supports fixed-function pipeline
// 	FIXED_FUNCTION = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON_2, 4),
// 	/// Supports MRTs with different bit depths
// 	MRT_DIFFERENT_BIT_DEPTHS = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON_2, 5),
// 	/// Supports Alpha to Coverage (A2C)
// 	ALPHA_TO_COVERAGE = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON_2, 6),
// 	/// Supports Blending operations other than +
// 	ADVANCED_BLEND_OPERATIONS = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON_2, 7),
// 	/// Supports a separate depth buffer for RTTs. D3D 9 & 10, OGL w/FBO (FBO implies this flag)
// 	RTT_SEPARATE_DEPTHBUFFER = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON_2, 8),
// 	/// Supports using the MAIN depth buffer for RTTs. D3D 9&10, OGL w/FBO support unknown
// 	/// (undefined behavior?), OGL w/ copy supports it
// 	RTT_MAIN_DEPTHBUFFER_ATTACHABLE = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON_2, 9),
// 	/// Supports attaching a depth buffer to an RTT that has width & height less or equal than RTT's.
// 	/// Otherwise must be of _exact_ same resolution. D3D 9, OGL 3.0 (not 2.0, not D3D10)
// 	RTT_DEPTHBUFFER_RESOLUTION_LESSEQUAL = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON_2, 10),
// 	/// Supports using vertex buffers for instance data
// 	VERTEX_BUFFER_INSTANCE_DATA = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON_2, 11),
// 	/// Supports using vertex buffers for instance data
// 	CAN_GET_COMPILED_SHADER_BUFFER = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_COMMON_2, 12),


// 	// ***** GL Specific Caps *****
// 	/// Supports openGL GLEW version 1.5
// 	GL1_5_NOVBO	= CAPABILITYVALUE(AERenderCapabilitiesCategory.C_WEBGL, 1),
// 	/// Support for Frame Buffer Objects (FBOs)
// 	FBO			  = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_WEBGL, 2),
// 	/// Support for Frame Buffer Objects ARB implementation (regular FBO is higher precedence)
// 	FBO_ARB		  = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_WEBGL, 3),
// 	/// Support for Frame Buffer Objects ATI implementation (ARB FBO is higher precedence)
// 	FBO_ATI		  = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_WEBGL, 4),
// 	/// Support for PBuffer
// 	PBUFFER		  = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_WEBGL, 5),
// 	/// Support for GL 1.5 but without HW occlusion workaround
// 	GL1_5_NOHWOCCLUSION = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_WEBGL, 6),
// 	/// Support for point parameters ARB implementation
// 	POINT_EXTENDED_PARAMETERS_ARB = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_WEBGL, 7),
// 	/// Support for point parameters EXT implementation
// 	POINT_EXTENDED_PARAMETERS_EXT = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_WEBGL, 8),
// 	/// Support for Separate Shader Objects
// 	SEPARATE_SHADER_OBJECTS = CAPABILITYVALUE(AERenderCapabilitiesCategory.C_WEBGL, 9)
}

// enum AEGLSpecifics {
//	 UNPACK_ALIGNMENT = 0x0CF5,
//	 PACK_ALIGNMENT = 0x0D05,
//	 UNPACK_FLIP_Y_WEBGL = 0x9240,
//	 UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241,
//	 CONTEXT_LOST_WEBGL = 0x9242,
//	 UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243,
//	 BROWSER_DEFAULT_WEBGL = 0x9244
// };

// enum AEBufferMasks {
//	 DEPTH_BUFFER_BIT			   = 0x00000100,
//	 STENCIL_BUFFER_BIT			 = 0x00000400,
//	 COLOR_BUFFER_BIT			   = 0x00004000
// };

// enum AEBufferUsages {
//	 STREAM_DRAW = 0x88E0,
//	 STATIC_DRAW = 0x88E4,
//	 DYNAMIC_DRAW = 0x88E8
// };

// enum AEBufferTypes {
//	 ARRAY_BUFFER = 0x8892,
//	 ELEMENT_ARRAY_BUFFER = 0x8893,
//	 FRAME_BUFFER = 0x8D40,
//	 RENDER_BUFFER = 0x8D41
// };

enum AEAttachmentTypes {
	 COLOR_ATTACHMENT0 = 0x8CE0,
	 DEPTH_ATTACHMENT = 0x8D00,
	 STENCIL_ATTACHMENT = 0x8D20,
	 DEPTH_STENCIL_ATTACHMENT = 0x821A
};


// enum AERenderStates {
//	 ZENABLE = 7,
//	 ZWRITEENABLE = 14,
//	 SRCBLEND = 19,
//	 DESTBLEND = 20,
//	 CULLMODE = 22,
//	 ZFUNC = 23,
//	 DITHERENABLE = 26,
//	 ALPHABLENDENABLE = 27,
//	 ALPHATESTENABLE
// };

// enum AEBlendModes {
//	 ZERO = 0,
//	 ONE = 1,
//	 SRCCOLOR = 0x0300,
//	 INVSRCCOLOR = 0x301,
//	 SRCALPHA = 0x0302,
//	 INVSRCALPHA = 0x0303,
//	 DESTALPHA = 0x0304,
//	 INVDESTALPHA = 0x0305,
//	 DESTCOLOR = 0x0306,
//	 INVDESTCOLOR = 0x0307,
//	 SRCALPHASAT = 0x0308
// };

// enum AECmpFuncs {
//	 NEVER = 1,
//	 LESS = 2,
//	 EQUAL = 3,
//	 LESSEQUAL = 4,
//	 GREATER = 5,
//	 NOTEQUAL = 6,
//	 GREATEREQUAL = 7,
//	 ALWAYS = 8
// };

// enum AECullModes {
//	 NONE = 0,
//	 CW = 0x404, //FRONT
//	 CCW = 0x0405, //BACK
//	 FRONT_AND_BACK = 0x0408
// };

//END OF API SPECIFIC

// enum AERenderStages {
//  SHADOWS = 2,
//  LIGHTING,
//  GLOBALPOSTEFFECTS,
//  DEFAULT
// }

interface AIRenderer extends AIEventProvider {
	getEngine(): AIEngine;

	debug(bValue?: boolean, useApiTrace?: boolean): boolean;
	
	isDebug(): boolean;
	isValid(): boolean;

	getError();

	clearFrameBuffer(iBuffer: int, cColor: AIColor, fDepth: float, iStencil: uint): void;

	_beginRender(): void;
	_renderEntry(pEntry: AIRenderEntry): void;
	_endRender(): void;

	_disableAllTextureUnits(): void;
	_disableTextureUnitsFrom(iUnit: uint): void;

	_initRenderTargets(): void;
	_updateAllRenderTargets(): void;

	_setViewport(pViewport: AIViewport): void;
	_setViewportForRender(pViewport: AIViewport): void;
	_getViewport(): AIViewport;

	_setRenderTarget(pTarget: AIRenderTarget): void;

	_setCullingMode(eMode: AECullingMode): void;
	_setDepthBufferParams(bDepthTest: boolean, bDepthWrite: boolean, 
						  eDepthFunction: AECompareFunction, fClearDepth?: float): void;

	hasCapability(eCapability: AERenderCapabilities): boolean;

	attachRenderTarget(pTarget: AIRenderTarget): boolean;
	detachRenderTarget(pTarget: AIRenderTarget): boolean;
	destroyRenderTarget(pTarget: AIRenderTarget): void;

	getActiveProgram(): AIShaderProgram;

	getDefaultCanvas(): AICanvas3d;
	
	createEntry(): AIRenderEntry;
	releaseEntry(pEntry: AIRenderEntry): void;
	pushEntry(pEntry: AIRenderEntry): void;
	executeQueue(bSort?: boolean): void;

	_lockRenderTarget(): void;
	_unlockRenderTarget(): void;
	_isLockRenderTarget(): boolean;

}



