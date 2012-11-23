#ifndef IWEBGLRENDERER_TS
#define IWEBGLRENDERER_TS

#define CHECK_WEBGL_ERROR

module akra {

	IFACE(ITexture);

	export interface IWebGLRenderer extends IRenderer {
		_bindTexture(pTexture: ITexture): void;
	}
}

#endif