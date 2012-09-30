/**
 * @file
 * @author sss
 * @email <sss@odserve.org>
 */
function ShaderProgram(pEngine) {
    A_CLASS;
    this._pEngine = pEngine;
    this._sHash = null;
    //trace(pEngine);
    this._pDevice = pEngine.pDevice;
    this._pRenderer = pEngine.shaderManager();
    this._sFragmentCode = " void main(void){}";
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

    this._pUniformApplyFunctions = {};
    this._pUniformPreparedData = {};

    this._pStreamToBufferHandle = null;
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
    var i = 0, n;
    var pKeys;
    var sKey1,
        sOffset,
        sSampler,
        sTexture;
    var pData, pTexture, pUniformInfo;
    var pRealAttr = this._pRealAttr,
        pAttrReal = this._pAttrToReal,
        pRealSamplers = this._pRealSamplers,
        pBufReal = this._pAttrToBuffer;
    var pFunctions = this._pUniformApplyFunctions,
        pPreparedData = this._pUniformPreparedData;
    ;
    for (i = 0; i < pRealAttr.length; i++) {
        pRealAttr[i] = pDevice.getAttribLocation(pProgram, a.fx.SHADER_PREFIX.ATTRIBUTE + i);
    }
    for (i = 0, n = pDevice.getProgramParameter(pProgram, pDevice.ACTIVE_UNIFORMS); i < n; i++) {
        pUniformInfo = pDevice.getActiveUniform(pProgram, i);
        pUniformsKeys.push(pUniformInfo.name);
    }
    for (i = 0; i < pUniformsKeys.length; i++) {
        pUniforms[pUniformsKeys[i]] = pDevice.getUniformLocation(pProgram, pUniformsKeys[i]);
    }
    for (i = 0; i < pRealSamplers.length; i++) {
        sSampler = a.fx.SHADER_PREFIX.SAMPLER + i;
        pRealSamplers[i] = pUniforms[sSampler];
        pPreparedData[sSampler] = null;
        if (this._pPassBlend.pSamplers[sSampler]) {
            pFunctions[sSampler] = this.applySampler2D;
        }
        else {
            pFunctions[sSampler] = this.applyVideoBuffer;
        }
    }
    pKeys = this._pATRKeys;
    for (i = 0; i < pKeys.length; i++) {
        sKey1 = pKeys[i];
        pData = pAttrData[sKey1];
        if (pAttrReal[sKey1] !== undefined) {
            pAttrReal[sKey1] = pRealAttr[pAttrReal[sKey1]];
            if (pData.eType === a.BufferMap.FT_MAPPABLE) {
                sOffset = a.fx.SHADER_PREFIX.OFFSET + sKey1;
                if (pUniforms[sOffset]) {
                    pOffsets[sOffset] = null;
                    pBuffers[a.fx.SHADER_PREFIX.SAMPLER + this._pAttrToBuffer[sKey1]] = null;
                    pFunctions[sOffset] = this.applyFloat;
                    pPreparedData[sOffset] = null;
                }
            }
        }
    }

    this._pUniformKeys = pUniformsKeys;
    this._pStreams = new Array(pRealAttr.length);
    this._pStreamToBufferHandle = new Array(pRealAttr.length);

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
                warning("Something bad with offsets");
                continue;
            }
            if (this._pOffsets[sOffset] === null) {
                pUniformData[sOffset] = pData.pData.getVertexDeclaration().element(sKey).iOffset;
                sBuf = a.fx.SHADER_PREFIX.SAMPLER + this._pAttrToBuffer[sKey];
                pUniformData[sBuf] = pData.pData.buffer;
                this._pBuffersToReal[sBuf] = sBuf;
            }
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
    if (pData === null) {
        return false;
    }
    if (this._pUniformApplyFunctions[sName]) {
        return this._pUniformApplyFunctions[sName].call(this, sName, pData);
    }
    // trace("Something going wrong:", sName, pData);
    return false;
};

ShaderProgram.prototype.applyFloat = function (sName, pData) {
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    var pDevice = this._pDevice;
    pDevice.uniform1f(this._pRealUniformList[sName], pData);
};
ShaderProgram.prototype.applyInt = function (sName, pData) {
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    var pDevice = this._pDevice;
    pDevice.uniform1i(this._pRealUniformList[sName], pData);
};
ShaderProgram.prototype.applyVec2I = function (sName, pData) {
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    pData = (pData.pData !== undefined) ? pData.pData : pData;
    var pDevice = this._pDevice;
    pDevice.uniform2iv(this._pRealUniformList[sName], pData);
};
ShaderProgram.prototype.applyVec3I = function (sName, pData) {
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    pData = (pData.pData !== undefined) ? pData.pData : pData;
    var pDevice = this._pDevice;
    pDevice.uniform3iv(this._pRealUniformList[sName], pData);
};
ShaderProgram.prototype.applyVec4I = function (sName, pData) {
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    pData = (pData.pData !== undefined) ? pData.pData : pData;
    var pDevice = this._pDevice;
    pDevice.uniform4iv(this._pRealUniformList[sName], pData);
};
ShaderProgram.prototype.applyVec2F = function (sName, pData) {
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    pData = (pData.pData !== undefined) ? pData.pData : pData;
    var pDevice = this._pDevice;
    pDevice.uniform2fv(this._pRealUniformList[sName], pData);
};
ShaderProgram.prototype.applyVec3F = function (sName, pData) {
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    pData = (pData.pData !== undefined) ? pData.pData : pData;
    var pDevice = this._pDevice;
    pDevice.uniform3fv(this._pRealUniformList[sName], pData);
};
ShaderProgram.prototype.applyVec4F = function (sName, pData) {
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    pData = (pData.pData !== undefined) ? pData.pData : pData;
    var pDevice = this._pDevice;
    pDevice.uniform4fv(this._pRealUniformList[sName], pData);
};
ShaderProgram.prototype.applyMat2 = function (sName, pData) {
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    pData = (pData.pData !== undefined) ? pData.pData : pData;
    var pDevice = this._pDevice;
    pDevice.uniformMatrix2fv(this._pRealUniformList[sName], false, pData);
};
ShaderProgram.prototype.applyMat3 = function (sName, pData) {
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    pData = (pData.pData !== undefined) ? pData.pData : pData;
    var pDevice = this._pDevice;
    pDevice.uniformMatrix3fv(this._pRealUniformList[sName], false, pData);
};
ShaderProgram.prototype.applyMat4 = function (sName, pData) {
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    pData = (pData.pData !== undefined) ? pData.pData : pData;
    var pDevice = this._pDevice;
    pDevice.uniformMatrix4fv(this._pRealUniformList[sName], false, pData);
};
ShaderProgram.prototype.applyFloatArray = function (sName, pData) {
    sName += "[0]";
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    var pDevice = this._pDevice;
    pDevice.uniform1fv(this._pRealUniformList[sName], pData);
};
ShaderProgram.prototype.applyIntArray = function (sName, pData) {
    sName += "[0]";
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    var pDevice = this._pDevice;
    pDevice.uniform1iv(this._pRealUniformList[sName], pData);
};
ShaderProgram.prototype.applyVec2IArray = function (sName, pData) {
    var pPreparedData = this._pUniformPreparedData[sName];
    sName += "[0]";
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    if (pData.length !== pPreparedData.length) {
        var iSize = 2;
        var iLength = pPreparedData.length / iSize;
        if (pData.length !== iLength || !pData[0].pData || pData[0].pData.length !== iSize) {
            return false;
        }
        for (var i = 0; i < iLength; i++) {
            for (var j = 0; j < iSize; j++) {
                pPreparedData[i * iSize + j] = pData[i].pData[j];
            }
        }
    }
    else {
        pPreparedData = pData;
    }
    var pDevice = this._pDevice;
    pDevice.uniform2iv(this._pRealUniformList[sName], pPreparedData);
};
ShaderProgram.prototype.applyVec3IArray = function (sName, pData) {
    var pPreparedData = this._pUniformPreparedData[sName];
    sName += "[0]";
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    if (pData.length !== pPreparedData.length) {
        var iSize = 3;
        var iLength = pPreparedData.length / iSize;
        if (pData.length !== iLength || !pData[0].pData || pData[0].pData.length !== iSize) {
            return false;
        }
        for (var i = 0; i < iLength; i++) {
            for (var j = 0; j < iSize; j++) {
                pPreparedData[i * iSize + j] = pData[i].pData[j];
            }
        }
    }
    else {
        pPreparedData = pData;
    }
    var pDevice = this._pDevice;
    pDevice.uniform3iv(this._pRealUniformList[sName], pPreparedData);
};
ShaderProgram.prototype.applyVec4IArray = function (sName, pData) {
    var pPreparedData = this._pUniformPreparedData[sName];
    sName += "[0]";
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    if (pData.length !== pPreparedData.length) {
        var iSize = 4;
        var iLength = pPreparedData.length / iSize;
        if (pData.length !== iLength || !pData[0].pData || pData[0].pData.length !== iSize) {
            return false;
        }
        for (var i = 0; i < iLength; i++) {
            for (var j = 0; j < iSize; j++) {
                pPreparedData[i * iSize + j] = pData[i].pData[j];
            }
        }
    }
    else {
        pPreparedData = pData;
    }
    var pDevice = this._pDevice;
    pDevice.uniform4iv(this._pRealUniformList[sName], pPreparedData);
};
ShaderProgram.prototype.applyVec2FArray = function (sName, pData) {
    var pPreparedData = this._pUniformPreparedData[sName];
    sName += "[0]";
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    if (pData.length !== pPreparedData.length) {
        var iSize = 2;
        var iLength = pPreparedData.length / iSize;
        if (pData.length !== iLength || !pData[0].pData || pData[0].pData.length !== iSize) {
            return false;
        }
        for (var i = 0; i < iLength; i++) {
            for (var j = 0; j < iSize; j++) {
                pPreparedData[i * iSize + j] = pData[i].pData[j];
            }
        }
    }
    else {
        pPreparedData = pData;
    }
    var pDevice = this._pDevice;
    pDevice.uniform2fv(this._pRealUniformList[sName], pPreparedData);
};
ShaderProgram.prototype.applyVec3FArray = function (sName, pData) {
    var pPreparedData = this._pUniformPreparedData[sName];
    sName += "[0]";
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    if (pData.length !== pPreparedData.length) {
        var iSize = 3;
        var iLength = pPreparedData.length / iSize;
        if (pData.length !== iLength || !pData[0].pData || pData[0].pData.length !== iSize) {
            return false;
        }
        for (var i = 0; i < iLength; i++) {
            for (var j = 0; j < iSize; j++) {
                pPreparedData[i * iSize + j] = pData[i].pData[j];
            }
        }
    }
    else {
        pPreparedData = pData;
    }
    var pDevice = this._pDevice;
    pDevice.uniform3fv(this._pRealUniformList[sName], pPreparedData);
};
ShaderProgram.prototype.applyVec4FArray = function (sName, pData) {
    var pPreparedData = this._pUniformPreparedData[sName];
    sName += "[0]";
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    if (pData.length !== pPreparedData.length) {
        var iSize = 4;
        var iLength = pPreparedData.length / iSize;
        if (pData.length !== iLength || !pData[0].pData || pData[0].pData.length !== iSize) {
            return false;
        }
        for (var i = 0; i < iLength; i++) {
            for (var j = 0; j < iSize; j++) {
                pPreparedData[i * iSize + j] = pData[i].pData[j];
            }
        }
    }
    else {
        pPreparedData = pData;
    }
    var pDevice = this._pDevice;
    pDevice.uniform4fv(this._pRealUniformList[sName], pPreparedData);
};
ShaderProgram.prototype.applyMat2Array = function (sName, pData) {
    var pPreparedData = this._pUniformPreparedData[sName];
    sName += "[0]";
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    if (pData.length !== pPreparedData.length) {
        var iSize = 4;
        var iLength = pPreparedData.length / iSize;
        if (pData.length !== iLength || !pData[0].pData || pData[0].pData.length !== iSize) {
            return false;
        }
        for (var i = 0; i < iLength; i++) {
            for (var j = 0; j < iSize; j++) {
                pPreparedData[i * iSize + j] = pData[i].pData[j];
            }
        }
    }
    else {
        pPreparedData = pData;
    }
    var pDevice = this._pDevice;
    pDevice.uniformMatrix2fv(this._pRealUniformList[sName], false, pPreparedData);
};
ShaderProgram.prototype.applyMat3Array = function (sName, pData) {
    var pPreparedData = this._pUniformPreparedData[sName];
    sName += "[0]";
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    if (pData.length !== pPreparedData.length) {
        var iSize = 9;
        var iLength = pPreparedData.length / iSize;
        if (pData.length !== iLength || !pData[0].pData || pData[0].pData.length !== iSize) {
            return false;
        }
        for (var i = 0; i < iLength; i++) {
            for (var j = 0; j < iSize; j++) {
                pPreparedData[i * iSize + j] = pData[i].pData[j];
            }
        }
    }
    else {
        pPreparedData = pData;
    }
    var pDevice = this._pDevice;
    pDevice.uniformMatrix3fv(this._pRealUniformList[sName], false, pPreparedData);
};
ShaderProgram.prototype.applyMat4Array = function (sName, pData) {
    var pPreparedData = this._pUniformPreparedData[sName];
    sName += "[0]";
    if (!this._pRealUniformList[sName]) {
        return false;
    }
    if (pData.length !== pPreparedData.length) {
        var iSize = 16;
        var iLength = pPreparedData.length / iSize;
        if (pData.length !== iLength || !pData[0].pData || pData[0].pData.length !== iSize) {
            return false;
        }
        for (var i = 0; i < iLength; i++) {
            for (var j = 0; j < iSize; j++) {
                pPreparedData[i * iSize + j] = pData[i].pData[j];
            }
        }
    }
    else {
        pPreparedData = pData;
    }
    var pDevice = this._pDevice;
    pDevice.uniformMatrix4fv(this._pRealUniformList[sName], false, pPreparedData);
};

ShaderProgram.prototype.applyComplicateUniform = function (sName, pData) {
    var pVar = this._pUniformVars[sName];
    var iLength;
    var i, j;
    var sPrevName = sName;
    var pOrders = pVar.pType.pEffectType.pDesc.pOrders;
    if (pVar.isArray) {
        iLength = pVar.getLength();
        for (i = 0; i < iLength; i++) {
            for (j = 0; j < pOrders.length; j++) {
                this._applySubVariable(pOrders[j], sPrevName + "[" + i + "].", pData[i][pOrders[j].getRealName()]);
            }
        }
    }
    else {
        for (j = 0; j < pOrders.length; j++) {
            this._applySubVariable(pOrders[j], sPrevName + ".", pData[pOrders[j].getRealName()]);
        }
    }
    return true;
};
ShaderProgram.prototype._applySubVariable = function (pVar, sPreviousName, pData) {
    var sName = sPreviousName + pVar.getRealName();
    if (pVar.pType.isBase()) {
        this.applyUniform(sName, pData);
    }
    else {
        var i, j;
        var iLength;
        var pOrders = pVar.pType.pEffectType.pDesc.pOrders;
        if (pVar.isArray) {
            iLength = pVar.getLength();
            for (i = 0; i < iLength; i++) {
                for (j = 0; j < pOrders.length; j++) {
                    this._applySubVariable(pOrders[j], sName + "[" + i + "].", pData[i][pOrders[j].getRealName()]);
                }
            }
        }
        else {
            for (j = 0; j < pOrders.length; j++) {
                this._applySubVariable(pOrders[j], sName + ".", pData[pOrders[j].getRealName()]);
            }
        }
    }
    return true;
};

ShaderProgram.prototype.applySampler2D = function (sName, pData) {
    var sTexture, pTexture;
    if (!pData) {
        return true;
    }
    var sRealName = this._pSamplersToReal[sName];
    var pSlots;
    var i;
    var pTextureParam;
    if (sRealName === null) {
        //Zero sampler
        return true;
    }
    if (typeof(sRealName) === "object") {
        pSlots = sRealName;
        sRealName = sName;

        for (i = 0; i < pSlots.length; i++) {
            sTexture = pData[i][a.fx.GLOBAL_VARS.TEXTURE];
            pTexture = this._pTextures ? (this._pTextures[sTexture]) : null;
            if (!pTexture) {
                pSlots[i] = a.fx.ZEROSAMPLER;
            }
            else {
                pSlots[i] = this._pRenderer.activateTexture(pTexture);
                pTextureParam = this._pTextureParams[pSlots[i]];
                // trace("Slot #" + pSlots[i]);
                pTextureParam[a.TPARAM.MAG_FILTER] = pData[i][a.TPARAM.MAG_FILTER] ||
                                                     pTexture._getParameter(a.TPARAM.MAG_FILTER) ||
                                                     a.TFILTER.LINEAR;
                pTextureParam[a.TPARAM.MIN_FILTER] = pData[i][a.TPARAM.MIN_FILTER] ||
                                                     pTexture._getParameter(a.TPARAM.MIN_FILTER) ||
                                                     a.TFILTER.LINEAR;
                pTextureParam[a.TPARAM.WRAP_S] = pData[i][a.TPARAM.WRAP_S] ||
                                                 pTexture._getParameter(a.TPARAM.WRAP_S) ||
                                                 a.TWRAPMODE.REPEAT;
                pTextureParam[a.TPARAM.WRAP_T] = pData[i][a.TPARAM.WRAP_T] ||
                                                 pTexture._getParameter(a.TPARAM.WRAP_T) ||
                                                 a.TWRAPMODE.REPEAT;
            }
        }
        return this.applyIntArray(sRealName, pSlots);
    }
    if (pData.length >= 0) {
        sTexture = pData[0][a.fx.GLOBAL_VARS.TEXTURE];
    }
    else {
        sTexture = pData[a.fx.GLOBAL_VARS.TEXTURE];
    }
    pTexture = this._pTextures ? (this._pTextures[sTexture]) : null;
    var iSlot;
    if (!pTexture) {
        iSlot = a.fx.ZEROSAMPLER;
    }
    else {
        iSlot = this._pRenderer.activateTexture(pTexture);
        pTextureParam = this._pTextureParams[iSlot];
        // trace("Slot #" + iSlot);
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
    }
    return this.applyInt(sRealName, iSlot);
};
ShaderProgram.prototype.applySampler2DInStruct = function (sName, pData) {
    if (!pData) {
        return true;
    }
    var sTexture, pTexture;
    var pPreparedData = this._pUniformPreparedData[sName];
    var iSlot;
    var pTextureParam;

    if (pPreparedData === null) {
        sTexture = pData[a.fx.GLOBAL_VARS.TEXTURE];
        pTexture = this._pTextures ? (this._pTextures[sTexture]) : null;
        if (!pTexture) {
            iSlot = a.fx.ZEROSAMPLER;
        }
        else {
            iSlot = this._pRenderer.activateTexture(pTexture);
            pTextureParam = this._pTextureParams[iSlot];

            // trace("Slot #" + iSlot);
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
        }
        return this.applyInt(sName, iSlot);
    }
    else {
        for (var i = 0; i < pPreparedData.length; i++) {
            sTexture = pData[i][a.fx.GLOBAL_VARS.TEXTURE];
            pTexture = this._pTextures ? (this._pTextures[sTexture]) : null;
            if (!pTexture) {
                pPreparedData[i] = a.fx.ZEROSAMPLER;
            }
            else {
                pPreparedData[i] = this._pRenderer.activateTexture(pTexture);
                pTextureParam = this._pTextureParams[pPreparedData[i]];
                // trace("Slot #" + pPreparedData[i]);
                pTextureParam[a.TPARAM.MAG_FILTER] = pData[i][a.TPARAM.MAG_FILTER] ||
                                                     pTexture._getParameter(a.TPARAM.MAG_FILTER) ||
                                                     a.TFILTER.LINEAR;
                pTextureParam[a.TPARAM.MIN_FILTER] = pData[i][a.TPARAM.MIN_FILTER] ||
                                                     pTexture._getParameter(a.TPARAM.MIN_FILTER) ||
                                                     a.TFILTER.LINEAR;
                pTextureParam[a.TPARAM.WRAP_S] = pData[i][a.TPARAM.WRAP_S] ||
                                                 pTexture._getParameter(a.TPARAM.WRAP_S) ||
                                                 a.TWRAPMODE.REPEAT;
                pTextureParam[a.TPARAM.WRAP_T] = pData[i][a.TPARAM.WRAP_T] ||
                                                 pTexture._getParameter(a.TPARAM.WRAP_T) ||
                                                 a.TWRAPMODE.REPEAT;
            }
        }
        return this.applyIntArray(sName, pPreparedData);
    }
};

ShaderProgram.prototype.applyVideoBuffer = function (sName, pData) {
    var sRealName = this._pBuffersToReal[sName];
    if (sRealName === null) {
        //Zero sampler
        return true;
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

ShaderProgram.prototype.applyData = function (pData, iSlot) {
    if (!pData) {
        return false;
    }
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
    var iStride = pVertexData.getStride();
    var pManager = this._pRenderer;
    var pAttrs = this._pAttrToReal,
        iStream,
        pDecl;
    var pVertexElement;
    var pVertexBuffer = pVertexData.buffer;
    var iState = pManager.getRenderResourceState(pVertexBuffer);
    var iBufferHandle = this._pStreamToBufferHandle[iSlot];
    var iStreamState = this.toNumber();
    var isActivate = false;
    var isChange = false;
    pDecl = pVertexData.getVertexDeclaration();
    if (isMapper) {
//        A_TRACER.MESG("apply data: " + iState + " : " + this._pStreams[iSlot]);
        //Switch between shader programs
        if (iBufferHandle !== pVertexBuffer.toNumber()) {
            isChange = true;
        }
        else if (iStreamState !== pManager._getStreamState(iSlot)) {
            isChange = true;
        }
        else if (this._pStreams[iSlot] !== iState) {
            isChange = true;
        }
        if (!isChange) {
            return true;
        }
        this._pStreams[iSlot] = iState;
        this._pStreamToBufferHandle[iSlot] = pVertexBuffer.toNumber();
        pManager._occupyStream(iSlot, this);
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
        if (iStreamState !== pManager._getStreamState(iSlot)) {
            isChange = true;
        }
        else if (this._pStreams[iStream] !== iState) {
            isChange = true;
        }
        if (!isChange) {
            return true;
        }
        this._pStreams[iStream] = iState;
        pManager._occupyStream(iStream, this);
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
    var i;
    var pVar;
    for (i in pUniforms) {
        pVar = pUniforms[i];
        if (!pVar) {
            continue;
        }
        this._chooseApplyUniformFunction(pVar, i);
    }
};
ShaderProgram.prototype.setTextureSlot = function (iSlot, pTexture) {
    this._pTextureSlots[iSlot] = this._nActiveTimes;
};
ShaderProgram.prototype._preparedUniformData = function (pVar) {
    var pData;
    var sType;
    if (!pVar.isArray && pVar.iSize === 1) {
        return null;
    }
    sType = pVar.pType.pEffectType.toCode();
    var isFloat = true;
    if (sType === "float" || sType === "vec2" || sType === "vec3" || sType === "vec4" ||
        sType === "mat2" || sType === "mat3" || sType === "mat4") {
        isFloat = true;
    }
    else {
        isFloat = false;
    }
    if (isFloat) {
        pData = new Float32Array(pVar.iSize);
    }
    else {
        pData = new Int32Array(pVar.iSize);
    }
    return pData;
};
ShaderProgram.prototype._chooseApplyUniformFunction = function (pVar, sVarName, sPreviousName) {
    sPreviousName = sPreviousName || "";
    var pPreparedData = this._pUniformPreparedData;
    var pFunctions = this._pUniformApplyFunctions;
    var sName = sPreviousName + sVarName;
    var isArray = pVar.isArray;
    if (pVar.pType.isBase()) {
        var sType = pVar.pType.pEffectType.toCode();
        pPreparedData[sName] = this._preparedUniformData(pVar);
        switch (sType) {
            case "float":
                if (isArray) {
                    pFunctions[sName] = this.applyFloatArray;
                }
                else {
                    pFunctions[sName] = this.applyFloat;
                }
                break;
            case "int":
                if (isArray) {
                    pFunctions[sName] = this.applyIntArray;
                }
                else {
                    pFunctions[sName] = this.applyInt;
                }
                break;
            case "vec2":
                if (isArray) {
                    pFunctions[sName] = this.applyVec2FArray;
                }
                else {
                    pFunctions[sName] = this.applyVec2F;
                }
                break;
            case "vec3":
                if (isArray) {
                    pFunctions[sName] = this.applyVec3FArray;
                }
                else {
                    pFunctions[sName] = this.applyVec3F;
                }
                break;
            case "vec4":
                if (isArray) {
                    pFunctions[sName] = this.applyVec4FArray;
                }
                else {
                    pFunctions[sName] = this.applyVec4F;
                }
                break;
            case "ivec2":
                if (isArray) {
                    pFunctions[sName] = this.applyVec2IArray;
                }
                else {
                    pFunctions[sName] = this.applyVec2I;
                }
                break;
            case "ivec3":
                if (isArray) {
                    pFunctions[sName] = this.applyVec3IArray;
                }
                else {
                    pFunctions[sName] = this.applyVec3I;
                }
                break;
            case "ivec4":
                if (isArray) {
                    pFunctions[sName] = this.applyVec4IArray;
                }
                else {
                    pFunctions[sName] = this.applyVec4I;
                }
                break;
            case "mat2":
                if (isArray) {
                    pFunctions[sName] = this.applyMat2Array;
                }
                else {
                    pFunctions[sName] = this.applyMat2;
                }
                break;
            case "mat3":
                if (isArray) {
                    pFunctions[sName] = this.applyMat3Array;
                }
                else {
                    pFunctions[sName] = this.applyMat3;
                }
                break;
            case "mat4":
                if (isArray) {
                    pFunctions[sName] = this.applyMat4Array;
                }
                else {
                    pFunctions[sName] = this.applyMat4;
                }
                break;
            case "sampler2D":
            case "samplerCube":
                if (pVar.isSampler()) {
                    if (sName.indexOf(".") === -1) {
                        pFunctions[sName] = this.applySampler2D;
                    }
                    else {
                        pFunctions[sName] = this.applySampler2DInStruct;
                    }
                }
                else {
                    // trace("######### apply video buffer -------", pVar);
                    pFunctions[sName] = this.applyVideoBuffer;
                }
                break;
            default:
                warning("Another base types are not support yet");
        }
    }
    else {
        var i, j;
        var iLength;
        var pOrders = pVar.pType.pEffectType.pDesc.pOrders;
        if (!sPreviousName) {
            pFunctions[sName] = this.applyComplicateUniform;
        }
        if (pVar.isArray) {
            iLength = pVar.getLength();
            for (i = 0; i < iLength; i++) {
                for (j = 0; j < pOrders.length; j++) {
                    this._chooseApplyUniformFunction(pOrders[j], pOrders[j].getRealName(), sName + "[" + i + "].");
                }
            }
        }
        else {
            for (j = 0; j < pOrders.length; j++) {
                this._chooseApplyUniformFunction(pOrders[j], pOrders[j].getRealName(), sName + ".");
            }
        }
    }
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
            // trace("Activate texture slot #" + i);
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
