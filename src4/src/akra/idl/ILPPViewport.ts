/// <reference path="IViewport3D.ts" />

module akra {
	export interface ILPPViewport extends IShadedViewport, IViewportSkybox, IViewportAntialising, IViewportHighlighting, IViewportFogged  {
		getDepthTexture(): ITexture;
		getTextureWithObjectID(): ITexture;
		getView(): IRenderableObject;
	}
}