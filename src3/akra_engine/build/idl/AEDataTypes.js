var AEDataTypes;
(function (AEDataTypes) {
    AEDataTypes[AEDataTypes["BYTE"] = 0x1400] = "BYTE";
    AEDataTypes[AEDataTypes["UNSIGNED_BYTE"] = 0x1401] = "UNSIGNED_BYTE";
    AEDataTypes[AEDataTypes["SHORT"] = 0x1402] = "SHORT";
    AEDataTypes[AEDataTypes["UNSIGNED_SHORT"] = 0x1403] = "UNSIGNED_SHORT";
    AEDataTypes[AEDataTypes["INT"] = 0x1404] = "INT";
    AEDataTypes[AEDataTypes["UNSIGNED_INT"] = 0x1405] = "UNSIGNED_INT";
    AEDataTypes[AEDataTypes["FLOAT"] = 0x1406] = "FLOAT";
})(AEDataTypes || (AEDataTypes = {}));

var AEDataTypeSizes;
(function (AEDataTypeSizes) {
    AEDataTypeSizes[AEDataTypeSizes["BYTES_PER_BYTE"] = 1] = "BYTES_PER_BYTE";
    AEDataTypeSizes[AEDataTypeSizes["BYTES_PER_UNSIGNED_BYTE"] = 1] = "BYTES_PER_UNSIGNED_BYTE";
    AEDataTypeSizes[AEDataTypeSizes["BYTES_PER_UBYTE"] = 1] = "BYTES_PER_UBYTE";

    AEDataTypeSizes[AEDataTypeSizes["BYTES_PER_SHORT"] = 2] = "BYTES_PER_SHORT";
    AEDataTypeSizes[AEDataTypeSizes["BYTES_PER_UNSIGNED_SHORT"] = 2] = "BYTES_PER_UNSIGNED_SHORT";
    AEDataTypeSizes[AEDataTypeSizes["BYTES_PER_USHORT"] = 2] = "BYTES_PER_USHORT";

    AEDataTypeSizes[AEDataTypeSizes["BYTES_PER_INT"] = 4] = "BYTES_PER_INT";
    AEDataTypeSizes[AEDataTypeSizes["BYTES_PER_UNSIGNED_INT"] = 4] = "BYTES_PER_UNSIGNED_INT";
    AEDataTypeSizes[AEDataTypeSizes["BYTES_PER_UINT"] = 4] = "BYTES_PER_UINT";

    AEDataTypeSizes[AEDataTypeSizes["BYTES_PER_FLOAT"] = 4] = "BYTES_PER_FLOAT";
})(AEDataTypeSizes || (AEDataTypeSizes = {}));
//# sourceMappingURL=AEDataTypes.js.map
