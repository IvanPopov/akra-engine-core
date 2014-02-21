/// <reference path="ExprInstruction.ts" />
/// <reference path="SystemFunctionInstruction.ts" />

module akra.fx.instructions {

	/**
	 * Respresnt system_func(arg1,..., argn)
	 * EMPTY_OPERATOR SimpleInstruction ... SimpleInstruction 
	 */
	export class SystemCallInstruction extends ExprInstruction {
		private _pSystemFunction: SystemFunctionInstruction = null;
		private _pSamplerDecl: IAFXVariableDeclInstruction = null;

		constructor() {
			super();
			this._pInstructionList = null;
			this._eInstructionType = EAFXInstructionTypes.k_SystemCallInstruction;
		}

		toFinalCode(): string {
			if (!isNull(this._pSamplerDecl) && this._pSamplerDecl.isDefinedByZero()) {
				return "vec4(0.)";
			}

			var sCode: string = "";

			for (var i: uint = 0; i < this.getInstructions().length; i++) {
				sCode += this.getInstructions()[i].toFinalCode();
			}

			return sCode;
		}

		setSystemCallFunction(pFunction: IAFXFunctionDeclInstruction): void {
			this._pSystemFunction = <SystemFunctionInstruction>pFunction;
			this.setType(pFunction.getType());
		}

		setInstructions(pInstructionList: IAFXInstruction[]): void {
			this._pInstructionList = pInstructionList;
			this._nInstructions = pInstructionList.length;
			for (var i: uint = 0; i < pInstructionList.length; i++) {
				pInstructionList[i].setParent(this);
			}
		}

		fillByArguments(pArguments: IAFXInstruction[]): void {
			this.setInstructions(this._pSystemFunction.closeArguments(pArguments));
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
			eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var pInstructionList: IAFXAnalyzedInstruction[] = <IAFXAnalyzedInstruction[]>this.getInstructions();
			for (var i: uint = 0; i < this._nInstructions; i++) {
				if (pInstructionList[i]._getInstructionType() !== EAFXInstructionTypes.k_SimpleInstruction) {
					pInstructionList[i].addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
					if ((<IAFXExprInstruction>pInstructionList[i]).getType().isSampler()) {
						this._pSamplerDecl = (<IAFXExprInstruction>pInstructionList[i]).getType()._getParentVarDecl();
					}
				}
			}
		}

		clone(pRelationMap?: IAFXInstructionMap): SystemCallInstruction {
			var pClone: SystemCallInstruction = <SystemCallInstruction>super.clone(pRelationMap);

			pClone.setSystemCallFunction(this._pSystemFunction);

			return pClone;
		}

	}
}

