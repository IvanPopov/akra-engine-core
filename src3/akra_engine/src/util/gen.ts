import type = require("../type");
import isNull = type.isNull;

/**
 * Generated typed array by {Type} and {size}.
 */
export function array<T>(size: number, Type: T = null): T[] {
    var tmp: T[] = <T[]>new Array(size);

    for (var i: number = 0; i < size; ++i) {
        tmp[i] = (isNull(Type) ? (new <any>Type): null);
    }

    return tmp;
}

