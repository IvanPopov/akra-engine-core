#ifndef WEBGLTEXTUREBUFFER_TS
#define WEBGLTEXTUREBUFFER_TS

#include "WebGLPixelBuffer.ts"

module akra {
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

		create(eTarget: int, iWidth: uint, iHeight: uint, iInternalFormat: int, iFormat: int, iFace: uint, 
			iLevel: int, iFlags: int, bSoftwareMipmaps: bool): bool {

		}

		//upload(download) data to(from) videocard.
		protected upload(pData: IPixelBox, pDestBox: IBox): void {}
		protected download(pData: IPixelBox): void {}
		protected buildMipmaps(ppData: IPixelBox): void;

		_bindToFramebuffer(pAttachment: any, iZOffset: uint): void {}
		_getWEBGLFormat(): int { return this._iWEBGLInternalFormat; }
		_copyFromFramebuffer(iZOffset: uint): void;


		create(iWidth: uint, iHeight: uint, iDepth: uint, eFormat: EPixelFormats, iFlags: int): bool;
		create(iByteSize: uint, iFlags: int, pData: ArrayBuffer): bool;

		create(iWidth: any, iHeight: any, iDepth: any, eFormat?: EPixelFormats, iFlags?: int): bool {
			return false;
		}

		destroy(): void {  }

		getData(): Uint8Array;
		getData(iOffset: uint, iSize: uint): Uint8Array;
		getData(iOffset?: uint, iSize?: uint): Uint8Array {
			return null;
		}
		
		setData(pData: Uint8Array, iOffset: uint, iSize: uint): bool;
		setData(pData: ArrayBuffer, iOffset: uint, iSize: uint): bool;
		setData(pData: any, iOffset: uint, iSize: uint): bool { return false; }

		resize(iSize: uint): bool { return false; }

		blitFromMemory(pSource: IPixelBox, pDestBox?: IBox): bool {
			return false;
		}

		blitToMemory(pSrcBox: IBox, pDest?: IPixelBuffer): bool {
			return false;
		}

		getRenderTarget(): IRenderTarget {
			return null;
		}

		getPixels(pDstBox: IBox): IPixelBox {
			return null;
		}

		signal removeRTT(iZoffset: uint);
	}
}

#endif
