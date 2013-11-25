/// <reference path="../idl/AIAFXInstruction.ts" />
/// <reference path="../idl/AITexture.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/ExprInstruction"], function(require, exports, __ExprInstruction__) {
    var ExprInstruction = __ExprInstruction__;

    /**
    * Represetn sampler_state { states }
    */
    var SamplerStateBlockInstruction = (function (_super) {
        __extends(SamplerStateBlockInstruction, _super);
        function SamplerStateBlockInstruction() {
            _super.call(this);
            this._pTexture = null;
            this._pSamplerParams = null;
            this._pInstructionList = null;
            this._eInstructionType = 40 /* k_SamplerStateBlockInstruction */;
        }
        SamplerStateBlockInstruction.prototype.addState = function (sStateType, sStateValue) {
            if (isNull(this._pSamplerParams)) {
                this._pSamplerParams = {};
            }

            this._pSamplerParams[sStateType] = sStateValue;
            return;
        };

        SamplerStateBlockInstruction.prototype.setTexture = function (pTexture) {
            this._pTexture = pTexture;
        };

        SamplerStateBlockInstruction.prototype.getTexture = function () {
            return this._pTexture;
        };

        SamplerStateBlockInstruction.prototype.isConst = function () {
            return true;
        };

        SamplerStateBlockInstruction.prototype.evaluate = function () {
            var pSamplerState = {
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
        };

        SamplerStateBlockInstruction.convertWrapMode = function (sState) {
            switch (sState) {
                case "WRAP":
                    return 10497 /* REPEAT */;
                case "CLAMP":
                    return 33071 /* CLAMP_TO_EDGE */;
                case "MIRROR":
                    return 33648 /* MIRRORED_REPEAT */;

                default:
                    return 0;
            }
        };

        SamplerStateBlockInstruction.convertFilters = function (sState) {
            switch (sState) {
                case "NEAREST":
                    return 9728 /* NEAREST */;
                case "LINEAR":
                    return 9729 /* LINEAR */;
                case "NEAREST_MIPMAP_NEAREST":
                    return 9984 /* NEAREST_MIPMAP_NEAREST */;
                case "LINEAR_MIPMAP_NEAREST":
                    return 9985 /* LINEAR_MIPMAP_NEAREST */;
                case "NEAREST_MIPMAP_LINEAR":
                    return 9986 /* NEAREST_MIPMAP_LINEAR */;
                case "LINEAR_MIPMAP_LINEAR":
                    return 9987 /* LINEAR_MIPMAP_LINEAR */;

                default:
                    return 0;
            }
        };
        return SamplerStateBlockInstruction;
    })(ExprInstruction);

    
    return SamplerStateBlockInstruction;
});
//# sourceMappingURL=SamplerStateBlockInstruction.js.map
