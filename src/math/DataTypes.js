/**
 * @file
 * @brief data_types
 * @author xoma
 * @email xoma@odserve.org
 * Файл с описанием предельных значений целых типов и типов с палвающей запятой
 **/


Define(MIN_INT32, 0xffffffff); 	// (-2147483646);
Define(MAX_INT32, 0x7fffffff); 	// ( 2147483647);
Define(MIN_INT16, 0xffff); 		// (-32768);
Define(MAX_INT16, 0x7fff); 		// ( 32767);
Define(MIN_INT8, 0xff); 		// (-128);
Define(MAX_INT8, 0x7f); 		// ( 127);
Define(MIN_UINT32, 0);
Define(MAX_UINT32, 0xffffffff);
Define(MIN_UINT16, 0);
Define(MAX_UINT16, 0xffff);
Define(MIN_UINT8, 0);
Define(MAX_UINT8, 0xff);


Define(SIZE_FLOAT64, 8);
Define(SIZE_REAL64, 8);
Define(SIZE_FLOAT32, 4);
Define(SIZE_REAL32, 4);
Define(SIZE_INT32, 4);
Define(SIZE_UINT32, 4);
Define(SIZE_INT16, 2);
Define(SIZE_UINT16, 2);
Define(SIZE_INT8, 1);
Define(SIZE_UINT8, 1);
Define(SIZE_BYTE, 1);
Define(SIZE_UBYTE, 1);


Define(MAX_FLOAT64, Number.MAX_VALUE);  	//1.7976931348623157e+308
Define(MIN_FLOAT64, -Number.MAX_VALUE); 	//-1.7976931348623157e+308
Define(TINY_FLOAT64, Number.MIN_VALUE); 	//5e-324

Define(MAX_REAL64, Number.MAX_VALUE);  	//1.7976931348623157e+308
Define(MIN_REAL64, -Number.MAX_VALUE); 	//-1.7976931348623157e+308
Define(TINY_REAL64, Number.MIN_VALUE); 	//5e-324


Define(MAX_FLOAT32, 3.4e38);  	//3.4e38
Define(MIN_FLOAT32, -3.4e38); 	//-3.4e38
Define(TINY_FLOAT32, 1.5e-45); 	//1.5e-45

Define(MAX_REAL32, 3.4e38);  	//3.4e38
Define(MIN_REAL32, -3.4e38); 	//-3.4e38
Define(TINY_REAL32, 1.5e-45); 	//1.5e-45

