/**
 * @file
 * @brief file contains renderQueue and renderEntry classes
 * @author sss
 */

function RenderEntry() {
    this.pProgram = null;
    this.pAttributes = null;
    this.pUniforms = null;
    this.pTextures = null;
    this.pIndexData = null;
    this.iOffset = 0;
    this.iLength = 0;
    this.eDrawPrim = null;
    this.iViewportX = 0;
    this.iViewportY = 0;
    this.iViewportWidth = 0;
    this.iViewportHeight = 0;
    this.iFrameBuffer = null;
}
A_NAMESPACE(RenderEntry);

RenderEntry.prototype.clear = function () {
    this.pProgram = null;
    this.pAttributes = null;
    this.pUniforms = null;
    this.pTextures = null;
    this.pIndexData = null;
    this.iOffset = 0;
    this.iLength = 0;
    this.eDrawPrim = null;
    this.iViewportX = 0;
    this.iViewportY = 0;
    this.iViewportWidth = 0;
    this.iViewportHeight = 0;
    this.iFrameBuffer = null;
};

RenderEntry.prototype.set = function (pProgram, pAttrs, pUniformValues, pTextures, pIndex, iOffset, iLength,
                                      eDrawPrimitive, iVeiwportX, iViewportY, iViewportWidth, iViewportHeight,
                                      iFrameBuffer) {
    this.pProgram = pProgram;
    this.pAttributes = pAttrs;
    this.pUniforms = pUniformValues;
    this.pTextures = pTextures;
    this.pIndexData = pIndex;
    this.iOffset = iOffset;
    this.iLength = iLength;
    this.eDrawPrim = eDrawPrimitive;
    this.iViewportX = iVeiwportX;
    this.iViewportY = iViewportY;
    this.iViewportWidth = iViewportWidth;
    this.iViewportHeight = iViewportHeight;
    this.iFrameBuffer = iFrameBuffer;
};

function RenderQueue(pEngine) {
    Enum([
             ENTRYINITCOUNT = 200,
             ENRTYINCREMENT = 20
         ], ENTRYPARAM, a.RenderQueue);
    this._pEngine = pEngine;
    this._iIncrement = 0;
    this._nCount = 0;
    this._pFreeEntrys = null;
    this._nSortCount = 0;
    this._pSortEntrys = null;
}
A_NAMESPACE(RenderQueue);

RenderQueue.prototype.init = function (nCount, iIncrement) {
    nCount = nCount || a.RenderQueue.ENTRYINITCOUNT;
    iIncrement = iIncrement || a.RenderQueue.ENRTYINCREMENT;
    this._iIncrement = iIncrement;
    this._nCount = nCount;
    this._pFreeEntrys = new Array(nCount);
    this._pSortEntrys = new Array(nCount);
    var i;
    for (i = 0; i < nCount; i++) {
        this._pFreeEntrys[i] = new a.RenderEntry();
    }
};

RenderQueue.prototype.getEmptyEntry = function () {
    var pEntry;
    var iElement;
    if (this._nCount <= 0) {
        this._addNewEntrys();
    }
    iElement = this._nCount - 1;
    pEntry = this._pFreeEntrys[iElement];
    this._pFreeEntrys[iElement] = null;
    this._nCount--;
    return pEntry;
};

RenderQueue.prototype._releaseEntry = function (pEntry) {
    pEntry.clear();
    this._pFreeEntrys[this._nCount - 1] = pEntry;
    this._nSortCount--;
};

RenderQueue.prototype._addNewEntrys = function () {
    var pNewEntrys = new Array(this._iIncrement);
    var i;
    for (i = 0; i < this._iIncrement; i++) {
        pNewEntrys[i] = new a.RenderEntry();
    }
    this._pFreeEntrys = pNewEntrys.concat(this._pFreeEntrys);
    this._pSortEntrys.length += this._iIncrement;
    this._nCount = this._iIncrement;
};

RenderQueue.prototype.addSortEntry = function (pEntry) {
    var iIndex = this._nSortCount;
    var iLength = this._pSortEntrys.length;
    if (iLength === iIndex) {
        this._addNewEntrys();
    }
    this._pSortEntrys[iIndex] = pEntry;
    this._nSortCount++;
};

RenderQueue.prototype.execute = function () {
    var i;
    var iLength = this._nSortCount;
    var pRenderer = this._pEngine.shaderManager();
//    trace("RenderQueue.prototype.execute. Number of Entry = ", iLength);
    for (i = 0; i < iLength; i++) {
        //trace(this._pSortEntrys[i], this._pSortEntrys, i)
        pRenderer.render(this._pSortEntrys[i]);
//        this._releaseEntry(this._pSortEntrys[i]);
    }
    this._nSortCount = 0;
};

RenderQueue.prototype.reset = function () {
    this._nSortCount = 0;
};
