var akra;
(function (akra) {
    // (-2147483646);
    akra.MIN_INT32 = 0xffffffff;

    // ( 2147483647);
    akra.MAX_INT32 = 0x7fffffff;

    // (-32768);
    akra.MIN_INT16 = 0xffff;

    // ( 32767);
    akra.MAX_INT16 = 0x7fff;

    // (-128);
    akra.MIN_INT8 = 0xff;

    // ( 127);
    akra.MAX_INT8 = 0x7f;

    akra.MIN_UINT32 = 0;
    akra.MAX_UINT32 = 0xffffffff;
    akra.MIN_UINT16 = 0;
    akra.MAX_UINT16 = 0xffff;
    akra.MIN_UINT8 = 0;
    akra.MAX_UINT8 = 0xff;

    akra.SIZE_FLOAT64 = 8;
    akra.SIZE_REAL64 = 8;
    akra.SIZE_FLOAT32 = 4;
    akra.SIZE_REAL32 = 4;
    akra.SIZE_INT32 = 4;
    akra.SIZE_UINT32 = 4;
    akra.SIZE_INT16 = 2;
    akra.SIZE_UINT16 = 2;
    akra.SIZE_INT8 = 1;
    akra.SIZE_UINT8 = 1;
    akra.SIZE_BYTE = 1;
    akra.SIZE_UBYTE = 1;

    //1.7976931348623157e+308
    akra.MAX_FLOAT64 = Number.MAX_VALUE;

    //-1.7976931348623157e+308
    akra.MIN_FLOAT64 = -Number.MAX_VALUE;

    //5e-324
    akra.TINY_FLOAT64 = Number.MIN_VALUE;

    //    export var MAX_REAL64: number = Number.MAX_VALUE;   //1.7976931348623157e+308
    //    export var MIN_REAL64: number = -Number.MAX_VALUE;  //-1.7976931348623157e+308
    //    export var TINY_REAL64: number = Number.MIN_VALUE;  //5e-324
    //3.4e38
    akra.MAX_FLOAT32 = 3.4e38;

    //-3.4e38
    akra.MIN_FLOAT32 = -3.4e38;

    //1.5e-45
    akra.TINY_FLOAT32 = 1.5e-45;
})(akra || (akra = {}));
//# sourceMappingURL=limit.js.map
