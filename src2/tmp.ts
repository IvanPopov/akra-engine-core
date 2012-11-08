












interface String {
	toUTF8(): string;
	fromUTF8(): string;

	md5(): string;
	sha1(): string;
	crc32(): string;
	replaceAt(n: int, s: string);
}

interface Array {
    last: any;
    first: any;
    el(i :int): any;
    clear(): any[];
    swap(i: int, j: int): any[];
    insert(elements: any[]): any[];
}

interface Number {
	toHex(length: int): string;
	printBinary(isPretty?: bool);
}











module akra {


    export var  DEBUG : bool = true;


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
            trace.apply(null, arguments);
    }

    export var debug_assert = (isOK: bool, ...pParams: any[]): void => {
            assert.apply(null, arguments);
    }

    export var debug_warning = (pArg:any, ...pParams: any[]): void => {
            warning.apply(null, arguments);
    }

	export var debug_error = (pArg:any, ...pParams: any[]): void => {
            error.apply(null, arguments);
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


    export  var  INVALID_INDEX: int =  0xffff;

// (-2147483646);
    export  var  MIN_INT32: int = 0xffffffff;
// ( 2147483647);
    export  var  MAX_INT32: int = 0x7fffffff;
// (-32768);
    export  var  MIN_INT16: int = 0xffff;
// ( 32767);  
    export  var  MAX_INT16: int = 0x7fff;
// (-128);
    export  var  MIN_INT8: int = 0xff;
// ( 127);        
    export  var  MAX_INT8: int = 0x7f;
    export  var  MIN_UINT32: int = 0;
    export  var  MAX_UINT32: int = 0xffffffff;
    export  var  MIN_UINT16: int = 0;
    export  var  MAX_UINT16: int = 0xffff;
    export  var  MIN_UINT8: int = 0;
    export  var  MAX_UINT8: int = 0xff;


    export  var  SIZE_FLOAT64: int = 8;
    export  var  SIZE_REAL64: int = 8;
    export  var  SIZE_FLOAT32: int = 4;
    export  var  SIZE_REAL32: int = 4;
    export  var  SIZE_INT32: int = 4;
    export  var  SIZE_UINT32: int = 4;
    export  var  SIZE_INT16: int = 2;
    export  var  SIZE_UINT16: int = 2;
    export  var  SIZE_INT8: int = 1;
    export  var  SIZE_UINT8: int = 1;
    export  var  SIZE_BYTE: int = 1;
    export  var  SIZE_UBYTE: int = 1;

//1.7976931348623157e+308
    export  var  MAX_FLOAT64: float = Number.MAX_VALUE;
//-1.7976931348623157e+308
    export  var  MIN_FLOAT64: float = -Number.MAX_VALUE;
//5e-324
    export  var  TINY_FLOAT64: float = Number.MIN_VALUE;

//    export const MAX_REAL64: number = Number.MAX_VALUE;   //1.7976931348623157e+308
//    export const MIN_REAL64: number = -Number.MAX_VALUE;  //-1.7976931348623157e+308
//    export const TINY_REAL64: number = Number.MIN_VALUE;  //5e-324


//3.4e38
    export  var  MAX_FLOAT32: float = 3.4e38;
//-3.4e38
    export  var  MIN_FLOAT32: float = -3.4e38;
//1.5e-45  
    export  var  TINY_FLOAT32: float = 1.5e-45;

//    export const MAX_REAL32: number = 3.4e38;     //3.4e38
//    export const MIN_REAL32: number = -3.4e38;    //-3.4e38
//    export const TINY_REAL32: number = 1.5e-45;   //1.5e-45

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

    export function now(): uint {
        return (new Date).getTime();
    }

//export function 

	(<any>window).URL = (<any>window).URL ? (<any>window).URL : (<any>window).webkitURL ? (<any>window).webkitURL : null;
	(<any>window).BlobBuilder = (<any>window).WebKitBlobBuilder || (<any>window).MozBlobBuilder || (<any>window).BlobBuilder;
	(<any>window).requestFileSystem = (<any>window).requestFileSystem || (<any>window).webkitRequestFileSystem;
	(<any>window).requestAnimationFrame = (<any>window).requestAnimationFrame || (<any>window).webkitRequestAnimationFrame ||
		(<any>window).mozRequestAnimationFrame;
	(<any>window).WebSocket = (<any>window).WebSocket || (<any>window).MozWebSocket;

    Worker.prototype.postMessage = (<any>Worker).prototype.webkitPostMessage || Worker.prototype.postMessage;
};



module akra.utils.test {

	var pTestCondList: ITestCond[] = [];

	function addCond(pCond: ITestCond): void {
		pTestCondList.unshift(pCond);
	}

	interface ITestCond {
		description: string;
		toString(): string;
		verify(pArgv: any[]): bool;
	}

	class TestCond implements ITestCond {
		private sDescription: string;
		constructor (sDescription: string) {
			this.sDescription = sDescription;
		}

		toString(): string {
			return this.sDescription;
		}
	}

	class TrueCond extends TestCond implements ITestCond {
		constructor (sDescription: string) {
			super(sDescription);
		}

		verify(pArgv: any[]): bool {
			if (pArgv[0] === true) {
				return true;
			}
		}
	}

	function output(sText: string): void {
		document.body.innerHTML += sText;
	}

	export function check(...pArgv: any[]): void {
		var pTest: ITestCond = pTestCondList.pop();

		if (!pTest) {
			console.log((new Error).stack);
			console.warn("chech() without condition...");
			return;
		}

		var bResult: bool = pTest.verify(pArgv);


		if (bResult) {
			output("<pre><span style=\"color: green;\">[ PASS ] </span>" + pTest.toString() + "</pre>");
		}
		else {
			output("<pre><span style=\"color: red;\">[ FAIL ] </span>" + pTest.toString() + "</pre>");
		}

	}

	export function shouldBeTrue(sDescription: string) {
		addCond(new TrueCond(sDescription));
	}

	export interface ITestManifest {
		name: string;
		main: () => void;
		description?: string;
	}

	export class Test {
		constructor (pManifest: ITestManifest) {
			Test.pTestList.push(pManifest);
		}

		static pTestList: Test[] = [];
		static run(): void {
			var pTestList = Test.pTestList;
			for (var i: int = 0; i < pTestList.length; ++ i) {
				var pTest: ITestManifest = pTestList[i];
				pTest.main();
			};
		}
	}

	export function run(): void {
		Test.run();
	}
}


























module akra {
	export interface IPathinfo {
		path: string;
		dirname: string;
		filename: string;
		ext: string;
		basename: string;


		set(sPath: string): void;
		set(pPath: IPathinfo): void;
		isAbsolute(): bool;

		toString(): string;
	}

}



module akra {
	export class Pathinfo implements IPathinfo {
		private _sDirname: string = null;
		private _sExtension: string = null;
		private _sFilename: string = null;

		/**@inline*/  get path(): string { return this.toString(); }
		/**@inline*/  set path(sPath: string) { this.set(sPath); }

		/**@inline*/  get dirname(): string { return this._sDirname; }
		/**@inline*/  set dirname(sDirname: string) { this._sDirname = sDirname; }

		/**@inline*/  get filename(): string { return this._sFilename; }
		/**@inline*/  set filename(sFilename: string) { this._sFilename = sFilename; }

		/**@inline*/  get ext(): string { return this._sExtension; }
		/**@inline*/  set ext(sExtension: string) { this._sExtension = sExtension; }

		/**@inline*/  get basename(): string {
			return (this._sFilename ? this._sFilename + (this._sExtension ? "." + this._sExtension : "") : "");
		}

		/**@inline*/  set basename(sBasename: string) {
			var nPos: uint = sBasename.lastIndexOf(".");

	        if (nPos < 0) {
	            this._sFilename = sBasename.substr(0);
	            this._sExtension = null;
	        }
	        else {
	            this._sFilename = sBasename.substr(0, nPos);
	            this._sExtension = sBasename.substr(nPos + 1);
	        }
		}

		constructor (pPath: IPathinfo);
		constructor (sPath: string);
		constructor (pPath?: any) {
			if (isDef(pPath)) {
				this.set(<string>pPath);
			}
		}

		set(sPath: string): void;
		set(pPath: IPathinfo): void;
		set(sPath?: any) {
			if (isString(sPath)) {
		        var pParts: string[] = sPath.replace('\\', '/').split('/');

		        this.basename = pParts.pop();

		        this._sDirname = pParts.join('/');
		    }
		    else if (sPath instanceof Pathinfo) {
		        this._sDirname = sPath.dirname;
		        this._sFilename = sPath.filename;
		        this._sExtension = sPath.ext;
		    }
		    else {
//critical_error
		        error("Unexpected data type was used.");
		    }
		}

		isAbsolute(): bool { return this._sDirname[0] === "/"; }

		toString(): string {
			return (this._sDirname ? this._sDirname + "/" : "") + (this.basename);
		}
	}

}










module akra {
	export interface IURI {
		scheme: string;
		userinfo: string;
		host: string;
		port: uint;
		path: string;
		query: string;
		fragment: string;
		urn: string;
		url: string;
		authority: string;
		protocol: string;

		toString(): string;
	}
}



module akra.util {
	export class URI implements IURI {
		private sScheme: string = null;
		private sUserinfo: string = null;
		private sHost: string = null;
		private nPort: uint = 0;
		private sPath: string = null;
		private sQuery: string = null;
		private sFragment: string = null;

		get urn(): string {
			return (this.sPath ? this.sPath : "") +
			(this.sQuery ? '?' + this.sQuery : "") +
			(this.sFragment ? '#' + this.sFragment : "");
		}

		get url(): string {
			return (this.sScheme ? this.sScheme : "") + this.authority;
		}

		get authority(): string {
			return (this.sHost ? '//' + (this.sUserinfo ? this.sUserinfo + '@' : "") +
				this.sHost + (this.nPort ? ':' + this.nPort : "") : "");
		}

		/**@inline*/  get scheme(): string {
			return this.sScheme;
		}

		get protocol(): string {
			if (!this.sScheme) {
				return this.sScheme;
			}

			return (this.sScheme.substr(0, this.sScheme.lastIndexOf(':')));
		}

		/**@inline*/  get userinfo(): string {
			return this.sUserinfo;
		}

		/**@inline*/  get host(): string {
			return this.sHost;
		}

		/**@inline*/  get port(): uint {
			return this.nPort;
		}

		/**@inline*/  set port(iPort: uint) {
			this.nPort = iPort;
		}

		/**@inline*/  get path(): string {
			return this.sPath;
		}

		/**@inline*/  get query(): string {
			return this.sQuery;
		}

		/**@inline*/  get fragment(): string {
			return this.sFragment;
		}


		constructor (pUri: URI);
		constructor (sUri: string);
		constructor (pUri?) {
			if (pUri) {
				this.set(pUri);
			}
		}

		set(pUri: URI);
		set(sUri: string);
		set(pData?): URI {
			if (isString(pData)) {
				var pUri:RegExpExecArray = URI.uriExp.exec(<string>pData);

				debug_assert(pUri !== null, 'Invalid URI format used.\nused uri: ' + pData);

				if (!pUri) {
					return null;
				}

				this.sScheme = pUri[1] || null;
				this.sUserinfo = pUri[2] || null;
				this.sHost = pUri[3] || null;
				this.nPort = parseInt(pUri[4]) || null;
				this.sPath = pUri[5] || pUri[6] || null;
				this.sQuery = pUri[7] || null;
				this.sFragment = pUri[8] || null;

				return this;

			}
			else if (pData instanceof URI) {
				return this.set(pData.toString());
			}

			debug_error('Unexpected data type was used.');

			return null;
		}

		toString(): string {
			return this.url + this.urn;
		}

//------------------------------------------------------------------//
//----- Validate a URI -----//
//------------------------------------------------------------------//
//- The different parts are kept in their own groups and can be recombined
//  depending on the scheme:
//  - http as $1://$3:$4$5?$7#$8
//  - ftp as $1://$2@$3:$4$5
//  - mailto as $1:$6?$7
//- groups are as follows:
//  1   == scheme
//  2   == userinfo
//  3   == host
//  4   == port
//  5,6 == path (5 if it has an authority, 6 if it doesn't)
//  7   == query
//  8   == fragment


		static private uriExp:RegExp = new RegExp("^([a-z0-9+.-]+:)?(?:\\/\\/(?:((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(?::(\\d*))?(\\/(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?|(\\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})*(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?)(?:\\?((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?$", "i");

/*
		 composed as follows:
		 ^
		 ([a-z0-9+.-]+):							#scheme
		 (?:
		 //							#it has an authority:
		 (?:((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?	#userinfo
		 ((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)		#host
		 (?::(\d*))?						#port
		 (/(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?	#path
		 |
		 #it doesn't have an authority:
		 (/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})+(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?	#path
		 )
		 (?:
		 \?((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*)	#query string
		 )?
		 (?:
		 #((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*)	#fragment
		 )?
		 $
		 */

	}
}











module akra {
	export interface IReferenceCounter {
/**
		 * Текущее количесвто ссылок  на объект
		 **/

		referenceCount(): uint;

/** Предупреждает если объект еще используется */

		destructor(): void;


/**
		 * Добаволение ссылки  на объект, увеличивает внутренний счетчки на 1,
		 * проверяет не достигнуто ли максимальное количесвто
		 **/

		addRef(): uint;

/**
		 * Уведомление об удалении ссылки  на объект, уменьшает внутренний счетчки на 1,
		 * проверяет есть ли ее объекты
		 **/

		release(): uint;


/** 
		 * Данная функция нужна чтобы обеспечить наследникам ее возможность,
		 * само количестdо ссылок не копируется
		 */

		eq(pSrc: IReferenceCounter): IReferenceCounter;
	}
}



module akra.util {
	export class ReferenceCounter implements IReferenceCounter {
		private nReferenceCount: uint = 0;

/** Выстанавливает чило ссылок  на объект в ноль */

		constructor ();
/** 
		 * Выстанавливает чило ссылок  на объект в ноль
 		 * количесвто ссылок привязаны к конкретному экземпляру, поэтому никогда не копируются 
 		 */

		constructor (pSrc: IReferenceCounter);
		constructor (pSrc?) {}

/** @inline */

		referenceCount(): uint {
			return this.nReferenceCount;
		}

/** @inline */

		destructor(): void {
			assert(this.nReferenceCount === 0, 'object is used');
		}

		release(): uint {
			assert(this.nReferenceCount > 0, 'object is used');
		    this.nReferenceCount--;
		    return this.nReferenceCount;
		}

		addRef(): uint {
			assert(this.nReferenceCount != MIN_INT32, 'reference fail');

    		this.nReferenceCount ++;

			return this.nReferenceCount;
		}

/** @inline */

		eq (pSrc: IReferenceCounter): IReferenceCounter {
		    return this;
		};
	}
}






module akra.util {
	export class Singleton {
		constructor () {
			var _constructor = (<any>this).constructor;

			assert(!isDef(_constructor._pInstance),
				'Singleton class may be created only one time.');

			_constructor._pInstance = this;
		}
	}
}











module akra {
	export interface IBrowserInfo {
		name: string;
		version: string;
		os: string;
	}
}






module akra.util {
	export interface IBrowserData {
		string: string;
		subString: string;
		identity: string;
		versionSearch?: string;
		prop?: string;
	}

	export class BrowserInfo extends Singleton implements IBrowserInfo {
		private sBrowser: string = null;
		private sVersion: string = null;
		private sOS: string = null;
		private sVersionSearch: string = null;

		get name(): string {
			return this.sBrowser;
		}

		get version(): string {
			return this.sVersion;
		}

		get os(): string {
			return this.sOS;
		}

		private init(): void {
			this.sBrowser = this.searchString(BrowserInfo.dataBrowser) || "An unknown browser";
			this.sVersion = this.searchVersion(navigator.userAgent)
								|| this.searchVersion(navigator.appVersion)
				|| "an unknown version";
			this.sOS = this.searchString(BrowserInfo.dataOS) || "an unknown OS";
		}

		private searchString(pDataBrowser: IBrowserData[]): string {
			for (var i:int = 0; i < pDataBrowser.length; i++) {
				var sData:string = pDataBrowser[i].string;
				var dataProp:string = pDataBrowser[i].prop;

				this.sVersionSearch = pDataBrowser[i].versionSearch || pDataBrowser[i].identity;

				if (sData) {
					if (sData.indexOf(pDataBrowser[i].subString) != -1) {
						return pDataBrowser[i].identity;
					}
				}
				else if (dataProp) {
					return pDataBrowser[i].identity;
				}
			}
			return null;
		}

		private searchVersion(sData: string): string {
			var iStartIndex:int = sData.indexOf(this.sVersionSearch);

			if (iStartIndex == -1) {
				return null;
			}

			iStartIndex = sData.indexOf('/', iStartIndex + 1);

			if (iStartIndex == -1) {
				return null;
			}

			var iEndIndex:int = sData.indexOf(' ', iStartIndex + 1);

			if (iEndIndex == -1) {
				iEndIndex = sData.indexOf(';', iStartIndex + 1);
				if (iEndIndex == -1) {
					return null;
				}
				return sData.slice(iStartIndex + 1);
			}

			return sData.slice((iStartIndex + 1), iEndIndex);
		}

		static private dataBrowser: IBrowserData[] = [
			{
				string: navigator.userAgent,
				subString: "Chrome",
				identity: "Chrome"
			},
			{
				string: navigator.userAgent,
				subString: "OmniWeb",
				versionSearch: "OmniWeb/",
				identity: "OmniWeb"
			},
			{
				string: navigator.vendor,
				subString: "Apple",
				identity: "Safari",
				versionSearch: "Version"
			},
			{
				prop: window.opera,
				identity: "Opera",
				versionSearch: "Version"
			},
			{
				string: navigator.vendor,
				subString: "iCab",
				identity: "iCab"
			},
			{
				string: navigator.vendor,
				subString: "KDE",
				identity: "Konqueror"
			},
			{
				string: navigator.userAgent,
				subString: "Firefox",
				identity: "Firefox"
			},
			{
				string: navigator.vendor,
				subString: "Camino",
				identity: "Camino"
			},
			{
// for newer Netscapes (6+)
				string: navigator.userAgent,
				subString: "Netscape",
				identity: "Netscape"
			},
			{
				string: navigator.userAgent,
				subString: "MSIE",
				identity: "Explorer",
				versionSearch: "MSIE"
			},
			{
				string: navigator.userAgent,
				subString: "Gecko",
				identity: "Mozilla",
				versionSearch: "rv"
			},
			{
// for older Netscapes (4-)
				string: navigator.userAgent,
				subString: "Mozilla",
				identity: "Netscape",
				versionSearch: "Mozilla"
			}
		];

		static private dataOS: IBrowserData[] = [
			{
				string    : navigator.platform,
				subString : "Win",
				identity  : "Windows"
			},
			{
				string    : navigator.platform,
				subString : "Mac",
				identity  : "Mac"
			},
			{
				string    : navigator.userAgent,
				subString : "iPhone",
				identity  : "iPhone/iPod"
			},
			{
				string    : navigator.platform,
				subString : "Linux",
				identity  : "Linux"
			}
		];
	}
}











module akra {
	export interface IApiInfo {
		webGL: bool;
		webAudio: bool;
		file: bool;
		fileSystem: bool;
		webWorker: bool;
		transferableObjects: bool;
		localStorage: bool;
		webSocket: bool;
	}
}





module akra.util {
	export class ApiInfo extends Singleton implements IApiInfo {
		private bWebGL: bool = false;
		private bWebAudio: bool = false;
		private bFile: bool = false;
		private bFileSystem: bool = false;
		private bWebWorker: bool = false;
		private bTransferableObjects: bool = false;
		private bLocalStorage: bool = false;
		private bWebSocket: bool = false;

		get webGL(): bool {
			if (!this.bWebGL) {
				this.bWebGL = ((<any>window).WebGLRenderingContext || this.checkWebGL() ? true : false);
			}

			return this.bWebGL;
		}

		get transferableObjects(): bool {
			if (!this.bTransferableObjects) {
				this.bTransferableObjects = (this.bWebWorker && this.chechTransferableObjects() ? true : false);
			}

			return this.bTransferableObjects;
		}

		get file(): bool {
			return this.bFile;
		}

		get fileSystem(): bool {
			return this.bFileSystem;
		}

		get webAudio(): bool {
			return this.bWebAudio;
		}

		get webWorker(): bool {
			return this.bWebWorker;
		}

		get localStorage(): bool {
			return this.bLocalStorage;
		}

		get webSocket(): bool {
			return this.bWebSocket;
		}

		constructor () {
			super();

			var pApi = {};

			this.bWebAudio = ((<any>window).AudioContext && (<any>window).webkitAudioContext ? true : false);
			this.bFile = ((<any>window).File && (<any>window).FileReader && (<any>window).FileList && (<any>window).Blob ? true : false);
			this.bFileSystem = (this.bFile && (<any>window).URL && (<any>window).requestFileSystem ? true : false);
			this.bWebWorker = isDef((<any>window).Worker);
			this.bLocalStorage = isDef((<any>window).localStorage);
			this.bWebSocket = isDef((<any>window).WebSocket);
		}

		private checkWebGL(): bool {
			var pCanvas: HTMLCanvasElement;
			var pDevice: WebGLRenderingContext;

			try {
				pCanvas = <HTMLCanvasElement> document.createElement('canvas');
				pDevice = pCanvas.getContext('webgl', {}) ||
                       		pCanvas.getContext('experimental-webgl', {});

                if (pDevice) {
                	return true;
                }
			}
			catch (e) {}

			return false;
		}

		private chechTransferableObjects(): bool {
			var pBlob: Blob = new Blob(["onmessage = function(e) { postMessage(true); }"]);
			var sBlobURL: string = (<any>window).URL.createObjectURL(pBlob);
			var pWorker: Worker = new Worker(sBlobURL);

			var pBuffer: ArrayBuffer = new ArrayBuffer(1);

		    try {
		        pWorker.postMessage(pBuffer, [pBuffer]);
		    }
		    catch (e) {
		        debug_print('transferable objects not supported in your browser...');
		    }

		    pWorker.terminate();

		    if (pBuffer.byteLength) {
		        return false
		    }

		    return true;
		}
	}
}










module akra {
	export interface IScreenInfo {
		width: int;
		height: int;
		aspect: float;
		pixelDepth: int;
		colorDepth: int;
	}
}



module akra.util {
	export class ScreenInfo implements IScreenInfo {
		get width(): int {
			return screen.width;
		}

		get height(): int {
			return screen.height;
		}

		get aspect(): float {
			return screen.width / screen.height;
		}

		get pixelDepth(): int {
			return screen.pixelDepth;
		}

		get colorDepth(): int {
			return screen.colorDepth;
		}
	}
}










module akra {
	export interface IDeviceInfo {
		maxTextureSize: uint;
		maxCubeMapTextureSize: uint;
		maxViewPortSize: uint;

		maxTextureImageUnits: uint;
		maxVertexAttributes: uint;
		maxVertexTextureImageUnits: uint;
		maxCombinedTextureImageUnits: uint;

		stencilBits: uint;
		colorBits: uint[];
		alphaBits: uint;
		multisampleType: float;

		shaderVersion: float;

		getExtention(pDevice: WebGLRenderingContext, csExtension: string);
		checkFormat(pDevice: WebGLRenderingContext, eFormat: EImageFormats);
	}
}













module akra {

	export interface IEngine {} ;
	export interface IResourceWatcherFunc {} ;
	export interface IResourceNotifyRoutineFunc {} ;
	export interface IResourceCode {} ;
	export interface IResourcePool {} ;
	export interface IResourcePoolManager {} ;

/**
     * Отражает состояние ресурса
     **/

    export enum EResourceItemEvents{
//ресур создан
		k_Created,
//ресур заполнен данным и готов к использованию
		k_Loaded,
//ресур в данный момент отключен для использования
		k_Disabled,
//ресур был изменен после загрузки		
		k_Altered,
		k_TotalResourceFlags
	};

	export interface IResourcePoolItem extends IReferenceCounter {
/** resource code */

		 resourceCode: IResourceCode;
/** resource pool */

		 resourcePool: IResourcePool;
/** resource handle */

		 resourceHandle: int;
/** resource flags */

		 resourceFlags: int;
/** Проверка был ли изменен ресур после загрузки */

		 alteredFlag: bool;

		 manager: IResourcePoolManager;


		/**@inline*/  getGuid(): int;
/** Get current Engine. */

		getEngine(): IEngine;

/** Инициализация ресурса, вызывается один раз. Виртуальная. */

		createResource(): bool;
/** Уничтожение ресурса. Виртуальная. */

		destroyResource(): bool;
/**  Удаление ресурса из энергозависимой памяти. Виртуальная. */

		disableResource(): bool;
/** Возвращение ресурса в энегрозависимю память. Виртуальная. */

		restoreResource(): bool;

/** Загрузка ресурса из файла, или null при использовании имени ресурса. Виртуальная. */

		loadResource(sFilename?: string): bool;
/** Сохранение ресурса в файл, или null при использовании имени ресурса. */

		saveResource(sFilename?: string): bool;

/** Добавление и удаление функции, которая будет вызываться при изменении состояния ресурса( fnFunc(iNewSost,iOldSost) ) */

		setChangesNotifyRoutine(fn: IResourceNotifyRoutineFunc): void;
		delChangesNotifyRoutine(fn: IResourceNotifyRoutineFunc): void;

		setStateWatcher(eEvent: EResourceItemEvents, fnWatcher: IResourceWatcherFunc): void;

/** sinchronize events with other resourse */

		connect(pResourceItem: IResourcePoolItem, eSignal: EResourceItemEvents, eSlot?: EResourceItemEvents): bool;
		disconnect(pResourceItem: IResourcePoolItem, eSignal: EResourceItemEvents, eSlot?: EResourceItemEvents): bool;

/** Установка состояния в созданный */

		notifyCreated(): void;
/** Установка в состояние не созданный */

		notifyDestroyed(): void;
/** Уставнока в состояние загруженный */

		notifyLoaded(): void;
/** Уставнока в состояние незагруженный */

		notifyUnloaded(): void;
/** Установка в состояние используемый */

		notifyRestored(): void;
/** Установка в состояние не используемый */

		notifyDisabled(): void;
/** Установка в состояние не используемый */

		notifyAltered(): void;
/** Установка в состояние сохраненый */

		notifySaved(): void;

		notifyStateChange(eEvent: EResourceItemEvents, pTarget?: IResourcePoolItem);

/** Проверка создан ли ресурс */

		isResourceCreated(): bool;
/** Проверка загружен ли ресурс */

		isResourceLoaded(): bool;
/** Проверка активен ли ресурс */

		isResourceDisabled(): bool;
/** Проверка обновлен ли ресурс */

		isResourceAltered(): bool;

/** Установка состояния в изменен после загружки */

		setAlteredFlag(isOn?: bool): void;

/** Пиписывание ресурсу имени */

		setResourceName(sName: string);

/** Поиск имени ресурса */

		findResourceName(): string;

/** оповещение о уменьшении количесва ссылок на ресурс */

		release(): uint;

		setResourceCode(pCode: IResourceCode): void;
		setResourcePool(pPool: IResourcePool): void;
		setResourceHandle(iHandle: int): void;

		setResourceFlag(eFlagBit: EResourceItemEvents, isSetting: bool): void;
		setResourceFlag(iFlagBit: int, isSetting: bool): void;
	}

	export interface IResourcePoolItemType {
		new (pManager: IResourcePoolManager): IResourcePoolItem;
	}
}



module akra {
	 export enum EImageFormats {
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

    export enum EImageShortFormats {
        RGB = 0x1907,
        RGBA = 0x1908
    };

    export enum EImageTypes {
        UNSIGNED_BYTE = 0x1401,
        UNSIGNED_SHORT_4_4_4_4 = 0x8033,
        UNSIGNED_SHORT_5_5_5_1 = 0x8034,
        UNSIGNED_SHORT_5_6_5 = 0x8363,
        FLOAT = 0x1406
    };

    export interface IImg extends IResourcePoolItem {

    }

}





module akra.util {
	export class DeviceInfo extends Singleton implements IDeviceInfo {
		private nMaxTextureSize: uint = 0;
		private nMaxCubeMapTextureSize: uint = 0;
		private nMaxViewPortSize: uint = 0;

		private nMaxTextureImageUnits: uint = 0;
		private nMaxVertexAttributes: uint = 0;
		private nMaxVertexTextureImageUnits: uint = 0;
		private nMaxCombinedTextureImageUnits: uint = 0;

		private nMaxColorAttachments: uint = 1;

		private nStencilBits: uint = 0;
		private pColorBits: uint[] = [0, 0, 0];
		private nAlphaBits: uint = 0;
		private fMultisampleType: float = 0.;

		private fShaderVersion: float = 0;

		get maxTextureSize(): uint { return this.nMaxTextureSize; }
		get maxCubeMapTextureSize(): uint { return this.nMaxCubeMapTextureSize; }
		get maxViewPortSize(): uint { return this.nMaxViewPortSize; }

 		get maxTextureImageUnits(): uint { return this.nMaxTextureImageUnits; }
		get maxVertexAttributes(): uint { return this.nMaxVertexAttributes; }
		get maxVertexTextureImageUnits(): uint { return this.nMaxVertexTextureImageUnits; }
		get maxCombinedTextureImageUnits(): uint { return this.nMaxCombinedTextureImageUnits; }

		get maxColorAttachments(): uint { return this.nMaxColorAttachments; }

		get stencilBits(): uint { return this.nStencilBits; }
		get colorBits(): uint[] { return this.pColorBits; }
		get alphaBits(): uint { return this.nAlphaBits; }
		get multisampleType(): float { return this.fMultisampleType; }

		get shaderVersion(): float { return this.fShaderVersion; }

		constructor () {
			super();

			var pDevice = createDevice();

			if (!pDevice) {
				return;
			}

			this.nMaxTextureSize = pDevice.getParameter(pDevice.MAX_TEXTURE_SIZE);
			this.nMaxCubeMapTextureSize = pDevice.getParameter(pDevice.MAX_CUBE_MAP_TEXTURE_SIZE);
			this.nMaxViewPortSize = pDevice.getParameter(pDevice.MAX_VIEWPORT_DIMS);

			this.nMaxTextureImageUnits = pDevice.getParameter(pDevice.MAX_TEXTURE_IMAGE_UNITS);
			this.nMaxVertexAttributes = pDevice.getParameter(pDevice.MAX_VERTEX_ATTRIBS);
			this.nMaxVertexTextureImageUnits = pDevice.getParameter(pDevice.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
			this.nMaxCombinedTextureImageUnits = pDevice.getParameter(pDevice.MAX_COMBINED_TEXTURE_IMAGE_UNITS);

			this.nStencilBits = pDevice.getParameter(pDevice.STENCIL_BITS);
			this.pColorBits = [
                pDevice.getParameter(pDevice.RED_BITS),
                pDevice.getParameter(pDevice.GREEN_BITS),
                pDevice.getParameter(pDevice.BLUE_BITS)
            ];

            this.nAlphaBits = pDevice.getParameter(pDevice.ALPHA_BITS);
            this.fMultisampleType = pDevice.getParameter(pDevice.SAMPLE_COVERAGE_VALUE);
		}


		getExtention(pDevice: WebGLRenderingContext, csExtension: string): any {
			var pExtentions: string[];
			var sExtention: string;
			var pExtention: any = null;

	        pExtentions = pDevice.getSupportedExtensions();

	        for (var i in pExtentions) {
	            sExtention = pExtentions[i];
	            if (sExtention.search(csExtension) != -1) {
	                pExtention = pDevice.getExtension(sExtention);

	                trace('extension successfuly loaded: ' + sExtention);
	            }
	        }

	        return pExtention;
		}

		checkFormat(pDevice: WebGLRenderingContext, eFormat: EImageFormats) {
	        switch (eFormat) {
	            case EImageFormats.RGB_DXT1:
	            case EImageFormats.RGBA_DXT1:
	            case EImageFormats.RGBA_DXT2:
	            case EImageFormats.RGBA_DXT3:
	            case EImageFormats.RGBA_DXT4:
	            case EImageFormats.RGBA_DXT5:
	                for (var i in pDevice) {
	                    if (isNumber(pDevice[i]) && pDevice[i] == eFormat) {
	                        return true;
	                    }
	                }
	                return false;
	            case EImageFormats.RGB8:
	            case EImageFormats.RGBA8:
	            case EImageFormats.RGBA4:
	            case EImageFormats.RGB5_A1:
	            case EImageFormats.RGB565:
	                return true;
	            default:
	                return false;
	        }
	    }
    }
}











module akra {
	export enum EUtilTimerCommands {
//! <to reset the timer
		TIMER_RESET,
//! <to start the timer
		TIMER_START,
//! <to stop (or pause) the timer
		TIMER_STOP,
//! <to advance the timer by 0.1 seconds
		TIMER_ADVANCE,
//! <to get the absolute system time
		TIMER_GET_ABSOLUTE_TIME,
//! <to get the current time
		TIMER_GET_APP_TIME,
		TIMER_GET_ELAPSED_TIME
//! to get the time that elapsed between TIMER_GETELAPSEDTIME calls
	}

    export interface IUtilTimer {
        absoluteTime: float;
        appTime: float;
        elapsedTime: float;

        start(): bool;
        stop(): bool;
        reset(): bool;
        execCommand(e: EUtilTimerCommands): float;

//static start(): IUtilTimer;
    }
}



module akra.util {

	export class UtilTimer implements IUtilTimer {
		private isTimerInitialized: bool = false;
		private isTimerStopped: bool = false;
		private fTicksPerSec: float = 0.;
		private iStopTime: int = 0;
		private iLastElapsedTime: int = 0;
		private iBaseTime: int = 0;

		get absoluteTime(): float {
			return this.execCommand(EUtilTimerCommands.TIMER_GET_ABSOLUTE_TIME);
		}

		get appTime(): float {
			return this.execCommand(EUtilTimerCommands.TIMER_GET_APP_TIME);
		}

		get elapsedTime(): float {
			return this.execCommand(EUtilTimerCommands.TIMER_GET_ELAPSED_TIME);
		}

		start(): bool {
			return this.execCommand(EUtilTimerCommands.TIMER_START) === 0;
		}
        stop(): bool {
        	return this.execCommand(EUtilTimerCommands.TIMER_STOP) === 0;
        }

        reset(): bool {
        	return this.execCommand(EUtilTimerCommands.TIMER_RESET) === 0;
        }

        execCommand(eCommand: EUtilTimerCommands): float {
		    var fTime: float = 0.;
		    var fElapsedTime: float = 0.;
		    var iTime: int;

		    if (this.isTimerInitialized == false) {
		        this.isTimerInitialized = true;
		        this.fTicksPerSec = 1000;
		    }

// Get either the current time or the stop time, depending
// on whether we're stopped and what command was sent
		    if (this.iStopTime != 0 && eCommand != EUtilTimerCommands.TIMER_START &&
		    	eCommand != EUtilTimerCommands.TIMER_GET_ABSOLUTE_TIME) {
		        iTime = this.iStopTime;
		    }
		    else {
		        iTime = (new Date()).getTime();
		    }

// Return the elapsed time
		    if (eCommand == EUtilTimerCommands.TIMER_GET_ELAPSED_TIME) {
		        fElapsedTime = (iTime - this.iLastElapsedTime) / this.fTicksPerSec;
		        this.iLastElapsedTime = iTime;
		        return fElapsedTime;
		    }

// Return the current time
		    if (eCommand == EUtilTimerCommands.TIMER_GET_APP_TIME) {
		        var fAppTime = ( iTime - this.iBaseTime ) / this.fTicksPerSec;
		        return fAppTime;
		    }

// Reset the timer
		    if (eCommand == EUtilTimerCommands.TIMER_RESET) {
		        this.iBaseTime = iTime;
		        this.iLastElapsedTime = iTime;
		        this.iStopTime = 0;
		        this.isTimerStopped = false;
		        return 0;
		    }

// Start the timer
		    if (eCommand == EUtilTimerCommands.TIMER_START) {
		        if (this.isTimerStopped) {
		            this.iBaseTime += iTime - this.iStopTime;
		        }
		        this.iStopTime = 0;
		        this.iLastElapsedTime = iTime;
		        this.isTimerStopped = false;
		        return 0;
		    }

// Stop the timer
		    if (eCommand == EUtilTimerCommands.TIMER_STOP) {
		        if (!this.isTimerStopped) {
		            this.iStopTime = iTime;
		            this.iLastElapsedTime = iTime;
		            this.isTimerStopped = true;
		        }
		        return 0;
		    }

// Advance the timer by 1/10th second
		    if (eCommand == EUtilTimerCommands.TIMER_ADVANCE) {
		        this.iStopTime += this.fTicksPerSec / 10;
		        return 0;
		    }

		    if (eCommand == EUtilTimerCommands.TIMER_GET_ABSOLUTE_TIME) {
		        fTime = iTime / this.fTicksPerSec;
		        return  fTime;
		    }

// Invalid command specified		    return -1;
        }

        static start(): UtilTimer {
        	var pTimer: UtilTimer = new UtilTimer;

        	if (pTimer.start()) {
        		return pTimer;
        	}

        	debug_error('cannot start util timer');

        	return null;
        }
	}
}











module akra {

	export interface IExplorerFunc {} ;
	export interface IReferenceCounter {} ;

	export interface IEntity extends IReferenceCounter {
		name: string;

		parent: IEntity;
		sibling: IEntity;
		child: IEntity;

		 depth: int;
		 root: IEntity;

		create(): bool;
		destroy(): void;

		findEntity(sName: string): IEntity;
		explore(fn: IExplorerFunc): void;
		childOf(pParent: IEntity): bool;
		siblingCount(): uint;
		childCount(): uint;

		update(): void;
		recursiveUpdate(): void;
		recursivePreUpdate(): void;
		prepareForUpdate(): void;

		hasParent(): bool;
		hasChild(): bool;
		hasSibling(): bool;

		isASibling(pSibling: IEntity): bool;
		isAChild(pChild: IEntity): bool;
		isInFamily(pEntity: IEntity, bSearchEntireTree?: bool): bool;


		addSibling(pSibling: IEntity): IEntity;
		addChild(pChild: IEntity): IEntity;
		removeChild(pChild: IEntity): IEntity;
		removeAllChildren(): void;

		attachToParent(pParent: IEntity): bool;
		detachFromParent(): bool;

		promoteChildren(): void;
		relocateChildren(pParent: IEntity): void;

		toString(isRecursive?: bool, iDepth?: int): string;
	}

}






module akra {

	export interface IEntity {} ;

	export interface IExplorerFunc {
		(pEntity: IEntity): bool;
	}
}



module akra.util {
	export class Entity extends ReferenceCounter implements IEntity {
		 _sName: string = null;
		 _pParent: IEntity = null;
		 _pSibling: IEntity = null;
		 _pChild: IEntity = null;

		/**@inline*/  get name(): string { return this._sName; }
		/**@inline*/  set name(sName: string) { this._sName = sName; }

		/**@inline*/  get parent(): IEntity { return this._pParent; }
		/**@inline*/  set parent(pParent: IEntity) { this.attachToParent(pParent); }

		/**@inline*/  get sibling(): IEntity { return this._pSibling; }
		/**@inline*/  set sibling(pSibling: IEntity) { this._pSibling = pSibling; }

		/**@inline*/  get child(): IEntity { return this._pChild; }
		/**@inline*/  set child(pChild: IEntity) { this._pChild = pChild; }

		get depth(): int {
			var iDepth: int = -1;
	        for (var pEntity: IEntity = this; pEntity; pEntity = pEntity.parent, ++ iDepth){};
	        return iDepth;
		}

		get root(): IEntity {
	        for (var pEntity: IEntity = this, iDepth: int = -1; pEntity.parent; pEntity = pEntity.parent, ++ iDepth){};
	        return pEntity;
		}


		create(): bool {
			return true;
		}

		destroy(): void {
// destroy anything attached to this node
//	destroySceneObject();
// promote any children up to our parent
		    this.promoteChildren();
// now remove ourselves from our parent
		    this.detachFromParent();
// we should now be removed from the tree, and have no dependants
		    debug_assert(this.referenceCount() == 0, "Attempting to delete a scene node which is still in use");
		    debug_assert(this._pSibling == null, "Failure Destroying Node");
		    debug_assert(this._pChild == null, "Failure Destroying Node");
		}

		findEntity(sName: string): IEntity {
			 var pEntity: IEntity = null;

		    if (this._sName === sName) {
		        return this;
		    }

		    if (this._pSibling) {
		        pEntity = this._pSibling.findEntity(sName);
		    }

		    if (pEntity == null && this._pChild) {
		        pEntity = this._pChild.findEntity(sName);
		    }

		    return pEntity;
		}

		explore(fn: IExplorerFunc): void {
			if (fn(this) === false) {
		        return;
		    }

		    if (this._pSibling) {
		        this._pSibling.explore(fn);
		    }

		    if (this._pChild) {
		        this._pChild.explore(fn);
		    }
		}


		childOf(pParent: IEntity): bool {
			for (var pEntity: IEntity = this; pEntity; pEntity = pEntity.parent) {
		        if (pEntity.parent === pParent) {
		            return true;
		        }
		    }

		    return false;
		}


/**
		 * Returns the current number of siblings of this object.
		 */

		siblingCount(): uint {
			var iCount: uint = 0;

		    if (this._pParent) {
		        var pNextSibling = this._pParent.child;
		        if (pNextSibling) {
		            while (pNextSibling) {
		                pNextSibling = pNextSibling.sibling;
		                ++ iCount;
		            }
		        }
		    }

		    return iCount;
		}


/**
		 * Returns the current number of children of this object
		 */

		childCount(): uint {
			var iCount: uint = 0;

		    var pNextChild: IEntity = this.child;

		    if (pNextChild) {
		        ++ iCount;
		        while (pNextChild) {
		            pNextChild = pNextChild.sibling;
		            ++ iCount;
		        }
		    }
		    return iCount;
		}


		update(): void {}


		recursiveUpdate(): void {
// update myself
		    this.update();
// update my sibling
		    if (this._pSibling) {
		        this._pSibling.recursiveUpdate();
		    }
// update my child
		    if (this._pChild) {
		        this._pChild.recursiveUpdate();
		    }
		}

		recursivePreUpdate(): void {
// clear the flags from the previous update
		    this.prepareForUpdate();

// update my sibling
		    if (this._pSibling) {
		        this._pSibling.recursivePreUpdate();
		    }
// update my child
		    if (this._pChild) {
		        this._pChild.recursivePreUpdate();
		    }
		}


		prepareForUpdate(): void {};

/** Parent is not undef */

		/**@inline*/  hasParent(): bool {
		    return isDefAndNotNull(this._pParent);
		}

/** Child is not undef*/

		/**@inline*/  hasChild(): bool {
		    return isDefAndNotNull(this._pChild);
		}

/** Sibling is not undef */

		/**@inline*/  hasSibling(): bool {
			return isDefAndNotNull(this._pSibling);
		}

/**
		 * Checks to see if the provided item is a sibling of this object
		 */

		isASibling(pSibling: IEntity): bool {
			if (!pSibling) {
		        return false;
		    }
// if the sibling we are looking for is me, or my FirstSibling, return true
		    if (this == pSibling || this._pSibling == pSibling) {
		        return true;
		    }
// if we have a sibling, continue searching
		    if (this._pSibling) {
		        return this._pSibling.isASibling(pSibling);
		    }
// it's not us, and we have no sibling to check. This is not a sibling of ours.
		    return false;
		}

/** Checks to see if the provided item is a child of this object. (one branch depth only) */

		isAChild(pChild: IEntity): bool {
			if (!pChild) {
		        return (false);
		    }
// if the sibling we are looking for is my FirstChild return true
		    if (this._pChild == pChild) {
		        return (true);
		    }
// if we have a child, continue searching
		    if (this._pChild) {
		        return (this._pChild.isASibling(pChild));
		    }
// it's not us, and we have no child to check. This is not a sibling of ours.
		    return (false);
		}

/**
		 * Checks to see if the provided item is a child or sibling of this object. If SearchEntireTree
		 * is TRUE, the check is done recursivly through all siblings and children. SearchEntireTree
		 * is FALSE by default.
		 */

		isInFamily(pEntity: IEntity, bSearchEntireTree?: bool): bool {
			if (!pEntity) {
		        return (false);
		    }
// if the model we are looking for is me or my immediate family, return true
		    if (this == pEntity || this._pChild == pEntity || this._pSibling == pEntity) {
		        return (true);
		    }
// if not set to seach entire tree, just check my siblings and kids
		    if (!bSearchEntireTree) {
		        if (this.isASibling(pEntity)) {
		            return (true);
		        }
		        if (this._pChild && this._pChild.isASibling(pEntity)) {
		            return (true);
		        }
		    }
// seach entire Tree!!!
		    else {
		        if (this._pSibling && this._pSibling.isInFamily(pEntity, bSearchEntireTree)) {
		            return (true);
		        }

		        if (this._pChild && this._pChild.isInFamily(pEntity, bSearchEntireTree)) {
		            return (true);
		        }
		    }

		    return (false);
		}

/**
		 * Adds the provided ModelSpace object to the descendant list of this object. The provided
		 * ModelSpace object is removed from any parent it may already belong to.
		 */

		addSibling(pSibling: IEntity): IEntity {
			if (pSibling) {
// replace objects current sibling pointer with this new one
		        pSibling.sibling = this._pSibling;
		        this.sibling = pSibling;
		    }

		    return pSibling;
		}

/**
		 * Adds the provided ModelSpace object to the descendant list of this object. The provided
		 * ModelSpace object is removed from any parent it may already belong to.
		 */

		addChild(pChild: IEntity): IEntity {
			if (pChild) {
// Replace the new child's sibling pointer with our old first child.
		        pChild.sibling = this._pChild;
// the new child becomes our first child pointer.
		        this._pChild = pChild;
    		}

    		return pChild;
		}

/**
		 * Removes a specified child object from this parent object. If the child is not the
		 * FirstChild of this object, all of the Children are searched to find the object to remove.
		 */

		removeChild(pChild: IEntity): IEntity {
			if (this._pChild && pChild) {
		        if (this._pChild == pChild) {
		            this._pChild = pChild.sibling;
		            pChild.sibling  = null;
		        }
		        else {
		            var pTempNode: IEntity = this._pChild;
// keep searching until we find the node who's sibling is our target
// or we reach the end of the sibling chain
		            while (pTempNode && (pTempNode.sibling != pChild)) {
		                pTempNode = pTempNode.sibling;
		            }
// if we found the proper item, set it's FirstSibling to be the FirstSibling of the child
// we are removing
		            if (pTempNode) {
		                pTempNode.sibling = pChild.sibling;
		                pChild.sibling = null;
		            }
		        }
	    	}

	    	return pChild;
		}

/** Removes all Children from this parent object */

		removeAllChildren(): void {
// keep removing children until end of chain is reached
		    while (!isNull(this._pChild)) {
		        var pNextSibling = this._pChild.sibling;
		        this._pChild.detachFromParent();
		        this._pChild = pNextSibling;
		    }
		}

/** Attaches this object ot a new parent. Same as calling the parent's addChild() routine. */

		attachToParent(pParent: IEntity): bool {
			if (pParent != this._pParent) {

		        this.detachFromParent();

		        if (pParent) {
		            this._pParent = pParent;
		            this._pParent.addChild(this);
		            this._pParent.addRef();
		            return true;
		        }
	    	}

	    	return false;
		}

		detachFromParent(): bool {
// tell our current parent to release us
		    if (this._pParent) {
		        this._pParent.removeChild(this);
//TODO: разобраться что за херня!!!!
		        if (this._pParent) {
		            this._pParent.release();
		        }

		        this._pParent = null;
// my world matrix is now my local matrix

		        return true;
		    }

		    return false;
		}

/**
		 * Attaches this object's children to it's parent, promoting them up the tree
		 */

		promoteChildren(): void {
// Do I have any children to promote?
		    while (!isNull(this._pChild)) {
		        var pNextSibling: IEntity = this._pChild.sibling;
		        this._pChild.attachToParent(this._pParent);
		        this._pChild = pNextSibling;
		    }
		}

		relocateChildren(pParent: IEntity): void {
			if (pParent != this) {
// Do I have any children to relocate?
		        while (!isNull(this._pChild)) {
		            var pNextSibling: IEntity = this._pChild.sibling;
		            this._pChild.attachToParent(pParent);
		            this._pChild = pNextSibling;
		        }
		    }
		}

		toString(isRecursive: bool = false, iDepth: int = 0): string {

		    if (!isRecursive) {
		        return '<entity' + (this._sName? ' ' + this._sName: "") + '>';
		    }

		    var pSibling: IEntity = this.sibling;
		    var pChild: IEntity = this.child;
		    var s: string = "";

		    for (var i = 0; i < iDepth; ++ i) {
		        s += ':  ';
		    }

		    s += '+----[depth: ' + this.depth + ']' + this.toString() + '\n';

		    if (pChild) {
		        s += pChild.toString(true, iDepth + 1);
		    }

		    if (pSibling) {
		        s += pSibling.toString(true, iDepth);
		    }

		    return s;


		}

	}
}





















//#define ERR_TM_REACHED_LIMIT 0



//seconds



module akra {

	export interface IThread {} ;

	export interface IThreadManager extends IManager {
		createThread(): bool;
		occupyThread(): IThread;
		releaseThread(iThread: int): bool;
		releaseThread(pThread: IThread): bool;
	}
}






module akra {
	export interface IThread {
		onmessage: Function;
		onerror: Function;
		id: int;

		send(pData: Object, pTransferables?: any[]): void;
		send(pData: ArrayBuffer, pTransferables?: any[]): void;
		send(pData: ArrayBufferView, pTransferables?: any[]): void;
	}
}




module akra.util {

	export enum EThreadStatuses {
		k_WorkerBusy,
		k_WorkerFree
	}

	export interface IThreadStats {
		status: EThreadStatuses;
		creationTime: uint;
		releaseTime: uint;
	}

	export class ThreadManager implements IThreadManager {
		private _sDefaultScript: string;
		private _pWorkerList: IThread[] = [];
		private _pStatsList: IThreadStats[] = [];

		constructor (sScript: string = null) {

			this._sDefaultScript = sScript;


			setInterval((): void => {
				var pStats: IThreadStats;
				var iNow: uint = now();

				for (var i: int = 0; i < this._pStatsList.length; ++ i) {
					pStats = this._pStatsList[i];

					if (pStats.releaseTime > 0 && iNow - pStats.releaseTime >  30  * 1000) {
						debug_warning("thread must be removed: " + i);
					}
				};
			}, 30000);
		}

		createThread(): bool {
//console.log((new Error).stack)
			if (this._pWorkerList.length ===  32 ) {
				error("Reached limit the number of threads");
				return false;
			}

			if (!info.api.webWorker) {
				error("WebWorkers unsupprted..");
				return false;
			}

			var pWorker: IThread = <IThread><any>(new Worker(this._sDefaultScript));

			pWorker.id = this._pWorkerList.length;
			pWorker.send = (<any>pWorker).postMessage;

			this._pWorkerList.push(<IThread>pWorker);
			this._pStatsList.push({
				status: EThreadStatuses.k_WorkerFree,
				creationTime: now(),
				releaseTime: now()
				});

			return true;
		}

		occupyThread(): IThread {
			var pStats: IThreadStats;
			for (var i: int = 0, n: int = this._pWorkerList.length; i < n; ++i) {
				pStats = this._pStatsList[i];
		        if (pStats.status == EThreadStatuses.k_WorkerFree) {
		            pStats.status = EThreadStatuses.k_WorkerBusy;
		            pStats.releaseTime = 0;

		            return this._pWorkerList[i];
		        }
		    }

		    if (this.createThread()) {
		    	return this.occupyThread();
		    }

		    else {
		    	error("cannot occupy thread");
		    	return null;
		    }
		}

		releaseThread(pThread: IThread): bool;
		releaseThread(iThread: int): bool;
		releaseThread(pThread: any): bool {
			var iThread: int;
			var pStats: IThreadStats;

			if (!isInt(pThread)) {
				iThread = pThread.id;
			}
			else {
				iThread = pThread;
			}

			if (isDef(this._pStatsList[iThread])) {
				pStats = this._pStatsList[iThread];

				pStats.status = EThreadStatuses.k_WorkerFree;
				pStats.releaseTime = now();
			}

			return false;
		}

		initialize(): bool { return true; }
        destroy(): void {}
	}
}



module akra.util {

	export var uri = (sUri:string): IURI => new util.URI(sUri);

// export var pathinfo: (sPath: string) => IPathinfo;
// export var pathinfo: (pPath: IPathinfo) => IPathinfo;
	export var pathinfo: (pPath?) => IPathinfo;

	pathinfo = function (pPath?): IPathinfo {
		return new Pathinfo(pPath);
	}
}










module akra {
	export interface ICanvasInfo {
		width: int;
		height: int;
		id: string;
	}
}











module akra.info {
	export function canvas(pCanvas: HTMLCanvasElement): ICanvasInfo;
	export function canvas(id: string): ICanvasInfo;
	export function canvas(id): ICanvasInfo {
		var pCanvas: HTMLCanvasElement = isString(id) ? document.getElementById(id) : id;

		return {
			width: isInt(pCanvas.width) ? pCanvas.width : parseInt(pCanvas.style.width),
			height: isInt(pCanvas.height) ? pCanvas.height : parseInt(pCanvas.style.height),
			id: pCanvas.id
		};
	}

	export var browser: IBrowserInfo = new util.BrowserInfo;
	export var api: IApiInfo = new util.ApiInfo;
	export var screen: IScreenInfo = new util.ScreenInfo;
	export var device: IDeviceInfo = new util.DeviceInfo;
	export var uri: IURI = util.uri(document.location.href);

	module is {
/**
         * show status - online or offline
         */

		export var online;
/**
         * perform test on mobile device
         */

		export var mobile: bool = (/mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i)
			.test(navigator.userAgent.toLowerCase());
		export var linux: bool = browser.os === 'Linux';
		export var windows: bool = browser.os === 'Windows';
		export var mac: bool = browser.os === 'Mac';
		export var iPhone: bool = browser.os === 'iPhone';
	}


//TODO: move it to [akra.info.is] module, when typescript access this.
	Object.defineProperty(is, 'online', {
		get: function () {
			return navigator.onLine;
		}
	});
}










module akra {

	export interface IFileMeta {
		lastModifiedDate: string;
		size: uint;
	}

	export interface IFile {
		 path: string;
		 name: string;
		mode: int;

		onread: Function;
		onopen: Function;

		position: uint;
		byteLength: uint;


		open(sFilename: string, iMode: int, fnCallback?: Function): void;
		open(sFilename: string, sMode: string, fnCallback?: Function): void;
		open(sFilename: string, fnCallback?: Function): void;
		open(iMode: int, fnCallback?: Function): void;
		open(fnCallback?: Function): void;

		close(): void;
		clear(fnCallback?: Function): void;
		read(fnCallback?: Function): void;
		write(sData: string, fnCallback?: Function, sContentType?: string): void;
		write(pData: ArrayBuffer, fnCallback?: Function, sContentType?: string): void;
		move(sFilename: string, fnCallback?: Function): void;
		copy(sFilename: string, fnCallback?: Function): void;
		rename(sFilename: string, fnCallback?: Function): void;
		remove(fnCallback?: Function): void;

//return current position
		atEnd(): int;
//return current position;
		seek(iOffset: int): int;

		isOpened(): bool;
		isExists(fnCallback?: Function): void;
		isLocal(): bool;

		getMetaData(fnCallback: Function): void;
	}
}
























module akra.io {
	var pLocalFileThreadManager = new  util.ThreadManager( "scripts/LocalFile.thread.js" ) ;
	var pRemoteFileThreadManager = new  util.ThreadManager( "scripts/RemoteFile.thread.js" ) ;

	export var getLocalFileThreadManager = (): IThreadManager => pLocalFileThreadManager;
	export var getRemoteFileThreadManager = (): IThreadManager => pRemoteFileThreadManager;
}






/**
 * FLAG(x)
 * Сдвиг единицы на @a x позиций влево.
 */



/**
 * TEST_BIT(value, bit)
 * Проверка того что у @a value бит под номером @a bit равен единице.
 */



/**
 * TEST_ALL(value, set)
 * Проверка того что у @a value равны единице все биты,
 * которые равны единице у @a set.
 */



/**
 * TEST_ANY(value, set)
 * Проверка того что у @a value равны единице хотя бы какие то из битов,
 * которые равны единице у @a set.
 */



/**
 * SET_BIT(value, bit)
 * Выставляет бит под номером @a bit у числа @a value равным единице
 */






/**
 * CLEAR_BIT(value, bit)
 * Выставляет бит под номером @a bit у числа @a value равным нулю
 */



/**
 * SET_ALL(value, set)
 * Выставляет все биты у числа @a value равными единице,
 * которые равны единице у числа @a set
 */



/**
 * CLEAR_ALL(value, set)
 * Выставляет все биты у числа @a value равными нулю,
 * которые равны единице у числа @a set
 */



//#define SET_ALL(value, set, setting) (setting ? SET_ALL(value, set) : CLEAR_ALL(value, set))



module akra.bf {
/**
	 * Сдвиг единицы на @a x позиций влево.
	 * @inline
	 */

	export var flag = (x: int) => (1 << (x));
/**
	 * Проверка того что у @a value бит под номером @a bit равен единице.
	 * @inline
	 */

	export var testBit = (value: int, bit: int) => ((value & flag(bit)) != 0);
/**
	 * Проверка того что у @a value равны единице все биты,
 	 * которые равны единице у @a set.
	 * @inline
	 */

	export var testAll = (value: int, set: int) => (((value) & (set)) == (set));
/**
	 * Проверка того что у @a value равны единице хотя бы какие то из битов,
 	 * которые равны единице у @a set.
	 * @inline
	 */

	export var testAny = (value: int, set: int) => (((value) & (set)) != 0);
/**
	 * Выставляет бит под номером @a bit у числа @a value равным единице
	 * @inline
	 */

	export var setBit = (value: int, bit: int, setting: bool = true) => (setting ? ((value) |= flag((bit))) : clearBit(value, bit));
/**
	 * 
	 * @inline
	 */

	export var clearBit = (value: int, bit: int) => ((value) &= ~flag((bit)));
/**
	 * Выставляет бит под номером @a bit у числа @a value равным нулю
	 * @inline
	 */

	export var setAll = (value: int, set: int, setting: bool = true) => (setting ? setAll(value, set) : clearAll(value, set));
/**
	 * Выставляет все биты у числа @a value равными единице,
 	 * которые равны единице у числа @a set
	 * @inline
	 */

	export var clearAll = (value: int, set: int) => ((value) &= ~(set));
/**
	 * Выставляет все биты у числа @a value равными нулю,
 	 * которые равны единице у числа @a set
	 * @inline
	 */

	export var equal = (value: int, src: int) => { value = src; };
/**
	 * Прирасваивает числу @a value число @a src
	 * @inline
	 */

	export var isEqual = (value: int, src: int) => value == src;
/**
	 * Если число @a value равно числу @a src возвращается true
	 * @inline
	 */

	export var isNotEqaul = (value: int, src: int) => value != src;
/**
	 * Прирасваивает числу @a value число @a src
	 * @inline
	 */

	export var set = (value: int, src: int) => { value = src; };
/**
	 * Обнуляет число @a value
	 * @inline
	 */

	export var clear = (value: int) => { value = 0; };
/**
	 * Выставляет все биты у числа @a value равными единице,
 	 * которые равны единице у числа @a src
	 * @inline
	 */

	export var setFlags = (value: int, src: int) => (value |= src);
/**
	 * Выставляет все биты у числа @a value равными нулю,
 	 * которые равны единице у числа @a src
	 * @inline
	 */

	export var clearFlags = (value: int, src: int) => value &= ~src;
/**
	 * Проверяет равно ли число @a value нулю. Если равно возвращает true.
 	 * Если не равно возвращает false.
	 * @inline
	 */

	export var isEmpty = (value: int) => (value == 0);
/**
	 * Возвращает общее количество бит числа @a value.
 	 * На самом деле возвращает всегда 32.
	 * @inline
	 */

	export var totalBits = (value: int) => 32;
/**
	 * Возвращает общее количество ненулевых бит числа @a value.
	 * @inline
	 */

	export var totalSet = (value: int): int => {
		var count: int = 0;
        var total: int = totalBits(value);

        for (var i: int = total; i; --i) {
            count += (value & 1);
            value >>= 1;
        }

        return(count);
	}
}



module akra.io {

	export enum EFileActions {
		k_Open = 1,
		k_Read,
		k_Write,
		k_Clear,
		k_Exists,
		k_Remove
	};

	export enum EFileTransferModes {
		k_Normal,
		k_Slow,
		k_Fast
	}

	export class FileThread implements IFile {
		private _iMode: int;
		private _pUri: IURI;
		private _nCursorPosition: uint = 0;
		private _bOpened: bool = false;
		private _eTransferMode: EFileTransferModes = EFileTransferModes.k_Normal;
		private _pFileMeta: IFileMeta = null;


		/**@inline*/  get path(): string {
			assert(this._pFileMeta, "There is no file handle open.");
        	return this._pUri.toString();
		}

		/**@inline*/  get name(): string {
			return util.pathinfo(this._pUri.path).basename;
		}

		/**@inline*/  get mode(): int {
			return this._iMode;
		}

//set mode(sMode: string);
//set mode(iMode: int);
		set mode(sMode: any) {
			this._iMode = isString(sMode)? filemode(sMode): sMode;
		}

		/**@inline*/  set onread(fnCallback: Function) {
			this.read(fnCallback);
		}

		/**@inline*/  set onopen(fnCallback: Function) {
			this.open(fnCallback);
		}

		/**@inline*/  get position(): uint {
			assert(this._pFileMeta, 'There is no file handle open.');
        	return this._nCursorPosition;
		}

		set position(iOffset: uint) {
			assert(this._pFileMeta, 'There is no file handle open.');
			this._nCursorPosition = iOffset;
		}

		/**@inline*/  get byteLength(): uint {
       	 return this._pFileMeta? this._pFileMeta.size: 0;
		}

		constructor (sFilename?: string, sMode?: string, fnCallback?: Function);
		constructor (sFilename?: string, iMode?: int, fnCallback?: Function);
		constructor (sFilename?: string, sMode?: any, fnCallback?: Function) {
			if (isDef(sMode)) {
				this._iMode = isString(sMode)? filemode(sMode): sMode;
			}

			this._pUri = util.uri(sFilename) || null;

			if (info.api.transferableObjects) {
				this._eTransferMode = EFileTransferModes.k_Fast;
			}
			else if (info.browser.name == "Opera") {
				this._eTransferMode = EFileTransferModes.k_Slow;
			}

			if (arguments.length > 2) {
				this.open(sFilename, sMode, fnCallback);
			}
		}

		open(sFilename: string, iMode: int, fnCallback?: Function): void;
		open(sFilename: string, sMode: string, fnCallback?: Function): void;
		open(sFilename: string, fnCallback?: Function): void;
		open(iMode: int, fnCallback?: Function): void;
		open(fnCallback?: Function): void;
		open(sFilename?: any, iMode?: any, fnCallback?: any): void {
			var pFile: IFile = this;
			var hasMode: bool = !isFunction(iMode);

			 if (arguments.length < 3) {
		        if (isString(arguments[0])) {
		            this._pUri = util.uri(sFilename);
		            fnCallback = arguments[1];
		        }
		        else if (isInt(arguments[0])) {
		            this._iMode = arguments[0];
		            fnCallback = arguments[1];
		        }
		        else {
		            fnCallback = arguments[0];
		        }

		        assert(this._pUri, "No filename provided.");


		        this.open(this._pUri.toString(), this._iMode, fnCallback);

		        return;
		    }

		    fnCallback = arguments[hasMode ? 2 : 1];


		    if (this.isOpened()) {
		        warning("file already opened: " + this.name);
		        (<Function>fnCallback)(null, this._pFileMeta);
		    }

		    this._pUri = util.uri(arguments[0]);

		    if (hasMode) {
		    	this._iMode = (isString(arguments[1]) ? filemode(<string>arguments[1]) : arguments[1]);
		    }

		    this.update(function (err) {
		    	if (err) {
		    		debug_warning("file update err", err);
		    		if (isDef(fnCallback)) {
		    			fnCallback.call(pFile, err);
		    		}

		    		return;
		    	}

		        if ( ((this._iMode & (1 << (3)) ) != 0) ) {
		            this.position = this.size;
		        }

		        if (isDef(fnCallback)) {
		        	fnCallback.call(pFile, null, pFile);
		        }
		    });
		}

		close(): void {
			this._pUri = null;
			this._iMode = EIO.IN | EIO.OUT;
			this._nCursorPosition = 0;
			this._pFileMeta = null;
		}

		clear(fnCallback?: Function): void {
			if (!this.touch(this.clear, arguments)) return;

			this.getThread(fnCallback).send({
                                              act:  EFileActions.k_Clear,
                                              name: this.path,
                                              mode: this._iMode
                                          });
		}


		read(fnCallback?: Function): void {
			if (!this.touch(this.read, arguments)) return;

		    var pFile: IFile = this;
		    var eTransferMode: EFileTransferModes = this._eTransferMode;
			var pThread: IThread = this.getThread(function (err, pData) {
				if (err) {
					if (isDef(fnCallback)) {
						fnCallback.call(pFile, err);
					}

					return;
				}

		        if (eTransferMode == EFileTransferModes.k_Slow &&  ((this._iMode & (1 << (5)) ) != 0) ) {
		            pData = new Uint8Array(pData).buffer;
		        }

		        pFile.atEnd();

		        if (isDef(fnCallback)) {
		        	fnCallback.call(pFile, null, pData);
		        }
		    });

		    assert( ((this._iMode & (1 << (0)) ) != 0) , "The file is not readable.");


		    pThread.send({
		                     act:      EFileActions.k_Read,
		                     name:     this.path,
		                     mode:     this._iMode,
		                     pos:      this._nCursorPosition,
		                     transfer: this._eTransferMode
		                 });
		}

		write(sData: string, fnCallback?: Function, sContentType?: string): void;
		write(pData: ArrayBuffer, fnCallback?: Function, sContentType?: string): void;
		write(pData: any, fnCallback?: Function, sContentType?: string): void {
			if (!this.touch(this.write, arguments)) return;

		    var pFile: IFile = this;
		    var iMode: int = this._iMode;
			var pThread: IThread = this.getThread(function (err, pMeta) {
				if (err) {
					if (isDef(fnCallback)) {
						fnCallback.call(pFile, err);
					}

					return;
				}

		    	pFile.position += isString(pData)? pData.length: pData.byteLength;
		    	(<any>pFile)._pFileMeta = <IFileMeta>pMeta;

		    	if (isDef(fnCallback)) {
		    		fnCallback.call(pFile, null, pMeta);
		    	}
		    });

		    assert( ((iMode & (1 << (1)) ) != 0) , "The file is not writable.");


		    sContentType = sContentType || ( ((iMode & (1 << (5)) ) != 0) ? "application/octet-stream" : "text/plain");

		    pThread.send({
                     act:         EFileActions.k_Write,
                     name:        this.path,
                     mode:        this._iMode,
                     data:        pData,
                     contentType: sContentType,
                     pos:         this._nCursorPosition
                 });
		}

		move(sFilename: string, fnCallback?: Function): void {
			var pFile: IFile = this;

			this.copy(sFilename, function(err) {
				if (err) {
					if (isDef(fnCallback)) {
						fnCallback(err);
					}

					return;
				}

				pFile.remove(fnCallback);
			});
		}

		copy(sFilename: string, fnCallback?: Function): void {
			var iMode: int = EIO.IN | EIO.OUT | EIO.TRUNC;

		    if ( ((this._iMode & (1 << (5)) ) != 0) ) {
		        iMode |= EIO.BIN;
		    }

		    var pFile: IFile = this;
		    var pFileCopy: IFile = new FileThread(sFilename, iMode,
		                                     function (err) {
		                                     	if (err) {
		                                     		debug_warning("file copy error occured.", err);
		                                     		if (isDef(fnCallback)) {
		                                     			fnCallback(err);
		                                     		}
		                                     	}

		                                        pFile.read(function (pData: ArrayBuffer) {
		                                            pFile.write(pData, fnCallback);
		                                        });

		                                     });
		}

		rename(sFilename: string, fnCallback?: Function): void {
			var pName: IPathinfo = util.pathinfo(sFilename);

		    assert(!pName.dirname, 'only filename can be specified.');

		    this.move(util.pathinfo(this._pUri.path).dirname + "/" + pName.basename, fnCallback);
		}

		remove(fnCallback?: Function): void {
			if (!this.touch(this.remove, arguments)) return;

		    var pFile: IFile = this;
		    var pThread: IThread = this.getThread(function (err, pData) {
		        pFile.close();
		        if (isDef(fnCallback)) {
		            fnCallback.call(pFile, err, pData);
		        }
		    });

		    pThread.send({
		                     act:  EFileActions.k_Remove,
		                     name: this.path,
		                     mode: this._iMode
		                 });
		}

//return current position
		atEnd(): int {
			this.position = this.byteLength;
			return this._nCursorPosition;
		}
//return current position;
		seek(iOffset: int): int {
			assert(this._pFileMeta, "There is no file handle open.");

		    var nSeek: int = this._nCursorPosition + iOffset;
		    if (nSeek < 0) {
		        nSeek = this.byteLength - (math.abs(nSeek) % this.byteLength);
		    }

		    assert(nSeek >= 0 && nSeek <= this.byteLength, "Invalid offset parameter");

		    this._nCursorPosition = nSeek;

		    return this._nCursorPosition;
		}

		isOpened(): bool {
			return this._pFileMeta !== null;
		}

		isExists(fnCallback?: Function): void {
			this.getThread(fnCallback).send({
                                              act:  EFileActions.k_Exists,
                                              name: this.path,
                                              mode: this._iMode
                                          });
		}

		/**@inline*/  isLocal(): bool {
			return (this._pUri.protocol == "filesystem");
		}

		getMetaData(fnCallback: Function): void {
			return;
		}

		private touch(fnWrapper: Function, pArgv: IArguments) {
			var pFile: IFile = this;
			if (!this.isOpened()) {
				this.open(function(err) {
					if (err) {
						if (pArgv.length) {
							(<Function>pArgv[0]).call(pFile, err);
						}
					}

					fnWrapper.apply(pFile, pArgv);
				});

				return false;
			}

			return true;
		}

		private update(fnCallback: Function) {
			var pFile: IFile = this;
			var pThread: IThread = this.getThread(function (err, pMeta) {
				(<any>pFile)._pFileMeta = <IFileMeta>pMeta;
				fnCallback.call(pFile, err, pFile);
			});

			pThread.send({
                     act:  EFileActions.k_Open,
                     name: this._pUri.toString(),
                     mode: this._iMode
                 });
		}

		private getThread(fnCallback?: Function): IThread {
			return FileThread.getThread(this.isLocal(), fnCallback);
		}

		private static getThread(isLocal: bool = true, fnCallback?: Function): IThread {

			var pFile: IFile = this;
			var pManager: IThreadManager = isLocal? getLocalFileThreadManager(): getRemoteFileThreadManager();
			var pThread: IThread = pManager.occupyThread();

			pThread.onmessage = function (e) {
				pManager.releaseThread(pThread);
				pThread.onmessage = null;

				if (isDef(fnCallback)) {
					fnCallback.call(pFile, null, e.data);
				}
			}

			pThread.onerror = function (e) {
				pManager.releaseThread(pThread);
				pThread.onmessage = null;
				if (isDef(fnCallback)) {
					fnCallback.call(pFile, e);
				}
			}

			return pThread;
		}



	}
}



module akra.io {

	export enum EIO {
		IN = 0x01,
		OUT = 0x02,
		ATE = 0x04,
		APP = 0x08,
		TRUNC = 0x10,
		BINARY = 0x20,
		BIN = 0x20,
		TEXT = 0x40
	};

	export function filemode(sMode: string): int {
		switch (sMode.toLowerCase()) {
	        case "a+t":
	            return EIO.IN | EIO.OUT | EIO.APP | EIO.TEXT;
	        case "w+t":
	            return EIO.IN | EIO.OUT | EIO.TRUNC | EIO.TEXT;
	        case "r+t":
	            return EIO.IN | EIO.OUT | EIO.TEXT;

	        case "at":
	            return EIO.APP | EIO.TEXT;
	        case "wt":
	            return EIO.OUT | EIO.TEXT;
	        case "rt":
	            return EIO.IN | EIO.TEXT;

	        case "a+b":
	            return EIO.IN | EIO.OUT | EIO.APP | EIO.BIN;
	        case "w+b":
	            return EIO.IN | EIO.OUT | EIO.TRUNC | EIO.BIN;
	        case "r+b":
	            return EIO.IN | EIO.OUT | EIO.BIN;

	        case "ab":
	            return EIO.APP | EIO.BIN;
	        case "wb":
	            return EIO.OUT | EIO.BIN;
	        case "rb":
	            return EIO.IN | EIO.BIN;

	        case "a+":
	            return EIO.IN | EIO.OUT | EIO.APP;
	        case "w+":
	            return EIO.IN | EIO.OUT | EIO.TRUNC;
	        case "r+":
	            return EIO.IN | EIO.OUT;

	        case "a":
	            return EIO.APP | EIO.OUT;
	        case "w":
	            return <number>EIO.OUT;
	        case "r":
	        default:
	            return <number>EIO.IN;
	    }
	}


// function _fopen (sUri: string, iMode?: int): IFile;
// function _fopen (sUri: string, sMode?: int): IFile;
// function _fopen (pUri: IURI, iMode: int): IFile;
// function _fopen (pUri: IURI, sMode: string): IFile;

	function _fopen(sUri: any, pMode: any = EIO.IN): IFile {
		var iMode: int = isString(pMode)? filemode(pMode): pMode;

		if (info.api.webWorker) {
			return new FileThread(<string>sUri, iMode);
		}
		else {
			warning("FILES support disabled.");
			return null;
		}
	}

	export var fopen = _fopen;
}



module akra.utils.test {

	var test_1 = () => {
		shouldBeTrue("Threads support");
		shouldBeTrue("File creation");
		shouldBeTrue("Data should be \"test_data.\"");

		check(info.api.webWorker);

		var pFile: IFile = io.fopen("../../tests/common/file/test.txt");

		check(pFile != null);

		pFile.read(function(err, sData: string) {
			if (err) check(null);
			else check(sData === "test_data.");
		});
	}

	new Test({
		name: "Remote file API Test",
		main: test_1,
		description: "Test all file apis"
		});
}
