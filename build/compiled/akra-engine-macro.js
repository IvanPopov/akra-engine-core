Define(A_CORE_HOME, "/akra-engine-core/src/");
Define(DEV_BUILD,1)
Define(__AKRA_ENGINE__,true)
Define(__DEBUG,1)
Define(a.isDebug,true)
Define(PR_DISPLAYMNGR,this._pEngine.displayManager())
Define(PR_UNIQMNGR,this._pEngine.uniqManager())
Define(A_CLASS,A_CLASS())
Define(parent,parent(), true)
Define(parent.get.__,LOOKUPGETTER(parent, __), true)
Define(parent.set.__,LOOKUPSETTER(parent, __), true)
Define(statics.__,this.constructor.__)
Define(a.IFORMAT.RGB,a.IFORMAT.RGB8)
Define(a.IFORMAT.RGBA,a.IFORMAT.RGBA8)
Define(a.TEXTUREUNIT.TEXTURE,33984)
Define(a.EXTENDED_TEXTURE_COUNT,16)
Define(Math.fpOneBits,1065353216)
Define(MIN_INT32,4294967295)
Define(MAX_INT32,2147483647)
Define(MIN_INT16,65535)
Define(MAX_INT16,32767)
Define(MIN_INT8,255)
Define(MAX_INT8,127)
Define(MIN_UINT32,0)
Define(MAX_UINT32,4294967295)
Define(MIN_UINT16,0)
Define(MAX_UINT16,65535)
Define(MIN_UINT8,0)
Define(MAX_UINT8,255)
Define(SIZE_FLOAT64,8)
Define(SIZE_REAL64,8)
Define(SIZE_FLOAT32,4)
Define(SIZE_REAL32,4)
Define(SIZE_INT32,4)
Define(SIZE_UINT32,4)
Define(SIZE_INT16,2)
Define(SIZE_UINT16,2)
Define(SIZE_INT8,1)
Define(SIZE_UINT8,1)
Define(SIZE_BYTE,1)
Define(SIZE_UBYTE,1)
Define(MAX_FLOAT64,Number.MAX_VALUE)
Define(MIN_FLOAT64,-(Number.MAX_VALUE))
Define(TINY_FLOAT64,Number.MIN_VALUE)
Define(MAX_REAL64,Number.MAX_VALUE)
Define(MIN_REAL64,-(Number.MAX_VALUE))
Define(TINY_REAL64,Number.MIN_VALUE)
Define(MAX_FLOAT32,3.4e+38)
Define(MIN_FLOAT32,-3.4e+38)
Define(TINY_FLOAT32,1.5e-45)
Define(MAX_REAL32,3.4e+38)
Define(MIN_REAL32,-3.4e+38)
Define(TINY_REAL32,1.5e-45)
Define(X,__[0])
Define(Y,__[1])
Define(Z,__[2])
Define(W,__[3])
Define(_11,__[0])
Define(_12,__[4])
Define(_13,__[8])
Define(_14,__[12])
Define(_21,__[1])
Define(_22,__[5])
Define(_23,__[9])
Define(_24,__[13])
Define(_31,__[2])
Define(_32,__[6])
Define(_33,__[10])
Define(_34,__[14])
Define(_41,__[3])
Define(_42,__[7])
Define(_43,__[11])
Define(_44,__[15])
Define(a11,__[0])
Define(a12,__[3])
Define(a13,__[6])
Define(a21,__[1])
Define(a22,__[4])
Define(a23,__[7])
Define(a31,__[2])
Define(a32,__[5])
Define(a33,__[8])
Define(a.ThreadManager.MAX_THREAD_NUM,32)
Define(a.ThreadManager.INIT_THREAD_NUM,4)
Define(FILE_MODULES_IMPLEMENTATION,0)
Define(a.LocalFile.FS_MAX_SIZE,(32 * 1024) * 1024)
Define(INVALID_INDEX,65535)
Define(EFFECT_SYNTAX_COMPATIBILITY,1)
Define(SM_INVALID_EFFECT,-1)
Define(SM_INVALID_TECHNIQUE,-1)
Define(SM_UNKNOWN_PASS,-1)
Define(peRed,__[0])
Define(peGreen,__[1])
Define(peBlue,__[2])
Define(peFlags,__[3])
Define(R,__[0])
Define(G,__[1])
Define(B,__[2])
Define(A,__[3])
Define(a.Float32,Float32)
Define(a.Color,a.Color4i)
Define(a.ColorValue,a.Color4f)
Define(DDS_MAGIC,542327876)
Define(DDSD_CAPS,1)
Define(DDSD_HEIGHT,2)
Define(DDSD_WIDTH,4)
Define(DDSD_PITCH,8)
Define(DDSD_PIXELFORMAT,4096)
Define(DDSD_MIPMAPCOUNT,131072)
Define(DDSD_LINEARSIZE,524288)
Define(DDSD_DEPTH,8388608)
Define(DDS_HEADER_FLAGS_TEXTURE,((DDSD_CAPS | DDSD_HEIGHT) | DDSD_WIDTH) | DDSD_PIXELFORMAT)
Define(DDS_HEADER_FLAGS_MIPMAP,DDSD_MIPMAPCOUNT)
Define(DDS_HEADER_FLAGS_VOLUME,DDSD_DEPTH)
Define(DDS_HEADER_FLAGS_PITCH,DDSD_PITCH)
Define(DDS_HEADER_FLAGS_LINEARSIZE,DDSD_LINEARSIZE)
Define(DDPF_ALPHAPIXELS,1)
Define(DDPF_ALPHA,2)
Define(DDPF_FOURCC,4)
Define(DDPF_PALETTEINDEXED4,8)
Define(DDPF_PALETTEINDEXEDTO8,16)
Define(DDPF_PALETTEINDEXED8,32)
Define(DDPF_RGB,64)
Define(DDPF_COMPRESSED,128)
Define(DDPF_RGBTOYUV,256)
Define(DDPF_YUV,512)
Define(DDPF_ZBUFFER,1024)
Define(DDPF_PALETTEINDEXED1,2048)
Define(DDPF_PALETTEINDEXED2,4096)
Define(DDPF_ZPIXELS,8192)
Define(DDPF_STENCILBUFFER,16384)
Define(DDPF_ALPHAPREMULT,32768)
Define(DDPF_LUMINANCE,131072)
Define(DDPF_BUMPLUMINANCE,262144)
Define(DDPF_BUMPDUDV,524288)
Define(DDSCAPS2_CUBEMAP,512)
Define(DDSCAPS2_CUBEMAP_POSITIVEX,1024)
Define(DDSCAPS2_CUBEMAP_NEGATIVEX,2048)
Define(DDSCAPS2_CUBEMAP_POSITIVEY,4096)
Define(DDSCAPS2_CUBEMAP_NEGATIVEY,8192)
Define(DDSCAPS2_CUBEMAP_POSITIVEZ,16384)
Define(DDSCAPS2_CUBEMAP_NEGATIVEZ,32768)
Define(DDSCAPS2_VOLUME,2097152)
Define(RESOURCE_MISC_GENERATE_MIPS,1)
Define(RESOURCE_MISC_SHARED,2)
Define(RESOURCE_MISC_TEXTURECUBE,4)
Define(RESOURCE_MISC_DRAWINDIRECT_ARGS,16)
Define(RESOURCE_MISC_BUFFER_ALLOW_RAW_VIEWS,32)
Define(RESOURCE_MISC_BUFFER_STRUCTURED,64)
Define(RESOURCE_MISC_RESOURCE_CLAMP,128)
Define(RESOURCE_MISC_SHARED_KEYEDMUTEX,256)
Define(RESOURCE_MISC_GDI_COMPATIBLE,512)
Define(RESOURCE_MISC_SHARED_NTHANDLE,2048)
Define(RESOURCE_MISC_RESTRICTED_CONTENT,4096)
Define(RESOURCE_MISC_RESTRICT_SHARED_RESOURCE,8192)
Define(RESOURCE_MISC_RESTRICT_SHARED_RESOURCE_DRIVER,16384)
Define(DDS_FOURCC,DDPF_FOURCC)
Define(DDS_RGB,DDPF_RGB)
Define(DDS_RGBA,DDPF_RGB | DDPF_ALPHAPIXELS)
Define(D3DFMT_DX10,808540228)
Define(D3DFMT_DXT1,827611204)
Define(D3DFMT_DXT2,844388420)
Define(D3DFMT_DXT3,861165636)
Define(D3DFMT_DXT4,877942852)
Define(D3DFMT_DXT5,894720068)
Define(a.VideoBufferType,Float32Array)
Define(VIDEOBUFFER_MIN_SIZE,32)
Define(a.fMillisecondsPerTick,0.0333)
Enum([
	SURFACE = 1,
	VOLUME,
	TEXTURE,
	VOLUMETEXTURE,
	CUBETEXTURE,
	VERTEXBUFFER,
	INDEXBUFFER,
	FORCE_DWORD = 2147483647
], RESOURCE_TYPE, a.RESOURCETYPE);
Enum([
	POINTLIST = 0,
	LINELIST = 1,
	LINELOOP,
	LINESTRIP,
	TRIANGLELIST,
	TRIANGLESTRIP,
	TRIANGLEFAN
], PRIMITIVE_TYPE, a.PRIMTYPE);
Enum([
	RGB8 = 6407,
	BGR8 = 32864,
	RGBA8 = 6408,
	BGRA8,
	RGBA4 = 32854,
	BGRA4 = 32857,
	RGB5_A1 = 32855,
	BGR5_A1,
	RGB565 = 36194,
	BGR565,
	RGB_DXT1 = 33776,
	RGBA_DXT1,
	RGBA_DXT2 = 33780,
	RGBA_DXT3 = 33778,
	RGBA_DXT4 = 33781,
	RGBA_DXT5 = 33779
], IMAGE_FORMAT, a.IFORMAT);
Enum([
	RGB = 6407,
	RGBA
], IFORMATSHORT, a.IFORMATSHORT);
Enum([
	TEXTURE_FLOAT = 0,
	TEXTURE_HALF_FLOAT = 1,
	COMPRESSED_TEXTURES,
	STANDART_DERIVATIVES,
	TOTAL
], EXTENTIONS, a.EXTENTIONS);
Enum([
	UNSIGNED_BYTE = 5121,
	UNSIGNED_SHORT_4_4_4_4 = 32819,
	UNSIGNED_SHORT_5_5_5_1,
	UNSIGNED_SHORT_5_6_5 = 33635,
	FLOAT = 5126
], IMAGE_TYPE, a.ITYPE);
Enum([
	NEAREST = 9728,
	LINEAR,
	NEAREST_MIPMAP_NEAREST = 9984,
	LINEAR_MIPMAP_NEAREST,
	NEAREST_MIPMAP_LINEAR,
	LINEAR_MIPMAP_LINEAR
], TEXTURE_FILTER, a.TFILTER);
Enum([
	REPEAT = 10497,
	CLAMP_TO_EDGE = 33071,
	MIRRORED_REPEAT = 33648
], TEXTURE_WRAP_MODE, a.TWRAPMODE);
Enum([
	MAG_FILTER = 10240,
	MIN_FILTER,
	WRAP_S,
	WRAP_T
], TEXTURE_PARAM, a.TPARAM);
Enum([
	STREAM_DRAW = 35040,
	STATIC_DRAW = 35044,
	DYNAMIC_DRAW = 35048
], BUFFER_USAGE, a.BUSAGE);
Enum([
	ARRAY_BUFFER = 34962,
	ELEMENT_ARRAY_BUFFER,
	FRAME_BUFFER = 36160,
	RENDER_BUFFER
], BUFFER_TYPE, a.BTYPE);
Enum([
	COLOR_ATTACHMENT0 = 36064,
	DEPTH_ATTACHMENT = 36096,
	STENCIL_ATTACHMENT = 36128,
	DEPTH_STENCIL_ATTACHMENT = 33306
], ATTACHMENT_TYPE, a.ATYPE);
Enum([
	TEXTURE_2D = 3553,
	TEXTURE = 5890,
	TEXTURE_CUBE_MAP = 34067,
	TEXTURE_BINDING_CUBE_MAP,
	TEXTURE_CUBE_MAP_POSITIVE_X,
	TEXTURE_CUBE_MAP_NEGATIVE_X,
	TEXTURE_CUBE_MAP_POSITIVE_Y,
	TEXTURE_CUBE_MAP_NEGATIVE_Y,
	TEXTURE_CUBE_MAP_POSITIVE_Z,
	TEXTURE_CUBE_MAP_NEGATIVE_Z,
	MAX_CUBE_MAP_TEXTURE_SIZE = 34076
], TEXTURE_TYPE, a.TTYPE);
Enum([
	UNPACK_ALIGNMENT = 3317,
	PACK_ALIGNMENT = 3333,
	UNPACK_FLIP_Y_WEBGL = 37440,
	UNPACK_PREMULTIPLY_ALPHA_WEBGL,
	CONTEXT_LOST_WEBGL,
	UNPACK_COLORSPACE_CONVERSION_WEBGL,
	BROWSER_DEFAULT_WEBGL
], WEBGLS, a.WEBGLS);
Enum([
	BYTE = 5120,
	UNSIGNED_BYTE,
	SHORT,
	UNSIGNED_SHORT,
	INT,
	UNSIGNED_INT,
	FLOAT
], DTYPE, a.DTYPE);
Enum([
	PIXEL = 35632,
	VERTEX
], SHADER_TYPE, a.SHADERTYPE);
Enum([
	ZENABLE = 7,
	ZWRITEENABLE = 14,
	SRCBLEND = 19,
	DESTBLEND,
	CULLMODE = 22,
	ZFUNC,
	DITHERENABLE = 26,
	ALPHABLENDENABLE,
	ALPHATESTENABLE
], renderStateType, a.renderStateType);
Enum([
	ZERO = 0,
	ONE = 1,
	SRCCOLOR = 768,
	INVSRCCOLOR,
	SRCALPHA,
	INVSRCALPHA,
	DESTALPHA,
	INVDESTALPHA,
	DESTCOLOR,
	INVDESTCOLOR,
	SRCALPHASAT
], BLEND, a.BLEND);
Enum([
	NEVER = 1,
	LESS,
	EQUAL,
	LESSEQUAL,
	GREATER,
	NOTEQUAL,
	GREATEREQUAL,
	ALWAYS
], CMPFUNC, a.CMPFUNC);
Enum([
	NONE = 0,
	CW = 1028,
	CCW,
	FRONT_AND_BACK = 1032
], CULLMODE, a.CULLMODE);
Enum([
	SCALAR = 0,
	VECTOR = 1,
	MATRIX_ROWS,
	MATRIX_COLUMNS,
	OBJECT,
	STRUCT
], Class, a.ParameterDesc.Class);
Enum([
	VOID = 0,
	BOOL = 1,
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
Enum([
	TimerReset = 0,
	TimerStart = 1,
	TimerStop,
	TimerAdvance,
	TimerGetAbsoluteTime,
	TimerGetAppTime,
	TimerGetElapsedTime
], eTimerCommand, a.UtilTimer);
Enum([
	BACKSPACE = 8,
	TAB,
	ENTER = 13,
	SHIFT = 16,
	CTRL,
	ALT,
	PAUSE,
	BREAK = 19,
	CAPSLOCK,
	ESCAPE = 27,
	SPACE = 32,
	PAGEUP,
	PAGEDOWN,
	END,
	HOME,
	LEFT,
	UP,
	RIGHT,
	DOWN,
	INSERT = 45,
	DELETE,
	N0 = 48,
	N1,
	N2,
	N3,
	N4,
	N5,
	N6,
	N7,
	N8,
	N9,
	A = 65,
	B,
	C,
	D,
	E,
	F,
	G,
	H,
	I,
	J,
	K,
	L,
	M,
	N,
	O,
	P,
	Q,
	R,
	S,
	T,
	U,
	V,
	W,
	X,
	Y,
	Z,
	LEFTWINDOWKEY,
	RIGHTWINDOWKEY,
	SELECTKEY,
	NUMPAD0 = 96,
	NUMPAD1,
	NUMPAD2,
	NUMPAD3,
	NUMPAD4,
	NUMPAD5,
	NUMPAD6,
	NUMPAD7,
	NUMPAD8,
	NUMPAD9,
	MULTIPLY,
	ADD,
	SUBTRACT = 109,
	DECIMALPOINT,
	DIVIDE,
	F1,
	F2,
	F3,
	F4,
	F5,
	F6,
	F7,
	F8,
	F9,
	F10,
	F11,
	F12,
	NUMLOCK = 144,
	SCROLLLOCK,
	SEMICOLON = 186,
	EQUALSIGN,
	COMMA,
	DASH,
	PERIOD,
	FORWARDSLASH,
	GRAVEACCENT,
	OPENBRACKET = 219,
	BACKSLASH,
	CLOSEBRACKET,
	SINGLEQUOTE
], KEY_CODES, a.KEY);
Enum([
	OFF = 0,
	ON = 1,
	HOLD
], TIMER_STATE, a.Timer);
Enum([
	NO_RELATION = 0,
	EQUAL = 1,
	A_CONTAINS_B,
	B_CONTAINS_A,
	INTERSECTING
], eVolumeClassifications, a.Geometry);
Enum([
	k_plane_front = 0,
	k_plane_back = 1,
	k_plane_intersect
], ePlaneClassifications, a.Geometry);
Enum([
	k_tableSize = 256,
	k_tableMask = 255
], eTable, a.PerlinNoise);
Enum([
	OK = 200,
	CREATED,
	ACCEPTED,
	PARTIAL_INFORMATION,
	MOVED = 301,
	FOUND,
	METHOD,
	NOT_MODIFIED,
	BAD_REQUEST = 400,
	UNAUTHORIZED,
	PAYMENT_REQUIRED,
	FORBIDDEN,
	NOT_FOUND,
	INTERNAL_ERROR = 500,
	NOT_IMPLEMENTED,
	SERVICE_TEMPORARILY_OVERLOADED,
	GATEWAY_TIMEOUT
], HTTP_STATUS_CODES, a.HTTP_STATUS_CODE);
Enum([
	GET = 1,
	POST
], HTTP_METHODS, a.HTTP_METHOD);
Enum([
	TYPE_TEXT = 0,
	TYPE_JSON = 1,
	TYPE_BLOB,
	TYPE_ARRAY_BUFFER,
	TYPE_DOCUMENT
], AJAX_DATA_TYPES, a.Ajax);
Enum([
	IN = 1,
	OUT,
	ATE = 4,
	APP = 8,
	TRUNC = 16,
	BINARY = 32,
	BIN = 32,
	TEXT = 64
], INPUT_OUTPUT, a.io);
Enum([
	WORKER_BUSY = 0,
	WORKER_FREE = 1
], WORKER_STATUS, a.ThreadManager);
Enum([
	OPEN = 1,
	READ,
	WRITE,
	CLEAR,
	EXISTS,
	REMOVE
], FILE_THREAD_ACTIONS, a.FileThread);
Enum([
	NORMAL = 0,
	FAST = 1,
	SLOW
], FILE_THREAD_TRANSFER_MODES, a.FileThread.TRANSFER);
Enum([
	FT_MAPPABLE = 1,
	FT_UNMAPPABLE = 0
], BUFFERMAP_FLOW_TYPES, a.BufferMap);
Enum([
	STATE_UNKNOWN = 0,
	STATE_LOADED = 1
], COLLADA_STATES, a.Collada);
Enum([
	INVALID_CODE = 4294967295
], RESOURCE_CODE, a.ResourceCode);
Enum([
	Created = 0,
	Loaded = 1,
	Disabled,
	Altered,
	TotalResourceFlags
], noname, a.ResourcePoolItem);
Enum([
	VideoResource = 0,
	AudioResource = 1,
	GameResource,
	TotalResourceFamilies
], RESOURCE_FAMILY, a.ResourcePoolManager);
Enum([
	TextureResource = 0,
	VideoBufferResource = 1,
	VertexBufferResource,
	IndexBufferResource,
	RenderResource,
	RenderSetResource,
	ModelResource,
	ImageResource,
	SMaterialResource,
	ShaderProgramResource,
	TotalVideoResources
], VIDEO_RESOURCES, a.ResourcePoolManager);
Enum([
	TotalAudioResources = 0
], AUDIO_RESOURCES, a.ResourcePoolManager);
Enum([
	TotalGameResources = 0
], GAME_RESOURCES, a.ResourcePoolManager);
Enum([
	k_setForDestruction = 0,
	k_newLocalMatrix = 1,
	k_newWorldMatrix,
	k_rebuildInverseWorldMatrix,
	k_rebuildWorldVectors,
	k_ignoreOrientation
], eUpdateDataFlagBits, a.Scene);
Enum([
	k_inheritPositionOnly = 0,
	k_inheritRotScaleOnly = 1,
	k_inheritAll
], eInheritance, a.Scene);
Enum([
	k_newLocalBounds = 0,
	k_newWorldBounds = 1
], eObjectFlagBits, a.Scene);
Enum([
	k_FOV = 0,
	k_ORTHO = 1,
	k_OFFSET_ORTHO
], e_Type, a.Camera);
Enum([
	k_minimumTreeDepth = 1,
	k_maximumTreeDepth = 11
], OCTREE_CONSTANTS, a.Tree);
Enum([
	INVALID_VERTEX_ELEMENT = -1
], SHADER_PROGRAM_STATUS, a.ShaderProgram);
Enum([
	VERTEX = 1,
	PIXEL,
	UNKNOWN = 0
], SHADER_TYPES, a.Shader);
Enum([
	VERT = 0,
	PIXL = 1
], SHADER_SHORT_TYPES, a.Shader);
Enum([
	GLOB = 0,
	DECL = 1,
	MAIN
], SHADER_DECLARATION_PARTS, a.Shader);
Enum([
	ATTR = 1,
	UNI,
	VARY
], SHADER_VARIABLE_PARTS, a.Shader);
Enum([
	CODE_UNKNOWN = -1,
	CODE_GLOBAL,
	CODE_DECL = 1,
	CODE_MAIN
], SHADER_FRAGMENT_CODE, a.ShaderFragment);
Enum([
	SECTION_UNKNOWN = 0,
	SECTION_DECL = 1,
	SECTION_GLOBAL,
	SECTION_MAIN
], SHADER_SECTIONS, a.ShaderPrecompiler);
Enum([
	DIFFUSE = "DIFFUSE",
	AMBIENT = "AMBIENT",
	SPECULAR = "SPECULAR",
	EMISSION = "EMISSION",
	SHININESS = "SHININESS",
	REFLECTIVE = "REFLECTIVE",
	REFLECTIVITY = "REFLECTIVITY",
	TRANSPARENT = "TRANSPARENT",
	TRANSPARENCY = "TRANSPARENCY",
	INDEXOFREFRACTION = "INDEXOFREFRACTION"
], MATERIAL_COMPONENTS, a.Material);
Enum([
	maxTexturesPerSurface = 16,
	textureFileVersion = 1
], SURFACEMATERIAL_CONSTANTS, a.SurfaceMaterial);
Enum([
	REPLICATION_BIT = 1,
	MIXING_BIT
], EFFECT_RESOURCE_FLAGS, a.EffectResource);
Enum([
	activateRenderMethod = 0,
	activateRenderMethodPass = 1,
	activateRenderMethodParam,
	activateRenderMethodLOD,
	activateModel,
	activateModelParamA,
	activateModelParamB,
	activateSurfaceMaterial,
	totalActivationFlags
], eActivationFlagBits, a.RenderQueue);
Enum([
	bufferEntry = 0,
	modelEntry = 1
], eTypeFlags, a.RenderEntry);
Enum([
	maxRenderEntries = 2048
], eConstants, a.RenderQueue);
Enum([
	PARAMETER_FLAG_ALL = 1,
	PARAMETER_FLAG_NONSYSTEM,
	PARAMETER_FLAG_SYSTEM
], PARAMETER_FLAGS, a.ShaderManager);
Enum([
	WORLD_MATRIX = 0,
	VIEW_MATRIX = 1,
	PROJ_MATRIX,
	WORLD_VIEW_MATRIX,
	VIEW_PROJ_MATRIX,
	WORLD_VIEW_PROJ_MATRIX,
	WORLD_MATRIX_ARRAY,
	NORMAL_MATRIX,
	MAX_MATRIX_HANDLES
], MATRIX_HANDLES, a.ShaderManager);
Enum([
	boneInfluenceCount = 0,
	ambientMaterialColor = 1,
	diffuseMaterialColor,
	emissiveMaterialColor,
	specularMaterialColor,
	specularMaterialPower,
	pointLightPos0,
	pointlightVec0,
	pointlightColor0,
	sunVector,
	sunColor,
	cameraPos,
	cameraDistances,
	cameraFacing,
	ambientLight,
	patchCorners,
	atmosphericLighting,
	posScaleOffset,
	uvScaleOffset,
	lensFlareColor,
	max_param_handles
], PARAMETER_HANDLES, a.ShaderManager);
Enum([
	MAX_TEXTURE_HANDLES = 16
], eTextureHandles, a.ShaderManager);
Enum([
	Volume = 0,
	CubeMap = 1,
	MipMaps
], eImgFlags, a.Img);
Enum([
	POSITIVEX = 0,
	NEGATIVEX = 1,
	POSITIVEY,
	NEGATIVEY,
	POSITIVEZ,
	NEGATIVEZ
], eImgCubeFlags, a.Img);
Enum([
	NEAREST_MIPMAP_NEAREST = 9984,
	LINEAR_MIPMAP_NEAREST,
	NEAREST_MIPMAP_LINEAR,
	LINEAR_MIPMAP_LINEAR
], TEXTURE_MIN_FILTER, a.Texture.MinFilter);
Enum([
	DynamicTexture = 0,
	CubeMap = 1,
	MipMaps,
	RenderTarget,
	Paletized
], eTextureFlags, a.Texture);
Enum([
	ForceMipLevels = 0,
	ForceFormat = 1,
	ForceSize
], eForcedFormatFlags, a.Texture);
Enum([
	ManyUpdateBit = 0,
	ManyDrawBit = 1,
	ReadableBit,
	RamBackupBit,
	SoftwareBit,
	AlignmentBit
], VBUFFERBASE_OPTIONS, a.VBufferBase);
Enum([
	ManyUpdateBit = 0,
	ManyDrawBit = 1,
	ReadableBit,
	RamBackupBit,
	SoftwareBit
], BufferFlagBits, a.IndexBuffer);
Enum([
	FAST = 0,
	MINIMAL = 1
], SPHERE_CALCULATION_TYPE, a.Sphere);
Enum([
	POSITION = "POSITION",
	POSITION1,
	POSITION2,
	POSITION3,
	BLENDWEIGHT = "BLENDWEIGHT",
	BLENDINDICES = "BLENDINDICES",
	NORMAL = "NORMAL",
	NORMAL1,
	NORMAL2,
	NORMAL3,
	PSIZE = "PSIZE",
	TEXCOORD = "TEXCOORD",
	TEXCOORD1,
	TEXCOORD2,
	TEXCOORD3,
	TANGENT = "TANGENT",
	BINORMAL = "BINORMAL",
	TESSFACTOR = "TESSFACTOR",
	COLOR = "COLOR",
	FOG = "FOG",
	DEPTH = "DEPTH",
	SAMPLE = "SAMPLE",
	INDEX = "INDEX",
	INDEX1,
	INDEX2,
	INDEX3,
	MATERIAL = "MATERIAL",
	MATERIAL1,
	MATERIAL2,
	DIFFUSE = "DIFFUSE",
	AMBIENT = "AMBIENT",
	SPECULAR = "SPECULAR",
	EMISSIVE = "EMISSIVE",
	SHININESS = "SHININESS",
	UNKNOWN = "UNKNOWN"
], DECLARATION_USAGE, a.DECLUSAGE);
Enum([
	MaxElementsSize = 256
], VERTEXDATA_LIMITS, a.VertexData);
Enum([
	VIDEOBUFFER_HEADER_TEX_WIDTH = 0,
	VIDEOBUFFER_HEADER_TEX_HEIGHT = 1,
	VIDEOBUFFER_HEADER_STEP_X,
	VIDEOBUFFER_HEADER_STEP_Y,
	VIDEOBUFFER_HEADER_NUM_PIXELS,
	VIDEOBUFFER_HEADER_NUM_ELEMENTS,
	VIDEOBUFFER_HEADER_SIZE = 8
], VIDEOBUFFER_HEADER);
Enum([
	ADVANCED_INDEX = 1
], MESH_OPTIONS, a.Mesh);
Enum([
	minLOD = 0,
	maxLOD = 3,
	totalLODlevels
], LOD_LEVELS, a.ModelResource);
Define(trace(__ARGS__),function() {console.log(__ARGS__);})
Define(EXTENDS(__ARGS__),function() {a.extend(__ARGS__);})
Define(GET_FUNC_NAME(fn),function() {fn.toString().match(/function\s*(\w+)/)[1];})
Define(tr(str),function() {str;})
Define(debug_assert(cond,comment),function() {if (!cond) {var err=((((((("Error:: " + comment) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";if (confirm(err + "Accept to exit, refuse to continue.")) {throw new Error(comment);}}})
Define(debug_assert_win(cond,caption,content),function() {if (!cond) {var err=((((((("Error:: " + caption) + "\n") + "\tfile: ") + "") + "\n") + "\tline: ") + "") + "\n";if (confirm(err + "Accept to exit, refuse to continue.")) {new a.DebugWindow(caption).print(content);}}})
Define(warning(x),function() {console.warn((((("[WARNING][" + "") + "][") + "") + "]") + x);})
Define(warn_assert(cond,comment),function() {if (!cond) {warning(comment);}})
Define(debug_error(x),function() {debug_assert(0, x);})
Define(assert(x),function() {debug_assert(x, "");})
Define(ASSERT(cond,comment),function() {debug_assert(cond, comment);})
Define(assert(cond,comment),function() {debug_assert(cond, comment);})
Define(ASSERT(x),function() {debug_assert(x, "");})
Define(error(x),function() {debug_error(x);})
Define(BUILD_PATH(FILE,PATH),function() {(A_CORE_HOME + PATH) + FILE;})
Define(MEDIA_PATH(FILE,PATH),function() {PATH + FILE;})
Define(debug_print(x),function() {console.log((((("[DEBUG][" + "") + "][") + "") + "]") + x);})
Define(TRACE(x),function() {debug_print(x);})
Define(INLINE(),function() {})
Define(INLINE(x),function() {})
Define(TODO(x),function() {debug_print("TODO:: " + x);throw new Error("TODO::\n" + x);})
Define(ifelse(test,v1,v2),function() {(test? v1 : v2);})
Define(ifndef(x,v),function() {(x === undefined? v : x);})
Define(isset(v),function() {v !== undefined;})
Define(remove_reference(p),function() {if (p) {p.release();}})
Define(safe_release(p),function() {if (p) {var safe_release_refcount=p.release();if (safe_release_refcount != 0) {debug_assert(0, ("WARNING: non-zero reference count on release (" + safe_release_refcount) + ")\n");}p = 0;}})
Define(PROPERTY(obj,property,getter,setter),function() {a.defineProperty(obj, property, getter, setter);})
Define(PROPERTY(obj,property,getter),function() {a.defineProperty(obj, property, getter);})
Define(PROPERTY(obj,property),function() {})
Define(GETTER(obj,property,getter),function() {PROPERTY(obj, property, getter);})
Define(SETTER(obj,property,setter),function() {PROPERTY(obj, property, undefined, setter);})
Define(DISMETHOD(obj,method),function() {obj.prototype.method = undefined;})
Define(DISPROPERTY(obj,$$property),function() {PROPERTY(obj, property, undefined, undefined);})
Define(A_CLASS(args),function() {__FUNC__.ctor.apply(this, args);})
Define(A_CLASS(),function() {A_CLASS(arguments);})
Define(parent(),function() {this.constructor.superclass;})
Define(parent.__(__ARGS__),function() {parent.__.call(this, __ARGS__);})
Define(parent($$obj),function() {this.constructor.superclasses[obj];})
Define(LOOKUPGETTER(obj,$$getter),function() {obj.__lookupGetter__(getter).apply(this);})
Define(LOOKUPSETTER(obj,$$setter),function() {obj.__lookupSetter__(setter).apply(this);})
Define(STATIC(name,value),function() {if (!(this.constructor.name)) {this.constructor.name = value;}})
Define(STATIC(object,name,value),function() {object.name = value;})
Define(safe_delete_array(p),function() { {if (p) {for (var _s=0; _s < (p.length); ++_s) {safe_delete(p[_s]);}delete p;p = null;}}})
Define(safe_delete(p),function() { {if (p) {if (p.destructor) {p.destructor();}delete p;p = null;}}})
Define(GEN_ARRAY(name,type,size),function() {name = [];for (var _i=0; _i < size; ++_i) {name[_i] = (type? new type() : null);}})
Define(A_DEFINE_NAMESPACE(name),function() {if (!(a.name))a.name =  {};})
Define(A_DEFINE_NAMESPACE(name,space),function() {if (!(a.space.name))a.space.name =  {};})
Define(A_NAMESPACE(object,space),function() {a.space.object = object;})
Define(A_NAMESPACE(object),function() {a.object = object;})
Define(A_TRACER.MESG(message),function() {})
Define(A_TRACER.BEGIN(),function() {})
Define(A_TRACER.END(),function() {})
Define(Math.fpBits(f),function() {Math.floor(f);})
Define(Math.intBits(f),function() {f;})
Define(Math.fpSign(f),function() {f >> 31;})
Define(Math.flipSign(i,flip),function() {(flip == (-1)? -i : i);})
Define(Math.absoluteValue(value),function() {Math.abs(value);})
Define(Math.isPositive(a),function() {a >= 0;})
Define(Math.isNegative(a),function() {a < 0;})
Define(Math.sameSigns(a,b),function() {(Math.isNegative(b)? -(Math.absoluteValue(a)) : Math.absoluteValue(a));})
Define(Math.deltaRangeTest(a,b,epsilon),function() {((Math.absoluteValue(a - b)) < epsilon? true : false);})
Define(Math.deltaRangeTest(a,b),function() {((Math.absoluteValue(a - b)) < 1e-7? true : false);})
Define(Math.minimum(a,b),function() {Math.min(a, b);})
Define(Math.maximum(a,b),function() {Math.max(a, b);})
Define(Math.clamp(value,low,high),function() {Math.max(low, Math.min(value, high));})
Define(Math.clampPositive(value),function() {(value < 0? 0 : value);})
Define(Math.clampNegative(value),function() {(value > 0? 0 : value);})
Define(Math.clampUnitSize(value),function() {Math.clamp(value, -1, 1);})
Define(Math.highestBitSet(value),function() {(value == 0? null : (value < 0? 31 : ((Math.log(value)) / (Math.LN2)) << 0));})
Define(Math.isPowerOfTwo(value),function() {(value > 0) && ((Math.highestBitSet(value)) == (Math.lowestBitSet(value)));})
Define(Math.raiseToPower(value,power),function() {Math.pow(value, power);})
Define(Math.modulus(a,b),function() {a % b;})
Define(Math.swap(a,b),function() {var temp=a;a = b;b = temp;})
Define(Math.inverse(a),function() {1 / a;})
Define(Math.trimFloat(a,precision),function() {a;})
Define(Math.realToInt32_chop(a),function() {Math.round(a);})
Define(Math.realToInt32_floor(a),function() {Math.floor(a);})
Define(Math.realToInt32_ceil(a),function() {Math.ceil(a);})
Define(Math.realToInt32(a),function() {Math.round(a);})
Define(Math.maxminTest(x,max,min),function() {if (x > max) {max = x;}else if (x < min) {min = x;}})
Define(FLAG(x),function() {1 << x;})
Define(TEST_BIT(value,bit),function() {(value & (FLAG(bit))) != 0;})
Define(TEST_ALL(value,set),function() {(value & set) == set;})
Define(TEST_ANY(value,set),function() {(value & set) != 0;})
Define(SET_BIT(value,bit),function() {value |= FLAG(bit);})
Define(SET_BIT(value,bit,setting),function() {(setting? SET_BIT(value, bit) : CLEAR_BIT(value, bit));})
Define(CLEAR_BIT(value,bit),function() {value &= ~(FLAG(bit));})
Define(SET_ALL(value,set),function() {value |= set;})
Define(CLEAR_ALL(value,set),function() {value &= ~set;})
Define(a.BitFlags.equal(value,src),function() {value = src;})
Define(a.BitFlags.ifequal(value,src),function() {value == src;})
Define(a.BitFlags.ifnotequal(value,src),function() {value != src;})
Define(a.BitFlags.set(value,src),function() {value = src;})
Define(a.BitFlags.clear(value),function() {value = 0;})
Define(a.BitFlags.setFlags(value,src),function() {value |= src;})
Define(a.BitFlags.clearFlags(value,src),function() {value &= ~src;})
Define(a.BitFlags.clearBit(value,bit),function() {value &= ~(1 << bit);})
Define(a.BitFlags.setBit(value,bit,setting),function() {if (setting) {value |= 1 << bit;}else  {a.BitFlags.clearBit(value, bit);}})
Define(a.BitFlags.isEmpty(value),function() {value == 0;})
Define(a.BitFlags.testBit(value,bit),function() {value & (1 << bit);})
Define(a.BitFlags.testFlags(value,src),function() {(value & src) == src;})
Define(a.BitFlags.testAny(value,src),function() {value & src;})
Define(a.BitFlags.totalBits(value),function() {32;})
Define(a.BitFlags.totalSet(value,count),function() {count = a.BitFlags.totalSet(value);})
Define(Vec2.set(v1,v2),function() {v2.X = v1.X;v2.Y = v1.Y;})
Define(Vec3.set(v1,v2),function() {v2.X = v1.X;v2.Y = v1.Y;v2.Z = v1.Z;})
Define(Vec4.set(v1,v2),function() {v2.X = v1.X;v2.Y = v1.Y;v2.Z = v1.Z;v2.W = v1.W;})
Define(Vec2.set(_x,_y,v),function() {v.X = _x;v.Y = _y;})
Define(Vec3.set(_x,_y,_z,v),function() {v.X = _x;v.Y = _y;v.Z = _z;})
Define(Vec4.set(_x,_y,_z,_w,v),function() {v.X = _x;v.Y = _y;v.Z = _z;v.W = _w;})
Define(Vector2(),function() {glMatrixArrayType(2);})
Define(Vector3(x,y,z),function() {glMatrixArrayType([x, y, z]);})
Define(Vector3(c),function() {glMatrixArrayType([c]);})
Define(Vector4(x,y,z,w),function() {glMatrixArrayType([x, y, z, w]);})
Define(Vector4(c,w),function() {glMatrixArrayType([c, c, c, w]);})
Define(Vector4(c),function() {glMatrixArrayType([c, c, c, c]);})
Define(Vector3(),function() {glMatrixArrayType(3);})
Define(Vector4(),function() {glMatrixArrayType(4);})
Define(Matrix3(),function() {glMatrixArrayType(9);})
Define(Matrix4(),function() {glMatrixArrayType(16);})
Define(Mat4.set(mat,dest),function() {dest[0] = mat[0];dest[1] = mat[1];dest[2] = mat[2];dest[3] = mat[3];dest[4] = mat[4];dest[5] = mat[5];dest[6] = mat[6];dest[7] = mat[7];dest[8] = mat[8];dest[9] = mat[9];dest[10] = mat[10];dest[11] = mat[11];dest[12] = mat[12];dest[13] = mat[13];dest[14] = mat[14];dest[15] = mat[15];})
Define(Mat4.set3x3(mat,dest),function() {dest[0] = mat[0];dest[1] = mat[1];dest[2] = mat[2];dest[4] = mat[4];dest[5] = mat[5];dest[6] = mat[6];dest[8] = mat[8];dest[9] = mat[9];dest[10] = mat[10];dest[12] = mat[12];dest[13] = mat[13];dest[14] = mat[14];})
Define(Mat3.set(mat,dest),function() {dest[0] = mat[0];dest[1] = mat[1];dest[2] = mat[2];dest[3] = mat[3];dest[4] = mat[4];dest[5] = mat[5];dest[6] = mat[6];dest[7] = mat[7];dest[8] = mat[8];dest[9] = mat[9];})
Define(Rect3d.unionPointCoord(fX,fY,fZ,rect),function() {rect.fX0 = Math.min(this.fX0, fX);rect.fY0 = Math.min(this.fY0, fY);rect.fZ0 = Math.min(this.fZ0, fZ);rect.fX1 = Math.max(this.fX1, fX);rect.fY1 = Math.max(this.fY1, fY);rect.fZ1 = Math.max(this.fZ1, fZ);})
Define(ARRAY_LIMIT(POSITION,LIMIT),function() {debug_assert(POSITION < LIMIT, "Выход за пределы массива");})
Define(IS_NUMBER(VALUE),function() {debug_assert((typeof VALUE) == "number", "Не является числом");})
Define(a.io.canCreate(MODE),function() {TEST_BIT(MODE, 1);})
Define(a.io.canRead(MODE),function() {TEST_BIT(MODE, 0);})
Define(a.io.canWrite(MODE),function() {TEST_BIT(MODE, 1);})
Define(a.io.isBinary(MODE),function() {TEST_BIT(MODE, 5);})
Define(a.io.isAppend(MODE),function() {TEST_BIT(MODE, 3);})
Define(a.io.isTrunc(MODE),function() {TEST_BIT(MODE, 4);})
Define(FileThread.check(fn,args),function() {if (!(this._pFile)) {var pArgs=args;this.open(function() {fn.apply(this, pArgs);}, fnError);return ;}debug_assert((this._iThread) < 0, (("File(" + (this.name)) + ") already in use. \n thread: ") + (this._iThread));})
Define(LocalFile.checkIfOpen(fn,args),function() {if (!(this._pFile)) {var pArgs=args;this.open(function() {fn.apply(this, pArgs);}, fnError || null);return ;}})
Define(A_UNIQ(pObject,pEngine,pHashData),function() {pEngine.pUniqManager.getUniq(pObject, pHashData);})
Define(A_UNIQ(pObject,pHashData),function() {this.pUniqManager.create(pObject, pHashData);})
Define(A_UNIQ(pHashData),function() {this._pUniqManager.update(this, pHashData);})
Define(A_REGISTER_UNIQ_OBJECT(__ARGS__),function() {a.registerUniqObject(__ARGS__);})
Define(CLEAR_HANDLE(h),function() {h = INVALID_INDEX;})
Define(VALID_HANDLE(h),function() {h != INVALID_INDEX;})
Define(a.SimplePool(pEngine),function() {a.ResourcePool(pEngine, a.ResourcePoolItem);})
Define(a.ShaderProgramManager(pEngine),function() {a.ResourcePool(pEngine, a.GLSLProgram);})
Define(a.SurfaceMaterialManager(pEngine),function() {a.ResourcePool(pEngine, a.SurfaceMaterial);})
Define(a.EffectResourceManager(pEngine),function() {a.ResourcePool(pEngine, a.EffectResource);})
Define(RenderEntry.compare(a,b),function() {((a.hEffectFile) < (b.hEffectFile)? !0 : ((a.hEffectFile) === (b.hEffectFile)? ((a.renderPass) < (b.renderPass)? !0 : ((a.renderPass) === (b.renderPass)? ((a.boneCount) < (b.boneCount)? !0 : ((a.boneCount) === (b.boneCount)? ((a.modelType) < (b.modelType)? !0 : ((a.modelType) === (b.modelType)? ((a.detailLevel) < (b.detailLevel)? !0 : ((a.detailLevel) === (b.detailLevel)? ((a.hModel) < (b.hModel)? !0 : ((a.hModel) === (b.hModel)? ((a.modelParamA) < (b.modelParamA)? !0 : ((a.modelParamA) === (b.modelParamA)? ((a.modelParamB) < (b.modelParamB)? !0 : ((a.modelParamB) === (b.modelParamB)? ((a.hSurfaceMaterial) < (b.hSurfaceMaterial)? !0 : !1) : !1)) : !1)) : !1)) : !1)) : !1)) : !1)) : !1)) : !1));})
Define(RenderQueue.quickSortEntryList(pArr,nMembers),function() {var h=1;while (((h * 3) + 1) < nMembers) {h = (3 * h) + 1;}while (h > 0) {for (var i=h - 1; i < nMembers; i++) {var B=pArr[i];var j=i;for (j = i; (j >= h) && (RenderEntry.compare(B, pArr[j - h])); j -= h) {pArr[j] = pArr[j - h];}pArr[j] = B;}h = (h / 3) << 0;}})
Define(a.PaletteEntry(),function() {Uint8Array(4);})
Define(Float32(v),function() {Float32Array([v]);})
Define(a.Color4i(),function() {Uint8Array(4);})
Define(a.Color3i(),function() {Uint8Array(3);})
Define(a.Color4f(),function() {Float32Array(4);})
Define(a.Color3f(),function() {Float32Array(3);})
Define(a.Color4f(r,g,b,a),function() {Float32Array([r, g, b, a]);})
Define(a.Color4f(c,a),function() {Float32Array([c, c, c, a]);})
Define(a.Color4f(r,g,b),function() {Float32Array([r, g, b, 1]);})
Define(a.Color4f(c),function() {Float32Array([c, c, c, c]);})
Define(a.Color4i(r,g,b,a),function() {Uint8Array([r, g, b, a]);})
Define(a.Color4i(c,a),function() {Uint8Array([c, c, c, a]);})
Define(a.Color4i(r,g,b),function() {Uint8Array([r, g, b, 1]);})
Define(a.Color4i(c),function() {Uint8Array([c, c, c, c]);})
Define(a.Color3f(r,g,b),function() {Float32Array([r, g, b]);})
Define(a.Color3f(c),function() {Float32Array([c, c, c]);})
Define(a.Color3i(r,g,b),function() {Uint8Array([r, g, b]);})
Define(a.Color3i(c),function() {Uint8Array([c, c, c]);})
Define(a.Color4.set(c2,c1),function() {c1.R = c2.R;c1.G = c2.G;c1.B = c2.B;c1.A = c2.A;})
Define(a.Color4.val(v,c),function() {c.R = c.G = c.B = c.A = v;})
Define(a.Color4.val(r,g,b,c),function() {c.R = r;c.G = g;c.B = b;})
Define(a.Color4.val(r,g,b,a,c),function() {c.R = r;c.G = g;c.B = b;c.A = a;})
Define(a.Color3.set(c2,c1),function() {c1.R = c2.R;c1.G = c2.G;c1.B = c2.B;})
Define(a.Color3.val(v,c),function() {c.R = c.G = c.B = v;})
Define(a.Color3.val(r,g,b,c),function() {c.R = r;c.G = g;c.B = b;})
Define(a.ImageManager(pEngine),function() {a.ResourcePool(pEngine, a.Img);})
Define(a.TextureManager(pEngine),function() {a.ResourcePool(pEngine, a.Texture);})
Define(a.IndexBufferManager(pEngine),function() {a.ResourcePool(pEngine, a.IndexBuffer);})
Define(a.VertexBufferManager(pEngine),function() {a.ResourcePool(pEngine, a.VertexBuffer);})
Define(VE_CUSTOM(name,type,count,offset),function() {new Object( {nCount: count, eType: type, eUsage: name, iOffset: offset});})
Define(VE_CUSTOM(name,type,count),function() {VE_CUSTOM(name, type, count, undefined);})
Define(VE_CUSTOM(name,type),function() {VE_CUSTOM(name, type, 1);})
Define(VE_CUSTOM(name),function() {VE_CUSTOM(name, a.DTYPE.FLOAT);})
Define(VE_FLOAT(name,offset),function() {VE_CUSTOM(name, a.DTYPE.FLOAT, 1, offset);})
Define(VE_FLOAT3(name,offset),function() {VE_CUSTOM(name, a.DTYPE.FLOAT, 3, offset);})
Define(VE_FLOAT2(name,offset),function() {VE_CUSTOM(name, a.DTYPE.FLOAT, 2, offset);})
Define(VE_FLOAT4(name,offset),function() {VE_CUSTOM(name, a.DTYPE.FLOAT, 4, offset);})
Define(VE_VEC2(name,offset),function() {VE_CUSTOM(name, a.DTYPE.FLOAT, 2, offset);})
Define(VE_VEC3(name,offset),function() {VE_CUSTOM(name, a.DTYPE.FLOAT, 3, offset);})
Define(VE_VEC4(name,offset),function() {VE_CUSTOM(name, a.DTYPE.FLOAT, 4, offset);})
Define(VE_INT(name,offset),function() {VE_CUSTOM(name, a.DTYPE.INT, 1, offset);})
Define(VE_FLOAT(name),function() {VE_CUSTOM(name, a.DTYPE.FLOAT);})
Define(VE_FLOAT3(name),function() {VE_CUSTOM(name, a.DTYPE.FLOAT, 3);})
Define(VE_FLOAT4(name),function() {VE_CUSTOM(name, a.DTYPE.FLOAT, 4);})
Define(VE_FLOAT2(name),function() {VE_CUSTOM(name, a.DTYPE.FLOAT, 2);})
Define(VE_VEC2(name),function() {VE_CUSTOM(name, a.DTYPE.FLOAT, 2);})
Define(VE_VEC3(name),function() {VE_CUSTOM(name, a.DTYPE.FLOAT, 3);})
Define(VE_VEC4(name),function() {VE_CUSTOM(name, a.DTYPE.FLOAT, 4);})
Define(VE_INT(name),function() {VE_CUSTOM(name, a.DTYPE.INT);})
Define(a.VideoBufferManager(pEngine),function() {a.ResourcePool(pEngine, a.VideoBuffer);})
Define(a.RenderMethodManager(pEngine),function() {a.ResourcePool(pEngine, a.RenderMethod);})
Define(a.ModelManager(pEngine),function() {a.ResourcePool(pEngine, a.ModelResource);})
