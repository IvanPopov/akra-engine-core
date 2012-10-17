///<reference path="base.d.ts" />
///<reference path="types.d.ts" />
///<reference path="WebGL.d.ts" />

module akra {
    export var DEBUG: bool = true;

    export function typeOf(x: any): string {
        var s: string = typeof x;

        if (s === "object") {
            if (x) {

                if (x instanceof Array) {
                    return 'array';
                } else if (x instanceof Object) {
                    return s;
                }

                var sClassName = Object.prototype.toString.call(x);

                if (sClassName == '[object Window]') {
                    return 'object';
                }

                if ((sClassName == '[object Array]' ||
                     typeof x.length == 'number' &&
                     typeof x.splice != 'undefined' &&
                     typeof x.propertyIsEnumerable != 'undefined' &&
                     !x.propertyIsEnumerable('splice')

                    )) {
                    return 'array';
                }

                if ((sClassName == '[object Function]' ||
                    typeof x.call != 'undefined' &&
                    typeof x.propertyIsEnumerable != 'undefined' &&
                    !x.propertyIsEnumerable('call'))) {
                    return 'function';
                }

            } else {
                return 'null';
            }

        } else if (s == 'function' && typeof x.call == 'undefined') {
            return 'object';
        }
        return s;
    };

    /** @inline */
    export var isDef = (x: any): bool =>  x !== undefined;

    /** @inline */
    export var isNull = (x: any): bool =>  x === null;

    /** @inline */
    export var isBoolean = (x: any): bool => typeof x === "boolean";

	/** @inline */
    export var isString = (x: any): bool => typeof x === "string";

    /** @inline */
    export var isNumber = (x: any): bool => typeof x === "number";
    /** @inline */
    export var isFloat = isNumber;
    /** @inline */
    export var isInt = isNumber;

    /** @inline */
    export var isFunction = (x: any): bool => typeOf(x) === "function";

    /** @inline */
    export var isObject = (x: any): bool => {
        var type = typeOf(x);
        return type == 'object' || type == 'array' || type == 'function';
    };

    if (!isDef(console.assert)) {
        console.assert = function (isOK?: bool, ...pParams: any[]): void { 
            if (!isOK) {
                trace('---------------------------');
                trace.apply(null, pParams);
                throw new Error("[assertion failed]");
            }
        }
    }

    export var trace = console.log.bind(console);
    export var assert = console.assert.bind(console);
    export var warning = console.warn.bind(console);
	export var error = console.error.bind(console);

    export var debug_print = (pArg:any, ...pParams: any[]): void => {
        if (DEBUG) {
            trace.apply(null, arguments);
        }
    }

    export var debug_assert = (isOK: bool, ...pParams: any[]): void => {
        if (DEBUG) {
            assert.apply(null, arguments);
        }
    }
    
    export var debug_warning = (pArg:any, ...pParams: any[]): void => {
        if (DEBUG) {
            warning.apply(null, arguments);
        }
    }

	export var debug_error = (pArg:any, ...pParams: any[]): void => {
        if (DEBUG) {
            error.apply(null, arguments);
        }
    }


    export function initDevice(pDevice: WebGLRenderingContext):WebGLRenderingContext {
    	return pDevice;
    }

    export function createDevice(
            pCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.createElement("canvas"), 
            pOptions?: { antialias?: bool; }) {

    	var pDevice: WebGLRenderingContext = null;
		
		try {
			pDevice = pCanvas.getContext("webgl", pOptions) || 
				pCanvas.getContext("experimental-webgl", pOptions);
    	}
		catch (e) {}

		if (!pDevice) {
			debug_warning("cannot get 3d device");
		}

		return initDevice(pDevice);
    }

    export function genArray(pType: any, nSize: uint) {
        var tmp = new Array(nSize);

        for (var i: int = 0; i < nSize; ++i) {
            tmp[i] = (pType? new pType: null);
        }

        return tmp;
    }


    export var INVALID_INDEX: int =  0xffff;

    export var MIN_INT32: int = 0xffffffff;  // (-2147483646);
    export var MAX_INT32: int = 0x7fffffff;  // ( 2147483647);
    export var MIN_INT16: int = 0xffff;      // (-32768);
    export var MAX_INT16: int = 0x7fff;      // ( 32767);
    export var MIN_INT8: int = 0xff;         // (-128);
    export var MAX_INT8: int = 0x7f;         // ( 127);
    export var MIN_UINT32: int = 0;
    export var MAX_UINT32: int = 0xffffffff;
    export var MIN_UINT16: int = 0;
    export var MAX_UINT16: int = 0xffff;
    export var MIN_UINT8: int = 0;
    export var MAX_UINT8: int = 0xff;


    export var SIZE_FLOAT64: int = 8;
    export var SIZE_REAL64: int = 8;
    export var SIZE_FLOAT32: int = 4;
    export var SIZE_REAL32: int = 4;
    export var SIZE_INT32: int = 4;
    export var SIZE_UINT32: int = 4;
    export var SIZE_INT16: int = 2;
    export var SIZE_UINT16: int = 2;
    export var SIZE_INT8: int = 1;
    export var SIZE_UINT8: int = 1;
    export var SIZE_BYTE: int = 1;
    export var SIZE_UBYTE: int = 1;


    export var MAX_FLOAT64: float = Number.MAX_VALUE;      //1.7976931348623157e+308
    export var MIN_FLOAT64: float = -Number.MAX_VALUE;     //-1.7976931348623157e+308
    export var TINY_FLOAT64: float = Number.MIN_VALUE;     //5e-324

//    export var MAX_REAL64: number = Number.MAX_VALUE;   //1.7976931348623157e+308
//    export var MIN_REAL64: number = -Number.MAX_VALUE;  //-1.7976931348623157e+308
//    export var TINY_REAL64: number = Number.MIN_VALUE;  //5e-324


    export var MAX_FLOAT32: float = 3.4e38;    //3.4e38
    export var MIN_FLOAT32: float = -3.4e38;   //-3.4e38
    export var TINY_FLOAT32: float = 1.5e-45;  //1.5e-45

//    export var MAX_REAL32: number = 3.4e38;     //3.4e38
//    export var MIN_REAL32: number = -3.4e38;    //-3.4e38
//    export var TINY_REAL32: number = 1.5e-45;   //1.5e-45

    export enum DataTypes {
        BYTE = 0x1400,
        UNSIGNED_BYTE = 0x1401,
        SHORT = 0x1402,
        UNSIGNED_SHORT = 0x1403,
        INT = 0x1404,
        UNSIGNED_INT = 0x1405,
        FLOAT = 0x1406
    };

    export enum DataTypeSizes {
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
    };

    export enum ResourceTypes {
        SURFACE = 1,
        VOLUME,
        TEXTURE,   
        VOLUMETEXTURE,
        CUBETEXTURE,
        VERTEXBUFFER,
        INDEXBUFFER,
        FORCE_DWORD = 0x7fffffff
    };

    export enum PrimitiveTypes {
        POINTLIST = 0,
        LINELIST,
        LINELOOP,
        LINESTRIP,
        TRIANGLELIST,
        TRIANGLESTRIP,
        TRIANGLEFAN
    };

    export enum ImageFormats {
        RGB = 0x1907,
        RGB8 = 0x1907,
        BGR8 = 0x8060,
        RGBA = 0x1908,
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
        RGBA_DXT5 = 0x83F3,

        DEPTH_COMPONENT = 0x1902,
        ALPHA = 0x1906,
        LUMINANCE = 0x1909,
        LUMINANCE_ALPHA = 0x190A
    };

    export enum ImageShortFormats {
        RGB = 0x1907,
        RGBA = 0x1908
    };

    export enum ImageTypes {
        UNSIGNED_BYTE = 0x1401,
        UNSIGNED_SHORT_4_4_4_4 = 0x8033,
        UNSIGNED_SHORT_5_5_5_1 = 0x8034,
        UNSIGNED_SHORT_5_6_5 = 0x8363,
        FLOAT = 0x1406
    };

    export enum TextureFilters {
        NEAREST = 0x2600,
        LINEAR = 0x2601,
        NEAREST_MIPMAP_NEAREST = 0x2700,
        LINEAR_MIPMAP_NEAREST = 0x2701,
        NEAREST_MIPMAP_LINEAR = 0x2702,
        LINEAR_MIPMAP_LINEAR = 0x2703
    };

    export enum TextureWrapModes {
        REPEAT = 0x2901,
        CLAMP_TO_EDGE = 0x812F,
        MIRRORED_REPEAT = 0x8370
    };

    export enum TextureParameters {
        MAG_FILTER = 0x2800,
        MIN_FILTER,
        WRAP_S,
        WRAP_T
    };

    export enum TextureTypes {
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
    };

    export enum GLSpecifics {
        UNPACK_ALIGNMENT = 0x0CF5,
        PACK_ALIGNMENT = 0x0D05,
        UNPACK_FLIP_Y_WEBGL = 0x9240,
        UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241,
        CONTEXT_LOST_WEBGL = 0x9242,
        UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243,
        BROWSER_DEFAULT_WEBGL = 0x9244
    };

    export enum BufferMasks {
        DEPTH_BUFFER_BIT               = 0x00000100,
        STENCIL_BUFFER_BIT             = 0x00000400,
        COLOR_BUFFER_BIT               = 0x00004000
    };

    export enum BufferUsages {
        STREAM_DRAW = 0x88E0,
        STATIC_DRAW = 0x88E4,
        DYNAMIC_DRAW = 0x88E8
    };

    export enum BufferTypes {
        ARRAY_BUFFER = 0x8892,
        ELEMENT_ARRAY_BUFFER = 0x8893,
        FRAME_BUFFER = 0x8D40,
        RENDER_BUFFER = 0x8D41
    };

    export enum AttachmentTypes {
        COLOR_ATTACHMENT0 = 0x8CE0,
        DEPTH_ATTACHMENT = 0x8D00,
        STENCIL_ATTACHMENT = 0x8D20,
        DEPTH_STENCIL_ATTACHMENT = 0x821A
    };

    export enum ShaderTypes {
        PIXEL = 0x8B30,
        VERTEX
    };

    export enum RenderStates {
        ZENABLE = 7,
        ZWRITEENABLE = 14,
        SRCBLEND = 19,
        DESTBLEND = 20,
        CULLMODE = 22,
        ZFUNC = 23,
        DITHERENABLE = 26,
        ALPHABLENDENABLE = 27,
        ALPHATESTENABLE
    };

    export enum BlendModes {
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
    };

    export enum CmpFuncs {
        NEVER = 1,
        LESS = 2,
        EQUAL = 3,
        LESSEQUAL = 4,
        GREATER = 5,
        NOTEQUAL = 6,
        GREATEREQUAL = 7,
        ALWAYS = 8
    };

    export enum CullModes {
        NONE = 0,
        CW = 0x404, //FRONT
        CCW = 0x0405, //BACK
        FRONT_AND_BACK = 0x0408
    };

    export enum TextureUnits {
        TEXTURE = 0x84C0
    };


    /**
     * Возвращет размер типа в байтах
     **/
    export function getTypeSize(eType: ImageTypes): uint;
    export function getTypeSize(eType: DataTypes): uint;
    export function getTypeSize(eType): uint {
        switch (eType) {
            case DataTypes.BYTE:
            case DataTypes.UNSIGNED_BYTE:
                return 1;
            case DataTypes.SHORT:
            case DataTypes.UNSIGNED_SHORT:
            case ImageTypes.UNSIGNED_SHORT_4_4_4_4:
            case ImageTypes.UNSIGNED_SHORT_5_5_5_1:
            case ImageTypes.UNSIGNED_SHORT_5_6_5:
                return 2;
            case DataTypes.INT:
            case DataTypes.UNSIGNED_INT:
            case DataTypes.FLOAT:
                return 4;
            default:
                error('unknown data/image type used');
        }

        return 0;
    }

    export function ab2ta(pBuffer: ArrayBuffer, eType: DataTypes): ArrayBufferView {
        switch (eType) {
            case DataTypes.FLOAT:
                return new Float32Array(pBuffer);
            case DataTypes.SHORT:
                return new Int16Array(pBuffer);
            case DataTypes.UNSIGNED_SHORT:
                return new Uint16Array(pBuffer);
            case DataTypes.INT:
                return new Int32Array(pBuffer);
            case DataTypes.UNSIGNED_INT:
                return new Uint32Array(pBuffer);
            case DataTypes.BYTE:
                return new Int8Array(pBuffer);
            default:
            case DataTypes.UNSIGNED_BYTE:
                return new Uint8Array(pBuffer);
        }
    }

    
    export var sid = (): uint => (++ sid._iTotal);
    sid._iTotal = 0;

    //export function 

	(<any>window).URL = (<any>window).URL ? (<any>window).URL : (<any>window).webkitURL ? (<any>window).webkitURL : null;
	(<any>window).BlobBuilder = (<any>window).WebKitBlobBuilder || (<any>window).MozBlobBuilder || (<any>window).BlobBuilder;
	(<any>window).requestFileSystem = (<any>window).requestFileSystem || (<any>window).webkitRequestFileSystem;
	(<any>window).requestAnimationFrame = (<any>window).requestAnimationFrame || (<any>window).webkitRequestAnimationFrame ||
		(<any>window).mozRequestAnimationFrame;
	(<any>window).WebSocket = (<any>window).WebSocket || (<any>window).MozWebSocket;
};




///<reference path="libs/libs.ts" />
///<reference path="bf/bitflags.ts" />
///<reference path="bf/bitflags.ts" />
///<reference path="math/math.ts" />

///<reference path="IRect3d.ts" />
///<reference path="geometry/geometry.ts" />

///<reference path="IWorldExtents.ts" />
///<reference path="IViewport.ts" />

///<reference path="IURI.ts" />

///<reference path="IKeyMap.ts" />
///<reference path="IGamepadMap.ts" />

///<reference path="IReferenceCounter.ts" />
///<reference path="IScreenInfo.ts" />
///<reference path="ICanvasInfo.ts" />
///<reference path="IBrowserInfo.ts" />
///<reference path="IApiInfo.ts" />
///<reference path="IDeviceInfo.ts" />

///<reference path="util/util.ts" />
///<reference path="util/ReferenceCounter.ts" />
///<reference path="util/Singleton.ts" />
///<reference path="util/URI.ts" />
///<reference path="util/KeyMap.ts" />
///<reference path="util/GamepadMap.ts" />
///<reference path="util/BrowserInfo.ts" />
///<reference path="util/ApiInfo.ts" />
///<reference path="util/ScreenInfo.ts" />
///<reference path="util/DeviceInfo.ts" />


///<reference path="IResourceWatcherFunc.ts" />
///<reference path="IResourceNotifyRoutineFunc.ts" />
///<reference path="IResourceCode.ts" />
///<reference path="IDataPool.ts" />
///<reference path="IResourcePool.ts" />
///<reference path="IResourcePoolItem.ts" />
///<reference path="IResourcePoolManager.ts" />

///<reference path="pool/ResourceCode.ts" />
///<reference path="pool/DataPool.ts" />
///<reference path="pool/ResourcePool.ts" />
///<reference path="pool/ResourcePoolItem.ts" />
///<reference path="pool/ResourcePoolManager.ts" />

///<reference path="ISceneTree.ts" />
///<reference path="IRenderState.ts" />
///<reference path="IRenderer.ts" />

///<reference path="INode.ts" />
///<reference path="ISceneNode.ts" />
///<reference path="ISceneObject.ts" />
///<reference path="ICamera.ts" />

///<reference path="IFont2d.ts" />

///<reference path="IManager.ts" />
///<reference path="IResourceManager.ts" />
///<reference path="IDisplayManager.ts" />
///<reference path="ILightManager.ts" />
///<reference path="IParticleManager.ts" />
///<reference path="ISpriteManager.ts" />



///<reference path="scene/Node.ts" />
///<reference path="scene/SceneNode.ts" />
///<reference path="scene/SceneObject.ts" />
///<reference path="scene/objects/Camera.ts" />
///<reference path="scene/OcTree.ts" />

///<reference path="IEngine.ts" />
///<reference path="Engine.ts" />
