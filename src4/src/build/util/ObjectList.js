/// <reference path="../idl/IObjectList.ts" />
/// <reference path="../logger.ts" />
/// <reference path="ObjectArray.ts" />
var akra;
(function (akra) {
    (function (util) {
        var ObjectList = (function () {
            function ObjectList(pData) {
                this._pHead = null;
                this._pTail = null;
                this._pCurrent = null;
                this._iLength = 0;
                this._bLock = false;
                if (arguments.length) {
                    this.fromArray(pData);
                }
            }
            ObjectList.prototype.getLength = function () {
                return this._iLength;
            };

            ObjectList.prototype.getFirst = function () {
                this._pCurrent = this._pHead;
                return (akra.isDefAndNotNull(this._pCurrent)) ? this._pCurrent.data : null;
            };

            ObjectList.prototype.getLast = function () {
                this._pCurrent = this._pTail;
                return (akra.isDefAndNotNull(this._pCurrent)) ? this._pCurrent.data : null;
            };

            ObjectList.prototype.getCurrent = function () {
                return (akra.isDefAndNotNull(this._pCurrent)) ? this._pCurrent.data : null;
            };

            ObjectList.prototype.lock = function () {
                this._bLock = true;
            };

            ObjectList.prototype.unlock = function () {
                this._bLock = false;
            };

            ObjectList.prototype.isLocked = function () {
                return this._bLock;
            };

            ObjectList.prototype.value = function (n) {
                return this.find(n).data;
            };

            ObjectList.prototype.indexOf = function (pData, iFrom) {
                if (typeof iFrom === "undefined") { iFrom = 0; }
                var pItem = this.find(iFrom);

                for (var i = iFrom; i < this._iLength; i++) {
                    if (pItem.data === pData) {
                        return i;
                    }
                    pItem = pItem.next;
                }
                return -1;
            };

            ObjectList.prototype.mid = function (iPos, iSize) {
                if (typeof iPos === "undefined") { iPos = 0; }
                if (typeof iSize === "undefined") { iSize = this._iLength; }
                iSize = Math.min(this._iLength - iPos, iSize);

                if (iPos > this._iLength - 1) {
                    return null;
                }

                var pNewList = new ObjectList();
                var pItem = this.find(iPos);

                for (var i = 0; i < iSize; ++i) {
                    pNewList.push(pItem.data);
                    pItem = pItem.next;
                }

                return pNewList;
            };

            ObjectList.prototype.slice = function (iStart, iEnd) {
                if (typeof iStart === "undefined") { iStart = 0; }
                if (typeof iEnd === "undefined") { iEnd = Math.max(this._iLength - iStart, 0); }
                return this.mid(iStart, iEnd - iStart);
            };

            ObjectList.prototype.move = function (iFrom, iTo) {
                return this.insert(iTo - 1, this.takeAt(iFrom));
            };

            ObjectList.prototype.replace = function (iPos, pData) {
                akra.debug.assert(!this.isLocked());
                this.find(iPos).data = pData;
                return this;
            };

            ObjectList.prototype.erase = function (begin, end) {
                if (arguments.length < 2) {
                    this.takeAt(arguments[0]);
                } else {
                    end = Math.min(end, this._iLength);
                    for (var i = begin; i < end; i++) {
                        this.takeAt(i);
                    }
                }
                return this;
            };

            ObjectList.prototype.contains = function (pData) {
                return (this.indexOf(pData) >= 0);
            };

            ObjectList.prototype.removeAt = function (n) {
                this.takeAt(n);
            };

            ObjectList.prototype.removeOne = function (pData) {
                this.removeAt(this.indexOf(pData));
            };

            ObjectList.prototype.removeAll = function (pData) {
                var i;
                var n = this.getLength();

                while ((i = this.indexOf(pData)) >= 0) {
                    this.removeAt(i);
                    i--;
                }

                return n;
            };

            ObjectList.prototype.swap = function (i, j) {
                akra.debug.assert(!this.isLocked());

                i = Math.min(i, this._iLength - 1);
                j = Math.min(j, this._iLength - 1);

                if (i != j) {
                    var pItem1 = this.find(i);
                    var pItem2 = this.find(j);

                    var pTmp = pItem1.data;

                    pItem1.data = pItem2.data;
                    pItem2.data = pTmp;
                }

                return this;
            };

            ObjectList.prototype.add = function (pList) {
                pList.seek(0);

                //FIXME: what's this mean?
                if (pList.getLength() > 1) {
                    this.push(pList.getFirst());
                }

                for (var i = 1; i < pList.getLength(); i++) {
                    this.push(pList.next());
                }

                return this;
            };

            ObjectList.prototype.seek = function (n) {
                if (typeof n === "undefined") { n = 0; }
                var pElement;

                n = Math.min(n, this._iLength - 1);

                if (n > this._iLength / 2) {
                    pElement = this._pTail;

                    for (var m = this._iLength - 1 - n; m > 0; --m) {
                        pElement = pElement.prev;
                    }
                } else {
                    pElement = this._pHead;

                    for (var i = 0; i < n; ++i) {
                        pElement = pElement.next;
                    }
                }

                this._pCurrent = pElement;

                return this;
            };

            ObjectList.prototype.next = function () {
                return (akra.isDefAndNotNull(this._pCurrent) && akra.isDefAndNotNull(this._pCurrent.next)) ? (this._pCurrent = this._pCurrent.next).data : null;
            };

            ObjectList.prototype.prev = function () {
                return (akra.isDefAndNotNull(this._pCurrent) && akra.isDefAndNotNull(this._pCurrent.prev)) ? (this._pCurrent = this._pCurrent.prev).data : null;
            };

            ObjectList.prototype.push = function (pElement) {
                return this.insert(this._iLength, pElement);
            };

            ObjectList.prototype.takeAt = function (n) {
                akra.debug.assert(!this.isLocked(), "list locked.");

                if (n < 0) {
                    return null;
                }

                return this.pullElement(this.find(n));
            };

            ObjectList.prototype.pullElement = function (pItem) {
                if (akra.isNull(pItem)) {
                    //this case theoretically cannot happen, but ....
                    return null;
                }

                if (akra.isNull(pItem.prev)) {
                    this._pHead = pItem.next;
                } else {
                    pItem.prev.next = pItem.next;
                }

                if (akra.isNull(pItem.next)) {
                    this._pTail = pItem.prev;
                } else {
                    pItem.next.prev = pItem.prev;
                }

                this._iLength--;

                if (akra.isNull(pItem.next)) {
                    this._pCurrent = this._pTail;
                } else {
                    this._pCurrent = pItem.next;
                }

                return this.releaseItem(pItem);
            };

            ObjectList.prototype.takeFirst = function () {
                return this.takeAt(0);
            };

            ObjectList.prototype.takeLast = function () {
                return this.takeAt(this._iLength - 1);
            };

            ObjectList.prototype.takeCurrent = function (isPrev) {
                if (typeof isPrev === "undefined") { isPrev = false; }
                return this.pullElement(this._pCurrent);
            };

            ObjectList.prototype.pop = function () {
                return this.takeAt(this._iLength - 1);
            };

            ObjectList.prototype.prepend = function (pElement) {
                return this.insert(0, pElement);
            };

            ObjectList.prototype.find = function (n) {
                if (n < this._iLength) {
                    this.seek(n);
                    return this._pCurrent;
                }

                return null;
            };

            ObjectList.prototype.releaseItem = function (pItem) {
                var pData = pItem.data;

                pItem.next = null;
                pItem.prev = null;
                pItem.data = null;

                ObjectList._pool.push(pItem);

                return pData;
            };

            ObjectList.prototype.createItem = function () {
                if (ObjectList._pool.getLength() === 0) {
                    return { next: null, prev: null, data: null };
                }
                return ObjectList._pool.pop();
            };

            ObjectList.prototype.fromArray = function (elements, iOffset, iSize) {
                if (typeof iOffset === "undefined") { iOffset = 0; }
                if (typeof iSize === "undefined") { iSize = elements.length; }
                iOffset = Math.min(iOffset, this._iLength);

                for (var i = 0; i < iSize; i++) {
                    this.insert(iOffset + i, elements[i]);
                }

                return this;
            };

            ObjectList.prototype.insert = function (n, pData) {
                akra.debug.assert(!this.isLocked());

                var pNew = this.createItem();
                var pItem;

                n = Math.min(n, this._iLength);
                pNew.data = pData;

                pItem = this.find(n - 1);

                if (pItem == null) {
                    this._pHead = pNew;
                } else {
                    if (pItem.next == null) {
                        this._pTail = pNew;
                    } else {
                        pNew.next = pItem.next;
                        pItem.next.prev = pNew;
                    }

                    pItem.next = pNew;
                    pNew.prev = pItem;
                }

                this._iLength++;
                this._pCurrent = pNew;

                return this;
            };

            ObjectList.prototype.isEqual = function (pList) {
                if (this._iLength == pList.getLength()) {
                    if (this === pList) {
                        return true;
                    }

                    var l1 = this.getFirst();
                    var l2 = pList.getFirst();

                    for (var i = 0; i < this._iLength; ++i) {
                        if (l1 !== l2) {
                            return false;
                        }

                        l1 = this.next();
                        l2 = pList.next();
                    }

                    return true;
                }

                return false;
            };

            ObjectList.prototype.clear = function () {
                akra.debug.assert(!this.isLocked());

                var pPrev;
                var pNext;

                this._pCurrent = this._pHead;

                for (var i = 0; i < this._iLength; ++i) {
                    pPrev = this._pCurrent;
                    pNext = this._pCurrent = this._pCurrent.next;

                    this.releaseItem(pPrev);
                }

                this._pHead = this._pCurrent = this._pTail = null;
                this._iLength = 0;

                return this;
            };

            ObjectList.prototype.forEach = function (fn) {
                var pItem = this._pHead;
                var n = 0;
                do {
                    if (fn(pItem.data, n++) === false) {
                        return;
                    }
                } while((pItem = pItem.next));
            };

            ObjectList._pool = new akra.util.ObjectArray();
            return ObjectList;
        })();
        util.ObjectList = ObjectList;
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
//# sourceMappingURL=ObjectList.js.map
