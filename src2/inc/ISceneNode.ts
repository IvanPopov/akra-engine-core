#ifndef ISCENENODE_TS
#define ISCENENODE_TS

#include "INode.ts"

module akra {
	IFACE(IAnimationController);

    export interface ISceneNodeMap {
        [index: string]: ISceneNode;
    }

    export interface ISceneNode extends INode {
    	readonly scene: IScene3d;

    	readonly totalControllers: uint;
    	getController(i?: uint): IAnimationController;
    	addController(pController: IAnimationController): void;

        isFrozen(): bool;
        freeze(value?: bool): void;
    }
}

#endif