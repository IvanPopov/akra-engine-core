#ifndef ANIMATIONCONTROLLER_TS
#define ANIMATIONCONTROLLER_TS

#include "IAnimationBase.ts"
#include "IAnimationController.ts"


module akra.animation {
	export class AnimationController implements IAnimationController {
		private _pEngine: IEngine;
		private _pAnimations: IAnimationBase[] = [];
		private _eOptions = 0;
	    private _pActiveAnimation: IAnimationBase = null;
	    private _fnPlayAnimation: Function = null;

	    inline get totalAnimations(): int{
			return this._pAnimations.length;
		}

		inline get active(): IAnimationBase{
			return this._pActiveAnimation;
		}

		constructor(pEngine: IEngine, eOptions){
			this._pEngine = pEngine;

			if (eOptions) {
				this.setOptions(eOptions);
			}
		}

		getEngine(): IEngine {
			return this._pEngine;
		}

		setOptions(eOptions): void {

		}

		addAnimation(pAnimation: IAnimationBase): bool {
			if (this.findAnimation(pAnimation.name)) {
				warning('Animation with name <' + pAnimation.name + '> already exists in this controller');
				return false;
			}

			//trace('animation controller :: add animation >> ', pAnimation.name);
			
			this._pAnimations.push(pAnimation);
			this._pActiveAnimation = pAnimation;
		}

		removeAnimation(): bool {
			var pAnimation = this.findAnimation(arguments[0]);
		    var pAnimations = this._pAnimations;

			for (var i = 0; i < pAnimations.length; ++ i) { 
				if (pAnimations[i] === pAnimation) {
					pAnimations.splice(i, 1);
					trace('animation controller :: remove animation >> ', pAnimation.name);
					return true;
				}
			}

			return false;
		}

		findAnimation(pAnimation: string): IAnimationBase;
		findAnimation(pAnimation: int): IAnimationBase;
		findAnimation(pAnimation: IAnimationBase): IAnimationBase;
		findAnimation(pAnimation: any): IAnimationBase {
			var pAnimations: IAnimationBase[] = this._pAnimations;
		    var iAnimation: int;
		    var sAnimation: string;

			if (typeof arguments[0] === 'string') {
				sAnimation = arguments[0];

				for (var i = 0; i < pAnimations.length; ++ i) { 
					if (pAnimations[i].name === sAnimation) {
						return pAnimations[i];
					}
				}

				return null;
			}

			if (typeof arguments[0] === 'number') {
				iAnimation = arguments[0];
				return pAnimations[iAnimation] || null;
			}

			return arguments[0];
		}

		getAnimation(iAnim: int): IAnimationBase {
			return this._pAnimations[iAnim];
		}

		setAnimation(iAnimation: int, pAnimation: IAnimationBase): void {
			debug_assert(iAnimation < this._pAnimations.length, 'invalid animation slot');

			this._pAnimations[iAnimation] = pAnimation;
		}

		bind(pTarget: INode): void {
			var pAnimations: IAnimationBase[] = this._pAnimations;

		    for (var i: int = 0; i < pAnimations.length; ++ i) {
		        pAnimations[i].attach(pTarget);
		    }
		}

		play(pAnimation: IAnimationBase, fRealTime: float): bool {
			var pAnimationNext: IAnimationBase = this.findAnimation(arguments[0]);
			var pAnimationPrev: IAnimationBase = this._pActiveAnimation;

			if (pAnimationNext && pAnimationNext !== pAnimationPrev) {
				if (this._fnPlayAnimation) {
					this._fnPlayAnimation(pAnimationNext);
				}
				//trace('controller::play(', pAnimationNext.name, ')', pAnimationNext);
				if (pAnimationPrev) {
					pAnimationPrev.stop(fRealTime);
				}

				pAnimationNext.play(fRealTime);

				this._pActiveAnimation = pAnimationNext;
				
				return true;
			}

			return false;
		}

		update(fTime: float): void {
			if (this._pActiveAnimation) {
				this._pActiveAnimation.apply(fTime);
			}
		}
	} 
}

#endif