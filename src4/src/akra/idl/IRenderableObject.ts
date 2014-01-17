
/// <reference path="IRenderTechnique.ts" />
/// <reference path="IEventProvider.ts" />
/// <reference path="ISceneObject.ts" />
/// <reference path="IRenderData.ts" />
/// <reference path="IViewport.ts" />


module akra {
	export enum ERenderableTypes {
		UNKNOWN,

		MESH_SUBSET,
		SCREEN,
		SPRITE
	}

	export interface IRenderableObject extends IEventProvider {
		renderMethod: IRenderMethod;
		shadow: boolean;

		/** readonly */ type: ERenderableTypes;
		/** readonly */ effect: IEffect;
		/** readonly */ surfaceMaterial: ISurfaceMaterial;
		/** readonly */ data: IRenderData;
		/** readonly */ material: IMaterial;

		/** writeonly */ onclick: (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
		/** writeonly */ onmousemove: (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
		/** writeonly */ onmousedown: (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
		/** writeonly */ onmouseup: (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
		/** writeonly */ onmouseover: (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
		/** writeonly */ onmouseout: (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;

		/** writeonly */ ondragstart: (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
		/** writeonly */ ondragstop: (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
		/** writeonly */ ondragging: (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;

		getRenderer(): IRenderer;
		getTechnique(sName?: string): IRenderTechnique;
		getTechniqueDefault(): IRenderTechnique;

		destroy(): void;
		setVisible(bVisible?: boolean): void;
		isVisible(): boolean;

		addRenderMethod(pMethod: IRenderMethod, csName?: string): boolean;
		addRenderMethod(csMethod: string, csName?: string): boolean;

		// findRenderMethod(csName: string): uint;
		switchRenderMethod(csName: string): boolean;
		switchRenderMethod(pMethod: IRenderMethod): boolean;

		removeRenderMethod(csName: string): boolean;
		getRenderMethod(csName?: string): IRenderMethod;

		getRenderMethodDefault(): IRenderMethod;

		isReadyForRender(): boolean;
		isAllMethodsLoaded(): boolean;
		isFrozen(): boolean;

		wireframe(enable?: boolean, bOverlay?: boolean): boolean;

		render(pViewport: IViewport, csMethod?: string, pSceneObject?: ISceneObject): void;

		_setRenderData(pData: IRenderData): void;
		_setup(pRenderer: IRenderer, csDefaultMethod?: string): void;
		_draw(): void;

		/** Notify, when shadow added or removed. */
		shadowed: ISignal<{ (bValue: boolean): void; }>;
		///** Notify, before object start rendendering */
		beforeRender: ISignal<{ (pViewport, pMethod): void; }>;

		click: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }>;
		mousemove: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }>;
		mousedown: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }>;
		mouseup: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }>;
		mouseover: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }>;
		mouseout: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }>;
		dragstart: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }>;
		dragstop: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }>;
		dragging: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }>;
	}

}
