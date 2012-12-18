#ifndef IWEBGLRENDERER_TS
#define IWEBGLRENDERER_TS

#include "webgl/webgl.ts"

module akra {

	export interface IWebGLRenderer extends IRenderer {
		getWebGLContext(): WebGLRenderingContext;
		
		/** Buffer Objects. */
		bindWebGLBuffer(eTarget: uint, pBuffer: WebGLBuffer): void;
		createWebGLBuffer(): WebGLBuffer;
		deleteWebGLBuffer(pBuffer: WebGLBuffer): void;
		
		/** Texture Objects. */
		bindWebGLTexture(eTarget: uint, pTexture: WebGLTexture): void;
		activateWebGLTexture(iSlot: int): void;
		createWebGLTexture(): WebGLTexture;
		deleteWebGLTexture(pTexture: WebGLTexture): void;

		/** Framebuffer Objects */
		createWebGLFramebuffer(): WebGLFramebuffer;
		bindWebGLFramebuffer(eTarget: uint, pBuffer: WebGLFramebuffer): void;
		deleteWebGLFramebuffer(pBuffer: WebGLFramebuffer): void;

		useWebGLProgram(pProgram: WebGLProgram): void;
		createWebGLProgram(): WebGLProgram;
		deleteWebGLProgram(pProgram: WebGLProgram): void;

		disableAllWebGLVertexAttribs(): void;

		getError(): string;
	}
}

#endif