#ifndef MAT3_TS
#define MAT3_TS

#include "IMat3.ts"
#include "IMat4.ts"
#include "IVec3.ts"
#include "IQuat4.ts"

module akra.math {
    export class Mat3 {
    	/*var m3fMat;

	    if(this === window  || this === window.AKRA){
	        m3fMat = Mat3._pStorage[Mat3._iIndex++];
	        if(Mat3._iIndex == Mat3._nStorageSize){
	            Mat3._iIndex = 0;
	        }        

	        //clear
	        if(arguments.length == 0){
	            // var pData = m3fMat.pData;
	            // pData.a11 = pData.a12 = pData.a13 = 
	            // pData.a21 = pData.a22 = pData.a23 = 
	            // pData.a31 = pData.a32 = pData.a33 = 0;
	            return m3fMat;
	        }
	    }
	    else{
	        this.pData = new Float32Array(9);
	        m3fMat = this;
	    }*/

	    data : Float32Array;

	    constructor();
		constructor(fValue: float);
		constructor(v3fVec: IVec3);
		constructor(m3fMat: IMat3);
		constructor(m4fMat: IMat4);
		constructor(pArray: float[]);
		constructor(fValue1: float, fValue2: float, fValue3: float);
		constructor(v3fVec1: IVec3, v3fVec2: IVec3, v3fVec3: IVec3);
		constructor(pArray1: float[], pArray2: float[], pArray3: float[]);
		constructor(fValue1: float, fValue2: float, fValue3: float,
					fValue4: float, fValue5: float, fValue6: float,
					fValue7: float, fValue8: float, fValue9: float);

		constructor(fValue1?, fValue2?, fValue3?,
					fValue4?, fValue5?, fValue6?,
					fValue7?, fValue8?, fValue9?){

			this.data = new Float32Array(9);

			var nArgumentsLength: uint = arguments.length;

			if(nArgumentsLength == 1){
		        this.set(arguments[0]);    
		    }
		    else if(nArgumentsLength == 3){
		        this.set(arguments[0],arguments[1],arguments[2]);    
		    }
		    else if(nArgumentsLength == 9){
		        this.set(arguments[0],arguments[1],arguments[2],
                        arguments[3],arguments[4],arguments[5],
                        arguments[6],arguments[7],arguments[8]);    
		    }
		};

		set(): IMat3;
		set(fValue: float): IMat3;
		set(v3fVec: IVec3): IMat3;
		set(m3fMat: IMat3): IMat3;
		set(m4fMat: IMat4): IMat3;
		set(pArray: float[]): IMat3;
		set(fValue1: float, fValue2: float, fValue3: float): IMat3;
		set(v3fVec1: IVec3, v3fVec2: IVec3, v3fVec3: IVec3): IMat3;
		set(pArray1: float[], pArray2: float[], pArray3: float[]): IMat3;
		set(fValue1: float, fValue2: float, fValue3: float,
			fValue4: float, fValue5: float, fValue6: float,
			fValue7: float, fValue8: float, fValue9: float): IMat3;

		set(fValue1?, fValue2?, fValue3?,
			fValue4?, fValue5?, fValue6?,
			fValue7?, fValue8?, fValue9?): IMat3{

			var pData: Float32Array = this.data;

		    //без аргументов инициализируется нулями
		    
		    var nArgumentsLength: uint = arguments.length;
		    if(nArgumentsLength == 0){
		        pData[__a11] = pData[__a12] = pData[__a13] = 0;
		        pData[__a21] = pData[__a22] = pData[__a23] = 0;
		        pData[__a31] = pData[__a32] = pData[__a33] = 0;
		    }
		    if(nArgumentsLength == 1){
		        if(isFloat(arguments[0])){
		            var nValue: float = arguments[0];

		            pData[__a11] = nValue;
		            pData[__a12] = 0;
		            pData[__a13] = 0;

		            pData[__a21] = 0;
		            pData[__a22] = nValue;
		            pData[__a23] = 0;

		            pData[__a31] = 0;
		            pData[__a32] = 0;
		            pData[__a33] = nValue;
		        }

		        else if(isDef(arguments[0].data)){
		            var pElements: Float32Array = arguments[0].data;

		            if(pElements.length === 9){
		            	//Mat3
			            pData[__a11] = pElements[__a11];
			            pData[__a12] = pElements[__a12];
			            pData[__a13] = pElements[__a13];

			            pData[__a21] = pElements[__a21];
			            pData[__a22] = pElements[__a22];
			            pData[__a23] = pElements[__a23];

			            pData[__a31] = pElements[__a31];
			            pData[__a32] = pElements[__a32];
			            pData[__a33] = pElements[__a33];
		        	}
		        	else{
		        		//Mat4
		        		pData[__a11] = pElements[__11];
			            pData[__a12] = pElements[__12];
			            pData[__a13] = pElements[__13];

			            pData[__a21] = pElements[__21];
			            pData[__a22] = pElements[__22];
			            pData[__a23] = pElements[__23];

			            pData[__a31] = pElements[__31];
			            pData[__a32] = pElements[__32];
			            pData[__a33] = pElements[__33];
		        	}
		        }
		        else if(arguments[0] instanceof Vec3){
		            var v3fVec: IVec3 = arguments[0];

		            //диагональ

		            pData[__a11] = v3fVec.x; 
		            pData[__a12] = 0;
		            pData[__a13] = 0;

		            pData[__a21] = 0;
		            pData[__a22] = v3fVec.y;
		            pData[__a23] = 0;

		            pData[__a31] = 0;
		            pData[__a32] = 0;
		            pData[__a33] = v3fVec.z;
		        }
		        else{
		            var pElements: float[] = arguments[0];            

		            if(pElements.length == 3){
		                //ложим диагональ
		                pData[__a11] = pElements[0];
		                pData[__a12] = 0;
		                pData[__a13] = 0;

		                pData[__a21] = 0;
		                pData[__a22] = pElements[1];
		                pData[__a23] = 0;

		                pData[__a31] = 0;
		                pData[__a32] = 0;
		                pData[__a33] = pElements[2];
		            }
		            else{
		                pData[__a11] = pElements[__a11];
		                pData[__a12] = pElements[__a12];
		                pData[__a13] = pElements[__a13];

		                pData[__a21] = pElements[__a21];
		                pData[__a22] = pElements[__a22];
		                pData[__a23] = pElements[__a23];

		                pData[__a31] = pElements[__a31];
		                pData[__a32] = pElements[__a32];
		                pData[__a33] = pElements[__a33];
		            }
		        }
		    }
		    else if(nArgumentsLength == 3){
		        if(isFloat(arguments[0])){
		            //выставляем диагональ
		            pData[__a11] = arguments[0]; 
		            pData[__a12] = 0;
		            pData[__a13] = 0;

		            pData[__a21] = 0; 
		            pData[__a22] = arguments[1];
		            pData[__a23] = 0;

		            pData[__a31] = 0; 
		            pData[__a32] = 0; 
		            pData[__a33] = arguments[2];
		        }
		        else{
		            var pData1,pData2,pData3;
		            if(arguments[0] instanceof Vec3){

		                var v3fVec1: IVec3 = arguments[0];
		                var v3fVec2: IVec3 = arguments[1];
		                var v3fVec3: IVec3 = arguments[2];

		                //ложим по столбцам

		                pData[__a11] = v3fVec1.x;
		                pData[__a12] = v3fVec2.x;
		                pData[__a13] = v3fVec3.x;

		                pData[__a21] = v3fVec1.y;
		                pData[__a22] = v3fVec2.y;
		                pData[__a23] = v3fVec3.y;

		                pData[__a31] = v3fVec1.z;
		                pData[__a32] = v3fVec2.z;
		                pData[__a33] = v3fVec3.z;
		            }
		            else{

		                var v3fVec1: float[] = arguments[0];
		                var v3fVec2: float[] = arguments[1];
		                var v3fVec3: float[] = arguments[2];    

		                //ложим по столбцам

		                pData[__a11] = v3fVec1[0];
		                pData[__a12] = v3fVec2[0];
		                pData[__a13] = v3fVec3[0];

		                pData[__a21] = v3fVec1[1];
		                pData[__a22] = v3fVec2[1];
		                pData[__a23] = v3fVec3[1];

		                pData[__a31] = v3fVec1[2];
		                pData[__a32] = v3fVec2[2];
		                pData[__a33] = v3fVec3[2];
		            }
		        }
		    }
		    else if(nArgumentsLength == 9){
		        //просто числа
		        pData[__a11] = arguments[__a11];
		        pData[__a12] = arguments[__a12];
		        pData[__a13] = arguments[__a13];

		        pData[__a21] = arguments[__a21];
		        pData[__a22] = arguments[__a22];
		        pData[__a23] = arguments[__a23];

		        pData[__a31] = arguments[__a31];
		        pData[__a32] = arguments[__a32];
		        pData[__a33] = arguments[__a33];
		    }
		    
		    return this;
		};

		identity(): IMat3{
			var pData: Float32Array = this.data;

		    pData[__a11] = 1.;
		    pData[__a12] = 0.;
		    pData[__a13] = 0.;

		    pData[__a21] = 0.;
		    pData[__a22] = 1.;
		    pData[__a23] = 0.;

		    pData[__a31] = 0.;
		    pData[__a32] = 0.;
		    pData[__a33] = 1.;

		    return this;
		};

		add(m3fMat: IMat3, m3fDestination?: IMat3): IMat3{
			if(!isDef(m3fDestination)){
		        m3fDestination = this;
		    }

		    var pData1: Float32Array = this.data;
		    var pData2: Float32Array = m3fMat.data;
		    var pDataDestination: Float32Array = m3fDestination.data;

		    pDataDestination[__a11] = pData1[__a11] + pData2[__a11];
		    pDataDestination[__a12] = pData1[__a12] + pData2[__a12];
		    pDataDestination[__a13] = pData1[__a13] + pData2[__a13];

		    pDataDestination[__a21] = pData1[__a21] + pData2[__a21];
		    pDataDestination[__a22] = pData1[__a22] + pData2[__a22];
		    pDataDestination[__a23] = pData1[__a23] + pData2[__a23];

		    pDataDestination[__a31] = pData1[__a31] + pData2[__a31];
		    pDataDestination[__a32] = pData1[__a32] + pData2[__a32];
		    pDataDestination[__a33] = pData1[__a33] + pData2[__a33];

		    return m3fDestination;
		};

		subtract(m3fMat: IMat3, m3fDestination?: IMat3): IMat3{
			if(!isDef(m3fDestination)){
		        m3fDestination = this;
		    }

		    var pData1: Float32Array = this.data;
		    var pData2: Float32Array = m3fMat.data;
		    var pDataDestination: Float32Array = m3fDestination.data;

		    pDataDestination[__a11] = pData1[__a11] - pData2[__a11];
		    pDataDestination[__a12] = pData1[__a12] - pData2[__a12];
		    pDataDestination[__a13] = pData1[__a13] - pData2[__a13];

		    pDataDestination[__a21] = pData1[__a21] - pData2[__a21];
		    pDataDestination[__a22] = pData1[__a22] - pData2[__a22];
		    pDataDestination[__a23] = pData1[__a23] - pData2[__a23];

		    pDataDestination[__a31] = pData1[__a31] - pData2[__a31];
		    pDataDestination[__a32] = pData1[__a32] - pData2[__a32];
		    pDataDestination[__a33] = pData1[__a33] - pData2[__a33];

		    return m3fDestination;
		};

		multiply(m3fMat: IMat3, m3fDestination?: IMat3): IMat3{
			var pData1: Float32Array = this.data;
	        var pData2: Float32Array = m3fMat.data;

	        if(!isDef(m3fDestination)){
	            m3fDestination = this;
	        }
	        var pDataDestination = m3fDestination.data;

	        // Cache the matrix values (makes for huge speed increases!)
	        var a11: float = pData1[__a11], a12: float = pData1[__a12], a13: float = pData1[__a13];
	        var a21: float = pData1[__a21], a22: float = pData1[__a22], a23: float = pData1[__a23];
	        var a31: float = pData1[__a31], a32: float = pData1[__a32], a33: float = pData1[__a33];

	        var b11: float = pData2[__a11], b12: float = pData2[__a12], b13: float = pData2[__a13];
	        var b21: float = pData2[__a21], b22: float = pData2[__a22], b23: float = pData2[__a23];
	        var b31: float = pData2[__a31], b32: float = pData2[__a32], b33: float = pData2[__a33];

	        pDataDestination[__a11] = a11 * b11 + a12 * b21 + a13 * b31;
	        pDataDestination[__a12] = a11 * b12 + a12 * b22 + a13 * b32;
	        pDataDestination[__a13] = a11 * b13 + a12 * b23 + a13 * b33;

	        pDataDestination[__a21] = a21 * b11 + a22 * b21 + a23 * b31;
	        pDataDestination[__a22] = a21 * b12 + a22 * b22 + a23 * b32;
	        pDataDestination[__a23] = a21 * b13 + a22 * b23 + a23 * b33;

	        pDataDestination[__a31] = a31 * b11 + a32 * b21 + a33 * b31;
	        pDataDestination[__a32] = a31 * b12 + a32 * b22 + a33 * b32;
	        pDataDestination[__a33] = a31 * b13 + a32 * b23 + a33 * b33;

		    return m3fDestination;
		};

		multiplyVec3(v3fVec: IVec3, v3fDestination?: IVec3): IVec3{
			var pData: Float32Array = this.data;
		    
	        if(!isDef(v3fDestination)){
	            v3fDestination = new Vec3();
	        }

	        var x: float = v3fVec.x, y: float = v3fVec.y, z: float = v3fVec.z;

	        v3fDestination.x = pData[__a11] * x + pData[__a12] * y + pData[__a13] * z;
	        v3fDestination.y = pData[__a21] * x + pData[__a22] * y + pData[__a23] * z;
	        v3fDestination.z = pData[__a31] * x + pData[__a32] * y + pData[__a33] * z;
		    
		    return v3fDestination;
		};

		transpose(m3fDestination?: IMat3): IMat3{
			var pData: Float32Array = this.data;
		    if(!isDef(m3fDestination)){
		        //быстрее будет явно обработать оба случая
		        var a12: float = pData[__a12], a13: float = pData[__a13], a23: float = pData[__a23];

		        pData[__a12] = pData[__a21];
		        pData[__a13] = pData[__a31];

		        pData[__a21] = a12;
		        pData[__a23] = pData[__a32];

		        pData[__a31] = a13;
		        pData[__a32] = a23;

		        return this;
		    }

		    var pDataDestination: Float32Array = m3fDestination.data;

		    pDataDestination[__a11] = pData[__a11];
		    pDataDestination[__a12] = pData[__a21];
		    pDataDestination[__a13] = pData[__a31];

		    pDataDestination[__a21] = pData[__a12];
		    pDataDestination[__a22] = pData[__a22];
		    pDataDestination[__a23] = pData[__a32];

		    pDataDestination[__a31] = pData[__a13];
		    pDataDestination[__a32] = pData[__a23];
		    pDataDestination[__a33] = pData[__a33];

		    return m3fDestination;
		};

		determinant(): float{
			var pData: Float32Array = this.data;

		    var a11: float = pData[__a11], a12: float = pData[__a12], a13: float = pData[__a13];
		    var a21: float = pData[__a21], a22: float = pData[__a22], a23: float = pData[__a23];
		    var a31: float = pData[__a31], a32: float = pData[__a32], a33: float = pData[__a33];

		    return  a11 * (a22 * a33 - a23 * a32) 
		            - a12 * (a21 * a33 - a23 * a31) 
		            + a13 * (a21 * a32 - a22 * a31);
		};

		inverse(m3fDestination?: IMat3): IMat3{
			if(!isDef(m3fDestination)){
		        m3fDestination = this;
		    }

		    var pData: Float32Array = this.data;
		    var pDataDestination: Float32Array = m3fDestination.data;

		    var a11: float = pData[__a11], a12: float = pData[__a12], a13: float = pData[__a13];
		    var a21: float = pData[__a21], a22: float = pData[__a22], a23: float = pData[__a23];
		    var a31: float = pData[__a31], a32: float = pData[__a32], a33: float = pData[__a33];

		    var A11: float = a22 * a33 - a23 * a32;
		    var A12: float = a21 * a33 - a23 * a31;
		    var A13: float = a21 * a32 - a22 * a31;

		    var A21: float = a12 * a33 - a13 * a32;
		    var A22: float = a11 * a33 - a13 * a31;
		    var A23: float = a11 * a32 - a12 * a31;

		    var A31: float = a12 * a23 - a13 * a22;
		    var A32: float = a11 * a23 - a13 * a21;
		    var A33: float = a11 * a22 - a12 * a21;

		    var fDeterminant: float = a11*A11 - a12 * A12 + a13 * A13;

		    if(fDeterminant == 0.){
		        ERROR("обращение матрицы с нулевым детеминантом:\n", 
		                    this.toString());

		        return m3fDestination.set(1.);
		        //чтоб все не навернулось
		    }

		    var fInverseDeterminant: float = 1./fDeterminant;

		    pDataDestination[__a11] = A11 * fInverseDeterminant;
		    pDataDestination[__a12] = -A21 * fInverseDeterminant;
		    pDataDestination[__a13] = A31 * fInverseDeterminant;

		    pDataDestination[__a21] = -A12 * fInverseDeterminant;
		    pDataDestination[__a22] = A22 * fInverseDeterminant;
		    pDataDestination[__a23] = -A32 * fInverseDeterminant;

		    pDataDestination[__a31] = A13 * fInverseDeterminant;
		    pDataDestination[__a32] = -A23 * fInverseDeterminant;
		    pDataDestination[__a33] = A33 * fInverseDeterminant;

		    return m3fDestination;
		};

		isEqual(m3fMat: IMat3, fEps: float = 0.): bool{
			var pData1: Float32Array = this.data;
		    var pData2: Float32Array = m3fMat.data;

		    if(fEps == 0){
		        if(    pData1[__a11] != pData2[__a11]
		            || pData1[__a12] != pData2[__a12]
		            || pData1[__a13] != pData2[__a13]
		            || pData1[__a21] != pData2[__a21]
		            || pData1[__a22] != pData2[__a22]
		            || pData1[__a23] != pData2[__a23]
		            || pData1[__a31] != pData2[__a31]
		            || pData1[__a32] != pData2[__a32]
		            || pData1[__a33] != pData2[__a33]){

		            return false;
		        }
		    }
		    else{
		        if(    Math.abs(pData1[__a11] - pData2[__a11]) > fEps
		            || Math.abs(pData1[__a12] - pData2[__a12]) > fEps
		            || Math.abs(pData1[__a13] - pData2[__a13]) > fEps
		            || Math.abs(pData1[__a21] - pData2[__a21]) > fEps
		            || Math.abs(pData1[__a22] - pData2[__a22]) > fEps
		            || Math.abs(pData1[__a23] - pData2[__a23]) > fEps
		            || Math.abs(pData1[__a31] - pData2[__a31]) > fEps
		            || Math.abs(pData1[__a32] - pData2[__a32]) > fEps
		            || Math.abs(pData1[__a33] - pData2[__a33]) > fEps){

		            return false;
		        }
		    }
		    return true;
		};

		isDiagonal(fEps: float = 0.) : bool{
			var pData: Float32Array = this.data;

		    if(fEps == 0){
		        if(    pData[__a12] != 0 || pData[__a13] != 0
		            || pData[__a21] != 0 || pData[__a23] != 0
		            || pData[__a31] != 0 || pData[__a32] != 0){

		            return false;
		        }
		    }
		    else{
		        if(    Math.abs(pData[__a12]) > fEps || Math.abs(pData[__a13]) > fEps
		            || Math.abs(pData[__a21]) > fEps || Math.abs(pData[__a23]) > fEps
		            || Math.abs(pData[__a31]) > fEps || Math.abs(pData[__a32]) > fEps){

		            return false;
		        }
		    }

		    return true;
		};

		toMat4(m4fDestination?: IMat4): IMat4{
			if(!isDef(m4fDestination)){
		        m4fDestination = new Mat4();
		    }

		    var pData: Float32Array = this.data;
		    var pDataDestination: Float32Array = m4fDestination.data;

		    pDataDestination[__11] = pData[__a11];
		    pDataDestination[__12] = pData[__a12];
		    pDataDestination[__13] = pData[__a13];
		    pDataDestination[__14] = 0;

		    pDataDestination[__21] = pData[__a21];
		    pDataDestination[__22] = pData[__a22];
		    pDataDestination[__23] = pData[__a23];
		    pDataDestination[__24] = 0;

		    pDataDestination[__31] = pData[__a31];
		    pDataDestination[__32] = pData[__a32];
		    pDataDestination[__33] = pData[__a33];
		    pDataDestination[__34] = 0;

		    pDataDestination[__41] = 0;
		    pDataDestination[__42] = 0;
		    pDataDestination[__43] = 0;
		    pDataDestination[__44] = 1;

		    return m4fDestination;
		};

		toQuat4(q4fDestination?: IQuat4): IQuat4{
			if(!isDef(q4fDestination)){
		        q4fDestination = new Quat4();
		    }

		    var pData: Float32Array = this.data;

		    var a11: float = pData[__a11], a12: float = pData[__a12], a13: float = pData[__a13];
		    var a21: float = pData[__a21], a22: float = pData[__a22], a23: float = pData[__a23];
		    var a31: float = pData[__a31], a32: float = pData[__a32], a33: float = pData[__a33];

		    var x2: float = ((a11 - a22 - a33) + 1)/4; /*x^2*/
		    var y2: float = ((a22 - a11 - a33) + 1)/4; /*y^2*/
		    var z2: float = ((a33 - a11 - a22) + 1)/4; /*z^2*/
		    var w2: float = ((a11 + a22 + a33) + 1)/4; /*w^2*/

		    var fMax: float = Math.max(x2,Math.max(y2,Math.max(z2,w2)));

		    if(fMax == x2){
		    	//максимальная компонента берется положительной
		        var x: float = Math.sqrt(x2);

		        q4fDestination.x = x;
		        q4fDestination.y = (a21 + a12)/4/x;
		        q4fDestination.z = (a31 + a13)/4/x;
		        q4fDestination.w = (a32 - a23)/4/x;
		    }
		    else if(fMax == y2){
		    	//максимальная компонента берется положительной
		        var y: float = Math.sqrt(y2); x

		        q4fDestination.x = (a21 + a12)/4/y;
		        q4fDestination.y = y;
		        q4fDestination.z = (a32 + a23)/4/y;
		        q4fDestination.w = (a13 - a31)/4/y;
		    }
		    else if(fMax == z2){
		    	//максимальная компонента берется положительной
		        var z: float = Math.sqrt(z2); 

		        q4fDestination.x = (a31 + a13)/4/z;
		        q4fDestination.y = (a32 + a23)/4/z;
		        q4fDestination.z = z;
		        q4fDestination.w = (a21 - a12)/4/z;
		    }
		    else{
		    	//максимальная компонента берется положительной
		        var w: float = Math.sqrt(w2); 

		        q4fDestination.x = (a32 - a23)/4/w;
		        q4fDestination.y = (a13 - a31)/4/w;
		        q4fDestination.z = (a21 - a12)/4/w;
		        q4fDestination.w = w;
		    }

		    return q4fDestination;
		};

		toString(): string{
			var pData = this.data;
		    return '[' + pData[__a11] + ', ' + pData[__a12] + ', ' + pData[__a13] + ',\n' +
		               + pData[__a21] + ', ' + pData[__a22] + ', ' + pData[__a23] + ',\n' +
		               + pData[__a31] + ', ' + pData[__a32] + ', ' + pData[__a33] + ']';
		};

		decompose(q4fRotation: IQuat4, v3fScale: IVec3): bool{
			//изначально предполагаем, что порядок умножения был rot * scale
			var m3fRotScale: IMat3 = this;
			var m3fRotScaleTransposed: IMat3 = this.transpose(mat3());
			var isRotScale: bool = true; 

		    //понадобятся если порядок умножения был другим
		    var m3fScaleRot: IMat3, m3fScaleRotTransposed: IMat3;

		    //было отражение или нет
    		var scaleSign: int = (m3fRotScale.determinant() >= 0.) ? 1 : -1;

    		var m3fResult: IMat3 = mat3();

    		//first variant rot * scale
		    // (rot * scale)T * (rot * scale) = 
		    // scaleT * rotT * rot * scale = scaleT *rot^-1 * rot * scale = 
		    // scaleT * scale
		    m3fRotScaleTransposed.multiply(m3fRotScale, m3fResult);
		   	if(!m3fResult.isDiagonal(1e-4)){
		   		//предположение было неверным
		   		isRotScale = false;
		        //просто переобозначения чтобы не было путаницы
		        m3fScaleRot = m3fRotScale;
		        m3fScaleRotTransposed = m3fRotScaleTransposed;

		        //second variant scale * rot
		        // (scale * rot) * (scale * rot)T = 
		        // scale * rot * rotT * scaleT = scale *rot * rot^-1 * scaleT = 
		        // scale * scaleT

		        m3fScaleRot.multiply(m3fScaleRotTransposed,m3fResult);
		   	}

		   	var pResultData: Float32Array = m3fResult.data;

		   	var x: float = sqrt(pResultData[__a11]);
		   	var y: float = sqrt(pResultData[__a22])*scaleSign;/*если было отражение, считается что оно было по y*/
		   	var z: float = sqrt(pResultData[__a33]);

		   	v3fScale.x = x;
		   	v3fScale.y = y;
		   	v3fScale.z = z;

		   	var m3fInverseScale: IMat3 = mat3(1./x,1./y,1./z);

		   	if(isRotScale){
		   		m3fRotScale.multiply(m3fInverseScale,mat3()).toQuat4(q4fRotation);
		   		return true;
		   	}
		   	else{
		   		m3fInverseScale.multiply(m3fScaleRot,mat3()).toQuat4(q4fRotation);
		   		debug_assert(false,"порядок умножения scale rot в данный момент не поддерживается");
		   		return false;
		   	}
		};

		row(iRow: int, v3fDestination?: IVec3): IVec3{
			if(!isDef(v3fDestination)){
				v3fDestination = new Vec3();
			}

			var pData: Float32Array = this.data;

			switch(iRow){
				case 1:
					v3fDestination.x = pData[__a11];
					v3fDestination.y = pData[__a12];
					v3fDestination.z = pData[__a13];
					break;
				case 2:
					v3fDestination.x = pData[__a21];
					v3fDestination.y = pData[__a22];
					v3fDestination.z = pData[__a23];
					break;
				case 3:
					v3fDestination.x = pData[__a31];
					v3fDestination.y = pData[__a32];
					v3fDestination.z = pData[__a33];
					break;
			}

			return v3fDestination;
		};

		column(iColumn: int, v3fDestination?: IVec3): IVec3{
			if(!isDef(v3fDestination)){
				v3fDestination = new Vec3();
			}

			var pData: Float32Array = this.data;

			switch(iColumn){
				case 1:
					v3fDestination.x = pData[__a11];
					v3fDestination.y = pData[__a21];
					v3fDestination.z = pData[__a31];
					break;
				case 2:
					v3fDestination.x = pData[__a12];
					v3fDestination.y = pData[__a22];
					v3fDestination.z = pData[__a32];
					break;
				case 3:
					v3fDestination.x = pData[__a13];
					v3fDestination.y = pData[__a23];
					v3fDestination.z = pData[__a33];
					break;
			}

			return v3fDestination;
		};

		static fromYawPitchRoll(fYaw: float, fPitch: float, fRoll: float, m3fDestination?: IMat3): IMat3;
		static fromYawPitchRoll(v3fAngles: IVec3, m3fDestination?: IMat3): IMat3;
		static fromYawPitchRoll(fYaw?,fPitch?,fRoll?,m3fDestination?): IMat3{
			if(arguments.length <= 2){
		        //Vec3 + m3fDestination
		        var v3fVec: IVec3 = arguments[0];

		        fYaw   = v3fVec.x;
		        fPitch = v3fVec.y;
		        fRoll  = v3fVec.z;

		        m3fDestination = arguments[1];
		    }

		    if(!isDef(m3fDestination)){
		        m3fDestination = new Mat3();
		    }

		    var pDataDestination: Float32Array = m3fDestination.data;

		    var fSin1: float = Math.sin(fYaw);
		    var fSin2: float = Math.sin(fPitch);
		    var fSin3: float = Math.sin(fRoll);

		    var fCos1: float = Math.cos(fYaw);
		    var fCos2: float = Math.cos(fPitch);
		    var fCos3: float = Math.cos(fRoll);

		    pDataDestination[__a11] = fCos1 * fCos3 + fSin1 * fSin2 * fSin3;
		    pDataDestination[__a12] = fCos3 * fSin1 * fSin2 - fCos1 * fSin3;
		    pDataDestination[__a13] = fCos2 * fSin1;

		    pDataDestination[__a21] = fCos2 * fSin3;
		    pDataDestination[__a22] = fCos2 * fCos3;
		    pDataDestination[__a23] = -fSin2;

		    pDataDestination[__a31] = fCos1 * fSin2 * fSin3 - fCos3 * fSin1;
		    pDataDestination[__a32] = fSin1 * fSin3 + fCos1 * fCos3 * fSin2;
		    pDataDestination[__a33] = fCos1 * fCos2;

		    return m3fDestination;
		};

		static fromXYZ(fX: float, fY: float, fZ: float, m3fDestination?: IMat3): IMat3;
		static fromXYZ(v3fAngles: IVec3, m3fDestination?: IMat3): IMat3;
		static fromXYZ(fX?, fY?, fZ?, m3fDestination?) : IMat3{
			if(arguments.length <= 2){
				//Vec3 + m3fDestination
				var v3fVec: IVec3 = arguments[0];
				return Mat3.fromYawPitchRoll(v3fVec.y,v3fVec.x,v3fVec.z,arguments[1]);
			}
			else{
				//fX fY fZ m3fDestination
				var fX: float = arguments[0];
				var fY: float = arguments[1];
				var fZ: float = arguments[2];

				return Mat3.fromYawPitchRoll(fY, fX, fZ, arguments[3]);
			}
		};

		ALLOCATE_STORAGE(Mat3,100);
    };
};

#endif