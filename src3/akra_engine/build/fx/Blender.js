/// <reference path="../idl/AIAFXBlender.ts" />
/// <reference path="../idl/AIAFXInstruction.ts" />
define(["require", "exports", "util/HashTree", "debug", "logger", "fx/ComponentBlend", "fx/PassBlend"], function(require, exports, __HashTree__, __debug__, __logger__, __ComponentBlend__, __PassBlend__) {
    var HashTree = __HashTree__;
    var debug = __debug__;
    var logger = __logger__;
    var ComponentBlend = __ComponentBlend__;
    var PassBlend = __PassBlend__;

    
    var DEFAULT_SHIFT = fx.DEFAULT_SHIFT;
    var ALL_PASSES = fx.ALL_PASSES;

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

            this._pPassBlendHashTree = new HashTree();
        }
        Blender.prototype.addComponentToBlend = function (pComponentBlend, pComponent, iShift, iPass) {
            if (!isNull(pComponentBlend) && pComponentBlend.containComponent(pComponent, iShift, iPass)) {
                debug.warn("You try to add already used component '" + pComponent.findResourceName() + "' in blend.");
                return pComponentBlend;
            }

            if (iShift === DEFAULT_SHIFT) {
                if (pComponent.isPostEffect()) {
                    iShift = pComponentBlend.getTotalPasses();
                } else {
                    iShift = 0;
                }
            }

            var sBlendPartHash = isDefAndNotNull(pComponentBlend) ? pComponentBlend.getGuid().toString() : "";
            var sComponentPartHash = pComponent.getHash(iShift, iPass);
            var sShortHash = sBlendPartHash + "+" + sComponentPartHash;

            if (isDef(this._pBlendWithComponentMap[sShortHash])) {
                return this._pBlendWithComponentMap[sShortHash];
            }

            var pNewBlend = null;

            if (isNull(pComponentBlend)) {
                pNewBlend = new ComponentBlend(this._pComposer);
            } else {
                pNewBlend = pComponentBlend.clone();
            }

            var pTechnique = pComponent.getTechnique();
            var pTechComponentList = pTechnique.getFullComponentList();
            var pTechComponentShiftList = pTechnique.getFullComponentShiftList();

            if (iPass === ALL_PASSES) {
                if (!isNull(pTechComponentList)) {
                    for (var i = 0; i < pTechComponentList.length; i++) {
                        pNewBlend.addComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift, ALL_PASSES);
                    }
                }

                pNewBlend.addComponent(pComponent, iShift, ALL_PASSES);
            } else {
                if (!isNull(pTechComponentList)) {
                    for (var i = 0; i < pTechComponentList.length; i++) {
                        pNewBlend.addComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift, iPass - pTechComponentShiftList[i]);
                    }
                }

                pNewBlend.addComponent(pComponent, iShift, iPass);
            }

            this._pBlendWithComponentMap[sShortHash] = pNewBlend;

            var sNewBlendHash = pNewBlend.getHash();

            if (isDef(this._pComponentBlendByHashMap[sNewBlendHash])) {
                return this._pComponentBlendByHashMap[sNewBlendHash];
            } else {
                this._pComponentBlendByHashMap[sNewBlendHash] = pNewBlend;
            }

            return pNewBlend;
        };

        Blender.prototype.removeComponentFromBlend = function (pComponentBlend, pComponent, iShift, iPass) {
            if (isNull(pComponentBlend)) {
                logger.warn("You try to remove component '" + pComponent.getName() + "' with shift " + iShift.toString() + " from empty blend.");
                return null;
            }

            var pComponentInfo = pComponentBlend.findAddedComponentInfo(pComponent, iShift, iPass);
            if (isNull(pComponentInfo)) {
                logger.warn("You try to remove component '" + pComponent.getName() + "' with shift " + iShift.toString() + " from blend that not contain it.");
                return null;
            }

            if (iShift === DEFAULT_SHIFT) {
                if (pComponent.isPostEffect()) {
                    iShift = pComponentInfo.shift;
                } else {
                    iShift = 0;
                }
            }

            var sBlendPartHash = isDefAndNotNull(pComponentBlend) ? pComponentBlend.getGuid().toString() : "";
            var sComponentPartHash = pComponent.getHash(iShift, iPass);
            var sShortHash = sBlendPartHash + "-" + sComponentPartHash;

            if (isDef(this._pBlendWithComponentMap[sShortHash])) {
                return this._pBlendWithComponentMap[sShortHash];
            }

            var pNewBlend = pComponentBlend.clone();

            var pTechnique = pComponent.getTechnique();
            var pTechComponentList = pTechnique.getFullComponentList();
            var pTechComponentShiftList = pTechnique.getFullComponentShiftList();

            if (iPass === ALL_PASSES) {
                if (!isNull(pTechComponentList)) {
                    for (var i = 0; i < pTechComponentList.length; i++) {
                        pNewBlend.removeComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift, ALL_PASSES);
                    }
                }

                pNewBlend.removeComponent(pComponent, iShift, ALL_PASSES);
            } else {
                if (!isNull(pTechComponentList)) {
                    for (var i = 0; i < pTechComponentList.length; i++) {
                        pNewBlend.removeComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift, iPass - pTechComponentShiftList[i]);
                    }
                }

                pNewBlend.removeComponent(pComponent, iShift, iPass);
            }

            this._pBlendWithComponentMap[sShortHash] = pNewBlend;

            var sNewBlendHash = pNewBlend.getHash();

            if (isDef(this._pComponentBlendByHashMap[sNewBlendHash])) {
                return this._pComponentBlendByHashMap[sNewBlendHash];
            } else {
                this._pComponentBlendByHashMap[sNewBlendHash] = pNewBlend;
            }

            return pNewBlend;
        };

        Blender.prototype.addBlendToBlend = function (pComponentBlend, pAddBlend, iShift) {
            if (isNull(pComponentBlend)) {
                return pAddBlend;
            }

            if (isNull(pAddBlend)) {
                return pComponentBlend;
            }

            var sShortHash = pComponentBlend.getGuid().toString() + "+" + pAddBlend.getGuid().toString();
            if (isDef(this._pBlendWithBlendMap[sShortHash])) {
                return this._pBlendWithBlendMap[sShortHash];
            }

            var pNewBlend = pComponentBlend.clone();

            var pAddComponentInfoList = pAddBlend._getComponentInfoList();

            for (var i = 0; i < pAddComponentInfoList.length; i++) {
                pNewBlend.addComponent(pAddComponentInfoList[i].component, pAddComponentInfoList[i].shift + iShift, pAddComponentInfoList[i].pass);
            }

            this._pBlendWithBlendMap[sShortHash] = pNewBlend;

            var sNewBlendHash = pNewBlend.getHash();

            if (isDef(this._pComponentBlendByHashMap[sNewBlendHash])) {
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

                this._pPassBlendHashTree.has(isNull(pVertexShader) ? 0 : pVertexShader.getGuid());
                this._pPassBlendHashTree.has(isNull(pPixelShader) ? 0 : pPixelShader.getGuid());
            }

            var pBlend = this._pPassBlendHashTree.getContent();
            if (!pBlend) {
                var pNewPassBlend = new PassBlend(this._pComposer);
                var isOk = pNewPassBlend.initFromPassList(pPassList);

                if (!isOk) {
                    return null;
                }

                this._pPassBlendHashTree.addContent(pNewPassBlend);
                this._pPassBlendByIdMap[pNewPassBlend.getGuid()] = pNewPassBlend;
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

    
    return Blender;
});
//# sourceMappingURL=Blender.js.map
