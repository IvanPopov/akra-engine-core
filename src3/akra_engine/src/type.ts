var typeOf: (x: any) => string = function (x: any): string {
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

export var isDef = (x: any): boolean => x !== undefined;
export var isDefAndNotNull = (x: any): boolean => x != null;
export var isEmpty = (x: any): boolean => x.length == 0;
export var isNull = (x: any): boolean => x === null;
export var isBoolean = (x: any): boolean => typeof x === "boolean";
export var isString = (x: any): boolean => typeof x === "string";
export var isNumber = (x: any): boolean => typeof x === "number";
export var isFloat = isNumber;
export var isInt = isNumber;
export var isFunction = (x: any): boolean => typeOf(x) === "function";
export var isObject = (x: any): boolean => {
    var type = typeOf(x);
    return type == "object" || type == "array" || type == "function";
};
export var isArrayBuffer = (x: any): boolean => x instanceof ArrayBuffer;
export var isTypedArray = (x: any): boolean => x !== null && typeof x === "object" && typeof x.byteOffset === "number";
export var isBlob = (x: any): boolean => x instanceof Blob;
export var isArray = (x: any): boolean => typeOf(x) == "array";
export var of = typeOf;