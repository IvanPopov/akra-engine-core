#pragma once

module akra.bf {
	/**
	 * Сдвиг единицы на @a x позиций влево.
	 * @inline
	 */
	export var flag = (x: int) => (1 << (x));
	/**
	 * Проверка того что у @a value бит под номером @a bit равен единице.
	 * @inline
	 */
	export var testBit = (value: int, bit: int) => ((value & flag(bit)) != 0);
	/**
	 * Проверка того что у @a value равны единице все биты,
 	 * которые равны единице у @a set.
	 * @inline
	 */
	export var testAll = (value: int, set: int) => (((value) & (set)) == (set));
	/**
	 * Проверка того что у @a value равны единице хотя бы какие то из битов,
 	 * которые равны единице у @a set.
	 * @inline
	 */
	export var testAny = (value: int, set: int) => (((value) & (set)) != 0);
	/**
	 * Выставляет бит под номером @a bit у числа @a value равным единице
	 * @inline
	 */
	export var setBit = (value: int, bit: int, setting: bool = true) => (setting ? ((value) |= flag((bit))) : clearBit(value, bit));
	/**
	 * 
	 * @inline
	 */
	export var clearBit = (value: int, bit: int) => ((value) &= ~flag((bit)));
	/**
	 * Выставляет бит под номером @a bit у числа @a value равным нулю
	 * @inline
	 */
	export var setAll = (value: int, set: int, setting: bool = true) => (setting ? setAll(value, set) : clearAll(value, set));
	/**
	 * Выставляет все биты у числа @a value равными единице,
 	 * которые равны единице у числа @a set
	 * @inline
	 */
	export var clearAll = (value: int, set: int) => ((value) &= ~(set));
	/**
	 * Выставляет все биты у числа @a value равными нулю,
 	 * которые равны единице у числа @a set
	 * @inline
	 */
	export var equal = (value: int, src: int) => { value = src; };
	/**
	 * Прирасваивает числу @a value число @a src
	 * @inline
	 */
	export var isEqual = (value: int, src: int) => value == src;
	/**
	 * Если число @a value равно числу @a src возвращается true
	 * @inline
	 */
	export var isNotEqaul = (value: int, src: int) => value != src;
	/**
	 * Прирасваивает числу @a value число @a src
	 * @inline
	 */
	export var set = (value: int, src: int) => { value = src; };
	/**
	 * Обнуляет число @a value
	 * @inline
	 */
	export var clear = (value: int) => { value = 0; };
	/**
	 * Выставляет все биты у числа @a value равными единице,
 	 * которые равны единице у числа @a src
	 * @inline
	 */
	export var setFlags = (value: int, src: int) => (value |= src);
	/**
	 * Выставляет все биты у числа @a value равными нулю,
 	 * которые равны единице у числа @a src
	 * @inline
	 */
	export var clearFlags = (value: int, src: int) => value &= ~src;
	/**
	 * Проверяет равно ли число @a value нулю. Если равно возвращает true.
 	 * Если не равно возвращает false.
	 * @inline
	 */
	export var isEmpty = (value: int) => (value == 0);
	/**
	 * Возвращает общее количество бит числа @a value.
 	 * На самом деле возвращает всегда 32.
	 * @inline
	 */
	export var totalBits = (value: int) => 32;
	/**
	 * Возвращает общее количество ненулевых бит числа @a value.
	 * @inline
	 */
	export var totalSet = (value: int): int => {
		var count: int = 0;
        var total: int = totalBits(value);
        
        for (var i: int = total; i; --i) {
            count += (value & 1);
            value >>= 1;
        }

        return(count);
	}
}