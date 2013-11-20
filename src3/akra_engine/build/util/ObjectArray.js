/// <reference path="../idl/AIObjectArray.ts" />
define(["require", "exports", "logger"], function(require, exports, __logger__) {
    var logger = __logger__;

    var ObjectArray = (function () {
        // set length(n: uint) {
        // 	if (this._bLock) {
        // 		return;
        // 	}
        // 	this.extend(n);
        // 	this._iLength = n;
        // }
        function ObjectArray(pElements) {
            this._pData = [];
            this._bLock = false;
            this._iLength = 0;
            if (arguments.length) {
                this.fromArray(pElements);
            }
        }
        Object.defineProperty(ObjectArray.prototype, "length", {
            get: function () {
                return this._iLength;
            },
            enumerable: true,
            configurable: true
        });

        ObjectArray.prototype.lock = function () {
            this._bLock = true;
        };

        ObjectArray.prototype.unlock = function () {
            this._bLock = false;
        };

        ObjectArray.prototype.isLocked = function () {
            return this._bLock;
        };

        ObjectArray.prototype.clear = function (bRemoveLinks) {
            if (typeof bRemoveLinks === "undefined") { bRemoveLinks = false; }
            //"cannot clear. array is locked."
            logger.presume(!this._bLock);

            this._iLength = 0;

            if (bRemoveLinks) {
                for (var i = 0; i < this._pData.length; ++i) {
                    this._pData[i] = null;
                }
            }

            return this;
        };

        ObjectArray.prototype.release = function () {
            this.clear(true);
            this._pData.clear();
            return this;
        };

        ObjectArray.prototype.value = function (n) {
            return this._pData[n];
        };

        ObjectArray.prototype.extend = function (n) {
            if (this._pData.length < n) {
                for (var i = this._pData.length; i < n; ++i) {
                    this._pData[i] = null;
                }
            }
        };

        ObjectArray.prototype.set = function (n, pData) {
            //"cannot clear. array is locked."
            logger.presume(!this._bLock);

            var N = n + 1;

            this.extend(N);

            if (this._iLength < N) {
                this._iLength = N;
            }

            this._pData[n] = pData;

            return this;
        };

        ObjectArray.prototype.fromArray = function (pElements, iOffset, iSize) {
            if (typeof iOffset === "undefined") { iOffset = 0; }
            if (typeof iSize === "undefined") { iSize = 0; }
            //cannot clear. array is locked.
            logger.presume(!this._bLock);

            iSize = iSize > 0 ? iSize < pElements.length ? iSize : pElements.length : pElements.length;

            this.extend(iSize);

            for (var i = iOffset, j = 0; i < iSize; ++i, ++j) {
                this._pData[i] = pElements[j];
            }

            this._iLength = i;

            return this;
        };

        ObjectArray.prototype.push = function (pElement) {
            //"cannot clear. array is locked."
            logger.presume(!this._bLock);

            return this.set(this._iLength, pElement);
        };

        ObjectArray.prototype.pop = function () {
            logger.presume(!this._bLock, "cannot clear. array is locked.");
            return this._iLength > 0 ? this._pData[--this._iLength] : null;
        };

        ObjectArray.prototype.swap = function (i, j) {
            //"cannot clear. array is locked."
            logger.presume(!this._bLock);

            //"invalid swap index."
            logger.presume(i < this._iLength && j < this._iLength);

            this._pData.swap(i, j);

            return this;
        };

        ObjectArray.prototype.takeAt = function (iPos) {
            var pValue = this.value(iPos);

            for (var i = iPos + 1, j = iPos; i < this.length; ++i, ++j) {
                this._pData[j] = this._pData[i];
            }

            this._iLength--;

            return pValue;
        };

        ObjectArray.prototype.indexOf = function (pObject) {
            for (var i = 0; i < this._iLength; i++) {
                if (pObject === this._pData[i]) {
                    return i;
                }
            }

            return -1;
        };
        return ObjectArray;
    })();

    
    return ObjectArray;
});
//# sourceMappingURL=ObjectArray.js.map
