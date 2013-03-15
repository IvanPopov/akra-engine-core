#ifndef UIANIMATIONGRAPH_TS
#define UIANIMATIONGRAPH_TS

#include "IUIAnimationGraph.ts"
#include "../graph/Graph.ts"

module akra.ui.animation {
	export class Graph extends graph.Graph implements IUIAnimationGraph {
		constructor (parent) {
			super(parent, EUIGraphTypes.ANIMATION);
		}

		label(): string {
			return "AnimationGraph";
		}

		getController(): IAnimationController {
			return null;
		}

		selectNode(pNode: IUIAnimationNode, bPlay?: bool): void {

		}
		
		addAnimation(pAnimation: IAnimationBase): void {

		}
		
		removeAnimation(pAnimation: IAnimationBase): void;
		removeAnimation(sAnimation: string): void;
		removeAnimation(iAnimation: int): void;
		removeAnimation(animation): void {

		}

		findNodeByAnimation(sName: string): IAnimationBase {
			return null;
		}

		createNodeByController(pController: IAnimationController): IUIAnimationNode {
			return null;
		}

		createNodeByAnimation(pAnimation: IAnimationBase): IUIAnimationNode {
			return null;
		}
	}

	Component.register("AnimationGraph", Graph);
}

#endif
