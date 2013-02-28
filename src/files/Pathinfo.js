if (!a) {
    var a = {};
}


function Pathinfo () {
    this.sDirname = null;
    this.sExtension = null;
    this.sFilename = null;

    if (arguments.length) {
        this.set(arguments[0]);
    }
}

Pathinfo.prototype.set = function (sPath) {
    if (typeof sPath == 'string') {
        var pParts = sPath.replace('\\', '/').split('/');
        this.basename = pParts.pop();

        this.sDirname = pParts.join('/');
    }
    else if (sPath instanceof Pathinfo) {
        this.sDirname = sPath.sDirname;
        this.sFilename = sPath.sFilename;
        this.sExtension = sPath.sExtension;
    }
    else {
        throw new TypeError('Unexpected data type was used.');
    }
};

Pathinfo.prototype.toString = function () {
    return (this.sDirname ? this.sDirname + '/' : '') + (this.basename);
};

Object.defineProperty(Pathinfo.prototype, "data", {
    get: function () {
        return this.toString();
    },
    set: function (sPath) {
        this.set(sPath);
    }
});

Object.defineProperty(Pathinfo.prototype, "path", {
    get: function () {
        return this.toString();
    },
    set: function (sPath) {
        this.set(sPath);
    }
});

Object.defineProperty(Pathinfo.prototype, "dirname", {
    get: function () {
        return this.sDirname;
    }
});

Object.defineProperty(Pathinfo.prototype, "filename", {
    get: function () {
        return this.sFilename;
    },
    set: function (sFilename) {
        this.basename = sFilename + '.' + this.sExtension;
    }
});

Object.defineProperty(Pathinfo.prototype, "ext", {
    get: function () {
        return this.sExtension;
    }
});

Object.defineProperty(Pathinfo.prototype, "extention", {
    get: function () {
        return this.sExtension;
    },
    set: function (sExt) {
        this.basename = this.sFilename + '.' + sExt;
    }
});

Object.defineProperty(Pathinfo.prototype, "basename", {
    get: function () {
        return (this.sFilename ? this.sFilename + (this.sExtension ?
            '.' + this.sExtension : '') : '');
    },
    set: function (sBasename) {
        var nPos = sBasename.lastIndexOf('.');
        if (nPos < 0) {
            this.sFilename = sBasename.substr(0);
            this.sExtension = null;
        }
        else {
            this.sFilename = sBasename.substr(0, nPos);
            this.sExtension = sBasename.substr(nPos + 1);
        }
    }
});

Pathinfo.prototype.isAbsolute = function () {
    'use strict';
    
    return this.sDirname[0] === '/'? true: false;
};

a.Pathinfo = Pathinfo;
a.pathinfo = function (sPath) {
    return new a.Pathinfo(sPath);
}