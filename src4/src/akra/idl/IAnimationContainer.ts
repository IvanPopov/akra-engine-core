
/// <reference path="IAnimationBase.ts" />


/// <reference path="IPositionFrame.ts" />

module akra {
	interface IAnimationContainer extends IAnimationBase {
		/** readonly */ animationName: string;
		/** readonly */ speed: float;
		/** readonly */ animationTime: float;
		/** readonly */ time: float;
	
		setAnimation(pAnimation: IAnimationBase): void;
		getAnimation(): IAnimationBase;
	
		enable(): void;
		disable(): void;
		isEnabled(): boolean;
	
		leftInfinity(bValue: boolean): void;
		rightInfinity(bValue: boolean): void;
	
		setStartTime(fRealTime: float): void;
		getStartTime(): float;
	
		inLeftInfinity(): boolean;
		inRightInfinity(): boolean;
	
		setSpeed(fSpeed: float): void;
		getSpeed(): float;
	
		useLoop(bValue: boolean): void;
		inLoop(): boolean;
	
		reverse(bValue: boolean): void;
		isReversed(): boolean;
	
		rewind(fRealTime: float): void;
	
		pause(bValue?: boolean): void;
		isPaused(): boolean;
	
		signal durationUpdated(fDuration: float): void;
		signal enterFrame(fRealTime: float, fTime: float): void;
	}
	
}
