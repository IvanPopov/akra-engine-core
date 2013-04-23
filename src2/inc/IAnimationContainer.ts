#ifndef IANIMATIONCONTAINER_TS
#define IANIMATIONCONTAINER_TS

#include "IAnimationBase.ts"

module akra {
	IFACE(IAnimationFrame);

	export interface IAnimationContainer extends IAnimationBase {
		readonly animationName: string;
		readonly speed: float;
		readonly animationTime: float;
		readonly time: float;

		setAnimation(pAnimation: IAnimationBase): void;
		getAnimation(): IAnimationBase;

		enable(): void;
		disable(): void;
		isEnabled(): bool;

		leftInfinity(bValue: bool): void;
		rightInfinity(bValue: bool): void;

		setStartTime(fRealTime: float): void;
		getStartTime(): float;

		inLeftInfinity(): bool;
		inRightInfinity(): bool;

		setSpeed(fSpeed: float): void;
		getSpeed(): float;

		useLoop(bValue: bool): void;
		inLoop(): bool;

		reverse(bValue: bool): void;
		isReversed(): bool;

		rewind(fRealTime: float): void;

		pause(bValue?: bool): void;
		isPaused(): bool;

		signal durationUpdated(fDuration: float): void;
		signal enterFrame(fRealTime: float, fTime: float): void;
	}
}

#endif