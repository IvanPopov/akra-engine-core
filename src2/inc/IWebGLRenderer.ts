#ifndef IWEBGLRENDERER_TS
#define IWEBGLRENDERER_TS

module akra {

	IFACE(ITexture);

	export interface IWebGLRenderer extends IRenderer {
		_bindTexture(pTexture: ITexture): void;
		_getContext(): WebGLRenderingContext;
	}
}

#endif