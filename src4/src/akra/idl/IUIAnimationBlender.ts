// IUIAnimationBlender export interface
// [write description here...]

/// <reference path="IUIAnimationNode.ts" />

module akra {
export interface IUIAnimationBlender extends IUIAnimationNode {
	totalMasks: int;
	
	getMaskNode(iAnim: int): IUIAnimationMask;
	setMaskNode(iAnim: int, pNode: IUIAnimationMask): void;

	setup(): void;
}
}

#endif