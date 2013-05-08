#ifndef MATH_TS
#define MATH_TS

#define vec2(...) Vec2.stackCeil.set(__VA_ARGS__)
#define vec3(...) Vec3.stackCeil.set(__VA_ARGS__)
#define vec4(...) Vec4.stackCeil.set(__VA_ARGS__)
#define quat4(...) Quat4.stackCeil.set(__VA_ARGS__)
#define mat3(...) Mat3.stackCeil.set(__VA_ARGS__)
#define mat4(...) Mat4.stackCeil.set(__VA_ARGS__)

#include "Vec2.ts"
#include "Vec3.ts"
#include "Vec4.ts"

#include "Mat2.ts"
#include "Mat3.ts"
#include "Mat4.ts"

#include "Quat4.ts"

#include "const.ts"
#include "global.ts"

module akra.math {	

 //    export function vec2(): IVec2;
 //    export function vec2(fValue: float): IVec2;
 //    export function vec2(v2fVec: IVec2): IVec2;
 //    export function vec2(pArray: float[]): IVec2;
 //    export function vec2(fValue1: float, fValue2: float): IVec2;
 //    export function vec2(fValue1?, fValue2?): IVec2{
 //        var nArgumentsLength: uint = arguments.length;
 //        var v2fVec: IVec2 = Vec2.stack[Vec2.stackPosition ++];

 //        if(Vec2.stackPosition == Vec2.stackSize){
 //            Vec2.stackPosition = 0;
 //        }

 //        switch(nArgumentsLength){
 //            case 1:
 //                v2fVec.set(arguments[0]);
 //                break;
 //            case 2:
 //                v2fVec.set(arguments[0], arguments[1]);
 //                break;
 //            default:
 //                v2fVec.x = v2fVec.y = 0.;
 //                break;
 //        }

 //        return v2fVec;
 //    };

 //    export function vec3(): IVec3;
 //    export function vec3(fValue: float): IVec3;
 //    export function vec3(v3fVec: IVec3): IVec3;
 //    export function vec3(pArray: float[]): IVec3;
 //    export function vec3(fValue: float, v2fVec: IVec2): IVec3;
 //    export function vec3(v2fVec: IVec2, fValue: float): IVec3;
 //    export function vec3(fValue1: float, fValue2: float, fValue3: float): IVec3;
 //    export function vec3(fValue1?, fValue2?, fValue3?): IVec3{
 //        var nArgumentsLength: uint = arguments.length;
 //        var v3fVec: IVec3 = Vec3.stack[Vec3.stackPosition ++];

 //        if(Vec3.stackPosition == Vec3.stackSize){
 //            Vec3.stackPosition = 0;
 //        }

 //        switch(nArgumentsLength){
 //            case 1:
 //                v3fVec.set(arguments[0]);
 //                break;
 //            case 2:
 //                v3fVec.set(arguments[0], arguments[1]);
 //                break;
 //            case 3: 
 //                v3fVec.set(arguments[0], arguments[1], arguments[2]);
 //                break;
 //            default:
 //                v3fVec.x = v3fVec.y = v3fVec.z = 0.;
 //                break;
 //        }

 //        return v3fVec;
 //    };

 //    export function vec4(): IVec4;
 //    export function vec4(fValue: float): IVec4;
 //    export function vec4(v4fVec: IVec4): IVec4;
 //    export function vec4(pArray: float[]): IVec4;
 //    export function vec4(fValue: float, v3fVec: IVec3): IVec4;
 //    export function vec4(v2fVec1: IVec2, v2fVec2: IVec2): IVec4;
 //    export function vec4(v3fVec: IVec3, fValue: float): IVec4;
 //    export function vec4(fValue1: float, fValue2: float, v2fVec: IVec2): IVec4;
 //    export function vec4(fValue1: float, v2fVec: IVec2, fValue2: float): IVec4;
 //    export function vec4(v2fVec: IVec2 ,fValue1: float, fValue2: float): IVec4;
 //    export function vec4(fValue1: float, fValue2: float, fValue3: float, fValue4: float): IVec4;
 //    export function vec4(fValue1?, fValue2?, fValue3?, fValue4?): IVec4{
 //        var nArgumentsLength: uint = arguments.length;
 //        var v4fVec: IVec4 = Vec4.stack[Vec4.stackPosition ++];

 //        if(Vec4.stackPosition == Vec4.stackSize){
 //            Vec4.stackPosition = 0;
 //        }

 //        switch(nArgumentsLength){
 //            case 1:
 //                v4fVec.set(arguments[0]);
 //                break;
 //            case 2:
 //                v4fVec.set(arguments[0],arguments[1]);
 //                break;
 //            case 3:
 //                v4fVec.set(arguments[0],arguments[1], arguments[2]);
 //                break;
 //            case 4:
 //                v4fVec.set(arguments[0],arguments[1], arguments[2], arguments[3]);
 //                break;
 //            default: 
 //                v4fVec.x = v4fVec.y = v4fVec.z = v4fVec.w = 0.;
 //                break;
 //        }

 //        return v4fVec;
 //    };

 //    export function quat4(): IQuat4;
	// export function quat4(q4fQuat: IQuat4): IQuat4;
	// export function quat4(pArray: float[]): IQuat4;
	// export function quat4(fValue: float, fW: float): IQuat4;
	// export function quat4(v3fValue: IVec3, fW: float): IQuat4;
	// export function quat4(fX: float, fY: float, fZ: float, fW: float): IQuat4;
	// export function quat4(fX?, fY?, fZ?, fW?): IQuat4{
	// 	var nArgumentsLength: uint = arguments.length;
	// 	var q4fQuat: IQuat4 = Quat4.stack[Quat4.stackPosition ++];

	// 	if(Quat4.stackPosition == Quat4.stackSize){
 //            Quat4.stackPosition = 0;
	// 	}

	// 	switch(nArgumentsLength){
	// 		case 1:
	// 			q4fQuat.set(arguments[0]);
	// 			break;
	// 		case 2:
	// 			q4fQuat.set(arguments[0], arguments[1]);
	// 			break;
	// 		case 4:
	// 			q4fQuat.set(arguments[0], arguments[1], arguments[2], arguments[3]);
	// 			break;
	// 		default:
	// 			q4fQuat.x = q4fQuat.y = q4fQuat.z = 0.;
	// 			q4fQuat.w = 1.;
	// 			break;
	// 	}

	// 	return q4fQuat;
	// };

	// export function mat3(): IMat3;
	// export function mat3(fValue: float): IMat3;
	// export function mat3(v3fVec: IVec3): IMat3;
	// export function mat3(m3fMat: IMat3): IMat3;
	// export function mat3(m4fMat: IMat4): IMat3;
	// export function mat3(pArray: float[]): IMat3;
	// export function mat3(fValue1: float, fValue2: float, fValue3: float): IMat3;
	// export function mat3(v3fVec1: IVec3, v3fVec2: IVec3, v3fVec3: IVec3): IMat3;
	// export function mat3(pArray1: float[], pArray2: float[], pArray3: float[]): IMat3;
	// export function mat3(fValue1: float, fValue2: float, fValue3: float,
	// 			fValue4: float, fValue5: float, fValue6: float,
	// 			fValue7: float, fValue8: float, fValue9: float): IMat3;
	// export function mat3(fValue1?, fValue2?, fValue3?,
	// 			fValue4?, fValue5?, fValue6?,
	// 			fValue7?, fValue8?, fValue9?): IMat3{

	// 	var nArgumentsLength: uint = arguments.length;
	// 	var m3fMat: IMat3 = Mat3.stack[Mat3.stackPosition ++];

 //        if(Mat3.stackPosition == Mat3.stackSize){
 //            Mat3.stackPosition = 0;
	// 	}

	// 	switch(nArgumentsLength){
	// 		case 1:
	// 			m3fMat.set(arguments[0]);
	// 			break;
	// 		case 3:
	// 			m3fMat.set(arguments[0], arguments[1], arguments[2]);
	// 			break;
	// 		case 9:
	// 			m3fMat.set(arguments[0], arguments[1], arguments[2],
	// 					 arguments[3], arguments[4], arguments[5],
	// 					 arguments[6], arguments[7], arguments[8]);
	// 			break;
	// 		default:
	// 			m3fMat.set(0.);
	// 			break;
	// 	}

	// 	return m3fMat;
	// };

	// export function mat4(): IMat4;
	// export function mat4(fValue: float): IMat4;
	// export function mat4(v4fVec: IVec4): IMat4;
	// export function mat4(m3fMat: IMat3, v3fTranslation?: IVec3): IMat4;
	// export function mat4(m4fMat: IMat4): IMat4;
	// export function mat4(pArray: float[]): IMat4;
	// export function mat4(pArray: Float32Array, bFlag: bool): IMat4;
	// export function mat4(fValue1: float, fValue2: float,
	// 		fValue3: float, fValue4: float): IMat4;
	// export function mat4(v4fVec1: IVec4, v4fVec2: IVec4,
	// 		v4fVec3: IVec4, v4fVec4: IVec4): IMat4;
	// export function mat4(pArray1: float[], pArray2: float[],
	// 		pArray3: float[], pArray4: float[]): IMat4;
	// export function mat4(fValue1: float, fValue2: float, fValue3: float, fValue4: float,
	// 		fValue5: float, fValue6: float, fValue7: float, fValue8: float,
	// 		fValue9: float, fValue10: float, fValue11: float, fValue12: float,
	// 		fValue13: float, fValue14: float, fValue15: float, fValue16: float): IMat4;
	// export function mat4(fValue1?, fValue2?, fValue3?, fValue4?,
	// 			fValue5?, fValue6?, fValue7?, fValue8?,
	// 			fValue9?, fValue10?, fValue11?, fValue12?,
	// 			fValue13?, fValue14?, fValue15?, fValue16?): IMat4{

	// 	var nArgumentsLength: uint = arguments.length;
	// 	var m4fMat: IMat4 = Mat4.stack[Mat4.stackPosition ++];

 //        if(Mat4.stackPosition == Mat4.stackSize){
 //            Mat4.stackPosition = 0;
	// 	}

	// 	if(nArgumentsLength === 2){
	// 		if(isBoolean(arguments[1])){
	// 			if(arguments[1]){
	// 				m4fMat.data = arguments[0];
	// 			}
	// 			else{
	// 				m4fMat.set(arguments[0]);			
	// 			}
	// 		}
	// 		else{
	// 			m4fMat.set(arguments[0], arguments[1]);
	// 		}
	// 	}
	// 	else{
	// 		switch(nArgumentsLength){
	// 			case 1:
	// 				if(arguments[0] instanceof Mat3){
	// 					m4fMat.set(arguments[0],vec3(0.));	
	// 				}
	// 				else{
	// 					m4fMat.set(arguments[0]);	
	// 				}	
	// 				break;
	// 			case 4:
	// 				m4fMat.set(arguments[0],arguments[1],arguments[2],arguments[3]);
	// 				break;
	// 			case 16:
	// 				m4fMat.set(arguments[0], arguments[1], arguments[2], arguments[3],
	// 					 arguments[4], arguments[5], arguments[6], arguments[7],
	// 					 arguments[8], arguments[9], arguments[10], arguments[11],
	// 					 arguments[12], arguments[13], arguments[14], arguments[15]);
	// 				 break;
	// 			 default:
	// 			 	break;	
	// 		}
	// 	}

	// 	return m4fMat;
	// };

}

module akra {
	export var Vec2 = math.Vec2;
	export var Vec3 = math.Vec3;
	export var Vec4 = math.Vec4;
#ifdef MAT2_TS	
	export var Mat2 = math.Mat2;
#endif	
	export var Mat3 = math.Mat3;
	export var Mat4 = math.Mat4;
	export var Quat4 = math.Quat4;

	// export var vec2 = math.vec2;
	// export var vec3 = math.vec3;
	// export var vec4 = math.vec4;
	// export var quat4 = math.quat4;
	// export var mat3 = math.mat3;
	// export var mat4 = math.mat4;
}

#endif