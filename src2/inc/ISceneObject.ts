#ifndef ISCENEOBJECT_TS
#define ISCENEOBJECT_TS

#include "ISceneNode.ts"

module akra {
    IFACE(IRect3d);
	IFACE(IRenderableObject);
    IFACE(IViewport);
    
    export interface ISceneObject extends ISceneNode {
    	worldBounds: IRect3d;
    	totalRenderable: uint;
        shadow: bool;

        writeonly onclick: (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint) => void;
        writeonly onmousemove: (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint) => void;
        writeonly onmousedown: (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint) => void;
        writeonly onmouseup: (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint) => void;
        writeonly onmouseover: (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint) => void;
        writeonly onmouseout: (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint) => void;
        writeonly ondragstart: (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint) => void;
        writeonly ondragstop: (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint) => void;
        writeonly ondragging: (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint) => void;

    	readonly localBounds: IRect3d;
    	
        getRenderable(i?: uint): IRenderableObject;
    	getObjectFlags(): int;

    	accessLocalBounds(): IRect3d;
    	isWorldBoundsNew(): bool;

        prepareForRender(pViewport: IViewport): void;
        
        signal worldBoundsUpdated(): void;

        signal click(pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint);
        signal mousemove(pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint);
        signal mousedown(pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint);
        signal mouseup(pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint);
        signal mouseover(pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint);
        signal mouseout(pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint);

        signal dragstart(pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint);
        signal dragstop(pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint);
        signal dragging(pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint);
    }
}

#endif