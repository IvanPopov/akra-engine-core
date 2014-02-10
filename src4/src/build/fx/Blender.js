/// <reference path="../idl/IAFXBlender.ts" />
/// <reference path="../idl/IAFXInstruction.ts" />
var akra;
(function (akra) {
    /// <reference path="../logger.ts" />
    /// <reference path="../debug.ts" />
    /// <reference path="ComponentBlend.ts" />
    /// <reference path="PassBlend.ts" />
    /// <reference path="HashTree.ts" />
    /// <reference path="fx.ts" />
    (function (fx) {
        var Blender = (function () {
            function Blender(pComposer) {
                this._pComposer = null;
                this._pComponentBlendByHashMap = null;
                this._pBlendWithComponentMap = null;
                this._pBlendWithBlendMap = null;
                this._pPassBlendByHashMap = null;
                this._pPassBlendByIdMap = null;
                this._pPassBlendHashTree = null;
                this._pComposer = pComposer;

                this._pComponentBlendByHashMap = {};

                this._pBlendWithComponentMap = {};
                this._pBlendWithBlendMap = {};

                this._pPassBlendByHashMap = {};
                this._pPassBlendByIdMap = {};

                this._pPassBlendHashTree = new akra.fx.HashTree();
            }
            Blender.prototype.addComponentToBlend = function (pComponentBlend, pComponent, iShift, iPass) {
                if (!akra.isNull(pComponentBlend) && pComponentBlend.containComponent(pComponent, iShift, iPass)) {
                    akra.debug.warn("You try to add already used component '" + pComponent.findResourceName() + "' in blend.");
                    return pComponentBlend;
                }

                if (iShift === akra.fx.DEFAULT_SHIFT) {
                    if (pComponent.isPostEffect()) {
                        iShift = pComponentBlend.getTotalPasses();
                    } else {
                        iShift = 0;
                    }
                }

                var sBlendPartHash = akra.isDefAndNotNull(pComponentBlend) ? pComponentBlend.guid.toString() : "";
                var sComponentPartHash = pComponent.getHash(iShift, iPass);
                var sShortHash = sBlendPartHash + "+" + sComponentPartHash;

                if (akra.isDef(this._pBlendWithComponentMap[sShortHash])) {
                    return this._pBlendWithComponentMap[sShortHash];
                }

                var pNewBlend = null;

                if (akra.isNull(pComponentBlend)) {
                    pNewBlend = new akra.fx.ComponentBlend(this._pComposer);
                } else {
                    pNewBlend = pComponentBlend.clone();
                }

                var pTechnique = pComponent.getTechnique();
                var pTechComponentList = pTechnique.getFullComponentList();
                var pTechComponentShiftList = pTechnique.getFullComponentShiftList();

                if (iPass === akra.fx.ALL_PASSES) {
                    if (!akra.isNull(pTechComponentList)) {
                        for (var i = 0; i < pTechComponentList.length; i++) {
                            pNewBlend.addComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift, akra.fx.ALL_PASSES);
                        }
                    }

                    pNewBlend.addComponent(pComponent, iShift, akra.fx.ALL_PASSES);
                } else {
                    if (!akra.isNull(pTechComponentList)) {
                        for (var i = 0; i < pTechComponentList.length; i++) {
                            pNewBlend.addComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift, iPass - pTechComponentShiftList[i]);
                        }
                    }

                    pNewBlend.addComponent(pComponent, iShift, iPass);
                }

                this._pBlendWithComponentMap[sShortHash] = pNewBlend;

                var sNewBlendHash = pNewBlend.getHash();

                if (akra.isDef(this._pComponentBlendByHashMap[sNewBlendHash])) {
                    return this._pComponentBlendByHashMap[sNewBlendHash];
                } else {
                    this._pComponentBlendByHashMap[sNewBlendHash] = pNewBlend;
                }

                return pNewBlend;
            };

            Blender.prototype.removeComponentFromBlend = function (pComponentBlend, pComponent, iShift, iPass) {
                if (akra.isNull(pComponentBlend)) {
                    akra.logger.warn("You try to remove component '" + pComponent.getName() + "' with shift " + iShift.toString() + " from empty blend.");
                    return null;
                }

                var pComponentInfo = pComponentBlend.findAddedComponentInfo(pComponent, iShift, iPass);
                if (akra.isNull(pComponentInfo)) {
                    akra.logger.warn("You try to remove component '" + pComponent.getName() + "' with shift " + iShift.toString() + " from blend that not contain it.");
                    return null;
                }

                if (iShift === akra.fx.DEFAULT_SHIFT) {
                    if (pComponent.isPostEffect()) {
                        iShift = pComponentInfo.shift;
                    } else {
                        iShift = 0;
                    }
                }

                var sBlendPartHash = akra.isDefAndNotNull(pComponentBlend) ? pComponentBlend.guid.toString() : "";
                var sComponentPartHash = pComponent.getHash(iShift, iPass);
                var sShortHash = sBlendPartHash + "-" + sComponentPartHash;

                if (akra.isDef(this._pBlendWithComponentMap[sShortHash])) {
                    return this._pBlendWithComponentMap[sShortHash];
                }

                var pNewBlend = pComponentBlend.clone();

                var pTechnique = pComponent.getTechnique();
                var pTechComponentList = pTechnique.getFullComponentList();
                var pTechComponentShiftList = pTechnique.getFullComponentShiftList();

                if (iPass === akra.fx.ALL_PASSES) {
                    if (!akra.isNull(pTechComponentList)) {
                        for (var i = 0; i < pTechComponentList.length; i++) {
                            pNewBlend.removeComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift, akra.fx.ALL_PASSES);
                        }
                    }

                    pNewBlend.removeComponent(pComponent, iShift, akra.fx.ALL_PASSES);
                } else {
                    if (!akra.isNull(pTechComponentList)) {
                        for (var i = 0; i < pTechComponentList.length; i++) {
                            pNewBlend.removeComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift, iPass - pTechComponentShiftList[i]);
                        }
                    }

                    pNewBlend.removeComponent(pComponent, iShift, iPass);
                }

                this._pBlendWithComponentMap[sShortHash] = pNewBlend;

                var sNewBlendHash = pNewBlend.getHash();

                if (akra.isDef(this._pComponentBlendByHashMap[sNewBlendHash])) {
                    return this._pComponentBlendByHashMap[sNewBlendHash];
                } else {
                    this._pComponentBlendByHashMap[sNewBlendHash] = pNewBlend;
                }

                return pNewBlend;
            };

            Blender.prototype.addBlendToBlend = function (pComponentBlend, pAddBlend, iShift) {
                //TODO: ADD CORRECT BLENDING FOR POSTEFFECTS
                if (akra.isNull(pComponentBlend)) {
                    return pAddBlend;
                }

                if (akra.isNull(pAddBlend)) {
                    return pComponentBlend;
                }

                var sShortHash = pComponentBlend.guid.toString() + "+" + pAddBlend.guid.toString();
                if (akra.isDef(this._pBlendWithBlendMap[sShortHash])) {
                    return this._pBlendWithBlendMap[sShortHash];
                }

                var pNewBlend = pComponentBlend.clone();

                var pAddComponentInfoList = pAddBlend._getComponentInfoList();

                for (var i = 0; i < pAddComponentInfoList.length; i++) {
                    pNewBlend.addComponent(pAddComponentInfoList[i].component, pAddComponentInfoList[i].shift + iShift, pAddComponentInfoList[i].pass);
                }

                this._pBlendWithBlendMap[sShortHash] = pNewBlend;

                var sNewBlendHash = pNewBlend.getHash();

                if (akra.isDef(this._pComponentBlendByHashMap[sNewBlendHash])) {
                    return this._pComponentBlendByHashMap[sNewBlendHash];
                } else {
                    this._pComponentBlendByHashMap[sNewBlendHash] = pNewBlend;
                }

                return pNewBlend;
            };

            Blender.prototype.generatePassBlend = function (pPassList, pStates, pForeigns, pUniforms) {
                this._pPassBlendHashTree.release();

                for (var i = 0; i < pPassList.length; i++) {
                    var pPass = pPassList[i];

                    pPass.evaluate(pStates, pForeigns, pUniforms);

                    var pVertexShader = pPass.getVertexShader();
                    var pPixelShader = pPass.getPixelShader();

                    this._pPassBlendHashTree.has(akra.isNull(pVertexShader) ? 0 : pVertexShader._getInstructionID());
                    this._pPassBlendHashTree.has(akra.isNull(pPixelShader) ? 0 : pPixelShader._getInstructionID());
                }

                var pBlend = this._pPassBlendHashTree.getContent();

                if (!pBlend) {
                    var pNewPassBlend = new akra.fx.PassBlend(this._pComposer);
                    var isOk = pNewPassBlend.initFromPassList(pPassList);

                    if (!isOk) {
                        return null;
                    }

                    this._pPassBlendHashTree.addContent(pNewPassBlend);
                    this._pPassBlendByIdMap[pNewPassBlend.guid] = pNewPassBlend;
                    return pNewPassBlend;
                } else {
                    return pBlend;
                }
            };

            Blender.prototype.getPassBlendById = function (id) {
                return this._pPassBlendByIdMap[id] || null;
            };
            return Blender;
        })();
        fx.Blender = Blender;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=Blender.js.map
