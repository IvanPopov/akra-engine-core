/// <reference path="../../idl/IAFXInstruction.ts" />
/// <reference path="../../idl/ITexture.ts" />

/// <reference path="ExprInstruction.ts" />

module akra.fx.instructions {

    /**
      * Represetn sampler_state { states }
      */
    export class SamplerStateBlockInstruction extends ExprInstruction {
        private _pTexture: IAFXVariableDeclInstruction = null;
        private _pSamplerParams: any = null;

        constructor() {
            super();
            this._pInstructionList = null;
            this._eInstructionType = EAFXInstructionTypes.k_SamplerStateBlockInstruction;
        }

        addState(sStateType: string, sStateValue: string): void {
            if (isNull(this._pSamplerParams)) {
                this._pSamplerParams = {};
            }

            this._pSamplerParams[sStateType] = sStateValue;
            return;
        }

        setTexture(pTexture: IAFXVariableDeclInstruction): void {
            this._pTexture = pTexture;
        }

        getTexture(): IAFXVariableDeclInstruction {
            return this._pTexture;
        }

        _isConst(): boolean {
            return true;
        }

        _evaluate(): boolean {
            var pSamplerState: IAFXSamplerState = {
                texture: null,
                textureName: "",

                wrap_s: 0,
                wrap_t: 0,

                mag_filter: 0,
                min_filter: 0
            };

            if (!isNull(this._pTexture)) {
                pSamplerState.textureName = this._pTexture._getRealName();
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

        static convertWrapMode(sState: string): ETextureWrapModes {
            switch (sState) {
                case "WRAP":
                    return ETextureWrapModes.REPEAT;
                case "CLAMP":
                    return ETextureWrapModes.CLAMP_TO_EDGE;
                case "MIRROR":
                    return ETextureWrapModes.MIRRORED_REPEAT;

                default:
                    return 0;
            }
        }

        static convertFilters(sState: string): ETextureFilters {
            switch (sState) {
                case "NEAREST":
                    return ETextureFilters.NEAREST;
                case "LINEAR":
                    return ETextureFilters.LINEAR;
                case "NEAREST_MIPMAP_NEAREST":
                    return ETextureFilters.NEAREST_MIPMAP_NEAREST;
                case "LINEAR_MIPMAP_NEAREST":
                    return ETextureFilters.LINEAR_MIPMAP_NEAREST;
                case "NEAREST_MIPMAP_LINEAR":
                    return ETextureFilters.NEAREST_MIPMAP_LINEAR;
                case "LINEAR_MIPMAP_LINEAR":
                    return ETextureFilters.LINEAR_MIPMAP_LINEAR;

                default:
                    return 0;
            }
        }
    }
}
