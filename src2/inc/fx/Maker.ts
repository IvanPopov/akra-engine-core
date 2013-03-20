#ifndef AFXMAKER_TS
#define AFXMAKER_TS

#include "IAFXMaker.ts"
#include "IAFXComposer.ts"
#include "util/unique.ts"
#include "IResourcePoolManager.ts"

module akra.fx {
	export interface IShaderInput{
		[index: string]: any;
	}

	export interface IUniformTypeMap {
		[name: string]: EAFXShaderVariableType;
	}

	export class Maker implements IAFXMaker {
		UNIQUE();

		private _pComposer: IAFXComposer = null;
		private _pShaderProgram: IShaderProgram = null;

		private _pRealUniformNameList: string[] = null;
		private _pRealAttrNameList: string[] = null;

		// is really exists uniform & attr?
		private _pUniformMap: StringMap = <StringMap>{};
		private _pAttrExistMap: BoolMap = <BoolMap>{};

		private _pRealUniformLengthMap: IntMap = <IntMap>{};
		private _pRealUniformTypeMap: IUniformTypeMap = <IUniformTypeMap>{};

		//For fast set uniforms
		private _pRealUnifromFromInput: string[] = null; /* without sampler array */
		private _pRealSampleArraysFromInput: string[] = null; /* only sampler arrays */
		private _pRealSamplersFromInput: string[] = null;
		private _isUsedZero2D: bool = false;
		private _isUsedZeroCube: bool = false;

		//For fast set offsets
		private _pRealOffsetsFromBufferFlows: uint[] = null;
		private _pDefaultOffsets: uint[] = null;

		//for fast set buffers slots
		private _pRealAttrSlotFormBufferFlows: uint[] = null;

		//for fast set buffers vertex textures
		private _pBufferSamplersFormBufferFlow: uint[] = null;

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

		_initInput(pPassInput: IAFXPassInputBlend, pBlend: SamplerBlender, pAttrs: AttributeBlendContainer): bool {
			var pUniformKeys: string[] = pPassInput.uniformKeys;

			this._pRealUnifromFromInput = [];
			this._pRealSampleArraysFromInput = [];

			for(var i: uint = 0; i < pUniformKeys.length; i++){
				var sName: string = pUniformKeys[i];

				if(this.isUniformExists(sName)){
					var eType: EAFXShaderVariableType =  pPassInput._getUniformType(sName);
					var iLength: uint = pPassInput._getUnifromLength(sName);
					
					this._pRealUniformTypeMap[sName] = eType;
					this._pRealUniformLengthMap[sName] = iLength;

					if (iLength > 0 && 
						(eType === EAFXShaderVariableType.k_Sampler2D || eType === EAFXShaderVariableType.k_SamplerCUBE)){

						this._pRealSampleArraysFromInput.push(sName);
					}
					else {
						this._pRealUnifromFromInput.push(sName);
					}
				}
			}

			this._pRealSamplersFromInput = [];
			var iTotalSamplerSlots: uint = pBlend.totalActiveSlots;

			for(var i: uint = 0; i < iTotalSamplerSlots; i++){
				if(i === ZERO_SLOT) {
					this._isUsedZero2D = this.isUniformExists("as0");
					this._isUsedZeroCube = this.isUniformExists("asc0");
					continue;
				}

				var pSamplers: util.ObjectArray = pBlend.getSamplersBySlot(i);
				var sRealSamplerName: string = "as" + i.toString();

				if(this.isUniformExists(sRealSamplerName)){
					var pSampler: IAFXVariableDeclInstruction = pBlend.getSamplersBySlot(i).value(0);
					var sSampler: string = pSampler.getRealName();

					this._pRealUnifromFromInput.push(sSampler);

					this._pRealUniformTypeMap[sRealSamplerName] = pSampler.getType().isSampler2D() ?
																 		EAFXShaderVariableType.k_Sampler2D :
																 		EAFXShaderVariableType.k_SamplerCUBE;
					this._pRealUniformLengthMap[sRealSamplerName] = 0;
				}
			}




			this._pRealAttrSlotFormBufferFlows = [];
			this._pBufferSamplersFormBufferFlow = [];

			this._pRealOffsetsFromBufferFlows = [];
			this._pDefaultOffsets = [];

			//var iTotalAttrSlots: uint = this.




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