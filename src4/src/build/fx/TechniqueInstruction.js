/// <reference path="../idl/IMap.ts" />
/// <reference path="../idl/ERenderStates.ts" />
/// <reference path="../idl/ERenderStateValues.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../render/render.ts" />
    /// <reference path="DeclInstruction.ts" />
    /// <reference path="PassInstruction.ts" />
    (function (fx) {
        var TechniqueInstruction = (function (_super) {
            __extends(TechniqueInstruction, _super);
            function TechniqueInstruction() {
                _super.call(this);
                this._sName = "";
                this._hasComplexName = false;
                this._pParseNode = null;
                this._pSharedVariableListV = null;
                this._pSharedVariableListP = null;
                this._pPassList = null;
                this._bHasImportedTechniqueFromSameEffect = false;
                this._pImportedTechniqueList = null;
                this._pFullComponentList = null;
                this._pFullComponentShiftList = null;
                this._nTotalPasses = 0;
                this._isPostEffect = false;
                this._isFinalize = false;
                this._pInstructionList = null;
                this._eInstructionType = 60 /* k_TechniqueInstruction */;
            }
            TechniqueInstruction.prototype.setName = function (sName, isComplexName) {
                this._sName = sName;
                this._hasComplexName = isComplexName;
            };

            TechniqueInstruction.prototype.getName = function () {
                return this._sName;
            };

            TechniqueInstruction.prototype.setSemantic = function (sSemantic) {
                _super.prototype.setSemantic.call(this, sSemantic);

                if (sSemantic === akra.fx.PassInstruction.POST_EFFECT_SEMANTIC) {
                    this._isPostEffect = true;
                } else {
                    this._isPostEffect = false;
                }
            };

            TechniqueInstruction.prototype.hasComplexName = function () {
                return this._hasComplexName;
            };

            TechniqueInstruction.prototype.isPostEffect = function () {
                return this._isPostEffect;
            };

            TechniqueInstruction.prototype.getSharedVariablesForVertex = function () {
                return this._pSharedVariableListV;
            };

            TechniqueInstruction.prototype.getSharedVariablesForPixel = function () {
                return this._pSharedVariableListP;
            };

            TechniqueInstruction.prototype.addPass = function (pPass) {
                if (akra.isNull(this._pPassList)) {
                    this._pPassList = [];
                }

                this._pPassList.push(pPass);
            };

            TechniqueInstruction.prototype.getPassList = function () {
                return this._pPassList;
            };

            TechniqueInstruction.prototype.getPass = function (iPass) {
                return iPass < this._pPassList.length ? this._pPassList[iPass] : null;
            };

            TechniqueInstruction.prototype.totalOwnPasses = function () {
                return this._pPassList.length;
            };

            TechniqueInstruction.prototype.totalPasses = function () {
                return this._nTotalPasses;
            };

            TechniqueInstruction.prototype.addTechniqueFromSameEffect = function (pTechnique, iShift) {
                if (akra.isNull(this._pImportedTechniqueList)) {
                    this._pImportedTechniqueList = [];
                }

                this._pImportedTechniqueList.push({
                    technique: pTechnique,
                    component: null,
                    shift: iShift
                });

                this._bHasImportedTechniqueFromSameEffect = true;
            };

            TechniqueInstruction.prototype.addComponent = function (pComponent, iShift) {
                if (akra.isNull(this._pImportedTechniqueList)) {
                    this._pImportedTechniqueList = [];
                }

                this._pImportedTechniqueList.push({
                    technique: pComponent.getTechnique(),
                    component: pComponent,
                    shift: iShift
                });
            };

            TechniqueInstruction.prototype.getFullComponentList = function () {
                return this._pFullComponentList;
            };

            TechniqueInstruction.prototype.getFullComponentShiftList = function () {
                return this._pFullComponentShiftList;
            };

            TechniqueInstruction.prototype.checkForCorrectImports = function () {
                return true;
            };

            TechniqueInstruction.prototype.setGlobalParams = function (sProvideNameSpace, pGlobalImportList) {
                this.generateListOfSharedVariables();

                if (!this.hasComplexName() && sProvideNameSpace !== "") {
                    this._sName = sProvideNameSpace + "." + this._sName;
                }

                if (!akra.isNull(pGlobalImportList)) {
                    if (!akra.isNull(this._pImportedTechniqueList)) {
                        this._pImportedTechniqueList = pGlobalImportList.concat(this._pImportedTechniqueList);
                    } else {
                        this._pImportedTechniqueList = pGlobalImportList.concat();
                    }
                }

                if (!this._bHasImportedTechniqueFromSameEffect) {
                    this.generateFullListOfComponent();
                    this._isFinalize = true;
                }
            };

            TechniqueInstruction.prototype.finalize = function (pComposer) {
                if (this._isFinalize) {
                    return;
                }

                for (var i = 0; i < this._pImportedTechniqueList.length; i++) {
                    var pInfo = this._pImportedTechniqueList[i];

                    if (akra.isNull(pInfo.component)) {
                        pInfo.component = pComposer.getComponentByName(pInfo.technique.getName());
                    }
                }

                this.generateFullListOfComponent();
                this._isFinalize = true;
            };

            TechniqueInstruction.prototype.generateListOfSharedVariables = function () {
                this._pSharedVariableListV = [];
                this._pSharedVariableListP = [];

                for (var i = 0; i < this._pPassList.length; i++) {
                    var pSharedV = this._pPassList[i]._getSharedVariableMapV();
                    var pSharedP = this._pPassList[i]._getSharedVariableMapP();

                    for (var j in pSharedV) {
                        this.addSharedVariable(pSharedV[j], 0 /* k_Vertex */);
                    }

                    for (var j in pSharedP) {
                        this.addSharedVariable(pSharedP[j], 1 /* k_Pixel */);
                    }
                }
            };

            TechniqueInstruction.prototype.addSharedVariable = function (pVar, eType) {
                var pAddTo = null;

                if (eType === 0 /* k_Vertex */) {
                    pAddTo = this._pSharedVariableListV;
                } else {
                    pAddTo = this._pSharedVariableListP;
                }

                for (var i = 0; i < pAddTo.length; i++) {
                    if (pAddTo[i] === pVar) {
                        return;
                    }
                }

                pAddTo.push(pVar);
            };

            TechniqueInstruction.prototype.generateFullListOfComponent = function () {
                this._nTotalPasses = this.totalOwnPasses();

                if (akra.isNull(this._pImportedTechniqueList)) {
                    return;
                }

                this._pFullComponentList = [];
                this._pFullComponentShiftList = [];

                for (var i = 0; i < this._pImportedTechniqueList.length; i++) {
                    var pInfo = this._pImportedTechniqueList[i];

                    var pTechnique = pInfo.technique;
                    var iMainShift = pInfo.shift;
                    var pAddComponentList = pTechnique.getFullComponentList();
                    var pAddComponentShiftList = pTechnique.getFullComponentShiftList();

                    if (!akra.isNull(pAddComponentList)) {
                        for (var j = 0; j < pAddComponentList.length; i++) {
                            this._pFullComponentList.push(pAddComponentList[j]);
                            this._pFullComponentShiftList.push(pAddComponentShiftList[j] + iMainShift);
                        }
                    }

                    this._pFullComponentList.push(pInfo.component);
                    this._pFullComponentShiftList.push(iMainShift);

                    if (this._nTotalPasses < iMainShift + pTechnique.totalPasses()) {
                        this._nTotalPasses = iMainShift + pTechnique.totalPasses();
                    }
                }
            };
            return TechniqueInstruction;
        })(akra.fx.DeclInstruction);
        fx.TechniqueInstruction = TechniqueInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=TechniqueInstruction.js.map
