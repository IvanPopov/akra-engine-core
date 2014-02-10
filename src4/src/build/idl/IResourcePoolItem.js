/// <reference path="IReferenceCounter.ts" />
/// <reference path="IEventProvider.ts" />
/// <reference path="IEngine.ts" />
/// <reference path="IResourceWatcherFunc.ts" />
/// <reference path="IResourceNotifyRoutineFunc.ts" />
/// <reference path="IResourceCode.ts" />
/// <reference path="IResourcePool.ts" />
/// <reference path="IResourcePoolManager.ts" />
/**
* Отражает состояние ресурса
**/
var akra;
(function (akra) {
    (function (EResourceItemEvents) {
        //ресур создан
        EResourceItemEvents[EResourceItemEvents["CREATED"] = 0] = "CREATED";

        //ресур заполнен данным и готов к использованию
        EResourceItemEvents[EResourceItemEvents["LOADED"] = 1] = "LOADED";

        //ресур в данный момент отключен для использования
        EResourceItemEvents[EResourceItemEvents["DISABLED"] = 2] = "DISABLED";

        //ресур был изменен после загрузки
        EResourceItemEvents[EResourceItemEvents["ALTERED"] = 3] = "ALTERED";
        EResourceItemEvents[EResourceItemEvents["TOTALRESOURCEFLAGS"] = 4] = "TOTALRESOURCEFLAGS";
    })(akra.EResourceItemEvents || (akra.EResourceItemEvents = {}));
    var EResourceItemEvents = akra.EResourceItemEvents;
    ;
})(akra || (akra = {}));
//# sourceMappingURL=IResourcePoolItem.js.map
