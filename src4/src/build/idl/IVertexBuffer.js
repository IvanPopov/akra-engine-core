/// <reference path="IHardwareBuffer.ts" />
/// <reference path="IRenderResource.ts" />
/// <reference path="IVertexData.ts" />
/// <reference path="IVertexElement.ts" />
/// <reference path="IVertexDeclaration.ts" />
var akra;
(function (akra) {
    (function (EVertexBufferTypes) {
        EVertexBufferTypes[EVertexBufferTypes["UNKNOWN"] = 0] = "UNKNOWN";
        EVertexBufferTypes[EVertexBufferTypes["VBO"] = 1] = "VBO";
        EVertexBufferTypes[EVertexBufferTypes["TBO"] = 2] = "TBO";
    })(akra.EVertexBufferTypes || (akra.EVertexBufferTypes = {}));
    var EVertexBufferTypes = akra.EVertexBufferTypes;
    ;
})(akra || (akra = {}));
//# sourceMappingURL=IVertexBuffer.js.map
