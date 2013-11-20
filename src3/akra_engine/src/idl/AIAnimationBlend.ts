// AIAnimationBlend interface
// [write description here...]


/// <reference path="AIAnimationBase.ts" />
/// <reference path="AIMap.ts" />

interface AIAnimationElement {
	animation: AIAnimationBase;
	weight: float;
	mask: AIMap<float>;
	acceleration?: float;
	time: float;
	realTime: float;
}

interface AIAnimationBlend extends AIAnimationBase {
	/** readonly */ totalAnimations: int;

    addAnimation(pAnimation: AIAnimationBase, fWeight?: float, pMask?: AIMap<float>): int;
    setAnimation(iAnimation: int, pAnimation: AIAnimationBase, fWeight?: float, pMask?: AIMap<float>): boolean;
	
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

    setAnimationMask(sName: string, pMask: AIMap<float>): boolean;
    setAnimationMask(iAnimation: int, pMask: AIMap<float>): boolean;
	
    getAnimationMask(sName: string): AIMap<float>;
    getAnimationMask(iAnimation: int): AIMap<float>;

	getAnimationAcceleration(sName: string): float;
	getAnimationAcceleration(iAnimation: int): float;
	
    createAnimationMask(iAnimation?: int): AIMap<float>;

	signal durationUpdated(fDuration: float);
	signal weightUpdated(iAnim: int, fWeight: float);
}
