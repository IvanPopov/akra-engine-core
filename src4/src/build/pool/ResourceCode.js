/// <reference path="../idl/IResourceCode.ts" />
var akra;
(function (akra) {
    (function (pool) {
        var ResourceCode = (function () {
            function ResourceCode(iFamily, iType) {
                this._iValue = (4294967295 /* INVALID_CODE */);
                switch (arguments.length) {
                    case 0:
                        this._iValue = 4294967295 /* INVALID_CODE */;
                        break;
                    case 1:
                        if (arguments[0] instanceof ResourceCode) {
                            this._iValue = arguments[0].iValue;
                        } else {
                            this._iValue = arguments[0];
                        }
                        break;
                    case 2:
                        this.setFamily(arguments[0]);
                        this.setType(arguments[1]);
                        break;
                }
            }
            ResourceCode.prototype.getFamily = function () {
                return this._iValue >> 16;
            };

            ResourceCode.prototype.setFamily = function (iNewFamily) {
                this._iValue &= 0x0000FFFF;
                this._iValue |= iNewFamily << 16;
            };

            ResourceCode.prototype.getType = function () {
                return this._iValue & 0x0000FFFF;
            };

            ResourceCode.prototype.setType = function (iNewType) {
                this._iValue &= 0xFFFF0000;
                this._iValue |= iNewType & 0x0000FFFF;
            };

            ResourceCode.prototype.setInvalid = function () {
                this._iValue = 4294967295 /* INVALID_CODE */;
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
//# sourceMappingURL=ResourceCode.js.map
