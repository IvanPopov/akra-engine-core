define(["require", "exports"], function(require, exports) {
    var typeOf = function (x) {
        var s = typeof x;

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

                if ((sClassName == '[object Array]' || typeof x.length == 'number' && typeof x.splice != 'undefined' && typeof x.propertyIsEnumerable != 'undefined' && !x.propertyIsEnumerable('splice'))) {
                    return 'array';
                }

                if ((sClassName == '[object Function]' || typeof x.call != 'undefined' && typeof x.propertyIsEnumerable != 'undefined' && !x.propertyIsEnumerable('call'))) {
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

    function isDefAndNotNull(x) {
        return x != null;
    }
    exports.isDefAndNotNull = isDefAndNotNull;
    ;
    function isDef(x) {
        return x !== undefined;
    }
    exports.isDef = isDef;
    ;
    exports.isEmpty = function (x) {
        return x.length == 0;
    };
    exports.isNull = function (x) {
        return x === null;
    };
    exports.isBoolean = function (x) {
        return typeof x === "boolean";
    };
    exports.isString = function (x) {
        return typeof x === "string";
    };
    exports.isNumber = function (x) {
        return typeof x === "number";
    };
    exports.isFloat = exports.isNumber;
    exports.isInt = exports.isNumber;
    exports.isFunction = function (x) {
        return typeOf(x) === "function";
    };
    exports.isObject = function (x) {
        var type = typeOf(x);
        return type == "object" || type == "array" || type == "function";
    };
    exports.isArrayBuffer = function (x) {
        return x instanceof ArrayBuffer;
    };
    exports.isTypedArray = function (x) {
        return x !== null && typeof x === "object" && typeof x.byteOffset === "number";
    };
    exports.isBlob = function (x) {
        return x instanceof Blob;
    };
    exports.isArray = function (x) {
        return typeOf(x) == "array";
    };
    exports.of = typeOf;
});
//# sourceMappingURL=type.js.map
