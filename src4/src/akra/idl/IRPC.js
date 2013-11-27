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
