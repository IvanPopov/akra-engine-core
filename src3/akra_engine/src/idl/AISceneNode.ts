// AISceneNode interface
// [write description here...]

/// <reference path="AINode.ts" />


/// <reference path="AIAnimationController.ts" />

interface AISceneNodeMap {
	[index: string]: AISceneNode;
}

enum AESceneNodeFlags {
	FROZEN_PARENT,
	FROZEN_SELF,
	HIDDEN_PARENT,
	HIDDEN_SELF
}

interface AISceneNode extends AINode {
	/** readonly */ scene: AIScene3d;
	/** readonly */ totalControllers: uint;

	getController(i?: uint): AIAnimationController;
	addController(pController: AIAnimationController): void;

	isFrozen(): boolean;
	isSelfFrozen(): boolean;
	isParentFrozen(): boolean;
	freeze(value?: boolean): void;

	isHidden(): boolean;
	hide(value?: boolean): void;

	signal frozen(value: boolean): void;
	signal hidden(value: boolean): void;
}