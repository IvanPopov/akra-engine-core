
/// <reference path="IRenderTechnique.ts" />
/// <reference path="IEventProvider.ts" />
/// <reference path="ISceneObject.ts" />
/// <reference path="IRenderData.ts" />
/// <reference path="IViewport.ts" />
/// <reference path="IClickable.ts" />

module akra {
	export enum ERenderableTypes {
		UNKNOWN,

		MESH_SUBSET,
		SCREEN,
		SPRITE
	}

	export interface IRenderableObject extends IEventProvider, IClickable {
		getRenderMethod(): IRenderMethod;
		setRenderMethod(pMethod: IRenderMethod): void;

		getShadow(): boolean;
		setShadow(bValue: boolean): void;

		getType(): ERenderableTypes;
		getEffect(): IEffect;
		getSurfaceMaterial(): ISurfaceMaterial;
		getData(): IRenderData;
		getMaterial(): IMaterial;

		getRenderer(): IRenderer;
		getTechnique(sName?: string): IRenderTechnique;
		getTechniqueDefault(): IRenderTechnique;
		getRenderID(pObject: ISceneObject): int;

		destroy(): void;
		setVisible(bVisible?: boolean): void;
		isVisible(): boolean;

		addRenderMethod(pMethod: IRenderMethod, csName?: string): boolean;
		addRenderMethod(csMethod: string, csName?: string): boolean;

		// findRenderMethod(csName: string): uint;
		switchRenderMethod(csName: string): boolean;
		switchRenderMethod(pMethod: IRenderMethod): boolean;

		removeRenderMethod(csName: string): boolean;
		getRenderMethodByName(csName?: string): IRenderMethod;

		getRenderMethodDefault(): IRenderMethod;

		isReadyForRender(): boolean;
		isAllMethodsLoaded(): boolean;
		isFrozen(): boolean;

		/** 
		 * Display with wireframe.
		 * @param bEnable Enable/Disable wireframe display mode.
		 * @param bOverlay If TRUE, wireframe will be overlayed into default material; Default is TRUE.
		 */
		wireframe(bEnable?: boolean, bOverlay?: boolean): boolean;

		render(pViewport: IViewport, csMethod?: string, pSceneObject?: ISceneObject): void;

		_setRenderData(pData: IRenderData): void;
		_setup(pRenderer: IRenderer, csDefaultMethod?: string): void;
		_draw(): void;

		/** Notify, when shadow added or removed. */
		shadowed: ISignal<{ (pRenderable: IRenderableObject, bValue: boolean): void; }>;
		///** Notify, before object start rendendering */

		beforeRender: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pMethod: IRenderMethod): void; }>;

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
