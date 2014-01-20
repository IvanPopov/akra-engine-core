var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (pool) {
        /// <reference path="../../idl/IHardwareBuffer.ts" />
        /// <reference path="../../bf/bf.ts" />
        /// <reference path="../../logger.ts" />
        /// <reference path="../../debug.ts" />
        /// <reference path="../ResourcePoolItem.ts" />
        (function (resources) {
            var HardwareBuffer = (function (_super) {
                __extends(HardwareBuffer, _super);
                // byteLength: uint = 0;
                // length: uint = 0;
                function HardwareBuffer() {
                    _super.call(this);
                    this._iFlags = 0;
                    this._isLocked = false;
                    this._pBackupCopy = null;
                    this._pBackupUpdated = false;
                    this._bIgnoreHardwareUpdate = false;
                }
                Object.defineProperty(HardwareBuffer.prototype, "byteLength", {
                    get: function () {
                        return 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(HardwareBuffer.prototype, "length", {
                    get: function () {
                        return 0;
                    },
                    enumerable: true,
                    configurable: true
                });

                HardwareBuffer.prototype.isValid = function () {
                    return false;
                };

                HardwareBuffer.prototype.isDynamic = function () {
                    return akra.bf.testAny(this._iFlags, akra.EHardwareBufferFlags.DYNAMIC);
                };

                HardwareBuffer.prototype.isStatic = function () {
                    return akra.bf.testAny(this._iFlags, akra.EHardwareBufferFlags.STATIC);
                };

                HardwareBuffer.prototype.isStream = function () {
                    return akra.bf.testAny(this._iFlags, akra.EHardwareBufferFlags.STREAM);
                };

                HardwareBuffer.prototype.isReadable = function () {
                    return akra.bf.testAny(this._iFlags, akra.EHardwareBufferFlags.READABLE);
                };

                HardwareBuffer.prototype.isBackupPresent = function () {
                    return this._pBackupCopy != null;
                };

                HardwareBuffer.prototype.isSoftware = function () {
                    return akra.bf.testAny(this._iFlags, akra.EHardwareBufferFlags.SOFTWARE);
                };

                HardwareBuffer.prototype.isAligned = function () {
                    return akra.bf.testAny(this._iFlags, akra.EHardwareBufferFlags.ALIGNMENT);
                };

                HardwareBuffer.prototype.isLocked = function () {
                    return this._isLocked;
                };

                HardwareBuffer.prototype.clone = function (pSrc) {
                    return false;
                };

                HardwareBuffer.prototype.getFlags = function () {
                    return this._iFlags;
                };

                HardwareBuffer.prototype.readData = function (iOffset, iSize, ppDest) {
                    return false;
                };

                HardwareBuffer.prototype.writeData = function (pData, iOffset, iSize, bDiscardWholeBuffer) {
                    if (typeof bDiscardWholeBuffer === "undefined") { bDiscardWholeBuffer = false; }
                    return false;
                };

                HardwareBuffer.prototype.copyData = function (pSrcBuffer, iSrcOffset, iDstOffset, iSize, bDiscardWholeBuffer) {
                    if (typeof bDiscardWholeBuffer === "undefined") { bDiscardWholeBuffer = false; }
                    var pData = pSrcBuffer.lock(iSrcOffset, iSize);
                    this.writeData(pData, iDstOffset, iSize, bDiscardWholeBuffer);
                    pSrcBuffer.unlock();
                    return true;
                };

                HardwareBuffer.prototype.create = function (iSize, iFlags) {
                    if (typeof iFlags === "undefined") { iFlags = 0; }
                    iFlags |= akra.EHardwareBufferFlags.STATIC;

                    if (akra.bf.testAny(iFlags, akra.EHardwareBufferFlags.DYNAMIC)) {
                        akra.bf.clearAll(iFlags, akra.EHardwareBufferFlags.STATIC);

                        if (akra.bf.testAny(iFlags, akra.EHardwareBufferFlags.BACKUP_COPY)) {
                            akra.bf.clearAll(iFlags, akra.EHardwareBufferFlags.READABLE);
                        }
                    }

                    this._iFlags = iFlags;

                    this.notifyCreated();
                    this.notifyRestored();

                    return true;
                };

                HardwareBuffer.prototype.destroy = function () {
                    this._iFlags = 0;
                    this.notifyDestroyed();
                    this.notifyUnloaded();
                };

                HardwareBuffer.prototype.resize = function (iSize) {
                    return false;
                };

                HardwareBuffer.prototype.lock = function () {
                    akra.logger.assert(!this.isLocked(), "Cannot lock this buffer, it is already locked!");

                    var iOffset = 0, iSize = 0, iLockFlags = 0;

                    if (arguments.length == 1) {
                        iLockFlags = arguments[0];
                        iOffset = 0;
                        iSize = this.byteLength;
                    } else {
                        iOffset = arguments[0];
                        iSize = arguments[1];
                        iLockFlags = (arguments.length === 3) ? arguments[2] : akra.EHardwareBufferFlags.READABLE;
                    }

                    var pResult = null;

                    if ((iOffset + iSize) > this.byteLength) {
                        akra.logger.error("Lock request out of bounds.", "HardwareBuffer::lock");
                    } else if (this.isBackupPresent()) {
                        if (!akra.bf.testAny(iLockFlags, akra.ELockFlags.WRITE)) {
                            // we have to assume a read / write lock so we use the shadow buffer
                            // and tag for sync on unlock()
                            this._pBackupUpdated = true;
                        }

                        pResult = this._pBackupCopy.lock(iOffset, iSize, iLockFlags);
                    } else {
                        // Lock the real buffer if there is no shadow buffer
                        pResult = this.lockImpl(iOffset, iSize, iLockFlags);
                        this._isLocked = true;
                    }

                    this._iLockStart = iOffset;
                    this._iLockSize = iSize;

                    return pResult;
                };

                HardwareBuffer.prototype.unlock = function () {
                    akra.logger.assert(this.isLocked(), "Cannot unlock this buffer, it is not locked!");

                    if (this._pBackupCopy && this._pBackupCopy.isLocked()) {
                        this._pBackupCopy.unlock();

                        // Potentially update the 'real' buffer from the shadow buffer
                        this.restoreFromBackup();
                    } else {
                        // Otherwise, unlock the real one
                        this.unlockImpl();
                        this._isLocked = false;
                    }
                };

                HardwareBuffer.prototype.restoreFromBackup = function () {
                    if (this._pBackupCopy && this._pBackupUpdated && !this._bIgnoreHardwareUpdate) {
                        // Do this manually to avoid locking problems
                        var pBackupData = this._pBackupCopy.lockImpl(this._iLockStart, this._iLockSize, akra.ELockFlags.READ);

                        // Lock with discard if the whole buffer was locked, otherwise normal
                        var iLockFlags;

                        if (this._iLockStart == 0 && this._iLockSize == this.byteLength) {
                            iLockFlags = akra.ELockFlags.DISCARD;
                        } else {
                            iLockFlags = akra.ELockFlags.NORMAL;
                        }

                        var pRealData = this.lockImpl(this._iLockStart, this._iLockSize, iLockFlags);

                        // Copy backup to real
                        this.copyBackupToRealImpl(pRealData, pBackupData, iLockFlags);

                        this.unlockImpl();
                        this._pBackupCopy.unlockImpl();
                        this._pBackupUpdated = false;

                        return true;
                    }

                    return false;
                };

                HardwareBuffer.prototype.createResource = function () {
                    // innitialize the resource (called once)
                    akra.debug.assert(!this.isResourceCreated(), "The resource has already been created.");

                    // signal that the resource is now created,
                    // but has not been enabled
                    //this.notifyCreated();
                    this.notifyDisabled();

                    return true;
                };

                HardwareBuffer.prototype.destroyResource = function () {
                    if (this.isResourceCreated()) {
                        // disable the resource
                        this.disableResource();
                        this.destroy();
                        return true;
                    }

                    return false;
                };

                HardwareBuffer.prototype.restoreResource = function () {
                    akra.debug.assert(this.isResourceCreated(), "The resource has not been created.");

                    this.notifyRestored();
                    return true;
                };

                HardwareBuffer.prototype.disableResource = function () {
                    akra.debug.assert(this.isResourceCreated(), "The resource has not been created.");

                    this.notifyDisabled();
                    return true;
                };

                HardwareBuffer.prototype.lockImpl = function (iOffset, iSize, iLockFlags) {
                    return null;
                };

                HardwareBuffer.prototype.unlockImpl = function () {
                };

                HardwareBuffer.prototype.copyBackupToRealImpl = function (pRealData, pBackupData, iLockFlags) {
                };
                return HardwareBuffer;
            })(pool.ResourcePoolItem);
            resources.HardwareBuffer = HardwareBuffer;
        })(pool.resources || (pool.resources = {}));
        var resources = pool.resources;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
