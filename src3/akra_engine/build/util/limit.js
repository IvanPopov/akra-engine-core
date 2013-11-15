define(["require", "exports"], function(require, exports) {
    // (-2147483646);
    exports.MIN_INT32 = 0xffffffff;

    // ( 2147483647);
    exports.MAX_INT32 = 0x7fffffff;

    // (-32768);
    exports.MIN_INT16 = 0xffff;

    // ( 32767);
    exports.MAX_INT16 = 0x7fff;

    // (-128);
    exports.MIN_INT8 = 0xff;

    // ( 127);
    exports.MAX_INT8 = 0x7f;

    exports.MIN_UINT32 = 0;
    exports.MAX_UINT32 = 0xffffffff;
    exports.MIN_UINT16 = 0;
    exports.MAX_UINT16 = 0xffff;
    exports.MIN_UINT8 = 0;
    exports.MAX_UINT8 = 0xff;

    exports.SIZE_FLOAT64 = 8;
    exports.SIZE_REAL64 = 8;
    exports.SIZE_FLOAT32 = 4;
    exports.SIZE_REAL32 = 4;
    exports.SIZE_INT32 = 4;
    exports.SIZE_UINT32 = 4;
    exports.SIZE_INT16 = 2;
    exports.SIZE_UINT16 = 2;
    exports.SIZE_INT8 = 1;
    exports.SIZE_UINT8 = 1;
    exports.SIZE_BYTE = 1;
    exports.SIZE_UBYTE = 1;

    //1.7976931348623157e+308
    exports.MAX_FLOAT64 = Number.MAX_VALUE;

    //-1.7976931348623157e+308
    exports.MIN_FLOAT64 = -Number.MAX_VALUE;

    //5e-324
    exports.TINY_FLOAT64 = Number.MIN_VALUE;

    //    export var MAX_REAL64: number = Number.MAX_VALUE;   //1.7976931348623157e+308
    //    export var MIN_REAL64: number = -Number.MAX_VALUE;  //-1.7976931348623157e+308
    //    export var TINY_REAL64: number = Number.MIN_VALUE;  //5e-324
    //3.4e38
    exports.MAX_FLOAT32 = 3.4e38;

    //-3.4e38
    exports.MIN_FLOAT32 = -3.4e38;

    //1.5e-45
    exports.TINY_FLOAT32 = 1.5e-45;
});
//# sourceMappingURL=limit.js.map
