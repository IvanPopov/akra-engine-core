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
	    private _iOriginalTextureMaxSize: uint = 8192 * 1;

	    //Размер блока текстуры(минимальный размер выгружаемого куска текстуры)
	    private _iBlockSize: uint = 32;

	    //Тип хранимых тектсур
	    private _eTextureFormat: EPixelFormats = EPixelFormats.BYTE_RGB;
	    private _iTextureHeight: uint = 1024;
	    private _iTextureWidth: uint = 1024;
	    
	    private _pTextures: ITexture[] = null;

	    //Буффер, который в два раза шире МегаТекстур, используется что бы заранее подгружать чуть больше чем нужно для текущего отображения,
	    //дает возможность начинать выгружать данные чуть раньше чем они понадобяться и в тож время сохраняет некий кеш,
	    //чтобы в случае возвращения на старую точку не перзагружать что недавно использовалось
	    private _iBufferHeight: uint = 0;
	    private _iBufferWidth: uint  = 0;
	    private _pBuffer: IPixelBox[] = null;
	    //Карта с разметкой буфера, чтобы знать какой части буффер уже отсылалось задание на заполнение
	    private _pBufferMap: Uint32Array[] = null;
	    private _pXY: ISubTextureSettings[] = null;

	    //Всякие темповые буферы
	    private _pDataFor: IPixelBox      = null;
	    private _pMapDataFor: Uint32Array  = null;
	    private _pMapDataNULL: Uint32Array = null;

	    private _pRPC: IRPC = null;

	    private _fTexCourdXOld: float = undefined;
	    private _fTexCourdYOld: float = undefined;
	    private _nCountRender: uint = 0;

	    constructor(pEngine: IEngine, pObject: any, sSurfaceTextures: string) {
	    	this._pEngine = pEngine;
	    	// this._pDevice = pEngine.pDevice;
	    	this._pObject = pObject;
	    	this._pWorldExtents = pObject.localBounds;
	    	this._sSurfaceTextures = sSurfaceTextures;

	    	var iCountTex: uint = math.log2(this._iOriginalTextureMaxSize / math.max(this._iTextureHeight, this._iTextureWidth)) + 1;

	    	this._pTextures   = <ITexture[]> new Array(iCountTex);
	    	this._pBuffer    = <IPixelBox[]> new Array(iCountTex);
	    	this._pBufferMap = <Uint32Array[]> new Array(iCountTex);
	    	this._pXY        = <ISubTextureSettings[]> new Array(iCountTex);

	    	this._iBufferHeight = this._iTextureHeight * 2;
	    	this._iBufferWidth  = this._iTextureWidth * 2;

	    	this._pDataFor     = new pixelUtil.PixelBox(this._iBufferWidth, this._iBufferHeight, 1, this._eTextureFormat, new Uint8Array(pixelUtil.getMemorySize(this._iBufferWidth, this._iBufferHeight, 1, this._eTextureFormat)));
	    	this._pMapDataFor  = new Uint32Array(this._iBufferHeight * this._iBufferWidth / (this._iBlockSize * this._iBlockSize));
	    	this._pMapDataNULL = new Uint32Array(this._iBufferHeight * this._iBufferWidth / (this._iBlockSize * this._iBlockSize));

	    	for (var i: uint = 0; i < this._pMapDataNULL.length; i++) {
	    	    this._pMapDataNULL[i] = 0;
	    	}

	    	this.setBufferMapNULL(this._pMapDataFor);

	    	//Создаем куски мегатекстуры
	    	var pRmgr: IResourcePoolManager = this._pEngine.getResourceManager();
	    	var pInitData: Uint8Array = null;
    	    
    	    for (var i: uint = 0; i < this._pTextures.length; i++) {
    	        
    	        this._pTextures[i] = pRmgr.createTexture(".texture-for-mega-" + i + sid());
    	        this._pTextures[i].create(this._iTextureWidth, this._iTextureHeight, 1, null, ETextureFlags.DYNAMIC, 0, 1, ETextureTypes.TEXTURE_2D, this._eTextureFormat);
    			this._pTextures[i].setWrapMode(ETextureParameters.WRAP_S, ETextureWrapModes.CLAMP_TO_EDGE);
    			this._pTextures[i].setWrapMode(ETextureParameters.WRAP_T, ETextureWrapModes.CLAMP_TO_EDGE);
    	        
    	        if (i == 0) {
    	        	pInitData = new Uint8Array(pixelUtil.getMemorySize(this._iTextureWidth, this._iTextureHeight, 1, this._eTextureFormat));
    	            this._pBuffer[i] = new pixelUtil.PixelBox(this._iTextureWidth, this._iTextureHeight, 1, this._eTextureFormat, pInitData);
    	            //на самом деле this._iTextureHeight*this._iTextureWidth
    	            this._pBufferMap[i] = new Uint32Array(this._iBufferHeight * this._iBufferWidth /
    	                                                  (this._iBlockSize * this._iBlockSize)); 

    	            this.setBufferMapNULL(this._pBufferMap[i]);
    	            //Худшего качества статична поэтому размер у буфера такойже как у текстуры this._iBlockSize


    	        } else {
    	        	pInitData = new Uint8Array(pixelUtil.getMemorySize(this._iBufferWidth, this._iBufferHeight, 1, this._eTextureFormat));
    	            this._pBuffer[i] = new pixelUtil.PixelBox(this._iBufferWidth, this._iBufferHeight, 1, this._eTextureFormat, pInitData);
    	            
    	            this._pBufferMap[i] = new Uint32Array(this._iBufferHeight * this._iBufferWidth /
    	                                                  (this._iBlockSize * this._iBlockSize));
    	            this.setBufferMapNULL(this._pBufferMap[i]);

    	        }
    	        // this._pBuffer[i].setConsecutive();
    	        
    	        this._pXY[i] = <ISubTextureSettings> {iX : 0, iY : 0,/*Координты буфера в основной текстуре, для простыты должны быть кратну размеру блока*/
    				iTexX:0, iTexY:0,   /*Координаты мегатекстуры в текстуре*/
    				isUpdated : true, isLoaded : false};
    	    }

    	    // this._pRPC = net.createRpc();
    	    // // // this._pRPC.join('ws://192.168.194.132');
    	    // this._pRPC.join("ws://localhost:6112");
	    	this.getDataFromServer(0, 0, 0, this._iTextureWidth, this._iTextureHeight);
	    }


		prepareForRender(pViewport: IViewport): void {
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

		    var iX: uint, iX1: uint, iX2: uint;
		    var iY: uint, iY1: uint, iY2: uint;
		    var iWidth: uint, iHeight: uint;

		    //Нужно ли перекладвывать, отсавим на запас 8 блоков

		    //Опираемся на текстуру самого хорошего разрешения
		    /*
		    	Координаты квадрата this._iTextureWidth Х this._iTextureHeight с центром в камере на текстуре самого большого разрешения.
		    */
		    iX = math.round(fTexCourdX * (this.getWidthOrig(this._pTextures.length - 1)) - this._iTextureWidth / 2);
		    iY = math.round(fTexCourdY * (this.getHeightOrig(this._pTextures.length - 1)) - this._iTextureHeight / 2);
		    iWidth  = this._iTextureWidth;
		    iHeight = this._iTextureHeight;

		    //console.log("=> Смена координат")
		    //console.log(iX,this._pXY[this._pTextures.length-1].iX,math.floor((iX-this._pXY[this._pTextures.length-1].iX)));
		    //console.log(iY,this._pXY[this._pTextures.length-1].iY,math.floor((iY-this._pXY[this._pTextures.length-1].iY)));
		    //console.log(iX,this._pXY[this._pTextures.length-1].iX+this._iTextureWidth,math.floor((this._iTextureHeight-iX+this._pXY[this._pTextures.length-1].iX)));
		    //console.log(iY,this._pXY[this._pTextures.length-1].iY+this._iTextureHeight,math.floor((this._iTextureHeight-iY+this._pXY[this._pTextures.length-1].iY)));

		    // Перемещаем данные из одного пиксель буффера в другой
		    if (math.floor((iX - this._pXY[this._pTextures.length - 1].iX) / this._iBlockSize) < 8 || 
		    	math.floor((iY - this._pXY[this._pTextures.length - 1].iY) / this._iBlockSize) < 8 || 
		    	math.floor((this._pXY[this._pTextures.length - 1].iX + this._iBufferWidth - (iX + iWidth)) / this._iBlockSize) < 8 || 
		    	math.floor((this._pXY[this._pTextures.length - 1].iY + this._iBufferHeight - (iY + iHeight)) / this._iBlockSize) < 8) {
		        // LOG("Да")
		        //Перемещаем
		        // Для всех уровней текстур
		        for (i = 1; i < this._pTextures.length; i++) {
		            // LOG("Уровень", i)
		            //Вычисляем новые координаты буфера в текстуре
		            var iXnew: uint = math.round(fTexCourdX * this.getWidthOrig(i) - this._iTextureWidth / 2);
		            var iYnew: uint = math.round(fTexCourdY * this.getHeightOrig(i) - this._iTextureHeight / 2);

		            iXnew -= (this._iBufferWidth - this._iTextureWidth) / 2;
		            iYnew -= (this._iBufferHeight - this._iTextureHeight) / 2;

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
		                //console.log(this._pXY[i].iX,this._pXY[i].iY,"==>",iXnew,iYnew)
		                //console.log("Из",iXOverlappingBlockInOldBuf,iYOverlappingBlockInOldBuf);
		                //console.log("В ",iXOverlappingBlockInNewBuf,iYOverlappingBlockInNewBuf);
		                //произошло совпадение кусков
		                var iOverlappingBlockWidth: uint = this._iBufferWidth - math.abs(iXnew - this._pXY[i].iX);
		                var iOverlappingBlockHeight: uint = this._iBufferHeight - math.abs(iYnew - this._pXY[i].iY);


		            //     //копируем данные
		                // LOG("Копированеи совпадающей части");

		            //     //console.log(this._pDataFor.length,iXOverlappingBlockInNewBuf,iYOverlappingBlockInNewBuf,iOverlappingBlockWidth,iOverlappingBlockHeight);

		                var pTmpBox1: IBox = geometry.box(iXOverlappingBlockInNewBuf, iYOverlappingBlockInNewBuf, 
		                								  iOverlappingBlockWidth + iXOverlappingBlockInNewBuf, 
		                								  iOverlappingBlockHeight + iYOverlappingBlockInNewBuf);
		                var pTmpBox2: IBox = geometry.box(iXOverlappingBlockInOldBuf, iYOverlappingBlockInOldBuf,
		                								  iOverlappingBlockWidth + iXOverlappingBlockInOldBuf, 
		                								  iOverlappingBlockHeight + iYOverlappingBlockInOldBuf);

		                var pPixelBox1: IPixelBox = this._pDataFor.getSubBox(pTmpBox1, pixelUtil.pixelBox());
		                var pPixelBox2: IPixelBox = this._pBuffer[i].getSubBox(pTmpBox2, pixelUtil.pixelBox());

		                pixelUtil.bulkPixelConversion(pPixelBox2, pPixelBox1);

		            //     /*this._setDataBetweenBuffer(this._pDataFor, iXOverlappingBlockInNewBuf, iYOverlappingBlockInNewBuf,
		            //                                this._pBuffer[i], iXOverlappingBlockInOldBuf, iYOverlappingBlockInOldBuf,
		            //                                iOverlappingBlockWidth, iOverlappingBlockHeight);*/

		                this.setBufferMapNULL(this._pMapDataFor);
		                this._setDataBetweenBufferMap(this._pMapDataFor, iXOverlappingBlockInNewBuf / this._iBlockSize,
		                                              iYOverlappingBlockInNewBuf / this._iBlockSize,
		                                              this._pBufferMap[i], iXOverlappingBlockInOldBuf / this._iBlockSize,
		                                              iYOverlappingBlockInOldBuf / this._iBlockSize,
		                                              iOverlappingBlockWidth / this._iBlockSize,
		                                              iOverlappingBlockHeight / this._iBlockSize);

		                var t: IPixelBox= this._pBuffer[i];
		                this._pBuffer[i] = this._pDataFor;
		                this._pDataFor = t;

		                var s: Uint32Array = this._pBufferMap[i];
		                this._pBufferMap[i] = this._pMapDataFor;
		                this._pMapDataFor = s;
		            }
		            else {
		                this.setBufferMapNULL(this._pBufferMap[i]);
		            }

		            // console.log(this._pXY[i].iX, this._pXY[i].iY, "==>", iXnew, iYnew);
		            this._pXY[i].iX = iXnew;
		            this._pXY[i].iY = iYnew;
		            this._pXY[i].isUpdated = true;
		            // console.log(this._pXY[i].iX, this._pXY[i].iY);

		        }
		    }

		    //Подгрузка части буфера которую ложиться в текстуру + 8 блоков
		    //Нулевая статична, поэтому ее не меняем
		    for (var i: uint = 0; i < this._pTextures.length; i++) {


		        if (i != 0) {
		            iX = math.round(fTexCourdX * this.getWidthOrig(i) - this._iTextureWidth / 2);
		            iY = math.round(fTexCourdY * this.getHeightOrig(i) - this._iTextureHeight / 2);

		            iWidth = this._iTextureWidth;
		            iHeight = this._iTextureHeight;
		            //На данный момент нужен кусок текстуры таких размеров iX1,iY1,iWidth,iHeight,

		            var iAreaX1: uint = iX;
		            var iAreaY1: uint = iY;
		            var iAreaX2: uint = iX + iWidth;
		            var iAreaY2: uint = iY + iHeight;

		            //console.log("Запрос частей текстур на скачивание");
		            //console.log(iX1,this._pXY[i].iX);
		            //console.log(iY1,this._pXY[i].iY);
		            //console.log(iX2,this._pXY[i].iX+this._iBufferWidth);
		            //console.log(iY2,this._pXY[i].iY+this._iBufferHeight);
		            //Смотрим попадаем ли мы в текущий буфер
		            if (iX >= this._pXY[i].iX
		                && iY >= this._pXY[i].iY
		                && iX + this._iTextureWidth < this._pXY[i].iX + this._iBufferWidth
		                && iY + this._iTextureHeight < this._pXY[i].iY + this._iBufferHeight) {
		                //Типа попали
		                //Значит нужно загрузить необходимые куски
		                //Обрезаемся чтобы не вылезти за пределы

		                iX -= this._iBlockSize * 8;
		                iY -= this._iBlockSize * 8;
		                iWidth += this._iBlockSize * 16;
		                iHeight += this._iBlockSize * 16;
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
		            else {
		                /*trace(iX, iY, iX + this._iTextureWidth, iY + this._iTextureWidth);
		                trace(i);
		                trace(this._pXY[i].iX, this._pXY[i].iY, this._pXY[i].iX + this._iBufferWidth,
		                      this._pXY[i].iX + this._iBufferHeight);*/
		                debug_error("Не может такого быть чтобы буфер не попал под текстуру");
		            }
		        }
		        else {
		            if (!this._pXY[0].isLoaded) {
		                this.getDataFromServer(0, 0, 0, this._iTextureWidth, this._iTextureHeight);
		            }
		        }

		    }

		    /*Перекидывание данных из буфера в текстуру, которая будет отображаться*/
		    if (((this._nCountRender++) % 20) == 0) {
		        var iTexInBufX: uint = 0;
		        var iTexInBufY: uint = 0;

		        i = (math.round(this._nCountRender / 20)) % this._pBuffer.length;
		        // LOG("Level #" + i, this._pBuffer[i].data.length, this._pBuffer[i].width, this._pBuffer[i].height);

		        if (i == 0) {
		            if (this._pXY[i].isUpdated == true) {
		                // this._pTextures[i].setPixelRGBA(0, 0, this._iTextureWidth, this._iTextureHeight, this._pBuffer[0]);
		                // var pPixelBox: IPixelBox = new pixelUtil.PixelBox(this._iTextureWidth, this._iTextureHeight, 1, EPixelFormats.A8B8G8R8, this._pBuffer[0].data);
		                // LOG("Level #" + i + " write data:", this._pBuffer[0].toString());
		                this._pTextures[i].getBuffer(0,0).blitFromMemory(this._pBuffer[0]);
		            }
		        }
		        else {
		            if (this._pXY[i].isLoaded == true &&
		                (this._pXY[i].isUpdated == true || this._fTexCourdXOld != fTexCourdX ||
		                 this._fTexCourdYOld != fTexCourdY)) {
		            	//координаты угла мегатекстуре на текстуре
		                iTexInBufX = math.round(fTexCourdX * this.getWidthOrig(i) - this._iTextureWidth / 2); 
		                iTexInBufY = math.round(fTexCourdY * this.getHeightOrig(i) - this._iTextureHeight / 2);
						this._pXY[i].iTexX = iTexInBufX/this.getWidthOrig(i);
						this._pXY[i].iTexY = iTexInBufY/this.getHeightOrig(i);
		                iTexInBufX -= this._pXY[i].iX;
		                iTexInBufY -= this._pXY[i].iY;

		                /*this._setData(this._pDataFor, 0, 0, this._iTextureWidth, this._iTextureHeight,
		                              this._pBuffer[i], iTexInBufX, iTexInBufY, this._iBufferWidth, this._iBufferHeight,
		                              this._iTextureWidth, this._iTextureHeight, pixelUtil.getNumElemBytes(this._eTextureFormat));
		                this._pTextures[i].setPixelRGBA(0, 0, this._iTextureWidth, this._iTextureHeight, this._pDataFor);*/

		                // this._pTmpBox1.setPosition(iTexInBufX, iTexInBufY, this._iBufferWidth, this._iBufferHeight); 
		                
		                var pTmpBox: IBox = geometry.box(iTexInBufX, iTexInBufY, 
		                								 this._iTextureWidth + iTexInBufX,
		                								 this._iTextureHeight + iTexInBufY);
		                var pPixelBox: IPixelBox = this._pBuffer[i].getSubBox(pTmpBox, pixelUtil.pixelBox());
		                // pPixelBox.setConsecutive();
		                // LOG("Level #" + i + " write data:\n", pPixelBox.toString(), "\nOne Color: ", pPixelBox.data[0], pPixelBox.data[1], pPixelBox.data[2]);
		                this._pTextures[i].getBuffer(0,0).blitFromMemory(pPixelBox);

		            }
		        }

		        this._pXY[i].isUpdated = false;
		    }

		    this._fTexCourdXOld = fTexCourdX;
		    this._fTexCourdYOld = fTexCourdY;
		}

		applyForRender(pRenderPass: IRenderPass): void {
		    pRenderPass.setUniform("CAMERA_COORD", this._v2fCameraCoord);

		    for (var i: uint = 0; i < this._pTextures.length; i++) {
		    	//FIX: Not good to use vec2(). It`s tmp vector 
				pRenderPass.setUniform("textureCoord"+ i, vec2(this._pXY[i].iTexX, this._pXY[i].iTexY));
		        pRenderPass.setUniform("textureTerrainIsLoaded" + i, this._pXY[i].isLoaded);
		        pRenderPass.setTexture("TEXTURE" + i, this._pTextures[i]);
		        pRenderPass.setSamplerTexture("S_TERRAIN" + i, "TEXTURE" + i);
		    }
		}

		setBufferMapNULL(pBuffer): void {
			pBuffer.set(this._pMapDataNULL, 0);
		}

		setData(pBuffer, iX: uint, iY: uint, iWidth: uint, iHeight: uint, pBufferIn, iInX: uint, iInY: uint, iInWidth: uint, iInHeight: uint, iBlockWidth: uint, iBlockHeight: uint, iComponents: uint): void {
			iBlockHeight = math.max(0, iBlockHeight);
			iBlockWidth  = math.max(0, iBlockWidth);
			iBlockHeight = math.min(iBlockHeight, iHeight - iY, iInHeight - iInY);
			iBlockWidth  = math.min(iBlockWidth, iWidth - iX, iInWidth - iInX);

			if (pBuffer.length < ((iY + iBlockHeight - 1) * iWidth + iX + iBlockWidth) * iComponents) {
			    /*trace(pBuffer.length, iX, iY, iBlockWidth, iBlockHeight, iWidth, iHeight, iComponents);
			    trace(pBuffer.length, ((iY + iBlockHeight - 1) * iWidth + iX + iBlockWidth) * iComponents);*/
			    debug_error("Выход за предел массива 1");
			}
			
			if (pBufferIn.length < ((iInY + iBlockHeight - 1) * iInWidth + iInX + iBlockWidth) * iComponents) {
			    debug_error("Выход за предел массива 2");
			}

			for (var i: uint = 0; i < iBlockHeight; i++) {
			    for (var j: uint = 0; j < iBlockWidth; j++) {
			        for (var k: uint = 0; k < iComponents; k++) {
			            pBuffer[((iY + i) * iWidth + iX + j) * iComponents + k] = pBufferIn[((iInY + i) * iInWidth + iInX + j) *
			                                                                                iComponents + k];
			        }
			    }
			}
		}

		setDataT(pBuffer, iX: uint, iY: uint, iWidth: uint, iHeight: uint, pBufferIn, iInX: uint, iInY: uint, iInWidth: uint, iInHeight: uint, iBlockWidth: uint, iBlockHeight: uint, iComponents: uint): void {
			iBlockHeight = math.max(0, iBlockHeight);
			iBlockWidth = math.max(0, iBlockWidth);
			iBlockHeight = math.min(iBlockHeight, iHeight - iY, iInHeight - iInY);
			iBlockWidth = math.min(iBlockWidth, iWidth - iX, iInWidth - iInX);

			if (pBuffer.length < ((iY + iBlockHeight - 1) * iWidth + iX + iBlockWidth) * iComponents) {
			    /*trace(pBuffer.length, iX, iY, iBlockWidth, iBlockHeight, iWidth, iHeight, iComponents);
			    trace(pBuffer.length, ((iY + iBlockHeight - 1) * iWidth + iX + iBlockWidth) * iComponents);*/
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

		private _setData(pBuffer, iX: uint, iY: uint, iWidth: uint, iHeight: uint, pBufferIn, iInX: uint, iInY: uint, iInWidth: uint, iInHeight: uint, iBlockWidth: uint, iBlockHeight: uint, iComponents: uint): void {
			this.setDataT(pBuffer, iX, iY, iWidth, iHeight, pBufferIn, iInX, iInY, iInWidth, iInHeight, iBlockWidth, iBlockHeight, iComponents);
		}

		private _setDataBetweenBuffer(pBuffer, iX: uint, iY: uint, pBufferIn, iInX: uint, iInY: uint, iBlockWidth: uint, iBlockHeight: uint): void {
		    var iInWidth: uint    = this._iBufferWidth;
		    var iInHeight: uint   = this._iBufferHeight;
		    var iComponents: uint = pixelUtil.getNumElemBytes(this._eTextureFormat);
		    var iWidth: uint      = this._iBufferWidth;
		    var iHeight: uint     = this._iBufferHeight;
		    this.setDataT(pBuffer, iX, iY, iWidth, iHeight, pBufferIn, iInX, iInY, iInWidth, iInHeight, iBlockWidth,  iBlockHeight, iComponents);
		}

		private _setDataBetweenBufferMap(pBuffer, iX: uint, iY: uint, pBufferIn, iInX: uint, iInY: uint, iBlockWidth: uint, iBlockHeight: uint): void {
		    var iInWidth: uint    = this._iBufferWidth / this._iBlockSize;
		    var iInHeight: uint   = this._iBufferHeight / this._iBlockSize;
		    var iComponents: uint = 1;
		    var iWidth: uint      = this._iBufferWidth / this._iBlockSize;
		    var iHeight: uint     = this._iBufferHeight / this._iBlockSize;
		    this.setDataT(pBuffer, iX, iY, iWidth, iHeight, pBufferIn, iInX, iInY, iInWidth, iInHeight, iBlockWidth, iBlockHeight, iComponents);
		}

		private _setDataFromBlock(pBuffer, iX: uint, iY: uint, pBufferIn): void {
		    var iInX: uint         = 0;
		    var iInY: uint         = 0;
		    var iInWidth: uint     = this._iBlockSize;
		    var iInHeight: uint    = this._iBlockSize;
		    var iBlockWidth: uint  = this._iBlockSize;
		    var iBlockHeight: uint = this._iBlockSize;
		    var iComponents: uint  = pixelUtil.getNumElemBytes(this._eTextureFormat);
		    var iWidth: uint       = 0;
		    var iHeight: uint      = 0;
		    if (pBuffer.length == this._iBufferWidth * this._iBufferHeight * iComponents) {
		        iWidth = this._iBufferWidth;
		        iHeight = this._iBufferHeight;
		    } else if (pBuffer.length == this._iBufferWidth * this._iBufferHeight * iComponents / 4) {
		        iWidth = this._iBufferWidth / 2;
		        iHeight = this._iBufferHeight / 2;
		    } else {
		        console.log("Странный размер массива", pBuffer, pBuffer.length,
		                    this._iBufferWidth * this._iBufferHeight * iComponents,
		                    this._iBufferWidth * this._iBufferHeight * iComponents / 4);
		    }

		    //в хроме бужет рабоать быстрее SetData
		    this.setDataT(pBuffer, iX, iY, iWidth, iHeight, pBufferIn, iInX, iInY, iInWidth, iInHeight, iBlockWidth, iBlockHeight, iComponents);
		  
		}

		getWidthOrig(iLevel: uint): uint {
			return this._iTextureWidth << iLevel;
		}

		getHeightOrig(iLevel: uint): uint {
			return this._iTextureHeight << iLevel;
		}

		getDataFromServer(iLevelTex: uint, iOrigTexX: uint, iOrigTexY: uint, iWidth: uint, iHeight: uint, iAreaX?: uint, iAreaY?: uint, iAreaWidth?: uint, iAreaHeight?: uint): void {
		    var iOrigTexEndX: uint = math.ceil((iOrigTexX + iWidth) / this._iBlockSize) * this._iBlockSize;
		    var iOrigTexEndY: uint = math.ceil((iOrigTexY + iHeight) / this._iBlockSize) * this._iBlockSize;
		    iOrigTexX = math.max(0, iOrigTexX);
		    iOrigTexY = math.max(0, iOrigTexY);
		    iOrigTexX = math.floor(iOrigTexX / this._iBlockSize) * this._iBlockSize;
		    iOrigTexY = math.floor(iOrigTexY / this._iBlockSize) * this._iBlockSize;
		    iOrigTexEndX = math.min(iOrigTexEndX, this.getWidthOrig(iLevelTex));
		    iOrigTexEndY = math.min(iOrigTexEndY, this.getHeightOrig(iLevelTex));

		    var iAreaEndX: uint = iAreaX + iAreaWidth;
		    var iAreaEndY: uint = iAreaY + iAreaHeight;
		    iAreaX = math.max(0, iAreaX);
		    iAreaY = math.max(0, iAreaY);
		    iAreaEndX = math.min(iAreaEndX, this.getWidthOrig(iLevelTex));
		    iAreaEndY = math.min(iAreaEndY, this.getHeightOrig(iLevelTex));
		    var isLoaded: bool = true;

		    //trace("Кординаты внутри оригинальной текстуре",iOrigTexX,iOrigTexY,iOrigTexEndX,iOrigTexEndY,iLevelTex);
		    var me: MegaTexture = this;
		    var tCurrentTime = (me._pEngine.getTimer().absoluteTime * 1000) >>> 0;

		//	if(iLevelTex==2)
		//	{
		//		trace(iOrigTexX,iOrigTexY,iOrigTexEndX,iOrigTexEndY,"(",me._pXY[iLevelTex].iX,me._pXY[iLevelTex].iY,")");
		//	}


		    for (var i: uint = iOrigTexY; i < iOrigTexEndY; i += this._iBlockSize) {
		        for (var j: uint = iOrigTexX; j < iOrigTexEndX; j += this._iBlockSize) {
		            //trace("Загрузка куска",i,j);
		            if (iLevelTex == 0) {
		                if (me._pBufferMap[iLevelTex][(i - me._pXY[iLevelTex].iY) / me._iBlockSize *
		                                              (me._iTextureWidth / me._iBlockSize) +
		                                              (j - me._pXY[iLevelTex].iX) / me._iBlockSize] != 0xFFFFFFFF) {
		                    isLoaded = false;
		                }

		                if (tCurrentTime != 0 && tCurrentTime -
		                                         me._pBufferMap[iLevelTex][(i - me._pXY[iLevelTex].iY) / me._iBlockSize *
		                                                                   (me._iTextureWidth / me._iBlockSize) +
		                                                                   (j - me._pXY[iLevelTex].iX) / me._iBlockSize] <
		                                         5000) {
		                    continue;
		                }
		                if (me._pBufferMap[iLevelTex][(i - me._pXY[iLevelTex].iY) / me._iBlockSize *
		                                              (me._iTextureWidth / me._iBlockSize) +
		                                              (j - me._pXY[iLevelTex].iX) / me._iBlockSize] == 0xFFFFFFFF) {
		                    continue;
		                }

		                me._pBufferMap[iLevelTex][(i - me._pXY[iLevelTex].iY) / me._iBlockSize *
		                                          (me._iTextureWidth / me._iBlockSize) +
		                                          (j - me._pXY[iLevelTex].iX) / me._iBlockSize] = tCurrentTime;
		            } else {

		                /*				if(me._pBufferMap[iLevelTex][(i-me._pXY[iLevelTex].iY)/me._iBlockSize*(me._iBufferWidth/me._iBlockSize)+(j-me._pXY[iLevelTex].iX)/me._iBlockSize]==0xFFFFFFFF)
		                 {
		                 if(iLevelTex==2&&i==0)
		                 {
		                 //console.log("!!");
		                 }
		                 continue;
		                 }

		                 //trace("Кусок еще не загружен",iLevelTex,j,i,32,32);*/

		                //Проверка на выставление флага о полной загруженности вилимой области
		                if (j >= iAreaX && j < iAreaEndX && i >= iAreaY && i < iAreaEndY &&
		                    me._pBufferMap[iLevelTex][(i - me._pXY[iLevelTex].iY) / me._iBlockSize *
		                                              (me._iBufferWidth / me._iBlockSize) +
		                                              (j - me._pXY[iLevelTex].iX) / me._iBlockSize] != 0xFFFFFFFF) {
		                    isLoaded = false;
		                }

		                if (tCurrentTime - me._pBufferMap[iLevelTex][(i - me._pXY[iLevelTex].iY) / me._iBlockSize *
		                                                             (me._iBufferWidth / me._iBlockSize) +
		                                                             (j - me._pXY[iLevelTex].iX) / me._iBlockSize] < 5000) {
		                    continue;
		                }
		                if (me._pBufferMap[iLevelTex][(i - me._pXY[iLevelTex].iY) / me._iBlockSize *
		                                              (me._iBufferWidth / me._iBlockSize) +
		                                              (j - me._pXY[iLevelTex].iX) / me._iBlockSize] == 0xFFFFFFFF) {
		                    continue;
		                }

		                me._pBufferMap[iLevelTex][(i - me._pXY[iLevelTex].iY) / me._iBlockSize *
		                                          (me._iBufferWidth / me._iBlockSize) +
		                                          (j - me._pXY[iLevelTex].iX) / me._iBlockSize] = tCurrentTime;
		            }

		            var iLev = iLevelTex;
		            var iX = j, iY = i;

		            // (function (iLev: uint, iX: uint, iY: uint) {
		            //     var sPiecePath: string = me._sSurfaceTextures;

		            //     me._pRPC.proc('getMegaTexture', me._sSurfaceTextures, me.getWidthOrig(iLev), me.getHeightOrig(iLev), iX,
		            //                   iY, me._iBlockSize, me._iBlockSize, me._eTextureFormat,
		            //                   function (pError: Error, pData: Uint8Array) {

		            //                       if(!isNull(pError)){
		            //                       		debug_print(pError.message);
		            //                       		return;
		            //                       }

		                                  var pData = new Uint8Array(me._iBlockSize * me._iBlockSize * 3);
		                                  for(var k: uint = 0; k < pData.length; k+= 3){
		                                 //  	if(iLev === 0){
			                                //   	pData[k] = 0;
			                                //   	pData[k + 1] = 255;
			                                //   	pData[k + 2] = 0;
		                                 //  	}
		                                 //  	else if(iLev === 1){
		                                 //  		pData[k] = 255;
			                                //   	pData[k + 1] = 0;
			                                //   	pData[k + 2] = 0;
		                                 //  	}
		                                 //  	else if(iLev === 2) {
		                                 //  		pData[k] = 0;
			                                //   	pData[k + 1] = 0;
			                                //   	pData[k + 2] = 255;
		                                 //  	}
		                                 //  	else {
		                                 //  		pData[k] = 255;
			                                //   	pData[k + 1] = 0;
			                                //   	pData[k + 2] = 255;
		                                 //  	}

		                                  	pData[k] = 170;
			                                pData[k + 1] = 50;
			                                pData[k + 2] = 170;
		                                  }
		                                  //console.log(me._pBuffer[iLevelTex].length,iX-me._pXY[iLevelTex].iX,iY-me._pXY[iLevelTex].iY);
		                                  var iXBuf: uint;
		                                  var iYBuf: uint;
		                                  if (iLev == 0) {
		                                      //console.log("Подгрузился кусок для текстуры уровня 0. С координатами",iX,iY);
		                                      iXBuf = iX - me._pXY[iLev].iX;
		                                      iYBuf = iY - me._pXY[iLev].iY;
		                                      if (iXBuf < 0 || iXBuf > me._iBufferWidth / 2 - me._iBlockSize
		                                              || iYBuf < 0 || iYBuf > me._iBufferHeight / 2 - me._iBlockSize) {
		                                          return;
		                                      }
		                                      me._pBufferMap[iLev][iYBuf / me._iBlockSize *
		                                                           (me._iTextureWidth / me._iBlockSize) +
		                                                           iXBuf / me._iBlockSize] = 0xFFFFFFFF;
		                                  }
		                                  else {
		                                      //console.log("Подгрузился кусок для текстуры уровня",iLevelTex,". С координатами",iX,iY);
		                                      iXBuf = iX - me._pXY[iLev].iX;
		                                      iYBuf = iY - me._pXY[iLev].iY;
		                                      if (iLev == 2 && iY == 0) {

		                                          //console.log(iX,iY,iXBuf,iYBuf);
		                                      }
		                                      if (iXBuf < 0 || iXBuf > me._iBufferWidth - me._iBlockSize
		                                              || iYBuf < 0 || iYBuf > me._iBufferHeight - me._iBlockSize) {
		                                          return;
		                                      }
		                                      me._pBufferMap[iLev][iYBuf / me._iBlockSize *
		                                                           (me._iBufferWidth / me._iBlockSize) +
		                                                           iXBuf / me._iBlockSize] = 0xFFFFFFFF;
		                                  }

		                                  var pTmpBox1: IBox = geometry.box(0, 0, me._iBlockSize, me._iBlockSize);
		                                  var pTmpBox2: IBox = geometry.box(iXBuf, iYBuf, me._iBlockSize + iXBuf, me._iBlockSize + iYBuf);

		                                  var pSourceBox: IPixelBox = pixelUtil.pixelBox(pTmpBox1, me._eTextureFormat, pData);
		                                  var pSubBox: IPixelBox = me._pBuffer[iLev].getSubBox(pTmpBox2, pixelUtil.pixelBox());
		                                  
		                                  pixelUtil.bulkPixelConversion(pSourceBox, pSubBox);

		                                  me._pXY[iLev].isUpdated = true;
		            //                   });
		            // })(iLevelTex, j, i);

		        }
		    }

		    me._pXY[iLevelTex].isLoaded = isLoaded;
		    // if(isLoaded === true){
	    	// 	LOG("Loaded mega texture level #" + iLevelTex, isLoaded);
		    // }
		}
	}
}

#endif



