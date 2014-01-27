
/// <reference path="IUIGraphNode.ts" />


/// <reference path="IAnimationBase.ts" />

module akra {
	export interface IUIAnimationNode extends IUIGraphNode {
		getAnimation(): IAnimationBase;
		setAnimation(pAnimation: IAnimationBase): void;
	}
}
