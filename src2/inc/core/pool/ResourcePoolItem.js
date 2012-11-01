var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="../../akra.ts" />
var akra;
(function (akra) {
    (function (core) {
        (function (pool) {
            var ResourcePoolItem = (function (_super) {
                __extends(ResourcePoolItem, _super);
                function ResourcePoolItem(pEngine) {
                                _super.call(this);
                    this.pResourcePool = null;
                    this.iResourceHandle = 0;
                    this.iResourceFlags = 0;
                    this.pEngine = pEngine;
                    this.pResourceCode = new pool.ResourceCode(0);
                    this.iGuid = akra.sid();
                    this.pCallbackFunctions = [];
                    this.pStateWatcher = [];
                    this.pCallbackSlots = akra.genArray(null, akra.EResourceItemEvents.k_TotalResourceFlags);
                }
                /** @inline */
                                Object.defineProperty(ResourcePoolItem.prototype, "resourceCode", {
                    get: /** @inline */
                    function () {
                        return this.pResourceCode;
                    }/** @inline */
                    ,
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ResourcePoolItem.prototype, "resourcePool", {
                    get: function () {
                        return this.pResourcePool;
                    }/** @inline */
                    ,
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ResourcePoolItem.prototype, "resourceHandle", {
                    get: function () {
                        return this.iResourceHandle;
                    }/** @inline */
                    ,
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ResourcePoolItem.prototype, "resourceFlags", {
                    get: function () {
                        return this.iResourceFlags;
                    }/** @inline */
                    ,
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ResourcePoolItem.prototype, "alteredFlag", {
                    get: function () {
                        return akra.bf.testBit(this.iResourceFlags, akra.EResourceItemEvents.k_Altered);
                    }/** Constructor of ResourcePoolItem class */
                    ,
                    enumerable: true,
                    configurable: true
                });
                ResourcePoolItem.prototype.getGuid = function () {
                    return this.iGuid;
                }/** @inline */
                ;
                ResourcePoolItem.prototype.getEngine = function () {
                    return this.pEngine;
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
                ResourcePoolItem.prototype.setChangesNotifyRoutine = function (fn) {
                    for(var i = 0; i < this.pCallbackFunctions.length; i++) {
                        if(this.pCallbackFunctions[i] == fn) {
                            return;
                        }
                    }
                    this.pCallbackFunctions.push(fn);
                };
                ResourcePoolItem.prototype.delChangesNotifyRoutine = function (fn) {
                    for(var i = 0; i < this.pCallbackFunctions.length; i++) {
                        if(this.pCallbackFunctions[i] == fn) {
                            this.pCallbackFunctions[i] = null;
                        }
                    }
                };
                ResourcePoolItem.prototype.setStateWatcher = function (eEvent, fnWatcher) {
                    this.pStateWatcher[eEvent] = fnWatcher;
                };
                ResourcePoolItem.prototype.connect = function (pResourceItem, eSignal, eSlot) {
                    eSlot = akra.isDef(eSlot) ? eSlot : eSignal;
                    eSlot = ResourcePoolItem.parseEvent(eSlot);
                    eSignal = ResourcePoolItem.parseEvent(eSignal);
                    var pSlots = this.pCallbackSlots;
                    var pSignSlots;

                    var me = this;
                    var n;
                    var fn;
                    var bState;
                    if(akra.isNull(pSlots[eSlot])) {
                        pSlots[eSlot] = [];
                    }
                    pSignSlots = pSlots[eSlot];
                    n = pSignSlots.length;
                    bState = akra.bf.testBit(pResourceItem.resourceFlags, eSignal);
                    fn = function (eFlag, iResourceFlags, isSet) {
                        if(eFlag == eSignal) {
                            pSignSlots[n].bState = isSet;
                            me.notifyStateChange(eSlot, this);
                            for(var i = 0; i < pSignSlots.length; ++i) {
                                if(pSignSlots[i].bState === false) {
                                    if(akra.bf.testBit(me.resourceFlags, eFlag)) {
                                        me.setResourceFlag(eFlag, false);
                                    }
                                    return;
                                }
                            }
                            me.setResourceFlag(eFlag, true);
                        }
                    };
                    pSignSlots.push({
                        bState: bState,
                        fn: fn,
                        pResourceItem: pResourceItem
                    });
                    fn.call(pResourceItem, eSignal, pResourceItem.resourceFlags, bState);
                    pResourceItem.setChangesNotifyRoutine(fn);
                    return true;
                };
                ResourcePoolItem.prototype.disconnect = function (pResourceItem, eSignal, eSlot) {
                    eSlot = akra.isDef(eSlot) ? eSlot : eSignal;
                    eSlot = ResourcePoolItem.parseEvent(eSlot);
                    eSignal = ResourcePoolItem.parseEvent(eSignal);
                    var pSlots = this.pCallbackSlots;
                    var pSignSlots;

                    var me = this;
                    var isRem = false;
                    pSignSlots = pSlots[eSlot];
                    for(var i = 0, n = pSignSlots.length; i < n; ++i) {
                        if(pSignSlots[i].pResourceItem === pResourceItem) {
                            pSignSlots[i].pResourceItem.delChangesNotifyRoutine(pSignSlots[i].fn);
                            pSignSlots.splice(i, 1);
                            --n;
                            --i;
                            isRem = true;
                        }
                    }
                    return isRem;
                }/** @inline */
                ;
                ResourcePoolItem.prototype.notifyCreated = function () {
                    this.setResourceFlag(akra.EResourceItemEvents.k_Created, true);
                }/** @inline */
                ;
                ResourcePoolItem.prototype.notifyDestroyed = function () {
                    this.setResourceFlag(akra.EResourceItemEvents.k_Created, false);
                }/** @inline */
                ;
                ResourcePoolItem.prototype.notifyLoaded = function () {
                    this.setAlteredFlag(false);
                    this.setResourceFlag(akra.EResourceItemEvents.k_Loaded, true);
                }/** @inline */
                ;
                ResourcePoolItem.prototype.notifyUnloaded = function () {
                    this.setResourceFlag(akra.EResourceItemEvents.k_Loaded, false);
                }/** @inline */
                ;
                ResourcePoolItem.prototype.notifyRestored = function () {
                    this.setResourceFlag(akra.EResourceItemEvents.k_Disabled, false);
                }/** @inline */
                ;
                ResourcePoolItem.prototype.notifyDisabled = function () {
                    this.setResourceFlag(akra.EResourceItemEvents.k_Disabled, true);
                }/** @inline */
                ;
                ResourcePoolItem.prototype.notifyAltered = function () {
                    this.setResourceFlag(akra.EResourceItemEvents.k_Altered, true);
                }/** @inline */
                ;
                ResourcePoolItem.prototype.notifySaved = function () {
                    this.setAlteredFlag(false);
                }/** @inline */
                ;
                ResourcePoolItem.prototype.isResourceCreated = function () {
                    return akra.bf.testBit(this.iResourceFlags, akra.EResourceItemEvents.k_Created);
                }/** @inline */
                ;
                ResourcePoolItem.prototype.isResourceLoaded = function () {
                    return akra.bf.testBit(this.iResourceFlags, akra.EResourceItemEvents.k_Loaded);
                }/** @inline */
                ;
                ResourcePoolItem.prototype.isResourceDisabled = function () {
                    return akra.bf.testBit(this.iResourceFlags, akra.EResourceItemEvents.k_Disabled);
                }/** @inline */
                ;
                ResourcePoolItem.prototype.isResourceAltered = function () {
                    return akra.bf.testBit(this.iResourceFlags, akra.EResourceItemEvents.k_Altered);
                };
                ResourcePoolItem.prototype.setAlteredFlag = function (isOn) {
                    if (typeof isOn === "undefined") { isOn = true; }
                    this.setResourceFlag(akra.EResourceItemEvents.k_Altered, isOn);
                }/** @inline */
                ;
                ResourcePoolItem.prototype.setResourceName = function (sName) {
                    if(this.pResourcePool != null) {
                        this.pResourcePool.setResourceName(this.iResourceHandle, sName);
                    }
                };
                ResourcePoolItem.prototype.findResourceName = function () {
                    if(this.pResourcePool != null) {
                        return this.pResourcePool.findResourceName(this.iResourceHandle);
                    }
                    return null;
                };
                ResourcePoolItem.prototype.release = function () {
                    var iRefCount = _super.prototype.release.call(this);
                    if(iRefCount == 0) {
                        //Если у нас есть менеджер попросим его удалить нас
                        if(this.pResourcePool != null) {
                            this.pResourcePool.destroyResource(this);
                        }
                    }
                    return iRefCount;
                }/**
                * Назначение кода ресурсу
                * @inline
                */
                ;
                ResourcePoolItem.prototype.setResourceCode = function (pCode) {
                    this.pResourceCode.eq(pCode);
                }/**
                * Чтобы ресурс знал какому пулу ресурсов принадлжит
                * @inline
                */
                ;
                ResourcePoolItem.prototype.setResourcePool = function (pPool) {
                    this.pResourcePool = pPool;
                }/**
                * Назначение хендла ресурсу
                * @inline
                */
                ;
                ResourcePoolItem.prototype.setResourceHandle = function (iHandle) {
                    this.iResourceHandle = iHandle;
                };
                ResourcePoolItem.prototype.notifyStateChange = function (eEvent, pTarget) {
                    if (typeof pTarget === "undefined") { pTarget = null; }
                    if(!this.pStateWatcher[eEvent]) {
                        return;
                    }
                    var pSignSlots = this.pCallbackSlots[eEvent];
                    var nTotal = pSignSlots.length;
                    var nLoaded = 0;

                    for(var i = 0; i < nTotal; ++i) {
                        if(pSignSlots[i].bState) {
                            ++nLoaded;
                        }
                    }
                    this.pStateWatcher[eEvent](nLoaded, nTotal, pTarget);
                };
                ResourcePoolItem.prototype.setResourceFlag = function (iFlagBit, isSetting) {
                    var iTempFlags = this.iResourceFlags;
                    akra.bf.setBit(this.iResourceFlags, iFlagBit, isSetting);
                    if(iTempFlags != this.iResourceFlags) {
                        for(var i = 0; i < this.pCallbackFunctions.length; i++) {
                            if(this.pCallbackFunctions[i]) {
                                this.pCallbackFunctions[i].call(this, iFlagBit, this.iResourceFlags, isSetting);
                            }
                        }
                    }
                };
                ResourcePoolItem.parseEvent = function parseEvent(pEvent) {
                    if(akra.isInt(pEvent)) {
                        return pEvent;
                    }
                    switch(pEvent.toLowerCase()) {
                        case 'loaded': {
                            return akra.EResourceItemEvents.k_Loaded;

                        }
                        case 'created': {
                            return akra.EResourceItemEvents.k_Created;

                        }
                        case 'disabled': {
                            return akra.EResourceItemEvents.k_Disabled;

                        }
                        case 'altered': {
                            return akra.EResourceItemEvents.k_Altered;

                        }
                        default: {
                            akra.error('Использовано неизвестное событие для ресурса.');
                            return 0;

                        }
                    }
                }
                return ResourcePoolItem;
            })(akra.util.ReferenceCounter);
            pool.ResourcePoolItem = ResourcePoolItem;            
        })(core.pool || (core.pool = {}));
        var pool = core.pool;
    })(akra.core || (akra.core = {}));
    var core = akra.core;
})(akra || (akra = {}));
