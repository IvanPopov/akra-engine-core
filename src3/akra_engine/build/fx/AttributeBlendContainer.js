/// <reference path="../idl/AIAFXInstruction.ts" />
/// <reference path="../idl/AIMap.ts" />
/// <reference path="../idl/AIRenderer.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "webgl", "logger", "fx/Effect", "fx/VariableBlendContainer", "data/Usage"], function(require, exports, __webgl__, __logger__, __Effect__, __VariableBlendContainer__, __Usage__) {
    
    var webgl = __webgl__;
    var logger = __logger__;

    var Effect = __Effect__;
    var VariableBlendContainer = __VariableBlendContainer__;

    var Usage = __Usage__;

    var AttributeBlendContainer = (function (_super) {
        __extends(AttributeBlendContainer, _super);
        function AttributeBlendContainer() {
            _super.call(this);
            this._pSlotBySemanticIndex = null;
            this._pTypeInfoBySemanticIndex = null;
            this._pFlowBySlots = null;
            this._pSlotByFlows = null;
            this._pIsPointerBySlot = null;
            this._pVBByBufferSlots = null;
            this._pBufferSlotBySlots = null;
            this._pHashPartList = null;
            this._pOffsetVarsBySemanticMap = null;
            this._pOffsetDefaultMap = null;
            this._nSemantics = 0;
            this._nSlots = 0;
            this._nBufferSlots = 0;
            this._sHash = "";

            this._pSlotBySemanticIndex = null;

            //this._pFlowBySemanticIndex = null;
            var iMaxSlots = 16;
            var iMaxVertexSamplers = 4;

            if (has("WEBGL")) {
                iMaxSlots = webgl.maxVertexAttributes;
                iMaxVertexSamplers = webgl.maxVertexTextureImageUnits;
            }

            this._pFlowBySlots = new Array(iMaxSlots);
            this._pSlotByFlows = new Array(iMaxSlots);
            this._pIsPointerBySlot = new Array(iMaxSlots);
            this._pVBByBufferSlots = new Array(iMaxVertexSamplers);
            this._pBufferSlotBySlots = new Array(iMaxSlots);
            this._pHashPartList = null;
        }
        Object.defineProperty(AttributeBlendContainer.prototype, "attrsInfo", {
            get: function () {
                return this.varsInfo;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(AttributeBlendContainer.prototype, "totalSlots", {
            get: function () {
                return this._nSlots;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(AttributeBlendContainer.prototype, "totalBufferSlots", {
            get: function () {
                return this._nBufferSlots;
            },
            enumerable: true,
            configurable: true
        });

        AttributeBlendContainer.prototype.getOffsetVarsBySemantic = function (sName) {
            return this._pOffsetVarsBySemanticMap[sName];
        };

        AttributeBlendContainer.prototype.getOffsetDefault = function (sName) {
            return this._pOffsetDefaultMap[sName];
        };

        AttributeBlendContainer.prototype.getSlotBySemanticIndex = function (iIndex) {
            return this._pSlotBySemanticIndex[iIndex];
        };

        AttributeBlendContainer.prototype.getBufferSlotBySemanticIndex = function (iIndex) {
            return this._pBufferSlotBySlots[this.getSlotBySemanticIndex(iIndex)];
        };

        AttributeBlendContainer.prototype.getAttributeListBySemanticIndex = function (iIndex) {
            return this.getVarList(iIndex);
        };

        AttributeBlendContainer.prototype.getTypeForShaderAttributeBySemanticIndex = function (iIndex) {
            return this._pIsPointerBySlot[this.getSlotBySemanticIndex(iIndex)] ? Effect.getSystemType("ptr") : this.getTypeBySemanticIndex(iIndex).getBaseType();
        };

        AttributeBlendContainer.prototype.getTypeBySemanticIndex = function (iIndex) {
            return this.getBlendType(iIndex);
        };

        AttributeBlendContainer.prototype.addAttribute = function (pVariable) {
            return this.addVariable(pVariable, 2 /* k_Attribute */);
        };

        AttributeBlendContainer.prototype.hasAttrWithSemantic = function (sSemantic) {
            return this.hasVariableWithName(sSemantic);
        };

        AttributeBlendContainer.prototype.getAttributeBySemanticIndex = function (iIndex) {
            return this.getVariable(iIndex);
        };

        AttributeBlendContainer.prototype.getAttributeBySemantic = function (sSemantic) {
            return this.getVariableByName(sSemantic);
        };

        AttributeBlendContainer.prototype.hasTexcoord = function (iSlot) {
            return this.hasAttrWithSemantic(Usage.TEXCOORD + iSlot.toString());
        };

        AttributeBlendContainer.prototype.getTexcoordVar = function (iSlot) {
            return this.getVariableByName(Usage.TEXCOORD + iSlot.toString());
        };

        AttributeBlendContainer.prototype.finalize = function () {
            this._nSemantics = this.attrsInfo.length;

            this._pSlotBySemanticIndex = new Array(this._nSemantics);
            this._pTypeInfoBySemanticIndex = new Array(this._nSemantics);

            for (var i = 0; i < this._nSemantics; i++) {
                this._pSlotBySemanticIndex[i] = -1;
                this._pTypeInfoBySemanticIndex[i] = this.createTypeInfo(i);
            }

            for (var i = 0; i < this._pFlowBySlots.length; i++) {
                this._pFlowBySlots[i] = -1;
                this._pSlotByFlows[i] = -1;
                this._pIsPointerBySlot[i] = false;
                this._pBufferSlotBySlots[i] = -1;
            }

            for (var i = 0; i < this._pVBByBufferSlots.length; i++) {
                this._pVBByBufferSlots[i] = 0;
            }
        };

        AttributeBlendContainer.prototype.clear = function () {
            this._nSlots = 0;
            this._nBufferSlots = 0;

            this._sHash = "";
        };

        AttributeBlendContainer.prototype.generateOffsetMap = function () {
            this._pOffsetVarsBySemanticMap = {};
            this._pOffsetDefaultMap = {};

            var pAttrs = this.attrsInfo;

            for (var i = 0; i < pAttrs.length; i++) {
                var pAttrInfo = pAttrs[i];
                var sSemantic = pAttrInfo.name;
                var pAttr = this.getAttributeBySemanticIndex(i);

                if (pAttr.isPointer()) {
                    this._pOffsetVarsBySemanticMap[sSemantic] = [];
                    if (pAttr.getType().isComplex()) {
                        var pAttrSubDecls = pAttr.getSubVarDecls();

                        for (var j = 0; j < pAttrSubDecls.length; j++) {
                            var pSubDecl = pAttrSubDecls[j];

                            if (pSubDecl.getName() === "offset") {
                                var sOffsetName = pSubDecl.getRealName();

                                this._pOffsetVarsBySemanticMap[sSemantic].push(pSubDecl);
                                this._pOffsetDefaultMap[sOffsetName] = (pSubDecl.getParent()).getType().getPadding();
                            }
                        }
                    } else {
                        var pOffsetVar = pAttr.getType()._getAttrOffset();
                        var sOffsetName = pOffsetVar.getRealName();

                        this._pOffsetVarsBySemanticMap[sSemantic].push(pOffsetVar);
                        this._pOffsetDefaultMap[sOffsetName] = 0;
                    }
                } else {
                    this._pOffsetVarsBySemanticMap[sSemantic] = null;
                }
            }
        };

        AttributeBlendContainer.prototype.initFromBufferMap = function (pMap) {
            this.clear();

            if (isNull(pMap)) {
                logger.critical("Yoy don`t set any buffermap for render");
                return;
            }

            var pAttrs = this.attrsInfo;
            var iHash = 0;

            for (var i = 0; i < pAttrs.length; i++) {
                var pAttrInfo = pAttrs[i];
                var sSemantic = pAttrInfo.name;
                var pTypeInfo = this._pTypeInfoBySemanticIndex[i];

                var pFindFlow = null;

                if (pTypeInfo.isComplex) {
                    // pFindFlow = pMap.findFlow(sSemantic) || pMap.getFlow(sSemantic, true);
                    pFindFlow = pMap.findFlow(sSemantic) || pMap.getFlowBySemantic(sSemantic);
                } else {
                    // pFindFlow = pMap.getFlow(sSemantic, true);
                    pFindFlow = pMap.getFlowBySemantic(sSemantic);
                }

                if (!isNull(pFindFlow)) {
                    var iBufferSlot = -1;
                    var iFlow = pFindFlow.flow;
                    var iSlot = this._pSlotByFlows[iFlow];

                    if (iSlot >= 0 && iSlot < this._nSlots && this._pFlowBySlots[iSlot] === iFlow) {
                        this._pSlotBySemanticIndex[i] = iSlot;
                        iHash += ((iSlot + 1) << 5 + (this._pBufferSlotBySlots[iSlot] + 1)) << iSlot;
                        // continue;
                    } else {
                        iSlot = this._nSlots;

                        if (pFindFlow.type === 1 /* MAPPABLE */) {
                            if (!pTypeInfo.isPointer) {
                                logger.critical("You try to put pointer data into non-pointer attribute with semantic '" + sSemantic + "'");
                            }

                            // iSlot = this._pSlotByFlows[iFlow];
                            // if(iSlot >= 0 && this._pFlowBySlots[iSlot] === iFlow){
                            // 	this._pSlotBySemanticIndex[i] = iSlot;
                            // 	iHash += ((iSlot + 1) << 5 + (this._pBufferSlotBySlots[iSlot] + 1)) << iSlot;
                            // 	continue;
                            // }
                            // iSlot = this._nSlots;
                            var iBuffer = (pFindFlow.data.buffer).getGuid();

                            for (var j = 0; j < this._nBufferSlots; j++) {
                                if (this._pVBByBufferSlots[j] === iBuffer) {
                                    iBufferSlot = j;
                                    break;
                                }
                            }

                            if (iBufferSlot === -1) {
                                iBufferSlot = this._nBufferSlots;
                                this._pVBByBufferSlots[iBufferSlot] = iBuffer;
                                this._nBufferSlots++;
                            }

                            this._pIsPointerBySlot[iSlot] = true;
                        } else {
                            if (pTypeInfo.isStrictPointer) {
                                logger.critical("You try to put non-pointer data into pointer attribute with semantic '" + sSemantic + "'");
                            }

                            this._pIsPointerBySlot[iSlot] = false;
                        }

                        //new slot
                        this._pSlotBySemanticIndex[i] = iSlot;
                        this._pFlowBySlots[iSlot] = iFlow;
                        this._pSlotByFlows[iFlow] = iSlot;
                        this._pBufferSlotBySlots[iSlot] = iBufferSlot;

                        iHash += ((iSlot + 1) << 5 + (iBufferSlot + 1)) << iSlot;
                        this._nSlots++;
                    }
                } else {
                    this._pSlotBySemanticIndex[i] = -1;
                }
            }

            this._sHash = iHash.toString();
        };

        AttributeBlendContainer.prototype.getHash = function () {
            return this._sHash;
        };

        AttributeBlendContainer.prototype.createTypeInfo = function (iIndex) {
            return {
                isComplex: this.getTypeBySemanticIndex(iIndex).isComplex(),
                isPointer: this.getTypeBySemanticIndex(iIndex).isPointer(),
                isStrictPointer: this.getTypeBySemanticIndex(iIndex).isStrictPointer()
            };
        };
        return AttributeBlendContainer;
    })(VariableBlendContainer);

    
    return AttributeBlendContainer;
});
//# sourceMappingURL=AttributeBlendContainer.js.map
