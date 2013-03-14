#ifndef PASSINPUTBLEND_TS
#define PASSINPUTBLEND_TS

module akra.fx {

	export class PassInputBlend implements IAFXPassInputBlend {
		private _isFirstInit: bool = true;
		private _pCreator: IAFXComponentPassInputBlend = null;
		private _pHasUniformName: BoolMap = null;
		private _pHasForeignName: BoolMap = null;
		private _pHasTextureName: BoolMap = null;

		private _bNeedToCalcBlend: bool = false;
		private _bNeedToCalcShader: bool = false;

		private _iLastPassBlendId: uint = 0;
		private _iLastShaderId: uint = 0;

		uniforms: any = null;
		foreigns: any = null;
		textures: any = null;

		uniformsDefault: any = null;

		uniformKeys: string[] = null;
		foreignKeys: string[] = null;
		textureKeys: string[] = null;

		constructor(pCreator: IAFXComponentPassInputBlend){
			this._pCreator = pCreator;
		}

		setUniform(sName: string, pValue: any): void {
			if(!this._pHasUniformName[sName]){
				this._pHasUniformName[sName] = false;
				return;
			}

			//Check type

			this.uniforms[sName] = pValue;
		}
	
		setForeign(sName: string, pValue: any): void {		
			if(!this._pHasForeignName[sName]){
				this._pHasForeignName[sName] = false;
				return;
			}

			//Check type

			var pOldValue: any = this.foreigns[sName];
			
			if(pOldValue !== pValue) {
				this._bNeedToCalcBlend = true;
			}

			this.foreigns[sName] = pOldValue;
		}


		setTexture(sName: string, pValue: any): void {
			if(!this._pHasTextureName[sName]){
				this._pHasTextureName[sName] = false;
				return;
			}

			//Check type
			
			this.textures[sName] = pValue;
		}

		setSamplerTexture(sName: string, pTexture: any): void{
			if(!this._pHasUniformName[sName]){
				this._pHasUniformName[sName] = false;
				return;
			}

			var pOldValue: any =  this.uniforms[sName].texture;

			if(pOldValue !== pTexture) {
				this._bNeedToCalcShader = true;
			}

			this.uniforms[sName].texture = pTexture;
		}

		_init(): void {
			if(this._isFirstInit){
				// this.uniformKeys = Object.keys(this.uniforms);
				// this.foreignKeys = Object.keys(this.foreigns);
				// this.textureKeys = Object.keys(this.textures);

				this.uniforms = {};
				this.foreigns = {};
				this.textures = {};

				this._pHasUniformName = <BoolMap>{};
				this._pHasTextureName = <BoolMap>{};
				this._pHasForeignName = <BoolMap>{};

				for(var i: uint = 0; i < this.uniformKeys.length; i++){
					this._pHasUniformName[this.uniformKeys[i]] = true;
					this.uniforms[this.uniformKeys[i]] = this.uniformsDefault[this.uniformKeys[i]];
				}

				for(var i: uint = 0; i < this.foreignKeys.length; i++){
					this._pHasForeignName[this.foreignKeys[i]] = true;
					this.foreigns[this.foreignKeys[i]] = null;
				}

				for(var i: uint = 0; i < this.textureKeys.length; i++){
					this._pHasTextureName[this.textureKeys[i]] = true;
					this.textures[this.textureKeys[i]] = null;
				}

				this._isFirstInit = false;
			}

			this._bNeedToCalcBlend = true;
			this._bNeedToCalcShader = true;
		}

		_release(): void {
			for(var i: uint = 0; i < this.uniformKeys.length; i++){
				this.uniforms[this.uniformKeys[i]] = this.uniformsDefault[this.uniformKeys[i]];
			}

			for(var i: uint = 0; i < this.foreignKeys.length; i++){
				this.foreigns[this.foreignKeys[i]] = null;
			}

			for(var i: uint = 0; i < this.textureKeys.length; i++){
				this.textures[this.textureKeys[i]] = null;
			}

			this._pCreator.releasePassInput(this);
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
	}
}

#endif