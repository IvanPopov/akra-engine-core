/// <reference path="IViewport.ts" />
module akra {
	export interface ILPPViewport extends IViewport {
		getDepthTexture(): ITexture;
		getView(): IRenderableObject;
	}
}