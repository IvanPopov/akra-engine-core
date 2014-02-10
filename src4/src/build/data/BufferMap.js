/// <reference path="../idl/IBufferMap.ts" />
/// <reference path="../idl/IVertexBuffer.ts" />
/// <reference path="../idl/IEngine.ts" />
/// <reference path="../idl/IVertexDeclaration.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../util/ReferenceCounter.ts" />
    /// <reference path="IndexData.ts" />
    /// <reference path="Usage.ts" />
    /// <reference path="../pool/resources/VertexBuffer.ts" />
    /// <reference path="../events.ts" />
    /// <reference path="../debug.ts" />
    /// <reference path="../guid.ts" />
    /// <reference path="../config/config.ts" />
    //#ifdef WEBGL
    //	#include "webgl/webgl.ts"
    //	#include "webgl/WebGLRenderer.ts"
    //#endif
    (function (data) {
        var DeclUsages = akra.data.Usages;

        var BufferMap = (function (_super) {
            __extends(BufferMap, _super);
            function BufferMap(pEngine) {
                var _this = this;
                _super.call(this);
                this.guid = akra.guid();
                this._pFlows = null;
                this._pMappers = null;
                this._pIndex = null;
                this._nLength = 0;
                this._pCompleteFlows = null;
                this._nCompleteFlows = 0;
                this._nCompleteVideoBuffers = 0;
                this._pCompleteVideoBuffers = null;
                this._nUsedFlows = 0;
                this._pEngine = null;
                this._nStartIndex = 0;
                this._pBuffersCompatibleMap = null;
                this._pSemanticsMap = null;
                this._nUpdates = 0;
                this.setupSignals();

                this._pEngine = pEngine;
                this.reset();

                this.modified.connect(function () {
                    _this._nUpdates++;
                });
            }
            BufferMap.prototype.setupSignals = function () {
                this.modified = this.modified || new akra.Signal(this);
            };

            BufferMap.prototype.getPrimType = function () {
                return this._pIndex ? this._pIndex.getPrimitiveType() : this._ePrimitiveType;
            };

            BufferMap.prototype.setPrimType = function (eType) {
                this._ePrimitiveType = eType;
                this.modified.emit();
            };

            BufferMap.prototype.getIndex = function () {
                return this._pIndex;
            };

            BufferMap.prototype.setIndex = function (pIndexData) {
                if (this._pIndex === pIndexData) {
                    return;
                }

                this._pIndex = pIndexData;
                this.update();
            };

            BufferMap.prototype.getLength = function () {
                return (this._pIndex ? this._pIndex.getLength() : this._nLength);
            };

            BufferMap.prototype.setLength = function (nLength) {
                this._nLength = Math.min(this._nLength, nLength);
                this.modified.emit();
            };

            BufferMap.prototype._setLengthForce = function (nLength) {
                this._nLength = nLength;
                this.modified.emit();
            };

            BufferMap.prototype.getTotalUpdates = function () {
                return this._nUpdates;
            };

            BufferMap.prototype.getPrimCount = function () {
                return akra.data.IndexData.getPrimitiveCount(this.getPrimType(), this.getLength());
            };

            BufferMap.prototype.getLimit = function () {
                return this._pFlows.length;
            };

            BufferMap.prototype.getStartIndex = function () {
                return this._nStartIndex;
            };

            BufferMap.prototype.getSize = function () {
                return this._nCompleteFlows;
            };

            BufferMap.prototype.getFlows = function () {
                return this._pCompleteFlows;
            };

            BufferMap.prototype.getMappers = function () {
                return this._pMappers;
            };

            BufferMap.prototype.getOffset = function () {
                return (this._pIndex ? this._pIndex.getByteOffset() : 0);
            };

            BufferMap.prototype._draw = function () {
                // this._pEngine.getComposer().applyBufferMap(this);
                // this._pEngine.getRenderer().getActiveProgram().applyBufferMap(this);
                akra.isNull(this._pIndex) ? this.drawArrays() : this.drawElements();
            };

            BufferMap.prototype.drawArrays = function () {
                if (akra.config.WEBGL) {
                    this._pEngine.getRenderer().getWebGLContext().drawArrays(akra.webgl.getWebGLPrimitiveType(this._ePrimitiveType), this._nStartIndex, this._nLength);
                } else {
                    akra.logger.critical("BufferMap::drawElements() unsupported for unknown API.");
                }
            };

            BufferMap.prototype.drawElements = function () {
                if (akra.config.WEBGL) {
                    this._pEngine.getRenderer().getWebGLContext().drawElements(akra.webgl.getWebGLPrimitiveType(this._ePrimitiveType), this._pIndex.getPrimitiveCount(), akra.webgl.getWebGLPrimitiveType(this._pIndex.getPrimitiveType()), this._pIndex.getByteOffset() / 4);
                    //FIXME: offset of drawElement() in Glintptr = long long = 32 byte???
                } else {
                    akra.logger.critical("BufferMap::drawElements() unsupported for unknown API.");
                }
            };

            BufferMap.prototype.getFlow = function (iFlow, bComplete) {
                if (typeof bComplete === "undefined") { bComplete = true; }
                if (akra.isString(arguments[0])) {
                    var nTotal;
                    var pFlows;

                    if (bComplete) {
                        pFlows = this._pCompleteFlows;
                        nTotal = this._nCompleteFlows;
                    } else {
                        pFlows = this._pFlows;
                        nTotal = this._pFlows.length;
                    }

                    for (var i = 0; i < nTotal; ++i) {
                        if (!pFlows[i].data) {
                            continue;
                        }
                        if (pFlows[i].data.hasSemantics(arguments[0])) {
                            return pFlows[i];
                        }
                    }

                    return null;
                }

                if (bComplete) {
                    for (var i = 0, pFlows = this._pCompleteFlows; i < this._nCompleteFlows; ++i) {
                        if (pFlows[i].flow == iFlow) {
                            return pFlows[i];
                        }
                    }

                    return null;
                }

                return this._pFlows[iFlow];
            };

            //TODO: It is temp method for test deoptimozation of code
            BufferMap.prototype.getFlowBySemantic = function (sSemantics) {
                for (var i = 0; i < this._nCompleteFlows; ++i) {
                    if (this._pCompleteFlows[i].data.hasSemantics(sSemantics)) {
                        return this._pCompleteFlows[i];
                    }
                }

                return null;
            };

            BufferMap.prototype.reset = function (nFlowLimit) {
                if (typeof nFlowLimit === "undefined") { nFlowLimit = 16; }
                this._pIndex = null;
                this._ePrimitiveType = 4 /* TRIANGLELIST */;

                //#ifdef WEBGL
                //			nFlowLimit = Math.min(16/*webgl.maxVertexTextureImageUnits*/, webgl.maxVertexAttributes);
                //#endif
                this._pMappers = [];
                this._pFlows = new Array(nFlowLimit);
                for (var i = 0; i < nFlowLimit; i++) {
                    this._pFlows[i] = {
                        flow: i,
                        data: null,
                        type: 0 /* UNMAPPABLE */,
                        mapper: null
                    };
                }

                this._nLength = akra.MAX_INT32;
                this._pCompleteFlows = new Array(nFlowLimit);
                this._nCompleteFlows = 0;
                this._nStartIndex = akra.MAX_INT32;
                this._pBuffersCompatibleMap = {};

                this._pCompleteVideoBuffers = new Array(nFlowLimit);
                this._nCompleteVideoBuffers = 0;
                this._nUsedFlows = 0;

                this._pSemanticsMap = {};
                this._nUpdates = 0;

                this.modified.emit();
            };

            BufferMap.prototype.flow = function (iFlow, pData) {
                var pFlow = null;
                var pVertexData = null;
                var isOk;

                if (arguments.length < 2) {
                    pVertexData = arguments[0];
                    iFlow = (this._nUsedFlows++);
                } else {
                    iFlow = arguments[0];
                    pVertexData = arguments[1];
                }

                pFlow = this._pFlows[iFlow];

                akra.debug.assert(iFlow < this.getLimit(), 'Invalid strem. Maximum allowable number of stream ' + this.getLimit() + '.');

                if (!pVertexData || pFlow.data === pVertexData) {
                    akra.debug.warn("BufferMap::flow(", iFlow, pVertexData, ") failed.", akra.isNull(pVertexData) ? "vertex data is null" : "flow.data alreay has same vertex data");
                    return -1;
                }

                if (akra.pool.resources.VertexBuffer.isVBO(pVertexData.getBuffer())) {
                    pFlow.type = 0 /* UNMAPPABLE */;
                    this.setLength(pVertexData.getLength());

                    //this.startIndex = pVertexData.getStartIndex();
                    isOk = this.checkData(pVertexData);
                    akra.debug.assert(isOk, "You can use several unmappable data flows from one buffer.");

                    this.trackData(pVertexData);
                } else {
                    pFlow.type = 1 /* MAPPABLE */;
                }

                if (akra.isDefAndNotNull(pFlow.data)) {
                    this.untrackData(pVertexData);
                }

                pFlow.data = pVertexData;

                return this.update() ? iFlow : -1;
            };

            BufferMap.prototype.clearLinks = function () {
                for (var sSemantics in this._pSemanticsMap) {
                    this._pSemanticsMap[sSemantics] = null;
                }
            };

            BufferMap.prototype.linkFlow = function (pFlow) {
                var pDecl = pFlow.data.getVertexDeclaration();

                for (var i = 0; i < pDecl.getLength(); ++i) {
                    var pElement = pDecl.element(i);
                    var sSemantics = pElement.semantics;

                    if (pElement.isEnd()) {
                        continue;
                    }

                    var isSemanticsExists = akra.isDefAndNotNull(this._pSemanticsMap[sSemantics]);

                    akra.debug.assert(!isSemanticsExists, "overwrited semantics: " + sSemantics);

                    if (!isSemanticsExists) {
                        this._pSemanticsMap[sSemantics] = pFlow;
                    }
                }

                if (pFlow.type === 1 /* MAPPABLE */) {
                    var sSemantics = pFlow.mapper.semantics;
                    var isSemanticsExists = akra.isDefAndNotNull(this._pSemanticsMap[sSemantics]);

                    akra.debug.assert(!isSemanticsExists, "overwrited semantics(MAPPER!): " + sSemantics);

                    if (!isSemanticsExists) {
                        this._pSemanticsMap[sSemantics] = pFlow;
                    }
                }
            };

            BufferMap.prototype.checkData = function (pData) {
                var pEtalon = this._pBuffersCompatibleMap[pData.getBufferHandle()];

                if (!pEtalon || pEtalon.getByteOffset() === pData.getByteOffset()) {
                    return true;
                }

                return false;
            };

            BufferMap.prototype.findMapping = function (pMap, eSemantics, iAddition) {
                var isOk = this.checkData(pMap);
                akra.debug.assert(isOk, 'You can use several different maps from one buffer.');

                for (var i = 0, pMappers = this._pMappers, pExistsMap; i < pMappers.length; i++) {
                    pExistsMap = pMappers[i].data;
                    if (pExistsMap === pMap) {
                        //если уже заданные маппинг менял свой стартовый индекс(например при расширении)
                        //то необходимо сменить стартовый индекс на новый
                        if (pMappers[i].semantics === eSemantics && pMappers[i].addition == iAddition) {
                            return pMappers[i];
                        }
                    } else {
                        akra.debug.assert(pExistsMap.getStartIndex() === pMap.getStartIndex(), 'You can not use maps with different indexing');
                    }
                }
                return null;
            };

            BufferMap.prototype.mapping = function (iFlow, pMap, eSemantics, iAddition) {
                if (typeof iAddition === "undefined") { iAddition = 0; }
                var pMapper = this.findMapping(pMap, eSemantics, iAddition);
                var pFlow = this._pFlows[iFlow];

                akra.debug.assert(akra.isDefAndNotNull(pFlow.data) && (pFlow.type === 1 /* MAPPABLE */), 'Cannot mapping empty/unmappable flow.');
                akra.debug.assert(akra.isDef(pMap), 'Passed empty mapper.');

                if (!eSemantics) {
                    eSemantics = pMap.getVertexDeclaration()[0].eUsage;
                } else if (pMap.hasSemantics(eSemantics) === false) {
                    akra.debug.error('Passed mapper does not have semantics: ' + eSemantics + '.');
                    return false;
                }

                if (pMapper) {
                    if (pFlow.mapper === pMapper) {
                        return pMapper.semantics === eSemantics && pMapper.addition === iAddition ? true : false;
                    }
                } else {
                    pMapper = {
                        data: pMap,
                        semantics: eSemantics,
                        addition: iAddition
                    };

                    this._pMappers.push(pMapper);
                    this.setLength(pMap.getLength());
                    this.trackData(pMap);
                }

                pFlow.mapper = pMapper;

                return this.update();
            };

            BufferMap.prototype.trackData = function (pData) {
                //only one vertex data may be used in one veetex buffer
                //случаи, когда выделяются 2 vertex data'ы в одной области памяти не рассматриваются
                this._pBuffersCompatibleMap[pData.getBufferHandle()] = pData;

                pData.declarationChanged.connect(this.modified);
            };

            BufferMap.prototype.untrackData = function (pData) {
                delete this._pBuffersCompatibleMap[pData.getBufferHandle()];

                pData.declarationChanged.disconnect(this.modified);
            };

            BufferMap.prototype.update = function () {
                var pFlows = this._pFlows;
                var pFlow;
                var pMapper;
                var isMappable = false;
                var pCompleteFlows = this._pCompleteFlows;
                var nCompleteFlows = 0;
                var pCompleteVideoBuffers = this._pCompleteVideoBuffers;
                var nCompleteVideoBuffers = 0;
                var nUsedFlows = 0;
                var pVideoBuffer;
                var isVideoBufferAdded = false;
                var nStartIndex = akra.MAX_INT32, nCurStartIndex;

                this.clearLinks();

                for (var i = 0; i < pFlows.length; i++) {
                    pFlow = pFlows[i];
                    pMapper = pFlow.mapper;
                    isMappable = (pFlow.type === 1 /* MAPPABLE */);

                    if (pFlow.data) {
                        nUsedFlows++;
                    }

                    if (pFlow.data === null || (isMappable && pMapper === null)) {
                        continue;
                    }

                    pCompleteFlows[nCompleteFlows++] = pFlow;
                    this.linkFlow(pFlow);

                    if (isMappable) {
                        nCurStartIndex = pMapper.data.getStartIndex();
                        pVideoBuffer = pFlow.data.getBuffer();
                        for (var j = 0; j < nCompleteVideoBuffers; j++) {
                            if (pCompleteVideoBuffers[j] === pVideoBuffer) {
                                isVideoBufferAdded = true;
                                break;
                            }
                        }
                        if (!isVideoBufferAdded) {
                            pCompleteVideoBuffers[nCompleteVideoBuffers++] = pVideoBuffer;
                        }
                    } else {
                        nCurStartIndex = pFlow.data.getStartIndex();
                    }

                    if (nStartIndex === akra.MAX_INT32) {
                        nStartIndex = nCurStartIndex;
                        continue;
                    }

                    akra.debug.assert(nStartIndex == nCurStartIndex, 'You can not use a maps or unmappable buffers having different starting index.');
                }

                this._nStartIndex = nStartIndex;
                this._nCompleteFlows = nCompleteFlows;
                this._nCompleteVideoBuffers = nCompleteVideoBuffers;
                this._nUsedFlows = nUsedFlows;

                this.modified.emit();

                return true;
            };

            BufferMap.prototype.findFlow = function (sSemantics) {
                return !akra.isDef(this._pSemanticsMap[sSemantics]) ? (this._pSemanticsMap[sSemantics] = null) : this._pSemanticsMap[sSemantics];
            };

            BufferMap.prototype.clone = function (bWithMapping) {
                if (typeof bWithMapping === "undefined") { bWithMapping = true; }
                var pMap = this._pEngine.createBufferMap();

                for (var i = 0, pFlows = this._pFlows; i < pFlows.length; ++i) {
                    if (pFlows[i].data === null) {
                        continue;
                    }

                    if (pMap.flow(pFlows[i].flow, pFlows[i].data) < 0) {
                        pMap = null;
                        akra.debug.log("BufferMap::clone() failed on", pFlows[i].flow, pFlows[i].data);
                        return null;
                    }

                    if (!bWithMapping) {
                        continue;
                    }

                    if (pFlows[i].mapper) {
                        pMap.mapping(pFlows[i].flow, pFlows[i].mapper.data, pFlows[i].mapper.semantics, pFlows[i].mapper.addition);
                    }
                }

                return pMap;
            };

            BufferMap.prototype.toString = function (bListAll) {
                if (typeof bListAll === "undefined") { bListAll = false; }
                if (akra.config.DEBUG) {
                    function _an(sValue, n, bBackward) {
                        sValue = String(sValue);
                        bBackward = bBackward || false;

                        if (sValue.length < n) {
                            for (var i = 0, l = sValue.length; i < n - l; ++i) {
                                if (!bBackward) {
                                    sValue += ' ';
                                } else {
                                    sValue = ' ' + sValue;
                                }
                            }
                        }

                        return sValue;
                    }

                    var s = '\n\n', t;
                    s += '      $1 Flows     : OFFSET / SIZE   |   BUFFER / OFFSET   :      Mapping  / Shift    : OFFSET |    Additional    \n';
                    s = s.replace("$1", bListAll ? "   Total" : "Complete");
                    t = '-------------------------:-----------------+---------------------:--------------------------:--------+------------------\n';

                    // = '#%1 [ %2 ]           :     %6 / %7     |       %3 / %4       :         %5       :        |                  \n';
                    // = '#%1 [ %2 ]           :     %6 / %7     |       %3 / %4       :         %5       :        |                  \n';
                    s += t;

                    var pFlows = bListAll ? this._pFlows : this._pCompleteFlows;
                    var nFlows = bListAll ? this._nUsedFlows : this._nCompleteFlows;
                    for (var i = 0; i < nFlows; ++i) {
                        var pFlow = pFlows[i];
                        var pMapper = pFlow.mapper;
                        var pVertexData = pFlow.data;
                        var pDecl = pVertexData.getVertexDeclaration();

                        //trace(pMapper); window['pMapper'] = pMapper;
                        s += '#' + _an(pFlow.flow, 2) + ' ' + _an('[ ' + (pDecl.element(0).usage !== DeclUsages.END ? pDecl.element(0).usage : '<end>') + ' ]', 20) + ' : ' + _an(pDecl.element(0).offset, 6, true) + ' / ' + _an(pDecl.element(0).size, 6) + ' | ' + _an(pVertexData.getBufferHandle(), 8, true) + ' / ' + _an(pVertexData.getByteOffset(), 8) + ' : ' + (pMapper ? _an(pMapper.semantics, 15, true) + ' / ' + _an(pMapper.addition, 7) + ': ' + _an(pMapper.data.getVertexDeclaration().findElement(pMapper.semantics).offset, 6) : _an('-----', 25) + ': ' + _an('-----', 6)) + ' |                  \n';

                        for (var j = 1; j < pDecl.getLength(); ++j) {
                            s += '    ' + _an('[ ' + (pDecl.element(j).usage !== DeclUsages.END ? pDecl.element(j).usage : '<end>') + ' ]', 20) + ' : ' + _an(pDecl.element(j).offset, 6, true) + ' / ' + _an(pDecl.element(j).size, 6) + ' |                     :                          :        |                  \n';
                        }
                        s += t;
                    }
                    s += '=================================================================\n';
                    s += '      PRIMITIVE TYPE : ' + '0x' + Number(this.getPrimType()).toString(16) + '\n';
                    s += '     PRIMITIVE COUNT : ' + this.getPrimCount() + '\n';
                    s += '         START INDEX : ' + this.getStartIndex() + '\n';
                    s += '              LENGTH : ' + this.getLength() + '\n';
                    s += '  USING INDEX BUFFER : ' + (this.getIndex() ? 'TRUE' : 'FALSE') + '\n';
                    s += '=================================================================\n';

                    return s + '\n\n';
                }

                return null;
            };
            return BufferMap;
        })(akra.util.ReferenceCounter);
        data.BufferMap = BufferMap;

        function createBufferMap(pEngine) {
            return new BufferMap(pEngine);
        }
        data.createBufferMap = createBufferMap;
    })(akra.data || (akra.data = {}));
    var data = akra.data;
})(akra || (akra = {}));
//# sourceMappingURL=BufferMap.js.map
