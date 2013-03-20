#ifndef AFXMAKER_TS
#define AFXMAKER_TS

#include "IAFXMaker.ts"
#include "IAFXComposer.ts"
#include "util/unique.ts"
#include "IResourcePoolManager.ts"

module akra.fx {
	export interface IShaderInput extends Object {};

	export class Maker implements IAFXMaker {
		UNIQUE();

		private _pComposer: IAFXComposer = null;
		private _pShaderProgram: IShaderProgram = null;

		private _pRealUniformNameList: string[] = null;
		private _pRealAttrNameList: string[] = null;

		// is really exists uniform & attr?
		private _pUniformMap: StringMap = <StringMap>{};
		private _pAttrExistMap: BoolMap = <BoolMap>{};

		//стек объектов храняих все юниформы и аттрибуты
		private _pDataPoolArray: util.ObjectArray = new util.ObjectArray();

		constructor(pComposer: IAFXComposer){
			this._pComposer = pComposer;
		}

		_create(sVertex: string, sPixel: string): bool {
			var pRmgr: IResourcePoolManager = this._pComposer.getEngine().getResourceManager();

			var pProgram: IShaderProgram = pRmgr.createShaderProgram(".shader-prorgam-" + this.getGuid().toString());

			if(!pProgram.create(sVertex, sPixel)){
				return false;
			}

			this._pRealUniformNameList = pProgram._getActiveUniformNames();
        	this._pRealAttrNameList = pProgram._getActiveAttributeNames();
			this._pShaderProgram = pProgram; 

			for (var i: int = 0; i < this._pRealUniformNameList.length; i++) {
				this._pUniformMap[this._pRealUniformNameList[i]] = this._pRealUniformNameList[i];
			}

			for (var i: int = 0; i < this._pRealAttrNameList.length; i++) {
				this._pAttrExistMap[this._pRealAttrNameList[i]] = true;
			}

			return true;
		}

		inline _getDataPool(): IShaderInput {
			return this._pDataPoolArray.length > 0? this._pDataPoolArray.pop(): this._createDataPool();
		}

		inline _releaseDataPool(pPool: IShaderInput): void {
			this._pDataPoolArray.push(pPool);
		}

		inline isUniformExists(sName: string): bool {
			return isDefAndNotNull(this._pUniformMap[sName]);
		}

		inline isAttrExists(sName: string): bool {
			return this._pAttrExistMap[sName];
		}


		_createDataPool(): IShaderInput {
			var pInput: IShaderInput = {};

			//assume, that attr & uniform never have same names!!!

			for (var i: int = 0; i < this._pRealUniformNameList.length; i++) {
				var sName: string = this._pRealUniformNameList[i];
				pInput[sName] = null;
			}

			for (var i: int = 0; i < this._pRealAttrNameList.length; i++) {
				var sName: string = this._pRealAttrNameList[i];
				pInput[sName] = null;
			}

			return pInput;
		}

		_initInput(pBlend: SamplerBlender): bool {
			var iTotalSlots: uint = pBlend.totalActiveSlots;

			for(var i: uint = 0; i < iTotalSlots; i++){
				var pSamplers: util.ObjectArray = pBlend.getSamplersBySlot(i);
				var sRealSamplerName: string = "as" + i.toString();

				var pSampler: IAFXVariableDeclInstruction = null;

				for(var j: uint = 0; j < pSamplers.length; j++){
					pSampler = pSamplers.value(j);
					var sSamplerName: string = pSampler.getRealName();
					
					if(this.isUniformExists(sRealSamplerName)){
						this._pUniformMap[sSamplerName] = sRealSamplerName;
					}
					else {
						this._pUniformMap[sSamplerName] = null;
						this._pUniformMap[sRealSamplerName] = null;
					}
				}

				if(i !== ZERO_SLOT) { /* Avoid Zero sampler`s */

				}
			}

			return true;
		}

		_make(pPassInput: IAFXPassInputBlend, pAttrs: AttributeBlendContainer): IShaderInput {
			var pUniforms: Object = pPassInput.uniforms;
			var pUniformKeys: string[] = pPassInput.uniformKeys;
			return null;
		}

	} 
}

#endif