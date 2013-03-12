#ifndef VERTEXBUFFERTBO_TS
#define VERTEXBUFFERTBO_TS


#include "IVertexBuffer.ts"
#include "IRenderResource.ts"
#include "core/pool/resources/VertexBuffer.ts"
#include "webgl.ts"
#include "WebGLShaderProgram.ts" 

#define WEBGL_VERTEX_TEXTURE_MIN_SIZE 32

#define VIDEOBUFFER_HEADER_WIDTH 0
#define VIDEOBUFFER_HEADER_HEIGHT 1
#define VIDEOBUFFER_HEADER_STEP_X 2
#define VIDEOBUFFER_HEADER_STEP_Y 3
#define VIDEOBUFFER_HEADER_NUM_PIXELS 4
#define VIDEOBUFFER_HEADER_NUM_ELEMENTS 5

module akra.webgl {
	export class WebGLVertexTexture extends core.pool.resources.VertexBuffer implements IVertexBuffer {
		protected _iWidth: uint = 0;
		protected _iHeight: uint = 0;

		protected _pWebGLTexture: WebGLTexture = null;
		protected _eWebGLFormat: int;
		protected _eWebGLType: int;

		protected _ePixelFormat: EPixelFormats = EPixelFormats.FLOAT32_RGBA;
		//переменная нужна, чтобы проигнорировать обновление копии, обычно, это не требуется
		protected _bForceUpdateBackupCopy: bool = true;

		/*vertex data for header updating*/
		protected _pHeader: IVertexData = null;

		private _pLockData: Uint8Array = null;

		inline get type(): EVertexBufferTypes { return EVertexBufferTypes.TBO; }
		inline get byteLength(): uint { return pixelUtil.getMemorySize(this._iWidth, this._iHeight, 1, this._ePixelFormat); }
		

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

			var iAdditionalHeaderSize: uint = (isDefAndNotNull(pData)) ? 32 /*header size*/ : 0;

			iByteSize = math.max(iByteSize + iAdditionalHeaderSize, pixelUtil.getMemorySize(iMinWidth, iMinWidth, 1, this._ePixelFormat));

			if (TEST_ANY(iFlags, EHardwareBufferFlags.READABLE)) {
	            SET_ALL(iFlags, EHardwareBufferFlags.BACKUP_COPY);
	        }

			super.create(iByteSize, iFlags, pData);

			var pPOTSize: uint[] = math.calcPOTtextureSize(math.ceil(iByteSize / pixelUtil.getNumElemBytes(this._ePixelFormat)));
			var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getManager().getEngine().getRenderer();
		    var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
		    var i: int;

		    iWidth = pPOTSize[0];
		    iHeight = pPOTSize[1];

		    debug_assert(this._pWebGLTexture == null, "webgl texture already allocated");

			this._iWidth = iWidth;
			this._iHeight = iHeight;
		    this._iFlags = iFlags;

		    debug_assert(pWebGLContext !== null, "cannot grab webgl context");

		    //Софтварного рендеринга буфера у нас нет
		    debug_assert(!this.isSoftware(), "no software rendering");

		    //Если есть локальная копия то буфер можно читать
		    if (this.isBackupPresent()) {
		        SET_ALL(this._iFlags, EHardwareBufferFlags.READABLE);
		    }
			
			debug_assert(!pData || pData.byteLength <= iByteSize, 
				"Размер переданного массива больше переданного размера буфера");
			
		    this._pWebGLTexture = pWebGLRenderer.createWebGLTexture();
		    this._eWebGLFormat = getWebGLOriginFormat(this._ePixelFormat);
		    this._eWebGLType = getWebGLOriginDataType(this._ePixelFormat);

		    if (!this._pWebGLTexture) {
		        CRITICAL("Не удалось создать буфер");
		        
		        this.destroy();
		        return false;
		    }

		    if (isDefAndNotNull(pData)) {
		    	
		    	if (pData.BYTES_PER_ELEMENT > 1) {
		    		pDataU8 = new Uint8Array(pData, pData.byteOffset, pData.byteLength);
		    	}

		    	pTextureData = new Uint8Array(this.byteLength);
		    	pTextureData.set(pDataU8);
		    }

		    pWebGLRenderer.bindWebGLTexture(GL_TEXTURE_2D, this._pWebGLTexture);
		    pWebGLContext.texImage2D(GL_TEXTURE_2D, 0, this._eWebGLFormat, 
		    	this._iWidth, this._iHeight, 0,  this._eWebGLFormat, this._eWebGLType, pTextureData);

		    pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_MAG_FILTER, pWebGLContext.NEAREST);
		    pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_MIN_FILTER, pWebGLContext.NEAREST);
		    pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_WRAP_S, pWebGLContext.CLAMP_TO_EDGE);
		    pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_WRAP_T, pWebGLContext.CLAMP_TO_EDGE);
		    
		    //create header
		    this._pHeader = this.allocateData([VE_VEC2(DeclarationUsages.TEXTURE_HEADER)], this._header());


		    /**
		    * update program
		    **/

		    var pProgram: IShaderProgram = <IShaderProgram>this.getManager().shaderProgramPool.findResource("WEBGL_vertex_texture_update");

	        if (isNull(pProgram)) {
	        	pProgram = <IShaderProgram>this.getManager().shaderProgramPool.createResource("WEBGL_vertex_texture_update");
	        	pProgram.create(
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
				    gl_PointSize = 1.;																				\n\
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

	        /**
		    * resize program
		    **/

	        pProgram = <IShaderProgram>this.getManager().shaderProgramPool.findResource("WEBGL_vertex_texture_resize");

	        if (isNull(pProgram)) {
	        	pProgram = <IShaderProgram>this.getManager().shaderProgramPool.createResource("WEBGL_vertex_texture_resize");
	        	pProgram.create(
	        	"																									\n\
	        	attribute float INDEX;																				\n\
	        																										\n\
	        	uniform sampler2D sourceTexture;																	\n\
				                      																				\n\
				uniform vec2 v2fSrcTexSize;																			\n\
				uniform vec2 v2fDstTexSize;																			\n\
																													\n\
				varying vec4 v4fValue;																				\n\
				                   																					\n\
				void main(void){																					\n\
					                       																			\n\
				    vec2 v2fSrcPosition = vec2((mod(INDEX, v2fSrcTexSize.x) + 0.5)/v2fSrcTexSize.x,					\n\
				    						   (floor(INDEX/v2fSrcTexSize.x) + 0.5)/v2fSrcTexSize.y);				\n\
	        																										\n\
	        		vec2 v2fDstPosition = vec2((mod(INDEX, v2fDstTexSize.x) + 0.5)/v2fDstTexSize.x,					\n\
				    						   (floor(INDEX/v2fDstTexSize.x) + 0.5)/v2fDstTexSize.y);				\n\
	        																										\n\
	        		v4fValue = texture2D(sourceTexture, v2fSrcPosition);											\n\
	        																										\n\
	        		gl_PointSize = 1.;																				\n\
	        		gl_Position = vec4(v2fDstPosition*2. - 1., 0., 1.);												\n\
				}																									\n\
				",
				"									\n\
				#ifdef GL_ES                        \n\
				    precision highp float;          \n\
				#endif								\n\
				varying vec4 v4fValue;              \n\
				                                    \n\
				void main(void) {                   \n\
				    gl_FragColor = v4fValue;        \n\
				}                                   \n\
				");
	        }

		    return true;
		}

		destroy(): void {
			super.destroy();

			var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getManager().getEngine().getRenderer();
			pWebGLRenderer.deleteWebGLTexture(this._pWebGLTexture);

			this._pWebGLTexture = null;
		}

		readData(ppDest: ArrayBufferView): bool;
		readData(iOffset: uint, iSize: uint, ppDest: ArrayBufferView): bool;
		readData(iOffset: any, iSize?: any, ppDest?: any): bool { 
			debug_assert(!isNull(this._pWebGLTexture), "Буффер еще не создан");

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
		    var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

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
		        this._pBackupCopy.writeData(pDataU8, iOffset);
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
		        var iWidth: int 	= this._iWidth;
		        var iYmin: int 		= Math.floor(iBeginPix / iWidth);
		        var iYmax: int 		= Math.ceil(iEndPix / iWidth);
		        var iXbegin: int 	= iBeginPix % iWidth;
		        var iXend: int 		= iEndPix % iWidth;
		        var iHeight: int 	= iYmax - iYmin;
		        
		        var iBeginElement: int 	= 0, 
		        	iEndElement: int 	= 0;

		        //hack: if iEndPixel is first pixel from next row

		        iXend = (iXend === 0 ? iWidth : iXend);

		        //FIX THIS, move this function from here...
		        var me = this;
		        function updatePixelRect(iX: uint, iY: uint, iW: uint, iH: uint): void {
		            iBeginElement = iEndElement;
		            iEndElement = iW * iH * nElementsPerPix + iEndElement;

		            pWebGLRenderer.bindWebGLTexture(GL_TEXTURE_2D, me._pWebGLTexture);

		            pWebGLContext.texSubImage2D(GL_TEXTURE_2D, 0, iX, iY, iW, iH, 
		            	me._eWebGLFormat, me._eWebGLType, pBufferData.subarray(iBeginElement, iEndElement));
		        };

		        if (iHeight === 1) {
		            updatePixelRect(iXbegin, iYmin, iXend - iXbegin, 1);
		        }
		        else {

		            updatePixelRect(iXbegin, iYmin, iWidth - iXbegin, 1);
		            
		            if (iHeight > 2) {
		                updatePixelRect(0, iYmin + 1, iWidth, iHeight - 2);
		            }

		            updatePixelRect(0, iYmax - 1, iXend, 1);
		        }
		    }
		    else if (this.isBackupPresent()) {
		        var iRealOffset: uint 	= iBeginPix * nElementsPerPix * iTypeSize;
		        var iRealSize: uint 	= nElements * iTypeSize;
		        var pTempData: Uint8Array = <Uint8Array>this._pBackupCopy.lock(iRealOffset, iRealSize);
		        //var iTotalSize: uint 	= iRealOffset + iRealSize;
		        
		        //FIX ME:
		        this._pBackupCopy.unlock();

		        this._bForceUpdateBackupCopy = false;

		        return this.writeData(pTempData, iRealOffset, iRealSize);
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

		        var pWebGLFramebuffer: WebGLFramebuffer = pWebGLRenderer.createWebGLFramebuffer();
		        var pWebGLProgram: WebGLShaderProgram = <WebGLShaderProgram>this.getManager().shaderProgramPool.findResource("WEBGL_vertex_texture_update");
		        
		        var pValueBuffer: WebGLBuffer 		= pWebGLRenderer.createWebGLBuffer();
		        var pMarkupIndexBuffer: WebGLBuffer = pWebGLRenderer.createWebGLBuffer();
		        var pMarkupShiftBuffer: WebGLBuffer = pWebGLRenderer.createWebGLBuffer();

		        debug_assert(isDef(pWebGLProgram), "cound not find WEBGL_vertex_texture_update program");

		        pWebGLRenderer.disableAllWebGLVertexAttribs();

		        pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, pWebGLFramebuffer);
		        pWebGLRenderer.useWebGLProgram(pWebGLProgram.getWebGLProgram());

		        pWebGLContext.disable(GL_DEPTH_TEST);
		        pWebGLContext.disable(GL_SCISSOR_TEST);
		        pWebGLContext.disable(GL_BLEND);
		        pWebGLContext.disable(GL_CULL_FACE);

		        var iValueAttribLocation: uint = pWebGLProgram.getWebGLAttributeLocation("VALUE");
		        var iIndexAttribLocation: uint = pWebGLProgram.getWebGLAttributeLocation("INDEX");
		        var iShiftAttribLocation: uint = pWebGLProgram.getWebGLAttributeLocation("SHIFT");

		        pWebGLContext.enableVertexAttribArray(iValueAttribLocation);
		        pWebGLContext.enableVertexAttribArray(iIndexAttribLocation);
		        pWebGLContext.enableVertexAttribArray(iShiftAttribLocation);

		        pWebGLContext.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, 
		        	GL_TEXTURE_2D, this._pWebGLTexture, 0);

		        pWebGLRenderer.bindWebGLBuffer(GL_ARRAY_BUFFER, pValueBuffer);
		        pWebGLContext.bufferData(GL_ARRAY_BUFFER, pRealData, GL_STREAM_DRAW);
		        pWebGLContext.vertexAttribPointer(iValueAttribLocation, 4, GL_FLOAT, false, 0, 0);
		        
		        pWebGLRenderer.bindWebGLBuffer(GL_ARRAY_BUFFER, pMarkupIndexBuffer);
		        pWebGLContext.bufferData(GL_ARRAY_BUFFER, pMarkupDataIndex, GL_STREAM_DRAW);
		        pWebGLContext.vertexAttribPointer(iIndexAttribLocation, 1, GL_FLOAT, false, 0, 0);
		        

		        pWebGLRenderer.bindWebGLBuffer(GL_ARRAY_BUFFER, pMarkupShiftBuffer);
		        pWebGLContext.bufferData(GL_ARRAY_BUFFER, pMarkupDataShift, GL_STREAM_DRAW);
		        pWebGLContext.vertexAttribPointer(iShiftAttribLocation, 1, GL_FLOAT, false, 0, 0);

		        pWebGLRenderer.activateWebGLTexture(GL_TEXTURE0);
		        pWebGLRenderer.bindWebGLTexture(GL_TEXTURE_2D, this._pWebGLTexture);

		        pWebGLProgram.setInt("sourceTexture", 0);
		        pWebGLProgram.setVec2("size", this._iWidth, this._iHeight);

		        pWebGLContext.viewport(0, 0, this._iWidth, this._iHeight);
		        pWebGLContext.drawArrays(GL_POINTS, 0, nPixels);
		        pWebGLContext.flush();

		        pWebGLContext.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, null, 0);

		        pWebGLRenderer.bindWebGLBuffer(GL_ARRAY_BUFFER, null);

		        pWebGLContext.disableVertexAttribArray(iValueAttribLocation);
		        pWebGLContext.disableVertexAttribArray(iIndexAttribLocation);
		        pWebGLContext.disableVertexAttribArray(iShiftAttribLocation);

		        pWebGLRenderer.deleteWebGLBuffer(pValueBuffer);
		        pWebGLRenderer.deleteWebGLBuffer(pMarkupShiftBuffer);
		        pWebGLRenderer.deleteWebGLBuffer(pMarkupIndexBuffer);

		        pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, null);
		        pWebGLRenderer.deleteWebGLFramebuffer(pWebGLFramebuffer);
		    }

		    return true;
		}

		resize(iSize: uint): bool {

			var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

			var iMax: int = 0;
			if(iSize < this.byteLength) {
				for(var k: int = 0; k < this._pVertexDataArray.length; ++ k) {
					var pVertexData: IVertexData = this._pVertexDataArray[k];

					if(pVertexData.byteOffset + pVertexData.byteLength > iMax) {
						iMax = pVertexData.byteOffset + pVertexData.byteLength;
					}		
				}	

				if(iMax > iSize){
					debug_assert(false,
						"Уменьшение невозможно. Страая разметка не укладывается в новый размер");
					return false;
				}
			}

			var pPOTSize: uint[] = math.calcPOTtextureSize(math.ceil(iSize / pixelUtil.getNumElemBytes(this._ePixelFormat)));

			pPOTSize[0] = (pPOTSize[0] < WEBGL_VERTEX_TEXTURE_MIN_SIZE) ? WEBGL_VERTEX_TEXTURE_MIN_SIZE : pPOTSize[0];
			pPOTSize[1] = (pPOTSize[1] < WEBGL_VERTEX_TEXTURE_MIN_SIZE) ? WEBGL_VERTEX_TEXTURE_MIN_SIZE : pPOTSize[1];

			if(pPOTSize[0] !== this._iWidth || pPOTSize[1] !== this._iHeight){
				if(this.isBackupPresent()){
					this._iWidth = pPOTSize[0];
					this._iHeight = pPOTSize[1];

					pWebGLRenderer.bindWebGLTexture(GL_TEXTURE_2D, this._pWebGLTexture);
				    pWebGLContext.texImage2D(GL_TEXTURE_2D, 0, this._eWebGLFormat, 
				    	this._iWidth, this._iHeight, 0,  this._eWebGLFormat, this._eWebGLType, null);


				    var iByteLength: uint = this.byteLength;

				    /*resing backup copy don't cause data loss*/
				    this._pBackupCopy.resize(iByteLength);

					var pData: Uint8Array = new Uint8Array(iByteLength);
					
					if (!this.readData(pData)) {
						debug_warning("cannot read data from buffer");
						return false;
					}

					this.writeData(pData, 0, iByteLength);
				}
				else{
			        var pWebGLProgram: WebGLShaderProgram = <WebGLShaderProgram>this.getManager().shaderProgramPool.findResource("WEBGL_vertex_texture_resize");

			        debug_assert(isDef(pWebGLProgram), "cound not find WEBGL_vertex_texture_resize program");

			        pWebGLRenderer.useWebGLProgram(pWebGLProgram.getWebGLProgram());

			        //create new texture for resize
					var pTexture : WebGLTexture = pWebGLRenderer.createWebGLTexture();
					pWebGLRenderer.activateWebGLTexture(GL_TEXTURE1);
					pWebGLRenderer.bindWebGLTexture(GL_TEXTURE_2D, pTexture);
				    pWebGLContext.texImage2D(GL_TEXTURE_2D, 0, this._eWebGLFormat, 
				    	pPOTSize[0], pPOTSize[1], 0,  this._eWebGLFormat, this._eWebGLType, null);

				    pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_MAG_FILTER, pWebGLContext.NEAREST);
				    pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_MIN_FILTER, pWebGLContext.NEAREST);
				    pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_WRAP_S, pWebGLContext.CLAMP_TO_EDGE);
				    pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_WRAP_T, pWebGLContext.CLAMP_TO_EDGE);

			        var pWebGLFramebuffer: WebGLFramebuffer = pWebGLRenderer.createWebGLFramebuffer();
			        pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, pWebGLFramebuffer);
			        pWebGLContext.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, 
			        	GL_TEXTURE_2D, pTexture, 0);

			        if(iSize >= this.byteLength) {
			        	/*in other case we already have iMax*/
						for(var k: int = 0; k < this._pVertexDataArray.length; ++ k) {
							var pVertexData: IVertexData = this._pVertexDataArray[k];

							if(pVertexData.byteOffset + pVertexData.byteLength > iMax) {
								iMax = pVertexData.byteOffset + pVertexData.byteLength;
							}		
						}	
					}

			        var iTypeSize: uint 		= pixelUtil.getComponentTypeBits(this._ePixelFormat) / 8; /*предпологается, что float*/
		        	var nElementsPerPix: uint 	= pixelUtil.getComponentCount(this._ePixelFormat);		 /*число float'ов в пикселе*/
		        	var nPixels: uint = math.ceil(iMax/iTypeSize/nElementsPerPix);

		        	var pIndexBufferData: Float32Array = new Float32Array(nPixels);
		        	for(var i:int = 0; i < nPixels; i++){
		        		pIndexBufferData[i] = i;
		        	}

		        	pWebGLRenderer.disableAllWebGLVertexAttribs();

		        	var iIndexAttribLocation: uint = pWebGLProgram.getWebGLAttributeLocation("INDEX");

		        	pWebGLContext.enableVertexAttribArray(iIndexAttribLocation);

			        var pIndexBuffer: WebGLBuffer = pWebGLRenderer.createWebGLBuffer();
			        pWebGLRenderer.bindWebGLBuffer(GL_ARRAY_BUFFER, pIndexBuffer);
			        pWebGLContext.bufferData(GL_ARRAY_BUFFER, pIndexBufferData, GL_STREAM_DRAW);
			        pWebGLContext.vertexAttribPointer(iIndexAttribLocation, 1, GL_FLOAT, false, 0, 0);

			        pWebGLContext.disable(GL_DEPTH_TEST);
			        pWebGLContext.disable(GL_SCISSOR_TEST);
			        pWebGLContext.disable(GL_BLEND);
			        pWebGLContext.disable(GL_CULL_FACE);

			        pWebGLRenderer.activateWebGLTexture(GL_TEXTURE0);
			        pWebGLRenderer.bindWebGLTexture(GL_TEXTURE_2D, this._pWebGLTexture);

			        pWebGLProgram.setInt("sourceTexture", 0);
		        	pWebGLProgram.setVec2("v2fSrcTexSize", this._iWidth, this._iHeight);
		        	pWebGLProgram.setVec2("v2fDstTexSize", pPOTSize[0], pPOTSize[1]);

			        pWebGLContext.viewport(0, 0, pPOTSize[0], pPOTSize[1]);
			        pWebGLContext.drawArrays(GL_POINTS, 0, nPixels);
			        pWebGLContext.flush();

			        pWebGLContext.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, null, 0);

			        pWebGLContext.disableVertexAttribArray(iIndexAttribLocation);
			        pWebGLRenderer.bindWebGLBuffer(GL_ARRAY_BUFFER, null);
			        pWebGLRenderer.deleteWebGLBuffer(pIndexBuffer);

			        pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, null);
			        pWebGLRenderer.deleteWebGLFramebuffer(pWebGLFramebuffer);

			        pWebGLRenderer.deleteWebGLTexture(this._pWebGLTexture);

			        this._pWebGLTexture = pTexture;
			        this._iWidth = pPOTSize[0];
			        this._iHeight = pPOTSize[1];
				}
			}		
			
			this._pHeader.setData(this._header());

			this.notifyAltered();

			return true;
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

		protected _header(iTextureSizeX: uint = this._iWidth, iTextureSizeY: uint = this._iHeight){
			var pHeader: Float32Array = new Float32Array(8);

			pHeader[VIDEOBUFFER_HEADER_WIDTH] = iTextureSizeX;
			pHeader[VIDEOBUFFER_HEADER_HEIGHT] = iTextureSizeY;
			pHeader[VIDEOBUFFER_HEADER_STEP_X] = 1/iTextureSizeX;
			pHeader[VIDEOBUFFER_HEADER_STEP_Y] = 1/iTextureSizeY;
			pHeader[VIDEOBUFFER_HEADER_NUM_PIXELS] = iTextureSizeX * iTextureSizeY;
			pHeader[VIDEOBUFFER_HEADER_NUM_ELEMENTS] = pHeader[VIDEOBUFFER_HEADER_NUM_PIXELS] * pixelUtil.getNumElemBytes(this._ePixelFormat);

			return pHeader;
		};
	}

	
}

#endif
