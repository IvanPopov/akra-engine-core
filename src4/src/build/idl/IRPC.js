/// <reference path="IEventProvider.ts" />
/// <reference path="IMap.ts" />
var akra;
(function (akra) {
    (function (ERPCPacketTypes) {
        ERPCPacketTypes[ERPCPacketTypes["FAILURE"] = 0] = "FAILURE";
        ERPCPacketTypes[ERPCPacketTypes["REQUEST"] = 1] = "REQUEST";
        ERPCPacketTypes[ERPCPacketTypes["RESPONSE"] = 2] = "RESPONSE";
    })(akra.ERPCPacketTypes || (akra.ERPCPacketTypes = {}));
    var ERPCPacketTypes = akra.ERPCPacketTypes;

    (function (ERPCErrorCodes) {
        ERPCErrorCodes[ERPCErrorCodes["STACK_SIZE_EXCEEDED"] = 0] = "STACK_SIZE_EXCEEDED";
        ERPCErrorCodes[ERPCErrorCodes["CALLBACK_LIFETIME_EXPIRED"] = 1] = "CALLBACK_LIFETIME_EXPIRED";
    })(akra.ERPCErrorCodes || (akra.ERPCErrorCodes = {}));
    var ERPCErrorCodes = akra.ERPCErrorCodes;

    (function (ERpcStates) {
        //not connected
        ERpcStates[ERpcStates["k_Deteached"] = 0] = "k_Deteached";

        //connected, and connection must be established
        ERpcStates[ERpcStates["k_Joined"] = 1] = "k_Joined";

        //must be closed
        ERpcStates[ERpcStates["k_Closing"] = 2] = "k_Closing";
    })(akra.ERpcStates || (akra.ERpcStates = {}));
    var ERpcStates = akra.ERpcStates;
})(akra || (akra = {}));
//# sourceMappingURL=IRPC.js.map
