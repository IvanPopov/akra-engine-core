/// <reference path="../idl/IBrowserInfo.ts" />
/// <reference path="../util/Singleton.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (info) {
        var Singleton = akra.util.Singleton;

        var BrowserInfo = (function (_super) {
            __extends(BrowserInfo, _super);
            function BrowserInfo() {
                _super.call(this);
                this._sBrowser = null;
                this._sVersion = null;
                this._sOS = null;
                this._sVersionSearch = null;

                this.init();
            }
            BrowserInfo.prototype.getName = function () {
                return this._sBrowser;
            };

            BrowserInfo.prototype.getVersion = function () {
                return this._sVersion;
            };

            BrowserInfo.prototype.getOS = function () {
                return this._sOS;
            };

            BrowserInfo.prototype.init = function () {
                this._sBrowser = this.searchString(BrowserInfo.dataBrowser) || "An unknown browser";
                this._sVersion = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
                this._sOS = this.searchString(BrowserInfo.dataOS) || "an unknown OS";
            };

            BrowserInfo.prototype.searchString = function (pDataBrowser) {
                for (var i = 0; i < pDataBrowser.length; i++) {
                    var sData = pDataBrowser[i].string;
                    var dataProp = pDataBrowser[i].prop;

                    this._sVersionSearch = pDataBrowser[i].versionSearch || pDataBrowser[i].identity;

                    if (sData) {
                        if (sData.indexOf(pDataBrowser[i].subString) != -1) {
                            return pDataBrowser[i].identity;
                        }
                    } else if (dataProp) {
                        return pDataBrowser[i].identity;
                    }
                }
                return null;
            };

            BrowserInfo.prototype.searchVersion = function (sData) {
                var iStartIndex = sData.indexOf(this._sVersionSearch);

                if (iStartIndex == -1) {
                    return null;
                }

                iStartIndex = sData.indexOf('/', iStartIndex + 1);

                if (iStartIndex == -1) {
                    return null;
                }

                var iEndIndex = sData.indexOf(' ', iStartIndex + 1);

                if (iEndIndex == -1) {
                    iEndIndex = sData.indexOf(';', iStartIndex + 1);
                    if (iEndIndex == -1) {
                        return null;
                    }
                    return sData.slice(iStartIndex + 1);
                }

                return sData.slice((iStartIndex + 1), iEndIndex);
            };

            BrowserInfo.dataBrowser = [
                {
                    string: navigator.userAgent,
                    subString: "Chrome",
                    identity: "Chrome"
                },
                {
                    string: navigator.userAgent,
                    subString: "OmniWeb",
                    versionSearch: "OmniWeb/",
                    identity: "OmniWeb"
                },
                {
                    string: navigator.vendor,
                    subString: "Apple",
                    identity: "Safari",
                    versionSearch: "Version"
                },
                {
                    string: null,
                    subString: null,
                    prop: window.opera,
                    identity: "Opera",
                    versionSearch: "Version"
                },
                {
                    string: navigator.vendor,
                    subString: "iCab",
                    identity: "iCab"
                },
                {
                    string: navigator.vendor,
                    subString: "KDE",
                    identity: "Konqueror"
                },
                {
                    string: navigator.userAgent,
                    subString: "Firefox",
                    identity: "Firefox"
                },
                {
                    string: navigator.vendor,
                    subString: "Camino",
                    identity: "Camino"
                },
                {
                    // for newer Netscapes (6+)
                    string: navigator.userAgent,
                    subString: "Netscape",
                    identity: "Netscape"
                },
                {
                    string: navigator.userAgent,
                    subString: "MSIE",
                    identity: "Explorer",
                    versionSearch: "MSIE"
                },
                {
                    string: navigator.userAgent,
                    subString: "Gecko",
                    identity: "Mozilla",
                    versionSearch: "rv"
                },
                {
                    // for older Netscapes (4-)
                    string: navigator.userAgent,
                    subString: "Mozilla",
                    identity: "Netscape",
                    versionSearch: "Mozilla"
                }
            ];

            BrowserInfo.dataOS = [
                {
                    string: navigator.platform,
                    subString: "Win",
                    identity: "Windows"
                },
                {
                    string: navigator.platform,
                    subString: "Mac",
                    identity: "Mac"
                },
                {
                    string: navigator.userAgent,
                    subString: "iPhone",
                    identity: "iPhone/iPod"
                },
                {
                    string: navigator.platform,
                    subString: "Linux",
                    identity: "Linux"
                }
            ];
            return BrowserInfo;
        })(Singleton);
        info.BrowserInfo = BrowserInfo;
    })(akra.info || (akra.info = {}));
    var info = akra.info;
})(akra || (akra = {}));
//# sourceMappingURL=BrowserInfo.js.map
