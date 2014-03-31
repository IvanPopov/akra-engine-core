/// <reference path="../idl/IAnimationBase.ts" />
/// <reference path="../idl/IAnimationController.ts" />

/// <reference path="../guid.ts" />

/// <reference path="Base.ts" />
/// <reference path="Container.ts" />
/// <reference path="Blend.ts" />

module akra.animation {
	class PlaySignal extends Signal<IAnimationController> {

		constructor(pController: IAnimationController) {
			super(pController, EEventTypes.BROADCAST);
		}

		emit(pAnimation: string): void;
		emit(pAnimation: int): void;
		emit(pAnimation: IAnimationBase): void;
		emit(pAnimation: any): void {
			var pController: IAnimationController = this.getSender();
			var pAnimationNext: IAnimationBase = pController.findAnimation(arguments[0]);
			var pAnimationPrev: IAnimationBase = pController.getActive();
			var fRealTime: float = pController.getEngine().getTime();

			if (pAnimationNext && pAnimationNext !== pAnimationPrev) {

				if (pAnimationPrev) {
					pAnimationPrev.stop(fRealTime);
				}

				pAnimationNext.play(fRealTime);
				pController._setActiveAnimation(pAnimationNext);

				super.emit(pAnimationNext, fRealTime);
			}
		}
	}

	class Controller implements IAnimationController {
		guid: uint = guid();

		animationAdded: ISignal<{ (pController: IAnimationController, pAnimation: IAnimationBase): void; }>;
		play: ISignal<{ (pController: IAnimationController, pAnimation: IAnimationBase, fRealTime: float): void; }>;

		public name: string = null;

		private _pAnimations: IAnimationBase[] = [];
		private _iOptions: int = 0;
	    private _pActiveAnimation: IAnimationBase = null;
	    private _pEngine: IEngine;
	    private _pTarget: ISceneNode = null;


	    getTotalAnimations(): int{
			return this._pAnimations.length;
		}

		getActive(): IAnimationBase{
			return this._pActiveAnimation;
		}

		getTarget(): ISceneNode { 
			return this._pTarget;
		}

		constructor(pEngine: IEngine, sName: string = null, iOptions: int = 0) {
			this.setupSignals();

			this._pEngine = pEngine;
			this.setOptions(iOptions);
			this.name = sName;
		}

		protected setupSignals(): void {
			this.animationAdded = this.animationAdded || new Signal(this);
			this.play = this.play || <any> new PlaySignal(this);
		}

		final getEngine(): IEngine {
			return this._pEngine;
		}

		setOptions(iOptions: int): void {

		}


		addAnimation(pAnimation: IAnimationBase): boolean {
			if (this.findAnimation(pAnimation.getName())) {
				logger.warn("Animation with name <" + pAnimation.getName() + "> already exists in this controller");
				return false;
			}

			//LOG('animation controller :: add animation >> ', pAnimation.name);
			
			this._pAnimations.push(pAnimation);
			this._pActiveAnimation = pAnimation;
			if (/*!pAnimation.isAttached() && */!isNull(this.getTarget())) {
				pAnimation.attach(this.getTarget());
			}
			else {
				//TODO: detach animation
			}

			this.animationAdded.emit(pAnimation);
		}

		removeAnimation(pAnimation: string): boolean;
		removeAnimation(pAnimation: int): boolean;
		removeAnimation(pAnimation: IAnimationBase): boolean;
		removeAnimation(pAnimationArg: any): boolean {
			var pAnimation = this.findAnimation(pAnimationArg);
		    var pAnimations = this._pAnimations;

			for (var i = 0; i < pAnimations.length; ++ i) { 
				if (pAnimations[i] === pAnimation) {
					pAnimations.splice(i, 1);
					logger.log("animation controller :: remove animation >> ", pAnimation.getName());
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
					if (pAnimations[i].getName() === sAnimation) {
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
			debug.assert(iAnimation < this._pAnimations.length, 'invalid animation slot');

			this._pAnimations[iAnimation] = pAnimation;
		}

		attach(pTarget: ISceneNode): void {
			var pAnimations: IAnimationBase[] = this._pAnimations;

		    for (var i: int = 0; i < pAnimations.length; ++ i) {
		        if (!pAnimations[i].isAttached() || this.getTarget() !== pTarget) {
		        	pAnimations[i].attach(pTarget);
		        }
		    }

			if (this.getTarget()) {
				this.getTarget().getScene().postUpdate.disconnect(this, this.update);
		    	//this.disconnect(this.target.scene, SIGNAL(postUpdate), SLOT(update));
		    }

			this._pTarget = pTarget;
			this.getTarget().getScene().postUpdate.connect(this, this.update);
		    //this.connect(this.target.scene, SIGNAL(postUpdate), SLOT(update));
		}

		stop(): void {
			if (this._pActiveAnimation) {
				this._pActiveAnimation.stop(this._pEngine.getTime());
			}

			this._pActiveAnimation = null;
		}

		update(): void {
			var pAnim: IAnimationBase = this._pActiveAnimation;
			if (!isNull(pAnim)) {
				if (!pAnim.apply(this._pEngine.getTime())) {

					// this._pActiveAnimation = null;
					// pAnim.stop(this._pEngine.time);
				}
			}
		}

		_setActiveAnimation(pAnim: IAnimationBase): void {
			this._pActiveAnimation = pAnim;
		}

		toString(bFullInfo: boolean = false): string {
			if (config.DEBUG) {
				var s: string = "\n";
				s += "ANIMATION CONTROLLER (total: " + this.getTotalAnimations() + " animations)\n";
				s += "-----------------------------------------------------\n";

				for (var i: int = 0; i < this.getTotalAnimations(); ++i) {
					s += this.getAnimation(i).toString();
				}

				return s;
			}

			return null;
		}

		static PlaySignal = PlaySignal;
	} 


	export function createController(pEngine: IEngine, sName?: string, iOptions?: int): IAnimationController {
		return new Controller(pEngine, sName, iOptions);
	}
}
