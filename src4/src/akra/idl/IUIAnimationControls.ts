
/// <reference path="IUIGraphControls.ts" />


/// <reference path="IUIAnimationGraph.ts" />

module akra {
	export interface IUIAnimationControls extends IUIGraphControls {
		/** readonly */ graph: IUIAnimationGraph;
	}
}
