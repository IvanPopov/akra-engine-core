#ifndef AFXPASSBLEND_TS
#define AFXPASSBLEND_TS

#include "IAFXPassBlend.ts"
#include "IAFXComposer.ts"
#include "util/unique.ts"
#include "fx/SamplerBlender.ts"
#include "ITexture.ts"
#include "fx/BlendContainers.ts"

#include "fx/TexcoordSwapper.ts"


module akra.fx {
	export class PassBlend implements IAFXPassBlend {
		UNIQUE();

		private _pComposer: IAFXComposer = null;
		private _pShaderProgramByHashMap: IAFXShaderProgramMap = null;

		
		private _pExtSystemDataV: ExtSystemDataContainer = null;
		private _pComplexTypeContainerV: ComplexTypeBlendContainer = null;
		private _pForeignContainerV: VariableBlendContainer = null;
		private _pUniformContainerV: VariableBlendContainer = null;
		private _pSharedContainerV: VariableBlendContainer = null;
		private _pGlobalContainerV: VariableBlendContainer = null;
		private _pAttributeContainerV: AttributeBlendContainer = null;
		private _pVaryingContainerV: VariableBlendContainer = null;
		private _pVertexOutType: IAFXTypeInstruction = null;
		private _pUsedFunctionListV: IAFXFunctionDeclInstruction[] = null;

		private _pPassFunctionListV: IAFXFunctionDeclInstruction[] = null;
		private _pTextureMapV: BoolMap = null;

		private _pExtSystemDataP: ExtSystemDataContainer = null;
		private _pComplexTypeContainerP: ComplexTypeBlendContainer = null;
		private _pForeignContainerP: VariableBlendContainer = null;
		private _pUniformContainerP: VariableBlendContainer = null;
		private _pSharedContainerP: VariableBlendContainer = null;
		private _pGlobalContainerP: VariableBlendContainer = null;
		private _pVaryingContainerP: VariableBlendContainer = null;
		private _pUsedFunctionListP: IAFXFunctionDeclInstruction[] = null;
		private _pPassFunctionListP: IAFXFunctionDeclInstruction[] = null;
		private _pTextureMapP: BoolMap = null;

		private _hasEmptyVertex: bool = true;
		private _hasEmptyPixel: bool = true;


		//Code fragments
		
		private _sUniformSamplerCodeV: string = "";
		private _sAttrDeclCode: string = "";




		private _sUniformSamplerCodeP: string = "";

		private _pDefaultSamplerBlender: SamplerBlender = null;
		private _pTexcoordSwapper: TexcoordSwapper = null;

		static private texcoordSwapper: TexcoordSwapper = null;

		constructor(pComposer: IAFXComposer){
			this._pComposer = pComposer;

			this._pShaderProgramByHashMap = <IAFXShaderProgramMap>{};


			this._pExtSystemDataV = new ExtSystemDataContainer();
			this._pComplexTypeContainerV = new ComplexTypeBlendContainer();
			this._pForeignContainerV = new VariableBlendContainer();
			this._pUniformContainerV = new VariableBlendContainer();
			this._pSharedContainerV = new VariableBlendContainer();
			this._pGlobalContainerV = new VariableBlendContainer();
			this._pAttributeContainerV = new AttributeBlendContainer();
			this._pVaryingContainerV = new VariableBlendContainer();
			this._pVertexOutType = Effect.getBaseVertexOutType();
			this._pUsedFunctionListV = [];
			this._pPassFunctionListV = [];
			this._pTextureMapV = <BoolMap>{};

			this._pExtSystemDataP = new ExtSystemDataContainer();
			this._pComplexTypeContainerP = new ComplexTypeBlendContainer();
			this._pForeignContainerP = new VariableBlendContainer();
			this._pUniformContainerP = new VariableBlendContainer();
			this._pSharedContainerP = new VariableBlendContainer();
			this._pGlobalContainerP = new VariableBlendContainer();
			this._pVaryingContainerP = new VariableBlendContainer();
			this._pUsedFunctionListP = [];
			this._pPassFunctionListP = [];
			this._pTextureMapP = <BoolMap>{};

			this._pDefaultSamplerBlender = Composer.pDefaultSamplerBlender;

			if(isNull(PassBlend.texcoordSwapper)){
				PassBlend.texcoordSwapper = new TexcoordSwapper();
			}

			this._pTexcoordSwapper = PassBlend.texcoordSwapper;
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

		generateShaderProgram(pPassInput: IAFXPassInputBlend,
							  pSurfaceMaterial: ISurfaceMaterial,
							  pBuffer: IBufferMap): IAFXShaderProgram {

			// var pSamplerBlender: SamplerBlender = this._pDefaultSamplerBlender;

			pPassInput.setSurfaceMaterial(pSurfaceMaterial);
			
			var sSamplerPartHash: string = this.prepareSamplers(pPassInput);
			var sMaterialPartHash: string = this.prepareSurfaceMaterial(pSurfaceMaterial);
			var sBufferPartHash: string = this.prepareBufferMap(pBuffer);

			var sTotalHash: string = sSamplerPartHash + sMaterialPartHash + sBufferPartHash;

			var pProgram: IAFXShaderProgram = this.getProgramByHash(sTotalHash);

			if(isNull(pProgram)) {
				this.swapTexcoords(pSurfaceMaterial);
				this.generateShaderCode();
			}


			LOG("generateShaderProgram. HASH: ", sTotalHash, this._pTexcoordSwapper.getTmpDeclCode(),
															 this._pTexcoordSwapper.getTecoordSwapCode());
			// LOG(this._pAttributeContainerV);
			LOG(pBuffer, pBuffer.toString());
			
			return null;
		}

		private inline getProgramByHash(sHash: string): IAFXShaderProgram {
			return this._pShaderProgramByHashMap[sHash] || null;
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
			var pTextureMap: IAFXVariableDeclMap = null;
			var pAttributeMap: IAFXVariableDeclMap = null;
			var pVaryingMap: IAFXVariableDeclMap = null;
			var pComplexTypeMap: IAFXTypeMap = null;


			var pForeignKeys: uint[] = null;
			var pGlobalKeys: uint[] = null;
			var pSharedKeys: uint[] = null;
			var pUniformKeys: uint[] = null;
			var pTextureKeys: uint[] = null;
			var pAttributeKeys: uint[] = null;
			var pVaryingKeys: uint[] = null;
			var pComplexTypeKeys: uint[] = null;

			var pForeign: IAFXVariableDeclInstruction = null;
			var pGlobal: IAFXVariableDeclInstruction = null;
			var pShared: IAFXVariableDeclInstruction = null;
			var pUniform: IAFXVariableDeclInstruction = null;
			var pTexture: IAFXVariableDeclInstruction = null;
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

				//TODO: blend textures
				pTextureMap = pVertex._getTextureVariableMap();
				pTextureKeys = pVertex._getTextureVariableKeys();
				
				if(!isNull(pTextureKeys)){
					for(var i: uint = 0; i < pTextureKeys.length; i++){
						pTexture = pTextureMap[pTextureKeys[i]];

						if(isNull(pTexture)){
							continue;
						}

						this._pTextureMapV[pTexture.getRealName()] = true;
					}	
				}


				//TODO: blend attributes
				pAttributeMap = pVertex._getAttributeVariableMap();
				pAttributeKeys = pVertex._getAttributeVariableKeys();
				
				if(!isNull(pAttributeKeys)){
					for(var i: uint = 0; i < pAttributeKeys.length; i++){
						pAttribute = pAttributeMap[pAttributeKeys[i]];

						if(!this._pAttributeContainerV.addAttribute(pAttribute)){
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

				this._pPassFunctionListV.push(pVertex);
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

				//TODO: blend textures
				pTextureMap = pPixel._getTextureVariableMap();
				pTextureKeys = pPixel._getTextureVariableKeys();
				
				if(!isNull(pTextureKeys)){
					for(var i: uint = 0; i < pTextureKeys.length; i++){
						pTexture = pTextureMap[pTextureKeys[i]];

						if(isNull(pTexture)){
							continue;
						}

						this._pTextureMapP[pTexture.getRealName()] = true;
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

				this._pPassFunctionListP.push(pPixel);
			}

			return true;
		}

		private finalizeBlendForVertex(): bool {
			if(this._hasEmptyVertex){
				return true;
			}

			if(!this.finalizeComplexTypeForShader(EFunctionType.k_Vertex)){
				return false;
			}

			this._pAttributeContainerV.clear();

			return true;
		}

		private finalizeBlendForPixel(): bool {
			if(this._hasEmptyPixel){
				return true;
			}

			if(!this.finalizeComplexTypeForShader(EFunctionType.k_Pixel)){
				return false;
			}

			return true;
		}

		private finalizeComplexTypeForShader(eType: EFunctionType): bool {
			var pTypeContainer: ComplexTypeBlendContainer = null;

			var pUniformContainer: VariableBlendContainer = null;
			var pGlobalContainer: VariableBlendContainer = null;
			var pSharedContainer: VariableBlendContainer = null;
			var pUsedFunctions: IAFXFunctionDeclInstruction[] = null;

			var pAttributeContainer: AttributeBlendContainer = null;

			
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

		private inline hasUniform(pVar: IAFXVariableDeclInstruction): bool {
			return this.hasUniformWithName(pVar.getRealName());
		}

		private inline hasUniformWithName(sName: string): bool {
			return this._pUniformContainerV.hasVariableWithName(sName) ||
				   this._pUniformContainerP.hasVariableWithName(sName);
		}

		private inline getUniformByName(sName: string): IAFXVariableDeclInstruction {
			return this._pUniformContainerV.getVariableByName(sName) ||
				   this._pUniformContainerP.getVariableByName(sName);
		}

		private prepareSamplers(pPassInput: IAFXPassInputBlend): string {
			var pBlender: SamplerBlender = this._pDefaultSamplerBlender;
			pBlender.clear();

			//Gum samplers
			var pSamplers: IAFXSamplerStateMap = pPassInput.samplers;
			var pSamplerKeys: string[] = pPassInput.samplerKeys;

			for(var i: uint = 0; i < pSamplerKeys.length; i++){
				var sName: string = pSamplerKeys[i];

				if(!this.hasUniformWithName(sName)){
					continue;
				}

				var pSampler: IAFXVariableDeclInstruction = this.getUniformByName(sName);
				var pSamplerState: IAFXSamplerState = pSamplers[sName];
				var pTexture: ITexture = pPassInput._getTextureForSamplerState(pSamplerState);

				if(isNull(pTexture)){
					pBlender.addObjectToSlotById(pSampler, ZERO_SLOT);
				}
				else {
					pBlender.addTextureSlot(pTexture.getGuid());
					pBlender.addObjectToSlotById(pSampler, pTexture.getGuid());
				}
			}

			//Gum sampler arrays
			var pSamplerArrays: IAFXSamplerStateListMap = pPassInput.samplerArrays;
			var pSamplerArrayKeys: string[] = pPassInput.samplerArrayKeys;

			for(var i: uint = 0; i < pSamplerArrayKeys.length; i++){
				var sName: string = pSamplerArrayKeys[i];

				if(!this.hasUniformWithName(sName)){
					continue;
				}

				var pSamplerStateList: IAFXSamplerState[] = pSamplerArrays[sName];
				var isNeedToCollapse: bool = true;
				var pTexture: ITexture = null;		
			
				for(var j: uint = 0; j < pSamplerStateList.length; j++) {
					if(j === 0) {
						pTexture = pPassInput._getTextureForSamplerState(pSamplerStateList[i]);
					}
					else {
						if(pTexture !== pPassInput._getTextureForSamplerState(pSamplerStateList[i])){
							isNeedToCollapse = false;
						}
					}
				}

				if(isNeedToCollapse){
					var pSamplerArray: IAFXVariableDeclInstruction = this.getUniformByName(sName);

					if(isNull(pTexture)){
						pBlender.addObjectToSlotById(pSamplerArray, ZERO_SLOT);
					}
					else {
						pBlender.addTextureSlot(pTexture.getGuid());
						pBlender.addObjectToSlotById(pSamplerArray, pTexture.getGuid());
					}
				}
			}

			return pBlender.getHash();
		}

		private inline prepareSurfaceMaterial(pMaterial: ISurfaceMaterial): string{
			return isNull(pMaterial) ? "" :pMaterial._getHash();
		}

		private prepareBufferMap(pMap: IBufferMap): string {
			this._pAttributeContainerV.initFromBufferMap(<util.BufferMap>pMap);
			return this._pAttributeContainerV.getHash();
		}

		private inline swapTexcoords(pMaterial: ISurfaceMaterial): void {
			this._pTexcoordSwapper.generateSwapCode(<core.pool.resources.SurfaceMaterial>pMaterial, 
													this._pAttributeContainerV);
		}

		private isSamplerUsedInShader(pSampler: IAFXVariableDeclInstruction, eType: EFunctionType): bool{
			return (eType === EFunctionType.k_Vertex && this._pUniformContainerV.hasVariable(pSampler)) ||
					(eType === EFunctionType.k_Pixel && this._pUniformContainerP.hasVariable(pSampler));
		}

		private inline generateShaderCode(): void {
			var sVertexCode: string = "";
			var sPixelCode: string = "";

			// this.setAttributes();
			this.reduceSamplers();
			this.reduceAttributes();
		}

		private reduceSamplers(): void {
			var pSamplerBlender: SamplerBlender = this._pDefaultSamplerBlender;
			var iTotalSlots: uint = pSamplerBlender.totalActiveSlots;

			var sUniformSamplerCodeV: string = "";
			var sUniformSamplerCodeP: string = "";

			for(var i: uint = 0; i < iTotalSlots; i++){
				var pSamplers = pSamplerBlender.getSamplersBySlot(i);

				var isInVertex: bool = false;
				var isInPixel: bool = false;

				for (var j: int = 0; j < pSamplers.length; j++) {
					if(i === ZERO_SLOT){
						pSamplers.value(j).defineByZero(true);
					}

					if(this.isSamplerUsedInShader(pSamplers.value(j), EFunctionType.k_Vertex)){
						isInVertex = true;
					}
					if(this.isSamplerUsedInShader(pSamplers.value(j), EFunctionType.k_Pixel)){
						isInPixel = true;
					}
				}

				var sSamplerName: string = "as" + i.toString();

				if(isInVertex){
					sUniformSamplerCodeV += "uniform " + pSamplers.value(0).getType().getBaseType().getRealName() + " " + sSamplerName + ";";
				}

				if(isInPixel){
					sUniformSamplerCodeP += "uniform " + pSamplers.value(0).getType().getBaseType().getRealName() + " " + sSamplerName + ";";
				}
			}


			this._sUniformSamplerCodeV = sUniformSamplerCodeV;
			this._sUniformSamplerCodeP = sUniformSamplerCodeP;
		}

		private reduceAttributes(): void {
			var pAttributeContainer: AttributeBlendContainer = this._pAttributeContainerV;

			var sAttrDeclCode: string = "";

			var pSemantics: string[] = pAttributeContainer.semantics;
			//1) set zero buffer maps for strict pointers attributes
			for(var i: uint = 0; i < pSemantics.length; i++) {
				var sSemantic: string = pSemantics[i];
				var pFlow: IDataFlow = pAttributeContainer.getFlowBySemantic(sSemantic);
				var pAttributeType: IAFXVariableTypeInstruction = pAttributeContainer.getType(sSemantic);
				
				if(isNull(pFlow) && pAttributeType.isStrictPointer()) {
					pAttributeType.getVideoBuffer().defineByZero(true);
				}
			}

			//2) gnerate real attrs
			var iTotalSlots: uint = pAttributeContainer.totalSlots;
			for(var i: uint = 0; i < iTotalSlots; i++){
				var sAttrName: string = "aa" + i.toString();
				var pFlow: IDataFlow = pAttributeContainer.getFlowBySlot(i);
				var pType: IAFXTypeInstruction = pAttributeContainer.getTypeBySlot(i);
				sAttrDeclCode += "attribute " + pType.toFinalCode() + " " + sAttrName + ";"; 
			}

			//3) generate all needed shader vertex input declarations
			
			//4) set real attrs to shader vertex input
			//5) generate samplers for vertexTextures
			this._sAttrDeclCode = sAttrDeclCode;
		}

		private generateSystemData(eType: EFunctionType): string {
			var pExtBlock: ExtSystemDataContainer = null;

			if(eType === EFunctionType.k_Vertex){
				pExtBlock = this._pExtSystemDataV;
			}
			else {
				pExtBlock = this._pExtSystemDataP;
			}

			var sCode: string = "";

			var pMacroses = pExtBlock.macroses;
			var pTypes = pExtBlock.types;
			var pFunctions = pExtBlock.functions;

			for(var i: uint = 0; i < pMacroses.length; i++){
				sCode += pMacroses[i].toFinalCode() + "\n";
			}

			for(var i: uint = 0; i < pTypes.length; i++){
				sCode += pTypes[i].toFinalCode() + "\n";
			}

			for(var i: uint = 0; i < pFunctions.length; i++){
				sCode += pFunctions[i].toFinalCode() + "\n";
			}

			return sCode;
		}

		private generateTypeDels(eType: EFunctionType): string {
			var pTypeBlock: ComplexTypeBlendContainer = null;

			if(eType === EFunctionType.k_Vertex){
				pTypeBlock = this._pComplexTypeContainerV;
			}
			else {
				pTypeBlock = this._pComplexTypeContainerP;
			}

			var sCode: string = "";
			
			var pKeys = pTypeBlock.keys;
			var pTypes = pTypeBlock.types;

			for(var i: uint = 0; i < pKeys.length; i++){
				sCode += pTypes[pKeys[i]]._toDeclString() + ";\n";
			}

			return sCode;
		}

		private generateFunctionDefenitions(eType: EFunctionType): string {
			var pFunctions: IAFXFunctionDeclInstruction[] = null;

			if(eType === EFunctionType.k_Vertex){
				pFunctions = this._pUsedFunctionListV;
			}
			else {
				pFunctions = this._pUsedFunctionListP;
			}

			var sCode: string = "";

			for(var i: uint = 0; i < pFunctions.length; i++){
				sCode += pFunctions[i].toFinalDefCode() + ";\n";
			}

			return sCode;
		}

		private generateSharedVars(eType: EFunctionType): string {
			var pVars: VariableBlendContainer = null;

			if(eType === EFunctionType.k_Vertex){
				pVars = this._pSharedContainerV;
			}
			else {
				pVars = this._pSharedContainerP;
			}

			var sCode: string = "";
			var pKeys = pVars.keys;

			for(var i: uint = 0; i < pKeys.length; i++){
				sCode += pVars.getDeclCodeForVar(pKeys[i]) + ";\n";
			}

			return sCode;
		}

		private generateVertexOut(): string {
			return this._pVertexOutType._toDeclString() + " Out";
		}

		private generateVaryings(eType: EFunctionType): string {
			var pVars: VariableBlendContainer = null;

			if(eType === EFunctionType.k_Vertex){
				pVars = this._pVaryingContainerV;
			}
			else {
				pVars = this._pVaryingContainerP;
			}

			var sCode: string = "";
			var pKeys = pVars.keys;

			for (var i: int = 0; i < pKeys.length; i++) {
				sCode += "varying " + pVars.getDeclCodeForVar(pKeys[i]) + ";\n";
			}

			return sCode;
		}

		private generateUniformVars(eType: EFunctionType): string {
			var pVars: VariableBlendContainer = null;

			if(eType === EFunctionType.k_Vertex){
				pVars = this._pUniformContainerV;
			}
			else {
				pVars = this._pUniformContainerP;
			}

			var sCode: string = "";
			var pKeys = pVars.keys;

			for(var i: uint = 0; i < pKeys.length; i++){
				if(pVars.getBlendType(pKeys[i]).isSampler()){
					continue;
				}

				sCode += "uniform " + pVars.getDeclCodeForVar(pKeys[i]) + ";\n";
			}

			return sCode;
		}

		// private generateUniformSamplers(eType: EFunctionType): string {
		// 	var pSamplerBlender: I = null;

		// 	if(eType === EFunctionType.k_Vertex){
		// 		pVars = this._pUniformContainerV;
		// 	}
		// 	else {
		// 		pVars = this._pUniformContainerP;
		// 	}

		// 	var sCode: string = "";
		// 	var pKeys = pVars.keys;

		// 	for(var i: uint = 0; i < pKeys.length; i++){
		// 		if(pVars.getBlendType(pKeys[i]).isSampler()){
		// 			continue;
		// 		}
				
		// 		sCode += "uniform " + pVars.getDeclCodeForVar(pKeys[i]) + ";\n";
		// 	}

		// 	return sCode;
		// }

		private generateGlobalVars(eType: EFunctionType): string {
			var pVars: VariableBlendContainer = null;

			if(eType === EFunctionType.k_Vertex){
				pVars = this._pGlobalContainerV;
			}
			else {
				pVars = this._pGlobalContainerP;
			}

			var sCode: string = "";
			var pKeys = pVars.keys;

			for(var i: uint = 0; i < pKeys.length; i++){
				sCode += pVars.getDeclCodeForVar(pKeys[i]) + ";\n";
			}

			return sCode;
		}

		private generateFunctions(eType: EFunctionType): string {
			var pFunctions: IAFXFunctionDeclInstruction[] = null;

			if(eType === EFunctionType.k_Vertex){
				pFunctions = this._pUsedFunctionListV;
			}
			else {
				pFunctions = this._pUsedFunctionListP;
			}

			var sCode: string = "";

			for(var i: uint = 0; i < pFunctions.length; i++){
				sCode += pFunctions[i].toFinalCode() + ";\n";
			}

			return sCode;
		}

		private generatePassFunctions(eType: EFunctionType): string {
			var pFunctions: IAFXFunctionDeclInstruction[] = null;

			if(eType === EFunctionType.k_Vertex){
				pFunctions = this._pPassFunctionListV;
			}
			else {
				pFunctions = this._pPassFunctionListP;
			}

			var sCode: string = "";

			for(var i: uint = 0; i < pFunctions.length; i++){
				sCode += pFunctions[i].toFinalCode() + ";\n";
			}

			return sCode;
		}

		private generateAttributes(): string {
			return "";
		}
		
		// private inline setAttributes()

	}
}

#endif