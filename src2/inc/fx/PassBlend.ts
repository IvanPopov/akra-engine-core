#ifndef AFXPASSBLEND_TS
#define AFXPASSBLEND_TS

#include "IAFXPassBlend.ts"
#include "IAFXComposer.ts"
#include "util/unique.ts"
#include "fx/SamplerBlender.ts"
#include "ITexture.ts"
#include "fx/BlendContainers.ts"
#include "fx/TexcoordSwapper.ts"
#include "fx/Maker.ts"



module akra.fx {
	export class PassBlend implements IAFXPassBlend {
		UNIQUE();

		private _pComposer: IAFXComposer = null;
		private _pFXMakerByHashMap: IAFXMakerMap = null;

		
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
		// private _isZeroSampler2dV: bool = false;
		// private _isZeroSamplerCubeV: bool = false;
		private _sUniformSamplerCodeV: string = "";

		private _sAttrBufferDeclCode: string = "";
		private _sAttrDeclCode: string = "";
		private _sAFXAttrDeclCode: string = "";
		private _sAttrBufferInitCode: string = "";
		private _sAFXAttrInitCode: string = "";

		private _sSystemExtBlockCodeV: string = "";
		private _sFunctionDefCodeV: string = "";
		private _sSharedVarCodeV: string = "";
		private _sVaryingDeclCodeV: string = "";
		private _sVertexOutDeclCode: string = "";
		private _sVertexOutToVaryingCode: string = "";
		private _sPassFunctionCallCodeV: string = "";


		// private _isZeroSampler2dP: bool = false;
		// private _isZeroSamplerCubeP: bool = false;
		private _sUniformSamplerCodeP: string = ""; 
		
		private _sSystemExtBlockCodeP: string = "";
		private _sFunctionDefCodeP: string = "";
		private _sSharedVarCodeP: string = "";
		private _sVaryingDeclCodeP: string = "";
		private _sPassFunctionCallCodeP: string = "";


		private _sVertexCode: string = "";
		private _sPixelCode: string = "";

		private _pDefaultSamplerBlender: SamplerBlender = null;
		private _pTexcoordSwapper: TexcoordSwapper = null;

		//For speed-up
		private _pSamplerByIdMap: IAFXVariableDeclMap = null;
		private _pSamplerIdList: uint[] = null;

		private _pSamplerArrayByIdMap: IAFXVariableDeclMap = null;
		private _pSamplerArrayIdList: uint[] = null;

		static private texcoordSwapper: TexcoordSwapper = null;

		constructor(pComposer: IAFXComposer){
			this._pComposer = pComposer;

			this._pFXMakerByHashMap = <IAFXMakerMap>{};

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

		generateFXMaker(pPassInput: IAFXPassInputBlend,
					    pSurfaceMaterial: ISurfaceMaterial,
					    pBuffer: IBufferMap, isFirst?: bool = true): IAFXMaker {

			pPassInput.setSurfaceMaterial(pSurfaceMaterial);

			var sSamplerPartHash: string = this.prepareSamplers(pPassInput);
			var sMaterialPartHash: string = this.prepareSurfaceMaterial(pSurfaceMaterial);
			var sBufferPartHash: string = this.prepareBufferMap(pBuffer);

			var sTotalHash: string = sSamplerPartHash + "|" + sMaterialPartHash + "|" + sBufferPartHash;

			var pMaker: IAFXMaker = this.getMakerByHash(sTotalHash);

			if(isNull(pMaker)) {

				this.applyForeigns(pPassInput);
				this.swapTexcoords(pSurfaceMaterial);
				this.generateShaderCode();

				pMaker = new Maker(this._pComposer);
				var isCreate: bool = pMaker._create(this._sVertexCode, this._sPixelCode);
				if(!isCreate){
					return null;
				}

				pMaker._initInput(pPassInput, this._pDefaultSamplerBlender, this._pAttributeContainerV);

				this._pFXMakerByHashMap[sTotalHash] = pMaker;
				
			}

			this._pDefaultSamplerBlender.clear();

			return pMaker;
		}

		private inline getMakerByHash(sHash: string): IAFXMaker {
			return this._pFXMakerByHashMap[sHash] || null;
		}

		private finalizeBlend(): bool {
			if(!this.finalizeBlendForVertex()) {
				return false;
			}

			if(!this.finalizeBlendForPixel()) {
				return false;
			}

			this.prepareFastObjects();

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

				if(pVertexOut.isComplex()){
					this._pVertexOutType = this._pVertexOutType.blend(pVertexOut, EAFXBlendMode.k_VertexOut);
				}
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

			this._pAttributeContainerV.finalize();
			this._pAttributeContainerV.generateOffsetMap();

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

		private enableVaringPrefixes(eType: EFunctionType, bEnabled: bool): void {
			var pVars: VariableBlendContainer = null;

			if(eType === EFunctionType.k_Vertex){
				pVars = this._pVaryingContainerV;
			}
			else {
				pVars = this._pVaryingContainerP;
			}

			var pKeys: string[] = pVars.keys;

			for(var i: uint = 0; i < pKeys.length; i++){
				var sName: string = pKeys[i];
				var pVarList: IAFXVariableDeclInstruction[] = pVars.getVarList(sName);

				for(var j: uint = 0; j < pVarList.length; j++) {
					pVarList[j]._markAsVarying(bEnabled);
				}
			}
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

			// if(eType === EFunctionType.k_Vertex){
			// 	pTypeContainer.addComplexType(this._pVertexOutType);
			// }

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

			//Gum samplers
			
			var pSamplers: IAFXSamplerStateMap = pPassInput.samplers;
			var pSamplersId: uint[] = this._pSamplerIdList;

			for(var i: uint = 0; i < pSamplersId.length; i++){
				var pSampler: IAFXVariableDeclInstruction = this._pSamplerByIdMap[pSamplersId[i]];
				var sName: string = pSampler.getRealName();

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
			var pSamplerArraysId: uint[] = this._pSamplerArrayIdList;

			for(var i: uint = 0; i < pSamplerArraysId.length; i++){
				var pSamplerArray: IAFXVariableDeclInstruction = this._pSamplerArrayByIdMap[pSamplerArraysId[i]];
				var sName: string = pSamplerArray.getRealName();

				var pSamplerStateList: IAFXSamplerState[] = pSamplerArrays[sName];
				var isNeedToCollapse: bool = true;
				var pTexture: ITexture = null;	
				var iLength: uint = pPassInput.samplerArrayLength[sName];	
			
				for(var j: uint = 0; j < iLength; j++) {
					if(j === 0) {
						pTexture = pPassInput._getTextureForSamplerState(pSamplerStateList[j]);
					}
					else {
						if(pTexture !== pPassInput._getTextureForSamplerState(pSamplerStateList[j])){
							isNeedToCollapse = false;
						}
					}
				}
				
				if(isNeedToCollapse){					
					pSamplerArray._setCollapsed(true);

					if(isNull(pTexture)){
						pBlender.addObjectToSlotById(pSamplerArray, ZERO_SLOT);
					}
					else {
						pBlender.addTextureSlot(pTexture.getGuid());
						pBlender.addObjectToSlotById(pSamplerArray, pTexture.getGuid());
					}
				}
				else {
					pSamplerArray._setCollapsed(false);
				}
			}

			return pBlender.getHash();
		}

		private inline prepareSurfaceMaterial(pMaterial: ISurfaceMaterial): string{
			return isNull(pMaterial) ? "" : pMaterial._getHash();
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

		private applyForeigns(pPassInput: IAFXPassInputBlend): void {
			var pForeignValues: any = pPassInput.foreigns;
			var pKeys: string[] = pPassInput.foreignKeys;

			var pForeignsV = this._pForeignContainerV;
			var pForeignsP = this._pForeignContainerP;

			for(var i: uint = 0; i < pKeys.length; i++){
				var sName: string = pKeys[i];
				var pVarList: IAFXVariableDeclInstruction[] = null;

				if(pForeignsV.hasVariableWithName(sName)){
					pVarList = pForeignsV.getVarList(sName);
					
					for(var j: uint = 0; j < pVarList.length; j++){
						pVarList[j].setValue(pForeignValues[sName] || 1);
					}
				}
				if(pForeignsP.hasVariableWithName(sName)){
					pVarList = pForeignsP.getVarList(sName);
					
					for(var j: uint = 0; j < pVarList.length; j++){
						pVarList[j].setValue(pForeignValues[sName] || 1);
					}
				}
			}
		}

		private inline generateShaderCode(): void {
			this.clearCodeFragments();
			this.reduceSamplers();
			this.reduceAttributes();

			this._sVertexCode = this.generateCodeForVertex();
			this._sPixelCode = this.generateCodeForPixel();

			this._pDefaultSamplerBlender.clearSamplerNames();
		}

		private generateCodeForVertex(): string {
			var sCode: string = "";
			var eType: EFunctionType = EFunctionType.k_Vertex;

			sCode = /*"precision lowp float;" + "\n" + */
					this.generateSystemExtBlock(eType) + "\n" +
					
					this.generateTypeDels(eType) + "\n" +
					this.generateFunctionDefenitions(eType) + "\n" +
					
					this.generateSharedVars(eType) + "\n" +
					
					this.generateVertexOut() + "\n";

			this.enableVaringPrefixes(eType, true);
			sCode += this.generateVaryings(eType) + "\n";
			this.enableVaringPrefixes(eType, false);
					
			sCode += this.generateUniformSamplers(eType) + "\n" +
					this.generateUniformVars(eType) + "\n" +
					this.generateAttrBuffers() + "\n" +

					this.generateGlobalVars(eType) + "\n" + 
					this.generateFunctions(eType) + "\n" +

					this.generateRealAttrs() + "\n" +
					this.generateAFXAttrs() + "\n" + 

					this.generatePassFunctions(eType) + "\n" +

					"void main() {\n" +

					this.generateAttrBufferInit() + "\n" +
					this.generateAFXAttrInit() + "\n" +

					this.generateTexcoordSwap() + "\n" +

					this.generatePassFunctionCall(eType) + "\n" +

					this.generateVertexOutToVaryings() + "\n" +

					"}";

			return sCode;
		}

		private generateCodeForPixel(): string {
			if(this._hasEmptyPixel){
				return "void main(){}";
			}

			var sCode: string = "";
			var eType: EFunctionType = EFunctionType.k_Pixel;


			this.enableVaringPrefixes(eType, true);
			sCode = this.generateSystemExtBlock(eType) + "\n" +
					
					this.generateTypeDels(eType) + "\n" +
					this.generateFunctionDefenitions(eType) + "\n" +
					
					this.generateSharedVars(eType) + "\n" +
					
					this.generateVaryings(eType) + "\n" +
					
					this.generateUniformSamplers(eType) + "\n" +
					this.generateUniformVars(eType) + "\n" +

					this.generateGlobalVars(eType) + "\n" + 
					this.generateFunctions(eType) + "\n" +

					this.generatePassFunctions(eType) + "\n" +

					"void main() {\n" +

					this.generatePassFunctionCall(eType) + "\n" +

					"}";
			this.enableVaringPrefixes(eType, false);

			return sCode;
		}

		private clearCodeFragments(): void {
			this._sUniformSamplerCodeV = "";

			this._sAttrBufferDeclCode = "";
			this._sAttrDeclCode = "";
			this._sAFXAttrDeclCode = "";
			this._sAttrBufferInitCode = "";
			this._sAFXAttrInitCode = "";

			this._sUniformSamplerCodeP = "";
		}

		private reduceSamplers(): void {
			var pSamplerBlender: SamplerBlender = this._pDefaultSamplerBlender;
			var iTotalSlots: uint = pSamplerBlender.totalActiveSlots;

			var sUniformSamplerCodeV: string = "";
			var sUniformSamplerCodeP: string = "";

			var isZeroSampler2DV: bool = false;
			var isZeroSamplerCubeV: bool = false;
			var isZeroSampler2DP: bool = false;
			var isZeroSamplerCubeP: bool = false;

			for(var i: uint = 0; i < iTotalSlots; i++){
				var pSamplers = pSamplerBlender.getSamplersBySlot(i);

				var isInVertex: bool = false;
				var isInPixel: bool = false;

				var sSamplerName: string = "as" + i.toString();

				for (var j: int = 0; j < pSamplers.length; j++) {
					if(i === ZERO_SLOT){
						pSamplers.value(j).defineByZero(true);

						if(this.isSamplerUsedInShader(pSamplers.value(j), EFunctionType.k_Vertex)){
							if(pSamplers.value(j).getType().isSampler2D()) {
								isZeroSampler2DV = true;
							}
							else {
								isZeroSamplerCubeV = true;
							}
						}

						if(this.isSamplerUsedInShader(pSamplers.value(j), EFunctionType.k_Pixel)){
							if(pSamplers.value(j).getType().isSampler2D()) {
								isZeroSampler2DP = true;
							}
							else {
								isZeroSamplerCubeP = true;
							}
						}
					}
					else{
						if(this.isSamplerUsedInShader(pSamplers.value(j), EFunctionType.k_Vertex)){
							isInVertex = true;
						}
						if(this.isSamplerUsedInShader(pSamplers.value(j), EFunctionType.k_Pixel)){
							isInPixel = true;
						}
					}

					pSamplers.value(j).setRealName(sSamplerName);
				}


				if(i === ZERO_SLOT){
					if(isZeroSampler2DV){
						sUniformSamplerCodeV += "uniform sampler2D as0;";
					}
					if(isZeroSamplerCubeV){
						sUniformSamplerCodeV += "uniform samplerCube asc0;"
					}
					if(isZeroSampler2DP){
						sUniformSamplerCodeP += "uniform sampler2D as0;";
					}
					if(isZeroSamplerCubeP){
						sUniformSamplerCodeP += "uniform samplerCube asc0;"
					}
				}
				else {
					if(isInVertex){
						sUniformSamplerCodeV += "uniform " + pSamplers.value(0).getType().getBaseType().getRealName() + " " + sSamplerName + ";";
					}

					if(isInPixel){
						sUniformSamplerCodeP += "uniform " + pSamplers.value(0).getType().getBaseType().getRealName() + " " + sSamplerName + ";";
					}
				}
			}


			this._sUniformSamplerCodeV = sUniformSamplerCodeV;
			this._sUniformSamplerCodeP = sUniformSamplerCodeP;
		}

		private reduceAttributes(): void {
			var pAttributeContainer: AttributeBlendContainer = this._pAttributeContainerV;
			var pSemantics: string[] = pAttributeContainer.semantics;
			
			var nPreparedBufferSlots: int = -1;
			var nPreparedAttributeSlots: int = -1;

			for(var i: uint = 0; i < pSemantics.length; i++) {
				var sSemantic: string = pSemantics[i];
				var pFlow: IDataFlow = pAttributeContainer.getFlowBySemantic(sSemantic);
				var pAttributes: IAFXVariableDeclInstruction[] = pAttributeContainer.getAttributeList(sSemantic);
				var iBufferSlot: uint = -1;
				var iSlot: uint = -1;
				var sAttrName: string = "";
				//1) set buffer maps for shader attribures
				if(isNull(pFlow)) {
					for(var j: uint = 0; j < pAttributes.length; j++){
						if(pAttributes[j].getType().isStrictPointer()){
							pAttributes[j].getType().getVideoBuffer().defineByZero(true);
						}
					}
				}
				else {
					iSlot = pAttributeContainer.getSlotBySemantic(sSemantic);
					iBufferSlot = pAttributeContainer.getBufferSlotBySemantic(sSemantic);

					sAttrName = "aa" + iSlot.toString();

					if(iBufferSlot >= 0){
						var sSamplerBufferName: string = "abs" + iBufferSlot.toString();
						var sHeaderBufferName: string = "abh" + iBufferSlot.toString();

						var pBufferVar: IAFXVariableDeclInstruction = null;

						for(var j: uint = 0; j < pAttributes.length; j++){
							pBufferVar = pAttributes[j].getType().getVideoBuffer();
							pBufferVar.setVideoBufferRealName(sSamplerBufferName, sHeaderBufferName);
						}

						if(iBufferSlot > nPreparedBufferSlots) {
							var pBufferVar: IAFXVariableDeclInstruction =  pAttributes[0].getType().getVideoBuffer();
							this._sAttrBufferDeclCode = pBufferVar.toFinalCode() + ";\n";
							this._sAttrBufferInitCode = pBufferVar._getVideoBufferInitExpr().toFinalCode() + ";\n";
							nPreparedBufferSlots++;
						}
					}

					//2) gnerate real attrs
					if(iSlot > nPreparedAttributeSlots){
						this._sAttrDeclCode += "attribute " + pAttributeContainer.getTypeBySlot(i).toFinalCode() + " " + sAttrName + ";\n"; 
						nPreparedAttributeSlots++;
					}
				}

				// 3) add afx attributes 
				var pAttribute: IAFXVariableDeclInstruction = pAttributeContainer.getAttribute(sSemantic);
				var pAttributeType: IAFXVariableTypeInstruction = pAttribute.getType();

				this._sAFXAttrDeclCode += pAttribute.toFinalCode() + ";\n";

				if (pAttributeType.isStrictPointer() || 
					(pAttributeType.isPointer() && iBufferSlot >= 0)){

					var pAttrSubDecls: IAFXVariableDeclInstruction[] = pAttribute.getSubVarDecls();

					for(var j: uint = 0; j < pAttrSubDecls.length; j++){
						this._sAFXAttrDeclCode += pAttrSubDecls[j].toFinalCode() + ";\n";
					}
				}

				if(iSlot >= 0){
					if(iBufferSlot >= 0){
						this._sAFXAttrInitCode += pAttributeType._getMainPointer().getRealName() + "=" + sAttrName + ";";
						this._sAFXAttrInitCode += pAttribute._getAttrExtractionBlock().toFinalCode();
					}
					else {
						this._sAFXAttrInitCode += pAttribute.getRealName() + "=" + sAttrName + ";";
					}
				}
			}
		}

		private generateSystemExtBlock(eType: EFunctionType): string {
			var pExtBlock: ExtSystemDataContainer = null;

			if(eType === EFunctionType.k_Vertex){
				pExtBlock = this._pExtSystemDataV;
				if(this._sSystemExtBlockCodeV !== ""){
					return this._sSystemExtBlockCodeV;
				}
			}
			else {
				pExtBlock = this._pExtSystemDataP;
				if(this._sSystemExtBlockCodeP !== ""){
					return this._sSystemExtBlockCodeP;
				}
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


			if(eType === EFunctionType.k_Vertex){
				this._sSystemExtBlockCodeV = sCode;
			}
			else {
				sCode = "#define AKRA_FRAGMENT 1\n" + 
						"#ifdef GL_ES\nprecision highp float;\n#endif\n" +
						"#extension GL_OES_standard_derivatives : enable\n"
						sCode;
				this._sSystemExtBlockCodeP = sCode;
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
				if(this._sFunctionDefCodeV !== ""){
					return this._sFunctionDefCodeV;
				}
			}
			else {
				pFunctions = this._pUsedFunctionListP;
				if(this._sFunctionDefCodeP !== ""){
					return this._sFunctionDefCodeP;
				}
			}

			var sCode: string = "";

			for(var i: uint = 0; i < pFunctions.length; i++){
				sCode += pFunctions[i].toFinalDefCode() + ";\n";
			}

			if(eType === EFunctionType.k_Vertex){
				this._sFunctionDefCodeV = sCode;
			}
			else {
				this._sFunctionDefCodeP = sCode;
			}

			return sCode;
		}

		private generateSharedVars(eType: EFunctionType): string {
			var pVars: VariableBlendContainer = null;

			if(eType === EFunctionType.k_Vertex){
				pVars = this._pSharedContainerV;
				if(this._sSharedVarCodeV !== ""){
					return this._sSharedVarCodeV;
				}
			}
			else {
				pVars = this._pSharedContainerP;
				if(this._sSharedVarCodeP !== ""){
					return this._sSharedVarCodeP;
				}
			}

			var sCode: string = "";
			var pKeys = pVars.keys;

			for(var i: uint = 0; i < pKeys.length; i++){
				sCode += pVars.getDeclCodeForVar(pKeys[i]) + ";\n";
			}

			if(eType === EFunctionType.k_Vertex){
				this._sSharedVarCodeV = sCode;
			}
			else {
				this._sSharedVarCodeP = sCode;
			}

			return sCode;
		}

		private generateVertexOut(): string {
			if(this._sVertexOutDeclCode === ""){
				this._sVertexOutDeclCode = this._pVertexOutType._toDeclString() + " Out;\n";
			}

			return this._sVertexOutDeclCode;
		}

		private generateVaryings(eType: EFunctionType): string {
			var pVars: VariableBlendContainer = null;

			if(eType === EFunctionType.k_Vertex){
				pVars = this._pVaryingContainerV;

				if(this._sVaryingDeclCodeV !== ""){
					return this._sVaryingDeclCodeV;
				}
			}
			else {
				pVars = this._pVaryingContainerP;
				if(this._sVaryingDeclCodeP !== ""){
					return this._sVaryingDeclCodeP;
				}
			}

			var sCode: string = "";
			var pKeys = pVars.keys;

			for (var i: int = 0; i < pKeys.length; i++) {
				sCode += "varying " + pVars.getDeclCodeForVar(pKeys[i]) + ";\n";
			}

			if(eType === EFunctionType.k_Vertex){
				this._sVaryingDeclCodeV = sCode;
			}
			else {
				this._sVaryingDeclCodeP = sCode;
			}

			return sCode;
		}

		private generateUniformSamplers(eType: EFunctionType): string {
			if(eType === EFunctionType.k_Vertex){
				return this._sUniformSamplerCodeV;
			}
			else {
				return this._sUniformSamplerCodeP;
			}
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
				var pVar: IAFXVariableDeclInstruction = pVars.getVariableByName(pKeys[i]);
				var pType: IAFXVariableTypeInstruction = pVars.getBlendType(pKeys[i]);
				if (pType.isSampler() && 
					(!pType.isArray() || pVar.isDefinedByZero() || pVar._isCollapsed())){
					continue;
				}

				sCode += "uniform " + pVars.getDeclCodeForVar(pKeys[i]) + ";\n";
			}

			return sCode;
		}

		private inline generateAttrBuffers(): string {
			return this._sAttrBufferDeclCode;
		}

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
				sCode += pFunctions[i].toFinalCode() + "\n";
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
				sCode += pFunctions[i].toFinalCode() + "\n";
			}

			return sCode;
		}

		private inline generateRealAttrs(): string {
			return this._sAttrDeclCode;
		}


		private inline generateAFXAttrs(): string {
			return this._sAFXAttrDeclCode;
		}

		private inline generateAttrBufferInit(): string {
			return this._sAttrBufferInitCode;
		}

		private inline generateAFXAttrInit(): string {
			return this._sAFXAttrInitCode;
		}

		private inline generateTexcoordSwap(): string {
			return this._pTexcoordSwapper.getTmpDeclCode() + "\n" + 
				   this._pTexcoordSwapper.getTecoordSwapCode();
		}

		private inline generatePassFunctionCall(eType: EFunctionType): string {
			var pFunctions: IAFXFunctionDeclInstruction[] = null;

			if(eType === EFunctionType.k_Vertex){
				pFunctions = this._pPassFunctionListV;
				if(this._sPassFunctionCallCodeV !== ""){
					return this._sPassFunctionCallCodeV;
				}
			}
			else {
				pFunctions = this._pPassFunctionListP;				
				if(this._sPassFunctionCallCodeP !== ""){
					return this._sPassFunctionCallCodeP;
				}
			}

			var sCode = "";

			for(var i: uint = 0; i < pFunctions.length; i++){
				sCode += pFunctions[i].getRealName() + "();\n";
			}

			if(eType === EFunctionType.k_Vertex){
				this._sPassFunctionCallCodeV = sCode;
			}
			else {
				this._sPassFunctionCallCodeP = sCode;
			}

			return sCode;
		}		


		private generateVertexOutToVaryings(): string {
			if(this._sVertexOutToVaryingCode !== ""){
				return this._sVertexOutToVaryingCode;
			}

			var pVars: VariableBlendContainer = this._pVaryingContainerV;
			var pKeys: string[] = pVars.keys;
			var sCode: string = "";

			sCode += "gl_Position=Out.POSITION;\ngl_PointSize=Out.PSIZE;\n";
			for(var i: uint = 0; i < pKeys.length; i++) {
				var sName: string = pKeys[i];
				if(sName !== "POSITION" && sName !== "PSIZE"){
					sCode += "V_"+sName + "=" + "Out." + sName + ";\n";
				}
			}

			this._sVertexOutToVaryingCode = sCode;
			return this._sVertexOutToVaryingCode;
		}


		private prepareFastObjects(): void {
			this.prepareFastSamplers(EFunctionType.k_Vertex);
			this.prepareFastSamplers(EFunctionType.k_Pixel);
		}

		private prepareFastSamplers(eType: EFunctionType): void {
			if(isNull(this._pSamplerByIdMap)){
				this._pSamplerByIdMap = <IAFXVariableDeclMap>{};
				this._pSamplerIdList = [];

				this._pSamplerArrayByIdMap = <IAFXVariableDeclMap>{};
				this._pSamplerArrayIdList = [];
			}

			var pContainer: VariableBlendContainer = eType === EFunctionType.k_Vertex ? 
														this._pUniformContainerV : this._pUniformContainerP;
			var pKeys: string[] = pContainer.keys;

			for(var i: uint = 0; i < pKeys.length; i++) {
				var pVar: IAFXVariableDeclInstruction = pContainer.getVariableByName(pKeys[i]);

				if(pVar.getType().isSampler()) {
					var id: uint = pVar._getInstructionID();

					if(!pVar.getType().isArray() && !isDef(this._pSamplerByIdMap[id])){							
						this._pSamplerByIdMap[id] = pVar;
						this._pSamplerIdList.push(id);
					}
					else if(pVar.getType().isArray() && !isDef(this._pSamplerArrayByIdMap[id])) {
						this._pSamplerArrayByIdMap[id] = pVar;
						this._pSamplerArrayIdList.push(id);
					}
				}
			}

		}
	}
}

#endif