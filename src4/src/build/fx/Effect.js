/// <reference path="../idl/IAFXEffect.ts" />
/// <reference path="../idl/parser/IParser.ts" />
/// <reference path="../idl/IAFXInstruction.ts" />
/// <reference path="../idl/IAFXComposer.ts" />
/// <reference path="../idl/IAFXComponent.ts" />
/// <reference path="../idl/EEffectErrors.ts" />
/// <reference path="../idl/IEffectErrorInfo.ts" />
/// <reference path="../idl/IScope.ts" />
/// <reference path="../idl/IMap.ts" />
var akra;
(function (akra) {
    /// <reference path="../time.ts" />
    /// <reference path="../math/math.ts" />
    /// <reference path="../debug.ts" />
    /// <reference path="errors.ts" />
    /// <reference path="ArithmeticExprInstruction.ts" />
    /// <reference path="AssignmentExprInstruction.ts" />
    /// <reference path="BoolInstruction.ts" />
    /// <reference path="BreakStmtInstruction.ts" />
    /// <reference path="CastExprInstruction.ts" />
    /// <reference path="ComplexExprInstruction.ts" />
    /// <reference path="ComplexTypeInstruction.ts" />
    /// <reference path="CompileExprInstruction.ts" />
    /// <reference path="ConditionalExprInstruction.ts" />
    /// <reference path="ConstructorCallInstruction.ts" />
    /// <reference path="DeclStmtInstruction.ts" />
    /// <reference path="ExprStmtInstruction.ts" />
    /// <reference path="ExprTemplateTranslator.ts" />
    /// <reference path="ExtractStmtInstruction.ts" />
    /// <reference path="FloatInstruction.ts" />
    /// <reference path="ForStmtInstruction.ts" />
    /// <reference path="FunctionCallInstruction.ts" />
    /// <reference path="FunctionDefInstruction.ts" />
    /// <reference path="IdExprInstruction.ts" />
    /// <reference path="IfStmtInstruction.ts" />
    /// <reference path="IntInstruction.ts" />
    /// <reference path="FunctionInstruction.ts" />
    /// <reference path="IdInstruction.ts" />
    /// <reference path="InitExprInstruction.ts" />
    /// <reference path="InstructionCollector.ts" />
    /// <reference path="LogicalExprInstruction.ts" />
    /// <reference path="MemExprInstruction.ts" />
    /// <reference path="PassInstruction.ts" />
    /// <reference path="PostfixArithmeticInstruction.ts" />
    /// <reference path="PostfixIndexInstruction.ts" />
    /// <reference path="PostfixPointInstruction.ts" />
    /// <reference path="PrimaryExprInstruction.ts" />
    /// <reference path="ProgramScope.ts" />
    /// <reference path="RelationalExprInstruction.ts" />
    /// <reference path="ReturnStmtInstruction.ts" />
    /// <reference path="SamplerStateBlockInstruction.ts" />
    /// <reference path="SemicolonStmtInstruction.ts" />
    /// <reference path="SimpleInstruction.ts" />
    /// <reference path="StmtBlockInstruction.ts" />
    /// <reference path="StringInstruction.ts" />
    /// <reference path="SystemCallInstruction.ts" />
    /// <reference path="SystemFunctionInstruction.ts" />
    /// <reference path="SystemTypeInstruction.ts" />
    /// <reference path="TechniqueInstruction.ts" />
    /// <reference path="TypeInstruction.ts" />
    /// <reference path="VariableTypeInstruction.ts" />
    /// <reference path="VariableInstruction.ts" />
    /// <reference path="UnaryExprInstruction.ts" />
    /// <reference path="WhileStmtInstruction.ts" />
    (function (fx) {
        var Vec2 = akra.math.Vec2;
        var Vec3 = akra.math.Vec3;
        var Vec4 = akra.math.Vec4;
        var Mat3 = akra.math.Mat3;
        var Mat4 = akra.math.Mat4;

        /** @const */
        var TEMPLATE_TYPE = "template";

        var Effect = (function () {
            function Effect(pComposer) {
                this._pComposer = null;
                this._pParseTree = null;
                this._pAnalyzedNode = null;
                this._pEffectScope = null;
                this._pCurrentInstruction = null;
                this._pCurrentFunction = null;
                this._pStatistics = null;
                this._sAnalyzedFileName = "";
                this._pSystemMacros = null;
                this._pSystemTypes = null;
                this._pSystemFunctionsMap = null;
                this._pSystemFunctionHashMap = null;
                this._pSystemVariables = null;
                this._pPointerForExtractionList = null;
                this._pFunctionWithImplementationList = null;
                this._pTechniqueList = null;
                this._pTechniqueMap = null;
                this._isAnalyzeInPass = false;
                this._sProvideNameSpace = "";
                this._pImportedGlobalTechniqueList = null;
                this._pAddedTechniqueList = null;
                this._pComposer = pComposer;

                this._pParseTree = null;
                this._pAnalyzedNode = null;

                this._pEffectScope = new akra.fx.ProgramScope();
                this._pCurrentInstruction = null;

                this._pStatistics = null;
                this._sAnalyzedFileName = "";

                this._pPointerForExtractionList = [];

                this._pFunctionWithImplementationList = [];
                this._pTechniqueList = [];
                this._pTechniqueMap = {};

                this.initSystemMacros();
                this.initSystemTypes();
                this.initSystemFunctions();
                this.initSystemVariables();
            }
            Effect.prototype.analyze = function (pTree) {
                var pRootNode = pTree.getRoot();
                var iParseTime = akra.time();

                // LOG(this);
                this._pParseTree = pTree;
                this._pStatistics = { time: 0 };

                try  {
                    this.newScope();

                    // LOG("ok");
                    this.analyzeGlobalUseDecls();

                    // LOG("ok");
                    this.analyzeGlobalProvideDecls();

                    // LOG("ok");
                    this.analyzeGlobalTypeDecls();

                    // LOG("ok");
                    this.analyzeFunctionDefinitions();

                    // LOG("ok");
                    this.analyzeGlobalImports();

                    // LOG("ok");
                    this.analyzeTechniqueImports();

                    // LOG("ok");
                    this.analyzeVariableDecls();

                    // LOG("ok");
                    this.analyzeFunctionDecls();

                    // LOG("ok");
                    this.analyzeTechniques();

                    // LOG("ok");
                    // this.analyzeTypes();
                    // this.preAnalyzeFunctions();
                    // this.preAnalyzeVariables();
                    // this.preAnalyzeTechniques();
                    // this.analyzeDecls();
                    // this.analyzeEffect();
                    // this.postAnalyzeEffect();
                    // this.checkEffect();
                    this.endScope();
                } catch (e) {
                    if (akra.config.DEBUG) {
                        throw e;
                    } else {
                        return false;
                    }
                }

                //Stats
                iParseTime = akra.time() - iParseTime;
                this._pStatistics.time = iParseTime;

                //LOG(this, iParseTime);
                return true;
            };

            Effect.prototype.getStats = function () {
                return this._pStatistics;
            };

            Effect.prototype.setAnalyzedFileName = function (sFileName) {
                this._sAnalyzedFileName = sFileName;
            };

            Effect.prototype.clear = function () {
            };

            Effect.prototype.getTechniqueList = function () {
                return this._pTechniqueList;
            };

            Effect.getBaseVertexOutType = function () {
                return Effect.pSystemVertexOut;
            };
            Effect.getSystemType = function (sTypeName) {
                //boolean, string, float and others
                return akra.isDef(Effect.pSystemTypes[sTypeName]) ? Effect.pSystemTypes[sTypeName] : null;
            };

            Effect.getSystemVariable = function (sName) {
                return akra.isDef(Effect.pSystemVariables[sName]) ? Effect.pSystemVariables[sName] : null;
            };

            Effect.getSystemMacros = function (sName) {
                return akra.isDef(Effect.pSystemMacros[sName]) ? Effect.pSystemMacros[sName] : null;
            };

            Effect.findSystemFunction = function (sFunctionName, pArguments) {
                var pSystemFunctions = Effect.pSystemFunctions[sFunctionName];

                if (!akra.isDef(pSystemFunctions)) {
                    return null;
                }

                if (akra.isNull(pArguments)) {
                    for (var i = 0; i < pSystemFunctions.length; i++) {
                        if (pSystemFunctions[i].getNumNeededArguments() === 0) {
                            return pSystemFunctions[i];
                        }
                    }
                }

                for (var i = 0; i < pSystemFunctions.length; i++) {
                    if (pArguments.length !== pSystemFunctions[i].getNumNeededArguments()) {
                        continue;
                    }

                    var pTestedArguments = pSystemFunctions[i].getArguments();

                    var isOk = true;

                    for (var j = 0; j < pArguments.length; j++) {
                        isOk = false;

                        if (!pArguments[j].getType().isEqual(pTestedArguments[j].getType())) {
                            break;
                        }

                        isOk = true;
                    }

                    if (isOk) {
                        return pSystemFunctions[i];
                    }
                }
            };

            Effect.createVideoBufferVariable = function () {
                var pBuffer = new akra.fx.VariableDeclInstruction();
                var pBufferType = new akra.fx.VariableTypeInstruction();
                var pBufferName = new akra.fx.IdInstruction();

                pBufferType.pushType(Effect.getSystemType("video_buffer"));

                pBuffer.push(pBufferType, true);
                pBuffer.push(pBufferName, true);

                return pBuffer;
            };

            Effect.getExternalType = function (pType) {
                if (pType.isEqual(Effect.getSystemType("int")) || pType.isEqual(Effect.getSystemType("float"))) {
                    return Number;
                } else if (pType.isEqual(Effect.getSystemType("bool"))) {
                    return Boolean;
                } else if (pType.isEqual(Effect.getSystemType("float2")) || pType.isEqual(Effect.getSystemType("bool2")) || pType.isEqual(Effect.getSystemType("int2"))) {
                    return Vec2;
                } else if (pType.isEqual(Effect.getSystemType("float3")) || pType.isEqual(Effect.getSystemType("bool3")) || pType.isEqual(Effect.getSystemType("int3"))) {
                    return Vec3;
                } else if (pType.isEqual(Effect.getSystemType("float4")) || pType.isEqual(Effect.getSystemType("bool4")) || pType.isEqual(Effect.getSystemType("int4"))) {
                    return Vec4;
                } else if (pType.isEqual(Effect.getSystemType("float3x3")) || pType.isEqual(Effect.getSystemType("bool3x3")) || pType.isEqual(Effect.getSystemType("int3x3"))) {
                    return Mat3;
                } else if (pType.isEqual(Effect.getSystemType("float4x4")) || pType.isEqual(Effect.getSystemType("bool4x4")) || pType.isEqual(Effect.getSystemType("int4x4"))) {
                    return Mat4;
                } else {
                    return null;
                }
            };

            Effect.isMatrixType = function (pType) {
                return pType.isEqual(Effect.getSystemType("float2x2")) || pType.isEqual(Effect.getSystemType("float3x3")) || pType.isEqual(Effect.getSystemType("float4x4")) || pType.isEqual(Effect.getSystemType("int2x2")) || pType.isEqual(Effect.getSystemType("int3x3")) || pType.isEqual(Effect.getSystemType("int4x4")) || pType.isEqual(Effect.getSystemType("bool2x2")) || pType.isEqual(Effect.getSystemType("bool3x3")) || pType.isEqual(Effect.getSystemType("bool4x4"));
            };

            Effect.isVectorType = function (pType) {
                return pType.isEqual(Effect.getSystemType("float2")) || pType.isEqual(Effect.getSystemType("float3")) || pType.isEqual(Effect.getSystemType("float4")) || pType.isEqual(Effect.getSystemType("bool2")) || pType.isEqual(Effect.getSystemType("bool3")) || pType.isEqual(Effect.getSystemType("bool4")) || pType.isEqual(Effect.getSystemType("int2")) || pType.isEqual(Effect.getSystemType("int3")) || pType.isEqual(Effect.getSystemType("int4"));
            };

            Effect.isScalarType = function (pType) {
                return pType.isEqual(Effect.getSystemType("bool")) || pType.isEqual(Effect.getSystemType("int")) || pType.isEqual(Effect.getSystemType("ptr")) || pType.isEqual(Effect.getSystemType("float"));
            };

            Effect.isFloatBasedType = function (pType) {
                return pType.isEqual(Effect.getSystemType("float")) || pType.isEqual(Effect.getSystemType("float2")) || pType.isEqual(Effect.getSystemType("float3")) || pType.isEqual(Effect.getSystemType("float4")) || pType.isEqual(Effect.getSystemType("float2x2")) || pType.isEqual(Effect.getSystemType("float3x3")) || pType.isEqual(Effect.getSystemType("float4x4")) || pType.isEqual(Effect.getSystemType("ptr"));
            };

            Effect.isIntBasedType = function (pType) {
                return pType.isEqual(Effect.getSystemType("int")) || pType.isEqual(Effect.getSystemType("int2")) || pType.isEqual(Effect.getSystemType("int3")) || pType.isEqual(Effect.getSystemType("int4")) || pType.isEqual(Effect.getSystemType("int2x2")) || pType.isEqual(Effect.getSystemType("int3x3")) || pType.isEqual(Effect.getSystemType("int4x4"));
            };

            Effect.isBoolBasedType = function (pType) {
                return pType.isEqual(Effect.getSystemType("bool")) || pType.isEqual(Effect.getSystemType("bool2")) || pType.isEqual(Effect.getSystemType("bool3")) || pType.isEqual(Effect.getSystemType("bool4")) || pType.isEqual(Effect.getSystemType("bool2x2")) || pType.isEqual(Effect.getSystemType("bool3x3")) || pType.isEqual(Effect.getSystemType("bool4x4"));
            };

            Effect.isSamplerType = function (pType) {
                return pType.isEqual(Effect.getSystemType("sampler")) || pType.isEqual(Effect.getSystemType("sampler2D")) || pType.isEqual(Effect.getSystemType("samplerCUBE")) || pType.isEqual(Effect.getSystemType("video_buffer"));
            };

            Effect.prototype.generateSuffixLiterals = function (pLiterals, pOutput, iDepth) {
                if (typeof iDepth === "undefined") { iDepth = 0; }
                if (iDepth >= pLiterals.length) {
                    return;
                }

                if (iDepth === 0) {
                    for (var i = 0; i < pLiterals.length; i++) {
                        pOutput[pLiterals[i]] = true;
                    }

                    iDepth = 1;
                }

                var pOutputKeys = Object.keys(pOutput);

                for (var i = 0; i < pLiterals.length; i++) {
                    for (var j = 0; j < pOutputKeys.length; j++) {
                        if (pOutputKeys[j].indexOf(pLiterals[i]) !== -1) {
                            pOutput[pOutputKeys[j] + pLiterals[i]] = false;
                        } else {
                            pOutput[pOutputKeys[j] + pLiterals[i]] = (pOutput[pOutputKeys[j]] === false) ? false : true;
                        }
                    }
                }

                iDepth++;

                this.generateSuffixLiterals(pLiterals, pOutput, iDepth);
            };

            Effect.prototype.initSystemMacros = function () {
                if (akra.isNull(Effect.pSystemMacros)) {
                    this._pSystemMacros = Effect.pSystemMacros = {};
                    this.addSystemMacros();
                }

                this._pSystemMacros = Effect.pSystemMacros;
            };

            Effect.prototype.initSystemTypes = function () {
                if (akra.isNull(Effect.pSystemTypes)) {
                    this._pSystemTypes = Effect.pSystemTypes = {};
                    this.addSystemTypeScalar();
                    this.addSystemTypeVector();
                    this.addSystemTypeMatrix();

                    this.generateBaseVertexOutput();
                }

                this._pSystemTypes = Effect.pSystemTypes;
            };

            Effect.prototype.initSystemFunctions = function () {
                if (akra.isNull(Effect.pSystemFunctions)) {
                    this._pSystemFunctionsMap = Effect.pSystemFunctions = {};
                    this.addSystemFunctions();
                }

                this._pSystemFunctionsMap = Effect.pSystemFunctions;
            };

            Effect.prototype.initSystemVariables = function () {
                if (akra.isNull(Effect.pSystemVariables)) {
                    this._pSystemVariables = Effect.pSystemVariables = {};
                    this.addSystemVariables();
                }

                this._pSystemVariables = Effect.pSystemVariables;
            };

            Effect.prototype.addSystemMacros = function () {
                this.generateSystemMacros("ExtractMacros", "\n#ifdef AKRA_FRAGMENT\n" + "//#define texture2D(sampler, ) texture2D\n" + "#else\n" + "#define texture2D(A, B) texture2DLod(A, B, 0.)\n" + "#endif\n" + "#ifndef A_VB_COMPONENT3\n" + "#define A_VB_COMPONENT4\n" + "#endif\n" + "#ifdef A_VB_COMPONENT4\n" + "#define A_VB_ELEMENT_SIZE 4.\n" + "#endif\n" + "#ifdef A_VB_COMPONENT3\n" + "#define A_VB_ELEMENT_SIZE 3.\n" + "#endif\n" + "#define A_tex2D(S, H, X, Y) texture2D(S, vec2(H.stepX * X , H.stepY * Y))\n" + "#define A_tex2Dv(S, H, V) texture2D(S, V)\n");
            };

            Effect.prototype.addSystemVariables = function () {
                this.generateSystemVariable("fragColor", "gl_FragColor", "float4", false, true, true);
                this.generateSystemVariable("fragCoord", "gl_FragCoord", "float4", false, true, true);
                this.generateSystemVariable("frontFacing", "gl_FrontFacing", "bool", false, true, true);
                this.generateSystemVariable("pointCoord", "gl_PointCoord", "float2", false, true, true);
                this.generateSystemVariable("resultAFXColor", "resultAFXColor", "float4", false, true, true);

                //Engine variable for passes
                this.generatePassEngineVariable();
            };

            Effect.prototype.generateSystemVariable = function (sName, sRealName, sTypeName, isForVertex, isForPixel, isOnlyRead) {
                if (akra.isDef(this._pSystemVariables[sName])) {
                    return;
                }

                var pVariableDecl = new akra.fx.VariableDeclInstruction();
                var pName = new akra.fx.IdInstruction();
                var pType = new akra.fx.VariableTypeInstruction();

                pName.setName(sName);
                pName.setRealName(sRealName);

                pType.pushType(Effect.getSystemType(sTypeName));

                if (isOnlyRead) {
                    pType._canWrite(false);
                }

                pVariableDecl._setForVertex(isForVertex);
                pVariableDecl._setForPixel(isForPixel);

                pVariableDecl.push(pType, true);
                pVariableDecl.push(pName, true);

                this._pSystemVariables[sName] = pVariableDecl;

                pVariableDecl.setBuiltIn(true);
            };

            Effect.prototype.generatePassEngineVariable = function () {
                var pVariableDecl = new akra.fx.VariableDeclInstruction();
                var pName = new akra.fx.IdInstruction();
                var pType = new akra.fx.VariableTypeInstruction();

                pType._canWrite(false);

                pType._markAsUnverifiable(true);
                pName.setName("engine");
                pName.setRealName("engine");

                pVariableDecl.push(pType, true);
                pVariableDecl.push(pName, true);

                this._pSystemVariables["engine"] = pVariableDecl;
            };

            Effect.prototype.generateBaseVertexOutput = function () {
                //TODO: fix defenition of this variables
                var pOutBasetype = new akra.fx.ComplexTypeInstruction();

                var pPosition = new akra.fx.VariableDeclInstruction();
                var pPointSize = new akra.fx.VariableDeclInstruction();
                var pPositionType = new akra.fx.VariableTypeInstruction();
                var pPointSizeType = new akra.fx.VariableTypeInstruction();
                var pPositionId = new akra.fx.IdInstruction();
                var pPointSizeId = new akra.fx.IdInstruction();

                pPositionType.pushType(Effect.getSystemType("float4"));
                pPointSizeType.pushType(Effect.getSystemType("float"));

                pPositionId.setName("pos");
                pPositionId.setRealName("POSITION");

                pPointSizeId.setName("psize");
                pPointSizeId.setRealName("PSIZE");

                pPosition.push(pPositionType, true);
                pPosition.push(pPositionId, true);

                pPointSize.push(pPointSizeType, true);
                pPointSize.push(pPointSizeId, true);

                pPosition.setSemantic("POSITION");
                pPointSize.setSemantic("PSIZE");

                var pFieldCollector = new akra.fx.InstructionCollector();
                pFieldCollector.push(pPosition, false);
                pFieldCollector.push(pPointSize, false);

                pOutBasetype.addFields(pFieldCollector, true);

                pOutBasetype.setName("VS_OUT");
                pOutBasetype.setRealName("VS_OUT_S");

                Effect.pSystemVertexOut = pOutBasetype;
            };

            Effect.prototype.addSystemFunctions = function () {
                this._pSystemFunctionHashMap = {};

                this.generateSystemFunction("dot", "dot($1,$2)", "float", [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("mul", "$1*$2", TEMPLATE_TYPE, [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float", "int", "float2", "float3", "float4"]);
                this.generateSystemFunction("mod", "mod($1,$2)", "float", ["float", "float"], null);
                this.generateSystemFunction("floor", "floor($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("ceil", "ceil($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("fract", "fract($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("abs", "abs($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("normalize", "normalize($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("length", "length($1)", "float", [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("cross", "cross($1, $2)", "float3", ["float3", "float3"], null);
                this.generateSystemFunction("reflect", "reflect($1,$2)", TEMPLATE_TYPE, [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("max", "max($1,$2)", TEMPLATE_TYPE, [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("max", "max($1,$2)", TEMPLATE_TYPE, [TEMPLATE_TYPE, "float"], ["float2", "float3", "float4"]);

                this.generateSystemFunction("min", "min($1,$2)", TEMPLATE_TYPE, [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("min", "min($1,$2)", TEMPLATE_TYPE, [TEMPLATE_TYPE, "float"], ["float2", "float3", "float4"]);

                this.generateSystemFunction("mix", "mix($1,$2,$3)", TEMPLATE_TYPE, [TEMPLATE_TYPE, TEMPLATE_TYPE, TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("mix", "mix($1,$2,$3)", TEMPLATE_TYPE, [TEMPLATE_TYPE, TEMPLATE_TYPE, "float"], ["float2", "float3", "float4"]);

                this.generateSystemFunction("clamp", "clamp($1,$2,$3)", TEMPLATE_TYPE, [TEMPLATE_TYPE, TEMPLATE_TYPE, TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("clamp", "clamp($1,$2,$3)", TEMPLATE_TYPE, [TEMPLATE_TYPE, "float", "float"], ["float2", "float3", "float4"]);

                this.generateSystemFunction("pow", "pow($1,$2)", TEMPLATE_TYPE, [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("mod", "mod($1,$2)", TEMPLATE_TYPE, [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float2", "float3", "float4"]);
                this.generateSystemFunction("mod", "mod($1,$2)", TEMPLATE_TYPE, [TEMPLATE_TYPE, "float"], ["float2", "float3", "float4"]);
                this.generateSystemFunction("exp", "exp($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("exp2", "exp2($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("log", "log($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("log2", "log2($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("inversesqrt", "inversesqrt($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("sqrt", "sqrt($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);

                this.generateSystemFunction("all", "all($1)", "bool", [TEMPLATE_TYPE], ["bool2", "bool3", "bool4"]);
                this.generateSystemFunction("any", "any($1)", "bool", [TEMPLATE_TYPE], ["bool2", "bool3", "bool4"]);
                this.generateSystemFunction("not", "not($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["bool2", "bool3", "bool4"]);

                this.generateSystemFunction("distance", "distance($1,$2)", "float", [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);

                this.generateSystemFunction("lessThan", "lessThan($1,$2)", "bool2", [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float2", "int2"]);
                this.generateSystemFunction("lessThan", "lessThan($1,$2)", "bool3", [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float3", "int3"]);
                this.generateSystemFunction("lessThan", "lessThan($1,$2)", "bool4", [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float4", "int4"]);

                this.generateSystemFunction("lessThanEqual", "lessThanEqual($1,$2)", "bool2", [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float2", "int2"]);
                this.generateSystemFunction("lessThanEqual", "lessThanEqual($1,$2)", "bool3", [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float3", "int3"]);
                this.generateSystemFunction("lessThanEqual", "lessThanEqual($1,$2)", "bool4", [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float4", "int4"]);

                this.generateSystemFunction("equal", "equal($1,$2)", "bool2", [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float2", "int2"]);
                this.generateSystemFunction("equal", "equal($1,$2)", "bool3", [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float3", "int3"]);
                this.generateSystemFunction("equal", "equal($1,$2)", "bool4", [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float4", "int4"]);
                this.generateSystemFunction("equal", "equal($1,$2)", TEMPLATE_TYPE, [TEMPLATE_TYPE, TEMPLATE_TYPE], ["bool2", "bool3", "bool4"]);

                this.generateSystemFunction("notEqual", "notEqual($1,$2)", "bool2", [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float2", "int2"]);
                this.generateSystemFunction("notEqual", "notEqual($1,$2)", "bool3", [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float3", "int3"]);
                this.generateSystemFunction("notEqual", "notEqual($1,$2)", "bool4", [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float4", "int4"]);
                this.generateSystemFunction("notEqual", "notEqual($1,$2)", TEMPLATE_TYPE, [TEMPLATE_TYPE, TEMPLATE_TYPE], ["bool2", "bool3", "bool4"]);

                this.generateSystemFunction("greaterThan", "greaterThan($1,$2)", "bool2", [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float2", "int2"]);
                this.generateSystemFunction("greaterThan", "greaterThan($1,$2)", "bool3", [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float3", "int3"]);
                this.generateSystemFunction("greaterThan", "greaterThan($1,$2)", "bool4", [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float4", "int4"]);

                this.generateSystemFunction("greaterThanEqual", "greaterThanEqual($1,$2)", "bool2", [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float2", "int2"]);
                this.generateSystemFunction("greaterThanEqual", "greaterThanEqual($1,$2)", "bool3", [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float3", "int3"]);
                this.generateSystemFunction("greaterThanEqual", "greaterThanEqual($1,$2)", "bool4", [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float4", "int4"]);

                this.generateSystemFunction("radians", "radians($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("degrees", "degrees($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("sin", "sin($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("cos", "cos($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("tan", "tan($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("asin", "asin($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("acos", "acos($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("atan", "atan($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("atan", "atan($1, $2)", TEMPLATE_TYPE, [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);

                this.generateSystemFunction("tex2D", "texture2D($1,$2)", "float4", ["sampler", "float2"], null);
                this.generateSystemFunction("tex2D", "texture2D($1,$2)", "float4", ["sampler2D", "float2"], null);
                this.generateSystemFunction("tex2DProj", "texture2DProj($1,$2)", "float4", ["sampler", "float3"], null);
                this.generateSystemFunction("tex2DProj", "texture2DProj($1,$2)", "float4", ["sampler2D", "float3"], null);
                this.generateSystemFunction("tex2DProj", "texture2DProj($1,$2)", "float4", ["sampler", "float4"], null);
                this.generateSystemFunction("tex2DProj", "texture2DProj($1,$2)", "float4", ["sampler2D", "float4"], null);
                this.generateSystemFunction("texCUBE", "textureCube($1,$2)", "float4", ["sampler", "float3"], null);
                this.generateSystemFunction("texCUBE", "textureCube($1,$2)", "float4", ["samplerCUBE", "float3"], null);

                this.generateSystemFunction("tex2D", "texture2D($1,$2,$3)", "float4", ["sampler", "float2", "float"], null, false, true);
                this.generateSystemFunction("tex2D", "texture2D($1,$2,$3)", "float4", ["sampler2D", "float2", "float"], null, false, true);
                this.generateSystemFunction("tex2DProj", "texture2DProj($1,$2,$3)", "float4", ["sampler", "float3", "float"], null, false, true);
                this.generateSystemFunction("tex2DProj", "texture2DProj($1,$2,$3)", "float4", ["sampler2D", "float3", "float"], null, false, true);
                this.generateSystemFunction("tex2DProj", "texture2DProj($1,$2,$3)", "float4", ["sampler", "float4", "float"], null, false, true);
                this.generateSystemFunction("tex2DProj", "texture2DProj($1,$2,$3)", "float4", ["sampler2D", "float4", "float"], null, false, true);
                this.generateSystemFunction("texCUBE", "textureCube($1,$2,$3)", "float4", ["sampler", "float3", "float"], null, false, true);
                this.generateSystemFunction("texCUBE", "textureCube($1,$2,$3)", "float4", ["samplerCUBE", "float3", "float"], null, false, true);

                this.generateSystemFunction("tex2DLod", "texture2DLod($1,$2,$3)", "float4", ["sampler", "float2", "float"], null, true, false);
                this.generateSystemFunction("tex2DLod", "texture2DLod($1,$2,$3)", "float4", ["sampler2D", "float2", "float"], null, true, false);
                this.generateSystemFunction("tex2DProjLod", "texture2DProjLod($1,$2,$3)", "float4", ["sampler", "float3", "float"], null, true, false);
                this.generateSystemFunction("tex2DProjLod", "texture2DProjLod($1,$2,$3)", "float4", ["sampler2D", "float3", "float"], null, true, false);
                this.generateSystemFunction("tex2DProjLod", "texture2DProjLod($1,$2,$3)", "float4", ["sampler", "float4", "float"], null, true, false);
                this.generateSystemFunction("tex2DProjLod", "texture2DProjLod($1,$2,$3)", "float4", ["sampler2D", "float4", "float"], null, true, false);
                this.generateSystemFunction("texCUBELod", "textureCubeLod($1,$2,$3)", "float4", ["sampler", "float3", "float"], null, true, false);
                this.generateSystemFunction("texCUBELod", "textureCubeLod($1,$2,$3)", "float4", ["samplerCUBE", "float3", "float"], null, true, false);

                //OES_standard_derivatives
                this.generateSystemFunction("dFdx", "dFdx($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("dFdy", "dFdy($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("width", "width($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("fwidth", "fwidth($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("smoothstep", "smoothstep($1, $2, $3)", "float3", ["float3", "float3", "float3"], null);

                // this.generateSystemFunction("smoothstep", "smoothstep($1, $2, $3)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                // this.generateSystemFunction("smoothstep", "smoothstep($1, $2, $3)", TEMPLATE_TYPE, ["float", "float", TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("frac", "fract($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("lerp", "mix($1,$2,$3)", TEMPLATE_TYPE, [TEMPLATE_TYPE, TEMPLATE_TYPE, TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
                this.generateSystemFunction("lerp", "mix($1,$2,$3)", TEMPLATE_TYPE, [TEMPLATE_TYPE, TEMPLATE_TYPE, "float"], ["float2", "float3", "float4"]);

                //Extracts
                this.generateNotBuiltInSystemFuction("extractHeader", "void A_extractTextureHeader(const sampler2D src, out A_TextureHeader texture)", "{vec4 v = texture2D(src, vec2(0.00001)); " + "texture = A_TextureHeader(v.r, v.g, v.b, v.a);}", "void", ["video_buffer_header"], null, ["ExtractMacros"]);

                this.generateNotBuiltInSystemFuction("extractFloat", "float A_extractFloat(const sampler2D sampler, const A_TextureHeader header, const float offset)", "{float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " + "float y = floor(pixelNumber / header.width) + .5; " + "float x = mod(pixelNumber, header.width) + .5; " + "int shift = int(mod(offset, A_VB_ELEMENT_SIZE)); " + "\n#ifdef A_VB_COMPONENT4\n" + "if(shift == 0) return A_tex2D(sampler, header, x, y).r; " + "else if(shift == 1) return A_tex2D(sampler, header, x, y).g; " + "else if(shift == 2) return A_tex2D(sampler, header, x, y).b; " + "else if(shift == 3) return A_tex2D(sampler, header, x, y).a; " + "\n#endif\n" + "return 0.;}", "float", ["video_buffer_header"], ["extractHeader"], ["ExtractMacros"]);

                this.generateNotBuiltInSystemFuction("extractFloat2", "vec2 A_extractVec2(const sampler2D sampler, const A_TextureHeader header, const float offset)", "{float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " + "float y = floor(pixelNumber / header.width) + .5; " + "float x = mod(pixelNumber, header.width) + .5; " + "int shift = int(mod(offset, A_VB_ELEMENT_SIZE)); " + "\n#ifdef A_VB_COMPONENT4\n" + "if(shift == 0) return A_tex2D(sampler, header, x, y).rg; " + "else if(shift == 1) return A_tex2D(sampler, header, x, y).gb; " + "else if(shift == 2) return A_tex2D(sampler, header, x, y).ba; " + "else if(shift == 3) { " + "if(int(x) == int(header.width - 1.)) " + "return vec2(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, 0.5, (y + 1.)).r); " + "else " + "return vec2(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, (x + 1.), y).r); " + "} " + "\n#endif\n" + "return vec2(0.);}", "float2", ["video_buffer_header"], ["extractHeader"], ["ExtractMacros"]);

                this.generateNotBuiltInSystemFuction("extractFloat3", "vec3 A_extractVec3(const sampler2D sampler, const A_TextureHeader header, const float offset)", "{float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " + "float y = floor(pixelNumber / header.width) + .5; " + "float x = mod(pixelNumber, header.width) + .5; " + "int shift = int(mod(offset, A_VB_ELEMENT_SIZE)); " + "\n#ifdef A_VB_COMPONENT4\n" + "if(shift == 0) return A_tex2D(sampler, header, x, y).rgb; " + "else if(shift == 1) return A_tex2D(sampler, header, x, y).gba; " + "else if(shift == 2){ " + "if(int(x) == int(header.width - 1.))  return vec3(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, 0.5, (y + 1.)).r); " + "else return vec3(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, (x + 1.), y).r);} " + "else if(shift == 3){ " + "if(int(x) == int(header.width - 1.))  return vec3(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, 0.5, (y + 1.)).rg); " + "else return vec3(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, (x + 1.), y).rg);} " + "\n#endif\n" + "\n#ifdef A_VB_COMPONENT3\n" + "if(shift == 0) return A_tex2D(sampler, header,vec2(x,header.stepY*y)).rgb; " + "else if(shift == 1){ " + "if(x == header.width - 1.) return vec3(A_tex2D(sampler, header, x, y).gb, A_tex2D(sampler, header, 0.5, (y + 1.)).r); " + "else return vec3(A_tex2D(sampler, header, x, y).gb, A_tex2D(sampler, header, (x + 1.), y).r);} " + "else if(shift == 3){ " + "if(x == header.width - 1.) return vec3(A_tex2D(sampler, header, x, y).b, A_tex2D(sampler, header, 0.5, (y + 1.)).rg); " + "else return vec3(A_tex2D(sampler, header, x, y).b, A_tex2D(sampler, header, (x + 1)., y).rg);} " + "\n#endif\n" + "return vec3(0.);}", "float3", ["video_buffer_header"], ["extractHeader"], ["ExtractMacros"]);

                this.generateNotBuiltInSystemFuction("extractFloat4", "vec4 A_extractVec4(const sampler2D sampler, const A_TextureHeader header, const float offset)", "{float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " + "float y = floor(pixelNumber / header.width) + .5; " + "float x = mod(pixelNumber, header.width) + .5; " + "int shift = int(mod(offset, A_VB_ELEMENT_SIZE)); " + "\n#ifdef A_VB_COMPONENT4\n" + "if(shift == 0) return A_tex2D(sampler, header, x, y); " + "else if(shift == 1){ " + "if(int(x) == int(header.width - 1.)) " + "return vec4(A_tex2D(sampler, header, x, y).gba, A_tex2D(sampler, header, 0.5, (y + 1.)).r); " + "else " + "return vec4(A_tex2D(sampler, header, x, y).gba, A_tex2D(sampler, header, (x + 1.), y).r);} " + "else if(shift == 2){ " + "if(int(x) == int(header.width - 1.)) " + "return vec4(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, 0.5, (y + 1.)).rg); " + "else " + "return vec4(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, (x + 1.), y).rg);} " + "else if(shift == 3){ " + "if(int(x) == int(header.width - 1.)) " + "return vec4(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, 0.5, (y + 1.)).rgb); " + "else return vec4(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, (x + 1.), y).rgb);} " + "\n#endif\n" + "\n#ifdef A_VB_COMPONENT3\n" + "\n#endif\n" + "return vec4(0.);}", "float4", ["video_buffer_header"], ["extractHeader"], ["ExtractMacros"]);

                this.generateNotBuiltInSystemFuction("findPixel", "vec2 A_findPixel(const A_TextureHeader header, const float offset)", "{float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " + "return vec2(header.stepX * (mod(pixelNumber, header.width) + .5), header.stepY * (floor(pixelNumber / header.width) + .5));}", "float2", ["video_buffer_header"], ["extractHeader"], ["ExtractMacros"]);

                this.generateNotBuiltInSystemFuction("extractFloat4x4", "mat4 A_extractMat4(const sampler2D sampler, const A_TextureHeader header, const float offset)", "{return mat4(A_tex2Dv(sampler, header, A_findPixel(header, offset))," + "A_tex2Dv(sampler, header, A_findPixel(header, offset + 4.))," + "A_tex2Dv(sampler, header, A_findPixel(header, offset + 8.))," + "A_tex2Dv(sampler, header, A_findPixel(header, offset + 12.)));}", "float4x4", ["video_buffer_header"], ["findPixel"], ["ExtractMacros"]);
            };

            Effect.prototype.generateSystemFunction = function (sName, sTranslationExpr, sReturnTypeName, pArgumentsTypes, pTemplateTypes, isForVertex, isForPixel) {
                if (typeof isForVertex === "undefined") { isForVertex = true; }
                if (typeof isForPixel === "undefined") { isForPixel = true; }
                var pExprTranslator = new akra.fx.ExprTemplateTranslator(sTranslationExpr);
                var pSystemFunctions = this._pSystemFunctionsMap;
                var pTypes = null;
                var sFunctionHash = "";
                var pReturnType = null;
                var pFunction = null;

                if (!akra.isNull(pTemplateTypes)) {
                    for (var i = 0; i < pTemplateTypes.length; i++) {
                        pTypes = [];
                        sFunctionHash = sName + "(";
                        pReturnType = (sReturnTypeName === TEMPLATE_TYPE) ? Effect.getSystemType(pTemplateTypes[i]) : Effect.getSystemType(sReturnTypeName);

                        for (var j = 0; j < pArgumentsTypes.length; j++) {
                            if (pArgumentsTypes[j] === TEMPLATE_TYPE) {
                                pTypes.push(Effect.getSystemType(pTemplateTypes[i]));
                                sFunctionHash += pTemplateTypes[i] + ",";
                            } else {
                                pTypes.push(Effect.getSystemType(pArgumentsTypes[j]));
                                sFunctionHash += pArgumentsTypes[j] + ",";
                            }
                        }

                        sFunctionHash += ")";

                        if (this._pSystemFunctionHashMap[sFunctionHash]) {
                            this._error(2248 /* BAD_SYSTEM_FUNCTION_REDEFINE */, { funcName: sFunctionHash });
                        }

                        pFunction = new akra.fx.SystemFunctionInstruction(sName, pReturnType, pExprTranslator, pTypes);

                        if (!akra.isDef(pSystemFunctions[sName])) {
                            pSystemFunctions[sName] = [];
                        }

                        pFunction._setForVertex(isForVertex);
                        pFunction._setForPixel(isForPixel);

                        pSystemFunctions[sName].push(pFunction);
                        pFunction.setBuiltIn(true);
                    }
                } else {
                    if (sReturnTypeName === TEMPLATE_TYPE) {
                        akra.logger.critical("Bad return type(TEMPLATE_TYPE) for system function '" + sName + "'.");
                    }

                    pReturnType = Effect.getSystemType(sReturnTypeName);
                    pTypes = [];
                    sFunctionHash = sName + "(";

                    for (var i = 0; i < pArgumentsTypes.length; i++) {
                        if (pArgumentsTypes[i] === TEMPLATE_TYPE) {
                            akra.logger.critical("Bad argument type(TEMPLATE_TYPE) for system function '" + sName + "'.");
                        } else {
                            pTypes.push(Effect.getSystemType(pArgumentsTypes[i]));
                            sFunctionHash += pArgumentsTypes[i] + ",";
                        }
                    }

                    sFunctionHash += ")";

                    if (this._pSystemFunctionHashMap[sFunctionHash]) {
                        this._error(2248 /* BAD_SYSTEM_FUNCTION_REDEFINE */, { funcName: sFunctionHash });
                    }

                    pFunction = new akra.fx.SystemFunctionInstruction(sName, pReturnType, pExprTranslator, pTypes);

                    pFunction._setForVertex(isForVertex);
                    pFunction._setForPixel(isForPixel);

                    if (!akra.isDef(pSystemFunctions[sName])) {
                        pSystemFunctions[sName] = [];
                    }

                    pSystemFunctions[sName].push(pFunction);
                    pFunction.setBuiltIn(true);
                }
            };

            Effect.prototype.generateSystemMacros = function (sMacrosName, sMacrosCode) {
                if (akra.isDef(this._pSystemMacros[sMacrosName])) {
                    return;
                }

                var pMacros = new akra.fx.SimpleInstruction(sMacrosCode);

                this._pSystemMacros[sMacrosName] = pMacros;
            };

            Effect.prototype.generateNotBuiltInSystemFuction = function (sName, sDefenition, sImplementation, sReturnType, pUsedTypes, pUsedFunctions, pUsedMacros) {
                if (akra.isDef(this._pSystemFunctionsMap[sName])) {
                    return;
                }

                var pReturnType = Effect.getSystemType(sReturnType);
                var pFunction = new akra.fx.SystemFunctionInstruction(sName, pReturnType, null, null);

                pFunction.setDeclCode(sDefenition, sImplementation);

                var pUsedExtSystemTypes = [];
                var pUsedExtSystemFunctions = [];
                var pUsedExtSystemMacros = [];

                if (!akra.isNull(pUsedTypes)) {
                    for (var i = 0; i < pUsedTypes.length; i++) {
                        var pTypeDecl = Effect.getSystemType(pUsedTypes[i]).getParent();
                        if (!akra.isNull(pTypeDecl)) {
                            pUsedExtSystemTypes.push(pTypeDecl);
                        }
                    }
                }

                if (!akra.isNull(pUsedMacros)) {
                    for (var i = 0; i < pUsedMacros.length; i++) {
                        pUsedExtSystemMacros.push(Effect.getSystemMacros(pUsedMacros[i]));
                    }
                }

                if (!akra.isNull(pUsedFunctions)) {
                    for (var i = 0; i < pUsedFunctions.length; i++) {
                        var pFindFunction = Effect.findSystemFunction(pUsedFunctions[i], null);
                        pUsedExtSystemFunctions.push(pFindFunction);
                    }
                }

                pFunction.setUsedSystemData(pUsedExtSystemTypes, pUsedExtSystemFunctions, pUsedExtSystemMacros);
                pFunction.closeSystemDataInfo();
                pFunction.setBuiltIn(false);

                this._pSystemFunctionsMap[sName] = [pFunction];
            };

            Effect.prototype.generateSystemType = function (sName, sRealName, iSize, isArray, pElementType, iLength) {
                if (typeof iSize === "undefined") { iSize = 1; }
                if (typeof isArray === "undefined") { isArray = false; }
                if (typeof pElementType === "undefined") { pElementType = null; }
                if (typeof iLength === "undefined") { iLength = 1; }
                if (akra.isDef(this._pSystemTypes[sName])) {
                    return null;
                }

                var pSystemType = new akra.fx.SystemTypeInstruction();

                pSystemType.setName(sName);
                pSystemType.setRealName(sRealName);
                pSystemType.setSize(iSize);
                if (isArray) {
                    pSystemType.addIndex(pElementType, iLength);
                }

                this._pSystemTypes[sName] = pSystemType;
                pSystemType.setBuiltIn(true);

                return pSystemType;
            };

            Effect.prototype.generateNotBuildtInSystemType = function (sName, sRealName, sDeclString, iSize, isArray, pElementType, iLength) {
                if (typeof iSize === "undefined") { iSize = 1; }
                if (typeof isArray === "undefined") { isArray = false; }
                if (typeof pElementType === "undefined") { pElementType = null; }
                if (typeof iLength === "undefined") { iLength = 1; }
                if (akra.isDef(this._pSystemTypes[sName])) {
                    return null;
                }

                var pSystemType = new akra.fx.SystemTypeInstruction();
                pSystemType.setName(sName);
                pSystemType.setRealName(sRealName);
                pSystemType.setSize(iSize);
                pSystemType.setDeclString(sDeclString);

                if (isArray) {
                    pSystemType.addIndex(pElementType, iLength);
                }

                this._pSystemTypes[sName] = pSystemType;
                pSystemType.setBuiltIn(false);

                var pSystemTypeDecl = new akra.fx.TypeDeclInstruction();
                pSystemTypeDecl.push(pSystemType, true);
                pSystemTypeDecl.setBuiltIn(false);

                return pSystemType;
            };

            Effect.prototype.addSystemTypeScalar = function () {
                this.generateSystemType("void", "void", 0);
                this.generateSystemType("int", "int", 1);
                this.generateSystemType("bool", "bool", 1);
                this.generateSystemType("float", "float", 1);
                this.generateSystemType("ptr", "float", 1);
                this.generateSystemType("string", "", 0);
                this.generateSystemType("texture", "", 0);
                this.generateSystemType("sampler", "sampler2D", 1);
                this.generateSystemType("sampler2D", "sampler2D", 1);
                this.generateSystemType("samplerCUBE", "samplerCube", 1);
                this.generateSystemType("video_buffer", "sampler2D", 1);

                this.generateNotBuildtInSystemType("video_buffer_header", "A_TextureHeader", "struct A_TextureHeader { float width; float height; float stepX; float stepY; }");
            };

            Effect.prototype.addSystemTypeVector = function () {
                var pXYSuffix = {};
                var pXYZSuffix = {};
                var pXYZWSuffix = {};

                var pRGSuffix = {};
                var pRGBSuffix = {};
                var pRGBASuffix = {};

                var pSTSuffix = {};
                var pSTPSuffix = {};
                var pSTPQSuffix = {};

                this.generateSuffixLiterals(["x", "y"], pXYSuffix);
                this.generateSuffixLiterals(["x", "y", "z"], pXYZSuffix);
                this.generateSuffixLiterals(["x", "y", "z", "w"], pXYZWSuffix);

                this.generateSuffixLiterals(["r", "g"], pRGSuffix);
                this.generateSuffixLiterals(["r", "g", "b"], pRGBSuffix);
                this.generateSuffixLiterals(["r", "g", "b", "a"], pRGBASuffix);

                this.generateSuffixLiterals(["s", "t"], pSTSuffix);
                this.generateSuffixLiterals(["s", "t", "p"], pSTPSuffix);
                this.generateSuffixLiterals(["s", "t", "p", "q"], pSTPQSuffix);

                var pFloat = Effect.getSystemType("float");
                var pInt = Effect.getSystemType("int");
                var pBool = Effect.getSystemType("bool");

                var pFloat2 = this.generateSystemType("float2", "vec2", 0, true, pFloat, 2);
                var pFloat3 = this.generateSystemType("float3", "vec3", 0, true, pFloat, 3);
                var pFloat4 = this.generateSystemType("float4", "vec4", 0, true, pFloat, 4);

                var pInt2 = this.generateSystemType("int2", "ivec2", 0, true, pInt, 2);
                var pInt3 = this.generateSystemType("int3", "ivec3", 0, true, pInt, 3);
                var pInt4 = this.generateSystemType("int4", "ivec4", 0, true, pInt, 4);

                var pBool2 = this.generateSystemType("bool2", "bvec2", 0, true, pBool, 2);
                var pBool3 = this.generateSystemType("bool3", "bvec3", 0, true, pBool, 3);
                var pBool4 = this.generateSystemType("bool4", "bvec4", 0, true, pBool, 4);

                this.addFieldsToVectorFromSuffixObject(pXYSuffix, pFloat2, "float");
                this.addFieldsToVectorFromSuffixObject(pRGSuffix, pFloat2, "float");
                this.addFieldsToVectorFromSuffixObject(pSTSuffix, pFloat2, "float");

                this.addFieldsToVectorFromSuffixObject(pXYZSuffix, pFloat3, "float");
                this.addFieldsToVectorFromSuffixObject(pRGBSuffix, pFloat3, "float");
                this.addFieldsToVectorFromSuffixObject(pSTPSuffix, pFloat3, "float");

                this.addFieldsToVectorFromSuffixObject(pXYZWSuffix, pFloat4, "float");
                this.addFieldsToVectorFromSuffixObject(pRGBASuffix, pFloat4, "float");
                this.addFieldsToVectorFromSuffixObject(pSTPQSuffix, pFloat4, "float");

                this.addFieldsToVectorFromSuffixObject(pXYSuffix, pInt2, "int");
                this.addFieldsToVectorFromSuffixObject(pRGSuffix, pInt2, "int");
                this.addFieldsToVectorFromSuffixObject(pSTSuffix, pInt2, "int");

                this.addFieldsToVectorFromSuffixObject(pXYZSuffix, pInt3, "int");
                this.addFieldsToVectorFromSuffixObject(pRGBSuffix, pInt3, "int");
                this.addFieldsToVectorFromSuffixObject(pSTPSuffix, pInt3, "int");

                this.addFieldsToVectorFromSuffixObject(pXYZWSuffix, pInt4, "int");
                this.addFieldsToVectorFromSuffixObject(pRGBASuffix, pInt4, "int");
                this.addFieldsToVectorFromSuffixObject(pSTPQSuffix, pInt4, "int");

                this.addFieldsToVectorFromSuffixObject(pXYSuffix, pBool2, "bool");
                this.addFieldsToVectorFromSuffixObject(pRGSuffix, pBool2, "bool");
                this.addFieldsToVectorFromSuffixObject(pSTSuffix, pBool2, "bool");

                this.addFieldsToVectorFromSuffixObject(pXYZSuffix, pBool3, "bool");
                this.addFieldsToVectorFromSuffixObject(pRGBSuffix, pBool3, "bool");
                this.addFieldsToVectorFromSuffixObject(pSTPSuffix, pBool3, "bool");

                this.addFieldsToVectorFromSuffixObject(pXYZWSuffix, pBool4, "bool");
                this.addFieldsToVectorFromSuffixObject(pRGBASuffix, pBool4, "bool");
                this.addFieldsToVectorFromSuffixObject(pSTPQSuffix, pBool4, "bool");
            };

            Effect.prototype.addSystemTypeMatrix = function () {
                var pFloat2 = Effect.getSystemType("float2");
                var pFloat3 = Effect.getSystemType("float3");
                var pFloat4 = Effect.getSystemType("float4");

                var pInt2 = Effect.getSystemType("int2");
                var pInt3 = Effect.getSystemType("int3");
                var pInt4 = Effect.getSystemType("int4");

                var pBool2 = Effect.getSystemType("bool2");
                var pBool3 = Effect.getSystemType("bool3");
                var pBool4 = Effect.getSystemType("bool4");

                this.generateSystemType("float2x2", "mat2", 0, true, pFloat2, 2);
                this.generateSystemType("float2x3", "mat2x3", 0, true, pFloat2, 3);
                this.generateSystemType("float2x4", "mat2x4", 0, true, pFloat2, 4);

                this.generateSystemType("float3x2", "mat3x2", 0, true, pFloat3, 2);
                this.generateSystemType("float3x3", "mat3", 0, true, pFloat3, 3);
                this.generateSystemType("float3x4", "mat3x4", 0, true, pFloat3, 4);

                this.generateSystemType("float4x2", "mat4x2", 0, true, pFloat4, 2);
                this.generateSystemType("float4x3", "mat4x3", 0, true, pFloat4, 3);
                this.generateSystemType("float4x4", "mat4", 0, true, pFloat4, 4);

                this.generateSystemType("int2x2", "imat2", 0, true, pInt2, 2);
                this.generateSystemType("int2x3", "imat2x3", 0, true, pInt2, 3);
                this.generateSystemType("int2x4", "imat2x4", 0, true, pInt2, 4);

                this.generateSystemType("int3x2", "imat3x2", 0, true, pInt3, 2);
                this.generateSystemType("int3x3", "imat3", 0, true, pInt3, 3);
                this.generateSystemType("int3x4", "imat3x4", 0, true, pInt3, 4);

                this.generateSystemType("int4x2", "imat4x2", 0, true, pInt4, 2);
                this.generateSystemType("int4x3", "imat4x3", 0, true, pInt4, 3);
                this.generateSystemType("int4x4", "imat4", 0, true, pInt4, 4);

                this.generateSystemType("bool2x2", "bmat2", 0, true, pBool2, 2);
                this.generateSystemType("bool2x3", "bmat2x3", 0, true, pBool2, 3);
                this.generateSystemType("bool2x4", "bmat2x4", 0, true, pBool2, 4);

                this.generateSystemType("bool3x2", "bmat3x2", 0, true, pBool3, 2);
                this.generateSystemType("bool3x3", "bmat3", 0, true, pBool3, 3);
                this.generateSystemType("bool3x4", "bmat3x4", 0, true, pBool3, 4);

                this.generateSystemType("bool4x2", "bmat4x2", 0, true, pBool4, 2);
                this.generateSystemType("bool4x3", "bmat4x3", 0, true, pBool4, 3);
                this.generateSystemType("bool4x4", "bmat4", 0, true, pBool4, 4);
            };

            Effect.prototype.addFieldsToVectorFromSuffixObject = function (pSuffixMap, pType, sBaseType) {
                var sSuffix = null;

                for (sSuffix in pSuffixMap) {
                    var sFieldTypeName = sBaseType + ((sSuffix.length > 1) ? sSuffix.length.toString() : "");
                    var pFieldType = Effect.getSystemType(sFieldTypeName);

                    pType.addField(sSuffix, pFieldType, pSuffixMap[sSuffix]);
                }
            };

            Effect.prototype.getVariable = function (sName) {
                return Effect.getSystemVariable(sName) || this._pEffectScope.getVariable(sName);
            };

            Effect.prototype.hasVariable = function (sName) {
                return this._pEffectScope.hasVariable(sName);
            };

            Effect.prototype.getType = function (sTypeName) {
                return Effect.getSystemType(sTypeName) || this._pEffectScope.getType(sTypeName);
            };

            Effect.prototype.isSystemFunction = function (pFunction) {
                return false;
            };

            Effect.prototype.isSystemVariable = function (pVariable) {
                return false;
            };

            Effect.prototype.isSystemType = function (pType) {
                return false;
            };

            Effect.prototype._errorFromInstruction = function (pError) {
                this._error(pError.code, akra.isNull(pError.info) ? {} : pError.info);
            };

            Effect.prototype._error = function (eCode, pInfo) {
                if (typeof pInfo === "undefined") { pInfo = {}; }
                var sFileName = this._sAnalyzedFileName;

                var pLocation = { file: this._sAnalyzedFileName, line: 0 };
                var pLineColumn = this.getNodeSourceLocation(this.getAnalyzedNode());

                switch (eCode) {
                    default:
                        pInfo.line = pLineColumn.line + 1;
                        pInfo.column = pLineColumn.column + 1;

                        pLocation.line = pLineColumn.line + 1;

                        break;
                }

                var pLogEntity = {
                    code: eCode,
                    info: pInfo,
                    location: pLocation
                };

                akra.logger.critical(pLogEntity);
                //throw new Error(eCode.toString());
            };

            Effect.prototype.setAnalyzedNode = function (pNode) {
                // if(this._pAnalyzedNode !== pNode){
                // 	// debug_print("Analyze node: ", pNode);
                // 	//.name + (pNode.value ?  " --> value: " + pNode.value + "." : "."));
                // }
                this._pAnalyzedNode = pNode;
            };

            Effect.prototype.getAnalyzedNode = function () {
                return this._pAnalyzedNode;
            };

            Effect.prototype.isStrictMode = function () {
                return this._pEffectScope.isStrictMode();
            };

            Effect.prototype.setStrictModeOn = function () {
                return this._pEffectScope.setStrictModeOn();
            };

            Effect.prototype.newScope = function (eScopeType) {
                if (typeof eScopeType === "undefined") { eScopeType = 0 /* k_Default */; }
                this._pEffectScope.newScope(eScopeType);
            };

            Effect.prototype.resumeScope = function () {
                this._pEffectScope.resumeScope();
            };

            Effect.prototype.getScope = function () {
                return this._pEffectScope.getScope();
            };

            Effect.prototype.setScope = function (iScope) {
                this._pEffectScope.setScope(iScope);
            };

            Effect.prototype.endScope = function () {
                this._pEffectScope.endScope();
            };

            Effect.prototype.getScopeType = function () {
                return this._pEffectScope.getScopeType();
            };

            Effect.prototype.setCurrentAnalyzedFunction = function (pFunction) {
                this._pCurrentFunction = pFunction;
            };

            Effect.prototype.getCurrentAnalyzedFunction = function () {
                return this._pCurrentFunction;
            };

            Effect.prototype.isAnalzeInPass = function () {
                return this._isAnalyzeInPass;
            };

            Effect.prototype.setAnalyzeInPass = function (isInPass) {
                this._isAnalyzeInPass = isInPass;
            };

            Effect.prototype.setOperator = function (sOperator) {
                if (!akra.isNull(this._pCurrentInstruction)) {
                    this._pCurrentInstruction.setOperator(sOperator);
                }
            };

            Effect.prototype.clearPointersForExtract = function () {
                this._pPointerForExtractionList.length = 0;
            };

            Effect.prototype.addPointerForExtract = function (pPointer) {
                this._pPointerForExtractionList.push(pPointer);
            };

            Effect.prototype.getPointerForExtractList = function () {
                return this._pPointerForExtractionList;
            };

            Effect.prototype.findFunction = function (sFunctionName, pArguments) {
                return Effect.findSystemFunction(sFunctionName, pArguments) || this._pEffectScope.getFunction(sFunctionName, pArguments);
            };

            Effect.prototype.findConstructor = function (pType, pArguments) {
                var pVariableType = new akra.fx.VariableTypeInstruction();
                pVariableType.pushType(pType);

                return pVariableType;
            };

            Effect.prototype.findShaderFunction = function (sFunctionName, pArguments) {
                return this._pEffectScope.getShaderFunction(sFunctionName, pArguments);
            };

            Effect.prototype.findFunctionByDef = function (pDef) {
                return this.findFunction(pDef.getName(), pDef.getArguments());
            };

            // private addVariable(pVariable: IAFXVariable): void {
            // }
            Effect.prototype.addVariableDecl = function (pVariable) {
                if (this.isSystemVariable(pVariable)) {
                    this._error(2235 /* REDEFINE_SYSTEM_VARIABLE */, { varName: pVariable.getName() });
                }

                var isVarAdded = this._pEffectScope.addVariable(pVariable);

                if (!isVarAdded) {
                    var eScopeType = this.getScopeType();

                    switch (eScopeType) {
                        case 0 /* k_Default */:
                            this._error(2234 /* REDEFINE_VARIABLE */, { varName: pVariable.getName() });
                            break;
                        case 1 /* k_Struct */:
                            this._error(2242 /* BAD_NEW_FIELD_FOR_STRUCT_NAME */, { fieldName: pVariable.getName() });
                            break;
                        case 2 /* k_Annotation */:
                            this._error(2244 /* BAD_NEW_ANNOTATION_VAR */, { varName: pVariable.getName() });
                            break;
                    }
                }

                if (pVariable.getName() === "Out" && !akra.isNull(this.getCurrentAnalyzedFunction())) {
                    var isOk = this.getCurrentAnalyzedFunction()._addOutVariable(pVariable);
                    if (!isOk) {
                        this._error(2266 /* BAD_OUT_VARIABLE_IN_FUNCTION */);
                    }
                }
            };

            Effect.prototype.addTypeDecl = function (pType) {
                if (this.isSystemType(pType)) {
                    this._error(2201 /* REDEFINE_SYSTEM_TYPE */, { typeName: pType.getName() });
                }

                var isTypeAdded = this._pEffectScope.addType(pType);

                if (!isTypeAdded) {
                    this._error(2202 /* REDEFINE_TYPE */, { typeName: pType.getName() });
                }
            };

            Effect.prototype.addFunctionDecl = function (pFunction) {
                if (this.isSystemFunction(pFunction)) {
                    this._error(2237 /* REDEFINE_SYSTEM_FUNCTION */, { funcName: pFunction.getName() });
                }

                var isFunctionAdded = this._pEffectScope.addFunction(pFunction);

                if (!isFunctionAdded) {
                    this._error(2236 /* REDEFINE_FUNCTION */, { funcName: pFunction.getName() });
                }
            };

            Effect.prototype.addTechnique = function (pTechnique) {
                var sName = pTechnique.getName();

                if (akra.isDef(this._pTechniqueMap[sName])) {
                    this._error(2252 /* BAD_TECHNIQUE_REDEFINE_NAME */, { techName: sName });
                    return;
                }

                this._pTechniqueMap[sName] = pTechnique;
                this._pTechniqueList.push(pTechnique);
            };

            Effect.prototype.addExternalSharedVariable = function (pVariable, eShaderType) {
                var isVarAdded = this._pEffectScope.addVariable(pVariable);

                if (!isVarAdded) {
                    this._error(2278 /* CANNOT_ADD_SHARED_VARIABLE */, { varName: pVariable.getName() });
                    return;
                }
            };

            Effect.prototype.analyzeGlobalUseDecls = function () {
                var pChildren = this._pParseTree.getRoot().children;
                var i = 0;

                for (i = pChildren.length - 1; i >= 0; i--) {
                    if (pChildren[i].name === "UseDecl") {
                        this.analyzeUseDecl(pChildren[i]);
                    }
                }
            };

            Effect.prototype.analyzeGlobalProvideDecls = function () {
                var pChildren = this._pParseTree.getRoot().children;
                var i = 0;

                for (i = pChildren.length - 1; i >= 0; i--) {
                    if (pChildren[i].name === "ProvideDecl") {
                        this.analyzeProvideDecl(pChildren[i]);
                    }
                }
            };

            Effect.prototype.analyzeGlobalTypeDecls = function () {
                var pChildren = this._pParseTree.getRoot().children;
                var i = 0;

                for (i = pChildren.length - 1; i >= 0; i--) {
                    if (pChildren[i].name === "TypeDecl") {
                        this.analyzeTypeDecl(pChildren[i]);
                    }
                }
            };

            Effect.prototype.analyzeFunctionDefinitions = function () {
                var pChildren = this._pParseTree.getRoot().children;
                var i = 0;

                for (i = pChildren.length - 1; i >= 0; i--) {
                    if (pChildren[i].name === "FunctionDecl") {
                        this.analyzeFunctionDeclOnlyDefinition(pChildren[i]);
                    }
                }
            };

            Effect.prototype.analyzeGlobalImports = function () {
                var pChildren = this._pParseTree.getRoot().children;
                var i = 0;

                for (i = pChildren.length - 1; i >= 0; i--) {
                    if (pChildren[i].name === "ImportDecl") {
                        this.analyzeImportDecl(pChildren[i], null);
                    }
                }
            };

            Effect.prototype.analyzeTechniqueImports = function () {
                var pChildren = this._pParseTree.getRoot().children;
                var i = 0;

                for (i = pChildren.length - 1; i >= 0; i--) {
                    if (pChildren[i].name === "TechniqueDecl") {
                        this.analyzeTechniqueForImport(pChildren[i]);
                    }
                }
            };

            Effect.prototype.analyzeVariableDecls = function () {
                var pChildren = this._pParseTree.getRoot().children;
                var i = 0;

                for (i = pChildren.length - 1; i >= 0; i--) {
                    if (pChildren[i].name === "VariableDecl") {
                        this.analyzeVariableDecl(pChildren[i]);
                    } else if (pChildren[i].name === "VarStructDecl") {
                        this.analyzeVarStructDecl(pChildren[i]);
                    }
                }
            };

            Effect.prototype.analyzeFunctionDecls = function () {
                for (var i = 0; i < this._pFunctionWithImplementationList.length; i++) {
                    this.resumeFunctionAnalysis(this._pFunctionWithImplementationList[i]);
                }

                this.checkFunctionsForRecursion();
                this.checkFunctionForCorrectUsage();
                this.generateInfoAboutUsedData();
                this.generateShadersFromFunctions();
            };

            Effect.prototype.analyzeTechniques = function () {
                for (var i = 0; i < this._pTechniqueList.length; i++) {
                    this.resumeTechniqueAnalysis(this._pTechniqueList[i]);
                }
            };

            Effect.prototype.checkFunctionsForRecursion = function () {
                var pFunctionList = this._pFunctionWithImplementationList;
                var isNewAdd = true;
                var isNewDelete = true;

                while (isNewAdd || isNewDelete) {
                    isNewAdd = false;
                    isNewDelete = false;

                    mainFor:
                    for (var i = 0; i < pFunctionList.length; i++) {
                        var pTestedFunction = pFunctionList[i];
                        var pUsedFunctionList = pTestedFunction._getUsedFunctionList();

                        if (!pTestedFunction._isUsed()) {
                            continue mainFor;
                        }
                        if (pTestedFunction._isBlackListFunction()) {
                            continue mainFor;
                        }

                        if (akra.isNull(pUsedFunctionList)) {
                            continue mainFor;
                        }

                        for (var j = 0; j < pUsedFunctionList.length; j++) {
                            var pAddedUsedFunctionList = pUsedFunctionList[j]._getUsedFunctionList();

                            if (akra.isNull(pAddedUsedFunctionList)) {
                                continue;
                            }

                            for (var k = 0; k < pAddedUsedFunctionList.length; k++) {
                                var pAddedFunction = pAddedUsedFunctionList[k];

                                if (pTestedFunction === pAddedFunction) {
                                    pTestedFunction._addToBlackList();
                                    isNewDelete = true;
                                    this._error(2255 /* BAD_FUNCTION_USAGE_RECURSION */, { funcDef: pTestedFunction._getStringDef() });
                                    continue mainFor;
                                }

                                if (pAddedFunction._isBlackListFunction() || !pAddedFunction._canUsedAsFunction()) {
                                    pTestedFunction._addToBlackList();
                                    this._error(2256 /* BAD_FUNCTION_USAGE_BLACKLIST */, { funcDef: pTestedFunction._getStringDef() });
                                    isNewDelete = true;
                                    continue mainFor;
                                }

                                if (pTestedFunction._addUsedFunction(pAddedFunction)) {
                                    isNewAdd = true;
                                }
                            }
                        }
                    }
                }
            };

            Effect.prototype.checkFunctionForCorrectUsage = function () {
                var pFunctionList = this._pFunctionWithImplementationList;
                var isNewUsageSet = true;
                var isNewDelete = true;

                while (isNewUsageSet || isNewDelete) {
                    isNewUsageSet = false;
                    isNewDelete = false;

                    mainFor:
                    for (var i = 0; i < pFunctionList.length; i++) {
                        var pTestedFunction = pFunctionList[i];
                        var pUsedFunctionList = pTestedFunction._getUsedFunctionList();

                        if (!pTestedFunction._isUsed()) {
                            continue mainFor;
                        }
                        if (pTestedFunction._isBlackListFunction()) {
                            continue mainFor;
                        }

                        if (!pTestedFunction._checkVertexUsage()) {
                            this._error(2257 /* BAD_FUNCTION_USAGE_VERTEX */, { funcDef: pTestedFunction._getStringDef() });
                            pTestedFunction._addToBlackList();
                            isNewDelete = true;
                            continue mainFor;
                        }

                        if (!pTestedFunction._checkPixelUsage()) {
                            this._error(2258 /* BAD_FUNCTION_USAGE_PIXEL */, { funcDef: pTestedFunction._getStringDef() });
                            pTestedFunction._addToBlackList();
                            isNewDelete = true;
                            continue mainFor;
                        }

                        if (akra.isNull(pUsedFunctionList)) {
                            continue mainFor;
                        }

                        for (var j = 0; j < pUsedFunctionList.length; j++) {
                            var pUsedFunction = pUsedFunctionList[j];

                            if (pTestedFunction._isUsedInVertex()) {
                                if (!pUsedFunction._isForVertex()) {
                                    this._error(2257 /* BAD_FUNCTION_USAGE_VERTEX */, { funcDef: pTestedFunction._getStringDef() });
                                    pTestedFunction._addToBlackList();
                                    isNewDelete = true;
                                    continue mainFor;
                                }

                                if (!pUsedFunction._isUsedInVertex()) {
                                    pUsedFunction._markUsedInVertex();
                                    isNewUsageSet = true;
                                }
                            }

                            if (pTestedFunction._isUsedInPixel()) {
                                if (!pUsedFunction._isForPixel()) {
                                    this._error(2258 /* BAD_FUNCTION_USAGE_PIXEL */, { funcDef: pTestedFunction._getStringDef() });
                                    pTestedFunction._addToBlackList();
                                    isNewDelete = true;
                                    continue mainFor;
                                }

                                if (!pUsedFunction._isUsedInPixel()) {
                                    pUsedFunction._markUsedInPixel();
                                    isNewUsageSet = true;
                                }
                            }
                        }
                    }
                }

                return;
            };

            Effect.prototype.generateInfoAboutUsedData = function () {
                var pFunctionList = this._pFunctionWithImplementationList;

                for (var i = 0; i < pFunctionList.length; i++) {
                    pFunctionList[i]._generateInfoAboutUsedData();
                }
            };

            Effect.prototype.generateShadersFromFunctions = function () {
                var pFunctionList = this._pFunctionWithImplementationList;

                for (var i = 0; i < pFunctionList.length; i++) {
                    var pShader = null;

                    if (pFunctionList[i]._isUsedAsVertex()) {
                        pShader = pFunctionList[i]._convertToVertexShader();
                    }
                    if (pFunctionList[i]._isUsedAsPixel()) {
                        pShader = pFunctionList[i]._convertToPixelShader();
                    }
                }
            };

            Effect.prototype.analyzeVariableDecl = function (pNode, pInstruction) {
                if (typeof pInstruction === "undefined") { pInstruction = null; }
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pGeneralType = null;
                var pVariable = null;
                var i = 0;

                pGeneralType = this.analyzeUsageType(pChildren[pChildren.length - 1]);

                for (i = pChildren.length - 2; i >= 1; i--) {
                    if (pChildren[i].name === "Variable") {
                        pVariable = this.analyzeVariable(pChildren[i], pGeneralType);

                        if (!akra.isNull(pInstruction)) {
                            pInstruction.push(pVariable, true);
                            if (pInstruction._getInstructionType() === 55 /* k_DeclStmtInstruction */) {
                                var pVariableSubDecls = pVariable.getSubVarDecls();
                                if (!akra.isNull(pVariableSubDecls)) {
                                    for (var j = 0; j < pVariableSubDecls.length; j++) {
                                        pInstruction.push(pVariableSubDecls[j], false);
                                    }
                                }
                            }
                        }
                    }
                }
            };

            Effect.prototype.analyzeUsageType = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var i = 0;
                var pType = new akra.fx.VariableTypeInstruction();

                for (i = pChildren.length - 1; i >= 0; i--) {
                    if (pChildren[i].name === "Type") {
                        var pMainType = this.analyzeType(pChildren[i]);
                        pType.pushType(pMainType);
                    } else if (pChildren[i].name === "Usage") {
                        var sUsage = this.analyzeUsage(pChildren[i]);
                        pType.addUsage(sUsage);
                    }
                }

                this.checkInstruction(pType, 0 /* CODE_TARGET_SUPPORT */);

                return pType;
            };

            Effect.prototype.analyzeType = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pType = null;

                switch (pNode.name) {
                    case "T_TYPE_ID":
                        pType = this.getType(pNode.value);

                        if (akra.isNull(pType)) {
                            this._error(2250 /* BAD_TYPE_NAME_NOT_TYPE */, { typeName: pNode.value });
                        }
                        break;

                    case "Struct":
                        pType = this.analyzeStruct(pNode);
                        break;

                    case "T_KW_VOID":
                        pType = Effect.getSystemType("void");
                        break;

                    case "ScalarType":
                    case "ObjectType":
                        pType = this.getType(pChildren[pChildren.length - 1].value);

                        if (akra.isNull(pType)) {
                            this._error(2250 /* BAD_TYPE_NAME_NOT_TYPE */, { typeName: pChildren[pChildren.length - 1].value });
                        }

                        break;

                    case "VectorType":
                    case "MatrixType":
                        this._error(2251 /* BAD_TYPE_VECTOR_MATRIX */);
                        break;

                    case "BaseType":
                    case "Type":
                        return this.analyzeType(pChildren[0]);
                }

                return pType;
            };

            Effect.prototype.analyzeUsage = function (pNode) {
                this.setAnalyzedNode(pNode);

                pNode = pNode.children[0];
                return pNode.value;
            };

            Effect.prototype.analyzeVariable = function (pNode, pGeneralType) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                var pVarDecl = new akra.fx.VariableDeclInstruction();
                var pVariableType = new akra.fx.VariableTypeInstruction();
                var pAnnotation = null;
                var sSemantic = "";
                var pInitExpr = null;

                pVarDecl.push(pVariableType, true);
                pVariableType.pushType(pGeneralType);
                pVarDecl._setScope(this.getScope());

                this.analyzeVariableDim(pChildren[pChildren.length - 1], pVarDecl);

                var i = 0;
                for (i = pChildren.length - 2; i >= 0; i--) {
                    if (pChildren[i].name === "Annotation") {
                        pAnnotation = this.analyzeAnnotation(pChildren[i]);
                        pVarDecl.setAnnotation(pAnnotation);
                    } else if (pChildren[i].name === "Semantic") {
                        sSemantic = this.analyzeSemantic(pChildren[i]);
                        pVarDecl.setSemantic(sSemantic);
                        pVarDecl.getNameId().setRealName(sSemantic);
                    } else if (pChildren[i].name === "Initializer") {
                        pInitExpr = this.analyzeInitializer(pChildren[i]);
                        if (!pInitExpr.optimizeForVariableType(pVariableType)) {
                            this._error(2269 /* BAD_VARIABLE_INITIALIZER */, { varName: pVarDecl.getName() });
                            return null;
                        }
                        pVarDecl.push(pInitExpr, true);
                    }
                }

                this.checkInstruction(pVarDecl, 0 /* CODE_TARGET_SUPPORT */);

                this.addVariableDecl(pVarDecl);
                pVarDecl._getNameIndex();

                return pVarDecl;
            };

            Effect.prototype.analyzeVariableDim = function (pNode, pVariableDecl) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pVariableType = pVariableDecl.getType();

                if (pChildren.length === 1) {
                    var pName = new akra.fx.IdInstruction();
                    pName.setName(pChildren[0].value);
                    pVariableDecl.push(pName, true);
                    return;
                }

                this.analyzeVariableDim(pChildren[pChildren.length - 1], pVariableDecl);

                if (pChildren.length === 3) {
                    pVariableType.addPointIndex(true);
                } else if (pChildren.length === 4 && pChildren[0].name === "FromExpr") {
                    var pBuffer = this.analyzeFromExpr(pChildren[0]);
                    pVariableType.addPointIndex(true);
                    pVariableType.setVideoBuffer(pBuffer);
                } else {
                    if (pVariableType.isPointer()) {
                        //TODO: add support for v[][10]
                        this._error(2300 /* BAD_ARRAY_OF_POINTERS */);
                    }

                    var pIndexExpr = this.analyzeExpr(pChildren[pChildren.length - 3]);
                    pVariableType.addArrayIndex(pIndexExpr);
                }
            };

            Effect.prototype.analyzeAnnotation = function (pNode) {
                this.setAnalyzedNode(pNode);

                return null;
            };

            Effect.prototype.analyzeSemantic = function (pNode) {
                this.setAnalyzedNode(pNode);

                var sSemantic = pNode.children[0].value;

                // var pDecl: IAFXDeclInstruction = <IAFXDeclInstruction>this._pCurrentInstruction;
                // pDecl.setSemantic(sSemantic);
                return sSemantic;
            };

            Effect.prototype.analyzeInitializer = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pInitExpr = new akra.fx.InitExprInstruction();

                if (pChildren.length === 2) {
                    pInitExpr.push(this.analyzeExpr(pChildren[0]), true);
                } else {
                    for (var i = pChildren.length - 3; i >= 1; i--) {
                        if (pChildren[i].name === "InitExpr") {
                            pInitExpr.push(this.analyzeInitExpr(pChildren[i]), true);
                        }
                    }
                }

                return pInitExpr;
            };

            Effect.prototype.analyzeFromExpr = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pBuffer = null;

                if (pChildren[1].name === "T_NON_TYPE_ID") {
                    pBuffer = this.getVariable(pChildren[1].value);
                } else {
                    pBuffer = this.analyzeMemExpr(pChildren[1]).getBuffer();
                }

                return pBuffer;
            };

            Effect.prototype.analyzeInitExpr = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pInitExpr = new akra.fx.InitExprInstruction();

                if (pChildren.length === 1) {
                    pInitExpr.push(this.analyzeExpr(pChildren[0]), true);
                } else {
                    for (var i = 0; i < pChildren.length; i++) {
                        if (pChildren[i].name === "InitExpr") {
                            pInitExpr.push(this.analyzeInitExpr(pChildren[i]), true);
                        }
                    }
                }

                return pInitExpr;
            };

            Effect.prototype.analyzeExpr = function (pNode) {
                this.setAnalyzedNode(pNode);
                var sName = pNode.name;

                switch (sName) {
                    case "ObjectExpr":
                        return this.analyzeObjectExpr(pNode);
                    case "ComplexExpr":
                        return this.analyzeComplexExpr(pNode);
                    case "PrimaryExpr":
                        return this.analyzePrimaryExpr(pNode);
                    case "PostfixExpr":
                        return this.analyzePostfixExpr(pNode);
                    case "UnaryExpr":
                        return this.analyzeUnaryExpr(pNode);
                    case "CastExpr":
                        return this.analyzeCastExpr(pNode);
                    case "ConditionalExpr":
                        return this.analyzeConditionalExpr(pNode);
                    case "MulExpr":
                    case "AddExpr":
                        return this.analyzeArithmeticExpr(pNode);
                    case "RelationalExpr":
                    case "EqualityExpr":
                        return this.analyzeRelationExpr(pNode);
                    case "AndExpr":
                    case "OrExpr":
                        return this.analyzeLogicalExpr(pNode);
                    case "AssignmentExpr":
                        return this.analyzeAssignmentExpr(pNode);
                    case "T_NON_TYPE_ID":
                        return this.analyzeIdExpr(pNode);
                    case "T_STRING":
                    case "T_UINT":
                    case "T_FLOAT":
                    case "T_KW_TRUE":
                    case "T_KW_FALSE":
                        return this.analyzeSimpleExpr(pNode);
                    case "MemExpr":
                        return this.analyzeMemExpr(pNode);
                    default:
                        this._error(2204 /* UNSUPPORTED_EXPR */, { exprName: sName });
                        break;
                }

                return null;
            };

            Effect.prototype.analyzeObjectExpr = function (pNode) {
                this.setAnalyzedNode(pNode);

                var sName = pNode.children[pNode.children.length - 1].name;

                switch (sName) {
                    case "T_KW_COMPILE":
                        return this.analyzeCompileExpr(pNode);
                    case "T_KW_SAMPLER_STATE":
                        return this.analyzeSamplerStateBlock(pNode);
                }
            };

            Effect.prototype.analyzeCompileExpr = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pExpr = new akra.fx.CompileExprInstruction();
                var pExprType;
                var pArguments = null;
                var sShaderFuncName = pChildren[pChildren.length - 2].value;
                var pShaderFunc = null;
                var i = 0;

                pArguments = [];

                if (pChildren.length > 4) {
                    var pArgumentExpr;

                    for (i = pChildren.length - 3; i > 0; i--) {
                        if (pChildren[i].value !== ",") {
                            pArgumentExpr = this.analyzeExpr(pChildren[i]);
                            pArguments.push(pArgumentExpr);
                        }
                    }
                }

                pShaderFunc = this.findShaderFunction(sShaderFuncName, pArguments);

                if (akra.isNull(pShaderFunc)) {
                    this._error(2226 /* BAD_COMPILE_NOT_FUNCTION */, { funcName: sShaderFuncName });
                    return null;
                }

                pExprType = pShaderFunc.getType().wrap();

                pExpr.setType(pExprType);
                pExpr.setOperator("complile");
                pExpr.push(pShaderFunc.getNameId(), false);

                if (!akra.isNull(pArguments)) {
                    for (i = 0; i < pArguments.length; i++) {
                        pExpr.push(pArguments[i], true);
                    }
                }

                this.checkInstruction(pExpr, 0 /* CODE_TARGET_SUPPORT */);

                return pExpr;
            };

            Effect.prototype.analyzeSamplerStateBlock = function (pNode) {
                pNode = pNode.children[0];
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pExpr = new akra.fx.SamplerStateBlockInstruction();
                var i = 0;

                pExpr.setOperator("sample_state");

                for (i = pChildren.length - 2; i >= 1; i--) {
                    this.analyzeSamplerState(pChildren[i], pExpr);
                }

                this.checkInstruction(pExpr, 0 /* CODE_TARGET_SUPPORT */);

                return pExpr;
            };

            Effect.prototype.analyzeSamplerState = function (pNode, pSamplerStates) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                if (pChildren[pChildren.length - 2].name === "StateIndex") {
                    this._error(2270 /* NOT_SUPPORT_STATE_INDEX */);
                    return;
                }

                var pStateExprNode = pChildren[pChildren.length - 3];
                var pSubStateExprNode = pStateExprNode.children[pStateExprNode.children.length - 1];
                var sStateType = pChildren[pChildren.length - 1].value.toUpperCase();
                var sStateValue = "";
                var isTexture = false;

                if (akra.isNull(pSubStateExprNode.value)) {
                    this._error(2271 /* BAD_TEXTURE_FOR_SAMLER */);
                    return;
                }
                var pTexture = null;

                switch (sStateType) {
                    case "TEXTURE":
                        var pTexture = null;
                        if (pStateExprNode.children.length !== 3 || pSubStateExprNode.value === "{") {
                            this._error(2271 /* BAD_TEXTURE_FOR_SAMLER */);
                            return;
                        }
                        var sTextureName = pStateExprNode.children[1].value;
                        if (akra.isNull(sTextureName) || !this.hasVariable(sTextureName)) {
                            this._error(2271 /* BAD_TEXTURE_FOR_SAMLER */);
                            return;
                        }

                        pTexture = this.getVariable(sTextureName);
                        sStateValue = sTextureName;
                        break;

                    case "ADDRESSU":
                    case "ADDRESSV":
                        sStateValue = pSubStateExprNode.value.toUpperCase();
                        switch (sStateValue) {
                            case "WRAP":
                            case "CLAMP":
                            case "MIRROR":
                                break;
                            default:
                                akra.logger.warn("Webgl don`t support this wrapmode: " + sStateValue);
                                return;
                        }
                        break;

                    case "MAGFILTER":
                    case "MINFILTER":
                        sStateValue = pSubStateExprNode.value.toUpperCase();
                        switch (sStateValue) {
                            case "POINT":
                                sStateValue = "NEAREST";
                                break;
                            case "POINT_MIPMAP_POINT":
                                sStateValue = "NEAREST_MIPMAP_NEAREST";
                                break;
                            case "LINEAR_MIPMAP_POINT":
                                sStateValue = "LINEAR_MIPMAP_NEAREST";
                                break;
                            case "POINT_MIPMAP_LINEAR":
                                sStateValue = "NEAREST_MIPMAP_LINEAR";
                                break;

                            case "NEAREST":
                            case "LINEAR":
                            case "NEAREST_MIPMAP_NEAREST":
                            case "LINEAR_MIPMAP_NEAREST":
                            case "NEAREST_MIPMAP_LINEAR":
                            case "LINEAR_MIPMAP_LINEAR":
                                break;
                            default:
                                akra.logger.warn("Webgl don`t support this texture filter: " + sStateValue);
                                return;
                        }
                        break;

                    default:
                        akra.logger.warn("Don`t support this texture param: " + sStateType);
                        return;
                }

                if (sStateType !== "TEXTURE") {
                    pSamplerStates.addState(sStateType, sStateValue);
                } else {
                    pSamplerStates.setTexture(pTexture);
                }
            };

            Effect.prototype.analyzeComplexExpr = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var sFirstNodeName = pChildren[pChildren.length - 1].name;

                switch (sFirstNodeName) {
                    case "T_NON_TYPE_ID":
                        return this.analyzeFunctionCallExpr(pNode);
                    case "BaseType":
                    case "T_TYPE_ID":
                        return this.analyzeConstructorCallExpr(pNode);
                    default:
                        return this.analyzeSimpleComplexExpr(pNode);
                }
            };

            Effect.prototype.analyzeFunctionCallExpr = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pExpr = null;
                var pExprType = null;
                var pArguments = null;
                var sFuncName = pChildren[pChildren.length - 1].value;
                var pFunction = null;
                var pFunctionId = null;
                var i = 0;
                var pCurrentAnalyzedFunction = this.getCurrentAnalyzedFunction();

                if (pChildren.length > 3) {
                    var pArgumentExpr;

                    pArguments = [];

                    for (i = pChildren.length - 3; i > 0; i--) {
                        if (pChildren[i].value !== ",") {
                            pArgumentExpr = this.analyzeExpr(pChildren[i]);
                            pArguments.push(pArgumentExpr);
                        }
                    }
                }

                pFunction = this.findFunction(sFuncName, pArguments);

                if (akra.isNull(pFunction)) {
                    this._error(2223 /* BAD_COMPLEX_NOT_FUNCTION */, { funcName: sFuncName });
                    return null;
                }

                if (!akra.isDef(pFunction)) {
                    this._error(2246 /* BAD_CANNOT_CHOOSE_FUNCTION */, { funcName: sFuncName });
                    return null;
                }

                if (!akra.isNull(pCurrentAnalyzedFunction)) {
                    if (!pFunction._isForPixel()) {
                        pCurrentAnalyzedFunction._setForPixel(false);
                    }

                    if (!pFunction._isForVertex()) {
                        pCurrentAnalyzedFunction._setForVertex(false);
                    }
                }

                if (pFunction._getInstructionType() === 44 /* k_FunctionDeclInstruction */) {
                    var pFunctionCallExpr = new akra.fx.FunctionCallInstruction();

                    pFunctionId = new akra.fx.IdExprInstruction();
                    pFunctionId.push(pFunction.getNameId(), false);

                    pExprType = pFunction.getType().wrap();

                    pFunctionCallExpr.setType(pExprType);
                    pFunctionCallExpr.push(pFunctionId, true);

                    if (!akra.isNull(pArguments)) {
                        for (i = 0; i < pArguments.length; i++) {
                            pFunctionCallExpr.push(pArguments[i], true);
                        }

                        var pFunctionArguments = pFunction.getArguments();
                        for (i = 0; i < pArguments.length; i++) {
                            if (pFunctionArguments[i].getType().hasUsage("out")) {
                                if (!pArguments[i].getType().isWritable()) {
                                    this._error(2267 /* BAD_TYPE_FOR_WRITE */);
                                    return null;
                                }

                                if (pArguments[i].getType().isStrongEqual(Effect.getSystemType("ptr"))) {
                                    this.addPointerForExtract(pArguments[i].getType()._getParentVarDecl());
                                }
                            } else if (pFunctionArguments[i].getType().hasUsage("inout")) {
                                if (!pArguments[i].getType().isWritable()) {
                                    this._error(2267 /* BAD_TYPE_FOR_WRITE */);
                                    return null;
                                }

                                if (!pArguments[i].getType().isReadable()) {
                                    this._error(2268 /* BAD_TYPE_FOR_READ */);
                                    return null;
                                }

                                if (pArguments[i].getType().isStrongEqual(Effect.getSystemType("ptr"))) {
                                    this.addPointerForExtract(pArguments[i].getType()._getParentVarDecl());
                                }
                            } else {
                                if (!pArguments[i].getType().isReadable()) {
                                    this._error(2268 /* BAD_TYPE_FOR_READ */);
                                    return null;
                                }
                            }
                        }

                        for (i = pArguments.length; i < pFunctionArguments.length; i++) {
                            pFunctionCallExpr.push(pFunctionArguments[i].getInitializeExpr(), false);
                        }
                    }

                    if (!akra.isNull(pCurrentAnalyzedFunction)) {
                        pCurrentAnalyzedFunction._addUsedFunction(pFunction);
                    }

                    pFunction._markUsedAs(2 /* k_Function */);

                    pExpr = pFunctionCallExpr;
                } else {
                    var pSystemCallExpr = new akra.fx.SystemCallInstruction();

                    pSystemCallExpr.setSystemCallFunction(pFunction);
                    pSystemCallExpr.fillByArguments(pArguments);

                    if (!akra.isNull(pCurrentAnalyzedFunction)) {
                        for (i = 0; i < pArguments.length; i++) {
                            if (!pArguments[i].getType().isReadable()) {
                                this._error(2268 /* BAD_TYPE_FOR_READ */);
                                return null;
                            }
                        }
                    }

                    pExpr = pSystemCallExpr;

                    if (!pFunction.isBuiltIn() && !akra.isNull(pCurrentAnalyzedFunction)) {
                        pCurrentAnalyzedFunction._addUsedFunction(pFunction);
                    }
                }

                this.checkInstruction(pExpr, 0 /* CODE_TARGET_SUPPORT */);

                return pExpr;
            };

            Effect.prototype.analyzeConstructorCallExpr = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pExpr = new akra.fx.ConstructorCallInstruction();
                var pExprType = null;
                var pArguments = null;
                var pConstructorType = null;
                var i = 0;

                pConstructorType = this.analyzeType(pChildren[pChildren.length - 1]);

                if (akra.isNull(pConstructorType)) {
                    this._error(2224 /* BAD_COMPLEX_NOT_TYPE */);
                    return null;
                }

                if (pChildren.length > 3) {
                    var pArgumentExpr = null;

                    pArguments = [];

                    for (i = pChildren.length - 3; i > 0; i--) {
                        if (pChildren[i].value !== ",") {
                            pArgumentExpr = this.analyzeExpr(pChildren[i]);
                            pArguments.push(pArgumentExpr);
                        }
                    }
                }

                pExprType = this.findConstructor(pConstructorType, pArguments);

                if (akra.isNull(pExprType)) {
                    this._error(2225 /* BAD_COMPLEX_NOT_CONSTRUCTOR */, { typeName: pConstructorType.toString() });
                    return null;
                }

                pExpr.setType(pExprType);
                pExpr.push(pConstructorType, false);

                if (!akra.isNull(pArguments)) {
                    for (i = 0; i < pArguments.length; i++) {
                        if (!pArguments[i].getType().isReadable()) {
                            this._error(2268 /* BAD_TYPE_FOR_READ */);
                            return null;
                        }

                        pExpr.push(pArguments[i], true);
                    }
                }

                this.checkInstruction(pExpr, 0 /* CODE_TARGET_SUPPORT */);

                return pExpr;
            };

            Effect.prototype.analyzeSimpleComplexExpr = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pExpr = new akra.fx.ComplexExprInstruction();
                var pComplexExpr;
                var pExprType;

                pComplexExpr = this.analyzeExpr(pChildren[1]);
                pExprType = pComplexExpr.getType();

                pExpr.setType(pExprType);
                pExpr.push(pComplexExpr, true);

                this.checkInstruction(pExpr, 0 /* CODE_TARGET_SUPPORT */);

                return pExpr;
            };

            Effect.prototype.analyzePrimaryExpr = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pExpr = new akra.fx.PrimaryExprInstruction();
                var pPrimaryExpr;
                var pPointer = null;
                var pPrimaryExprType;

                pPrimaryExpr = this.analyzeExpr(pChildren[0]);
                pPrimaryExprType = pPrimaryExpr.getType();

                pPointer = pPrimaryExprType.getPointer();

                if (akra.isNull(pPointer)) {
                    this._error(2222 /* BAD_PRIMARY_NOT_POINT */, { typeName: pPrimaryExprType.getHash() });
                    return null;
                }

                var pPointerVarType = pPrimaryExprType.getParent();
                if (!pPrimaryExprType.isStrictPointer()) {
                    this.getCurrentAnalyzedFunction()._setForPixel(false);
                    this.getCurrentAnalyzedFunction()._notCanUsedAsFunction();
                    pPrimaryExprType._setPointerToStrict();
                }

                pExpr.setType(pPointer.getType());
                pExpr.setOperator("@");
                pExpr.push(pPointer.getNameId(), false);

                this.checkInstruction(pExpr, 0 /* CODE_TARGET_SUPPORT */);

                return pExpr;
            };

            Effect.prototype.analyzePostfixExpr = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var sSymbol = pChildren[pChildren.length - 2].value;

                switch (sSymbol) {
                    case "[":
                        return this.analyzePostfixIndex(pNode);
                    case ".":
                        return this.analyzePostfixPoint(pNode);
                    case "++":
                    case "--":
                        return this.analyzePostfixArithmetic(pNode);
                }
            };

            Effect.prototype.analyzePostfixIndex = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pExpr = new akra.fx.PostfixIndexInstruction();
                var pPostfixExpr = null;
                var pIndexExpr = null;
                var pExprType = null;
                var pPostfixExprType = null;
                var pIndexExprType = null;
                var pIntType = null;

                pPostfixExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
                pPostfixExprType = pPostfixExpr.getType();

                if (!pPostfixExprType.isArray()) {
                    this._error(2217 /* BAD_POSTIX_NOT_ARRAY */, { typeName: pPostfixExprType.toString() });
                    return null;
                }

                pIndexExpr = this.analyzeExpr(pChildren[pChildren.length - 3]);
                pIndexExprType = pIndexExpr.getType();

                pIntType = Effect.getSystemType("int");

                if (!pIndexExprType.isEqual(pIntType)) {
                    this._error(2218 /* BAD_POSTIX_NOT_INT_INDEX */, { typeName: pIndexExprType.toString() });
                    return null;
                }

                pExprType = (pPostfixExprType.getArrayElementType());

                pExpr.setType(pExprType);
                pExpr.push(pPostfixExpr, true);
                pExpr.push(pIndexExpr, true);

                this.checkInstruction(pExpr, 0 /* CODE_TARGET_SUPPORT */);

                return pExpr;
            };

            Effect.prototype.analyzePostfixPoint = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pExpr = new akra.fx.PostfixPointInstruction();
                var pPostfixExpr = null;
                var sFieldName = "";
                var pFieldNameExpr = null;
                var pExprType = null;
                var pPostfixExprType = null;

                pPostfixExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
                pPostfixExprType = pPostfixExpr.getType();

                sFieldName = pChildren[pChildren.length - 3].value;

                pFieldNameExpr = pPostfixExprType.getFieldExpr(sFieldName);

                if (akra.isNull(pFieldNameExpr)) {
                    this._error(2219 /* BAD_POSTIX_NOT_FIELD */, {
                        typeName: pPostfixExprType.toString(),
                        fieldName: sFieldName
                    });
                    return null;
                }

                pExprType = pFieldNameExpr.getType();

                if (pChildren.length === 4) {
                    if (!pExprType.isPointer()) {
                        this._error(2220 /* BAD_POSTIX_NOT_POINTER */, { typeName: pExprType.toString() });
                        return null;
                    }

                    var pBuffer = this.analyzeFromExpr(pChildren[0]);
                    pExprType.setVideoBuffer(pBuffer);
                }

                pExpr.setType(pExprType);
                pExpr.push(pPostfixExpr, true);
                pExpr.push(pFieldNameExpr, true);

                this.checkInstruction(pExpr, 0 /* CODE_TARGET_SUPPORT */);

                return pExpr;
            };

            Effect.prototype.analyzePostfixArithmetic = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var sOperator = pChildren[0].value;
                var pExpr = new akra.fx.PostfixArithmeticInstruction();
                var pPostfixExpr;
                var pExprType;
                var pPostfixExprType;

                pPostfixExpr = this.analyzeExpr(pChildren[1]);
                pPostfixExprType = pPostfixExpr.getType();

                pExprType = this.checkOneOperandExprType(sOperator, pPostfixExprType);

                if (akra.isNull(pExprType)) {
                    this._error(2221 /* BAD_POSTIX_ARITHMETIC */, {
                        operator: sOperator,
                        typeName: pPostfixExprType.toString()
                    });
                    return null;
                }

                pExpr.setType(pExprType);
                pExpr.setOperator(sOperator);
                pExpr.push(pPostfixExpr, true);

                this.checkInstruction(pExpr, 0 /* CODE_TARGET_SUPPORT */);

                return pExpr;
            };

            Effect.prototype.analyzeUnaryExpr = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var sOperator = pChildren[1].value;
                var pExpr = new akra.fx.UnaryExprInstruction();
                var pUnaryExpr;
                var pExprType;
                var pUnaryExprType;

                pUnaryExpr = this.analyzeExpr(pChildren[0]);
                pUnaryExprType = pUnaryExpr.getType();

                pExprType = this.checkOneOperandExprType(sOperator, pUnaryExprType);

                if (akra.isNull(pExprType)) {
                    this._error(2216 /* BAD_UNARY_OPERATION */, {
                        operator: sOperator,
                        tyepName: pUnaryExprType.toString()
                    });
                    return null;
                }

                pExpr.setOperator(sOperator);
                pExpr.setType(pExprType);
                pExpr.push(pUnaryExpr, true);

                this.checkInstruction(pExpr, 0 /* CODE_TARGET_SUPPORT */);

                return pExpr;
            };

            Effect.prototype.analyzeCastExpr = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pExpr = new akra.fx.CastExprInstruction();
                var pExprType;
                var pCastedExpr;

                pExprType = this.analyzeConstTypeDim(pChildren[2]);
                pCastedExpr = this.analyzeExpr(pChildren[0]);

                if (!pCastedExpr.getType().isReadable()) {
                    this._error(2268 /* BAD_TYPE_FOR_READ */);
                    return null;
                }

                pExpr.setType(pExprType);
                pExpr.push(pExprType, true);
                pExpr.push(pCastedExpr, true);

                this.checkInstruction(pExpr, 0 /* CODE_TARGET_SUPPORT */);

                return pExpr;
            };

            Effect.prototype.analyzeConditionalExpr = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pExpr = new akra.fx.ConditionalExprInstruction();
                var pConditionExpr;
                var pTrueExpr;
                var pFalseExpr;
                var pConditionType;
                var pTrueExprType;
                var pFalseExprType;
                var pExprType;
                var pBoolType;

                pConditionExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
                pTrueExpr = this.analyzeExpr(pChildren[pChildren.length - 3]);
                pFalseExpr = this.analyzeExpr(pChildren[0]);

                pConditionType = pConditionExpr.getType();
                pTrueExprType = pTrueExpr.getType();
                pFalseExprType = pFalseExpr.getType();

                pBoolType = Effect.getSystemType("bool");

                if (!pConditionType.isEqual(pBoolType)) {
                    this._error(2211 /* BAD_CONDITION_TYPE */, { typeName: pConditionType.toString() });
                    return null;
                }

                if (!pTrueExprType.isEqual(pFalseExprType)) {
                    this._error(2212 /* BAD_CONDITION_VALUE_TYPES */, {
                        leftTypeName: pTrueExprType.toString(),
                        rightTypeName: pFalseExprType.toString()
                    });
                    return null;
                }

                if (!pConditionType.isReadable()) {
                    this._error(2268 /* BAD_TYPE_FOR_READ */);
                    return null;
                }

                if (!pTrueExprType.isReadable()) {
                    this._error(2268 /* BAD_TYPE_FOR_READ */);
                    return null;
                }

                if (!pFalseExprType.isReadable()) {
                    this._error(2268 /* BAD_TYPE_FOR_READ */);
                    return null;
                }

                pExpr.setType(pTrueExprType);
                pExpr.push(pConditionExpr, true);
                pExpr.push(pTrueExpr, true);
                pExpr.push(pFalseExpr, true);

                this.checkInstruction(pExpr, 0 /* CODE_TARGET_SUPPORT */);

                return pExpr;
            };

            Effect.prototype.analyzeArithmeticExpr = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var sOperator = pNode.children[1].value;
                var pExpr = new akra.fx.ArithmeticExprInstruction();
                var pLeftExpr = null;
                var pRightExpr = null;
                var pLeftType = null;
                var pRightType = null;
                var pExprType = null;

                pLeftExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
                pRightExpr = this.analyzeExpr(pChildren[0]);

                pLeftType = pLeftExpr.getType();
                pRightType = pRightExpr.getType();

                pExprType = this.checkTwoOperandExprTypes(sOperator, pLeftType, pRightType);

                if (akra.isNull(pExprType)) {
                    this._error(2206 /* BAD_ARITHMETIC_OPERATION */, {
                        operator: sOperator,
                        leftTypeName: pLeftType.toString(),
                        rightTypeName: pRightType.toString()
                    });
                    return null;
                }

                pExpr.setOperator(sOperator);
                pExpr.setType(pExprType);
                pExpr.push(pLeftExpr, true);
                pExpr.push(pRightExpr, true);

                this.checkInstruction(pExpr, 0 /* CODE_TARGET_SUPPORT */);

                return pExpr;
            };

            Effect.prototype.analyzeRelationExpr = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var sOperator = pNode.children[1].value;
                var pExpr = new akra.fx.RelationalExprInstruction();
                var pLeftExpr;
                var pRightExpr;
                var pLeftType;
                var pRightType;
                var pExprType;

                pLeftExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
                pRightExpr = this.analyzeExpr(pChildren[0]);

                pLeftType = pLeftExpr.getType();
                pRightType = pRightExpr.getType();

                pExprType = this.checkTwoOperandExprTypes(sOperator, pLeftType, pRightType);

                if (akra.isNull(pExprType)) {
                    this._error(2209 /* BAD_RELATIONAL_OPERATION */, {
                        operator: sOperator,
                        leftTypeName: pLeftType.getHash(),
                        rightTypeName: pRightType.getHash()
                    });
                    return null;
                }

                pExpr.setOperator(sOperator);
                pExpr.setType(pExprType);
                pExpr.push(pLeftExpr, true);
                pExpr.push(pRightExpr, true);

                this.checkInstruction(pExpr, 0 /* CODE_TARGET_SUPPORT */);

                return pExpr;
            };

            Effect.prototype.analyzeLogicalExpr = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var sOperator = pNode.children[1].value;
                var pExpr = new akra.fx.LogicalExprInstruction();
                var pLeftExpr;
                var pRightExpr;
                var pLeftType;
                var pRightType;
                var pBoolType;

                pLeftExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
                pRightExpr = this.analyzeExpr(pChildren[0]);

                pLeftType = pLeftExpr.getType();
                pRightType = pRightExpr.getType();

                pBoolType = Effect.getSystemType("bool");

                if (!pLeftType.isEqual(pBoolType)) {
                    this._error(2210 /* BAD_LOGICAL_OPERATION */, {
                        operator: sOperator,
                        typeName: pLeftType.toString()
                    });
                    return null;
                }
                if (!pRightType.isEqual(pBoolType)) {
                    this._error(2210 /* BAD_LOGICAL_OPERATION */, {
                        operator: sOperator,
                        typeName: pRightType.toString()
                    });
                    return null;
                }

                if (!pLeftType.isReadable()) {
                    this._error(2268 /* BAD_TYPE_FOR_READ */);
                    return null;
                }

                if (!pRightType.isReadable()) {
                    this._error(2268 /* BAD_TYPE_FOR_READ */);
                    return null;
                }

                pExpr.setOperator(sOperator);
                pExpr.setType(pBoolType.getVariableType());
                pExpr.push(pLeftExpr, true);
                pExpr.push(pRightExpr, true);

                this.checkInstruction(pExpr, 0 /* CODE_TARGET_SUPPORT */);

                return pExpr;
            };

            Effect.prototype.analyzeAssignmentExpr = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var sOperator = pChildren[1].value;
                var pExpr = new akra.fx.AssignmentExprInstruction();
                var pLeftExpr;
                var pRightExpr;
                var pLeftType;
                var pRightType;
                var pExprType;

                pLeftExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
                pRightExpr = this.analyzeExpr(pChildren[0]);

                pLeftType = pLeftExpr.getType();
                pRightType = pRightExpr.getType();

                if (sOperator !== "=") {
                    pExprType = this.checkTwoOperandExprTypes(sOperator, pLeftType, pRightType);
                    if (akra.isNull(pExprType)) {
                        this._error(2207 /* BAD_ARITHMETIC_ASSIGNMENT_OPERATION */, {
                            operator: sOperator,
                            leftTypeName: pLeftType.getHash(),
                            rightTypeName: pRightType.getHash()
                        });
                    }
                } else {
                    pExprType = pRightType;
                }

                pExprType = this.checkTwoOperandExprTypes("=", pLeftType, pExprType);

                if (akra.isNull(pExprType)) {
                    this._error(2208 /* BAD_ASSIGNMENT_OPERATION */, {
                        leftTypeName: pLeftType.getHash(),
                        rightTypeName: pRightType.getHash()
                    });
                }

                pExpr.setOperator(sOperator);
                pExpr.setType(pExprType);
                pExpr.push(pLeftExpr, true);
                pExpr.push(pRightExpr, true);

                this.checkInstruction(pExpr, 0 /* CODE_TARGET_SUPPORT */);

                return pExpr;
            };

            Effect.prototype.analyzeIdExpr = function (pNode) {
                this.setAnalyzedNode(pNode);

                var sName = pNode.value;
                var pVariable = this.getVariable(sName);

                if (akra.isNull(pVariable)) {
                    this._error(2205 /* UNKNOWN_VARNAME */, { varName: sName });
                    return null;
                }

                if (pVariable.getType()._isUnverifiable() && !this.isAnalzeInPass()) {
                    this._error(2276 /* BAD_USE_OF_ENGINE_VARIABLE */);
                    return null;
                }

                if (!akra.isNull(this.getCurrentAnalyzedFunction())) {
                    if (!pVariable._isForPixel()) {
                        this.getCurrentAnalyzedFunction()._setForPixel(false);
                    }
                    if (!pVariable._isForVertex()) {
                        this.getCurrentAnalyzedFunction()._setForVertex(false);
                    }
                }

                var pVarId = new akra.fx.IdExprInstruction();
                pVarId.push(pVariable.getNameId(), false);

                this.checkInstruction(pVarId, 0 /* CODE_TARGET_SUPPORT */);

                return pVarId;
            };

            Effect.prototype.analyzeSimpleExpr = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pInstruction = null;
                var sName = pNode.name;
                var sValue = pNode.value;

                switch (sName) {
                    case "T_UINT":
                        pInstruction = new akra.fx.IntInstruction();
                        pInstruction.setValue(sValue * 1);
                        break;
                    case "T_FLOAT":
                        pInstruction = new akra.fx.FloatInstruction();
                        pInstruction.setValue(sValue * 1.0);
                        break;
                    case "T_STRING":
                        pInstruction = new akra.fx.StringInstruction();
                        pInstruction.setValue(sValue);
                        break;
                    case "T_KW_TRUE":
                        pInstruction = new akra.fx.BoolInstruction();
                        pInstruction.setValue(true);
                        break;
                    case "T_KW_FALSE":
                        pInstruction = new akra.fx.BoolInstruction();
                        pInstruction.setValue(false);
                        break;
                }

                return pInstruction;
            };

            Effect.prototype.analyzeMemExpr = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pMemExpr = new akra.fx.MemExprInstruction();

                var pPostfixExpr = this.analyzeExpr(pChildren[0]);
                var pPostfixExprType = pPostfixExpr.getType();

                if (!pPostfixExprType.isFromVariableDecl()) {
                    this._error(2253 /* BAD_MEMOF_ARGUMENT */);
                    return null;
                }

                var pBuffer = pPostfixExprType.getVideoBuffer();

                if (akra.isNull(pBuffer)) {
                    this._error(2254 /* BAD_MEMOF_NO_BUFFER */);
                }

                if (!pPostfixExprType.isStrictPointer() && !akra.isNull(this.getCurrentAnalyzedFunction())) {
                    this.getCurrentAnalyzedFunction()._setForPixel(false);
                    this.getCurrentAnalyzedFunction()._notCanUsedAsFunction();
                    pPostfixExprType._setPointerToStrict();
                }

                pMemExpr.setBuffer(pBuffer);

                return pMemExpr;
            };

            Effect.prototype.analyzeConstTypeDim = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                if (pChildren.length > 1) {
                    this._error(2213 /* BAD_CAST_TYPE_USAGE */);
                    return null;
                }

                var pType;

                pType = (this.analyzeType(pChildren[0]));

                if (!pType.isBase()) {
                    this._error(2214 /* BAD_CAST_TYPE_NOT_BASE */, { typeName: pType.toString() });
                }

                this.checkInstruction(pType, 0 /* CODE_TARGET_SUPPORT */);

                return pType;
            };

            Effect.prototype.analyzeVarStructDecl = function (pNode, pInstruction) {
                if (typeof pInstruction === "undefined") { pInstruction = null; }
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pUsageType = null;
                var pVariable = null;
                var i = 0;

                pUsageType = this.analyzeUsageStructDecl(pChildren[pChildren.length - 1]);

                for (i = pChildren.length - 2; i >= 1; i--) {
                    if (pChildren[i].name === "Variable") {
                        pVariable = this.analyzeVariable(pChildren[i], pUsageType);

                        if (!akra.isNull(pInstruction)) {
                            pInstruction.push(pVariable, true);
                        }
                    }
                }
            };

            Effect.prototype.analyzeUsageStructDecl = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var i = 0;
                var pType = new akra.fx.VariableTypeInstruction();

                for (i = pChildren.length - 1; i >= 0; i--) {
                    if (pChildren[i].name === "StructDecl") {
                        var pMainType = this.analyzeStructDecl(pChildren[i]);
                        pType.pushType(pMainType);

                        var pTypeDecl = new akra.fx.TypeDeclInstruction();
                        pTypeDecl.push(pMainType, true);

                        this.addTypeDecl(pTypeDecl);
                    } else if (pChildren[i].name === "Usage") {
                        var sUsage = this.analyzeUsage(pChildren[i]);
                        pType.addUsage(sUsage);
                    }
                }

                this.checkInstruction(pType, 0 /* CODE_TARGET_SUPPORT */);

                return pType;
            };

            Effect.prototype.analyzeTypeDecl = function (pNode, pParentInstruction) {
                if (typeof pParentInstruction === "undefined") { pParentInstruction = null; }
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                var pTypeDeclInstruction = new akra.fx.TypeDeclInstruction();

                if (pChildren.length === 2) {
                    var pStructInstruction = this.analyzeStructDecl(pChildren[1]);
                    pTypeDeclInstruction.push(pStructInstruction, true);
                } else {
                    this._error(2203 /* UNSUPPORTED_TYPEDECL */);
                }

                this.checkInstruction(pTypeDeclInstruction, 0 /* CODE_TARGET_SUPPORT */);

                this.addTypeDecl(pTypeDeclInstruction);

                pNode.isAnalyzed = true;

                if (!akra.isNull(pParentInstruction)) {
                    pParentInstruction.push(pTypeDeclInstruction, true);
                }

                return pTypeDeclInstruction;
            };

            Effect.prototype.analyzeStructDecl = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                var pStruct = new akra.fx.ComplexTypeInstruction();
                var pFieldCollector = new akra.fx.InstructionCollector();

                var sName = pChildren[pChildren.length - 2].value;

                pStruct.setName(sName);

                this.newScope(1 /* k_Struct */);

                var i = 0;
                for (i = pChildren.length - 4; i >= 1; i--) {
                    if (pChildren[i].name === "VariableDecl") {
                        this.analyzeVariableDecl(pChildren[i], pFieldCollector);
                    }
                }

                this.endScope();

                pStruct.addFields(pFieldCollector, true);

                this.checkInstruction(pStruct, 0 /* CODE_TARGET_SUPPORT */);

                return pStruct;
            };

            Effect.prototype.analyzeStruct = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                var pStruct = new akra.fx.ComplexTypeInstruction();
                var pFieldCollector = new akra.fx.InstructionCollector();

                this.newScope(1 /* k_Struct */);

                var i = 0;
                for (i = pChildren.length - 4; i >= 1; i--) {
                    if (pChildren[i].name === "VariableDecl") {
                        this.analyzeVariableDecl(pChildren[i], pFieldCollector);
                    }
                }

                this.endScope();

                pStruct.addFields(pFieldCollector, true);

                this.checkInstruction(pStruct, 0 /* CODE_TARGET_SUPPORT */);

                return pStruct;
            };

            Effect.prototype.analyzeFunctionDeclOnlyDefinition = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pFunction = null;
                var pFunctionDef = null;
                var pStmtBlock = null;
                var pAnnotation = null;
                var sLastNodeValue = pChildren[0].value;
                var bNeedAddFunction = false;

                pFunctionDef = this.analyzeFunctionDef(pChildren[pChildren.length - 1]);

                pFunction = this.findFunctionByDef(pFunctionDef);

                if (!akra.isDef(pFunction)) {
                    this._error(2246 /* BAD_CANNOT_CHOOSE_FUNCTION */, { funcName: pFunction.getNameId().toString() });
                    return null;
                }

                if (!akra.isNull(pFunction) && pFunction.hasImplementation()) {
                    this._error(2227 /* BAD_REDEFINE_FUNCTION */, { funcName: pFunction.getNameId().toString() });
                    return null;
                }

                if (akra.isNull(pFunction)) {
                    pFunction = new akra.fx.FunctionDeclInstruction();
                    bNeedAddFunction = true;
                } else {
                    if (!pFunction.getReturnType().isEqual(pFunctionDef.getReturnType())) {
                        this._error(2247 /* BAD_FUNCTION_DEF_RETURN_TYPE */, { funcName: pFunction.getNameId().toString() });
                        return null;
                    }

                    bNeedAddFunction = false;
                }

                pFunction.setFunctionDef(pFunctionDef);

                this.resumeScope();

                if (pChildren.length === 3) {
                    pAnnotation = this.analyzeAnnotation(pChildren[1]);
                    pFunction.setAnnotation(pAnnotation);
                }

                if (sLastNodeValue !== ";") {
                    pFunction._setParseNode(pNode);
                    pFunction._setImplementationScope(this.getScope());
                    this._pFunctionWithImplementationList.push(pFunction);
                }

                this.endScope();

                if (bNeedAddFunction) {
                    this.addFunctionDecl(pFunction);
                }
            };

            Effect.prototype.resumeFunctionAnalysis = function (pAnalzedFunction) {
                var pFunction = pAnalzedFunction;
                var pNode = pFunction._getParseNode();

                this.setAnalyzedNode(pNode);
                this.setScope(pFunction._getImplementationScope());

                var pChildren = pNode.children;
                var pStmtBlock = null;

                this.setCurrentAnalyzedFunction(pFunction);

                // LOG("-----Analyze function '" + pFunction.getName() + "'------");
                pStmtBlock = this.analyzeStmtBlock(pChildren[0]);
                pFunction.setImplementation(pStmtBlock);

                this.setCurrentAnalyzedFunction(null);

                this.endScope();

                this.checkInstruction(pFunction, 0 /* CODE_TARGET_SUPPORT */);
            };

            Effect.prototype.analyzeFunctionDef = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pFunctionDef = new akra.fx.FunctionDefInstruction();
                var pReturnType = null;
                var pFuncName = null;
                var pArguments = null;
                var sFuncName = pChildren[pChildren.length - 2].value;

                pReturnType = this.analyzeUsageType(pChildren[pChildren.length - 1]);

                if (pReturnType.isPointer() || pReturnType._containSampler() || pReturnType._containPointer()) {
                    this._error(2264 /* BAD_RETURN_TYPE_FOR_FUNCTION */, { funcName: sFuncName });
                    return null;
                }

                pFuncName = new akra.fx.IdInstruction();
                pFuncName.setName(sFuncName);

                pFunctionDef.setReturnType(pReturnType);
                pFunctionDef.setFunctionName(pFuncName);

                if (pChildren.length === 4) {
                    var sSemantic = this.analyzeSemantic(pChildren[0]);
                    pFunctionDef.setSemantic(sSemantic);
                }

                this.newScope();

                this.analyzeParamList(pChildren[pChildren.length - 3], pFunctionDef);

                this.endScope();

                this.checkInstruction(pFunctionDef, 0 /* CODE_TARGET_SUPPORT */);

                return pFunctionDef;
            };

            Effect.prototype.analyzeParamList = function (pNode, pFunctionDef) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pParameter;

                var i = 0;

                for (i = pChildren.length - 2; i >= 1; i--) {
                    if (pChildren[i].name === "ParameterDecl") {
                        pParameter = this.analyzeParameterDecl(pChildren[i]);
                        pParameter._setScope(this.getScope());
                        pFunctionDef.addParameter(pParameter, this.isStrictMode());
                    }
                }
            };

            Effect.prototype.analyzeParameterDecl = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pType = null;
                var pParameter = null;

                pType = this.analyzeParamUsageType(pChildren[1]);
                pParameter = this.analyzeVariable(pChildren[0], pType);

                return pParameter;
            };

            Effect.prototype.analyzeParamUsageType = function (pNode) {
                var pChildren = pNode.children;
                var i = 0;
                var pType = new akra.fx.VariableTypeInstruction();

                for (i = pChildren.length - 1; i >= 0; i--) {
                    if (pChildren[i].name === "Type") {
                        var pMainType = this.analyzeType(pChildren[i]);
                        pType.pushType(pMainType);
                    } else if (pChildren[i].name === "ParamUsage") {
                        var sUsage = this.analyzeUsage(pChildren[i]);
                        pType.addUsage(sUsage);
                    }
                }

                this.checkInstruction(pType, 0 /* CODE_TARGET_SUPPORT */);

                return pType;
            };

            Effect.prototype.analyzeStmtBlock = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pStmtBlock = new akra.fx.StmtBlockInstruction();
                var pStmt;
                var i = 0;

                pStmtBlock._setScope(this.getScope());

                this.newScope();

                for (i = pChildren.length - 2; i > 0; i--) {
                    pStmt = this.analyzeStmt(pChildren[i]);
                    if (!akra.isNull(pStmt)) {
                        pStmtBlock.push(pStmt);
                    }

                    this.addExtactionStmts(pStmtBlock);
                }

                this.endScope();

                this.checkInstruction(pStmtBlock, 0 /* CODE_TARGET_SUPPORT */);

                return pStmtBlock;
            };

            Effect.prototype.analyzeStmt = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var sFirstNodeName = pChildren[pChildren.length - 1].name;

                switch (sFirstNodeName) {
                    case "SimpleStmt":
                        return this.analyzeSimpleStmt(pChildren[0]);
                    case "UseDecl":
                        this.analyzeUseDecl(pChildren[0]);
                        return null;
                    case "T_KW_WHILE":
                        return this.analyzeWhileStmt(pNode);
                    case "T_KW_FOR":
                        return this.analyzeForStmt(pNode);
                    case "T_KW_IF":
                        return this.analyzeIfStmt(pNode);
                }
            };

            Effect.prototype.analyzeSimpleStmt = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var sFirstNodeName = pChildren[pChildren.length - 1].name;

                switch (sFirstNodeName) {
                    case "T_KW_RETURN":
                        return this.analyzeReturnStmt(pNode);

                    case "T_KW_DO":
                        return this.analyzeWhileStmt(pNode);

                    case "StmtBlock":
                        return this.analyzeStmtBlock(pChildren[0]);

                    case "T_KW_DISCARD":
                    case "T_KW_BREAK":
                    case "T_KW_CONTINUE":
                        return this.analyzeBreakStmt(pNode);

                    case "TypeDecl":
                    case "VariableDecl":
                    case "VarStructDecl":
                        return this.analyzeDeclStmt(pChildren[0]);

                    default:
                        if (pChildren.length === 2) {
                            return this.analyzeExprStmt(pNode);
                        } else {
                            return (new akra.fx.SemicolonStmtInstruction());
                        }
                }
            };

            Effect.prototype.analyzeReturnStmt = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pReturnStmtInstruction = new akra.fx.ReturnStmtInstruction();

                var pFunctionReturnType = this.getCurrentAnalyzedFunction().getReturnType();

                if (pFunctionReturnType.isEqual(Effect.getSystemType("void")) && pChildren.length === 3) {
                    this._error(2261 /* BAD_RETURN_STMT_VOID */);
                    return null;
                } else if (!pFunctionReturnType.isEqual(Effect.getSystemType("void")) && pChildren.length === 2) {
                    this._error(2262 /* BAD_RETURN_STMT_EMPTY */);
                    return null;
                }

                if (pChildren.length === 3) {
                    var pExprInstruction = this.analyzeExpr(pChildren[1]);
                    var pOutVar = this.getCurrentAnalyzedFunction()._getOutVariable();

                    if (!akra.isNull(pOutVar) && pOutVar.getType() !== pExprInstruction.getType()) {
                        this._error(2263 /* BAD_RETURN_STMT_NOT_EQUAL_TYPES */);
                        return null;
                    }

                    if (!pFunctionReturnType.isEqual(pExprInstruction.getType())) {
                        this._error(2263 /* BAD_RETURN_STMT_NOT_EQUAL_TYPES */);
                        return null;
                    }
                    pReturnStmtInstruction.push(pExprInstruction, true);
                }

                this.checkInstruction(pReturnStmtInstruction, 0 /* CODE_TARGET_SUPPORT */);

                return pReturnStmtInstruction;
            };

            Effect.prototype.analyzeBreakStmt = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pBreakStmtInstruction = new akra.fx.BreakStmtInstruction();
                var sOperatorName = pChildren[1].value;

                pBreakStmtInstruction.setOperator(sOperatorName);

                if (sOperatorName === "discard" && !akra.isNull(this.getCurrentAnalyzedFunction())) {
                    this.getCurrentAnalyzedFunction()._setForVertex(false);
                }

                this.checkInstruction(pBreakStmtInstruction, 0 /* CODE_TARGET_SUPPORT */);

                return pBreakStmtInstruction;
            };

            Effect.prototype.analyzeDeclStmt = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var sNodeName = pNode.name;
                var pDeclStmtInstruction = new akra.fx.DeclStmtInstruction();

                switch (sNodeName) {
                    case "TypeDecl":
                        this.analyzeTypeDecl(pNode, pDeclStmtInstruction);
                        break;
                    case "VariableDecl":
                        this.analyzeVariableDecl(pNode, pDeclStmtInstruction);
                        break;
                    case "VarStructDecl":
                        this.analyzeVarStructDecl(pNode, pDeclStmtInstruction);
                        break;
                }

                this.checkInstruction(pDeclStmtInstruction, 0 /* CODE_TARGET_SUPPORT */);

                return pDeclStmtInstruction;
            };

            Effect.prototype.analyzeExprStmt = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pExprStmtInstruction = new akra.fx.ExprStmtInstruction();
                var pExprInstruction = this.analyzeExpr(pChildren[1]);

                pExprStmtInstruction.push(pExprInstruction, true);

                this.checkInstruction(pExprStmtInstruction, 0 /* CODE_TARGET_SUPPORT */);

                return pExprStmtInstruction;
            };

            Effect.prototype.analyzeWhileStmt = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var isDoWhile = (pChildren[pChildren.length - 1].value === "do");
                var isNonIfStmt = (pNode.name === "NonIfStmt") ? true : false;

                var pWhileStmt = new akra.fx.WhileStmtInstruction();
                var pCondition = null;
                var pConditionType = null;
                var pBoolType = Effect.getSystemType("bool");
                var pStmt = null;

                if (isDoWhile) {
                    pWhileStmt.setOperator("do_while");
                    pCondition = this.analyzeExpr(pChildren[2]);
                    pConditionType = pCondition.getType();

                    if (!pConditionType.isEqual(pBoolType)) {
                        this._error(2229 /* BAD_DO_WHILE_CONDITION */, { typeName: pConditionType.toString() });
                        return null;
                    }

                    pStmt = this.analyzeStmt(pChildren[0]);
                } else {
                    pWhileStmt.setOperator("while");
                    pCondition = this.analyzeExpr(pChildren[2]);
                    pConditionType = pCondition.getType();

                    if (!pConditionType.isEqual(pBoolType)) {
                        this._error(2228 /* BAD_WHILE_CONDITION */, { typeName: pConditionType.toString() });
                        return null;
                    }

                    if (isNonIfStmt) {
                        pStmt = this.analyzeNonIfStmt(pChildren[0]);
                    } else {
                        pStmt = this.analyzeStmt(pChildren[0]);
                    }

                    pWhileStmt.push(pCondition, true);
                    pWhileStmt.push(pStmt, true);
                }

                this.checkInstruction(pWhileStmt, 0 /* CODE_TARGET_SUPPORT */);

                return pWhileStmt;
            };

            Effect.prototype.analyzeIfStmt = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var isIfElse = (pChildren.length === 7);

                var pIfStmtInstruction = new akra.fx.IfStmtInstruction();
                var pCondition = this.analyzeExpr(pChildren[pChildren.length - 3]);
                var pConditionType = pCondition.getType();
                var pBoolType = Effect.getSystemType("bool");

                var pIfStmt = null;
                var pElseStmt = null;

                if (!pConditionType.isEqual(pBoolType)) {
                    this._error(2230 /* BAD_IF_CONDITION */, { typeName: pConditionType.toString() });
                    return null;
                }

                pIfStmtInstruction.push(pCondition, true);

                if (isIfElse) {
                    pIfStmtInstruction.setOperator("if_else");
                    pIfStmt = this.analyzeNonIfStmt(pChildren[2]);
                    pElseStmt = this.analyzeStmt(pChildren[0]);

                    pIfStmtInstruction.push(pIfStmt, true);
                    pIfStmtInstruction.push(pElseStmt, true);
                } else {
                    pIfStmtInstruction.setOperator("if");
                    pIfStmt = this.analyzeNonIfStmt(pChildren[0]);

                    pIfStmtInstruction.push(pIfStmt, true);
                }

                this.checkInstruction(pIfStmtInstruction, 0 /* CODE_TARGET_SUPPORT */);

                return pIfStmtInstruction;
            };

            Effect.prototype.analyzeNonIfStmt = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var sFirstNodeName = pChildren[pChildren.length - 1].name;

                switch (sFirstNodeName) {
                    case "SimpleStmt":
                        return this.analyzeSimpleStmt(pChildren[0]);
                    case "T_KW_WHILE":
                        return this.analyzeWhileStmt(pNode);
                    case "T_KW_FOR":
                        return this.analyzeForStmt(pNode);
                }
            };

            Effect.prototype.analyzeForStmt = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var isNonIfStmt = (pNode.name === "NonIfStmt");
                var pForStmtInstruction = new akra.fx.ForStmtInstruction();
                var pStmt = null;

                this.newScope();

                this.analyzeForInit(pChildren[pChildren.length - 3], pForStmtInstruction);
                this.analyzeForCond(pChildren[pChildren.length - 4], pForStmtInstruction);

                if (pChildren.length === 7) {
                    this.analyzeForStep(pChildren[2], pForStmtInstruction);
                } else {
                    pForStmtInstruction.push(null);
                }

                if (isNonIfStmt) {
                    pStmt = this.analyzeNonIfStmt(pChildren[0]);
                } else {
                    pStmt = this.analyzeStmt(pChildren[0]);
                }

                pForStmtInstruction.push(pStmt, true);

                this.endScope();

                this.checkInstruction(pForStmtInstruction, 0 /* CODE_TARGET_SUPPORT */);

                return pForStmtInstruction;
            };

            Effect.prototype.analyzeForInit = function (pNode, pForStmtInstruction) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var sFirstNodeName = pChildren[pChildren.length - 1].name;

                switch (sFirstNodeName) {
                    case "VariableDecl":
                        this.analyzeVariableDecl(pChildren[0], pForStmtInstruction);
                        break;
                    case "Expr":
                        var pExpr = this.analyzeExpr(pChildren[0]);
                        pForStmtInstruction.push(pExpr, true);
                        break;
                    default:
                        // ForInit : ';'
                        pForStmtInstruction.push(null);
                        break;
                }

                return;
            };

            Effect.prototype.analyzeForCond = function (pNode, pForStmtInstruction) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                if (pChildren.length === 1) {
                    pForStmtInstruction.push(null);
                    return;
                }

                var pConditionExpr = this.analyzeExpr(pChildren[1]);

                pForStmtInstruction.push(pConditionExpr, true);
                return;
            };

            Effect.prototype.analyzeForStep = function (pNode, pForStmtInstruction) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pStepExpr = this.analyzeExpr(pChildren[0]);

                pForStmtInstruction.push(pStepExpr, true);

                return;
            };

            Effect.prototype.analyzeUseDecl = function (pNode) {
                this.setAnalyzedNode(pNode);
                this.setStrictModeOn();
            };

            Effect.prototype.analyzeTechniqueForImport = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var pTechnique = new akra.fx.TechniqueInstruction();
                var sTechniqueName = this.analyzeComplexName(pChildren[pChildren.length - 2]);
                var isComplexName = pChildren[pChildren.length - 2].children.length !== 1;

                pTechnique.setName(sTechniqueName, isComplexName);

                for (var i = pChildren.length - 3; i >= 0; i--) {
                    if (pChildren[i].name === "Annotation") {
                        var pAnnotation = this.analyzeAnnotation(pChildren[i]);
                        pTechnique.setAnnotation(pAnnotation);
                    } else if (pChildren[i].name === "Semantic") {
                        var sSemantic = this.analyzeSemantic(pChildren[i]);
                        pTechnique.setSemantic(sSemantic);
                    } else {
                        this.analyzeTechniqueBodyForImports(pChildren[i], pTechnique);
                    }
                }

                this.addTechnique(pTechnique);
            };

            Effect.prototype.analyzeComplexName = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var sName = "";

                for (var i = pChildren.length - 1; i >= 0; i--) {
                    sName += pChildren[i].value;
                }

                return sName;
            };

            Effect.prototype.analyzeTechniqueBodyForImports = function (pNode, pTechnique) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                for (var i = pChildren.length - 2; i >= 1; i--) {
                    this.analyzePassDeclForImports(pChildren[i], pTechnique);
                }
            };

            Effect.prototype.analyzePassDeclForImports = function (pNode, pTechnique) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                if (pChildren[0].name === "ImportDecl") {
                    this.analyzeImportDecl(pChildren[0], pTechnique);
                } else if (pChildren.length > 1) {
                    var pPass = new akra.fx.PassInstruction();

                    //TODO: add annotation and id
                    this.analyzePassStateBlockForShaders(pChildren[0], pPass);

                    pPass._setParseNode(pNode);

                    pTechnique.addPass(pPass);
                }
            };

            Effect.prototype.analyzePassStateBlockForShaders = function (pNode, pPass) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                for (var i = pChildren.length - 2; i >= 1; i--) {
                    this.analyzePassStateForShader(pChildren[i], pPass);
                }
            };

            Effect.prototype.analyzePassStateForShader = function (pNode, pPass) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                if (pChildren.length === 1) {
                    pPass._markAsComplex(true);

                    if (pChildren[0].name === "StateIf") {
                        this.analyzePassStateIfForShader(pChildren[0], pPass);
                    } else if (pChildren[0].name === "StateSwitch") {
                        this.analyzePassStateSwitchForShader(pChildren[0], pPass);
                    }

                    return;
                }

                var sType = pChildren[pChildren.length - 1].value.toUpperCase();
                var eShaderType = 0 /* k_Vertex */;

                if (sType === "VERTEXSHADER") {
                    eShaderType = 0 /* k_Vertex */;
                } else if (sType === "PIXELSHADER") {
                    eShaderType = 1 /* k_Pixel */;
                } else {
                    return;
                }

                pNode.isAnalyzed = true;

                var pStateExprNode = pChildren[pChildren.length - 3];
                var pExprNode = pStateExprNode.children[pStateExprNode.children.length - 1];
                var pCompileExpr = this.analyzeExpr(pExprNode);
                var pShaderFunc = pCompileExpr.getFunction();

                if (eShaderType === 0 /* k_Vertex */) {
                    if (!pShaderFunc._checkDefenitionForVertexUsage()) {
                        this._error(2259 /* BAD_FUNCTION_VERTEX_DEFENITION */, { funcDef: pShaderFunc._getStringDef() });
                    }
                } else {
                    if (!pShaderFunc._checkDefenitionForPixelUsage()) {
                        this._error(2260 /* BAD_FUNCTION_PIXEL_DEFENITION */, { funcDef: pShaderFunc._getStringDef() });
                    }
                }

                pShaderFunc._markUsedAs(eShaderType);

                pPass._addFoundFunction(pNode, pShaderFunc, eShaderType);
            };

            Effect.prototype.analyzePassStateIfForShader = function (pNode, pPass) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                if (pChildren.length === 5) {
                    this.analyzePassStateBlockForShaders(pChildren[0], pPass);
                } else if (pChildren.length === 7 && pChildren[0].name === "PassStateBlock") {
                    this.analyzePassStateBlockForShaders(pChildren[2], pPass);
                    this.analyzePassStateBlockForShaders(pChildren[0], pPass);
                } else {
                    this.analyzePassStateBlockForShaders(pChildren[2], pPass);
                    this.analyzePassStateIfForShader(pChildren[0], pPass);
                }
            };

            Effect.prototype.analyzePassStateSwitchForShader = function (pNode, pPass) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                this.analyzePassCaseBlockForShader(pChildren[0], pPass);
            };

            Effect.prototype.analyzePassCaseBlockForShader = function (pNode, pPass) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                for (var i = pChildren.length - 2; i >= 1; i--) {
                    if (pChildren[i].name === "CaseState") {
                        this.analyzePassCaseStateForShader(pChildren[i], pPass);
                    } else if (pChildren[i].name === "DefaultState") {
                        this.analyzePassDefaultStateForShader(pChildren[i], pPass);
                    }
                }
            };

            Effect.prototype.analyzePassCaseStateForShader = function (pNode, pPass) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                for (var i = pChildren.length - 4; i >= 0; i--) {
                    if (pChildren[i].name === "PassState") {
                        this.analyzePassStateForShader(pChildren[i], pPass);
                    }
                }
            };

            Effect.prototype.analyzePassDefaultStateForShader = function (pNode, pPass) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                for (var i = pChildren.length - 3; i >= 0; i--) {
                    if (pChildren[i].name === "PassState") {
                        this.analyzePassStateForShader(pChildren[i], pPass);
                    }
                }
            };

            Effect.prototype.resumeTechniqueAnalysis = function (pTechnique) {
                var pPassList = pTechnique.getPassList();

                for (var i = 0; i < pPassList.length; i++) {
                    this.resumePassAnalysis(pPassList[i]);
                }

                if (!pTechnique.checkForCorrectImports()) {
                    this._error(2275 /* BAD_TECHNIQUE_IMPORT */, { techniqueName: pTechnique.getName() });
                    return;
                }

                pTechnique.setGlobalParams(this._sProvideNameSpace, this._pImportedGlobalTechniqueList);
            };

            Effect.prototype.resumePassAnalysis = function (pPass) {
                var pNode = pPass._getParseNode();

                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                this.setAnalyzeInPass(true);
                this.analyzePassStateBlock(pChildren[0], pPass);
                this.setAnalyzeInPass(false);

                pPass.finalizePass();
            };

            Effect.prototype.analyzePassStateBlock = function (pNode, pPass) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                pPass._addCodeFragment("{");

                for (var i = pChildren.length - 2; i >= 1; i--) {
                    this.analyzePassState(pChildren[i], pPass);
                }

                pPass._addCodeFragment("}");
            };

            Effect.prototype.analyzePassState = function (pNode, pPass) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                if (pChildren.length === 1) {
                    if (pChildren[0].name === "StateIf") {
                        this.analyzePassStateIf(pChildren[0], pPass);
                    } else if (pChildren[0].name === "StateSwitch") {
                        this.analyzePassStateSwitch(pChildren[0], pPass);
                    }

                    return;
                }

                if (pNode.isAnalyzed) {
                    var pFunc = pPass._getFoundedFunction(pNode);
                    var eShaderType = pPass._getFoundedFunctionType(pNode);
                    var pShader = null;

                    if (eShaderType === 0 /* k_Vertex */) {
                        pShader = pFunc._getVertexShader();
                    } else {
                        pShader = pFunc._getPixelShader();
                    }

                    pPass.addShader(pShader);
                } else {
                    var sType = pChildren[pChildren.length - 1].value.toUpperCase();
                    var eType = null;
                    var pStateExprNode = pChildren[pChildren.length - 3];
                    var pExprNode = pStateExprNode.children[pStateExprNode.children.length - 1];

                    switch (sType) {
                        case "BLENDENABLE":
                            eType = 0 /* BLENDENABLE */;
                            break;
                        case "CULLFACEENABLE":
                            eType = 1 /* CULLFACEENABLE */;
                            break;
                        case "ZENABLE":
                            eType = 2 /* ZENABLE */;
                            break;
                        case "ZWRITEENABLE":
                            eType = 3 /* ZWRITEENABLE */;
                            break;
                        case "DITHERENABLE":
                            eType = 4 /* DITHERENABLE */;
                            break;
                        case "SCISSORTESTENABLE":
                            eType = 5 /* SCISSORTESTENABLE */;
                            break;
                        case "STENCILTESTENABLE":
                            eType = 6 /* STENCILTESTENABLE */;
                            break;
                        case "POLYGONOFFSETFILLENABLE":
                            eType = 7 /* POLYGONOFFSETFILLENABLE */;
                            break;
                        case "CULLFACE":
                            eType = 8 /* CULLFACE */;
                            break;
                        case "FRONTFACE":
                            eType = 9 /* FRONTFACE */;
                            break;
                        case "SRCBLEND":
                            eType = 10 /* SRCBLEND */;
                            break;
                        case "DESTBLEND":
                            eType = 11 /* DESTBLEND */;
                            break;
                        case "ZFUNC":
                            eType = 12 /* ZFUNC */;
                            break;
                        case "ALPHABLENDENABLE":
                            eType = 13 /* ALPHABLENDENABLE */;
                            break;
                        case "ALPHATESTENABLE":
                            eType = 14 /* ALPHATESTENABLE */;
                            break;

                        default:
                            akra.logger.warn("Unsupported render state type used: " + sType + ". WebGl...");
                            return;
                    }

                    if (pExprNode.value === "{" || pExprNode.value === "<" || akra.isNull(pExprNode.value)) {
                        akra.logger.warn("So pass state are incorrect");
                        return;
                    }

                    var sValue = pExprNode.value.toUpperCase();
                    var eValue = null;

                    switch (eType) {
                        case 13 /* ALPHABLENDENABLE */:
                        case 14 /* ALPHATESTENABLE */:
                            akra.logger.warn("ALPHABLENDENABLE/ALPHATESTENABLE not supported in WebGL.");
                            return;

                        case 0 /* BLENDENABLE */:
                        case 1 /* CULLFACEENABLE */:
                        case 2 /* ZENABLE */:
                        case 3 /* ZWRITEENABLE */:
                        case 4 /* DITHERENABLE */:
                        case 5 /* SCISSORTESTENABLE */:
                        case 6 /* STENCILTESTENABLE */:
                        case 7 /* POLYGONOFFSETFILLENABLE */:
                            switch (sValue) {
                                case "TRUE":
                                    eValue = 1 /* TRUE */;
                                    break;
                                case "FALSE":
                                    eValue = 2 /* FALSE */;
                                    break;

                                default:
                                    akra.logger.warn("Unsupported render state ALPHABLENDENABLE/ZENABLE/ZWRITEENABLE/DITHERENABLE value used: " + sValue + ".");
                                    return;
                            }
                            break;

                        case 8 /* CULLFACE */:
                            switch (sValue) {
                                case "FRONT":
                                    eValue = 17 /* FRONT */;
                                    break;
                                case "BACK":
                                    eValue = 18 /* BACK */;
                                    break;
                                case "FRONT_AND_BACK":
                                    eValue = 19 /* FRONT_AND_BACK */;
                                    break;

                                default:
                                    akra.logger.warn("Unsupported render state CULLFACE value used: " + sValue + ".");
                                    return;
                            }
                            break;

                        case 9 /* FRONTFACE */:
                            switch (sValue) {
                                case "CW":
                                    eValue = 15 /* CW */;
                                    break;
                                case "CCW":
                                    eValue = 16 /* CCW */;
                                    break;

                                default:
                                    akra.logger.warn("Unsupported render state SRCBLEND/DESTBLEND value used: " + sValue + ".");
                                    return;
                            }
                            break;

                        case 10 /* SRCBLEND */:
                        case 11 /* DESTBLEND */:
                            switch (sValue) {
                                case "ZERO":
                                    eValue = 3 /* ZERO */;
                                    break;
                                case "ONE":
                                    eValue = 4 /* ONE */;
                                    break;
                                case "SRCCOLOR":
                                    eValue = 5 /* SRCCOLOR */;
                                    break;
                                case "INVSRCCOLOR":
                                    eValue = 6 /* INVSRCCOLOR */;
                                    break;
                                case "SRCALPHA":
                                    eValue = 7 /* SRCALPHA */;
                                    break;
                                case "INVSRCALPHA":
                                    eValue = 8 /* INVSRCALPHA */;
                                    break;
                                case "DESTALPHA":
                                    eValue = 9 /* DESTALPHA */;
                                    break;
                                case "INVDESTALPHA":
                                    eValue = 10 /* INVDESTALPHA */;
                                    break;
                                case "DESTCOLOR":
                                    eValue = 11 /* DESTCOLOR */;
                                    break;
                                case "INVDESTCOLOR":
                                    eValue = 12 /* INVDESTCOLOR */;
                                    break;
                                case "SRCALPHASAT":
                                    eValue = 13 /* SRCALPHASAT */;
                                    break;

                                default:
                                    akra.logger.warn("Unsupported render state SRCBLEND/DESTBLEND value used: " + sValue + ".");
                                    return;
                            }
                            break;

                        case 12 /* ZFUNC */:
                            switch (sValue) {
                                case "NEVER":
                                    eValue = 20 /* NEVER */;
                                    break;
                                case "LESS":
                                    eValue = 21 /* LESS */;
                                    break;
                                case "EQUAL":
                                    eValue = 22 /* EQUAL */;
                                    break;
                                case "LESSEQUAL":
                                    eValue = 23 /* LESSEQUAL */;
                                    break;
                                case "GREATER":
                                    eValue = 24 /* GREATER */;
                                    break;
                                case "NOTEQUAL":
                                    eValue = 25 /* NOTEQUAL */;
                                    break;
                                case "GREATEREQUAL":
                                    eValue = 26 /* GREATEREQUAL */;
                                    break;
                                case "ALWAYS":
                                    eValue = 27 /* ALWAYS */;
                                    break;

                                default:
                                    akra.logger.warn("Unsupported render state ZFUNC value used: " + sValue + ".");
                                    return;
                            }
                            break;
                    }

                    pPass.setState(eType, eValue);
                }
            };

            Effect.prototype.analyzePassStateIf = function (pNode, pPass) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                var pIfExpr = this.analyzeExpr(pChildren[pChildren.length - 3]);
                pIfExpr.prepareFor(3 /* k_PassFunction */);

                pPass._addCodeFragment("if(" + pIfExpr.toFinalCode() + ")");

                this.analyzePassStateBlock(pChildren[pChildren.length - 5], pPass);

                if (pChildren.length > 5) {
                    pPass._addCodeFragment("else");

                    if (pChildren[0].name === "PassStateBlock") {
                        this.analyzePassStateBlock(pChildren[0], pPass);
                    } else {
                        pPass._addCodeFragment(" ");
                        this.analyzePassStateIf(pChildren[0], pPass);
                    }
                }
            };

            Effect.prototype.analyzePassStateSwitch = function (pNode, pPass) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                var sCodeFragment = "switch";
                var pSwitchExpr = this.analyzeExpr(pChildren[pChildren.length - 3]);
                pSwitchExpr.prepareFor(3 /* k_PassFunction */);

                pPass._addCodeFragment("(" + pSwitchExpr.toFinalCode() + ")");

                this.analyzePassCaseBlock(pChildren[0], pPass);
            };

            Effect.prototype.analyzePassCaseBlock = function (pNode, pPass) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                pPass._addCodeFragment("{");

                for (var i = pChildren.length - 2; i >= 1; i--) {
                    if (pChildren[i].name === "CaseState") {
                        this.analyzePassCaseState(pChildren[i], pPass);
                    } else if (pChildren[i].name === "DefaultState") {
                        this.analyzePassDefault(pChildren[i], pPass);
                    }
                }

                pPass._addCodeFragment("}");
            };

            Effect.prototype.analyzePassCaseState = function (pNode, pPass) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                var pCaseStateExpr = this.analyzeExpr(pChildren[pChildren.length - 2]);
                pCaseStateExpr.prepareFor(3 /* k_PassFunction */);

                pPass._addCodeFragment("case " + pCaseStateExpr.toFinalCode() + ": ");

                for (var i = pChildren.length - 4; i >= 0; i--) {
                    if (pChildren[i].name === "PassState") {
                        this.analyzePassStateForShader(pChildren[i], pPass);
                    } else {
                        pPass._addCodeFragment(pChildren[i].value);
                    }
                }
            };

            Effect.prototype.analyzePassDefault = function (pNode, pPass) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                pPass._addCodeFragment("default: ");

                for (var i = pChildren.length - 3; i >= 0; i--) {
                    if (pChildren[i].name === "PassState") {
                        this.analyzePassStateForShader(pChildren[i], pPass);
                    } else {
                        pPass._addCodeFragment(pChildren[i].value);
                    }
                }
            };

            Effect.prototype.analyzeImportDecl = function (pNode, pTechnique) {
                if (typeof pTechnique === "undefined") { pTechnique = null; }
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;
                var sComponentName = this.analyzeComplexName(pChildren[pChildren.length - 2]);
                var iShift = 0;

                if (pChildren[0].name === "ExtOpt") {
                    akra.logger.warn("We don`t suppor ext-commands for import");
                }
                if (pChildren.length !== 2) {
                    iShift = this.analyzeShiftOpt(pChildren[0]);
                }

                if (!akra.isNull(pTechnique)) {
                    //We can import techniques from the same file, but on this stage they don`t have component yet.
                    //So we need special mehanism to add them on more belated stage
                    var sShortedComponentName = sComponentName;
                    if (this._sProvideNameSpace !== "") {
                        sShortedComponentName = sComponentName.replace(this._sProvideNameSpace + ".", "");
                    }

                    var pTechniqueFromSameEffect = this._pTechniqueMap[sComponentName] || this._pTechniqueMap[sShortedComponentName];
                    if (akra.isDefAndNotNull(pTechniqueFromSameEffect)) {
                        pTechnique.addTechniqueFromSameEffect(pTechniqueFromSameEffect, iShift);
                        return;
                    }
                }

                var pComponent = this._pComposer.getComponentByName(sComponentName);
                if (!pComponent) {
                    this._error(2277 /* BAD_IMPORTED_COMPONENT_NOT_EXIST */, { componentName: sComponentName });
                    return;
                }

                this.addComponent(pComponent, iShift, pTechnique);
            };

            Effect.prototype.analyzeProvideDecl = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                if (pChildren.length === 2) {
                    this._sProvideNameSpace = this.analyzeComplexName(pChildren[0]);
                } else {
                    this._error(2303 /* UNSUPPORTED_PROVIDE_AS */);
                    return;
                }
            };

            Effect.prototype.analyzeShiftOpt = function (pNode) {
                this.setAnalyzedNode(pNode);

                var pChildren = pNode.children;

                var iShift = (pChildren[0].value);

                if (pChildren.length === 2) {
                    iShift *= 1;
                } else {
                    iShift *= -1;
                }

                return iShift;
            };

            Effect.prototype.addComponent = function (pComponent, iShift, pTechnique) {
                if (!akra.isNull(pTechnique)) {
                    pTechnique.addComponent(pComponent, iShift);
                } else {
                    if (akra.isNull(this._pImportedGlobalTechniqueList)) {
                        this._pImportedGlobalTechniqueList = [];
                    }

                    this._pImportedGlobalTechniqueList.push({
                        technique: pComponent.getTechnique(),
                        component: pComponent,
                        shift: iShift
                    });
                }

                //TODO: add correct add of compnent, not global
                var pComponentTechnique = pComponent.getTechnique();
                if (this.isAddedTechnique(pComponentTechnique)) {
                    return;
                }

                var pSharedListV = pComponentTechnique.getSharedVariablesForVertex();
                var pSharedListP = pComponentTechnique.getSharedVariablesForPixel();

                for (var i = 0; i < pSharedListV.length; i++) {
                    this.addExternalSharedVariable(pSharedListV[i], 0 /* k_Vertex */);
                }

                for (var i = 0; i < pSharedListP.length; i++) {
                    this.addExternalSharedVariable(pSharedListP[i], 1 /* k_Pixel */);
                }

                if (akra.isNull(this._pAddedTechniqueList)) {
                    this._pAddedTechniqueList = [];
                }

                this._pAddedTechniqueList.push(pTechnique);
            };

            Effect.prototype.isAddedTechnique = function (pTechnique) {
                if (akra.isNull(this._pAddedTechniqueList)) {
                    return false;
                }

                for (var i = 0; i < this._pAddedTechniqueList.length; i++) {
                    if (this._pAddedTechniqueList[i] === pTechnique) {
                        return true;
                    }
                }

                return false;
            };

            /**
            * Проверят возможность использования оператора между двумя типами.
            * Возращает тип получаемый в результате приминения опрератора, или, если применить его невозможно - null.
            *
            * @sOperator {string} Один из операторов: + - * / % += -= *= /= %= = < > <= >= == != =
            * @pLeftType {IAFXVariableTypeInstruction} Тип левой части выражения
            * @pRightType {IAFXVariableTypeInstruction} Тип правой части выражения
            */
            Effect.prototype.checkTwoOperandExprTypes = function (sOperator, pLeftType, pRightType) {
                if (pLeftType._isUnverifiable()) {
                    return pLeftType;
                }

                if (pRightType._isUnverifiable()) {
                    return pRightType;
                }

                var isComplex = pLeftType.isComplex() || pRightType.isComplex();
                var isArray = pLeftType.isNotBaseArray() || pRightType.isNotBaseArray();
                var isSampler = Effect.isSamplerType(pLeftType) || Effect.isSamplerType(pRightType);
                var pBoolType = Effect.getSystemType("bool").getVariableType();

                if (isArray || isSampler) {
                    return null;
                }

                if (sOperator === "%" || sOperator === "%=") {
                    return null;
                }

                if (this.isAssignmentOperator(sOperator)) {
                    if (!pLeftType.isWritable()) {
                        this._error(2267 /* BAD_TYPE_FOR_WRITE */);
                        return null;
                    }

                    if (pLeftType.isStrongEqual(Effect.getSystemType("ptr"))) {
                        this.addPointerForExtract(pLeftType._getParentVarDecl());
                    }

                    if (!pRightType.isReadable()) {
                        this._error(2268 /* BAD_TYPE_FOR_READ */);
                        return null;
                    }

                    if (sOperator !== "=" && !pLeftType.isReadable()) {
                        this._error(2268 /* BAD_TYPE_FOR_READ */);
                    }
                } else {
                    if (!pLeftType.isReadable()) {
                        this._error(2268 /* BAD_TYPE_FOR_READ */);
                        return null;
                    }

                    if (!pRightType.isReadable()) {
                        this._error(2268 /* BAD_TYPE_FOR_READ */);
                        return null;
                    }
                }

                if (isComplex) {
                    if (sOperator === "=" && pLeftType.isEqual(pRightType)) {
                        return pLeftType;
                    } else if (this.isEqualOperator(sOperator) && !pLeftType._containArray() && !pLeftType._containSampler()) {
                        return pBoolType;
                    } else {
                        return null;
                    }
                }

                var pReturnType = null;
                var pLeftBaseType = pLeftType.getBaseType().getVariableType();
                var pRightBaseType = pRightType.getBaseType().getVariableType();

                if (pLeftType.isConst() && this.isAssignmentOperator(sOperator)) {
                    return null;
                }

                if (pLeftType.isEqual(pRightType)) {
                    if (this.isArithmeticalOperator(sOperator)) {
                        if (!Effect.isMatrixType(pLeftType) || (sOperator !== "/" && sOperator !== "/=")) {
                            return pLeftBaseType;
                        } else {
                            return null;
                        }
                    } else if (this.isRelationalOperator(sOperator)) {
                        if (Effect.isScalarType(pLeftType)) {
                            return pBoolType;
                        } else {
                            return null;
                        }
                    } else if (this.isEqualOperator(sOperator)) {
                        return pBoolType;
                    } else if (sOperator === "=") {
                        return pLeftBaseType;
                    } else {
                        return null;
                    }
                }

                if (this.isArithmeticalOperator(sOperator)) {
                    if (Effect.isBoolBasedType(pLeftType) || Effect.isBoolBasedType(pRightType) || Effect.isFloatBasedType(pLeftType) !== Effect.isFloatBasedType(pRightType) || Effect.isIntBasedType(pLeftType) !== Effect.isIntBasedType(pRightType)) {
                        return null;
                    }

                    if (Effect.isScalarType(pLeftType)) {
                        return pRightBaseType;
                    }

                    if (Effect.isScalarType(pRightType)) {
                        return pLeftBaseType;
                    }

                    if (sOperator === "*" || sOperator === "*=") {
                        if (Effect.isMatrixType(pLeftType) && Effect.isVectorType(pRightType) && pLeftType.getLength() === pRightType.getLength()) {
                            return pRightBaseType;
                        } else if (Effect.isMatrixType(pRightType) && Effect.isVectorType(pLeftType) && pLeftType.getLength() === pRightType.getLength()) {
                            return pLeftBaseType;
                        } else {
                            return null;
                        }
                    }
                }

                return null;
            };

            /**
            * Проверят возможность использования оператора к типу данных.
            * Возращает тип получаемый в результате приминения опрератора, или, если применить его невозможно - null.
            *
            * @sOperator {string} Один из операторов: + - ! ++ --
            * @pLeftType {IAFXVariableTypeInstruction} Тип операнда
            */
            Effect.prototype.checkOneOperandExprType = function (sOperator, pType) {
                if (pType._isUnverifiable === undefined) {
                    akra.debug.log(pType);
                }
                if (pType._isUnverifiable()) {
                    return pType;
                }

                var isComplex = pType.isComplex();
                var isArray = pType.isNotBaseArray();
                var isSampler = Effect.isSamplerType(pType);

                if (isComplex || isArray || isSampler) {
                    return null;
                }

                if (!pType.isReadable()) {
                    this._error(2268 /* BAD_TYPE_FOR_READ */);
                    return null;
                }

                if (sOperator === "++" || sOperator === "--") {
                    if (!pType.isWritable()) {
                        this._error(2267 /* BAD_TYPE_FOR_WRITE */);
                        return null;
                    }

                    if (pType.isStrongEqual(Effect.getSystemType("ptr"))) {
                        this.addPointerForExtract(pType._getParentVarDecl());
                    }

                    return pType;
                }

                if (sOperator === "!") {
                    var pBoolType = Effect.getSystemType("bool").getVariableType();

                    if (pType.isEqual(pBoolType)) {
                        return pBoolType;
                    } else {
                        return null;
                    }
                } else {
                    if (Effect.isBoolBasedType(pType)) {
                        return null;
                    } else {
                        return pType.getBaseType().getVariableType();
                    }
                }
                //return null;
            };

            Effect.prototype.isAssignmentOperator = function (sOperator) {
                return sOperator === "+=" || sOperator === "-=" || sOperator === "*=" || sOperator === "/=" || sOperator === "%=" || sOperator === "=";
            };

            Effect.prototype.isArithmeticalOperator = function (sOperator) {
                return sOperator === "+" || sOperator === "+=" || sOperator === "-" || sOperator === "-=" || sOperator === "*" || sOperator === "*=" || sOperator === "/" || sOperator === "/=";
            };

            Effect.prototype.isRelationalOperator = function (sOperator) {
                return sOperator === ">" || sOperator === ">=" || sOperator === "<" || sOperator === "<=";
            };

            Effect.prototype.isEqualOperator = function (sOperator) {
                return sOperator === "==" || sOperator === "!=";
            };

            Effect.prototype.addExtactionStmts = function (pStmt) {
                var pPointerList = this.getPointerForExtractList();

                for (var i = 0; i < pPointerList.length; i++) {
                    this.generateExtractStmtFromPointer(pPointerList[i], pStmt);
                }

                this.clearPointersForExtract();
            };

            Effect.prototype.generateExtractStmtFromPointer = function (pPointer, pParentStmt) {
                var pPointerType = pPointer.getType();
                var pWhatExtracted = pPointerType._getDownPointer();
                var pWhatExtractedType = null;

                var pFunction = this.getCurrentAnalyzedFunction();

                while (!akra.isNull(pWhatExtracted)) {
                    pWhatExtractedType = pWhatExtracted.getType();

                    if (!pWhatExtractedType.isComplex()) {
                        var pSingleExtract = new akra.fx.ExtractStmtInstruction();
                        pSingleExtract.generateStmtForBaseType(pWhatExtracted, pWhatExtractedType.getPointer(), pWhatExtractedType.getVideoBuffer(), 0, null);

                        this.checkInstruction(pSingleExtract, 0 /* CODE_TARGET_SUPPORT */);

                        pParentStmt.push(pSingleExtract, true);

                        if (!akra.isNull(pFunction)) {
                            pFunction._addUsedFunction(pSingleExtract.getExtractFunction());
                        }
                    } else {
                        this.generateExtractStmtForComplexVar(pWhatExtracted, pParentStmt, pWhatExtractedType.getPointer(), pWhatExtractedType.getVideoBuffer(), 0);
                    }

                    pWhatExtracted = pWhatExtractedType._getDownPointer();
                }

                return pParentStmt;
            };

            Effect.prototype.generateExtractStmtForComplexVar = function (pVarDecl, pParentStmt, pPointer, pBuffer, iPadding) {
                var pVarType = pVarDecl.getType();
                var pFieldNameList = pVarType.getFieldNameList();
                var pField = null;
                var pFieldType = null;
                var pSingleExtract = null;

                var pFunction = this.getCurrentAnalyzedFunction();

                for (var i = 0; i < pFieldNameList.length; i++) {
                    pField = pVarType.getField(pFieldNameList[i]);

                    if (akra.isNull(pField)) {
                        continue;
                    }

                    pFieldType = pField.getType();

                    if (pFieldType.isPointer()) {
                        var pFieldPointer = pFieldType._getMainPointer();
                        pSingleExtract = new akra.fx.ExtractStmtInstruction();
                        pSingleExtract.generateStmtForBaseType(pFieldPointer, pPointer, pFieldType.getVideoBuffer(), iPadding + pFieldType.getPadding(), null);

                        this.checkInstruction(pSingleExtract, 0 /* CODE_TARGET_SUPPORT */);

                        pParentStmt.push(pSingleExtract, true);
                        this.generateExtractStmtFromPointer(pFieldPointer, pParentStmt);

                        if (!akra.isNull(pFunction)) {
                            pFunction._addUsedFunction(pSingleExtract.getExtractFunction());
                        }
                    } else if (pFieldType.isComplex()) {
                        this.generateExtractStmtForComplexVar(pField, pParentStmt, pPointer, pBuffer, iPadding + pFieldType.getPadding());
                    } else {
                        pSingleExtract = new akra.fx.ExtractStmtInstruction();
                        pSingleExtract.generateStmtForBaseType(pField, pPointer, pBuffer, iPadding + pFieldType.getPadding(), null);

                        this.checkInstruction(pSingleExtract, 0 /* CODE_TARGET_SUPPORT */);

                        pParentStmt.push(pSingleExtract, true);

                        if (!akra.isNull(pFunction)) {
                            pFunction._addUsedFunction(pSingleExtract.getExtractFunction());
                        }
                    }
                }
            };

            Effect.prototype.getNodeSourceLocation = function (pNode) {
                if (akra.isDef(pNode.line)) {
                    return { line: pNode.line, column: pNode.start };
                } else {
                    return this.getNodeSourceLocation(pNode.children[pNode.children.length - 1]);
                }
            };

            Effect.prototype.checkInstruction = function (pInst, eStage) {
                if (!pInst.check(eStage)) {
                    this._errorFromInstruction(pInst.getLastError());
                }
            };
            Effect.pSystemMacros = null;
            Effect.pSystemTypes = null;
            Effect.pSystemFunctions = null;
            Effect.pSystemVariables = null;
            Effect.pSystemVertexOut = null;
            return Effect;
        })();
        fx.Effect = Effect;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=Effect.js.map
