// AIUIAnimationGraph interface
// [write description here...]

/// <reference path="AIUIGraph.ts" />


/// <reference path="AIUIAnimationNode.ts" />
/// <reference path="AIAnimationController.ts" />
/// <reference path="AIAnimationBase.ts" />

interface AIUIAnimationGraph extends AIUIGraph {
	getController(): AIAnimationController;

	selectNode(pNode: AIUIAnimationNode, bModified?: boolean): void;
	capture(pController: AIAnimationController): boolean;
	
	addAnimation(pAnimation: AIAnimationBase): void;
	
	removeAnimation(pAnimation: AIAnimationBase);
	removeAnimation(sAnimation: string);
	removeAnimation(iAnimation: int);

	findNodeByAnimation(sName: string): AIUIAnimationNode;
	findNodeByAnimation(pAnimation: AIAnimationBase): AIUIAnimationNode;

	createNodeByController(pController: AIAnimationController): void;
	createNodeByAnimation(pAnimation: AIAnimationBase): AIUIAnimationNode;
}