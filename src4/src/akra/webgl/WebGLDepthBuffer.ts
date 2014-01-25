/// <reference path="../pool/resources/DepthBuffer.ts" />
/// <reference path="WebGLInternalRenderBuffer.ts" />
/// <reference path="WebGLInternalFrameBuffer.ts" />

module akra.webgl {
	export class WebGLDepthBuffer extends pool.resources.DepthBuffer {
		protected _pDepthBuffer: WebGLInternalRenderBuffer = null;
		protected _pStencilBuffer: WebGLInternalRenderBuffer = null;

		constructor() {
			super();
		}

		getDepthBuffer(): WebGLInternalRenderBuffer {
			return this._pDepthBuffer;
		}

		getStencilBuffer(): WebGLInternalRenderBuffer {
			return this._pStencilBuffer;
		}

		create(iBitDepth: uint, iWidth: uint, iHeight: uint, bManual: boolean): boolean;
		create(pDepth: WebGLInternalRenderBuffer, pStencil: WebGLInternalRenderBuffer,
			iWidth: uint, iHeight: uint, isManual: boolean): boolean;
		create(): boolean {
			if (arguments.length !== 5) {
				logger.critical("Invalid number of arguments. For WebGLDepthBuffer it must be five");
			}

			super.create(0, arguments[2], arguments[3], arguments[4]);
			var pDepth: WebGLInternalRenderBuffer = arguments[0];
			var pStencil: WebGLInternalRenderBuffer = arguments[1];

			this._pDepthBuffer = pDepth;
			this._pStencilBuffer = pStencil;

			if (!isNull(pDepth)) {
				switch (pDepth._getWebGLFormat()) {
					case gl.DEPTH_COMPONENT16:
						this._iBitDepth = 16;
						break;
					case gl.DEPTH_COMPONENT24_OES:
					case gl.DEPTH_COMPONENT32_OES:
					case gl.DEPTH24_STENCIL8_OES:
						if (webgl.hasExtension(OES_DEPTH24) ||
							webgl.hasExtension(OES_DEPTH32) ||
							webgl.hasExtension(OES_PACKED_DEPTH_STENCIL)) {

							this._iBitDepth = 32;
						}
						break;
				}
			}

			return true;
		}

		destroy(): void {
			super.destroy();

			if (!isNull(this._pStencilBuffer) && this._pStencilBuffer !== this._pDepthBuffer) {
				this._pStencilBuffer.release();
			}

			if (!isNull(this._pDepthBuffer)) {
				this._pDepthBuffer.release();
			}

			this._pStencilBuffer = null;
			this._pDepthBuffer = null;
		}

		isCompatible(pTarget: IRenderTarget): boolean {
			if (this._iWidth >= pTarget.getWidth() &&
				this._iHeight >= pTarget.getHeight()) {
				return true;
			}

			return false;
		}


	}
}