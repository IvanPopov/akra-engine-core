/**
 * @file
 * @brief IndexBuffer class.
 * @author xoma
 * @email xoma@odserve.org
 * Файл класса с IndexBuffer
 **/

Define(a.IndexBufferManager(pEngine), function () {
    a.ResourcePool(pEngine, a.IndexBuffer)
});

/**
 * @enum eBufferFlagBits
 *
 * @memberof IndexBuffer
 **/
Enum([
         ManyUpdateBit = 0, // Данные много раз перезаписываются
         ManyDrawBit, // Данные много раз используются
         ReadableBit, // Буффер можно прочитать
         RamBackupBit, // Есть локальная копия
         SoftwareBit
     ], // Софтварная реализация рендеринга
     BufferFlagBits, a.IndexBuffer)

/**
 * @property IndexBuffer()
 * Конструктор, создающий буфер индексов
 * @memberof IndexBuffer
 * @param pDevice указатель на девайс который будет использовать этот объект
 **/
/**
 * IndexBuffer Class
 * @ctor
 * Constructor of IndexBuffer class
 **/
function IndexBuffer (pEngine) 
{
    this._pEngine = pEngine;
    this._pDevice = pEngine.pDevice;
    /**
     * Указатель на WebGl буффер
     * @type WebGLBuffer
     * @memberof IndexBuffer
     **/
    this._pBuffer = null;
    /**
     * Локальная копия буфера
     * @type Int
     * @memberof IndexBuffer
     **/
    this._pBackupCopy = null;
    /**
     * Тип буфера, енум который с этим связан BufferFlagBits
     * @type Int
     * @memberof IndexBuffer
     **/
    this._iTypeFlags = 0;   	

	/**
     * Размер буфера в байтах
     * @type Int
     * @memberof IndexBuffer
     **/
    this._iByteSize=undefined;

	/**
     * Массив привязанных IndexData  
     * @type Array
     * @memberof IndexBuffer
     **/
	this._pIndexDataArray = new Array();

    IndexBuffer.superclass.constructor.apply(this, arguments);

}
a.extend(IndexBuffer, a.ResourcePoolItem);


/**
 * @property isValid()
 * Проверка является ли данный буфер валидным
 * @memberof IndexBuffer
 * @return Boolean
 **/
IndexBuffer.prototype.isValid = function () {
    // Если буфер создан, то объект считается валидным
    return (this._pBuffer != null ? true : false);
}

/**
 * @property isDynamic()
 * Является ли данный буфер динамичным
 * @memberof IndexBuffer
 * @return Boolean
 **/
IndexBuffer.prototype.isDynamic = function () {
    return TEST_BIT(this._iTypeFlags, a.IndexBuffer.ManyUpdateBit) && TEST_BIT(this._iTypeFlags,
                                                                               a.IndexBuffer.ManyDrawBit);
}

/**
 * @property Static()
 * Является ли данный буфер статичным
 * @memberof IndexBuffer
 * @return Boolean
 **/
IndexBuffer.prototype.isStatic = function () {
    return (!TEST_BIT(this._iTypeFlags, a.IndexBuffer.ManyUpdateBit)) && TEST_BIT(this._iTypeFlags,
                                                                                  a.IndexBuffer.ManyDrawBit);
}

/**
 * @property Static()
 * Является ли данный буфер поточным
 * @memberof IndexBuffer
 * @return Boolean
 **/
IndexBuffer.prototype.isStream = function () {
    return (!TEST_BIT(this._iTypeFlags, a.IndexBuffer.ManyUpdateBit)) && (!TEST_BIT(this._iTypeFlags,
                                                                                    a.IndexBuffer.ManyDrawBit));
}

/**
 * @property isReadable()
 * Является ли буфер читаемым
 * @memberof IndexBuffer
 * @return Boolean __DESCRIPTION__
 **/
IndexBuffer.prototype.isReadable = function () {
    //Вроде как на данный момент нельхзя в вебЖл считывать буферы из видио памяти
    //(но нужно ли это вообще и есть ли смысл просто обратиться к локальной копии)
    return TEST_BIT(this._iTypeFlags, a.IndexBuffer.ReadableBit);
}


/**
 * @property isRAMBufferPresent()
 * Есть ли у буфера локальная копия
 * @memberof IndexBuffer
 * @return Boolean __DESCRIPTION__
 **/
IndexBuffer.prototype.isRAMBufferPresent = function () {
    return (this._pBackupCopy != null ? true : false);
}

/**
 * @property isSoftware()
 * Являкется ли буффер софтварным
 * @memberof IndexBuffer
 * @return Boolean __DESCRIPTION__
 **/
IndexBuffer.prototype.isSoftware = function () {
    //на данный момент у нас нету понятия софтварной обработки и рендеренга
    return TEST_BIT(this._iTypeFlags, a.IndexBuffer.SoftwareBit);
}

/**
 * @property buffer()
 * Возвращает буффер
 * @memberof IndexBuffer
 * @return pObject
 **/
IndexBuffer.prototype.getBuffer = function () {
    return this._pBuffer;
}

/**
 * @property getUsage()
 * Возвращает тип буфера
 * @memberof IndexBuffer
 * @return Int
 **/
IndexBuffer.prototype.getUsage = function () {
    return this._iTypeFlags;
}


/**
 * @property getIndexSize()
 * Возвращает размер элемнта в байтах
 * @memberof IndexBuffer
 * @return Int
 **/
IndexBuffer.prototype.getSize = function () 
{
    return this._iByteSize;
}


/**
 * @property create(Enumeration eType, Int count, Enumeration eFlags, Array pData)
 * Создание буфера
 * @memberof IndexBuffer
 * @param iByteSize размер буфера
 * @param eFlags тип буфера
 * @param pData чем инициализировать буфер
 * @return Int
 **/
IndexBuffer.prototype.create = function (iByteSize, iFlags, pData) 
{
    debug_assert(this._pBuffer == null, "d3d buffer already allocated");
    debug_assert(this._pBackupCopy == null, "backup buffer already allocated");

    var eUsage = 0;
    
    this._iByteSize = iByteSize;
    this._iTypeFlags = iFlags;

    //Софтварного рендеринга буфера у нас нет
    debug_assert(!TEST_BIT(this._iTypeFlags, a.IndexBuffer.SoftwareBit), "no sftware rendering");

    //Нету смысла много обновлять и только один раз рисовать
    if (TEST_BIT(this._iTypeFlags, a.IndexBuffer.ManyUpdateBit) && (!TEST_BIT(this._iTypeFlags,
                                                                              a.IndexBuffer.ManyDrawBit))) {
        debug_assert(TEST_BIT(this._iTypeFlags, a.IndexBuffer.SoftwareBit), "crazy... more update bun one draw");
    }

	
    //Если есть локальная копия то буфер можно читать
    if (TEST_BIT(this._iTypeFlags, a.IndexBuffer.RamBackupBit)) {
        SET_BIT(this._iTypeFlags, a.IndexBuffer.ReadableBit);
    }
    else {
        //Если есть нужно читать до должна быть локальная копия
        if (TEST_BIT(this._iTypeFlags, a.IndexBuffer.ReadableBit)) {
            SET_BIT(this._iTypeFlags, a.IndexBuffer.RamBackupBit);
        }
    }

	if(pData)
	{
		 debug_assert(pData.byteLength<=iByteSize, "Размер переданного массива больше переданного размера буфера");
	}
	
    // Если нужна локальная копия, то надо выделить память под нее
    if (TEST_BIT(this._iTypeFlags, a.IndexBuffer.RamBackupBit)) {
        this._pBackupCopy = new Uint8Array(this._iByteSize);
        if (pData) {
               this._pBackupCopy.set(pData.buffer, 0);
        }
    }

    if (TEST_BIT(this._iTypeFlags, a.IndexBuffer.ManyUpdateBit) && TEST_BIT(this._iTypeFlags,
                                                                            a.IndexBuffer.ManyDrawBit)) {
        eUsage = a.BUSAGE.DYNAMIC_DRAW;
    }
    else if ((!TEST_BIT(this._iTypeFlags, a.IndexBuffer.ManyUpdateBit)) && TEST_BIT(this._iTypeFlags,
                                                                                    a.IndexBuffer.ManyDrawBit)) {
        eUsage = a.BUSAGE.STATIC_DRAW;
    }
    else {
        eUsage = a.BUSAGE.STREAM_DRAW;
    }

    this._pBuffer = this._pDevice.createBuffer();

    if (!this._pBuffer) {
        this._pBuffer = null;
        debug_error("Не удалось создать буфер");
        this.destroy();
        return false;
    }

    var pRenderer = this._pEngine.shaderManager();
    pRenderer.activateIndexBuffer(this);
    pRenderer.indexBufferChanged(this);
    this._pDevice.bufferData(a.BTYPE.ELEMENT_ARRAY_BUFFER, this._iByteSize, eUsage);
	if(pData)
	{
		this._pDevice.bufferSubData(a.BTYPE.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(pData.buffer));
	}
    
    return true;
}


/**
 * @property destroy()
 * Уничтожение буфера
 * @memberof IndexBuffer
 **/
IndexBuffer.prototype.destroy = function () 
{
	if(this._pDevice.isBuffer(this._pBuffer))
	{
		this._pDevice.deleteBuffer(this._pBuffer);
	}    
	
	this._pBuffer=null;
	
    this._pBackupCopy=null;	
    this._iByteSize = undefined;
	
	for( var i in this._pIndexDataArray)
	{
		this._pIndexDataArray[i].destroy();
	}	
	this._pIndexDataArray = null;
	
    this._iTypeFlags = 0;
    this._pEngine.shaderManager().releaseRenderResource(this);
    this.notifyUnloaded();
}

/**
 * @property clone(IndexBuffer pSrc)
 * Копирование буфера
 * @memberof IndexBuffer
 * @param pSrc буфер которых хотим скопировать
 * @return Boolean
 **/
IndexBuffer.prototype.clone = function (pSrc) 
{
    var isSuccess = false;
    // destroy any local data
    this.destroy();	
	this.create(pSrc.getByteSize(),pSrc.getUsage(),pSrc.getData(0,pSrc.getByteSize()));		
    return isSuccess;
}

/**
 * @property getData(int iOffset, int iSize)
 * Возвращает указатель на локальную копию данных
 * @return Uint8Array
 **/
IndexBuffer.prototype.getData = function (iOffset,iSize) 
{
	debug_assert(this._pBuffer, "Буффер еще не создан");
    debug_assert(TEST_BIT(this._iTypeFlags, a.IndexBuffer.RamBackupBit) == true,
                 "Нельзя отдать данные если они не храняться локально");
    return this._pBackupCopy.buffer.slice(iOffset,iOffset+iSize);
}

/**
 * @property setData(ArrayBuffer pData,Int iOffset, Int iSize)
 * @param pData данные одного типа
 * @param iOffset смещение данных относительно начала строки в байтах
 * @param iSize размер этих данных
 * Выставить определеные элементы в буфере
 * @return Boolean
 **/
IndexBuffer.prototype.setData = function (pData, iOffset, iSize) 
{
    debug_assert(this._pBuffer, "Буффер еще не создан");
    var pRenderer = this._pEngine.shaderManager();
    pRenderer.activateIndexBuffer(this);
    this._pDevice.bindBuffer(a.BTYPE.ELEMENT_ARRAY_BUFFER, this._pBuffer);

	
	debug_assert(pData.byteLength<=iSize, "Размер переданного массива больше переданного размера");
    pRenderer.indexBufferChanged(this);
	this._pDevice.bufferSubData(a.BTYPE.ELEMENT_ARRAY_BUFFER, iOffset,
                                    pData.slice(0,iSize));
	
	if (TEST_BIT(this._iTypeFlags, a.VertexBuffer.RamBackupBit)) 
	{
        this._pBackupCopy.set(new Uint8Array(pData.slice(0,iSize)),iOffset);
    }

	return true;
}

/**
 * @property activate()
 * Активировать буфер
 * @memberof IndexBuffer
 **/
IndexBuffer.prototype.activate = function ()
{    
	debug_assert(this.isValid(), "Attempting to activate an invalid buffer");    
    this._pDevice.bindBuffer(a.BTYPE.ELEMENT_ARRAY_BUFFER, this._pBuffer);   
}

/**
 * @property createResource()
 * innitialize the resource (called once)
 * @memberof IndexBuffer
 * @return Boolean
 **/
IndexBuffer.prototype.createResource = function () {
    // nothing to do
    this.notifyCreated();
    return true;
}


/**
 * @property destroyResource()
 * destroy the resource
 * @memberof IndexBuffer
 * @return Boolean
 **/
IndexBuffer.prototype.destroyResource = function () {
    this.destroy();
    this.notifyDestroyed();
    return true;
}


/**
 * @property restoreResource()
 * prepare the resource for use (create any volatile memory objects needed)
 * @memberof IndexBuffer
 * @return Boolean
 **/
IndexBuffer.prototype.restoreResource = function () {
    this.notifyRestored();
    return true;
}


/**
 * @property disableResource()
 * prepare the resource for use (create any volatile memory objects needed)
 * @memberof IndexBuffer
 * @return Boolean
 **/
IndexBuffer.prototype.disableResource = function () {
    this.notifyDisabled();
    return true;
}


/**
 * @property loadResource(String sFilename)
 * load the resource from a file
 * @memberof IndexBuffer
 * @param sFilename имя файла
 * @return Boolean
 **/
IndexBuffer.prototype.loadResource = function () {
    return true;
}


/**
 * @property saveResource(String sFilename)
 * save the resource to the file and return the size written
 * @memberof IndexBuffer
 * @param sFilename имя файла
 * @return Boolean
 **/
IndexBuffer.prototype.saveResource = function () {
    return true;
}

IndexBuffer.prototype.getIndexData = function(iOffset,iCount,ePrimitiveType,eElementsType)
{	
	var pIndexData=new a.IndexData(this,iOffset,iCount,ePrimitiveType,eElementsType);
	this._pIndexDataArray.push(pIndexData);
	return pIndexData;
}

IndexBuffer.prototype.freeIndexData=function(pIndexData)
{
	for(var i=0;i<this._pIndexDataArray.length;i++)
	{
		if(this._pIndexDataArray[i]==pIndexData)
		{
			this._pIndexDataArray.splice(i,1);
			return true;
		}
	}
	pIndexData.destroy();
	return false;
}

IndexBuffer.prototype.getEmptyIndexData = function(iCount,ePrimitiveType,eElementsType)
{	
	var pHole = new Array();
	var i;
	var pIndexData;
	pHole[0]={start:0, end: this.getSize()};
	//console.log(pHole[0].end);
	for(var k in this._pIndexDataArray)
	{
		pIndexData=this._pIndexDataArray[k];
		for(i=0;i<pHole.length;i++)
		{
			//console.log("pHole:",pHole[i].start,pHole[i].end);
			//Полностью попадает внутрь
			if(pIndexData.getOffset()>pHole[i].start&&pIndexData.getOffset()+pIndexData.getSize()<pHole[i].end)
			{
				var iTemp=pHole[i].end;
				pHole[i].end=pIndexData.getOffset();
				pHole.splice(i+1,0,{start:pIndexData.getOffset()+pIndexData.getSize(), end: iTemp});
				i--;
				
			}
			else if(pIndexData.getOffset()==pHole[i].start&&pIndexData.getOffset()+pIndexData.getSize()<pHole[i].end)
			{
				
				pHole[i].start=pIndexData.getOffset()+pIndexData.getSize();
				

			}
			else if(pIndexData.getOffset()>pHole[i].start&&pIndexData.getOffset()+pIndexData.getSize()==pHole[i].end)
			{
				
			}
			else if(pIndexData.getOffset()==pHole[i].start&&pIndexData.getSize()==pHole[i].size)
			{
				pHole.splice(i,1);		
				i--;
			}
			//Перекрывает снизу
			else if(pIndexData.getOffset()<pHole[i].start&&
				pIndexData.getOffset()+pIndexData.getSize()>pHole[i].start&&pIndexData.getOffset()+pIndexData.getSize()<pHole[i].end)
			{
				pHole.start=pIndexData.getOffset()+pIndexData.getSize();
			}
			else if(pIndexData.getOffset()<pHole[i].start&&
				pIndexData.getOffset()+pIndexData.getSize()>pHole[i].start&&pIndexData.getOffset()+pIndexData.getSize()==pHole[i].end)
			{
				pHole.splice(i,1);
				i--;
			}
			//Перекрывается сверху
			else if(pIndexData.getOffset()+pIndexData.getSize()>pHole[i].end&&
				pIndexData.getOffset()>pHole[i].start&&pIndexData.getOffset()<pHole[i].end)
			{
				pHole.end=pIndexData.getOffset();
			}
			else if(pIndexData.getOffset()+pIndexData.getSize()>pHole[i].end&&
				pIndexData.getOffset()==pHole[i].start&&pIndexData.getOffset()<pHole[i].end)
			{
				pHole.splice(i,1);
				i--;
			}
			//полнстью перекрывает
			else if(pIndexData.getOffset()<pHole[i].start&&pIndexData.getOffset()+pIndexData.getSize()>pHole[i].end)
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
	
	for(i=0;i<pHole.length;i++)
	{		
		if((pHole[i].end-pHole[i].start)>=iCount*a.getTypeSize(eElementsType))
		{
			var pIndexData=new a.IndexData(this,pHole[i].start,iCount,ePrimitiveType,eElementsType);
			this._pIndexDataArray.push(pIndexData);
			return pIndexData;
		}
	}
	return null;
}


a.IndexBuffer = IndexBuffer;