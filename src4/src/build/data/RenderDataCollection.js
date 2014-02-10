/// <reference path="../idl/IRenderDataCollection.ts" />
/// <reference path="../idl/IHardwareBuffer.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="RenderData.ts" />
    /// <reference path="VertexDeclaration.ts" />
    (function (data) {
        var RenderDataCollection = (function (_super) {
            __extends(RenderDataCollection, _super);
            function RenderDataCollection(pEngine, eOptions) {
                if (typeof eOptions === "undefined") { eOptions = 0; }
                _super.call(this);
                this._pDataBuffer = null;
                this._pEngine = null;
                this._eDataOptions = 0;
                this._pDataArray = [];
                this._pEngine = pEngine;
                this.setup(eOptions);
            }
            RenderDataCollection.prototype.getBuffer = function () {
                return this._pDataBuffer;
            };

            RenderDataCollection.prototype.getLength = function () {
                return this._pDataArray.length;
            };

            RenderDataCollection.prototype.getByteLength = function () {
                return this._pDataBuffer.getByteLength();
            };

            RenderDataCollection.prototype.clone = function (pSrc) {
                akra.logger.critical("TODO: RenderDataCollection::clone();");

                return false;
            };

            RenderDataCollection.prototype.getEngine = function () {
                return this._pEngine;
            };

            RenderDataCollection.prototype.getOptions = function () {
                return this._eDataOptions;
            };

            RenderDataCollection.prototype.getData = function (a) {
                var pBuffer = this._pDataBuffer;
                var pData;
                var n;

                if (!akra.isNull(pBuffer)) {
                    n = this._pDataBuffer.getLength();

                    if (akra.isString(arguments[0])) {
                        for (var i = 0; i < n; i++) {
                            pData = pBuffer.getVertexData(i);
                            if (pData.hasSemantics(arguments[0])) {
                                return pData;
                            }
                        }
                    } else {
                        for (var i = 0; i < n; i++) {
                            pData = pBuffer.getVertexData(i);
                            if (pData.getByteOffset() === arguments[0]) {
                                return pData;
                            }
                        }
                    }
                }

                return null;
            };

            RenderDataCollection.prototype._allocateData = function (pDecl, pData) {
                if (!this._pDataBuffer) {
                    this.createDataBuffer();
                }

                var pVertexDecl = akra.data.VertexDeclaration.normalize(pDecl);
                var pVertexData;

                if ((arguments.length < 2) || akra.isNumber(arguments[1]) || akra.isNull(arguments[1])) {
                    pVertexData = this._pDataBuffer.getEmptyVertexData(pData || 1, pVertexDecl);
                } else {
                    pVertexData = this._pDataBuffer.allocateData(pVertexDecl, pData);
                }

                akra.debug.assert(pVertexData !== null, "cannot allocate data:\n" + pVertexDecl.toString());

                return pVertexData;
            };

            RenderDataCollection.prototype.allocateData = function (pDecl, pData, isCommon) {
                if (typeof isCommon === "undefined") { isCommon = true; }
                var pVertexData;
                var pDataDecl = akra.data.VertexDeclaration.normalize(pDecl);

                if (akra.config.DEBUG) {
                    for (var i = 0; i < pDataDecl.getLength(); i++) {
                        if (this.getData(pDataDecl.element(i).usage) !== null && pDataDecl.element(i).count !== 0) {
                            akra.logger.warn("data buffer already contains data with similar vertex decloration <" + pDataDecl.element(i).usage + ">.");
                        }
                    }
                }

                pVertexData = this._allocateData(pDataDecl, pData);

                if (isCommon) {
                    for (var i = 0; i < this._pDataArray.length; ++i) {
                        this._pDataArray[i]._addData(pVertexData);
                    }
                }

                return pVertexData.getByteOffset();
            };

            RenderDataCollection.prototype.getDataLocation = function (sSemantics) {
                if (this._pDataBuffer) {
                    var pData;

                    for (var i = 0, n = this._pDataBuffer.getLength(); i < n; i++) {
                        pData = this._pDataBuffer.getVertexData(i);
                        if (pData.hasSemantics(sSemantics)) {
                            return pData.getByteOffset();
                        }
                    }
                }

                return -1;
            };

            RenderDataCollection.prototype.createDataBuffer = function () {
                //TODO: add support for eOptions
                var iVbOption = 0;
                var eOptions = this._eDataOptions;

                if (eOptions & akra.ERenderDataBufferOptions.VB_READABLE) {
                    iVbOption = akra.ERenderDataBufferOptions.VB_READABLE;
                }

                //trace('creating new video buffer for render data buffer ...');
                this._pDataBuffer = this._pEngine.getResourceManager().createVideoBuffer("render_data_buffer" + "_" + akra.guid());
                this._pDataBuffer.create(0, iVbOption);
                this._pDataBuffer.addRef();
                return this._pDataBuffer !== null;
            };

            RenderDataCollection.prototype.getRenderData = function (iSubset) {
                return this._pDataArray[iSubset];
            };

            RenderDataCollection.prototype.getEmptyRenderData = function (ePrimType, eOptions) {
                if (typeof eOptions === "undefined") { eOptions = 0; }
                var iSubsetId = this._pDataArray.length;
                var pDataset = new akra.data.RenderData(this);

                eOptions |= this._eDataOptions;

                if (!pDataset._setup(this, iSubsetId, ePrimType, eOptions)) {
                    akra.debug.error("cannot setup submesh...");
                }

                this._pDataArray.push(pDataset);

                return pDataset;
            };

            RenderDataCollection.prototype._draw = function (iSubset) {
                // if (arguments.length > 0) {
                //     this._pDataArray[iSubset]._draw();
                // }
                // for (var i: int = 0; i < this._pDataArray.length; i++) {
                //     this._pDataArray[i]._draw();
                // }
                akra.logger.critical("TODO");
            };

            RenderDataCollection.prototype.destroy = function () {
                this._pDataArray = null;

                if (this._pDataBuffer) {
                    // this._pDataBuffer.release();
                    this._pDataBuffer.destroy();
                    this._pDataBuffer = null;
                }

                this._pEngine = null;
                this._eDataOptions = 0;
            };

            RenderDataCollection.prototype.setup = function (eOptions) {
                if (typeof eOptions === "undefined") { eOptions = 0; }
                this._eDataOptions = eOptions;
            };
            return RenderDataCollection;
        })(akra.util.ReferenceCounter);
        data.RenderDataCollection = RenderDataCollection;

        function createRenderDataCollection(pEngine, eOptions) {
            if (typeof eOptions === "undefined") { eOptions = 0; }
            return new RenderDataCollection(pEngine, eOptions);
        }
        data.createRenderDataCollection = createRenderDataCollection;
    })(akra.data || (akra.data = {}));
    var data = akra.data;
})(akra || (akra = {}));
//# sourceMappingURL=RenderDataCollection.js.map
