/// <reference path="../idl/AIUnPacker.ts" />
/// <reference path="../idl/AIMap.ts" />
/// <reference path="../idl/AIPackerFormat.ts" />

import BinReader = require("io/BinReader");


import limit = require("limit");
import logger = require("logger");



class UnPacker extends BinReader implements AIUnPacker {
    protected _pHashTable: any[] = <any[]><any>{};
    protected _pTemplate: AIPackerTemplate
    protected _pPositions: int[] = [];

    constructor(pBuffer, pTemlate: AIPackerTemplate) {
        super(pBuffer);
    }

    getTemplate(): AIPackerTemplate {
        return this._pTemplate;
    }

    private pushPosition(iPosition: uint): void {
        this._pPositions.push(this._iPosition);
        this._iPosition = iPosition;
    }

    private popPosition(): void {
        this._iPosition = this._pPositions.pop();
    }

    private memof(pObject: any, iAddr: int): void {
        this._pHashTable[iAddr] = pObject;
    }

    private memread(iAddr: int): any {
        return this._pHashTable[iAddr] || null;
    }


    private readPtr(iAddr: int, sType: string, pObject: any = null): any {
        if (iAddr === limit.MAX_UINT32) {
            return null;
        }

        var pTmp: any = this.memread(iAddr);
        var isReadNext: boolean = false;
        var fnReader: Function = null;
        var pTemplate: AIPackerTemplate = this.getTemplate();
        var pProperties: AIPackerCodec;

        if (isDefAndNotNull(pTmp)) {
            return pTmp;
        }

        if (iAddr === this._iPosition) {
            isReadNext = true;
        }
        else {
            //set new position
            this.pushPosition(iAddr);
        }

        pProperties = pTemplate.properties(sType);

        logger.presume(isDefAndNotNull(pProperties), "unknown object <" + sType + "> type cannot be readed");

        fnReader = pProperties.read;

        //read primal type
        if (isDefAndNotNull(fnReader)) {
            pTmp = fnReader.call(this, pObject);
            this.memof(pTmp, iAddr);

            //restore prev. position
            if (!isReadNext) {
                this.popPosition();
            }

            return pTmp;
        }

        logger.critical("unhandled case!");
        return null;
    }


    read(): any {
        var iAddr: int = this.uint32();

        if (iAddr === limit.MAX_UINT32) {
            return null;
        }

        var iType: int = this.uint32();
        var sType: string = this.getTemplate().getType(iType);

        return this.readPtr(iAddr, sType);
    }
}



export = UnPacker;