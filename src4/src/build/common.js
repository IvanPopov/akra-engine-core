/// <reference path="conv/conv.ts" />
/// <reference path="crypto/sha-1.ts" />
/// <reference path="crypto/md5.ts" />
/// <reference path="crypto/crc32.ts" />

var akra;
(function (akra) {
    akra.typeOf = function (x) {
        var s = typeof x;

        if (s === "object") {
            if (x) {
                if (x instanceof Array) {
                    return "array";
                } else if (x instanceof Object) {
                    return s;
                }

                var sClassName = Object.prototype.toString.call(x);

                if (sClassName === "[object Window]") {
                    return "object";
                }

                if ((sClassName === "[object Array]" || (typeof x.length) === "number" && (typeof x.splice) !== "undefined" && (typeof x.propertyIsEnumerable) !== "undefined" && !x.propertyIsEnumerable("splice"))) {
                    return "array";
                }

                if ((sClassName === "[object Function]" || (typeof x.call) !== "undefined" && (typeof x.propertyIsEnumerable) !== "undefined" && !x.propertyIsEnumerable("call"))) {
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

    akra.isDef = function (x) {
        return x !== undefined;
    };
    akra.isDefAndNotNull = function (x) {
        return x != null;
    };
    akra.isEmpty = function (x) {
        return x.length === 0;
    };
    akra.isNull = function (x) {
        return x === null;
    };
    akra.isBoolean = function (x) {
        return typeof x === "boolean";
    };
    akra.isString = function (x) {
        return typeof x === "string";
    };
    akra.isNumber = function (x) {
        return typeof x === "number";
    };
    akra.isFloat = akra.isNumber;
    akra.isInt = function (x) {
        return akra.isNumber(x) && (~~x === x);
    };
    akra.isUint = function (x) {
        return akra.isInt(x) && x > 0;
    };
    akra.isFunction = function (x) {
        return akra.typeOf(x) === "function";
    };
    akra.isObject = function (x) {
        var type = akra.typeOf(x);
        return type === "object" || type === "array" || type === "function";
    };
    akra.isArrayBuffer = function (x) {
        return x instanceof ArrayBuffer;
    };
    akra.isTypedArray = function (x) {
        return x !== null && typeof x === "object" && typeof x.byteOffset === "number";
    };
    akra.isBlob = function (x) {
        return x instanceof Blob;
    };
    akra.isArray = function (x) {
        return akra.typeOf(x) === "array";
    };

    String.prototype.replaceAt = function (n, chr) {
        return this.substr(0, n) + chr + this.substr(n + chr.length);
    };

    Object.defineProperty(Array.prototype, 'first', {
        enumerable: false,
        configurable: true,
        get: function () {
            return this[0];
        }
    });

    Object.defineProperty(Array.prototype, 'last', {
        enumerable: false,
        configurable: true,
        get: function () {
            return this[this.length - 1];
        }
    });

    Object.defineProperty(Array.prototype, 'el', {
        enumerable: false,
        configurable: true,
        value: function (i) {
            i = i || 0;
            return this[i < 0 ? this.length + i : i];
        }
    });

    Object.defineProperty(Array.prototype, 'clear', {
        enumerable: false,
        configurable: true,
        value: function () {
            this.length = 0;
        }
    });

    Object.defineProperty(Array.prototype, 'swap', {
        enumerable: false,
        configurable: true,
        value: function (i, j) {
            if (i < this.length && j < this.length) {
                var t = this[i];
                this[i] = this[j];
                this[j] = t;
            }
        }
    });

    Object.defineProperty(Array.prototype, 'insert', {
        enumerable: false,
        configurable: true,
        value: function (pElement) {
            if (typeof pElement.length === 'number') {
                for (var i = 0, n = pElement.length; i < n; ++i) {
                    this.push(pElement[i]);
                }
                ;
            } else {
                this.push(pElement);
            }

            return this;
        }
    });

    Number.prototype.toHex = function (iLength) {
        var sValue = this.toString(16);

        for (var i = 0; i < iLength - sValue.length; ++i) {
            sValue = '0' + sValue;
        }

        return sValue;
    };

    Number.prototype.printBinary = function (isPretty) {
        if (typeof isPretty === "undefined") { isPretty = true; }
        var res = "";
        for (var i = 0; i < 32; ++i) {
            if (i && (i % 4) == 0 && isPretty) {
                res = ' ' + res;
            }
            (this >> i & 0x1 ? res = '1' + res : res = '0' + res);
        }
        return res;
    };
})(akra || (akra = {}));
//# sourceMappingURL=common.js.map
