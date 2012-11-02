#ifndef QUAT4_TS
#define QUAT4_TS

#include "IQuat4.ts"

module akra.math {
    export class Quat4 implements IQuat4{
    	x: float;
    	y: float;
    	z: float;
    	w: float;
    }
}

#endif