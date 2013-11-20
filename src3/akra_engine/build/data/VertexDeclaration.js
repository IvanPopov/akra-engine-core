/// <reference path="../idl/AIVertexDeclaration.ts" />
define(["require", "exports", "data/VertexElement", "logger", "limit", "data/Usage"], function(require, exports, __VertexElement__, __logger__, __limit__, __Usage__) {
    var VertexElement = __VertexElement__;
    var logger = __logger__;
    var limit = __limit__;
    var Usage = __Usage__;

    var VertexDeclaration = (function () {
        function VertexDeclaration(pElements) {
            ///** readonly */ property for public usage
            this.stride = 0;
            this._pElements = [];
            if (arguments.length > 0 && isDefAndNotNull(pElements)) {
                this.append.apply(this, arguments);
            }
        }
        Object.defineProperty(VertexDeclaration.prototype, "length", {
            get: /** inline */ function () {
                return this._pElements.length;
            },
            enumerable: true,
            configurable: true
        });

        /** inline */ VertexDeclaration.prototype.element = function (i) {
            return this._pElements[i] || null;
        };

        VertexDeclaration.prototype.append = function (pData) {
            var pElements;

            if (!isArray(arguments[0])) {
                pElements = arguments;
            } else {
                pElements = arguments[0];
            }

            for (var i = 0; i < pElements.length; i++) {
                var pElement = pElements[i];
                var iOffset;

                if (VertexElement.hasUnknownOffset(pElement)) {
                    //add element to end
                    iOffset = this.stride;
                } else {
                    iOffset = pElement.offset;
                }

                var pVertexElement = new VertexElement(pElement.count, pElement.type, pElement.usage, iOffset);

                this._pElements.push(pVertexElement);

                var iStride = iOffset + pVertexElement.size;

                if (this.stride < iStride) {
                    this.stride = iStride;
                }
            }

            return this._update();
        };

        VertexDeclaration.prototype._update = function () {
            var iStride;

            for (var i = 0; i < this.length; ++i) {
                if (this._pElements[i].usage === Usage.END) {
                    this._pElements.swap(i, i + 1);
                }

                //recalc total stride
                iStride = this._pElements[i].size + this._pElements[i].offset;

                if (this.stride < iStride) {
                    this.stride = iStride;
                }
            }

            var pLast = this._pElements.last;

            if (pLast.usage === Usage.END && pLast.offset < this.stride) {
                pLast.offset = this.stride;
            }

            return true;
        };

        VertexDeclaration.prototype.extend = function (decl) {
            var pDecl = decl;
            var pElement;

            for (var i = 0; i < this.length; ++i) {
                for (var j = 0; j < pDecl.length; ++j) {
                    if (pDecl.element(j).usage == this._pElements[i].usage) {
                        logger.log('inconsistent declarations:', this, pDecl);

                        //'The attempt to combine the declaration containing the exact same semantics.'
                        return false;
                    }
                }
            }

            for (var i = 0; i < pDecl.length; i++) {
                pElement = pDecl.element(i).clone();
                pElement.offset += this.stride;
                this._pElements.push(pElement);
            }

            return this._update();
        };

        /** inline */ VertexDeclaration.prototype.hasSemantics = function (sSemantics) {
            return this.findElement(sSemantics) !== null;
        };

        VertexDeclaration.prototype.findElement = function (sSemantics, iCount) {
            if (typeof iCount === "undefined") { iCount = limit.MAX_INT32; }
            sSemantics = sSemantics.toUpperCase();

            for (var i = 0; i < this.length; ++i) {
                if (this._pElements[i].usage === sSemantics && (iCount === limit.MAX_INT32 || this._pElements[i].count == iCount)) {
                    return this._pElements[i];
                }
            }

            return null;
        };

        VertexDeclaration.prototype.clone = function () {
            var pElements = [];
            var pDecl;

            for (var i = 0; i < this.length; ++i) {
                pElements.push(this._pElements[i].clone());
            }

            pDecl = new VertexDeclaration(pElements);

            if (pDecl._update()) {
                return pDecl;
            }

            return null;
        };

        VertexDeclaration.prototype.toString = function () {
            if (has("DEBUG")) {
                var s = "\n";

                s += "  VERTEX DECLARATION ( " + this.stride + " b. ) \n";
                s += "---------------------------------------\n";

                for (var i = 0; i < this.length; ++i) {
                    s += this._pElements[i].toString() + '\n';
                }

                return s;
            }

            return null;
        };

        VertexDeclaration.normalize = function (pData) {
            if (!(pData instanceof VertexDeclaration)) {
                if (!Array.isArray(pData) && isDefAndNotNull(pData)) {
                    pData = [pData];
                }

                pData = new VertexDeclaration(pData);
            }

            return pData;
        };
        return VertexDeclaration;
    })();

    
    return VertexDeclaration;
});
//# sourceMappingURL=VertexDeclaration.js.map
