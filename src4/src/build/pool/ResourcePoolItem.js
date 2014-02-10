/// <reference path="../idl/IEngine.ts" />
/// <reference path="../idl/IResourceCode.ts" />
/// <reference path="../idl/IResourcePool.ts" />
/// <reference path="../idl/IResourcePoolManager.ts" />
/// <reference path="../idl/IResourceWatcherFunc.ts" />
/// <reference path="../idl/IResourceNotifyRoutineFunc.ts" />
/// <reference path="../idl/IResourcePoolItem.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../util/ReferenceCounter.ts" />
    /// <reference path="../common.ts" />
    /// <reference path="../events.ts" />
    /// <reference path="../guid.ts" />
    /// <reference path="../gen/generate.ts" />
    /// <reference path="ResourceCode.ts" />
    (function (pool) {
        var ResourcePoolItem = (function (_super) {
            __extends(ResourcePoolItem, _super);
            /** Constructor of ResourcePoolItem class */
            function ResourcePoolItem() {
                _super.call(this);
                this.guid = akra.guid();
                this._pResourcePool = null;
                this._iResourceHandle = 0;
                this._iResourceFlags = 0;
                this.setupSignals();

                //this.pManager = pManager;
                this._pResourceCode = new akra.pool.ResourceCode(0);
                this._pStateWatcher = [];
                this._pCallbackSlots = akra.gen.array(4 /* TOTALRESOURCEFLAGS */);
            }
            ResourcePoolItem.prototype.setupSignals = function () {
                this.created = this.created || new akra.Signal(this);
                this.destroyed = this.destroyed || new akra.Signal(this);
                this.loaded = this.loaded || new akra.Signal(this);
                this.unloaded = this.unloaded || new akra.Signal(this);
                this.restored = this.restored || new akra.Signal(this);
                this.disabled = this.disabled || new akra.Signal(this);
                this.altered = this.altered || new akra.Signal(this);
                this.saved = this.saved || new akra.Signal(this);

                this.stateChanged = this.stateChanged || new akra.Signal(this);
            };

            ResourcePoolItem.prototype.getResourceCode = function () {
                return this._pResourceCode;
            };

            ResourcePoolItem.prototype.getResourcePool = function () {
                return this._pResourcePool;
            };

            ResourcePoolItem.prototype.getResourceHandle = function () {
                return this._iResourceHandle;
            };

            ResourcePoolItem.prototype.getResourceFlags = function () {
                return this._iResourceFlags;
            };

            ResourcePoolItem.prototype.getAlteredFlag = function () {
                return akra.bf.testBit(this._iResourceFlags, 3 /* ALTERED */);
            };

            ResourcePoolItem.prototype.getEngine = function () {
                var pManager = this.getManager();

                if (pManager) {
                    return pManager.getEngine();
                }

                return null;
            };

            ResourcePoolItem.prototype.getManager = function () {
                return this._pResourcePool.getManager();
            };

            ResourcePoolItem.prototype.createResource = function () {
                return false;
            };

            ResourcePoolItem.prototype.destroyResource = function () {
                return false;
            };

            ResourcePoolItem.prototype.disableResource = function () {
                return false;
            };

            ResourcePoolItem.prototype.restoreResource = function () {
                return false;
            };

            ResourcePoolItem.prototype.loadResource = function (sFilename) {
                if (typeof sFilename === "undefined") { sFilename = null; }
                return false;
            };

            ResourcePoolItem.prototype.saveResource = function (sFilename) {
                if (typeof sFilename === "undefined") { sFilename = null; }
                return false;
            };

            ResourcePoolItem.prototype.setStateWatcher = function (eEvent, fnWatcher) {
                this._pStateWatcher[eEvent] = fnWatcher;
            };

            ResourcePoolItem.prototype.isSyncedTo = function (eSlot) {
                return !akra.isNull(this._pCallbackSlots[eSlot]) && this._pCallbackSlots[eSlot].length > 0;
            };

            /**
            * Find resources, that may affect the @eState of this resoyrces.
            */
            ResourcePoolItem.prototype.findRelatedResources = function (eState) {
                var pSlots = this._pCallbackSlots[eState];
                var pRelatedResources = [];

                for (var i = 0; i < pSlots.length; ++i) {
                    pRelatedResources.push(pSlots[i].pResourceItem);
                }

                return pRelatedResources;
            };

            /**
            * Sync resource with another.
            *
            *
            */
            ResourcePoolItem.prototype.sync = function (pResourceItem, eSignal, eSlot) {
                eSlot = akra.isDef(eSlot) ? eSlot : eSignal;

                eSlot = ResourcePoolItem.parseEvent(eSlot);
                eSignal = ResourcePoolItem.parseEvent(eSignal);

                var pSlots = this._pCallbackSlots, pSignSlots;

                var me = this;
                var n;
                var fn;
                var bState;

                if (akra.isNull(pSlots[eSlot])) {
                    pSlots[eSlot] = [];
                }

                //n - number of signal slot, that contains 'pResourceItem'
                pSignSlots = pSlots[eSlot];
                n = pSignSlots.length;
                bState = akra.bf.testBit(pResourceItem.getResourceFlags(), eSignal);

                fn = function (eFlag, iResourceFlags, isSet) {
                    if (eFlag == eSignal) {
                        pSignSlots[n].bState = isSet;
                        me.notifyStateChange(eSlot, this);

                        for (var i = 0; i < pSignSlots.length; ++i) {
                            if (pSignSlots[i].bState === false) {
                                if (akra.bf.testBit(me.getResourceFlags(), eFlag)) {
                                    me.setResourceFlag(eFlag, false);
                                }

                                return;
                            }
                        }

                        me.setResourceFlag(eFlag, true);
                    }
                };

                pSignSlots.push({ bState: bState, fn: fn, pResourceItem: pResourceItem });

                fn.call(pResourceItem, eSignal, pResourceItem.getResourceFlags(), bState);
                pResourceItem.setChangesNotifyRoutine(fn);

                return true;
            };

            ResourcePoolItem.prototype.unsync = function (pResourceItem, eSignal, eSlot) {
                eSlot = akra.isDef(eSlot) ? eSlot : eSignal;
                eSlot = ResourcePoolItem.parseEvent(eSlot);
                eSignal = ResourcePoolItem.parseEvent(eSignal);

                var pSlots = this._pCallbackSlots, pSignSlots;
                var me = this;
                var isRem = false;

                pSignSlots = pSlots[eSlot];

                for (var i = 0, n = pSignSlots.length; i < n; ++i) {
                    if (pSignSlots[i].pResourceItem === pResourceItem) {
                        pSignSlots[i].pResourceItem.delChangesNotifyRoutine(pSignSlots[i].fn);
                        pSignSlots.splice(i, 1);

                        --n;
                        --i;

                        isRem = true;
                    }
                }

                return isRem;
            };

            ResourcePoolItem.prototype.isResourceCreated = function () {
                return akra.bf.testBit(this._iResourceFlags, 0 /* CREATED */);
            };

            ResourcePoolItem.prototype.isResourceLoaded = function () {
                return akra.bf.testBit(this._iResourceFlags, 1 /* LOADED */);
            };

            ResourcePoolItem.prototype.isResourceDisabled = function () {
                return akra.bf.testBit(this._iResourceFlags, 2 /* DISABLED */);
            };

            ResourcePoolItem.prototype.isResourceAltered = function () {
                return akra.bf.testBit(this._iResourceFlags, 3 /* ALTERED */);
            };

            ResourcePoolItem.prototype.setAlteredFlag = function (isOn) {
                if (typeof isOn === "undefined") { isOn = true; }
                //notify always, when altered called
                if (this.setResourceFlag(3 /* ALTERED */, isOn) || isOn) {
                    isOn ? this.altered.emit() : this.saved.emit();
                    return true;
                }

                return false;
            };

            ResourcePoolItem.prototype.setResourceName = function (sName) {
                if (this._pResourcePool != null) {
                    this._pResourcePool.setResourceName(this._iResourceHandle, sName);
                }
            };

            ResourcePoolItem.prototype.findResourceName = function () {
                if (this._pResourcePool != null) {
                    return this._pResourcePool.findResourceName(this._iResourceHandle);
                }

                return null;
            };

            ResourcePoolItem.prototype.release = function () {
                var iRefCount = _super.prototype.release.call(this);

                if (iRefCount == 0) {
                    //Если у нас есть менеджер попросим его удалить нас
                    if (this._pResourcePool != null) {
                        this._pResourcePool.destroyResource(this);
                    }
                }

                return iRefCount;
            };
            ResourcePoolItem.prototype.notifyCreated = function () {
                if (this.setResourceFlag(0 /* CREATED */, true)) {
                    this.created.emit();
                }
            };

            ResourcePoolItem.prototype.notifyDestroyed = function () {
                if (this.setResourceFlag(0 /* CREATED */, false)) {
                    this.destroyed.emit();
                }
            };

            ResourcePoolItem.prototype.notifyLoaded = function () {
                this.setAlteredFlag(false);

                // LOG("ResourcePoolItem::notifyLoaded();");
                if (this.setResourceFlag(1 /* LOADED */, true)) {
                    // LOG("ResourcePoolItem::loaded();");
                    this.loaded.emit();
                }
            };

            ResourcePoolItem.prototype.notifyUnloaded = function () {
                if (this.setResourceFlag(1 /* LOADED */, false)) {
                    this.unloaded.emit();
                }
            };

            ResourcePoolItem.prototype.notifyRestored = function () {
                if (this.setResourceFlag(2 /* DISABLED */, false)) {
                    this.restored.emit();
                }
            };

            ResourcePoolItem.prototype.notifyDisabled = function () {
                if (this.setResourceFlag(2 /* DISABLED */, true)) {
                    this.disabled.emit();
                }
            };

            ResourcePoolItem.prototype.notifyAltered = function () {
                this.setAlteredFlag(true);
            };

            ResourcePoolItem.prototype.notifySaved = function () {
                this.setAlteredFlag(false);
            };

            /**
            * Назначение кода ресурсу
            * @
            */
            ResourcePoolItem.prototype.setResourceCode = function (pCode) {
                this._pResourceCode.eq(pCode);
            };

            /**
            * Чтобы ресурс знал какому пулу ресурсов принадлжит
            * @
            */
            ResourcePoolItem.prototype.setResourcePool = function (pPool) {
                this._pResourcePool = pPool;
            };

            /**
            * Назначение хендла ресурсу
            * @
            */
            ResourcePoolItem.prototype.setResourceHandle = function (iHandle) {
                this._iResourceHandle = iHandle;
            };

            ResourcePoolItem.prototype.notifyStateChange = function (eEvent, pTarget) {
                if (typeof pTarget === "undefined") { pTarget = null; }
                if (!this._pStateWatcher[eEvent]) {
                    return;
                }

                var pSignSlots = this._pCallbackSlots[eEvent];
                var nTotal = pSignSlots.length, nLoaded = 0;

                for (var i = 0; i < nTotal; ++i) {
                    if (pSignSlots[i].bState) {
                        ++nLoaded;
                    }
                }

                this._pStateWatcher[eEvent](nLoaded, nTotal, pTarget);
            };

            ResourcePoolItem.prototype.setResourceFlag = function (iFlagBit, isSetting) {
                var iTempFlags = this._iResourceFlags;

                this._iResourceFlags = akra.bf.setBit(this._iResourceFlags, iFlagBit, isSetting);

                if (iTempFlags != this._iResourceFlags) {
                    this.stateChanged.emit(iFlagBit, this._iResourceFlags, isSetting);
                    return true;
                }

                return false;
            };

            ResourcePoolItem.parseEvent = function (pEvent) {
                if (akra.isInt(pEvent)) {
                    return pEvent;
                }

                switch (pEvent.toLowerCase()) {
                    case 'loaded':
                        return 1 /* LOADED */;
                    case 'created':
                        return 0 /* CREATED */;
                    case 'disabled':
                        return 2 /* DISABLED */;
                    case 'altered':
                        return 3 /* ALTERED */;
                    default:
                        akra.logger.error('Использовано неизвестное событие для ресурса.');
                        return 0;
                }
            };
            return ResourcePoolItem;
        })(akra.util.ReferenceCounter);
        pool.ResourcePoolItem = ResourcePoolItem;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
//# sourceMappingURL=ResourcePoolItem.js.map
