/// <reference path="conv/conv.ts" />
/// <reference path="crypto/sha-1.ts" />
/// <reference path="crypto/md5.ts" />
/// <reference path="crypto/crc32.ts" />

interface String {
	replaceAt(n: int, s: string);
}

interface Array {
	last: any;
	first: any;
	el(i: int): any;
	clear(): any[];
	swap(i: int, j: int): any[];
	insert(elements: any[]): any[];
	find(pElement: any): boolean;
}

interface Number {
	toHex(length: int): string;
	printBinary(isPretty?: boolean): string;
}

module akra {
	export var typeOf: (x: any) => string = function (x: any): string {
		var s: string = typeof x;

		if (s === "object") {
			if (x) {
				if (x instanceof Array) {
					return "array";
				} else if (x instanceof Object) {
					return s;
				}

				var sClassName: string = Object.prototype.toString.call(x);

				if (sClassName === "[object Window]") {
					return "object";
				}

				if ((sClassName === "[object Array]" ||
					(typeof x.length) === "number" &&
					(typeof x.splice) !== "undefined" &&
					(typeof x.propertyIsEnumerable) !== "undefined" &&
					!x.propertyIsEnumerable("splice")

					)) {
					return "array";
				}

				if ((sClassName === "[object Function]" ||
					(typeof x.call) !== "undefined" &&
					(typeof x.propertyIsEnumerable) !== "undefined" &&
					!x.propertyIsEnumerable("call"))) {
					return "function";
				}
			} else {
				return "null";
			}
		} else if (s === "function" && (typeof x.call) === "undefined") {
			return "object";
		}

		return s;
	};

	export var isDef = (x: any): boolean => x !== undefined;
	export var isDefAndNotNull = (x: any): boolean => x != null;
	export var isEmpty = (x: any): boolean => x.length === 0;
	export var isNull = (x: any): boolean => x === null;
	export var isBoolean = (x: any): boolean => typeof x === "boolean";
	export var isString = (x: any): boolean => typeof x === "string";
	export var isNumber = (x: any): boolean => typeof x === "number";
	export var isFloat = isNumber;
	//export var isInt = isNumber;
	//export var isUint = isNumber;
	export var isInt = (x: any): boolean => isNumber(x) && (~~x === x);
	export var isUint = (x: any): boolean => isInt(x) && x > 0;
	export var isFunction = (x: any): boolean => typeOf(x) === "function";
	export var isObject = (x: any): boolean => {
		var type = typeOf(x);
		return type === "object" || type === "array" || type === "function";
	};
	export var isArrayBuffer = (x: any): boolean => x instanceof ArrayBuffer;
	export var isTypedArray = (x: any): boolean => x !== null && typeof x === "object" && typeof x.byteOffset === "number";
	export var isBlob = (x: any): boolean => x instanceof Blob;
	export var isArray = (x: any): boolean => typeOf(x) === "array";

	String.prototype.replaceAt = function (n, chr) {
		return this.substr(0, n) + chr + this.substr(n + chr.length);
	}


	Object.defineProperty(Array.prototype, 'first', {
		enumerable: false,
		configurable: true,
		get: /** @this {Array} */ function () {
			return this[0];
		}
	});

	Object.defineProperty(Array.prototype, 'last', {
		enumerable: false,
		configurable: true,
		get: /** @this {Array} */ function () {
			return this[this.length - 1];
		}
	});

	Object.defineProperty(Array.prototype, 'el', {
		enumerable: false,
		configurable: true,
		value: /** @this {Array} */ function (i) { i = i || 0; return this[i < 0 ? this.length + i : i]; }
	});

	Object.defineProperty(Array.prototype, 'clear', {
		enumerable: false,
		configurable: true,
		value: /** @this {Array} */ function () { this.length = 0; }
	});

	Object.defineProperty(Array.prototype, 'swap', {
		enumerable: false,
		configurable: true,
		value: /** @this {Array} */ function (i, j) {
			if (i < this.length && j < this.length) {
				var t = this[i]; this[i] = this[j]; this[j] = t;
			}
		}
	});

	Object.defineProperty(Array.prototype, 'insert', {
		enumerable: false,
		configurable: true,
		value: /** @this {Array} */ function (pElement) {
			if (typeof pElement.length === 'number') {
				for (var i = 0, n = pElement.length; i < n; ++i) {
					this.push(pElement[i]);
				};
			}
			else {
				this.push(pElement);
			}

			return this;
		}
	});

	Number.prototype.toHex = function (iLength: int): string {
		var sValue = this.toString(16);

		for (var i = 0; i < iLength - sValue.length; ++i) {
			sValue = '0' + sValue;
		}

		return sValue;
	};

	Number.prototype.printBinary = function (isPretty: boolean = true): string {
		var res: string = "";
		for (var i = 0; i < 32; ++i) {
			if (i && (i % 4) == 0 && isPretty) {
				res = ' ' + res;
			}
			(this >> i & 0x1 ? res = '1' + res : res = '0' + res);
		}
		return res;
	}
}
