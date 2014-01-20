var akra;
(function (akra) {
    /// <reference path="ResourcePoolItem.ts" />
    (function (pool) {
        function isVideoResource(pItem) {
            return !akra.isNull(pItem) && pItem.resourceCode.family === akra.EResourceFamilies.VIDEO_RESOURCE;
        }
        pool.isVideoResource = isVideoResource;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
