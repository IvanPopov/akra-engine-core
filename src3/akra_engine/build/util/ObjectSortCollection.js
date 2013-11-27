/// <reference path="../idl/AIObjectSortCollection.ts" />
define(["require", "exports", "logger"], function(require, exports, __logger__) {
    var logger = __logger__;

    var ObjectSortCollection = (function () {
        function ObjectSortCollection(iSize) {
            this._iSize = 0;
            this._iCursor = 0;
            this._pElements = null;
            this._fnCollectionIndex = null;
            this._iCursorElementIndex = 0xFFFFFFFF;
            this._iStartElementIndex = 0xFFFFFFFF;
            this._iLastElementIndex = 0xFFFFFFFF;
            this._iSize = iSize;
            this._pElements = new Array(iSize);
            this._iCursor = -1;

            for (var i = 0; i < iSize; i++) {
                this._pElements[i] = null;
            }
        }
        ObjectSortCollection.prototype.push = function (pElement) {
            if (this._iCursor === this._iSize - 1) {
                this._iCursor = -1;
            }

            this._iCursor++;

            this._pElements[this._iCursor] = pElement;

            this._iCursorElementIndex = this._fnCollectionIndex.call(null, this._pElements[this._iCursor]);

            if (this._iCursor === 0) {
                this._iStartElementIndex = this._fnCollectionIndex.call(null, this._pElements[0]);
            } else if (this._iCursor === this._iSize - 1) {
                this._iLastElementIndex = this._fnCollectionIndex.call(null, this._pElements[this._iSize - 1]);
            }
        };

        ObjectSortCollection.prototype.findElement = function (iCollectionIndex) {
            if (this._iStartElementIndex === 0xFFFFFFFF || this._iCursorElementIndex === 0xFFFFFFFF || iCollectionIndex > this._iCursorElementIndex) {
                return null;
            }

            if (iCollectionIndex >= this._iStartElementIndex) {
                return this._pElements[iCollectionIndex - this._iStartElementIndex];
            } else if (iCollectionIndex <= this._iLastElementIndex) {
                return this._pElements[this._iSize - 1 - (this._iLastElementIndex - iCollectionIndex)];
            }

            return null;
        };

        ObjectSortCollection.prototype.takeElement = function (iCollectionIndex) {
            if (this._iStartElementIndex === 0xFFFFFFFF || this._iCursorElementIndex === 0xFFFFFFFF || iCollectionIndex > this._iCursorElementIndex) {
                logger.log("i must not be here 1");
                return null;
            }

            var iResultIndex = -1;

            if (iCollectionIndex >= this._iStartElementIndex) {
                iResultIndex = iCollectionIndex - this._iStartElementIndex;
            } else if (iCollectionIndex <= this._iLastElementIndex) {
                iResultIndex = this._iSize - 1 - (this._iLastElementIndex - iCollectionIndex);
            }

            if (iResultIndex >= 0) {
                var pResult = this._pElements[iResultIndex];
                this._pElements[iResultIndex] = null;
                return pResult;
            } else {
                //LOG("i must not be here 2");
                return null;
            }
        };

        ObjectSortCollection.prototype.getElementAt = function (iIndex) {
            return this._pElements[iIndex];
        };

        ObjectSortCollection.prototype.setElementAt = function (iIndex, pValue) {
            this._pElements[iIndex] = pValue;
        };

        ObjectSortCollection.prototype.removeElementAt = function (iIndex) {
            this._pElements[iIndex] = null;
        };

        ObjectSortCollection.prototype.clear = function () {
            this._iCursor = -1;

            for (var i = 0; i < this._iSize - 1; i++) {
                this._pElements[i] = null;
            }
        };

        ObjectSortCollection.prototype.setCollectionFuncion = function (fnCollection) {
            this._fnCollectionIndex = fnCollection;
        };
        return ObjectSortCollection;
    })();

    
    return ObjectSortCollection;
});
//# sourceMappingURL=ObjectSortCollection.js.map
