/// <reference path="../idl/AIAFXComposer.ts" />
/// <reference path="../idl/AIMap.ts" />


import ObjectArray = require("util/ObjectArray");

/** @const */
var INIT_SLOT_SIZE = 32;

//TODO: CHECK SAMPLER TYPE

class SamplerBlender {
    protected _pSlotList: ObjectArray<AIAFXVariableDeclInstruction>[] = null;
    protected _nActiveSlots: uint = 0;

    protected _pIdToSlotMap: AIMap<int> = null;
    protected _pIdList: uint[] = null;

    get slots(): ObjectArray<AIAFXVariableDeclInstruction>[] {
        return this._pSlotList;
    }

    get totalActiveSlots(): uint {
        return this._nActiveSlots;
    }

    constructor() {
        this._pSlotList = new Array(INIT_SLOT_SIZE);

        for (var i: uint = 0; i < this._pSlotList.length; i++) {
            this._pSlotList[i] = new ObjectArray();
        }

        this._nActiveSlots = 1;

        this._pIdToSlotMap = <AIMap<int>><any>{ 0: 0 };
        this._pIdList = new Array(INIT_SLOT_SIZE);
    }

    getSamplersBySlot(iSlot: uint): ObjectArray<AIAFXVariableDeclInstruction> {
        return this.slots[iSlot];
    }

    clear(): void {
        for (var i: uint = 0; i < this._nActiveSlots; i++) {
            this._pSlotList[i].clear(false);
        }

        for (var i: uint = 0; i < this._nActiveSlots - 1; i++) {
            this._pIdToSlotMap[this._pIdList[i]] = -1;
        }

        this._nActiveSlots = 1;
    }

    clearSamplerNames(): void {
        for (var i: uint = 0; i < this._nActiveSlots; i++) {
            for (var j: uint = 0; j < this._pSlotList[i].length; j++) {
                var pSampler: AIAFXVariableDeclInstruction = this._pSlotList[i].value(j);
                pSampler.setRealName(pSampler.getSemantic() || pSampler.getName());
                pSampler.defineByZero(false);
            }
        }
    }

    addTextureSlot(id: uint): void {
        if (this._pIdToSlotMap[id] > 0) {
            return;
        }

        // if(this._pSlotList.length === this._nActiveSlots){
        // 	this._pSlotList.push(new util.ObjectArray());
        // }

        this._pIdToSlotMap[id] = this._nActiveSlots;
        this._pIdList[this._nActiveSlots - 1] = id;
        this._nActiveSlots++;
    }

    addObjectToSlotById(pObject: any, id: uint): void {
        this._pSlotList[this._pIdToSlotMap[id]].push(pObject);
    }

    addObjectToSlotIdAuto(pObject: any, id: uint): void {
        this.addTextureSlot(id);
        this.addObjectToSlotById(pObject, id);
    }

    getHash(): string {
        var sHash: string = "";

        for (var i: uint = 0; i < this._nActiveSlots; i++) {
            var pBlend: ObjectArray<AIAFXVariableDeclInstruction> = this._pSlotList[i];

            if (pBlend.length > 0) {
                if (i === 0) {
                    sHash += "Z";
                }

                for (var j: uint = 0; j < pBlend.length; j++) {
                    sHash += pBlend.value(j).getGuid() + ".";
                }

                sHash += ".";
            }
        }

        return sHash;
    }


    /** @const */
    static ZERO_SLOT = 0;

}

export = SamplerBlender;