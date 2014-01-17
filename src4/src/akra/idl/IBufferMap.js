/// <reference path="IReferenceCounter.ts" />
/// <reference path="IEventProvider.ts" />
/// <reference path="IVertexData.ts" />
/// <reference path="IIndexData.ts" />
var akra;
(function (akra) {
    (function (EDataFlowTypes) {
        EDataFlowTypes[EDataFlowTypes["MAPPABLE"] = 1] = "MAPPABLE";
        EDataFlowTypes[EDataFlowTypes["UNMAPPABLE"] = 0] = "UNMAPPABLE";
    })(akra.EDataFlowTypes || (akra.EDataFlowTypes = {}));
    var EDataFlowTypes = akra.EDataFlowTypes;
    ;
})(akra || (akra = {}));
