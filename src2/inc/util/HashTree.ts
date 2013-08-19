#ifndef HASHTREE_TS
#define HASHTREE_TS

module akra.util {
	export class IHashTreeEntry {
		parent: IHashTreeEntry;
		children: IHashTreeEntry[];
		value: uint;
		content: any;
	}

	export class HashTree {
		private _pRoot: IHashTreeEntry = null;
		private _pCurrent: IHashTreeEntry = null;
		private _fnSort: Function = null;

		constructor(){
			this._pRoot = this._pCurrent = <IHashTreeEntry>{
				parent: <IHashTreeEntry>null,
				children: [],
				value: 0,
				content: null
			};

			this._fnSort = function(a: IHashTreeEntry, b: IHashTreeEntry): int {
				return a.value - b.value;
			};
		}

		has(iValue: uint): bool {
			var iIndex: uint = this.binarySearchInSortArray(this._pCurrent.children, iValue);
			
			if(iIndex !== -1){
				this._pCurrent = this._pCurrent.children[iIndex];
				return true;
			}

			var pNewEntry: IHashTreeEntry = <IHashTreeEntry>{
				parent: this._pCurrent,
				children: [],
				value: iValue,
				content: null
			};

			this._pCurrent.children.push(pNewEntry);
			this._pCurrent.children.sort(<any>this._fnSort);

			this._pCurrent = pNewEntry;
			return false;
		}

		release(): void {
			this._pCurrent = this._pRoot;
		}

		addContent(pContent: any): void {
			this._pCurrent.content = pContent;
		}

		getContent(): any {
			return this._pCurrent.content;
		}

		binarySearchInSortArray(pArray: IHashTreeEntry[], iValue: int): uint {
			if(pArray.length === 0){
				return -1;
			}
			
            if(iValue < pArray[0].value || iValue > pArray[pArray.length - 1].value){
                return -1;
            }

            if(iValue === pArray[0].value){
                return 0;
            }

            if(iValue === pArray[pArray.length - 1].value){
                return pArray.length - 1;
            }

            var p: uint = 0;
            var q: uint = pArray.length - 1;

            while(p < q){
                var s: uint = (p + q) >> 1;

                if(iValue === pArray[s].value){
                    return s;
                }
                else if(iValue > pArray[s].value){
                    p = s + 1;
                }
                else {
                    q = s;
                }
            }

            return -1;
        }
	}
}

#endif