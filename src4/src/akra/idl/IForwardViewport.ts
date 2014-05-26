/// <reference path="IViewport3D.ts" />

module akra {
	export interface IForwardViewport extends IShadedViewport, IViewportSkybox, IViewportAntialising, IViewportHighlighting {
		_renderOnlyTransparentObjects(bValue: boolean): void;
		_setSkyboxModel(pRenderable: IRenderableObject): void;
	}
} 