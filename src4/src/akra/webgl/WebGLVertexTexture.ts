/// <reference path="../idl/IVertexBuffer.ts" />
/// <reference path="../idl/IRenderResource.ts" />

/// <reference path="../pool/resources/VertexBuffer.ts" />
/// <reference path="../pixelUtil/pixelUtil.ts" />

/// <reference path="webgl.ts" />
/// <reference path="WebGLShaderProgram.ts"  />
/// <reference path="WebGLRenderer.ts" />



module akra.webgl {
	import VE = data.VertexElement;

	/** @const */ var VIDEOBUFFER_HEADER_WIDTH: uint = 0;
	/** @const */ var VIDEOBUFFER_HEADER_HEIGHT: uint = 1;
	/** @const */ var VIDEOBUFFER_HEADER_STEP_X: uint = 2;
	/** @const */ var VIDEOBUFFER_HEADER_STEP_Y: uint = 3;
	/** @const */ var VIDEOBUFFER_HEADER_NUM_PIXELS: uint = 4;
	/** @const */ var VIDEOBUFFER_HEADER_NUM_ELEMENTS: uint = 5;

	export class WebGLVertexTexture extends pool.resources.VertexBuffer implements IVertexBuffer {
		protected _iWidth: uint = 0;
		protected _iHeight: uint = 0;

		protected _pWebGLTexture: WebGLTexture = null;
		protected _eWebGLFormat: int;
		protected _eWebGLType: int;

		protected _ePixelFormat: EPixelFormats = EPixelFormats.FLOAT32_RGBA;
		//переменная нужна, чтобы проигнорировать обновление копии, обычно, это не требуется
		protected _bForceUpdateBackupCopy: boolean = true;

		/*vertex data for header updating*/
		protected _pHeader: IVertexData = null;

		private _pLockData: Uint8Array = null;

		 get type(): EVertexBufferTypes { return EVertexBufferTypes.TBO; }
		 get byteLength(): uint { return pixelUtil.getMemorySize(this._iWidth, this._iHeight, 1, this._ePixelFormat); }
		
		 getWebGLTexture(): WebGLTexture {
			return this._pWebGLTexture;
		}

		constructor (/*pManager: IResourcePoolManager*/) {
			super(/*pManager*/);
		}

		 _getWidth(): uint{
			return this._iWidth;
		}

		 _getHeight(): uint{
			return this._iHeight;
		}

		create(iByteSize: uint, iFlags?: uint, pData?: Uint8Array): boolean;
		create(iByteSize: uint, iFlags?: uint, pData?: ArrayBufferView): boolean;
		create(iByteSize: uint, iFlags: uint = EHardwareBufferFlags.STATIC, pData: any = null): boolean {

			var iMinWidth: uint = config.webgl.vertexTextureMinSize;
			var iWidth: uint, iHeight: uint;
			var pTextureData: Uint8Array = null;
			var pDataU8: Uint8Array = pData;

			var iAdditionalHeaderSize: uint = (isDefAndNotNull(pData)) ? 32 /*header size*/ : 0;

			iByteSize = math.max(iByteSize + iAdditionalHeaderSize, pixelUtil.getMemorySize(iMinWidth, iMinWidth, 1, this._ePixelFormat));

			if (bf.testAny(iFlags, EHardwareBufferFlags.READABLE)) {
				bf.setAll(iFlags, EHardwareBufferFlags.BACKUP_COPY);
			}

			super.create(iByteSize, iFlags, pData);

			var pPOTSize: uint[] = math.calcPOTtextureSize(math.ceil(iByteSize / pixelUtil.getNumElemBytes(this._ePixelFormat)));
			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
			var i: int;

			iWidth = pPOTSize[0];
			iHeight = pPOTSize[1];

			debug.assert(this._pWebGLTexture == null, "webgl texture already allocated");

			this._iWidth = iWidth;
			this._iHeight = iHeight;
			this._iFlags = iFlags;

			debug.assert(pWebGLContext !== null, "cannot grab webgl context");

			//Софтварного рендеринга буфера у нас нет
			debug.assert(!this.isSoftware(), "no software rendering");

			//Если есть локальная копия то буфер можно читать
			if (this.isBackupPresent()) {
				bf.setAll(this._iFlags, EHardwareBufferFlags.READABLE);
			}
			
			debug.assert(!pData || pData.byteLength <= iByteSize, 
				"Размер переданного массива больше переданного размера буфера");
			
			logger.assert(loadExtension(pWebGLContext, "OES_texture_float"), 
				"OES_texture_float extension is necessary for correct work.");

			this._pWebGLTexture = pWebGLRenderer.createWebGLTexture();
			this._eWebGLFormat = getWebGLFormat(this._ePixelFormat);
			this._eWebGLType = getWebGLDataType(this._ePixelFormat);

			if (!this._pWebGLTexture) {
				logger.critical("Не удалось создать буфер");
				
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

			pWebGLRenderer.bindWebGLTexture(gl.TEXTURE_2D, this._pWebGLTexture);
			pWebGLContext.texImage2D(gl.TEXTURE_2D, 0, this._eWebGLFormat, 
				this._iWidth, this._iHeight, 0,  this._eWebGLFormat, this._eWebGLType, pTextureData);

			pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_MAG_FILTER, pWebGLContext.NEAREST);
			pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_MIN_FILTER, pWebGLContext.NEAREST);
			pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_WRAP_S, pWebGLContext.CLAMP_TO_EDGE);
			pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_WRAP_T, pWebGLContext.CLAMP_TO_EDGE);
			
			pWebGLRenderer.bindWebGLTexture(gl.TEXTURE_2D, null);

			//create header
			this._pHeader = this.allocateData([VE.float2(data.Usages.TEXTURE_HEADER)], this._header());


			/**
			* update program
			**/

			var pProgram: IShaderProgram = <IShaderProgram>this.getManager().shaderProgramPool.findResource("WEBgl.vertex_texture_update");

			if (isNull(pProgram)) {
				pProgram = <IShaderProgram>this.getManager().shaderProgramPool.createResource("WEBgl.vertex_texture_update");
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
				#ifdef gl.ES                        \n\
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

			pProgram = <IShaderProgram>this.getManager().shaderProgramPool.findResource("WEBgl.vertex_texture_resize");

			if (isNull(pProgram)) {
				pProgram = <IShaderProgram>this.getManager().shaderProgramPool.createResource("WEBgl.vertex_texture_resize");
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
				#ifdef gl.ES                        \n\
					precision highp float;          \n\
				#endif								\n\
				varying vec4 v4fValue;              \n\
													\n\
				void main(void) {                   \n\
					gl_FragColor = v4fValue;        \n\
				}                                   \n\
				");
			}

			if(isNull(WebGLVertexTexture._pWebGLBuffer1)){
					WebGLVertexTexture._pWebGLBuffer1 = pWebGLRenderer.createWebGLBuffer();
			}
			if(isNull(WebGLVertexTexture._pWebGLBuffer2)){
				WebGLVertexTexture._pWebGLBuffer2 = pWebGLRenderer.createWebGLBuffer();
			}
			if(isNull(WebGLVertexTexture._pWebGLBuffer3)){
				WebGLVertexTexture._pWebGLBuffer3 = pWebGLRenderer.createWebGLBuffer();
			}

			return true;
		}

		destroy(): void {
			super.destroy();

			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
			pWebGLRenderer.deleteWebGLTexture(this._pWebGLTexture);

			this._pWebGLTexture = null;
		}

		readData(ppDest: ArrayBufferView): boolean;
		readData(iOffset: uint, iSize: uint, ppDest: ArrayBufferView): boolean;
		readData(iOffset: any, iSize?: any, ppDest?: any): boolean { 
			debug.assert(!isNull(this._pWebGLTexture), "Буффер еще не создан");

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

		writeData(pData: Uint8Array, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer?: boolean): boolean;
		writeData(pData: ArrayBufferView, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer?: boolean): boolean;
		writeData(pData: any, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer: boolean = false): boolean { 
			
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

			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

			var pDataU8: Uint8Array = pData;

			logger.assert(bDiscardWholeBuffer === false, "Discard option temporary unsupported.");

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

			debug.assert(iOffset % iTypeSize === 0 && iSize % iTypeSize === 0, "Incorrect data size or offset");

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

					pWebGLRenderer.bindWebGLTexture(gl.TEXTURE_2D, me._pWebGLTexture);

					pWebGLContext.texSubImage2D(gl.TEXTURE_2D, 0, iX, iY, iW, iH, 
						me._eWebGLFormat, me._eWebGLType, pBufferData.subarray(iBeginElement, iEndElement));

					pWebGLRenderer.bindWebGLTexture(gl.TEXTURE_2D, null);
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
				//console.error(this);

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

				var pOldFrameBuffer: WebGLFramebuffer = pWebGLRenderer.getParameter(gl.FRAMEBUFFER_BINDING);

				var pWebGLFramebuffer: WebGLFramebuffer = pWebGLRenderer.createWebGLFramebuffer();
				var pWebGLProgram: WebGLShaderProgram = <WebGLShaderProgram>this.getManager().shaderProgramPool.findResource("WEBgl.vertex_texture_update");

				var pValueBuffer: WebGLBuffer 		= WebGLVertexTexture._pWebGLBuffer1;
				var pMarkupIndexBuffer: WebGLBuffer = WebGLVertexTexture._pWebGLBuffer2;
				var pMarkupShiftBuffer: WebGLBuffer = WebGLVertexTexture._pWebGLBuffer3;

				debug.assert(isDef(pWebGLProgram), "cound not find WEBgl.vertex_texture_update program");

				pWebGLRenderer.disableAllWebGLVertexAttribs();

				pWebGLRenderer.bindWebGLFramebuffer(gl.FRAMEBUFFER, pWebGLFramebuffer);
				pWebGLRenderer.useWebGLProgram(pWebGLProgram.getWebGLProgram());

				pWebGLRenderer.disable(gl.DEPTH_TEST);
				pWebGLRenderer.disable(gl.SCISSOR_TEST);
				pWebGLRenderer.disable(gl.BLEND);
				pWebGLRenderer.disable(gl.CULL_FACE);

				var iValueAttribLocation: uint = pWebGLProgram.getWebGLAttributeLocation("VALUE");
				var iIndexAttribLocation: uint = pWebGLProgram.getWebGLAttributeLocation("INDEX");
				var iShiftAttribLocation: uint = pWebGLProgram.getWebGLAttributeLocation("SHIFT");

				pWebGLContext.enableVertexAttribArray(iValueAttribLocation);
				pWebGLContext.enableVertexAttribArray(iIndexAttribLocation);
				pWebGLContext.enableVertexAttribArray(iShiftAttribLocation);

				pWebGLContext.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, 
					gl.TEXTURE_2D, this._pWebGLTexture, 0);

				pWebGLRenderer.bindWebGLBuffer(gl.ARRAY_BUFFER, pValueBuffer);
				pWebGLContext.bufferData(gl.ARRAY_BUFFER, pRealData, gl.STREAM_DRAW);
				pWebGLContext.vertexAttribPointer(iValueAttribLocation, 4, gl.FLOAT, false, 0, 0);
				
				pWebGLRenderer.bindWebGLBuffer(gl.ARRAY_BUFFER, pMarkupIndexBuffer);
				pWebGLContext.bufferData(gl.ARRAY_BUFFER, pMarkupDataIndex, gl.STREAM_DRAW);
				pWebGLContext.vertexAttribPointer(iIndexAttribLocation, 1, gl.FLOAT, false, 0, 0);
				

				pWebGLRenderer.bindWebGLBuffer(gl.ARRAY_BUFFER, pMarkupShiftBuffer);
				pWebGLContext.bufferData(gl.ARRAY_BUFFER, pMarkupDataShift, gl.STREAM_DRAW);
				pWebGLContext.vertexAttribPointer(iShiftAttribLocation, 1, gl.FLOAT, false, 0, 0);

				pWebGLRenderer.activateWebGLTexture(gl.TEXTURE0);
				pWebGLRenderer.bindWebGLTexture(gl.TEXTURE_2D, this._pWebGLTexture);

				pWebGLProgram.setInt("sourceTexture", 0);
				pWebGLProgram.setVec2("size", math.Vec2.temp(this._iWidth, this._iHeight));

				pWebGLContext.viewport(0, 0, this._iWidth, this._iHeight);
				pWebGLContext.drawArrays(gl.POINTS, 0, nPixels);
				pWebGLContext.flush();

				pWebGLContext.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);

				pWebGLRenderer.bindWebGLBuffer(gl.ARRAY_BUFFER, null);
				pWebGLRenderer.bindWebGLTexture(gl.TEXTURE_2D, null);

				pWebGLContext.disableVertexAttribArray(iValueAttribLocation);
				pWebGLContext.disableVertexAttribArray(iIndexAttribLocation);
				pWebGLContext.disableVertexAttribArray(iShiftAttribLocation);

				//pWebGLRenderer.deleteWebGLBuffer(pValueBuffer);
				//pWebGLRenderer.deleteWebGLBuffer(pMarkupShiftBuffer);
				//pWebGLRenderer.deleteWebGLBuffer(pMarkupIndexBuffer);

				pWebGLRenderer.bindWebGLFramebuffer(gl.FRAMEBUFFER, pOldFrameBuffer);
				pWebGLRenderer.deleteWebGLFramebuffer(pWebGLFramebuffer);
			}

			return true;
		}

		resize(iSize: uint): boolean {

			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

			var iMax: int = 0;
			if(iSize < this.byteLength) {
				for(var k: int = 0; k < this._pVertexDataArray.length; ++ k) {
					var pVertexData: IVertexData = this._pVertexDataArray[k];

					if(pVertexData.getByteOffset() + pVertexData.getByteLength() > iMax) {
						iMax = pVertexData.getByteOffset() + pVertexData.getByteLength();
					}		
				}	

				if(iMax > iSize){
					debug.assert(false,
						"Уменьшение невозможно. Страая разметка не укладывается в новый размер");
					return false;
				}
			}

			var pPOTSize: uint[] = math.calcPOTtextureSize(math.ceil(iSize / pixelUtil.getNumElemBytes(this._ePixelFormat)));

			pPOTSize[0] = (pPOTSize[0] < config.webgl.vertexTextureMinSize) ? config.webgl.vertexTextureMinSize : pPOTSize[0];
			pPOTSize[1] = (pPOTSize[1] < config.webgl.vertexTextureMinSize) ? config.webgl.vertexTextureMinSize : pPOTSize[1];

			if(pPOTSize[0] !== this._iWidth || pPOTSize[1] !== this._iHeight){
				if(this.isBackupPresent()){
					this._iWidth = pPOTSize[0];
					this._iHeight = pPOTSize[1];

					pWebGLRenderer.bindWebGLTexture(gl.TEXTURE_2D, this._pWebGLTexture);
					pWebGLContext.texImage2D(gl.TEXTURE_2D, 0, this._eWebGLFormat, 
						this._iWidth, this._iHeight, 0,  this._eWebGLFormat, this._eWebGLType, null);

					pWebGLRenderer.bindWebGLTexture(gl.TEXTURE_2D, null);

					var iByteLength: uint = this.byteLength;

					/*resing backup copy don't cause data loss*/
					this._pBackupCopy.resize(iByteLength);

					var pData: Uint8Array = new Uint8Array(iByteLength);
					
					if (!this.readData(pData)) {
						debug.warn("cannot read data from buffer");
						return false;
					}

					this.writeData(pData, 0, iByteLength);
				}
				else{
					var pWebGLProgram: WebGLShaderProgram = <WebGLShaderProgram>this.getManager().shaderProgramPool.findResource("WEBgl.vertex_texture_resize");

					debug.assert(isDef(pWebGLProgram), "cound not find WEBgl.vertex_texture_resize program");

					pWebGLRenderer.useWebGLProgram(pWebGLProgram.getWebGLProgram());

					//create new texture for resize
					var pTexture : WebGLTexture = pWebGLRenderer.createWebGLTexture();
					pWebGLRenderer.activateWebGLTexture(gl.TEXTURE1);
					pWebGLRenderer.bindWebGLTexture(gl.TEXTURE_2D, pTexture);
					pWebGLContext.texImage2D(gl.TEXTURE_2D, 0, this._eWebGLFormat, 
						pPOTSize[0], pPOTSize[1], 0,  this._eWebGLFormat, this._eWebGLType, null);

					pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_MAG_FILTER, pWebGLContext.NEAREST);
					pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_MIN_FILTER, pWebGLContext.NEAREST);
					pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_WRAP_S, pWebGLContext.CLAMP_TO_EDGE);
					pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_WRAP_T, pWebGLContext.CLAMP_TO_EDGE);

					var pOldFrameBuffer: WebGLFramebuffer = pWebGLRenderer.getParameter(gl.FRAMEBUFFER_BINDING);

					var pWebGLFramebuffer: WebGLFramebuffer = pWebGLRenderer.createWebGLFramebuffer();
					pWebGLRenderer.bindWebGLFramebuffer(gl.FRAMEBUFFER, pWebGLFramebuffer);
					pWebGLContext.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, 
						gl.TEXTURE_2D, pTexture, 0);

					if(iSize >= this.byteLength) {
						/*in other case we already have iMax*/
						for(var k: int = 0; k < this._pVertexDataArray.length; ++ k) {
							var pVertexData: IVertexData = this._pVertexDataArray[k];

							if(pVertexData.getByteOffset() + pVertexData.getByteLength() > iMax) {
								iMax = pVertexData.getByteOffset() + pVertexData.getByteLength();
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

					if(isNull(WebGLVertexTexture._pWebGLBuffer1)){
						WebGLVertexTexture._pWebGLBuffer1 = pWebGLRenderer.createWebGLBuffer();
					}

					var pIndexBuffer: WebGLBuffer = WebGLVertexTexture._pWebGLBuffer1;

					pWebGLRenderer.bindWebGLBuffer(gl.ARRAY_BUFFER, pIndexBuffer);
					pWebGLContext.bufferData(gl.ARRAY_BUFFER, pIndexBufferData, gl.STREAM_DRAW);
					pWebGLContext.vertexAttribPointer(iIndexAttribLocation, 1, gl.FLOAT, false, 0, 0);

					pWebGLRenderer.disable(gl.DEPTH_TEST);
					pWebGLRenderer.disable(gl.SCISSOR_TEST);
					pWebGLRenderer.disable(gl.BLEND);
					pWebGLRenderer.disable(gl.CULL_FACE);

					pWebGLRenderer.activateWebGLTexture(gl.TEXTURE0);
					pWebGLRenderer.bindWebGLTexture(gl.TEXTURE_2D, this._pWebGLTexture);

					pWebGLProgram.setInt("sourceTexture", 0);
					pWebGLProgram.setVec2("v2fSrcTexSize", math.Vec2.temp(this._iWidth, this._iHeight));
					pWebGLProgram.setVec2("v2fDstTexSize", math.Vec2.temp(pPOTSize[0], pPOTSize[1]));

					pWebGLContext.viewport(0, 0, pPOTSize[0], pPOTSize[1]);
					pWebGLContext.drawArrays(gl.POINTS, 0, nPixels);
					pWebGLContext.flush();

					pWebGLContext.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);

					pWebGLContext.disableVertexAttribArray(iIndexAttribLocation);
					pWebGLRenderer.bindWebGLBuffer(gl.ARRAY_BUFFER, null);
					pWebGLRenderer.bindWebGLTexture(gl.TEXTURE_2D, null);
					//pWebGLRenderer.deleteWebGLBuffer(pIndexBuffer);

					pWebGLRenderer.bindWebGLFramebuffer(gl.FRAMEBUFFER, pOldFrameBuffer);
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
		}

		static _pWebGLBuffer1: WebGLBuffer = null;
		static _pWebGLBuffer2: WebGLBuffer = null;
		static _pWebGLBuffer3: WebGLBuffer = null;
	}

		
}