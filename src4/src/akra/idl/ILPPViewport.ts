/// <reference path="IViewport3D.ts" />

module akra {
	export interface ILPPViewport extends IShadedViewport, IViewportSkybox, IViewportAntialising, IViewportHighlighting  {
		getDepthTexture(): ITexture;
		getTextureWithObjectID(): ITexture;
		getView(): IRenderableObject;
	}
}