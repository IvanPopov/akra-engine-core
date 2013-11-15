// AIViewportState interface
// [write description here...]
var AECompareFunction;
(function (AECompareFunction) {
    AECompareFunction[AECompareFunction["ALWAYS_FAIL"] = 0] = "ALWAYS_FAIL";
    AECompareFunction[AECompareFunction["ALWAYS_PASS"] = 1] = "ALWAYS_PASS";
    AECompareFunction[AECompareFunction["LESS"] = 2] = "LESS";
    AECompareFunction[AECompareFunction["LESS_EQUAL"] = 3] = "LESS_EQUAL";
    AECompareFunction[AECompareFunction["EQUAL"] = 4] = "EQUAL";
    AECompareFunction[AECompareFunction["NOT_EQUAL"] = 5] = "NOT_EQUAL";
    AECompareFunction[AECompareFunction["GREATER_EQUAL"] = 6] = "GREATER_EQUAL";
    AECompareFunction[AECompareFunction["GREATER"] = 7] = "GREATER";
})(AECompareFunction || (AECompareFunction = {}));

var AECullingMode;
(function (AECullingMode) {
    AECullingMode[AECullingMode["NONE"] = 1] = "NONE";
    AECullingMode[AECullingMode["CLOCKWISE"] = 2] = "CLOCKWISE";
    AECullingMode[AECullingMode["ANTICLOCKWISE"] = 3] = "ANTICLOCKWISE";
})(AECullingMode || (AECullingMode = {}));

var AEFrameBufferTypes;
(function (AEFrameBufferTypes) {
    AEFrameBufferTypes[AEFrameBufferTypes["COLOR"] = 0x1] = "COLOR";
    AEFrameBufferTypes[AEFrameBufferTypes["DEPTH"] = 0x2] = "DEPTH";
    AEFrameBufferTypes[AEFrameBufferTypes["STENCIL"] = 0x4] = "STENCIL";
})(AEFrameBufferTypes || (AEFrameBufferTypes = {}));
//# sourceMappingURL=AIViewportState.js.map
