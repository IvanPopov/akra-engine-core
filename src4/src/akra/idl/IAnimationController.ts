
/// <reference path="IEventProvider.ts" />


/// <reference path="IAnimationBase.ts" />
/// <reference path="IEngine.ts" />
/// <reference path="ISceneNode.ts" />

module akra {
	export interface IAnimationController extends IEventProvider {
		name: string;

		getTotalAnimations(): int;
		getActive(): IAnimationBase;
		getTarget(): ISceneNode;

		getEngine(): IEngine;

		setOptions(eOptions): void;
		addAnimation(pAnimation: IAnimationBase): boolean;

		removeAnimation(pAnimation: string): boolean;
		removeAnimation(pAnimation: int): boolean;
		removeAnimation(pAnimation: IAnimationBase): boolean;

		findAnimation(pAnimation: string): IAnimationBase;
		findAnimation(pAnimation: int): IAnimationBase;
		findAnimation(pAnimation: IAnimationBase): IAnimationBase;

		getAnimation(iAnim: int): IAnimationBase;

		setAnimation(iAnimation: int, pAnimation: IAnimationBase): void;
		attach(pTarget: ISceneNode): void;

		//uses in PlaySignal
		_setActiveAnimation(pAnimation: IAnimationBase): void;

		animationAdded: ISignal<{ (pController: IAnimationController, pAnimation: IAnimationBase): void; }>;
		play: ISignal<{ (pController: IAnimationController, pAnimation: IAnimationBase, fRealTime: float): void; }>;

		stop(): void;

		update(): void;

		toString(bFullInfo?: boolean);
	}
}
