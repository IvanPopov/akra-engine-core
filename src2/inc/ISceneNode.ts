#ifndef ISCENENODE_TS
#define ISCENENODE_TS

#include "INode.ts"

module akra {
    export interface ISceneNodeMap {
        [index: string]: ISceneNode;
    }

    export interface ISceneNode extends INode {
    	scene: IScene3d;
    }
}

#endif