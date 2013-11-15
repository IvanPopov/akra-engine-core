// AIRenderableObject interface
// [write description here...]

/// <reference path="AIRenderTechnique.ts" />
/// <reference path="AIEventProvider.ts" />
/// <reference path="AISceneObject.ts" />
/// <reference path="AIRenderData.ts" />
/// <reference path="AIViewport.ts" />


enum AERenderableTypes {
	UNKNOWN,
	
	MESH_SUBSET,
	SCREEN,
	SPRITE
}

interface AIRenderableObject extends AIEventProvider {
	renderMethod: AIRenderMethod;
	shadow: boolean;

    /** readonly */ type: AERenderableTypes;
	/** readonly */ effect: AIEffect;
	/** readonly */ surfaceMaterial: AISurfaceMaterial;
	/** readonly */ data: AIRenderData;
	/** readonly */ material: AIMaterial;

	/** writeonly */ onclick:   (pRenderable: AIRenderableObject, pViewport: AIViewport, pObject: AISceneObject, x: uint, y: uint) => void;
	/** writeonly */ onmousemove: (pRenderable: AIRenderableObject, pViewport: AIViewport, pObject: AISceneObject, x: uint, y: uint) => void;
	/** writeonly */ onmousedown: (pRenderable: AIRenderableObject, pViewport: AIViewport, pObject: AISceneObject, x: uint, y: uint) => void;
	/** writeonly */ onmouseup:   (pRenderable: AIRenderableObject, pViewport: AIViewport, pObject: AISceneObject, x: uint, y: uint) => void;
	/** writeonly */ onmouseover:   (pRenderable: AIRenderableObject, pViewport: AIViewport, pObject: AISceneObject, x: uint, y: uint) => void;
	/** writeonly */ onmouseout:   (pRenderable: AIRenderableObject, pViewport: AIViewport, pObject: AISceneObject, x: uint, y: uint) => void;
	
	/** writeonly */ ondragstart:   (pRenderable: AIRenderableObject, pViewport: AIViewport, pObject: AISceneObject, x: uint, y: uint) => void;
	/** writeonly */ ondragstop:   (pRenderable: AIRenderableObject, pViewport: AIViewport, pObject: AISceneObject, x: uint, y: uint) => void;
	/** writeonly */ ondragging:   (pRenderable: AIRenderableObject, pViewport: AIViewport, pObject: AISceneObject, x: uint, y: uint) => void;

	getRenderer(): AIRenderer;
	getTechnique(sName?: string): AIRenderTechnique;
	getTechniqueDefault(): AIRenderTechnique;

	destroy(): void;
	setVisible(bVisible?: boolean): void;
	isVisible(): boolean;

	addRenderMethod(pMethod: AIRenderMethod, csName?: string): boolean;
	addRenderMethod(csMethod: string, csName?: string): boolean;
	
	// findRenderMethod(csName: string): uint;
	switchRenderMethod(csName: string): boolean;
	switchRenderMethod(pMethod: AIRenderMethod): boolean;
	
	removeRenderMethod(csName: string): boolean;
	getRenderMethod(csName?: string): AIRenderMethod;
	
	getRenderMethodDefault(): AIRenderMethod; 

	isReadyForRender(): boolean;
	isAllMethodsLoaded(): boolean;
	isFrozen(): boolean;

	wireframe(enable?: boolean, bOverlay?: boolean): boolean;

	render(pViewport: AIViewport, csMethod?: string, pSceneObject?: AISceneObject): void;

	_setRenderData(pData: AIRenderData): void;
	_setup(pRenderer: AIRenderer, csDefaultMethod?: string): void;
	_draw(): void;

	/** Notify, when shadow added or removed. */
	signal shadowed(bValue: boolean): void;
	/** Notify, before object start rendendering */
	signal beforeRender(pViewport: AIViewport, pMethod: AIRenderMethod): void;

	signal click(pViewport: AIViewport, pObject: AISceneObject, x: uint, y: uint);
	
	signal mousemove(pViewport: AIViewport, pObject: AISceneObject, x: uint, y: uint);
	signal mousedown(pViewport: AIViewport, pObject: AISceneObject, x: uint, y: uint);
	signal mouseup(pViewport: AIViewport, pObject: AISceneObject, x: uint, y: uint);
	signal mouseover(pViewport: AIViewport, pObject: AISceneObject, x: uint, y: uint);
	signal mouseout(pViewport: AIViewport, pObject: AISceneObject, x: uint, y: uint);

	signal dragstart(pViewport: AIViewport, pObject: AISceneObject, x: uint, y: uint);
	signal dragstop(pViewport: AIViewport, pObject: AISceneObject, x: uint, y: uint);
	signal dragging(pViewport: AIViewport, pObject: AISceneObject, x: uint, y: uint);
}
