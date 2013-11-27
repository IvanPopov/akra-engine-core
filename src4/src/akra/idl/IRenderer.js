/// <reference path="IEventProvider.ts" />
/// <reference path="IRenderQueue.ts" />
/// <reference path="IViewportState.ts" />
/// <reference path="IAFXComponent.ts" />
/// <reference path="IAFXEffect.ts" />
/// <reference path="IRenderableObject.ts" />
/// <reference path="ISceneObject.ts" />
/// <reference path="IBufferMap.ts" />
/// <reference path="IShaderProgram.ts" />
/// <reference path="ISurfaceMaterial.ts" />
/// <reference path="IVertexData.ts" />
/// <reference path="IVertexBuffer.ts" />
/// <reference path="ITexture.ts" />
/// <reference path="IIndexBuffer.ts" />
/// <reference path="IRenderResource.ts" />
/// <reference path="IRenderEntry.ts" />
/// <reference path="IViewport.ts" />
/// <reference path="IColor.ts" />
/// <reference path="IEngine.ts" />
/// <reference path="IRenderTarget.ts" />
/// <reference path="ICanvas3d.ts" />
/// <reference path="IViewportState.ts" />
/// <reference path="3d-party/webgl.d.ts" />
var akra;
(function (akra) {
    function CAPABILITYVALUE(category, value) {
        return ((category << (32 - 4)) | (1 << value));
    }

    (function (ERenderers) {
        ERenderers[ERenderers["UNKNOWN"] = 0] = "UNKNOWN";
        ERenderers[ERenderers["WEBGL"] = 1] = "WEBGL";
    })(akra.ERenderers || (akra.ERenderers = {}));
    var ERenderers = akra.ERenderers;

    //API SPECIFIFC CONSTANTS
    (function (ERenderCapabilitiesCategory) {
        ERenderCapabilitiesCategory[ERenderCapabilitiesCategory["C_COMMON"] = 0] = "C_COMMON";
        ERenderCapabilitiesCategory[ERenderCapabilitiesCategory["C_COMMON_2"] = 1] = "C_COMMON_2";
        ERenderCapabilitiesCategory[ERenderCapabilitiesCategory["C_WEBGL"] = 2] = "C_WEBGL";

        ERenderCapabilitiesCategory[ERenderCapabilitiesCategory["COUNT"] = 3] = "COUNT";
    })(akra.ERenderCapabilitiesCategory || (akra.ERenderCapabilitiesCategory = {}));
    var ERenderCapabilitiesCategory = akra.ERenderCapabilitiesCategory;

    (function (ERenderCapabilities) {
        ERenderCapabilities[ERenderCapabilities["AUTOMIPMAP"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 0)] = "AUTOMIPMAP";
        ERenderCapabilities[ERenderCapabilities["BLENDING"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 1)] = "BLENDING";

        /// Supports anisotropic texture filtering
        ERenderCapabilities[ERenderCapabilities["ANISOTROPY"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 2)] = "ANISOTROPY";

        /// Supports fixed-function DOT3 texture blend
        ERenderCapabilities[ERenderCapabilities["DOT3"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 3)] = "DOT3";

        /// Supports cube mapping
        ERenderCapabilities[ERenderCapabilities["CUBEMAPPING"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 4)] = "CUBEMAPPING";

        /// Supports hardware stencil buffer
        ERenderCapabilities[ERenderCapabilities["HWSTENCIL"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 5)] = "HWSTENCIL";

        /// Supports hardware vertex and index buffers
        ERenderCapabilities[ERenderCapabilities["VBO"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 7)] = "VBO";

        /// Supports vertex programs (vertex shaders)
        ERenderCapabilities[ERenderCapabilities["VERTEX_PROGRAM"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 9)] = "VERTEX_PROGRAM";

        /// Supports fragment programs (pixel shaders)
        ERenderCapabilities[ERenderCapabilities["FRAGMENT_PROGRAM"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 10)] = "FRAGMENT_PROGRAM";

        /// Supports performing a scissor test to exclude areas of the screen
        ERenderCapabilities[ERenderCapabilities["SCISSOR_TEST"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 11)] = "SCISSOR_TEST";

        /// Supports separate stencil updates for both front and back faces
        ERenderCapabilities[ERenderCapabilities["TWO_SIDED_STENCIL"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 12)] = "TWO_SIDED_STENCIL";

        /// Supports wrapping the stencil value at the range extremeties
        ERenderCapabilities[ERenderCapabilities["STENCIL_WRAP"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 13)] = "STENCIL_WRAP";

        /// Supports hardware occlusion queries
        ERenderCapabilities[ERenderCapabilities["HWOCCLUSION"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 14)] = "HWOCCLUSION";

        /// Supports user clipping planes
        ERenderCapabilities[ERenderCapabilities["USER_CLIP_PLANES"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 15)] = "USER_CLIP_PLANES";

        /// Supports the VET_UBYTE4 vertex element type
        ERenderCapabilities[ERenderCapabilities["VERTEX_FORMAT_UBYTE4"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 16)] = "VERTEX_FORMAT_UBYTE4";

        /// Supports infinite far plane projection
        ERenderCapabilities[ERenderCapabilities["INFINITE_FAR_PLANE"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 17)] = "INFINITE_FAR_PLANE";

        /// Supports hardware render-to-texture (bigger than framebuffer)
        ERenderCapabilities[ERenderCapabilities["HWRENDER_TO_TEXTURE"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 18)] = "HWRENDER_TO_TEXTURE";

        /// Supports float textures and render targets
        ERenderCapabilities[ERenderCapabilities["TEXTURE_FLOAT"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 19)] = "TEXTURE_FLOAT";

        /// Supports non-power of two textures
        ERenderCapabilities[ERenderCapabilities["NON_POWER_OF_2_TEXTURES"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 20)] = "NON_POWER_OF_2_TEXTURES";

        /// Supports 3d (volume) textures
        ERenderCapabilities[ERenderCapabilities["TEXTURE_3D"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 21)] = "TEXTURE_3D";

        /// Supports basic point sprite rendering
        ERenderCapabilities[ERenderCapabilities["POINT_SPRITES"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 22)] = "POINT_SPRITES";

        /// Supports extra point parameters (minsize, maxsize, attenuation)
        ERenderCapabilities[ERenderCapabilities["POINT_EXTENDED_PARAMETERS"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 23)] = "POINT_EXTENDED_PARAMETERS";

        /// Supports vertex texture fetch
        ERenderCapabilities[ERenderCapabilities["VERTEX_TEXTURE_FETCH"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 24)] = "VERTEX_TEXTURE_FETCH";

        /// Supports mipmap LOD biasing
        ERenderCapabilities[ERenderCapabilities["MIPMAP_LOD_BIAS"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 25)] = "MIPMAP_LOD_BIAS";

        /// Supports hardware geometry programs
        ERenderCapabilities[ERenderCapabilities["GEOMETRY_PROGRAM"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 26)] = "GEOMETRY_PROGRAM";

        /// Supports rendering to vertex buffers
        ERenderCapabilities[ERenderCapabilities["HWRENDER_TO_VERTEX_BUFFER"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON, 27)] = "HWRENDER_TO_VERTEX_BUFFER";

        /// Supports compressed textures
        ERenderCapabilities[ERenderCapabilities["TEXTURE_COMPRESSION"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON_2, 0)] = "TEXTURE_COMPRESSION";

        /// Supports compressed textures in the DXT/ST3C formats
        ERenderCapabilities[ERenderCapabilities["TEXTURE_COMPRESSION_DXT"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON_2, 1)] = "TEXTURE_COMPRESSION_DXT";

        /// Supports compressed textures in the VTC format
        ERenderCapabilities[ERenderCapabilities["TEXTURE_COMPRESSION_VTC"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON_2, 2)] = "TEXTURE_COMPRESSION_VTC";

        /// Supports compressed textures in the PVRTC format
        ERenderCapabilities[ERenderCapabilities["TEXTURE_COMPRESSION_PVRTC"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON_2, 3)] = "TEXTURE_COMPRESSION_PVRTC";

        /// Supports fixed-function pipeline
        ERenderCapabilities[ERenderCapabilities["FIXED_FUNCTION"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON_2, 4)] = "FIXED_FUNCTION";

        /// Supports MRTs with different bit depths
        ERenderCapabilities[ERenderCapabilities["MRT_DIFFERENT_BIT_DEPTHS"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON_2, 5)] = "MRT_DIFFERENT_BIT_DEPTHS";

        /// Supports Alpha to Coverage (A2C)
        ERenderCapabilities[ERenderCapabilities["ALPHA_TO_COVERAGE"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON_2, 6)] = "ALPHA_TO_COVERAGE";

        /// Supports Blending operations other than +
        ERenderCapabilities[ERenderCapabilities["ADVANCED_BLEND_OPERATIONS"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON_2, 7)] = "ADVANCED_BLEND_OPERATIONS";

        /// Supports a separate depth buffer for RTTs. D3D 9 & 10, OGL w/FBO (FBO implies this flag)
        ERenderCapabilities[ERenderCapabilities["RTT_SEPARATE_DEPTHBUFFER"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON_2, 8)] = "RTT_SEPARATE_DEPTHBUFFER";

        /// Supports using the MAIN depth buffer for RTTs. D3D 9&10, OGL w/FBO support unknown
        /// (undefined behavior?), OGL w/ copy supports it
        ERenderCapabilities[ERenderCapabilities["RTT_MAIN_DEPTHBUFFER_ATTACHABLE"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON_2, 9)] = "RTT_MAIN_DEPTHBUFFER_ATTACHABLE";

        /// Supports attaching a depth buffer to an RTT that has width & height less or equal than RTT's.
        /// Otherwise must be of _exact_ same resolution. D3D 9, OGL 3.0 (not 2.0, not D3D10)
        ERenderCapabilities[ERenderCapabilities["RTT_DEPTHBUFFER_RESOLUTION_LESSEQUAL"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON_2, 10)] = "RTT_DEPTHBUFFER_RESOLUTION_LESSEQUAL";

        /// Supports using vertex buffers for instance data
        ERenderCapabilities[ERenderCapabilities["VERTEX_BUFFER_INSTANCE_DATA"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON_2, 11)] = "VERTEX_BUFFER_INSTANCE_DATA";

        /// Supports using vertex buffers for instance data
        ERenderCapabilities[ERenderCapabilities["CAN_GET_COMPILED_SHADER_BUFFER"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_COMMON_2, 12)] = "CAN_GET_COMPILED_SHADER_BUFFER";

        // ***** GL Specific Caps *****
        /// Supports openGL GLEW version 1.5
        ERenderCapabilities[ERenderCapabilities["GL1_5_NOVBO"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_WEBGL, 1)] = "GL1_5_NOVBO";

        /// Support for Frame Buffer Objects (FBOs)
        ERenderCapabilities[ERenderCapabilities["FBO"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_WEBGL, 2)] = "FBO";

        /// Support for Frame Buffer Objects ARB implementation (regular FBO is higher precedence)
        ERenderCapabilities[ERenderCapabilities["FBO_ARB"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_WEBGL, 3)] = "FBO_ARB";

        /// Support for Frame Buffer Objects ATI implementation (ARB FBO is higher precedence)
        ERenderCapabilities[ERenderCapabilities["FBO_ATI"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_WEBGL, 4)] = "FBO_ATI";

        /// Support for PBuffer
        ERenderCapabilities[ERenderCapabilities["PBUFFER"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_WEBGL, 5)] = "PBUFFER";

        /// Support for GL 1.5 but without HW occlusion workaround
        ERenderCapabilities[ERenderCapabilities["GL1_5_NOHWOCCLUSION"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_WEBGL, 6)] = "GL1_5_NOHWOCCLUSION";

        /// Support for point parameters ARB implementation
        ERenderCapabilities[ERenderCapabilities["POINT_EXTENDED_PARAMETERS_ARB"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_WEBGL, 7)] = "POINT_EXTENDED_PARAMETERS_ARB";

        /// Support for point parameters EXT implementation
        ERenderCapabilities[ERenderCapabilities["POINT_EXTENDED_PARAMETERS_EXT"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_WEBGL, 8)] = "POINT_EXTENDED_PARAMETERS_EXT";

        /// Support for Separate Shader Objects
        ERenderCapabilities[ERenderCapabilities["SEPARATE_SHADER_OBJECTS"] = CAPABILITYVALUE(ERenderCapabilitiesCategory.C_WEBGL, 9)] = "SEPARATE_SHADER_OBJECTS";
    })(akra.ERenderCapabilities || (akra.ERenderCapabilities = {}));
    var ERenderCapabilities = akra.ERenderCapabilities;

    // export enum EGLSpecifics {
    //	 UNPACK_ALIGNMENT = 0x0CF5,
    //	 PACK_ALIGNMENT = 0x0D05,
    //	 UNPACK_FLIP_Y_WEBGL = 0x9240,
    //	 UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241,
    //	 CONTEXT_LOST_WEBGL = 0x9242,
    //	 UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243,
    //	 BROWSER_DEFAULT_WEBGL = 0x9244
    // };
    // export enum EBufferMasks {
    //	 DEPTH_BUFFER_BIT			   = 0x00000100,
    //	 STENCIL_BUFFER_BIT			 = 0x00000400,
    //	 COLOR_BUFFER_BIT			   = 0x00004000
    // };
    // export enum EBufferUsages {
    //	 STREAM_DRAW = 0x88E0,
    //	 STATIC_DRAW = 0x88E4,
    //	 DYNAMIC_DRAW = 0x88E8
    // };
    // export enum EBufferTypes {
    //	 ARRAY_BUFFER = 0x8892,
    //	 ELEMENT_ARRAY_BUFFER = 0x8893,
    //	 FRAME_BUFFER = 0x8D40,
    //	 RENDER_BUFFER = 0x8D41
    // };
    (function (EAttachmentTypes) {
        EAttachmentTypes[EAttachmentTypes["COLOR_ATTACHMENT0"] = 0x8CE0] = "COLOR_ATTACHMENT0";
        EAttachmentTypes[EAttachmentTypes["DEPTH_ATTACHMENT"] = 0x8D00] = "DEPTH_ATTACHMENT";
        EAttachmentTypes[EAttachmentTypes["STENCIL_ATTACHMENT"] = 0x8D20] = "STENCIL_ATTACHMENT";
        EAttachmentTypes[EAttachmentTypes["DEPTH_STENCIL_ATTACHMENT"] = 0x821A] = "DEPTH_STENCIL_ATTACHMENT";
    })(akra.EAttachmentTypes || (akra.EAttachmentTypes = {}));
    var EAttachmentTypes = akra.EAttachmentTypes;
    ;
})(akra || (akra = {}));
