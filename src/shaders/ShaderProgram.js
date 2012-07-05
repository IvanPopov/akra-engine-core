/**
 * @file
 * @author Ivan Popov
 * @email <vantuziast@odserve.org>
 */

function loadGLSLSource(sPath, sFilename) {
    var sShader = a.ajax({url: sPath + sFilename, async: false}).data;
    var fnReplacer = function (sSource, sMatch) {
        return a.ajax({url: sPath + sMatch, async: false}).data;
    }

    sShader = sShader.replace(/\#include\s+\"([\w\.]+)\"/ig, fnReplacer);
    sShader = sShader.split('//<-- split -- >');
    return {vertex: sShader[0], fragment: sShader[1]};
}

function loadProgram(pEngine, sPath) {
    var pPath = sPath.split('/'); 
    var sProg = pPath.pop();
    sPath = pPath.join('/');
    if (sPath.length) {
        sPath += '/';
    }
    pShaderSource = loadGLSLSource(sPath, sProg);
    pProgram = pEngine.displayManager().shaderProgramPool().createResource(sProg);
    pProgram.create(pShaderSource.vertex, pShaderSource.fragment, true);
    return pProgram;
}

A_NAMESPACE(loadProgram);
A_NAMESPACE(loadGLSLSource);

/**
 * Basic class(interface) for platform
 * independent shader program.
 * @ctor
 */
function ShaderProgram() {
    A_CLASS;
}
ShaderProgram.prototype.activate = null;
ShaderProgram.prototype.isActive = null;
ShaderProgram.prototype.isValid = null;
ShaderProgram.prototype.build = null;
ShaderProgram.prototype.setup = null;
ShaderProgram.prototype.getSourceCode = null;
ShaderProgram.prototype.setSourceCode = null;
ShaderProgram.prototype.applyBuffer = null;
ShaderProgram.prototype.applyBufferMap = null;
ShaderProgram.prototype.applyMatrix4 = null;

ShaderProgram.prototype.createResource = function () {
    debug_assert(!this.isResourceCreated(),
        "The resource has already been created.");

    this.notifyCreated();
    this.notifyDisabled();
    return (true);
};

ShaderProgram.prototype.destroyResource = function () {
    if (this.isResourceCreated()) {
        // disable the resource
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

a.extend(ShaderProgram, a.ResourcePoolItem);

/**
 * @property GLSLProgram(Engine pEngine, String sVertexCode = null, String sPixelCode = null)
 * @param pEngine Engine instance.
 * @param sVertexCode Source code for vertex shader.
 * @param sPixelCode  Source code for pixel shader.
 * @ctor
 * Constructor.
 */
function GLSLProgram(pEngine) {
    A_CLASS;
    /**
     * @enum
     * Statuses of program.
     */
    Enum([
        INVALID_VERTEX_ELEMENT = -1
    ], SHADER_PROGRAM_STATUS, a.ShaderProgram);

    /**
     * Engine instance.
     * @type Engine.
     * @private
     */
    this._pEngine = pEngine;

    /**
     * Device instance.
     * @type HardwareDevice.
     * @private
     */
    this._pDevice = pEngine.pDevice;

    /**
     * Manager instance.
     * @type ShaderManager
     * @private
     */
    this._pManager = pEngine.pShaderManager;

    /**
     * HarwareProgram.
     * @type HarwareProgram
     * @private
     */
    this._pHarwareProgram = null;

    /**
     * Attributes of this shader program.
     * @type Object
     * @private
     */
    this._pAttributesByName = {};

    /**
     * Source code of vertex shader.
     * @type String
     * @private
     */
    this._sVertexCode = 'void main(void){gl_Position = vec4(vec3(0.), 1.);}';

    /**
     * Source code of pixel shader.
     * @type String
     * @private
     */
    this._sPixelCode = '#ifdef GL_ES\nprecision lowp float;\n#endif\n' +
        'void main(void){gl_FragColor = vec4(vec3(0.), 1.);}';

    /**
     * Vertex declaration of this sahder.
     * @type VertexDeclaration
     * @private
     */
    this._pDeclaration = null;

    /**
     * Attributes of shader.
     * @type Array
     * @private
     */
    this._pAttributes = new Array(16);

    this._nAttrsUsed = 0;

    /**
     * Is this shader program valid?
     * @type Boolean
     * @private
     */
    this._isValid = false;

    /**
     * Shader uniforms.
     * @type Object
     * @private
     */
    this._pUniformList = {};

    for (var i = 0; i < 16; ++i) {
        this._pAttributes[i] = {iLocation:-1, sName:null, pCurrentData:null};
    }
}

a.extend(GLSLProgram, ShaderProgram);

/**
 * Is this program active now?
 * @treturn Boolean
 */
GLSLProgram.prototype.isActive = function () {
    return this._pDevice.getParameter(this._pDevice.CURRENT_PROGRAM) === this._pHarwareProgram;
};

/**
 * Get source code of shaders.
 * @param SHADER_TYPE eType Type of shader.
 * @treturn String
 */
GLSLProgram.prototype.getSourceCode = function (eType) {
    return (eType === a.SHADERTYPE.VERTEX ? this._sVertexCode : this._sPixelCode);
};

/**
 * Set source code of shader with type eType.
 * @tparam SHADER_TYPE eType
 * @tparam String sCode
 * @treturn Boolean
 */
GLSLProgram.prototype.setSourceCode = function (eType, sCode) {
    switch (eType) {
        case a.SHADERTYPE.VERTEX:
            this._sVertexCode = sCode;
            return true;
        case a.SHADERTYPE.PIXEL:
            this._sPixelCode = sCode;
            return true;
    }
    return false;
};

/**
 * Get a log compiled shader.
 * @tparam SHADER_TYPE eType
 * @treturn String
 * @private
 */
GLSLProgram.prototype._shaderInfoLog = function (pShader, eType) {
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

/**
 * Get a log compiled program.
 * @treturn String
 * @private
 */
GLSLProgram.prototype._programInfoLog = function () {
    return '<pre style="background-color: #FFCACA;">' + this._pDevice.getProgramInfoLog(this._pHarwareProgram) +
        '</pre>' + '<hr />' +
        '<pre>' + this.getSourceCode(a.SHADERTYPE.VERTEX) + '</pre><hr />' +
        '<pre>' + this.getSourceCode(a.SHADERTYPE.PIXEL) + '</pre>'
};

/**
 * Build shader.
 * @tparam SHADER_TYPE eType
 * @tparam String sCode
 * @return HardwareShader
 * @const
 * @private
 */
GLSLProgram.prototype._buildShader = function (eType, sCode) {
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
GLSLProgram.prototype.create = function (sVertexCode, sPixelCode, bSetup) {
    var pHardwareProgram, pDevice = this._pDevice;

    this._sVertexCode = sVertexCode = sVertexCode || this._sVertexCode;
    this._sPixelCode = sPixelCode = sPixelCode || this._sPixelCode;

    pHardwareProgram = this._pHarwareProgram = pDevice.createProgram();
    pDevice.attachShader(pHardwareProgram, this._buildShader(a.SHADERTYPE.VERTEX, sVertexCode));
    pDevice.attachShader(pHardwareProgram, this._buildShader(a.SHADERTYPE.PIXEL, sPixelCode));
    pDevice.linkProgram(pHardwareProgram);
    if (!pDevice.getProgramParameter(pHardwareProgram, pDevice.VALIDATE_STATUS)) {
        //trace('program not valid', this.findResourceName());
        //trace(pDevice.getProgramInfoLog(pHardwareProgram));
    }
    debug_assert_win(pDevice.getProgramParameter(pHardwareProgram, pDevice.LINK_STATUS),
        'cannot link program', this._programInfoLog());
    this._isValid = true;

    return (bSetup? this.setup(): true);
};

/**
 * Is program valid(ready for activation) ?
 * @treturn Boolean
 */
GLSLProgram.prototype.isValid = function () {
    return this._isValid;
};


PROPERTY(GLSLProgram, 'declaration',
    function () {
        return this._pDeclaration;
    },
    function (pDeclaration) {
        this._pVertexDeclaration = pDeclaration;
    });

//TODO изменить установку юниформов на более подходящую.

/**
 * Setup uniforms from list.
 * @tparam Array pUniformList
 * @private
 */
GLSLProgram.prototype._setupUniforms = function (pUniformList) {
    var pUniforms = this._pUniformList;
    var pDevice = this._pDevice;
    var pProgram = this._pHarwareProgram;

    for (var k = 0; k < pUniformList.length; k++) {
        pUniforms[pUniformList[k]] = pDevice.getUniformLocation(pProgram, pUniformList[k]);
        //trace(pUniformList[k], pUniforms[pUniformList[k]]);
    }
    //for fun...
//    for (k = 0; k < pDevice.getProgramParameter(pProgram, pDevice.ACTIVE_UNIFORMS); ++k) {
//        var pUniformInfo = pDevice.getActiveUniform(pProgram, k);
//        trace(pUniformInfo);
//    }
};

GLSLProgram.prototype.autoSetup = function () {
    var pDevice = this._pDevice;
    var pUniformList = [];
    var pProgram = this._pHarwareProgram;
    var pVertexDeclaration = [];
    var k, n;

    for (k = 0, n = pDevice.getProgramParameter(pProgram, pDevice.ACTIVE_UNIFORMS); k < n; ++k) {
        var pUniformInfo = pDevice.getActiveUniform(pProgram, k);
        pUniformList.push(pUniformInfo.name);
    }

    for (k = 0, n = pDevice.getProgramParameter(pProgram, pDevice.ACTIVE_ATTRIBUTES); k < n; ++k) {
        var pAttrInfo = pDevice.getActiveAttrib(pProgram, k);
        pVertexDeclaration.push({eUsage: pAttrInfo.name, nCount: pAttrInfo.size, eType: pAttrInfo.type});
    }

    pVertexDeclaration = new a.VertexDeclaration(pVertexDeclaration);
    // trace(pUniformList);
    // trace(pVertexDeclaration);
    return this.setup(pVertexDeclaration, pUniformList);
};

/**
 * Setup program.
 * @tparam VertexDeclaration pVertexDeclaration
 * @tparam Array pUniformList
 * @treturn Boolean
 */
GLSLProgram.prototype.setup = function (pVertexDeclaration, pUniformList) {
    debug_assert(this.isValid(), 'Cannot setup invalid program.');

    if (!arguments.length) {
        return this.autoSetup();
    }

    pVertexDeclaration = this._pDeclaration = pVertexDeclaration || this._pDeclaration;

    var isOk = this._setupUniforms(pUniformList);
    var pDevice = this._pDevice;
    var sAttrName, pAttr, iLocation;
    var pAttrs = this._pAttributes,
        pAttrsByName = this._pAttributesByName;
    var iAttrUsed = 0;

    for (var i = 0; i < pVertexDeclaration.length; i++) {
        sAttrName = pVertexDeclaration[i].eUsage;
        iLocation = pDevice.getAttribLocation(this._pHarwareProgram, sAttrName);

        pAttr = pAttrs[iAttrUsed];

        if (iLocation == a.ShaderProgram.INVALID_VERTEX_ELEMENT) {
            warning('Unable to obtain the shader attribute ' + pVertexDeclaration[i].eUsage);
            isOk = false;
            continue;
        }

        pAttr.iLocation = iLocation;
        pAttr.sName = sAttrName;
        iAttrUsed++;
        pAttrsByName[sAttrName] = pAttr;

        pDevice.enableVertexAttribArray(iLocation);
    }

    this._nAttrsUsed = iAttrUsed;


    return isOk;
};

GLSLProgram.prototype.detach = function () {
  //        if (this.findResourceName() == 'A_updateVideoBuffer') return;
    var pAttrs = this._pAttributes;
    var pDevice = this._pDevice;

    this.activate();
    for (var i = 0; i < this._nAttrsUsed; i++) {
        //trace('detach attr', pAttrs[i].sName);
        pDevice.disableVertexAttribArray(pAttrs[i].iLocation);
    }
};

GLSLProgram.prototype.bind = function () {
    this._pDevice.useProgram(this._pHarwareProgram);
};

GLSLProgram.prototype.unbind = function (pPrevProgram) {
    this._pDevice.useProgram(pPrevProgram ? pPrevProgram._pHarwareProgram : null);
};

/**
 * Activation of the program.
 * @note Similar to useProgram in OpenGL/WebGL.
 */
GLSLProgram.prototype.activate = function () {
    this._pManager.activateProgram(this);
};

GLSLProgram.prototype.deactivate = function () {
    this._pManager.deactivateProgram(this);
};

/**
 * Apply matrix to uniform with name sName.
 * @tparam String sName Name of the uniform.
 * @tparam Matrix4 pValue Matrix.
 */
GLSLProgram.prototype.applyMatrix4 = function (sName, pValue) {
    this._pDevice.uniformMatrix4fv(this._pUniformList[sName], false, pValue);
};

GLSLProgram.prototype.applyMatrix3 = function (sName, pValue) {
    this._pDevice.uniformMatrix3fv(this._pUniformList[sName], false, pValue);
};

/**
 * Apply buffer map.
 * @tparam BufferMap pBufferMap
 */
GLSLProgram.prototype.applyBufferMap = function (pBufferMap) {
    var i = 0;
    var pFlow;

    for (i = 0; i < pBufferMap._nCompleteFlows; i++) {
        pFlow = pBufferMap._pCompleteFlows[i];
        if (pFlow.eType === a.BufferMap.FT_MAPPABLE) {
            this.applyBuffer(pFlow.pMapper.pData);
        }
        else {
            this.applyBuffer(pFlow.pData);
        }
    }

    //TODO: Правильно выбрать слот активации!!
    for (i = 0; i < pBufferMap._nCompleteVideoBuffers; i++) {
        //trace('activate buffer', i,'/',pBufferMap._nCompleteVideoBuffers);
        pBufferMap._pCompleteVideoBuffers[i].activate(i);
        this._pDevice.uniform1i(this._pUniformList['A_buffer_' + i], i);
    }
};

/**
 * Apply vertex buffer.
 * @tparam VertexData pVertexData Data for apply.
 */
GLSLProgram.prototype.applyBuffer = function (pVertexData) {
    var pDevice = this._pDevice;
    var iOffset = 0;
    var iStride = pVertexData.getStride();
    var pAttrs = this._pAttributesByName,
        pAttr;
    var pVertexElement;
    var pVertexBuffer = pVertexData.buffer;
    var isActive = this._pManager._pActiveProgram? 
        this._pManager._pActiveProgram.latestBuffer !== pVertexBuffer: false;

    for (i = 0; i < pVertexData.getVertexElementCount(); i++) {
        pVertexElement = pVertexData._pVertexDeclaration[i];
        pAttr = pAttrs[pVertexElement.eUsage];
        if (!pAttr) {
            continue;
        }
        
        if (pAttr.pCurrentData !== pVertexData || 1) {

            if (isActive) {
                isActive = true;
                pVertexBuffer.activate();
                this._pManager.latestBuffer = pVertexBuffer;
            }

            // trace('pDevice.vertexAttribPointer', pAttr.iLocation,
            //     pVertexElement.nCount,
            //     pVertexElement.eType,
            //     false,
            //     iStride,
            //     pVertexElement.iOffset);

            pAttr.pCurrentData = pVertexData;
            pDevice.vertexAttribPointer(pAttr.iLocation,
                pVertexElement.nCount,
                pVertexElement.eType,
                false,
                iStride,
                pVertexElement.iOffset);
        }
        pAttr.pCurrentData = pVertexData;
    }
};

GLSLProgram.prototype.applyVector2 = function (sName) {
    var pDevice = this._pDevice;
    switch (arguments.length) {
        case 2:
            pDevice.uniform2fv(this._pUniformList[sName], arguments[1]);
            break;
        case 3:
            pDevice.uniform2f(this._pUniformList[sName], arguments[1], arguments[2]);
            break;
        default:
            error('Invalid number of arguments.');
    }
};

GLSLProgram.prototype.applyVector3 = function (sName) {
    var pDevice = this._pDevice;
    switch (arguments.length) {
        case 2:
            pDevice.uniform3fv(this._pUniformList[sName], arguments[1]);
            break;
        case 4:
            pDevice.uniform3f(this._pUniformList[sName], arguments[1], arguments[2], arguments[3]);
            break;
        default:
            error('Invalid number of arguments.');
    }
};

GLSLProgram.prototype.applyVector4 = function (sName) {
    var pDevice = this._pDevice;
    switch (arguments.length) {
        case 2:
            pDevice.uniform4fv(this._pUniformList[sName], arguments[1]);
            break;
        case 5:
            pDevice.uniform4f(this._pUniformList[sName], arguments[1], arguments[2], arguments[3], arguments[4]);
            break;
        default:
            error('Invalid number of arguments.');
    }
};

GLSLProgram.prototype.applyInt = function (sName, iValue) {
    this._pDevice.uniform1i(this._pUniformList[sName], iValue);
};
GLSLProgram.prototype.applyFloat = function (sName, fValue) {
    this._pDevice.uniform1f(this._pUniformList[sName], fValue);
};

Define(a.ShaderProgramManager(pEngine), function () {
    a.ResourcePool(pEngine, a.GLSLProgram);
});

a.GLSLProgram = GLSLProgram;