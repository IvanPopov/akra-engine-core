function MegaTexture (pEngine,pObject,sSurfaceTextures)
{
	this._pEngine = pEngine;
	this._pDevice = pEngine.pDevice;

	this._pObject=pObject;
	this._pWorldExtents=pObject.worldExtents();

	var pPathInfo=new a.Pathinfo(sSurfaceTextures);
	//Путь откуда запрашиваются куски текстуры
	this._sSurfaceTextures =(pPathInfo.dirname)+"/"+(pPathInfo.filename)+"/";

	//Маскимальный размер стороны текстуры
	this._iOriginalTextureMaxSize=32768;

	//Размер блока текстуры(минимальный размер выгружаемого куска текстуры)
	this._iBlockSize=32;

	//Тип хранимых тектсур
	this._eTextureType=a.IFORMATSHORT.RGB;
	this._iTextureHeight = 1024;
	this._iTextureWidth  = 1024;
	var iCountTex=Math.log2(this._iOriginalTextureMaxSize/Math.max(this._iTextureHeight,this._iTextureWidth))+1;
	this._pTexures = new Array(iCountTex);

	//Буффер, который в два раза шире МегаТекстур, используется что бы заранее подгружать чуть больше чем нужно для текущего отображения,
	//дает возможность начинать выгружать данные чуть раньше чем они понадобяться и в тож время сохраняет некий кеш,
	//чтобы в случае возвращения на старую точку не перзагружать что недавно использовалось
	this._iBufferHeight  = this._iTextureHeight*2;
	this._iBufferWidth   = this._iTextureWidth*2;
	this._pBuffer  = new Array(iCountTex);
	this._pBufferMap = new Array(iCountTex);//Карта с разметкой буфера, чтобы знать какой части буффер уже отсылалось задание на заполнение

	//Создаем куски мегатекстуры
	for(var i=0;i<this._pTexures.length;i++)
	{
		this._pTexures[i]=new a.Texture(this._pEngine);
		this._pTexures[i].createTexture(this._iTextureWidth,this._iTextureHeight,undefined, a.getIFormatNumElements(this._eTextureType));
		if(i==0)
		{
			this._pBuffer[i]=new Uint8Array(this._iTextureHeight*this._iTextureWidth*a.getIFormatNumElements(this._eTextureType));
			//Худшего качества статична поэтому размер у буфера такойже как у текстуры this._iBlockSize
		}
		else
		{
			this._pBuffer[i]=new Uint8Array(this._iBufferHeight*this._iBufferWidth*a.getIFormatNumElements(this._eTextureType));
			this._pBufferMap[i]=new Array(this._iBufferHeight*this._iBufferWidth/(this._iBlockSize*this._iBlockSize));
			this._pBufferMap[i].set(0);
		}
		this._pBuffer[i].iX=0; //Координты буфера в основной текстуре, для простыты должны быть кратну размеру блока
		this._pBuffer[i].iY=0;
		this._pBuffer[i].isUpdated=true;//Произошло ли обноление буфера
	}

	//Всякие темповые буферы
	this._pDataFor=new Uint8Array(this._iBufferWidth*this._iBufferHeight*a.getIFormatNumElements(this._eTextureType));
	this._pMapDataFor=new Array(this._iBufferHeight*this._iBufferWidth/(this._iBlockSize*this._iBlockSize));
	this._pMapDataFor.set(0);

	this.getDataFromServer(0,0,0,this._iTextureWidth,this._iTextureHeight);
}

//Подготовка к рендерингу, а имменно,
// выичсление координат камеры над объектом
// заполнения буфера под мегатекстурой и его передвижение
// закладка новых частей текстру в мегатекстуру



STATIC(MegaTexture,fTexCourdXOld,undefined);
STATIC(MegaTexture,fTexCourdYOld,undefined);
STATIC(MegaTexture,nCountRender,0);
MegaTexture.prototype.prepareForRender= function()
{
	var pCamera = this._pEngine._pDefaultCamera;
	var v3fCameraPosition=pCamera.worldPosition();


	//Вычисление текстурных координат над которыми находиться камера
	var fTexCourdX=(v3fCameraPosition.x-this._pWorldExtents.fX0)/Math.abs(this._pWorldExtents.fX1-this._pWorldExtents.fX0);
	var fTexCourdY=(v3fCameraPosition.y-this._pWorldExtents.fY0)/Math.abs(this._pWorldExtents.fY1-this._pWorldExtents.fY0);

	this._v2fCameraCoord.set(fTexCourdX,fTexCourdY);

	var iX,iX1,iX2;
	var iY,iY1,iY2;
	var iWidth,iHeight;


	//Нужно ли перекладвывать, отсавим на запас 8 блоков

	//Опираемся на текстуру самого хорошего разрешения
	iX=Math.round(fTexcourdX*(this.getWidthOrig(this._pTexures.length-1))-this._iTextureWidth /2);
	iY=Math.round(fTexcourdY*(this.getHeightOrig(this._pTexures.length-1))-this._iTextureHeight/2);
	iWidth =this._iTextureWidth;
	iHeight=this._iTextureHeight;

	if(	Math.floor((iX-this._pBufferMap[i].iX)/this._iBlockSize)<8
		||Math.floor((iY-this._pBufferMap[i].iY)/this._iBlockSize)<8
		||Math.floor((this._pBufferMap[i].iX+this._iTextureWidth-iX)/this._iBlockSize<8)
		||Math.floor((this._pBufferMap[i].iY+this._iTextureHeight-iY)/this._iBlockSize<8))
	{
		//Перемещаем
		for(i=1;i<this._pTexures.length;i++)
		{
			//Вычисляем новые координаты буфера в текстуре
			var iXnew=Math.round(fTexcourdX*this.getWidthOrig(i)-this._iTextureWidth /2);
			var iYnew=Math.round(fTexcourdY*this.getHeightOrig(i)-this._iTextureHeight/2);
			//Округлили на размер блока
			iXnew=Math.round((iXnew/this._iBlockSize))*this._iBlockSize;
			iYnew=Math.round((iYnew/this._iBlockSize))*this._iBlockSize;
			//Копирование совпадающего куска

			var iXOverlappingBlockInOldBuf=iXnew-this._pBufferMap[i].iX;
			var iYOverlappingBlockInOldBuf=iYnew-this._pBufferMap[i].iY;
			var iXOverlappingBlockInNewBuf=-iXOverlappingBlockInOldBuf;
			var iYOverlappingBlockInNewBuf=-iYOverlappingBlockInOldBuf;

			iXOverlappingBlockInOldBuf=max(0,iXOverlappingBlockInOldBuf);
			iYOverlappingBlockInOldBuf=max(0,iYOverlappingBlockInOldBuf);
			iXOverlappingBlockInNewBuf=max(0,iXOverlappingBlockInNewBuf);
			iYOverlappingBlockInNewBuf=max(0,iYOverlappingBlockInNewBuf);

			if(iXOverlappingBlockInOldBuf<this._iBufferWidth&&iYOverlappingBlockInOldBuf<this._iBufferHeight&&
				iXOverlappingBlockInNewBuf<this._iBufferWidth&&iYOverlappingBlockInNewBuf<this._iBufferHeight)
			{
				//произошло совпадение кусков
				var iOverlappingBlockWidth=this._iBufferWidth-iXOverlappingBlockInOldBuf;
				var iOverlappingBlockHeight=this._iBufferHeight-iXOverlappingBlockInOldBuf;
				this._pMapDataFor.set(0);

				//копируем данные
				this._setDataBetweenBuffer(this._pDataFor,iXOverlappingBlockInNewBuf,iYOverlappingBlockInNewBuf,
											this._pBuffer[i],iXOverlappingBlockInOldBuf,iYOverlappingBlockInOldBuf,
											iOverlappingBlockWidth,iOverlappingBlockHeight);
				this._setDataBetweenBufferMap(this._pMapDataFor,iXOverlappingBlockInNewBuf/this._iBlockSize,iYOverlappingBlockInNewBuf/this._iBlockSize,
					this._pBufferMap[i],iXOverlappingBlockInOldBuf/this._iBlockSize,iYOverlappingBlockInOldBuf/this._iBlockSize,
					iOverlappingBlockWidth/this._iBlockSize,iOverlappingBlockHeight/this._iBlockSize);

				var t=this._pBuffer[i];
				this._pBuffer[i]=this._pDataFor;
				this._pDataFor=t;

				this._pBuffer[i].iX=iXnew;
				this._pBuffer[i].iY=iYnew;
				this._pBuffer[i].isUpdated=true;

				var t=this._pBufferMap[i];
				this._pBufferMap[i]=this._pMapDataFor;
				this._pMapDataFor=t;
			}

		}
	}

	//Подгрузка части буфера которую ложиться в текстуру + 8 блоков
	//Нулевая статична, поэтому ее не меняем
	for(var i=1;i<this._pTexures.length;i++)
	{
		iX=Math.round(fTexcourdX*this.getWidthOrig(i)-this._iTextureWidth/2);
		iY=Math.round(fTexcourdY*this.getHeightOrig(i)-this._iTextureHeight/2);
		iWidth =this._iTextureWidth;
		iHeight=this._iTextureHeight;
		//На данный момент нужен кусок текстуры таких размеров iX1,iY1,iWidth,iHeight,

		//Обрезаемся чтобы не вылезти за пределы
		iX1=Math.max(iX,0)
		iY1=Math.max(iY,0)

		iX2=Math.min(iX+this._iTextureWidth,this.getWidthOrig(i));
		iY2=Math.min(iY+this._iTextureHeight,this.getHeightOrig(i));

		//Смотрим попадаем ли мы в текущий буфер
		if(iX1>=this._pBuffer[i].iX
			&&iY1>=this._pBuffer[i].iY
			&&iX2<this._pBuffer[i].iX+this._iBufferWidth
			&&iY2<this._pBuffer[i].iX+this._iBufferHeight)
		{
			//Типа попали
			//Значит нужно загрузить необходимые куски
			this.getDataFromServer(i,iX1,iY1,iX2-iX1,iY2-iY1);

		}
		else
		{
			debug_error("Не может такого быть чтобы буфер не попал под текстуру");
		}


	}

	if(((nCountRender++)%10)==0)
	{
		var iTexInBufX=0;
		var iTexInBufY=0;

		i=(Math.round(nCountRender/10))%this._pBuffer.length;

		if(i==0)
		{
			if(this._pBuffer[i].isUpdated==true)
			{
				this._pTexures[i].setPixelRGBA(0,0,this._iTextureWidth,this._iTextureHeight,this._pBuffer[0]);
			}
		}
		else
		{
			if(this._pBuffer[i].isUpdated==true||static.fTexCourdXOld!=fTexCourdX||static.fTexCourdYOld!=fTexCourdY)
			{
				iTexInBufX=Math.round(fTexcourdX*this.getWidthOrig(i)-this._iTextureWidth /2);
				iTexInBufY=Math.round(fTexcourdY*this.getHeightOrig(i)-this._iTextureHeight/2);
				iTexInBufX-=this._pBuffer[i].iX;
				iTexInBufY-=this._pBuffer[i].iY;


				this.setData(this._pDataFor,0,0,this._iTextureWidth,this._iTextureHeight,
							this._pBuffer[i],iTexInBufX,iTexInBufY,this._iBufferWidth,this._iBufferHeight,
							this._iTextureWidth,this._iTextureHeight,a.getIFormatNumElements(this._eTextureType));
				this._pTexures[i].setPixelRGBA(0,0,this._iTextureWidth,this._iTextureHeight,this._pDataFor);
			}
		}
		this._pBuffer[i].isUpdated=false;
	}


	static.fTexCourdXOld=fTexCourdX;
	static.fTexCourdYOld=fTexCourdY;
}


//Применение параметров для рендеринга, коготрые зависят от самого терраина
MegaTexture.prototype.applyForRender= function()
{
	this._pEngine.pDrawTerrainProgram.applyVector2('cameraCoordTerrain', this._v2fCameraCoord);
	for(var i=0;i<this._pTexures.length;i++)
	{
		this._pTexures[i].activate(2+i);
		this._pEngine.pDrawTerrainProgram.applyInt('textureTerrain'+i,2+i);
	}
}

MegaTexture.prototype.setData=function (pBuffer,iX,iY,iWidth,iHeight,pBufferIn,iInX,iInY,iInWidth,iInHeight,iBlockWidth,iBlockHeight,iComponents)
{
	iBlockHeight=Math.max(0,iBlockHeight);
	iBlockWidth=Math.max(0,iBlockWidth);
	iBlockHeight=Math.min(iBlockHeight,iHeight-iX,iInHeight-iInX);
	iBlockWidth=Math.min(iBlockWidth,iWidth-iY,iInWidth-iInY);

	if(pBuffer.length<((iY+iBlockHeight)*iWidth+iX+iBlockWidth+1)*iComponents)
	{
		console.log("Выход за предел массива 1");
	}
	if(pBufferIn.length<((iInY+iBlockHeight)*iInWidth+iInX+iBlockWidth+1)*iComponents)
	{
		console.log("Выход за предел массива 2");
	}


	for(var i=0;i<iBlockHeight;i++)
	{
		for(var j=0;j<iBlockWidth;j++)
		{
			for(var k=0;k<iComponents;k++)
			{
				pBuffer[((iY+i)*iWidth+iX+j)*iComponents+k]=pBufferIn[((iInY+i)*iInWidth+iInX+j)*iComponents+k];
			}
		}
	}
};

MegaTexture.prototype._setDataBetweenBuffer=function (pBuffer,iX,iY,pBufferIn,iInX,iInY,iBlockWidth,iBlockHeight)
{
	var iInWidth=this._iBufferWidth;
	var iInHeight=this._iBufferHeight;
	var iComponents =a.getIFormatNumElements(this._eTextureType);
	var iWidth=this._iBufferWidth;
	var iHeight=this._iBufferHeight;
	this.setData(pBuffer,iX,iY,iWidth,iHeight,pBufferIn,iInX,iInY,iInWidth,iInHeight,iBlockWidth,iBlockHeight,iComponents);
}

MegaTexture.prototype._setDataBetweenBufferMap=function (pBuffer,iX,iY,pBufferIn,iInX,iInY,iBlockWidth,iBlockHeight)
{
	var iInWidth=this._iBufferWidth/this._iBlockSize;
	var iInHeight=this._iBufferHeight/this._iBlockSize;
	var iComponents = 1;
	var iWidth=this._iBufferWidth/this._iBlockSize;
	var iHeight=this._iBufferHeight/this._iBlockSize;
	this.setData(pBuffer,iX,iY,iWidth,iHeight,pBufferIn,iInX,iInY,iInWidth,iInHeight,iBlockWidth,iBlockHeight,iComponents);
}

MegaTexture.prototype._setDataFromBlock=function (pBuffer,iX,iY,pBufferIn)
{
	var iInX=0;
	var iInY=0;
	var iInWidth=this._iBlockSize;
	var iInHeight=this._iBlockSize;
	var iBlockWidth =this._iBlockSize;
	var iBlockHeight=this._iBlockSize;
	var iComponents =a.getIFormatNumElements(this._eTextureType);
	var iWidth=this._iBufferWidth;
	var iHeight=this._iBufferHeight;
	this.setData (pBuffer,iX,iY,iWidth,iHeight,pBufferIn,iInX,iInY,iInWidth,iInHeight,iBlockWidth,iBlockHeight,iComponents);
}

MegaTexture.prototype.getWidthOrig=function(iLevel)
{
	return this._iTextureWidth <<iLevel;
}

MegaTexture.prototype.getHeightOrig=function(iLevel)
{
	return this._iTextureHeight <<iLevel;
}


MegaTexture.prototype.getDataFromServer=function(iLevelTex,iOrigTexX,iOrigTexY,iWidth,iHeight)
{
	iOrigTexX=Math.max(0,iOrigTexX);
	iOrigTexY=Math.max(0,iOrigTexY);
	iOrigTexX=Math.floor(iOrigTexX/this._iBlockSize)*this._iBlockSize;
	iOrigTexY=Math.floor(iOrigTexY/this._iBlockSize)*this._iBlockSize;


	var iOrigTexEndX=Math.floor((iOrigTexX+iWidth)/this._iBlockSize)*this._iBlockSize;
	var iOrigTexEndY=Math.floor((iOrigTexY+iHeight)/this._iBlockSize)*this._iBlockSize;
	iOrigTexEndX=Math.min(iOrigTexEndX,this.getWidthOrig(iLevelTex));
	iOrigTexEndY=Math.min(iOrigTexEndY,this.getHeightOrig(iLevelTex));


	me=this;
	for(var i=iOrigTexY;i<this.iOrigTexEndY;i+=this._iBlockSize)
	{
		for(var j=iOrigTexX;j<this.iOrigTexEndX;j+=this._iBlockSize)
		{
			if(iLevelTex==0)
			{

			}
			else
			{
				if(me._pBufferMap[(i-me._pBuffer[iLevelTex].iY)/me._iBlockSize*(me._iBufferHeight/me._iBlockSize)+(j-me._pBuffer[iLevelTex].iX)/me._iBlockSize]==1)
				{
					break;
				}
				me._pBufferMap[(i-me._pBuffer[iLevelTex].iY)/me._iBlockSize*(me._iBufferHeight/me._iBlockSize)+(j-me._pBuffer[iLevelTex].iX)/me._iBlockSize]=1;
			}
			(function(iX,iY,sPath)
			{
				var sPiecePath=me._sSurfaceTextures+ a.IFormatShortToString(me._eTextureType)+me.getWidthOrig(iLevelTex)+"x"+me.getHeightOrig(iLevelTex)+"_"+iX+"x"+iY+"_"+me._iBlockSize+"x"+me._iBlockSize;
				a.fopen('filesystem://temporary/'+sPiecePath, 'rb').read(
					function(pData) {
						//trace('file exists in local storage:');
						//console.log(sPath);
						var pData8=new Uint8Array(pData);
						me._setDataFromBlock(me._pBuffer[iLevelTex],iX-me._pBuffer[iLevelTex].iX,iY-me._pBuffer[iLevelTex].iY,pData8);
						me._pBuffer[iLevelTex].isUpdated=true;
					},
					function ()
					{
						//trace('file not found... Load from server');
						rpc.proc('getMegaTexture', me._sSurfaceTextures,me.getWidthOrig(iLevelTex),me.getHeightOrig(iLevelTex),iX,iY,me._iBlockSize,me._iBlockSize,me._eTextureType,
							function (pData)
							{
								//console.log(iX,iY);
								var pData8=new Uint8Array(pData);
								me._setDataFromBlock(me._pBuffer[iLevelTex],iX-me._pBuffer[iLevelTex].iX,iY-me._pBuffer[iLevelTex].iY,pData8);
								me._pBuffer[iLevelTex].isUpdated=true;
								a.fopen('filesystem://temporary/'+sPiecePath, 'wb').write(pData8);
							});
					}
				);
			})(j,i,sPiecePath);

		}
	}
}





