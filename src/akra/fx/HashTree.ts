module akra.fx {

	interface IHashTreeEntry<T> {
		parent: IHashTreeEntry<T>;
		//children: IHashTreeEntry<T>[];
		children: IMap<IHashTreeEntry<T>>;
		value: uint;
		content: T;
	}

	/**
	 * Use for fast and simple find element by ordered parts of complex uint key. Use when you can split you key for independent parts.
	 * For example, we can fully described fx.Maker by combination of foreigns, sampler, buffers and material. 
	 * So if we create unique keys for those parameters we can easly create unique key for maker. 
	 * And we can not store all this parts of keys in uint variable or in string hash.
	 * But if each part can be greater than 256, we can not use single uint variable. 
	 * And string hash is not very fast. So we can use HashTree<T>, it`s pretty fast ant easy to use.
	 * Some code for example:
	 * var pMaker: IAFXMaker = this._pFXMakerHashTree.next(iForeignPartHash)
	 *                                               .next(iSamplerPartHash)
	 *                                               .next(iMaterialPartHash)
	 *                                               .next(iBufferPartHash)
	 *                                               .getContent();
	 */
	export class HashTree<T> {
		/** Root entry */
		private _pRoot: IHashTreeEntry<T> = null;
		/** Current entry */
		private _pCurrent: IHashTreeEntry<T> = null;
		/** Sort function */
		private _fnSort: Function = null;

		constructor() {
			this._pRoot = this._pCurrent = <IHashTreeEntry<T>>{
				parent: <IHashTreeEntry<T>>null,
				//children: [],
				children: <any>{},
				value: 0,
				content: null
			};

			this._fnSort = function (a: IHashTreeEntry<T>, b: IHashTreeEntry<T>): int {
				return a.value - b.value;
			};
		}

		has(iValue: uint): boolean {
			var pEntry = this._pCurrent.children[iValue];

			if (isDef(pEntry)) {
				this._pCurrent = pEntry;
				return true;
			}
			else {
				pEntry = <IHashTreeEntry<T>>{
					parent: this._pCurrent,
					//children: [],
					children: <any>{},
					value: iValue,
					content: null
				};

				this._pCurrent.children[iValue] = pEntry;
				this._pCurrent = pEntry;

				return false;
			}
			//var iIndex: uint = HashTree.binarySearchInSortArray<T>(this._pCurrent.children, iValue);

			//if (iIndex !== -1) {
			//	this._pCurrent = this._pCurrent.children[iIndex];
			//	return true;
			//}

			//var pNewEntry: IHashTreeEntry<T> = <IHashTreeEntry<T>>{
			//	parent: this._pCurrent,
			//	children: [],
			//	//children: <any>{},
			//	value: iValue,
			//	content: null
			//};

			//this._pCurrent.children.push(pNewEntry);
			//this._pCurrent.children.sort(<any>this._fnSort);
			//this._pCurrent = pNewEntry;

			//return false;
		}

		next(iValue: uint): HashTree<T> {
			this.has(iValue);
			return this;
		}

		release(): void {
			this._pCurrent = this._pRoot;
		}

		addContent(pContent: T): void {
			this._pCurrent.content = pContent;
		}

		getContent(): T {
			return this._pCurrent.content;
		}

		private static binarySearchInSortArray<T>(pArray: IHashTreeEntry<T>[], iValue: int): uint {
			if (pArray.length === 0) {
				return -1;
			}

			if (iValue < pArray[0].value || iValue > pArray[pArray.length - 1].value) {
				return -1;
			}

			if (iValue === pArray[0].value) {
				return 0;
			}

			if (iValue === pArray[pArray.length - 1].value) {
				return pArray.length - 1;
			}

			var p: uint = 0;
			var q: uint = pArray.length - 1;

			while (p < q) {
				var s: uint = (p + q) >> 1;

				if (iValue === pArray[s].value) {
					return s;
				}
				else if (iValue > pArray[s].value) {
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