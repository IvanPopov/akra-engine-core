var akra = {};

akra.bf = {};

/**
 * Сдвиг единицы на @a x позиций влево.
 *
 * @type {?function(number): number}
 */
akra.bf.flag = function (x) {
  return (1 << (x));
};

/**
 * Проверка того что у @a value бит под номером @a bit равен единице.
 *
 * @type {?function(number, number): boolean}
 */
akra.bf.testBit = function (value, bit) {
  return ((value & akra.bf.flag(bit)) != 0);
};

/**
 * Проверка того что у @a value равны единице все биты,,которые равны единице у @a set.
 *
 * @type {?function(number, number): boolean}
 */
akra.bf.testAll = function (value, set) {
  return (((value) & (set)) == (set));
};

/**
 * Проверка того что у @a value равны единице хотя бы какие то из битов,,которые равны единице у @a set.
 *
 * @type {?function(number, number): boolean}
 */
akra.bf.testAny = function (value, set) {
  return (((value) & (set)) != 0);
};

/**
 * Выставляет бит под номером @a bit у числа @a value равным единице
 *
 * @type {?function(number, number, boolean=): number}
 */
akra.bf.setBit = function (value, bit, setting) {
  if (typeof setting === "undefined") setting = true;
  return (setting ? ((value) |= akra.bf.flag((bit))) : akra.bf.clearBit(value, bit));
};

/**
 *
 *
 * @type {?function(number, number): number}
 */
akra.bf.clearBit = function (value, bit) {
  return ((value) &= ~akra.bf.flag((bit)));
};

/**
 * Выставляет бит под номером @a bit у числа @a value равным нулю
 *
 * @type {?function(number, number, boolean=): number}
 */
akra.bf.setAll = function (value, set, setting) {
  if (typeof setting === "undefined") setting = true;
  return (setting ? ((value) |= (set)) : ((value) &= ~(set)));
};

/**
 * Выставляет все биты у числа @a value равными единице,,которые равны единице у числа @a set
 *
 * @type {?function(number, number): number}
 */
akra.bf.clearAll = function (value, set) {
  return ((value) &= ~(set));
};

/**
 * Выставляет все биты у числа @a value равными нулю,,которые равны единице у числа @a set
 *
 * @type {?function(number, number)}
 */
akra.bf.equal = function (value, src) {
  value = src;
};

/**
 * Прирасваивает числу @a value число @a src
 *
 * @type {?function(number, number): boolean}
 */
akra.bf.isEqual = function (value, src) {
  return value == src;
};

/**
 * Если число @a value равно числу @a src возвращается true
 *
 * @type {?function(number, number): boolean}
 */
akra.bf.isNotEqaul = function (value, src) {
  return value != src;
};

/**
 * Прирасваивает числу @a value число @a src
 *
 * @type {?function(number, number)}
 */
akra.bf.set = function (value, src) {
  value = src;
};

/**
 * Обнуляет число @a value
 *
 * @type {?function(number)}
 */
akra.bf.clear = function (value) {
  value = 0;
};

/**
 * Выставляет все биты у числа @a value равными единице,,которые равны единице у числа @a src
 *
 * @type {?function(number, number): number}
 */
akra.bf.setFlags = function (value, src) {
  return (value |= src);
};

/**
 * Выставляет все биты у числа @a value равными нулю,,которые равны единице у числа @a src
 *
 * @type {?function(number, number): number}
 */
akra.bf.clearFlags = function (value, src) {
  return value &= ~src;
};

/**
 * Проверяет равно ли число @a value нулю. Если равно возвращает true.,Если не равно возвращает false.
 *
 * @type {?function(number): boolean}
 */
akra.bf.isEmpty = function (value) {
  return (value == 0);
};

/**
 * Возвращает общее количество бит числа @a value.,На самом деле возвращает всегда 32.
 *
 * @type {?function(number): number}
 */
akra.bf.totalBits = function (value) {
  return 32;
};

/**
 * Возвращает общее количество ненулевых бит числа @a value.
 *
 * @type {?function(number): number}
 */
akra.bf.totalSet = function (value) {
  /** @type {number} */ var count = 0;
  /** @type {number} */ var total = akra.bf.totalBits(value);

  for (var i = total; i; --i) {
    count += (value & 1);
    value >>= 1;
  }

  return (count);
};

/**
 * Convert N bit colour channel value to P bits. It fills P bits with the,bit pattern repeated. (this is /((1<<n)-1) in fixed point)
 *
 * @param {number} value
 * @param {number} n
 * @param {number} p
 * @returns {number}
 */
akra.bf.fixedToFixed = function (value, n, p) {
  if (n > p) {
    // Less bits required than available; this is easy
    value >>= n - p;
  } else if (n < p) {
    if (value == 0)
      value = 0;
else if (value == (/** @type {number} */ ((1)) << n) - 1)
      value = (1 << p) - 1;
else
      value = value * (1 << p) / ((1 << n) - 1);
  }
  return value;
};

/**
 * Convert floating point colour channel value between 0.0 and 1.0 (otherwise clamped) ,to integer of a certain number of bits. Works for any value of bits between 0 and 31.
 *
 * @param {number} value
 * @param {number} bits
 * @returns {number}
 */
akra.bf.floatToFixed = function (value, bits) {
  if (value <= 0.0)
    return 0;
else if (value >= 1.0)
    return (1 << bits) - 1;
else
    return /** @type {number} */ ((value * (1 << bits)));
};

/**
 * Fixed point to float
 *
 * @param {number} value
 * @param {number} bits
 * @returns {number}
 */
akra.bf.fixedToFloat = function (value, bits) {
  return /** @type {number} */ ((value & ((1 << bits) - 1))) / /** @type {number} */ (((1 << bits) - 1));
};

/**
 * Write a n*8 bits integer value to memory in native endian.
 *
 * @param {Uint8Array} pDest
 * @param {number} n
 * @param {number} value
 */
akra.bf.intWrite = function (pDest, n, value) {
  switch (n) {
    case 1:
      pDest[0] = value;
      break;
    case 2:
      pDest[1] = ((value >> 8) & 0xFF);
      pDest[0] = (value & 0xFF);
      break;
    case 3:
      pDest[2] = ((value >> 16) & 0xFF);
      pDest[1] = ((value >> 8) & 0xFF);
      pDest[0] = (value & 0xFF);
      break;
    case 4:
      pDest[3] = ((value >> 24) & 0xFF);
      pDest[2] = ((value >> 16) & 0xFF);
      pDest[1] = ((value >> 8) & 0xFF);
      pDest[0] = (value & 0xFF);
      break;
  }
};

/**
 * Read a n*8 bits integer value to memory in native endian.
 *
 * @param {Uint8Array} pSrc
 * @param {number} n
 * @returns {number}
 */
akra.bf.intRead = function (pSrc, n) {
  switch (n) {
    case 1:
      return pSrc[0];
    case 2:
      return pSrc[0] | pSrc[1] << 8;
    case 3:
      return pSrc[0] | pSrc[1] << 8 | pSrc[2] << 16;
    case 4:
      return (pSrc[0]) | (pSrc[1] << 8) | (pSrc[2] << 16) | (pSrc[3] << 24);
  }
  return 0;
};

/**
 * float32/uint32 union
 *
 * @type {Uint32Array}
 */
akra.bf._u32 = new Uint32Array(1);
/** @type {Float32Array} */ akra.bf._f32 = new Float32Array(akra.bf._u32.buffer);

/**
 * @param {number} f
 * @returns {number}
 */
akra.bf.floatToHalf = function (f) {
  akra.bf._f32[0] = f;
  return akra.bf.floatToHalfI(akra.bf._u32[0]);
};

/**
 * @param {number} i
 * @returns {number}
 */
akra.bf.floatToHalfI = function (i) {
  /** @type {number} */ var s = (i >> 16) & 0x00008000;
  /** @type {number} */ var e = ((i >> 23) & 0x000000ff) - (127 - 15);
  /** @type {number} */ var m = i & 0x007fffff;

  if (e <= 0) {
    if (e < -10) {
      return 0;
    }
    m = (m | 0x00800000) >> (1 - e);

    return /** @type {number} */ ((s | (m >> 13)));
  } else if (e == 0xff - (127 - 15)) {
    if (m == 0) {
      return /** @type {number} */ ((s | 0x7c00));
    } else {
      m >>= 13;
      return /** @type {number} */ ((s | 0x7c00 | m | /** @type {number} */ (/** @type {?} */ ((m == 0)))));
    }
  } else {
    if (e > 30) {
      return /** @type {number} */ ((s | 0x7c00));
    }

    return /** @type {number} */ ((s | (e << 10) | (m >> 13)));
  }
};

/**
 * Convert a float16 (NV_half_float) to a float32,Courtesy of OpenEXR
 *
 * @param {number} y
 * @returns {number}
 */
akra.bf.halfToFloat = function (y) {
  akra.bf._u32[0] = akra.bf.halfToFloatI(y);
  return akra.bf._f32[0];
};

/**
 * Converts a half in uint16 format to a float,in uint32 format
 *
 * @param {number} y
 * @returns {number}
 */
akra.bf.halfToFloatI = function (y) {
  /** @type {number} */ var s = (y >> 15) & 0x00000001;
  /** @type {number} */ var e = (y >> 10) & 0x0000001f;
  /** @type {number} */ var m = y & 0x000003ff;

  if (e == 0) {
    if (m == 0) {
      return s << 31;
    } else {
      while (!(m & 0x00000400)) {
        m <<= 1;
        e -= 1;
      }

      e += 1;
      m &= ~0x00000400;
    }
  } else if (e == 31) {
    if (m == 0) {
      return (s << 31) | 0x7f800000;
    } else {
      return (s << 31) | 0x7f800000 | (m << 13);
    }
  }

  e = e + (127 - 15);
  m = m << 13;

  return (s << 31) | (e << 23) | m;
};
