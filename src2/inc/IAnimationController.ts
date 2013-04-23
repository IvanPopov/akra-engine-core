#ifndef IANIMATIONCONTROLLER_TS
#define IANIMATIONCONTROLLER_TS

#include "IEventProvider.ts"

module akra {
	IFACE(IAnimationBase);
	IFACE(IEngine);
	IFACE(ISceneNode);

	export interface IAnimationController extends IEventProvider {
		readonly totalAnimations: int;
		readonly active: IAnimationBase;

		getEngine(): IEngine;

		setOptions(eOptions): void;
		addAnimation(pAnimation: IAnimationBase): bool;

		removeAnimation(pAnimation: string): bool;
		removeAnimation(pAnimation: int): bool;
		removeAnimation(pAnimation: IAnimationBase): bool;

		findAnimation(pAnimation: string): IAnimationBase;
		findAnimation(pAnimation: int): IAnimationBase;
		findAnimation(pAnimation: IAnimationBase): IAnimationBase;

		getAnimation(iAnim: int): IAnimationBase;

		setAnimation(iAnimation: int, pAnimation: IAnimationBase): void;
		attach(pTarget: ISceneNode): void;

		signal play(pAnimation: string, fRealTime: float): bool;
		signal play(pAnimation: int, fRealTime: float): bool;
		signal play(pAnimation: IAnimationBase, fRealTime: float): bool;

		signal animationAdded(pAnimation: IAnimationBase): void;

		update(fTime: float): void;

		toString(bFullInfo?: bool);
	}
}

#endif