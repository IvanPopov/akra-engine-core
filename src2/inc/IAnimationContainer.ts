#ifndef IANIMATIONCONTAINER_TS
#define IANIMATIONCONTAINER_TS

module akra {
	IFACE(IAnimationBase);
	IFACE(IAnimationFrame);

	export interface IAnimationContainer extends IAnimationBase {
		readonly animationName: string;
		readonly speed: float;
		readonly animationTime: float;

		getTime(): float;
		play(fRealTime: float): void;
		stop(): void;

		attach(pTarget: INode): void;

		setAnimation(pAnimation: IAnimationBase): void;
		getAnimation(): IAnimationBase;

		enable(): void;
		disable(): void;
		isEnabled(): bool;

		leftInfinity(bValue: bool): void;
		rightInfinity(bValue: bool): void;

		setStartTime(fRealTime: float): void;
		getStartTime(): float;

		setSpeed(fSpeed: float): void;
		getSpeed(): float;

		useLoop(bValue: bool): void;
		inLoop(): bool;

		reverse(bValue: bool): void;
		isReversed(): bool;

		pause(bValue: bool): void;
		rewind(fRealTime: float): void;
		isPaused(): bool;

		time(fRealTime: float): void;

		frame(sName: string, fRealTime: float): IAnimationFrame;
	}
}

#endif