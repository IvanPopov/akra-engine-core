/**
 * @file
 * @author Nikita Zhilin
 * @brief Функции для преобразования строк, числе и массивов в бинарный вид.
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
 * Как исполльзовать:
 * var bw = new BinWriter();      //создаем экземпляр класса
 *                        STRING
 * bw.string("abc");              //запигшет строку
 * bw.stringArray(["abc", "abc"]) //запишет массив строк
 *                        UINT
 * bw.uint8(1)             //варовняет до 4 байт uint и запишет
 * bw.uint16(1)            //варовняет до 4 байт uint и запишет
 * bw.uint32(1)            //запишет uint32
 * bw.uint8Array([1, 2])   //запишет массив uint8 где каждое число будет занимать
 *                         //1 байт и выровняет общую длинну массива до 4
 * bw.uint16Array([1, 2])  //запишет массив uint16 где каждое число будет занимать
 *                         //2 байта и выровняет общую длинну массива до 4
 * bw.uint32Array([1, 2])  //запишет массив uint32 где каждое число будет занимать
 *                         //4 байта
 *                        INT
 * bw.int8(1)              //варовняет до 4 байт int и запишет
 * bw.int16(1)             //варовняет до 4 байт int и запишет
 * bw.int32(1)             //запишет int32
 * bw.int8Array([1, 2])    //запишет массив int8 где каждое число будет занимать
 *                         //1 байт и выровняет общую длинну массива до 4
 * bw.int16Array([1, 2])   //запишет массив int16 где каждое число будет занимать
 *                         //2 байта и выровняет общую длинну массива до 4
 * bw.int32Array([1, 2])   //запишет массив int32 где каждое число будет занимать
 *                         //4 байта
 *                         FLOAT
 * bw.float64(1.1)             //запишет float64
 * bw.float32(1.1)             //запишет float32
 * bw.float32Array([1.2, 2.3]) //запишет массив float32
 * bw.float64Array([1.2, 2.3]) //запишет массив float64
 *
 * bw.data()             //возвратит массив типа ArrayBuffer где бедет лежать все записанные данные
 * bw.dataAsString()     //соберет все данные в строку и вернет
 * bw.dataAsUint8Array() //соберет все данные в массив Uint8 и вернет
 */

Define(IS_NUMBER(VALUE), function () {
    debug_assert(typeof VALUE == 'number', "Не является числом");
});

/**
 * BinWriter class.
 * @ctro
 * Конструктор.
 */
function BinWriter () {
    /**
     * Двумерный массив куда заносятся данные.
     * @private
     * @type Array
     */
    this._pArrData = [];
    /**
     * Счетчик общего количества байт.
     * @private
     * @type int
     */
    this._iCountData = 0;

    this._pHashTable = null;
}

PROPERTY(BinWriter, 'bytesLength',
    function () {
        return this._iCountData;
    });

BinWriter.prototype.setupHashTable = function () {
    'use strict';
    
    if (!this._pHashTable) {
        this._pHashTable = [];
    }
};

BinWriter.prototype.memof = function (pObject, iAddr) {
    'use strict';
    
    this._pHashTable.push({pointer: pObject, addr: iAddr});
};

BinWriter.prototype.addr = function (pObject) {
    'use strict';

    var pTable = this._pHashTable;
    for (var i = 0, n = pTable.length; i < n; ++ i) {
        if (pTable[i].pointer === pObject) {
            return pTable[i].addr;
        }
    }

    return -1;
};

BinWriter.prototype.nullPtr = function () {
    'use strict';
    
    return this.uint32(MAX_UINT32);
};

/******************************************************************************/
/*                                 string                                     */
/******************************************************************************/

/**
 * @property string(str)
 * Запись строки. Перед строкой записывается длинна строки в тип uint32. Если
 * передано null или undefined то длинна строки записывается как 0xffffffff.
 * Это сделано для того что при дальнейшем считывании такая строка будет
 * возвращена как null.
 * @memberof BinWriter
 * @tparam String str строка. Все не строковые типы преобразуются к строке.
 */
BinWriter.prototype.string = function (str) {
    if (str === null || str === undefined) {
        this.uint32(0xffffffff);
        return;
    }
    str = String(str);
    var sUTF8String = str.toUTF8();
    var iStrLen = sUTF8String.length;
    var arrUTF8string = BinWriter.rawStringToBuffer(sUTF8String);

    debug_assert(iStrLen <= Math.pow(2, 32) - 1, "Это значение не влезет в тип string");
    this.uint32(iStrLen);
    var iBitesToAdd = (( 4 - (iStrLen % 4) == 4)) ? 0 : ( 4 - (iStrLen % 4));
    this._pArrData[this._pArrData.length] = arrUTF8string;
    this._iCountData += (iStrLen + iBitesToAdd);
    //trace('string', str);
}

/******************************************************************************/
/*                                   uintX                                    */
/******************************************************************************/

/**
 * @property _uintX(iValue, iX)
 * Запись числа типа uint(8, 16, 32). Если число занимает меньше 4 байт то оно
 * выравнивается до 4 байт. Если передан null то число принимается равным 0.
 * Если передано любое другое не числовое значение то выводится ошибка.
 * @memberof BinWriter
 * @tparam uint iValue число.
 * @tparam int iX - 8, 16, 32 количество бит.
 */
BinWriter.prototype._uintX = function (iValue, iX) {
    if (iValue === null) {
        iValue = 0;
    }
    IS_NUMBER(iValue)
    debug_assert(0 <= iValue && iValue <= Math.pow(2, iX), "Это значение не влезет в тип uint" + iX);
    switch (iX) {
        case 8:
            var arrTmpBuf = new Uint8Array(4);
            arrTmpBuf[0] = iValue;
            break;
        case 16:
            var arrTmpBuf = new Uint16Array(2);
            arrTmpBuf[0] = iValue;
            break;
        case 32:
            var arrTmpBuf = new Uint32Array(1);
            arrTmpBuf[0] = iValue;
            break;
        default:
            error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.");
            break;
    }
    //trace('uint' + iX, iValue);
    //if(iX == 8)
    //  this._pArrData[this._pArrData.length] = arrTmpBuf;
    //else
    this._pArrData[this._pArrData.length] = new Uint8Array(arrTmpBuf.buffer);
    this._iCountData += 4;
}

/**
 * @property uint8(iValue)
 * Запись числа типа uint8. Оно выравнивается до 4 байт. Если передан null то
 * число принимается равным 0. Если передано любое другое не числовое значение
 * то выводится ошибка.
 * Сокращенная запись функции _uintX(iValue, 8).
 * @memberof BinWriter
 * @tparam uint iValue число.
 */
BinWriter.prototype.uint8 = function (iValue) {
    this._uintX(iValue, 8);
}

/**
 * @property uint16(iValue)
 * Запись числа типа uint16. Оно выравнивается до 4 байт. Если передан null то
 * число принимается равным 0. Если передано любое другое не числовое значение
 * то выводится ошибка.
 * Сокращенная запись функции _uintX(iValue, 16).
 * @memberof BinWriter
 * @tparam uint iValue число.
 */
BinWriter.prototype.uint16 = function (iValue) {
    this._uintX(iValue, 16);
}

/**
 * @property uint32(iValue)
 * Запись числа типа uint8. Если передан null то число принимается равным 0.
 * Если передано любое другое не числовое значение то выводится ошибка.
 * Сокращенная запись функции _uintX(iValue, 32).
 * @memberof BinWriter
 * @tparam uint iValue число.
 */
BinWriter.prototype.uint32 = function (iValue) {
    this._uintX(iValue, 32);
}

/**
 * @property bool(bValue)
 * Запись числа типа bool. В зависимости от bValue записывается либо 1 либо ноль.
 * Если передано любое другое не числовое значение то выводится ошибка.
 * Сокращенная запись функции _uintX(bValue? 1: 0, 8).
 * @memberof BinWriter
 * @tparam bool bValue число.
 */
BinWriter.prototype.bool = function (bValue) {
    this._uintX(bValue ? 1 : 0, 8);
}


/******************************************************************************/
/*                       writeArrayElementUintX                               */
/******************************************************************************/

/**
 * @property _writeArrayElementUintX(iValue, iX)
 * Запись числа типа uint(8, 16, 32). Используется для записи элементов массивов.
 * В отличии от _uintX число не выравнивается до 4 байт, а записывается ровно
 * столько байт сколько передано во втором параметре в функцию. Вторым
 * параметром передается колчиество бит а не байт. Если передан null то число
 * принимается равным 0. Если передано любое другое не числовое значение то
 * выводится ошибка.
 * @memberof BinWriter
 * @tparam uint iValue число.
 * @tparam int iX - 8, 16, 32 количество бит.
 */
BinWriter.prototype._writeArrayElementUintX = function (iValue, iX) {
    if (iValue === null) {
        iValue = 0;
    }
    IS_NUMBER(iValue)
    debug_assert(0 <= iValue && iValue <= Math.pow(2, iX), "Это значение не влезет в тип uint" + iX);
    switch (iX) {
        case 8: // WARNING Только private и записи масивов. Нет выравнивания на 4, оно ложится на функцию записи массива.
            var arrTmpBuf = new Uint8Array(1);
            arrTmpBuf[0] = iValue;
            break;
        case 16: // WARNING Только private и записи масивов. Нет выравнивания на 4, оно ложится на функцию записи массива.
            var arrTmpBuf = new Uint16Array(1);
            arrTmpBuf[0] = iValue;
            break;
        case 32:
            var arrTmpBuf = new Uint32Array(1);
            arrTmpBuf[0] = iValue;
            break;
        default:
            error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.");
            break;
    }
    if (iX == 8) {
        this._pArrData[this._pArrData.length] = arrTmpBuf;
    }
    else {
        this._pArrData[this._pArrData.length] = new Uint8Array(arrTmpBuf.buffer);
    }
    this._iCountData += (iX / 8);
}

/******************************************************************************/
/*                                    intX                                    */
/******************************************************************************/

/**
 * @property _intX(iValue, iX)
 * Запись числа типа int(8, 16, 32). Если число занимает меньше 4 байт то оно
 * выравнивается до 4 байт. Если передан null то число принимается равным 0.
 * Если передано любое другое не числовое значение то выводится ошибка.
 * @memberof BinWriter
 * @tparam int iValue число.
 * @tparam int iX - 8, 16, 32 количество бит.
 */
BinWriter.prototype._intX = function (iValue, iX) {
    if (iValue === null) {
        iValue = 0;
    }
    IS_NUMBER(iValue)
    debug_assert(-Math.pow(2, iX - 1) <= iValue && iValue <= Math.pow(2, iX - 1) - 1,
                 "Это значение не влезет в тип int" + iX);
    switch (iX) {
        case 8:
            var arrTmpBuf = new Int8Array(4);
            arrTmpBuf[0] = iValue;
            break;
        case 16:
            var arrTmpBuf = new Int16Array(2);
            arrTmpBuf[0] = iValue;
            break;
        case 32:
            var arrTmpBuf = new Int32Array(1);
            arrTmpBuf[0] = iValue;
            break;
        default:
            error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.");
            break;
    }
    //trace('int' + iX, iValue);
    this._pArrData[this._pArrData.length] = new Uint8Array(arrTmpBuf.buffer);
    this._iCountData += 4;
}

/**
 * @property int8(iValue)
 * Запись числа типа int8. Оно выравнивается до 4 байт. Если передан null то
 * число принимается равным 0. Если передано любое другое не числовое значение
 * то выводится ошибка.
 * Сокращенная запись функции _intX(iValue, 8).
 * @memberof BinWriter
 * @tparam uint iValue число.
 */
BinWriter.prototype.int8 = function (iValue) {
    this._intX(iValue, 8);
}

/**
 * @property int16(iValue)
 * Запись числа типа uint16. Оно выравнивается до 4 байт. Если передан null то
 * число принимается равным 0. Если передано любое другое не числовое значение
 * то выводится ошибка.
 * Сокращенная запись функции _intX(iValue, 16).
 * @memberof BinWriter
 * @tparam int iValue число.
 */
BinWriter.prototype.int16 = function (iValue) {
    this._intX(iValue, 16);
}

/**
 * @property uint32(iValue)
 * Запись числа типа uint8. Если передан null то число принимается равным 0.
 * Если передано любое другое не числовое значение то выводится ошибка.
 * Сокращенная запись функции _intX(iValue, 32).
 * @memberof BinWriter
 * @tparam int iValue число.
 */
BinWriter.prototype.int32 = function (iValue) {
    this._intX(iValue, 32);
}

/******************************************************************************/
/*                          _writeArrayElementIntX                            */
/******************************************************************************/

/**
 * @property _writeArrayElementIntX(iValue, iX)
 * Запись числа типа int(8, 16, 32). Используется для записи элементов массивов.
 * В отличии от _intX число не выравнивается до 4 байт, а записывается ровно
 * столько байт сколько передано во втором параметре в функцию. Вторым
 * параметром передается колчиество бит а не байт. Если передан null то число
 * принимается равным 0. Если передано любое другое не числовое значение то
 * выводится ошибка.
 * @memberof BinWriter
 * @tparam int iValue число.
 * @tparam int iX - 8, 16, 32 количество бит.
 */
BinWriter.prototype._writeArrayElementIntX = function (iValue, iX) {
    if (iValue === null) {
        iValue = 0;
    }
    IS_NUMBER(iValue)
    debug_assert(-Math.pow(2, iX - 1) <= iValue && iValue <= Math.pow(2, iX - 1) - 1,
                 "Это значение не влезет в тип int" + iX);
    switch (iX) {
        case 8:// WARNING Только private и записи масивов. Нет выравнивания на 4, оно ложится на функцию записи массива.
            var arrTmpBuf = new Int8Array(1);
            arrTmpBuf[0] = iValue;
            break;
        case 16:// WARNING Только private и записи масивов. Нет выравнивания на 4, оно ложится на функцию записи массива.
            var arrTmpBuf = new Int16Array(1);
            arrTmpBuf[0] = iValue;
            break;
        case 32:
            var arrTmpBuf = new Int32Array(1);
            arrTmpBuf[0] = iValue;
            break;
        default:
            error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.");
            break;
    }
    this._pArrData[this._pArrData.length] = new Uint8Array(arrTmpBuf.buffer);
    this._iCountData += (iX / 8);
}

/******************************************************************************/
/*                                  floatX                                    */
/******************************************************************************/

/**
 * @property _floatX(fValue, iX)
 * Запись числа типа float(32, 64). выравнивания не происходит т.к. они уже
 * выравнены до 4. Если передан null то число принимается равным 0.
 * Если передано любое другое не числовое значение то выводится ошибка.
 * @memberof BinWriter
 * @tparam float fValue число.
 * @tparam int iX - 32, 64 количество бит.
 */
BinWriter.prototype._floatX = function (fValue, iX) {
    if (fValue === null) {
        fValue = 0;
    }
    IS_NUMBER(fValue)
    //debug_assert(typeof(fValue) == 'number', "Не является числом");
    switch (iX) {
        case 32:
            var arrTmpBuf = new Float32Array(1);
            arrTmpBuf[0] = fValue;
            break;
        case 64:
            var arrTmpBuf = new Float64Array(1);
            arrTmpBuf[0] = fValue;
            break;
        default:
            error("Передано недопустимое значение длинны. Допустимые значения 32, 64.");
            break;
    }
    //trace('float' + iX, fValue);
    this._pArrData[this._pArrData.length] = new Uint8Array(arrTmpBuf.buffer);
    this._iCountData += (iX / 8);
}

/**
 * @property float32(fValue)
 * Запись числа типа float32. Если передан null то число принимается равным 0.
 * Если передано любое другое не числовое значение то выводится ошибка.
 * Сокращенная запись функции _floatX(fValue, 32).
 * @memberof BinWriter
 * @tparam float fValue число.
 */
BinWriter.prototype.float32 = function (fValue) {
    this._floatX(fValue, 32);
}

/**
 * @property float64(fValue)
 * Запись числа типа float64. Если передан null то число принимается равным 0.
 * Если передано любое другое не числовое значение то выводится ошибка.
 * Сокращенная запись функции _floatX(fValue, 64).
 * @memberof BinWriter
 * @tparam float fValue число.
 */
BinWriter.prototype.float64 = function (fValue) {
    this._floatX(fValue, 64);
}


/******************************************************************************/
/*                             stringArray                                    */
/******************************************************************************/

/**
 * @property stringArray(arrString)
 * Записывает массив строк использую дял каждого элемента функцию this.string
 * Да начала записи элементов записывает общее количество элементов как число
 * uint32. Если в качестве параметра функции передано null или undefined
 * то количество элементов записывается равным 0xffffffff.
 * @memberof BinWriter
 * @tparam Array arrString массив строк.
 */
BinWriter.prototype.stringArray = function (arrString) {
    if (arrString === null || arrString === undefined) {
        this.uint32(0xffffffff);
        return;
    }

    this.uint32(arrString.length);
    for (var i = 0; i < arrString.length; i++) {
        this.string(arrString[i]);
    }
}

/******************************************************************************/
/*                             uintXArray                                     */
/******************************************************************************/

/**
 * @property _uintXArray(arrUint, iX)
 * Записывает массив чисел uint(8, 16, 32) использую для каждого элемента функцию
 *  _writeArrayElementUintX. До начала записи элементов записывает общее
 *  количество элементов как число uint32. Если в качестве параметра функции
 * передано null или undefined то количество элементов записывается
 * равным 0xffffffff. Общее количество байт в массиве выравнивается к 4.
 * Все массивы приводятся к нужному типу Uint(iX)Array.
 * @memberof BinWriter
 * @tparam Uint(iX)Array arrUint массив uint(iX).
 * @tparam int iX размер элемента в битах (8, 16, 32).
 */
BinWriter.prototype._uintXArray = function (arrUint, iX) {
    if (arrUint === null || arrUint === undefined) {
        this.uint32(0xffffffff);
        return;
    }

    var iUintArrLength = arrUint.length;
    switch (iX) {
        case 8:
            var iBitesToAdd = (( 4 - (iUintArrLength % 4) == 4)) ? 0 : ( 4 - (iUintArrLength % 4));
            if (iBitesToAdd > 0 || !(arrUint instanceof Uint8Array)) {
                var arrTmpUint = new Uint8Array(iUintArrLength + iBitesToAdd);
                arrTmpUint.set(arrUint);
            }
            else {
                arrTmpUint = arrUint;
            }
            break;
        case 16:
            var iBitesToAdd = (( 2 - (iUintArrLength % 2) == 2)) ? 0 : ( 2 - (iUintArrLength % 2));
            if (iBitesToAdd > 0 || !(arrUint instanceof Uint16Array)) {
                var arrTmpUint = new Uint16Array(iUintArrLength + iBitesToAdd);
                arrTmpUint.set(arrUint);
            }
            else {
                arrTmpUint = arrUint;
            }
            break;
        case 32:
            if (!(arrUint instanceof Uint32Array)) {
                arrTmpUint = new Uint32Array(arrUint);
            }
            else {
                arrTmpUint = arrUint;
            }
            break;
    }
    this.uint32(iUintArrLength);

    for (var i = 0; i < arrTmpUint.length; i++) {
        this._writeArrayElementUintX(arrTmpUint[i], iX);
    }
}

/**
 * @property uint8Array(arrUint)
 * Запись массива типа Uint8Array. До начала записи элементов записывает общее
 * количество элементов как число uint32. Если в качестве параметра функции
 * передано null или undefined то количество элементов записывается
 * равным 0xffffffff. Общее количество байт в массиве выравнивается до 4.
 * Сокращенная запись функции _uintXArray(arrUint, 8).
 * @memberof BinWriter
 * @tparam Uint8Array arrUint массив uint8.
 */
BinWriter.prototype.uint8Array = function (arrUint) {
    this._uintXArray(arrUint, 8);
}

/**
 * @property uint16Array(arrUint)
 * Запись массива типа Uint16Array. До начала записи элементов записывает общее
 * количество элементов как число uint32. Если в качестве параметра функции
 * передано null или undefined то количество элементов записывается
 * равным 0xffffffff. Общее количество байт в массиве выравнивается до 4.
 * Сокращенная запись функции _uintXArray(arrUint, 16).
 * @memberof BinWriter
 * @tparam Uint16Array arrUint массив uint16.
 */
BinWriter.prototype.uint16Array = function (arrUint) {
    this._uintXArray(arrUint, 16);
}

/**
 * @property uint32Array(arrUint)
 * Запись массива типа Uint32Array. До начала записи элементов записывает общее
 * количество элементов как число uint32. Если в качестве параметра функции
 * передано null или undefined то количество элементов записывается
 * равным 0xffffffff.
 * Сокращенная запись функции _uintXArray(arrUint, 32).
 * @memberof BinWriter
 * @tparam Uint32Array arrUint массив uint32.
 */
BinWriter.prototype.uint32Array = function (arrUint) {
    this._uintXArray(arrUint, 32);
}


/******************************************************************************/
/*                               intXArray                                    */
/******************************************************************************/

/**
 * @property _intXArray(arrInt, iX)
 * Записывает массив чисел int(8, 16, 32) использую для каждого элемента функцию
 *  _writeArrayElementIntX. До начала записи элементов записывает общее
 *  количество элементов как число int32. Если в качестве параметра функции
 * передано null или undefined то количество элементов записывается
 * равным 0xffffffff. Общее количество байт в массиве выравнивается к 4.
 * Все массивы приводятся к нужному типу Int(iX)Array.
 * @memberof BinWriter
 * @tparam Int(iX)Array arrUint массив int(iX).
 * @tparam int iX размер элемента в битах (8, 16, 32).
 */
BinWriter.prototype._intXArray = function (arrInt, iX) {
    if (arrInt === null || arrInt === undefined) {
        this.uint32(0xffffffff);
        return;
    }

    var iIntArrLength = arrInt.length;
    switch (iX) {
        case 8:
            var iBitesToAdd = (( 4 - (iIntArrLength % 4) == 4)) ? 0 : ( 4 - (iIntArrLength % 4));
            if (iBitesToAdd > 0 || !(arrInt instanceof Int8Array)) {
                var arrTmpInt = new Int8Array(iIntArrLength + iBitesToAdd);
                arrTmpInt.set(arrInt);
            }
            else {
                arrTmpInt = arrInt;
            }
            break;
        case 16:
            var iBitesToAdd = (( 2 - (iIntArrLength % 2) == 2)) ? 0 : ( 2 - (iIntArrLength % 2));
            if (iBitesToAdd > 0 || !(arrInt instanceof Int16Array)) {
                var arrTmpInt = new Int16Array(iIntArrLength + iBitesToAdd);
                arrTmpInt.set(arrInt);
            }
            else {
                arrTmpInt = arrInt;
            }
            break;
        case 32:
            if (!(arrInt instanceof Int32Array)) {
                arrTmpInt = new Int32Array(arrInt);
            }
            else {
                arrTmpInt = arrInt;
            }
            break;
    }
    this.uint32(iIntArrLength);

    for (var i = 0; i < arrTmpInt.length; i++) {
        this._writeArrayElementIntX(arrTmpInt[i], iX);
    }
}

/**
 * @property int8Array(arrInt)
 * Запись массива типа Int8Array. До начала записи элементов записывает общее
 * количество элементов как число uint32. Если в качестве параметра функции
 * передано null или undefined то количество элементов записывается
 * равным 0xffffffff. Общее количество байт в массиве выравнивается до 4.
 * Сокращенная запись функции _intXArray(arrInt, 8).
 * @memberof BinWriter
 * @tparam Int8Array arrInt массив int8.
 */
BinWriter.prototype.int8Array = function (arrInt) {
    this._intXArray(arrInt, 8);
}

/**
 * @property int16Array(arrInt)
 * Запись массива типа Int16Array. До начала записи элементов записывает общее
 * количество элементов как число uint32. Если в качестве параметра функции
 * передано null или undefined то количество элементов записывается
 * равным 0xffffffff. Общее количество байт в массиве выравнивается до 4.
 * Сокращенная запись функции _intXArray(arrInt, 16).
 * @memberof BinWriter
 * @tparam Int16Array arrInt массив int16.
 */
BinWriter.prototype.int16Array = function (arrInt) {
    this._intXArray(arrInt, 16);
}

/**
 * @property int32Array(arrInt)
 * Запись массива типа Int32Array. До начала записи элементов записывает общее
 * количество элементов как число uint32. Если в качестве параметра функции
 * передано null или undefined то количество элементов записывается
 * равным 0xffffffff.
 * Сокращенная запись функции _intXArray(arrInt, 32).
 * @memberof BinWriter
 * @tparam Int32Array arrInt массив int32.
 */
BinWriter.prototype.int32Array = function (arrInt) {
    this._intXArray(arrInt, 32);
}


/******************************************************************************/
/*                              floatXArray                                   */
/******************************************************************************/

/**
 * @property _floatXArray(arrFloat, iX)
 * Записывает массив чисел float(32, 64) использую для каждого элемента функцию
 *  _floatX. До начала записи элементов записывает общее
 *  количество элементов как число int32. Если в качестве параметра функции
 * передано null или undefined то количество элементов записывается
 * равным 0xffffffff.
 * Все массивы приводятся к нужному типу Float(iX)Array.
 * @memberof BinWriter
 * @tparam Float(iX)Array arrFloat массив float(iX).
 * @tparam int iX размер элемента в битах (32, 64).
 */
BinWriter.prototype._floatXArray = function (arrFloat, iX) {
    if (arrFloat === null || arrFloat === undefined) {
        this.uint32(0xffffffff);
        return;
    }

    switch (iX) {
        case 32:
            if (!(arrFloat instanceof Float32Array)) {
                arrFloat = new Float32Array(arrFloat);
            }
            break;
        case 64:
            if (!(arrFloat instanceof Float64Array)) {
                arrFloat = new Float64Array(arrFloat);
            }
            break;
    }
    var iFloatArrLength = arrFloat.length;
    this.uint32(iFloatArrLength);
    //Поэлементно записываем массив
    for (var i = 0; i < arrFloat.length; i++) {
        this._floatX(arrFloat[i], iX);
    }
}

/**
 * @property float32Array(arrFloat)
 * Запись массива типа Float32Array. До начала записи элементов записывает общее
 * количество элементов как число uint32. Если в качестве параметра функции
 * передано null или undefined то количество элементов записывается
 * равным 0xffffffff.
 * Все переданные массивы приводятся к типу Float32Array.
 * Сокращенная запись функции _floatXArray(arrFloat, 32).
 * @memberof BinWriter
 * @tparam Float32Array arrFloat массив float32.
 */
BinWriter.prototype.float32Array = function (arrFloat) {
    this._floatXArray(arrFloat, 32);
}

/**
 * @property float64Array(arrFloat)
 * Запись массива типа Float64Array. До начала записи элементов записывает общее
 * количество элементов как число uint32. Если в качестве параметра функции
 * передано null или undefined то количество элементов записывается
 * равным 0xffffffff.
 * Все переданные массивы приводятся к типу Float64Array.
 * Сокращенная запись функции _floatXArray(arrFloat, 64).
 * @memberof BinWriter
 * @tparam Float64Array arrFloat массив float64.
 */
BinWriter.prototype.float64Array = function (arrFloat) {
    this._floatXArray(arrFloat, 64);
}

/**
 * @property data()
 * Берет все данные из массива _pArrData и записывает их в массив
 * типа ArrayBuffer.
 * @memberof BinWriter
 * @treturn ArrayBuffer.
 */
BinWriter.prototype.data = function () {
    var tmpArrBuffer = new Uint8Array(this._iCountData);
    for (var i = 0, k = 0; i < this._pArrData.length; i++) {
        for (var n = 0; n < this._pArrData[i].length; n++) {
            tmpArrBuffer[k++] = this._pArrData[i][n];
        }
    }
    return tmpArrBuffer.buffer;
}

/**
 * @property data()
 * Берет все данные из массива _pArrData и записывает их в строку.
 * @memberof BinWriter
 * @treturn String.
 */
BinWriter.prototype.dataAsString = function () {
    var tmpArrBuffer = new Uint8Array(this._iCountData);
    for (var i = 0, k = 0; i < this._pArrData.length; i++) {
        for (var n = 0; n < this._pArrData[i].length; n++) {
            tmpArrBuffer[k++] = this._pArrData[i][n];
        }
    }

    var sString = "";
    for (var n = 0; n < tmpArrBuffer.length; ++n) {
        var charCode = String.fromCharCode(tmpArrBuffer[n]);
        sString = sString + charCode;
    }

    return sString;
}

/**
 * @property toUint8Array()
 * Берет все данные из массива _pArrData и вернет Uint8Array.
 * @memberof BinWriter
 * @treturn Uint8Array.
 */
BinWriter.prototype.dataAsUint8Array = function () {
    var arrUint8 = new Uint8Array(this._iCountData);
    for (var i = 0, k = 0; i < this._pArrData.length; i++) {
        for (var n = 0; n < this._pArrData[i].length; n++) {
            arrUint8[k++] = this._pArrData[i][n];
        }
    }

    return arrUint8;
}

BinWriter.prototype.write = function(pObject) {
    return a.BinWriter.writePtr(pObject, this);
};

/**
 * @property rawStringToBuffer()
 * Берет строку и преобразует ее в массив Uint8Array.
 * @memberof BinWriter
 * @treturn Uint8Array.
 */
BinWriter.rawStringToBuffer = function (str) {

    var idx;
    var len = str.length;
    var iBitesToAdd = (( 4 - (len % 4) == 4)) ? 0 : ( 4 - (len % 4));
    var arr = new Array(len + iBitesToAdd);
    for (idx = 0; idx < len; ++idx) {
        arr[ idx ] = str.charCodeAt(idx);// & 0xFF;
    }
    return new Uint8Array(arr);
};



BinWriter.templates = {};
BinWriter.templates2int = {};
BinWriter.int2templates = {};
BinWriter.totalTemplates = 0;

BinWriter.template = function(pTemplate) {
    var iType;
    for (var i in pTemplate) {
        iType = BinWriter.totalTemplates ++;

        BinWriter.templates[i] = pTemplate[i];
        BinWriter.int2templates[iType] = i;
        BinWriter.templates2int[i] = iType;
        //trace(iType, i);
    }
};

BinWriter.write = function(pObject, pWriter, sType) {
    var pTemplates = a.BinWriter.templates;
    var pProperties = pTemplates[sType];

    //direct writing primal object
    if (typeof pProperties === 'function') {
        if (pProperties.call(pWriter, pObject) === false) {
            error('cannot write type: ' + sType);
        }

        return pWriter;
    }

    debug_assert(pProperties, 'unknown object <' + sType + '> type cannot be writed');

    var pBaseClasses = pProperties['@extends'];

    if (pBaseClasses) {
        for (var i = 0; i < pBaseClasses.length; ++ i) {
            //trace('write base class > ', pBaseClasses[i]);
            a.BinWriter.write(pObject, pWriter, pBaseClasses[i]);
            //trace(pBaseClasses[i], '<< base class');
        }
    }

    //writing structire
    for (var i in pProperties) {

        //writing complex type of structure member
        if (typeof pProperties[i] === 'string') {
            //system property
            if (pProperties[i][0] === '@') {
                continue;
            }
            //trace('write property > ', i);
            a.BinWriter.writePtr(pObject[i], pWriter);
            continue;
        }
    }

    return pWriter;
}

BinWriter.writePtr = function(pObject, pWriter, sType) {
    'use strict';
    
    pWriter = pWriter || new a.BinWriter();
    pWriter.setupHashTable();

    var pTemplates = a.BinWriter.templates;
    var pProperties;
    var iAddr, iType;

    if (!sType) {
        sType = a.getClass(pObject);
        pProperties = pTemplates[sType];
    }

    //getting real type of object
    while (typeof pProperties === 'string') {
        sType = pProperties;
        pProperties = pTemplates[sType];
    }

    iType = a.BinWriter.templates2int[sType];

    if (iType === undefined) {
        trace('unknown type founded: ', sType);
    }

    if (pObject === null || pObject === undefined || iType === undefined) {
        pWriter.nullPtr();
        return pWriter;
    }
    else {
        iAddr = pWriter.addr(pObject);

        if (iAddr < 0) {
            iAddr = pWriter.bytesLength + 4 + 4;

            pWriter.uint32(iAddr); 
            pWriter.uint32(iType);
            pWriter.memof(pObject, iAddr);
        }
        else {

            pWriter.uint32(iAddr);
            pWriter.uint32(iType);
            return pWriter;
        }
    }
    
    return a.BinWriter.write(pObject, pWriter, sType);
};

function dump (pObject, bWriteWithType) {
    return a.BinWriter.writePtr(pObject, null, bWriteWithType).data();
}

a.dump = dump;

a.BinWriter = BinWriter;