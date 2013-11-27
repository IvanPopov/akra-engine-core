/// <reference path="../idl/AIAFXInstruction.ts" />
/// <reference path="../idl/AITexture.ts" />

import ExprInstruction = require("fx/ExprInstruction");

/**
  * Represetn sampler_state { states }
  */
class SamplerStateBlockInstruction extends ExprInstruction {
    private _pTexture: AIAFXVariableDeclInstruction = null;
    private _pSamplerParams: any = null;

    constructor() {
        super();
        this._pInstructionList = null;
        this._eInstructionType = AEAFXInstructionTypes.k_SamplerStateBlockInstruction;
    }

    addState(sStateType: string, sStateValue: string): void {
        if (isNull(this._pSamplerParams)) {
            this._pSamplerParams = {};
        }

        this._pSamplerParams[sStateType] = sStateValue;
        return;
    }

    setTexture(pTexture: AIAFXVariableDeclInstruction): void {
        this._pTexture = pTexture;
    }

    getTexture(): AIAFXVariableDeclInstruction {
        return this._pTexture;
    }

    isConst(): boolean {
        return true;
    }

    evaluate(): boolean {
        var pSamplerState: AIAFXSamplerState = {
            texture: null,
            textureName: "",

            wrap_s: 0,
            wrap_t: 0,

            mag_filter: 0,
            min_filter: 0
        };

        if (!isNull(this._pTexture)) {
            pSamplerState.textureName = this._pTexture.getRealName();
        }

        if (!isNull(this._pSamplerParams)) {
            if (isDef(this._pSamplerParams["ADDRESSU"])) {
                pSamplerState.wrap_s = SamplerStateBlockInstruction.convertWrapMode(this._pSamplerParams["ADDRESSU"]);
            }

            if (isDef(this._pSamplerParams["ADDRESSV"])) {
                pSamplerState.wrap_t = SamplerStateBlockInstruction.convertWrapMode(this._pSamplerParams["ADDRESSV"]);
            }

            if (isDef(this._pSamplerParams["MAGFILTER"])) {
                pSamplerState.mag_filter = SamplerStateBlockInstruction.convertFilters(this._pSamplerParams["MAGFILTER"]);
            }

            if (isDef(this._pSamplerParams["MINFILTER"])) {
                pSamplerState.min_filter = SamplerStateBlockInstruction.convertFilters(this._pSamplerParams["MINFILTER"]);
            }
        }


        this._pLastEvalResult = pSamplerState;

        return true;
    }

    static convertWrapMode(sState: string): AETextureWrapModes {
        switch (sState) {
            case "WRAP":
                return AETextureWrapModes.REPEAT;
            case "CLAMP":
                return AETextureWrapModes.CLAMP_TO_EDGE;
            case "MIRROR":
                return AETextureWrapModes.MIRRORED_REPEAT;

            default:
                return 0;
        }
    }

    static convertFilters(sState: string): AETextureFilters {
        switch (sState) {
            case "NEAREST":
                return AETextureFilters.NEAREST;
            case "LINEAR":
                return AETextureFilters.LINEAR;
            case "NEAREST_MIPMAP_NEAREST":
                return AETextureFilters.NEAREST_MIPMAP_NEAREST;
            case "LINEAR_MIPMAP_NEAREST":
                return AETextureFilters.LINEAR_MIPMAP_NEAREST;
            case "NEAREST_MIPMAP_LINEAR":
                return AETextureFilters.NEAREST_MIPMAP_LINEAR;
            case "LINEAR_MIPMAP_LINEAR":
                return AETextureFilters.LINEAR_MIPMAP_LINEAR;

            default:
                return 0;
        }
    }
}


export = SamplerStateBlockInstruction;