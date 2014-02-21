/// <reference path="ExprInstruction.ts" />

module akra.fx.instructions {

	/**
	 * Represent @ Expr
	 * @ Instruction
	 */
	export class PrimaryExprInstruction extends ExprInstruction {
		constructor() {
			super();
			this._pInstructionList = [null];
			this._eInstructionType = EAFXInstructionTypes.k_PrimaryExprInstruction;
		}

		toFinalCode(): string {
			var sCode: string = "";

			sCode += this.getInstructions()[0].toFinalCode();

			return sCode;
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
			eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var pPointerType: IAFXVariableTypeInstruction = this.getType();
			var pInfo: IAFXTypeUseInfoContainer = pUsedDataCollector[pPointerType._getInstructionID()];

			if (!isDef(pInfo)) {
				pInfo = <IAFXTypeUseInfoContainer>{
					type: pPointerType,
					isRead: false,
					isWrite: false,
					numRead: 0,
					numWrite: 0,
					numUsed: 0
				}

				pUsedDataCollector[pPointerType._getInstructionID()] = pInfo;
			}

			if (eUsedMode === EVarUsedMode.k_Read) {
				pInfo.isRead = true;
				pInfo.numRead++;
			}
			else if (eUsedMode === EVarUsedMode.k_Write) {
				pInfo.isWrite = true;
				pInfo.numWrite++;
			}
			else if (eUsedMode === EVarUsedMode.k_ReadWrite) {
				pInfo.isRead = true;
				pInfo.isWrite = true;
				pInfo.numRead++;
				pInfo.numWrite++;
			}

			pInfo.numUsed++;
		}
	}
}

