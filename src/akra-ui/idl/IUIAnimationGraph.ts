/// <reference path="../../../built/Lib/akra.d.ts" />

/// <reference path="IUIGraph.ts" />
/// <reference path="IUIAnimationNode.ts" />

module akra {
	export interface IUIAnimationGraph extends IUIGraph {
		nodeSelected: ISignal<{ (pGraph: IUIAnimationGraph, pNode: IUIAnimationNode, bPlay: boolean): void; }>;

		getController(): IAnimationController;
	
		selectNode(pNode: IUIAnimationNode, bModified?: boolean): void;
		capture(pController: IAnimationController): boolean;
		
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
