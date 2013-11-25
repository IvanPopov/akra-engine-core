enum AEScopeType {
    k_Default,
    k_Struct,
    k_Annotation
}

interface AIScope {
    parent: AIScope;
    index: uint;
    type: AEScopeType;
    isStrictMode: boolean;

    variableMap: AIAFXVariableDeclMap;
    typeMap: AIAFXTypeDeclMap;
    functionMap: AIAFXFunctionDeclListMap;
}

interface AIScopeMap {
    [scopeIndex: uint]: AIScope;
}