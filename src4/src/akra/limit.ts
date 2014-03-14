module akra {

    // (-2147483646);
    export const MIN_INT32: int = 0xffffffff;
    // ( 2147483647);
    export const MAX_INT32: int = 0x7fffffff;
    // (-32768);
    export const MIN_INT16: int = 0xffff;
    // ( 32767);
    export const MAX_INT16: int = 0x7fff;
    // (-128);
    export const MIN_INT8: int = 0xff;
    // ( 127);
    export const MAX_INT8: int = 0x7f;

    export const MIN_UINT32: uint = 0;
    export const MAX_UINT32: uint = 0xffffffff;
    export const MIN_UINT16: uint = 0;
    export const MAX_UINT16: uint = 0xffff;
    export const MIN_UINT8: uint = 0;
    export const MAX_UINT8: uint = 0xff;


    export const SIZE_FLOAT64: float = 8;
    export const SIZE_REAL64: int = 8;
    export const SIZE_FLOAT32: float = 4;
    export const SIZE_REAL32: int = 4;
    export const SIZE_INT32: int = 4;
    export const SIZE_UINT32: uint = 4;
    export const SIZE_INT16: int = 2;
    export const SIZE_UINT16: uint = 2;
    export const SIZE_INT8: int = 1;
    export const SIZE_UINT8: uint = 1;
    export const SIZE_BYTE: int = 1;
    export const SIZE_UBYTE: uint = 1;

    //1.7976931348623157e+308
    export const MAX_FLOAT64: float = Number.MAX_VALUE;
    //-1.7976931348623157e+308
    export const MIN_FLOAT64: float = -Number.MAX_VALUE;
    //5e-324
    export const TINY_FLOAT64: float = Number.MIN_VALUE;

    //    export const MAX_REAL64: number = Number.MAX_VALUE;   //1.7976931348623157e+308
    //    export const MIN_REAL64: number = -Number.MAX_VALUE;  //-1.7976931348623157e+308
    //    export const TINY_REAL64: number = Number.MIN_VALUE;  //5e-324


    //3.4e38
    export const MAX_FLOAT32: float = 3.4e38;
    //-3.4e38
    export const MIN_FLOAT32: float = -3.4e38;
    //1.5e-45
    export const TINY_FLOAT32: float = 1.5e-45;

    //    export const MAX_REAL32: number = 3.4e38;     //3.4e38
    //    export const MIN_REAL32: number = -3.4e38;    //-3.4e38
    //    export const TINY_REAL32: number = 1.5e-45;   //1.5e-45

}