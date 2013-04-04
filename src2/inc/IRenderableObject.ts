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
		
		readonly type: ERenderDataTypes;
		readonly effect: IEffect;
		readonly surfaceMaterial: ISurfaceMaterial;
		readonly data: IRenderData;
		readonly material: IMaterial;

		getGuid(): uint;
		getRenderer(): IRenderer;
		getTechnique(sName?: string): IRenderTechnique;
		getTechniqueDefault(): IRenderTechnique;

		destroy(): void;

		addRenderMethod(pMethod: IRenderMethod, csName?: string): bool;
		addRenderMethod(csMethod: string, csName?: string): bool;
		
		// findRenderMethod(csName: string): uint;
		switchRenderMethod(csName: string): bool;
		switchRenderMethod(pMethod: IRenderMethod): bool;
		
		removeRenderMethod(csName: string): bool;
		getRenderMethod(csName?: string): IRenderMethod;
		
		getRenderMethodDefault(): IRenderMethod; 

		hasShadow(): bool;
		setShadow(bValue?: bool): void;

		isReadyForRender(): bool;
		isAllMethodsLoaded(): bool;


		render(pViewport: IViewport, csMethod?: string, pSceneObject?: ISceneObject): void;

		_setup(pRenderer: IRenderer, csDefaultMethod?: string): void;
		_draw(): void;

		/** Notify, when shadow added or removed. */
		signal shadow(bValue: bool): void;
	}
}

#endif
