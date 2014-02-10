/// <reference path="../idl/IRenderData.ts" />
/// <reference path="../idl/IVertexData.ts" />
/// <reference path="../idl/IVertexElement.ts" />
/// <reference path="../idl/IBufferMap.ts" />
/// <reference path="../idl/IBufferData.ts" />
/// <reference path="../idl/IRenderDataCollection.ts" />
/// <reference path="../idl/IMap.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../bf/bf.ts" />
    /// <reference path="VertexDeclaration.ts" />
    /// <reference path="../util/ReferenceCounter.ts" />
    /// <reference path="../debug.ts" />
    /// <reference path="../guid.ts" />
    /// <reference path="../config/config.ts" />
    (function (data) {
        var RenderData = (function (_super) {
            __extends(RenderData, _super);
            function RenderData(pCollection) {
                if (typeof pCollection === "undefined") { pCollection = null; }
                _super.call(this);
                /**
                * Options.
                */
                this._eOptions = 0;
                /**
                * Buffer, that create this class.
                */
                this._pBuffer = null;
                /**
                * ID of this data.
                */
                this._iId = -1;
                /**
                * Buffer with indices.
                * If the data is the simplest mesh, with no more
                * than one index, the type will be IndexBuffer,
                * otherwise VertexBuffer.
                */
                this._pIndexBuffer = null;
                /**
                * Buffer with attributes.
                */
                this._pAttribBuffer = null;
                /**
                * Data with indices.
                * If _pIndexBuffer has type IndexBuffer, indices data
                * has type IndexData, otherwise VertexData.
                */
                this._pIndexData = null;
                /**
                * Data with attributes.
                */
                this._pAttribData = null;
                /**
                * Buffer map for current index set.
                */
                this._pMap = null;
                /**
                * Buffer maps of all index sets.
                */
                this._pIndicesArray = [];
                /**
                * Current index set.
                */
                this._iIndexSet = 0;
                this._iRenderable = 1;
                this._pComposer = null;
                this._pBuffer = pCollection;
                this._pComposer = pCollection.getEngine().getComposer();
            }
            RenderData.prototype.getBuffer = function () {
                return this._pBuffer;
            };

            RenderData.prototype.getCurrentIndexSet = function () {
                return this._pIndicesArray[this._iIndexSet];
            };

            RenderData.prototype.allocateData = function (pDecl, pData, hasIndex) {
                if (typeof hasIndex === "undefined") { hasIndex = true; }
                var pDataDecl = akra.data.VertexDeclaration.normalize(pDecl);
                var eType = 1 /* INDEXED */;

                if (!hasIndex || this.useSingleIndex()) {
                    eType = 3 /* DIRECT */;
                } else if (this.useAdvancedIndex()) {
                    eType = 2 /* I2I */;
                }

                return this._allocateData(pDataDecl, pData, eType);
            };

            /**
            * Remove data from this render data.
            */
            RenderData.prototype.releaseData = function (iDataLocation) {
                //TODO: release data.
            };

            RenderData.prototype.allocateAttribute = function (pDecl, pData) {
                var pAttrDecl = akra.data.VertexDeclaration.normalize(pDecl);
                var pIndexData = this._pIndexData;
                var pAttribData = this._pAttribData;
                var pAttribBuffer = this._pAttribBuffer;
                var pBuffer = this._pBuffer;

                if (!pAttribData) {
                    if (!pAttribBuffer) {
                        pAttribBuffer = pBuffer.getEngine().getResourceManager().createVertexBuffer('render_data_attrs_' + akra.guid());
                        pAttribBuffer.create(pData.byteLength, 8 /* BACKUP_COPY */);
                        this._pAttribBuffer = pAttribBuffer;
                    }

                    this._pAttribData = this._pAttribBuffer.allocateData(pAttrDecl, pData);
                    this._pIndicesArray[this._iIndexSet].pAttribData = this._pAttribData;
                    this._pMap.flow(this._pAttribData);
                    return this._pAttribData !== null;
                }

                if (!pAttribData.extend(pAttrDecl, pData)) {
                    akra.logger.log('invalid data for allocation:', arguments);
                    akra.logger.warn('cannot allocate attribute in data subset..');
                    return false;
                }

                return true;
            };

            RenderData.prototype.allocateIndex = function (pDecl, pData) {
                var pAttrDecl = akra.data.VertexDeclaration.normalize(pDecl);

                if (this.useAdvancedIndex()) {
                    return this._allocateAdvancedIndex(pAttrDecl, pData);
                }
                return this._allocateIndex(pAttrDecl, pData);
            };

            RenderData.prototype.getAdvancedIndexData = function (sSemantics) {
                return this._getData(sSemantics, true);
            };

            /**
            * Add new set of indices.
            */
            RenderData.prototype.addIndexSet = function (usePreviousDataSet, ePrimType, sName) {
                if (typeof usePreviousDataSet === "undefined") { usePreviousDataSet = true; }
                if (typeof ePrimType === "undefined") { ePrimType = 4 /* TRIANGLELIST */; }
                if (typeof sName === "undefined") { sName = null; }
                // if (this._pIndexData === null) {
                //     return false;
                // }
                if (usePreviousDataSet) {
                    this._pMap = this._pMap.clone(false);

                    if (!this._pMap) {
                        akra.debug.warn("could not clone buffer map");
                        return -1;
                    }
                } else {
                    this._pMap = this._pBuffer.getEngine().createBufferMap();
                    this._pAttribData = null;
                }

                this._pMap.setPrimType(ePrimType);
                this._pIndexData = null;
                this._iIndexSet = this._pIndicesArray.length;
                this._pIndicesArray.push({
                    pMap: this._pMap,
                    pIndexData: this._pIndexData,
                    pAttribData: this._pAttribData,
                    sName: sName,
                    pI2IDataCache: null,
                    pAdditionCache: null
                });

                return this._iIndexSet;
            };

            RenderData.prototype.getNumIndexSet = function () {
                return this._pIndicesArray.length;
            };

            RenderData.prototype.getIndexSetName = function (iSet) {
                if (typeof iSet === "undefined") { iSet = this._iIndexSet; }
                return this._pIndicesArray[iSet].sName;
            };

            RenderData.prototype.selectIndexSet = function (a) {
                var iSet = -1;

                if (akra.isString(arguments[0])) {
                    iSet = this.findIndexSet(arguments[0]);

                    if (iSet < 0) {
                        return false;
                    }
                } else {
                    iSet = arguments[0];
                }

                var pIndexSet = this._pIndicesArray[iSet];

                if (pIndexSet) {
                    this._pMap = pIndexSet.pMap;
                    this._pIndexData = pIndexSet.pIndexData;
                    this._pAttribData = pIndexSet.pAttribData;
                    this._iIndexSet = iSet;
                    return true;
                }

                return false;
            };

            RenderData.prototype.findIndexSet = function (sName) {
                for (var i = 0; i < this._pIndicesArray.length; ++i) {
                    if (this._pIndicesArray[i].sName === sName) {
                        return i;
                    }
                }

                return -1;
            };

            /**
            * Get number of current index set.
            */
            RenderData.prototype.getIndexSet = function () {
                return this._iIndexSet;
            };

            RenderData.prototype.hasAttributes = function () {
                return !akra.isNull(this._pAttribData);
            };

            /**
            * Specifies uses advanced index.
            */
            RenderData.prototype.useAdvancedIndex = function () {
                return (this._eOptions & 65536 /* ADVANCED_INDEX */) != 0;
            };

            RenderData.prototype.useSingleIndex = function () {
                return (this._eOptions & 131072 /* SINGLE_INDEX */) != 0;
            };

            RenderData.prototype.useMultiIndex = function () {
                return (this._eOptions & 131072 /* SINGLE_INDEX */) == 0;
            };

            RenderData.prototype.setRenderable = function (iIndexSet, bValue) {
                if (typeof bValue === "undefined") { bValue = true; }
                if (arguments.length < 2) {
                    //mark all render data as renderable or not
                    if (arguments[0]) {
                        this._eOptions = akra.bf.setAll(this._eOptions, 262144 /* RENDERABLE */);
                    } else {
                        this._eOptions = akra.bf.clearAll(this._eOptions, 262144 /* RENDERABLE */);
                    }
                }

                //mark index set is renderable or not
                this._iRenderable = akra.bf.setBit(this._iRenderable, iIndexSet, bValue);
            };

            RenderData.prototype.isRenderable = function (iIndexSet) {
                if (arguments.length > 0) {
                    //is this index set renderable ?
                    return akra.bf.testBit(this._iRenderable, iIndexSet);
                }

                //is this data renderable ?
                return this._eOptions & 262144 /* RENDERABLE */ ? true : false;
            };

            /**
            * Check whether the semantics used in this data set.
            */
            RenderData.prototype.hasSemantics = function (sSemantics, bSearchComplete) {
                if (typeof bSearchComplete === "undefined") { bSearchComplete = true; }
                return this._getFlow(sSemantics, bSearchComplete) !== null;
            };

            RenderData.prototype.getDataLocation = function (sSemantics) {
                var pData = this._getData(sSemantics);

                return pData ? pData.getByteOffset() : -1;
            };

            /**
            * Get indices that uses in current index set.
            */
            RenderData.prototype.getIndices = function () {
                return this._pIndexData;
            };

            RenderData.prototype.getIndexFor = function (sSemantics) {
                var pFlow = this._getFlow(sSemantics);

                if (!akra.isNull(pFlow.mapper)) {
                    return pFlow.mapper.data.getTypedData(pFlow.mapper.semantics);
                }

                return null;
            };

            /**
            * Get number of primitives for rendering.
            */
            RenderData.prototype.getPrimitiveCount = function () {
                return this._pMap.getPrimCount();
            };

            RenderData.prototype.getPrimitiveType = function () {
                return this._pMap.getPrimType();
            };

            RenderData.prototype.index = function (data, sSemantics, useSame, iBeginWith, bForceUsage) {
                if (typeof useSame === "undefined") { useSame = false; }
                if (typeof iBeginWith === "undefined") { iBeginWith = 0; }
                if (typeof bForceUsage === "undefined") { bForceUsage = false; }
                var iData = akra.isNumber(arguments[0]) ? arguments[0] : 0;
                var iFlow = -1;
                var iAddition, iRealAddition, iPrevAddition;
                var pFlow;
                var pData, pRealData;
                var pFloat32Array;
                var iIndexOffset;
                var pIndexData = this._pIndexData;
                var sData;
                var iStride;
                var iTypeSize = 4 /* BYTES_PER_FLOAT */;

                if (this.useAdvancedIndex()) {
                    pRealData = this._getData(arguments[0]);
                    iAddition = pRealData.getByteOffset();
                    iStride = pRealData.getStride();

                    //индекс, который подал юзер
                    pData = this._getData(sSemantics, true);

                    pData.applyModifier(sSemantics, function (pTypedData) {
                        for (var i = 0; i < pTypedData.length; i++) {
                            pTypedData[i] = (pTypedData[i] * iStride + iAddition) / iTypeSize;
                        }
                    });

                    iData = pData.getByteOffset();
                    sSemantics = "INDEX_" + sSemantics;
                } else if (akra.isString(arguments[0])) {
                    if (arguments[0] === "TEXCOORD") {
                        iData = this.getDataLocation("TEXCOORD0");
                    } else {
                        iData = this.getDataLocation(arguments[0]);
                    }

                    akra.debug.assert(iData >= 0, "cannot find data with semantics: " + arguments[0]);
                }

                pFlow = this._getFlow(iData);

                if (pFlow === null) {
                    //поищем эти данные в общем буфере
                    pData = this.getBuffer().getData(iData);

                    if (akra.isNull(pData)) {
                        akra.debug.warn("Could not find data flow <" + iData + "> int buffer map: " + this._pMap.toString(true));
                        return false;
                    }

                    //все ок, данные найдены, зарегистрируем их у себя в мапе
                    akra.logger.assert(this._addData(pData) !== -1, "could not add automatcly add data to map");
                    pFlow = this._getFlow(iData);
                }

                iFlow = pFlow.flow;
                iIndexOffset = pIndexData.getVertexDeclaration().findElement(sSemantics).offset;
                pFloat32Array = pIndexData.getTypedData(sSemantics);
                iAddition = iData;

                if (!pFloat32Array) {
                    return false;
                }

                iStride = pFlow.data.getStride();

                if (this.getCurrentIndexSet().pAdditionCache[iIndexOffset] !== iAddition && !bForceUsage) {
                    if (!useSame) {
                        iPrevAddition = this.getCurrentIndexSet().pAdditionCache[iIndexOffset] || 0;
                        iRealAddition = iAddition - iPrevAddition;

                        for (var i = 0; i < pFloat32Array.length; i++) {
                            pFloat32Array[i] = (pFloat32Array[i] * iStride + iRealAddition) / iTypeSize;
                        }
                    } else {
                        iRealAddition = iAddition;
                        for (var i = 0; i < pFloat32Array.length; i++) {
                            pFloat32Array[i] = (iBeginWith + iRealAddition) / iTypeSize;
                        }
                    }

                    //remeber addition, that we added to index.
                    this.getCurrentIndexSet().pAdditionCache[iIndexOffset] = iAddition;

                    if (!pIndexData.setData(pFloat32Array, sSemantics)) {
                        return false;
                    }
                }

                return this._pMap.mapping(iFlow, pIndexData, sSemantics);
            };

            /*Setup.*/
            RenderData.prototype._setup = function (pCollection, iId, ePrimType, eOptions) {
                if (typeof ePrimType === "undefined") { ePrimType = 4 /* TRIANGLELIST */; }
                if (typeof eOptions === "undefined") { eOptions = 0; }
                if (this._pBuffer === null && arguments.length < 2) {
                    return false;
                }

                this.setRenderable(true);

                this._eOptions |= eOptions;
                this._pBuffer = pCollection;
                this._iId = iId;

                //setup buffer map
                this._pMap = pCollection.getEngine().createBufferMap();
                this._pMap.setPrimType(ePrimType);

                //setup default index set
                this._pIndicesArray.push({
                    sName: ".main",
                    pMap: this._pMap,
                    pIndexData: null,
                    pAttribData: null,
                    pI2IDataCache: {},
                    pAdditionCache: null
                });

                akra.debug.assert(this.useSingleIndex() === false, "single indexed data not implimented");

                return true;
            };

            RenderData.prototype._allocateData = function (pDataDecl, pData, eType) {
                if (eType === 3 /* DIRECT */) {
                    return this.allocateAttribute(pDataDecl, pData) ? 0 : -1;
                }

                var iFlow;
                var pVertexData = this._pBuffer._allocateData(pDataDecl, pData);
                var iOffset = pVertexData.getByteOffset();

                iFlow = this._addData(pVertexData, undefined, eType);

                if (iFlow < 0) {
                    akra.logger.log("invalid data", pDataDecl, pData);
                    akra.debug.error("cannot allocate data for submesh");
                    return -1;
                }

                return iOffset;
            };

            /**
            * Add vertex data to this render data.
            */
            RenderData.prototype._addData = function (pVertexData, iFlow, eType) {
                if (typeof eType === "undefined") { eType = 3 /* DIRECT */; }
                if ((arguments.length < 3 && this.useAdvancedIndex()) || arguments[2] === 2 /* I2I */) {
                    return this._registerData(pVertexData);
                }

                return (!akra.isDef(iFlow) ? this._pMap.flow(pVertexData) : this._pMap.flow(iFlow, pVertexData));
            };

            /**
            * Register data in this render.
            * Necessary for index to index mode, when data realy
            * not using in this render data for building final buffer map.
            */
            RenderData.prototype._registerData = function (pVertexData) {
                'use strict';
                var iOffset = pVertexData.getByteOffset();
                var pDataDecl = pVertexData.getVertexDeclaration();

                for (var i = 0; i < pDataDecl.getLength(); i++) {
                    this.getCurrentIndexSet().pI2IDataCache[pDataDecl.element(i).usage] = iOffset;
                }

                return 0;
            };

            RenderData.prototype._allocateAdvancedIndex = function (pAttrDecl, pData) {
                var pDecl = akra.data.VertexDeclaration.normalize(pAttrDecl);
                var nCount = pData.byteLength / pDecl.stride;

                //TODO: remove index dublicates
                var iIndLoc = this._allocateData(pAttrDecl, pData, 1 /* INDEXED */);
                var pI2IData = new Float32Array(nCount);
                var pI2IDecl = [];

                for (var i = 0; i < pDecl.getLength(); i++) {
                    pI2IDecl.push(akra.data.VertexElement.float('INDEX_' + pDecl.element(i).usage, 0));
                }

                for (var i = 0; i < pI2IData.length; i++) {
                    pI2IData[i] = i;
                }

                if (!this._allocateIndex(pI2IDecl, pI2IData)) {
                    this.releaseData(iIndLoc);
                    pI2IData = null;
                    pI2IDecl = null;
                    akra.logger.warn('cannot allocate index for index in render data subset');
                    return false;
                }

                return true;
            };

            RenderData.prototype._createIndex = function (pAttrDecl, pData) {
                'use strict';

                if (!this._pIndexBuffer) {
                    if (this.useMultiIndex()) {
                        this._pIndexBuffer = this._pBuffer.getEngine().getResourceManager().createVertexBuffer('subset_' + akra.guid());
                        this._pIndexBuffer.create((pData.byteLength), 8 /* BACKUP_COPY */);
                    } else {
                        //TODO: add support for sinle indexed mesh.
                    }
                }

                this._pIndexData = this._pIndexBuffer.allocateData(pAttrDecl, pData);
                this.getCurrentIndexSet().pIndexData = this._pIndexData;
                this.getCurrentIndexSet().pAdditionCache = {};
                return this._pIndexData !== null;
            };

            RenderData.prototype._allocateIndex = function (pDecl, pData) {
                'use strict';
                var pAttrDecl = akra.data.VertexDeclaration.normalize(pDecl);

                var pIndexData = this._pIndexData;
                var pIndexBuffer = this._pIndexBuffer;
                var pBuffer = this._pBuffer;

                if (akra.config.DEBUG) {
                    for (var i = 0; i < pAttrDecl.getLength(); i++) {
                        if (pAttrDecl.element(i).type !== 5126 /* FLOAT */) {
                            return false;
                        }
                    }
                }

                if (!this._pIndexData) {
                    return this._createIndex(pAttrDecl, pData);
                }

                if (!this._pIndexData.extend(pAttrDecl, pData)) {
                    akra.logger.log('invalid data for allocation:', arguments);
                    akra.logger.warn('cannot allocate index in data subset..');
                    return false;
                }

                return true;
            };

            RenderData.prototype._setIndexLength = function (iLength) {
                var bResult = this._pIndexData.resize(iLength);

                if (bResult) {
                    this._pMap._setLengthForce(iLength);
                }

                return bResult;
            };

            RenderData.prototype._getFlow = function (a, b) {
                if (typeof arguments[0] === 'string') {
                    return this._pMap.getFlow(arguments[0], arguments[1]);
                }

                for (var i = 0, n = this._pMap.getLimit(); i < n; ++i) {
                    var pFlow = this._pMap.getFlow(i, false);

                    if (pFlow.data && pFlow.data.getByteOffset() === arguments[0]) {
                        return pFlow;
                    }
                }

                return null;
            };

            RenderData.prototype._getData = function (a, b) {
                var pFlow;

                if (this.useAdvancedIndex() && arguments.length < 2) {
                    if (typeof arguments[0] === 'string') {
                        return this._getData(this.getCurrentIndexSet().pI2IDataCache[arguments[0]]);
                    }

                    return this._pBuffer.getData(arguments[0]);
                }

                if (typeof arguments[0] === 'string') {
                    for (var i = 0, n = this._pMap.getLimit(); i < n; ++i) {
                        pFlow = this._pMap.getFlow(i, false);
                        if (pFlow.data != null && pFlow.data.hasSemantics(arguments[0])) {
                            return pFlow.data;
                        }
                    }

                    return null;
                }

                pFlow = this._getFlow(arguments[0]);
                return pFlow === null ? null : pFlow.data;
            };

            /**
            * Draw this data.
            */
            RenderData.prototype._draw = function (pTechnique, pViewport, pRenderable, pSceneObject) {
                for (var i = 0; i < this._pIndicesArray.length; i++) {
                    if (this.isRenderable(i)) {
                        //this._pIndicesArray[i].pMap._draw();
                        this._pComposer.applyBufferMap(this._pIndicesArray[i].pMap);
                        pTechnique._renderTechnique(pViewport, pRenderable, pSceneObject);
                    }
                }
            };

            //applyMe(): boolean;
            RenderData.prototype.toString = function () {
                var s;
                s = "\nRENDER DATA SUBSET: #" + this._iId + "\n";
                s += "        ATTRIBUTES: " + (this._pAttribData ? "TRUE" : "FALSE") + "\n";
                s += "----------------------------------------------------------------\n";
                s += this._pMap.toString();

                return s;
            };
            return RenderData;
        })(akra.util.ReferenceCounter);
        data.RenderData = RenderData;
    })(akra.data || (akra.data = {}));
    var data = akra.data;
})(akra || (akra = {}));
//# sourceMappingURL=RenderData.js.map
