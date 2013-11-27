/// <reference path="../idl/AIReferenceCounter.ts" />
define(["require", "exports", "limit", "logger"], function(require, exports, __limit__, __logger__) {
    var limit = __limit__;
    var logger = __logger__;

    var ReferenceCounter = (function () {
        function ReferenceCounter(pSrc) {
            this.nReferenceCount = 0;
        }
        ReferenceCounter.prototype.referenceCount = function () {
            return this.nReferenceCount;
        };

        ReferenceCounter.prototype.destructor = function () {
            logger.assert(this.nReferenceCount === 0, "object is used");
        };

        ReferenceCounter.prototype.release = function () {
            logger.assert(this.nReferenceCount > 0, "object is used");
            this.nReferenceCount--;
            return this.nReferenceCount;
        };

        ReferenceCounter.prototype.addRef = function () {
            logger.assert(this.nReferenceCount != limit.MIN_INT32, "reference fail");

            this.nReferenceCount++;

            return this.nReferenceCount;
        };

        ReferenceCounter.prototype.eq = function (pSrc) {
            return this;
        };
        return ReferenceCounter;
    })();

    
    return ReferenceCounter;
});
//# sourceMappingURL=ReferenceCounter.js.map
