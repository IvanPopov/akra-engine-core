/// <reference path="../idl/IResourceCode.ts" />

module akra.pool {
	export class ResourceCode implements IResourceCode {
		private _iValue: int = <number>(EResourceCodes.INVALID_CODE);

		getFamily(): int {
			return this._iValue >> 16;
		}

		setFamily(iNewFamily: int): void {
			this._iValue &= 0x0000FFFF;
			this._iValue |= iNewFamily << 16;
		}

		getType(): int {
			return this._iValue & 0x0000FFFF;
		}

		setType(iNewType: int) : void {
			this._iValue &= 0xFFFF0000;
			this._iValue |= iNewType & 0x0000FFFF;
		}
	
		constructor ();
		constructor(iCode: int);
		constructor(eCode: EResourceCodes);
		constructor(pCode: IResourceCode);
		constructor(iFamily: int, iType: int);
		constructor (iFamily?, iType?) {
			switch (arguments.length) {
				case 0:
					this._iValue = <number>EResourceCodes.INVALID_CODE;
					break;
				case 1:
					if (arguments[0] instanceof ResourceCode) {
						this._iValue = arguments[0].iValue;
					}
					else {
						this._iValue = arguments[0];
					}
					break;
				case 2:
					this.setFamily(arguments[0]);
					this.setType(arguments[1]);
					break;
			}
		}

		setInvalid(): void {
			this._iValue = <number>EResourceCodes.INVALID_CODE;
		}

		less (pSrc: IResourceCode): boolean {
			return this._iValue < pSrc.valueOf();
		}

		eq(pSrc: IResourceCode): IResourceCode {
			this._iValue = pSrc.valueOf();
			return this;
		}

		valueOf(): int {
			return this._iValue;
		}

		toNumber(): int {
			return this._iValue;
		}
	}
}
