/// <reference path="../idl/EIO.ts" />
/// <reference path="../idl/IFile.ts" />

/// <reference path="TFile.ts" />
/// <reference path="LocalFile.ts" />
/// <reference path="StorageFile.ts" />

/// <reference path="Packer.ts" />
/// <reference path="UnPacker.ts" />

/// <reference path="BinReader.ts" />
/// <reference path="BinWriter.ts" />

/// <reference path="../bf/bf.ts" />
/// <reference path="../info/info.ts" />
/// <reference path="../uri/uri.ts" />

/// <reference path="templates/common.ts" />

module akra.io {


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
                return EIO.IN | EIO.OUT | EIO.APP | EIO.URL;
            case "w+u":
                return EIO.IN | EIO.OUT | EIO.TRUNC | EIO.URL;
            case "r+u":
                return EIO.IN | EIO.OUT | EIO.URL;

            case "au":
                return EIO.APP | EIO.URL;
            case "wu":
                return EIO.OUT | EIO.URL;
            case "ru":
                return EIO.IN | EIO.URL;

            //JSON
            case "a+j":
                return EIO.IN | EIO.OUT | EIO.APP | EIO.JSON;
            case "w+j":
                return EIO.IN | EIO.OUT | EIO.TRUNC | EIO.JSON;
            case "r+j":
                return EIO.IN | EIO.OUT | EIO.JSON;

            case "aj":
                return EIO.APP | EIO.JSON;
            case "wj":
                return EIO.OUT | EIO.JSON;
            case "rj":
                return EIO.IN | EIO.JSON;

            //TEXT
            case "a+t":
                return EIO.IN | EIO.OUT | EIO.APP | EIO.TEXT;
            case "w+t":
                return EIO.IN | EIO.OUT | EIO.TRUNC | EIO.TEXT;
            case "r+t":
                return EIO.IN | EIO.OUT | EIO.TEXT;

            case "at":
                return EIO.APP | EIO.TEXT;
            case "wt":
                return EIO.OUT | EIO.TEXT;
            case "rt":
                return EIO.IN | EIO.TEXT;

            case "a+b":
                return EIO.IN | EIO.OUT | EIO.APP | EIO.BIN;
            case "w+b":
                return EIO.IN | EIO.OUT | EIO.TRUNC | EIO.BIN;
            case "r+b":
                return EIO.IN | EIO.OUT | EIO.BIN;

            case "ab":
                return EIO.APP | EIO.BIN;
            case "wb":
                return EIO.OUT | EIO.BIN;
            case "rb":
                return EIO.IN | EIO.BIN;

            case "a+":
                return EIO.IN | EIO.OUT | EIO.APP;
            case "w+":
                return EIO.IN | EIO.OUT | EIO.TRUNC;
            case "r+":
                return EIO.IN | EIO.OUT;

            case "a":
                return EIO.APP | EIO.OUT;
            case "w":
                return <number>EIO.OUT;
            case "r":
            default:
                return <number>EIO.IN;
        }
    }


    export function fopen(sUri: string, pMode: any = EIO.IN): IFile {
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



    export function dump(pObject: any, pTemplate: IPackerTemplate = null): ArrayBuffer {
        var pPacker: IPacker = new Packer(pTemplate || templates.common);
        pPacker.write(pObject);
        return pPacker.data();
    }

    export function undump(pBuffer: any, pTemplate: IPackerTemplate = null): any {
        if (!isDefAndNotNull(pBuffer)) {
            return null;
        }
        var pUnPacker: IUnPacker = new UnPacker(pBuffer, pTemplate);
        return pUnPacker.read();
    }

}