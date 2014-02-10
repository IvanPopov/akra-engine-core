var akra;
(function (akra) {
    (function (EIO) {
        EIO[EIO["IN"] = 0x01] = "IN";
        EIO[EIO["OUT"] = 0x02] = "OUT";
        EIO[EIO["ATE"] = 0x04] = "ATE";
        EIO[EIO["APP"] = 0x08] = "APP";
        EIO[EIO["TRUNC"] = 0x10] = "TRUNC";
        EIO[EIO["BINARY"] = 0x20] = "BINARY";
        EIO[EIO["TEXT"] = 0x40] = "TEXT";
        EIO[EIO["JSON"] = 0x80] = "JSON";
        EIO[EIO["URL"] = 0x100] = "URL";

        EIO[EIO["BIN"] = 0x20] = "BIN";
    })(akra.EIO || (akra.EIO = {}));
    var EIO = akra.EIO;
    ;
})(akra || (akra = {}));
//# sourceMappingURL=EIO.js.map
