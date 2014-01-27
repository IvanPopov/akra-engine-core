/// <reference path="../idl/IAFXInstruction.ts" />
/// <reference path="../idl/parser/IParser.ts" />
/// <reference path="../common.ts" />


module akra.fx {
	export class Instruction implements IAFXInstruction {
		protected _pParentInstruction: IAFXInstruction = null;
		protected _sOperatorName: string = null;
		protected _pInstructionList: IAFXInstruction[] = null;
		protected _nInstructions: uint = 0;
		protected _eInstructionType: EAFXInstructionTypes = 0;
		protected _pLastError: IAFXInstructionError = null;
		protected _bErrorOccured: boolean = false;
		protected _iInstructionID: uint = 0;
		protected _iScope: uint = Instruction.UNDEFINE_SCOPE;
		private static _nInstructionCounter: uint = 0;

		private _isVisible: boolean = true;

		getParent(): IAFXInstruction {
			return this._pParentInstruction;
		}

		setParent(pParentInstruction: IAFXInstruction): void {
			this._pParentInstruction = pParentInstruction;
		}

		getOperator(): string {
			return this._sOperatorName;
		}

		setOperator(sOperator: string): void {
			this._sOperatorName = sOperator;
		}

		getInstructions(): IAFXInstruction[] {
			return this._pInstructionList;
		}

		setInstructions(pInstructionList: IAFXInstruction[]): void {
			this._pInstructionList = pInstructionList;
		}

		_getInstructionType(): EAFXInstructionTypes {
			return this._eInstructionType;
		}

		_getInstructionID(): uint {
			return this._iInstructionID;
		}

		_getScope(): uint {
			return this._iScope !== Instruction.UNDEFINE_SCOPE ? this._iScope :
				!isNull(this.getParent()) ? this.getParent()._getScope() : Instruction.UNDEFINE_SCOPE;
		}

		_setScope(iScope: uint): void {
			this._iScope = iScope;
		}

		_isInGlobalScope(): boolean {
			return this._getScope() === 0;
		}

		getLastError(): IAFXInstructionError {
			return this._pLastError;
		}

		setError(eCode: uint, pInfo: any = null): void {
			this._pLastError.code = eCode;
			this._pLastError.info = pInfo;
			this._bErrorOccured = true;
		}

		clearError(): void {
			this._bErrorOccured = false;
			this._pLastError.code = 0;
			this._pLastError.info = null;
		}

		isErrorOccured(): boolean {
			return this._bErrorOccured;
		}

		setVisible(isVisible: boolean): void {
			this._isVisible = isVisible;
		}

		isVisible(): boolean {
			return this._isVisible;
		}

		initEmptyInstructions(): void {
			this._pInstructionList = [];
		}

		constructor() {
			this._iInstructionID = Instruction._nInstructionCounter++;
			this._pParentInstruction = null;
			this._sOperatorName = null;
			this._pInstructionList = null;
			this._nInstructions = 0;
			this._eInstructionType = EAFXInstructionTypes.k_Instruction;
			this._pLastError = { code: 0, info: null };
		}

		push(pInstruction: IAFXInstruction, isSetParent: boolean = false): void {
			if (!isNull(this._pInstructionList)) {
				this._pInstructionList[this._nInstructions] = pInstruction;
				this._nInstructions += 1;
			}
			if (isSetParent && !isNull(pInstruction)) {
				pInstruction.setParent(this);
			}
		}

		addRoutine(fnRoutine: IAFXInstructionRoutine, iPriority?: uint): void {
			//TODO
		}

		prepareFor(eUsedType: EFunctionType): void {
			if (!isNull(this._pInstructionList) && this._nInstructions > 0) {
				for (var i: uint = 0; i < this._nInstructions; i++) {
					this._pInstructionList[i].prepareFor(eUsedType);
				}
			}
		}
		/**
		 * Проверка валидности инструкции
		 */
		check(eStage: ECheckStage, pInfo: any = null): boolean {
			if (this._bErrorOccured) {
				return false;
			}
			else {
				return true;
			}
		}

		/**
		 * Подготовка интсрукции к дальнейшему анализу
		 */
		prepare(): boolean {
			return true;
		}

		toString(): string {
			return null;
		}

		toFinalCode(): string {
			return "";
		}

		clone(pRelationMap: IAFXInstructionMap = <IAFXInstructionMap>{}): IAFXInstruction {
			if (isDef(pRelationMap[this._getInstructionID()])) {
				return pRelationMap[this._getInstructionID()];
			}

			var pNewInstruction: IAFXInstruction = new this["constructor"]();
			var pParent: IAFXInstruction = this.getParent() || null;

			if (!isNull(pParent) && isDef(pRelationMap[pParent._getInstructionID()])) {
				pParent = pRelationMap[pParent._getInstructionID()];
			}

			pNewInstruction.setParent(pParent);
			pRelationMap[this._getInstructionID()] = pNewInstruction;

			if (!isNull(this._pInstructionList) && isNull(pNewInstruction.getInstructions())) {
				pNewInstruction.initEmptyInstructions();
			}

			for (var i: uint = 0; i < this._nInstructions; i++) {
				pNewInstruction.push(this._pInstructionList[i].clone(pRelationMap));
			}

			pNewInstruction.setOperator(this.getOperator());

			return pNewInstruction;
		}

		static UNDEFINE_LENGTH: int = 0xffffff;
		static UNDEFINE_SIZE: int = 0xffffff;
		static UNDEFINE_SCOPE: int = 0xffffff;
		static UNDEFINE_PADDING: int = 0xffffff;
		static UNDEFINE_NAME: string = "undef";
	}


}







