// AIUIAnimationBlender interface
// [write description here...]

/// <reference path="AIUIAnimationNode.ts" />

module akra {
interface AIUIAnimationBlender extends AIUIAnimationNode {
	totalMasks: int;
	
	getMaskNode(iAnim: int): AIUIAnimationMask;
	setMaskNode(iAnim: int, pNode: AIUIAnimationMask): void;

	setup(): void;
}
}

#endif