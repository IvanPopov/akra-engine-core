var akra;
(function (akra) {
    (function (ECompareFunction) {
        ECompareFunction[ECompareFunction["ALWAYS_FAIL"] = 0] = "ALWAYS_FAIL";
        ECompareFunction[ECompareFunction["ALWAYS_PASS"] = 1] = "ALWAYS_PASS";
        ECompareFunction[ECompareFunction["LESS"] = 2] = "LESS";
        ECompareFunction[ECompareFunction["LESS_EQUAL"] = 3] = "LESS_EQUAL";
        ECompareFunction[ECompareFunction["EQUAL"] = 4] = "EQUAL";
        ECompareFunction[ECompareFunction["NOT_EQUAL"] = 5] = "NOT_EQUAL";
        ECompareFunction[ECompareFunction["GREATER_EQUAL"] = 6] = "GREATER_EQUAL";
        ECompareFunction[ECompareFunction["GREATER"] = 7] = "GREATER";
    })(akra.ECompareFunction || (akra.ECompareFunction = {}));
    var ECompareFunction = akra.ECompareFunction;

    (function (ECullingMode) {
        ECullingMode[ECullingMode["NONE"] = 1] = "NONE";
        ECullingMode[ECullingMode["CLOCKWISE"] = 2] = "CLOCKWISE";
        ECullingMode[ECullingMode["ANTICLOCKWISE"] = 3] = "ANTICLOCKWISE";
    })(akra.ECullingMode || (akra.ECullingMode = {}));
    var ECullingMode = akra.ECullingMode;

    (function (EFrameBufferTypes) {
        EFrameBufferTypes[EFrameBufferTypes["COLOR"] = 0x1] = "COLOR";
        EFrameBufferTypes[EFrameBufferTypes["DEPTH"] = 0x2] = "DEPTH";
        EFrameBufferTypes[EFrameBufferTypes["STENCIL"] = 0x4] = "STENCIL";
    })(akra.EFrameBufferTypes || (akra.EFrameBufferTypes = {}));
    var EFrameBufferTypes = akra.EFrameBufferTypes;
})(akra || (akra = {}));
//# sourceMappingURL=IViewportState.js.map
