#ifndef AFXSAMPLERBLENDER_TS
#define AFXSAMPLERBLENDER_TS

#include "IAFXComposer.ts"

module akra.fx {
	#define INIT_SLOT_SIZE 32
	#define ZERO_SLOT 0

	//TODO: CHECK SAMPLER TYPE
	
	export class SamplerBlender {
		protected _pSlotList: util.ObjectArray[] = null;
		protected _nActiveSlots: uint = 0;

		protected _pIdToSlotMap: IntMap = null;
		protected _pIdList: uint[] = null;

		inline get slots(): util.ObjectArray[] {
			return this._pSlotList;
		}

		inline get totalActiveSlots(): uint {
			return this._nActiveSlots;
		}

		constructor() {
			this._pSlotList = new Array(INIT_SLOT_SIZE);

			for(var i: uint = 0; i < this._pSlotList.length; i++){
				this._pSlotList[i] = new util.ObjectArray();
			}

			this._nActiveSlots = 1;

			this._pIdToSlotMap = <IntMap><any>{0 : 0};
			this._pIdList = [];
		}

		inline getSamplersBySlot(iSlot: uint): util.ObjectArray {
			return this.slots[iSlot];
		} 

		clear(): void {
			for(var i: uint = 0; i < this._nActiveSlots; i++){
				for(var j: uint = 0; j < this._pSlotList[i].length; j++){
					var pSampler: IAFXVariableDeclInstruction = this._pSlotList[i].value(j);
					pSampler.setRealName(pSampler.getSemantic() || pSampler.getName());
					pSampler.defineByZero(false);
				}

				this._pSlotList[i].clear(false);
			}

			this._nActiveSlots = 1;

			for(var i: uint = 0; i < this._pIdList.length; i++){
				this._pIdToSlotMap[this._pIdList[i]] = -1;
			}
		}

		addTextureSlot(id: uint): void {
			if(!isDef(this._pIdToSlotMap[id])){
				this._pIdList.push(id);
			}
			else if(this._pIdToSlotMap[id] > 0){
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

		getHash(): string {
			var sHash: string = "";

			for(var i: uint = 0; i < this._nActiveSlots; i++){
				var pBlend: util.ObjectArray = this._pSlotList[i];
				
				if(pBlend.length > 0) {
					if(i === 0) {
						sHash += "Z";
					}

					for(var j: uint = 0; j < pBlend.length; j++){
						sHash += pBlend.value(j).getGuid() + ".";
					}

					sHash += ".";
				}
			}

			return sHash;
		}
	}


}


#endif