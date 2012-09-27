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

/*

{
    sile: <path to model>,
    content: <content of model>,
    sharedBuffer: <true/false> //<!использовать единый видеобуфер для всех мешей модели
}

 */

function COLLADA (pEngine, pSettings) {

    /* COMMON SETTINGS
     ------------------------------------------------------
     */
    var sFilename               = pSettings.file || null;
    var sContent                = pSettings.content || null;
    var fnCallback              = pSettings.success || null;
    var useSharedBuffer         = ifndef(pSettings.sharedBuffer, false);
    //var iAnimationOptions   = ifndef(pSettings.animationOptions, a.Animation.REPEAT);
    var useAnimation            = ifndef(pSettings.animation, true);
    var useScene                = ifndef(pSettings.scene, true);
    var useWireframe            = ifndef(pSettings.wireframe, false);
    var bDrawJoints             = ifndef(pSettings.drawJoints, false);
    var pModelResource          = ifndef(pSettings.modelResource, null);
    var bAnimationWithPose      = ifndef(pSettings.animationWithPose, false);
    //извлекаем позу модели, в которой она находилась изначально.
    var bExtractInitialPoses    = ifndef(pSettings.extractPoses, false);
    var pPoseSkeletons          = ifndef(pSettings.skeletons, null);

    /* COMMON FUNCTIONS
     ------------------------------------------------------
     */

    var sBasename = (sFilename? a.pathinfo(sFilename).filename : 'unknown');

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
        {sName: 'JOINT', sType: ['Name', 'IDREF']}
    ];

    var pSupportedInvBindMatrixFormat = [
        {sName: 'TRANSFORM', sType: 'float4x4'}
    ];

    var pSupportedInterpolationFormat = [
        {sName: 'INTERPOLATION', sType: 'Name'}
    ];

    var pSupportedInputFormat = [
        {sName: 'TIME', sType: 'float'}
    ];

    var pSupportedOutputFormat = [
        {sName: ['TRANSFORM', 'X', 'ANGLE', null], sType: ['float4x4', 'float']},
        {sName: 'Y', sType: 'float'},
        {sName: 'Z', sType: 'float'}
    ];

    var pSupportedTangentFormat = [
        {sName: 'X', sType: 'float'},
        {sName: 'Y', sType: 'float'},
        {sName: 'X', sType: 'float'},
        {sName: 'Y', sType: 'float'},
        {sName: 'X', sType: 'float'},
        {sName: 'Y', sType: 'float'},
        {sName: 'X', sType: 'float'},
        {sName: 'Y', sType: 'float'},
        {sName: 'X', sType: 'float'},
        {sName: 'Y', sType: 'float'}
    ];

    var pFormatStrideTable = {
        'float':    1,
        'float2':   2,
        'float3':   3,
        'float4':   4,
        'float3x3': 9,
        'float4x4': 16,
        'int':      1,
        'name':     1,
        'Name':     1,
        'IDREF':    1
    };

    var pConvFormats = {
        'int':   [Int32Array, string2IntArray],
        'float': [Float32Array, string2FloatArray],
        'bool':  [Array, string2BoolArray],
        'string':[Array, string2StringArray]
    };

    var pLinks = {};
    var pLib = {};
    var pCache = {
        '@mesh': {},             //mesh_name --> mesh
        '@sharedBuffer': null
    };

    var pSceneTemplate = [
        {sLib: 'library_images',        sElement: 'image',          fn: COLLADAImage},
        {sLib: 'library_effects',       sElement: 'effect',         fn: COLLADAEffect},
        {sLib: 'library_materials',     sElement: 'material',       fn: COLLADAMaterial},
        {sLib: 'library_geometries',    sElement: 'geometry',       fn: COLLADAGeometrie},
        {sLib: 'library_controllers',   sElement: 'controller',     fn: COLLADAController},
        {sLib: 'library_visual_scenes', sElement: 'visual_scene',   fn: COLLADAVisualScene}
    ];

    var pAnimationTemplate = [
        {sLib: 'library_animations',    sElement: 'animation',      fn: COLLADAAnimation}
    ];

    function getSupportedFormat(sSemantic) {
        switch (sSemantic) {
            case 'TEXTANGENT':
            case 'TEXBINORMAL':
            case 'VERTEX':
            case 'NORMAL':
            case 'TANGENT':
            case 'BINORMAL':
            case 'POSITION':
                return pSupportedVertexFormat;
            case 'TEXCOORD':
                return pSupportedTextureFormat;
            case 'WEIGHT':
                return pSupportedWeightFormat;
            case 'JOINT':
                return pSupportedJointFormat;
            case 'INV_BIND_MATRIX':
                return pSupportedInvBindMatrixFormat;
            case 'INTERPOLATION':
                return pSupportedInterpolationFormat;
            case 'IN_TANGENT':
                return pSupportedTangentFormat;
            case 'INPUT':
                return pSupportedInputFormat;
            case 'OUT_TANGENT':
                return pSupportedTangentFormat;
            case 'OUTPUT':
                return pSupportedOutputFormat;
            case 'UV':
            case 'MORPH_WEIGHT':
            case 'MORPH_TARGET':
            case 'LINEAR_STEPS':
            case 'IMAGE':
            case 'CONTINUITY':
            case 'COLOR':
                return null; 
        }
        debug_error('unknown semantics founded: ' + sSemantic);
        return null;
    }

    function sharedBuffer (pBuffer) {
        'use strict';

        if (pBuffer) {
            pCache['@sharedBuffer'] = pBuffer;
        }

        return useSharedBuffer? pCache['@sharedBuffer']: null;
    }

    function calcFormatStride (pFormat) {
        var iStride = 0;
        var s = 0;

        for (var i = 0; i < pFormat.length; ++ i) {
            s = (typeof pFormat[i].sType === 'string'? pFormat[i].sType: pFormat[i].sType[0]);
            iStride += pFormatStrideTable[s]; 
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
        if (key.charAt(0) !== '#') {
            key = '#' + key;
        }
        
        var pElement = pLinks[key];

        if (!pElement) {
            warning ('cannot find element with id: ' + key);
        }

        return pElement || null;
    }

    function target (sPath) {
        var iPos;
        var pObject = {pValue: null};
        var pSource;
        var pValue;
        var pMatches;
        var jPos = 0;

        iPos = sPath.lastIndexOf('/');
            
        if (iPos >= 0) {
            pObject.pSource = source(sPath.substr(0, iPos));
        }

        iPos = sPath.lastIndexOf('.');
        
        if (iPos < 0) {
            iPos = sPath.indexOf('(');
            jPos = -1;
        }

        if (iPos < 0) {
            pObject.pObject = source(sPath);
            return pObject;
        }

        pSource = source(sPath.substr(0, iPos));
        sValue = sPath.substr(iPos + jPos + 1);
        pObject.pObject = pSource;

        if (!pSource) {
            return null;
        }

        switch (sValue) {
            case 'X':
                pObject.pValue = pSource.pValue.X;
                break;
            case 'Y':
                pObjec.pValue = pSource.pValue.Y;
                break;
            case 'Z':
                pObject.pValue = pSource.pValue.Z;
                break;
            case 'W':
                pObject.pValue = pSource.pValue.W;
                break;
            case 'ANGLE':
                pObject.pValue = pSource.pValue.pData[0];
                break;
        }

        if (pObject.pValue) {
            return pObject;
        }

        pMatches = sValue.match(/^\((\d+)\)$/);
        
        if (pMatches) {
            pObject.pValue = Number(pMatches[1]);
        }

        pMatches = sValue.match(/^\((\d+)\)\((\d+)\)$/) 

        if (pMatches) {
            //trace(pMatches, '--->',  Number(pMatches[2]) * 4 + Number(pMatches[1]));
            //pObject.pValue = Number(pMatches[2]) * 4 + Number(pMatches[1]);
            pObject.pValue = Number(pMatches[1]) * 4 + Number(pMatches[2]);
        }

        debug_assert (pObject.pValue !== undefined, 'unsupported target value founded: ' + sValue);

        return pObject;
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

    //common tag for all kinf of transforms, such as Rotate, Translate & Matrix
    function COLLADATransform (pXML, id) {
        var pTransform = {
            sid: attr(pXML, 'sid'),
            pValue: null,
            sName: String(pXML.nodeName)
        };

        if (id && pTransform.sid) {
            link(id + '/' + pTransform.sid, pTransform);
        }
        else {
            link(id + '/' + pTransform.sName, pTransform);
        }

        var v4f, m4f;
        switch (pTransform.sName) {
            case 'rotate':
                v4f = new Vector4();
                string2FloatArray(stringData(pXML),  v4f.pData);
                v4f.w *= Math.PI / 180.0;
                pTransform.pValue = v4f;
                break;
            case 'translate':
            case 'scale':
                pTransform.pValue = new Vector3;
                string2FloatArray(stringData(pXML),  pTransform.pValue.pData);
                break;
            case 'matrix':
                m4f = new Mat4;
                string2FloatArray(stringData(pXML),  m4f.pData);
                m4f.transpose();

                pTransform.pValue = m4f;
                break;
            default:
                debug_error('unsupported transform detected: ' + sName);
        }



        return pTransform;
    }

    function COLLADAScaleMatrix (pXML) {
        var v3fScale = new Vec3;
        string2FloatArray(stringData(pXML), v3fScale.pData);

        return new Mat4(v3fScale.x, v3fScale.y, v3fScale.z, 1.0);
    }

    function COLLADATranslateMatrix (pXML) {
        var v3fTranslate = new Vec3;
        string2FloatArray(stringData(pXML), v3fTranslate.pData);

        return v3fTranslate.toTranslationMatrix();
    }

    function COLLADARotateMatrix (pXML) {
        var v4f = new Vec4;
        var m4f = new Matrix4(1);
        string2FloatArray(stringData(pXML), v4f.pData);
        return m4f.rotate(v4f.w * Math.PI / 180.0, v4f);
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

        var fnData = function (n, sType, isArray) {
            var pData = new pConvFormats[sType][0](n);
            pConvFormats[sType][1](stringData(pXML), pData);
            if (n == 1 && !isArray) {
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
                return COLLADARotateMatrix(pXML);
            case 'translate':
                return COLLADATranslateMatrix(pXML);
            case 'scale':
                return COLLADAScaleMatrix(pXML);
            case 'bind_shape_matrix':
            case 'matrix':
                return (new Mat4(fnData(16, 'float'), true)).transpose();
            case 'float_array':
                return fnData(parseInt(attr(pXML, 'count')), 'float', true);
            case 'int_array':
                return fnData(parseInt(attr(pXML, 'count')), 'int', true);
            case 'bool_array':
                return fnData(parseInt(attr(pXML, 'count')), 'bool', true);
            case 'Name_array':
            case 'name_array':
            case 'IDREF_array':
                return fnData(parseInt(attr(pXML, 'count')), 'string', true)
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
            iStride: parseInt(attr(pXML, 'stride') || 1),
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
                case 'idref_array':
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
        var pVertices = {id: attr(pXML, 'id'), pInput: {}};

        eachByTag(pXML, 'input', function (pXMLData) {
            var sSemantic = attr(pXMLData, 'semantic');
            pVertices.pInput[sSemantic] = COLLADAInput(pXMLData);
        });


        debug_assert(pVertices.pInput['POSITION'], 
            'semantics POSITION must be in the <vertices /> tag');                    

        return pVertices;
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
                    pMatrixArray[n ++] = (new Mat4
                        (new Float32Array(pInvMatrixArray.buffer, j * Float32Array.BYTES_PER_ELEMENT, 16), true))
                        .transpose();
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
            pWeightInput: null,
            pVcount: null,
            pV: null
        };

        var iOffset = 0;
        var pInput;

        eachByTag(pXML, 'input', function (pXMLData) {
            pInput = COLLADAInput(pXMLData, iOffset);
            
            if (pInput.sSemantic === 'WEIGHT') {
                pVertexWeights.pWeightInput = pInput;
            }

            pVertexWeights.pInput.push(pInput);
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
        var pSupportedFormat = getSupportedFormat(pInput.sSemantic);
        debug_assert(pSupportedFormat, 'unsupported semantic used <' + pInput.sSemantic + '>');

        pInput.sArrayId = COLLADAGetSourceData(pInput.sSource, pSupportedFormat);
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
        var isFormatSupported;

        if (!(pAccess.iStride <= nStride)) {
            trace(pAccess.iStride, '/', nStride);
        }

        debug_assert(pAccess.iStride <= nStride,
               '<source /> width id' + sSourceId + ' has unsupported stride: ' + pAccess.iStride);

        var fnUnsupportedFormatError = function () {
            trace('expected format: ', pFormat);
            trace('given format: ', pAccess.pParam);
            debug_error('accessor of <' + sSourceId + '> has unsupported format');
        }

        for (var i in pAccess.pParam) {
            if (typeof pFormat[i].sName === 'string') {
                if (pAccess.pParam[i].sName.toLowerCase() != pFormat[i].sName.toLowerCase()) {
                   fnUnsupportedFormatError();
                }
            }
            else {
                isFormatSupported = false;
   
                for (var f = 0; f < pFormat[i].sName.length; ++ f) {
                    if ((pAccess.pParam[i].sName || '').toLowerCase() == (pFormat[i].sName[f] || '').toLowerCase()) {
                        isFormatSupported = true;
                    }
                }

                if (!isFormatSupported) {
                    fnUnsupportedFormatError();
                }
            }

            if (typeof pFormat[i].sType === 'string') {
                if (pAccess.pParam[i].sType.toLowerCase() != pFormat[i].sType.toLowerCase()) {
                    fnUnsupportedFormatError();
                }
            }
            else {
                isFormatSupported = false;
                for (var f = 0; f < pFormat[i].sType.length; ++ f) {
                    if (pAccess.pParam[i].sType.toLowerCase() == pFormat[i].sType[f].toLowerCase()) {
                        isFormatSupported = true;
                    }
                }

                if (!isFormatSupported) {
                    fnUnsupportedFormatError();
                }
            }
        }

        return (pAccess.sSource);
    }

    
    function COLLADAMesh (pXML) {
        'use strict';
        
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
                        pPos = null;

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
        
        if (pTexture.pSampler && pTexture.pSampler.pValue) {
            pTexture.pSurface = source(pTexture.pSampler.pValue.sSource);
        }

        if (pTexture.pSurface) {
            pTexture.pImage = source(pTexture.pSurface.pValue.sInitFrom);
        }

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
            //FIXME: at now, all materials draws similar..
            case 'blinn':
            case 'phong':
            case 'lambert':
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
            sUrl: attr(pXML, 'url'),
            pController: source(attr(pXML, 'url')),
            pMaterials: COLLADABindMaterial(firstChild(pXML, 'bind_material')),
            pSkeleton: []
        };

        eachByTag(pXML, 'skeleton', function (pXMLData) {
            pInst.pSkeleton.push(stringData(pXMLData).substr(1));
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
            m4fTransform: new Mat4(1),
            pGeometry:   [],
            pController: [],
            pChildNodes: [],
            iDepth: iDepth,
            pTransforms: [],
            pConstructedNode: null //<! узел, в котором будет хранится ссылка на реальный игровой нод, построенный по нему
        };

        var m4fMatrix;
        var sType, id, sid;

        link(pNode);

        eachChild(pXML, function (pXMLData, sName) {
            switch (sName) {
                case 'rotate':
                case 'matrix':
                case 'translate':
                case 'scale':
                    pNode.pTransforms.push(COLLADATransform(pXMLData, pNode.id));

                    m4fMatrix = COLLADAData(pXMLData);
                    pNode.m4fTransform.mult(m4fMatrix);
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
        var pData;
        pLib[sTag] = {};

        eachChild(pXML, function (pXMLData, sName) {
            if (sTag !== sName) {
                return;
            }

            pData = fnLoader(pXMLData);

            if (!pData) {
                return;
            }

            pLib[sTag][attr(pXMLData, 'id')] = pData;
        });

        return pLib;
    }

    function COLLADAScene (pXML) {
        var pXMLData = firstChild(pXML, 'instance_visual_scene');
        var pScene = source(attr(pXMLData, 'url'));

        if (!pXMLData || !pScene) {
            debug_warning('collada model: ' + sFilename + ' has no visual scenes.');
        }

        return pScene;
    }

    /*  COLLADA ANIMATIONS
     * -------------------------------------------------------
     */

    function COLLADAAnimationSampler (pXML) {
        'use strict';
        
        var pSampler = {
            pInput: {},
            id: attr(pXML, 'id')
        };

        link(pSampler);

        var pInput;
        eachByTag(pXML, 'input', function (pXMLData) {
            var sSemantic = attr(pXMLData, 'semantic');
            switch (sSemantic) {
                case 'INPUT':
                case 'OUTPUT':
                case 'INTERPOLATION':
                    case 'IN_TANGENT':
                case 'OUT_TANGENT':
                    pInput = COLLADAInput(pXMLData);
                    pSampler.pInput[sSemantic] = pInput;
                    prepareInput(pInput);

                    break;
                default:
                    debug_error('semantics are different from OUTPUT/INTERPOLATION/IN_TANGENT/OUT_TANGENT is not supported in the <sampler /> tag');
            }
        });

        return pSampler;
    }

    function COLLADAAnimationChannel (pXML) {
        'use strict';
        
        var pChannel = {
            pSource: source(attr(pXML, 'source')),
            pTarget: null
        };

        pChannel.pTarget = target(attr(pXML, 'target'));
        
        if (!pChannel.pTarget || !pChannel.pTarget.pObject) {
            warning('cound not setup animation channel for <' + attr(pXML, 'target') + '>');
            return null;
        }
        
        return pChannel;
    }

    function COLLADAAnimation (pXML) {
        'use strict';
        
        var pAnimation = {
            pSource:   [],
            pSampler: [],
            pChannel: [],
            id: attr(pXML, 'id'),
            name: attr(pXML, 'name'),
            pAnimations: []
        };

        var pChannel;
        var pSubAnimation;

        link(pAnimation);

        eachChild(pXML, function (pXMLData, sName) {
            switch (sName) {
                case 'source':
                    pAnimation.pSource.push(COLLADASource(pXMLData));
                    break;
                case 'sampler':
                    pAnimation.pSampler.push(COLLADAAnimationSampler(pXMLData));
                    break;
                case 'channel':
                    pChannel = COLLADAAnimationChannel(pXMLData);

                    if (pChannel) {
                        //this guard for skipping channels with unknown targets
                        pAnimation.pChannel.push(pChannel);
                    }

                    break;
                case 'animation':
                    pSubAnimation = COLLADAAnimation(pXMLData);
                    if (pSubAnimation) {
                        pAnimation.pAnimations.push(pSubAnimation);
                    }
            }
        });

        if (pAnimation.pChannel.length == 0 && pAnimation.pAnimations.length == 0) {
            warning('animation with id "' + pAnimation.id + '" skipped, because channels/sub animation are empty');
            return null;
        }

        return pAnimation;
    }


    //================================================================
    // BUILD ENGINE OBJECTS
    //================================================================
    
    function buildAnimationTrack (pChannel) {
        'use strict';
    
        var sNodeId = pChannel.pTarget.pSource.id;
        var sJoint = source(sNodeId).sid;
        var pTrack = null;
        var pSampler = pChannel.pSource;

        debug_assert(pSampler, 'could not find sampler for animation channel');
        
        var pInput          = pSampler.pInput['INPUT'];
        var pOutput         = pSampler.pInput['OUTPUT'];
        var pInterpolation  = pSampler.pInput['INTERPOLATION'];
        
        var pTimeMarks      = pInput.pArray;
        var pOutputValues   = pOutput.pArray;

        var pTransform = pChannel.pTarget.pObject
        var sTransform = pTransform.sName;
        var v4f;
        var pValue;
        var nMatrices;

        // if (sJoint == null) {
        //     warning('node\'s <' + pChannel.pTarget.pSource.id + '> "sid" attribute is null');
        // }

        switch (sTransform) {
            case 'translate':
                // pTrack = new a.AnimationTranslation(sJoint);
                
                // for (var i = 0, v3f = new Array(3), n; i < pTimeMarks.length; ++ i) {
                //     n = i * 3;
                //     v3f.X = pOutputValues[i * 3];
                //     v3f.Y = pOutputValues[i * 3 + 1];
                //     v3f.Z = pOutputValues[i * 3 + 2];
                //     pTrack.keyFrame(pTimeMarks[i], [v3f.X, v3f.Y, v3f.Z]);
                // };
                TODO('implement animation translation');
                //TODO: implement animation translation
                break;
            case 'rotate':
                // v4f = pTransform.pValue;
                // pTrack = new a.AnimationRotation(sJoint, [v4f[1], v4f[2], v4f[3]]);
                
                // debug_assert(pOutput.pAccessor.iStride === 1, 
                //     'matrix modification supported only for one parameter modification');
                
                // for (var i = 0; i < pTimeMarks.length; ++ i) {
                //     pTrack.keyFrame(pTimeMarks[i], pOutputValues[i] / 180.0 * Math.PI);
                // };
                TODO('implement animation rotation');
                //TODO: implement animation rotation
                break;
            case 'matrix':
                pValue = pChannel.pTarget.pValue;
                if (pValue === null) {
                    pTrack = new a.AnimationTransformation(sJoint);
                    nMatrices = pOutputValues.length / 16;
                    pOutputValues = new Float32Array(pOutputValues);

                    debug_assert(nMatrices % 1 === 0.0, 
                        'incorrect output length of transformation data (' + pOutputValues.length + ')');

                    for (var i = 0; i < nMatrices; i ++) {
                        pTrack.keyFrame(pTimeMarks[i], 
                            (new Mat4(pOutputValues.subarray(i * 16, i * 16 + 16), true)).transpose()); 
                    };

                    // i=0;
                    // var m = (new Mat4(pOutputValues.subarray(i * 16, i * 16 + 16), true));
                    // trace(sFilename,sNodeId,m.toString());
                }
                else {
                    pTrack = new a.AnimationMatrixModification(sJoint, pValue);

                    for (var i = 0; i < pTimeMarks.length; ++ i) {
                        pTrack.keyFrame(pTimeMarks[i], pOutputValues[i]);
                    }   
                }
            break;
            default:
                debug_error('unsupported animation typed founeed: ' + sTransform);
        }

        if (pTrack) {
            pTrack.nodeName = sNodeId;
        }

        return pTrack;
    }

    function buildAnimationTrackList (pAnimationData) {
        'use strict';
  
        var pSubAnimations = pAnimationData.pAnimations;
        var pSubTracks;
        var pTrackList = [];
        var pTrack;
        var pChannels = pAnimationData.pChannel;

        for (var i = 0; i < pChannels.length; ++ i) {
             pTrack = buildAnimationTrack(pChannels[i]);
             pTrackList.push(pTrack);
        }
        

        if (pSubAnimations) {
            for (var i = 0; i < pSubAnimations.length; ++ i) {
                pSubTracks = buildAnimationTrackList(pSubAnimations[i]);
                pTrackList = pTrackList.concat(pSubTracks);
            }
        }

        return pTrackList;
    }

    function buildAnimation (pAnimationData) {
        'use strict';

        var pTracks = buildAnimationTrackList(pAnimationData);
        var sAnimation = pAnimationData.length? pAnimationData[0].name:  null;
        var pAnimation = new a.Animation(sAnimation || sBasename);

        for (var i = 0; i < pTracks.length; i++) {
            pAnimation.push(pTracks[i]);
        };
        
        return pAnimation;
    }

    //pAnimations -- список анимаций
    function buildAnimations (pAnimations, pAnimationsList) {
        'use strict';

        if (!pAnimations) {
            return null;
        }

        pAnimationsList = pAnimationsList || [];

        for (var i in pAnimations) {
            var pAnimation = buildAnimation(pAnimations[i]);

            pAnimationsList.push(pAnimation);
            
            if (pModelResource && useAnimation) {
                pModelResource.addAnimation(pAnimation);
            }
        };

        return pAnimationsList;
    }

    function buildAssetTransform (pNode, pAsset) {
        'use strict';
        
        if (pAsset) {
            var fUnit = pAsset.pUnit.fMeter;
            var sUPaxis = pAsset.sUPaxis;
            
            pNode.setScale(fUnit);

            if (sUPaxis.toUpperCase() == 'Z_UP') {
                //pNode.addRelRotation([1, 0, 0], -.5 * Math.PI);
                pNode.addRelRotation(0, -.5 * Math.PI, 0);
            }
        }

        return pNode;
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
                
                //if (pSubMesh.surfaceMaterial.findResourceName() === sMaterial) {
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
 
                        var sInputSemantics     = pInputs[pTextureObject.sParam].sInputSemantic;
                        var pColladaImage       = pTextureObject.pTexture;
                        var pSurfaceMaterial    = pSubMesh.surfaceMaterial;

                        var pTexture = pEngine.displayManager().texturePool().loadResource(
                                                    pColladaImage.pImage.sImagePath);
                        
                        var pMatches    = sInputSemantics.match(/^(.*?\w)(\d+)$/i);
                        var iTexCoord   = (pMatches? pMatches[2]: 0);
                        var iTexture    = __ENUM__(SURFACEMATERIAL_TEXTURES)[c.toUpperCase()];

                        if (iTexture === undefined) {
                            continue;
                        }

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

        var pMeshList = pCache['@mesh'];
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
            a.Mesh.VB_READABLE, //|a.Mesh.RD_ADVANCED_INDEX,  //0,//
            sMeshName,
            sharedBuffer());    //shared buffer, if supported

        var pPolyGroup = pNodeData.pPolygons;
        var pMeshData = pMesh.data;
        
        //creating subsets
        for (var i = 0; i < pPolyGroup.length; ++ i) {
            pMesh.createSubset('submesh-' + i, useWireframe? a.PRIMTYPE.LINELIST: pPolyGroup[i].eType);
        }

        //filling data
        for (var i = 0, pUsedSemantics = {}; i < pPolyGroup.length; ++ i) {
            var pPolygons = pPolyGroup[i];

            for (var j = 0; j < pPolygons.pInput.length; ++ j) {
                var pInput = pPolygons.pInput[j];
                var sSemantic = pInput.sSemantic;
                var pData = pInput.pArray;
                var pDecl, pDataExt;
           
                //if (pMesh.buffer.getDataLocation(sSemantic) < 0) {
                if (!pUsedSemantics[sSemantic]) {
                    pUsedSemantics[sSemantic] = true;
                    
                    switch (sSemantic) {
                        case a.DECLUSAGE.POSITION:
                        case a.DECLUSAGE.NORMAL:
                            /*
                                Extend POSITION and NORMAL from {x,y,z} --> {x,y,z,w};
                             */

                            pDataExt = new Float32Array(pData.length / 3 * 4);

                            for (var y = 0, n = m = 0, l = pData.length / 3; y < l; y ++, n++) {
                                pDataExt[n ++] = pData[m ++];
                                pDataExt[n ++] = pData[m ++];
                                pDataExt[n ++] = pData[m ++];
                            };

                            pData = pDataExt;
                            pDecl = [VE_FLOAT3(sSemantic), VE_END(16)];
                            break;
                        case a.DECLUSAGE.TEXCOORD:
                        case a.DECLUSAGE.TEXCOORD1:
                        case a.DECLUSAGE.TEXCOORD2:
                        case a.DECLUSAGE.TEXCOORD3:
                        case a.DECLUSAGE.TEXCOORD4:
                        case a.DECLUSAGE.TEXCOORD5:
                            pDecl = [VE_CUSTOM(sSemantic, a.DTYPE.FLOAT, pInput.pAccessor.iStride)];
                            break;
                        default:
                            error('unsupported semantics used: ' + sSemantic);
                    }

                    pMeshData.allocateData(pDecl, pData);
                    // trace('data location for ', sSemantic, ':', 
                    //    pMeshData.allocateData(pDecl, pData)
                    //    );
                }
            }
        }

        //trace('data filled:', a.now() - iBegin, 'ms');


        //add indices to data
        for (var i = 0; i < pPolyGroup.length; ++ i) {
            //trace('indices for submesh: ', i);
            var pPolygons = pPolyGroup[i];
            var pSubMesh = pMesh.getSubset(i);
            var pSubMeshData = pSubMesh.data;
            var pDecl = new Array(pPolygons.pInput.length);
            var iIndex = 0;
            var pSurfaceMaterial = null;
            var pSurfacePool = null;

            for (var j = 0; j < pPolygons.pInput.length; ++ j) {
                pDecl[j] = VE_FLOAT(a.DECLUSAGE.INDEX + (iIndex ++));
            }

            pSubMeshData.allocateIndex(pDecl, new Float32Array(pPolygons.p));

            for (var j = 0; j < pDecl.length; ++ j) {
                var sSemantic = pPolygons.pInput[j].sSemantic;
                //trace('index for data ', sSemantic, ' with location: ', pSubMeshData.getDataLocation(sSemantic));
                pSubMeshData.index(sSemantic, pDecl[j].eUsage);
            }

            // if (!pSubMesh.material) {
            //     pSurfacePool = pEngine.displayManager().surfaceMaterialPool();
            //     pSurfaceMaterial = pSurfacePool.findResource(pPolygons.sMaterial);

            //     if (!pSurfaceMaterial) {
            //         pSurfaceMaterial = pSurfacePool.createResource(pPolygons.sMaterial);
            //     }

            //     pSubMesh.surfaceMaterial = pSurfaceMaterial;
            // }
            pSubMesh.material.name = pPolygons.sMaterial;
        }

        pMesh.addFlexMaterial('default');
        pMesh.setFlexMaterial('default');

        //trace('indices added:', a.now() - iBegin, 'ms');
        //trace('--- complete ---');

        // trace('loaded mesh<', sMeshName,'>:');
        // for (var i = 0; i < pMesh.length; ++i) {
        //     trace('\tsubmesh<', pMesh[i].name,'>:', pMesh[i].data.getPrimitiveCount(), 'polygons');
        //     //trace(pMesh[i].data.toString());
        // }

        //adding all data to cahce data
        pMeshList[sMeshName] = pMesh;
        
        sharedBuffer(pMesh.buffer);

        return buildMaterials(pMesh, pMeshNode);
    };

    function buildSkeleton (pSkeletonsList) {
        var pSkeleton = null;

        pSkeleton = new a.Skeleton(pEngine, pSkeletonsList[0]); 

        for (var i = 0; i < pSkeletonsList.length; ++ i) {
            pSkeleton.addRootJoint(source(pSkeletonsList[i]).pConstructedNode);
        }

        if (pModelResource && useScene) {
            pModelResource.addSkeleton(pSkeleton);
        }

        return pSkeleton;
    }

    function buildSkinMesh (pSkinMeshNode) {
        'use strict';

        var pController         = pSkinMeshNode.pController;
        var pMaterials          = pSkinMeshNode.pMaterials;

        var pSkinData           = pController.pSkin;
        
        //skin data
        var pBoneList           = pSkinData.pJoints.pInput['JOINT'].pArray;
        var pBoneOffsetMatrices = pSkinData.pJoints.pInput['INV_BIND_MATRIX'].pArray;
        var pGeometry           = pSkinData.pGeometry;
        var m4fBindMatrix       = pSkinData.m4fShapeMatrix;
        var pVertexWeights      = pSkinData.pVertexWeights;

        var pMesh;
        var pSkeleton;
        var pSkin;
    
        pSkeleton = buildSkeleton(pSkinMeshNode.pSkeleton);
        pMesh     = buildMesh({pGeometry: pGeometry, pMaterials: pMaterials});

        pSkin = new a.Skin(pMesh);
        pSkin.setBindMatrix(m4fBindMatrix);
        pSkin.setBoneNames(pBoneList);
        pSkin.setBoneOffsetMatrices(pBoneOffsetMatrices);
        pSkin.setSkeleton(pSkeleton);
        
        if (!pSkin.setVertexWeights(
            new Float32Array(pVertexWeights.pVcount), 
            new Float32Array(pVertexWeights.pV), 
            new Float32Array(pVertexWeights.pWeightInput.pArray))) {
            error('cannot set vertex weight info to skin');
        }

        pMesh.setSkin(pSkin);
        pMesh.setSkeleton(pSkeleton);

        pSkeleton.attachMesh(pMesh);

        return pMesh;
    }

    function buildInstance(pInstances, fnBuilder, pSceneNode, bAttach) {
        bAttach = bAttach || false;

        var pInstance = null;
        var pInstanceList = [];

        for (var m = 0; m < pInstances.length; ++ m) {
            pInstance = fnBuilder(pInstances[m]);
            pInstanceList.push(pInstance);

            debug_assert(pInstance, 'cannot find instance <' + pInstances[m].sUrl + '>\'s data');

            if (pModelResource && useScene) {
                pModelResource.addMesh(pInstance);
            }

            if (bAttach) {
                pSceneNode.addMesh(pInstance);  
            }
        }

        return pInstanceList;
    }

    function buildMeshes (pSceneRoot) {
        var pMeshes = [];

        findNode(pSceneRoot.pNodes, null, function (pNode) {
            var pModelNode = pNode.pConstructedNode;
            
            if (pNode.pController.length == 0 && pNode.pGeometry.length == 0) {
                return;
            }

            if (!(pModelNode instanceof a.SceneModel)) {
                pModelNode = new a.SceneModel(pEngine);
                pModelNode.name = ".joint-to-model-link-" + a.sid();
                pModelNode.create();
                pModelNode.attachToParent(pNode.pConstructedNode);
            }

            pMeshes.insert(buildInstance(pNode.pController, buildSkinMesh, pModelNode, false));
            pMeshes.insert(buildInstance(pNode.pGeometry, buildMesh, pModelNode, true));
        });

        return pMeshes;
    }


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


    /**
     * Build SceneNode (Node with visual objects)
     */
    

    function buildSceneNode (pNode) {
        var pSceneNode = pNode.pConstructedNode;
        var pController, 
            pGeometry;

        if (!pSceneNode) {
            if (pNode.pController.length || pNode.pGeometry.length) {
                pSceneNode = new a.SceneModel(pEngine);
            }
            else {
                pSceneNode = new a.SceneNode(pEngine);
            }

            pSceneNode.create();
        }

        return pSceneNode;
    }

    function buildJointNode (pNode) {
        var pJointNode = pNode.pConstructedNode;
        var sJointSid = pNode.sid;
        var sJointName = pNode.id;
        var pSkeleton;

        if (!pJointNode) {
            pJointNode = new a.Joint(pEngine);
            pJointNode.create();
            pJointNode.boneName = sJointSid;
            
Ifdef (__DEBUG);
    if (bDrawJoints) {
            //draw joints
            var pSceneNode = pEngine.appendMesh(
                pEngine.pCubeMesh.clone(a.Mesh.GEOMETRY_ONLY|a.Mesh.SHARED_GEOMETRY),
                pJointNode);
            pSceneNode.name = sJointName + '[joint]';
            pSceneNode.setScale(0.02);
    }
Endif ();

        }

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
            
            pHierarchyNode.setName(pNode.id || pNode.sName);
            pHierarchyNode.setInheritance(a.Scene.k_inheritAll);
            pHierarchyNode.attachToParent(pParentNode)

            //cache already constructed nodes
            pNode.pConstructedNode = pHierarchyNode;

            m4fLocalMatrix = pHierarchyNode.accessLocalMatrix();
            m4fLocalMatrix.set(pNode.m4fTransform);

            if (pHierarchyNode.name === "node-Bip001_Pelvis" || pHierarchyNode.name === "node-Bip001") {
                trace(pHierarchyNode.localMatrix().toQuat4().toYawPitchRoll(Vec3()).toString(), '[' + pHierarchyNode.name + ' / ' + sBasename + ']');
            }

            buildNodes(pNode.pChildNodes, pHierarchyNode);
        }

        return pHierarchyNode;
    }

    function buildInititalPose (pNodes, pSkeleton) {
        var sPose = 'Pose-' + sBasename + '-' + pSkeleton.name;
        var pPose = new a.Animation(sPose);
        var pNodeList = pSkeleton.getNodeList();
        var pNodeMap = {};
        var pTrack;

        for (var i = 0; i < pNodeList.length; ++ i) {
            pNodeMap[pNodeList[i].name] = pNodeList[i];
        }

        findNode(pNodes, null, function (pNode) {
            var sJoint = pNode.sid;
            var sNodeId = pNode.id;

            if (!pNodeMap[sNodeId]) {
                return;
            }

            pTrack = new a.AnimationTrack(sJoint);
            pTrack.nodeName = sNodeId;
            pTrack.keyFrame(0.0, pNode.m4fTransform);

            pPose.push(pTrack);
        });

        if (pModelResource && bExtractInitialPoses) {
            pModelResource.addAnimation(pPose);
        }

        return pPose;
    }

    function buildInitialPoses (pSceneRoot, pPoseSkeletons) {
        var pSkeleton;
        var pPoses = [];

        for (var i = 0; i < pPoseSkeletons.length; ++ i) {
            pSkeleton = pPoseSkeletons[i];
            if (pSkeleton.name === "node-Bip001_Pelvis" || pSkeleton.name === "node-Bip001") {
                trace('skipping <node-Bip001_Pelvis> skeletom ...', '[' + sBasename + ']');

                trace(pSkeleton.getNodeList()[0].localMatrix().toQuat4().toYawPitchRoll(Vec3()).toString());

                continue;
            }
            pPoses.push(buildInititalPose(pSceneRoot.pNodes, pSkeleton));
        }

        return pPoses;
    }

    function buildScene (pSceneRoot, pAsset) {
        var pNodes = [];
        var pNode = null;

        for (var i = 0; i < pSceneRoot.pNodes.length; i++) {
            pNode = pSceneRoot.pNodes[i];
            pNodes.push(buildNodes([pNode], null));
        }

        for (var i = 0; i < pNodes.length; i++) {
            pNodes[i] = buildAssetTransform(pNodes[i], pAsset);

            if (pModelResource && useScene) {
                pModelResource.addNode(pNodes[i]);
            }
        };

        return pNodes;
    };

    function readLibraries(pXMLCollada, pTemplate, ppLibraries) {
        ppLibraries = ppLibraries || pLib;
        for (var i = 0; i < pTemplate.length; i++) {
            ppLibraries[pTemplate[i].sLib] =
                COLLADALibrary(firstChild(pXMLCollada, pTemplate[i].sLib), pTemplate[i].sElement, pTemplate[i].fn);
        }
    }

    function readCollada(sXMLData) {
        'use strict';
        
        var pParser = new DOMParser();
        var pXMLRootNode = pParser.parseFromString(sXMLData, "application/xml");
        var pXMLCollada = pXMLRootNode.getElementsByTagName('COLLADA')[0];

        var pAsset;
        var m4fRootTransform;
        var pSceneRoot;
        var pSkeletons, pSkeleton;
        var pPoses;

        var pSceneOutput = null;
        var pAnimationOutput = null;
        var pMeshOutput = null;
        var pInitialPosesOutput = null;

        
        readLibraries(pXMLCollada, pSceneTemplate);

        pAsset      = COLLADAAsset(firstChild(pXMLCollada, 'asset'));
        pSceneRoot  = COLLADAScene(firstChild(pXMLCollada, 'scene'));

        if (pSceneRoot && useScene) {
            pSceneOutput        = buildScene(pSceneRoot, pAsset);
            pMeshOutput         = buildMeshes(pSceneRoot);
        }
        

        if (useAnimation) {
            readLibraries(pXMLCollada, pAnimationTemplate);

            if (pLib['library_animations']) {
                pAnimationOutput = buildAnimations(pLib['library_animations'].animation);
            }
        }

        if (bExtractInitialPoses) {
            pInitialPosesOutput = buildInitialPoses(pSceneRoot, pPoseSkeletons); 
        }
        
        //дополним анимации начальными позициями костей
        if (useAnimation && bAnimationWithPose) {
            pSkeletons = pPoseSkeletons || [];

            // if (pMeshOutput) {
            //     for (var i = 0; i < pMeshOutput.length; ++ i) {
            //         pSkeleton = pMeshOutput[i].skeleton;
            //         pSkeletons.push(pSkeleton);
            //     }
            // }
            // else {
            //     if (!pSceneOutput) {
            //         buildScene(pSceneRoot, pAsset);
            //     }

            //     eachByTag(pXMLCollada, 'skeleton', function (pXML) {
            //         pSkeleton = buildSkeleton([stringData(pXML)]);
            //         pSkeletons.push(pSkeleton);
            //     });
            // }

            pPoses = buildInitialPoses(pSceneRoot, pSkeletons);

            for (var i = 0; i < pAnimationOutput.length; ++ i) {
                for (var j = 0; j < pPoses.length; ++ j) {
                    pAnimationOutput[i].extend(pPoses[j]);
                }
            }
        }

        if (fnCallback) {
            fnCallback.call(pEngine, pSceneOutput, pMeshOutput, pAnimationOutput, pInitialPosesOutput);
        }
    }

    if (sFilename) {
        a.fopen(sFilename).read(readCollada);
        return true;
    }
    else if (sContent) {
        readCollada(sContent);
        return true;
    }

    return false;
}

a.COLLADA = COLLADA;

