/// <reference path="../idl/IRenderTechnique.ts" />
var akra;
(function (akra) {
    /// <reference path="../guid.ts" />
    /// <reference path="../debug.ts" />
    /// <reference path="../events.ts" />
    /// <reference path="../util/ObjectArray.ts" />
    /// <reference path="RenderPass.ts" />
    /// <reference path="../fx/fx.ts" />
    (function (render) {
        var ALL_PASSES = akra.fx.ALL_PASSES;
        var ANY_PASS = akra.fx.ANY_PASS;
        var ANY_SHIFT = akra.fx.ANY_SHIFT;

        var RenderTechnique = (function () {
            function RenderTechnique(pMethod) {
                if (typeof pMethod === "undefined") { pMethod = null; }
                this.guid = akra.guid();
                this._pMethod = null;
                this._isFreeze = false;
                this._pComposer = null;
                this._pPassList = null;
                this._pPassBlackList = null;
                this._iCurrentPass = 0;
                this._pCurrentPass = null;
                this._iGlobalPostEffectsStart = 0;
                this._iMinShiftOfOwnBlend = 0;
                this._pRenderMethodPassStateList = null;
                this.setupSignals();

                this._pPassList = [];
                this._pPassBlackList = [];

                if (!akra.isNull(pMethod)) {
                    this.setMethod(pMethod);
                }

                this._pRenderMethodPassStateList = new akra.util.ObjectArray();
            }
            RenderTechnique.prototype.setupSignals = function () {
                this.render = this.render || new akra.Signal(this);
            };

            RenderTechnique.prototype.getModified = function () {
                return this.guid;
            };

            RenderTechnique.prototype.getTotalPasses = function () {
                return this._pComposer.getTotalPassesForTechnique(this);
            };

            RenderTechnique.prototype.destroy = function () {
            };

            RenderTechnique.prototype.getPass = function (iPass) {
                this._pComposer.prepareTechniqueBlend(this);
                return this._pPassList[iPass];
            };

            RenderTechnique.prototype.getMethod = function () {
                return this._pMethod;
            };

            RenderTechnique.prototype.setMethod = function (pMethod) {
                if (!akra.isNull(this._pMethod)) {
                    this._pMethod.altered.disconnect(this, this._updateMethod);
                    //this.disconnect(this._pMethod, SIGNAL(altered), SLOT(_updateMethod), EEventTypes.BROADCAST);
                }

                this._pMethod = pMethod;

                if (!akra.isNull(pMethod)) {
                    var pComposer = pMethod.getManager().getEngine().getComposer();
                    this._setComposer(pComposer);
                    pMethod.altered.connect(this, this._updateMethod);
                    //this.connect(pMethod, SIGNAL(altered), SLOT(_updateMethod), EEventTypes.BROADCAST);
                }

                this._updateMethod(pMethod);
            };

            RenderTechnique.prototype.setState = function (sName, pValue) {
            };

            RenderTechnique.prototype.setForeign = function (sName, pValue) {
            };

            RenderTechnique.prototype.setStruct = function (sName, pValue) {
                //skip
            };

            RenderTechnique.prototype.setTextureBySemantics = function (sName, pValue) {
            };

            RenderTechnique.prototype.setShadowSamplerArray = function (sName, pValue) {
            };

            RenderTechnique.prototype.setVec2BySemantic = function (sName, pValue) {
            };

            RenderTechnique.prototype.isReady = function () {
                return this._pMethod.isResourceLoaded() && !this._pMethod.isResourceDisabled();
            };

            RenderTechnique.prototype.addComponent = function (pComponent, iShift, iPass) {
                if (typeof iShift === "undefined") { iShift = 0; }
                if (typeof iPass === "undefined") { iPass = ALL_PASSES; }
                if (akra.isNull(this._pComposer)) {
                    return false;
                }

                var pComponentPool = this._pComposer.getEngine().getResourceManager().getComponentPool();

                if (akra.isInt(pComponent)) {
                    pComponent = pComponentPool.getResource(pComponent);
                } else if (akra.isString(pComponent)) {
                    pComponent = pComponentPool.findResource(pComponent);
                }

                if (!akra.isDef(pComponent) || akra.isNull(pComponent)) {
                    akra.debug.error("Bad component for add.");
                    return false;
                }

                if (!this._pComposer.addOwnComponentToTechnique(this, pComponent, iShift, iPass)) {
                    akra.debug.error("Can not add component '" + pComponent.findResourceName() + "'");
                    return false;
                }

                this._iMinShiftOfOwnBlend = this._pComposer.getMinShiftForOwnTechniqueBlend(this);

                return true;
            };

            RenderTechnique.prototype.delComponent = function (pComponent, iShift, iPass) {
                if (typeof iShift === "undefined") { iShift = 0; }
                if (typeof iPass === "undefined") { iPass = ALL_PASSES; }
                if (akra.isNull(this._pComposer)) {
                    return false;
                }

                var pComponentPool = this._pComposer.getEngine().getResourceManager().getComponentPool();

                if (akra.isInt(pComponent)) {
                    pComponent = pComponentPool.getResource(pComponent);
                } else if (akra.isString(pComponent)) {
                    pComponent = pComponentPool.findResource(pComponent);
                }

                if (!akra.isDef(pComponent) || akra.isNull(pComponent)) {
                    akra.debug.error("Bad component for delete.");
                    return false;
                }

                if (!this._pComposer.removeOwnComponentToTechnique(this, pComponent, iShift, iPass)) {
                    akra.debug.error("Can not delete component '" + pComponent.findResourceName() + "'");
                    return false;
                }

                this._iMinShiftOfOwnBlend = this._pComposer.getMinShiftForOwnTechniqueBlend(this);

                return true;
            };

            RenderTechnique.prototype.hasComponent = function (sComponent, iShift, iPass) {
                if (typeof iShift === "undefined") { iShift = ANY_SHIFT; }
                if (typeof iPass === "undefined") { iPass = ANY_PASS; }
                return this._pMethod.getEffect().hasComponent(sComponent, iShift, iPass) || this.hasOwnComponent(sComponent, iShift, iPass);
            };

            RenderTechnique.prototype.hasOwnComponent = function (sComponent, iShift, iPass) {
                if (typeof iShift === "undefined") { iShift = ANY_SHIFT; }
                if (typeof iPass === "undefined") { iPass = ANY_PASS; }
                if (akra.isNull(this._pComposer)) {
                    return false;
                }

                var pComponentPool = this._pComposer.getEngine().getResourceManager().getComponentPool();
                var pComponent = null;

                pComponent = pComponentPool.findResource(sComponent);

                if (akra.isNull(pComponent)) {
                    return false;
                }

                return this._pComposer.hasOwnComponentInTechnique(this, pComponent, iShift, iPass);
            };

            RenderTechnique.prototype.hasPostEffect = function () {
                return this._iGlobalPostEffectsStart > 0;
            };

            RenderTechnique.prototype.isPostEffectPass = function (iPass) {
                return this._iGlobalPostEffectsStart <= iPass;
            };

            RenderTechnique.prototype.isLastPass = function (iPass) {
                var iMaxPass = this.getTotalPasses() - 1;

                if (iMaxPass === iPass) {
                    return true;
                }

                if (!this._pPassBlackList[iMaxPass]) {
                    return false;
                }

                for (var i = this._pPassBlackList.length - 2; i >= 0; i--) {
                    if (!this._pPassBlackList[i]) {
                        if (i !== iPass) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }

                return false;
            };

            RenderTechnique.prototype.isFirstPass = function (iPass) {
                if (iPass === 0) {
                    return true;
                }

                if (!this._pPassBlackList[0]) {
                    return false;
                }

                for (var i = 1; i < this._pPassBlackList.length; i++) {
                    if (!this._pPassBlackList[i]) {
                        if (i !== iPass) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }

                return false;
            };

            RenderTechnique.prototype.isFreeze = function () {
                return this._isFreeze;
            };

            RenderTechnique.prototype.updatePasses = function (bSaveOldUniformValue) {
                this._isFreeze = true;

                var iTotalPasses = this.getTotalPasses();

                for (var i = this._pPassList.length; i < iTotalPasses; i++) {
                    if (!akra.isDef(this._pPassBlackList[i]) || this._pPassBlackList[i] === false) {
                        this._pPassList[i] = new akra.render.RenderPass(this, i);
                        this._pPassBlackList[i] = false;
                    }
                }

                for (var i = 0; i < iTotalPasses; i++) {
                    if (!this._pPassBlackList[i]) {
                        var pInput = this._pComposer.getPassInputBlendForTechnique(this, i);
                        if (!akra.isNull(pInput)) {
                            this._pPassList[i].setPassInput(pInput, bSaveOldUniformValue);
                            this._pPassList[i].activate();
                        } else {
                            this._pPassList[i].deactivate();
                        }
                    }
                }

                this._isFreeze = false;
            };

            RenderTechnique.prototype._setComposer = function (pComposer) {
                this._pComposer = pComposer;
            };

            RenderTechnique.prototype._getComposer = function () {
                return this._pComposer;
            };

            RenderTechnique.prototype._renderTechnique = function (pViewport, pRenderable, pSceneObject) {
                if (akra.isNull(this._pComposer)) {
                    return;
                }

                var pComposer = this._pComposer;

                pComposer.prepareTechniqueBlend(this);
                pComposer._setCurrentViewport(pViewport);
                pComposer._setCurrentSceneObject(pSceneObject);
                pComposer._setCurrentRenderableObject(pRenderable);
                pComposer.applySurfaceMaterial(this._pMethod.getSurfaceMaterial());

                this._isFreeze = true;

                this.takePassInputsFromRenderMethod();

                var iTotalPasses = this.getTotalPasses();
                for (var i = 0; i < iTotalPasses; i++) {
                    if (this._pPassBlackList[i] === false && this._pPassList[i].isActive()) {
                        this.activatePass(i);
                        this.render.emit(i, pRenderable, pSceneObject, pViewport);
                        pViewport.render.emit(this, i, pRenderable, pSceneObject);
                        pComposer.renderTechniquePass(this, i);
                    }
                }

                this._isFreeze = false;
                pComposer._setDefaultCurrentState();
            };

            RenderTechnique.prototype._updateMethod = function (pMethod) {
                this.informComposer();
                this.prepareRenderMethodPassStateInfo(pMethod);
            };

            RenderTechnique.prototype._blockPass = function (iPass) {
                this._pPassBlackList[iPass] = true;
                this._pComposer.prepareTechniqueBlend(this);
                // this._pPassList[iPass] = null;
            };

            RenderTechnique.prototype._setPostEffectsFrom = function (iPass) {
                this._iGlobalPostEffectsStart = iPass;
            };

            RenderTechnique.prototype.informComposer = function () {
                if (!akra.isNull(this._pComposer)) {
                    this._pComposer.markTechniqueAsNeedUpdate(this);
                }
            };

            RenderTechnique.prototype.prepareRenderMethodPassStateInfo = function (pMethod) {
                var iLength = this._pRenderMethodPassStateList.getLength();

                for (var i = 0; i < iLength; i++) {
                    this.freePassState(this._pRenderMethodPassStateList.value(i));
                }

                this._pRenderMethodPassStateList.clear();

                if (akra.isNull(pMethod)) {
                    return;
                }

                var iMethodTotalPasses = pMethod.getEffect().getTotalPasses();

                for (var i = 0; i < iMethodTotalPasses; i++) {
                    var pState = this.getFreePassState();
                    pState.uniformKey = 0;
                    pState.foreignKey = 0;
                    pState.samplerKey = 0;
                    pState.renderStatesKey = 0;

                    this._pRenderMethodPassStateList.push(pState);
                }
            };

            RenderTechnique.prototype.takePassInputsFromRenderMethod = function () {
                if (akra.isNull(this._pMethod)) {
                    return;
                }

                var iRenderMethodStartPass = (this._iMinShiftOfOwnBlend < 0) ? (-this._iMinShiftOfOwnBlend) : 0;
                var iTotalPasses = this._pMethod.getEffect().getTotalPasses();

                for (var i = 0; i < iTotalPasses; i++) {
                    if (this._pPassBlackList[i + iRenderMethodStartPass]) {
                        continue;
                    }

                    var pRenderMethodPassInput = this._pMethod._getPassInput(i);
                    var pPassInput = this._pPassList[i].getPassInput();

                    if (akra.isNull(pRenderMethodPassInput) || akra.isNull(pPassInput)) {
                        continue;
                    }

                    var pOldStates = this._pRenderMethodPassStateList.value(i);
                    var pCurrentStates = pRenderMethodPassInput.getStatesInfo();

                    if (pOldStates.uniformKey !== pCurrentStates.uniformKey) {
                        pPassInput._copyUniformsFromInput(pRenderMethodPassInput);
                        pOldStates.uniformKey = pCurrentStates.uniformKey;
                    }

                    if (pOldStates.foreignKey !== pCurrentStates.foreignKey) {
                        pPassInput._copyForeignsFromInput(pRenderMethodPassInput);
                        pOldStates.foreignKey = pCurrentStates.foreignKey;
                    }

                    if (pOldStates.samplerKey !== pCurrentStates.samplerKey) {
                        pPassInput._copySamplersFromInput(pRenderMethodPassInput);
                        pOldStates.samplerKey = pCurrentStates.samplerKey;
                    }

                    if (pOldStates.renderStatesKey !== pCurrentStates.renderStatesKey) {
                        pPassInput._copyRenderStatesFromInput(pRenderMethodPassInput);
                        pOldStates.renderStatesKey = pCurrentStates.renderStatesKey;
                    }
                }
            };

            RenderTechnique.prototype.activatePass = function (iPass) {
                this._iCurrentPass = iPass;
                this._pCurrentPass = this._pPassList[iPass];
            };

            RenderTechnique.prototype.getFreePassState = function () {
                if (RenderTechnique.pRenderMethodPassStatesPool.getLength() > 0) {
                    return RenderTechnique.pRenderMethodPassStatesPool.pop();
                } else {
                    return {
                        uniformKey: 0,
                        foreignKey: 0,
                        samplerKey: 0,
                        renderStatesKey: 0
                    };
                }
            };

            RenderTechnique.prototype.freePassState = function (pState) {
                RenderTechnique.pRenderMethodPassStatesPool.push(pState);
            };
            RenderTechnique.pRenderMethodPassStatesPool = new akra.util.ObjectArray();
            return RenderTechnique;
        })();
        render.RenderTechnique = RenderTechnique;
    })(akra.render || (akra.render = {}));
    var render = akra.render;
})(akra || (akra = {}));
//# sourceMappingURL=RenderTechnique.js.map
