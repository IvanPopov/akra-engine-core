#ifndef ANIMATIONCONTROLLER_TS
#define ANIMATIONCONTROLLER_TS

#include "IAnimationBase.ts"
#include "IAnimationController.ts"
#include "util/unique.ts"

module akra.animation {
	export class Controller implements IAnimationController {
		private _pAnimations: IAnimationBase[] = [];
		private _iOptions: int = 0;
	    private _pActiveAnimation: IAnimationBase = null;
	    private _pEngine: IEngine;
	    private _pLastTarget: ISceneNode = null;

	    inline get totalAnimations(): int{
			return this._pAnimations.length;
		}

		inline get active(): IAnimationBase{
			return this._pActiveAnimation;
		}

		constructor(pEngine: IEngine, iOptions: int = 0) {
			this._pEngine = pEngine;
			this.setOptions(iOptions);
		}

		inline getEngine(): IEngine {
			return this._pEngine;
		}

		setOptions(iOptions: int): void {

		}


		addAnimation(pAnimation: IAnimationBase): bool {
			if (this.findAnimation(pAnimation.name)) {
				WARNING("Animation with name <" + pAnimation.name + "> already exists in this controller");
				return false;
			}

			//LOG('animation controller :: add animation >> ', pAnimation.name);
			
			this._pAnimations.push(pAnimation);
			this._pActiveAnimation = pAnimation;

			if (!pAnimation.isAttached() && !isNull(this._pLastTarget)) {
				pAnimation.attach(this._pLastTarget);
			}

			this.animationAdded(pAnimation);
		}

		removeAnimation(pAnimation: string): bool;
		removeAnimation(pAnimation: int): bool;
		removeAnimation(pAnimation: IAnimationBase): bool;
		removeAnimation(pAnimation: any): bool {
			var pAnimation = this.findAnimation(arguments[0]);
		    var pAnimations = this._pAnimations;

			for (var i = 0; i < pAnimations.length; ++ i) { 
				if (pAnimations[i] === pAnimation) {
					pAnimations.splice(i, 1);
					LOG("animation controller :: remove animation >> ", pAnimation.name);
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

			if (isString(arguments[0])) {
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

		inline getAnimation(iAnim: int): IAnimationBase {
			return this._pAnimations[iAnim];
		}

		setAnimation(iAnimation: int, pAnimation: IAnimationBase): void {
			debug_assert(iAnimation < this._pAnimations.length, 'invalid animation slot');

			this._pAnimations[iAnimation] = pAnimation;
		}

		attach(pTarget: ISceneNode): void {
			var pAnimations: IAnimationBase[] = this._pAnimations;

		    for (var i: int = 0; i < pAnimations.length; ++ i) {
		        pAnimations[i].attach(pTarget);
		    }

		    this._pLastTarget = pTarget;
		}

		play(pAnimation: string): bool;
		play(pAnimation: int): bool;
		play(pAnimation: IAnimationBase): bool;
		play(pAnimation: any): bool {
			var pAnimationNext: IAnimationBase = this.findAnimation(arguments[0]);
			var pAnimationPrev: IAnimationBase = this._pActiveAnimation;
			var fRealTime: float = this._pEngine.time;

			if (pAnimationNext && pAnimationNext !== pAnimationPrev) {
				
				if (pAnimationPrev) {
					pAnimationPrev.stop(fRealTime);
				}

				pAnimationNext.play(fRealTime);

				this._pActiveAnimation = pAnimationNext;
			
				EMIT_BROADCAST(play, _CALL(pAnimationNext, fRealTime));
				return true;
			}

			return false;
		}

		update(): void {
			if (this._pActiveAnimation) {
				this._pActiveAnimation.apply(this._pEngine.time);
			}
		}

		toString(bFullInfo: bool = false): string {
#ifdef DEBUG
			var s: string = "\n";
			s += "ANIMATION CONTROLLER (total: " + this.totalAnimations + " animations)\n";
			s += "-----------------------------------------------------\n";

			for (var i: int = 0; i < this.totalAnimations; ++ i) {
				s += this.getAnimation(i).toString();
			}

			return s;
#else
			return null;
#endif			
		}

		CREATE_EVENT_TABLE(Controller);
		BROADCAST(animationAdded, CALL(pAnimation));
		//BROADCAST(play, CALL(pAnimation));
	} 


	export function createController(pEngine: IEngine, iOptions?: int): IAnimationController {
		return new Controller(pEngine, iOptions);
	}
}

#endif