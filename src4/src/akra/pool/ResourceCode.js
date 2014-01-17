var akra;
(function (akra) {
    /// <reference path="../idl/IResourceCode.ts" />
    (function (pool) {
        var ResourceCode = (function () {
            function ResourceCode(iFamily, iType) {
                this._iValue = (akra.EResourceCodes.INVALID_CODE);
                switch (arguments.length) {
                    case 0:
                        this._iValue = akra.EResourceCodes.INVALID_CODE;
                        break;
                    case 1:
                        if (arguments[0] instanceof ResourceCode) {
                            this._iValue = arguments[0].iValue;
                        } else {
                            this._iValue = arguments[0];
                        }
                        break;
                    case 2:
                        this.family = arguments[0];
                        this.type = arguments[1];
                        break;
                }
            }
            Object.defineProperty(ResourceCode.prototype, "family", {
                get: function () {
                    return this._iValue >> 16;
                },
                set: function (iNewFamily) {
                    this._iValue &= 0x0000FFFF;
                    this._iValue |= iNewFamily << 16;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ResourceCode.prototype, "type", {
                get: function () {
                    return this._iValue & 0x0000FFFF;
                },
                set: function (iNewType) {
                    this._iValue &= 0xFFFF0000;
                    this._iValue |= iNewType & 0x0000FFFF;
                },
                enumerable: true,
                configurable: true
            });


            ResourceCode.prototype.setInvalid = function () {
                this._iValue = akra.EResourceCodes.INVALID_CODE;
            };

            ResourceCode.prototype.less = function (pSrc) {
                return this._iValue < pSrc.valueOf();
            };

            ResourceCode.prototype.eq = function (pSrc) {
                this._iValue = pSrc.valueOf();
                return this;
            };

            ResourceCode.prototype.valueOf = function () {
                return this._iValue;
            };

            ResourceCode.prototype.toNumber = function () {
                return this._iValue;
            };
            return ResourceCode;
        })();
        pool.ResourceCode = ResourceCode;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
