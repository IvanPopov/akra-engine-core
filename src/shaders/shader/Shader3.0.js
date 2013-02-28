/**
 * @file
 * @author Ivan Popov
 * @email vantuziast@odserve.org
 */

/**
 * @enum
 */
Enum([VERTEX = 1, PIXEL, UNKNOWN = 0], SHADER_TYPES, a.Shader);
Enum([VERT = 0, PIXL], SHADER_SHORT_TYPES, a.Shader);
Enum([GLOB, DECL, MAIN], SHADER_DECLARATION_PARTS, a.Shader);
Enum([ATTR = 1, UNI, VARY], SHADER_VARIABLE_PARTS, a.Shader);


/**
 * Шейдерная переменная.
 * @ctor
 * Constructor.
 */
function ShaderParam () {

    /**
     * Тип переменной.
     * @private
     * @type ShaderParam
     */
    this._pType = null;
    ShaderParam.superclass.constructor.apply(this, arguments);
}

a.extend(ShaderParam, a.ParameterDesc);

ShaderParam.prototype.str = function (useName, useSemicolon) {
    useName = ifndef(useName, true);
    useSemicolon = ifndef(useSemicolon, true);

    var sName = (useName ? ' ' + this.sName : '');

    if (this.isBasic) {
        return this._pType + sName + (useSemicolon ? ';' : '');
    }

    var pType = this._pType;
    var str = 'struct {\n';
    for (var i = 0; i < pType.length; ++i) {
        str += pType[i].str() + '\n';
    }
    str += '}' + (useSemicolon ? ';' : '');
    return str;
}

ShaderParam.prototype.dump = function (pWriter) {
    pWriter = pWriter || new a.BinWriter();

    ShaderParam.superclass.dump.call(this, pWriter);

    var tmp = this._pType;
    if (!this.isBasic && tmp) {

        pWriter.uint16(tmp.length);
        for (var i = 0; i < tmp.length; ++i) {
            tmp[i].dump(pWriter);
        }
    }
    else {
        pWriter.string(tmp);
    }

    return pWriter;
}

ShaderParam.prototype.undump = function (pReader) {
    ShaderParam.superclass.undump.call(this, pReader);

    if (!this.isBasic) {
        this._pType = [];

        var n = pReader.uint16();
        var tmp = this._pType;
        for (var i = 0; i < n; ++i) {
            tmp[i] = (new a.ShaderParam()).undump(pReader);
        }
    }
    else {
        this._pType = pReader.string();
    }

    return this;
}

Object.defineProperty(ShaderParam.prototype, "code", {
    get: function () {
        return this._iBasic;
    }
});

Object.defineProperty(ShaderParam.prototype, "iStructMembers", {
    get: function () {
        return (!this.isBasic ? this._pType.length : 0);
    }
});
/*
 ShaderParam.prototype.isBasic = function () {
 return (typeof this._pType == 'string');
 };*/

Object.defineProperty(ShaderParam.prototype, "isBasic", {
    set: function () {
        error('You cannot set isBasic attribute for ShaderParam class.');
    },
    get: function () {
        return (this.eClass != a.ParameterDesc.Class.STRUCT);
    }
});

Object.defineProperty(ShaderParam.prototype, "name", {
    get: function () {
        return this.sName;
    },
    set: function (str) {
        this.sName = str;
    }
});

Object.defineProperty(ShaderParam.prototype, "type", {
    get: function () {
        return this._pType;
    },
    set: function (pVal) {

        if (typeof pVal == 'string') {
            this.eType = a.Shader.getSLTypeCode(pVal);
            this.eClass = a.Shader.getSLTypeClass(pVal);
            this.iRows = a.Shader.getSLTypeRowsNum(pVal);
            this.iColumns = a.Shader.getSLTypeColumnsNum(pVal);
            this._pType = pVal;
        }
        else {
            this.eClass = a.ParameterDesc.Class.STRUCT;
            this.eType = a.ParameterDesc.Type.UNSUPPORTED;
            this._pType = pVal;
        }
    }
});

Object.defineProperty(ShaderParam.prototype, "size", {
    get: function () {
        return this.iElements;
    },
    set: function (n) {
        this.iElements = n;
    }
});

/**
 * Шейдерная константа.
 * @ctor
 * Constructor.
 */
function ShaderConstant () {
    this._sName = null;
    this._sType = null;
    this._fStep = 0.0;
    this._pDefaultValue = null;
    this._pValue = null;
    this._pMinValue = null;
    this._pMaxValue = null;
    this._sComment = null;
}

ShaderConstant.prototype.undump = function (pReader) {
    this._sName = pReader.string();
    this._sType = pReader.string();
    this._fStep = pReader.float32();

    var n = a.Shader.typeLength(this._sType);
    if (n > 1) {
        this._pDefaultValue = pReader.float32Array();
        this._pValue = pReader.float32Array();
        this._pMinValue = pReader.float32Array();
        this._pMaxValue = pReader.float32Array();
    }
    else {
        this._pDefaultValue = pReader.float32();
        this._pValue = pReader.float32();
        this._pMinValue = pReader.float32();
        this._pMaxValue = pReader.float32();
    }

    this._sComment = pReader.string();
    return this;
};

ShaderConstant.prototype.dump = function (pWriter) {
    pWriter = pWriter || new a.BinWriter();
    pWriter.string(this._sName);
    pWriter.string(this._sType);
    pWriter.float32(this._fStep);

    var n = a.Shader.typeLength(this._sType);
    if (n > 1) {
        pWriter.float32Array(this._pDefaultValue);
        pWriter.float32Array(this._pValue);
        pWriter.float32Array(this._pMinValue);
        pWriter.float32Array(this._pMaxValue);
    }
    else {
        pWriter.float32(this._pDefaultValue);
        pWriter.float32(this._pValue);
        pWriter.float32(this._pMinValue);
        pWriter.float32(this._pMaxValue);
    }

    pWriter.string(this._sComment);
    return pWriter;
};

Object.defineProperty(ShaderConstant.prototype, "name", {
    get: function () {
        return this._sName;
    },
    set: function (str) {
        this._sName = str;
    }
});
Object.defineProperty(ShaderConstant.prototype, "type", {
    get: function () {
        return this._sType;
    },
    set: function (str) {
        debug_assert(a.Shader.typeLength(str), "Тип '" + str +
            "' не поддерживается.");
        this._sType = str;
    }
});
Object.defineProperty(ShaderConstant.prototype, "comment", {
    get: function () {
        return this._sComment;
    },
    set: function (str) {
        this._sComment = str;
    }
});
Object.defineProperty(ShaderConstant.prototype, "value", {
    get: function () {
        return this._pValue;
    },
    set: function (pVal) {
        this._pValue = a.Shader.typedValue(this._sType, pVal);
    }
});
Object.defineProperty(ShaderConstant.prototype, "def", {
    get: function () {
        return this._pDefaultValue;
    },
    set: function (pVal) {
        this._pDefaultValue = a.Shader.typedValue(this._sType, pVal);
    }
});
Object.defineProperty(ShaderConstant.prototype, "min", {
    get: function () {
        return this._pMinValue;
    },
    set: function (pVal) {
        this._pMinValue = a.Shader.typedValue(this._sType, pVal);
    }
});
Object.defineProperty(ShaderConstant.prototype, "max", {
    get: function () {
        return this._pMaxValue;
    },
    set: function (pVal) {
        this._pMaxValue = a.Shader.typedValue(this._sType, pVal);
    }
});
Object.defineProperty(ShaderConstant.prototype, "step", {
    get: function () {
        return this._fStep;
    },
    set: function (fVal) {
        this._fStep = parseFloat(fVal);
    }
});


/**
 * Шейдерный флаг.
 * @ctor
 * Constructor.
 */
function ShaderFlag () {
    /**
     * Имя флага.
     * @private
     * @type String
     */
    this._sName = null;

    /**
     * Значения.
     * @private
     * @type Object
     */
    this._pValues = [];

    /**
     * Описание.
     * @private
     * @type String
     */
    this._sComment = null;
}

ShaderFlag.prototype.str = function (n) {
    if (n === null) {
        return '#define ' + this._sName + ' ';
    }
    else {
        return '#define ' + this._sName + ' ' + this._pValues[n].value + ' ';
    }
}

ShaderFlag.prototype.dump = function (pWriter) {
    pWriter = pWriter || new a.BinWriter();
    pWriter.string(this._sName);

    var tmp = this._pValues;
    pWriter.uint16(tmp.length);

    for (var i = 0; i < tmp.length; ++i) {
        pWriter.string(tmp[i].name);
        pWriter.string(tmp[i].value);
    }

    pWriter.string(this._sComment);
    return pWriter;
};

ShaderFlag.prototype.undump = function (pReader) {
    this._sName = pReader.string();

    var n = pReader.uint16();
    var tmp = this._pValues;

    for (var i = 0; i < n; ++i) {
        tmp[i] = {
            'name':  pReader.string(),
            'value': pReader.string()
        };
    }

    this._sComment = pReader.string();
    return this;
};

Object.defineProperty(ShaderFlag.prototype, "comment", {
    get: function () {
        return this._sComment;
    },
    set: function (str) {
        this._sComment = str;
    }
});

Object.defineProperty(ShaderFlag.prototype, "name", {
    get: function () {
        return this._sName;
    },
    set: function (str) {
        this._sName = str;
    }
});

ShaderFlag.prototype.value = function (n) {
    return this._pValues[n].value;
};

ShaderFlag.prototype.valueName = function (n) {
    return this._pValues[n].name;
};

Object.defineProperty(ShaderFlag.prototype, "size", {
    get: function () {
        return this._pValues.length;
    }
});

ShaderFlag.prototype.addValue = function (sValue, sName) {
    sName = sName || '';
    this._pValues.push({
                           name:  sName,
                           value: sValue
                       });
};

function ShaderVarying () {

    ShaderVarying.superclass.constructor.apply(this, arguments);
}
;

ShaderVarying.prototype.str = function () {
    return 'varying ' + pVary.superclass.str();
}

a.extend(ShaderVarying, ShaderParam);

/**
 * Шейдерный атрибут.
 * @ctor
 * Constructor.
 */
function ShaderAttribute () {
    ShaderAttribute.superclass.constructor.apply(this, arguments);
}
;

a.extend(ShaderAttribute, ShaderParam);

ShaderAttribute.prototype.str = function () {
    return 'attribute ' + ShaderAttribute.superclass.str.call(this, 0, 0) +
        ' ' + this.sName + ';'
}

Object.defineProperty(ShaderAttribute.prototype, "semantics", {
    get: function () {
        return this.sSemantic;
    },
    set: function (str) {
        this.sSemantic = str;
    }
});


Object.defineProperty(ShaderAttribute.prototype, "name", {
    get: function () {
        return this.sName;
    },
    set: function (str) {
        this.sName = str;
    }
});

/**
 * @ctor
 * Constructor
 */
function ShaderUniform () {
    ShaderUniform.superclass.constructor.apply(this, arguments);
}

a.extend(ShaderUniform, ShaderParam);

ShaderUniform.prototype.str = function () {
    return 'uniform ' + ShaderUniform.superclass.str.call(this, 0, 0) +
        ' ' + this.sName + ';'
};

Object.defineProperty(ShaderUniform.prototype, "semantics", {
    get: function () {
        return this.sSemantic;
    },
    set: function (str) {
        this.sSemantic = str;
    }
});


/**
 * @ctor
 */
function ShaderFragment (eType) {

    /**
     *@enum
     */
    Enum([
             CODE_UNKNOWN = -1,
             CODE_GLOBAL,
             CODE_DECL,
             CODE_MAIN
         ], SHADER_FRAGMENT_CODE, a.ShaderFragment);

    this._pFlags = [];
    this._pConstants = [];
    this._pUniforms = [];
    this._pAttrs = [];
    this._pVaryings = [];

    /**
     * @type Enumeration(SHADER_TYPES);
     */

    this._eType = eType || a.Shader.UNKNOWN;

    this._pCode = new Array(3);
}

ShaderFragment.prototype.applyPrefix = function (sPrefix) {
    sPrefix = sPrefix || ' ';
    this._substCode('$', sPrefix);
}

ShaderFragment.prototype._substCode = function (sFrom, sTo) {
    var pCode = this._pCode;
    for (var i = 0; i < pCode.length; ++i) {
        if (pCode[i]) {
            pCode[i] = pCode[i].split(sFrom).join(sTo);
        }
    }
}

ShaderFragment.prototype.applyConstants = function () {
    var pConsts = this._pConstants;
    for (var i = 0; i < pConsts.length; ++i) {
        this._substCode(pConsts.name, pConsts.def);
    }
}

ShaderFragment.prototype.dump = function (pWriter) {
    pWriter = pWriter || new a.BinWriter();

    var fnWriteObject = function (pObj) {
        pWriter.uint16(pObj.length);
        for (var i = 0; i < pObj.length; ++i) {
            pObj[i].dump(pWriter);
        }
    }

    fnWriteObject(this._pFlags);
    fnWriteObject(this._pConstants);
    fnWriteObject(this._pUniforms);
    fnWriteObject(this._pAttrs);
    fnWriteObject(this._pVaryings);

    pWriter.int8(this._eType);
    pWriter.stringArray(this._pCode);
    return pWriter;
};

ShaderFragment.prototype.undump = function (pReader) {
    var fnReadObject = function (pObj, pType) {
        var n = pReader.uint16();
        for (var i = 0; i < n; ++i) {
            pObj[i] = (new pType).undump(pReader);
        }
    }

    fnReadObject(this._pFlags, a.ShaderFlag);
    fnReadObject(this._pConstants, a.ShaderConstant);
    fnReadObject(this._pUniforms, a.ShaderUniform);
    fnReadObject(this._pAttrs, a.ShaderAttribute);
    fnReadObject(this._pVaryings, a.ShaderVarying);

    this._eType = pReader.int8();
    this._pCode = pReader.stringArray();
    return this;
};

ShaderFragment.prototype.hasVarying = function (sName) {
    var src = this._pVaryings;
    for (var i = 0; i < src.length; ++i) {
        if (src[i].name == sName) {
            return true;
        }
    }
    return false;
};

ShaderFragment.prototype.addFlag = function (pFlag) {
    this._pFlags.push(pFlag);
};

ShaderFragment.prototype.addConstant = function (pConst) {
    this._pConstants.push(pConst);
};

ShaderFragment.prototype.addUniformVariable = function (pUniform) {
    this._pUniforms.push(pUniform);
};

ShaderFragment.prototype.addVarying = function (pVarying) {
    this._pVaryings.push(pVarying);
};

ShaderFragment.prototype.addAttr = function (pAttr) {
    debug_assert(this._eType == a.Shader.VERTEX, "Только вершинные шейдеры " +
        "поддерживают атрибуты.");
    this._pAttrs.push(pAttr);
};

Object.defineProperty(ShaderFragment.prototype, "flags", {
    get: function () {
        return this._pFlags;
    }
});

Object.defineProperty(ShaderFragment.prototype, "attrs", {
    get: function () {
        return this._pAttrs;
    }
});

Object.defineProperty(ShaderFragment.prototype, "uniforms", {
    get: function () {
        return this._pUniforms;
    }
});

Object.defineProperty(ShaderFragment.prototype, "varyings", {
    get: function () {
        return this._pVaryings;
    }
});

Object.defineProperty(ShaderFragment.prototype, "type", {
    get: function () {
        return this._eType;
    },
    set: function (eType) {
        this._eType = eType;
    }
});

Object.defineProperty(ShaderFragment.prototype, "mainCode", {
    get: function () {
        var str = this._pCode[a.ShaderFragment.CODE_MAIN];
        return (str === null ? '' : str);
    },
    set: function (str) {
        this._pCode[a.ShaderFragment.CODE_MAIN] = str;
    }
});

Object.defineProperty(ShaderFragment.prototype, "declCode", {
    get: function () {
        var str = this._pCode[a.ShaderFragment.CODE_DECL];
        return (str === null ? '' : str);
    },
    set: function (str) {
        this._pCode[a.ShaderFragment.CODE_DECL] = str;
    }
});

Object.defineProperty(ShaderFragment.prototype, "globalCode", {
    get: function () {
        var str = this._pCode[a.ShaderFragment.CODE_GLOBAL];
        return (str === null ? '' : str);
    },
    set: function (str) {
        this._pCode[a.ShaderFragment.CODE_GLOBAL] = str;
    }
});

Object.defineProperty(ShaderFragment.prototype, "code", {
    get: function () {
        return this._pCode;
    }
});
/**
 * @ctor
 * Constructor.
 */
function Shader (sName) {
    this._sName = sName || null;
    this._sSource = null;

    this._pShaderFragments = new Array(2);//(a.Shader.VERTEX);
}

Shader.prototype.dump = function (pWriter) {
    pWriter = pWriter || new a.BinWriter();
    pWriter.string(this._sName);
    pWriter.string(this._sSource);

    var fnWriteObject = function (pObj) {
        pWriter.uint16(pObj.length);
        for (var i = 0; i < pObj.length; ++i) {
            pObj[i].dump(pWriter);
        }
    }

    fnWriteObject(this._pShaderFragments);
    return pWriter;
};

Shader.prototype.undump = function (pReader) {
    this._sName = pReader.string();
    this._sSource = pReader.string();

    var fnReadObject = function (pObj, pType) {
        var n = pReader.uint16();
        for (var i = 0; i < n; ++i) {
            pObj[i] = (new pType()).undump(pReader);
        }
    }

    fnReadObject(this._pShaderFragments, a.ShaderFragment);
    return this;
};

Object.defineProperty(Shader.prototype, "name", {
    get: function () {
        return this._sName;
    },
    set: function (str) {
        this._sName = str;
    }
});

Object.defineProperty(Shader.prototype, "vertex", {
    get: function () {
        return this._pShaderFragments[a.Shader.VERTEX - 1];
    },
    set: function (pShaderFrag) {
        this._pShaderFragments[a.Shader.VERTEX - 1] = pShaderFrag;
    }
});

Object.defineProperty(Shader.prototype, "pixel", {
    get: function () {
        return this._pShaderFragments[a.Shader.PIXEL - 1];
    },
    set: function (pShaderFrag) {
        this._pShaderFragments[a.Shader.PIXEL - 1] = pShaderFrag;
    }
});

Object.defineProperty(Shader.prototype, "fragments", {
    get: function () {
        return this._pShaderFragments;
    }
});


/**
 * Получение количества элементов в шейдерной переменной
 * базового типа.
 * @tparam String sType Тип переменной.
 * @treturn Int Количество элементов.
 */
Shader.typeLength = function (sType) {
    switch (sType) {
        case 'float':
            return 1;
        case 'int'    :
            return 1;
        case 'bool'    :
            return 1;
        case 'vec2'    :
            return 2;
        case 'vec3'    :
            return 3;
        case 'vec4'    :
            return 4;
        case 'ivec2':
            return 2;
        case 'ivec3':
            return 3;
        case 'ivec4':
            return 4;
        case 'bvec2':
            return 2;
        case 'bvec3':
            return 3;
        case 'bvec4':
            return 4;
        case 'mat2'    :
            return 2;
        case 'mat3'    :
            return 3;
        case 'mat4'    :
            return 4;
        case 'sampler2D':
            return 1;
    }
    return 0;
};

/**
 * Преобразование строкового представления значения переменной
 * в шейдере(с базовым типом) в нормальное.
 */
Shader.typedValue = function (sType, pData) {
    var nLen = a.Shader.typeLength(sType);
    debug_assert(nLen, "Недопустимый тип для преобразования данных.");

    if (typeof pData != 'string') {
        return pData;
    }

    var dest = null;
    if (nLen > 1) {
        dest = new Array(nLen);
        pData = pData.split(',')
        for (var i = 0; i < nLen; ++i) {
            dest[i] = parseFloat(pData[i]);
            if (isNaN(dest[i])) {
                error('Для типа данных "' + sType + '", данные "' +
                          pData + '" не подходят.');
            }
        }
    }
    else {
        dest = parseFloat(pData);
    }

    return dest;
};

Shader.getSLTypeCode = function (sType) {
    switch (sType) {
        case 'int':
            return       a.ParameterDesc.Type.INT;
        case 'float':
            return     a.ParameterDesc.Type.FLOAT;
        case 'vec2':
            return      a.ParameterDesc.Type.FLOAT;
        case 'vec3':
            return      a.ParameterDesc.Type.FLOAT;
        case 'vec4':
            return      a.ParameterDesc.Type.FLOAT;
        case 'mat3':
            return      a.ParameterDesc.Type.FLOAT;
        case 'mat4':
            return      a.ParameterDesc.Type.FLOAT;
        case 'sampler2D':
            return a.ParameterDesc.Type.SAMPLER2D;
        default:
            error('Unsupported type ' + sType + ' used.');
            return 0;
    }
    ;
};

Shader.getSLTypeClass = function (sType) {
    switch (sType) {
        case 'int':
            return       a.ParameterDesc.Class.SCALAR;
        case 'float':
            return     a.ParameterDesc.Class.SCALAR;
        case 'vec2':
            return      a.ParameterDesc.Class.VECTOR;
        case 'vec3':
            return      a.ParameterDesc.Class.VECTOR;
        case 'vec4':
            return      a.ParameterDesc.Class.VECTOR;
        case 'mat3':
            return      a.ParameterDesc.Class.MATRIX_COLUMNS;
        case 'mat4':
            return      a.ParameterDesc.Class.MATRIX_COLUMNS;
        case 'sampler2D':
            return a.ParameterDesc.Class.SCALAR;
        default:
            error('Unsupported type ' + sType + ' used.');
            return 0;
    }
    ;
};


Shader.getSLTypeColumnsNum = function (sType) {
    switch (sType) {
        case 'vec4':
        case 'vec3':
        case 'vec2':
            return 1;
        case 'mat2':
            return 2;
        case 'mat3':
            return 3;
        case 'mat4':
            return 4;
        default:
            return 0;
    }
};

Shader.getSLTypeRowsNum = function (sType) {
    switch (sType) {
        case 'vec4':
            return 4;
        case 'vec3':
            return 3;
        case 'vec2':
            return 2;
        case 'mat2':
            return 2;
        case 'mat3':
            return 3;
        case 'mat4':
            return 4;
        default:
            return 0;
    }
};

a.ShaderParam = ShaderParam;
a.ShaderConstant = ShaderConstant;
a.ShaderFlag = ShaderFlag;
a.ShaderVarying = ShaderVarying;
a.ShaderFragment = ShaderFragment;
a.ShaderUniform = ShaderUniform;
a.ShaderAttribute = ShaderAttribute;
a.Shader = Shader;