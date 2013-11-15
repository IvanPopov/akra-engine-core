/// <reference path="../idl/3d-party/webgl.d.ts" />
/// <reference path="../idl/3d-party/has.d.ts" />
/// <reference path="../idl/AEPixelFormats.ts" />
/// <reference path="../idl/AIHardwareBuffer.ts" />
/// <reference path="../idl/AIPixelBox.ts" />
/// <reference path="../idl/AEPrimitiveTypes.ts" />
define(["require", "exports", "webgl/webgl", "util/logger", "type", "util/bitflags", "math/math", "pixelUtil/pixelUtil"], function(require, exports, __webgl__, __logger__, __type__, __bf__, __math__, __pixelUtil__) {
    var webgl = __webgl__;
    var logger = __logger__;
    var type = __type__;
    var bf = __bf__;
    var math = __math__;
    var pixelUtil = __pixelUtil__;

    var isDef = type.isDef;
    var isDefAndNotNull = type.isDefAndNotNull;
    var isFunction = type.isFunction;
    var isNull = type.isNull;

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

        var pVertexShader = pWebGLContext.createShader(gl.VERTEX_SHADER);
        var pFragmentShader = pWebGLContext.createShader(gl.FRAGMENT_SHADER);

        pWebGLContext.shaderSource(pVertexShader, sVertex);
        pWebGLContext.compileShader(pVertexShader);
        pWebGLContext.shaderSource(pFragmentShader, sFragment);
        pWebGLContext.compileShader(pFragmentShader);

        pWebGLContext.attachShader(pProgram, pVertexShader);
        pWebGLContext.attachShader(pProgram, pFragmentShader);

        pWebGLContext.linkProgram(pProgram);

        if (!pWebGLContext.getProgramParameter(pProgram, gl.LINK_STATUS)) {
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

        exports.maxTextureSize = pWebGLContext.getParameter(gl.MAX_TEXTURE_SIZE);
        exports.maxCubeMapTextureSize = pWebGLContext.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
        exports.maxViewPortSize = pWebGLContext.getParameter(gl.MAX_VIEWPORT_DIMS);

        exports.maxTextureImageUnits = pWebGLContext.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        exports.maxVertexAttributes = pWebGLContext.getParameter(gl.MAX_VERTEX_ATTRIBS);
        exports.maxVertexTextureImageUnits = pWebGLContext.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        exports.maxCombinedTextureImageUnits = pWebGLContext.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);

        exports.stencilBits = pWebGLContext.getParameter(gl.STENCIL_BITS);
        exports.colorBits = [
            pWebGLContext.getParameter(gl.RED_BITS),
            pWebGLContext.getParameter(gl.GREEN_BITS),
            pWebGLContext.getParameter(gl.BLUE_BITS)
        ];

        exports.alphaBits = pWebGLContext.getParameter(gl.ALPHA_BITS);
        exports.multisampleType = pWebGLContext.getParameter(gl.SAMPLE_COVERAGE_VALUE);

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
        if (bf.testAny(iFlags, AEHardwareBufferFlags.DYNAMIC)) {
            return gl.DYNAMIC_DRAW;
        } else if (bf.testAny(iFlags, AEHardwareBufferFlags.STREAM)) {
            return gl.STREAM_DRAW;
        }

        return gl.STATIC_DRAW;
    }
    exports.getWebGLUsage = getWebGLUsage;

    function getWebGLFormat(eFormat) {
        switch (eFormat) {
            case AEPixelFormats.L8:
            case AEPixelFormats.L16:
                return gl.LUMINANCE;

            case AEPixelFormats.A8:
                return gl.ALPHA;

            case AEPixelFormats.A4L4:
            case AEPixelFormats.BYTE_LA:
                return gl.LUMINANCE_ALPHA;

            case AEPixelFormats.R5G6B5:
                return 0;
            case AEPixelFormats.B5G6R5:
                return gl.RGB;
            case AEPixelFormats.R3G3B2:
                return 0;
            case AEPixelFormats.A4R4G4B4:
            case AEPixelFormats.A1R5G5B5:
                return gl.RGBA;

            case AEPixelFormats.R8G8B8:
            case AEPixelFormats.B8G8R8:
                return gl.RGB;

            case AEPixelFormats.A8R8G8B8:
            case AEPixelFormats.A8B8G8R8:
                return gl.RGBA;

            case AEPixelFormats.B8G8R8A8:
            case AEPixelFormats.R8G8B8A8:
            case AEPixelFormats.X8R8G8B8:
            case AEPixelFormats.X8B8G8R8:
                return gl.RGBA;

            case AEPixelFormats.A2R10G10B10:
                return 0;
            case AEPixelFormats.A2B10G10R10:
                return gl.RGBA;

            case AEPixelFormats.DXT1:
                return gl.COMPRESSED_RGBA_S3TC_DXT1_EXT;
            case AEPixelFormats.DXT2:
                return 0;
            case AEPixelFormats.DXT3:
                return gl.COMPRESSED_RGBA_S3TC_DXT3_EXT;
            case AEPixelFormats.DXT4:
                return 0;
            case AEPixelFormats.DXT5:
                return gl.COMPRESSED_RGBA_S3TC_DXT5_EXT;
            case AEPixelFormats.FLOAT16_R:
                return 0;
            case AEPixelFormats.FLOAT16_RGB:
                return gl.RGB;
            case AEPixelFormats.FLOAT16_RGBA:
                return gl.RGBA;
            case AEPixelFormats.FLOAT32_R:
                return 0;
            case AEPixelFormats.FLOAT32_RGB:
                return gl.RGB;
            case AEPixelFormats.FLOAT32_RGBA:
                return gl.RGBA;
            case AEPixelFormats.FLOAT16_GR:
            case AEPixelFormats.FLOAT32_GR:
                return 0;

            case AEPixelFormats.FLOAT32_DEPTH:
            case AEPixelFormats.DEPTH32:
            case AEPixelFormats.DEPTH16:
            case AEPixelFormats.DEPTH8:
                return gl.DEPTH_COMPONENT;

            case AEPixelFormats.DEPTH24STENCIL8:
                return gl.DEPTH_STENCIL;

            case AEPixelFormats.SHORT_RGBA:
                return gl.RGBA;
            case AEPixelFormats.SHORT_GR:
                return 0;
            case AEPixelFormats.SHORT_RGB:
                return gl.RGB;

            case AEPixelFormats.PVRTC_RGB2:
                return gl.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
            case AEPixelFormats.PVRTC_RGBA2:
                return gl.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
            case AEPixelFormats.PVRTC_RGB4:
                return gl.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
            case AEPixelFormats.PVRTC_RGBA4:
                return gl.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;

            case AEPixelFormats.R8:
            case AEPixelFormats.RG8:
                return 0;

            default:
                logger.warn("getWebGLFormat unknown format", eFormat);
                return 0;
        }
    }
    exports.getWebGLFormat = getWebGLFormat;

    function isWebGLFormatSupport(eFormat) {
        switch (eFormat) {
            case AEPixelFormats.DXT1:
            case AEPixelFormats.DXT3:
            case AEPixelFormats.DXT5:
                return webgl.hasExtension(exports.WEBGL_COMPRESSED_TEXTURE_S3TC);
            case AEPixelFormats.PVRTC_RGB2:
            case AEPixelFormats.PVRTC_RGBA2:
            case AEPixelFormats.PVRTC_RGB4:
            case AEPixelFormats.PVRTC_RGBA4:
                return webgl.hasExtension(exports.WEBGL_COMPRESSED_TEXTURE_PVRTC);
            case AEPixelFormats.DEPTH32:
            case AEPixelFormats.DEPTH16:
            case AEPixelFormats.DEPTH24STENCIL8:
                return webgl.hasExtension(exports.WEBGL_DEPTH_TEXTURE);
            case AEPixelFormats.DEPTH32:
            case AEPixelFormats.DEPTH16:
            case AEPixelFormats.DEPTH24STENCIL8:
                return webgl.hasExtension(exports.WEBGL_DEPTH_TEXTURE);
            case AEPixelFormats.FLOAT16_RGB:
            case AEPixelFormats.FLOAT16_RGBA:
                return webgl.hasExtension(exports.OES_TEXTURE_HALF_FLOAT);
            case AEPixelFormats.FLOAT32_RGB:
            case AEPixelFormats.FLOAT32_RGBA:
                return webgl.hasExtension(exports.OES_TEXTURE_FLOAT);
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
            case AEPixelFormats.L8:
                return gl.UNSIGNED_BYTE;
            case AEPixelFormats.L16:
                //return gl.UNSIGNED_SHORT;
                return gl.UNSIGNED_BYTE;

            case AEPixelFormats.A8:
                return gl.UNSIGNED_BYTE;

            case AEPixelFormats.A4L4:
                return 0;
            case AEPixelFormats.BYTE_LA:
                return gl.UNSIGNED_BYTE;

            case AEPixelFormats.R5G6B5:
            case AEPixelFormats.B5G6R5:
                return gl.UNSIGNED_SHORT_5_6_5;
            case AEPixelFormats.R3G3B2:
                return 0;
            case AEPixelFormats.A4R4G4B4:
                return gl.UNSIGNED_SHORT_4_4_4_4;
            case AEPixelFormats.A1R5G5B5:
                return gl.UNSIGNED_SHORT_5_5_5_1;

            case AEPixelFormats.R8G8B8:
            case AEPixelFormats.B8G8R8:
            case AEPixelFormats.A8R8G8B8:
            case AEPixelFormats.A8B8G8R8:
            case AEPixelFormats.B8G8R8A8:
            case AEPixelFormats.R8G8B8A8:
            case AEPixelFormats.X8R8G8B8:
            case AEPixelFormats.X8B8G8R8:
                return gl.UNSIGNED_BYTE;

            case AEPixelFormats.A2R10G10B10:
                return 0;
            case AEPixelFormats.A2B10G10R10:
                return 0;

            case AEPixelFormats.DXT1:
            case AEPixelFormats.DXT2:
            case AEPixelFormats.DXT3:
            case AEPixelFormats.DXT4:
            case AEPixelFormats.DXT5:
                return 0;

            case AEPixelFormats.FLOAT16_R:
            case AEPixelFormats.FLOAT16_RGB:
            case AEPixelFormats.FLOAT16_RGBA:
                return gl.HALF_FLOAT_OES;

            case AEPixelFormats.FLOAT32_R:
            case AEPixelFormats.FLOAT32_RGB:
            case AEPixelFormats.FLOAT32_RGBA:
            case AEPixelFormats.FLOAT16_GR:
            case AEPixelFormats.FLOAT32_GR:
                return gl.FLOAT;

            case AEPixelFormats.FLOAT32_DEPTH:
                return gl.FLOAT;

            case AEPixelFormats.DEPTH8:
                return gl.UNSIGNED_BYTE;
            case AEPixelFormats.DEPTH16:
                return gl.UNSIGNED_SHORT;
            case AEPixelFormats.DEPTH32:
                return gl.UNSIGNED_INT;
            case AEPixelFormats.DEPTH24STENCIL8:
                return gl.UNSIGNED_INT_24_8_WEBGL;

            case AEPixelFormats.SHORT_RGBA:
            case AEPixelFormats.SHORT_GR:
            case AEPixelFormats.SHORT_RGB:
                return gl.UNSIGNED_SHORT;

            case AEPixelFormats.PVRTC_RGB2:
            case AEPixelFormats.PVRTC_RGBA2:
            case AEPixelFormats.PVRTC_RGB4:
            case AEPixelFormats.PVRTC_RGBA4:
                return 0;

            case AEPixelFormats.R8:
            case AEPixelFormats.RG8:
                return gl.UNSIGNED_BYTE;

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
                case AEPixelFormats.DXT1:
                    return gl.COMPRESSED_RGBA_S3TC_DXT1_EXT;
                case AEPixelFormats.DXT2:
                    return 0;
                case AEPixelFormats.DXT3:
                    return gl.COMPRESSED_RGBA_S3TC_DXT3_EXT;
                case AEPixelFormats.DXT4:
                    return 0;
                case AEPixelFormats.DXT5:
                    return gl.COMPRESSED_RGBA_S3TC_DXT5_EXT;
                case AEPixelFormats.PVRTC_RGB2:
                    return gl.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
                case AEPixelFormats.PVRTC_RGBA2:
                    return gl.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
                case AEPixelFormats.PVRTC_RGB4:
                    return gl.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
                case AEPixelFormats.PVRTC_RGBA4:
                    return gl.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
            }
        }
    }
    exports.getWebGLInternalFormat = getWebGLInternalFormat;

    function getWebGLPrimitiveType(eType) {
        switch (eType) {
            case AEPrimitiveTypes.POINTLIST:
                return gl.POINTS;
            case AEPrimitiveTypes.LINELIST:
                return gl.LINES;
            case AEPrimitiveTypes.LINELOOP:
                return gl.LINE_LOOP;
            case AEPrimitiveTypes.LINESTRIP:
                return gl.LINE_STRIP;
            case AEPrimitiveTypes.TRIANGLELIST:
                return gl.TRIANGLES;
            case AEPrimitiveTypes.TRIANGLESTRIP:
                return gl.TRIANGLE_STRIP;
            case AEPrimitiveTypes.TRIANGLEFAN:
                return gl.TRIANGLE_FAN;
        }

        return gl.POINTS;
    }
    exports.getWebGLPrimitiveType = getWebGLPrimitiveType;

    //не знаю что делает эта функция
    function getClosestWebGLInternalFormat(eFormat, isHWGamma) {
        if (typeof isHWGamma === "undefined") { isHWGamma = false; }
        var iGLFormat = webgl.getWebGLInternalFormat(eFormat);

        if (iGLFormat === gl.NONE) {
            if (isHWGamma) {
                // TODO not supported
                return 0;
            } else {
                return gl.RGBA;
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
            case gl.COMPRESSED_RGB_PVRTC_2BPPV1_IMG:
                return webgl.hasExtension(exports.WEBGL_COMPRESSED_TEXTURE_PVRTC) ? AEPixelFormats.PVRTC_RGB2 : AEPixelFormats.A8R8G8B8;
            case gl.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG:
                return webgl.hasExtension(exports.WEBGL_COMPRESSED_TEXTURE_PVRTC) ? AEPixelFormats.PVRTC_RGBA2 : AEPixelFormats.A8R8G8B8;
            case gl.COMPRESSED_RGB_PVRTC_4BPPV1_IMG:
                return webgl.hasExtension(exports.WEBGL_COMPRESSED_TEXTURE_PVRTC) ? AEPixelFormats.PVRTC_RGB4 : AEPixelFormats.A8R8G8B8;
            case gl.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG:
                return webgl.hasExtension(exports.WEBGL_COMPRESSED_TEXTURE_PVRTC) ? AEPixelFormats.PVRTC_RGBA4 : AEPixelFormats.A8R8G8B8;

            case gl.LUMINANCE:
                return AEPixelFormats.L8;
            case gl.ALPHA:
                return AEPixelFormats.A8;
            case gl.LUMINANCE_ALPHA:
                return AEPixelFormats.BYTE_LA;

            case gl.RGB:
                switch (iGLDataType) {
                    case gl.UNSIGNED_SHORT_5_6_5:
                        return AEPixelFormats.B5G6R5;
                    default:
                        return AEPixelFormats.R8G8B8;
                }

            case gl.RGBA:
                switch (iGLDataType) {
                    case gl.UNSIGNED_SHORT_5_5_5_1:
                        return AEPixelFormats.A1R5G5B5;
                    case gl.UNSIGNED_SHORT_4_4_4_4:
                        return AEPixelFormats.A4R4G4B4;
                    case gl.FLOAT:
                        return AEPixelFormats.FLOAT32_RGBA;
                    default:
                        return AEPixelFormats.R8G8B8A8;
                }

            case gl.BGRA:
                return AEPixelFormats.A8B8G8R8;

            case gl.COMPRESSED_RGB_S3TC_DXT1_EXT:
            case gl.COMPRESSED_RGBA_S3TC_DXT1_EXT:
                return webgl.hasExtension(exports.WEBGL_COMPRESSED_TEXTURE_S3TC) ? AEPixelFormats.DXT1 : AEPixelFormats.A8R8G8B8;

            case gl.COMPRESSED_RGBA_S3TC_DXT3_EXT:
                return webgl.hasExtension(exports.WEBGL_COMPRESSED_TEXTURE_S3TC) ? AEPixelFormats.DXT3 : AEPixelFormats.A8R8G8B8;
            case gl.COMPRESSED_RGBA_S3TC_DXT5_EXT:
                return webgl.hasExtension(exports.WEBGL_COMPRESSED_TEXTURE_S3TC) ? AEPixelFormats.DXT5 : AEPixelFormats.A8R8G8B8;

            case gl.R8_EXT:
                return webgl.hasExtension(exports.EXT_TEXTURE_RG) ? AEPixelFormats.R8 : AEPixelFormats.A8R8G8B8;
            case gl.RG8_EXT:
                return webgl.hasExtension(exports.EXT_TEXTURE_RG) ? AEPixelFormats.RG8 : AEPixelFormats.A8R8G8B8;

            case gl.DEPTH_COMPONENT:
                switch (iGLDataType) {
                    case gl.FLOAT:
                        return AEPixelFormats.FLOAT32_DEPTH;
                    case gl.UNSIGNED_INT:
                        return AEPixelFormats.DEPTH32;
                    case gl.UNSIGNED_SHORT:
                        return AEPixelFormats.DEPTH16;
                    case gl.UNSIGNED_BYTE:
                        return AEPixelFormats.DEPTH8;
                }

            case gl.DEPTH_STENCIL:
                return AEPixelFormats.DEPTH24STENCIL8;

            default:
                //TODO: not supported
                return AEPixelFormats.A8R8G8B8;
        }
    }
    exports.getClosestAkraFormat = getClosestAkraFormat;

    function optionalPO2(iValue) {
        if (webgl.hasNonPowerOf2Textures) {
            return iValue;
        } else {
            return math.ceilingPowerOfTwo(iValue);
        }
    }
    exports.optionalPO2 = optionalPO2;

    function convertToWebGLformat(pSource, pDest) {
        if (pDest.format == AEPixelFormats.A4R4G4B4) {
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
        if (eFormat === AEPixelFormats.R8G8B8A8 || eFormat === AEPixelFormats.R8G8B8) {
            return true;
        } else if (eFormat === AEPixelFormats.A8B8G8R8) {
            return true;
        } else if (eFormat === AEPixelFormats.FLOAT32_RGBA) {
            // return hasExtension(WEBGL.COLOR_BUFFER_FLOAT);
            return exports.hasExtension(exports.OES_TEXTURE_FLOAT);
        } else if (eFormat === AEPixelFormats.FLOAT16_RGBA) {
            // return hasExtension(EXT_COLOR_BUFFER_HALF_FLOAT);
            return exports.hasExtension(exports.OES_TEXTURE_HALF_FLOAT);
        } else if (eFormat === AEPixelFormats.DEPTH32) {
            return true;
        } else {
            return false;
        }
    }
    exports.checkFBOAttachmentFormat = checkFBOAttachmentFormat;

    function checkReadPixelFormat(eFormat) {
        if (eFormat === AEPixelFormats.R8G8B8A8 || eFormat === AEPixelFormats.R8G8B8) {
            return true;
        } else if (eFormat === AEPixelFormats.FLOAT32_RGBA) {
            //hasExtension(WEBGL.COLOR_BUFFER_FLOAT) || hasExtension(EXT_COLOR_BUFFER_HALF_FLOAT);
            return false;
        } else {
            return false;
        }
    }
    exports.checkReadPixelFormat = checkReadPixelFormat;

    function checkCopyTexImage(eFormat) {
        switch (eFormat) {
            case AEPixelFormats.R8G8B8A8:
            case AEPixelFormats.R8G8B8:
            case AEPixelFormats.L8:
            case AEPixelFormats.L16:
            case AEPixelFormats.A8:
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
            case AEPixelComponentTypes.BYTE:
                eFormat = AEPixelFormats.A8R8G8B8;
                break;
            case AEPixelComponentTypes.SHORT:
                eFormat = AEPixelFormats.SHORT_RGBA;
                break;
            case AEPixelComponentTypes.FLOAT16:
                eFormat = AEPixelFormats.FLOAT16_RGBA;
                break;
            case AEPixelComponentTypes.FLOAT32:
                eFormat = AEPixelFormats.FLOAT32_RGBA;
                break;
            case AEPixelComponentTypes.COUNT:
            default:
                break;
        }

        if (exports.checkFBOAttachmentFormat(eFormat)) {
            return eFormat;
        }

        /// If none at all, return to default
        return AEPixelFormats.A8R8G8B8;
    }
    exports.getSupportedAlternative = getSupportedAlternative;
});
//# sourceMappingURL=webgl.js.map
