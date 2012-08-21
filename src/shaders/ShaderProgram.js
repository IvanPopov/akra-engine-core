/**
 * @file
 * @author sss
 * @email <sss@odserve.org>
 */
function ShaderProgram(pEngine) {
    A_CLASS;
    this._pEngine = pEngine;
    this._sHash = null;
    //console.log(pEngine);
    this._pDevice = pEngine.pDevice;
    this._pRenderer = pEngine.shaderManager();
    this._sFragmentCode = "#ifdef GL_ES\nprecision lowp float;\n#endif\n" +
                          "void main(void){gl_FragColor = vec4(0., 0., 0., 1.);}";
    this._sVertexCode = "void main(void){gl_Position = vec4(0., 0., 0., 1.);}";
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
    this._eActiveStream = true;
    this._pActiveStreams = null;
}
a.extend(ShaderProgram, a.ResourcePoolItem);

ShaderProgram.prototype.createResource = function () {
    debug_assert(!this.isResourceCreated(),
                 "The resource has already been created.");

    this.notifyCreated();
    this.notifyDisabled();
    return (true);
};
ShaderProgram.prototype.destroyResource = function () {
    if (this.isResourceCreated()) {
        this._pRenderer._disableShaderProgram(this);
        this.disableResource();
        this.notifyUnloaded();
        this.notifyDestroyed();
        return true;
    }
    return false;
};
ShaderProgram.prototype.disableResource = function () {
    debug_assert(this.isResourceCreated(),
                 "The resource has not been created.");

    this.notifyDisabled();
    return(true);
};
ShaderProgram.prototype.restoreResource = function () {
    debug_assert(this.isResourceCreated(),
                 "The resource has not been created.");

    this.notifyRestored();
    return (true);
};
ShaderProgram.prototype.loadResource = function () {
    return true;
};
ShaderProgram.prototype.saveResource = function () {
    return true;
};

ShaderProgram.prototype.create = function (sHash, sVertexCode, sFragmentCode) {
    var pHardwareProgram, pDevice = this._pDevice;
    this._sHash = sHash;

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
    this._pEngine.shaderManager()._registerProgram(this._sHash, this);
    return true;
};
ShaderProgram.prototype.setup = function (pAttrData, pUniformData, pTextures) {
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
    this._pActiveStreams = new Array(pRealAttr.length);
    for (i = 0; i < this._pActiveStreams.length; i++) {
        this._pActiveStreams[i] = this._eActiveStream;
    }
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
ShaderProgram.prototype.generateInputData = function (pAttrData, pUniformData) {
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
            pAttrs[pAttrReal[sKey]] = pData.pMapper;
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
ShaderProgram.prototype._buildShader = function (eType, sCode) {
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

ShaderProgram.prototype.applyUniform = function (sName, pData) {
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
ShaderProgram.prototype.applyFloat = function (sName, pData) {
    var pDevice = this._pDevice;
    pDevice.uniform1f(this._pRealUniformList[sName], pData);
};
ShaderProgram.prototype.applyInt = function (sName, pData) {
    var pDevice = this._pDevice;
    pDevice.uniform1i(this._pRealUniformList[sName], pData);
};
ShaderProgram.prototype.applyVec2 = function (sName, pData) {
    var pDevice = this._pDevice;
    pDevice.uniform2fv(this._pRealUniformList[sName], pData);
};
ShaderProgram.prototype.applyVec3 = function (sName, pData) {
    var pDevice = this._pDevice;
    pDevice.uniform3fv(this._pRealUniformList[sName], pData);
};
ShaderProgram.prototype.applyVec4 = function (sName, pData) {
    var pDevice = this._pDevice;
    pDevice.uniform4fv(this._pRealUniformList[sName], pData);
};
ShaderProgram.prototype.applyMat4 = function (sName, pData) {
    var pDevice = this._pDevice;
    pDevice.uniformMatrix4fv(this._pRealUniformList[sName], false, pData);
};
ShaderProgram.prototype.applyVideoBuffer = function (sName, pData) {
    if (pData === null) {
        return true;
    }
    var sRealName;
    if (this._pBuffersToReal[sName]) {
        sRealName = a.fx.SHADER_PREFIX.SAMPLER + this._pBuffersToReal[sName];
    }
    else {
        sRealName = sName;
    }
    var iSlot = this._pRenderer.activateTexture(pData);
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
ShaderProgram.prototype.applySampler2D = function (sName, pData) {
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
    var iSlot = this._pRenderer.activateTexture(pTexture);
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
ShaderProgram.prototype.applyData = function (pData, iSlot) {
    if (this._eActiveStream[iSlot] === this._eActiveStream) {
        return true;
    }
    var pVertexData;
    var isMapper = false;
    if (pData.pData) {
        pVertexData = pData.pData;
        isMapper = true;
    }
    else {
        pVertexData = pData;
    }
    var pDevice = this._pDevice;
    var iOffset = 0;
    var iStride = pVertexData.getStride();
    var pManager = this._pRenderer;
    var pAttrs = this._pAttrToReal,
        iStream,
        pDecl;
    var pVertexElement;
    var pVertexBuffer = pVertexData.buffer;
    var iState = pManager.getRenderResourceState(pVertexBuffer);
    var isActivate = false;
    pDecl = pVertexData.getVertexDeclaration();
    if (isMapper) {
        if (this._pStreams[iSlot] === iState) {
            return true;
        }
        this._pStreams[iSlot] = iState;
        pManager.activateVertexBuffer(pVertexBuffer, true);
        pVertexElement = pDecl.element(pData.eSemantics);
        pDevice.vertexAttribPointer(iSlot,
                                    pVertexElement.nCount,
                                    pVertexElement.eType,
                                    false,
                                    iStride,
                                    pVertexElement.iOffset);
        this._pActiveStreams[iSlot] = this._eActiveStream;
        return true;
    }
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
        if (!isActivate) {
            pManager.activateVertexBuffer(pVertexBuffer, true);
            isActivate = true;
        }
        pDevice.vertexAttribPointer(iStream,
                                    pVertexElement.nCount,
                                    pVertexElement.eType,
                                    false,
                                    iStride,
                                    pVertexElement.iOffset);
        this._pActiveStreams[iStream] = this._eActiveStream;
    }
    return true;
};

ShaderProgram.prototype.setCurrentTextureSet = function (pTextures) {
    this._pTextures = pTextures;
};
ShaderProgram.prototype.setAttrParams = function (pAttrToReal, pAttrToBuffer, pSamplersToReal, pBuffersToReal, nAttr,
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
ShaderProgram.prototype.setUniformVars = function (pUniforms, isZeroSampler) {
    this._pUniformVars = pUniforms;
    this._isZeroSampler = isZeroSampler || false;
};
ShaderProgram.prototype.setTextureSlot = function (iSlot, pTexture) {
    this._pTextureSlots[iSlot] = this._nActiveTimes;
};

ShaderProgram.prototype.getSourceCode = function (eType) {
    return (eType === a.SHADERTYPE.VERTEX ? this._sVertexCode : this._sFragmentCode);
};
ShaderProgram.prototype.getEmptyTextureSlot = function () {
    var i;
    var pSlots = this._pTextureSlots;
    for (i = 0; i < pSlots.length; i++) {
        if (pSlots[i] !== this._nActiveTimes) {
            return i;
        }
    }
};
ShaderProgram.prototype.getStreamData = function (iStream) {
    return this._pStreams[iStream];
};
ShaderProgram.prototype.getStreamNumber = function () {
    return this._pRealAttr.length;
};

ShaderProgram.prototype.activate = function () {
    this._nActiveTimes++;
    this._pDevice.useProgram(this._pHardwareProgram);
    if (this._isZeroSampler) {
        this.applyInt(PassBlend.sZeroSampler, a.fx.ZEROSAMPLER);
    }
};
ShaderProgram.prototype.deactivate = function () {
    this._pDevice.useProgram(null);
};
ShaderProgram.prototype.isActive = function () {
    return this._pDevice.getParameter(this._pDevice.CURRENT_PROGRAM) === this._pHardwareProgram;
};
ShaderProgram.prototype.activateTextures = function () {
    var i = 0;
    var iCheck = this._nActiveTimes;
    for (i = 0; i < this._pTextureSlots.length; i++) {
        if (this._pTextureSlots[i] === iCheck) {
            console.log("Activate slot #" + i);
            this._pRenderer._activateTextureSlot(i, this._pTextureParams[i]);
        }
    }
};

ShaderProgram.prototype.resetActivationStreams = function () {
    this._eActiveStream = !(this._eActiveStream);
};
ShaderProgram.prototype._programInfoLog = function (pHardwareProgram, pVertexShader, pPixelShader) {
    var pShaderDebugger = this._pEngine.getDevice().getExtension("WEBGL_debug_shaders");

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
ShaderProgram.prototype._shaderInfoLog = function (pShader, eType) {
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

A_NAMESPACE(ShaderProgram);
Define(a.ShaderProgramManager(pEngine), function () {
    a.ResourcePool(pEngine, a.ShaderProgram);
});