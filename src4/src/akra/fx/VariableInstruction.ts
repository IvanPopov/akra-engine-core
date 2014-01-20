/// <reference path="../idl/IAFXInstruction.ts" />
/// <reference path="../webgl/webgl.ts" />

/// <reference path="../stringUtils/StringDictionary.ts" />

/// <reference path="DeclInstruction.ts" />
/// <reference path="Effect.ts" />
/// <reference path="DeclInstruction.ts" />
/// <reference path="IdInstruction.ts" />
/// <reference path="PostfixPointInstruction.ts" />
/// <reference path="ExtractExprInstruction.ts" />
/// <reference path="VariableTypeInstruction.ts" />

module akra.fx {
	import StringDictionary = stringUtils.StringDictionary;

	export class VariableDeclInstruction extends DeclInstruction implements IAFXVariableDeclInstruction {
		private _isVideoBuffer: boolean = null;
		private _pVideoBufferSampler: IAFXVariableDeclInstruction = null;
		private _pVideoBufferHeader: IAFXVariableDeclInstruction = null;
		private _pFullNameExpr: IAFXExprInstruction = null;
		private _bDefineByZero: boolean = false;
		private _pSubDeclList: IAFXVariableDeclInstruction[] = null;
		private _bShaderOutput: boolean = false;

		private _pAttrOffset: IAFXVariableDeclInstruction = null;
		private _pAttrExtractionBlock: IAFXInstruction = null;

		private _pValue: any = null;
		private _pDefaultValue: any = null;

		private _bLockInitializer: boolean = false;

		private _iNameIndex: uint = 0;
		static pShaderVarNamesGlobalDictionary: StringDictionary = new StringDictionary();
		static _getIndex(sName: string): uint {
			return VariableDeclInstruction.pShaderVarNamesGlobalDictionary.add(sName);
		}
		/**
		 * Represent type var_name [= init_expr]
		 * EMPTY_OPERATOR VariableTypeInstruction IdInstruction InitExprInstruction
		 */
		constructor() {
			super();
			this._pInstructionList = [null, null, null];
			this._eInstructionType = EAFXInstructionTypes.k_VariableDeclInstruction;
		}

		hasInitializer(): boolean {
			return this._nInstructions === 3 && !isNull(this.getInitializeExpr());
		}

		getInitializeExpr(): IAFXInitExprInstruction {
			return <IAFXInitExprInstruction>this.getInstructions()[2];
		}

		hasConstantInitializer(): boolean {
			return this.hasInitializer() && this.getInitializeExpr().isConst();
		}

		lockInitializer(): void {
			this._bLockInitializer = true;
		}

		unlockInitializer(): void {
			this._bLockInitializer = false;
		}

		getDefaultValue(): any {
			return this._pDefaultValue;
		}

		prepareDefaultValue(): void {
			this.getInitializeExpr().evaluate();
			this._pDefaultValue = this.getInitializeExpr().getEvalValue();
		}

		getValue(): any {
			return this._pValue;
		}

		setValue(pValue: any): any {
			this._pValue = pValue;

			if (this.getType().isForeign()) {
				this.setRealName(pValue);
			}
		}

		getType(): IAFXVariableTypeInstruction {
			return <IAFXVariableTypeInstruction>this._pInstructionList[0];
		}

		setType(pType: IAFXVariableTypeInstruction): void {
			this._pInstructionList[0] = <IAFXVariableTypeInstruction>pType;
			pType.setParent(this);

			if (this._nInstructions === 0) {
				this._nInstructions = 1;
			}
		}

		setName(sName: string): void {
			var pName: IAFXIdInstruction = new IdInstruction();
			pName.setName(sName);
			pName.setParent(this);

			this._pInstructionList[1] = <IAFXIdInstruction>pName;

			if (this._nInstructions < 2) {
				this._nInstructions = 2;
			}
		}

		setRealName(sRealName: string): void {
			this.getNameId().setRealName(sRealName);
		}

		setVideoBufferRealName(sSampler: string, sHeader: string): void {
			if (!this.isVideoBuffer()) {
				return;
			}

			this._getVideoBufferSampler().setRealName(sSampler);
			this._getVideoBufferHeader().setRealName(sHeader);
		}

		getName(): string {
			return (<IAFXIdInstruction>this._pInstructionList[1]).getName();
		}

		getRealName(): string {
			return (<IAFXIdInstruction>this._pInstructionList[1]).getRealName();
		}

		getNameId(): IAFXIdInstruction {
			return <IAFXIdInstruction>this._pInstructionList[1];
		}

		isUniform(): boolean {
			return this.getType().hasUsage("uniform");
		}

		isField(): boolean {
			if (isNull(this.getParent())) {
				return false;
			}

			var eParentType: EAFXInstructionTypes = this.getParent()._getInstructionType();
			if (eParentType === EAFXInstructionTypes.k_VariableTypeInstruction ||
				eParentType === EAFXInstructionTypes.k_ComplexTypeInstruction ||
				eParentType === EAFXInstructionTypes.k_SystemTypeInstruction) {
				return true;
			}

			return false;
		}

		isPointer(): boolean {
			return this.getType().isPointer();
		}

		isVideoBuffer(): boolean {
			if (isNull(this._isVideoBuffer)) {
				this._isVideoBuffer = this.getType().isStrongEqual(Effect.getSystemType("video_buffer"));
			}

			return this._isVideoBuffer;
		}

		isSampler(): boolean {
			return this.getType().isSampler();
		}

		getSubVarDecls(): IAFXVariableDeclInstruction[] {
			return this.getType().getSubVarDecls();
		}

		isDefinedByZero(): boolean {
			return this._bDefineByZero;
		}

		defineByZero(isDefine: boolean): void {
			this._bDefineByZero = isDefine;
		}

		toFinalCode(): string {
			if (this._isShaderOutput()) {
				return "";
			}
			var sCode: string = "";

			if (this.isVideoBuffer()) {
				this._getVideoBufferHeader().lockInitializer();

				sCode = this._getVideoBufferHeader().toFinalCode();
				sCode += ";\n";
				sCode += this._getVideoBufferSampler().toFinalCode();

				this._getVideoBufferHeader().unlockInitializer();
			}
			else {
				sCode = this.getType().toFinalCode();
				sCode += " " + this.getNameId().toFinalCode();

				if (this.getType().isNotBaseArray()) {
					var iLength: uint = this.getType().getLength();
					if (webgl.ANGLE && iLength === 1 && this.getType().isComplex()) {
						sCode += "[" + 2 + "]";
					}
					else {
						sCode += "[" + iLength + "]";
					}
				}

				if (this.hasInitializer() &&
					!this.isSampler() &&
					!this.isUniform() &&
					!this._bLockInitializer) {
					sCode += "=" + this.getInitializeExpr().toFinalCode();
				}
			}

			return sCode;
		}

		_markAsVarying(bValue: boolean): void {
			this.getNameId()._markAsVarying(bValue);
		}

		_markAsShaderOutput(isShaderOutput: boolean): void {
			this._bShaderOutput = isShaderOutput;
		}

		_isShaderOutput(): boolean {
			return this._bShaderOutput;
		}

		_setAttrExtractionBlock(pCodeBlock: IAFXInstruction): void {
			this._pAttrExtractionBlock = pCodeBlock;
		}

		_getAttrExtractionBlock(): IAFXInstruction {
			return this._pAttrExtractionBlock;
		}

		_getNameIndex(): uint {
			return this._iNameIndex || (this._iNameIndex = VariableDeclInstruction.pShaderVarNamesGlobalDictionary.add(this.getRealName()));
		}

		_getFullNameExpr(): IAFXExprInstruction {
			if (!isNull(this._pFullNameExpr)) {
				return this._pFullNameExpr;
			}

			if (!this.isField() ||
				!(<IAFXVariableTypeInstruction>this.getParent())._getParentVarDecl().isVisible()) {
				this._pFullNameExpr = new IdExprInstruction();
				this._pFullNameExpr.push(this.getNameId(), false);
			}
			else {
				var pMainVar: IAFXVariableDeclInstruction = <IAFXVariableDeclInstruction>this.getType()._getParentContainer();

				if (isNull(pMainVar)) {
					return null;
				}

				var pMainExpr: IAFXExprInstruction = pMainVar._getFullNameExpr();
				if (isNull(pMainExpr)) {
					return null;
				}
				var pFieldExpr: IAFXExprInstruction = new IdExprInstruction();
				pFieldExpr.push(this.getNameId(), false);

				this._pFullNameExpr = new PostfixPointInstruction();
				this._pFullNameExpr.push(pMainExpr, false);
				this._pFullNameExpr.push(pFieldExpr, false);
				this._pFullNameExpr.setType(this.getType());
			}

			return this._pFullNameExpr;
		}

		_getFullName(): string {
			if (this.isField() &&
				(<IAFXVariableTypeInstruction>this.getParent())._getParentVarDecl().isVisible()) {

				var sName: string = "";
				var eParentType: EAFXInstructionTypes = this.getParent()._getInstructionType();

				if (eParentType === EAFXInstructionTypes.k_VariableTypeInstruction) {
					sName = (<IAFXVariableTypeInstruction>this.getParent())._getFullName();
				}

				sName += "." + this.getName();

				return sName;
			}
			else {
				return this.getName();
			}
		}

		_getVideoBufferSampler(): IAFXVariableDeclInstruction {
			if (!this.isVideoBuffer()) {
				return null;
			}

			if (isNull(this._pVideoBufferSampler)) {
				this._pVideoBufferSampler = new VariableDeclInstruction();
				var pType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
				var pId: IAFXIdInstruction = new IdInstruction();

				pType.pushType(Effect.getSystemType("sampler2D"));
				pType.addUsage("uniform");
				pId.setName(this.getName() + "_sampler");

				this._pVideoBufferSampler.push(pType, true);
				this._pVideoBufferSampler.push(pId, true);
			}

			return this._pVideoBufferSampler;
		}

		_getVideoBufferHeader(): IAFXVariableDeclInstruction {
			if (!this.isVideoBuffer()) {
				return null;
			}

			if (isNull(this._pVideoBufferHeader)) {
				this._pVideoBufferHeader = new VariableDeclInstruction();
				var pType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
				var pId: IAFXIdInstruction = new IdInstruction();
				var pExtarctExpr: ExtractExprInstruction = new ExtractExprInstruction();

				pType.pushType(Effect.getSystemType("video_buffer_header"));
				pId.setName(this.getName() + "_header");

				this._pVideoBufferHeader.push(pType, true);
				this._pVideoBufferHeader.push(pId, true);
				this._pVideoBufferHeader.push(pExtarctExpr, true);

				pExtarctExpr.initExtractExpr(pType, null, this, "", null);
			}

			return this._pVideoBufferHeader;
		}

		_getVideoBufferInitExpr(): IAFXInitExprInstruction {
			if (!this.isVideoBuffer()) {
				return null;
			}

			return this._getVideoBufferHeader().getInitializeExpr();
		}

		_setCollapsed(bValue: boolean): void {
			this.getType()._setCollapsed(bValue);
		}

		_isCollapsed(): boolean {
			return this.getType()._isCollapsed();
		}

		clone(pRelationMap?: IAFXInstructionMap): IAFXVariableDeclInstruction {
			return <IAFXVariableDeclInstruction>super.clone(pRelationMap);
		}

		blend(pVariableDecl: IAFXVariableDeclInstruction, eMode: EAFXBlendMode): IAFXVariableDeclInstruction {
			var pBlendType: IAFXVariableTypeInstruction = this.getType().blend(pVariableDecl.getType(), eMode);

			if (isNull(pBlendType)) {
				return null;
			}

			var pBlendVar: IAFXVariableDeclInstruction = new VariableDeclInstruction();
			var pId: IAFXIdInstruction = new IdInstruction();

			pId.setName(this.getNameId().getName());
			pId.setRealName(this.getNameId().getRealName());

			pBlendVar.setSemantic(this.getSemantic());
			pBlendVar.push(pBlendType, true);
			pBlendVar.push(pId, true);

			return pBlendVar;
		}
	}
}
