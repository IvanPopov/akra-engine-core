
/// <reference path="IRenderTechnique.ts" />
/// <reference path="IEventProvider.ts" />
/// <reference path="ISceneObject.ts" />
/// <reference path="IRenderData.ts" />
/// <reference path="IViewport.ts" />


module akra {
	enum ERenderableTypes {
		UNKNOWN,
		
		MESH_SUBSET,
		SCREEN,
		SPRITE
	}
	
	interface IRenderableObject extends IEventProvider {
		renderMethod: IRenderMethod;
		shadow: boolean;
	
	    /** readonly */ type: ERenderableTypes;
		/** readonly */ effect: IEffect;
		/** readonly */ surfaceMaterial: ISurfaceMaterial;
		/** readonly */ data: IRenderData;
		/** readonly */ material: IMaterial;
	
		/** writeonly */ onclick:   (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
		/** writeonly */ onmousemove: (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
		/** writeonly */ onmousedown: (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
		/** writeonly */ onmouseup:   (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
		/** writeonly */ onmouseover:   (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
		/** writeonly */ onmouseout:   (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
		
		/** writeonly */ ondragstart:   (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
		/** writeonly */ ondragstop:   (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
		/** writeonly */ ondragging:   (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
	
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
		signal shadowed(bValue: boolean): void;
		/** Notify, before object start rendendering */
		signal beforeRender(pViewport: IViewport, pMethod: IRenderMethod): void;
	
		signal click(pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint);
		
		signal mousemove(pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint);
		signal mousedown(pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint);
		signal mouseup(pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint);
		signal mouseover(pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint);
		signal mouseout(pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint);
	
		signal dragstart(pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint);
		signal dragstop(pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint);
		signal dragging(pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint);
	}
	
}
