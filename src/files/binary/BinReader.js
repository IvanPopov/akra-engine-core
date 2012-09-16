/**
 * @file
 * @author Nikita Zhilin
 * @brief Функции для преобразования бинорного массива в строки, числа и массивы.
 * @email svhost@inbox.ru
 */

/** @example binWriteRead.js
 * Пример использования данного класса.
 * Пример включает в себя почти все возможные виды записи и чтения.
 */
/** @example binReadWrireRead(file).js
 * Пример использования данного класса.
 * В примере читается бинарный файл выводится его структура, потом записывается
 * и читается снова.
 */

/**
 * Usage:
 * var br = new Binreader(data); type of data is ArrayBuffer
 * var string = bw.string();
 * var array = bw.stringArray()
 * var value = bw.uint8()
 * var value = bw.uint16()
 * var value = bw.uint32()
 * var array = bw.uint8Array()
 * var array = bw.uint16Array()
 * var array = bw.uint32Array()
 * var value = bw.int8()
 * var value = bw.int16()
 * var value = bw.int32()
 * var array = bw.int8Array()
 * var array = bw.int16Array()
 * var array = bw.int32Array()
 * var value = bw.float64()
 * var value = bw.float32()
 * var array = bw.float32Array()
 * var array = bw.float64Array()
 */

/**
 * Работает заебись, докуменитировать лень.
 */


Define(ARRAY_LIMIT(POSITION, LIMIT), function () {
    debug_assert(POSITION < LIMIT, "Выход за пределы массива");
});


function BinReaderBase (pBuffer, pOptions) {
   
    var iByteOffset = pOptions && pOptions.byteOffset? pOptions.byteOffset: 0;
    var iByteLength = pOptions && pOptions.byteLength? pOptions.byteLength: pBuffer.byteLength;

    this._pDataView = new DataView(pBuffer, iByteOffset, iByteLength);
    this.iPosition = 0;
}


/******************************************************************************/
/*                                 string                                     */
/******************************************************************************/

BinReaderBase.prototype.string = function (str) {
    var iStringLength = this.uint32();
    if (iStringLength == MAX_INT32) {
        return (str) ? str : null;
    }
    var iBitesToAdd = (( 4 - (iStringLength % 4) == 4)) ? 0 : ( 4 - (iStringLength % 4));
    iStringLength += iBitesToAdd;

    //Проверка на возможный выход за пределы массива.
    ARRAY_LIMIT(this.iPosition + iStringLength - 1, this._pDataView.byteLength)
    
    var pBuffer = new Uint8Array(iStringLength);

    for (var i = 0; i < iStringLength; i++) {
        pBuffer[i] = this._pDataView.getUint8(this.iPosition + i, true);
    }

    this.iPosition += iStringLength;
    var sString = "", charCode, code;
    for (var n = 0; n < pBuffer.length; ++n) {
        code = pBuffer[n];
        
        if (code == 0) {
            break;
        }

        charCode = String.fromCharCode(code);
        sString = sString + charCode;
    }

    sString = sString.fromUTF8();
    return sString;//sString.substr(0, iStringLength);//sString;//
}

/******************************************************************************/
/*                                   uintX                                    */
/******************************************************************************/
BinReaderBase.prototype.uint32 = function () {
    var i = this._pDataView.getUint32(this.iPosition, true);
    this.iPosition += 4;
    return i;
}

BinReaderBase.prototype.uint16 = function () {
    var i = this._pDataView.getUint16(this.iPosition, true);
    this.iPosition += 4;
    return i;
}

BinReaderBase.prototype.uint8 = function () {
    var i = this._pDataView.getUint8(this.iPosition, true);
    this.iPosition += 4;
    return i;
}

BinReaderBase.prototype.bool = function () {
    return (this.uint8() ? true : false);
}


/******************************************************************************/
/*                                    intX                                    */
/******************************************************************************/
BinReaderBase.prototype.int32 = function () {
    var i = this._pDataView.getInt32(this.iPosition, true);
    this.iPosition += 4;
    return i;
}

BinReaderBase.prototype.int16 = function () {
    var i = this._pDataView.getInt16(this.iPosition, true);
    this.iPosition += 4;
    return i;
}

BinReaderBase.prototype.int8 = function () {
    var i = this._pDataView.getInt8(this.iPosition, true);
    this.iPosition += 4;
    return i;
}

/******************************************************************************/
/*                                  floatX                                    */
/******************************************************************************/

BinReaderBase.prototype.float32 = function () {
    var f = this._pDataView.getFloat32(this.iPosition, true);
    this.iPosition += 4;
    return f;
}

BinReaderBase.prototype.float64 = function () {
    var f = this._pDataView.getFloat64(this.iPosition, true);
    this.iPosition += 8;
    return f;
}


/******************************************************************************/
/*                             stringArray                                    */
/******************************************************************************/
BinReaderBase.prototype.stringArray = function () {
    var iLength = this.uint32();
    if (iLength == MAX_INT32) {
        return null;
    }
    var pArray = new Array(iLength);
    
    for (var i = 0; i < iLength; i++) {
        pArray[i] = this.string();
    }

    return pArray;
}

/******************************************************************************/
/*                             uintXArray                                     */
/******************************************************************************/
BinReaderBase.prototype._uintXArray = function (iX) {
    var iLength = this.uint32();
    if (iLength == MAX_INT32) {
        return null;
    }

    var iBytes = iX / 8;
    var pArray;
    
    switch (iBytes) {
        case 1:
            pArray = new Uint8Array(iLength);
            
            for (var i = 0; i < iLength; i++) {
                pArray[i] = this._pDataView.getUint8(this.iPosition + i * iBytes, true);
            }

            break;
        case 2:
            pArray = new Uint16Array(iLength);
            
            for (var i = 0; i < iLength; i++) {
                pArray[i] = this._pDataView.getUint16(this.iPosition + i * iBytes, true);
            }
            
            break;
        case 4:
            pArray = new Uint32Array(iLength);
            
            for (var i = 0; i < iLength; i++) {
                pArray[i] = this._pDataView.getUint32(this.iPosition + i * iBytes, true);
            }
            
            break;  
        default:
            error('unsupported array length detected: ' + iBytes);  
    }
   
    var iByteLength = iBytes * iLength;
    iByteLength += -iByteLength & 3;

    this.iPosition += iByteLength;

    return pArray;
}

BinReaderBase.prototype.uint8Array = function () {
    return this._uintXArray(8);
}

BinReaderBase.prototype.uint16Array = function () {
    return this._uintXArray(16);
}

BinReaderBase.prototype.uint32Array = function () {
    return this._uintXArray(32);
}



/******************************************************************************/
/*                               intXArray                                    */
/******************************************************************************/
BinReaderBase.prototype._intXArray = function (iX) {
    var iLength = this.uint32();
    if (iLength == MAX_INT32) {
        return null;
    }

    var iBytes = iX / 8;
    var pArray;
    
    switch (iBytes) {
        case 1:
            pArray = new Int8Array(iLength);
            
            for (var i = 0; i < iLength; i++) {
                pArray[i] = this._pDataView.getInt8(this.iPosition + i * iBytes, true);
            }

            break;
        case 2:
            pArray = new Int16Array(iLength);
            
            for (var i = 0; i < iLength; i++) {
                pArray[i] = this._pDataView.getInt16(this.iPosition + i * iBytes, true);
            }
            
            break;
        case 4:
            pArray = new Int32Array(iLength);
            
            for (var i = 0; i < iLength; i++) {
                pArray[i] = this._pDataView.getInt32(this.iPosition + i * iBytes, true);
            }
            
            break;  
        default:
            error('unsupported array length detected: ' + iBytes);  
    }
   
    var iByteLength = iBytes * iLength;
    iByteLength += -iByteLength & 3;

    this.iPosition += iByteLength;

    return pArray;
}

BinReaderBase.prototype.int8Array = function () {
    return this._intXArray(8);
}

BinReaderBase.prototype.int16Array = function () {
    return this._intXArray(16);
}

BinReaderBase.prototype.int32Array = function () {
    return this._intXArray(32);
}



/******************************************************************************/
/*                              floatXArray                                   */
/******************************************************************************/
BinReaderBase.prototype._floatXArray = function (iX) {
    var iLength = this.uint32();
    if (iLength == MAX_INT32) {
        return null;
    }

    var iBytes = iX / 8;
    var pArray;

    switch (iBytes) {
        case 4:
            pArray = new Float32Array(iLength);
            
            for (var i = 0; i < iLength; i++) {
                pArray[i] = this._pDataView.getFloat32(this.iPosition + i * iBytes, true);
            }
            
            break;
        case 8:
            pArray = new Float64Array(iLength);
            
            for (var i = 0; i < iLength; i++) {
                pArray[i] = this._pDataView.getFloat64(this.iPosition + i * iBytes, true);
            }
            
            break; 
        default:
            error('unsupported array length detected: ' + iBytes);   
    }
   
    var iByteLength = iBytes * iLength;
    iByteLength += -iByteLength & 3;

    this.iPosition += iByteLength;

    return pArray;
}

BinReaderBase.prototype.float32Array = function () {
    return this._floatXArray(32);
}

BinReaderBase.prototype.float64Array = function () {
    return this._floatXArray(64);
}





function BinReader (pBuffer, pOptions) {
    A_CLASS;

    this._pHashTable = null;
    this._pTemplate = a.binaryTemplate;
    this._pPositions = [];
    this._pOptions = null;

    if (pOptions) {
        this.setOptions(pOptions);
    }
}

EXTENDS(BinReader, BinReaderBase);

PROPERTY(BinReader, 'template',
    function () {
        return this._pTemplate;
    },
    function (pTemplate) {
        this._pTemplate = pTemplate;
    });

PROPERTY(BinReader, 'options',
    function () {
        return this._pOptions;
    });

BinReader.prototype.setOptions = function (pOptions) {
    'use strict';
    
    this._pOptions = pOptions;
};


BinReader.prototype.pushPosition = function (iPosition) {
    'use strict';
    
    this._pPositions.push(this.iPosition);
    this.iPosition = iPosition;
};

BinReader.prototype.popPosition = function () {
    'use strict';
    
    this.iPosition = this._pPositions.pop();
};

BinReader.prototype.setupHashTable = function () {
    'use strict';
    
    if (!this._pHashTable) {
        this._pHashTable = {};
    }
};

BinReader.prototype.memof = function (pObject, iAddr) {
    'use strict';
    
    this._pHashTable[iAddr] = pObject;
};

BinReader.prototype.memread = function (iAddr) {
    'use strict';
    
    return this._pHashTable[iAddr] || null;
};

BinReader.prototype.readPtr = function (iAddr, sType, pObject) {
    'use strict';
    
    pObject = pObject || null;

    if (iAddr === MAX_UINT32) {
        return null;
    }

    var pTmp = this.memread(iAddr);
    var isReadNext = false;
    var iType = -1;
    var fnReader = null;
    var iPosition;
    var pTemplate = this.template;
    var pProperties;
    var pBaseClasses = null;
    var pMembers = null;
    var pType;
    var pValue;

    if (pTmp) {
        return pTmp;
    }

    if (iAddr === this.iPosition) {
        isReadNext = true;
    }
    else {
        //set new position
        this.pushPosition(iAddr);
    }

    pProperties = pTemplate.properties(sType);

    debug_assert(pProperties, 'unknown object <' + sType + '> type cannot be readed');

    fnReader = pProperties.read;

    //read primal type
    if (fnReader) {
        pTmp = fnReader.call(this, pObject);
        this.memof(pTmp, iAddr);
        
        //restore prev. position
        if (!isReadNext) {
            this.popPosition();
        }

        return pTmp;
    }
    
    if (!pObject) {
        var pCtor = pProperties.ctor;

        if (typeof pCtor === 'string' || !pCtor) {
            eval('pObject = new ' + (pCtor || sType) + ';');   
        }
        else {
            pObject = pCtor.call(this);
        }
    }

    pBaseClasses = pProperties.base;

    if (pBaseClasses) {
        for (var i = 0; i < pBaseClasses.length; ++ i) {
            iAddr = this.iPosition;
            this.readPtr(iAddr, pBaseClasses[i], pObject);
        }
    }

    this.memof(pObject, iAddr);

    pMembers = pProperties.members

    if (pMembers) {
         for (var sName in pMembers) {
            if (pMembers[sName] === null || 
                typeof pMembers[sName] === 'string' ||
                typeof pMembers[sName].read === 'string') {
                pObject[sName] = this.read();
                continue;
            }

            pValue = pMembers[sName].read.call(this, pObject);
            if (pValue !== undefined) {
                pObject[sName] = pValue;
            }
        }
    }

    //restore prev. position
    if (!isReadNext) {
        this.popPosition();
    }

    return pObject;
}

BinReader.prototype.read = function() {
    'use strict';

    this.setupHashTable();
    
    var iAddr = this.uint32();

    if (iAddr === MAX_UINT32) {
        return null;
    }

    //this.extractHeader(iAddr);

    var iType = this.uint32();
    var sType = this.template.getType(iType);
    
    return this.readPtr(iAddr, sType);
};

BinReader.prototype.extractHeader = function (iAddr) {
    'use strict';
    
    if (this.iPosition === 4) {
        if (iAddr !== 8) {
            this.pushPosition(8);
            this.header(this.read());
            this.popPosition();
        }
    }
};

BinReader.prototype.header = function (pData) {
    'use strict';

    if (typeof pData === 'string') {
        warning('загрузка шаблонов извне не поддержвиаетя');
        return;
    }

    this.template = new a.BinTemplate(pData);
};

function undump (pBuffer, pOptions) {
    if (!pBuffer) {
        return null;
    }
    var pReader = new a.BinReader(pBuffer, pOptions);

    return pReader.read();
}

a.undump = undump;
a.BinReader = BinReader;
