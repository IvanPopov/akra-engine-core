/// <reference path="IReferenceCounter.ts" />
/// <reference path="IEventProvider.ts" />
/// <reference path="IRenderDataCollection.ts" />
/// <reference path="IBufferMap.ts" />
/// <reference path="IVertexDeclaration.ts" />
/// <reference path="IVertexData.ts" />
var akra;
(function (akra) {
    (function (ERenderDataTypes) {
        ERenderDataTypes[ERenderDataTypes["ISOLATED"] = 0] = "ISOLATED";
        ERenderDataTypes[ERenderDataTypes["INDEXED"] = 1] = "INDEXED";
        ERenderDataTypes[ERenderDataTypes["I2I"] = 2] = "I2I";
        ERenderDataTypes[ERenderDataTypes["DIRECT"] = 3] = "DIRECT";
    })(akra.ERenderDataTypes || (akra.ERenderDataTypes = {}));
    var ERenderDataTypes = akra.ERenderDataTypes;
    ;

    (function (ERenderDataOptions) {
        ERenderDataOptions[ERenderDataOptions["ADVANCED_INDEX"] = 65536] = "ADVANCED_INDEX" /*1 << 0x10*/ ;
        ERenderDataOptions[ERenderDataOptions["SINGLE_INDEX"] = 131072] = "SINGLE_INDEX" /*1 << 0x11*/ ;

        /*<! создать RenderData как классические данные, с данными только в аттрибутах, без использования видео буфферов.*/
        ERenderDataOptions[ERenderDataOptions["RENDERABLE"] = 262144] = "RENDERABLE";
    })(akra.ERenderDataOptions || (akra.ERenderDataOptions = {}));
    var ERenderDataOptions = akra.ERenderDataOptions;
})(akra || (akra = {}));
//# sourceMappingURL=IRenderData.js.map
