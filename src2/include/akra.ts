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

/*
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

*/

    export interface StringEnum {
        [string]: string;
        [string]: int;
    };

    export interface StringMap {
        [string]: string;
    };

    export interface IntMap {
        [string]: int;
        [int]: int;
    };    

    export interface UintMap {
        [string]: uint;
        [uint]: uint;
    };  

    export interface FloatMap {
        [string]: float;
        [float]: float;
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
///<reference path="IFont2d.ts" />
///<reference path="IString2d.ts" />

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
///<reference path="util/Font2d.ts" />
///<reference path="util/String2d.ts" />


///<reference path="IResourceWatcherFunc.ts" />
///<reference path="IResourceNotifyRoutineFunc.ts" />
///<reference path="IResourceCode.ts" />
///<reference path="IDataPool.ts" />
///<reference path="IResourcePool.ts" />
///<reference path="IResourcePoolItem.ts" />
///<reference path="IResourcePoolManager.ts" />

///<reference path="IRenderResource.ts" />

///<reference path="pool/ResourceCode.ts" />
///<reference path="pool/DataPool.ts" />
///<reference path="pool/ResourcePool.ts" />
///<reference path="pool/ResourcePoolItem.ts" />
///<reference path="pool/ResourcePoolManager.ts" />

///<reference path="ITexture.ts" />
///<reference path="IImg.ts" />

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
