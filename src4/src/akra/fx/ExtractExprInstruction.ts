import ExprInstruction = require("fx/ExprInstruction");
import Effect = require("fx/Effect");

class ExtractExprInstruction extends ExprInstruction {
    private _eExtractExprType: EExtractExprType = 0;
    private _pPointer: IAFXVariableDeclInstruction = null;
    private _pBuffer: IAFXVariableDeclInstruction = null;
    private _pOffsetVar: IAFXVariableDeclInstruction = null;
    private _sPaddingExpr: string = "";

    private _sExtractFunction: string = "";
    private _bNeedSecondBracket: boolean = false;

    constructor() {
        super();
        this._pInstructionList = null;
        this._eInstructionType = EAFXInstructionTypes.k_ExtractExprInstruction;
    }

    getExtractFunction(): IAFXFunctionDeclInstruction {
        var pFunction: IAFXFunctionDeclInstruction = null;

        switch (this._eExtractExprType) {
            case EExtractExprType.k_Header:
                pFunction = Effect.findSystemFunction("extractHeader", null);
                break;

            case EExtractExprType.k_Float:
            case EExtractExprType.k_Int:
            case EExtractExprType.k_Bool:
                pFunction = Effect.findSystemFunction("extractFloat", null);
                break;

            case EExtractExprType.k_Float2:
            case EExtractExprType.k_Int2:
            case EExtractExprType.k_Bool2:
                pFunction = Effect.findSystemFunction("extractFloat2", null);
                break;

            case EExtractExprType.k_Float3:
            case EExtractExprType.k_Int3:
            case EExtractExprType.k_Bool3:
                pFunction = Effect.findSystemFunction("extractFloat3", null);
                break;

            case EExtractExprType.k_Float4:
            case EExtractExprType.k_Int4:
            case EExtractExprType.k_Bool4:
                pFunction = Effect.findSystemFunction("extractFloat4", null);
                break;

            case EExtractExprType.k_Float4x4:
                pFunction = Effect.findSystemFunction("extractFloat4x4", null);
                break;
        }

        return pFunction;
    }

    initExtractExpr(pExtractType: IAFXVariableTypeInstruction,
        pPointer: IAFXVariableDeclInstruction,
        pBuffer: IAFXVariableDeclInstruction,
        sPaddingExpr: string, pOffsetVar: IAFXVariableDeclInstruction): void {

        this._pPointer = pPointer;
        this._pBuffer = pBuffer;
        this._sPaddingExpr = sPaddingExpr;
        this._pOffsetVar = pOffsetVar;
        this.setType(pExtractType);

        if (pExtractType.isEqual(Effect.getSystemType("float"))) {
            this._eExtractExprType = EExtractExprType.k_Float;
            this._sExtractFunction += "A_extractFloat(";
        }
        else if (pExtractType.isEqual(Effect.getSystemType("ptr"))) {
            this._eExtractExprType = EExtractExprType.k_Float;
            this._sExtractFunction += "A_extractFloat(";
        }
        else if (pExtractType.isEqual(Effect.getSystemType("video_buffer_header"))) {
            this._eExtractExprType = EExtractExprType.k_Header;
            this._sExtractFunction += "A_extractTextureHeader(";
        }
        else if (pExtractType.isEqual(Effect.getSystemType("boolean"))) {
            this._eExtractExprType = EExtractExprType.k_Bool;
            this._sExtractFunction += "boolean(A_extractFloat(";
            this._bNeedSecondBracket = true;
        }
        else if (pExtractType.isEqual(Effect.getSystemType("int"))) {
            this._eExtractExprType = EExtractExprType.k_Int;
            this._sExtractFunction += ("int(A_extractFloat(");
            this._bNeedSecondBracket = true;
        }
        else if (pExtractType.isEqual(Effect.getSystemType("float2"))) {
            this._eExtractExprType = EExtractExprType.k_Float2;
            this._sExtractFunction += ("A_extractVec2(");
        }
        else if (pExtractType.isEqual(Effect.getSystemType("float3"))) {
            this._eExtractExprType = EExtractExprType.k_Float3;
            this._sExtractFunction += ("A_extractVec3(");
        }
        else if (pExtractType.isEqual(Effect.getSystemType("float4"))) {
            this._eExtractExprType = EExtractExprType.k_Float4;
            this._sExtractFunction += ("A_extractVec4(");
        }
        else if (pExtractType.isEqual(Effect.getSystemType("int2"))) {
            this._eExtractExprType = EExtractExprType.k_Int2;
            this._sExtractFunction += ("ivec2(A_extractVec2(");
            this._bNeedSecondBracket = true;
        }
        else if (pExtractType.isEqual(Effect.getSystemType("int3"))) {
            this._eExtractExprType = EExtractExprType.k_Int3;
            this._sExtractFunction += ("ivec3(A_extractVec3(");
            this._bNeedSecondBracket = true;
        }
        else if (pExtractType.isEqual(Effect.getSystemType("int4"))) {
            this._eExtractExprType = EExtractExprType.k_Int4;
            this._sExtractFunction += ("ivec4(A_extractVec4(");
            this._bNeedSecondBracket = true;
        }
        else if (pExtractType.isEqual(Effect.getSystemType("bool2"))) {
            this._eExtractExprType = EExtractExprType.k_Bool2;
            this._sExtractFunction += ("bvec2(A_extractVec2(");
            this._bNeedSecondBracket = true;
        }
        else if (pExtractType.isEqual(Effect.getSystemType("bool3"))) {
            this._eExtractExprType = EExtractExprType.k_Bool3;
            this._sExtractFunction += ("bvec3(A_extractVec3(");
            this._bNeedSecondBracket = true;
        }
        else if (pExtractType.isEqual(Effect.getSystemType("bool4"))) {
            this._eExtractExprType = EExtractExprType.k_Bool4;
            this._sExtractFunction += ("bvec4(A_extractVec4(");
            this._bNeedSecondBracket = true;
        }
        else if (pExtractType.isEqual(Effect.getSystemType("float4x4"))) {
            this._eExtractExprType = EExtractExprType.k_Float4x4;
            this._sExtractFunction += ("A_extractMat4(");
        }
        else {
            this.setError(EEffectErrors.UNSUPPORTED_EXTRACT_BASE_TYPE, { typeName: pExtractType.getHash() });
        }
    }

    addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
        eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
        var pPointerType: IAFXVariableTypeInstruction = this._pPointer.getType();
        var pBufferType: IAFXVariableTypeInstruction = this._pBuffer.getType();

        var pInfo: IAFXTypeUseInfoContainer = pUsedDataCollector[pPointerType._getInstructionID()];

        if (!isDef(pInfo)) {
            pInfo = <IAFXTypeUseInfoContainer>{
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
            pInfo = <IAFXTypeUseInfoContainer>{
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
                case EExtractExprType.k_Header:
                    sCode = "A_TextureHeader(0.,0.,0.,0.)";
                    break;

                case EExtractExprType.k_Float:
                    sCode = "0.";
                    break;
                case EExtractExprType.k_Int:
                    sCode = "0";
                    break;
                case EExtractExprType.k_Bool:
                    sCode = "false";
                    break;

                case EExtractExprType.k_Float2:
                    sCode = "vec2(0.)";
                    break;
                case EExtractExprType.k_Int2:
                    sCode = "ivec2(0)";
                    break;
                case EExtractExprType.k_Bool2:
                    sCode = "bvec2(false)";
                    break;

                case EExtractExprType.k_Float3:
                    sCode = "vec3(0.)";
                    break;
                case EExtractExprType.k_Int3:
                    sCode = "ivec3(0)";
                    break;
                case EExtractExprType.k_Bool3:
                    sCode = "bvec3(false)";
                    break;

                case EExtractExprType.k_Float4:
                    sCode = "vec4(0.)";
                    break;
                case EExtractExprType.k_Int4:
                    sCode = "ivec4(0)";
                    break;
                case EExtractExprType.k_Bool4:
                    sCode = "bvec4(false)";
                    break;

                case EExtractExprType.k_Float4x4:
                    sCode = "mat4(0.)";
                    break;
            }
        }
        else {
            sCode = this._sExtractFunction;
            sCode += this._pBuffer._getVideoBufferSampler().getNameId().toFinalCode();
            sCode += "," + this._pBuffer._getVideoBufferHeader().getNameId().toFinalCode();
            if (this._eExtractExprType !== EExtractExprType.k_Header) {
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

    clone(pRelationMap?: IAFXInstructionMap): ExtractExprInstruction {
        var pClone: ExtractExprInstruction = <ExtractExprInstruction>super.clone(pRelationMap);
        pClone._setCloneParams(this._pPointer.clone(pRelationMap), this._pBuffer, this._eExtractExprType,
            this._sPaddingExpr, this._sExtractFunction, this._bNeedSecondBracket);
        return pClone;
    }

    _setCloneParams(pPointer: IAFXVariableDeclInstruction,
        pBuffer: IAFXVariableDeclInstruction,
        eExtractExprType: EExtractExprType,
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