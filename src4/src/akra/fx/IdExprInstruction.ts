/// <reference path="ExprInstruction.ts" />
/// <reference path="IdInstruction.ts" />

module akra.fx {
	export class IdExprInstruction extends ExprInstruction implements IAFXIdExprInstruction {
		protected  _pType: IAFXVariableTypeInstruction = null;

		private _bToFinalCode: boolean = true;
		private _isInPassUnifoms: boolean = false;
		private _isInPassForeigns: boolean = false;

		isVisible(): boolean {
			return this._pInstructionList[0].isVisible();
		}

		constructor() {
			super();
			this._pInstructionList = [null];
			this._eInstructionType = EAFXInstructionTypes.k_IdExprInstruction;
		}

		getType(): IAFXVariableTypeInstruction {
			if (!isNull(this._pType)) {
				return this._pType;
			}
			else {
				var pVar: IdInstruction = <IdInstruction>this._pInstructionList[0];
				this._pType = (<IAFXVariableDeclInstruction>pVar.getParent()).getType();
				return this._pType;
			}
		}

		isConst(): boolean {
			return this.getType().isConst();
		}

		evaluate(): boolean {
			if (this.getType().isForeign()) {
				var pVal = this.getType()._getParentVarDecl().getValue();
				if (!isNull(pVal)) {
					this._pLastEvalResult = pVal;
					return true;
				}
			}

			return false;
		}

		prepareFor(eUsedMode: EFunctionType): void {
			if (!this.isVisible()) {
				this._bToFinalCode = false;
			}

			if (eUsedMode === EFunctionType.k_PassFunction) {
				var pVarDecl: IAFXVariableDeclInstruction = <IAFXVariableDeclInstruction>this.getInstructions()[0].getParent();
				if (!this.getType()._isUnverifiable() && isNull(pVarDecl.getParent())) {
					if (pVarDecl.getType().isForeign()) {
						this._isInPassForeigns = true;
					}
					else {
						this._isInPassUnifoms = true;
					}
				}
			}
		}

		toFinalCode(): string {
			var sCode: string = "";
			if (this._bToFinalCode) {
				if (this._isInPassForeigns || this._isInPassUnifoms) {
					var pVarDecl: IAFXVariableDeclInstruction = <IAFXVariableDeclInstruction>this.getInstructions()[0].getParent();
					if (this._isInPassForeigns) {
						sCode += "foreigns[\"" + pVarDecl._getNameIndex() + "\"]";
					}
					else {
						sCode += "uniforms[\"" + pVarDecl._getNameIndex() + "\"]";
					}
				}
				else {
					sCode += this.getInstructions()[0].toFinalCode();
				}
			}
			return sCode;
		}

		clone(pRelationMap?: IAFXInstructionMap): IAFXIdExprInstruction {
			return <IAFXIdExprInstruction>super.clone(pRelationMap);
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
			eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			if (!this.getType().isFromVariableDecl()) {
				return;
			}

			var pInfo: IAFXTypeUseInfoContainer = null;
			pInfo = pUsedDataCollector[this.getType()._getInstructionID()];

			if (!isDef(pInfo)) {
				pInfo = <IAFXTypeUseInfoContainer>{
					type: this.getType(),
					isRead: false,
					isWrite: false,
					numRead: 0,
					numWrite: 0,
					numUsed: 0
				}

				pUsedDataCollector[this.getType()._getInstructionID()] = pInfo;
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
