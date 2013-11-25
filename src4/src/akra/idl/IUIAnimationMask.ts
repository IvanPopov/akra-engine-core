// IUIAnimationMask interface
// [write description here...]

/// <reference path="IUIAnimationNode.ts" />

module akra {
	interface IUIAnimationMask extends IUIAnimationNode {
		getMask(): FloatMap;
	}
}
