/// <reference path="../../idl/IPackerFormat.ts" />
/// <reference path="../../logger.ts" />
/// <reference path="../PackerTemplate.ts" />
var akra;
(function (akra) {
    (function (io) {
        (function (templates) {
            templates.common = new akra.io.PackerTemplate;

            templates.common.set({
                "Float32Array": {
                    write: function (pData) {
                        this.float32Array(pData);
                    },
                    read: function () {
                        return this.float32Array();
                    }
                },
                "Float64Array": {
                    write: function (pData) {
                        this.float64Array(pData);
                    },
                    read: function () {
                        return this.float64Array();
                    }
                },
                "Int32Array": {
                    write: function (pData) {
                        this.int32Array(pData);
                    },
                    read: function () {
                        return this.int32Array();
                    }
                },
                "Int16Array": {
                    write: function (pData) {
                        this.int16Array(pData);
                    },
                    read: function () {
                        return this.int16Array();
                    }
                },
                "Int8Array": {
                    write: function (pData) {
                        this.int8Array(pData);
                    },
                    read: function () {
                        return this.int8Array();
                    }
                },
                "Uint32Array": {
                    write: function (pData) {
                        this.uint32Array(pData);
                    },
                    read: function () {
                        return this.uint32Array();
                    }
                },
                "Uint16Array": {
                    write: function (pData) {
                        this.uint16Array(pData);
                    },
                    read: function () {
                        return this.uint16Array();
                    }
                },
                "Uint8Array": {
                    write: function (pData) {
                        this.uint8Array(pData);
                    },
                    read: function () {
                        return this.uint8Array();
                    }
                },
                "String": {
                    write: function (str) {
                        this.string(str);
                    },
                    read: function () {
                        return this.string();
                    }
                },
                //float
                "Float64": {
                    write: function (val) {
                        this.float64(val);
                    },
                    read: function () {
                        return this.float64();
                    }
                },
                "Float32": {
                    write: function (val) {
                        this.float32(val);
                    },
                    read: function () {
                        return this.float32();
                    }
                },
                //int
                "Int32": {
                    write: function (val) {
                        this.int32(val);
                    },
                    read: function () {
                        return this.int32();
                    }
                },
                "Int16": {
                    write: function (val) {
                        this.int16(val);
                    },
                    read: function () {
                        return this.int16();
                    }
                },
                "Int8": {
                    write: function (val) {
                        this.int8(val);
                    },
                    read: function () {
                        return this.int8();
                    }
                },
                //uint
                "Uint32": {
                    write: function (val) {
                        this.uint32(val);
                    },
                    read: function () {
                        return this.uint32();
                    }
                },
                "Uint16": {
                    write: function (val) {
                        this.uint16(val);
                    },
                    read: function () {
                        return this.uint16();
                    }
                },
                "Uint8": {
                    write: function (val) {
                        this.uint8(val);
                    },
                    read: function () {
                        return this.uint8();
                    }
                },
                "Boolean": {
                    write: function (b) {
                        this.boolean(b);
                    },
                    read: function () {
                        return this.boolean();
                    }
                },
                "Object": {
                    write: function (object) {
                        if (akra.isArray(object)) {
                            this.boolean(true); /*is array*/
                            this.uint32(object.length);

                            for (var i = 0; i < object.length; ++i) {
                                this.write(object[i]);
                            }
                        } else {
                            this.boolean(false); /*is not array*/
                            this.stringArray(Object.keys(object));

                            for (var key in object) {
                                this.write(object[key]);
                            }
                        }
                    },
                    read: function (object) {
                        var isArray = this.boolean();
                        var keys;
                        var n;

                        if (isArray) {
                            n = this.uint32();
                            object = object || new Array(n);

                            for (var i = 0; i < n; ++i) {
                                object[i] = this.read();
                            }
                        } else {
                            object = object || {};
                            keys = this.stringArray();

                            for (var i = 0; i < keys.length; ++i) {
                                object[keys[i]] = this.read();
                            }
                        }

                        return object;
                    }
                },
                "Function": {
                    write: function (fn) {
                        var sFunc = String(fn.valueOf());
                        var sBody = sFunc.substr(sFunc.indexOf("{") + 1, sFunc.lastIndexOf("}") - sFunc.indexOf("{") - 1);
                        var pArgs = sFunc.substr(sFunc.indexOf("(") + 1, sFunc.indexOf(")") - sFunc.indexOf("(") - 1).match(/[$A-Z_][0-9A-Z_$]*/gi);

                        //var sName: string = null;
                        //var pMatches: string[] = sFunc.match(/(function\s+)([_$a-zA-Z][_$a-zA-Z0-9]*)(?=\s*\()/gi);
                        // if (isDefAndNotNull(pMatches) && pMatches.length > 2) {
                        // 	sName = pMatches[2];
                        // }
                        //this.string(sName);
                        this.stringArray(pArgs);
                        this.string(sBody);
                    },
                    read: function () {
                        return new Function(this.stringArray(), this.string());
                    }
                },
                "Number": "Float32",
                "Float": "Float32",
                "Int": "Int32",
                "Uint": "Uint32",
                "Array": "Object"
            });
        })(io.templates || (io.templates = {}));
        var templates = io.templates;
    })(akra.io || (akra.io = {}));
    var io = akra.io;
})(akra || (akra = {}));
//# sourceMappingURL=common.js.map
