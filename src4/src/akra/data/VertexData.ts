/// <reference path="../idl/IVertexData.ts" />
/// <reference path="../idl/IVertexBuffer.ts" />
/// <reference path="../idl/IVertexElement.ts" />
/// <reference path="../idl/IVertexDeclaration.ts" />
/// <reference path="../idl/IBufferDataModifier.ts" />

/// <reference path="../math/math.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../events.ts" />
/// <reference path="../conv/conv.ts" />
/// <reference path="../config/config.ts" />
/// <reference path="../guid.ts" />

/// <reference path="VertexDeclaration.ts" />

module akra.data {

    enum AEVertexDataLimits {
        k_MaxElementsSize = 256
    }

    export class VertexData implements IVertexData {
        guid: uint = guid();
              
        resized: ISignal<{ (pData: IVertexData, iByteLength: uint): void; }> = new Signal(this);
        relocated: ISignal<{ (pData: IVertexData, iFrom: uint, iTo: uint): void; }> = new Signal(this);
        declarationChanged: ISignal<{ (pData: IVertexData, pDecl: IVertexDeclaration): void; }> = new Signal(this);
        updated: ISignal<{ (pData: IVertexData): void; }> = new Signal(this);

        private _pVertexBuffer: IVertexBuffer;
        private _iOffset: uint;
        private _iStride: uint;
        private _iLength: uint;
        private _pVertexDeclaration: VertexDeclaration;
        private _iId: uint;

        get id(): uint { return this._iId; }
        get length(): uint { return this._iLength; }
        get byteOffset(): uint { return this._iOffset; }
        get byteLength(): uint { return this._iLength * this._iStride; }
        get buffer(): IVertexBuffer { return this._pVertexBuffer; }
        get stride(): uint { return this._iStride; }
        get startIndex(): uint {
            var iIndex: uint = this.byteOffset / this.stride;
            logger.assert(iIndex % 1 == 0, "cannot calc first element index");
            return iIndex;
        }


        constructor(pVertexBuffer: IVertexBuffer, id: uint, iOffset: uint, iCount: uint, nSize: uint);
        constructor(pVertexBuffer: IVertexBuffer, id: uint, iOffset: uint, iCount: uint, pDecl: IVertexDeclaration);
        constructor(pVertexBuffer: IVertexBuffer, id: uint, iOffset: uint, iCount: uint, pDecl: any) {

            this._pVertexBuffer = pVertexBuffer;
            this._iOffset = iOffset;
            this._iLength = iCount;
            this._iId = id;
            this._pVertexDeclaration = null;
            this._iStride = 0;

            if (isInt(pDecl)) {
                this._iStride = <uint>pDecl;
            }
            else {
                this._iStride = pDecl.stride;
                this.setVertexDeclaration(pDecl);
            }

            logger.assert(pVertexBuffer.byteLength >= this.byteLength + this.byteOffset,
                "vertex data out of array limits");
        }


        getVertexDeclaration(): IVertexDeclaration {
            return this._pVertexDeclaration;
        }

        setVertexDeclaration(pDecl: IVertexDeclaration): boolean {
            if (this._pVertexDeclaration) {
                //debug_error("vertex declaration already exists");

                return false;
            }

            var iStride: uint = pDecl.stride;

            this._pVertexDeclaration = <VertexDeclaration>pDecl.clone();


            logger.assert(iStride < <number>AEVertexDataLimits.k_MaxElementsSize,
                "stride max is 255 bytes");
            logger.assert(iStride <= this.stride,
                "stride in VertexDeclaration grather than stride in construtor");

            this.declarationChanged.emit(this._pVertexDeclaration);

            return true;
        }

        getVertexElementCount(): uint {
            return this._pVertexDeclaration.length;
        }

        hasSemantics(sUsage: string): boolean {
            if (this._pVertexDeclaration != null) {
                return this._pVertexDeclaration.hasSemantics(sUsage);
            }

            return false;
        }

        destroy(): void {
            this._pVertexDeclaration = null;
            this._iLength = 0;
        }

        extend(pDecl: IVertexDeclaration, pData: ArrayBufferView = null): boolean {
            pDecl = VertexDeclaration.normalize(pDecl);

            if (isNull(pData)) {
                pData = new Uint8Array(this.length * pDecl.stride);
            }
            else {
                pData = new Uint8Array(pData.buffer);
            }

            logger.assert(this.length === pData.byteLength / pDecl.stride, 'invalid data size for extending');

            var nCount: uint = this._iLength;
            //strides modifications
            var nStrideNew: uint = pDecl.stride;
            var nStridePrev: uint = this.stride;
            var nStrideNext: uint = nStridePrev + nStrideNew;
            //total bytes after extending
            var nTotalSize: uint = nStrideNext * this.length;
            var pDeclNew: IVertexDeclaration = this.getVertexDeclaration().clone();

            //data migration
            var pDataPrev: Uint8Array = new Uint8Array(<ArrayBuffer>this.getData());
            var pDataNext: Uint8Array = new Uint8Array(nTotalSize);

            for (var i: int = 0, iOffset: int; i < nCount; ++i) {
                iOffset = i * nStrideNext;
                pDataNext.set(pDataPrev.subarray(i * nStridePrev, (i + 1) * nStridePrev), iOffset);
                pDataNext.set((<Uint8Array>pData).subarray(i * nStrideNew, (i + 1) * nStrideNew), iOffset + nStridePrev);
            }

            if (!pDeclNew.extend(pDecl)) {
                return false;
            }

            if (!this.resize(nCount, pDeclNew)) {
                return false;
            }

            return this.setData(pDataNext, 0, nStrideNext);
        }


        resize(nCount: uint, pDecl?: IVertexDeclaration): boolean;
        resize(nCount: uint, iStride?: uint): boolean;
        resize(nCount: uint, pDecl?: any) {
            var iStride: uint = 0;
            var iOldOffset: uint = this.byteOffset;
            var pOldVertexBuffer: IVertexBuffer;
            var pOldVertexDeclaration: IVertexDeclaration;
            var iOldStride: uint

			//debug_print("VertexData (offset: " + this.byteOffset + ") resized from " + this.byteLength + " to ", arguments);

			if (arguments.length == 2) {
                if (isInt(pDecl)) {
                    iStride = <uint>pDecl;
                }
                else {
                    iStride = (<IVertexDeclaration>pDecl).stride;
                }

                if (nCount * iStride <= this.byteLength) {
                    this._iLength = nCount;
                    this._iStride = iStride;
                    this._pVertexDeclaration = null;

                    if (!isInt(pDecl)) {
                        this.setVertexDeclaration(pDecl);
                    }

                    this.resized.emit(this.byteLength);
                    return true;
                }
                else {
                    pOldVertexBuffer = this.buffer;

                    pOldVertexBuffer.freeVertexData(this);

                    if (pOldVertexBuffer.getEmptyVertexData(nCount, pDecl, this) !== this) {
                        return false;
                    }

                    if (this.byteOffset != iOldOffset) {
                        logger.warn("vertex data moved from " + iOldOffset + " ---> " + this.byteOffset);
                        this.relocated.emit(iOldOffset, this.byteOffset);
                    }

                    this.resized.emit(this.byteLength);
                    return true;
                }
            }
            else if (arguments.length == 1) {
                if (nCount <= this.length) {
                    this._iLength = nCount;
                    this.resized.emit(this.byteLength);
                    return true;
                }
                else {
                    pOldVertexBuffer = this.buffer;
                    pOldVertexDeclaration = this.getVertexDeclaration();
                    iOldStride = this.stride;

                    pOldVertexBuffer.freeVertexData(this);

                    if (pOldVertexBuffer.getEmptyVertexData(nCount, iOldStride, this) == null) {
                        return false;
                    }

                    this.setVertexDeclaration(pOldVertexDeclaration);

                    if (this.byteOffset != iOldOffset) {
                        logger.warn("vertex data moved from " + iOldOffset + " ---> " + this.byteOffset);
                        this.relocated.emit(iOldOffset, this.byteOffset);
                    }

                    this.resized.emit(this.byteLength);
                    return true;
                }
            }

            return false;
        }

        applyModifier(sUsage: string, fnModifier: IBufferDataModifier): boolean {
            var pData = this.getTypedData(sUsage);
            fnModifier(pData);
            return this.setData(pData, sUsage);
        }

        //FIX ME:
        //если известно sUsage, зачем нужет iSize?
        setData(pData: ArrayBufferView, iOffset: int, iSize?: uint, nCountStart?: uint, nCount?: uint): boolean;
        setData(pData: ArrayBufferView, sUsage?: string, iSize?: uint, nCountStart?: uint, nCount?: uint): boolean;
        setData(pData: ArrayBufferView): boolean {
            var iOffset: uint;
            var iSize: uint;
            var nCountStart: uint;
            var nCount: uint;

            var iStride: uint;
            var pVertexBuffer: IVertexBuffer = this._pVertexBuffer;
            var pBackupBuf: Uint8Array;
            var pDataU8: Uint8Array;
            var k: uint;
            var iOffsetBuffer: uint;
            var pDeclaration: IVertexDeclaration = this._pVertexDeclaration;
            var pElement: IVertexElement;

            switch (arguments.length) {
                case 5:
                    if (isString(arguments[1])) {
                        iOffset = this._pVertexDeclaration.findElement(arguments[1]).offset;
                    }
                    else {
                        iOffset = arguments[1];
                    }

                    iSize = arguments[2];
                    nCountStart = arguments[3];
                    nCount = arguments[4];

                    iStride = this.stride;
                    pDataU8 = new Uint8Array(pData.buffer);
                    if (iStride != iSize) {
                        //FIXME: очень тормознутое место, крайне медленно работает...
                        if (pVertexBuffer.isBackupPresent() && nCount > 1) {
                            // console.log(pVertexBuffer.byteLength);
                            pBackupBuf = new Uint8Array(pVertexBuffer.byteLength);
                            pVertexBuffer.readData(pBackupBuf);

                            iOffsetBuffer = this.byteOffset;

                            for (var i = nCountStart; i < nCount + nCountStart; i++) {
                                for (k = 0; k < iSize; k++) {
                                    pBackupBuf[iStride * i + iOffset + iOffsetBuffer + k] =
                                    pDataU8[iSize * (i - nCountStart) + k];
                                }
                            }

                            pVertexBuffer.writeData(pBackupBuf, 0, pVertexBuffer.byteLength);
                        }
                        else {
                            for (var i: uint = 0; i < nCount; i++) {
                                var iCurrent: uint = i + nCountStart;

                                pVertexBuffer.writeData(
                                    /*pData.buffer.slice*/
                                    pDataU8.subarray(iSize * i, iSize * (i + 1)),
                                    iStride * iCurrent + iOffset + this.byteOffset,
                                    iSize);
                            }
                        }
                    }
                    else {

                        pVertexBuffer.writeData(
                            /*pData.buffer.slice*/
                            //stride == size => iOffset = 0;
                            pDataU8.subarray(0,
                                iStride * nCount),
                            /*iOffset + */this.byteOffset + iStride * nCountStart,
                            iStride * nCount);
                    }

                    this.updated.emit();
                    return true;
                case 4:
                    pElement = null;

                    if (isString(arguments[1])) {
                        pElement = pDeclaration.findElement(arguments[1]);

                        if (pElement) {
                            return this.setData(
                                pData,
                                pElement.offset,
                                pElement.size,
                                arguments[2],
                                arguments[3]);
                        }

                        return false;
                    }

                    iOffset = arguments[1];
                    iSize = arguments[2];
                    nCountStart = arguments[3] || 0;
                    nCount = pData.byteLength / iSize;

                    return this.setData(pData, iOffset, iSize, nCountStart, nCount);


                case 2:
                case 3:
                    pDeclaration = this._pVertexDeclaration;
                    pElement = null;

                    if (isString(arguments[1])) {
                        pElement = pDeclaration.findElement(arguments[1]);

                        if (pElement) {
                            //nCountStart = arguments[2] || 0
                            nCountStart = 0;
                            nCount = pData.buffer.byteLength / pElement.size;

                            return this.setData(
                                pData,
                                pElement.offset,
                                pElement.size,
                                nCountStart,
                                nCount);
                        }

						return false
					}
                    else if (arguments.length === 3) {
                        iOffset = arguments[1];
                        iSize = arguments[2];
                        nCountStart = 0;
                        nCount = pData.byteLength / iSize;

                        return this.setData(pData, iOffset, iSize, nCountStart, nCount);
                    }

                    return false;

                case 1:
                    return this.setData(pData, this._pVertexDeclaration.element(0).usage);
                default:
                    return false;
            }
        }


        getData(): ArrayBuffer;
        getData(iOffset: int, iSize: uint, iFrom?: uint, iCount?: uint): ArrayBuffer;
        getData(sUsage: string): ArrayBuffer;
        getData(sUsage: string, iFrom: uint, iCount: uint): ArrayBuffer;
        getData(): ArrayBuffer {
            switch (arguments.length) {
                case 4:
                case 2:
                    if (isString(arguments[0])) {
                        return null;
                    }

                    var iOffset: int = arguments[0];
                    var iSize: uint = arguments[1];
                    var iFrom: uint = 0;
                    var iCount: uint = this._iLength;

                    if (arguments.length === 4) {
                        iFrom = arguments[2] || 0;
                        iCount = arguments[3] || this._iLength;
                    }

                    iCount = math.min(iCount, this._iLength);

                    var iStride: uint = this.stride;
                    var pBufferData: Uint8Array = new Uint8Array(iSize * iCount);

                    for (var i: int = 0; i < iCount; i++) {
                        var iCurrent: uint = iFrom + i;
                        var isOk: boolean = this._pVertexBuffer.readData(iStride * iCurrent + iOffset + this.byteOffset,
                            iSize, pBufferData.subarray(i * iSize, (i + 1) * iSize));
                        //debug_assert(isOk,"cannot read buffer");
                    }

                    return pBufferData.buffer;

                case 3:
                case 1:
                    var pDeclaration: IVertexDeclaration = this._pVertexDeclaration,
                        pElement: IVertexElement = null;

                    if (isString("string")) {
                        pElement = pDeclaration.findElement(arguments[0]);

                        if (isDefAndNotNull(pElement)) {

                            return this.getData(
                                pElement.offset,
                                pElement.size,
                                arguments.length === 3 ? arguments[1] : 0,
                                arguments.length === 3 ? arguments[2] : this._iLength
                                );
                        }
                        return null;
                    }

                    return null;

                case 0:
                    return this.getData(0, this._pVertexDeclaration.stride);
                default:
                    return null;
            }
        }

        getTypedData(sUsage: string, iFrom?: int, iCount?: uint): ArrayBufferView {
            var pVertexElement: IVertexElement = this._pVertexDeclaration.findElement(sUsage);

            if (pVertexElement) {
                return conv.abtota(this.getData(sUsage, iFrom, iCount), pVertexElement.type);
            }

            return null;
        }

        getBufferHandle(): int {
            return this._pVertexBuffer.resourceHandle;
        }

        toString(): string {
            if (config.DEBUG) {

                var s: string = "";

                s += "		  VERTEX DATA  #" + this.id + "\n";
                s += "---------------+-----------------------\n";
                s += "		BUFFER : " + this.getBufferHandle() + "\n";
                s += "		  SIZE : " + this.byteLength + " b.\n";
                s += "		OFFSET : " + this.byteOffset + " b.\n";
                s += "---------------+-----------------------\n";
                s += " MEMBERS COUNT : " + this.length + " \n";
                s += "		STRIDE : " + this.stride + " \n";
                s += "---------------+-----------------------\n";
                s += this.getVertexDeclaration().toString();

                return s;
            }

            return null;
        }

    }

}