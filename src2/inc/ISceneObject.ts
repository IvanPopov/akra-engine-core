#ifndef ISCENEOBJECT_TS
#define ISCENEOBJECT_TS

#include "ISceneNode.ts"

module akra {
	IFACE(IRect3d);

    export interface ISceneObject extends ISceneNode {
    	worldBounds: IRect3d;
    	localBounds: IRect3d;
    	

    	getObjectFlags(): int;
    }
}

#endif