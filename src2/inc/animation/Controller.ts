#ifndef ANIMATIONCONTROLLER_TS
#define ANIMATIONCONTROLLER_TS

#include "IAnimationBase.ts"
#include "IAnimationController.ts"
#include "util/unique.ts"

#include "Base.ts"
#include "Container.ts"
#include "Blend.ts"

module akra.animation {
	export class Controller implements IAnimationController {
		public name: string = null;

		private _pAnimations: IAnimationBase[] = [];
		private _iOptions: int = 0;
	    private _pActiveAnimation: IAnimationBase = null;
	    private _pEngine: IEngine;
	    private _pTarget: ISceneNode = null;


	    inline get totalAnimations(): int{
			return this._pAnimations.length;
		}

		inline get active(): IAnimationBase{
			return this._pActiveAnimation;
		}

		inline get target(): ISceneNode { 
			return this._pTarget;
		}

		constructor(pEngine: IEngine, sName: string = null, iOptions: int = 0) {
			this._pEngine = pEngine;
			this.setOptions(iOptions);
			this.name = sName;
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
			if (/*!pAnimation.isAttached() && */!isNull(this.target)) {
				pAnimation.attach(this.target);
			}
			else {
				//TODO: detach animation
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
		        if (!pAnimations[i].isAttached() || this.target !== pTarget) {
		        	pAnimations[i].attach(pTarget);
		        }
		    }

		    if (this.target) {
		    	this.disconnect(this.target.scene, SIGNAL(postUpdate), SLOT(update));
		    }

		    this._pTarget = pTarget;
		    this.connect(this.target.scene, SIGNAL(postUpdate), SLOT(update));

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

		stop(): void {
			if (this._pActiveAnimation) {
				this._pActiveAnimation.stop(this._pEngine.time);
			}

			this._pActiveAnimation = null;
		}

		update(): void {
			var pAnim: IAnimationBase = this._pActiveAnimation;
			if (!isNull(pAnim)) {
				if (!pAnim.apply(this._pEngine.time)) {

					// this._pActiveAnimation = null;
					// pAnim.stop(this._pEngine.time);
				}
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


	export function createController(pEngine: IEngine, sName?: string, iOptions?: int): IAnimationController {
		return new Controller(pEngine, sName, iOptions);
	}
}

#endif