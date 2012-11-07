#ifndef ISCENEOBJECT_TS
#define ISCENEOBJECT_TS

#include "ISceneNode.ts"

module akra {
    export interface ISceneObject extends ISceneNode {
    	worldBounds: Rect3d;


    	getObjectFlags(): int;
    }
}

#endif