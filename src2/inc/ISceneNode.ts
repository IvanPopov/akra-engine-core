#ifndef ISCENENODE_TS
#define ISCENENODE_TS

#include "INode.ts"

module akra {
    export interface ISceneNode extends INode {
    	scene: IScene3d;
    	
    	render(): void;
    	prepareForRender(): void;
    	recursiveRender(): void;
    }
}

#endif