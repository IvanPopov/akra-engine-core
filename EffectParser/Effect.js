/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
Define(a.Effect.TEXT, 10);
Define(a.Effect.BINARY, 11);

function loadEffectFile(sSource, iType) {
    if (iType === a.Effect.TEXT) {
        a.EffectParser.parse(sSource);
        var pTree = a.EffectParser.pSyntaxTree;
        var pTable = a.EffectParser.pSymbolTable;
        if (pRootNode instanceof a.EffectParser.Node) {
            var pEffect = new Effect();
            pEffect.initFromTree(pRootNode);
            return pEffect;
        }
        return pRootNode;
    }
    else {
        //TODO
        //load from binary
    }
}
;
//Define(VARDECL, "VariableDecl");
//Define(TYPEDECL, "TypeDecl");
//Define(STRUCTDECL, "VarStructDecl");
//Define(FUNCDECL, "FunctionDecl");
//Define(TECHDECL, "TechniqueDecl");
//Define(USAGES, "Usages");
//Define(TYPE, "Type");
//Define(VARIABLE, "Variable");
var VARIABLEDECL = "VariableDecl";
var TYPEDECL = "TypeDecl";
var VARSTRUCTDECL = "VarStructDecl";
var FUNCTIONDECL = "FunctionDecl";
var TECHIQUEDECL = "TechniqueDecl";
var USAGE = "Usages";
var TYPE = "EffectType";
var VARIABLE = "EffectVariable";
var SEMANTIC = "Semantic";
var ANNOTATION = "Annotation";
var INITIALIZER = "Initializer";
var CONST = "const";
var ROW_MAJOR = "row_major";
var COLUMN_MAJOR = "column_major";
var UNIFORM = "uniform";
var STATIC = "static";
var SHARED = "shared";
var EXTERN = "extern";
var INLINE = "inline";

var T_KW_STATIC = "static"
var T_KW_UNIFORM = "uniform"
var T_KW_EXTERN = "extern"
var T_KW_VOLATILE = "volatile"
var T_KW_INLINE = "inline"
var T_KW_SHARED = "shared"
var T_KW_CONST = "const"
var T_KW_ROW_MAJOR = "row_major"
var T_KW_COLUMN_MAJOR = "column_major"
var T_KW_TYPEDEF = "typedef"
var T_KW_STRUCT = "struct"
var T_KW_VOID = "void"
var T_KW_BOOL = "bool"
var T_KW_INT = "int"
var T_KW_HALF = "half"
var T_KW_FLOAT = "float"
var T_KW_DOUBLE = "double"
var T_KW_VECTOR = "vector"
var T_KW_MATRIX = "matrix"
var T_KW_STRING = "string"
var T_KW_TEXTURE = "texture"
var T_KW_TEXTURE1D = "texture1D"
var T_KW_TEXTURE2D = "texture2D"
var T_KW_TEXTURE3D = "texture3D"
var T_KW_TEXTURECUBE = "texturecube"
var T_KW_SAMPLER = "sampler"
var T_KW_SAMPLER1D = "sampler1D"
var T_KW_SAMPLER2D = "sampler2D"
var T_KW_SAMPLER3D = "sampler3D"
var T_KW_SAMPLERCUBE = "samplercube"
var T_KW_PIXELSHADER = "pixelshader"
var T_KW_VERTEXSHADER = "vertexshader"
var T_KW_PIXELFRAGMENT = "pixelfragment"
var T_KW_VERTEXFRAGMENT = "vertexfragment"
var T_KW_STATEBLOCK = "stateblock"
var T_KW_STATEBLOCK_STATE = "stateblock_state"
var T_KW_COMPILE_FRAGMENT = "compile_fragment"
var T_KW_REGISTER = "register"
var T_KW_COMPILE = "compile"
var T_KW_SAMPLER_STATE = "sampler_state"

var SIMPLEEXPR = "SimpleExpr";
var CONSTANTEXPR = "ConstantExpr";
var COMPLEXEXPR = "ComplexExpr";
var OBJECTEXPR = "ObjectExpr";
var PRIMARYEXPR = "PrimaryExpr";
var POSTFIXEXPR = "PostfixExpr";
var UNARYEXPR = "UnaryExpr";
var CASTEXPR = "CastExpr";
var MULEXPR = "MulExpr";
var ADDEXPR = "AddExpr";
var RELATIONALEXPR = "RelationalExpr";
var EQUALITYEXPR = "EqualityExpr";
var ANDEXPR = "AndExpr";
var OREXPR = "OrExpr";
var CONDITIONALEXPR = "ConditionalExpr";
var ASSIGNMENTEXPR = "AssignmentExpr";
var BASETYPE = "BaseType";

var STMTBLOCK = "StmtBlock";

var CONSTTYPEDIM = "ConstTypeDim";
var SCALARTYPE = "ScalarType";
var VECTORTYPE = "VectorType";
var MATRIXTYPE = "MatrixType";
var OBJECTTYPE = "ObjectType";

var T_NON_TYPE_ID = "T_NON_TYPE_ID";
var T_TYPE_ID = "T_TYPE_ID";
var T_STRING = "T_STRING";
var T_FLOAT = "T_FLOAT";
var T_UINT = "T_UINT";
var T_KW_TRUE = "T_KW_TRUE";
var T_KW_FALSE = "T_KW_FALSE";

var GLOBAL = 0;

var STRUCT = 10;

var PROGRAM = "Program"
var DECLS = "Decls"
var DECL = "Decl"
var USAGES = "Usages"
var USAGE = "Usage"
var CONSTUSAGES = "ConstUsages"
var CONSTUSAGE = "ConstUsage"
var USAGETYPE = "UsageType"
var USAGESTRUCTDECL = "UsageStructDecl"
var TYPEDECL = "TypeDecl"
var TYPEDEFS = "TypeDefs"
var TYPE = "Type"
var CONSTTYPE = "ConstType"
var CONSTTYPEDIM = "ConstTypeDim"
var BASETYPE = "BaseType"
var SCALARTYPE = "ScalarType"
var VECTORTYPE = "VectorType"
var MATRIXTYPE = "MatrixType"
var OBJECTTYPE = "ObjectType"
var STRUCT = "Struct"
var STRUCTDECL = "StructDecl"
var CONSTSTRUCTDECL = "ConstStructDecl"
var STRUCTBEGIN = "StructBegin"
var STRUCTDECLS = "StructDecls"
var STRUCTEND = "StructEnd"
var SEMANTIC = "Semantic"
var SEMANTICS = "Semantics"
var SEMANTICSOPT = "SemanticsOpt"
var REGISTER = "Register"
var ANNOTATION = "Annotation"
var ANNOTATIONOPT = "AnnotationOpt"
var ANNOTATIONBEGIN = "AnnotationBegin"
var ANNOTATIONDECLS = "AnnotationDecls"
var ANNOTATIONEND = "AnnotationEnd"
var INITIALIZER = "Initializer"
var INITIALIZEROPT = "InitializerOpt"
var VARIABLEDECL = "VariableDecl"
var VARSTRUCTDECL = "VarStructDecl"
var VARIABLES = "Variables"
var VARIABLE = "Variable"
var VARIABLEDIM = "VariableDim"
var FUNCTIONDECL = "FunctionDecl"
var FUNCTIONDEF = "FunctionDef"
var PARAMLIST = "ParamList"
var PARAMLISTBEGIN = "ParamListBegin"
var PARAMLISTEND = "ParamListEnd"
var PARAMETERDECLS = "ParameterDecls"
var PARAMETERDECL = "ParameterDecl"
var PARAMUSAGETYPE = "ParamUsageType"
var PARAMUSAGES = "ParamUsages"
var PARAMUSAGE = "ParamUsage"
var TECHNIQUEDECL = "TechniqueDecl"
var TECHNIQUEBODY = "TechniqueBody"
var TECHNIQUEBEGIN = "TechniqueBegin"
var TECHNIQUEEND = "TechniqueEnd"
var PASSDECLS = "PassDecls"
var PASSDECL = "PassDecl"
var STATEBLOCK = "StateBlock"
var STATEBLOCKBEGIN = "StateBlockBegin"
var STATEBLOCKEND = "StateBlockEnd"
var STATES = "States"
var STATE = "State"
var STATEINDEX = "StateIndex"
var STATEEXPRBEGIN = "StateExprBegin"
var STATEEXPREND = "StateExprEnd"
var STMTBLOCK = "StmtBlock"
var STMTBLOCKBEGIN = "StmtBlockBegin"
var STMTBLOCKEND = "StmtBlockEnd"
var STMTS = "Stmts"
var SIMPLESTMT = "SimpleStmt"
var NONIFSTMT = "NonIfStmt"
var STMT = "Stmt"
var FOR = "For"
var FORINIT = "ForInit"
var FORCOND = "ForCond"
var FORSTEP = "ForStep"
var DWORDEXPR = "DwordExpr"
var STATEEXPR = "StateExpr"
var SIMPLEEXPR = "SimpleExpr"
var COMPLEXEXPR = "ComplexExpr"
var OBJECTEXPR = "ObjectExpr"
var PRIMARYEXPR = "PrimaryExpr"
var POSTFIXEXPR = "PostfixExpr"
var UNARYEXPR = "UnaryExpr"
var CASTEXPR = "CastExpr"
var MULEXPR = "MulExpr"
var ADDEXPR = "AddExpr"
var RELATIONALEXPR = "RelationalExpr"
var EQUALITYEXPR = "EqualityExpr"
var ANDEXPR = "AndExpr"
var OREXPR = "OrExpr"
var CONDITIONALEXPR = "ConditionalExpr"
var ASSIGNMENTEXPR = "AssignmentExpr"
var ARGUMENTS = "Arguments"
var ARGUMENTSOPT = "ArgumentsOpt"
var INITEXPR = "InitExpr"
var INITEXPRS = "InitExprs"
var CONSTANTEXPR = "ConstantExpr"
var EXPR = "Expr"
var DWORD = "Dword"
var DWORDID = "DwordId"
var ID = "Id"
var IDOPT = "IdOpt"
var TARGET = "Target"
var UINT = "Uint"
var FLOAT = "Float"
var STRINGS = "Strings"
var STRING = "String"
var TYPEID = "TypeId"
var NONTYPEID = "NonTypeId"
var T_KW_FOR = "for"
var T_KW_RETURN = "return"
var T_KW_DO = "do"
var T_KW_DISCARD = "discard"
var T_KW_WHILE = "while"
var T_KW_IF = "if"
var T_KW_ELSE = "else"
var FROMEXPR = "FromExpr";
var MEMEXPR = "MemExpr";


var VERTEXUSAGE = 1;
var FRAGMENTUSAGE = 2;


Enum([
         GLOBAL = 1,
         STRUCT,
         ANNOTATION,
         PARAM,
         FUNCTIONBODY,
         NONE
     ], USAGESCONTEXT, a.EffectUsages);

Enum([  CONST = 0,
        ROW_MAJOR,
        COLUMN_MAJOR,
        UNIFORM,
        STATIC,
        SHARED,
        EXTERN,
        INLINE
     ], EFFECT_USAGES, a.EffectVariable.Usages);

Enum([  SCALAR = 0,
        VECTOR,
        MATRIX_ROWS,
        MATRIX_COLUMNS,
        OBJECT,
        STRUCT
     ], Class, a.ParameterDesc.Class);

Enum([  VOID = 0,
        BOOL,
        INT,
        FLOAT,
        STRING,
        TEXTURE,
        TEXTURE1D,
        TEXTURE2D,
        TEXTURE3D,
        TEXTURECUBE,
        SAMPLER,
        SAMPLER1D,
        SAMPLER2D,
        SAMPLER3D,
        SAMPLERCUBE,
        PIXELSHADER,
        VERTEXSHADER,
        PIXELFRAGMENT,
        VERTEXFRAGMENT,
        UNSUPPORTED
     ], EffectType, a.ParameterDesc.Type);

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

}

VariableType.prototype.setUsage = function (sValue) {
    if (!this.pUsages) {
        this.pUsages = [];
    }
    this.pUsages.push(__ENUM__(EFFECT_USAGES)[sValue.toUpperCase()]);
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
    //TODO: to string
};
VariableType.prototype.isStruct = function () {
    if (this.pEffectType && this.pEffectType.eType === STRUCT) {
        return true;
    }
    return false;
};
VariableType.prototype.isBase = function () {
    return this._isBase;
};
VariableType.prototype.checkMe = function () {
    var i;
    for (i = 0; i < arguments.length; i++) {
        switch (arguments[i]) {
            case VERTEXUSAGE:
                if (this.isStruct() && this.pEffectType.checkMe(VERTEXUSAGE)) {
                    return true;
                }
                if (this.isBase() && this.sSemantic === "POSITION") {
                    return true;
                }
                break;
            case FRAGMENTUSAGE:
                if (this.isStruct() && this.pEffectType.checkMe(FRAGMENTUSAGE)) {
                    return true;
                }
                if (this.isBase() && this.sSemantic === "COLOR") {
                    return true;
                }
                break;
            default:
                warning("Unknown usage for check");
                return true;
        }
    }
    return false;
};
VariableType.prototype.isEqual = function (pType) {
    if (this.pEffectType === pType.pEffectType) {
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
    return pType;
};

function EffectType(sName, sRealName, isBase) {
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
    this.isAnalyzed = false;
    /**
     * @type {Boolean}
     */
    this._isBase = isBase || false;
}

EffectType.prototype.fromStruct = function (pStruct) {
    this.sName = pStruct.sName;
    this.pDesc = pStruct;
    this.isStruct = true;
};
EffectType.prototype.isBase = function () {
    return this._isBase;
};
EffectType.prototype.toCode = function () {
    //TODO: to string
};
EffectType.prototype.hasSemantic = function (sSemantic) {
    return this.pDesc.hasSemantic(sSemantic) || false;
};
EffectType.prototype.hasEmptySemantic = function () {
    return this.pDesc.hasEmptySemantic();
};
EffectType.prototype.hasMultipleSemantic = function () {
    return this.pDesc.hasMultipleSemantic;
}
EffectType.prototype.checkMe = function () {
    var i;
    if (!this.isAnalyzed) {
        this.pDesc.analyzeSemantics();
        this.isAnalyzed = true;
    }
    for (i = 0; i < arguments.length; i++) {
        switch (arguments[i]) {
            case VERTEXUSAGE:
                if (this.hasSemantic("POSITION") && !this.hasEmptySemantic() && !this.hasMultipleSemantic()) {
                    return true;
                }
                break;
            case FRAGMENTUSAGE:
                if (this.pDesc.pOrders.length === 1 && this.hasSemantic("COLOR")) {
                    return true;
                }
                break;
            default:
                warning("Unknown usage for check");
                return true;
        }
    }
    return false;
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
     */
    this.isAnalyzed = false;
}
EffectStruct.prototype.toCode = function () {
    //TODO: to string
};
EffectStruct.prototype.checkMe = function () {
    return true;
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
            continue;
        }
        if (pSemantics[pOrders[i].sSemantic]) {
            this.hasMultipleSemantic = true;
            continue;
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
            return true;
        }
    }
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
                return true;
            }
        }
    }
    return false;
};

function EffectPointer(pVar, nDim) {
    this.pVar = pVar || null;
    this.sRealName = null;
    this.nDim = nDim || 0;
}

function EffectBuffer() {
    this.pRealBuffer = null;
    /**
     * Pointer for real code
     * @type {Object}
     */
    this.pSampler = null;
    /**
     * Pointer for real code
     * @type {Object}
     */
    this.pHeader = null;
}
;

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
    this.iLength = 0;
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
}

EffectVariable.prototype.setType = function (pType) {
    this.pType = pType;
};
EffectVariable.prototype.addAnnotation = function (pAnnotation) {
    this.pAnnotation = pAnnotation;
};
EffectVariable.prototype.addSemantic = function (sSemantic) {
    this.sSemantic = sSemantic;
};
EffectVariable.prototype.addInitializer = function (pInit, pDefault) {
    this.pInitializer = pInit;
    this.pDefaultValue = pDefault || null;
};
EffectVariable.prototype.toCode = function () {
    //TODO: to string
};
EffectVariable.prototype.checkMe = function () {
    //TODO: many and many tests
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
    pVar.nDim = this.nDim;
    return pVar;
};

function EffectSampler() {

}
;

function EffectFunction() {
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
    /**
     * @type VariableType
     */
    this.pReturnType = null;
    /**
     * Pairs: ParamName -> EffectVariable
     * @type {Object}
     */
    this.pParameters = null;
    /**
     * @type {EffectVariable[]}
     */
    this.pParamOrders = null;
    /**
     *
     * @type {String}
     */
    this.sSementic = null;
    /**
     * Hash code for function(for fast search)
     * @type {String}
     */
    this.sHash = null;
    /**
     * Code of function
     * @type {Object[]}
     */
    this.pImplement = null;

    //restrictions for function
    /**
     * may use like constant expression
     * @type {Boolean}
     */
    this.isConstant = false;
    /**
     * may use only in fragment shader
     * @type {Boolean}
     */
    this.isOnlyFragment = false;
    /**
     * may use only in vertex shader
     * @type {Boolean}
     */
    this.isOnlyVertex = false;
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
     * Global variables used in function
     * @type {EffectVariable[]}
     */
    this.pGlobalVariables = null;
    /**
     * Another user-defined functions used in this function
     * @type {EffectFunction[]}
     */
    this.pFunctions = null;
    /**
     *
     * @type {EffectFragment}
     */
    this.pFragmentShader = null;
    /**
     *
     * @type {EffectVertex}
     */
    this.pVertexShader = null;
    /**
     * Pairs: Name of variable -> fields of struct
     * @type {Object}
     */
    this.pStructTable = null;
    /**
     * Scope
     * @type {Int}
     */
    this.iScope = 0;
}
EffectFunction.prototype.hasImplementation = function () {
    return this.pImplement ? true : false;
};
EffectFunction.prototype.calcHash = function () {
    var sHash = "";
    //TODO:Calculates hash
    return sHash;
};
EffectFunction.prototype.hash = function () {
    if (!this.sHash) {
        this.sHash = this.calcHash();
    }
    return this.sHash();
};
EffectFunction.prototype.setSemantic = function (sSemantic) {
    this.sSementic = sSemantic;
    this.pReturnType.sSemantic = sSemantic;
};
EffectFunction.prototype.setName = function () {
    //TODO:
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
};
EffectFunction.prototype.setImplement = function (pImplement, pVertexImplement, pFragmentImplement) {
    this.pImplement = pImplement;
    if (this.pVertexShader) {
        this.pVertexShader.setImplement(pVertexImplement);
    }
    if (this.pFragmentShader) {
        this.pFragmentShader.setImplement(pFragmentImplement);
    }
};
EffectFunction.prototype.checkMe = function () {
    //TODO: many tests
    return true;
};

function EffectVertex() {
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
    this._pVaryingsSemantic = {};
    /**
     * @type {Array}
     * @private
     */
    this._pAttributes = [];
    /**
     *
     * @type {EffectVariable}
     */
    this.pReturnVariable = null;
}
;
EffectVertex.prototype.addVarying = function (pVar) {
    if (this._pVaryingsSemantic[pVar.sSemantic]) {
        error("don`t do so bad things");
    }
    var pNewVar = pVar.cloneMe();
    this._pVaryingsSemantic[pNewVar.sSemantic] = pNewVar;
    this._pVaryings.push(pNewVar);
};
EffectVertex.prototype.setImplement = function (pImplement) {
    this._pCode = pImplement;
};
EffectVertex.prototype.createReturnVar = function (pType) {
    this.pReturnVariable = new EffectVariable();
    this.pReturnVariable.sName = "temp_return_variable";
    this.pReturnVariable.pType = pType.cloneMe();
};

function EffectFragment() {
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
}
EffectFragment.prototype.setImplement = function (pImplement) {
    this._pCode = pImplement;
};

function EffectTechnique() {
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
     * @type {String}
     */
    this.sName = "";
    /**
     *
     * @type {String}
     */
    this.sRealName = "";
}
EffectTechnique.prototype.addPass = function (pPass) {
    this.pPasses.push(pPass);
    if (this.pPassesNames[pPass.sName]) {
        warning("You tru add pass with the same name. It sounds not good(");
    }
    this.pPassesNames[pPass.sName] = pPass;
};

function EffectPass() {
    /**
     *
     * @type {String}
     */
    this.sVertexName = "";
    /**
     *
     * @type {String}
     */
    this.sFragmentName = "";
    /**
     * Pairse: eState -> StateValue
     * @type {Object}
     */
    this.pStates = {};
    /**
     * @type {EffectVertex}
     */
    this.pVertexFunc = null;
    /**
     *
     * @type {EffectFragment}
     */
    this.pFragmentFunc = null;
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
}
EffectPass.prototype.setVertexShader = function (pParam) {
    if (typeof(pParam) === "string") {
        this.sVertexName = pParam;
    }
    else {
        this.pVertexFunc = pParam;
    }
};
EffectPass.prototype.setFragmentShader = function (pParam) {
    if (typeof(pParam) === "string") {
        this.sFragmentName = pParam;
    }
    else {
        this.pFragmentFunc = pParam;
    }
};
EffectPass.prototype.setState = function (eState, eValue) {
    this.pStates[eState] = eValue;
};
EffectPass.prototype.checkMe = function () {
    if (!(this.pFragmentFunc && this.pVertexFunc)) {
        return false;
    }
    if (this.pFragmentFunc.pParameters.length !== 1) {
        return false;
    }
    if (this.pFragmentFunc.pParamOrders[0].pType.isEqual(this.pVertexFunc.pReturnType)) {
        return false;
    }
    return true;
};

function Effect() {
    this.pParams = {};
    this.pTechiques = {};
    this.pFuctions = {};
    this.pPasses = {};
    this.nStep = 0;

    this.pVariables = {};
    this.pAnnotations = [];
    this._effectJS = {};
    this._effectJS_Constants = {};

    this._isFuncParam = false;
    this._isLocal = false;

    this._pParseTree = null;

    this._pCurrentType = null;

    this._pTypeTable = {};
    this._pVariables = {};
    this._pCurrentAnnotation = null;
    this._pCurrentStructFields = null;
    this._pCurrentStructOrders = null;

    this._pCurrentVar = null;
    this._isCodeWrite = false;
    this._pCodeStack = [];
    this._pCode = null;
    this._pCodeVertex = null;
    this._pCodeFragment = null;

    this._iScope = 0;
    this._nScope = 0;
    this._pScopeStack = [];
    this._ppScopes = {};
    this._pCurrentScope = null;

    this._isAnnotation = false;
    this._isStruct = false;
    this._isFunction = false;

    this._pFunctionTableByHash = {};
    this._pFunctionTableByName = {};

    this.nCurrentDecl = 0;

    this._isVertex = false;
    this._isFragment = false;

    this._isSampler = false;

    this._pCurrentFunction = null;
    this._sVarName = null;
    this._sLastFullName = null;
    this._pVarNameStack = null;
    this._isNewName = false;

    this._nAddr = 0;

}
/**
 * Very important function. Calculate some hlsl code.
 * Work only with const and literal objects.
 * @tparam Array pVal List of some hlsl instructions.
 */
Effect.prototype.evalHLSL = function (pCode) {
    //TODO:Translate to JS some const hlsl expressions
};

Effect.prototype.newCode = function (isVertex, isFragment) {
    this._isCodeWrite = true;
    this._pCode = [];
    this._pCodeVertex = isVertex ? [] : null;
    this._pCodeFragment = isFragment ? [] : null;
    this._pCodeStack.push([this._pCode, this._pCodeVertex, this._pCodeFragment]);
};
Effect.prototype.endCode = function () {
    this._pCodeStack.pop();
    var iLen = this._pCodeStack.length - 1;
    if (iLen < 0) {
        this._isCodeWrite = false;
        this._pCode = null;
        this._pCodeVertex = null;
        this._pCodeFragment = null;
    }
    this._pCode = this._pCodeStack[iLen][0] || null;
    this._pCodeVertex = this._pCodeStack[iLen][1] || null;
    this._pCodeFragment = this._pCodeStack[iLen][2] || null;
};
Effect.prototype.pushCode = function (pObj) {
    if (!this._isCodeWrite) {
        warning("Pause???");
        return;
    }
    if (this._pCode) {
        this._pCode.push(pObj);
    }
    else {
        warning("Do you really want it?");
    }
    if (this._pCodeVertex) {
        this._pCodeVertex.push(pObj);
    }
    if (this._pCodeFragment) {
        this._pCodeFragment.push(pObj);
    }
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
    this._pVarNameStack.push(this._sVarName);
    this._sVarName = "";
};
Effect.prototype.endVarName = function () {
    this._isNewName = false;
    this._sLastFullName = this._sVarName;
    this._sVarName = this._pVarNameStack.pop();
};
Effect.prototype.newAddr = function () {
    this._nAddr = 0;
};
Effect.prototype.endAddr = function () {
    this._nAddr = 0;
};
Effect.prototype.newScope = function () {
    this._pScopeStack.push(this._nScope);
    this._iScope = this._nScope;
    this._nScope++;
    this._pCurrentScope = null;
};
Effect.prototype.endScope = function () {
    this._pScopeStack.pop()
    this._iScope = this._pScopeStack[this._pScopeStack.length - 1] || -1;
    this._pCurrentScope = null;
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
    this._pCurrentStructFields = {};
    this._pCurrentStructOrders = [];
};
Effect.prototype.endStruct = function () {
    this._isStruct = false;
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
Effect.prototype.addVariable = function (pVar) {
    function fnExtractStruct(sName, pStruct, pTable, iScope) {
        var pOrders = pStruct.pOrders;
        var sNewName;
        var pPointers;
        for (var i = 0; i < pOrders.length; i++) {
            sNewName = sName + "." + pOrders[i].sName;
            if (pOrders[i].isPointer) {
                pPointers = [];
                for (var j = 0; j < pOrders[i].nDim; j++) {
                    pPointers.push(new EffectPointer(pVar, j));
                }
            }
            if (pTable[sNewName]) {
                error("good bad and ugly)");
                return;
            }
            pTable[sNewName] = {"pPointers" : pPointers, "iScope" : iScope};
            if (!pOrders[i].pType.isBase()) {
                fnExtractStruct(sNewName, pOrders[i].pType.pEffectType.pDesc, pTable, this._iScope);
            }
        }
    }

    if (this._hasVariableDecl(pVar.sName)) {
        error("Ohhh! You try to redeclarate varibale!");
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
    pVar.iScope = this._iScope;
    if (pVar.isPointer) {
        pVar.pPointers = [];
        for (var i = 0; i < pVar.nDim; i++) {
            pVar.pPointers.push(new EffectPointer(pVar, i));
        }
    }
    if (!pVar.pType.isBase()) {
        if (!this._pCurrentScope.pStructTable) {
            this._pCurrentScope.pStructTable = {};
        }
        fnExtractStruct(pVar.sName, pVar.pType.pEffectType.pDesc, this._pCurrentScope.pStructTable);
    }
};
Effect.prototype.addVariable = function (pVar) {
    var isVertex = this._pCurrentFunction ? this._pCurrentFunction.isVertexShader : false;

    function fnExtractStruct(sName, pStruct, pTable, iScope) {
        var pOrders = pStruct.pOrders;
        var sNewName;
        var pPointers;
        var pBuffer;
        var isPointer;

        for (var i = 0; i < pOrders.length; i++) {
            sNewName = sName + "." + pOrders[i].sName;
            pBuffer = null;
            pPointers = null;
            isPointer = false;
            if (isVertex && !sName.search('.') && !pOrders[i].isPointer) {
                pPointers = [];
                pPointers.push(new EffectPointer(pVar, 0));
                pBuffer = new EffectBuffer();
                isPointer = undefined;
            }
            if (pOrders[i].isPointer) {
                pPointers = [];
                for (var j = 0; j < pOrders[i].nDim; j++) {
                    pPointers.push(new EffectPointer(pVar, j));
                }
                if(isVertex){
                    pBuffer = new EffectBuffer();
                }
                isPointer = true;
            }
            if (pTable[sNewName]) {
                error("good bad and ugly)");
                return;
            }
            pTable[sNewName] = {
                "pPointers" : pPointers,
                "iScope"    : iScope,
                "isPointer" : isPointer,
                "pBuffer"   : pBuffer
            };
            if (!pOrders[i].pType.isBase()) {
                fnExtractStruct(sNewName, pOrders[i].pType.pEffectType.pDesc, pTable, this._iScope);
            }
        }
    }

    if (this._hasVariableDecl(pVar.sName)) {
        error("Ohhh! You try to redeclarate varibale!");
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
    pVar.iScope = this._iScope;
    if (pVar.isPointer) {
        pVar.pPointers = [];
        for (var i = 0; i < pVar.nDim; i++) {
            pVar.pPointers.push(new EffectPointer(pVar, i));
        }
    }
    if (!pVar.pType.isBase()) {
        if (!this._pCurrentScope.pStructTable) {
            this._pCurrentScope.pStructTable = {};
        }
        fnExtractStruct(pVar.sName, pVar.pType.pEffectType.pDesc, this._pCurrentScope.pStructTable);
    }
};
Effect.prototype.hasVariable = function (sName) {
    var ppScopes = this._ppScopes;
    var pScopeStack = this._pScopeStack;
    var i;
    for (i = pScopeStack.length - 1; i >= 0; i--) {
        if (ppScopes[i] && ppScopes[i].pVariableTable && ppScopes[i].pVariableTable[sName]) {
            return ppScopes[i].pVariableTable[sName];
        }
    }
    return false;
};
Effect.prototype.hasComplexVariable = function (sName) {
    var ppScopes = this._ppScopes;
    var pScopeStack = this._pScopeStack;
    var i;
    for (i = pScopeStack.length - 1; i >= 0; i--) {
        if (ppScopes[i] && ppScopes[i].pStructTable && ppScopes[i].pStructTable[sName]) {
            return ppScopes[i].pStructTable[sName];
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
    if (this._hasTypeDecl(pVar.sName)) {
        error("Ohhh! You try to redifenition type((!");
        return;
    }
    this._pCurrentScope.pTypeTable[pType.sName] = pType;
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
        if (ppScopes[i] && ppScopes[i].pTypeTable && ppScopes[i].pTypeTable[sTypeName]) {
            return ppScopes[i].pTypeTable[sTypeName];
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
    //TODO: Add Base type TABLE
};
Effect.prototype.addFunction = function (pFunction) {
    var sHash = pFunction.hash();
    var pFunc = this._hasFunctionDecl(sHash);
    if (pFunc) {
        warning("It`s seen bad. You try to redeclarate function");
        if (pFunction.hasImplementation() && pFunc.hasImplementation()) {
            error("You should not try to redefinition function");
            return;
        }
        else if (pFunction.hasImplementation()) {
            pFunc.pDefinition = pFunction.pDefinition;
            return;
        }
    }
    this._pFunctionTableByHash[sHash] = pFunction;
    this._pFunctionTableByName[pFunction.sName] = pFunction;

};
Effect.prototype.hasFunction = function (sFuncName) {
    return this._pFunctionTableByName[sFuncName] || false;
};
Effect.prototype._hasFunctionDecl = function (sFuncHash) {
    return this.isBaseFunction(sFuncHash) || this._pFunctionTableByHash[sFuncHash] || false;
};
Effect.prototype.isBaseFunction = function (sFuncHash) {
    //TODO:Add base function table
};

Effect.prototype.convertType = function (pNode) {
    var pType;
    var pChildren = pNode.pChildren;
    if (pNode.sName === T_KW_VOID) {
        pType = this.hasType(pNode.sValue);
        return pType;
    }
    if (pNode.sName === SCALARTYPE || pNode.sName === OBJECTTYPE) {
        pType = this.hasType(pChildren[0].sValue);
        if (!pType) {
            error("Something going wrong with type names(");
            return;
        }
        return pType;
    }
    if (pNode.sName === MATRIXTYPE || pNode.sName === VECTORTYPE) {
        if (pChildren.length === 1) {
            pType = this.hasType(pChildren[0].sValue);
            return pType;
        }
        var sTypeName;
        if (pNode.sName === MATRIXTYPE) {
            sTypeName = "matrix";
            sTypeName += "<" + this.convertType(pChildren[2]).toCode();
            this.newCode();
            sTypeName += "," + this.evalHLSL(this.analyzeExpr(pChildren[4]));
            this.endCode();
            this.newCode();
            sTypeName += "," + this.evalHLSL(this.analyzeExpr(pChildren[6]));
            this.endCode();
            sTypeName += ">";
        }
        else {
            sTypeName = "vector";
            sTypeName += "<" + this.convertType(pChildren[2]).toCode();
            this.newCode();
            sTypeName += "," + this.evalHLSL(this.analyzeExpr(pChildren[4]));
            this.endCode();
            sTypeName += ">";
        }
        pType = this.hasType(sTypeName);
        return pType;
    }
    if (pNode.sName === BASETYPE || pNode.sName === TYPE) {
        return this.convertType(pChildren[0]);
    }
    return pType;
};


Effect.prototype.analyze = function (pTree) {
    if (!pTree) {
        warning("Wrong argument! You must put an object of parse tree class!");
        return false;
    }
    try {
        var pRoot = pTree.pRoot;
        var i;
        this._pParseTree = pTree;
        this.newScope();
//        for (i = 0; i < pRoot.pChildren.length; i++) {
//            this.analyzeDecl(pRoot.pChildren[i]);
//        }
        this.firstStep();
        this.analyzeTypes();
        this.preAnalyzeFunctions();
        this.preAnalyzeTechniques();
        this.secondStep();
        this.analyzeEffect();
        this.checkEffect();
        this.endScope();
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
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
    for (i = 0; i < pChildren.length; i++) {
        if (pChildren[i].sName === TYPEDECL) {
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
    for (i = 0; i < pChildren.length; i++) {
        if (pChildren[i].sName === FUNCTIONDECL) {
            this.nCurrentDecl++;
            this.analyzeFunctionDecl(pChildren[i]);
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
    for (i = 0; i < pChildren.length; i++) {
        if (pChildren[i].sName === TECHIQUEDECL) {
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
    for (i = 0; i < pChildren.length; i++) {
        this.nCurrentDecl++;
        this.analyzeDecl(pChildren[i]);
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
        case VARIABLEDECL:
            this.analyzeVariableDecl(pNode);
            break;
        case TYPEDECL:
            this.analyzeTypeDecl(pNode);
            break;
        case FUNCTIONDECL:
            this.analyzeFunctionDecl(pNode);
            break;
        case VARSTRUCTDECL:
            this.analyzeVarStructDecl(pNode);
            break;
        case TECHIQUEDECL:
            this.analyzeTechniqueDecl(pNode);
            break;
    }
};
Effect.prototype.analyzeVariableDecl = function (pNode) {
    var pChildren = pNode.pChildren;
    var i;
    var pVar;
    var pType = new VariableType();
    this.analyzeUsageType(pChildren[0], pType);
    var isSampler = false;
    if (pType.pEffectType.isSampler()) {
        isSampler = true;
        this.newSampler();
        if (this._iScope !== GLOBAL) {
            error("Only global samplers support");
            return;
        }
    }
    if (!pType.checkMe()) {
        error("You sucks. 1");
        return;
    }
    this._pCurrentType = pType;
    for (i = 1; i < pChildren.length; i++) {
        if (pChildren[i].sName === VARIABLE) {
            pVar = this.analyzeVariable(pChildren[i]);
            pVar.setType(pType);
            this.addVariableDecl(pVar);
        }
    }
    this._pCurrentType = null;
    if (isSampler) {
        this.endSampler();
    }
};
Effect.prototype.analyzeUsageType = function (pNode, pType) {
    pType = pType || new VariableType();
    var pChildren = pNode.pChildren;
    var i;
    for (i = 0; i < pChildren.length; i++) {
        if (pChildren[i].sName === TYPE) {
            pType.setType(this.convertType(pChildren[i]));
        }
        if (pChildren[i].sName === USAGE) {
            pType.setUsage(pChildren[i]);
        }
    }
    return pType;
};
Effect.prototype.analyzeVariable = function (pNode, pVar) {
    var pChildren = pNode.pChildren;
    if (this._isAnnotation || this._iScope > GLOBAL) {
        if (pChildren.length > 2) {
            error("Bad syntax! Bad variable declaration in annotation or local scope!");
            return;
        }
        if (pChildren.length === 2 && pChildren[1].sName !== INITIALIZER) {
            error("Bad syntax! Bad variable declaration in annotation or local scope! Second must be Initializer.");
            return;
        }
    }
    if (this._isStruct) {
        if (pChildren.length > 2) {
            error("Bad syntax! Bad variable declaration in struct scope!");
            return;
        }
        if (pChildren.length === 2 && pChildren[1].sName !== SEMANTIC) {
            error("Bad syntax! Bad variable declaration in struct scope! Second must be Semantic");
            return;
        }
    }
    pVar = pVar || new EffectVariable();
    this._pCurrentVar = pVar;
    this.analyzeVariableDim(pChildren[0], pVar);
    var i;
    var pResult = null;
    for (i = 1; i < pChildren.length; i++) {
        if (pChildren[i] === ANNOTATION) {
            pResult = this.analyzeAnnotation(pChildren[i], pVar);
        }
        else if (pChildren[i] === SEMANTIC) {
            pResult = this.analyzeSemantic(pChildren[i], pVar);
        }
        else if (pChildren[i] === INITIALIZER) {
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
        pVar.sValue = this.evalHLSL(pVar.pInitializer);
        this._pCurrentAnnotation[pVar.sName] = pVar.sValue;
        return true;
    }
    if (this._isStruct) {
        this._pCurrentStructFields[pVar.sName] = pVar;
        this._pCurrentStructOrders.push(pVar);
        return true;
    }
    if (this._iScope === GLOBAL) {
        pVar.sValue = this.evalHLSL(pVar.pInitializer);
    }
    if (pVar.isConst() && pVar.isConstInit()) {
        this.addConstant(pVar);
    }
    this._pCurrentScope[pVar.sName] = pVar;
    if (this._isCodeWrite) {
        //TODO: add to pCode
    }
};
Effect.prototype.analyzeVariableDim = function (pNode, pVar) {
    pVar = pVar || new EffectVariable();
    var pChildren = pNode.pChildren;
    if (pChildren.length === 1) {
        pVar.sName = pChildren[0].sValue;
        return pVar;
    }
    if (pChildren.length === 3) {
        pVar.isPointer = true;
        pVar.nDim++;
    }
    else if (pChildren.length === 4 && pChildren[3].sName === FROMEXPR) {
        pVar.isPointer = true;
        pVar.nDim++;
        pVar.pBuffer = this.analyzeFromExpr(pChildren[3]);
    }
    else {
        if (!pVar.isArray) {
            pVar.isArray = true;
        }
        else {
            error("Sorry but glsl does not support multidimensional arrays!");
            return;
        }
        pVar.iLength = this.evalHLSL(this.analyzeExpr(pChildren[2]));
    }
    this.analyzeVariableDim(pChildren[0], pVar);
    return pVar;
};
Effect.prototype.analyzeFromExpr = function (pNode) {
    var pChildren = pNode.pChildren;
    var pMem;
    if (pChildren[1].sName = T_NON_TYPE_ID) {
        pMem = this.hasVariable(pChildren[1].sValue);
        if (!pMem) {
            error("bad 1");
            return;
        }
        if (!pMem.pBuffer) {
            error("bad 2");
        }
        pMem = pMem.pBuffer;
    }
    else {
        pMem = this.analyzeMemExpr(pChildren[1]);
    }
    return pMem;
};
Effect.prototype.analyzeMemExpr = function (pNode) {
    var pChildren = pNode.pChildren;
    var pMem;
    if (pChildren[1].sName === T_NON_TYPE_ID) {
        pMem = this.hasVariable(pChildren[1].sValue);
        if (!pMem) {
            error("bad 3");
            return;
        }
        pMem = pMem.pBuffer;
    }
    else if (pChildren[1][1].sName === T_NON_TYPE_ID) {
        pMem = this.hasVariable(pChildren[1][1].sValue);
        if (!pMem) {
            error("bad 3");
            return;
        }
        pMem = pMem.pBuffer;
    }
    else {
        this._isCodeWrite = false;
        this.analyzeExpr(pChildren[1][1]);
        this.isCodeWrite = true;
        var pProp = this.hasComplexVariable(this._sLastFullName);
        if (!pProp.pBuffer) {
            error("Nooooo");
            return;
        }
        pMem = pProp.pBuffer;
    }
    if (!pMem) {
        error("Oh-oh, don`t cool enough");
    }
    return pMem;
};
Effect.prototype.analyzeAnnotation = function (pNode, pObj) {
    this.newAnnotation();
    var pChildren = pNode.pChildren;
    var i;
    for (i = 0; i < pChildren.length; i++) {
        if (pChildren[i].sName === VARIABLEDECL) {
            this.analyzeVariableDecl(pChildren[i]);
        }
    }
    pObj.addAnnotation(this._pCurrentAnnotation);
    this.endAnnotation();
    return pObj;
};
Effect.prototype.analyzeSemantic = function (pNode, pVar) {
    pVar = pVar || new EffectVariable();
    pVar.addSemantic(pNode.pChildren[1].sValue);
    return pVar;
};
Effect.prototype.analyzeInitializer = function (pNode, pVar) {
    pVar = pVar || new EffectVariable();
    var pChildren = pNode.pChildren;
    var pInit;
    this.newCode();
    if (pChildren[1].sValue === "{") {
        var i;
        var iLength = pVar.iLength * this._pCurrentType.iRows * this._pCurrentType.iColumns;
        if ((pChildren.length - 3) !== iLength * 2 - 1 &&
            !((pChildren.length - 3) === iLength * 2 && pChildren[pChildren.length - 2].sValue === ",")) {
            error("Bad constructor");
        }
        for (i = 2; i < pChildren.length - 1; i++) {
            if (pChildren[i].sName === INITEXPR) {
                this.analyzeInitExpr(pChildren[i]);
            }
        }
    }
    else {
        this.analyzeExpr(pNode.pChildren[1]);
    }
    pInit = this._pCode;
    this.endCode();
    pVar.addInitializer(pInit);
    return pVar;
};
Effect.prototype.analyzeInitExpr = function (pNode) {
    var pChildren = pNode.pChildren;

    if (pChildren[0].sValue === "{") {
        var i;
        for (i = 1; i < pChildren.length - 1; i++) {
            if (pChildren[i].sName === INITEXPR) {
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
    var pChildren = pNode.pChildren;
    var pRes;
    var pVar;
    switch (pNode.sName) {
        case OBJECTEXPR:
            if (pChildren[0].sValue === T_KW_STATEBLOCK_STATE) {
                //ObjectExpr : T_KW_STATEBLOCK_STATE StateBlock
                error("I don`t know what is this");
                return;
            }
            if (pChildren[0].sValue === T_KW_COMPILE_FRAGMENT) {
                //ObjectExpr : T_KW_COMPILE_FRAGMENT Target NonTypeId '(' ArgumentsOpt ')'
                error("Farg sucks");
                return;
            }
            if (pChildren[0].sValue === T_KW_COMPILE) {
                //ObjectExpr : T_KW_COMPILE Target NonTypeId '(' ArgumentsOpt ')'
                var pFunc = this.hasFunction(pChildren[2].sValue);
                if (!pFunc) {
                    error("yo, error");
                    return;
                }
                this.pushCode(pChildren[2].sValue);
                if (pChildren.length > 5) {
                    //TODO: add support for these constructions
                    error("Sorry but we now don`t support this constructions");
                    return;
                }
                return;
            }
            else {
                //ObjectExpr : T_KW_SAMPLER_STATE StateBlock
                this.analyzeStateBlock(pChildren[1]);
            }
            break;

        case COMPLEXEXPR:
            if (this._nAddr > 0 &&
                pChildren.length !== 3 &&
                (pChildren[1].sValue !== POSTFIXEXPR || pChildren[1].sValue !== PRIMARYEXPR)) {
                error("Bad for dog 2");
                break;
            }
            if (pChildren.length === 1) {
                this.analyzeExpr(pChildren[0]);
                break;
            }
            if (pChildren.length === 3) {
                this.pushCode(pChildren[0].sValue);
                this.analyzeExpr(pChildren[1]);
                this.pushCode(pChildren[2].sValue);
                break;
            }
            if (pChildren[0].sName === T_NON_TYPE_ID) {
                this.pushCode(this.hasFunction(pChildren[0].sValue));
            }
            else if (pChildren[0].sName === T_TYPE_ID) {
                this.pushCode(this.hasType(pChildren[0].sValue));
            }
            else if (pChildren[0].sName === BASETYPE) {
                this.pushCode(this.convertType(pChildren[0]));
            }
            this.pushCode(pChildren[1].sValue);
            var i;
            for (i = 2; i < pChildren.length - 1; i++) {
                if (pChildren[i].sValue === ",") {
                    this.pushCode(pChildren[i]);
                }
                else {
                    this.analyzeExpr(pChildren[i]);
                }
            }
            this.pushCode(pChildren[pChildren.length - 1]);
            break;

        case PRIMARYEXPR:
            if (pChildren.length === 1) {
                this.analyzeExpr(pChildren[0]);
                break;
            }
            var isNewAddr = false;
            if (this._nAddr === 0) {
                this._isCodeWrite = false;
                this.newAddr();
                isNewAddr = true;
            }
            this._nAddr++;
            this.analyzeExpr(pChildren[1]);

            if (isNewAddr) {
                this._isCodeWrite = true;
                var pRes;
                if (this._sLastFullName.search('.')) {
                    pRes = this.hasComplexVariable(this._sLastFullName);
                    if (!pRes) {
                        error("oh-ah");
                        break;
                    }
                    pRes = pRes.pPointers[this._nAddr - 1];
                    if (!pRes) {
                        error("@@@@ - why are you do this");
                        break;
                    }
                }
                else {
                    pRes = this.hasVariable(this._sLastFullName);
                    pRes = pRes.pPointers[this._nAddr - 1];
                    if (!pRes) {
                        error("@ - why are you do this?");
                        break;
                    }
                }
                this.pushCode(pRes);
                this.endAddr();
            }
            break;

        case POSTFIXEXPR:
            if (this._nAddr > 0 && (pChildren.length === 2 || pChildren[1].sValue === "[")) {
                error("Bad for dog");
                break;
            }
            var isNewVar = false;
            if (this._isNewName) {
                isNewVar = true;
                this.newVarName();
            }
            this.analyzeExpr(pChildren[0]);
            if (pChildren.length === 2) {
                this.pushCode(pChildren[1].sValue);
            }
            else if (pChildren[1].sValue === ".") {
                this._sVarName += ".";
                this.pushCode(pChildren[1].sValue);
                this.analyzeExpr(pChildren[2]);
                if (pChildren.length === 4) {
                    var pMem = this.analyzeMemExpr(pChildren[3]);
                    if (!pMem) {
                        error("bad 49");
                        return;
                    }
                    pVar = this.hasComplexVariable(this._sVarName);
                    if (!pVar) {
                        error("bad 50");
                        return;
                    }
                    if (!pVar.isPointer) {
                        error("bad 51");
                        return;
                    }
                    if (this._iScope !== pVar.iScope) {
                        error("bad 52");
                        return;
                    }
                    pVar.pBuffer = pMem;
                }
            }
            else if (pChildren[1].sValue === "[") {
                this.newVarName();
                this.pushCode(pChildren[1].sValue);
                this.analyzeExpr(pChildren[2]);
                this.pushCode(pChildren[3].sValue);
                this.endVarName();
            }
            if (isNewVar) {
                this.endVarName();
            }
            break;

        case UNARYEXPR:
            if (pChildren.length === 1) {
                this.analyzeExpr(pChildren[0]);
                break;
            }
            this.pushCode(pChildren[0].sValue);
            this.analyzeExpr(pChildren[1]);
            break;

        case CASTEXPR:
            if (pChildren.length === 1) {
                this.analyzeExpr(pChildren[0]);
                break;
            }
            this.pushCode("(");
            this.analyzeConstTypeDim(pChildren[1]);
            this.pushCode("(");
            this.analyzeExpr(pChildren[3]);
            this.pushCode(")");
            this.pushCode(")");
            break;

        case CONDITIONALEXPR:
            this.analyzeExpr(pChildren[0]);
            if (pChildren.length === 1) {
                break;
            }
            else {
                this.pushCode("?");
                this.analyzeExpr(pChildren[2]);
                this.pushCode(":");
                this.analyzeExpr(pChildren[4]);
            }
            break;

        case MULEXPR:
        case ADDEXPR:
        case RELATIONALEXPR:
        case EQUALITYEXPR:
        case ANDEXPR:
        case OREXPR:
        case ASSIGNMENTEXPR:
            this.analyzeExpr(pChildren[0]);
            if (pChildren.length === 1) {
                break;
            }
            else {
                this.pushCode(pChildren[1].sValue);
                this.analyzeExpr(pChildren[2]);
            }
            break;

        case T_NON_TYPE_ID:
            var isTranslate = true;
            if (this._pCode.length > 0 && this._pCode[this._pCode.length - 1] === ".") {
                isTranslate = false;
            }

            if (isTranslate) {
                if (this._sVarName.length > 0) {
                    error("Oh-no");
                }
                this._sVarName = pNode.sValue;
                pRes = this.hasVariable(this._sVarName);
            }
            else {
                this._sVarName += pNode.sValue;
                pRes = this.hasComplexVariable(this._sVarName);
                if (!pRes) {
                    error("Not this variable");
                    return;
                }
                pRes.isUsed = true;
                pRes = pNode.sValue;
            }
            if (!pRes) {
                error("Unknown ID: " + pNode.sValue);
                return;
            }
            this.pushCode(pRes);
            break;

        case T_STRING:
        case T_UINT:
        case T_FLOAT:
        case T_KW_TRUE:
        case T_KW_FALSE:
            this.pushCode(pNode.sValue);
            break;
        case MEMEXPR:
            return this.analyzeMemExpr(pNode);
    }
};
Effect.prototype.analyzeConstTypeDim = function (pNode) {
    var pChildren = pNode.pChildren;
    //GLSL compatibility
    if (pChildren.length > 1) {
        error("Bad type casting");
        return;
    }
    if (pChildren[0].sName === T_TYPE_ID ||
        (pChildren[0].sValue && this.isBaseType(pChildren[0].sValue))) {
        this.pushCode(this.convertType(pChildren[0]));
    }
};
Effect.prototype.analyzeTypeDecl = function (pNode) {
    var pChildren = pNode.pChildren;
    var pType = new EffectType();
    if (pChildren.length === 2) {
        //TypeDecl : StructDecl ';'
        pType.fromStruct(this.analyzeStructDecl(pNode));
    }
    this.addType(pType);
    pNode.pAnalyzed = pType;
};
Effect.prototype.analyzeStructDecl = function (pNode, pStruct) {
    pStruct = pStruct || new EffectStruct();
    var pChildren = pNode.pChildren;
    pStruct.sName = pChildren[1];
    if (this.hasTypeName(pStruct.sName)) {
        error("Very bad... You try to redefinition type(");
        return;
    }
    this.newStruct();
    var i;
    for (i = 3; i < pChildren.length; i++) {
        if (pChildren[i].sName === VARIABLEDECL) {
            this.analyzeVariableDecl(pChildren[i]);
        }
    }
    pStruct.pFields = this._pCurrentStructFields;
    pStruct.pOrders = this._pCurrentStructOrders;
    this.endStruct();
    return pStruct;
};

Effect.prototype.analyzeFunctionDecl = function (pNode) {
    var pChildren = pNode.pChildren;
    this.newFunction();
    var pFunction;
    if (this.nStep === 1) {
        var hasDecl = false;
        var pFunction = this.analyzeFunctionDef(pChildren[0]);

        if (pChildren[1].sValue !== ";") {
            hasDecl = true;
        }
        else {
            pNode.pAnalyzed = pFunction;
        }
        var pFunc = this._hasFunctionDecl(pFunction.hash());

        if (pFunc !== false && pFunc.hasImplementation() && hasDecl) {
            error("You try to redifinition function! Not good!");
        }
        if (pFunc === false) {
            this.addFunction(pFunction);
        }
    }
    else {
        pFunction = this.analyzeFunctionDef(pChildren[0]);
        var pType = pFunction.pReturnType;
        var pEffectType = pType.pEffectType;
        this._pCurrentFunction = pFunction;
        this.newScope();
        pFunction.iScope = this._iScope;
        var i;
        for (i in pFunction.pParameters) {
            this.addVariable(pFunction.pParameters[i]);
        }
        if (pChildren.length === 3) {
            this.analyzeAnnotation(pChildren[1], pFunction);
            i++;
        }
        if (pFunction.isVertexShader) {
            if (pType.checkMe(VERTEXUSAGE)) {
                error("Vertex is not vertex enough");
            }
            pFunction.pVertexShader = new EffectVertex();
            //Add Varyings
            if (pType.isStruct()) {
                var pVars = pEffectType.pOrders;
                for (i = 0; i < pVars.length; i++) {
                    if (pVars[i].sSemantic !== "POSITION" && pVars[i].sSemantic !== "PSIZE") {
                        pFunction.pVertexShader.addVarying(pVars[i]);
                    }
                }
                pFunction.pVertexShader.createReturnVar(pFunction.pReturnType);
            }
        }
        if (pFunction.isFragmentShader) {
            if (pType.checkMe(FRAGMENTUSAGE)) {
                error("Pixel is not pixel enough");
            }
            pFunction.pFragmentShader = new EffectFragment();
        }
        this.newCode(pFunction.isVertexShader, pFunction.isFragmentShader);

        this.analyzeStmtBlock(pChildren[1 + i]);
        pFunction.setImplement(this._pCode, this._pCodeVertex, this._pCodeFragment);

        this.endCode();
        this.endScope();
        this._pCurrentFunction = null;
    }
    this.endFunction();
};
Effect.prototype.analyzeFunctionDef = function (pNode, pFunction) {
    if (pNode.pAnalyzed !== undefined) {
        return pNode.pAnalyzed;
    }
    pFunction = pFunction || new EffectFunction();
    var pChildren = pNode.pChildren;
    pFunction.pReturnType = this.analyzeUsageType(pChildren[0]);
    pFunction.setName(pChildren[i].sName);
    if (pChildren[2].sName === SEMANTIC) {
        pFunction.setSemantic(pChildren[2][1].sValue);
        this.analyzeParamList(pChildren[3], pFunction);
    }
    else {
        this.analyzeParamList(pChildren[2], pFunction);
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
    for (i = 0; i < pChildren.length; i++) {
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
    else if (pChildren[0].sName === T_KW_WHILE) {
        //Stmt : T_KW_WHILE '(' Expr ')' Stmt
        this.pushCode("while");
        this.pushCode("(");
        this.analyzeExpr(pChildren[2]);
        this.pushCode(")");
        this.analyzeStmt(pChildren[4]);
    }
    else if (pChildren[0].sName === T_KW_FOR) {
        //Stmt : For '(' ForInit ForCond ForStep ')' Stmt
        this.pushCode("for");
        this.pushCode("(");
        this.newScope();
        this.analyzeForInit(pChildren[2]);
        this.analyzeForCond(pChildren[3]);
        this.analyzeForStep(pChildren[4]);
        this.pushCode(")");
        this.analyzeStmt(pChildren[6]);
        this.endScope();
    }
    else if (pChildren[0].sName === T_KW_IF && pChildren.length === 5) {
        //Stmt : T_KW_IF '(' Expr ')' Stmt
        this.pushCode("if");
        this.pushCode("(");
        this.analyzeExpr(pChildren[2]);
        this.pushCode(")");
        this.analyzeStmt(pChildren[4]);
    }
    else {
        //Stmt : T_KW_IF '(' Expr ')' NonIfStmt T_KW_ELSE Stmt
        this.pushCode("if");
        this.pushCode("(");
        this.analyzeExpr(pChildren[2]);
        this.pushCode(")");
        this.analyzeNonIfStmt(pChildren[4]);
        this.pushCode("else");
        this.analyzeStmt(pChildren[6]);
    }
};
Effect.prototype.analyzeForInit = function (pNode) {
    pNode = pNode.pChildren[0];
    var pChildren = pNode.pChildren;
    if (pNode.sName !== VARIABLEDECL) {
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
    pNode = pNode.pChildren[0];
    if (pNode.sName !== RELATIONALEXPR || pNode.sName !== EQUALITYEXPR) {
        error("Something going wrong...in for cond");
        return;
    }
    this.analyzeExpr(pNode);
};
Effect.prototype.analyzeForStep = function (pNode) {
    if (pNode.pChildren) {
        pNode = pNode.pChildren[0];
    }
    if (pNode.sName !== POSTFIXEXPR || pNode.sName !== ASSIGNMENTEXPR) {
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
    else if (pChildren[0].sName === T_KW_WHILE) {
        //Stmt : T_KW_WHILE '(' Expr ')' Stmt
        this.pushCode("while");
        this.pushCode("(");
        this.analyzeExpr(pChildren[2]);
        this.pushCode(")");
        this.analyzeNonIfStmt(pChildren[4]);
    }
    else if (pChildren[0].sName === T_KW_FOR) {
        //Stmt : For '(' ForInit ForCond ForStep ')' Stmt
        this.pushCode("for");
        this.pushCode("(");
        this.newScope();
        this.analyzeForInit(pChildren[2]);
        this.analyzeForCond(pChildren[3]);
        this.analyzeForStep(pChildren[4]);
        this.pushCode(")");
        this.analyzeNonIfStmt(pChildren[6]);
        this.endScope();
    }
};
Effect.prototype.analyzeSimpleStmt = function (pNode) {
    var pChildren = pNode.pChildren;
    var pFunction = this._pCurrentFunction;
    if (pChildren[0].sValue === ";") {
        //SimpleStmt : ';' --AN
        return;
    }
    else if (pChildren[0].sName === EXPR) {
        //SimpleStmt : Expr ';'
        this.analyzeExpr(pChildren[0]);
        this.pushCode(";");
    }
    else if (pChildren[0].sName === T_KW_RETURN && pChildren.length === 2) {
        //SimpleStmt : T_KW_RETURN ';'
//        if (this._pCodeVertex || this._pCodeFragment) {
//            error("So sad, but you can`t do this with us.");
//            return;
//        }
        if (!pFunction.pReturnType.isVoid() && !(pFunction.pVertexShader || pFunction.pFragmentShader)) {
            error("It`s not JS, baby.");
            return;
        }
        this.pushCode("return");
        this.pushCode(";");
    }
    else if (pChildren[0].sName === T_KW_RETURN && pChildren.length === 3) {
        //SimpleStmt : T_KW_RETURN Expr ';'
        this._pCode.push("return");

        var pType = pFunction.pReturnType;
        if (this._pCodeVertex) {
            if (pType.isBase()) {
                this._pCodeVertex.push("gl_Position = (");
            }
            else {
                var pVar = pFunction.pVertexShader.pReturnVariable;
                this._pCodeVertex.push(pVar, "=", "(");
            }
        }
        if (this._pCodeFragment) {
            this._pCodeFragment.push("gl_FragColor = (");
        }
        this.analyzeExpr(pChildren[1]);
        if (this._pCodeVertex) {
            this._pCodeVertex.push(");");
            if (!pType.isBase()) {
                var i;
                var pVaryings = pFunction.pVertexShader._pVaryings;
                for (i = 0; i < pVaryings.length; i++) {
                    this._pCodeVertex.push(pVaryings[i], "=", pVar, ".", pVaryings[i].sName, ";");
                }
                this._pCodeVertex.push("gl_Position", "=", pVar.pType.pEffectType.pDesc._pSemantics["POSITION"].sName,
                                       ";");
                var pPointSize = pVar.pType.pEffectType.pDesc._pSemantics["PSIZE"];
                if (pPointSize) {
                    this._pCodeVertex.push("gl_PointSize", "=", pPointSize.sName, ";");
                }
            }
        }
        if (this._pCodeFragment) {
            this._pCodeFragment.push(");");
            if (pType.isStruct()) {
                this._pCodeFragment.push(".");
                this._pCodeFragment.push(pType.pEffectType.pOrders[0], ";");
            }
        }
        this._pCode(";");
    }
    else if (pChildren[0].sName === T_KW_DO) {
        //SimpleStmt : T_KW_DO Stmt T_KW_WHILE '(' Expr ')' ';'
        this.pushCode("do");
        this.analyzeStmt(pChildren[1]);
        this.pushCode("while");
        this.pushCode("(");
        this.analyzeExpr(pChildren[4]);
        this.pushCode(")");
        this.pushCode(";");
    }
    else if (pChildren[0].sName === STATEBLOCK) {
        //SimpleStmt : StmtBlock
        this.analyzeStmtBlock(pChildren[0]);
    }
    else if (pChildren[0].sName === T_KW_DISCARD) {
        //SimpleStmt : T_KW_DISCARD ';'
        this.pushCode("discard");
        this.pushCode(";");
    }
    else if (pChildren[0].sName === TYPEDECL) {
        //SimpleStmt : TypeDecl
        this.analyzeTypeDecl(pChildren[0]);
    }
    else if (pChildren[0].sName === VARIABLEDECL) {
        //SimpleStmt : VariableDecl
        this.analyzeVariableDecl(pChildren[0]);
    }
    else {
        //SimpleStmt : VarStructDecl
        this.analyzeVarStructDecl(pChildren[0]);
    }
};

Effect.prototype.analyzeParamList = function (pNode, pFunction) {
    var pChildren = pNode.pChildren;
    var i;
    var pVar;
    pFunction.pParameters = {};
    for (i = 1; i < pChildren.length - 1; i++) {
        if (pChildren[i].sName === PARAMETERDECL) {
            pVar = this.analyzeParameterDecl(pChildren[i]);
            if (!pVar.checkMe()) {
                error("You sucks 2");
                return;
            }
            pFunction.addParameter(pVar);
        }
    }
    return pFunction;
};
Effect.prototype.analyzeParameterDecl = function (pNode) {
    var pChildren = pNode.pChildren;
    var pVar = new EffectVariable();
    pVar.pType = this.analyzeParamUsageType(pChildren[0]);
    if (!pVar.pType.checkMe()) {
        error("You sucks 2");
        return;
    }
    pVar = this.analyzeVariable(pChildren[1], pVar);
    return pVar;
};
Effect.prototype.analyzeParamUsageType = function (pNode, pType) {
    pType = pType || new VariableType();
    var pChildren = pNode.pChildren;
    var i;
    for (i = 0; i < pChildren.length; i++) {
        if (pChildren[i].sName === TYPE) {
            pType.setType(this.convertType(pChildren[i]));
        }
        if (pChildren[i].sName === PARAMUSAGE) {
            pType.setUsage(pChildren[i], (this._isLocal || this._isAnnotation));
        }
    }
};
Effect.prototype.analyzeVarStructDecl = function (pNode) {
    var pChildren = pNode.pChildren;
    var i;
    var pVar;
    var pType = this.analyzeUsageStructDecl(pChildren[0]);
    this._pCurrentType = pType;
    for (i = 1; i < pChildren.length; i++) {
        if (pChildren[i].sName === VARIABLE) {
            pVar = this.analyzeVariable(pChildren[i]);
            pVar.setType(pType);
            this.addVariableDecl(pVar);
        }
    }
    this._pCurrentType = null;
};
Effect.prototype.analyzeUsageStructDecl = function (pNode, pType) {
    pType = pType || new VariableType();
    var pChildren = pNode.pChildren;
    var i;
    for (i = 0; i < pChildren.length - 1; i++) {
        pType.setUsage(pChildren[i]);
    }
    var pEffectType = new EffectType();
    pEffectType.fromStruct(this.analyzeStructDecl(pChildren[i]));
    this.addType(pEffectType);
    pType.setType(pEffectType);

    return pType;
};
Effect.prototype.analyzeTechniqueDecl = function (pNode) {
    var pChildren = pNode.pChildren;
    var i = 0;
    var pTech = new EffectTechnique();
    pTech.setName(pChildren[1].sValue);
    if (pChildren[2].sName === ANNOTATION) {
        this.analyzeAnnotation(pChildren[2], pTech);
        i++;
    }
    this.analyzeTechniqueBody(pChildren[2 + i], pTech);
    this.addTechnique(pTech);
    pNode.pAnalyzed = pTech;
    return pTech;
};
Effect.prototype.addTechnique = function (pTechnique) {
    this.pTechiques[pTechnique.sName] = pTechnique;
};
Effect.prototype.analyzeTechniqueBody = function (pNode, pTechnique) {
    var pChildren = pNode.pChildren;
    var i;
    var pPass;
    for (i = 1; i < pChildren.length - 1; i++) {
        pPass = this.analyzePassDecl(pChildren[i]);
        if (!pPass.checkMe()) {
            error("something bad with your pass");
        }
        pTechnique.addPass(pPass);
    }
    return pTechnique;
};
Effect.prototype.analyzePassDecl = function (pNode, pPass) {
    pPass = pPass || new EffectPass();
    var pChildren = pNode.pChildren;
    var i = 0;
    if (pChildren[1].sName === T_NON_TYPE_ID || pChildren[1].sName === T_TYPE_ID) {
        pPass.setName(pChildren[1].sValue);
        i++;
    }
    if (pChildren[1 + i] === ANNOTATION) {
        this.analyzeAnnotation(pChildren[1 + i], pPass);
        i++;
    }
    this.analyzeStateBlock(pChildren[1 + i], pPass);
    return pPass;
};
Effect.prototype.analyzeStateBlock = function (pNode, pPass) {
    var pChildren = pNode.pChildren;
    var i;
    for (i = 1; i < pChildren.length - 1; i++) {
        this.analyzeState(pChildren[i], pPass);
    }
};
Effect.prototype.analyzeState = function (pNode, pPass) {
    var pChildren = pNode.pChildren;
    var i;
    var eState = null;
    var pExpr = pChildren[2].pChildren[0];
    var sType = pChildren[0].sValue.toUpperCase();

    if (this._isSampler) {
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
            case "FILTER":
                eState = "FILTER";
                break;
            case "MAXANISOTROPY":
                eState = "MAXANISOTROPY";
                break;
            case "MAXLOD":
                eState = "MAXLOD";
                break;
            case "MINLOD":
                eState = "MINLOD";
                break;
            case "MIPLODBIAS":
                eState = "MIPLODBIAS";
                break;
            case "COMPARISONFUNC":
                eState = "COMPARISONFUNC";
                break;
            case "COMPARISONFILTER":
                eState = "COMPARISONFILTER";
                break;
            default:
                error("Oh no, but it is error");
                return;
        }
        if (isTexture) {
            var pTexture;
            if (pExpr.sValue === "{" || pExpr.sValue === undefined ||
                pChildren[3].pChildren[1].sName !== T_NON_TYPE_ID) {
                error("Wrong wrong");
                return;
            }
            pTexture = this.hasVariable(pChildren[3].pChildren[1].sValue);
            if (!pTexture) {
                error("bad with texture name");
                return;
            }
            this._pCurrentVar.setTexture(pTexture);
            return;
        }
        //TODO: add sampler valid tests
        this._pCurrentVar.setState(eState, pExpr.sValue);
        return;
    }
    else {
        var isVertex = false;
        var isPixel = false;

        if (pChildren[1].sName === STATEINDEX) {
            error("Unsupported state for pass... It`s webgl, baby(");
            return pPass;
        }
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
            if (pExpr.sName !== OBJECTEXPR) {
                error("Bad compile state. I don`t know what bad, but something exactly going wrong.");
                return;
            }
            this.newCode()
            this.analyzeExpr(pExpr);
            var pProgram = this._pCode;
            this.endCode();
            var pFunc = this.hasFunction(pProgram[0]);
            if (isVertex) {
                pPass.setVertexShader(pFunc);
                pFunc.isVertexShader = true;
            }
            else {
                pPass.setFragmentShader(pFunc);
                pFunc.isFragmentShader = true;
            }
            return pPass;
        }
        if (pExpr.sValue === "{" || pExpr.sValue === "<" ||
            pExpr.sValue === undefined) {
            error("Too difficult for webgl");
        }
        var sValue = pChildren[3].pChildren[0].sValue.toUpperCase();
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

        pPass.setState(eState, eValue);
        return pPass;
    }
};


Effect.prototype.getTypeFromTable = function (sName) {
    return this._pTypeTable[sName];
};

Effect.prototype.hasTypeName = function (sName) {

};
Effect.prototype.isBaseType = function (pNode) {
    switch (pNode.sName) {
        case T_KW_VOID:
        case T_KW_BOOL:
        case T_KW_INT:
        case T_KW_HALF:
        case T_KW_FLOAT:
        case T_KW_DOUBLE:
        case T_KW_VECTOR:
        case T_KW_MATRIX:
        case T_KW_STRING:
        case T_KW_TEXTURE:
        case T_KW_TEXTURE1D:
        case T_KW_TEXTURE2D:
        case T_KW_TEXTURE3D:
        case T_KW_TEXTURECUBE:
        case T_KW_SAMPLER:
        case T_KW_SAMPLER1D:
        case T_KW_SAMPLER2D:
        case T_KW_SAMPLER3D:
        case T_KW_SAMPLERCUBE:
        case T_KW_PIXELSHADER:
        case T_KW_VERTEXSHADER:
        case T_KW_PIXELFRAGMENT:
        case T_KW_VERTEXFRAGMENT:
        case T_KW_STATEBLOCK:
            return true;
    }
    return false;
};