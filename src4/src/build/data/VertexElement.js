/// <reference path="../idl/IVertexDeclaration.ts" />
/// <reference path="../idl/IVertexElement.ts" />
/// <reference path="../idl/EDataTypes.ts" />
/// <reference path="../limit.ts" />
/// <reference path="../types.ts" />
/// <reference path="../config/config.ts" />
/// <reference path="Usage.ts" />
var akra;
(function (akra) {
    (function (data) {
        /** @const */
        var UNKNOWN_OFFSET = akra.MAX_INT32;

        var VertexElement = (function () {
            function VertexElement(nCount, eType, eUsage, //mark invalid offset, for determine true offset in VertexDeclaration::_update();
            iOffset) {
                if (typeof nCount === "undefined") { nCount = 1; }
                if (typeof eType === "undefined") { eType = 5126 /* FLOAT */; }
                if (typeof eUsage === "undefined") { eUsage = akra.data.Usages.POSITION; }
                if (typeof iOffset === "undefined") { iOffset = UNKNOWN_OFFSET; }
                // this properties is /** readonly */ for public usage.
                this.size = 0;
                this.index = 0;
                this.semantics = akra.data.Usages.UNKNOWN;
                this.count = nCount;
                this.type = eType;
                this.usage = eUsage;
                this.offset = iOffset;

                this.update();
            }
            VertexElement.prototype.update = function () {
                this.size = this.count * akra.sizeof(this.type);
                this.index = 0;
                this.semantics = null;

                var pMatches = this.usage.match(/^(.*?\w)(\d+)$/i);

                if (!akra.isNull(pMatches)) {
                    this.semantics = pMatches[1];
                    this.index = parseInt(pMatches[2]);
                    // To avoid the colosseum between the "usage" of the element as POSITION & POSITION0,
                    // given that this is the same thing, here are the elements with index 0
                    // for "usage" with the POSITION.
                    // if (this.index === 0) {
                    // 	this.usage = this.semantics;
                    // }
                } else {
                    this.semantics = this.usage;
                }
            };

            VertexElement.prototype.clone = function () {
                return new VertexElement(this.count, this.type, this.usage, this.offset);
            };

            /**  */ VertexElement.hasUnknownOffset = function (pElement) {
                return (!akra.isDef(pElement.offset) || (pElement.offset === UNKNOWN_OFFSET));
            };

            /**  */ VertexElement.prototype.isEnd = function () {
                return this.semantics === akra.data.Usages.END;
            };

            VertexElement.prototype.toString = function () {
                if (akra.config.DEBUG) {
                    function _an(data, n, bBackward) {
                        if (typeof bBackward === "undefined") { bBackward = false; }
                        var s = String(data);

                        for (var i = 0, t = n - s.length; i < t; ++i) {
                            if (bBackward) {
                                s = " " + s;
                            } else {
                                s += " ";
                            }
                        }
                        return s;
                    }

                    var s = "[ USAGE: " + _an(this.usage == akra.data.Usages.END ? "<END>" : this.usage, 12) + ", OFFSET " + _an(this.offset, 4) + ", SIZE " + _an(this.size, 4) + " ]";

                    return s;
                }
                return null;
            };

            VertexElement.custom = function (sUsage, eType, iCount, iOffset) {
                if (typeof eType === "undefined") { eType = 5126 /* FLOAT */; }
                if (typeof iCount === "undefined") { iCount = 1; }
                if (typeof iOffset === "undefined") { iOffset = UNKNOWN_OFFSET; }
                return {
                    count: iCount,
                    type: eType,
                    usage: sUsage,
                    offset: iOffset
                };
            };

            VertexElement.float = function (sUsage, iOffset) {
                if (typeof iOffset === "undefined") { iOffset = UNKNOWN_OFFSET; }
                return VertexElement.custom(sUsage, 5126 /* FLOAT */, 1, iOffset);
            };

            VertexElement.float2 = function (sUsage, iOffset) {
                if (typeof iOffset === "undefined") { iOffset = UNKNOWN_OFFSET; }
                return VertexElement.custom(sUsage, 5126 /* FLOAT */, 2, iOffset);
            };

            VertexElement.float3 = function (sUsage, iOffset) {
                if (typeof iOffset === "undefined") { iOffset = UNKNOWN_OFFSET; }
                return VertexElement.custom(sUsage, 5126 /* FLOAT */, 3, iOffset);
            };

            VertexElement.float4 = function (sUsage, iOffset) {
                if (typeof iOffset === "undefined") { iOffset = UNKNOWN_OFFSET; }
                return VertexElement.custom(sUsage, 5126 /* FLOAT */, 4, iOffset);
            };

            VertexElement.float4x4 = function (sUsage, iOffset) {
                if (typeof iOffset === "undefined") { iOffset = UNKNOWN_OFFSET; }
                return VertexElement.custom(sUsage, 5126 /* FLOAT */, 16, iOffset);
            };

            VertexElement.int = function (sUsage, iOffset) {
                if (typeof iOffset === "undefined") { iOffset = UNKNOWN_OFFSET; }
                return VertexElement.custom(sUsage, 5124 /* INT */, 1, iOffset);
            };

            VertexElement.end = function (iOffset) {
                if (typeof iOffset === "undefined") { iOffset = 0; }
                return VertexElement.custom(akra.data.Usages.END, 5121 /* UNSIGNED_BYTE */, 0, iOffset);
            };
            return VertexElement;
        })();
        data.VertexElement = VertexElement;
    })(akra.data || (akra.data = {}));
    var data = akra.data;
})(akra || (akra = {}));
//# sourceMappingURL=VertexElement.js.map
