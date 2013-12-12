
/// <reference path="ISceneNode.ts" />


/// <reference path="IRect3d.ts" />
/// <reference path="IRenderableObject.ts" />
/// <reference path="IViewport.ts" />

module akra {
	export interface ISceneObject extends ISceneNode {
		worldBounds: IRect3d;
		totalRenderable: uint;
		shadow: boolean;
		billboard: boolean;

		/** writeonly */ onclick: (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint) => void;
		/** writeonly */ onmousemove: (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint) => void;
		/** writeonly */ onmousedown: (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint) => void;
		/** writeonly */ onmouseup: (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint) => void;
		/** writeonly */ onmouseover: (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint) => void;
		/** writeonly */ onmouseout: (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint) => void;
		/** writeonly */ ondragstart: (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint) => void;
		/** writeonly */ ondragstop: (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint) => void;
		/** writeonly */ ondragging: (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: uint, y: uint) => void;

		/** readonly */ localBounds: IRect3d;

		isBillboard(): boolean;

		getRenderable(i?: uint): IRenderableObject;
		getObjectFlags(): int;

		accessLocalBounds(): IRect3d;
		isWorldBoundsNew(): boolean;

		prepareForRender(pViewport: IViewport): void;

		worldBoundsUpdated: ISignal<{ (pObject: ISceneObject): void; }>;

		click: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>;

		mousemove: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>;
		mousedown: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>;
		mouseup: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>;
		mouseover: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>;
		mouseout: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>;


		dragstart: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>;
		dragstop: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>;
		dragging: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>;
	}
}
