/**
 * @enum eBufferFlagBits
 *
 * @memberof VBufferBase
 **/
Enum([
         ManyUpdateBit = 0, // Данные много раз перезаписываются
         ManyDrawBit, // Данные много раз используются
         ReadableBit, // Буффер можно прочитать
         RamBackupBit, // Есть локальная копия
         SoftwareBit,
		 AlignmentBit //Выравнивание на 4
     ], // Софтварная реализация рендеринга
     BufferFlagBits, a.VBufferBase);
	 

	 
function VBufferBase () 
{
     /**
     * Указатель на WebGl буффер
     * @type WebGLBuffer
     * @memberof VBufferBase
     **/
    this._pBuffer = null;

    /**
     * Локальная копия буфера
     * @type Int
     * @memberof VBufferBase
     **/
    this._pBackupCopy = null;
	
    /**
     * Тип буфера, енум который с этим связан BufferFlagBits
     * @type Int
     * @memberof VBufferBase
     **/	 
    this._iTypeFlags = 0;	

	/**
     * Массив привязанных VertexData  
     * @type Array
     * @memberof VBufferBase
     **/
	this._pVertexDataArray = new Array();
	
	this._iNextID=0;
}



PROPERTY(VBufferBase,"size");

VBufferBase.prototype.create = function (iByteSize, iFlags, pData) {};
VBufferBase.prototype.destroy = function () {};
VBufferBase.prototype.getData = function (iOffset,iSize){}; 
VBufferBase.prototype.setData = function (pData,iOffset,iSize,nCountStart,nCount){}; 
VBufferBase.prototype.resize = function (iSize){};

VBufferBase.prototype.getNextID = function()
{
	return this._iNextID++;
}

/**
 * @property clone(VBufferBase pSrc)
 * Копирование буфера
 * @memberof VBufferBase
 * @param pSrc буфер которых хотим скопировать
 * @return Boolean
 **/
VBufferBase.prototype.clone = function (pSrc) {
    var isSuccess = false;
    // destroy any local data
    this.destroy();
    //count, iStride, iFlags, pData
    isSuccess = this.create(pSrc.getCount(), pSrc.getStride(), pSrc.getTypeFlags(), pSrc.getData());
    return isSuccess;
}

/**
 * @property isValid()
 * Проверка является ли данный буфер валидным
 * @memberof VBufferBase
 * @return Boolean
 **/
VBufferBase.prototype.isValid = function () {
    // Если буфер создан, то объект считается валидным
    return (this._pBuffer != null ? true : false);
}

/**
 * @property isDynamic()
 * Является ли данный буфер динамичным
 * @memberof VBufferBase
 * @return Boolean
 **/
VBufferBase.prototype.isDynamic = function () {
    return TEST_BIT((this._iTypeFlags, a.VBufferBase.ManyUpdateBit) && TEST_BIT(this._iTypeFlags,
                                                                                 a.VBufferBase.ManyDrawBit));
}


/**
 * @property Static()
 * Является ли данный буфер статичным
 * @memberof VBufferBase
 * @return Boolean
 **/
VBufferBase.prototype.isStatic = function () {
    return ((!TEST_BIT(this._iTypeFlags, a.VBufferBase.ManyUpdateBit)) && TEST_BIT(this._iTypeFlags,
                                                                                    a.VBufferBase.ManyDrawBit));
}


/**
 * @property Static()
 * Является ли данный буфер поточным
 * @memberof VBufferBase
 * @return Boolean
 **/
VBufferBase.prototype.isStream = function () {
    return (!TEST_BIT(this._iTypeFlags, a.VBufferBase.ManyUpdateBit)) && (!TEST_BIT(this._iTypeFlags,
                                                                                     a.VBufferBase.ManyDrawBit));
}


/**
 * @property isReadable()
 * Является ли буфер читаемым
 * @memberof VBufferBase
 * @return Boolean __DESCRIPTION__
 **/
VBufferBase.prototype.isReadable = function () {
    //Вроде как на данный момент нельхзя в вебЖл считывать буферы из видио памяти
    //(но нужно ли это вообще и есть ли смысл просто обратиться к локальной копии)
    return TEST_BIT(this._iTypeFlags, a.VBufferBase.ReadableBit);
}


/**
 * @property isRAMBufferPresent()
 * Есть ли у буфера локальная копия
 * @memberof VBufferBase
 * @return Boolean __DESCRIPTION__
 **/
VBufferBase.prototype.isRAMBufferPresent = function () {
    return (this._pBackupCopy != null ? true : false);
}


/**
 * @property isSoftware()
 * Являкется ли буффер софтварным
 * @memberof VBufferBase
 * @return Boolean __DESCRIPTION__
 **/
VBufferBase.prototype.isSoftware = function () {
    //на данный момент у нас нету понятия софтварной обработки и рендеренга
    return TEST_BIT(this._iTypeFlags, a.VBufferBase.SoftwareBit);
}

/**
 * @property isSoftware()
 * Являкется ли буффер выравниваемым по 4
 * @memberof VBufferBase
 * @return Boolean __DESCRIPTION__
 **/
VBufferBase.prototype.isAlignment = function () {
    //на данный момент у нас нету понятия софтварной обработки и рендеренга
    return TEST_BIT(this._iTypeFlags, a.VBufferBase.AlignmentBit);
}

/**
 * @property buffer()
 * Возвращает буффер
 * @memberof VBufferBase
 * @return pObject
 **/
VBufferBase.prototype.getBuffer = function () {
    return this._pBuffer;
}

/**
 * @property typeFlags()
 * Возвращает тип буфера
 * @memberof VBufferBase
 * @return Int
 **/
VBufferBase.prototype.getTypeFlags = function () {
    return this._iTypeFlags;
}


VBufferBase.prototype.getVertexData = function(iOffset,iCount,pVertexDeclaration) 
{	
	pVertexDeclaration = a.normalizeVertexDecl(pVertexDeclaration);
	var pVertexData=new a.VertexData(this,iOffset,iCount,pVertexDeclaration);
	this._pVertexDataArray.push(pVertexData);
	return pVertexData;
}

VBufferBase.prototype.freeVertexData=function(pVertexData)
{
	if(arguments.length==0)
	{
		for( var i in this._pVertexDataArray)
		{
			this._pVertexDataArray[i].destroy();
		}	
		this._pVertexDataArray = null;
	}
	else
	{
		for(var i=0;i<this._pVertexDataArray.length;i++)
		{
			if(this._pVertexDataArray[i]==pVertexData)
			{
				this._pVertexDataArray.splice(i,1);
				return true;
			}
		}
		pVertexData.destroy();
		return false;
	}
}

VBufferBase.prototype.allocateData = function(pVertexDecl, pData) {
	pVertexDecl = a.normalizeVertexDecl(pVertexDecl);

	var pVertexData;
    var iCount = pData.byteLength / pVertexDecl.stride;

    debug_assert(iCount === Math.floor(iCount), 
        'Data size should be a multiple of the vertex declaration.');

    pVertexData = this.getEmptyVertexData(iCount, pVertexDecl);
    pVertexData.setData(pData, 0, pVertexDecl.stride);

    return pVertexData;
};

VBufferBase.prototype.getEmptyVertexData = function(iCount,pVertexDeclaration,pVertexDataIn)
{	
	while(1)
	{
		var pHole = new Array();
		var i;
		var pVertexData;	
		pHole[0]={start:0, end: this.size};		
		for(var k in this._pVertexDataArray)
		{
			//console.log("--");
			pVertexData=this._pVertexDataArray[k];
			for(i=0;i<pHole.length;i++)
			{
				//console.log("pHole:",pHole[i].start,pHole[i].end);
				//Полностью попадает внутрь
				if(pVertexData.getOffset()>pHole[i].start&&pVertexData.getOffset()+pVertexData.size<pHole[i].end)
				{
					var iTemp=pHole[i].end;
					pHole[i].end=pVertexData.getOffset();
					pHole.splice(i+1,0,{start:pVertexData.getOffset()+pVertexData.size, end: iTemp});
					i--;
					
				}
				else if(pVertexData.getOffset()==pHole[i].start&&pVertexData.getOffset()+pVertexData.size<pHole[i].end)
				{
					
					pHole[i].start=pVertexData.getOffset()+pVertexData.size;
					

				}
				else if(pVertexData.getOffset()>pHole[i].start&&pVertexData.getOffset()+pVertexData.size==pHole[i].end)
				{
					
				}
				else if(pVertexData.getOffset()==pHole[i].start&&pVertexData.size==pHole[i].size)
				{
					pHole.splice(i,1);		
					i--;
				}
				//Перекрывает снизу
				else if(pVertexData.getOffset()<pHole[i].start&&
					pVertexData.getOffset()+pVertexData.size>pHole[i].start&&pVertexData.getOffset()+pVertexData.size<pHole[i].end)
				{
					pHole.start=pVertexData.getOffset()+pVertexData.size;
				}
				else if(pVertexData.getOffset()<pHole[i].start&&
					pVertexData.getOffset()+pVertexData.size>pHole[i].start&&pVertexData.getOffset()+pVertexData.size==pHole[i].end)
				{
					pHole.splice(i,1);
					i--;
				}
				//Перекрывается сверху
				else if(pVertexData.getOffset()+pVertexData.size>pHole[i].end&&
					pVertexData.getOffset()>pHole[i].start&&pVertexData.getOffset()<pHole[i].end)
				{
					pHole.end=pVertexData.getOffset();
				}
				else if(pVertexData.getOffset()+pVertexData.size>pHole[i].end&&
					pVertexData.getOffset()==pHole[i].start&&pVertexData.getOffset()<pHole[i].end)
				{
					pHole.splice(i,1);
					i--;
				}
				//полнстью перекрывает
				else if(pVertexData.getOffset()<pHole[i].start&&pVertexData.getOffset()+pVertexData.size>pHole[i].end)
				{
					i--;
				}			
			}
		}
		
		function order(a, b) 
		{ 
			return (a.end-a.start)-(b.end-b.start) ; 
		}
		pHole.sort(order); 
		
		
		var iStride=0;
		
		if(typeof(pVertexDeclaration)!="number")
		{
			pVertexDeclaration = a.normalizeVertexDecl(pVertexDeclaration);
			// for (var i = 0; i < pVertexDeclaration.length; i++) 
			// {
			// 	//console.log("++",pVertexDeclaration[i].nCount,pVertexDeclaration[i].eType,a.getTypeSize(pVertexDeclaration[i].eType));
			// 	iStride += pVertexDeclaration[i].nCount * a.getTypeSize(pVertexDeclaration[i].eType);
			// }
			iStride = pVertexDeclaration.iStride;	
		}
		else
		{
			iStride=pVertexDeclaration;
		}
		
		
		for(i=0;i<pHole.length;i++)
		{		
			//console.log((pHole[i].end,Math.alignUp(pHole[i].start,iStride)),iCount*iStride);	
			var iAligStart=this.isAlignment()?
				Math.alignUp(pHole[i].start,Math.nok(iStride,4)):
				Math.alignUp(pHole[i].start,iStride);
			if((pHole[i].end-iAligStart)>=iCount*iStride)
			{
				
				if(arguments.length==2)
				{
					var pVertexData=new a.VertexData(this, iAligStart, iCount, pVertexDeclaration);
					this._pVertexDataArray.push(pVertexData);
					return pVertexData;
				}
				else if(arguments.length==3)
				{
					pVertexDataIn.constructor.call(pVertexDataIn, this, iAligStart, iCount, pVertexDeclaration);
					this._pVertexDataArray.push(pVertexDataIn);
					return pVertexDataIn;
				}
				else
				{
					return null;
				}
			}
		}		

		if(this.resize(Math.max(this.size*2,this.size+iCount*iStride))==false)
		{
			break;
		}
	}
	return null;
}

a.VBufferBase=VBufferBase;