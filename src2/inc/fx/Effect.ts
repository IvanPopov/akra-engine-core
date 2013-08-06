#ifndef AFXEFFECT_TS
#define AFXEFFECT_TS

#include "IAFXEffect.ts"
#include "IParser.ts"
#include "common.ts"
#include "ILogger.ts"
#include "IAFXInstruction.ts"
#include "fx/Instruction.ts"
#include "fx/TypeInstruction.ts"
#include "fx/VariableInstruction.ts"
#include "fx/FunctionInstruction.ts"
#include "fx/ExprInstruction.ts"
#include "fx/StmtInstruction.ts"
#include "fx/EffectErrors.ts"
#include "fx/EffectUtil.ts"
#include "IAFXComposer.ts"
#include "IAFXComponent.ts"

module akra.fx {

	#define CHECK_INSTRUCTION(inst, stage) if(!inst.check(stage)) { this._errorFromInstruction(inst.getLastError()); }


	
	#define TEMPLATE_TYPE "template"

	export interface SystemTypeMap {
		[sTypeName: string]: SystemTypeInstruction;
	}

	export interface SystemFunctionMap {
		[sFuncName: string]: SystemFunctionInstruction[];
	}

	export interface TechniqueMap {
		[sTechniqueName: string]: IAFXTechniqueInstruction;
	}

	export class Effect implements IAFXEffect {
		private _pComposer: IAFXComposer = null;

		private _pParseTree: IParseTree = null;
		private _pAnalyzedNode: IParseNode = null;

		private _pEffectScope: ProgramScope = null;
		private _pCurrentInstruction: IAFXInstruction = null;
		private _pCurrentFunction: IAFXFunctionDeclInstruction = null;

		private _pStatistics: IAFXEffectStats = null;

		private _sAnalyzedFileName: string = "";

		private _pSystemMacros: IAFXSimpleInstructionMap = null;
		private _pSystemTypes: SystemTypeMap = null;
		private _pSystemFunctionsMap: SystemFunctionMap = null;
		private _pSystemFunctionHashMap: BoolMap = null;
		private _pSystemVariables: IAFXVariableDeclMap = null;

		private _pPointerForExtractionList: IAFXVariableDeclInstruction[] = null;

		private _pFunctionWithImplementationList: IAFXFunctionDeclInstruction[] = null; 
		
		private _pTechniqueList: IAFXTechniqueInstruction[] = null;
		private _pTechniqueMap: TechniqueMap = null;

		private _isAnalyzeInPass: bool = false;

		private _sProvideNameSpace: string = "";

		private _pGlobalComponentList: IAFXComponent[] = null;
		private _pGlobalComponetShiftList: int[] = null;

		private _pAddedTechniqueList: IAFXTechniqueInstruction[] = null;

		static pSystemMacros: IAFXSimpleInstructionMap= null;
		static pSystemTypes: SystemTypeMap = null;
		static pSystemFunctions: SystemFunctionMap = null;
		static pSystemVariables: IAFXVariableDeclMap = null;
		static pSystemVertexOut: ComplexTypeInstruction = null;

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
			this._pTechniqueMap = <TechniqueMap>{};

			this.initSystemMacros();
			this.initSystemTypes();
			this.initSystemFunctions();
			this.initSystemVariables();
		}

		analyze(pTree: IParseTree): bool {
			var pRootNode: IParseNode = pTree.root;
			var iParseTime: uint = akra.now();

			// LOG(this);
			
			this._pParseTree = pTree;
			this._pStatistics = <IAFXEffectStats>{time: 0};

			try{
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
			catch(e){
// #ifdef DEBUG
				throw e;
// #else
				// return false;
// #endif
			}

			//Stats
			iParseTime = akra.now() - iParseTime;
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

		inline getTechniqueList(): IAFXTechniqueInstruction[]{
			return this._pTechniqueList;
		}

		static getBaseVertexOutType(): ComplexTypeInstruction {
			return Effect.pSystemVertexOut;
		}
		static getSystemType(sTypeName: string): SystemTypeInstruction {
        	//bool, string, float and others
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
			var pSystemFunctions: SystemFunctionInstruction[] = Effect.pSystemFunctions[sFunctionName];

			if(!isDef(pSystemFunctions)){
				return null;
			}

			if(isNull(pArguments)) {
				for(var i: uint = 0; i < pSystemFunctions.length; i++){
					if(pSystemFunctions[i].getNumNeededArguments() === 0){
						return pSystemFunctions[i];
					} 
				}
			}

			for(var i: uint = 0; i < pSystemFunctions.length; i++){
				if(pArguments.length !== pSystemFunctions[i].getNumNeededArguments()){
					continue;
				}
				
				var pTestedArguments: IAFXTypedInstruction[] = pSystemFunctions[i].getArguments();

				var isOk: bool = true;

				for(var j: uint = 0; j < pArguments.length; j++){
					isOk = false;

					if(!pArguments[j].getType().isEqual(pTestedArguments[j].getType())){
						break;
					}

					isOk = true;
				}

				if(isOk){
					return pSystemFunctions[i];
				}
			}
		}

		static createVideoBufferVariable(): IAFXVariableDeclInstruction {
			var pBuffer: IAFXVariableDeclInstruction = new VariableDeclInstruction();
			var pBufferType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
			var pBufferName: IAFXIdInstruction = new IdInstruction();

			pBufferType.pushType(Effect.getSystemType("video_buffer"));
			
			pBuffer.push(pBufferType, true);
			pBuffer.push(pBufferName, true);

			return pBuffer;
		}

		static getExternalType(pType: IAFXTypeInstruction): any {
			if (pType.isEqual(Effect.getSystemType("int")) ||
    			pType.isEqual(Effect.getSystemType("float"))) {
    		   	return Number;
    		}
    		else if(pType.isEqual(Effect.getSystemType("bool"))){
    			return Boolean;
    		}
    		else if(pType.isEqual(Effect.getSystemType("float2")) ||
					pType.isEqual(Effect.getSystemType("bool2")) ||
					pType.isEqual(Effect.getSystemType("int2"))){
    			return Vec2;
    		}
    		else if(pType.isEqual(Effect.getSystemType("float3")) ||
					pType.isEqual(Effect.getSystemType("bool3")) ||
					pType.isEqual(Effect.getSystemType("int3"))){
    			return Vec3;
    		}
    		else if(pType.isEqual(Effect.getSystemType("float4")) ||
					pType.isEqual(Effect.getSystemType("bool4")) ||
					pType.isEqual(Effect.getSystemType("int4"))){
    			return Vec4;
    		}
    	// 	else if(pType.isEqual(Effect.getSystemType("float2x2")) ||
					// pType.isEqual(Effect.getSystemType("bool2x2")) ||
					// pType.isEqual(Effect.getSystemType("int2x2"))){
    	// 		return Vec2;
    	// 	}
    		else if(pType.isEqual(Effect.getSystemType("float3x3")) ||
					pType.isEqual(Effect.getSystemType("bool3x3")) ||
					pType.isEqual(Effect.getSystemType("int3x3"))){
    			return Mat3;
    		}
    		else if(pType.isEqual(Effect.getSystemType("float4x4")) ||
					pType.isEqual(Effect.getSystemType("bool4x4")) ||
					pType.isEqual(Effect.getSystemType("int4x4"))){
    			return Mat4;
    		}
    		else {
    			return null;
    		}
		} 

		static isMatrixType(pType: IAFXTypeInstruction): bool {
        	return pType.isEqual(Effect.getSystemType("float2x2")) ||
        		   pType.isEqual(Effect.getSystemType("float3x3")) ||
        		   pType.isEqual(Effect.getSystemType("float4x4")) ||
        		   pType.isEqual(Effect.getSystemType("int2x2")) ||
        		   pType.isEqual(Effect.getSystemType("int3x3")) ||
        		   pType.isEqual(Effect.getSystemType("int4x4")) ||
        		   pType.isEqual(Effect.getSystemType("bool2x2")) ||
        		   pType.isEqual(Effect.getSystemType("bool3x3")) ||
        		   pType.isEqual(Effect.getSystemType("bool4x4"));
        }

        static isVectorType(pType: IAFXTypeInstruction): bool {
        	return pType.isEqual(Effect.getSystemType("float2")) ||
        		   pType.isEqual(Effect.getSystemType("float3")) ||
        		   pType.isEqual(Effect.getSystemType("float4")) ||
        		   pType.isEqual(Effect.getSystemType("bool2")) ||
        		   pType.isEqual(Effect.getSystemType("bool3")) ||
        		   pType.isEqual(Effect.getSystemType("bool4")) ||
        		   pType.isEqual(Effect.getSystemType("int2")) ||
        		   pType.isEqual(Effect.getSystemType("int3")) ||
        		   pType.isEqual(Effect.getSystemType("int4"));
        }

        static isScalarType(pType: IAFXTypeInstruction): bool {
        	return pType.isEqual(Effect.getSystemType("bool")) ||
        		   pType.isEqual(Effect.getSystemType("int")) ||
        		   pType.isEqual(Effect.getSystemType("ptr")) ||
        		   pType.isEqual(Effect.getSystemType("float"));
        }

        static isFloatBasedType(pType: IAFXTypeInstruction): bool {
        	return pType.isEqual(Effect.getSystemType("float")) || 
        		   pType.isEqual(Effect.getSystemType("float2")) || 
        		   pType.isEqual(Effect.getSystemType("float3")) || 
        		   pType.isEqual(Effect.getSystemType("float4")) ||
        		   pType.isEqual(Effect.getSystemType("float2x2")) || 
        		   pType.isEqual(Effect.getSystemType("float3x3")) || 
        		   pType.isEqual(Effect.getSystemType("float4x4")) ||
        		   pType.isEqual(Effect.getSystemType("ptr")); 
        }

        static isIntBasedType(pType: IAFXTypeInstruction): bool {
        	return pType.isEqual(Effect.getSystemType("int")) || 
        		   pType.isEqual(Effect.getSystemType("int2")) || 
        		   pType.isEqual(Effect.getSystemType("int3")) || 
        		   pType.isEqual(Effect.getSystemType("int4")) ||
        		   pType.isEqual(Effect.getSystemType("int2x2")) || 
        		   pType.isEqual(Effect.getSystemType("int3x3")) || 
        		   pType.isEqual(Effect.getSystemType("int4x4"));
        }

        static isBoolBasedType(pType: IAFXTypeInstruction): bool {
        	return pType.isEqual(Effect.getSystemType("bool")) || 
        		   pType.isEqual(Effect.getSystemType("bool2")) || 
        		   pType.isEqual(Effect.getSystemType("bool3")) || 
        		   pType.isEqual(Effect.getSystemType("bool4")) ||
        		   pType.isEqual(Effect.getSystemType("bool2x2")) || 
        		   pType.isEqual(Effect.getSystemType("bool3x3")) || 
        		   pType.isEqual(Effect.getSystemType("bool4x4"));
        }

        static isSamplerType(pType: IAFXTypeInstruction): bool {
        	return pType.isEqual(Effect.getSystemType("sampler")) ||
    		   	   pType.isEqual(Effect.getSystemType("sampler2D")) ||
    		       pType.isEqual(Effect.getSystemType("samplerCUBE")) ||
    		       pType.isEqual(Effect.getSystemType("video_buffer"));
        }

		private generateSuffixLiterals(pLiterals: string[], pOutput: BoolMap, iDepth?: uint = 0): void {
			if(iDepth >= pLiterals.length){
				return;
			}

			if(iDepth === 0){
				for(var i:uint = 0; i < pLiterals.length; i++) {
					pOutput[pLiterals[i]] = true;
				}

				iDepth = 1;
			}

			var pOutputKeys:string[] = Object.keys(pOutput);

			for(var i:uint = 0; i < pLiterals.length; i++) {
				for(var j:uint = 0; j < pOutputKeys.length; j++) {
					if(pOutputKeys[j].indexOf(pLiterals[i]) !== -1){
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
			if(isNull(Effect.pSystemMacros)){
				this._pSystemMacros = Effect.pSystemMacros = <IAFXSimpleInstructionMap>{};
				this.addSystemMacros();
			}

			this._pSystemMacros = Effect.pSystemMacros;
		}

		private initSystemTypes(): void {
			if(isNull(Effect.pSystemTypes)){
				this._pSystemTypes = Effect.pSystemTypes = {};
				this.addSystemTypeScalar();
				this.addSystemTypeVector();
				this.addSystemTypeMatrix();

				this.generateBaseVertexOutput();
			}

			this._pSystemTypes = Effect.pSystemTypes;
		}

		private initSystemFunctions(): void {
			if(isNull(Effect.pSystemFunctions)){
				this._pSystemFunctionsMap = Effect.pSystemFunctions = {};
				this.addSystemFunctions();
			}

			this._pSystemFunctionsMap = Effect.pSystemFunctions;
		}

		private initSystemVariables(): void {
			if(isNull(Effect.pSystemVariables)){
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
			this.generateSystemVariable("fragCoord", "gl_FragCoord", "float4", false, true, true);
			this.generateSystemVariable("frontFacing", "gl_FrontFacing", "bool", false, true, true);
			this.generateSystemVariable("pointCoord", "gl_PointCoord", "float2", false, true, true);
			this.generateSystemVariable("resultAFXColor", "resultAFXColor", "float4", false, true, true);

			//Engine variable for passes
			this.generatePassEngineVariable();
		}

		private generateSystemVariable(sName: string, sRealName: string, sTypeName: string, 
									   isForVertex: bool, isForPixel: bool, isOnlyRead: bool): void {

			if(isDef(this._pSystemVariables[sName])){
				return;
			}

			var pVariableDecl: IAFXVariableDeclInstruction = new VariableDeclInstruction();
			var pName: IAFXIdInstruction = new IdInstruction();
			var pType: IAFXVariableTypeInstruction = new VariableTypeInstruction();

			pName.setName(sName);
			pName.setRealName(sRealName);
			
			pType.pushType(Effect.getSystemType(sTypeName));

			if(isOnlyRead) {
				pType._canWrite(false);
			}

			pVariableDecl._setForVertex(isForVertex);
			pVariableDecl._setForPixel(isForPixel);

			pVariableDecl.push(pType, true);
			pVariableDecl.push(pName, true);

			this._pSystemVariables[sName] = pVariableDecl;

			pVariableDecl.setBuiltIn(true);
		}

		private generatePassEngineVariable(): void {
			var pVariableDecl: IAFXVariableDeclInstruction = new VariableDeclInstruction();
			var pName: IAFXIdInstruction = new IdInstruction();
			var pType: IAFXVariableTypeInstruction = new VariableTypeInstruction();

			pType._canWrite(false);

			pType._markAsUnverifiable(true);
			pName.setName("engine");
			pName.setRealName("engine");

			pVariableDecl.push(pType, true);
			pVariableDecl.push(pName, true);

			this._pSystemVariables["engine"] = pVariableDecl;
		}

		private generateBaseVertexOutput(): void {
			//TODO: fix defenition of this variables
			
			var pOutBasetype: ComplexTypeInstruction = new ComplexTypeInstruction();

			var pPosition: VariableDeclInstruction = new VariableDeclInstruction();
			var pPointSize: VariableDeclInstruction = new VariableDeclInstruction();
			var pPositionType: VariableTypeInstruction = new VariableTypeInstruction();
			var pPointSizeType: VariableTypeInstruction = new VariableTypeInstruction();
			var pPositionId: IdInstruction = new IdInstruction();
			var pPointSizeId: IdInstruction = new IdInstruction();

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

			var pFieldCollector: IAFXInstruction = new InstructionCollector();
			pFieldCollector.push(pPosition, false);
			pFieldCollector.push(pPointSize, false);

			pOutBasetype.addFields(pFieldCollector, true);

			pOutBasetype.setName("VS_OUT");
			pOutBasetype.setRealName("VS_OUT_S");

			Effect.pSystemVertexOut = pOutBasetype;
		}

		private addSystemFunctions(): void {
			this._pSystemFunctionHashMap = <BoolMap>{};

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

		    this.generateNotBuiltInSystemFuction("extractHeader", 
												 "void A_extractTextureHeader(const sampler2D src, out A_TextureHeader texture)",
												 "{vec4 v = texture2D(src, vec2(0.00001)); " +
												 "texture = A_TextureHeader(v.r, v.g, v.b, v.a);}",
												 "void",
												 ["video_buffer_header"], null, ["ExtractMacros"]);

		    this.generateNotBuiltInSystemFuction("extractFloat", 
												 "float A_extractFloat(const sampler2D sampler, const A_TextureHeader header, const float offset)",
												 "{float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " +
												 "float y = floor(pixelNumber / header.width) + .5; " +
												 "float x = mod(pixelNumber, header.width) + .5; " +
												 "int shift = int(mod(offset, A_VB_ELEMENT_SIZE)); " +
												 "\n#ifdef A_VB_COMPONENT4\n" +
												 "if(shift == 0) return A_tex2D(sampler, header, x, y).r; " +
												 "else if(shift == 1) return A_tex2D(sampler, header, x, y).g; " +
												 "else if(shift == 2) return A_tex2D(sampler, header, x, y).b; " +
												 "else if(shift == 3) return A_tex2D(sampler, header, x, y).a; " +
												 "\n#endif\n" +
												 "return 0.;}",
												 "float",
												 ["video_buffer_header"], ["extractHeader"], ["ExtractMacros"]);
			
			this.generateNotBuiltInSystemFuction("extractFloat2", 
												 "vec2 A_extractVec2(const sampler2D sampler, const A_TextureHeader header, const float offset)",
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
												 "\n#endif\n" +
												 "return vec2(0.);}",
												 "float2",
												 ["video_buffer_header"], ["extractHeader"], ["ExtractMacros"]);
			
			this.generateNotBuiltInSystemFuction("extractFloat3", 
												 "vec3 A_extractVec3(const sampler2D sampler, const A_TextureHeader header, const float offset)",
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
												 "\n#endif\n" +
												 "\n#ifdef A_VB_COMPONENT3\n" +
												 "if(shift == 0) return A_tex2D(sampler, header,vec2(x,header.stepY*y)).rgb; " +
												 "else if(shift == 1){ " +
												 "if(x == header.width - 1.) return vec3(A_tex2D(sampler, header, x, y).gb, A_tex2D(sampler, header, 0.5, (y + 1.)).r); " +
												 "else return vec3(A_tex2D(sampler, header, x, y).gb, A_tex2D(sampler, header, (x + 1.), y).r);} " +
												 "else if(shift == 3){ " +
												 "if(x == header.width - 1.) return vec3(A_tex2D(sampler, header, x, y).b, A_tex2D(sampler, header, 0.5, (y + 1.)).rg); " +
												 "else return vec3(A_tex2D(sampler, header, x, y).b, A_tex2D(sampler, header, (x + 1)., y).rg);} " +
												 "\n#endif\n" +
												 "return vec3(0.);}",
												 "float3",
												 ["video_buffer_header"], ["extractHeader"], ["ExtractMacros"]);

			this.generateNotBuiltInSystemFuction("extractFloat4", 
												 "vec4 A_extractVec4(const sampler2D sampler, const A_TextureHeader header, const float offset)",
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
												 "\n#endif\n" +
												 "\n#ifdef A_VB_COMPONENT3\n" +
												 "\n#endif\n" +
												 "return vec4(0.);}",
												 "float4",
												 ["video_buffer_header"], ["extractHeader"], ["ExtractMacros"]);
			
			this.generateNotBuiltInSystemFuction("findPixel", 
												 "vec2 A_findPixel(const A_TextureHeader header, const float offset)",
												 "{float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " +
												 "return vec2(header.stepX * (mod(pixelNumber, header.width) + .5), header.stepY * (floor(pixelNumber / header.width) + .5));}",
												 "float2",
												 ["video_buffer_header"], ["extractHeader"], ["ExtractMacros"]);

			this.generateNotBuiltInSystemFuction("extractFloat4x4", 
												 "mat4 A_extractMat4(const sampler2D sampler, const A_TextureHeader header, const float offset)",
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
									   isForVertex?: bool = true, isForPixel?: bool = true): void {

			var pExprTranslator: ExprTemplateTranslator = new ExprTemplateTranslator(sTranslationExpr);
			var pSystemFunctions: SystemFunctionMap = this._pSystemFunctionsMap;
			var pTypes: IAFXTypeInstruction[] = null;
			var sFunctionHash: string = "";
			var pReturnType: IAFXTypeInstruction = null;
			var pFunction: SystemFunctionInstruction = null;

			if(!isNull(pTemplateTypes)){
				for(var i: uint = 0; i < pTemplateTypes.length; i++) {
					pTypes = [];
					sFunctionHash = sName + "(";
					pReturnType = (sReturnTypeName === TEMPLATE_TYPE) ? 
																Effect.getSystemType(pTemplateTypes[i]) : 
																Effect.getSystemType(sReturnTypeName);

					
					for(var j: uint = 0; j < pArgumentsTypes.length; j++) {
						if(pArgumentsTypes[j] === TEMPLATE_TYPE){
							pTypes.push(Effect.getSystemType(pTemplateTypes[i]));
							sFunctionHash += pTemplateTypes[i] + ",";
						}
						else{
							pTypes.push(Effect.getSystemType(pArgumentsTypes[j]));
							sFunctionHash += pArgumentsTypes[j] + ","
						}
					}						

					sFunctionHash += ")";

					if(this._pSystemFunctionHashMap[sFunctionHash]){
						this._error(EFFECT_BAD_SYSTEM_FUNCTION_REDEFINE, {funcName: sFunctionHash});
					}

					pFunction = new SystemFunctionInstruction(sName, pReturnType, pExprTranslator, pTypes);
				
					if(!isDef(pSystemFunctions[sName])){
						pSystemFunctions[sName] = [];
					}

					pFunction._setForVertex(isForVertex);
					pFunction._setForPixel(isForPixel);

					pSystemFunctions[sName].push(pFunction);
					pFunction.setBuiltIn(true);
				}
			}
			else {

				if(sReturnTypeName === TEMPLATE_TYPE){
					akra.logger.criticalError("Bad return type(TEMPLATE_TYPE) for system function '" + sName +  "'.");
				}

				pReturnType = Effect.getSystemType(sReturnTypeName);
				pTypes = [];
				sFunctionHash = sName + "(";

				for(var i: uint = 0; i < pArgumentsTypes.length; i++){
					if(pArgumentsTypes[i] === TEMPLATE_TYPE){
						akra.logger.criticalError("Bad argument type(TEMPLATE_TYPE) for system function '" + sName +  "'.");
					}
					else{
						pTypes.push(Effect.getSystemType(pArgumentsTypes[i]));
						sFunctionHash += pArgumentsTypes[i] + ",";
					}
				}

				sFunctionHash += ")";
				
				if(this._pSystemFunctionHashMap[sFunctionHash]){
					this._error(EFFECT_BAD_SYSTEM_FUNCTION_REDEFINE, {funcName: sFunctionHash});
				}

				pFunction = new SystemFunctionInstruction(sName, pReturnType, pExprTranslator, pTypes);

				pFunction._setForVertex(isForVertex);
				pFunction._setForPixel(isForPixel);

				if(!isDef(pSystemFunctions[sName])){
					pSystemFunctions[sName] = [];
				}

				pSystemFunctions[sName].push(pFunction);
				pFunction.setBuiltIn(true);
			}

	}

		private generateSystemMacros(sMacrosName: string, sMacrosCode: string): void {
			if(isDef(this._pSystemMacros[sMacrosName])){
				return;
			}

			var pMacros: IAFXSimpleInstruction = new SimpleInstruction(sMacrosCode);

			this._pSystemMacros[sMacrosName] = pMacros;
		}

		private generateNotBuiltInSystemFuction(sName: string, sDefenition: string, sImplementation: string,
												sReturnType: string, 
												pUsedTypes: string[], 
												pUsedFunctions: string[], 
												pUsedMacros: string[]): void {

			if(isDef(this._pSystemFunctionsMap[sName])){
				return;
			}

			var pReturnType: IAFXTypeInstruction = Effect.getSystemType(sReturnType);
			var pFunction: SystemFunctionInstruction = new SystemFunctionInstruction(sName, pReturnType, null, null);

			pFunction.setDeclCode(sDefenition, sImplementation);

			var pUsedExtSystemTypes: IAFXTypeDeclInstruction[] = [];
			var pUsedExtSystemFunctions: IAFXFunctionDeclInstruction[] = [];
			var pUsedExtSystemMacros: IAFXSimpleInstruction[] = [];

			if(!isNull(pUsedTypes)){
				for(var i: uint = 0; i < pUsedTypes.length; i++){
					var pTypeDecl: IAFXTypeDeclInstruction = <IAFXTypeDeclInstruction>Effect.getSystemType(pUsedTypes[i]).getParent();
					if(!isNull(pTypeDecl)){
						pUsedExtSystemTypes.push(pTypeDecl);
					}
				}
			}

			if(!isNull(pUsedMacros)){
				for(var i: uint = 0; i < pUsedMacros.length; i++) {
					pUsedExtSystemMacros.push(Effect.getSystemMacros(pUsedMacros[i]));
				}
			}

			if(!isNull(pUsedFunctions)){
				for(var i: uint = 0; i < pUsedFunctions.length; i++) {
					var pFindFunction: IAFXFunctionDeclInstruction = Effect.findSystemFunction(pUsedFunctions[i], null);
					pUsedExtSystemFunctions.push(pFindFunction);
				}
			}

			pFunction.setUsedSystemData(pUsedExtSystemTypes, pUsedExtSystemFunctions, pUsedExtSystemMacros);
			pFunction.closeSystemDataInfo();
			pFunction.setBuiltIn(false);

			this._pSystemFunctionsMap[sName] = [pFunction];
		}

		private generateSystemType(sName: string, sRealName: string, 
								   iSize: uint = 1, isArray: bool = false, 
								   pElementType: IAFXTypeInstruction = null, iLength: uint = 1
								  ): IAFXTypeInstruction {

			if(isDef(this._pSystemTypes[sName])){
				return null;
			}

			var pSystemType: SystemTypeInstruction = new SystemTypeInstruction();

			pSystemType.setName(sName);
			pSystemType.setRealName(sRealName);
			pSystemType.setSize(iSize);
			if(isArray){
				pSystemType.addIndex(pElementType, iLength);
			}

			this._pSystemTypes[sName] = pSystemType;
			pSystemType.setBuiltIn(true);

			return pSystemType;
		}

		private generateNotBuildtInSystemType(sName: string, sRealName: string, sDeclString: string,
											  iSize: uint = 1, isArray: bool = false, 
								  			  pElementType: IAFXTypeInstruction = null, iLength: uint = 1
								  			 ): IAFXTypeInstruction {

			if(isDef(this._pSystemTypes[sName])){
				return null;
			}

			var pSystemType: SystemTypeInstruction = new SystemTypeInstruction();
			pSystemType.setName(sName);
			pSystemType.setRealName(sRealName);
			pSystemType.setSize(iSize);
			pSystemType.setDeclString(sDeclString);

			if(isArray){
				pSystemType.addIndex(pElementType, iLength);
			}

			this._pSystemTypes[sName] = pSystemType;
			pSystemType.setBuiltIn(false);

			var pSystemTypeDecl: IAFXTypeDeclInstruction = new TypeDeclInstruction();
			pSystemTypeDecl.push(pSystemType, true);
			pSystemTypeDecl.setBuiltIn(false);

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
			var pXYSuffix: BoolMap = <BoolMap>{};
			var pXYZSuffix: BoolMap = <BoolMap>{};
			var pXYZWSuffix: BoolMap = <BoolMap>{};
			
			var pRGSuffix: BoolMap = <BoolMap>{};
			var pRGBSuffix: BoolMap = <BoolMap>{};
			var pRGBASuffix: BoolMap = <BoolMap>{};

			var pSTSuffix: BoolMap = <BoolMap>{};
			var pSTPSuffix: BoolMap = <BoolMap>{};
			var pSTPQSuffix: BoolMap = <BoolMap>{};

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

			this.generateSystemType("float2x2", "mat2",   0, true, pFloat2, 2);
			this.generateSystemType("float2x3", "mat2x3", 0, true, pFloat2, 3);
			this.generateSystemType("float2x4", "mat2x4", 0, true, pFloat2, 4);

			this.generateSystemType("float3x2", "mat3x2", 0, true, pFloat3, 2);
			this.generateSystemType("float3x3", "mat3",   0, true, pFloat3, 3);
			this.generateSystemType("float3x4", "mat3x4", 0, true, pFloat3, 4);

			this.generateSystemType("float4x2", "mat4x2", 0, true, pFloat4, 2);
			this.generateSystemType("float4x3", "mat4x3", 0, true, pFloat4, 3);
			this.generateSystemType("float4x4", "mat4",   0, true, pFloat4, 4);

			this.generateSystemType("int2x2", "imat2",   0, true, pInt2, 2);
			this.generateSystemType("int2x3", "imat2x3", 0, true, pInt2, 3);
			this.generateSystemType("int2x4", "imat2x4", 0, true, pInt2, 4);

			this.generateSystemType("int3x2", "imat3x2", 0, true, pInt3, 2);
			this.generateSystemType("int3x3", "imat3",   0, true, pInt3, 3);
			this.generateSystemType("int3x4", "imat3x4", 0, true, pInt3, 4);

			this.generateSystemType("int4x2", "imat4x2", 0, true, pInt4, 2);
			this.generateSystemType("int4x3", "imat4x3", 0, true, pInt4, 3);
			this.generateSystemType("int4x4", "imat4",   0, true, pInt4, 4);

			this.generateSystemType("bool2x2", "bmat2",   0, true, pBool2, 2);
			this.generateSystemType("bool2x3", "bmat2x3", 0, true, pBool2, 3);
			this.generateSystemType("bool2x4", "bmat2x4", 0, true, pBool2, 4);

			this.generateSystemType("bool3x2", "bmat3x2", 0, true, pBool3, 2);
			this.generateSystemType("bool3x3", "bmat3",   0, true, pBool3, 3);
			this.generateSystemType("bool3x4", "bmat3x4", 0, true, pBool3, 4);

			this.generateSystemType("bool4x2", "bmat4x2", 0, true, pBool4, 2);
			this.generateSystemType("bool4x3", "bmat4x3", 0, true, pBool4, 3);
			this.generateSystemType("bool4x4", "bmat4",   0, true, pBool4, 4);
		}

		private addFieldsToVectorFromSuffixObject(pSuffixMap: BoolMap, pType: IAFXTypeInstruction, sBaseType: string) {
			var sSuffix: string = null;

			for(sSuffix in pSuffixMap){
				var sFieldTypeName: string = sBaseType + ((sSuffix.length > 1) ? sSuffix.length.toString() : "");
				var pFieldType: IAFXTypeInstruction = Effect.getSystemType(sFieldTypeName);

				(<SystemTypeInstruction>pType).addField(sSuffix, pFieldType, pSuffixMap[sSuffix]);
			}
		} 

		private inline getVariable(sName: string): IAFXVariableDeclInstruction {
			return Effect.getSystemVariable(sName) || this._pEffectScope.getVariable(sName);
		}

		private inline hasVariable(sName: string): bool {
			return this._pEffectScope.hasVariable(sName);
		}

		private getType(sTypeName: string): IAFXTypeInstruction {
			return Effect.getSystemType(sTypeName) || this._pEffectScope.getType(sTypeName);
		}

		private isSystemFunction(pFunction: IAFXFunctionDeclInstruction): bool {
			return false;
		}

		private isSystemVariable(pVariable: IAFXVariableDeclInstruction): bool {
			return false;
		}

		private isSystemType(pType: IAFXTypeDeclInstruction): bool {
			return false;
		}

		private inline _errorFromInstruction(pError: IAFXInstructionError): void {
			this._error(pError.code, isNull(pError.info) ? {} : pError.info);
		}

		private _error(eCode: uint, pInfo: IEffectErrorInfo = {}): void {
			var sFileName: string = this._sAnalyzedFileName;

			var pLocation: ISourceLocation = <ISourceLocation>{file: this._sAnalyzedFileName, line: 0};
			var pLineColumn: {line: uint; column: uint;} = this.getNodeSourceLocation(this.getAnalyzedNode());

			switch(eCode){
				default:
					pInfo.line = pLineColumn.line + 1;
					pInfo.column = pLineColumn.column + 1;

					pLocation.line = pLineColumn.line + 1;

					break;
			}

			var pLogEntity: ILoggerEntity = <ILoggerEntity>{code: eCode, info: pInfo, location: pLocation};

			akra.logger["error"](pLogEntity);
			throw new Error(eCode.toString());
		}

		private inline setAnalyzedNode(pNode: IParseNode): void {
			// if(this._pAnalyzedNode !== pNode){
			// 	// debug_print("Analyze node: ", pNode); 
			// 	//.name + (pNode.value ?  " --> value: " + pNode.value + "." : "."));
			// }
			this._pAnalyzedNode = pNode;
		}

		private inline getAnalyzedNode(): IParseNode {
			return this._pAnalyzedNode;
		} 

		private inline isStrictMode(): bool {
			return this._pEffectScope.isStrictMode();
		}

		private inline setStrictModeOn(): void {
			return this._pEffectScope.setStrictModeOn();
		}

		private inline newScope(eScopeType?: EScopeType = EScopeType.k_Default): void {
			this._pEffectScope.newScope(eScopeType);
		}

		private inline resumeScope(): void {
			this._pEffectScope.resumeScope();
		}

		private inline getScope(): uint {
			return this._pEffectScope.getScope();
		}

		private inline setScope(iScope: uint): void {
			this._pEffectScope.setScope(iScope);
		}

		private inline endScope(): void {
			this._pEffectScope.endScope();
		}

		private inline getScopeType(): EScopeType {
			return this._pEffectScope.getScopeType();
		}

		private inline setCurrentAnalyzedFunction(pFunction: IAFXFunctionDeclInstruction): void {
			this._pCurrentFunction = pFunction;
		}

		private inline getCurrentAnalyzedFunction(): IAFXFunctionDeclInstruction {
			return this._pCurrentFunction;
		}

		private inline isAnalzeInPass(): bool {
			return this._isAnalyzeInPass;
		}

		private inline setAnalyzeInPass(isInPass: bool): void {
			this._isAnalyzeInPass = isInPass;
		}

		private inline setOperator(sOperator: string): void {
			if(!isNull(this._pCurrentInstruction)){
				this._pCurrentInstruction.setOperator(sOperator);
			}	
		}

		private inline clearPointersForExtract(): void {
			this._pPointerForExtractionList.length = 0;
		}

		private inline addPointerForExtract(pPointer: IAFXVariableDeclInstruction): void {
			this._pPointerForExtractionList.push(pPointer);
		}

		private inline getPointerForExtractList(): IAFXVariableDeclInstruction[] {
			return this._pPointerForExtractionList;
		}

		private findFunction(sFunctionName: string, 
							 pArguments: IAFXExprInstruction[]): IAFXFunctionDeclInstruction;
		private findFunction(sFunctionName: string, 
							 pArguments: IAFXVariableDeclInstruction[]): IAFXFunctionDeclInstruction;
		private findFunction(sFunctionName: string, 
							 pArguments: IAFXTypedInstruction[]): IAFXFunctionDeclInstruction {
			return Effect.findSystemFunction(sFunctionName, pArguments) ||
				   this._pEffectScope.getFunction(sFunctionName, pArguments);
		}

		private findConstructor(pType: IAFXTypeInstruction, 
							    pArguments: IAFXExprInstruction[]): IAFXVariableTypeInstruction {
			
			var pVariableType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
			pVariableType.pushType(pType);

			return pVariableType;
		}

		private findShaderFunction(sFunctionName: string, 
							 	   pArguments: IAFXExprInstruction[]): IAFXFunctionDeclInstruction {
			return this._pEffectScope.getShaderFunction(sFunctionName, pArguments);
		}

		private findFunctionByDef(pDef: FunctionDefInstruction): IAFXFunctionDeclInstruction {
			return this.findFunction(pDef.getName(), pDef.getArguments());
		}

		// private addVariable(pVariable: IAFXVariable): void {
		// }

		private addVariableDecl(pVariable: IAFXVariableDeclInstruction): void {
			if(this.isSystemVariable(pVariable)){
        		this._error(EFFECT_REDEFINE_SYSTEM_VARIABLE, {varName: pVariable.getName()});
        	}

        	var isVarAdded: bool = this._pEffectScope.addVariable(pVariable);

        	if(!isVarAdded) {
        		var eScopeType: EScopeType = this.getScopeType();

        		switch(eScopeType){
        			case EScopeType.k_Default:
        				this._error(EFFECT_REDEFINE_VARIABLE, {varName: pVariable.getName()});
        				break;
        			case EScopeType.k_Struct:
        				this._error(EFFCCT_BAD_NEW_FIELD_FOR_STRUCT_NAME, {fieldName: pVariable.getName()});
        				break;
        			case EScopeType.k_Annotation:
        				this._error(EFFCCT_BAD_NEW_ANNOTATION_VAR, {varName: pVariable.getName()});
        				break;
        		}
			}

			if(pVariable.getName() === "Out" && !isNull(this.getCurrentAnalyzedFunction())){
        		var isOk: bool = this.getCurrentAnalyzedFunction()._addOutVariable(pVariable);
        		if(!isOk){
        			this._error(EFFECT_BAD_OUT_VARIABLE_IN_FUNCTION);
        		}
        	}
        }

        private addTypeDecl(pType: IAFXTypeDeclInstruction): void {
        	if(this.isSystemType(pType)){
        		this._error(EFFECT_REDEFINE_SYSTEM_TYPE, {typeName: pType.getName()});
        	}

        	var isTypeAdded: bool = this._pEffectScope.addType(pType);

        	if(!isTypeAdded) {
				this._error(EFFECT_REDEFINE_TYPE, {typeName: pType.getName()});
			}
        }

        private addFunctionDecl(pFunction: IAFXFunctionDeclInstruction): void {
        	if(this.isSystemFunction(pFunction)){
        		this._error(EFFECT_REDEFINE_SYSTEM_FUNCTION, {funcName: pFunction.getName()});
        	}

        	var isFunctionAdded: bool = this._pEffectScope.addFunction(pFunction);

        	if(!isFunctionAdded) {
				this._error(EFFECT_REDEFINE_FUNCTION, {funcName: pFunction.getName()});
			}
        }

        private addTechnique(pTechnique: IAFXTechniqueInstruction): void {
        	var sName: string = pTechnique.getName();
        	
        	if(isDef(this._pTechniqueMap[sName])){
        		this._error(EFFECT_BAD_TECHNIQUE_REDEFINE_NAME, { techName: sName });
        		return;
        	}

        	this._pTechniqueMap[sName] = pTechnique;
        	this._pTechniqueList.push(pTechnique);
        }

        private addExternalSharedVariable(pVariable: IAFXVariableDeclInstruction, eShaderType: EFunctionType): void {
        	var isVarAdded: bool = this._pEffectScope.addVariable(pVariable);

        	if(!isVarAdded) {
   				this._error(EFFECT_CANNOT_ADD_SHARED_VARIABLE, {varName: pVariable.getName()});
   				return;
			}
        }


        private analyzeGlobalUseDecls(): void {
        	var pChildren: IParseNode[] = this._pParseTree.root.children;
			var i: uint = 0;	

			for(i = pChildren.length - 1; i >=0; i--) {
				if(pChildren[i].name === "UseDecl") {
					this.analyzeUseDecl(pChildren[i]);
				}
			}
        } 

        private analyzeGlobalProvideDecls(): void {
        	var pChildren: IParseNode[] = this._pParseTree.root.children;
			var i: uint = 0;	

			for(i = pChildren.length - 1; i >=0; i--) {
				if(pChildren[i].name === "ProvideDecl") {
					this.analyzeProvideDecl(pChildren[i]);
				}
			}
        } 

        private analyzeGlobalTypeDecls(): void {
        	var pChildren: IParseNode[] = this._pParseTree.root.children;
			var i: uint = 0;	

			for(i = pChildren.length - 1; i >=0; i--) {
				if(pChildren[i].name === "TypeDecl") {
					this.analyzeTypeDecl(pChildren[i]);
				}
			}
        }

        private analyzeFunctionDefinitions(): void {
        	var pChildren: IParseNode[] = this._pParseTree.root.children;
			var i: uint = 0;	

			for(i = pChildren.length - 1; i >=0; i--) {
				if(pChildren[i].name === "FunctionDecl") {
					this.analyzeFunctionDeclOnlyDefinition(pChildren[i]);
				}
			}
        }

        private analyzeGlobalImports(): void {
        	var pChildren: IParseNode[] = this._pParseTree.root.children;
			var i: uint = 0;	

			for(i = pChildren.length - 1; i >=0; i--) {
				if(pChildren[i].name === "ImportDecl") {
					this.analyzeImportDecl(pChildren[i], null);
				}
			}
        }

        private analyzeTechniqueImports(): void {
        	var pChildren: IParseNode[] = this._pParseTree.root.children;
			var i: uint = 0;	

			for(i = pChildren.length - 1; i >=0; i--) {
				if(pChildren[i].name === "TechniqueDecl") {
					this.analyzeTechniqueForImport(pChildren[i]);
				}
			}
        }

        private analyzeVariableDecls() : void {
        	var pChildren: IParseNode[] = this._pParseTree.root.children;
			var i: uint = 0;	

			for(i = pChildren.length - 1; i >=0; i--) {
				if(pChildren[i].name === "VariableDecl") {
					this.analyzeVariableDecl(pChildren[i]);
				}
				else if(pChildren[i].name === "VarStructDecl"){
					this.analyzeVarStructDecl(pChildren[i]);
				}
			}
        }

        private analyzeFunctionDecls(): void {
        	for(var i: uint = 0; i < this._pFunctionWithImplementationList.length; i++) {
        		this.resumeFunctionAnalysis(this._pFunctionWithImplementationList[i]);
        	}

        	this.checkFunctionsForRecursion();
        	this.checkFunctionForCorrectUsage();
        	this.generateInfoAboutUsedData();
        	this.generateShadersFromFunctions();
        }

        private analyzeTechniques(): void {
        	for(var i: uint = 0; i < this._pTechniqueList.length; i++) {
        		this.resumeTechniqueAnalysis(this._pTechniqueList[i]);
        	}
        }

        private checkFunctionsForRecursion(): void {
        	var pFunctionList: IAFXFunctionDeclInstruction[] = this._pFunctionWithImplementationList;
        	var isNewAdd: bool = true;
        	var isNewDelete: bool = true;

        	while(isNewAdd || isNewDelete) {
        		isNewAdd = false;
        		isNewDelete = false;

        		mainFor:
        		for(var i: uint = 0; i < pFunctionList.length; i++){
        			var pTestedFunction: IAFXFunctionDeclInstruction = pFunctionList[i];
        			var pUsedFunctionList: IAFXFunctionDeclInstruction[] = pTestedFunction._getUsedFunctionList();

        			if(!pTestedFunction._isUsed()){
        				//WARNING("Unused function '" + pTestedFunction._getStringDef() + "'.");
        				continue mainFor;
        			}
        			if(pTestedFunction._isBlackListFunction()){
        				continue mainFor;
        			}

        			if(isNull(pUsedFunctionList)){
        				continue mainFor;
        			}

        			for(var j: uint = 0; j < pUsedFunctionList.length; j++) {
        				var pAddedUsedFunctionList: IAFXFunctionDeclInstruction[] = pUsedFunctionList[j]._getUsedFunctionList();
        				
        				if(isNull(pAddedUsedFunctionList)){
        					continue;
        				}

        				for(var k: uint = 0; k < pAddedUsedFunctionList.length; k++) {
        					var pAddedFunction: IAFXFunctionDeclInstruction = pAddedUsedFunctionList[k];

        					if(pTestedFunction === pAddedFunction){
        						pTestedFunction._addToBlackList();
        						isNewDelete = true;
        						this._error(EFFECT_BAD_FUNCTION_USAGE_RECURSION, { funcDef: pTestedFunction._getStringDef() });
        						continue mainFor;
        					}

        					if (pAddedFunction._isBlackListFunction() ||
        						!pAddedFunction._canUsedAsFunction()){
        						pTestedFunction._addToBlackList();
        						this._error(EFFECT_BAD_FUNCTION_USAGE_BLACKLIST, { funcDef: pTestedFunction._getStringDef() });
        						isNewDelete = true;
        						continue mainFor;
        					}

        					if(pTestedFunction._addUsedFunction(pAddedFunction)){
        						isNewAdd = true;
        					}
        				}
        			} 
        		}
        	}
        }

        private checkFunctionForCorrectUsage(): void {
        	var pFunctionList: IAFXFunctionDeclInstruction[] = this._pFunctionWithImplementationList;
        	var isNewUsageSet: bool = true;
        	var isNewDelete: bool = true;

        	while(isNewUsageSet || isNewDelete){
        		isNewUsageSet = false;
        		isNewDelete = false;

        		mainFor:
        		for(var i: uint = 0; i < pFunctionList.length; i++) {
        			var pTestedFunction: IAFXFunctionDeclInstruction = pFunctionList[i];
        			var pUsedFunctionList: IAFXFunctionDeclInstruction[] = pTestedFunction._getUsedFunctionList();

        			if(!pTestedFunction._isUsed()){
        				//WARNING("Unused function '" + pTestedFunction._getStringDef() + "'.");
        				continue mainFor;
        			}
        			if(pTestedFunction._isBlackListFunction()){
        				continue mainFor;
        			}

        			if(!pTestedFunction._checkVertexUsage()){
        				this._error(EFFECT_BAD_FUNCTION_USAGE_VERTEX, { funcDef: pTestedFunction._getStringDef() });
        				pTestedFunction._addToBlackList();
        				isNewDelete = true;
        				continue mainFor;
        			}

        			if(!pTestedFunction._checkPixelUsage()){
        				this._error(EFFECT_BAD_FUNCTION_USAGE_PIXEL, { funcDef: pTestedFunction._getStringDef() });
        				pTestedFunction._addToBlackList();
        				isNewDelete = true;
        				continue mainFor;
        			}

        			if(isNull(pUsedFunctionList)){
        				continue mainFor;
        			}

        			for(var j: uint = 0; j < pUsedFunctionList.length; j++) {
        				var pUsedFunction: IAFXFunctionDeclInstruction = pUsedFunctionList[j];
        				
        				if(pTestedFunction._isUsedInVertex()){
        					if(!pUsedFunction._isForVertex()){
        						this._error(EFFECT_BAD_FUNCTION_USAGE_VERTEX, { funcDef: pTestedFunction._getStringDef() });
		        				pTestedFunction._addToBlackList();
		        				isNewDelete = true;
		        				continue mainFor;
        					}

        					if(!pUsedFunction._isUsedInVertex()){
	        					pUsedFunction._markUsedInVertex();        						
        						isNewUsageSet = true;
        					}

        				}	

        				if(pTestedFunction._isUsedInPixel()){
        					if(!pUsedFunction._isForPixel()){
        						this._error(EFFECT_BAD_FUNCTION_USAGE_PIXEL, { funcDef: pTestedFunction._getStringDef() });
		        				pTestedFunction._addToBlackList();
		        				isNewDelete = true;
		        				continue mainFor;
        					}

        					if(!pUsedFunction._isUsedInPixel()){
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

        	for(var i: uint = 0; i < pFunctionList.length; i++){
        		pFunctionList[i]._generateInfoAboutUsedData();
        	}
        }

        private generateShadersFromFunctions(): void {
        	var pFunctionList: IAFXFunctionDeclInstruction[] = this._pFunctionWithImplementationList;

        	for(var i: uint = 0; i < pFunctionList.length; i++){
        		var pShader: IAFXFunctionDeclInstruction = null;

        		if(pFunctionList[i]._isUsedAsVertex()){
        			pShader = pFunctionList[i]._convertToVertexShader();
        		}
        		if(pFunctionList[i]._isUsedAsPixel()){
        			pShader = pFunctionList[i]._convertToPixelShader();
        		}
        	}
        }

		private analyzeVariableDecl(pNode: IParseNode, pInstruction?: IAFXInstruction = null): void {
			this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pGeneralType: IAFXVariableTypeInstruction = null;
        	var pVariable: IAFXVariableDeclInstruction = null;
        	var i: uint = 0;
        	
        	pGeneralType = this.analyzeUsageType(pChildren[pChildren.length - 1]);

        	for(i = pChildren.length - 2; i >= 1; i--){
        		if(pChildren[i].name === "Variable") {
        			pVariable = this.analyzeVariable(pChildren[i], pGeneralType);

        			if(!isNull(pInstruction)){
        				pInstruction.push(pVariable, true);
        				if(pInstruction._getInstructionType() === EAFXInstructionTypes.k_DeclStmtInstruction) {
	        				var pVariableSubDecls: IAFXVariableDeclInstruction[] = pVariable.getSubVarDecls();
	        				if(!isNull(pVariableSubDecls)){
		        				for(var j: uint = 0; j < pVariableSubDecls.length; j++) {
		        					pInstruction.push(pVariableSubDecls[j], false);
		        				}        				
	        				}
	        			}
        			}
        		}
        	}
        }

      	private analyzeUsageType(pNode: IParseNode): IAFXVariableTypeInstruction {
      		this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
		    var i: uint = 0;
		    var pType: IAFXVariableTypeInstruction = new VariableTypeInstruction();

		    for (i = pChildren.length - 1; i >= 0; i--) {
		        if (pChildren[i].name === "Type") {
		        	var pMainType: IAFXTypeInstruction = this.analyzeType(pChildren[i]);
		        	pType.pushType(pMainType);
		        }
		        else if (pChildren[i].name === "Usage") {
		        	var sUsage: string = this.analyzeUsage(pChildren[i]);
		        	pType.addUsage(sUsage);
		        }
		    }

		    CHECK_INSTRUCTION(pType, ECheckStage.CODE_TARGET_SUPPORT);

		    return pType;
        }

        private analyzeType(pNode: IParseNode): IAFXTypeInstruction {
        	this.setAnalyzedNode(pNode);
        	
        	var pChildren: IParseNode[] = pNode.children;
        	var pType: IAFXTypeInstruction = null;

        	switch(pNode.name){
        		case "T_TYPE_ID":
        			pType = this.getType(pNode.value);

			        if (isNull(pType)) {
			            this._error(EFFECT_BAD_TYPE_NAME_NOT_TYPE, { typeName: pNode.value });
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
			            this._error(EFFECT_BAD_TYPE_NAME_NOT_TYPE, { typeName: pChildren[pChildren.length - 1].value });
			        }

			       	break;

			    case "VectorType":
			    case "MatrixType":
			    	this._error(EFFECT_BAD_TYPE_VECTOR_MATRIX);
			    	break;

			   	case "BaseType":
			   	case "Type":
			   		return this.analyzeType(pChildren[0]);
        	}

        	return pType;
        }

        private analyzeUsage(pNode: IParseNode): string {
        	this.setAnalyzedNode(pNode);
      		
        	pNode = pNode.children[0];
        	return pNode.value;
        }

        private analyzeVariable(pNode: IParseNode, pGeneralType: IAFXVariableTypeInstruction): IAFXVariableDeclInstruction {
        	this.setAnalyzedNode(pNode);
      		
        	var pChildren: IParseNode[] = pNode.children;

        	var pVarDecl: IAFXVariableDeclInstruction = new VariableDeclInstruction();
        	var pVariableType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
        	var pAnnotation: IAFXAnnotationInstruction = null;
        	var sSemantic: string = "";
        	var pInitExpr: IAFXInitExprInstruction = null;
			
        	pVarDecl.push(pVariableType, true);       	
        	pVariableType.pushType(pGeneralType);
        	pVarDecl._setScope(this.getScope());
        	
        	this.analyzeVariableDim(pChildren[pChildren.length - 1], pVarDecl);
        	
        	var i: uint = 0;
        	for(i = pChildren.length - 2; i >= 0; i--){
        		if(pChildren[i].name === "Annotation"){
        			pAnnotation = this.analyzeAnnotation(pChildren[i]);
        			pVarDecl.setAnnotation(pAnnotation);
        		}
        		else if(pChildren[i].name === "Semantic"){
        			sSemantic = this.analyzeSemantic(pChildren[i]);
        			pVarDecl.setSemantic(sSemantic);
        			pVarDecl.getNameId().setRealName(sSemantic);
        		}
        		else if(pChildren[i].name === "Initializer"){
        			pInitExpr = this.analyzeInitializer(pChildren[i]);
        			if(!pInitExpr.optimizeForVariableType(pVariableType)){
        				this._error(EFFECT_BAD_VARIABLE_INITIALIZER, { varName: pVarDecl.getName() });
        				return null;
        			}
        			pVarDecl.push(pInitExpr, true);
        		}
        	}

        	CHECK_INSTRUCTION(pVarDecl, ECheckStage.CODE_TARGET_SUPPORT);

        	this.addVariableDecl(pVarDecl);

        	return pVarDecl;
        }

        private analyzeVariableDim(pNode: IParseNode, pVariableDecl: IAFXVariableDeclInstruction): void {
			this.setAnalyzedNode(pNode);
      		
			var pChildren: IParseNode[] = pNode.children;
			var pVariableType: IAFXVariableTypeInstruction = <IAFXVariableTypeInstruction>pVariableDecl.getType();

			if(pChildren.length === 1) {
				var pName: IAFXIdInstruction = new IdInstruction();
				pName.setName(pChildren[0].value);
				pVariableDecl.push(pName, true);
				return;
			}
			
			this.analyzeVariableDim(pChildren[pChildren.length - 1], pVariableDecl);
			
			if(pChildren.length === 3) {
				pVariableType.addPointIndex(true);
			}
			else if(pChildren.length === 4 && pChildren[0].name === "FromExpr"){

				var pBuffer: IAFXVariableDeclInstruction = this.analyzeFromExpr(pChildren[0]);
				pVariableType.addPointIndex(true);
				pVariableType.setVideoBuffer(pBuffer);
			}
			else {
				if(pVariableType.isPointer()){
					//TODO: add support for v[][10]
					this._error(TEMP_EFFECT_BAD_ARRAY_OF_POINTERS);
				}

				var pIndexExpr: IAFXExprInstruction = this.analyzeExpr(pChildren[pChildren.length - 3]);
				pVariableType.addArrayIndex(pIndexExpr);	
			}
        }

        private analyzeAnnotation(pNode:IParseNode): IAFXAnnotationInstruction {
        	this.setAnalyzedNode(pNode);
      		
        	return null;
        }

        private analyzeSemantic(pNode:IParseNode): string {
        	this.setAnalyzedNode(pNode);
      		
        	var sSemantic: string = pNode.children[0].value;
			// var pDecl: IAFXDeclInstruction = <IAFXDeclInstruction>this._pCurrentInstruction;
			// pDecl.setSemantic(sSemantic);	
			return sSemantic;
        }

        private analyzeInitializer(pNode:IParseNode): IAFXInitExprInstruction {     
        	this.setAnalyzedNode(pNode);
      		
      		var pChildren: IParseNode[] = pNode.children;
      		var pInitExpr: IAFXInitExprInstruction = new InitExprInstruction();
      		
      		if(pChildren.length === 2){
      			pInitExpr.push(this.analyzeExpr(pChildren[0]), true);
      		}
      		else {
	      		for(var i: uint = pChildren.length - 3; i >=1; i--){
	      			if(pChildren[i].name === "InitExpr"){
	      				pInitExpr.push(this.analyzeInitExpr(pChildren[i]), true);
	      			}
	      		}
	      	}

      		return pInitExpr;
        }

        private analyzeFromExpr(pNode: IParseNode): IAFXVariableDeclInstruction {
        	this.setAnalyzedNode(pNode);
        	
        	var pChildren: IParseNode[] = pNode.children;
        	var pBuffer: IAFXVariableDeclInstruction = null;

        	if(pChildren[1].name === "T_NON_TYPE_ID"){
        		pBuffer = this.getVariable(pChildren[1].value);
        	}
        	else {
        		pBuffer = (<MemExprInstruction>this.analyzeMemExpr(pChildren[1])).getBuffer();
        	}

        	return pBuffer;	
        }

        private analyzeInitExpr(pNode:IParseNode): IAFXInitExprInstruction {     
        	this.setAnalyzedNode(pNode);
      		
      		var pChildren: IParseNode[] = pNode.children;
      		var pInitExpr: IAFXInitExprInstruction = new InitExprInstruction();
      		
      		if(pChildren.length === 1){
      			pInitExpr.push(this.analyzeExpr(pChildren[0]), true);
      		}
      		else{
      			for(var i: uint = 0; i < pChildren.length; i++){
      				if(pChildren[i].name === "InitExpr"){
      					pInitExpr.push(this.analyzeInitExpr(pChildren[i]), true);
      				}
      			}
      		}

      		return pInitExpr;
      	}

        private analyzeExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);
        	var sName: string = pNode.name;
        	
        	switch(sName){
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
		       		this._error(EFFECT_UNSUPPORTED_EXPR, { exprName: sName });
		       		break;
        	}

       		return null;	
        }

        private analyzeObjectExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var sName: string = pNode.children[pNode.children.length - 1].name;
        	
        	switch(sName){
        		case "T_KW_COMPILE":
        			return this.analyzeCompileExpr(pNode);
        		case "T_KW_SAMPLER_STATE":
        			return this.analyzeSamplerStateBlock(pNode);
        	}
        }

        private analyzeCompileExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pExpr: CompileExprInstruction = new CompileExprInstruction();
        	var pExprType: IAFXVariableTypeInstruction;
        	var pArguments: IAFXExprInstruction[] = null;
        	var sShaderFuncName: string = pChildren[pChildren.length - 2].value;
        	var pShaderFunc: IAFXFunctionDeclInstruction = null;
        	var i: uint = 0;

        	pArguments = [];

        	if(pChildren.length > 4){
        		var pArgumentExpr: IAFXExprInstruction;

        		for(i = pChildren.length - 3; i > 0; i--) {
        			if(pChildren[i].value !== ","){
        				pArgumentExpr = this.analyzeExpr(pChildren[i]);
        				pArguments.push(pArgumentExpr);
        			}
        		}	
        	}

        	pShaderFunc = this.findShaderFunction(sShaderFuncName, pArguments);

        	if(isNull(pShaderFunc)){
        		this._error(EFFECT_BAD_COMPILE_NOT_FUNCTION, { funcName: sShaderFuncName });
        		return null;
        	}

        	pExprType = (<IAFXVariableTypeInstruction>pShaderFunc.getType()).wrap();

        	pExpr.setType(pExprType);
        	pExpr.setOperator("complile");
        	pExpr.push(pShaderFunc.getNameId(), false);
        	
        	if(!isNull(pArguments)){
        		for(i = 0; i < pArguments.length; i++) {
        			pExpr.push(pArguments[i], true);
        		}
        	}

        	CHECK_INSTRUCTION(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

        	return pExpr;
        }

        private analyzeSamplerStateBlock(pNode: IParseNode): IAFXExprInstruction {
        	pNode = pNode.children[0];
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pExpr: SamplerStateBlockInstruction = new SamplerStateBlockInstruction();
        	var i: uint = 0;

        	pExpr.setOperator("sample_state");

        	for(i = pChildren.length - 2; i >= 1; i--){
        		this.analyzeSamplerState(pChildren[i], pExpr);
        	}

        	CHECK_INSTRUCTION(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

        	return pExpr;	
        }

        private analyzeSamplerState(pNode: IParseNode, pSamplerStates: SamplerStateBlockInstruction): void {
        	this.setAnalyzedNode(pNode);
      		
      		var pChildren: IParseNode[] = pNode.children;
      		if(pChildren[pChildren.length - 2].name === "StateIndex"){
      			this._error(EFFECT_NOT_SUPPORT_STATE_INDEX);
      			return;
      		}

      		var pStateExprNode: IParseNode = pChildren[pChildren.length - 3];
      		var pSubStateExprNode: IParseNode = pStateExprNode.children[pStateExprNode.children.length - 1];
      		var sStateType: string = pChildren[pChildren.length - 1].value.toUpperCase();
      		var sStateValue: string = "";
      		var isTexture: bool = false;

      		if(isNull(pSubStateExprNode.value)){
        		this._error(EFFECT_BAD_TEXTURE_FOR_SAMLER);
  				return;
        	}
        	var pTexture: IAFXVariableDeclInstruction = null;

      		switch (sStateType) {
		        case "TEXTURE":
		            var pTexture: IAFXVariableDeclInstruction = null;
	      			if(pStateExprNode.children.length !== 3 || pSubStateExprNode.value === "{"){
	      				this._error(EFFECT_BAD_TEXTURE_FOR_SAMLER);
	      				return;
	      			}
	      			var sTextureName: string = pStateExprNode.children[1].value;
	      			if(isNull(sTextureName) || !this.hasVariable(sTextureName)){
	      				this._error(EFFECT_BAD_TEXTURE_FOR_SAMLER);
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
		                    WARNING("Webgl don`t support this wrapmode: " + sStateValue);
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
		                    WARNING("Webgl don`t support this texture filter: " + sStateValue);
		                    return;
		            }
            		break;

		        default:
		            WARNING("Don`t support this texture param: " + sStateType);
		            return;
		    }

		    if(sStateType !== "TEXTURE") {
		    	pSamplerStates.addState(sStateType, sStateValue);
		    }
		    else {
		    	pSamplerStates.setTexture(pTexture);
		    }
        }

        private analyzeComplexExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var sFirstNodeName: string = pChildren[pChildren.length - 1].name;

        	switch(sFirstNodeName){
        		case "T_NON_TYPE_ID":
        			return this.analyzeFunctionCallExpr(pNode);
        		case "BaseType":
        		case "T_TYPE_ID":
        			return this.analyzeConstructorCallExpr(pNode);
        		default:
        			return this.analyzeSimpleComplexExpr(pNode);
        	}
        }

        private analyzeFunctionCallExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pExpr: IAFXExprInstruction = null;
        	var pExprType: IAFXVariableTypeInstruction = null;
        	var pArguments: IAFXExprInstruction[] = null;
        	var sFuncName: string = pChildren[pChildren.length - 1].value;
        	var pFunction: IAFXFunctionDeclInstruction = null;
        	var pFunctionId: IAFXIdExprInstruction = null;
        	var i: uint = 0;
        	var pCurrentAnalyzedFunction: IAFXFunctionDeclInstruction = this.getCurrentAnalyzedFunction();

        	if(pChildren.length > 3){        		
        		var pArgumentExpr: IAFXExprInstruction;

        		pArguments = [];

        		for(i = pChildren.length - 3; i > 0; i--) {
        			if(pChildren[i].value !== ","){
        				pArgumentExpr = this.analyzeExpr(pChildren[i]);
        				pArguments.push(pArgumentExpr);
        			}
        		}
        	}

        	pFunction = this.findFunction(sFuncName, pArguments);

        	if(isNull(pFunction)){
        		this._error(EFFECT_BAD_COMPLEX_NOT_FUNCTION, { funcName: sFuncName });
        		return null;
        	}

        	if(!isDef(pFunction)){
        		this._error(EFFECT_BAD_CANNOT_CHOOSE_FUNCTION, {funcName: sFuncName });
        		return null;
        	}

        	if(!isNull(pCurrentAnalyzedFunction)){
        		if(!pFunction._isForPixel()) {
        			pCurrentAnalyzedFunction._setForPixel(false);
        		}

        		if(!pFunction._isForVertex()) {
        			pCurrentAnalyzedFunction._setForVertex(false);
        		}
        	}

        	if(pFunction._getInstructionType() === EAFXInstructionTypes.k_FunctionDeclInstruction){
        		var pFunctionCallExpr: FunctionCallInstruction = new FunctionCallInstruction();
	        	
	        	pFunctionId = new IdExprInstruction();
	        	pFunctionId.push(pFunction.getNameId(), false);

	        	pExprType = (<IAFXVariableTypeInstruction>pFunction.getType()).wrap();

	        	pFunctionCallExpr.setType(pExprType);
	        	pFunctionCallExpr.push(pFunctionId, true);
	        	
	        	if(!isNull(pArguments)){
	        		for(i = 0; i < pArguments.length; i++) {
	        			pFunctionCallExpr.push(pArguments[i], true);
	        		}

	        		var pFunctionArguments: IAFXVariableDeclInstruction[] = (<FunctionDeclInstruction>pFunction).getArguments();
		        	for(i = 0; i < pArguments.length; i++){
	        			if(pFunctionArguments[i].getType().hasUsage("out")){
	        				if(!pArguments[i].getType().isWritable()){
	        					this._error(EFFECT_BAD_TYPE_FOR_WRITE);
	        					return null;
	        				}

	        				if(pArguments[i].getType().isStrongEqual(Effect.getSystemType("ptr"))){
	        					this.addPointerForExtract(pArguments[i].getType()._getParentVarDecl());
	        				}
	        			}
	        			else if(pFunctionArguments[i].getType().hasUsage("inout")){
	        				if(!pArguments[i].getType().isWritable()){
	        					this._error(EFFECT_BAD_TYPE_FOR_WRITE);
	        					return null;
	        				}

							if(!pArguments[i].getType().isReadable()){
	        					this._error(EFFECT_BAD_TYPE_FOR_READ);
	        					return null;
	        				}

	        				if(pArguments[i].getType().isStrongEqual(Effect.getSystemType("ptr"))){
	        					this.addPointerForExtract(pArguments[i].getType()._getParentVarDecl());
	        				}
	        			}
	        			else {
	        				if(!pArguments[i].getType().isReadable()){
	        					this._error(EFFECT_BAD_TYPE_FOR_READ);
	        					return null;
	        				}
	        			}
	        		}

	        		for(i = pArguments.length; i < pFunctionArguments.length; i++){
	        			pFunctionCallExpr.push(pFunctionArguments[i].getInitializeExpr(), false);
	        		}
	        		
	        	}

	        	if(!isNull(pCurrentAnalyzedFunction)){
	        		pCurrentAnalyzedFunction._addUsedFunction(pFunction);
	        	}

	        	pFunction._markUsedAs(EFunctionType.k_Function);

	        	pExpr = pFunctionCallExpr;
        	}
        	else {
        		var pSystemCallExpr: SystemCallInstruction = new SystemCallInstruction();

        		pSystemCallExpr.setSystemCallFunction(pFunction);
        		pSystemCallExpr.fillByArguments(pArguments);

        		if(!isNull(pCurrentAnalyzedFunction)){
        			for(i = 0; i < pArguments.length; i++){
        				if(!pArguments[i].getType().isReadable()) {
        					this._error(EFFECT_BAD_TYPE_FOR_READ);
        					return null;
        				}
        			}
        		}

        		pExpr = pSystemCallExpr;

        		if(!pFunction.isBuiltIn() && !isNull(pCurrentAnalyzedFunction)){
        			pCurrentAnalyzedFunction._addUsedFunction(pFunction);
        		}
        	}

        	CHECK_INSTRUCTION(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

        	return pExpr;
        }
        
        private analyzeConstructorCallExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pExpr: ConstructorCallInstruction = new ConstructorCallInstruction();
        	var pExprType: IAFXVariableTypeInstruction = null;
        	var pArguments: IAFXExprInstruction[] = null;
        	var pConstructorType: IAFXTypeInstruction = null;
        	var i: uint = 0;

        	pConstructorType = this.analyzeType(pChildren[pChildren.length - 1]);

        	if(isNull(pConstructorType)){
        		this._error(EFFECT_BAD_COMPLEX_NOT_TYPE);
        		return null;
        	}

        	if(pChildren.length > 3){        		
        		var pArgumentExpr: IAFXExprInstruction = null;

        		pArguments = [];

        		for(i = pChildren.length - 3; i > 0; i--) {
        			if(pChildren[i].value !== ","){
        				pArgumentExpr = this.analyzeExpr(pChildren[i]);
        				pArguments.push(pArgumentExpr);
        			}
        		}
        	}

        	pExprType = this.findConstructor(pConstructorType, pArguments);

        	if(isNull(pExprType)){
        		this._error(EFFECT_BAD_COMPLEX_NOT_CONSTRUCTOR, { typeName: pConstructorType.toString() });
        		return null;
        	}

        	pExpr.setType(pExprType);
        	pExpr.push(pConstructorType, false);
        	
        	if(!isNull(pArguments)){
        		for(i = 0; i < pArguments.length; i++) {
        			if(!pArguments[i].getType().isReadable()){
        				this._error(EFFECT_BAD_TYPE_FOR_READ);
        				return null;
        			}

        			pExpr.push(pArguments[i], true);
        		}
        	}

        	CHECK_INSTRUCTION(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

        	return pExpr;
        }

        private analyzeSimpleComplexExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pExpr: ComplexExprInstruction = new ComplexExprInstruction();
        	var pComplexExpr: IAFXExprInstruction;
        	var pExprType: IAFXVariableTypeInstruction;

        	pComplexExpr = this.analyzeExpr(pChildren[1]);
        	pExprType = <IAFXVariableTypeInstruction>pComplexExpr.getType();

        	pExpr.setType(pExprType);
        	pExpr.push(pComplexExpr, true);

        	CHECK_INSTRUCTION(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

        	return pExpr;
        }

        private analyzePrimaryExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pExpr: PrimaryExprInstruction = new PrimaryExprInstruction();
        	var pPrimaryExpr: IAFXExprInstruction;
        	var pPointer: IAFXVariableDeclInstruction = null;
        	var pPrimaryExprType: IAFXVariableTypeInstruction;

        	pPrimaryExpr = this.analyzeExpr(pChildren[0]);
        	pPrimaryExprType = <IAFXVariableTypeInstruction>pPrimaryExpr.getType();

        	pPointer = pPrimaryExprType.getPointer();
        	
        	if(isNull(pPointer)){
        		this._error(EFFECT_BAD_PRIMARY_NOT_POINT, { typeName: pPrimaryExprType.getHash() });
        		return null;
        	}

        	var pPointerVarType: IAFXVariableTypeInstruction = <IAFXVariableTypeInstruction>pPrimaryExprType.getParent();
        	if(!pPrimaryExprType.isStrictPointer()){
        		this.getCurrentAnalyzedFunction()._setForPixel(false);
        		this.getCurrentAnalyzedFunction()._notCanUsedAsFunction();
        		pPrimaryExprType._setPointerToStrict();
        	}

        	pExpr.setType(pPointer.getType());
        	pExpr.setOperator("@");
        	pExpr.push(pPointer.getNameId(), false);

        	CHECK_INSTRUCTION(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

        	return pExpr;
        }
        
        private analyzePostfixExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var sSymbol: string = pChildren[pChildren.length - 2].value;
        	
        	switch(sSymbol){
        		case "[":
        			return this.analyzePostfixIndex(pNode);
        		case ".":
        			return this.analyzePostfixPoint(pNode);
        		case "++":
        		case "--":
        			return this.analyzePostfixArithmetic(pNode);
        	}
        }

        private analyzePostfixIndex(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pExpr: PostfixIndexInstruction = new PostfixIndexInstruction();
        	var pPostfixExpr: IAFXExprInstruction = null;
        	var pIndexExpr:IAFXExprInstruction = null;
        	var pExprType: IAFXVariableTypeInstruction = null;
        	var pPostfixExprType: IAFXVariableTypeInstruction = null;
        	var pIndexExprType: IAFXVariableTypeInstruction = null;
        	var pIntType: IAFXTypeInstruction = null;

        	pPostfixExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
        	pPostfixExprType = <IAFXVariableTypeInstruction>pPostfixExpr.getType();

        	if(!pPostfixExprType.isArray()){
        		this._error(EFFECT_BAD_POSTIX_NOT_ARRAY, { typeName: pPostfixExprType.toString() });
        		return null;
        	}

        	pIndexExpr = this.analyzeExpr(pChildren[pChildren.length - 3]);
        	pIndexExprType = <IAFXVariableTypeInstruction>pIndexExpr.getType();

        	pIntType = Effect.getSystemType("int");

        	if(!pIndexExprType.isEqual(pIntType)){
        		this._error(EFFECT_BAD_POSTIX_NOT_INT_INDEX, { typeName: pIndexExprType.toString() });
        		return null;
        	}

        	pExprType = <IAFXVariableTypeInstruction>(pPostfixExprType.getArrayElementType());

        	pExpr.setType(pExprType);
        	pExpr.push(pPostfixExpr, true);
        	pExpr.push(pIndexExpr, true);

        	CHECK_INSTRUCTION(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

        	return pExpr;
        }

        private analyzePostfixPoint(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);
        	
        	var pChildren: IParseNode[] = pNode.children;
        	var pExpr: PostfixPointInstruction = new PostfixPointInstruction();
        	var pPostfixExpr: IAFXExprInstruction = null;
        	var sFieldName: string = "";
        	var pFieldNameExpr: IAFXIdExprInstruction = null;
        	var pExprType: IAFXVariableTypeInstruction = null;
        	var pPostfixExprType: IAFXVariableTypeInstruction = null;

        	pPostfixExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
        	pPostfixExprType = <IAFXVariableTypeInstruction>pPostfixExpr.getType();

        	sFieldName = pChildren[pChildren.length - 3].value;

        	pFieldNameExpr = pPostfixExprType.getFieldExpr(sFieldName);

        	if(isNull(pFieldNameExpr)){
        		this._error(EFFECT_BAD_POSTIX_NOT_FIELD, { typeName: pPostfixExprType.toString(),
        												   fieldName: sFieldName });
        		return null;
        	}

        	pExprType = <IAFXVariableTypeInstruction>pFieldNameExpr.getType();

        	if(pChildren.length === 4){
        		if(!pExprType.isPointer()){
        			this._error(EFFECT_BAD_POSTIX_NOT_POINTER, { typeName: pExprType.toString() });
        			return null;
        		}

        		var pBuffer: IAFXVariableDeclInstruction = this.analyzeFromExpr(pChildren[0]);
        		pExprType.setVideoBuffer(pBuffer);
        	}

        	pExpr.setType(pExprType);
        	pExpr.push(pPostfixExpr, true);
        	pExpr.push(pFieldNameExpr, true);

        	CHECK_INSTRUCTION(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

        	return pExpr;
        }

        private analyzePostfixArithmetic(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var sOperator: string = pChildren[0].value;
        	var pExpr: PostfixArithmeticInstruction = new PostfixArithmeticInstruction();
        	var pPostfixExpr: IAFXExprInstruction;
        	var pExprType: IAFXVariableTypeInstruction;
        	var pPostfixExprType: IAFXVariableTypeInstruction;

        	pPostfixExpr = this.analyzeExpr(pChildren[1]);
        	pPostfixExprType = <IAFXVariableTypeInstruction>pPostfixExpr.getType();

        	pExprType = this.checkOneOperandExprType(sOperator, pPostfixExprType);

        	if(isNull(pExprType)){
        		this._error(EFFECT_BAD_POSTIX_ARITHMETIC, { operator: sOperator,
        													typeName: pPostfixExprType.toString()});
        		return null;
        	}

        	pExpr.setType(pExprType);
        	pExpr.setOperator(sOperator);
        	pExpr.push(pPostfixExpr, true);

        	CHECK_INSTRUCTION(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

        	return pExpr;
        }
        
        private analyzeUnaryExpr(pNode: IParseNode): IAFXExprInstruction{
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var sOperator: string = pChildren[1].value;
        	var pExpr: UnaryExprInstruction = new UnaryExprInstruction();
        	var pUnaryExpr: IAFXExprInstruction;
        	var pExprType: IAFXVariableTypeInstruction;
        	var pUnaryExprType: IAFXVariableTypeInstruction;

        	pUnaryExpr = this.analyzeExpr(pChildren[0]);
        	pUnaryExprType = <IAFXVariableTypeInstruction>pUnaryExpr.getType();

        	pExprType = this.checkOneOperandExprType(sOperator, pUnaryExprType);

        	if(isNull(pExprType)){
        		this._error(EFFECT_BAD_UNARY_OPERATION, { operator: sOperator,
        												  tyepName: pUnaryExprType.toString()});
        		return null;
        	}

        	pExpr.setOperator(sOperator);
        	pExpr.setType(pExprType);
        	pExpr.push(pUnaryExpr, true);

        	CHECK_INSTRUCTION(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

        	return pExpr;
        }
        
        private analyzeCastExpr(pNode: IParseNode): IAFXExprInstruction{
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pExpr: CastExprInstruction = new CastExprInstruction();
        	var pExprType: IAFXVariableTypeInstruction;
        	var pCastedExpr: IAFXExprInstruction;

        	pExprType = this.analyzeConstTypeDim(pChildren[2]);
        	pCastedExpr = this.analyzeExpr(pChildren[0]);

        	if(!(<IAFXVariableTypeInstruction>pCastedExpr.getType()).isReadable()){
        		this._error(EFFECT_BAD_TYPE_FOR_READ);
        		return null;
        	}

        	pExpr.setType(pExprType);
        	pExpr.push(pExprType, true);
        	pExpr.push(pCastedExpr, true);

        	CHECK_INSTRUCTION(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

        	return pExpr;
        }
        
        private analyzeConditionalExpr(pNode: IParseNode): IAFXExprInstruction{
        	this.setAnalyzedNode(pNode);
        	
        	var pChildren: IParseNode[] = pNode.children;
        	var pExpr: ConditionalExprInstruction = new ConditionalExprInstruction();
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

        	pConditionType = <IAFXVariableTypeInstruction>pConditionExpr.getType();
        	pTrueExprType = <IAFXVariableTypeInstruction>pTrueExpr.getType();
        	pFalseExprType = <IAFXVariableTypeInstruction>pFalseExpr.getType();

        	pBoolType = Effect.getSystemType("bool");

        	if(!pConditionType.isEqual(pBoolType)){
        		this._error(EFFECT_BAD_CONDITION_TYPE, { typeName: pConditionType.toString()});
        		return null;
        	}

        	if(!pTrueExprType.isEqual(pFalseExprType)){
        		this._error(EFFECT_BAD_CONDITION_VALUE_TYPES, { leftTypeName: pTrueExprType.toString(),
        														rightTypeName: pFalseExprType.toString()});
        		return null;
        	}

        	if(!pConditionType.isReadable()){
        		this._error(EFFECT_BAD_TYPE_FOR_READ);
        		return null;
        	}

        	if(!pTrueExprType.isReadable()){
        		this._error(EFFECT_BAD_TYPE_FOR_READ);
        		return null;
        	}

        	if(!pFalseExprType.isReadable()){
        		this._error(EFFECT_BAD_TYPE_FOR_READ);
        		return null;
        	}

        	pExpr.setType(pTrueExprType);
        	pExpr.push(pConditionExpr, true);
        	pExpr.push(pTrueExpr, true);
        	pExpr.push(pFalseExpr, true);

        	CHECK_INSTRUCTION(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

        	return pExpr;
        }
        
        private analyzeArithmeticExpr(pNode: IParseNode): IAFXExprInstruction{
        	this.setAnalyzedNode(pNode);
        	
        	var pChildren: IParseNode[] = pNode.children;
        	var sOperator: string = pNode.children[1].value;
        	var pExpr: ArithmeticExprInstruction = new ArithmeticExprInstruction();
        	var pLeftExpr: IAFXExprInstruction = null;
        	var pRightExpr: IAFXExprInstruction = null;
			var pLeftType: IAFXVariableTypeInstruction = null;
        	var pRightType: IAFXVariableTypeInstruction = null;
        	var pExprType: IAFXVariableTypeInstruction = null;
        	
        	pLeftExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
        	pRightExpr = this.analyzeExpr(pChildren[0]);

        	pLeftType = <IAFXVariableTypeInstruction>pLeftExpr.getType();
        	pRightType = <IAFXVariableTypeInstruction>pRightExpr.getType();

        	pExprType = this.checkTwoOperandExprTypes(sOperator, pLeftType, pRightType);

        	if(isNull(pExprType)){
        		this._error(EFFECT_BAD_ARITHMETIC_OPERATION, { operator: sOperator,
        													   leftTypeName: pLeftType.toString(),
        													   rightTypeName: pRightType.toString()});
        		return null;
        	}

        	pExpr.setOperator(sOperator);
        	pExpr.setType(pExprType);
        	pExpr.push(pLeftExpr, true);
        	pExpr.push(pRightExpr, true);

        	CHECK_INSTRUCTION(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

        	return pExpr;
        }

        private analyzeRelationExpr(pNode: IParseNode): IAFXExprInstruction{
        	this.setAnalyzedNode(pNode);
        	
        	var pChildren: IParseNode[] = pNode.children;
        	var sOperator: string = pNode.children[1].value;
        	var pExpr: RelationalExprInstruction = new RelationalExprInstruction();
        	var pLeftExpr: IAFXExprInstruction;
        	var pRightExpr: IAFXExprInstruction;
			var pLeftType: IAFXVariableTypeInstruction;
        	var pRightType: IAFXVariableTypeInstruction;
        	var pExprType: IAFXVariableTypeInstruction;
        	
        	pLeftExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
        	pRightExpr = this.analyzeExpr(pChildren[0]);

        	pLeftType = <IAFXVariableTypeInstruction>pLeftExpr.getType();
        	pRightType = <IAFXVariableTypeInstruction>pRightExpr.getType();

        	pExprType = this.checkTwoOperandExprTypes(sOperator, pLeftType, pRightType);

        	if(isNull(pExprType)){
        		this._error(EFFECT_BAD_RELATIONAL_OPERATION, { operator: sOperator,
        													   leftTypeName: pLeftType.getHash(),
        													   rightTypeName: pRightType.getHash() });
        		return null;
        	}

        	pExpr.setOperator(sOperator);
        	pExpr.setType(pExprType);
        	pExpr.push(pLeftExpr, true);
        	pExpr.push(pRightExpr, true);

        	CHECK_INSTRUCTION(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

        	return pExpr;
        }

        private analyzeLogicalExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var sOperator: string = pNode.children[1].value;
        	var pExpr: LogicalExprInstruction = new LogicalExprInstruction();
        	var pLeftExpr: IAFXExprInstruction;
        	var pRightExpr: IAFXExprInstruction;
			var pLeftType: IAFXVariableTypeInstruction;
        	var pRightType: IAFXVariableTypeInstruction;
			var pBoolType: IAFXTypeInstruction;

        	pLeftExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
        	pRightExpr = this.analyzeExpr(pChildren[0]);

        	pLeftType = <IAFXVariableTypeInstruction>pLeftExpr.getType();
        	pRightType = <IAFXVariableTypeInstruction>pRightExpr.getType();

        	pBoolType = Effect.getSystemType("bool");

        	if(!pLeftType.isEqual(pBoolType)){
        		this._error(EFFECT_BAD_LOGICAL_OPERATION, { operator: sOperator,
    													    typeName: pLeftType.toString()});
        		return null;
        	}
        	if(!pRightType.isEqual(pBoolType)){
        		this._error(EFFECT_BAD_LOGICAL_OPERATION, { operator: sOperator,
    													    typeName: pRightType.toString()});
        		return null;
        	}

        	if(!pLeftType.isReadable()){
        		this._error(EFFECT_BAD_TYPE_FOR_READ);
        		return null;
        	}

        	if(!pRightType.isReadable()){
        		this._error(EFFECT_BAD_TYPE_FOR_READ);
        		return null;
        	}

        	pExpr.setOperator(sOperator);
        	pExpr.setType((<SystemTypeInstruction>pBoolType).getVariableType());
        	pExpr.push(pLeftExpr, true);
        	pExpr.push(pRightExpr, true);

        	CHECK_INSTRUCTION(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

        	return pExpr;        	
        }

        private analyzeAssignmentExpr(pNode: IParseNode): IAFXExprInstruction{
        	this.setAnalyzedNode(pNode);
        	
        	var pChildren: IParseNode[] = pNode.children;
        	var sOperator: string = pChildren[1].value;
        	var pExpr: AssignmentExprInstruction = new AssignmentExprInstruction();
        	var pLeftExpr: IAFXExprInstruction;
        	var pRightExpr: IAFXExprInstruction;
			var pLeftType: IAFXVariableTypeInstruction;
        	var pRightType: IAFXVariableTypeInstruction;
        	var pExprType: IAFXVariableTypeInstruction;

        	pLeftExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
        	pRightExpr = this.analyzeExpr(pChildren[0]);

        	pLeftType = <IAFXVariableTypeInstruction>pLeftExpr.getType();
        	pRightType = <IAFXVariableTypeInstruction>pRightExpr.getType();	

        	if(sOperator !== "="){
        		pExprType = this.checkTwoOperandExprTypes(sOperator, pLeftType, pRightType);	
        	  	if(isNull(pExprType)){
        			this._error(EFFECT_BAD_ARITHMETIC_ASSIGNMENT_OPERATION, { operator: sOperator,
        													  			  	  leftTypeName: pLeftType.getHash(),	
        													  			  	  rightTypeName: pRightType.getHash()});
        		}
        	}
        	else {
        		pExprType = pRightType;
        	}

        	pExprType = this.checkTwoOperandExprTypes("=", pLeftType, pExprType);

        	if(isNull(pExprType)){
        		this._error(EFFECT_BAD_ASSIGNMENT_OPERATION, { leftTypeName: pLeftType.getHash(),	
        													   rightTypeName: pRightType.getHash()});
        	}

        	pExpr.setOperator(sOperator);
        	pExpr.setType(pExprType);
        	pExpr.push(pLeftExpr, true);
        	pExpr.push(pRightExpr, true);

        	CHECK_INSTRUCTION(pExpr, ECheckStage.CODE_TARGET_SUPPORT);

        	return pExpr;
        }

        private analyzeIdExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);
        	
        	var sName: string = pNode.value;
        	var pVariable: IAFXVariableDeclInstruction = this.getVariable(sName);

        	if(isNull(pVariable)){
        		this._error(EFFECT_UNKNOWN_VARNAME, {varName: sName});
        		return null;
        	}

        	if(pVariable.getType()._isUnverifiable() && !this.isAnalzeInPass()){
        		this._error(EFFECT_BAD_USE_OF_ENGINE_VARIABLE);
        		return null;
        	}        	

        	if(!isNull(this.getCurrentAnalyzedFunction())){
        		if(!pVariable._isForPixel()){
        			this.getCurrentAnalyzedFunction()._setForPixel(false);
        		}
        		if(!pVariable._isForVertex()){
        			this.getCurrentAnalyzedFunction()._setForVertex(false);
        		}
        	}        	

        	var pVarId: IdExprInstruction = new IdExprInstruction();
        	pVarId.push(pVariable.getNameId(), false);

        	CHECK_INSTRUCTION(pVarId, ECheckStage.CODE_TARGET_SUPPORT);
        	
        	return pVarId;
        }

        private analyzeSimpleExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);
        	
        	var pInstruction: IAFXLiteralInstruction = null;
        	var sName: string = pNode.name;
        	var sValue: string = pNode.value;

        	switch(sName) {
        	 	case "T_UINT": 
    	 		pInstruction = new IntInstruction();
        	 		pInstruction.setValue((<int><any>sValue) * 1);
        	 		break;
        	 	case "T_FLOAT":
        	 		pInstruction = new FloatInstruction();
        	 		pInstruction.setValue((<float><any>sValue) * 1.0);
        	 		break;
        	 	case "T_STRING":
        	 		pInstruction = new StringInstruction();
        	 		pInstruction.setValue(sValue);
        	 		break;
        	 	case "T_KW_TRUE":
        	 		pInstruction = new BoolInstruction();
        	 		pInstruction.setValue(true);
        	 		break;
        	 	case "T_KW_FALSE":
        	 		pInstruction = new BoolInstruction();
        	 		pInstruction.setValue(false);
        	 		break;
			}

        	return pInstruction;
        }

        private analyzeMemExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pMemExpr: MemExprInstruction = new MemExprInstruction();
        	
        	var pPostfixExpr: IAFXExprInstruction = this.analyzeExpr(pChildren[0]);
        	var pPostfixExprType: IAFXVariableTypeInstruction = <IAFXVariableTypeInstruction>pPostfixExpr.getType();

        	if(!pPostfixExprType.isFromVariableDecl()){
        		this._error(EFFECT_BAD_MEMOF_ARGUMENT);
        		return null;
        	}

        	var pBuffer: IAFXVariableDeclInstruction = pPostfixExprType.getVideoBuffer();

        	if(isNull(pBuffer)){
        		this._error(EFFECT_BAD_MEMOF_NO_BUFFER);
        	}

        	if(!pPostfixExprType.isStrictPointer() && !isNull(this.getCurrentAnalyzedFunction())){
        		this.getCurrentAnalyzedFunction()._setForPixel(false);
        		this.getCurrentAnalyzedFunction()._notCanUsedAsFunction();
        		pPostfixExprType._setPointerToStrict();
        	}
        
        	pMemExpr.setBuffer(pBuffer);

        	return pMemExpr;
        }

        private analyzeConstTypeDim(pNode: IParseNode): IAFXVariableTypeInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;

        	if(pChildren.length > 1) {
        		this._error(EFFECT_BAD_CAST_TYPE_USAGE);
        		return null;
        	}

        	var pType: IAFXVariableTypeInstruction;

        	pType = <IAFXVariableTypeInstruction>(this.analyzeType(pChildren[0]));
        	
        	if(!pType.isBase()){
        		this._error(EFFECT_BAD_CAST_TYPE_NOT_BASE, { typeName: pType.toString()});
        	}

        	CHECK_INSTRUCTION(pType, ECheckStage.CODE_TARGET_SUPPORT);

        	return pType;
        }

        private analyzeVarStructDecl(pNode: IParseNode, pInstruction?: IAFXInstruction = null): void {
			this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pUsageType: IAFXVariableTypeInstruction = null;
        	var pVariable: IAFXVariableDeclInstruction = null;
        	var i: uint = 0;
        	
        	pUsageType = this.analyzeUsageStructDecl(pChildren[pChildren.length - 1]);

        	for(i = pChildren.length - 2; i >= 1; i--){
        		if(pChildren[i].name === "Variable") {
        			pVariable = this.analyzeVariable(pChildren[i], pUsageType);

        			if(!isNull(pInstruction)){
        				pInstruction.push(pVariable, true);
        			}
        		}
        	}
        }

        private analyzeUsageStructDecl(pNode: IParseNode): IAFXVariableTypeInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
		    var i: uint = 0;
		    var pType: IAFXVariableTypeInstruction = new VariableTypeInstruction();

		    for (i = pChildren.length - 1; i >= 0; i--) {
		        if (pChildren[i].name === "StructDecl") {
		        	var pMainType: IAFXTypeInstruction = this.analyzeStructDecl(pChildren[i]);
		        	pType.pushType(pMainType);

		        	var pTypeDecl: IAFXTypeDeclInstruction = new TypeDeclInstruction();
		        	pTypeDecl.push(pMainType, true);

		        	this.addTypeDecl(pTypeDecl); 
		        }
		        else if (pChildren[i].name === "Usage") {
		        	var sUsage: string = this.analyzeUsage(pChildren[i]);
		        	pType.addUsage(sUsage);
		        }
		    }

		    CHECK_INSTRUCTION(pType, ECheckStage.CODE_TARGET_SUPPORT);

		    return pType;
        }

		private analyzeTypeDecl(pNode: IParseNode, pParentInstruction: IAFXInstruction = null): IAFXTypeDeclInstruction {
			this.setAnalyzedNode(pNode);
			
			var pChildren: IParseNode[] = pNode.children;

			var pTypeDeclInstruction: IAFXTypeDeclInstruction = new TypeDeclInstruction();

 			if(pChildren.length === 2) {
				var pStructInstruction: ComplexTypeInstruction = <ComplexTypeInstruction>this.analyzeStructDecl(pChildren[1]);
				pTypeDeclInstruction.push(pStructInstruction, true);		
			}
			else {
				this._error(EFFECT_UNSUPPORTED_TYPEDECL);
			}

			CHECK_INSTRUCTION(pTypeDeclInstruction, ECheckStage.CODE_TARGET_SUPPORT);

			this.addTypeDecl(pTypeDeclInstruction);

			pNode.isAnalyzed = true;

			if(!isNull(pParentInstruction)){
				pParentInstruction.push(pTypeDeclInstruction, true);
			}

			return pTypeDeclInstruction;
		}

        private analyzeStructDecl(pNode: IParseNode): IAFXTypeInstruction {
        	this.setAnalyzedNode(pNode);
			
			var pChildren: IParseNode[] = pNode.children;

        	var pStruct: ComplexTypeInstruction = new ComplexTypeInstruction();
        	var pFieldCollector: IAFXInstruction = new InstructionCollector();

        	var sName: string = pChildren[pChildren.length - 2].value;

        	pStruct.setName(sName);
        	
        	this.newScope(EScopeType.k_Struct);

        	var i: uint = 0;
        	for (i = pChildren.length - 4; i >= 1; i--) {
		        if (pChildren[i].name === "VariableDecl") {
		            this.analyzeVariableDecl(pChildren[i], pFieldCollector);
		        }
		    }

		    this.endScope();

		    pStruct.addFields(pFieldCollector, true);

		    CHECK_INSTRUCTION(pStruct, ECheckStage.CODE_TARGET_SUPPORT);

        	return pStruct;
        }

        private analyzeStruct(pNode: IParseNode): IAFXTypeInstruction {
        	this.setAnalyzedNode(pNode);
			
			var pChildren: IParseNode[] = pNode.children;

        	var pStruct: ComplexTypeInstruction = new ComplexTypeInstruction();
        	var pFieldCollector: IAFXInstruction = new InstructionCollector();

        	this.newScope(EScopeType.k_Struct);

        	var i: uint = 0;
        	for (i = pChildren.length - 4; i >= 1; i--) {
		        if (pChildren[i].name === "VariableDecl") {
		            this.analyzeVariableDecl(pChildren[i], pFieldCollector);
		        }
		    }

		    this.endScope();

		    pStruct.addFields(pFieldCollector, true);

		    CHECK_INSTRUCTION(pStruct, ECheckStage.CODE_TARGET_SUPPORT);

        	return pStruct;
        }

        private analyzeFunctionDeclOnlyDefinition(pNode: IParseNode): IAFXFunctionDeclInstruction {
        	this.setAnalyzedNode(pNode);
        	
        	var pChildren: IParseNode[] = pNode.children;
        	var pFunction: FunctionDeclInstruction = null;
        	var pFunctionDef: FunctionDefInstruction = null;
        	var pStmtBlock: StmtBlockInstruction = null;
        	var pAnnotation: IAFXAnnotationInstruction = null;
        	var sLastNodeValue: string = pChildren[0].value;
        	var bNeedAddFunction: bool = false;

        	pFunctionDef = this.analyzeFunctionDef(pChildren[pChildren.length - 1]);

        	pFunction = <FunctionDeclInstruction>this.findFunctionByDef(pFunctionDef);

        	if(!isDef(pFunction)){
        		this._error(EFFECT_BAD_CANNOT_CHOOSE_FUNCTION, {funcName: pFunction.getNameId().toString() });
        		return null;
        	}

        	if(!isNull(pFunction) && pFunction.hasImplementation()){
        		this._error(EFFECT_BAD_REDEFINE_FUNCTION, { funcName: pFunction.getNameId().toString() });
        		return null;
        	}

        	if(isNull(pFunction)){
        		pFunction = new FunctionDeclInstruction();
        		bNeedAddFunction = true;
        	}
        	else {
        		if(!pFunction.getReturnType().isEqual(pFunctionDef.getReturnType())){
        			this._error(EFFECT_BAD_FUNCTION_DEF_RETURN_TYPE, {funcName: pFunction.getNameId().toString() });
        			return null;
        		}

        		bNeedAddFunction = false;
        	}

    		pFunction.setFunctionDef(<IAFXDeclInstruction>pFunctionDef);
    		
    		this.resumeScope();

    		if(pChildren.length === 3) {
        		pAnnotation = this.analyzeAnnotation(pChildren[1]);
        		pFunction.setAnnotation(pAnnotation);
        	}

        	if(sLastNodeValue !== ";") {
        		pFunction._setParseNode(pNode);
        		pFunction._setImplementationScope(this.getScope());
        		this._pFunctionWithImplementationList.push(pFunction);
        	}

        	this.endScope();
        	
        	if(bNeedAddFunction){
        		this.addFunctionDecl(pFunction);
       	 	}

        }

        private resumeFunctionAnalysis(pAnalzedFunction: IAFXFunctionDeclInstruction): void {
        	var pFunction: FunctionDeclInstruction = <FunctionDeclInstruction>pAnalzedFunction;
        	var pNode: IParseNode = pFunction._getParseNode();

        	this.setAnalyzedNode(pNode);
        	this.setScope(pFunction._getImplementationScope());

        	var pChildren: IParseNode[] = pNode.children;
        	var pStmtBlock: StmtBlockInstruction = null;

        	this.setCurrentAnalyzedFunction(pFunction);

        	// LOG("-----Analyze function '" + pFunction.getName() + "'------");

        	pStmtBlock = <StmtBlockInstruction>this.analyzeStmtBlock(pChildren[0]);
 			pFunction.setImplementation(<IAFXStmtInstruction>pStmtBlock);

 			this.setCurrentAnalyzedFunction(null);

 			this.endScope();

 			CHECK_INSTRUCTION(pFunction, ECheckStage.CODE_TARGET_SUPPORT);  
        }

        private analyzeFunctionDef(pNode: IParseNode): FunctionDefInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pFunctionDef: FunctionDefInstruction = new FunctionDefInstruction();
        	var pReturnType: IAFXVariableTypeInstruction = null;
        	var pFuncName: IAFXIdInstruction = null;
        	var pArguments: IAFXVariableDeclInstruction[] = null;
        	var sFuncName: string = pChildren[pChildren.length - 2].value;

        	pReturnType = this.analyzeUsageType(pChildren[pChildren.length - 1]);
        	
        	if(pReturnType.isPointer() || pReturnType._containSampler() || pReturnType._containPointer()){
        		this._error(EFFECT_BAD_RETURN_TYPE_FOR_FUNCTION, { funcName: sFuncName });
        		return null;
        	}

        	pFuncName = new IdInstruction();
        	pFuncName.setName(sFuncName);

        	pFunctionDef.setReturnType(pReturnType);
        	pFunctionDef.setFunctionName(pFuncName);

        	if(pChildren.length === 4){
        		var sSemantic: string = this.analyzeSemantic(pChildren[0]);
        		pFunctionDef.setSemantic(sSemantic);
        	}

        	this.newScope();

        	this.analyzeParamList(pChildren[pChildren.length - 3], pFunctionDef);

        	this.endScope();

        	CHECK_INSTRUCTION(pFunctionDef, ECheckStage.CODE_TARGET_SUPPORT);    

        	return pFunctionDef;
        }

        private analyzeParamList(pNode:IParseNode, pFunctionDef: FunctionDefInstruction): void {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
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

        private analyzeParameterDecl(pNode: IParseNode): IAFXVariableDeclInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pType: IAFXVariableTypeInstruction = null;
        	var pParameter: IAFXVariableDeclInstruction = null;

        	pType = this.analyzeParamUsageType(pChildren[1]);
        	pParameter = this.analyzeVariable(pChildren[0], pType);

        	return pParameter;
        }

        private analyzeParamUsageType(pNode: IParseNode): IAFXVariableTypeInstruction {
        	var pChildren: IParseNode[] = pNode.children;
		    var i: uint = 0;
		    var pType: IAFXVariableTypeInstruction = new VariableTypeInstruction();

		    for (i = pChildren.length - 1; i >= 0; i--) {
		        if (pChildren[i].name === "Type") {
		        	var pMainType: IAFXTypeInstruction = this.analyzeType(pChildren[i]);
		        	pType.pushType(pMainType);
		        }
		        else if (pChildren[i].name === "ParamUsage") {
		        	var sUsage: string = this.analyzeUsage(pChildren[i]);
		        	pType.addUsage(sUsage);
		        }
		    }

		    CHECK_INSTRUCTION(pType, ECheckStage.CODE_TARGET_SUPPORT);   

		    return pType;
        }

        private analyzeStmtBlock(pNode: IParseNode): IAFXStmtInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pStmtBlock: StmtBlockInstruction = new StmtBlockInstruction();
        	var pStmt: IAFXStmtInstruction;
        	var i: uint = 0;

        	pStmtBlock._setScope(this.getScope());

        	this.newScope();

        	for(i = pChildren.length - 2; i > 0; i--){
        		pStmt = this.analyzeStmt(pChildren[i]);
        		if(!isNull(pStmt)){
        			pStmtBlock.push(pStmt);
        		}

        		this.addExtactionStmts(pStmtBlock);
        	} 

        	this.endScope();

        	CHECK_INSTRUCTION(pStmtBlock, ECheckStage.CODE_TARGET_SUPPORT);    

        	return pStmtBlock;
        }

        private analyzeStmt(pNode:IParseNode): IAFXStmtInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var sFirstNodeName: string = pChildren[pChildren.length - 1].name;

        	switch(sFirstNodeName){
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

        private analyzeSimpleStmt(pNode: IParseNode): IAFXStmtInstruction{
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var sFirstNodeName: string = pChildren[pChildren.length - 1].name;

        	switch(sFirstNodeName){
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
        			if(pChildren.length === 2) {
        				return this.analyzeExprStmt(pNode);
        			}
        			else {
        				return (new SemicolonStmtInstruction());
        			}
        	}
        }

        private analyzeReturnStmt(pNode: IParseNode): IAFXStmtInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pReturnStmtInstruction: ReturnStmtInstruction = new ReturnStmtInstruction();

        	var pFunctionReturnType: IAFXVariableTypeInstruction = this.getCurrentAnalyzedFunction().getReturnType();
        
        	if(pFunctionReturnType.isEqual(Effect.getSystemType("void")) && pChildren.length === 3){
        		this._error(EFFECT_BAD_RETURN_STMT_VOID);
        		return null;
        	}
        	else if(!pFunctionReturnType.isEqual(Effect.getSystemType("void")) && pChildren.length === 2){
        		this._error(EFFECT_BAD_RETURN_STMT_EMPTY);
        		return null;
        	}

        	if(pChildren.length === 3) {
        		var pExprInstruction: IAFXExprInstruction = this.analyzeExpr(pChildren[1]);
        		var pOutVar: IAFXVariableDeclInstruction = this.getCurrentAnalyzedFunction()._getOutVariable();
        		
        		if(!isNull(pOutVar) && pOutVar.getType() !== pExprInstruction.getType()){
        			this._error(EFFECT_BAD_RETURN_STMT_NOT_EQUAL_TYPES);
        			return null;
        		}

        		if(!pFunctionReturnType.isEqual(pExprInstruction.getType())){
        			this._error(EFFECT_BAD_RETURN_STMT_NOT_EQUAL_TYPES);
        			return null;
        		}
        		pReturnStmtInstruction.push(pExprInstruction, true);
        	}

        	CHECK_INSTRUCTION(pReturnStmtInstruction, ECheckStage.CODE_TARGET_SUPPORT);    

        	return pReturnStmtInstruction;
        }

        private analyzeBreakStmt(pNode: IParseNode): IAFXStmtInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pBreakStmtInstruction: BreakStmtInstruction = new BreakStmtInstruction();
        	var sOperatorName: string = pChildren[1].value;

        	pBreakStmtInstruction.setOperator(sOperatorName);

        	if(sOperatorName === "discard" && !isNull(this.getCurrentAnalyzedFunction())){
        		this.getCurrentAnalyzedFunction()._setForVertex(false);	
        	}

        	CHECK_INSTRUCTION(pBreakStmtInstruction, ECheckStage.CODE_TARGET_SUPPORT);    

        	return pBreakStmtInstruction;
        }

        private analyzeDeclStmt(pNode: IParseNode): IAFXStmtInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var sNodeName: string = pNode.name;
        	var pDeclStmtInstruction: DeclStmtInstruction = new DeclStmtInstruction();

        	switch(sNodeName){
        		case "TypeDecl":
        			this.analyzeTypeDecl(pNode, pDeclStmtInstruction);
        			break;
        		case "VariableDecl":
        			this.analyzeVariableDecl(pNode, pDeclStmtInstruction);
        			break;
    			case "VarStructDecl":
    				this.analyzeVarStructDecl(pNode,  pDeclStmtInstruction);
    				break;
        	}

        	CHECK_INSTRUCTION(pDeclStmtInstruction, ECheckStage.CODE_TARGET_SUPPORT);    
        	
        	return pDeclStmtInstruction;
        }

       	private analyzeExprStmt(pNode: IParseNode): IAFXStmtInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pExprStmtInstruction: ExprStmtInstruction = new ExprStmtInstruction();
        	var pExprInstruction: IAFXExprInstruction = this.analyzeExpr(pChildren[1]);

        	pExprStmtInstruction.push(pExprInstruction, true);

        	CHECK_INSTRUCTION(pExprStmtInstruction, ECheckStage.CODE_TARGET_SUPPORT);    

        	return pExprStmtInstruction;
        }	

        private analyzeWhileStmt(pNode: IParseNode): IAFXStmtInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var isDoWhile: bool = (pChildren[pChildren.length - 1].value === "do");
        	var isNonIfStmt: bool = (pNode.name === "NonIfStmt") ? true : false;

        	var pWhileStmt: WhileStmtInstruction = new WhileStmtInstruction();
        	var pCondition: IAFXExprInstruction = null;
        	var pConditionType: IAFXVariableTypeInstruction = null;
        	var pBoolType: IAFXTypeInstruction = Effect.getSystemType("bool");
        	var pStmt: IAFXStmtInstruction = null;

        	if(isDoWhile) {
        		pWhileStmt.setOperator("do_while");
        		pCondition = this.analyzeExpr(pChildren[2]);
        		pConditionType = <IAFXVariableTypeInstruction>pCondition.getType();

        		if(!pConditionType.isEqual(pBoolType)){
	        		this._error(EFFECT_BAD_DO_WHILE_CONDITION, { typeName: pConditionType.toString() });
	        		return null;
	        	}

	        	pStmt = this.analyzeStmt(pChildren[0]);
        	}
        	else {
        		pWhileStmt.setOperator("while");
        		pCondition = this.analyzeExpr(pChildren[2]);
        		pConditionType = <IAFXVariableTypeInstruction>pCondition.getType();

        		if(!pConditionType.isEqual(pBoolType)){
	        		this._error(EFFECT_BAD_WHILE_CONDITION, { typeName: pConditionType.toString() });
	        		return null;
	        	}

	        	if(isNonIfStmt){
	        		pStmt = this.analyzeNonIfStmt(pChildren[0]);
	        	}
	        	else {
	        		pStmt = this.analyzeStmt(pChildren[0]);
	        	}

	        	pWhileStmt.push(pCondition, true);
	        	pWhileStmt.push(pStmt, true);
	        }

	        CHECK_INSTRUCTION(pWhileStmt, ECheckStage.CODE_TARGET_SUPPORT);    

        	return pWhileStmt;
        }

        private analyzeIfStmt(pNode: IParseNode): IAFXStmtInstruction{
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var isIfElse: bool = (pChildren.length === 7);

        	var pIfStmtInstruction: IfStmtInstruction = new IfStmtInstruction();
        	var pCondition: IAFXExprInstruction = this.analyzeExpr(pChildren[pChildren.length - 3]);
        	var pConditionType: IAFXVariableTypeInstruction = <IAFXVariableTypeInstruction>pCondition.getType();
        	var pBoolType: IAFXTypeInstruction = Effect.getSystemType("bool");

        	var pIfStmt: IAFXStmtInstruction = null;
        	var pElseStmt: IAFXStmtInstruction = null;
 
        	if(!pConditionType.isEqual(pBoolType)){
        		this._error(EFFECT_BAD_IF_CONDITION, { typeName: pConditionType.toString() });
        		return null;
        	}

        	pIfStmtInstruction.push(pCondition, true);

        	if(isIfElse){
        		pIfStmtInstruction.setOperator("if_else");
        		pIfStmt = this.analyzeNonIfStmt(pChildren[2]);
        		pElseStmt = this.analyzeStmt(pChildren[0]);

        		pIfStmtInstruction.push(pIfStmt, true);
        		pIfStmtInstruction.push(pElseStmt, true);
        	}
        	else {
        		pIfStmtInstruction.setOperator("if");
        		pIfStmt = this.analyzeNonIfStmt(pChildren[0]);

        		pIfStmtInstruction.push(pIfStmt, true);
        	}

        	CHECK_INSTRUCTION(pIfStmtInstruction, ECheckStage.CODE_TARGET_SUPPORT);    

        	return pIfStmtInstruction;
        }

        private analyzeNonIfStmt(pNode: IParseNode): IAFXStmtInstruction{
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var sFirstNodeName: string = pChildren[pChildren.length - 1].name;

        	switch(sFirstNodeName){
        		case "SimpleStmt":
        			return this.analyzeSimpleStmt(pChildren[0]);
        		case "T_KW_WHILE":
        			return this.analyzeWhileStmt(pNode);
        		case "T_KW_FOR":
        			return this.analyzeForStmt(pNode);
        	}
        }

        private analyzeForStmt(pNode: IParseNode): IAFXStmtInstruction {
        	this.setAnalyzedNode(pNode);
			
			var pChildren: IParseNode[] = pNode.children;
        	var isNonIfStmt: bool = (pNode.name === "NonIfStmt");
        	var pForStmtInstruction: ForStmtInstruction = new ForStmtInstruction();
        	var pStmt: IAFXStmtInstruction = null;

        	this.newScope();

        	this.analyzeForInit(pChildren[pChildren.length - 3], pForStmtInstruction);
        	this.analyzeForCond(pChildren[pChildren.length - 4], pForStmtInstruction);
        	
        	if(pChildren.length === 7) {
        		this.analyzeForStep(pChildren[2], pForStmtInstruction);
        	}
        	else {
        		pForStmtInstruction.push(null);
        	}
        	
        	
        	if(isNonIfStmt) {
        		pStmt = this.analyzeNonIfStmt(pChildren[0]);
        	}
        	else {
        		pStmt = this.analyzeStmt(pChildren[0]);
        	}

        	pForStmtInstruction.push(pStmt, true);

        	this.endScope();

        	CHECK_INSTRUCTION(pForStmtInstruction, ECheckStage.CODE_TARGET_SUPPORT);    

        	return pForStmtInstruction;
        }

        private analyzeForInit(pNode: IParseNode, pForStmtInstruction: ForStmtInstruction): void {
        	this.setAnalyzedNode(pNode);
			
			var pChildren: IParseNode[] = pNode.children;
			var sFirstNodeName: string = pChildren[pChildren.length - 1].name;

			switch(sFirstNodeName){
				case "VariableDecl":
					this.analyzeVariableDecl(pChildren[0], pForStmtInstruction);
					break;
				case "Expr":
					var pExpr: IAFXExprInstruction = this.analyzeExpr(pChildren[0]);
					pForStmtInstruction.push(pExpr, true);
					break;
				default:
					// ForInit : ';'
					pForStmtInstruction.push(null);
					break;
			}

        	return;
        }

        private analyzeForCond(pNode: IParseNode, pForStmtInstruction: ForStmtInstruction): void {
        	this.setAnalyzedNode(pNode);
			
			var pChildren: IParseNode[] = pNode.children;

			if(pChildren.length === 1){
				pForStmtInstruction.push(null);
				return;
			}

			var pConditionExpr: IAFXExprInstruction = this.analyzeExpr(pChildren[1]);

			pForStmtInstruction.push(pConditionExpr, true);
			return;
        }

        private analyzeForStep(pNode: IParseNode, pForStmtInstruction: ForStmtInstruction): void {
        	this.setAnalyzedNode(pNode);
			
			var pChildren: IParseNode[] = pNode.children;
			var pStepExpr: IAFXExprInstruction = this.analyzeExpr(pChildren[0]);

			pForStmtInstruction.push(pStepExpr, true);

        	return;
        }
       

        private analyzeUseDecl(pNode: IParseNode): void {
        	this.setAnalyzedNode(pNode);
        	this.setStrictModeOn();
        }

        private analyzeTechniqueForImport(pNode: IParseNode): void {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pTechnique: IAFXTechniqueInstruction = new TechniqueInstruction();
        	var sTechniqueName: string = this.analyzeComplexName(pChildren[pChildren.length - 2]);
        	var isComplexName: bool = pChildren[pChildren.length - 2].children.length !== 1;

        	pTechnique.setName(sTechniqueName, isComplexName);

        	for (var i: uint = pChildren.length - 3; i >= 0; i--) {
		        if (pChildren[i].name === "Annotation") {
		            var pAnnotation: IAFXAnnotationInstruction = this.analyzeAnnotation(pChildren[i]);
		            pTechnique.setAnnotation(pAnnotation);
		        }
		        else if (pChildren[i].name === "Semantic") {
		            var sSemantic: string = this.analyzeSemantic(pChildren[i]);
		            pTechnique.setSemantic(sSemantic);
		        }
		        else {
	            	this.analyzeTechniqueBodyForImports(pChildren[i], pTechnique);
	       		}
	    	}

	    	this.addTechnique(pTechnique);
        }

        private analyzeComplexName(pNode: IParseNode): string {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var sName: string = "";

        	for(var i: uint = pChildren.length - 1; i >= 0; i--){
        		sName += pChildren[i].value;
        	}

        	return sName;
        }

        private analyzeTechniqueBodyForImports(pNode: IParseNode, pTechnique: IAFXTechniqueInstruction): void {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;

        	for (var i: uint = pChildren.length - 2; i >= 1; i--) {
        		this.analyzePassDeclForImports(pChildren[i], pTechnique);
        	}
        }

        private analyzePassDeclForImports(pNode: IParseNode, pTechnique: IAFXTechniqueInstruction): void {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;

        	if(pChildren[0].name === "ImportDecl"){
        		this.analyzeImportDecl(pChildren[0], pTechnique);
        	}
        	else if(pChildren.length > 1) {
        		var pPass: IAFXPassInstruction = new PassInstruction();
        		//TODO: add annotation and id
        		this.analyzePassStateBlockForShaders(pChildren[0], pPass);
        		
        		pPass._setParseNode(pNode);
        		
        		pTechnique.addPass(pPass);
        	}
        }

        private analyzePassStateBlockForShaders(pNode: IParseNode, pPass: IAFXPassInstruction): void {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;

        	for (var i: uint = pChildren.length - 2; i >= 1; i--) {
		        this.analyzePassStateForShader(pChildren[i], pPass);
		    }
        }

        private analyzePassStateForShader(pNode: IParseNode, pPass: IAFXPassInstruction): void {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;

        	if(pChildren.length === 1){
        		pPass._markAsComplex(true);

        		if(pChildren[0].name === "StateIf"){
        			this.analyzePassStateIfForShader(pChildren[0], pPass);
        		}
        		else if(pChildren[0].name === "StateSwitch"){
        			this.analyzePassStateSwitchForShader(pChildren[0], pPass);
        		}
        		
        		return;
        	}

        	var sType: string = pChildren[pChildren.length - 1].value.toUpperCase();
        	var eShaderType: EFunctionType = EFunctionType.k_Vertex;

        	if(sType === "VERTEXSHADER"){
        		eShaderType = EFunctionType.k_Vertex
        	}
        	else if(sType === "PIXELSHADER"){
        		eShaderType = EFunctionType.k_Pixel;
        	}
        	else {
        		return;
        	}

        	pNode.isAnalyzed = true;

        	var pStateExprNode: IParseNode = pChildren[pChildren.length - 3];
        	var pExprNode: IParseNode = pStateExprNode.children[pStateExprNode.children.length - 1];
        	var pCompileExpr: CompileExprInstruction = <CompileExprInstruction>this.analyzeExpr(pExprNode);
        	var pShaderFunc: IAFXFunctionDeclInstruction = pCompileExpr.getFunction();

        	if(eShaderType === EFunctionType.k_Vertex){
        		if(!pShaderFunc._checkDefenitionForVertexUsage()){
        			this._error(EFFECT_BAD_FUNCTION_VERTEX_DEFENITION, {funcDef: pShaderFunc._getStringDef()});
        		}
        	}
        	else{
        		if(!pShaderFunc._checkDefenitionForPixelUsage()){
        			this._error(EFFECT_BAD_FUNCTION_PIXEL_DEFENITION, {funcDef: pShaderFunc._getStringDef()});
        		}
        	}

        	pShaderFunc._markUsedAs(eShaderType);

        	pPass._addFoundFunction(pNode, pShaderFunc, eShaderType);
        }

        private analyzePassStateIfForShader(pNode: IParseNode, pPass: IAFXPassInstruction): void {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;

        	if (pChildren.length === 5){
        		this.analyzePassStateBlockForShaders(pChildren[0], pPass);
        	}
        	else if(pChildren.length === 7 && pChildren[0].name === "PassStateBlock"){
        		this.analyzePassStateBlockForShaders(pChildren[2], pPass);
        		this.analyzePassStateBlockForShaders(pChildren[0], pPass);
        	}
        	else {
        		this.analyzePassStateBlockForShaders(pChildren[2], pPass);
        		this.analyzePassStateIfForShader(pChildren[0], pPass);
        	}
        }

        private analyzePassStateSwitchForShader(pNode: IParseNode, pPass: IAFXPassInstruction): void {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;

        	this.analyzePassCaseBlockForShader(pChildren[0], pPass);
        }

        private analyzePassCaseBlockForShader(pNode: IParseNode, pPass: IAFXPassInstruction): void {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;

        	for(var i: uint = pChildren.length - 2; i >= 1; i--){
        		if(pChildren[i].name === "CaseState"){
        			this.analyzePassCaseStateForShader(pChildren[i], pPass);
        		}
        		else if(pChildren[i].name === "DefaultState"){
        			this.analyzePassDefaultStateForShader(pChildren[i], pPass);
        		}
        	}
        }

        private analyzePassCaseStateForShader(pNode: IParseNode, pPass: IAFXPassInstruction): void {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;

        	for(var i: uint = pChildren.length - 4; i >= 0; i--){
        		if(pChildren[i].name === "PassState"){
        			this.analyzePassStateForShader(pChildren[i], pPass);
        		}
        	}
        }

        private analyzePassDefaultStateForShader(pNode: IParseNode, pPass: IAFXPassInstruction): void {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;

        	for(var i: uint = pChildren.length - 3; i >= 0; i--){
        		if(pChildren[i].name === "PassState"){
        			this.analyzePassStateForShader(pChildren[i], pPass);
        		}
        	}
        }

        private resumeTechniqueAnalysis(pTechnique: IAFXTechniqueInstruction): void {
        	var pPassList: IAFXPassInstruction[] = pTechnique.getPassList();

        	for(var i: uint = 0; i < pPassList.length; i++){
        		this.resumePassAnalysis(pPassList[i]);
        	}
			
			if(!pTechnique.checkForCorrectImports()){
				this._error(EFFECT_BAD_TECHNIQUE_IMPORT, { techniqueName: pTechnique.getName() });
				return;
			}      

			pTechnique.finalizeTechnique(this._sProvideNameSpace, 
										 this._pGlobalComponentList, 
										 this._pGlobalComponetShiftList);  	
        }

        private resumePassAnalysis(pPass: IAFXPassInstruction): void {
         	var pNode: IParseNode = pPass._getParseNode();

        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	
        	this.setAnalyzeInPass(true);
        	this.analyzePassStateBlock(pChildren[0], pPass);
        	this.setAnalyzeInPass(false);

        	pPass.finalizePass();
        }

        private analyzePassStateBlock(pNode: IParseNode, pPass: IAFXPassInstruction): void {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;

        	pPass._addCodeFragment("{");

        	for (var i: uint = pChildren.length - 2; i >= 1; i--) {
		        this.analyzePassState(pChildren[i], pPass);
		    }

		    pPass._addCodeFragment("}");
        }

        private analyzePassState(pNode: IParseNode, pPass: IAFXPassInstruction): void {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;

        	if(pChildren.length === 1){
        		if(pChildren[0].name === "StateIf"){
        			this.analyzePassStateIf(pChildren[0], pPass);
        		}
        		else if(pChildren[0].name === "StateSwitch"){
        			this.analyzePassStateSwitch(pChildren[0], pPass);
        		}
        		
        		return;
        	}

        	if(pNode.isAnalyzed) {
        		var pFunc: IAFXFunctionDeclInstruction = pPass._getFoundedFunction(pNode);
        		var eShaderType: EFunctionType = pPass._getFoundedFunctionType(pNode);
        		var pShader: IAFXFunctionDeclInstruction = null;

	        	if(eShaderType === EFunctionType.k_Vertex){
	        		pShader = pFunc._getVertexShader();
	        	}
	        	else {
	        		pShader = pFunc._getPixelShader();
	        	}

	        	pPass.addShader(pShader);
        	}
        	else {
        		var sType: string = pChildren[pChildren.length - 1].value.toUpperCase();
        		var eType: EPassState = null;
        		var pStateExprNode: IParseNode = pChildren[pChildren.length - 3];
        		var pExprNode: IParseNode = pStateExprNode.children[pStateExprNode.children.length - 1];

        		switch (sType) {
        			case "BLENDENABLE":
        				eType = EPassState.BLENDENABLE;
        				break;
        			case "CULLFACEENABLE":
        				eType = EPassState.CULLFACEENABLE;
        				break;
        			case "ZENABLE":
        				eType = EPassState.ZENABLE;
        				break;
        			case "ZWRITEENABLE":
        				eType = EPassState.ZWRITEENABLE;
        				break;
        			case "DITHERENABLE":
        				eType = EPassState.DITHERENABLE;
        				break;
        			case "SCISSORTESTENABLE":
        				eType = EPassState.SCISSORTESTENABLE;
        				break;
        			case "STENCILTESTENABLE":
        				eType = EPassState.STENCILTESTENABLE;
        				break;
        			case "POLYGONOFFSETFILLENABLE":
        				eType = EPassState.POLYGONOFFSETFILLENABLE;
        				break;
        			case "CULLFACE":
        				eType = EPassState.CULLFACE;
        				break;
        			case "FRONTFACE":
        				eType = EPassState.FRONTFACE;
        				break;
        			case "SRCBLEND":
        				eType = EPassState.SRCBLEND;
        				break;
        			case "DESTBLEND":
        				eType = EPassState.DESTBLEND;
        				break;
        			case "ZFUNC":
        				eType = EPassState.ZFUNC;
        				break;
        			case "ALPHABLENDENABLE":
        				eType = EPassState.ALPHABLENDENABLE;
        				break;
        			case "ALPHATESTENABLE":
        				eType = EPassState.ALPHATESTENABLE;
        				break;

			        default:
			            WARNING("Unsupported render state type used: " + sType + ". WebGl...");
			            return;
			    }

			    if (pExprNode.value === "{" || pExprNode.value === "<" ||
			        isNull(pExprNode.value)) {
			        WARNING("So pass state are incorrect");
			        return;
			    }

			    var sValue: string = pExprNode.value.toUpperCase();
			    var eValue: EPassStateValue = null;

			    switch (eType) {
			        case EPassState.ALPHABLENDENABLE:
			        case EPassState.ALPHATESTENABLE:
			            WARNING("ALPHABLENDENABLE/ALPHATESTENABLE not supported in WebGL.");
			            return;

			        case EPassState.BLENDENABLE:
			        case EPassState.CULLFACEENABLE:
			        case EPassState.ZENABLE:
			        case EPassState.ZWRITEENABLE:
			        case EPassState.DITHERENABLE:
			        case EPassState.SCISSORTESTENABLE:
			        case EPassState.STENCILTESTENABLE:
			        case EPassState.POLYGONOFFSETFILLENABLE:
			            switch (sValue) {
			                case "TRUE":
			                	eValue = EPassStateValue.TRUE;
			                	break;
			                case "FALSE":
			                	eValue = EPassStateValue.FALSE;
			                	break;

			                default:
			                    WARNING("Unsupported render state ALPHABLENDENABLE/ZENABLE/ZWRITEENABLE/DITHERENABLE value used: "
			                              + sValue + ".");
								return;
			            }
			            break;

			        case EPassState.CULLFACE:
			        	switch(sValue){
			        		case "FRONT":
			                	eValue = EPassStateValue.FRONT;
			                	break;
			                case "BACK":
			                	eValue = EPassStateValue.BACK;
			                	break
			        		case "FRONT_AND_BACK":
			                	eValue = EPassStateValue.FRONT_AND_BACK;
			                	break;

			               	default:
			                    WARNING("Unsupported render state CULLFACE value used: " + sValue + ".");
			                    return;
			        	}
			        	break;

			       	case EPassState.FRONTFACE:
			            switch (sValue) {
			                case "CW":
			                	eValue = EPassStateValue.CW;
			                	break;
			                case "CCW":
			                	eValue = EPassStateValue.CCW;
			                	break;

			                default:
			                    WARNING("Unsupported render state SRCBLEND/DESTBLEND value used: " + sValue + ".");
			                    return;
			            }
			            break;

			        case EPassState.SRCBLEND:
			        case EPassState.DESTBLEND:
			            switch (sValue) {
			                case "ZERO":
			                	eValue = EPassStateValue.ZERO;
			                	break;
			                case "ONE":
			                	eValue = EPassStateValue.ONE;
			                	break;
			                case "SRCCOLOR":
			                	eValue = EPassStateValue.SRCCOLOR;
			                	break;
			                case "INVSRCCOLOR":
			                	eValue = EPassStateValue.INVSRCCOLOR;
			                	break;
			                case "SRCALPHA":
			                	eValue = EPassStateValue.SRCALPHA;
			                	break;
			                case "INVSRCALPHA":
			                	eValue = EPassStateValue.INVSRCALPHA;
			                	break;
			                case "DESTALPHA":
			                	eValue = EPassStateValue.DESTALPHA;
			                	break;
			                case "INVDESTALPHA":
			                	eValue = EPassStateValue.INVDESTALPHA;
			                	break;
			                case "DESTCOLOR":
			                	eValue = EPassStateValue.DESTCOLOR;
			                	break;
			                case "INVDESTCOLOR":
			                	eValue = EPassStateValue.INVDESTCOLOR;
			                	break;
			                case "SRCALPHASAT":
			                	eValue = EPassStateValue.SRCALPHASAT;
			                	break;

			                default:
			                    WARNING("Unsupported render state SRCBLEND/DESTBLEND value used: " + sValue + ".");
			                    return;
			            }
			            break;

			        

			        case EPassState.ZFUNC:
			            switch (sValue) {
			                case "NEVER":
			                	eValue = EPassStateValue.NEVER;
			                	break;
			                case "LESS":
			                	eValue = EPassStateValue.LESS;
			                	break;
			                case "EQUAL":
			                	eValue = EPassStateValue.EQUAL;
			                	break;
			                case "LESSEQUAL":
			                	eValue = EPassStateValue.LESSEQUAL;
			                	break;
			                case "GREATER":
			                	eValue = EPassStateValue.GREATER;
			                	break;
			                case "NOTEQUAL":
			                	eValue = EPassStateValue.NOTEQUAL;
			                	break;
			                case "GREATEREQUAL":
			                	eValue = EPassStateValue.GREATEREQUAL;
			                	break;
			                case "ALWAYS":
			                	eValue = EPassStateValue.ALWAYS;
			                	break;

			                default:
			                    WARNING("Unsupported render state ZFUNC value used: " +
			                          sValue + ".");
			                   return;
			            }
			            break;
			    }

			    pPass.setState(eType, eValue);
        	}
        	
        }

        private analyzePassStateIf(pNode: IParseNode, pPass: IAFXPassInstruction): void {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
      		
        	var pIfExpr: IAFXExprInstruction = this.analyzeExpr(pChildren[pChildren.length - 3]);
        	pIfExpr.prepareFor(EFunctionType.k_PassFunction);

        	pPass._addCodeFragment("if("+ pIfExpr.toFinalCode() + ")");

        	this.analyzePassStateBlock(pChildren[pChildren.length - 5], pPass);

        	if(pChildren.length > 5){
        		pPass._addCodeFragment("else");

        		if(pChildren[0].name === "PassStateBlock"){
        			this.analyzePassStateBlock(pChildren[0], pPass);
        		}
        		else {
        			pPass._addCodeFragment(" ");
        			this.analyzePassStateIf(pChildren[0], pPass);
        		}
        	}
        }

        private analyzePassStateSwitch(pNode: IParseNode, pPass: IAFXPassInstruction): void {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	
        	var sCodeFragment: string = "switch";
        	var pSwitchExpr: IAFXExprInstruction = this.analyzeExpr(pChildren[pChildren.length - 3]);
        	pSwitchExpr.prepareFor(EFunctionType.k_PassFunction);

        	pPass._addCodeFragment("(" + pSwitchExpr.toFinalCode() + ")");

        	this.analyzePassCaseBlock(pChildren[0], pPass);
        }

        private analyzePassCaseBlock(pNode: IParseNode, pPass: IAFXPassInstruction): void {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;

        	pPass._addCodeFragment("{");

        	for(var i: uint = pChildren.length - 2; i >= 1; i--){
        		if(pChildren[i].name === "CaseState"){
        			this.analyzePassCaseState(pChildren[i], pPass);
        		}
        		else if(pChildren[i].name === "DefaultState"){
        			this.analyzePassDefault(pChildren[i], pPass);
        		}
        	}

        	pPass._addCodeFragment("}");
        }

        private analyzePassCaseState(pNode: IParseNode, pPass: IAFXPassInstruction): void {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;

        	var pCaseStateExpr: IAFXExprInstruction = this.analyzeExpr(pChildren[pChildren.length - 2]);
        	pCaseStateExpr.prepareFor(EFunctionType.k_PassFunction);

        	pPass._addCodeFragment("case " + pCaseStateExpr.toFinalCode() + ": ");

        	for(var i: uint = pChildren.length - 4; i >= 0; i--){
        		if(pChildren[i].name === "PassState"){
        			this.analyzePassStateForShader(pChildren[i], pPass);
        		}
        		else{
        			pPass._addCodeFragment(pChildren[i].value);
        		}
        	}
        }

        private analyzePassDefault(pNode: IParseNode, pPass: IAFXPassInstruction): void {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;

        	pPass._addCodeFragment("default: ");

        	for(var i: uint = pChildren.length - 3; i >= 0; i--){
        		if(pChildren[i].name === "PassState"){
        			this.analyzePassStateForShader(pChildren[i], pPass);
        		}
        		else {
        			pPass._addCodeFragment(pChildren[i].value);
        		}
        	}
        }

        private analyzeImportDecl(pNode: IParseNode, pTechnique?: IAFXTechniqueInstruction = null): void {
      		this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
		    var sComponentName: string = this.analyzeComplexName(pChildren[pChildren.length - 2]);
		    var iShift: int = 0;

		    if(pChildren[0].name === "ExtOpt"){
		    	WARNING("We don`t suppor ext-commands for import");
		    }
		    if (pChildren.length !== 2) {
		        iShift = this.analyzeShiftOpt(pChildren[0]);
		    }
		    
		    var pComponent: IAFXComponent = this._pComposer.getComponentByName(sComponentName);
		    if (!pComponent) {
		        this._error(EFFECT_BAD_IMPORTED_COMPONENT_NOT_EXIST, { componentName: sComponentName });
		        return;
		    }

		    this.addComponent(pComponent, iShift, pTechnique);
        }

        private analyzeProvideDecl(pNode: IParseNode): void {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;

        	if (pChildren.length === 2) {
		        this._sProvideNameSpace = this.analyzeComplexName(pChildren[0]);
		    }
		    else {
		        this._error(TEMP_EFFECT_UNSUPPORTED_PROVIDE_AS);
		        return;
		    }
        }

        private analyzeShiftOpt(pNode: IParseNode): int {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;

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
        	if(!isNull(pTechnique)){
        		pTechnique.addComponent(pComponent, iShift);
        	}
        	else {
        		if(isNull(this._pGlobalComponentList)){
        			this._pGlobalComponentList = [];
        			this._pGlobalComponetShiftList = [];
        		}

        		this._pGlobalComponentList.push(pComponent);
        		this._pGlobalComponetShiftList.push(iShift);
        	}

        	//TODO: add correct add of compnent, not global
        	
        	var pComponentTechnique: IAFXTechniqueInstruction = pComponent.getTechnique();
        	if(this.isAddedTechnique(pComponentTechnique)){
        		return;
        	}

        	var pSharedListV: IAFXVariableDeclInstruction[] = pComponentTechnique.getSharedVariablesForVertex();
        	var pSharedListP: IAFXVariableDeclInstruction[] = pComponentTechnique.getSharedVariablesForPixel();

        	for(var i: uint = 0; i < pSharedListV.length; i++){
        		this.addExternalSharedVariable(pSharedListV[i], EFunctionType.k_Vertex);
        	}

        	for(var i: uint = 0; i < pSharedListP.length; i++){
        		this.addExternalSharedVariable(pSharedListP[i], EFunctionType.k_Pixel);
        	}

        	if(isNull(this._pAddedTechniqueList)){
        		this._pAddedTechniqueList = [];
        	}

        	this._pAddedTechniqueList.push(pTechnique);
        }

        private isAddedTechnique(pTechnique: IAFXTechniqueInstruction): bool {
        	if(isNull(this._pAddedTechniqueList)){
        		return false;
        	}

        	for(var i: uint = 0; i < this._pAddedTechniqueList.length; i++){
        		if(this._pAddedTechniqueList[i] === pTechnique){
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
        	if(pLeftType._isUnverifiable()){
        		return pLeftType;
        	}

        	if(pRightType._isUnverifiable()){
        		return pRightType;
        	}

        	var isComplex: bool = pLeftType.isComplex() || pRightType.isComplex();
			var isArray: bool = pLeftType.isNotBaseArray() || pRightType.isNotBaseArray();
			var isSampler: bool = Effect.isSamplerType(pLeftType) || Effect.isSamplerType(pRightType);
        	var pBoolType: IAFXVariableTypeInstruction = Effect.getSystemType("bool").getVariableType();

        	if(isArray || isSampler) {
        		return null;
        	}

        	if(sOperator === "%" || sOperator === "%=") {
        		return null;
        	}

        	if(this.isAssignmentOperator(sOperator)){
        		if(!pLeftType.isWritable()){
        			this._error(EFFECT_BAD_TYPE_FOR_WRITE);
        			return null;
        		}

        		if(pLeftType.isStrongEqual(Effect.getSystemType("ptr"))){
					this.addPointerForExtract(pLeftType._getParentVarDecl());
				}

        		if(!pRightType.isReadable()){
        			this._error(EFFECT_BAD_TYPE_FOR_READ);
        			return null;
        		}

        		if(sOperator !== "=" && !pLeftType.isReadable()){
        			this._error(EFFECT_BAD_TYPE_FOR_READ)
        		}
        	}
        	else {
        		if(!pLeftType.isReadable()){
        			this._error(EFFECT_BAD_TYPE_FOR_READ);
        			return null;
        		}

        		if(!pRightType.isReadable()){
        			this._error(EFFECT_BAD_TYPE_FOR_READ);
        			return null;
        		}
        	}

        	if(isComplex){
        		if(sOperator === "=" && pLeftType.isEqual(pRightType)){
        			return <IAFXVariableTypeInstruction>pLeftType;
        		}
        		else if(this.isEqualOperator(sOperator) && !pLeftType._containArray() && !pLeftType._containSampler()) {
        			return pBoolType;
        		}
        		else {
        			return null;
        		}
        	}       	

        	var pReturnType: IAFXVariableTypeInstruction = null;
        	var pLeftBaseType: IAFXVariableTypeInstruction = (<SystemTypeInstruction>pLeftType.getBaseType()).getVariableType();
        	var pRightBaseType: IAFXVariableTypeInstruction = (<SystemTypeInstruction>pRightType.getBaseType()).getVariableType();
        	

        	if(pLeftType.isConst() && this.isAssignmentOperator(sOperator)){
        		return null;
        	}

        	if(pLeftType.isEqual(pRightType)){
        		if(this.isArithmeticalOperator(sOperator)){
        			if(!Effect.isMatrixType(pLeftType) || (sOperator !== "/" && sOperator !== "/=")){
        				return pLeftBaseType;
        			}
        			else {
        				return null;
        			}
        		}
        		else if(this.isRelationalOperator(sOperator)){
        			if(Effect.isScalarType(pLeftType)){
        				return pBoolType;
        			}
        			else {
        				return null;
        			}
        		}
        		else if(this.isEqualOperator(sOperator)){
        			return pBoolType;
        		}
        		else if(sOperator === "="){
        			return pLeftBaseType;
        		}
        		else {
        			return null;
        		}

        	}

        	if(this.isArithmeticalOperator(sOperator)){
        		if (Effect.isBoolBasedType(pLeftType) || Effect.isBoolBasedType(pRightType) ||
        		    Effect.isFloatBasedType(pLeftType) !== Effect.isFloatBasedType(pRightType) ||
        		    Effect.isIntBasedType(pLeftType) !== Effect.isIntBasedType(pRightType)) {
        			return null;
        		}

        		if(Effect.isScalarType(pLeftType)){
        			return pRightBaseType;
        		}

        		if(Effect.isScalarType(pRightType)){
        			return pLeftBaseType;
        		}

        		if(sOperator === "*" || sOperator === "*="){
        			if(Effect.isMatrixType(pLeftType) && Effect.isVectorType(pRightType) &&
        			   pLeftType.getLength() === pRightType.getLength()){
        				return pRightBaseType;
        			}
        			else if(Effect.isMatrixType(pRightType) && Effect.isVectorType(pLeftType) &&
        			   pLeftType.getLength() === pRightType.getLength()){
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

 			if(pType._isUnverifiable === undefined){
 				LOG(pType);
 			}
        	if(pType._isUnverifiable()){
        		return pType;
        	}

        	var isComplex: bool = pType.isComplex();
			var isArray: bool = pType.isNotBaseArray();
			var isSampler: bool = Effect.isSamplerType(pType);

			if(isComplex || isArray || isSampler){
				return null;
			}

			if(!pType.isReadable()){
       			this._error(EFFECT_BAD_TYPE_FOR_READ);
       			return null;
       		}


			if(sOperator === "++" || sOperator === "--"){
				if(!pType.isWritable()){
					this._error(EFFECT_BAD_TYPE_FOR_WRITE);
					return null;
				}

				if(pType.isStrongEqual(Effect.getSystemType("ptr"))){
					this.addPointerForExtract(pType._getParentVarDecl());
				}	

				return pType;			
			}

        	if(sOperator === "!"){
        		var pBoolType: IAFXVariableTypeInstruction = Effect.getSystemType("bool").getVariableType();
        		
        		if(pType.isEqual(pBoolType)){
        			return pBoolType;
        		}
        		else{
        			return null;
        		}
        	}
        	else {
        		if(Effect.isBoolBasedType(pType)){
        			return null;
        		}
        		else{
        			return (<SystemTypeInstruction>pType.getBaseType()).getVariableType();
        		}
        	}

        	//return null;
        }

        private isAssignmentOperator(sOperator: string): bool {
        	return sOperator === "+=" || sOperator === "-=" ||
        		   sOperator === "*=" || sOperator === "/=" ||
        		   sOperator === "%=" || sOperator === "="; 
        }

        private isArithmeticalOperator(sOperator: string): bool{
        	return sOperator === "+" || sOperator === "+=" ||
        		   sOperator === "-" || sOperator === "-=" ||
        		   sOperator === "*" || sOperator === "*=" ||
        		   sOperator === "/" || sOperator === "/=";
        }

        private isRelationalOperator(sOperator: string): bool {
        	return sOperator === ">" || sOperator === ">=" ||
        		   sOperator === "<" || sOperator === "<=";
        }

        private isEqualOperator(sOperator: string): bool {
        	return sOperator === "==" || sOperator === "!=";
        }

        private addExtactionStmts(pStmt: IAFXStmtInstruction): void {
        	var pPointerList: IAFXVariableDeclInstruction[] = this.getPointerForExtractList();
        	
        	for(var i: uint = 0; i < pPointerList.length; i++) {
        		this.generateExtractStmtFromPointer(pPointerList[i], pStmt);
        	}

        	this.clearPointersForExtract();
        }

        private generateExtractStmtFromPointer(pPointer: IAFXVariableDeclInstruction, pParentStmt: IAFXStmtInstruction): IAFXStmtInstruction {
        	var pPointerType: IAFXVariableTypeInstruction = pPointer.getType();
        	var pWhatExtracted: IAFXVariableDeclInstruction = pPointerType._getDownPointer();
        	var pWhatExtractedType: IAFXVariableTypeInstruction = null;

        	var pFunction: IAFXFunctionDeclInstruction = this.getCurrentAnalyzedFunction();

        	while(!isNull(pWhatExtracted)){
        		pWhatExtractedType = pWhatExtracted.getType();

        		if(!pWhatExtractedType.isComplex()){
        			var pSingleExtract: ExtractStmtInstruction = new ExtractStmtInstruction();
        			pSingleExtract.generateStmtForBaseType(
        									pWhatExtracted,
        									pWhatExtractedType.getPointer(),
        									pWhatExtractedType.getVideoBuffer(), 0, null);

        			CHECK_INSTRUCTION(pSingleExtract, ECheckStage.CODE_TARGET_SUPPORT); 

        			pParentStmt.push(pSingleExtract, true);

        			if(!isNull(pFunction)){
        				pFunction._addUsedFunction(pSingleExtract.getExtractFunction());
        			}
        		}
        		else {
        			this.generateExtractStmtForComplexVar(
        									pWhatExtracted, pParentStmt,
        									pWhatExtractedType.getPointer(),
        									pWhatExtractedType.getVideoBuffer(), 0);
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
        	var pVarType: IAFXVariableTypeInstruction = pVarDecl.getType();
        	var pFieldNameList: string[] = pVarType.getFieldNameList();
        	var pField: IAFXVariableDeclInstruction = null;
        	var pFieldType: IAFXVariableTypeInstruction = null;
        	var pSingleExtract: ExtractStmtInstruction = null;

        	var pFunction: IAFXFunctionDeclInstruction = this.getCurrentAnalyzedFunction();

        	for(var i: uint = 0; i < pFieldNameList.length; i++){
        		pField = pVarType.getField(pFieldNameList[i]);

        		if(isNull(pField)){
        			continue;
				}

 				pFieldType = pField.getType();

 				if(pFieldType.isPointer()){
 					var pFieldPointer: IAFXVariableDeclInstruction = pFieldType._getMainPointer();
 					pSingleExtract = new ExtractStmtInstruction();
 					pSingleExtract.generateStmtForBaseType(pFieldPointer, pPointer, pFieldType.getVideoBuffer(), iPadding + pFieldType.getPadding(), null);
 					
 					CHECK_INSTRUCTION(pSingleExtract, ECheckStage.CODE_TARGET_SUPPORT); 

 					pParentStmt.push(pSingleExtract, true);
 					this.generateExtractStmtFromPointer(pFieldPointer, pParentStmt);

 					if(!isNull(pFunction)){
        				pFunction._addUsedFunction(pSingleExtract.getExtractFunction());
        			}
 				}
 				else if(pFieldType.isComplex()) {
 					this.generateExtractStmtForComplexVar(pField, pParentStmt, pPointer, pBuffer, iPadding + pFieldType.getPadding());
 				}
 				else {
 					pSingleExtract = new ExtractStmtInstruction();
        			pSingleExtract.generateStmtForBaseType(pField, pPointer, pBuffer, iPadding + pFieldType.getPadding(), null);
        			
        			CHECK_INSTRUCTION(pSingleExtract, ECheckStage.CODE_TARGET_SUPPORT); 

        			pParentStmt.push(pSingleExtract, true);

        			if(!isNull(pFunction)){
        				pFunction._addUsedFunction(pSingleExtract.getExtractFunction());
        			}
 				}
 	       	}        	
        }
       

		private getNodeSourceLocation(pNode: IParseNode): {line: uint; column: uint;} {
			if(isDef(pNode.line)){
				return {line: pNode.line, column: pNode.start};
			}
			else{
				return this.getNodeSourceLocation(pNode.children[pNode.children.length - 1]);
			}
		}
	}
}

#endif