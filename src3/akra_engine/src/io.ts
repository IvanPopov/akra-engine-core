/// <reference path="idl/AEIO.ts" />
/// <reference path="idl/AIFile.ts" />

import TFile = require("io/TFile");
import LocalFile = require("io/LocalFile");
import StorageFile = require("io/StorageFile");

import bf = require("bitflags");
import info = require("info");
import uri = require("uri");

export function canCreate(mode: int): boolean { return bf.testBit(mode, 1); }
export function canRead(mode: int): boolean { return bf.testBit(mode, 0); }
export function canWrite(mode: int): boolean { return bf.testBit(mode, 1); }


export function isAppend(mode: int): boolean { return bf.testBit(mode, 3); }
export function isTrunc(mode: int): boolean { return bf.testBit(mode, 4); }
export function isBinary(mode: int): boolean { return bf.testBit(mode, 5); }
export function isText(mode: int): boolean { return bf.testBit(mode, 6); }
export function isJson(mode: int): boolean { return bf.testBit(mode, 7); }
export function isUrl(mode: int): boolean { return bf.testBit(mode, 8); }

/*local and remote via thread*/
/*local file via local files system(async)*/
/*local file via local files system(async)*/


export function filemode(sMode: string): int {
    switch (sMode.toLowerCase()) {
        //URL
        case "a+u":
            return AEIO.IN | AEIO.OUT | AEIO.APP | AEIO.URL;
        case "w+u":
            return AEIO.IN | AEIO.OUT | AEIO.TRUNC | AEIO.URL;
        case "r+u":
            return AEIO.IN | AEIO.OUT | AEIO.URL;

        case "au":
            return AEIO.APP | AEIO.URL;
        case "wu":
            return AEIO.OUT | AEIO.URL;
        case "ru":
            return AEIO.IN | AEIO.URL;

        //JSON
        case "a+j":
            return AEIO.IN | AEIO.OUT | AEIO.APP | AEIO.JSON;
        case "w+j":
            return AEIO.IN | AEIO.OUT | AEIO.TRUNC | AEIO.JSON;
        case "r+j":
            return AEIO.IN | AEIO.OUT | AEIO.JSON;

        case "aj":
            return AEIO.APP | AEIO.JSON;
        case "wj":
            return AEIO.OUT | AEIO.JSON;
        case "rj":
            return AEIO.IN | AEIO.JSON;

        //TEXT
        case "a+t":
            return AEIO.IN | AEIO.OUT | AEIO.APP | AEIO.TEXT;
        case "w+t":
            return AEIO.IN | AEIO.OUT | AEIO.TRUNC | AEIO.TEXT;
        case "r+t":
            return AEIO.IN | AEIO.OUT | AEIO.TEXT;

        case "at":
            return AEIO.APP | AEIO.TEXT;
        case "wt":
            return AEIO.OUT | AEIO.TEXT;
        case "rt":
            return AEIO.IN | AEIO.TEXT;

        case "a+b":
            return AEIO.IN | AEIO.OUT | AEIO.APP | AEIO.BIN;
        case "w+b":
            return AEIO.IN | AEIO.OUT | AEIO.TRUNC | AEIO.BIN;
        case "r+b":
            return AEIO.IN | AEIO.OUT | AEIO.BIN;

        case "ab":
            return AEIO.APP | AEIO.BIN;
        case "wb":
            return AEIO.OUT | AEIO.BIN;
        case "rb":
            return AEIO.IN | AEIO.BIN;

        case "a+":
            return AEIO.IN | AEIO.OUT | AEIO.APP;
        case "w+":
            return AEIO.IN | AEIO.OUT | AEIO.TRUNC;
        case "r+":
            return AEIO.IN | AEIO.OUT;

        case "a":
            return AEIO.APP | AEIO.OUT;
        case "w":
            return <number>AEIO.OUT;
        case "r":
        default:
            return <number>AEIO.IN;
    }
}


export function fopen(sUri: string, pMode: any = AEIO.IN): AIFile {
    sUri = uri.resolve(sUri);

    if (info.api.webWorker) {
        return new TFile(<string>sUri, pMode);
    }
    else if (info.api.fileSystem) {
        return new LocalFile(<string>sUri, pMode);
    }
    else {
        return new StorageFile(<string>sUri, pMode);
    }
}

