var akra;
(function (akra) {
    (function (bf) {
        /**
        * Сдвиг единицы на @a x позиций влево.
        */
        bf.flag = function (x) {
            return (1 << (x));
        };

        /**
        * Проверка того что у @a value бит под номером @a bit равен единице.
        */
        bf.testBit = function (value, bit) {
            return ((value & bf.flag(bit)) != 0);
        };

        /**
        * Проверка того что у @a value равны единице все биты,
        * которые равны единице у @a set.
        */
        bf.testAll = function (value, set) {
            return (((value) & (set)) == (set));
        };

        /**
        * Проверка того что у @a value равны единице хотя бы какие то из битов,
        * которые равны единице у @a set.
        */
        bf.testAny = function (value, set) {
            return (((value) & (set)) != 0);
        };

        /**
        * Выставляет бит под номером @a bit у числа @a value равным единице
        */
        bf.setBit = function (value, bit, setting) {
            if (typeof setting === "undefined") { setting = true; }
            return (setting ? ((value) |= bf.flag((bit))) : bf.clearBit(value, bit));
        };

        /**
        *
        */
        bf.clearBit = function (value, bit) {
            return ((value) &= ~bf.flag((bit)));
        };

        /**
        * Выставляет бит под номером @a bit у числа @a value равным нулю
        */
        bf.setAll = function (value, set, setting) {
            if (typeof setting === "undefined") { setting = true; }
            return (setting ? ((value) |= (set)) : ((value) &= ~(set)));
        };

        /**
        * Выставляет все биты у числа @a value равными единице,
        * которые равны единице у числа @a set
        */
        bf.clearAll = function (value, set) {
            return ((value) &= ~(set));
        };

        /**
        * Выставляет все биты у числа @a value равными нулю,
        * которые равны единице у числа @a set
        */
        bf.equal = function (value, src) {
            value = src;
        };

        /**
        * Прирасваивает числу @a value число @a src
        */
        bf.isEqual = function (value, src) {
            return value == src;
        };

        /**
        * Если число @a value равно числу @a src возвращается true
        */
        bf.isNotEqaul = function (value, src) {
            return value != src;
        };

        /**
        * Прирасваивает числу @a value число @a src
        */
        bf.set = function (value, src) {
            value = src;
        };

        /**
        * Обнуляет число @a value
        */
        bf.clear = function (value) {
            value = 0;
        };

        /**
        * Выставляет все биты у числа @a value равными единице,
        * которые равны единице у числа @a src
        */
        bf.setFlags = function (value, src) {
            return (value |= src);
        };

        /**
        * Выставляет все биты у числа @a value равными нулю,
        * которые равны единице у числа @a src
        */
        bf.clearFlags = function (value, src) {
            return value &= ~src;
        };

        /**
        * Проверяет равно ли число @a value нулю. Если равно возвращает true.
        * Если не равно возвращает false.
        */
        bf.isEmpty = function (value) {
            return (value == 0);
        };

        /**
        * Возвращает общее количество бит числа @a value.
        * На самом деле возвращает всегда 32.
        */
        bf.totalBits = function (value) {
            return 32;
        };

        /**
        * Возвращает общее количество ненулевых бит числа @a value.
        */
        bf.totalSet = function (value) {
            var count = 0;
            var total = bf.totalBits(value);

            for (var i = total; i; --i) {
                count += (value & 1);
                value >>= 1;
            }

            return (count);
        };

        /**
        * Convert N bit colour channel value to P bits. It fills P bits with the
        * bit pattern repeated. (this is /((1<<n)-1) in fixed point)
        */
        function fixedToFixed(value, n, p) {
            if (n > p) {
                // Less bits required than available; this is easy
                value >>= n - p;
            } else if (n < p) {
                if (value == 0)
                    value = 0;
else if (value == ((1) << n) - 1)
                    value = (1 << p) - 1;
else
                    value = value * (1 << p) / ((1 << n) - 1);
            }
            return value;
        }
        bf.fixedToFixed = fixedToFixed;

        /**
        * Convert floating point colour channel value between 0.0 and 1.0 (otherwise clamped)
        * to integer of a certain number of bits. Works for any value of bits between 0 and 31.
        */
        function floatToFixed(value, bits) {
            if (value <= 0.0)
                return 0;
else if (value >= 1.0)
                return (1 << bits) - 1;
else
                return (value * (1 << bits));
        }
        bf.floatToFixed = floatToFixed;

        /**
        * Fixed point to float
        */
        function fixedToFloat(value, bits) {
            return (value & ((1 << bits) - 1)) / ((1 << bits) - 1);
        }
        bf.fixedToFloat = fixedToFloat;

        /**
        * Write a n*8 bits integer value to memory in native endian.
        */
        function intWrite(pDest, n, value) {
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

            return;
        }
        bf.intWrite = intWrite;

        /**
        * Read a n*8 bits integer value to memory in native endian.
        */
        function intRead(pSrc, n) {
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
        }
        bf.intRead = intRead;

        //float32/uint32 union
        var _u32 = new Uint32Array(1);
        var _f32 = new Float32Array(_u32.buffer);

        function floatToHalf(f) {
            _f32[0] = f;
            return floatToHalfI(_u32[0]);
        }
        bf.floatToHalf = floatToHalf;

        function floatToHalfI(i) {
            var s = (i >> 16) & 0x00008000;
            var e = ((i >> 23) & 0x000000ff) - (127 - 15);
            var m = i & 0x007fffff;

            if (e <= 0) {
                if (e < -10) {
                    return 0;
                }
                m = (m | 0x00800000) >> (1 - e);

                return (s | (m >> 13));
            } else if (e == 0xff - (127 - 15)) {
                if (m == 0) {
                    return (s | 0x7c00);
                } else {
                    m >>= 13;
                    return (s | 0x7c00 | m | (m == 0));
                }
            } else {
                if (e > 30) {
                    return (s | 0x7c00);
                }

                return (s | (e << 10) | (m >> 13));
            }
        }
        bf.floatToHalfI = floatToHalfI;

        /**
        * Convert a float16 (NV_half_float) to a float32
        * Courtesy of OpenEXR
        */
        function halfToFloat(y) {
            _u32[0] = halfToFloatI(y);
            return _f32[0];
        }
        bf.halfToFloat = halfToFloat;

        /** Converts a half in uint16 format to a float
        in uint32 format
        */
        function halfToFloatI(y) {
            var s = (y >> 15) & 0x00000001;
            var e = (y >> 10) & 0x0000001f;
            var m = y & 0x000003ff;

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
        }
        bf.halfToFloatI = halfToFloatI;
    })(akra.bf || (akra.bf = {}));
    var bf = akra.bf;
})(akra || (akra = {}));
