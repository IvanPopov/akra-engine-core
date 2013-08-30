#ifndef IRENDERABLEOBJECT_TS
#define IRENDERABLEOBJECT_TS

#include "IRenderTechnique.ts"
#include "IEventProvider.ts"
#include "ISceneObject.ts"
#include "IRenderData.ts"
#include "IViewport.ts"

module akra {
	
	export enum ERenderDataTypes {
		UNKNOWN,
		
        MESH_SUBSET,
        SCREEN
    }

	export interface IRenderableObject extends IEventProvider {
		renderMethod: IRenderMethod;
		hasShadow: bool;

		readonly type: ERenderDataTypes;
		readonly effect: IEffect;
		readonly surfaceMaterial: ISurfaceMaterial;
		readonly data: IRenderData;
		readonly material: IMaterial;

		writeonly onclick:   (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
        writeonly onmousemove: (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
        writeonly onmousedown: (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
        writeonly onmouseup:   (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
        writeonly onmouseover:   (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
        writeonly onmouseout:   (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
        
        writeonly ondragstart:   (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
        writeonly ondragstop:   (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;
        writeonly ondragging:   (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: uint, y: uint) => void;

		getRenderer(): IRenderer;
		getTechnique(sName?: string): IRenderTechnique;
		getTechniqueDefault(): IRenderTechnique;

		destroy(): void;
		setVisible(bVisible?: bool): void;
		isVisible(): bool;

		addRenderMethod(pMethod: IRenderMethod, csName?: string): bool;
		addRenderMethod(csMethod: string, csName?: string): bool;
		
		// findRenderMethod(csName: string): uint;
		switchRenderMethod(csName: string): bool;
		switchRenderMethod(pMethod: IRenderMethod): bool;
		
		removeRenderMethod(csName: string): bool;
		getRenderMethod(csName?: string): IRenderMethod;
		
		getRenderMethodDefault(): IRenderMethod; 

		isReadyForRender(): bool;
		isAllMethodsLoaded(): bool;
		isFrozen(): bool;

		render(pViewport: IViewport, csMethod?: string, pSceneObject?: ISceneObject): void;

		_setRenderData(pData: IRenderData): void;
		_setup(pRenderer: IRenderer, csDefaultMethod?: string): void;
		_draw(): void;

		/** Notify, when shadow added or removed. */
		signal shadow(bValue: bool): void;
		/** Notify, before object start rendendering */
		signal beforeRender(pViewport: IViewport): void;

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

#endif
