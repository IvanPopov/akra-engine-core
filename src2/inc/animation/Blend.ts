#ifndef ANIMATIONBLEND_TS
#define ANIMATIONBLEND_TS

#include "IAnimationBlend.ts"
#include "Base.ts"


module akra.animation {
	class Blend extends Base implements IAnimationBlend {
		public duration: float = 0;

		private _pAnimationList: IAnimationElement[] = [];

		constructor (sName?: string) {
			super(EAnimationTypes.BLEND, sName);
		}

		inline get totalAnimations(): int {
			return this._pAnimationList.length;
		}

		play(fRealTime: float): void {
			var pAnimationList: IAnimationElement[] = this._pAnimationList;
			var n: int = pAnimationList.length;

			for (var i: int = 0; i < n; ++ i) {

				pAnimationList[i].realTime = fRealTime;
				pAnimationList[i].time = fRealTime * pAnimationList[i].acceleration;
			}

			this.played(fRealTime);
		}

		stop(): void {
			this.stoped(0.);
		}
		
		attach(pTarget: ISceneNode): void {
			var pAnimationList: IAnimationElement[] = this._pAnimationList;

			for (var i: int = 0; i < pAnimationList.length; ++ i) {
				var pAnim: IAnimationBase = pAnimationList[i].animation;
				pAnim.attach(pTarget);	
				this.grab(pAnim, true);
			}
		}

		addAnimation(pAnimation: IAnimationBase, fWeight: float, pMask: FloatMap): int {
			debug_assert(isDef(pAnimation), 'animation must be setted.');

			this._pAnimationList.push(null);
			
			return this.setAnimation(this._pAnimationList.length - 1, pAnimation, fWeight, pMask);
		}

		setAnimation(iAnimation: int, pAnimation: IAnimationBase, fWeight: float = 1.0, pMask: FloatMap = null): int {
			debug_assert(iAnimation <= this._pAnimationList.length, 'invalid animation slot: ' + iAnimation + '/' + this._pAnimationList.length);

		    var pPointer: IAnimationElement = this._pAnimationList[iAnimation];
		    var pAnimationList: IAnimationElement[] = this._pAnimationList;

		    if (!pAnimation) {
		    	pAnimationList[iAnimation] = null;
		    	return iAnimation;
		    }

		    if (!pPointer) {
		    	pPointer = {
					animation: pAnimation,
					weight: fWeight,
					mask: pMask,
					acceleration: 1.0,
					time: 0.0,
					realTime: 0.0
				};

				CONNECT(pAnimation, SIGNAL(durationUpdated), this, SLOT(_onDurationUpdate))

				if (iAnimation == this._pAnimationList.length) {
					pAnimationList.push(pPointer);
				}
				else {
					pAnimationList[iAnimation] = pPointer;
				}
			}

			this.grab(pAnimation);
			this.updateDuration();
			
			return iAnimation;
		}

		_onDurationUpdate(pAnimation: IAnimationBase, fDuration: float): void {
			this.updateDuration();
		}

		protected updateDuration(): void {
			var fWeight: float = 0;
			var fSumm: float = 0;
			var pAnimationList: IAnimationElement[] = this._pAnimationList;
			var n: int = pAnimationList.length;

			for (var i: int = 0; i < n; ++ i) {
				if (pAnimationList[i] === null) {
					continue;
				}

				fSumm += pAnimationList[i].weight * pAnimationList[i].animation.duration;
				fWeight += pAnimationList[i].weight;
			}

			if (fWeight === 0) {
				this.duration = 0;
			}
			else {

				this.duration = fSumm / fWeight;

				for (var i: int = 0; i < n; ++ i) {
					if (pAnimationList[i] === null) {
						continue;
					}

					pAnimationList[i].acceleration = pAnimationList[i].animation.duration / this.duration;
					//trace(pAnimationList[i].animation.name, '> acceleration > ', pAnimationList[i].acceleration);
				}
			}

			this.durationUpdated(this.duration);
		}

		getAnimationIndex(sName: string): int {
			var pAnimationList: IAnimationElement[] = this._pAnimationList;

			for (var i: int = 0; i < pAnimationList.length; i++) {
				if (pAnimationList[i].animation.name === sName) {
					return i;
				}
			};

			return -1;
		}


		getAnimation(sName: string): IAnimationBase;
		getAnimation(iAnimation: int): IAnimationBase;
		getAnimation(animation): IAnimationBase {
			var iAnimation: int = isString(animation)? this.getAnimationIndex(animation): <int>animation;
			return this._pAnimationList[iAnimation].animation;
		}

		getAnimationWeight(iAnimation: int): float;
		getAnimationWeight(sName: string): float;
		getAnimationWeight(animation): float {
			var iAnimation: int = <int>animation;
			if (isString(animation)) {
				iAnimation = this.getAnimationIndex(animation);
			}

			return this._pAnimationList[iAnimation].weight;
		}

		setWeights(): bool {
			var fWeight: float;
    		var isModified: bool = false;
		    var pAnimationList: IAnimationElement[] = this._pAnimationList;

			for (var i: int = 0; i < arguments.length; ++ i) {
				fWeight = arguments[i];
				
				if (fWeight < 0 || fWeight === null || !pAnimationList[i]) {
					continue;
				}

				if (pAnimationList[i].weight !== fWeight) {
					pAnimationList[i].weight = fWeight;
					isModified = true;
				}
			}

			if (isModified) { 
				this.updateDuration(); 
			}

			return true;
		}

		setWeightSwitching(fWeight: float, iAnimationFrom: int, iAnimationTo: int): bool {
			var pAnimationList: IAnimationElement[] = this._pAnimationList;
		    var isModified: bool = false;
		    var fWeightInv: float = 1. - fWeight;

		    if (!pAnimationList[iAnimationFrom] || !pAnimationList[iAnimationTo]) {
		    	return false;
		    }

		    if (pAnimationList[iAnimationFrom].weight !== fWeightInv) {
				pAnimationList[iAnimationFrom].weight = fWeightInv;
				isModified = true;
			}

			if (pAnimationList[iAnimationTo].weight !== fWeight) {
				pAnimationList[iAnimationTo].weight = fWeight;
				isModified = true;
			}

			if (isModified) { 
				this.updateDuration(); 
			}

			return true;
		}

		setAnimationWeight(fWeight: float): bool;
		setAnimationWeight(iAnimation: int, fWeight: float): bool;
		setAnimationWeight(sName: string, fWeight: float): bool;
		setAnimationWeight(animation, fWeight?: float): bool {
			var pAnimationList = this._pAnimationList;
		    var isModified = false;
		    if (arguments.length === 1) {
		    	fWeight = arguments[0];
		    	
		    	for (var i = 0; i < pAnimationList.length; i++) {
		    		pAnimationList[i].weight = fWeight;
		    	};

		    	isModified = true;
		    }
		    else {
			    var iAnimation: int = isString(animation)? this.getAnimationIndex(animation): <int>animation;

			    //trace('set weight for animation: ', iAnimation, 'to ', fWeight);
			    if (pAnimationList[iAnimation].weight !== fWeight) {
					pAnimationList[iAnimation].weight = fWeight;
					isModified = true;
				}
			}

			if (isModified) { 
				this.updateDuration(); 
			}

			return true;
		}

		setAnimationMask(iAnimation: int, pMask: FloatMap): bool;
		setAnimationMask(sName: string, pMask: FloatMap): bool;
		setAnimationMask(animation, pMask: FloatMap): bool {
			var iAnimation: int = isString(animation)? this.getAnimationIndex(animation): <int>animation;

			this._pAnimationList[iAnimation].mask = pMask;

			return true;
		}

		getAnimationMask(iAnimation: int): FloatMap;
		getAnimationMask(sName: string): FloatMap;
		getAnimationMask(animation): FloatMap {
			var iAnimation: int = isString(animation)? this.getAnimationIndex(animation): <int>animation;

			return this._pAnimationList[iAnimation].mask;
		}

		getAnimationAcceleration(iAnimation: int): float;
		getAnimationAcceleration(sName: string): float;
		getAnimationAcceleration(animation): float {
			var iAnimation: int = isString(animation)? this.getAnimationIndex(animation): <int>animation;

			return this._pAnimationList[iAnimation].acceleration;	
		}	

		createAnimationMask(iAnimation?: int): FloatMap {
			if (arguments.length === 0) {
				return super.createAnimationMask();
			}

			if (typeof arguments[0] === 'string') {
		    	iAnimation = this.getAnimationIndex(arguments[0]);
		    }

		    var pAnimation: IAnimationBase = this._pAnimationList[iAnimation].animation;
			return pAnimation.createAnimationMask();
		}

		frame(sName: string, fRealTime: float) {
			var pAnimationList: IAnimationElement[] = this._pAnimationList;
			var pResultFrame: IAnimationFrame = animationFrame().reset();
			var pFrame: IAnimationFrame;
			var pMask: FloatMap;
			var pPointer: IAnimationElement;
			var fAcceleration: float;

			var fBoneWeight: float;
			var fWeight: float;
			var iAnim: int = 0;


			for (var i: int = 0; i < pAnimationList.length; i++) {
				pPointer = pAnimationList[i];

				if (!pPointer) {
					continue;
				}

				fAcceleration = pPointer.acceleration;
				pMask = pPointer.mask;
				fBoneWeight = 1.0;

				pPointer.time = pPointer.time + (fRealTime - pPointer.realTime) * fAcceleration;
		    	pPointer.realTime = fRealTime;

		    	if (pMask) {
					fBoneWeight = isDef(pMask[sName]) ? pMask[sName] : 1.0;
				}

				fWeight = fBoneWeight * pPointer.weight;
				
				if (fWeight > 0.0) {
					pFrame = pPointer.animation.frame(sName, pPointer.time);

					if (pFrame) {
						iAnim ++;
						//first, if 1
						pResultFrame.add(pFrame.mult(fWeight), iAnim === 1);
					}
				}
			}

			if (pResultFrame.weight === 0.0) {
				return null;
			}

			return pResultFrame.normilize();
		}


		BROADCAST(durationUpdated, CALL(fDuration));
	} 

	export inline function isBlend(pAnimation: IAnimationBase): bool {
		return pAnimation.type === EAnimationTypes.BLEND;
	}

	export function createBlend(sName?: string): IAnimationBlend {
		return new Blend(sName);
	}
}

#endif