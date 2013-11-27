/// <reference path="idl/3d-party/webgl.d.ts" />
/// <reference path="idl/3d-party/has.d.ts" />
/// <reference path="idl/AEPixelFormats.ts" />
/// <reference path="idl/AIHardwareBuffer.ts" />
/// <reference path="idl/AIPixelBox.ts" />
/// <reference path="idl/AEPrimitiveTypes.ts" />
/// <reference path="idl/common.d.ts" />
define(["require", "exports", "logger", "bitflags", "math", "pixelUtil"], function(require, exports, __logger__, __bf__, __math__, __pixelUtil__) {
    var logger = __logger__;
    var bf = __bf__;
    var math = __math__;
    var pixelUtil = __pixelUtil__;

    exports.maxTextureSize = 0;
    exports.maxCubeMapTextureSize = 0;
    exports.maxViewPortSize = 0;

    exports.maxTextureImageUnits = 0;
    exports.maxVertexAttributes = 0;
    exports.maxVertexTextureImageUnits = 0;
    exports.maxCombinedTextureImageUnits = 0;

    exports.maxColorAttachments = 1;

    exports.stencilBits = 0;
    exports.colorBits = [0, 0, 0];
    exports.alphaBits = 0;
    exports.multisampleType = 0.;

    exports.shaderVersion = 0;
    exports.hasNonPowerOf2Textures = false;

    exports.isANGLE = false;

    var isSupported = false;
    var pSupportedExtensionList = null;

    //todo: replace with constants (use <const> keyword)
    //WebGL Extensions
    exports.OES_TEXTURE_FLOAT = "OES_texture_float";
    exports.OES_TEXTURE_HALF_FLOAT = "OES_texture_half_float";
    exports.OES_STANDARD_DERIVATIVES = "OES_standard_derivatives";
    exports.OES_VERTEX_ARRAY_OBJECT = "OES_vertex_array_object";
    exports.OES_ELEMENT_INDEX_UINT = "OES_element_index_uint";
    exports.WEBGL_DEBUG_RENDERER_INFO = "WEBGL_debug_renderer_info";
    exports.WEBGL_DEBUG_SHADERS = "WEBGL_debug_shaders";
    exports.EXT_TEXTURE_FILTER_ANISOTROPIC = "EXT_texture_filter_anisotropic";

    //draft
    exports.WEBGL_LOSE_CONTEXT = "WEBGL_lose_context";
    exports.WEBGL_DEPTH_TEXTURE = "WEBGL_depth_texture";
    exports.WEBGL_COMPRESSED_TEXTURE_S3TC = "WEBGL_compressed_texture_s3tc";
    exports.WEBGL_COMPRESSED_TEXTURE_ATC = "WEBGL_compressed_texture_atc";
    exports.WEBGL_COMPRESSED_TEXTURE_PVRTC = "WEBGL_compressed_texture_pvrtc";
    exports.WEBGL_COLOR_BUFFER_FLOAT = "WEBGL_color_buffer_float";
    exports.EXT_COLOR_BUFFER_HALF_FLOAT = "EXT_color_buffer_half_float";

    //Future
    exports.EXT_TEXTURE_RG = "EXT_texture_rg";
    exports.OES_DEPTH24 = "OES_depth24";
    exports.OES_DEPTH32 = "OES_depth32";
    exports.OES_PACKED_DEPTH_STENCIL = "OES_packed_depth_stencil";
    exports.EXT_TEXTURE_NPOT_2D_MIPMAP = "EXT_texture_npot_2D_mipmap";

    function makeDebugContext(pWebGLContext) {
        if (isDef((window).WebGLDebugUtils)) {
            pWebGLContext = WebGLDebugUtils.makeDebugContext(pWebGLContext, function (err, funcName, args) {
                throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
            }, function (funcName, args) {
                logger.log("gl." + funcName + "(" + WebGLDebugUtils.glFunctionArgsToString(funcName, args) + ")");
            });
        }

        return pWebGLContext;
    }

    function loadExtension(pWebGLContext, sExtName) {
        var pWebGLExtentionList = (pWebGLContext).extentionList = (pWebGLContext).extentionList || {};
        var pWebGLExtension;

        if (!exports.hasExtension(sExtName)) {
            logger.warn("Extension " + sExtName + " unsupported for this platform.");
            return false;
        }
        if (pWebGLExtension = pWebGLContext.getExtension(sExtName)) {
            if (isDefAndNotNull(pWebGLExtentionList[sExtName])) {
                // debug_print("Extension " + sExtName + " already loaded for this context.");
                return true;
            }

            pWebGLExtentionList[sExtName] = pWebGLExtension;

            for (var j in pWebGLExtension) {
                if (isFunction(pWebGLExtension[j])) {
                    //debug_print("created func WebGLRenderingContext::" + j + "(...)");
                    pWebGLContext[j] = function () {
                        pWebGLContext[j] = new Function("var t = this.extentionList[" + sExtName + "];" + "t." + j + ".apply(t, arguments);");
                    };
                } else {
                    //debug_print("created const WebGLRenderingContext::" + j + " = " + pWebGLExtension[j]);
                    pWebGLContext[j] = pWebGLExtension[j];
                }
            }

            return true;
        }

        logger.warn("cannot load extension: ", sExtName);
        return false;
    }
    exports.loadExtension = loadExtension;

    function checkIsAngle(pWebGLContext) {
        var pProgram = pWebGLContext.createProgram();

        var sVertex = "\
            attribute vec3 pos;\
            struct S {\
              vec3 b[1];\
            };\
            uniform S s[1];\
            void main(void) {\
              float t = s[0].b[0].x;\
              gl_Position = vec4(pos, 1. + t);\
            }";

        var sFragment = "void main(void){}";

        var pVertexShader = pWebGLContext.createShader(35633 /* VERTEX_SHADER */);
        var pFragmentShader = pWebGLContext.createShader(35632 /* FRAGMENT_SHADER */);

        pWebGLContext.shaderSource(pVertexShader, sVertex);
        pWebGLContext.compileShader(pVertexShader);
        pWebGLContext.shaderSource(pFragmentShader, sFragment);
        pWebGLContext.compileShader(pFragmentShader);

        pWebGLContext.attachShader(pProgram, pVertexShader);
        pWebGLContext.attachShader(pProgram, pFragmentShader);

        pWebGLContext.linkProgram(pProgram);

        if (!pWebGLContext.getProgramParameter(pProgram, 35714 /* LINK_STATUS */)) {
            //debug_error("cannot compile GLSL shader for ANGLE renderer");
            //debug_print(pWebGLContext.getShaderInfoLog(pVertexShader));
            //debug_print(pWebGLContext.getShaderSource(pVertexShader) || sVertex);
            //debug_print(pWebGLContext.getShaderInfoLog(pFragmentShader));
            //debug_print(pWebGLContext.getShaderSource(pFragmentShader) || sFragment);
            return false;
        }

        //debug_assert(pWebGLContext.getProgramParameter(pProgram, gl.ACTIVE_UNIFORMS) > 0,
        //    "no uniforms founded in angle test shader!");
        return pWebGLContext.getActiveUniform(pProgram, 0).name != "s[0].b[0]";
    }

    function setupContext(pWebGLContext) {
        if (isNull(pSupportedExtensionList)) {
            return pWebGLContext;
        }

        for (var i = 0; i < pSupportedExtensionList.length; ++i) {
            if (!exports.loadExtension(pWebGLContext, pSupportedExtensionList[i])) {
                pSupportedExtensionList.splice(i, 1);
            }
        }

        return pWebGLContext;
    }

    exports.isEnabled = function () {
        return isSupported;
    };

    function createContext(pCanvas, pOptions) {
        if (typeof pCanvas === "undefined") { pCanvas = document.createElement("canvas"); }
        var pWebGLContext = null;

        try  {
            pWebGLContext = pCanvas.getContext("webgl", pOptions) || pCanvas.getContext("experimental-webgl", pOptions);
        } catch (e) {
            if (has("DEBUG")) {
                throw e;
            }
        }

        if (isDefAndNotNull(pWebGLContext)) {
            if (has("WEBGL.DEBUG")) {
                return makeDebugContext(setupContext(pWebGLContext));
            } else {
                return setupContext(pWebGLContext);
            }
        }

        //debug_warning("cannot get 3d device");
        return null;
    }
    exports.createContext = createContext;

    (function (pWebGLContext) {
        if (!pWebGLContext) {
            return;
        }

        exports.maxTextureSize = pWebGLContext.getParameter(3379 /* MAX_TEXTURE_SIZE */);
        exports.maxCubeMapTextureSize = pWebGLContext.getParameter(34076 /* MAX_CUBE_MAP_TEXTURE_SIZE */);
        exports.maxViewPortSize = pWebGLContext.getParameter(3386 /* MAX_VIEWPORT_DIMS */);

        exports.maxTextureImageUnits = pWebGLContext.getParameter(34930 /* MAX_TEXTURE_IMAGE_UNITS */);
        exports.maxVertexAttributes = pWebGLContext.getParameter(34921 /* MAX_VERTEX_ATTRIBS */);
        exports.maxVertexTextureImageUnits = pWebGLContext.getParameter(35660 /* MAX_VERTEX_TEXTURE_IMAGE_UNITS */);
        exports.maxCombinedTextureImageUnits = pWebGLContext.getParameter(35661 /* MAX_COMBINED_TEXTURE_IMAGE_UNITS */);

        exports.stencilBits = pWebGLContext.getParameter(3415 /* STENCIL_BITS */);
        exports.colorBits = [
            pWebGLContext.getParameter(3410 /* RED_BITS */),
            pWebGLContext.getParameter(3411 /* GREEN_BITS */),
            pWebGLContext.getParameter(3412 /* BLUE_BITS */)
        ];

        exports.alphaBits = pWebGLContext.getParameter(3413 /* ALPHA_BITS */);
        exports.multisampleType = pWebGLContext.getParameter(32938 /* SAMPLE_COVERAGE_VALUE */);

        pSupportedExtensionList = pWebGLContext.getSupportedExtensions();

        if (has("DEBUG")) {
            //pSupportedExtensionList.push(WEBGL.DEBUG_SHADERS, WEBGL.DEBUG_RENDERER_INFO);
        }
        isSupported = true;

        exports.isANGLE = checkIsAngle(pWebGLContext);

        if (has("DEBUG")) {
            logger.log("WebGL running under " + (exports.isANGLE ? "ANGLE/DirectX" : "Native GL"));
        }
    })(exports.createContext());

    function hasExtension(sExtName) {
        for (var i = 0; i < pSupportedExtensionList.length; ++i) {
            if (pSupportedExtensionList[i].search(sExtName) != -1) {
                return true;
            }
        }

        return false;
    }
    exports.hasExtension = hasExtension;

    function getWebGLUsage(iFlags) {
        if (bf.testAny(iFlags, 2 /* DYNAMIC */)) {
            return 35048 /* DYNAMIC_DRAW */;
        } else if (bf.testAny(iFlags, 128 /* STREAM */)) {
            return 35040 /* STREAM_DRAW */;
        }

        return 35044 /* STATIC_DRAW */;
    }
    exports.getWebGLUsage = getWebGLUsage;

    function getWebGLFormat(eFormat) {
        switch (eFormat) {
            case 1 /* L8 */:
            case 2 /* L16 */:
                return 6409 /* LUMINANCE */;

            case 3 /* A8 */:
                return 6406 /* ALPHA */;

            case 4 /* A4L4 */:
            case 5 /* BYTE_LA */:
                return 6410 /* LUMINANCE_ALPHA */;

            case 6 /* R5G6B5 */:
                return 0;
            case 7 /* B5G6R5 */:
                return 6407 /* RGB */;
            case 31 /* R3G3B2 */:
                return 0;
            case 8 /* A4R4G4B4 */:
            case 9 /* A1R5G5B5 */:
                return 6408 /* RGBA */;

            case 10 /* R8G8B8 */:
            case 11 /* B8G8R8 */:
                return 6407 /* RGB */;

            case 12 /* A8R8G8B8 */:
            case 13 /* A8B8G8R8 */:
                return 6408 /* RGBA */;

            case 14 /* B8G8R8A8 */:
            case 28 /* R8G8B8A8 */:
            case 26 /* X8R8G8B8 */:
            case 27 /* X8B8G8R8 */:
                return 6408 /* RGBA */;

            case 15 /* A2R10G10B10 */:
                return 0;
            case 16 /* A2B10G10R10 */:
                return 6408 /* RGBA */;

            case 17 /* DXT1 */:
                return 33777 /* COMPRESSED_RGBA_S3TC_DXT1_EXT */;
            case 18 /* DXT2 */:
                return 0;
            case 19 /* DXT3 */:
                return 33778 /* COMPRESSED_RGBA_S3TC_DXT3_EXT */;
            case 20 /* DXT4 */:
                return 0;
            case 21 /* DXT5 */:
                return 33779 /* COMPRESSED_RGBA_S3TC_DXT5_EXT */;
            case 32 /* FLOAT16_R */:
                return 0;
            case 22 /* FLOAT16_RGB */:
                return 6407 /* RGB */;
            case 23 /* FLOAT16_RGBA */:
                return 6408 /* RGBA */;
            case 33 /* FLOAT32_R */:
                return 0;
            case 24 /* FLOAT32_RGB */:
                return 6407 /* RGB */;
            case 25 /* FLOAT32_RGBA */:
                return 6408 /* RGBA */;
            case 35 /* FLOAT16_GR */:
            case 36 /* FLOAT32_GR */:
                return 0;

            case 29 /* FLOAT32_DEPTH */:
            case 46 /* DEPTH32 */:
            case 45 /* DEPTH16 */:
            case 44 /* DEPTH8 */:
                return 6402 /* DEPTH_COMPONENT */;

            case 47 /* DEPTH24STENCIL8 */:
                return 34041 /* DEPTH_STENCIL */;

            case 30 /* SHORT_RGBA */:
                return 6408 /* RGBA */;
            case 34 /* SHORT_GR */:
                return 0;
            case 37 /* SHORT_RGB */:
                return 6407 /* RGB */;

            case 38 /* PVRTC_RGB2 */:
                return 35841 /* COMPRESSED_RGB_PVRTC_2BPPV1_IMG */;
            case 39 /* PVRTC_RGBA2 */:
                return 35843 /* COMPRESSED_RGBA_PVRTC_2BPPV1_IMG */;
            case 40 /* PVRTC_RGB4 */:
                return 35840 /* COMPRESSED_RGB_PVRTC_4BPPV1_IMG */;
            case 41 /* PVRTC_RGBA4 */:
                return 35842 /* COMPRESSED_RGBA_PVRTC_4BPPV1_IMG */;

            case 42 /* R8 */:
            case 43 /* RG8 */:
                return 0;

            default:
                logger.warn("getWebGLFormat unknown format", eFormat);
                return 0;
        }
    }
    exports.getWebGLFormat = getWebGLFormat;

    function isWebGLFormatSupport(eFormat) {
        switch (eFormat) {
            case 17 /* DXT1 */:
            case 19 /* DXT3 */:
            case 21 /* DXT5 */:
                return exports.hasExtension(exports.WEBGL_COMPRESSED_TEXTURE_S3TC);
            case 38 /* PVRTC_RGB2 */:
            case 39 /* PVRTC_RGBA2 */:
            case 40 /* PVRTC_RGB4 */:
            case 41 /* PVRTC_RGBA4 */:
                return exports.hasExtension(exports.WEBGL_COMPRESSED_TEXTURE_PVRTC);
            case 46 /* DEPTH32 */:
            case 45 /* DEPTH16 */:
            case 47 /* DEPTH24STENCIL8 */:
                return exports.hasExtension(exports.WEBGL_DEPTH_TEXTURE);
            case 46 /* DEPTH32 */:
            case 45 /* DEPTH16 */:
            case 47 /* DEPTH24STENCIL8 */:
                return exports.hasExtension(exports.WEBGL_DEPTH_TEXTURE);
            case 22 /* FLOAT16_RGB */:
            case 23 /* FLOAT16_RGBA */:
                return exports.hasExtension(exports.OES_TEXTURE_HALF_FLOAT);
            case 24 /* FLOAT32_RGB */:
            case 25 /* FLOAT32_RGBA */:
                return exports.hasExtension(exports.OES_TEXTURE_FLOAT);
        }

        if (exports.getWebGLFormat(eFormat) && exports.getWebGLDataType(eFormat)) {
            // switch(eFormat)
            // {
            //     case AEPixelFormats.FLOAT32_DEPTH:
            //     case AEPixelFormats.L16:
            //         return false;
            // }
            return true;
        }

        return false;
    }
    exports.isWebGLFormatSupport = isWebGLFormatSupport;

    function getWebGLDataType(eFormat) {
        switch (eFormat) {
            case 1 /* L8 */:
                return 5121 /* UNSIGNED_BYTE */;
            case 2 /* L16 */:
                //return gl.UNSIGNED_SHORT;
                return 5121 /* UNSIGNED_BYTE */;

            case 3 /* A8 */:
                return 5121 /* UNSIGNED_BYTE */;

            case 4 /* A4L4 */:
                return 0;
            case 5 /* BYTE_LA */:
                return 5121 /* UNSIGNED_BYTE */;

            case 6 /* R5G6B5 */:
            case 7 /* B5G6R5 */:
                return 33635 /* UNSIGNED_SHORT_5_6_5 */;
            case 31 /* R3G3B2 */:
                return 0;
            case 8 /* A4R4G4B4 */:
                return 32819 /* UNSIGNED_SHORT_4_4_4_4 */;
            case 9 /* A1R5G5B5 */:
                return 32820 /* UNSIGNED_SHORT_5_5_5_1 */;

            case 10 /* R8G8B8 */:
            case 11 /* B8G8R8 */:
            case 12 /* A8R8G8B8 */:
            case 13 /* A8B8G8R8 */:
            case 14 /* B8G8R8A8 */:
            case 28 /* R8G8B8A8 */:
            case 26 /* X8R8G8B8 */:
            case 27 /* X8B8G8R8 */:
                return 5121 /* UNSIGNED_BYTE */;

            case 15 /* A2R10G10B10 */:
                return 0;
            case 16 /* A2B10G10R10 */:
                return 0;

            case 17 /* DXT1 */:
            case 18 /* DXT2 */:
            case 19 /* DXT3 */:
            case 20 /* DXT4 */:
            case 21 /* DXT5 */:
                return 0;

            case 32 /* FLOAT16_R */:
            case 22 /* FLOAT16_RGB */:
            case 23 /* FLOAT16_RGBA */:
                return 36193 /* HALF_FLOAT_OES */;

            case 33 /* FLOAT32_R */:
            case 24 /* FLOAT32_RGB */:
            case 25 /* FLOAT32_RGBA */:
            case 35 /* FLOAT16_GR */:
            case 36 /* FLOAT32_GR */:
                return 5126 /* FLOAT */;

            case 29 /* FLOAT32_DEPTH */:
                return 5126 /* FLOAT */;

            case 44 /* DEPTH8 */:
                return 5121 /* UNSIGNED_BYTE */;
            case 45 /* DEPTH16 */:
                return 5123 /* UNSIGNED_SHORT */;
            case 46 /* DEPTH32 */:
                return 5125 /* UNSIGNED_INT */;
            case 47 /* DEPTH24STENCIL8 */:
                return 33639 /* UNSIGNED_INT_24_8_WEBGL */;

            case 30 /* SHORT_RGBA */:
            case 34 /* SHORT_GR */:
            case 37 /* SHORT_RGB */:
                return 5123 /* UNSIGNED_SHORT */;

            case 38 /* PVRTC_RGB2 */:
            case 39 /* PVRTC_RGBA2 */:
            case 40 /* PVRTC_RGB4 */:
            case 41 /* PVRTC_RGBA4 */:
                return 0;

            case 42 /* R8 */:
            case 43 /* RG8 */:
                return 5121 /* UNSIGNED_BYTE */;

            default:
                logger.critical("getWebGLFormat unknown format");
                return 0;
        }
    }
    exports.getWebGLDataType = getWebGLDataType;

    function getWebGLInternalFormat(eFormat) {
        if (!pixelUtil.isCompressed(eFormat)) {
            return exports.getWebGLFormat(eFormat);
        } else {
            switch (eFormat) {
                case 17 /* DXT1 */:
                    return 33777 /* COMPRESSED_RGBA_S3TC_DXT1_EXT */;
                case 18 /* DXT2 */:
                    return 0;
                case 19 /* DXT3 */:
                    return 33778 /* COMPRESSED_RGBA_S3TC_DXT3_EXT */;
                case 20 /* DXT4 */:
                    return 0;
                case 21 /* DXT5 */:
                    return 33779 /* COMPRESSED_RGBA_S3TC_DXT5_EXT */;
                case 38 /* PVRTC_RGB2 */:
                    return 35841 /* COMPRESSED_RGB_PVRTC_2BPPV1_IMG */;
                case 39 /* PVRTC_RGBA2 */:
                    return 35843 /* COMPRESSED_RGBA_PVRTC_2BPPV1_IMG */;
                case 40 /* PVRTC_RGB4 */:
                    return 35840 /* COMPRESSED_RGB_PVRTC_4BPPV1_IMG */;
                case 41 /* PVRTC_RGBA4 */:
                    return 35842 /* COMPRESSED_RGBA_PVRTC_4BPPV1_IMG */;
            }
        }
    }
    exports.getWebGLInternalFormat = getWebGLInternalFormat;

    function getWebGLPrimitiveType(eType) {
        switch (eType) {
            case 0 /* POINTLIST */:
                return 0 /* POINTS */;
            case 1 /* LINELIST */:
                return 1 /* LINES */;
            case 2 /* LINELOOP */:
                return 2 /* LINE_LOOP */;
            case 3 /* LINESTRIP */:
                return 3 /* LINE_STRIP */;
            case 4 /* TRIANGLELIST */:
                return 4 /* TRIANGLES */;
            case 5 /* TRIANGLESTRIP */:
                return 5 /* TRIANGLE_STRIP */;
            case 6 /* TRIANGLEFAN */:
                return 6 /* TRIANGLE_FAN */;
        }

        return 0 /* POINTS */;
    }
    exports.getWebGLPrimitiveType = getWebGLPrimitiveType;

    //не знаю что делает эта функция
    function getClosestWebGLInternalFormat(eFormat, isHWGamma) {
        if (typeof isHWGamma === "undefined") { isHWGamma = false; }
        var iGLFormat = exports.getWebGLInternalFormat(eFormat);

        if (iGLFormat === 0 /* NONE */) {
            if (isHWGamma) {
                // TODO not supported
                return 0;
            } else {
                return 6408 /* RGBA */;
            }
        } else {
            return iGLFormat;
        }
    }
    exports.getClosestWebGLInternalFormat = getClosestWebGLInternalFormat;

    /**
    * Convert GL format to EPixelFormat.
    */
    function getClosestAkraFormat(iGLFormat, iGLDataType) {
        switch (iGLFormat) {
            case 35841 /* COMPRESSED_RGB_PVRTC_2BPPV1_IMG */:
                return exports.hasExtension(exports.WEBGL_COMPRESSED_TEXTURE_PVRTC) ? 38 /* PVRTC_RGB2 */ : 12 /* A8R8G8B8 */;
            case 35843 /* COMPRESSED_RGBA_PVRTC_2BPPV1_IMG */:
                return exports.hasExtension(exports.WEBGL_COMPRESSED_TEXTURE_PVRTC) ? 39 /* PVRTC_RGBA2 */ : 12 /* A8R8G8B8 */;
            case 35840 /* COMPRESSED_RGB_PVRTC_4BPPV1_IMG */:
                return exports.hasExtension(exports.WEBGL_COMPRESSED_TEXTURE_PVRTC) ? 40 /* PVRTC_RGB4 */ : 12 /* A8R8G8B8 */;
            case 35842 /* COMPRESSED_RGBA_PVRTC_4BPPV1_IMG */:
                return exports.hasExtension(exports.WEBGL_COMPRESSED_TEXTURE_PVRTC) ? 41 /* PVRTC_RGBA4 */ : 12 /* A8R8G8B8 */;

            case 6409 /* LUMINANCE */:
                return 1 /* L8 */;
            case 6406 /* ALPHA */:
                return 3 /* A8 */;
            case 6410 /* LUMINANCE_ALPHA */:
                return 5 /* BYTE_LA */;

            case 6407 /* RGB */:
                switch (iGLDataType) {
                    case 33635 /* UNSIGNED_SHORT_5_6_5 */:
                        return 7 /* B5G6R5 */;
                    default:
                        return 10 /* R8G8B8 */;
                }

            case 6408 /* RGBA */:
                switch (iGLDataType) {
                    case 32820 /* UNSIGNED_SHORT_5_5_5_1 */:
                        return 9 /* A1R5G5B5 */;
                    case 32819 /* UNSIGNED_SHORT_4_4_4_4 */:
                        return 8 /* A4R4G4B4 */;
                    case 5126 /* FLOAT */:
                        return 25 /* FLOAT32_RGBA */;
                    default:
                        return 28 /* R8G8B8A8 */;
                }

            case 32993 /* BGRA */:
                return 13 /* A8B8G8R8 */;

            case 33776 /* COMPRESSED_RGB_S3TC_DXT1_EXT */:
            case 33777 /* COMPRESSED_RGBA_S3TC_DXT1_EXT */:
                return exports.hasExtension(exports.WEBGL_COMPRESSED_TEXTURE_S3TC) ? 17 /* DXT1 */ : 12 /* A8R8G8B8 */;

            case 33778 /* COMPRESSED_RGBA_S3TC_DXT3_EXT */:
                return exports.hasExtension(exports.WEBGL_COMPRESSED_TEXTURE_S3TC) ? 19 /* DXT3 */ : 12 /* A8R8G8B8 */;
            case 33779 /* COMPRESSED_RGBA_S3TC_DXT5_EXT */:
                return exports.hasExtension(exports.WEBGL_COMPRESSED_TEXTURE_S3TC) ? 21 /* DXT5 */ : 12 /* A8R8G8B8 */;

            case 33321 /* R8_EXT */:
                return exports.hasExtension(exports.EXT_TEXTURE_RG) ? 42 /* R8 */ : 12 /* A8R8G8B8 */;
            case 33323 /* RG8_EXT */:
                return exports.hasExtension(exports.EXT_TEXTURE_RG) ? 43 /* RG8 */ : 12 /* A8R8G8B8 */;

            case 6402 /* DEPTH_COMPONENT */:
                switch (iGLDataType) {
                    case 5126 /* FLOAT */:
                        return 29 /* FLOAT32_DEPTH */;
                    case 5125 /* UNSIGNED_INT */:
                        return 46 /* DEPTH32 */;
                    case 5123 /* UNSIGNED_SHORT */:
                        return 45 /* DEPTH16 */;
                    case 5121 /* UNSIGNED_BYTE */:
                        return 44 /* DEPTH8 */;
                }

            case 34041 /* DEPTH_STENCIL */:
                return 47 /* DEPTH24STENCIL8 */;

            default:
                //TODO: not supported
                return 12 /* A8R8G8B8 */;
        }
    }
    exports.getClosestAkraFormat = getClosestAkraFormat;

    function optionalPO2(iValue) {
        if (exports.hasNonPowerOf2Textures) {
            return iValue;
        } else {
            return math.ceilingPowerOfTwo(iValue);
        }
    }
    exports.optionalPO2 = optionalPO2;

    function convertToWebGLformat(pSource, pDest) {
        if (pDest.format == 8 /* A4R4G4B4 */) {
            // Convert PF_A4R4G4B4 -> PF_B4G4R4A4
            // Reverse pixel order
            var iSrcPtr = (pSource.left + pSource.top * pSource.rowPitch + pSource.front * pSource.slicePitch);
            var iDstPtr = (pDest.left + pDest.top * pDest.rowPitch + pDest.front * pDest.slicePitch);
            var iSrcSliceSkip = pSource.getSliceSkip();
            var iDstSliceSkip = pDest.getSliceSkip();
            var k = pSource.right - pSource.left;
            var x = 0, y = 0, z = 0;

            for (z = pSource.front; z < pSource.back; z++) {
                for (y = pSource.top; y < pSource.bottom; y++) {
                    for (x = 0; x < k; x++) {
                        pDest[iDstPtr + x] = ((pSource[iSrcPtr + x] & 0x000F) << 12) | ((pSource[iSrcPtr + x] & 0x00F0) << 4) | ((pSource[iSrcPtr + x] & 0x0F00) >> 4) | ((pSource[iSrcPtr + x] & 0xF000) >> 12);
                    }

                    iSrcPtr += pSource.rowPitch;
                    iDstPtr += pDest.rowPitch;
                }

                iSrcPtr += iSrcSliceSkip;
                iDstPtr += iDstSliceSkip;
            }
        }
    }
    exports.convertToWebGLformat = convertToWebGLformat;

    function checkFBOAttachmentFormat(eFormat) {
        if (eFormat === 28 /* R8G8B8A8 */ || eFormat === 10 /* R8G8B8 */) {
            return true;
        } else if (eFormat === 13 /* A8B8G8R8 */) {
            return true;
        } else if (eFormat === 25 /* FLOAT32_RGBA */) {
            // return hasExtension(WEBGL.COLOR_BUFFER_FLOAT);
            return exports.hasExtension(exports.OES_TEXTURE_FLOAT);
        } else if (eFormat === 23 /* FLOAT16_RGBA */) {
            // return hasExtension(EXT_COLOR_BUFFER_HALF_FLOAT);
            return exports.hasExtension(exports.OES_TEXTURE_HALF_FLOAT);
        } else if (eFormat === 46 /* DEPTH32 */) {
            return true;
        } else {
            return false;
        }
    }
    exports.checkFBOAttachmentFormat = checkFBOAttachmentFormat;

    function checkReadPixelFormat(eFormat) {
        if (eFormat === 28 /* R8G8B8A8 */ || eFormat === 10 /* R8G8B8 */) {
            return true;
        } else if (eFormat === 25 /* FLOAT32_RGBA */) {
            //hasExtension(WEBGL.COLOR_BUFFER_FLOAT) || hasExtension(EXT_COLOR_BUFFER_HALF_FLOAT);
            return false;
        } else {
            return false;
        }
    }
    exports.checkReadPixelFormat = checkReadPixelFormat;

    function checkCopyTexImage(eFormat) {
        switch (eFormat) {
            case 28 /* R8G8B8A8 */:
            case 10 /* R8G8B8 */:
            case 1 /* L8 */:
            case 2 /* L16 */:
            case 3 /* A8 */:
                return true;

            default:
                return false;
        }
    }
    exports.checkCopyTexImage = checkCopyTexImage;

    function getSupportedAlternative(eFormat) {
        if (exports.checkFBOAttachmentFormat(eFormat)) {
            return eFormat;
        }

        /// Find first alternative
        var pct = pixelUtil.getComponentType(eFormat);

        switch (pct) {
            case 0 /* BYTE */:
                eFormat = 12 /* A8R8G8B8 */;
                break;
            case 1 /* SHORT */:
                eFormat = 30 /* SHORT_RGBA */;
                break;
            case 3 /* FLOAT16 */:
                eFormat = 23 /* FLOAT16_RGBA */;
                break;
            case 4 /* FLOAT32 */:
                eFormat = 25 /* FLOAT32_RGBA */;
                break;
            case 5 /* COUNT */:
            default:
                break;
        }

        if (exports.checkFBOAttachmentFormat(eFormat)) {
            return eFormat;
        }

        /// If none at all, return to default
        return 12 /* A8R8G8B8 */;
    }
    exports.getSupportedAlternative = getSupportedAlternative;
});
//# sourceMappingURL=webgl.js.map
