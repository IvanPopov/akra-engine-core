/// <reference path="../idl/IAFXComposer.ts" />
/// <reference path="../idl/IMap.ts" />
var akra;
(function (akra) {
    /// <reference path="../util/ObjectArray.ts" />
    (function (fx) {
        var ObjectArray = akra.util.ObjectArray;

        /** @const */
        var INIT_SLOT_SIZE = 32;

        //TODO: CHECK SAMPLER TYPE
        var SamplerBlender = (function () {
            function SamplerBlender() {
                this._pSlotList = null;
                this._nActiveSlots = 0;
                this._pIdToSlotMap = null;
                this._pIdList = null;
                this._pSlotList = new Array(INIT_SLOT_SIZE);

                for (var i = 0; i < this._pSlotList.length; i++) {
                    this._pSlotList[i] = new ObjectArray();
                }

                this._nActiveSlots = 1;

                this._pIdToSlotMap = { 0: 0 };
                this._pIdList = new Array(INIT_SLOT_SIZE);
            }
            SamplerBlender.prototype.getSlots = function () {
                return this._pSlotList;
            };

            SamplerBlender.prototype.getTotalActiveSlots = function () {
                return this._nActiveSlots;
            };

            SamplerBlender.prototype.getSamplersBySlot = function (iSlot) {
                return this.getSlots()[iSlot];
            };

            SamplerBlender.prototype.clear = function () {
                for (var i = 0; i < this._nActiveSlots; i++) {
                    this._pSlotList[i].clear(false);
                }

                for (var i = 0; i < this._nActiveSlots - 1; i++) {
                    this._pIdToSlotMap[this._pIdList[i]] = -1;
                }

                this._nActiveSlots = 1;
            };

            SamplerBlender.prototype.clearSamplerNames = function () {
                for (var i = 0; i < this._nActiveSlots; i++) {
                    for (var j = 0; j < this._pSlotList[i].getLength(); j++) {
                        var pSampler = this._pSlotList[i].value(j);
                        pSampler.setRealName(pSampler.getSemantic() || pSampler.getName());
                        pSampler.defineByZero(false);
                    }
                }
            };

            SamplerBlender.prototype.addTextureSlot = function (id) {
                if (this._pIdToSlotMap[id] > 0) {
                    return;
                }

                // if(this._pSlotList.length === this._nActiveSlots){
                // 	this._pSlotList.push(new util.ObjectArray());
                // }
                this._pIdToSlotMap[id] = this._nActiveSlots;
                this._pIdList[this._nActiveSlots - 1] = id;
                this._nActiveSlots++;
            };

            SamplerBlender.prototype.addObjectToSlotById = function (pObject, id) {
                this._pSlotList[this._pIdToSlotMap[id]].push(pObject);
            };

            SamplerBlender.prototype.addObjectToSlotIdAuto = function (pObject, id) {
                this.addTextureSlot(id);
                this.addObjectToSlotById(pObject, id);
            };

            SamplerBlender.prototype.getHash = function () {
                var sHash = "";

                for (var i = 0; i < this._nActiveSlots; i++) {
                    var pBlend = this._pSlotList[i];

                    if (pBlend.getLength() > 0) {
                        if (i === 0) {
                            sHash += "Z";
                        }

                        for (var j = 0; j < pBlend.getLength(); j++) {
                            sHash += pBlend.value(j)._getInstructionID().toString() + ".";
                        }

                        sHash += ".";
                    }
                }

                return sHash;
            };

            SamplerBlender.ZERO_SLOT = 0;
            return SamplerBlender;
        })();
        fx.SamplerBlender = SamplerBlender;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=SamplerBlender.js.map
