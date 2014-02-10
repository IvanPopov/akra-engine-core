/// <reference path="../idl/IBinWriter.ts" />
/// <reference path="../idl/IBinReader.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../conv/conv.ts" />
/// <reference path="../limit.ts" />
/// <reference path="../math/math.ts" />
var akra;
(function (akra) {
    /**
    * Как исполльзовать:
    * var bw = new BinWriter();	  //создаем экземпляр класса
    *						STRING
    * bw.string("abc");			  //запигшет строку
    * bw.stringArray(["abc", "abc"]) //запишет массив строк
    *						UINT
    * bw.uint8(1)			 //варовняет до 4 байт uint и запишет
    * bw.uint16(1)			//варовняет до 4 байт uint и запишет
    * bw.uint32(1)			//запишет uint32
    * bw.uint8Array([1, 2])   //запишет массив uint8 где каждое число будет занимать
    *						 //1 байт и выровняет общую длинну массива до 4
    * bw.uint16Array([1, 2])  //запишет массив uint16 где каждое число будет занимать
    *						 //2 байта и выровняет общую длинну массива до 4
    * bw.uint32Array([1, 2])  //запишет массив uint32 где каждое число будет занимать
    *						 //4 байта
    *						INT
    * bw.int8(1)			  //варовняет до 4 байт int и запишет
    * bw.int16(1)			 //варовняет до 4 байт int и запишет
    * bw.int32(1)			 //запишет int32
    * bw.int8Array([1, 2])	//запишет массив int8 где каждое число будет занимать
    *						 //1 байт и выровняет общую длинну массива до 4
    * bw.int16Array([1, 2])   //запишет массив int16 где каждое число будет занимать
    *						 //2 байта и выровняет общую длинну массива до 4
    * bw.int32Array([1, 2])   //запишет массив int32 где каждое число будет занимать
    *						 //4 байта
    *						 FLOAT
    * bw.float64(1.1)			 //запишет float64
    * bw.float32(1.1)			 //запишет float32
    * bw.float32Array([1.2, 2.3]) //запишет массив float32
    * bw.float64Array([1.2, 2.3]) //запишет массив float64
    *
    * bw.data()			 //возвратит массив типа ArrayBuffer где бедет лежать все записанные данные
    * bw.dataAsString()	 //соберет все данные в строку и вернет
    * bw.dataAsUint8Array() //соберет все данные в массив Uint8 и вернет
    */
    (function (io) {
        var BinWriter = (function () {
            function BinWriter() {
                /**
                * Двумерный массив куда заносятся данные.
                * @private
                * @type Uint8Array[]
                */
                this._pArrData = [];
                /**
                * Счетчик общего количества байт.
                * @private
                * @type int
                */
                this._iCountData = 0;
            }
            BinWriter.prototype.getByteLength = function () {
                return this._iCountData;
            };

            /******************************************************************************/
            /*								 string									 */
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
                if (!akra.isDefAndNotNull(str)) {
                    this.uint32(akra.MAX_UINT32);
                    return;
                }

                str = String(str);

                // LOG("string: ", str);
                var sUTF8String = akra.conv.toUTF8(str);
                var iStrLen = sUTF8String.length;
                var arrUTF8string = BinWriter.rawStringToBuffer(sUTF8String);

                akra.debug.assert(iStrLen <= akra.math.pow(2, 32) - 1, "Это значение не влезет в тип string");

                this.uint32(iStrLen);

                var iBitesToAdd = ((4 - (iStrLen % 4) == 4)) ? 0 : (4 - (iStrLen % 4));

                this._pArrData[this._pArrData.length] = arrUTF8string;
                this._iCountData += (iStrLen + iBitesToAdd);
                //trace('string', str);
            };

            /******************************************************************************/
            /*								   uintX									*/
            /******************************************************************************/
            /**
            * @property uintX(iValue, iX)
            * Запись числа типа uint(8, 16, 32). Если число занимает меньше 4 байт то оно
            * выравнивается до 4 байт. Если передан null то число принимается равным 0.
            * Если передано любое другое не числовое значение то выводится ошибка.
            * @memberof BinWriter
            * @tparam uint iValue число.
            * @tparam int iX - 8, 16, 32 количество бит.
            */
            BinWriter.prototype.uintX = function (iValue, iX) {
                if (akra.isNull(iValue)) {
                    iValue = 0;
                }

                // LOG("uint" + iX + ": ", iValue);
                akra.debug.assert(akra.isNumber(iValue));

                akra.debug.assert(0 <= iValue && iValue <= Math.pow(2, iX), "Out of Int range value:" + iX);
                var arrTmpBuf = null;

                switch (iX) {
                    case 8:
                        arrTmpBuf = new Uint8Array(4);
                        arrTmpBuf[0] = iValue;
                        break;
                    case 16:
                        arrTmpBuf = new Uint16Array(2);
                        arrTmpBuf[0] = iValue;
                        break;
                    case 32:
                        arrTmpBuf = new Uint32Array(1);
                        arrTmpBuf[0] = iValue;
                        break;
                    default:
                        akra.logger.error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.");
                        break;
                }

                //trace('uint' + iX, iValue);
                //if(iX == 8)
                //  this._pArrData[this._pArrData.length] = arrTmpBuf;
                //else
                this._pArrData[this._pArrData.length] = new Uint8Array(arrTmpBuf.buffer);
                this._iCountData += 4;
            };

            /**
            * @property uint8(iValue)
            * Запись числа типа uint8. Оно выравнивается до 4 байт. Если передан null то
            * число принимается равным 0. Если передано любое другое не числовое значение
            * то выводится ошибка.
            * Сокращенная запись функции uintX(iValue, 8).
            * @memberof BinWriter
            * @tparam uint iValue число.
            */
            BinWriter.prototype.uint8 = function (iValue) {
                this.uintX(iValue, 8);
            };

            /**
            * @property uint16(iValue)
            * Запись числа типа uint16. Оно выравнивается до 4 байт. Если передан null то
            * число принимается равным 0. Если передано любое другое не числовое значение
            * то выводится ошибка.
            * Сокращенная запись функции uintX(iValue, 16).
            * @memberof BinWriter
            * @tparam uint iValue число.
            */
            BinWriter.prototype.uint16 = function (iValue) {
                this.uintX(iValue, 16);
            };

            /**
            * @property uint32(iValue)
            * Запись числа типа uint8. Если передан null то число принимается равным 0.
            * Если передано любое другое не числовое значение то выводится ошибка.
            * Сокращенная запись функции uintX(iValue, 32).
            * @memberof BinWriter
            * @tparam uint iValue число.
            */
            BinWriter.prototype.uint32 = function (iValue) {
                this.uintX(iValue, 32);
            };

            /**
            * @property boolean(bValue)
            * Запись числа типа boolean. В зависимости от bValue записывается либо 1 либо ноль.
            * Если передано любое другое не числовое значение то выводится ошибка.
            * Сокращенная запись функции uintX(bValue? 1: 0, 8).
            * @memberof BinWriter
            * @tparam boolean bValue число.
            */
            BinWriter.prototype.boolean = function (bValue) {
                // LOG(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BOOL >>> ");
                this.uintX(bValue ? 1 : 0, 8);
            };

            /******************************************************************************/
            /*					   writeArrayElementUintX							   */
            /******************************************************************************/
            /**
            * @property writeArrayElementUintX(iValue, iX)
            * Запись числа типа uint(8, 16, 32). Используется для записи элементов массивов.
            * В отличии от uintX число не выравнивается до 4 байт, а записывается ровно
            * столько байт сколько передано во втором параметре в функцию. Вторым
            * параметром передается колчиество бит а не байт. Если передан null то число
            * принимается равным 0. Если передано любое другое не числовое значение то
            * выводится ошибка.
            * @memberof BinWriter
            * @tparam uint iValue число.
            * @tparam int iX - 8, 16, 32 количество бит.
            */
            BinWriter.prototype.writeArrayElementUintX = function (iValue, iX) {
                if (akra.isNull(iValue)) {
                    iValue = 0;
                }

                // LOG("array uint", iX, ": ", iValue);
                akra.debug.assert(akra.isNumber(iValue));
                akra.debug.assert(0 <= iValue && iValue <= Math.pow(2, iX), "Это значение не влезет в тип uint" + iX);

                var arrTmpBuf = null;

                switch (iX) {
                    case 8:
                        arrTmpBuf = new Uint8Array(1);
                        arrTmpBuf[0] = iValue;
                        break;
                    case 16:
                        arrTmpBuf = new Uint16Array(1);
                        arrTmpBuf[0] = iValue;
                        break;
                    case 32:
                        arrTmpBuf = new Uint32Array(1);
                        arrTmpBuf[0] = iValue;
                        break;
                    default:
                        akra.logger.error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.");
                        break;
                }

                if (iX == 8) {
                    this._pArrData[this._pArrData.length] = arrTmpBuf;
                } else {
                    this._pArrData[this._pArrData.length] = new Uint8Array(arrTmpBuf.buffer);
                }

                this._iCountData += (iX / 8);
            };

            /******************************************************************************/
            /*									intX									*/
            /******************************************************************************/
            /**
            * @property intX(iValue, iX)
            * Запись числа типа int(8, 16, 32). Если число занимает меньше 4 байт то оно
            * выравнивается до 4 байт. Если передан null то число принимается равным 0.
            * Если передано любое другое не числовое значение то выводится ошибка.
            * @memberof BinWriter
            * @tparam int iValue число.
            * @tparam int iX - 8, 16, 32 количество бит.
            */
            BinWriter.prototype.intX = function (iValue, iX) {
                if (akra.isNull(iValue)) {
                    iValue = 0;
                }

                // LOG("int", iX, ": ", iValue);
                akra.debug.assert(akra.isNumber(iValue));
                akra.debug.assert(-Math.pow(2, iX - 1) <= iValue && iValue <= Math.pow(2, iX - 1) - 1, "Это значение не влезет в тип int" + iX);

                var arrTmpBuf = null;

                switch (iX) {
                    case 8:
                        arrTmpBuf = new Int8Array(4);
                        arrTmpBuf[0] = iValue;
                        break;
                    case 16:
                        arrTmpBuf = new Int16Array(2);
                        arrTmpBuf[0] = iValue;
                        break;
                    case 32:
                        arrTmpBuf = new Int32Array(1);
                        arrTmpBuf[0] = iValue;
                        break;
                    default:
                        akra.logger.error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.");
                        break;
                }

                //trace('int' + iX, iValue);
                this._pArrData[this._pArrData.length] = new Uint8Array(arrTmpBuf.buffer);
                this._iCountData += 4;
            };

            /**
            * @property int8(iValue)
            * Запись числа типа int8. Оно выравнивается до 4 байт. Если передан null то
            * число принимается равным 0. Если передано любое другое не числовое значение
            * то выводится ошибка.
            * Сокращенная запись функции intX(iValue, 8).
            * @memberof BinWriter
            * @tparam uint iValue число.
            */
            BinWriter.prototype.int8 = function (iValue) {
                this.intX(iValue, 8);
            };

            /**
            * @property int16(iValue)
            * Запись числа типа uint16. Оно выравнивается до 4 байт. Если передан null то
            * число принимается равным 0. Если передано любое другое не числовое значение
            * то выводится ошибка.
            * Сокращенная запись функции intX(iValue, 16).
            * @memberof BinWriter
            * @tparam int iValue число.
            */
            BinWriter.prototype.int16 = function (iValue) {
                this.intX(iValue, 16);
            };

            /**
            * @property uint32(iValue)
            * Запись числа типа uint8. Если передан null то число принимается равным 0.
            * Если передано любое другое не числовое значение то выводится ошибка.
            * Сокращенная запись функции intX(iValue, 32).
            * @memberof BinWriter
            * @tparam int iValue число.
            */
            BinWriter.prototype.int32 = function (iValue) {
                this.intX(iValue, 32);
            };

            /******************************************************************************/
            /*						  writeArrayElementIntX							*/
            /******************************************************************************/
            /**
            * @property writeArrayElementIntX(iValue, iX)
            * Запись числа типа int(8, 16, 32). Используется для записи элементов массивов.
            * В отличии от intX число не выравнивается до 4 байт, а записывается ровно
            * столько байт сколько передано во втором параметре в функцию. Вторым
            * параметром передается колчиество бит а не байт. Если передан null то число
            * принимается равным 0. Если передано любое другое не числовое значение то
            * выводится ошибка.
            * @memberof BinWriter
            * @tparam int iValue число.
            * @tparam int iX - 8, 16, 32 количество бит.
            */
            BinWriter.prototype.writeArrayElementIntX = function (iValue, iX) {
                if (akra.isNull(iValue)) {
                    iValue = 0;
                }

                // LOG("array int", iX, ": ", iValue);
                akra.debug.assert(akra.isNumber(iValue));
                akra.debug.assert(-Math.pow(2, iX - 1) <= iValue && iValue <= Math.pow(2, iX - 1) - 1, "Это значение не влезет в тип int" + iX);

                var arrTmpBuf = null;

                switch (iX) {
                    case 8:
                        arrTmpBuf = new Int8Array(1);
                        arrTmpBuf[0] = iValue;
                        break;
                    case 16:
                        arrTmpBuf = new Int16Array(1);
                        arrTmpBuf[0] = iValue;
                        break;
                    case 32:
                        arrTmpBuf = new Int32Array(1);
                        arrTmpBuf[0] = iValue;
                        break;
                    default:
                        akra.logger.error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32.");
                        break;
                }
                this._pArrData[this._pArrData.length] = new Uint8Array(arrTmpBuf.buffer);
                this._iCountData += (iX / 8);
            };

            /******************************************************************************/
            /*								  floatX									*/
            /******************************************************************************/
            /**
            * @property floatX(fValue, iX)
            * Запись числа типа float(32, 64). выравнивания не происходит т.к. они уже
            * выравнены до 4. Если передан null то число принимается равным 0.
            * Если передано любое другое не числовое значение то выводится ошибка.
            * @memberof BinWriter
            * @tparam float fValue число.
            * @tparam int iX - 32, 64 количество бит.
            */
            BinWriter.prototype.floatX = function (fValue, iX) {
                if (akra.isNull(fValue)) {
                    fValue = 0;
                }

                akra.debug.assert(akra.isNumber(fValue));

                //debug.assert(typeof(fValue) == 'number', "Не является числом");
                // LOG("float", iX, ": ", fValue);
                var arrTmpBuf = null;

                switch (iX) {
                    case 32:
                        arrTmpBuf = new Float32Array(1);
                        arrTmpBuf[0] = fValue;
                        break;
                    case 64:
                        arrTmpBuf = new Float64Array(1);
                        arrTmpBuf[0] = fValue;
                        break;
                    default:
                        akra.logger.error("Передано недопустимое значение длинны. Допустимые значения 32, 64.");
                        break;
                }

                //trace('float' + iX, fValue);
                this._pArrData[this._pArrData.length] = new Uint8Array(arrTmpBuf.buffer);
                this._iCountData += (iX / 8);
            };

            /**
            * @property float32(fValue)
            * Запись числа типа float32. Если передан null то число принимается равным 0.
            * Если передано любое другое не числовое значение то выводится ошибка.
            * Сокращенная запись функции floatX(fValue, 32).
            * @memberof BinWriter
            * @tparam float fValue число.
            */
            BinWriter.prototype.float32 = function (fValue) {
                this.floatX(fValue, 32);
            };

            /**
            * @property float64(fValue)
            * Запись числа типа float64. Если передан null то число принимается равным 0.
            * Если передано любое другое не числовое значение то выводится ошибка.
            * Сокращенная запись функции floatX(fValue, 64).
            * @memberof BinWriter
            * @tparam float fValue число.
            */
            BinWriter.prototype.float64 = function (fValue) {
                this.floatX(fValue, 64);
            };

            /******************************************************************************/
            /*							 stringArray									*/
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
                if (!akra.isDefAndNotNull(arrString)) {
                    this.uint32(0xffffffff);
                    return;
                }

                this.uint32(arrString.length);
                for (var i = 0; i < arrString.length; i++) {
                    this.string(arrString[i]);
                }
            };

            /******************************************************************************/
            /*							 uintXArray									 */
            /******************************************************************************/
            /**
            * @property uintXArray(arrUint, iX)
            * Записывает массив чисел uint(8, 16, 32) использую для каждого элемента функцию
            *  writeArrayElementUintX. До начала записи элементов записывает общее
            *  количество элементов как число uint32. Если в качестве параметра функции
            * передано null или undefined то количество элементов записывается
            * равным 0xffffffff. Общее количество байт в массиве выравнивается к 4.
            * Все массивы приводятся к нужному типу Uint(iX)Array.
            * @memberof BinWriter
            * @tparam Uint(iX)Array arrUint массив uint(iX).
            * @tparam int iX размер элемента в битах (8, 16, 32).
            */
            BinWriter.prototype.uintXArray = function (arrUint, iX) {
                if (!akra.isDefAndNotNull(arrUint)) {
                    this.uint32(0xffffffff);
                    return;
                }

                var iUintArrLength = arrUint.byteLength;
                var iBitesToAdd;
                var arrTmpUint = null;

                switch (iX) {
                    case 8:
                        iBitesToAdd = ((4 - (iUintArrLength % 4) == 4)) ? 0 : (4 - (iUintArrLength % 4));
                        if (iBitesToAdd > 0 || !(arrUint instanceof Uint8Array)) {
                            arrTmpUint = new Uint8Array(iUintArrLength + iBitesToAdd);
                            arrTmpUint.set(arrUint);
                        } else {
                            arrTmpUint = arrUint;
                        }
                        break;
                    case 16:
                        iUintArrLength /= 2;
                        iBitesToAdd = ((2 - (iUintArrLength % 2) == 2)) ? 0 : (2 - (iUintArrLength % 2));
                        if (iBitesToAdd > 0 || !(arrUint instanceof Uint16Array)) {
                            arrTmpUint = new Uint16Array(iUintArrLength + iBitesToAdd);
                            arrTmpUint.set(arrUint);
                        } else {
                            arrTmpUint = arrUint;
                        }
                        break;
                    case 32:
                        iUintArrLength /= 4;
                        if (!(arrUint instanceof Uint32Array)) {
                            arrTmpUint = new Uint32Array(arrUint);
                        } else {
                            arrTmpUint = arrUint;
                        }
                        break;
                }

                this.uint32(iUintArrLength);

                for (var i = 0, n = arrTmpUint.byteLength / (iX / 8); i < n; i++) {
                    this.writeArrayElementUintX(arrTmpUint[i], iX);
                }
            };

            /**
            * @property uint8Array(arrUint)
            * Запись массива типа Uint8Array. До начала записи элементов записывает общее
            * количество элементов как число uint32. Если в качестве параметра функции
            * передано null или undefined то количество элементов записывается
            * равным 0xffffffff. Общее количество байт в массиве выравнивается до 4.
            * Сокращенная запись функции uintXArray(arrUint, 8).
            * @memberof BinWriter
            * @tparam Uint8Array arrUint массив uint8.
            */
            BinWriter.prototype.uint8Array = function (arrUint) {
                this.uintXArray(arrUint, 8);
            };

            /**
            * @property uint16Array(arrUint)
            * Запись массива типа Uint16Array. До начала записи элементов записывает общее
            * количество элементов как число uint32. Если в качестве параметра функции
            * передано null или undefined то количество элементов записывается
            * равным 0xffffffff. Общее количество байт в массиве выравнивается до 4.
            * Сокращенная запись функции uintXArray(arrUint, 16).
            * @memberof BinWriter
            * @tparam Uint16Array arrUint массив uint16.
            */
            BinWriter.prototype.uint16Array = function (arrUint) {
                this.uintXArray(arrUint, 16);
            };

            /**
            * @property uint32Array(arrUint)
            * Запись массива типа Uint32Array. До начала записи элементов записывает общее
            * количество элементов как число uint32. Если в качестве параметра функции
            * передано null или undefined то количество элементов записывается
            * равным 0xffffffff.
            * Сокращенная запись функции uintXArray(arrUint, 32).
            * @memberof BinWriter
            * @tparam Uint32Array arrUint массив uint32.
            */
            BinWriter.prototype.uint32Array = function (arrUint) {
                this.uintXArray(arrUint, 32);
            };

            /******************************************************************************/
            /*							   intXArray									*/
            /******************************************************************************/
            /**
            * @property intXArray(arrInt, iX)
            * Записывает массив чисел int(8, 16, 32) использую для каждого элемента функцию
            *  writeArrayElementIntX. До начала записи элементов записывает общее
            *  количество элементов как число int32. Если в качестве параметра функции
            * передано null или undefined то количество элементов записывается
            * равным 0xffffffff. Общее количество байт в массиве выравнивается к 4.
            * Все массивы приводятся к нужному типу Int(iX)Array.
            * @memberof BinWriter
            * @tparam Int(iX)Array arrUint массив int(iX).
            * @tparam int iX размер элемента в битах (8, 16, 32).
            */
            BinWriter.prototype.intXArray = function (arrInt, iX) {
                if (!akra.isDefAndNotNull(arrInt)) {
                    this.uint32(0xffffffff);
                    return;
                }

                var iIntArrLength = 0;
                var iBitesToAdd = 0;
                var arrTmpInt = null;

                switch (iX) {
                    case 8:
                        iIntArrLength = arrInt.length;
                        iBitesToAdd = ((4 - (iIntArrLength % 4) == 4)) ? 0 : (4 - (iIntArrLength % 4));
                        if (iBitesToAdd > 0 || !(arrInt instanceof Int8Array)) {
                            arrTmpInt = new Int8Array(iIntArrLength + iBitesToAdd);
                            arrTmpInt.set(arrInt);
                        } else {
                            arrTmpInt = arrInt;
                        }
                        break;
                    case 16:
                        iIntArrLength = arrInt.length;
                        iBitesToAdd = ((2 - (iIntArrLength % 2) == 2)) ? 0 : (2 - (iIntArrLength % 2));
                        if (iBitesToAdd > 0 || !(arrInt instanceof Int16Array)) {
                            arrTmpInt = new Int16Array(iIntArrLength + iBitesToAdd);
                            arrTmpInt.set(arrInt);
                        } else {
                            arrTmpInt = arrInt;
                        }
                        break;
                    case 32:
                        iIntArrLength = arrInt.length;
                        if (!(arrInt instanceof Int32Array)) {
                            arrTmpInt = new Int32Array(arrInt);
                        } else {
                            arrTmpInt = arrInt;
                        }
                        break;
                }

                this.uint32(iIntArrLength);

                for (var i = 0, n = arrTmpInt.byteLength / (iX / 8); i < n; i++) {
                    this.writeArrayElementIntX(arrTmpInt[i], iX);
                }
            };

            /**
            * @property int8Array(arrInt)
            * Запись массива типа Int8Array. До начала записи элементов записывает общее
            * количество элементов как число uint32. Если в качестве параметра функции
            * передано null или undefined то количество элементов записывается
            * равным 0xffffffff. Общее количество байт в массиве выравнивается до 4.
            * Сокращенная запись функции intXArray(arrInt, 8).
            * @memberof BinWriter
            * @tparam Int8Array arrInt массив int8.
            */
            BinWriter.prototype.int8Array = function (arrInt) {
                this.intXArray(arrInt, 8);
            };

            /**
            * @property int16Array(arrInt)
            * Запись массива типа Int16Array. До начала записи элементов записывает общее
            * количество элементов как число uint32. Если в качестве параметра функции
            * передано null или undefined то количество элементов записывается
            * равным 0xffffffff. Общее количество байт в массиве выравнивается до 4.
            * Сокращенная запись функции intXArray(arrInt, 16).
            * @memberof BinWriter
            * @tparam Int16Array arrInt массив int16.
            */
            BinWriter.prototype.int16Array = function (arrInt) {
                this.intXArray(arrInt, 16);
            };

            /**
            * @property int32Array(arrInt)
            * Запись массива типа Int32Array. До начала записи элементов записывает общее
            * количество элементов как число uint32. Если в качестве параметра функции
            * передано null или undefined то количество элементов записывается
            * равным 0xffffffff.
            * Сокращенная запись функции intXArray(arrInt, 32).
            * @memberof BinWriter
            * @tparam Int32Array arrInt массив int32.
            */
            BinWriter.prototype.int32Array = function (arrInt) {
                this.intXArray(arrInt, 32);
            };

            /******************************************************************************/
            /*							  floatXArray								   */
            /******************************************************************************/
            /**
            * @property floatXArray(arrFloat, iX)
            * Записывает массив чисел float(32, 64) использую для каждого элемента функцию
            *  floatX. До начала записи элементов записывает общее
            *  количество элементов как число int32. Если в качестве параметра функции
            * передано null или undefined то количество элементов записывается
            * равным 0xffffffff.
            * Все массивы приводятся к нужному типу Float(iX)Array.
            * @memberof BinWriter
            * @tparam Float(iX)Array arrFloat массив float(iX).
            * @tparam int iX размер элемента в битах (32, 64).
            */
            BinWriter.prototype.floatXArray = function (arrFloat, iX) {
                if (!akra.isDefAndNotNull(arrFloat)) {
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
                var iFloatArrLength = arrFloat.byteLength / (iX / 8);
                this.uint32(iFloatArrLength);

                for (var i = 0, n = iFloatArrLength; i < n; i++) {
                    this.floatX(arrFloat[i], iX);
                }
            };

            /**
            * @property float32Array(arrFloat)
            * Запись массива типа Float32Array. До начала записи элементов записывает общее
            * количество элементов как число uint32. Если в качестве параметра функции
            * передано null или undefined то количество элементов записывается
            * равным 0xffffffff.
            * Все переданные массивы приводятся к типу Float32Array.
            * Сокращенная запись функции floatXArray(arrFloat, 32).
            * @memberof BinWriter
            * @tparam Float32Array arrFloat массив float32.
            */
            BinWriter.prototype.float32Array = function (arrFloat) {
                this.floatXArray(arrFloat, 32);
            };

            /**
            * @property float64Array(arrFloat)
            * Запись массива типа Float64Array. До начала записи элементов записывает общее
            * количество элементов как число uint32. Если в качестве параметра функции
            * передано null или undefined то количество элементов записывается
            * равным 0xffffffff.
            * Все переданные массивы приводятся к типу Float64Array.
            * Сокращенная запись функции floatXArray(arrFloat, 64).
            * @memberof BinWriter
            * @tparam Float64Array arrFloat массив float64.
            */
            BinWriter.prototype.float64Array = function (arrFloat) {
                this.floatXArray(arrFloat, 64);
            };

            /**
            * @property data()
            * Берет все данные из массива _pArrData и записывает их в массив
            * типа ArrayBuffer.
            * @memberof BinWriter
            * @treturn ArrayBuffer.
            */
            BinWriter.prototype.data = function () {
                return this.dataAsUint8Array().buffer;
            };

            /**
            * @property data()
            * Берет все данные из массива _pArrData и записывает их в строку.
            * @memberof BinWriter
            * @treturn String.
            */
            BinWriter.prototype.dataAsString = function () {
                var tmpArrBuffer = this.dataAsUint8Array();
                var sString = "";

                for (var n = 0; n < tmpArrBuffer.length; ++n) {
                    var charCode = String.fromCharCode(tmpArrBuffer[n]);
                    sString = sString + charCode;
                }

                return sString;
            };

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
                var iBitesToAdd = ((4 - (len % 4) == 4)) ? 0 : (4 - (len % 4));
                var arr = new Array(len + iBitesToAdd);

                for (idx = 0; idx < len; ++idx) {
                    arr[idx] = str.charCodeAt(idx); /* & 0xFF;*/
                }
                return new Uint8Array(arr);
            };
            return BinWriter;
        })();
        io.BinWriter = BinWriter;
    })(akra.io || (akra.io = {}));
    var io = akra.io;
})(akra || (akra = {}));
//# sourceMappingURL=BinWriter.js.map
