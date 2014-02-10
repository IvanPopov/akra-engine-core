/// <reference path="ExprInstruction.ts" />
/// <reference path="Effect.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (fx) {
        var ExtractExprInstruction = (function (_super) {
            __extends(ExtractExprInstruction, _super);
            function ExtractExprInstruction() {
                _super.call(this);
                this._eExtractExprType = 0;
                this._pPointer = null;
                this._pBuffer = null;
                this._pOffsetVar = null;
                this._sPaddingExpr = "";
                this._sExtractFunction = "";
                this._bNeedSecondBracket = false;
                this._pInstructionList = null;
                this._eInstructionType = 42 /* k_ExtractExprInstruction */;
            }
            ExtractExprInstruction.prototype.getExtractFunction = function () {
                var pFunction = null;

                switch (this._eExtractExprType) {
                    case 0 /* k_Header */:
                        pFunction = akra.fx.Effect.findSystemFunction("extractHeader", null);
                        break;

                    case 1 /* k_Float */:
                    case 2 /* k_Int */:
                    case 3 /* k_Bool */:
                        pFunction = akra.fx.Effect.findSystemFunction("extractFloat", null);
                        break;

                    case 4 /* k_Float2 */:
                    case 5 /* k_Int2 */:
                    case 6 /* k_Bool2 */:
                        pFunction = akra.fx.Effect.findSystemFunction("extractFloat2", null);
                        break;

                    case 7 /* k_Float3 */:
                    case 8 /* k_Int3 */:
                    case 9 /* k_Bool3 */:
                        pFunction = akra.fx.Effect.findSystemFunction("extractFloat3", null);
                        break;

                    case 10 /* k_Float4 */:
                    case 11 /* k_Int4 */:
                    case 12 /* k_Bool4 */:
                        pFunction = akra.fx.Effect.findSystemFunction("extractFloat4", null);
                        break;

                    case 13 /* k_Float4x4 */:
                        pFunction = akra.fx.Effect.findSystemFunction("extractFloat4x4", null);
                        break;
                }

                return pFunction;
            };

            ExtractExprInstruction.prototype.initExtractExpr = function (pExtractType, pPointer, pBuffer, sPaddingExpr, pOffsetVar) {
                this._pPointer = pPointer;
                this._pBuffer = pBuffer;
                this._sPaddingExpr = sPaddingExpr;
                this._pOffsetVar = pOffsetVar;
                this.setType(pExtractType);

                if (pExtractType.isEqual(akra.fx.Effect.getSystemType("float"))) {
                    this._eExtractExprType = 1 /* k_Float */;
                    this._sExtractFunction += "A_extractFloat(";
                } else if (pExtractType.isEqual(akra.fx.Effect.getSystemType("ptr"))) {
                    this._eExtractExprType = 1 /* k_Float */;
                    this._sExtractFunction += "A_extractFloat(";
                } else if (pExtractType.isEqual(akra.fx.Effect.getSystemType("video_buffer_header"))) {
                    this._eExtractExprType = 0 /* k_Header */;
                    this._sExtractFunction += "A_extractTextureHeader(";
                } else if (pExtractType.isEqual(akra.fx.Effect.getSystemType("bool"))) {
                    this._eExtractExprType = 3 /* k_Bool */;
                    this._sExtractFunction += "boolean(A_extractFloat(";
                    this._bNeedSecondBracket = true;
                } else if (pExtractType.isEqual(akra.fx.Effect.getSystemType("int"))) {
                    this._eExtractExprType = 2 /* k_Int */;
                    this._sExtractFunction += ("int(A_extractFloat(");
                    this._bNeedSecondBracket = true;
                } else if (pExtractType.isEqual(akra.fx.Effect.getSystemType("float2"))) {
                    this._eExtractExprType = 4 /* k_Float2 */;
                    this._sExtractFunction += ("A_extractVec2(");
                } else if (pExtractType.isEqual(akra.fx.Effect.getSystemType("float3"))) {
                    this._eExtractExprType = 7 /* k_Float3 */;
                    this._sExtractFunction += ("A_extractVec3(");
                } else if (pExtractType.isEqual(akra.fx.Effect.getSystemType("float4"))) {
                    this._eExtractExprType = 10 /* k_Float4 */;
                    this._sExtractFunction += ("A_extractVec4(");
                } else if (pExtractType.isEqual(akra.fx.Effect.getSystemType("int2"))) {
                    this._eExtractExprType = 5 /* k_Int2 */;
                    this._sExtractFunction += ("ivec2(A_extractVec2(");
                    this._bNeedSecondBracket = true;
                } else if (pExtractType.isEqual(akra.fx.Effect.getSystemType("int3"))) {
                    this._eExtractExprType = 8 /* k_Int3 */;
                    this._sExtractFunction += ("ivec3(A_extractVec3(");
                    this._bNeedSecondBracket = true;
                } else if (pExtractType.isEqual(akra.fx.Effect.getSystemType("int4"))) {
                    this._eExtractExprType = 11 /* k_Int4 */;
                    this._sExtractFunction += ("ivec4(A_extractVec4(");
                    this._bNeedSecondBracket = true;
                } else if (pExtractType.isEqual(akra.fx.Effect.getSystemType("bool2"))) {
                    this._eExtractExprType = 6 /* k_Bool2 */;
                    this._sExtractFunction += ("bvec2(A_extractVec2(");
                    this._bNeedSecondBracket = true;
                } else if (pExtractType.isEqual(akra.fx.Effect.getSystemType("bool3"))) {
                    this._eExtractExprType = 9 /* k_Bool3 */;
                    this._sExtractFunction += ("bvec3(A_extractVec3(");
                    this._bNeedSecondBracket = true;
                } else if (pExtractType.isEqual(akra.fx.Effect.getSystemType("bool4"))) {
                    this._eExtractExprType = 12 /* k_Bool4 */;
                    this._sExtractFunction += ("bvec4(A_extractVec4(");
                    this._bNeedSecondBracket = true;
                } else if (pExtractType.isEqual(akra.fx.Effect.getSystemType("float4x4"))) {
                    this._eExtractExprType = 13 /* k_Float4x4 */;
                    this._sExtractFunction += ("A_extractMat4(");
                } else {
                    this.setError(2273 /* UNSUPPORTED_EXTRACT_BASE_TYPE */, { typeName: pExtractType.getHash() });
                }
            };

            ExtractExprInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
                if (typeof eUsedMode === "undefined") { eUsedMode = 3 /* k_Undefined */; }
                var pPointerType = this._pPointer.getType();
                var pBufferType = this._pBuffer.getType();

                var pInfo = pUsedDataCollector[pPointerType._getInstructionID()];

                if (!akra.isDef(pInfo)) {
                    pInfo = {
                        type: pPointerType,
                        isRead: false,
                        isWrite: false,
                        numRead: 0,
                        numWrite: 0,
                        numUsed: 0
                    };

                    pUsedDataCollector[pPointerType._getInstructionID()] = pInfo;
                }

                pInfo.isRead = true;
                pInfo.numRead++;
                pInfo.numUsed++;

                pInfo = pUsedDataCollector[pBufferType._getInstructionID()];

                if (!akra.isDef(pInfo)) {
                    pInfo = {
                        type: pBufferType,
                        isRead: false,
                        isWrite: false,
                        numRead: 0,
                        numWrite: 0,
                        numUsed: 0
                    };

                    pUsedDataCollector[pBufferType._getInstructionID()] = pInfo;
                }

                pInfo.isRead = true;
                pInfo.numRead++;
                pInfo.numUsed++;
            };

            ExtractExprInstruction.prototype.toFinalCode = function () {
                var sCode = "";

                if (this._pBuffer.isDefinedByZero()) {
                    switch (this._eExtractExprType) {
                        case 0 /* k_Header */:
                            sCode = "A_TextureHeader(0.,0.,0.,0.)";
                            break;

                        case 1 /* k_Float */:
                            sCode = "0.";
                            break;
                        case 2 /* k_Int */:
                            sCode = "0";
                            break;
                        case 3 /* k_Bool */:
                            sCode = "false";
                            break;

                        case 4 /* k_Float2 */:
                            sCode = "vec2(0.)";
                            break;
                        case 5 /* k_Int2 */:
                            sCode = "ivec2(0)";
                            break;
                        case 6 /* k_Bool2 */:
                            sCode = "bvec2(false)";
                            break;

                        case 7 /* k_Float3 */:
                            sCode = "vec3(0.)";
                            break;
                        case 8 /* k_Int3 */:
                            sCode = "ivec3(0)";
                            break;
                        case 9 /* k_Bool3 */:
                            sCode = "bvec3(false)";
                            break;

                        case 10 /* k_Float4 */:
                            sCode = "vec4(0.)";
                            break;
                        case 11 /* k_Int4 */:
                            sCode = "ivec4(0)";
                            break;
                        case 12 /* k_Bool4 */:
                            sCode = "bvec4(false)";
                            break;

                        case 13 /* k_Float4x4 */:
                            sCode = "mat4(0.)";
                            break;
                    }
                } else {
                    sCode = this._sExtractFunction;
                    sCode += this._pBuffer._getVideoBufferSampler().getNameId().toFinalCode();
                    sCode += "," + this._pBuffer._getVideoBufferHeader().getNameId().toFinalCode();
                    if (this._eExtractExprType !== 0 /* k_Header */) {
                        sCode += "," + this._pPointer.getNameId().toFinalCode() + this._sPaddingExpr;

                        if (!akra.isNull(this._pOffsetVar)) {
                            sCode += "+" + this._pOffsetVar.getNameId().toFinalCode();
                        }
                    }
                    sCode += ")";
                    if (this._bNeedSecondBracket) {
                        sCode += ")";
                    }
                }

                return sCode;
            };

            ExtractExprInstruction.prototype.clone = function (pRelationMap) {
                var pClone = _super.prototype.clone.call(this, pRelationMap);
                pClone._setCloneParams(this._pPointer.clone(pRelationMap), this._pBuffer, this._eExtractExprType, this._sPaddingExpr, this._sExtractFunction, this._bNeedSecondBracket);
                return pClone;
            };

            ExtractExprInstruction.prototype._setCloneParams = function (pPointer, pBuffer, eExtractExprType, sPaddingExpr, sExtractFunction, bNeedSecondBracket) {
                this._pPointer = pPointer;
                this._pBuffer = pBuffer;
                this._eExtractExprType = eExtractExprType;
                this._sPaddingExpr = sPaddingExpr;
                this._sExtractFunction = sExtractFunction;
                this._bNeedSecondBracket = bNeedSecondBracket;
            };
            return ExtractExprInstruction;
        })(akra.fx.ExprInstruction);
        fx.ExtractExprInstruction = ExtractExprInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=ExtractExprInstruction.js.map
