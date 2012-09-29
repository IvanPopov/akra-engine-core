/**
 * @file
 * @brief VertexBuffer class.
 * @author xoma
 * @email xoma@odserve.org
 * Файл класса с VertexBuffer
 *
 **/

Define(a.VertexBufferManager(pEngine), function () {
    a.ResourcePool(pEngine, a.VertexBuffer)
});


/**
 * @property VertexBuffer()
 * Конструктор, создающий буфер индексов
 * @memberof VertexBuffer
 * @param pDevice указтель на девайс который будет использовать этот объект
 **/
/**
 * VertexBuffer Class
 * @ctor
 * Constructor of VertexBuffer class
 **/
function VertexBuffer () 
{
  	A_CLASS;
	this._pDevice = this._pEngine.pDevice;
	this._iByteSize = undefined;
}

a.extend(VertexBuffer, a.ResourcePoolItem, a.VBufferBase);

/**
 * @property size()
 * Размер буфера в байтах
 * @memberof VertexBuffer
 * @return Int __DESCRIPTION__
 **/
PROPERTY(VertexBuffer,"size", function () 
{
    return this._iByteSize;
});



/**
 * @property create(Int count,Int iStride, Enumeration eFlags,Array pData)
 * Создание буфера
 * @memberof VertexBuffer
 * @param iByteSize размер буфера
 * @param eFlags тип буфера
 * @param pData чем инициализировать буфер
 * @return Int
 **/

VertexBuffer.prototype.create = function (iByteSize, iFlags, pData) 
{
    iByteSize = iByteSize || 0;
    iFlags = iFlags || 0;

    var i;

    debug_assert(this._pBuffer == null, "d3d buffer already allocated");
    debug_assert(this._pBackupCopy == null, "backup buffer already allocated");


	var eUsage = 0;
	if(iByteSize<100)
		iByteSize=1000;
	
	this._iByteSize = iByteSize;
    this._iTypeFlags = iFlags;

    var pRenderer = this._pEngine.shaderManager();

    //Софтварного рендеринга буфера у нас нет
    debug_assert(!TEST_BIT(this._iTypeFlags, a.VBufferBase.SoftwareBit), "no sftware rendering");

    //Нету смысла много обновлять и только один раз рисовать
    if (TEST_BIT(this._iTypeFlags, a.VBufferBase.ManyUpdateBit) && (!TEST_BIT(this._iTypeFlags,
                                                                               a.VBufferBase.ManyDrawBit))) {
        debug_assert(TEST_BIT(this._iTypeFlags, a.VBufferBase.SoftwareBit), "crazy... more update bun one draw");
    }

    //Если есть локальная копия то буфер можно читать
    if (TEST_BIT(this._iTypeFlags, a.VBufferBase.RamBackupBit)) {
        SET_BIT(this._iTypeFlags, a.VBufferBase.ReadableBit);
    }
    else {
        //Если есть нужно читать до должна быть локальная копия
        if (TEST_BIT(this._iTypeFlags, a.VBufferBase.ReadableBit)) {
            SET_BIT(this._iTypeFlags, a.VBufferBase.RamBackupBit);
        }
    }
	
	if(pData)
	{
		debug_assert(pData.byteLength<=iByteSize, "Размер переданного массива больше переданного размера буфера");
	}
	
    // Если нужна локальная копия, то надо выделить память под нее
    if (TEST_BIT(this._iTypeFlags, a.VBufferBase.RamBackupBit)) 
	{
        this._pBackupCopy = new Uint8Array(this._iByteSize);
        if (pData) {
               this._pBackupCopy.set(new Uint8Array(pData.buffer), 0);
        }
    }

    if (TEST_BIT(this._iTypeFlags, a.VBufferBase.ManyUpdateBit) && TEST_BIT(this._iTypeFlags,
                                                                             a.VBufferBase.ManyDrawBit)) {
        eUsage = a.BUSAGE.DYNAMIC_DRAW;
    }
    else if ((!TEST_BIT(this._iTypeFlags, a.VBufferBase.ManyUpdateBit)) && TEST_BIT(this._iTypeFlags,
                                                                                     a.VBufferBase.ManyDrawBit)) {
        eUsage = a.BUSAGE.STATIC_DRAW;
    }
    else {
        eUsage = a.BUSAGE.STREAM_DRAW;
    }

    this._pBuffer = this._pDevice.createBuffer();

    if (!this._pBuffer) 
	{
        this._pBuffer = null;
        debug_error("Не удалось создать буфер");
        this.destroy();
        return false;
    }

    pRenderer.activateVertexBuffer(this);
    pRenderer.vertexBufferChanged(this);
    this._pDevice.bufferData(a.BTYPE.ARRAY_BUFFER, this._iByteSize, eUsage);
    if (pData)
	{
        this._pDevice.bufferSubData(a.BTYPE.ARRAY_BUFFER, 0, (pData.buffer));
    }

    this.notifyRestored();
    this.notifyLoaded();

    return true;
}

/**
 * @property destroy()
 * Уничтожение буфера
 * @memberof VertexBuffer
 **/
VertexBuffer.prototype.destroy = function () 
{
    
	if(this._pDevice.isBuffer(this._pBuffer))
	{
		this._pDevice.deleteBuffer(this._pBuffer);
	}	
	this._pBuffer=null;	
	
    this._pBackupCopy = null;
	this._iByteSize=undefined;	
	
	this.freeVertexData();	
	
    this._iTypeFlags = undefined;
    this._pEngine.shaderManager().releaseRenderResource(this);
    this.notifyUnloaded();
}


/**
 * @property getData()
 * Возвращает указатель на локальную копию данных
 * @return Uint32Array
 **/
VertexBuffer.prototype.getData = function (iOffset,iSize)  
{
	debug_assert(this._pBuffer, "Буффер еще не создан");
    debug_assert(TEST_BIT(this._iTypeFlags, a.VBufferBase.RamBackupBit) == true,
                 "Нельзя отдать данные если они не храняться локально");
	if (arguments.length === 0) {
		return this._pBackupCopy.buffer;
	}
    return this._pBackupCopy.buffer.slice(iOffset, iOffset+iSize);
}

/**
 * @property setData(ArrayBuffer pData,Int iOffset, Int iSize)
 * @param pData данные одного типа
 * @param iOffset смещение данных относительно начала буфера
 * @param iSize размер этих данных
 * Выставить определеные элементы в буфере
 * @return Boolean
 **/
VertexBuffer.prototype.setData = function (pData, iOffset, iSize) 
{
    debug_assert(this._pBuffer, "Буффер еще не создан");
    var pRenderer = this._pEngine.shaderManager();
    pRenderer.activateVertexBuffer(this);
	
	debug_assert(pData.byteLength<=iSize, "Размер переданного массива больше переданного размера");
	debug_assert(this.size>=iOffset+iSize, "Данные выйдут за предел буфера");

//    pRenderer.vertexBufferChanged(this);
	this._pDevice.bufferSubData(a.BTYPE.ARRAY_BUFFER, iOffset,
                                    new Uint8Array(pData.slice(0,iSize)));
	
	if (TEST_BIT(this._iTypeFlags, a.VBufferBase.RamBackupBit)) 
	{
        this._pBackupCopy.set(new Uint8Array(pData.slice(0,iSize)),iOffset);
    }
	return true;
}


VertexBuffer.prototype.resize=function(iSize) {
//    window['A_TRACER.trace']('resize vertex buffer from ' + this.size + '  to ' + iSize + ' bytes');
	var eUsage;
	var pData;
	var iMax=0;
	var pVertexData;
    var pRenderer = this._pEngine.shaderManager();
	
	if(TEST_BIT(this._iTypeFlags, a.VBufferBase.RamBackupBit) != true)
	{
		return false;		
	}

	if(iSize<this.size)
	{
		for(var k in this._pVertexDataArray)
		{
			pVertexData=this._pVertexDataArray[k];

			if(pVertexData.getOffset()+pVertexData.size>iMax)
			{
				iMax=pVertexData.getOffset()+pVertexData.size;
			}		
		}	
		debug_assert(iMax<=iSize,"Уменьшение невозможно. Страая разметка не укладывается в новый размер");
	}
	
	if(this._pDevice.isBuffer(this._pBuffer))
	{
		this._pDevice.deleteBuffer(this._pBuffer);
	}		
	
	if (TEST_BIT(this._iTypeFlags, a.VBufferBase.ManyUpdateBit) && TEST_BIT(this._iTypeFlags,
                                                                             a.VBufferBase.ManyDrawBit)) {
        eUsage = a.BUSAGE.DYNAMIC_DRAW;
    }
    else if ((!TEST_BIT(this._iTypeFlags, a.VBufferBase.ManyUpdateBit)) && TEST_BIT(this._iTypeFlags,
                                                                                     a.VBufferBase.ManyDrawBit)) {
        eUsage = a.BUSAGE.STATIC_DRAW;
    }
    else {
        eUsage = a.BUSAGE.STREAM_DRAW;
    }

    this._pBuffer = this._pDevice.createBuffer();
    pRenderer.vertexBufferChanged(this);

    if (!this._pBuffer) 
	{
        this._pBuffer = null;
        debug_error("Не удалось создать буфер");
        this.destroy();
        return false;
    }


    pRenderer.activateVertexBuffer(this);
	this._pDevice.bufferData(a.BTYPE.ARRAY_BUFFER, iSize, eUsage);
	
	pData=this.getData(0,this._iByteSize);
//	this._pDevice.bufferSubData(a.BTYPE.ARRAY_BUFFER, 0,pData);
	this._pBackupCopy=new Uint8Array(iSize);
	this.setData(pData,0,this._iByteSize);

	this._iByteSize=iSize;	
	
	return true;
}

/**
 * @property activate()
 * Активировать буфер
 * @memberof VertexBuffer
 **/
VertexBuffer.prototype.activate = function (){
    debug_assert(this.isValid(), "Attempting to activate  an invalid buffer");
    this._pEngine.shaderManager().activateVertexBuffer(this);
};

VertexBuffer.prototype.bind = function () {
    this._pDevice.bindBuffer(a.BTYPE.ARRAY_BUFFER, this._pBuffer);
}

VertexBuffer.prototype.unbind = function () {
    trace("!!!!! VertexBuffer.prototype.unbind #" + this.resourceHandle());
    this._pDevice.bindBuffer(a.BTYPE.ARRAY_BUFFER, null);
}

/**
 * @property createResource()
 * innitialize the resource (called once)
 * @memberof VertexBuffer
 * @return Boolean
 **/
VertexBuffer.prototype.createResource = function () {
    // nothing to do
    this.notifyCreated();
    return true;
}


/**
 * @property destroyResource()
 * destroy the resource
 * @memberof VertexBuffer
 * @return Boolean
 **/
VertexBuffer.prototype.destroyResource = function () {
    this.notifyDestroyed();
    this.destroy();
    return true;
}


/**
 * @property restoreResource()
 * prepare the resource for use (create any volatile memory objects needed)
 * Перенести ресур в энергозависимую память
 * @memberof VertexBuffer
 * @return Boolean
 **/
VertexBuffer.prototype.restoreResource = function () {
    this.notifyRestored();
    return true;
	
	/*if (TEST_BIT(this._iStateFlags,
                 a.VertexBuffer.Volatile) //можно ли руками востанавливать и удаляьть из энергозависимой памяти
        && TEST_BIT(this._iTypeFlags, a.VertexBuffer.RamBackupBit) //для этого нужна локальная копия
        && !this._pBuffer) //буфера быть не должно
    {
        this._pBuffer = this._pDevice.createBuffer();

		if (!this._pBuffer) 
		{
			this._pBuffer = null;
			debug_error("Не удалось создать буфер");
			this.destroy();
			return false;
		}
		
        if (this._pBackupCopy) 
		{
                this._pDevice.bindBuffer(a.BTYPE.ARRAY_BUFFER, this._pBuffer);
                this._pDevice.bufferSubData(a.BTYPE.ARRAY_BUFFER, this._pBackupCopy, this._iUsageFlags);
                this._pDevice.bindBuffer(a.BTYPE.ARRAY_BUFFER, 0);
                SET_BIT(this._iStateFlags, a.VertexBuffer.DataInitialized);
        }
        
    }
    return true;*/
}


/**
 * @property disableResource()
 * prepare the resource for use (create any volatile memory objects needed)
 * удалить ресуср из энергозависимо памяти
 * @memberof VertexBuffer
 * @return Boolean
 **/
VertexBuffer.prototype.disableResource = function () {
    this.notifyDisabled();
    if (TEST_BIT(this._iStateFlags,
                 a.VBufferBase.Volatile) //можно ли руками востанавливать и удаляьть из энергозависимой памяти
        && TEST_BIT(this._iTypeFlags, a.VBufferBase.RamBackupBit)) //для этого нужна локальная копия
    {
        this._pDevice.deleteBuffer(this._pBuffer);
        this._pBuffer = null;
    }

    return true;
}


/**
 * @property loadResource(String sFilename)
 * load the resource from a file
 * @memberof VertexBuffer
 * @param sFilename имя файла
 * @return Boolean
 **/
VertexBuffer.prototype.loadResource = function () {
    return false;
}


/**
 * @property saveResource(String sFilename)
 * save the resource to the file and return the size written
 * @memberof VertexBuffer
 * @param sFilename имя файла
 * @return Boolean
 **/
VertexBuffer.prototype.saveResource = function () {
    return false;
}

a.VertexBuffer = VertexBuffer;


/**
 * Computes a coordinate-axis oriented bounding box.
 * @property computeBoundingBox(VertexData pVertexData, Rect3D pBoundingBox)
 * @tparam pVertexData VertexData буфер с данными для подсчета BoundingBox
 * @tparam pBoundingBox BoundingBox
 * @treturn Boolean
 */
function computeBoundingBox (pVertexData, pBoundingBox)
{
	var fX0 = 0, fY0 = 0, fZ0 = 0,
		fX1 = 0, fY1 = 0, fZ1 = 0;
	var fTemp, pTempData;
	var i = 0;
	var pVertexDeclaration,pVertexElement,pData;
	var nStride,nCount;

	if (!pVertexData || !pBoundingBox )
	{
		return false;
	}

	pVertexDeclaration=pVertexData.getVertexDeclaration();
	if(!pVertexDeclaration)
		return false;

	pVertexElement=pVertexDeclaration.element(a.DECLUSAGE.POSITION,3);
	if(!pVertexDeclaration)
		return false;

	nCount=pVertexData.length;
	nStride=pVertexElement.iSize;

	pData=pVertexData.getData(pVertexElement.iOffset,pVertexElement.iSize);
	if (!pData)
		return false;

	pTempData = new Float32Array(pData, 0, 3);
	fX0 = fX1 = pTempData[0];
	fY0 = fY1 = pTempData[1];
	fZ0 = fZ1 = pTempData[2];
	for (i = nStride; i < nStride * nCount; i += nStride) {

		pTempData = new Float32Array(pData, i, 3);
		fTemp = pTempData[0];
		fX0 = fX0 > fTemp ? fTemp : fX0; //Min
		fX1 = fX1 > fTemp ? fX1 : fTemp; //Max

		fTemp = pTempData[1];
		fY0 = fY0 > fTemp ? fTemp : fY0; //Min
		fY1 = fY1 > fTemp ? fY1 : fTemp; //Max

		fTemp = pTempData[2];
		fZ0 = fZ0 > fTemp ? fTemp : fZ0; //Min
		fZ1 = fZ1 > fTemp ? fZ1 : fTemp; //Max
	}

	pBoundingBox.set(fX0,fX1,fY0,fY1,fZ0,fZ1);

    return true;
};
a.computeBoundingBox = computeBoundingBox;


/**
 * Computes data for cascade BoundingBox
 * @property computeDataForCascadeBoundingBox(Rect3d pBoundingBox, Array pVertexs, Array pIndexes, Float fMinSize)
 * @tparam pBoundingBox BoundingBox
 * @tparam pVertexs координаты вершин
 * @tparam pIndexes индексы вершин
 * @tparam fMinSize минимальный размер рисочек
 * @treturn Boolean
 */
function computeDataForCascadeBoundingBox(pBoundingBox,pVertexes,pIndexes, fMinSize)
{

	var pInd;
	var pPoints;
	var i, j, k;

	pPoints = new Array(8);
	for(i=0;i<8;i++)
	{
		pPoints[i]=new Array(4);
		for(j=0;j<4;j++)
			pPoints[i][j]=new Vec3(0);
	}

	//Выставление точек Rect3d
	pPoints[0][0].set([pBoundingBox.fX0,pBoundingBox.fY0,pBoundingBox.fZ0]);
	pPoints[1][0].set([pBoundingBox.fX0,pBoundingBox.fY1,pBoundingBox.fZ0]);
	pPoints[2][0].set([pBoundingBox.fX0,pBoundingBox.fY0,pBoundingBox.fZ1]);
	pPoints[3][0].set([pBoundingBox.fX0,pBoundingBox.fY1,pBoundingBox.fZ1]);
	pPoints[4][0].set([pBoundingBox.fX1,pBoundingBox.fY0,pBoundingBox.fZ0]);
	pPoints[5][0].set([pBoundingBox.fX1,pBoundingBox.fY1,pBoundingBox.fZ0]);
	pPoints[6][0].set([pBoundingBox.fX1,pBoundingBox.fY0,pBoundingBox.fZ1]);
	pPoints[7][0].set([pBoundingBox.fX1,pBoundingBox.fY1,pBoundingBox.fZ1]);

	var fTempFunc=function(pPoints,iPoint,iToPoint1,iToPoint2,iToPoint3)
	{
		for(var i=0;i<3;i++)
		{
			pPoints[arguments[i+2]][0].subtract(pPoints[iPoint][0],pPoints[iPoint][i+1]);
			if(pPoints[iPoint][i+1].length()>fMinSize)
			{
				pPoints[iPoint][i+1].scale(0.1);
			}
			pPoints[iPoint][i+1].add(pPoints[iPoint][0]);
		}
	}

	fTempFunc(pPoints,0,1,2,4);
	fTempFunc(pPoints,1,0,3,5);
	fTempFunc(pPoints,2,0,3,6);
	fTempFunc(pPoints,3,1,2,7);
	fTempFunc(pPoints,4,0,5,6);
	fTempFunc(pPoints,5,1,4,7);
	fTempFunc(pPoints,6,2,4,7);
	fTempFunc(pPoints,7,3,5,6);

	for(i=0;i<8;i++)
	{
		for(j=0;j<4;j++)
		{
			for(k=0;k<3;k++)
			{
				pVertexes[i*12+j*3+k]=pPoints[i][j].pData[k];
			}
		}
	}
	pInd = [0, 1, 0, 2, 0, 3,
		4, 5, 4, 6, 4, 7,
		8, 9, 8,10, 8,11,
		12,13,12,14,12,15,
		16,17,16,18,16,19,
		20,21,20,22,20,23,
		24,25,24,26,24,27,
		28,29,28,30,28,31];

	for(i in pInd)
	{
		pIndexes[i]=pInd[i];
	}

	return true;
}
a.computeDataForCascadeBoundingBox = computeDataForCascadeBoundingBox;

Enum([
         FAST,
         MINIMAL
     ], SPHERE_CALCULATION_TYPE, a.TSPHERE);

/**
 * Computes a bounding sphere.
 * @property computeBoundingSphereFast (VertexData pVertexData, Sphere pSphere, SPHERE_CALCULATION_TYPE eSphereType,Rect3D pBoundingBox)
 * @tparam VertexData VertexData.
 * @tparam pBoundingBox Bounding rect
 * @tparam pSphere BoundingSphere
 * @tparam eSphereType Type of BoundingSphere
 * @treturn Boolean
 */
function computeBoundingSphere( pVertexData, pSphere, eSphereType, pBoundingBox)
{
	if(!eSphereType||eSphereType==a.TSPHERE.FAST)
	{
		return a.computeBoundingSphereFast ( pVertexData, pSphere,pBoundingBox);
	}
	else
	{
		return a.computeBoundingSphereMinimal (pVertexData, pSphere);
	}

}

a.computeBoundingSphere=computeBoundingSphere;


 /**
 * Computes a bounding sphere - not minimal. Also if it need compute dounding box
 * @property computeBoundingSphereFast (VertexData pVertexData, Sphere pSphere,Rect3D pBoundingBox)
 * @tparam VertexData VertexData.
 * @tparam Rect3d pBoundingBox Bounding rect
 * @tparam pSphere BoundingSphere
 * @treturn Boolean
 */
function computeBoundingSphereFast ( pVertexData, pSphere,pBoundingBox)
{
    var i;
	var pVertexDeclaration,pVertexElement;
	var nCount,nStride;
	var pData, pTempData ;

	if(!pSphere||!pVertexData)
	{
		return false;
	}


	pVertexDeclaration=pVertexData.getVertexDeclaration();
	if(!pVertexDeclaration)
		return false;


	pVertexElement=pVertexDeclaration.element(a.DECLUSAGE.POSITION,3);
	if(!pVertexDeclaration)
		return false;


	nCount=pVertexData.length;
	nStride=pVertexElement.iSize;

	pData=pVertexData.getData(pVertexElement.iOffset,pVertexElement.iSize);
	if (!pData)
		return false;

	if (!pBoundingBox)
	{
		pBoundingBox=new Rect3d();
	}
	if (pBoundingBox.isClear())
	{
		if(!a.computeBoundingBox(pVertexData,pBoundingBox))
		{
			return false;
		}
    }

    var fCenterX = (pBoundingBox.fX0 + pBoundingBox.fX1) / 2;
    var fCenterY = (pBoundingBox.fY0 + pBoundingBox.fY1) / 2;
    var fCenterZ = (pBoundingBox.fZ0 + pBoundingBox.fZ1) / 2;
    var fRadius = 0;
    var fDistance = 0;
    for (i = 0; i < nStride * nCount; i += nStride)
	{
		pTempData = new Float32Array(pData, i, 3);
        fDistance = (pTempData[0] - fCenterX) * (pTempData[0] - fCenterX) +
            (pTempData[1] - fCenterY) * (pTempData[1] - fCenterY) +
            (pTempData[2] - fCenterZ) * (pTempData[2] - fCenterZ);
        fRadius = fDistance > fRadius ? fDistance : fRadius;
    }
	pSphere.set(fCenterX,fCenterY,fCenterZ,Math.sqrt(fRadius));
    return true;
}
;
a.computeBoundingSphereFast = computeBoundingSphereFast;




/**
 * Computes a bounding sphere - minimal.
 * computeBoundingSphereMinimal (VertexData pVertexData,Sphere pSphere)
 * @tparam pVertexBuffer VertexData
 * @tparam pSphere BoundingSphere
 * @treturn Boolean
 */
function computeBoundingSphereMinimal (pVertexData, pSphere)
{
    var i = 0, j = 0, k = 0;
    var points = [];
    var length = 0;
    var isAdd = false;
    var isNew = true;
    var fDiametr = 0;
    var fDistance = 0;

	var pVertexDeclaration,pVertexElement;
	var nCount,nStride;
	var pData, pTempData1,pTempData2;

	if(!pSphere||!pVertexData)
	{
		return false;
	}

	pVertexDeclaration=pVertexData.getVertexDeclaration();
	if(!pVertexDeclaration)
		return false;

	pVertexElement=pVertexDeclaration.element(a.DECLUSAGE.POSITION,3);
	if(!pVertexDeclaration)
		return false;

	nCount=pVertexData.length;
	nStride=pVertexElement.iSize;

	pData=pVertexData.getData(pVertexElement.iOffset,pVertexElement.iSize);
	if (!pData)
		return false;


    for (i = 0; i < nStride * nCount; i += nStride) {
        isNew = true;
        isAdd = false;
        pTempData1 = new Float32Array(pData, i, 3);
        for (k = 0; k < points.length; k += 3) {
            if (points[k] == pTempData1[0] &&
                points[k + 1] == pTempData1[1] &&
                points[k + 2] == pTempData1[2]) {
                isNew = false;
                break;
            }
        }
        if (isNew) {
            for (j = i + nStride; j < nStride * nCount; j += nStride) {
                pTempData2 = new Float32Array(pData, j, 3);
                fDistance = (pTempData1[0] - pTempData2[0]) * (pTempData1[0] - pTempData2[0]) +
                    (pTempData1[1] - pTempData2[1]) * (pTempData1[1] - pTempData2[1]) +
                    (pTempData1[2] - pTempData2[2]) * (pTempData1[2] - pTempData2[2]);
                if (fDistance > fDiametr) {
                    fDiametr = fDistance;
                    isAdd = true;
                    points[0] = pTempData2[0];
                    points[1] = pTempData2[1];
                    points[2] = pTempData2[2];
                    length = 3;
                }
                else if (fDistance.toFixed(7) == fDiametr.toFixed(7)) {
                    isAdd = true;
                    for (k = 0; k < points.length; k += 3) {
                        if (points[k] == pTempData2[0] &&
                            points[k + 1] == pTempData2[1] &&
                            points[k + 2] == pTempData2[2]) {
                            isNew = false;
                            break;
                        }
                    }
                    if (isNew) {
                        points[length] = pTempData2[0];
                        points[length + 1] = pTempData2[1];
                        points[length + 2] = pTempData2[2];
                        length += 3;
                    }
                }
            }
            if (isAdd) {
                points[length] = pTempData1[0];
                points[length + 1] = pTempData1[1];
                points[length + 2] = pTempData1[2];
                length += 3
            }
        }
    }
    var fX = 0, fY = 0, fZ = 0;
    for (i = 0; i < points.length; i += 3) {
        fX += points[i];
        fY += points[i + 1];
        fZ += points[i + 2];
    }
    var x = pSphere.v3fCenter.pData.X = fX / points.length * 3;
    var y = pSphere.v3fCenter.pData.Y = fY / points.length * 3;
    var z = pSphere.v3fCenter.pData.Z = fZ / points.length * 3;
    pSphere.fRadius = Math.sqrt((points[0] - x) * (points[0] - x) +
                                    (points[1] - y) * (points[1] - y) +
                                    (points[2] - z) * (points[2] - z));
    return true;
}
;
a.computeBoundingSphereMinimal = computeBoundingSphereMinimal;


function computeGeneralizingSphere (pSphereA, pSphereB, pSphereDest)
{
    if (!pSphereDest)
	{
        pSphereDest = pSphereA;
    }

    var fR1 = pSphereA.fRadius;
    var fR2 = pSphereB.fRadius;
    var v3fC1 = pSphereA.v3fCenter;
    var v3fC2 = pSphereB.v3fCenter;

    var v3fD = new Vec3;
    v3fC1.subtract(v3fC2, v3fD);

    var fD = v3fD.length();

    if (fD < fR1 && fR1 > fR2) {
        pSphereDest.set(pSphereA);
        return;
    }

    if (fD < fR2) {
        pSphereDest.set(pSphereB);
        return;
    }

    var v3fN = new Vec3;
    v3fD.normalize(v3fN);

    pSphereDest.fRadius = v3fD.add(v3fN.scale(fR1 + fR2)).length() / 2.0;

    var v3fTemp = v3fD;
    pSphereDest.v3fCenter =
        v3fC1.add(v3fC2, v3fTemp).add(v3fN.scale((fR1 - fR2) / (fR1 + fR2))).scale(.5);
}

A_NAMESPACE(computeGeneralizingSphere);

/**
 * Computes data for cascade BoundingSphere
 * @property computeDataForCascadeBoundingBox(Sphere pBoundingSphere, Array pVertexs, Array pIndexes, Float fMinSize)
 * @tparam pBoundingSphere BoundingSphere
 * @tparam pVertexs координаты вершин
 * @tparam pIndexes индексы вершин
 * @tparam fMinSize минимальный размер рисочек
 * @treturn Boolean
 */
function computeDataForCascadeBoundingSphere(pBoundingSphere,pVertexes,pIndexes, fMinSize)
{
	var fTheta,fDelta, fAlpha;
	var nCount=10;
	var i,j,k,a;
	fDelta= 2*Math.PI/nCount;

	for(i=0;i<=nCount/2;i++)
	{
		fTheta=-Math.PI+(i*fDelta);
		for(j=0;j<=nCount;j++)
		{
			fAlpha=j*fDelta;
			pVertexes[(i*(nCount+1)+j)*3+0]=pBoundingSphere.v3fCenter.pData.X+pBoundingSphere.fRadius*Math.sin(fTheta)*Math.cos(fAlpha);
			pVertexes[(i*(nCount+1)+j)*3+1]=pBoundingSphere.v3fCenter.pData.Y+pBoundingSphere.fRadius*Math.sin(fTheta)*Math.sin(fAlpha);
			pVertexes[(i*(nCount+1)+j)*3+2]=pBoundingSphere.v3fCenter.pData.Z+pBoundingSphere.fRadius*Math.cos(fTheta);
		}
	}

	for(i=0;i<nCount/2;i++)
	{
		for(j=0;j<nCount;j++)
		{
			pIndexes[(i*(nCount)+j)*12+0]=i*(nCount+1)+j;
			pIndexes[(i*(nCount)+j)*12+1]=i*(nCount+1)+j+1;

			pIndexes[(i*(nCount)+j)*12+2]=i*(nCount+1)+j+2+nCount;
			pIndexes[(i*(nCount)+j)*12+3]=i*(nCount+1)+j;

			pIndexes[(i*(nCount)+j)*12+4]=i*(nCount+1)+j+1;
			pIndexes[(i*(nCount)+j)*12+5]=i*(nCount+1)+j+2+nCount;

			pIndexes[(i*(nCount)+j)*12+6]=i*(nCount+1)+j;
			pIndexes[(i*(nCount)+j)*12+7]=i*(nCount+1)+j+1+nCount;

			pIndexes[(i*(nCount)+j)*12+8]=i*(nCount+1)+j+2+nCount;
			pIndexes[(i*(nCount)+j)*12+9]=i*(nCount+1)+j+1+nCount;

			pIndexes[(i*(nCount)+j)*12+10]=i*(nCount+1)+j+2+nCount;
			pIndexes[(i*(nCount)+j)*12+11]=i*(nCount+1)+j;
		}
	}

	return true;
}

a.computeDataForCascadeBoundingSphere=computeDataForCascadeBoundingSphere;



