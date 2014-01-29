/// <reference path="IUIAnimationNode.ts" />

module akra {
	export interface IUIAnimationBlender extends IUIAnimationNode {
		getTotalMasks(): int;

		getMaskNode(iAnim: int): IUIAnimationMask;
		setMaskNode(iAnim: int, pNode: IUIAnimationMask): void;

		setup(): void;
	}
}

