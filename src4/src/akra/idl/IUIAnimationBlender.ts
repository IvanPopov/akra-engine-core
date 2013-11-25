// IUIAnimationBlender interface
// [write description here...]

/// <reference path="IUIAnimationNode.ts" />

module akra {
	interface IUIAnimationBlender extends IUIAnimationNode {
		totalMasks: int;
		
		getMaskNode(iAnim: int): IUIAnimationMask;
		setMaskNode(iAnim: int, pNode: IUIAnimationMask): void;

		setup(): void;
	}
}

