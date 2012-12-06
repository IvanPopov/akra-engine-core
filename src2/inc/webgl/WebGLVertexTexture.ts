#ifndef VERTEXBUFFERTBO_TS
#define VERTEXBUFFERTBO_TS


#include "IVertexBuffer.ts"
#include "IRenderResource.ts"
#include "core/pool/resources/VertexBuffer.ts"
#include "webgl.ts"

#define WEBGL_VERTEX_TEXTURE_MIN_SIZE 32

module akra.webgl {
	export class WebGLVertexTexture extends core.pool.resources.VertexBuffer implements IVertexBuffer {
		protected _iWidth: uint = 0;
		protected _iHeight: uint = 0;

		protected _pWebGLTexture: WebGLTexture;
		protected _pWebGLContext: WebGLRenderingContext;

		protected _ePixelFormat: EPixelFormats = EPixelFormats.FLOAT32_RGBA;

		private _pLockData: Uint8Array = null;

		inline get type(): EVertexBufferTypes { return EVertexBufferTypes.TYPE_TBO; }
		inline get byteLength(): uint { return 0; }
		

		constructor (/*pManager: IResourcePoolManager*/) {
			super(/*pManager*/);
		}

		create(iByteSize: uint, iFlags: uint = EHardwareBufferFlags.STATIC, pData: Uint8Array = null): bool;
		create(iByteSize: uint, iFlags: uint = EHardwareBufferFlags.STATIC, pData: ArrayBufferView = null): bool;
		create(iByteSize: uint, iFlags: uint = EHardwareBufferFlags.STATIC, pData: any = null): bool {
			
			var iMinWidth: uint = WEBGL_VERTEX_TEXTURE_MIN_SIZE;
			var iWidth: uint, iHeight: uint;

			iByteSize = math.max(iByteSize, pixelUtil.getMemorySize(iMinWidth, iMinWidth, 1, this._ePixelFormat));

			if (TEST_ANY(iFlags, EHardwareBufferFlags.READABLE)) {
	            SET_ALL(iFlags, EHardwareBufferFlags.BACKUP_COPY);
	        }

			super.create(iByteSize, iFlags, pData);

			var pPOTSize: uint[] = math.calcPOTtextureSize(math.ceil(iByteSize / pixelUtil.getNumElemBytes(this._ePixelFormat)));
			var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getManager().getEngine().getRenderer();
		    var i: int;

		    iWidth = pPOTSize[0];
		    iHeight = pPOTSize[1];

		    debug_assert(this._pWebGLTexture == null, "webgl texture already allocated");

			this._iWidth = iWidth;
			this._iHeight = iHeight;
		    this._iFlags = iFlags;
		    this._pWebGLContext = pWebGLRenderer.getWebGLContext();

		    debug_assert(this._pWebGLContext !== null, "cannot grab webgl context");

		    //Софтварного рендеринга буфера у нас нет
		    debug_assert(!this.isSoftware(), "no sftware rendering");

		    //Если есть локальная копия то буфер можно читать
		    if (this.isBackupPresent()) {
		        SET_ALL(this._iTypeFlags, EHardwareBufferFlags.READABLE);
		    }
			
			debug_assert(!pData || pData.byteLength <= iByteSize, 
				"Размер переданного массива больше переданного размера буфера");
			
		    this._pWebGLTexture = this._pWebGLContext.createTexture();

		    if (!this._pWebGLTexture) {
		        CRITICAL("Не удалось создать буфер");
		        
		        this.destroy();
		        return false;
		    }

		    pWebGLRenderer.bindWebGLTexture(GL_TEXTURE_2D, this._pWebGLTexture);
		    this._pWebGLContext.texImage2D(
		    	GL_TEXTURE_2D, 
		    	0, 
		    	GL_RGBA, 
		    	this._iWidth, 
		    	this._iHeight, 
		    	0, a.IFORMATSHORT.RGBA,
                       a.ITYPE.UNSIGNED_BYTE, null);
		    
		    if (pData) {
		        this._pWebGLContext.bufferSubData(
		        	GL_ARRAY_BUFFER, 0, isArrayBuffer(pData)? pData: pData.buffer);
		    }

		    return true;
		}
	}

	
}

#endif
