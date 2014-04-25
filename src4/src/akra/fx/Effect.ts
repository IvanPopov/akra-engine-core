/// <reference path="../idl/IAFXEffect.ts" />
/// <reference path="../idl/parser/IParser.ts" />
/// <reference path="../idl/IAFXInstruction.ts" />
/// <reference path="../idl/IAFXComposer.ts" />
/// <reference path="../idl/IAFXComponent.ts" />
/// <reference path="../idl/EEffectErrors.ts" />
/// <reference path="../idl/IEffectErrorInfo.ts" />
/// <reference path="../idl/IScope.ts" />
/// <reference path="../idl/IMap.ts" />

/// <reference path="../time.ts" />
/// <reference path="../math/math.ts" />
/// <reference path="../debug.ts" />


/// <reference path="errors.ts" />

/// <reference path="instructions/ArithmeticExprInstruction.ts" />
/// <reference path="instructions/AssignmentExprInstruction.ts" />
/// <reference path="instructions/BoolInstruction.ts" />
/// <reference path="instructions/BreakStmtInstruction.ts" />
/// <reference path="instructions/CastExprInstruction.ts" />
/// <reference path="instructions/ComplexExprInstruction.ts" />
/// <reference path="instructions/ComplexTypeInstruction.ts" />
/// <reference path="instructions/CompileExprInstruction.ts" />
/// <reference path="instructions/ConditionalExprInstruction.ts" />
/// <reference path="instructions/ConstructorCallInstruction.ts" />
/// <reference path="instructions/DeclStmtInstruction.ts" />
/// <reference path="instructions/ExprStmtInstruction.ts" />
/// <reference path="ExprTemplateTranslator.ts" />
/// <reference path="instructions/ExtractStmtInstruction.ts" />
/// <reference path="instructions/FloatInstruction.ts" />
/// <reference path="instructions/ForStmtInstruction.ts" />
/// <reference path="instructions/FunctionCallInstruction.ts" />
/// <reference path="instructions/FunctionDefInstruction.ts" />
/// <reference path="instructions/IdExprInstruction.ts" />
/// <reference path="instructions/IfStmtInstruction.ts" />
/// <reference path="instructions/IntInstruction.ts" />
/// <reference path="instructions/FunctionInstruction.ts" />
/// <reference path="instructions/IdInstruction.ts" />
/// <reference path="instructions/InitExprInstruction.ts" />
/// <reference path="instructions/InstructionCollector.ts" />
/// <reference path="instructions/LogicalExprInstruction.ts" />
/// <reference path="instructions/MemExprInstruction.ts" />
/// <reference path="instructions/PassInstruction.ts" />
/// <reference path="instructions/PostfixArithmeticInstruction.ts" />
/// <reference path="instructions/PostfixIndexInstruction.ts" />
/// <reference path="instructions/PostfixPointInstruction.ts" />
/// <reference path="instructions/PrimaryExprInstruction.ts" />
/// <reference path="ProgramScope.ts" />
/// <reference path="instructions/RelationalExprInstruction.ts" />
/// <reference path="instructions/ReturnStmtInstruction.ts" />
/// <reference path="instructions/SamplerStateBlockInstruction.ts" />
/// <reference path="instructions/SemicolonStmtInstruction.ts" />
/// <reference path="instructions/SimpleInstruction.ts" />
/// <reference path="instructions/StmtBlockInstruction.ts" />
/// <reference path="instructions/StringInstruction.ts" />
/// <reference path="instructions/SystemCallInstruction.ts" />
/// <reference path="instructions/SystemFunctionInstruction.ts" />
/// <reference path="instructions/SystemTypeInstruction.ts" />
/// <reference path="instructions/TechniqueInstruction.ts" />
/// <reference path="instructions/TypeInstruction.ts" />
/// <reference path="instructions/VariableTypeInstruction.ts" />
/// <reference path="instructions/VariableInstruction.ts" />
/// <reference path="instructions/UnaryExprInstruction.ts" />
/// <reference path="instructions/WhileStmtInstruction.ts" />

module akra.fx {

	import Vec2 = math.Vec2;
	import Vec3 = math.Vec3;
	import Vec4 = math.Vec4;
	import Mat3 = math.Mat3;
	import Mat4 = math.Mat4;

	/** @const */
	var TEMPLATE_TYPE = "template";

	final export class Effect implements IAFXEffect {
		private _pComposer: IAFXComposer = null;

		private _pParseTree: parser.IParseTree = null;
		private _pAnalyzedNode: parser.IParseNode = null;

		private _pEffectScope: ProgramScope = null;
		private _pCurrentInstruction: IAFXInstruction = null;
		private _pCurrentFunction: IAFXFunctionDeclInstruction = null;
		private _pCurrentPass: IAFXPassInstruction = null;
		private _bHaveCurrentFunctionReturnOccur = false;

		private _pStatistics: IAFXEffectStats = null;

		private _sAnalyzedFileName: string = "";

		private _pSystemMacros: IAFXSimpleInstructionMap = null;
		private _pSystemTypes: IMap<instructions.SystemTypeInstruction> = null;
		private _pSystemFunctionsMap: IMap<instructions.SystemFunctionInstruction[]> = null;
		private _pSystemFunctionHashMap: IMap<boolean> = null;
		private _pSystemVariables: IAFXVariableDeclMap = null;

		private _pPointerForExtractionList: IAFXVariableDeclInstruction[] = null;

		private _pFunctionWithImplementationList: IAFXFunctionDeclInstruction[] = null;

		private _pTechniqueList: IAFXTechniqueInstruction[] = null;
		private _pTechniqueMap: IMap<IAFXTechniqueInstruction> = null;

		private _isAnalyzeInPass: boolean = false;

		private _sProvideNameSpace: string = "";

		private _pImportedGlobalTechniqueList: IAFXImportedTechniqueInfo[] = null;

		private _pAddedTechniqueList: IAFXTechniqueInstruction[] = null;

		static pSystemMacros: IAFXSimpleInstructionMap = null;
		static pSystemTypes: IMap<instructions.SystemTypeInstruction> = null;
		static pSystemFunctions: IMap<instructions.SystemFunctionInstruction[]> = null;
		static pSystemVariables: IAFXVariableDeclMap = null;
		static pSystemVertexOut: instructions.ComplexTypeInstruction = null;

		constructor(pComposer: IAFXComposer) {
			this._pComposer = pComposer;

			this._pParseTree = null;
			this._pAnalyzedNode = null;

			this._pEffectScope = new ProgramScope();
			this._pCurrentInstruction = null;

			this._pStatistics = null;
			this._sAnalyzedFileName = "";

			this._pPointerForExtractionList = [];

			this._pFunctionWithImplementationList = [];
			this._pTechniqueList = [];
			this._pTechniqueMap = <IMap<IAFXTechniqueInstruction>>{};

			this.initSystemMacros();
			this.initSystemTypes();
			this.initSystemFunctions();
			this.initSystemVariables();
		}

		analyze(pTree: parser.IParseTree): boolean {
			var pRootNode: parser.IParseNode = pTree.getRoot();
			var iParseTime: uint = time();

			// LOG(this);

			this._pParseTree = pTree;
			this._pStatistics = <IAFXEffectStats>{ time: 0 };

			try {
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
			}
			catch (e) {
				if (config.DEBUG) {
					throw e;
				}
				else {
					return false;
				}
			}

			//Stats
			iParseTime = time() - iParseTime;
			this._pStatistics.time = iParseTime;

			//LOG(this, iParseTime);

			return true;
		}

		getStats(): IAFXEffectStats {
			return this._pStatistics;
		}

		setAnalyzedFileName(sFileName: string): void {
			this._sAnalyzedFileName = sFileName;
		}

		clear(): void {
		}

		getTechniqueList(): IAFXTechniqueInstruction[] {
			return this._pTechniqueList;
		}

		static getBaseVertexOutType(): instructions.ComplexTypeInstruction {
			return Effect.pSystemVertexOut;
		}
		static getSystemType(sTypeName: string): instructions.SystemTypeInstruction {
			//boolean, string, float and others
			return isDef(Effect.pSystemTypes[sTypeName]) ? Effect.pSystemTypes[sTypeName] : null;
		}

		static getSystemVariable(sName: string): IAFXVariableDeclInstruction {
			return isDef(Effect.pSystemVariables[sName]) ? Effect.pSystemVariables[sName] : null;
		}

		static getSystemMacros(sName: string): IAFXSimpleInstruction {
			return isDef(Effect.pSystemMacros[sName]) ? Effect.pSystemMacros[sName] : null;
		}

		static findSystemFunction(sFunctionName: string,
			pArguments: IAFXTypedInstruction[]): IAFXFunctionDeclInstruction {
			var pSystemFunctions: instructions.SystemFunctionInstruction[] = Effect.pSystemFunctions[sFunctionName];

			if (!isDef(pSystemFunctions)) {
				return null;
			}

			if (isNull(pArguments)) {
				for (var i: uint = 0; i < pSystemFunctions.length; i++) {
					if (pSystemFunctions[i]._getNumNeededArguments() === 0) {
						return <IAFXFunctionDeclInstruction>pSystemFunctions[i];
					}
				}
			}

			for (var i: uint = 0; i < pSystemFunctions.length; i++) {
				if (pArguments.length !== pSystemFunctions[i]._getNumNeededArguments()) {
					continue;
				}

				var pTestedArguments: IAFXTypedInstruction[] = pSystemFunctions[i]._getArguments();

				var isOk: boolean = true;

				for (var j: uint = 0; j < pArguments.length; j++) {
					isOk = false;

					if (!pArguments[j]._getType()._isEqual(pTestedArguments[j]._getType())) {
						break;
					}

					isOk = true;
				}

				if (isOk) {
					return <IAFXFunctionDeclInstruction>pSystemFunctions[i];
				}
			}
		}

		static createVideoBufferVariable(): IAFXVariableDeclInstruction {
			var pBuffer: IAFXVariableDeclInstruction = new instructions.VariableDeclInstruction();
			var pBufferType: IAFXVariableTypeInstruction = new instructions.VariableTypeInstruction();
			var pBufferName: IAFXIdInstruction = new instructions.IdInstruction();

			pBufferType._pushType(Effect.getSystemType("video_buffer"));

			pBuffer._push(pBufferType, true);
			pBuffer._push(pBufferName, true);

			return pBuffer;
		}

		static getExternalType(pType: IAFXTypeInstruction): any {
			if (pType._isEqual(Effect.getSystemType("int")) ||
				pType._isEqual(Effect.getSystemType("float"))) {
				return Number;
			}
			else if (pType._isEqual(Effect.getSystemType("bool"))) {
				return Boolean;
			}
			else if (pType._isEqual(Effect.getSystemType("float2")) ||
				pType._isEqual(Effect.getSystemType("bool2")) ||
				pType._isEqual(Effect.getSystemType("int2"))) {
				return Vec2;
			}
			else if (pType._isEqual(Effect.getSystemType("float3")) ||
				pType._isEqual(Effect.getSystemType("bool3")) ||
				pType._isEqual(Effect.getSystemType("int3"))) {
				return Vec3;
			}
			else if (pType._isEqual(Effect.getSystemType("float4")) ||
				pType._isEqual(Effect.getSystemType("bool4")) ||
				pType._isEqual(Effect.getSystemType("int4"))) {
				return Vec4;
			}
			// 	else if(pType._isEqual(Effect.getSystemType("float2x2")) ||
			// pType._isEqual(Effect.getSystemType("bool2x2")) ||
			// pType._isEqual(Effect.getSystemType("int2x2"))){
			// 		return Vec2;
			// 	}
			else if (pType._isEqual(Effect.getSystemType("float3x3")) ||
				pType._isEqual(Effect.getSystemType("bool3x3")) ||
				pType._isEqual(Effect.getSystemType("int3x3"))) {
				return Mat3;
			}
			else if (pType._isEqual(Effect.getSystemType("float4x4")) ||
				pType._isEqual(Effect.getSystemType("bool4x4")) ||
				pType._isEqual(Effect.getSystemType("int4x4"))) {
				return Mat4;
			}
			else {
				return null;
			}
		}

		static isMatrixType(pType: IAFXTypeInstruction): boolean {
			return pType._isEqual(Effect.getSystemType("float2x2")) ||
				pType._isEqual(Effect.getSystemType("float3x3")) ||
				pType._isEqual(Effect.getSystemType("float4x4")) ||
				pType._isEqual(Effect.getSystemType("int2x2")) ||
				pType._isEqual(Effect.getSystemType("int3x3")) ||
				pType._isEqual(Effect.getSystemType("int4x4")) ||
				pType._isEqual(Effect.getSystemType("bool2x2")) ||
				pType._isEqual(Effect.getSystemType("bool3x3")) ||
				pType._isEqual(Effect.getSystemType("bool4x4"));
		}

		static isVectorType(pType: IAFXTypeInstruction): boolean {
			return pType._isEqual(Effect.getSystemType("float2")) ||
				pType._isEqual(Effect.getSystemType("float3")) ||
				pType._isEqual(Effect.getSystemType("float4")) ||
				pType._isEqual(Effect.getSystemType("bool2")) ||
				pType._isEqual(Effect.getSystemType("bool3")) ||
				pType._isEqual(Effect.getSystemType("bool4")) ||
				pType._isEqual(Effect.getSystemType("int2")) ||
				pType._isEqual(Effect.getSystemType("int3")) ||
				pType._isEqual(Effect.getSystemType("int4"));
		}

		static isScalarType(pType: IAFXTypeInstruction): boolean {
			return pType._isEqual(Effect.getSystemType("bool")) ||
				pType._isEqual(Effect.getSystemType("int")) ||
				pType._isEqual(Effect.getSystemType("ptr")) ||
				pType._isEqual(Effect.getSystemType("float"));
		}

		static isFloatBasedType(pType: IAFXTypeInstruction): boolean {
			return pType._isEqual(Effect.getSystemType("float")) ||
				pType._isEqual(Effect.getSystemType("float2")) ||
				pType._isEqual(Effect.getSystemType("float3")) ||
				pType._isEqual(Effect.getSystemType("float4")) ||
				pType._isEqual(Effect.getSystemType("float2x2")) ||
				pType._isEqual(Effect.getSystemType("float3x3")) ||
				pType._isEqual(Effect.getSystemType("float4x4")) ||
				pType._isEqual(Effect.getSystemType("ptr"));
		}

		static isIntBasedType(pType: IAFXTypeInstruction): boolean {
			return pType._isEqual(Effect.getSystemType("int")) ||
				pType._isEqual(Effect.getSystemType("int2")) ||
				pType._isEqual(Effect.getSystemType("int3")) ||
				pType._isEqual(Effect.getSystemType("int4")) ||
				pType._isEqual(Effect.getSystemType("int2x2")) ||
				pType._isEqual(Effect.getSystemType("int3x3")) ||
				pType._isEqual(Effect.getSystemType("int4x4"));
		}

		static isBoolBasedType(pType: IAFXTypeInstruction): boolean {
			return pType._isEqual(Effect.getSystemType("bool")) ||
				pType._isEqual(Effect.getSystemType("bool2")) ||
				pType._isEqual(Effect.getSystemType("bool3")) ||
				pType._isEqual(Effect.getSystemType("bool4")) ||
				pType._isEqual(Effect.getSystemType("bool2x2")) ||
				pType._isEqual(Effect.getSystemType("bool3x3")) ||
				pType._isEqual(Effect.getSystemType("bool4x4"));
		}

		static isSamplerType(pType: IAFXTypeInstruction): boolean {
			return pType._isEqual(Effect.getSystemType("sampler")) ||
				pType._isEqual(Effect.getSystemType("sampler2D")) ||
				pType._isEqual(Effect.getSystemType("samplerCUBE")) ||
				pType._isEqual(Effect.getSystemType("video_buffer"));
		}

		private generateSuffixLiterals(pLiterals: string[], pOutput: IMap<boolean>, iDepth: uint = 0): void {
			if (iDepth >= pLiterals.length) {
				return;
			}

			if (iDepth === 0) {
				for (var i: uint = 0; i < pLiterals.length; i++) {
					pOutput[pLiterals[i]] = true;
				}

				iDepth = 1;
			}

			var pOutputKeys: string[] = Object.keys(pOutput);

			for (var i: uint = 0; i < pLiterals.length; i++) {
				for (var j: uint = 0; j < pOutputKeys.length; j++) {
					if (pOutputKeys[j].indexOf(pLiterals[i]) !== -1) {
						pOutput[pOutputKeys[j] + pLiterals[i]] = false;
					}
					else {
						pOutput[pOutputKeys[j] + pLiterals[i]] = (pOutput[pOutputKeys[j]] === false) ? false : true;
					}
				}
			}

			iDepth++;

			this.generateSuffixLiterals(pLiterals, pOutput, iDepth);
		}

		private initSystemMacros(): void {
			if (isNull(Effect.pSystemMacros)) {
				this._pSystemMacros = Effect.pSystemMacros = <IAFXSimpleInstructionMap>{};
				this.addSystemMacros();
			}

			this._pSystemMacros = Effect.pSystemMacros;
		}

		private initSystemTypes(): void {
			if (isNull(Effect.pSystemTypes)) {
				this._pSystemTypes = Effect.pSystemTypes = {};
				this.addSystemTypeScalar();
				this.addSystemTypeVector();
				this.addSystemTypeMatrix();

				this.generateBaseVertexOutput();
			}

			this._pSystemTypes = Effect.pSystemTypes;
		}

		private initSystemFunctions(): void {
			if (isNull(Effect.pSystemFunctions)) {
				this._pSystemFunctionsMap = Effect.pSystemFunctions = {};
				this.addSystemFunctions();
			}

			this._pSystemFunctionsMap = Effect.pSystemFunctions;
		}

		private initSystemVariables(): void {
			if (isNull(Effect.pSystemVariables)) {
				this._pSystemVariables = Effect.pSystemVariables = <IAFXVariableDeclMap>{};
				this.addSystemVariables();
			}

			this._pSystemVariables = Effect.pSystemVariables;
		}

		private addSystemMacros(): void {
			this.generateSystemMacros("ExtractMacros",
				"\n#ifdef AKRA_FRAGMENT\n" +
				"//#define texture2D(sampler, ) texture2D\n" +
				"#else\n" +
				"#define texture2D(A, B) texture2DLod(A, B, 0.)\n" +
				"#endif\n" +
				"#ifndef A_VB_COMPONENT3\n" +
				"#define A_VB_COMPONENT4\n" +
				"#endif\n" +
				"#ifdef A_VB_COMPONENT4\n" +
				"#define A_VB_ELEMENT_SIZE 4.\n" +
				"#endif\n" +
				"#ifdef A_VB_COMPONENT3\n" +
				"#define A_VB_ELEMENT_SIZE 3.\n" +
				"#endif\n" +
				"#define A_tex2D(S, H, X, Y) texture2D(S, vec2(H.stepX * X , H.stepY * Y))\n" +
				"#define A_tex2Dv(S, H, V) texture2D(S, V)\n");
		}


		private addSystemVariables(): void {
			this.generateSystemVariable("fragColor", "gl_FragColor", "float4", false, true, true);
			this.generateSystemVariable("fragCoord", "gl_FragCoord", "float4", false, true, true);
			this.generateSystemVariable("frontFacing", "gl_FrontFacing", "bool", false, true, true);
			this.generateSystemVariable("pointCoord", "gl_PointCoord", "float2", false, true, true);
			this.generateSystemVariable("resultAFXColor", "resultAFXColor", "float4", false, true, true);

			//Engine variable for passes
			this.generatePassEngineVariable();
		}

		private generateSystemVariable(sName: string, sRealName: string, sTypeName: string,
			isForVertex: boolean, isForPixel: boolean, isOnlyRead: boolean): void {

			if (isDef(this._pSystemVariables[sName])) {
				return;
			}

			var pVariableDecl: IAFXVariableDeclInstruction = new instructions.VariableDeclInstruction();
			var pName: IAFXIdInstruction = new instructions.IdInstruction();
			var pType: IAFXVariableTypeInstruction = new instructions.VariableTypeInstruction();

			pName._setName(sName);
			pName._setRealName(sRealName);

			pType._pushType(Effect.getSystemType(sTypeName));

			if (isOnlyRead) {
				pType._canWrite(false);
			}

			pVariableDecl._setForVertex(isForVertex);
			pVariableDecl._setForPixel(isForPixel);

			pVariableDecl._push(pType, true);
			pVariableDecl._push(pName, true);

			this._pSystemVariables[sName] = pVariableDecl;

			pVariableDecl._setBuiltIn(true);
		}

		private generatePassEngineVariable(): void {
			var pVariableDecl: IAFXVariableDeclInstruction = new instructions.VariableDeclInstruction();
			var pName: IAFXIdInstruction = new instructions.IdInstruction();
			var pType: IAFXVariableTypeInstruction = new instructions.VariableTypeInstruction();

			pType._canWrite(false);

			pType._markAsUnverifiable(true);
			pName._setName("engine");
			pName._setRealName("engine");

			pVariableDecl._push(pType, true);
			pVariableDecl._push(pName, true);

			this._pSystemVariables["engine"] = pVariableDecl;
		}

		private generateBaseVertexOutput(): void {
			//TODO: fix defenition of this variables

			var pOutBasetype: instructions.ComplexTypeInstruction = new instructions.ComplexTypeInstruction();

			var pPosition: instructions.VariableDeclInstruction = new instructions.VariableDeclInstruction();
			var pPointSize: instructions.VariableDeclInstruction = new instructions.VariableDeclInstruction();
			var pPositionType: instructions.VariableTypeInstruction = new instructions.VariableTypeInstruction();
			var pPointSizeType: instructions.VariableTypeInstruction = new instructions.VariableTypeInstruction();
			var pPositionId: instructions.IdInstruction = new instructions.IdInstruction();
			var pPointSizeId: instructions.IdInstruction = new instructions.IdInstruction();

			pPositionType._pushType(Effect.getSystemType("float4"));
			pPointSizeType._pushType(Effect.getSystemType("float"));

			pPositionId._setName("pos");
			pPositionId._setRealName("POSITION");

			pPointSizeId._setName("psize");
			pPointSizeId._setRealName("PSIZE");

			pPosition._push(pPositionType, true);
			pPosition._push(pPositionId, true);

			pPointSize._push(pPointSizeType, true);
			pPointSize._push(pPointSizeId, true);

			pPosition._setSemantic("POSITION");
			pPointSize._setSemantic("PSIZE");

			var pFieldCollector: IAFXInstruction = new instructions.InstructionCollector();
			pFieldCollector._push(pPosition, false);
			pFieldCollector._push(pPointSize, false);

			pOutBasetype.addFields(pFieldCollector, true);

			pOutBasetype._setName("VS_OUT");
			pOutBasetype.setRealName("VS_OUT_S");

			Effect.pSystemVertexOut = pOutBasetype;
		}

		private addSystemFunctions(): void {
			this._pSystemFunctionHashMap = <IMap<boolean>>{};

			this.generateSystemFunction("dot", "dot($1,$2)", "float", [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
			this.generateSystemFunction("mul", "$1*$2", TEMPLATE_TYPE, [TEMPLATE_TYPE, TEMPLATE_TYPE], ["float", "int", "float2", "float3", "float4"]);
			this.generateSystemFunction("mod", "mod($1,$2)", "float", ["float", "float"], null);
			this.generateSystemFunction("floor", "floor($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
			this.generateSystemFunction("ceil", "ceil($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
			this.generateSystemFunction("fract", "fract($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
			this.generateSystemFunction("abs", "abs($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
			this.generateSystemFunction("sign", "sign($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
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
			// this.generateSystemFunction("smoothstep", "smoothstep($1, $2, $3)", "float3", ["float3", "float3", "float3"], null);
			this.generateSystemFunction("smoothstep", "smoothstep($1, $2, $3)", TEMPLATE_TYPE, [TEMPLATE_TYPE, TEMPLATE_TYPE, TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
			this.generateSystemFunction("smoothstep", "smoothstep($1, $2, $3)", TEMPLATE_TYPE, ["float", "float", TEMPLATE_TYPE], ["float2", "float3", "float4"]);

			this.generateSystemFunction("frac", "fract($1)", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
			this.generateSystemFunction("lerp", "mix($1,$2,$3)", TEMPLATE_TYPE, [TEMPLATE_TYPE, TEMPLATE_TYPE, TEMPLATE_TYPE], ["float", "float2", "float3", "float4"]);
			this.generateSystemFunction("lerp", "mix($1,$2,$3)", TEMPLATE_TYPE, [TEMPLATE_TYPE, TEMPLATE_TYPE, "float"], ["float2", "float3", "float4"]);

			this.generateSystemFunction("saturate", "max(0., min(1., $1))", TEMPLATE_TYPE, [TEMPLATE_TYPE], ["float","float2", "float3", "float4"]);
			
			//Extracts

			this.generateNotBuiltInSystemFuction("extractHeader",
				"void A_extractTextureHeader(sampler2D src, out A_TextureHeader texture)",
				"{vec4 v = texture2D(src, vec2(0.00001)); " +
				"texture = A_TextureHeader(v.r, v.g, v.b, v.a);}",
				"void",
				["video_buffer_header"], null, ["ExtractMacros"]);

			this.generateNotBuiltInSystemFuction("extractFloat",
				"float A_extractFloat(sampler2D sampler, A_TextureHeader header, float offset)",
				"{float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " +
				"float y = floor(pixelNumber / header.width) + .5; " +
				"float x = mod(pixelNumber, header.width) + .5; " +
				"int shift = int(mod(offset, A_VB_ELEMENT_SIZE)); " +
				"\n#ifdef A_VB_COMPONENT4\n" +
				"if(shift == 0) return A_tex2D(sampler, header, x, y).r; " +
				"else if(shift == 1) return A_tex2D(sampler, header, x, y).g; " +
				"else if(shift == 2) return A_tex2D(sampler, header, x, y).b; " +
				"else if(shift == 3) return A_tex2D(sampler, header, x, y).a; " +
				"else return 0.; " + 
				"\n#endif\n" +
				"return 0.;}",
				"float",
				["video_buffer_header"], ["extractHeader"], ["ExtractMacros"]);

			this.generateNotBuiltInSystemFuction("extractFloat2",
				"vec2 A_extractVec2(sampler2D sampler, A_TextureHeader header, float offset)",
				"{float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " +
				"float y = floor(pixelNumber / header.width) + .5; " +
				"float x = mod(pixelNumber, header.width) + .5; " +
				"int shift = int(mod(offset, A_VB_ELEMENT_SIZE)); " +
				"\n#ifdef A_VB_COMPONENT4\n" +
				"if(shift == 0) return A_tex2D(sampler, header, x, y).rg; " +
				"else if(shift == 1) return A_tex2D(sampler, header, x, y).gb; " +
				"else if(shift == 2) return A_tex2D(sampler, header, x, y).ba; " +
				"else if(shift == 3) { " +
				"if(int(x) == int(header.width - 1.)) " +
				"return vec2(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, 0.5, (y + 1.)).r); " +
				"else " +
				"return vec2(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, (x + 1.), y).r); " +
				"} " +
				"else { return vec2(0.); } " +
				"\n#endif\n" +
				"return vec2(0.);}",
				"float2",
				["video_buffer_header"], ["extractHeader"], ["ExtractMacros"]);

			this.generateNotBuiltInSystemFuction("extractFloat3",
				"vec3 A_extractVec3(sampler2D sampler, A_TextureHeader header, float offset)",
				"{float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " +
				"float y = floor(pixelNumber / header.width) + .5; " +
				"float x = mod(pixelNumber, header.width) + .5; " +
				"int shift = int(mod(offset, A_VB_ELEMENT_SIZE)); " +
				"\n#ifdef A_VB_COMPONENT4\n" +
				"if(shift == 0) return A_tex2D(sampler, header, x, y).rgb; " +
				"else if(shift == 1) return A_tex2D(sampler, header, x, y).gba; " +
				"else if(shift == 2){ " +
				"if(int(x) == int(header.width - 1.))  return vec3(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, 0.5, (y + 1.)).r); " +
				"else return vec3(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, (x + 1.), y).r);} " +
				"else if(shift == 3){ " +
				"if(int(x) == int(header.width - 1.))  return vec3(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, 0.5, (y + 1.)).rg); " +
				"else return vec3(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, (x + 1.), y).rg);} " +
				"else { return vec3(0.); } " +
				"\n#endif\n" +
				"\n#ifdef A_VB_COMPONENT3\n" +
				"if(shift == 0) return A_tex2D(sampler, header,vec2(x,header.stepY*y)).rgb; " +
				"else if(shift == 1){ " +
				"if(x == header.width - 1.) return vec3(A_tex2D(sampler, header, x, y).gb, A_tex2D(sampler, header, 0.5, (y + 1.)).r); " +
				"else return vec3(A_tex2D(sampler, header, x, y).gb, A_tex2D(sampler, header, (x + 1.), y).r);} " +
				"else if(shift == 3){ " +
				"if(x == header.width - 1.) return vec3(A_tex2D(sampler, header, x, y).b, A_tex2D(sampler, header, 0.5, (y + 1.)).rg); " +
				"else return vec3(A_tex2D(sampler, header, x, y).b, A_tex2D(sampler, header, (x + 1)., y).rg);} " +
				"else { return vec3(0.); } " +
				"\n#endif\n" +
				"return vec3(0.);}",
				"float3",
				["video_buffer_header"], ["extractHeader"], ["ExtractMacros"]);

			this.generateNotBuiltInSystemFuction("extractFloat4",
				"vec4 A_extractVec4(sampler2D sampler, A_TextureHeader header, float offset)",
				"{float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " +
				"float y = floor(pixelNumber / header.width) + .5; " +
				"float x = mod(pixelNumber, header.width) + .5; " +
				"int shift = int(mod(offset, A_VB_ELEMENT_SIZE)); " +
				"\n#ifdef A_VB_COMPONENT4\n" +
				"if(shift == 0) return A_tex2D(sampler, header, x, y); " +
				"else if(shift == 1){ " +
				"if(int(x) == int(header.width - 1.)) " +
				"return vec4(A_tex2D(sampler, header, x, y).gba, A_tex2D(sampler, header, 0.5, (y + 1.)).r); " +
				"else " +
				"return vec4(A_tex2D(sampler, header, x, y).gba, A_tex2D(sampler, header, (x + 1.), y).r);} " +
				"else if(shift == 2){ " +
				"if(int(x) == int(header.width - 1.)) " +
				"return vec4(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, 0.5, (y + 1.)).rg); " +
				"else " +
				"return vec4(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, (x + 1.), y).rg);} " +
				"else if(shift == 3){ " +
				"if(int(x) == int(header.width - 1.)) " +
				"return vec4(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, 0.5, (y + 1.)).rgb); " +
				"else return vec4(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, (x + 1.), y).rgb);} " +
				"else { return vec4(0.); } " + 
				"\n#endif\n" +
				"\n#ifdef A_VB_COMPONENT3\n" +
				"\n#endif\n" +
				"return vec4(0.);}",
				"float4",
				["video_buffer_header"], ["extractHeader"], ["ExtractMacros"]);

			this.generateNotBuiltInSystemFuction("findPixel",
				"vec2 A_findPixel(A_TextureHeader header, float offset)",
				"{float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " +
				"return vec2(header.stepX * (mod(pixelNumber, header.width) + .5), header.stepY * (floor(pixelNumber / header.width) + .5));}",
				"float2",
				["video_buffer_header"], ["extractHeader"], ["ExtractMacros"]);

			this.generateNotBuiltInSystemFuction("extractFloat4x4",
				"mat4 A_extractMat4(sampler2D sampler, A_TextureHeader header, float offset)",
				"{return mat4(A_tex2Dv(sampler, header, A_findPixel(header, offset))," +
				"A_tex2Dv(sampler, header, A_findPixel(header, offset + 4.))," +
				"A_tex2Dv(sampler, header, A_findPixel(header, offset + 8.))," +
				"A_tex2Dv(sampler, header, A_findPixel(header, offset + 12.)));}",
				"float4x4",
				["video_buffer_header"], ["findPixel"], ["ExtractMacros"]);
		}

		private generateSystemFunction(sName: string, sTranslationExpr: string,
			sReturnTypeName: string,
			pArgumentsTypes: string[],
			pTemplateTypes: string[],
			isForVertex: boolean = true, isForPixel: boolean = true): void {

			var pExprTranslator: ExprTemplateTranslator = new ExprTemplateTranslator(sTranslationExpr);
			var pSystemFunctions: IMap<instructions.SystemFunctionInstruction[]> = this._pSystemFunctionsMap;
			var pTypes: IAFXTypeInstruction[] = null;
			var sFunctionHash: string = "";
			var pReturnType: IAFXTypeInstruction = null;
			var pFunction: instructions.SystemFunctionInstruction = null;

			if (!isNull(pTemplateTypes)) {
				for (var i: uint = 0; i < pTemplateTypes.length; i++) {
					pTypes = [];
					sFunctionHash = sName + "(";
					pReturnType = (sReturnTypeName === TEMPLATE_TYPE) ?
					Effect.getSystemType(pTemplateTypes[i]) :
					Effect.getSystemType(sReturnTypeName);


					for (var j: uint = 0; j < pArgumentsTypes.length; j++) {
						if (pArgumentsTypes[j] === TEMPLATE_TYPE) {
							pTypes.push(Effect.getSystemType(pTemplateTypes[i]));
							sFunctionHash += pTemplateTypes[i] + ",";
						}
						else {
							pTypes.push(Effect.getSystemType(pArgumentsTypes[j]));
							sFunctionHash += pArgumentsTypes[j] + ","
						}
					}

					sFunctionHash += ")";

					if (this._pSystemFunctionHashMap[sFunctionHash]) {
						this._error(EEffectErrors.BAD_SYSTEM_FUNCTION_REDEFINE, { funcName: sFunctionHash });
					}

					pFunction = new instructions.SystemFunctionInstruction(sName, pReturnType, pExprTranslator, pTypes);

					if (!isDef(pSystemFunctions[sName])) {
						pSystemFunctions[sName] = [];
					}

					pFunction._setForVertex(isForVertex);
					pFunction._setForPixel(isForPixel);

					pSystemFunctions[sName].push(pFunction);
					pFunction._setBuiltIn(true);
				}
			}
			else {

				if (sReturnTypeName === TEMPLATE_TYPE) {
					logger.critical("Bad return type(TEMPLATE_TYPE) for system function '" + sName + "'.");
				}

				pReturnType = Effect.getSystemType(sReturnTypeName);
				pTypes = [];
				sFunctionHash = sName + "(";

				for (var i: uint = 0; i < pArgumentsTypes.length; i++) {
					if (pArgumentsTypes[i] === TEMPLATE_TYPE) {
						logger.critical("Bad argument type(TEMPLATE_TYPE) for system function '" + sName + "'.");
					}
					else {
						pTypes.push(Effect.getSystemType(pArgumentsTypes[i]));
						sFunctionHash += pArgumentsTypes[i] + ",";
					}
				}

				sFunctionHash += ")";

				if (this._pSystemFunctionHashMap[sFunctionHash]) {
					this._error(EEffectErrors.BAD_SYSTEM_FUNCTION_REDEFINE, { funcName: sFunctionHash });
				}

				pFunction = new instructions.SystemFunctionInstruction(sName, pReturnType, pExprTranslator, pTypes);

				pFunction._setForVertex(isForVertex);
				pFunction._setForPixel(isForPixel);

				if (!isDef(pSystemFunctions[sName])) {
					pSystemFunctions[sName] = [];
				}

				pSystemFunctions[sName].push(pFunction);
				pFunction._setBuiltIn(true);
			}

		}

		private generateSystemMacros(sMacrosName: string, sMacrosCode: string): void {
			if (isDef(this._pSystemMacros[sMacrosName])) {
				return;
			}

			var pMacros: IAFXSimpleInstruction = new instructions.SimpleInstruction(sMacrosCode);

			this._pSystemMacros[sMacrosName] = pMacros;
		}

		private generateNotBuiltInSystemFuction(sName: string, sDefenition: string, sImplementation: string,
			sReturnType: string,
			pUsedTypes: string[],
			pUsedFunctions: string[],
			pUsedMacros: string[]): void {

			if (isDef(this._pSystemFunctionsMap[sName])) {
				return;
			}

			var pReturnType: IAFXTypeInstruction = Effect.getSystemType(sReturnType);
			var pFunction: instructions.SystemFunctionInstruction = new instructions.SystemFunctionInstruction(sName, pReturnType, null, null);

			pFunction.setDeclCode(sDefenition, sImplementation);

			var pUsedExtSystemTypes: IAFXTypeDeclInstruction[] = [];
			var pUsedExtSystemFunctions: IAFXFunctionDeclInstruction[] = [];
			var pUsedExtSystemMacros: IAFXSimpleInstruction[] = [];

			if (!isNull(pUsedTypes)) {
				for (var i: uint = 0; i < pUsedTypes.length; i++) {
					var pTypeDecl: IAFXTypeDeclInstruction = <IAFXTypeDeclInstruction>Effect.getSystemType(pUsedTypes[i])._getParent();
					if (!isNull(pTypeDecl)) {
						pUsedExtSystemTypes.push(pTypeDecl);
					}
				}
			}

			if (!isNull(pUsedMacros)) {
				for (var i: uint = 0; i < pUsedMacros.length; i++) {
					pUsedExtSystemMacros.push(Effect.getSystemMacros(pUsedMacros[i]));
				}
			}

			if (!isNull(pUsedFunctions)) {
				for (var i: uint = 0; i < pUsedFunctions.length; i++) {
					var pFindFunction: IAFXFunctionDeclInstruction = Effect.findSystemFunction(pUsedFunctions[i], null);
					pUsedExtSystemFunctions.push(pFindFunction);
				}
			}

			pFunction.setUsedSystemData(pUsedExtSystemTypes, pUsedExtSystemFunctions, pUsedExtSystemMacros);
			pFunction.closeSystemDataInfo();
			pFunction._setBuiltIn(false);

			this._pSystemFunctionsMap[sName] = [pFunction];
		}

		private generateSystemType(sName: string, sRealName: string,
			iSize: uint = 1, isArray: boolean = false,
			pElementType: IAFXTypeInstruction = null, iLength: uint = 1
			): IAFXTypeInstruction {

			if (isDef(this._pSystemTypes[sName])) {
				return null;
			}

			var pSystemType: instructions.SystemTypeInstruction = new instructions.SystemTypeInstruction();

			pSystemType._setName(sName);
			pSystemType.setRealName(sRealName);
			pSystemType.setSize(iSize);
			if (isArray) {
				pSystemType.addIndex(pElementType, iLength);
			}

			this._pSystemTypes[sName] = pSystemType;
			pSystemType._setBuiltIn(true);

			return pSystemType;
		}

		private generateNotBuildtInSystemType(sName: string, sRealName: string, sDeclString: string,
			iSize: uint = 1, isArray: boolean = false,
			pElementType: IAFXTypeInstruction = null, iLength: uint = 1
			): IAFXTypeInstruction {

			if (isDef(this._pSystemTypes[sName])) {
				return null;
			}

			var pSystemType: instructions.SystemTypeInstruction = new instructions.SystemTypeInstruction();
			pSystemType._setName(sName);
			pSystemType.setRealName(sRealName);
			pSystemType.setSize(iSize);
			pSystemType.setDeclString(sDeclString);

			if (isArray) {
				pSystemType.addIndex(pElementType, iLength);
			}

			this._pSystemTypes[sName] = pSystemType;
			pSystemType._setBuiltIn(false);

			var pSystemTypeDecl: IAFXTypeDeclInstruction = new instructions.TypeDeclInstruction();
			pSystemTypeDecl._push(pSystemType, true);
			pSystemTypeDecl._setBuiltIn(false);

			return pSystemType;
		}

		private addSystemTypeScalar(): void {
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


			this.generateNotBuildtInSystemType("video_buffer_header", "A_TextureHeader",
				"struct A_TextureHeader { float width; float height; float stepX; float stepY; }");
		}

		private addSystemTypeVector(): void {
			var pXYSuffix: IMap<boolean> = <IMap<boolean>>{};
			var pXYZSuffix: IMap<boolean> = <IMap<boolean>>{};
			var pXYZWSuffix: IMap<boolean> = <IMap<boolean>>{};

			var pRGSuffix: IMap<boolean> = <IMap<boolean>>{};
			var pRGBSuffix: IMap<boolean> = <IMap<boolean>>{};
			var pRGBASuffix: IMap<boolean> = <IMap<boolean>>{};

			var pSTSuffix: IMap<boolean> = <IMap<boolean>>{};
			var pSTPSuffix: IMap<boolean> = <IMap<boolean>>{};
			var pSTPQSuffix: IMap<boolean> = <IMap<boolean>>{};

			this.generateSuffixLiterals(["x", "y"], pXYSuffix);
			this.generateSuffixLiterals(["x", "y", "z"], pXYZSuffix);
			this.generateSuffixLiterals(["x", "y", "z", "w"], pXYZWSuffix);

			this.generateSuffixLiterals(["r", "g"], pRGSuffix);
			this.generateSuffixLiterals(["r", "g", "b"], pRGBSuffix);
			this.generateSuffixLiterals(["r", "g", "b", "a"], pRGBASuffix);

			this.generateSuffixLiterals(["s", "t"], pSTSuffix);
			this.generateSuffixLiterals(["s", "t", "p"], pSTPSuffix);
			this.generateSuffixLiterals(["s", "t", "p", "q"], pSTPQSuffix);

			var pFloat: IAFXTypeInstruction = Effect.getSystemType("float");
			var pInt: IAFXTypeInstruction = Effect.getSystemType("int");
			var pBool: IAFXTypeInstruction = Effect.getSystemType("bool");

			var pFloat2: IAFXTypeInstruction = this.generateSystemType("float2", "vec2", 0, true, pFloat, 2);
			var pFloat3: IAFXTypeInstruction = this.generateSystemType("float3", "vec3", 0, true, pFloat, 3);
			var pFloat4: IAFXTypeInstruction = this.generateSystemType("float4", "vec4", 0, true, pFloat, 4);

			var pInt2: IAFXTypeInstruction = this.generateSystemType("int2", "ivec2", 0, true, pInt, 2);
			var pInt3: IAFXTypeInstruction = this.generateSystemType("int3", "ivec3", 0, true, pInt, 3);
			var pInt4: IAFXTypeInstruction = this.generateSystemType("int4", "ivec4", 0, true, pInt, 4);

			var pBool2: IAFXTypeInstruction = this.generateSystemType("bool2", "bvec2", 0, true, pBool, 2);
			var pBool3: IAFXTypeInstruction = this.generateSystemType("bool3", "bvec3", 0, true, pBool, 3);
			var pBool4: IAFXTypeInstruction = this.generateSystemType("bool4", "bvec4", 0, true, pBool, 4);

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
		}

		private addSystemTypeMatrix(): void {
			var pFloat2: IAFXTypeInstruction = Effect.getSystemType("float2");
			var pFloat3: IAFXTypeInstruction = Effect.getSystemType("float3");
			var pFloat4: IAFXTypeInstruction = Effect.getSystemType("float4");

			var pInt2: IAFXTypeInstruction = Effect.getSystemType("int2");
			var pInt3: IAFXTypeInstruction = Effect.getSystemType("int3");
			var pInt4: IAFXTypeInstruction = Effect.getSystemType("int4");

			var pBool2: IAFXTypeInstruction = Effect.getSystemType("bool2");
			var pBool3: IAFXTypeInstruction = Effect.getSystemType("bool3");
			var pBool4: IAFXTypeInstruction = Effect.getSystemType("bool4");

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
		}

		private addFieldsToVectorFromSuffixObject(pSuffixMap: IMap<boolean>, pType: IAFXTypeInstruction, sBaseType: string) {
			var sSuffix: string = null;

			for (sSuffix in pSuffixMap) {
				var sFieldTypeName: string = sBaseType + ((sSuffix.length > 1) ? sSuffix.length.toString() : "");
				var pFieldType: IAFXTypeInstruction = Effect.getSystemType(sFieldTypeName);

				(<instructions.SystemTypeInstruction>pType).addField(sSuffix, pFieldType, pSuffixMap[sSuffix]);
			}
		}

		private getVariable(sName: string): IAFXVariableDeclInstruction {
			return Effect.getSystemVariable(sName) || this._pEffectScope._getVariable(sName);
		}

		private hasVariable(sName: string): boolean {
			return this._pEffectScope._hasVariable(sName);
		}

		private getType(sTypeName: string): IAFXTypeInstruction {
			return Effect.getSystemType(sTypeName) || this._pEffectScope._getType(sTypeName);
		}

		private isSystemFunction(pFunction: IAFXFunctionDeclInstruction): boolean {
			return false;
		}

		private isSystemVariable(pVariable: IAFXVariableDeclInstruction): boolean {
			return false;
		}

		private isSystemType(pType: IAFXTypeDeclInstruction): boolean {
			return false;
		}

		private _errorFromInstruction(pError: IAFXInstructionError): void {
			this._error(pError.code, isNull(pError.info) ? {} : pError.info);
		}

		private _error(eCode: uint, pInfo: IEffectErrorInfo = {}): void {
			var sFileName: string = this._sAnalyzedFileName;

			var pLocation: ISourceLocation = <ISourceLocation>{ file: this._sAnalyzedFileName, line: 0 };
			var pLineColumn: { line: uint; column: uint; } = this.getNodeSourceLocation(this.getAnalyzedNode());

			switch (eCode) {
				default:
					pInfo.line = pLineColumn.line + 1;
					pInfo.column = pLineColumn.column + 1;

					pLocation.line = pLineColumn.line + 1;

					break;
			}

			var pLogEntity: ILoggerEntity = <ILoggerEntity>{
				code: eCode,
				info: pInfo,
				location: pLocation
			};

			logger.critical(pLogEntity);
			//throw new Error(eCode.toString());
		}

		private setAnalyzedNode(pNode: parser.IParseNode): void {
			// if(this._pAnalyzedNode !== pNode){
			// 	// debug_print("Analyze node: ", pNode); 
			// 	//.name + (pNode.value ?  " --> value: " + pNode.value + "." : "."));
			// }
			this._pAnalyzedNode = pNode;
		}

		private getAnalyzedNode(): parser.IParseNode {
			return this._pAnalyzedNode;
		}

		private isStrictMode(): boolean {
			return this._pEffectScope._isStrictMode();
		}

		private setStrictModeOn(): void {
			return this._pEffectScope._setStrictModeOn();
		}

		private newScope(eScopeType: EScopeType = EScopeType.k_Default): void {
			this._pEffectScope._newScope(eScopeType);
		}

		private resumeScope(): void {
			this._pEffectScope._resumeScope();
		}

		private getScope(): uint {
			return this._pEffectScope._getScope();
		}

		private setScope(iScope: uint): void {
			this._pEffectScope._setScope(iScope);
		}

		private endScope(): void {
			this._pEffectScope._endScope();
		}

		private getScopeType(): EScopeType {
			return this._pEffectScope._getScopeType();
		}

		private setCurrentAnalyzedFunction(pFunction: IAFXFunctionDeclInstruction): void {
			this._pCurrentFunction = pFunction;
			this._bHaveCurrentFunctionReturnOccur = false;
		}

		private setCurrentAnalyzedPass(pPass: IAFXPassInstruction): void {
			this._pCurrentPass = pPass;
		}

		private getCurrentAnalyzedFunction(): IAFXFunctionDeclInstruction {
			return this._pCurrentFunction;
		}

		private getCurrentAnalyzedPass(): IAFXPassInstruction {
			return this._pCurrentPass;
		}

		private isAnalzeInPass(): boolean {
			return this._isAnalyzeInPass;
		}

		private setAnalyzeInPass(isInPass: boolean): void {
			this._isAnalyzeInPass = isInPass;
		}

		private setOperator(sOperator: string): void {
			if (!isNull(this._pCurrentInstruction)) {
				this._pCurrentInstruction._setOperator(sOperator);
			}
		}

		private clearPointersForExtract(): void {
			this._pPointerForExtractionList.length = 0;
		}

		private addPointerForExtract(pPointer: IAFXVariableDeclInstruction): void {
			this._pPointerForExtractionList.push(pPointer);
		}

		private getPointerForExtractList(): IAFXVariableDeclInstruction[] {
			return this._pPointerForExtractionList;
		}

		private findFunction(sFunctionName: string,
			pArguments: IAFXExprInstruction[]): IAFXFunctionDeclInstruction;
		private findFunction(sFunctionName: string,
			pArguments: IAFXVariableDeclInstruction[]): IAFXFunctionDeclInstruction;
		private findFunction(sFunctionName: string,
			pArguments: IAFXTypedInstruction[]): IAFXFunctionDeclInstruction {
			return Effect.findSystemFunction(sFunctionName, pArguments) ||
				this._pEffectScope._getFunction(sFunctionName, pArguments);
		}

		private findConstructor(pType: IAFXTypeInstruction,
			pArguments: IAFXExprInstruction[]): IAFXVariableTypeInstruction {

			var pVariableType: IAFXVariableTypeInstruction = new instructions.VariableTypeInstruction();
			pVariableType._pushType(pType);

			return pVariableType;
		}

		private findShaderFunction(sFunctionName: string,
			pArguments: IAFXExprInstruction[]): IAFXFunctionDeclInstruction {
			return this._pEffectScope._getShaderFunction(sFunctionName, pArguments);
		}

		private findFunctionByDef(pDef: instructions.FunctionDefInstruction): IAFXFunctionDeclInstruction {
			return this.findFunction(pDef._getName(), pDef.getArguments());
		}

		// private addVariable(pVariable: IAFXVariable): void {
		// }

		private addVariableDecl(pVariable: IAFXVariableDeclInstruction): void {
			if (this.isSystemVariable(pVariable)) {
				this._error(EEffectErrors.REDEFINE_SYSTEM_VARIABLE, { varName: pVariable._getName() });
			}

			var isVarAdded: boolean = this._pEffectScope._addVariable(pVariable);

			if (!isVarAdded) {
				var eScopeType: EScopeType = this.getScopeType();

				switch (eScopeType) {
					case EScopeType.k_Default:
						this._error(EEffectErrors.REDEFINE_VARIABLE, { varName: pVariable._getName() });
						break;
					case EScopeType.k_Struct:
						this._error(EEffectErrors.BAD_NEW_FIELD_FOR_STRUCT_NAME, { fieldName: pVariable._getName() });
						break;
					case EScopeType.k_Annotation:
						this._error(EEffectErrors.BAD_NEW_ANNOTATION_VAR, { varName: pVariable._getName() });
						break;
				}
			}

			if (pVariable._getName() === "Out" && !isNull(this.getCurrentAnalyzedFunction())) {
				var isOk: boolean = this.getCurrentAnalyzedFunction()._addOutVariable(pVariable);
				if (!isOk) {
					this._error(EEffectErrors.BAD_OUT_VARIABLE_IN_FUNCTION);
				}
			}
		}

		private addTypeDecl(pType: IAFXTypeDeclInstruction): void {
			if (this.isSystemType(pType)) {
				this._error(EEffectErrors.REDEFINE_SYSTEM_TYPE, { typeName: pType._getName() });
			}

			var isTypeAdded: boolean = this._pEffectScope._addType(pType);

			if (!isTypeAdded) {
				this._error(EEffectErrors.REDEFINE_TYPE, { typeName: pType._getName() });
			}
		}

		private addFunctionDecl(pFunction: IAFXFunctionDeclInstruction): void {
			if (this.isSystemFunction(pFunction)) {
				this._error(EEffectErrors.REDEFINE_SYSTEM_FUNCTION, { funcName: pFunction._getName() });
			}

			var isFunctionAdded: boolean = this._pEffectScope._addFunction(pFunction);

			if (!isFunctionAdded) {
				this._error(EEffectErrors.REDEFINE_FUNCTION, { funcName: pFunction._getName() });
			}
		}

		private addTechnique(pTechnique: IAFXTechniqueInstruction): void {
			var sName: string = pTechnique._getName();

			if (isDef(this._pTechniqueMap[sName])) {
				this._error(EEffectErrors.BAD_TECHNIQUE_REDEFINE_NAME, { techName: sName });
				return;
			}

			this._pTechniqueMap[sName] = pTechnique;
			this._pTechniqueList.push(pTechnique);
		}

		private addExternalSharedVariable(pVariable: IAFXVariableDeclInstruction, eShaderType: EFunctionType): void {
			var isVarAdded: boolean = this._pEffectScope._addVariable(pVariable);

			if (!isVarAdded) {
				this._error(EEffectErrors.CANNOT_ADD_SHARED_VARIABLE, { varName: pVariable._getName() });
				return;
			}
		}


		private analyzeGlobalUseDecls(): void {
			var pChildren: parser.IParseNode[] = this._pParseTree.getRoot().children;
			var i: uint = 0;

			for (i = pChildren.length - 1; i >= 0; i--) {
				if (pChildren[i].name === "UseDecl") {
					this.analyzeUseDecl(pChildren[i]);
				}
			}
		}

		private analyzeGlobalProvideDecls(): void {
			var pChildren: parser.IParseNode[] = this._pParseTree.getRoot().children;
			var i: uint = 0;

			for (i = pChildren.length - 1; i >= 0; i--) {
				if (pChildren[i].name === "ProvideDecl") {
					this.analyzeProvideDecl(pChildren[i]);
				}
			}
		}

		private analyzeGlobalTypeDecls(): void {
			var pChildren: parser.IParseNode[] = this._pParseTree.getRoot().children;
			var i: uint = 0;

			for (i = pChildren.length - 1; i >= 0; i--) {
				if (pChildren[i].name === "TypeDecl") {
					this.analyzeTypeDecl(pChildren[i]);
				}
			}
		}

		private analyzeFunctionDefinitions(): void {
			var pChildren: parser.IParseNode[] = this._pParseTree.getRoot().children;
			var i: uint = 0;

			for (i = pChildren.length - 1; i >= 0; i--) {
				if (pChildren[i].name === "FunctionDecl") {
					this.analyzeFunctionDeclOnlyDefinition(pChildren[i]);
				}
			}
		}

		private analyzeGlobalImports(): void {
			var pChildren: parser.IParseNode[] = this._pParseTree.getRoot().children;
			var i: uint = 0;

			for (i = pChildren.length - 1; i >= 0; i--) {
				if (pChildren[i].name === "ImportDecl") {
					this.analyzeImportDecl(pChildren[i], null);
				}
			}
		}

		private analyzeTechniqueImports(): void {
			var pChildren: parser.IParseNode[] = this._pParseTree.getRoot().children;
			var i: uint = 0;

			for (i = pChildren.length - 1; i >= 0; i--) {
				if (pChildren[i].name === "TechniqueDecl") {
					this.analyzeTechniqueForImport(pChildren[i]);
				}
			}
		}

		private analyzeVariableDecls(): void {
			var pChildren: parser.IParseNode[] = this._pParseTree.getRoot().children;
			var i: uint = 0;

			for (i = pChildren.length - 1; i >= 0; i--) {
				if (pChildren[i].name === "VariableDecl") {
					this.analyzeVariableDecl(pChildren[i]);
				}
				else if (pChildren[i].name === "VarStructDecl") {
					this.analyzeVarStructDecl(pChildren[i]);
				}
			}
		}

		private analyzeFunctionDecls(): void {
			for (var i: uint = 0; i < this._pFunctionWithImplementationList.length; i++) {
				this.resumeFunctionAnalysis(this._pFunctionWithImplementationList[i]);
			}

			this.checkFunctionsForRecursion();
			this.checkFunctionForCorrectUsage();
			this.generateInfoAboutUsedData();
			this.generateShadersFromFunctions();
		}

		private analyzeTechniques(): void {
			for (var i: uint = 0; i < this._pTechniqueList.length; i++) {
				this.resumeTechniqueAnalysis(this._pTechniqueList[i]);
			}
		}

		private checkFunctionsForRecursion(): void {
			var pFunctionList: IAFXFunctionDeclInstruction[] = this._pFunctionWithImplementationList;
			var isNewAdd: boolean = true;
			var isNewDelete: boolean = true;

			while (isNewAdd || isNewDelete) {
				isNewAdd = false;
				isNewDelete = false;

				mainFor:
				for (var i: uint = 0; i < pFunctionList.length; i++) {
					var pTestedFunction: IAFXFunctionDeclInstruction = pFunctionList[i];
					var pUsedFunctionList: IAFXFunctionDeclInstruction[] = pTestedFunction._getUsedFunctionList();

					if (!pTestedFunction._isUsed()) {
						//logger.warn("Unused function '" + pTestedFunction._getStringDef() + "'.");
						continue mainFor;
					}
					if (pTestedFunction._isBlackListFunction()) {
						continue mainFor;
					}

					if (isNull(pUsedFunctionList)) {
						continue mainFor;
					}

					for (var j: uint = 0; j < pUsedFunctionList.length; j++) {
						var pAddedUsedFunctionList: IAFXFunctionDeclInstruction[] = pUsedFunctionList[j]._getUsedFunctionList();

						if (isNull(pAddedUsedFunctionList)) {
							continue;
						}

						for (var k: uint = 0; k < pAddedUsedFunctionList.length; k++) {
							var pAddedFunction: IAFXFunctionDeclInstruction = pAddedUsedFunctionList[k];

							if (pTestedFunction === pAddedFunction) {
								pTestedFunction._addToBlackList();
								isNewDelete = true;
								this._error(EEffectErrors.BAD_FUNCTION_USAGE_RECURSION, { funcDef: pTestedFunction._getStringDef() });
								continue mainFor;
							}

							if (pAddedFunction._isBlackListFunction() ||
								!pAddedFunction._canUsedAsFunction()) {
								pTestedFunction._addToBlackList();
								this._error(EEffectErrors.BAD_FUNCTION_USAGE_BLACKLIST, { funcDef: pTestedFunction._getStringDef() });
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
		}

		private checkFunctionForCorrectUsage(): void {
			var pFunctionList: IAFXFunctionDeclInstruction[] = this._pFunctionWithImplementationList;
			var isNewUsageSet: boolean = true;
			var isNewDelete: boolean = true;

			while (isNewUsageSet || isNewDelete) {
				isNewUsageSet = false;
				isNewDelete = false;

				mainFor:
				for (var i: uint = 0; i < pFunctionList.length; i++) {
					var pTestedFunction: IAFXFunctionDeclInstruction = pFunctionList[i];
					var pUsedFunctionList: IAFXFunctionDeclInstruction[] = pTestedFunction._getUsedFunctionList();

					if (!pTestedFunction._isUsed()) {
						//logger.warn("Unused function '" + pTestedFunction._getStringDef() + "'.");
						continue mainFor;
					}
					if (pTestedFunction._isBlackListFunction()) {
						continue mainFor;
					}

					if (!pTestedFunction._checkVertexUsage()) {
						this._error(EEffectErrors.BAD_FUNCTION_USAGE_VERTEX, { funcDef: pTestedFunction._getStringDef() });
						pTestedFunction._addToBlackList();
						isNewDelete = true;
						continue mainFor;
					}

					if (!pTestedFunction._checkPixelUsage()) {
						this._error(EEffectErrors.BAD_FUNCTION_USAGE_PIXEL, { funcDef: pTestedFunction._getStringDef() });
						pTestedFunction._addToBlackList();
						isNewDelete = true;
						continue mainFor;
					}

					if (isNull(pUsedFunctionList)) {
						continue mainFor;
					}

					for (var j: uint = 0; j < pUsedFunctionList.length; j++) {
						var pUsedFunction: IAFXFunctionDeclInstruction = pUsedFunctionList[j];

						if (pTestedFunction._isUsedInVertex()) {
							if (!pUsedFunction._isForVertex()) {
								this._error(EEffectErrors.BAD_FUNCTION_USAGE_VERTEX, { funcDef: pTestedFunction._getStringDef() });
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
								this._error(EEffectErrors.BAD_FUNCTION_USAGE_PIXEL, { funcDef: pTestedFunction._getStringDef() });
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
		}

		private generateInfoAboutUsedData(): void {
			var pFunctionList: IAFXFunctionDeclInstruction[] = this._pFunctionWithImplementationList;

			for (var i: uint = 0; i < pFunctionList.length; i++) {
				pFunctionList[i]._generateInfoAboutUsedData();
			}
		}

		private generateShadersFromFunctions(): void {
			var pFunctionList: IAFXFunctionDeclInstruction[] = this._pFunctionWithImplementationList;

			for (var i: uint = 0; i < pFunctionList.length; i++) {
				var pShader: IAFXFunctionDeclInstruction = null;

				if (pFunctionList[i]._isUsedAsVertex()) {
					pShader = pFunctionList[i]._convertToVertexShader();
				}
				if (pFunctionList[i]._isUsedAsPixel()) {
					pShader = pFunctionList[i]._convertToPixelShader();
				}

				if (pFunctionList[i]._isErrorOccured()) {
					this._errorFromInstruction(pFunctionList[i]._getLastError());
					pFunctionList[i]._clearError();
				}
			}
		}

		private analyzeVariableDecl(pNode: parser.IParseNode, pInstruction: IAFXInstruction = null): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pGeneralType: IAFXVariableTypeInstruction = null;
			var pVariable: IAFXVariableDeclInstruction = null;
			var i: uint = 0;

			pGeneralType = this.analyzeUsageType(pChildren[pChildren.length - 1]);

			for (i = pChildren.length - 2; i >= 1; i--) {
				if (pChildren[i].name === "Variable") {
					pVariable = this.analyzeVariable(pChildren[i], pGeneralType);

					if (!isNull(pInstruction)) {
						pInstruction._push(pVariable, true);
						if (pInstruction._getInstructionType() === EAFXInstructionTypes.k_DeclStmtInstruction) {
							var pVariableSubDecls: IAFXVariableDeclInstruction[] = pVariable._getSubVarDecls();
							if (!isNull(pVariableSubDecls)) {
								for (var j: uint = 0; j < pVariableSubDecls.length; j++) {
									pInstruction._push(pVariableSubDecls[j], false);
								}
							}
						}
					}
				}
			}
		}

		private analyzeUsageType(pNode: parser.IParseNode): IAFXVariableTypeInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var i: uint = 0;
			var pType: IAFXVariableTypeInstruction = new instructions.VariableTypeInstruction();

			for (i = pChildren.length - 1; i >= 0; i--) {
				if (pChildren[i].name === "Type") {
					var pMainType: IAFXTypeInstruction = this.analyzeType(pChildren[i]);
					pType._pushType(pMainType);
				}
				else if (pChildren[i].name === "Usage") {
					var sUsage: string = this.analyzeUsage(pChildren[i]);
					pType._addUsage(sUsage);
				}
			}

			this.checkInstruction(pType, ECheckStage.CODE_TARGET_SUPPORT);

			return pType;
		}

		private analyzeType(pNode: parser.IParseNode): IAFXTypeInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pType: IAFXTypeInstruction = null;

			switch (pNode.name) {
				case "T_TYPE_ID":
					pType = this.getType(pNode.value);

					if (isNull(pType)) {
						this._error(EEffectErrors.BAD_TYPE_NAME_NOT_TYPE, { typeName: pNode.value });
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

					if (isNull(pType)) {
						this._error(EEffectErrors.BAD_TYPE_NAME_NOT_TYPE, { typeName: pChildren[pChildren.length - 1].value });
					}

					break;

				case "VectorType":
				case "MatrixType":
					this._error(EEffectErrors.BAD_TYPE_VECTOR_MATRIX);
					break;

				case "BaseType":
				case "Type":
					return this.analyzeType(pChildren[0]);
			}

			return pType;
		}

		private analyzeUsage(pNode: parser.IParseNode): string {
			this.setAnalyzedNode(pNode);

			pNode = pNode.children[0];
			return pNode.value;
		}

		private analyzeVariable(pNode: parser.IParseNode, pGeneralType: IAFXVariableTypeInstruction): IAFXVariableDeclInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			var pVarDecl: IAFXVariableDeclInstruction = new instructions.VariableDeclInstruction();
			var pVariableType: IAFXVariableTypeInstruction = new instructions.VariableTypeInstruction();
			var pAnnotation: IAFXAnnotationInstruction = null;
			var sSemantic: string = "";
			var pInitExpr: IAFXInitExprInstruction = null;

			pVarDecl._push(pVariableType, true);
			pVariableType._pushType(pGeneralType);
			pVarDecl._setScope(this.getScope());

			this.analyzeVariableDim(pChildren[pChildren.length - 1], pVarDecl);

			var i: uint = 0;
			for (i = pChildren.length - 2; i >= 0; i--) {
				if (pChildren[i].name === "Annotation") {
					pAnnotation = this.analyzeAnnotation(pChildren[i]);
					pVarDecl._setAnnotation(pAnnotation);
				}
				else if (pChildren[i].name === "Semantic") {
					sSemantic = this.analyzeSemantic(pChildren[i]);
					pVarDecl._setSemantic(sSemantic);
					pVarDecl._getNameId()._setRealName(sSemantic);
				}
				else if (pChildren[i].name === "Initializer") {
					pInitExpr = this.analyzeInitializer(pChildren[i]);
					if (!pInitExpr._optimizeForVariableType(pVariableType)) {
						this._error(EEffectErrors.BAD_VARIABLE_INITIALIZER, { varName: pVarDecl._getName() });
						return null;
					}
					pVarDecl._push(pInitExpr, true);
				}
			}

			this.checkInstruction(pVarDecl, ECheckStage.CODE_TARGET_SUPPORT);

			this.addVariableDecl(pVarDecl);
			pVarDecl._getNameIndex();

			return pVarDecl;
		}

		private analyzeVariableDim(pNode: parser.IParseNode, pVariableDecl: IAFXVariableDeclInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pVariableType: IAFXVariableTypeInstruction = <IAFXVariableTypeInstruction>pVariableDecl._getType();

			if (pChildren.length === 1) {
				var pName: IAFXIdInstruction = new instructions.IdInstruction();
				pName._setName(pChildren[0].value);
				pVariableDecl._push(pName, true);
				return;
			}

			this.analyzeVariableDim(pChildren[pChildren.length - 1], pVariableDecl);

			if (pChildren.length === 3) {
				pVariableType._addPointIndex(true);
			}
			else if (pChildren.length === 4 && pChildren[0].name === "FromExpr") {

				var pBuffer: IAFXVariableDeclInstruction = this.analyzeFromExpr(pChildren[0]);
				pVariableType._addPointIndex(true);
				pVariableType._setVideoBuffer(pBuffer);
			}
			else {
				if (pVariableType._isPointer()) {
					//TODO: add support for v[][10]
					this._error(EEffectTempErrors.BAD_ARRAY_OF_POINTERS);
				}

				var pIndexExpr: IAFXExprInstruction = this.analyzeExpr(pChildren[pChildren.length - 3]);
				pVariableType._addArrayIndex(pIndexExpr);
			}
		}

		private analyzeAnnotation(pNode: parser.IParseNode): IAFXAnnotationInstruction {
			this.setAnalyzedNode(pNode);

			return null;
		}

		private analyzeSemantic(pNode: parser.IParseNode): string {
			this.setAnalyzedNode(pNode);

			var sSemantic: string = pNode.children[0].value;
			// var pDecl: IAFXDeclInstruction = <IAFXDeclInstruction>this._pCurrentInstruction;
			// pDecl._setSemantic(sSemantic);	
			return sSemantic;
		}

		private analyzeInitializer(pNode: parser.IParseNode): IAFXInitExprInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pInitExpr: IAFXInitExprInstruction = new instructions.InitExprInstruction();

			if (pChildren.length === 2) {
				pInitExpr._push(this.analyzeExpr(pChildren[0]), true);
			}
			else {
				for (var i: uint = pChildren.length - 3; i >= 1; i--) {
					if (pChildren[i].name === "InitExpr") {
						pInitExpr._push(this.analyzeInitExpr(pChildren[i]), true);
					}
				}
			}

			return pInitExpr;
		}

		private analyzeFromExpr(pNode: parser.IParseNode): IAFXVariableDeclInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pBuffer: IAFXVariableDeclInstruction = null;

			if (pChildren[1].name === "T_NON_TYPE_ID") {
				pBuffer = this.getVariable(pChildren[1].value);
			}
			else {
				pBuffer = (<instructions.MemExprInstruction>this.analyzeMemExpr(pChildren[1])).getBuffer();
			}

			return pBuffer;
		}

		private analyzeInitExpr(pNode: parser.IParseNode): IAFXInitExprInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pInitExpr: IAFXInitExprInstruction = new instructions.InitExprInstruction();

			if (pChildren.length === 1) {
				pInitExpr._push(this.analyzeExpr(pChildren[0]), true);
			}
			else {
				for (var i: uint = 0; i < pChildren.length; i++) {
					if (pChildren[i].name === "InitExpr") {
						pInitExpr._push(this.analyzeInitExpr(pChildren[i]), true);
					}
				}
			}

			return pInitExpr;
		}

		private analyzeExpr(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);
			var sName: string = pNode.name;

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
					this._error(EEffectErrors.UNSUPPORTED_EXPR, { exprName: sName });
					break;
			}

			return null;
		}

		private analyzeObjectExpr(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);

			var sName: string = pNode.children[pNode.children.length - 1].name;

			switch (sName) {
				case "T_KW_COMPILE":
					return this.analyzeCompileExpr(pNode);
				case "T_KW_SAMPLER_STATE":
					return this.analyzeSamplerStateBlock(pNode);
			}
		}

		private analyzeCompileExpr(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pExpr: instructions.CompileExprInstruction = new instructions.CompileExprInstruction();
			var pExprType: IAFXVariableTypeInstruction;
			var pArguments: IAFXExprInstruction[] = null;
			var sShaderFuncName: string = pChildren[pChildren.length - 2].value;
			var pShaderFunc: IAFXFunctionDeclInstruction = null;
			var i: uint = 0;

			pArguments = [];

			if (pChildren.length > 4) {
				var pArgumentExpr: IAFXExprInstruction;

				for (i = pChildren.length - 3; i > 0; i--) {
					if (pChildren[i].value !== ",") {
						pArgumentExpr = this.analyzeExpr(pChildren[i]);
						pArguments.push(pArgumentExpr);
					}
				}
			}

			pShaderFunc = this.findShaderFunction(sShaderFuncName, pArguments);

			if (isNull(pShaderFunc)) {
				this._error(EEffectErrors.BAD_COMPILE_NOT_FUNCTION, { funcName: sShaderFuncName });
				return null;
			}

			pExprType = (<IAFXVariableTypeInstruction>pShaderFunc._getType())._wrap();

			pExpr._setType(pExprType);
			pExpr._setOperator("complile");
			pExpr._push(pShaderFunc._getNameId(), false);

			if (!isNull(pArguments)) {
				for (i = 0; i < pArguments.length; i++) {
					pExpr._push(pArguments[i], true);
				}
			}

			this.checkInstruction(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

			return pExpr;
		}

		private analyzeSamplerStateBlock(pNode: parser.IParseNode): IAFXExprInstruction {
			pNode = pNode.children[0];
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pExpr: instructions.SamplerStateBlockInstruction = new instructions.SamplerStateBlockInstruction();
			var i: uint = 0;

			pExpr._setOperator("sample_state");

			for (i = pChildren.length - 2; i >= 1; i--) {
				this.analyzeSamplerState(pChildren[i], pExpr);
			}

			this.checkInstruction(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

			return pExpr;
		}

		private analyzeSamplerState(pNode: parser.IParseNode, pSamplerStates: instructions.SamplerStateBlockInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			if (pChildren[pChildren.length - 2].name === "StateIndex") {
				this._error(EEffectErrors.NOT_SUPPORT_STATE_INDEX);
				return;
			}

			var pStateExprNode: parser.IParseNode = pChildren[pChildren.length - 3];
			var pSubStateExprNode: parser.IParseNode = pStateExprNode.children[pStateExprNode.children.length - 1];
			var sStateType: string = pChildren[pChildren.length - 1].value.toUpperCase();
			var sStateValue: string = "";
			var isTexture: boolean = false;

			if (isNull(pSubStateExprNode.value)) {
				this._error(EEffectErrors.BAD_TEXTURE_FOR_SAMLER);
				return;
			}
			var pTexture: IAFXVariableDeclInstruction = null;

			switch (sStateType) {
				case "TEXTURE":
					var pTexture: IAFXVariableDeclInstruction = null;
					if (pStateExprNode.children.length !== 3 || pSubStateExprNode.value === "{") {
						this._error(EEffectErrors.BAD_TEXTURE_FOR_SAMLER);
						return;
					}
					var sTextureName: string = pStateExprNode.children[1].value;
					if (isNull(sTextureName) || !this.hasVariable(sTextureName)) {
						this._error(EEffectErrors.BAD_TEXTURE_FOR_SAMLER);
						return;
					}

					pTexture = this.getVariable(sTextureName);
					sStateValue = sTextureName;
					break;

				case "ADDRESSU": /* WRAP_S */
				case "ADDRESSV": /* WRAP_T */
					sStateValue = pSubStateExprNode.value.toUpperCase();
					switch (sStateValue) {
						case "WRAP":
						case "CLAMP":
						case "MIRROR":
							break;
						default:
							logger.warn("Webgl don`t support this wrapmode: " + sStateValue);
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
							logger.warn("Webgl don`t support this texture filter: " + sStateValue);
							return;
					}
					break;

				default:
					logger.warn("Don`t support this texture param: " + sStateType);
					return;
			}

			if (sStateType !== "TEXTURE") {
				pSamplerStates.addState(sStateType, sStateValue);
			}
			else {
				pSamplerStates.setTexture(pTexture);
			}
		}

		private analyzeComplexExpr(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var sFirstNodeName: string = pChildren[pChildren.length - 1].name;

			switch (sFirstNodeName) {
				case "T_NON_TYPE_ID":
					return this.analyzeFunctionCallExpr(pNode);
				case "BaseType":
				case "T_TYPE_ID":
					return this.analyzeConstructorCallExpr(pNode);
				default:
					return this.analyzeSimpleComplexExpr(pNode);
			}
		}

		private analyzeFunctionCallExpr(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pExpr: IAFXExprInstruction = null;
			var pExprType: IAFXVariableTypeInstruction = null;
			var pArguments: IAFXExprInstruction[] = null;
			var sFuncName: string = pChildren[pChildren.length - 1].value;
			var pFunction: IAFXFunctionDeclInstruction = null;
			var pFunctionId: IAFXIdExprInstruction = null;
			var i: uint = 0;
			var pCurrentAnalyzedFunction: IAFXFunctionDeclInstruction = this.getCurrentAnalyzedFunction();

			if (pChildren.length > 3) {
				var pArgumentExpr: IAFXExprInstruction;

				pArguments = [];

				for (i = pChildren.length - 3; i > 0; i--) {
					if (pChildren[i].value !== ",") {
						pArgumentExpr = this.analyzeExpr(pChildren[i]);
						pArguments.push(pArgumentExpr);
					}
				}
			}

			pFunction = this.findFunction(sFuncName, pArguments);

			if (isNull(pFunction)) {
				this._error(EEffectErrors.BAD_COMPLEX_NOT_FUNCTION, { funcName: sFuncName });
				return null;
			}

			if (!isDef(pFunction)) {
				this._error(EEffectErrors.BAD_CANNOT_CHOOSE_FUNCTION, { funcName: sFuncName });
				return null;
			}

			if (!isNull(pCurrentAnalyzedFunction)) {
				if (!pFunction._isForPixel()) {
					pCurrentAnalyzedFunction._setForPixel(false);
				}

				if (!pFunction._isForVertex()) {
					pCurrentAnalyzedFunction._setForVertex(false);
				}
			}

			if (pFunction._getInstructionType() === EAFXInstructionTypes.k_FunctionDeclInstruction) {
				var pFunctionCallExpr: instructions.FunctionCallInstruction = new instructions.FunctionCallInstruction();

				pFunctionId = new instructions.IdExprInstruction();
				pFunctionId._push(pFunction._getNameId(), false);

				pExprType = (<IAFXVariableTypeInstruction>pFunction._getType())._wrap();

				pFunctionCallExpr._setType(pExprType);
				pFunctionCallExpr._push(pFunctionId, true);

				if (!isNull(pArguments)) {
					for (i = 0; i < pArguments.length; i++) {
						pFunctionCallExpr._push(pArguments[i], true);
					}

					var pFunctionArguments: IAFXVariableDeclInstruction[] = (<instructions.FunctionDeclInstruction>pFunction)._getArguments();
					for (i = 0; i < pArguments.length; i++) {
						if (pFunctionArguments[i]._getType()._hasUsage("out")) {
							if (!pArguments[i]._getType()._isWritable()) {
								this._error(EEffectErrors.BAD_TYPE_FOR_WRITE);
								return null;
							}

							if (pArguments[i]._getType()._isStrongEqual(Effect.getSystemType("ptr"))) {
								this.addPointerForExtract(pArguments[i]._getType()._getParentVarDecl());
							}
						}
						else if (pFunctionArguments[i]._getType()._hasUsage("inout")) {
							if (!pArguments[i]._getType()._isWritable()) {
								this._error(EEffectErrors.BAD_TYPE_FOR_WRITE);
								return null;
							}

							if (!pArguments[i]._getType()._isReadable()) {
								this._error(EEffectErrors.BAD_TYPE_FOR_READ);
								return null;
							}

							if (pArguments[i]._getType()._isStrongEqual(Effect.getSystemType("ptr"))) {
								this.addPointerForExtract(pArguments[i]._getType()._getParentVarDecl());
							}
						}
						else {
							if (!pArguments[i]._getType()._isReadable()) {
								this._error(EEffectErrors.BAD_TYPE_FOR_READ);
								return null;
							}
						}
					}

					for (i = pArguments.length; i < pFunctionArguments.length; i++) {
						pFunctionCallExpr._push(pFunctionArguments[i]._getInitializeExpr(), false);
					}

				}

				if (!isNull(pCurrentAnalyzedFunction)) {
					pCurrentAnalyzedFunction._addUsedFunction(pFunction);
				}

				pFunction._markUsedAs(EFunctionType.k_Function);

				pExpr = pFunctionCallExpr;
			}
			else {
				var pSystemCallExpr: instructions.SystemCallInstruction = new instructions.SystemCallInstruction();

				pSystemCallExpr.setSystemCallFunction(pFunction);
				pSystemCallExpr.fillByArguments(pArguments);

				if (!isNull(pCurrentAnalyzedFunction)) {
					for (i = 0; i < pArguments.length; i++) {
						if (!pArguments[i]._getType()._isReadable()) {
							this._error(EEffectErrors.BAD_TYPE_FOR_READ);
							return null;
						}
					}
				}

				pExpr = pSystemCallExpr;

				if (!pFunction._isBuiltIn() && !isNull(pCurrentAnalyzedFunction)) {
					pCurrentAnalyzedFunction._addUsedFunction(pFunction);
				}
			}

			this.checkInstruction(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

			return pExpr;
		}

		private analyzeConstructorCallExpr(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pExpr: instructions.ConstructorCallInstruction = new instructions.ConstructorCallInstruction();
			var pExprType: IAFXVariableTypeInstruction = null;
			var pArguments: IAFXExprInstruction[] = null;
			var pConstructorType: IAFXTypeInstruction = null;
			var i: uint = 0;

			pConstructorType = this.analyzeType(pChildren[pChildren.length - 1]);

			if (isNull(pConstructorType)) {
				this._error(EEffectErrors.BAD_COMPLEX_NOT_TYPE);
				return null;
			}

			if (pChildren.length > 3) {
				var pArgumentExpr: IAFXExprInstruction = null;

				pArguments = [];

				for (i = pChildren.length - 3; i > 0; i--) {
					if (pChildren[i].value !== ",") {
						pArgumentExpr = this.analyzeExpr(pChildren[i]);
						pArguments.push(pArgumentExpr);
					}
				}
			}

			pExprType = this.findConstructor(pConstructorType, pArguments);

			if (isNull(pExprType)) {
				this._error(EEffectErrors.BAD_COMPLEX_NOT_CONSTRUCTOR, { typeName: pConstructorType.toString() });
				return null;
			}

			pExpr._setType(pExprType);
			pExpr._push(pConstructorType, false);

			if (!isNull(pArguments)) {
				for (i = 0; i < pArguments.length; i++) {
					if (!pArguments[i]._getType()._isReadable()) {
						this._error(EEffectErrors.BAD_TYPE_FOR_READ);
						return null;
					}

					pExpr._push(pArguments[i], true);
				}
			}

			this.checkInstruction(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

			return pExpr;
		}

		private analyzeSimpleComplexExpr(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pExpr: instructions.ComplexExprInstruction = new instructions.ComplexExprInstruction();
			var pComplexExpr: IAFXExprInstruction;
			var pExprType: IAFXVariableTypeInstruction;

			pComplexExpr = this.analyzeExpr(pChildren[1]);
			pExprType = <IAFXVariableTypeInstruction>pComplexExpr._getType();

			pExpr._setType(pExprType);
			pExpr._push(pComplexExpr, true);

			this.checkInstruction(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

			return pExpr;
		}

		private analyzePrimaryExpr(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pExpr: instructions.PrimaryExprInstruction = new instructions.PrimaryExprInstruction();
			var pPrimaryExpr: IAFXExprInstruction;
			var pPointer: IAFXVariableDeclInstruction = null;
			var pPrimaryExprType: IAFXVariableTypeInstruction;

			pPrimaryExpr = this.analyzeExpr(pChildren[0]);
			pPrimaryExprType = <IAFXVariableTypeInstruction>pPrimaryExpr._getType();

			pPointer = pPrimaryExprType._getPointer();

			if (isNull(pPointer)) {
				this._error(EEffectErrors.BAD_PRIMARY_NOT_POINT, { typeName: pPrimaryExprType._getHash() });
				return null;
			}

			var pPointerVarType: IAFXVariableTypeInstruction = <IAFXVariableTypeInstruction>pPrimaryExprType._getParent();
			if (!pPrimaryExprType._isStrictPointer()) {
				this.getCurrentAnalyzedFunction()._setForPixel(false);
				this.getCurrentAnalyzedFunction()._notCanUsedAsFunction();
				pPrimaryExprType._setPointerToStrict();
			}

			pExpr._setType(pPointer._getType());
			pExpr._setOperator("@");
			pExpr._push(pPointer._getNameId(), false);

			this.checkInstruction(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

			return pExpr;
		}

		private analyzePostfixExpr(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var sSymbol: string = pChildren[pChildren.length - 2].value;

			switch (sSymbol) {
				case "[":
					return this.analyzePostfixIndex(pNode);
				case ".":
					return this.analyzePostfixPoint(pNode);
				case "++":
				case "--":
					return this.analyzePostfixArithmetic(pNode);
			}
		}

		private analyzePostfixIndex(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pExpr: instructions.PostfixIndexInstruction = new instructions.PostfixIndexInstruction();
			var pPostfixExpr: IAFXExprInstruction = null;
			var pIndexExpr: IAFXExprInstruction = null;
			var pExprType: IAFXVariableTypeInstruction = null;
			var pPostfixExprType: IAFXVariableTypeInstruction = null;
			var pIndexExprType: IAFXVariableTypeInstruction = null;
			var pIntType: IAFXTypeInstruction = null;

			pPostfixExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
			pPostfixExprType = <IAFXVariableTypeInstruction>pPostfixExpr._getType();

			if (!pPostfixExprType._isArray()) {
				this._error(EEffectErrors.BAD_POSTIX_NOT_ARRAY, { typeName: pPostfixExprType.toString() });
				return null;
			}

			pIndexExpr = this.analyzeExpr(pChildren[pChildren.length - 3]);
			pIndexExprType = <IAFXVariableTypeInstruction>pIndexExpr._getType();

			pIntType = Effect.getSystemType("int");

			if (!pIndexExprType._isEqual(pIntType)) {
				this._error(EEffectErrors.BAD_POSTIX_NOT_INT_INDEX, { typeName: pIndexExprType.toString() });
				return null;
			}

			pExprType = <IAFXVariableTypeInstruction>(pPostfixExprType._getArrayElementType());

			pExpr._setType(pExprType);
			pExpr._push(pPostfixExpr, true);
			pExpr._push(pIndexExpr, true);

			this.checkInstruction(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

			return pExpr;
		}

		private analyzePostfixPoint(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pExpr: instructions.PostfixPointInstruction = new instructions.PostfixPointInstruction();
			var pPostfixExpr: IAFXExprInstruction = null;
			var sFieldName: string = "";
			var pFieldNameExpr: IAFXIdExprInstruction = null;
			var pExprType: IAFXVariableTypeInstruction = null;
			var pPostfixExprType: IAFXVariableTypeInstruction = null;

			pPostfixExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
			pPostfixExprType = <IAFXVariableTypeInstruction>pPostfixExpr._getType();

			sFieldName = pChildren[pChildren.length - 3].value;

			pFieldNameExpr = pPostfixExprType._getFieldExpr(sFieldName);

			if (isNull(pFieldNameExpr)) {
				this._error(EEffectErrors.BAD_POSTIX_NOT_FIELD, {
					typeName: pPostfixExprType.toString(),
					fieldName: sFieldName
				});
				return null;
			}

			pExprType = <IAFXVariableTypeInstruction>pFieldNameExpr._getType();

			if (pChildren.length === 4) {
				if (!pExprType._isPointer()) {
					this._error(EEffectErrors.BAD_POSTIX_NOT_POINTER, { typeName: pExprType.toString() });
					return null;
				}

				var pBuffer: IAFXVariableDeclInstruction = this.analyzeFromExpr(pChildren[0]);
				pExprType._setVideoBuffer(pBuffer);
			}

			pExpr._setType(pExprType);
			pExpr._push(pPostfixExpr, true);
			pExpr._push(pFieldNameExpr, true);

			this.checkInstruction(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

			return pExpr;
		}

		private analyzePostfixArithmetic(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var sOperator: string = pChildren[0].value;
			var pExpr: instructions.PostfixArithmeticInstruction = new instructions.PostfixArithmeticInstruction();
			var pPostfixExpr: IAFXExprInstruction;
			var pExprType: IAFXVariableTypeInstruction;
			var pPostfixExprType: IAFXVariableTypeInstruction;

			pPostfixExpr = this.analyzeExpr(pChildren[1]);
			pPostfixExprType = <IAFXVariableTypeInstruction>pPostfixExpr._getType();

			pExprType = this.checkOneOperandExprType(sOperator, pPostfixExprType);

			if (isNull(pExprType)) {
				this._error(EEffectErrors.BAD_POSTIX_ARITHMETIC, {
					operator: sOperator,
					typeName: pPostfixExprType.toString()
				});
				return null;
			}

			pExpr._setType(pExprType);
			pExpr._setOperator(sOperator);
			pExpr._push(pPostfixExpr, true);

			this.checkInstruction(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

			return pExpr;
		}

		private analyzeUnaryExpr(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var sOperator: string = pChildren[1].value;
			var pExpr: instructions.UnaryExprInstruction = new instructions.UnaryExprInstruction();
			var pUnaryExpr: IAFXExprInstruction;
			var pExprType: IAFXVariableTypeInstruction;
			var pUnaryExprType: IAFXVariableTypeInstruction;

			pUnaryExpr = this.analyzeExpr(pChildren[0]);
			pUnaryExprType = <IAFXVariableTypeInstruction>pUnaryExpr._getType();

			pExprType = this.checkOneOperandExprType(sOperator, pUnaryExprType);

			if (isNull(pExprType)) {
				this._error(EEffectErrors.BAD_UNARY_OPERATION, {
					operator: sOperator,
					tyepName: pUnaryExprType.toString()
				});
				return null;
			}

			pExpr._setOperator(sOperator);
			pExpr._setType(pExprType);
			pExpr._push(pUnaryExpr, true);

			this.checkInstruction(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

			return pExpr;
		}

		private analyzeCastExpr(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pExpr: instructions.CastExprInstruction = new instructions.CastExprInstruction();
			var pExprType: IAFXVariableTypeInstruction;
			var pCastedExpr: IAFXExprInstruction;

			pExprType = this.analyzeConstTypeDim(pChildren[2]);
			pCastedExpr = this.analyzeExpr(pChildren[0]);

			if (!(<IAFXVariableTypeInstruction>pCastedExpr._getType())._isReadable()) {
				this._error(EEffectErrors.BAD_TYPE_FOR_READ);
				return null;
			}

			pExpr._setType(pExprType);
			pExpr._push(pExprType, true);
			pExpr._push(pCastedExpr, true);

			this.checkInstruction(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

			return pExpr;
		}

		private analyzeConditionalExpr(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pExpr: instructions.ConditionalExprInstruction = new instructions.ConditionalExprInstruction();
			var pConditionExpr: IAFXExprInstruction;
			var pTrueExpr: IAFXExprInstruction;
			var pFalseExpr: IAFXExprInstruction;
			var pConditionType: IAFXVariableTypeInstruction;
			var pTrueExprType: IAFXVariableTypeInstruction;
			var pFalseExprType: IAFXVariableTypeInstruction;
			var pExprType: IAFXVariableTypeInstruction;
			var pBoolType: IAFXTypeInstruction;

			pConditionExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
			pTrueExpr = this.analyzeExpr(pChildren[pChildren.length - 3]);
			pFalseExpr = this.analyzeExpr(pChildren[0]);

			pConditionType = <IAFXVariableTypeInstruction>pConditionExpr._getType();
			pTrueExprType = <IAFXVariableTypeInstruction>pTrueExpr._getType();
			pFalseExprType = <IAFXVariableTypeInstruction>pFalseExpr._getType();

			pBoolType = Effect.getSystemType("bool");

			if (!pConditionType._isEqual(pBoolType)) {
				this._error(EEffectErrors.BAD_CONDITION_TYPE, { typeName: pConditionType.toString() });
				return null;
			}

			if (!pTrueExprType._isEqual(pFalseExprType)) {
				this._error(EEffectErrors.BAD_CONDITION_VALUE_TYPES, {
					leftTypeName: pTrueExprType.toString(),
					rightTypeName: pFalseExprType.toString()
				});
				return null;
			}

			if (!pConditionType._isReadable()) {
				this._error(EEffectErrors.BAD_TYPE_FOR_READ);
				return null;
			}

			if (!pTrueExprType._isReadable()) {
				this._error(EEffectErrors.BAD_TYPE_FOR_READ);
				return null;
			}

			if (!pFalseExprType._isReadable()) {
				this._error(EEffectErrors.BAD_TYPE_FOR_READ);
				return null;
			}

			pExpr._setType(pTrueExprType);
			pExpr._push(pConditionExpr, true);
			pExpr._push(pTrueExpr, true);
			pExpr._push(pFalseExpr, true);

			this.checkInstruction(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

			return pExpr;
		}

		private analyzeArithmeticExpr(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var sOperator: string = pNode.children[1].value;
			var pExpr: instructions.ArithmeticExprInstruction = new instructions.ArithmeticExprInstruction();
			var pLeftExpr: IAFXExprInstruction = null;
			var pRightExpr: IAFXExprInstruction = null;
			var pLeftType: IAFXVariableTypeInstruction = null;
			var pRightType: IAFXVariableTypeInstruction = null;
			var pExprType: IAFXVariableTypeInstruction = null;

			pLeftExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
			pRightExpr = this.analyzeExpr(pChildren[0]);

			pLeftType = <IAFXVariableTypeInstruction>pLeftExpr._getType();
			pRightType = <IAFXVariableTypeInstruction>pRightExpr._getType();

			pExprType = this.checkTwoOperandExprTypes(sOperator, pLeftType, pRightType);

			if (isNull(pExprType)) {
				this._error(EEffectErrors.BAD_ARITHMETIC_OPERATION, {
					operator: sOperator,
					leftTypeName: pLeftType.toString(),
					rightTypeName: pRightType.toString()
				});
				return null;
			}

			pExpr._setOperator(sOperator);
			pExpr._setType(pExprType);
			pExpr._push(pLeftExpr, true);
			pExpr._push(pRightExpr, true);

			this.checkInstruction(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

			return pExpr;
		}

		private analyzeRelationExpr(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var sOperator: string = pNode.children[1].value;
			var pExpr: instructions.RelationalExprInstruction = new instructions.RelationalExprInstruction();
			var pLeftExpr: IAFXExprInstruction;
			var pRightExpr: IAFXExprInstruction;
			var pLeftType: IAFXVariableTypeInstruction;
			var pRightType: IAFXVariableTypeInstruction;
			var pExprType: IAFXVariableTypeInstruction;

			pLeftExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
			pRightExpr = this.analyzeExpr(pChildren[0]);

			pLeftType = <IAFXVariableTypeInstruction>pLeftExpr._getType();
			pRightType = <IAFXVariableTypeInstruction>pRightExpr._getType();

			pExprType = this.checkTwoOperandExprTypes(sOperator, pLeftType, pRightType);

			if (isNull(pExprType)) {
				this._error(EEffectErrors.BAD_RELATIONAL_OPERATION, {
					operator: sOperator,
					leftTypeName: pLeftType._getHash(),
					rightTypeName: pRightType._getHash()
				});
				return null;
			}

			pExpr._setOperator(sOperator);
			pExpr._setType(pExprType);
			pExpr._push(pLeftExpr, true);
			pExpr._push(pRightExpr, true);

			this.checkInstruction(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

			return pExpr;
		}

		private analyzeLogicalExpr(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var sOperator: string = pNode.children[1].value;
			var pExpr: instructions.LogicalExprInstruction = new instructions.LogicalExprInstruction();
			var pLeftExpr: IAFXExprInstruction;
			var pRightExpr: IAFXExprInstruction;
			var pLeftType: IAFXVariableTypeInstruction;
			var pRightType: IAFXVariableTypeInstruction;
			var pBoolType: IAFXTypeInstruction;

			pLeftExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
			pRightExpr = this.analyzeExpr(pChildren[0]);

			pLeftType = <IAFXVariableTypeInstruction>pLeftExpr._getType();
			pRightType = <IAFXVariableTypeInstruction>pRightExpr._getType();

			pBoolType = Effect.getSystemType("bool");

			if (!pLeftType._isEqual(pBoolType)) {
				this._error(EEffectErrors.BAD_LOGICAL_OPERATION, {
					operator: sOperator,
					typeName: pLeftType.toString()
				});
				return null;
			}
			if (!pRightType._isEqual(pBoolType)) {
				this._error(EEffectErrors.BAD_LOGICAL_OPERATION, {
					operator: sOperator,
					typeName: pRightType.toString()
				});
				return null;
			}

			if (!pLeftType._isReadable()) {
				this._error(EEffectErrors.BAD_TYPE_FOR_READ);
				return null;
			}

			if (!pRightType._isReadable()) {
				this._error(EEffectErrors.BAD_TYPE_FOR_READ);
				return null;
			}

			pExpr._setOperator(sOperator);
			pExpr._setType((<instructions.SystemTypeInstruction>pBoolType).getVariableType());
			pExpr._push(pLeftExpr, true);
			pExpr._push(pRightExpr, true);

			this.checkInstruction(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

			return pExpr;
		}

		private analyzeAssignmentExpr(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var sOperator: string = pChildren[1].value;
			var pExpr: instructions.AssignmentExprInstruction = new instructions.AssignmentExprInstruction();
			var pLeftExpr: IAFXExprInstruction;
			var pRightExpr: IAFXExprInstruction;
			var pLeftType: IAFXVariableTypeInstruction;
			var pRightType: IAFXVariableTypeInstruction;
			var pExprType: IAFXVariableTypeInstruction;

			pLeftExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
			pRightExpr = this.analyzeExpr(pChildren[0]);

			pLeftType = <IAFXVariableTypeInstruction>pLeftExpr._getType();
			pRightType = <IAFXVariableTypeInstruction>pRightExpr._getType();

			if (sOperator !== "=") {
				pExprType = this.checkTwoOperandExprTypes(sOperator, pLeftType, pRightType);
				if (isNull(pExprType)) {
					this._error(EEffectErrors.BAD_ARITHMETIC_ASSIGNMENT_OPERATION, {
						operator: sOperator,
						leftTypeName: pLeftType._getHash(),
						rightTypeName: pRightType._getHash()
					});
				}
			}
			else {
				pExprType = pRightType;
			}

			pExprType = this.checkTwoOperandExprTypes("=", pLeftType, pExprType);

			if (isNull(pExprType)) {
				this._error(EEffectErrors.BAD_ASSIGNMENT_OPERATION, {
					leftTypeName: pLeftType._getHash(),
					rightTypeName: pRightType._getHash()
				});
			}

			pExpr._setOperator(sOperator);
			pExpr._setType(pExprType);
			pExpr._push(pLeftExpr, true);
			pExpr._push(pRightExpr, true);

			this.checkInstruction(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

			return pExpr;
		}

		private analyzeIdExpr(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);

			var sName: string = pNode.value;
			var pVariable: IAFXVariableDeclInstruction = this.getVariable(sName);

			if (isNull(pVariable)) {
				this._error(EEffectErrors.UNKNOWN_VARNAME, { varName: sName });
				return null;
			}

			if (pVariable._getType()._isUnverifiable() && !this.isAnalzeInPass()) {
				this._error(EEffectErrors.BAD_USE_OF_ENGINE_VARIABLE);
				return null;
			}

			if (!isNull(this.getCurrentAnalyzedFunction())) {
				if (!pVariable._isForPixel()) {
					this.getCurrentAnalyzedFunction()._setForPixel(false);
				}
				if (!pVariable._isForVertex()) {
					this.getCurrentAnalyzedFunction()._setForVertex(false);
				}
			}

			if (!isNull(this.getCurrentAnalyzedPass()) && pVariable._getType()._isForeign()) {
				this.getCurrentAnalyzedPass()._addOwnUsedForignVariable(pVariable);
			}

			var pVarId: instructions.IdExprInstruction = new instructions.IdExprInstruction();
			pVarId._push(pVariable._getNameId(), false);

			this.checkInstruction(pVarId, ECheckStage.CODE_TARGET_SUPPORT);

			return pVarId;
		}

		private analyzeSimpleExpr(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);

			var pInstruction: IAFXLiteralInstruction = null;
			var sName: string = pNode.name;
			var sValue: string = pNode.value;

			switch (sName) {
				case "T_UINT":
					pInstruction = new instructions.IntInstruction();
					pInstruction._setValue((<int><any>sValue) * 1);
					break;
				case "T_FLOAT":
					pInstruction = new instructions.FloatInstruction();
					pInstruction._setValue((<float><any>sValue) * 1.0);
					break;
				case "T_STRING":
					pInstruction = new instructions.StringInstruction();
					pInstruction._setValue(sValue);
					break;
				case "T_KW_TRUE":
					pInstruction = new instructions.BoolInstruction();
					pInstruction._setValue(true);
					break;
				case "T_KW_FALSE":
					pInstruction = new instructions.BoolInstruction();
					pInstruction._setValue(false);
					break;
			}

			return pInstruction;
		}

		private analyzeMemExpr(pNode: parser.IParseNode): IAFXExprInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pMemExpr: instructions.MemExprInstruction = new instructions.MemExprInstruction();

			var pPostfixExpr: IAFXExprInstruction = this.analyzeExpr(pChildren[0]);
			var pPostfixExprType: IAFXVariableTypeInstruction = <IAFXVariableTypeInstruction>pPostfixExpr._getType();

			if (!pPostfixExprType._isFromVariableDecl()) {
				this._error(EEffectErrors.BAD_MEMOF_ARGUMENT);
				return null;
			}

			var pBuffer: IAFXVariableDeclInstruction = pPostfixExprType._getVideoBuffer();

			if (isNull(pBuffer)) {
				this._error(EEffectErrors.BAD_MEMOF_NO_BUFFER);
			}

			if (!pPostfixExprType._isStrictPointer() && !isNull(this.getCurrentAnalyzedFunction())) {
				this.getCurrentAnalyzedFunction()._setForPixel(false);
				this.getCurrentAnalyzedFunction()._notCanUsedAsFunction();
				pPostfixExprType._setPointerToStrict();
			}

			pMemExpr.setBuffer(pBuffer);

			return pMemExpr;
		}

		private analyzeConstTypeDim(pNode: parser.IParseNode): IAFXVariableTypeInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			if (pChildren.length > 1) {
				this._error(EEffectErrors.BAD_CAST_TYPE_USAGE);
				return null;
			}

			var pType: IAFXVariableTypeInstruction;

			pType = <IAFXVariableTypeInstruction>(this.analyzeType(pChildren[0]));

			if (!pType._isBase()) {
				this._error(EEffectErrors.BAD_CAST_TYPE_NOT_BASE, { typeName: pType.toString() });
			}

			this.checkInstruction(pType, ECheckStage.CODE_TARGET_SUPPORT);

			return pType;
		}

		private analyzeVarStructDecl(pNode: parser.IParseNode, pInstruction: IAFXInstruction = null): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pUsageType: IAFXVariableTypeInstruction = null;
			var pVariable: IAFXVariableDeclInstruction = null;
			var i: uint = 0;

			pUsageType = this.analyzeUsageStructDecl(pChildren[pChildren.length - 1]);

			for (i = pChildren.length - 2; i >= 1; i--) {
				if (pChildren[i].name === "Variable") {
					pVariable = this.analyzeVariable(pChildren[i], pUsageType);

					if (!isNull(pInstruction)) {
						pInstruction._push(pVariable, true);
					}
				}
			}
		}

		private analyzeUsageStructDecl(pNode: parser.IParseNode): IAFXVariableTypeInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var i: uint = 0;
			var pType: IAFXVariableTypeInstruction = new instructions.VariableTypeInstruction();

			for (i = pChildren.length - 1; i >= 0; i--) {
				if (pChildren[i].name === "StructDecl") {
					var pMainType: IAFXTypeInstruction = this.analyzeStructDecl(pChildren[i]);
					pType._pushType(pMainType);

					var pTypeDecl: IAFXTypeDeclInstruction = new instructions.TypeDeclInstruction();
					pTypeDecl._push(pMainType, true);

					this.addTypeDecl(pTypeDecl);
				}
				else if (pChildren[i].name === "Usage") {
					var sUsage: string = this.analyzeUsage(pChildren[i]);
					pType._addUsage(sUsage);
				}
			}

			this.checkInstruction(pType, ECheckStage.CODE_TARGET_SUPPORT);

			return pType;
		}

		private analyzeTypeDecl(pNode: parser.IParseNode, pParentInstruction: IAFXInstruction = null): IAFXTypeDeclInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			var pTypeDeclInstruction: IAFXTypeDeclInstruction = new instructions.TypeDeclInstruction();

			if (pChildren.length === 2) {
				var pStructInstruction: instructions.ComplexTypeInstruction = <instructions.ComplexTypeInstruction>this.analyzeStructDecl(pChildren[1]);
				pTypeDeclInstruction._push(pStructInstruction, true);
			}
			else {
				this._error(EEffectErrors.UNSUPPORTED_TYPEDECL);
			}

			this.checkInstruction(pTypeDeclInstruction, ECheckStage.CODE_TARGET_SUPPORT);

			this.addTypeDecl(pTypeDeclInstruction);

			pNode.isAnalyzed = true;

			if (!isNull(pParentInstruction)) {
				pParentInstruction._push(pTypeDeclInstruction, true);
			}

			return pTypeDeclInstruction;
		}

		private analyzeStructDecl(pNode: parser.IParseNode): IAFXTypeInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			var pStruct: instructions.ComplexTypeInstruction = new instructions.ComplexTypeInstruction();
			var pFieldCollector: IAFXInstruction = new instructions.InstructionCollector();

			var sName: string = pChildren[pChildren.length - 2].value;

			pStruct._setName(sName);

			this.newScope(EScopeType.k_Struct);

			var i: uint = 0;
			for (i = pChildren.length - 4; i >= 1; i--) {
				if (pChildren[i].name === "VariableDecl") {
					this.analyzeVariableDecl(pChildren[i], pFieldCollector);
				}
			}

			this.endScope();

			pStruct.addFields(pFieldCollector, true);

			this.checkInstruction(pStruct, ECheckStage.CODE_TARGET_SUPPORT);

			return pStruct;
		}

		private analyzeStruct(pNode: parser.IParseNode): IAFXTypeInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			var pStruct: instructions.ComplexTypeInstruction = new instructions.ComplexTypeInstruction();
			var pFieldCollector: IAFXInstruction = new instructions.InstructionCollector();

			this.newScope(EScopeType.k_Struct);

			var i: uint = 0;
			for (i = pChildren.length - 4; i >= 1; i--) {
				if (pChildren[i].name === "VariableDecl") {
					this.analyzeVariableDecl(pChildren[i], pFieldCollector);
				}
			}

			this.endScope();

			pStruct.addFields(pFieldCollector, true);

			this.checkInstruction(pStruct, ECheckStage.CODE_TARGET_SUPPORT);

			return pStruct;
		}

		private analyzeFunctionDeclOnlyDefinition(pNode: parser.IParseNode): IAFXFunctionDeclInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pFunction: instructions.FunctionDeclInstruction = null;
			var pFunctionDef: instructions.FunctionDefInstruction = null;
			var pStmtBlock: instructions.StmtBlockInstruction = null;
			var pAnnotation: IAFXAnnotationInstruction = null;
			var sLastNodeValue: string = pChildren[0].value;
			var bNeedAddFunction: boolean = false;

			pFunctionDef = this.analyzeFunctionDef(pChildren[pChildren.length - 1]);

			pFunction = <instructions.FunctionDeclInstruction>this.findFunctionByDef(pFunctionDef);

			if (!isDef(pFunction)) {
				this._error(EEffectErrors.BAD_CANNOT_CHOOSE_FUNCTION, { funcName: pFunction._getNameId().toString() });
				return null;
			}

			if (!isNull(pFunction) && pFunction._hasImplementation()) {
				this._error(EEffectErrors.BAD_REDEFINE_FUNCTION, { funcName: pFunction._getNameId().toString() });
				return null;
			}

			if (isNull(pFunction)) {
				pFunction = new instructions.FunctionDeclInstruction();
				bNeedAddFunction = true;
			}
			else {
				if (!pFunction._getReturnType()._isEqual(pFunctionDef.getReturnType())) {
					this._error(EEffectErrors.BAD_FUNCTION_DEF_RETURN_TYPE, { funcName: pFunction._getNameId().toString() });
					return null;
				}

				bNeedAddFunction = false;
			}

			pFunction._setFunctionDef(<IAFXDeclInstruction>pFunctionDef);

			this.resumeScope();

			if (pChildren.length === 3) {
				pAnnotation = this.analyzeAnnotation(pChildren[1]);
				pFunction._setAnnotation(pAnnotation);
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

		}

		private resumeFunctionAnalysis(pAnalzedFunction: IAFXFunctionDeclInstruction): void {
			var pFunction: instructions.FunctionDeclInstruction = <instructions.FunctionDeclInstruction>pAnalzedFunction;
			var pNode: parser.IParseNode = pFunction._getParseNode();

			this.setAnalyzedNode(pNode);
			this.setScope(pFunction._getImplementationScope());

			var pChildren: parser.IParseNode[] = pNode.children;
			var pStmtBlock: instructions.StmtBlockInstruction = null;

			this.setCurrentAnalyzedFunction(pFunction);

			pStmtBlock = <instructions.StmtBlockInstruction>this.analyzeStmtBlock(pChildren[0]);
			pFunction._setImplementation(<IAFXStmtInstruction>pStmtBlock);

			if (!pFunction._getReturnType()._isEqual(Effect.getSystemType("void")) && !this._bHaveCurrentFunctionReturnOccur) {
				this._error(EEffectErrors.BAD_FUNCTION_DONT_HAVE_RETURN_STMT, { funcName: pFunction._getNameId().toString() })
			}

			this.setCurrentAnalyzedFunction(null);

			this.endScope();

			this.checkInstruction(pFunction, ECheckStage.CODE_TARGET_SUPPORT);
		}

		private analyzeFunctionDef(pNode: parser.IParseNode): instructions.FunctionDefInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pFunctionDef: instructions.FunctionDefInstruction = new instructions.FunctionDefInstruction();
			var pReturnType: IAFXVariableTypeInstruction = null;
			var pFuncName: IAFXIdInstruction = null;
			var pArguments: IAFXVariableDeclInstruction[] = null;
			var sFuncName: string = pChildren[pChildren.length - 2].value;

			pReturnType = this.analyzeUsageType(pChildren[pChildren.length - 1]);

			if (pReturnType._isPointer() || pReturnType._containSampler() || pReturnType._containPointer()) {
				this._error(EEffectErrors.BAD_RETURN_TYPE_FOR_FUNCTION, { funcName: sFuncName });
				return null;
			}

			pFuncName = new instructions.IdInstruction();
			pFuncName._setName(sFuncName);

			pFunctionDef.setReturnType(pReturnType);
			pFunctionDef.setFunctionName(pFuncName);

			if (pChildren.length === 4) {
				var sSemantic: string = this.analyzeSemantic(pChildren[0]);
				pFunctionDef._setSemantic(sSemantic);
			}

			this.newScope();

			this.analyzeParamList(pChildren[pChildren.length - 3], pFunctionDef);

			this.endScope();

			this.checkInstruction(pFunctionDef, ECheckStage.CODE_TARGET_SUPPORT);

			return pFunctionDef;
		}

		private analyzeParamList(pNode: parser.IParseNode, pFunctionDef: instructions.FunctionDefInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pParameter: IAFXVariableDeclInstruction;

			var i: uint = 0;

			for (i = pChildren.length - 2; i >= 1; i--) {
				if (pChildren[i].name === "ParameterDecl") {
					pParameter = this.analyzeParameterDecl(pChildren[i]);
					pParameter._setScope(this.getScope());
					pFunctionDef.addParameter(pParameter, this.isStrictMode());
				}
			}
		}

		private analyzeParameterDecl(pNode: parser.IParseNode): IAFXVariableDeclInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pType: IAFXVariableTypeInstruction = null;
			var pParameter: IAFXVariableDeclInstruction = null;

			pType = this.analyzeParamUsageType(pChildren[1]);
			pParameter = this.analyzeVariable(pChildren[0], pType);

			return pParameter;
		}

		private analyzeParamUsageType(pNode: parser.IParseNode): IAFXVariableTypeInstruction {
			var pChildren: parser.IParseNode[] = pNode.children;
			var i: uint = 0;
			var pType: IAFXVariableTypeInstruction = new instructions.VariableTypeInstruction();

			for (i = pChildren.length - 1; i >= 0; i--) {
				if (pChildren[i].name === "Type") {
					var pMainType: IAFXTypeInstruction = this.analyzeType(pChildren[i]);
					pType._pushType(pMainType);
				}
				else if (pChildren[i].name === "ParamUsage") {
					var sUsage: string = this.analyzeUsage(pChildren[i]);
					pType._addUsage(sUsage);
				}
			}

			this.checkInstruction(pType, ECheckStage.CODE_TARGET_SUPPORT);

			return pType;
		}

		private analyzeStmtBlock(pNode: parser.IParseNode): IAFXStmtInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pStmtBlock: instructions.StmtBlockInstruction = new instructions.StmtBlockInstruction();
			var pStmt: IAFXStmtInstruction;
			var i: uint = 0;

			pStmtBlock._setScope(this.getScope());

			this.newScope();

			for (i = pChildren.length - 2; i > 0; i--) {
				pStmt = this.analyzeStmt(pChildren[i]);
				if (!isNull(pStmt)) {
					pStmtBlock._push(pStmt);
				}

				this.addExtactionStmts(pStmtBlock);
			}

			this.endScope();

			this.checkInstruction(pStmtBlock, ECheckStage.CODE_TARGET_SUPPORT);

			return pStmtBlock;
		}

		private analyzeStmt(pNode: parser.IParseNode): IAFXStmtInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var sFirstNodeName: string = pChildren[pChildren.length - 1].name;

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
		}

		private analyzeSimpleStmt(pNode: parser.IParseNode): IAFXStmtInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var sFirstNodeName: string = pChildren[pChildren.length - 1].name;

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
					}
					else {
						return (new instructions.SemicolonStmtInstruction());
					}
			}
		}

		private analyzeReturnStmt(pNode: parser.IParseNode): IAFXStmtInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pReturnStmtInstruction: instructions.ReturnStmtInstruction = new instructions.ReturnStmtInstruction();

			var pFunctionReturnType: IAFXVariableTypeInstruction = this.getCurrentAnalyzedFunction()._getReturnType();

			this._bHaveCurrentFunctionReturnOccur = true;

			if (pFunctionReturnType._isEqual(Effect.getSystemType("void")) && pChildren.length === 3) {
				this._error(EEffectErrors.BAD_RETURN_STMT_VOID);
				return null;
			}
			else if (!pFunctionReturnType._isEqual(Effect.getSystemType("void")) && pChildren.length === 2) {
				this._error(EEffectErrors.BAD_RETURN_STMT_EMPTY);
				return null;
			}

			if (pChildren.length === 3) {
				var pExprInstruction: IAFXExprInstruction = this.analyzeExpr(pChildren[1]);
				var pOutVar: IAFXVariableDeclInstruction = this.getCurrentAnalyzedFunction()._getOutVariable();

				if (!isNull(pOutVar) && pOutVar._getType() !== pExprInstruction._getType()) {
					this._error(EEffectErrors.BAD_RETURN_STMT_NOT_EQUAL_TYPES);
					return null;
				}

				if (!pFunctionReturnType._isEqual(pExprInstruction._getType())) {
					this._error(EEffectErrors.BAD_RETURN_STMT_NOT_EQUAL_TYPES);
					return null;
				}
				pReturnStmtInstruction._push(pExprInstruction, true);
			}

			this.checkInstruction(pReturnStmtInstruction, ECheckStage.CODE_TARGET_SUPPORT);

			return pReturnStmtInstruction;
		}

		private analyzeBreakStmt(pNode: parser.IParseNode): IAFXStmtInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pBreakStmtInstruction: instructions.BreakStmtInstruction = new instructions.BreakStmtInstruction();
			var sOperatorName: string = pChildren[1].value;

			pBreakStmtInstruction._setOperator(sOperatorName);

			if (sOperatorName === "discard" && !isNull(this.getCurrentAnalyzedFunction())) {
				this.getCurrentAnalyzedFunction()._setForVertex(false);
			}

			this.checkInstruction(pBreakStmtInstruction, ECheckStage.CODE_TARGET_SUPPORT);

			return pBreakStmtInstruction;
		}

		private analyzeDeclStmt(pNode: parser.IParseNode): IAFXStmtInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var sNodeName: string = pNode.name;
			var pDeclStmtInstruction: instructions.DeclStmtInstruction = new instructions.DeclStmtInstruction();

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

			this.checkInstruction(pDeclStmtInstruction, ECheckStage.CODE_TARGET_SUPPORT);

			return pDeclStmtInstruction;
		}

		private analyzeExprStmt(pNode: parser.IParseNode): IAFXStmtInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pExprStmtInstruction: instructions.ExprStmtInstruction = new instructions.ExprStmtInstruction();
			var pExprInstruction: IAFXExprInstruction = this.analyzeExpr(pChildren[1]);

			pExprStmtInstruction._push(pExprInstruction, true);

			this.checkInstruction(pExprStmtInstruction, ECheckStage.CODE_TARGET_SUPPORT);

			return pExprStmtInstruction;
		}

		private analyzeWhileStmt(pNode: parser.IParseNode): IAFXStmtInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var isDoWhile: boolean = (pChildren[pChildren.length - 1].value === "do");
			var isNonIfStmt: boolean = (pNode.name === "NonIfStmt") ? true : false;

			var pWhileStmt: instructions.WhileStmtInstruction = new instructions.WhileStmtInstruction();
			var pCondition: IAFXExprInstruction = null;
			var pConditionType: IAFXVariableTypeInstruction = null;
			var pBoolType: IAFXTypeInstruction = Effect.getSystemType("bool");
			var pStmt: IAFXStmtInstruction = null;

			if (isDoWhile) {
				pWhileStmt._setOperator("do_while");
				pCondition = this.analyzeExpr(pChildren[2]);
				pConditionType = <IAFXVariableTypeInstruction>pCondition._getType();

				if (!pConditionType._isEqual(pBoolType)) {
					this._error(EEffectErrors.BAD_DO_WHILE_CONDITION, { typeName: pConditionType.toString() });
					return null;
				}

				pStmt = this.analyzeStmt(pChildren[0]);
			}
			else {
				pWhileStmt._setOperator("while");
				pCondition = this.analyzeExpr(pChildren[2]);
				pConditionType = <IAFXVariableTypeInstruction>pCondition._getType();

				if (!pConditionType._isEqual(pBoolType)) {
					this._error(EEffectErrors.BAD_WHILE_CONDITION, { typeName: pConditionType.toString() });
					return null;
				}

				if (isNonIfStmt) {
					pStmt = this.analyzeNonIfStmt(pChildren[0]);
				}
				else {
					pStmt = this.analyzeStmt(pChildren[0]);
				}

				pWhileStmt._push(pCondition, true);
				pWhileStmt._push(pStmt, true);
			}

			this.checkInstruction(pWhileStmt, ECheckStage.CODE_TARGET_SUPPORT);

			return pWhileStmt;
		}

		private analyzeIfStmt(pNode: parser.IParseNode): IAFXStmtInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var isIfElse: boolean = (pChildren.length === 7);

			var pIfStmtInstruction: instructions.IfStmtInstruction = new instructions.IfStmtInstruction();
			var pCondition: IAFXExprInstruction = this.analyzeExpr(pChildren[pChildren.length - 3]);
			var pConditionType: IAFXVariableTypeInstruction = <IAFXVariableTypeInstruction>pCondition._getType();
			var pBoolType: IAFXTypeInstruction = Effect.getSystemType("bool");

			var pIfStmt: IAFXStmtInstruction = null;
			var pElseStmt: IAFXStmtInstruction = null;

			if (!pConditionType._isEqual(pBoolType)) {
				this._error(EEffectErrors.BAD_IF_CONDITION, { typeName: pConditionType.toString() });
				return null;
			}

			pIfStmtInstruction._push(pCondition, true);

			if (isIfElse) {
				pIfStmtInstruction._setOperator("if_else");
				pIfStmt = this.analyzeNonIfStmt(pChildren[2]);
				pElseStmt = this.analyzeStmt(pChildren[0]);

				pIfStmtInstruction._push(pIfStmt, true);
				pIfStmtInstruction._push(pElseStmt, true);
			}
			else {
				pIfStmtInstruction._setOperator("if");
				pIfStmt = this.analyzeNonIfStmt(pChildren[0]);

				pIfStmtInstruction._push(pIfStmt, true);
			}

			this.checkInstruction(pIfStmtInstruction, ECheckStage.CODE_TARGET_SUPPORT);

			return pIfStmtInstruction;
		}

		private analyzeNonIfStmt(pNode: parser.IParseNode): IAFXStmtInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var sFirstNodeName: string = pChildren[pChildren.length - 1].name;

			switch (sFirstNodeName) {
				case "SimpleStmt":
					return this.analyzeSimpleStmt(pChildren[0]);
				case "T_KW_WHILE":
					return this.analyzeWhileStmt(pNode);
				case "T_KW_FOR":
					return this.analyzeForStmt(pNode);
			}
		}

		private analyzeForStmt(pNode: parser.IParseNode): IAFXStmtInstruction {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var isNonIfStmt: boolean = (pNode.name === "NonIfStmt");
			var pForStmtInstruction: instructions.ForStmtInstruction = new instructions.ForStmtInstruction();
			var pStmt: IAFXStmtInstruction = null;

			this.newScope();

			this.analyzeForInit(pChildren[pChildren.length - 3], pForStmtInstruction);
			this.analyzeForCond(pChildren[pChildren.length - 4], pForStmtInstruction);

			if (pChildren.length === 7) {
				this.analyzeForStep(pChildren[2], pForStmtInstruction);
			}
			else {
				pForStmtInstruction._push(null);
			}


			if (isNonIfStmt) {
				pStmt = this.analyzeNonIfStmt(pChildren[0]);
			}
			else {
				pStmt = this.analyzeStmt(pChildren[0]);
			}

			pForStmtInstruction._push(pStmt, true);

			this.endScope();

			this.checkInstruction(pForStmtInstruction, ECheckStage.CODE_TARGET_SUPPORT);

			return pForStmtInstruction;
		}

		private analyzeForInit(pNode: parser.IParseNode, pForStmtInstruction: instructions.ForStmtInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var sFirstNodeName: string = pChildren[pChildren.length - 1].name;

			switch (sFirstNodeName) {
				case "VariableDecl":
					this.analyzeVariableDecl(pChildren[0], pForStmtInstruction);
					break;
				case "Expr":
					var pExpr: IAFXExprInstruction = this.analyzeExpr(pChildren[0]);
					pForStmtInstruction._push(pExpr, true);
					break;
				default:
					// ForInit : ';'
					pForStmtInstruction._push(null);
					break;
			}

			return;
		}

		private analyzeForCond(pNode: parser.IParseNode, pForStmtInstruction: instructions.ForStmtInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			if (pChildren.length === 1) {
				pForStmtInstruction._push(null);
				return;
			}

			var pConditionExpr: IAFXExprInstruction = this.analyzeExpr(pChildren[1]);

			pForStmtInstruction._push(pConditionExpr, true);
			return;
		}

		private analyzeForStep(pNode: parser.IParseNode, pForStmtInstruction: instructions.ForStmtInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pStepExpr: IAFXExprInstruction = this.analyzeExpr(pChildren[0]);

			pForStmtInstruction._push(pStepExpr, true);

			return;
		}


		private analyzeUseDecl(pNode: parser.IParseNode): void {
			this.setAnalyzedNode(pNode);
			this.setStrictModeOn();
		}

		private analyzeTechniqueForImport(pNode: parser.IParseNode): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var pTechnique: IAFXTechniqueInstruction = new instructions.TechniqueInstruction();
			var sTechniqueName: string = this.analyzeComplexName(pChildren[pChildren.length - 2]);
			var isComplexName: boolean = pChildren[pChildren.length - 2].children.length !== 1;

			pTechnique._setName(sTechniqueName, isComplexName);

			for (var i: uint = pChildren.length - 3; i >= 0; i--) {
				if (pChildren[i].name === "Annotation") {
					var pAnnotation: IAFXAnnotationInstruction = this.analyzeAnnotation(pChildren[i]);
					pTechnique._setAnnotation(pAnnotation);
				}
				else if (pChildren[i].name === "Semantic") {
					var sSemantic: string = this.analyzeSemantic(pChildren[i]);
					pTechnique._setSemantic(sSemantic);
				}
				else {
					this.analyzeTechniqueBodyForImports(pChildren[i], pTechnique);
				}
			}

			this.addTechnique(pTechnique);
		}

		private analyzeComplexName(pNode: parser.IParseNode): string {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var sName: string = "";

			for (var i: uint = pChildren.length - 1; i >= 0; i--) {
				sName += pChildren[i].value;
			}

			return sName;
		}

		private analyzeTechniqueBodyForImports(pNode: parser.IParseNode, pTechnique: IAFXTechniqueInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			for (var i: uint = pChildren.length - 2; i >= 1; i--) {
				this.analyzePassDeclForImports(pChildren[i], pTechnique);
			}
		}

		private analyzePassDeclForImports(pNode: parser.IParseNode, pTechnique: IAFXTechniqueInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			if (pChildren[0].name === "ImportDecl") {
				this.analyzeImportDecl(pChildren[0], pTechnique);
			}
			else if (pChildren.length > 1) {
				var pPass: IAFXPassInstruction = new instructions.PassInstruction();
				//TODO: add annotation and id
				this.analyzePassStateBlockForShaders(pChildren[0], pPass);

				pPass._setParseNode(pNode);

				pTechnique._addPass(pPass);
			}
		}

		private analyzePassStateBlockForShaders(pNode: parser.IParseNode, pPass: IAFXPassInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			for (var i: uint = pChildren.length - 2; i >= 1; i--) {
				this.analyzePassStateForShader(pChildren[i], pPass);
			}
		}

		private analyzePassStateForShader(pNode: parser.IParseNode, pPass: IAFXPassInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			if (pChildren.length === 1) {
				pPass._markAsComplex(true);

				if (pChildren[0].name === "StateIf") {
					this.analyzePassStateIfForShader(pChildren[0], pPass);
				}
				else if (pChildren[0].name === "StateSwitch") {
					this.analyzePassStateSwitchForShader(pChildren[0], pPass);
				}

				return;
			}

			var sType: string = pChildren[pChildren.length - 1].value.toUpperCase();
			var eShaderType: EFunctionType = EFunctionType.k_Vertex;

			if (sType === "VERTEXSHADER") {
				eShaderType = EFunctionType.k_Vertex
			}
			else if (sType === "PIXELSHADER") {
				eShaderType = EFunctionType.k_Pixel;
			}
			else {
				return;
			}

			pNode.isAnalyzed = true;

			var pStateExprNode: parser.IParseNode = pChildren[pChildren.length - 3];
			var pExprNode: parser.IParseNode = pStateExprNode.children[pStateExprNode.children.length - 1];
			var pCompileExpr: instructions.CompileExprInstruction = <instructions.CompileExprInstruction>this.analyzeExpr(pExprNode);
			var pShaderFunc: IAFXFunctionDeclInstruction = pCompileExpr.getFunction();

			if (eShaderType === EFunctionType.k_Vertex) {
				if (!pShaderFunc._checkDefenitionForVertexUsage()) {
					this._error(EEffectErrors.BAD_FUNCTION_VERTEX_DEFENITION, { funcDef: pShaderFunc._getStringDef() });
				}
			}
			else {
				if (!pShaderFunc._checkDefenitionForPixelUsage()) {
					this._error(EEffectErrors.BAD_FUNCTION_PIXEL_DEFENITION, { funcDef: pShaderFunc._getStringDef() });
				}
			}

			pShaderFunc._markUsedAs(eShaderType);

			pPass._addFoundFunction(pNode, pShaderFunc, eShaderType);
		}

		private analyzePassStateIfForShader(pNode: parser.IParseNode, pPass: IAFXPassInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			if (pChildren.length === 5) {
				this.analyzePassStateBlockForShaders(pChildren[0], pPass);
			}
			else if (pChildren.length === 7 && pChildren[0].name === "PassStateBlock") {
				this.analyzePassStateBlockForShaders(pChildren[2], pPass);
				this.analyzePassStateBlockForShaders(pChildren[0], pPass);
			}
			else {
				this.analyzePassStateBlockForShaders(pChildren[2], pPass);
				this.analyzePassStateIfForShader(pChildren[0], pPass);
			}
		}

		private analyzePassStateSwitchForShader(pNode: parser.IParseNode, pPass: IAFXPassInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			this.analyzePassCaseBlockForShader(pChildren[0], pPass);
		}

		private analyzePassCaseBlockForShader(pNode: parser.IParseNode, pPass: IAFXPassInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			for (var i: uint = pChildren.length - 2; i >= 1; i--) {
				if (pChildren[i].name === "CaseState") {
					this.analyzePassCaseStateForShader(pChildren[i], pPass);
				}
				else if (pChildren[i].name === "DefaultState") {
					this.analyzePassDefaultStateForShader(pChildren[i], pPass);
				}
			}
		}

		private analyzePassCaseStateForShader(pNode: parser.IParseNode, pPass: IAFXPassInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			for (var i: uint = pChildren.length - 4; i >= 0; i--) {
				if (pChildren[i].name === "PassState") {
					this.analyzePassStateForShader(pChildren[i], pPass);
				}
			}
		}

		private analyzePassDefaultStateForShader(pNode: parser.IParseNode, pPass: IAFXPassInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			for (var i: uint = pChildren.length - 3; i >= 0; i--) {
				if (pChildren[i].name === "PassState") {
					this.analyzePassStateForShader(pChildren[i], pPass);
				}
			}
		}

		private resumeTechniqueAnalysis(pTechnique: IAFXTechniqueInstruction): void {
			var pPassList: IAFXPassInstruction[] = pTechnique._getPassList();

			for (var i: uint = 0; i < pPassList.length; i++) {
				this.resumePassAnalysis(pPassList[i]);
			}

			if (!pTechnique._checkForCorrectImports()) {
				this._error(EEffectErrors.BAD_TECHNIQUE_IMPORT, { techniqueName: pTechnique._getName() });
				return;
			}

			pTechnique._setGlobalParams(this._sProvideNameSpace, this._pImportedGlobalTechniqueList);
		}

		private resumePassAnalysis(pPass: IAFXPassInstruction): void {
			var pNode: parser.IParseNode = pPass._getParseNode();

			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			this.setCurrentAnalyzedPass(pPass);
			this.setAnalyzeInPass(true);
			this.analyzePassStateBlock(pChildren[0], pPass);
			this.setAnalyzeInPass(false);
			this.setCurrentAnalyzedPass(null);

			pPass._finalizePass();
		}

		private analyzePassStateBlock(pNode: parser.IParseNode, pPass: IAFXPassInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			pPass._addCodeFragment("{");

			for (var i: uint = pChildren.length - 2; i >= 1; i--) {
				this.analyzePassState(pChildren[i], pPass);
			}

			pPass._addCodeFragment("}");
		}

		private analyzePassState(pNode: parser.IParseNode, pPass: IAFXPassInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			if (pChildren.length === 1) {
				if (pChildren[0].name === "StateIf") {
					this.analyzePassStateIf(pChildren[0], pPass);
				}
				else if (pChildren[0].name === "StateSwitch") {
					this.analyzePassStateSwitch(pChildren[0], pPass);
				}

				return;
			}

			if (pNode.isAnalyzed) {
				var pFunc: IAFXFunctionDeclInstruction = pPass._getFoundedFunction(pNode);
				var eShaderType: EFunctionType = pPass._getFoundedFunctionType(pNode);
				var pShader: IAFXFunctionDeclInstruction = null;

				if (eShaderType === EFunctionType.k_Vertex) {
					pShader = pFunc._getVertexShader();
				}
				else {
					pShader = pFunc._getPixelShader();
				}

				pPass._addShader(pShader);
			}
			else {
				var sType: string = pChildren[pChildren.length - 1].value.toUpperCase();
				var eType: ERenderStates = null;
				var pStateExprNode: parser.IParseNode = pChildren[pChildren.length - 3];
				var pExprNode: parser.IParseNode = pStateExprNode.children[pStateExprNode.children.length - 1];

				switch (sType) {
					case "BLENDENABLE":
						eType = ERenderStates.BLENDENABLE;
						break;
					case "CULLFACEENABLE":
						eType = ERenderStates.CULLFACEENABLE;
						break;
					case "ZENABLE":
						eType = ERenderStates.ZENABLE;
						break;
					case "ZWRITEENABLE":
						eType = ERenderStates.ZWRITEENABLE;
						break;
					case "DITHERENABLE":
						eType = ERenderStates.DITHERENABLE;
						break;
					case "SCISSORTESTENABLE":
						eType = ERenderStates.SCISSORTESTENABLE;
						break;
					case "STENCILTESTENABLE":
						eType = ERenderStates.STENCILTESTENABLE;
						break;
					case "POLYGONOFFSETFILLENABLE":
						eType = ERenderStates.POLYGONOFFSETFILLENABLE;
						break;
					case "CULLFACE":
						eType = ERenderStates.CULLFACE;
						break;
					case "FRONTFACE":
						eType = ERenderStates.FRONTFACE;
						break;
					case "SRCBLEND":
						eType = ERenderStates.SRCBLEND;
						break;
					case "DESTBLEND":
						eType = ERenderStates.DESTBLEND;
						break;
					case "ZFUNC":
						eType = ERenderStates.ZFUNC;
						break;
					case "ALPHABLENDENABLE":
						eType = ERenderStates.ALPHABLENDENABLE;
						break;
					case "ALPHATESTENABLE":
						eType = ERenderStates.ALPHATESTENABLE;
						break;

					default:
						logger.warn("Unsupported render state type used: " + sType + ". WebGl...");
						return;
				}

				if (pExprNode.value === "{" || pExprNode.value === "<" ||
					isNull(pExprNode.value)) {
					logger.warn("So pass state are incorrect");
					return;
				}

				var sValue: string = pExprNode.value.toUpperCase();
				var eValue: ERenderStateValues = null;

				switch (eType) {
					case ERenderStates.ALPHABLENDENABLE:
					case ERenderStates.ALPHATESTENABLE:
						logger.warn("ALPHABLENDENABLE/ALPHATESTENABLE not supported in WebGL.");
						return;

					case ERenderStates.BLENDENABLE:
					case ERenderStates.CULLFACEENABLE:
					case ERenderStates.ZENABLE:
					case ERenderStates.ZWRITEENABLE:
					case ERenderStates.DITHERENABLE:
					case ERenderStates.SCISSORTESTENABLE:
					case ERenderStates.STENCILTESTENABLE:
					case ERenderStates.POLYGONOFFSETFILLENABLE:
						switch (sValue) {
							case "TRUE":
								eValue = ERenderStateValues.TRUE;
								break;
							case "FALSE":
								eValue = ERenderStateValues.FALSE;
								break;

							default:
								logger.warn("Unsupported render state ALPHABLENDENABLE/ZENABLE/ZWRITEENABLE/DITHERENABLE value used: "
									+ sValue + ".");
								return;
						}
						break;

					case ERenderStates.CULLFACE:
						switch (sValue) {
							case "FRONT":
								eValue = ERenderStateValues.FRONT;
								break;
							case "BACK":
								eValue = ERenderStateValues.BACK;
								break
							case "FRONT_AND_BACK":
								eValue = ERenderStateValues.FRONT_AND_BACK;
								break;

							default:
								logger.warn("Unsupported render state CULLFACE value used: " + sValue + ".");
								return;
						}
						break;

					case ERenderStates.FRONTFACE:
						switch (sValue) {
							case "CW":
								eValue = ERenderStateValues.CW;
								break;
							case "CCW":
								eValue = ERenderStateValues.CCW;
								break;

							default:
								logger.warn("Unsupported render state SRCBLEND/DESTBLEND value used: " + sValue + ".");
								return;
						}
						break;

					case ERenderStates.SRCBLEND:
					case ERenderStates.DESTBLEND:
						switch (sValue) {
							case "ZERO":
								eValue = ERenderStateValues.ZERO;
								break;
							case "ONE":
								eValue = ERenderStateValues.ONE;
								break;
							case "SRCCOLOR":
								eValue = ERenderStateValues.SRCCOLOR;
								break;
							case "INVSRCCOLOR":
								eValue = ERenderStateValues.INVSRCCOLOR;
								break;
							case "SRCALPHA":
								eValue = ERenderStateValues.SRCALPHA;
								break;
							case "INVSRCALPHA":
								eValue = ERenderStateValues.INVSRCALPHA;
								break;
							case "DESTALPHA":
								eValue = ERenderStateValues.DESTALPHA;
								break;
							case "INVDESTALPHA":
								eValue = ERenderStateValues.INVDESTALPHA;
								break;
							case "DESTCOLOR":
								eValue = ERenderStateValues.DESTCOLOR;
								break;
							case "INVDESTCOLOR":
								eValue = ERenderStateValues.INVDESTCOLOR;
								break;
							case "SRCALPHASAT":
								eValue = ERenderStateValues.SRCALPHASAT;
								break;

							default:
								logger.warn("Unsupported render state SRCBLEND/DESTBLEND value used: " + sValue + ".");
								return;
						}
						break;



					case ERenderStates.ZFUNC:
						switch (sValue) {
							case "NEVER":
								eValue = ERenderStateValues.NEVER;
								break;
							case "LESS":
								eValue = ERenderStateValues.LESS;
								break;
							case "EQUAL":
								eValue = ERenderStateValues.EQUAL;
								break;
							case "LESSEQUAL":
								eValue = ERenderStateValues.LESSEQUAL;
								break;
							case "GREATER":
								eValue = ERenderStateValues.GREATER;
								break;
							case "NOTEQUAL":
								eValue = ERenderStateValues.NOTEQUAL;
								break;
							case "GREATEREQUAL":
								eValue = ERenderStateValues.GREATEREQUAL;
								break;
							case "ALWAYS":
								eValue = ERenderStateValues.ALWAYS;
								break;

							default:
								logger.warn("Unsupported render state ZFUNC value used: " +
									sValue + ".");
								return;
						}
						break;
				}

				pPass._setState(eType, eValue);
			}

		}

		private analyzePassStateIf(pNode: parser.IParseNode, pPass: IAFXPassInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			var pIfExpr: IAFXExprInstruction = this.analyzeExpr(pChildren[pChildren.length - 3]);
			pIfExpr._prepareFor(EFunctionType.k_PassFunction);

			pPass._addCodeFragment("if(" + pIfExpr._toFinalCode() + ")");

			this.analyzePassStateBlock(pChildren[pChildren.length - 5], pPass);

			if (pChildren.length > 5) {
				pPass._addCodeFragment("else");

				if (pChildren[0].name === "PassStateBlock") {
					this.analyzePassStateBlock(pChildren[0], pPass);
				}
				else {
					pPass._addCodeFragment(" ");
					this.analyzePassStateIf(pChildren[0], pPass);
				}
			}
		}

		private analyzePassStateSwitch(pNode: parser.IParseNode, pPass: IAFXPassInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			var sCodeFragment: string = "switch";
			var pSwitchExpr: IAFXExprInstruction = this.analyzeExpr(pChildren[pChildren.length - 3]);
			pSwitchExpr._prepareFor(EFunctionType.k_PassFunction);

			pPass._addCodeFragment("(" + pSwitchExpr._toFinalCode() + ")");

			this.analyzePassCaseBlock(pChildren[0], pPass);
		}

		private analyzePassCaseBlock(pNode: parser.IParseNode, pPass: IAFXPassInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			pPass._addCodeFragment("{");

			for (var i: uint = pChildren.length - 2; i >= 1; i--) {
				if (pChildren[i].name === "CaseState") {
					this.analyzePassCaseState(pChildren[i], pPass);
				}
				else if (pChildren[i].name === "DefaultState") {
					this.analyzePassDefault(pChildren[i], pPass);
				}
			}

			pPass._addCodeFragment("}");
		}

		private analyzePassCaseState(pNode: parser.IParseNode, pPass: IAFXPassInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			var pCaseStateExpr: IAFXExprInstruction = this.analyzeExpr(pChildren[pChildren.length - 2]);
			pCaseStateExpr._prepareFor(EFunctionType.k_PassFunction);

			pPass._addCodeFragment("case " + pCaseStateExpr._toFinalCode() + ": ");

			for (var i: uint = pChildren.length - 4; i >= 0; i--) {
				if (pChildren[i].name === "PassState") {
					this.analyzePassStateForShader(pChildren[i], pPass);
				}
				else {
					pPass._addCodeFragment(pChildren[i].value);
				}
			}
		}

		private analyzePassDefault(pNode: parser.IParseNode, pPass: IAFXPassInstruction): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			pPass._addCodeFragment("default: ");

			for (var i: uint = pChildren.length - 3; i >= 0; i--) {
				if (pChildren[i].name === "PassState") {
					this.analyzePassStateForShader(pChildren[i], pPass);
				}
				else {
					pPass._addCodeFragment(pChildren[i].value);
				}
			}
		}

		private analyzeImportDecl(pNode: parser.IParseNode, pTechnique: IAFXTechniqueInstruction = null): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;
			var sComponentName: string = this.analyzeComplexName(pChildren[pChildren.length - 2]);
			var iShift: int = 0;

			if (pChildren[0].name === "ExtOpt") {
				logger.warn("We don`t suppor ext-commands for import");
			}
			if (pChildren.length !== 2) {
				iShift = this.analyzeShiftOpt(pChildren[0]);
			}

			if (!isNull(pTechnique)) {
				//We can import techniques from the same file, but on this stage they don`t have component yet.
				//So we need special mehanism to add them on more belated stage
				var sShortedComponentName: string = sComponentName;
				if (this._sProvideNameSpace !== "") {
					sShortedComponentName = sComponentName.replace(this._sProvideNameSpace + ".", "");
				}

				var pTechniqueFromSameEffect: IAFXTechniqueInstruction = this._pTechniqueMap[sComponentName] || this._pTechniqueMap[sShortedComponentName];
				if (isDefAndNotNull(pTechniqueFromSameEffect)) {
					pTechnique._addTechniqueFromSameEffect(pTechniqueFromSameEffect, iShift);
					return;
				}
			}

			var pComponent: IAFXComponent = this._pComposer.getComponentByName(sComponentName);
			if (!pComponent) {
				this._error(EEffectErrors.BAD_IMPORTED_COMPONENT_NOT_EXIST, { componentName: sComponentName });
				return;
			}

			this.addComponent(pComponent, iShift, pTechnique);
		}

		private analyzeProvideDecl(pNode: parser.IParseNode): void {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			if (pChildren.length === 2) {
				this._sProvideNameSpace = this.analyzeComplexName(pChildren[0]);
			}
			else {
				this._error(EEffectTempErrors.UNSUPPORTED_PROVIDE_AS);
				return;
			}
		}

		private analyzeShiftOpt(pNode: parser.IParseNode): int {
			this.setAnalyzedNode(pNode);

			var pChildren: parser.IParseNode[] = pNode.children;

			var iShift: int = <int><any>(pChildren[0].value);

			if (pChildren.length === 2) {
				iShift *= 1;
			}
			else {
				iShift *= -1;
			}

			return iShift;
		}

		private addComponent(pComponent: IAFXComponent, iShift: int, pTechnique: IAFXTechniqueInstruction): void {
			if (!isNull(pTechnique)) {
				pTechnique._addComponent(pComponent, iShift);
			}
			else {
				if (isNull(this._pImportedGlobalTechniqueList)) {
					this._pImportedGlobalTechniqueList = [];
				}

				this._pImportedGlobalTechniqueList.push({
					technique: pComponent.getTechnique(),
					component: pComponent,
					shift: iShift
				});
			}

			//TODO: add correct add of compnent, not global

			var pComponentTechnique: IAFXTechniqueInstruction = pComponent.getTechnique();
			if (this.isAddedTechnique(pComponentTechnique)) {
				return;
			}

			var pSharedListV: IAFXVariableDeclInstruction[] = pComponentTechnique._getSharedVariablesForVertex();
			var pSharedListP: IAFXVariableDeclInstruction[] = pComponentTechnique._getSharedVariablesForPixel();

			for (var i: uint = 0; i < pSharedListV.length; i++) {
				this.addExternalSharedVariable(pSharedListV[i], EFunctionType.k_Vertex);
			}

			for (var i: uint = 0; i < pSharedListP.length; i++) {
				this.addExternalSharedVariable(pSharedListP[i], EFunctionType.k_Pixel);
			}

			if (isNull(this._pAddedTechniqueList)) {
				this._pAddedTechniqueList = [];
			}

			this._pAddedTechniqueList.push(pTechnique);
		}

		private isAddedTechnique(pTechnique: IAFXTechniqueInstruction): boolean {
			if (isNull(this._pAddedTechniqueList)) {
				return false;
			}

			for (var i: uint = 0; i < this._pAddedTechniqueList.length; i++) {
				if (this._pAddedTechniqueList[i] === pTechnique) {
					return true;
				}
			}

			return false;
		}



		/**
		 * Проверят возможность использования оператора между двумя типами.
		 * Возращает тип получаемый в результате приминения опрератора, или, если применить его невозможно - null.
		 * 
		 * @sOperator {string} Один из операторов: + - * / % += -= *= /= %= = < > <= >= == != =
		 * @pLeftType {IAFXVariableTypeInstruction} Тип левой части выражения
		 * @pRightType {IAFXVariableTypeInstruction} Тип правой части выражения
		 */
		private checkTwoOperandExprTypes(sOperator: string,
			pLeftType: IAFXVariableTypeInstruction,
			pRightType: IAFXVariableTypeInstruction): IAFXVariableTypeInstruction {
			if (pLeftType._isUnverifiable()) {
				return pLeftType;
			}

			if (pRightType._isUnverifiable()) {
				return pRightType;
			}

			var isComplex: boolean = pLeftType._isComplex() || pRightType._isComplex();
			var isArray: boolean = pLeftType._isNotBaseArray() || pRightType._isNotBaseArray();
			var isSampler: boolean = Effect.isSamplerType(pLeftType) || Effect.isSamplerType(pRightType);
			var pBoolType: IAFXVariableTypeInstruction = Effect.getSystemType("bool").getVariableType();

			if (isArray || isSampler) {
				return null;
			}

			if (sOperator === "%" || sOperator === "%=") {
				return null;
			}

			if (this.isAssignmentOperator(sOperator)) {
				if (!pLeftType._isWritable()) {
					this._error(EEffectErrors.BAD_TYPE_FOR_WRITE);
					return null;
				}

				if (pLeftType._isStrongEqual(Effect.getSystemType("ptr"))) {
					this.addPointerForExtract(pLeftType._getParentVarDecl());
				}

				if (!pRightType._isReadable()) {
					this._error(EEffectErrors.BAD_TYPE_FOR_READ);
					return null;
				}

				if (sOperator !== "=" && !pLeftType._isReadable()) {
					this._error(EEffectErrors.BAD_TYPE_FOR_READ)
				}
			}
			else {
				if (!pLeftType._isReadable()) {
					this._error(EEffectErrors.BAD_TYPE_FOR_READ);
					return null;
				}

				if (!pRightType._isReadable()) {
					this._error(EEffectErrors.BAD_TYPE_FOR_READ);
					return null;
				}
			}

			if (isComplex) {
				if (sOperator === "=" && pLeftType._isEqual(pRightType)) {
					return <IAFXVariableTypeInstruction>pLeftType;
				}
				else if (this.isEqualOperator(sOperator) && !pLeftType._containArray() && !pLeftType._containSampler()) {
					return pBoolType;
				}
				else {
					return null;
				}
			}

			var pReturnType: IAFXVariableTypeInstruction = null;
			var pLeftBaseType: IAFXVariableTypeInstruction = (<instructions.SystemTypeInstruction>pLeftType._getBaseType()).getVariableType();
			var pRightBaseType: IAFXVariableTypeInstruction = (<instructions.SystemTypeInstruction>pRightType._getBaseType()).getVariableType();


			if (pLeftType._isConst() && this.isAssignmentOperator(sOperator)) {
				return null;
			}

			if (pLeftType._isEqual(pRightType)) {
				if (this.isArithmeticalOperator(sOperator)) {
					if (!Effect.isMatrixType(pLeftType) || (sOperator !== "/" && sOperator !== "/=")) {
						return pLeftBaseType;
					}
					else {
						return null;
					}
				}
				else if (this.isRelationalOperator(sOperator)) {
					if (Effect.isScalarType(pLeftType)) {
						return pBoolType;
					}
					else {
						return null;
					}
				}
				else if (this.isEqualOperator(sOperator)) {
					return pBoolType;
				}
				else if (sOperator === "=") {
					return pLeftBaseType;
				}
				else {
					return null;
				}

			}

			if (this.isArithmeticalOperator(sOperator)) {
				if (Effect.isBoolBasedType(pLeftType) || Effect.isBoolBasedType(pRightType) ||
					Effect.isFloatBasedType(pLeftType) !== Effect.isFloatBasedType(pRightType) ||
					Effect.isIntBasedType(pLeftType) !== Effect.isIntBasedType(pRightType)) {
					return null;
				}

				if (Effect.isScalarType(pLeftType)) {
					return pRightBaseType;
				}

				if (Effect.isScalarType(pRightType)) {
					return pLeftBaseType;
				}

				if (sOperator === "*" || sOperator === "*=") {
					if (Effect.isMatrixType(pLeftType) && Effect.isVectorType(pRightType) &&
						pLeftType._getLength() === pRightType._getLength()) {
						return pRightBaseType;
					}
					else if (Effect.isMatrixType(pRightType) && Effect.isVectorType(pLeftType) &&
						pLeftType._getLength() === pRightType._getLength()) {
						return pLeftBaseType;
					}
					else {
						return null;
					}
				}
			}

			return null;
		}

		/**
		 * Проверят возможность использования оператора к типу данных.
		 * Возращает тип получаемый в результате приминения опрератора, или, если применить его невозможно - null.
		 * 
		 * @sOperator {string} Один из операторов: + - ! ++ --
		 * @pLeftType {IAFXVariableTypeInstruction} Тип операнда
		 */
		private checkOneOperandExprType(sOperator: string,
			pType: IAFXVariableTypeInstruction): IAFXVariableTypeInstruction {

			if (pType._isUnverifiable === undefined) {
				debug.log(pType);
			}
			if (pType._isUnverifiable()) {
				return pType;
			}

			var isComplex: boolean = pType._isComplex();
			var isArray: boolean = pType._isNotBaseArray();
			var isSampler: boolean = Effect.isSamplerType(pType);

			if (isComplex || isArray || isSampler) {
				return null;
			}

			if (!pType._isReadable()) {
				this._error(EEffectErrors.BAD_TYPE_FOR_READ);
				return null;
			}


			if (sOperator === "++" || sOperator === "--") {
				if (!pType._isWritable()) {
					this._error(EEffectErrors.BAD_TYPE_FOR_WRITE);
					return null;
				}

				if (pType._isStrongEqual(Effect.getSystemType("ptr"))) {
					this.addPointerForExtract(pType._getParentVarDecl());
				}

				return pType;
			}

			if (sOperator === "!") {
				var pBoolType: IAFXVariableTypeInstruction = Effect.getSystemType("bool").getVariableType();

				if (pType._isEqual(pBoolType)) {
					return pBoolType;
				}
				else {
					return null;
				}
			}
			else {
				if (Effect.isBoolBasedType(pType)) {
					return null;
				}
				else {
					return (<instructions.SystemTypeInstruction>pType._getBaseType()).getVariableType();
				}
			}

			//return null;
		}

		private isAssignmentOperator(sOperator: string): boolean {
			return sOperator === "+=" || sOperator === "-=" ||
				sOperator === "*=" || sOperator === "/=" ||
				sOperator === "%=" || sOperator === "=";
		}

		private isArithmeticalOperator(sOperator: string): boolean {
			return sOperator === "+" || sOperator === "+=" ||
				sOperator === "-" || sOperator === "-=" ||
				sOperator === "*" || sOperator === "*=" ||
				sOperator === "/" || sOperator === "/=";
		}

		private isRelationalOperator(sOperator: string): boolean {
			return sOperator === ">" || sOperator === ">=" ||
				sOperator === "<" || sOperator === "<=";
		}

		private isEqualOperator(sOperator: string): boolean {
			return sOperator === "==" || sOperator === "!=";
		}

		private addExtactionStmts(pStmt: IAFXStmtInstruction): void {
			var pPointerList: IAFXVariableDeclInstruction[] = this.getPointerForExtractList();

			for (var i: uint = 0; i < pPointerList.length; i++) {
				this.generateExtractStmtFromPointer(pPointerList[i], pStmt);
			}

			this.clearPointersForExtract();
		}

		private generateExtractStmtFromPointer(pPointer: IAFXVariableDeclInstruction, pParentStmt: IAFXStmtInstruction): IAFXStmtInstruction {
			var pPointerType: IAFXVariableTypeInstruction = pPointer._getType();
			var pWhatExtracted: IAFXVariableDeclInstruction = pPointerType._getDownPointer();
			var pWhatExtractedType: IAFXVariableTypeInstruction = null;

			var pFunction: IAFXFunctionDeclInstruction = this.getCurrentAnalyzedFunction();

			while (!isNull(pWhatExtracted)) {
				pWhatExtractedType = pWhatExtracted._getType();

				if (!pWhatExtractedType._isComplex()) {
					var pSingleExtract: instructions.ExtractStmtInstruction = new instructions.ExtractStmtInstruction();
					pSingleExtract.generateStmtForBaseType(
						pWhatExtracted,
						pWhatExtractedType._getPointer(),
						pWhatExtractedType._getVideoBuffer(), 0, null);

					this.checkInstruction(pSingleExtract, ECheckStage.CODE_TARGET_SUPPORT);

					pParentStmt._push(pSingleExtract, true);

					if (!isNull(pFunction)) {
						pFunction._addUsedFunction(pSingleExtract.getExtractFunction());
					}
				}
				else {
					this.generateExtractStmtForComplexVar(
						pWhatExtracted, pParentStmt,
						pWhatExtractedType._getPointer(),
						pWhatExtractedType._getVideoBuffer(), 0);
				}

				pWhatExtracted = pWhatExtractedType._getDownPointer();
			}

			return pParentStmt;
		}

		private generateExtractStmtForComplexVar(pVarDecl: IAFXVariableDeclInstruction,
			pParentStmt: IAFXStmtInstruction,
			pPointer: IAFXVariableDeclInstruction,
			pBuffer: IAFXVariableDeclInstruction,
			iPadding: uint): void {
			var pVarType: IAFXVariableTypeInstruction = pVarDecl._getType();
			var pFieldNameList: string[] = pVarType._getFieldNameList();
			var pField: IAFXVariableDeclInstruction = null;
			var pFieldType: IAFXVariableTypeInstruction = null;
			var pSingleExtract: instructions.ExtractStmtInstruction = null;

			var pFunction: IAFXFunctionDeclInstruction = this.getCurrentAnalyzedFunction();

			for (var i: uint = 0; i < pFieldNameList.length; i++) {
				pField = pVarType._getField(pFieldNameList[i]);

				if (isNull(pField)) {
					continue;
				}

				pFieldType = pField._getType();

				if (pFieldType._isPointer()) {
					var pFieldPointer: IAFXVariableDeclInstruction = pFieldType._getMainPointer();
					pSingleExtract = new instructions.ExtractStmtInstruction();
					pSingleExtract.generateStmtForBaseType(pFieldPointer, pPointer, pFieldType._getVideoBuffer(), iPadding + pFieldType._getPadding(), null);

					this.checkInstruction(pSingleExtract, ECheckStage.CODE_TARGET_SUPPORT);

					pParentStmt._push(pSingleExtract, true);
					this.generateExtractStmtFromPointer(pFieldPointer, pParentStmt);

					if (!isNull(pFunction)) {
						pFunction._addUsedFunction(pSingleExtract.getExtractFunction());
					}
				}
				else if (pFieldType._isComplex()) {
					this.generateExtractStmtForComplexVar(pField, pParentStmt, pPointer, pBuffer, iPadding + pFieldType._getPadding());
				}
				else {
					pSingleExtract = new instructions.ExtractStmtInstruction();
					pSingleExtract.generateStmtForBaseType(pField, pPointer, pBuffer, iPadding + pFieldType._getPadding(), null);

					this.checkInstruction(pSingleExtract, ECheckStage.CODE_TARGET_SUPPORT);

					pParentStmt._push(pSingleExtract, true);

					if (!isNull(pFunction)) {
						pFunction._addUsedFunction(pSingleExtract.getExtractFunction());
					}
				}
			}
		}


		private getNodeSourceLocation(pNode: parser.IParseNode): { line: uint; column: uint; } {
			if (isDef(pNode.line)) {
				return { line: pNode.line, column: pNode.start };
			}
			else {
				return this.getNodeSourceLocation(pNode.children[pNode.children.length - 1]);
			}
		}

		private checkInstruction(pInst: IAFXInstruction, eStage: ECheckStage): void {
			if (!pInst._check(eStage)) {
				this._errorFromInstruction(pInst._getLastError());
			}
		}
	}
}
