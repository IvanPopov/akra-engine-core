#ifndef FILE_TS
#define FILE_TS

#include "Pathinfo.ts"

#define CAN_CREATE(MODE) TEST_BIT(MODE, 1)
#define CAN_READ(MODE) TEST_BIT(MODE, 0)
#define CAN_WRITE(MODE) TEST_BIT(MODE, 1)

#define IS_BINARY(MODE) TEST_BIT(MODE, 5)
#define IS_APPEND(MODE) TEST_BIT(MODE, 3)
#define IS_TRUNC(MODE) TEST_BIT(MODE, 4)

module akra.io {

	export enum EModes {
		IN = 0x01,
		OUT = 0x02,
		ATE = 0x04,
		APP = 0x08,
		TRUNC = 0x10,
		BINARY = 0x20,
		BIN = 0x20,
		TEXT = 0x40
	};

	export filemode(sMode: string): int {
		switch (sMode.toLowerCase()) {
	        case "a+t":
	            return EModes.IN | EModes.OUT | EModes.APP | EModes.TEXT;
	        case "w+t":
	            return EModes.IN | EModes.OUT | EModes.TRUNC | EModes.TEXT;
	        case "r+t":
	            return EModes.IN | EModes.OUT | EModes.TEXT;

	        case "at":
	            return EModes.APP | EModes.TEXT;
	        case "wt":
	            return EModes.OUT | EModes.TEXT;
	        case "rt":
	            return EModes.IN | EModes.TEXT;

	        case "a+b":
	            return EModes.IN | EModes.OUT | EModes.APP | EModes.BIN;
	        case "w+b":
	            return EModes.IN | EModes.OUT | EModes.TRUNC | EModes.BIN;
	        case "r+b":
	            return EModes.IN | EModes.OUT | EModes.BIN;

	        case "ab":
	            return EModes.APP | EModes.BIN;
	        case "wb":
	            return EModes.OUT | EModes.BIN;
	        case "rb":
	            return EModes.IN | EModes.BIN;

	        case "a+":
	            return EModes.IN | EModes.OUT | EModes.APP;
	        case "w+":
	            return EModes.IN | EModes.OUT | EModes.TRUNC;
	        case "r+":
	            return EModes.IN | EModes.OUT;

	        case "a":
	            return EModes.APP | EModes.OUT;
	        case "w":
	            return EModes.OUT;
	        case "r":
	        default:
	            return EModes.IN;
	    }
	}

}

#endif FILE_TS