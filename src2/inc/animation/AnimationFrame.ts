#ifndef ANIMATIONFRAME_TS
#define ANIMATIONFRAME_TS

#include "IAnimationFrame.ts"
#include "math/math.ts"

module akra.animation {
	export class AnimationFrame implements IAnimationFrame{
		private _fTime:   float = 0.0;
		private _fWeight: float = 1.0;

		private _pMatrix: IMat4 = null;
		
		private _qRotation:      IQuat4 = new Quat4;
		private _v3fScale:       IVec3  = new Vec3;
		private _v3fTranslation: IVec3  = new Vec3;

		inline get time(): float{
			return this._fTime;
		}

		inline set time(fValue: float){
			this._fTime = fValue;
		}

		inline get weight(): float{
			return this._fWeight;
		}

		inline set weight(fValue: float){
			this._fWeight = fValue;
		}

		inline get matrix(): IMat4{
			return this._pMatrix;
		}

		inline set matrix(pMatrix: IMat4){
			this._pMatrix = pMatrix;
		}

		inline get rotation(): IQuat4{
			return this._qRotation;
		}

		inline set rotation(qRotation: IQuat4){
			this._qRotation = qRotation;
		}

		inline get scale(): IVec3{
			return this._v3fScale;
		}

		inline set scale(v3fScale: IVec3){
			this._v3fScale = v3fScale;
		}

		inline get translation(): IVec3{
			return this._v3fTranslation;
		}

		inline set translation(v3fTranslation: IVec3){
			this._v3fTranslation = v3fTranslation;
		}

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

		set(pFrame: IAnimationFrame): void {
			//FIXME: расписать побыстрее
			this.matrix.set(pFrame.matrix);

			this.rotation.set(pFrame.rotation);
			this.scale.set(pFrame.scale);
			this.translation.set(pFrame.translation);

			this.time = pFrame.time;
			this.weight = pFrame.weight;
		}

		interpolate(pStartFrame: IAnimationFrame, pEndFrame: IAnimationFrame, fBlend: float): void {
			var pResultData = this.matrix.data;
			var pStartData = pStartFrame.matrix.data;
			var pEndData = pEndFrame.matrix.data;
			var fBlendInv = 1. - fBlend;

			for (var i = 0; i < 16; i++) {
				pResultData[i] = pEndData[i] * fBlend + pStartData[i] * fBlendInv;
			};
		}

		toMatrix(): IMat4{
			return this.rotation.toMat4(this.matrix)
				.setTranslation(this.translation).scaleRight(this.scale);
		}
	} 

	export function animationFrame(): IAnimationFrame {
		return null;
	}
}

#endif