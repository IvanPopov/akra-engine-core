#ifndef BITFLAGS_TS
#define BITFLAGS_TS

/**
 * FLAG(x)
 * Сдвиг единицы на @a x позиций влево.
 */
#define FLAG(x) (1 << (x))

/**
 * TEST_BIT(value, bit)
 * Проверка того что у @a value бит под номером @a bit равен единице.
 */
#define TEST_BIT(value, bit) ((value & FLAG(bit)) != 0)

/**
 * TEST_ALL(value, set)
 * Проверка того что у @a value равны единице все биты,
 * которые равны единице у @a set.
 */
#define TEST_ALL(value, set) (((value) & (set)) == (set))

/**
 * TEST_ANY(value, set)
 * Проверка того что у @a value равны единице хотя бы какие то из битов,
 * которые равны единице у @a set.
 */
#define TEST_ANY(value, set) (((value) & (set)) != 0)

/**
 * SET_BIT(value, bit)
 * Выставляет бит под номером @a bit у числа @a value равным единице
 */
#define TRUE_BIT(value, bit) ((value) |= FLAG((bit)))

#define SET_BIT(value, bit, setting) (setting ? TRUE_BIT(value, bit) : CLEAR_BIT(value, bit))


/**
 * CLEAR_BIT(value, bit)
 * Выставляет бит под номером @a bit у числа @a value равным нулю
 */
#define CLEAR_BIT(value, bit) ((value) &= ~FLAG((bit)))

/**
 * SET_ALL(value, set)
 * Выставляет все биты у числа @a value равными единице,
 * которые равны единице у числа @a set
 */
#define SET_ALL(value, set) ((value) |= (set))

/**
 * CLEAR_ALL(value, set)
 * Выставляет все биты у числа @a value равными нулю,
 * которые равны единице у числа @a set
 */
#define CLEAR_ALL(value, set) ((value) &= ~(set))

//#define SET_ALL(value, set, setting) (setting ? SET_ALL(value, set) : CLEAR_ALL(value, set))



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
	export var setAll = (value: int, set: int, setting: bool = true) => (setting ? SET_ALL(value, set) : CLEAR_ALL(value, set));
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

	/**
     * Convert N bit colour channel value to P bits. It fills P bits with the
     * bit pattern repeated. (this is /((1<<n)-1) in fixed point)
     */
    export inline function fixedToFixed(value: uint, n: uint, p: uint): uint {
        if(n > p) {
            // Less bits required than available; this is easy
            value >>= n-p;
        } 
        else if(n < p) {
            // More bits required than are there, do the fill
            // Use old fashioned division, probably better than a loop
            if(value == 0)
                    value = 0;
            else if(value == (<uint>(1)<<n)-1)
                    value = (1<<p)-1;
            else    value = value*(1<<p)/((1<<n)-1);
        }
        return value;    
    }

    /**
     * Convert floating point colour channel value between 0.0 and 1.0 (otherwise clamped) 
     * to integer of a certain number of bits. Works for any value of bits between 0 and 31.
     */
    export inline function floatToFixed(value: float, bits: uint): uint {
        if(value <= 0.0) return 0;
        else if (value >= 1.0) return (1<<bits)-1;
        else return <uint>(value * (1<<bits));     
    }

    /**
     * Fixed point to float
     */
    export inline function fixedToFloat(value: uint, bits: uint): float {
        return <float>(value&((1<<bits)-1))/<float>((1<<bits)-1);
    }

    /**
     * Write a n*8 bits integer value to memory in native endian.
     */
    export inline function intWrite(pDest: Uint8Array, n: int, value: uint): void {
        switch(n) {
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
    }

    /**
     * Read a n*8 bits integer value to memory in native endian.
     */
    export inline function intRead(pSrc: Uint8Array, n: int): uint {
        switch(n) {
            case 1:
                return pSrc[0];
            case 2:
                return pSrc[0] | pSrc[1]<<8;
            case 3:     
                return pSrc[0] | pSrc[1]<<8 | pSrc[2]<<16;
            case 4:
                return (pSrc[0]) | (pSrc[1]<<8) | (pSrc[2]<<16) | (pSrc[3]<<24);
        } 
        return 0;
    }

    export function floatToHalfI(i: uint): uint;

    //float32/uint32 union
    var _u32 = new Uint32Array(1);
    var _f32 = new Float32Array(_u32.buffer);

    export inline function floatToHalf(f: float) {
    	_f32[0] = f;
    	return floatToHalfI(_u32[0]);
    }
    export inline function floatToHalfI(i: uint): uint {

        var s: int =  (i >> 16) & 0x00008000;
        var e: int = ((i >> 23) & 0x000000ff) - (127 - 15);
        var m: int =   i        & 0x007fffff;
    
        if (e <= 0) {
            if (e < -10)
            {
                return 0;
            }
            m = (m | 0x00800000) >> (1 - e);
    
            return <uint>(s | (m >> 13));
        }
        else if (e == 0xff - (127 - 15)) {
            // Inf
            if (m == 0) 
            {
                return <uint>(s | 0x7c00);
            } 
            // NAN
            else    
            {
                m >>= 13;
                return <uint>(s | 0x7c00 | m | <int><any>(m == 0));
            }
        }
        else {
            // Overflow
            if (e > 30) 
            {
                return <uint>(s | 0x7c00);
            }
    
            return <uint>(s | (e << 10) | (m >> 13));
        }
    }

    /**
     * Convert a float16 (NV_half_float) to a float32
     * Courtesy of OpenEXR
     */
    export inline function halfToFloat(y: uint): float {
        _u32[0] = halfToFloatI(y);
        return _f32[0];
    }

    /** Converts a half in uint16 format to a float
	 	in uint32 format
	 */
    export inline function halfToFloatI(y: uint): uint {
        var s: int = (y >> 15) & 0x00000001;
        var e: int = (y >> 10) & 0x0000001f;
        var m: int =  y        & 0x000003ff;
    
        if (e == 0) {
        	// Plus or minus zero
            if (m == 0)  {
                return s << 31;
            }
            // Denormalized number -- renormalize it
            else {
                while (!(m & 0x00000400)) {
                    m <<= 1;
                    e -=  1;
                }
    
                e += 1;
                m &= ~0x00000400;
            }
        }
        else if (e == 31) {
        	//Inf
            if (m == 0) {
                return (s << 31) | 0x7f800000;
            }
            //NaN
            else {
                return (s << 31) | 0x7f800000 | (m << 13);
            }
        }
    
        e = e + (127 - 15);
        m = m << 13;
    
        return (s << 31) | (e << 23) | m;
    }

}

#endif