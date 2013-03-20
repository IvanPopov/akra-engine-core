#ifndef PASSINPUTBLEND_TS
#define PASSINPUTBLEND_TS

#include "IAFXPassInputBlend.ts"

module akra.fx {
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

			return true;
		}

		setUniform(sName: string, pValue: any): void {
			if(!this._pUniformTypeMap[sName]){
				this._pUniformTypeMap[sName] = EAFXShaderVariableType.k_NotVar;
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

			this.foreigns[sName] = pOldValue;
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

		setSamplerTexture(sName: string, pState: any): void {
			if (!this.hasUniform(sName)) {
				return;
			}
			//this.samplers[sName]
		}

		setSurfaceMaterial(pMaterial: ISurfaceMaterial): void {
			//TODO: apply surface material
		}

		inline _getUnifromLength(sName: string): uint {
			return this._pCreator.uniformByRealName[sName].getType().getLength();
		}

		inline _getUniformType(sName: string): EAFXShaderVariableType {
			return this._pUniformTypeMap[sName];
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

			var pUniformKeys: string[] = this._pCreator.uniformRealNameList;
			var pForeignKeys: string[] = this._pCreator.foreignNameList;
			var pTextureKeys: string[] = this._pCreator.textureRealNameList;

			var pUniformMap: IAFXVariableDeclMap = this._pCreator.uniformByRealName;
			var pForeignMap: IAFXVariableDeclMap = this._pCreator.foreignByName;
			var pTextureMap: IAFXVariableDeclMap = this._pCreator.textureByRealName;

			var eType: EAFXShaderVariableType = 0;
			var sName: string = "";
			var isArray: bool = false;

			for(var i: uint = 0; i < pUniformKeys.length; i++){
				sName = pUniformKeys[i];
				eType = this.getVariableType(pUniformMap[sName]);
				isArray = this.isVarArray(pUniformMap[sName]);

				this._pUniformTypeMap[sName] = eType;
				this._isUniformArrayMap[sName] = isArray;

				if(eType === EAFXShaderVariableType.k_Sampler2D || eType === EAFXShaderVariableType.k_SamplerCUBE){
					if(isArray){
						this.samplerArrays[sName] = new Array(16);
						this.samplerArrayLength[sName] = 0;

						for(var j: uint = 0; j < this.samplerArrays[sName].length; j++) {
							this.samplerArrays[sName][j] = this.createSamplerState();
						}
					}
					else {
						this.samplers[sName] = this.createSamplerState();
					}
				}
				else {
					this.uniforms[sName] = null;
				}
			}

			for(var i: uint = 0; i < pForeignKeys.length; i++){
				sName = pForeignKeys[i];
				eType = this.getVariableType(pForeignMap[sName]);

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

		private getVariableType(pVar: IAFXVariableDeclInstruction): EAFXShaderVariableType {
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
		       		return EAFXShaderVariableType.k_NotVar;
			}
		}

		private inline isVarArray(pVar: IAFXVariableDeclInstruction): bool {
			return pVar.getType().isNotBaseArray();
		}

		private inline createSamplerState(): IAFXSamplerState {
			return <IAFXSamplerState>{ 
				textureName: "",
				texture: null,
				wrap_s: 0,
				wrap_t: 0,
				mag_filter: 0,
				min_filter: 0
			};
		}

		private clearSamplerState(pState: IAFXSamplerState): void {
			pState.textureName = "";
			pState.texture = null;
			pState.wrap_s = 0;
			pState.wrap_t = 0;
			pState.mag_filter = 0;
			pState.min_filter = 0;
		}
	}
}

#endif