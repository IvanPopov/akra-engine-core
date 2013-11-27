/// <reference path="../idl/AIAFXInstruction.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/Instruction", "fx/Effect", "fx/IdInstruction", "fx/VariableInstruction", "IntInstruction", "fx/IdExprInstruction"], function(require, exports, __Instruction__, __Effect__, __IdInstruction__, __VariableDeclInstruction__, __IntInstruction__, __IdExprInstruction__) {
    var Instruction = __Instruction__;
    var Effect = __Effect__;
    var IdInstruction = __IdInstruction__;
    var VariableDeclInstruction = __VariableDeclInstruction__;
    var IntInstruction = __IntInstruction__;
    var IdExprInstruction = __IdExprInstruction__;

    var VariableTypeInstruction = (function (_super) {
        __extends(VariableTypeInstruction, _super);
        function VariableTypeInstruction() {
            _super.call(this);
            this._pSubType = null;
            this._pUsageList = null;
            this._sName = "";
            this._isWritable = null;
            this._isReadable = null;
            this._bUsedForWrite = false;
            this._bUsedForRead = false;
            this._sHash = "";
            this._sStrongHash = "";
            this._isArray = false;
            this._isPointer = false;
            this._isStrictPointer = false;
            this._isPointIndex = false;
            this._isUniform = false;
            this._isGlobal = false;
            this._isConst = false;
            this._isShared = false;
            this._isForeign = false;
            this._iLength = Instruction.UNDEFINE_LENGTH;
            this._isNeedToUpdateLength = false;
            this._isFromVariableDecl = null;
            this._isFromTypeDecl = null;
            this._isField = false;
            this._pArrayIndexExpr = null;
            this._pArrayElementType = null;
            this._pFieldDeclMap = null;
            this._pFieldDeclBySemanticMap = null;
            this._pFieldIdMap = null;
            this._pUsedFieldMap = null;
            this._pVideoBuffer = null;
            this._pMainPointIndex = null;
            this._pUpPointIndex = null;
            this._pDownPointIndex = null;
            this._nPointDim = 0;
            this._pPointerList = null;
            this._iPadding = Instruction.UNDEFINE_PADDING;
            this._pSubDeclList = null;
            this._pAttrOffset = null;
            this._bUnverifiable = false;
            this._bCollapsed = false;
            this._pInstructionList = null;
            this._eInstructionType = 3 /* k_VariableTypeInstruction */;
        }
        VariableTypeInstruction.prototype.toFinalCode = function () {
            var sCode = "";
            if (!isNull(this._pUsageList)) {
                if (!this.isShared()) {
                    for (var i = 0; i < this._pUsageList.length; i++) {
                        sCode += this._pUsageList[i] + " ";
                    }
                }
            }

            sCode += this.getSubType().toFinalCode();

            return sCode;
        };

        VariableTypeInstruction.prototype._toDeclString = function () {
            return this.getSubType()._toDeclString();
        };

        VariableTypeInstruction.prototype.isBuiltIn = function () {
            return false;
        };

        VariableTypeInstruction.prototype.setBuiltIn = function (isBuiltIn) {
        };

        VariableTypeInstruction.prototype._setCollapsed = function (bValue) {
            this._bCollapsed = bValue;
        };

        VariableTypeInstruction.prototype._isCollapsed = function () {
            return this._bCollapsed;
        };

        //-----------------------------------------------------------------//
        //----------------------------SIMPLE TESTS-------------------------//
        //-----------------------------------------------------------------//
        VariableTypeInstruction.prototype.isBase = function () {
            return this.getSubType().isBase() && this._isArray === false;
        };

        VariableTypeInstruction.prototype.isArray = function () {
            return this._isArray || (this.getSubType().isArray());
        };

        VariableTypeInstruction.prototype.isNotBaseArray = function () {
            return this._isArray || (this.getSubType().isNotBaseArray());
        };

        VariableTypeInstruction.prototype.isComplex = function () {
            return this.getSubType().isComplex();
        };

        VariableTypeInstruction.prototype.isEqual = function (pType) {
            if (this._isUnverifiable()) {
                return true;
            }

            if (this.isNotBaseArray() && pType.isNotBaseArray() && (this.getLength() !== pType.getLength() || this.getLength() === Instruction.UNDEFINE_LENGTH || pType.getLength() === Instruction.UNDEFINE_LENGTH)) {
                return false;
            }

            if (this.getHash() !== pType.getHash()) {
                return false;
            }

            return true;
        };

        VariableTypeInstruction.prototype.isStrongEqual = function (pType) {
            if (!this.isEqual(pType) || this.getStrongHash() !== pType.getStrongHash()) {
                return false;
            }

            return true;
        };

        VariableTypeInstruction.prototype.isSampler = function () {
            return this.getSubType().isSampler();
        };

        VariableTypeInstruction.prototype.isSamplerCube = function () {
            return this.getSubType().isSamplerCube();
        };

        VariableTypeInstruction.prototype.isSampler2D = function () {
            return this.getSubType().isSampler2D();
        };

        VariableTypeInstruction.prototype.isWritable = function () {
            if (!isNull(this._isWritable)) {
                return this._isWritable;
            }

            if ((this.isArray() && !this.isBase()) || this.isForeign() || this.isUniform()) {
                this._isWritable = false;
            } else {
                this._isWritable = this.getSubType().isWritable();
            }

            return this._isWritable;
        };

        VariableTypeInstruction.prototype.isReadable = function () {
            if (!isNull(this._isReadable)) {
                return this._isReadable;
            }

            if (this.hasUsage("out")) {
                this._isReadable = false;
            } else {
                this._isReadable = this.getSubType().isReadable();
            }

            return this._isReadable;
        };

        VariableTypeInstruction.prototype._containArray = function () {
            return this.getSubType()._containArray();
        };

        VariableTypeInstruction.prototype._containSampler = function () {
            return this.getSubType()._containSampler();
        };

        VariableTypeInstruction.prototype._containPointer = function () {
            return this.getSubType()._containPointer();
        };

        VariableTypeInstruction.prototype._containComplexType = function () {
            return this.getSubType()._containComplexType();
        };

        VariableTypeInstruction.prototype.isPointer = function () {
            return this._isPointer || (this.getSubType()._getInstructionType() === 3 /* k_VariableTypeInstruction */ && (this.getSubType()).isPointer());
        };

        VariableTypeInstruction.prototype.isStrictPointer = function () {
            return this._isStrictPointer || (this.getSubType()._getInstructionType() === 3 /* k_VariableTypeInstruction */ && (this.getSubType()).isStrictPointer());
        };

        VariableTypeInstruction.prototype.isPointIndex = function () {
            if (isNull(this._isPointIndex)) {
                this._isPointIndex = this.isStrongEqual(Effect.getSystemType("ptr"));
            }

            return this._isPointIndex;
        };

        VariableTypeInstruction.prototype.isFromVariableDecl = function () {
            if (!isNull(this._isFromVariableDecl)) {
                return this._isFromVariableDecl;
            }

            if (isNull(this.getParent())) {
                this._isFromVariableDecl = false;
            } else {
                var eParentType = this.getParent()._getInstructionType();

                if (eParentType === 15 /* k_VariableDeclInstruction */) {
                    this._isFromVariableDecl = true;
                } else if (eParentType === 3 /* k_VariableTypeInstruction */) {
                    this._isFromVariableDecl = (this.getParent()).isFromVariableDecl();
                } else {
                    this._isFromVariableDecl = false;
                }
            }

            return this._isFromVariableDecl;
        };

        VariableTypeInstruction.prototype.isFromTypeDecl = function () {
            if (!isNull(this._isFromTypeDecl)) {
                return this._isFromTypeDecl;
            }

            if (isNull(this.getParent())) {
                this._isFromTypeDecl = false;
            } else {
                var eParentType = this.getParent()._getInstructionType();

                if (eParentType === 14 /* k_TypeDeclInstruction */) {
                    this._isFromTypeDecl = true;
                } else if (eParentType === 3 /* k_VariableTypeInstruction */) {
                    this._isFromTypeDecl = (this.getParent()).isFromVariableDecl();
                } else {
                    this._isFromTypeDecl = false;
                }
            }

            return this._isFromTypeDecl;
        };

        VariableTypeInstruction.prototype.isUniform = function () {
            if (isNull(this._isUniform)) {
                this._isUniform = this.hasUsage("uniform");
            }

            return this._isUniform;
        };

        VariableTypeInstruction.prototype.isGlobal = function () {
            if (isNull(this._isGlobal)) {
                this._isGlobal = this._getScope() === 0;
            }

            return this._isGlobal;
        };

        VariableTypeInstruction.prototype.isConst = function () {
            if (isNull(this._isConst)) {
                this._isConst = this.hasUsage("const");
            }

            return this._isConst;
        };

        VariableTypeInstruction.prototype.isShared = function () {
            if (isNull(this._isShared)) {
                this._isShared = this.hasUsage("shared");
            }

            return this._isShared;
        };

        VariableTypeInstruction.prototype.isForeign = function () {
            if (isNull(this._isForeign)) {
                this._isForeign = this.hasUsage("foreign");
            }

            return this._isForeign;
        };

        VariableTypeInstruction.prototype._isTypeOfField = function () {
            if (isNull(this.getParent())) {
                return false;
            }

            if (this.getParent()._getInstructionType() === 15 /* k_VariableDeclInstruction */) {
                var pParentDecl = this.getParent();
                return pParentDecl.isField();
            }

            return false;
        };

        VariableTypeInstruction.prototype._isUnverifiable = function () {
            return this._bUnverifiable;
        };

        //-----------------------------------------------------------------//
        //----------------------------SET TYPE INFO------------------------//
        //-----------------------------------------------------------------//
        VariableTypeInstruction.prototype.setName = function (sName) {
            this._sName = sName;
        };

        VariableTypeInstruction.prototype._canWrite = function (isWritable) {
            this._isWritable = isWritable;
        };

        VariableTypeInstruction.prototype._canRead = function (isReadable) {
            this._isReadable = isReadable;
        };

        //-----------------------------------------------------------------//
        //----------------------------INIT API-----------------------------//
        //-----------------------------------------------------------------//
        VariableTypeInstruction.prototype.setPadding = function (iPadding) {
            this._iPadding = iPadding;
        };

        VariableTypeInstruction.prototype.pushType = function (pType) {
            var eType = pType._getInstructionType();

            if (eType === 4 /* k_SystemTypeInstruction */ || eType === 5 /* k_ComplexTypeInstruction */) {
                this._pSubType = pType;
            } else {
                var pVarType = pType;
                if (!pVarType.isNotBaseArray() && !pVarType.isPointer()) {
                    var pUsageList = pVarType.getUsageList();
                    if (!isNull(pUsageList)) {
                        for (var i = 0; i < pUsageList.length; i++) {
                            this.addUsage(pUsageList[i]);
                        }
                    }

                    this._pSubType = pVarType.getSubType();
                } else {
                    this._pSubType = pType;
                }
            }
        };

        VariableTypeInstruction.prototype.addUsage = function (sUsage) {
            if (isNull(this._pUsageList)) {
                this._pUsageList = [];
            }

            if (!this.hasUsage(sUsage)) {
                this._pUsageList.push(sUsage);
            }
        };

        VariableTypeInstruction.prototype.addArrayIndex = function (pExpr) {
            //TODO: add support for v[][10]
            this._pArrayElementType = new VariableTypeInstruction();
            this._pArrayElementType.pushType(this.getSubType());
            if (!isNull(this._pUsageList)) {
                for (var i = 0; i < this._pUsageList.length; i++) {
                    this._pArrayElementType.addUsage(this._pUsageList[i]);
                }
            }
            this._pArrayElementType.setParent(this);

            this._pArrayIndexExpr = pExpr;

            this._iLength = this._pArrayIndexExpr.evaluate() ? this._pArrayIndexExpr.getEvalValue() : Instruction.UNDEFINE_LENGTH;

            this._isArray = true;

            if (this._iLength === Instruction.UNDEFINE_LENGTH) {
                this._isNeedToUpdateLength = true;
            }
        };

        VariableTypeInstruction.prototype.addPointIndex = function (isStrict) {
            if (typeof isStrict === "undefined") { isStrict = true; }
            this._nPointDim++;
            this._isPointer = true;
            if (isStrict) {
                this._isStrictPointer = true;
            }
        };

        VariableTypeInstruction.prototype.setVideoBuffer = function (pBuffer) {
            if (this.isPointIndex()) {
                (this.getParent().getParent()).getType().setVideoBuffer(pBuffer);
                return;
            }

            this._pVideoBuffer = pBuffer;

            if (!this.isComplex()) {
                return;
            }

            var pFieldNameList = this.getFieldNameList();

            for (var i = 0; i < pFieldNameList.length; i++) {
                var pFieldType = this.getFieldType(pFieldNameList[i]);

                if (pFieldType.isPointer()) {
                    pFieldType.setVideoBuffer(pBuffer);
                }
            }
        };

        VariableTypeInstruction.prototype.initializePointers = function () {
            this._pPointerList = [];
            var pDownPointer = this._getParentVarDecl();

            for (var i = 0; i < this.getPointDim(); i++) {
                var pPointer = new VariableDeclInstruction();
                var pPointerType = new VariableTypeInstruction();
                var pPointerId = new IdInstruction();

                pPointer.push(pPointerType, true);
                pPointer.push(pPointerId, true);

                pPointerType.pushType(Effect.getSystemType("ptr"));
                pPointerId.setName(Instruction.UNDEFINE_NAME);
                pPointerId.setName(this._getParentVarDecl().getName() + "_pointer_" + i.toString());

                if (i > 0) {
                    (this._pPointerList[i - 1].getType())._setUpDownPointers(pPointer, pDownPointer);
                    pDownPointer = this._pPointerList[i - 1];
                } else {
                    pPointerType._setUpDownPointers(null, pDownPointer);
                }

                pPointer.setParent(this._getParentVarDecl());
                this._pPointerList.push(pPointer);
            }

            this._pPointerList[this._pPointerList.length - 1].getType()._setUpDownPointers(null, pDownPointer);
            this._pUpPointIndex = this._pPointerList[0];
            this._pMainPointIndex = this._pPointerList[this._pPointerList.length - 1];
        };

        VariableTypeInstruction.prototype._setPointerToStrict = function () {
            this._isStrictPointer = true;
        };

        VariableTypeInstruction.prototype._addPointIndexInDepth = function () {
            if (!this.isComplex()) {
                return;
            }

            var pFieldNameList = this.getFieldNameList();

            for (var i = 0; i < pFieldNameList.length; i++) {
                var pFieldType = this.getFieldType(pFieldNameList[i]);
                if (!pFieldType.isPointer()) {
                    pFieldType.addPointIndex(false);
                    pFieldType._setVideoBufferInDepth();
                }
            }
        };

        VariableTypeInstruction.prototype._setVideoBufferInDepth = function () {
            if (this.isPointer()) {
                this.setVideoBuffer(Effect.createVideoBufferVariable());
            } else if (this.isComplex() && this._containPointer()) {
                var pFieldNameList = this.getFieldNameList();

                for (var i = 0; i < pFieldNameList.length; i++) {
                    var pFieldType = this.getFieldType(pFieldNameList[i]);

                    pFieldType._setVideoBufferInDepth();
                }
            }
        };

        VariableTypeInstruction.prototype._markAsUnverifiable = function (isUnverifiable) {
            this._bUnverifiable = true;
        };

        VariableTypeInstruction.prototype._addAttrOffset = function (pOffset) {
            this._pAttrOffset = pOffset;
        };

        //-----------------------------------------------------------------//
        //----------------------------GET TYPE INFO------------------------//
        //-----------------------------------------------------------------//
        VariableTypeInstruction.prototype.getName = function () {
            return this._sName;
        };

        VariableTypeInstruction.prototype.getRealName = function () {
            return this.getBaseType().getRealName();
        };

        VariableTypeInstruction.prototype.getHash = function () {
            if (this._sHash === "") {
                this.calcHash();
            }

            return this._sHash;
        };

        VariableTypeInstruction.prototype.getStrongHash = function () {
            if (this._sStrongHash === "") {
                this.calcStrongHash();
            }

            return this._sStrongHash;
        };

        VariableTypeInstruction.prototype.getSize = function () {
            if (this.isPointer() || this.isPointIndex()) {
                return 1;
            }

            if (this._isArray) {
                var iSize = this._pArrayElementType.getSize();
                if (this._iLength === Instruction.UNDEFINE_LENGTH || iSize === Instruction.UNDEFINE_SIZE) {
                    return Instruction.UNDEFINE_SIZE;
                } else {
                    return iSize * this._iLength;
                }
            } else {
                return this.getSubType().getSize();
            }
        };

        VariableTypeInstruction.prototype.getBaseType = function () {
            return this.getSubType().getBaseType();
        };

        VariableTypeInstruction.prototype.getLength = function () {
            if (!this.isNotBaseArray()) {
                this._iLength = 0;
                return 0;
            }

            if (this.isNotBaseArray() && !this._isArray) {
                this._iLength = this.getSubType().getLength();
            } else if (this._iLength === Instruction.UNDEFINE_LENGTH || this._isNeedToUpdateLength) {
                var isEval = this._pArrayIndexExpr.evaluate();

                if (isEval) {
                    var iValue = this._pArrayIndexExpr.getEvalValue();
                    this._iLength = isInt(iValue) ? iValue : Instruction.UNDEFINE_LENGTH;
                }
            }

            return this._iLength;
        };

        VariableTypeInstruction.prototype.getPadding = function () {
            return this.isPointIndex() ? this._getDownPointer().getType().getPadding() : this._iPadding;
        };

        VariableTypeInstruction.prototype.getArrayElementType = function () {
            if (this._isUnverifiable()) {
                return this;
            }

            if (!this.isArray()) {
                return null;
            }

            if (isNull(this._pArrayElementType)) {
                this._pArrayElementType = new VariableTypeInstruction();
                this._pArrayElementType.pushType(this.getSubType().getArrayElementType());
                if (!isNull(this._pUsageList)) {
                    for (var i = 0; i < this._pUsageList.length; i++) {
                        this._pArrayElementType.addUsage(this._pUsageList[i]);
                    }
                }
                this._pArrayElementType.setParent(this);
            }

            return this._pArrayElementType;
        };

        VariableTypeInstruction.prototype.getTypeDecl = function () {
            if (!this.isFromTypeDecl()) {
                return null;
            }

            var eParentType = this.getParent()._getInstructionType();

            if (eParentType === 14 /* k_TypeDeclInstruction */) {
                return this.getParent();
            } else {
                return (this.getParent()).getTypeDecl();
            }
        };

        VariableTypeInstruction.prototype.hasField = function (sFieldName) {
            return this._isUnverifiable() ? true : this.getSubType().hasField(sFieldName);
        };

        VariableTypeInstruction.prototype.hasFieldWithSematic = function (sSemantic) {
            if (!this.isComplex()) {
                return false;
            }

            return this.getSubType().hasFieldWithSematic(sSemantic);
        };

        VariableTypeInstruction.prototype.hasAllUniqueSemantics = function () {
            if (!this.isComplex()) {
                return false;
            }

            return this.getSubType().hasAllUniqueSemantics();
        };

        VariableTypeInstruction.prototype.hasFieldWithoutSemantic = function () {
            if (!this.isComplex()) {
                return false;
            }

            return this.getSubType().hasFieldWithoutSemantic();
        };

        VariableTypeInstruction.prototype.getField = function (sFieldName) {
            if (!this.hasField(sFieldName)) {
                return null;
            }

            if (isNull(this._pFieldDeclMap)) {
                this._pFieldDeclMap = {};
            }

            if (isDef(this._pFieldDeclMap[sFieldName])) {
                return this._pFieldDeclMap[sFieldName];
            }

            var pField = new VariableDeclInstruction();

            if (!this._isUnverifiable()) {
                var pSubField = this.getSubType().getField(sFieldName);

                var pFieldType = new VariableTypeInstruction();
                pFieldType.pushType(pSubField.getType());

                // if(!this.isBase()){
                pFieldType.setPadding(pSubField.getType().getPadding());

                // }
                pField.push(pFieldType, true);
                pField.push(pSubField.getNameId(), false);
                pField.setSemantic(pSubField.getSemantic());
            } else {
                var pFieldName = new IdInstruction();

                pFieldName.setName(sFieldName);
                pFieldName.setRealName(sFieldName);

                pField.push(this, false);
                pField.push(pFieldName, true);
            }

            pField.setParent(this);

            this._pFieldDeclMap[sFieldName] = pField;

            return pField;
        };

        VariableTypeInstruction.prototype.getFieldBySemantic = function (sSemantic) {
            if (this.hasFieldWithSematic(sSemantic)) {
                return null;
            }

            if (isNull(this._pFieldDeclBySemanticMap)) {
                this._pFieldDeclBySemanticMap = {};
            }

            if (isDef(this._pFieldDeclBySemanticMap[sSemantic])) {
                return this._pFieldDeclBySemanticMap[sSemantic];
            }

            var pField = new VariableDeclInstruction();
            var pSubField = this.getSubType().getFieldBySemantic(sSemantic);

            var pFieldType = new VariableTypeInstruction();
            pFieldType.pushType(pSubField.getType());

            // if(!this.isBase()){
            pFieldType.setPadding(pSubField.getType().getPadding());

            // }
            pField.push(pFieldType, true);
            pField.push(pSubField.getNameId(), false);

            pField.setParent(this);

            this._pFieldDeclBySemanticMap[sSemantic] = pField;

            return pField;
        };

        VariableTypeInstruction.prototype.getFieldType = function (sFieldName) {
            return this.getField(sFieldName).getType();
        };

        VariableTypeInstruction.prototype.getFieldNameList = function () {
            return this.getSubType().getFieldNameList();
        };

        VariableTypeInstruction.prototype.getUsageList = function () {
            return this._pUsageList;
        };

        VariableTypeInstruction.prototype.getSubType = function () {
            return this._pSubType;
        };

        VariableTypeInstruction.prototype.hasUsage = function (sUsageName) {
            if (isNull(this._pUsageList)) {
                return false;
            }

            for (var i = 0; i < this._pUsageList.length; i++) {
                if (this._pUsageList[i] === sUsageName) {
                    return true;
                }
            }

            if (!isNull(this.getSubType()) && this.getSubType()._getInstructionType() === 3 /* k_VariableTypeInstruction */) {
                return (this.getSubType()).hasUsage(sUsageName);
            }

            return false;
        };

        VariableTypeInstruction.prototype.hasVideoBuffer = function () {
            return !isNull(this.getVideoBuffer());
        };

        VariableTypeInstruction.prototype.getPointDim = function () {
            return this._nPointDim || ((this.getSubType()._getInstructionType() === 3 /* k_VariableTypeInstruction */) ? (this.getSubType()).getPointDim() : 0);
        };

        VariableTypeInstruction.prototype.getPointer = function () {
            if (!this.isFromVariableDecl() || !(this.isPointer() || this.isPointIndex()) || !this.hasVideoBuffer()) {
                return null;
            }

            if (!isNull(this._pUpPointIndex)) {
                return this._pUpPointIndex;
            }

            if (this.isPointIndex()) {
                return null;
            }

            this.initializePointers();

            return this._pUpPointIndex;
        };

        VariableTypeInstruction.prototype.getVideoBuffer = function () {
            if (this.isPointIndex()) {
                return (this.getParent().getParent()).getType().getVideoBuffer();
            }

            return this._pVideoBuffer;
        };

        VariableTypeInstruction.prototype.getFieldExpr = function (sFieldName) {
            if (!this.hasField(sFieldName)) {
                return null;
            }
            var pField = this.getField(sFieldName);
            var pExpr = new IdExprInstruction();
            pExpr.push(pField.getNameId(), false);
            pExpr.setType(pField.getType());

            return pExpr;
        };

        VariableTypeInstruction.prototype.getFieldIfExist = function (sFieldName) {
            if (isNull(this._pFieldDeclMap) && isDef(this._pFieldDeclMap[sFieldName])) {
                return this._pFieldDeclMap[sFieldName];
            } else {
                return null;
            }
        };

        VariableTypeInstruction.prototype.getSubVarDecls = function () {
            if (!this.canHaveSubDecls()) {
                return null;
            }

            if (isNull(this._pSubDeclList)) {
                this.generateSubDeclList();
            }
            return this._pSubDeclList;
        };

        VariableTypeInstruction.prototype._getFullName = function () {
            if (!this.isFromVariableDecl()) {
                return "Not from variable decl";
            }

            var eParentType = this.getParent()._getInstructionType();

            if (eParentType === 15 /* k_VariableDeclInstruction */) {
                return (this.getParent())._getFullName();
            } else {
                return (this.getParent())._getFullName();
            }
        };

        VariableTypeInstruction.prototype._getVarDeclName = function () {
            if (!this.isFromVariableDecl()) {
                return "";
            }

            var eParentType = this.getParent()._getInstructionType();

            if (eParentType === 15 /* k_VariableDeclInstruction */) {
                return (this.getParent()).getName();
            } else {
                return (this.getParent())._getVarDeclName();
            }
        };

        VariableTypeInstruction.prototype._getTypeDeclName = function () {
            if (!this.isFromVariableDecl()) {
                return "";
            }

            var eParentType = this.getParent()._getInstructionType();

            if (eParentType === 15 /* k_VariableDeclInstruction */) {
                return (this.getParent()).getName();
            } else {
                return (this.getParent())._getTypeDeclName();
            }
        };

        VariableTypeInstruction.prototype._getParentVarDecl = function () {
            if (!this.isFromVariableDecl()) {
                return null;
            }

            var eParentType = this.getParent()._getInstructionType();

            if (eParentType === 15 /* k_VariableDeclInstruction */) {
                return this.getParent();
            } else {
                return (this.getParent())._getParentVarDecl();
            }
        };

        VariableTypeInstruction.prototype._getParentContainer = function () {
            if (!this.isFromVariableDecl() || !this._isTypeOfField()) {
                return null;
            }

            var pContainerType = this._getParentVarDecl().getParent();
            if (!pContainerType.isFromVariableDecl()) {
                return null;
            }

            return pContainerType._getParentVarDecl();
        };

        VariableTypeInstruction.prototype._getMainVariable = function () {
            if (!this.isFromVariableDecl()) {
                return null;
            }

            if (this._isTypeOfField()) {
                return (this.getParent().getParent())._getMainVariable();
            } else {
                return (this._getParentVarDecl());
            }
        };

        VariableTypeInstruction.prototype._getMainPointer = function () {
            if (isNull(this._pMainPointIndex)) {
                if (isNull(this.getPointer())) {
                    this._pMainPointIndex = this._getParentVarDecl();
                } else {
                    this._pMainPointIndex = this._getUpPointer().getType()._getMainPointer();
                }
            }

            return this._pMainPointIndex;
        };

        VariableTypeInstruction.prototype._getUpPointer = function () {
            return this._pUpPointIndex;
        };

        VariableTypeInstruction.prototype._getDownPointer = function () {
            return this._pDownPointIndex;
        };

        VariableTypeInstruction.prototype._getAttrOffset = function () {
            return this._pAttrOffset;
        };

        //-----------------------------------------------------------------//
        //----------------------------SYSTEM-------------------------------//
        //-----------------------------------------------------------------//
        VariableTypeInstruction.prototype.wrap = function () {
            var pCloneType = new VariableTypeInstruction();
            pCloneType.pushType(this);

            return pCloneType;
        };

        VariableTypeInstruction.prototype.clone = function (pRelationMap) {
            if (typeof pRelationMap === "undefined") { pRelationMap = {}; }
            if (isDef(pRelationMap[this._getInstructionID()])) {
                return pRelationMap[this._getInstructionID()];
            }

            if (this._pParentInstruction === null || !isDef(pRelationMap[this._pParentInstruction._getInstructionID()]) || pRelationMap[this._pParentInstruction._getInstructionID()] === this._pParentInstruction) {
                //pRelationMap[this._getInstructionID()] = this;
                return this;
            }

            var pClone = _super.prototype.clone.call(this, pRelationMap);

            pClone.pushType(this._pSubType.clone(pRelationMap));
            if (!isNull(this._pUsageList)) {
                for (var i = 0; i < this._pUsageList.length; i++) {
                    pClone.addUsage(this._pUsageList[i]);
                }
            }

            pClone._canWrite(this._isWritable);
            pClone._canRead(this._isReadable);
            pClone._setCloneHash(this._sHash, this._sStrongHash);
            pClone.setPadding(this.getPadding());

            if (this._isArray) {
                this._setCloneArrayIndex(this._pArrayElementType.clone(pRelationMap), this._pArrayIndexExpr.clone(pRelationMap), this._iLength);
            }

            if (this._isPointer) {
                var pClonePointerList = null;
                if (!isNull(this._pPointerList)) {
                    pClonePointerList = new Array(this._pPointerList.length);
                    var pDownPointer = pClone._getParentVarDecl();

                    for (var i = 0; i < this._pPointerList.length; i++) {
                        pClonePointerList[i] = this._pPointerList[i].clone(pRelationMap);

                        if (i > 0) {
                            (pClonePointerList[i - 1].getType())._setUpDownPointers(pClonePointerList[i], pDownPointer);
                            pDownPointer = pClonePointerList[i - 1];
                        } else {
                            pClonePointerList[0].getType()._setUpDownPointers(null, pDownPointer);
                        }
                    }

                    pClonePointerList[pClonePointerList.length - 1].getType()._setUpDownPointers(null, pDownPointer);
                }

                this._setClonePointeIndexes(this.getPointDim(), pClonePointerList);
            }

            if (!isNull(this._pFieldDeclMap)) {
                var sFieldName = "";
                var pCloneFieldMap = {};

                for (sFieldName in this._pFieldDeclMap) {
                    pCloneFieldMap[sFieldName] = this._pFieldDeclMap[sFieldName].clone(pRelationMap);
                }

                this._setCloneFields(pCloneFieldMap);
            }

            return pClone;
        };

        VariableTypeInstruction.prototype.blend = function (pType, eMode) {
            if (this === pType) {
                return this;
            }

            if (eMode === 4 /* k_Global */) {
                return null;
            }

            if (this.isComplex() !== pType.isComplex() || (this.isNotBaseArray() !== pType.isNotBaseArray()) || (this.isPointer() !== pType.isPointer())) {
                return null;
            }

            if (this.isNotBaseArray() || this.getLength() === Instruction.UNDEFINE_LENGTH || this.getLength() !== pType.getLength()) {
                return null;
            }

            var pBlendBaseType = this.getBaseType().blend(pType.getBaseType(), eMode);
            if (isNull(pBlendBaseType)) {
                return null;
            }

            var pBlendType = new VariableTypeInstruction();
            pBlendType.pushType(pBlendBaseType);

            if (this.isNotBaseArray()) {
                var iLength = this.getLength();
                var pLengthExpr = new IntInstruction();
                pLengthExpr.setValue(iLength);
                pBlendType.addArrayIndex(pLengthExpr);
            }

            return pBlendType;
        };

        VariableTypeInstruction.prototype._setCloneHash = function (sHash, sStrongHash) {
            this._sHash = sHash;
            this._sStrongHash = sStrongHash;
        };

        VariableTypeInstruction.prototype._setCloneArrayIndex = function (pElementType, pIndexExpr, iLength) {
            this._isArray = true;
            this._pArrayElementType = pElementType;
            this._pArrayIndexExpr = pIndexExpr;
            this._iLength = iLength;
        };

        VariableTypeInstruction.prototype._setClonePointeIndexes = function (nDim, pPointerList) {
            this._isPointer = true;
            this._nPointDim = nDim;
            this._pPointerList = pPointerList;
            if (!isNull(this._pPointerList)) {
                this._pUpPointIndex = this._pPointerList[0];
            }
        };

        VariableTypeInstruction.prototype._setCloneFields = function (pFieldMap) {
            this._pFieldDeclMap = pFieldMap;
        };

        VariableTypeInstruction.prototype._setUpDownPointers = function (pUpPointIndex, pDownPointIndex) {
            this._pUpPointIndex = pUpPointIndex;
            this._pDownPointIndex = pDownPointIndex;
        };

        VariableTypeInstruction.prototype.calcHash = function () {
            var sHash = this.getSubType().getHash();

            if (this._isArray) {
                sHash += "[";

                var iLength = this.getLength();

                if (iLength === Instruction.UNDEFINE_LENGTH) {
                    sHash += "undef";
                } else {
                    sHash += iLength.toString();
                }

                sHash += "]";
            }

            this._sHash = sHash;
        };

        VariableTypeInstruction.prototype.calcStrongHash = function () {
            var sStrongHash = this.getSubType().getStrongHash();

            if (this._isArray) {
                sStrongHash += "[";

                var iLength = this.getLength();

                if (iLength === Instruction.UNDEFINE_LENGTH) {
                    sStrongHash += "undef";
                } else {
                    sStrongHash += iLength.toString();
                }

                sStrongHash += "]";
            }
            if (this.isPointer()) {
                for (var i = 0; i < this.getPointDim(); i++) {
                    sStrongHash = "@" + sStrongHash;
                }
            }

            this._sStrongHash = sStrongHash;
        };

        VariableTypeInstruction.prototype.generateSubDeclList = function () {
            if (!this.canHaveSubDecls()) {
                return;
            }

            var pDeclList = [];
            var i = 0;

            if (!isNull(this._pAttrOffset)) {
                pDeclList.push(this._pAttrOffset);
            }

            if (this.isPointer()) {
                if (isNull(this._getUpPointer())) {
                    this.initializePointers();
                }

                for (i = 0; i < this._pPointerList.length; i++) {
                    pDeclList.push(this._pPointerList[i]);
                }
            }

            if (this.isComplex()) {
                var pFieldNameList = this.getFieldNameList();

                for (i = 0; i < pFieldNameList.length; i++) {
                    var pField = this.getField(pFieldNameList[i]);
                    var pFieldSubDeclList = pField.getSubVarDecls();

                    if (!isNull(pFieldSubDeclList)) {
                        for (var j = 0; j < pFieldSubDeclList.length; j++) {
                            pDeclList.push(pFieldSubDeclList[j]);
                        }
                    }
                }
            }

            this._pSubDeclList = pDeclList;
        };

        VariableTypeInstruction.prototype.canHaveSubDecls = function () {
            return this.isComplex() || this.isPointer() || !isNull(this._pAttrOffset);
        };
        return VariableTypeInstruction;
    })(Instruction);

    
    return VariableTypeInstruction;
});
//# sourceMappingURL=VariableTypeInstruction.js.map
