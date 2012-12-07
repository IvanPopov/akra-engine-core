#ifndef WEBGLTEXTUREBUFFER_TS
#define WEBGLTEXTUREBUFFER_TS

#include "WebGLPixelBuffer.ts"
#include "IRenderTexture.ts"
#include "IWebGLRenderer.ts"
#include "pixelUtil/PixelBox.ts"

module akra.webgl {
	export class WebGLTextureBuffer extends WebGLPixelBuffer implements IPixelBuffer {
		protected _eTarget: int;
		protected _eFaceTarget: int; 
		protected _pWebGLTexture: WebGLTexture;
		protected _iFace: uint;
		protected _iLevel: int;
		protected _bSoftwareMipmap: bool;
		protected _pTRTList: IRenderTexture[];


		constructor () {
			super();
		}

		create(iFlags: int): bool;
		create(iWidth: int, iHeight: int, iDepth: int, eFormat: EPixelFormats, iFlags: int): bool;
		create(eTarget: int, pTexture: WebGLTexture, iWidth: uint, iHeight: uint, iInternalFormat: int, iFormat: int, 
			   iFace: uint, iLevel: int, iFlags: int, bSoftwareMipmap: bool): bool;
		create(): bool {
			if(arguments.length < 6) {
				CRITICAL("Invalid number of params. For WebGLTextureBuffer");
			}

			var eTarget: int = arguments[0];
			var pTexture: WebGLTexture = arguments[1];
			var iWidth: uint = arguments[2];
			var iHeight: uint = arguments[3];
			var iInternalFormat: int = arguments[4];
			var iFormat: int = arguments[5];
			var iFace: uint = arguments[6];
			var iLevel: int = arguments[7];
			var iFlags: int = arguments[8];
			var bSoftwareMipmap: bool = arguments[9];

			var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getManager().getEngine().getRenderer();

			pWebGLRenderer.bindWebGLTexture(eTarget, pTexture);

			this._eTarget = eTarget;
			this._pWebGLTexture = pTexture;
			this._iFace = iFace;
			this._iLevel = iLevel;
			this._bSoftwareMipmap = bSoftwareMipmap;
			
			this._iWidth = iLevel === 0 ? iWidth : iWidth / Math.pow(2.0, iLevel);
			this._iHeight = iLevel === 0 ? iHeight : iHeight / Math.pow(2.0, iLevel);
			this._iDepth = 1;

			this._iWEBGLInternalFormat = iInternalFormat;
			this._eFormat = webgl.getClosestAkraFormat(iInternalFormat, iFormat);

			this._iRowPitch = this._iWidth;
			this._iSlicePitch = this._iHeight * this._iWidth;
			this.byteLength = pixelUtil.getMemorySize(this._iWidth, this._iHeight, this._iDepth, this._eFormat);

			this._pBuffer = new pixelUtil.PixelBox(this._iWidth, this._iHeight, this._iDepth, this._eFormat);
			
			if(this._iWidth === 0 || this._iHeight === 0 || this._iDepth === 0){
				// We are invalid, do not allocate a buffer
				return false;
			}

			// Is this a render target?
	        // if (mUsage & TU_RENDERTARGET) {
	        //     // Create render target for each slice
	        //     mSliceTRT.reserve(mDepth);
	        //     for(size_t zoffset=0; zoffset<mDepth; ++zoffset) {
	        //         String name;
	        //         name = "rtt/" + StringConverter::toString((size_t)this) + "/" + baseName;
	        //         GLES2SurfaceDesc surface;
	        //         surface.buffer = this;
	        //         surface.zoffset = zoffset;
	        //         RenderTexture *trt = GLES2RTTManager::getSingleton().createRenderTexture(name, surface, writeGamma, fsaa);
	        //         mSliceTRT.push_back(trt);
	        //         Root::getSingleton().getRenderSystem()->attachRenderTarget(*mSliceTRT[zoffset]);
	        //     }
	        // }


			return true;
		}

		//upload(download) data to(from) videocard.
		protected upload(pData: IPixelBox, pDestBox: IBox): void {

		}

		protected download(pData: IPixelBox): void {

		}

		protected buildMipmaps(ppData: IPixelBox): void {

		}

		_bindToFramebuffer(pAttachment: any, iZOffset: uint): void {

		}
		
		_getWEBGLFormat(): int { 
			return this._iWEBGLInternalFormat; 
		}

		_copyFromFramebuffer(iZOffset: uint): void {
		}

		destroy(): void {  }

		blitFromMemory(pSource: IPixelBox): bool;
		blitFromMemory(pSource: IPixelBox, pDestBox?: IBox): bool;
		blitFromMemory(): bool {
			return false;
		}

		getRenderTarget(): IRenderTarget {
			return null;
		}

	}
}

#endif
