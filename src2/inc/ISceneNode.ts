#ifndef ISCENENODE_TS
#define ISCENENODE_TS

#include "INode.ts"

module akra {
	IFACE(IAnimationController);

    export interface ISceneNodeMap {
        [index: string]: ISceneNode;
    }

    export enum ESceneNodeFlags {
        FROZEN_PARENT,
        FROZEN_SELF,
        HIDDEN_PARENT,
        HIDDEN_SELF
    }

    export interface ISceneNode extends INode {
    	readonly scene: IScene3d;
    	readonly totalControllers: uint;

    	getController(i?: uint): IAnimationController;
    	addController(pController: IAnimationController): void;

        isFrozen(): bool;
        isSelfFrozen(): bool;
        isParentFrozen(): bool;
        freeze(value?: bool): void;

        isHidden(): bool;
        hide(value?: bool): void;

        signal frozen(value: bool): void;
        signal hidden(value: bool): void;
    }
}

#endif