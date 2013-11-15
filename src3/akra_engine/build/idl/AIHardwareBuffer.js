// AIHardwareBuffer interface
// [write description here...]
/// <reference path="AIBuffer.ts" />
var AEHardwareBufferFlags;
(function (AEHardwareBufferFlags) {
    AEHardwareBufferFlags[AEHardwareBufferFlags["STATIC"] = 0x01] = "STATIC";
    AEHardwareBufferFlags[AEHardwareBufferFlags["DYNAMIC"] = 0x02] = "DYNAMIC";
    AEHardwareBufferFlags[AEHardwareBufferFlags["STREAM"] = 0x80] = "STREAM";

    AEHardwareBufferFlags[AEHardwareBufferFlags["READABLE"] = 0x04] = "READABLE";

    AEHardwareBufferFlags[AEHardwareBufferFlags["BACKUP_COPY"] = 0x08] = "BACKUP_COPY";

    /** indicate, that buffer does not use GPU memory or other specific memory. */
    AEHardwareBufferFlags[AEHardwareBufferFlags["SOFTWARE"] = 0x10] = "SOFTWARE";

    /** Indicate, tha buffer uses specific data aligment */
    AEHardwareBufferFlags[AEHardwareBufferFlags["ALIGNMENT"] = 0x20] = "ALIGNMENT";

    /** Indicates that the application will be refilling the contents
    of the buffer regularly (not just updating, but generating the
    contents from scratch), and therefore does not mind if the contents
    of the buffer are lost somehow and need to be recreated. This
    allows and additional level of optimisation on the buffer.
    This option only really makes sense when combined with
    DYNAMIC and without READING.
    */
    AEHardwareBufferFlags[AEHardwareBufferFlags["DISCARDABLE"] = 0x40] = "DISCARDABLE";

    AEHardwareBufferFlags[AEHardwareBufferFlags["STATIC_READABLE"] = AEHardwareBufferFlags.STATIC | AEHardwareBufferFlags.READABLE] = "STATIC_READABLE";
    AEHardwareBufferFlags[AEHardwareBufferFlags["DYNAMIC_DISCARDABLE"] = AEHardwareBufferFlags.DYNAMIC | AEHardwareBufferFlags.DISCARDABLE] = "DYNAMIC_DISCARDABLE";
})(AEHardwareBufferFlags || (AEHardwareBufferFlags = {}));

var AELockFlags;
(function (AELockFlags) {
    AELockFlags[AELockFlags["READ"] = 0x01] = "READ";
    AELockFlags[AELockFlags["WRITE"] = 0x02] = "WRITE";
    AELockFlags[AELockFlags["DISCARD"] = 0x04] = "DISCARD";
    AELockFlags[AELockFlags["NO_OVERWRITE"] = 0x08] = "NO_OVERWRITE";

    AELockFlags[AELockFlags["NORMAL"] = AELockFlags.READ | AELockFlags.WRITE] = "NORMAL";
})(AELockFlags || (AELockFlags = {}));
//# sourceMappingURL=AIHardwareBuffer.js.map
