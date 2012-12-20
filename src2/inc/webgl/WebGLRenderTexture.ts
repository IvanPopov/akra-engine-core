#ifndef WEBGLRENDERTEXTURE_TS
#define WEBGLRENDERTEXTURE_TS

#include "render/RenderTexture.ts"
#include "IRenderer.ts"
#include "webgl/WebGLInternalFrameBuffer.ts"
#include "IDepthBuffer.ts"

module akra.webgl {
	export interface IWebGLSurfaceDesc {
		buffer: IPixelBuffer;
		zOffset: uint;
		numSamples: uint;
	}

	export class WebGLRenderTexture extends render.RenderTexture {
		protected _pFrameBuffer: WebGLInternalFrameBuffer = null;

		constructor(pRenderer: IRenderer, pTarget: IWebGLSurfaceDesc){
			super(pRenderer, pTarget.buffer, pTarget.zOffset);
			this._pFrameBuffer = new WebGLInternalFrameBuffer(pRenderer);

			this._pFrameBuffer.bindSurface(0, pTarget);

			this._iWidth = this._pFrameBuffer.width;
			this._iHeight = this._pFrameBuffer.height;

		}

		destroy(): void {
			super.destroy();
		}

		requiresTextureFlipping(): bool {
			return true;
		}

		getCustomAttribute(sName: string): any {
			if(sName === "FBO"){
				return this._pFrameBuffer;
			}
		}

		swapBuffers(): void {
			this._pFrameBuffer.swapBuffers();
		}

		attachDepthBuffer(pDepthBuffer: IDepthBuffer): bool {
			var bResult: bool = false;
			bResult = super.attachDepthBuffer(pDepthBuffer);

			if(bResult){
				this._pFrameBuffer.attachDepthBuffer(pDepthBuffer);
			}

			return bResult;
		}

		detachDepthBuffer(): void {
			this._pFrameBuffer.detachDepthBuffer();
			super.detachDepthBuffer();
		}
	}
}

#endif 