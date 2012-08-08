/**
 * @file
 * @brief Реализация функций для взаимодествия с железом.
 * @author Ivan Popov, Igor Karateev
 * @email vantuziast@odserve.org
 */


/**
 * Типы ресурсов
 * @enum RESOURCETYPE
 */
Enum([
         SURFACE = 1,
         VOLUME,
         TEXTURE,   
         VOLUMETEXTURE,
         CUBETEXTURE,
         VERTEXBUFFER,
         INDEXBUFFER,
         FORCE_DWORD = 0x7fffffff
     ], RESOURCE_TYPE, a.RESOURCETYPE);

/**
 * Типы примитивов, доступных при рисовании.
 * @enum PRIMITIVETYPE
 */
Enum([
         POINTLIST = 0,
         LINELIST,
         LINELOOP,
         LINESTRIP,
         TRIANGLELIST,
         TRIANGLESTRIP,
         TRIANGLEFAN
     ], PRIMITIVE_TYPE, a.PRIMTYPE);

/**
 * Image formats
 * @enum IFORMAT
 */
Enum([
         RGB8 = 0x1907,
         BGR8 = 0x8060,
         RGBA8 = 0x1908,
         BGRA8 = 0x1909,
         RGBA4 = 0x8056,
         BGRA4 = 0x8059,
         RGB5_A1 = 0x8057,
         BGR5_A1 = 0x8058,
         RGB565 = 0x8D62,
         BGR565 = 0x8D63,
         RGB_DXT1 = 0x83F0,
         RGBA_DXT1 = 0x83F1,
         RGBA_DXT2 = 0x83F4,
         RGBA_DXT3 = 0x83F2,
         RGBA_DXT4 = 0x83F5,
         RGBA_DXT5 = 0x83F3
     ], IMAGE_FORMAT, a.IFORMAT);

/**
 * Image short formats
 * @enum IFORMATSHORT
 */
Enum([
         RGB = 0x1907,
         RGBA = 0x1908
     ], IFORMATSHORT, a.IFORMATSHORT);

Enum([
         TEXTURE_FLOAT              = 'texture_float',
         TEXTURE_HALF_FLOAT         = 'texture_half_float',
         COMPRESSED_TEXTURES        = 'compressed_texture',
         STANDART_DERIVATIVES       = 'standard_derivatives',
         DEBUG_SHADERS              = 'debug_shaders',
         DEBUG_RENDER_INFO          = 'debug_renderer_info',
         DEPTH_TEXTURE              = 'depth_texture',
         LOSE_CONTEXT               = 'lose_context',
         TEXTURE_FILTER_ANISOTROPIC = 'texture_filter_anisotropic'
     ],
     GRAPHICS_EXTENTIONS, a.EXTENTIONS);

/**
 * Image type
 * @enum ITYPE
 */
Enum([
         UNSIGNED_BYTE = 0x1401,
         UNSIGNED_SHORT_4_4_4_4 = 0x8033,
         UNSIGNED_SHORT_5_5_5_1 = 0x8034,
         UNSIGNED_SHORT_5_6_5 = 0x8363,
         FLOAT = 0x1406
     ], IMAGE_TYPE, a.ITYPE);


/**
 * TextureFilter
 * @enum TFILTER
 */
Enum([
         NEAREST = 0x2600,
         LINEAR = 0x2601,
         NEAREST_MIPMAP_NEAREST = 0x2700,
         LINEAR_MIPMAP_NEAREST = 0x2701,
         NEAREST_MIPMAP_LINEAR = 0x2702,
         LINEAR_MIPMAP_LINEAR = 0x2703
     ], TEXTURE_FILTER, a.TFILTER);

Enum([
        REPEAT = 0x2901,
        CLAMP_TO_EDGE = 0x812F,
        MIRRORED_REPEAT = 0x8370
    ], TEXTURE_WRAP_MODE, a.TWRAPMODE);


Enum([
         MAG_FILTER = 0x2800,
         MIN_FILTER,
         WRAP_S,
         WRAP_T
     ], TEXTURE_PARAM, a.TPARAM);

/**
 * Type usage
 * @enum BUSAGE
 */
Enum([
         STREAM_DRAW = 0x88E0,
         STATIC_DRAW = 0x88E4,
         DYNAMIC_DRAW = 0x88E8
     ], BUFFER_USAGE, a.BUSAGE);

/**
 * Type buffer
 * @enum BTYPE
 */
Enum([
         ARRAY_BUFFER = 0x8892,
         ELEMENT_ARRAY_BUFFER = 0x8893,
         FRAME_BUFFER = 0x8D40,
         RENDER_BUFFER = 0x8D41
     ], BUFFER_TYPE, a.BTYPE);

/**
 * Type attachment
 * @enum BTYPE
 */
Enum([
         COLOR_ATTACHMENT0 = 0x8CE0,
         DEPTH_ATTACHMENT = 0x8D00,
         STENCIL_ATTACHMENT = 0x8D20,
         DEPTH_STENCIL_ATTACHMENT = 0x821A
     ], ATTACHMENT_TYPE, a.ATYPE);


/**
 * Type texture
 * @enum TTYPE
 */
Enum([
         TEXTURE_2D = 0x0DE1,
         TEXTURE = 0x1702,
         TEXTURE_CUBE_MAP = 0x8513,
         TEXTURE_BINDING_CUBE_MAP = 0x8514,
         TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515,
         TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516,
         TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517,
         TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518,
         TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519,
         TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851A,
         MAX_CUBE_MAP_TEXTURE_SIZE = 0x851C
     ], TEXTURE_TYPE, a.TTYPE);

/**
 * WebGL-specific enums
 * @enum WEBGLS
 */
Enum([
         UNPACK_ALIGNMENT = 0x0CF5,
         PACK_ALIGNMENT = 0x0D05,
         UNPACK_FLIP_Y_WEBGL = 0x9240,
         UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241,
         CONTEXT_LOST_WEBGL = 0x9242,
         UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243,
         BROWSER_DEFAULT_WEBGL = 0x9244
     ], WEBGLS, a.WEBGLS);


/**
 * DataType
 * @enum DTYPE
 */
Enum([
         BYTE = 0x1400,
         UNSIGNED_BYTE = 0x1401,
         SHORT = 0x1402,
         UNSIGNED_SHORT = 0x1403,
         INT = 0x1404,
         UNSIGNED_INT = 0x1405,
         FLOAT = 0x1406
     ], DTYPE, a.DTYPE);

Enum([
    BYTES_PER_BYTE = 1,
    BYTES_PER_UNSIGNED_BYTE = 1,
    BYTES_PER_UBYTE = 1,

    BYTES_PER_SHORT = 2,
    BYTES_PER_UNSIGNED_SHORT = 2,
    BYTES_PER_USHORT = 2,

    BYTES_PER_INT = 4,
    BYTES_PER_UNSIGNED_INT = 4,
    BYTES_PER_UINT = 4,

    BYTES_PER_FLOAT = 4
    ], DTYPE_SIZE, a.DTYPE);


Enum([
	     PIXEL = 0x8B30,
	     VERTEX
     ], SHADER_TYPE, a.SHADERTYPE);

/**
 * @property getTypeSize(Enumeration eType)
 * Возвращет размер типа в байтах
 * @param eType Тип, размер которого будет возвращен
 * @return Int размер в байтах
 **/
function getTypeSize (eType) {
    switch (eType) {
        case a.DTYPE.BYTE:
        case a.DTYPE.UNSIGNED_BYTE:
            return 1;
        case a.DTYPE.SHORT:
        case a.DTYPE.UNSIGNED_SHORT:
        case a.ITYPE.UNSIGNED_SHORT_4_4_4_4:
        case a.ITYPE.UNSIGNED_SHORT_5_5_5_1:
        case a.ITYPE.UNSIGNED_SHORT_5_6_5:
            return 2;
        case a.DTYPE.INT:
        case a.DTYPE.UNSIGNED_INT:
        case a.DTYPE.FLOAT:
            return 4;
        default:
            return undefined;
    }
}

a.getTypeSize = getTypeSize;

/**
 * Получить число элементов в одном пикселе, заданного формата.
 * @param eFormat
 * @return Uint
 */
function getIFormatNumElements (eFormat) {
    switch (eFormat) {
        case a.IFORMAT.RGB8:
        case a.IFORMAT.BGR8:
        case a.IFORMAT.RGB5_A1:
        case a.IFORMAT.BGR5_A1:
        case a.IFORMAT.RGB565:
        case a.IFORMAT.BGR565:
        case a.IFORMAT.RGB_DXT1:
            return 3;
        case a.IFORMAT.RGBA8:
        case a.IFORMAT.BGRA8:
        case a.IFORMAT.RGBA4:
        case a.IFORMAT.BGRA4:
        case a.IFORMAT.RGBA_DXT1:
        case a.IFORMAT.RGBA_DXT2:
        case a.IFORMAT.RGBA_DXT3:
        case a.IFORMAT.RGBA_DXT4:
        case a.IFORMAT.RGBA_DXT5:
            return 4;
        default:
            error('unknown image format');
    }
}

a.getIFormatNumElements = getIFormatNumElements;

//ZENABLE = DEPTH_TEST //true or false
//ZWRITEENABLE = // using specific function gl.depthMask(mask)
// if mask non zero than enabled, default state enabled
//SRCBLEND = // using together with DESTBLEND in gl.blendFunc
//DESTBLEND = //using together with SRCBLEND in gl.blendFunc
//CULLMODE = //using specific function gl.cullFace
//ZFUNC = //using specific function gl.depthFunc(symbolic)
//DITHERENABLE = DITHER //true or false
//ALPHABLENDENABLE = ALPHA//webgl context alpha
//true to enable alpha-blended transparency
//default - true //WebGl

/**
 * D3DRS_SRCBLEND
 * One member of the D3DBLEND enumerated type. The default value is D3DBLEND_ONE.
 */


/**
 * D3DRS_DESTBLEND
 * One member of the D3DBLEND enumerated type. The default value is D3DBLEND_ZERO.
 */

Enum([
         ZENABLE = 7,
         ZWRITEENABLE = 14,
         SRCBLEND = 19,
         DESTBLEND = 20,
         CULLMODE = 22,
         ZFUNC = 23,
         DITHERENABLE = 26,
         ALPHABLENDENABLE = 27,
         ALPHATESTENABLE

     ], renderStateType, a.renderStateType);

Enum([
         ZERO = 0,
         ONE = 1,
         SRCCOLOR = 0x0300,
         INVSRCCOLOR = 0x301,
         SRCALPHA = 0x0302,
         INVSRCALPHA = 0x0303,
         DESTALPHA = 0x0304,
         INVDESTALPHA = 0x0305,
         DESTCOLOR = 0x0306,
         INVDESTCOLOR = 0x0307,
         SRCALPHASAT = 0x0308
     ], BLEND, a.BLEND);


/**
 * ZERO - ZERO                           = 0;
 * ONE - ONE                            = 1;
 * SRCCOLOR - SRC_COLOR                      = 0x0300;
 * INVSRCCOLOR - ONE_MINUS_SRC_COLOR            = 0x0301;
 * SRCALPHA - SRC_ALPHA                      = 0x0302;
 * INVSRCALPHA - ONE_MINUS_SRC_ALPHA            = 0x0303;
 * DESTALPHA - DST_ALPHA                      = 0x0304;
 * INVDESTALPHA - ONE_MINUS_DST_ALPHA            = 0x0305;
 * const GLenum DST_COLOR                      = 0x0306;
 * const GLenum ONE_MINUS_DST_COLOR            = 0x0307;
 * const GLenum SRC_ALPHA_SATURATE             = 0x0308;
 */

Enum([
         NEVER = 1,
         LESS = 2,
         EQUAL = 3,
         LESSEQUAL = 4,
         GREATER = 5,
         NOTEQUAL = 6,
         GREATEREQUAL = 7,
         ALWAYS = 8
     ], CMPFUNC, a.CMPFUNC);


/* DepthFunction */
/*      NEVER */
/*      LESS */
/*      EQUAL */
/*      LEQUAL */
/*      GREATER */
/*      NOTEQUAL */
/*      GEQUAL */
/*      ALWAYS */

Enum([
         NONE = 0,
         CW = 0x404, //FRONT
         CCW = 0x0405, //BACK
         FRONT_AND_BACK = 0x0408
     ], CULLMODE, a.CULLMODE);

//void CullFace ( enum mode ) ;
//mode is a symbolic constant: one of FRONT, BACK or FRONT_AND_BACK.
//Culling is enabled or disabled with Enable  or Disable  using the
//symbolic constant CULL_FACE. Front facing polygons are rasterized
//if either culling is disabled or the CullFace  mode is BACK while
//back facing polygons are rasterized only if either culling is disabled
//or the CullFace  mode is FRONT. The initial setting of the CullFace
//mode is BACK. Initially, culling is disabled.
//
//we enabling gl.Enable(gl.CULL_FACE) by default culling mode is BACK
//FRONT and BACK polygons defining by round in a clockwise direction or
//counterclockwise direction. By default we use CCW direction
//change by gl.FrontFace(gl.CW)
//therefore directX CCW mode corresponds BACK
//and CW mode correspond FACE
//so gl.FrontFace not used
//gl.cullFace(gl.FRONT)
//disabling culling implemented by gl.Disable(gl.CULL_FACE);

/**
 * FRONT                          = 0x0404;
 * BACK                           = 0x0405;
 * FRONT_AND_BACK                 = 0x0408;
 * D3DCULL_NONE          = 1
 * Do not cull back faces
 * D3DCULL_CW            = 2
 * Cull back faces with clockwise vertices
 * D3DCULL_CCW           = 3
 * Cull back faces with counterclockwise vertices
 */


/**
 * class ParameterDesc - implementation of D3DXPARAMETER_DESC structure
 * contains two enums "Class" and "Type" - implementation of D3DXPARAMETER_CLASS
 * and D3DXPARAMETER_TYPE respectivetly
 *
 * sName - name of the parameter
 * sSemantic - semantic meaning, also called the usage
 * eClass - parameter class. Set this to one of the values in a.ParameterDesc.Class
 * eType - parameter type. Set this to one of the values in a.ParameterDesc.Type
 * iRows - number of rows in the array
 * iColumns - number of columns in the array
 * iElements - number of elements in the array
 * iAnnotations - number of annotations
 * iStructureMembers - number of structure members
 * iFlags - parameter attributes
 * iBytes - the size of the parameter, in bytes
 *
 * @ctor
 */
function ParameterDesc () {
    this.sName = null;
    this.sSemantics = null;
    //enum elements
    this.eClass = 0;
    this.eType = 0;

    this.iRows = 0;
    this.iColumns = 0;
    this.iElements = 0;
    //this.iAnnotations = 0;
    this.iStructMembers = 0;
    //this.iFlags = 0;
    //this.iBytes = 0;

    Enum([
             SCALAR = 0,
             VECTOR,
             MATRIX_ROWS,
             MATRIX_COLUMNS,
             OBJECT,
             STRUCT
         ], Class, a.ParameterDesc.Class);

    Enum([
             VOID = 0,
             BOOL,
             INT,
             FLOAT,
             STRING,
             TEXTURE,
             TEXTURE1D,
             TEXTURE2D,
             TEXTURE3D,
             TEXTURECUBE,
             SAMPLER,
             SAMPLER1D,
             SAMPLER2D,
             SAMPLER3D,
             SAMPLERCUBE,
             PIXELSHADER,
             VERTEXSHADER,
             PIXELFRAGMENT,
             VERTEXFRAGMENT,
             UNSUPPORTED
         ], Type, a.ParameterDesc.Type);
}

ParameterDesc.prototype.dump = function (pWriter) {
    pWriter = pWriter || new a.BinWriter();
    pWriter.string(this.sName);
    pWriter.string(this.sSemantic);

    pWriter.int32(this.eClass);
    pWriter.int32(this.eType);
    pWriter.int32(this.iRows);
    pWriter.int32(this.iColumns);
    pWriter.int32(this.iElements);
    pWriter.int32(this.iStructMembers);

    return pWriter;
}

ParameterDesc.prototype.undump = function (pReader) {
    this.sName = pReader.string();
    this.sSemantic = pReader.string();

    this.eClass = pReader.int32();
    this.eType = pReader.int32();
    this.iRows = pReader.int32();
    this.iColumns = pReader.int32();
    this.iElements = pReader.int32();
    this.iStructMembers = pReader.int32();

    return this;
}

a.ParameterDesc = ParameterDesc;


/**
 * Вычислить размеры буфера(высоту и ширину) для того, чтобы уместить данные
 * @tparam Uint n Размер данных, которые необходимо положить
 * @tparam Int iElements число элементов, в одном пикселе.
 * @treturn Array Размеры текстуры [ширина, высота, число элементов].
 */
function calcPOTtextureSize (n, iElements) {
    var w, h;

    iElements = iElements || 4;
    n /= iElements;
    w = Math.ceil(Math.log(n) / Math.LN2 / 2.0);
    h = Math.ceil(Math.log(n / Math.pow(2, w)) / Math.LN2);
    w = Math.pow(2, w);
    h = Math.pow(2, h);
    n = w * h * iElements;
    return [w, h, n];
}
a.calcPOTtextureSize = calcPOTtextureSize;


/**
 * @autor reinor
 */

function computeNormalMap (pDevice, pImage, pNormalTable, iChannel, fAmplitude) {

    var vertexShaderSrc = "" +

        "/*vertex shader*/" +

        "attribute vec2 position;" +
        "varying vec2 texturePosition;" +

        "void main(void){" +
        "texturePosition = (position + vec2(1.,1.))/2.;" +
        "gl_Position = vec4(position,0.,1.);" +
        "}";


    var fragmentShaderSrc = "" +

        "/*fragment shader*/\n" +
        "#ifdef GL_ES\n" +
        "precision highp float;\n" +
        "#endif\n" +

        "uniform vec2 steps; /*iverse texture size*/" +
        "uniform float booster; /*height boost*/" +
        "uniform sampler2D texture;" +
        "uniform float fChannel;" +

        "varying vec2 texturePosition;" +

        "void main(void){" +

        "/*generation normals;*/" +

        "float fHeight0,fHeight1,fHeight2,fHeight3,fHeight4,fHeight5,fHeight6," +
        "fHeight7,fHeight8;" +

        "if(fChannel == 0.){" +
        "fHeight0 = (texture2D(texture,texturePosition)).r;" +
        "fHeight1 = (texture2D(texture,texturePosition + vec2(steps.x,0.))).r;" +
        "fHeight2 = (texture2D(texture,texturePosition + vec2(steps.x,steps.y))).r;" +
        "fHeight3 = (texture2D(texture,texturePosition + vec2(0.,steps.x))).r;" +
        "fHeight4 = (texture2D(texture,texturePosition + vec2(-steps.x,steps.y))).r;" +
        "fHeight5 = (texture2D(texture,texturePosition + vec2(-steps.x,0.))).r;" +
        "fHeight6 = (texture2D(texture,texturePosition + vec2(-steps.x,-steps.y))).r;" +
        "fHeight7 = (texture2D(texture,texturePosition + vec2(0.,-steps.y))).r;" +
        "fHeight8 = (texture2D(texture,texturePosition + vec2(steps.x,-steps.y))).r;" +
        "}" +
        "else if(fChannel == 1.){" +
        "fHeight0 = (texture2D(texture,texturePosition)).g;" +
        "fHeight1 = (texture2D(texture,texturePosition + vec2(steps.x,0.))).g;" +
        "fHeight2 = (texture2D(texture,texturePosition + vec2(steps.x,steps.y))).g;" +
        "fHeight3 = (texture2D(texture,texturePosition + vec2(0.,steps.x))).g;" +
        "fHeight4 = (texture2D(texture,texturePosition + vec2(-steps.x,steps.y))).g;" +
        "fHeight5 = (texture2D(texture,texturePosition + vec2(-steps.x,0.))).g;" +
        "fHeight6 = (texture2D(texture,texturePosition + vec2(-steps.x,-steps.y))).g;" +
        "fHeight7 = (texture2D(texture,texturePosition + vec2(0.,-steps.y))).g;" +
        "fHeight8 = (texture2D(texture,texturePosition + vec2(steps.x,-steps.y))).g;" +
        "}" +
        "else if(fChannel == 2.){" +
        "fHeight0 = (texture2D(texture,texturePosition)).b;" +
        "fHeight1 = (texture2D(texture,texturePosition + vec2(steps.x,0.))).b;" +
        "fHeight2 = (texture2D(texture,texturePosition + vec2(steps.x,steps.y))).b;" +
        "fHeight3 = (texture2D(texture,texturePosition + vec2(0.,steps.x))).b;" +
        "fHeight4 = (texture2D(texture,texturePosition + vec2(-steps.x,steps.y))).b;" +
        "fHeight5 = (texture2D(texture,texturePosition + vec2(-steps.x,0.))).b;" +
        "fHeight6 = (texture2D(texture,texturePosition + vec2(-steps.x,-steps.y))).b;" +
        "fHeight7 = (texture2D(texture,texturePosition + vec2(0.,-steps.y))).b;" +
        "fHeight8 = (texture2D(texture,texturePosition + vec2(steps.x,-steps.y))).b;" +
        "}" +
        "else{" +
        "fHeight0 = (texture2D(texture,texturePosition)).a;" +
        "fHeight1 = (texture2D(texture,texturePosition + vec2(steps.x,0.))).a;" +
        "fHeight2 = (texture2D(texture,texturePosition + vec2(steps.x,steps.y))).a;" +
        "fHeight3 = (texture2D(texture,texturePosition + vec2(0.,steps.x))).a;" +
        "fHeight4 = (texture2D(texture,texturePosition + vec2(-steps.x,steps.y))).a;" +
        "fHeight5 = (texture2D(texture,texturePosition + vec2(-steps.x,0.))).a;" +
        "fHeight6 = (texture2D(texture,texturePosition + vec2(-steps.x,-steps.y))).a;" +
        "fHeight7 = (texture2D(texture,texturePosition + vec2(0.,-steps.y))).a;" +
        "fHeight8 = (texture2D(texture,texturePosition + vec2(steps.x,-steps.y))).a;" +
        "}" +

        "vec3 dir1 = vec3(steps.x, 0., (fHeight1 - fHeight0)*booster);" +
        "vec3 dir2 = vec3(steps.x, steps.y, (fHeight2 - fHeight0)*booster);" +
        "vec3 dir3 = vec3(0., steps.y, (fHeight3 - fHeight0)*booster);" +
        "vec3 dir4 = vec3(-steps.x, steps.y, (fHeight4 - fHeight0)*booster);" +
        "vec3 dir5 = vec3(-steps.x, 0., (fHeight5 - fHeight0)*booster);" +
        "vec3 dir6 = vec3(-steps.x, -steps.y, (fHeight6 - fHeight0)*booster);" +
        "vec3 dir7 = vec3(0., -steps.y, (fHeight7 - fHeight0)*booster);" +
        "vec3 dir8 = vec3(steps.x, -steps.y, (fHeight8 - fHeight0)*booster);" +

        "vec3 normal1 = cross(dir1,dir2);" +
        "vec3 normal2 = cross(dir2,dir3);" +
        "vec3 normal3 = cross(dir3,dir4);" +
        "vec3 normal4 = cross(dir4,dir5);" +
        "vec3 normal5 = cross(dir5,dir6);" +
        "vec3 normal6 = cross(dir6,dir7);" +
        "vec3 normal7 = cross(dir7,dir8);" +
        "vec3 normal8 = cross(dir8,dir1);" +

        "vec3 normal = normalize(normal1 + normal2 + normal3 + normal4" +
        "+ normal5 + normal6 + normal7 + normal8);" +

        "gl_FragColor = vec4(normal/2. + vec3(0.5),1.);" +
        "}";

    var progCalculateNormalMap = null;

    if (!pDevice.computeNormalMapFromHeightMap) {

        var vertexShader = pDevice.createShader(pDevice.VERTEX_SHADER);
        pDevice.shaderSource(vertexShader, vertexShaderSrc);
        pDevice.compileShader(vertexShader);

        //    if (!pDevice.getShaderParameter(vertexShader, pDevice.COMPILE_STATUS)) {
        //        alert(pDevice.getShaderInfoLog(vertexShader));
        //        return;
        //    }

        var fragmentShader = pDevice.createShader(pDevice.FRAGMENT_SHADER);
        pDevice.shaderSource(fragmentShader, fragmentShaderSrc);
        pDevice.compileShader(fragmentShader);

        //    if (!pDevice.getShaderParameter(fragmentShader, pDevice.COMPILE_STATUS)) {
        //        alert(pDevice.getShaderInfoLog(fragmentShader));
        //        return;
        //    }

        progCalculateNormalMap = pDevice.createProgram();
        pDevice.attachShader(progCalculateNormalMap, vertexShader);
        pDevice.attachShader(progCalculateNormalMap, fragmentShader);

        pDevice.linkProgram(progCalculateNormalMap);

        pDevice.computeNormalMapFromHeightMap = progCalculateNormalMap;
    }
    else {
        progCalculateNormalMap = pDevice.computeNormalMapFromHeightMap;
    }

    pDevice.useProgram(progCalculateNormalMap);

    progCalculateNormalMap.position = pDevice.getAttribLocation(progCalculateNormalMap, "position");
    pDevice.enableVertexAttribArray(progCalculateNormalMap.position);

    progCalculateNormalMap.steps = pDevice.getUniformLocation(progCalculateNormalMap, "steps");
    progCalculateNormalMap.booster = pDevice.getUniformLocation(progCalculateNormalMap, "booster");
    progCalculateNormalMap.texture = pDevice.getUniformLocation(progCalculateNormalMap, "texture");
    progCalculateNormalMap.fChannel = pDevice.getUniformLocation(progCalculateNormalMap, "fChannel");


    if (!pDevice.getProgramParameter(progCalculateNormalMap, pDevice.LINK_STATUS)) {
        alert("Could not initialise create normal map shaders");
        return;
    }

    var index = pDevice.createBuffer();
    pDevice.bindBuffer(pDevice.ARRAY_BUFFER, index);
    pDevice.bufferData(pDevice.ARRAY_BUFFER,
                       new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), pDevice.STREAM_DRAW);

    //////////////////////////////////////////////////////////////////

    var heightTexture = pDevice.createTexture();
    pDevice.activeTexture(pDevice.TEXTURE0);
    pDevice.bindTexture(pDevice.TEXTURE_2D, heightTexture);

    pImage.convert(a.IFORMAT.RGBA8);
    pDevice.texImage2D(a.TTYPE.TEXTURE_2D, 0, a.IFORMAT.RGBA, pImage.getWidth(),
                       pImage.getHeight(), 0, pImage.getFormatShort(),
                       pImage.getType(), new Uint8Array((pImage.getData(0))));

    pDevice.texParameteri(pDevice.TEXTURE_2D, pDevice.TEXTURE_WRAP_S, pDevice.CLAMP_TO_EDGE);
    pDevice.texParameteri(pDevice.TEXTURE_2D, pDevice.TEXTURE_WRAP_T, pDevice.CLAMP_TO_EDGE);

    pDevice.generateMipmap(pDevice.TEXTURE_2D);

    ///////////////////////////////////////////////////////////////

    var normalTexture = pDevice.createTexture();
    pDevice.activeTexture(pDevice.TEXTURE1);
    pDevice.bindTexture(pDevice.TEXTURE_2D, normalTexture);


    pDevice.pixelStorei(pDevice.UNPACK_ALIGNMENT, 1);


    pDevice.texImage2D(pDevice.TEXTURE_2D, 0,
                       pDevice.RGB, pImage.getWidth(), pImage.getHeight(), 0, pDevice.RGB, pDevice.UNSIGNED_BYTE, null);

    var normalTextureFrameBuffer = pDevice.createFramebuffer();
    pDevice.bindFramebuffer(pDevice.FRAMEBUFFER, normalTextureFrameBuffer);
    pDevice.framebufferTexture2D(pDevice.FRAMEBUFFER, pDevice.COLOR_ATTACHMENT0,
                                 pDevice.TEXTURE_2D, normalTexture, 0);

    pDevice.uniform2f(progCalculateNormalMap.steps, 1. / pImage.getWidth(), 1. / pImage.getHeight());
    pDevice.uniform1f(progCalculateNormalMap.booster, fAmplitude / 255.);
    pDevice.uniform1f(progCalculateNormalMap.fChannel, iChannel);
    pDevice.uniform1i(progCalculateNormalMap.texture, 0);

    pDevice.vertexAttribPointer(progCalculateNormalMap.position, 2, pDevice.FLOAT, false, 0, 0);

    pDevice.viewport(0, 0, pImage.getWidth(), pImage.getHeight());
    pDevice.drawArrays(pDevice.TRIANGLE_STRIP, 0, 4);

    pDevice.flush();


    var pTemp = new Uint8Array(4 * pImage.getWidth() * pImage.getHeight());

    pDevice.readPixels(0, 0, pImage.getWidth(), pImage.getHeight(),
                       pDevice.RGBA, pDevice.UNSIGNED_BYTE, pTemp);

    for (var i = 0; i < pImage.getWidth() * pImage.getHeight(); i++) {
        pNormalTable[i][0] = pTemp[4 * i];
        pNormalTable[i][1] = pTemp[4 * i + 1];
        pNormalTable[i][2] = pTemp[4 * i + 2];
    }


    pDevice.bindFramebuffer(pDevice.FRAMEBUFFER, null);

    pDevice.deleteBuffer(index);
    pDevice.deleteFramebuffer(normalTextureFrameBuffer);

    pDevice.deleteTexture(heightTexture);
    pDevice.activeTexture(pDevice.TEXTURE0);
    pDevice.bindTexture(pDevice.TEXTURE_2D, null);
    pDevice.deleteTexture(normalTexture);
    pDevice.activeTexture(pDevice.TEXTURE1);
    pDevice.bindTexture(pDevice.TEXTURE_2D, null);
//pDevice.deleteProgram(progCalculateNormalMap);
}
;

a.computeNormalMap = computeNormalMap;


Define(a.IFORMAT.RGB, a.IFORMAT.RGB8);
Define(a.IFORMAT.RGBA, a.IFORMAT.RGBA8);
Define(a.TEXTUREUNIT.TEXTURE, 0x84C0);
Define(a.EXTENDED_TEXTURE_COUNT, 16);


/**
 * @property createSingleStripGrid(Int iXVerts,Int iYVerts, Int iXStep, Int iYStep, Int iSride, Int iFlags)
 * __DESCRIPTION__
 * @memberof IndexData
 * @param iXVerts __COMMENT__ // ширина сети
 * @param iYVerts __COMMENT__ // высота сети
 * @param iXStep __COMMENT__  // horz vertex count per cell  //количесвто горизонтальных вершин на ячейку
 * @param iYStep __COMMENT__  // vert vertex count per cell  //Количество вертикальных вершин на ячейку
 * @return iSride __DESCRIPTION__ // horz vertex count in vbuffer   //количество горизонтальныз вершин в буфере
 * @return iFlags __DESCRIPTION__
 **/

function createSingleStripGrid (iXVerts, iYVerts, iXStep, iYStep, iSride, iFlags) {
    var iTotalStrips = iYVerts - 1;
    var iTotalIndexesPerStrip = iXVerts << 1;

    // the total number of indices is equal
    // to the number of strips times the
    // indices used per strip plus one
    // degenerate triangle between each strip

    //общее количество идексов равно количесву линий умноженному на колчесвто идексов в линии + вырожденный треуголник между полосами

    var iTotalIndexes = (iTotalStrips * iTotalIndexesPerStrip) + (iTotalStrips << 1) - 2;

    var pIndexValues = new Array(iTotalIndexes);

    var iIndex = 0;
    var iStartVert = 0;
    var iLineStep = iYStep * iSride;

    for (j = 0; j < iTotalStrips; ++j) {
        var k = 0;
        var iVert = iStartVert;
        // create a strip for this row
        for (k = 0; k < iXVerts; ++k) {
            pIndexValues[iIndex++] = iVert;
            pIndexValues[iIndex++] = iVert + iLineStep;
            iVert += iXStep;
        }
        iStartVert += iLineStep;

        if (j + 1 < iTotalStrips) {
            // add a degenerate to attach to
            // the next row
            pIndexValues[iIndex++] = (iVert - iXStep) + iLineStep;
            pIndexValues[iIndex++] = iStartVert;
        }
    }

    // return
    return pIndexValues;
}
a.createSingleStripGrid = createSingleStripGrid;