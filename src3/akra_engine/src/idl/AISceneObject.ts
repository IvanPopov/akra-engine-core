// AISceneObject interface
// [write description here...]

/// <reference path="AISceneNode.ts" />


/// <reference path="AIRect3d.ts" />
/// <reference path="AIRenderableObject.ts" />
/// <reference path="AIViewport.ts" />

interface AISceneObject extends AISceneNode {
	worldBounds: AIRect3d;
	totalRenderable: uint;
	shadow: boolean;
	billboard: boolean;

	/** writeonly */ onclick: (pObject: AISceneObject, pViewport: AIViewport, pRenderable: AIRenderableObject, x: uint, y: uint) => void;
	/** writeonly */ onmousemove: (pObject: AISceneObject, pViewport: AIViewport, pRenderable: AIRenderableObject, x: uint, y: uint) => void;
	/** writeonly */ onmousedown: (pObject: AISceneObject, pViewport: AIViewport, pRenderable: AIRenderableObject, x: uint, y: uint) => void;
	/** writeonly */ onmouseup: (pObject: AISceneObject, pViewport: AIViewport, pRenderable: AIRenderableObject, x: uint, y: uint) => void;
	/** writeonly */ onmouseover: (pObject: AISceneObject, pViewport: AIViewport, pRenderable: AIRenderableObject, x: uint, y: uint) => void;
	/** writeonly */ onmouseout: (pObject: AISceneObject, pViewport: AIViewport, pRenderable: AIRenderableObject, x: uint, y: uint) => void;
	/** writeonly */ ondragstart: (pObject: AISceneObject, pViewport: AIViewport, pRenderable: AIRenderableObject, x: uint, y: uint) => void;
	/** writeonly */ ondragstop: (pObject: AISceneObject, pViewport: AIViewport, pRenderable: AIRenderableObject, x: uint, y: uint) => void;
	/** writeonly */ ondragging: (pObject: AISceneObject, pViewport: AIViewport, pRenderable: AIRenderableObject, x: uint, y: uint) => void;

	/** readonly */ localBounds: AIRect3d;

	isBillboard(): boolean;
	
	getRenderable(i?: uint): AIRenderableObject;
	getObjectFlags(): int;

	accessLocalBounds(): AIRect3d;
	isWorldBoundsNew(): boolean;

	prepareForRender(pViewport: AIViewport): void;
	
	signal worldBoundsUpdated(): void;

	signal click(pViewport: AIViewport, pRenderable: AIRenderableObject, x: uint, y: uint);
	signal mousemove(pViewport: AIViewport, pRenderable: AIRenderableObject, x: uint, y: uint);
	signal mousedown(pViewport: AIViewport, pRenderable: AIRenderableObject, x: uint, y: uint);
	signal mouseup(pViewport: AIViewport, pRenderable: AIRenderableObject, x: uint, y: uint);
	signal mouseover(pViewport: AIViewport, pRenderable: AIRenderableObject, x: uint, y: uint);
	signal mouseout(pViewport: AIViewport, pRenderable: AIRenderableObject, x: uint, y: uint);

	signal dragstart(pViewport: AIViewport, pRenderable: AIRenderableObject, x: uint, y: uint);
	signal dragstop(pViewport: AIViewport, pRenderable: AIRenderableObject, x: uint, y: uint);
	signal dragging(pViewport: AIViewport, pRenderable: AIRenderableObject, x: uint, y: uint);
}