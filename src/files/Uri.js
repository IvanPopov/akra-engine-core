if (!a) {
    var a = {};
}

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
Object.defineProperty(URI.prototype, 'port', {
    get: function () {
        return this.nPort;
    },
    set: function (iPort) {
        this.nPort = parseInt(iPort);
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