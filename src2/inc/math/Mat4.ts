#ifndef MAT4_TS
#define MAT4_TS

#include "IMat4.ts"
#include "IMat3.ts"
#include "IVec3.ts"
#include "IVec4.ts"
#include "IQuat4.ts"

module akra.math {
    export class Mat4 implements IMat4{
    	data: Float32Array;

		constructor();
		constructor(fValue: float);
		constructor(v4fVec: IVec4);
		constructor(m3fMat: IMat3, v3fTranslation?: IVec3);
		constructor(m4fMat: IMat4);
		constructor(pArray: float[]);
		constructor(pArray: Float32Array, bFlag: bool);
		constructor(fValue1: float, fValue2: float,
				fValue3: float, fValue4: float);
		constructor(v4fVec1: IVec4, v4fVec2: IVec4,
				v4fVec3: IVec4, v4fVec4: IVec4);
		constructor(pArray1: float[], pArray2: float[],
				pArray3: float[], pArray4: float[]);
		constructor(fValue1: float, fValue2: float, fValue3: float, fValue4: float,
				fValue5: float, fValue6: float, fValue7: float, fValue8: float,
				fValue9: float, fValue10: float, fValue11: float, fValue12: float,
				fValue13: float, fValue14: float, fValue15: float, fValue16: float);
		constructor(fValue1?, fValue2?, fValue3?, fValue4?,
					fValue5?, fValue6?, fValue7?, fValue8?,
					fValue9?, fValue10?, fValue11?, fValue12?,
					fValue13?, fValue14?, fValue15?, fValue16?){

			var nArgumentsLength: uint = arguments.length;

			if(nArgumentsLength === 2){
				if(isBoolean(arguments[1])){
					if(arguments[1]){
						this.data = arguments[0];
					}
					else{
						this.data = new Float32Array(16);
						this.set(arguments[0]);			
					}
				}
				else{
					this.data = new Float32Array(16);
					this.set(arguments[0], arguments[1]);
				}
			}
			else{
				this.data = new Float32Array(16);

				if(nArgumentsLength === 1){
					if(arguments[0] instanceof Mat3){
						this.set(arguments[0],vec3(0.));	
					}
					else{
						this.set(arguments[0]);	
					}
				}
				else if(nArgumentsLength === 4){
					this.set(arguments[0],arguments[1],arguments[2],arguments[3]);
				}
				else if(nArgumentsLength === 16){
					this.set(arguments[0], arguments[1], arguments[2], arguments[3],
							 arguments[4], arguments[5], arguments[6], arguments[7],
							 arguments[8], arguments[9], arguments[10], arguments[11],
							 arguments[12], arguments[13], arguments[14], arguments[15]);
				}
			}
		};

		set(): IMat4;
		set(fValue: float): IMat4;
		set(v4fVec: IVec4): IMat4;
		set(m3fMat: IMat3, v3fTranslation?: IVec3): IMat4;
		set(m4fMat: IMat4): IMat4;
		set(pArray: float[]): IMat4;
		set(fValue1: float, fValue2: float,
			fValue3: float, fValue4: float): IMat4;
		set(v4fVec1: IVec4, v4fVec2: IVec4,
			v4fVec3: IVec4, v4fVec4: IVec4): IMat4;
		set(pArray1: float[], pArray2: float[],
			pArray3: float[], pArray4: float[]): IMat4;
		set(fValue1: float, fValue2: float, fValue3: float, fValue4: float,
			fValue5: float, fValue6: float, fValue7: float, fValue8: float,
			fValue9: float, fValue10: float, fValue11: float, fValue12: float,
			fValue13: float, fValue14: float, fValue15: float, fValue16: float): IMat4;
		set(fValue1?, fValue2?, fValue3?, fValue4?,
			fValue5?, fValue6?, fValue7?, fValue8?,
			fValue9?, fValue10?, fValue11?, fValue12?,
			fValue13?, fValue14?, fValue15?, fValue16?): IMat4{

			var nArgumentsLength: uint = arguments.length;
			var pData: Float32Array = this.data;

			if(nArgumentsLength === 0){
				pData[__11] = pData[__12] = pData[__13] = pData[__14] = 
				pData[__21] = pData[__22] = pData[__23] = pData[__24] = 
				pData[__31] = pData[__32] = pData[__33] = pData[__34] = 
				pData[__41] = pData[__42] = pData[__43] = pData[__44] = 0.;

				return this;
			}

			if(nArgumentsLength === 1){
				if(isFloat(arguments[0])){
					var fValue: float = arguments[0];

					pData[__11] = fValue;
					pData[__12] = 0.;
					pData[__13] = 0.;
					pData[__14] = 0.;

					pData[__21] = 0.;
					pData[__22] = fValue;
					pData[__23] = 0.;
					pData[__24] = 0.;

					pData[__31] = 0.;
					pData[__32] = 0.;
					pData[__33] = fValue;
					pData[__34] = 0.;

					pData[__41] = 0.;
					pData[__42] = 0.;
					pData[__43] = 0.
					pData[__44] = fValue;
				}
				else if(arguments[0] instanceof Vec4){
					var v4fVec = arguments[0];

					pData[__11] = v4fVec.x;
					pData[__12] = 0.;
					pData[__13] = 0.;
					pData[__14] = 0.;

					pData[__21] = 0.;
					pData[__22] = v4fVec.y;
					pData[__23] = 0.;
					pData[__24] = 0.;

					pData[__31] = 0.;
					pData[__32] = 0.;
					pData[__33] = v4fVec.z;
					pData[__34] = 0.;

					pData[__41] = 0.;
					pData[__42] = 0.;
					pData[__43] = 0.
					pData[__44] = v4fVec.w;	
				}
				else if(isDef(arguments[0].data)){
					var pMatrixData: Float32Array = arguments[0].data;
					if(pMatrixData.length == 16){
						//Mat4
						pData.set(pMatrixData);
					}
					else{
						//Mat3
						pData[__11] = pMatrixData[__a11];
						pData[__12] = pMatrixData[__a12];
						pData[__13] = pMatrixData[__a13];

						pData[__21] = pMatrixData[__a21];
						pData[__22] = pMatrixData[__a22];
						pData[__23] = pMatrixData[__a23];

						pData[__31] = pMatrixData[__a31];
						pData[__32] = pMatrixData[__a32];
						pData[__33] = pMatrixData[__a33];

						pData[__41] = 0.;
						pData[__42] = 0.;
						pData[__43] = 0.;
						pData[__44] = 1.;
					}
				}
				else{
					//array
					var pArray: float[] = arguments[0];

					if(pArray.length === 4){
						pData[__11] = pArray[0];
						pData[__12] = 0.;
						pData[__13] = 0.;
						pData[__14] = 0.;

						pData[__21] = 0.;
						pData[__22] = pArray[1];
						pData[__23] = 0.;
						pData[__24] = 0.;

						pData[__31] = 0.;
						pData[__32] = 0.;
						pData[__33] = pArray[2];
						pData[__34] = 0.;

						pData[__41] = 0.;
						pData[__42] = 0.;
						pData[__43] = 0.
						pData[__44] = pArray[3];	
					}
					else{
						//length == 16
						
						pData[__11] = pArray[__11];
						pData[__12] = pArray[__12];
						pData[__13] = pArray[__13];
						pData[__14] = pArray[__14];

						pData[__21] = pArray[__21];
						pData[__22] = pArray[__22];
						pData[__23] = pArray[__23];
						pData[__24] = pArray[__24];

						pData[__31] = pArray[__31];
						pData[__32] = pArray[__32];
						pData[__33] = pArray[__33];
						pData[__34] = pArray[__34];

						pData[__41] = pArray[__41];
						pData[__42] = pArray[__42];
						pData[__43] = pArray[__43];
						pData[__44] = pArray[__44];	
					}
				}
			}
			else if(nArgumentsLength == 2){
				var pMatrixData: Float32Array = arguments[0];
				var v3fTranslation : IVec3 = arguments[1];

				pData[__11] = pMatrixData[__a11];
				pData[__12] = pMatrixData[__a12];
				pData[__13] = pMatrixData[__a13];
				pData[__14] = v3fTranslation.x;

				pData[__21] = pMatrixData[__a21];
				pData[__22] = pMatrixData[__a22];
				pData[__23] = pMatrixData[__a23];
				pData[__24] = v3fTranslation.y;

				pData[__31] = pMatrixData[__a31];
				pData[__32] = pMatrixData[__a32];
				pData[__33] = pMatrixData[__a33];
				pData[__34] = v3fTranslation.z;

				pData[__41] = 0.;
				pData[__42] = 0.;
				pData[__43] = 0.;
				pData[__44] = 1.;

			}
			else if(nArgumentsLength == 4){
				if(isFloat(arguments[0])){

					pData[__11] = arguments[0];
					pData[__12] = 0;
					pData[__13] = 0;
					pData[__14] = 0;

					pData[__21] = 0;
					pData[__22] = arguments[1];
					pData[__23] = 0;
					pData[__24] = 0;

					pData[__31] = 0;
					pData[__32] = 0;
					pData[__33] = arguments[2];
					pData[__34] = 0;

					pData[__41] = 0;
					pData[__42] = 0;
					pData[__43] = 0;
					pData[__44] = arguments[3];
				}
				else if(arguments[0] instanceof Vec4){

					var v4fColumn1: IVec4 = arguments[0];
					var v4fColumn2: IVec4 = arguments[1];
					var v4fColumn3: IVec4 = arguments[2];
					var v4fColumn4: IVec4 = arguments[3];

					pData[__11] = v4fColumn1.x;
					pData[__12] = v4fColumn2.x;
					pData[__13] = v4fColumn3.x;
					pData[__14] = v4fColumn4.x;

					pData[__21] = v4fColumn1.y;
					pData[__22] = v4fColumn2.y;
					pData[__23] = v4fColumn3.y;
					pData[__24] = v4fColumn4.y;

					pData[__31] = v4fColumn1.z;
					pData[__32] = v4fColumn2.z;
					pData[__33] = v4fColumn3.z;
					pData[__34] = v4fColumn4.z;

					pData[__41] = v4fColumn1.w;
					pData[__42] = v4fColumn2.w;
					pData[__43] = v4fColumn3.w;
					pData[__44] = v4fColumn4.w;
				}
				else{
					//arrays
					
					var v4fColumn1: float[] = arguments[0];
					var v4fColumn2: float[] = arguments[1];
					var v4fColumn3: float[] = arguments[2];
					var v4fColumn4: float[] = arguments[3];

					pData[__11] = v4fColumn1[0];
					pData[__12] = v4fColumn2[0];
					pData[__13] = v4fColumn3[0];
					pData[__14] = v4fColumn4[0];

					pData[__21] = v4fColumn1[1];
					pData[__22] = v4fColumn2[1];
					pData[__23] = v4fColumn3[1];
					pData[__24] = v4fColumn4[1];

					pData[__31] = v4fColumn1[2];
					pData[__32] = v4fColumn2[2];
					pData[__33] = v4fColumn3[2];
					pData[__34] = v4fColumn4[2];

					pData[__41] = v4fColumn1[3];
					pData[__42] = v4fColumn2[3];
					pData[__43] = v4fColumn3[3];
					pData[__44] = v4fColumn4[3];

				}
			}
			else{
				//nArgumentsLength === 16
				
				pData[__11] = arguments[__11];
				pData[__12] = arguments[__12];
				pData[__13] = arguments[__13];
				pData[__14] = arguments[__14];

				pData[__21] = arguments[__21];
				pData[__22] = arguments[__22];
				pData[__23] = arguments[__23];
				pData[__24] = arguments[__24];

				pData[__31] = arguments[__31];
				pData[__32] = arguments[__32];
				pData[__33] = arguments[__33];
				pData[__34] = arguments[__34];

				pData[__41] = arguments[__41];
				pData[__42] = arguments[__42];
				pData[__43] = arguments[__43];
				pData[__44] = arguments[__44];				
			}
			return this;
		};

		identity() : IMat4{
			var pData: Float32Array = this.data;

			pData[__11] = 1.;
			pData[__12] = 0.;
			pData[__13] = 0.;
			pData[__14] = 0.;

			pData[__21] = 0.;
			pData[__22] = 1.;
			pData[__23] = 0.;
			pData[__24] = 0.;

			pData[__31] = 0.;
			pData[__32] = 0.;
			pData[__33] = 1.;
			pData[__34] = 0.;

			pData[__41] = 0.;
			pData[__42] = 0.;
			pData[__43] = 0.;
			pData[__44] = 1.;

			return this;
		};

		add(m4fMat: IMat4, m4fDestination?: IMat4): IMat4{
			if(!isDef(m4fDestination)){
				m4fDestination = this;
			}

			var pData1: Float32Array = this.data;
			var pData2: Float32Array = m4fMat.data;
			var pDataDestination: Float32Array = m4fDestination.data;

			pDataDestination[__11] = pData1[__11] + pData2[__11];
			pDataDestination[__12] = pData1[__12] + pData2[__12];
			pDataDestination[__13] = pData1[__13] + pData2[__13];
			pDataDestination[__14] = pData1[__14] + pData2[__14];

			pDataDestination[__21] = pData1[__21] + pData2[__21];
			pDataDestination[__22] = pData1[__22] + pData2[__22];
			pDataDestination[__23] = pData1[__23] + pData2[__23];
			pDataDestination[__24] = pData1[__24] + pData2[__24];

			pDataDestination[__31] = pData1[__31] + pData2[__31];
			pDataDestination[__32] = pData1[__32] + pData2[__32];
			pDataDestination[__33] = pData1[__33] + pData2[__33];
			pDataDestination[__34] = pData1[__34] + pData2[__34];

			pDataDestination[__41] = pData1[__41] + pData2[__41];
			pDataDestination[__42] = pData1[__42] + pData2[__42];
			pDataDestination[__43] = pData1[__43] + pData2[__43];
			pDataDestination[__44] = pData1[__44] + pData2[__44];

			return m4fDestination;
		};

		subtract(m4fMat: IMat4, m4fDestination?: IMat4): IMat4{
			if(!isDef(m4fDestination)){
				m4fDestination = this;
			}

			var pData1: Float32Array = this.data;
			var pData2: Float32Array = m4fMat.data;
			var pDataDestination: Float32Array = m4fDestination.data;

			pDataDestination[__11] = pData1[__11] - pData2[__11];
			pDataDestination[__12] = pData1[__12] - pData2[__12];
			pDataDestination[__13] = pData1[__13] - pData2[__13];
			pDataDestination[__14] = pData1[__14] - pData2[__14];

			pDataDestination[__21] = pData1[__21] - pData2[__21];
			pDataDestination[__22] = pData1[__22] - pData2[__22];
			pDataDestination[__23] = pData1[__23] - pData2[__23];
			pDataDestination[__24] = pData1[__24] - pData2[__24];

			pDataDestination[__31] = pData1[__31] - pData2[__31];
			pDataDestination[__32] = pData1[__32] - pData2[__32];
			pDataDestination[__33] = pData1[__33] - pData2[__33];
			pDataDestination[__34] = pData1[__34] - pData2[__34];

			pDataDestination[__41] = pData1[__41] - pData2[__41];
			pDataDestination[__42] = pData1[__42] - pData2[__42];
			pDataDestination[__43] = pData1[__43] - pData2[__43];
			pDataDestination[__44] = pData1[__44] - pData2[__44];

			return m4fDestination;	
		};

		multiply(m4fMat: IMat4, m4fDestination?: IMat4): IMat4{
			if(!isDef(m4fDestination)){
	            m4fDestination = this;
	        }

			var pData1: Float32Array = this.data;
		    var pData2: Float32Array = m4fMat.data;
	        var pDataDestination: Float32Array = m4fDestination.data;

	        //кешируем значения матриц для ускорения
	        
	        var a11: float = pData1[__11], a12: float = pData1[__12], a13: float = pData1[__13], a14: float = pData1[__14];
	        var a21: float = pData1[__21], a22: float = pData1[__22], a23: float = pData1[__23], a24: float = pData1[__24];
	        var a31: float = pData1[__31], a32: float = pData1[__32], a33: float = pData1[__33], a34: float = pData1[__34];
	        var a41: float = pData1[__41], a42: float = pData1[__42], a43: float = pData1[__43], a44: float = pData1[__44];

	        var b11: float = pData2[__11], b12: float = pData2[__12], b13: float = pData2[__13], b14: float = pData2[__14];
	        var b21: float = pData2[__21], b22: float = pData2[__22], b23: float = pData2[__23], b24: float = pData2[__24];
	        var b31: float = pData2[__31], b32: float = pData2[__32], b33: float = pData2[__33], b34: float = pData2[__34];
	        var b41: float = pData2[__41], b42: float = pData2[__42], b43: float = pData2[__43], b44: float = pData2[__44];

	        pDataDestination[__11] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
	        pDataDestination[__12] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
	        pDataDestination[__13] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
	        pDataDestination[__14] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

	        pDataDestination[__21] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
	        pDataDestination[__22] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
	        pDataDestination[__23] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
	        pDataDestination[__24] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

	        pDataDestination[__31] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
	        pDataDestination[__32] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
	        pDataDestination[__33] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
	        pDataDestination[__34] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

	        pDataDestination[__41] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
	        pDataDestination[__42] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
	        pDataDestination[__43] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
	        pDataDestination[__44] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		    return m4fDestination;
		};

		inline multiplyLeft(m4fMat: IMat4, m4fDestination?: IMat4): IMat4{
			if(!isDef(m4fDestination)){
				m4fDestination = this;
			}
			return m4fMat.multiply(this,m4fDestination);
		};

		multiplyVec4(v4fVec: IVec4, v4fDestination?: IVec4): IVec4{
			if(!isDef(v4fDestination)){
				v4fDestination = new Vec4();
			}

			var pData: Float32Array = this.data;

			var x: float = v4fVec.x, y: float = v4fVec.y, z: float = v4fVec.z, w: float = v4fVec.w;

			v4fDestination.x = pData[__11]*x + pData[__12]*y + pData[__13]*z + pData[__14]*w;
	        v4fDestination.y = pData[__21]*x + pData[__22]*y + pData[__23]*z + pData[__24]*w;
	        v4fDestination.z = pData[__31]*x + pData[__32]*y + pData[__33]*z + pData[__34]*w;
	        v4fDestination.w = pData[__41]*x + pData[__42]*y + pData[__43]*z + pData[__44]*w;

	        return v4fDestination;
		};

		transpose(m4fDestination?: IMat4): IMat4{

			var pData = this.data;

		    if(!isDef(m4fDestination)){
		        var a12: float = pData[__12], a13: float = pData[__13], a14: float = pData[__14];
		        var a23: float = pData[__23], a24: float = pData[__24];
		        var a34: float = pData[__34];

		        pData[__12] = pData[__21];
		        pData[__13] = pData[__31];
		        pData[__14] = pData[__41];

		        pData[__21] = a12;
		        pData[__23] = pData[__32];
		        pData[__24] = pData[__42];

		        pData[__31] = a13;
		        pData[__32] = a23;
		        pData[__34] = pData[__43];

		        pData[__41] = a14;
		        pData[__42] = a24;
		        pData[__43] = a34;

		        return this;
		    }

		    var pDataDestination = m4fDestination.data;

		    pDataDestination[__11] = pData[__11];
		    pDataDestination[__12] = pData[__21];
		    pDataDestination[__13] = pData[__31];
		    pDataDestination[__14] = pData[__41];

		    pDataDestination[__21] = pData[__12];
		    pDataDestination[__22] = pData[__22];
		    pDataDestination[__23] = pData[__32];
		    pDataDestination[__24] = pData[__42];

		    pDataDestination[__31] = pData[__13];
		    pDataDestination[__32] = pData[__23];
		    pDataDestination[__33] = pData[__33];
		    pDataDestination[__34] = pData[__43];

		    pDataDestination[__41] = pData[__14];
		    pDataDestination[__42] = pData[__24];
		    pDataDestination[__43] = pData[__34];
		    pDataDestination[__44] = pData[__44];

		    return m4fDestination;
		};

		determinant(): float{
			var pData = this.data; 

		    var a11: float = pData[__11], a12: float = pData[__12], a13: float = pData[__13], a14: float = pData[__14];
		    var a21: float = pData[__21], a22: float = pData[__22], a23: float = pData[__23], a24: float = pData[__24];
		    var a31: float = pData[__31], a32: float = pData[__32], a33: float = pData[__33], a34: float = pData[__34];
		    var a41: float = pData[__41], a42: float = pData[__42], a43: float = pData[__43], a44: float = pData[__44];

		    return  a41*a32*a23*a14 - a31*a42*a23*a14 - a41*a22*a33*a14 + a21*a42*a33*a14 +
			        a31*a22*a43*a14 - a21*a32*a43*a14 - a41*a32*a13*a24 + a31*a42*a13*a24 +
			        a41*a12*a33*a24 - a11*a42*a33*a24 - a31*a12*a43*a24 + a11*a32*a43*a24 +
			        a41*a22*a13*a34 - a21*a42*a13*a34 - a41*a12*a23*a34 + a11*a42*a23*a34 +
			        a21*a12*a43*a34 - a11*a22*a43*a34 - a31*a22*a13*a44 + a21*a32*a13*a44 +
			        a31*a12*a23*a44 - a11*a32*a23*a44 - a21*a12*a33*a44 + a11*a22*a33*a44;
		};

		inverse(m4fDestination?: IMat4): IMat4{
			if(!isDef(m4fDestination)){
		        m4fDestination = this;
		    }

		    var pData: Float32Array = this.data;
		    var pDataDestination: Float32Array = m4fDestination.data;

		    // Cache the matrix values (makes for huge speed increases!)
		    var a11: float = pData[__11], a12: float = pData[__12], a13: float = pData[__13], a14: float = pData[__14];
		    var a21: float = pData[__21], a22: float = pData[__22], a23: float = pData[__23], a24: float = pData[__24];
		    var a31: float = pData[__31], a32: float = pData[__32], a33: float = pData[__33], a34: float = pData[__34];
		    var a41: float = pData[__41], a42: float = pData[__42], a43: float = pData[__43], a44: float = pData[__44];

		    var b00: float = a11*a22 - a12*a21;
		    var b01: float = a11*a23 - a13*a21;
		    var b02: float = a11*a24 - a14*a21;
		    var b03: float = a12*a23 - a13*a22;
		    var b04: float = a12*a24 - a14*a22;
		    var b05: float = a13*a24 - a14*a23;
		    var b06: float = a31*a42 - a32*a41;
		    var b07: float = a31*a43 - a33*a41;
		    var b08: float = a31*a44 - a34*a41;
		    var b09: float = a32*a43 - a33*a42;
		    var b10: float = a32*a44 - a34*a42;
		    var b11: float = a33*a44 - a34*a43;

		    var fDeterminant: float = b00*b11 - b01*b10 + b02*b09 + b03*b08 - b04*b07 + b05*b06;

		    if(fDeterminant === 0.){
		        debug_assert(false,"обращение матрицы с нулевым детеминантом:\n" 
		                        + this.toString());

		        return m4fDestination.set(1.); //чтоб все не навернулось
		    }

		    var fInverseDeterminant: float = 1/fDeterminant;

		    pDataDestination[__11] = (a22 * b11 - a23 * b10 + a24 * b09) * fInverseDeterminant;
		    pDataDestination[__12] = (-a12 * b11 + a13 * b10 - a14 * b09) * fInverseDeterminant;
		    pDataDestination[__13] = (a42 * b05 - a43 * b04 + a44 * b03) * fInverseDeterminant;
		    pDataDestination[__14] = (-a32 * b05 + a33 * b04 - a34 * b03) * fInverseDeterminant;

		    pDataDestination[__21] = (-a21 * b11 + a23 * b08 - a24 * b07) * fInverseDeterminant;
		    pDataDestination[__22] = (a11 * b11 - a13 * b08 + a14 * b07) * fInverseDeterminant;
		    pDataDestination[__23] = (-a41 * b05 + a43 * b02 - a44 * b01) * fInverseDeterminant;
		    pDataDestination[__24] = (a31 * b05 - a33 * b02 + a34 * b01) * fInverseDeterminant;

		    pDataDestination[__31] = (a21 * b10 - a22 * b08 + a24 * b06) * fInverseDeterminant;
		    pDataDestination[__32] = (-a11 * b10 + a12 * b08 - a14 * b06) * fInverseDeterminant;
		    pDataDestination[__33] = (a41 * b04 - a42 * b02 + a44 * b00) * fInverseDeterminant;
		    pDataDestination[__34] = (-a31 * b04 + a32 * b02 - a34 * b00) * fInverseDeterminant;

		    pDataDestination[__41] = (-a21 * b09 + a22 * b07 - a23 * b06) * fInverseDeterminant;
		    pDataDestination[__42] = (a11 * b09 - a12 * b07 + a13 * b06) * fInverseDeterminant;
		    pDataDestination[__43] = (-a41 * b03 + a42 * b01 - a43 * b00) * fInverseDeterminant;
		    pDataDestination[__44] = (a31 * b03 - a32 * b01 + a33 * b00) * fInverseDeterminant;

		    return m4fDestination;
		};

		inline trace(): float{
			var pData: Float32Array = this.data;
			return pData[__11] + pData[__22] + pData[__33] + pData[__44];
		};

		isEqual(m4fMat: IMat4, fEps: float = 0.): bool{
		    var pData1: Float32Array = this.data;
		    var pData2: Float32Array = m4fMat.data;

		    if(fEps === 0.){
		        if(    pData1[__11] != pData2[__11] 
		            || pData1[__12] != pData2[__12]
		            || pData1[__13] != pData2[__13]
		            || pData1[__14] != pData2[__14]
		            || pData1[__21] != pData2[__21]
		            || pData1[__22] != pData2[__22]
		            || pData1[__23] != pData2[__23]
		            || pData1[__24] != pData2[__24]
		            || pData1[__31] != pData2[__31]
		            || pData1[__32] != pData2[__32]
		            || pData1[__33] != pData2[__33]
		            || pData1[__34] != pData2[__34]
		            || pData1[__41] != pData2[__41]
		            || pData1[__42] != pData2[__42]
		            || pData1[__43] != pData2[__43]
		            || pData1[__44] != pData2[__44]){

		            return false;
		        }
		    }
		    else{
		        if(    abs(pData1[__11] - pData2[__11]) > fEps
		            || abs(pData1[__12] - pData2[__12]) > fEps
		            || abs(pData1[__13] - pData2[__13]) > fEps
		            || abs(pData1[__14] - pData2[__14]) > fEps
		            || abs(pData1[__21] - pData2[__21]) > fEps
		            || abs(pData1[__22] - pData2[__22]) > fEps
		            || abs(pData1[__23] - pData2[__23]) > fEps
		            || abs(pData1[__24] - pData2[__24]) > fEps
		            || abs(pData1[__31] - pData2[__31]) > fEps
		            || abs(pData1[__32] - pData2[__32]) > fEps
		            || abs(pData1[__33] - pData2[__33]) > fEps
		            || abs(pData1[__34] - pData2[__34]) > fEps
		            || abs(pData1[__41] - pData2[__41]) > fEps
		            || abs(pData1[__42] - pData2[__42]) > fEps
		            || abs(pData1[__43] - pData2[__43]) > fEps
		            || abs(pData1[__44] - pData2[__44]) > fEps){

		            return false;
		        }
		    }
		    return true;
		};

		isDiagonal(fEps: float = 0.): bool{
			var pData: Float32Array = this.data;

		    if(fEps === 0.){
		        if(    pData[__12] !== 0. || pData[__13] !== 0. || pData[__14] != 0. 
		            || pData[__21] !== 0. || pData[__23] !== 0. || pData[__24] != 0.
		            || pData[__31] !== 0. || pData[__32] !== 0. || pData[__34] != 0.
		            || pData[__41] !== 0. || pData[__42] !== 0. || pData[__43] != 0.){

		            return false;
		        }
		    }
		    else{
		        if(    abs(pData[__12]) > fEps || abs(pData[__13]) > fEps || abs(pData[__14]) > fEps
		            || abs(pData[__21]) > fEps || abs(pData[__23]) > fEps || abs(pData[__24]) > fEps
		            || abs(pData[__31]) > fEps || abs(pData[__32]) > fEps || abs(pData[__34]) > fEps
		            || abs(pData[__41]) > fEps || abs(pData[__42]) > fEps || abs(pData[__43]) > fEps){

		            return false;
		        }
		    }
		    return true;
		};

		toMat3(m3fDestination?: IMat3): IMat3{
			if(!isDef(m3fDestination)){
		        m3fDestination = new Mat3();
		    }

		    var pData: Float32Array = this.data;
		    var pDataDestination: Float32Array = m3fDestination.data;

		    pDataDestination[__a11] = pData[__11];
		    pDataDestination[__a12] = pData[__12];
		    pDataDestination[__a13] = pData[__13];

		    pDataDestination[__a21] = pData[__21];
		    pDataDestination[__a22] = pData[__22];
		    pDataDestination[__a23] = pData[__23];

		    pDataDestination[__a31] = pData[__31];
		    pDataDestination[__a32] = pData[__32];
		    pDataDestination[__a33] = pData[__33];

		    return m3fDestination;
		};

		toQuat4(q4fDestination?: IQuat4){
			if(!isDef(q4fDestination)){
				q4fDestination = new Quat4();
			}

			var pData: Float32Array = this.data;

		    var a11: float = pData[__11], a12: float = pData[__12], a13: float = pData[__13];
		    var a21: float = pData[__21], a22: float = pData[__22], a23: float = pData[__23];
		    var a31: float = pData[__31], a32: float = pData[__32], a33: float = pData[__33];

		    var x2: float = ((a11 - a22 - a33) + 1.)/4.; /*x^2*/
		    var y2: float = ((a22 - a11 - a33) + 1.)/4.; /*y^2*/
		    var z2: float = ((a33 - a11 - a22) + 1.)/4.; /*z^2*/
		    var w2: float = ((a11 + a22 + a33) + 1.)/4.; /*w^2*/

		    var fMax: float = max(x2,max(y2,max(z2,w2)));

		    if(fMax == x2){
		    	//максимальная компонента берется положительной
		        var x: float = sqrt(x2); 

		        q4fDestination.x = x;
		        q4fDestination.y = (a21 + a12)/4./x;
		        q4fDestination.z = (a31 + a13)/4./x;
		        q4fDestination.w = (a32 - a23)/4./x;
		    }
		    else if(fMax == y2){
		    	//максимальная компонента берется положительной
		        var y: float = sqrt(y2); 

		        q4fDestination.x = (a21 + a12)/4./y;
		        q4fDestination.y = y;
		        q4fDestination.z = (a32 + a23)/4./y;
		        q4fDestination.w = (a13 - a31)/4./y;
		    }
		    else if(fMax == z2){
		    	//максимальная компонента берется положительной
		        var z: float = sqrt(z2); 

		        q4fDestination.x = (a31 + a13)/4./z;
		        q4fDestination.y = (a32 + a23)/4./z;
		        q4fDestination.z = z;
		        q4fDestination.w = (a21 - a12)/4./z;
		    }
		    else{
		    	//максимальная компонента берется положительной
		        var w: float = sqrt(w2); 

		        q4fDestination.x = (a32 - a23)/4./w;
		        q4fDestination.y = (a13 - a31)/4./w;
		        q4fDestination.z = (a21 - a12)/4./w;
		        q4fDestination.w = w;
		    }

		    return q4fDestination;
		};

		toRotationMatrix(m4fDestination?: IMat4): IMat4{
			if(!isDef(m4fDestination)){
		        m4fDestination = new Mat4();
		    }

		    var pData: Float32Array = this.data;
		    var pDataDestination: Float32Array = m4fDestination.data;

		    pDataDestination[__11] = pData[__11];
		    pDataDestination[__12] = pData[__12];
		    pDataDestination[__13] = pData[__13];
		    pDataDestination[__14] = 0.;

		    pDataDestination[__21] = pData[__21];
		    pDataDestination[__22] = pData[__22];
		    pDataDestination[__23] = pData[__23];
		    pDataDestination[__24] = 0.;

		    pDataDestination[__31] = pData[__31];
		    pDataDestination[__32] = pData[__32];
		    pDataDestination[__33] = pData[__33];
		    pDataDestination[__34] = 0.;

		    pDataDestination[__41] = 0.;
		    pDataDestination[__42] = 0.;
		    pDataDestination[__43] = 0.;
		    pDataDestination[__44] = 1.;

		    return m4fDestination;
		};

		toString(): string{
			var pData: Float32Array = this.data;

		    return '['  + pData[__11] + ", " + pData[__12] + ', ' + pData[__13] + ', ' + pData[__14] + ',\n' 
		                + pData[__21] + ", " + pData[__22] + ', ' + pData[__23] + ', ' + pData[__24] + ',\n'
		                + pData[__31] + ", " + pData[__32] + ', ' + pData[__33] + ', ' + pData[__34] + ',\n'
		                + pData[__41] + ", " + pData[__42] + ', ' + pData[__43] + ', ' + pData[__44]+ ']';
		};

		rotateRight(fAngle: float, v3fAxis: IVec3, m4fDestination?: IMat4): IMat4{
			var pData: Float32Array = this.data;

		    var x: float = v3fAxis.x, y: float = v3fAxis.y, z: float = v3fAxis.z;
		    var fLength: float = Math.sqrt(x*x + y*y + z*z);

		    if(fLength === 0.){
		    	debug_assert(false,"попытка вращения вокруг оси нулевой длины. Угол " + fAngle + ". Ось " + v3fAxis.toString());
		    	if(isDef(m4fDestination)){
		    		m4fDestination.set(this);
		    	}
		    	else{
		    		m4fDestination = this;	
		    	}
		    	return m4fDestination;
		    }

		    var fInvLength: float = 1./fLength;

		    x*=fInvLength;
		    y*=fInvLength;
		    z*=fInvLength;

		    var a11: float = pData[__11], a12: float = pData[__12], a13: float = pData[__13];
		    var a21: float = pData[__21], a22: float = pData[__22], a23: float = pData[__23];
		    var a31: float = pData[__31], a32: float = pData[__32], a33: float = pData[__33];

		    var fSin: float = sin(fAngle);
		    var fCos: float = cos(fAngle);
		    var fTmp: float = 1. - fCos;

		    //build Rotation matrix
		    
		    var b11: float = fCos + fTmp*x*x, b12: float = fTmp*x*y - fSin*z, b13: float = fTmp*x*z + fSin*y;
		    var b21: float = fTmp*y*z + fSin*z, b22: float = fCos + fTmp*y*y, b23: float = fTmp*y*z - fSin*x;
		    var b31: float = fTmp*z*x - fSin*y, b32: float = fTmp*z*y + fSin*x, b33: float = fCos + fTmp*z*z;

		    if(!isDef(m4fDestination)){
		        pData[__11] = a11*b11 + a12*b21 + a13*b31;
		        pData[__12] = a11*b12 + a12*b22 + a13*b32;
		        pData[__13] = a11*b13 + a12*b23 + a13*b33;

		        pData[__21] = a21*b11 + a22*b21 + a23*b31;
		        pData[__22] = a21*b12 + a22*b22 + a23*b32;
		        pData[__23] = a21*b13 + a22*b23 + a23*b33;

		        pData[__31] = a31*b11 + a32*b21 + a33*b31;
		        pData[__32] = a31*b12 + a32*b22 + a33*b32;
		        pData[__33] = a31*b13 + a32*b23 + a33*b33;

		        return this;
		    }

		    var pDataDestination: Float32Array = m4fDestination.data;

		    pDataDestination[__11] = a11*b11 + a12*b21 + a13*b31;
		    pDataDestination[__12] = a11*b12 + a12*b22 + a13*b32;
		    pDataDestination[__13] = a11*b13 + a12*b23 + a13*b33;
		    pDataDestination[__14] = pData[__14];

		    pDataDestination[__21] = a21*b11 + a22*b21 + a23*b31;
		    pDataDestination[__22] = a21*b12 + a22*b22 + a23*b32;
		    pDataDestination[__23] = a21*b13 + a22*b23 + a23*b33;
		    pDataDestination[__24] = pData[__24];

		    pDataDestination[__31] = a31*b11 + a32*b21 + a33*b31;
		    pDataDestination[__32] = a31*b12 + a32*b22 + a33*b32;
		    pDataDestination[__33] = a31*b13 + a32*b23 + a33*b33;
		    pDataDestination[__34] = pData[__34];

		    pDataDestination[__41] = pData[__41];
		    pDataDestination[__42] = pData[__42];
		    pDataDestination[__43] = pData[__43];
		    pDataDestination[__44] = pData[__44];

		    return m4fDestination;
		};

		rotateLeft(fAngle: float, v3fAxis: IVec3, m4fDestination?: IMat4): IMat4{
			var pData: Float32Array = this.data;

		    var x: float = v3fAxis.x, y: float = v3fAxis.y, z: float = v3fAxis.z;
		    var fLength: float = Math.sqrt(x*x + y*y + z*z);

		    if(fLength === 0.){
		    	debug_assert(false,"попытка вращения вокруг оси нулевой длины. Угол " + fAngle + ". Ось " + v3fAxis.toString());
		    	if(isDef(m4fDestination)){
		    		m4fDestination.set(this);
		    	}
		    	else{
		    		m4fDestination = this;	
		    	}
		    	return m4fDestination;
		    }

		    var fInvLength: float = 1./fLength;

		    x*=fInvLength;
		    y*=fInvLength;
		    z*=fInvLength;

		    var a11: float = pData[__11], a12: float = pData[__12], a13: float = pData[__13], a14: float = pData[__14];
		    var a21: float = pData[__21], a22: float = pData[__22], a23: float = pData[__23], a24: float = pData[__24];
		    var a31: float = pData[__31], a32: float = pData[__32], a33: float = pData[__33], a34: float = pData[__34];

		    var fSin: float = sin(fAngle);
		    var fCos: float = cos(fAngle);
		    var fTmp: float = 1. - fCos;

		    //build Rotation matrix
		    
		    var b11: float = fCos + fTmp*x*x, b12: float = fTmp*x*y - fSin*z, b13: float = fTmp*x*z + fSin*y;
		    var b21: float = fTmp*y*z + fSin*z, b22: float = fCos + fTmp*y*y, b23: float = fTmp*y*z - fSin*x;
		    var b31: float = fTmp*z*x - fSin*y, b32: float = fTmp*z*y + fSin*x, b33: float = fCos + fTmp*z*z;

		    if(!isDef(m4fDestination)){
		        pData[__11] = b11*a11 + b12*a21 + b13*a31;
		        pData[__12] = b11*a12 + b12*a22 + b13*a32;
		        pData[__13] = b11*a13 + b12*a23 + b13*a33;
		        pData[__14] = b11*a14 + b12*a24 + b13*a34;

		        pData[__21] = b21*a11 + b22*a21 + b23*a31;
		        pData[__22] = b21*a12 + b22*a22 + b23*a32;
		        pData[__23] = b21*a13 + b22*a23 + b23*a33;
		        pData[__24] = b21*a14 + b22*a24 + b23*a34;

		        pData[__31] = b31*a11 + b32*a21 + b33*a31;
		        pData[__32] = b31*a12 + b32*a22 + b33*a32;
		        pData[__33] = b31*a13 + b32*a23 + b33*a33;
		        pData[__34] = b31*a14 + b32*a24 + b33*a34;

		        return this;
		    }

		    var pDataDestination: Float32Array = m4fDestination.data;

		    pDataDestination[__11] = b11*a11 + b12*a21 + b13*a31;
		    pDataDestination[__12] = b11*a12 + b12*a22 + b13*a32;
		    pDataDestination[__13] = b11*a13 + b12*a23 + b13*a33;
		    pDataDestination[__14] = b11*a14 + b12*a24 + b13*a34;

		    pDataDestination[__21] = b21*a11 + b22*a21 + b23*a31;
		    pDataDestination[__22] = b21*a12 + b22*a22 + b23*a32;
		    pDataDestination[__23] = b21*a13 + b22*a23 + b23*a33;
		    pDataDestination[__24] = b21*a14 + b22*a24 + b23*a34;

		    pDataDestination[__31] = b31*a11 + b32*a21 + b33*a31;
		    pDataDestination[__32] = b31*a12 + b32*a22 + b33*a32;
		    pDataDestination[__33] = b31*a13 + b32*a23 + b33*a33;
		    pDataDestination[__34] = b31*a14 + b32*a24 + b33*a34;

		    pDataDestination[__41] = pData[__41];
		    pDataDestination[__42] = pData[__42];
		    pDataDestination[__43] = pData[__43];
		    pDataDestination[__44] = pData[__44];

		    return m4fDestination;
		};

		inline setTranslation(v3fTranslation: IVec3): IMat4{
			var pData: Float32Array = this.data;

			pData[__14] = v3fTranslation.x;
			pData[__24] = v3fTranslation.y;
			pData[__34] = v3fTranslation.z;

			return this;
		};

		inline getTranslation(v3fTranslation?: IVec3): IVec3{
			if(!isDef(v3fTranslation)){
				v3fTranslation = new Vec3();
			}

			var pData: Float32Array = this.data;

			v3fTranslation.x = pData[__14];
			v3fTranslation.y = pData[__24];
			v3fTranslation.z = pData[__34];

			return v3fTranslation;
		};

		translateRight(v3fTranslation: IVec3, m4fDestination?: IMat4): IMat4{
			var pData: Float32Array = this.data;

		    var x: float = v3fTranslation.x, y: float = v3fTranslation.y, z: float = v3fTranslation.z;

		    if(!isDef(m4fDestination)){
		        pData[__14] = pData[__11]*x + pData[__12]*y + pData[__13]*z + pData[__14];
		        pData[__24] = pData[__21]*x + pData[__22]*y + pData[__23]*z + pData[__24];
		        pData[__34] = pData[__31]*x + pData[__32]*y + pData[__33]*z + pData[__34];
		        pData[__44] = pData[__41]*x + pData[__42]*y + pData[__43]*z + pData[__44];
		        //строго говоря последнюю строчку умножать не обязательно, так как она должна быть -> 0 0 0 1
		        return this;
		    }

		    var pDataDestination: Float32Array = m4fDestination.data;

		    //кешируем матрицу вращений
		    var a11: float = pData[__11], a12: float = pData[__12], a13: float = pData[__13];
		    var a21: float = pData[__11], a22: float = pData[__22], a23: float = pData[__23];
		    var a31: float = pData[__11], a32: float = pData[__32], a33: float = pData[__33];
		    var a41: float = pData[__11], a42: float = pData[__42], a43: float = pData[__43];

		    pDataDestination[__11] = a11;
		    pDataDestination[__12] = a12;
		    pDataDestination[__13] = a13;
		    pDataDestination[__14] = a11*x + a12*y + a13*z + pData[__14];

		    pDataDestination[__21] = a21;
		    pDataDestination[__22] = a22;
		    pDataDestination[__23] = a23;
		    pDataDestination[__24] = a21*x + a22*y + a23*z + pData[__24];

		    pDataDestination[__31] = a31;
		    pDataDestination[__32] = a32;
		    pDataDestination[__33] = a33;
		    pDataDestination[__34] = a31*x + a32*y + a33*z + pData[__34];

		    pDataDestination[__41] = a41;
		    pDataDestination[__42] = a42;
		    pDataDestination[__43] = a43;
		    pDataDestination[__44] = a41*x + a42*y + a43*z + pData[__44];

		    return m4fDestination;
		};

		translateLeft(v3fTranslation: IVec3, m4fDestination?: IMat4): IMat4{
			var pData: Float32Array = this.data;

		    var x: float = v3fTranslation.x, y: float = v3fTranslation.y, z: float = v3fTranslation.z;

		    if(!isDef(m4fDestination)){
		        pData[__14] = x + pData[__14];
		        pData[__24] = y + pData[__24];
		        pData[__34] = z + pData[__34];
		        return this;
		    }

		    var pDataDestination: Float32Array = m4fDestination.data;

		    pDataDestination[__11] = pData[__11];
		    pDataDestination[__12] = pData[__12];
		    pDataDestination[__13] = pData[__13];
		    pDataDestination[__14] = x + pData[__14];

		    pDataDestination[__21] = pData[__21];
		    pDataDestination[__22] = pData[__22];
		    pDataDestination[__23] = pData[__23];
		    pDataDestination[__24] = y + pData[__24];

		    pDataDestination[__31] = pData[__31];
		    pDataDestination[__32] = pData[__32];
		    pDataDestination[__33] = pData[__33];
		    pDataDestination[__34] = z + pData[__34];

		    pDataDestination[__41] = pData[__41];
		    pDataDestination[__42] = pData[__42];
		    pDataDestination[__43] = pData[__43];
		    pDataDestination[__44] = pData[__44];

		    return m4fDestination;
		};

		scaleRight(v3fScale: IVec3, m4fDestination?: IMat4): IMat4{
			var pData: Float32Array = this.data;

		    var x: float = v3fScale.x, y: float = v3fScale.y, z: float = v3fScale.z;

		    if(!isDef(m4fDestination)){
		        pData[__11] *= x;
		        pData[__12] *= y;
		        pData[__13] *= z;

		        pData[__21] *= x;
		        pData[__22] *= y;
		        pData[__23] *= z;

		        pData[__31] *= x;
		        pData[__32] *= y;
		        pData[__33] *= z;

		        //скейлить эти компоненты необязательно, так как там должны лежать нули
		        pData[__41] *= x;
		        pData[__42] *= y;
		        pData[__43] *= z;

		        return this;
		    }

		    var pDataDestination: Float32Array = m4fDestination.data;

		    pDataDestination[__11] = pData[__11]*x;
		    pDataDestination[__12] = pData[__12]*y;
		    pDataDestination[__13] = pData[__13]*z;
		    pDataDestination[__14] = pData[__14];

		    pDataDestination[__21] = pData[__21]*x;
		    pDataDestination[__22] = pData[__22]*y;
		    pDataDestination[__23] = pData[__23]*z;
		    pDataDestination[__24] = pData[__24];

		    pDataDestination[__31] = pData[__31]*x;
		    pDataDestination[__32] = pData[__32]*y;
		    pDataDestination[__33] = pData[__33]*z;
		    pDataDestination[__34] = pData[__34];

		    //скейлить эти компоненты необязательно, так как там должны лежать нули
		    pDataDestination[__41] = pData[__41]*x;
		    pDataDestination[__42] = pData[__42]*y;
		    pDataDestination[__43] = pData[__43]*z;
		    pDataDestination[__44] = pData[__44];

		    return m4fDestination;
		};

		scaleLeft(v3fScale: IVec3, m4fDestination?: IMat4): IMat4{
			var pData: Float32Array = this.data;

		    var x: float = v3fScale.x, y: float = v3fScale.y, z: float = v3fScale.z;

		    if(!isDef(m4fDestination)){
		        pData[__11] *= x;
		        pData[__12] *= x;
		        pData[__13] *= x;
		        pData[__14] *= x;

		        pData[__21] *= y;
		        pData[__22] *= y;
		        pData[__23] *= y;
		        pData[__24] *= y;

		        pData[__31] *= z;
		        pData[__32] *= z;
		        pData[__33] *= z;
		        pData[__34] *= z;

		        return this;
		    }

		    var pDataDestination: Float32Array = m4fDestination.data;

		    pDataDestination[__11] = pData[__11]*x;
		    pDataDestination[__12] = pData[__12]*x;
		    pDataDestination[__13] = pData[__13]*x;
		    pDataDestination[__14] = pData[__14]*x;

		    pDataDestination[__21] = pData[__21]*y;
		    pDataDestination[__22] = pData[__22]*y;
		    pDataDestination[__23] = pData[__23]*y;
		    pDataDestination[__24] = pData[__24]*y;

		    pDataDestination[__31] = pData[__31]*z;
		    pDataDestination[__32] = pData[__32]*z;
		    pDataDestination[__33] = pData[__33]*z;
		    pDataDestination[__34] = pData[__34]*z;

		    pDataDestination[__41] = pData[__41];
		    pDataDestination[__42] = pData[__42];
		    pDataDestination[__43] = pData[__43];
		    pDataDestination[__44] = pData[__44];    

		    return m4fDestination;
		};

		inline decompose(q4fRotation: IQuat4, v3fScale: IVec3, v3fTranslation: IVec3): bool{
			this.getTranslation(v3fTranslation);
			var m3fRotScale = this.toMat3(mat3());
			return m3fRotScale.decompose(q4fRotation,v3fScale);
		};

		row(iRow: int, v4fDestination?: IVec4): IVec4{
			if(!isDef(v4fDestination)){
				v4fDestination = new Vec4();
			}

			var pData: Float32Array = this.data;

			switch(iRow){
				case 1:
					v4fDestination.x = pData[__11];
					v4fDestination.y = pData[__12];
					v4fDestination.z = pData[__13];
					v4fDestination.w = pData[__14];
					break;
				case 2:
					v4fDestination.x = pData[__21];
					v4fDestination.y = pData[__22];
					v4fDestination.z = pData[__23];
					v4fDestination.w = pData[__24];
					break;
				case 3:
					v4fDestination.x = pData[__31];
					v4fDestination.y = pData[__32];
					v4fDestination.z = pData[__33];
					v4fDestination.w = pData[__34];
					break;
				case 4:
					v4fDestination.x = pData[__41];
					v4fDestination.y = pData[__42];
					v4fDestination.z = pData[__43];
					v4fDestination.w = pData[__44];
					break;
			}

			return v4fDestination;
		};

		column(iColumn: int, v4fDestination?: IVec4): IVec4{
			if(!isDef(v4fDestination)){
				v4fDestination = new Vec4();
			}

			var pData: Float32Array = this.data;

			switch(iColumn){
				case 1:
					v4fDestination.x = pData[__11];
					v4fDestination.y = pData[__21];
					v4fDestination.z = pData[__31];
					v4fDestination.w = pData[__41];
					break;
				case 2:
					v4fDestination.x = pData[__12];
					v4fDestination.y = pData[__22];
					v4fDestination.z = pData[__32];
					v4fDestination.w = pData[__42];
					break;
				case 3:
					v4fDestination.x = pData[__13];
					v4fDestination.y = pData[__23];
					v4fDestination.z = pData[__33];
					v4fDestination.w = pData[__43];
					break;
				case 4:
					v4fDestination.x = pData[__14];
					v4fDestination.y = pData[__24];
					v4fDestination.z = pData[__34];
					v4fDestination.w = pData[__44];
					break;
			}

			return v4fDestination;
		};

		unproj(v3fScreen: IVec3, v4fDestination?: IVec4): IVec4{
			if(!isDef(v4fDestination)){
				v4fDestination = new Vec4();
			}

			var pData: Float32Array = this.data;

			var x: float, y: float, z: float;

			if(pData[__44] === 1.){
				//orthogonal projection case
				
				z = (v3fScreen.z - pData[__34])/pData[__33];
				y = (v3fScreen.y - pData[__24])/pData[__22];
				x = (v3fScreen.x - pData[__14])/pData[__11];
			}
			else{
				//pData[__43] === -1
				//frustum case
				
				z = -pData[__34]/(pData[__33] + v3fScreen.z);
			    y = -(v3fScreen.y + pData[__23])*z/pData[__22];
			    x = -(v3fScreen.x + pData[__13])*z/pData[__11];
			}

			v4fDestination.x = x;
			v4fDestination.y = y;
			v4fDestination.z = z;
			v4fDestination.w = 1.;

			return v4fDestination;
		};

		static fromYawPitchRoll(fYaw: float, fPitch: float, fRoll: float, m4fDestination?: IMat4): IMat4;
		static fromYawPitchRoll(v3fAngles: IVec3, m4fDestination?: IMat4): IMat4;
		static fromYawPitchRoll(fYaw?,fPitch?,fRoll?,m4fDestination?): IMat4{
			if(arguments.length <= 2){
		        //Vec3 + m4fDestination
		        var v3fVec: IVec3 = arguments[0];

		        fYaw   = v3fVec.x;
		        fPitch = v3fVec.y;
		        fRoll  = v3fVec.z;

		        m4fDestination = arguments[1];
		    }

		    if(!isDef(m4fDestination)){
		        m4fDestination = new Mat4();
		    }

		    var pDataDestination: Float32Array = m4fDestination.data;

		    var fSin1: float = Math.sin(fYaw);
		    var fSin2: float = Math.sin(fPitch);
		    var fSin3: float = Math.sin(fRoll);

		    var fCos1: float = Math.cos(fYaw);
		    var fCos2: float = Math.cos(fPitch);
		    var fCos3: float = Math.cos(fRoll);

		    pDataDestination[__11] = fCos1 * fCos3 + fSin1 * fSin2 * fSin3;
		    pDataDestination[__12] = fCos3 * fSin1 * fSin2 - fCos1 * fSin3;
		    pDataDestination[__13] = fCos2 * fSin1;
		    pDataDestination[__14] = 0.;

		    pDataDestination[__21] = fCos2 * fSin3;
		    pDataDestination[__22] = fCos2 * fCos3;
		    pDataDestination[__23] = -fSin2;
		    pDataDestination[__24] = 0.;

		    pDataDestination[__31] = fCos1 * fSin2 * fSin3 - fCos3 * fSin1;
		    pDataDestination[__32] = fSin1 * fSin3 + fCos1 * fCos3 * fSin2;
		    pDataDestination[__33] = fCos1 * fCos2;
		    pDataDestination[__34] = 0.;

		    pDataDestination[__41] = 0.;
		    pDataDestination[__42] = 0.;
		    pDataDestination[__43] = 0.;
		    pDataDestination[__44] = 1.;

		    return m4fDestination;
		};

		static fromXYZ(fX: float, fY: float, fZ: float, m4fDestination?: IMat4): IMat4;
		static fromXYZ(v3fAngles: IVec3, m4fDestination?: IMat4): IMat4;
		static fromXYZ(fX?, fY?, fZ?, m4fDestination?) : IMat4{
			if(arguments.length <= 2){
				//Vec3 + m4fDestination
				var v3fVec: IVec3 = arguments[0];
				return Mat4.fromYawPitchRoll(v3fVec.y,v3fVec.x,v3fVec.z,arguments[1]);
			}
			else{
				//fX fY fZ m4fDestination
				var fX: float = arguments[0];
				var fY: float = arguments[1];
				var fZ: float = arguments[2];

				return Mat4.fromYawPitchRoll(fY, fX, fZ, arguments[3]);
			}
		};

		static frustum(fLeft: float, fRight: float, fBottom: float, fTop: float, fNear: float, fFar: float, m4fDestination?: IMat4): IMat4{
			if(!isDef(m4fDestination)){
		        m4fDestination = new Mat4();
		    }

		    var pDataDestination: Float32Array = m4fDestination.data;

		    var fRL: float = fRight - fLeft;
		    var fTB: float = fTop - fBottom;
		    var fFN: float = fFar - fNear;

		    pDataDestination[__11] = 2.*fNear/fRL;
		    pDataDestination[__12] = 0.;
		    pDataDestination[__13] = (fRight + fLeft)/fRL;
		    pDataDestination[__14] = 0.;

		    pDataDestination[__21] = 0.;
		    pDataDestination[__22] = 2.*fNear/fTB;
		    pDataDestination[__23] = (fTop + fBottom)/fTB;
		    pDataDestination[__24] = 0.;

		    pDataDestination[__31] = 0.;
		    pDataDestination[__32] = 0.;
		    pDataDestination[__33] = -(fFar + fNear)/fFN;
		    pDataDestination[__34] = -2.*fFar*fNear/fFN;

		    pDataDestination[__41] = 0.;
		    pDataDestination[__42] = 0.;
		    pDataDestination[__43] = -1.;
		    pDataDestination[__44] = 0.;

		    return m4fDestination;
		};

		inline static perspective(fFovy: float, fAspect: float, fNear: float, fFar: float, m4fDestination?: IMat4): IMat4{
			var fTop: float = fNear*tan(fFovy/2.);
			var fRight: float = fTop*fAspect;

			return Mat4.frustum(-fRight, fRight, -fTop, fTop, fNear, fFar, m4fDestination);
		};

		static orthogonalProjectionAsymmetric(fLeft: float, fRight: float, fBottom: float,
												 fTop: float, fNear: float, fFar: float, m4fDestination?: IMat4): IMat4{

			 if(!isDef(m4fDestination)){
		        m4fDestination = new Mat4();
		    }

		    var pDataDestination: Float32Array = m4fDestination.data;

		    var fRL: float = fRight - fLeft;
		    var fTB: float = fTop - fBottom;
		    var fFN: float = fFar - fNear;

		    pDataDestination[__11] = 2./fRL;
		    pDataDestination[__12] = 0.;
		    pDataDestination[__13] = 0.;
		    pDataDestination[__14] = -(fRight + fLeft)/fRL;

		    pDataDestination[__21] = 0.;
		    pDataDestination[__22] = 2./fTB;
		    pDataDestination[__23] = 0.;
		    pDataDestination[__24] = -(fTop + fBottom)/fTB;

		    pDataDestination[__31] = 0.;
		    pDataDestination[__32] = 0.;
		    pDataDestination[__33] = -2./fFN;
		    pDataDestination[__34] = -(fFar + fNear)/fFN;

		    pDataDestination[__41] = 0.;
		    pDataDestination[__42] = 0.;
		    pDataDestination[__43] = 0.;
		    pDataDestination[__44] = 1.;

		    return m4fDestination;
		};

		inline static orthogonalProjection(fWidth: float, fHeight: float, fNear: float, fFar: float, m4fDestination?: IMat4): IMat4{
			var fRight: float = fWidth/2.;
		    var fTop: float = fHeight/2.;
		    return Mat4.orthogonalProjectionAsymmetric(-fRight, fRight, -fTop, fTop, fNear, fFar, m4fDestination);
		};

		static lookAt(v3fEye: IVec3, v3fCenter: IVec3, v3fUp: IVec3, m4fDestination?: IMat4): IMat4{
			if(!isDef(m4fDestination)){
		        m4fDestination = new Mat4(1.);
		    }

		    var fEyeX: float = v3fEye.x, fEyeY: float = v3fEye.y, fEyeZ: float = v3fEye.z;
		    var fCenterX: float = v3fCenter.x, fCenterY: float = v3fCenter.y, fCenterZ: float = v3fCenter.z;
		    var fUpX: float = v3fUp.x, fUpY: float = v3fUp.y, fUpZ: float = v3fUp.z;

		    var fLength: float;
		    var fInvLength: float;

		    if(fEyeX === fCenterX && fEyeY === fCenterY && fEyeZ === fCenterZ){
		        return m4fDestination;
		    }

		    var fXNewX: float, fXNewY: float, fXNewZ: float;
		    var fYNewX: float, fYNewY: float, fYNewZ: float;
		    var fZNewX: float, fZNewY: float, fZNewZ: float;

		    //ось Z направлена на наблюдателя
		    fZNewX = fEyeX - fCenterX;
		    fZNewY = fEyeY - fCenterY;
		    fZNewZ = fEyeZ - fCenterZ;

		    fLength = sqrt(fZNewX*fZNewX + fZNewY*fZNewY + fZNewZ*fZNewZ);
		    fInvLength = 1./fLength;
		    
		    //новая ось Z
		    fZNewX = fZNewX*fInvLength;
		    fZNewY = fZNewY*fInvLength;
		    fZNewZ = fZNewZ*fInvLength;

		    //новая ось X
		    fXNewX = fUpY*fZNewZ - fUpZ*fZNewY;
		    fXNewY = fUpZ*fZNewX - fUpX*fZNewZ;
		    fXNewZ = fUpX*fZNewY - fUpY*fZNewX;

		    fLength = sqrt(fXNewX*fXNewX + fXNewY*fXNewY + fXNewZ*fXNewZ);
		    if(fLength){
		    	fInvLength = 1./fLength;

		        fXNewX = fXNewX*fInvLength;
		        fXNewY = fXNewY*fInvLength;
		        fXNewZ = fXNewZ*fInvLength;
		    }
		    
		    //новая ось Y
		    
		    fYNewX = fZNewY*fXNewZ - fZNewZ*fXNewY;
		    fYNewY = fZNewZ*fXNewX - fZNewX*fXNewZ;
		    fYNewZ = fZNewX*fXNewY - fZNewY*fXNewX;

		    //нормировать ненужно, так как было векторное умножение двух ортонормированных векторов

		    //положение камеры в новых осях
		    var fEyeNewX: float = fEyeX*fXNewX + fEyeY*fXNewY + fEyeZ*fXNewZ;
		    var fEyeNewY: float = fEyeX*fYNewX + fEyeY*fYNewY + fEyeZ*fYNewZ;
		    var fEyeNewZ: float = fEyeX*fZNewX + fEyeY*fZNewY + fEyeZ*fZNewZ;

		    var pDataDestination: Float32Array = m4fDestination.data;

		    //lookAt matrix === camera view matrix 
		    //почему новый базис записывается по строкам?
		    //это сзязано с тем, что это получающаяся матрица - 
		    //это viewMatrix камеры, а на эту матрицу умножается при рендеринге, то есть
		    //модель должна испытать преобразования противоположные тем, которые испытывает камера
		    //то есть вращение в другую сторону(базис по строкам) и сдвиг в противоположную сторону

		    pDataDestination[__11] = fXNewX;
		    pDataDestination[__12] = fXNewY;
		    pDataDestination[__13] = fXNewZ;
		    pDataDestination[__14] = -fEyeNewX; /*отъезжаем в позицию камеры*/

		    pDataDestination[__21] = fYNewX;
		    pDataDestination[__22] = fYNewY;
		    pDataDestination[__23] = fYNewZ;
		    pDataDestination[__24] = -fEyeNewY; /*отъезжаем в позицию камеры*/

		    pDataDestination[__31] = fZNewX;
		    pDataDestination[__32] = fZNewY;
		    pDataDestination[__33] = fZNewZ;
		    pDataDestination[__34] = -fEyeNewZ; /*отъезжаем в позицию камеры*/

		    pDataDestination[__41] = 0.;
		    pDataDestination[__42] = 0.;
		    pDataDestination[__43] = 0.;
		    pDataDestination[__44] = 1.;

		    return m4fDestination;
		};

		ALLOCATE_STORAGE(Mat4,100)
    }
}

#endif