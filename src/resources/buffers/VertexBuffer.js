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

	
	this._pDevice.bindBuffer(a.BTYPE.ARRAY_BUFFER, this._pBuffer);
	this._pDevice.bufferData(a.BTYPE.ARRAY_BUFFER, this._iByteSize, eUsage);
	if (pData) 
	{
		this._pDevice.bufferSubData(a.BTYPE.ARRAY_BUFFER, 0, (pData.buffer));
	}
	
	this._pDevice.bindBuffer(a.BTYPE.ARRAY_BUFFER, null);

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
    this._pDevice.bindBuffer(a.BTYPE.ARRAY_BUFFER, this._pBuffer);

	
	debug_assert(pData.byteLength<=iSize, "Размер переданного массива больше переданного размера");
	debug_assert(this.size>=iOffset+iSize, "Данные выйдут за предел буфера");
	
	
	
	this._pDevice.bufferSubData(a.BTYPE.ARRAY_BUFFER, iOffset,
                                    new Uint8Array(pData.slice(0,iSize)));
  
    this._pDevice.bindBuffer(a.BTYPE.ARRAY_BUFFER, null);
	
	if (TEST_BIT(this._iTypeFlags, a.VBufferBase.RamBackupBit)) 
	{
        this._pBackupCopy.set(new Uint8Array(pData.slice(0,iSize)),iOffset);
    }
	return true;
}


VertexBuffer.prototype.resize=function(iSize) {
	var eUsage;
	var pData;
	var iMax=0;
	var pVertexData;
	
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

    if (!this._pBuffer) 
	{
        this._pBuffer = null;
        debug_error("Не удалось создать буфер");
        this.destroy();
        return false;
    } 

	
	this._pDevice.bindBuffer(a.BTYPE.ARRAY_BUFFER, this._pBuffer);
	this._pDevice.bufferData(a.BTYPE.ARRAY_BUFFER, iSize, eUsage);
	
	pData=this.getData(0,this._iByteSize);
	this._pDevice.bufferSubData(a.BTYPE.ARRAY_BUFFER, 0,pData);	
	this._pBackupCopy=new Uint8Array(iSize);	
	this.setData(pData,0,this._iByteSize);
	
	
	this._pDevice.bindBuffer(a.BTYPE.ARRAY_BUFFER, null);	
	this._iByteSize=iSize;	
	
	return true;
}

/**
 * @property activate()
 * Активировать буфер
 * @memberof VertexBuffer
 **/
VertexBuffer.prototype.activate = function () 
{
    debug_assert(this.isValid(), "Attempting to activate  an invalid buffer");    
    this._pDevice.bindBuffer(a.BTYPE.ARRAY_BUFFER, this._pBuffer);            
}

VertexBuffer.prototype.bind = function () {
    this._pDevice.bindBuffer(a.BTYPE.ARRAY_BUFFER, this._pBuffer);
}

VertexBuffer.prototype.unbind = function () {
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
 * @treturn Rect3d Bounding rect
 */
function computeBoundingBox (pVertexBuffer, nCount, nStride, v3fMin, v3fMax) {
    if (pVertexBuffer && nCount !== undefined && nStride !== undefined) {
        var fX0 = 0, fY0 = 0, fZ0 = 0,
            fX1 = 0, fY1 = 0, fZ1 = 0;
        var fTemp;
        var i = 0;
        var pData = pVertexBuffer.getData();
        if (pData) {
            var pTempData;
			
            pTempData = new Float32Array(pData, i, 3);
            fX0 = fX1 = pTempData[0];
            fX1 = fY1 = pTempData[1];
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
            v3fMin.X = fX0;
            v3fMin.Y = fY0;
            v3fMin.Z = fZ0;

            v3fMax.X = fX1;
            v3fMax.Y = fY1;
            v3fMax.Z = fZ1;
            return true;
        }
    }
    return false;
}
;

a.computeBoundingBox = computeBoundingBox;
Enum([
         FAST,
         MINIMAL
     ], SPHERE_CALCULATION_TYPE, a.Sphere);
/**
 * Computes a bounding sphere - not minimal. Also if it need compute dounding box
 * @tparam VertexBuffer pVertexBuffer
 * @tparam Int nCount Number of vertices.
 * @tparam Rect3d pRect Bounding rect
 * @tparam Float32Array v4fOut Out vector, (x,y,z) - center of sphere, w - radius sphere.
 * @treturn Float32Array Output vector
 */
function computeBoundingSphereFast (pVertexBuffer, nCount, pRect, v4fOut) {
    var fX0 = 0, fY0 = 0, fZ0 = 0,
        fX1 = 0, fY1 = 0, fZ1 = 0;
    var i = 0;
    var data = pVertexBuffer.getData();
    if (pRect) {
        fX0 = pRect.fX0;
        fY0 = pRect.fY0;
        fZ0 = pRect.fZ0;
        fX1 = pRect.fX1;
        fY1 = pRect.fY1;
        fZ1 = pRect.fZ1;
    }
    if (!pRect || pRect.isClear()) {
        var fTemp;
        if (nCount) {
            fX0 = fX1 = data[i];
            fX1 = fY1 = data[i + 1];
            fZ0 = fZ1 = data[i + 2];
            for (i = 3; i < 3 * nCount; i += 3) {
                fTemp = data[i];
                fX0 = fX0 > fTemp ? fTemp : fX0; //Min
                fX1 = fX1 > fTemp ? fX1 : fTemp; //Max

                fTemp = data[i + 1];
                fY0 = fY0 > fTemp ? fTemp : fY0; //Min
                fY1 = fY1 > fTemp ? fY1 : fTemp; //Max

                fTemp = data[i + 2];
                fZ0 = fZ0 > fTemp ? fTemp : fZ0; //Min
                fZ1 = fZ1 > fTemp ? fZ1 : fTemp; //Max
            }
        }
        if (pRect) {
            pRect.fX0 = fX0;
            pRect.fY0 = fY0;
            pRect.fZ0 = fZ0;
            pRect.fX1 = fX1;
            pRect.fY1 = fY1;
            pRect.fZ1 = fZ1;
        }
    }
    if (!v4fOut) {
        v4fOut = Vec4.create();
    }
    var fCenterX = (fX0 + fX1) / 2;
    var fCenterY = (fY0 + fY1) / 2;
    var fCenterZ = (fZ0 + fZ1) / 2;
    var fRadius = 0;
    var fDistance = 0;
    for (i = 0; i < 3 * nCount; i += 3) {
        fDistance = (data[i] - fCenterX) * (data[i] - fCenterX) +
            (data[i + 1] - fCenterY) * (data[i + 1] - fCenterY) +
            (data[i + 2] - fCenterZ) * (data[i + 2] - fCenterZ);
        fRadius = fDistance > fRadius ? fDistance : fRadius;
    }
    v4fOut[0] = fCenterX;
    v4fOut[1] = fCenterY;
    v4fOut[2] = fCenterZ;
    v4fOut[3] = Math.sqrt(fRadius);
    return v4fOut;
}
;
a.computeBoundingSphereFast = computeBoundingSphereFast;
/**
 * Computes a bounding sphere - minimal.
 * @tparam VertexBuffer pVertexBuffer
 * @tparam Int nCount Number of vertices.
 * @tparam Float32Array v4fOut Out vector, (x,y,z) - center of sphere, w - radius sphere.
 * @treturn Float32Array Output vector
 */
function computeBoundingSphereMinimal (pVertexBuffer, nCount, nStride, pSphere) {
    var pData = pVertexBuffer.getData();
    if (!pData || !pSphere) {
        return false;
    }
    var i = 0, j = 0, k = 0;
    var points = [];
    var length = 0;
    var isAdd = false;
    var isNew = true;

    var fDiametr = 0;
    var fDistance = 0;

    var pTempData1;
    var pTempData2;
    //

    for (i = 0; i < nStride * nCount; i += nStride) {
        isNew = true;
        isAdd = false;
        pTempData1 = new Float32Array(pData.buffer, i, 3);
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
                pTempData2 = new Float32Array(pData.buffer, j, 3);
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
    var x = pSphere.v3fCenter.X = fX / points.length * 3;
    var y = pSphere.v3fCenter.Y = fY / points.length * 3;
    var z = pSphere.v3fCenter.Z = fZ / points.length * 3;
    pSphere.fRadius = Math.sqrt((points[0] - x) * (points[0] - x) +
                                    (points[1] - y) * (points[1] - y) +
                                    (points[2] - z) * (points[2] - z));
    return true;
}
;
a.computeBoundingSphereMinimal = computeBoundingSphereMinimal;

function computeGeneralizingSphere (pSphereA, pSphereB, pSphereDest) {
    if (!pSphereDest) {
        pSphereDest = pSphereA;
    }

    var fR1 = pSphereA.fRadius;
    var fR2 = pSphereB.fRadius;
    var v3fC1 = pSphereA.v3fCenter;
    var v3fC2 = pSphereB.v3fCenter;

    var v3fD = new Vector3;
    Vec3.subtract(v3fC1, v3fC2, v3fD);

    var fD = Vec3.length(v3fD);

    if (fD < fR1 && fR1 > fR2) {
        pSphereDest.set(pSphereA);
        return;
    }

    if (fD < fR2) {
        pSphereDest.set(pSphereB);
        return;
    }

    var v3fN = new Vector3;
    Vec3.normalize(v3fD, v3fN);

    pSphereDest.fRadius = Vec3.length(Vec3.add(v3fD, Vec3.scale(v3fN, fR1 + fR2))) / 2.0;

    var v3fTemp = v3fD;
    pSphereDest.v3fCenter =
        Vec3.scale(Vec3.add(Vec3.add(v3fC1, v3fC2, v3fTemp), Vec3.scale(v3fN, (fR1 - fR2) / (fR1 + fR2))), .5);
}

a.computeGeneralizingSphere = computeGeneralizingSphere;






