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

		_toFinalCode(): string {
			if (!isNull(this._pSamplerDecl) && this._pSamplerDecl._isDefinedByZero()) {
				return "vec4(0.)";
			}

			var sCode: string = "";

			for (var i: uint = 0; i < this._getInstructions().length; i++) {
				sCode += this._getInstructions()[i]._toFinalCode();
			}

			return sCode;
		}

		setSystemCallFunction(pFunction: IAFXFunctionDeclInstruction): void {
			this._pSystemFunction = <SystemFunctionInstruction>pFunction;
			this._setType(pFunction._getType());
		}

		_setInstructions(pInstructionList: IAFXInstruction[]): void {
			this._pInstructionList = pInstructionList;
			this._nInstructions = pInstructionList.length;
			for (var i: uint = 0; i < pInstructionList.length; i++) {
				pInstructionList[i]._setParent(this);
			}
		}

		fillByArguments(pArguments: IAFXInstruction[]): void {
			this._setInstructions(this._pSystemFunction.closeArguments(pArguments));
		}

		_addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
			eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var pInstructionList: IAFXAnalyzedInstruction[] = <IAFXAnalyzedInstruction[]>this._getInstructions();
			for (var i: uint = 0; i < this._nInstructions; i++) {
				if (pInstructionList[i]._getInstructionType() !== EAFXInstructionTypes.k_SimpleInstruction) {
					pInstructionList[i]._addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
					if ((<IAFXExprInstruction>pInstructionList[i])._getType()._isSampler()) {
						this._pSamplerDecl = (<IAFXExprInstruction>pInstructionList[i])._getType()._getParentVarDecl();
					}
				}
			}
		}

		_clone(pRelationMap?: IAFXInstructionMap): SystemCallInstruction {
			var pClone: SystemCallInstruction = <SystemCallInstruction>super._clone(pRelationMap);

			pClone.setSystemCallFunction(this._pSystemFunction);

			return pClone;
		}

	}
}

