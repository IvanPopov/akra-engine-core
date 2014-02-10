var akra;
(function (akra) {
    (function (EDataTypes) {
        EDataTypes[EDataTypes["BYTE"] = 0x1400] = "BYTE";
        EDataTypes[EDataTypes["UNSIGNED_BYTE"] = 0x1401] = "UNSIGNED_BYTE";
        EDataTypes[EDataTypes["SHORT"] = 0x1402] = "SHORT";
        EDataTypes[EDataTypes["UNSIGNED_SHORT"] = 0x1403] = "UNSIGNED_SHORT";
        EDataTypes[EDataTypes["INT"] = 0x1404] = "INT";
        EDataTypes[EDataTypes["UNSIGNED_INT"] = 0x1405] = "UNSIGNED_INT";
        EDataTypes[EDataTypes["FLOAT"] = 0x1406] = "FLOAT";
    })(akra.EDataTypes || (akra.EDataTypes = {}));
    var EDataTypes = akra.EDataTypes;

    (function (EDataTypeSizes) {
        EDataTypeSizes[EDataTypeSizes["BYTES_PER_BYTE"] = 1] = "BYTES_PER_BYTE";
        EDataTypeSizes[EDataTypeSizes["BYTES_PER_UNSIGNED_BYTE"] = 1] = "BYTES_PER_UNSIGNED_BYTE";
        EDataTypeSizes[EDataTypeSizes["BYTES_PER_UBYTE"] = 1] = "BYTES_PER_UBYTE";

        EDataTypeSizes[EDataTypeSizes["BYTES_PER_SHORT"] = 2] = "BYTES_PER_SHORT";
        EDataTypeSizes[EDataTypeSizes["BYTES_PER_UNSIGNED_SHORT"] = 2] = "BYTES_PER_UNSIGNED_SHORT";
        EDataTypeSizes[EDataTypeSizes["BYTES_PER_USHORT"] = 2] = "BYTES_PER_USHORT";

        EDataTypeSizes[EDataTypeSizes["BYTES_PER_INT"] = 4] = "BYTES_PER_INT";
        EDataTypeSizes[EDataTypeSizes["BYTES_PER_UNSIGNED_INT"] = 4] = "BYTES_PER_UNSIGNED_INT";
        EDataTypeSizes[EDataTypeSizes["BYTES_PER_UINT"] = 4] = "BYTES_PER_UINT";

        EDataTypeSizes[EDataTypeSizes["BYTES_PER_FLOAT"] = 4] = "BYTES_PER_FLOAT";
    })(akra.EDataTypeSizes || (akra.EDataTypeSizes = {}));
    var EDataTypeSizes = akra.EDataTypeSizes;
})(akra || (akra = {}));
//# sourceMappingURL=EDataTypes.js.map
