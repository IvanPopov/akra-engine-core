/// <reference path="../idl/AIPixelBox.ts" />
/// <reference path="../idl/AIImg.ts" />
/// <reference path="../idl/AEPixelFormats.ts" />

import Box = require("geometry/Box");
import pixelUtil = require("pixelUtil");
import logger = require("logger");
import Color = require("color/Color");
import gen = require("generate");

var pBuffer: AIPixelBox[];
var iElement: uint;

class PixelBox extends Box implements AIPixelBox {
    data: Uint8Array;
    format: AEPixelFormats;
    rowPitch: uint;
    slicePitch: uint;

    constructor();
    constructor(iWidth: uint, iHeight: uint, iDepth: uint, ePixelFormat: AEPixelFormats, pPixelData?: any);
    constructor(pExtents: AIBox, ePixelFormat: AEPixelFormats, pPixelData?: Uint8Array);
    constructor(iWidth?: any, iHeight?: any, iDepth?: any, ePixelFormat?: any, pPixelData: Uint8Array = null) {
        if (arguments.length === 0) {
            super();
            this.data = null;
            this.format = AEPixelFormats.UNKNOWN;
            this.setConsecutive();
            return;
        }

        if (arguments.length >= 4) {
            super(0, 0, 0, <uint>iWidth, <uint>iHeight, <uint>iDepth);
            this.data = isDef(arguments[4]) ? (<Uint8Array>arguments[4]) : null;
            this.format = <AEPixelFormats>arguments[3];
        }
        else {
            super(<AIBox>arguments[0]);
            this.data = <Uint8Array>arguments[2];
            this.format = <AEPixelFormats>arguments[1];
        }

        this.setConsecutive();
    }

    setConsecutive(): void {
        this.rowPitch = this.width;
        this.slicePitch = this.width * this.height;
    }

    getRowSkip(): uint { return this.rowPitch - this.width; }
    getSliceSkip(): uint { return this.slicePitch - (this.height * this.rowPitch); }

    isConsecutive(): boolean {
        return this.rowPitch == this.width && this.slicePitch == this.width * this.height;
    }

    getConsecutiveSize(): uint {
        return pixelUtil.getMemorySize(this.width, this.height, this.depth, this.format);
    }

    getSubBox(pDest: AIBox, pDestPixelBox: AIPixelBox = null): PixelBox {
        if (pixelUtil.isCompressed(this.format)) {
            if (pDest.left == this.left && pDest.top == this.top && pDest.front == this.front &&
                pDest.right == this.right && pDest.bottom == this.bottom && pDest.back == this.back) {
                // Entire buffer is being queried
                return this;
            }

            logger.error("Cannot return subvolume of compressed PixelBuffer", "PixelBox::getSubVolume");
        }

        if (!this.contains(pDest)) {
            logger.error("Bounds out of range", "PixelBox::getSubVolume");
        }

        var elemSize: uint = pixelUtil.getNumElemBytes(this.format);
        // Calculate new data origin
        // Notice how we do not propagate left/top/front from the incoming box, since
        // the returned pointer is already offset

        var rval: PixelBox = null;

        if (isNull(pDestPixelBox)) {
            rval = new PixelBox();
        }
        else {
            rval = <PixelBox>pDestPixelBox;
        }

        rval.setPosition(0, 0, pDest.width, pDest.height, 0, pDest.depth);
        rval.format = this.format;
        rval.data = (<Uint8Array> this.data).subarray(((pDest.left - this.left) * elemSize)
            + ((pDest.top - this.top) * this.rowPitch * elemSize)
            + ((pDest.front - this.front) * this.slicePitch * elemSize));

        rval.rowPitch = this.rowPitch;
        rval.slicePitch = this.slicePitch;
        rval.format = this.format;

        return rval;
    }

    getColorAt(pColor: AIColor, x: uint, y: uint, z: uint = 0): AIColor {
        if (isNull(pColor)) {
            pColor = new Color(0.);
        }

        var pixelSize: uint = pixelUtil.getNumElemBytes(this.format);
        var pixelOffset: uint = pixelSize * (z * this.slicePitch + y * this.rowPitch + x);

        pixelUtil.unpackColour(pColor, this.format, this.data.subarray(pixelOffset, pixelOffset + pixelSize));

        return pColor;
    }

    setColorAt(pColor: AIColor, x: uint, y: uint, z: uint = 0): void {
        var pixelSize: uint = pixelUtil.getNumElemBytes(this.format);
        var pixelOffset: uint = pixelSize * (z * this.slicePitch + y * this.rowPitch + x);
        pixelUtil.packColour(pColor, this.format, this.data.subarray(pixelOffset, pixelOffset + pixelSize));
    }

    scale(pDest: AIPixelBox, eFilter: AEFilters = AEFilters.BILINEAR): boolean {
        return false;
    }

    refresh(pExtents: AIBox, ePixelFormat: AEPixelFormats, pPixelData: Uint8Array): void {
        this.left = pExtents.left;
        this.top = pExtents.top;
        this.front = pExtents.front;

        this.right = pExtents.right;
        this.bottom = pExtents.bottom;
        this.back = pExtents.back;

        this.data = pPixelData;
        this.format = ePixelFormat;

        this.setConsecutive();
    }

    toString(): string {
        return "|---------------------------|\n" +
            super.toString() + "\n" +
            "length: " + (this.data ? this.data.length : 0) + "\n" +
            "|---------------------------|";
    }
    static temp(): AIPixelBox;
    static temp(iWidth: uint, iHeight: uint, iDepth: uint, ePixelFormat: AEPixelFormats, pPixelData?: Uint8Array): AIPixelBox;
    static temp(pExtents: AIBox, ePixelFormat: AEPixelFormats, pPixelData?: Uint8Array): AIPixelBox;
    static temp(): AIPixelBox {
        iElement = (iElement === pBuffer.length - 1 ? 0 : pBuffer.length);
        var pPixelBox: AIPixelBox = pBuffer[iElement++];

        var pBox: AIBox = null;
        var pPixelData: Uint8Array = null;
        var ePixelFormat: AEPixelFormats = AEPixelFormats.UNKNOWN;

        switch (arguments.length) {
            case 2:
            case 3:
                pBox = arguments[0];
                ePixelFormat = arguments[1];
                pPixelData = arguments[2] || null;
                break;
            case 4:
            case 5:
                pBox = Box.temp(0, 0, 0, arguments[0], arguments[1], arguments[2]);
                ePixelFormat = arguments[3];
                pPixelData = arguments[4] || null;
                break;
            default:
                pBox = Box.temp(0, 0, 0, 1, 1, 1);
                break;
        }

        pPixelBox.refresh(pBox, ePixelFormat, pPixelData);

        return pPixelBox;
    }
}

pBuffer = gen.array<AIPixelBox>(20, PixelBox);
iElement = 0;

export = PixelBox;