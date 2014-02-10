var akra;
(function (akra) {
    (function (EPrimitiveTypes) {
        EPrimitiveTypes[EPrimitiveTypes["POINTLIST"] = 0] = "POINTLIST";
        EPrimitiveTypes[EPrimitiveTypes["LINELIST"] = 1] = "LINELIST";
        EPrimitiveTypes[EPrimitiveTypes["LINELOOP"] = 2] = "LINELOOP";
        EPrimitiveTypes[EPrimitiveTypes["LINESTRIP"] = 3] = "LINESTRIP";
        EPrimitiveTypes[EPrimitiveTypes["TRIANGLELIST"] = 4] = "TRIANGLELIST";
        EPrimitiveTypes[EPrimitiveTypes["TRIANGLESTRIP"] = 5] = "TRIANGLESTRIP";
        EPrimitiveTypes[EPrimitiveTypes["TRIANGLEFAN"] = 6] = "TRIANGLEFAN";
    })(akra.EPrimitiveTypes || (akra.EPrimitiveTypes = {}));
    var EPrimitiveTypes = akra.EPrimitiveTypes;
})(akra || (akra = {}));
//# sourceMappingURL=EPrimitiveTypes.js.map
