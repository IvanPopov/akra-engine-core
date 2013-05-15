#ifndef ANIMATIONCONTAINER_TS
#define ANIMATIONCONTAINER_TS

#include "IAnimationContainer.ts"
#include "IAnimationFrame.ts"
#include "IAnimationBase.ts"

#include "Base.ts"

module akra.animation {
	export class Container extends Base implements IAnimationContainer {

		private _bEnable: bool = true;
		private _fStartTime: float = 0;
		private _fSpeed: float = 1.0;
		private _bLoop: bool = false;
		private _pAnimation: IAnimationBase = null;
		private _bReverse: bool = false;
		
		//Время учитывающее циклы и прочее.
		private _fTrueTime: float = 0;	
		//реальное время на сцене
		private _fRealTime: float = 0;	
		//время с учетом ускорений
		private _fTime: float = 0;		
		private _bPause: bool = false;

		//определена ли анимация до первого и после последнего кадров
		private _bLeftInfinity: bool = true;
		private _bRightInfinity: bool = true;

		constructor(pAnimation?: IAnimationBase, sName?: string){
			super(EAnimationTypes.CONTAINER, sName);

			if (pAnimation) {
				this.setAnimation(pAnimation);
			}
		}

		inline get animationName(): string{
			return this._pAnimation.name;
		}

		inline get speed(): float{
			return this._fSpeed;
		}

		inline get animationTime(): float{
			return this._fTrueTime;
		}

		inline get time(): float {
			return this._fTime;
		}

		play(fRealTime: float): void {
			this._fRealTime = fRealTime;
		    this._fTime = 0;

		    this.played(this._fTime);
		}

		inline stop(): void {
			this.stoped(this._fTime);
		}

		attach(pTarget: ISceneNode): void {
			if (!isNull(this._pAnimation)) {
				this._pAnimation.attach(pTarget);
				this.grab(this._pAnimation, true);
			}
		}

		setAnimation(pAnimation: IAnimationBase): void {
			debug_assert(!this._pAnimation, "anim. already exists");

			this._pAnimation = pAnimation;
			this.setSpeed(this.speed);

			CONNECT(pAnimation, SIGNAL(durationUpdated), this, SLOT(_onDurationUpdate));

			this.grab(pAnimation);
		}

		_onDurationUpdate(pAnimation: IAnimationBase, fDuration: float): void {
			this.setSpeed(this.speed);
		}

		getAnimation(): IAnimationBase {
			return this._pAnimation;
		}

		inline enable(): void {
			this._bEnable = true;
		}

		inline disable(): void {
			this._bEnable = false;
		}

		inline isEnabled(): bool {
			return this._bEnable;
		}

		inline leftInfinity(bValue: bool): void {
			this._bLeftInfinity = bValue;
		}

		inline inLeftInfinity(): bool {
			return this._bLeftInfinity;
		}

		inline inRightInfinity(): bool {
			return this._bRightInfinity;
		}

		inline rightInfinity(bValue: bool): void {
			this._bRightInfinity = bValue;
		}

		inline setStartTime(fRealTime: float): void {
			this._fStartTime = fRealTime;
		}

		inline getStartTime(): float {
			return this._fStartTime;
		}

		setSpeed(fSpeed: float): void {
			this._fSpeed = fSpeed;
			this.duration = this._pAnimation.duration / fSpeed;
			
			this.durationUpdated(this.duration);
		}

		inline getSpeed(): float {
			return this._fSpeed;
		}

		inline useLoop(bValue: bool): void {
			this._bLoop = bValue;
		}

		inline inLoop(): bool {
			return this._bLoop;
		}

		inline reverse(bValue: bool): void {
			this._bReverse = bValue;
		}

		inline isReversed(): bool {
			return this._bReverse;
		}

		pause(bValue: bool = true): void {
			this._fRealTime = -1;
			this._bPause = bValue;
		}

		inline rewind(fRealTime: float): void {
			this._fTime = fRealTime;
		}

		inline isPaused(): bool {
			return this._bPause;
		}

		protected calcTime(fRealTime: float): void{
			if (this._bPause) {
		    	return;
		    }

		    if (this._fRealTime < 0) {
		    	this._fRealTime = fRealTime;
		    }

		    this._fTime = this._fTime + (fRealTime - this._fRealTime) * this._fSpeed;
		    this._fRealTime = fRealTime;

		    var fTime = this._fTime;

		    if (this._bLoop) {
		    	fTime = math.mod(fTime, (this._pAnimation.duration));
		    	if (this._bReverse) {
		    		fTime = this._pAnimation.duration - fTime; 
		    	}
		    }

		    this._fTrueTime = fTime;
		}

		frame(sName: string, fRealTime: float): IAnimationFrame {
			if (!this._bEnable) {
		    	return null;
		    }


		    if (this._fRealTime !== fRealTime) {
		    	//only for first bone in list
		    	
		    	this.calcTime(fRealTime);
		    	this.enterFrame(fRealTime, this._fTrueTime);
		    }

		    if (!this._bLeftInfinity && this._fRealTime < this._fStartTime) {
		    	return null;
		    }


			if (!this._bRightInfinity && this._fTrueTime > this.duration) {
		    	return null;
		    }    

			return this._pAnimation.frame(sName, this._fTrueTime);
		}


		BROADCAST(durationUpdated, CALL(fDuration));
		BROADCAST(enterFrame, CALL(fRealTime, fTime));
	} 

	export inline function isContainer(pAnimation: IAnimationBase): bool {
		return pAnimation.type === EAnimationTypes.CONTAINER;
	}

	export function createContainer(pAnimation?: IAnimationBase, sName?: string): IAnimationContainer {
		return new Container(pAnimation, sName);
	}
}

#endif