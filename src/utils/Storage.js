/**
 * Created with IntelliJ IDEA.
 * User: sss
 * Date: 03.09.12
 * Time: 15:41
 * To change this template use File | Settings | File Templates.
 */

function PopArray(nLength, iIncrement, eMode) {
    Enum([
             LOOP = 1,
             ADD = 2
         ], ARRAYWRITEMODE, a.SystemArray);

    this._pData = nLength !== undefined ? new Array(nLength) : null;
    this._nCount = 0;
    this._eMode = eMode || a.SystemArray.ADD;
    this._iIncrement = iIncrement || 0;
}
A_NAMESPACE(PopArray);

PROPERTY(PopArray, "length",
         function () {
             return this._nCount
         });

PopArray.prototype.create = function (nLength, iIncrement, eMode) {
    nLength = nLength || 100;
    iIncrement = iIncrement || 10;
    eMode = eMode || a.SystemArray.ADD;
    this._pData = new Array(nLength);
    this._eMode = eMode;
    this._nCount = 0;
};

PopArray.prototype.release = function (isStrong) {
    this._nCount = 0;
    if (isStrong) {
        var pData = this._pData;
        var iLength = pData.length;
        for (var i = 0; i < iLength; i++) {
            pData[i] = null;
        }
    }
};

PopArray.prototype._addElements = function () {
    this._pData.length += this._iIncrement;
};

PopArray.prototype.push = function (pObject) {
    if (this._pData.length === this._nCount) {
        if (this._eMode === a.SystemArray.ADD) {
            this._addElements();
        }
        else if (this._eMode === a.SystemArray.LOOP) {
            this._nCount = 0;
        }
    }
    this._pData[this._nCount++] = pObject;
};

PopArray.prototype.pop = function () {
    if (this._nCount === 0) {
        return null;
    }
    return this._pData[--this._nCount];
};

PopArray.prototype.setElement = function (index, pValue) {
    if (index >= this._nCount) {
        return false;
    }
    this._pData[index] = pValue;
};

PopArray.prototype.element = function(index){
    index = index >= 0 ? index : null;
    if (index === null || index >= this._nCount) {
        return null;
    }
    return this._pData[index];
};

function Map() {
    this.pKeys = new a.PopArray();
    this.pValues = new a.PopArray();
    this._pMap = null;
}
A_NAMESPACE(Map);


Map.prototype.create = function () {
    this.pKeys.create();
    this.pValues.create();
    this._pMap = {};
};

Map.prototype.release = function (isStrong) {
    this.pKeys.release(isStrong);
    this.pValues.release(isStrong);
};

Map.prototype.addElement = function (sKey, pValue) {
    var pKeys = this.pKeys;
    var pValues = this.pValues;
    var pMap = this._pMap;
    var index = pMap[sKey];
    var iSize = pKeys._nCount;
    var sOldKey;
    sOldKey = pKeys.element(index);
    if (sOldKey === null || sOldKey !== sKey) {
        pKeys.push(sKey);
        pValues.push(pValue);
        pMap[sKey] = iSize;
    }
    else if (sOldKey === sKey) {
        pValues.setElement(index, pValue);
    }
};

Map.prototype.hasElement = function (sKey) {
    var index = this._pMap[sKey] >= 0 ? this._pMap[sKey] : null;
    return (index !== null && this.pKeys.element(index) === sKey);
};

Map.prototype.element = function(sKey) {
    var index = this._pMap[sKey] >= 0 ? this._pMap[sKey] : null;
    return (index !== null && this.pKeys.element(index) === sKey) ? this.pValues[index] : null;
};

