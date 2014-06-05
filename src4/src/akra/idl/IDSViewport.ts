/// <reference path="IViewport3D.ts" />
/// <reference path="IRID.ts" />
/// <reference path="IColor.ts" />

module akra {
	export interface IDSViewport extends IShadedViewport, IViewportSkybox, IViewportAntialising, IViewportHighlighting, IViewportFogged  {
		getColorTextures() : ITexture[];
		_getDeferredTexValue(iTex: int, x: uint, y: uint): IColor;

		getDepthTexture(): ITexture;
		getTextureWithObjectID(): ITexture;
		getView(): IRenderableObject;
	}
}
