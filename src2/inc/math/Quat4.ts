#ifndef QUAT4_TS
#define QUAT4_TS

#include "IQuat4.ts"

module akra.math {
    export class Quat4 implements IQuat4{
    	x: float;
    	y: float;
    	z: float;
    	w: float;

    	set(x?, y?, z?, w?): IQuat4 { return null; }
    	toMat4(m4fDestination?: IMat4): IMat4 { return null; }
    	multiplyVec3(v3fVec: IVec3, v3fDestionation?: IVec3): IVec3 { return null; }
    	multiply(q4fQuat: IQuat4, q4fDestination?: IQuat4): IQuat4 { return null; }
        smix(q4fQuat: IQuat4, fRoll: float): IQuat4 { return null; }
    	
    	static fromAxisAngle(v3fAxis: IVec3, fAngle: float, q4fDest?: IQuat4): IQuat4 { return null; }
    	static fromForwardUp(v3fForward: IVec3, v3fUp: IVec3, q4fDest?: IQuat4): IQuat4 { return null; }
    	static fromYawPitchRoll(fYaw: float, fPitch: float, fRoll: float, q4fDest?: IQuat4): IQuat4 { return null; }
    }
}

#endif