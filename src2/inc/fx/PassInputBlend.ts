#ifndef PASSINPUTBLEND_TS
#define PASSINPUTBLEND_TS

#include "IAFXPassInputBlend.ts"
#include "IAFXVariableContainer.ts"
#include "util/Color.ts"

#define FAST_SET_INPUT_UNIFORM(sName, pValue) if(this.hasUniform(sName)) this.uniforms[this._getUniformVarNameIndex(sName)] = pValue;
//#define FAST_SET_SAMPLER_TEXTURE(sName, pTexture) if(this.hasUniform(sName)) this.samplers[sName].texture = pTexture;

module akra.fx {

	export inline function createSamplerState(): IAFXSamplerState {
		return <IAFXSamplerState>{ 
			textureName: "",
			texture: null,
			wrap_s: ETextureWrapModes.UNDEF,
			wrap_t: ETextureWrapModes.UNDEF,
			mag_filter: ETextureFilters.UNDEF,
			min_filter: ETextureFilters.UNDEF
			/*wrap_s: ETextureWrapModes.CLAMP_TO_EDGE,
			wrap_t: ETextureWrapModes.CLAMP_TO_EDGE,
			mag_filter: ETextureFilters.LINEAR,
			min_filter: ETextureFilters.LINEAR*/
		};
	}

    export interface IAFXShaderVarTypeMap {
		//[index: string]: EAFXShaderVariableType;
		[index: uint]: EAFXShaderVariableType;
	}

	export class PassInputBlend implements IAFXPassInputBlend {
		UNIQUE()
		private _isFirstInit: bool = true;
		private _pCreator: IAFXComponentPassInputBlend = null;

		// private _bNeedToCalcBlend: bool = true;
		// private _bNeedToCalcShader: bool = true;

		private _iLastPassBlendId: uint = 0;
		private _iLastShaderId: uint = 0;

		private _pMaterialContainer: any = {
			"DIFFUSE" 	: new Vec4(),
			"AMBIENT" 	: new Vec4(),
			"SPECULAR" 	: new Vec4(),
			"EMISSIVE" 	: new Vec4(),
			"SHININESS" : 1.
		};

		//need for accelerate setSurfaceMaterial
		private _nLastSufraceMaterialTextureUpdates: uint = 0;
		private _nLastSamplerUpdates: uint = 0;
		private _pLastSurfaceMaterial: ISurfaceMaterial = null;

		private _isFirstSetSurfaceNaterial: bool = true;
		private _pMaterialNameIndices: any = {
			diffuse: 0,
			ambient: 0,
			specular: 0,
			emissive: 0,
			normal: 0,
			material: 0,
			textures: new Array(16)
		};

		private _nSamplerUpdates: uint = 0;
		private _nForeignUpdates: uint = 0;

		samplers: IAFXSamplerStateMap = null;
		samplerArrays: IAFXSamplerStateListMap = null; 
		samplerArrayLength: IntMap = null;

		uniforms: any = null;
		foreigns: any = null;
		textures: any = null;

		samplerKeys: uint[] = null;
		samplerArrayKeys: uint[] = null;

		uniformKeys: uint[] = null;
		foreignKeys: uint[] = null;
		textureKeys: uint[] = null;

		renderStates: IRenderStateMap = null;

		inline get totalSamplerUpdates(): uint {
			return  this._nSamplerUpdates;
		}

		inline get totalForeignUpdates(): uint {
			return this._nForeignUpdates;
		}

		constructor(pCreator: IAFXComponentPassInputBlend){
			this._pCreator = pCreator;

			this.init();
		}

		hasUniform(sName: string): bool {
			return this._pCreator.uniforms.hasVariableWithRealName(sName);
		}

		hasTexture(sName: string): bool {
			return this._pCreator.textures.hasVariableWithRealName(sName);
		}

		hasForeign(sName: string): bool {
			return this._pCreator.foreigns.hasVariableWithRealName(sName);
		}

		setUniform(sName: string, pValue: any): void {
			var iIndex: uint = this._pCreator.uniforms.getIndexByRealName(sName);

			if(iIndex === 0){
				return;
			}

			var pInfo: IAFXVariableInfo = this._pCreator.uniforms.getVarInfoByIndex(iIndex);

			if (pInfo.type === EAFXShaderVariableType.k_Sampler2D || 
				pInfo.type === EAFXShaderVariableType.k_SamplerCUBE) {

				if (pInfo.isArray) {
					for (var i: int = 0; i < pValue.length; i++) {
						this.copySamplerState(pValue[i], this.samplerArrays[iIndex][i]);
					}

					this.samplerArrayLength[iIndex] = pValue.length;
				}
				else {
					this.copySamplerState(pValue, this.samplers[iIndex]);
				}

				return;
			}

			//Check type

			this.uniforms[iIndex] = pValue;
		}

		setTexture(sName: string, pValue: any): void {
			var iIndex: uint = this._pCreator.textures.getIndexByRealName(sName);

			if(iIndex === 0){
				return;
			}

			//Check type

			if(this.textures[iIndex] !== pValue){
				this._nSamplerUpdates++;
			}

			this.textures[iIndex] = pValue;
		}

		setForeign(sName: string, pValue: any): void {
			var iIndex: uint = this._pCreator.foreigns.getIndexByRealName(sName);

			if(iIndex === 0){
				return;
			}

			//Check type

			var pOldValue: any = this.foreigns[iIndex];

			if(pOldValue !== pValue) {
				// this._bNeedToCalcBlend = true;
				// this._bNeedToCalcShader = true;
				this._nForeignUpdates++;
			}

			this.foreigns[iIndex] = pValue;
		}

		setSampler(sName: string, pValue: IAFXSamplerState): void {
			var iIndex: uint = this._pCreator.uniforms.getIndexByRealName(sName);

			if(iIndex === 0){
				return;
			}

			var eType: EAFXShaderVariableType = this._pCreator.uniforms.getTypeByIndex(iIndex);

			if (eType !== EAFXShaderVariableType.k_Sampler2D &&
				eType !== EAFXShaderVariableType.k_SamplerCUBE) {

				return;
			}

			this.copySamplerState(pValue, this.samplers[iIndex]);
		}

		setSamplerArray(sName: string, pValue: IAFXSamplerState[]): void {
			var iIndex: uint = this._pCreator.uniforms.getIndexByRealName(sName);

			if(iIndex === 0){
				return;
			}

			var eType: EAFXShaderVariableType = this._pCreator.uniforms.getTypeByIndex(iIndex);

			if (eType !== EAFXShaderVariableType.k_Sampler2D &&
				eType !== EAFXShaderVariableType.k_SamplerCUBE) {

				return;
			}

			if(!isNull(pValue)){
				for (var i: int = 0; i < pValue.length; i++) {
					this.copySamplerState(pValue[i], this.samplerArrays[iIndex][i]);
				}

				this.samplerArrayLength[iIndex] = pValue.length;
			}
			else {
				this.samplerArrayLength[iIndex] = 0;
			}			
		}

		setSamplerTexture(sName: string, sTexture: string): void;
		setSamplerTexture(sName: string, pTexture: ITexture): void;
		setSamplerTexture(sName: string, pTexture: any): void {
			var iIndex: uint = this._pCreator.uniforms.getIndexByRealName(sName);

			if(iIndex === 0){
				return;
			}

			var eType: EAFXShaderVariableType = this._pCreator.uniforms.getTypeByIndex(iIndex);

			if (eType !== EAFXShaderVariableType.k_Sampler2D &&
				eType !== EAFXShaderVariableType.k_SamplerCUBE){

				return;
			}
			var pState: IAFXSamplerState = this.samplers[iIndex];

			if(isString(pTexture)){
				if (!isNull(pTexture) || pState.textureName !== pTexture){
					this._nSamplerUpdates++;
				}

				pState.textureName = pTexture;
				pState.texture = null;
			}
			else {
				if(pState.texture !== pTexture){
					this._nSamplerUpdates++;
				}

				pState.texture = pTexture;
			}
		}

		_setSamplerTextureObject(sName: string, pTexture: ITexture):void {
			var iIndex: uint = this._pCreator.uniforms.getIndexByRealName(sName);

			if(iIndex === 0){
				return;
			}

			var eType: EAFXShaderVariableType = this._pCreator.uniforms.getTypeByIndex(iIndex);

			if (eType !== EAFXShaderVariableType.k_Sampler2D &&
				eType !== EAFXShaderVariableType.k_SamplerCUBE){

				return;
			}

			var pState: IAFXSamplerState = this.samplers[iIndex];
			
			if(pState.texture !== pTexture){
				this._nSamplerUpdates++;
			}

			pState.texture = pTexture;
		}		

		inline setStruct(sName: string, pValue: any): void {
			this.setUniform(sName, pValue);
		}

		setSurfaceMaterial(pSurfaceMaterial: ISurfaceMaterial): void {
			if(isNull(pSurfaceMaterial)){
				return;
			}

			if(this._isFirstSetSurfaceNaterial){
				for (var i: int = 0; i < 16; i++) {
				 	if(this.hasTexture("TEXTURE" + i.toString())){
				 		this._pMaterialNameIndices.textures[i] = this._pCreator.textures.getIndexByRealName("TEXTURE" + i.toString());
					}
					else {
						this._pMaterialNameIndices.textures[i] = 0;
					}
				}

				this._pMaterialNameIndices.material = this.hasUniform("MATERIAL") ? 
														this._pCreator.uniforms.getIndexByRealName("MATERIAL") : 0;

				this._pMaterialNameIndices.diffuse = this.hasUniform("S_DIFFUSE") ? 
														this._pCreator.uniforms.getIndexByRealName("S_DIFFUSE") : 0;
				this._pMaterialNameIndices.ambient = this.hasUniform("S_AMBIENT") ? 
														this._pCreator.uniforms.getIndexByRealName("S_AMBIENT") : 0;
				this._pMaterialNameIndices.specular = this.hasUniform("S_SPECULAR") ? 
														this._pCreator.uniforms.getIndexByRealName("S_SPECULAR") : 0;
				this._pMaterialNameIndices.emissive = this.hasUniform("S_EMISSIVE") ? 
														this._pCreator.uniforms.getIndexByRealName("S_EMISSIVE") : 0;
				this._pMaterialNameIndices.normal = this.hasUniform("S_NORMAL") ? 
														this._pCreator.uniforms.getIndexByRealName("S_NORMAL") : 0;

				this._isFirstSetSurfaceNaterial = false;
			}

			if (this._nLastSamplerUpdates !== this._nSamplerUpdates || 
				this._pLastSurfaceMaterial !== pSurfaceMaterial ||
				this._nLastSufraceMaterialTextureUpdates !== pSurfaceMaterial.totalUpdatesOfTextures){

				var iTotalTextures: uint = pSurfaceMaterial.totalTextures;
				for (var i: int = 0; i < 16; i++) {
				 	if(this._pMaterialNameIndices.textures[i] > 0){
				 		this.textures[this._pMaterialNameIndices.textures[i]] =  pSurfaceMaterial.texture(i) || null;
				 	}
				}
			}			

			if(this._pMaterialNameIndices.material > 0) {
				var pMaterial: IMaterial = pSurfaceMaterial.material;
				var pMatContainer: any = this._pMaterialContainer;

				pMatContainer.DIFFUSE.set(pMaterial.diffuse.r, pMaterial.diffuse.g, pMaterial.diffuse.b, pMaterial.diffuse.a);
				pMatContainer.AMBIENT.set(pMaterial.ambient.r, pMaterial.ambient.g, pMaterial.ambient.b, pMaterial.ambient.a);
				pMatContainer.SPECULAR.set(pMaterial.specular.r, pMaterial.specular.g, pMaterial.specular.b, pMaterial.specular.a);
				pMatContainer.EMISSIVE.set(pMaterial.emissive.r, pMaterial.emissive.g, pMaterial.emissive.b, pMaterial.emissive.a);
				pMatContainer.SHININESS = pMaterial.shininess;
				
				this.uniforms[this._pMaterialNameIndices.material] = pMatContainer;
			}

			if (this._nLastSamplerUpdates !== this._nSamplerUpdates){
				this._setSamplerTextureObjectByIndex(this._pMaterialNameIndices.diffuse, pSurfaceMaterial.texture(ESurfaceMaterialTextures.DIFFUSE) || null);
				this._setSamplerTextureObjectByIndex(this._pMaterialNameIndices.ambient, pSurfaceMaterial.texture(ESurfaceMaterialTextures.AMBIENT) || null);
				this._setSamplerTextureObjectByIndex(this._pMaterialNameIndices.specular, pSurfaceMaterial.texture(ESurfaceMaterialTextures.SPECULAR) || null);
				this._setSamplerTextureObjectByIndex(this._pMaterialNameIndices.emissive, pSurfaceMaterial.texture(ESurfaceMaterialTextures.EMISSIVE) || null);
				this._setSamplerTextureObjectByIndex(this._pMaterialNameIndices.normal, pSurfaceMaterial.texture(ESurfaceMaterialTextures.NORMAL) || null);
			}

			this._pLastSurfaceMaterial = pSurfaceMaterial;
			this._nLastSufraceMaterialTextureUpdates = pSurfaceMaterial.totalUpdatesOfTextures;
			this._nLastSamplerUpdates = this._nSamplerUpdates;
		}

		inline setRenderState(eState: ERenderStates, eValue: ERenderStateValues): void {
			this.renderStates[eState] = eValue;
		}

		inline _getForeignVarNameIndex(sName: string): uint {
			return this._pCreator.foreigns.getIndexByRealName(sName);
		}

		inline _getForeignVarNameByIndex(iNameIndex: uint): string {
			return this._pCreator.foreigns.getVarInfoByIndex(iNameIndex).realName;
		}

		inline _getUniformVarNameIndex(sName: string): uint {
			return this._pCreator.uniforms.getIndexByRealName(sName);
		}

		inline _getUniformVar(iNameIndex: uint): IAFXVariableDeclInstruction {
			return this._pCreator.uniforms.getVarByIndex(iNameIndex);
		}

		inline _getUniformVarNameByIndex(iNameIndex: uint): string {
			return this._pCreator.uniforms.getVarInfoByIndex(iNameIndex).realName;
		}

		inline _getUniformLength(iNameIndex: uint): uint {
			return this._pCreator.uniforms.getVarByIndex(iNameIndex).getType().getLength();
		}

		inline _getUniformType(iNameIndex: uint): EAFXShaderVariableType {
			return this._pCreator.uniforms.getTypeByIndex(iNameIndex);
		}

		inline _getSamplerState(iNameIndex: uint): IAFXSamplerState {
			return this.samplers[iNameIndex];
		}

		inline _getSamplerTexture(iNameIndex: uint): ITexture {
			return this._getTextureForSamplerState(this._getSamplerState(iNameIndex));
		}

		_getTextureForSamplerState(pSamplerState: IAFXSamplerState): ITexture {
			var pTexture: ITexture = null;

			if(!isNull(pSamplerState.texture)){
				pTexture = pSamplerState.texture;
			}
			else if(pSamplerState.textureName !== ""){
				if(this.hasTexture(pSamplerState.textureName)){
					pTexture = this.textures[this._pCreator.textures.getIndexByRealName(pSamplerState.textureName)];
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

			// this._bNeedToCalcShader = true;
			// this._bNeedToCalcBlend = true;
		}


		// inline _isNeedToCalcBlend(): bool {
		// 	return this._bNeedToCalcBlend;
		// }

		// inline _isNeedToCalcShader(): bool {
		// 	return this._bNeedToCalcBlend || this._bNeedToCalcShader;
		// }

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

		private init(): void {
			this.samplers = <IAFXSamplerStateMap>{};
			this.samplerArrays = <IAFXSamplerStateListMap>{};
			this.samplerArrayLength = <IntMap>{};

			this.uniforms = <any>{};
			this.foreigns = <any>{};
			this.textures = <any>{};

			this.renderStates = fx.createPassStateMap();

			var pUniformKeys: uint[] = this._pCreator.uniforms.indices;
			var pForeignKeys: uint[] = this._pCreator.foreigns.indices;
			var pTextureKeys: uint[] = this._pCreator.textures.indices;

			var eType: EAFXShaderVariableType = 0;
			var sName: string = "";
			var iIndex: uint = 0;

			for(var i: uint = 0; i < pUniformKeys.length; i++){
				var iIndex: uint = pUniformKeys[i];
				var pInfo: IAFXVariableInfo = this._pCreator.uniforms.getVarInfoByIndex(iIndex);
				var pDefaultValue: any = pInfo.variable.getDefaultValue();

				if (pInfo.type === EAFXShaderVariableType.k_Sampler2D || 
					pInfo.type === EAFXShaderVariableType.k_SamplerCUBE){

					var hasDefaultValue: bool = !isNull(pDefaultValue);

					if(pInfo.isArray){
						if(hasDefaultValue){
							this.samplerArrays[iIndex] = new Array(pDefaultValue.length);
							this.samplerArrayLength[iIndex] = this.samplerArrays[iIndex].length;
						}
						else {
							this.samplerArrays[iIndex] = new Array(16);
							this.samplerArrayLength[iIndex] = 0;
						}
						

						for(var j: uint = 0; j < this.samplerArrays[iIndex].length; j++) {
							var pNewState: IAFXSamplerState = createSamplerState();

							if(hasDefaultValue){
								var pDefaultState: IAFXSamplerState = pDefaultValue[j];
								pNewState.textureName = pDefaultState.textureName;
								pNewState.wrap_s = pDefaultState.wrap_s || pNewState.wrap_s;
								pNewState.wrap_t = pDefaultState.wrap_t || pNewState.wrap_t;
								pNewState.mag_filter = pDefaultState.mag_filter || pNewState.mag_filter;
								pNewState.min_filter = pDefaultState.min_filter || pNewState.min_filter;
							}

							this.samplerArrays[iIndex][j] = pNewState;
						}

					}
					else {
						var pNewState: IAFXSamplerState = createSamplerState();

						if(hasDefaultValue){
							var pDefaultState: IAFXSamplerState = pDefaultValue;
							pNewState.textureName = pDefaultState.textureName;
							pNewState.wrap_s = pDefaultState.wrap_s || pNewState.wrap_s;
							pNewState.wrap_t = pDefaultState.wrap_t || pNewState.wrap_t;
							pNewState.mag_filter = pDefaultState.mag_filter || pNewState.mag_filter;
							pNewState.min_filter = pDefaultState.min_filter || pNewState.min_filter;
						}

						this.samplers[iIndex] = pNewState;
					}
				}
				else {
					this.uniforms[iIndex] = pDefaultValue;
				}
			}

			for(var i: uint = 0; i < pForeignKeys.length; i++){
				var iIndex: uint = pForeignKeys[i];

				this.foreigns[iIndex] = null;
			}

			for(var i: uint = 0; i < pTextureKeys.length; i++){
				var iIndex: uint = pTextureKeys[i];
				this.textures[iIndex] = null;
			}

			this.samplerKeys = <any[]>Object.keys(this.samplers);
			for(var i: uint = 0; i < this.samplerKeys.length; i++){
				this.samplerKeys[i] = +this.samplerKeys[i];
			}

			this.samplerArrayKeys = <any[]>Object.keys(this.samplerArrays);
			for(var i: uint = 0; i < this.samplerArrayKeys.length; i++){
				this.samplerArrayKeys[i] = +this.samplerArrayKeys[i];
			}

			this.uniformKeys = <any[]>Object.keys(this.uniforms);
			for(var i: uint = 0; i < this.uniformKeys.length; i++){
				this.uniformKeys[i] = +this.uniformKeys[i];
			}

			this.foreignKeys = <any[]>Object.keys(this.foreigns);
			for(var i: uint = 0; i < this.foreignKeys.length; i++){
				this.foreignKeys[i] = +this.foreignKeys[i];
			}

			this.textureKeys = <any[]>Object.keys(this.textures);
			for(var i: uint = 0; i < this.textureKeys.length; i++){
				this.textureKeys[i] = +this.textureKeys[i];
			}
		}

		private inline isVarArray(pVar: IAFXVariableDeclInstruction): bool {
			return pVar.getType().isNotBaseArray();
		}

		private clearSamplerState(pState: IAFXSamplerState): void {
			pState.textureName = "";
			pState.texture = null;
			pState.wrap_s = ETextureWrapModes.UNDEF;
			pState.wrap_t = ETextureWrapModes.UNDEF;
			pState.mag_filter = ETextureFilters.UNDEF;
			pState.min_filter = ETextureFilters.UNDEF;
			/*pState.wrap_s = ETextureWrapModes.CLAMP_TO_EDGE;
			pState.wrap_t = ETextureWrapModes.CLAMP_TO_EDGE;
			pState.mag_filter = ETextureFilters.LINEAR;
			pState.min_filter = ETextureFilters.LINEAR;*/
		}

		private _setSamplerTextureObjectByIndex(iNameIndex: uint, pTexture: ITexture): void {
			if(iNameIndex === 0){
				return;
			}

			var pState: IAFXSamplerState = this.samplers[iNameIndex];
			if(pState.texture !== pTexture){
				this._nSamplerUpdates++;
			}

			pState.texture = pTexture;

			// if (!isNull(pTexture)) {
			// 	pState.min_filter = pTexture.getFilter(ETextureParameters.MIN_FILTER);
			// 	pState.mag_filter = pTexture.getFilter(ETextureParameters.MAG_FILTER);
			// 	pState.wrap_s = pTexture.getWrapMode(ETextureParameters.WRAP_S);
			// 	pState.wrap_t = pTexture.getWrapMode(ETextureParameters.WRAP_T);
			// }
		}

		private copySamplerState(pFrom: IAFXSamplerState, pTo: IAFXSamplerState): void {
			if (pTo.textureName !== pFrom.textureName ||
				pTo.texture !== pFrom.texture){
				this._nSamplerUpdates++;
			}

			pTo.textureName = pFrom.textureName;
			pTo.texture = pFrom.texture;

			pTo.wrap_s = pFrom.wrap_s;
			pTo.wrap_t = pFrom.wrap_t;

			pTo.mag_filter = pFrom.mag_filter;
			pTo.min_filter = pFrom.min_filter;
		}
	}
}

#endif