/// <reference path="IBuffer.ts" />
var akra;
(function (akra) {
    (function (EHardwareBufferFlags) {
        EHardwareBufferFlags[EHardwareBufferFlags["STATIC"] = 0x01] = "STATIC";
        EHardwareBufferFlags[EHardwareBufferFlags["DYNAMIC"] = 0x02] = "DYNAMIC";
        EHardwareBufferFlags[EHardwareBufferFlags["STREAM"] = 0x80] = "STREAM";

        EHardwareBufferFlags[EHardwareBufferFlags["READABLE"] = 0x04] = "READABLE";

        EHardwareBufferFlags[EHardwareBufferFlags["BACKUP_COPY"] = 0x08] = "BACKUP_COPY";

        /** indicate, that buffer does not use GPU memory or other specific memory. */
        EHardwareBufferFlags[EHardwareBufferFlags["SOFTWARE"] = 0x10] = "SOFTWARE";

        /** Indicate, tha buffer uses specific data aligment */
        EHardwareBufferFlags[EHardwareBufferFlags["ALIGNMENT"] = 0x20] = "ALIGNMENT";

        /** Indicates that the application will be refilling the contents
        of the buffer regularly (not just updating, but generating the
        contents from scratch), and therefore does not mind if the contents
        of the buffer are lost somehow and need to be recreated. This
        allows and additional level of optimisation on the buffer.
        This option only really makes sense when combined with
        DYNAMIC and without READING.
        */
        EHardwareBufferFlags[EHardwareBufferFlags["DISCARDABLE"] = 0x40] = "DISCARDABLE";

        EHardwareBufferFlags[EHardwareBufferFlags["STATIC_READABLE"] = EHardwareBufferFlags.STATIC | EHardwareBufferFlags.READABLE] = "STATIC_READABLE";
        EHardwareBufferFlags[EHardwareBufferFlags["DYNAMIC_DISCARDABLE"] = EHardwareBufferFlags.DYNAMIC | EHardwareBufferFlags.DISCARDABLE] = "DYNAMIC_DISCARDABLE";
    })(akra.EHardwareBufferFlags || (akra.EHardwareBufferFlags = {}));
    var EHardwareBufferFlags = akra.EHardwareBufferFlags;

    (function (ELockFlags) {
        ELockFlags[ELockFlags["READ"] = 0x01] = "READ";
        ELockFlags[ELockFlags["WRITE"] = 0x02] = "WRITE";
        ELockFlags[ELockFlags["DISCARD"] = 0x04] = "DISCARD";
        ELockFlags[ELockFlags["NO_OVERWRITE"] = 0x08] = "NO_OVERWRITE";

        ELockFlags[ELockFlags["NORMAL"] = ELockFlags.READ | ELockFlags.WRITE] = "NORMAL";
    })(akra.ELockFlags || (akra.ELockFlags = {}));
    var ELockFlags = akra.ELockFlags;
})(akra || (akra = {}));
//# sourceMappingURL=IHardwareBuffer.js.map
