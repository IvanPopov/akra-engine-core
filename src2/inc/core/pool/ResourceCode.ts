///<reference path="../../akra.ts" />

module akra.core.pool {
	export class ResourceCode implements IResourceCode {
		private iValue: int = <number>(EResourceCodes.INVALID_CODE);

		get family(): int {
			return this.iValue >> 16;
		}

		set family(iNewFamily: int) {
			this.iValue &= 0x0000FFFF;
	        this.iValue |= iNewFamily << 16;
		}

		get type(): int {
			return this.iValue & 0x0000FFFF;
		}

		set type(iNewType: int) {
			this.iValue &= 0xFFFF0000;
            this.iValue |= iNewType & 0x0000FFFF;
		}
	
		constructor ();
		constructor(iCode: int);
		constructor(eCode: EResourceCodes);
		constructor(pCode: IResourceCode);
		constructor(iFamily: int, iType: int);
		constructor (iFamily?, iType?) {
			switch (arguments.length) {
		        case 0:
		            this.iValue = <number>EResourceCodes.INVALID_CODE;
		            break;
		        case 1:
		            if (arguments[0] instanceof ResourceCode) {
		                this.iValue = arguments[0].iValue;
		            }
		            else {
		                this.iValue = arguments[0];
		            }
		            break;
		        case 2:
		            this.family = arguments[0];
		            this.type = arguments[1];
		            break;
		    }
		}

		setInvalid(): void {
		    this.iValue = <number>EResourceCodes.INVALID_CODE;
		}

		less (pSrc: IResourceCode): bool {
		    return this.iValue < pSrc.valueOf();
		}

		eq(pSrc: IResourceCode): IResourceCode {
		    this.iValue = pSrc.valueOf();
		    return this;
		};

		valueOf(): int {
		    return this.iValue;
		};

		toNumber(): int {
			return this.iValue;
		}
	}

	
}