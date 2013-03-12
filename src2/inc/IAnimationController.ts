#ifndef IANIMATIONCONTROLLER_TS
#define IANIMATIONCONTROLLER_TS

module akra {
	IFACE(IAnimationBase);
	IFACE(IEngine);
	IFACE(ISceneNode);

	export interface IAnimationController{
		readonly totalAnimations: int;
		readonly active: IAnimationBase;

		getEngine(): IEngine;
		setOptions(eOptions): void;
		addAnimation(pAnimation: IAnimationBase): bool;

		removeAnimation(): bool;

		findAnimation(pAnimation: string): IAnimationBase;
		findAnimation(pAnimation: int): IAnimationBase;
		findAnimation(pAnimation: IAnimationBase): IAnimationBase;

		getAnimation(iAnim: int): IAnimationBase;

		setAnimation(iAnimation: int, pAnimation: IAnimationBase): void;
		bind(pTarget: ISceneNode): void;
		play(pAnimation: IAnimationBase, fRealTime: float): bool;

		update(fTime: float): void;
	}
}

#endif