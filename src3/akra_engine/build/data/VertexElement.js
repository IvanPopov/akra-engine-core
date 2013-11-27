/// <reference path="../idl/AIVertexDeclaration.ts" />
/// <reference path="../idl/AIVertexElement.ts" />
/// <reference path="../idl/AEDataTypes.ts" />
define(["require", "exports", "limit", "dataType", "data/Usage"], function(require, exports, __limit__, __dt__, __Usage__) {
    var limit = __limit__;
    var dt = __dt__;
    var Usage = __Usage__;

    /** @const */
    var UNKNOWN_OFFSET = limit.MAX_INT32;

    var VertexElement = (function () {
        function VertexElement(nCount, eType, eUsage, //mark invalid offset, for determine true offset in VertexDeclaration::_update();
        iOffset) {
            if (typeof nCount === "undefined") { nCount = 1; }
            if (typeof eType === "undefined") { eType = 5126 /* FLOAT */; }
            if (typeof eUsage === "undefined") { eUsage = Usage.POSITION; }
            if (typeof iOffset === "undefined") { iOffset = UNKNOWN_OFFSET; }
            // this properties is /** readonly */ for public usage.
            this.size = 0;
            this.index = 0;
            this.semantics = Usage.UNKNOWN;
            this.count = nCount;
            this.type = eType;
            this.usage = eUsage;
            this.offset = iOffset;

            this.update();
        }
        VertexElement.prototype.update = function () {
            this.size = this.count * dt.size(this.type);
            this.index = 0;
            this.semantics = null;

            var pMatches = this.usage.match(/^(.*?\w)(\d+)$/i);

            if (!isNull(pMatches)) {
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

        VertexElement.hasUnknownOffset = /** inline */ function (pElement) {
            return (!isDef(pElement.offset) || (pElement.offset === UNKNOWN_OFFSET));
        };

        /** inline */ VertexElement.prototype.isEnd = function () {
            return this.semantics === Usage.END;
        };

        VertexElement.prototype.toString = function () {
            if (has("DEBUG")) {
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

                var s = "[ USAGE: " + _an(this.usage == Usage.END ? "<END>" : this.usage, 12) + ", OFFSET " + _an(this.offset, 4) + ", SIZE " + _an(this.size, 4) + " ]";

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
            return VertexElement.custom(Usage.END, 5121 /* UNSIGNED_BYTE */, 0, iOffset);
        };
        return VertexElement;
    })();

    
    return VertexElement;
});
//# sourceMappingURL=VertexElement.js.map
