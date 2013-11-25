
/// <reference path="IUIGraphControls.ts" />


/// <reference path="IUIAnimationGraph.ts" />

module akra {
	interface IUIAnimationControls extends IUIGraphControls {
		/** readonly */ graph: IUIAnimationGraph;
	}
}
