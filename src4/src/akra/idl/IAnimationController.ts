
/// <reference path="IEventProvider.ts" />


/// <reference path="IAnimationBase.ts" />
/// <reference path="IEngine.ts" />
/// <reference path="ISceneNode.ts" />

module akra {
	interface IAnimationController extends IEventProvider {
		name: string;
	
		/** readonly */ totalAnimations: int;
		/** readonly */ active: IAnimationBase;
		/** readonly */ target: ISceneNode;
	
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
	
		signal play(pAnimation: string): boolean;
		signal play(pAnimation: int): boolean;
		signal play(pAnimation: IAnimationBase): boolean;
	
		signal animationAdded(pAnimation: IAnimationBase): void;
	
		stop(): void;
	
		update(): void;
	
		toString(bFullInfo?: boolean);
	}
}
