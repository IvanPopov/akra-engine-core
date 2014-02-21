/// <reference path="../../idl/IAFXInstruction.ts" />
/// <reference path="../../logger.ts" />

/// <reference path="Instruction.ts" />
/// <reference path="../Effect.ts" />


module akra.fx.instructions {

    export class ComplexTypeInstruction extends Instruction implements IAFXTypeInstruction {
        private _sName: string = "";
        private _sRealName: string = "";

        private _sHash: string = "";
        private _sStrongHash: string = "";

        private _iSize: uint = 0;

        private _pFieldDeclMap: IAFXVariableDeclMap = null;
        private _pFieldDeclList: IAFXVariableDeclInstruction[] = null;
        private _pFieldNameList: string[] = null;

        private _pFieldDeclBySemanticMap: IAFXVariableDeclMap = null;
        private _hasAllUniqueSemantics: boolean = true;
        private _hasFieldWithoutSemantic: boolean = false;

        private _isContainArray: boolean = false;
        private _isContainSampler: boolean = false;
        private _isContainPointer: boolean = false;
        private _isContainComplexType: boolean = false;

        constructor() {
            super();
            this._pInstructionList = null;
            this._eInstructionType = EAFXInstructionTypes.k_ComplexTypeInstruction;
        }

        _toDeclString(): string {
            var sCode: string = "struct " + this._sRealName + "{";

            for (var i: uint = 0; i < this._pFieldDeclList.length; i++) {
                sCode += "\t" + this._pFieldDeclList[i].toFinalCode() + ";\n";
            }

            sCode += "}";

            return sCode;
        }

        toFinalCode(): string {
            return this._sRealName;
        }

        isBuiltIn(): boolean {
            return false;
        }

        setBuiltIn(isBuiltIn: boolean): void {
        }

        //-----------------------------------------------------------------//
        //----------------------------SIMPLE TESTS-------------------------//
        //-----------------------------------------------------------------//

        isBase(): boolean {
            return false;
        }

        isArray(): boolean {
            return false;
        }

        isNotBaseArray(): boolean {
            return false;
        }

        isComplex(): boolean {
            return true;
        }

        isEqual(pType: IAFXTypeInstruction): boolean {
            return this.getHash() === pType.getHash();
        }

        isStrongEqual(pType: IAFXTypeInstruction): boolean {
            return this.getStrongHash() === pType.getStrongHash();
        }

        isConst(): boolean {
            return false;
        }

        isSampler(): boolean {
            return false;
        }

        isSamplerCube(): boolean {
            return false;
        }

        isSampler2D(): boolean {
            return false;
        }

        isWritable(): boolean {
            return true;
        }

        isReadable(): boolean {
            return true;
        }

        _containArray(): boolean {
            return this._isContainArray;
        }

        _containSampler(): boolean {
            return this._isContainSampler;
        }

        _containPointer(): boolean {
            return this._isContainPointer;
        }

        _containComplexType(): boolean {
            return this._isContainComplexType;
        }

        //-----------------------------------------------------------------//
        //----------------------------SET BASE TYPE INFO-------------------//
        //-----------------------------------------------------------------//

        setName(sName: string): void {
            this._sName = sName;
            this._sRealName = sName;
        }

        setRealName(sRealName: string): void {
            this._sRealName = sRealName;
        }

        setSize(iSize: uint): void {
            this._iSize = iSize;
        }

        _canWrite(isWritable: boolean): void {
        }

        _canRead(isWritable: boolean): void {
        }

        //-----------------------------------------------------------------//
        //----------------------------INIT API-----------------------------//
        //-----------------------------------------------------------------//

        addField(pVariable: IAFXVariableDeclInstruction): void {
            if (isNull(this._pFieldDeclMap)) {
                this._pFieldDeclMap = <IAFXVariableDeclMap>{};
                this._pFieldNameList = [];
            }

            if (isNull(this._pFieldDeclList)) {
                this._pFieldDeclList = [];
            }

            var sVarName: string = pVariable.getName();
            this._pFieldDeclMap[sVarName] = pVariable;

            if (this._iSize !== Instruction.UNDEFINE_SIZE) {
                var iSize: uint = pVariable.getType().getSize();
                if (iSize !== Instruction.UNDEFINE_SIZE) {
                    this._iSize += iSize;
                }
                else {
                    this._iSize = Instruction.UNDEFINE_SIZE;
                }
            }

            this._pFieldNameList.push(sVarName);

            if (this._pFieldDeclList.length < this._pFieldNameList.length) {
                this._pFieldDeclList.push(pVariable);
            }

            var pType: IAFXVariableTypeInstruction = pVariable.getType();
            //pType._markAsField();

            if (pType.isNotBaseArray() || pType._containArray()) {
                this._isContainArray = true;
            }

            if (Effect.isSamplerType(pType) || pType._containSampler()) {
                this._isContainSampler = true;
            }

            if (pType.isPointer() || pType._containPointer()) {
                this._isContainPointer = true;
            }

            if (pType.isComplex()) {
                this._isContainComplexType = true;
            }
        }

        addFields(pFieldCollector: IAFXInstruction, isSetParent: boolean = true): void {
            this._pFieldDeclList = <IAFXVariableDeclInstruction[]>(pFieldCollector.getInstructions());

            for (var i: uint = 0; i < this._pFieldDeclList.length; i++) {
                this.addField(this._pFieldDeclList[i]);
                this._pFieldDeclList[i].setParent(this);
            }

            this.calculatePaddings();
        }

        //-----------------------------------------------------------------//
        //----------------------------GET TYPE INFO------------------------//
        //-----------------------------------------------------------------//

        getName(): string {
            return this._sName;
        }

        getRealName(): string {
            return this._sRealName;
        }

        getHash(): string {
            if (this._sHash === "") {
                this.calcHash();
            }

            return this._sHash;
        }

        getStrongHash(): string {
            if (this._sStrongHash === "") {
                this.calcStrongHash();
            }

            return this._sStrongHash;
        }

        hasField(sFieldName: string): boolean {
            return isDef(this._pFieldDeclMap[sFieldName]);
        }

        hasFieldWithSematic(sSemantic: string): boolean {
            if (isNull(this._pFieldDeclBySemanticMap)) {
                this.analyzeSemantics();
            }

            return isDef(this._pFieldDeclBySemanticMap[sSemantic]);
        }

        hasAllUniqueSemantics(): boolean {
            if (isNull(this._pFieldDeclBySemanticMap)) {
                this.analyzeSemantics();
            }
            return this._hasAllUniqueSemantics;
        }

        hasFieldWithoutSemantic(): boolean {
            if (isNull(this._pFieldDeclBySemanticMap)) {
                this.analyzeSemantics();
            }
            return this._hasFieldWithoutSemantic;
        }

        getField(sFieldName: string): IAFXVariableDeclInstruction {
            if (!this.hasField(sFieldName)) {
                return null;
            }

            return this._pFieldDeclMap[sFieldName];
        }

        getFieldBySemantic(sSemantic: string): IAFXVariableDeclInstruction {
            if (!this.hasFieldWithSematic(sSemantic)) {
                return null;
            }

            return this._pFieldDeclBySemanticMap[sSemantic];
        }

        getFieldType(sFieldName: string): IAFXVariableTypeInstruction {
            return isDef(this._pFieldDeclMap[sFieldName]) ? this._pFieldDeclMap[sFieldName].getType() : null;
        }

        getFieldNameList(): string[] {
            return this._pFieldNameList;
        }

        getSize(): uint {
            if (this._iSize === Instruction.UNDEFINE_SIZE) {
                this._iSize = this._calcSize();
            }
            return this._iSize;
        }

        getBaseType(): IAFXTypeInstruction {
            return this;
        }

        getArrayElementType(): IAFXTypeInstruction {
            return null;
        }

        getTypeDecl(): IAFXTypeDeclInstruction {
            return <IAFXTypeDeclInstruction>this.getParent();
        }

        getLength(): uint {
            return 0;
        }

        _getFieldDeclList(): IAFXVariableDeclInstruction[] {
            return this._pFieldDeclList;
        }

        //-----------------------------------------------------------------//
        //----------------------------SYSTEM-------------------------------//
        //-----------------------------------------------------------------//

        clone(pRelationMap: IAFXInstructionMap = <IAFXInstructionMap>{}): ComplexTypeInstruction {
            if (this._pParentInstruction === null ||
                !isDef(pRelationMap[this._pParentInstruction._getInstructionID()]) ||
                pRelationMap[this._pParentInstruction._getInstructionID()] === this._pParentInstruction) {
                //pRelationMap[this._getInstructionID()] = this;
                return this;
            }

            var pClone: ComplexTypeInstruction = <ComplexTypeInstruction>super.clone(pRelationMap);

            pClone._setCloneName(this._sName, this._sRealName);
            pClone._setCloneHash(this._sHash, this._sStrongHash);
            pClone._setCloneContain(this._isContainArray, this._isContainSampler);

            var pFieldDeclList: IAFXVariableDeclInstruction[] = new Array(this._pFieldDeclList.length);
            var pFieldNameList: string[] = new Array(this._pFieldNameList.length);
            var pFieldDeclMap: IAFXVariableDeclMap = <IAFXVariableDeclMap>{};

            for (var i: uint = 0; i < this._pFieldDeclList.length; i++) {
                var pCloneVar: IAFXVariableDeclInstruction = this._pFieldDeclList[i].clone(pRelationMap);
                var sVarName: string = pCloneVar.getName();

                pFieldDeclList[i] = pCloneVar;
                pFieldNameList[i] = sVarName;
                pFieldDeclMap[sVarName] = pCloneVar;
            }

            pClone._setCloneFields(pFieldDeclList, pFieldNameList,
                pFieldDeclMap);
            pClone.setSize(this._iSize);

            return pClone;
        }

        blend(pType: IAFXTypeInstruction, eMode: EAFXBlendMode): IAFXTypeInstruction {
            if (pType === this) {
                return this;
            }

            if (eMode === EAFXBlendMode.k_TypeDecl) {
                return null;
            }

            if (eMode === EAFXBlendMode.k_Uniform || eMode === EAFXBlendMode.k_Attribute) {
                if (this.hasFieldWithoutSemantic() || pType.hasFieldWithoutSemantic()) {
                    return null;
                }
            }

            var pFieldList: IAFXVariableDeclInstruction[] = this._pFieldDeclList;
            var pBlendType: ComplexTypeInstruction = new ComplexTypeInstruction();
            var pRelationMap: IAFXInstructionMap = <IAFXInstructionMap>{};

            if (isNull(pFieldList)) {
                logger.log(this, pType);
            }

            for (var i: uint = 0; i < pFieldList.length; i++) {
                var pField: IAFXVariableDeclInstruction = pFieldList[i];
                var pBlendField: IAFXVariableDeclInstruction = null;
                var sFieldName: string = pField.getName();
                var sFieldSemantic: string = pField.getSemantic();

                if (eMode === EAFXBlendMode.k_Shared) {
                    if (pType.hasField(sFieldName)) {
                        pBlendField = pField.blend(pType.getField(sFieldName), eMode);
                    }
                    else {
                        pBlendField = pField.clone(pRelationMap);
                    }
                }
                else if (eMode === EAFXBlendMode.k_Attribute ||
                    eMode === EAFXBlendMode.k_Uniform ||
                    eMode === EAFXBlendMode.k_VertexOut) {

                    if (pType.hasFieldWithSematic(sFieldSemantic)) {
                        pBlendField = pField.blend(pType.getFieldBySemantic(sFieldSemantic), eMode);
                    }
                    else {
                        pBlendField = pField.clone(pRelationMap);
                    }

                    if (!isNull(pBlendField)) {
                        pBlendField.getNameId().setName(sFieldSemantic);
                        pBlendField.getNameId().setRealName(sFieldSemantic);
                    }
                }

                if (isNull(pBlendField)) {
                    return null;
                }

                pBlendType.addField(pBlendField);
            }

            pFieldList = (<ComplexTypeInstruction>pType)._getFieldDeclList();

            for (var i: uint = 0; i < pFieldList.length; i++) {
                var pField: IAFXVariableDeclInstruction = pFieldList[i];
                var pBlendField: IAFXVariableDeclInstruction = null;
                var sFieldName: string = pField.getName();
                var sFieldSemantic: string = pField.getSemantic();

                if (eMode === EAFXBlendMode.k_Shared) {
                    if (!this.hasField(sFieldName)) {
                        pBlendField = pField.clone(pRelationMap);
                    }
                }
                else if (eMode === EAFXBlendMode.k_Attribute ||
                    eMode === EAFXBlendMode.k_Uniform ||
                    eMode === EAFXBlendMode.k_VertexOut) {

                    if (!this.hasFieldWithSematic(sFieldSemantic)) {
                        pBlendField = pField.clone(pRelationMap);
                        pBlendField.getNameId().setName(sFieldSemantic);
                        pBlendField.getNameId().setRealName(sFieldSemantic);
                    }
                }

                if (!isNull(pBlendField)) {
                    pBlendType.addField(pBlendField);
                }
            }

            pBlendType.setName(this.getName());
            pBlendType.setRealName(this.getRealName());

            return pBlendType;
        }

        _setCloneName(sName: string, sRealName: string): void {
            this._sName = sName;
            this._sRealName = sRealName;
        }

        _setCloneHash(sHash: string, sStrongHash: string): void {
            this._sHash = sHash;
            this._sStrongHash = sStrongHash;
        }

        _setCloneContain(isContainArray: boolean, isContainSampler: boolean): void {
            this._isContainArray = isContainArray;
            this._isContainSampler = isContainSampler;
        }

        _setCloneFields(pFieldDeclList: IAFXVariableDeclInstruction[], pFieldNameList: string[],
            pFieldDeclMap: IAFXVariableDeclMap): void {
            this._pFieldDeclList = pFieldDeclList;
            this._pFieldNameList = pFieldNameList;
            this._pFieldDeclMap = pFieldDeclMap;
        }

        _calcSize(): uint {
            var iSize: uint = 0;

            for (var i: uint = 0; i < this._pFieldDeclList.length; i++) {
                var iFieldSize: uint = this._pFieldDeclList[i].getType().getSize();

                if (iFieldSize === Instruction.UNDEFINE_SIZE) {
                    iSize = Instruction.UNDEFINE_SIZE;
                    break;
                }
                else {
                    iSize += iFieldSize;
                }
            }

            return iSize;
        }

        private calcHash(): void {
            var sHash: string = "{";

            for (var i: uint = 0; i < this._pFieldDeclList.length; i++) {
                sHash += this._pFieldDeclList[i].getType().getHash() + ";";
            }

            sHash += "}";

            this._sHash = sHash;
        }

        private calcStrongHash(): void {
            var sStrongHash: string = "{";

            for (var i: uint = 0; i < this._pFieldDeclList.length; i++) {
                sStrongHash += this._pFieldDeclList[i].getType().getStrongHash() + ";";
            }

            sStrongHash += "}";

            this._sStrongHash = sStrongHash;
        }

        private analyzeSemantics(): void {
            this._pFieldDeclBySemanticMap = <IAFXVariableDeclMap>{};

            for (var i: uint = 0; i < this._pFieldDeclList.length; i++) {
                var pVar: IAFXVariableDeclInstruction = this._pFieldDeclList[i];
                var sSemantic: string = pVar.getSemantic();

                if (sSemantic === "") {
                    this._hasFieldWithoutSemantic = true;
                }

                if (isDef(this._pFieldDeclBySemanticMap[sSemantic])) {
                    this._hasAllUniqueSemantics = false;
                }

                this._pFieldDeclBySemanticMap[sSemantic] = pVar;

                this._hasFieldWithoutSemantic = this._hasFieldWithoutSemantic || pVar.getType().hasFieldWithoutSemantic();
                if (this._hasAllUniqueSemantics && pVar.getType().isComplex()) {
                    this._hasAllUniqueSemantics = pVar.getType().hasAllUniqueSemantics();
                }
            }

        }

        private calculatePaddings(): void {
            var iPadding: uint = 0;

            for (var i: uint = 0; i < this._pFieldDeclList.length; i++) {
                var pVarType: IAFXVariableTypeInstruction = this._pFieldDeclList[i].getType();
                var iVarSize: uint = pVarType.getSize();

                if (iVarSize === Instruction.UNDEFINE_SIZE) {
                    this.setError(EEffectErrors.CANNOT_CALCULATE_PADDINGS, { typeName: this.getName() });
                    return;
                }

                pVarType.setPadding(iPadding);
                iPadding += iVarSize;
            }
        }
    }
}

