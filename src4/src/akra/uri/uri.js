var akra;
(function (akra) {
    /// <reference path="../idl/IURI.ts" />
    /// <reference path="../idl/IDataURI.ts" />
    /// <reference path="../logger.ts" />
    /// <reference path="../path/path.ts" />
    (function (uri) {
        var URI = (function () {
            function URI(pUri) {
                this.sScheme = null;
                this.sUserinfo = null;
                this.sHost = null;
                this.nPort = 0;
                this.sPath = null;
                this.sQuery = null;
                this.sFragment = null;
                if (pUri) {
                    this.set(pUri);
                }
            }
            Object.defineProperty(URI.prototype, "urn", {
                get: function () {
                    return (this.sPath ? this.sPath : "") + (this.sQuery ? '?' + this.sQuery : "") + (this.sFragment ? '#' + this.sFragment : "");
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(URI.prototype, "url", {
                get: function () {
                    return (this.sScheme ? this.sScheme : "") + this.authority;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(URI.prototype, "authority", {
                get: function () {
                    return (this.sHost ? '//' + (this.sUserinfo ? this.sUserinfo + '@' : "") + this.sHost + (this.nPort ? ':' + this.nPort : "") : "");
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(URI.prototype, "scheme", {
                get: function () {
                    return this.sScheme;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(URI.prototype, "protocol", {
                get: function () {
                    if (!this.sScheme) {
                        return this.sScheme;
                    }

                    return (this.sScheme.substr(0, this.sScheme.lastIndexOf(':')));
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(URI.prototype, "userinfo", {
                get: function () {
                    return this.sUserinfo;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(URI.prototype, "host", {
                get: function () {
                    return this.sHost;
                },
                set: function (sHost) {
                    //TODO: check host format
                    this.sHost = sHost;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(URI.prototype, "port", {
                get: function () {
                    return this.nPort;
                },
                set: function (iPort) {
                    this.nPort = iPort;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(URI.prototype, "path", {
                get: function () {
                    return this.sPath;
                },
                set: function (sPath) {
                    // debug_assert(!isNull(sPath.match(new RegExp("^(/(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)$"))),
                    // 	"invalid path used: " + sPath);
                    //TODO: check path format
                    this.sPath = sPath;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(URI.prototype, "query", {
                get: function () {
                    //TODO: check query format
                    return this.sQuery;
                },
                set: function (sQuery) {
                    this.sQuery = sQuery;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(URI.prototype, "fragment", {
                get: function () {
                    return this.sFragment;
                },
                enumerable: true,
                configurable: true
            });

            URI.prototype.set = function (pData) {
                if (isString(pData)) {
                    var pUri = URI.uriExp.exec(pData);

                    logger.assert(pUri !== null, 'Invalid URI format used.\nused uri: ' + pData);

                    if (!pUri) {
                        return null;
                    }

                    this.sScheme = pUri[1] || null;
                    this.sUserinfo = pUri[2] || null;
                    this.sHost = pUri[3] || null;
                    this.nPort = parseInt(pUri[4]) || null;
                    this.sPath = pUri[5] || pUri[6] || null;
                    this.sQuery = pUri[7] || null;
                    this.sFragment = pUri[8] || null;

                    return this;
                } else if (pData instanceof URI) {
                    return this.set(pData.toString());
                }

                logger.error('Unexpected data type was used.');

                return null;
            };

            URI.prototype.toString = function () {
                return this.url + this.urn;
            };

            URI.here = function () {
                return new URI(document.location.href);
            };

            URI.uriExp = new RegExp("^([a-z0-9+.-]+:)?(?:\\/\\/(?:((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(?::(\\d*))?(\\/(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?|(\\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})*(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?)(?:\\?((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?$", "i");
            return URI;
        })();

        function normalizeURIPath(pFile) {
            if (!isNull(pFile.path)) {
                if (pFile.scheme === "filesystem:") {
                    var pUri = parse(pFile.path);

                    pUri.path = path.normalize(pUri.path);
                    pFile.path = pUri.toString();
                } else {
                    pFile.path = path.normalize(pFile.path);
                }
            }

            return pFile;
        }

        function resolve(sFrom, sTo) {
            if (typeof sTo === "undefined") { sTo = document.location.href; }
            var pCurrentPath = parse(sTo);
            var pFile = parse(sFrom);
            var sDirname;

            normalizeURIPath(pFile);
            normalizeURIPath(pCurrentPath);

            if (!isNull(pFile.scheme) || !isNull(pFile.host) || path.parse(pFile.path).isAbsolute()) {
                //another server or absolute path
                return sFrom;
            }

            sDirname = path.parse(pCurrentPath.path).dirname;
            pCurrentPath.path = sDirname ? sDirname + "/" + sFrom : sFrom;

            return normalizeURIPath(pCurrentPath).toString();
        }
        uri.resolve = resolve;

        function parseDataURI(sUri) {
            var re = /^data:([\w\d\-\/]+)?(;charset=[\w\d\-]*)?(;base64)?,(.*)$/;
            var m = sUri.match(re);

            return {
                //like [text/plain]
                mediatype: m[1] || null,
                //like [;charset=windows-1251]
                charset: isString(m[2]) ? m[2].substr(9) : null,
                //like [;base64]
                base64: isDef(m[3]),
                data: m[4] || null
            };
        }
        uri.parseDataURI = parseDataURI;

        function parse(sUri) {
            return new URI(sUri);
        }
        uri.parse = parse;
    })(akra.uri || (akra.uri = {}));
    var uri = akra.uri;
})(akra || (akra = {}));
