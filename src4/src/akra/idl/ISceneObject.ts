
/// <reference path="ISceneNode.ts" />
/// <reference path="IControllable.ts" />
/// <reference path="IClickable.ts" />

/// <reference path="IRect3d.ts" />
/// <reference path="IRenderableObject.ts" />
/// <reference path="IViewport.ts" />

module akra {
	export interface ISceneObject extends ISceneNode, IControllable, IClickable {
		getTotalRenderable(): uint;

		getWorldBounds(): IRect3d;
		//setWorldBounds(pWorldBounds: IRect3d): void;

		getLocalBounds(): IRect3d;
		accessLocalBounds(): IRect3d;

		getShadow(): boolean;
		setShadow(bValue: boolean): void;

		getBillboard(): boolean;
		setBillboard(bValue: boolean): void;
		
		isBillboard(): boolean;

		getRenderable(i?: uint): IRenderableObject;
		getObjectFlags(): int;

		getRenderID(): int;
		/**
		 * Get unique render id.
		 * Render ID used to identify the object in each pixel of viewport/screen.
		 * @param iRenderable Number of renderable object.
		 */
		getRenderID(iRenderable: int): int;
		
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
