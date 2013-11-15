// AIAnimationController interface
// [write description here...]

/// <reference path="AIEventProvider.ts" />


/// <reference path="AIAnimationBase.ts" />
/// <reference path="AIEngine.ts" />
/// <reference path="AISceneNode.ts" />

interface AIAnimationController extends AIEventProvider {
	name: string;

	/** readonly */ totalAnimations: int;
	/** readonly */ active: AIAnimationBase;
	/** readonly */ target: AISceneNode;

	getEngine(): AIEngine;

	setOptions(eOptions): void;
	addAnimation(pAnimation: AIAnimationBase): boolean;

	removeAnimation(pAnimation: string): boolean;
	removeAnimation(pAnimation: int): boolean;
	removeAnimation(pAnimation: AIAnimationBase): boolean;

	findAnimation(pAnimation: string): AIAnimationBase;
	findAnimation(pAnimation: int): AIAnimationBase;
	findAnimation(pAnimation: AIAnimationBase): AIAnimationBase;

	getAnimation(iAnim: int): AIAnimationBase;

	setAnimation(iAnimation: int, pAnimation: AIAnimationBase): void;
	attach(pTarget: AISceneNode): void;

	signal play(pAnimation: string): boolean;
	signal play(pAnimation: int): boolean;
	signal play(pAnimation: AIAnimationBase): boolean;

	signal animationAdded(pAnimation: AIAnimationBase): void;

	stop(): void;

	update(): void;

	toString(bFullInfo?: boolean);
}