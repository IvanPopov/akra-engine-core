/// <reference path="Instruction.ts" />
/// <reference path="ExprInstruction.ts" />
/// <reference path="../Effect.ts" />

module akra.fx.instructions {
	export class InitExprInstruction extends ExprInstruction implements IAFXInitExprInstruction {
		private _pConstructorType: IAFXTypeInstruction = null;
		private _bIsConst: boolean = null;
		private _isArray: boolean = false;

		constructor() {
			super();
			this._pInstructionList = [];
			this._eInstructionType = EAFXInstructionTypes.k_InitExprInstruction;
		}

		_toFinalCode(): string {
			var sCode: string = "";

			if (!isNull(this._pConstructorType)) {
				sCode += this._pConstructorType._toFinalCode();
			}
			sCode += "(";

			for (var i: uint = 0; i < this._nInstructions; i++) {
				sCode += this._getInstructions()[i]._toFinalCode();

				if (i !== this._nInstructions - 1) {
					sCode += ",";
				}
			}

			sCode += ")";

			return sCode;
		}

		_isConst(): boolean {
			if (isNull(this._bIsConst)) {
				var pInstructionList: IAFXExprInstruction[] = <IAFXExprInstruction[]>this._getInstructions();

				for (var i: uint = 0; i < pInstructionList.length; i++) {
					if (!pInstructionList[i]._isConst()) {
						this._bIsConst = false;
						break;
					}
				}

				this._bIsConst = isNull(this._bIsConst) ? true : false;
			}

			return this._bIsConst;
		}

		_optimizeForVariableType(pType: IAFXVariableTypeInstruction): boolean {
			if ((pType._isNotBaseArray() && pType._getScope() === 0) ||
				(pType._isArray() && this._nInstructions > 1)) {


				if (pType._getLength() === Instruction.UNDEFINE_LENGTH ||
					(pType._isNotBaseArray() && this._nInstructions !== pType._getLength()) ||
					(!pType._isNotBaseArray() && this._nInstructions !== pType._getBaseType()._getLength())) {

					return false;
				}

				if (pType._isNotBaseArray()) {
					this._isArray = true;
				}

				var pArrayElementType: IAFXVariableTypeInstruction = pType._getArrayElementType();
				var pTestedInstruction: IAFXExprInstruction = null;
				var isOk: boolean = false;

				for (var i: uint = 0; i < this._nInstructions; i++) {
					pTestedInstruction = (<IAFXExprInstruction>this._getInstructions()[i]);

					if (pTestedInstruction._getInstructionType() === EAFXInstructionTypes.k_InitExprInstruction) {
						isOk = (<IAFXInitExprInstruction>pTestedInstruction)._optimizeForVariableType(pArrayElementType);
						if (!isOk) {
							return false;
						}
					}
					else {
						if (Effect.isSamplerType(pArrayElementType)) {
							if (pTestedInstruction._getInstructionType() !== EAFXInstructionTypes.k_SamplerStateBlockInstruction) {
								return false;
							}
						}
						else {
							isOk = pTestedInstruction._getType()._isEqual(pArrayElementType);
							if (!isOk) {
								return false;
							}
						}
					}
				}

				this._pConstructorType = pType._getBaseType();
				return true;
			}
			else {
				var pFirstInstruction: IAFXExprInstruction = <IAFXExprInstruction>this._getInstructions()[0];

				if (this._nInstructions === 1 &&
					pFirstInstruction._getInstructionType() !== EAFXInstructionTypes.k_InitExprInstruction) {

					if (Effect.isSamplerType(pType)) {
						if (pFirstInstruction._getInstructionType() === EAFXInstructionTypes.k_SamplerStateBlockInstruction) {
							return true;
						}
						else {
							return false;
						}
					}

					if (pFirstInstruction._getType()._isEqual(pType)) {
						return true;
					}
					else {
						return false;
					}
				}
				else if (this._nInstructions === 1) {
					return false;
				}

				var pInstructionList: IAFXInitExprInstruction[] = <IAFXInitExprInstruction[]>this._getInstructions();
				var pFieldNameList: string[] = pType._getFieldNameList();

				for (var i: uint = 0; i < pInstructionList.length; i++) {
					var pFieldType: IAFXVariableTypeInstruction = pType._getFieldType(pFieldNameList[i]);
					if (!pInstructionList[i]._optimizeForVariableType(pFieldType)) {
						return false;
					}
				}

				this._pConstructorType = pType._getBaseType();
				return true;
			}
		}

		_evaluate(): boolean {
			if (!this._isConst()) {
				this._pLastEvalResult = null;
				return false;
			}

			var pRes: any = null;

			if (this._isArray) {
				pRes = new Array(this._nInstructions);

				for (var i: uint = 0; i < this._nInstructions; i++) {
					var pEvalInstruction = (<IAFXExprInstruction>this._getInstructions()[i]);

					if (pEvalInstruction._evaluate()) {
						pRes[i] = pEvalInstruction._getEvalValue();
					}
				}
			}
			else if (this._nInstructions === 1) {
				var pEvalInstruction = (<IAFXExprInstruction>this._getInstructions()[0]);
				pEvalInstruction._evaluate();
				pRes = pEvalInstruction._getEvalValue();
			}
			else {
				var pJSTypeCtor: any = Effect.getExternalType(this._pConstructorType);
				var pArguments: any[] = new Array(this._nInstructions);

				if (isNull(pJSTypeCtor)) {
					return false;
				}

				try {
					if (Effect.isScalarType(this._pConstructorType)) {
						var pTestedInstruction: IAFXExprInstruction = <IAFXExprInstruction>this._getInstructions()[1];
						if (this._nInstructions > 2 || !pTestedInstruction._evaluate()) {
							return false;
						}

						pRes = pJSTypeCtor(pTestedInstruction._getEvalValue());
					}
					else {
						for (var i: uint = 0; i < this._nInstructions; i++) {
							var pTestedInstruction: IAFXExprInstruction = <IAFXExprInstruction>this._getInstructions()[i];

							if (pTestedInstruction._evaluate()) {
								pArguments[i] = pTestedInstruction._getEvalValue();
							}
							else {
								return false;
							}
						}

						pRes = new pJSTypeCtor;
						pRes.set.apply(pRes, pArguments);
					}
				}
				catch (e) {
					return false;
				}
			}

			this._pLastEvalResult = pRes;

			return true;
		}
	}
}
