// AIRenderData interface
// [write description here...]
/// <reference path="AIReferenceCounter.ts" />
/// <reference path="AIEventProvider.ts" />
/// <reference path="AIRenderDataCollection.ts" />
/// <reference path="AIBufferMap.ts" />
/// <reference path="AIVertexDeclaration.ts" />
/// <reference path="AIVertexData.ts" />
var AERenderDataTypes;
(function (AERenderDataTypes) {
    AERenderDataTypes[AERenderDataTypes["ISOLATED"] = 0] = "ISOLATED";
    AERenderDataTypes[AERenderDataTypes["INDEXED"] = 1] = "INDEXED";
    AERenderDataTypes[AERenderDataTypes["I2I"] = 2] = "I2I";
    AERenderDataTypes[AERenderDataTypes["DIRECT"] = 3] = "DIRECT";
})(AERenderDataTypes || (AERenderDataTypes = {}));
;

var AERenderDataOptions;
(function (AERenderDataOptions) {
    AERenderDataOptions[AERenderDataOptions["ADVANCED_INDEX"] = 65536] = "ADVANCED_INDEX"/*1 << 0x10*/ ;
    AERenderDataOptions[AERenderDataOptions["SINGLE_INDEX"] = 131072] = "SINGLE_INDEX"/*1 << 0x11*/ ;

    /*<! создать RenderData как классические данные, с данными только в аттрибутах, без использования видео буфферов.*/
    AERenderDataOptions[AERenderDataOptions["RENDERABLE"] = 262144] = "RENDERABLE";
})(AERenderDataOptions || (AERenderDataOptions = {}));
//# sourceMappingURL=AIRenderData.js.map
