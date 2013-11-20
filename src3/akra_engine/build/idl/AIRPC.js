// AIRPC interface
// [write description here...]
/// <reference path="AIEventProvider.ts" />
var AERPCPacketTypes;
(function (AERPCPacketTypes) {
    AERPCPacketTypes[AERPCPacketTypes["FAILURE"] = 0] = "FAILURE";
    AERPCPacketTypes[AERPCPacketTypes["REQUEST"] = 1] = "REQUEST";
    AERPCPacketTypes[AERPCPacketTypes["RESPONSE"] = 2] = "RESPONSE";
})(AERPCPacketTypes || (AERPCPacketTypes = {}));

var AERpcStates;
(function (AERpcStates) {
    //not connected
    AERpcStates[AERpcStates["k_Deteached"] = 0] = "k_Deteached";

    //connected, and connection must be established
    AERpcStates[AERpcStates["k_Joined"] = 1] = "k_Joined";

    //must be closed
    AERpcStates[AERpcStates["k_Closing"] = 2] = "k_Closing";
})(AERpcStates || (AERpcStates = {}));
//# sourceMappingURL=AIRPC.js.map
