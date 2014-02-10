/// <reference path="../../idl/ICollada.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (pool) {
        /// <reference path="../../idl/IMesh.ts" />
        /// <reference path="../../idl/IRenderDataCollection.ts" />
        /// <reference path="../../animation/Track.ts" />
        /// <reference path="../../animation/Animation.ts" />
        /// <reference path="../../animation/Controller.ts" />
        /// <reference path="../../animation/Blend.ts" />
        /// <reference path="../../scene/Node.ts" />
        /// <reference path="../ResourcePoolItem.ts" />
        /// <reference path="../../math/math.ts" />
        /// <reference path="../../io/io.ts" />
        /// <reference path="../../conv/conv.ts" />
        /// <reference path="../../logger.ts" />
        /// <reference path="../../debug.ts" />
        /// <reference path="../pool.ts" />
        (function (resources) {
            var Mat4 = akra.math.Mat4;
            var Mat3 = akra.math.Mat3;

            var Vec3 = akra.math.Vec3;
            var Vec4 = akra.math.Vec4;

            var Color = akra.color.Color;
            var VE = akra.data.VertexElement;

            /* COMMON FUNCTIONS
            ------------------------------------------------------
            */
            //function getSupportedFormat(sSemantic: string): IColladaUnknownFormat[];
            //function calcFormatStride(pFormat: IColladaUnknownFormat[]): int;
            // additional
            //function printArray(pArr: any[], nRow: uint, nCol: uint): string;
            //function sortArrayByProperty(pData: any[], sProperty: string): any[];
            //xml
            //function stringData(pXML: Element): string;
            //function attr(pXML: Element, sName: string): string;
            //function firstChild(pXML: Element, sTag?: string): Element;
            // globals
            var pSupportedVertexFormat;
            var pSupportedTextureFormat;
            var pSupportedColorFormat;
            var pSupportedWeightFormat;
            var pSupportedJointFormat;
            var pSupportedInvBindMatrixFormat;
            var pSupportedInterpolationFormat;
            var pSupportedInputFormat;
            var pSupportedOutputFormat;
            var pSupportedTangentFormat;

            var pFormatStrideTable;

            var Collada = (function (_super) {
                __extends(Collada, _super);
                function Collada() {
                    _super.call(this);
                    //=======================================================================================
                    this._pModel = null;
                    this._pOptions = {};
                    this._pLinks = {};
                    this._pLib = {};
                    this._pCache = { meshMap: {}, sharedBuffer: null };
                    this._pAsset = null;
                    this._pVisualScene = null;
                    this._pAnimations = [];
                    this._sFilename = null;
                    this._pXMLRoot = null;
                    this._iByteLength = 0;
                }
                Collada.prototype.getModelFormat = function () {
                    return 4096 /* COLLADA */;
                };

                // polygon index convertion
                Collada.prototype.getOptions = function () {
                    return this._pOptions;
                };

                Collada.prototype.getByteLength = function () {
                    return this._iByteLength;
                };

                Collada.prototype.isShadowsEnabled = function () {
                    return this._pOptions.shadows;
                };

                Collada.prototype.trifanToTriangles = function (pXML, iStride) {
                    var pFans2Tri = [0, 0, 0];
                    var pData = [];
                    var tmp = new Array(iStride), n;
                    var pIndexes = [];

                    this.eachByTag(pXML, "p", function (pXMLData) {
                        n = akra.conv.stoia(stringData(pXMLData), pData);

                        for (var i = 0; i < 3; i++) {
                            akra.conv.retrieve(pData, tmp, iStride, i, 1);
                            for (var j = 0; j < iStride; ++j) {
                                pIndexes.push(tmp[j]);
                            }
                        }

                        for (var i = 3, m = n / iStride; i < m; i++) {
                            pFans2Tri[1] = i - 1;
                            pFans2Tri[2] = i;
                            for (var j = 0; j < pFans2Tri.length; ++j) {
                                for (var k = 0; k < iStride; ++k) {
                                    pIndexes.push(pData[pFans2Tri[j] * iStride + k]);
                                }
                            }
                        }
                    });

                    return pIndexes;
                };

                Collada.prototype.polygonToTriangles = function (pXML, iStride) {
                    //TODO для невыпуклых многоугольников с самоперечечениями работать будет не верно
                    return this.trifanToTriangles(pXML, iStride);
                };

                Collada.prototype.tristripToTriangles = function (pXML, iStride) {
                    var pStrip2Tri = [0, 0, 0];
                    var pData = [];
                    var tmp = new Array(iStride), n;
                    var pIndexes = [];

                    this.eachByTag(pXML, "p", function (pXMLData) {
                        n = akra.conv.stoia(stringData(pXMLData), pData);

                        for (var i = 0; i < 3; i++) {
                            akra.conv.retrieve(pData, tmp, iStride, i, 1);
                            for (var j = 0; j < iStride; ++j) {
                                pIndexes.push(tmp[j]);
                            }
                        }

                        for (var i = 3, m = n / iStride; i < m; i++) {
                            pStrip2Tri[0] = i - 1;
                            pStrip2Tri[1] = i - 2;
                            pStrip2Tri[2] = i;
                            for (var j = 0; j < pStrip2Tri.length; ++j) {
                                for (var k = 0; k < iStride; ++k) {
                                    pIndexes.push(pData[pStrip2Tri[j] * iStride + k]);
                                }
                            }
                        }
                    });

                    return pIndexes;
                };

                Collada.prototype.polylistToTriangles = function (pXML, iStride) {
                    var pXMLvcount = firstChild(pXML, "vcount");
                    var pXMLp = firstChild(pXML, "p");
                    var pVcount = new Array(parseInt(attr(pXML, "count")));
                    var pData, pIndexes;
                    var n, h = 0;
                    var tmp = new Array(128);
                    var buf = new Array(256);
                    var pPoly2Tri = [0, 0, 0];

                    akra.conv.stoia(stringData(pXMLvcount), pVcount);

                    var nElements = 0, nTotalElement = 0;

                    for (var i = 0; i < pVcount.length; i++) {
                        nElements += pVcount[i];
                        nTotalElement += (pVcount[i] - 2) * 3;
                    }

                    pIndexes = new Array(iStride * nTotalElement);
                    pData = new Array(iStride * nElements);

                    akra.conv.stoia(stringData(pXMLp), pData);

                    for (var i = 0, m = 0; i < pVcount.length; i++) {
                        n = akra.conv.retrieve(pData, tmp, iStride, m, pVcount[i]);

                        for (var j = 0; j < 3; j++) {
                            akra.conv.retrieve(tmp, buf, iStride, j, 1);
                            for (var k = 0; k < iStride; ++k) {
                                pIndexes[h++] = buf[k];
                            }
                        }

                        for (var x = 3, t = n / iStride; x < t; x++) {
                            pPoly2Tri[1] = x - 1;
                            pPoly2Tri[2] = x;
                            for (var j = 0; j < pPoly2Tri.length; ++j) {
                                for (var k = 0; k < iStride; ++k) {
                                    pIndexes[h++] = pData[(m + pPoly2Tri[j]) * iStride + k];
                                }
                            }
                        }

                        m += pVcount[i];
                    }

                    return pIndexes;
                };

                //xml
                Collada.prototype.eachNode = function (pXMLList, fnCallback, nMax) {
                    var n = pXMLList.length, i;
                    nMax = (akra.isNumber(nMax) ? (nMax < n ? nMax : n) : n);

                    n = 0;
                    i = 0;

                    while (n < pXMLList.length) {
                        //skip text nodes
                        if (pXMLList[n++].nodeType === Node.TEXT_NODE) {
                            continue;
                        }

                        var pXMLData = pXMLList[n - 1];
                        fnCallback.call(this, pXMLData, pXMLData.nodeName);

                        i++;

                        if (nMax === i) {
                            break;
                        }
                    }
                    //        for (var i = 0; i < nMax; i++) {
                    //            var pXMLData = pXMLList.item(i);
                    //            var sName = pXMLData.getNodeName();
                    //            fnCallback(pXMLData, sName);
                    //        }
                };

                Collada.prototype.eachChild = function (pXML, fnCallback) {
                    this.eachNode(pXML.childNodes, fnCallback);
                };

                Collada.prototype.eachByTag = function (pXML, sTag, fnCallback, nMax) {
                    this.eachNode(pXML.getElementsByTagName(sTag), fnCallback, nMax);
                };

                // akra additional functions
                Collada.prototype.findNode = function (pNodes, sNode, fnNodeCallback) {
                    if (typeof sNode === "undefined") { sNode = null; }
                    if (typeof fnNodeCallback === "undefined") { fnNodeCallback = null; }
                    var pNode = null;
                    var pRootJoint = null;

                    for (var i = pNodes.length - 1; i >= 0; i--) {
                        pNode = pNodes[i];

                        if (pNode === null) {
                            continue;
                        }

                        if (sNode && "#" + pNode.id === sNode) {
                            return pNode;
                        }

                        if (!akra.isNull(fnNodeCallback)) {
                            fnNodeCallback.call(this, pNode);
                        }

                        if (pNode.childNodes) {
                            pRootJoint = this.findNode(pNode.childNodes, sNode, fnNodeCallback);

                            if (!akra.isNull(pRootJoint)) {
                                return pRootJoint;
                            }
                        }
                    }

                    return null;
                };

                // helper functions
                Collada.prototype.COLLADATranslateMatrix = function (pXML) {
                    var pData = new Array(3);

                    akra.conv.stofa(stringData(pXML), pData);

                    return (Vec3.temp(pData)).toTranslationMatrix();
                };

                Collada.prototype.COLLADARotateMatrix = function (pXML) {
                    var pData = new Array(4);

                    akra.conv.stofa(stringData(pXML), pData);

                    return (new Mat4(1)).rotateLeft(pData[3] * akra.math.RADIAN_RATIO, Vec3.temp(pData[0], pData[1], pData[2]));
                };

                Collada.prototype.COLLADAScaleMatrix = function (pXML) {
                    var pData = new Array(3);

                    akra.conv.stofa(stringData(pXML), pData);

                    return new Mat4(pData[0], pData[1], pData[2], 1.0);
                };

                Collada.prototype.COLLADAData = function (pXML) {
                    var sName = pXML.nodeName;
                    var sData = stringData(pXML);

                    switch (sName) {
                        case "boolean":
                            return akra.conv.stoa(sData, 1, "boolean");

                        case "int":
                            return akra.conv.stoa(sData, 1, "int");

                        case "float":
                            return akra.conv.stoa(sData, 1, "float");

                        case "float2":
                            return akra.conv.stoa(sData, 2, "float");

                        case "float3":
                            return akra.conv.stoa(sData, 3, "float");

                        case "float4":
                        case "color":
                            return akra.conv.stoa(sData, 4, "float");

                        case "rotate":
                            return this.COLLADARotateMatrix(pXML);

                        case "translate":
                            return this.COLLADATranslateMatrix(pXML);

                        case "scale":
                            return this.COLLADAScaleMatrix(pXML);

                        case "bind_shape_matrix":
                        case "matrix":
                            return (new Mat4(akra.conv.stoa(sData, 16, "float"), true)).transpose();

                        case "float_array":
                            return akra.conv.stoa(sData, parseInt(attr(pXML, "count")), "float", true);

                        case "int_array":
                            return akra.conv.stoa(sData, parseInt(attr(pXML, "count")), "int", true);

                        case "bool_array":
                            return akra.conv.stoa(sData, parseInt(attr(pXML, "count")), "boolean", true);

                        case "Name_array":
                        case "name_array":
                        case "IDREF_array":
                            return akra.conv.stoa(sData, parseInt(attr(pXML, "count")), "string", true);

                        case "sampler2D":
                            return this.COLLADASampler2D(pXML);

                        case "surface":
                            return this.COLLADASurface(pXML);

                        default:
                            akra.debug.error("unsupported COLLADA data type <" + sName + " />");
                    }
                    //return null;
                };

                Collada.prototype.COLLADAGetSourceData = function (pSource, pFormat) {
                    akra.logger.assert(akra.isDefAndNotNull(pSource), "<source /> with expected format ", pFormat, " not founded");

                    var nStride = calcFormatStride(pFormat);
                    var pTech = pSource.techniqueCommon;

                    akra.logger.assert(akra.isDefAndNotNull(pTech), "<source /> with id <" + pSource.id + "> has no <technique_common />");

                    var pAccess = pTech.accessor;
                    var isFormatSupported;

                    akra.debug.assert((pAccess.stride <= nStride), pAccess.stride + " / " + nStride);

                    akra.logger.assert(pAccess.stride <= nStride, "<source /> width id" + pSource.id + " has unsupported stride: " + pAccess.stride);

                    var fnUnsupportedFormatError = function () {
                        akra.logger.log("expected format: ", pFormat);
                        akra.logger.log("given format: ", pAccess.params);
                        akra.logger.error("accessor of <" + pSource.id + "> has unsupported format");
                    };

                    for (var i = 0; i < pAccess.params.length; ++i) {
                        isFormatSupported = false;

                        for (var f = 0; f < pFormat[i].name.length; ++f) {
                            if ((pAccess.params[i].name || "").toLowerCase() == (pFormat[i].name[f] || "").toLowerCase()) {
                                isFormatSupported = true;
                            }
                        }

                        if (!isFormatSupported) {
                            fnUnsupportedFormatError();
                        }

                        isFormatSupported = false;

                        for (var f = 0; f < pFormat[i].type.length; ++f) {
                            if (pAccess.params[i].type.toLowerCase() == pFormat[i].type[f].toLowerCase()) {
                                isFormatSupported = true;
                            }
                        }

                        if (!isFormatSupported) {
                            fnUnsupportedFormatError();
                        }
                    }

                    return pAccess.data;
                };

                // common
                // -----------------------------------------------------------
                Collada.prototype.COLLADATransform = function (pXML, id) {
                    var pTransform = {
                        sid: attr(pXML, "sid"),
                        transform: String(pXML.nodeName),
                        value: null
                    };

                    if (akra.isString(id) && akra.isDefAndNotNull(pTransform.sid)) {
                        this.link(id + "/" + pTransform.sid, pTransform);
                    } else {
                        this.link(id + "/" + pTransform.transform, pTransform);
                    }

                    var v4f, m4f;
                    var pData;

                    switch (pTransform.transform) {
                        case "rotate":
                            pData = new Array(4);
                            akra.conv.stofa(stringData(pXML), pData);
                            v4f = new Vec4(pData);
                            v4f.w *= akra.math.RADIAN_RATIO; /* to radians. */
                            pTransform.value = v4f;

                            break;

                        case "translate":
                        case "scale":
                            pData = new Array(3);
                            akra.conv.stofa(stringData(pXML), pData);
                            pTransform.value = new Vec3(pData);
                            break;

                        case "matrix":
                            m4f = new Mat4;
                            akra.conv.stofa(stringData(pXML), m4f.data);
                            m4f.transpose();
                            pTransform.value = m4f;

                            break;

                        default:
                            akra.logger.error("unsupported transform detected: " + pTransform.transform);
                    }

                    return pTransform;
                };

                Collada.prototype.COLLADANewParam = function (pXML) {
                    var _this = this;
                    var pParam = {
                        sid: attr(pXML, "sid"),
                        annotate: null,
                        semantics: null,
                        modifier: null,
                        value: null,
                        type: null
                    };

                    this.eachChild(pXML, function (pXMLData, sName) {
                        switch (sName) {
                            case "semantic":
                                pParam.semantics = stringData(pXMLData);
                                break;

                            case "modifier":
                                pParam.modifier = stringData(pXMLData);

                            case "annotate":
                                pParam.annotate = {
                                    name: attr(pXMLData, "name"),
                                    value: stringData(pXMLData)
                                };

                            case "float":
                            case "float2":
                            case "float3":
                            case "float4":
                            case "surface":
                            case "sampler2D":
                                pParam.type = sName;
                                pParam.value = _this.COLLADAData(pXMLData);
                                break;

                            default:
                                pParam.value = _this.COLLADAData(pXMLData);
                        }
                    });

                    this.link(pParam.sid, pParam);

                    return pParam;
                };

                Collada.prototype.COLLADAAsset = function (pXML) {
                    if (typeof pXML === "undefined") { pXML = firstChild(this.getXMLRoot(), "asset"); }
                    var pAsset = {
                        unit: {
                            meter: 1.0,
                            name: "meter"
                        },
                        upAxis: "Y_UP",
                        title: null,
                        created: null,
                        modified: null,
                        contributor: {
                            author: null,
                            authoringTool: null,
                            comments: null,
                            copyright: null,
                            sourceData: null
                        }
                    };

                    this.eachChild(pXML, function (pXMLNode, sName) {
                        var sValue = stringData(pXMLNode);

                        switch (sName) {
                            case "up_axis":
                                pAsset.upAxis = sValue;
                                break;

                            case "created":
                                pAsset.created = sValue;
                                break;

                            case "modified":
                                pAsset.modified = sValue;
                                break;

                            case "title":
                                pAsset.title = sValue;
                                break;

                            case "contributor":
                                break;

                            case "unit":
                                pAsset.unit.meter = parseFloat(attr(pXMLNode, "meter"));
                                pAsset.unit.name = attr(pXMLNode, "name");
                                break;
                        }
                    });

                    return this._pAsset = pAsset;
                };

                Collada.prototype.COLLADALibrary = function (pXML, pTemplate) {
                    var _this = this;
                    if (!akra.isDefAndNotNull(pXML)) {
                        return null;
                    }

                    var pLib = {};
                    var pData;
                    var sTag = pTemplate.element;
                    var iAutoId = 0;

                    pLib[sTag] = {};

                    akra.debug.info("read library <" + sTag + "/>");

                    this.eachChild(pXML, function (pXMLData, sName) {
                        if (sTag !== sName) {
                            return;
                        }

                        pData = (_this[pTemplate.loader])(pXMLData);

                        if (akra.isNull(pData)) {
                            return;
                        }

                        pLib[sTag][attr(pXMLData, 'id') || (sTag + "_" + (iAutoId++))] = pData;
                    });

                    return pLib;
                };

                // geometry
                Collada.prototype.COLLADAAccessor = function (pXML) {
                    var pAccessor = {
                        data: this.source(attr(pXML, "source")),
                        count: parseInt(attr(pXML, "count")),
                        stride: parseInt(attr(pXML, "stride") || "1"),
                        params: []
                    };

                    this.eachChild(pXML, function (pXMLData, sName) {
                        pAccessor.params.push({
                            name: attr(pXMLData, "name"),
                            type: attr(pXMLData, "type")
                        });
                    });

                    return pAccessor;
                };

                //dangerous: the default offset is 0, but collada required this attribute
                Collada.prototype.COLLADAInput = function (pXML, iOffset) {
                    if (typeof iOffset === "undefined") { iOffset = 0; }
                    var pInput = {
                        semantics: attr(pXML, "semantic"),
                        source: this.source(attr(pXML, "source")),
                        offset: -1,
                        set: attr(pXML, "set")
                    };

                    //pInput.set = (pInput.set ? parseInt(pInput.set) : 0);
                    if (!akra.isNull(attr(pXML, "offset"))) {
                        pInput.offset = parseInt(attr(pXML, "offset"));
                    }

                    if (akra.isInt(iOffset) && pInput.offset === -1) {
                        pInput.offset = iOffset;
                    }

                    akra.debug.assert(akra.isInt(pInput.offset) && pInput.offset >= 0, "invalid offset detected");

                    return pInput;
                };

                Collada.prototype.COLLADATechniqueCommon = function (pXML) {
                    var _this = this;
                    var pTechniqueCommon = {
                        accessor: null,
                        perspective: null
                    };

                    this.eachChild(pXML, function (pXMLData, sName) {
                        switch (sName) {
                            case "accessor":
                                pTechniqueCommon.accessor = _this.COLLADAAccessor(pXMLData);
                                break;
                            case "perspective":
                                pTechniqueCommon.perspective = _this.COLLADAPerspective(pXMLData);
                                break;
                        }
                    });

                    return pTechniqueCommon;
                };

                Collada.prototype.COLLADASource = function (pXML) {
                    var _this = this;
                    var pSource = {
                        id: attr(pXML, "id"),
                        name: attr(pXML, "name"),
                        array: {},
                        techniqueCommon: null
                    };

                    this.link(pSource);

                    this.eachChild(pXML, function (pXMLData, sName) {
                        var pColladaArray;
                        var id;

                        switch (sName.toLowerCase()) {
                            case "int_array":
                            case "bool_array":
                            case "float_array":
                            case "idref_array":
                            case "name_array":
                                pColladaArray = _this.COLLADAData(pXMLData);

                                id = attr(pXMLData, "id");
                                pSource.array[id] = pColladaArray;

                                _this.link(id, pColladaArray);

                                break;
                            case "technique_common":
                                pSource.techniqueCommon = _this.COLLADATechniqueCommon(pXMLData);
                                break;
                        }
                    });

                    return pSource;
                };

                Collada.prototype.COLLADAVertices = function (pXML) {
                    var pVertices = {
                        id: attr(pXML, "id"),
                        inputs: {}
                    };

                    this.eachByTag(pXML, "input", function (pXMLData) {
                        var sSemantic = attr(pXMLData, "semantic");
                        pVertices.inputs[sSemantic] = this.COLLADAInput(pXMLData);
                    });

                    akra.debug.assert(akra.isDefAndNotNull(pVertices.inputs["POSITION"]), "semantics POSITION must be in the <vertices /> tag");

                    this.link(pVertices);

                    return pVertices;
                };

                Collada.prototype.COLLADAJoints = function (pXML) {
                    var _this = this;
                    var pJoints = {
                        inputs: {}
                    };

                    var pMatrixArray;
                    var iCount;
                    var pInvMatrixArray;

                    this.eachByTag(pXML, "input", function (pXMLData) {
                        switch (attr(pXMLData, "semantic")) {
                            case "JOINT":
                                pJoints.inputs["JOINT"] = _this.COLLADAInput(pXMLData);
                                break;

                            case "INV_BIND_MATRIX":
                                pJoints.inputs["INV_BIND_MATRIX"] = _this.COLLADAInput(pXMLData);

                                break;

                            default:
                                akra.logger.error("semantics are different from JOINT/INV_BIND_MATRIX is not supported in the <joints /> tag");
                        }
                    });

                    for (var sInput in pJoints.inputs) {
                        this.prepareInput(pJoints.inputs[sInput]);

                        if (sInput === "INV_BIND_MATRIX") {
                            pInvMatrixArray = new Float32Array(pJoints.inputs[sInput].array);
                            iCount = pInvMatrixArray.length / 16;
                            pMatrixArray = new Array(iCount);

                            for (var j = 0, n = 0; j < pInvMatrixArray.length; j += 16) {
                                pMatrixArray[n++] = (new Mat4(new Float32Array(pInvMatrixArray.buffer, j * Float32Array.BYTES_PER_ELEMENT, 16), true)).transpose();
                            }

                            pJoints.inputs[sInput].array = pMatrixArray;
                        }
                    }

                    return pJoints;
                };

                Collada.prototype.COLLADAPolygons = function (pXML, sType) {
                    var _this = this;
                    var pPolygons = {
                        inputs: [],
                        p: null,
                        material: attr(pXML, "material"),
                        name: null,
                        count: parseInt(attr(pXML, "count"))
                    };

                    var iOffset = 0, n = 0;
                    var iCount = parseInt(attr(pXML, "count"));
                    var iStride = 0;

                    this.eachByTag(pXML, "input", function (pXMLData) {
                        pPolygons.inputs.push(_this.COLLADAInput(pXMLData, iOffset));
                        iOffset++;
                    });

                    sortArrayByProperty(pPolygons.inputs, "iOffset");

                    for (var i = 0; i < pPolygons.inputs.length; ++i) {
                        iStride = akra.math.max(pPolygons.inputs[i].offset + 1, iStride);
                    }

                    akra.debug.assert(iStride > 0, "Invalid offset detected.");

                    switch (sType) {
                        case "polylist":
                            pPolygons.p = this.polylistToTriangles(pXML, iStride);
                            break;

                        case "polygons":
                            pPolygons.p = this.polygonToTriangles(pXML, iStride);

                            this.eachByTag(pXML, "ph", function (pXMLData) {
                                akra.debug.error("unsupported polygon[polygon] subtype founded: <ph>");
                            });

                            break;

                        case "triangles":
                            pPolygons.p = new Array(3 * iCount * iStride);

                            this.eachByTag(pXML, "p", function (pXMLData) {
                                n += akra.conv.stoia(stringData(pXMLData), pPolygons.p, n);
                            });

                            break;
                        case "trifans":
                            pPolygons.p = this.trifanToTriangles(pXML, iStride);
                            break;

                        case "tristrips":
                            pPolygons.p = this.tristripToTriangles(pXML, iStride);
                            break;

                        default:
                            akra.logger.error("unsupported polygon[" + sType + "] type founded");
                    }

                    if (!akra.isDef(pPolygons.type)) {
                        pPolygons.type = 4 /* TRIANGLELIST */;
                    }

                    return pPolygons;
                };

                Collada.prototype.COLLADAVertexWeights = function (pXML) {
                    var _this = this;
                    var pVertexWeights = {
                        count: parseInt(attr(pXML, "count")),
                        inputs: [],
                        weightInput: null,
                        vcount: null,
                        v: null
                    };

                    var iOffset = 0;
                    var pInput;

                    this.eachByTag(pXML, "input", function (pXMLData) {
                        pInput = _this.COLLADAInput(pXMLData, iOffset);

                        if (pInput.semantics === "WEIGHT") {
                            pVertexWeights.weightInput = pInput;
                        }

                        pVertexWeights.inputs.push(pInput);
                        iOffset++;
                    });

                    var pVcountData, pVData;

                    pVcountData = new Array(pVertexWeights.count);
                    akra.conv.stoia(stringData(firstChild(pXML, "vcount")), pVcountData);
                    pVertexWeights.vcount = pVcountData;

                    var n = 0;

                    for (var i = 0; i < pVcountData.length; ++i) {
                        n += pVcountData[i];
                    }

                    n *= pVertexWeights.inputs.length;

                    akra.logger.assert(pVertexWeights.inputs.length === 2, "more than 2 inputs in <vertex_weights/> not supported currently");

                    pVData = new Array(n);
                    akra.conv.stoia(stringData(firstChild(pXML, "v")), pVData);
                    pVertexWeights.v = pVData;

                    return pVertexWeights;
                };

                Collada.prototype.COLLADAMesh = function (pXML) {
                    var _this = this;
                    var pMesh = {
                        sources: [],
                        polygons: []
                    };

                    var id;
                    var pPolygons, pVertices, pPos;

                    this.eachChild(pXML, function (pXMLData, sName) {
                        switch (sName) {
                            case "source":
                                pMesh.sources.push(_this.COLLADASource(pXMLData));
                                break;

                            case "vertices":
                                pVertices = _this.COLLADAVertices(pXMLData);
                                break;

                            case "lines":
                            case "linestrips":
                            case "tristrips":
                            case "trifans":
                            case "triangles":
                            case "polygons":
                            case "polylist":
                                pPolygons = _this.COLLADAPolygons(pXMLData, sName);

                                for (var i = 0; i < pPolygons.inputs.length; ++i) {
                                    pPos = null;

                                    if (pPolygons.inputs[i].semantics == "VERTEX") {
                                        if (pPolygons.inputs[i].source.id == pVertices.id) {
                                            pPos = pVertices.inputs["POSITION"];

                                            pPolygons.inputs[i].source = pPos.source;
                                            pPolygons.inputs[i].semantics = pPos.semantics;
                                        } else {
                                            akra.logger.error("<input /> with semantic VERTEX must refer to <vertices /> tag in same mesh.");
                                        }
                                    }

                                    _this.prepareInput(pPolygons.inputs[i]);
                                }

                                pMesh.polygons.push(pPolygons);
                                break;
                        }
                    });

                    return pMesh;
                };

                Collada.prototype.COLLADAGeometrie = function (pXML) {
                    var pGeometrie = {
                        id: attr(pXML, "id"),
                        name: attr(pXML, "name"),
                        mesh: null,
                        convexMesh: null,
                        spline: null
                    };

                    var pXMLData = firstChild(pXML);
                    var sName = pXMLData.nodeName;

                    if (sName == "mesh") {
                        pGeometrie.mesh = this.COLLADAMesh(pXMLData);
                    }

                    this.link(pGeometrie);

                    return pGeometrie;
                };

                Collada.prototype.COLLADASkin = function (pXML) {
                    var _this = this;
                    var pSkin = {
                        shapeMatrix: this.COLLADAData(firstChild(pXML, "bind_shape_matrix")),
                        sources: [],
                        geometry: this.source(attr(pXML, "source")),
                        joints: null,
                        vertexWeights: null
                    };

                    var pVertexWeights, pInput;

                    this.eachChild(pXML, function (pXMLData, sName) {
                        switch (sName) {
                            case "source":
                                pSkin.sources.push(_this.COLLADASource(pXMLData));
                                break;

                            case "joints":
                                pSkin.joints = _this.COLLADAJoints(pXMLData);
                                break;

                            case "vertex_weights":
                                pVertexWeights = _this.COLLADAVertexWeights(pXMLData);

                                for (var i = 0; i < pVertexWeights.inputs.length; ++i) {
                                    pInput = _this.prepareInput(pVertexWeights.inputs[i]);
                                }

                                pSkin.vertexWeights = pVertexWeights;
                                break;
                        }
                    });

                    return pSkin;
                };

                Collada.prototype.COLLADAController = function (pXML) {
                    var pController = {
                        name: attr(pXML, "name"),
                        id: attr(pXML, "id"),
                        skin: null,
                        morph: null
                    };

                    var pXMLData = firstChild(pXML, "skin");

                    if (!akra.isNull(pXMLData)) {
                        pController.skin = this.COLLADASkin(pXMLData);
                    } else {
                        akra.debug.warn("Founded controller without skin element!");
                        return null;
                    }

                    this.link(pController);

                    return pController;
                };

                // images
                Collada.prototype.COLLADAImage = function (pXML) {
                    var pImage = {
                        id: attr(pXML, "id"),
                        name: attr(pXML, "name"),
                        format: attr(pXML, "format"),
                        height: parseInt(attr(pXML, "height") || "-1"),
                        width: parseInt(attr(pXML, "width") || "-1"),
                        depth: 1,
                        data: null,
                        path: null
                    };

                    var sFilename = this.getFilename();
                    var sPath = null;
                    var pXMLInitData = firstChild(pXML, "init_from"), pXMLData;

                    if (akra.isDefAndNotNull(pXMLInitData)) {
                        sPath = stringData(pXMLInitData);

                        //modify path to the textures relative to a given file
                        // if (!isNull(sFilename)) {
                        //     if (!path.info(sPath).isAbsolute()) {
                        //         sPath = path.info(sFilename).dirname + "/" + sPath;
                        //     }
                        // }
                        // console.log("collada deps image: ", path.normalize(sPath));
                        // pImage.path = path.normalize(sPath);
                        pImage.path = akra.uri.resolve(sPath, sFilename);
                        // console.log("collada deps image >>> ", pImage.path);
                    } else if (akra.isDefAndNotNull(pXMLData = firstChild(pXML, "data"))) {
                        akra.logger.error("image loading from <data /> tag unsupported yet.");
                    } else {
                        akra.logger.error("image with id: " + pImage.id + " has no data.");
                    }

                    this.link(pImage);

                    return pImage;
                };

                // effects
                Collada.prototype.COLLADASurface = function (pXML) {
                    var pSurface = {
                        initFrom: stringData(firstChild(pXML, "init_from"))
                    };

                    return pSurface;
                };

                Collada.prototype.COLLADATexture = function (pXML) {
                    if (!akra.isDefAndNotNull(pXML)) {
                        return null;
                    }

                    var pTexture = {
                        texcoord: attr(pXML, "texcoord"),
                        sampler: this.source(attr(pXML, "texture")),
                        surface: null,
                        image: null
                    };

                    if (!akra.isNull(pTexture.sampler) && akra.isDefAndNotNull(pTexture.sampler.value)) {
                        pTexture.surface = this.source(pTexture.sampler.value.source);
                    }

                    if (!akra.isNull(pTexture.surface)) {
                        var pImage = this.source(pTexture.surface.value.initFrom);
                        pTexture.image = pImage;

                        akra.debug.info("Load texture " + pImage.path + ".");

                        var pTex = this.getManager().getTexturePool().loadResource(pImage.path);

                        this.sync(pTex, 1 /* LOADED */);

                        //FIX THIS
                        pTex.setFilter(10240 /* MAG_FILTER */, 9729 /* LINEAR */);
                        pTex.setFilter(10241 /* MIN_FILTER */, 9987 /* LINEAR_MIPMAP_LINEAR */);

                        pTex.setWrapMode(10242 /* WRAP_S */, 10497 /* REPEAT */);
                        pTex.setWrapMode(10243 /* WRAP_T */, 10497 /* REPEAT */);
                    }

                    return pTexture;
                };

                Collada.prototype.COLLADASampler2D = function (pXML) {
                    var pSampler = {
                        source: stringData(firstChild(pXML, "source")),
                        wrapS: stringData(firstChild(pXML, "wrap_s")),
                        wrapT: stringData(firstChild(pXML, "wrap_t")),
                        minFilter: stringData(firstChild(pXML, "minfilter")),
                        mipFilter: stringData(firstChild(pXML, "mipfilter")),
                        magFilter: stringData(firstChild(pXML, "magfilter"))
                    };

                    return pSampler;
                };

                Collada.prototype.COLLADAPhong = function (pXML) {
                    var _this = this;
                    var pMat = {
                        diffuse: new Color(0.),
                        specular: new Color(0.),
                        ambient: new Color(0.),
                        emissive: new Color(0.),
                        shininess: 0.0,
                        reflective: new Color(0.),
                        reflectivity: 0.0,
                        transparent: new Color(0.),
                        transparency: 0.0,
                        indexOfRefraction: 0.0,
                        textures: {
                            diffuse: null,
                            specular: null,
                            ambient: null,
                            emissive: null,
                            normal: null
                        }
                    };

                    var pXMLData;
                    var pList = Collada.COLLADA_MATERIAL_NAMES;

                    for (var i = 0; i < pList.length; i++) {
                        var csComponent = pList[i];

                        pXMLData = firstChild(pXML, csComponent);

                        //emission --> emissive
                        //emission does not exists in akra engine materials
                        if (csComponent === "emission") {
                            csComponent = "emissive";
                        }

                        if (pXMLData) {
                            this.eachChild(pXMLData, function (pXMLData, sName) {
                                switch (sName) {
                                    case "float":
                                        pMat[csComponent] = _this.COLLADAData(pXMLData);
                                        break;

                                    case "color":
                                        pMat[csComponent].set(_this.COLLADAData(pXMLData));
                                        break;

                                    case "texture":
                                        pMat.textures[csComponent] = _this.COLLADATexture(pXMLData);
                                }
                            });
                        }
                    }

                    // correct shininess
                    pMat.shininess *= 10.0;

                    return pMat;
                };

                Collada.prototype.COLLADAEffectTechnique = function (pXML) {
                    var pTech = {
                        sid: attr(pXML, "sid"),
                        type: null,
                        value: null
                    };

                    var pValue = firstChild(pXML);

                    pTech.type = pValue.nodeName;

                    switch (pTech.type) {
                        case "blinn":
                        case "lambert":
                            akra.debug.warn("<blinn /> or <lambert /> material interprated as phong");
                        case "phong":
                            pTech.value = this.COLLADAPhong(pValue);
                            break;

                        default:
                            akra.logger.error("unsupported technique <" + pTech.type + " /> founded");
                    }

                    //finding normal maps like this
                    /*
                    <technique profile=​"OpenCOLLADA3dsMax">​
                    <bump bumptype=​"HEIGHTFIELD">​
                    <texture texture=​"Default_Material_normals2_png-sampler" texcoord=​"CHANNEL1">​</texture>​
                    </bump>​
                    </technique>​
                    */
                    var pXMLExtra = firstChild(pXML, "extra");

                    if (akra.isDefAndNotNull(pXMLExtra)) {
                        var pXMLTech = firstChild(pXMLExtra, "technique");
                        if (akra.isDefAndNotNull(pXMLTech)) {
                            var pXMLBump = firstChild(pXMLTech, "bump");
                            if (akra.isDefAndNotNull(pXMLBump) && attr(pXMLBump, "bumptype") === "HEIGHTFIELD") {
                                pTech.value.textures.normal = this.COLLADATexture(firstChild(pXMLBump, "texture"));
                                // logger.log(pTech.value);
                            }
                        }
                    }

                    this.link(pTech.sid, pTech);

                    return pTech;
                };

                Collada.prototype.COLLADAProfileCommon = function (pXML) {
                    var _this = this;
                    var pProfile = {
                        technique: null,
                        newParam: {}
                    };

                    this.eachByTag(pXML, "newparam", function (pXMLData) {
                        pProfile.newParam[attr(pXMLData, "sid")] = _this.COLLADANewParam(pXMLData);
                    });

                    pProfile.technique = this.COLLADAEffectTechnique(firstChild(pXML, "technique"));

                    return pProfile;
                };

                Collada.prototype.COLLADAEffect = function (pXML) {
                    var _this = this;
                    var pEffect = {
                        id: attr(pXML, "id"),
                        profileCommon: null
                    };

                    this.eachChild(pXML, function (pXMLData, sName) {
                        switch (sName.toLowerCase()) {
                            case "profile_common":
                                pEffect.profileCommon = _this.COLLADAProfileCommon(pXMLData);
                                pEffect.profileCommon.technique.value.name = pEffect.id;
                                break;
                            default:
                                akra.debug.warn("<" + sName + " /> unsupported in effect section");
                        }
                    });

                    this.link(pEffect);

                    return pEffect;
                };

                //materials
                Collada.prototype.COLLADAMaterial = function (pXML) {
                    var pMaterial = {
                        id: attr(pXML, "id"),
                        name: attr(pXML, "name"),
                        instanceEffect: this.COLLADAInstanceEffect(firstChild(pXML, "instance_effect"))
                    };

                    this.link(pMaterial);

                    return pMaterial;
                };

                // scene
                Collada.prototype.COLLADANode = function (pXML, iDepth) {
                    if (typeof iDepth === "undefined") { iDepth = 0; }
                    var _this = this;
                    var pNode = {
                        id: attr(pXML, "id"),
                        sid: attr(pXML, "sid"),
                        name: attr(pXML, "name") || "unknown",
                        type: attr(pXML, "type"),
                        layer: attr(pXML, "layer"),
                        transform: new Mat4(1),
                        geometry: [],
                        controller: [],
                        childNodes: [],
                        camera: [],
                        depth: iDepth,
                        transforms: [],
                        constructedNode: null
                    };

                    var m4fMatrix;
                    var sType;
                    var id, sid;

                    this.link(pNode);

                    this.eachChild(pXML, function (pXMLData, sName) {
                        switch (sName) {
                            case "rotate":
                            case "matrix":
                            case "translate":
                            case "scale":
                                pNode.transforms.push(_this.COLLADATransform(pXMLData, pNode.id));
                                pNode.transform.multiply(_this.COLLADAData(pXMLData));
                                break;

                            case "instance_geometry":
                                pNode.geometry.push(_this.COLLADAInstanceGeometry(pXMLData));
                                break;

                            case "instance_controller":
                                pNode.controller.push(_this.COLLADAInstanceController(pXMLData));
                                break;

                            case "instance_camera":
                                pNode.camera.push(_this.COLLADAInstanceCamera(pXMLData));
                                break;

                            case "node":
                                pNode.childNodes.push(_this.COLLADANode(pXMLData, iDepth + 1));
                                break;
                        }
                    });

                    //TODO: do not load empty nodes..
                    // if (!pNode.pGeometry.length &&
                    //     !pNode.pController.length &&
                    //     !pNode.pChildNodes.length) {
                    //     return null;
                    // }
                    return pNode;
                };

                Collada.prototype.COLLADAVisualScene = function (pXML) {
                    var _this = this;
                    var pNode;
                    var pScene = {
                        id: attr(pXML, "id"),
                        name: attr(pXML, "name"),
                        nodes: []
                    };

                    this.link(pScene);

                    this.eachChild(pXML, function (pXMLData, sName) {
                        switch (sName) {
                            case "node":
                                pNode = _this.COLLADANode(pXMLData);

                                if (akra.isDefAndNotNull(pNode)) {
                                    pScene.nodes.push(pNode);
                                }

                                break;
                        }
                    });

                    akra.debug.info("visual scene loaded.");

                    return pScene;
                };

                Collada.prototype.COLLADABindMaterial = function (pXML) {
                    var _this = this;
                    if (!akra.isDefAndNotNull(pXML)) {
                        return null;
                    }

                    var pMaterials = {};
                    var pMat = null;
                    var pSourceMat = null;
                    var pTech = firstChild(pXML, "technique_common");

                    this.eachByTag(pTech, "instance_material", function (pInstMat) {
                        pSourceMat = _this.source(attr(pInstMat, "target"));

                        pMat = {
                            // url         : pSourceMat.instanceEffect.url,
                            target: attr(pInstMat, "target"),
                            symbol: attr(pInstMat, "symbol"),
                            material: pSourceMat,
                            vertexInput: {}
                        };

                        _this.eachByTag(pInstMat, "bind_vertex_input", function (pXMLVertexInput) {
                            var sInputSemantic = attr(pXMLVertexInput, "input_semantic");

                            if (sInputSemantic !== "TEXCOORD") {
                                akra.logger.error("unsupported vertex input semantics founded: " + sInputSemantic);
                            }

                            var sSemantic = attr(pXMLVertexInput, "semantic");
                            var iInputSet = parseInt(attr(pXMLVertexInput, "input_set"));

                            pMat.vertexInput[sSemantic] = {
                                semantics: sSemantic,
                                inputSet: iInputSet,
                                inputSemantic: sInputSemantic
                            };
                        });

                        pMaterials[pMat.symbol] = pMat;
                    });

                    return pMaterials;
                };

                Collada.prototype.COLLADAInstanceEffect = function (pXML) {
                    var _this = this;
                    var pInstance = {
                        parameters: {},
                        techniqueHint: {},
                        effect: null
                    };

                    /*
                    Exmaple for <instance_effect /> :
                    
                    <instance_effect url="CarPaint">
                    <technique_hint profile="CG" platform="PS3" ref="precalc_texture"/>
                    <setparam ref="diffuse_color">
                    <float3> 0.3 0.25 0.85 </float3>
                    </setparam>
                    </instance_effect>
                    */
                    pInstance.effect = this.source(attr(pXML, "url"));

                    this.eachByTag(pXML, "technique_hint", function (pXMLData) {
                        pInstance.techniqueHint[attr(pXMLData, "platform")] = attr(pXMLData, "ref");
                        akra.debug.warn("<technique_hint /> used, but will be ignored!");
                    });

                    this.eachByTag(pXML, "setparam", function (pXMLData) {
                        //can be any type
                        pInstance.parameters[attr(pXMLData, "ref")] = _this.COLLADAData(pXMLData);
                        akra.debug.warn("<setparam /> used, but will be ignored!");
                    });

                    return pInstance;
                };

                Collada.prototype.COLLADAInstanceController = function (pXML) {
                    var pInst = {
                        controller: this.source(attr(pXML, "url")),
                        material: this.COLLADABindMaterial(firstChild(pXML, "bind_material")),
                        skeletons: []
                    };

                    this.eachByTag(pXML, "skeleton", function (pXMLData) {
                        //cut # symbol from skeleton name
                        pInst.skeletons.push(stringData(pXMLData).substr(1));
                    });

                    return pInst;
                };

                Collada.prototype.COLLADAInstanceGeometry = function (pXML) {
                    var pInst = {
                        geometry: this.source(attr(pXML, "url")),
                        material: this.COLLADABindMaterial(firstChild(pXML, "bind_material"))
                    };

                    return pInst;
                };

                Collada.prototype.COLLADAInstanceCamera = function (pXML) {
                    var pInst = {
                        camera: this.source(attr(pXML, "url"))
                    };

                    return pInst;
                };

                Collada.prototype.COLLADAInstanceLight = function (pXML) {
                    var pInst = {
                        light: this.source(attr(pXML, "url"))
                    };

                    return pInst;
                };

                // directly load <visual_scene> from <instance_visual_scene> from <scene>.
                Collada.prototype.COLLADAScene = function (pXML) {
                    if (typeof pXML === "undefined") { pXML = firstChild(this.getXMLRoot(), "scene"); }
                    var pXMLData = firstChild(pXML, "instance_visual_scene");
                    var pScene = this.source(attr(pXMLData, "url"));

                    if (akra.isNull(pXMLData) || akra.isNull(pScene)) {
                        akra.debug.warn("model has no visual scenes.");
                    }

                    return this._pVisualScene = pScene;
                };

                //camera
                Collada.prototype.COLLADAPerspective = function (pXML) {
                    var pPerspective = {
                        xfov: parseFloat(stringData(firstChild(pXML, "xfov")) || "60.") * akra.math.RADIAN_RATIO,
                        yfov: parseFloat(stringData(firstChild(pXML, "yfov")) || "60.") * akra.math.RADIAN_RATIO,
                        aspect: parseFloat(stringData(firstChild(pXML, "aspect")) || (4. / 3.).toString()),
                        znear: parseFloat(stringData(firstChild(pXML, "znear")) || ".1"),
                        zfar: parseFloat(stringData(firstChild(pXML, "zfar")) || "500.")
                    };

                    return pPerspective;
                };

                Collada.prototype.COLLADAOptics = function (pXML) {
                    var pOptics = {
                        techniqueCommon: this.COLLADATechniqueCommon(firstChild(pXML, "technique_common"))
                    };

                    return pOptics;
                };

                Collada.prototype.COLLADACamera = function (pXML) {
                    var pCamera = {
                        optics: null,
                        id: attr(pXML, "id")
                    };

                    pCamera.optics = this.COLLADAOptics(firstChild(pXML, "optics"));

                    this.link(pCamera);

                    return pCamera;
                };

                //light
                Collada.prototype.COLLADALight = function (pXML) {
                    return null;
                };

                // animation
                Collada.prototype.COLLADAAnimationSampler = function (pXML) {
                    var _this = this;
                    var pSampler = {
                        inputs: {},
                        id: attr(pXML, "id")
                    };

                    var pInput;
                    var sSemantic;

                    this.link(pSampler);

                    this.eachByTag(pXML, "input", function (pXMLData) {
                        sSemantic = attr(pXMLData, "semantic");

                        switch (sSemantic) {
                            case "INPUT":
                            case "OUTPUT":
                            case "INTERPOLATION":
                            case "IN_TANGENT":
                            case "OUT_TANGENT":
                                pInput = _this.prepareInput(_this.COLLADAInput(pXMLData));
                                pSampler.inputs[sSemantic] = pInput;
                                break;

                            default:
                                akra.debug.error("semantics are different from OUTPUT/INTERPOLATION/IN_TANGENT/OUT_TANGENT is not supported in the <sampler /> tag");
                        }
                    });

                    return pSampler;
                };

                Collada.prototype.COLLADAAnimationChannel = function (pXML) {
                    var pChannel = {
                        sampler: this.source(attr(pXML, "source")),
                        target: this.target(attr(pXML, "target"))
                    };

                    if (akra.isNull(pChannel.target) || akra.isNull(pChannel.target.object)) {
                        akra.debug.warn("cound not setup animation channel for <" + attr(pXML, "target") + ">");
                        return null;
                    }

                    return pChannel;
                };

                Collada.prototype.COLLADAAnimation = function (pXML) {
                    var _this = this;
                    var pAnimation = {
                        id: attr(pXML, "id"),
                        name: attr(pXML, "name"),
                        sources: [],
                        samplers: [],
                        channels: [],
                        animations: []
                    };

                    var pChannel;
                    var pSubAnimation;

                    this.link(pAnimation);

                    this.eachChild(pXML, function (pXMLData, sName) {
                        switch (sName) {
                            case "source":
                                pAnimation.sources.push(_this.COLLADASource(pXMLData));
                                break;

                            case "sampler":
                                pAnimation.samplers.push(_this.COLLADAAnimationSampler(pXMLData));
                                break;

                            case "channel":
                                pChannel = _this.COLLADAAnimationChannel(pXMLData);

                                if (akra.isDefAndNotNull(pChannel)) {
                                    //this guard for skipping channels with unknown targets
                                    pAnimation.channels.push(pChannel);
                                }

                                break;
                            case "animation":
                                pSubAnimation = _this.COLLADAAnimation(pXMLData);

                                if (akra.isDefAndNotNull(pSubAnimation)) {
                                    pAnimation.animations.push(pSubAnimation);
                                }
                        }
                    });

                    if (pAnimation.channels.length == 0 && pAnimation.animations.length == 0) {
                        akra.debug.warn("animation with id \"" + pAnimation.id + "\" skipped, because channels/sub animation are empty");
                        return null;
                    }

                    akra.debug.assert(pXML.parentNode === firstChild(this.getXMLRoot(), "library_animations"), "sub animations not supported");

                    this._pAnimations.push(pAnimation);

                    return pAnimation;
                };

                // collada mapping
                Collada.prototype.source = function (sUrl) {
                    if (sUrl.charAt(0) !== "#") {
                        sUrl = "#" + sUrl;
                    }

                    var pElement = this._pLinks[sUrl];

                    if (!akra.isDefAndNotNull(pElement)) {
                        akra.debug.warn("cannot find element with id: " + sUrl + new Error.stack.split("\n").slice(1).join("\n"));
                    }

                    return pElement || null;
                };

                Collada.prototype.link = function (el, pTarget) {
                    var sId;

                    if (!akra.isString(arguments[0])) {
                        pTarget = arguments[0];
                        sId = pTarget.id;
                    } else {
                        sId = arguments[0];
                    }

                    this._pLinks["#" + sId] = pTarget;
                };

                //astroBoy_newSkeleton_root/rotateY.ANGLE
                //pObject.source: IColladaEntry = astroBoy_newSkeleton_root
                //pSource: IColladaTransform = source(astroBoy_newSkeleton_root/rotateY)
                //pSource: IColladaTransform = {
                //    sid: string;  //rotateY
                //    value: IVec4; //<0 1 0 -4.56752>
                //    name: string; //rotate
                //  }
                //
                //sValue: string = "ANGLE"
                //pObject.object: IColladaTransform = pSource;
                //
                Collada.prototype.target = function (sPath) {
                    var pObject = { value: null };
                    var pSource;

                    var pMatches;
                    var sValue;

                    var iPos;
                    var jPos = 0;

                    iPos = sPath.lastIndexOf("/");

                    if (iPos >= 0) {
                        pObject.source = this.source(sPath.substr(0, iPos));
                    }

                    iPos = sPath.lastIndexOf(".");

                    if (iPos < 0) {
                        iPos = sPath.indexOf("(");
                        jPos = -1;
                    }

                    if (iPos < 0) {
                        pObject.object = this.source(sPath);
                        return pObject;
                    }

                    pSource = this.source(sPath.substr(0, iPos));
                    sValue = sPath.substr(iPos + jPos + 1);
                    pObject.object = pSource;

                    if (!pSource) {
                        return null;
                    }

                    switch (sValue) {
                        case "X":
                            pObject.value = pSource.value.x;
                            break;
                        case "Y":
                            pObject.value = pSource.value.y;
                            break;
                        case "Z":
                            pObject.value = pSource.value.z;
                            break;
                        case "W":
                            pObject.value = pSource.value.w;
                            break;
                        case "ANGLE":
                            pObject.value = pSource.value.w;

                            break;
                    }

                    if (akra.isDefAndNotNull(pObject.value)) {
                        return pObject;
                    }

                    pMatches = sValue.match(/^\((\d+)\)$/);

                    if (pMatches) {
                        pObject.value = Number(pMatches[1]);
                    }

                    pMatches = sValue.match(/^\((\d+)\)\((\d+)\)$/);

                    if (pMatches) {
                        //trace(pMatches, '--->',  Number(pMatches[2]) * 4 + Number(pMatches[1]));
                        //pObject.value = Number(pMatches[2]) * 4 + Number(pMatches[1]);
                        pObject.value = Number(pMatches[1]) * 4 + Number(pMatches[2]);
                    }

                    akra.debug.assert(akra.isDefAndNotNull(pObject.value), "unsupported target value founded: " + sValue);

                    return pObject;
                };

                // //animation
                Collada.prototype.buildAnimationTrack = function (pChannel) {
                    var sNodeId = pChannel.target.source.id;
                    var sJoint = this.source(sNodeId).sid || null;
                    var pTrack = null;
                    var pSampler = pChannel.sampler;

                    akra.debug.assert(akra.isDefAndNotNull(pSampler), "could not find sampler for animation channel");

                    var pInput = pSampler.inputs["INPUT"];
                    var pOutput = pSampler.inputs["OUTPUT"];
                    var pInterpolation = pSampler.inputs["INTERPOLATION"];

                    var pTimeMarks = pInput.array;
                    var pOutputValues = pOutput.array;
                    var pFloatArray;

                    var pTransform = pChannel.target.object;
                    var sTransform = pTransform.transform;
                    var v4f;
                    var pValue;
                    var nMatrices;

                    switch (sTransform) {
                        case "translate":
                            // pTrack = new a.AnimationTranslation(sJoint);
                            // for (var i = 0, v3f = new Array(3), n; i < pTimeMarks.length; ++ i) {
                            //     n = i * 3;
                            //     v3f.X = pOutputValues[i * 3];
                            //     v3f.Y = pOutputValues[i * 3 + 1];
                            //     v3f.Z = pOutputValues[i * 3 + 2];
                            //     pTrack.keyFrame(pTimeMarks[i], [v3f.X, v3f.Y, v3f.Z]);
                            // };
                            akra.logger.critical("TODO: implement animation translation");

                            break;
                        case "rotate":
                            // v4f = pTransform.pValue;
                            // pTrack = new a.AnimationRotation(sJoint, [v4f[1], v4f[2], v4f[3]]);
                            // debug.assert(pOutput.pAccessor.iStride === 1,
                            //     "matrix modification supported only for one parameter modification");
                            // for (var i = 0; i < pTimeMarks.length; ++ i) {
                            //     pTrack.keyFrame(pTimeMarks[i], pOutputValues[i] / 180.0 * math.PI);
                            // };
                            akra.logger.critical("TODO: implement animation rotation");

                            break;
                        case "matrix":
                            pValue = pChannel.target.value;
                            if (akra.isNull(pValue)) {
                                pTrack = akra.animation.createTrack(sJoint);
                                nMatrices = pOutputValues.length / 16;
                                pFloatArray = new Float32Array(pOutputValues);

                                akra.debug.assert(nMatrices % 1 === 0.0, "incorrect output length of transformation data (" + pFloatArray.length + ")");

                                for (var i = 0; i < nMatrices; i++) {
                                    var pFrame = new akra.animation.PositionFrame(pTimeMarks[i], (new Mat4(pFloatArray.subarray(i * 16, i * 16 + 16), true)).transpose());
                                    pTrack.keyFrame(pFrame);
                                }
                                // i=0;
                                // var m = (new Mat4(pFloatArray.subarray(i * 16, i * 16 + 16), true));
                                // trace(sFilename,sNodeId,m.toString());
                            } else {
                                // pTrack = new a.AnimationMatrixModification(sJoint, pValue);
                                // for (var i = 0; i < pTimeMarks.length; ++i) {
                                //     pTrack.keyFrame(pTimeMarks[i], pOutputValues[i]);
                                // }
                                akra.logger.critical("TODO: implement animation matrix modification");
                            }
                            break;
                        default:
                            akra.debug.error("unsupported animation typed founeed: " + sTransform);
                    }

                    if (!akra.isNull(pTrack)) {
                        pTrack.setTargetName(sNodeId);
                    }

                    return pTrack;
                };

                Collada.prototype.buildAnimationTrackList = function (pAnimationData) {
                    var pSubAnimations = pAnimationData.animations;
                    var pSubTracks;
                    var pTrackList = [];
                    var pTrack;
                    var pChannels = pAnimationData.channels;

                    for (var i = 0; i < pChannels.length; ++i) {
                        pTrack = this.buildAnimationTrack(pChannels[i]);
                        pTrackList.push(pTrack);
                    }

                    if (akra.isDefAndNotNull(pSubAnimations)) {
                        for (var i = 0; i < pSubAnimations.length; ++i) {
                            pSubTracks = this.buildAnimationTrackList(pSubAnimations[i]);
                            pTrackList = pTrackList.concat(pSubTracks);
                        }
                    }

                    return pTrackList;
                };

                Collada.prototype.buildAnimation = function (pAnimationData) {
                    var pTracks = this.buildAnimationTrackList(pAnimationData);
                    var sAnimation = pAnimationData.name || pAnimationData.id || null;
                    var pAnimation = akra.animation.createAnimation(sAnimation || this.getBasename());

                    for (var i = 0; i < pTracks.length; i++) {
                        pAnimation.push(pTracks[i]);
                    }

                    return pAnimation;
                };

                Collada.prototype.buildAnimations = function (pAnimationsList) {
                    if (typeof pAnimationsList === "undefined") { pAnimationsList = []; }
                    var pAnimations = this.getAnimations();

                    if (akra.isNull(pAnimations)) {
                        return null;
                    }

                    for (var i = 0; i < pAnimations.length; ++i) {
                        var pAnimation = this.buildAnimation(pAnimations[i]);

                        pAnimationsList.push(pAnimation);
                    }

                    return pAnimationsList;
                };

                // common
                Collada.prototype.buildAssetTransform = function (pNode, pAsset) {
                    if (typeof pAsset === "undefined") { pAsset = null; }
                    pAsset = pAsset || this.getAsset();

                    if (akra.isDefAndNotNull(pAsset)) {
                        var fUnit = pAsset.unit.meter;
                        var sUPaxis = pAsset.upAxis;

                        pNode.setLocalScale(Vec3.temp(fUnit));

                        if (sUPaxis.toUpperCase() == "Z_UP") {
                            //pNode.addRelRotation([1, 0, 0], -.5 * math.PI);
                            pNode.addRelRotationByEulerAngles(0, -.5 * akra.math.PI, 0);
                        }
                    }

                    return pNode;
                };

                Collada.prototype.buildDeclarationFromAccessor = function (sSemantic, pAccessor) {
                    var pDecl = [];

                    for (var i = 0; i < pAccessor.params.length; ++i) {
                        var sUsage = pAccessor.params[i].name;
                        var sType = pAccessor.params[i].type;

                        akra.logger.assert(sType === "float", "Only float type supported for construction declaration from accessor");

                        pDecl.push(VE.float(sUsage));
                    }

                    pDecl.push(VE.custom(sSemantic, 5126 /* FLOAT */, pAccessor.params.length, 0));

                    akra.debug.info("Automatically constructed declaration: ", akra.data.VertexDeclaration.normalize(pDecl).toString());

                    return pDecl;
                };

                // materials & meshes
                Collada.prototype.buildDefaultMaterials = function (pMesh) {
                    var pDefaultMaterial = akra.material.create("default");

                    for (var j = 0; j < pMesh.getLength(); ++j) {
                        var pSubMesh = pMesh.getSubset(j);
                        pSubMesh.getMaterial().set(pDefaultMaterial);
                        pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.mesh_texture");
                        // pSubMesh.renderMethod.effect.addComponent("akra.system.wireframe");
                    }

                    return pMesh;
                };

                Collada.prototype.buildMaterials = function (pMesh, pGeometryInstance) {
                    var pMaterials = pGeometryInstance.material;
                    var pEffects = this.getLibrary("library_effects");

                    if (akra.isNull(pEffects) || akra.isNull(pMaterials)) {
                        return this.buildDefaultMaterials(pMesh);
                    }

                    for (var sMaterial in pMaterials) {
                        var pMaterialInst = pMaterials[sMaterial];
                        var pInputMap = pMaterialInst.vertexInput;

                        // URL --> ID (#somebody ==> somebody)
                        var sEffectId = pMaterialInst.material.instanceEffect.effect.id;
                        var pEffect = pEffects.effect[sEffectId];
                        var pPhongMaterial = pEffect.profileCommon.technique.value;
                        var pMaterial = akra.material.create(sEffectId);

                        pMaterial.set(pPhongMaterial);

                        for (var j = 0; j < pMesh.getLength(); ++j) {
                            var pSubMesh = pMesh.getSubset(j);

                            //if (pSubMesh.surfaceMaterial.findResourceName() === sMaterial) {
                            if (pSubMesh.getMaterial().name === sMaterial) {
                                //setup materials
                                pSubMesh.getMaterial().set(pMaterial);
                                pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.mesh_texture");

                                for (var sTextureType in pPhongMaterial.textures) {
                                    var pColladaTexture = pPhongMaterial.textures[sTextureType];

                                    if (akra.isNull(pColladaTexture)) {
                                        continue;
                                    }

                                    var pInput = pInputMap[pColladaTexture.texcoord];

                                    if (!akra.isDefAndNotNull(pInput)) {
                                        continue;
                                    }

                                    var sInputSemantics = pInputMap[pColladaTexture.texcoord].inputSemantic;
                                    var pColladaImage = pColladaTexture.image;

                                    var pSurfaceMaterial = pSubMesh.getSurfaceMaterial();
                                    var pTexture = this.getManager().getTexturePool().findResource(pColladaImage.path);

                                    if (this.getImageOptions().flipY === true) {
                                        akra.logger.error("TODO: flipY for image unsupported!");
                                    }

                                    var pMatches = sInputSemantics.match(/^(.*?\w)(\d+)$/i);
                                    var iTexCoord = (pMatches ? parseInt(pMatches[2]) : 0);

                                    var iTexture = akra.ESurfaceMaterialTextures[sTextureType.toUpperCase()] | 0;

                                    if (!akra.isDef(iTexture)) {
                                        continue;
                                    }

                                    // logger.log(iTexture, sTextureType)
                                    pSurfaceMaterial.setTexture(iTexture, pTexture, iTexCoord);
                                    // logger.log(pSurfaceMaterial);
                                }

                                if (this.isWireframeEnabled()) {
                                    pSubMesh.wireframe(true);
                                }
                            }
                        }
                        //trace('try to apply mat:', pMaterial);
                    }

                    return pMesh;
                };

                Collada.prototype.buildSkeleton = function (pSkeletonsList) {
                    var pSkeleton = null;

                    pSkeleton = akra.model.createSkeleton(pSkeletonsList[0]);

                    for (var i = 0; i < pSkeletonsList.length; ++i) {
                        var pJoint = this.source(pSkeletonsList[i]).constructedNode;

                        akra.logger.assert(akra.scene.Joint.isJoint(pJoint), "skeleton node must be joint");

                        pSkeleton.addRootJoint(pJoint);
                    }

                    this.addSkeleton(pSkeleton);

                    return pSkeleton;
                };

                Collada.prototype.buildMesh = function (pGeometryInstance) {
                    var pMesh = null;
                    var pGeometry = pGeometryInstance.geometry;
                    var pNodeData = pGeometry.mesh;
                    var sMeshName = pGeometry.id;

                    if (akra.isNull(pNodeData)) {
                        return null;
                    }

                    if ((pMesh = this.findMesh(sMeshName))) {
                        //mesh with same geometry data
                        return this.buildMaterials(pMesh.clone(0 /* GEOMETRY_ONLY */ | 1 /* SHARED_GEOMETRY */), pGeometryInstance);
                    }

                    var iBegin = Date.now();

                    pMesh = this.getEngine().createMesh(sMeshName, (akra.EMeshOptions.HB_READABLE), this.sharedBuffer()); /*shared buffer, if supported*/

                    var pPolyGroup = pNodeData.polygons;
                    var pMeshData = pMesh.getData();

                    for (var i = 0; i < pPolyGroup.length; ++i) {
                        pMesh.createSubset("submesh-" + i, pPolyGroup[i].type);
                    }

                    for (var i = 0, pUsedSemantics = {}; i < pPolyGroup.length; ++i) {
                        var pPolygons = pPolyGroup[i];

                        for (var j = 0; j < pPolygons.inputs.length; ++j) {
                            var pInput = pPolygons.inputs[j];
                            var sSemantic = pInput.semantics;
                            var pData = pInput.array;
                            var pDecl;
                            var pDataExt;

                            //if (pMesh.buffer.getDataLocation(sSemantic) < 0) {
                            if (!pUsedSemantics[sSemantic]) {
                                pUsedSemantics[sSemantic] = true;

                                switch (sSemantic) {
                                    case akra.data.Usages.POSITION:
                                    case akra.data.Usages.NORMAL:
                                        /*
                                        Extend POSITION and NORMAL from {x,y,z} --> {x,y,z,w};
                                        */
                                        pDataExt = new Float32Array(pData.length / 3 * 4);

                                        for (var y = 0, n = 0, m = 0, l = pData.length / 3; y < l; y++, n++) {
                                            pDataExt[n++] = pData[m++];
                                            pDataExt[n++] = pData[m++];
                                            pDataExt[n++] = pData[m++];
                                        }

                                        pData = pDataExt;
                                        pDecl = [VE.float3(sSemantic), VE.end(16)];

                                        break;
                                    case akra.data.Usages.TEXCOORD:
                                    case akra.data.Usages.TEXCOORD1:
                                    case akra.data.Usages.TEXCOORD2:
                                    case akra.data.Usages.TEXCOORD3:
                                    case akra.data.Usages.TEXCOORD4:
                                    case akra.data.Usages.TEXCOORD5:
                                        //avoiding semantics collisions
                                        if (sSemantic === "TEXCOORD") {
                                            sSemantic = "TEXCOORD0";
                                        }

                                        pDecl = [VE.custom(sSemantic, 5126 /* FLOAT */, pInput.accessor.stride)];
                                        break;
                                    default:
                                        pDecl = this.buildDeclarationFromAccessor(sSemantic, pInput.accessor);
                                        akra.debug.warn("unsupported semantics used: " + sSemantic);
                                }

                                pMeshData.allocateData(pDecl, pData);
                            }
                        }
                    }

                    for (var i = 0; i < pPolyGroup.length; ++i) {
                        var pPolygons = pPolyGroup[i];
                        var pSubMesh = pMesh.getSubset(i);
                        var pSubMeshData = pSubMesh.getData();
                        var pIndexDecl = akra.data.VertexDeclaration.normalize(undefined);
                        var pSurfaceMaterial = null;
                        var pSurfacePool = null;

                        for (var j = 0; j < pPolygons.inputs.length; ++j) {
                            var iOffset = pPolygons.inputs[j].offset;
                            var sIndexSemantic = akra.data.Usages.INDEX + iOffset;

                            //total number of offsets can be less then number of inputs
                            if (!pIndexDecl.hasSemantics(sIndexSemantic)) {
                                pIndexDecl.append(VE.float(sIndexSemantic));
                            }
                        }

                        pSubMeshData.allocateIndex(pIndexDecl, new Float32Array(pPolygons.p));

                        for (var j = 0; j < pPolygons.inputs.length; ++j) {
                            var sSemantic = pPolygons.inputs[j].semantics;
                            var sIndexSemantics = akra.data.Usages.INDEX + pPolygons.inputs[j].offset;

                            pSubMeshData.index(sSemantic, sIndexSemantics);
                        }

                        // if (!pSubMesh.material) {
                        //     pSurfacePool = pEngine.getResourceManager().surfaceMaterialPool;
                        //     pSurfaceMaterial = pSurfacePool.findResource(pPolygons.material);
                        //     if (!pSurfaceMaterial) {
                        //         pSurfaceMaterial = pSurfacePool.createResource(pPolygons.material);
                        //     }
                        //     pSubMesh.surfaceMaterial = pSurfaceMaterial;
                        // }
                        pSubMesh.getMaterial().name = pPolygons.material;
                    }

                    pMesh.setShadow(this.isShadowsEnabled());

                    //adding all data to cahce data
                    this.addMesh(pMesh);

                    return this.buildMaterials(pMesh, pGeometryInstance);
                };

                Collada.prototype.buildSkinMesh = function (pControllerInstance) {
                    var pController = pControllerInstance.controller;
                    var pMaterials = pControllerInstance.material;

                    var pSkinData = pController.skin;

                    //skin data
                    var pBoneList = pSkinData.joints.inputs["JOINT"].array;
                    var pBoneOffsetMatrices = pSkinData.joints.inputs["INV_BIND_MATRIX"].array;

                    var m4fBindMatrix = pSkinData.shapeMatrix;
                    var pVertexWeights = pSkinData.vertexWeights;

                    var pGeometry = pSkinData.geometry;

                    var pMesh;
                    var pSkeleton;
                    var pSkin;

                    pSkeleton = this.buildSkeleton(pControllerInstance.skeletons);
                    pMesh = this.buildMesh({ geometry: pGeometry, material: pMaterials });

                    pSkin = pMesh.createSkin();

                    pSkin.setBindMatrix(m4fBindMatrix);
                    pSkin.setBoneNames(pBoneList);
                    pSkin.setBoneOffsetMatrices(pBoneOffsetMatrices);

                    akra.logger.assert(pSkin.setSkeleton(pSkeleton), "Could not set skeleton to skin.");

                    if (!pSkin.setVertexWeights(pVertexWeights.vcount, new Float32Array(pVertexWeights.v), new Float32Array(pVertexWeights.weightInput.array))) {
                        akra.logger.error("cannot set vertex weight info to skin");
                    }

                    pMesh.setSkin(pSkin);
                    pMesh.setSkeleton(pSkeleton);
                    pSkeleton.attachMesh(pMesh);

                    return pMesh;
                };

                Collada.prototype.buildSkinMeshInstance = function (pControllers, pSceneNode) {
                    if (typeof pSceneNode === "undefined") { pSceneNode = null; }
                    var pMesh = null;
                    var pMeshList = [];

                    for (var m = 0; m < pControllers.length; ++m) {
                        pMesh = this.buildSkinMesh(pControllers[m]);
                        pMeshList.push(pMesh);

                        akra.debug.assert(akra.isDefAndNotNull(pMesh), "cannot find instance <" + pControllers[m].url + ">\"s data");

                        if (!akra.isNull(pSceneNode)) {
                            pSceneNode.setMesh(pMesh);
                        }
                    }

                    return pMeshList;
                };

                Collada.prototype.buildMeshInstance = function (pGeometries, pSceneNode) {
                    if (typeof pSceneNode === "undefined") { pSceneNode = null; }
                    var pMesh = null;
                    var pMeshList = [];

                    for (var m = 0; m < pGeometries.length; ++m) {
                        pMesh = this.buildMesh(pGeometries[m]);
                        pMeshList.push(pMesh);

                        akra.debug.assert(akra.isDefAndNotNull(pMesh), "cannot find instance <" + pGeometries[m].url + ">\"s data");

                        if (!akra.isNull(pSceneNode)) {
                            pSceneNode.setMesh(pMesh);
                        }
                    }

                    return pMeshList;
                };

                Collada.prototype.buildMeshes = function () {
                    var pScene = this.getVisualScene();
                    var pMeshes = [];

                    this.findNode(pScene.nodes, null, function (pNode) {
                        var pModelNode = pNode.constructedNode;

                        if (akra.isNull(pModelNode)) {
                            akra.debug.error("you must call buildScene() before call buildMeshes() or file corrupt");
                            return;
                        }

                        if (pNode.controller.length == 0 && pNode.geometry.length == 0) {
                            return;
                        }

                        if (!akra.scene.SceneModel.isModel(pModelNode) && pNode.geometry.length > 0) {
                            pModelNode = pModelNode.getScene().createModel(".joint-to-model-link-" + akra.guid());
                            pModelNode.attachToParent(pNode.constructedNode);
                        }

                        pMeshes.insert(this.buildSkinMeshInstance(pNode.controller));
                        pMeshes.insert(this.buildMeshInstance(pNode.geometry, pModelNode));
                    });

                    return pMeshes;
                };

                // scene
                Collada.prototype.buildSceneNode = function (pNode, pParentNode) {
                    var pSceneNode = pNode.constructedNode;
                    var pScene = pParentNode.getScene();

                    if (akra.isDefAndNotNull(pSceneNode)) {
                        return pSceneNode;
                    }

                    //FIXME: предпологаем, что мы никогда не аттачим контроллеры к узлам,
                    // где они найдены, а аттачим  их к руту скелета, на который они ссылаются
                    if (pNode.geometry.length > 0) {
                        pSceneNode = pScene.createModel();
                    } else {
                        pSceneNode = pScene.createNode();
                    }

                    akra.logger.assert(pSceneNode.create(), "Can not initialize scene node!");

                    pSceneNode.attachToParent(pParentNode);

                    return pSceneNode;
                };

                Collada.prototype.buildJointNode = function (pNode, pParentNode) {
                    var pJointNode = pNode.constructedNode;
                    var sJointSid = pNode.sid;
                    var sJointName = pNode.id;
                    var pSkeleton;

                    akra.debug.assert(akra.isDefAndNotNull(pParentNode), "parent node is null");

                    if (akra.isDefAndNotNull(pJointNode)) {
                        return pJointNode;
                    }

                    if (akra.isNull(pParentNode)) {
                        return null;
                    }

                    pJointNode = pParentNode.getScene().createJoint();

                    akra.logger.assert(pJointNode.create(), "Can not initialize joint node!");

                    pJointNode.setBoneName(sJointSid);
                    pJointNode.attachToParent(pParentNode);

                    akra.debug.assert(!this.isJointsVisualizationNeeded(), "TODO: visualize joints...");

                    //draw joints
                    // var pSceneNode: ISceneModel = pEngine.appendMesh(
                    //     pEngine.pCubeMesh.clone(a.Mesh.GEOMETRY_ONLY | a.Mesh.SHARED_GEOMETRY),
                    //     pJointNode);
                    // pSceneNode.name = sJointName + '[joint]';
                    // pSceneNode.setScale(0.02);
                    return pJointNode;
                };

                Collada.prototype.buildCamera = function (pColladaInstanceCamera, pParent) {
                    var pColladaCamera = pColladaInstanceCamera.camera;
                    var pCamera = pParent.getScene().createCamera(pColladaCamera.name || pColladaCamera.id || null);

                    pCamera.setInheritance(4 /* ALL */);
                    pCamera.attachToParent(pParent);

                    var pPerspective = pColladaCamera.optics.techniqueCommon.perspective;

                    if (!akra.isNull(pPerspective)) {
                        pCamera.setProjParams(pPerspective.xfov, pPerspective.aspect, pPerspective.znear, pPerspective.zfar * (1 / this.getAsset().unit.meter));
                    }

                    return pCamera;
                };

                Collada.prototype.buildNodes = function (pNodes, pParentNode) {
                    if (typeof pParentNode === "undefined") { pParentNode = null; }
                    if (akra.isNull(pNodes)) {
                        return null;
                    }

                    var pNode = null;
                    var pHierarchyNode = null;
                    var m4fLocalMatrix = null;

                    for (var i = pNodes.length - 1; i >= 0; i--) {
                        pNode = pNodes[i];

                        if (!akra.isDefAndNotNull(pNode)) {
                            continue;
                        }

                        if (pNode.type === "JOINT") {
                            pHierarchyNode = this.buildJointNode(pNode, pParentNode);
                        } else {
                            pHierarchyNode = this.buildSceneNode(pNode, pParentNode);
                        }

                        pHierarchyNode.setName(pNode.id || pNode.name);
                        pHierarchyNode.setInheritance(4 /* ALL */);

                        //cache already constructed nodes
                        pNode.constructedNode = pHierarchyNode;
                        pHierarchyNode.setLocalMatrix(pNode.transform);

                        this.buildNodes(pNode.childNodes, pHierarchyNode);

                        if (pNode.camera.length > 0) {
                            for (var c = 0; c < pNode.camera.length; ++c) {
                                var pColladaCamera = pNode.camera[c];
                                var pCamera = this.buildCamera(pColladaCamera, pHierarchyNode);
                            }
                        }
                    }

                    return pHierarchyNode;
                };

                Collada.prototype.buildScene = function (pRootNode) {
                    var pScene = this.getVisualScene();
                    var pAsset = this.getAsset();

                    var pNodes = [];
                    var pNode = null;

                    for (var i = 0; i < pScene.nodes.length; i++) {
                        pNode = pScene.nodes[i];
                        pNodes.push(this.buildNodes([pNode], pRootNode));
                    }

                    for (var i = 0; i < pNodes.length; i++) {
                        pNodes[i] = this.buildAssetTransform(pNodes[i]);
                    }

                    return pNodes;
                };

                Collada.prototype.buildInititalPose = function (pNodes, pSkeleton) {
                    var sPose = "Pose-" + this.getBasename() + "-" + pSkeleton.getName();
                    var pPose = akra.animation.createAnimation(sPose);
                    var pNodeList = pSkeleton.getNodeList();
                    var pNodeMap = {};
                    var pTrack;

                    for (var i = 0; i < pNodeList.length; ++i) {
                        pNodeMap[pNodeList[i].getName()] = pNodeList[i];
                    }

                    this.findNode(pNodes, null, function (pNode) {
                        var sJoint = pNode.sid;
                        var sNodeId = pNode.id;

                        if (!akra.isDefAndNotNull(pNodeMap[sNodeId])) {
                            return;
                        }

                        pTrack = akra.animation.createTrack(sJoint);
                        pTrack.setTargetName(sNodeId);
                        pTrack.keyFrame(0.0, pNode.transform);

                        pPose.push(pTrack);
                    });

                    return pPose;
                };

                Collada.prototype.buildInitialPoses = function (pPoseSkeletons) {
                    if (typeof pPoseSkeletons === "undefined") { pPoseSkeletons = null; }
                    if (!this.isVisualSceneLoaded()) {
                        this.COLLADAScene();
                    }

                    pPoseSkeletons = pPoseSkeletons || this.getSkeletonsOutput();

                    if (akra.isNull(pPoseSkeletons)) {
                        return null;
                    }

                    var pScene = this.getVisualScene();
                    var pSkeleton;
                    var pPoses = [];

                    for (var i = 0; i < pPoseSkeletons.length; ++i) {
                        pSkeleton = pPoseSkeletons[i];

                        // if (pSkeleton.name === "node-Bip001_Pelvis" || pSkeleton.name === "node-Bip001") {
                        //     trace('skipping <node-Bip001_Pelvis> skeleto, ...', '[' + sBasename + ']');
                        //     trace(pSkeleton.getNodeList()[0].localMatrix().toQuat4().toYawPitchRoll(Vec3()).toString());
                        //     continue;
                        // }
                        pPoses.push(this.buildInititalPose(pScene.nodes, pSkeleton));
                    }

                    // logger.log(pPoses);
                    return pPoses;
                };

                // additional
                Collada.prototype.buildComplete = function () {
                    var pScene = this.getVisualScene();

                    if (akra.isNull(pScene)) {
                        akra.debug.warn("build complete, but visual scene not parsed correctly!");
                        return;
                    }

                    //release all links to constructed nodes
                    this.findNode(pScene.nodes, null, function (pNode) {
                        pNode.constructedNode = null;
                    });
                };

                Collada.prototype.setOptions = function (pOptions) {
                    if (akra.isNull(pOptions)) {
                        pOptions = {};
                    }

                    for (var i in Collada.DEFAULT_OPTIONS) {
                        if (akra.isDef(pOptions[i])) {
                            this._pOptions[i] = pOptions[i];
                        } else {
                            this._pOptions[i] = akra.isDef(this._pOptions[i]) ? this._pOptions[i] : Collada.DEFAULT_OPTIONS[i];
                        }
                    }
                };

                Collada.prototype.setXMLRoot = function (pXML) {
                    this._pXMLRoot = pXML;
                };

                Collada.prototype.getXMLRoot = function () {
                    return this._pXMLRoot;
                };

                Collada.prototype.findMesh = function (sName) {
                    return this._pCache.meshMap[sName] || null;
                };

                Collada.prototype.addMesh = function (pMesh) {
                    this._pCache.meshMap[pMesh.getName()] = pMesh;
                    this.sharedBuffer(pMesh.getData());
                };

                Collada.prototype.sharedBuffer = function (pBuffer) {
                    if (akra.isDefAndNotNull(pBuffer)) {
                        this._pCache.sharedBuffer = pBuffer;
                    }

                    return null;
                    // return this._pOptions.sharedBuffer ? pCache.sharedBuffer : null;
                };

                Collada.prototype.prepareInput = function (pInput) {
                    var pSupportedFormat = getSupportedFormat(pInput.semantics);
                    akra.debug.assert(akra.isDefAndNotNull(pSupportedFormat), "unsupported semantic used <" + pInput.semantics + ">");

                    pInput.array = this.COLLADAGetSourceData(pInput.source, pSupportedFormat);
                    pInput.accessor = pInput.source.techniqueCommon.accessor;

                    return pInput;
                };

                Collada.prototype.isJointsVisualizationNeeded = function () {
                    return this._pOptions.drawJoints === true;
                };

                Collada.prototype.isVisualSceneLoaded = function () {
                    return akra.isDefAndNotNull(this._pVisualScene);
                };

                Collada.prototype.isAnimationLoaded = function () {
                    return this._pAnimations.length > 0;
                };

                Collada.prototype.isSceneNeeded = function () {
                    return this._pOptions.scene === true;
                };

                Collada.prototype.isAnimationNeeded = function () {
                    return akra.isDefAndNotNull(this._pOptions.animation) && this._pOptions.animation !== false;
                };

                Collada.prototype.isPoseExtractionNeeded = function () {
                    return this._pOptions.extractPoses === true;
                };

                Collada.prototype.isWireframeEnabled = function () {
                    return this._pOptions.wireframe === true;
                };

                Collada.prototype.getSkeletonsOutput = function () {
                    return this._pOptions.skeletons || null;
                };

                Collada.prototype.addSkeleton = function (pSkeleton) {
                    this._pOptions.skeletons.push(pSkeleton);
                };

                Collada.prototype.getImageOptions = function () {
                    return this._pOptions.images;
                };

                Collada.prototype.getVisualScene = function () {
                    return this._pVisualScene;
                };

                Collada.prototype.getAnimations = function () {
                    return this._pAnimations;
                };

                Collada.prototype.getAnimation = function (i) {
                    return this._pAnimations[i] || null;
                };

                Collada.prototype.getAsset = function () {
                    return this._pAsset;
                };

                Collada.prototype.isLibraryLoaded = function (sLib) {
                    return akra.isDefAndNotNull(this._pLib[sLib]);
                };

                Collada.prototype.isLibraryExists = function (sLib) {
                    return !akra.isNull(firstChild(this.getXMLRoot(), "library_animations"));
                };

                Collada.prototype.getLibrary = function (sLib) {
                    return this._pLib[sLib] || null;
                };

                Collada.prototype.getBasename = function () {
                    return akra.path.parse(this._pOptions.name || this._sFilename || "unknown").getBaseName();
                };

                Collada.prototype.getFilename = function () {
                    return this._sFilename;
                };

                Collada.prototype.setFilename = function (sName) {
                    this._sFilename = sName;
                };

                Collada.prototype.readLibraries = function (pXML, pTemplates) {
                    var pLibraries = this._pLib;

                    for (var i = 0; i < pTemplates.length; i++) {
                        var sLib = pTemplates[i].lib;
                        pLibraries[sLib] = this.COLLADALibrary(firstChild(pXML, sLib), pTemplates[i]);
                    }
                };

                Collada.prototype.checkLibraries = function (pXML, pTemplates) {
                    var pLibraries = this._pLib;

                    for (var i = 0; i < pTemplates.length; i++) {
                        var sLib = pTemplates[i].lib;

                        if (akra.isDefAndNotNull(firstChild(pXML, sLib))) {
                            pLibraries[sLib] = null;
                        }
                    }
                };

                Collada.prototype.parse = function (sXMLData, pOptions) {
                    if (typeof pOptions === "undefined") { pOptions = null; }
                    if (akra.isNull(sXMLData)) {
                        akra.debug.error("must be specified collada content.");
                        return false;
                    }

                    akra.debug.time("parsed");

                    var pParser = new DOMParser();
                    var pXMLDocument = pParser.parseFromString(sXMLData, "application/xml");
                    var pXMLRoot = pXMLDocument.getElementsByTagName("COLLADA")[0];

                    this.setOptions(pOptions);
                    this.setXMLRoot(pXMLRoot);

                    this.checkLibraries(pXMLRoot, Collada.SCENE_TEMPLATE);
                    this.checkLibraries(pXMLRoot, Collada.ANIMATION_TEMPLATE);

                    this.readLibraries(pXMLRoot, Collada.SCENE_TEMPLATE);

                    this.COLLADAAsset();
                    this.COLLADAScene();

                    if (this.isAnimationNeeded()) {
                        this.readLibraries(pXMLRoot, Collada.ANIMATION_TEMPLATE);
                    }

                    akra.debug.timeEnd("parsed");

                    return true;
                };

                Collada.prototype.loadResource = function (sFilename, pOptions) {
                    if (typeof sFilename === "undefined") { sFilename = null; }
                    if (typeof pOptions === "undefined") { pOptions = null; }
                    akra.debug.group("Collada %s", this.findResourceName());
                    akra.debug.time("loaded " + this.findResourceName());

                    if (akra.isNull(sFilename)) {
                        sFilename = this.findResourceName();
                    }

                    if (this.isResourceLoaded()) {
                        akra.debug.warn("collada model already loaded");
                        return false;
                    }

                    var pModel = this;

                    this.setFilename(sFilename);

                    this.notifyDisabled();
                    this.notifyUnloaded();

                    var pFile = akra.io.fopen(sFilename);

                    pFile.open(function (err, meta) {
                        //FIXME: setuop byteLength correctly..
                        pModel["_iByteLength"] = meta.size || 0;
                    });

                    pFile.read(function (e, sXML) {
                        if (!akra.isNull(e)) {
                            akra.logger.error(e);

                            akra.debug.groupEnd();
                            return;
                        }

                        pModel.notifyRestored();

                        if (pModel.parse(sXML, pOptions)) {
                            //if resource not synced to any other resources
                            //loaded satet must be setted manuality
                            //but if resource has dependend sub-resources,
                            //loaded event happen automaticly, when all depenedences will be loaded.
                            if (pModel.isSyncedTo(1 /* LOADED */)) {
                                //pModel.findRelatedResources(EResourceItemEvents.LOADED)
                                pModel.setChangesNotifyRoutine(function (eFlag, iResourceFlags, isSet) {
                                    if (eFlag === 1 /* LOADED */ && isSet) {
                                        akra.debug.timeEnd("loaded " + pModel.findResourceName());
                                        akra.debug.groupEnd();

                                        pModel.loaded.emit();
                                    }
                                });
                            } else {
                                akra.debug.timeEnd("loaded " + pModel.findResourceName());
                                akra.debug.groupEnd();

                                pModel.notifyLoaded();
                            }
                        }
                    });

                    return true;
                };

                Collada.prototype.attachToScene = function (parent) {
                    var pScene;
                    var pNode;
                    var pRoot;

                    var pSceneOutput = null;

                    // var pAnimationOutput: IAnimation[] = null;
                    var pMeshOutput = null;

                    // var pInitialPosesOutput: IAnimation[] = null;
                    if (akra.isNull(parent)) {
                        return null;
                    }

                    if (parent instanceof akra.scene.Node) {
                        //attach collada scene to give node
                        pNode = parent;
                        pScene = pNode.getScene();
                    } else {
                        //attaching collada scene to new node, that is child of scene root
                        pScene = parent;
                        pNode = pScene.getRootNode();
                    }

                    pRoot = pScene._createModelEntry(this);
                    pRoot.create();
                    pRoot.setName(this.getBasename());
                    pRoot.setInheritance(4 /* ALL */);

                    if (!pRoot.attachToParent(pNode)) {
                        return null;
                    }

                    if (this.isVisualSceneLoaded() && this.isSceneNeeded()) {
                        pSceneOutput = this.buildScene(pRoot);
                        pMeshOutput = this.buildMeshes();
                    }

                    // if (this.isPoseExtractionNeeded()) {
                    //     pInitialPosesOutput = this.buildInitialPoses();
                    // }
                    //pAnimationOutput = this.extractAnimations();
                    // if (isNull(pController)) {
                    //     pController = this.getEngine().createAnimationController();
                    // }
                    // if (!isNull(pController) && !isNull(pAnimationOutput)) {
                    //     for (var i: int = 0; i < pAnimationOutput.length; ++ i) {
                    //         pController.addAnimation(pAnimationOutput[i]);
                    //     }
                    //     pController.attach(pRoot);
                    // }
                    //clear all links from collada nodes to scene nodes
                    this.buildComplete();

                    return pRoot;
                };

                Collada.prototype.extractAnimation = function (i) {
                    var pPoses;
                    var pSkeletons, pSkeleton;
                    var pAnimation = null;
                    var pData = this.getAnimation(i);

                    if (!akra.isNull(pData) && this.isAnimationNeeded() && this.isLibraryExists("library_animations")) {
                        pAnimation = this.buildAnimation(pData);

                        //дополним анимации начальными позициями костей
                        if (this.isPoseExtractionNeeded()) {
                            pSkeletons = this.getSkeletonsOutput() || [];

                            pPoses = this.buildInitialPoses(pSkeletons);

                            for (var j = 0; j < pPoses.length; ++j) {
                                pAnimation.extend(pPoses[j]);
                            }
                        }
                    }

                    return pAnimation;
                };

                Collada.prototype.extractAnimations = function () {
                    var pPoses;
                    var pSkeletons, pSkeleton;
                    var pAnimationOutput = null;

                    if (this.isAnimationNeeded() && this.isLibraryExists("library_animations")) {
                        pAnimationOutput = this.buildAnimations();

                        //дополним анимации начальными позициями костей
                        if (this.isPoseExtractionNeeded()) {
                            pSkeletons = this.getSkeletonsOutput() || [];

                            /*
                            
                            // добавим к начальным позам, те, в которых находятся меши
                            // в момент выгрузки
                            if (!isNull(pMeshOutput)) {
                            for (var i = 0; i < pMeshOutput.length; ++ i) {
                            pSkeletons.push(pMeshOutput[i].skeleton);
                            }
                            }
                            else {
                            //необхоимо для посчета ссылочной информации
                            if (isNull(pSceneOutput)) {
                            this.buildScene();
                            }
                            
                            this.eachByTag(pXMLRoot, "skeleton", function (pXML: Node) {
                            pSkeletons.push(this.buildSkeleton([stringData(pXML)]));
                            });
                            }
                            
                            */
                            pPoses = this.buildInitialPoses(pSkeletons);

                            for (var i = 0; i < pAnimationOutput.length; ++i) {
                                for (var j = 0; j < pPoses.length; ++j) {
                                    pAnimationOutput[i].extend(pPoses[j]);
                                }
                            }
                        }
                    }

                    return pAnimationOutput;
                };

                Collada.isColladaResource = function (pItem) {
                    return isModelResource(pItem) && pItem.getModelFormat() === 4096 /* COLLADA */;
                };
                Collada.DEFAULT_OPTIONS = {
                    drawJoints: false,
                    wireframe: false,
                    shadows: true,
                    sharedBuffer: false,
                    animation: { pose: true },
                    scene: true,
                    extractPoses: true,
                    skeletons: [],
                    images: { flipY: false },
                    debug: false
                };

                Collada.SCENE_TEMPLATE = [
                    { lib: 'library_images', element: 'image', loader: "COLLADAImage" },
                    { lib: 'library_effects', element: 'effect', loader: "COLLADAEffect" },
                    { lib: 'library_materials', element: 'material', loader: "COLLADAMaterial" },
                    { lib: 'library_geometries', element: 'geometry', loader: "COLLADAGeometrie" },
                    { lib: 'library_controllers', element: 'controller', loader: "COLLADAController" },
                    { lib: 'library_cameras', element: 'camera', loader: "COLLADACamera" },
                    { lib: 'library_lights', element: 'light', loader: "COLLADALight" },
                    { lib: 'library_visual_scenes', element: 'visual_scene', loader: "COLLADAVisualScene" }
                ];

                Collada.ANIMATION_TEMPLATE = [
                    { lib: 'library_animations', element: 'animation', loader: "COLLADAAnimation" }
                ];

                Collada.COLLADA_MATERIAL_NAMES = [
                    "emission",
                    "ambient",
                    "diffuse",
                    "shininess",
                    "reflective",
                    "reflectivity",
                    "transparent",
                    "transparency",
                    "specular"
                ];
                return Collada;
            })(akra.pool.ResourcePoolItem);
            resources.Collada = Collada;

            pSupportedVertexFormat = [
                { name: ["X"], type: ["float"] },
                { name: ["Y"], type: ["float"] },
                { name: ["Z"], type: ["float"] }
            ];

            pSupportedTextureFormat = [
                { name: ["S"], type: ["float"] },
                { name: ["T"], type: ["float"] },
                { name: ["P"], type: ["float"] }
            ];

            pSupportedColorFormat = [
                { name: ["R"], type: ["float"] },
                { name: ["G"], type: ["float"] },
                { name: ["B"], type: ["float"] }
            ];

            pSupportedWeightFormat = [
                { name: ["WEIGHT"], type: ["float"] }
            ];

            pSupportedJointFormat = [
                { name: ["JOINT"], type: ["Name", "IDREF"] }
            ];

            pSupportedInvBindMatrixFormat = [
                { name: ["TRANSFORM"], type: ["float4x4"] }
            ];

            pSupportedInterpolationFormat = [
                { name: ["INTERPOLATION"], type: ["Name"] }
            ];

            pSupportedInputFormat = [
                { name: ["TIME"], type: ["float"] }
            ];

            pSupportedOutputFormat = [
                { name: ["TRANSFORM", "X", "ANGLE", null], type: ["float4x4", "float"] },
                { name: ["Y"], type: ["float"] },
                { name: ["Z"], type: ["float"] }
            ];

            pSupportedTangentFormat = [
                { name: ["X"], type: ["float"] },
                { name: ["Y"], type: ["float"] },
                { name: ["X"], type: ["float"] },
                { name: ["Y"], type: ["float"] },
                { name: ["X"], type: ["float"] },
                { name: ["Y"], type: ["float"] },
                { name: ["X"], type: ["float"] },
                { name: ["Y"], type: ["float"] },
                { name: ["X"], type: ["float"] },
                { name: ["Y"], type: ["float"] }
            ];

            pFormatStrideTable = {
                "float": 1,
                "float2": 2,
                "float3": 3,
                "float4": 4,
                "float3x3": 9,
                "float4x4": 16,
                "int": 1,
                "name": 1,
                "Name": 1,
                "IDREF": 1
            };

            /* COMMON FUNCTIONS
            ------------------------------------------------------
            */
            function getSupportedFormat(sSemantics) {
                switch (sSemantics) {
                    case "TEXTANGENT":
                    case "TEXBINORMAL":
                    case "VERTEX":
                    case "NORMAL":
                    case "TANGENT":
                    case "BINORMAL":
                    case "POSITION":
                        return pSupportedVertexFormat;

                    case "TEXCOORD":
                        return pSupportedTextureFormat;

                    case "WEIGHT":
                        return pSupportedWeightFormat;

                    case "JOINT":
                        return pSupportedJointFormat;

                    case "INV_BIND_MATRIX":
                        return pSupportedInvBindMatrixFormat;

                    case "INTERPOLATION":
                        return pSupportedInterpolationFormat;

                    case "IN_TANGENT":
                        return pSupportedTangentFormat;

                    case "INPUT":
                        return pSupportedInputFormat;

                    case "OUT_TANGENT":
                        return pSupportedTangentFormat;

                    case "OUTPUT":
                        return pSupportedOutputFormat;
                    case "COLOR":
                        return pSupportedColorFormat;
                    case "UV":
                    case "MORPH_WEIGHT":
                    case "MORPH_TARGET":
                    case "LINEAR_STEPS":
                    case "IMAGE":
                    case "CONTINUITY":
                        return null;
                }

                akra.logger.error("unknown semantics founded: " + sSemantics);

                return null;
            }

            function calcFormatStride(pFormat) {
                var iStride = 0;
                var s = null;

                for (var i = 0; i < pFormat.length; ++i) {
                    s = pFormat[i].type[0];
                    iStride += pFormatStrideTable[s];
                }

                return iStride;
            }

            // additional
            function printArray(pArr, nRow, nCol) {
                var s = "\n";

                for (var i = 0; i < pArr.length; ++i) {
                    if (i % nCol == 0) {
                        s += "  ";
                    }

                    s += pArr[i] + ", ";

                    if ((i + 1) % nRow == 0) {
                        s += '\n';
                    }
                }

                return s;
            }

            function sortArrayByProperty(pData, sProperty) {
                var tmp;

                for (var i = pData.length - 1; i > 0; i--) {
                    for (var j = 0; j < i; j++) {
                        if (pData[j][sProperty] > pData[j + 1][sProperty]) {
                            tmp = pData[j];
                            pData[j] = pData[j + 1];
                            pData[j + 1] = tmp;
                        }
                    }
                }

                return pData;
            }

            function stringData(pXML) {
                return (akra.isDefAndNotNull(pXML) ? pXML.textContent : null);
            }

            function attr(pXML, sName) {
                return pXML.getAttribute(sName);
            }

            function firstChild(pXML, sTag) {
                if (akra.isString(sTag)) {
                    return pXML.getElementsByTagName(sTag)[0];
                }

                for (var i = 0; i < pXML.childNodes.length; i++) {
                    if (pXML.childNodes[i].nodeType === Node.ELEMENT_NODE) {
                        return pXML.childNodes[i];
                    }
                }

                return null;
            }

            function isModelResource(pItem) {
                return akra.pool.isVideoResource(pItem) && pItem.getResourceCode().getType() === 6 /* MODEL_RESOURCE */;
            }
            resources.isModelResource = isModelResource;
        })(pool.resources || (pool.resources = {}));
        var resources = pool.resources;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
//# sourceMappingURL=Collada.js.map
