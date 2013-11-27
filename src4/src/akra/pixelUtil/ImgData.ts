/// <reference path="../idl/AIImgCodec.ts" />
/// <reference path="../idl/AEPixelFormats.ts" />

import CodecData = require("pixelUtil/CodecData");
import Img = require("resources/Img");

class ImgData extends CodecData implements AIImgData {

    protected _iHeight: uint = 0;
    protected _iWidth: uint = 0;
    protected _iDepth: uint = 1;
    protected _iSize: uint = 0;
    protected _iCubeFlags: uint;

    protected _nMipMaps: uint = 0;
    protected _iFlags: uint = 0;

    protected _eFormat: AEPixelFormats = AEPixelFormats.UNKNOWN;


    /** inline */ get width(): uint {
        return this._iWidth;
    }
    /** inline */ set width(iWidth: uint) {
        this._iWidth = iWidth;
    }


    /** inline */ get height(): uint {
        return this._iHeight;
    }
    /** inline */ set height(iHeight: uint) {
        this._iHeight = iHeight;
    }

    /** inline */ get depth(): uint {
        return this._iDepth;
    }
    /** inline */ set depth(iDepth: uint) {
        this._iDepth = iDepth;
    }


    /** inline */ get size(): uint {
        return Img.calculateSize(this.numMipMaps, this.numFace, this.width, this.height, this.depth, this.format);
    }

    /** inline */ get numMipMaps(): uint {
        return this._nMipMaps;
    }

    /** inline */ set numMipMaps(nNumMipMaps: uint) {
        this._nMipMaps = nNumMipMaps;
    }

    /** inline */ get format(): AEPixelFormats {
        return this._eFormat;
    }

    /** inline */ set format(ePixelFormat: AEPixelFormats) {
        this._eFormat = ePixelFormat;
    }

    /** inline */ get flags(): uint {
        return this._iFlags;
    }

    /** inline */ set flags(iFlags: uint) {
        this._iFlags = iFlags;
    }

    /** inline */ get cubeFlags(): uint {
        return this._iCubeFlags;
    }

    /** inline */ set cubeFlags(iFlags: uint) {
        this._iCubeFlags = iFlags;
    }

    /** inline */ get numFace(): uint {
        if (this._iFlags & AEImageFlags.CUBEMAP) {
            var nFace: uint = 0;
            for (var i: uint = 0; i < 32; i++) {
                nFace++;
            }
            return nFace;
        }
        else {
            return 1;
        }
    }

    /** inline */ get dataType(): string {
        return "ImgData";
    }
}

export = ImgData;