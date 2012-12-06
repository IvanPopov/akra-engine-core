#ifndef IWEBGLRENDERER_TS
#define IWEBGLRENDERER_TS

#include "webgl/webgl.ts"

module akra {

	IFACE(ITexture);

	export interface IWebGLRenderer extends IRenderer {
		getWebGLContext(): WebGLRenderingContext;
		bindWebGLBuffer(iType: int, pBuffer: WebGLBuffer): void;
		bindWebGLTexture(iType: int, pTexture: WebGLTexture): void;
	}
}

#endif