#ifndef ISCENEOBJECT_TS
#define ISCENEOBJECT_TS

#include "ISceneNode.ts"

module akra {
    IFACE(IRect3d);
	IFACE(IRenderableObject);
    
    export interface ISceneObject extends ISceneNode {
    	worldBounds: IRect3d;
    	
    	readonly localBounds: IRect3d;
    	
        getRenderable(): IRenderableObject;
    	getObjectFlags(): int;

    	accessLocalBounds(): IRect3d;
    	isWorldBoundsNew(): bool;
    	recalcWorldBounds(): void;

    	prepareForRender(): void;
    	render(): void;

    	hasShadows(): bool;
    	setShadows(bValue?: bool): void;
    }
}

#endif