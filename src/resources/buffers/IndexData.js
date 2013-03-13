/**
 * @file
 * @brief IndexData class.
 * @author xoma
 * @email xoma@odserve.org
 * ���� � IndexData
 **/
 
 

/**
 * @property IndexData()
 * �����������, ����������� ����� ��������� ������
 * @memberof IndexData
 **/
/**
 * IndexData Class
 * @ctor
 * Constructor of IndexData class
 **/
function IndexData(pIndexBuffer,iOffset,iCount,ePrimitiveType,eElementsType) 
{
	debug_assert(pIndexBuffer,"������ ������ �� ������� ��� �������� IndexData");
	/**
	* ��������� �� �����, �������� ����������� IndexData
	* @type IndexBuffer
	* @memberof IndexData
	**/
	this._pIndexBuffer=pIndexBuffer; 

	/**
	* Offset � �������� ���������� IndexData
	* @type Int
	* @memberof IndexData
	**/
	this._iOffset=iOffset;
	
	/**
	* ���������� ��������� � IndexData
	* @type Int
	* @memberof IndexData
	**/ 	
	this._iCount=iCount;	
	

	/**
     * ���� ��������� ���������� � IndexData. List, strip, fan?
     * @type Enumeration
     * @memberof IndexData
     **/
	if(ePrimitiveType!=undefined)
	{
		this._ePrimitiveType = ePrimitiveType;
	}
	else
	{
		this._ePrimitiveType = a.PRIMTYPE.TRIANGLELIST;
	}
	
	/**
     * ��� ��������� IndexData
     * @type Int
     * @memberof IndexData
     **/
	if(eElementsType!=undefined)
	{
		this._eElementsType = eElementsType;  
	}
	else
	{
		this._eElementsType = a.DTYPE.UNSIGNED_SHORT;  
	}
	
	debug_assert(this._eElementsType == a.DTYPE.UNSIGNED_BYTE || this._eElementsType == a.DTYPE.UNSIGNED_SHORT, "��� �������� �� ���������� ���� ��� ���");
	
	debug_assert(this._pIndexBuffer.getSize()>=this.getSize()+this.getOffset(),"IndexData ������� �� ������� IndexBuffer");
	
}
 

IndexData.prototype.destroy = function () 
{
    this._pIndexBuffer=null;
	this._iOffset=undefined;
	this._iCount=undefined;
	this._ePrimitiveType=undefined;
	this._eElementsType=undefined;
}
 
 
/**
 * @property getOffset()
 * ���������� ������ IndexData � ��������� ������
 * @memberof IndexData
 * @return Int
 **/
IndexData.prototype.getOffset = function () {
    return this._iOffset;
}

/**
 * @property getPrimitiveType()
 * ���������� ��� ����������
 * @memberof IndexBuffer
 * @return Int
 **/
IndexData.prototype.getPrimitiveType = function () 
{
    return this._ePrimitiveType;
}



/**
 * @property getType()
 * ���������� ��� ��������� � ������
 * @memberof IndexBuffer
 * @return Int
 **/
IndexData.prototype.getType = function () {
    return this._eElementsType;
}

 /**
 * @property getCount()
 * ���������� �������� � IndexData
 * @memberof IndexData
 * @return Int
 **/ 
IndexData.prototype.getCount = function () 
{
	return this._iCount;
}

 /**
 * @property getIndexSize()
 * ������ ������ ������� � ������
 * @memberof IndexData
 * @return Int
 **/ 
IndexData.prototype.getIndexSize = function () 
{
	return a.getTypeSize(this.getType());
}

 /**
 * @property getSize()
 * ������ IndexData
 * @memberof IndexData
 * @return Int
 **/ 
IndexData.prototype.getSize = function () 
{
	return this.getCount()*a.getTypeSize(this.getType());
}


/**
 * @property getData(int iOffset, int iSize)
 * ���������� ��������� �� ��������� ����� ������
 * @return Uint8Array
 **/
IndexData.prototype.getData = function (iOffset, iSize) 
{
	debug_assert(iOffset+iSize<=this.getSize(),"������������� �������� ������� �� ������� IndexData");
	return this._pIndexBuffer.getData(this.getOffset()+iOffset,iSize);  
}

/**
 * @property setData(ArrayBuffer pData,Int iOffset, Int iSize)
 * @param pData ������ ������ ����
 * @param ����� �������� � �������� ����� ����������
 * @param ���������� ������
 * ��������� ����������� �������� � ������
 * @return Boolean
 **/
IndexData.prototype.setData = function (pData, iOffset, iCount) 
{
	debug_assert((iOffset+iCount)*this.getIndexSize()<=this.getSize(),"�������� ������� �� ������� IndexData");
	return this._pIndexBuffer.setData(pData.buffer,this.getOffset()+iOffset*this.getIndexSize(),iCount*this.getIndexSize());
}

IndexData.prototype.activate=function()
{
	return this._pIndexBuffer.activate();
}

IndexData.prototype.drawElements=function()
{
	return this._pIndexBuffer.getDevice().drawElements(this.getPrimitiveType(), this.getCount(), this.getType(), this.getOffset());
}
/**
 * @property primitiveCount()
 * ���������� ���������� � IndexData, �������� ������� �������������
 * @memberof IndexData
 * @return Int
 **/

/**
 * @property primitiveCount(Int nIndexCount)
 * ���������� ���������� IndexData ������� ����� ������� nIndexCount �������
 * @memberof IndexData
 * @param indexCount
 * @return Int
 **/
IndexData.prototype.getPrimitiveCount = function () 
{    
	switch (arguments.length) 
	{
        case 0:
            // when no count is specified, use the total count of indices
            return this.getPrimitiveCount(this.getCount());
            break;
        case 1:
            var count = arguments[0] / 3;
            if (this._ePrimitiveType == a.PRIMTYPE.TRIANGLESTRIP
                || this._ePrimitiveType == a.PRIMTYPE.TRIANGLEFAN) 
			{
                count = arguments[0] - 2;
            }
            return count;
            break;
    }

	return undefined;
}

a.IndexData = IndexData;