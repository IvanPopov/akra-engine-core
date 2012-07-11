/**
 * @file
 * @author Ivan Popov
 * @email <vantuziast@odserve.org>
 *
 * Объекты и функции для работы с файлами.
 */

/**
 * @property URI(String sURI)
 * @memberof URI
 * @param sURI Строка uri.
 */

/**
 * Класс для работы с URI (Uniform Resource Identifier)
 * @note Like this:  http://odserve.org/w/index.php?title=URI&stable=0#.D0.9E.D1.81.D0.BD.D0.BE.D0.B2.D1.8B
 * @ctor
 */
function URI () {
    /**
     * Схема.
     * @type String
     */
    this.sScheme = null;

    /**
     * Строка UserInfo.
     * @type String
     */
    this.sUserinfo = null;

    /**
     * Имя хоста.
     * @type String
     */
    this.sHost = null;

    /**
     * Порт.
     * @type String.
     */
    this.nPort = null;

    /**
     * Строка Path. Путь.
     * @type String
     */
    this.sPath = null;

    /**
     * QueryString.
     * @type String.
     */
    this.sQuery = null;

    /**
     * Фрагмент.
     */
    this.sFragment = null;

    if (arguments.length) {
        this.set(arguments[0]);
    }
}


//------------------------------------------------------------------//
//----- Validate a URI -----//
//------------------------------------------------------------------//
//- The different parts are kept in their own groups and can be recombined
//  depending on the scheme:
//  - http as $1://$3:$4$5?$7#$8
//  - ftp as $1://$2@$3:$4$5
//  - mailto as $1:$6?$7
//- groups are as follows:
//  1   == scheme
//  2   == userinfo
//  3   == host
//  4   == port
//  5,6 == path (5 if it has an authority, 6 if it doesn't)
//  7   == query
//  8   == fragment


URI.prototype.regexpUri =
    /^([a-z0-9+.-]+:)?(?:\/\/(?:((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(?::(\d*))?(\/(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?|(\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})*(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?)(?:\?((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?$/i;

/*
 composed as follows:
 ^
 ([a-z0-9+.-]+):							#scheme
 (?:
 //							#it has an authority:
 (?:((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?	#userinfo
 ((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)		#host
 (?::(\d*))?						#port
 (/(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?	#path
 |
 #it doesn't have an authority:
 (/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})+(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?	#path
 )
 (?:
 \?((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*)	#query string
 )?
 (?:
 #((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*)	#fragment
 )?
 $
 */


URI.prototype.set = function (sData) {
    if (typeof sData == 'string') {

        var pUri = this.regexpUri.exec(sData);

        if (!pUri) {
            throw new Error('Invalid URI format used.\nused uri: ' + sData);
        }

        this.sScheme = pUri[1] || null;
        this.sUserinfo = pUri[2] || null;
        this.sHost = pUri[3] || null;
        this.nPort = parseInt(pUri[4]) || null;
        this.sPath = pUri[5] || pUri[6] || null;
        this.sQuery = pUri[7] || null;
        this.sFragment = pUri[8] || null;

    }
    else if (sData instanceof URI) {
        this.set(sData.toString());
    }
    else {
        throw new TypeError('Unexpected data type was used.');
    }
};

URI.prototype.toString = function () {
    return this.url + this.urn;
}

Object.defineProperty(URI.prototype, "urn", {
    get: function () {
        return (this.sPath ? this.sPath : '') +
            (this.sQuery ? '?' + this.sQuery : '') +
            (this.sFragment ? '#' + this.sFragment : '');
    }
});

Object.defineProperty(URI.prototype, "url", {
    get: function () {
        return (this.sScheme ? this.sScheme : '') + this.authority;
    }
});

Object.defineProperty(URI.prototype, "authority", {
    get: function () {
        return (this.sHost ? '//' + (this.sUserinfo ? this.sUserinfo + '@' : '') +
            this.sHost + (this.nPort ? ':' + this.nPort : '') : '');
    }
});

Object.defineProperty(URI.prototype, "scheme", {
    get: function () {
        return this.sScheme;
    }
});
Object.defineProperty(URI.prototype, "protocol", {
    get: function () {
        if (!this.sScheme) {
            return this.sScheme;
        }

        return (this.sScheme.substr(0, this.sScheme.lastIndexOf(':')));
    }
});
Object.defineProperty(URI.prototype, "userinfo", {
    get: function () {
        return this.sUserinfo;
    }
});
Object.defineProperty(URI.prototype, "host", {
    get: function () {
        return this.sHost;
    }
});
Object.defineProperty(URI.prototype, "port", {
    get: function () {
        return this.nPort;
    }
});
Object.defineProperty(URI.prototype, "path", {
    get: function () {
        return this.sPath;
    }
});
Object.defineProperty(URI.prototype, "query", {
    get: function () {
        return this.sQuery;
    }
});
Object.defineProperty(URI.prototype, "fragment", {
    get: function () {
        return this.sFragment;
    }
});

a.URI = URI;
a.uri = function (sUri) {
    return new a.URI(sUri);
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

PROPERTY(Pathinfo, 'data',
     function () {
        return this.toString();
    },
    function (sPath) {
        this.set(sPath);
    });

PROPERTY(Pathinfo, 'path',
    function () {
        return this.toString();
    },
    function (sPath) {
        this.set(sPath);
    });


PROPERTY(Pathinfo, 'dirname',
    function () {
        return this.sDirname;
    });

PROPERTY(Pathinfo, 'filename',
    function () {
        return this.sFilename;
    },
    function (sFilename) {
        this.basename = sFilename + '.' + this.sExtension;
    });

PROPERTY(Pathinfo, 'ext',
    function () {
        return this.sExtension;
    });


PROPERTY(Pathinfo, 'extention',
    function () {
        return this.sExtension;
    },
    function (sExt) {
        this.basename = this.sFilename + '.' + sExt;
    });

PROPERTY(Pathinfo, 'basename',
    function () {
        return (this.sFilename ? this.sFilename + (this.sExtension ?
            '.' + this.sExtension : '') : '');
    },
    function (sBasename) {
        var nPos = sBasename.lastIndexOf('.');
        if (nPos < 0) {
            this.sFilename = sBasename.substr(0);
            this.sExtension = null;
        }
        else {
            this.sFilename = sBasename.substr(0, nPos);
            this.sExtension = sBasename.substr(nPos + 1);
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

Enum([
         IN = 0x01,
         OUT = 0x02,
         ATE = 0x04,
         APP = 0x08,
         TRUNC = 0x10,
         BINARY = 0x20,
         BIN = 0x20,
         TEXT = 0x40
     ], INPUT_OUTPUT, a.io);

a.io = {};
a.io.stringTomode = function (sMode) {
    switch (sMode.toLowerCase()) {
        case 'a+t':
            return a.io.IN | a.io.OUT | a.io.APP | a.io.TEXT;
        case 'w+t':
            return a.io.IN | a.io.OUT | a.io.TRUNC | a.io.TEXT;
        case 'r+t':
            return a.io.IN | a.io.OUT | a.io.TEXT;

        case 'at':
            return a.io.APP | a.io.TEXT;
        case 'wt':
            return a.io.OUT | a.io.TEXT;
        case 'rt':
            return a.io.IN | a.io.TEXT;

        case 'a+b':
            return a.io.IN | a.io.OUT | a.io.APP | a.io.BIN;
        case 'w+b':
            return a.io.IN | a.io.OUT | a.io.TRUNC | a.io.BIN;
        case 'r+b':
            return a.io.IN | a.io.OUT | a.io.BIN;

        case 'ab':
            return a.io.APP | a.io.BIN;
        case 'wb':
            return a.io.OUT | a.io.BIN;
        case 'rb':
            return a.io.IN | a.io.BIN;

        case 'a+':
            return a.io.IN | a.io.OUT | a.io.APP;
        case 'w+':
            return a.io.IN | a.io.OUT | a.io.TRUNC;
        case 'r+':
            return a.io.IN | a.io.OUT;

        case 'a':
            return a.io.APP | a.io.OUT;
        case 'w':
            return a.io.OUT;
        case 'r':
        default:
            return a.io.IN;
    }
};

Define(a.io.canCreate(MODE), function () {
    TEST_BIT(MODE, 1)
});

Define(a.io.canRead(MODE), function () {
    TEST_BIT(MODE, 0)
});

Define(a.io.canWrite(MODE), function () {
    TEST_BIT(MODE, 1)
});

Define(a.io.isBinary(MODE), function () {
    TEST_BIT(MODE, 5)
});

Define(a.io.isAppend(MODE), function () {
    TEST_BIT(MODE, 3)
});

Define(a.io.isTrunc(MODE), function () {
    TEST_BIT(MODE, 4)
});


/**
 * @ctor
 * Простой класс управления потоками.
 * @tparam String sScript Адресс скрипта, исполняемого в потоке.
 * @tparam * pWorker Конструктор для потока.
 */
function ThreadManager (sScript, pWorker) {
    //TRACE('thread manager used: ' + sScript + ' worker(' + (pWorker? 'not standart': 'standart') + ')');

    Enum([WORKER_BUSY, WORKER_FREE], WORKER_STATUS, a.ThreadManager);
    Define(a.ThreadManager.MAX_THREAD_NUM, 32);
    Define(a.ThreadManager.INIT_THREAD_NUM, 4);


    this._sScript = sScript || null;
    this._pWorkers = [];
    this._pWorkerStatus = [];

    for (var i = 0; i < a.ThreadManager.INIT_THREAD_NUM; ++i) {
        this.createThread(sScript, pWorker);
    }
}
ThreadManager.prototype.createThread = function (sScript, pWorker) {
    sScript = sScript || this._sScript;

    if (this._pWorkers.length == a.ThreadManager.MAX_THREAD_NUM) {
        error('Reached limit the number of threads.');
    }

    var pWorker;
    pWorker = new (pWorker || Worker)(sScript);
    pWorker.postMessage = pWorker.webkitPostMessage || pWorker.postMessage;
    this._pWorkers.push(pWorker);
    this._pWorkerStatus.push(a.ThreadManager.WORKER_FREE);
    //TRACE('thread created: ' + this._pWorkerStatus.length);
}

ThreadManager.prototype.occupyThread = function () {
    for (var i = 0, n = this._pWorkers.length; i < n; ++i) {
        if (this._pWorkerStatus[i] == a.ThreadManager.WORKER_FREE) {
            this._pWorkerStatus[i] = a.ThreadManager.WORKER_BUSY;
            return i;
        }
    }

    this.createThread();
    return this.occupyThread();
};

ThreadManager.prototype.releaseThread = function (i) {
    this._pWorkerStatus[i] = a.ThreadManager.WORKER_FREE;
    return;
};

ThreadManager.prototype.thread = function (id) {
    return this._pWorkers[id];
};


function FileThread () {

    Enum([
             OPEN = 1,
             READ,
             WRITE,
             CLEAR,
             EXISTS,
             REMOVE
         ], FILE_THREAD_ACTIONS, a.FileThread);

    Enum([
             NORMAL,
             FAST,
             SLOW
         ], FILE_THREAD_TRANSFER_MODES, a.FileThread.TRANSFER);

    this._eFileMode = (typeof arguments[1] == 'string' ?
        a.io.stringTomode(arguments[1]) : arguments[1] || a.io.IN);

    this._pFileName = a.uri(arguments[0]) || null;

    this._pFile = null;

    this._nSeek = 0;
    this._iThread = -1;

    this._eTransferMode = a.info.support.api.transferableObjects ? a.FileThread.TRANSFER.FAST
        : (a.info.browser.sBrowser == 'Opera' ? a.FileThread.TRANSFER.SLOW
        : a.FileThread.TRANSFER.NORMAL);

    if (arguments.length > 2) {
        this.open(arguments[0], arguments[1], arguments[2], arguments[3]);
    }
}

FileThread.prototype._thread = function (fnSuccess, fnError) {

    var pFile = this;
    var pManager = pFile._manager();
    var iThread = pManager.occupyThread();


    pFile._iThread = iThread;

    function release () {
        pManager.releaseThread(pFile._iThread);
        pFile._iThread = -1;
    }

    function setup (pThread) {
        var me = {};

        me.onmessage = fnSuccess || null;
        me.onerror = fnError || null;

        pThread.onmessage = function (e) {
            release();

            if (me.onmessage) {
                me.onmessage.call(pFile, e.data);
            }
        }

        pThread.onerror = function (e) {
            console.log('release thread(err)', e);
            release();

            if (me.onerror) {
                me.onerror.call(pFile, e.data);
            }
        }

        me.send = function (data) {
            pThread.postMessage(data);
        }

        return me;
    }


    return setup(pManager.thread(this._iThread));
};

FileThread.prototype._manager = function () {
    return this._pThreadManager;
};

FileThread.prototype._pThreadManager = null;


FileThread.prototype.open = function () {
    assert(arguments.length >= 0 && arguments.length < 5,
           "Invalid number(" + arguments.length + ") of parameters.");


    var fnSuccess, fnError, hasMode = ((typeof arguments[1]) != 'function');

    if (arguments.length < 3) {
        if (typeof arguments[0] == 'string') {
            this._pFileName = arguments[0];
            fnSuccess = arguments[1];
            fnError = null;
        }
        else if (typeof arguments[0] == 'number') {
            this._eFileMode = arguments[0];
            fnSuccess = arguments[1];
            fnError = null;
        }
        else {
            fnSuccess = arguments[0];
            fnError = arguments[1] || null;
        }

        assert(this._pFileName, "No filename provided.");


        this.open(this._pFileName, this._eFileMode, fnSuccess, fnError);
        return;
    }

    fnSuccess = arguments[hasMode ? 2 : 1];
    fnError = arguments[hasMode ? 3 : 2] || null;


    if (this.isOpened()) {
        warning('file already opened.');
        fnSuccess(this._pFile);
    }

    this._pFileName = a.uri(arguments[0]);
    this._eFileMode = (hasMode ? (typeof arguments[1] == 'string' ?
        a.io.stringTomode(arguments[1]) : arguments[1]) : this._eFileMode);

    this._update(function () {
        if (a.io.isAppend(this._eFileMode)) {
            this.position = this.size;
        }
        fnSuccess.call(this);
    }, fnError);

};

Define(FileThread.check(fn, args), function () {
    if (!this._pFile) {
        var pArgs = args;
        this.open(function () {
            fn.apply(this, pArgs);
        }, fnError);
        return;
    }

    debug_assert(this._iThread < 0, 'File(' + this.name + ') already in use. \n thread: ' + this._iThread);
});

Object.defineProperty(FileThread.prototype, 'path', {
    get: function () {
        assert(this._pFile, 'There is no file handle open.');
        return this._pFileName.toString();
    }
});

FileThread.prototype.close = function () {
    this._pFileName = null;
    this._eFileMode = a.io.IN | a.io.OUT;
    this._nLength = 0;
    this._nSeek = 0;
    safe_delete(this._pFile);
};

FileThread.prototype.clear = function (fnSuccess, fnError) {
    FileThread.check(this.clear, arguments);

    this._thread(fnSuccess, fnError).send({
                                              act:  a.FileThread.CLEAR,
                                              name: this._pFileName.toString(),
                                              mode: this._eFileMode
                                          });
};


Object.defineProperty(FileThread.prototype, 'name', {
    get: function () {
        return a.pathinfo(this._pFileName.path).basename;
    },

    set: function (sFileName) {
        assert(!this._pFile, 'There is file handle open.');
        var pPath = a.pathinfo(this._pFileName.path);
        pPath.basename = sFileName;
        this._pFileName.sPath = pPath.toString();
    }
});


FileThread.prototype.isOpened = function () {
    return this._pFile != null;
};

Object.defineProperty(FileThread.prototype, 'mode', {
    set: function (pMode) {
        this._eFileMode = (typeof pMode == 'string' ?
            a.io.stringTomode(pMode) : pMode);
    },
    get: function () {
        return this._eFileMode;
    }
});

Object.defineProperty(FileThread.prototype, 'onread', {
    set: function (fn) {
        this.read(fn);
    }
});

Object.defineProperty(FileThread.prototype, 'onopen', {
    set: function (fn) {
        this.read(fn);
    }
});

FileThread.prototype._update = function (fnSuccess, fnError) {
    var pThread = this._thread();
    var me = this;

    pThread.onmessage = function (e) {
        me._pFile = e;
        fnSuccess.call(me);
    };

    pThread.onerror = fnError;

    pThread.send({
                     act:  a.FileThread.OPEN,
                     name: this._pFileName.toString(),
                     mode: this._eFileMode
                 });
};

FileThread.prototype.read = function (fnSuccess, fnError) {
    FileThread.check(this.read, arguments);
    var pThread = this._thread();
    var me = this;

    assert(a.io.canRead(this._eFileMode), "The file is not readable.");

    pThread.onerror = fnError;

    pThread.onmessage = function (e) {
        if (me._eTransferMode == a.FileThread.TRANSFER.SLOW && a.io.isBinary(this._eFileMode)) {
            e = (new Uint8Array(e)).buffer;
        }
        me.atEnd();
        fnSuccess.call(me, e);
    };

    pThread.send({
                     act:      a.FileThread.READ,
                     name:     this._pFileName.toString(),
                     mode:     this._eFileMode,
                     pos:      this._nSeek,
                     transfer: this._eTransferMode
                 });
};

FileThread.prototype.write = function (pData, fnSuccess, fnError, sContentType) {
    FileThread.check(this.write, arguments);
    var pThread = this._thread();
    var me = this;
    var iMode = this._eFileMode;

    assert(a.io.canWrite(iMode), "The file is not writable.");

    pThread.onerror = fnError;

    pThread.onmessage = function (e) {
        me._pFile = e;
        me._nSeek += (typeof pData == 'string' ? pData.length : pData.byteLength);
        fnSuccess.apply(me, arguments);
    };

    sContentType = sContentType || (a.io.isBinary(iMode) ?
        'application/octet-stream' : 'text/plain');

    pThread.send({
                     act:         a.FileThread.WRITE,
                     name:        this._pFileName.toString(),
                     mode:        this._eFileMode,
                     data:        pData,
                     contentType: sContentType,
                     pos:         this._nSeek
                 });

};

FileThread.prototype.atEnd = function () {
    this.position = this.size;
};


Object.defineProperty(FileThread.prototype, 'position', {
    get: function () {
        assert(this._pFile, 'There is no file handle open.');
        return this._nSeek;
    },
    set: function (iOffset) {
        assert(this._pFile, 'There is no file handle open.');
        this._nSeek = iOffset;
    }
});

Object.defineProperty(FileThread.prototype, 'size', {
    get: function () {
        assert(this._pFile, 'There is no file handle open.');
        return this._pFile.size;
    }
});

FileThread.prototype.seek = function (iOffset) {
    assert(this._pFile, "There is no file handle open.");

    var nSeek = this._nSeek + iOffset;
    if (nSeek < 0) {
        nSeek = this.size - (Math.abs(nSeek) % this.size);
    }

    assert(nSeek >= 0 && nSeek <= this.size, "Invalid offset parameter");


    this._nSeek = nSeek;
};

FileThread.prototype.isExists = function (fnSuccess, fnError) {
    this._thread(fnSuccess, fnError).send({
                                              act:  a.FileThread.EXISTS,
                                              name: this._pFileName.toString(),
                                              mode: this._eFileMode
                                          });
};

FileThread.prototype.move = function (pFileName, fnSuccess, fnError) {
    var me = this;

    this.copy(pFileName, function () {
        me.remove(fnSuccess, fnError);
    }, fnError);

};

FileThread.prototype.rename = function (pFileName, fnSuccess, fnError) {
    var pName = a.pathinfo(pFileName);
    assert(!pName.dirname, 'only filename can be specified.');
    this.move(a.pathinfo(this._pFileName.path).sDirname + '/' + pName.basename, fnSuccess, fnError);
};

FileThread.prototype.copy = function (pFileName, fnSuccess, fnError) {
    var iMode = a.io.IN | a.io.OUT | a.io.TRUNC;
    if (a.io.isBinary(this._eFileMode)) {
        iMode |= a.io.BIN;
    }
    var me = this;

    var pFile = new this.constructor(pFileName, iMode,
                                     function () {
                                         me.read(function (pData) {
                                             pFile.write(pData, fnSuccess, fnError);
                                         });

                                     }, fnError);
};

FileThread.prototype.getMetadata = function (fnSuccess, fnError) {
    FileThread.check(this.getMetadata, arguments);
    fnSuccess({
                  lastModifiedDate: this._pFile.lastModifiedDate
              });
};

FileThread.prototype.remove = function (fnSuccess, fnError) {
    FileThread.check(this.remove, arguments);

    var pThread = this._thread();
    var me = this;

    pThread.onerror = fnError;

    pThread.onmessage = function (e) {
        me.close();
        if (fnSuccess) {
            fnSuccess.call(me, e);
        }
    };

    pThread.send({
                     act:  a.FileThread.REMOVE,
                     name: this._pFileName.toString(),
                     mode: this._eFileMode
                 });
};


a.FileThread = FileThread;