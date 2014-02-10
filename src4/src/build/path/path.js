/// <reference path="../idl/IPathinfo.ts" />
/// <reference path="../logger.ts" />
var akra;
(function (akra) {
    (function (path) {
        var Info = (function () {
            function Info(pPath) {
                this._sDirname = null;
                this._sExtension = null;
                this._sFilename = null;
                if (akra.isDef(pPath)) {
                    this.set(pPath);
                }
            }
            Info.prototype.getPath = function () {
                return this.toString();
            };

            Info.prototype.setPath = function (sPath) {
                this.set(sPath);
            };

            Info.prototype.getDirName = function () {
                return this._sDirname;
            };

            Info.prototype.setDirName = function (sDirname) {
                this._sDirname = sDirname;
            };

            Info.prototype.getFileName = function () {
                return this._sFilename;
            };

            Info.prototype.setFileName = function (sFilename) {
                this._sFilename = sFilename;
            };

            Info.prototype.getExt = function () {
                return this._sExtension;
            };

            Info.prototype.setExt = function (sExtension) {
                this._sExtension = sExtension;
            };

            Info.prototype.getBaseName = function () {
                return (this._sFilename ? this._sFilename + (this._sExtension ? "." + this._sExtension : "") : "");
            };

            Info.prototype.setBaseName = function (sBasename) {
                var nPos = sBasename.lastIndexOf(".");

                if (nPos < 0) {
                    this._sFilename = sBasename.substr(0);
                    this._sExtension = null;
                } else {
                    this._sFilename = sBasename.substr(0, nPos);
                    this._sExtension = sBasename.substr(nPos + 1);
                }
            };

            Info.prototype.set = function (sPath) {
                if (akra.isString(sPath)) {
                    var pParts = sPath.replace('\\', '/').split('/');

                    this.setBaseName(pParts.pop());

                    this._sDirname = pParts.join('/');
                } else if (sPath instanceof Info) {
                    this._sDirname = sPath.dirname;
                    this._sFilename = sPath.filename;
                    this._sExtension = sPath.ext;
                } else if (akra.isNull(sPath)) {
                    return null;
                } else {
                    //critical_error
                    akra.logger.error("Unexpected data type was used.", sPath);
                }
            };

            Info.prototype.isAbsolute = function () {
                return this._sDirname[0] === "/";
            };

            Info.prototype.toString = function () {
                return (this._sDirname ? this._sDirname + "/" : "") + (this.getBaseName());
            };
            return Info;
        })();

        function normalizeArray(parts, allowAboveRoot) {
            // if the path tries to go above the root, `up` ends up > 0
            var up = 0;
            for (var i = parts.length - 1; i >= 0; i--) {
                var last = parts[i];
                if (last === '.') {
                    parts.splice(i, 1);
                } else if (last === "..") {
                    parts.splice(i, 1);
                    up++;
                } else if (up) {
                    parts.splice(i, 1);
                    up--;
                }
            }

            // if the path is allowed to go above the root, restore leading ..s
            if (allowAboveRoot) {
                for (; up--; up) {
                    parts.unshift("..");
                }
            }

            return parts;
        }

        function normalize(sPath) {
            var info = parse(sPath);
            var isAbsolute = info.isAbsolute();
            var tail = info.getDirName();
            var trailingSlash = /[\\\/]$/.test(tail);

            tail = normalizeArray(tail.split(/[\\\/]+/).filter(function (p) {
                return !!p;
            }), !isAbsolute).join("/");

            if (tail && trailingSlash) {
                tail += "/";
            }

            info.setDirName((isAbsolute ? "/" : "") + tail);

            return info.toString();
        }
        path.normalize = normalize;

        function parse(path) {
            return new Info(path);
        }
        path.parse = parse;
    })(akra.path || (akra.path = {}));
    var path = akra.path;
})(akra || (akra = {}));
//# sourceMappingURL=path.js.map
