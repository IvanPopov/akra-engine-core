/**
 * @file
 * @author Ivan Popov
 * @email <vantuziast@odserve.org>
 */

/**
 * Класс для создания шейдеров из текстовых фрагментов.
 * @ctor
 * Constructor.
 */
function ShaderPrecompiler () {

    Enum([
             SECTION_UNKNOWN,
             SECTION_DECL,
             SECTION_GLOBAL,
             SECTION_MAIN
         ], SHADER_SECTIONS, a.ShaderPrecompiler);
}

/**
 * @private
 * Правила синтакса.
 */
ShaderPrecompiler._pSyntax = {

    constantWord: 'var',
    constant:     {
        comment: 'comment',
        min:     'min',
        max:     'max',
        def:     'default',
        step:    'step'
    },

    flagWord: 'flag',
    flag:     {
        comment: 'comment'
    },

    typeWord: 'type',
    type:     {
        vertex:   'vertex',
        pixel:    'pixel',
        fragment: 'fragment'
    },

    section: {
        global: 'global',
        decl:   'declaration',
        main:   'main'
    },

    specComment: '//--',

    namedSectionExp:      function (sName) {
        return new RegExp("\\/\\/\\-\\-\\s*" + sName);
    },
    rulesExp:             /[\n\r]{1}.*\/\/\-\-.+?(?=\/\/|\n|\r|$)|\/\/\-\-.+?(?=\/\/|\n|\r|$)|\/\*\-\-[\s\S]+?\*\//g,
    descriptionsExp:      /[\b\t\n\r]*\/\*.*/g,
    semanticsExp:         /\/\/\-\-.+?(?=\/\/|\n|\r|$)|\/\*\-\-[\s\S]+?\*\//g,
    propertyExp:          /^\s*([a-zA-Z]+)[\s]*.*$/,
    constExp:             /^\s*([a-zA-Z]+)\s+([a-zA-Z0-9\_]+)\s+([a-zA-Z0-9]+)\s*$/,
    typeExp:              /^\s*([a-zA-Z]+)\s+(vertex|pixel|fragment)\s*$/,
    flagExp:              /^\s*([a-zA-Z]+)\s+([a-zA-Z0-9\_]+)(.*)\s*$/,
    flagValuesExp:        /([a-zA-Z0-9\.\-\|]+)/g,
    flagValueExp:         /^([0-9\.\-]+)(\|([a-zA-Z\_0-9]*))?$/,
    sectionExp:           /^\s*\/\/\-\-\s*([a-zA-Z]+)\s*$/,
    ruleNameExp:          /^\s*\\([a-zA-Z]+)\s*(.*)$/,
    framedStringExp:      /^\s*{(.*)}$/,
    singleStructExp:      /\}\s*(\$[\w]+)\s*(\[(\d+)\])?\s*\;/i,
    isVarDeclExp:         /\w[\w\d]+\s+\w[\w\d]*\s*(\[\d+\])?\s*\;/gi,
    varDeclExp:           /(\w[\w\d]+)\s+(\w[\w\d]*)\s*(\[(\d+)\])?\s*\;/,
    uniformDeclExp:       /^\s*uniform.*$/,
    attrDeclExp:          /^[\s]*attribute.*$/,
    semanticsDataExp:     /^\s*([^\s]+)\s*$/,
    beforeSemicolonExp:   /^([^;\s]*).*$/,
    uniformTypeExp:       /^\s*uniform[\s]*([^\s]+).*$/,
    attrTypeExp:          /^[\s]*attribute[\s]*([^\s]+).*$/,
    isVariableHasSizeExp: /^([^\[]+)\[.+\]$/,
    variableSizeExp:      /\[\s*([\d]+)\s*\]/,
    indexerExp:           /\@(\@?)\s*([\w\$][\w\d]*)\s*\(\s*(\$?\w[\w\.\d]*)\s*\,\s*(\$?\w[\w\.\d]*)\s*\);?/g
};

/**
 * Заполнение шейдера данными из тектового фрагмента.
 *
 * @tparam Shader pShader Объект шейдера для заполнения.
 * @tparam String sSource Тектовое представление фрагмента.
 * @tpraram Enumeration(SHADER_TYPES) Тип фрагмента.
 * @treturn Boolean Результат выполнения.
 */
ShaderPrecompiler.extract = function (pShader, sSource, eType) {
    var i, j, n, tmp;

    var eSection = a.ShaderFragment.CODE_UNKNOWN;

    var pSyntax = ShaderPrecompiler._pSyntax;

    var fnGetRule = function (str) {
        return sSource.match(pSyntax.namedSectionExp(str));
    };


    var pFrag = new a.ShaderFragment(eType);

    if (eType == a.Shader.VERTEX) {
        pShader.vertex = pFrag;
    }
    else if (eType == a.Shader.PIXEL) {
        pShader.pixel = pFrag;
    }

    //строки содержащие <//-- &> </*--- ----*/> правила.
    var pRules = sSource.match(pSyntax.rulesExp);

    if (!pRules) {
        warning('Отсутствует разметка шейдера.');
        return false;
    }


    var fnCleanCode = function (sData) {
        return sData.replace(pSyntax.semanticsExp, '');
    }


    function isEmpty (pValue) {
        return ( pValue === "" || pValue === 0 || pValue === "0" ||
            pValue === null ||
            pValue === false || ( (pValue instanceof Array) &&
            pValue.length === 0 ) );
    }

    function fromframedStringExp (str) {
        var pMatch = str.match(pSyntax.framedStringExp);
        if (!pMatch) {
            return str;
        }
        return pMatch[1];
    }

    var pCur = null;
    var mainRule = fnGetRule(pSyntax.section.main),
        declRule = fnGetRule(pSyntax.section.decl),
        globRule = fnGetRule(pSyntax.section.global);


    for (i = 0; i < pRules.length; ++i) {
        if (pRules[i].match(pSyntax.descriptionsExp)) {

            var pLines = pRules[i].split('\n'), sLine;

            for (n = 0; n < pLines.length; ++n) {
                var pMatches;
                if (!(pMatches = pLines[n].match(/^\s*\;(.*)$/))) {
                    continue;
                }

                //if ((pLines[n].charAt(0)) != ";") continue;


                sLine = pMatches[1];//pLines[n].substr(1, pLines[n].length);

                //Загружаем имя програмы
                if (!pShader.name && sLine.charAt(0) == ';') {
                    pShader.name = sLine.substr(1);
                }

                //загружаем настройки
                var pProperty = sLine.match(pSyntax.propertyExp);
                if (!isEmpty(pProperty)) {

                    var sType = String(pProperty[1]).toLowerCase();

                    if (sType == pSyntax.constantWord) {
                        pProperty = sLine.match(pSyntax.constExp);

                        if (pProperty.length < 4) {
                            error('Неверное объявление константы.');
                            return false;
                        }

                        pCur = new a.ShaderConstant;
                        a.ShaderPrecompiler = ShaderPrecompiler;
                        pFrag.addConstant(pCur);

                        pCur.name = pProperty[2];
                        pCur.type = pProperty[3];
                    }
                    else if (sType == pSyntax.flagWord) {
                        pProperty = sLine.match(pSyntax.flagExp);

                        if (isEmpty(pProperty)) {
                            error('Неверный синтаксис флага.');
                            return false;
                        }

                        pCur = new a.ShaderFlag;
                        pFrag.addFlag(pCur);

                        pCur.name = pProperty[2];

                        if (pProperty[3]) {
                            pProperty = pProperty[3].match(pSyntax.flagValuesExp);

                            for (j = 0; j < pProperty.length; ++j) {
                                var pFlagValue =
                                    pProperty[j].match(pSyntax.flagValueExp);

                                if (!isEmpty(pFlagValue)) {
                                    pCur.addValue(pFlagValue[1], pFlagValue[3]);
                                }
                            }

                        }
                    }
                    else if (sType == pSyntax.typeWord) {
                        /*
                         pProperty = sLine.match(pSyntax.typeExp);

                         if (isEmpty(pProperty))
                         error('Данный тип шейдера не поддерживается.');

                         var sShaderType = pProperty[2];


                         if (sShaderType == pSyntax.type.vertex) {
                         pFrag.type = a.Shader.VERTEX;
                         eShader = a.Shader.VERTEX;

                         debug_assert(!pShader.vertex, "Вершинный шейдер" +
                         " уже определен.");
                         pShader.vertex = pFrag;
                         }
                         else {
                         pFrag.type = a.Shader.PIXEL;
                         eShader = a.Shader.PIXEL;

                         debug_assert(!pShader.pixel, "Пиксельный шейдер" +
                         " уже определен.");
                         pShader.pixel = pFrag;
                         }
                         */
                    }
                    else {
                        error(sType + " не поддерживается!");
                        return false;
                    }
                }
                else if (pCur instanceof a.ShaderConstant) {
                    pProperty = sLine.match(pSyntax.ruleNameExp);

                    if (isEmpty(pProperty) || isEmpty(pProperty[1])) {
                        error('Неверный формат свойства константы.');
                        return false;
                    }

                    var sValue = pProperty[2];
                    switch (pProperty[1]) {
                        case pSyntax.constant.comment:
                            pCur.comment = fromframedStringExp(sValue);
                            break;
                        case pSyntax.constant.def:
                            pCur.def = sValue;
                            break;
                        case pSyntax.constant.max:
                            pCur.max = sValue;
                            break;
                        case pSyntax.constant.min:
                            pCur.min = sValue;
                            break;
                        case pSyntax.constant.step:
                            pCur.step = sValue;
                            break;
                        default:
                            error('Свойство константы: "' + pProperty[1] +
                                      '" не подерживается.');
                            return false;
                    }

                }
                else if (pCur instanceof a.ShaderFlag) {
                    pProperty = sLine.match(pSyntax.ruleNameExp);

                    if (isEmpty(pProperty) || isEmpty(pProperty[1])) {
                        error('Неверный формат свойства флага.');
                    }


                    switch (pProperty[1]) {
                        case pSyntax.flag.comment:
                            pCur.comment = fromframedStringExp(pProperty[2]);
                            break;
                        default:
                            error('Свойство флага: "' + pProperty[1] +
                                      '" не подерживается.');
                            return false;
                    }
                }


            }
        }

        if (!isEmpty(tmp = pRules[i].match(pSyntax.sectionExp))) {

            var sSection = tmp[1];
            var nFrom, nTo;

            nFrom = sSource.indexOf(pRules[i]) + pRules[i].length;

            switch (sSection) {
                case pSyntax.section.decl:
                    eSection = a.ShaderFragment.CODE_DECL;
                    nTo = sSource.indexOf(mainRule);
                    break;
                case pSyntax.section.global:
                    eSection = a.ShaderFragment.CODE_GLOBAL;
                    nTo = sSource.indexOf(declRule);
                    nTo = (nTo >= 0 ? nTo : sSource.indexOf(mainRule));
                    break;
                case pSyntax.section.main:
                    eSection = a.ShaderFragment.CODE_MAIN;
                    nTo = sSource.length;
                    break;
            }

            pFrag.code[eSection] = fnCleanCode(sSource.substr(nFrom, nTo - nFrom));

            //console.log(' --------[ ' + sSection + ' ]----------------');
            //console.log(pFrag.code[eSection]);

        }

        if (eSection == a.ShaderFragment.CODE_DECL) {

            //юниформы с типом структура
            if (!isEmpty(tmp = pRules[i].match(pSyntax.singleStructExp))) {
                var sUStructName = tmp[1];
                var sUStructSize = (tmp[2] ? parseInt(tmp[3]) : 0);
                var sCode = pFrag.declCode;
                var n = sCode.indexOf(sUStructName), e = n, nScopes = 0;
                var c = null;
                var canQuit = 0;

                while (!(e < 0)) {
                    e--;
                    c = sCode[e];
                    if (c == '{') {
                        nScopes--;
                    }
                    if (c == '}') {
                        nScopes++, canQuit = 1;
                    }
                    if (canQuit && !nScopes) {
                        break;
                    }
                }

                var sStruct = sCode.substr(e + 1, n - e - 3);
                var pUniform = ShaderPrecompiler._buildStructVar(sUStructName,
                                                                 sUStructSize, sStruct, a.ShaderUniform);


                var iPos = pRules[i].indexOf(pSyntax.specComment);
                var sSemantics = pRules[i].substr(iPos + 4, pRules[i].length);

                pUniform.name = sSemantics.match(pSyntax.semanticsDataExp)[1];

                pFrag.addUniform(pUniform);
            }

            if (!isEmpty(pRules[i].match(pSyntax.uniformDeclExp))) {
                var iPos = pRules[i].indexOf(pSyntax.specComment);
                var sSemantics = pRules[i].substr(iPos + 4, pRules[i].length);

                var iPos2 = pRules[i].indexOf('$');
                var sUName = pRules[i].substr(iPos2, iPos - iPos2)
                    .match(pSyntax.beforeSemicolonExp)[1];
                var sUType = pRules[i].match(pSyntax.uniformTypeExp)[1];
                var sUSize = 0;

                var pUniform = new a.ShaderUniform;

                if (tmp = sUName.match(pSyntax.isVariableHasSizeExp)) {
                    sUSize = sUName.substr(tmp[1].length, sUName.length);
                    sUSize = sUName.match(pSyntax.variableSizeExp);
                    if (sUSize.length && sUSize.length > 0) {
                        sUSize = sUSize[1];
                    }
                    sUName = tmp[1];
                    sUSize = parseInt(sUSize);
                }

                pUniform.usage = sUName;
                pUniform.type = sUType;
                pUniform.size = sUSize;

                pUniform.name = sSemantics.match(pSyntax.semanticsDataExp)[1];


                pFrag.addUniform(pUniform);
            }

            if (!isEmpty(pRules[i].match(pSyntax.attrDeclExp))) {

                var iPos = pRules[i].indexOf(pSyntax.specComment);
                var sSemantics = pRules[i].substr(iPos + 4, pRules[i].length);

                var iPos2 = pRules[i].indexOf('$');
                var sAName = pRules[i].substr(iPos2, iPos - iPos2)
                    .match(pSyntax.beforeSemicolonExp)[1];
                var sAType = pRules[i].match(pSyntax.attrTypeExp)[1];

                var sASize = 0;

                var pAttr = new a.ShaderAttribute;

                if (tmp = sAName.match(pSyntax.isVariableHasSizeExp)) {
                    sASize = sAName.substr(tmp[1].length, sAName.length);
                    sASize = sAName.match(pSyntax.variableSizeExp);
                    if (sASize.length && sASize.length > 0) {
                        sASize = sASize[1];
                    }
                    sAName = tmp[1];
                    sASize = parseInt(sASize);
                }

                pAttr.usage = sAName;
                pAttr.type = sAType;
                pAttr.size = sASize;

                pAttr.name = sSemantics.match(pSyntax.semanticsDataExp)[1];

                pFrag.addAttr(pAttr);
            }
        }
    }


    var fnIndexer = function (str, sVarying, sVarName, sIndexerName, sAttr) {

        var sConst = '__' + sVarName + '_MI_';
        var dest = '#ifndef ' + sConst + '\n#define ' + sConst;
        dest += '\nvec4 ' + sVarName + ' = texture2D (' + sIndexerName +
            '.d, vec2(mod(' + sAttr + ', ' + sIndexerName + '.p.x)*' +
            sIndexerName + '.p.y, floor(' + sAttr + ' * ' + sIndexerName +
            '.p.y) * ' + sIndexerName + '.p.z));';
        dest += '\n#endif';

        if (sVarying) {
            dest += '\n#ifndef ' + sConst + 'v';
            dest += '\n#define ' + sConst + 'v';


            var sName = 'v' + sVarName;
            if (!pFrag.hasVarying(sName)) {
                var pVaryng = new a.ShaderVarying();
                pVaryng.name = 'v' + sVarName;
                pVaryng.type = 'vec4';
                pFrag.addVarying(pVaryng);
            }


            dest += '\nv' + sVarName + ' = ' + sVarName + ';';
            dest += '\n#endif';
        }
        return dest;
    }

    var pUniforms = pFrag.uniforms;
    var pAttrs = pFrag.attrs;
    var pCode = pFrag.code;
    //console.log(pCode);
    var fnVar2Semantics = function (pObj, sCode) {
        for (var n = 0, iLen = pObj.length; n < iLen; ++n) {
            tmp = pObj[n].name;
            sCode = sCode.split(pObj[n].usage).join(tmp);
        }
        return sCode;
    }


    for (i = 0; i < pCode.length; ++i) {
        //declaration code will never be used
        /* if (i == a.ShaderFragment.CODE_DECL) {
         pCode[i] = null;
         continue;
         }*/

        sCode = pCode[i];
        if (sCode) {
            if (i == a.ShaderFragment.CODE_MAIN && eType == a.Shader.VERTEX) {
                sCode = sCode.replace(pSyntax.indexerExp, fnIndexer);
            }
            sCode = fnVar2Semantics(pAttrs, sCode);
            sCode = fnVar2Semantics(pUniforms, sCode);
            pCode[i] = sCode;
        }
    }
    for (var n = 0, iLen = pAttrs.length; n < iLen; ++n) {
        delete pAttrs[n].usage;
    }
    for (var n = 0, iLen = pUniforms.length; n < iLen; ++n) {
        delete pUniforms[n].usage;
    }

    return true;
}

/**
 * Создание шейдера из текстовых представлений вершинного
 * и пиксельного фрагментов.
 *
 * @tparam Shader pShader Объект шейдера, который будет заполнятя.
 * @tparam String sVertex Вершинный шейдер.
 * @tparam String sPixel Пиксельный шейдер.
 * @treturn Boolean Результат выполнения.
 */
ShaderPrecompiler.create = function (pShader, sVertex, sPixel) {
    if (!ShaderPrecompiler.extract(pShader, sVertex, a.Shader.VERTEX) ||
        !ShaderPrecompiler.extract(pShader, sPixel, a.Shader.PIXEL)) {
        return false;
    }
    return true;
}

/**
 * @private
 * Создание шейдерной переменной типа структура по ее
 * текстовому представлению.
 *
 * @tparam String sName Имя переменной.
 * @tparam Int nSize Количество элементов. (0 - если это не массив)
 * @tparam String sContent Текстовое представление.
 * @pType * Тип переменной.
 */
ShaderPrecompiler._buildStructVar = function (sName, nSize, sContent, pType) {

    var pVar = new pType;
    var pSyntax = ShaderPrecompiler._pSyntax;
    var pDefs = sContent.match(pSyntax.isVarDeclExp);
    var pMatchResult, pMember;

    pVar.usage = sName;
    pVar.size = nSize;
    pVar.type = [];

    for (var key in pDefs) {
        pMatchResult = pDefs[key].match(pSyntax.varDeclExp);
        pMember = new pType;
        pMember.name = pMatchResult[2];
        pMember.type = pMatchResult[1];
        pMember.size = (pMatchResult[4] ? parseInt(pMatchResult[4]) : 0);
        pVar.type.push(pMember);
    }

    return pVar;
}

a.ShaderPrecompiler = ShaderPrecompiler;