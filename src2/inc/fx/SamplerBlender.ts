#ifndef AFXSAMPLERBLENDER_TS
#define AFXSAMPLERBLENDER_TS

#include "IAFXComposer.ts"
#include "IAFXSamplerBlender.ts"

module akra.fx {
	#define INIT_SLOT_SIZE

	export class SamplerBlender implements IAFXSamplerBlender {
		private _pComposer: IAFXComposer = null;

		private _pSlotList: util.ObjectArray[] = null;
		private _nActiveSlots: uint = 0;

		private _pIdToSlotMap: IntMap = null;

		constructor(pComposer: IAFXComposer) {
			this._pComposer = pComposer;

			this._pSlotList = new Array(INIT_SLOT_SIZE);

			for(var i: uint = 0; i < this._pSlotList.length; i++){
				this._pSlotList[i] = new util.ObjectArray();
			}

			this._pIdToSlotMap = <IntMap>{};
		}

		clear(): void {
			for(var i: uint = 0; i < this._nActiveSlots; i++){
				this._pSlotList[i].clear(false);
			}

			this._nActiveSlots = 0;
		}

		addTextureSlot(id: uint): void {
			if(isDef(this._pIdToSlotMap[id])){
				return;
			}

			if(this._pSlotList.length === this._nActiveSlots){
				this._pSlotList.push(new util.ObjectArray());
			}

			this._pIdToSlotMap[id] = this._nActiveSlots;
			this._nActiveSlots++;
		}

		inline addObjectToSlotById(pObject: any, id: uint): void {
			this._pSlotList[this._pIdToSlotMap[id]].push(pObject);
		}

		addObjectToSlotIdAuto(pObject: any, id: uint): void {
			this.addTextureSlot(id);
			this.addObjectToSlotById(pObject, id);
		}

	}
}


#endif