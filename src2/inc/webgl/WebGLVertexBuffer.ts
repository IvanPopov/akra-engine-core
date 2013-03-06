#ifndef WEBGLVERTEXBUFFER_TS
#define WEBGLVERTEXBUFFER_TS

#include "IVertexData.ts"
#include "IVertexDeclaration.ts"
#include "IVertexBuffer.ts"
#include "core/pool/resources/VertexBuffer.ts"
#include "webgl.ts"

#define WEBGL_VERTEX_BUFFER_MIN_SIZE 1024

module akra.webgl {

	export class WebGLVertexBuffer extends core.pool.resources.VertexBuffer implements IVertexBuffer {
		protected _iByteSize: uint;

		protected _pWebGLBuffer: WebGLBuffer;

		private _pLockData: Uint8Array = null;


		inline get type(): EVertexBufferTypes { return EVertexBufferTypes.VBO; }
		inline get byteLength(): uint { return this._iByteSize; }

		constructor (/*pManager: IResourcePoolManager*/) {
			super(/*pManager*/);
		}

		create(iByteSize: uint, iFlags: uint = EHardwareBufferFlags.STATIC, pData: Uint8Array = null): bool;
		create(iByteSize: uint, iFlags: uint = EHardwareBufferFlags.STATIC, pData: ArrayBufferView = null): bool;
		create(iByteSize: uint, iFlags: uint = EHardwareBufferFlags.STATIC, pData: any = null): bool {
			
			iByteSize = math.max(iByteSize, WEBGL_VERTEX_BUFFER_MIN_SIZE);

			if (TEST_ANY(iFlags, EHardwareBufferFlags.READABLE)) {
	            SET_ALL(iFlags, EHardwareBufferFlags.BACKUP_COPY);
	        }

			super.create(iByteSize, iFlags, pData);

			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
		    var i: int;

		    debug_assert(this._pWebGLBuffer == null, "webgl buffer already allocated");

			this._iByteSize = iByteSize;
		    this._iFlags = iFlags;
		    pWebGLContext = pWebGLRenderer.getWebGLContext();

		    debug_assert(pWebGLContext !== null, "cannot grab webgl context");

		    //Софтварного рендеринга буфера у нас нет
		    debug_assert(!this.isSoftware(), "no sftware rendering");

		    //Если есть локальная копия то буфер можно читать
		    if (this.isBackupPresent()) {
		        SET_ALL(this._iFlags, EHardwareBufferFlags.READABLE);
		    }
			
			debug_assert(!pData || pData.byteLength <= iByteSize, 
				"Размер переданного массива больше переданного размера буфера");
			

		    this._pWebGLBuffer = pWebGLRenderer.createWebGLBuffer();

		    if (!this._pWebGLBuffer) {
		        CRITICAL("Не удалось создать буфер");
		        
		        this.destroy();
		        return false;
		    }

		    pWebGLRenderer.bindWebGLBuffer(GL_ARRAY_BUFFER, this._pWebGLBuffer);
		    pWebGLContext.bufferData(GL_ARRAY_BUFFER, this._iByteSize, getWebGLUsage(this._iFlags));
		    
		    if (pData) {
		        pWebGLContext.bufferSubData(
		        	GL_ARRAY_BUFFER, 0, isArrayBuffer(pData)? pData: pData.buffer);
		    }

		    return true;
		}

		destroy(): void {
			super.destroy();

			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getEngine().getRenderer();

			pWebGLRenderer.deleteWebGLBuffer(this._pWebGLBuffer);

			this._pWebGLBuffer = null;
			this._iByteSize = 0;
		}

		readData(ppDest: ArrayBufferView): bool;
		readData(iOffset: uint, iSize: uint, ppDest: ArrayBufferView): bool;
		readData(iOffset: any, iSize?: any, ppDest?: any): bool { 
			debug_assert(!isNull(this._pWebGLBuffer), "Буффер еще не создан");

		    if (!this.isBackupPresent()) {
		    	return false;
		    }
			
			if (arguments.length === 1) {
				this._pBackupCopy.readData(arguments[0]);
			}
			else {
				this._pBackupCopy.readData(iOffset, iSize, ppDest);
			}

		    return true;
		}

		writeData(pData: Uint8Array, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer: bool = false): bool;
		writeData(pData: ArrayBufferView, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer: bool = false): bool;
		writeData(pData: any, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer: bool = false): bool { 
			
			debug_assert(!isNull(this._pWebGLBuffer), "WebGL buffer not exists");
		    
		    var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getEngine().getRenderer();
		    var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
		    
		    pWebGLRenderer.bindWebGLBuffer(GL_ARRAY_BUFFER, this._pWebGLBuffer);
			
			debug_assert(pData.byteLength <= iSize, "Размер переданного массива больше переданного размера");
			debug_assert(this.byteLength >= iOffset + iSize, "Данные выйдут за предел буфера");

			var pU8Data: Uint8Array = null;

			if (isArrayBuffer(pData)) {
				pU8Data = new Uint8Array(pData);
			}
			else {
				pU8Data = new Uint8Array(pData.buffer, pData.byteOffset, pData.byteLength);
			}

			pU8Data = pU8Data.subarray(0, iSize);

			pWebGLContext.bufferSubData(GL_ARRAY_BUFFER, iOffset, pU8Data);
			
			if (this.isBackupPresent()) {
		        this._pBackupCopy.writeData(pU8Data, iOffset);
		    }

		    this.notifyAltered();

			return true;
		}

		resize(iSize: uint): bool {
			var eUsage: int;
			var pData: Uint8Array;
			var iMax: int = 0;
			var pVertexData: IVertexData;

		    var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getEngine().getRenderer();
		    var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
			
			if(this.isBackupPresent()) {
				return false;		
			}

			if(iSize < this.byteLength) {
				for(var k: int = 0; k < this._pVertexDataArray.length; ++ k) {
					pVertexData = this._pVertexDataArray[k];

					if(pVertexData.byteOffset + pVertexData.byteLength > iMax) {
						iMax = pVertexData.byteOffset + pVertexData.byteLength;
					}		
				}	

				debug_assert(iMax <= iSize,
					"Уменьшение невозможно. Страая разметка не укладывается в новый размер");
			}
			
			if(pWebGLContext.isBuffer(this._pWebGLBuffer)) {
				pWebGLRenderer.deleteWebGLBuffer(this._pWebGLBuffer);
			}		
			
			eUsage = getWebGLUsage(this._iFlags);

		    this._pWebGLBuffer = pWebGLRenderer.createWebGLBuffer();

		    if (!this._pWebGLBuffer) {
		        CRITICAL("Не удалось создать буфер");
		        
		        this.destroy();
		        return false;
		    }


		    pWebGLRenderer.bindWebGLBuffer(GL_ARRAY_BUFFER, this._pWebGLBuffer);
			pWebGLContext.bufferData(GL_ARRAY_BUFFER, iSize, eUsage);
			
			pData = new Uint8Array(this._iByteSize);
			
			if (this.readData(pData)) {
				debug_warning("cannot read data from buffer");
				return false;
			}


			this.writeData(pData, 0, this._iByteSize);
			this._pBackupCopy.resize(iSize);
			this._iByteSize = iSize;	

			this.notifyAltered();
			
			return true;
		}

		inline getWebGLBuffer(): WebGLBuffer {
			return this._pWebGLBuffer;
		}

		protected lockImpl(iOffset: uint, iSize: uint, iLockFlags: int): any {
	        var pRetData: Uint8Array = new Uint8Array(iSize);

            this.readData(iOffset, iSize, pRetData);

            this._pLockData = pRetData;

	        return pRetData;
		}

		protected unlockImpl(): void {
			this.writeData(this._pLockData, this._iLockStart, this._iLockSize);
		}

		protected copyBackupToRealImpl(pRealData: Uint8Array, pBackupData: Uint8Array, iLockFlags: int): void {
			pRealData.set(pBackupData);
		}
	}
}

#endif