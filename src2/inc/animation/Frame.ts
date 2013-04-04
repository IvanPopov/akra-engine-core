#ifndef ANIMATIONFRAME_TS
#define ANIMATIONFRAME_TS

#include "IAnimationFrame.ts"
#include "math/math.ts"

#define AF_NUM 4 * 4096


module akra.animation {
	export class Frame implements IAnimationFrame {
		public time: float = 0.0;
		public weight: float = 1.0;

		public matrix: IMat4 = null;
		
		public rotation: IQuat4 = new Quat4;
		public scale: IVec3 = new Vec3;
		public translation: IVec3 = new Vec3;

		constructor();
		constructor(fTime: float, pMatrix: IMat4);
		constructor(fTime: float, pMatrix: IMat4, fWeight: float);
		constructor(fTime?: float, pMatrix?: IMat4, fWeight?: float) {
			switch (arguments.length) {		
				case 0:
					this.matrix = new Mat4;
					return;
				case 3:
					this.weight = fWeight;
				case 2:
					this.matrix = pMatrix;
				case 1:
					this.time = fTime;
			};

			this.matrix.decompose(this.rotation, this.scale, this.translation);
		}

		toMatrix(): IMat4{
			return this.rotation.toMat4(this.matrix)
				.setTranslation(this.translation).scaleRight(this.scale);
		}

		toMatrixFromMatrix(): IMat4 {
			return this.matrix;
		}

		reset(): IAnimationFrame {
			this.weight = 0.0;
			this.time = 0.0;

			var pData = this.matrix.data;
			pData[__11] = pData[__12] = pData[__13] = pData[__14] = 
			pData[__21] = pData[__22] = pData[__23] = pData[__24] = 
			pData[__31] = pData[__32] = pData[__33] = pData[__34] = 
			pData[__41] = pData[__42] = pData[__43] = pData[__44] = 0;

			this.rotation.x = this.rotation.y = this.rotation.z = 0;
			this.rotation.w = 1.0;

			this.translation.x = this.translation.y = this.translation.z = 0;

			this.scale.x = this.scale.y = this.scale.z = 0;

			return this;
		}

		set(pFrame: IAnimationFrame): void {
			//FIXME: расписать побыстрее
			this.matrix.set(pFrame.matrix);

			this.rotation.set(pFrame.rotation);
			this.scale.set(pFrame.scale);
			this.translation.set(pFrame.translation);

			this.time = pFrame.time;
			this.weight = pFrame.weight;
		}

		/**
		 * Добавить данные к фрейму с их весом.
		 * После данного метода фрейму потребуется нормализация!!!!
		 */


		add(pFrame: IAnimationFrame, isFirst: bool): IAnimationFrame {
			var fWeight: float = pFrame.weight;

			this.scale.x += pFrame.scale.x * fWeight;
			this.scale.y += pFrame.scale.y * fWeight;
			this.scale.z += pFrame.scale.z * fWeight;

			this.translation.x += pFrame.translation.x * fWeight;
			this.translation.y += pFrame.translation.y * fWeight;
			this.translation.z += pFrame.translation.z * fWeight;

			this.weight += fWeight;

			if (!isFirst) {
				this.rotation.smix(pFrame.rotation, fWeight / this.weight);
			}
			else {
				this.rotation.set(pFrame.rotation);
			}

			return this;
		}

		addMatrix(pFrame: IAnimationFrame): IAnimationFrame {
			var pMatData: Float32Array = pFrame.matrix.data;
			var fWeight: float = pFrame.weight;
			var pResData: Float32Array = this.matrix.data;

			for (var i = 0; i < 16; ++ i) {
				pResData[i] += pMatData[i] * fWeight;
			}

			this.weight += fWeight;
			return this;
		}

		mult(fScalar: float): IAnimationFrame{
			this.weight *= fScalar;
			return this;
		}

		normilize(): IAnimationFrame{
			var fScalar: float = 1.0 / this.weight;

		    this.scale.x *= fScalar;
		    this.scale.y *= fScalar;
		    this.scale.z *= fScalar;
				
		    this.translation.x *= fScalar;
		    this.translation.y *= fScalar;
		    this.translation.z *= fScalar;

			return this;
		}

		normilizeMatrix(): IAnimationFrame{
			var fScalar: float = 1.0 / this.weight;
		    var pData = this.matrix.data;

		    pData[__11] *= fScalar;
		    pData[__12] *= fScalar; 
		    pData[__13] *= fScalar;
		    pData[__14] *= fScalar;
			
			pData[__21] *= fScalar;
		    pData[__22] *= fScalar; 
		    pData[__23] *= fScalar;
		    pData[__24] *= fScalar;
			
			pData[__31] *= fScalar;
		    pData[__32] *= fScalar; 
		    pData[__33] *= fScalar;
		    pData[__34] *= fScalar;
			
			pData[__41] *= fScalar;
		    pData[__42] *= fScalar; 
		    pData[__43] *= fScalar;
		    pData[__44] *= fScalar;
				
			return this;
		}

		interpolate(pStartFrame: IAnimationFrame, pEndFrame: IAnimationFrame, fBlend: float): void {
			// var pResultData = this.matrix.data;
			// var pStartData = pStartFrame.matrix.data;
			// var pEndData = pEndFrame.matrix.data;
			// var fBlendInv = 1. - fBlend;

			// for (var i = 0; i < 16; i++) {
			// 	pResultData[i] = pEndData[i] * fBlend + pStartData[i] * fBlendInv;
			// };
			pStartFrame.translation.mix(pEndFrame.translation, fBlend, this.translation);
			pStartFrame.scale.mix(pEndFrame.scale, fBlend, this.scale);
			pStartFrame.rotation.smix(pEndFrame.rotation, fBlend, this.rotation);
		}

		interpolateMatrix(pStartFrame: IAnimationFrame, pEndFrame: IAnimationFrame, fBlend: float): void {
			var pResultData = this.matrix.data;
			var pStartData = pStartFrame.matrix.data;
			var pEndData = pEndFrame.matrix.data;
			var fBlendInv: float = 1. - fBlend;

			for (var i = 0; i < 16; i++) {
				pResultData[i] = pEndData[i] * fBlend + pStartData[i] * fBlendInv;
			};
		}

		ALLOCATE_STORAGE(Frame, AF_NUM);
	} 

	export inline function animationFrame(): Frame {
		return Frame.stackCeil;
	}

	export function createFrame(fTime: float = 0.0, pMatrix: IMat4 = null, fWeight: float = 1.0): IAnimationFrame {
		return new Frame(fTime, pMatrix, fWeight);
	}
}

#endif