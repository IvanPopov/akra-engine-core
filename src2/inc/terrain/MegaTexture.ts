#ifndef MEGATEXTURE_TS
#define MEGATEXTURE_TS

#include "IMegaTexture.ts"

module akra {
	export class MegaTexture implements IMegaTexture{
	    private _pEngine: IEngine = null;
	    private _pDevice = null;

	    private _pObject = null;
	    private _pWorldExtents = null;
	    private _v2fCameraCoord: IVec2 = new Vec2(0, 0); //Координаты камеры на объекте

	    //Путь откуда запрашиваются куски текстуры
	    private _sSurfaceTextures: string = "";

	    //Маскимальный размер стороны текстуры
	    private _iOriginalTextureMaxSize: uint = 8192;

	    //Размер блока текстуры(минимальный размер выгружаемого куска текстуры)
	    private _iBlockSize: uint = 32;

	    //Тип хранимых тектсур
	    private _eTextureType = a.IFORMATSHORT.RGB;
	    private _iTextureHeight: uint = 1024;
	    private _iTextureWidth: uint = 1024;
	    
	    private _pTexures: Array = null;

	    //Буффер, который в два раза шире МегаТекстур, используется что бы заранее подгружать чуть больше чем нужно для текущего отображения,
	    //дает возможность начинать выгружать данные чуть раньше чем они понадобяться и в тож время сохраняет некий кеш,
	    //чтобы в случае возвращения на старую точку не перзагружать что недавно использовалось
	    private _iBufferHeight: uint = 0;
	    private _iBufferWidth: uint  = 0;
	    private _pBuffer: Array = null;
	    //Карта с разметкой буфера, чтобы знать какой части буффер уже отсылалось задание на заполнение
	    private _pBufferMap: Array = null;
	    private _pXY: Array = null;

	    //Всякие темповые буферы
	    private _pDataFor: Uint8Array     = null;
	    private _pMapDataFor: Uint8Array  = null;
	    private _pMapDataNULL: Uint8Array = null;

	    private _pRPC = new a.NET.RPC('ws://192.168.194.132');

	    MegaTexture.fTexCourdXOld = undefined;
	    MegaTexture.fTexCourdYOld = undefined;
	    MegaTexture.nCountRender = 0;

	    constructor(pEngine: IEngine, pObject, sSurfaceTextures: string) {
	    	this._pEngine = pEngine;
	    	this._pDevice = pEngine.pDevice;
	    	this._pObject = pObject;
	    	this._pWorldExtents = pObject.worldExtents();
	    	this._sSurfaceTextures = sSurfaceTextures;

	    	var iCountTex = Math.log2(this._iOriginalTextureMaxSize / Math.max(this._iTextureHeight, this._iTextureWidth)) + 1;

	    	this._pTexures   = new Array(iCountTex);
	    	this._pBuffer    = new Array(iCountTex);
	    	this._pBufferMap = new Array(iCountTex);
	    	this._pXY        = new Array(iCountTex);

	    	this._iBufferHeight = this._iTextureHeight * 2;
	    	this._iBufferWidth  = this._iTextureWidth * 2;

	    	this._pDataFor     = new Uint8Array(this._iBufferWidth * this._iBufferHeight * a.getIFormatNumElements(this._eTextureType));
	    	this._pMapDataFor  = new Uint32Array(this._iBufferHeight * this._iBufferWidth / (this._iBlockSize * this._iBlockSize));
	    	this._pMapDataNULL = new Uint32Array(this._iBufferHeight * this._iBufferWidth / (this._iBlockSize * this._iBlockSize));

	    	for (var i: uint = 0; i < this._pMapDataNULL.length; i++) {
	    	    this._pMapDataNULL[i] = 0;
	    	}

	    	this.setBufferMapNULL(this._pMapDataFor);

	    	//Создаем куски мегатекстуры
    	    for (var i: uint = 0; i < this._pTexures.length; i++) {
    	        this._pTexures[i] = new a.Texture(this._pEngine);
    	        this._pTexures[i].createTexture(this._iTextureWidth, this._iTextureHeight, undefined, this._eTextureType);
    			this._pTexures[i].applyParameter(a.TPARAM.WRAP_S, a.TWRAPMODE.CLAMP_TO_EDGE);
    			this._pTexures[i].applyParameter(a.TPARAM.WRAP_T, a.TWRAPMODE.CLAMP_TO_EDGE);
    	        if (i == 0) {
    	            this._pBuffer[i] = new Uint8Array(this._iTextureHeight * this._iTextureWidth *
    	                                              a.getIFormatNumElements(this._eTextureType));
    	            this._pBufferMap[i] = new Uint32Array(this._iBufferHeight * this._iBufferWidth /
    	                                                  (this._iBlockSize * this._iBlockSize)); //на самом деле this._iTextureHeight*this._iTextureWidth

    	            this.setBufferMapNULL(this._pBufferMap[i]);
    	            //Худшего качества статична поэтому размер у буфера такойже как у текстуры this._iBlockSize
    	        } else {
    	            this._pBuffer[i] = new Uint8Array(this._iBufferHeight * this._iBufferWidth *
    	                                              a.getIFormatNumElements(this._eTextureType));
    	            this._pBufferMap[i] = new Uint32Array(this._iBufferHeight * this._iBufferWidth /
    	                                                  (this._iBlockSize * this._iBlockSize));
    	            this.setBufferMapNULL(this._pBufferMap[i]);
    	        }
    	        this._pXY[i] = {iX : 0, iY : 0,/*Координты буфера в основной текстуре, для простыты должны быть кратну размеру блока*/
    				iTexX:0, iTexY:0,   /*Координаты мегатекстуры в текстуре*/
    				isUpdated : true, isLoaded : false};
    	    }
	    	this.getDataFromServer(0, 0, 0, this._iTextureWidth, this._iTextureHeight);
	    }


		prepareForRender(): void {
		    var pCamera: ICamera = this._pEngine.getActiveCamera();
		    var v3fCameraPosition: IVec3 = pCamera.worldPosition();


		    //Вычисление текстурных координат над которыми находиться камера
		    var fTexCourdX: float = (v3fCameraPosition.x - this._pWorldExtents.fX0) /
		                     Math.abs(this._pWorldExtents.fX1 - this._pWorldExtents.fX0);
		    var fTexCourdY: float = (v3fCameraPosition.y - this._pWorldExtents.fY0) /
		                     Math.abs(this._pWorldExtents.fY1 - this._pWorldExtents.fY0);

		    this._v2fCameraCoord.set(fTexCourdX, fTexCourdY);

		    var iX: uint, iX1: uint, iX2: uint;
		    var iY: uint, iY1: uint, iY2: uint;
		    var iWidth: uint, iHeight: uint;


		    //Нужно ли перекладвывать, отсавим на запас 8 блоков

		    //Опираемся на текстуру самого хорошего разрешения
		    iX = Math.round(fTexCourdX * (this.getWidthOrig(this._pTexures.length - 1)) - this._iTextureWidth / 2);
		    iY = Math.round(fTexCourdY * (this.getHeightOrig(this._pTexures.length - 1)) - this._iTextureHeight / 2);
		    iWidth = this._iTextureWidth;
		    iHeight = this._iTextureHeight;

		    //console.log("=> Смена координат")
		    //console.log(iX,this._pXY[this._pTexures.length-1].iX,Math.floor((iX-this._pXY[this._pTexures.length-1].iX)));
		    //console.log(iY,this._pXY[this._pTexures.length-1].iY,Math.floor((iY-this._pXY[this._pTexures.length-1].iY)));
		    //console.log(iX,this._pXY[this._pTexures.length-1].iX+this._iTextureWidth,Math.floor((this._iTextureHeight-iX+this._pXY[this._pTexures.length-1].iX)));
		    //console.log(iY,this._pXY[this._pTexures.length-1].iY+this._iTextureHeight,Math.floor((this._iTextureHeight-iY+this._pXY[this._pTexures.length-1].iY)));
		    if (Math.floor((iX - this._pXY[this._pTexures.length - 1].iX) / this._iBlockSize) < 8
		            || Math.floor((iY - this._pXY[this._pTexures.length - 1].iY) / this._iBlockSize) < 8
		            ||
		        Math.floor((this._pXY[this._pTexures.length - 1].iX + this._iBufferWidth - (iX + iWidth)) / this._iBlockSize <
		                   8)
		        ||
		        Math.floor((this._pXY[this._pTexures.length - 1].iY + this._iBufferHeight - (iY + iHeight)) / this._iBlockSize <
		                   8)) {
		        console.log("Да")
		        //Перемещаем
		        for (i = 1; i < this._pTexures.length; i++) {
		            console.log("Уровень", i)
		            //Вычисляем новые координаты буфера в текстуре
		            var iXnew: uint = Math.round(fTexCourdX * this.getWidthOrig(i) - this._iTextureWidth / 2);
		            var iYnew: uint = Math.round(fTexCourdY * this.getHeightOrig(i) - this._iTextureHeight / 2);

		            iXnew -= (this._iBufferWidth - this._iTextureWidth) / 2;
		            iYnew -= (this._iBufferHeight - this._iTextureHeight) / 2;

		            //Округлили на размер блока
		            iXnew = Math.round((iXnew / this._iBlockSize)) * this._iBlockSize;
		            iYnew = Math.round((iYnew / this._iBlockSize)) * this._iBlockSize;
		            //Копирование совпадающего куска

		            var iXOverlappingBlockInOldBuf: uint = iXnew - this._pXY[i].iX;
		            var iYOverlappingBlockInOldBuf: uint = iYnew - this._pXY[i].iY;
		            var iXOverlappingBlockInNewBuf: uint = -iXOverlappingBlockInOldBuf;
		            var iYOverlappingBlockInNewBuf: uint = -iYOverlappingBlockInOldBuf;

		            iXOverlappingBlockInOldBuf = Math.max(0, iXOverlappingBlockInOldBuf);
		            iYOverlappingBlockInOldBuf = Math.max(0, iYOverlappingBlockInOldBuf);
		            iXOverlappingBlockInNewBuf = Math.max(0, iXOverlappingBlockInNewBuf);
		            iYOverlappingBlockInNewBuf = Math.max(0, iYOverlappingBlockInNewBuf);


		            if (iXOverlappingBlockInOldBuf < this._iBufferWidth && iYOverlappingBlockInOldBuf < this._iBufferHeight &&
		                iXOverlappingBlockInNewBuf < this._iBufferWidth && iYOverlappingBlockInNewBuf < this._iBufferHeight) {
		                //console.log(this._pXY[i].iX,this._pXY[i].iY,"==>",iXnew,iYnew)
		                //console.log("Из",iXOverlappingBlockInOldBuf,iYOverlappingBlockInOldBuf);
		                //console.log("В ",iXOverlappingBlockInNewBuf,iYOverlappingBlockInNewBuf);
		                //произошло совпадение кусков
		                var iOverlappingBlockWidth: uint = this._iBufferWidth - Math.abs(iXnew - this._pXY[i].iX);
		                var iOverlappingBlockHeight: uint = this._iBufferHeight - Math.abs(iYnew - this._pXY[i].iY);


		                //копируем данные
		                console.log("Копированеи совпадающей части");

		                //console.log(this._pDataFor.length,iXOverlappingBlockInNewBuf,iYOverlappingBlockInNewBuf,iOverlappingBlockWidth,iOverlappingBlockHeight);


		                this._setDataBetweenBuffer(this._pDataFor, iXOverlappingBlockInNewBuf, iYOverlappingBlockInNewBuf,
		                                           this._pBuffer[i], iXOverlappingBlockInOldBuf, iYOverlappingBlockInOldBuf,
		                                           iOverlappingBlockWidth, iOverlappingBlockHeight);

		                this.setBufferMapNULL(this._pMapDataFor);
		                this._setDataBetweenBufferMap(this._pMapDataFor, iXOverlappingBlockInNewBuf / this._iBlockSize,
		                                              iYOverlappingBlockInNewBuf / this._iBlockSize,
		                                              this._pBufferMap[i], iXOverlappingBlockInOldBuf / this._iBlockSize,
		                                              iYOverlappingBlockInOldBuf / this._iBlockSize,
		                                              iOverlappingBlockWidth / this._iBlockSize,
		                                              iOverlappingBlockHeight / this._iBlockSize);

		                var t: Uint8Array= this._pBuffer[i];
		                this._pBuffer[i] = this._pDataFor;
		                this._pDataFor = t;

		                var t: Uint32Array = this._pBufferMap[i];
		                this._pBufferMap[i] = this._pMapDataFor;
		                this._pMapDataFor = t;
		            }
		            else {
		                this.setBufferMapNULL(this._pBufferMap[i]);
		            }

		            console.log(this._pXY[i].iX, this._pXY[i].iY, "==>", iXnew, iYnew);
		            this._pXY[i].iX = iXnew;
		            this._pXY[i].iY = iYnew;
		            this._pXY[i].isUpdated = true;
		            console.log(this._pXY[i].iX, this._pXY[i].iY);

		        }
		    }

		    //Подгрузка части буфера которую ложиться в текстуру + 8 блоков
		    //Нулевая статична, поэтому ее не меняем
		    for (var i: uint = 0; i < this._pTexures.length; i++) {


		        if (i != 0) {
		            iX = Math.round(fTexCourdX * this.getWidthOrig(i) - this._iTextureWidth / 2);
		            iY = Math.round(fTexCourdY * this.getHeightOrig(i) - this._iTextureHeight / 2);

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
		                iX1 = Math.clamp(iX, 0, this.getWidthOrig(i));
		                iY1 = Math.clamp(iY, 0, this.getHeightOrig(i));
		                iX2 = Math.clamp(iX + iWidth, 0, this.getWidthOrig(i));
		                iY2 = Math.clamp(iY + iHeight, 0, this.getHeightOrig(i));

		                var iAreaX1: uint = Math.clamp(iAreaX1, 0, this.getWidthOrig(i));
		                var iAreaY1: uint = Math.clamp(iAreaY1, 0, this.getHeightOrig(i));
		                var iAreaX2: uint = Math.clamp(iAreaX2, 0, this.getWidthOrig(i));
		                var iAreaY2: uint = Math.clamp(iAreaY2, 0, this.getHeightOrig(i));

		                this.getDataFromServer(i, iX1, iY1, iX2 - iX1, iY2 - iY1, /*Остальные область проверки*/iAreaX1,
		                                       iAreaY1, iAreaX2 - iAreaX1, iAreaY2 - iAreaY1);
		            }
		            else {
		                trace(iX, iY, iX + this._iTextureWidth, iY + this._iTextureWidth);
		                trace(i);
		                trace(this._pXY[i].iX, this._pXY[i].iY, this._pXY[i].iX + this._iBufferWidth,
		                      this._pXY[i].iX + this._iBufferHeight);
		                debug_error("Не может такого быть чтобы буфер не попал под текстуру");
		            }
		        }
		        else {
		            if (!this._pXY[0].isLoaded) {
		                this.getDataFromServer(0, 0, 0, this._iTextureWidth, this._iTextureHeight);
		            }
		        }

		    }

		    if (((MegaTexture.nCountRender++) % 10) == 0) {
		        var iTexInBufX: uint = 0;
		        var iTexInBufY: uint = 0;

		        i = (Math.round(MegaTexture.nCountRender / 10)) % this._pBuffer.length;

		        if (i == 0) {
		            if (this._pXY[i].isUpdated == true) {
		                this._pTexures[i].setPixelRGBA(0, 0, this._iTextureWidth, this._iTextureHeight, this._pBuffer[0]);
		            }
		        }
		        else {
		            if (this._pXY[i].isLoaded == true &&
		                (this._pXY[i].isUpdated == true || MegaTexture.fTexCourdXOld != fTexCourdX ||
		                 MegaTexture.fTexCourdYOld != fTexCourdY)) {
		                iTexInBufX = Math.round(fTexCourdX * this.getWidthOrig(i) - this._iTextureWidth / 2); //координаты угла мегатекстуре на текстуре
		                iTexInBufY = Math.round(fTexCourdY * this.getHeightOrig(i) - this._iTextureHeight / 2); //
						this._pXY[i].iTexX=iTexInBufX/this.getWidthOrig(i);
						this._pXY[i].iTexY=iTexInBufY/this.getHeightOrig(i);
		                iTexInBufX -= this._pXY[i].iX;
		                iTexInBufY -= this._pXY[i].iY;


		                this._setData(this._pDataFor, 0, 0, this._iTextureWidth, this._iTextureHeight,
		                              this._pBuffer[i], iTexInBufX, iTexInBufY, this._iBufferWidth, this._iBufferHeight,
		                              this._iTextureWidth, this._iTextureHeight, a.getIFormatNumElements(this._eTextureType));
		                this._pTexures[i].setPixelRGBA(0, 0, this._iTextureWidth, this._iTextureHeight, this._pDataFor);

		                /*var c2d=document.getElementById('canvas1_'+i).getContext("2d");
		                 var pData=c2d.getImageData(0,0,128,128);
		                 //console.log("!!!");
		                 //console.log(pData);
		                 //console.log(pData.data.length,this._pBuffer[i][0],this._pBuffer[i][1],this._pBuffer[i][2]);
		                 for(var p=0,p1=0;p<pData.data.length;p+=4,p1+=3*8)
		                 {
		                 pData.data[p+0]=this._pDataFor[p1+0];
		                 pData.data[p+1]=this._pDataFor[p1+1];
		                 pData.data[p+2]=this._pDataFor[p1+2];
		                 pData.data[p+3]=255;
		                 if(p1%(1024*3)==0&&p1!=0)
		                 p1+=3*(1024*(8-1))

		                 }
		                 c2d.putImageData(pData, 0, 0);*/
		            }
		        }
		        this._pXY[i].isUpdated = false;
		    }


		    if (((MegaTexture.nCountRender++) % 11) == 0) {
		        for (var i: uint = 0; i < this._pTexures.length; i++) {

		            var c2d = document.getElementById('canvas' + i).getContext("2d");
		            var pData = c2d.getImageData(0, 0, 128, 128);


		            if (i != 0) {
		                //console.log(pData.data.length,this._pBuffer[i][0],this._pBuffer[i][1],this._pBuffer[i][2]);
		                for (var p: uint = 0, p1: uint = 0; p < pData.data.length; p += 4, p1 += 3 * 16) {
		                    pData.data[p + 0] = this._pBuffer[i][p1 + 0];
		                    pData.data[p + 1] = this._pBuffer[i][p1 + 1];
		                    pData.data[p + 2] = this._pBuffer[i][p1 + 2];
		                    pData.data[p + 3] = 255;
		                    if (p1 % (2048 * 3) == 0 && p1 != 0) {
		                        p1 += 3 * (2048 * (16 - 1))
		                    }

		                }
		            }
		            else {
		                //console.log(pData.data.length,this._pBuffer[i][0],this._pBuffer[i][1],this._pBuffer[i][2]);
		                for (var p: uint = 0, p1: uint = 0; p < pData.data.length; p += 4, p1 += 3 * 8) {
		                    pData.data[p + 0] = this._pBuffer[i][p1 + 0];
		                    pData.data[p + 1] = this._pBuffer[i][p1 + 1];
		                    pData.data[p + 2] = this._pBuffer[i][p1 + 2];
		                    pData.data[p + 3] = 255;
		                    if (p1 % (1024 * 3) == 0 && p1 != 0) {
		                        p1 += 3 * (1024 * (8 - 1))
		                    }

		                }
		            }
		            c2d.putImageData(pData, 0, 0);

		            if (i != 0) {
		                iTexInBufX = Math.round(fTexCourdX * this.getWidthOrig(i) - this._iTextureWidth / 2);
		                iTexInBufY = Math.round(fTexCourdY * this.getHeightOrig(i) - this._iTextureHeight / 2);
		                iTexInBufX -= this._pXY[i].iX;
		                iTexInBufY -= this._pXY[i].iY;
		                c2d.strokeStyle = '#fff';
		                c2d.lineWidth = 1;
		                c2d.strokeRect(Math.floor(iTexInBufX / 16) - 1, Math.floor(iTexInBufY / 16) - 1,
		                               Math.floor(this._iTextureWidth / 16) + 2, Math.floor(this._iTextureHeight / 16) + 2);

		                var c2d = document.getElementById('canvas0_' + i).getContext("2d");
		                var pData = c2d.getImageData(0, 0, 128, 128);
		                //console.log(pData.data.length,this._pBuffer[i][0],this._pBuffer[i][1],this._pBuffer[i][2]);
		                for (var p: uint = 0, p1: uint = 0; p < pData.data.length; p += 4, p1 += 3 * 16) {
		                    pData.data[p + 0] = this._pDataFor[p1 + 0];
		                    pData.data[p + 1] = this._pDataFor[p1 + 1];
		                    pData.data[p + 2] = this._pDataFor[p1 + 2];
		                    pData.data[p + 3] = 255;
		                    if (p1 % (2048 * 3) == 0 && p1 != 0) {
		                        p1 += 3 * (2048 * (16 - 1))
		                    }

		                }
		                c2d.putImageData(pData, 0, 0);
		                iTexInBufX = Math.round(fTexCourdX * this.getWidthOrig(i) - this._iTextureWidth / 2);
		                iTexInBufY = Math.round(fTexCourdY * this.getHeightOrig(i) - this._iTextureHeight / 2);
		                iTexInBufX -= this._pXY[i].iX;
		                iTexInBufY -= this._pXY[i].iY;
		                c2d.strokeStyle = '#fff';
		                c2d.lineWidth = 1;
		                c2d.strokeRect(Math.floor(iTexInBufX / 16) - 1, Math.floor(iTexInBufY / 16) - 1,
		                               Math.floor(this._iTextureWidth / 16) + 2, Math.floor(this._iTextureHeight / 16) + 2);
		            }


		            var c2d = document.getElementById('canvas2_' + i).getContext("2d");

		            //console.log(pData.data.length,this._pBuffer[i][0],this._pBuffer[i][1],this._pBuffer[i][2]);

		            var pData = c2d.getImageData(0, 0, 64, 64);
		            if (i != 0) {

		                for (var p: uint = 0, p1: uint = 0; p < pData.data.length; p += 4, p1 += 1) {
		                    pData.data[p + 0] = (this._pBufferMap[i][p1] / 0xFFFFFFFF) * 255;
		                    pData.data[p + 1] = (this._pBufferMap[i][p1] / 0xFFFFFFFF) * 255;
		                    pData.data[p + 2] = (this._pBufferMap[i][p1] / 0xFFFFFFFF) * 255;
		                    pData.data[p + 3] = 255;
		                }

		            }
		            else {
		                for (var p: uint = 0, p1: uint = 0; p < pData.data.length; p += 4, p1 += 0.5) {
		                    pData.data[p + 0] = (this._pBufferMap[i][Math.round(p1)] / 0xFFFFFFFF) * 255;
		                    pData.data[p + 1] = (this._pBufferMap[i][Math.round(p1)] / 0xFFFFFFFF) * 255;
		                    pData.data[p + 2] = (this._pBufferMap[i][Math.round(p1)] / 0xFFFFFFFF) * 255;
		                    pData.data[p + 3] = 255;
		                    if (p % (8 * 64) == 0 && p != 0) {
		                        p1 -= (32)
		                    }
		                }


		            }
		            c2d.putImageData(pData, 0, 0);


		            if (i != 0) {

		                iTexInBufX = Math.round(fTexCourdX * this.getWidthOrig(i) - this._iTextureWidth / 2);
		                iTexInBufY = Math.round(fTexCourdY * this.getHeightOrig(i) - this._iTextureHeight / 2);
		                iTexInBufX -= this._pXY[i].iX;
		                iTexInBufY -= this._pXY[i].iY;
		                c2d.strokeStyle = '#f00';
		                c2d.lineWidth = 1;
		                c2d.strokeRect(Math.floor(iTexInBufX / (32)) - 1, Math.floor(iTexInBufY / (32)) - 1,
		                               Math.floor(this._iTextureWidth / (32)) + 2, Math.floor(this._iTextureHeight / (32)) + 2);
		            }

		        }
		    }
		    MegaTexture.fTexCourdXOld = fTexCourdX;
		    MegaTexture.fTexCourdYOld = fTexCourdY;
		}

		applyForRender(pSnapshot): void {
		    pSnapshot.setParameterBySemantic('CAMERA_COORD', this._v2fCameraCoord);
		    for (var i: uint = 0; i < this._pTexures.length; i++) {
				pSnapshot.setParameter('textureCoord'+ i, [this._pXY[i].iTexX, this._pXY[i].iTexY])
		        pSnapshot.setParameter('textureTerrainIsLoaded' + i, this._pXY[i].isLoaded);
		        pSnapshot.applyTextureBySemantic("TEXTURE" + i, this._pTexures[i]);
		    }
		}

		setBufferMapNULL(pBuffer): void {
			pBuffer.set(this._pMapDataNULL, 0);
		}

		setData(pBuffer, iX: uint, iY: uint, iWidth: uint, iHeight: uint, pBufferIn, iInX: uint, iInY: uint, iInWidth: uint, iInHeight: uint, iBlockWidth: uint, iBlockHeight: uint, iComponents: uint): void {
			iBlockHeight = Math.max(0, iBlockHeight);
			iBlockWidth  = Math.max(0, iBlockWidth);
			iBlockHeight = Math.min(iBlockHeight, iHeight - iY, iInHeight - iInY);
			iBlockWidth  = Math.min(iBlockWidth, iWidth - iX, iInWidth - iInX);

			if (pBuffer.length < ((iY + iBlockHeight - 1) * iWidth + iX + iBlockWidth) * iComponents) {
			    trace(pBuffer.length, iX, iY, iBlockWidth, iBlockHeight, iWidth, iHeight, iComponents);
			    trace(pBuffer.length, ((iY + iBlockHeight - 1) * iWidth + iX + iBlockWidth) * iComponents);
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
			iBlockHeight = Math.max(0, iBlockHeight);
			iBlockWidth = Math.max(0, iBlockWidth);
			iBlockHeight = Math.min(iBlockHeight, iHeight - iY, iInHeight - iInY);
			iBlockWidth = Math.min(iBlockWidth, iWidth - iX, iInWidth - iInX);

			if (pBuffer.length < ((iY + iBlockHeight - 1) * iWidth + iX + iBlockWidth) * iComponents) {
			    trace(pBuffer.length, iX, iY, iBlockWidth, iBlockHeight, iWidth, iHeight, iComponents);
			    trace(pBuffer.length, ((iY + iBlockHeight - 1) * iWidth + iX + iBlockWidth) * iComponents);
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
		    var iComponents: uint = a.getIFormatNumElements(this._eTextureType);
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
		    var iComponents: uint  = a.getIFormatNumElements(this._eTextureType);
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
		    this.setDataT(pBuffer, iX, iY, iWidth, iHeight, pBufferIn, iInX, iInY, iInWidth, iInHeight, iBlockWidth,
		  
		}

		getWidthOrig(iLevel: uint): uint {
			return this._iTextureWidth << iLevel;
		}

		getHeightOrig(iLevel: uint): uint {
			return this._iTextureHeight << iLevel;
		}

		getDataFromServer(iLevelTex: uint, iOrigTexX: uint, iOrigTexY: uint, iWidth: uint, iHeight: uint, iAreaX: uint, iAreaY: uint, iAreaWidth: uint, iAreaHeight: uint): void {
		    var iOrigTexEndX: uint = Math.ceil((iOrigTexX + iWidth) / this._iBlockSize) * this._iBlockSize;
		    var iOrigTexEndY: uint = Math.ceil((iOrigTexY + iHeight) / this._iBlockSize) * this._iBlockSize;
		    iOrigTexX = Math.max(0, iOrigTexX);
		    iOrigTexY = Math.max(0, iOrigTexY);
		    iOrigTexX = Math.floor(iOrigTexX / this._iBlockSize) * this._iBlockSize;
		    iOrigTexY = Math.floor(iOrigTexY / this._iBlockSize) * this._iBlockSize;
		    iOrigTexEndX = Math.min(iOrigTexEndX, this.getWidthOrig(iLevelTex));
		    iOrigTexEndY = Math.min(iOrigTexEndY, this.getHeightOrig(iLevelTex));

		    var iAreaEndX: uint = iAreaX + iAreaWidth;
		    var iAreaEndY: uint = iAreaY + iAreaHeight;
		    iAreaX = Math.max(0, iAreaX);
		    iAreaY = Math.max(0, iAreaY);
		    iAreaEndX = Math.min(iAreaEndX, this.getWidthOrig(iLevelTex));
		    iAreaEndY = Math.min(iAreaEndY, this.getHeightOrig(iLevelTex));
		    var isLoaded: uint = true;

		    //trace("Кординаты внутри оригинальной текстуре",iOrigTexX,iOrigTexY,iOrigTexEndX,iOrigTexEndY,iLevelTex);
		    var me: IMegaTexture = this;
		    var tCurrentTime = (me._pEngine.fTime * 1000) >>> 0;

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

		            (function (iLev: uint, iX: uint, iY: uint) {
		                var sPiecePath: string = me._sSurfaceTextures;
		                //trace("Путь",sPiecePath);
		                /*a.fopen('filesystem://temporary/'+sPiecePath, 'rb').read(
		                 function(pData) {
		                 //trace('file exists in local storage:',pData);
		                 //console.log(sPiecePath);
		                 var pData8=new Uint8Array(pData);
		                 me._setDataFromBlock(me._pBuffer[iLevelTex],iX-me._pXY[iLevelTex].iX,iY-me._pXY[iLevelTex].iY,pData8);
		                 me._pXY[iLevelTex].isUpdated=true;
		                 },
		                 function ()
		                 {
		                 //trace('file not found... Load from server');*/
		                //console.log("=>", me._sSurfaceTextures)
		                me._pRPC.proc('getMegaTexture', me._sSurfaceTextures, me.getWidthOrig(iLev), me.getHeightOrig(iLev), iX,
		                              iY, me._iBlockSize, me._iBlockSize, me._eTextureType,
		                              function (pData) {
		                                  //console.log("<=")
		                                  //console.log(pData);
		                                  var pData8: Uint8Array = new Uint8Array(pData);
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

		                                  me._setDataFromBlock(me._pBuffer[iLev], iXBuf, iYBuf, pData8);

		                                  me._pXY[iLev].isUpdated = true;
		                                  //a.fopen('filesystem://temporary/'+sPiecePath, 'wb').write(pData8);
		                              });
		                //	}
		                //);
		            })(iLevelTex, j, i);

		        }
		    }

		    me._pXY[iLevelTex].isLoaded = isLoaded;
		}
	}
}

#endif



