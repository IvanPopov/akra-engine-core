/**
 * @file
 * @brief Макросы битфлагов.
 * @author Nikita
 *
 *
 */

/**
 * @def FLAG(x)
 * Сдвиг единицы на @a x позиций влево.
 * @param x Количество позиций на которые надо сдвинуть единицу.
 */
Define(FLAG(x), function () {
    (1 << (x));
});

/**
 * @def TEST_BIT(value, bit)
 * Проверка того что у @a value бит под номером @a bit равен единице.
 * @param value число для проверки.
 * @param bit номер бита.
 */
Define(TEST_BIT(value, bit), function () {
    ((value & FLAG(bit)) != 0);
});

/**
 * @def TEST_ALL(value, set)
 * Проверка того что у @a value равны единице все биты,
 * которые равны единице у @a set.
 * @param value число для проверки.
 * @param set число для сравнения.
 */
Define(TEST_ALL(value, set), function () {
    (((value) & (set)) == (set));
});

/**
 * @def TEST_ANY(value, set)
 * Проверка того что у @a value равны единице хотя бы какие то из битов,
 * которые равны единице у @a set.
 * @param value число для проверки.
 * @param set число для сравнения.
 */
Define(TEST_ANY(value, set), function () {
    (((value) & (set)) != 0);
});

/**
 * @def SET_BIT(value, bit)
 * Выставляет бит под номером @a bit у числа @a value равным единице
 * @param value число у которого выставляется бит.
 * @param bit номер бита, который нужно выставить.
 */
Define(SET_BIT(value, bit), function () {
    ((value) |= FLAG((bit)));
});

Define(SET_BIT(value, bit, setting), function () {
    (setting ? SET_BIT(value, bit) : CLEAR_BIT(value, bit))
});

/**
 * @def CLEAR_BIT(value, bit)
 * Выставляет бит под номером @a bit у числа @a value равным нулю
 * @param value число у которого выставляется бит.
 * @param bit номер бита, который нужно выставить.
 */
Define(CLEAR_BIT(value, bit), function () {
    ((value) &= ~FLAG((bit)));
});

/**
 * @def SET_ALL(value, set)
 * Выставляет все биты у числа @a value равными единице,
 * которые равны единице у числа @a set
 * @param value число у которого выставляются биты.
 * @param set число, с помошью которого выставляются биты.
 */
Define(SET_ALL(value, set), function () {
    ((value) |= (set));
});

/**
 * @def CLEAR_ALL(value, set)
 * Выставляет все биты у числа @a value равными нулю,
 * которые равны единице у числа @a set
 * @param value число у которого выставляются биты.
 * @param set число, с помошью которого обнуляются биты.
 */
Define(CLEAR_ALL(value, set), function () {
    ((value) &= ~(set));
});

Define(SET_ALL(value, set, setting), function () {
    (setting ? SET_ALL(value, set) : CLEAR_ALL(value, set))
});

/**
 * @def a.BitFlags.equal(value, src)
 * Прирасваивает числу @a value число @a src
 * @param value число, которому присваивается.
 * @param src число, которое присваивается.
 */
Define(a.BitFlags.equal(value, src), function () {
    value = src;
});

/**
 * @def a.BitFlags.ifequal(value, src)
 * Если число @a value равно числу @a src возвращается true
 * @param value число, для сравнения.
 * @param src число, для сравнения.
 */
Define(a.BitFlags.ifequal(value, src), function () {
    (value == src);
});

/**
 * @def a.BitFlags.ifnotequal(value, src)
 * Если число @a value не равно числу @a src возвращается true
 * @param value число, для сравнения.
 * @param src число, для сравнения.
 */
Define(a.BitFlags.ifnotequal(value, src), function () {
    (value != src);
});

/**
 * @def a.BitFlags.set(value, src)
 * Прирасваивает числу @a value число @a src
 * @param value число, которому присваивается.
 * @param src число, которое присваивается.
 */
Define(a.BitFlags.set(value, src), function () {
    value = src;
});

/**
 * @def a.BitFlags.clear(value)
 * Обнуляет число @a value
 * @param value число, для обнуления.
 */
Define(a.BitFlags.clear(value), function () {
    value = 0;
});

/**
 * @def a.BitFlags.setFlags(value, src)
 * Выставляет все биты у числа @a value равными единице,
 * которые равны единице у числа @a src
 * @param value число у которого выставляются биты.
 * @param src число, с помошью которого выставляются биты.
 */
Define(a.BitFlags.setFlags(value, src), function () {
    (value |= src);
});

/**
 * @def a.BitFlags.clearFlags(value, src)
 * Выставляет все биты у числа @a value равными нулю,
 * которые равны единице у числа @a src
 * @param value число у которого выставляются биты.
 * @param src число, с помошью которого обнуляются биты.
 */
Define(a.BitFlags.clearFlags(value, src), function () {
    value &= ~src;
});

/**
 * @def a.BitFlags.clearBit(value, bit)
 * Выставляет бит под номером @a bit у числа @a value равным нулю
 * @param value число у которого выставляется бит.
 * @param bit номер бита, который нужно выставить.
 */
Define(a.BitFlags.clearBit(value, bit), function () {
    value &= (~(1 << bit));
});

/**
 * @def a.BitFlags.setBit(value, bit, setting)
 * Если setting - истино происходит выставления бита под номером @a bit
 * у числа @a value равным единице.
 * Если @a setting ложно происходит однуления бита макросом @a clearBit
 * @param value число у которого выставляется или обнуляется бит.
 * @param bit номер бита, который нужно выставить или обнулить.
 * @param setting переменная, принимающая значения истины или ложь.
 */
Define(a.BitFlags.setBit(value, bit, setting), function () {
    if (setting) {
        value |= (1 << bit);
    }
    else {
        a.BitFlags.clearBit(value, bit);
    }
});

/**
 * @def a.BitFlags.isEmpty(value)
 * Проверяет равно ли число @a value нулю. Если равно возвращает true.
 * Если не равно возвращает false.
 * @param value число для проверки.
 */
Define(a.BitFlags.isEmpty(value), function () {
    (value == 0);
});

/**
 * @def a.BitFlags.testBit(value, bit)
 * Проверка того что у @a value бит под номером @a bit равен единице.
 * @param value число для проверки.
 * @param bit номер бита.
 */
Define(a.BitFlags.testBit(value, bit), function () {
    (value & (1 << bit));
});

/**
 * @def a.BitFlags.testFlags(value, src)
 * Проверка того что у @a value равны единице все биты,
 * которые равны единице у @a src.
 * @param value число для проверки.
 * @param src число для сравнения.
 */
Define(a.BitFlags.testFlags(value, src), function () {
    ((value & src) == src);
});

/**
 * @def a.BitFlags.testAny(value, src)
 * Проверка того что у @a value равны единице хотя бы какие то из битов,
 * которые равны единице у @a src.
 * @param value число для проверки.
 * @param src число для сравнения.
 */
Define(a.BitFlags.testAny(value, src), function () {
    (value & src);
});

/**
 * @def a.BitFlags.totalBits(value)
 * Возвращает общее количество бит числа @a value.
 * На самом деле возвращает всегда 32.
 * @param value число для проверки.
 */
Define(a.BitFlags.totalBits(value), function () {
    32;
});

/**
 * @def a.BitFlags.totalSet(value, count)
 * Возвращает общее количество ненулевых бит числа @a value.
 * @param value число для проверки.
 * @param count переменная в которую будет возвращено количество ненулевых бит.
 */
Define(a.BitFlags.totalSet(value, count), function () {
    count = a.BitFlags.totalSet(value);
});

a.BitFlags = {
    totalSet: function (value) {
        var count = 0;
        var total = a.BitFlags.totalBits(value);
        for (var i = total; i; --i) {
            count += (value & 1);
            value >>= 1;
        }
        return(count);
    }
};