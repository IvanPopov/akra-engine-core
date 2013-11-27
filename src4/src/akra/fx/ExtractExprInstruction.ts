import ExprInstruction = require("fx/ExprInstruction");
import Effect = require("fx/Effect");

class ExtractExprInstruction extends ExprInstruction {
    private _eExtractExprType: AEExtractExprType = 0;
    private _pPointer: AIAFXVariableDeclInstruction = null;
    private _pBuffer: AIAFXVariableDeclInstruction = null;
    private _pOffsetVar: AIAFXVariableDeclInstruction = null;
    private _sPaddingExpr: string = "";

    private _sExtractFunction: string = "";
    private _bNeedSecondBracket: boolean = false;

    constructor() {
        super();
        this._pInstructionList = null;
        this._eInstructionType = AEAFXInstructionTypes.k_ExtractExprInstruction;
    }

    getExtractFunction(): AIAFXFunctionDeclInstruction {
        var pFunction: AIAFXFunctionDeclInstruction = null;

        switch (this._eExtractExprType) {
            case AEExtractExprType.k_Header:
                pFunction = Effect.findSystemFunction("extractHeader", null);
                break;

            case AEExtractExprType.k_Float:
            case AEExtractExprType.k_Int:
            case AEExtractExprType.k_Bool:
                pFunction = Effect.findSystemFunction("extractFloat", null);
                break;

            case AEExtractExprType.k_Float2:
            case AEExtractExprType.k_Int2:
            case AEExtractExprType.k_Bool2:
                pFunction = Effect.findSystemFunction("extractFloat2", null);
                break;

            case AEExtractExprType.k_Float3:
            case AEExtractExprType.k_Int3:
            case AEExtractExprType.k_Bool3:
                pFunction = Effect.findSystemFunction("extractFloat3", null);
                break;

            case AEExtractExprType.k_Float4:
            case AEExtractExprType.k_Int4:
            case AEExtractExprType.k_Bool4:
                pFunction = Effect.findSystemFunction("extractFloat4", null);
                break;

            case AEExtractExprType.k_Float4x4:
                pFunction = Effect.findSystemFunction("extractFloat4x4", null);
                break;
        }

        return pFunction;
    }

    initExtractExpr(pExtractType: AIAFXVariableTypeInstruction,
        pPointer: AIAFXVariableDeclInstruction,
        pBuffer: AIAFXVariableDeclInstruction,
        sPaddingExpr: string, pOffsetVar: AIAFXVariableDeclInstruction): void {

        this._pPointer = pPointer;
        this._pBuffer = pBuffer;
        this._sPaddingExpr = sPaddingExpr;
        this._pOffsetVar = pOffsetVar;
        this.setType(pExtractType);

        if (pExtractType.isEqual(Effect.getSystemType("float"))) {
            this._eExtractExprType = AEExtractExprType.k_Float;
            this._sExtractFunction += "A_extractFloat(";
        }
        else if (pExtractType.isEqual(Effect.getSystemType("ptr"))) {
            this._eExtractExprType = AEExtractExprType.k_Float;
            this._sExtractFunction += "A_extractFloat(";
        }
        else if (pExtractType.isEqual(Effect.getSystemType("video_buffer_header"))) {
            this._eExtractExprType = AEExtractExprType.k_Header;
            this._sExtractFunction += "A_extractTextureHeader(";
        }
        else if (pExtractType.isEqual(Effect.getSystemType("boolean"))) {
            this._eExtractExprType = AEExtractExprType.k_Bool;
            this._sExtractFunction += "boolean(A_extractFloat(";
            this._bNeedSecondBracket = true;
        }
        else if (pExtractType.isEqual(Effect.getSystemType("int"))) {
            this._eExtractExprType = AEExtractExprType.k_Int;
            this._sExtractFunction += ("int(A_extractFloat(");
            this._bNeedSecondBracket = true;
        }
        else if (pExtractType.isEqual(Effect.getSystemType("float2"))) {
            this._eExtractExprType = AEExtractExprType.k_Float2;
            this._sExtractFunction += ("A_extractVec2(");
        }
        else if (pExtractType.isEqual(Effect.getSystemType("float3"))) {
            this._eExtractExprType = AEExtractExprType.k_Float3;
            this._sExtractFunction += ("A_extractVec3(");
        }
        else if (pExtractType.isEqual(Effect.getSystemType("float4"))) {
            this._eExtractExprType = AEExtractExprType.k_Float4;
            this._sExtractFunction += ("A_extractVec4(");
        }
        else if (pExtractType.isEqual(Effect.getSystemType("int2"))) {
            this._eExtractExprType = AEExtractExprType.k_Int2;
            this._sExtractFunction += ("ivec2(A_extractVec2(");
            this._bNeedSecondBracket = true;
        }
        else if (pExtractType.isEqual(Effect.getSystemType("int3"))) {
            this._eExtractExprType = AEExtractExprType.k_Int3;
            this._sExtractFunction += ("ivec3(A_extractVec3(");
            this._bNeedSecondBracket = true;
        }
        else if (pExtractType.isEqual(Effect.getSystemType("int4"))) {
            this._eExtractExprType = AEExtractExprType.k_Int4;
            this._sExtractFunction += ("ivec4(A_extractVec4(");
            this._bNeedSecondBracket = true;
        }
        else if (pExtractType.isEqual(Effect.getSystemType("bool2"))) {
            this._eExtractExprType = AEExtractExprType.k_Bool2;
            this._sExtractFunction += ("bvec2(A_extractVec2(");
            this._bNeedSecondBracket = true;
        }
        else if (pExtractType.isEqual(Effect.getSystemType("bool3"))) {
            this._eExtractExprType = AEExtractExprType.k_Bool3;
            this._sExtractFunction += ("bvec3(A_extractVec3(");
            this._bNeedSecondBracket = true;
        }
        else if (pExtractType.isEqual(Effect.getSystemType("bool4"))) {
            this._eExtractExprType = AEExtractExprType.k_Bool4;
            this._sExtractFunction += ("bvec4(A_extractVec4(");
            this._bNeedSecondBracket = true;
        }
        else if (pExtractType.isEqual(Effect.getSystemType("float4x4"))) {
            this._eExtractExprType = AEExtractExprType.k_Float4x4;
            this._sExtractFunction += ("A_extractMat4(");
        }
        else {
            this.setError(AEEffectErrors.UNSUPPORTED_EXTRACT_BASE_TYPE, { typeName: pExtractType.getHash() });
        }
    }

    addUsedData(pUsedDataCollector: AIAFXTypeUseInfoMap,
        eUsedMode: AEVarUsedMode = AEVarUsedMode.k_Undefined): void {
        var pPointerType: AIAFXVariableTypeInstruction = this._pPointer.getType();
        var pBufferType: AIAFXVariableTypeInstruction = this._pBuffer.getType();

        var pInfo: AIAFXTypeUseInfoContainer = pUsedDataCollector[pPointerType._getInstructionID()];

        if (!isDef(pInfo)) {
            pInfo = <AIAFXTypeUseInfoContainer>{
                type: pPointerType,
                isRead: false,
                isWrite: false,
                numRead: 0,
                numWrite: 0,
                numUsed: 0
            }

				pUsedDataCollector[pPointerType._getInstructionID()] = pInfo;
        }

        pInfo.isRead = true;
        pInfo.numRead++;
        pInfo.numUsed++;

        pInfo = pUsedDataCollector[pBufferType._getInstructionID()];

        if (!isDef(pInfo)) {
            pInfo = <AIAFXTypeUseInfoContainer>{
                type: pBufferType,
                isRead: false,
                isWrite: false,
                numRead: 0,
                numWrite: 0,
                numUsed: 0
            }

				pUsedDataCollector[pBufferType._getInstructionID()] = pInfo;
        }

        pInfo.isRead = true;
        pInfo.numRead++;
        pInfo.numUsed++;
    }

    toFinalCode(): string {
        var sCode: string = "";

        if (this._pBuffer.isDefinedByZero()) {
            switch (this._eExtractExprType) {
                case AEExtractExprType.k_Header:
                    sCode = "A_TextureHeader(0.,0.,0.,0.)";
                    break;

                case AEExtractExprType.k_Float:
                    sCode = "0.";
                    break;
                case AEExtractExprType.k_Int:
                    sCode = "0";
                    break;
                case AEExtractExprType.k_Bool:
                    sCode = "false";
                    break;

                case AEExtractExprType.k_Float2:
                    sCode = "vec2(0.)";
                    break;
                case AEExtractExprType.k_Int2:
                    sCode = "ivec2(0)";
                    break;
                case AEExtractExprType.k_Bool2:
                    sCode = "bvec2(false)";
                    break;

                case AEExtractExprType.k_Float3:
                    sCode = "vec3(0.)";
                    break;
                case AEExtractExprType.k_Int3:
                    sCode = "ivec3(0)";
                    break;
                case AEExtractExprType.k_Bool3:
                    sCode = "bvec3(false)";
                    break;

                case AEExtractExprType.k_Float4:
                    sCode = "vec4(0.)";
                    break;
                case AEExtractExprType.k_Int4:
                    sCode = "ivec4(0)";
                    break;
                case AEExtractExprType.k_Bool4:
                    sCode = "bvec4(false)";
                    break;

                case AEExtractExprType.k_Float4x4:
                    sCode = "mat4(0.)";
                    break;
            }
        }
        else {
            sCode = this._sExtractFunction;
            sCode += this._pBuffer._getVideoBufferSampler().getNameId().toFinalCode();
            sCode += "," + this._pBuffer._getVideoBufferHeader().getNameId().toFinalCode();
            if (this._eExtractExprType !== AEExtractExprType.k_Header) {
                sCode += "," + this._pPointer.getNameId().toFinalCode() + this._sPaddingExpr;

                if (!isNull(this._pOffsetVar)) {
                    sCode += "+" + this._pOffsetVar.getNameId().toFinalCode();
                }
            }
            sCode += ")";
            if (this._bNeedSecondBracket) {
                sCode += ")";
            }
        }

        return sCode;
    }

    clone(pRelationMap?: AIAFXInstructionMap): ExtractExprInstruction {
        var pClone: ExtractExprInstruction = <ExtractExprInstruction>super.clone(pRelationMap);
        pClone._setCloneParams(this._pPointer.clone(pRelationMap), this._pBuffer, this._eExtractExprType,
            this._sPaddingExpr, this._sExtractFunction, this._bNeedSecondBracket);
        return pClone;
    }

    _setCloneParams(pPointer: AIAFXVariableDeclInstruction,
        pBuffer: AIAFXVariableDeclInstruction,
        eExtractExprType: AEExtractExprType,
        sPaddingExpr: string,
        sExtractFunction: string,
        bNeedSecondBracket: boolean): void {
        this._pPointer = pPointer;
        this._pBuffer = pBuffer;
        this._eExtractExprType = eExtractExprType;
        this._sPaddingExpr = sPaddingExpr;
        this._sExtractFunction = sExtractFunction;
        this._bNeedSecondBracket = bNeedSecondBracket;
    }
}


export = ExtractExprInstruction;