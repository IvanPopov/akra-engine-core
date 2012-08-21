/**
 * @file
 * @brief NumericTools
 * @author xoma
 * @email xoma@odserve.org
 * Разные функции для работы с числами, пережиток старого движка поэтому по большинству не нужные
 * Разные функции для работы с числами, пережиток старого движка поэтому по большинству не нужные
 **/


/**
 * @property fpBits(Int f)
 * Преобразованеи float в int нам не нужно
 * @param f
 * @return Int
 **/
Define(Math.fpBits(f), function () {
    Math.floor(f)
});

/**
 * @property fpBits(Int f)
 * Преобразованеи int в float нам не нужно
 * @param f
 * @return Int
 **/
Define(Math.intBits(f), function () {
    f
});


/**
 * @property fpBits(Int f)
 * Возвращает 0 или -1 как знак числа
 * @param f
 * @return Int
 **/
Define(Math.fpSign(f), function () {
    (f >> 31)
});

Define(Math.fpOneBits, 0x3F800000);

/**
 * @property flipSign(Int i, Int flip)
 * конвертировать i если flip равен -1, и ничего не делать если 0
 * @param f
 * @param flip
 * @return Int
 **/
Define(Math.flipSign(i, flip), function () {
    ((flip == -1) ? -i : i)
});
//Define(Math.flipSign(i, flip), function() {((i^ flip) - flip)});

/**
 * @property absoluteValue(value)
 * Абсолютное значение числа
 * @param value
 * @return Int
 **/
Define(Math.absoluteValue(value), function () {
    Math.abs(value)
});


/**
 * @property isPositive(a)
 * Число положительно?
 * @param a
 * @return Boolean
 **/
Define(Math.isPositive(a), function () {
    (a >= 0)
});

/**
 * @property isNegative(a)
 * Число отрицательно?
 * @param a
 * @return Boolean
 **/
Define(Math.isNegative(a), function () {
    (a < 0)
});

/**
 * @property sameSigns(a,b)
 * Число одного знака?
 * @param a
 * @param b
 * @return Boolean
 **/
Define(Math.sameSigns(a, b), function () {
    (Math.isNegative(a) == Math.isNegative(b))
});

/**
 * @property copySign(a,b)
 * Копировать знак
 * @param a
 * @param b
 * @return copySign
 **/
Define(Math.sameSigns(a, b), function () {
    (Math.isNegative(b) ? -Math.absoluteValue(a) : Math.absoluteValue(a))
});

/**
 * @property deltaRangeTest(a,b,epsilon)
 * Растояние между а и b меньше epsilon?
 * @param a
 * @param b
 * @param epsilon
 * @return Boolean
 **/
Define(Math.deltaRangeTest(a, b, epsilon), function () {
    ((Math.absoluteValue(a - b) < epsilon) ? true : false)
});

/**
 * @property deltaRangeTest(a,b)
 * Растояние между а и b меньше DEFAULT_EPSILON?
 * @param a
 * @param b
 * @return Boolean
 **/
Define(Math.deltaRangeTest(a, b), function () {
    ((Math.absoluteValue(a - b) < 0.0000001) ? true : false)
});

/**
 * @property minimum(a,b)
 * минимум
 * @param a
 * @param b
 * @return Int
 **/
Define(Math.minimum(a, b), function () {
    Math.min(a, b)
});

/**
 * @property maximum(a,b)
 * минимум
 * @param a
 * @param b
 * @return Int
 **/
Define(Math.maximum(a, b), function () {
    Math.max(a, b)
});

/**
 * @property clamp(value,low,high)
 * Ограничивает value интервалом [low,high]
 * @param value
 * @param low
 * @param high
 * @return Int
 **/
Define(Math.clamp(value, low, high), function () {
    Math.max(low, Math.min(value, high))
});

/*function clamp(value,low,high)
 {
 if(value < low)
 {
 return low;
 }

 if(value > high)
 {
 return high;
 }
 return value
 }
 Math.clamp=clamp;*/

/**
 * @property clampPositive(value)
 * Ограничивает value интервалом [0,+Infinity]
 * @param value
 * @return Int
 **/
Define(Math.clampPositive(value), function () {
    (value < 0 ? 0 : value)
})

/**
 * @property clampNegative(value)
 * Ограничивает value интервалом [-Infinity,0]
 * @param value
 * @return Int
 **/
Define(Math.clampNegative(value), function () {
    (value > 0 ? 0 : value)
})

/**
 * @property clampUnitSize(value)
 * Ограничивает value интервалом [-1,1]
 * @param value
 * @return Int
 **/
Define(Math.clampUnitSize(value), function () {
    Math.clamp(value, -1, 1)
});

/**
 * @property highestBitSet(value)
 * Номер с права начиная от нуля, самого левого установленного бита
 * @param value
 * @return Int
 **/
Define(Math.highestBitSet(value), function () {
    value == 0 ? (null) : (value < 0 ? 31 : ((Math.log(value) / Math.LN2) << 0))
});


/**
 * Номер с права начиная от нуля, самого правого установленного бита
 * @tparam Uint nValue
 * @treturn Int
 **/

function lowestBitSet (nValue) {
    var temp;
    if (nValue == 0) {
        return null;
    }
    for (temp = 0; temp <= 31; temp++) {
        if (nValue & (1 << temp)) {
            return temp;
        }

    }
    return null;

}

//temp=0;
//res1=null;

Math.lowestBitSet = lowestBitSet;

/**
 * @property isPowerOfTwo(value)
 * Является ли число степенью двойки
 * @param value
 * @return Int
 **/
Define(Math.isPowerOfTwo(value), function () {
    (value > 0 && Math.highestBitSet(value) == Math.lowestBitSet(value))
})

/**
 * @property nearestPowerOfTwo(value)
 * Округление до числа наиболее близкого к степени двойки
 * @param nValue
 * @return Int
 **/
function nearestPowerOfTwo (nValue) {
    if (nValue <= 1) {
        return 1;
    }

    var highestBit = Math.highestBitSet(nValue);
    var roundingTest = nValue & (1 << (highestBit - 1));
    if (roundingTest != 0) {
        ++highestBit;
    }
    return 1 << highestBit;
}
Math.nearestPowerOfTwo = nearestPowerOfTwo;

/**
 * @property ceilingPowerOfTwo(value)
 * Округление до следующего числа являющегося к степени двойки
 * @param nValue
 * @return Int
 **/
function ceilingPowerOfTwo (nValue) {
    if (nValue <= 1) {
        return 1;
    }

    var highestBit = Math.highestBitSet(nValue);
    var mask = nValue & ((1 << highestBit) - 1);
    highestBit += mask && 1;
    return 1 << highestBit;
}
Math.ceilingPowerOfTwo = ceilingPowerOfTwo;

/**
 * @property floorPowerOfTwo(value)
 * Округление до предыдущего числа являющегося к степени двойки
 * @param nValue
 * @return Int
 **/
function floorPowerOfTwo (nValue) {
    if (nValue <= 1) {
        return 1;
    }
    var highestBit = Math.highestBitSet(nValue);
    return 1 << highestBit;
}
Math.floorPowerOfTwo = floorPowerOfTwo;


/**
 * @property raiseToPower(value,power)
 * Возведение числа в степень
 * @param value
 * @param power
 * @return Float
 **/
Define(Math.raiseToPower(value, power), function () {
    Math.pow(value, power)
})

/**
 * @property modulus(Int a, Int b)
 * Деление по модулю
 * @param a
 * @param b
 * @return Int
 **/
Define(Math.modulus(e, divisor), function () {
   (e - Math.floor(e / divisor) * divisor);
})

Define(Math.mod(a, b), function () {
    Math.modulus (a, b);
});

/**
 * @property alignUp(Int value,Int alignment)
 * Вырвнивание числа на alignment вверх
 * @param iValue
 * @param iAlignment
 * @return Int
 **/
function alignUp (iValue, iAlignment) {
    var iRemainder = Math.modulus(iValue, iAlignment);
    if (iRemainder == 0) {
        return(iValue);
    }

    return(iValue + (iAlignment - iRemainder));
}
Math.alignUp = alignUp;

/**
 * @property alignDown(Int value, Int alignment)
 * Вырвнивание числа на alignment вниз
 * @param iValue
 * @param iAlignment
 * @return Int
 **/
function alignDown (iValue, iAlignment) {
    var remainder = Math.modulus(iValue, iAlignment);
    if (remainder == 0) {
        return(iValue);
    }

    return(iValue - remainder);
}
Math.alignDown = alignDown;

/**
 * @property swap(a,b)
 * Поменять местами пеерменные
 * @param a
 * @param b
 * @return Int
 **/
Define(Math.swap(a, b), function () {
    var temp = a;
    a = b;
    b = temp;
})

/**
 * @property inverse(Float a)
 * пнвертировать число
 * @param a
 * @return Float
 **/
Define(Math.inverse(a), function () {
    (1.0 / a)
})


/**
 * @property trimFloat(Float a, Int precision)
 * Округлени числа с определенной точностью, где округляется до значащих чисел как 1/(2^precision)
 * @param a
 * @param precision
 * @return Float
 **/
Define(Math.trimFloat(a, precision), function () {
    (a)
})

/**
 * @property realToInt32_chop(Float a)
 * Перевод дробного в целое с усеением
 * @param a
 * @return Int
 **/
Define(Math.realToInt32_chop(a), function () {
    Math.round(a)
})


/**
 * @property realToInt32_floor(Float a)
 * Перевод дробного в целое до меньшего
 * @param a
 * @return Int
 **/
Define(Math.realToInt32_floor(a), function () {
    Math.floor(a);
})


/**
 * @property realToInt32_ceil(Float a)
 * Перевод дробного в целое до большего
 * @param a
 * @return Int
 **/
Define(Math.realToInt32_ceil(a), function () {
    Math.ceil(a);
})

Define(Math.realToInt32(a), function () {
    Math.round(a);
})
/**
 * @property maxminTest(Float x, Float max, Float min)
 * Compare x with max(min) and update max(min) if x >(<)
 */
Define(Math.maxminTest(x, max, min), function () {
    if (x > max) {
        max = x;
    }
    else if (x < min) {
        min = x;
    }
});

/**
 * @property nod(Integer n, Integer m)
 * Наибольший общий делитель
 */
function nod(n,m)
{
	var p = n%m;
	while (p!=0)
	{ 
		n=m
		m=p
		p=n%m
	}	
	return m;
}
Math.nod=nod;


/**
 * @property nok(Integer n, Integer m)
 * Наименьшее общее ератное
 */
function nok(n,m)
{
	return Math.abs(n*m)/Math.nod(n,m);
}
Math.nok=nok;



/**
 * @property logn(Integer n, Integer m)
 * логарифм по основанию
 */
Define(Math.logn(a,b), function () {
	(Math.log(a)/Math.log(b));
})

/**
 * @property logn(Integer n)
 * логарифм по основанию 10
 */
Define(Math.lg(a), function () {
	(Math.log(n)/Math.LN10);
})

/**
 * @property log2(Integer n)
 * логарифм по основанию 2
 */
Define(Math.log2(a), function () {
	(Math.log(n)/Math.LN2);
})
