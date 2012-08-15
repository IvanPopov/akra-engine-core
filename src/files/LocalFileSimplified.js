function LocalFileSimplified () {
    LocalFileSimplified.superclass.constructor.apply(this, arguments);
}

a.extend(LocalFileSimplified, a.FileThread);

LocalFileSimplified.prototype.clear = function (fnSuccess) {
    FileThread.check(this.clear, arguments);

    localStorage.setItem(this.path, '');
    this._pFile.size = 0;
    if (fnSuccess) {
        fnSuccess.apply(this);
    }
};

LocalFileSimplified.prototype._read = function () {
    var pFile = this._pFile;
    var pData = localStorage.getItem(this.path);

    if (pData == null) {
        pData = '';
        if (a.io.canCreate(pData)) {
            localStorage.setItem(this.path, pData);
        }
    }


    if (a.io.isBinary(this._eFileMode)) {
        pData = a.str2buf(pData);
        pFile.size = pData.byteLength;
    }
    else {
        pFile.size = pData.length;
    }
    return pData;
}
LocalFileSimplified.prototype._update = function (fnSuccess) {
    this._pFile = {};
    this._read();
    fnSuccess.apply(this);
};

LocalFileSimplified.prototype.read = function (fnSuccess, fnError) {
    FileThread.check(this.read, arguments);
    assert(a.io.canRead(this._eFileMode), "The file is not readable.");


    var pData = this._read();
    var nPos = this._nSeek;
    if (nPos) {
        if (a.io.isBinary(this._eFileMode)) {
            pData = (new Uint8Array((new Uint8Array(pData)).subarray(nPos))).buffer;
        }
        else {
            pData = pData.substr(nPos);
        }
    }
    this.atEnd();
    if (fnSuccess) {
        fnSuccess.apply(this, [pData]);
    }
};

LocalFileSimplified.prototype.write = function (pData, fnSuccess, fnError, sContentType) {
    FileThread.check(this.write, arguments);
    var iMode = this._eFileMode;

    assert(a.io.canWrite(iMode), "The file is not writable.");

    sContentType = sContentType || (a.io.isBinary(iMode) ?
        'application/octet-stream' : 'text/plain');

    var sData = this._read();

    if (typeof sData == 'object') {
        sData = a.buf2str(sData);
    }
    var nSeek = (typeof pData == 'string' ? pData.length : pData.byteLength);

    if (typeof pData == 'object') {
        pData = a.buf2str(pData);
    }

    pData = sData.substr(0, this._nSeek) + pData + sData.substr(this._nSeek + pData.length);
    try {
        localStorage.setItem(this.path, pData);
    }
    catch (e) {
        if (fnError) {
            fnError.apply(this, [e]);
        }
        else {
            throw e;
        }
    }

    this._pFile.size = pData.length;
    this._nSeek += nSeek;
    if (fnSuccess) {
        fnSuccess.apply(this);
    }
};


LocalFileSimplified.prototype.isExists = function (fnSuccess) {
    fnSuccess.apply(this, [localStorage.getItem(this.path) == null]);
};


LocalFileSimplified.prototype.remove = function (fnSuccess) {
    localStorage.removeItem(this.path);
    fnSuccess.apply(this);
};


a.LocalFile = LocalFileSimplified;