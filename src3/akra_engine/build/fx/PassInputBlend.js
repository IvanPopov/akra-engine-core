/// <reference path="../idl/AIAFXPassInputBlend.ts" />
/// <reference path="../idl/AIAFXVariableContainer.ts" />
/// <reference path="../idl/AIMap.ts" />
define(["require", "exports", "math/Vec4", "render"], function(require, exports, __Vec4__, __render__) {
    var Vec4 = __Vec4__;

    var render = __render__;

    var PassInputBlend = (function () {
        function PassInputBlend(pCreator) {
            //UNIQUE()
            this._pCreator = null;
            // private _bNeedToCalcBlend: boolean = true;
            // private _bNeedToCalcShader: boolean = true;
            this._iLastPassBlendId = 0;
            this._iLastShaderId = 0;
            this._pMaterialContainer = {
                "DIFFUSE": new Vec4(),
                "AMBIENT": new Vec4(),
                "SPECULAR": new Vec4(),
                "EMISSIVE": new Vec4(),
                "SHININESS": 1.
            };
            //need for accelerate setSurfaceMaterial
            this._nLastSufraceMaterialTextureUpdates = 0;
            this._nLastSamplerUpdates = 0;
            this._pLastSurfaceMaterial = null;
            this._isFirstSetSurfaceNaterial = true;
            this._pMaterialNameIndices = {
                diffuse: 0,
                ambient: 0,
                specular: 0,
                emissive: 0,
                normal: 0,
                material: 0,
                textures: new Array(16)
            };
            this._pStatesInfo = null;
            this.samplers = null;
            this.samplerArrays = null;
            this.samplerArrayLength = null;
            this.uniforms = null;
            this.foreigns = null;
            this.textures = null;
            this.samplerKeys = null;
            this.samplerArrayKeys = null;
            this.uniformKeys = null;
            this.foreignKeys = null;
            this.textureKeys = null;
            this.renderStates = null;
            this._pCreator = pCreator;

            this._pStatesInfo = {
                uniformKey: 0,
                foreignKey: 0,
                samplerKey: 0,
                renderStatesKey: 0
            };

            this.init();
        }
        Object.defineProperty(PassInputBlend.prototype, "statesInfo", {
            get: function () {
                return this._pStatesInfo;
            },
            enumerable: true,
            configurable: true
        });

        PassInputBlend.prototype.hasUniform = function (sName) {
            return this._pCreator.uniforms.hasVariableWithRealName(sName);
        };

        PassInputBlend.prototype.hasTexture = function (sName) {
            return this._pCreator.textures.hasVariableWithRealName(sName);
        };

        PassInputBlend.prototype.hasForeign = function (sName) {
            return this._pCreator.foreigns.hasVariableWithRealName(sName);
        };

        PassInputBlend.prototype.setUniform = function (sName, pValue) {
            var iIndex = this._pCreator.uniforms.getIndexByRealName(sName);

            if (iIndex === 0) {
                return;
            }

            var pInfo = this._pCreator.uniforms.getVarInfoByIndex(iIndex);

            if (pInfo.type === 18 /* k_Sampler2D */ || pInfo.type === 19 /* k_SamplerCUBE */) {
                if (pInfo.isArray) {
                    if (isNull(pValue)) {
                        this.samplerArrayLength[iIndex] = 0;
                    } else {
                        for (var i = 0; i < pValue.length; i++) {
                            this.copySamplerState(pValue[i], this.samplerArrays[iIndex][i]);
                        }

                        this.samplerArrayLength[iIndex] = pValue.length;
                    }
                } else {
                    this.copySamplerState(pValue, this.samplers[iIndex]);
                }

                return;
            }

            //Check type
            this._pStatesInfo.uniformKey++;
            this.uniforms[iIndex] = pValue;
        };

        PassInputBlend.prototype.setTexture = function (sName, pValue) {
            var iIndex = this._pCreator.textures.getIndexByRealName(sName);

            if (iIndex === 0) {
                return;
            }

            if (this.textures[iIndex] !== pValue) {
                this._pStatesInfo.samplerKey++;
            }

            this.textures[iIndex] = pValue;
        };

        PassInputBlend.prototype.setForeign = function (sName, pValue) {
            var iIndex = this._pCreator.foreigns.getIndexByRealName(sName);

            if (iIndex === 0) {
                return;
            }

            //Check type
            var pOldValue = this.foreigns[iIndex];

            if (pOldValue !== pValue) {
                // this._bNeedToCalcBlend = true;
                // this._bNeedToCalcShader = true;
                this._pStatesInfo.foreignKey++;
            }

            this.foreigns[iIndex] = pValue;
        };

        PassInputBlend.prototype.setSampler = function (sName, pValue) {
            var iIndex = this._pCreator.uniforms.getIndexByRealName(sName);

            if (iIndex === 0) {
                return;
            }

            var eType = this._pCreator.uniforms.getTypeByIndex(iIndex);

            if (eType !== 18 /* k_Sampler2D */ && eType !== 19 /* k_SamplerCUBE */) {
                return;
            }

            this.copySamplerState(pValue, this.samplers[iIndex]);
        };

        PassInputBlend.prototype.setSamplerArray = function (sName, pValue) {
            var iIndex = this._pCreator.uniforms.getIndexByRealName(sName);

            if (iIndex === 0) {
                return;
            }

            var eType = this._pCreator.uniforms.getTypeByIndex(iIndex);

            if (eType !== 18 /* k_Sampler2D */ && eType !== 19 /* k_SamplerCUBE */) {
                return;
            }

            if (!isNull(pValue)) {
                for (var i = 0; i < pValue.length; i++) {
                    this.copySamplerState(pValue[i], this.samplerArrays[iIndex][i]);
                }

                this.samplerArrayLength[iIndex] = pValue.length;
            } else {
                this.samplerArrayLength[iIndex] = 0;
            }
        };

        PassInputBlend.prototype.setSamplerTexture = function (sName, pTexture) {
            var iIndex = this._pCreator.uniforms.getIndexByRealName(sName);

            if (iIndex === 0) {
                return;
            }

            var eType = this._pCreator.uniforms.getTypeByIndex(iIndex);

            if (eType !== 18 /* k_Sampler2D */ && eType !== 19 /* k_SamplerCUBE */) {
                return;
            }
            var pState = this.samplers[iIndex];

            if (isString(pTexture)) {
                if (!isNull(pState.texture) || pState.textureName !== pTexture) {
                    this._pStatesInfo.samplerKey++;
                }

                pState.textureName = pTexture;
                pState.texture = null;
            } else {
                if (pState.texture !== pTexture) {
                    this._pStatesInfo.samplerKey++;
                }

                pState.texture = pTexture;
            }
        };

        PassInputBlend.prototype._setSamplerTextureObject = function (sName, pTexture) {
            var iIndex = this._pCreator.uniforms.getIndexByRealName(sName);

            if (iIndex === 0) {
                return;
            }

            var eType = this._pCreator.uniforms.getTypeByIndex(iIndex);

            if (eType !== 18 /* k_Sampler2D */ && eType !== 19 /* k_SamplerCUBE */) {
                return;
            }

            var pState = this.samplers[iIndex];

            if (pState.texture !== pTexture) {
                this._pStatesInfo.samplerKey++;
            }

            pState.texture = pTexture;
        };

        PassInputBlend.prototype.setStruct = function (sName, pValue) {
            this.setUniform(sName, pValue);
        };

        PassInputBlend.prototype.setSurfaceMaterial = function (pSurfaceMaterial) {
            if (isNull(pSurfaceMaterial)) {
                return;
            }

            if (this._isFirstSetSurfaceNaterial) {
                for (var i = 0; i < 16; i++) {
                    if (this.hasTexture("TEXTURE" + i.toString())) {
                        this._pMaterialNameIndices.textures[i] = this._pCreator.textures.getIndexByRealName("TEXTURE" + i.toString());
                    } else {
                        this._pMaterialNameIndices.textures[i] = 0;
                    }
                }

                this._pMaterialNameIndices.material = this.hasUniform("MATERIAL") ? this._pCreator.uniforms.getIndexByRealName("MATERIAL") : 0;

                this._pMaterialNameIndices.diffuse = this.hasUniform("S_DIFFUSE") ? this._pCreator.uniforms.getIndexByRealName("S_DIFFUSE") : 0;
                this._pMaterialNameIndices.ambient = this.hasUniform("S_AMBIENT") ? this._pCreator.uniforms.getIndexByRealName("S_AMBIENT") : 0;
                this._pMaterialNameIndices.specular = this.hasUniform("S_SPECULAR") ? this._pCreator.uniforms.getIndexByRealName("S_SPECULAR") : 0;
                this._pMaterialNameIndices.emissive = this.hasUniform("S_EMISSIVE") ? this._pCreator.uniforms.getIndexByRealName("S_EMISSIVE") : 0;
                this._pMaterialNameIndices.normal = this.hasUniform("S_NORMAL") ? this._pCreator.uniforms.getIndexByRealName("S_NORMAL") : 0;

                this._isFirstSetSurfaceNaterial = false;
            }

            if (this._nLastSamplerUpdates !== this._pStatesInfo.samplerKey || this._pLastSurfaceMaterial !== pSurfaceMaterial || this._nLastSufraceMaterialTextureUpdates !== pSurfaceMaterial.totalUpdatesOfTextures) {
                var iTotalTextures = pSurfaceMaterial.totalTextures;
                for (var i = 0; i < 16; i++) {
                    if (this._pMaterialNameIndices.textures[i] > 0) {
                        this.textures[this._pMaterialNameIndices.textures[i]] = pSurfaceMaterial.texture(i) || null;
                    }
                }
            }

            if (this._pMaterialNameIndices.material > 0) {
                var pMaterial = pSurfaceMaterial.material;
                var pMatContainer = this._pMaterialContainer;

                pMatContainer.DIFFUSE.set(pMaterial.diffuse.r, pMaterial.diffuse.g, pMaterial.diffuse.b, pMaterial.diffuse.a);
                pMatContainer.AMBIENT.set(pMaterial.ambient.r, pMaterial.ambient.g, pMaterial.ambient.b, pMaterial.ambient.a);
                pMatContainer.SPECULAR.set(pMaterial.specular.r, pMaterial.specular.g, pMaterial.specular.b, pMaterial.specular.a);
                pMatContainer.EMISSIVE.set(pMaterial.emissive.r, pMaterial.emissive.g, pMaterial.emissive.b, pMaterial.emissive.a);
                pMatContainer.SHININESS = pMaterial.shininess;

                this.uniforms[this._pMaterialNameIndices.material] = pMatContainer;
            }

            // if (this._nLastSamplerUpdates !== this._pStatesInfo.samplerKey){
            this._setSamplerTextureObjectByIndex(this._pMaterialNameIndices.diffuse, pSurfaceMaterial.texture(0 /* DIFFUSE */) || null);
            this._setSamplerTextureObjectByIndex(this._pMaterialNameIndices.ambient, pSurfaceMaterial.texture(1 /* AMBIENT */) || null);
            this._setSamplerTextureObjectByIndex(this._pMaterialNameIndices.specular, pSurfaceMaterial.texture(2 /* SPECULAR */) || null);
            this._setSamplerTextureObjectByIndex(this._pMaterialNameIndices.emissive, pSurfaceMaterial.texture(3 /* EMISSIVE */) || null);
            this._setSamplerTextureObjectByIndex(this._pMaterialNameIndices.normal, pSurfaceMaterial.texture(4 /* NORMAL */) || null);

            // }
            this._pLastSurfaceMaterial = pSurfaceMaterial;
            this._nLastSufraceMaterialTextureUpdates = pSurfaceMaterial.totalUpdatesOfTextures;
            this._nLastSamplerUpdates = this._pStatesInfo.samplerKey;
        };

        PassInputBlend.prototype.setRenderState = function (eState, eValue) {
            if (this.renderStates[eState] !== eValue) {
                this._pStatesInfo.renderStatesKey++;
            }

            this.renderStates[eState] = eValue;
        };

        PassInputBlend.prototype._getForeignVarNameIndex = function (sName) {
            return this._pCreator.foreigns.getIndexByRealName(sName);
        };

        PassInputBlend.prototype._getForeignVarNameByIndex = function (iNameIndex) {
            return this._pCreator.foreigns.getVarInfoByIndex(iNameIndex).realName;
        };

        PassInputBlend.prototype._getUniformVarNameIndex = function (sName) {
            return this._pCreator.uniforms.getIndexByRealName(sName);
        };

        PassInputBlend.prototype._getUniformVar = function (iNameIndex) {
            return this._pCreator.uniforms.getVarByIndex(iNameIndex);
        };

        PassInputBlend.prototype._getUniformVarNameByIndex = function (iNameIndex) {
            return this._pCreator.uniforms.getVarInfoByIndex(iNameIndex).realName;
        };

        PassInputBlend.prototype._getUniformLength = function (iNameIndex) {
            return this._pCreator.uniforms.getVarByIndex(iNameIndex).getType().getLength();
        };

        PassInputBlend.prototype._getUniformType = function (iNameIndex) {
            return this._pCreator.uniforms.getTypeByIndex(iNameIndex);
        };

        PassInputBlend.prototype._getSamplerState = function (iNameIndex) {
            return this.samplers[iNameIndex];
        };

        PassInputBlend.prototype._getSamplerTexture = function (iNameIndex) {
            return this._getTextureForSamplerState(this._getSamplerState(iNameIndex));
        };

        PassInputBlend.prototype._getTextureForSamplerState = function (pSamplerState) {
            var pTexture = null;

            if (!isNull(pSamplerState.texture)) {
                pTexture = pSamplerState.texture;
            } else if (pSamplerState.textureName !== "") {
                if (this.hasTexture(pSamplerState.textureName)) {
                    pTexture = this.textures[this._pCreator.textures.getIndexByRealName(pSamplerState.textureName)];
                }
            }

            return pTexture;
        };

        PassInputBlend.prototype._release = function () {
            for (var i = 0; i < this.uniformKeys.length; i++) {
                var pInfo = this._pCreator.uniforms.getVarInfoByIndex(this.uniformKeys[i]);
                var pDefaultValue = pInfo.variable.getDefaultValue();

                this.uniforms[this.uniformKeys[i]] = pDefaultValue;
            }

            for (var i = 0; i < this.foreignKeys.length; i++) {
                this.foreigns[this.foreignKeys[i]] = null;
            }

            for (var i = 0; i < this.textureKeys.length; i++) {
                this.textures[this.textureKeys[i]] = null;
            }

            for (var i = 0; i < this.samplerKeys.length; i++) {
                var pInfo = this._pCreator.uniforms.getVarInfoByIndex(this.samplerKeys[i]);
                var pDefaultState = pInfo.variable.getDefaultValue();
                var pSamplerState = this.samplers[this.samplerKeys[i]];

                this.clearSamplerState(pSamplerState);

                if (!isNull(pDefaultState)) {
                    pSamplerState.textureName = pDefaultState.textureName;
                    pSamplerState.wrap_s = pDefaultState.wrap_s || pSamplerState.wrap_s;
                    pSamplerState.wrap_t = pDefaultState.wrap_t || pSamplerState.wrap_t;
                    pSamplerState.mag_filter = pDefaultState.mag_filter || pSamplerState.mag_filter;
                    pSamplerState.min_filter = pDefaultState.min_filter || pSamplerState.min_filter;
                }
            }

            for (var i = 0; i < this.samplerArrayKeys.length; i++) {
                var pInfo = this._pCreator.uniforms.getVarInfoByIndex(this.samplerArrayKeys[i]);
                var pDefaultStateList = pInfo.variable.getDefaultValue();
                var pStateList = this.samplerArrays[this.samplerArrayKeys[i]];

                for (var j = 0; j < pStateList.length; j++) {
                    this.clearSamplerState(pStateList[j]);

                    if (!isNull(pDefaultStateList) && i < pDefaultStateList.length) {
                        pStateList[j].textureName = pDefaultStateList[j].textureName;
                        pStateList[j].wrap_s = pDefaultStateList[j].wrap_s || pStateList[j].wrap_s;
                        pStateList[j].wrap_t = pDefaultStateList[j].wrap_t || pStateList[j].wrap_t;
                        pStateList[j].mag_filter = pDefaultStateList[j].mag_filter || pStateList[j].mag_filter;
                        pStateList[j].min_filter = pDefaultStateList[j].min_filter || pStateList[j].min_filter;
                    }
                }

                this.samplerArrayLength[this.samplerArrayKeys[i]] = !isNull(pDefaultStateList) ? pDefaultStateList.length : 0;
            }

            render.clearRenderStateMap(this.renderStates);

            this._pCreator.releasePassInput(this);
            // this._bNeedToCalcShader = true;
            // this._bNeedToCalcBlend = true;
        };

        PassInputBlend.prototype._isFromSameBlend = function (pInput) {
            return (pInput._getBlend() === this._getBlend());
        };

        PassInputBlend.prototype._getBlend = function () {
            return this._pCreator;
        };

        PassInputBlend.prototype._copyFrom = function (pInput) {
            this._copyUniformsFromInput(pInput);
            this._copyForeignsFromInput(pInput);
            this._copySamplersFromInput(pInput);
            this._copyRenderStatesFromInput(pInput);
        };

        PassInputBlend.prototype._copyUniformsFromInput = function (pInput) {
            for (var i = 0; i < pInput.uniformKeys.length; i++) {
                var iIndex = pInput.uniformKeys[i];

                if (isDef(this.uniforms[iIndex])) {
                    this.uniforms[iIndex] = pInput.uniforms[iIndex];
                }
            }
        };

        PassInputBlend.prototype._copySamplersFromInput = function (pInput) {
            for (var i = 0; i < pInput.textureKeys.length; i++) {
                var iIndex = pInput.textureKeys[i];

                if (isDef(this.textures[iIndex])) {
                    this.textures[iIndex] = pInput.textures[iIndex];
                }
            }

            for (var i = 0; i < pInput.samplerKeys.length; i++) {
                var iIndex = pInput.samplerKeys[i];

                if (isDef(this.samplers[iIndex])) {
                    this.copySamplerState(pInput.samplers[iIndex], this.samplers[iIndex]);
                }
            }

            for (var i = 0; i < pInput.samplerArrayKeys.length; i++) {
                var iIndex = pInput.samplerArrayKeys[i];

                if (isDef(this.samplerArrays[iIndex])) {
                    var pFrom = pInput.samplerArrays[iIndex];
                    var pTo = this.samplerArrays[iIndex];
                    var iLength = pInput.samplerArrayLength[iIndex];

                    for (var j = 0; j < iLength; j++) {
                        this.copySamplerState(pFrom[j], pTo[j]);
                    }

                    this.samplerArrayLength[iIndex] = iLength;
                }
            }
        };

        PassInputBlend.prototype._copyForeignsFromInput = function (pInput) {
            for (var i = 0; i < pInput.foreignKeys.length; i++) {
                var iIndex = pInput.foreignKeys[i];

                if (isDef(this.foreigns[iIndex])) {
                    this.foreigns[iIndex] = pInput.foreigns[iIndex];
                }
            }
        };

        PassInputBlend.prototype._copyRenderStatesFromInput = function (pInput) {
            render.copyRenderStateMap(pInput.renderStates, this.renderStates);
        };

        PassInputBlend.prototype._getLastPassBlendId = function () {
            return this._iLastPassBlendId;
        };

        PassInputBlend.prototype._getLastShaderId = function () {
            return this._iLastShaderId;
        };

        PassInputBlend.prototype._setPassBlendId = function (id) {
            this._iLastPassBlendId = id;
        };

        PassInputBlend.prototype._setShaderId = function (id) {
            this._iLastShaderId = id;
        };

        PassInputBlend.prototype.init = function () {
            this.samplers = {};
            this.samplerArrays = {};
            this.samplerArrayLength = {};

            this.uniforms = {};
            this.foreigns = {};
            this.textures = {};

            this.renderStates = render.createRenderStateMap();

            var pUniformKeys = this._pCreator.uniforms.indices;
            var pForeignKeys = this._pCreator.foreigns.indices;
            var pTextureKeys = this._pCreator.textures.indices;

            var eType = 0;
            var sName = "";
            var iIndex = 0;

            for (var i = 0; i < pUniformKeys.length; i++) {
                var iIndex = pUniformKeys[i];
                var pInfo = this._pCreator.uniforms.getVarInfoByIndex(iIndex);
                var pDefaultValue = pInfo.variable.getDefaultValue();

                if (pInfo.type === 18 /* k_Sampler2D */ || pInfo.type === 19 /* k_SamplerCUBE */) {
                    var hasDefaultValue = !isNull(pDefaultValue);

                    if (pInfo.isArray) {
                        if (hasDefaultValue) {
                            this.samplerArrays[iIndex] = new Array(pDefaultValue.length);
                            this.samplerArrayLength[iIndex] = this.samplerArrays[iIndex].length;
                        } else {
                            this.samplerArrays[iIndex] = new Array(16);
                            this.samplerArrayLength[iIndex] = 0;
                        }

                        for (var j = 0; j < this.samplerArrays[iIndex].length; j++) {
                            var pNewState = render.createSamplerState();

                            if (hasDefaultValue) {
                                var pDefaultState = pDefaultValue[j];
                                pNewState.textureName = pDefaultState.textureName;
                                pNewState.wrap_s = pDefaultState.wrap_s || pNewState.wrap_s;
                                pNewState.wrap_t = pDefaultState.wrap_t || pNewState.wrap_t;
                                pNewState.mag_filter = pDefaultState.mag_filter || pNewState.mag_filter;
                                pNewState.min_filter = pDefaultState.min_filter || pNewState.min_filter;
                            }

                            this.samplerArrays[iIndex][j] = pNewState;
                        }
                    } else {
                        var pNewState = render.createSamplerState();

                        if (hasDefaultValue) {
                            var pDefaultState = pDefaultValue;
                            pNewState.textureName = pDefaultState.textureName;
                            pNewState.wrap_s = pDefaultState.wrap_s || pNewState.wrap_s;
                            pNewState.wrap_t = pDefaultState.wrap_t || pNewState.wrap_t;
                            pNewState.mag_filter = pDefaultState.mag_filter || pNewState.mag_filter;
                            pNewState.min_filter = pDefaultState.min_filter || pNewState.min_filter;
                        }

                        this.samplers[iIndex] = pNewState;
                    }
                } else {
                    this.uniforms[iIndex] = pDefaultValue;
                }
            }

            for (var i = 0; i < pForeignKeys.length; i++) {
                var iIndex = pForeignKeys[i];

                this.foreigns[iIndex] = null;
            }

            for (var i = 0; i < pTextureKeys.length; i++) {
                var iIndex = pTextureKeys[i];
                this.textures[iIndex] = null;
            }

            this.samplerKeys = Object.keys(this.samplers);
            for (var i = 0; i < this.samplerKeys.length; i++) {
                this.samplerKeys[i] = +this.samplerKeys[i];
            }

            this.samplerArrayKeys = Object.keys(this.samplerArrays);
            for (var i = 0; i < this.samplerArrayKeys.length; i++) {
                this.samplerArrayKeys[i] = +this.samplerArrayKeys[i];
            }

            this.uniformKeys = Object.keys(this.uniforms);
            for (var i = 0; i < this.uniformKeys.length; i++) {
                this.uniformKeys[i] = +this.uniformKeys[i];
            }

            this.foreignKeys = Object.keys(this.foreigns);
            for (var i = 0; i < this.foreignKeys.length; i++) {
                this.foreignKeys[i] = +this.foreignKeys[i];
            }

            this.textureKeys = Object.keys(this.textures);
            for (var i = 0; i < this.textureKeys.length; i++) {
                this.textureKeys[i] = +this.textureKeys[i];
            }
        };

        PassInputBlend.prototype.isVarArray = function (pVar) {
            return pVar.getType().isNotBaseArray();
        };

        PassInputBlend.prototype.clearSamplerState = function (pState) {
            pState.textureName = "";
            pState.texture = null;
            pState.wrap_s = 0 /* UNDEF */;
            pState.wrap_t = 0 /* UNDEF */;
            pState.mag_filter = 0 /* UNDEF */;
            pState.min_filter = 0 /* UNDEF */;
            /*pState.wrap_s = AETextureWrapModes.CLAMP_TO_EDGE;
            pState.wrap_t = AETextureWrapModes.CLAMP_TO_EDGE;
            pState.mag_filter = AETextureFilters.LINEAR;
            pState.min_filter = AETextureFilters.LINEAR;*/
        };

        PassInputBlend.prototype._setSamplerTextureObjectByIndex = function (iNameIndex, pTexture) {
            if (iNameIndex === 0) {
                return;
            }

            var pState = this.samplers[iNameIndex];
            if (pState.texture !== pTexture) {
                this._pStatesInfo.samplerKey++;
            }

            pState.texture = pTexture;
        };

        PassInputBlend.prototype.copySamplerState = function (pFrom, pTo) {
            if (pTo.textureName !== pFrom.textureName || pTo.texture !== pFrom.texture) {
                this._pStatesInfo.samplerKey++;
            }

            pTo.textureName = pFrom.textureName;
            pTo.texture = pFrom.texture;

            pTo.wrap_s = pFrom.wrap_s;
            pTo.wrap_t = pFrom.wrap_t;

            pTo.mag_filter = pFrom.mag_filter;
            pTo.min_filter = pFrom.min_filter;
        };
        return PassInputBlend;
    })();

    
    return PassInputBlend;
});
//# sourceMappingURL=PassInputBlend.js.map
