/// <reference path="../idl/IAFXAttributeBlendContainer.ts" />
/// <reference path="../pool/resources/SurfaceMaterial.ts" />
var akra;
(function (akra) {
    (function (fx) {
        var SurfaceMaterial = akra.pool.resources.SurfaceMaterial;

        var TexcoordSwapper = (function () {
            function TexcoordSwapper() {
                this._pTmpToTex = null;
                this._pTexToTmp = null;
                this._pTexcoords = null;
                this._sTmpToTexCode = "";
                this._sTexToTmpCode = "";
                this._iMaxTexcoords = 0;
                this._iMaxTexcoords = SurfaceMaterial.MAX_TEXTURES_PER_SURFACE;
                this._pTmpToTex = new Array(this._iMaxTexcoords);
                this._pTexToTmp = new Array(this._iMaxTexcoords);
                this._pTexcoords = new Array(this._iMaxTexcoords);
            }
            TexcoordSwapper.prototype.getTmpDeclCode = function () {
                return this._sTexToTmpCode;
            };

            TexcoordSwapper.prototype.getTecoordSwapCode = function () {
                return this._sTmpToTexCode;
            };

            TexcoordSwapper.prototype.clear = function () {
                for (var i = 0; i < this._iMaxTexcoords; i++) {
                    this._pTmpToTex[i] = "";
                    this._pTexToTmp[i] = "";
                    this._pTexcoords[i] = 0;
                }

                this._sTmpToTexCode = "";
                this._sTexToTmpCode = "";
            };

            TexcoordSwapper.prototype.generateSwapCode = function (pMaterial, pAttrConatiner) {
                this.clear();

                if (akra.isNull(pMaterial)) {
                    return;
                }

                //TODO: do it faster in one for
                var pTexcoords = this._pTexcoords;

                for (var i = 0; i < this._iMaxTexcoords; i++) {
                    var iTexcoord = pMaterial.texcoord(i);

                    if (iTexcoord !== i && pAttrConatiner.hasTexcoord(i)) {
                        var pAttr = pAttrConatiner.getTexcoordVar(i);

                        this._pTexToTmp[i] = pAttr.getType().getBaseType().getRealName() + " " + "T" + i.toString() + "=" + pAttr.getRealName() + ";";

                        this._sTexToTmpCode += this._pTexToTmp[i] + "\n";
                    }

                    if (!pAttrConatiner.hasTexcoord(iTexcoord)) {
                        pTexcoords[iTexcoord] = 0;
                    } else {
                        pTexcoords[iTexcoord] = iTexcoord;
                    }
                }

                for (var i = 0; i < this._iMaxTexcoords; i++) {
                    if (pTexcoords[i] !== i && pAttrConatiner.hasTexcoord(i)) {
                        var pAttr = pAttrConatiner.getTexcoordVar(i);

                        if (this._pTexToTmp[pTexcoords[i]] !== "") {
                            this._pTmpToTex[i] = pAttr.getRealName() + "=" + this._pTexToTmp[pTexcoords[i]] + ";";
                        } else {
                            this._pTmpToTex[i] = pAttr.getRealName() + "=" + pAttrConatiner.getTexcoordVar(pTexcoords[i]).getRealName() + ";";
                        }

                        this._sTmpToTexCode += this._pTmpToTex[i] + "\n";
                    }
                }
            };
            return TexcoordSwapper;
        })();
        fx.TexcoordSwapper = TexcoordSwapper;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=TexcoordSwapper.js.map
