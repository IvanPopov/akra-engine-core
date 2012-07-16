/**
 *
 * var w = new Worker('/sources/utils/collada/collada.js');
 w.onmessage = function (e) {
 console.log(e.data);
 }

 w.postMessage({path: '/media/models/cube.dae'});



 */
//importScripts('tinyxmlsax.js', 'tinyxmlw3cdom.js');


/*
 Function with prefix <COLLADA> needs for loading objects that represent COLLADA nodes from model file.

 Function with prefix <prepare> needs for preparing COLLADA nodes for next handing and next
 building real engine objects.

 Functions with prefix <build> needs for creating real engine objects, that will be used by Engine.
 */

function COLLADA (pEngine, sFile, fnCallback, isFileContent) {
    isFileContent = isFileContent || false;

    /* COMMON SETTINGS
     ------------------------------------------------------
     */
    var sFilename = isFileContent? null: sFile;

    /* COMMON FUNCTIONS
     ------------------------------------------------------
     */

    var pSupportedVertexFormat = [
        {sName: 'X', sType: 'float'},
        {sName: 'Y', sType: 'float'},
        {sName: 'Z', sType: 'float'}
    ];

    var pSupportedTextureFormat = [
        {sName: 'S', sType: 'float'},
        {sName: 'T', sType: 'float'},
        {sName: 'P', sType: 'float'}
    ];

    var pSupportedWeightFormat = [
        {sName: 'WEIGHT', sType: 'float'}
    ];

    var pSupportedJointFormat = [
        {sName: 'JOINT', sType: 'name'}
    ];

    var pSupportedInvBindMatrixFormat = [
        {sName: 'TRANSFORM', sType: 'float4x4'}
    ];

    var pFormatStrideTable = {
        'float':    1,
        'float2':   2,
        'float3':   3,
        'float4':   4,
        'float3x3': 9,
        'float4x4': 16,
        'int':      1,
        'name':     1
    };

    var pLinks = {};
    var pLib = {};
    var pCache = {
        '@joint': {}       //joint_name --> {skeleton, controller, index}
    };

    function calcFormatStride (pFormat) {
        var iStride = 0;
        for (var i = 0; i < pFormat.length; ++ i) {
            iStride += pFormatStrideTable[pFormat[i].sType];
        }

        return iStride;
    }

    function link (id, pTarget) {
        if (typeof id !== 'string') {
            pTarget = id;
            id = pTarget.id;
        }
        pLinks['#' + id] = pTarget;
    }

    function source (key) {
//    if (key[0] != '#') {
//        debug_error('incorrect key used <' + key + '>');
//    }
//    else {
//        key = key.substr(1);
//    }
        if (key.charAt(0) !== '#') {
            key = '#' + key;
        }
        return pLinks[key];
    }

    function printArray (pArr, nRow, nCol) {
        var s = '\n';
        for (var i = 0; i < pArr.length; ++i) {
            if (i % nCol == 0) {
                s += '  ';
            }
            s += pArr[i] + ', ';
            if ((i + 1) % nRow == 0) {
                s += '\n';
            }
        }
        return s;
    }

    function parseBool (sValue) {
        return (sValue === 'true');
    }

    /**
     * Получить часть данных массива
     * @param pSrc
     * @param pDst
     * @param iStride шаг (количество элементов в шаге)
     * @param iFrom номер элемента с которого начинать
     * @param iCount сколько элементов надо получить
     * @param iOffset смещение внутри шага (в элементах)
     * @param iLen количество элементов в шаге.
     */
    function retrieve (pSrc, pDst, iStride, iFrom, iCount, iOffset, iLen) {
        iStride = iStride || 1;
        iOffset = iOffset || 0
        iLen = iLen || (iStride - iOffset);
        iFrom = iFrom || 0;
        iCount = iCount || (pSrc.length / iStride - iFrom);

        if (iOffset + iLen > iStride) {
            iLen = iStride - iOffset;
        }
        var iBegin = iFrom * iStride;
        var n = 0;
        for (var i = 0; i < iCount; ++i) {
            for (var j = 0; j < iLen; ++j) {
                pDst[n++] = (pSrc[iBegin + i * iStride + iOffset + j]);
            }
        }

        return n;
    }

    function string2Array (sData, ppData, fnConv, iFrom) {
        fnConv = fnConv || parseFloat;
        iFrom = iFrom || 0;
        var pData = sData.split(/[\s]+/g);
        for (var i = 0, n = pData.length, j = 0; i < n; ++i) {
            if (pData[i] != '') {
                ppData[iFrom + j] = fnConv(pData[i]);
                j++;
            }
        }
        return n;
    }

    function string2FloatArray (sData, ppData, iFrom) {
        return string2Array(sData, ppData, parseFloat, iFrom);
    }

    function string2IntArray (sData, ppData, iFrom) {
        return string2Array(sData, ppData, parseInt, iFrom);
    }

    function string2BoolArray (sData, ppData, iFrom) {
        return string2Array(sData, ppData, parseBool, iFrom);
    }

    function string2StringArray (sData, ppData, iFrom) {
        return string2Array(sData, ppData, String, iFrom);
    }

    function eachChild (pXML, fnCallback) {
        //eachNode(pXML.getChildNodes(), fnCallback);
        eachNode(pXML.childNodes, fnCallback);
    }

    function eachByTag (pXML, sTag, fnCallback, nMax) {
        eachNode(pXML.getElementsByTagName(sTag), fnCallback, nMax);
    }

    function eachNode (pXMLList, fnCallback, nMax) {
        var n = pXMLList.length;
        nMax = (nMax ? (nMax < n ? nMax : n) : n);

        var n = 0, i = 0;
        while (n < pXMLList.length) {
            if (pXMLList[n++].nodeType === 3) {
                continue;
            }

            var pXMLData = pXMLList[n - 1];
            fnCallback(pXMLData, pXMLData.nodeName);

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
    }

    function firstChild (pXML, sTag) {
        if (!sTag) {
            //return pXML.getChildNodes().item(0);
            for (var i = 0; i < pXML.childNodes.length; i++) {
                if (pXML.childNodes[i].nodeType === 1) {
                    return pXML.childNodes[i];
                }
            }
        }
        //return pXML.getElementsByTagName(sTag).item(0);
        return pXML.getElementsByTagName(sTag)[0];
    }

    function stringData (pXML) {
        //return String(pXML.getChildNodes());
        return (pXML? pXML.textContent: null);
    }

    function attr (pXML, sName) {
        //return String(pXML.getAttribute(sName));
        return pXML.getAttribute(sName);
    }

    function sortArrayByProperty (pData, pProperty) {
        pProperty = pProperty || 0;
        var tmp;

        for (var i = pData.length - 1; i > 0; i--) {
            for (var j = 0; j < i; j++) {
                if (pData[j][pProperty] > pData[j + 1][pProperty]) {
                    tmp = pData[j];
                    pData[j] = pData[j + 1];
                    pData[j + 1] = tmp;
                }
            }
        }

        return pData;
    }

    function lastElement (pInput) {
        return pInput[pInput.length - 1];
    }

    /* COLLADA Functions
     ------------------------------------------------------------------------
     *********************************/

    function COLLADAScale (pXML) {
        var v3fScale = new Vector3;
        string2FloatArray(stringData(pXML), v3fScale);

        return Mat4.diagonal(new Matrix4, [v3fScale.X, v3fScale.Y, v3fScale.Z, 1.0]);
    }

    function COLLADATranslate (pXML) {
        var v3fTranslate = new Vector3;
        string2FloatArray(stringData(pXML), v3fTranslate);

        return Vec3.toTranslationMatrix(v3fTranslate);
    }

    function COLLADARotate (pXML) {
        var v4f = new Vector4;
        string2FloatArray(stringData(pXML), v4f);
        return Mat4.rotate(Mat4.identity(new Matrix4), v4f.W * Math.PI / 180.0, [v4f.X, v4f.Y, v4f.Z]);
    }

    function COLLADASampler2D (pXML) {
        var pSampler = {
            sSource: stringData(firstChild(pXML, 'source')),
            sWrapS: stringData(firstChild(pXML, 'wrap_s')),
            sWrapT: stringData(firstChild(pXML, 'wrap_t')),
            sMinFilter: stringData(firstChild(pXML, 'minfilter')),
            sMipFilter: stringData(firstChild(pXML, 'mipfilter')),
            sMagFilter: stringData(firstChild(pXML, 'magfilter'))
        };

        return pSampler;
    }

    function COLLADASurface (pXML) {
        var pSurface = {
            sInitFrom: stringData(firstChild(pXML, 'init_from'))
            //, sFormat: stringData(firstChild(pXML, 'format'))
        }

        return pSurface;
    }

    function COLLADAData (pXML) {
        var sName = pXML.nodeName, pData;

        var pConv = {
            'int':   [Int32Array, string2IntArray],
            'float': [Float32Array, string2FloatArray],
            'bool':  [Array, string2BoolArray],
            'string':[Array, string2StringArray]
        };

        var fnData = function (n, sType) {
            var pData = new pConv[sType][0](n);
            pConv[sType][1](stringData(pXML), pData);
            if (n == 1) {
                return pData[0];
            }
            return pData;
        };

        switch (sName) {
            case 'bool':
                return fnData(1, 'bool');
            case 'int':
                return fnData(1, 'int');
            case 'float':
                return fnData(1, 'float');
            case 'float2':
                return fnData(2, 'float');
            case 'float3':
                return fnData(3, 'float');
            case 'float4':
            case 'color':
                return fnData(4, 'float');
            case 'rotate':
                return COLLADARotate(pXML);
            case 'translate':
                return COLLADATranslate(pXML);
            case 'scale':
                return COLLADAScale(pXML);
            case 'bind_shape_matrix':
            case 'matrix':
                return Mat4.transpose(fnData(16, 'float'));
            case 'float_array':
                return fnData(parseInt(attr(pXML, 'count')), 'float');
            case 'int_array':
                return fnData(parseInt(attr(pXML, 'count')), 'int');
            case 'bool_array':
                return fnData(parseInt(attr(pXML, 'count')), 'bool');
            case 'Name_array':
            case 'name_array':
                return fnData(parseInt(attr(pXML, 'count')), 'string')
            case 'sampler2D':
                return COLLADASampler2D(pXML);
            case 'surface':
                return COLLADASurface(pXML);
            default:
                debug_error('unsupported COLLADA data type <' + sName + ' />');
        }

        return null;
    }


    /*  START OF GEOMETRY SECTION
     * -------------------------------------------------------
     */

    function COLLADAAccessor (pXML) {

        var pAccessor = {
            sSource: attr(pXML, 'source'),
            iCount:  parseInt(attr(pXML, 'count')),
            iStride: parseInt(attr(pXML, 'stride')),
            pParam:  []
        };

        eachChild(pXML, function (pXMLData, sName) {
            pAccessor.pParam.push({
                                      sName: attr(pXMLData, 'name'),
                                      sType: attr(pXMLData, 'type')
                                  });
        });

        return pAccessor;
    }

    function COLLADAInput (pXML, iOffset) {
        var pInput = {
            sSemantic: attr(pXML, 'semantic'),
            sSource:   attr(pXML, 'source'),
            iOffset:   null,
            iSet:      attr(pXML, 'set')
        };
        //pInput.set = (pInput.set ? parseInt(pInput.set) : 0);

        if (pXML.hasAttribute('offset')) {
            pInput.iOffset = parseInt(attr(pXML, 'offset'));
        }

        if (iOffset && pInput.iOffset === null) {
            pInput.iOffset = iOffset;
        }

        return pInput;
    }

    function COLLADATechniqueCommon (pXML) {
        var pTechniqueCommon = {pAccessor: null};
        eachChild(pXML, function (pXMLData, sName) {
            switch (sName) {
                case 'accessor':
                    pTechniqueCommon.pAccessor = COLLADAAccessor(pXMLData);
                    break;
            }
        });

        return pTechniqueCommon;
    }

    function COLLADASource (pXML) {
        var pSource = {
            pArray:           {},
            pTechniqueCommon: null,
            id: attr(pXML, 'id'),
            name: attr(pXML, 'name')
        };

        link(pSource);

        eachChild(pXML, function (pXMLData, sName) {
            var tmp, id;
            switch (sName.toLowerCase()) {
                case 'int_array':
                case 'bool_array':
                case 'float_array':
                case 'name_array':
                    tmp = COLLADAData(pXMLData);

                    id = attr(pXMLData, 'id');
                    pSource.pArray[id] = tmp;
                    link(id, tmp);

                    break;
                case 'technique_common':
                    pSource.pTechniqueCommon = COLLADATechniqueCommon(pXMLData);
                    break;
            }
        });

        return pSource;
    }

    function COLLADAVertices (pXML) {
        var pVerices = {id: attr(pXML, 'id'), pInput: {}};

        eachByTag(pXML, 'input', function (pXMLData) {
            switch (attr(pXMLData, 'semantic')) {
                case 'POSITION':
                    pVerices.pInput['POSITION'] = COLLADAInput(pXMLData);
                    break;
                default:
                    debug_error('semantics are different from POSITION is not supported in the <vertices /> tag');
            }
        });

        return pVerices;
    }

    function COLLADAJoints (pXML) {
        var pJoints = {pInput: {}};
        var pArrayBuffer;
        var pMatrixArray;
        var iCount;
        var pInput;
        var pInvMatrixArray;

        eachByTag(pXML, 'input', function (pXMLData) {
            switch (attr(pXMLData, 'semantic')) {
                case 'JOINT':
                    pJoints.pInput['JOINT'] = COLLADAInput(pXMLData);
                    break;
                case 'INV_BIND_MATRIX':
                    pInput = COLLADAInput(pXMLData);
                    pJoints.pInput['INV_BIND_MATRIX'] = pInput;
                    break;
                default:
                    debug_error('semantics are different from JOINT/INV_BIND_MATRIX is not supported in the <joints /> tag');
            }
        });
        

        for (var i in pJoints.pInput) {
            prepareInput(pJoints.pInput[i]);

            if (i === 'INV_BIND_MATRIX') {

                pInvMatrixArray = new Float32Array(pJoints.pInput[i].pArray);
                iCount = pInvMatrixArray.length / 16;
                pMatrixArray = new Array(iCount);

                for (var j = 0, n = 0; j < pInvMatrixArray.length; j += 16) {
                    pMatrixArray[n ++] = 
                        Mat4.transpose(new Float32Array(pInvMatrixArray.buffer, j * Float32Array.BYTES_PER_ELEMENT, 16));
                }

                pJoints.pInput[i].pArray = pMatrixArray;
            }
        }

        return pJoints;
    }

    function polygonToTriangles (pXML, iStride) {
        //TODO для невыпуклых многоугольников с самоперечечениями работать будет не верно
        return trifanToTriangles(pXML, iStride);
    }

    function trifanToTriangles (pXML, iStride) {
        var pFans2Tri = [0, 0, 0];
        var pData = [];
        var tmp = new Array(iStride), n;
        var pIndexes = [];

        eachByTag(pXML, 'p', function (pXMLData) {
            n = string2IntArray(stringData(pXMLData), pData);
            for (var i = 0; i < 3; i++) {
                retrieve(pData, tmp, iStride, i, 1);
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
    }

    function tristripToTriangles (pXML, iStride) {
        var pStrip2Tri = [0, 0, 0];
        var pData = [];
        var tmp = new Array(iStride), n;
        var pIndexes = [];

        eachByTag(pXML, 'p', function (pXMLData) {
            n = string2IntArray(stringData(pXMLData), pData);

            for (var i = 0; i < 3; i++) {
                retrieve(pData, tmp, iStride, i, 1);
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
    }

    function polylistToTriangles (pXML, iStride) {
        var pXMLvcount = firstChild(pXML, 'vcount');
        var pXMLp = firstChild(pXML, 'p');
        var pVcount = new Array(parseInt(attr(pXML, 'count')));
        var pData, pIndexes, n, h = 0;
        var tmp = new Array(128);
        var buf = new Array(256);
        var pPoly2Tri = [0, 0, 0];

        string2IntArray(stringData(pXMLvcount), pVcount);

        var nElements = 0, nTotalElement = 0;
        for (var i = 0; i < pVcount.length; i++) {
            nElements += pVcount[i];
            nTotalElement += (pVcount[i] - 2) * 3;
        }

        pIndexes = new Array(iStride * nTotalElement);
        pData = new Array(iStride * nElements);

        string2IntArray(stringData(pXMLp), pData);

        for (var i = 0, m = 0; i < pVcount.length; i++) {
            n = retrieve(pData, tmp, iStride, m, pVcount[i]);

            for (var j = 0; j < 3; j++) {
                retrieve(tmp, buf, iStride, j, 1);
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
    }


    function COLLADAPolygons (pXML, sType) {
        var pPolygons = {
            pInput:    [], //потоки данных
            p:         null, //индексы
            sMaterial: attr(pXML, 'material'), //идентификатор материала
            sName:     null //имя (встречается редко, не используется)
        };

        var iOffset = 0, n = 0;
        var iCount = parseInt(attr(pXML, 'count'));
        var iStride;

        eachByTag(pXML, 'input', function (pXMLData) {
            pPolygons.pInput.push(COLLADAInput(pXMLData, iOffset));
            iOffset++;
        });

        sortArrayByProperty(pPolygons.pInput, 'iOffset');

        iStride = lastElement(pPolygons.pInput).iOffset + 1;

        switch (sType) {
            case 'polylist':
                pPolygons.p = polylistToTriangles(pXML, iStride);
                break;
            case 'polygons':
                pPolygons.p = polygonToTriangles(pXML, iStride);

                eachByTag(pXML, 'ph', function (pXMLData) {
                    debug_error('unsupported polygon[polygon] subtype founded: <ph>');
                });

                break;
            case 'triangles':
                pPolygons.p = new Array(3 * iCount * iStride);

                eachByTag(pXML, 'p', function (pXMLData) {
                    n += string2IntArray(stringData(pXMLData), pPolygons.p, n);
                });
                break;
            case 'trifans':
                pPolygons.p = trifanToTriangles(pXML, iStride);
                break;
            case 'tristrips':
                pPolygons.p = tristripToTriangles(pXML, iStride);
                break;
            default:
                debug_error('unsupported polygon[' + sType + '] type founded');
        }

        if (pPolygons.eType === undefined) {
            pPolygons.eType = a.PRIMTYPE.TRIANGLELIST;
        }

        return pPolygons;
    }

    function COLLADAVertexWeights (pXML) {
        var pVertexWeights = {
            iCount: parseInt(attr(pXML, 'count')),
            pInput: [],
            pVcount: null,
            pV: null
        };

        var iOffset = 0;
        eachByTag(pXML, 'input', function (pXMLData) {
            pVertexWeights.pInput.push(COLLADAInput(pXMLData, iOffset));
            iOffset++;
        });

        var pVcountData, pVData;
        pVcountData = new Array(pVertexWeights.iCount);
        string2IntArray(stringData(firstChild(pXML, 'vcount')), pVcountData);
        pVertexWeights.pVcount = pVcountData;

        
        var n = 0;
        for (var i = 0; i < pVcountData.length; ++ i) {
            n += pVcountData[i];
        }
        n *= pVertexWeights.pInput.length;

       debug_assert(pVertexWeights.pInput.length === 2, 
            'more than 2 inputs in <vertex_weights/> not supported currently');

        pVData = new Array(n);
        string2IntArray(stringData(firstChild(pXML, 'v')), pVData);
        pVertexWeights.pV = pVData; 

        return pVertexWeights;  
    }

    function prepareInput (pInput) {
        switch (pInput.sSemantic) {
            case 'TEXTANGENT':
            case 'TEXBINORMAL':
            case 'VERTEX':
            case 'NORMAL':
            case 'TANGENT':
            case 'BINORMAL':
            case 'POSITION':
                pInput.sArrayId = COLLADAGetSourceData(pInput.sSource, pSupportedVertexFormat);
                break;
            case 'TEXCOORD':
                pInput.sArrayId = COLLADAGetSourceData(pInput.sSource, pSupportedTextureFormat);
                break;
            case 'WEIGHT':
                pInput.sArrayId = COLLADAGetSourceData(pInput.sSource, pSupportedWeightFormat);
                break;
            case 'JOINT':
                pInput.sArrayId = COLLADAGetSourceData(pInput.sSource, pSupportedJointFormat);
                break;
            case 'INV_BIND_MATRIX':
                pInput.sArrayId = COLLADAGetSourceData(pInput.sSource, pSupportedInvBindMatrixFormat);
                break;
            case 'UV':
            case 'OUT_TANGENT':
            case 'OUTPUT':
            case 'MORPH_WEIGHT':
            case 'MORPH_TARGET':
            case 'LINEAR_STEPS':
            case 'INTERPOLATION':
            case 'IN_TANGENT':
            case 'INPUT':
            case 'IMAGE':
            case 'CONTINUITY':
            case 'COLOR':
            default:
                debug_error('unsupported semantic used <' + pInput.sSemantic + '>');
        }

        pInput.pArray = source(pInput.sArrayId);
        pInput.pAccessor = source(pInput.sSource).pTechniqueCommon.pAccessor;
        return pInput;
    }

    function COLLADAGetSourceData (sSourceId, pFormat) {
        var nStride = calcFormatStride(pFormat);
        var pSource = source(sSourceId);
        debug_assert(pSource, '<source /> with id <' + sSourceId + '> not founded');

        var pTech = pSource.pTechniqueCommon;
        debug_assert(pTech, '<source /> with id <' + sSourceId + '> has no <technique_common />');

        var pAccess = pTech.pAccessor;
        debug_assert(pAccess.iStride <= nStride,
               '<source /> width id' + sSourceId + ' has unsupported stride: ' + pAccess.iStride);

        for (var i in pAccess.pParam) {
            if (pAccess.pParam[i].sName.toLowerCase() != pFormat[i].sName.toLowerCase() ||
                pAccess.pParam[i].sType.toLowerCase() != pFormat[i].sType.toLowerCase()) {
                trace('expected format: ', pFormat);
                trace('given format: ', pAccess.pParam);
                debug_error('accessor of <' + sSourceId + '> has unsupported format');
            }
        }
        return (pAccess.sSource);
    }

    
    function COLLADAMesh (pXML) {
        var pMesh = {
            pSource:   [],
            pPolygons: []
        };
        var id, tmp, pVertices, pPos;

        eachChild(pXML, function (pXMLData, sName) {
            switch (sName) {
                case 'source':
                    pMesh.pSource.push(COLLADASource(pXMLData));
                    break;
                case 'vertices':
                    pVertices = COLLADAVertices(pXMLData);
                    break;
                case 'lines':
                case 'linestrips':
                case 'tristrips':
                case 'trifans':
                case 'triangles':
                case 'polygons':
                case 'polylist':
                    tmp = COLLADAPolygons(pXMLData, sName);
                    for (var i = 0; i < tmp.pInput.length; ++i) {
                        if (tmp.pInput[i].sSemantic == 'VERTEX') {
                            if (tmp.pInput[i].sSource == '#' + pVertices.id) {
                                pPos = pVertices.pInput['POSITION'];

                                tmp.pInput[i].sSource = pPos.sSource;
                                tmp.pInput[i].sSemantic = pPos.sSemantic;
                            }
                            else {
                                debug_error('<input /> with semantic VERTEX must refer to <vertices /> tag in same mesh.');
                            }
                        }
                        prepareInput(tmp.pInput[i]);
                    }
                    pMesh.pPolygons.push(tmp);
                    break;
            }
        });

        return pMesh;
    }

    function COLLADAGeometrie (pXML) {
        var pGeometrie = {
            pMesh:        null,
            pConvexMesh: null,
            pSpline:      null,
            id:          attr(pXML, 'id'),
            sName:        attr(pXML, 'name')
        };

        link(pGeometrie);

        var pXMLData = firstChild(pXML);
        //var sName = pXMLData.getNodeName();
        var sName = pXMLData.nodeName;
        if (sName == 'mesh') {
            pGeometrie.pMesh = COLLADAMesh(pXMLData);
        }
        return (pGeometrie);
    }

    function COLLADASkin (pXML) {
        var pSkin = {
            m4fShapeMatrix: COLLADAData(firstChild(pXML, 'bind_shape_matrix')),
            pSource: [],
            pGeometry: source(attr(pXML, 'source')),
            pJoints: null,
            pVertexWeights: null

            //TODO:  add other parameters to skin section
        }

        var tmp, pInput;

        eachChild(pXML, function (pXMLData, sName) {
            switch (sName) {
                case 'source':
                    pSkin.pSource.push(COLLADASource(pXMLData));
                    break;
                case 'joints':
                    pSkin.pJoints = COLLADAJoints(pXMLData);
                    break;
                case 'vertex_weights':
                    tmp = COLLADAVertexWeights(pXMLData);
                    
                    for (var i = 0; i < tmp.pInput.length; ++i) {
                        pInput = tmp.pInput[i];
                        prepareInput(pInput);
                    }

                    pSkin.pVertexWeights = (tmp);
                    break;
            }
        });

        return pSkin;
    }

    function COLLADAController (pXML) {
        var pController = {
            pSkin: null,
            pMorph: null,
            sName: attr(pXML, 'name'),
            id:    attr(pXML, 'id')
        };

        link(pController);

        var pXMLData = firstChild(pXML, 'skin');

        if (pXMLData) {
            pController.pSkin = COLLADASkin(pXMLData);
        }
        else {
            return null;
        }

        return (pController);
    }

    /*  COLLADA MATERIAL SECTION
     * -------------------------------------------------------
     */

    function COLLADAInstanceEffect (pXML) {
        var pInstance = {
            pParameters:    {},
            pTechniqueHint: {},
            sUrl:           attr(pXML, 'url')
        };

        eachByTag(pXML, 'technique_hint', function (pXMLData) {
            pInstance.pTechniqueHint[attr(pXMLData, 'platform')] = attr(pXMLData, 'ref');
            console.log('technique_hint used!!!!')
        });

        eachByTag(pXML, 'setparam', function (pXMLData) {
            pParameters[attr(pXMLData, 'ref')] = COLLADAData(pXMLData)
            console.log('setparam used!!!!')
        });

        return pInstance;
    }

    function COLLADAMaterial (pXML) {
        var pMaterial = {
            id:              attr(pXML, 'id'),
            sName:           attr(pXML, 'name'),
            pInstanceEffect: COLLADAInstanceEffect(firstChild(pXML, 'instance_effect'))
        };

        link(pMaterial);

        return (pMaterial);
    }

    /*  COLLADA EFFECT SECTION
     * -------------------------------------------------------
     */

    function COLLADANewParam (pXML) {
        var pParam = {
            sid: attr(pXML, 'sid'),
            pAnnotate: null,
            sSemantic: null,
            sModifier: null,
            pValue: null,
            sType: null
        };

        link(pParam.sid, pParam);

        eachChild(pXML, function (pXMLData, sName) {
            switch (sName) {
                case 'semantic':
                    pParam.sSemantic = stringData(pXMLData);
                    break;
                case 'modifier':
                    pParam.sModifier = stringData(pXMLData);
                case 'annotate':
                    pParam.pAnnotate = {
                        sName: attr(pXMLData, 'name'),
                        sValue: stringData(pXMLData)
                    };
                case 'float':
                case 'float2':
                case 'float3':
                case 'float4':
                case 'surface':
                case 'sampler2D':
                    pParam.sType = sName;
                    pParam.pValue = COLLADAData(pXMLData);
                    break;
                default:
                    pParam.pValue = COLLADAData(pXMLData);
            }
        });

        return pParam;
    }

    function COLLADATexture (pXML) {
        var pTexture = {
            sSampler: attr(pXML, 'texture'),
            sTexcoord: attr(pXML, 'texcoord'),
            pSampler: null,
            pSurface: null,
            pImage: null
        }

        pTexture.pSampler = source(pTexture.sSampler);
        pTexture.pSurface = source(pTexture.pSampler.pValue.sSource);
        pTexture.pImage = source(pTexture.pSurface.pValue.sInitFrom);

        return pTexture;
    }

    function COLLADAPhong (pXML) {
        var pMat = new a.Material;
        var pXMLData;
        var pList = [
            'emission', 
            'ambient', 
            'diffuse',
            'shininess', 
            'reflective', 
            'reflectivity',
            'transparent', 
            'transparency', 
            'specular'
        ];

        pMat.pTextures = {};

        for (var i = 0; i < pList.length; i++) {
            pXMLData = firstChild(pXML, pList[i]);
            if (pXMLData) {
                eachChild(pXMLData, function (pXMLData, sName) {
                    switch (sName) {
                        case 'float':
                        case 'color':
                            pMat[pList[i]] = COLLADAData(pXMLData);
                            break;
                        case 'texture':
                            var pTexture = COLLADATexture(pXMLData);
                            pMat.pTextures[pList[i]] = {
                                sParam: pTexture.sTexcoord,
                                pTexture: pTexture
                            };
                    }
                });

            }
        }

        pMat.shininess *= 10.0;

        return pMat;
    }

    function COLLADAEffectTechnique (pXML) {
        var pTech = {
            sid: attr(pXML, 'sid'),
            sType: null,
            pValue: null
        };

        link(pTech.sid, pTech);

        var pValue = firstChild(pXML);
        pTech.sType = pValue.nodeName;
        switch (pTech.sType) {
            case 'blinn':
            case 'phong':
                pTech.pValue = COLLADAPhong(pValue);
                break;
            default:
                debug_error('unsupported technique <' + pTech.sType + ' /> founded');
        }

        return pTech;
    }

    function COLLADAProfileCommon (pXML) {
        var pProfile = {
            pTechnique: null,
            pNewParam: {}
        };

        eachByTag(pXML, 'newparam', function (pXMLData) {
            pProfile.pNewParam[attr(pXMLData, 'sid')] = COLLADANewParam(pXMLData);
        })

        pProfile.pTechnique = COLLADAEffectTechnique(firstChild(pXML, 'technique'));

        return pProfile;
    }

    function COLLADAEffect (pXML) {
        var pEffect = {id: attr(pXML, 'id'), pProfileCommon: null};
        eachChild(pXML, function (pXMLData, sName) {
            switch (sName) {
                case 'profile_COMMON':
                    pEffect.pProfileCommon = COLLADAProfileCommon(pXMLData);
                    pEffect.pProfileCommon.pTechnique.pValue.name = pEffect.id;
                    break;
                case 'extra':
                    break;
                default:
                    debug_error('<' + sName + ' /> unsupported in effect section');
            }
        });
        link(pEffect);
        return pEffect;
    }

     /*  COLLADA ANIMATION
     * -------------------------------------------------------
     */
    


    /*  COLLADA VISUAL SCENE
     * -------------------------------------------------------
     */
    
    function COLLADABindMaterial (pXML) {
        if (!pXML) {
            return null;
        }


        var pMaterials = {};
        var pMat = null;
        var pSourceMat = null;
        var pTech = firstChild(pXML, 'technique_common');

        eachByTag(pTech, 'instance_material', function (pInstMat) {

            pSourceMat = source(attr(pInstMat, 'target'));
            pMat = {sUrl: pSourceMat.pInstanceEffect.sUrl, pVertexInput: {}};

            eachByTag(pInstMat, 'bind_vertex_input', function (pXMLVertexInput) {
                var sInputSemantic = attr(pXMLVertexInput, 'input_semantic');

                if (sInputSemantic !== 'TEXCOORD') {
                    debug_error('unsupported vertex input semantics founded: ' + sSemantic);
                }

                var sSemantic = attr(pXMLVertexInput, 'semantic');
                var sInputSet = parseInt(attr(pXMLVertexInput, 'input_set'));

                pMat.pVertexInput[sSemantic] = {
                                           'sSemantic': sSemantic,
                                           'sInputSet': sInputSet,
                                           'sInputSemantic': sInputSemantic
                                       };
            });

            pMaterials[attr(pInstMat, 'symbol')] = pMat;
        });
      
      return pMaterials;
    }

    function COLLADAInstanceController (pXML) {
        var pInst = {
            pController: source(attr(pXML, 'url')),
            pMaterials: COLLADABindMaterial(firstChild(pXML, 'bind_material')),
            pSkeleton: []
        };

        eachByTag(pXML, 'skeleton', function (pXMLData) {
            pInst.pSkeleton.push(stringData(pXMLData));
        }); 

        return pInst;
    }

    function COLLADAInstanceGeometry (pXML) {
        var pInst = {
            pGeometry: source(attr(pXML, 'url')),
            pMaterials: COLLADABindMaterial(firstChild(pXML, 'bind_material'))
        };

        return pInst;
    }

    function COLLADANode(pXML, iDepth) {
        iDepth = iDepth || 0;

        var pNode = {
            id:          attr(pXML, 'id'),
            sid:         attr(pXML, 'sid'),
            sName:        attr(pXML, 'name') || 'unknown',
            sType:        attr(pXML, 'type'),
            sLayer:       attr(pXML, 'layer'),
            m4fTransform: Mat4.identity(new Matrix4),
            pGeometry:   [],
            pController: [],
            pChildNodes: [],
            iDepth: iDepth
        };

        var m4fTransform = Mat4.identity(new Matrix4), m4fMatrix;
        var sType, id;

        link(pNode);

        eachChild(pXML, function (pXMLData, sName) {
            switch (sName) {
                case 'matrix':
                case 'translate':
                case 'rotate':
                case 'scale':
                    m4fMatrix = COLLADAData(pXMLData);
                    Mat4.mult(pNode.m4fTransform, m4fMatrix);
                    break;
                case 'instance_geometry':
                    pNode.pGeometry.push(COLLADAInstanceGeometry(pXMLData));
                    break;
                case 'instance_controller':
                    pNode.pController.push(COLLADAInstanceController(pXMLData));
                    break;
                case 'node':
                    pNode.pChildNodes.push(COLLADANode(pXMLData, iDepth + 1));
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
    }

    function COLLADAVisualScene (pXML) {
        var pNode;
        var pScene = {
            id: attr(pXML, 'id'),
            name: attr(pXML, 'name'),
            pNodes: []
        };

        link(pScene);

        eachChild(pXML, function (pXMLData, sName) {
            switch (sName) {
                case 'node':
                    pNode = COLLADANode(pXMLData);
                    if (pNode) {
                        pScene.pNodes.push(pNode);
                    }
                    break;
            }
        });

        return pScene;
    }

    /*  COLLADA IMAGES
     * -------------------------------------------------------
     */

    function COLLADAImage (pXML) {
        var pImage = {
            id: attr(pXML, 'id'),
            sName: attr(pXML, 'name'),
            //sFormat: attr(pXML, 'format'),
            //iHeight: parseInt(attr(pXML, 'height')),
            //iWidth: parseInt(attr(pXML, 'width')),
            iDepth: 1,//only 2D images supported
            pData: null,
            sImagePath: null
        };
        var sPath = null;

        link(pImage);

        var pXMLInitData, pXMLData;
        if (pXMLInitData = firstChild(pXML, 'init_from')) {
            sPath = stringData(pXMLInitData);
            
            //modify path to the textures relative to a given file
            if (sFilename) {
                if (!a.pathinfo(sPath).isAbsolute()) {
                    sPath = a.pathinfo(sFilename).dirname + '/' + sPath;   
                }
            }

            pImage.sImagePath = sPath;
        }
        else if (pXMLData = firstChild(pXML, 'data')) {
            debug_error('image loading from <data /> tag unsupported yet.');
        }
        else {
            debug_error('image with id: ' + pImage.id + ' has no data.');
        }

        return pImage;
    }

    /*  COLLADA COMMON
     * -------------------------------------------------------
     */

    function COLLADAAsset (pXML) {
        var pAsset = {
           pUnit: {
                fMeter: 1.0,
                sName:  'meter'
            },

            sUPaxis:  'Y_UP',
            sTitle:    null,
            sCreated:  null,
            sModified: null,

            pContributor: null
        /*{
                author:         null,
                authoring_tool: null,
                comments:       null,
                copyright:      null,
                source_data:    null
            } */
        };

        eachChild(pXML, function (pXMLNode, sName) {
            //var sValue = pXMLNode.getNodeValue();
            var sValue = stringData(pXMLNode);

            switch (sName) {
                case 'up_axis':
                    pAsset.sUPaxis = sValue;
                    break;
                case 'created':
                    pAsset.sCreated = sValue;
                    break;
                case 'modified':
                    pAsset.sModified = sValue;
                    break;
                case 'title':
                    pAsset.sTitle = sValue;
                    break;
                case 'contributor':
                    //TODO contributor
                    break;
                case 'unit':
                    pAsset.pUnit.fMeter = parseFloat(attr(pXMLNode, 'meter'));
                    pAsset.pUnit.sName = attr(pXMLNode, 'name');
                    break;
            }
        });

        return pAsset;
    }

    function COLLADALibrary(pXML, sTag, fnLoader) {
        if (!pXML) {
            return null;
        }

        var pLib = {};
        pLib[sTag] = {};
        eachByTag(pXML, sTag, function (pXMLData) {
            pLib[sTag][attr(pXMLData, 'id')] = fnLoader(pXMLData);
        });
        return pLib;
    }

    function COLLADAScene (pXML) {
        var pXMLData = firstChild(pXML, 'instance_visual_scene');
        var pScene = source(attr(pXMLData, 'url'));

        if (!pXMLData || !pScene) {
            debug_error('collada model: ' + sFilename + ' has no visual scenes.');
        }

        return pScene;
    }


    //================================================================
    // BUILD ENGINE OBJECTS
    //================================================================
    //
    function buildAssetMatrix (pAsset) {
        var fUnit = pAsset.pUnit.fMeter;
        var sUPaxis = pAsset.sUPaxis;
        var m4fAsset = Mat4.diagonal(new Matrix4, [fUnit, fUnit, fUnit, 1.0]);

        if (sUPaxis.toUpperCase() == 'Z_UP') {
            Mat4.rotate(m4fAsset, -.5 * Math.PI, [1, 0, 0]);
        }

        return m4fAsset;
    }

    function buildMaterials (pMesh, pMeshNode) {
        'use strict';
        
        var pMaterials = pMeshNode.pMaterials;
        var pEffects = pLib['library_effects'];

        for (var sMaterial in pMaterials) {
            var pInputs = pMaterials[sMaterial].pVertexInput;
            var pEffect = pEffects.effect[pMaterials[sMaterial].sUrl.substr(1)];
            var pMaterial = pEffect.pProfileCommon.pTechnique.pValue;


            for (var j = 0; j < pMesh.length; ++ j) {
                var pSubMesh = pMesh[j];

                if (pSubMesh.material.name === sMaterial) {
                    //setup materials
                    pSubMesh.material.value = pMaterial;

                    //FIXME: remove flex material setup(needs only demo with flexmats..)
                    pSubMesh.applyFlexMaterial(sMaterial, pMaterial);

                    //setup textures
                    for (var c in pMaterial.pTextures) {
                        var pTextureObject = pMaterial.pTextures[c];
                        var pInput = pInputs[pTextureObject.sParam];
                        
                        if (!pInput) {
                            continue;
                        }
 
                        var sInputSemantics = pInputs[pTextureObject.sParam].sInputSemantic;
                        var pColladaImage = pTextureObject.pTexture;
                        var pSurfaceMaterial = pSubMesh.surfaceMaterial;
                        var pTexture = pEngine.displayManager().texturePool().loadResource(
                            pColladaImage.pImage.sImagePath);
                        var pMatches = sInputSemantics.match(/^(.*?\w)(\d+)$/i);
                        var iTexCoord = (pMatches? pMatches[2]: 0);
                        var iTexture = __ENUM__(SURFACEMATERIAL_TEXTURES)[c.toUpperCase()];

                        pSurfaceMaterial.setTexture(iTexture, pTexture, iTexCoord);
                    }
                }
            }
            //trace('try to apply mat:', pMaterial);
        }

        return pMesh;
    }
    
    /**
     * Build a mesh according to node <mesh>.
     */
    function buildMesh (pMeshNode) {
        'use strict';

        var pMeshList = pCache;
        var pGeometry = pMeshNode.pGeometry;
        var pNodeData = pGeometry.pMesh;
        var sMeshName = pGeometry.id;

        if (!pNodeData) {
            return null;
        }
        
        if (pMeshList && pMeshList[sMeshName]) {
            //mesh with same geometry data
            return buildMaterials(
                pMeshList[sMeshName].clone(a.Mesh.GEOMETRY_ONLY|a.Mesh.SHARED_GEOMETRY),
                pMeshNode);
        }
        
        // trace('--- building started ---');
        var iBegin = a.now();

        var pMesh = new a.Mesh(pEngine, 
              a.Mesh.VB_READABLE,//|a.Mesh.RD_ADVANCED_INDEX,  //0,//
            sMeshName);
        var pPolyGroup = pNodeData.pPolygons;
        var pMeshData = pMesh.data;
        
        //creating subsets
        for (var i = 0; i < pPolyGroup.length; ++ i) {
            pMesh.createSubset('submesh-' + i, a.PRIMTYPE.LINELIST/*pPolyGroup[i].eType*/);
        }

        //filling data
        for (var i = 0; i < pPolyGroup.length; ++ i) {
            var pPolygons = pPolyGroup[i];

            for (var j = 0; j < pPolygons.pInput.length; ++ j) {
                var sSemantic = pPolygons.pInput[j].sSemantic;

                if (pMesh._pFactory.getDataLocation(sSemantic) < 0) {
                    var pDecl, pData = pPolygons.pInput[j].pArray;
                    switch (sSemantic) {
                        case a.DECLUSAGE.POSITION:
                        case a.DECLUSAGE.NORMAL:
                            pDecl = [VE_FLOAT3(sSemantic)];
                            break;
                        case a.DECLUSAGE.TEXCOORD:
                        case a.DECLUSAGE.TEXCOORD1:
                        case a.DECLUSAGE.TEXCOORD2:
                        case a.DECLUSAGE.TEXCOORD3:
                        case a.DECLUSAGE.TEXCOORD4:
                        case a.DECLUSAGE.TEXCOORD5:
                            pDecl = [VE_FLOAT2(sSemantic)];
                            break;
                        default:
                            error('unsupported semantics used: ' + sSemantic);
                    }

                    pMeshData.allocateData(pDecl, pData);
                }
            }
        }

        // trace('data filled:', a.now() - iBegin, 'ms');


        //add indices to data
        for (var i = 0; i < pPolyGroup.length; ++ i) {
            var pPolygons = pPolyGroup[i];
            var pSubMesh = pMesh.getSubset(i);
            var pSubMeshData = pSubMesh.data;
            var pDecl = new Array(pPolygons.pInput.length);
            var iIndex = 0;

            for (var j = 0; j < pPolygons.pInput.length; ++ j) {
                pDecl[j] = VE_FLOAT(a.DECLUSAGE.INDEX + (iIndex ++));
            }

            pSubMeshData.allocateIndex(pDecl, new Float32Array(pPolygons.p));

            for (var j = 0; j < pDecl.length; ++ j) {
                pSubMeshData.index(pPolygons.pInput[j].sSemantic, pDecl[j].eUsage);
            }

            pSubMesh.material.name = pPolygons.sMaterial;
        }

        pMesh.addFlexMaterial('default');
        pMesh.setFlexMaterial('default');

        // trace('indices added:', a.now() - iBegin, 'ms');
        // trace('--- complete ---');

        // trace('loaded mesh<', sMeshName,'>:');
        // for (var i = 0; i < pMesh.length; ++i) {
        //      trace('\tsubmesh<', pMesh[i].name,'>:', pMesh[i].data.getPrimitiveCount(), 'polygons');
        // }
        
        pMeshList[sMeshName] = pMesh;
        return buildMaterials(pMesh, pMeshNode);
    };

    function findNode (pNodes, sNode, fnNodeCallback) {
        sNode = sNode || null;
        fnNodeCallback = fnNodeCallback || null;

        var pNode = null;
        var pRootJoint = null;

        for (var i = pNodes.length - 1; i >= 0; i --) {
            pNode = pNodes[i];
            
            if (pNode === null) {
                continue;
            }
     
            if (sNode && '#' + pNode.id === sNode) {
                return pNode;
            }

            if (fnNodeCallback) {
                fnNodeCallback(pNode);
            }

            if (pNode.pChildNodes) {
                pRootJoint = findNode(pNode.pChildNodes, sNode, fnNodeCallback);
                
                if (pRootJoint) {
                    return pRootJoint;
                }
            }
        }

        return null;
    }


    function buildSkinMesh (pSkinMeshNode) {
        'use strict';

        var pController = pSkinMeshNode.pController;
        var pBoneList = pController.pSkin.pJoints.pInput['JOINT'].pArray;
        var pSkeletonsList = pSkinMeshNode.pSkeleton;
        var pGeometry = pController.pSkin.pGeometry;
        var pMaterials = pSkinMeshNode.pMaterials;
        var pVertexWeights = pController.pSkin.pVertexWeights;
        var pWeightsData = null;

        var pBoneCache = pCache['@joint'];

        var pMesh;
        var pSkeleton;
        var pSkin;
        var pSkinData;
        
        pMesh = buildMesh({pGeometry: pGeometry, pMaterials: pMaterials});
        pSkeleton = new a.Skeleton(pEngine, pSkeletonsList[0]);
        pSkeleton.setup(pBoneList.length);
        pSkin = new a.Skin(pMesh, pSkeleton);
        
        var pPosData;
        if (pPosData = pMesh.data.getData('POSITION')) {
            pPosData.extend(VE_FLOAT('SOME'), null);
        }

        for (var i = 0; i < pVertexWeights.pInput.length; ++ i) {
            if (pVertexWeights.pInput[i].sSemantic === 'WEIGHT') {
                pWeightsData = pVertexWeights.pInput[i].pArray;
                break;
            }
        }
        
        if (!pSkin.setVertexWeights(
            new Float32Array(pVertexWeights.pVcount), 
            new Float32Array(pVertexWeights.pV), 
            new Float32Array(pWeightsData))) {
            error('cannot set vertex weight info to skin');
        }

        //pMesh.setSkin(pSkin);
      
        for (var i = 0; i < pBoneList.length; ++ i) {
            var sBoneName = pBoneList[i];

            debug_assert(pBoneCache[sBoneName] == undefined, 'joint already used by another controller');

            pBoneCache[sBoneName] = {
                pController: pController, 
                pSkeleton: pSkeleton, 
                iIndex: i
            };
        };

        

        return pMesh;
    }

    /**
     * Build SceneNode (Node with visual objects)
     */
    function buildSceneNode (pNode) {
        var pSceneNode = null;

        if (pNode.pController.length) {
            
            pSceneNode = new a.SceneModel(pEngine);
            pSceneNode.create();

            for (var m = 0; m < pNode.pController.length; ++ m) {
                pSceneNode.addMesh(buildSkinMesh(pNode.pController[m]));  
            }
        } 
        else if (pNode.pGeometry.length) {
            pSceneNode = new a.SceneModel(pEngine);
            pSceneNode.create();

            for (var m = 0; m < pNode.pGeometry.length; ++ m) {
                pSceneNode.addMesh(buildMesh(pNode.pGeometry[m]));  
            }
        }
        else {
            pSceneNode = new a.SceneNode(pEngine);
            pSceneNode.create();
        }

        return pSceneNode;
    }

    function buildJointNode (pNode) {
        var pJointNode;
        var sBoneName = pNode.sid;
        var pBoneCache = pCache['@joint'][sBoneName];

        if (!pBoneCache) {
            return buildSceneNode(pNode);
        }

        var pSkeleton = pBoneCache.pSkeleton;
        var pController = pBoneCache.pController;
        var pBoneIndex = pBoneCache.iIndex;
        var m4fBoneOffsetMatrix = pController.pSkin.pJoints.pInput['INV_BIND_MATRIX'].pArray[pBoneIndex];

        pJointNode = pSkeleton.createBone(sBoneName);
        pJointNode.setBoneOffsetMatrix(m4fBoneOffsetMatrix);
        
        //draw joints...............
        var pSceneNode = pEngine.appendMesh(
            pEngine.pCubeMesh.clone(a.Mesh.GEOMETRY_ONLY|a.Mesh.SHARED_GEOMETRY),
            pJointNode);

        pSceneNode.setScale(.25);

        return pJointNode;
    }

    function buildNodes (pNodes, pParentNode) {
        pParentNode = pParentNode || null;

        if (!pNodes) {
            return null;
        }

        //var pSceneNodeSibling = null;
        var pNode = null;
        var pHierarchyNode = null;
        var pMesh = null;
        var pGeometry = null;
        var m4fLocalMatrix = null;

        for (var i = pNodes.length - 1; i >= 0; i --) {
            pNode = pNodes[i];
            
            if (!pNode) {
                continue;
            }

            //pSceneNodeSibling = pHierarchyNode;
            if (pNode.sType === 'JOINT') {
                pHierarchyNode = buildJointNode(pNode);
            }
            else {
                pHierarchyNode = buildSceneNode(pNode);
            }
            
            pHierarchyNode.setName(pNode.sName);
            pHierarchyNode.setInheritance(a.Scene.k_inheritAll);
            pHierarchyNode.attachToParent(pParentNode)

            m4fLocalMatrix = pHierarchyNode.accessLocalMatrix();
            Mat4.set(pNode.m4fTransform, m4fLocalMatrix);

            buildNodes(pNode.pChildNodes, pHierarchyNode);
        }

        return pHierarchyNode;
    }

    function buildScene (pSceneRoot, m4fRootTransform) {
        m4fRootTransform = m4fRootTransform || Mat4.identity(new Matrix4);

        var pNodes = [];
        var pNode = null;

        for (var i = 0; i < pSceneRoot.pNodes.length; i++) {
            pNode = pSceneRoot.pNodes[i];
            Mat4.mult(pNode.m4fTransform, m4fRootTransform);
            pNodes.push(buildNodes([pNode], null));
        }

        return pNodes;
    };

    var pMeshes = [];

    function readCollada(sXMLData) {
        var pParser = new DOMParser();
        var pXMLRootNode = pParser.parseFromString(sXMLData, "application/xml");
        var pXMLCollada = pXMLRootNode.getElementsByTagName('COLLADA')[0];

        var pTemplate = [
            {sLib: 'library_images',        sElement: 'image',          fn: COLLADAImage},
            {sLib: 'library_effects',       sElement: 'effect',         fn: COLLADAEffect},
            {sLib: 'library_materials',     sElement: 'material',       fn: COLLADAMaterial},
            {sLib: 'library_geometries',    sElement: 'geometry',       fn: COLLADAGeometrie},
            {sLib: 'library_controllers',   sElement: 'controller',     fn: COLLADAController},
            {sLib: 'library_visual_scenes', sElement: 'visual_scene',   fn: COLLADAVisualScene}
        ];

        for (var i = 0; i < pTemplate.length; i++) {
            pLib[pTemplate[i].sLib] =
                COLLADALibrary(firstChild(pXMLCollada, pTemplate[i].sLib), pTemplate[i].sElement, pTemplate[i].fn);
        }

        var pAsset = COLLADAAsset(firstChild(pXMLCollada, 'asset'));
        var m4fRootTransform = buildAssetMatrix(pAsset);
        var pSceneRoot = COLLADAScene(firstChild(pXMLCollada, 'scene'));

        fnCallback(buildScene(pSceneRoot, m4fRootTransform));
    }

    if (!isFileContent) {
        a.fopen(sFilename).read(readCollada);
    }
    else {
        readCollada(sFile);
    }
}

a.COLLADA = COLLADA;

