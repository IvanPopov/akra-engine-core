#ifndef ISCENEOBJECT_TS
#define ISCENEOBJECT_TS

#include "ISceneNode.ts"

module akra {
    IFACE(IRect3d);
	IFACE(IRenderableObject);
    
    export interface ISceneObject extends ISceneNode {
    	worldBounds: IRect3d;
    	totalRenderable: uint;

    	readonly localBounds: IRect3d;
    	
        getRenderable(i?: uint): IRenderableObject;
    	getObjectFlags(): int;

    	accessLocalBounds(): IRect3d;
    	isWorldBoundsNew(): bool;
    	// recalcWorldBounds(): void;

    	hasShadows(): bool;
    	setShadows(bValue?: bool): void;

        signal worldBoundsUpdated(): void;
    }
}

#endif