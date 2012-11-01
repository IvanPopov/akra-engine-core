///<reference path="../../akra.ts" />
var akra;
(function (akra) {
    (function (core) {
        (function (pool) {
            var ResourceCode = (function () {
                function ResourceCode(iFamily, iType) {
                    this.iValue = (akra.EResourceCodes.INVALID_CODE);
                    switch(arguments.length) {
                        case 0: {
                            this.iValue = akra.EResourceCodes.INVALID_CODE;
                            break;

                        }
                        case 1: {
                            if(arguments[0] instanceof ResourceCode) {
                                this.iValue = arguments[0].iValue;
                            } else {
                                this.iValue = arguments[0];
                            }
                            break;

                        }
                        case 2: {
                            this.family = arguments[0];
                            this.type = arguments[1];
                            break;

                        }
                    }
                }
                Object.defineProperty(ResourceCode.prototype, "family", {
                    get: function () {
                        return this.iValue >> 16;
                    },
                    set: function (iNewFamily) {
                        this.iValue &= 65535;
                        this.iValue |= iNewFamily << 16;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ResourceCode.prototype, "type", {
                    get: function () {
                        return this.iValue & 65535;
                    },
                    set: function (iNewType) {
                        this.iValue &= 4294901760;
                        this.iValue |= iNewType & 65535;
                    },
                    enumerable: true,
                    configurable: true
                });
                ResourceCode.prototype.setInvalid = function () {
                    this.iValue = akra.EResourceCodes.INVALID_CODE;
                };
                ResourceCode.prototype.less = function (pSrc) {
                    return this.iValue < pSrc.valueOf();
                };
                ResourceCode.prototype.eq = function (pSrc) {
                    this.iValue = pSrc.valueOf();
                    return this;
                };
                ResourceCode.prototype.valueOf = function () {
                    return this.iValue;
                };
                ResourceCode.prototype.toNumber = function () {
                    return this.iValue;
                };
                return ResourceCode;
            })();
            pool.ResourceCode = ResourceCode;            
        })(core.pool || (core.pool = {}));
        var pool = core.pool;
    })(akra.core || (akra.core = {}));
    var core = akra.core;
})(akra || (akra = {}));
