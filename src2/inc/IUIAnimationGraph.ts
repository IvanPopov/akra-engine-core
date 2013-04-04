#ifndef IUIANIMATIONGRAPH_TS
#define IUIANIMATIONGRAPH_TS

#include "IUIGraph.ts"

module akra {
	IFACE(IUIAnimationNode);
	IFACE(IAnimationController);
	IFACE(IAnimationBase);

	export interface IUIAnimationGraph extends IUIGraph {
		getController(): IAnimationController;

		// selectNode(pNode: IUIAnimationNode, bPlay?: bool): void;
		
		addAnimation(pAnimation: IAnimationBase): void;
		
		removeAnimation(pAnimation: IAnimationBase);
		removeAnimation(sAnimation: string);
		removeAnimation(iAnimation: int);

		findNodeByAnimation(sName: string): IUIAnimationNode;
		findNodeByAnimation(pAnimation: IAnimationBase): IUIAnimationNode;

		createNodeByController(pController: IAnimationController): void;
		createNodeByAnimation(pAnimation: IAnimationBase): IUIAnimationNode;
	}
}

#endif