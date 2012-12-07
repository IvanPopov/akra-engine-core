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
		protected _eWebGLFormat: int;
		protected _eWebGLType: int;
		protected _pWebGLContext: WebGLRenderingContext;

		protected _ePixelFormat: EPixelFormats = EPixelFormats.FLOAT32_RGBA;
		//переменная нужна, чтобы проигнорировать обновление копии, обычно, это не требуется
		protected _bForceUpdateBackupCopy: bool = true;

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
			var pTextureData: Uint8Array = null;
			var pDataU8: Uint8Array = pData;

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
		    this._eWebGLFormat = getWebGLOriginFormat(this._ePixelFormat);
		    this._eWebGLType = getWebGLOriginDataType(this._ePixelFormat);

		    if (!this._pWebGLTexture) {
		        CRITICAL("Не удалось создать буфер");
		        
		        this.destroy();
		        return false;
		    }

		    if (pData) {
		    	
		    	if (pData.BYTES_PER_ELEMENT > 1) {
		    		pDataU8 = new Uint8Array(pData, pData.byteOffset, pData.byteLength);
		    	}

		    	pTextureData = new Uint8Array(pixelUtil.getMemorySize(iWidth, iHeight, 1, this._ePixelFormat));
		    	pTextureData.set(pDataU8);
		    }

		    pWebGLRenderer.bindWebGLTexture(GL_TEXTURE_2D, this._pWebGLTexture);
		    this._pWebGLContext.texImage2D(GL_TEXTURE_2D, 0, this._eWebGLFormat, 
		    	this._iWidth, this._iHeight, 0,  this._eWebGLFormat, this._eWebGLType, pTextureData);
		    

		    return true;
		}

		destroy(): void {
			super.destroy();

			this._pWebGLContext.deleteTexture(this._pWebGLTexture);

			this._pWebGLTexture = null;
			this._pWebGLContext = null;
			this._pWebGLRenderer = null;

			this._iByteSize = 0;
		}

		readData(ppDest: ArrayBufferView): bool;
		readData(iOffset: uint, iSize: uint, ppDest: ArrayBufferView): bool;
		readData(iOffset: any, iSize?: any, ppDest?: any): bool { 
			debug_assert(this._pWebGLBuffer, "Буффер еще не создан");

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
			
			var iTypeSize: uint 		= pixelUtil.getComponentTypeBits(this._ePixelFormat) / 8, /*предпологается, что float*/
		        nElementsPerPix: uint 	= pixelUtil.getComponentCount(this._ePixelFormat), 	 		 /*число float'ов в пикселе*/
		        iFrom: uint, 					/*номер float'a с которого начинается обновление*/
		        iCount: uint; 					/*исло float'ов для обновления*/
			var pBufferData: Float32Array;	/*данные для обновления*/

		    var iLeftShift: uint, 	/*смещение внутри первого пикселя*/
		        iRightShift: uint, 	/*смещение внутри последнего пикселя*/
		        iBeginPix: uint, 	/*пиксель с которого начинается обновление*/
		        iEndPix: uint, 		/*пиксель на котором заканчивается обновление*/
		        nPixels: uint, 		/*число пикселей*/
		        nElements: uint;

		    var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getManager().getEngine().getRenderer();

		    var pDataU8: Uint8Array = pData;

		    ASSERT(bDiscardWholeBuffer === false, "Discard option temporary unsupported.");

		    if (pData.BYTES_PER_ELEMENT > 1) {
		    	pDataU8 = new Uint8Array(pData.buffer, pData.byteOffset, pData.byteLength);
		    }

		    iOffset = iOffset || 0;
		    iSize = iSize || pData.byteLength;

		    pDataU8 = pDataU8.subarray(0, iSize);

		    if (this.byteLength < iOffset + iSize) {
		        this.resize(iOffset + iSize);
		    }

		    if (this.isBackupPresent() && this._bForceUpdateBackupCopy) {
		        this._pBackupCopy.set(pDataU8, iOffset);
		    }

		    this._bForceUpdateBackupCopy = true;

		    debug_assert(iOffset % iTypeSize === 0 && iSize % iTypeSize === 0, "Incorrect data size or offset");

		    iFrom 	= iOffset / iTypeSize;
		    iCount 	= iSize / iTypeSize;

		    iLeftShift 	= iFrom % nElementsPerPix;
		    iRightShift = ((iFrom + iCount) % nElementsPerPix);
		    iBeginPix 	= Math.floor(iFrom / nElementsPerPix);
		    iEndPix 	= Math.floor((iFrom + iCount) / nElementsPerPix);
		    nPixels 	= Math.ceil((iFrom + iCount) / nElementsPerPix) - Math.floor(iFrom / nElementsPerPix);
		    nElements 	= nPixels * nElementsPerPix;

		    pBufferData = new Float32Array(pDataU8.buffer, pDataU8.byteOffset);

		    if (iLeftShift === 0 && iRightShift === 0) {
		        var iWidth: int 	= this.width;
		        var iYmin: int 		= Math.floor(iBeginPix / iWidth);
		        var iYmax: int 		= Math.ceil(iEndPix / iWidth);
		        var iXbegin: int 	= iBeginPix % iWidth;
		        var iXend: int 		= iEndPix % iWidth;
		        var iHeight: int 	= iYmax - iYmin;
		        var pBufferSubData: Float32Array = pBufferData.subarray(iBeginElement, iEndElement);
		        
		        var iBeginElement: int 	= 0, 
		        	iEndElement: int 	= 0;

		        //hack: if iEndPixel is first pixel from next row

		        iXend = (iXend === 0 ? iWidth : iXend);

		        if (iHeight === 1) {
		            this.updatePixelRect(iXbegin, iYmin, iXend - iXbegin, 1, pBufferSubData);
		        }
		        else {

		            this.updatePixelRect(iXbegin, iYmin, iWidth - iXbegin, 1, pBufferSubData);
		            
		            if (iHeight > 2) {
		                this.updatePixelRect(0, iYmin + 1, iWidth, iHeight - 2, pBufferSubData);
		            }

		            this.updatePixelRect(0, iYmax - 1, iXend, 1, pBufferSubData);
		        }
		    }
		    else if (this.isReadable()) {
		        var iRealOffset: uint 	= iBeginPix * nElementsPerPix * iTypeSize;
		        var iRealSize: uint 	= nElements * iTypeSize;
		        var iTotalSize: uint 	= iRealOffset + iRealSize;

		        this._bForceUpdateBackupCopy = false;
		        return this.writeData(this._pBackupCopy.subarray(iRealOffset, iTotalSize), iRealOffset, iRealSize);
		    }
		    else {

		        var pMarkupDataIndex: Float32Array = new Float32Array(nPixels);
		        var pMarkupDataShift: Float32Array = new Float32Array(nPixels);
		        var pRealData: Float32Array = new Float32Array(nElements);

		        pMarkupDataIndex[0] = iBeginPix;
		        pMarkupDataShift[0] = iLeftShift;

		        pMarkupDataIndex[nPixels - 1] = iBeginPix + nPixels - 1;
		        pMarkupDataShift[nPixels - 1] = -iRightShift;

		        for (var i: int = 1; i < nPixels - 1; ++i) {
		            pMarkupDataIndex[i] = iBeginPix + i;
		        }

		        for (var i: int = 0; i < iCount; i++) {
		            pRealData[iLeftShift + i] = pBufferData[i];
		        }		        

		        var pShaderSource;
		        var pWebGLFramebuffer: WebGLFramebuffer = pWebGLRenderer.createWebGLFramebuffer();
		        var pWebGLProgram: IWebGLShaderProgram = this.getManager().shaderProgramPool.findResource("WEBGL_update_vertex_texture");
		        var pWebGLContext: WebGLRenderingContext = this._pWebGLContext;
		        var pValueBuffer: WebGlBuffer = pWebGLRenderer.createWebGLBuffer();
		        var pMarkupBuffer: WebGlBuffer = pWebGLRenderer.createWebGLBuffer();

		        if (isNull(pWebGLProgram)) {
		        	pWebGLProgram = this.getManager().shaderProgramPool.createResource("WEBGL_update_vertex_texture");
		        	pWebGLProgram.create(
		        	"																									\n\
		        	uniform sampler2D sourceTexture;																	\n\
					attribute vec4  VALUE;																				\n\
					attribute float INDEX;																				\n\
					attribute float SHIFT;																				\n\
					                      																				\n\
					uniform vec2 size;																					\n\
					varying vec4 color;																					\n\
					                   																					\n\
					void main(void){																					\n\
					    vec4 value = VALUE;																				\n\
					    float  serial = INDEX;																			\n\
					                          																			\n\
					    int shift = int(SHIFT);																			\n\
					    if (shift != 0) {																				\n\
					        color = texture2D(sourceTexture,                                        					\n\
					            vec2((mod(serial, size.x) +.5 ) / size.x, (floor(serial / size.x) + .5) / size.y)		\n\
					            );																						\n\
																														\n\
																														\n\
					        if (shift == 1) {																			\n\
					            color = vec4(color.r, value.gba);														\n\
					        }																							\n\
					        else if (shift == 2) {																		\n\
					            color = vec4(color.rg, value.ba);														\n\
					        }																							\n\
					        else if (shift == 3) {																		\n\
					            color = vec4(color.rgb, value.a);														\n\
					        }																							\n\
					        else if (shift == -1) {																		\n\
					            color = vec4(value.r, color.gba);														\n\
					        }																							\n\
					        else if (shift == -2) {																		\n\
					            color = vec4(value.rg, color.ba);														\n\
					        }																							\n\
					        else {																						\n\
					            color = vec4(value.rgb, color.a);														\n\
					        }																							\n\
					    }																								\n\
					    else {																							\n\
					        color = value;																				\n\
					    }																								\n\
					    gl_Position = vec4(2. * (mod(serial, size.x) + .5) / size.x - 1.,								\n\
					                    2. * (floor(serial / size.x)  + .5) / size.y - 1., 0., 1.);						\n\
					}																									\n\
					",
					"									\n\
					#ifdef GL_ES                        \n\
					    precision highp float;          \n\
					#endif								\n\
					varying vec4 color;                 \n\
					                                    \n\
					void main(void) {                   \n\
					    gl_FragColor = color;           \n\
					}                                   \n\
					");
		        }

		        pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, pWebGLFramebuffer);
		        pWebGLRenderer.useWebGLProgram(pWebGLProgram.getWebGLProgram());

		        
		        pWebGLContext.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, 
		        	GL_TEXTURE_2D, this._pWebGLTexture, 0);

		        pWebGLRenderer.bindWebGLBuffer(GL_ARRAY_BUFFER, pValueBuffer);
		        pWebGLContext.bufferData(GL_ARRAY_BUFFER, pRealData, GL_STREAM_DRAW);
		        
		        pWebGLRenderer.bindWebGLBuffer(GL_ARRAY_BUFFER, pMarkupBuffer);
		        pWebGLContext.bufferData(GL_ARRAY_BUFFER, pMarkupData, GL_STREAM_DRAW);
		        pWebGLRenderer.activateWebGLTexture(GL_TEXTURE0, this._pWebGLTexture);


		        pWebGLContext.uniform2i("size", this._iWidth, this._iHeight);
		        pWebGLContext.uniform1i("sourceTexture", 0);
	
		        pWebGLRenderer.bindWebGLBuffer(GL_ARRAY_BUFFER, pValueBuffer);
		        pWebGLContext.vertexAttribPointer(pWebGLProgram.getWebGLLocation("VALUE"), 4, GL_FLOAT, false, 0, 0);

		        pWebGLRenderer.bindWebGLBuffer(GL_ARRAY_BUFFER, pMarkupBuffer);
		        pWebGLContext.vertexAttribPointer(pWebGLProgram.getWebGLLocation("INDEX"), 1, GL_FLOAT, false, 8, 0);
		        pWebGLContext.vertexAttribPointer(pWebGLProgram.getWebGLLocation("SHIFT"), 1, GL_FLOAT, false, 8, 4);

		        pWebGLContext.viewport(0, 0, this._iWidth, this._iHeight);
		        pWebGLContext.drawArrays(0, 0, nPixels);
		        pWebGLContext.flush();

		        pWebGLContext.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, null, 0);

		        pWebGLRenderer.bindWebGLBuffer(GL_ARRAY_BUFFER, null);
		        pWebGLRenderer.deleteWebGLBuffer(pValueBuffer);
		        pWebGLRenderer.deleteWebGLBuffer(pMarkupBuffer);

		        pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, null);
		        pWebGLRenderer.deleteWebGLFramebuffer(pWebGLFramebuffer);

		    }

		    return true;
		}

		resize(iSize: uint): bool {
			var eUsage: int;
			var pData: Uint8Array;
			var iMax: int = 0;
			var pVertexData: IVertexData;
		    var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getEngine().getRenderer();
			
			if(this.isBackupPresent()) {
				return false;		
			}

			if(iSize < this.byteLength) {
				for(var k: int = 0; k < this._pVertexDataArray; ++ k) {
					pVertexData = this._pVertexDataArray[k];

					if(pVertexData.byteOffset + pVertexData.byteLength > iMax) {
						iMax = pVertexData.byteOffset + pVertexData.byteLength;
					}		
				}	

				debug_assert(iMax <= iSize,
					"Уменьшение невозможно. Страая разметка не укладывается в новый размер");
			}
			
			if(this._pWebGLContext.isTexture(this._pWebGLTexture)) {
				this._pWebGLContext.deleteTexture(this._pWebGLTexture);
			}		


		    this._pWebGLTexture = this._pWebGLContext.createTexture();

		    if (!this._pWebGLTexture) {
		        CRITICAL("Не удалось создать текстуру");
		        
		        this.destroy();
		        return false;
		    }


		    pWebGLRenderer.bindWebGLTexture(GL_TEXTURE_2D, this._pWebGLTexture);
			
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

		private updatePixelRect(iX: uint, iY: uint, iW: uint, iH: uint, pData: Float32Array): void {
            iBeginElement = iEndElement;
            iEndElement = iW * iH * nElementsPerPix + iEndElement;

            pWebGLRenderer.bindWebGLTexture(GL_TEXTURE_2D, this._pWebGLTexture);

            this._pWebGLContext.texSubImage2D(GL_TEXTURE_2D, 0, iX, iY, iW, iH, 
            	this._eWebGLFormat, this._eWebGLType, pData);
        };

		protected lockImpl(iOffset: uint, iSize: uint, iLockFlags: int): any {
	        var pRetData: Uint8Array = new Uint8Array(iSize);

            this.readData(iOffset, iSize, pRetData);

            this._pLockData = pRealData;

	        return pRealData;
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
