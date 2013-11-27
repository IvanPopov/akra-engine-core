/// <reference path="../idl/AIObjectArray.ts" />


import logger = require("logger");

class ObjectArray<T> implements AIObjectArray<T> {
    protected _pData: T[] = [];
    protected _bLock: boolean = false;
    protected _iLength: uint = 0;

    get length(): uint {
        return this._iLength;
    }

    // set length(n: uint) {

    // 	if (this._bLock) {
    // 		return;
    // 	}

    // 	this.extend(n);
    // 	this._iLength = n;
    // }

    constructor(pElements?: T[]) {
        if (arguments.length) {
            this.fromArray(pElements);
        }
    }

    lock(): void {
        this._bLock = true;
    }

    unlock(): void {
        this._bLock = false;
    }

    isLocked(): boolean {
        return this._bLock;
    }

    clear(bRemoveLinks: boolean = false): AIObjectArray<T> {

        //"cannot clear. array is locked."
        logger.presume(!this._bLock);

        this._iLength = 0;


        if (bRemoveLinks) {
            for (var i: int = 0; i < this._pData.length; ++i) {
                this._pData[i] = null;
            }
        }

        return this;
    }

    release(): AIObjectArray<T> {
        this.clear(true);
        this._pData.clear();
        return this;
    }

    value(n: uint): T {
        return this._pData[n];
    }

    private extend(n: uint): void {
        if (this._pData.length < n) {
            //LOG("extending object array to > " + n);
            for (var i: int = this._pData.length; i < n; ++i) {
                this._pData[i] = null;
            }
        }
    }

    set(n: uint, pData: T): AIObjectArray<T> {
        //"cannot clear. array is locked."
        logger.presume(!this._bLock);

        var N: uint = n + 1;

        this.extend(N);

        if (this._iLength < N) {
            this._iLength = N;
        }

        this._pData[n] = pData;

        return this;
    }

    fromArray(pElements: T[], iOffset: uint = 0, iSize: uint = 0): AIObjectArray<T> {
        //cannot clear. array is locked.
        logger.presume(!this._bLock);

        iSize = iSize > 0 ? iSize < pElements.length ? iSize : pElements.length : pElements.length;

        this.extend(iSize);

        for (var i: int = iOffset, j: int = 0; i < iSize; ++i, ++j) {
            this._pData[i] = pElements[j];
        }

        this._iLength = i;

        return this;
    }

    push(pElement: T): AIObjectArray<T> {

        //"cannot clear. array is locked."
        logger.presume(!this._bLock);

        return this.set(this._iLength, pElement);
    }

    pop(): T {
        logger.presume(!this._bLock, "cannot clear. array is locked.");
        return this._iLength > 0 ? this._pData[--this._iLength] : null;
    }

    swap(i: uint, j: uint): AIObjectArray<T> {
        //"cannot clear. array is locked."
        logger.presume(!this._bLock);
        //"invalid swap index."
        logger.presume(i < this._iLength && j < this._iLength);

        this._pData.swap(i, j);

        return this;
    }

    takeAt(iPos): T {
        var pValue: T = this.value(iPos);

        for (var i = iPos + 1, j = iPos; i < this.length; ++i, ++j) {
            this._pData[j] = this._pData[i];
        }

        this._iLength--;

        return pValue;
    }

    indexOf(pObject: T): int {
        for (var i: uint = 0; i < this._iLength; i++) {
            if (pObject === this._pData[i]) {
                return i;
            }
        }

        return -1;
    }

}

export = ObjectArray;