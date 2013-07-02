#ifndef MEGATEXTURE_TS
#define MEGATEXTURE_TS

#include "IMegaTexture.ts"
#include "net/RPC.ts"
#include "math/math.ts"
#include "core/pool/resources/Texture.ts"
#include "pixelUtil/PixelBox.ts"
#include "IViewport.ts"
#include "IRenderPass.ts"

module akra.terrain {
	interface ISubTextureSettings {
		iX: uint;
		iY: uint;/*Координты буфера в основной текстуре, для простыты должны быть кратну размеру блока*/
    	iTexX:uint; 
    	iTexY:uint;   /*Координаты мегатекстуры в текстуре*/
    	width: uint;
    	height: uint; 
    	isUpdated : bool; 
    	isLoaded : bool;
	}

	export class MegaTexture implements IMegaTexture{
	    private _pEngine: IEngine = null;
	    // private _pDevice = null;

	    private _pObject: any = null;
	    private _pWorldExtents: IRect3d = null;
	    //Координаты камеры на объекте
	    private _v2fCameraCoord: IVec2 = new Vec2(0, 0); 

	    //Путь откуда запрашиваются куски текстуры
	    private _sSurfaceTextures: string = "";

	    //Маскимальный размер стороны текстуры
	    private _v2iOriginalTextreMaxSize: IVec2 = new Vec2(8192 * 0.5);
	    private _v2iOriginalTextreMinSize: IVec2 = new Vec2(1024 * 4.);
	    private _v2iTextureLevelSize: IVec2 = new Vec2(1024);

	    private _iMinLevel: uint = 0;
	    private _iMaxLevel: uint = 0;

	    //Тип хранимых тектсур
	    private _eTextureFormat: EPixelFormats = EPixelFormats.BYTE_RGB;

	    //Размер блока текстуры(минимальный размер выгружаемого куска текстуры)
	    private _iBlockSize: uint = 32;
	    
	    private _iBufferWidth: uint = 0;
	    private _iBufferHeight: uint = 0;	    
	    
	    private _pTextures: ITexture[] = null;
	    private _pTextureForSwap: ITexture = null;

	    //Карта с разметкой буфера, чтобы знать какой части буффер уже отсылалось задание на заполнение
	    private _pSectorLoadInfo: Uint32Array[] = null;
	    private _pXY: ISubTextureSettings[] = null;

	    //Всякие темповые буферы
	    private _pLoadInfoForSwap: Uint32Array  = null;
	    private _pDefaultSectorLoadInfo: Uint32Array = null;

	    private _pRPC: IRPC = null;

	    private _fTexCourdXOld: float = 0xFFFFFFFF;
	    private _fTexCourdYOld: float = 0xFFFFFFFF;
	    private _nCountRender: uint = 0;

	    private _iSectorLifeTime: uint = 60000; 

	    private _pSamplerUniforms: IAFXSamplerState[] = null;
		private _pLoadStatusUniforms: uint[] = null;
		private _pTexcoordOffsetUniforms: IVec2[] = null;

	    constructor(pEngine: IEngine) {
	    	this._pEngine = pEngine;
	    }

	    init(pObject: ISceneObject, sSurfaceTextures: string): void {
	    	this._pObject = pObject;
	    	this._pWorldExtents = pObject.localBounds;
	    	this._sSurfaceTextures = sSurfaceTextures;

	    	if(!this.checkTextureSizeSettings()){
	    		CRITICAL("Wrong texture size settings for MegaTexture");
	    	}

	    	var iCountTex: uint = this._iMaxLevel - this._iMinLevel + 1;

	    	this._pTextures = <ITexture[]> new Array(iCountTex);
	    	this._pSectorLoadInfo = <Uint32Array[]> new Array(iCountTex);
	    	this._pXY = <ISubTextureSettings[]> new Array(iCountTex);

	    	this._iBufferWidth = this._v2iTextureLevelSize.x * 1;
	    	this._iBufferHeight = this._v2iTextureLevelSize.y * 1;

	    	this._pLoadInfoForSwap  = new Uint32Array(this._v2iTextureLevelSize.y * this._v2iTextureLevelSize.x / (this._iBlockSize * this._iBlockSize));
	    	this._pDefaultSectorLoadInfo = new Uint32Array(this._v2iTextureLevelSize.y * this._v2iTextureLevelSize.x / (this._iBlockSize * this._iBlockSize));

	    	for (var i: uint = 0; i < this._pDefaultSectorLoadInfo.length; i++) {
	    	    this._pDefaultSectorLoadInfo[i] = 0;
	    	}

	    	this.setSectorLoadInfoToDefault(this._pLoadInfoForSwap);

	    	//Создаем куски мегатекстуры
	    	var pRmgr: IResourcePoolManager = this._pEngine.getResourceManager();

	    	this._pTextureForSwap = pRmgr.createTexture(".texture-for-mega-swap_" + sid());
	    	this._pTextureForSwap.create(this._v2iTextureLevelSize.x, this._v2iTextureLevelSize.y, 1, null, ETextureFlags.DYNAMIC, 0, 1, ETextureTypes.TEXTURE_2D, this._eTextureFormat);
	    	this._pTextureForSwap.setWrapMode(ETextureParameters.WRAP_S, ETextureWrapModes.CLAMP_TO_EDGE);
    		this._pTextureForSwap.setWrapMode(ETextureParameters.WRAP_T, ETextureWrapModes.CLAMP_TO_EDGE);
    	    
    	    //create texture levels
    	    for (var i: uint = 0; i < this._pTextures.length; i++) 
    	    {    	        
    	        this._pTextures[i] = pRmgr.createTexture(".texture-for-mega-" + i + "_" + sid());
    	        if(i === 0){
    	        	this._pTextures[i].create(this._v2iOriginalTextreMinSize.x, this._v2iOriginalTextreMinSize.y, 1, null, ETextureFlags.DYNAMIC, 0, 1, ETextureTypes.TEXTURE_2D, EPixelFormats.BYTE_RGB);
    	        	
    	        	this._pSectorLoadInfo[i] = new Uint32Array(this._v2iTextureLevelSize.y * this._v2iTextureLevelSize.x /
	                                                  	   	   (this._iBlockSize * this._iBlockSize));
    	        	this._pXY[i] = <ISubTextureSettings> {
			    	        				iX : 0, iY : 0,/*Координты буфера в основной текстуре, для простыты должны быть кратну размеру блока*/
			    							iTexX:0, iTexY:0,   /*Координаты мегатекстуры в текстуре*/
			    							width: this._v2iOriginalTextreMinSize.x,
			    							height: this._v2iOriginalTextreMinSize.y,
			    							isUpdated : true, isLoaded : false
			    						};
    	        }
    	        else {
    	        	this._pTextures[i].create(this._v2iTextureLevelSize.x, this._v2iTextureLevelSize.y, 1, null, ETextureFlags.DYNAMIC, 0, 1, ETextureTypes.TEXTURE_2D, this._eTextureFormat);
    				
    				this._pSectorLoadInfo[i] = new Uint32Array(this._v2iTextureLevelSize.y * this._v2iTextureLevelSize.x /
	                                                  	   (this._iBlockSize * this._iBlockSize));

	            	this.setSectorLoadInfoToDefault(this._pSectorLoadInfo[i]);

	    			this._pTextures[i].setWrapMode(ETextureParameters.WRAP_S, ETextureWrapModes.CLAMP_TO_EDGE);
    				this._pTextures[i].setWrapMode(ETextureParameters.WRAP_T, ETextureWrapModes.CLAMP_TO_EDGE);	        	
    			
    	        	this._pXY[i] = <ISubTextureSettings> {
			    	        				iX : 0, iY : 0,/*Координты буфера в основной текстуре, для простыты должны быть кратну размеру блока*/
			    							iTexX:0, iTexY:0,   /*Координаты мегатекстуры в текстуре*/
			    							width: this._pTextures[i].width,
			    							height: this._pTextures[i].height,
			    							isUpdated : true, isLoaded : false
			    						};
    			}


    	    }

    	    this.createUniforms();

    	    this.testDataInit();

    	    this._pRPC = net.createRpc();
    	    this._pRPC.join("ws://192.168.88.53:6112");
    	    this._pRPC.setProcedureOption("getMegaTexture", "lifeTime", 0);
    	    this._pRPC.setProcedureOption("getMegaTexture", "priority", 1);
    	    this.loadMinTextureLevel();
	    }

	    private _bError: bool = false;
	    private _tLastTime: float = 0;
		prepareForRender(pViewport: IViewport): void {
			if(this._bError){
				CRITICAL("ERROR");
			}

			if(!this._pXY[0].isLoaded){
				this.loadMinTextureLevel();
				return;
			}

			var tCurrentTime: uint = (this._pEngine.getTimer().absoluteTime * 1000) >>> 0;

			// if(tCurrentTime - this._tLastTime < 3000){
			// 	return;
			// }
			this._tLastTime = tCurrentTime;

		    var pCamera: ICamera = pViewport.getCamera();
		    var v4fCameraCoord: IVec4 = vec4(pCamera.worldPosition, 1.);
		    var m4fTransposeInverse: IMat4 = this._pObject.inverseWorldMatrix;

		    v4fCameraCoord = m4fTransposeInverse.multiplyVec4(v4fCameraCoord);

		    //Вычисление текстурных координат над которыми находиться камера
		    var fTexCourdX: float = (v4fCameraCoord.x - this._pWorldExtents.x0) /
		                     math.abs(this._pWorldExtents.x1 - this._pWorldExtents.x0);
		    var fTexCourdY: float = (v4fCameraCoord.y - this._pWorldExtents.y0) /
		                     math.abs(this._pWorldExtents.y1 - this._pWorldExtents.y0);

		    this._v2fCameraCoord.set(fTexCourdX, fTexCourdY);

		    var iX: uint = 0, iX1: uint = 0, iX2: uint = 0;
		    var iY: uint = 0, iY1: uint = 0, iY2: uint = 0;
		    var iWidth: uint = 0, iHeight: uint = 0;

		    //Нужно ли перекладвывать, отсавим на запас 8 блоков

		    //Опираемся на текстуру самого хорошего разрешения
		    
		    //Координаты квадрата this._v2iTextureLevelSize.x Х this._v2iTextureLevelSize.y с центром в камере на текстуре самого большого разрешения.
		    
		    iX = math.round(fTexCourdX * (this.getWidthOrig(this._pTextures.length - 1)) - this._v2iTextureLevelSize.x / 2);
		    iY = math.round(fTexCourdY * (this.getHeightOrig(this._pTextures.length - 1)) - this._v2iTextureLevelSize.y / 2);
		    
		    iWidth  = this._v2iTextureLevelSize.x;
		    iHeight = this._v2iTextureLevelSize.y;

		    // Перемещаем данные из одного пиксель буффера в другой

		    if ((this._fTexCourdXOld !== fTexCourdX || this._fTexCourdYOld !== fTexCourdY)) {
		        //Перемещаем
		        //Для всех уровней текстур
		    
		        for (i = 1; i < this._pTextures.length; i++) {
		            // LOG("Уровень", i)
		            //Вычисляем новые координаты буфера в текстуре
		            var iXnew: uint = math.round(fTexCourdX * this.getWidthOrig(i) - this._v2iTextureLevelSize.x / 2);
		            var iYnew: uint = math.round(fTexCourdY * this.getHeightOrig(i) - this._v2iTextureLevelSize.y / 2);
		            
		            // iXnew -= (this._iBufferWidth - this._v2iTextureLevelSize.x) / 2;
		            // iYnew -= (this._iBufferHeight - this._v2iTextureLevelSize.y) / 2;

		            //Округлили на размер блока
		            iXnew = math.round((iXnew / this._iBlockSize)) * this._iBlockSize;
		            iYnew = math.round((iYnew / this._iBlockSize)) * this._iBlockSize;
		            //Копирование совпадающего куска

		            var iXOverlappingBlockInOldBuf: uint = iXnew - this._pXY[i].iX;
		            var iYOverlappingBlockInOldBuf: uint = iYnew - this._pXY[i].iY;
		            var iXOverlappingBlockInNewBuf: uint = -iXOverlappingBlockInOldBuf;
		            var iYOverlappingBlockInNewBuf: uint = -iYOverlappingBlockInOldBuf;

		            iXOverlappingBlockInOldBuf = math.max(0, iXOverlappingBlockInOldBuf);
		            iYOverlappingBlockInOldBuf = math.max(0, iYOverlappingBlockInOldBuf);
		            iXOverlappingBlockInNewBuf = math.max(0, iXOverlappingBlockInNewBuf);
		            iYOverlappingBlockInNewBuf = math.max(0, iYOverlappingBlockInNewBuf);


		            if (iXOverlappingBlockInOldBuf < this._iBufferWidth && iYOverlappingBlockInOldBuf < this._iBufferHeight &&
		                iXOverlappingBlockInNewBuf < this._iBufferWidth && iYOverlappingBlockInNewBuf < this._iBufferHeight) {
		                //произошло совпадение кусков
		                var iOverlappingBlockWidth: uint = this._iBufferWidth - math.abs(iXnew - this._pXY[i].iX);
		                var iOverlappingBlockHeight: uint = this._iBufferHeight - math.abs(iYnew - this._pXY[i].iY);

		                //копируем данные
		                var pSwapBuffer: IPixelBuffer = this._pTextureForSwap.getBuffer(0, 0);
		                var pTextureBuffer: IPixelBuffer = this._pTextures[i].getBuffer(0, 0);

		                var pTmpBox1: IBox = geometry.box(iXOverlappingBlockInNewBuf, iYOverlappingBlockInNewBuf, 
		                								  iOverlappingBlockWidth + iXOverlappingBlockInNewBuf, 
		                								  iOverlappingBlockHeight + iYOverlappingBlockInNewBuf);
		                var pTmpBox2: IBox = geometry.box(iXOverlappingBlockInOldBuf, iYOverlappingBlockInOldBuf,
		                								  iOverlappingBlockWidth + iXOverlappingBlockInOldBuf, 
		                								  iOverlappingBlockHeight + iYOverlappingBlockInOldBuf);
		                
		                var pTmpBox3: IBox = geometry.box(0, 0, this._v2iTextureLevelSize.x, this._v2iTextureLevelSize.y);

		                var pTempPixelBox: IPixelBox = pixelUtil.pixelBox(pTmpBox3, this._eTextureFormat);
		                pTempPixelBox.data = null;		                
		                
		                pSwapBuffer.blit(pTextureBuffer, pTmpBox2, pTmpBox2); /* Save overlapped data */

		                pTextureBuffer.blitFromMemory(pTempPixelBox, pTmpBox3); /* Clear texture */
		               	
		               	pTextureBuffer.blit(pSwapBuffer, pTmpBox2, pTmpBox1); /* Put overlapperd data */

		                this.setSectorLoadInfoToDefault(this._pLoadInfoForSwap);
		                
		                // LOG(iXOverlappingBlockInOldBuf + " ---> " + iXOverlappingBlockInNewBuf, 
		                // 	iYOverlappingBlockInOldBuf + " ---> " + iYOverlappingBlockInNewBuf);

		                this._setDataBetweenBufferMap(this._pLoadInfoForSwap, 
		                							  iXOverlappingBlockInNewBuf / this._iBlockSize,
		                                              iYOverlappingBlockInNewBuf / this._iBlockSize,
		                                              
		                                              this._pSectorLoadInfo[i], 
		                                              iXOverlappingBlockInOldBuf / this._iBlockSize,
		                                              iYOverlappingBlockInOldBuf / this._iBlockSize,
		                                              iOverlappingBlockWidth / this._iBlockSize,
		                                              iOverlappingBlockHeight / this._iBlockSize);

		                var s: Uint32Array = this._pSectorLoadInfo[i];
		                this._pSectorLoadInfo[i] = this._pLoadInfoForSwap;
		                this._pLoadInfoForSwap = s;
		            }
		            else {
		                var pTextureBuffer: IPixelBuffer = this._pTextures[i].getBuffer(0, 0);
		                var pTmpBox3: IBox = geometry.box(0, 0, this._v2iTextureLevelSize.x, this._v2iTextureLevelSize.y);

		                var pTempPixelBox: IPixelBox = pixelUtil.pixelBox(pTmpBox3, this._eTextureFormat);
		                pTempPixelBox.data = null;

		                pTextureBuffer.blitFromMemory(pTempPixelBox, pTmpBox3);

		                this.setSectorLoadInfoToDefault(this._pSectorLoadInfo[i]);
		            }

					this._pXY[i].iX = iXnew;
	            	this._pXY[i].iY = iYnew;
		        }
		    }

		    //Подгрузка части буфера которую ложиться в текстуру + 8 блоков
		    //Нулевая статична, поэтому ее не меняем
		   	for (var i: uint = 1; i < this._pTextures.length; i++) {
	            iX = math.round(fTexCourdX * this.getWidthOrig(i) - this._v2iTextureLevelSize.x / 2);
	            iY = math.round(fTexCourdY * this.getHeightOrig(i) - this._v2iTextureLevelSize.y / 2);

				iX = math.round((iX / this._iBlockSize)) * this._iBlockSize;
	            iY = math.round((iY / this._iBlockSize)) * this._iBlockSize;

	            this._pXY[i].iTexX = iX / this.getWidthOrig(i);
				this._pXY[i].iTexY = iY / this.getHeightOrig(i);

	            iWidth = this._v2iTextureLevelSize.x;
	            iHeight = this._v2iTextureLevelSize.y;
	            //На данный момент нужен кусок текстуры таких размеров iX1,iY1,iWidth,iHeight,

	            var iAreaX1: uint = iX;
	            var iAreaY1: uint = iY;
	            var iAreaX2: uint = iX + iWidth;
	            var iAreaY2: uint = iY + iHeight;

	            //Смотрим попадаем ли мы в текущий буфер

                //Типа попали
                //Значит нужно загрузить необходимые куски
                //Обрезаемся чтобы не вылезти за пределы

                // iX -= this._iBlockSize * 8;
                // iY -= this._iBlockSize * 8;
                // iWidth += this._iBlockSize * 16;
                // iHeight += this._iBlockSize * 16;
                iX1 = math.clamp(iX, 0, this.getWidthOrig(i));
                iY1 = math.clamp(iY, 0, this.getHeightOrig(i));
                iX2 = math.clamp(iX + iWidth, 0, this.getWidthOrig(i));
                iY2 = math.clamp(iY + iHeight, 0, this.getHeightOrig(i));

                var iAreaX1: uint = math.clamp(iAreaX1, 0, this.getWidthOrig(i));
                var iAreaY1: uint = math.clamp(iAreaY1, 0, this.getHeightOrig(i));
                var iAreaX2: uint = math.clamp(iAreaX2, 0, this.getWidthOrig(i));
                var iAreaY2: uint = math.clamp(iAreaY2, 0, this.getHeightOrig(i));

                this.getDataFromServer(i, iX1, iY1, iX2 - iX1, iY2 - iY1, /*Остальные область проверки*/iAreaX1,
                                       iAreaY1, iAreaX2 - iAreaX1, iAreaY2 - iAreaY1);
		    }

		    this._fTexCourdXOld = fTexCourdX;
		    this._fTexCourdYOld = fTexCourdY;
		}

		private _fThresHold: float = 0.1;
		private _bColored: bool = true;
		applyForRender(pRenderPass: IRenderPass): void {
			pRenderPass.setForeign("nTotalLevels", this._iMaxLevel - this._iMinLevel + 1);
			pRenderPass.setUniform("MIN_MEGATEXTURE_LEVEL", this._iMinLevel);
			pRenderPass.setUniform("threshold", this._fThresHold);
			pRenderPass.setUniform("bColored", this._bColored);
			

		    for (var i: uint = 0; i < this._pTextures.length; i++) {
		    	this._pLoadStatusUniforms[i] = this._pXY[i].isLoaded ? 1 : 0;
		    	this._pTexcoordOffsetUniforms[i].set(this._pXY[i].iTexX, this._pXY[i].iTexY);
		    	this._pSamplerUniforms[i].texture = this._pTextures[i];
		    }

		    pRenderPass.setUniform("S_TERRAIN", this._pSamplerUniforms);
		    pRenderPass.setUniform("TEXTURE_LOAD_STATUS", this._pLoadStatusUniforms);
		    pRenderPass.setUniform("TEXTURE_LEVEL_OFFSET", this._pTexcoordOffsetUniforms);
		}

		getWidthOrig(iLevel: uint): uint {
			return this._v2iTextureLevelSize.x << (this._iMinLevel + iLevel);
		}

		getHeightOrig(iLevel: uint): uint {
			return this._v2iTextureLevelSize.y << (this._iMinLevel + iLevel);
		}

		protected checkTextureSizeSettings(): bool {
			var v2iCountTexMin: IVec2 = vec2();
			var v2iCountTexMax: IVec2 = vec2();

			v2iCountTexMin.x = math.log2(this._v2iOriginalTextreMinSize.x/this._v2iTextureLevelSize.x);
			v2iCountTexMin.y = math.log2(this._v2iOriginalTextreMinSize.y/this._v2iTextureLevelSize.y);

			v2iCountTexMax.x = math.log2(this._v2iOriginalTextreMaxSize.x/this._v2iTextureLevelSize.x);
			v2iCountTexMax.y = math.log2(this._v2iOriginalTextreMaxSize.y/this._v2iTextureLevelSize.y);

			if (v2iCountTexMin.x !== v2iCountTexMin.y ||
				v2iCountTexMax.x !== v2iCountTexMax.y){
				return false;
			}

			if(v2iCountTexMax.x < v2iCountTexMin.x) {
				return false;
			}

			this._iMinLevel = v2iCountTexMin.x;
			this._iMaxLevel = v2iCountTexMax.x;

			return true;
		}

		protected createUniforms(): void {
			var iCountTex: uint = this._iMaxLevel - this._iMinLevel + 1;

			this._pSamplerUniforms = new Array(iCountTex);
			this._pLoadStatusUniforms = new Array(iCountTex);
			this._pTexcoordOffsetUniforms = new Array(iCountTex);

			for(var i: uint = 0; i < iCountTex; i++){
				this._pSamplerUniforms[i] = <IAFXSamplerState>{ 
					textureName: "",
					texture: this._pTextures[i],
					wrap_s: ETextureWrapModes.CLAMP_TO_EDGE,
					wrap_t: ETextureWrapModes.CLAMP_TO_EDGE,
					mag_filter: ETextureFilters.LINEAR,
					min_filter: ETextureFilters.LINEAR
				};

				this._pLoadStatusUniforms[i] = 0;
				this._pTexcoordOffsetUniforms[i] = new Vec2();
			}
		}

		protected loadMinTextureLevel(): void {
			// var me: MegaTexture = this;
			// var tCurrentTime: uint = (this._pEngine.getTimer().absoluteTime * 1000) >>> 0;

			// if(tCurrentTime - this._pSectorLoadInfo[0][0] > this._iSectorLifeTime){
			// 	this._pSectorLoadInfo[0][0] = tCurrentTime;

			// 	// var pTempImg: IImg = <IImg>me._pEngine.getResourceManager().imagePool.findResource(".megatexture.temp_image");

	  //  //          if(isNull(pTempImg)){
	  //  //              pTempImg = <IImg>me._pEngine.getResourceManager().imagePool.createResource(".megatexture.temp_image");
	  //  //          }

	  //  //          pTempImg.load("../../../data/textures/terrain/diffuse.dds");

	  //  //          pTempImg.bind(SIGNAL(loaded), (pImg: IImg) => {
	  //  //          	me._pTextures[0].destroyResource();
	  //  //          	me._pTextures[0].loadImage(pTempImg);
			// 	// 	me._pXY[0].isLoaded = true;
	  //  //          });
			// 	this._pRPC.proc('loadMegaTexture', me._sSurfaceTextures, me._v2iOriginalTextreMinSize.x, me._v2iOriginalTextreMinSize.x,
			// 		function (pError: Error, pData: Uint8Array) {
			// 			if(me._pXY[0].isLoaded){
			// 				return;
			// 			}
			// 			try {
			// 				LOG("load");
			// 				if(!isNull(pError)){
			// 					debug_print(pError.message);
			// 					return;
			// 				}

			// 				var pTempImg: IImg = <IImg>me._pEngine.getResourceManager().imagePool.findResource(".megatexture.temp_image");

			// 	            if(isNull(pTempImg)){
			// 	                pTempImg = <IImg>me._pEngine.getResourceManager().imagePool.createResource(".megatexture.temp_image");
			// 	            }

			// 	            pTempImg.load(pData);
			// 	            me._pTextures[0].destroyResource();
			// 				me._pTextures[0].loadImage(pTempImg);
			// 				me._pXY[0].isLoaded = true;
			// 			}
			// 			catch(e){
			// 				me._bError = true;
			// 				ERROR(e);
			// 			}
			// 		});
			// }
			this.getDataFromServer(0, 0, 0, this._v2iOriginalTextreMinSize.x, this._v2iOriginalTextreMinSize.y);
			
		}

		protected getDataFromServer(iLevelTex: uint, 
						  iOrigTexX: uint, iOrigTexY: uint, 
						  iWidth: uint, iHeight: uint, 
						  iAreaX?: uint, iAreaY?: uint, 
						  iAreaWidth?: uint, iAreaHeight?: uint): void 
		{
		    var iBlockSize: uint = this._iBlockSize * this._pXY[iLevelTex].width / this._v2iTextureLevelSize.x;

		    var iOrigTexEndX: uint = math.ceil((iOrigTexX + iWidth) / iBlockSize) * iBlockSize;
		    var iOrigTexEndY: uint = math.ceil((iOrigTexY + iHeight) / iBlockSize) * iBlockSize;
		    iOrigTexX = math.max(0, iOrigTexX);
		    iOrigTexY = math.max(0, iOrigTexY);
		    // iOrigTexX = math.floor(iOrigTexX / iBlockSize) * iBlockSize;
		    // iOrigTexY = math.floor(iOrigTexY / iBlockSize) * iBlockSize;
		    iOrigTexEndX = math.min(iOrigTexEndX, this.getWidthOrig(iLevelTex));
		    iOrigTexEndY = math.min(iOrigTexEndY, this.getHeightOrig(iLevelTex));

		    var iAreaEndX: uint = iAreaX + iAreaWidth;
		    var iAreaEndY: uint = iAreaY + iAreaHeight;
		    iAreaX = math.max(0, iAreaX);
		    iAreaY = math.max(0, iAreaY);
		    iAreaEndX = math.min(iAreaEndX, this.getWidthOrig(iLevelTex));
		    iAreaEndY = math.min(iAreaEndY, this.getHeightOrig(iLevelTex));

		    var isLoaded: bool = true;
		    var tCurrentTime: uint = (this._pEngine.getTimer().absoluteTime * 1000) >>> 0;

		    for (var i: uint = iOrigTexY; i < iOrigTexEndY; i += iBlockSize) {
		        for (var j: uint = iOrigTexX; j < iOrigTexEndX; j += iBlockSize) {
		        	var iSectorInfoCoord: uint = (i - this._pXY[iLevelTex].iY) / iBlockSize *
	                                             (this._pXY[iLevelTex].width / iBlockSize) +
	                                             (j - this._pXY[iLevelTex].iX) / iBlockSize;

	                if (this._pSectorLoadInfo[iLevelTex][iSectorInfoCoord] !== 0xFFFFFFFF) {
	                    isLoaded = false;
	                }

	                if (tCurrentTime - this._pSectorLoadInfo[iLevelTex][iSectorInfoCoord] < this._iSectorLifeTime) {
	                    continue;
	                }
	                if (this._pSectorLoadInfo[iLevelTex][iSectorInfoCoord] === 0xFFFFFFFF) {
	                    continue;
	                }

	                this._pSectorLoadInfo[iLevelTex][iSectorInfoCoord] = tCurrentTime;

		            var iLev: uint = iLevelTex;
		            var iX: uint = j, iY: uint = i;

		            var iXBuf: uint = j - this._pXY[iLevelTex].iX;
		            var iYBuf: uint = i - this._pXY[iLevelTex].iY;

		            if (iXBuf < 0 || iXBuf > this._pXY[iLevelTex].width - iBlockSize || 
	                  	iYBuf < 0 || iYBuf > this._pXY[iLevelTex].height - iBlockSize)
		            {
	                	return;
	                }

	                this._iQueryCount ++;
	                
		            this.getDataByRPC(iLevelTex, j, i, iBlockSize);
		        }
		    }
		   this._pXY[iLevelTex].isLoaded = isLoaded;
		}

		private _iTrafficCounter: uint = 0;
		private _iResponseCount: uint = 0;
		private _iQueryCount: uint = 0;

		private _printTraffic(): void {
			LOG(this._iTrafficCounter/1000000 + "Mb", this._iQueryCount + "/" + this._iResponseCount);
		}

		private getDataByRPC(iLev: uint, iX: uint, iY: uint, iBlockSize: uint): void {
			var me: MegaTexture = this;
			var sPiecePath: string = me._sSurfaceTextures;

            this._pRPC.proc('getMegaTexture', me._sSurfaceTextures, me.getWidthOrig(iLev), me.getHeightOrig(iLev), iX,
                iY, iBlockSize, iBlockSize, me._eTextureFormat,
				function (pError: Error, pData: Uint8Array) {

					if(!isNull(pError)){
						debug_print(pError.message);
						return;
					}

					// var pData = this.pDataList[this._iMinLevel + iLev];
					me._iTrafficCounter += pData.length;

					var iXBuf: uint = iX - me._pXY[iLev].iX;
					var iYBuf: uint = iY - me._pXY[iLev].iY;

					if (iXBuf < 0 || iXBuf > me._pXY[iLev].width - iBlockSize || 
						iYBuf < 0 || iYBuf > me._pXY[iLev].height - iBlockSize) {
						return;
					}

					var iSectorInfoCoord: uint = iYBuf / iBlockSize *
												 (me._pXY[iLev].width / iBlockSize) +
												 iXBuf / iBlockSize;

					if(me._pSectorLoadInfo[iLev][iSectorInfoCoord] === 0xFFFFFFFF){
						return;
					}

					me._iResponseCount++;
					me._pSectorLoadInfo[iLev][iSectorInfoCoord] = 0xFFFFFFFF;

					var pTmpBox1: IBox = geometry.box(0, 0, iBlockSize, iBlockSize);
					var pTmpBox2: IBox = geometry.box(iXBuf, iYBuf, iBlockSize + iXBuf, iBlockSize + iYBuf);

					var pSourceBox: IPixelBox = pixelUtil.pixelBox(pTmpBox1, me._eTextureFormat, pData);

					me._pTextures[iLev].getBuffer(0, 0).blitFromMemory(pSourceBox, pTmpBox2);
					pSourceBox.data = null;
				});
		}

		protected setDataT(pBuffer, iX: uint, iY: uint, iWidth: uint, iHeight: uint, pBufferIn, iInX: uint, iInY: uint, iInWidth: uint, iInHeight: uint, iBlockWidth: uint, iBlockHeight: uint, iComponents: uint): void {
			iBlockHeight = math.max(0, iBlockHeight);
			iBlockWidth = math.max(0, iBlockWidth);
			iBlockHeight = math.min(iBlockHeight, iHeight - iY, iInHeight - iInY);
			iBlockWidth = math.min(iBlockWidth, iWidth - iX, iInWidth - iInX);

			if (pBuffer.length < ((iY + iBlockHeight - 1) * iWidth + iX + iBlockWidth) * iComponents) {
			    debug_error("Выход за предел массива 1");
			}
			if (pBufferIn.length < ((iInY + iBlockHeight - 1) * iInWidth + iInX + iBlockWidth) * iComponents) {
			    debug_error("Выход за предел массива 2");
			}

			var iLenStr: uint = iBlockWidth * iComponents;
			var iStartIn: uint = 0;
			var iStartOut: uint = 0;
			for (var i: uint = 0; i < iBlockHeight; i++) {
			    iStartIn = ((iInY + i) * iInWidth + iInX) * iComponents;
			    iStartOut = ((iY + i) * iWidth + iX) * iComponents;

			    if (pBufferIn.BYTES_PER_ELEMENT == 8) {
			        pBuffer.set(new Float64Array(pBufferIn.buffer.slice(iStartIn * 8, (iStartIn + iLenStr) * 8)), iStartOut);
			    } else if (pBufferIn.BYTES_PER_ELEMENT == 4) {
			        pBuffer.set(new Uint32Array(pBufferIn.buffer.slice(iStartIn * 4, (iStartIn + iLenStr) * 4)), iStartOut);
			    } else if (pBufferIn.BYTES_PER_ELEMENT == 2) {
			        pBuffer.set(new Uint16Array(pBufferIn.buffer.slice(iStartIn * 2, (iStartIn + iLenStr) * 2)), iStartOut);
			    } else {
			        pBuffer.set(new Uint8Array(pBufferIn.buffer.slice(iStartIn, iStartIn + iLenStr)), iStartOut);
			    }

			}
		}

		private _setDataBetweenBufferMap(pBuffer, iX: uint, iY: uint, pBufferIn, iInX: uint, iInY: uint, iBlockWidth: uint, iBlockHeight: uint): void {
		    var iInWidth: uint    = this._iBufferWidth / this._iBlockSize;
		    var iInHeight: uint   = this._iBufferHeight / this._iBlockSize;
		    var iComponents: uint = 1;
		    var iWidth: uint      = this._iBufferWidth / this._iBlockSize;
		    var iHeight: uint     = this._iBufferHeight / this._iBlockSize;
		    this.setDataT(pBuffer, iX, iY, iWidth, iHeight, pBufferIn, iInX, iInY, iInWidth, iInHeight, iBlockWidth, iBlockHeight, iComponents);
		}

		protected setSectorLoadInfoToDefault(pBuffer: Uint32Array): void {
			pBuffer.set(this._pDefaultSectorLoadInfo, 0);
		}


		private pDataList: Uint8Array[] = new Array(8);
		private testDataInit(): void {
			for(var i: uint = 0; i < this.pDataList.length; i++){
				this.pDataList[i] = new Uint8Array(this._iBlockSize * this._iBlockSize * 3);

				var iLev = i;
				var pData = this.pDataList[i];

				for(var k: uint = 0; k < pData.length; k+= 3){
		          	if(iLev === 0){
		              	pData[k] = 0;
		              	pData[k + 1] = 255;
		              	pData[k + 2] = 0;
		          	}
		          	else if(iLev === 1){
		          		pData[k] = 255;
		              	pData[k + 1] = 0;
		              	pData[k + 2] = 0;
		          	}
		          	else if(iLev === 2) {
		          		pData[k] = 0;
		              	pData[k + 1] = 0;
		              	pData[k + 2] = 255;
		          	}
		          	else if(iLev === 3){
		          		pData[k] = 255;
		              	pData[k + 1] = 0;
		              	pData[k + 2] = 255;
		          	}
		          	else if(iLev === 4){
		          		pData[k] = 255;
		              	pData[k + 1] = 255;
		              	pData[k + 2] = 0;
		          	}
		          	else if(iLev === 5) {
		          		pData[k] = 0;
		              	pData[k + 1] = 255;
		              	pData[k + 2] = 255;
		          	}
		          	else {
		              	pData[k] = 170;
		                pData[k + 1] = 50;
		                pData[k + 2] = 170;
		          	}
	          	}
			}
		}

	}

	
}

#endif



