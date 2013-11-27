module akra {

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

    export var MIN_UINT32: uint = 0;
    export var MAX_UINT32: uint = 0xffffffff;
    export var MIN_UINT16: uint = 0;
    export var MAX_UINT16: uint = 0xffff;
    export var MIN_UINT8: uint = 0;
    export var MAX_UINT8: uint = 0xff;


    export var SIZE_FLOAT64: float = 8;
    export var SIZE_REAL64: int = 8;
    export var SIZE_FLOAT32: float = 4;
    export var SIZE_REAL32: int = 4;
    export var SIZE_INT32: int = 4;
    export var SIZE_UINT32: uint = 4;
    export var SIZE_INT16: int = 2;
    export var SIZE_UINT16: uint = 2;
    export var SIZE_INT8: int = 1;
    export var SIZE_UINT8: uint = 1;
    export var SIZE_BYTE: int = 1;
    export var SIZE_UBYTE: uint = 1;

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

}