Define(SM_INVALID_EFFECT, -1);
Define(SM_INVALID_TECHNIQUE, -1);
Define(SM_UNKNOWN_PASS, -1);

a.fx.ZEROSAMPLER = 19;

function ShaderProgram2(sHash, pEngine) {
    this.pEngine = pEngine;
    this._sHash = sHash;
    //console.log(pEngine);
    this._pDevice = pEngine.pDevice;
    this._pShaderManager = pEngine.shaderManager();
    this._sFragmentCode = "#ifdef GL_ES\nprecision lowp float;\n#endif\n" +
                          "void main(void){gl_FragColor = vec4(vec3(0.), 1.);}";
    this._sVertexCode = "void main(void){gl_Position = vec4(vec3(0.), 1.);}";
    this._pAttrToReal = null;
    this._pATRKeys = null;
    this._pAttrToBuffer = null;
    this._pATBKeys = null;
    this._pSamplersToReal = null;
    this._pBuffersToReal = null;
    this._pRealAttr = null;
    this._pRealSamplers = null;
    this._pRealUniformList = {};
    this._pUniformKeys = null;
    this._pHardwareProgram = null;
    this._pUniformVars = null;
    this._pOffsets = null;
    this._pBuffers = null;
    this._pStreams = null;
    this._pTextureSlots = null;
    this._nActiveTimes = 0;
    this._pPassBlend = null;
    this._pTextures = null;
    this._isZeroSampler = false;
}
ShaderProgram2.prototype._buildShader = function (eType, sCode) {
    var pDevice = this._pDevice;
    var pShader = pDevice.createShader(eType);

    pDevice.shaderSource(pShader, sCode);
    pDevice.compileShader(pShader);

    debug_assert_win(pDevice.getShaderParameter(pShader, pDevice.COMPILE_STATUS),
                     'cannot compile shader', this._shaderInfoLog(pShader, eType));

    return pShader;
};
/**
 * Build shader program.
 * @tparam String sVertexCode Source code of vertex shader.
 * @tparam String sPixelCode Source code of pixel shader.
 * @treturn Boolean
 */
ShaderProgram2.prototype.create = function (sVertexCode, sFragmentCode, bSetup) {
    var pHardwareProgram, pDevice = this._pDevice;

    this._sVertexCode = sVertexCode = sVertexCode || this._sVertexCode;
    this._sFragmentCode = sFragmentCode = sFragmentCode || this._sFragmentCode;

    pHardwareProgram = this._pHardwareProgram = pDevice.createProgram();
    var pVertexShader = this._buildShader(a.SHADERTYPE.VERTEX, sVertexCode);
    var pPixelShader = this._buildShader(a.SHADERTYPE.PIXEL, sFragmentCode);
    pDevice.attachShader(pHardwareProgram, pVertexShader);
    pDevice.attachShader(pHardwareProgram, pPixelShader);
    pDevice.linkProgram(pHardwareProgram);
    if (!pDevice.getProgramParameter(pHardwareProgram, pDevice.VALIDATE_STATUS)) {
        //trace('program not valid', this.findResourceName());
        //trace(pDevice.getProgramInfoLog(pHardwareProgram));
    }
    debug_assert_win(pDevice.getProgramParameter(pHardwareProgram, pDevice.LINK_STATUS),
                     'cannot link program', this._programInfoLog(pHardwareProgram, pVertexShader, pPixelShader));
    this._isValid = true;

    return true;
};
ShaderProgram2.prototype.setup = function (pAttrData, pUniformData, pTextures) {
    var pDevice = this._pDevice;
    var pProgram = this._pHardwareProgram;
    var pUniforms = this._pRealUniformList;
    var pOffsets = {},
        pBuffers = {};
    var pUniformsKeys = [];
    var pSamplers = this._pPassBlend.pSamplers,
        pGlobalBuffers = this._pPassBlend.pGlobalBuffers;
    var i = 0;
    var pKeys;
    var sKey1,
        sOffset,
        sSampler,
        sTexture;
    var pData, pTexture;
    var pRealAttr = this._pRealAttr,
        pAttrReal = this._pAttrToReal,
        pRealSamplers = this._pRealSamplers,
        pBufReal = this._pAttrToBuffer;
    for (i = 0; i < pRealAttr.length; i++) {
        pRealAttr[i] = pDevice.getAttribLocation(pProgram, a.fx.SHADER_PREFIX.ATTRIBUTE + i);
    }
    for (i = 0; i < pRealSamplers.length; i++) {
        sSampler = a.fx.SHADER_PREFIX.SAMPLER + i;
        pUniforms[sSampler] = pRealSamplers[i] = pDevice.getUniformLocation(pProgram, sSampler);
    }
    pKeys = this._pATRKeys;
    for (i = 0; i < pKeys.length; i++) {
        sKey1 = pKeys[i];
        pData = pAttrData[sKey1];
        if (pAttrReal[sKey1] !== undefined) {
            pAttrReal[sKey1] = pRealAttr[pAttrReal[sKey1]];
            if (pData.eType === a.BufferMap.FT_MAPPABLE) {
                sOffset = a.fx.SHADER_PREFIX.OFFSET + sKey1;
                pUniforms[sOffset] = pDevice.getUniformLocation(pProgram, sOffset);
                pOffsets[sOffset] = null;
                pBuffers[a.fx.SHADER_PREFIX.SAMPLER + this._pAttrToBuffer[sKey1]] = null;
                pUniformsKeys.push(sOffset);
                pUniformsKeys.push(a.fx.SHADER_PREFIX.SAMPLER + this._pAttrToBuffer[sKey1]);
            }
        }
    }
    if (this._isZeroSampler) {
        pUniforms[PassBlend.sZeroSampler] = pDevice.getUniformLocation(pProgram, PassBlend.sZeroSampler);
    }
    pKeys = Object.keys(pUniformData);
    for (i = 0; i < pKeys.length; i++) {
        sKey1 = pKeys[i];
        pData = pUniformData[sKey1];
        if (pUniforms[sKey1]) {
            warning("Something going wrong! very wrong!");
            return false;
        }
        if (this._pSamplersToReal[sKey1] === undefined && this._pBuffersToReal[sKey1] === undefined) {
            pUniforms[sKey1] = pDevice.getUniformLocation(pProgram, sKey1);
        }
        pUniformsKeys.push(sKey1);
    }
    this._pUniformKeys = pUniformsKeys;
    this._pStreams = new Array(pRealAttr.length);
    this._pOffsets = pOffsets;
    this._pBuffers = pBuffers;
    this._pTextureSlots = new Array(a.info.graphics.maxTextureImageUnits(this._pDevice));
    this._pTextureParams = new Array(a.info.graphics.maxTextureImageUnits(this._pDevice));

    function fnDefaultTexParametr() {
        var obj = {};
        obj[a.TPARAM.MAG_FILTER] = null;
        obj[a.TPARAM.MIN_FILTER] = null;
        obj[a.TPARAM.WRAP_S] = null;
        obj[a.TPARAM.WRAP_T] = null;
        return obj;
    }

    for (i = 0; i < this._pTextureParams.length; i++) {
        this._pTextureParams[i] = fnDefaultTexParametr();
    }

    return true;
};
ShaderProgram2.prototype.generateInputData = function (pAttrData, pUniformData) {
    //TODO: pool object from cache not create
    //TODO: In pAttrs push only unique VertexData
    var pAttrs = new Array(this._pRealAttr.length);
    var i;
    var pKeys = this._pATRKeys,
        pAttrReal = this._pAttrToReal;
    var sKey,
        sType,
        sOffset,
        sBuf;
    var pData,
        pType;
    for (i = 0; i < pKeys.length; i++) {
        sKey = pKeys[i];
        pData = pAttrData[sKey];
        if (pData !== null) {
            if (pData.eType !== a.BufferMap.FT_MAPPABLE) {
                pAttrs[pAttrReal[sKey]] = pData;
                continue;
            }
            pAttrs[pAttrReal[sKey]] = pData.pMapper.pData;
            sOffset = a.fx.SHADER_PREFIX.OFFSET + sKey;
            if (pUniformData[sOffset] !== undefined) {
                warning("something wrong with offset");
                continue;
            }
            pUniformData[sOffset] = pData.pData.getVertexDeclaration().element(sKey).iOffset;
            sBuf = a.fx.SHADER_PREFIX.SAMPLER + this._pAttrToBuffer[sKey];
            pUniformData[sBuf] = pData.pData.buffer;
        }
    }
    return pAttrs;
};

ShaderProgram2.prototype.applyUniform = function (sName, pData) {
    var pType, sType;
    if (this._pUniformVars[sName]) {
        pType = this._pUniformVars[sName].pType.pEffectType;
        if (!pType.isBase()) {
            warning("!!!!We don`t support complex type of uniforms yet! But it coming soon!");
            return;
        }
        sType = pType.toCode();
        switch (sType) {
            case "float":
                this.applyFloat(sName, pData);
                break;
            case "int":
                this.applyInt(sName, pData);
                break;
            case "vec2":
                this.applyVec2(sName, pData);
                break;
            case "vec3":
                this.applyVec3(sName, pData);
                break;
            case "vec4":
                this.applyVec4(sName, pData);
                break;
            case "mat4":
                this.applyMat4(sName, pData);
                break;
            case "sampler2D":
                if (this._pPassBlend.pSamplers[sName]) {
                    this.applySampler2D(sName, pData);
                }
                else {
                    this.applyVideoBuffer(sName, pData);
                }
                break;
            default:
                warning("Another base types are not support yet");
        }
        return;
    }
    else if (this._pOffsets[sName] === null) {
        this.applyFloat(sName, pData);
    }
    else if (this._pBuffers[sName] === null) {
        this.applyVideoBuffer(sName, pData);
    }
    else {
        trace("applyUniform----->", sName, pData);
        warning("You should not be here. Something bad have been happened with uniforms.");
    }
};
ShaderProgram2.prototype.applyFloat = function (sName, pData) {
    var pDevice = this._pDevice;
    pDevice.uniform1f(this._pRealUniformList[sName], pData);
};
ShaderProgram2.prototype.applyInt = function (sName, pData) {
    var pDevice = this._pDevice;
    pDevice.uniform1i(this._pRealUniformList[sName], pData);
};
ShaderProgram2.prototype.applyVec2 = function (sName, pData) {
    var pDevice = this._pDevice;
    pDevice.uniform2fv(this._pRealUniformList[sName], pData);
};
ShaderProgram2.prototype.applyVec3 = function (sName, pData) {
    var pDevice = this._pDevice;
    pDevice.uniform3fv(this._pRealUniformList[sName], pData);
};
ShaderProgram2.prototype.applyVec4 = function (sName, pData) {
    var pDevice = this._pDevice;
    pDevice.uniform4fv(this._pRealUniformList[sName], pData);
};
ShaderProgram2.prototype.applyMat4 = function (sName, pData) {
    var pDevice = this._pDevice;
    pDevice.uniformMatrix4fv(this._pRealUniformList[sName], false, pData);
};
ShaderProgram2.prototype.applyVideoBuffer = function (sName, pData) {
    if (pData === null) {
        return true;
    }
    var sRealName;
    console.log("Video_buffer::::::::::: ", sName, this);
    if (this._pBuffersToReal[sName]) {
        sRealName = a.fx.SHADER_PREFIX.SAMPLER + this._pBuffersToReal[sName];
    }
    else {
        sRealName = sName;
    }
    var iSlot = this._pShaderManager.activateTexture(pData);
    var pTextureParam = this._pTextureParams[iSlot];
    pTextureParam[a.TPARAM.MAG_FILTER] = pData._getParameter(a.TPARAM.MAG_FILTER) ||
                                         a.TFILTER.LINEAR;
    pTextureParam[a.TPARAM.MIN_FILTER] = pData._getParameter(a.TPARAM.MIN_FILTER) ||
                                         a.TFILTER.LINEAR;
    pTextureParam[a.TPARAM.WRAP_S] = pData._getParameter(a.TPARAM.WRAP_S) ||
                                     a.TWRAPMODE.REPEAT;
    pTextureParam[a.TPARAM.WRAP_T] = pData._getParameter(a.TPARAM.WRAP_T) ||
                                     a.TWRAPMODE.REPEAT;
    return this.applyInt(sRealName, iSlot);
};
ShaderProgram2.prototype.applySampler2D = function (sName, pData) {
    var sTexture, pTexture;
    if (!pData) {
        return true;
    }
    sTexture = pData[a.fx.GLOBAL_VARS.TEXTURE];
    if (typeof(sTexture) === "object") {
        pTexture = sTexture;
    }
    else {
        pTexture = this._pTextures ? (this._pTextures[sTexture]) : null;
    }
    if (!pTexture) {
        return true;
    }
    var sRealName = a.fx.SHADER_PREFIX.SAMPLER + this._pSamplersToReal[sName];
    var iSlot = this._pShaderManager.activateTexture(pTexture);
    var pTextureParam = this._pTextureParams[iSlot];
    pTextureParam[a.TPARAM.MAG_FILTER] = pData[a.TPARAM.MAG_FILTER] ||
                                         pTexture._getParameter(a.TPARAM.MAG_FILTER) ||
                                         a.TFILTER.LINEAR;
    pTextureParam[a.TPARAM.MIN_FILTER] = pData[a.TPARAM.MIN_FILTER] ||
                                         pTexture._getParameter(a.TPARAM.MIN_FILTER) ||
                                         a.TFILTER.LINEAR;
    pTextureParam[a.TPARAM.WRAP_S] = pData[a.TPARAM.WRAP_S] ||
                                     pTexture._getParameter(a.TPARAM.WRAP_S) ||
                                     a.TWRAPMODE.REPEAT;
    pTextureParam[a.TPARAM.WRAP_T] = pData[a.TPARAM.WRAP_T] ||
                                     pTexture._getParameter(a.TPARAM.WRAP_T) ||
                                     a.TWRAPMODE.REPEAT;
    return this.applyInt(sRealName, iSlot);
};
ShaderProgram2.prototype.applyData = function (pVertexData) {
    var pDevice = this._pDevice;
    var iOffset = 0;
    var iStride = pVertexData.getStride();
    var pManager = this._pShaderManager;
    var pAttrs = this._pAttrToReal,
        iStream,
        pDecl;
    var pVertexElement;
    var pVertexBuffer = pVertexData.buffer;
    var iState = pManager.getRenderResourceState(pVertexBuffer);
    pDecl = pVertexData.getVertexDeclaration();
    pManager.activateVertexBuffer(pVertexBuffer);
    for (var i = 0; i < pDecl.length; i++) {
        pVertexElement = pDecl[i];
        iStream = pAttrs[pVertexElement.eUsage];
        if (iStream === undefined) {
            continue;
        }
        if (this._pStreams[iStream] === iState) {
            continue;
        }
        this._pStreams[iStream] = iState;
        trace(pVertexElement.eUsage, '-->', 'pDevice.vertexAttribPointer(', iStream,
              pVertexElement.nCount,
              pVertexElement.eType,
              false,
              iStride,
              pVertexElement.iOffset, ')');
        pDevice.vertexAttribPointer(iStream,
                                    pVertexElement.nCount,
                                    pVertexElement.eType,
                                    false,
                                    iStride,
                                    pVertexElement.iOffset);
    }
    return true;
};

ShaderProgram2.prototype.setCurrentTextureSet = function (pTextures) {
    this._pTextures = pTextures;
};
ShaderProgram2.prototype.setAttrParams = function (pAttrToReal, pAttrToBuffer, pSamplersToReal, pBuffersToReal, nAttr,
                                                   nRealSamplers) {
    this._pAttrToReal = pAttrToReal;
    this._pAttrToBuffer = pAttrToBuffer;
    this._pBuffersToReal = pBuffersToReal;
    this._pSamplersToReal = pSamplersToReal;
    this._pATRKeys = Object.keys(pAttrToReal);
    this._pATBKeys = Object.keys(pAttrToBuffer);
    this._pRealAttr = new Array(nAttr);
    this._pRealSamplers = new Array(nRealSamplers);
};
ShaderProgram2.prototype.setUniformVars = function (pUniforms, isZeroSampler) {
    this._pUniformVars = pUniforms;
    this._isZeroSampler = isZeroSampler || false;
};
ShaderProgram2.prototype.setTextureSlot = function (iSlot, pTexture) {
    this._pTextureSlots[iSlot] = this._nActiveTimes;
};

ShaderProgram2.prototype.getSourceCode = function (eType) {
    return (eType === a.SHADERTYPE.VERTEX ? this._sVertexCode : this._sFragmentCode);
};
ShaderProgram2.prototype.getEmptyTextureSlot = function () {
    var i;
    var pSlots = this._pTextureSlots;
    for (i = 0; i < pSlots.length; i++) {
        if (pSlots[i] !== this._nActiveTimes) {
            return i;
        }
    }
};
ShaderProgram2.prototype.getStreamData = function (iStream) {
    return this._pStreams[iStream];
};
ShaderProgram2.prototype.getStreamNumber = function () {
    return this._pRealAttr.length;
};

ShaderProgram2.prototype.activate = function () {
    this._nActiveTimes++;
    this._pDevice.useProgram(this._pHardwareProgram);
    if (this._isZeroSampler) {
        this.applyInt(PassBlend.sZeroSampler, a.fx.ZEROSAMPLER);
    }
};
ShaderProgram2.prototype.deactivate = function () {
    this._pDevice.useProgram(null);
};
ShaderProgram2.prototype.isActive = function () {
    return this._pDevice.getParameter(this._pDevice.CURRENT_PROGRAM) === this._pHardwareProgram;
};
ShaderProgram2.prototype.activateTextures = function () {
    var i = 0;
    var iCheck = this._nActiveTimes;
    for (i = 0; i < this._pTextureSlots.length; i++) {
        if (this._pTextureSlots[i] === iCheck) {
            console.log("Activate slot #" + i);
            this._pShaderManager._activateTextureSlot(i, this._pTextureParams[i]);
        }
    }
};

ShaderProgram2.prototype._programInfoLog = function (pHardwareProgram, pVertexShader, pPixelShader) {
    var pShaderDebugger = this.pEngine.getDevice().getExtension("WEBGL_debug_shaders");

    if (pShaderDebugger) {
        trace('translated vertex shader =========>');
        trace(pShaderDebugger.getTranslatedShaderSource(pVertexShader));
        trace('translated pixel shader =========>');
        trace(pShaderDebugger.getTranslatedShaderSource(pPixelShader));
    }

    return '<pre style="background-color: #FFCACA;">' + this._pDevice.getProgramInfoLog(this._pHardwareProgram) +
           '</pre>' + '<hr />' +
           '<pre>' + this.getSourceCode(a.SHADERTYPE.VERTEX) + '</pre><hr />' +
           '<pre>' + this.getSourceCode(a.SHADERTYPE.PIXEL) + '</pre>'
};
ShaderProgram2.prototype._shaderInfoLog = function (pShader, eType) {
    var sCode = this.getSourceCode(eType), sLog;
    var tmp = sCode.split('\n');

    sCode = '';
    for (var i = 0; i < tmp.length; i++) {
        sCode += (i + 1) + '| ' + tmp[i] + '\n';

    }

    sLog = this._pDevice.getShaderInfoLog(pShader);

    return '<div style="background: #FCC">' +
           '<pre>' + sLog + '</pre>' +
           '</div>' +
           '<pre style="background-color: #EEE;">' + sCode + '</pre>';
};

ShaderProgram2.prototype.clear = function () {
    var i = 0;
    for (i = 0; i < this._pStreams.length; i++) {
        this._pStreams[i] = null;
    }
};

function ComponentBlend() {
    this.pPassBlends = null;
    this.pUniformsBlend = null;
    this.sHash = "";
    this.pComponentsHash = {};
    this.pComponentsCount = {};
    this.pComponentsShift = [];
    this.pComponents = [];
    this._pMaps = null;
    this._isReady = false;
    this._id = 0;
    this._nShiftMin = 0;
    this._nShiftMax = 0;
    this._nShiftCurrent = 0;
    this._nTotalValidPasses = -1;
    this._hasTextures = false;
}
ComponentBlend.prototype.hasTextures = function () {
    return this._hasTextures;
};
ComponentBlend.prototype.addComponent = function (pComponent, nShift) {
    //TODO: think about global uniform lists and about collisions of real names in them
    var i, j;
    var sName;
    sName = pComponent.hash(nShift);
    if (this.pComponentsHash[sName]) {
        this.pComponentsCount[sName]++;
        warning("You try to add already used component in blend");
        return;
    }
    if (nShift < this._nShiftMin) {
        this._nShiftMin = nShift;
    }
    else if (nShift > this._nShiftMax) {
        this._nShiftMax = nShift;
    }
    this.sHash += sName + ":";
    this.pComponentsHash[sName] = pComponent;
    this.pComponentsCount[sName] = 1;
    this.pComponents.push(pComponent);
    this.pComponentsShift.push(nShift);
    this._isReady = false;
};
ComponentBlend.prototype.addBlend = function (pBlend, nShift) {
    var i;
    var pNewBlend;
    pNewBlend = this.cloneMe();
    pNewBlend._nShiftCurrent = nShift > 0 ? nShift : 0;
    pNewBlend._nTotalValidPasses = pBlend.totalValidPasses();
    for (i = 0; i < pBlend.pComponents.length; i++) {
        pNewBlend.addComponent(pBlend.pComponents[i], pBlend.pComponentsShift[i] + nShift);
    }
    return pNewBlend;
};
ComponentBlend.prototype.finalize = function () {
    if (this._isReady) {
        return true;
    }
    var i, j;
    var pComponent;
    var nShift;
    var pPass;
    var pUniforms;
    var pVar1, pVar2;
    var sName;
    this.pPassBlends = [];
    this.pUniformsBlend = [];

    for (j = 0; j < this.pComponents.length; j++) {
        pComponent = this.pComponents[j];
        nShift = this.pComponentsShift[j] - this._nShiftMin;

        for (i = 0; i < pComponent.pPasses.length; i++) {
            if (!this.pPassBlends[i + nShift]) {
                this.pPassBlends[i + nShift] = [];
                this.pUniformsBlend[i + nShift] = {
                    "pUniformsByName"     : {},
                    "pUniformsByRealName" : {},
                    "pUniformsDefault"    : {},
                    "pTexturesByName"     : {},
                    "pTexturesByRealName" : {}
                };
            }
            pPass = pComponent.pPasses[i];
            this.pPassBlends[i + nShift].push(pPass);
            pUniforms = this.pUniformsBlend[i + nShift];
            for (j in pPass.pTexturesByName) {
                sName = pUniforms.pTexturesByName[j] = pPass.pTexturesByName[j];
                pUniforms.pTexturesByRealName[sName] = null;
                this._hasTextures = true;
            }

            for (j in pPass.pGlobalsByName) {
                sName = pPass.pGlobalsByName [j];
                pUniforms.pUniformsByName[j] = sName;
                pVar1 = pUniforms.pUniformsByRealName[sName];
                pVar2 = pPass.pGlobalsByRealName[sName];
                if (pVar1 && !pVar1.pType.isEqual(pVar2.pType)) {
                    warning("You used uniforms with the same semantics. Now we work not very well with that.");
                }
                pUniforms.pUniformsByRealName[sName] = pVar2;
                pUniforms.pUniformsDefault[sName] = pPass.pGlobalsDefault[sName];
            }

            if (!pUniforms._hasKeys) {
                pUniforms._hasKeys = true;
                pUniforms._pUniformByNameKeys = Object.keys(pUniforms.pUniformsByName);
                pUniforms._pTextureByNameKeys = Object.keys(pUniforms.pTexturesByName);
                pUniforms._pTextureByRealNameKeys = Object.keys(pUniforms.pTexturesByRealName);
                pUniforms._pUniformByRealNameKeys = Object.keys(pUniforms.pUniformsByRealName);
            }
        }

    }
    this._isReady = true;
    this._pMaps = new Array(this.pPassBlends[i]);

    return true;
};
ComponentBlend.prototype.cloneMe = function () {
    var pClone = new a.fx.ComponentBlend();
    var i;
    for (i = 0; i < this.pComponents.length; i++) {
        pClone.pComponents[i] = this.pComponents[i];
        pClone.pComponentsShift[i] = this.pComponentsShift[i];
    }
    for (i in this.pComponentsHash) {
        pClone.pComponentsHash[i] = this.pComponentsHash[i];
        pClone.pComponentsCount[i] = this.pComponentsCount[i];
    }
    pClone._nShiftMin = this._nShiftMin;
    pClone._nShiftMax = this._nShiftMax;
    pClone._nShiftCurrent = this._nShiftCurrent;
    pClone._nTotalValidPasses = this._nTotalValidPasses;
    return pClone;
};
ComponentBlend.prototype.hasComponent = function (sComponent) {
    return !!(this.pComponentsHash[sComponent]);
};
ComponentBlend.prototype.isReady = function () {
    return this._isReady;
};
ComponentBlend.prototype.totalPasses = function () {
    return this.pPassBlends ? this.pPassBlends.length : 0;
};
ComponentBlend.prototype.totalValidPasses = function () {
    return this._nTotalValidPasses > 0 ? this._nTotalValidPasses : this.totalPasses();
};
A_NAMESPACE(ComponentBlend, fx);

var SHADER_PREFIX = {
    SAMPLER   : "A_s_",
    HEADER    : "A_h_",
    ATTRIBUTE : "A_a_",
    OFFSET    : "A_o_"
};
A_NAMESPACE(SHADER_PREFIX, fx);

function PassBlend(pEngine) {
    this.pEngine = pEngine;
    this.sHash = "";
    this._id = null;
    this.pPasses = [];
    this.pVertexShaders = [];
    this.pFragmentShaders = [];
    this.pStates = {};

    this.pTypesBlockV = {};
    this.pUniformsV = {};
    this.pUniformsBlockV = {};
    this.pMixedTypesV = {};
    this.pFuncDefBlockV = {};
    this.pGlobalVarBlockV = {};
    this.pFuncDeclBlockV = {};
    this.pAttributes = {};
    /**
     * Block of:
     * varying TYPE some_variable;
     * @type {Object}
     */
    this.pVaryingsDef = {};
    /**
     * Block of:
     * some_variable = OUT.some_variable;
     * @type {Object}
     */
    this.pVaryingsBlock = {};
    this.pVaryings = {};
    this.sVaryingsOut = "";

    this.pAttributePointers = {};

    this.pTypesBlockF = {};
    this.pUniformsF = {};
    this.pUniformsBlockF = {};
    this.pMixedTypesF = {};
    this.pFuncDefBlockF = {};
    this.pGlobalVarBlockF = {};
    this.pFuncDeclBlockF = {};

    this.pGlobalBuffers = {};
    this.pGlobalBuffersV = {};
    this.pGlobalBuffersF = {};
    this.pAttrBuffers = {};
    this.pSamplers = {};
    this.pSamplersV = {};
    this.pSamplersF = {};

    this._pSamplersToReal = {};
    this._pBuffersToReal = {};

    this._pRealSamplersDecl = null;
    this._pRealBuffesDecl = null;
    this._pRealBuffesInit = null;
    this._pRealAttrDecl = null;

    this._pRealSamplersUsage = new Array(30);
    this._initSystemData();


    this.pExtrectedFunctionsV = {};
    this.pExtrectedFunctionsF = {};

    this.pUniforms = {};

    this._pBlendTypes = {};
    this._pBlendTypesDecl = {};
    this._nBlendTypes = 1;
    STATIC(pExtractedFunctions, {
        "header" : "void A_extractTextureHeader(const sampler2D src, out A_TextureHeader texture) {" +
                   "vec4 v = texture2D(src, vec2(0.)); " +
                   "texture = A_TextureHeader(v.r, v.g, v.b, v.a);}\n",
        "float"  : "float A_extractFloat(const sampler2D sampler, const A_TextureHeader header, const float offset) {" +
                   "float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " +
                   "float y = floor(pixelNumber / header.width) + .5; " +
                   "float x = mod(pixelNumber, header.width) + .5; " +
                   "int shift = int(mod(offset, A_VB_ELEMENT_SIZE)); " +
                   "\n#ifdef A_VB_COMPONENT4\n" +
                   "if(shift == 0) return A_tex2D(sampler, header, x, y).r; " +
                   "else if(shift == 1) return A_tex2D(sampler, header, x, y).g; " +
                   "else if(shift == 2) return A_tex2D(sampler, header, x, y).b; " +
                   "else if(shift == 3) return A_tex2D(sampler, header, x, y).a; " +
                   "\n#endif\n" +
                   "return 0.;}\n",
        "vec2"   : "vec2 A_extractVec2(const sampler2D sampler, const A_TextureHeader header, const float offset){" +
                   "float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " +
                   "float y = floor(pixelNumber / header.width) + .5; " +
                   "float x = mod(pixelNumber, header.width) + .5; " +
                   "int shift = int(mod(offset, A_VB_ELEMENT_SIZE)); " +
                   "\n#ifdef A_VB_COMPONENT4\n" +
                   "if(shift == 0) return A_tex2D(sampler, header, x, y).rg; " +
                   "else if(shift == 1) return A_tex2D(sampler, header, x, y).gb; " +
                   "else if(shift == 2) return A_tex2D(sampler, header, x, y).ba; " +
                   "else if(shift == 3) { " +
                   "if(int(x) == int(header.width - 1.)) " +
                   "return vec2(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, 0., (y + 1.)).r); " +
                   "else " +
                   "return vec2(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, (x + 1.), y).r); " +
                   "} " +
                   "\n#endif\n" +
                   "return vec2(0.); }\n",
        "vec3"   : "vec3 A_extractVec3(const sampler2D sampler, const A_TextureHeader header, const float offset){" +
                   "float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " +
                   "float y = floor(pixelNumber / header.width) + .5; " +
                   "float x = mod(pixelNumber, header.width) + .5; " +
                   "int shift = int(mod(offset, A_VB_ELEMENT_SIZE)); " +
                   "\n#ifdef A_VB_COMPONENT4\n" +
                   "if(shift == 0) return A_tex2D(sampler, header, x, y).rgb; " +
                   "else if(shift == 1) return A_tex2D(sampler, header, x, y).gba; " +
                   "else if(shift == 2){ " +
                   "if(int(x) == int(header.width - 1.))  return vec3(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, 0., (y + 1.)).r); " +
                   "else return vec3(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, (x + 1.), y).r);} " +
                   "else if(shift == 3){ " +
                   "if(int(x) == int(header.width - 1.))  return vec3(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, 0., (y + 1.)).rg); " +
                   "else return vec3(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, (x + 1.), y).rg);} " +
                   "\n#endif\n" +
                   "\n#ifdef A_VB_COMPONENT3\n" +
                   "if(shift == 0) return A_tex2D(sampler, header,vec2(x,header.stepY*y)).rgb; " +
                   "else if(shift == 1){ " +
                   "if(x == header.width - 1.) return vec3(A_tex2D(sampler, header, x, y).gb, A_tex2D(sampler, header, 0., (y + 1.)).r); " +
                   "else return vec3(A_tex2D(sampler, header, x, y).gb, A_tex2D(sampler, header, (x + 1.), y).r);} " +
                   "else if(shift == 3){ " +
                   "if(x == header.width - 1.) return vec3(A_tex2D(sampler, header, x, y).b, A_tex2D(sampler, header, 0., (y + 1.)).rg); " +
                   "else return vec3(A_tex2D(sampler, header, x, y).b, A_tex2D(sampler, header, (x + 1)., y).rg);} " +
                   "\n#endif\n" +
                   "return vec3(0);}\n",
        "vec4"   : "vec4 A_extractVec4(const sampler2D sampler, const A_TextureHeader header, const float offset){ " +
                   "float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " +
                   "float y = floor(pixelNumber / header.width) + .5; " +
                   "float x = mod(pixelNumber, header.width) + .5; " +
                   "int shift = int(mod(offset, A_VB_ELEMENT_SIZE)); " +
                   "\n#ifdef A_VB_COMPONENT4\n" +
                   "if(shift == 0) return A_tex2D(sampler, header, x, y); " +
                   "else if(shift == 1){ " +
                   "if(int(x) == int(header.width - 1.)) " +
                   "return vec4(A_tex2D(sampler, header, x, y).gba, A_tex2D(sampler, header, 0., (y + 1.)).r); " +
                   "else " +
                   "return vec4(A_tex2D(sampler, header, x, y).gba, A_tex2D(sampler, header, (x + 1.), y).r);} " +
                   "else if(shift == 2){ " +
                   "if(int(x) == int(header.width - 1.)) " +
                   "return vec4(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, 0., (y + 1.)).rg); " +
                   "else " +
                   "return vec4(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, (x + 1.), y).rg);} " +
                   "else if(shift == 3){ " +
                   "if(int(x) == int(header.width - 1.)) " +
                   "return vec4(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, 0., (y + 1.)).rgb); " +
                   "else return vec4(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, (x + 1.), y).rgb);} " +
                   "\n#endif\n" +
                   "\n#ifdef A_VB_COMPONENT3\n" +
                   "\n#endif\n" +
                   "return vec4(0);}\n",
        "mat4"   : "vec2 A_findPixel(const A_TextureHeader header, const float offset) {" +
                   "float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " +
                   "return vec2(header.stepX * (mod(pixelNumber, header.width) + .5), header.stepY * (floor(pixelNumber / header.width) + .5));}\n" +
                   "mat4 A_extractMat4(const sampler2D sampler, const A_TextureHeader header, const float offset) {" +
                   "return mat4(A_tex2Dv(sampler, header, A_findPixel(header, offset))," +
                   "A_tex2Dv(sampler, header, A_findPixel(header, offset + 4.))," +
                   "A_tex2Dv(sampler, header, A_findPixel(header, offset + 8.))," +
                   "A_tex2Dv(sampler, header, A_findPixel(header, offset + 12.)));}\n",
        "init"   : "\n#ifdef GL_FRAGMENT_PRECISION_HIGH\n" +
                   "//#define texture2D(sampler, ) texture2D\n" +
                   "#else\n" +
                   "#define texture2D(A, B) texture2DLod(A, B, 0.)\n" +
                   "#endif\n" +
                   "#ifndef A_VB_COMPONENT3\n" +
                   "#define A_VB_COMPONENT4\n" +
                   "#endif\n" +
                   "#ifdef A_VB_COMPONENT4\n" +
                   "#define A_VB_ELEMENT_SIZE 4.\n" +
                   "#endif\n" +
                   "#ifdef A_VB_COMPONENT3\n" +
                   "#define A_VB_ELEMENT_SIZE 3.\n" +
                   "#endif\n" +
                   "#define A_tex2D(S, H, X, Y) texture2D(S, vec2(H.stepX * X , H.stepY * Y))\n" +
                   "#define A_tex2Dv(S, H, V) texture2D(S, V)\n" +
                   "struct A_TextureHeader {\n" +
                   "float width; " +
                   "float height; " +
                   "float stepX; " +
                   "float stepY; " +
                   "};\n"
    });
    STATIC(sZeroSamplerDecl, "uniform sampler2D A_zero_sampler;");
    STATIC(sZeroHeaderDecl, "A_TextureHeader A_zero_header;");
    STATIC(sZeroSampler, "A_zero_sampler");
    STATIC(sZeroHeader, "A_zero_header");
}

PassBlend.prototype._initSystemData = function () {
    if (PassBlend._pRealSamplersDecl) {
        this._pRealSamplersDecl = PassBlend._pRealSamplersDecl;
        this._pRealBuffesDecl = PassBlend._pRealBuffesDecl;
        this._pRealBuffesInit = PassBlend._pRealBuffesInit;
    }
    var pSamplersDecl = new Array(30);
    var pBufferDecl = new Array(30);
    var pBufferInit = new Array(30);
    var pAttrsDecl = new Array(30);
    var sSampler, sHeader, sAttr;
    for (var i = 0; i < pSamplersDecl.length; i++) {
        sSampler = a.fx.SHADER_PREFIX.SAMPLER + i;
        sHeader = a.fx.SHADER_PREFIX.HEADER + i;
        sAttr = a.fx.SHADER_PREFIX.ATTRIBUTE + i;
        pSamplersDecl[i] = "uniform sampler2D " + sSampler + ";";
        pBufferDecl[i] = "A_TextureHeader " + sHeader + ";";
        pBufferInit[i] = "A_extractTextureHeader(" + sSampler + "," + sHeader + ");";
    }
    this._pRealSamplersDecl = PassBlend._pRealSamplersDecl = pSamplersDecl;
    this._pRealBuffesDecl = PassBlend._pRealBuffesDecl = pBufferDecl;
    this._pRealBuffesInit = PassBlend._pRealBuffesInit = pBufferInit;
};

PassBlend.prototype.init = function (sHash, pBlend) {
    this.sHash = sHash;
    var i;
    for (i = 0; i < pBlend.length; i++) {
        this.addPass(pBlend[i]);
    }
};
PassBlend.prototype.addPass = function (pPass) {
    this.pPasses.push(pPass);
    var pVertex = pPass.pVertexShader;
    var pFragment = pPass.pFragmentShader;
    var i, j;
    var pVar1, pVar2;
    var isEqual = false;
    var sName;
    if (pVertex) {
        this.pVertexShaders.push(pVertex);
        for (i in pVertex.pTypesBlock) {
            this.pTypesBlockV[i] = pVertex.pTypesBlock[i];
        }
        for (i in pVertex.pFuncBlock) {
            this.pFuncDefBlockV[i] = i + ";";
            this.pFuncDeclBlockV[i] = pVertex.pFuncBlock[i];
        }
        for (i in pVertex.pGlobalVarBlock) {
            if (this.pGlobalVarBlockV[i]) {
                error("It`s impossible, but some names of global vars are matched");
                return;
            }
            this.pGlobalVarBlockV[i] = pVertex.pGlobalVarBlock[i];
        }
        for (i in pVertex.pUniformsBlock) {
            pVar1 = pVertex.pUniformsByRealName[i];
            if (pVar1.isBuffer()) {
                sName = pVar1.sRealName;
                if (!this.pGlobalBuffers[sName]) {
                    this.pGlobalBuffers[sName] = [];
                }
                this.pGlobalBuffers[sName].push(pVar1.pBuffer);
                this._pBuffersToReal[sName] = null;
                this.pGlobalBuffersV[sName] = null;
                continue;
            }
            else if (pVar1.isSampler()) {
                sName = pVar1.sRealName;
                if (!this.pSamplers[sName]) {
                    this.pSamplers[sName] = [];
                }
                this.pSamplers[sName].push(pVar1);
                this._pSamplersToReal[sName] = null;
                this.pSamplersV[sName] = null;
                continue;
            }
//            else {
            pVar2 = this.pUniformsV[i];
            if (pVar2) {
                if (pVar2 instanceof Array) {
                    isEqual = false;
                    for (j = 0; j < pVar2.length; j++) {
                        if (pVar2[j].pType.isEqual(pVar1.pType)) {
                            isEqual = true;
                            break;
                        }
                        if (!pVar2[j].pType.canBlend(pVar1.pType)) {
                            error("Types for blending uniforms must be mixible");
                            return;
                        }
                    }
                    if (!isEqual) {
                        pVar2.push(pVar1);
                    }
                    continue;
                }
                if (!pVar2.pType.isEqual(pVar1.pType)) {
                    if (!pVar2.pType.canBlend(pVar1.pType)) {
                        error("Types for blending uniforms must be mixible");
                        return;
                    }
                    this.pUniformsV[i] = [pVar1, pVar2];
                    this.pUniformsBlockV[i] = null;
                }
                continue;
            }
//            }
            this.pUniformsV[i] = pVar1;
            this.pUniformsBlockV[i] = pVertex.pUniformsBlock[i];
        }
//        for (i in pVertex.pGlobalBuffers) {
//            sName = pVertex.pGlobalBuffers[i].pVar.sRealName;
//            if (!this.pGlobalBuffersV[sName]) {
//                this.pGlobalBuffersV[sName] = [];
//            }
//            this.pGlobalBuffersV[sName].push(pVertex.pGlobalBuffers[i]);
//        }
        for (i in pVertex.pAttrBuffers) {
            if (!this.pAttrBuffers[i]) {
                this.pAttrBuffers[i] = [];
            }
            this.pAttrBuffers[i].push(pVertex.pAttrBuffers[i]);
        }
        for (i in pVertex._pExtractFunctions) {
            this.pExtrectedFunctionsV[i] = null;
        }
        for (i in pVertex._pAttrSemantics) {
            pVar1 = pVertex._pAttrSemantics[i];
            pVar2 = this.pAttributes[i];
            if (pVar2) {
                if (pVar2 instanceof Array) {
                    isEqual = false;
                    for (j = 0; j < pVar2.length; j++) {
                        if (pVar2[j].pType.isStrictEqual(pVar1.pType)) {
                            isEqual = true;
                            break;
                        }
                        if (!pVar2[j].pType.canBlend(pVar1.pType)) {
                            error("Types for blending attributes must be mixible 1");
                            return;
                        }
                    }
                    if (!isEqual) {
                        pVar2.push(pVar1);
                    }
                    continue;
                }
                if (!pVar2.pType.isStrictEqual(pVar1.pType)) {
                    if (!pVar2.pType.canBlend(pVar1.pType)) {
                        error("Types for blending attributes must be mixible 2");
                        return;
                    }
                    this.pAttributes[i] = [pVar1, pVar2];
                }
                continue;
            }
            this.pAttributes[i] = pVar1;
        }
        for (i in pVertex.pAttributePointers) {
            this.pAttributePointers[i] = pVertex.pAttributePointers[i];
        }
        for (i in pVertex._pVaryingsSemantics) {
            pVar1 = pVertex._pVaryingsSemantics[i];
            pVar2 = this.pVaryings[i];
            if (!pVar2) {
                this.pVaryings[i] = pVar1;
                this.pVaryingsDef[i] = "varying " + pVar1.toCodeDecl();
                continue;
            }
            if (!pVar2.pType.isStrictEqual(pVar1.pType)) {
                error("Not equal types for varyings");
                return;
            }
        }
    }
    if (pFragment) {
        this.pFragmentShaders.push(pFragment);
        for (i in pFragment.pTypesBlock) {
            this.pTypesBlockF[i] = pFragment.pTypesBlock[i];
        }
        for (i in pFragment.pFuncBlock) {
            this.pFuncDefBlockF[i] = i + ";";
            this.pFuncDeclBlockF[i] = pFragment.pFuncBlock[i];
        }
        for (i in pFragment.pGlobalVarBlock) {
            if (this.pGlobalVarBlockF[i]) {
                error("It`s impossible, but some names of global vars are matched");
                return;
            }
            this.pGlobalVarBlockF[i] = pFragment.pGlobalVarBlock[i];
        }
        for (i in pFragment.pUniformsBlock) {
            pVar1 = pFragment.pUniformsByRealName[i];
            if (pVar1.isBuffer()) {
                sName = pVar1.sRealName;
                if (!this.pGlobalBuffers[sName]) {
                    this.pGlobalBuffers[sName] = [];
                }
                this.pGlobalBuffers[sName].push(pVar1.pBuffer);
                this.pGlobalBuffersDecl[sName] = null;
                this.pGlobalBuffersInit[sName] = null;
                this.pGlobalBuffersF[sName] = null;
                continue;
            }
            else if (pVar1.isSampler()) {
                sName = pVar1.sRealName;
                if (!this.pSamplers[sName]) {
                    this.pSamplers[sName] = [];
                }
                this.pSamplers[sName].push(pVar1);
                this.pSamplersDecl[sName] = null;
                this.pSamplersF[sName] = null;
                continue;
            }
//            else {
            pVar2 = this.pUniformsF[i];
            if (pVar2) {
                if (pVar2 instanceof Array) {
                    isEqual = false;
                    for (j = 0; j < pVar2.length; j++) {
                        if (pVar2[j].pType.isEqual(pVar1.pType)) {
                            isEqual = true;
                            break;
                        }
                        if (!pVar2[j].pType.canBlend(pVar1.pType)) {
                            error("Types for blending uniforms must be mixible 1");
                            return;
                        }
                    }
                    if (!isEqual) {
                        pVar2.push(pVar1);
                    }
                    continue;
                }
                if (!pVar2.pType.isEqual(pVar1.pType)) {
                    if (!pVar2.pType.canBlend(pVar1.pType)) {
                        error("Types for blending uniforms must be mixible 2");
                        return;
                    }
                    this.pUniformsF[i] = [pVar1, pVar2];
                    this.pUniformsBlockF[i] = null;
                }
                continue;
            }
//            }
            this.pUniformsF[i] = pVar1;
            this.pUniformsBlockF[i] = pFragment.pUniformsBlock[i];
        }
    }
//    for (i in pFragment.pGlobalBuffers) {
//        sName = pFragment.pGlobalBuffers[i].pVar.sRealName;
//        if (!this.pGlobalBuffersF[sName]) {
//            this.pGlobalBuffersF[sName] = [];
//        }
//        this.pGlobalBuffersF[sName].push(pFragment.pGlobalBuffers[i]);
//    }
    for (i in pFragment._pExtractFunctions) {
        this.pExtrectedFunctionsF[i] = null;
    }
    pPass.clear();
};
PassBlend.prototype.finalizeBlend = function () {
    function fnBlendTypes(pVars, me) {
        var sNewType = "";
        var k, l, m;
        var pType, pVar;
        for (k = 0; k < pVars.length; k++) {
            pType = pVars[i].pType.pEffectType;
            sNewType = pType.sRealName + "|";
        }
        if (me._pBlendTypes[sNewType]) {
            return me._pBlendTypes[sNewType];
        }
        var pFields = {};
        var sFields = "";
        var pTypes = [];
        var pOrders;
        var sTypeName;
        for (k = 0; k < pVars.length; k++) {
            pType = pVars[k].pType.pEffectType.pDesc;
            pOrders = pType.pDesc.pOrders;
            for (l = 0; l < pOrders.length; l++) {
                if (pFields[pOrders[l].sRealName]) {
                    continue;
                }
                if (pOrders[i].isBase()) {
                    pFields[pOrders[l].sRealName] = pOrders[l].toCodeDecl();
                    continue;
                }
                pTypes.length = 0;
                pTypes.push(pOrders[l]);
                for (m = k + 1; m < pVars.length; m++) {
                    pVar = pVars[m].pType.pEffectType.pDesc._pSemantics(pOrders[l].sSemantic);
                    pTypes.push(pVar);
                }
                sTypeName = fnBlendTypes(pTypes, me);
                pFields[pOrders[l].sRealName] = sTypeName + " " + pOrders[l].sRealName + ";";
            }
        }
        sTypeName = "AUTO_BLEND_TYPE_" + me._nBlendTypes;
        me._nBlendTypes++;
        me._pBlendTypes[sNewType] = sTypeName;
        for (k in pFields) {
            sFields += pFields[k];
        }
        me._pBlendTypesDecl[sNewType] = "struct " + sTypeName + "{" + sFields + "};";
        return sTypeName;
    }

    var i;
    var sType;
    var pAttr;
    for (i in this.pUniformsBlockV) {
        if (this.pUniformsBlockV[i] === null) {
            sType = fnBlendTypes(this.pUniformsV[i], this);
            this.pUniformsBlockV[i] = "uniform " + sType + " " + this.pUniformsV[i][0].sRealName + ";";
        }
        this.pUniforms[i] = this.pUniformsV[i];
    }
    for (i in this.pSamplers) {
        this.pUniforms[i] = this.pSamplers[i][0];
    }
    for (i in this.pGlobalBuffers) {
        this.pUniforms[i] = this.pGlobalBuffers[i][0];
    }
    for (i in this.pUniformsBlockF) {
        if (this.pUniformsBlockF[i] === null) {
            sType = fnBlendTypes(this.pUniformsF[i], this);
            this.pUniformsBlockF[i] = "uniform " + sType + " " + this.pUniformsF[i][0].sRealName + ";";
        }
        this.pUniforms[i] = this.pUniformsF[i];
    }
    for (i in this.pAttributes) {
        pAttr = this.pAttributes[i];
        if (pAttr instanceof Array) {
            sType = fnBlendTypes(pAttr, this);
            this.pAttributes[i] = "attribute " + sType + " " + pAttr[0].sRealName + ";";
        }
    }
    this.sVaryingsOut = "struct { vec4 POSITION;";

    for (i in this.pVaryings) {
        this.sVaryingsOut += this.pVaryings[i].toCodeDecl();
        this.pVaryingsBlock[i] = i + "=" + a.fx.GLOBAL_VARS.SHADEROUT + "." + i + ";";
    }
    this.pVaryingsBlock["POSITION"] = "gl_Position=" + a.fx.GLOBAL_VARS.SHADEROUT + ".POSITION;";
    this.sVaryingsOut += "} " + a.fx.GLOBAL_VARS.SHADEROUT + ";"

};
PassBlend.prototype.generateProgram = function (sHash, pAttrData, pKeys, pUniformData, pTextures) {
    //console.log(this);
    var pProgram;
    var pAttrBuf = {};
    var i, j;
    var pAttrToReal = {}, //AttrName ---> Stream number
        pAttrToBuffer = {}; //AttrName ---> Sampler number
    var pRealSamplers = {}; //ResourceID ---> Sampler number
    var pSamplersUsage = this._pRealSamplersUsage;
    var pSamplersToReal = {}, //SamplerName ---> Sampler number
        pBuffersToReal = {};  //BufferName ---> Sampler number
    var iRealSampler,
        nRealSamplers = 0;
    var pAttrDecl = {};
    var pAttrInit = {};
    var pGlobalBufDecl;
    var pRealAttrs,
        pRealBuffers,
        pAttr,
        pPointer,
        pBuffers,
        pBuffer,
        pSampler,
        pTexture,
        sTexture;
    var sKey1, sKey2,
        sInit, sDecl, sAttr;
    var sUniformOffset = "";
    var nAttr = 0, nBuffer = 0, iAttr, iBuffer;
    var pData1, pData2, sData1, sData2;
    var isNewBuffer = false;
    var isZeroSamplerV = false;
    var isZeroHeaderV = false;
    var isZeroSamplerF = false;
    var isZeroHeaderF = false;
    var isExtractInitV = false;
    var isExtractInitF = false;
    var pUniformKeys = Object.keys(pUniformData);
    var nSamplers = 0;

    //Samplers and Globals Buffers generated here

    for (i = 0; i < pUniformKeys.length; i++) {
        sKey1 = pUniformKeys[i];
        pData1 = pUniformData[sKey1];

        if (this.pGlobalBuffers[sKey1] !== undefined) {
            if (this.pGlobalBuffersV[sKey1] === null) {
                isExtractInitV = true;
            }
            if (this.pGlobalBuffersF[sKey1] === null) {
                isExtractInitF = true;
            }
            if (pData1 === null) {
                if (isExtractInitV) {
                    isZeroHeaderV = true;
                    isZeroSamplerV = true;
                }
                if (isExtractInitF) {
                    isZeroHeaderF = true;
                    isZeroSamplerF = true;
                }
                sData1 = PassBlend.sZeroSampler;
                sData2 = PassBlend.sZeroHeader;
                pBuffersToReal[sKey1] = null;
            }
            else {
                iRealSampler = pRealSamplers[pData1.toNumber()];
                if (iRealSampler === undefined) {
                    iRealSampler = nRealSamplers;
                    nRealSamplers++;
                    pSamplersUsage[iRealSampler] = 0;
                }
                if (isExtractInitV) {
                    SET_BIT(pSamplersUsage[iRealSampler], 0);
                    SET_BIT(pSamplersUsage[iRealSampler], 1);
                }
                if (isExtractInitF) {
                    SET_BIT(pSamplersUsage[iRealSampler], 2);
                    SET_BIT(pSamplersUsage[iRealSampler], 3);
                }
                sData1 = a.fx.SHADER_PREFIX.SAMPLER + iRealSampler;
                sData2 = a.fx.SHADER_PREFIX.HEADER + iRealSampler;
                pBuffersToReal[sKey1] = iRealSampler;
            }
            for (j = 0; j < this.pGlobalBuffers[sKey1].length; j++) {
                pBuffer = this.pGlobalBuffers[sKey1][j];
                pBuffer.pSampler.pData = sData1;
                pBuffer.pHeader.pData = sData2;
            }
            continue;
        }

        if (this.pSamplers[sKey1] !== undefined) {
            sTexture = pData1[a.fx.GLOBAL_VARS.TEXTURE];
            if (typeof(sTexture) === "object") {
                pTexture = sTexture;
            }
            else {
                pTexture = pTextures[sTexture];
            }
            if (!pTexture) {
                if (this.pSamplersV[sKey1] === null) {
                    isZeroSamplerV = true;
                }
                if (this.pSamplersF[sKey1] === null) {
                    isZeroSamplerF = true;
                }
                sData1 = PassBlend.sZeroSampler;
                pSamplersToReal[sKey1] = null;
            }
            else {
                iRealSampler = pRealSamplers[pTexture.toNumber()];
                if (iRealSampler === undefined) {
                    iRealSampler = nRealSamplers;
                    nRealSamplers++;
                    pSamplersUsage[iRealSampler] = 0;
                }
                if (this.pSamplersV[sKey1] === null) {
                    SET_BIT(pSamplersUsage[iRealSampler], 0);
                }
                if (this.pSamplersF[sKey1] === null) {
                    SET_BIT(pSamplersUsage[iRealSampler], 2);
                }
                sData1 = a.fx.SHADER_PREFIX.SAMPLER + iRealSampler;
                pSamplersToReal[sKey1] = iRealSampler;
            }
            for (j = 0; j < this.pSamplers[sKey1].length; j++) {
                pSampler = this.pSamplers[sKey1][j];
                pSampler._pSamplerData = sData1;
            }
            continue;
        }
    }

    //Attributes analyzed here. Are the from real buffer or video buffer.
    //Generated lists of real attributes by slots and video buffers they used

    for (i = 0; i < pKeys.length; i++) {
        sKey1 = pKeys[i];
        pData1 = pAttrData[sKey1];
        pAttr = this.pAttributes[sKey1];
        if (pData1 === null) {
            continue;
        }
        if (pAttrToReal[sKey1] !== undefined) {
            continue;
        }
        pAttrToReal[sKey1] = nAttr;
        isNewBuffer = false;
        if (pData1.eType !== a.BufferMap.FT_MAPPABLE) {
            if (pAttr.isPointer || !pAttr.pType.isBase()) {
                warning("Bad data in buffers 001");
                return false;
            }
            pAttrInit[nAttr] = sKey1;
            nAttr++;
            continue;
        }
        else if (pAttrToBuffer[sKey1] === undefined) {
            iRealSampler = pRealSamplers[pData1.pData.buffer.toNumber()];
            if (iRealSampler === undefined) {
                iRealSampler = nRealSamplers;
                nRealSamplers++;
                pSamplersUsage[iRealSampler] = 0;
            }
            pAttrToBuffer[sKey1] = iRealSampler;
            SET_BIT(pSamplersUsage[iRealSampler], 0);
            SET_BIT(pSamplersUsage[iRealSampler], 1);
        }
        for (j = i; j < pKeys.length; j++) {
            sKey2 = pKeys[j];
            pData2 = pAttrData[sKey2];
            if (pData1 === pData2) {
                pAttrToReal[sKey2] = nAttr;
            }
            if (pData1.eType === a.BufferMap.FT_MAPPABLE && pData2.eType === a.BufferMap.FT_MAPPABLE &&
                pData1.pData._pVertexBuffer === pData2.pData._pVertexBuffer) {
                pAttrToBuffer[sKey2] = pAttrToBuffer[sKey1];
            }
        }
        nAttr++;
    }

    pRealAttrs = new Array(nAttr);

    //Set samplers and headers of video_buffer`s of attributes in code

    for (i = 0; i < pKeys.length; i++) {
        sKey1 = pKeys[i];
        if (pAttrToBuffer[sKey1] !== undefined) {
            pBuffers = this.pAttrBuffers[sKey1];
            sData1 = a.fx.SHADER_PREFIX.SAMPLER + pAttrToBuffer[sKey1];
            sData2 = a.fx.SHADER_PREFIX.HEADER + pAttrToBuffer[sKey1];
            if (!pBuffers) {
                warning("You set data as buffer but the are not so");
                return false;
            }
            for (j = 0; j < pBuffers.length; j++) {
                pBuffers[j].pSampler.pData = sData1;
                pBuffers[j].pHeader.pData = sData2;
            }
        }
    }

    //Generate code for real attributes

    for (i = 0; i < nAttr; i++) {
        sKey1 = pAttrInit[i];
        sAttr = a.fx.SHADER_PREFIX.ATTRIBUTE + i;
        if (sKey1 !== undefined) {
            pAttr = this.pAttributes[sKey1];
            pRealAttrs[i] = "attribute " + pAttr.pType.pEffectType.toCode() + " " + sAttr + ";";
            continue;
        }
        pRealAttrs[i] = "attribute float " + sAttr + ";";
    }

    //Generate declarations and initial expression for variables that used as input data for vertex shader in hlsl

    for (i = 0; i < pKeys.length; i++) {
        sKey1 = pKeys[i];
        pAttr = this.pAttributes[sKey1];
        pData1 = pAttrData[sKey1];
        iAttr = pAttrToReal[sKey1];
        iBuffer = pAttrToBuffer[sKey1];
        sInit = "";
        sDecl = "";
        if (!pData1) {
            sDecl += pAttr.pType.pEffectType.toCode() + " " + pAttr.toCode() + ";";
//            sInit += pAttr.toCode() + "=0.0;";
            if (pAttr.isPointer === true) {
                for (j = 0; pAttr.pPointers && j < pAttr.pPointers.length; j++) {
                    pPointer = pAttr.pPointers[j];
                    sDecl += "float " + pPointer.toCode() + ";";
//                sInit += pPointer.toCode() + "=0.0;";
                }
                isZeroSamplerV = true;
                isZeroHeaderV = true;
                isExtractInitV = true;
                for (j = 0; j < this.pAttrBuffers[sKey1].length; j++) {
                    pBuffer = this.pAttrBuffers[sKey1][j];
                    pBuffer.pSampler.pData = PassBlend.sZeroSampler;
                    pBuffer.pHeader.pData = PassBlend.sZeroHeader;
                }
            }
        }
        else {
            sAttr = a.fx.SHADER_PREFIX.ATTRIBUTE + iAttr;
            if (pData1.eType !== a.BufferMap.FT_MAPPABLE) {
                sDecl = pAttr.pType.pEffectType.toCode() + " " + pAttr.toCode() + ";";
                sInit = pAttr.toCode() + "=" + sAttr + ";";
            }
            else {
                isExtractInitV = true;
                this.pExtrectedFunctionsV["header"] = null;
                sUniformOffset += "uniform float " + pAttr.toOffsetStr() + ";";
                sData1 = a.fx.SHADER_PREFIX.SAMPLER + iBuffer;
                sData2 = a.fx.SHADER_PREFIX.HEADER + iBuffer;

                for (j = pAttr.pPointers.length - 1; j >= 0; j--) {
                    pPointer = pAttr.pPointers[j];
                    sDecl += "float " + pPointer.toCode() + ";";
                    if (j === pAttr.pPointers.length - 1) {
                        sInit += pPointer.toCode() + "=" + sAttr + "+" + pAttr.toOffsetStr() + ";";
                    }
                    else {
                        sInit += pPointer.toCode() + "=A_extractFloat(" + sData1 + "," +
                                 sData2 + "," + pAttr.pPointers[j + 1].toCode() + ");";
                        this.pExtrectedFunctionsV["float"] = null;
                    }
                }
                sDecl += pAttr.pType.pEffectType.toCode() + " " + pAttr.toCode() + ";";
                if (!pAttr.pType.isBase()) {
                    warning("Extracting complex type are no implemented yet");
                    return false;
                }
                sInit += pAttr.toCode() + "=";
                switch (pAttr.pType.pEffectType.toCode()) {
                    case "float":
                        sInit += "A_extractFloat(";
                        break;
                    case "vec2":
                        sInit += "A_extractVec2(";
                        this.pExtrectedFunctionsV["float"] = null;
                        break;
                    case "vec3":
                        sInit += "A_extractVec3(";
                        this.pExtrectedFunctionsV["float"] = null;
                        break;
                    case "vec4":
                        sInit += "A_extractVec4(";
                        this.pExtrectedFunctionsV["float"] = null;
                        break;
                    case "mat4":
                        sInit += "A_extractMat4(";
                        this.pExtrectedFunctionsV["float"] = null;
                        this.pExtrectedFunctionsV["vec4"] = null;
                        break;
                    default:
                        warning("another type are not implemented yet");
                        return false;
                }
                sInit += sData1 + "," + sData2 + "," + pAttr.pPointers[0].toCode() + ");";
                this.pExtrectedFunctionsV[pAttr.pType.pEffectType.toCode()] = null;
            }
        }
        pAttrDecl[sKey1] = sDecl;
        pAttrInit[sKey1] = sInit;
    }

    //Generate final code

    //Translate all objects that was in code(Samplers and Headers) to code
    function fnToFinalCode(pCode) {
        if (typeof(pCode) === "string") {
            return pCode;
        }
        var sCode = "";
        for (var i = 0; i < pCode.length; i++) {
            if (typeof(pCode[i]) === "string") {
                sCode += pCode[i];
            }
            else {
                sCode += pCode[i].toDataCode();
            }
        }
        return sCode;
    }

    var sVertexCode = "";
    var sFragmentCode = "";
    var isExtract;

    //VERTEX SHADER

    nSamplers = a.info.graphics.maxVertexTextureImageUnits(this.pEngine.pDevice);

    //Initial for extract functions
    isExtract = false;
    if (isExtractInitV) {
        sVertexCode += PassBlend.pExtractedFunctions["init"];
        isExtract = true;
    }
    //Extract functions
    for (i in this.pExtrectedFunctionsV) {
        if (!isExtract) {
            sVertexCode += PassBlend.pExtractedFunctions["init"];
            isExtract = true;
        }
        sVertexCode += PassBlend.pExtractedFunctions[i];
    }
    //Types
    for (i in this.pTypesBlockV) {
        sVertexCode += this.pTypesBlockV[i] + ";";
    }
    //Function`s definitions
    for (i in this.pFuncDefBlockV) {
        sVertexCode += i + ";";
    }
    //Uniform samplers
    if (isZeroSamplerV) {
        nSamplers--;
        sVertexCode += PassBlend.sZeroSamplerDecl;
    }
    for (i = 0; i < nRealSamplers; i++) {
        if (TEST_BIT(pSamplersUsage[i], 0)) {
            nSamplers--;
            sVertexCode += this._pRealSamplersDecl[i];
        }
    }
    //Uniforms
    for (i in this.pUniformsBlockV) {
        sVertexCode += this.pUniformsBlockV[i];
    }
    //Global variables
    if (isZeroHeaderV) {
        sVertexCode += PassBlend.sZeroHeaderDecl;
    }
    for (i = 0; i < nRealSamplers; i++) {
        if (TEST_BIT(pSamplersUsage[i], 1)) {
            nSamplers--;
            sVertexCode += this._pRealBuffesDecl[i];
        }
    }
    for (i in this.pGlobalVarBlockV) {
        sVertexCode += this.pGlobalVarBlockV[i];
    }
    //Varyings declaration
    for (i in this.pVaryingsDef) {
        sVertexCode += this.pVaryingsDef[i];
    }
    //Real attributtes
    for (i = 0; i < nAttr; i++) {
        sVertexCode += pRealAttrs[i];
    }
    //Check number of samplers
    if (nSamplers < 0) {
        warning("More samplers used than vertex shader can provide");
        return false;
    }
    //Offsets
    sVertexCode += sUniformOffset;
    //Input data for shader
    for (i = 0; i < pKeys.length; i++) {
        sKey1 = pKeys[i];
        sVertexCode += pAttrDecl[sKey1];
    }
    //System 'Out' variable declaration
    sVertexCode += this.sVaryingsOut;
    //Function`s body
    for (i in this.pFuncDeclBlockV) {
        sVertexCode += fnToFinalCode(this.pFuncDeclBlockV[i]) + "\n";
    }
    //Shader`s functions body
    for (i = 0; i < this.pVertexShaders.length; i++) {
        sVertexCode += this.pVertexShaders[i].toFinal() + "\n";
    }
    //void main()
    sVertexCode += "void main(){";
    //Extract headers for attr`s buffers
    for (i = 0; i < nRealSamplers; i++) {
        if (TEST_BIT(pSamplersUsage[i], 1)) {
            nSamplers--;
            sVertexCode += this._pRealBuffesInit[i];
        }
    }
    //Initialize input data for shader`s functions from real attributess
    for (i = 0; i < pKeys.length; i++) {
        sKey1 = pKeys[i];
        sVertexCode += pAttrInit[sKey1];
    }
    //Calls shader`s functions
    for (i = 0; i < i < this.pVertexShaders.length; i++) {
        sVertexCode += this.pVertexShaders[i].sRealName + "();"
    }
    //Set varyings
    for (i in this.pVaryingsBlock) {
        sVertexCode += this.pVaryingsBlock[i];
    }
    //finish
    sVertexCode += "}";

    //PIXEL SHADER

    nSamplers = a.info.graphics.maxCombinedTextureImageUnits(this.pEngine.pDevice);

    //Initial for extract functions
    isExtract = false;
    if (isExtractInitF) {
        sFragmentCode += PassBlend.pExtractedFunctions["init"];
        isExtract = true;
    }
    //Extract functions
    for (i in this.pExtrectedFunctionsF) {
        if (!isExtract) {
            sFragmentCode += PassBlend.pExtractedFunctions["init"];
            isExtract = true;
        }
        sFragmentCode += PassBlend.pExtractedFunctions[i];
    }
    //Types
    for (i in this.pTypesBlockF) {
        sFragmentCode += this.pTypesBlockF[i] + ";";
    }
    //Function`s definitions
    for (i in this.pFuncDefBlockF) {
        sFragmentCode += i + ";";
    }
    //Uniform samplers
    if (isZeroSamplerF) {
        nSamplers--;
        sFragmentCode += PassBlend.sZeroSamplerDecl;
    }
    for (i = 0; i < nRealSamplers; i++) {
        if (TEST_BIT(pSamplersUsage[i], 2)) {
            nSamplers--;
            sVertexCode += this._pRealSamplersDecl[i];
        }
    }
    //Check number of samplers
    if (nSamplers < 0) {
        warning("More samplers used than fragment shader can provide");
        return false;
    }
    //Uniforms
    for (i in this.pUniformsBlockF) {
        sFragmentCode += this.pUniformsBlockF[i];
    }
    //Global variables
    if (isZeroHeaderF) {
        sFragmentCode += PassBlend.sZeroHeaderDecl;
    }
    for (i = 0; i < nRealSamplers; i++) {
        if (TEST_BIT(pSamplersUsage[i], 3)) {
            nSamplers--;
            sVertexCode += this._pRealBuffesDecl[i];
        }
    }
    for (i in this.pGlobalVarBlockF) {
        sFragmentCode += this.pGlobalVarBlockF[i];
    }
    //Varyings declaration
    for (i in this.pVaryingsDef) {
        sFragmentCode += this.pVaryingsDef[i];
    }
    //Function`s body
    for (i in this.pFuncDeclBlockF) {
        sFragmentCode += fnToFinalCode(this.pFuncDeclBlockF[i]) + "\n";
    }
    //Shader`s functions body
    for (i = 0; i < this.pFragmentShaders.length; i++) {
        sFragmentCode += this.pFragmentShaders[i].toFinal() + "\n";
    }
    //void main()
    sFragmentCode += "void main(){";
    //Extract headers for global buffers
    for (i = 0; i < nRealSamplers; i++) {
        if (TEST_BIT(pSamplersUsage[i], 3)) {
            nSamplers--;
            sVertexCode += this._pRealBuffesDecl[i];
        }
    }
    //Calls shader`s functions
    for (i = 0; i < i < this.pFragmentShaders.length; i++) {
        sFragmentCode += this.pFragmentShaders[i].sRealName + "();"
    }
    //finish
    sFragmentCode += "}";
    //add precision
    if (sFragmentCode !== "") {
        sFragmentCode = "#ifdef GL_ES\nprecision lowp float;\n#endif\n" + sFragmentCode;
    }

    //Generate program
    pProgram = new ShaderProgram2(sHash, this.pEngine);
    pProgram._pPassBlend = this;
    pProgram.setUniformVars(this.pUniforms, isZeroSamplerV || isZeroSamplerF);
    pProgram.setAttrParams(pAttrToReal, pAttrToBuffer, pSamplersToReal, pBuffersToReal, nAttr, nRealSamplers);
    if (!pProgram.create(sVertexCode, sFragmentCode)) {
        return false;
    }
    if (!pProgram.setup(pAttrData, pUniformData, pTextures)) {
        return false;
    }
    console.log(pProgram);
    return pProgram;
};
A_NAMESPACE(PassBlend, fx);

function Renderer(pEngine) {
    Enum([
             PARAMETER_FLAG_ALL = 1,
             PARAMETER_FLAG_NONSYSTEM,
             PARAMETER_FLAG_SYSTEM
         ], PARAMETER_FLAGS, a.Renderer);
    Enum([
             WORLD_MATRIX = 0,
             VIEW_MATRIX,
             PROJ_MATRIX,

             WORLD_VIEW_MATRIX, //VIEW x WORLD
             VIEW_PROJ_MATRIX, //PROJ x VIEW
             WORLD_VIEW_PROJ_MATRIX, //PROJ x VIEW x WORLD

             WORLD_MATRIX_ARRAY,

             NORMAL_MATRIX, //transpose(inverse(mat3(WORLD_MATRIX)))  see: SceneNode.normalMatrix()

             MAX_MATRIX_HANDLES
         ], MATRIX_HANDLES, a.Renderer);
    Enum([  //сам переименуешь
             boneInfluenceCount = 0,

             ambientMaterialColor,
             diffuseMaterialColor,
             emissiveMaterialColor,
             specularMaterialColor,
             specularMaterialPower,

             pointLightPos0,
             pointlightVec0,
             pointlightColor0,

             sunVector,
             sunColor,
             cameraPos,
             cameraDistances,
             cameraFacing,
             ambientLight,

             patchCorners,
             atmosphericLighting,

             posScaleOffset,
             uvScaleOffset,

             lensFlareColor,

             max_param_handles
         ], PARAMETER_HANDLES, a.Renderer);
    Enum([MAX_TEXTURE_HANDLES = a.SurfaceMaterial.maxTexturesPerSurface], eTextureHandles, a.Renderer);

    this.pEngine = pEngine;
    this.pDevice = pEngine.pDevice;
    this._pEngineStates = pEngine.pSystemStates;

    this._nEffectFile = 1;

    this._pComponentBlendsHash = {"EMPTY" : null};
    this._pComponentBlendsId = {0 : null};
    this._nComponentBlends = 1;

    this._pPassBlends = {};
    this._pEffectResoureId = {};
    this._pEffectResoureBlend = {};

    this._pCurrentBlend = null;
    this._nCurrentShift = 0;
    this._pCurrentAttributeData = null;
    this._pCurrentSnapshot = null;

    this._pCurrentIndex = undefined;
    this._iCurrentLength = null;
    this._iCurrentOffset = null;

    this._pIndexStack = [];
    this._pLengthStack = [];
    this._pOffsetStack = [];

    this._pSnapshotStack = [];
    this._pBlendStack = [];
    this._pShiftStack = [];
    this._pAttributesDataStack = [];


    this._pPrograms = {};
    this._pRenderResources = {};
    this._pRenderResourceCounter = {};
    this._pRenderResourceCounterKeys = [];

    //Current render resource states
    this._pActiveVertexBuffer = null;
    this._iActiveVertexBufferState = -1;

    this._pActiveIndexBuffer = null;
    this._iActiveIndexBufferState = -1;

    this._iActiveFrameBuffer = null;
    this._pActiveProgram = null;
    this._nAttrsUsed = 0;

    this._pActiveTexture = null;
    this._iActiveSlot = -1;
    this._pTextureSlotStates = new Array(a.info.graphics.maxTextureImageUnits(this.pDevice));
    this._pTextureSlots = new Array(a.info.graphics.maxTextureImageUnits(this.pDevice));
    for (var i = 0; i < this._pTextureSlots.length; i++) {
        this._pTextureSlotStates[i] = false;
        this._pTextureSlots[i] = null;
    }

    this._pFramebufferPool = new Array(10);
    this._pEmptyFrameBuffers = new Array(10);
    this._pFrameBufferCounters = new Array(10);
    for (var i = 0; i < this._pFramebufferPool.length; i++) {
        this._pFramebufferPool[i] = this.pDevice.createFramebuffer();
        this._pEmptyFrameBuffers[i] = null;
        this._pFrameBufferCounters[i] = 0;
    }
}

//----Load and init components and effects----//
/**
 * Load *.fx file or *.abf
 * @tparam String sFileName
 * @tparam String sName name of Effect. It`s need if in effect there are no provide.\n
 *         So name of components from file will be: "sName" + ":" + "sTechniqueName"\n
 *         Example: "baseEffect:GEOMETRY", "lightEffect:POINT"
 */
Renderer.prototype.loadEffectFile = function (sFileName, sEffectName) {
    var reExt = /^(.+)(\.afx|\.abf|\.fx)$/;
    var pRes = reExt.exec(sFileName);
    var pEffect;
    var sSource;
    if (!pRes) {
        warning("File has wrong extension! It must be .fx!");
        return false;
    }
    sEffectName = sEffectName || pRes[1];
    pEffect = new a.fx.Effect(this, this._nEffectFile);
    this._nEffectFile++;
    sSource = a.ajax({url : sFileName, async : false}).data;
    a.util.parser.parse(sSource);
    var isLoadOk = pEffect.analyze(a.util.parser.pSyntaxTree);
//    trace(pEffect);
    if (!isLoadOk) {
        warning("Effect file:(\"" + sFileName + "\")can not be loaded");
        return false;
    }
    var i;
    var pTechniques = pEffect.pTechniques;
    for (i in pTechniques) {
        if (!this._initComponent(pTechniques[i])) {
            warning("Can not initialize component from effect " + sFileName +
                    " with name " + pTechniques[i].sName + "!");
        }
    }
};
/**
 * Initialization component from technique. Name of component will be 'sEffectName' + ':' + 'pTechnique.sName'
 * @tparam sEffectName
 * @tparam pTechnique
 * @treturn Boolean True if all Ok, False if we already have this component.
 */
Renderer.prototype._initComponent = function (pTechnique) {
    var sName = pTechnique.sName;
    var pComponentManager = this.pEngine.displayManager().componentPool();
    if (pComponentManager.findResource(sName)) {
        return false;
    }
    var pComponent = pComponentManager.createResource(sName);
    pComponent.init(pTechnique);
    var pComponents = pComponent.pComponents;
    var pProps = pComponent.pComponentsShift;
    if (pComponents) {
        var pNewComponents = [];
        var pNewComponentsProp = [];
        var pComponentsHash = {};
        var pCompComp;
        var pCompProp;
        var i, j;
        for (i = 0; i < pComponents.length; i++) {
            sName = pComponents[i].hash(pProps[i]);
            if (!pComponentsHash[sName]) {
                if (pComponents[i].pComponents) {
                    pCompComp = pComponents[i].pComponents;
                    pCompProp = pComponents[i].pComponentsShift;
                    for (j = 0; j < pCompComp.length; j++) {
                        sName = pCompComp[j].hash(pCompProp[j]);
                        if (!pComponentsHash[sName]) {
                            pComponentsHash[sName] = pCompComp[j];
                            pNewComponents.push(pCompComp[j]);
                            pNewComponentsProp.push(pCompProp[j]);
                        }
                    }
                }
                sName = pComponents[i].hash(pProps[i]);
                pComponentsHash[sName] = pComponents[i];
                pNewComponents.push(pComponents[i]);
                pNewComponentsProp.push(pProps[i]);
            }
        }
        pComponent.pComponents = pNewComponents;
        pComponent.pComponentsShift = pNewComponents;
        pComponent.pComponentsHash = pComponentsHash;
    }
    return true;
};

//----Methods for blending components and effect resources----//
Renderer.prototype.getComponentByName = function (sName) {
    return this.pEngine.displayManager().componentPool().findResource(sName);
};
/**
 * Blend Components
 * @param {Component ...} Variable number of components
 * @return {Number} Id of ComponentBlend
 */
Renderer.prototype._blendComponents = function () {
    var pComponents = arguments;
    if (pComponents.length === 0) {
        return 0;
    }
    else {
        var i, j;
        var pBlend = new a.fx.ComponentBlend();
        var pComponent;
        for (i = 0; i < pComponents.length; i++) {
            pComponent = pComponents[i];
            if (!pBlend.hasComponent(pComponent.hash(0))) {
                if (pComponent.pComponents) {
                    for (j = 0; j < pComponent.pComponents.length; j++) {
                        pBlend.addComponent(pComponent.pComponents[j], pComponent.pComponentsShift[j]);
                    }
                }
                pBlend.addComponent(pComponent, 0);
            }
        }
        if (this._pComponentBlendsHash[pBlend.sHash]) {
            return this._pComponentBlendsHash[pBlend.sHash];
        }
        else {
            if (!this._registerComponentBlend(pBlend)) {
                return false;
            }
            return pBlend;
        }
    }
};
/**
 * Set id for componentBlend
 * @param {ComponentBlend} pBlend
 * @return {Int} Id of blend
 */
Renderer.prototype._registerComponentBlend = function (pBlend) {
    if (this._pComponentBlendsHash[pBlend.sHash]) {
        warning("Component with hash: \'" + pBlend.sHash + "\' are already used!");
        return false;
    }
    this._pComponentBlendsHash[pBlend.sHash] = pBlend;
    this._pComponentBlendsId[this._nComponentBlends] = pBlend;
    pBlend._id = this._nComponentBlends;
    this._nComponentBlends++;
    return pBlend._id;
};
/**
 *
 * @param {ComponentBlend} pBlend Hash or id for components blend
 * @param {Component} pComponent Name of blending component
 * @param {Object} nShift Property of blending this component
 * @return {Boolean} True to add component
 */
Renderer.prototype._addComponentToBlend = function (pBlend, pComponent, nShift) {
    var pComponentManager = this.pEngine.displayManager().componentPool();
    var i;
    var pNewBlend;
    nShift = nShift || 0;
    if (!pBlend) {
        //Create blend from component
        pNewBlend = new a.fx.ComponentBlend();
    }
    else if (!pBlend.pComponentsHash[pComponent.hash(nShift)]) {
        pNewBlend = pBlend.cloneMe();
    }
    if (pNewBlend) {
        if (pComponent.pComponents) {
            for (i = 0; i < pComponent.pComponents.length; i++) {
                pNewBlend.addComponent(pComponent.pComponents[i], pComponent.pComponentsShift[i] + nShift);
            }
        }
        pNewBlend.addComponent(pComponent, nShift);
        if (this._pComponentBlendsHash[pNewBlend.sHash]) {
            return this._pComponentBlendsHash[pNewBlend.sHash];
        }
        else {
            if (!this._registerComponentBlend(pNewBlend)) {
                return false;
            }
            return pNewBlend;
        }
    }
    return pBlend;
};
Renderer.prototype._removeComponentFromBlend = function (pBlend, pComponent, nShift) {
    var pComponentManager = this.pEngine.displayManager().componentPool();
    var i;
    var pNewBlend;
    var pComp;
    nShift = nShift || 0;
    if (!pBlend) {
        //Create blend from component
        warning("You try remove component from empty blend!");
        return false;
    }
    if (!pBlend.pComponentsHash[pComponent.hash(nShift)]) {
        warning("You try remove component from blend where it doesn`t exist!");
        return false;
    }
    var sName = pComponent.hash(nShift);
    if (pBlend.pComponentsCount[sName] > 1) {
        pBlend.pComponentsCount[sName]--;
        for (i = 0; i < pComponent.pComponents.length; i++) {
            pBlend.pComponentsCount[pComponent.pComponents[i].hash(pComponent.pComponentsShift[i] + nShift)]--;
        }
        return pBlend;
    }
    pNewBlend = pBlend.cloneMe();

    for (i = 0; i < pBlend.pComponents.length; i++) {
        pComp = pBlend.pComponents[i];
        sName = pComp.hash(pBlend.pComponentsShift[i]);
        if (pComp !== pComponent &&
            !(pComponent.pComponentsHash[sName] === pComp && pBlend.pComponentsCount[sName] === 1)) {
            pNewBlend.addComponent(pComp, pBlend.pComponentsShift[i]);
        }
    }

    if (this._pComponentBlendsHash[pNewBlend.sHash]) {
        return this._pComponentBlendsHash[pNewBlend.sHash];
    }
    else {
        if (!this._registerComponentBlend(pNewBlend)) {
            return false;
        }
        return pNewBlend;
    }
};
Renderer.prototype._addBlendToBlend = function (pBlendA, pBlendB, nShift) {
    var sHash = pBlendA.sHash;
    var sName;
    var i;
    for (i = 0; i < pBlendB.pComponents.length; i++) {
        sName = pBlendB.pComponents[i].hash(pBlendB.pComponentsShift[i] + nShift);
        if (!pBlendA.pComponentsHash[sName]) {
            sHash += sName + ":";
        }
    }
    if (this._pComponentBlendsHash[sHash]) {
        return this._pComponentBlendsHash[sHash];
    }
    var pNewBlend;
    pNewBlend = pBlendA.addBlend(pBlendB, nShift);
    if (!this._registerComponentBlend(pNewBlend)) {
        return false;
    }
    return pNewBlend;
};
/**
 * Регистрация нового эффект ресурса.
 * @tparam EffectResource pEffectResource
 * @treturn Boolean
 */
Renderer.prototype.registerEffect = function (pEffectResource) {
    var id = pEffectResource.resourceHandle();
    if (this._pEffectResoureId[id]) {
        warning("This effect resource are already loaded");
        return false;
    }
    this._pEffectResoureId[id] = pEffectResource;
    this._pEffectResoureBlend[id] = null;
    return true;
};
/**
 * Регистрация компонента эффекта.
 * @tparam pEffectComponent pEffectComponent
 * @treturn Boolean
 */
Renderer.prototype.registerComponent = function (pComponent) {
    return false;
};
/**
 * Активация компонента для эффект ресурса.
 * @tparam EffectResource/ResourceHandle pEffectResource
 * @tparam iComponentHandle
 * @tparam Uint nShift Смещение пассов
 * @treturn Boolean
 */
Renderer.prototype.activateComponent = function (pEffectResource, iComponentHandle, nShift) {
    var pComponentManager = this.pEngine.displayManager().componentPool();
    var pEffectManager = this.pEngine.displayManager().effectPool();
    var rId = pEffectResource;
    var pBlend;
    nShift = nShift || 0;
    if (typeof(rId) === "object") {
        rId = rId.resourceHandle();
    }
    pBlend = this._pEffectResoureBlend[rId];
    var pComponent = pComponentManager.getResource(iComponentHandle);
    if (!pComponent) {
        warning("Can`t find component with id: " + iComponentHandle);
        return false;
    }
    pBlend = this._addComponentToBlend(pBlend, pComponent, nShift);
    if (!pBlend) {
        return false;
    }
    this._pEffectResoureBlend[rId] = pBlend;
    return true;
};
/**
 * Деактивация компонента для эффект ресурса.
 * @tparam EffectResource/ResourceHandle pEffectResource
 * @tparam iComponentHandle
 * @treturn Boolean
 */
Renderer.prototype.deactivateComponent = function (pEffectResource, iComponentHandle, nShift) {
    var pComponentManager = this.pEngine.displayManager().componentPool();
    var pEffectManager = this.pEngine.displayManager().effectPool();
    var rId = pEffectResource;
    var pBlend;
    nShift = nShift || 0;
    if (typeof(rId) === "object") {
        rId = rId.resourceHandle();
    }
    pBlend = this._pEffectResoureBlend[rId];
    var pComponent = pComponentManager.getResource(iComponentHandle);
    if (!pComponent) {
        warning("Can`t find component with id: " + iComponentHandle);
        return false;
    }
    pBlend = this._removeComponentFromBlend(pBlend, pComponent, nShift);
    if (!pBlend) {
        return false;
    }
    this._pEffectResoureBlend[rId] = pBlend;
    return true;
};

Renderer.prototype.getComponentCount = function (pEffectResource) {
    var id = pEffectResource.resourceHandle();
    return this._pEffectResoureBlend[id].pComponents.length;

};
Renderer.prototype.findEffect = function (sName) {
    return new EffectResource(this.pEngine);
};

//----PreReander Methods----//
Renderer.prototype.push = function (pSnapshot) {
    var rId = pSnapshot.method.effect.resourceHandle();
    var pBlend = this._pEffectResoureBlend[rId];
    var isUpdate = pSnapshot.isUpdated();
    if (!pBlend) {
        error("There are no any blend for this effect");
        return false;
    }
    if (!pBlend.isReady()) {
        isUpdate = true;
    }
    if (!pBlend.finalize()) {
        return false;
    }
    var pUniforms, pTextures;
    var pUniformKeys, pTextureKeys;
    var i, j;
    if (isUpdate) {
        pUniforms = [];
        if (pBlend.hasTextures()) {
            pTextures = [];
            for (i = 0; i < pBlend.totalValidPasses(); i++) {
                pTextures[i] = {};
                pTextureKeys = pBlend.pUniformsBlend[i]._pTextureByRealNameKeys;
                for (j = 0; j < pTextureKeys.length; j++) {
                    pTextures[i][pTextureKeys[j]] = null;
                }
            }
        }
        for (i = 0; i < pBlend.totalValidPasses(); i++) {
            pUniforms[i] = {};
            pUniformKeys = pBlend.pUniformsBlend[i]._pUniformByRealNameKeys;
            for (j = 0; j < pUniformKeys.length; j++) {
                pUniforms[i][pUniformKeys[j]] = null;
            }
        }
        pSnapshot.setPassStates(pUniforms, pTextures);
    }
    var iStackLength = this._pSnapshotStack.length;
    this._pSnapshotStack.push(pSnapshot);
    this._pShiftStack.push(this._nCurrentShift);
    this._pBlendStack.push(pBlend);
    this._pCurrentSnapshot = pSnapshot;
    this._pCurrentBlend = pBlend;
    this._pCurrentAttributeData = new Array(pBlend.totalValidPasses());
    this._pAttributesDataStack.push(this._pCurrentAttributeData);

    this._pIndexStack[iStackLength - 1] = this._pCurrentIndex;
    this._pOffsetStack[iStackLength - 1] = this._iCurrentOffset;
    this._pLengthStack[iStackLength - 1] = this._iCurrentLength;

    this._pCurrentIndex = undefined;
    this._iCurrentOffset = null;
    this._iCurrentLength = null;

    pSnapshot.isUpdated(false);
    return true;
};
Renderer.prototype.pop = function () {
    this._pSnapshotStack.pop();
    this._pShiftStack.pop();
    this._pBlendStack.pop();
    this._pAttributesDataStack.pop();
    this._pCurrentBlend = this._pBlendStack[this._pBlendStack.length - 1] || null;
    this._pCurrentSnapshot = this._pSnapshotStack[this._pSnapshotStack.length - 1] || null;
    this._nCurrentShift = this._pShiftStack[this._pShiftStack.length - 1] || 0;
    this._pCurrentAttributeData = this._pAttributesDataStack[this._pAttributesDataStack.length - 1] || null;
    return true;
};
Renderer.prototype.activatePass = function (pSnapshot, iPass) {
    this._nCurrentShift += iPass;
    return true;
};
Renderer.prototype.deactivatePass = function (pSnapshot) {
    this._nCurrentShift -= pSnapshot._iCurrentPass;
    return true;
};
/**
 * Generate pass blend and shaderProgram
 * @param iPass
 */
Renderer.prototype.finishPass = function (iPass) {
    if (this._pCurrentBlend.totalValidPasses() <= iPass) {
        warning("You try finish bad pass");
        return false;
    }
    var pUniformValues,
        pNotDefaultUniforms,
        pTextures,
        pNewPassBlend,
        pNewPassBlendHash;
    var i, j, k;
    var pSnapshot,
        pUniforms,
        pPasses,
        pPass,
        pValues,
        pBlend;
    var nShift;
    var sRealName,
        sHash,
        sKey;
    var nPass = this._pShiftStack[this._pShiftStack.length - 1] + iPass;
    var index;
    var sPassBlendHash = "";
    var pPassBlend;
    pUniformValues = {};
    pNotDefaultUniforms = {};
    pTextures = {};
    for (i = 0; i < this._pSnapshotStack.length; i++) {
        nShift = this._pShiftStack[i];
        pBlend = this._pBlendStack[i];
        pSnapshot = this._pSnapshotStack[i];
        index = nPass - nShift;
        if (pBlend.totalValidPasses() <= index) {
            continue;
        }
        pUniforms = pBlend.pUniformsBlend[index];

        if (pSnapshot._pTextures) {
            pValues = pSnapshot._pTextures[index];
            for (j = 0; j < pUniforms._pTextureByRealNameKeys.length; j++) {
                sKey = pUniforms._pTextureByRealNameKeys[j];
                if (pValues[sKey] !== undefined) {
                    pTextures[sKey] = pValues[sKey];
                }
                if (pTextures[sKey] === undefined) {
                    pTextures[sKey] = null;
                }
            }
        }

        pValues = pSnapshot._pPassStates[index];

        for (j = 0; j < pUniforms._pUniformByRealNameKeys.length; j++) {
            sKey = pUniforms._pUniformByRealNameKeys[j];
            if (pValues[sKey] !== undefined && pValues[sKey] !== null) {
                pUniformValues[sKey] = pValues[sKey];
                pNotDefaultUniforms[sKey] = true;
                continue;
            }
            if (!pNotDefaultUniforms[sKey]) {
                pUniformValues[sKey] = pUniforms.pUniformsDefault[sKey];
            }
        }
    }
    pNewPassBlend = [];
    for (i = 0; i < this._pBlendStack.length; i++) {
        pBlend = this._pBlendStack[i];
        nShift = this._pShiftStack[i];
        index = nPass - nShift;
        if (pBlend.totalValidPasses() <= index) {
            continue;
        }
        pPasses = pBlend.pPassBlends[index];
        for (j = 0; j < pPasses.length; j++) {
            pPass = pPasses[j];
            if (!pPass.isEval) {
                if (pPass.isComplex) {
                    pPass.prepare(this._pEngineStates, pUniformValues);
                }
                sPassBlendHash += "V::" + (pPass.pVertexShader.sRealName ? pPass.pVertexShader.sRealName : "EMPTY");
                sPassBlendHash += "F::" +
                                  (pPass.pFragmentShader.sRealName ? pPass.pFragmentShader.sRealName : "EMPTY");
                pNewPassBlend.push(pPass);
                pPass.isEval = true;
            }
        }
    }
    for (j = 0; j < pPasses.length; j++) {
        pPasses[j].isEval = false;
    }
    if (this._pPassBlends[sPassBlendHash]) {
        pPassBlend = this._pPassBlends[sPassBlendHash];
    }
    else {
        pPassBlend = new a.fx.PassBlend(this.pEngine);
        pPassBlend.init(sPassBlendHash, pNewPassBlend);
        if (!this._registerPassBlend(pPassBlend)) {
            return false;
        }
        pPassBlend.finalizeBlend();
    }
    //TODO: There are must be place for texture info into hash
    var pAttrSemantics = {};
    var pDataStackByPass,
        pDataStack,
        pFlow,
        pData,
        pDecl,
        pVideoBuffer,
        pVertexElement;
    var iMapIndex,
        iMapLength,
        iMapOffset;
    var isBuffer = false;
    var pAttrKeys = Object.keys(pPassBlend.pAttributes);
    for (i = 0; i < pAttrKeys.length; i++) {
        pAttrSemantics[pAttrKeys[i]] = null;
    }
    for (i = this._pAttributesDataStack.length - 1; i >= 0; i--) {
        nShift = this._pShiftStack[i];
        index = nPass - nShift;
        pDataStackByPass = this._pAttributesDataStack[i];
        if (pDataStackByPass.length <= index) {
            continue;
        }
        pDataStack = pDataStackByPass[index];
        for (j = 0; j < pAttrKeys.length; j++) {
            sKey2 = pAttrKeys[j];
            if (pAttrSemantics[sKey2] === null) {
                for (k = 0; k < pDataStack.length; k++) {
                    pData = pDataStack[k];
                    if (pData.eType === a.BufferMap.FT_MAPPABLE) {
                        pVertexElement = pData.pData.getVertexDeclaration().element(sKey2);
                    }
                    else {
                        pVertexElement = pData.getVertexDeclaration().element(sKey2);
                    }
                    if (pVertexElement) {
                        pAttrSemantics[sKey2] = pData;
                        break;
                    }
                }
            }
        }
    }
    sHash = sPassBlendHash + "|-|__|/|";
    var sKey1, sKey2;
    var sSame1, sSame2;
    for (i = 0; i < pAttrKeys.length; i++) {
        sKey1 = pAttrKeys[i];
        sHash += sKey1 + "|";
        if (pAttrSemantics[sKey1] === null) {
            sHash += "EMPTY";
        }
//        else if (pAttrSemantics[sKey1] === a.BufferMap.FT_UNMAPPABLE) {
//            sHash += "REAL";
//        }
        //TODO: VIDEO_BUFFER !== VERTEX_BUFFER
        else {
            sHash += "SAME:";
            sSame1 = "";
            sSame2 = "";
            for (j = 0; j < pAttrKeys.length; j++) {
                sKey2 = pAttrKeys[j];
                if (i !== j && pAttrSemantics[sKey2] === pAttrSemantics[sKey1]) {
                    sSame1 += sKey2 + ",";
                }
//                else if (i !== j &&
//                         pAttrSemantics[sKey2].pData._pVertexBuffer === pAttrSemantics[sKey1].pData._pVertexBuffer) {
//                    sSame2 += sKey2 + ",";
//                }
            }
            sHash += sSame1 + "!";
            sHash += "SAME_VIDEO_BUFFER:" + sSame2;
        }
        sHash += "..";
    }
    var pProgram;
    pProgram = this._pPrograms[sHash];
    if (!pProgram) {
        pProgram = pPassBlend.generateProgram(sHash, pAttrSemantics, pAttrKeys, pUniformValues, pTextures);
        if (!pProgram) {
            warning("It`s impossible to generate shader program");
            return false;
        }
        if (!this._registerProgram(sHash, pProgram)) {
            warning("It`s impossible to register shader program");
            return false;
        }

    }
    var pAttrs = pProgram.generateInputData(pAttrSemantics, pUniformValues);
    if (this._iActiveFrameBuffer !== null) {
        this._pFrameBufferCounters[this._iActiveFrameBuffer]--;
    }
    return {
        "pProgram"     : pProgram,
        "pAttributes"  : pAttrs,
        "pUniforms"    : pUniformValues,
        "pTextures"    : pTextures,
        "pIndexData"   : this._pCurrentIndex,
        "iOffset"      : this._iCurrentOffset,
        "iLength"      : this._iCurrentLength,
        "iFrameBuffer" : this._iActiveFrameBuffer
    };
};
Renderer.prototype._registerProgram = function (sHash, pProgram) {
    if (this._pPrograms[sHash]) {
        warning("You try to register already used hash");
        return false;
    }
    this._pPrograms[sHash] = pProgram;
    return true;
};
Renderer.prototype._registerPassBlend = function (pBlend) {
    if (this._pPassBlends[pBlend.sHash]) {
        warning("Cannot register pass blend with this hash");
        return false;
    }
    this._pPassBlends[pBlend.sHash] = pBlend;
    return true;
};

//----PreRender applying methods----//
Renderer.prototype.applyBufferMap = function (pMap) {
    trace(pMap);
    if (!pMap) {
        warning("Don`t have bufferMap");
        return true;
    }
    if (this._iCurrentOffset === null || this._iCurrentLength === null) {
        this._iCurrentLength = pMap.length;
        this._iCurrentOffset = pMap.offset;
        this._pCurrentIndex = pMap.index;
    }
    else if (this._iCurrentLength !== pMap.length ||
             this._iCurrentOffset !== pMap.offset) {
        warning("Can not blend buffer maps 1");
        return false;
    }
    else if (this._pCurrentIndex !== undefined && this._pCurrentIndex !== pMap.index) {
        warning("Can not blend buffer maps 2");
        return false;
    }

    var iPass = this._pSnapshotStack[this._pSnapshotStack.length - 1]._iCurrentPass;
    if (!this._pCurrentAttributeData[iPass]) {
        this._pCurrentAttributeData[iPass] = [];
    }
    var pData = this._pCurrentAttributeData[iPass];
    var i, pFlow;
    for (i = 0; i < pMap._nCompleteFlows; i++) {
        pFlow = pMap._pCompleteFlows[i];
        if (pFlow.eType === a.BufferMap.FT_MAPPABLE) {
            pData.push(pFlow);
        }
        else {
            pData.push(pFlow.pData);
        }
    }
};
Renderer.prototype.applyVertexData = function (pData) {
    if (!pData) {
        warning("Don`t have vertex data");
        return true;
    }
    if (this._iCurrentOffset === null || this._iCurrentLength === null) {
        this._iCurrentLength = pData.length;
        this._iCurrentOffset = pData.offset;
    }
    else if (this._iCurrentLength !== pData.length ||
             this._iCurrentOffset !== pData.offset) {
        warning("Can not blend buffer maps 1");
        return false;
    }
    var iPass = this._pSnapshotStack[this._pSnapshotStack.length - 1]._iCurrentPass;
    if (!this._pCurrentAttributeData[iPass]) {
        this._pCurrentAttributeData[iPass] = [pData];
        return;
    }
    this._pCurrentAttributeData[iPass].push(pData);
};
Renderer.prototype.applyFrameBufferTexture = function (pTexture, eAttachment, eTexTarget, iLevel) {
    if (this._iActiveFrameBuffer === null) {
        return false;
    }
    var pDevice = this.pEngine.pDevice;
    eAttachment = (eAttachment === undefined) ? pDevice.COLOR_ATTACHMENT0 : eAttachment;
    eTexTarget = (eTexTarget === undefined) ? pDevice.TEXTURE_2D : eTexTarget;
    iLevel = (iLevel === undefined) ? 0 : iLevel;
    pDevice.framebufferTexture2D(pDevice.FRAMEBUFFER, eAttachment, eTexTarget, pTexture._pTexture, iLevel);
    console.log("Attach texture to farme buffer #" + this._iActiveFrameBuffer);
};

//----Accseosrs----//
Renderer.prototype.getUniformRealName = function (sName) {
    var pSnapshot = this._pCurrentSnapshot;
    var pBlend = this._pCurrentBlend;
    if (!pBlend || !pSnapshot) {
        return false;
    }
    return pBlend.pUniformsBlend[pSnapshot._iCurrentPass].pUniformsByName[sName];
};
Renderer.prototype.getTextureRealName = function (sName) {
    var pSnapshot = this._pCurrentSnapshot;
    var pBlend = this._pCurrentBlend;
    if (!pBlend || !pSnapshot) {
        return false;
    }
    return pBlend.pUniformsBlend[pSnapshot._iCurrentPass].pTexturesByName[sName];
};
Renderer.prototype.getActiveProgram = function () {
    return this._pActiveProgram;
};
Renderer.prototype.totalPasses = function (pEffect) {
    var id = pEffect.resourceHandle();
    if (this._pEffectResoureBlend[id]) {
        return this._pEffectResoureBlend[id].totalValidPasses();
    }
    return 0;
};
Renderer.prototype.getActiveTexture = function (iSlot) {
    return this._pTextureSlots[iSlot];
};
Renderer.prototype.getTextureSlot = function (pTexture) {
    debug_assert(pTexture, "Texture must be");
    var i;
    for (i = 0; i < this._pTextureSlots.length; i++) {
        if (pTexture === this._pTextureSlots[i]) {
            return i;
        }
    }
    return -1;
};

//----Allocators----//
Renderer.prototype._getEmptyTextureSlot = function () {
    var i;
    for (i = 0; i < this._pTextureSlots.length; i++) {
        if (!this._pTextureSlots[i]) {
            return i;
        }
    }
    return this._pActiveProgram.getEmptyTextureSlot();
};
Renderer.prototype._getEmptyFrameBuffer = function () {
    var pDevice = this.pEngine.pDevice;
    var pEmptyBuffers = this._pEmptyFrameBuffers;
    var pFrameBuffer = null;
    var i = 0;
    for (i = 0; i < pEmptyBuffers.length; i++) {
        if (pEmptyBuffers[i] === null) {
            pEmptyBuffers[i] = this._pFramebufferPool[i];
            this._pFrameBufferCounters[i] = 0;
            return i;
        }
    }
    pFrameBuffer = pDevice.createFramebuffer();
    this._pFramebufferPool.push(pFrameBuffer);
    this._pFrameBufferCounters.push(0);
    pEmptyBuffers.push(0);
    return pEmptyBuffers.length - 1;
};
Renderer.prototype._releaseFrameBuffer = function (id) {
    console.log("Release frame buffer");
    var pDevice = this.pEngine.pDevice;
    this._pFrameBufferCounters[id] = 0;
    this._pEmptyFrameBuffers[id] = null;
    pDevice.framebufferTexture2D(pDevice.FRAMEBUFFER, pDevice.COLOR_ATTACHMENT0, pDevice.TEXTURE_2D, null, 0);
};
Renderer.prototype._tryReleaseFrameBuffer = function (id) {
    var nCount = this._pFrameBufferCounters[id];
    if (nCount > 0) {
        nCount--;
        this._pFrameBufferCounters[id] = nCount;
    }
    if (nCount === 0) {
        this._releaseFrameBuffer(id);
    }
};
Renderer.prototype._getTextureSlot = function (pTexture) {
    var i;
    for (i = 0; i < this._pTextureSlots.length; i++) {
        if (pTexture === this._pTextureSlots[i]) {
            return i;
        }
    }
    return -1;
};

//Public methods to activate data for render
Renderer.prototype.activateVertexBuffer = function (pBuffer) {
    if (!this._isRegisterResource(pBuffer)) {
        this.registerRenderResource(pBuffer);
    }
    if (this._pActiveVertexBuffer === pBuffer &&
        this._iActiveVertexBufferState === this._pRenderResourceCounter[pBuffer.toNumber()]) {
        return true;
    }
    this._pActiveVertexBuffer = pBuffer;
    this._iActiveVertexBufferState = this._pRenderResourceCounter[pBuffer.toNumber()];
    trace("Real bind vertex buffer #" + pBuffer.resourceHandle());
    pBuffer.bind();
    return true;
};
Renderer.prototype.activateIndexBuffer = function (pBuffer) {
    if (!this._isRegisterResource(pBuffer)) {
        this.registerRenderResource(pBuffer);
    }
    if (this._pActiveIndexBuffer === pBuffer &&
        this._iActiveIndexBufferState === this._pRenderResourceCounter[pBuffer.toNumber()]) {
        return true;
    }
    this._pActiveIndexBuffer = pBuffer;
    this._iActiveIndexBufferState = this._pRenderResourceCounter[pBuffer.toNumber()];
    trace("Real bind index buffer #" + pBuffer.resourceHandle());
    pBuffer.bind();
    return true;
};
Renderer.prototype.activateProgram = function (pProgram) {
    if (this._pActiveProgram === pProgram) {
        trace("Program already active");
        return true;
    }
    var pDevice = this.pEngine.pDevice;
    var i;
    pProgram.activate();

    for (i = pProgram.getStreamNumber(); i < this._nAttrsUsed; i++) {
        console.log("Disable attrib #" + i);
        pDevice.disableVertexAttribArray(i);
    }

    for (i = 0; i < pProgram.getStreamNumber(); i++) {
        console.log("Enable attrib #" + i);
        pDevice.enableVertexAttribArray(i);
    }

    this._pActiveProgram = pProgram;
    this._nAttrsUsed = pProgram.getStreamNumber();
};
Renderer.prototype.activateFrameBuffer = function (iId) {
    iId = (iId === undefined) ? this._getEmptyFrameBuffer() : iId;
    var pFrameBuffer = this._pFramebufferPool[iId];
    this._iActiveFrameBuffer = iId;
    this.pDevice.bindFramebuffer(this.pDevice.FRAMEBUFFER, pFrameBuffer);
    trace("activateFrameBuffer #" + iId);
    return iId;
};
Renderer.prototype.deactivateFrameBuffer = function (iId) {
    if (iId !== undefined) {
        this._pEmptyFrameBuffers[iId] = null;
        this._pFrameBufferCounters[iId] = 0;
        return true;
    }
    iId = this._iActiveFrameBuffer;
    if (iId !== null) {
        if (this._pFrameBufferCounters[iId] === 0) {
            this._pEmptyFrameBuffers[iId] = null;
        }
        else {
            this._pFrameBufferCounters[iId] *= -1;
        }
    }
    this._iActiveFrameBuffer = null;
    return true;
};

Renderer.prototype.bindTexture = function (pTexture) {
    if (this._pActiveTexture === pTexture) {
        return true;
    }
    trace("Real bind texture #" + pTexture.toNumber());
    this._pActiveTexture = pTexture;
    if (this._iActiveSlot >= -1) {
        this._pTextureSlotStates[this._iActiveSlot] = true;
    }
    pTexture.bind();
    return true;
};
Renderer.prototype.activateTexture = function (pTexture) {
    var i;
    var pSlots = this._pTextureSlots;
    var iSlot;
    iSlot = this._getTextureSlot(pTexture);
    if (iSlot >= 0) {
        if (this._pActiveProgram) {
            this._pActiveProgram.setTextureSlot(iSlot, pTexture);
        }
        return iSlot;
    }
    iSlot = this._getEmptyTextureSlot();
    pSlots[iSlot] = pTexture;
    this._pTextureSlotStates[iSlot] = true;
    if (this._pActiveProgram) {
        this._pActiveProgram.setTextureSlot(iSlot, pTexture);
    }
    return iSlot;
};
Renderer.prototype._activateTextureSlot = function (iSlot, pParams) {
    var pTexture = this._pTextureSlots[iSlot];
    var isBind = false;
    var isParamsEqual = pTexture._hasParams(pParams);
    var pDevice = this.pDevice;
    if (this._pTextureSlotStates[iSlot]) {
        this._iActiveSlot = iSlot;
        this._pTextureSlotStates[iSlot] = false;
        this.pDevice.activeTexture(a.TEXTUREUNIT.TEXTURE + (iSlot || 0));
        this._forceBindTexture(pTexture);
        isBind = true;
    }
    if (!isParamsEqual) {
        if (!isBind) {
            this.pDevice.activeTexture(a.TEXTUREUNIT.TEXTURE + (iSlot || 0));
            this._forceBindTexture(pTexture);
        }
        var eTarget = pTexture.target;
        pDevice.texParameteri(eTarget, a.TPARAM.MAG_FILTER, pParams[a.TPARAM.MAG_FILTER]);
        pDevice.texParameteri(eTarget, a.TPARAM.MIN_FILTER, pParams[a.TPARAM.MIN_FILTER]);
        pDevice.texParameteri(eTarget, a.TPARAM.WRAP_S, pParams[a.TPARAM.WRAP_S]);
        pDevice.texParameteri(eTarget, a.TPARAM.WRAP_T, pParams[a.TPARAM.WRAP_T]);
    }
    return true;
};
Renderer.prototype._forceBindTexture = function (pTexture) {
    trace("Real bind texture(FORCE) #" + pTexture.toNumber());
    this._pActiveTexture = pTexture;
    pTexture.bind();
    return true;
};

//----Real render methods----//
Renderer.prototype.render = function (pEntry) {
    var pProgram = pEntry.pProgram;
    var pAttrs = pEntry.pAttributes;
    var pUniforms = pEntry.pUniforms;
    var pTextures = pEntry.pTextures;
    var pDevice = this.pDevice;
    var pFrameBuffer = pEntry.iFrameBuffer !== null ? this._pFramebufferPool[pEntry.iFrameBuffer] : null;
    var i;
    var nStreams = pProgram.getStreamNumber();
    trace("-------START REAL RENDER---------");
    console.log("bind frame buffer #" + pEntry.iFrameBuffer);
    //pDevice.bindFramebuffer(pDevice.FRAMEBUFFER, pFrameBuffer);

    pProgram.setCurrentTextureSet(pTextures);

    if (this._pActiveProgram !== pProgram) {
        console.log("activate program");
        this.activateProgram(pProgram);
    }
    else {
        console.log("Program already active");
    }

    this._nAttrsUsed = nStreams;

    for (i = 0; i < pAttrs.length; i++) {
        pProgram.applyData(pAttrs[i]);
    }

    var pUniformKeys = Object.keys(pUniforms);
    for (i = 0; i < pUniformKeys.length; i++) {
        pProgram.applyUniform(pUniformKeys[i], pUniforms[pUniformKeys[i]]);
    }
    pProgram.activateTextures();
    pProgram.setCurrentTextureSet(null);

    if (pEntry.pIndexData) {
        this.activateIndexBuffer(pEntry.pIndexData);
        pDevice.drawElements(pEntry.pIndexData.getPrimitiveType(), pEntry.pIndexData.getCount(),
                             pEntry.pIndexData.getType(), pEntry.pIndexData.getOffset());
    }
    else {
        console.log(pEntry.pAttributes);
        pDevice.drawArrays(0, pEntry.iOffset, pEntry.iLength);
    }
    if (pEntry.iFrameBuffer !== null) {
        this._tryReleaseFrameBuffer(pEntry.iFrameBuffer);
    }
//    pProgram.clear();
    trace("-------STOP REAL RENDER---------");
};

//----Render resources----//
Renderer.prototype.vertexBufferChanged = function (pBuffer) {
    pBuffer = pBuffer || this._pActiveVertexBuffer;
    if (!pBuffer) {
        return false;
    }
    trace("Vertex buffer changed #" + pBuffer.resourceHandle());
    this._renderResourceChanged(pBuffer);
};
Renderer.prototype.indexBufferChanged = function (pBuffer) {
    pBuffer = pBuffer || this._pActiveIndexBuffer;
    if (!pBuffer) {
        return false;
    }
    this._renderResourceChanged(pBuffer);
};
Renderer.prototype.getRenderResourceState = function (pResource) {
    if (!this._pRenderResources[pResource.toNumber()]) {
        return false;
    }
    return this._pRenderResourceCounter[pResource.toNumber()]
};
Renderer.prototype.registerRenderResource = function (pResource) {
    var id = pResource.toNumber();
    if (this._pRenderResources[id]) {
        this._pRenderResources[id] = pResource;
        this._pRenderResourceCounter[id]++;
    }
    else {
        this._pRenderResources[id] = pResource;
        this._pRenderResourceCounter[id] = 0;
        this._pRenderResourceCounterKeys.push(id);
    }
};
Renderer.prototype.releaseRenderResource = function (pResource) {
    var id = pResource.toNumber();
    var pCounters = this._pRenderResourceCounter;
    var pResources = this._pRenderResources;
    if (pResources[id]) {
        pCounters[id]++;
        pResources[id] = null;
    }
};
Renderer.prototype._renderResourceChanged = function (pResource) {
    var id = pResource.toNumber();
    var pCounters = this._pRenderResourceCounter;
    if (!pCounters[id]) {
        this.registerRenderResource(pResource);
    }
    pCounters[id]++;
};
Renderer.prototype._clearRenderResources = function () {
    var i;
    var pCounters = this._pRenderResourceCounter;
    var pResources = this._pRenderResources;
    var pKeys = this._pRenderResourceCounterKeys;
    var id;
    for (i = 0; i < pKeys.length; i++) {
        id = pKeys[i];
        if (pResources[id] !== null) {
            pCounters[id] = 0;
        }
        else {
            delete pCounters[id];
            delete pResources[id];
            pKeys.splice(i, 1);
            i--;
        }
    }
};
Renderer.prototype._isRegisterResource = function (pResource) {
    return !!(this._pRenderResources[pResource.toNumber()]);
};


/**
 * Функция инициализации, вызываемая в инициализации менеджеров.
 * @treturn Boolean
 */
Renderer.prototype.initialize = function () {
    return true;
};

/**
 * Аналог деструктора, вызываемого при уничтожении менеджера.
 * @treturn Boolean
 */
Renderer.prototype.destroy = function () {
    return true;
};


Renderer.prototype.restoreDeviceResources = function () {
    return true;
};

Renderer.prototype.destroyDeviceResources = function () {
    return true;
};

Renderer.prototype.createDeviceResources = function () {
    return true;
};

Renderer.prototype.disableDeviceResources = function () {
    return true;
};

a.Renderer = Renderer;
