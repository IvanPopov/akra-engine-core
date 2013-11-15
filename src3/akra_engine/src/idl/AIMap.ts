interface AIStringMap {
    [index: string]: string;
    [index: uint]: string;
};

interface AIIntMap {
    [index: string]: int;
    [index: uint]: int;
};

interface AIUintMap {
    [index: string]: uint;
    [index: uint]: uint;
};

interface AIFloatMap {
    [index: string]: float;
    [index: uint]: float;
};

interface AIBoolMap {
    [index: string]: boolean;
    [index: uint]: boolean;
};

interface AIBoolDMap {
    [index: string]: AIBoolMap;
    [index: uint]: AIBoolMap;
};

interface AIStringDMap {
    [index: string]: AIStringMap;
    [index: uint]: AIStringMap;
}