// AIRPC interface
// [write description here...]
/// <reference path="AIEventProvider.ts" />
var AERPCPacketTypes;
(function (AERPCPacketTypes) {
    AERPCPacketTypes[AERPCPacketTypes["FAILURE"] = 0] = "FAILURE";
    AERPCPacketTypes[AERPCPacketTypes["REQUEST"] = 1] = "REQUEST";
    AERPCPacketTypes[AERPCPacketTypes["RESPONSE"] = 2] = "RESPONSE";
})(AERPCPacketTypes || (AERPCPacketTypes = {}));
