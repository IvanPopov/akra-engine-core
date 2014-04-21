/// <reference path="../idl/IAnimationContainer.ts" />
/// <reference path="../idl/IPositionFrame.ts" />
/// <reference path="../idl/IAnimationBase.ts" />

/// <reference path="Base.ts" />

module akra.animation {
	export class Container extends Base implements IAnimationContainer {

		durationUpdated: ISignal<{ (pContainer: IAnimationContainer, fDuration: float): void; }>;
		enterFrame: ISignal<{ (pContainer: IAnimationContainer, fRealTime: float, fTime: float): void; }>;

		private _bEnable: boolean = true;
		private _fStartTime: float = 0;
		private _fSpeed: float = 1.0;
		private _bLoop: boolean = false;
		private _pAnimation: IAnimationBase = null;
		private _bReverse: boolean = false;
		
		//Время учитывающее циклы и прочее.
		private _fTrueTime: float = 0;	
		//реальное время на сцене
		private _fRealTime: float = 0;	
		//время с учетом ускорений
		private _fTime: float = 0;

		private _bPause: boolean = false;

		//определена ли анимация до первого и после последнего кадров
		private _bLeftInfinity: boolean = true;
		private _bRightInfinity: boolean = true;

		constructor(pAnimation?: IAnimationBase, sName?: string){
			super(EAnimationTypes.CONTAINER, sName);

			if (pAnimation) {
				this.setAnimation(pAnimation);
			}
		}

		protected setupSignals(): void {
			this.durationUpdated = this.durationUpdated || new Signal(this);
			this.enterFrame = this.enterFrame || new Signal(this);

			super.setupSignals();
		}
		

		getAnimationName(): string{
			return this._pAnimation.getName();
		}
		
		getAnimationTime(): float{
			return this._fTrueTime;
		}

		getTime(): float {
			return this._fTime;
		}

		setStartTime(fRealTime: float): void {
			this._fStartTime = fRealTime;
		}

		getStartTime(): float {
			return this._fStartTime;
		}

		setSpeed(fSpeed: float): void {
			this._fSpeed = fSpeed;
			this.setDuration(this._pAnimation.getDuration() / fSpeed);

			this.durationUpdated.emit(this.getDuration());
		}

		getSpeed(): float {
			return this._fSpeed;
		}

		play(fRealTime: float): void {
			this._fRealTime = fRealTime;
		    this._fTime = 0;

		    this.played.emit(this._fTime);
		}

		stop(): void {
			this.stoped.emit(this._fTime);
		}

		attach(pTarget: ISceneNode): void {
			if (!isNull(this._pAnimation)) {
				this._pAnimation.attach(pTarget);
				this.grab(this._pAnimation, true);
			}
		}

		setAnimation(pAnimation: IAnimationBase): void {
			debug.assert(!this._pAnimation, "anim. already exists");

			this._pAnimation = pAnimation;
			this.setSpeed(this.getSpeed());

			if (Container.isContainer(pAnimation) || Blend.isBlend(pAnimation)) {
				(<IAnimationBlend>pAnimation).durationUpdated.connect(this, this._onDurationUpdate);
			}

			this.grab(pAnimation);
		}

		_onDurationUpdate(pAnimation: IAnimationBase, fDuration: float): void {
			this.setSpeed(this.getSpeed());
		}

		getAnimation(): IAnimationBase {
			return this._pAnimation;
		}

		enable(): void {
			this._bEnable = true;
		}

		disable(): void {
			this._bEnable = false;
		}

		isEnabled(): boolean {
			return this._bEnable;
		}

		leftInfinity(bValue: boolean): void {
			this._bLeftInfinity = bValue;
		}

		inLeftInfinity(): boolean {
			return this._bLeftInfinity;
		}

		inRightInfinity(): boolean {
			return this._bRightInfinity;
		}

		rightInfinity(bValue: boolean): void {
			this._bRightInfinity = bValue;
		}

		useLoop(bValue: boolean): void {
			this._bLoop = bValue;
		}

		inLoop(): boolean {
			return this._bLoop;
		}

		reverse(bValue: boolean): void {
			this._bReverse = bValue;
		}

		isReversed(): boolean {
			return this._bReverse;
		}

		pause(bValue: boolean = true): void {
			this._fRealTime = -1;
			this._bPause = bValue;
		}

		rewind(fRealTime: float): void {
			// console.log("rewind > ", fRealTime);
			this._fTrueTime = 0;
			this._fTime = fRealTime;
		}

		isPaused(): boolean {
			return this._bPause;
		}

		protected calcTime(fRealTime: float): void{
			debug.assert(!isNaN(fRealTime), "invalid time");
			

			if (this._bPause) {
		    	return;
		    }

		    //if loop switched and prev. fRealTime less than new fRealTime
		    //for ex.: prev real time calced in loop, next - real time from now()
		    if (this._fRealTime < 0 || this._fRealTime > fRealTime) {
		    	this._fRealTime = fRealTime;
		    }

		    this._fTime = this._fTime + (fRealTime - this._fRealTime) * this._fSpeed;
		    this._fRealTime = fRealTime;

		    var fTime = this._fTime;

			if (this._bLoop) {
				debug.assert(!!this._pAnimation.getDuration(), "invalid animation duration:\n" + this._pAnimation.toString());

		    	fTime = math.mod(fTime, (this._pAnimation.getDuration()));
		    	if (this._bReverse) {
		    		fTime = this._pAnimation.getDuration() - fTime; 
		    	}
		    }

			this._fTrueTime = fTime;
		}

		frame(sName: string, fRealTime: float): IPositionFrame {
			debug.assert(!isNaN(fRealTime), "invalid time");

			if (!this._bEnable) {
		    	return null;
		    }


		    if (this._fRealTime !== fRealTime) {
		    	//only for first bone in list
		    	
		    	this.calcTime(fRealTime);
		    	this.enterFrame.emit(fRealTime, this._fTrueTime);
		    }

		    if (!this._bLeftInfinity  && this._fTrueTime < this.getFirst()) {
		    	return null;
		    }


			if (!this._bRightInfinity && this._fTrueTime > this.getDuration()) {
		    	return null;
		    }    

			return this._pAnimation.frame(sName, this._fTrueTime);
		}


		static isContainer(pAnimation: IAnimationBase): boolean {
			return pAnimation.getType() === EAnimationTypes.CONTAINER;
		}
	} 


	export function createContainer(pAnimation?: IAnimationBase, sName?: string): IAnimationContainer {
		return new Container(pAnimation, sName);
	}
}

