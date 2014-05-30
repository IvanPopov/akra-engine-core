/// <reference path="IViewport3D.ts" />

module akra {
	export interface IForwardViewport extends IShadedViewport, IViewportSkybox, IViewportAntialising, IViewportHighlighting, IViewportFogged {
		_renderOnlyTransparentObjects(bValue: boolean): void;
		setSkyboxModel(pRenderable: IRenderableObject): void;
	}
} 