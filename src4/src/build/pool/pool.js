/// <reference path="ResourcePoolItem.ts" />
var akra;
(function (akra) {
    (function (pool) {
        function isVideoResource(pItem) {
            return !akra.isNull(pItem) && pItem.getResourceCode().getFamily() === 0 /* VIDEO_RESOURCE */;
        }
        pool.isVideoResource = isVideoResource;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
//# sourceMappingURL=pool.js.map
