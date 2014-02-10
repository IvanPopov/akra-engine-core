/// <reference path="../idl/IReferenceCounter.ts" />
var akra;
(function (akra) {
    /// <reference path="../limit.ts" />
    /// <reference path="../logger.ts" />
    /// <reference path="../limit.ts" />
    (function (util) {
        var ReferenceCounter = (function () {
            function ReferenceCounter(pSrc) {
                this.nReferenceCount = 0;
            }
            ReferenceCounter.prototype.referenceCount = function () {
                return this.nReferenceCount;
            };

            ReferenceCounter.prototype.destructor = function () {
                akra.logger.assert(this.nReferenceCount === 0, "object is used");
            };

            ReferenceCounter.prototype.release = function () {
                akra.logger.assert(this.nReferenceCount > 0, "object is used");
                this.nReferenceCount--;
                return this.nReferenceCount;
            };

            ReferenceCounter.prototype.addRef = function () {
                akra.logger.assert(this.nReferenceCount != akra.MIN_INT32, "reference fail");

                this.nReferenceCount++;

                return this.nReferenceCount;
            };

            ReferenceCounter.prototype.eq = function (pSrc) {
                return this;
            };
            return ReferenceCounter;
        })();
        util.ReferenceCounter = ReferenceCounter;
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
//# sourceMappingURL=ReferenceCounter.js.map
