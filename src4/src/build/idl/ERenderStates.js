var akra;
(function (akra) {
    (function (ERenderStates) {
        ERenderStates[ERenderStates["BLENDENABLE"] = 0] = "BLENDENABLE";
        ERenderStates[ERenderStates["CULLFACEENABLE"] = 1] = "CULLFACEENABLE";
        ERenderStates[ERenderStates["ZENABLE"] = 2] = "ZENABLE";
        ERenderStates[ERenderStates["ZWRITEENABLE"] = 3] = "ZWRITEENABLE";
        ERenderStates[ERenderStates["DITHERENABLE"] = 4] = "DITHERENABLE";
        ERenderStates[ERenderStates["SCISSORTESTENABLE"] = 5] = "SCISSORTESTENABLE";
        ERenderStates[ERenderStates["STENCILTESTENABLE"] = 6] = "STENCILTESTENABLE";
        ERenderStates[ERenderStates["POLYGONOFFSETFILLENABLE"] = 7] = "POLYGONOFFSETFILLENABLE";

        ERenderStates[ERenderStates["CULLFACE"] = 8] = "CULLFACE";
        ERenderStates[ERenderStates["FRONTFACE"] = 9] = "FRONTFACE";

        ERenderStates[ERenderStates["SRCBLEND"] = 10] = "SRCBLEND";
        ERenderStates[ERenderStates["DESTBLEND"] = 11] = "DESTBLEND";

        ERenderStates[ERenderStates["ZFUNC"] = 12] = "ZFUNC";

        ERenderStates[ERenderStates["ALPHABLENDENABLE"] = 13] = "ALPHABLENDENABLE";
        ERenderStates[ERenderStates["ALPHATESTENABLE"] = 14] = "ALPHATESTENABLE";
    })(akra.ERenderStates || (akra.ERenderStates = {}));
    var ERenderStates = akra.ERenderStates;
})(akra || (akra = {}));
//# sourceMappingURL=ERenderStates.js.map
