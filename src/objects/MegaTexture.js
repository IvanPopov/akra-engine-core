function Texture (pEngine,pObject,sSurfaceTextures)
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

	var sPiecePath;
	var me=this;


	//Заливаем текстуру самого плохого разрешения
	for(var i=0;i<this._iTextureHeight;i+=this._iBlockSize)
	{
		for(var j=0;j<this._iTextureWidth;j+=this._iBlockSize)
		{
			sPiecePath=this._sSurfaceTextures+"RGB_"+this._iTextureWidth+"x"+this._iTextureWidth+"_"+j+"x"+i+"_"+this._iBlockSize+"x"+this._iBlockSize;


			(function(iX,iY,sPath)
			{
				a.fopen('filesystem://temporary/'+sPath, 'rb').read(
					function(pData) {
						//trace('file exists in local storage:');
						//console.log(sPath);
						var pData8=new Uint8Array(pData);
						for(var k=0;k<me._iBlockSize;k++)
						{
							for(var l=0;l<me._iBlockSize;l++)
							{
								for(var t=0;t<a.getIFormatNumElements(this._eTextureType);t++)
								{
									me._pBuffer[0][(me._iTextureWidth*(iY+k)+0+iX+l)*a.getIFormatNumElements(this._eTextureType)+t]=pData8[(k*me._iBlockSize+l)*a.getIFormatNumElements(this._eTextureType)+t];
									this._pBuffer[i].isUpdated=true;
								}
							}
						}
					},
					function ()
					{
						//trace('file not found... Load from server');
						a.fopen(sPath, 'rb').onread = function(pData)
						{
							//console.log(iX,iY);
							var pData8=new Uint8Array(pData);
							for(var k=0;k<me._iBlockSize;k++)
							{
								for(var l=0;l<me._iBlockSize;l++)
								{

									for(var t=0;t<a.getIFormatNumElements(this._eTextureType);t++)
									{
										me._pBuffer[0][(me._iTextureWidth*(iY+k)+0+iX+l)*a.getIFormatNumElements(this._eTextureType)+t]=pData8[(k*me._iBlockSize+l)*a.getIFormatNumElements(this._eTextureType)+t];
										this._pBuffer[i].isUpdated=true;
									}
								}
							}
							a.fopen('filesystem://temporary/'+sPath, 'wb').write(pData8);
						}
					}
				);
			})(j,i,sPiecePath);

		}
	}
}

//Подготовка к рендерингу, а имменно,
// выичсление координат камеры над объектом
// заполнения буфера под мегатекстурой и его передвижение
// закладка новых частей текстру в мегатекстуру
Texture.prototype.prepareForRender= function()
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
	iX=Math.round(fTexcourdX*(this._iTextureWidth <<(this._pTexures.length-1))-this._iTextureWidth /2);
	iY=Math.round(fTexcourdY*(this._iTextureHeight<<(this._pTexures.length-1))-this._iTextureHeight/2);
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
			var iXnew=Math.round(fTexcourdX*(this._iTextureWidth <<i)-this._iTextureWidth /2);
			var iYnew=Math.round(fTexcourdY*(this._iTextureHeight<<i)-this._iTextureHeight/2);
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
				for(var c=iYOverlappingBlockInOldBuf/this._iBlockSize, cn=iYOverlappingBlockInNewBuf/this._iBlockSize;c<iOverlappingBlockHeight/this._iBlockSize;c++,cn++)
				{
					for (var d=iXOverlappingBlockInOldBuf/this._iBlockSize, dn=iXOverlappingBlockInNewBuf/this._iBlockSize;d<iOverlappingBlockWidth/this._iBlockSize;d++,dn++)
					{
						this._pMapDataFor[cn*this._iBufferWidth/this._iBlockSize+dn]=this._pBufferMap[i][c*this._iBufferWidth/this._iBlockSize+d];
						for(var l=c*this._iBlockSize, ln=cn*this._iBlockSize;l<c*(this._iBlockSize+1);l++,ln++)
						{
							for(var j=d*this._iBlockSize, jn=dn*this._iBlockSize;j<d*(this._iBlockSize+1);j++,jn++)
							{
								for(var k=0;k<a.getIFormatNumElements(this._eTextureType);k++)
								{
									this._pDataFor[
										(ln*this._iTextureWidth+jn)*a.getIFormatNumElements(this._eTextureType)+k]=
										this._pBuffer[i][
											(l*this._iTextureWidth+j)*a.getIFormatNumElements(this._eTextureType)+k];
								}
							}
						}
					}
				}
				var t=this._pBuffer[i];
				this._pBuffer[i]=this._pDataFor;
				this._pBuffer[i].iX=iXnew;
				this._pBuffer[i].iY=iYnew;
				this._pBuffer[i].isUpdated=true;
				this._pDataFor=t;

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
		iX=Math.round(fTexcourdX*(this._iTextureWidth <<i)-this._iTextureWidth/2);
		iY=Math.round(fTexcourdY*(this._iTextureHeight<<i)-this._iTextureHeight/2);
		iWidth =this._iTextureWidth;
		iHeight=this._iTextureHeight;
		//На данный момент нужен кусок текстуры таких размеров iX1,iY1,iWidth,iHeight,

		//Обрезаемся чтобы не вылезти за пределы
		iX1=Math.max(iX,0)
		iY1=Math.max(iY,0)

		iX2=Math.min(iX+this._iTextureWidth,(this._iTextureWidth <<i));
		iY2=Math.min(iY+this._iTextureHeight,(this._iTextureHeight<<i));

		//Смотрим попадаем ли мы в текущий буфер
		if(iX1>=this._pBuffer[i].iX
			&&iY1>=this._pBuffer[i].iY
			&&iX2<this._pBuffer[i].iX+this._iBufferWidth
			&&iY2<this._pBuffer[i].iX+this._iBufferHeight)
		{
			//Типа попали
			//Значит нужно загрузить необходимые куски
			for(var l=Math.max(0,Math.floor((iY1-this._pBuffer[i].iY)/this._iBlockSize)-8);
				l<=Math.min(Math.floor((iY2-this._pBuffer[i].iY)/this._iBlockSize)+8,this._iBufferHeight/this._iBlockSize);
				l+=1)
			{
				for(var j=Math.max(0,Math.floor((iX1-this._pBuffer[i].iX)/this._iBlockSize)-8);
					j<=Math.min(Math.floor((iX2-this._pBuffer[i].iX)/this._iBlockSize)+8,this._iBufferWidth/this._iBlockSize);
					j+=1)
				{
					if(this._pBufferMap[i][l*(this._iTextureHeight/this._iBlockSize)+j]==0)
					{
						//Загрузить кусок с кординатами [l*this._iBlockSize+this._pBufferMap[i].iX][j*this._iBlockSize+this._pBufferMap[i].iY]
						//Размером в this._iBlockSize на this._iBlockSize
						this._pBufferMap[i][l*(this._iTextureHeight/this._iBlockSize)+j]=1;
					}
				}
			}
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
		var iXdeltaStart=0;
		var iYdeltaStart=0;
		var iXdeltaEnd=0;
		var iYdeltaEnd=0;

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
				iTexInBufX=Math.round(fTexcourdX*(this._iTextureWidth <<i)-this._iTextureWidth /2);
				iTexInBufY=Math.round(fTexcourdY*(this._iTextureHeight<<i)-this._iTextureHeight/2);
				iTexInBufX-=this._pBuffer[i].iX;
				iTexInBufY-=this._pBuffer[i].iY;

				iXdeltaStart=Math.max(iTexInBufX,0)-iTexInBufX;
				iYdeltaStart=Math.max(iTexInBufY,0)-iTexInBufY;
				iXdeltaEnd=(iTexInBufX+this._iTextureWidth)-Math.min(iTexInBufX+this._iTexturerWidth,this._iBufferWidth);
				iYdeltaEnd=(iTexInBufX+this._iTextureHeight)-Math.min(iTexInBufX+this._iTexturerHeight,this._iBufferHeight);

				if(iXdeltaStart+iXdeltaEnd<this._iTextureWidth&&iYdeltaStart+iYdeltaEnd<this._iTextureHeight)
				{
					for(var l=iXdeltaStart;l<this._iTextureHeight-iXdeltaEnd;l++)
					{
						for(var j=iYdeltaStart;j<this._iTextureWidth-iYdeltaEnd;j++)
						{
							for(var k=0;k<a.getIFormatNumElements(this._eTextureType);k++)
							{
								this._pDataFor[(l*this._iTextureWidth+j)*a.getIFormatNumElements(this._eTextureType)+k]=this._pBuffer[((l+iTexInBufY)*this._iBufferWidth+j+iTexInBufX)*a.getIFormatNumElements(this._eTextureType)+k];
							}
						}
					}
					this._pTexures[i].setPixelRGBA(0,0,this._iTextureWidth,this._iTextureHeight,this._pDataFor);
				}
			}
		}
		this._pBuffer[i].isUpdated=false;
	}


	static.fTexCourdXOld=fTexCourdX;
	static.fTexCourdYOld=fTexCourdY;
}


//Применение параметров для рендеринга, коготрые зависят от самого терраина
Terrain.prototype.applyForRender= function()
{
	this._pEngine.pDrawTerrainProgram.applyVector2('cameraCoordTerrain', this._v2fCameraCoord);
	for(var i=0;i<this._pTexures.length;i++)
	{
		this._pTexures[i].activate(2+i);
		this._pEngine.pDrawTerrainProgram.applyInt('textureTerrain'+i,2+i);
	}
}


