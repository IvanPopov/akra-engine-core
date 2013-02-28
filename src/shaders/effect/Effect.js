/**
 * @file
 * @brief Simplified implementation effects similar to d3dxeffect
 * @author Ivan Popov
 * @email <vantuziast@odserve.org>
 */

/**
 * Класс описания системного требования.
 *
 * @ctor
 * Constructor.
 */
function SystemRequirement () {
    /**
     * Тип требования.
     * @type Enumeration
     * @private
     */
    this._eType;

    /**
     * Цель требования.
     * @type Enumeration
     * @private
     */
    this._eTarget;

    /**
     * Список допущеных.
     * @private
     */
    this._pAccess = [];

    /**
     * Список запрещенных.
     * @private
     */
    this._pDenied = [];
}

/**
 * @treturn Boolean Выполнено ли требование.
 */
SystemRequirement.prototype.test = function () {
    TODO('проверять все системные требования.');
    return true;
}

/**
 * Объект описывающий одно из состояний рендеринга.
 * @ctor
 * Constructor.
 */
function EffectPassState (eType, eValue) {
    /**
     * Тип состояния рендеринга.
     * @type Enumeration(a.renderStateType)
     */
    this.eType = ifndef(eType, null);

    /**
     * @type Enumeration(*)
     */
    this.eValue = ifndef(eValue, null);
}


EffectPassState.renderStateTypeFromString = function (sType) {
    switch (sType.toUpperCase()) {
        case 'ZENABLE':
            return a.renderStateType.ZENABLE;
        case 'ZWRITEENABLE':
            return a.renderStateType.ZWRITEENABLE;
        case 'SRCBLEND':
            return a.renderStateType.SRCBLEND;
        case 'DESTBLEND':
            return a.renderStateType.DESTBLEND;
        case 'CULLMODE':
            return a.renderStateType.CULLMODE;
        case 'ZFUNC':
            return a.renderStateType.ZFUNC;
        case 'DITHERENABLE':
            return a.renderStateType.DITHERENABLE;
        case 'ALPHABLENDENABLE':
            return a.renderStateType.ALPHABLENDENABLE;
        case 'ALPHATESTENABLE':
            return a.renderStateType.ALPHATESTENABLE;
        default:
            error('Unsupported render state type used: ' + sType + '.');
            return null;
    }
};


EffectPassState.renderStateValueFromString = function (eState, sValue) {
    switch (eState) {
        case a.renderStateType.ALPHABLENDENABLE:
        case a.renderStateType.ALPHATESTENABLE:
            warning('ALPHABLENDENABLE/ALPHATESTENABLE not supported in WebGL.');
        case a.renderStateType.DITHERENABLE:
        case a.renderStateType.ZENABLE:
        case a.renderStateType.ZWRITEENABLE:
            switch (String(sValue).toUpperCase()) {
                case 'TRUE':
                    return true;
                case 'FALSE':
                    return false;
                default:
                    error('Unsupported render state ALPHABLENDENABLE/ZENABLE/ZWRITEENABLE/DITHERENABLE value used: '
                              + sValue + '.');
                    return null;
            }
            break;
        case a.renderStateType.SRCBLEND:
        case a.renderStateType.DESTBLEND:
            switch (String(sValue).toUpperCase()) {
                case 'ZERO':
                    return a.BLEND.ZERO;
                case 'ONE':
                    return a.BLEND.ONE;
                case 'SRCCOLOR':
                    return a.BLEND.SRCCOLOR;
                case 'INVSRCCOLOR':
                    return a.BLEND.INVSRCCOLOR;
                case 'SRCALPHA':
                    return a.BLEND.SRCALPHA;
                case 'INVSRCALPHA':
                    return a.BLEND.INVSRCALPHA;
                case 'DESTALPHA':
                    return a.BLEND.DESTALPHA;
                case 'INVDESTALPHA':
                    return a.BLEND.INVDESTALPHA;
                case 'DESTCOLOR':
                    return a.BLEND.DESTCOLOR;
                case 'INVDESTCOLOR':
                    return a.BLEND.INVDESTCOLOR;
                case 'SRCALPHASAT':
                    return a.BLEND.SRCALPHASAT;
                default:
                    error('Unsupported render state SRCBLEND/DESTBLEND value used: ' + sValue + '.');
                    return null;
            }
            break;
        case a.renderStateType.CULLMODE:
            switch (String(sValue).toUpperCase()) {
                case 'NONE':
                    return a.CULLMODE.NONE;
                case 'CW':
                    return a.CULLMODE.CW;
                case 'CCW':
                    return a.CULLMODE.CCW;
                case 'FRONT_AND_BACK':
                    return a.CULLMODE.FRONT_AND_BACK;
                default:
                    error('Unsupported render state SRCBLEND/DESTBLEND value used: ' + sValue + '.');
                    return null;
            }
            break;
        case a.renderStateType.ZFUNC:
            switch (String(sValue).toUpperCase()) {
                case 'NEVER':
                    return a.CMPFUNC.NEVER;
                case 'LESS':
                    return a.CMPFUNC.LESS;
                case 'EQUAL':
                    return a.CMPFUNC.EQUAL;
                case 'LESSEQUAL':
                    return a.CMPFUNC.LESSEQUAL;
                case 'GREATER':
                    return a.CMPFUNC.GREATER;
                case 'NOTEQUAL':
                    return a.CMPFUNC.NOTEQUAL;
                case 'GREATEREQUAL':
                    return a.CMPFUNC.GREATEREQUAL;
                case 'ALWAYS':
                    return a.CMPFUNC.ALWAYS;
                default:
                    error('Unsupported render state ZFUNC value used: ' +
                              sValue + '.');
                    return null;
            }
            break;
    }
};


/**
 * Описание эффекта.
 * @ctor
 * Constructor
 */
function EffectDesc (sDesc, nParams, nTechniques/*, nFuncs*/) {
    /**
     * Имя создателя эффекта
     * @type String
     */
    this.sDesc = sDesc || null;

    /**
     * Число параметров, определенных в эффекте.
     * @type Int
     */
    this.nParameters = nParams || 0;

    /**
     * @type Int
     */
    this.nTechniques = nTechniques || 0;
    /*this.nFunctions = nFuncs || 0;*/
}


/**
 * Описание техники в эффекте.
 * @ctor
 * Constructor.
 */
function EffectTechniqueDesc (sName, nPasses) {
    /**
     * Имя техники.
     * @type String
     */
    this.sName = sName || "";

    /**
     * Количество проходов.
     * @type Int
     */
    this.nPasses = nPasses || 0;
}

/**
 * Параметр файла эффектов
 * @ctor
 * Constructor
 */
function EffectParam (sName, eClass, eType, iRows, iColumns, iElements, iStructMembers) {

    EffectParam.superclass.constructor.apply(this, arguments);

    //debug_assert(arguments.length > 2, 'Invalid constructor call.');

    var sSemantics;
    var tmp;
    if ((tmp = sName.match(/^\s*([\w+]+)\s*(\:\s*([\w]+))?\s*$/))) {
        sName = tmp[1];
        sSemantics = tmp[3] || null;
    }

    /**
     * @private
     * @type *
     */
    this._pValue = null;

    //setup 
    this.sName = sName;
    this.sSemantics = sSemantics || null;
    this.eClass = eClass;
    this.eType = eType;
    this.iRows = iRows || 0;
    this.iColumns = iColumns || 0;
    this.iElements = iElements || 0;
    this.iStructMembers = iStructMembers || 0;

    this._pDevice = null;
    this._pEngine = null;
}


a.extend(EffectParam, a.ParameterDesc);

function EffectFloat32 (sName) {
    EffectFloat32.superclass.constructor.call(this,
                                           sName,
                                           a.ParameterDesc.Class.SCALAR,
                                           a.ParameterDesc.Type.FLOAT,
                                           0,
                                           1,
                                           1,
                                           0
    );

    this._pValue = 0;
    this._isModified = true;
}

a.extend(EffectFloat32, EffectParam);

EffectFloat32.prototype.set = function (pShaderBlend, pValue) {
    pValue = pValue || 0;

    if (pValue != this._pValue) {
        this._pValue = pValue;
        this._isModified = true;
    }

    var pLoc = pShaderBlend.getUniformLocation(this.sName);

    if (this._isModified && pLoc != -1) {
        this._pDevice.uniform1f(pLoc, pValue);
        this._isModified = false;
    }
};

Object.defineProperty(EffectFloat32.prototype, "val", {
    set: function (pValue) {
        this._pValue = pValue;
    },
    get: function () {
        return this._pValue;
    }
});

//--
function EffectMat3 (sName, iElements) {
    iElements = iElements || 0;

    EffectMat3.superclass.constructor.call(this,
                                           sName,
                                           a.ParameterDesc.Class.MATRIX_COLUMNS,
                                           a.ParameterDesc.Type.FLOAT,
                                           3,
                                           3,
                                           iElements,
                                           0
    );

    this._pValue = new Matrix3();
    this._isModified = true;
    //this._pLocation = null;
}

a.extend(EffectMat3, EffectParam);


EffectMat3.prototype.set = function (pShaderBlend, pMatrix) {
    if (!pMatrix) {
        return;
    }

    var pVal = this._pValue;
    for (var i = 0, n = pMatrix.length; i < n; ++i) {
        if (pVal[i] !== pMatrix[i]) {
            this._isModified = true;
            Mat3.set(pMatrix, pVal);
            break;
        }
    }

    var pLoc = pShaderBlend.getUniformLocation(this.sName);

    if (this._isModified && pLoc != -1) {
        this._pDevice.uniformMatrix3fv(pLoc, false, pVal);
        this._isModified = false;
    }
};


Object.defineProperty(EffectMat3.prototype, "val", {
    set: function (pValue) {
        if (pValue instanceof Array) {
            if (!pValue.length) {
                this._pValue = Mat4.identity(new Float32Array(9));
            }
            else {
                this._pValue = new Float32Array(pValue);
            }
        }
        else {
            this._pValue = pValue;
        }
    },
    get: function () {
        return this._pValue;
    }
});
//--

function EffectMat4 (sName, iElements) {
    iElements = iElements || 0;

    EffectMat4.superclass.constructor.call(this,
                                           sName,
                                           a.ParameterDesc.Class.MATRIX_COLUMNS,
                                           a.ParameterDesc.Type.FLOAT,
                                           4,
                                           4,
                                           iElements,
                                           0
    );

    this._pValue = new Matrix4();
    this._isModified = true;
    //this._pLocation = null;
}

a.extend(EffectMat4, EffectParam);


EffectMat4.prototype.set = function (pShaderBlend, pMatrix) {
    if (!pMatrix) {
        return;
    }

    var pVal = this._pValue;
    for (var i = 0, n = pMatrix.length; i < n; ++i) {
        if (pVal[i] != pMatrix[i]) {
            this._isModified = true;
            Mat4.set(pMatrix, pVal);
            break;
        }
    }

    var pLoc = pShaderBlend.getUniformLocation(this.sName);

    if (this._isModified && pLoc != -1) {
        this._pDevice.uniformMatrix4fv(pLoc, false, pVal);
        this._isModified = false;
    }
};


Object.defineProperty(EffectMat4.prototype, "val", {
    set: function (pValue) {
        if (pValue instanceof Array) {
            if (!pValue.length) {
                this._pValue = Mat4.identity(new Float32Array(16));
            }
            else {
                this._pValue = new Float32Array(pValue);
            }
        }
        else {
            this._pValue = pValue;
        }
    },
    get: function () {
        return this._pValue;
    }
});

//--
function EffectVec3 (sName, iElements) {
    iElements = iElements || 0;

    EffectVec3.superclass.constructor.call(this,
                                           sName,
                                           a.ParameterDesc.Class.VECTOR,
                                           a.ParameterDesc.Type.FLOAT,
                                           3,
                                           1,
                                           iElements,
                                           0
    );

    this._pValue = new Vector3();
    this._isModified = true;
    //this._pLocation = null;
}

a.extend(EffectVec3, EffectParam);

EffectVec3.prototype.set = function (pShaderBlend, pVector) {
    if (!pVector) {
        return;
    }

    var pVal = this._pValue;

    for (var i = 0, n = pVector.length; i < n; i++) {
        if (pVal[i] != pVector[i]) {
            this._isModified = true;
            Vec3.set(pVector, pVal);
            break;
        }
    }

    var pLoc = pShaderBlend.getUniformLocation(this.sName);

    if (this._isModified && pLoc != -1) {
        this._pDevice.uniform3fv(pLoc, pVal);
        this._isModified = false;
    }
};

Object.defineProperty(EffectVec3.prototype, "val", {
    set: function (pValue) {
        if (pValue instanceof Array) {
            if (!pValue.length) {
                this._pValue = new Float32Array([0, 0, 0]);
            }
            else {
                this._pValue = new Float32Array(pValue);
            }
        }
        else {
            this._pValue = pValue;
        }
    },
    get: function () {
        return this._pValue;
    }
});
//--

/**
 * @Ctor
 * Constructor.
 */
function EffectVec4 (sName, iElements) {
    iElements = iElements || 0;

    EffectVec4.superclass.constructor.call(this,
                                           sName,
                                           a.ParameterDesc.Class.VECTOR,
                                           a.ParameterDesc.Type.FLOAT,
                                           4,
                                           1,
                                           iElements,
                                           0
    );

    this._pValue = new Vector4();
    this._isModified = true;
    //this._pLocation = null;
}

a.extend(EffectVec4, EffectParam);

EffectVec4.prototype.set = function (pShaderBlend, pVector) {
    if (!pVector) {
        return;
    }

    var pVal = this._pValue;


    for (var i = 0, n = pVector.length; i < n; i++) {
        if (pVal[i] != pVector[i]) {
            this._isModified = true;
            Vec4.set(pVector, pVal);
            break;
        }
    }


    var pLoc = pShaderBlend.getUniformLocation(this.sName);

    if (this._isModified && pLoc != -1) {
        switch (this.iRows) {
            case 4:
                //console.log(this.sName, pVal);
                this._pDevice.uniform4fv(pLoc, pVal);
                break;
            case 3:
                this._pDevice.uniform3fv(pLoc, pVal);
                break;
            case 2:
                this._pDevice.uniform2fv(pLoc, pVal);
                break;
            default:
                TODO('only vec4, vec3, vec2 supported!')
        }
        this._isModified = false;
    }
};

Object.defineProperty(EffectVec4.prototype, "val", {
    set: function (pValue) {
        if (pValue instanceof Array) {
            if (!pValue.length) {
                this._pValue = new Float32Array([0, 0, 0, 0]);
            }
            else {
                this._pValue = new Float32Array(pValue);
            }
        }
        else {
            this._pValue = pValue;
        }
    },
    get: function () {
        return this._pValue;
    }
});

function EffectTexture (sName, eType) {
    eType = eType || a.ParameterDesc.Type.TEXTURE2D;
    EffectTexture.superclass.constructor.call(this,
                                              sName, a.ParameterDesc.Class.OBJECT, eType
    );

    /**
     * @private
     * @type WebGLTexture
     */
    this._pValue = null;
    this._pSamplers = [];
    this._pLastSampler = null;

    /**
     * Номер под которым данная текстура была активирована.
     */
    this._nActiveSlot = -1;
}
a.extend(EffectTexture, EffectParam);

EffectTexture.prototype.set = function (pBlend, pTexture, isCubeTexture) {
    if (this._pValue != pTexture) {
        this._pValue = pTexture;

        if (!this._pValue) {
            return;
        }

        if (isCubeTexture) {
            this.eType = a.ParameterDesc.Type.TEXTURECUBE;
        }

        var pSamplers = this._pSamplers;
        for (var i = 0, n = pSamplers.length; i < n; i++) {

            if (pBlend.hasUniform(pSamplers[i].sName)) {
                pSamplers[i].eType = a.ParameterDesc.Type.SAMPLERCUBE;
                pSamplers[i].use(pBlend, this._pValue);
                this._pLastSampler = pSamplers[i];
                break;
            }
        }
    }
};

function EffectShader (sName) {
    EffectShader.superclass.constructor.apply(this, arguments);
    /**
     * @private
     * @type Shader
     */
    this._pValue = null;
}

a.extend(EffectShader, EffectParam);

Object.defineProperty(EffectShader.prototype, "val", {
    set: function (pValue) {

        var pEffect = this._pEffect;

        if (isset(pEffect._pShaders[this.sName])) {
            return;
        }

        var sVertexName = pValue.vertex;
        var sPixelName = pValue.pixel;

        var sVertex = pEffect._pVertexFragments[sVertexName]._sCode;
        var sPixel = pEffect._pPixelFragments[sPixelName]._sCode;

        if (!isset(sVertex) || !isset(sPixel)) {
            error('Шейдерные фрагменты не найдены.');
        }

        var pShader = new a.Shader(this.sName);
        if (a.ShaderPrecompiler.create(pShader, sVertex, sPixel) == true) {
            this._pValue = pShader;
            var pFrags = pShader._pShaderFragments;
            for (var n = 0; n < pFrags.length; ++n) {
                var pUniforms = pFrags[n]._pUniforms;
                for (var i = 0; i < pUniforms.length; ++i) {
                    var pParameter = pUniforms[i];
                    if (!isset(pEffect._pParametersByName[pParameter.sName])) {
                        TRACE('add parameter: ' + pParameter.sName);
                        pParameter._isUsed = true;
                        //pEffect._pParameters.push(pParameter);
                        pEffect._pParametersByName[pParameter.sName] = pParameter;
                    }
                    else {
                        pEffect._pParametersByName[pParameter.sName]._isUsed = true;
                    }
                }
            }
        }
        else {
            error('Невозможно прекомпилировать шейдер: ' + this.sName);
        }
    }
});

/*
 getCombinedMaxTextureImageUnits()
 a.getSystemInfo
 */

/**
 * Параметр текстуры в эффекте.
 * @ctor
 * Constructor.
 */
function EffectSamplerParam (pName, pValue) {

    /**
     * Имя параметра.
     * @type Enumeration(a.Texture.Param)
     */
    this.eName = 0;

    /**
     * Значение параметра.
     * @type Enumeration(a.Texture.MinFilter, a.Texture.MagFilter, a.Texture.WrapMode)
     */
    this.eValue = 0;

    if (arguments.length) {
        this.apply(pName, pValue);
    }
}

EffectSamplerParam.prototype.apply = function (pName, pValue) {
    if (typeof pName == 'string') {
        pName = a.EffectSamplerParam.paramTypeFromString(pName);
    }
    if (typeof pValue == 'string') {
        pValue = a.EffectSamplerParam.paramValueFromString(pName, pValue);
    }

    this.eName = pName;
    this.eValue = pValue;
    return this;
};

EffectSamplerParam.paramTypeFromString = function (sType) {
    switch (sType.toUpperCase()) {
        case 'MAGFILTER':
            return a.Texture.Param.MAG_FILTER;
        case 'MINFILTER':
            return a.Texture.Param.MIN_FILTER;
        case 'ADDRESSU':
            return a.Texture.Param.WRAP_S;
        case 'ADDRESSV':
            return a.Texture.Param.WRAP_T;
        //case 'ADDRESSW':
        //    return a.Texture.Param.WRAP_T;
        default:
            error('Unsupported sampler parameter: ' + sType);
            return null;
    }
};

EffectSamplerParam.paramValueFromString = function (eType, sValue) {
    switch (eType) {
        case a.Texture.Param.MAG_FILTER:
            switch (sValue.toUpperCase()) {
                case 'LINEAR':
                    return a.Texture.MagFilter.LINEAR;
                case 'NEAREST':
                    return a.Texture.MagFilter.NEAREST;
            }
            break;
        case a.Texture.Param.MIN_FILTER:
            switch (sValue.toUpperCase()) {
                case 'LINEAR':
                    return a.Texture.MinFilter.LINEAR_MIPMAP_LINEAR;
                case 'LINEAR_NEAREST':
                    return a.Texture.MinFilter.LINEAR_MIPMAP_NEAREST;
                case 'NEAREST_LINEAR':
                    return a.Texture.MinFilter.NEAREST_MIPMAP_LINEAR;
                case 'NEAREST':
                    return a.Texture.MinFilter.NEAREST_MIPMAP_NEAREST;
            }
            break;
        case a.Texture.Param.WRAP_T:
        case a.Texture.Param.WRAP_S:
            switch (sValue.toUpperCase()) {
                case 'WRAP':
                    return a.Texture.WrapMode.REPEAT;
                case 'CLAMP':
                    return a.Texture.WrapMode.CLAMP_TO_EDGE;
                case 'MIRROR':
                    return a.Texture.WrapMode.MIRRORED_REPEAT;
            }
            break;
        default:
            error('Unsupported sampler parameter: ' + str);
            return null;
    }
};


/**
 * Сэмплер текстуры, описываемый в эффект файле.
 * @ctor
 * Constructor.
 */
function EffectSampler (sName) {
    EffectSampler.superclass.constructor.apply(this, arguments);

    /**
     * @type EffectSamplerParam
     * @private
     */
    this._pParameters = [];
    this._pTexture = null;

    //setup description
    this.sName = sName;
    this.eClass = a.ParameterDesc.Class.SCALAR;
    //FIXME Определять тип сэмплера по текстуре, с которой он работает,
    //или по типу одноименного семплера, который будет найдет в шейдере.
    this.eType = a.ParameterDesc.Type.SAMPLER2D;
}

a.extend(EffectSampler, EffectParam);

Object.defineProperty(EffectSampler.prototype, "val", {
    set: function (pValue) {
        var sValue, pTexture;
        for (var sName in pValue) {
            sValue = pValue[sName];
            sName = sName.toLowerCase();

            if (sName == 'texture') {
                pTexture = this._pEffect._pParametersByName[sValue];
                pTexture._isUsed = true;
                pTexture._pSamplers.push(this);
                this._pTexture = pTexture;
            }
            else {
                this._pParameters.push(new a.EffectSamplerParam(sName, sValue));
            }
        }
    },
    get: function () {
        return this;
    }
});

/**
 * Применить текстуру.
 * @tparam WebGLTexture pTexture
 */
EffectSampler.prototype.use = function (pBlend, pTexture) {
    return;
    var pParams = this._pParameters;
    var pDevice = this._pDevice;
    var eTarget = pDevice.TEXTURE_2D;//pTexture.eType;

    pDevice.bindTexture(eTarget, pTexture);
    for (var i = 0, n = pParams.length; i < n; ++i) {
        pDevice.texParameteri(eTarget, pParams[i].eName, pParams[i].eValue);
    }
    pDevice.bindTexture(eTarget, null);
    //pBlend
};

function EffectPass (sName, pEffect) {
    this._pEffect = pEffect || null;

    this._pEngine = pEffect._pEngine;

    /**
     * @type RenderState[]
     */
    this.pStates = [];

    /**
     * @type ShaderBlend
     */
    this.pShaderBlend = null;

    /**
     * @type String
     */
    this.sName = sName || null;
}

Object.defineProperty(EffectPass.prototype, "val", {
    set: function (pValue) {

        var pEffect = this._pEffect;
        var pBlender = this.pShaderBlend = new a.ShaderBlend(this._pEngine);
        var pEffectShaders = pEffect._pShadersByName;
        var pShader, sParams, pParams;
        var pStates, eState, eValue, pShaders;
        var tmp, pMatches;

        if (pValue instanceof Object) {
            for (var key in pValue) {
                switch (key) {
                    case 'state':
                        pStates = pValue[key];
                        for (var sState in pStates) {
                            var pVal = pStates[sState];
                            eState =
                                a.EffectPassState.renderStateTypeFromString(sState);
                            if (typeof pValue == 'string') {
                                eValue =
                                    a.EffectPassState.renderStateValueFromString(eState,
                                                                                 pValue);
                            }
                            else {
                                eValue = pVal;
                            }

                            this.pStates.push(new a.EffectPassState(eState, eValue));
                        }
                        break;

                    case 'shaders':
                        pShaders = pValue[key];
                        for (var i in pShaders) {
                            pShader = pEffectShaders[pShaders[i]]._pValue;
                            pBlender.appendShader(pShader);
                            pBlender.activate(pShader._sName);
                        }
                        break;
                    case 'params':
                        sParams = pValue[key];
                        pParams = sParams.split(',');
                        for (i = 0; i < pParams.length; ++i) {
                            if ((pMatches = pParams[i].match(/^\s*set\s*([\w\d\_]+)(\s*\=([\d]+))?\s*$/))) {
                                pBlender.activate(pMatches[1], pMatches[3]);
                            }
                            else {
                                warning('ignored effect pass parameter: ' +
                                            pParams[i]);
                            }
                        }
                        break;
                }
            }

            //наконец, соберем шейдереую программу.
            pBlender.forcedAssemble();

        }
        else {
            error('Incorrect input value for effect pass.');
        }
    }
});

/**
 * Similar to techniques in fx files in d3d.
 */
function EffectTechnique (sName) {

    /**
     * @type EffectPass[]
     * @private
     */
    this._pPasses = [];

    /**
     * Название техники.
     * @type String
     * @private
     */
    this._sName = sName || null;

    /**
     * Требования к технике.
     * @type SystemRequirement[]
     */
    this._pRequirements = [];

    this._nCurrentPass = 0;
}

EffectTechnique.prototype.currentBlend = function () {
    return this._pPasses[this._nCurrentPass].pShaderBlend;
};

EffectTechnique.prototype.getPass = function (iPass) {
    return this._pPasses[iPass];
}

/**
 * Проверяем, поддерживается ли данная техника на текущей платформе.
 * @treturn Boolean
 */
EffectTechnique.prototype.isValid = function () {
    var pReqs = this._pRequirements
    for (var i = 0, n = pReqs.length; i < n; ++i) {
        if (!pReqs[i].test()) {
            return false;
        }
    }
    return true;
}


Object.defineProperty(EffectTechnique.prototype, "val", {
    set: function (pValue) {
        if (pValue instanceof Array) {
            for (var i = 0; i < pValue.length; ++i) {
                this._pPasses.push(pValue[i]);
                pValue[i]._pTechnique = this;
                pValue[i]._pDevice = this._pDevice;
                pValue[i]._pEngine = this._pEngine;
            }
        }
        else {
            error('Incorrect input value for effect technique.');
        }
    }
});

function EffectFragment (sName, eType) {
    EffectFragment.superclass.constructor.apply(this, arguments);

    this.eType = eType || a.ParameterDesc.Type.UNSUPPORTED;
    this.sName = sName || null;
    this.eClass = a.ParameterDesc.Class.OBJECT;

    this._sCode = null;
}
a.extend(EffectFragment, a.ParameterDesc);

Object.defineProperty(EffectFragment.prototype, "val", {
    set: function (sCode) {
        this._sCode = sCode;
    }
});


function Effect (pEngine) {
    this._pEngine = pEngine;
    /**
     * Текущий контекст.
     * @type Context3D@private
     */

    this._pDevice = pEngine.pDevice;
    /**
     * Набор техник в эффекте, в том порядке
     * в которым техники были описаны в файле
     * эффекта.
     *
     * @type EffectTechnique[]
     * @private
     */
    this._pTechniques = [];

    /**
     * Набор техник в эффекте, сложенных
     * в ассоциативный массив по именам в
     * качестве ключей.
     *
     * @type EffectTechnique[]
     * @private
     */
    this._pTechniquesByName = {};

    /**
     * Активная техника.
     * @type EffectTechnique
     * @private
     */
    this._pActiveTechnique = null;

    /**
     * @type EffectParam[]
     * @private
     */
    this._pParameters = [];

    /**
     * @type EffectParam[]
     * @private
     */
    this._pParametersByName = {};

    /**
     * Шейдерные программы доступные в данном файле эффекта.
     * @private
     * @type Shader[]
     */
    this._pShaders = [];

    /**
     * Шейдерные программы доступные в данном файле эффекта.
     * @private
     * @type Shader[]
     */
    this._pShadersByName = {};

    /**
     * Набор пиксельных шейдеров по именам, определенных
     * непосредственно в эффект файле.
     *
     * @type EffectFragment[]
     * @private
     */
    this._pPixelFragments = {};

    /**
     * Набор вершинных шейдеров по именам, определенных
     * непосредственно в эффект файле.
     *
     * @type EffectFragment[]
     * @private
     */
    this._pVertexFragments = {};

    /**
     * Автор эффекта.
     * @type String
     * @private
     */
    this._sDesc = null;


}


Object.defineProperty(Effect.prototype, "param", {
    set: function (pParam) {
        pParam._pEffect = this;
        pParam._pDevice = this._pDevice;
        pParam._pEngine = this._pEngine;
        //this._pParameters.push(pParam);
        this._pParametersByName[pParam.sName] = pParam;
    }
});

Effect.prototype.setValue = function (sName, pData) {
    //console.log(arguments[0]);
    if (pData instanceof Float32Array) {
        if (pData.length === 16 || pData.length === 9) {
            this.setMatrix(sName, pData);
        }
        else if (pData.length === 4 || pData.length === 3) {
            this.setVector(sName, pData);
        }
        else {
            console.log(arguments);
            throw new Error('setValue() support only Matrix & Vector');
        }
    }
    else if (typeof pData == 'number') {
        this.setFloat32(sName, pData);
    }
    else {
        throw new Error('setValue(' + sName + ') support only Float32Array/Float32 data type.');
    }
    return true;
}

Effect.prototype.setMatrix = function (sName, pMatrix) {
    this._pParametersByName[sName].set(this._pActiveTechnique.currentBlend(),
                                       pMatrix);
};

Effect.prototype.setVector = function (sName, pVector) {
    this._pParametersByName[sName].set(this._pActiveTechnique.currentBlend(),
                                       pVector);
};

Effect.prototype.setFloat32 = function (sName, pValue) {
    this._pParametersByName[sName].set(this._pActiveTechnique.currentBlend(),
                                       pValue);
};

Effect.prototype.setTexture = function (sName, pTexture, isCubeTexture) {
    this._pParametersByName[sName].set(this._pActiveTechnique.currentBlend(), pTexture, isCubeTexture);
};

Effect.prototype.verify = function () {
    //Необходимо проверить, что все uniform переменные, объявленные 
    //в файле эффекта используются в нем.

    var pParams = this._pParametersByName;

    for (var i in pParams) {
        if (!pParams[i]._isUsed) {
            warning('Unused parameter in effect file: ' + pParams[i].sName);
        }
        //else {
        this._pParameters.push(pParams[i]);
        //}
    }
}

/**
 * @tparam String sParameter Имя параметра.
 */
Effect.prototype.getParameterDesc = function (sParameter) {
    var pParameter = this._pParametersByName[sParameter];
    if (isset(pParameter)) {
        return pParameter;
    }
    return null;
};

Effect.prototype.begin = function (eFlags) {
    //TODO deactivate teqnique
    return true;
};

Effect.prototype.end = function () {
    //TODO deactivate teqnique
    return true;
};

Effect.prototype.beginPass = function (nPass) {
    this._pActiveTechnique._nCurrentPass = nPass;

    var pPass = this._pActiveTechnique._pPasses[nPass];
    var pDevice = this._pDevice;

    debug_assert(pPass, 'Данный проход не существует.');

    for (var i = 0, n = pPass.pStates.length; i < n; i++) {
        var pState = pPass.pStates[i];
        pDevice.setRenderState(pState.eType, pState.eValue);
    }

    //var pShaderBlend = pPass.pShaderBlend;
    //debug_assert(pShaderBlend, 'Проход не проинициализирован');

    pPass.pShaderBlend.useProgram();

    return true;
};

Effect.prototype.endPass = function () {
    var pDevice = this._pDevice;
    /*
     * Выставляем все не выставленные uniform'ы 
     */
    var pBlend = this._pActiveTechnique.currentBlend();
    for (i = 0, n = this._pParameters.length; i < n; i++) {
        var pParam = this._pParameters[i];
        if (pParam.set) {//FIXME на данный момент семплеры не нужно активировать
            //console.log('parameter ==>', pParam);
            if (pBlend.hasUniform(pParam.sName)) {
                pParam.set(pBlend, pParam._pValue);
            }
        }
    }

    /**
     * Получим все семплеры
     */

    var pUniforms = pBlend.uniformList();

    for (var i in pUniforms) {
        if (pUniforms[i].eType === a.ParameterDesc.Type.SAMPLER2D ||
            pUniforms[i].eType === a.ParameterDesc.Type.SAMPLER1D ||
            pUniforms[i].eType === a.ParameterDesc.Type.SAMPLER ||
            pUniforms[i].eType === a.ParameterDesc.Type.SAMPLER3D ||
            pUniforms[i].eType == a.ParameterDesc.Type.SAMPLERCUBE) {

            var pSampler = this._pParametersByName[pUniforms[i].sName];
            var pTexture = pSampler._pTexture;

            if (pTexture._pValue == null) {
                continue;
            }

            if (pTexture._pLastSampler !== pSampler) {
                pSampler.use(pBlend, pTexture._pValue);
            }

            if ((Effect.pActiveTextures[pTexture._nActiveSlot]) != pTexture) {

                if (Effect.nLastActiveTexture == 15) {
                    Effect.nLastActiveTexture = 0;
                }
                else {
                    Effect.nLastActiveTexture++;
                }

                var nActiveTex = (Effect.nLastActiveTexture);

                pDevice.activeTexture(a.TEXTUREUNIT.TEXTURE + nActiveTex);
                if(pTexture.eType == a.ParameterDesc.Type.TEXTURECUBE) {
                    pDevice.bindTexture(a.TTYPE.TEXTURE_CUBE_MAP, pTexture._pValue);
                }
                else {
                    pDevice.bindTexture(pDevice.TEXTURE_2D, pTexture._pValue);
                }


                Effect.pActiveTextures[nActiveTex] = pTexture;
                pTexture._nActiveSlot = nActiveTex;
            }

            pDevice.uniform1i(pUniforms[i]._pLocation, pTexture._nActiveSlot);
        }
    }
}

Effect.prototype.shaderProgram = function () {
    var pTech = this._pActiveTechnique;
    return pTech._pPasses[pTech._nCurrentPass].pShaderBlend.program();
};


Effect.prototype.mat4 = function (sName, iElements) {
    var t = new a.EffectMat4(sName, iElements);
    this.param = t;
    return t;
};

Effect.prototype.mat3 = function (sName, iElements) {
    var t = new a.EffectMat3(sName, iElements);
    this.param = t;
    return t;
};


Effect.prototype.vec4 = function (sName, iElements) {
    var t = new a.EffectVec4(sName, iElements);
    this.param = t;
    return t;
};

Effect.prototype.vec3 = function (sName, iElements) {
    var t = new a.EffectVec3(sName, iElements);
    this.param = t;
    return t;
};

Effect.prototype.float32 = function (sName) {
    var t = new a.EffectFloat32(sName);
    this.param = t;
    return t;
};

Effect.prototype.texture = function (sName, iElements) {
    var t = new a.EffectTexture(sName, iElements);
    this.param = t;
    return t;
};

Effect.prototype.sampler = function (sName) {
    var t = new a.EffectSampler(sName);
    this.param = t;
    return t;
};


Effect.prototype.vertex = function (sName) {
    var t = new a.EffectFragment(sName, a.ParameterDesc.Type.VERTEXFRAGMENT);
    this._pVertexFragments[sName] = t;
    return t;
};

Effect.prototype.pixel = function (sName) {
    var t = new a.EffectFragment(sName, a.ParameterDesc.Type.PIXELFRAGMENT);
    this._pPixelFragments[sName] = t;
    return t;
};

Effect.prototype.technique = function (sName) {
    var t = new a.EffectTechnique(sName);
    t._pEffect = this;
    t._pDevice = this._pDevice;
    t._pEngine = this._pEngine;
    this._pTechniques.push(t);
    this._pTechniquesByName[sName] = t;
    return t;
};

Effect.prototype.shader = function (sName) {
    var t = new a.EffectShader(sName);
    t._pEffect = this;
    this._pShaders.push(t);
    this._pShadersByName[sName] = t;
    return t;
};

/**
 * Получить описание эффекта.
 * @tparam EffectDesc Структура описания эффекта.
 * @treturn EffectDesc Описание эффекта.
 */
Effect.prototype.getDesc = function (pEffectDesc) {
    if (pEffectDesc instanceof a.EffectDesc) {
        pEffectDesc.nTechniques = this._pTechniques.length;
        pEffectDesc.nParameters = this._pParameters.length;
        pEffectDesc.sDesc = this._sDesc;
        return pEffectDesc;
    }
    else {
        return new a.EffectDesc(this._sDesc, this._pParameters.length,
                                this._pTechniques.length);
    }
};

/**
 * Получить первую подходящую технику.
 * @treturn String Имя техники, которая валидна.
 */
Effect.prototype.findNextValidTechnique = function (sTechnique) {
    sTechnique = ifndef(sTechnique, null);

    var pTechs = this._pTechniques;
    var isFindNext = true;
    for (var i = 0, n = pTechs.length; i < n; ++i) {
        if (sTechnique && isFindNext) {
            if (pTechs[i]._sName == sTechnique) {
                isFindNext = false;
            }
            else {
                continue;
            }
        }
        if (pTechs[i].isValid()) {
            return pTechs[i]._sName;
        }
    }
    return null;
};

Effect.prototype.getTechnique = function (iTechnique) {
    var pTechs = this._pTechniques;
    return (pTechs[iTechnique]? pTechs[iTechnique]._sName: null);
};

/**
 * Получить описание техники.
 * @tparam String sTechnique Имя техники.
 * @tparam EffectTechniqueDesc pTechniqueDesc
 */
Effect.prototype.getTechniqueDesc = function (sTechnique, pTechniqueDesc) {
    var pTech = this._pTechniquesByName[sTechnique];
    if (pTechniqueDesc instanceof a.EffectTechniqueDesc) {
        pTechniqueDesc.nPasses = pTech._pPasses.length;
        pTechniqueDesc.sName = pTech._sName;
        return pTechniqueDesc;
    }
    else {
        return new a.EffectTechniqueDesc(pTech._sName, pTech._pPasses.length);
    }
};

Effect.prototype.getPass = function (sTechnique, iPass) {
    var pTech = this._pTechniquesByName[sTechnique];
    var pPass = null;
    return (pTech && (pPass = pTech.getPass(iPass))? pPass.sName: null);
};

Effect.prototype.getPassDesc = function (sPass, pPassDesc) {
    return {nVSSemanticsUsed: 0};
};

/**
 * Выбрать активную технику.
 * @tparam sTechnique
 * @treturn Boolean Удалось ли выбрать технику.
 */
Effect.prototype.setTechnique = function (sTechnique) {
    var res = this._pActiveTechnique = this._pTechniquesByName[sTechnique];
    return (res ? true : false);
};

Effect.prototype.applyVertexBuffer = function (pBuffer) {
    var pBlend = this._pActiveTechnique.currentBlend();
    var pLastProg = pBuffer.getShaderProgram();
    var pCurProg = pBlend.program();

    if (pLastProg != pCurProg) {
        pBuffer.setShaderProgram(pCurProg);
        if (!pBuffer.loadAttribLocation()) {
            console.log("cannot load attrib location");
        }
    }

    pBuffer.activate();
}


Effect.prototype.getParameter = function (sParameter, nIndex) {
    sParameter = ifndef(sParameter, null);
    if (sParameter == null) {
        return this._pParameters[nIndex].sName;
    }
    else {
        TODO('get struct member');
    }
}


/**
 * Получить текущий context.
 */
Effect.prototype.getDevice = function () {
    return this._pDevice;
};


a.createEffectFromFile = function (pEngine, sSrcFile, fnCallback) {
    var sFilename;
    if (a.fx[sSrcFile]) {
        fnCallback(true, new a.fx[sSrcFile](pEngine));
        return;
    }
    //console.log(sSrcFile);
    a.fopen(sSrcFile).read(function (pData) {
                               eval((Preprocessor? Preprocessor.code(pData): pData));
                               a.fx[sSrcFile] = a.fx.LastEffect;
                               a.createEffectFromFile(pEngine, sSrcFile, fnCallback);
                           },
                           function () {
                               fnCallback(false, null);
                           });
}

Effect.pLoadedEffects = {};
Effect.pActiveTextures = new Array(32);
Effect.nLastActiveTexture = -1;


a.EffectPass = EffectPass;
a.EffectTechnique = EffectTechnique;
a.Effect = Effect;
a.EffectDesc = EffectDesc;
a.EffectParam = EffectParam;
a.EffectTechniqueDesc = EffectTechniqueDesc;
a.EffectTexture = EffectTexture;
a.EffectVec4 = EffectVec4;
a.EffectVec3 = EffectVec3;
a.EffectMat4 = EffectMat4;
a.EffectMat3 = EffectMat3;
a.EffectFloat32 = EffectFloat32;
a.EffectSampler = EffectSampler;
a.EffectShader = EffectShader;
a.EffectSamplerParam = EffectSamplerParam;
a.EffectFragment = EffectFragment;
a.EffectPassState = EffectPassState;
