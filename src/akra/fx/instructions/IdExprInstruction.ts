/// <reference path="ExprInstruction.ts" />
/// <reference path="IdInstruction.ts" />

module akra.fx.instructions {
	export class IdExprInstruction extends ExprInstruction implements IAFXIdExprInstruction {
		protected  _pType: IAFXVariableTypeInstruction = null;

		private _bToFinalCode: boolean = true;
		private _isInPassUnifoms: boolean = false;
		private _isInPassForeigns: boolean = false;

		_isVisible(): boolean {
			return this._pInstructionList[0]._isVisible();
		}

		constructor() {
			super();
			this._pInstructionList = [null];
			this._eInstructionType = EAFXInstructionTypes.k_IdExprInstruction;
		}

		_getType(): IAFXVariableTypeInstruction {
			if (!isNull(this._pType)) {
				return this._pType;
			}
			else {
				var pVar: IdInstruction = <IdInstruction>this._pInstructionList[0];
				this._pType = (<IAFXVariableDeclInstruction>pVar._getParent())._getType();
				return this._pType;
			}
		}

		_isConst(): boolean {
			return this._getType()._isConst();
		}

		_evaluate(): boolean {
			if (this._getType()._isForeign()) {
				var pVal = this._getType()._getParentVarDecl()._getValue();
				if (!isNull(pVal)) {
					this._pLastEvalResult = pVal;
					return true;
				}
			}

			return false;
		}

		_prepareFor(eUsedMode: EFunctionType): void {
			if (!this._isVisible()) {
				this._bToFinalCode = false;
			}

			if (eUsedMode === EFunctionType.k_PassFunction) {
				var pVarDecl: IAFXVariableDeclInstruction = <IAFXVariableDeclInstruction>this._getInstructions()[0]._getParent();
				if (!this._getType()._isUnverifiable() && isNull(pVarDecl._getParent())) {
					if (pVarDecl._getType()._isForeign()) {
						this._isInPassForeigns = true;
					}
					else {
						this._isInPassUnifoms = true;
					}
				}
			}
		}

		_toFinalCode(): string {
			var sCode: string = "";
			if (this._bToFinalCode) {
				if (this._isInPassForeigns || this._isInPassUnifoms) {
					var pVarDecl: IAFXVariableDeclInstruction = <IAFXVariableDeclInstruction>this._getInstructions()[0]._getParent();
					if (this._isInPassForeigns) {
						sCode += "foreigns[\"" + pVarDecl._getNameIndex() + "\"]";
					}
					else {
						sCode += "uniforms[\"" + pVarDecl._getNameIndex() + "\"]";
					}
				}
				else {
					sCode += this._getInstructions()[0]._toFinalCode();
				}
			}
			return sCode;
		}

		_clone(pRelationMap?: IAFXInstructionMap): IAFXIdExprInstruction {
			if (this._getType()._isSampler()) {
				//TODO: Need fix for shaders used as functions. Need use relation map.
				return this;
			}
			return <IAFXIdExprInstruction>super._clone(pRelationMap);
		}

		_addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
			eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			if (!this._getType()._isFromVariableDecl()) {
				return;
			}

			var pInfo: IAFXTypeUseInfoContainer = null;
			pInfo = pUsedDataCollector[this._getType()._getInstructionID()];

			if (!isDef(pInfo)) {
				pInfo = <IAFXTypeUseInfoContainer>{
					type: this._getType(),
					isRead: false,
					isWrite: false,
					numRead: 0,
					numWrite: 0,
					numUsed: 0
				}

				pUsedDataCollector[this._getType()._getInstructionID()] = pInfo;
			}

			if (eUsedMode !== EVarUsedMode.k_Write && eUsedMode !== EVarUsedMode.k_Undefined) {
				pInfo.isRead = true;
				pInfo.numRead++;
			}

			if (eUsedMode === EVarUsedMode.k_Write || eUsedMode === EVarUsedMode.k_ReadWrite) {
				pInfo.isWrite = true;
				pInfo.numWrite++;
			}

			pInfo.numUsed++;
		}
	}
}
