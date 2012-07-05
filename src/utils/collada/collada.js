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

function COLLADA (pEngine, sFilename, fnCallback) {
    /* COMMON SETTINGS
     ------------------------------------------------------
     */
    var COLLADA_REDUCE_MESH_INDECES = 1;


    /* COMMON FUNCTIONS
     ------------------------------------------------------
     */

    var iTimeBegin = (new Date()).getTime();

    function timestamp (msg) {
        console.log((new Date()).getTime() - iTimeBegin + ' ms  ', '[ ' + msg + ' ]');
    }

    timestamp('loading model <' + sFilename + ' />');

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

    var pLinks = {};
    var pAsset = null;
    var pEffects = null;
    var pMaterials = null;
    var pGeometries = null;
    var pVisualScenes = null;
    var pScene = null;
    var pLib = {};

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
            'bool':  [Array, string2BoolArray]
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
            case 'matrix':
                return Mat4.transpose(fnData(16, 'float'))
            case 'float_array':
                return fnData(parseInt(attr(pXML, 'count')), 'float');
            case 'int_array':
                return fnData(parseInt(attr(pXML, 'count')), 'int');
            case 'bool_array':
                return fnData(parseInt(attr(pXML, 'count')), 'bool');
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
            pTechniqueCommon: null
        };

        eachChild(pXML, function (pXMLData, sName) {
            var tmp, id;
            switch (sName) {
                case 'int_array':
                case 'bool_array':
                case 'float_array':
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

    function prepareInput (pInput) {
        switch (pInput.sSemantic) {
            case 'VERTEX':
            case 'NORMAL':
            case 'TANGENT':
            case 'BINORMAL':
            case 'POSITION':
                pInput.sArrayId = getCOLLADASourceData(pInput.sSource, pSupportedVertexFormat);
                break;
            case 'TEXCOORD':
                pInput.sArrayId = getCOLLADASourceData(pInput.sSource, pSupportedTextureFormat);
                break;
            case 'TEXTANGENT':
            case 'TEXBINORMAL':

            case 'WEIGHT':
            case 'UV':
            case 'OUT_TANGENT':
            case 'OUTPUT':
            case 'MORPH_WEIGHT':
            case 'MORPH_TARGET':
            case 'LINEAR_STEPS':
            case 'JOINT':
            case 'INV_BIND_MATRIX':
            case 'INTERPOLATION':
            case 'IN_TANGENT':
            case 'INPUT':
            case 'IMAGE':
            case 'CONTINUITY':
            case 'COLOR':
            default:
                debug_error('unsupported semantic used <' + pInput[i].sSemantic + '>');
        }

        pInput.pArray = source(pInput.sArrayId);
        pInput.pAccessor = source(pInput.sSource).pTechniqueCommon.pAccessor;
        return pInput;
    }

    // function prepareMesh (pMesh) {
    //     for (var i = 0; i < pMesh.pPolygons.length; i++) {
    //         pMesh.pPolygons[i].pDeclarations = [];
    //         for (var j = 0, pInput = pMesh.pPolygons[i].pInput; j < pInput.length; ++j) {
    //             var pVertDecl = 0;//(pInput[j].pAccessor.iStride, pInput[j].sSemantic, a.DTYPE.FLOAT,
    //                                //                  /* a.declarationSemanticFromString*/(pInput[j].sSemantic)};
    //             pVertDecl.iIndexOffset = pInput[j].iOffset;
    //             pMesh.pPolygons[i].pDeclarations.push([pVertDecl]);
    //         }

    //         delete pMesh.pPolygons[i].pInput;
    //     }

    //     pMesh.pData = [];

    //     for (var i in pMesh.pSource) {
    //         var pAccess = pMesh.pSource[i].pTechniqueCommon.pAccessor;
    //         var pArr = source(pAccess.sSource);
    //         pMesh.pData.push({pData: pArr, nCount: pAccess.iCount, iStride: pAccess.iStride});
    //         //console.log(pMesh.pData);
    //     }
    //     delete pMesh.pSource;
    // }

//     /**
//      * Подготовка меша и сведение всех индексов к одному.
//      * @param pMesh Неподготовленный объект меша, возвращаемый функцией COLLADAMesh
//      */
//     function prepareMeshWithReducedIndices (pMesh) {
//         var pMem = {};
//         for (var i = 0; i < pMesh.pPolygons.length; i++) {
//             pMem = reduceToSingleIndex(pMesh.pPolygons[i], pMem);
//             pMesh.pPolygons[i].p = pMem.indices;
//             delete pMesh.pPolygons[i].pInput;
//             //console.log(pMem.indices);
//             var pVertexDeclaration = [];

//             for (var j = 0, pInput = pMem.cache; j < pInput.length; ++j) {
//                 var pVertDecl = new VertexDeclaration(pInput[j].pAccessor.iStride, pInput[j].sSemantic, a.DTYPE.FLOAT,
//                                                       a.declarationSemanticFromString(pInput[j].sSemantic));
//                 pVertDecl.iIndexOffset = 0;
//                 pVertexDeclaration.push(pVertDecl);
//             }

//             pMesh.pPolygons[i].pDeclarations = [pVertexDeclaration];
//         }

//         pMesh.pData = [{pData: pMem.pData, nCount: pMem.pData.length / pMem.iStride, iStride: pMem.iStride}];
//         delete pMesh.pSource;
// //        console.log('------------------------------------------');
// //        for (var i = 0; i < pMem.pData.length / 6; i++) {
// //            for (var j = 0; j < 3; j++) {
// //                console.log(pMem.pData[i * 6] + ', ' + pMem.pData[i * 6 + 1] + ', ' + pMem.pData[i * 6 + 2] + ',');
// //            }
// //        }
// //        console.log(pMem.pData)
// //        console.log('real', pMem.pData.length, '/', pMesh.pData[0].nCount, ':', pMem.iStride);
// //        console.log('------------------------------------------');
//         pMem = null;
//     }

    var getCOLLADASourceData = function (sSourceId, pFormat) {
        var nStride = pFormat.length;
        var pSource = source(sSourceId);
        debug_assert(pSource, '<source /> with id <' + sSourceId + '> not founded');

        var pTech = pSource.pTechniqueCommon;
        debug_assert(pTech, '<source /> with id <' + sSourceId + '> has no <technique_common />');

        var pAccess = pTech.pAccessor;
        debug_assert(pAccess.iStride <= nStride,
               '<source /> width id' + sSourceId + ' has unsupported stride: ' + pAccess.iStride);

        for (var i in pAccess.param) {
            if (pAccess.param[i].sName != pFormat[i].sName ||
                pAccess.param[i].sType != pFormat[i].sType) {
                debug_error('vertices accessor has unsupported format');
            }
        }
        return (pAccess.sSource);
    }

    // /**
    //  * Сведение индексов к одному, для о одной полигональной группы.
    //  * @param pPolygons Массив полигонов (объектов, которые вовращает функция COLLADAPolygon)
    //  * @param pMem Кеш с информацией о сведенных индексах у предыдущих полигональных груп
    //  * @return {*}
    //  */
    // function reduceToSingleIndex (pPolygons, pMem) {
    //     if (pPolygons.eType != a.PRIMTYPE.TRIANGLELIST) {
    //         debug_error('cannot reduce index for type <' + pPolygons.eType + '>');
    //     }

    //     var pInput = pPolygons.pInput;
    //     var pVertices;
    //     var n;

    //     var iStride = 0;
    //     var pShoter = [];

    //     if (pMem.cache) {
    //         pShoter = pMem.cache;
    //         iStride = pMem.iStride;
    //     }

    //     if (pShoter.length && pShoter.length != pInput.length) {
    //         debug_error('it is impossible to reduce to a single index of polygon with different numbers of indices');
    //     }

    //     if (iStride == 0) {
    //         for (var i = 0; i < pInput.length; ++i) {
    //             pShoter[i] = {
    //                 iOffset:   pInput[i].iOffset,
    //                 sSource:   pInput[i].sSource,
    //                 sSemantic: pInput[i].sSemantic,
    //                 pArray:    pInput[i].pArray,
    //                 pAccessor: pInput[i].pAccessor
    //             };

    //             iStride += pShoter[i].pAccessor.iStride;
    //         }
    //     }
    //     //для каждого потока, вычислим смещение (в элементах) в результирующем массиве.
    //     n = 0;
    //     pShoter[0].iStrideOffset = 0;
    //     for (var i = 1; i < pShoter.length; i++) {
    //         n += pShoter[i - 1].pAccessor.iStride;
    //         pShoter[i].iStrideOffset = n;
    //     }

    //     //создадим результирующий массив (по умолчанию минимально возможной длины)

    //     var pRes = pMem.pData || [];
    //     var pIndexRes = [];

    //     pMem.indices = pIndexRes;
    //     pMem.pData = pRes;

    //     n = pMem.n || 0;

    //     function glueIndex (pData, iFrom, iStride) {
    //         var s = '';
    //         for (var i = 0, n = iFrom * iStride; i < iStride; i++) {
    //             s += pData[n + i];
    //         }
    //         return s;
    //     }

    //     for (var nIn = lastElement(pShoter).iOffset + 1,
    //              i = 0, nEl = pPolygons.p.length / nIn; i < nEl; i++) {
    //         var sHash = glueIndex(pPolygons.p, i, nIn);
    //         var nPos = pMem[sHash];

    //         if (nPos === undefined) {
    //             //console.log(sHash, 'y');
    //             for (var j = 0, iNin = i * nIn; j < pShoter.length; j++) {
    //                 var iIndexFrom = pPolygons.p[iNin + pShoter[j].iOffset];
    //                 var iShift = n * iStride + pShoter[j].iStrideOffset;
    //                 //console.log('from', iIndexFrom);
    //                 for (var s = pShoter[j].pAccessor.iStride, iFrom = iIndexFrom * s, k = 0; k < s; ++k) {
    //                     pRes[iShift + k] = pShoter[j].pArray[iFrom + k];
    //                     //console.log('data', pShoter[j].pArray[iFrom + k]);
    //                 }
    //             }

    //             pMem[sHash] = n;
    //             pIndexRes.push(n);
    //             n++;
    //         }
    //         else {
    //             //console.log(sHash, 'n');
    //             pIndexRes.push(nPos);
    //         }
    //     }
    //     pMem.n = n;
    //     pMem.cache = pShoter;
    //     pMem.iStride = iStride;

    //     return pMem;
    // }

    function COLLADAMesh (pXML) {
        var pMesh = {
            pSource:   {},
            pPolygons: []
        };
        var id, tmp, pVertices, pPos;

        eachChild(pXML, function (pXMLData, sName) {
            switch (sName) {
                case 'source':
                    id = attr(pXMLData, 'id');
                    pMesh.pSource[id] = COLLADASource(pXMLData);
                    link(id, pMesh.pSource[id]);
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

        // if (COLLADA_REDUCE_MESH_INDECES) {
        //     prepareMeshWithReducedIndices(pMesh)
        // }
        // else {
        //     prepareMesh(pMesh);
        // }

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
            'pEmission', 'pAmbient', 'pDiffuse',
            'fShininess', 'pReflective', 'fReflectivity',
            'pTransparent', 'fTransparency', 'pSpecular'
        ];

        pMat.pCTexture = {};

        for (var i = 0; i < pList.length; i++) {
            pXMLData = firstChild(pXML, pList[i].substr(1).toLowerCase());
            if (pXMLData) {
                eachChild(pXMLData, function (pXMLData, sName) {
                    switch (sName) {
                        case 'color':
                            pMat[pList[i]] = COLLADAData(pXMLData);
                            break;
                        case 'texture':
                            var pTexture = COLLADATexture(pXMLData);
                            pMat.pCTexture[pTexture.sTexcoord] = pTexture;
                    }
                });

            }
        }

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

    /*  COLLADA VISUAL SCENE
     * -------------------------------------------------------
     */

    function COLLADAInstanceGeometry (pXML) {
        var pInst = {
            pGeometry: source(attr(pXML, 'url')),
            pMaterials: {}
        };
        var pSourceMat = null, pMat = null;
        eachByTag(pXML, 'bind_material', function (pXMLData) {
            var pTech = firstChild(pXMLData, 'technique_common');
            eachByTag(pTech, 'instance_material', function (pInstMat) {

                pSourceMat = source(attr(pInstMat, 'target'));
                pMat = {sUrl: pSourceMat.pInstanceEffect.sUrl, pVertexInput: []};

                eachByTag(pInstMat, 'bind_vertex_input', function (pXMLVertexInput) {
                    var sInputSemantic = attr(pXMLVertexInput, 'input_semantic');

                    if (sInputSemantic !== 'TEXCOORD') {
                        debug_error('unsupported vertex input semantics founded: ' + sSemantic);
                    }

                    var sSemantic = attr(pXMLVertexInput, 'semantic');
                    var sInputSet = parseInt(attr(pXMLVertexInput, 'input_set'));

                    pMat.pVertexInput.push({
                                               'sSemantic': sSemantic,
                                               'sInputSet': sInputSet,
                                               'sInputSemantic': sInputSemantic
                                           });
                });

                pInst.pMaterials[attr(pInstMat, 'symbol')] = pMat;
            });
        });

        return pInst;
    }

    function COLLADANode(pXML) {
        var pNode = {
            id:          attr(pXML, 'id'),
            sid:         attr(pXML, 'sid'),
            sName:        attr(pXML, 'name'),
            sType:        attr(pXML, 'type'),
            sLayer:       attr(pXML, 'layer'),
            m4fTransform: Mat4.identity(new Matrix4),
            pGeometry:   null,
            pChildNodes: []
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
                    pNode.pGeometry = COLLADAInstanceGeometry(pXMLData);
                    //attr(pXMLData, 'url')
                    break;
                case 'node':
                    pNode.pChildNodes.push(COLLADANode(pXMLData));
                    break;
            }
        });
        if (!pNode.pGeometry && !pNode.pChildNodes.length) {
            return null;
        }

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

        link(pImage);

        var pXMLInitData, pXMLData;
        if (pXMLInitData = firstChild(pXML, 'init_from')) {
            pImage.sImagePath = stringData(pXMLInitData);
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

    function buildAssetMatrix () {
        var fUnit = pAsset.pUnit.fMeter;
        var sUPaxis = pAsset.sUPaxis;
        var m4fAsset = Mat4.diagonal(new Matrix4, [fUnit, fUnit, fUnit, 1.0]);

        if (sUPaxis.toUpperCase() == 'Z_UP') {
            Mat4.rotate(m4fAsset, -.5 * Math.PI, [1, 0, 0]);
        }

        return m4fAsset;
    }

    var nTotalHierarhyNodes = 0;

    function buildMesh (pGeometry) {
        var pMeshData = pGeometry.pMesh;
        var pMesh = new a.Mesh(pEngine, 
            a.Mesh.VB_READABLE|a.Mesh.RDS_ADVANCED_INDEX, 
            pGeometry.id);
        
        for (var i = 0; i < pMeshData.pPolygons.length; ++ i) {
            var pPolygons = pMeshData.pPolygons[i];
            pMesh.createSubset('submesh-' + i, pPolygons.eType);
        }

        for (var i = 0; i < pMeshData.pPolygons.length; ++ i) {
            var pPolygons = pMeshData.pPolygons[i];

            for (var j = 0; j < pPolygons.pInput.length; ++ j) {
                var sSemantic = pPolygons.pInput[j].sSemantic;

                if (pMesh._pFactory.getDataLocation(sSemantic) < 0) {
                    var pDecl, pData = pPolygons.pInput[j].pArray;
                    switch (sSemantic) {
                        case a.DECLUSAGE.POSITION:
                            pDecl = [VE_FLOAT3(a.DECLUSAGE.POSITION)];
                            break;
                        case a.DECLUSAGE.NORMAL:
                            pDecl = [VE_FLOAT3(a.DECLUSAGE.NORMAL)];
                            break;
                        case a.DECLUSAGE.TEXCOORD:
                            pDecl = [VE_FLOAT2(a.DECLUSAGE.TEXCOORD)];
                            break;
                        default:
                            error('unsupported semantics used: ' + sSemantic);
                    }

                    pMesh._pFactory.allocateData(pDecl, pData);
                    // trace(pMesh._pDataBuffer.size, 'bytes', pMesh._pDataBuffer._iWidth, pMesh._pDataBuffer._iHeight);
                }
            }
        }

        for (var i = 0; i < pMeshData.pPolygons.length; ++ i) {
            var pPolygons = pMeshData.pPolygons[i];
            var pSubMesh = pMesh.getSubset(i);
            var pSubMeshData = pSubMesh._pRenderData;
            var pDecl = [];
            for (var j = 0; j < pPolygons.pInput.length; ++ j) {
                pDecl.push(VE_FLOAT('INDEX_' + pPolygons.pInput[j].sSemantic));
            }

            pSubMeshData.allocateIndex(pDecl, new Float32Array(pPolygons.p));

            for (var j = 0; j < pDecl.length; ++ j) {
                pSubMeshData.index(pPolygons.pInput[j].sSemantic, pDecl[j].eUsage);
            }

            var sMat = pMeshData.pPolygons[i].sMaterial;
            sMat = sMat.substr(0, sMat.length - 2);
            sMat += '-fx';
            if (sMat === 'shinny-fx') {
                sMat = 'shiny-fx';
            }
            var pMat = pLib['library_effects'].effect[sMat].pProfileCommon.pTechnique.pValue;
            pSubMesh.applyFlexMaterial(sMat, pMat);
        }
        
/*        var pMat = new a.Material;
        pMat.diffuse = new a.Color4f(1,1,1,0);
        pMat.ambient = new a.Color4f(1,1,1,0);
        pMat.shininess = 70;*/
        //pMesh.addFlexMaterial('default'/*, pMat*/);
        //pMesh.setFlexMaterial('default');

/*        
        for (var i = 0; i < pMesh._pSubMeshes.length; i++) {
            trace(pMesh.getSubset(i)._pRenderData._pMap.toString());
        };
        */

        if (!pMeshData) {
            return null;
        }

        return pMesh;
    };

    function buildHieraryNode (pNodes) {
        if (!pNodes) {
            return null;
        }

        var pNode = null;

        for (var i = pNodes.length - 1; i >= 0; i --) {
            pNode = pNodes[i];

            buildHieraryNode(pNode.pChildNodes);

            if (pNode.pGeometry) {
                pMeshes.push(buildMesh(pNode.pGeometry.pGeometry));
            }

            //Mat4.set(pNode.m4fTransform, pFrame.m4fTransformationMatrix);
            //nTotalHierarhyNodes ++;
        }

        return null;
    }

    function buildMaterial (pMaterial) {
        TODO('build material');
        return pMaterial;
    }

    function buildHierarhy () {
        //console.log('scene founded:', pScene.id, pScene);
        var m4fRootTransform = buildAssetMatrix();

        for (var i = 0; i < pScene.pNodes.length; i++) {
            var pNode = pScene.pNodes[i];
            Mat4.mult(pNode.m4fTransform, m4fRootTransform);
        }

        return buildHieraryNode(pScene.pNodes);
    }

    var pMeshes = [];

    a.fopen(sFilename).read (function (sXMLData) {
        var pParser = new DOMParser();
        var pXMLRootNode = pParser.parseFromString(sXMLData, "application/xml");
        var pXMLCollada = pXMLRootNode.getElementsByTagName('COLLADA')[0];

        var pTemplate = [
            {sLib: 'library_images',        sElement: 'image',          fn: COLLADAImage},
            {sLib: 'library_effects',       sElement: 'effect',         fn: COLLADAEffect},
            {sLib: 'library_materials',     sElement: 'material',       fn: COLLADAMaterial},
            {sLib: 'library_geometries',    sElement: 'geometry',       fn: COLLADAGeometrie},
            {sLib: 'library_visual_scenes', sElement: 'visual_scene',   fn: COLLADAVisualScene}
        ];

        pAsset = COLLADAAsset(firstChild(pXMLCollada, 'asset'));
        for (var i = 0; i < pTemplate.length; i++) {
            pLib[pTemplate[i].sLib] =
                COLLADALibrary(firstChild(pXMLCollada, pTemplate[i].sLib), pTemplate[i].sElement, pTemplate[i].fn);
        }

        pScene = COLLADAScene(firstChild(pXMLCollada, 'scene'));
        //fnCallback(buildFramList(), nTotalHierarhyNodes);
        //buildHierarhy();
        trace(pLib['library_materials']);
        trace(pLib['library_effects']);
        for (var i in pLib['library_geometries'].geometry) {
            trace(pLib['library_geometries'].geometry[i]);
            for(var j = 0; j < 1; j++){
                pMeshes.push(buildMesh(pLib['library_geometries'].geometry[i]));
                trace("model", j);
            }
        }

        fnCallback(pMeshes);
    });

}

a.COLLADA = COLLADA;

