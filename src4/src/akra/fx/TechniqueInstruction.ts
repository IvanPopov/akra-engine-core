/// <reference path="../idl/AIMap.ts" />
/// <reference path="../idl/AERenderStates.ts" />
/// <reference path="../idl/AERenderStateValues.ts" />


import render = require("render");
import DeclInstruction = require("fx/DeclInstruction");
import PassInstruction = require("fx/PassInstruction");

class TechniqueInstruction extends DeclInstruction implements AIAFXTechniqueInstruction {
    private _sName: string = "";
    private _hasComplexName: boolean = false;
    private _pParseNode: AIParseNode = null;
    private _pSharedVariableListV: AIAFXVariableDeclInstruction[] = null;
    private _pSharedVariableListP: AIAFXVariableDeclInstruction[] = null;
    private _pPassList: AIAFXPassInstruction[] = null;

    private _bHasImportedTechniqueFromSameEffect: boolean = false;
    private _pImportedTechniqueList: AIAFXImportedTechniqueInfo[] = null;

    private _pFullComponentList: AIAFXComponent[] = null;
    private _pFullComponentShiftList: int[] = null;

    private _nTotalPasses: uint = 0;
    private _isPostEffect: boolean = false;
    private _isFinalize: boolean = false;

    constructor() {
        super();
        this._pInstructionList = null;
        this._eInstructionType = AEAFXInstructionTypes.k_TechniqueInstruction;
    }

    setName(sName: string, isComplexName: boolean): void {
        this._sName = sName;
        this._hasComplexName = isComplexName;
    }

    getName(): string {
        return this._sName;
    }

    setSemantic(sSemantic: string): void {
        super.setSemantic(sSemantic);

        if (sSemantic === PassInstruction.POST_EFFECT_SEMANTIC) {
            this._isPostEffect = true;
        }
        else {
            this._isPostEffect = false;
        }
    }

    hasComplexName(): boolean {
        return this._hasComplexName;
    }

    isPostEffect(): boolean {
        return this._isPostEffect;
    }

    getSharedVariablesForVertex(): AIAFXVariableDeclInstruction[] {
        return this._pSharedVariableListV;
    }

    getSharedVariablesForPixel(): AIAFXVariableDeclInstruction[] {
        return this._pSharedVariableListP;
    }

    addPass(pPass: AIAFXPassInstruction): void {
        if (isNull(this._pPassList)) {
            this._pPassList = [];
        }

        this._pPassList.push(pPass);
    }

    getPassList(): AIAFXPassInstruction[] {
        return this._pPassList;
    }

    getPass(iPass: uint): AIAFXPassInstruction {
        return iPass < this._pPassList.length ? this._pPassList[iPass] : null;
    }

    totalOwnPasses(): uint {
        return this._pPassList.length;
    }

    totalPasses(): uint {
        return this._nTotalPasses;
    }

    addTechniqueFromSameEffect(pTechnique: AIAFXTechniqueInstruction, iShift: uint): void {
        if (isNull(this._pImportedTechniqueList)) {
            this._pImportedTechniqueList = [];
        }

        this._pImportedTechniqueList.push({
            technique: pTechnique,
            component: null,
            shift: iShift
        });

        this._bHasImportedTechniqueFromSameEffect = true;
    }

    addComponent(pComponent: AIAFXComponent, iShift: int): void {
        if (isNull(this._pImportedTechniqueList)) {
            this._pImportedTechniqueList = [];
        }

        this._pImportedTechniqueList.push({
            technique: pComponent.getTechnique(),
            component: pComponent,
            shift: iShift
        });
    }

    getFullComponentList(): AIAFXComponent[] {
        return this._pFullComponentList;
    }

    getFullComponentShiftList(): int[] {
        return this._pFullComponentShiftList;
    }

    checkForCorrectImports(): boolean {
        return true;
    }

    setGlobalParams(sProvideNameSpace: string,
        pGlobalImportList: AIAFXImportedTechniqueInfo[]): void {
        this.generateListOfSharedVariables();

        if (!this.hasComplexName() && sProvideNameSpace !== "") {
            this._sName = sProvideNameSpace + "." + this._sName;
        }

        if (!isNull(pGlobalImportList)) {
            if (!isNull(this._pImportedTechniqueList)) {
                this._pImportedTechniqueList = pGlobalImportList.concat(this._pImportedTechniqueList);
            }
            else {
                this._pImportedTechniqueList = pGlobalImportList.concat();
            }
        }

        if (!this._bHasImportedTechniqueFromSameEffect) {
            this.generateFullListOfComponent();
            this._isFinalize = true;
        }
    }

    finalize(pComposer: AIAFXComposer): void {
        if (this._isFinalize) {
            return;
        }

        for (var i: uint = 0; i < this._pImportedTechniqueList.length; i++) {
            var pInfo: AIAFXImportedTechniqueInfo = this._pImportedTechniqueList[i];

            if (isNull(pInfo.component)) {
                pInfo.component = pComposer.getComponentByName(pInfo.technique.getName());
            }
        }

        this.generateFullListOfComponent();
        this._isFinalize = true;
    }

    private generateListOfSharedVariables(): void {
        this._pSharedVariableListV = [];
        this._pSharedVariableListP = [];

        for (var i: uint = 0; i < this._pPassList.length; i++) {
            var pSharedV: AIAFXVariableDeclMap = this._pPassList[i]._getSharedVariableMapV();
            var pSharedP: AIAFXVariableDeclMap = this._pPassList[i]._getSharedVariableMapP();

            for (var j in pSharedV) {
                this.addSharedVariable(pSharedV[j], AEFunctionType.k_Vertex);
            }

            for (var j in pSharedP) {
                this.addSharedVariable(pSharedP[j], AEFunctionType.k_Pixel);
            }
        }
    }

    private addSharedVariable(pVar: AIAFXVariableDeclInstruction, eType: AEFunctionType): void {
        var pAddTo: AIAFXVariableDeclInstruction[] = null;

        if (eType === AEFunctionType.k_Vertex) {
            pAddTo = this._pSharedVariableListV;
        }
        else {
            pAddTo = this._pSharedVariableListP;
        }

        for (var i: uint = 0; i < pAddTo.length; i++) {
            if (pAddTo[i] === pVar) {
                return;
            }
        }

        pAddTo.push(pVar);
    }

    private generateFullListOfComponent(): void {
        this._nTotalPasses = this.totalOwnPasses();

        if (isNull(this._pImportedTechniqueList)) {
            return;
        }

        this._pFullComponentList = [];
        this._pFullComponentShiftList = [];

        for (var i: uint = 0; i < this._pImportedTechniqueList.length; i++) {
            var pInfo: AIAFXImportedTechniqueInfo = this._pImportedTechniqueList[i];

            var pTechnique: AIAFXTechniqueInstruction = pInfo.technique;
            var iMainShift: int = pInfo.shift;
            var pAddComponentList: AIAFXComponent[] = pTechnique.getFullComponentList();
            var pAddComponentShiftList: int[] = pTechnique.getFullComponentShiftList();

            if (!isNull(pAddComponentList)) {
                for (var j: uint = 0; j < pAddComponentList.length; i++) {
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
    }


}


export = TechniqueInstruction