function MegaTexture(pEngine, pObject, sSurfaceTextures) {
    this._pEngine = pEngine;
    this._pDevice = pEngine.pDevice;

    this._pObject = pObject;
    this._pWorldExtents = pObject.worldExtents();
    this._v2fCameraCoord = new Vec2(0, 0); //Координаты камеры на объекте

    //Путь откуда запрашиваются куски текстуры
    this._sSurfaceTextures = sSurfaceTextures;

    //Маскимальный размер стороны текстуры
    this._iOriginalTextureMaxSize = 8192;
    //this._iOriginalTextureMaxSize=32768;

    //Размер блока текстуры(минимальный размер выгружаемого куска текстуры)
    this._iBlockSize = 32;

    //Тип хранимых тектсур
    this._eTextureType = a.IFORMATSHORT.RGB;
    this._iTextureHeight = 1024;
    this._iTextureWidth = 1024;
    var iCountTex = Math.log2(this._iOriginalTextureMaxSize / Math.max(this._iTextureHeight, this._iTextureWidth)) + 1;
    this._pTexures = new Array(iCountTex);

    //Буффер, который в два раза шире МегаТекстур, используется что бы заранее подгружать чуть больше чем нужно для текущего отображения,
    //дает возможность начинать выгружать данные чуть раньше чем они понадобяться и в тож время сохраняет некий кеш,
    //чтобы в случае возвращения на старую точку не перзагружать что недавно использовалось
    this._iBufferHeight = this._iTextureHeight * 2;
    this._iBufferWidth = this._iTextureWidth * 2;
    this._pBuffer = new Array(iCountTex);
    this._pBufferMap = new Array(iCountTex);//Карта с разметкой буфера, чтобы знать какой части буффер уже отсылалось задание на заполнение
    this._pXY = new Array(iCountTex);

    //Всякие темповые буферы
    this._pDataFor = new Uint8Array(this._iBufferWidth * this._iBufferHeight *
                                    a.getIFormatNumElements(this._eTextureType));
    this._pMapDataFor = new Uint32Array(this._iBufferHeight * this._iBufferWidth /
                                        (this._iBlockSize * this._iBlockSize));
    this._pMapDataNULL = new Uint32Array(this._iBufferHeight * this._iBufferWidth /
                                         (this._iBlockSize * this._iBlockSize));
    for (var i = 0; i < this._pMapDataNULL.length; i++) {
        this._pMapDataNULL[i] = 0;
    }
    this.setBufferMapNULL(this._pMapDataFor);

    //Создаем куски мегатекстуры
    for (var i = 0; i < this._pTexures.length; i++) {
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
        }
        else {
            this._pBuffer[i] = new Uint8Array(this._iBufferHeight * this._iBufferWidth *
                                              a.getIFormatNumElements(this._eTextureType));
            this._pBufferMap[i] = new Uint32Array(this._iBufferHeight * this._iBufferWidth /
                                                  (this._iBlockSize * this._iBlockSize));
            this.setBufferMapNULL(this._pBufferMap[i]);
        }
        this._pXY[i] = {iX : 0, iY : 0,//Координты буфера в основной текстуре, для простыты должны быть кратну размеру блока
			iTexX:0, iTexY:0,   //Координаты мегатекстуры в текстуре
			isUpdated : true, isLoaded : false};
    }
	//console.log("!!!!!!!!!!!!!!!!!!!!===>>>>>");
    this._pRPC = new a.NET.RPC('ws://192.168.194.132');
    this.getDataFromServer(0, 0, 0, this._iTextureWidth, this._iTextureHeight);
}

//Подготовка к рендерингу, а имменно,
// выичсление координат камеры над объектом
// заполнения буфера под мегатекстурой и его передвижение
// закладка новых частей текстру в мегатекстуру


STATIC(MegaTexture, fTexCourdXOld, undefined);
STATIC(MegaTexture, fTexCourdYOld, undefined);
STATIC(MegaTexture, nCountRender, 0);
MegaTexture.prototype.prepareForRender = function () {
    var pCamera = this._pEngine.getActiveCamera();
    var v3fCameraPosition = pCamera.worldPosition();


    //Вычисление текстурных координат над которыми находиться камера
    var fTexCourdX = (v3fCameraPosition.x - this._pWorldExtents.fX0) /
                     Math.abs(this._pWorldExtents.fX1 - this._pWorldExtents.fX0);
    var fTexCourdY = (v3fCameraPosition.y - this._pWorldExtents.fY0) /
                     Math.abs(this._pWorldExtents.fY1 - this._pWorldExtents.fY0);

    this._v2fCameraCoord.set(fTexCourdX, fTexCourdY);

    var iX, iX1, iX2;
    var iY, iY1, iY2;
    var iWidth, iHeight;


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
            var iXnew = Math.round(fTexCourdX * this.getWidthOrig(i) - this._iTextureWidth / 2);
            var iYnew = Math.round(fTexCourdY * this.getHeightOrig(i) - this._iTextureHeight / 2);

            iXnew -= (this._iBufferWidth - this._iTextureWidth) / 2;
            iYnew -= (this._iBufferHeight - this._iTextureHeight) / 2;

            //Округлили на размер блока
            iXnew = Math.round((iXnew / this._iBlockSize)) * this._iBlockSize;
            iYnew = Math.round((iYnew / this._iBlockSize)) * this._iBlockSize;
            //Копирование совпадающего куска

            var iXOverlappingBlockInOldBuf = iXnew - this._pXY[i].iX;
            var iYOverlappingBlockInOldBuf = iYnew - this._pXY[i].iY;
            var iXOverlappingBlockInNewBuf = -iXOverlappingBlockInOldBuf;
            var iYOverlappingBlockInNewBuf = -iYOverlappingBlockInOldBuf;

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
                var iOverlappingBlockWidth = this._iBufferWidth - Math.abs(iXnew - this._pXY[i].iX);
                var iOverlappingBlockHeight = this._iBufferHeight - Math.abs(iYnew - this._pXY[i].iY);


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

                var t = this._pBuffer[i];
                this._pBuffer[i] = this._pDataFor;
                this._pDataFor = t;

                var t = this._pBufferMap[i];
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
    for (var i = 0; i < this._pTexures.length; i++) {


        if (i != 0) {
            iX = Math.round(fTexCourdX * this.getWidthOrig(i) - this._iTextureWidth / 2);
            iY = Math.round(fTexCourdY * this.getHeightOrig(i) - this._iTextureHeight / 2);

            iWidth = this._iTextureWidth;
            iHeight = this._iTextureHeight;
            //На данный момент нужен кусок текстуры таких размеров iX1,iY1,iWidth,iHeight,

            var iAreaX1 = iX;
            var iAreaY1 = iY;
            var iAreaX2 = iX + iWidth;
            var iAreaY2 = iY + iHeight;

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

                var iAreaX1 = Math.clamp(iAreaX1, 0, this.getWidthOrig(i));
                var iAreaY1 = Math.clamp(iAreaY1, 0, this.getHeightOrig(i));
                var iAreaX2 = Math.clamp(iAreaX2, 0, this.getWidthOrig(i));
                var iAreaY2 = Math.clamp(iAreaY2, 0, this.getHeightOrig(i));

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

    if (((statics.nCountRender++) % 10) == 0) {
        var iTexInBufX = 0;
        var iTexInBufY = 0;

        i = (Math.round(statics.nCountRender / 10)) % this._pBuffer.length;

        if (i == 0) {
            if (this._pXY[i].isUpdated == true) {
                this._pTexures[i].setPixelRGBA(0, 0, this._iTextureWidth, this._iTextureHeight, this._pBuffer[0]);
            }
        }
        else {
            if (this._pXY[i].isLoaded == true &&
                (this._pXY[i].isUpdated == true || statics.fTexCourdXOld != fTexCourdX ||
                 statics.fTexCourdYOld != fTexCourdY)) {
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


    if (((statics.nCountRender++) % 11) == 0) {
        for (var i = 0; i < this._pTexures.length; i++) {

            var c2d = document.getElementById('canvas' + i).getContext("2d");
            var pData = c2d.getImageData(0, 0, 128, 128);


            if (i != 0) {
                //console.log(pData.data.length,this._pBuffer[i][0],this._pBuffer[i][1],this._pBuffer[i][2]);
                for (var p = 0, p1 = 0; p < pData.data.length; p += 4, p1 += 3 * 16) {
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
                for (var p = 0, p1 = 0; p < pData.data.length; p += 4, p1 += 3 * 8) {
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
                for (var p = 0, p1 = 0; p < pData.data.length; p += 4, p1 += 3 * 16) {
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

                for (var p = 0, p1 = 0; p < pData.data.length; p += 4, p1 += 1) {
                    pData.data[p + 0] = (this._pBufferMap[i][p1] / 0xFFFFFFFF) * 255;
                    pData.data[p + 1] = (this._pBufferMap[i][p1] / 0xFFFFFFFF) * 255;
                    pData.data[p + 2] = (this._pBufferMap[i][p1] / 0xFFFFFFFF) * 255;
                    pData.data[p + 3] = 255;
                }

            }
            else {
                for (var p = 0, p1 = 0; p < pData.data.length; p += 4, p1 += 0.5) {
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
    statics.fTexCourdXOld = fTexCourdX;
    statics.fTexCourdYOld = fTexCourdY;
}


//Применение параметров для рендеринга, коготрые зависят от самого терраина
MegaTexture.prototype.applyForRender = function (pSnapshot) {
    pSnapshot.setParameterBySemantic('CAMERA_COORD', this._v2fCameraCoord);
    for (var i = 0; i < this._pTexures.length; i++)
	{
		pSnapshot.setParameter('textureCoord'+ i, [this._pXY[i].iTexX, this._pXY[i].iTexY])





        pSnapshot.setParameter('textureTerrainIsLoaded' + i, this._pXY[i].isLoaded);
        pSnapshot.applyTextureBySemantic("TEXTURE" + i, this._pTexures[i]);
    }
};


MegaTexture.prototype.setBufferMapNULL = function (pBuffer) {
    pBuffer.set(this._pMapDataNULL, 0);
}


MegaTexture.prototype.setData = function (pBuffer, iX, iY, iWidth, iHeight, pBufferIn, iInX, iInY, iInWidth, iInHeight,
                                          iBlockWidth, iBlockHeight, iComponents) {
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


    for (var i = 0; i < iBlockHeight; i++) {
        for (var j = 0; j < iBlockWidth; j++) {
            for (var k = 0; k < iComponents; k++) {
                pBuffer[((iY + i) * iWidth + iX + j) * iComponents + k] = pBufferIn[((iInY + i) * iInWidth + iInX + j) *
                                                                                    iComponents + k];
            }
        }
    }

};


MegaTexture.prototype.setDataT = function (pBuffer, iX, iY, iWidth, iHeight, pBufferIn, iInX, iInY, iInWidth, iInHeight,
                                           iBlockWidth, iBlockHeight, iComponents) {
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

    var iLenStr = iBlockWidth * iComponents;
    var iStartIn = 0;
    var iStartOut = 0;
    for (var i = 0; i < iBlockHeight; i++) {
        iStartIn = ((iInY + i) * iInWidth + iInX) * iComponents;
        iStartOut = ((iY + i) * iWidth + iX) * iComponents;

        if (pBufferIn.BYTES_PER_ELEMENT == 8) {
            pBuffer.set(new Float64Array(pBufferIn.buffer.slice(iStartIn * 8, (iStartIn + iLenStr) * 8)), iStartOut);
        }
        else if (pBufferIn.BYTES_PER_ELEMENT == 4) {
            pBuffer.set(new Uint32Array(pBufferIn.buffer.slice(iStartIn * 4, (iStartIn + iLenStr) * 4)), iStartOut);
        }
        else if (pBufferIn.BYTES_PER_ELEMENT == 2) {
            pBuffer.set(new Uint16Array(pBufferIn.buffer.slice(iStartIn * 2, (iStartIn + iLenStr) * 2)), iStartOut);
        }
        else {
            pBuffer.set(new Uint8Array(pBufferIn.buffer.slice(iStartIn, iStartIn + iLenStr)), iStartOut);
        }

    }
};

/*
 var MegaTime_SetDataAll=0;
 var MegaTime_SetDataMax=0;
 var MegaTime_SetDataN=0;*/
MegaTexture.prototype._setData = function (pBuffer, iX, iY, iWidth, iHeight, pBufferIn, iInX, iInY, iInWidth, iInHeight,
                                           iBlockWidth, iBlockHeight, iComponents) {
//	var time=new Date();

    this.setDataT(pBuffer, iX, iY, iWidth, iHeight, pBufferIn, iInX, iInY, iInWidth, iInHeight, iBlockWidth,
                  iBlockHeight, iComponents);
//	time=new Date()-time;
//	MegaTime_SetDataAll+=time;
//	MegaTime_SetDataMax=Math.max(MegaTime_SetDataMax,time);
//	MegaTime_SetDataN++;
//	document.getElementById('setinfo0').innerHTML="_SetData:\n\tAll  : "+MegaTime_SetDataAll+"\n\tCount: "+MegaTime_SetDataN+"\n\tAver : "+(MegaTime_SetDataAll/MegaTime_SetDataN)+"\n\tMax  :"+MegaTime_SetDataMax;

}

//var MegaTime_setDataBetweenBufferAll=0;
//var MegaTime_setDataBetweenBufferMax=0;
//var MegaTime_setDataBetweenBufferN=0;
MegaTexture.prototype._setDataBetweenBuffer = function (pBuffer, iX, iY, pBufferIn, iInX, iInY, iBlockWidth,
                                                        iBlockHeight) {
//	var time=new Date();

    var iInWidth = this._iBufferWidth;
    var iInHeight = this._iBufferHeight;
    var iComponents = a.getIFormatNumElements(this._eTextureType);
    var iWidth = this._iBufferWidth;
    var iHeight = this._iBufferHeight;
    this.setDataT(pBuffer, iX, iY, iWidth, iHeight, pBufferIn, iInX, iInY, iInWidth, iInHeight, iBlockWidth,
                  iBlockHeight, iComponents);

//	time=new Date()-time;
//	MegaTime_setDataBetweenBufferAll+=time;
//	MegaTime_setDataBetweenBufferMax=Math.max(MegaTime_setDataBetweenBufferMax,time);
//	MegaTime_setDataBetweenBufferN++;
//	document.getElementById('setinfo1').innerHTML="_setDataBetweenBuffer:"+
//		"\n\tAll  : "+MegaTime_setDataBetweenBufferAll+
//		"\n\tCount: "+MegaTime_setDataBetweenBufferN+
//		"\n\tAver : "+(MegaTime_setDataBetweenBufferAll/MegaTime_setDataBetweenBufferN)+
//		"\n\tMax  : "+MegaTime_setDataBetweenBufferMax;

}


//var MegaTime_setDataBetweenBufferMapAll=0;
//var MegaTime_setDataBetweenBufferMapMax=0;
//var MegaTime_setDataBetweenBufferMapN=0;
MegaTexture.prototype._setDataBetweenBufferMap = function (pBuffer, iX, iY, pBufferIn, iInX, iInY, iBlockWidth,
                                                           iBlockHeight) {
    var time = new Date();

    var iInWidth = this._iBufferWidth / this._iBlockSize;
    var iInHeight = this._iBufferHeight / this._iBlockSize;
    var iComponents = 1;
    var iWidth = this._iBufferWidth / this._iBlockSize;
    var iHeight = this._iBufferHeight / this._iBlockSize;
    this.setDataT(pBuffer, iX, iY, iWidth, iHeight, pBufferIn, iInX, iInY, iInWidth, iInHeight, iBlockWidth,
                  iBlockHeight, iComponents);
//	time=new Date()-time;
//	MegaTime_setDataBetweenBufferMapAll+=time;
//	MegaTime_setDataBetweenBufferMapMax=Math.max(MegaTime_setDataBetweenBufferMapMax,time);
//	MegaTime_setDataBetweenBufferMapN++;
//	document.getElementById('setinfo2').innerHTML="_setDataBetweenBufferMap:"+
//		"\n\tAll  : "+ MegaTime_setDataBetweenBufferMapAll+
//		"\n\tCount: "+ MegaTime_setDataBetweenBufferMapN+
//		"\n\tAver : "+(MegaTime_setDataBetweenBufferMapAll/MegaTime_setDataBetweenBufferMapN)+
//		"\n\tMax  : "+ MegaTime_setDataBetweenBufferMapMax;
}


//var MegaTime_setDataFromBlockAll=0;
//var MegaTime_setDataFromBlockMax=0;
//var MegaTime_setDataFromBlockN=0;
MegaTexture.prototype._setDataFromBlock = function (pBuffer, iX, iY, pBufferIn) {


//	var time=new Date();


    var iInX = 0;
    var iInY = 0;
    var iInWidth = this._iBlockSize;
    var iInHeight = this._iBlockSize;
    var iBlockWidth = this._iBlockSize;
    var iBlockHeight = this._iBlockSize;
    var iComponents = a.getIFormatNumElements(this._eTextureType);
    var iWidth = 0;
    var iHeight = 0;
    if (pBuffer.length == this._iBufferWidth * this._iBufferHeight * iComponents) {
        iWidth = this._iBufferWidth;
        iHeight = this._iBufferHeight;
    }
    else if (pBuffer.length == this._iBufferWidth * this._iBufferHeight * iComponents / 4) {
        iWidth = this._iBufferWidth / 2;
        iHeight = this._iBufferHeight / 2;
    }
    else {
        console.log("Странный размер массива", pBuffer, pBuffer.length,
                    this._iBufferWidth * this._iBufferHeight * iComponents,
                    this._iBufferWidth * this._iBufferHeight * iComponents / 4);
    }

    //в хроме бужет рабоать быстрее SetData
    this.setDataT(pBuffer, iX, iY, iWidth, iHeight, pBufferIn, iInX, iInY, iInWidth, iInHeight, iBlockWidth,
                  iBlockHeight, iComponents);

//	time=new Date()-time;
//
//	MegaTime_setDataFromBlockAll+=time;
//	MegaTime_setDataFromBlockMax=Math.max(MegaTime_setDataFromBlockMax,time);
//	MegaTime_setDataFromBlockN++;
//	document.getElementById('setinfo3').innerHTML="_setDataFromBlock:"+
//		"\n\tAll  : "+ MegaTime_setDataFromBlockAll+
//		"\n\tCount: "+ MegaTime_setDataFromBlockN+
//		"\n\tAver : "+(MegaTime_setDataFromBlockAll/MegaTime_setDataFromBlockN)+
//		"\n\tMax  : "+ MegaTime_setDataFromBlockMax;
}


MegaTexture.prototype.getWidthOrig = function (iLevel) {
    return this._iTextureWidth << iLevel;
}

MegaTexture.prototype.getHeightOrig = function (iLevel) {
    return this._iTextureHeight << iLevel;
}


MegaTexture.prototype.getDataFromServer = function (iLevelTex, iOrigTexX, iOrigTexY, iWidth, iHeight, iAreaX, iAreaY,
                                                    iAreaWidth, iAreaHeight) {
    //trace("getDataFromServer");

    var iOrigTexEndX = Math.ceil((iOrigTexX + iWidth) / this._iBlockSize) * this._iBlockSize;
    var iOrigTexEndY = Math.ceil((iOrigTexY + iHeight) / this._iBlockSize) * this._iBlockSize;
    iOrigTexX = Math.max(0, iOrigTexX);
    iOrigTexY = Math.max(0, iOrigTexY);
    iOrigTexX = Math.floor(iOrigTexX / this._iBlockSize) * this._iBlockSize;
    iOrigTexY = Math.floor(iOrigTexY / this._iBlockSize) * this._iBlockSize;
    iOrigTexEndX = Math.min(iOrigTexEndX, this.getWidthOrig(iLevelTex));
    iOrigTexEndY = Math.min(iOrigTexEndY, this.getHeightOrig(iLevelTex));

    var iAreaEndX = iAreaX + iAreaWidth;
    var iAreaEndY = iAreaY + iAreaHeight;
    iAreaX = Math.max(0, iAreaX);
    iAreaY = Math.max(0, iAreaY);
    iAreaEndX = Math.min(iAreaEndX, this.getWidthOrig(iLevelTex));
    iAreaEndY = Math.min(iAreaEndY, this.getHeightOrig(iLevelTex));
    var isLoaded = true;

    //trace("Кординаты внутри оригинальной текстуре",iOrigTexX,iOrigTexY,iOrigTexEndX,iOrigTexEndY,iLevelTex);
    var me = this;
    var tCurrentTime = (me._pEngine.fTime * 1000) >>> 0;

//	if(iLevelTex==2)
//	{
//		trace(iOrigTexX,iOrigTexY,iOrigTexEndX,iOrigTexEndY,"(",me._pXY[iLevelTex].iX,me._pXY[iLevelTex].iY,")");
//	}


    for (var i = iOrigTexY; i < iOrigTexEndY; i += this._iBlockSize) {
        for (var j = iOrigTexX; j < iOrigTexEndX; j += this._iBlockSize) {
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
            }
            else {

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

            (function (iLev, iX, iY) {
                var sPiecePath = me._sSurfaceTextures;
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
                                  var pData8 = new Uint8Array(pData);
                                  //console.log(me._pBuffer[iLevelTex].length,iX-me._pXY[iLevelTex].iX,iY-me._pXY[iLevelTex].iY);
                                  var iXBuf;
                                  var iYBuf;
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

a.MegaTexture = MegaTexture;

