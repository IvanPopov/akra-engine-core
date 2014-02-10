/// <reference path="../idl/IAFXInstruction.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <referene path="Instruction.ts" />
    /// <referene path="VariableTypeInstruction.ts" />
    /// <referene path="VariableInstruction.ts" />
    /// <referene path="IdInstruction.ts" />
    (function (fx) {
        var SystemTypeInstruction = (function (_super) {
            __extends(SystemTypeInstruction, _super);
            function SystemTypeInstruction() {
                _super.call(this);
                this._sName = "";
                this._sRealName = "";
                this._pElementType = null;
                this._iLength = 1;
                this._iSize = null;
                this._pFieldDeclMap = null;
                this._isArray = false;
                this._isWritable = true;
                this._isReadable = true;
                this._pFieldNameList = null;
                this._pWrapVariableType = null;
                this._isBuiltIn = true;
                this._sDeclString = "";
                this._eInstructionType = 4 /* k_SystemTypeInstruction */;
                this._pWrapVariableType = new akra.fx.VariableTypeInstruction();
                this._pWrapVariableType.pushType(this);
            }
            SystemTypeInstruction.prototype._toDeclString = function () {
                return this._sDeclString;
            };

            SystemTypeInstruction.prototype.toFinalCode = function () {
                return this._sRealName;
            };

            SystemTypeInstruction.prototype.isBuiltIn = function () {
                return this._isBuiltIn;
            };

            SystemTypeInstruction.prototype.setBuiltIn = function (isBuiltIn) {
                this._isBuiltIn = isBuiltIn;
            };

            SystemTypeInstruction.prototype.setDeclString = function (sDecl) {
                this._sDeclString = sDecl;
            };

            //-----------------------------------------------------------------//
            //----------------------------SIMPLE TESTS-------------------------//
            //-----------------------------------------------------------------//
            SystemTypeInstruction.prototype.isBase = function () {
                return true;
            };

            SystemTypeInstruction.prototype.isArray = function () {
                return this._isArray;
            };

            SystemTypeInstruction.prototype.isNotBaseArray = function () {
                return false;
            };

            SystemTypeInstruction.prototype.isComplex = function () {
                return false;
            };

            SystemTypeInstruction.prototype.isEqual = function (pType) {
                return this.getHash() === pType.getHash();
            };

            SystemTypeInstruction.prototype.isStrongEqual = function (pType) {
                return this.getStrongHash() === pType.getStrongHash();
            };

            SystemTypeInstruction.prototype.isConst = function () {
                return false;
            };

            SystemTypeInstruction.prototype.isSampler = function () {
                return this.getName() === "sampler" || this.getName() === "sampler2D" || this.getName() === "samplerCUBE";
            };

            SystemTypeInstruction.prototype.isSamplerCube = function () {
                return this.getName() === "samplerCUBE";
            };

            SystemTypeInstruction.prototype.isSampler2D = function () {
                return this.getName() === "sampler" || this.getName() === "sampler2D";
            };

            SystemTypeInstruction.prototype.isWritable = function () {
                return this._isWritable;
            };

            SystemTypeInstruction.prototype.isReadable = function () {
                return this._isReadable;
            };

            SystemTypeInstruction.prototype._containArray = function () {
                return false;
            };

            SystemTypeInstruction.prototype._containSampler = function () {
                return false;
            };

            SystemTypeInstruction.prototype._containPointer = function () {
                return false;
            };

            SystemTypeInstruction.prototype._containComplexType = function () {
                return false;
            };

            //-----------------------------------------------------------------//
            //----------------------------SET BASE TYPE INFO-------------------//
            //-----------------------------------------------------------------//
            SystemTypeInstruction.prototype.setName = function (sName) {
                this._sName = sName;
            };

            SystemTypeInstruction.prototype.setRealName = function (sRealName) {
                this._sRealName = sRealName;
            };

            SystemTypeInstruction.prototype.setSize = function (iSize) {
                this._iSize = iSize;
            };

            SystemTypeInstruction.prototype._canWrite = function (isWritable) {
                this._isWritable = isWritable;
            };

            SystemTypeInstruction.prototype._canRead = function (isReadable) {
                this._isReadable = isReadable;
            };

            //-----------------------------------------------------------------//
            //---------------------------INIT API------------------------------//
            //-----------------------------------------------------------------//
            SystemTypeInstruction.prototype.addIndex = function (pType, iLength) {
                this._pElementType = pType;
                this._iLength = iLength;
                this._iSize = iLength * pType.getSize();
                this._isArray = true;
            };

            SystemTypeInstruction.prototype.addField = function (sFieldName, pType, isWrite, sRealFieldName) {
                if (typeof isWrite === "undefined") { isWrite = true; }
                if (typeof sRealFieldName === "undefined") { sRealFieldName = sFieldName; }
                var pField = new akra.fx.VariableDeclInstruction();
                var pFieldType = new akra.fx.VariableTypeInstruction();
                var pFieldId = new akra.fx.IdInstruction();

                pFieldType.pushType(pType);
                pFieldType._canWrite(isWrite);

                pFieldId.setName(sFieldName);
                pFieldId.setRealName(sRealFieldName);

                pField.push(pFieldType, true);
                pField.push(pFieldId, true);

                if (akra.isNull(this._pFieldDeclMap)) {
                    this._pFieldDeclMap = {};
                }

                this._pFieldDeclMap[sFieldName] = pField;

                if (akra.isNull(this._pFieldNameList)) {
                    this._pFieldNameList = [];
                }

                this._pFieldNameList.push(sFieldName);
            };

            //-----------------------------------------------------------------//
            //----------------------------GET TYPE INFO------------------------//
            //-----------------------------------------------------------------//
            SystemTypeInstruction.prototype.getName = function () {
                return this._sName;
            };

            SystemTypeInstruction.prototype.getRealName = function () {
                return this._sRealName;
            };

            SystemTypeInstruction.prototype.getHash = function () {
                return this._sRealName;
            };

            SystemTypeInstruction.prototype.getStrongHash = function () {
                return this._sName;
            };

            SystemTypeInstruction.prototype.getSize = function () {
                return this._iSize;
            };

            SystemTypeInstruction.prototype.getBaseType = function () {
                return this;
            };

            SystemTypeInstruction.prototype.getVariableType = function () {
                return this._pWrapVariableType;
            };

            SystemTypeInstruction.prototype.getArrayElementType = function () {
                return this._pElementType;
            };

            SystemTypeInstruction.prototype.getTypeDecl = function () {
                if (this.isBuiltIn()) {
                    return null;
                }

                return this.getParent();
            };

            SystemTypeInstruction.prototype.getLength = function () {
                return this._iLength;
            };

            SystemTypeInstruction.prototype.hasField = function (sFieldName) {
                return akra.isDef(this._pFieldDeclMap[sFieldName]);
            };

            SystemTypeInstruction.prototype.hasFieldWithSematic = function (sSemantic) {
                return false;
            };

            SystemTypeInstruction.prototype.hasAllUniqueSemantics = function () {
                return false;
            };

            SystemTypeInstruction.prototype.hasFieldWithoutSemantic = function () {
                return false;
            };

            SystemTypeInstruction.prototype.getField = function (sFieldName) {
                return akra.isDef(this._pFieldDeclMap[sFieldName]) ? this._pFieldDeclMap[sFieldName] : null;
            };

            SystemTypeInstruction.prototype.getFieldBySemantic = function (sSemantic) {
                return null;
            };

            SystemTypeInstruction.prototype.getFieldType = function (sFieldName) {
                return akra.isDef(this._pFieldDeclMap[sFieldName]) ? this._pFieldDeclMap[sFieldName].getType() : null;
            };

            SystemTypeInstruction.prototype.getFieldNameList = function () {
                return this._pFieldNameList;
            };

            //-----------------------------------------------------------------//
            //----------------------------SYSTEM-------------------------------//
            //-----------------------------------------------------------------//
            SystemTypeInstruction.prototype.clone = function (pRelationMap) {
                return this;
            };

            SystemTypeInstruction.prototype.blend = function (pType, eMode) {
                if (this.isStrongEqual(pType)) {
                    return this;
                }

                return null;
            };
            return SystemTypeInstruction;
        })(akra.fx.Instruction);
        fx.SystemTypeInstruction = SystemTypeInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=SystemTypeInstruction.js.map
