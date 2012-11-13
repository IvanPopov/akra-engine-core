#ifndef ANIMATIONBLEND_TS
#define ANIMATIONBLEND_TS

#include "IAnimationBlend.ts"


module akra.animation {
	export class AnimationBlend extends AnimationBase implements IAnimationBlend {

		private _pAnimationList: IAnimationElement[] = [];
		public  duration = 0;

		inline get totalAnimations(): int{
			return this._pAnimationList.length;
		}

		play(fRealTime: float): void {
			var pAnimationList: IAnimationElement[] = this._pAnimationList;
			var n: int = pAnimationList.length;
			//trace('AnimationBlend::play(', this.name, fRealTime, ')');
			for (var i: int = 0; i < n; ++ i) {

				pAnimationList[i].realTime = fRealTime;
				pAnimationList[i].time = fRealTime * pAnimationList[i].acceleration;
				//trace(pAnimationList[i]);
			}

			this.onplay(fRealTime);
		}

		stop(): void {
			this.onstop();
		}
		
		attach(pTarget: INode): void {
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
		    var me: AnimationBlend = this;
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

				pAnimation.on('updateDuration', function () {
					me.updateDuration();
				})

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

		updateDuration(): void {
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

			this.onUpdateDuration();
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


		getAnimation(iAnimation: int): IAnimationBase {
			if (typeof arguments[0] === 'string') {
		    	iAnimation = this.getAnimationIndex(arguments[0]);
		    }

			return this._pAnimationList[iAnimation].animation;
		}

		getAnimationWeight(iAnimation: int): float {
			if (typeof arguments[0] === 'string') {
				iAnimation = this.getAnimationIndex(arguments[0]);
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

		setAnimationWeight(iAnimation: int, fWeight: float): bool {
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
			    if (typeof arguments[0] === 'string') {
			    	iAnimation = this.getAnimationIndex(arguments[0]);
			    }

			    //trace('set weight for animation: ', iAnimation, 'to ', fWeight);
			    if (pAnimationList[iAnimation].weight !== fWeight) {
					pAnimationList[iAnimation].weight = fWeight;
					isModified = true;
				}
			}

			if (isModified) { this.updateDuration(); }

			return true;
		}

		setAnimationMask(iAnimation: int, pMask: FloatMap): bool {
			if (typeof arguments[0] === 'string') {
		    	iAnimation = this.getAnimationIndex(arguments[0]);
		    }

			this._pAnimationList[iAnimation].mask = pMask;

			return true;
		}

		getAnimationMask(iAnimation: int): FloatMap {
			if (typeof arguments[0] === 'string') {
		    	iAnimation = this.getAnimationIndex(arguments[0]);
		    }

			return this._pAnimationList[iAnimation].mask;
		}

		createAnimationMask(iAnimation?: int): FloatMap {
			if (arguments.length === 0) {
				return animation.AnimationBase.prototype.createAnimationMask.call(this);
			}

			if (typeof arguments[0] === 'string') {
		    	iAnimation = this.getAnimationIndex(arguments[0]);
		    }

		    var pAnimation: IAnimationBase = this._pAnimationList[iAnimation].animation;
			return pAnimation.createAnimationMask();
		}

		frame(sName: string, fRealTime: float) {
			var pAnimationList: IAnimationElement[] = this._pAnimationList;
			var pResultFrame: IAnimationFrame = animation.animationFrame().reset();
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
						pResultFrame.add(pFrame.mult(fWeight), iAnim === 1);//first, if 1
					}
				}
			}

			if (pResultFrame.weight === 0.0) {
				return null;
			}

			return pResultFrame.normilize();
		}


		BEGIN_EVENT_TABLE(AnimationBase);
			BROADCAST(onplay, CALL(fRealTime));
			BROADCAST(onstop, CALL());
			BROADCAST(onUpdateDuration, CALL());
		END_EVENT_TABLE();
	} 
}

#endif