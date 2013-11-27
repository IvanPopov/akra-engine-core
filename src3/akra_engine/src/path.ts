/// <reference path="idl/AIPathinfo.ts" />

import logger = require("logger");

class Info implements AIPathinfo {
    private _sDirname: string = null;
    private _sExtension: string = null;
    private _sFilename: string = null;

    /** inline */ get path(): string { return this.toString(); }
    /** inline */ set path(sPath: string) { this.set(sPath); }

    /** inline */ get dirname(): string { return this._sDirname; }
    /** inline */ set dirname(sDirname: string) { this._sDirname = sDirname; }

    /** inline */ get filename(): string { return this._sFilename; }
    /** inline */ set filename(sFilename: string) { this._sFilename = sFilename; }

    /** inline */ get ext(): string { return this._sExtension; }
    /** inline */ set ext(sExtension: string) { this._sExtension = sExtension; }

    /** inline */ get basename(): string {
        return (this._sFilename ? this._sFilename + (this._sExtension ? "." + this._sExtension : "") : "");
    }

    /** inline */ set basename(sBasename: string) {
        var nPos: uint = sBasename.lastIndexOf(".");

        if (nPos < 0) {
            this._sFilename = sBasename.substr(0);
            this._sExtension = null;
        }
        else {
            this._sFilename = sBasename.substr(0, nPos);
            this._sExtension = sBasename.substr(nPos + 1);
        }
    }


    constructor(pPath: AIPathinfo);
    constructor(sPath: string);
    constructor(pPath?: any) {
        if (isDef(pPath)) {
            this.set(<string>pPath);
        }
    }


    set(sPath: string): void;
    set(pPath: AIPathinfo): void;
    set(sPath?: any) {
        if (isString(sPath)) {
            var pParts: string[] = sPath.replace('\\', '/').split('/');

            this.basename = pParts.pop();

            this._sDirname = pParts.join('/');
        }
        else if (sPath instanceof Info) {
            this._sDirname = sPath.dirname;
            this._sFilename = sPath.filename;
            this._sExtension = sPath.ext;
        }
        else if (isNull(sPath)) {
            return null;
        }
        else {
            //critical_error
            logger.error("Unexpected data type was used.", sPath);
        }
    }

    isAbsolute(): boolean { return this._sDirname[0] === "/"; }


    toString(): string {
        return (this._sDirname ? this._sDirname + "/" : "") + (this.basename);
    }
}

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


export function normalize(sPath: string): string {
    var info: AIPathinfo = info(sPath);
    var isAbsolute: boolean = info.isAbsolute();
    var tail: string = info.dirname;
    var trailingSlash: boolean = /[\\\/]$/.test(tail);

    tail = normalizeArray(tail.split(/[\\\/]+/).filter(function (p) {
        return !!p;
    }), !isAbsolute).join("/");

    if (tail && trailingSlash) {
        tail += "/";
    }

    info.dirname = (isAbsolute ? "/" : "") + tail;

    return info.toString();
}

export function parse(pPath: AIPathinfo): AIPathinfo;
export function parse(sPath: string): AIPathinfo;
export function parse(path?): AIPathinfo {
    return new Info(path);
}
