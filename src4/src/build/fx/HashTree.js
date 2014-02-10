var akra;
(function (akra) {
    (function (fx) {
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
        var HashTree = (function () {
            function HashTree() {
                /** Root entry */
                this._pRoot = null;
                /** Current entry */
                this._pCurrent = null;
                /** Sort function */
                this._fnSort = null;
                this._pRoot = this._pCurrent = {
                    parent: null,
                    children: [],
                    value: 0,
                    content: null
                };

                this._fnSort = function (a, b) {
                    return a.value - b.value;
                };
            }
            HashTree.prototype.has = function (iValue) {
                var iIndex = HashTree.binarySearchInSortArray(this._pCurrent.children, iValue);

                if (iIndex !== -1) {
                    this._pCurrent = this._pCurrent.children[iIndex];
                    return true;
                }

                var pNewEntry = {
                    parent: this._pCurrent,
                    children: [],
                    value: iValue,
                    content: null
                };

                this._pCurrent.children.push(pNewEntry);
                this._pCurrent.children.sort(this._fnSort);
                this._pCurrent = pNewEntry;

                return false;
            };

            HashTree.prototype.next = function (iValue) {
                this.has(iValue);
                return this;
            };

            HashTree.prototype.release = function () {
                this._pCurrent = this._pRoot;
            };

            HashTree.prototype.addContent = function (pContent) {
                this._pCurrent.content = pContent;
            };

            HashTree.prototype.getContent = function () {
                return this._pCurrent.content;
            };

            HashTree.binarySearchInSortArray = function (pArray, iValue) {
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

                var p = 0;
                var q = pArray.length - 1;

                while (p < q) {
                    var s = (p + q) >> 1;

                    if (iValue === pArray[s].value) {
                        return s;
                    } else if (iValue > pArray[s].value) {
                        p = s + 1;
                    } else {
                        q = s;
                    }
                }

                return -1;
            };
            return HashTree;
        })();
        fx.HashTree = HashTree;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=HashTree.js.map
