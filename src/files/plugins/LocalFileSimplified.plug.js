function LocalFileSimplified () {
    LocalFileSimplified.superclass.constructor.apply(this, arguments);

}

a.extend(LocalFileSimplified, a.FileThread);
LocalFileSimplified.prototype.clear = function (fnSuccess) {
    if (!(this._pFile)) {
        var pArgs = arguments;
        this.open(function () {
                      this.clear.apply(this, pArgs);

                  }
            , fnError);
        return;

    }
    if (!((this._iThread) < 0)) {
        var err = ((((((("Error:: " + ((("File(" + (this.name)) + ") already in use. \n thread: ") + (this._iThread)))
            + "\n") + "\tfile: ") + __FILE__) + "\n") + "\tline: ") + __LINE__) + "\n";
        if (confirm(err + "Accept to exit, refuse to continue.")) {
            throw new Error(((("File(" + (this.name))
                + ") already in use. \n thread: ") + (this._iThread)));
        }

    }
    ;
    localStorage.setItem(this.path, "");
    this._pFile.size = 0;
    fnSuccess.apply(this);

};
LocalFileSimplified.prototype._read = function () {
    var pFile = this._pFile;
    var pData = localStorage.getItem(this.path);

    if (pData == null) {
        pData = "";
        if ((pData & (1 << 1)) != 0) {
            localStorage.setItem(this.path, pData);

        }
    }

    if ((this._eFileMode & (1 << 5)) != 0) {
        pData = a.str2buf(pData);
        pFile.size = pData.byteLength;

    }
    else {
        pFile.size = pData.length;

    }
    return pData;

};
LocalFileSimplified.prototype._update = function (fnSuccess) {
    this._pFile = {};
    this._read();
    fnSuccess.apply(this);

};
LocalFileSimplified.prototype.read = function (fnSuccess) {
    if (!(this._pFile)) {
        var pArgs = arguments;
        this.open(function () {
                      this.read.apply(this, pArgs);

                  }
            , fnError);
        return;

    }
    if (!((this._iThread) < 0)) {
        var err = ((((((("Error:: " + ((("File(" + (this.name)) + ") already in use. \n thread: ") + (this._iThread)))
            + "\n") + "\tfile: ") + __FILE__) + "\n") + "\tline: ") + __LINE__) + "\n";
        if (confirm(err + "Accept to exit, refuse to continue.")) {
            throw new Error(((("File(" + (this.name))
                + ") already in use. \n thread: ") + (this._iThread)));
        }

    }
    ;
    if (!(this._eFileMode & (1 << 0)) != 0) {
        var err = ((((((("Error:: " + "The file is not readable.") + "\n") + "\tfile: ") + __FILE__) + "\n")
            + "\tline: ") + __LINE__) + "\n";
        if (confirm(err + "Accept to exit, refuse to continue.")) {
            throw new Error("The file is not readable.");
        }

    }
    ;
    var pData = this._read();
    var nPos = this._nSeek;
    if (nPos) {
        if ((this._eFileMode & (1 << 5)) != 0) {
            pData = new Uint8Array(new Uint8Array(pData).subarray(nPos)).buffer;

        }
        else {
            pData = pData.substr(nPos);

        }

    }
    this.atEnd();
    fnSuccess.apply(this, [pData]);

};
LocalFileSimplified.prototype.write = function (pData, fnSuccess, fnError, sContentType) {
    if (!(this._pFile)) {
        var pArgs = arguments;
        this.open(function () {
                      this.write.apply(this, pArgs);

                  }
            , fnError);
        return;

    }
    if (!((this._iThread) < 0)) {
        var err = ((((((("Error:: " + ((("File(" + (this.name)) + ") already in use. \n thread: ") + (this._iThread)))
            + "\n") + "\tfile: ") + __FILE__) + "\n") + "\tline: ") + __LINE__) + "\n";
        if (confirm(err + "Accept to exit, refuse to continue.")) {
            throw new Error(((("File(" + (this.name))
                + ") already in use. \n thread: ") + (this._iThread)));
        }

    }
    ;
    var iMode = this._eFileMode;
    if (!(iMode & (1 << 1)) != 0) {
        var err = ((((((("Error:: " + "The file is not writable.") + "\n") + "\tfile: ") + __FILE__) + "\n")
            + "\tline: ") + __LINE__) + "\n";
        if (confirm(err + "Accept to exit, refuse to continue.")) {
            throw new Error("The file is not writable.");
        }

    }
    ;
    sContentType = sContentType || (((iMode & (1 << 5)) != 0 ? "application/octet-stream" : "text/plain"));
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
    fnSuccess.apply(this);

};
LocalFileSimplified.prototype.isExists = function (fnSuccess) {
    fnSuccess.apply(this, [(localStorage.getItem(this.path)) == null]);

};
LocalFileSimplified.prototype.remove = function (fnSuccess) {
    localStorage.removeItem(this.path);
    fnSuccess.apply(this);

};
a.LocalFile = LocalFileSimplified;
