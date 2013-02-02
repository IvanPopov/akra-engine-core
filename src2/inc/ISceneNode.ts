#ifndef ISCENENODE_TS
#define ISCENENODE_TS

#include "INode.ts"

module akra {
    export interface ISceneNode extends INode {
    	scene: IScene3d;
    	
    	/** @deprecated */
    	render(): void;
    	/** @deprecated */
    	prepareForRender(): void;
    	/** @deprecated */
    	recursiveRender(): void;
    }
}

#endif