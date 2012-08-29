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

Define(A_FORMAT_IN(format), function () {
    a.BinReader.template(format);
});

Define(A_FORMAT_OUT(format), function () {
    a.BinWriter.template(format);
});

Define(A_FORMAT(format), function () {
    (function (f) {
        a.BinReader.template(f);
        a.BinWriter.template(f);
    })(format);
});

function BinReader (arrayBuffer) {
    this.arrayBuffer = arrayBuffer;
    this.arrayUint8Buffer = new Uint8Array(arrayBuffer);
    this.arrayBufferLength = (new Uint8Array(arrayBuffer)).length;
    this.iPosition = 0;
    this._pHashTable = null;
}

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

/******************************************************************************/
/*                                 string                                     */
/******************************************************************************/

BinReader.prototype.string = function (str) {
    var iStringLength = this.uint32();
    if (iStringLength == 0xffffffff) {
        return (str) ? str : null;
    }
    var iBitesToAdd = (( 4 - (iStringLength % 4) == 4)) ? 0 : ( 4 - (iStringLength % 4));
    iStringLength += iBitesToAdd;

    //Проверка на возможный выход за пределы массива.
    ARRAY_LIMIT(this.iPosition + iStringLength - 1, this.arrayBufferLength)
    var arrayStringUTF8 = new Uint8Array(this.arrayBuffer, this.iPosition, iStringLength);

    this.iPosition += iStringLength;
    var sString = "", charCode, code;
    for (var n = 0; n < arrayStringUTF8.length; ++n) {
        code = arrayStringUTF8[n];
        
        if (code == 0) {
            break;
        }

        charCode = String.fromCharCode(code);
        sString = sString + charCode;
    }

    sString = sString.fromUTF8();
    return sString.substr(0, iStringLength);//sString;//
}

/******************************************************************************/
/*                                   uintX                                    */
/******************************************************************************/
BinReader.prototype._uintX = function (iX) {
    //Проверка на возможный выход за пределы массива.
    //Для массива состоящего только из числа uint 16 бит (2 элемента), начальной позиции ноль -> 0 + (16/8) - 1 < 2
    ARRAY_LIMIT(this.iPosition + 4 - 1, this.arrayBufferLength)

    switch (iX) {
        case 8:
            var iValue = (new Uint8Array(this.arrayBuffer, this.iPosition, 4))[0];
            break;
        case 16:
            var iValue = (new Uint16Array(this.arrayBuffer, this.iPosition, 2))[0];
            break;
        case 32:
            var iValue = (new Uint32Array(this.arrayBuffer, this.iPosition, 1))[0];
            break;
        default:
            error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.");
            break;
    }
    this.iPosition += 4;
    return iValue;
}

BinReader.prototype.uint8 = function () {
    return this._uintX(8);
}

BinReader.prototype.uint16 = function () {
    return this._uintX(16);
}

BinReader.prototype.uint32 = function () {
    return this._uintX(32);
}

BinReader.prototype.bool = function () {
    return (this._uintX(8) ? true : false);
}

/******************************************************************************/
/*                           _readArrayElementUintX                           */
/******************************************************************************/
BinReader.prototype._readArrayElementUintX = function (iX) {
    //Проверка на возможный выход за пределы массива.
    //Для массива состоящего только из числа uint 16 бит (2 элемента), начальной позиции ноль -> 0 + (16/8) - 1 < 2
    ARRAY_LIMIT(this.iPosition + (iX / 8) - 1, this.arrayBufferLength)

    switch (iX) {
        case 8:
            var iValue = (new Uint8Array(this.arrayBuffer, this.iPosition, 1))[0];
            this.iPosition += 1;
            break;
        case 16:
            var iValue = (new Uint16Array(this.arrayBuffer, this.iPosition, 1))[0];
            this.iPosition += 2;
            break;
        case 32:
            var iValue = (new Uint32Array(this.arrayBuffer, this.iPosition, 1))[0];
            this.iPosition += 4;
            break;
        default:
            error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.");
            break;
    }

    return iValue;
}

/******************************************************************************/
/*                                    intX                                    */
/******************************************************************************/
BinReader.prototype._intX = function (iX) {
    ARRAY_LIMIT(this.iPosition + 4 - 1, this.arrayBufferLength)

    switch (iX) {
        case 8:
            var iValue = (new Int8Array(this.arrayBuffer, this.iPosition, 4))[0];
            break;
        case 16:
            var iValue = (new Int16Array(this.arrayBuffer, this.iPosition, 2))[0];
            break;
        case 32:
            var iValue = (new Int32Array(this.arrayBuffer, this.iPosition, 1))[0];
            break;
        default:
            error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.");
            break;
    }
    this.iPosition += 4;
    return iValue;
}

BinReader.prototype.int8 = function () {
    return this._intX(8);
}

BinReader.prototype.int16 = function () {
    return this._intX(16);
}

BinReader.prototype.int32 = function () {
    return this._intX(32);
}

/******************************************************************************/
/*                          _readArrayElementIntX                             */
/******************************************************************************/
BinReader.prototype._readArrayElementIntX = function (iX) {
    ARRAY_LIMIT(this.iPosition + (iX / 8) - 1, this.arrayBufferLength)

    switch (iX) {
        case 8:
            var iValue = (new Int8Array(this.arrayBuffer, this.iPosition, 1))[0];
            this.iPosition += 1;
            break;
        case 16:
            var iValue = (new Int16Array(this.arrayBuffer, this.iPosition, 1))[0];
            this.iPosition += 2;
            break;
        case 32:
            var iValue = (new Int32Array(this.arrayBuffer, this.iPosition, 1))[0];
            this.iPosition += 4;
            break;
        default:
            error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.");
            break;
    }

    return iValue;
}


/******************************************************************************/
/*                                  floatX                                    */
/******************************************************************************/
BinReader.prototype._floatX = function (iX) {
    var tmpPosition = this.iPosition + (iX / 8) - 1;
    ARRAY_LIMIT(this.iPosition + (iX / 8) - 1, this.arrayBufferLength)


    switch (iX) {
        case 32:
            var fValue = (new Float32Array(this.arrayBuffer, this.iPosition, 1))[0];
            this.iPosition += 4;
            break;
        case 64:
            var arrUintTmp = new Uint8Array(8);
            for (var i = 0; i < 8; i++) {
                arrUintTmp[i] = this.arrayUint8Buffer[this.iPosition + i];
            }

            var arrFloatTmp = new Float64Array(arrUintTmp.buffer);
            //arrFloatTmp.set(arrUintTmp);

            //var fValue = (new Float64Array(this.arrayBuffer, this.iPosition, 1))[0];
            var fValue = arrFloatTmp[0];
            this.iPosition += 8;
            break;
        default:
            error("Передано недопустимое значение длинны. Допустимые значения 32, 64.");
            break;
    }

    return fValue;
}

BinReader.prototype.float32 = function () {
    return this._floatX(32);
}

BinReader.prototype.float64 = function () {
    return this._floatX(64);
}


/******************************************************************************/
/*                             stringArray                                    */
/******************************************************************************/
BinReader.prototype.stringArray = function () {
    var arrStringLength = this.uint32();
    if (arrStringLength == 0xffffffff) {
        return null;
    }
    var arrStrings = [];
    for (var i = 0; i < arrStringLength; i++) {
        arrStrings[i] = this.string();
    }
    return arrStrings;
}

/******************************************************************************/
/*                             uintXArray                                     */
/******************************************************************************/
BinReader.prototype._uintXArray = function (iX) {
    var arrUintLength = this.uint32();
    if (arrUintLength == 0xffffffff) {
        return null;
    }
    switch (iX) {
        case 8:
            var iBitesToAdd = (( 4 - (arrUintLength % 4) == 4)) ? 0 : ( 4 - (arrUintLength % 4));
            iBitesToAdd *= 1;
            var arrUint = new Uint8Array(arrUintLength);
            break;
        case 16:
            var iBitesToAdd = (( 2 - (arrUintLength % 2) == 2)) ? 0 : ( 2 - (arrUintLength % 2));
            iBitesToAdd *= 2;
            var arrUint = new Uint16Array(arrUintLength);
            break;
        case 32:
            var iBitesToAdd = 0;
            var arrUint = new Uint32Array(arrUintLength);
            break;
    }

    for (var i = 0; i < arrUintLength; i++) {
        arrUint[i] = this._readArrayElementUintX(iX);
    }
    this.iPosition += iBitesToAdd;
    return arrUint;
}

BinReader.prototype.uint8Array = function () {
    return this._uintXArray(8);
}

BinReader.prototype.uint16Array = function () {
    return this._uintXArray(16);
}

BinReader.prototype.uint32Array = function () {
    return this._uintXArray(32);
}


/******************************************************************************/
/*                               intXArray                                    */
/******************************************************************************/
BinReader.prototype._intXArray = function (iX) {
    var arrIntLength = this.uint32();
    if (arrIntLength == 0xffffffff) {
        return null;
    }

    switch (iX) {
        case 8:
            var iBitesToAdd = (( 4 - (arrIntLength % 4) == 4)) ? 0 : ( 4 - (arrIntLength % 4));
            iBitesToAdd *= 1;
            var arrInt = new Int8Array(arrIntLength);
            break;
        case 16:
            var iBitesToAdd = (( 2 - (arrIntLength % 2) == 2)) ? 0 : ( 2 - (arrIntLength % 2));
            iBitesToAdd *= 2;
            var arrInt = new Int16Array(arrIntLength);
            break;
        case 32:
            var iBitesToAdd = 0;
            var arrInt = new Int32Array(arrIntLength);
            break;
    }

    for (var i = 0; i < arrIntLength; i++) {
        arrInt[i] = this._readArrayElementUintX(iX);
    }
    this.iPosition += iBitesToAdd;
    return arrInt;
}

BinReader.prototype.int8Array = function () {
    return this._intXArray(8);
}

BinReader.prototype.int16Array = function () {
    return this._intXArray(16);
}

BinReader.prototype.int32Array = function () {
    return this._intXArray(32);
}


/******************************************************************************/
/*                              floatXArray                                   */
/******************************************************************************/
BinReader.prototype._floatXArray = function (iX) {
    var arrFloatLength = this.uint32();
    if (arrFloatLength == 0xffffffff) {
        return null;
    }

    switch (iX) {

        case 32:
            var arrFloat = new Float32Array(arrFloatLength);
            break;
        case 64:
            var arrFloat = new Float64Array(arrFloatLength);
            break;
    }

    for (var i = 0; i < arrFloatLength; i++) {
        arrFloat[i] = this._floatX(iX);
    }
    return arrFloat;
}

BinReader.prototype.float32Array = function () {
    return this._floatXArray(32);
}

BinReader.prototype.float64Array = function () {
    return this._floatXArray(64);
}


BinReader.prototype.data = function (data) {
    var tmpArrBuffer = new Uint8Array(this.iCountData);

    for (var i = 0, k = 0; i < this.arrData.length; i++) {
        for (var n = 0; n < this.arrData[i].length; n++) {
            tmpArrBuffer[k++] = this.arrData[i][n];
        }
    }

    return tmpArrBuffer.buffer;
}

BinReader.prototype.rawStringToBuffer = function (str) {
    var idx, len = str.length, arr = new Array(len);
    for (idx = 0; idx < len; ++idx) {
        arr[ idx ] = str.charCodeAt(idx);// & 0xFF;
    }
    // You may create an ArrayBuffer from a standard array (of values) as follows:
    return new Uint8Array(arr);
}

BinReader.prototype.read = function(pData) {
    return a.BinReader.read(pData || null, this);
};

BinReader.templates = {};
BinReader.template = function(pTemplate) {
    for (var i in pTemplate) {
        BinReader.templates[i] = pTemplate[i];
    }
};

BinReader.readPtr = function (iAddr, sType, pReader, pObject) {
    'use strict';
    
    pObject = pObject || null;

    if (iAddr === MAX_UINT32) {
        return null;
    }

    var pTmp = pReader.memread(iAddr);
    var isReadNext = false;
    var iType = -1;

    if (pTmp) {
        //trace('object with addr(', iAddr,') already readed:', pTmp);
        return pTmp;
    }

    if (iAddr === pReader.iPosition) {
        //trace('read next >> ');
        isReadNext = true;
    }

    var iPosition = pReader.iPosition;
    //set new position
    pReader.iPosition = iAddr;

    //determ type if needed
    if (typeof arguments[1] !== 'string') {
        pObject = arguments[1];
        sType = a.getClass(pObject);
    }


    var pTemplates = a.BinReader.templates;
    var pProperties = pTemplates[sType];

    //getting real type of object
    while (typeof pProperties === 'string') {
        sType = pProperties;
        pProperties = pTemplates[sType];
    }

    //trace('read ptr > ', iAddr, sType, pObject);

    debug_assert(pProperties, 'unknown object <' + sType + '> type cannot be readed');

    //read primal type
    if (typeof pProperties === 'function') {
        pTmp = pProperties.call(pReader, pObject);
        pReader.memof(pTmp, iAddr);
        //restore prev. position
        if (!isReadNext) {
            pReader.iPosition = iPosition;
        }
        //trace('readed from ptr(', iAddr, '):', pTmp);
        return pTmp;
    }
    
    if (!pObject) {
        var pCtor = a.BinReader.templates[sType]['@constructor'];
        if (pCtor) {
            pObject = pCtor();
        }
        else {
            eval('pObject = new ' + sType + ';');    
        }
    }

    var pBaseClasses = pProperties['@extends'];

    if (pBaseClasses) {
        for (var i = 0; i < pBaseClasses.length; ++ i) {
            iAddr = pReader.iPosition;
            //trace('read base class > ', pBaseClasses[i]);
            a.BinReader.readPtr(iAddr, pBaseClasses[i], pReader, pObject);
        }
    }

    pReader.memof(pObject, iAddr);

    for (var i in pProperties) {
        if (typeof pProperties[i] === 'string') {
             //system property
            if (pProperties[i][0] === '@') {
                continue;
            }
            //trace('read property > ', i);
            pObject[i] = a.BinReader.read(null, pReader);
            continue;
        }
    }
    
    //restore prev. position
    if (!isReadNext) {
        pReader.iPosition = iPosition;
    }
    //trace('readed from ptr(', iAddr, '):', pObject);
    return pObject;
}

BinReader.read = function(pData, pReader) {
    'use strict';
    if (!pData && !pReader) {
        trace('ooops...');
        throw new Error();
    }

    pReader = pReader || new a.BinReader(pData);
    pReader.setupHashTable();
    
    var iAddr = pReader.uint32();
    
    if (iAddr === MAX_UINT32) {
        return null;
    }

    var iType = pReader.uint32();
    var sType = a.BinWriter.int2templates[iType];
    
    //trace('read ptr: ', iAddr, sType);
    
    return a.BinReader.readPtr(iAddr, sType, pReader);
};

function undump (pBuffer) {
    if (!pBuffer) {
        return null;
    }

    return a.BinReader.read(arguments[0]);
}
a.undump = undump;
a.BinReader = BinReader;
