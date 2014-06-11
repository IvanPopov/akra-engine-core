/// <reference path="../../../built/Lib/akra.d.ts" />

/// <reference path="IUIGraphNode.ts" />

module akra {
	export interface IUIAnimationNode extends IUIGraphNode {
		getAnimation(): IAnimationBase;
		setAnimation(pAnimation: IAnimationBase): void;
	}
}
