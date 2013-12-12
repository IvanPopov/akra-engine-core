
/// <reference path="INode.ts" />


/// <reference path="IAnimationController.ts" />

module akra {
	export enum ESceneNodeFlags {
		FROZEN_PARENT,
		FROZEN_SELF,
		HIDDEN_PARENT,
		HIDDEN_SELF
	}
	
	export interface ISceneNode extends INode {
		/** readonly */ scene: IScene3d;
		/** readonly */ totalControllers: uint;
	
		getController(i?: uint): IAnimationController;
		addController(pController: IAnimationController): void;
	
		isFrozen(): boolean;
		isSelfFrozen(): boolean;
		isParentFrozen(): boolean;
		freeze(value?: boolean): void;
	
		isHidden(): boolean;
		hide(value?: boolean): void;
	
		frozen: ISignal<{ (pNode: ISceneNode, bValue: boolean): void; }>;
		hidden: ISignal <{ (pNode: ISceneNode, bValue: boolean): void ; }>;
	}
}
