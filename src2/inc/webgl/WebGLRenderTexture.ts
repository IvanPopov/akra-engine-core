#ifndef WEBGLRENDERTEXTURE_TS
#define WEBGLRENDERTEXTURE_TS

#include "render/RenderTexture.ts"
#include "IRenderer.ts"
#include "webgl/WebGLInternalFrameBuffer.ts"
#include "webgl/WebGLPixelBuffer.ts"
#include "IDepthBuffer.ts"
#include "PixelFormat.ts"

module akra.webgl {
	export class WebGLRenderTexture extends render.RenderTexture {
		protected _pFrameBuffer: WebGLInternalFrameBuffer = null;

		inline get width(): uint { return this._iWidth = this._pFrameBuffer.width; }
		inline get height(): uint { return this._iHeight = this._pFrameBuffer.height; }

		constructor(pRenderer: IRenderer, pTarget: IPixelBuffer){
			super(pRenderer, pTarget, 0);
			this._pFrameBuffer = new WebGLInternalFrameBuffer(pRenderer);

			this._pFrameBuffer.bindSurface(GL_COLOR_ATTACHMENT0, pTarget);

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
			if(sName === "FBO") {
				return this._pFrameBuffer;
			}

			return null;
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

		attachDepthPixelBuffer(pBuffer: IPixelBuffer): bool {
			var bResult: bool = false;
			
			bResult = super.attachDepthPixelBuffer(pBuffer);
			if(bResult) {
				if(pBuffer.format !== EPixelFormats.DEPTH8){
					this.detachDepthPixelBuffer();
					return false;
				}

				this._pFrameBuffer.bindSurface(GL_DEPTH_ATTACHMENT, pBuffer);
				(<WebGLPixelBuffer>pBuffer).addRef();
			}

			return bResult;

		}

		attachDepthTexture(pTexture: ITexture): bool {
			this._pFrameBuffer.attachDepthTexture(pTexture);
			return true;
		}


		detachDepthPixelBuffer(): void {
			this._pFrameBuffer.unbindSurface(GL_DEPTH_ATTACHMENT);
			(<WebGLPixelBuffer>this._pDepthPixelBuffer).release();
			super.detachDepthPixelBuffer();
		}

		detachDepthBuffer(): void {
			this._pFrameBuffer.detachDepthBuffer();
			super.detachDepthBuffer();
		}

		detachDepthTexture(): void {
			this._pFrameBuffer.detachDepthTexture();
		}
	}
}

#endif 