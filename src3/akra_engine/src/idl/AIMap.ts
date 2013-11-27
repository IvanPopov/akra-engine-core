interface AIMap<T> {
    [index: string]: T;
    [index: uint]: T;
}

/** @deprecated Use AIMap<type> instead. */
interface AIStringMap {
    [index: string]: string;
    [index: uint]: string;
}
/** @deprecated Use AIMap<type> instead. */
interface AIIntMap {
    [index: string]: int;
    [index: uint]: int;
}
/** @deprecated Use AIMap<type> instead. */
interface AIUintMap {
    [index: string]: uint;
    [index: uint]: uint;
}
/** @deprecated Use AIMap<type> instead. */
interface AIFloatMap {
    [index: string]: float;
    [index: uint]: float;
}
/** @deprecated Use AIMap<type> instead. */
interface AIBoolMap {
    [index: string]: boolean;
    [index: uint]: boolean;
}
/** @deprecated Use AIMap<type> instead. */
interface AIBoolDMap {
    [index: string]: AIBoolMap;
    [index: uint]: AIBoolMap;
}
/** @deprecated Use AIMap<type> instead. */
interface AIStringDMap {
    [index: string]: AIStringMap;
    [index: uint]: AIStringMap;
}