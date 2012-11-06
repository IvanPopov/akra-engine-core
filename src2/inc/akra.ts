#ifndef AKRA_TS
#define AKRA_TS

#include "base.d.ts"

#define IFACE(IF) export interface IF {}
#define readonly  
#define protected
#define int number
#define uint number
#define float number

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

    // Note that undefined == null.
    /** @inline */ 
    export var isDefAndNotNull = (x: any): bool =>  x != null;

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

    /** @inline */
    export var isArray = (x: any): bool => {
        return typeOf(x) == 'array';
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

    // (-2147483646);
    export var MIN_INT32: int = 0xffffffff;  
    // ( 2147483647);
    export var MAX_INT32: int = 0x7fffffff; 
    // (-32768);
    export var MIN_INT16: int = 0xffff;    
    // ( 32767);  
    export var MAX_INT16: int = 0x7fff;      
    // (-128);
    export var MIN_INT8: int = 0xff; 
    // ( 127);        
    export var MAX_INT8: int = 0x7f;         
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

    //1.7976931348623157e+308
    export var MAX_FLOAT64: float = Number.MAX_VALUE;      
    //-1.7976931348623157e+308
    export var MIN_FLOAT64: float = -Number.MAX_VALUE;     
    //5e-324
    export var TINY_FLOAT64: float = Number.MIN_VALUE;     

//    export var MAX_REAL64: number = Number.MAX_VALUE;   //1.7976931348623157e+308
//    export var MIN_REAL64: number = -Number.MAX_VALUE;  //-1.7976931348623157e+308
//    export var TINY_REAL64: number = Number.MIN_VALUE;  //5e-324


    //3.4e38
    export var MAX_FLOAT32: float = 3.4e38;    
    //-3.4e38
    export var MIN_FLOAT32: float = -3.4e38;
    //1.5e-45  
    export var TINY_FLOAT32: float = 1.5e-45;  

//    export var MAX_REAL32: number = 3.4e38;     //3.4e38
//    export var MIN_REAL32: number = -3.4e38;    //-3.4e38
//    export var TINY_REAL32: number = 1.5e-45;   //1.5e-45

    export enum EDataTypes {
        BYTE = 0x1400,
        UNSIGNED_BYTE = 0x1401,
        SHORT = 0x1402,
        UNSIGNED_SHORT = 0x1403,
        INT = 0x1404,
        UNSIGNED_INT = 0x1405,
        FLOAT = 0x1406
    };

    export enum EDataTypeSizes {
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
    export enum EResourceTypes {
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
        [index: string]: string;
        [index: string]: int;
    };

    export interface StringMap {
        [index: string]: string;
        [index: number]: string;
    };

    export interface IntMap {
        [index: string]: int;
        [index: number]: int;
    };    

    export interface UintMap {
        [index: string]: uint;
        [index: number]: uint;
    };  

    export interface FloatMap {
        [index: string]: float;
        [index: number]: float;
    };

    export interface BoolMap {
        [index: string]: bool;
        [index: number]: bool;
    };        

    export interface BoolDMap{
        [index: string]: BoolMap;
        [index: number]: BoolMap;
    };

    export interface StringDMap{
        [index: string]: StringMap;
        [index: number]: StringMap;
    }
    

    /**
     * Возвращет размер типа в байтах
     **/
    //export function getTypeSize(eType: EImageTypes): uint;
    export function getTypeSize(eType: EDataTypes): uint;
    export function getTypeSize(eType): uint {
        switch (eType) {
            case EDataTypes.BYTE:
            case EDataTypes.UNSIGNED_BYTE:
                return 1;
            case EDataTypes.SHORT:
            case EDataTypes.UNSIGNED_SHORT:
            //case EImageTypes.UNSIGNED_SHORT_4_4_4_4:
            //case EImageTypes.UNSIGNED_SHORT_5_5_5_1:
            //case EImageTypes.UNSIGNED_SHORT_5_6_5:
                return 2;
            case EDataTypes.INT:
            case EDataTypes.UNSIGNED_INT:
            case EDataTypes.FLOAT:
                return 4;
            default:
                error('unknown data/image type used');
        }

        return 0;
    }

    export function ab2ta(pBuffer: ArrayBuffer, eType: EDataTypes): ArrayBufferView {
        switch (eType) {
            case EDataTypes.FLOAT:
                return new Float32Array(pBuffer);
            case EDataTypes.SHORT:
                return new Int16Array(pBuffer);
            case EDataTypes.UNSIGNED_SHORT:
                return new Uint16Array(pBuffer);
            case EDataTypes.INT:
                return new Int32Array(pBuffer);
            case EDataTypes.UNSIGNED_INT:
                return new Uint32Array(pBuffer);
            case EDataTypes.BYTE:
                return new Int8Array(pBuffer);
            default:
            case EDataTypes.UNSIGNED_BYTE:
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




#include "libs/libs.ts"
#include "bf/bitflags.ts"
// #include "math/math.ts"
// /*
// #include "IRect3d.ts"
// #include "IRect3d.ts"
// #include "IRect3d.ts"
// #include "IRect3d.ts"
// */
// #include "geometry/geometry.ts"
// /*
// #include "IWorldExtents.ts"
// #include "IViewport.ts"

// #include "IURI.ts"

// #include "IKeyMap.ts"
// #include "IGamepadMap.ts"

// #include "IColor.ts"

// #include "IReferenceCounter.ts"
// #include "IScreenInfo.ts"
// #include "ICanvasInfo.ts"
// #include "IBrowserInfo.ts"
// #include "IApiInfo.ts"
// #include "IDeviceInfo.ts"
// #include "IUtilTimer.ts"
// */
// #include "info/support/support.ts"
// #include "info/info.ts"
// /*
// #include "IFont2d.ts"
// #include "IString2d.ts"
// */
// #include "util/util.ts"
// #include "util/ReferenceCounter.ts"
// #include "util/Singleton.ts"
// #include "util/URI.ts"
// #include "util/BrowserInfo.ts"
// #include "util/ApiInfo.ts"
// #include "util/ScreenInfo.ts"
// #include "util/DeviceInfo.ts"
// #include "util/UtilTimer.ts"

// #include "controls/KeyMap.ts"
// #include "controls/GamepadMap.ts"

// #include "gui/Font2d.ts"
// #include "gui/String2d.ts"
// /*
// #include "IVertexElement.ts"
// #include "IvertexDeclaration.ts"
// */
// #include "util/VertexElement.ts"
// #include "util/VertexDeclaration.ts"
// /*
// #include "IBufferData.ts"
// #include "IVertexData.ts"
// #include "IIndexData.ts"
// #include "IBufferMap.ts"

// #include "IMesh.ts"

// #include "IResourceWatcherFunc.ts"
// #include "IResourceNotifyRoutineFunc.ts"
// #include "IResourceCode.ts"
// #include "IDataPool.ts"
// #include "IResourcePool.ts"
// #include "IResourcePoolItem.ts"
// #include "IResourcePoolManager.ts"

// #include "IRenderEntry.ts"
// #include "IRenderResource.ts"
// #include "IRenderableObject.ts"
// #include "IRenderSnapshot.ts"
// */

// #include "core/pool/ResourceCode.ts"
// #include "core/pool/DataPool.ts"
// #include "core/pool/ResourcePool.ts"
// #include "core/pool/ResourcePoolItem.ts"
// #include "core/pool/ResourcePoolManager.ts"


// #include "core/pool/resources/IndexBuffer.ts"
// #include "core/pool/resources/VertexBufferVBO.ts"
// #include "core/pool/resources/VertexBufferTBO.ts"
// #include "core/pool/resources/Texture.ts"
// #include "core/pool/resources/ShaderProgram.ts"
// #include "core/pool/resources/Component.ts"
// #include "core/pool/resources/Effect.ts"
// #include "core/pool/resources/SurfaceMaterial.ts"
// #include "core/pool/resources/Img.ts"
// #include "core/pool/resources/RenderMethod.ts"
// #include "core/pool/resources/Model.ts"
// /*
// #include "IBuffer.ts"
// #include "IFrameBuffer.ts"

// #include "ITexture.ts"
// #include "IImg.ts"
// #include "ISurfaceMaterial.ts"
// #include "IShaderProgram.ts"
// #include "IGPUBuffer.ts"
// #include "IIndexBuffer.ts"
// #include "IVertexBuffer.ts"
// #include "IRenderMethod.ts"
// #include "IVideoBuffer.ts"
// #include "IModel.ts"

// #include "IScene.ts"
// #include "IScene3d.ts"
// #include "IScene2d.ts"




// #include "ISceneTree.ts"
// #include "IRenderState.ts"
// #include "IRenderer.ts"
// #include "IScene3d.ts"

// #include "INode.ts"
// #include "ISceneNode.ts"
// #include "ISceneObject.ts"
// #include "ICamera.ts"

// #include "IFont2d.ts"

// #include "IDisplay.ts"
// #include "IDisplay2d.ts"
// #include "IDisplay3d.ts"

// #include "IManager.ts"
// #include "IResourceManager.ts"
// #include "IDisplayManager.ts"
// #include "IParticleManager.ts"

// #include "IAFXEffect.ts"
// #include "IAFXComponent.ts"
// #include "IAFXComponentBlend.ts"
// #include "IAFXPassBlend.ts"
// #include "IAFXPreRenderState.ts"

// #include "IScreen.ts"
// */
// #include "scene/Node.ts"
// #include "scene/SceneNode.ts"
// #include "scene/SceneObject.ts"
// #include "scene/objects/Camera.ts"
// #include "scene/OcTree.ts"
// #include "scene/Scene3d.ts"

// //#include "IBuildScenario.ts"
// //#include "ISceneBuilder.ts"

// #include "render/Renderer.ts"
// #include "scene/SceneBuilder.ts"


// //#include "IEngine.ts"

// #include "core/Engine.ts"
// #include "core/DisplayManager.ts"

// #include "display/Display2d.ts"
// #include "display/Display3d.ts"

#include "util/Parser.ts"

#endif