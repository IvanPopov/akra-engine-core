
/// <reference path="IAnimationBase.ts" />


/// <reference path="IPositionFrame.ts" />

module akra {
	export interface IAnimationContainer extends IAnimationBase {
		getAnimationName(): string;
		getAnimationTime(): float;
		getTime(): float;

		getSpeed(): float;
		setSpeed(fSpeed: float): void;
	
		getAnimation(): IAnimationBase;
		setAnimation(pAnimation: IAnimationBase): void;
	
		setStartTime(fRealTime: float): void;
		getStartTime(): float;

		enable(): void;
		disable(): void;
		isEnabled(): boolean;
	
		leftInfinity(bValue: boolean): void;
		rightInfinity(bValue: boolean): void;
	
	
		inLeftInfinity(): boolean;
		inRightInfinity(): boolean;
	
		useLoop(bValue: boolean): void;
		inLoop(): boolean;
	
		reverse(bValue: boolean): void;
		isReversed(): boolean;
	
		rewind(fRealTime: float): void;
	
		pause(bValue?: boolean): void;
		isPaused(): boolean;
	
		durationUpdated: ISignal<{ (pContainer: IAnimationContainer, fDuration: float): void; }>;
		enterFrame: ISignal <{ (pContainer: IAnimationContainer, fRealTime: float, fTime: float): void ; }>;
	}
	
}
