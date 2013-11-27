var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../idl/IAFXInstruction.ts" />
    /// <reference path="../logger.ts" />
    /// <reference path="Instruction.ts" />
    /// <reference path="Effect.ts" />
    (function (fx) {
        var ComplexTypeInstruction = (function (_super) {
            __extends(ComplexTypeInstruction, _super);
            function ComplexTypeInstruction() {
                _super.call(this);
                this._sName = "";
                this._sRealName = "";
                this._sHash = "";
                this._sStrongHash = "";
                this._iSize = 0;
                this._pFieldDeclMap = null;
                this._pFieldDeclList = null;
                this._pFieldNameList = null;
                this._pFieldDeclBySemanticMap = null;
                this._hasAllUniqueSemantics = true;
                this._hasFieldWithoutSemantic = false;
                this._isContainArray = false;
                this._isContainSampler = false;
                this._isContainPointer = false;
                this._isContainComplexType = false;
                this._pInstructionList = null;
                this._eInstructionType = akra.EAFXInstructionTypes.k_ComplexTypeInstruction;
            }
            ComplexTypeInstruction.prototype._toDeclString = function () {
                var sCode = "struct " + this._sRealName + "{";

                for (var i = 0; i < this._pFieldDeclList.length; i++) {
                    sCode += "\t" + this._pFieldDeclList[i].toFinalCode() + ";\n";
                }

                sCode += "}";

                return sCode;
            };

            ComplexTypeInstruction.prototype.toFinalCode = function () {
                return this._sRealName;
            };

            ComplexTypeInstruction.prototype.isBuiltIn = function () {
                return false;
            };

            ComplexTypeInstruction.prototype.setBuiltIn = function (isBuiltIn) {
            };

            //-----------------------------------------------------------------//
            //----------------------------SIMPLE TESTS-------------------------//
            //-----------------------------------------------------------------//
            ComplexTypeInstruction.prototype.isBase = function () {
                return false;
            };

            ComplexTypeInstruction.prototype.isArray = function () {
                return false;
            };

            ComplexTypeInstruction.prototype.isNotBaseArray = function () {
                return false;
            };

            ComplexTypeInstruction.prototype.isComplex = function () {
                return true;
            };

            ComplexTypeInstruction.prototype.isEqual = function (pType) {
                return this.getHash() === pType.getHash();
            };

            ComplexTypeInstruction.prototype.isStrongEqual = function (pType) {
                return this.getStrongHash() === pType.getStrongHash();
            };

            ComplexTypeInstruction.prototype.isConst = function () {
                return false;
            };

            ComplexTypeInstruction.prototype.isSampler = function () {
                return false;
            };

            ComplexTypeInstruction.prototype.isSamplerCube = function () {
                return false;
            };

            ComplexTypeInstruction.prototype.isSampler2D = function () {
                return false;
            };

            ComplexTypeInstruction.prototype.isWritable = function () {
                return true;
            };

            ComplexTypeInstruction.prototype.isReadable = function () {
                return true;
            };

            ComplexTypeInstruction.prototype._containArray = function () {
                return this._isContainArray;
            };

            ComplexTypeInstruction.prototype._containSampler = function () {
                return this._isContainSampler;
            };

            ComplexTypeInstruction.prototype._containPointer = function () {
                return this._isContainPointer;
            };

            ComplexTypeInstruction.prototype._containComplexType = function () {
                return this._isContainComplexType;
            };

            //-----------------------------------------------------------------//
            //----------------------------SET BASE TYPE INFO-------------------//
            //-----------------------------------------------------------------//
            ComplexTypeInstruction.prototype.setName = function (sName) {
                this._sName = sName;
                this._sRealName = sName;
            };

            ComplexTypeInstruction.prototype.setRealName = function (sRealName) {
                this._sRealName = sRealName;
            };

            ComplexTypeInstruction.prototype.setSize = function (iSize) {
                this._iSize = iSize;
            };

            ComplexTypeInstruction.prototype._canWrite = function (isWritable) {
            };

            ComplexTypeInstruction.prototype._canRead = function (isWritable) {
            };

            //-----------------------------------------------------------------//
            //----------------------------INIT API-----------------------------//
            //-----------------------------------------------------------------//
            ComplexTypeInstruction.prototype.addField = function (pVariable) {
                if (akra.isNull(this._pFieldDeclMap)) {
                    this._pFieldDeclMap = {};
                    this._pFieldNameList = [];
                }

                if (akra.isNull(this._pFieldDeclList)) {
                    this._pFieldDeclList = [];
                }

                var sVarName = pVariable.getName();
                this._pFieldDeclMap[sVarName] = pVariable;

                if (this._iSize !== fx.Instruction.UNDEFINE_SIZE) {
                    var iSize = pVariable.getType().getSize();
                    if (iSize !== fx.Instruction.UNDEFINE_SIZE) {
                        this._iSize += iSize;
                    } else {
                        this._iSize = fx.Instruction.UNDEFINE_SIZE;
                    }
                }

                this._pFieldNameList.push(sVarName);

                if (this._pFieldDeclList.length < this._pFieldNameList.length) {
                    this._pFieldDeclList.push(pVariable);
                }

                var pType = pVariable.getType();

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
            };

            ComplexTypeInstruction.prototype.addFields = function (pFieldCollector, isSetParent) {
                if (typeof isSetParent === "undefined") { isSetParent = true; }
                this._pFieldDeclList = (pFieldCollector.getInstructions());

                for (var i = 0; i < this._pFieldDeclList.length; i++) {
                    this.addField(this._pFieldDeclList[i]);
                    this._pFieldDeclList[i].setParent(this);
                }

                this.calculatePaddings();
            };

            //-----------------------------------------------------------------//
            //----------------------------GET TYPE INFO------------------------//
            //-----------------------------------------------------------------//
            ComplexTypeInstruction.prototype.getName = function () {
                return this._sName;
            };

            ComplexTypeInstruction.prototype.getRealName = function () {
                return this._sRealName;
            };

            ComplexTypeInstruction.prototype.getHash = function () {
                if (this._sHash === "") {
                    this.calcHash();
                }

                return this._sHash;
            };

            ComplexTypeInstruction.prototype.getStrongHash = function () {
                if (this._sStrongHash === "") {
                    this.calcStrongHash();
                }

                return this._sStrongHash;
            };

            ComplexTypeInstruction.prototype.hasField = function (sFieldName) {
                return akra.isDef(this._pFieldDeclMap[sFieldName]);
            };

            ComplexTypeInstruction.prototype.hasFieldWithSematic = function (sSemantic) {
                if (akra.isNull(this._pFieldDeclBySemanticMap)) {
                    this.analyzeSemantics();
                }

                return akra.isDef(this._pFieldDeclBySemanticMap[sSemantic]);
            };

            ComplexTypeInstruction.prototype.hasAllUniqueSemantics = function () {
                if (akra.isNull(this._pFieldDeclBySemanticMap)) {
                    this.analyzeSemantics();
                }
                return this._hasAllUniqueSemantics;
            };

            ComplexTypeInstruction.prototype.hasFieldWithoutSemantic = function () {
                if (akra.isNull(this._pFieldDeclBySemanticMap)) {
                    this.analyzeSemantics();
                }
                return this._hasFieldWithoutSemantic;
            };

            ComplexTypeInstruction.prototype.getField = function (sFieldName) {
                if (!this.hasField(sFieldName)) {
                    return null;
                }

                return this._pFieldDeclMap[sFieldName];
            };

            ComplexTypeInstruction.prototype.getFieldBySemantic = function (sSemantic) {
                if (!this.hasFieldWithSematic(sSemantic)) {
                    return null;
                }

                return this._pFieldDeclBySemanticMap[sSemantic];
            };

            ComplexTypeInstruction.prototype.getFieldType = function (sFieldName) {
                return akra.isDef(this._pFieldDeclMap[sFieldName]) ? this._pFieldDeclMap[sFieldName].getType() : null;
            };

            ComplexTypeInstruction.prototype.getFieldNameList = function () {
                return this._pFieldNameList;
            };

            ComplexTypeInstruction.prototype.getSize = function () {
                if (this._iSize === fx.Instruction.UNDEFINE_SIZE) {
                    this._iSize = this._calcSize();
                }
                return this._iSize;
            };

            ComplexTypeInstruction.prototype.getBaseType = function () {
                return this;
            };

            ComplexTypeInstruction.prototype.getArrayElementType = function () {
                return null;
            };

            ComplexTypeInstruction.prototype.getTypeDecl = function () {
                return this.getParent();
            };

            ComplexTypeInstruction.prototype.getLength = function () {
                return 0;
            };

            ComplexTypeInstruction.prototype._getFieldDeclList = function () {
                return this._pFieldDeclList;
            };

            //-----------------------------------------------------------------//
            //----------------------------SYSTEM-------------------------------//
            //-----------------------------------------------------------------//
            ComplexTypeInstruction.prototype.clone = function (pRelationMap) {
                if (typeof pRelationMap === "undefined") { pRelationMap = {}; }
                if (this._pParentInstruction === null || !akra.isDef(pRelationMap[this._pParentInstruction._getInstructionID()]) || pRelationMap[this._pParentInstruction._getInstructionID()] === this._pParentInstruction) {
                    //pRelationMap[this._getInstructionID()] = this;
                    return this;
                }

                var pClone = _super.prototype.clone.call(this, pRelationMap);

                pClone._setCloneName(this._sName, this._sRealName);
                pClone._setCloneHash(this._sHash, this._sStrongHash);
                pClone._setCloneContain(this._isContainArray, this._isContainSampler);

                var pFieldDeclList = new Array(this._pFieldDeclList.length);
                var pFieldNameList = new Array(this._pFieldNameList.length);
                var pFieldDeclMap = {};

                for (var i = 0; i < this._pFieldDeclList.length; i++) {
                    var pCloneVar = this._pFieldDeclList[i].clone(pRelationMap);
                    var sVarName = pCloneVar.getName();

                    pFieldDeclList[i] = pCloneVar;
                    pFieldNameList[i] = sVarName;
                    pFieldDeclMap[sVarName] = pCloneVar;
                }

                pClone._setCloneFields(pFieldDeclList, pFieldNameList, pFieldDeclMap);
                pClone.setSize(this._iSize);

                return pClone;
            };

            ComplexTypeInstruction.prototype.blend = function (pType, eMode) {
                if (pType === this) {
                    return this;
                }

                if (eMode === akra.EAFXBlendMode.k_TypeDecl) {
                    return null;
                }

                if (eMode === akra.EAFXBlendMode.k_Uniform || eMode === akra.EAFXBlendMode.k_Attribute) {
                    if (this.hasFieldWithoutSemantic() || pType.hasFieldWithoutSemantic()) {
                        return null;
                    }
                }

                var pFieldList = this._pFieldDeclList;
                var pBlendType = new ComplexTypeInstruction();
                var pRelationMap = {};

                if (akra.isNull(pFieldList)) {
                    akra.logger.log(this, pType);
                }

                for (var i = 0; i < pFieldList.length; i++) {
                    var pField = pFieldList[i];
                    var pBlendField = null;
                    var sFieldName = pField.getName();
                    var sFieldSemantic = pField.getSemantic();

                    if (eMode === akra.EAFXBlendMode.k_Shared) {
                        if (pType.hasField(sFieldName)) {
                            pBlendField = pField.blend(pType.getField(sFieldName), eMode);
                        } else {
                            pBlendField = pField.clone(pRelationMap);
                        }
                    } else if (eMode === akra.EAFXBlendMode.k_Attribute || eMode === akra.EAFXBlendMode.k_Uniform || eMode === akra.EAFXBlendMode.k_VertexOut) {
                        if (pType.hasFieldWithSematic(sFieldSemantic)) {
                            pBlendField = pField.blend(pType.getFieldBySemantic(sFieldSemantic), eMode);
                        } else {
                            pBlendField = pField.clone(pRelationMap);
                        }

                        if (!akra.isNull(pBlendField)) {
                            pBlendField.getNameId().setName(sFieldSemantic);
                            pBlendField.getNameId().setRealName(sFieldSemantic);
                        }
                    }

                    if (akra.isNull(pBlendField)) {
                        return null;
                    }

                    pBlendType.addField(pBlendField);
                }

                pFieldList = (pType)._getFieldDeclList();

                for (var i = 0; i < pFieldList.length; i++) {
                    var pField = pFieldList[i];
                    var pBlendField = null;
                    var sFieldName = pField.getName();
                    var sFieldSemantic = pField.getSemantic();

                    if (eMode === akra.EAFXBlendMode.k_Shared) {
                        if (!this.hasField(sFieldName)) {
                            pBlendField = pField.clone(pRelationMap);
                        }
                    } else if (eMode === akra.EAFXBlendMode.k_Attribute || eMode === akra.EAFXBlendMode.k_Uniform || eMode === akra.EAFXBlendMode.k_VertexOut) {
                        if (!this.hasFieldWithSematic(sFieldSemantic)) {
                            pBlendField = pField.clone(pRelationMap);
                            pBlendField.getNameId().setName(sFieldSemantic);
                            pBlendField.getNameId().setRealName(sFieldSemantic);
                        }
                    }

                    if (!akra.isNull(pBlendField)) {
                        pBlendType.addField(pBlendField);
                    }
                }

                pBlendType.setName(this.getName());
                pBlendType.setRealName(this.getRealName());

                return pBlendType;
            };

            ComplexTypeInstruction.prototype._setCloneName = function (sName, sRealName) {
                this._sName = sName;
                this._sRealName = sRealName;
            };

            ComplexTypeInstruction.prototype._setCloneHash = function (sHash, sStrongHash) {
                this._sHash = sHash;
                this._sStrongHash = sStrongHash;
            };

            ComplexTypeInstruction.prototype._setCloneContain = function (isContainArray, isContainSampler) {
                this._isContainArray = isContainArray;
                this._isContainSampler = isContainSampler;
            };

            ComplexTypeInstruction.prototype._setCloneFields = function (pFieldDeclList, pFieldNameList, pFieldDeclMap) {
                this._pFieldDeclList = pFieldDeclList;
                this._pFieldNameList = pFieldNameList;
                this._pFieldDeclMap = pFieldDeclMap;
            };

            ComplexTypeInstruction.prototype._calcSize = function () {
                var iSize = 0;

                for (var i = 0; i < this._pFieldDeclList.length; i++) {
                    var iFieldSize = this._pFieldDeclList[i].getType().getSize();

                    if (iFieldSize === fx.Instruction.UNDEFINE_SIZE) {
                        iSize = fx.Instruction.UNDEFINE_SIZE;
                        break;
                    } else {
                        iSize += iFieldSize;
                    }
                }

                return iSize;
            };

            ComplexTypeInstruction.prototype.calcHash = function () {
                var sHash = "{";

                for (var i = 0; i < this._pFieldDeclList.length; i++) {
                    sHash += this._pFieldDeclList[i].getType().getHash() + ";";
                }

                sHash += "}";

                this._sHash = sHash;
            };

            ComplexTypeInstruction.prototype.calcStrongHash = function () {
                var sStrongHash = "{";

                for (var i = 0; i < this._pFieldDeclList.length; i++) {
                    sStrongHash += this._pFieldDeclList[i].getType().getStrongHash() + ";";
                }

                sStrongHash += "}";

                this._sStrongHash = sStrongHash;
            };

            ComplexTypeInstruction.prototype.analyzeSemantics = function () {
                this._pFieldDeclBySemanticMap = {};

                for (var i = 0; i < this._pFieldDeclList.length; i++) {
                    var pVar = this._pFieldDeclList[i];
                    var sSemantic = pVar.getSemantic();

                    if (sSemantic === "") {
                        this._hasFieldWithoutSemantic = true;
                    }

                    if (akra.isDef(this._pFieldDeclBySemanticMap[sSemantic])) {
                        this._hasAllUniqueSemantics = false;
                    }

                    this._pFieldDeclBySemanticMap[sSemantic] = pVar;

                    this._hasFieldWithoutSemantic = this._hasFieldWithoutSemantic || pVar.getType().hasFieldWithoutSemantic();
                    if (this._hasAllUniqueSemantics && pVar.getType().isComplex()) {
                        this._hasAllUniqueSemantics = pVar.getType().hasAllUniqueSemantics();
                    }
                }
            };

            ComplexTypeInstruction.prototype.calculatePaddings = function () {
                var iPadding = 0;

                for (var i = 0; i < this._pFieldDeclList.length; i++) {
                    var pVarType = this._pFieldDeclList[i].getType();
                    var iVarSize = pVarType.getSize();

                    if (iVarSize === fx.Instruction.UNDEFINE_SIZE) {
                        this.setError(akra.EEffectErrors.CANNOT_CALCULATE_PADDINGS, { typeName: this.getName() });
                        return;
                    }

                    pVarType.setPadding(iPadding);
                    iPadding += iVarSize;
                }
            };
            return ComplexTypeInstruction;
        })(fx.Instruction);
        fx.ComplexTypeInstruction = ComplexTypeInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
