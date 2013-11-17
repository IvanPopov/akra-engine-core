/// <reference path="../idl/AIBrowserInfo.ts" />

import Singleton = require("Singleton");


interface AIBrowserData {
    string: string;
    subString: string;
    identity: string;
    versionSearch?: string;
    prop?: string;
}

class BrowserInfo extends Singleton<BrowserInfo> implements AIBrowserInfo {
    private _sBrowser: string = null;
    private _sVersion: string = null;
    private _sOS: string = null;
    private _sVersionSearch: string = null;

    constructor() {
        super();
        this.init();
    }

    get name(): string {
        return this._sBrowser;
    }

    get version(): string {
        return this._sVersion;
    }

    get os(): string {
        return this._sOS;
    }

    private init(): void {
        this._sBrowser = this.searchString(BrowserInfo.dataBrowser) || "An unknown browser";
        this._sVersion = this.searchVersion(navigator.userAgent)
        || this.searchVersion(navigator.appVersion)
        || "an unknown version";
        this._sOS = this.searchString(BrowserInfo.dataOS) || "an unknown OS";
    }

    private searchString(pDataBrowser: AIBrowserData[]): string {
        for (var i: int = 0; i < pDataBrowser.length; i++) {
            var sData: string = pDataBrowser[i].string;
            var dataProp: string = pDataBrowser[i].prop;

            this._sVersionSearch = pDataBrowser[i].versionSearch || pDataBrowser[i].identity;

            if (sData) {
                if (sData.indexOf(pDataBrowser[i].subString) != -1) {
                    return pDataBrowser[i].identity;
                }
            }
            else if (dataProp) {
                return pDataBrowser[i].identity;
            }
        }
        return null;
    }

    private searchVersion(sData: string): string {
        var iStartIndex: int = sData.indexOf(this._sVersionSearch);

        if (iStartIndex == -1) {
            return null;
        }

        iStartIndex = sData.indexOf('/', iStartIndex + 1);

        if (iStartIndex == -1) {
            return null;
        }

        var iEndIndex: int = sData.indexOf(' ', iStartIndex + 1);

        if (iEndIndex == -1) {
            iEndIndex = sData.indexOf(';', iStartIndex + 1);
            if (iEndIndex == -1) {
                return null;
            }
            return sData.slice(iStartIndex + 1);
        }

        return sData.slice((iStartIndex + 1), iEndIndex);
    }

    private static dataBrowser: AIBrowserData[] = [
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
            prop: (<any>window).opera,
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

    private static dataOS: AIBrowserData[] = [
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
}

export = BrowserInfo;