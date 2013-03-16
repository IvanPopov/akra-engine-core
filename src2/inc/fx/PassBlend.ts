#ifndef AFXPASSBLEND_TS
#define AFXPASSBLEND_TS

#include "IAFXPassBlend.ts"
#include "IAFXComposer.ts"
#include "util/unique.ts"

module akra.fx {
	export class VariableBlendContainer {
		
		private _pVarListMap: IAFXVariableDeclListMap = null;
		private _pVarKeys: string[] = null;

		private _pVarBlendTypeMap: IAFXVariableTypeMap = null;

		inline get keys(): string[] {
			return this._pVarKeys;
		}

		inline getVarList(sKey: string): IAFXVariableDeclInstruction[] {
			return this._pVarListMap[sKey];
		}

		inline getBlendType(sKey: string): IAFXVariableTypeInstruction {
			return this._pVarBlendTypeMap[sKey];
		}

		constructor() {
			this._pVarListMap = <IAFXVariableDeclListMap>{};
			this._pVarKeys = [];

			this._pVarBlendTypeMap = <IAFXVariableTypeMap>{};
		}

		addVariable(pVariable: IAFXVariableDeclInstruction, eBlendMode: EAFXBlendMode): bool {
			var sName: string = pVariable.getRealName();

			if(!isDef(this._pVarListMap[sName])){
				this._pVarListMap[sName] = [pVariable];
				this._pVarKeys.push(sName);

				this._pVarBlendTypeMap[sName] = pVariable.getType();
				
				return true;
			}

			var pBlendType: IAFXVariableTypeInstruction = this._pVarBlendTypeMap[sName].blend(pVariable.getType(), eBlendMode);
			if(isNull(pBlendType)){
				ERROR("Could not blend type for variable '" + sName + "'");
				return false;
			}

			this._pVarListMap[sName].push(pVariable);
			this._pVarBlendTypeMap[sName] = pBlendType;

			return true;
		}
	}

	export class ComplexTypeBlendContainer {
		
		private _pTypeListMap: IAFXTypeMap = null;
		private _pTypeKeys: string[] = null;

		constructor() {
			this._pTypeListMap = <IAFXTypeMap>{};
			this._pTypeKeys = [];
		}

		addComplexType(pComplexType: IAFXTypeInstruction): bool {
			var sName: string = pComplexType.getRealName();

			if(!isDef(this._pTypeListMap[sName])){
				this._pTypeListMap[sName] = pComplexType;
				this._pTypeKeys.push(sName);

				return true;
			}

			var pBlendType: IAFXTypeInstruction = this._pTypeListMap[sName].blend(pComplexType, EAFXBlendMode.k_TypeDecl);
			if(isNull(pBlendType)){
				ERROR("Could not blend type declaration '" + sName + "'");
				return false;
			}

			this._pTypeListMap[sName]= pBlendType;

			return true;
		}

		addFromVarConatiner(pContainer: VariableBlendContainer): bool {
			if(isNull(pContainer)){
				return true;
			}

			var pKeys: string[] = pContainer.keys;

			for(var i: uint = 0; i < pKeys.length; i++){
				var pType: IAFXTypeInstruction = pContainer.getBlendType(pKeys[i]).getBaseType();

				if(pType.isComplex()){
					if(!this.addComplexType(pType)){
						return false;
					}
				}
			}

			return true;
		}
	}

	export class ExtSystemDataContainer {
		private _pExtSystemMacrosList: IAFXSimpleInstruction[] = null;
		private _pExtSystemTypeList: IAFXTypeDeclInstruction[] = null;
		private _pExtSystemFunctionList: IAFXFunctionDeclInstruction[] = null;

		constructor(){
			this._pExtSystemMacrosList = [];
			this._pExtSystemTypeList = [];
			this._pExtSystemFunctionList = [];
		}

		addFromFunction(pFunction: IAFXFunctionDeclInstruction): void {
			var pTypes = pFunction._getExtSystemTypeList();
			var pMacroses = pFunction._getExtSystemMacrosList();
			var pFunctions = pFunction._getExtSystemFunctionList();

			if(!isNull(pTypes)){
				for(var j: uint = 0; j < pTypes.length; j++){
					if(this._pExtSystemTypeList.indexOf(pTypes[j]) === -1){
						this._pExtSystemTypeList.push(pTypes[j]);
					}
				}
			}

			if(!isNull(pMacroses)){
				for(var j: uint = 0; j < pMacroses.length; j++){
					if(this._pExtSystemMacrosList.indexOf(pMacroses[j]) === -1){
						this._pExtSystemMacrosList.push(pMacroses[j]);
					}
				}
			}

			if(!isNull(pFunctions)){
				for(var j: uint = 0; j < pFunctions.length; j++){
					if(this._pExtSystemFunctionList.indexOf(pFunctions[j]) === -1){
						this._pExtSystemFunctionList.push(pFunctions[j]);
					}
				}
			}
		}
	}

	export class PassBlend implements IAFXPassBlend {
		UNIQUE();

		private _pComposer: IAFXComposer = null;
		
		private _pExtSystemDataV: ExtSystemDataContainer = null;
		private _pComplexTypeContainerV: ComplexTypeBlendContainer = null;
		private _pForeignContainerV: VariableBlendContainer = null;
		private _pUniformContainerV: VariableBlendContainer = null;
		private _pSharedContainerV: VariableBlendContainer = null;
		private _pGlobalContainerV: VariableBlendContainer = null;
		private _pAttributeContainerV: VariableBlendContainer = null;
		private _pVaryingContainerV: VariableBlendContainer = null;
		private _pVertexOutType: IAFXTypeInstruction = null;
		private _pUsedFunctionListV: IAFXFunctionDeclInstruction[] = null;

		private _pExtSystemDataP: ExtSystemDataContainer = null;
		private _pComplexTypeContainerP: ComplexTypeBlendContainer = null;
		private _pForeignContainerP: VariableBlendContainer = null;
		private _pUniformContainerP: VariableBlendContainer = null;
		private _pSharedContainerP: VariableBlendContainer = null;
		private _pGlobalContainerP: VariableBlendContainer = null;
		private _pVaryingContainerP: VariableBlendContainer = null;

		private _pUsedFunctionListP: IAFXFunctionDeclInstruction[] = null;

		private _hasEmptyVertex: bool = true;
		private _hasEmptyPixel: bool = true;

		constructor(pComposer: IAFXComposer){
			this._pComposer = pComposer;

			this._pExtSystemDataV = new ExtSystemDataContainer();
			this._pComplexTypeContainerV = new ComplexTypeBlendContainer();
			this._pForeignContainerV = new VariableBlendContainer();
			this._pUniformContainerV = new VariableBlendContainer();
			this._pSharedContainerV = new VariableBlendContainer();
			this._pGlobalContainerV = new VariableBlendContainer();
			this._pAttributeContainerV = new VariableBlendContainer();
			this._pVaryingContainerV = new VariableBlendContainer();
			this._pVertexOutType = Effect.getBaseVertexOutType();
			this._pUsedFunctionListV = [];

			this._pExtSystemDataP = new ExtSystemDataContainer();
			this._pComplexTypeContainerP = new ComplexTypeBlendContainer();
			this._pForeignContainerP = new VariableBlendContainer();
			this._pUniformContainerP = new VariableBlendContainer();
			this._pSharedContainerP = new VariableBlendContainer();
			this._pGlobalContainerP = new VariableBlendContainer();
			this._pVaryingContainerP = new VariableBlendContainer();
			this._pUsedFunctionListP = [];
		}

		initFromPassList(pPassList: IAFXPassInstruction[]): bool {
			for(var i: uint = 0; i < pPassList.length; i++){
				if(!this.addPass(pPassList[i])) {
					return false;
				}
			}

			if(!this.finalizeBlend()){
				return false;
			}

			return true;
		}

		private finalizeBlend(): bool {
			if(!this.finalizeBlendForVertex()) {
				return false;
			}

			if(!this.finalizeBlendForPixel()) {
				return false;
			}

			return true;
		}

		private addPass(pPass: IAFXPassInstruction): bool {
			var pVertex: IAFXFunctionDeclInstruction = pPass.getVertexShader();
			var pPixel: IAFXFunctionDeclInstruction = pPass.getPixelShader();

			var pForeignMap: IAFXVariableDeclMap = null;
			var pGlobalMap: IAFXVariableDeclMap = null;
			var pSharedMap: IAFXVariableDeclMap = null;
			var pUniformMap: IAFXVariableDeclMap = null;
			var pAttributeMap: IAFXVariableDeclMap = null;
			var pVaryingMap: IAFXVariableDeclMap = null;
			var pComplexTypeMap: IAFXTypeMap = null;


			var pForeignKeys: uint[] = null;
			var pGlobalKeys: uint[] = null;
			var pSharedKeys: uint[] = null;
			var pUniformKeys: uint[] = null;
			var pAttributeKeys: uint[] = null;
			var pVaryingKeys: uint[] = null;
			var pComplexTypeKeys: uint[] = null;

			var pForeign: IAFXVariableDeclInstruction = null;
			var pGlobal: IAFXVariableDeclInstruction = null;
			var pShared: IAFXVariableDeclInstruction = null;
			var pUniform: IAFXVariableDeclInstruction = null;
			var pAttribute: IAFXVariableDeclInstruction = null;
			var pVarying: IAFXVariableDeclInstruction = null;
			var pComplexType: IAFXTypeInstruction = null;

			var pUsedFunctionList: IAFXFunctionDeclInstruction[] = null;
			var pUsedFunction: IAFXFunctionDeclInstruction = null;

			if(!isNull(pVertex)) {
				this._hasEmptyVertex = false;

				//blend system data
				this._pExtSystemDataV.addFromFunction(pVertex);

				//blend foreigns
				pForeignMap = pVertex._getForeignVariableMap();
				pForeignKeys = pVertex._getForeignVariableKeys();
				
				if(!isNull(pForeignKeys)){
					for(var i: uint = 0; i < pForeignKeys.length; i++){
						pForeign = pForeignMap[pForeignKeys[i]];

						if(!this._pForeignContainerV.addVariable(pForeign, EAFXBlendMode.k_Foreign)){
							ERROR("Could not add foreign variable");
							return false;
						}
					}	
				}
				
				//blend globals
				pGlobalMap = pVertex._getGlobalVariableMap();
				pGlobalKeys = pVertex._getGlobalVariableKeys();
				
				if(!isNull(pGlobalKeys)){
					for(var i: uint = 0; i < pGlobalKeys.length; i++){
						pGlobal = pGlobalMap[pGlobalKeys[i]];

						if(!this._pGlobalContainerV.addVariable(pGlobal, EAFXBlendMode.k_Global)){
							ERROR("Could not add global variable");
							return false;
						}
					}	
				}
				
				//blend shareds
				pSharedMap = pVertex._getSharedVariableMap();
				pSharedKeys = pVertex._getSharedVariableKeys();
				
				if(!isNull(pSharedKeys)){
					for(var i: uint = 0; i < pSharedKeys.length; i++){
						pShared = pSharedMap[pSharedKeys[i]];

						if(!this._pSharedContainerV.addVariable(pShared, EAFXBlendMode.k_Shared)){
							ERROR("Could not add shared variable");
							return false;
						}
					}
				}

				//TODO: blend uniforms
				pUniformMap = pVertex._getUniformVariableMap();
				pUniformKeys = pVertex._getUniformVariableKeys();
				
				if(!isNull(pUniformKeys)){
					for(var i: uint = 0; i < pUniformKeys.length; i++){
						pUniform = pUniformMap[pUniformKeys[i]];

						if(isNull(pUniform)){
							continue;
						}

						if(!this._pUniformContainerV.addVariable(pUniform, EAFXBlendMode.k_Uniform)){
							ERROR("Could not add uniform variable");
							return false;
						}
					}	
				}

				//TODO: blend attributes
				pAttributeMap = pVertex._getAttributeVariableMap();
				pAttributeKeys = pVertex._getAttributeVariableKeys();
				
				if(!isNull(pAttributeKeys)){
					for(var i: uint = 0; i < pAttributeKeys.length; i++){
						pAttribute = pAttributeMap[pAttributeKeys[i]];

						if(!this._pAttributeContainerV.addVariable(pAttribute, EAFXBlendMode.k_Attribute)){
							ERROR("Could not add attribute variable");
							return false;
						}
					}
				}

				//TODO: blend varyings
				pVaryingMap = pVertex._getVaryingVariableMap();
				pVaryingKeys = pVertex._getVaryingVariableKeys();
				
				if(!isNull(pVaryingKeys)){
					for(var i: uint = 0; i < pVaryingKeys.length; i++){
						pVarying = pVaryingMap[pVaryingKeys[i]];

						if(!this._pVaryingContainerV.addVariable(pVarying, EAFXBlendMode.k_Varying)){
							ERROR("Could not add varying variable");
							return false;
						}
					}
				}

				//blend used type
				pComplexTypeMap = pVertex._getUsedComplexTypeMap();
				pComplexTypeKeys = pVertex._getUsedComplexTypeKeys();
				
				if(!isNull(pComplexTypeKeys)){
					for(var i: uint = 0; i < pComplexTypeKeys.length; i++){
						pComplexType = pComplexTypeMap[pComplexTypeKeys[i]];

						if(!this._pComplexTypeContainerV.addComplexType(pComplexType)){
							ERROR("Could not add type declaration");
							return false;
						}
					}
				}

				//blend used functions
				pUsedFunctionList = pVertex._getUsedFunctionList();

				if(!isNull(pUsedFunctionList)){
					for(var i: uint = 0; i < pUsedFunctionList.length; i++) {
						pUsedFunction = pUsedFunctionList[i];

						if(this._pUsedFunctionListV.indexOf(pUsedFunction) === -1){
							this._pUsedFunctionListV.push(pUsedFunction);
						}
					}
				}

				var pVertexOut: IAFXTypeInstruction = pVertex.getReturnType().getBaseType();

				this._pVertexOutType = this._pVertexOutType.blend(pVertexOut, EAFXBlendMode.k_VertexOut);
			}

			if(!isNull(pPixel)) {
				this._hasEmptyPixel = false;
				//blend system data
				this._pExtSystemDataP.addFromFunction(pPixel);

				//blend foreigns
				pForeignMap = pPixel._getForeignVariableMap();
				pForeignKeys = pPixel._getForeignVariableKeys();
				
				if(!isNull(pForeignKeys)){
					for(var i: uint = 0; i < pForeignKeys.length; i++){
						pForeign = pForeignMap[pForeignKeys[i]];

						if(!this._pForeignContainerP.addVariable(pForeign, EAFXBlendMode.k_Foreign)){
							ERROR("Could not add foreign variable");
							return false;
						}
					}	
				}
				
				//blend globals
				pGlobalMap = pPixel._getGlobalVariableMap();
				pGlobalKeys = pPixel._getGlobalVariableKeys();
				
				if(!isNull(pGlobalKeys)){
					for(var i: uint = 0; i < pGlobalKeys.length; i++){
						pGlobal = pGlobalMap[pGlobalKeys[i]];

						if(!this._pGlobalContainerP.addVariable(pGlobal, EAFXBlendMode.k_Global)){
							ERROR("Could not add global variable");
							return false;
						}
					}
				}	
				
				//blend shareds
				pSharedMap = pPixel._getSharedVariableMap();
				pSharedKeys = pPixel._getSharedVariableKeys();
				
				if(!isNull(pSharedKeys)){
					for(var i: uint = 0; i < pSharedKeys.length; i++){
						pShared = pSharedMap[pSharedKeys[i]];

						if(!this._pSharedContainerP.addVariable(pShared, EAFXBlendMode.k_Shared)){
							ERROR("Could not add shared variable");
							return false;
						}
					}
				}

				//TODO: blend uniforms
				pUniformMap = pPixel._getUniformVariableMap();
				pUniformKeys = pPixel._getUniformVariableKeys();
				
				if(!isNull(pUniformKeys)){
					for(var i: uint = 0; i < pUniformKeys.length; i++){
						pUniform = pUniformMap[pUniformKeys[i]];

						if(isNull(pUniform)){
							continue;
						}
						
						if(!this._pUniformContainerP.addVariable(pUniform, EAFXBlendMode.k_Uniform)){
							ERROR("Could not add uniform variable");
							return false;
						}
					}	
				}

				//TODO: blend varyings
				pVaryingMap = pPixel._getVaryingVariableMap();
				pVaryingKeys = pPixel._getVaryingVariableKeys();
				
				if(!isNull(pVaryingKeys)){
					for(var i: uint = 0; i < pVaryingKeys.length; i++){
						pVarying = pVaryingMap[pVaryingKeys[i]];

						if(!this._pVaryingContainerP.addVariable(pVarying, EAFXBlendMode.k_Varying)){
							ERROR("Could not add varying variable");
							return false;
						}
					}
				}

				//blend used type
				pComplexTypeMap = pPixel._getUsedComplexTypeMap();
				pComplexTypeKeys = pPixel._getUsedComplexTypeKeys();
				
				if(!isNull(pComplexTypeKeys)){
					for(var i: uint = 0; i < pComplexTypeKeys.length; i++){
						pComplexType = pComplexTypeMap[pComplexTypeKeys[i]];

						if(!this._pComplexTypeContainerP.addComplexType(pComplexType)){
							ERROR("Could not add type declaration");
							return false;
						}
					}
				}

				//blend used functions
				pUsedFunctionList = pPixel._getUsedFunctionList();

				if(!isNull(pUsedFunctionList)){
					for(var i: uint = 0; i < pUsedFunctionList.length; i++) {
						pUsedFunction = pUsedFunctionList[i];

						if(this._pUsedFunctionListP.indexOf(pUsedFunction) === -1){
							this._pUsedFunctionListP.push(pUsedFunction);
						}
					}
				}
			}

			return true;
		}

		private finalizeBlendForVertex(): bool {
			if(this._hasEmptyVertex){
				return true;
			}

			if(!this.finalizeComplexTypeFor(EFunctionType.k_Vertex)){
				return false;
			}

			return true;
		}

		private finalizeBlendForPixel(): bool {
			if(this._hasEmptyPixel){
				return true;
			}

			if(!this.finalizeComplexTypeFor(EFunctionType.k_Pixel)){
				return false;
			}

			return true;
		}

		private finalizeComplexTypeFor(eType: EFunctionType): bool {
			var pTypeContainer: ComplexTypeBlendContainer = null;

			var pUniformContainer: VariableBlendContainer = null;
			var pGlobalContainer: VariableBlendContainer = null;
			var pSharedContainer: VariableBlendContainer = null;
			var pUsedFunctions: IAFXFunctionDeclInstruction[] = null;

			var pAttributeContainer: VariableBlendContainer = null;

			
			if(eType === EFunctionType.k_Vertex){
				pTypeContainer = this._pComplexTypeContainerV;
				pUniformContainer = this._pUniformContainerV;
				pGlobalContainer = this._pGlobalContainerV;
				pSharedContainer = this._pSharedContainerV;
				pUsedFunctions = this._pUsedFunctionListV;
				pAttributeContainer = this._pAttributeContainerV;
			}
			else if(eType === EFunctionType.k_Pixel){
				pTypeContainer = this._pComplexTypeContainerP;
				pUniformContainer = this._pUniformContainerP;
				pGlobalContainer = this._pGlobalContainerP;
				pSharedContainer = this._pSharedContainerP;
				pUsedFunctions = this._pUsedFunctionListP;
			}

			if (!pTypeContainer.addFromVarConatiner(pUniformContainer) ||
				!pTypeContainer.addFromVarConatiner(pGlobalContainer) || 
				!pTypeContainer.addFromVarConatiner(pSharedContainer) ||
				!pTypeContainer.addFromVarConatiner(pAttributeContainer)){
				return false;
			}

			if(eType === EFunctionType.k_Vertex){
				pTypeContainer.addComplexType(this._pVertexOutType);
			}

			for(var i: uint = 0; i < pUsedFunctions.length; i++){
				var pReturnBaseType: IAFXTypeInstruction = pUsedFunctions[i].getReturnType().getBaseType();
				if(pReturnBaseType.isComplex()){
					if(!pTypeContainer.addComplexType(pReturnBaseType)){
						return false;
					}
				}
			}

			return true;

		}



	}
}

#endif