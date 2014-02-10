/// <reference path="../idl/IURI.ts" />
/// <reference path="../idl/IDataURI.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../path/path.ts" />
var akra;
(function (akra) {
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
            URI.prototype.getURN = function () {
                return (this.sPath ? this.sPath : "") + (this.sQuery ? '?' + this.sQuery : "") + (this.sFragment ? '#' + this.sFragment : "");
            };

            URI.prototype.getURL = function () {
                return (this.sScheme ? this.sScheme : "") + this.getAuthority();
            };

            URI.prototype.getAuthority = function () {
                return (this.sHost ? '//' + (this.sUserinfo ? this.sUserinfo + '@' : "") + this.sHost + (this.nPort ? ':' + this.nPort : "") : "");
            };

            URI.prototype.getScheme = function () {
                return this.sScheme;
            };

            URI.prototype.getProtocol = function () {
                if (!this.sScheme) {
                    return this.sScheme;
                }

                return (this.sScheme.substr(0, this.sScheme.lastIndexOf(':')));
            };

            URI.prototype.getUserInfo = function () {
                return this.sUserinfo;
            };

            URI.prototype.getHost = function () {
                return this.sHost;
            };

            URI.prototype.setHost = function (sHost) {
                //TODO: check host format
                this.sHost = sHost;
            };

            URI.prototype.getPort = function () {
                return this.nPort;
            };

            URI.prototype.setPort = function (iPort) {
                this.nPort = iPort;
            };

            URI.prototype.getPath = function () {
                return this.sPath;
            };

            URI.prototype.setPath = function (sPath) {
                // debug_assert(!isNull(sPath.match(new RegExp("^(/(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)$"))),
                // 	"invalid path used: " + sPath);
                //TODO: check path format
                this.sPath = sPath;
            };

            URI.prototype.getQuery = function () {
                //TODO: check query format
                return this.sQuery;
            };

            URI.prototype.setQuery = function (sQuery) {
                this.sQuery = sQuery;
            };

            URI.prototype.getFragment = function () {
                return this.sFragment;
            };

            URI.prototype.set = function (pData) {
                if (akra.isString(pData)) {
                    var pUri = URI.uriExp.exec(pData);

                    akra.logger.assert(pUri !== null, 'Invalid URI format used.\nused uri: ' + pData);

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

                akra.logger.error('Unexpected data type was used.');

                return null;
            };

            URI.prototype.toString = function () {
                return this.getURL() + this.getURN();
            };

            URI.uriExp = new RegExp("^([a-z0-9+.-]+:)?(?:\\/\\/(?:((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(?::(\\d*))?(\\/(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?|(\\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})*(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?)(?:\\?((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?$", "i");
            return URI;
        })();

        function normalizeURIPath(pFile) {
            if (!akra.isNull(pFile.getPath())) {
                if (pFile.getScheme() === "filesystem:") {
                    var pUri = parse(pFile.getPath());

                    pUri.setPath(akra.path.normalize(pUri.getPath()));
                    pFile.setPath(pUri.toString());
                } else {
                    pFile.setPath(akra.path.normalize(pFile.getPath()));
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

            if (!akra.isNull(pFile.getScheme()) || !akra.isNull(pFile.getHost()) || akra.path.parse(pFile.getPath()).isAbsolute()) {
                //another server or absolute path
                return sFrom;
            }

            sDirname = akra.path.parse(pCurrentPath.getPath()).getDirName();
            pCurrentPath.setPath(sDirname ? (sDirname + "/" + sFrom) : sFrom);

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
                charset: akra.isString(m[2]) ? m[2].substr(9) : null,
                //like [;base64]
                base64: akra.isDef(m[3]),
                data: m[4] || null
            };
        }
        uri.parseDataURI = parseDataURI;

        function parse(sUri) {
            return new URI(sUri);
        }
        uri.parse = parse;

        function currentPath() {
            var pUri = uri.parse(document.currentScript.src);
            var sDirname = akra.path.parse(pUri.getPath()).getDirName();
            return pUri.getURL() + sDirname + "/";
        }
        uri.currentPath = currentPath;

        function here() {
            return new URI(document.location.href);
        }
        uri.here = here;
    })(akra.uri || (akra.uri = {}));
    var uri = akra.uri;
})(akra || (akra = {}));
//# sourceMappingURL=uri.js.map
