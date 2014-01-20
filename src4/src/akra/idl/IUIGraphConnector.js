// IUIGraphConnector export interface
// [write description here...]
/// <reference path="IUIComponent.ts" />
/// <reference path="IUIGraphNode.ts" />
//#define UIGRAPH_FLOATING_INPUT -1
var akra;
(function (akra) {
    akra.UIGRAPH_FLOATING_INPUT = -1;

    (function (EGraphConnectorOrient) {
        EGraphConnectorOrient[EGraphConnectorOrient["UNKNOWN"] = 0] = "UNKNOWN";
        EGraphConnectorOrient[EGraphConnectorOrient["UP"] = 1] = "UP";
        EGraphConnectorOrient[EGraphConnectorOrient["DOWN"] = 2] = "DOWN";
        EGraphConnectorOrient[EGraphConnectorOrient["LEFT"] = 3] = "LEFT";
        EGraphConnectorOrient[EGraphConnectorOrient["RIGHT"] = 4] = "RIGHT";
    })(akra.EGraphConnectorOrient || (akra.EGraphConnectorOrient = {}));
    var EGraphConnectorOrient = akra.EGraphConnectorOrient;
})(akra || (akra = {}));
