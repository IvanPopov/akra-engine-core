// AIAnimationBlend interface
// [write description here...]


/// <reference path="AIAnimationBase.ts" />

interface AIAnimationElement {
	animation: AIAnimationBase;
	weight: float;
	mask: FloatMap;
	acceleration?: float;
	time: float;
	realTime: float;
}

interface AIAnimationBlend extends AIAnimationBase {
	/** readonly */ totalAnimations: int;

	addAnimation(pAnimation: AIAnimationBase, fWeight?: float, pMask?: FloatMap): int;
	setAnimation(iAnimation: int, pAnimation: AIAnimationBase, fWeight?: float, pMask?: FloatMap): boolean;
	
	getAnimationIndex(sName: string): int;
	getAnimation(sName: string): AIAnimationBase;
	getAnimation(iAnimation: int): AIAnimationBase;
	getAnimationWeight(sName: string): float;
	getAnimationWeight(iAnimation: int): float;

	swapAnimations(i: int, j: int): boolean;
	removeAnimation(iAnimation: int): boolean;
	
	setWeights(...pWeight: float[]): boolean;
	setWeightSwitching(fWeight: float, iAnimationFrom: int, iAnimationTo: int): boolean;
	setAnimationWeight(iAnimation: int, fWeight: float): boolean;
	setAnimationWeight(fWeight: float): boolean;

	setAnimationMask(sName: string, pMask: FloatMap): boolean;
	setAnimationMask(iAnimation: int, pMask: FloatMap): boolean;
	
	getAnimationMask(sName: string): FloatMap;
	getAnimationMask(iAnimation: int): FloatMap;

	getAnimationAcceleration(sName: string): float;
	getAnimationAcceleration(iAnimation: int): float;
	
	createAnimationMask(iAnimation?: int): FloatMap;

	signal durationUpdated(fDuration: float);
	signal weightUpdated(iAnim: int, fWeight: float);
}