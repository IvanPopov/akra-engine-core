// AIResourcePoolItem interface
// [write description here...]
/// <reference path="AIReferenceCounter.ts" />
/// <reference path="AIEventProvider.ts" />
/// <reference path="AIEngine.ts" />
/// <reference path="AIResourceWatcherFunc.ts" />
/// <reference path="AIResourceNotifyRoutineFunc.ts" />
/// <reference path="AIResourceCode.ts" />
/// <reference path="AIResourcePool.ts" />
/// <reference path="AIResourcePoolManager.ts" />
/**
* Отражает состояние ресурса
**/
var AEResourceItemEvents;
(function (AEResourceItemEvents) {
    //ресур создан
    AEResourceItemEvents[AEResourceItemEvents["CREATED"] = 0] = "CREATED";

    //ресур заполнен данным и готов к использованию
    AEResourceItemEvents[AEResourceItemEvents["LOADED"] = 1] = "LOADED";

    //ресур в данный момент отключен для использования
    AEResourceItemEvents[AEResourceItemEvents["DISABLED"] = 2] = "DISABLED";

    //ресур был изменен после загрузки
    AEResourceItemEvents[AEResourceItemEvents["ALTERED"] = 3] = "ALTERED";
    AEResourceItemEvents[AEResourceItemEvents["TOTALRESOURCEFLAGS"] = 4] = "TOTALRESOURCEFLAGS";
})(AEResourceItemEvents || (AEResourceItemEvents = {}));
;
//# sourceMappingURL=AIResourcePoolItem.js.map
