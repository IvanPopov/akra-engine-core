/// <reference path="../idl/IVertexDeclaration.ts" />
/// <reference path="../limit.ts" />
/// <reference path="../types.ts" />
/// <reference path="Usage.ts" />
/// <reference path="VertexElement.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../config/config.ts" />
var akra;
(function (akra) {
    (function (data) {
        var VertexDeclaration = (function () {
            function VertexDeclaration(pElements) {
                ///** readonly */ property for public usage
                this.stride = 0;
                this._pElements = [];
                if (arguments.length > 0 && akra.isDefAndNotNull(pElements)) {
                    this.append.apply(this, arguments);
                }
            }
            VertexDeclaration.prototype.getLength = function () {
                return this._pElements.length;
            };

            VertexDeclaration.prototype.element = function (i) {
                return this._pElements[i] || null;
            };

            VertexDeclaration.prototype.append = function (pData) {
                var pElements;

                if (!akra.isArray(arguments[0])) {
                    pElements = arguments;
                } else {
                    pElements = arguments[0];
                }

                for (var i = 0; i < pElements.length; i++) {
                    var pElement = pElements[i];
                    var iOffset;

                    if (akra.data.VertexElement.hasUnknownOffset(pElement)) {
                        //add element to end
                        iOffset = this.stride;
                    } else {
                        iOffset = pElement.offset;
                    }

                    var pVertexElement = new akra.data.VertexElement(pElement.count, pElement.type, pElement.usage, iOffset);

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

                for (var i = 0; i < this.getLength(); ++i) {
                    //move "END" element to end of declaration
                    if (this._pElements[i].usage === akra.data.Usages.END) {
                        this._pElements.swap(i, i + 1);
                    }

                    //recalc total stride
                    iStride = this._pElements[i].size + this._pElements[i].offset;

                    if (this.stride < iStride) {
                        this.stride = iStride;
                    }
                }

                var pLast = this._pElements.last;

                if (pLast.usage === akra.data.Usages.END && pLast.offset < this.stride) {
                    pLast.offset = this.stride;
                }

                return true;
            };

            VertexDeclaration.prototype.extend = function (decl) {
                var pDecl = decl;
                var pElement;

                for (var i = 0; i < this.getLength(); ++i) {
                    for (var j = 0; j < pDecl.getLength(); ++j) {
                        if (pDecl.element(j).usage == this._pElements[i].usage) {
                            akra.logger.log('inconsistent declarations:', this, pDecl);

                            //'The attempt to combine the declaration containing the exact same semantics.'
                            return false;
                        }
                    }
                }

                for (var i = 0; i < pDecl.getLength(); i++) {
                    pElement = pDecl.element(i).clone();
                    pElement.offset += this.stride;
                    this._pElements.push(pElement);
                }

                return this._update();
            };

            VertexDeclaration.prototype.hasSemantics = function (sSemantics) {
                return this.findElement(sSemantics) !== null;
            };

            VertexDeclaration.prototype.findElement = function (sSemantics, iCount) {
                if (typeof iCount === "undefined") { iCount = akra.MAX_INT32; }
                sSemantics = sSemantics.toUpperCase();

                for (var i = 0; i < this.getLength(); ++i) {
                    if (this._pElements[i].usage === sSemantics && (iCount === akra.MAX_INT32 || this._pElements[i].count == iCount)) {
                        return this._pElements[i];
                    }
                }

                return null;
            };

            VertexDeclaration.prototype.clone = function () {
                var pElements = [];
                var pDecl;

                for (var i = 0; i < this.getLength(); ++i) {
                    pElements.push(this._pElements[i].clone());
                }

                pDecl = new VertexDeclaration(pElements);

                if (pDecl._update()) {
                    return pDecl;
                }

                return null;
            };

            VertexDeclaration.prototype.toString = function () {
                if (akra.config.DEBUG) {
                    var s = "\n";

                    s += "  VERTEX DECLARATION ( " + this.stride + " b. ) \n";
                    s += "---------------------------------------\n";

                    for (var i = 0; i < this.getLength(); ++i) {
                        s += this._pElements[i].toString() + '\n';
                    }

                    return s;
                }

                return null;
            };

            VertexDeclaration.normalize = function (pData) {
                if (!(pData instanceof VertexDeclaration)) {
                    if (!Array.isArray(pData) && akra.isDefAndNotNull(pData)) {
                        pData = [pData];
                    }

                    pData = new VertexDeclaration(pData);
                }

                return pData;
            };
            return VertexDeclaration;
        })();
        data.VertexDeclaration = VertexDeclaration;
    })(akra.data || (akra.data = {}));
    var data = akra.data;
})(akra || (akra = {}));
//# sourceMappingURL=VertexDeclaration.js.map
