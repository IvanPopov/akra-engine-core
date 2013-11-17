declare function typeOf(x: any): string;
declare function isDef(x: any): boolean;
declare function isDefAndNotNull(x: any): boolean;
declare function isEmpty(x: any): boolean;
declare function isNull(x: any): boolean;
declare function isBoolean(x: any): boolean;
declare function isString(x: any): boolean;
declare function isNumber(x: any): boolean;
declare function isFloat(x: any): boolean;
declare function isInt(x: any): boolean;
declare function isFunction(x: any): boolean;
declare function isObject(x: any): boolean;
declare function isArrayBuffer(x: any): boolean;
declare function isBlob(x: any): boolean;
declare function isArray(x: any): boolean;


//matrix 4x4 elements
declare var __11;
declare var __12;
declare var __13;
declare var __14;
declare var __21;
declare var __22;
declare var __23;
declare var __24;
declare var __31;
declare var __32;
declare var __33;
declare var __34;
declare var __41;
declare var __42;
declare var __43;
declare var __44;

//matrix 3x3 elements
declare var __a11;
declare var __a12;
declare var __a13;
declare var __a21;
declare var __a22;
declare var __a23;
declare var __a31;
declare var __a32;
declare var __a33;

interface Array<T> {
    last: T;
    first: T;
    el(i: int): T;
    clear(): T[];
    swap(i: int, j: int): T[];
    insert(elements: T[]): T[];
    find(pElement: any): boolean;
}

interface String {
    toUTF8(): string;
    fromUTF8(): string;
    replaceAt(n: int, s: string);
}
