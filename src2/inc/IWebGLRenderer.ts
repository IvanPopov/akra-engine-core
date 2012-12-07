#ifndef IWEBGLRENDERER_TS
#define IWEBGLRENDERER_TS

#include "webgl/webgl.ts"

module akra {

	export interface IWebGLRenderer extends IRenderer {
		getWebGLContext(): WebGLRenderingContext;
		
		/** Buffer Objects. */
		bindWebGLBuffer(eTarget: uint, pBuffer: WebGLBuffer): void;
		
		/** Texture Objects. */
		bindWebGLTexture(eTarget: uint, pTexture: WebGLTexture): void;
		activateWebGLTexture(iSlot: int): void;

		/** Framebuffer Objects */
		createWebGLFramebuffer(): WebGLFramebuffer;
		bindWebGLFramebuffer(eTarget: uint, pBuffer: WebGLFramebuffer): void;
		deleteWebGLFramebuffer(pBuffer: WebGLFramebuffer): void;
	}
}

#endif