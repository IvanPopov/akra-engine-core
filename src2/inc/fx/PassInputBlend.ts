#ifndef PASSINPUTBLEND_TS
#define PASSINPUTBLEND_TS

#include "IAFXPassInputBlend.ts"
#include "util/Color.ts"

#define FAST_SET_INPUT_UNIFORM(sName, pValue) if(this.hasUniform(sName)) this.uniforms[sName] = pValue;
#define FAST_SET_SAMPLER_TEXTURE(sName, pTexture) if(this.hasUniform(sName)) this.samplers[sName].texture = pTexture;

module akra.fx {

	export inline function createSamplerState(): IAFXSamplerState {
		return <IAFXSamplerState>{ 
			textureName: "",
			texture: null,
			wrap_s: ETextureWrapModes.CLAMP_TO_EDGE,
			wrap_t: ETextureWrapModes.CLAMP_TO_EDGE,
			mag_filter: ETextureFilters.LINEAR,
			min_filter: ETextureFilters.LINEAR
		};
	}

    export interface IAFXShaderVarTypeMap {
		[index: string]: EAFXShaderVariableType;
		[index: uint]: EAFXShaderVariableType;
	}

	export class PassInputBlend implements IAFXPassInputBlend {
		private _isFirstInit: bool = true;
		private _pCreator: IAFXComponentPassInputBlend = null;


		private _pUniformTypeMap: IAFXShaderVarTypeMap = null;
		private _isUniformArrayMap: BoolMap = null;

		private _pForeignTypeMap: IAFXShaderVarTypeMap = null;

		private _pTextureTypeMap: IAFXShaderVarTypeMap = null;


		private _bNeedToCalcBlend: bool = true;
		private _bNeedToCalcShader: bool = true;

		private _iLastPassBlendId: uint = 0;
		private _iLastShaderId: uint = 0;

		private _pMaterialContainer: any = {
			"DIFFUSE" 	: new Vec4(),
			"AMBIENT" 	: new Vec4(),
			"SPECULAR" 	: new Vec4(),
			"EMISSIVE" 	: new Vec4(),
			"SHININESS" : 1.
		};


		samplers: IAFXSamplerStateMap = null;
		samplerArrays: IAFXSamplerStateListMap = null; 
		samplerArrayLength: IntMap = null;

		uniforms: any = null;
		foreigns: any = null;
		textures: any = null;

		samplerKeys: string[] = null;
		samplerArrayKeys: string[] = null;

		uniformKeys: string[] = null;
		foreignKeys: string[] = null;
		textureKeys: string[] = null;

		renderStates: IRenderStateMap = null;


		constructor(pCreator: IAFXComponentPassInputBlend){
			this._pCreator = pCreator;

			this.init();
		}

		hasTexture(sName: string): bool {
			if(!this._pTextureTypeMap[sName]){
				this._pTextureTypeMap[sName] = EAFXShaderVariableType.k_NotVar;
				return false;
			}

			return true;
		}

		hasUniform(sName: string): bool {
			if(!this._pUniformTypeMap[sName]){
				this._pUniformTypeMap[sName] = EAFXShaderVariableType.k_NotVar;
				return false;
			}
			else {
				return true;
			}
		}

		setUniform(sName: string, pValue: any): void {
			var eType: EAFXShaderVariableType = this._pUniformTypeMap[sName];

			if(!eType){
				this._pUniformTypeMap[sName] = EAFXShaderVariableType.k_NotVar;
				return;
			}

			if (eType === EAFXShaderVariableType.k_Sampler2D || 
				eType === EAFXShaderVariableType.k_SamplerCUBE) {
				var isArray: bool = this._isUniformArrayMap[sName];

				if (isArray) {
					this.setSamplerArray(sName, pValue);
				}
				else {
					this.setSampler(sName, pValue);
				}

				return;
			}

			//Check type

			this.uniforms[sName] = pValue;
		}

		setForeign(sName: string, pValue: any): void {		
			if(!this._pForeignTypeMap[sName]){
				this._pForeignTypeMap[sName] = EAFXShaderVariableType.k_NotVar;
				return;
			}

			//Check type

			var pOldValue: any = this.foreigns[sName];

			if(pOldValue !== pValue) {
				this._bNeedToCalcBlend = true;
				this._bNeedToCalcShader = true;
			}

			this.foreigns[sName] = pValue;
		}

		inline setSampler(sName: string, pValue: IAFXSamplerState): void {
			PassInputBlend.copySamplerState(pValue, this.samplers[sName]);
		}

		setSamplerTexture(sName: string, sTexture: string): void;
		setSamplerTexture(sName: string, pTexture: ITexture): void;
		setSamplerTexture(sName: string, pTexture: any): void {
			if(this.hasUniform(sName)){
				if(isString(pTexture)){
					this.samplers[sName].textureName = pTexture;
				}
				else {
					var pState: IAFXSamplerState = this.samplers[sName];
					pState.texture = pTexture;

					if (!isNull(pTexture)) {
						pState.min_filter = pTexture.getFilter(ETextureParameters.MIN_FILTER);
						pState.mag_filter = pTexture.getFilter(ETextureParameters.MAG_FILTER);
						pState.wrap_s = pTexture.getWrapMode(ETextureParameters.WRAP_S);
						pState.wrap_t = pTexture.getWrapMode(ETextureParameters.WRAP_T);
					}
				}
			}
		}

		_setSamplerTextureObject(sName: string, pTexture: ITexture):void {
			if(this.hasUniform(sName)){
				var pState: IAFXSamplerState = this.samplers[sName];
				pState.texture = pTexture;

				
				if (!isNull(pTexture)) {
					pState.min_filter = pTexture.getFilter(ETextureParameters.MIN_FILTER);
					pState.mag_filter = pTexture.getFilter(ETextureParameters.MAG_FILTER);
					pState.wrap_s = pTexture.getWrapMode(ETextureParameters.WRAP_S);
					pState.wrap_t = pTexture.getWrapMode(ETextureParameters.WRAP_T);
				}
			}
		}

		setSamplerArray(sName: string, pValue: IAFXSamplerState[]): void {
			if(!isNull(pValue)){
				for (var i: int = 0; i < pValue.length; i++) {
					PassInputBlend.copySamplerState(pValue[i], this.samplerArrays[sName][i]);
				}

				this.samplerArrayLength[sName] = pValue.length;
			}
			else {
				this.samplerArrayLength[sName] = 0;
			}
		}

		inline setStruct(sName: string, pValue: any): void {
			this.setUniform(sName, pValue);
		}

		static copySamplerState(pFrom: IAFXSamplerState, pTo: IAFXSamplerState): void {
			pTo.textureName = pFrom.textureName;
			pTo.texture = pFrom.texture;

			pTo.wrap_s = pFrom.wrap_s;
			pTo.wrap_t = pFrom.wrap_t;

			pTo.mag_filter = pFrom.mag_filter;
			pTo.min_filter = pFrom.min_filter;
		}

		//complete
		setTexture(sName: string, pValue: any): void {
			if(!this._pTextureTypeMap[sName]){
				this._pTextureTypeMap[sName] = EAFXShaderVariableType.k_NotVar;
				return;
			}

			//Check type

			this.textures[sName] = pValue;
		}


		setSurfaceMaterial(pSurfaceMaterial: ISurfaceMaterial): void {
			if(isNull(pSurfaceMaterial)){
				return ;
			}
			// var pSurfaceMaterial: core.pool.resources.SurfaceMaterial = pSurfaceMaterial;
			var iTotalTextures: uint = pSurfaceMaterial.totalTextures;
			for (var i: int = 0; i < iTotalTextures; i++) {
			 	// var iTexcord: int = pSurfaceMaterial[i].texcoord(i);
			 	this.setTexture("TEXTURE" + i.toString(), pSurfaceMaterial.texture(i) || null);
			}

			var pMaterial: IMaterial = pSurfaceMaterial.material;
			var pMatContainer: any = this._pMaterialContainer;

			pMatContainer.DIFFUSE.set(pMaterial.diffuse.r, pMaterial.diffuse.g, pMaterial.diffuse.b, pMaterial.diffuse.a);
			pMatContainer.AMBIENT.set(pMaterial.ambient.r, pMaterial.ambient.g, pMaterial.ambient.b, pMaterial.ambient.a);
			pMatContainer.SPECULAR.set(pMaterial.specular.r, pMaterial.specular.g, pMaterial.specular.b, pMaterial.specular.a);
			pMatContainer.EMISSIVE.set(pMaterial.emissive.r, pMaterial.emissive.g, pMaterial.emissive.b, pMaterial.emissive.a);
			pMatContainer.SHININESS = pMaterial.shininess;

			FAST_SET_INPUT_UNIFORM("MATERIAL", pMatContainer);

			// FAST_SET_SAMPLER_TEXTURE("S_DIFFUSE", pSurfaceMaterial.texture(ESurfaceMaterialTextures.DIFFUSE) || null);
			// FAST_SET_SAMPLER_TEXTURE("S_AMBIENT", pSurfaceMaterial.texture(ESurfaceMaterialTextures.AMBIENT) || null);
			// FAST_SET_SAMPLER_TEXTURE("S_SPECULAR", pSurfaceMaterial.texture(ESurfaceMaterialTextures.SPECULAR) || null);
			// FAST_SET_SAMPLER_TEXTURE("S_EMISSIVE", pSurfaceMaterial.texture(ESurfaceMaterialTextures.EMISSIVE) || null);
			// FAST_SET_SAMPLER_TEXTURE("S_NORMAL", pSurfaceMaterial.texture(ESurfaceMaterialTextures.NORMAL) || null);
			
			this._setSamplerTextureObject("S_DIFFUSE", pSurfaceMaterial.texture(ESurfaceMaterialTextures.DIFFUSE) || null);
			this._setSamplerTextureObject("S_AMBIENT", pSurfaceMaterial.texture(ESurfaceMaterialTextures.AMBIENT) || null);
			this._setSamplerTextureObject("S_SPECULAR", pSurfaceMaterial.texture(ESurfaceMaterialTextures.SPECULAR) || null);
			this._setSamplerTextureObject("S_EMISSIVE", pSurfaceMaterial.texture(ESurfaceMaterialTextures.EMISSIVE) || null);
			this._setSamplerTextureObject("S_NORMAL", pSurfaceMaterial.texture(ESurfaceMaterialTextures.NORMAL) || null);
			
			// if(this.hasUniform("MATERIAL.DIFFUSE")) this.uniforms["MATERIAL.DIFFUSE"] = pMatContainer.DIFFUSE;
			// if(this.hasUniform("MATERIAL.AMBIENT")) this.uniforms["MATERIAL.AMBIENT"] = pMatContainer.AMBIENT;
			// if(this.hasUniform("MATERIAL.SPECULAR")) this.uniforms["MATERIAL.SPECULAR"] = pMatContainer.SPECULAR;
			// if(this.hasUniform("MATERIAL.EMISSIVE")) this.uniforms["MATERIAL.EMISSIVE"] = pMatContainer.EMISSIVE;
			// if(this.hasUniform("MATERIAL.SHININESS")) this.uniforms["MATERIAL.SHININESS"] = pMatContainer.SHININESS;
			// this.setUniform("MATERIAL.DIFFUSE", util.colorToVec4(pMaterial.diffuse));
			// this.setUniform("MATERIAL.AMBIENT", util.colorToVec4(pMaterial.ambient));
			// this.setUniform("MATERIAL.SPECULAR", util.colorToVec4(pMaterial.specular));
			// this.setUniform("MATERIAL.EMISSIVE", util.colorToVec4(pMaterial.emissive));
			// this.setUniform("MATERIAL.SHININESS", pMaterial.shininess);
		}

		inline setRenderState(eState: ERenderStates, eValue: ERenderStateValues): void {
			this.renderStates[eState] = eValue;
		}

		inline _getUnifromLength(sName: string): uint {
			return this._pCreator.uniformByRealName[sName].getType().getLength();
		}

		inline _getUniformType(sName: string): EAFXShaderVariableType {
			return this._pUniformTypeMap[sName];
		}

		inline _getSamplerState(sName: string): IAFXSamplerState {
			return this.samplers[sName];
		}

		inline _getSamplerTexture(sName: string): ITexture {
			return this._getTextureForSamplerState(this._getSamplerState(sName));
		}

		_getTextureForSamplerState(pSamplerState: IAFXSamplerState): ITexture {
			var pTexture: ITexture = null;

			if(!isNull(pSamplerState.texture)){
				pTexture = pSamplerState.texture;
			}
			else if(pSamplerState.textureName !== ""){
				if(this.hasTexture(pSamplerState.textureName)){
					pTexture = this.textures[pSamplerState.textureName];
				}
			}

			return pTexture;
		}

		_release(): void {
			for(var i: uint = 0; i < this.uniformKeys.length; i++){
				this.uniforms[this.uniformKeys[i]] = null;
			}

			for(var i: uint = 0; i < this.foreignKeys.length; i++){
				this.foreigns[this.foreignKeys[i]] = null;
			}

			for(var i: uint = 0; i < this.textureKeys.length; i++){
				this.textures[this.textureKeys[i]] = null;
			}

			for(var i: uint = 0; i < this.samplerKeys.length; i++){
				this.clearSamplerState(this.samplers[this.samplerKeys[i]]);
			}

			for(var i: uint = 0; i < this.samplerArrayKeys.length; i++){
				var pStateList: IAFXSamplerState[] = this.samplerArrays[this.samplerArrayKeys[i]];

				for(var j: uint = 0; j < pStateList.length; j++){
					this.clearSamplerState(pStateList[j]);
				}

				this.samplerArrayLength[this.samplerArrayKeys[i]] = 0;
			}

			this._pCreator.releasePassInput(this);

			this._bNeedToCalcShader = true;
			this._bNeedToCalcBlend = true;
		}


		inline _isNeedToCalcBlend(): bool {
			return this._bNeedToCalcBlend;
		}

		inline _isNeedToCalcShader(): bool {
			return this._bNeedToCalcBlend || this._bNeedToCalcShader;
		}

		inline _getLastPassBlendId(): uint {
			return this._iLastPassBlendId;
		}

		inline _getLastShaderId(): uint {
			return this._iLastShaderId;
		}

		inline _setPassBlendId(id: uint): void {
			this._iLastPassBlendId = id;
		}

		inline _setShaderId(id: uint): void {
			this._iLastShaderId = id;
		}

		inline _getAFXUniformVar(sName: string): IAFXVariableDeclInstruction {
			return this._pCreator.uniformByRealName[sName];
		}

		private init(): void {
			this._pUniformTypeMap = <IAFXShaderVarTypeMap>{};
			this._isUniformArrayMap = <BoolMap>{};
			this._pForeignTypeMap = <IAFXShaderVarTypeMap>{};
			this._pTextureTypeMap = <IAFXShaderVarTypeMap>{};

			this.samplers = <IAFXSamplerStateMap>{};
			this.samplerArrays = <IAFXSamplerStateListMap>{};
			this.samplerArrayLength = <IntMap>{};

			this.uniforms = <any>{};
			this.foreigns = <any>{};
			this.textures = <any>{};

			this.renderStates = fx.createPassStateMap();

			var pUniformKeys: string[] = this._pCreator.uniformRealNameList;
			var pForeignKeys: string[] = this._pCreator.foreignNameList;
			var pTextureKeys: string[] = this._pCreator.textureRealNameList;

			var pUniformMap: IAFXVariableDeclMap = this._pCreator.uniformByRealName;
			var pForeignMap: IAFXVariableDeclMap = this._pCreator.foreignByName;
			var pTextureMap: IAFXVariableDeclMap = this._pCreator.textureByRealName;
			var pUniformDafaultValues: any = this._pCreator.uniformDefaultValue;

			var eType: EAFXShaderVariableType = 0;
			var sName: string = "";
			var isArray: bool = false;

			for(var i: uint = 0; i < pUniformKeys.length; i++){
				sName = pUniformKeys[i];

				eType = PassInputBlend.getVariableType(pUniformMap[sName]);
				isArray = this.isVarArray(pUniformMap[sName]);

				this._pUniformTypeMap[sName] = eType;
				this._isUniformArrayMap[sName] = isArray;

				if(eType === EAFXShaderVariableType.k_Sampler2D || eType === EAFXShaderVariableType.k_SamplerCUBE){
					var hasDefaultValue: bool = !isNull(pUniformDafaultValues[sName]);

					if(isArray){
						if(hasDefaultValue){
							this.samplerArrays[sName] = new Array(pUniformDafaultValues[sName].length);
							this.samplerArrayLength[sName] = this.samplerArrays[sName].length;
						}
						else {
							this.samplerArrays[sName] = new Array(16);
							this.samplerArrayLength[sName] = 0;
						}
						

						for(var j: uint = 0; j < this.samplerArrays[sName].length; j++) {
							var pNewState: IAFXSamplerState = createSamplerState();

							if(hasDefaultValue){
								var pDefaultState: IAFXSamplerState = pUniformDafaultValues[sName][j];
								pNewState.textureName = pDefaultState.textureName;
								pNewState.wrap_s = pDefaultState.wrap_s || pNewState.wrap_s;
								pNewState.wrap_t = pDefaultState.wrap_t || pNewState.wrap_t;
								pNewState.mag_filter = pDefaultState.mag_filter || pNewState.mag_filter;
								pNewState.min_filter = pDefaultState.min_filter || pNewState.min_filter;
							}

							this.samplerArrays[sName][j] = pNewState;
						}

					}
					else {
						var pNewState: IAFXSamplerState = createSamplerState();

						if(hasDefaultValue){
							var pDefaultState: IAFXSamplerState = pUniformDafaultValues[sName];
							pNewState.textureName = pDefaultState.textureName;
							pNewState.wrap_s = pDefaultState.wrap_s || pNewState.wrap_s;
							pNewState.wrap_t = pDefaultState.wrap_t || pNewState.wrap_t;
							pNewState.mag_filter = pDefaultState.mag_filter || pNewState.mag_filter;
							pNewState.min_filter = pDefaultState.min_filter || pNewState.min_filter;
						}

						this.samplers[sName] = pNewState;
					}
				}
				else {
					this.uniforms[sName] = pUniformDafaultValues[sName];
				}
			}

			for(var i: uint = 0; i < pForeignKeys.length; i++){
				sName = pForeignKeys[i];
				eType = PassInputBlend.getVariableType(pForeignMap[sName]);

				this._pForeignTypeMap[sName] = eType;
				this.foreigns[sName] = null;
			}

			for(var i: uint = 0; i < pTextureKeys.length; i++){
				sName = pTextureKeys[i];
				eType = EAFXShaderVariableType.k_Texture;

				this._pTextureTypeMap[sName] = eType;
				this.textures[sName] = null;
			}

			this.samplerKeys = Object.keys(this.samplers);
			this.samplerArrayKeys = Object.keys(this.samplerArrays);
			this.uniformKeys = Object.keys(this.uniforms);
			this.foreignKeys = Object.keys(this.foreigns);
			this.textureKeys = Object.keys(this.textures);
		}

		static getVariableType(pVar: IAFXVariableDeclInstruction): EAFXShaderVariableType {
			var sBaseType: string = pVar.getType().getBaseType().getName();

			switch(sBaseType){
				case "texture":
					return EAFXShaderVariableType.k_Texture;
        
		        case "float":
		        	return EAFXShaderVariableType.k_Float;
		        case "int":
		        	return EAFXShaderVariableType.k_Int;
		        case "bool":
		        	return EAFXShaderVariableType.k_Bool;

		        case "float2":
		        	return EAFXShaderVariableType.k_Float2;
		        case "int2":
		        	return EAFXShaderVariableType.k_Int2;
		        case "bool2":
		        	return EAFXShaderVariableType.k_Bool2;

		        case "float3":
		        	return EAFXShaderVariableType.k_Float3;
		        case "int3":
		        	return EAFXShaderVariableType.k_Int3;
		        case "bool3":
		        	return EAFXShaderVariableType.k_Bool3;

		        case "float4":
		        	return EAFXShaderVariableType.k_Float4;
		        case "int4":
		        	return EAFXShaderVariableType.k_Int4;
		        case "bool4":
		        	return EAFXShaderVariableType.k_Bool4;

		        case "float2x2":
		        	return EAFXShaderVariableType.k_Float2x2;
		        case "float3x3":
		        	return EAFXShaderVariableType.k_Float3x3;
		        case "float4x4":
		        	return EAFXShaderVariableType.k_Float4x4;

		        case "sampler":
		        case "sampler2D":
		        	return EAFXShaderVariableType.k_Sampler2D;
		        case "samplerCUBE":
		        	return EAFXShaderVariableType.k_SamplerCUBE;

		       	default: 
		       		if(pVar.getType().isComplex()){
		       			return EAFXShaderVariableType.k_Complex;
		       		}
		       		else {
		       			return EAFXShaderVariableType.k_NotVar;
		       		}
			}
		}

		private inline isVarArray(pVar: IAFXVariableDeclInstruction): bool {
			return pVar.getType().isNotBaseArray();
		}

		private clearSamplerState(pState: IAFXSamplerState): void {
			pState.textureName = "";
			pState.texture = null;
			pState.wrap_s = ETextureWrapModes.CLAMP_TO_EDGE;
			pState.wrap_t = ETextureWrapModes.CLAMP_TO_EDGE;
			pState.mag_filter = ETextureFilters.LINEAR;
			pState.min_filter = ETextureFilters.LINEAR;
		}
	}
}

#endif