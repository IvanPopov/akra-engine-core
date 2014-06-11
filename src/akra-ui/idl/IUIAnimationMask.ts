// IUIAnimationMask export interface
// [write description here...]

/// <reference path="IUIAnimationNode.ts" />

module akra {
	export interface IUIAnimationMask extends IUIAnimationNode {
		getMask(): IMap<float>;
	}
}


