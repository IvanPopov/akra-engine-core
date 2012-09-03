/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var GLOBAL_VARS = {
    VARIABLEDECL          : "VariableDecl",
    TYPEDECL              : "TypeDecl",
    VARSTRUCTDECL         : "VarStructDecl",
    FUNCTIONDECL          : "FunctionDecl",
    TECHIQUEDECL          : "TechniqueDecl",
    USAGES                : "Usages",
    SEMANTIC              : "Semantic",
    ANNOTATION            : "Annotation",
    INITIALIZER           : "Initializer",
    CONST                 : "const",
    ROW_MAJOR             : "row_major",
    COLUMN_MAJOR          : "column_major",
    UNIFORM               : "uniform",
    STATIC                : "static",
    SHARED                : "shared",
    EXTERN                : "extern",
    INLINE                : "inline",
    TYPE                  : "Type",
    VARIABLE              : "Variable",
    T_KW_STATIC           : "static",
    T_KW_UNIFORM          : "uniform",
    T_KW_EXTERN           : "extern",
    T_KW_VOLATILE         : "volatile",
    T_KW_INLINE           : "inline",
    T_KW_SHARED           : "shared",
    T_KW_CONST            : "const",
    T_KW_ROW_MAJOR        : "row_major",
    T_KW_COLUMN_MAJOR     : "column_major",
    T_KW_TYPEDEF          : "typedef",
    T_KW_STRUCT           : "struct",
    T_KW_VOID             : "void",
    T_KW_BOOL             : "bool",
    T_KW_INT              : "int",
    T_KW_HALF             : "half",
    T_KW_FLOAT            : "float",
    T_KW_DOUBLE           : "double",
    T_KW_VECTOR           : "vector",
    T_KW_MATRIX           : "matrix",
    T_KW_STRING           : "string",
    T_KW_TEXTURE          : "texture",
    T_KW_TEXTURE1D        : "texture1D",
    T_KW_TEXTURE2D        : "texture2D",
    T_KW_TEXTURE3D        : "texture3D",
    T_KW_TEXTURECUBE      : "texturecube",
    T_KW_SAMPLER          : "sampler",
    T_KW_SAMPLER1D        : "sampler1D",
    T_KW_SAMPLER2D        : "sampler2D",
    T_KW_SAMPLER3D        : "sampler3D",
    T_KW_SAMPLERCUBE      : "samplercube",
    T_KW_PIXELSHADER      : "pixelshader",
    T_KW_VERTEXSHADER     : "vertexshader",
    T_KW_PIXELFRAGMENT    : "pixelfragment",
    T_KW_VERTEXFRAGMENT   : "vertexfragment",
    T_KW_STATEBLOCK       : "stateblock",
    T_KW_STATEBLOCK_STATE : "stateblock_state",
    T_KW_COMPILE_FRAGMENT : "compile_fragment",
    T_KW_REGISTER         : "register",
    T_KW_COMPILE          : "compile",
    T_KW_SAMPLER_STATE    : "sampler_state",
    T_NON_TYPE_ID         : "T_NON_TYPE_ID",
    T_TYPE_ID             : "T_TYPE_ID",
    T_STRING              : "T_STRING",
    T_FLOAT               : "T_FLOAT",
    T_UINT                : "T_UINT",
    T_KW_TRUE             : "T_KW_TRUE",
    T_KW_FALSE            : "T_KW_FALSE",
    PROGRAM               : "Program",
    DECLS                 : "Decls",
    DECL                  : "Decl",
    USEDECL               : "UseDecl",
    USAGE                 : "Usage",
    CONSTUSAGES           : "ConstUsages",
    CONSTUSAGE            : "ConstUsage",
    USAGETYPE             : "UsageType",
    USAGESTRUCTDECL       : "UsageStructDecl",
    TYPEDEFS              : "TypeDefs",
    CONSTTYPE             : "ConstType",
    CONSTTYPEDIM          : "ConstTypeDim",
    BASETYPE              : "BaseType",
    SCALARTYPE            : "ScalarType",
    VECTORTYPE            : "VectorType",
    MATRIXTYPE            : "MatrixType",
    OBJECTTYPE            : "ObjectType",
    STRUCT                : "Struct",
    STRUCTDECL            : "StructDecl",
    CONSTSTRUCTDECL       : "ConstStructDecl",
    STRUCTBEGIN           : "StructBegin",
    STRUCTDECLS           : "StructDecls",
    STRUCTEND             : "StructEnd",
    SEMANTICS             : "Semantics",
    SEMANTICSOPT          : "SemanticsOpt",
    REGISTER              : "Register",
    ANNOTATIONOPT         : "AnnotationOpt",
    ANNOTATIONBEGIN       : "AnnotationBegin",
    ANNOTATIONDECLS       : "AnnotationDecls",
    ANNOTATIONEND         : "AnnotationEnd",
    INITIALIZEROPT        : "InitializerOpt",
    VARIABLES             : "Variables",
    VARIABLEDIM           : "VariableDim",
    FUNCTIONDEF           : "FunctionDef",
    PARAMLIST             : "ParamList",
    PARAMLISTBEGIN        : "ParamListBegin",
    PARAMLISTEND          : "ParamListEnd",
    PARAMETERDECLS        : "ParameterDecls",
    PARAMETERDECL         : "ParameterDecl",
    PARAMUSAGETYPE        : "ParamUsageType",
    PARAMUSAGES           : "ParamUsages",
    PARAMUSAGE            : "ParamUsage",
    TECHNIQUEDECL         : "TechniqueDecl",
    TECHNIQUEBODY         : "TechniqueBody",
    TECHNIQUEBEGIN        : "TechniqueBegin",
    TECHNIQUEEND          : "TechniqueEnd",
    PASSDECLS             : "PassDecls",
    PASSDECL              : "PassDecl",
    STATEBLOCK            : "StateBlock",
    STATEBLOCKBEGIN       : "StateBlockBegin",
    STATEBLOCKEND         : "StateBlockEnd",
    STATES                : "States",
    STATE                 : "State",
    STATEINDEX            : "StateIndex",
    STATEEXPRBEGIN        : "StateExprBegin",
    STATEEXPREND          : "StateExprEnd",
    STMTBLOCK             : "StmtBlock",
    STMTBLOCKBEGIN        : "StmtBlockBegin",
    STMTBLOCKEND          : "StmtBlockEnd",
    STMTS                 : "Stmts",
    SIMPLESTMT            : "SimpleStmt",
    NONIFSTMT             : "NonIfStmt",
    STMT                  : "Stmt",
    FOR                   : "For",
    FORINIT               : "ForInit",
    FORCOND               : "ForCond",
    FORSTEP               : "ForStep",
    DWORDEXPR             : "DwordExpr",
    STATEEXPR             : "StateExpr",
    SIMPLEEXPR            : "SimpleExpr",
    COMPLEXEXPR           : "ComplexExpr",
    OBJECTEXPR            : "ObjectExpr",
    PRIMARYEXPR           : "PrimaryExpr",
    POSTFIXEXPR           : "PostfixExpr",
    UNARYEXPR             : "UnaryExpr",
    CASTEXPR              : "CastExpr",
    MULEXPR               : "MulExpr",
    ADDEXPR               : "AddExpr",
    RELATIONALEXPR        : "RelationalExpr",
    EQUALITYEXPR          : "EqualityExpr",
    ANDEXPR               : "AndExpr",
    OREXPR                : "OrExpr",
    CONDITIONALEXPR       : "ConditionalExpr",
    ASSIGNMENTEXPR        : "AssignmentExpr",
    ARGUMENTS             : "Arguments",
    ARGUMENTSOPT          : "ArgumentsOpt",
    INITEXPR              : "InitExpr",
    INITEXPRS             : "InitExprs",
    CONSTANTEXPR          : "ConstantExpr",
    EXPR                  : "Expr",
    DWORD                 : "Dword",
    DWORDID               : "DwordId",
    ID                    : "Id",
    IDOPT                 : "IdOpt",
    TARGET                : "Target",
    UINT                  : "Uint",
    FLOAT                 : "Float",
    STRINGS               : "Strings",
    STRING                : "String",
    TYPEID                : "TypeId",
    NONTYPEID             : "NonTypeId",
    T_KW_FOR              : "for",
    T_KW_RETURN           : "return",
    T_KW_DO               : "do",
    T_KW_DISCARD          : "discard",
    T_KW_WHILE            : "while",
    T_KW_IF               : "if",
    T_KW_ELSE             : "else",

    FROMEXPR     : "FromExpr",
    MEMEXPR      : "MemExpr",
    T_KW_USE     : "use",
    T_KW_STRICT  : "strict",
    IMPORTDECL   : "ImportDecl",
    PROVIDEDECL  : "ProvideDecl",
    STATEIF      : "StateIf",
    STATESWITCH  : "StateSwitch",
    CASESTATE    : "CaseState",
    DEFAULTSTATE : "DefaultState",
    PASSSTATE    : "PassState",

    SYSTEMVAR     : "engine",
    UNDEFINEDTYPE : 7,
    GLOBAL        : 0,


    VERTEXUSAGE      : 1,
    FRAGMENTUSAGE    : 2,
    STRUCTUSAGE      : 3,
    LOCALUSAGE       : 4,
    PARAMETRUSAGE    : 5,
    VERTEXUSAGEPARAM : 6,
    GLOBALUSAGE      : 7,
    NOTUSAGE         : -1,

    ERRORBADFUNCTION : 147,
    SHADEROUT        : "Out",

    SHADERPREFIX   : "shader_main_",
    VERTEXPREFIX   : "vertex_main_",
    FRAGMENTPREFIX : "fragment_main_",

    TEXTURE : "TEXTURE",

    PREFIX : 10,

    INARRAY  : 1,
    INOBJECT : 2,

    EXTERNAL_V : 1,
    EXTERNAL_F : 2
};
A_NAMESPACE(GLOBAL_VARS, fx);

var SEMANTIC_BLACKLIST = {
    "A_b_0"  : null, "A_b_1" : null, "A_b_2" : null, "A_b_3" : null,
    "A_b_4"  : null, "A_b_5" : null, "A_b_6" : null, "A_b_7" : null,
    "A_b_8"  : null, "A_b_9" : null, "A_b_10" : null, "A_b_11" : null,
    "A_b_12" : null, "A_b_13" : null, "A_b_14" : null, "A_b_15" : null,
    "A_b_16" : null,
    "A_h_0"  : null, "A_h_1" : null, "A_h_2" : null, "A_h_3" : null,
    "A_h_4"  : null, "A_h_5" : null, "A_h_6" : null, "A_h_7" : null,
    "A_h_8"  : null, "A_h_9" : null, "A_h_10" : null, "A_h_11" : null,
    "A_h_12" : null, "A_h_13" : null, "A_h_14" : null, "A_h_15" : null,
    "A_h_16" : null
};
A_NAMESPACE(SEMANTIC_BLACKLIST, fx);
var NAME_BLACKLIST = {
    "A_b_" : null,
    "A_h_" : null
};
A_NAMESPACE(NAME_BLACKLIST, fx);
function GLSLExpr(sTemplate) {
    this.pArgs = {};
    this.pExpr = [];
    var pObj = sTemplate.split(/(\$\d+)/);
    for (var i = 0; i < pObj.length; i++) {
        if (pObj[i]) {
            if (pObj[i][0] !== '$') {
                this.pExpr.push(pObj[i]);
            }
            else {
                this.pExpr.push(null);
                this.pArgs[this.pExpr.length - 1] = pObj[i].substr(1) - 1;
            }
        }
    }
}
GLSLExpr.prototype.toGLSL = function (pArguments) {
    var i = 0, j;
    var pExpr = this.pExpr;
    var pArgs = this.pArgs;
    var pRes = [];
    for (i = 0; i < pExpr.length; i++) {
        if (pExpr[i] === null) {
            if (pArgs[i] === undefined) {
                error("Bad translate expr");
                return;
            }
            if (!pArguments[pArgs[i]]) {
                console.log(this, pArguments, pArguments[pArgs[i]], pArguments[1], pArgs[i], i);
                error("bad translation pArguments");
                return;
            }
            pRes.push("(");
            for (j = 0; j < pArguments[pArgs[i]].length; j++) {
                pRes.push(pArguments[pArgs[i]][j]);
            }
            pRes.push(")");
        }
        else {
            pRes.push(pExpr[i]);
        }
    }
    return pRes;
};

function VariableType() {
    /**
     * @type EffectType
     */
    this.pEffectType = null;
    /**
     *
     * @type {Boolean}
     * @private
     */
    this._isBase = false;
    /**
     *
     * @type {String}
     */
    this.sSemantic = null;
    /**
     * @type {Int[]}
     */
    this.pUsages = null;
    this.pUsagesName = null;
    this.isMixible = false;
    this.isVSInput = false;
    this.isFSInput = false;
    this._sCode = null;
}
VariableType.prototype.setUsage = function (sValue) {
    if (!this.pUsages) {
        this.pUsages = [];
    }
    if (!this.pUsagesName) {
        this.pUsagesName = {};
    }
    this.pUsages.push(sValue);
    if (this.pUsagesName[sValue] === null) {
        error("same usage 2 times");
        return;
    }
    this.pUsagesName[sValue] = null;
};
VariableType.prototype.setType = function (pType) {
    if (pType instanceof VariableType) {
        this.pEffectType = pType.pEffectType;
        this._isBase = pType._isBase;
        this.sSemantic = pType.sSemantic;
        this.pUsages = pType.pUsages;
    }
    else {
        this.pEffectType = pType;
        if (pType.isBase()) {
            this._isBase = true;
        }
    }
};
VariableType.prototype.toCode = function () {
    if (this._sCode) {
        return this._sCode;
    }
    var i;
    this._sCode = "";
    if (this.pUsages) {
        for (i = 0; i < this.pUsages.length; i++) {
            if (this.pUsages[i] !== "global") {
                this._sCode += this.pUsages[i] + " ";
            }
        }
    }
    this._sCode += this.pEffectType.toCodeString();
    return this._sCode;
};
VariableType.prototype.isStruct = function () {
    if (this.pEffectType && this.pEffectType.isStruct) {
        return true;
    }
    return false;
};
VariableType.prototype.isBase = function () {
    return this._isBase;
};
VariableType.prototype.isVoid = function () {
    if (this.pEffectType.sName === "void") {
        return true;
    }
    return false;
};
VariableType.prototype.checkMe = function () {
    //TODO: add valid tests for variabletype
    var i;
    for (i = 0; i < arguments.length; i++) {
        switch (arguments[i]) {
            case a.fx.GLOBAL_VARS.NOTUSAGE:
                break;
            case a.fx.GLOBAL_VARS.VERTEXUSAGE:
                if (this.isStruct() && this.pEffectType.checkMe(a.fx.GLOBAL_VARS.VERTEXUSAGE)) {
                    continue;
                }
                if (this.isBase() && this.sSemantic === "POSITION") {
                    continue;
                }
                if (this.isVoid()) {
                    continue;
                }
                return false;
            case a.fx.GLOBAL_VARS.FRAGMENTUSAGE:
                if (this.isStruct() && this.pEffectType.checkMe(a.fx.GLOBAL_VARS.FRAGMENTUSAGE)) {
                    continue;
                }
                if (this.isBase() && this.sSemantic === "COLOR") {
                    continue;
                }
                if (this.isVoid()) {
                    continue;
                }
                return false;
            case a.fx.GLOBAL_VARS.STRUCTUSAGE:
                if (this.pUsages) {
                    return false;
                }
                break;
            case a.fx.GLOBAL_VARS.VERTEXUSAGEPARAM:
                if (!this.pEffectType.checkMe(a.fx.GLOBAL_VARS.VERTEXUSAGEPARAM)) {
                    return false;
                }
                break;
            case a.fx.GLOBAL_VARS.PARAMETRUSAGE:
                break;
            case a.fx.GLOBAL_VARS.LOCALUSAGE:
                if (this.pUsagesName["uniform"] === null ||
                    this.pUsagesName["global"] === null) {
                    return false;
                }
                break;
            case a.fx.GLOBAL_VARS.GLOBALUSAGE:
                break;
            default:
                warning("Unknown usage for check");
                break;
        }
    }
    return true;
};
VariableType.prototype.isStrictEqual = function (pType) {
    if (pType instanceof VariableType) {
        return this.pEffectType.isStrictEqual(pType.pEffectType);
    }
    return this.pEffectType.isStrictEqual(pType);
};
VariableType.prototype.isEqual = function (pType) {
    if (pType instanceof VariableType) {
        return this.pEffectType.isEqual(pType.pEffectType);
    }
    return this.pEffectType.isEqual(pType);
};
VariableType.prototype.isType = function (pEffectType) {
    if (this.pEffectType === pEffectType) {
        return true;
    }
    return false;
};
VariableType.prototype.cloneMe = function () {
    var pType = new VariableType();
    pType.pEffectType = this.pEffectType;
    pType._isBase = this._isBase;
    pType.sSemantic = this.sSemantic;
    pType.pUsages = this.pUsages;
    pType.isVSInput = this.isVSInput;
    return pType;
};
VariableType.prototype.toStr = function () {
    var sRes = "";
    var i;
    for (i = 0; this.pUsages && i < this.pUsages.length; i++) {
        sRes += this.pUsages[i] + ":";
    }
    sRes += this.pEffectType.sName;
    return sRes;
};
VariableType.prototype.isSampler = function () {
    return this.pEffectType.isSampler();
};
VariableType.prototype.isConst = function () {
    if (this.pUsagesName && this.pUsagesName["const"] === null) {
        return true;
    }
    return false;
};
VariableType.prototype.setMixible = function () {
    if (!this.pEffectType || this.isMixible) {
        return;
    }
    this.isMixible = true;
    this.pEffectType.setMixible();
};
VariableType.prototype.setVSInput = function () {
    this.isVSInput = true;
    this.pEffectType.setVSInput();
};
VariableType.prototype.setFSInput = function () {
    this.isFSInput = true;
    this.pEffectType.setFSInput();
};
VariableType.prototype.hasIndexData = function () {
    if (!this.isBase()) {
        return this.pEffectType.hasIndexData();
    }
    return false;
};
VariableType.prototype.canMixible = function () {
    return this.pEffectType.canMixible();
};
VariableType.prototype.canBlend = function (pType, isStrict) {
    if (!this.canMixible() || !pType.canMixible()) {
        return 0;
    }
    if (this.isBase() !== pType.isBase()) {
        return 0;
    }
    if (this.isBase() && this.isEqual(pType)) {
        return 1;
    }
    return this.pEffectType.canBlend(pType.pEffectType, isStrict);
};

function EffectType(sName, sRealName, isBase, iSize) {
    /**
     * @type {String}
     */
    this.sName = sName || null;
    /**
     * @type {String}
     */
    this.sRealName = sRealName || null;
    /**
     * @type {EffectStruct}
     */
    this.pDesc = null;
    /**
     * @type {Boolean}
     */
    this.isStruct = false;
    /**
     * @type {Boolean}
     */
    this.isAnalyzed = isBase || false;
    /**
     * @type {Boolean}
     */
    this._isBase = isBase || false;
    /**
     * Size of type
     * @type {Int}
     */
    this.iSize = iSize || 0;
    this.isMixible = false;
    this.isVSInput = false;
    this.isFSInput = false;
    this._sCode = null;
    this._sHash = isBase ? sName : null;
    this._sStrongHash = isBase ? sName : null;
    this._canMixible = isBase ? true : false;
    this.iScope = -1;
    this.nOrder = 0;
}
EffectType.prototype.hash = function () {
    if (!this._sHash) {
        this.calcHash();
    }
    return this._sHash;
}
EffectType.prototype.strongHash = function () {
    if (!this._sStrongHash) {
        this.calcHash();
    }
    return this._sStrongHash;
}
EffectType.prototype.calcHash = function () {
    if (this._isBase) {
        this._sHash = this.sRealName;
        this._sStrongHash = this.sRealName;
        return;
    }
    var sHash = "{";
    var sStrongHash = "{";
    var i, j;
    var pField;
    var pType;
    for (i = 0; i < this.pDesc.pOrders.length; i++) {
        pField = this.pDesc.pOrders[i];
        pType = pField.pType;
        for (j = 0; pType.pUsages && j < pType.pUsages.length; j++) {
            sHash += pType.pUsages[j] + "|";
            sStrongHash += pType.pUsages[j] + "|";
        }
        sHash += pType.pEffectType.hash();
        sStrongHash += pType.pEffectType.strongHash();
        if (pField.isArray) {
            sHash += ":" + pField.iLength;
            sStrongHash += ":" + pField.iLength;
        }
        if (pField.isPointer) {
            sStrongHash += "@" + pField.nDim;
        }
        sHash += ";";
        sStrongHash += ";";
    }
    sHash += "}";
    sStrongHash += "}";
    this._sHash = sHash;
    this._sStrongHash = sStrongHash;
};
EffectType.prototype.isEqual = function (pType) {
    if (pType instanceof VariableType) {
        return this.hash() === pType.pEffectType.hash();
    }
    return this.hash() === pType.hash();
};
EffectType.prototype.isStrictEqual = function (pType) {
    if (pType instanceof VariableType) {
        return this.strongHash() === pType.pEffectType.strongHash();
    }
    return this.strongHash() === pType.strongHash();
};
EffectType.prototype.isConst = function () {
    return true;
};
EffectType.prototype.isSampler = function () {
    if (this.sName === "sampler" || this.sName === "sampler1D" || this.sName === "sampler2D" ||
        this.sName === "sampler3D" || this.sName === "samplercube") {
        return true;
    }
    return false;
};
EffectType.prototype.fromStruct = function (pStruct) {
    this.sName = pStruct.sName;
    this.pDesc = pStruct;
    this.isStruct = true;
    this._canMixible = pStruct.canMixible();
    pStruct.setPadding();
    this.iSize = pStruct.iSize;
};
EffectType.prototype.toStr = function () {
    return this.sName;
};
EffectType.prototype.isBase = function () {
    return this._isBase;
};
EffectType.prototype.toCode = function () {
    if (this._sCode) {
        return this._sCode;
    }
    if (this._isBase) {
        this._sCode = this.sRealName;
    }
    else {
        this._sCode = "struct " + this.sRealName;
        this._sCode += this.pDesc.toCode();
    }
    return this._sCode;
};
EffectType.prototype.toCodeString = function () {
    if (this.sRealName) {
        return this.sRealName;
    }
    else {
        error("I should not be here. Something bad have happened.");
        return;
    }
};
EffectType.prototype.hasSemantic = function (sSemantic) {
    return this.pDesc.hasSemantic(sSemantic) || false;
};
EffectType.prototype.hasEmptySemantic = function () {
    return this.pDesc.hasEmptySemantic();
};
EffectType.prototype.hasMultipleSemantic = function () {
    return this.pDesc.hasMultipleSemantic();
}
EffectType.prototype.hasComplexType = function () {
    return this.pDesc.hasComplexType();
};
EffectType.prototype.checkMe = function () {
    if (this._isBase) {
        return true;
    }
    var i, j;
    if (!this.isAnalyzed) {
        this.pDesc.analyzeSemantics();
        this.isAnalyzed = true;
    }
    for (i = 0; i < arguments.length; i++) {
        switch (arguments[i]) {
            case a.fx.GLOBAL_VARS.VERTEXUSAGE:
                if (this.hasEmptySemantic() || this.hasMultipleSemantic() || //!this.hasSemantic("POSITION") ||
                    this.hasComplexType()) {
                    return false;
                }
                break;
            case a.fx.GLOBAL_VARS.FRAGMENTUSAGE:
                if (this.pDesc.pOrders.length !== 1 || !this.hasSemantic("COLOR")) {
                    return false;
                }
                break;
            case a.fx.GLOBAL_VARS.VERTEXUSAGEPARAM:
                if (this.hasEmptySemantic() || this.hasMultipleSemantic()) {
                    return false;
                }
                if (this.hasComplexType()) {
                    for (j = 0; j < this.pDesc.pOrders.length; j++) {
                        if (!this.pDesc.pOrders[j].pType.checkMe(a.fx.GLOBAL_VARS.VERTEXUSAGEPARAM)) {
                            return false;
                        }
                    }
                }
                break;
            default:
                warning("Unknown usage for check");
                break;
        }
    }
    return true;
};
EffectType.prototype.setMixible = function () {
    if (!this.pDesc || this.isMixible) {
        return;
    }
    this.isMixible = true;
    this.pDesc.setMixible();
};
EffectType.prototype.setVSInput = function () {
    this.isVSInput = true;
};
EffectType.prototype.setFSInput = function () {
    this.isFSInput = true;
};
EffectType.prototype.hasIndexData = function () {
    if (this.pDesc) {
        return this.pDesc.hasIndexData();
    }
    return false;
};
EffectType.prototype.globalUsedTypes = function () {
    if (this._isBase) {
        return null;
    }
    return this.pDesc.globalUsedTypes();
};
EffectType.prototype.canMixible = function () {
    return this._canMixible;
};
EffectType.prototype.canBlend = function (pType, isStrict) {
    return this.pDesc.canBlend(pType.pDesc, isStrict);
};

function EffectStruct() {
    /**
     *
     * @type {EffectVariable[]}
     */
    this.pOrders = null;
    /**
     * Pars VariableName -> EffectVariable
     * @type {Object}
     */
    this.pFields = null;
    /**
     *
     * @type {String}
     */
    this.sName = null;
    /**
     * Pairs Semantic -> EffectVariable
     * @type {Object}
     * @private
     */
    this._pSemantics = null;
    /**
     *
     * @type {Boolean}
     * @private
     */
    this._hasMultipleSemantic = false;
    /**
     *
     * @type {Boolean}
     * @private
     */
    this._hasEmptySemantic = false;
    /**
     *
     * @type {Boolean}
     * @private
     */
    this._hasComplexType = false;
    /**
     *
     * @type {Boolean}
     */
    this.isAnalyzed = false;
    /**
     * Are this struct mixible or not
     * @type {Boolean}
     */
    this.isMixible = false;
    this._canMixible = false;
    this._hasIndexData = null;
    this._sCode = null;
    this.pGlobalUsedTypes = null;
    this.iSize = 0;
    this._pPointers = null;
}
EffectStruct.prototype.toCode = function () {
    if (this._sCode) {
        return this._sCode;
    }
    this._sCode = "{";
    var i;
    for (i = 0; i < this.pOrders.length; i++) {
        this._sCode += this.pOrders[i].pType.toCode() + " " + this.pOrders[i].toCode() + ";";
    }
    this._sCode += "}";
    return this._sCode;
};
EffectStruct.prototype.checkMe = function () {
    return true;
};
EffectStruct.prototype.hasField = function (sName) {
    return this.pFields[sName] || false;
};
EffectStruct.prototype.analyzeSemantics = function () {
    if (this.isAnalyzed) {
        return;
    }
    var i;
    var pSemantics = {};
    var pOrders = this.pOrders;
    for (i = 0; i < pOrders.length; i++) {
        if (!pOrders[i].sSemantic) {
            this._hasEmptySemantic = true;
        }
        if (!pOrders[i].pType.isBase()) {
            this._hasComplexType = true;
        }
        if (pSemantics[pOrders[i].sSemantic]) {
            this._hasMultipleSemantic = true;
        }
        pSemantics[pOrders[i].sSemantic] = pOrders[i];
    }
    this._pSemantics = pSemantics;
    this.isAnalyzed = true;
};
EffectStruct.prototype.hasSemantic = function (sSemantic) {
    if (this._pSemantics) {
        return this._pSemantics[sSemantic];
    }
    var pOrders = this.pOrders;
    var i;
    for (i = 0; i < pOrders.length; i++) {
        if (pOrders[i].sSemantic === sSemantic) {
            return pOrders[i];
        }
    }
    return false;
};
EffectStruct.prototype.hasEmptySemantic = function () {
    if (this._pSemantics) {
        return this._hasEmptySemantic;
    }
    var pOrders = this.pOrders;
    var i;
    for (i = 0; i < pOrders.length; i++) {
        if (!pOrders[i].sSemantic) {
            this._hasEmptySemantic = true;
            return true;
        }
    }
    this._hasEmptySemantic = false;
    return false;
};
EffectStruct.prototype.hasMultipleSemantic = function () {
    if (this._pSemantics) {
        return this._hasMultipleSemantic;
    }
    var i, j;
    var pOrders = this.pOrders;
    for (i = 0; i < pOrders.length; i++) {
        for (j = i + 1; j < pOrders.length; j++) {
            if (pOrders[j].sSemantic = pOrders[i].sSemantic) {
                this._hasMultipleSemantic = true;
                return true;
            }
        }
    }
    this._hasMultipleSemantic = false;
    return false;
};
EffectStruct.prototype.hasComplexType = function () {
    if (this._pSemantics) {
        return this._hasComplexType;
    }
    var pOrders = this.pOrders;
    var i;
    for (i = 0; i < pOrders.length; i++) {
        if (!pOrders[i].pType.isBase()) {
            this._hasComplexType = true;
            return true;
        }
    }
    this._hasComplexType = false;
    return false;
};
EffectStruct.prototype.setMixible = function () {
    if (this.isMixible) {
        return;
    }
//    if (!this.isAnalyzed) {
//        this.analyzeSemantics();
//    }
//    if (this.hasEmptySemantic() || this.hasMultipleSemantic()) {
//        error("you are bad man(woman).");
//        return;
//    }
    var pOrders = this.pOrders;
    var i;
    for (i = 0; i < pOrders.length; i++) {
        pOrders[i].setMixible();
    }
    this.isMixible = true;
};
EffectStruct.prototype.hasIndexData = function () {
    if (this._hasIndexData !== null) {
        return this._hasIndexData;
    }
    var pOrders = this.pOrders;
    var i;
    for (i = 0; i < pOrders.length; i++) {
        if (pOrders[i].isPointer) {
            this._hasIndexData = true;
            return true;
        }
        if ((!pOrders[i].pType.isBase()) && pOrders[i].pType.pEffectType.pDesc.hasIndexData()) {
            this._hasIndexData = true;
            return true;
        }
    }
    this._hasIndexData = false;
    return this._hasIndexData;
};
EffectStruct.prototype.globalUsedTypes = function () {
    if (this.pGlobalUsedTypes) {
        return this.pGlobalUsedTypes;
    }
    var pTypes = {};
    var pType;
    var i, j;
    var isOk = false;
    var pTypes1;
    for (i = 0; i < this.pOrders.length; i++) {
        pType = this.pOrders[i].pType.pEffectType;
        if (pType.iScope === a.fx.GLOBAL_VARS.GLOBAL) {
            pTypes[pType.sName] = pType;
            isOk = true;
            pTypes1 = pType.pDesc.globalUsedTypes();
            for (j in pTypes1) {
                pTypes[pTypes1[j].sName] = pTypes1[j];
            }
        }
    }
    if (isOk) {
        this.pGlobalUsedTypes = pTypes;
    }
    return this.pGlobalUsedTypes;
};
EffectStruct.prototype.canMixible = function () {
    return this._canMixible;
};
EffectStruct.prototype.canBlend = function (pStruct, isStrict) {
    this.analyzeSemantics();
    pStruct.analyzeSemantics();
    var pSemantics1 = this._pSemantics;
    var pSemantics2 = pStruct._pSemantics;
    var i;
    var pVar1, pVar2;
    var iStatus = 1, iBlend;
    for (i in pSemantics1) {
        pVar1 = pSemantics1[i];
        pVar2 = pSemantics2[i];
        if (pVar2) {
            iBlend = pVar1.canBlend(pVar2, isStrict);
            if (iBlend === 0) {
                return 0;
            }
            if (iBlend === 2) {
                iStatus = iBlend;
                continue;
            }
            if (isStrict && pVar2.iPadding !== pVar1.iPadding) {
                iStatus = 2;
            }
        }
        else {
            iStatus = 2;
        }
    }
    if (this.pOrders.length !== pStruct.pOrders.length) {
        iStatus = 2;
    }
    return iStatus;
};
EffectStruct.prototype.setPadding = function () {
    var i;
    var iPadding = 0;
    var pVar;
    for (i = 0; i < this.pOrders.length; i++) {
        pVar = this.pOrders[i];
        pVar.iPadding = iPadding;
        iPadding += pVar.iSize;
    }
    this.iSize = iPadding;
};
EffectStruct.prototype.getPointers = function () {
    if (!this.hasIndexData()) {
        return null;
    }
    if (this._pPointers) {
        return this._pPointers;
    }
    var i;
    var pPointers = [];
    var pOrders = this.pOrders;
    for (i = 0; i < pOrders.length; i++) {
        if (pOrders[i].isPointer) {
            pPointers.push(pOrders[i].pPointers[pOrders[i].pPointers.length - 1]);
        }
        if (!pOrders[i].pType.isBase() && pOrders[i].pType.pEffectType.pDesc.hasIndexData()) {
            pPointers = pPointers.concat(pOrders[i].pType.pEffectType);
        }
    }
};

function EffectPointer(pVar, nDim, pFirst, sPrev, isAttr) {
    this.pVar = pVar || null;
    this.sRealName = null;
    this.nDim = nDim || 0;
    this.isAttr = isAttr;
    this.sPrevReal = sPrev;
    this.pFirst = pFirst;
}
EffectPointer.prototype.toCode = function () {
    var i;
    if (this.sRealName) {
        return this.sRealName;
    }
    if (!this.pFirst || (this.isAttr && this.pFirst.isVSInput)) {
        this.sRealName = "";
    }
    else {
        this.sRealName = (this.pFirst.sRealName + "_");
    }
    this.sRealName += (this.sPrevReal !== "") ? (this.sPrevReal + "_") : "";
    this.sRealName += this.pVar.toCode(a.fx.GLOBAL_VARS.PREFIX);
    for (i = 0; i <= this.nDim; i++) {
        this.sRealName += "_index";
    }
    return this.sRealName;
};

function EffectBuffer(pVar) {
    STATIC(fnToCode, function () {
        return this.pData;
    });
    this.pRealBuffer = null;
    /**
     * Pointer for real code
     * @type {Object}
     */
    this.pSampler = {pData : null, toDataCode : EffectBuffer.fnToCode};
    /**
     * Pointer for real code
     * @type {Object}
     */
    this.pHeader = {pData : null, toDataCode : EffectBuffer.fnToCode};
    this.isUniform = false;
    this.id = EffectBuffer.nCount++;
    this.pVar = pVar || null;
}
EffectBuffer.nCount = 0;

function EffectVariable() {
    /**
     *
     * @type {VariableType}
     */
    this.pType = null;
    /**
     *
     * @type {String}
     */
    this.sName = null;
    /**
     *
     * @type {String}
     */
    this.sRealName = null;
    this.sFullName = null;
    /**
     *
     * @type {String}
     */
    this.sSemantic = null;
    /**
     * Pairs: VariableName -> Value
     * @type {Objects}
     */
    this.pAnnotation = null;
    /**
     * Code of init expr
     * @type {Array}
     */
    this.pInitializer = null;
    /**
     * For uniforms
     * @type {Object}
     */
    this.pDefaultValue = null;
    /**
     *
     * @type {Boolean}
     */
    this.isArray = false;
    /**
     *
     * @type {Int}
     */
    this.iLength = 1;
    /**
     *
     * @type {Boolean}
     */
    this.isPointer = false;
    /**
     * Dimensional of pointer
     * @type {Int}
     */
    this.nDim = 0;
    /**
     * What buffer is used
     * @type {Object}
     */
    this.pBuffer = null;
    /**
     * @type {EffectVariable[]}
     */
    this.pPointers = null;
    /**
     * Id of scope where variable has definition
     * @type {Int}
     */
    this.iScope = 0;
    this._isConstInit = null;
    this.pTexture = null;
    this.pStates = null;
    this._isSampler = false;
    this._pSamplerData = null;
    this.isParametr = false;
    this.isUniform = false;
    this.isGlobal = false;
    this.isMixible = false;
    this.isVSInput = false;
    this.isFSInput = false;
    this.isVertexOnly = false;
    this.isFragmentOnly = false;
    this.iPadding = -1;
    this.iSize = 0;
    this.isUsed = false;
    /**
     * If type of variable is complex, this var contains all pointers of data fields.
     * @type {EffectPointer[]}
     * @private
     */
    this._pAllPointers = null;
    this._pIndexFields = null;
}
EffectVariable.prototype.isInput = function () {
    if (this.pType.pUsagesName &&
        (this.pType.pUsagesName["in"] === null || this.pType.pUsagesName["inout"] === null)) {
        return true;
    }
    return false;
};
EffectVariable.prototype.isOutput = function () {
    if (this.pType.pUsagesName &&
        (this.pType.pUsagesName["out"] === null || this.pType.pUsagesName["inout"] === null)) {
        return true;
    }
    return false;
};
EffectVariable.prototype.isConst = function () {
    return this.pType.isConst();
};
EffectVariable.prototype.isConstInit = function () {
    if (!this.pInitializer) {
        this._isConstInit = null;
        return null;
    }
    if (this._isConstInit !== null) {
        return this._isConstInit;
    }
    var i;
    for (i = 0; i < this.pInitializer.length; i++) {
        if (typeof(this.pInitializer[i]) === "object" && !this.pInitializer[i].isConst()) {
            this._isConstInit = false;
            return false;
        }
    }
    this._isConstInit = true;
    return true;
};
EffectVariable.prototype.setType = function (pType) {
    this.pType = pType;
    if (pType.pUsagesName) {
        this.isUniform = (pType.pUsagesName["uniform"] === null) ? true : false;
        this.isGlobal = (pType.pUsagesName["global"] === null) ? true : false;
        this.isUniform = this.isUniform || this.isSampler();
    }
    if (this.isPointer) {
        this.iSize = 1;
    }
    else {
        this.iSize = this.pType.pEffectType.iSize * this.iLength;
    }
};
EffectVariable.prototype.addAnnotation = function (pAnnotation) {
    this.pAnnotation = pAnnotation;
};
EffectVariable.prototype.addSemantic = function (sSemantic) {
    this.sSemantic = sSemantic;
};
EffectVariable.prototype.addInitializer = function (pInit) {
    this.pInitializer = pInit;
};
EffectVariable.prototype.toCode = function () {
    return this.sRealName;
};
EffectVariable.prototype.checkMe = function () {
    //TODO: many and many tests for varaibles
    return true;
};
EffectVariable.prototype.cloneMe = function () {
    var pVar = new EffectVariable();
    pVar.pType = this.pType.cloneMe();
    pVar.sName = this.sName;
    pVar.sRealName = this.sRealName;
    pVar.sSemantic = this.sSemantic;
    pVar.isArray = this.isArray;
    pVar.iLength = this.iLength;
    pVar.isPointer = this.isPointer;
    pVar.pPointers = this.pPointers;
    pVar.pBuffer = this.pBuffer;
    pVar.nDim = this.nDim;
    pVar.iSize = this.iSize;
    pVar.iPadding = this.iPadding;
    pVar._pAllPointers = this._pAllPointers;
    pVar._pIndexFields = this._pIndexFields;
    pVar.sFullName = this.pFullName;
    return pVar;
};
EffectVariable.prototype.setTexture = function (pTex) {
    this.pTexture = pTex;
    this._isSampler = true;
    if (!this.pStates) {
        this.pStates = {};
    }
    this.pStates[a.fx.GLOBAL_VARS.TEXTURE] = pTex.sRealName;
};
EffectVariable.prototype.setState = function (eState, eValue) {
    if (!this.pStates) {
        this.pStates = {};
        this._isSampler = true;
    }
    if (this.pStates[eState]) {
        error("Bad 197");
        return;
    }
    this.pStates[eState] = eValue;
};
EffectVariable.prototype.setMixible = function () {
    if (this.isUniform || this.isMixible) {
        return;
    }
    if (!this.pType.canMixible()) {
        error("For mixible variables semantics are necessary");
        return;
    }
    this.isMixible = true;
    this.sRealName = this.sSemantic || this.sName;
    this.pType.setMixible();
};
EffectVariable.prototype.setVSInput = function () {
    this.isVSInput = true;
    this.pType.setVSInput();
};
EffectVariable.prototype.setFSInput = function () {
    this.isFSInput = true;
    this.pType.setFSInput();
};
EffectVariable.prototype.toCodeDecl = function (isInit) {
    var sCode;
    sCode = this.pType.toCode() + " " + this.sRealName;
    if (isInit && this.pInitializer) {
        sCode += "=";
        var i;
        sCode += this.pType.pEffectType.toCode() + "(";
        for (i = 0; i < this.pInitializer.length; i++) {
            if (typeof(this.pInitializer[i]) !== "string") {
                error("May be yo use in init expr of varibale some bad constructions");
                return;
            }
            sCode += this.pInitializer[i];
            if (i < this.pInitializer.length - 1) {
                sCode += ",";
            }
        }
        sCode += ")"
    }
    sCode += ";";
    return sCode;
};
EffectVariable.prototype.toOffsetStr = function () {
    return a.fx.SHADER_PREFIX.OFFSET + this.sRealName;
};
EffectVariable.prototype.toDataCode = function () {
    if (!this.isSampler) {
        warning("Only for samplers");
    }
    return this._pSamplerData;
};
EffectVariable.prototype.isSampler = function () {
    return this._isSampler;
};
EffectVariable.prototype.isBuffer = function () {
    return (this.pBuffer && this.iScope === a.fx.GLOBAL_VARS.GLOBAL);
};
EffectVariable.prototype.canBlend = function (pVar, isStrict) {
    if ((isStrict && (pVar.isPointer !== this.isPointer || pVar.nDim !== this.nDim)) ||
        pVar.iLength !== this.iLength || pVar.isArray !== this.isArray) {
        return 0;
    }
    return this.pType.canBlend(pVar.pType, isStrict);
};

function EffectVariableBase(pVar, pFirst, sRealPrevName, iScope, sFullName, iPadding) {
    this.pVar = pVar;
    this.pFirst = pFirst;
    this.sRealPrevName = sRealPrevName;

    this.iScope = iScope;
    this.iPadding = pVar.iPadding + iPadding;

    this.isPointer = false;
    this.pPointers = null;
    /**
     * If type of variable is complex, this var contains all pointers of data fields.
     * @type {EffectPointer[]}
     * @private
     */
    this._pAllPointers = null;
    this.pBuffer = null;

    this.pType = pVar.pType;
    this.isArray = pVar.isArray;
    this.iSize = pVar.iSize;
    this.iLength = pVar.iLength;

    this.sName = pVar.sRealName;
    this.sFullName = sFullName;
    this.sRealNameShader = null;
    this.sRealName = null;
    this.isUsed = false;
    this._pIndexFields = null;
}
EffectVariableBase.prototype.toCode = function (isShader) {
    if (isShader === a.fx.GLOBAL_VARS.PREFIX) {
        return this.sName;
    }
    var sName;
    if (isShader && this.sRealNameShader) {
        return this.sRealNameShader;
    }
    if (!isShader && this.sRealName) {
        return this.sRealName;
    }
    sName = "";
    if (!(isShader && this.pFirst.isVSInput)) {
        sName = this.pFirst.toCode() + ".";
    }
    sName += (this.sRealPrevName ? (this.sRealPrevName + ".") : "");
    sName += this.sName;
    if (isShader) {
        this.sRealNameShader = sName;
    }
    else {
        this.sRealName = sName;
    }
    return sName;
};
EffectVariableBase.prototype.cloneMe = function () {
    var pVar = this.pVar.cloneMe();
    pVar.sName = this.pVar.sName;
    pVar.sFullName = this.sFullName;
    pVar.sRealName = this.pVar.sRealName;
    pVar.sSemantic = this.pVar.sSemantic;
    pVar.isArray = this.isArray;
    pVar.iLength = this.iLength;
    pVar.isPointer = this.isPointer;
    pVar.pPointers = this.pPointers;
    pVar.pBuffer = this.pBuffer;
    pVar.nDim = this.pVar.nDim;
    pVar.iSize = this.iSize;
    pVar.iPadding = this.iPadding;
    pVar._pAllPointers = this._pAllPointers;
    pVar._pIndexFields = this._pIndexFields;
    return pVar;
};

function EffectBaseFunction() {
    var pFunction;
    if (arguments.length === 1) {
        pFunction = arguments[0];
    }
    /**
     *
     * @type {String}
     */
    this.sName = null;
    this.sRealName = null;
    this.pFunction = pFunction || null;
    this.sSemantic = pFunction ? pFunction.sSemantic : null;
    this.pReturnType = pFunction ? pFunction.pReturnType : null;
    this.pMainInputVar = pFunction ? pFunction.pMainInputVar : null;
    this.pGlobalUsedTypes = (pFunction && pFunction.pImplement) ? pFunction.pGlobalUsedTypes : {};
    this._isGlobalTypesAnalyzed = (pFunction && pFunction.pImplement) ? pFunction._isGlobalTypesAnalyzed : false;
    this.pGlobalVariables = (pFunction && pFunction.pImplement) ? pFunction.pGlobalVariables : null;
    this.pUniforms = (pFunction && pFunction.pImplement) ? pFunction.pUniforms : null;
    this.pExternals = (pFunction && pFunction.pImplement) ? pFunction.pExternals : null;
    /**
     * Code of function
     * @type {Object[]}
     */
    this.pImplement = null;
    this.iScope = 0;
    this.pScopeStack = null;
    /**
     * Global variables used in function
     * Pairs: FunctionHash -> EffectFunction
     * @type {Object}
     */
    this.pFunctions = null;
    this._pBaseMemBlocks = {};
    this.pMemBlocks = {};
    this._pExtractFunctions = null;
    this._sDefinition = null;
    this._pCodeAll = null;
    this._sCodeAll = null;
    this._pLocalPointers = {};
}
EffectBaseFunction.prototype.addGlobalVariable = function (pVar) {
    if (pVar.isGlobal) {
        return false;
    }
    if (!this.pGlobalVariables) {
        this.pGlobalVariables = {};
    }
    if (this.pUniforms && this.pUniforms[pVar.sName]) {
        delete this.pUniforms[pVar.sName];
    }
    if (this.pGlobalVariables[pVar.sName]) {
        return false;
    }
    this.pGlobalVariables[pVar.sName] = pVar;
    return true;
};
EffectBaseFunction.prototype.addUniform = function (pVar) {
    if (pVar.isGlobal) {
        return false;
    }
    if (!this.pUniforms) {
        this.pUniforms = {};
    }
    if (this.pGlobalVariables && this.pGlobalVariables[pVar.sName]) {
        return;
    }
    if (this.pUniforms[pVar.sName]) {
        return false;
    }
    this.pUniforms[pVar.sName] = pVar;
    return true;
};
EffectBaseFunction.prototype.addFunction = function (pFunc) {
    if (pFunc === this) {
        error("Recursion don`t support");
        return;
    }
    if (!this.pFunctions) {
        this.pFunctions = {};
    }
    this.pFunctions[pFunc.sHash] = pFunc;
};
EffectBaseFunction.prototype.addType = function (pType) {
    if (!pType) {
        return false;
    }
    var isNewType = false;
    var pTypes;
    if (pType instanceof EffectType) {
        if (this.pGlobalUsedTypes[pType.sName]) {
            return false;
        }
        this.pGlobalUsedTypes[pType.sName] = pType;
        isNewType = true;
        pTypes = pType.globalUsedTypes();
        for (var i in pTypes) {
            if (!this.pGlobalUsedTypes[pTypes[i].sName]) {
                this.pGlobalUsedTypes[pTypes[i].sName] = pTypes[i];
                isNewType = true;
            }
        }
        return isNewType;
    }

    for (var i in pType) {
        if (this.addType(pType[i])) {
            isNewType = true;
        }
    }
    return isNewType;
};
EffectBaseFunction.prototype.addExternal = function (pVar) {
    if (!this.pExternals) {
        this.pExternals = {};
    }
    if (!this.pExternals[pVar.sName]) {
        this.pExternals[pVar.sName] = pVar;
        return true;
    }
    return false;
};
EffectBaseFunction.prototype.globalUsedTypes = function () {
    if (this._isGlobalTypesAnalyzed) {
        return this.pGlobalUsedTypes;
    }
    var isNewType = false;
    var pTypes;
    var i, j;
    while (isNewType) {
        isNewType = false;
        for (i = 0; i < this.pScopeStack.length; i++) {
            pTypes = this._ppScopes[this.pScopeStack[i]].pTypeTable;
            for (j in pTypes) {
                if (this.addType(pTypes[j].globalUsedTypes())) {
                    isNewType = true;
                }
            }
        }
    }
    return this.pGlobalUsedTypes;
};
EffectBaseFunction.prototype.hasImplementation = function () {
    return this.pImplement ? true : false;
};
EffectBaseFunction.prototype.setName = function (sName) {
    this.sName = sName;
};
EffectBaseFunction.prototype.addSemantic = function (sSemantic) {
    this.sSemantic = sSemantic;
    this.pReturnType.sSemantic = sSemantic;
};
EffectBaseFunction.prototype.setImplement = function (pImplement) {
    this.pImplement = pImplement;
};
EffectBaseFunction.prototype.memBlock = function (pVar, iPointer) {
    var sName = pVar.sName + "?";
    sName += pVar.iScope + "@";
    var pBase;
    var pBlock;
    if (!this._pBaseMemBlocks[sName]) {
        this._pBaseMemBlocks[sName] = new MemBlock(pVar);
    }
    pBase = this._pBaseMemBlocks[sName];
    if (iPointer === undefined) {
        pBlock = pBase;
    }
    else {
        sName += iPointer !== undefined ? iPointer : ""
        if (!this.pMemBlocks[sName]) {
            this.pMemBlocks[sName] = new MemBlock(pBase, iPointer);
            pBlock = this.pMemBlocks[sName];
        }
    }
    return pBlock;
};
EffectBaseFunction.prototype.generateDefinitionCode = function () {
    this._sDefinition = this.pReturnType.toCode() + " " + this.sRealName + "()";
};
EffectBaseFunction.prototype.toCode = function (isAllCode) {
    if (!isAllCode) {
        if (!this.sRealName) {
            error("Cannot be traslated");
            return;
        }
        return this.sRealName;
    }
    else {
        return this.toCodeAll();
    }
};
EffectBaseFunction.prototype.toCodeAll = function () {
    return "";
};
EffectBaseFunction.prototype.generateExtractedCode = function () {
    return "";
};
EffectBaseFunction.prototype.addGlobalBuffer = function (pBuf) {
    if (!pBuf.isUniform) {
        trace(pBuf);
        error("something going wrong with add global buffer");
        return;
    }
    this.addUniform(pBuf.pVar);
    if (!this.pGlobalBuffers) {
        this.pGlobalBuffers = {}
    }
    if (!this.pGlobalBuffers[pBuf.pVar.sRealName]) {
        this.pGlobalBuffers[pBuf.pVar.sRealName] = pBuf;
        return true;
    }
    return false;
};
EffectBaseFunction.prototype.addPointers = function (pVar) {
    if (pVar.iScope !== this.iScope && pVar.iScope !== a.fx.GLOBAL_VARS.GLOBAL) {
        var i;
        for (i = 0; i < pVar._pAllPointers.length; i++) {
            this._pLocalPointers[pVar._pAllPointers[i].toCode()] = pVar._pAllPointers[i];
        }
    }
};

function EffectFunction(sName, pGLSLExpr, pTypes) {
    A_CLASS;
    this.sName = sName || null;
    /**
     * For builtin fucntions
     * @type {GLSLExpr}
     */
    this.pGLSLExpr = pGLSLExpr || null;
    /**
     * Pairs: ParamName -> EffectVariable
     * @type {Object}
     */
    this.pParameters = null;
    /**
     * Minimum number of parameters
     * @type {Int}
     */
    this.nParamsNeeded = 0;
    /**
     * @type {EffectVariable[]}
     */
    this.pParamOrders = null;
    /**
     * Hash code for function(for fast search)
     * @type {String}
     */
    this.sHash = null;
    //restrictions for function
    /**
     * may use like constant expression
     * @type {Boolean}
     */
    this.isConstant = true;
    /**
     * may use only in fragment shader
     * @type {Boolean}
     */
    this.isFragmentOnly = false;
    /**
     * may use only in vertex shader
     * @type {Boolean}
     */
    this.isVertexOnly = false;
    /**
     * may use only if in program there are buffer
     * @type {Boolean}
     */
    this.isBufferNeed = false;
    /**
     * may be used like fragment shader(there is in pass decl)
     * @type {Boolean}
     */
    this.isFragmentShader = false;
    /**
     * may use like vertex shader(there is in pass decl)
     * @type {Boolean}
     */
    this.isVertexShader = false;
    /**
     *
     * @type {EffectVertex}
     */
    this.pShader = null;
    /**
     * Pairs: Name of variable -> fields of struct
     * @type {Object}
     */
    this.pStructTable = null;
    /**
     * System function or not
     * @type {Boolean}
     */
    this.isSystem = pGLSLExpr ? true : false;
    /**
     * Types of parameters
     * @type {EffectType[]}
     */
    this.pTypes = pTypes || null;
}
EXTENDS(EffectFunction, EffectBaseFunction);
EffectFunction.prototype.isConst = function () {
    return this.isConstant;
};
EffectFunction.prototype.calcHash = function () {
    var sHash = "";
    sHash += this.sName;
    var i;
    if (!this.pTypes) {
        for (i = 0; this.pParamOrders ? i < this.pParamOrders.length : false; i++) {
            sHash += "!" + this.pParamOrders[i].pType.toStr();
        }
    }
    else {
        for (i = 0; i < this.pTypes.length; i++) {
            sHash += "!" + this.pTypes[i].sName;
        }
    }
    sHash += "-->" + this.pReturnType.toStr();
    return sHash;
};
EffectFunction.prototype.hash = function () {
    if (!this.sHash) {
        this.sHash = this.calcHash();
    }
    return this.sHash;
};
EffectFunction.prototype.addParameter = function (pVar) {
    if (!this.pParameters) {
        this.pParameters = {};
    }
    if (!this.pParamOrders) {
        this.pParamOrders = [];
    }
    if (this.pParameters[pVar.sName]) {
        error("So so bad. try to this parametr");
        return;
    }
    this.pParamOrders.push(pVar);
    this.pParameters[pVar.sName] = pVar;
    pVar.isParametr = true;
    if (pVar.isUniform) {
        pVar.isUniform = true;
        this.addUniform(pVar);
    }
    if (!pVar.pInitializer) {
        this.nParamsNeeded = this.pParamOrders.length;
    }
};
EffectFunction.prototype.checkMe = function () {
    var i, j, k;
    var pType;
    var pVar;
    var pSemantics;
    var isOne = false;
    for (i = 0; i < arguments.length; i++) {
        switch (arguments[i]) {
            case a.fx.GLOBAL_VARS.VERTEXUSAGE:
                if (!this.pReturnType.checkMe(a.fx.GLOBAL_VARS.VERTEXUSAGE)) {
                    return false;
                }
                pSemantics = {};
                for (j = 0; j < this.pParamOrders.length; j++) {
                    pVar = this.pParamOrders[j];
                    pType = pVar.pType;
                    if (pType.pUsagesName && pType.pUsagesName["uniform"] === null) {
                        continue;
                    }
                    if (isOne === true) {
                        return false;
                    }
                    if (isOne === undefined) {
                        if (pVar.sSemantic === null) {
                            isOne = true;
                        }
                        else {
                            isOne = false;
                        }
                    }
                    if (pType.isBase()) {
                        isOne = false;
                        if (pVar.sSemantic === null) {
                            return false;
                        }
                        if (pSemantics[pVar.sSemantic] === null) {
                            return false;
                        }
                        pSemantics[pVar.sSemantic] = null;
                        continue;
                    }
                    if (!pType.checkMe(a.fx.GLOBAL_VARS.VERTEXUSAGEPARAM)) {
                        return false;
                    }
                    for (k = 0; k < pType.pEffectType.pDesc.pOrders.length; k++) {
                        pVar = pType.pEffectType.pDesc.pOrders[k];
                        if (pSemantics[pVar.sSemantic] === null) {
                            return false;
                        }
                        pSemantics[pVar.sSemantic] = null;
                    }
                }
                break;
            case a.fx.GLOBAL_VARS.FRAGMENTUSAGE:
                if (this.pReturnType.checkMe(a.fx.GLOBAL_VARS.FRAGMENTUSAGE)) {
                    return true;
                }
                break;
            default:
                warning("Unknown usage for check");
                return true;
        }
    }
    return true;
};
EffectFunction.prototype.generateDefinitionCode = function () {
    this._sDefinition = this.pReturnType.toCode() + " " + this.sRealName + "(";
    var i, j;
    var pType;
    for (i = 0; this.pParamOrders && i < this.pParamOrders.length; i++) {
        pType = this.pParamOrders[i].pType;
        if (!(pType.pUsagesName && pType.pUsagesName["uniform"] === null)) {
            this._sDefinition += pType.toCode();
            if (i !== this.pParamOrders.length - 1) {
                this._sDefinition += ","
            }
        }
    }
    this._sDefinition += ")";
};
EffectFunction.prototype.generateExtractedCode = function () {
    var i, j;
    var sCode;
    var pCode = null;
    sCode = this.pReturnType.toCode() + " " + this.sRealName + "(";
    var pType, pVar;
    for (i = 0; i < this.pParamOrders.length; i++) {
        pVar = this.pParamOrders[i];
        pType = pVar.pType;
        if (!(pType.pUsagesName && pType.pUsagesName["uniform"] === null)) {
            sCode += pType.toCode() + " " + pVar.toCode();
            if (i !== this.pParamOrders.length - 1) {
                sCode += ","
            }
        }
    }
    sCode += "){";
    for (i in this._pLocalPointers) {
        if (this._pLocalPointers[i].pVar.isUsed) {
            sCode += "float " + i + "=0.0;"
        }
    }
    function fnExtractCode(pElement) {
        var pToCode;
        if (typeof(pElement) === "string") {
            sCode += pElement;
        }
        else if (pElement.pData === undefined) {
            pToCode = pElement.toCode(false);
            if (typeof(pToCode) === "string") {
                if (!pCode) {
                    pCode = [];
                }
                if (sCode !== "") {
                    pCode.push(sCode);
                }
                pCode.push(pElement);
                sCode = "";
            }
            else {
                for (j = 0; j < pToCode.length; j++) {
                    fnExtractCode(pToCode[j]);
                }
            }
        }
        else {
            if (!pCode) {
                pCode = [];
            }
            if (sCode !== "") {
                pCode.push(sCode);
            }
            pCode.push(pElement);
            sCode = "";
        }
    }

    for (i = 0; i < this.pImplement.length; i++) {
        fnExtractCode(this.pImplement[i]);
    }
    sCode += "}";
    if (pCode) {
        pCode.push(sCode);
        this._pCodeAll = pCode;
        return;
    }
    else {
        this._sCodeAll = sCode;
        return;
    }
};
EffectFunction.prototype.toCodeAll = function () {
    if (!this._pCodeAll && !this._sCodeAll) {
        this.generateExtractedCode();
    }
    if (this._sCodeAll) {
        return this._sCodeAll;
    }

    var i, j;
    var sCode = "";
    var pCode = null;
    var pElement;
    var pToCode;

    for (i = 0; i < this._pCodeAll.length; i++) {
        pElement = this._pCodeAll[i];
        if (typeof(pElement) === "string") {
            sCode += pElement;
        }
        else {
            if (!(pElement.isSampler && pElement.iScope === a.fx.GLOBAL_VARS.GLOBAL) && pElement.pData === undefined) {
                pToCode = pElement.toCode(false);
                if (typeof(pToCode) === "string") {
                    sCode += pToCode;
                }
                else {
                    error("extrct function don`t work as expected");
                    return;
                }
            }
            else {
                if (!pCode) {
                    pCode = [];
                }
                if (sCode !== "") {
                    pCode.push(sCode);
                }
                pCode.push(pElement);
                sCode = "";
            }
        }
    }
    if (pCode) {
        if (sCode !== "") {
            pCode.push(sCode);
        }
        return pCode;
    }
    else {
        return sCode;
    }
};

function EffectShader(pFunction) {
    A_CLASS;
    /**
     *
     * @type {EffectVariable}
     */
    this.pReturnVariable = null;
    this.pTwin = null;
    this.isLocalOut = false;
    this.pGlobalVarBlock = null;
    this.pGlobalsByRealName = null;
    this.pUniformsBlock = null;
    this.pUniformsByName = null;
    this.pUniformsByRealName = null;
    this.pUniformsDefault = null;
    this.pBuffersBlock = null;
    this.pBuffersByName = null;
    this.pBuffersByRealName = null;
    this.pAttrBuffers = null;
    this.pMixibleTypes = null;
    this.pTypesBlock = null;
    this.pTypesByName = null;
    this.pFuncByDef = null;
    this.pFuncBlock = null;
    this.pTexturesByName = null;
    this.pTexturesByRealName = null;
    this.pGlobalPointers = [];
    this._isReady = false;
}
EXTENDS(EffectShader, EffectBaseFunction);
EffectShader.prototype.createTwinIn = function () {
    if (!this.pMainInputVar) {
        error("Twin available only for Vertex Shader with Struct Attrib");
        return;
    }
    this.pTwin = this.pMainInputVar.cloneMe();
    this.pTwin.sName = this.pTwin.sName + "_clone";
};
EffectShader.prototype.generateDefinitionCode = function (id, iEffectId) {
    this.sRealName = a.fx.GLOBAL_VARS.SHADERPREFIX + id + "_" + iEffectId;
    this._sDefinition = "void " + this.sRealName + "()";
};
EffectShader.prototype.generateExtractedCode = function () {
    var i, j;
    var sCode;
    var pCode = null;
    if (!this._sDefinition) {
        error("Before generate code for shader, you should definite this function");
        return;
    }
    sCode = this._sDefinition;
    sCode += "{";
    for (i in this._pLocalPointers) {
        if (this._pLocalPointers[i].pVar.isUsed) {
            sCode += "float " + i + "=0.0;"
        }
    }
    if (this.pTwin) {
        if (!pCode) {
            pCode = [];
        }
        var pTwin = this.pTwin;
        var pVar;
        pCode.push(sCode);
        sCode = "";
        pCode.push(pTwin.pType, " ", pTwin, ";");
        if (this instanceof EffectVertex) {
            for (i = 0; i < pTwin.pType.pEffectType.pDesc.pOrders.length; i++) {
                pVar = pTwin.pType.pEffectType.pDesc.pOrders[i];
                //TODO: add full support
                warning("Not full support of types have been implemented yet");
                pCode.push(pTwin, ".", pVar, " = ", this._pAttrSemantics[pVar.sSemantic], ";");
            }
        }
        else {
            for (i = 0; i < pTwin.pType.pEffectType.pDesc.pOrders.length; i++) {
                pVar = pTwin.pType.pEffectType.pDesc.pOrders[i];
                //TODO: add full support
                warning("Not full support of types have been implemented yet");
                pCode.push(pTwin, ".", pVar, " = ", this._pVaryingsSemantics[pVar.sSemantic], ";");
            }
        }
    }
    function fnExtractCode(pElement) {
        var pToCode;
        if (typeof(pElement) === "string") {
            sCode += pElement;
        }
        else if (pElement.pData === undefined) {
            pToCode = (pElement instanceof EffectBaseFunction) ? pElement.toCode() : pElement.toCode(true);
            if (typeof(pToCode) === "string") {
                if (!pCode) {
                    pCode = [];
                }
                if (sCode !== "") {
                    pCode.push(sCode);
                }
                pCode.push(pElement);
                sCode = "";
            }
            else {
                for (j = 0; j < pToCode.length; j++) {
                    fnExtractCode(pToCode[j]);
                }
            }
        }
        else {
            if (!pCode) {
                pCode = [];
            }
            if (sCode !== "") {
                pCode.push(sCode);
            }
            pCode.push(pElement);
            sCode = "";
        }
    }

    for (i = 0; i < this.pImplement.length; i++) {
        fnExtractCode(this.pImplement[i]);
    }
    if (this._pAttributes) {
        var pData;
        for (i in this._pAttrDataInit) {
            pData = this._pAttrDataInit[i];
            if (pData.isComplex !== true) {
                for (j = 0; j < pData.length; j++) {
                    if (typeof(pData[j]) === "string" || pData[j].pData !== undefined ||
                        typeof(pData[j]) === "number") {
                        continue;
                    }
                    pData[j] = pData[j].toCode(true);
                }
            }
            pData = this._pAttrIndexInit[i];
            if (pData) {
                for (j = 0; j < pData.length; j++) {
                    if (typeof(pData[j]) === "string" || pData[j].pData !== undefined ||
                        typeof(pData[j]) === "number") {
                        continue;
                    }
                    pData[j] = pData[j].toCode(true);
                }
            }
        }
        for (i = 0; i < this._pAttributes.length; i++) {
            pData = this._pAttrDataInit[this._pAttributes[i].sSemantic];
            if (pData && pData.isComplex === true) {
                this._extractAttrSubData(pData);
            }
        }
    }
    sCode += "}";
    if (pCode) {
        pCode.push(sCode);
        this._pCodeAll = pCode;
        return;
    }
    else {
        this._sCodeAll = sCode;
        return;
    }
};
EffectShader.prototype.toCodeAll = function (id) {
    if (this._isReady) {
        return;
    }
    var i, j;
    var pVar;
    if (this.pReturnVariable) {
        this.pReturnVariable.sRealName = a.fx.GLOBAL_VARS.SHADEROUT;
    }
    if (this.pTwin) {
        this.pTwin.sRealName += "_twin";
    }
    //set real names for global vars
    this.pGlobalsByRealName = {};
    this.pGlobalVarBlock = {};
    for (i in this.pGlobalVariables) {
        pVar = this.pGlobalVariables[i];
        pVar.sRealName = pVar.sName + "_g_" + id;
        this.pGlobalsByRealName[pVar.sRealName] = pVar;
        this.pGlobalVarBlock[pVar.sRealName] = pVar.toCodeDecl(true);
    }
    //set real names for uniform vars
    this.pUniformsByName = {};
    this.pUniformsByRealName = {};
    this.pUniformsDefault = {};
    this.pUniformsBlock = {};
    this.pTexturesByName = {};
    this.pTexturesByRealName = {};

    for (i in this.pUniforms) {
        pVar = this.pUniforms[i];
        pVar.sRealName = pVar.sSemantic || pVar.sRealName;
        this.pUniformsByName[i] = pVar.sRealName;
        if (pVar.isSampler()) {
            this.pUniformsDefault[pVar.sRealName] = pVar.pStates;
            this.pTexturesByName[pVar.pTexture.sName] = pVar.pTexture.sRealName;
            this.pTexturesByRealName[pVar.pTexture.sRealName] = null;
        }
        else {
            this.pUniformsDefault[pVar.sRealName] = pVar.pDefaultValue;
        }
        this.pUniformsByRealName[pVar.sRealName] = pVar;
        this.pUniformsBlock[pVar.sRealName] = pVar.isUniform ? pVar.toCodeDecl() : ("uniform " + pVar.toCodeDecl());
    }
    //Generate type block
    this.pTypesBlock = {};
    this.pTypesByName = {};
    var pType;
    for (i in this.pGlobalUsedTypes) {
        pType = this.pGlobalUsedTypes[i];
        this.pTypesByName[pType.sRealName] = pType;
        this.pTypesBlock[pType.sRealName] = pType.toCode();
    }
    //generate function block
    this.pFuncBlock = {};
    this.pFuncByDef = {};
    var pFunc;
    for (i in this.pFunctions) {
        pFunc = this.pFunctions[i];
        this.pFuncByDef[pFunc._sDefinition] = pFunc;
        this.pFuncBlock[pFunc._sDefinition] = pFunc.toCode(true);
    }
    //generate buffers
    this.pBuffersBlock = {};
    this.pBuffersByRealName = {};
    this.pBuffersByName = {};
    var pBuf;
    for (i in this.pGlobalBuffers) {
        pBuf = this.pGlobalBuffers[i];
        pVar = pBuf.pVar;
        pVar.sRealName = pVar.sSemantic || pVar.sRealName;
        this.pBuffersByName[pVar.sName] = pVar.sRealName;
        this.pBuffersByRealName[pVar.sRealName] = pBuf;
    }
    if (this instanceof EffectVertex) {
        this.pAttrBuffers = {};
        for (i in this._pAttrSemantics) {
            pVar = this._pAttrSemantics[i];
            if (pVar.isPointer !== false) {
                this.pAttrBuffers[i] = pVar.pBuffer;
            }
        }
    }
    //generate shader code
    if (!this._sCodeAll && !this._pCodeAll) {
        this.generateExtractedCode();
    }
    if (this._sCodeAll) {
        return this._sCodeAll;
    }
    var sCode = "";
    var pCode = null;
    var pElement;
    var pToCode;

    for (i = 0; i < this._pCodeAll.length; i++) {
        pElement = this._pCodeAll[i];
        if (typeof(pElement) === "string") {
            sCode += pElement;
        }
        else {
            if (!(pElement._isSampler && pElement.iScope === a.fx.GLOBAL_VARS.GLOBAL) &&
                pElement.pData === undefined) {
                pToCode = (pElement instanceof EffectBaseFunction) ? pElement.toCode() : pElement.toCode(true);
                if (typeof(pToCode) === "string") {
                    sCode += pToCode;
                }
                else {
                    error("extrct function don`t work as expected");
                    return;
                }
            }
            else {
                if (!pCode) {
                    pCode = [];
                }
                if (sCode !== "") {
                    pCode.push(sCode);
                }
                pCode.push(pElement);
                sCode = "";
            }
        }
    }
    if (sCode !== "") {
        if (!pCode) {
            this._sCodeAll = sCode;
        }
        else {
            pCode.push(sCode);
        }
    }
    if (pCode) {
        this._pCodeAll = pCode;
    }
    else {
        this._sCodeAll = sCode;
    }
    this._isReady = true;
};
EffectShader.prototype.generateGlobalPointers = function () {
    var i, j;
    var pPointers;
    for (i in this.pGlobalsByRealName) {
        pPointers = this.pGlobalsByRealName[i].pPointers;
        for (j = 0; j < pPointers.length; j++) {
            pPointers[j].sRealName = null;
            this.pGlobalPointers[pPointers[j].toCode()] = pPointers[j];
        }
    }
};
EffectShader.prototype.toFinal = function () {
    if (!this._isReady) {
        warning("You must use postAnalyzeEffect before");
        return false;
    }
    if (this._sCodeAll) {
        return this._sCodeAll;
    }
    else {
        var sCode = "";
        var pCode = this._pCodeAll;
        var i;
        for (i = 0; i < pCode.length; i++) {
            if (typeof(pCode[i]) === "string") {
                sCode += pCode[i];
            }
            else {
                sCode += pCode[i].toDataCode();
            }
        }
        return sCode;
    }
};
EffectShader.prototype._extractAttrSubData = function (pData) {
    var i, j;
    var nLength = pData.length;
    var pSubData;
    for (i = 0; i < nLength; i++) {
        pSubData = this._pAttrDataInit[pData[i]];
        if (pSubData.isComplex) {
            this._extractAttrSubData(pSubData);
            pData = pData.concat(pSubData);
            pData.isComplex = true;
        }
    }
};

function EffectVertex(pFunction) {
    A_CLASS;
    /**
     *
     * @type {EffectVariable[]}
     * @private
     */
    this._pVaryings = [];
    /**
     * Pairs: Semantic -> EffectVariable
     * @type {Object}
     * @private
     */
    this._pVaryingsSemantics = {};
    /**
     * @type {Array}
     * @private
     */
    this._pAttributes = [];
    this._pAttrSemantics = {};
    this._pAttrDataDecl = {};
    this._pAttrIndexDecl = {};
    this._pAttrDataInit = {};
    this._pAttrIndexInit = {};
}
EXTENDS(EffectVertex, EffectShader);
EffectVertex.prototype.addVarying = function (pVar) {
    if (this._pVaryingsSemantics[pVar.sSemantic]) {
        error("don`t do so bad things");
    }
    var pNewVar = pVar.cloneMe();
    pNewVar.sRealName = pNewVar.sSemantic + "_VAR";
    this._pVaryingsSemantics[pNewVar.sSemantic] = pNewVar;
    this._pVaryings.push(pNewVar);
};
EffectVertex.prototype.createReturnVar = function (pType) {
    this.pReturnVariable = new EffectVariable();
    this.pReturnVariable.sName = a.fx.GLOBAL_VARS.SHADEROUT;
    this.pReturnVariable.pType = pType.cloneMe();
};
EffectVertex.prototype.addAttribute = function (pVar, pEffect) {
    var pAttr;
    if (!pVar.isVSInput) {
        pAttr = pVar.cloneMe();
        pVar.sRealName = pVar.sSemantic;
        pAttr.isUsed = pVar.isUsed;
        pAttr.iScope = pVar.iScope;
//        pAttr.sName = pAttr.sSemantic;
        pAttr.sRealName = pAttr.sSemantic;
        this._pAttributes.push(pAttr);
        this._pAttrSemantics[pAttr.sSemantic] = pAttr;
//        this.addAttributeDecl(pAttr, pEffect);
        return;
    }
    var i;
    var pVars = pVar.pType.pEffectType.pDesc.pOrders;
    var pScope = pEffect._ppScopes[pVar.iScope].pStructTable;
    var sName;
    for (i = 0; i < pVars.length; i++) {
        sName = pVar.sName + "." + pVars[i].sName;
        this.addAttribute(pScope[sName], pEffect);
    }
};
EffectVertex.prototype.addAttributeDecl = function (pAttr, pEffect) {
    var sRealName = pAttr.toCode();
    if (!pAttr.isUsed) {
        return false;
    }
    this._pAttrDataDecl[sRealName] = pAttr.toCodeDecl();
    if (pAttr.isPointer === false) {
        return true;
    }
    var i;
    var pPointer;
    this._pAttrIndexDecl[sRealName] = "";
    for (i = 0; i < pAttr.pPointers.length; i++) {
        pPointer = pAttr.pPointers[i];
        pPointer.sRealName = null;
        this._pAttrIndexDecl[sRealName] += "float " + pPointer.toCode() + ";";
    }
    if (pAttr._pAllPointers) {
        for (i = pAttr.pPointers.length; i < pAttr._pAllPointers.length; i++) {
            pPointer = pAttr._pAllPointers[i];
            sRealName = pPointer.pVar.toCode(true);
            if (this._pAttrIndexDecl[sRealName] === undefined) {
                this._pAttrIndexDecl[sRealName] = "";
            }
            pPointer.sRealName = null;
            this._pAttrIndexDecl[sRealName] += "float " + pPointer.toCode() + ";";
        }
    }
    if (this._pExtractFunctions === null) {
        this._pExtractFunctions = {};
    }
    pEffect._extractVariableData(pAttr, this._pAttrDataInit, pAttr.pBuffer, this, a.fx.GLOBAL_VARS.INOBJECT);
    pEffect._extractVariableIndex(pAttr, this._pAttrIndexInit, pAttr.pBuffer, a.fx.GLOBAL_VARS.INOBJECT, true);

};
EffectVertex.prototype.generateDefinitionCode = function (id, iEffectId) {
    this.sRealName = a.fx.GLOBAL_VARS.VERTEXPREFIX + id + "_" + iEffectId;
    this._sDefinition = "void " + this.sRealName + "()";
};
EffectVertex.prototype.setAttributeUsed = function (pVar, pEffect) {
    var pAttr;
    var sSemantic;
    if (!pVar.isVSInput) {
        sSemantic = pVar.pVar ? pVar.pVar.sSemantic : pVar.sSemantic;
        pAttr = this._pAttrSemantics[sSemantic];
        pAttr.isUsed = pVar.isUsed;
        pAttr.iScope = pVar.iScope;
        pEffect._getAllPointers(pAttr);
        this.addAttributeDecl(pAttr, pEffect);
        return;
    }
    var i;
    var pVars = pVar.pType.pEffectType.pDesc.pOrders;
    var pScope = pEffect._ppScopes[pVar.iScope].pStructTable;
    var sName;
    for (i = 0; i < pVars.length; i++) {
        sName = pVar.sName + "." + pVars[i].sName;
        this.setAttributeUsed(pScope[sName], pEffect);
    }
};

function EffectFragment(pFunction) {
    A_CLASS;
    /**
     * @type {Object[]}
     * @private
     */
    this._pCode = [];
    /**
     *
     * @type {EffectVariable[]}
     * @private
     */
    this._pVaryings = [];
    /**
     * Pairs: Semantic -> EffectVariable
     * @type {Object}
     * @private
     */
    this._pVaryingsSemantics = {};
}
EXTENDS(EffectFragment, EffectShader);
EffectFragment.prototype.createTwinIn = function () {
    if (!this.pMainInputVar) {
        error("Twin available only for Vertex Shader with Struct Attrib");
        return;
    }
    this.pTwin = this.pMainInputVar.cloneMe();
    this.pTwin.sName = this.pTwin.sName + "_clone";
};
EffectFragment.prototype.addVarying = function (pVar) {
    var pVary;
    if (!pVar.isFSInput) {
        pVary = pVar.cloneMe();
        pVar.sRealName = pVar.sSemantic;
        pVary.sName = pVary.sSemantic;
        pVary.sRealName = pVary.sSemantic + "_VAR";
        this._pVaryings.push(pVary);
        this._pVaryingsSemantics[pVary.sSemantic] = pVary;
        return;
    }
    var i;
    var pVars = pVar.pType.pEffectType.pDesc.pOrders;
    for (i = 0; i < pVars.length; i++) {
        pVary = pVars[i].cloneMe();
        pVary.sName = pVary.sSemantic;
        pVary.sRealName = pVary.sSemantic + "_VAR";
        this._pVaryings.push(pVary);
        this._pVaryingsSemantics[pVary.sSemantic] = pVary;
    }
};
EffectFragment.prototype.generateDefinitionCode = function (id, iEffectId) {
    this.sRealName = a.fx.GLOBAL_VARS.FRAGMENTPREFIX + id + "_" + iEffectId;
    this._sDefinition = "void " + this.sRealName + "()";
};

function EffectTechnique(pEffect) {
    /**
     *
     * @type {EffectPasse[]}
     */
    this.pPasses = [];
    /**
     * Pairs: PassName -> EffectPass
     * @type {Object}
     */
    this.pPassesNames = {};
    /**
     * Is technique is posteffect or effect
     * @type {Boolean}
     */
    this.isPostEffect = false;
    /**
     * Annotations for technique
     * @type {Object}
     */
    this.pAnnotation = null;
    /**
     * @type {String}
     */
    this.sName = "";
    this._isComplexName = false;
    this.sComponents = null;
    this.pComponents = null;
    this.pComponentsShift = null;

    this.pExteranalsFragment = null;
    this.pExteranalsVertex = null;
    this.pEffect = pEffect;
}
EffectTechnique.prototype.addPass = function (pPass) {
    this.pPasses.push(pPass);
    if (this.pPassesNames[pPass.sName]) {
        warning("You tru add pass with the same name. It sounds not good(");
    }
    this.pPassesNames[pPass.sName] = pPass;
};
EffectTechnique.prototype.setName = function (sName) {
    this.sName = sName;
};
EffectTechnique.prototype.addSemantic = function (sSemantic) {
    sSemantic = sSemantic.toUpperCase();
    if (sSemantic === "POSTEFFECT") {
        this.isPostEffect = true;
    }
    else if (sSemantic === "EFFECT") {
        this.isPostEffect = false;
    }
    else {
        error("bad 301");
        return;
    }
};
EffectTechnique.prototype.addAnnotation = function (pAnnotation) {
    this.pAnnotation = pAnnotation;
};
EffectTechnique.prototype.hasComplexName = function (isComplex) {
    if (isComplex) {
        this._isComplexName = isComplex;
    }
    return this._isComplexName;
};
EffectTechnique.prototype.generateListOfExternals = function () {
    var i, j;
    var pExV, pExF;
    this.pExteranalsFragment = {};
    this.pExteranalsVertex = {};
    for (i = 0; i < this.pPasses.length; i++) {
        pExV = this.pPasses[i].pExteranalsVertex;
        pExF = this.pPasses[i].pExteranalsFragment;
        for (j in pExV) {
            this.pExteranalsVertex[j] = pExV[j];
        }
        for (j in pExF) {
            this.pExteranalsFragment[j] = pExF[j];
        }
    }
};
EffectTechnique.prototype.addComponent = function (pComponent, nShift) {
    //TODO: something in this method are so wrong
//    warning("EffectTechnique.addComponent: you should do it better");
    nShift = nShift || 0;
    if (!this.sComponents || !this.pComponents) {
        this.sComponents = "";
        this.pComponents = [];
        this.pComponentsShift = [];
    }
    this.sComponents += pComponent.findResourceName() + ">>" + nShift + "&";
    this.pComponents.push(pComponent);
    this.pComponentsShift.push(nShift);
    var i;
    for (i in pComponent.pExteranalsVertex) {
        this.pEffect.addExternalVar(pComponent.pExteranalsVertex[i], a.fx.GLOBAL_VARS.EXTERNAL_V);
    }
    for (i in pComponent.pExteranalsFragment) {
        this.pEffect.addExternalVar(pComponent.pExteranalsVertex[i], a.fx.GLOBAL_VARS.EXTERNAL_F);
    }
};
EffectTechnique.prototype.finalize = function () {
    if (!this._isComplexName && this.pEffect._sProvideNameSpace) {
        this.sName = this.pEffect._sProvideNameSpace + "." + this.sName;
    }
    if (this.pEffect.sComponents || this.pEffect.pComponents) {
        this.sComponents = this.pEffect.sComponents +
                           (this.sComponents !== null ? this.sComponents : "");
        if (this.pComponents) {
            this.pComponents = this.pEffect.pComponents.concat(this.pComponents);
        }
        else {
            this.pComponents = this.pEffect.pComponents.concat();
        }
    }
};

function EffectPass() {
    /**
     *
     * @type {String}
     */
    this.sVertex = "";
    /**
     *
     * @type {String}
     */
    this.sFragment = "";
    /**
     * Pairse: eState -> StateValue
     * @type {Object}
     */
    this.pStates = {};
    /**
     * @type {EffectVertex}
     */
    this.pVertexShader = null;
    /**
     *
     * @type {EffectFragment}
     */
    this.pFragmentShader = null;
    /**
     *
     * @type {String}
     */
    this.sName = "";
    /**
     *
     * @type {String}
     */
    this.sRealName = "";
    this.pAnnotation = null;
    this.sJSCode = "";
    this.pJSStates = null;
    this.pGlobalVariables = null;
    this.pGlobalsByName = null;
    this.pGlobalsByRealName = null;
    this.pGlobalsDefault = null;
    this.pTexturesByName = null;
    this.pTexturesByRealName = null;
    this.pGlobalsStrict = null;
    this.isComplex = false;
    this.pGlobalValues = null;
    this.pFuncHash = null;
    this.pCode = [];
    this.pFragments = {};
    this.pVertexes = {};
    this.pExteranalsFragment = null;
    this.pExteranalsVertex = null;
    this._fnEval = null;
    this.isEval = false;
}
EffectPass.prototype.setVertexShader = function (pParam) {
    if (typeof(pParam) === "string") {
        this.sVertexName = pParam;
    }
    else {
        this.pVertexShader = pParam;
    }
};
EffectPass.prototype.setFragmentShader = function (pParam) {
    if (typeof(pParam) === "string") {
        this.sFragmentName = pParam;
    }
    else {
        this.pFragmentShader = pParam;
    }
};
EffectPass.prototype.setJSVertexShader = function (pFunc) {
    if (!this.pFuncHash) {
        this.pFuncHash = {};
    }
    this.pFuncHash[pFunc.hash()] = pFunc;
    this.pushCode("me.sVertex=\"" + pFunc.hash() + "\";");
};
EffectPass.prototype.setJSFragmentShader = function (pFunc) {
    if (!this.pFuncHash) {
        this.pFuncHash = {};
    }
    this.pFuncHash[pFunc.hash()] = pFunc;
    this.pushCode("me.sFragment=\"" + pFunc.hash() + "\";");
};
EffectPass.prototype.addGlobalVariable = function (pVar) {
    if (!this.pGlobalVariables) {
        this.pGlobalVariables = {};
    }
    this.pGlobalVariables[pVar.sName] = pVar;
};
EffectPass.prototype.finalize = function () {
//    if (this.sJSCode !== "") {
//        this.pCode.push(this.sJSCode);
//    }
//    console.log(this.sJSCode);
    this._fnEval = new Function("me", "engine", "uniformValues", this.sJSCode);

    if (this.isComplex) {
        this.sJSCode = "";
    }
};
EffectPass.prototype.prepare = function (pEngineStates, pUniforms) {
    'use strict'
    this.pStates = {};
    this.sFragment = null;
    this.sVertex = null;
    if (this.isComplex && (!pEngineStates || !pUniforms)) {
        error("Place value of all variables");
        return;
    }
    this._fnEval(this, pEngineStates, pUniforms);
    if (this.sVertex !== null) {
        this.pVertexShader = this.pFuncHash[this.sVertex];
    }
    else {
        this.pVertexShader = null;
    }
    if (this.sFragment !== null) {
        this.pFragmentShader = this.pFuncHash[this.sFragment];
    }
    else {
        this.pFragmentShader = null;
    }
};
EffectPass.prototype.setState = function (eState, eValue) {
    this.pStates[eState] = eValue;
};
EffectPass.prototype.setJSState = function (eState, eValue) {
    this.pushCode("me.pStates[" + eState + "]=" + eValue + ";");
};
EffectPass.prototype.addAnnotation = function (pAnnotation) {
    this.pAnnotation = pAnnotation;
};
EffectPass.prototype.setName = function (sName) {
    this.sName = sName;
};
EffectPass.prototype.checkMe = function () {
//    if (!(this.pFragmentFunc && this.pVertexFunc)) {
//        return false;
//    }
//    if (this.pFragmentFunc.pParamOrders.length !== 1) {
//        return false;
//    }
//    if (!this.pFragmentFunc.pParamOrders[0].pType.isEqual(this.pVertexFunc.pReturnType)) {
//        return false;
//    }
    //TODO: some not trivial checks
    return true;
};
EffectPass.prototype.pushCode = function (pCodePart) {
    if (typeof(pCodePart) === "string") {
        this.sJSCode += pCodePart;
        return;
    }
    this.sJSCode += pCodePart.toCode();
//    if (this.sJSCode !== "") {
//        this.pCode.push(this.sJSCode);
//        this.sJSCode = "";
//    }
//    this.pCode.push(pCodePart);
};
EffectPass.prototype.generateListOfExternals = function () {
    var pExV = null, pExF = null;
    var i, j;
    var pShader;
    for (i in this.pVertexes) {
        pShader = this.pVertexes[i];
        for (j in pShader.pExternals) {
            if (!pExV) {
                pExV = {};
            }
            pExV[j] = pShader.pExternals[j];
        }
    }
    for (i in this.pFragments) {
        pShader = this.pFragments[i];
        for (j in pShader.pExternals) {
            if (!pExF) {
                pExF = {};
            }
            pExF[j] = pShader.pExternals[j];
        }
    }
    this.pExteranalsVertex = pExV;
    this.pExteranalsFragment = pExF;
};
EffectPass.prototype.addGlobalsFromShader = function (pShader) {
    if (!this.pGlobalsByName || !this.pGlobalsByRealName) {
        this.pGlobalsByName = {};
        this.pGlobalsByRealName = {};
        this.pGlobalsDefault = {};
        this.pTexturesByName = {};
        this.pTexturesByRealName = {};
    }
    var i;
    var sName, pVar;
    for (i in pShader.pTexturesByName) {
        sName = this.pTexturesByName[i] = pShader.pTexturesByName[i];
        this.pTexturesByRealName[sName] = null;
    }
    for (i in pShader.pUniformsByName) {
        if (this.pGlobalsByName[i]) {
            continue;
        }
        sName = pShader.pUniformsByName[i];
        this.pGlobalsByName[i] = sName;
        this.pGlobalsByRealName[sName] = pShader.pUniformsByRealName[sName];
        this.pGlobalsDefault[sName] = pShader.pUniformsDefault[sName];
    }
};
EffectPass.prototype.clear = function () {
    if (this.isComplex) {
        this.pVertexShader = null;
        this.pFragmentShader = null;
        this.pStates = {};
    }
};

/**
 * Block of code
 * @constructor
 */
function MemBlock() {
    this._pCodeData = null;
    this._pCodeIndex = null;
    this._pCode = null;
    if (arguments.length === 1) {
        this._pVar = arguments[0];
        this._iPointer = -1;
        this._pBuffer = arguments[0].pBuffer;
        this._pBaseBlock = null;
    }
    else if (arguments.length === 2) {
        this._pBaseBlock = arguments[0];
        this._iPointer = arguments[1];
        this._pVar = arguments[0]._pVar;
        this._pBuffer = arguments[0]._pBuffer;
    }
}
MemBlock.prototype.toCode = function () {
    if (this._pCode) {
        return this._pCode;
    }
    var pCode = [];
    var sCode = "";
    var nPointers = !this._pBaseBlock ? this._pVar.pPointers.length - 1 : this._iPointer;
    var i, j;
    var pCodeFr;
    var pCodeIndex = this._pCodeIndex || this._pBaseBlock._pCodeIndex;
    var pCodeData = this._pCodeData || this._pBaseBlock._pCodeData;
    for (i = 0; i < nPointers; i++) {
        pCodeFr = pCodeIndex[i];
        for (j = 0; j < pCodeFr.length; j++) {
            if (typeof(pCodeFr[j]) === "string") {
                sCode += pCodeFr[j];
            }
            else {
                if (sCode !== "") {
                    pCode.push(sCode);
                }
                pCode.push(pCodeFr[j]);
                sCode = "";
            }
        }
    }
    if (pCodeIndex.length > this._pVar.pPointers.length - 1) {
        for (i = this._pVar.pPointers.length - 1; i < pCodeIndex.length; i++) {
            pCodeFr = pCodeIndex[i];
            for (j = 0; j < pCodeFr.length; j++) {
                if (typeof(pCodeFr[j]) === "string") {
                    sCode += pCodeFr[j];
                }
                else {
                    if (sCode !== "") {
                        pCode.push(sCode);
                    }
                    pCode.push(pCodeFr[j]);
                    sCode = "";
                }
            }
        }
    }
    if (sCode !== "") {
        pCode.push(sCode);
    }
    sCode = "";
    for (i = 0; i < pCodeData.length; i++) {
        pCodeFr = pCodeData[i];
        if (typeof(pCodeFr) === "string") {
            sCode += pCodeFr;
        }
        else {
            if (sCode !== "") {
                pCode.push(sCode);
            }
            pCode.push(pCodeFr);
            sCode = "";
        }
    }
    pCode.push(sCode);
    sCode = null;
    this._pCode = pCode;
    return this._pCode;
};
MemBlock.prototype.addIndexData = function (pEffect) {
    if (this._pCodeIndex) {
        return;
    }
    var pVar = this._pVar;

    if (!this._pBaseBlock) {
        this._pCodeIndex = [];
        pEffect._extractVariableIndex(pVar, this._pCodeIndex, this._pBuffer, a.fx.GLOBAL_VARS.INARRAY, false);
    }
    else {
        error("Index data adds only for base memory blocks");
        return;
    }
};

function Effect(pManager, id) {
    Enum([
             DEFAULT = 0,
             NOTTRANSLATE,
             PARAMSTART,
             PARAM,
             UNNAME
         ], PARSINGPROPERTY, a.Effect.Var);
    Enum([
             DEFAULT = 0,
             FUNCTION,
             VERTEX,
             FRAGMENT
         ], ANALYZEDPROPERTY, a.Effect.Func);
    if (!pManager) {
        error("You must set ShaderManager for Effect correct work");
        return;
    }
    this._pRenderer = pManager;
    this._id = id;
    this.pParams = {};
    this.pTechniques = {};
    this.pPasses = {};
    this.nStep = 0;

    this.pVariables = {};
    this.pAnnotations = [];
    this._effectJS = {};
    this._effectJS_Constants = {};
    this._pConstants = {};

    this._isFuncParam = false;
    this._isLocal = false;

    this._pParseTree = null;

    this._pCurrentType = null;

    this._pTypeTable = {};
    this._pVariables = {};
    this._pCurrentAnnotation = null;
    this._pCurrentStructFields = null;
    this._pCurrentStructOrders = null;
    this._isCurrentStructMixible = null;

    this._pCurrentVar = null;
    this._pCodeStack = [];
    this._pCode = null;
    this._sCode = "";

    this._iScope = 0;
    this._nScope = 0;
    this._pScopeStack = [];
    this._ppScopes = {};
    this._pCurrentScope = null;

    this._isAnnotation = false;
    this._isStruct = false;
    this._isParam = false;
    this._isFunction = false;
    this._isToJS = false;

    this._pFunctionTableByHash = {};
    this._pFunctionTableByName = {};
    this._pFunctionBlackList = {};
    this._pShaders = {};
    this._pShadersBlackList = {};

    this.nCurrentDecl = 0;

    this._isVertex = false;
    this._isFragment = false;

    this._isSampler = false;

    this._pCurrentFunction = null;
    this._sVarName = null;
    this._sLastFullName = null;
    this._pVarNameStack = null;
    this._isNewName = false;
    this._isNewComplexName = false;
    this._isTypeAnalayzed = false;
    this._pExprType = null;

    this._nAddr = 0;

    this._isStrictMode = false;
    this._isWriteVar = false;
    this._pCurrentPass = null;
    this._pVarPropertyStack = null;

    /**
     * Arrays of variables that need to reRead from memory after stmt.
     * @type {Array}
     * @private
     */
    this._pMemReadVars = null;
    /**
     * Some parsing property of current analyzed variable
     * 0 - Don`t unname, and full translate
     * 1 - Don`t translate
     * 2 - Translate as attribute
     * 3 - full unname
     * @type {Number}
     * @private
     */
    this._eVarProperty = a.Effect.Var.DEFAULT;
    this._eFuncProperty = a.Effect.Var.DEFAULT;
    this._pLastVar = null;

    this._nTempStruct = 0;
    this._nShaders = 0;

    this._sProvideNameSpace = null;
    this._pCurrentTechnique = null;
    this._pUsedSeamntics = {};

    this.sComponents = null;
    this.pComponents = null;
    this.pComponentsShift = null;

    STATIC(sTempStructName, "TEMPSTRUCTNAME_")
    STATIC(pBaseFunctionsHash, {});
    STATIC(pBaseFunctionsName, {});
    STATIC(pBaseTypes, {
        "void"         : new EffectType("void", "void", true, 1),
        "float"        : new EffectType("float", "float", true, 1),
        "int"          : new EffectType("int", "int", true, 1),
        "bool"         : new EffectType("bool", "bool", true, 1),
        "float2"       : new EffectType("float2", "vec2", true, 2),
        "float3"       : new EffectType("float3", "vec3", true, 3),
        "float4"       : new EffectType("float4", "vec4", true, 4),
        "float2x2"     : new EffectType("float2x2", "mat2", true, 4),
        "float3x3"     : new EffectType("float3x3", "mat3", true, 9),
        "float4x4"     : new EffectType("float4x4", "mat4", true, 16),
        "string"       : new EffectType("string", "string", true, 1),
        "texture"      : new EffectType("texture", "texture", true, 1),
        "sampler"      : new EffectType("sampler", "sampler2D", true, 1),
        "ptr"          : new EffectType("ptr", "float", true, 1),
        "video_buffer" : new EffectType("video_buffer", "sampler2D", true, 1)
    });
    STATIC(pVectorSuffix, {
        "x"    : null,
        "y"    : null,
        "z"    : null,
        "w"    : null,
        "xy"   : null,
        "xz"   : null,
        "xw"   : null,
        "yx"   : null,
        "yz"   : null,
        "yw"   : null,
        "zx"   : null,
        "zy"   : null,
        "zw"   : null,
        "wx"   : null,
        "wy"   : null,
        "wz"   : null,
        "xyz"  : null,
        "xyw"  : null,
        "xzy"  : null,
        "xzw"  : null,
        "xwy"  : null,
        "xwz"  : null,
        "yxz"  : null,
        "yxw"  : null,
        "yzx"  : null,
        "yzw"  : null,
        "ywx"  : null,
        "ywz"  : null,
        "zxy"  : null,
        "zxw"  : null,
        "zyx"  : null,
        "zyw"  : null,
        "zwx"  : null,
        "zwy"  : null,
        "wxy"  : null,
        "wxz"  : null,
        "wyx"  : null,
        "wyz"  : null,
        "wzx"  : null,
        "wzy"  : null,
        "xyzw" : null,
        "xywz" : null,
        "xzyw" : null,
        "xzwy" : null,
        "xwyz" : null,
        "xwzy" : null,
        "yxzw" : null,
        "yxwz" : null,
        "yzxw" : null,
        "yzwx" : null,
        "ywxz" : null,
        "ywzx" : null,
        "zxyw" : null,
        "zxwy" : null,
        "zyxw" : null,
        "zywx" : null,
        "zwxy" : null,
        "zwyx" : null,
        "wxyz" : null,
        "wxzy" : null,
        "wyxz" : null,
        "wyzx" : null,
        "wzxy" : null,
        "wzyx" : null,
        "s"    : null,
        "t"    : null,
        "st"   : null,
        "ts"   : null,
        "p"    : null,
        "q"    : null,
        "pq"   : null,
        "qp"   : null,
        "r"    : null,
        "g"    : null,
        "b"    : null,
        "a"    : null,
        "rg"   : null,
        "rb"   : null,
        "ra"   : null,
        "gr"   : null,
        "gb"   : null,
        "ga"   : null,
        "br"   : null,
        "bg"   : null,
        "ba"   : null,
        "ar"   : null,
        "ag"   : null,
        "ab"   : null,
        "rgb"  : null,
        "rga"  : null,
        "rbg"  : null,
        "rba"  : null,
        "rag"  : null,
        "rab"  : null,
        "grb"  : null,
        "gra"  : null,
        "gbr"  : null,
        "gba"  : null,
        "gar"  : null,
        "gab"  : null,
        "brg"  : null,
        "bra"  : null,
        "bgr"  : null,
        "bga"  : null,
        "bar"  : null,
        "bag"  : null,
        "arg"  : null,
        "arb"  : null,
        "agr"  : null,
        "agb"  : null,
        "abr"  : null,
        "abg"  : null,
        "rgba" : null,
        "rgab" : null,
        "rbga" : null,
        "rbag" : null,
        "ragb" : null,
        "rabg" : null,
        "grba" : null,
        "grab" : null,
        "gbra" : null,
        "gbar" : null,
        "garb" : null,
        "gabr" : null,
        "brga" : null,
        "brag" : null,
        "bgra" : null,
        "bgar" : null,
        "barg" : null,
        "bagr" : null,
        "argb" : null,
        "arbg" : null,
        "agrb" : null,
        "agbr" : null,
        "abrg" : null,
        "abgr" : null
    });
//    STATIC(fnExtractFunction, function (pVar, pSampler, pHeader, pCode, me) {
//        pCode = pCode || [];
//        }
//    });
    STATIC(fnExtractFunctionToString, function (sVarName, pType, sSampler, sHeader) {

    });
    this._initSystemData();

}
Effect.prototype._initSystemData = function () {
    if (Effect._isInit) {
        return true;
    }
    this._addSystemFunction("dot", "float", [null, null], ["float", "float2", "float3", "float4"], "dot($1,$2)");
    this._addSystemFunction("mul", null, [null, null], ["float", "int", "float2", "float3", "float4"], "$1*$2");
    this._addSystemFunction("tex2D", "float4", ["sampler", "float2"], null, "texture2D($1,$2)");
    this._addSystemFunction("mod", "float", ["float", "float"], null, "mod($1,$2)");
    this._addSystemFunction("floor", "float", ["float"], null, "floor($1)");
    this._addSystemFunction("fract", "float", ["float"], null, "fract($1)");
    this._addSystemFunction("abs", "float", ["float"], null, "abs($1)");
    this._addSystemFunction("normalize", "float", [null], ["float", "float2", "float3", "float4"], "normalize($1)");
    this._addSystemFunction("length", null, [null], ["float3", "float4"], "length($1)");
    this._addSystemFunction("reflect", null, [null, null], ["float", "float2", "float3", "float4"], "reflect($1,$2)");
    this._addSystemFunction("max", null, [null, null], ["float", "float2", "float3", "float4"], "max($1,$2)");
    this._addSystemFunction("pow", null, [null, null], ["float", "float2", "float3", "float4"], "pow($1,$2)");
    Effect._isInit = true;
};
/**
 * Add system function
 * @tparam {String} sName
 * @tparam {EffectType} pReturn
 * @tparam {Array[EffectType]} pParams
 * @private
 */
Effect.prototype._addSystemFunction = function (sName, pReturn, pParamsType, pTemplate, pGLSL) {
    var pGLSLExpr = typeof(pGLSL) === "string" ? new GLSLExpr(pGLSL) : pGLSL;
    if (!this.constructor.pBaseFunctionsName[sName]) {
        this.constructor.pBaseFunctionsName[sName] = [];
    }
    var i, j;
    var pFunc;
    var pTypes;
    var sHash;
    if (pTemplate) {
        for (i = 0; i < pTemplate.length; i++) {
            pTypes = [];
            for (j = 0; j < pParamsType.length; j++) {
                if (pParamsType[j] === null) {
                    pTypes.push(this.constructor.pBaseTypes[pTemplate[i]]);
                }
                else {
                    pTypes.push(this.constructor.pBaseTypes[pParamsType[j]]);
                }
            }
            pFunc = new EffectFunction(sName, pGLSLExpr, pTypes);
            pFunc.pReturnType = pReturn ? this.constructor.pBaseTypes[pReturn] : this.constructor.pBaseTypes[pTemplate[i]];
            sHash = pFunc.calcHash();
            if (this.constructor.pBaseFunctionsHash[sHash]) {
                error("bad 193");
                return;
            }
            this.constructor.pBaseFunctionsHash[sHash] = pFunc;
            this.constructor.pBaseFunctionsName[sName].push(pFunc);
        }
        return;
    }
    if (!pReturn) {
        error("bad 194");
        return;
    }
    pTypes = [];
    for (j = 0; j < pParamsType.length; j++) {
        if (pParamsType[j] === null) {
            error("bad 195");
            return;
        }
        else {
            pTypes.push(this.constructor.pBaseTypes[pParamsType[j]]);
        }
    }
    pFunc = new EffectFunction(sName, pGLSLExpr, pTypes);
    pFunc.pReturnType = this.constructor.pBaseTypes[pReturn];
    sHash = pFunc.calcHash();
    if (this.constructor.pBaseFunctionsHash[sHash]) {
        error("bad 196");
        return;
    }
    this.constructor.pBaseFunctionsHash[sHash] = pFunc;
    this.constructor.pBaseFunctionsName[sName].push(pFunc);
    return;
};
/**
 * Very important function. Calculate some hlsl code.
 * Work only with const and literal objects.
 * @tparam Array pVal List of some hlsl instructions.
 */
Effect.prototype.evalHLSL = function (pCode, pVar) {
    if (!pCode || pCode.length === 0) {
        return null;
    }
    if (pCode.length === 1) {
        if (typeof(pCode[0]) === "string") {
            return pCode[0];
        }
    }
    else {
        if (!pVar.pType.isBase()) {
            error("default values only for base types");
            return;
        }
        var sName = pVar.pType.pEffectType.sName;
        var pData;
        if (sName === "float2") {
            pData = new Float32Array(2);
        }
        else if (sName === "float3") {
            pData = new Float32Array(3);
        }
        else if (sName === "float4") {
            pData = new Float32Array(4);
        }
        else if (sName === "int2") {
            pData = new Int32Array(2);
        }
        else if (sName === "int3") {
            pData = new Int32Array(3);
        }
        else if (sName === "int4") {
            pData = new Int32Array(4);
        }
        else if (sName === "float2x2") {
            pData = new Float32Array(4);
        }
        else if (sName === "float3x3") {
            pData = new Float32Array(9);
        }
        else if (sName === "float4x4") {
            pData = new Float32Array(16);
        }
        else {
            error("Eval for another base type are not supported");
            return;
        }
        if (pData.length !== pCode.length) {
            error("Type of var and literal are not same");
            return;
        }
        for (var i = 0; i < pCode.length; i++) {
            pData[i] = pCode[i];
        }
        return pData;
    }
    trace("Need to eval this code: ", pCode, pVar, this._pExprType);
};

Effect.prototype.addComponent = function (pComponent, nShift) {
    nShift = nShift || 0;
    if (!this.sComponents || !this.pComponents) {
        this.sComponents = "";
        this.pComponents = [];
        this.pComponentsShift = [];
    }
    this.sComponents += pComponent.findResourceName() + ">>" + nShift + "&";
    this.pComponents.push(pComponent);
    this.pComponentsShift.push(nShift);
    var i;
    for (i in pComponent.pExteranalsVertex) {
        this.addExternalVar(pComponent.pExteranalsVertex[i], a.fx.GLOBAL_VARS.EXTERNAL_V);
    }
    for (i in pComponent.pExteranalsFragment) {
        this.addExternalVar(pComponent.pExteranalsVertex[i], a.fx.GLOBAL_VARS.EXTERNAL_F);
    }
};
Effect.prototype.addExternalVar = function (pVar, eType) {
    var pScopeStack = this._pScopeStack;
    var pCurrentScope = this._pCurrentScope;
    var iScope = this._iScope;

    var pNewVar = pVar.cloneMe();

    this._pScopeStack = [a.fx.GLOBAL_VARS.GLOBAL];
    this._iScope = a.fx.GLOBAL_VARS.GLOBAL;
    this._pCurrentScope = this._ppScopes[0] || null;

    if (eType === a.fx.GLOBAL_VARS.EXTERNAL_V) {
        pNewVar.isVertexOnly = true;
    }
    else {
        pNewVar.isFragmentOnly = true;
    }
    this.addVariable(pNewVar);

    this._pScopeStack = pScopeStack;
    this._iScope = pCurrentScope;
    this._pCurrentScope = iScope;
};
Effect.prototype.newCode = function () {
    this._pCode = [];
    this._pCode.isWrite = true;
    this._pCodeStack.push(this._pCode);
};
Effect.prototype.endCode = function () {
    this._pCodeStack.pop();
    var iLen = this._pCodeStack.length - 1;
    if (iLen < 0) {
        this._pCode = null;
        return;
    }
    this._pCode = this._pCodeStack[iLen] || null;
};
Effect.prototype.pushCode = function (pObj) {
    if (this._pCode && !this._pCode.isWrite) {
        return;
    }
    this._pCode.push(pObj);
};
Effect.prototype.setWrite = function (isWrite) {
    this._pCode.isWrite = isWrite;
};
Effect.prototype.isCodeWrite = function () {
    if (this._pCode && this._pCode.isWrite) {
        return true;
    }
    return false;
};
Effect.prototype.newMemRead = function () {
    this._pMemReadVars = [];
};
Effect.prototype.endMemRead = function () {
    this._pMemReadVars = null;
};
Effect.prototype.newSampler = function () {
    this._isSampler = true;
};
Effect.prototype.endSampler = function () {
    this._isSampler = false;
};
Effect.prototype.newVarName = function () {
    this._isNewName = true;
    if (!this._pVarNameStack) {
        this._pVarNameStack = [];
    }
    if (!this._pVarPropertyStack) {
        this._pVarPropertyStack = [];
    }
    this._pVarNameStack.push(this._sVarName);
    this._pVarPropertyStack.push(this._eVarProperty);
    this._sVarName = "";
    this._eVarProperty = 0;
};
Effect.prototype.endVarName = function () {
    this._isNewName = false;
    this._sLastFullName = this._sVarName;
    this._sVarName = this._pVarNameStack.pop();
    this._eVarProperty = this._pVarPropertyStack.pop() || a.Effect.Var.DEFAULT;
};
Effect.prototype.newAddr = function () {
    this._nAddr = 0;
};
Effect.prototype.endAddr = function () {
    this._nAddr = 0;
};
Effect.prototype.newScope = function () {
    this._pScopeStack.push(this._nScope);
    if (this._pCurrentFunction && this._pCurrentFunction.pScopeStack) {
        this._pCurrentFunction.pScopeStack.push(this._nScope);
    }
    this._iScope = this._nScope;
    this._nScope++;
    this._pCurrentScope = null;
};
Effect.prototype.endScope = function () {
    if (this._pCurrentScope && this._pCurrentScope.isStrict) {
        this._isStrictMode = false;
    }
    this._pScopeStack.pop();
    this._iScope = this._pScopeStack[this._pScopeStack.length - 1];
    if (this._iScope === undefined) {
        this._iScope = -1;
    }
    this._pCurrentScope = this._ppScopes[this._iScope] || null;
};
Effect.prototype.newAnnotation = function () {
    this._isAnnotation = true;
    this._pCurrentAnnotation = {};
};
Effect.prototype.endAnnotation = function () {
    this._isAnnotation = false;
    this._pCurrentAnnotation = null;
};
Effect.prototype.newStruct = function () {
    this._isStruct = true;
    this._isCurrentStructMixible = true;
    this._pCurrentStructFields = {};
    this._pCurrentStructOrders = [];
};
Effect.prototype.endStruct = function () {
    this._isStruct = false;
    this._isCurrentStructMixible = false;
    this._pCurrentStructFields = null;
    this._pCurrentStructOrders = null;
};
Effect.prototype.newFunction = function () {
    this._isFunction = true;
};
Effect.prototype.endFunction = function () {
    this._isFunction = false;
    this._isVertex = false;
    this._isFragment = false;
};
Effect.prototype.addMemBlock = function (pVar, iPointer) {
    if (!this._pMemReadVars) {
        return;
    }
    var pFunction = this._pCurrentFunction;
    if (!pFunction) {
        error("You can`t doing something with memory in nonfunction scope");
        return;
    }

    var i;
    var index = this._pMemReadVars.length;
    var pBlock;
    for (i = 0; i < this._pMemReadVars.length; i++) {
        pBlock = this._pMemReadVars[i];
        if (pBlock._pVar === pVar && pBlock._iPointer === -1) {
            return;
        }
        if (pBlock._pVar === pVar && (iPointer === undefined || pBlock._iPointer > iPointer)) {
            index = i;
            break;
        }
    }
    this._pMemReadVars[index] = pFunction.memBlock(pVar, iPointer);
};
Effect.prototype.addBaseVarMemCode = function (pFunction, pBlock, pVar) {
    pVar = pVar || pBlock._pVar;
    if (!pVar.isUsed) {
        return;
    }
    if (!pBlock._pCodeData) {
        pBlock._pCodeData = [];
    }
    this._extractVariableData(pVar, pBlock._pCodeData, pBlock._pBuffer, pFunction, a.fx.GLOBAL_VARS.INARRAY);
};
Effect.prototype._extractVariableData = function (pVar, pData, pBuffer, pFunction, eMode, pPointer, iPadding) {
    if (!pVar.isUsed) {
        return false;
    }
    var isArray = false;
    var iOffset = 0;
    var pCode;
    var isShader = (pFunction instanceof EffectVertex);
    if (eMode === a.fx.GLOBAL_VARS.INARRAY) {
        pCode = pData;
    }
    else if (eMode === a.fx.GLOBAL_VARS.INOBJECT) {
        pCode = [];
        pData[pVar.toCode(isShader)] = pCode;
    }
    pPointer = pPointer || pVar.pPointers[0];
    if (pVar.pType.isBase()) {
        if (pVar.iLength > 1) {
            isArray = true;
            iOffset = 0;
            pCode.push("for(int i = 0; i <", pVar.iLength, ";i++){");
        }
        for (var i = 0; i < pVar.iLength; i++) {
            pCode.push(pVar);
            if (isArray) {
                pCode.push("[i]");
                iOffset += pVar.pType.pEffectType.iSize;
            }
            pCode.push("=(");
            if (pVar.pType.isEqual(this.hasType("float")) || pVar.pType.isEqual(this.hasType("bool"))) {
                pCode.push("A_extractFloat(");
                pFunction._pExtractFunctions["float"] = null;
            }
            else if (pVar.pType.isEqual(this.hasType("int"))) {
                pCode.push("int(A_extractFloat(");
                pFunction._pExtractFunctions["float"] = null;
            }
            else if (pVar.pType.isEqual(this.hasType("float2"))) {
                pCode.push("A_extractVec2(");
                pFunction._pExtractFunctions["float"] = null;
                pFunction._pExtractFunctions["vec2"] = null;
            }
            else if (pVar.pType.isEqual(this.hasType("float3"))) {
                pCode.push("A_extractVec3(");
                pFunction._pExtractFunctions["float"] = null;
                pFunction._pExtractFunctions["vec3"] = null;
            }
            else if (pVar.pType.isEqual(this.hasType("float4"))) {
                pCode.push("A_extractVec4(");
                pFunction._pExtractFunctions["float"] = null;
                pFunction._pExtractFunctions["vec4"] = null;
            }
            else if (pVar.pType.isEqual(this.hasType("int2"))) {
                pCode.push("ivec2(A_extractVec2(");
                pFunction._pExtractFunctions["float"] = null;
                pFunction._pExtractFunctions["vec2"] = null;
            }
            else if (pVar.pType.isEqual(this.hasType("int3"))) {
                pCode.push("ivec3(A_extractVec3(");
                pFunction._pExtractFunctions["float"] = null;
                pFunction._pExtractFunctions["vec3"] = null;
            }
            else if (pVar.pType.isEqual(this.hasType("int4"))) {
                pCode.push("ivec4(A_extractVec4(");
                pFunction._pExtractFunctions["float"] = null;
                pFunction._pExtractFunctions["vec4"] = null;
            }
            else if (pVar.pType.isEqual(this.hasType("bool2"))) {
                pCode.push("bvec2(A_extractVec2(");
                pFunction._pExtractFunctions["float"] = null;
                pFunction._pExtractFunctions["vec2"] = null;
            }
            else if (pVar.pType.isEqual(this.hasType("bool3"))) {
                pCode.push("bvec3(A_extractVec3(");
                pFunction._pExtractFunctions["float"] = null;
                pFunction._pExtractFunctions["vec3"] = null;
            }
            else if (pVar.pType.isEqual(this.hasType("bool4"))) {
                pCode.push("bvec4(A_extractVec4(");
                pFunction._pExtractFunctions["float"] = null;
                pFunction._pExtractFunctions["vec4"] = null;
            }
            else if (pVar.pType.isEqual(this.hasType("float4x4"))) {
                pCode.push("A_extractMat4(");
                pFunction._pExtractFunctions["float"] = null;
                pFunction._pExtractFunctions["vec4"] = null;
                pFunction._pExtractFunctions["Mat4"] = null;
            }
            else {
                error("We don`t support another simple type");
                return false;
            }
            pCode.push(pBuffer.pSampler, ",", pBuffer.pHeader, ",", pPointer);
            if (iPadding > 0) {
                pCode.push("+float(", pVar.iPadding, ")");
            }
            if (isArray) {
                pCode.push("+float(", iOffset, ")");
            }
            pCode.push(")");
            if (pVar.pType.isEqual(this.hasType("float")) ||
                pVar.pType.isEqual(this.hasType("float4x4")) ||
                pVar.pType.isEqual(this.hasType("float2")) ||
                pVar.pType.isEqual(this.hasType("float3")) ||
                pVar.pType.isEqual(this.hasType("float4"))) {
                pCode.push(");");
            }
            else if (pVar.pType.isEqual(this.hasType("bool"))) {
                pCode.push("!=0.0);");
            }
            else {
                pCode.push("));");
            }
        }
        if (isArray) {
            pCode.push(";");
        }
    }
    else {
        var iScope = pVar.iScope;
        var pOrders = pVar.pType.pEffectType.pDesc.pOrders;
        var i;
        var sName;
        var pScope = this._ppScopes[iScope].pStructTable;
        var pNewVar;
        var isExtract;
        if (!pScope) {
            error("Impossible to etract variable");
            return;
        }
        var sPrevName = pVar.sFullName || pVar.sName;
        if (eMode === a.fx.GLOBAL_VARS.INOBJECT) {
            pData[pVar.toCode(isShader)] = [];
            pData[pVar.toCode(isShader)].isComplex = true;
        }
        for (i = 0; i < pOrders.length; i++) {
            sName = sPrevName + "." + pOrders[i].sName;
            pNewVar = pScope[sName];
            isExtract = false;
            if (pNewVar.isPointer) {
                isExtract = this._extractVariableData(pNewVar, pData, pBuffer, pFunction, eMode);
            }
            else {
                isExtract = this._extractVariableData(pNewVar, pData, pBuffer, pFunction, eMode, pPointer,
                                                      pNewVar.iPadding);
            }
            if (eMode === a.fx.GLOBAL_VARS.INOBJECT && isExtract) {
                pData[pVar.toCode(isShader)].push(pNewVar.toCode(isShader));
            }
        }
    }
    return true;
};
Effect.prototype._extractVariableIndex = function (pVar, pData, pBuffer, eMode, isShader, pPointer) {
    if (!pVar.isUsed) {
        return false;
    }
    var pCodeIndex;
    var i;
    if (eMode === a.fx.GLOBAL_VARS.INARRAY) {
        pCodeIndex = pData;
    }
    else if (eMode === a.fx.GLOBAL_VARS.INOBJECT) {
        pCodeIndex = [];
        pData[pVar.toCode(isShader)] = pCodeIndex;
    }
    if (pVar.isPointer) {
        if (pPointer) {
            var iPadding = pVar.iPadding > 0 ? pVar.iPadding : 0;
            if (eMode === a.fx.GLOBAL_VARS.INARRAY) {
                pCodeIndex.push([pVar.pPointers[pVar.pPointers.length - 1], "=A_extractFloat(", pBuffer.pSampler,
                                 ",", pBuffer.pHeader, ",", pPointer, "+", iPadding, ".0);"]);
            }
            else if (eMode === a.fx.GLOBAL_VARS.INOBJECT) {
                pCodeIndex.push(pVar.pPointers[pVar.pPointers.length - 1], "=A_extractFloat(", pBuffer.pSampler,
                                ",", pBuffer.pHeader, ",", pPointer, "+", iPadding, ".0);");
            }
        }
        for (i = pVar.pPointers.length - 2; i >= 0; i--) {
            if (eMode === a.fx.GLOBAL_VARS.INARRAY) {
                pCodeIndex.push([pVar.pPointers[i], "=A_extractFloat(", pBuffer.pSampler,
                                 ",", pBuffer.pHeader, ",", pVar.pPointers[i + 1], ");"]);
            }
            else if (eMode === a.fx.GLOBAL_VARS.INOBJECT) {
                pCodeIndex.push(pVar.pPointers[i], "=A_extractFloat(", pBuffer.pSampler,
                                ",", pBuffer.pHeader, ",", pVar.pPointers[i + 1], ");");
            }
        }
    }
    if (!pVar.pType.isBase()) {
        pPointer = (pVar.isPointer ? pVar.pPointers[0] : pPointer);
        if (pVar._pIndexFields) {
            for (i = 0; i < pVar._pIndexFields.length; i++) {
                this._extractVariableIndex(pVar._pIndexFields[i], pData, pBuffer, eMode, isShader, pPointer);
            }
        }
    }
};

Effect.prototype.addVariable = function (pVar, isParams) {
    isParams = isParams || false;
    function fnExtractStruct(sName, pFirst, iPadding, sPrevRealV, sPrevRealP, pStruct, pTable, iDepth, me, pBufferMap) {
        var pOrders = pStruct.pOrders;
        var sNewName;
        var pPointers;
        var pBuffer;
        var isPointer;
        var sPrev;
        var sPrevRealSaveP = sPrevRealP;
        var sPrevRealSaveV = sPrevRealV;
        var pNewVar;

        for (var i = 0; i < pOrders.length; i++) {
            sPrevRealP = sPrevRealSaveP;
            sPrevRealV = sPrevRealSaveV;
            sPrev = sName + "." + pOrders[i].sName;
            sNewName = pFirst.sName + sPrev;
            pBuffer = null;
            pPointers = null;
            isPointer = false;
            pNewVar = new EffectVariableBase(pOrders[i], pFirst, sPrevRealV, me._iScope, sNewName, iPadding);
            if (!pNewVar) {
                error("good bad and ugly)");
                return;
            }
            pTable[sNewName] = pNewVar;
            if (pOrders[i].isPointer) {
                pPointers = [];
                for (var j = 0; j < pOrders[i].nDim; j++) {
                    pPointers.push(new EffectPointer(pNewVar, j, pFirst, sPrevRealSaveP, isParams));
                }
                if (isParams) {
                    pBuffer = pBufferMap || new EffectBuffer();
                }
                isPointer = true;
            }
            else {
                if (!me._isStrictMode && isParams && iDepth === 0) {
                    isPointer = undefined;
                    pPointers = [];
                    pPointers.push(new EffectPointer(pNewVar, 0, pFirst, sPrevRealSaveP, isParams));
                    pBuffer = pBufferMap || new EffectBuffer();
                }
            }
            pNewVar.isPointer = isPointer;
            pNewVar.pPointers = pPointers;
            pNewVar.pBuffer = pBuffer;

            if (!pOrders[i].pType.isBase()) {
                sPrevRealP = (sPrevRealP !== "" ) ? (sPrevRealP + "_" +
                                                     pOrders[i].sRealName) : pOrders[i].sRealName;
                sPrevRealV = (sPrevRealV !== "" ) ? (sPrevRealV + "." +
                                                     pOrders[i].sRealName) : pOrders[i].sRealName;
                fnExtractStruct(sPrev, pFirst, pOrders[i].isPointer ? 0 : pOrders[i].iPadding,
                                sPrevRealV, sPrevRealP, pOrders[i].pType.pEffectType.pDesc,
                                pTable, iDepth + 1, me, pBuffer);
            }
        }
    }

    if (!this._hasValidName(pVar)) {
        error("Bad variable name!");
        return;
    }
    if (this._hasVariableDecl(pVar.sName)) {
        error("Ohhh! You try to redeclarate varibale!");
        return;
    }
    if (this._iScope === a.fx.GLOBAL_VARS.GLOBAL &&
        !pVar.pType.isBase() && pVar.pType.pEffectType.pDesc.hasIndexData()) {
        error("Index data support only for attributes");
        return;
    }
    if (!this._pCurrentScope) {
        this._pCurrentScope = {};
        this._ppScopes[this._iScope] = this._pCurrentScope;
    }
    if (!this._pCurrentScope.pVariableTable) {
        this._pCurrentScope.pVariableTable = {};
    }
    this._pCurrentScope.pVariableTable[pVar.sName] = pVar;
    if (!pVar.isGlobal) {
        pVar.sRealName = pVar.sName + "_" + this._iScope + "_" + this._id;
    }
    else {
        if (this._iScope !== a.fx.GLOBAL_VARS.GLOBAL) {
            error("Usage 'global' available only in global scope of effect file");
            return;
        }
        pVar.sRealName = pVar.sName;
    }
    pVar.iScope = this._iScope;
    if (this._iScope === a.fx.GLOBAL_VARS.GLOBAL) {
        if (pVar.sSemantic) {
            if (!this._isValidSemantic(pVar.sSemantic)) {
                error("BAD semantic " + pVar.sSemantic);
                return;
            }
            this._lockSemantic(pVar.sSemantic);
        }
    }
    if (isParams) {
        pVar.isParametr = true;
    }
    if (pVar.pType.isEqual(this.hasType("video_buffer"))) {
        if (this._iScope !== a.fx.GLOBAL_VARS.GLOBAL && !(isParams && pVar.isUniform)) {
            error("You can not declarate video buffer here");
            return;
        }
        pVar.pBuffer = new EffectBuffer(pVar);
        pVar.pBuffer.isUniform = true;
        this.addBuffer(pVar);
    }
    if (pVar.isPointer === true || (isParams && pVar.isUniform === false && pVar.sSemantic)) {
        pVar.pPointers = [];
        for (var i = 0; i < (pVar.nDim || 1); i++) {
            pVar.pPointers.push(new EffectPointer(pVar, i, null, "", true));
        }
        if (isParams) {
            pVar.pBuffer = new EffectBuffer();
            pVar.isPointer = undefined;
            pVar.nDim = 1;
        }
    }
    if (!pVar.pType.isBase()) {
        if (!this._pCurrentScope.pStructTable) {
            this._pCurrentScope.pStructTable = {};
        }
        fnExtractStruct("", pVar, 0, "", "", pVar.pType.pEffectType.pDesc, this._pCurrentScope.pStructTable, 0,
                        this);
    }
};
Effect.prototype._hasValidName = function (pVar) {
    var sName = pVar.sName;
    if (a.fx.NAME_BLACKLIST[sName] === null) {
        return false;
    }
    return true;
};
Effect.prototype.addBuffer = function (pVar) {
    //TODO: may be
    warning("addBuffer ---> May be I should not be here");
};
Effect.prototype.hasVariable = function (sName) {
    var ppScopes = this._ppScopes;
    var pScopeStack = this._pScopeStack;
    var i;
    for (i = pScopeStack.length - 1; i >= 0; i--) {
        if (ppScopes[pScopeStack[i]] && ppScopes[pScopeStack[i]].pVariableTable &&
            ppScopes[pScopeStack[i]].pVariableTable[sName]) {
            return ppScopes[pScopeStack[i]].pVariableTable[sName];
        }
    }
    return false;
};
Effect.prototype.hasComplexVariable = function (sName) {
    var ppScopes = this._ppScopes;
    var pScopeStack = this._pScopeStack;
    var i;
    for (i = pScopeStack.length - 1; i >= 0; i--) {
        if (ppScopes[pScopeStack[i]] && ppScopes[pScopeStack[i]].pStructTable &&
            ppScopes[pScopeStack[i]].pStructTable[sName]) {
            return ppScopes[pScopeStack[i]].pStructTable[sName];
        }
    }
    return false;
};
Effect.prototype._hasVariableDecl = function (sName) {
    var pScope = this._pCurrentScope;
    if (pScope && pScope.pVariableTable && pScope.pVariableTable[sName]) {
        return pScope.pVariableTable[sName];
    }
    return false;
};
Effect.prototype.addType = function (pType) {
    if (!this._pCurrentScope) {
        this._pCurrentScope = {};
        this._ppScopes[this._iScope] = this._pCurrentScope;
    }
    if (!this._pCurrentScope.pTypeTable) {
        this._pCurrentScope.pTypeTable = {};
    }
    if (this._hasTypeDecl(pType.sName)) {
        error("Ohhh! You try to redifenition type((!");
        return;
    }
    this._pCurrentScope.pTypeTable[pType.sName] = pType;
    pType.sRealName = pType.sName + "_" + this._iScope + "_" + this._id;
    pType.iScope = this._iScope;
    pType.calcHash();
    pType.nOrder = this.nCurrentDecl;
};
Effect.prototype.hasType = function (sTypeName) {
    var pType = this.isBaseType(sTypeName);
    if (pType) {
        return pType;
    }
    var ppScopes = this._ppScopes;
    var pScopeStack = this._pScopeStack;
    var i;
    for (i = pScopeStack.length - 1; i >= 0; i--) {
        if (ppScopes[pScopeStack[i]] && ppScopes[pScopeStack[i]].pTypeTable &&
            ppScopes[pScopeStack[i]].pTypeTable[sTypeName]) {
            return ppScopes[pScopeStack[i]].pTypeTable[sTypeName];
        }
    }
    return false;
};
Effect.prototype._hasTypeDecl = function (sTypeName) {
    var pType = this.isBaseType(sTypeName);
    if (pType) {
        return pType;
    }
    var pScope = this._pCurrentScope;
    if (pScope && pScope.pTypeTable && pScope.pTypeTable[sTypeName]) {
        return pScope.pTypeTable[sTypeName];
    }
    return false;
};
Effect.prototype.isBaseType = function (sTypeName) {
    return this.constructor.pBaseTypes[sTypeName] || false;
};
Effect.prototype.addFunction = function (pFunction) {
    var sHash = pFunction.hash();
    var pFunc = this._hasFunctionDecl(sHash);
    if (pFunc && pFunc.isSystem) {
        error("Do not even think///^^^^-->");
        return;
    }
    if (pFunc) {
        warning("It`s seen bad. You try to redeclarate function");
        if (pFunction.hasImplementation() && pFunc.hasImplementation()) {
            error("You should not try to redefinition function");
            return;
        }
        else if (pFunction.hasImplementation()) {
            pFunc.pImplement = pFunction.pImplement;
            return;
        }
    }
    this._pFunctionTableByHash[sHash] = pFunction;
    if (!this._pFunctionTableByName[pFunction.sName]) {
        this._pFunctionTableByName[pFunction.sName] = [];
    }
    this._pFunctionTableByName[pFunction.sName].push(pFunction);
    pFunction.sRealName = pFunction.sName + "_" + this._id;
    pFunction.generateDefinitionCode();

};
Effect.prototype.hasFunction = function (sFuncName) {
    return this._pFunctionTableByName[sFuncName] || false;
};
Effect.prototype._hasFunctionDecl = function (sFuncHash) {
    return this.isBaseFunction(sFuncHash) || this._pFunctionTableByHash[sFuncHash] || false;
};
Effect.prototype.isBaseFunction = function (sFuncHash) {
    return this.constructor.pBaseFunctionsHash[sFuncHash] || false;
};
Effect.prototype.findBaseFunction = function (sName, pParams) {
    //Try find in built-in functions
    var pFunctions = this.constructor.pBaseFunctionsName[sName];
    var pFunc = null;
    var i, j;

    if (!pFunctions) {
        return null;
    }

    for (i = 0; i < pFunctions.length; i++) {
        if (pFunctions[i].pTypes.length === pParams.length) {
            for (j = 0; j < pParams.length; j++) {
                if (pFunctions[i].pTypes.isEqual(pParams[j])) {
                    if (!pFunc) {
                        pFunc = pFunctions[i];
                        return pFunc;
                    }
                }
                else {
                    break;
                }
            }
        }
    }
    return pFunc;
};
Effect.prototype.findFunction = function (sName, pParams) {
    var pFunctions = this._pFunctionTableByName[sName];
    var pFunc = null;
    var i, j;
    if (pFunctions) {
        if (pParams === null) {
            //Find function for pass
            if (pFunctions.length > 1) {
                error("Now so states are not support");
                return;
            }
            return pFunctions[0];
        }
        for (i = 0; i < pFunctions.length; i++) {
            if (pFunctions[i].nParamsNeeded === pParams.length) {
                if (pParams.length === 0) {
                    if (!pFunc) {
                        pFunc = pFunctions[i];
                    }
                    else {
                        error("I can`t choose function");
                        return;
                    }
                    continue;
                }
                for (j = 0; j < pParams.length; j++) {
                    if (pFunctions[i].pParamOrders[j].pType.isEqual(pParams[j])) {
                        if (!pFunc) {
                            pFunc = pFunctions[i];
                        }
                        else {
                            error("I can`t choose function");
                            return;
                        }
                    }
                    else {
                        break;
                    }
                }
            }
        }
        if (pFunc) {
            return pFunc;
        }
    }
    //Try to find buil-in function
    pFunctions = this.constructor.pBaseFunctionsName[sName];
    if (!pFunctions) {
        return null;
    }
    for (i = 0; i < pFunctions.length; i++) {
        if (pFunctions[i].pTypes.length === pParams.length) {
            for (j = 0; j < pParams.length; j++) {
                if (pFunctions[i].pTypes[j].isEqual(pParams[j])) {
                    if (!pFunc) {
                        pFunc = pFunctions[i];
                        return pFunc;
                    }
                }
                else {
                    break;
                }
            }
        }
    }
    return null;
};
Effect.prototype.addFunctionToBlackList = function (pFunction) {
    this._pFunctionTableByHash[pFunction.hash()] = null;
    this._pFunctionBlackList[pFunction.hash()] = pFunction;
    var pTable = this._pFunctionTableByName[pFunction.sName];
    var i;
    if (pTable.length === 1) {
        this._pFunctionTableByName[pFunction.sName] = null;
        return;
    }
    for (i = 0; i < pTable.length; i++) {
        if (pTable[i] === pFunction) {
            this._pFunctionTableByName.splice(i, 1);
            return;
        }
    }
};
Effect.prototype.addShaderToBlackList = function (pShader) {
    this._pShadersBlackList[pShader.pFunction.hash()] = pShader;
    this._pShaders[pShader.pFunction.hash()] = null;
    error("bad shader " + pShader.pFunction.sName);
    return;
};
Effect.prototype.convertType = function (pNode) {
    var pType;
    var pChildren = pNode.pChildren;
    if (pNode.sName === a.fx.GLOBAL_VARS.T_TYPE_ID) {
        pType = this.hasType(pNode.sValue);
        if (!pType) {
            error("bad 116");
            return;
        }
        return pType;
    }
    if (pNode.sName === a.fx.GLOBAL_VARS.STRUCT) {
        pType = this.analyzeStruct(pNode);
        return pType;
    }
    if (pNode.sName === a.fx.GLOBAL_VARS.T_KW_VOID) {
        pType = this.hasType(pNode.sValue);
        return pType;
    }
    if (pNode.sName === a.fx.GLOBAL_VARS.SCALARTYPE || pNode.sName === a.fx.GLOBAL_VARS.OBJECTTYPE) {
        pType = this.hasType(pChildren[pChildren.length - 1].sValue);
        if (!pType) {
            error("Something going wrong with type names(");
            return;
        }
        return pType;
    }
    if (pNode.sName === a.fx.GLOBAL_VARS.MATRIXTYPE || pNode.sName === a.fx.GLOBAL_VARS.VECTORTYPE) {
        if (pChildren.length === 1) {
            pType = this.hasType(pChildren[0].sValue);
            return pType;
        }
        var sTypeName;
        if (pNode.sName === a.fx.GLOBAL_VARS.MATRIXTYPE) {
            sTypeName = "matrix";
            sTypeName += "<" + this.convertType(pChildren[5]).toCode();
            this.newCode();
            sTypeName += "," + this.evalHLSL(this.analyzeExpr(pChildren[3]));
            this.endCode();
            this.newCode();
            sTypeName += "," + this.evalHLSL(this.analyzeExpr(pChildren[1]));
            this.endCode();
            sTypeName += ">";
        }
        else {
            sTypeName = "vector";
            sTypeName += "<" + this.convertType(pChildren[3]).toCode();
            this.newCode();
            sTypeName += "," + this.evalHLSL(this.analyzeExpr(pChildren[1]));
            this.endCode();
            sTypeName += ">";
        }
        pType = this.hasType(sTypeName);
        return pType;
    }
    if (pNode.sName === a.fx.GLOBAL_VARS.BASETYPE || pNode.sName === a.fx.GLOBAL_VARS.TYPE) {
        return this.convertType(pChildren[0]);
    }
    return pType;
};
Effect.prototype._isValidSemantic = function (sSemantic) {
    if (a.fx.SEMANTIC_BLACKLIST[sSemantic] === null) {
        return false;
    }
    if (this._pUsedSeamntics[sSemantic] === null) {
        return false;
    }
    return true;
};
Effect.prototype._lockSemantic = function (sSemantic) {
    if (this._iScope === a.fx.GLOBAL_VARS.GLOBAL) {
        this._pUsedSeamntics[sSemantic] = null;
    }
};
Effect.prototype._getAllPointers = function (pVar) {
    if (pVar._pAllPointers) {
        return pVar._pAllPointers;
    }
    if (!pVar.isPointer && (pVar.pType.isBase() || !pVar.pType.pEffectType.pDesc.hasIndexData())) {
        return null;
    }
    var pPointers;
    if (pVar.isPointer !== false) {
        pPointers = pVar.pPointers.concat();
    }
    else {
        pPointers = [];
    }
    pVar._pAllPointers = pPointers;
    if (pVar.pType.isBase()) {
        return pPointers;
    }
    var sVarName = pVar.sFullName || pVar.sName;
    var sName;
    var pOrders = pVar.pType.pEffectType.pDesc.pOrders;
    var i;
    var pStructScope = this._ppScopes[pVar.iScope].pStructTable;
    var pNewVar;
    var pIndexes = [];
    for (i = 0; i < pOrders.length; i++) {
        sName = sVarName + "." + pOrders[i].sName;
        pNewVar = pStructScope[sName];
        if (pNewVar.isPointer || (!pNewVar.pType.isBase() && pNewVar.pType.pEffectType.pDesc.hasIndexData())) {
            pPointers = pPointers.concat(this._getAllPointers(pNewVar));
            pIndexes.push(pNewVar);
        }
    }
    pVar._pAllPointers = pPointers;
    pVar._pIndexFields = pIndexes;
    return pPointers;
};

Effect.prototype.addConstant = function (pVar) {
    if (!this._pConstants) {
        this._pConstants = {};
    }
    this._pConstants[pVar.sName] = pVar;
};
Effect.prototype.clear = function () {
    this.pTechniques = {};
    this.pPasses = {};
    this.nStep = 0;
    this._pConstants = {};
    this._isLocal = false;
    this._pCurrentType = null;
    this._pCurrentAnnotation = null;
    this._pCurrentStructFields = null;
    this._pCurrentStructOrders = null;
    this._pCurrentVar = null;
    this._pCodeStack = [];
    this._pCode = null;
    this._iScope = 0;
    this._nScope = 0;
    this._pScopeStack = [];
    this._ppScopes = {};
    this._pCurrentScope = null;
    this._isAnnotation = false;
    this._isStruct = false;
    this._isParam = false;
    this._pFunctionTableByHash = {};
    this._pFunctionTableByName = {};
    this._pFunctionBlackList = {};
    this._pShaders = {};
    this._pShadersBlackList = {};
    this.nCurrentDecl = 0;
    this._pCurrentFunction = null;
    this._sVarName = null;
    this._sLastFullName = null;
    this._pVarNameStack = null;
    this._isNewName = false;
    this._isNewComplexName = false;
    this._isTypeAnalayzed = false;
    this._pExprType = null;
    this._nAddr = 0;
    this._isStrictMode = false;
    this._isWriteVar = false;
    this._pCurrentPass = null;
    this._pVarPropertyStack = null;
    this._pMemReadVars = null;
    this._eVarProperty = a.Effect.Var.DEFAULT;
    this._eFuncProperty = a.Effect.Var.DEFAULT;
    this._pLastVar = null;
};
Effect.prototype.analyze = function (pTree) {
    if (!pTree) {
        warning("Wrong argument! You must put an object of parse tree class!");
        return false;
    }
//    try {
    var pRoot = pTree.pRoot;
    var time = a.now();
//    console.log(this);
    this._pParseTree = pTree;
    this.newScope();
    this.firstStep();
    this.analyzeTypes();
    this.preAnalyzeFunctions();
    this.preAnalyzeVariables();
    this.preAnalyzeTechniques();
    this.secondStep();
    this.analyzeEffect();
    this.postAnalyzeEffect();
    this.checkEffect();
    this.endScope();
    trace("Time of analyzing effect file(without parseing) ", a.now() - time, "Result effect: ", this);
    return true;
//    }
//    catch (e) {
//        console.error(e);
//        return false;
//    }
};
Effect.prototype.firstStep = function () {
    this.nStep = 1;
};
Effect.prototype.secondStep = function () {
    this.nStep = 2;
};
/**
 * Analyze type declarations
 */
Effect.prototype.analyzeTypes = function () {
    var pChildren = this._pParseTree.pRoot.pChildren;
    var i;
    this.nCurrentDecl = 0;
    for (i = pChildren.length - 1; i >= 0; i--) {
        if (pChildren[i].sName === a.fx.GLOBAL_VARS.TYPEDECL) {
            this.nCurrentDecl++;
            this.analyzeTypeDecl(pChildren[i]);
        }
    }
};
/**
 * Analyze function definitions
 */
Effect.prototype.preAnalyzeFunctions = function () {
    var pChildren = this._pParseTree.pRoot.pChildren;
    var i;
    this.nCurrentDecl = 0;
    for (i = pChildren.length - 1; i >= 0; i--) {
        if (pChildren[i].sName === a.fx.GLOBAL_VARS.FUNCTIONDECL) {
            this.nCurrentDecl++;
            this.analyzeFunctionDecl(pChildren[i]);
        }
    }
};
Effect.prototype.preAnalyzeVariables = function () {
    var pChildren = this._pParseTree.pRoot.pChildren;
    var i;
    this.nCurrentDecl = 0;
    for (i = pChildren.length - 1; i >= 0; i--) {
        if (pChildren[i].sName === a.fx.GLOBAL_VARS.VARIABLEDECL) {
            this.nCurrentDecl++;
            this.analyzeVariableDecl(pChildren[i]);
        }
        if (pChildren[i].sName === a.fx.GLOBAL_VARS.VARSTRUCTDECL) {
            this.nCurrentDecl++;
            this.analyzeVarStructDecl(pChildren[i]);
        }
    }
};
/**
 * Analyze techniques
 */
Effect.prototype.preAnalyzeTechniques = function () {
    var pChildren = this._pParseTree.pRoot.pChildren;
    var i;
    this.nCurrentDecl = 0;
    for (i = pChildren.length - 1; i >= 0; i--) {
        if (pChildren[i].sName === a.fx.GLOBAL_VARS.TECHIQUEDECL) {
            this.nCurrentDecl++;
            this.analyzeTechniqueDecl(pChildren[i]);
        }
    }
};
/**
 * Analyze all (not analyzed yet) effect-file instructions(without technique statements)
 */
Effect.prototype.analyzeEffect = function () {
    var pChildren = this._pParseTree.pRoot.pChildren;
    var i;
    this.nCurrentDecl = 0;
    for (i = pChildren.length - 1; i >= 0; i--) {
        this.nCurrentDecl++;
        this.analyzeDecl(pChildren[i]);
    }
};
Effect.prototype.postAnalyzeEffect = function () {
    //check for used blacklist functions
    var isNewDelete = true;
    var i, j, k, l;
    var pFunction;
    while (isNewDelete) {
        isNewDelete = false;
        for (i in this._pFunctionTableByHash) {
            pFunction = this._pFunctionTableByHash[i];
            if (!pFunction) {
                continue;
            }
            for (j in pFunction.pFunctions) {
                if (this._pFunctionBlackList[j]) {
                    this.addFunctionToBlackList(pFunction);
                    isNewDelete = true;
                }
            }
        }
    }
    //Check all functions for used in vertexOnly or in FragmentOnly
    var isNewConstraint = true;
    var isVertexOnly, isFragmentOnly;
    while (isNewConstraint) {
        isNewConstraint = false;
        for (i in this._pFunctionTableByHash) {
            pFunction = this._pFunctionTableByHash[i];
            if (!pFunction) {
                continue;
            }
            for (j in pFunction.pFunctions) {
                isVertexOnly = pFunction.pFunctions[j].isVertexOnly;
                isFragmentOnly = pFunction.pFunctions[j].isFragmentOnly;
                if (pFunction.isVertexOnly === false && isVertexOnly === true) {
                    pFunction.isVertexOnly = isVertexOnly;
                    isNewConstraint = true;
                }
                if (pFunction.isFragmentOnly === false && isFragmentOnly === true) {
                    pFunction.isFragmentOnly = isFragmentOnly;
                    isNewConstraint = true;
                }
            }
        }
    }
    for (i in this._pFunctionTableByHash) {
        pFunction = this._pFunctionTableByHash[i];
        if (!pFunction) {
            continue;
        }
        if (pFunction.isVertexOnly && pFunction.isFragmentOnly) {
            error("Function cn`t be used as fragmentOnly and vertexOnly in same time");
            return;
        }
    }
    //generate list of global and uniform variables, used global types and externals vars for functions
    var isNew = true;
    var pGlobals, pUniforms, pExternals, pBuffers;
    while (isNew) {
        isNew = false;
        for (i in this._pFunctionTableByHash) {
            pFunction = this._pFunctionTableByHash[i];
            if (!pFunction) {
                continue;
            }
            for (j in pFunction.pFunctions) {
                pGlobals = pFunction.pFunctions[j].pGlobalVariables;
                pUniforms = pFunction.pFunctions[j].pUniforms;
                pExternals = pFunction.pFunctions[j].pExternals;
                pBuffers = pFunction.pFunctions[j].pGlobalBuffers;
                if (pFunction.addType(pFunction.pFunctions[j].globalUsedTypes())) {
                    isNew = true;
                }
                for (k in pExternals) {
                    if (pFunction.addExternal(pExternals[k])) {
                        isNew = true;
                    }
                }
                for (k in pUniforms) {
                    if (pFunction.addUniform(pUniforms[k])) {
                        isNew = true;
                    }
                }
                for (k in pGlobals) {
                    if (pFunction.addGlobalVariable(pGlobals[k])) {
                        isNew = true;
                    }
                }
                for (k in pBuffers) {
                    if (pFunction.addGlobalBuffer(pBuffers[k])) {
                        isNew = true;
                    }
                }
            }
        }
    }
    //generate effectBlock`s code
    var pBlock;
    var pVar;
    for (i in this._pFunctionTableByHash) {
        pFunction = this._pFunctionTableByHash[i];
        if (!pFunction) {
            continue;
        }
        if (pFunction._pBaseMemBlocks && pFunction._pExtractFunctions === null) {
            pFunction._pExtractFunctions = {};
        }
        for (j in pFunction._pBaseMemBlocks) {
            pBlock = pFunction._pBaseMemBlocks[j];
            pVar = pBlock._pVar;
            pBlock.addIndexData(this);
            if (!pVar.pType.isBase()) {
                error("We haven`t support non base type yet");
                return;
            }
            else {
                this.addBaseVarMemCode(pFunction, pBlock);
            }
        }
    }
    //check vertex and fragment shaders for blacklist
    var pShader;
    var isVertex;
    isNewDelete = true;
    while (isNewDelete) {
        isNewDelete = false;
        for (i in this._pShaders) {
            pShader = this._pShaders[i];
            if (!pShader) {
                continue;
            }
            isVertex = pShader instanceof EffectVertex;
            for (j in pShader.pFunctions) {
                if (this._pFunctionBlackList[pShader.pFunctions[j].hash()] ||
                    (isVertex && pShader.pFunctions[j].isFragmentOnly) ||
                    (!isVertex && pShader.pFunctions[j].isVertexOnly)) {
                    this.addShaderToBlackList(pShader);
                    isNewDelete = true;
                    break;
                }
            }
        }
    }
    //global vars and uniforms, used types and externals for shaders
    isNew = true;
    while (isNew) {
        isNew = false;
        for (i in this._pShaders) {
            pShader = this._pShaders[i];
            if (!pShader) {
                continue;
            }
            pFunction = pShader.pFunction;
            if (pFunction.pImplement) {
                continue;
            }
            for (j in pShader.pFunctions) {
                pGlobals = pShader.pFunctions[j].pGlobalVariables;
                pUniforms = pShader.pFunctions[j].pUniforms;
                pExternals = pShader.pFunctions[j].pExternals;
                pBuffers = pShader.pFunctions[j].pGlobalBuffers;
                if (pShader.addType(pShader.pFunctions[j].globalUsedTypes())) {
                    isNew = true;
                }
                for (k in pExternals) {
                    if (pShader.addExternal(pExternals[k])) {
                        isNew = true;
                    }
                }
                for (k in pUniforms) {
                    if (pShader.addUniform(pUniforms[k])) {
                        isNew = true;
                    }
                }
                for (k in pGlobals) {
                    if (pShader.addGlobalVariable(pGlobals[k])) {
                        isNew = true;
                    }
                }
                for (k in pBuffers) {
                    if (pFunction.addGlobalBuffer(pBuffers[k])) {
                        isNew = true;
                    }
                }
            }
        }
    }
    for (i in this._pShaders) {
        if (!this._pShaders[i]) {
            continue;
        }
        this._nShaders++;
    }
    //Generate defenitions for shaders
    for (i in this._pShaders) {
        if (!this._pShaders[i]) {
            continue;
        }
        this._pShaders[i].generateDefinitionCode(this._nShaders, this._id);
        this._pShaders[i].generateGlobalPointers();
        this._nShaders++;
    }
    //generate effectBlock`s code
    for (i in this._pShaders) {
        pShader = this._pShaders[i];
        if (!pShader) {
            continue;
        }
        if (pShader._pBaseMemBlocks && pShader._pExtractFunctions === null) {
            pShader._pExtractFunctions = {};
        }
        for (j in pShader._pBaseMemBlocks) {
            pBlock = pShader._pBaseMemBlocks[j];
            pVar = pBlock._pVar;
            pBlock.addIndexData(this);
            if (!pVar.pType.isBase()) {
                error("We haven`t support non base type yet");
                return;
            }
            else {
                this.addBaseVarMemCode(pShader, pBlock);
            }
        }
    }
    //Generate maximum possible ready code
    for (i in this._pShaders) {
        pShader = this._pShaders[i];
        if (!pShader) {
            continue;
        }
        pShader.toCodeAll(this._id);
        //console.log(pShader._sCodeAll ? pShader._sCodeAll : pShader._pCodeAll);
    }
    //check passes for used valid shaders
    var pPass;
    for (i in this.pTechniques) {
        for (j = 0; j < this.pTechniques[i].pPasses.length; j++) {
            pPass = this.pTechniques[i].pPasses[j];
            for (k in pPass.pFuncHash) {
                pShader = this._pShaders[k];
                if (!pShader) {
                    error("You pass isn`t valid");
                    return;
                }
                pPass.pFuncHash[k] = pShader;
                if (pShader instanceof EffectVertex) {
                    pPass.pVertexes[pShader.pFunction.hash()] = pShader;
                }
                else {
                    pPass.pFragments[pShader.pFunction.hash()] = pShader;
                }
            }
            pPass.generateListOfExternals();
            if (!pPass.isComplex) {
                pPass.prepare();
            }
        }
    }
    //generate maximum large list of uniforms for passes
    var sName;
    for (i in this.pTechniques) {
        for (j = 0; j < this.pTechniques[i].pPasses.length; j++) {
            pPass = this.pTechniques[i].pPasses[j];
            for (k in pPass.pFuncHash) {
                pShader = this._pShaders[k];
                pPass.addGlobalsFromShader(pShader);
            }
            for (k in pPass.pGlobalVariables) {
                pVar = pPass.pGlobalVariables[k];
                pVar.sRealName = pVar.sSemantic || pVar.sRealName;
                sName = pVar.sRealName;
                pPass.pGlobalsByName[k] = sName;
                pPass.pGlobalsByRealName[sName] = pVar;
                pPass.pGlobalsDefault[sName] = pVar.pDefaultValue;
            }
        }
    }
    //generate for technique general list of external variables
    for (i in this.pTechniques) {
        this.pTechniques[i].generateListOfExternals();
    }
    //generate all additional info for techniques
    for (i in this.pTechniques) {
        this.pTechniques[i].finalize();
    }
};
/**
 * Check effect after analyze for correctness of all instructions
 */
Effect.prototype.checkEffect = function () {

};
Effect.prototype.analyzeDecl = function (pNode) {
    if (pNode.pAnalyzed !== undefined) {
        return;
    }
    switch (pNode.sName) {
        case a.fx.GLOBAL_VARS.VARIABLEDECL:
            this.analyzeVariableDecl(pNode);
            break;
        case a.fx.GLOBAL_VARS.TYPEDECL:
            this.analyzeTypeDecl(pNode);
            break;
        case a.fx.GLOBAL_VARS.FUNCTIONDECL:
            this.analyzeFunctionDecl(pNode);
            break;
        case a.fx.GLOBAL_VARS.VARSTRUCTDECL:
            this.analyzeVarStructDecl(pNode);
            break;
        case a.fx.GLOBAL_VARS.TECHIQUEDECL:
            this.analyzeTechniqueDecl(pNode);
            break;
        case a.fx.GLOBAL_VARS.USEDECL:
            this.analyzeUseDecl(pNode);
            break;
        case a.fx.GLOBAL_VARS.PROVIDEDECL:
            this.analyzeProvideDecl(pNode);
            break;
        case a.fx.GLOBAL_VARS.IMPORTDECL:
            this.analyzeImportDecl(pNode);
            break;
    }
};
Effect.prototype.analyzeUseDecl = function (pNode) {
    var pChildren = pNode.pChildren;
    if (pChildren[0].sValue === a.fx.GLOBAL_VARS.T_KW_STRICT) {
        if (!this._isStrictMode) {
            this._pCurrentScope.isStrict = true;
            this._isStrictMode = true;
        }
    }
};
Effect.prototype.analyzeVariableDecl = function (pNode) {
    var pChildren = pNode.pChildren;
    var i;
    var pVar;
    var pType = new VariableType();
    this.analyzeUsageType(pChildren[pChildren.length - 1], pType);
    if (pType.pEffectType.iScope === a.fx.GLOBAL_VARS.GLOBAL &&
        (this._eFuncProperty === a.Effect.Func.FUNCTION ||
         ((this._eFuncProperty === a.Effect.Func.VERTEX ||
           this._eFuncProperty === a.Effect.Func.FRAGMENT) &&
          this._pCurrentFunction.pFunction.pImplement === null))) {
        this._pCurrentFunction.addType(pType.pEffectType);
    }
    if (pType.isEqual(this.hasType("video_buffer")) && this._iScope !== a.fx.GLOBAL_VARS.GLOBAL) {
        error("Declarations of video buffer are available only in Global scope");
        return;
    }
    var isSampler = false;
    if (pType.pEffectType.isSampler()) {
        isSampler = true;
        this.newSampler();
        if (this._iScope !== a.fx.GLOBAL_VARS.GLOBAL) {
            error("Only global samplers support");
            return;
        }
    }
    if (!pType.checkMe(this._isStruct ? a.fx.GLOBAL_VARS.STRUCTUSAGE : -1,
                       this._isLocal ? a.fx.GLOBAL_VARS.LOCALUSAGE : -1)) {
        error("You sucks. 1");
        return;
    }
    this._pCurrentType = pType;
    for (i = pChildren.length - 2; i >= 1; i--) {
        if (pChildren[i].sName === a.fx.GLOBAL_VARS.VARIABLE) {
            pVar = this.analyzeVariable(pChildren[i]);
            pVar.setType(pType);
            this.addVariableDecl(pVar);
        }
    }
    this._pCurrentType = null;
    if (isSampler) {
        this.endSampler();
    }
    pNode.pAnalyzed = true;
};
Effect.prototype.analyzeUsageType = function (pNode, pType) {
    pType = pType || new VariableType();
    var pChildren = pNode.pChildren;
    var i;
    for (i = pChildren.length - 1; i >= 0; i--) {
        if (pChildren[i].sName === a.fx.GLOBAL_VARS.TYPE) {
            pType.setType(this.convertType(pChildren[i]));
        }
        if (pChildren[i].sName === a.fx.GLOBAL_VARS.USAGE) {
            pType.setUsage(pChildren[i].pChildren[0].sValue);
        }
    }
    return pType;
};
Effect.prototype.analyzeVariable = function (pNode, pVar) {
    var pChildren = pNode.pChildren;
    if (this._isAnnotation || this._iScope > a.fx.GLOBAL_VARS.GLOBAL) {
        if (pChildren.length > 2) {
            error("Bad syntax! Bad variable declaration in annotation or local scope!");
            return;
        }
        if (pChildren.length === 2 && pChildren[0].sName !== a.fx.GLOBAL_VARS.INITIALIZER) {
            error("Bad syntax! Bad variable declaration in annotation or local scope! Second must be Initializer.");
            return;
        }
    }
    if (this._isStruct) {
        if (pChildren.length > 2) {
            error("Bad syntax! Bad variable declaration in struct scope!");
            return;
        }
        if (pChildren.length === 2 && pChildren[0].sName !== a.fx.GLOBAL_VARS.SEMANTIC) {
            error("Bad syntax! Bad variable declaration in struct scope! Second must be Semantic");
            return;
        }
    }
    pVar = pVar || new EffectVariable();
    this._pCurrentVar = pVar;
    this.analyzeVariableDim(pChildren[pChildren.length - 1], pVar);
    var i;
    var pResult = null;
    for (i = pChildren.length - 2; i >= 0; i--) {
        if (pChildren[i].sName === a.fx.GLOBAL_VARS.ANNOTATION) {
            pResult = this.analyzeAnnotation(pChildren[i], pVar);
        }
        else if (pChildren[i].sName === a.fx.GLOBAL_VARS.SEMANTIC) {
            pResult = this.analyzeSemantic(pChildren[i], pVar);
        }
        else if (pChildren[i].sName === a.fx.GLOBAL_VARS.INITIALIZER) {
            pResult = this.analyzeInitializer(pChildren[i], pVar);
        }
    }
    return pVar;
};
Effect.prototype.addVariableDecl = function (pVar) {
    if (!pVar.checkMe()) {
        error("You sucks 2");
        return;
    }
    if (this._isAnnotation) {
        pVar.pDefaultValue = this.evalHLSL(pVar.pInitializer);
        this._pCurrentAnnotation[pVar.sName] = pVar.sValue;
        return true;
    }
    if (this._isStruct) {
        this._pCurrentStructFields[pVar.sName] = pVar;
        this._pCurrentStructOrders.push(pVar);
        pVar.sRealName = pVar.sSemantic || (pVar.sName + "_" + this._id);
        if (!pVar.sSemantic) {
            this._isCurrentStructMixible = false;
        }
        if (!pVar.pType.canMixible()) {
            this._isCurrentStructMixible = false;
        }
        return true;
    }
    if (this._iScope === a.fx.GLOBAL_VARS.GLOBAL) {
        if (pVar.isConstInit() === false) {
            error("Don`t do this, bad boy");
            return;
        }
        pVar.pDefaultValue = this.evalHLSL(pVar.pInitializer, pVar);
        if (pVar.isConst() && pVar.isConstInit()) {
            this.addConstant(pVar);
        }
    }
    if (pVar.sName === a.fx.GLOBAL_VARS.SHADEROUT && this._eFuncProperty === a.Effect.Func.VERTEX) {
        if (!pVar.pType.isEqual(this._pCurrentFunction.pReturnType)) {
            error("Type of 'Out' variable are incorrect");
            return;
        }
        this.addVariable(this._pCurrentFunction.pReturnVariable);
    }
    else {
        this.addVariable(pVar);
        if (this.isCodeWrite()) {
            this.pushCode(pVar.pType);
            this.pushCode(" ");
            this.pushCode(pVar);
            if (pVar.pInitializer) {
                this.pushCode("=");
                var i;
                var pCode = pVar.pInitializer;
                for (i = 0; pCode && i < pCode.length; i++) {
                    this.pushCode(pCode[i]);
                }
            }
            this.pushCode(";");
        }
    }
};
Effect.prototype.analyzeVariableDim = function (pNode, pVar) {
    pVar = pVar || new EffectVariable();
    var pChildren = pNode.pChildren;
    var pCode;
    if (pChildren.length === 1) {
        pVar.sName = pChildren[0].sValue;
        return pVar;
    }
    if (pChildren.length === 3) {
        if (!this._isStruct && !this._isParam && this._eFuncProperty === a.Effect.Func.DEFAULT) {
            error("For variables this are not good");
            return;
        }
        pVar.isPointer = true;
        pVar.nDim++;
    }
    else if (pChildren.length === 4 && pChildren[0].sName === a.fx.GLOBAL_VARS.FROMEXPR) {
        pVar.isPointer = true;
        pVar.nDim++;
        pVar.pBuffer = this.analyzeFromExpr(pChildren[0]);
    }
    else {
        if (!pVar.isArray) {
            pVar.isArray = true;
        }
        else {
            error("Sorry but glsl does not support multidimensional arrays!");
            return;
        }
        this.newCode();
        this.analyzeExpr(pChildren[pChildren.length - 3]);
        pCode = this._pCode;
        this.endCode();
        pVar.iLength = this.evalHLSL(pCode);
    }
    this.analyzeVariableDim(pChildren[pChildren.length - 1], pVar);
    return pVar;
};
Effect.prototype.analyzeFromExpr = function (pNode) {
    var pChildren = pNode.pChildren;
    var pMem;
    if (pChildren[1].sName === a.fx.GLOBAL_VARS.T_NON_TYPE_ID) {
        pMem = this.hasVariable(pChildren[1].sValue);
        if (!pMem) {
            error("bad 1");
            return;
        }
        if (!pMem.pBuffer) {
            error("bad 2");
        }
        pMem = pMem.pBuffer;
        if (pMem.isUniform && this._eFuncProperty !== a.Effect.Func.DEFAULT) {
            this._pCurrentFunction.addGlobalBuffer(pMem);
        }
    }
    else {
        pMem = this.analyzeMemExpr(pChildren[1]);
    }
    this._pExprType = this.hasType("video_buffer");
    return pMem;
};
Effect.prototype.analyzeMemExpr = function (pNode) {
    var pChildren = pNode.pChildren;
    var pMem;
    var pVar;
    var isCodeWrite;
    if (pChildren[0].sName === a.fx.GLOBAL_VARS.T_NON_TYPE_ID) {
        pMem = this.hasVariable(pChildren[0].sValue);
        if (!pMem) {
            error("bad 3");
            return;
        }
        pMem = pMem.pBuffer;
    }
    else {
        isCodeWrite = this.isCodeWrite();
        this.setWrite(false);
        this.analyzeExpr(pChildren[0]);
        this.setWrite(isCodeWrite);

        if (this._sLastFullName.indexOf(".") !== -1) {
            pVar = this.hasComplexVariable(this._sLastFullName);
        }
        else {
            pVar = this.hasVariable(this._sLastFullName);
        }
        if (!pVar) {
            error("Unknown variable 101");
            return;
        }
        if (!pVar.pBuffer) {
            error("Varibale has no buffer");
            return;
        }
        pMem = pVar.pBuffer;
    }
    if (!pMem) {
        error("Oh-oh, don`t cool enough");
    }
    if (this._eFuncProperty === a.Effect.Func.FUNCTION && !pMem.isUniform) {
        throw a.fx.GLOBAL_VARS.ERRORBADFUNCTION;
    }
    this._pExprType = this.hasType("video_buffer");
    if (pMem.isUniform && this._eFuncProperty !== a.Effect.Func.DEFAULT) {
        this._pCurrentFunction.addGlobalBuffer(pMem);
    }
    return pMem;
};
Effect.prototype.analyzeAnnotation = function (pNode, pObj) {
    this.newAnnotation();
    var pChildren = pNode.pChildren;
    var i;
    for (i = pChildren.length - 1; i >= 0; i--) {
        if (pChildren[i].sName === a.fx.GLOBAL_VARS.VARIABLEDECL) {
            this.analyzeVariableDecl(pChildren[i]);
        }
    }
    pObj.addAnnotation(this._pCurrentAnnotation);
    this.endAnnotation();
    return pObj;
};
Effect.prototype.analyzeSemantic = function (pNode, pObj) {
    var sSemantic = pNode.pChildren[0].sValue;
    pObj.addSemantic(sSemantic);
    return pObj;
};
Effect.prototype.analyzeInitializer = function (pNode, pVar) {
    pVar = pVar || new EffectVariable();
    var pChildren = pNode.pChildren;
    var pInit;
    this.newCode();
    if (pChildren[pChildren.length - 2].sValue === "{") {
        var i;
        var iLength = pVar.iLength * this._pCurrentType.pEffectType.iSize;
        if ((pChildren.length - 3) !== iLength * 2 - 1 &&
            !((pChildren.length - 3) === iLength * 2 && pChildren[1].sValue === ",")) {
            error("Bad constructor");
        }
        for (i = pChildren.length - 3; i >= 1; i--) {
            if (pChildren[i].sName === a.fx.GLOBAL_VARS.INITEXPR) {
                this.analyzeInitExpr(pChildren[i]);
            }
        }
    }
    else {
        this.analyzeExpr(pNode.pChildren[0]);
    }
    pInit = this._pCode;
    this.endCode();
    pVar.addInitializer(pInit);
    return pVar;
};
Effect.prototype.analyzeInitExpr = function (pNode) {
    var pChildren = pNode.pChildren;

    if (pChildren[pChildren.length - 1].sValue === "{") {
        var i;
        for (i = pChildren.length - 2; i >= 1; i--) {
            if (pChildren[i].sName === a.fx.GLOBAL_VARS.INITEXPR) {
                this.analyzeInitExpr(pChildren[i]);
            }
        }
    }
    else {
        this.analyzeExpr(pChildren[0]);
    }
};
/**
 * Translate HLSL into GLSL (without real names of varibles)
 * @tparam Object pNode
 * @tparam Array pOut
 * @treturn Array Array of glsl commands. Or return false.
 * @private
 */
Effect.prototype.analyzeExpr = function (pNode) {
    //'use strict';
    var pChildren = pNode.pChildren;
    var pRes;
    var pVar;
    var pType, pType1, pType2;
    var sName = pNode.sName;
    var pFunction = this._pCurrentFunction;
    var pFunc;
    var i, j;
    var isNewVar = false;
    var isComplexVar = false;
    var sTypeName;
    var pCodeFragment;
    var isWriteMode = false;
    var isCodeWrite;
    var pCode, pCodeShader;
    var isFlag = false; //temp flag
    var pTemp = null; //some temp obj for anything

    switch (sName) {
        case a.fx.GLOBAL_VARS.OBJECTEXPR:
            if (pChildren[pChildren.length - 1].sValue === a.fx.GLOBAL_VARS.T_KW_STATEBLOCK_STATE) {
                //ObjectExpr : T_KW_STATEBLOCK_STATE StateBlock
                error("I don`t know what is this");
                return;
            }
            if (pChildren[pChildren.length - 1].sValue === a.fx.GLOBAL_VARS.T_KW_COMPILE_FRAGMENT) {
                //ObjectExpr : T_KW_COMPILE_FRAGMENT Target NonTypeId '(' ArgumentsOpt ')'
                error("Frog sucks");
                return;
            }
            if (pChildren[pChildren.length - 1].sValue === a.fx.GLOBAL_VARS.T_KW_COMPILE) {
                //ObjectExpr : T_KW_COMPILE Target NonTypeId '(' ArgumentsOpt ')'
                pFunc = this.findFunction(pChildren[pChildren.length - 2].sValue, null);
                if (!pFunc) {
                    error("yo, error");
                    return;
                }
                //this.pushCode(pChildren[2].sValue);
                if (pChildren.length > 4) {
                    //TODO: add support for these constructions
                    error("Sorry but we now don`t support this constructions");
                    return;
                }
                return pFunc;
            }
            else {
                //ObjectExpr : T_KW_SAMPLER_STATE StateBlock
                this.analyzeStateBlock(pChildren[0]);
                this._pExprType = null;
            }
            break;

        case a.fx.GLOBAL_VARS.COMPLEXEXPR:
            if (this._nAddr > 0 &&
                pChildren.length !== 3 &&
                (pChildren[1].sName !== a.fx.GLOBAL_VARS.POSTFIXEXPR ||
                 pChildren[1].sName !== a.fx.GLOBAL_VARS.PRIMARYEXPR ||
                 pChildren[1].sName !== a.fx.GLOBAL_VARS.COMPLEXEXPR)) {
                error("Bad for dog 2");
                break;
            }
            if (pChildren.length === 1) {
                //ComplexExpr : ObjectExpr
                this.analyzeExpr(pChildren[pChildren.length - 1]);
                break;
            }
            if (!(pChildren.length === 3 &&
                  (pChildren[1].sName === a.fx.GLOBAL_VARS.POSTFIXEXPR ||
                   pChildren[1].sName === a.fx.GLOBAL_VARS.COMPLEXEXPR ||
                   pChildren[1].sValue !== undefined))) {
                this._isNewComplexName = false;
            }
            if (pChildren.length === 3 && pChildren[2].sValue === "(") {
                //ComplexExpr : '(' Expr ')'
                this.pushCode("(");
                this.analyzeExpr(pChildren[1]);
                this.pushCode(")");
                break;
            }
            if (pChildren[pChildren.length - 1].sName === a.fx.GLOBAL_VARS.T_NON_TYPE_ID) {
                //ComplexExpr : NonTypeId '(' ArgumentsOpt ')'
                var pTypes = [];
                var pArguments = [];
                var pCandidates;
                isFlag = null;
                for (i = pChildren.length - 3; i >= 1; i--) {
                    if (pChildren[i].sValue !== ",") {
                        this.newCode();
                        if (this._eFuncProperty === a.Effect.Func.VERTEX) {
                            if (!pFunction.isLocalOut) {
                                isFlag = false;
                            }
                        }
                        this.analyzeExpr(pChildren[i]);
                        if (this._eFuncProperty === a.Effect.Func.VERTEX) {
                            if (pFunction.isLocalOut && isFlag === false) {
                                isFlag = true;
                                pFunction.isLocalOut = false;
                                if (!pCandidates) {
                                    pCandidates = [];
                                }
                                pCandidates.push(i);
                            }
                        }
                        pTypes.push(this._pExprType);
                        pArguments.push(this._pCode);
                        this.endCode();
                    }
                }
                pFunc = this.findFunction(pChildren[pChildren.length - 1].sValue, pTypes);
                if (!pFunc) {
                    error("can not find function: " + pChildren[pChildren.length - 1].sValue);
                    return;
                }
                pType1 = pFunc.pReturnType;
                for (i = 0; pCandidates && i < pCandidates.length; i++) {
                    pVar = pFunc.pParamOrders[pCandidates[i]];
                    if (pVar.isInput() || (!pVar.isInput && !pVar.isOutput())) {
                        pFunction.isLocalOut = true;
                        break;
                    }
                }
                if (pFunc.isSystem) {
                    pCodeFragment = pFunc.pGLSLExpr.toGLSL(pArguments);
                    for (i = 0; i < pCodeFragment.length; i++) {
                        this.pushCode(pCodeFragment[i]);
                    }
                }
                else {
                    this.pushCode(pFunc);
                    this.pushCode("(");
                    for (i = 0; i < pArguments.length; i++) {
                        for (j = 0; j < pArguments[i].length; j++) {
                            this.pushCode(pArguments[i][j]);
                        }
                        if (i != pArguments.length - 1) {
                            this.pushCode(",")
                        }
                    }
                    this.pushCode(")");
                    if (this._eFuncProperty === a.Effect.Func.FUNCTION ||
                        ((this._eFuncProperty === a.Effect.Func.VERTEX ||
                          this._eFuncProperty === a.Effect.Func.FRAGMENT) &&
                         pFunction.pFunction.pImplement === null)) {
                        pFunction.addFunction(pFunc);
                        if (!pFunc.isConstant) {
                            pFunction.isConstant = false;
                        }
                    }
                }
                this._pExprType = pType1;
                break;

            }
            else if (pChildren[pChildren.length - 1].sName === a.fx.GLOBAL_VARS.T_TYPE_ID) {
                //ComplexExpr : TypeId '(' ArgumentsOpt ')'
                pType1 = this.hasType(pChildren[pChildren.length - 1].sValue);
                this.pushCode(pType1);
            }
            else if (pChildren[pChildren.length - 1].sName === a.fx.GLOBAL_VARS.BASETYPE) {
                //ComplexExpr : BaseType '(' ArgumentsOpt ')'
                pType1 = this.convertType(pChildren[pChildren.length - 1]);
                this.pushCode(pType1);
            }
            this.pushCode("(");

            for (i = pChildren.length - 3; i >= 1; i--) {
                if (pChildren[i].sValue === ",") {
                    this.pushCode(",");
                }
                else {
                    this.analyzeExpr(pChildren[i]);
                }
            }
            this.pushCode(")");
            this._pExprType = pType1;
            break;

        case a.fx.GLOBAL_VARS.PRIMARYEXPR:
            if (pChildren.length === 1) {
                this.analyzeExpr(pChildren[pChildren.length - 1]);
                break;
            }
            if (this._isNewName) {
                error("something going wrong. maybe you use @some.any but correct - @(some.any)");
                return;
            }
            var isNewAddr = false;
            if (this._nAddr === 0) {
                isCodeWrite = this.isCodeWrite();
                this.setWrite(false);
                this.newAddr();
                isNewAddr = true;
            }
            this._nAddr++;
            this.analyzeExpr(pChildren[0]);

            if (isNewAddr) {
                this.setWrite(isCodeWrite);
                if (this._sLastFullName.indexOf(".") !== -1) {
                    pRes = this.hasComplexVariable(this._sLastFullName);
                }
                else {
                    pRes = this.hasVariable(this._sLastFullName);
                }
                if (!pRes) {
                    error("oh-ah");
                    break;
                }
                if (!pRes.pBuffer) {
                    error("Previously you must to definite buffer for variable");
                    return;
                }
                if (this._eFuncProperty === a.Effect.Func.FUNCTION && !pRes.pBuffer.isUniform) {
                    //In function only global buffers are available
                    throw a.fx.GLOBAL_VARS.ERRORBADFUNCTION;
                    return;
                }
                if (pRes.isPointer === false) {
                    error("only for index");
                    return;
                }
                if (pRes.isPointer === undefined) {
                    pRes.isPointer = true;
                }
                this._pLastVar = pRes;
                if (this._isWriteVar) {
                    this.addMemBlock(pRes, this._nAddr - 1);
                }
                pRes = pRes.pPointers[this._nAddr - 1];
                if (!pRes) {
                    error("@@@@ - why are you do this");
                    break;
                }
                this.pushCode(pRes);
                this.endAddr();
            }
            this._pExprType = this.hasType("ptr");
            break;

        case a.fx.GLOBAL_VARS.POSTFIXEXPR:
            if (this._nAddr > 0 && (pChildren.length === 2 || pChildren[0].sValue === "]")) {
                error("Bad for dog");
                break;
            }
            if ((pChildren[pChildren.length - 1].sName === a.fx.GLOBAL_VARS.PRIMARYEXPR &&
                 pChildren.length !== 2) ||
                pChildren[pChildren.length - 1].sName === a.fx.GLOBAL_VARS.OBJECTEXPR) {
                error("Unssuported construction");
                return;
            }
            if (pChildren.length === 2 && pChildren[1].sName === a.fx.GLOBAL_VARS.PRIMARYEXPR) {
                isWriteMode = this._isWriteVar;
                this._isWriteVar = true;
                this.analyzeExpr(pChildren[pChildren.length - 1]);
                this._isWriteVar = isWriteMode;
                this.pushCode(pChildren[0].sValue);
                this._pExprType = this.hasType("ptr");
                return;
            }
            isNewVar = false;
            isComplexVar = false;
            isFlag = false;
            if (!this._isNewComplexName) {
                pTemp = pChildren[pChildren.length - 1];
                while (true) {
                    if (pTemp.sName === a.fx.GLOBAL_VARS.COMPLEXEXPR) {
                        isFlag = true;
                        break;
                    }
                    if (pTemp.sValue !== undefined) {
                        break;
                    }
                    pTemp = pTemp.pChildren[pTemp.pChildren.length - 1];
                }
            }
            if (isFlag) {
                this._isNewComplexName = true;
                isComplexVar = true;
                isFlag = false;
                if (this._isNewName && this._sVarName !== "") {
                    error("you are very unlucky or stupid. You can choose)");
                    return;
                }
            }
            else {
                if (!this._isNewName) {
                    isNewVar = true;
                    this.newVarName();
                    if (this._eFuncProperty === a.Effect.Func.VERTEX ||
                        this._eFuncProperty === a.Effect.Func.FRAGMENT) {
                        this.newCode();
                    }
                }
            }
            this.analyzeExpr(pChildren[pChildren.length - 1]);
            if (isComplexVar) {
                if (this._isNewComplexName) {
                    isNewVar = true;
                    this.newVarName();
                    if (this._eFuncProperty === a.Effect.Func.VERTEX ||
                        this._eFuncProperty === a.Effect.Func.FRAGMENT) {
                        this.newCode();
                    }
                    this._sVarName = this._sLastFullName;
                    this._isTypeAnalayzed = false;
                }
                else {
                    this._isTypeAnalayzed = true;
                }
                this._isNewComplexName = false;
            }
            pType1 = this._pExprType;
            if (pChildren.length === 2) {
                this.pushCode(pChildren[0].sValue);
            }
            else if (pChildren[pChildren.length - 2].sValue === ".") {
                if (!isComplexVar || isNewVar) {
                    this._sVarName += ".";
                }
                this.pushCode(".");
                this.analyzeExpr(pChildren[pChildren.length - 3]);
                pType1 = this._pExprType;
                if (pChildren.length === 4) {
                    if (!isNewVar) {
                        error("not this way");
                        return;
                    }
                    pVar = this.hasComplexVariable(this._sVarName);
                    if (!pVar) {
                        error("bad 50");
                        return;
                    }
                    if (pVar.isPointer === false) {
                        error("bad 51");
                        return;
                    }
                    if (pVar.isPointer === undefined) {
                        pVar.isPointer = true;
                    }
                    if (isNewVar) {
                        this.endVarName();
                        if (this._eFuncProperty === a.Effect.Func.VERTEX ||
                            this._eFuncProperty === a.Effect.Func.FRAGMENT) {
                            this.endCode();
                        }
                        isNewVar = false;
                    }
                    if (isComplexVar) {
                        this._isTypeAnalayzed = false;
                        isComplexVar = false;
                    }
                    var pMem = this.analyzeFromExpr(pChildren[0]);
                    if (!pMem) {
                        error("bad 49");
                        return;
                    }

                    if (this._eFuncProperty === a.Effect.Func.FUNCTION && !pMem.isUniform) {
                        throw a.fx.GLOBAL_VARS.ERRORBADFUNCTION;
                    }
                    if (this._iScope !== pVar.iScope) {
                        error("bad 52");
                        return;
                    }
                    pVar.pBuffer = pMem;
                    this.addMemBlock(pVar);
                }
            }
            else if (pChildren[0].sValue === "]") {
                pVar = this._pLastVar;
                this.newVarName();
                this.pushCode("[");
                this.analyzeExpr(pChildren[1]);
                if (!this._pExprType.isEqual(this.hasType("int"))) {
                    error("bad 107");
                    return;
                }
                this.pushCode("]");
                this.endVarName();
                if (pType1 !== a.fx.GLOBAL_VARS.UNDEFINEDTYPE && pType1.isBase()) {
                    if (pType1.isEqual(this.hasType("float4x4"))) {
                        pType1 = this.hasType("float4");
                    }
                    else if (pType1.isEqual(this.hasType("float3x3"))) {
                        pType1 = this.hasType("float3");
                    }
                    else if (pType1.isEqual(this.hasType("float2x2"))) {
                        pType1 = this.hasType("float2");
                    }
                    else if (pType1.isEqual(this.hasType("float4")) ||
                             pType1.isEqual(this.hasType("float3")) ||
                             pType1.isEqual(this.hasType("float2"))) {
                        pType1 = this.hasType("float");
                    }
                    else if (pType1.isEqual(this.hasType("int4x4"))) {
                        pType1 = this.hasType("int4");
                    }
                    else if (pType1.isEqual(this.hasType("int3x3"))) {
                        pType1 = this.hasType("int3");
                    }
                    else if (pType1.isEqual(this.hasType("int2x2"))) {
                        pType1 = this.hasType("int2");
                    }
                    else if (pType1.isEqual(this.hasType("int4")) ||
                             pType1.isEqual(this.hasType("int3")) ||
                             pType1.isEqual(this.hasType("int2"))) {
                        pType1 = this.hasType("int");
                    }
                    else if (pType1.isEqual(this.hasType("bool4x4"))) {
                        pType1 = this.hasType("bool4");
                    }
                    else if (pType1.isEqual(this.hasType("bool3x3"))) {
                        pType1 = this.hasType("bool3");
                    }
                    else if (pType1.isEqual(this.hasType("bool2x2"))) {
                        pType1 = this.hasType("bool2");
                    }
                    else if (pType1.isEqual(this.hasType("bool4")) ||
                             pType1.isEqual(this.hasType("bool3")) ||
                             pType1.isEqual(this.hasType("bool2"))) {
                        pType1 = this.hasType("bool");
                    }
                    else {
                        error("it`s not an array");
                        return;
                    }
                }
                else if (pType1 !== a.fx.GLOBAL_VARS.UNDEFINEDTYPE) {
                    if (!pVar || !pVar.isArray) {
                        error("[] - only for arrays");
                        return;
                    }
                }
            }
            if (isNewVar) {
                if (this._eFuncProperty === a.Effect.Func.VERTEX ||
                    this._eFuncProperty === a.Effect.Func.FRAGMENT) {
                    pCode = this._pCode;
                    this.endCode();
                    isFlag = false;
                    if (this._eVarProperty === a.Effect.Var.PARAM ||
                        this._eVarProperty === a.Effect.Var.PARAMSTART) {
                        if (pType1.isBase()) {
                            for (i = 1; pCode && i < pCode.length; i++) {
                                if (isFlag === true) {
                                    this.pushCode(pCode[i]);
                                }
                                else {
                                    if (pCode[i] === ".") {
                                        isFlag = true;
                                    }
                                }
                            }
                        }
                        else {
                            for (i = 0; pCode && i < pCode.length; i++) {
                                if (pCode[i] === this._pCurrentFunction.pMainInputVar) {
                                    if (this.isCodeWrite()) {
                                        if (!this._pCurrentFunction.pTwin) {
                                            this._pCurrentFunction.createTwinIn();
                                        }
                                        this.pushCode(this._pCurrentFunction.pTwin);
                                    }
                                }
                                else {
                                    this.pushCode(pCode[i]);
                                }
                            }
                        }
                        this._eVarProperty = a.Effect.Var.DEFAULT;
                    }
                    else {
                        for (i = 0; pCode && i < pCode.length; i++) {
                            this.pushCode(pCode[i]);
                        }
                    }
                }
                this.endVarName();
            }
            if (isComplexVar) {
                this._isTypeAnalayzed = false;
            }
            this._pExprType = pType1;
            break;

        case a.fx.GLOBAL_VARS.UNARYEXPR:
            if (pChildren.length === 1) {
                this.analyzeExpr(pChildren[pChildren.length - 1]);
                break;
            }
            this.pushCode(pChildren[pChildren.length - 1].sValue);
            this.analyzeExpr(pChildren[0]);
            if (!this._pExprType.isBase()) {
                error("bad 106");
                return;
            }
            break;

        case a.fx.GLOBAL_VARS.CASTEXPR:
            if (pChildren.length === 1) {
                this.analyzeExpr(pChildren[pChildren.length - 1]);
                break;
            }
            this.pushCode("(");
            this.analyzeConstTypeDim(pChildren[2]);
            //Set this._pExprType in function above
            pType = this._pExprType;
            this.pushCode("(");
            this.analyzeExpr(pChildren[0]);
            this.pushCode(")");
            this.pushCode(")");
            this._pExprType = pType;
            if (pType.iScope === a.fx.GLOBAL_VARS.GLOBAL &&
                (this._eFuncProperty === a.Effect.Func.FUNCTION ||
                 ((this._eFuncProperty === a.Effect.Func.VERTEX ||
                   this._eFuncProperty === a.Effect.Func.FRAGMENT) &&
                  this._pCurrentFunction.pFunction.pImplement === null))) {
                pFunction.addType(pType);
            }
            break;

        case a.fx.GLOBAL_VARS.CONDITIONALEXPR:
            this.analyzeExpr(pChildren[pChildren.length - 1]);
            if (!this._pExprType.isEqual(this.hasType("bool"))) {
                error("bad 105");
                return;
            }
            if (pChildren.length === 1) {
                break;
            }
            else {
                this.pushCode("?");
                this.analyzeExpr(pChildren[2]);
                pType1 = this._pExprType;
                this.pushCode(":");
                this.analyzeExpr(pChildren[0]);
                pType2 = this._pExprType;
                if (!pType1.isEqual(pType2)) {
                    error("104");
                    return;
                }
                this._pExprType = pType1;
            }
            break;

        case a.fx.GLOBAL_VARS.MULEXPR:
        case a.fx.GLOBAL_VARS.ADDEXPR:
        case a.fx.GLOBAL_VARS.RELATIONALEXPR:
        case a.fx.GLOBAL_VARS.EQUALITYEXPR:
        case a.fx.GLOBAL_VARS.ANDEXPR:
        case a.fx.GLOBAL_VARS.OREXPR:
            if (this._isWriteVar === true) {
                error("you are doing so bad and ugly things(");
                return;
            }
            this.analyzeExpr(pChildren[pChildren.length - 1]);
            pType1 = this._pExprType;
            if (pChildren.length === 1) {
                break;
            }
            else {
                this.pushCode(" " + pChildren[1].sValue + " ");
                this.analyzeExpr(pChildren[0]);
                pType2 = this._pExprType;
            }
            if (sName === a.fx.GLOBAL_VARS.OREXPR || sName === a.fx.GLOBAL_VARS.ANDEXPR) {
                pType = this.hasType("bool");
                if (pType1 !== a.fx.GLOBAL_VARS.UNDEFINEDTYPE && pType2 !== a.fx.GLOBAL_VARS.UNDEFINEDTYPE &&
                    !(pType1.isEqual(pType) && pType2.isEqual(pType))) {
                    error("bad 101");
                    return;
                }
                this._pExprType = pType;
            }
            else if (sName === a.fx.GLOBAL_VARS.EQUALITYEXPR || sName === a.fx.GLOBAL_VARS.RELATIONALEXPR) {
                if (pType1 !== a.fx.GLOBAL_VARS.UNDEFINEDTYPE && pType2 !== a.fx.GLOBAL_VARS.UNDEFINEDTYPE &&
                    !pType1.isEqual(pType2)) {
                    error("bad 102");
                    return;
                }
                this._pExprType = this.hasType("bool");
            }
            else if (sName === a.fx.GLOBAL_VARS.ADDEXPR) {
                if (!(pType1.isBase() && pType2.isBase())) {
                    error("bad 103");
                    return;
                }
                this._pExprType = pType1;
            }
            break;
        case a.fx.GLOBAL_VARS.ASSIGNMENTEXPR:
            if (this._isWriteVar === false) {
                this._isWriteVar = true;
                isWriteMode = true;
            }
            this.analyzeExpr(pChildren[pChildren.length - 1]);
            if (isWriteMode) {
                isWriteMode = false;
                this._isWriteVar = false;
            }
            pType1 = this._pExprType;
            this.pushCode(pChildren[1].sValue);
            this.analyzeExpr(pChildren[0]);
            pType2 = this._pExprType;
            if (sName === a.fx.GLOBAL_VARS.ASSIGNMENTEXPR && pChildren.length === 3) {
//                if (!pType1.isEqual(pType2)) {
//                    console.log(pNode);
//                    error("Bad 191");
//                    return;
//                }
                this._pExprType = pType1;
            }
            break;

        case a.fx.GLOBAL_VARS.T_NON_TYPE_ID:
            if (this._eVarProperty === a.Effect.Var.NOTTRANSLATE) {
                this.pushCode(pNode.sValue);
                return;
            }
            pType = this._pExprType ? (this._pExprType.pEffectType ? this._pExprType.pEffectType : this._pExprType) : null;
            if (this._isTypeAnalayzed) {
                //Проверяем тип
                if (pType.isBase()) {
                    if (
                        this.constructor.pVectorSuffix[pNode.sValue] === null &&
                        (
                            pType.sName === "float2" ||
                            pType.sName === "float3" ||
                            pType.sName === "float4" ||
                            pType.sName === "int2" ||
                            pType.sName === "int3" ||
                            pType.sName === "int4"
                            )
                        ) {
                        sTypeName = "";
                        if (pType.sName === "float2" ||
                            pType.sName === "float3" ||
                            pType.sName === "float4") {
                            sTypeName = "float";
                        }
                        else {
                            sTypeName = "int";
                        }
                        sTypeName += pNode.sValue.length === 1 ? "" : pNode.sValue.length;
                        this._pExprType = this.hasType(sTypeName);
                        pRes = pNode.sValue;
                    }
                }
                else {
                    pVar = pType.pDesc.hasField(pNode.sValue);
                    if (!pVar) {
                        error("Return type is not enough cool for you.");
                        return;
                    }
                    this._pLastVar = pVar;
                    this._pExprType = pVar.pType;
                    if (this._pExprType.pEffectType.iScope === a.fx.GLOBAL_VARS.GLOBAL &&
                        (this._eFuncProperty === a.Effect.Func.FUNCTION ||
                         ((this._eFuncProperty === a.Effect.Func.VERTEX ||
                           this._eFuncProperty === a.Effect.Func.FRAGMENT) &&
                          this._pCurrentFunction.pFunction.pImplement === null))) {
                        pFunction.addType(this._pExprType.pEffectType);
                    }
                    if (pVar.isMixible) {
                        if (this._eVarProperty === a.Effect.Var.PARAMSTART) {
                            if (this._eFuncProperty === a.Effect.Func.VERTEX) {
                                pRes = pFunction._pAttrSemantics[pVar.sSemantic];
                            }
                            else if (this._eFuncProperty === a.Effect.Func.FRAGMENT) {
                                pRes = pFunction._pVaryingsSemantics[pVar.sSemantic];
                            }
                            this._eVarProperty = a.Effect.Var.PARAM;
                        }
                        else {
                            pRes = pVar.sSemantic;
                        }
                    }
                    else {
                        pRes = pNode.sValue;
                    }
                }
            }
            else if ((this._sVarName === "" && this._isNewName) || !this._isNewName) {
                isNewVar = false;
                if (!this._isNewName) {
                    this.newVarName();
                    isNewVar = true;
                }
                if (this._sVarName && this._sVarName.length > 0) {
                    error("Oh-no");
                    return;
                }

                this._sVarName = pNode.sValue;
                if (this._sVarName === a.fx.GLOBAL_VARS.SYSTEMVAR) {
                    if (!this._pCurrentPass) {
                        error("'engine' variable available only in pass");
                        return;
                    }
                    this._eVarProperty = a.Effect.Var.NOTTRANSLATE;
                    pRes = this._sVarName;
                    this._pExprType = a.fx.GLOBAL_VARS.UNDEFINEDTYPE;
                }
                else {
                    pRes = this.hasVariable(this._sVarName);
                    if (!pRes) {
                        error("not good for you " + this._sVarName);
                        return;
                    }
                    if (pRes.pType.isEqual(this.hasType("video_buffer")) &&
                        pRes.iScope === a.fx.GLOBAL_VARS.GLOBAL &&
                        this._eFuncProperty !== a.Effect.Func.DEFAULT) {
                        pFunction.addGlobalBuffer(pRes);
                    }
//                    if (pRes.isPointer !== false) {
//                        if (this._eFuncProperty === a.Effect.Func.VERTEX && pRes.iScope === pFunction.iScope) {
//                            pFunction.addAttributeIndex(pRes);
//                        }
//                    }
                    if (pRes.isVertexOnly) {
                        if (this._eFuncProperty === a.Effect.Func.FRAGMENT) {
                            error("You try use global variable for vertex shader in pixel shader");
                            return;
                        }
                        else if (this._eFuncProperty === a.Effect.Func.FUNCTION) {
                            pFunction.isVertexOnly = true;
                        }
                    }
                    else if (pRes.isFragmentOnly) {
                        if (this._eFuncProperty === a.Effect.Func.VERTEX) {
                            error("You try use global variable for vertex shader in pixel shader");
                            return;
                        }
                        else if (this._eFuncProperty === a.Effect.Func.FUNCTION) {
                            pFunction.isFragmentOnly = true;
                        }
                    }
                    this._pLastVar = pRes;
                    pRes.isUsed = true;
                    if (pRes.isGlobal && (this._eFuncProperty === a.Effect.Func.FUNCTION ||
                                          ((this._eFuncProperty === a.Effect.Func.VERTEX ||
                                            this._eFuncProperty === a.Effect.Func.FRAGMENT) &&
                                           pFunction.pFunction.pImplement === null))) {
                        pFunction.addExternal(pRes);
                    }
                    if (this._isWriteVar === true) {
                        if (pRes.isUniform) {
                            trace(pRes);
                            error("don`t even try to do this, bitch.1");
                            return;
                        }
                        if (pRes.isConst()) {
                            error("don`t even try to do this, bitch.2");
                            return;
                        }
                        if (pRes.isParametr && pFunction &&
                            (pFunction.isVertexShader || pFunction.isFragmentShader) && this._nAddr === 0) {
                            error("don`t even try to do this, bitch.3");
                            return;
                        }
                        if (pFunction && pFunction.iScope === pRes.iScope && (pRes.isInput() && !pRes.isOutput())) {
                            error("don`t even try to do this, bitch.3");
                        }
                    }
                    else if (this._isWriteVar === false) {
                        if (pFunction && pFunction.iScope === pRes.iScope && (pRes.isOutput() && !pRes.isInput())) {
                            error("don`t even try to do this, bitch.4");
                            return;
                        }

                    }
                    if (this._eFuncProperty === a.Effect.Func.VERTEX &&
                        pRes === pFunction.pReturnVariable && isNewVar && this._isWriteVar !== null) {
                        pFunction.isLocalOut = true;
                    }
                    if (this._pCurrentPass) {
                        this._pCurrentPass.addGlobalVariable(pRes);
                        this.pushCode("uniformValues.");
                    }
                    if (this._eFuncProperty === a.Effect.Func.VERTEX && pRes.isVSInput) {
                        this._eVarProperty = a.Effect.Var.PARAMSTART;
                        this._pExprType = pRes.pType;
                        if (isNewVar) {
                            this.endVarName();
                            isNewVar = false;
                            if (!pFunction.pTwin) {
                                pFunction.createTwinIn();
                            }
                            this._eVarProperty = a.Effect.Var.DEFAULT;
                            this.pushCode(pFunction.pTwin);
                            break;
                        }
                    }
                    if (this._eFuncProperty === a.Effect.Func.FRAGMENT && pRes.isFSInput) {
                        this._eVarProperty = a.Effect.Var.PARAMSTART;
                        this._pExprType = pRes.pType;
                        if (isNewVar) {
                            this.endVarName();
                            isNewVar = false;
                            if (!pFunction.pTwin) {
                                pFunction.createTwinIn();
                            }
                            this._eVarProperty = a.Effect.Var.DEFAULT;
                            this.pushCode(pFunction.pTwin);
                            break;
                        }
                    }

                    if (pFunction && !pRes.isConst()) {
                        if (pRes.iScope === a.fx.GLOBAL_VARS.GLOBAL &&
                            (this._eFuncProperty === a.Effect.Func.FUNCTION ||
                             ((this._eFuncProperty === a.Effect.Func.VERTEX ||
                               this._eFuncProperty === a.Effect.Func.FRAGMENT) &&
                              pFunction.pFunction.pImplement === null))) {
                            if (this._isWriteVar === true) {
                                pFunction.addGlobalVariable(pRes);
                            }
                            else {
                                pFunction.addUniform(pRes);
                            }
                        }
                        pFunction.isConstant = false;
                    }
                    this._pExprType = pRes.pType;
                    if (this._pExprType.pEffectType.iScope === a.fx.GLOBAL_VARS.GLOBAL &&
                        (this._eFuncProperty === a.Effect.Func.FUNCTION ||
                         ((this._eFuncProperty === a.Effect.Func.VERTEX ||
                           this._eFuncProperty === a.Effect.Func.FRAGMENT) &&
                          this._pCurrentFunction.pFunction.pImplement === null))) {
                        pFunction.addType(this._pExprType.pEffectType);
                    }
                    if (isNewVar) {
                        this.endVarName();
                        isNewVar = false;
                    }
                }
            }
            else {
                if (
                    this.constructor.pVectorSuffix[pNode.sValue] === null &&
                    (
                        pType.sName === "float2" ||
                        pType.sName === "float3" ||
                        pType.sName === "float4" ||
                        pType.sName === "int2" ||
                        pType.sName === "int3" ||
                        pType.sName === "int4"
                        )
                    ) {
                    pRes = pNode.sValue;
                    sTypeName = "";
                    if (pType.sName === "float2" ||
                        pType.sName === "float3" ||
                        pType.sName === "float4") {
                        sTypeName = "float";
                    }
                    else {
                        sTypeName = "int";
                    }
                    sTypeName += pNode.sValue.length === 1 ? "" : pNode.sValue.length;
                    this._pExprType = this.hasType(sTypeName);
                }
                else {
                    this._sVarName += pNode.sValue;
                    pRes = this.hasComplexVariable(this._sVarName);
                    if (!pRes) {
                        error("Not this variable " + this._sVarName);
                        return;
                    }
//                    if (pRes.isPointer !== false) {
//                        if (this._eFuncProperty === a.Effect.Func.VERTEX && pRes.iScope === pFunction.iScope) {
//                            pFunction.addAttributeIndex(pRes);
//                        }
//                    }
                    this._pLastVar = pRes;
                    pRes.isUsed = true;
                    this._pExprType = pRes.pType;

                    if (this._eVarProperty === a.Effect.Var.PARAMSTART) {
                        if (this._eFuncProperty === a.Effect.Func.VERTEX) {
                            pRes = pFunction._pAttrSemantics[pRes.sName];
                        }
                        else if (this._eFuncProperty === a.Effect.Func.FRAGMENT) {
                            pRes = pFunction._pVaryingsSemantics[pRes.sName];
                        }
                        this._eVarProperty = a.Effect.Var.PARAM;
                        pRes.isUsed = true;
                        this._pExprType = pRes.pType;
                    }
                    else {
                        pRes = pRes.sName;
                    }
                    if (this._pExprType.pEffectType.iScope === a.fx.GLOBAL_VARS.GLOBAL &&
                        (this._eFuncProperty === a.Effect.Func.FUNCTION ||
                         ((this._eFuncProperty === a.Effect.Func.VERTEX ||
                           this._eFuncProperty === a.Effect.Func.FRAGMENT) &&
                          this._pCurrentFunction.pFunction.pImplement === null))) {
                        pFunction.addType(this._pExprType.pEffectType);
                    }
                }
            }
            if (!pRes) {
                error("Unknown ID: " + pNode.sValue);
                return;
            }
            this.pushCode(pRes);
            break;

        case a.fx.GLOBAL_VARS.T_STRING:
        case a.fx.GLOBAL_VARS.T_UINT:
        case a.fx.GLOBAL_VARS.T_FLOAT:
        case a.fx.GLOBAL_VARS.T_KW_TRUE:
        case a.fx.GLOBAL_VARS.T_KW_FALSE:
            this.pushCode(pNode.sValue);
            if (sName === a.fx.GLOBAL_VARS.T_STRING) {
                this._pExprType = this.hasType("string");
            }
            else if (sName === a.fx.GLOBAL_VARS.T_UINT) {
                this._pExprType = this.hasType("int");
            }
            else if (sName === a.fx.GLOBAL_VARS.T_FLOAT) {
                this._pExprType = this.hasType("float");
            }
            else {
                this._pExprType = this.hasType("bool");
            }
            break;
        case a.fx.GLOBAL_VARS.MEMEXPR:
            return this.analyzeMemExpr(pNode);
    }
};
Effect.prototype.analyzeConstTypeDim = function (pNode) {
    var pChildren = pNode.pChildren;
    var pType;
    //GLSL compatibility
    if (pChildren.length > 1) {
        error("Bad type casting");
        return;
    }
    pType = this.convertType(pChildren[0]);
    if (!this.isBaseType(pType.sName)) {
        error("Don`t suppot so typecasting in webgl");
        return;
    }
    this.pushCode(pType);
    this._pExprType = pType;
};
Effect.prototype.analyzeTypeDecl = function (pNode) {
    var pChildren = pNode.pChildren;
    var pType = new EffectType();
    if (pChildren.length === 2) {
        //TypeDecl : StructDecl ';'
        pType.fromStruct(this.analyzeStructDecl(pChildren[1]));
    }
    this.addType(pType);
    pNode.pAnalyzed = pType;
    if (this.isCodeWrite()) {
        this.pushCode(pType);
        this.pushCode(";");
    }
};
Effect.prototype.analyzeStructDecl = function (pNode, pStruct) {
    pStruct = pStruct || new EffectStruct();
    var pChildren = pNode.pChildren;
    pStruct.sName = pChildren[pChildren.length - 2].sValue;
    if (this.hasType(pStruct.sName)) {
        error("Very bad... You try to redefinition type(");
        return;
    }
    this.newStruct();
    var i;
    for (i = pChildren.length - 4; i >= 1; i--) {
        if (pChildren[i].sName === a.fx.GLOBAL_VARS.VARIABLEDECL) {
            this.analyzeVariableDecl(pChildren[i]);
        }
    }
    pStruct.pFields = this._pCurrentStructFields;
    pStruct.pOrders = this._pCurrentStructOrders;
    pStruct._canMixible = this._isCurrentStructMixible;
    this.endStruct();
    return pStruct;
};
Effect.prototype.analyzeStruct = function (pNode) {
    if (this._isStruct) {
        error("Embedded struct definition");
        return;
    }
    var pStruct = new EffectStruct();
    var pChildren = pNode.pChildren;
    pStruct.sName = statics.sTempStructName + this._nTempStruct;
    this._nTempStruct++;
    this.newStruct();
    var i;
    for (i = pChildren.length - 4; i >= 1; i--) {
        if (pChildren[i].sName === a.fx.GLOBAL_VARS.VARIABLEDECL) {
            this.analyzeVariableDecl(pChildren[i]);
        }
    }
    pStruct.pFields = this._pCurrentStructFields;
    pStruct.pOrders = this._pCurrentStructOrders;
    pStruct._canMixible = this._isCurrentStructMixible;
    this.endStruct();
    var pType = new EffectType();
    pType.fromStruct(pStruct);
    this.addType(pType);
    pNode.pAnalyzed = pType;
    if (this.isCodeWrite()) {
        this.pushCode(pType);
        this.pushCode(";");
    }
    return pType;
};
Effect.prototype.analyzeFunctionDecl = function (pNode) {
    var pChildren = pNode.pChildren;
    var pFunction;
    if (this.nStep === 1) {
        pFunction = this.analyzeFunctionDef(pChildren[pChildren.length - 1]);

        if (pChildren[0].sValue !== ";") {
            pFunction.pImplement = true;
        }
        else {
            pNode.pAnalyzed = true;
            return;
        }
        var pFunc = this._hasFunctionDecl(pFunction.hash());

        if (pFunc) {
            error("You try to redifinition function! Not good!");
            return;
        }
        this.addFunction(pFunction);
    }
    else {
        pFunction = this.analyzeFunctionDef(pChildren[pChildren.length - 1]);
        var pType = pFunction.pReturnType;
        var pEffectType = pType.pEffectType;
        this._eFuncProperty = a.Effect.Func.FUNCTION;
        this._pCurrentFunction = pFunction;
        this.newScope();
        pFunction.iScope = this._iScope;
        pFunction.pScopeStack = [this._iScope];
        var i, j;
        for (i in pFunction.pParameters) {
            this.addVariable(pFunction.pParameters[i], true);
        }
        if (pChildren.length === 3) {
            this.analyzeAnnotation(pChildren[1], pFunction);
        }
        try {
            this.newCode();
            this.analyzeStmtBlock(pChildren[0]);
            pFunction.setImplement(this._pCode);
            this.endCode();
        }
        catch (e) {
            if (e === a.fx.GLOBAL_VARS.ERRORBADFUNCTION) {
                while (this._iScope !== pFunction.iScope) {
                    this.endScope();
                }
                warning("Bad function: " + pFunction.sName);
                pFunction.pImplement = null;
                this._pCodeStack = [];
                this._pCode = null;
                this._nAddr = 0;
                this._isWriteVar = false;
                this._isNewName = false;
                this._isNewComplexName = false;
                this.addFunctionToBlackList(pFunction);
            }
            else {
                throw e;
            }
        }
        if (pFunction.isVertexShader) {
            if (!pFunction.checkMe(a.fx.GLOBAL_VARS.VERTEXUSAGE)) {
                error("Vertex is not vertex enough");
            }

            this._eFuncProperty = a.Effect.Func.VERTEX;
            pFunction.pShader = new EffectVertex(pFunction);
            pFunction.pShader.iScope = this._iScope;
            pFunction.pShader.pScopeStack = [this._iScope];
            this._pCurrentFunction = pFunction.pShader;
            var sName, pAttr, pVar, pOrders;
            for (i = 0; pFunction.pParamOrders && i < pFunction.pParamOrders.length; i++) {
                if (pFunction.pParamOrders[i].isUniform === false) {
                    pFunction.pShader.addAttribute(pFunction.pParamOrders[i], this);
                }
                else {
                    pFunction.pShader.addUniform(pFunction.pParamOrders[i]);
                }
            }
            //Add Varyings
            if (pType.isStruct()) {
                var pVars = pEffectType.pDesc.pOrders;
                for (i = 0; i < pVars.length; i++) {
                    if (pVars[i].sSemantic !== "POSITION" && pVars[i].sSemantic !== "PSIZE") {
                        pFunction.pShader.addVarying(pVars[i]);
                    }
                }
                pFunction.pShader.createReturnVar(pFunction.pReturnType);
            }
            this.newCode();
            this.analyzeStmtBlock(pChildren[0]);
            pFunction.pShader.setImplement(this._pCode);
            this.endCode();
            if (this._pShaders[pFunction.hash()]) {
                error("Blyat`");
                return;
            }
            this._pShaders[pFunction.hash()] = pFunction.pShader;
            for (i = 0; pFunction.pParamOrders && i < pFunction.pParamOrders.length; i++) {
                if (pFunction.pParamOrders[i].isUniform === false) {
                    pFunction.pShader.setAttributeUsed(pFunction.pParamOrders[i], this);
                }
            }
        }
        else if (pFunction.isFragmentShader) {
            if (!pFunction.checkMe(a.fx.GLOBAL_VARS.FRAGMENTUSAGE)) {
                error("Pixel is not pixel enough");
            }

            this._eFuncProperty = a.Effect.Func.FRAGMENT;
            pFunction.pShader = new EffectFragment(pFunction);
            pFunction.pShader.iScope = this._iScope;
            pFunction.pShader.pScopeStack = [this._iScope];
            this._pCurrentFunction = pFunction.pShader;
            for (i = 0; pFunction.pParamOrders && i < pFunction.pParamOrders.length; i++) {
                if (pFunction.pParamOrders[i].isUniform === false) {
                    pFunction.pShader.addVarying(pFunction.pParamOrders[i]);
                }
                else {
                    pFunction.pShader.addUniform(pFunction.pParamOrders[i]);
                }
            }
            this.newCode();
            this.analyzeStmtBlock(pChildren[0]);
            pFunction.pShader.setImplement(this._pCode);
            this.endCode();
            if (this._pShaders[pFunction.hash()]) {
                error("Blyat` 2");
                return;
            }
            this._pShaders[pFunction.hash()] = pFunction.pShader;
        }
        this.endScope();
        this._eVarProperty = a.Effect.Func.DEFAULT;
        this._pCurrentFunction = null;
    }
//    this.endFunction();
};
Effect.prototype.analyzeFunctionDef = function (pNode, pFunction) {
    if (pNode.pAnalyzed !== undefined) {
        return pNode.pAnalyzed;
    }
    pFunction = pFunction || new EffectFunction();
    var pChildren = pNode.pChildren;
    pFunction.pReturnType = this.analyzeUsageType(pChildren[pChildren.length - 1]);
    pFunction.setName(pChildren[pChildren.length - 2].sValue);
    if (pChildren[0].sName === a.fx.GLOBAL_VARS.SEMANTIC) {
        pFunction.addSemantic(pChildren[0].pChildren[0].sValue);
        this.analyzeParamList(pChildren[1], pFunction);
    }
    else {
        this.analyzeParamList(pChildren[0], pFunction);
    }
    pFunction.calcHash();
    pNode.pAnalyzed = pFunction;
    return pFunction;
};
Effect.prototype.analyzeStmtBlock = function (pNode) {
    var pChildren = pNode.pChildren;
    var i;
    this.newScope();
    this.pushCode("{");
    for (i = pChildren.length - 2; i >= 1; i--) {
        this.analyzeStmt(pChildren[i]);
    }
    this.pushCode("}");
    this.endScope();
};
Effect.prototype.analyzeStmt = function (pNode) {
    var pChildren = pNode.pChildren;
    if (pChildren.length === 1) {
        this.analyzeSimpleStmt(pChildren[0]);
    }
    else if (pChildren[pChildren.length - 1].sValue === a.fx.GLOBAL_VARS.T_KW_WHILE) {
        //Stmt : T_KW_WHILE '(' Expr ')' Stmt
        this.pushCode("while");
        this.pushCode("(");
        this.analyzeExpr(pChildren[2]);
        this.pushCode(")");
        this.analyzeStmt(pChildren[0]);
    }
    else if (pChildren[pChildren.length - 1].sValue === a.fx.GLOBAL_VARS.T_KW_FOR) {
        //Stmt : For '(' ForInit ForCond ForStep ')' Stmt
        this.pushCode("for");
        this.pushCode("(");
        this.newScope();
        this.analyzeForInit(pChildren[4]);
        this.analyzeForCond(pChildren[3]);
        this.analyzeForStep(pChildren[2]);
        this.pushCode(")");
        this.analyzeStmt(pChildren[0]);
        this.endScope();
    }
    else if (pChildren[pChildren.length - 1].sValue === a.fx.GLOBAL_VARS.T_KW_IF && pChildren.length === 5) {
        //Stmt : T_KW_IF '(' Expr ')' Stmt
        this.pushCode("if");
        this.pushCode("(");
        this.analyzeExpr(pChildren[2]);
        this.pushCode(")");
        this.analyzeStmt(pChildren[0]);

    }
    else {
        //Stmt : T_KW_IF '(' Expr ')' NonIfStmt T_KW_ELSE Stmt
        this.pushCode("if");
        this.pushCode("(");
        this.analyzeExpr(pChildren[4]);
        this.pushCode(")");
        this.analyzeNonIfStmt(pChildren[2]);
        this.pushCode("else ");
        this.analyzeStmt(pChildren[0]);
    }
};
Effect.prototype.analyzeForInit = function (pNode) {
    pNode = pNode.pChildren[pNode.pChildren.length - 1];
    var pChildren = pNode.pChildren;
    if (pNode.sName !== a.fx.GLOBAL_VARS.VARIABLEDECL) {
        error("Sorry but webgl support only for-init-statement with variableDecl");
        return;
    }
    if (pChildren.length > 3) {
        error("Sorry but webgl support only for-init-statement with variableDecl");
        return;
    }
    this.analyzeVariableDecl(pNode);
};
Effect.prototype.analyzeForCond = function (pNode) {
    pNode = pNode.pChildren[pNode.pChildren.length - 1];
    if (pNode.sName !== a.fx.GLOBAL_VARS.RELATIONALEXPR || pNode.sName !== a.fx.GLOBAL_VARS.EQUALITYEXPR) {
        error("Something going wrong...in for cond");
        return;
    }
    this.analyzeExpr(pNode);
};
Effect.prototype.analyzeForStep = function (pNode) {
    if (pNode.pChildren) {
        pNode = pNode.pChildren[pNode.pChildren.length - 1];
    }
    if (pNode.sName !== a.fx.GLOBAL_VARS.POSTFIXEXPR || pNode.sName !== a.fx.GLOBAL_VARS.ASSIGNMENTEXPR) {
        error("Something going wrong... in for step");
        return;
    }
    this.analyzeExpr(pNode);
};
Effect.prototype.analyzeNonIfStmt = function (pNode) {
    var pChildren = pNode.pChildren;
    var i;
    if (pChildren.length === 1) {
        this.analyzeSimpleStmt(pChildren[0]);
    }
    else if (pChildren[pChildren.length - 1].sValue === a.fx.GLOBAL_VARS.T_KW_WHILE) {
        //Stmt : T_KW_WHILE '(' Expr ')' Stmt
        this.pushCode("while");
        this.pushCode("(");
        this.analyzeExpr(pChildren[2]);
        this.pushCode(")");
        this.analyzeNonIfStmt(pChildren[0]);
    }
    else if (pChildren[pChildren.length - 1].sValue === a.fx.GLOBAL_VARS.T_KW_FOR) {
        //Stmt : For '(' ForInit ForCond ForStep ')' Stmt
        this.pushCode("for");
        this.pushCode("(");
        this.newScope();
        this.analyzeForInit(pChildren[4]);
        this.analyzeForCond(pChildren[3]);
        this.analyzeForStep(pChildren[2]);
        this.pushCode(")");
        this.analyzeNonIfStmt(pChildren[0]);
        this.endScope();
    }
};
Effect.prototype.analyzeSimpleStmt = function (pNode) {
    var pChildren = pNode.pChildren;
    var pFunction = this._pCurrentFunction;
    var pCode;
    var i;
    var isMemRead = false;
    if (pChildren[pChildren.length - 1].sValue === ";") {
        //SimpleStmt : ';' --AN
        return;
    }
    else if (pChildren[pChildren.length - 1].sName === a.fx.GLOBAL_VARS.STMTBLOCK) {
        //SimpleStmt : StmtBlock
        this.analyzeStmtBlock(pChildren[0]);
    }
    else if (pChildren[pChildren.length - 1].sValue === a.fx.GLOBAL_VARS.T_KW_RETURN && pChildren.length === 2) {
        //SimpleStmt : T_KW_RETURN ';'
//        if (this._pCodeVertex || this._pCodeFragment) {
//            error("So sad, but you can`t do this with us.");
//            return;
//        }
        if (!pFunction.pReturnType.isVoid() && this._eFuncProperty === a.Effect.Func.FUNCTION) {
            if (pFunction.isVertexShader || pFunction.isFragmentShader) {
                throw a.fx.GLOBAL_VARS.ERRORBADFUNCTION;
            }
            else {
                error("It`s not JS, baby.");
                return;
            }
        }
        this.pushCode("return");
        this.pushCode(";");
    }
    else if (pChildren[pChildren.length - 1].sValue === a.fx.GLOBAL_VARS.T_KW_RETURN && pChildren.length === 3) {
        //SimpleStmt : T_KW_RETURN Expr ';'
        if (pFunction.pReturnType.isVoid()) {
            error("Can not return anything in void function");
            return;
        }
        if (this._eFuncProperty === a.Effect.Func.FUNCTION) {
            this.pushCode("return ");
            this.analyzeExpr(pChildren[1]);
            this.pushCode(";");
        }
        else if (this._eFuncProperty === a.Effect.Func.VERTEX) {
            if (pFunction.pReturnType.isBase()) {
                this.pushCode(a.fx.GLOBAL_VARS.SHADEROUT);
                this.pushCode(".");
                this.pushCode(pFunction.sSemantic);
                this.pushCode("=");
                this.analyzeExpr(pChildren[1]);
                this.pushCode(";");
                this.pushCode("return;");
            }
            else {
                var isWriteVar;
                this.pushCode("return;");
                this.newCode();
                isWriteVar = this._isWriteVar;
                this._isWriteVar = null;
                this.analyzeExpr(pChildren[1]);
                this._isWriteVar = isWriteVar;
                pCode = this._pCode;
                this.endCode();
                var isFlag = false;
                for (i = 0; i < pCode.length; i++) {
                    if (typeof(pCode[i]) !== "string") {
                        if (isFlag) {
                            error("This return isn`t cool enough to work in vs");
                            return;
                        }
                        if (pCode[i] === pFunction.pReturnVariable) {
                            isFlag = true;
                        }
                        else {
                            error("On no, but you must to return 'Out'");
                            return;
                        }
                    }
                }
            }
        }
        else if (this._eFuncProperty === a.Effect.Func.FRAGMENT) {
            this.pushCode("gl_FragColor=(");
            this.analyzeExpr(pChildren[1]);
            if (!this._pExprType.isEqual(this.hasType("float4"))) {
                error("For fragment shader return type must be float4");
                return;
            }
            this.pushCode(");");
            this.pushCode("return;");
        }
        else {
            error("I don`t now how i get here");
            return;
        }
    }
    else if (pChildren[pChildren.length - 1].sValue === a.fx.GLOBAL_VARS.T_KW_DO) {
        //SimpleStmt : T_KW_DO Stmt T_KW_WHILE '(' Expr ')' ';'
        this.pushCode("do");
        this.analyzeStmt(pChildren[5]);
        this.pushCode("while");
        this.pushCode("(");
        this.analyzeExpr(pChildren[2]);
        this.pushCode(")");
        this.pushCode(";");
    }
    else if (pChildren[pChildren.length - 1].sName === a.fx.GLOBAL_VARS.STATEBLOCK) {
        //SimpleStmt : StmtBlock
        this.analyzeStmtBlock(pChildren[pChildren.length - 1]);
    }
    else if (pChildren[pChildren.length - 1].sValue === a.fx.GLOBAL_VARS.T_KW_DISCARD) {
        //SimpleStmt : T_KW_DISCARD ';'
        if (this._eFuncProperty === a.Effect.Func.VERTEX) {
            error("Discard only for fragment shaders");
            return;
        }
        this._pCurrentFunction.isFragmentOnly = true;
        this.pushCode("discard");
        this.pushCode(";");
    }
    else if (pChildren[pChildren.length - 1].sName === a.fx.GLOBAL_VARS.TYPEDECL) {
        //SimpleStmt : TypeDecl
        this.analyzeTypeDecl(pChildren[0]);
    }
    else if (pChildren[pChildren.length - 1].sName === a.fx.GLOBAL_VARS.VARIABLEDECL) {
        this.newMemRead();
        isMemRead = true;
        //SimpleStmt : VariableDecl
        this.analyzeVariableDecl(pChildren[0]);
    }
    else if (pChildren[pChildren.length - 1].sName === a.fx.GLOBAL_VARS.VARSTRUCTDECL) {
        //SimpleStmt : VarStructDecl
        this.analyzeVarStructDecl(pChildren[0]);
    }
    else {
        this.newMemRead();
        isMemRead = true;
        //SimpleStmt : Expr ';'
        this.analyzeExpr(pChildren[pChildren.length - 1]);
        this.pushCode(";");
    }
    if (isMemRead) {
        var pMemBlock;
        for (i = 0; i < this._pMemReadVars.length; i++) {
            pMemBlock = this._pMemReadVars[i];
            this.pushCode(pMemBlock);
            if (this._eFuncProperty !== a.Effect.Func.DEFAULT) {
                this._getAllPointers(pMemBlock._pVar);
                this._pCurrentFunction.addPointers(pMemBlock._pVar);
            }
            this.pushCode(";");
        }
        this.endMemRead();
    }
};

Effect.prototype.analyzeParamList = function (pNode, pFunction) {
    var pChildren = pNode.pChildren;
    var i;
    var pVar;
    this._isParam = true;
    pFunction.pParameters = {};
    for (i = pChildren.length - 2; i >= 1; i--) {
        if (pChildren[i].sName === a.fx.GLOBAL_VARS.PARAMETERDECL) {
            pVar = this.analyzeParameterDecl(pChildren[i]);
            if (!pVar.checkMe()) {
                error("You sucks 2");
                return;
            }
            pFunction.addParameter(pVar);
        }
    }
    this._isParam = false;
    return pFunction;
};
Effect.prototype.analyzeParameterDecl = function (pNode) {
    var pChildren = pNode.pChildren;
    var pVar = new EffectVariable();
    pVar.setType(this.analyzeParamUsageType(pChildren[1]));
    if (!pVar.pType.checkMe(a.fx.GLOBAL_VARS.PARAMETRUSAGE)) {
        error("You sucks 2");
        return;
    }
    pVar = this.analyzeVariable(pChildren[0], pVar);
    return pVar;
};
Effect.prototype.analyzeParamUsageType = function (pNode, pType) {
    pType = pType || new VariableType();
    var pChildren = pNode.pChildren;
    var i;
    for (i = pChildren.length - 1; i >= 0; i--) {
        if (pChildren[i].sName === a.fx.GLOBAL_VARS.TYPE) {
            pType.setType(this.convertType(pChildren[i]));
        }
        if (pChildren[i].sName === a.fx.GLOBAL_VARS.PARAMUSAGE) {
            pType.setUsage(pChildren[i].pChildren[0].sValue);
        }
    }
    return pType;
};
Effect.prototype.analyzeVarStructDecl = function (pNode) {
    var pChildren = pNode.pChildren;
    var i;
    var pVar;
    var pType = this.analyzeUsageStructDecl(pChildren[pChildren.length - 1]);
    this._pCurrentType = pType;
    if (this.isCodeWrite()) {
        this.pushCode(pType);
        this.pushCode(";");
    }
    for (i = pChildren.length - 2; i >= 0; i--) {
        if (pChildren[i].sName === a.fx.GLOBAL_VARS.VARIABLE) {
            pVar = this.analyzeVariable(pChildren[i]);
            pVar.setType(pType);
            this.addVariableDecl(pVar);
        }
    }
    this._pCurrentType = null;
    pNode.pAnalyzed = true;
};
Effect.prototype.analyzeUsageStructDecl = function (pNode, pType) {
    pType = pType || new VariableType();
    var pChildren = pNode.pChildren;
    var i;
    for (i = pChildren.length - 1; i >= 1; i--) {
        pType.setUsage(pChildren[i].pChildren[0].sValue);
    }
    var pEffectType = new EffectType();
    pEffectType.fromStruct(this.analyzeStructDecl(pChildren[0]));
    this.addType(pEffectType);
    pType.setType(pEffectType);

    return pType;
};
Effect.prototype.analyzeTechniqueDecl = function (pNode) {
    var pChildren = pNode.pChildren;
    var i = 0;
    var pTech = new EffectTechnique(this);
    pTech.setName(this.analyzeComplexName(pChildren[pChildren.length - 2]));
    if (pChildren[pChildren.length - 2].pChildren.length !== 1) {
        pTech.hasComplexName(true);
    }
    this._pCurrentTechnique = pTech;
    for (i = pChildren.length - 3; i >= 0; i--) {
        if (pChildren[i].sName === a.fx.GLOBAL_VARS.ANNOTATION) {
            this.analyzeAnnotation(pChildren[i], pTech);
        }
        else if (pChildren[i].sName === a.fx.GLOBAL_VARS.SEMANTIC) {
            this.analyzeSemantic(pChildren[i], pTech);
        }
        else {
            this.analyzeTechniqueBody(pChildren[i], pTech);
        }
    }
    this.addTechnique(pTech);
    pNode.pAnalyzed = pTech;
    return pTech;
};
Effect.prototype.addTechnique = function (pTechnique) {
    this.pTechniques[pTechnique.sName] = pTechnique;
};
Effect.prototype.analyzeTechniqueBody = function (pNode, pTechnique) {
    var pChildren = pNode.pChildren;
    var i;
    var pPass;
    for (i = pChildren.length - 2; i >= 1; i--) {
        pPass = this.analyzePassDecl(pChildren[i]);
        if (!pPass) {
            continue;
        }
        if (!pPass.checkMe()) {
            error("something bad with your pass");
        }
        pTechnique.addPass(pPass);
    }
    return pTechnique;
};
Effect.prototype.analyzePassDecl = function (pNode, pPass) {
    var pChildren = pNode.pChildren;
    var i = 0;
    if (pChildren.length === 1) {
        if (pChildren[0].sName === a.fx.GLOBAL_VARS.IMPORTDECL) {
            this.analyzeImportDecl(pChildren[0]);
        }
        return;
    }
    pPass = pPass || new EffectPass();
    if (pChildren[pChildren.length - 2].sName === a.fx.GLOBAL_VARS.T_NON_TYPE_ID ||
        pChildren[pChildren.length - 2].sName === a.fx.GLOBAL_VARS.T_TYPE_ID) {
        pPass.setName(pChildren[pChildren.length - 2].sValue);
    }
    if (pChildren[1].sName === a.fx.GLOBAL_VARS.ANNOTATION) {
        this.analyzeAnnotation(pChildren[1], pPass);
    }
    this._pCurrentPass = pPass;
    this.analyzePassStateBlock(pChildren[0], pPass);
    this._pCurrentPass = null;
    pPass.finalize();
    return pPass;
};
Effect.prototype.analyzePassStateBlock = function (pNode, pPass) {
    var pChildren = pNode.pChildren;
    var i;
//    if (pPass.isComplex) {
    pPass.pushCode("{");
//    }
    for (i = pChildren.length - 2; i >= 1; i--) {
        this.analyzePassState(pChildren[i], pPass);
    }
//    if (pPass.isComplex) {
    pPass.pushCode("}");
//    }
};
Effect.prototype.analyzePassState = function (pNode, pPass) {
    var pChildren = pNode.pChildren;
    var i;
    var eState = null;
    if (pChildren.length === 1) {
        if (pChildren[0].sName === a.fx.GLOBAL_VARS.STATEIF) {
            this.analyzeStateIf(pChildren[0], pPass);
        }
        else {
            this.analyzeStateSwitch(pChildren[0], pPass)
        }
        return;
    }
    if (pChildren[pChildren.length - 2].sName === a.fx.GLOBAL_VARS.STATEINDEX) {
        error("don`t very bad for state");
        return;
    }
    var pStateExpr = pChildren[pChildren.length - 3];
    var pExpr = pStateExpr.pChildren[pStateExpr.pChildren.length - 1];
    var sType = pChildren[pChildren.length - 1].sValue.toUpperCase();
    var isVertex = false;
    var isPixel = false;

    switch (sType) {
        case 'ZENABLE':
            eState = a.renderStateType.ZENABLE;
            break;
        case 'ZWRITEENABLE':
            eState = a.renderStateType.ZWRITEENABLE;
            break;
        case 'SRCBLEND':
            eState = a.renderStateType.SRCBLEND;
            break;
        case 'DESTBLEND':
            eState = a.renderStateType.DESTBLEND;
            break;
        case 'CULLMODE':
            eState = a.renderStateType.CULLMODE;
            break;
        case 'ZFUNC':
            eState = a.renderStateType.ZFUNC;
            break;
        case 'DITHERENABLE':
            eState = a.renderStateType.DITHERENABLE;
            break;
        case 'ALPHABLENDENABLE':
            eState = a.renderStateType.ALPHABLENDENABLE;
            break;
        case 'ALPHATESTENABLE':
            eState = a.renderStateType.ALPHATESTENABLE;
            break;
        case 'VERTEXSHADER':
            isVertex = true;
            break;
        case 'PIXELSHADER' :
            isPixel = true;
            break;
        default:
            error('Unsupported render state type used: ' + sType + '. WebGl...');
            eState = null;
            return pPass;
    }
    if (isVertex || isPixel) {
        if (pExpr.sName !== a.fx.GLOBAL_VARS.OBJECTEXPR) {
            error("Bad compile state. I don`t know what bad, but something exactly going wrong.");
            return;
        }
        var pFunc = this.analyzeExpr(pExpr);
        var pParam;
        var isInput = undefined;
        if (isVertex) {
            pPass.setJSVertexShader(pFunc);
            pFunc.isVertexShader = true;
            for (i = 0; pFunc.pParamOrders && i < pFunc.pParamOrders.length; i++) {
                pParam = pFunc.pParamOrders[i];
                if (!pParam.sSemantic && pParam.isUniform === false) {
                    if (isInput === false) {
                        error("You cannot use attribute in struct and attrib as paramters");
                        return;
                    }
                    isInput = true;
                    pParam.setVSInput();
                    pFunc.pMainInputVar = pParam;
                }
                else if (pParam.sSemantic && pParam.isUniform === false) {
                    if (isInput === true) {
                        error("You cannot use attribute in struct and attrib as paramters");
                        return;
                    }
                    isInput = false;
                }
                if (pParam.isUniform === false) {
                    pParam.setMixible();
                }
            }
            if (pFunc.pReturnType.pEffectType.pDesc) {
                pFunc.pReturnType.setMixible();
            }
        }
        else {
            pPass.setJSFragmentShader(pFunc);
            pFunc.isFragmentShader = true;
            isInput = null;
            for (i = 0; pFunc.pParamOrders && i < pFunc.pParamOrders.length; i++) {
                pParam = pFunc.pParamOrders[i];
                if (pParam.isUniform === false) {
                    if (isInput === true) {
                        error("You should put all varyings in one struct");
                        return;
                    }
                    else if (!pParam.sSemantic) {
                        if (isInput === false) {
                            error("If you use varyings as params do it honest");
                            return;
                        }
                        isInput = true;
                        pParam.setFSInput();
                        pParam.setMixible();
                        pFunc.pMainInputVar = pParam;
                    }
                    else {
                        if (isInput === true) {
                            error("If you use varyings as struct do it honest");
                            return;
                        }
                        if (!pParam.pType.isBase()) {
                            error("For varyings only base types are availeable");
                            return;
                        }
                        isInput = false;
                    }
                }
            }
        }
        return pPass;
    }
    if (pExpr.sValue === "{" || pExpr.sValue === "<" ||
        pExpr.sValue === undefined) {
        error("Too difficult for webgl");
    }
    var sValue = pExpr.sValue.toUpperCase();
    var eValue;
    //function fnRenderStateValueFromString(eState, sValue) {
    switch (eState) {
        case a.renderStateType.ALPHABLENDENABLE:
        case a.renderStateType.ALPHATESTENABLE:
            warning('ALPHABLENDENABLE/ALPHATESTENABLE not supported in WebGL.');
        case a.renderStateType.DITHERENABLE:
        case a.renderStateType.ZENABLE:
        case a.renderStateType.ZWRITEENABLE:
            switch (sValue) {
                case 'TRUE':
                    eValue = true;
                    break;
                case 'FALSE':
                    eValue = false;
                    break;
                default:
                    error('Unsupported render state ALPHABLENDENABLE/ZENABLE/ZWRITEENABLE/DITHERENABLE value used: '
                              + sValue + '.');
                    eValue = null;
            }
            break;
        case a.renderStateType.SRCBLEND:
        case a.renderStateType.DESTBLEND:
            switch (sValue) {
                case 'ZERO':
                    eValue = a.BLEND.ZERO;
                    break;
                case 'ONE':
                    eValue = a.BLEND.ONE;
                    break;
                case 'SRCCOLOR':
                    eValue = a.BLEND.SRCCOLOR;
                    break;
                case 'INVSRCCOLOR':
                    eValue = a.BLEND.INVSRCCOLOR;
                    break;
                case 'SRCALPHA':
                    eValue = a.BLEND.SRCALPHA;
                    break;
                case 'INVSRCALPHA':
                    eValue = a.BLEND.INVSRCALPHA;
                    break;
                case 'DESTALPHA':
                    eValue = a.BLEND.DESTALPHA;
                    break;
                case 'INVDESTALPHA':
                    eValue = a.BLEND.INVDESTALPHA;
                    break;
                case 'DESTCOLOR':
                    eValue = a.BLEND.DESTCOLOR;
                    break;
                case 'INVDESTCOLOR':
                    eValue = a.BLEND.INVDESTCOLOR;
                    break;
                case 'SRCALPHASAT':
                    eValue = a.BLEND.SRCALPHASAT;
                    break;
                default:
                    error('Unsupported render state SRCBLEND/DESTBLEND value used: ' + sValue + '.');
                    eValue = null;
            }
            break;
        case a.renderStateType.CULLMODE:
            switch (sValue) {
                case 'NONE':
                    eValue = a.CULLMODE.NONE;
                    break;
                case 'CW':
                    eValue = a.CULLMODE.CW;
                    break;
                case 'CCW':
                    eValue = a.CULLMODE.CCW;
                    break;
                case 'FRONT_AND_BACK':
                    eValue = a.CULLMODE.FRONT_AND_BACK;
                    break;
                default:
                    error('Unsupported render state SRCBLEND/DESTBLEND value used: ' + sValue + '.');
                    eValue = null;
            }
            break;
        case a.renderStateType.ZFUNC:
            switch (sValue) {
                case 'NEVER':
                    eValue = a.CMPFUNC.NEVER;
                    break;
                case 'LESS':
                    eValue = a.CMPFUNC.LESS;
                    break;
                case 'EQUAL':
                    eValue = a.CMPFUNC.EQUAL;
                    break;
                case 'LESSEQUAL':
                    eValue = a.CMPFUNC.LESSEQUAL;
                    break;
                case 'GREATER':
                    eValue = a.CMPFUNC.GREATER;
                    break;
                case 'NOTEQUAL':
                    eValue = a.CMPFUNC.NOTEQUAL;
                    break;
                case 'GREATEREQUAL':
                    eValue = a.CMPFUNC.GREATEREQUAL;
                    break;
                case 'ALWAYS':
                    eValue = a.CMPFUNC.ALWAYS;
                    break;
                default:
                    error('Unsupported render state ZFUNC value used: ' +
                          sValue + '.');
                    eValue = null;
            }
            break;
    }

    pPass.setJSState(eState, eValue);
    return pPass;
};
Effect.prototype.analyzeStateIf = function (pNode, pPass) {
    var pChildren = pNode.pChildren;
    var pCode;
    var i;
    pPass.isComplex = true;
    pPass.pushCode("if(");
    this.newCode();
    this.analyzeExpr(pChildren[4]);
    pCode = this._pCode;
    this.endCode();
    for (i = 0; i < pCode.length; i++) {
        pPass.pushCode(pCode[i]);
    }
    pPass.pushCode(")");
    this.analyzePassStateBlock(pChildren[2], pPass);
    pPass.pushCode("else");
    if (pChildren[0].sName === a.fx.GLOBAL_VARS.STATEIF) {
        this.analyzeStateIf(pChildren[0], pPass);
    }
    else {
        this.analyzePassStateBlock(pChildren[0], pPass);
    }
};
Effect.prototype.analyzeStateSwitch = function (pNode, pPass) {
    var pChildren = pNode.pChildren;
    var pCode;
    var i;
    pPass.isComplex = true;
    pPass.pushCode("switch(");
    this.newCode();
    this.analyzeExpr(pNode);
    pCode = this._pCode;
    this.endCode();
    for (i = 0; i < pCode.length; i++) {
        pPass.pushCode(pCode[i]);
    }
    pPass.pushCode(")");
    this.analyzeCaseBlock(pChildren[0], pPass);
};
Effect.prototype.analyzeCaseBlock = function (pNode, pPass) {
    var pChildren = pNode.pChildren;
    var i;
    pPass.pushCode("{");
    for (i = 0; i < pChildren.length; i++) {
        if (pChildren[i].sName === a.fx.GLOBAL_VARS.CASESTATE) {
            this.analyzeCaseState(pChildren[i], pPass);
        }
        else {
            this.analyzeDefaultState(pChildren[i], pPass);
        }
    }
    pPass.pushCode("}");
};
Effect.prototype.analyzeCaseState = function (pNode, pPass) {
    var pChildren = pNode.pChildren;
    var pCode;
    var i;
    pPass.pushCode("case ");
    this.newCode();
    this.analyzeExpr(pChildren[pChildren.length - 2]);
    pCode = this._pCode;
    this.endCode();
    for (i = 0; i < pCode.length; i++) {
        pPass.pushCode(pCode[i]);
    }
    pPass.pushCode(":");
    for (i = pChildren.length - 4; i >= 0; i--) {
        if (pChildren[i].sName === a.fx.GLOBAL_VARS.PASSSTATE) {
            this.analyzePassState(pChildren[i], pPass);
        }
        else {
            pPass.pushCode(pChildren[i].sValue);
        }
    }
};
Effect.prototype.analyzeDefaultState = function (pNode, pPass) {
    var pChildren = pNode.pChildren;
    var i;
    pPass.pushCode("default:");
    for (i = pChildren.length - 3; i >= 0; i--) {
        if (pChildren[i].sName === a.fx.GLOBAL_VARS.PASSSTATE) {
            this.analyzePassState(pChildren[i], pPass);
        }
        else {
            pPass.pushCode(pChildren[i].sValue);
        }
    }
};
Effect.prototype.analyzeStateBlock = function (pNode, pVar) {
    var pChildren = pNode.pChildren;
    var i;
    for (i = pChildren.length - 2; i >= 1; i--) {
        this.analyzeState(pChildren[i], pVar);
    }
};
Effect.prototype.analyzeState = function (pNode) {
    var pChildren = pNode.pChildren;
    var i;
    var eState = null;
    if (pChildren[pChildren.length - 2].sName === a.fx.GLOBAL_VARS.STATEINDEX) {
        error("don`t very bad for state");
        return;
    }
    var pStateExpr = pChildren[pChildren.length - 3];
    var pExpr = pStateExpr.pChildren[pStateExpr.pChildren.length - 1];
    var sType = pChildren[pChildren.length - 1].sValue.toUpperCase();
    var isTexture = false;
    switch (sType) {
        case "TEXTURE" :
            isTexture = true;
            break;
        case "ADDRESSU":
            eState = "ADDRESSU";
            break;
        case "ADDRESSV":
            eState = "ADDRESSV";
            break;
        case "ADDRESSW":
            eState = "ADDRESSW";
            break;
        case "BORDERCOLOR":
            eState = "BORDERCOLOR";
            break;
        case "MAGFILTER":
            eState = "MAGFILTER";
            break;
        case "MAXANISOTROPY":
            eState = "MAXANISOTROPY";
            break;
        case "MAXMIPLEVEL":
            eState = "MAXMIPLEVEL";
            break;
        case "MINFILTER":
            eState = "MINFILTER";
            break;
        case "MIPFILTER":
            eState = "MIPFILTER";
            break;
        case "MIPMAPLODBIAS":
            eState = "MIPMAPLODBIAS";
            break;
        default:
            error("Oh no, but it is error " + sType);
            return;
    }
    if (isTexture) {
        var pTexture;
        if (pExpr.sValue === "{" || pExpr.sValue === undefined ||
            pStateExpr.pChildren[1].sName !== a.fx.GLOBAL_VARS.T_NON_TYPE_ID) {
            error("Wrong wrong");
            return;
        }
        pTexture = this.hasVariable(pStateExpr.pChildren[1].sValue);
        pTexture.sRealName = pTexture.sSemantic || pTexture.sRealName;
        if (!pTexture) {
            console.log(pStateExpr);
            error("bad with texture name");
            return;
        }
        this._pCurrentVar.setTexture(pTexture);
        return;
    }
    //TODO: add sampler valid tests
    this._pCurrentVar.setState(eState, pExpr.sValue);
    return;
};
Effect.prototype.analyzeComplexName = function (pNode) {
    var pChildren = pNode.pChildren;
    var sName = "";
    var i;
    for (i = pChildren.length - 1; i >= 0; i--) {
        if (pChildren[i].sValue === undefined) {
            error("something are very bad with you 10");
            return;
        }
        sName += pChildren[i].sValue;
    }
    return sName;
};
Effect.prototype.analyzeShiftOpt = function (pNode) {
    var pChildren = pNode.pChildren;
    var nShift = pChildren[0];
    if (pChildren.length === 2) {
        nShift *= 1;
    }
    else {
        nShift *= -1;
    }
    return nShift;
};
Effect.prototype.analyzeImportDecl = function (pNode) {
    var pChildren = pNode.pChildren;
    var pTech = this._pCurrentTechnique;
    var sName = this.analyzeComplexName(pChildren[pChildren.length - 2]);
    var nShift = 0;
    if (pChildren.length !== 2) {
        nShift = this.analyzeShiftOpt(pChildren[0]);
    }
    var pComponent = this._pRenderer.getComponentByName(sName);
    if (!pComponent) {
        error("You try import not existing component");
        return;
    }
    if (pTech) {
        pTech.addComponent(pComponent, nShift);
    }
    else {
        this.addComponent(pComponent, nShift);
    }
};
Effect.prototype.analyzeProvideDecl = function (pNode) {
    var pChildren = pNode.pChildren;
    if (pChildren.length === 2) {
        this._sProvideNameSpace = this.analyzeComplexName(pChildren[0]);
    }
    else {
        //TODO: add 'provide ... as ...' support
        error("I don`t know what i can doing with 'provide ... as ...'");
        return;
    }
};

A_NAMESPACE(Effect, fx);