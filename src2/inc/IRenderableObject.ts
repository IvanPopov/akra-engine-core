#ifndef IRENDERABLEOBJECT_TS
#define IRENDERABLEOBJECT_TS

#include "IRenderTechnique.ts"

module akra {
	export interface IRenderableObject {
		renderMethod: IRenderMethod;
		
		readonly effect: IEffect;
		readonly surfaceMaterial: ISurfaceMaterial;

		readonly material: IMaterial;

		_setup(pRenderer: IRenderer, csDefaultMethod?: string): void;

		getGuid(): uint;
		getRenderer(): IRenderer;
		getTechnique(sName?: string): IRenderTechnique;

		destroy(): void;

		addRenderMethod(pMethod: IRenderMethod, csName?: string): bool;
		addRenderMethod(csMethod: string, csName?: string): bool;
		
		// findRenderMethod(csName: string): uint;
		switchRenderMethod(csName: string): bool;
		switchRenderMethod(pMethod: IRenderMethod): bool;
		removeRenderMethod(csName: string): bool;
		getRenderMethod(csName?: string): IRenderMethod;

		hasShadow(): bool;
		setShadow(bValue?: bool): void;

		isReadyForRender(): bool;
		isAllMethodsLoaded(): bool;


		render(csMethod?: string): void;
	}
}

#endif
