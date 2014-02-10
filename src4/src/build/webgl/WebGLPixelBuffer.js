/// <reference path="../idl/IPixelBuffer.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../pool/resources/HardwareBuffer.ts" />
    /// <reference path="../geometry/Box.ts" />
    /// <reference path="../pixelUtil/PixelBox.ts" />
    /// <reference path="webgl.ts" />
    (function (webgl) {
        var WebGLPixelBuffer = (function (_super) {
            __extends(WebGLPixelBuffer, _super);
            function WebGLPixelBuffer() {
                _super.call(this);
                this._iWidth = 0;
                this._iHeight = 0;
                this._iDepth = 0;
                // Pitches (offsets between rows and slices)
                this._iRowPitch = 0;
                this._iSlicePitch = 0;
                this._eFormat = 0 /* UNKNOWN */;
                //webgl specific
                this._pCurrentLock = null;
                this._pLockedBox = null;
                this._iCurrentLockFlags = 0;
                this._pBuffer = null;
                this._iWebGLInternalFormat = 0;
            }
            WebGLPixelBuffer.prototype.getByteLength = function () {
                return this._iByteSize;
            };

            WebGLPixelBuffer.prototype.getWidth = function () {
                return this._iWidth;
            };

            WebGLPixelBuffer.prototype.getHeight = function () {
                return this._iHeight;
            };

            WebGLPixelBuffer.prototype.getDepth = function () {
                return this._iDepth;
            };

            WebGLPixelBuffer.prototype.getFormat = function () {
                return this._eFormat;
            };

            //upload(download) data to(from) videocard.
            WebGLPixelBuffer.prototype.upload = function (pData, pDestBox) {
                akra.logger.critical("Upload not possible for this pixelbuffer type");
            };

            WebGLPixelBuffer.prototype.download = function (pData) {
                akra.logger.critical("Download not possible for this pixelbuffer type");
            };

            WebGLPixelBuffer.prototype._bindToFramebuffer = function (pAttachment, iZOffset) {
                akra.logger.critical("Framebuffer bind not possible for this pixelbuffer type");
            };

            WebGLPixelBuffer.prototype._getWebGLFormat = function () {
                return this._iWebGLInternalFormat;
            };

            WebGLPixelBuffer.prototype._clearRTT = function (iZOffset) {
            };

            WebGLPixelBuffer.prototype.reset = function (iWidth, iHeight) {
                if (typeof iWidth === "undefined") { iWidth = this._iWidth; }
                if (typeof iHeight === "undefined") { iHeight = iWidth; }
                this._iWidth = iWidth;
                this._iHeight = iHeight;
            };

            WebGLPixelBuffer.prototype.create = function () {
                if (arguments.length === 1) {
                    akra.logger.critical("Invalid number of arguments. For PixelBuffer it must be six");
                }
                var iWidth = arguments[0];
                var iHeight = arguments[1];
                var iDepth = arguments[2];
                var eFormat = arguments[3];
                var iFlags = arguments[4];

                _super.prototype.create.call(this, iFlags);

                this._iWidth = iWidth;
                this._iHeight = iHeight;
                this._iDepth = iDepth;
                this._eFormat = eFormat;

                this._iRowPitch = iWidth;
                this._iSlicePitch = iHeight * iWidth;
                this._iByteSize = iHeight * iWidth * akra.pixelUtil.getNumElemBytes(eFormat);

                this._pBuffer = new akra.pixelUtil.PixelBox(iWidth, iHeight, iDepth, eFormat);
                this._iWebGLInternalFormat = 0 /* NONE */;

                return true;
            };

            WebGLPixelBuffer.prototype.destroy = function () {
                this._pBuffer = null;

                _super.prototype.destroy.call(this);
            };

            WebGLPixelBuffer.prototype.destroyResource = function () {
                this.destroy();
                this.notifyDestroyed();
                return true;
            };

            WebGLPixelBuffer.prototype.readData = function () {
                akra.logger.critical("Reading a byte range is not implemented. Use blitToMemory.");
                return false;
            };

            WebGLPixelBuffer.prototype.writeData = function () {
                akra.logger.critical("Writing a byte range is not implemented. Use blitFromMemory.");
                return false;
            };

            WebGLPixelBuffer.prototype.readPixels = function (pDestBox) {
                this.download(pDestBox);
                return true;
            };

            WebGLPixelBuffer.prototype.blit = function (pSource, pSrcBox, pDestBox) {
                if (arguments.length == 1) {
                    return this.blit(pSource, new akra.geometry.Box(0, 0, 0, pSource.getWidth(), pSource.getHeight(), pSource.getDepth()), new akra.geometry.Box(0, 0, 0, this._iWidth, this._iHeight, this._iDepth));
                } else {
                    if (pSource === this) {
                        akra.logger.critical("Source must not be the same object");
                    }

                    var pSrclock = pSource.lock(pSrcBox, 1 /* READ */);

                    var eLockMethod = 3 /* NORMAL */;
                    if (pDestBox.left === 0 && pDestBox.top === 0 && pDestBox.front === 0 && pDestBox.right === this._iWidth && pDestBox.bottom === this._iHeight && pDestBox.back === this._iDepth) {
                        // Entire buffer -- we can discard the previous contents
                        eLockMethod = 4 /* DISCARD */;
                    }

                    var pDstlock = this.lock(pDestBox, eLockMethod);

                    if (pDstlock.getWidth() != pSrclock.getWidth() || pDstlock.getHeight() != pSrclock.getHeight() || pDstlock.getDepth() != pSrclock.getDepth()) {
                        // Scaling desired
                        pSrclock.scale(pDstlock);
                    } else {
                        // No scaling needed
                        akra.pixelUtil.bulkPixelConversion(pSrclock, pDstlock);
                    }

                    this.unlock();
                    pSource.unlock();

                    return true;
                }
            };

            WebGLPixelBuffer.prototype.blitFromMemory = function () {
                var pSource;
                var pDestBox;

                pSource = arguments[0];

                if (arguments.length === 1) {
                    pDestBox = new akra.geometry.Box(0, 0, 0, this._iWidth, this._iHeight, this._iDepth);
                    return this.blitFromMemory(pSource, pDestBox);
                } else {
                    pDestBox = arguments[1];
                }

                if (!this._pBuffer.contains(pDestBox)) {
                    akra.logger.critical("Destination box out of range");
                }

                var pScaledBox;

                if (pSource.getWidth() != pDestBox.getWidth() || pSource.getHeight() != pDestBox.getHeight() || pSource.getDepth() != pDestBox.getDepth()) {
                    // Scale to destination size.
                    // This also does pixel format conversion if needed
                    this.allocateBuffer();
                    pScaledBox = this._pBuffer.getSubBox(pDestBox);
                    pScaledBox.setConsecutive();

                    pSource.scale(pScaledBox, 2 /* BILINEAR */);
                } else if ((pSource.format !== this._eFormat) || (akra.webgl.getWebGLFormat(pSource.format) === 0)) {
                    // Extents match, but format is not accepted as valid source format for GL
                    // do conversion in temporary buffer
                    this.allocateBuffer();
                    pScaledBox = this._pBuffer.getSubBox(pDestBox);
                    pScaledBox.setConsecutive();

                    akra.pixelUtil.bulkPixelConversion(pSource, pScaledBox);
                    // if(this._eFormat === EPixelFormats.A4R4G4B4)
                    // {
                    //     // ARGB->BGRA
                    //     convertToWebGLformat(pScaledBox, pScaledBox);
                    // }
                } else {
                    this.allocateBuffer();
                    pScaledBox = pSource;
                }

                this.upload(pScaledBox, pDestBox);
                this.freeBuffer();

                return true;
            };

            WebGLPixelBuffer.prototype.blitToMemory = function () {
                var pSrcBox;
                var pDest;

                if (arguments.length === 1) {
                    pDest = arguments[0];
                    pSrcBox = new akra.geometry.Box(0, 0, 0, this._iWidth, this._iHeight, this._iDepth);
                    return this.blitToMemory(pSrcBox, pDest);
                } else {
                    pSrcBox = arguments[0];
                    pDest = arguments[1];
                }

                if (!this._pBuffer.contains(pSrcBox)) {
                    akra.logger.critical("source box out of range");
                }

                if (pSrcBox.left == 0 && pSrcBox.right == this._iWidth && pSrcBox.top == 0 && pSrcBox.bottom == this._iHeight && pSrcBox.front == 0 && pSrcBox.back == this._iDepth && pDest.getWidth() == this._iWidth && pDest.getHeight() == this._iHeight && pDest.getDepth() == this._iDepth && akra.webgl.getWebGLFormat(pDest.format) != 0) {
                    // The direct case: the user wants the entire texture in a format supported by GL
                    // so we don't need an intermediate buffer
                    this.download(pDest);
                } else {
                    // Use buffer for intermediate copy
                    this.allocateBuffer();

                    // Download entire buffer
                    this.download(this._pBuffer);

                    if (pSrcBox.getWidth() != pDest.getWidth() || pSrcBox.getHeight() != pDest.getHeight() || pSrcBox.getDepth() != pDest.getDepth()) {
                        // We need scaling
                        this._pBuffer.getSubBox(pSrcBox).scale(pDest, 2 /* BILINEAR */);
                    } else {
                        // Just copy the bit that we need
                        akra.pixelUtil.bulkPixelConversion(this._pBuffer.getSubBox(pSrcBox), pDest);
                    }
                    this.freeBuffer();
                }

                return true;
            };

            WebGLPixelBuffer.prototype.getRenderTarget = function () {
                return null;
            };

            WebGLPixelBuffer.prototype.lock = function () {
                var pLockBox = null;
                var iLockFlags = 0;

                if (akra.isInt(arguments[0])) {
                    var iOffset;
                    var iSize;

                    if (arguments.length === 1) {
                        iLockFlags = arguments[0];
                        iOffset = 0;
                        iSize = this.getByteLength();
                    } else {
                        iOffset = arguments[0];
                        iSize = arguments[1];
                        iLockFlags = (arguments.length === 3) ? arguments[2] : 4 /* READABLE */;
                    }

                    akra.logger.assert(!this.isLocked(), "Cannot lock this buffer, it is already locked!");
                    akra.logger.assert(iOffset === 0 && iSize === this.getByteLength(), "Cannot lock memory region, most lock box or entire buffer");

                    pLockBox = new akra.geometry.Box(0, 0, 0, this._iWidth, this._iHeight, this._iDepth);
                } else {
                    pLockBox = arguments[0];
                }

                if (this.isBackupPresent()) {
                    if (!akra.bf.testAny(iLockFlags, 2 /* WRITE */)) {
                        // we have to assume a read / write lock so we use the shadow buffer
                        // and tag for sync on unlock()
                        this._pBackupUpdated = true;
                    }

                    this._pCurrentLock = (this._pBackupCopy).lock(pLockBox, iLockFlags);
                } else {
                    this._pCurrentLock = this.lockImpl(pLockBox, iLockFlags);
                    this._isLocked = true;
                }

                return this._pCurrentLock;
            };

            WebGLPixelBuffer.prototype.allocateBuffer = function () {
                if (!akra.isNull(this._pBuffer.data)) {
                    return;
                }

                this._pBuffer.data = new Uint8Array(this.getByteLength());
            };

            WebGLPixelBuffer.prototype.freeBuffer = function () {
                if (akra.bf.testAny(this._iFlags, 1 /* STATIC */)) {
                    this._pBuffer.data = null;
                }
            };

            WebGLPixelBuffer.prototype.lockImpl = function () {
                if (arguments.length === 3) {
                    akra.logger.critical("lockImpl(offset,length) is not valid for PixelBuffers and should never be called");
                }

                var pLockBox = arguments[0];
                var iLockFlags = arguments[1];

                this.allocateBuffer();

                if (!akra.bf.testAny(iLockFlags, 4 /* DISCARD */) && akra.bf.testAny(this._iFlags, 4 /* READABLE */)) {
                    this.download(this._pBuffer);
                }

                this._iCurrentLockFlags = iLockFlags;
                this._pLockedBox = pLockBox;

                return this._pBuffer.getSubBox(pLockBox);
            };

            WebGLPixelBuffer.prototype.unlockImpl = function () {
                if (akra.bf.testAny(this._iCurrentLockFlags, 2 /* WRITE */)) {
                    // From buffer to card, only upload if was locked for writing
                    this.upload(this._pCurrentLock, this._pLockedBox);
                }

                this.freeBuffer();
            };
            return WebGLPixelBuffer;
        })(akra.pool.resources.HardwareBuffer);
        webgl.WebGLPixelBuffer = WebGLPixelBuffer;
    })(akra.webgl || (akra.webgl = {}));
    var webgl = akra.webgl;
})(akra || (akra = {}));
//# sourceMappingURL=WebGLPixelBuffer.js.map
