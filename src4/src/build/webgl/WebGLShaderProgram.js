/// <reference path="../idl/IShaderProgram.ts" />
/// <reference path="../idl/IBufferMap.ts" />
/// <reference path="../idl/IAFXSamplerState.ts" />
/// <reference path="../pool/ResourcePoolItem.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../math/math.ts" />
    (function (webgl) {
        var WebGLShaderProgram = (function (_super) {
            __extends(WebGLShaderProgram, _super);
            function WebGLShaderProgram() {
                _super.apply(this, arguments);
                this._iTotalAttributes = 0;
            }
            WebGLShaderProgram.prototype.create = function (csVertex, csPixel) {
                if (arguments.length > 0) {
                    return this.compile(csVertex, csPixel);
                }

                return false;
            };

            WebGLShaderProgram.prototype.destroy = function () {
                this._pWebGLRenderer.deleteWebGLProgram(this._pWebGLProgram);

                this._pWebGLUniformLocations = null;
                this._pWebGLAttributeLocations = null;
                this._pWebGLAttributesInfo = null;

                this.notifyDestroyed();
                this.notifyDisabled();
            };

            WebGLShaderProgram.prototype.compile = function (csVertex, csPixel) {
                if (typeof csVertex === "undefined") { csVertex = akra.webgl.GLSL_VS_SHADER_MIN; }
                if (typeof csPixel === "undefined") { csPixel = akra.webgl.GLSL_FS_SHADER_MIN; }
                var pWebGLRenderer = this._pWebGLRenderer = this.getManager().getEngine().getRenderer();
                var pWebGLContext = this._pWebGLContext = pWebGLRenderer.getWebGLContext();
                var pWebGLProgram = this._pWebGLProgram = pWebGLRenderer.createWebGLProgram();

                var pWebGLVs = this.createWebGLShader(35633 /* VERTEX_SHADER */, csVertex);
                var pWebGLFs = this.createWebGLShader(35632 /* FRAGMENT_SHADER */, csPixel);

                // (<any>this)._debuginfo = {vs: csVertex, ps: csPixel};
                /** because, if not all units correctly activated, can obtained wronf link status */
                pWebGLRenderer._disableAllTextureUnits();

                pWebGLContext.attachShader(pWebGLProgram, pWebGLVs);
                pWebGLContext.attachShader(pWebGLProgram, pWebGLFs);

                pWebGLContext.linkProgram(pWebGLProgram);

                // logger.log("================================", this.findResourceName());
                // logger.log(pWebGLContext.getShaderSource(pWebGLVs));
                // logger.log(pWebGLContext.getShaderSource(pWebGLFs));
                // console.log(csPixel);
                if (!this.isLinked()) {
                    akra.logger.error("cannot link GLSL program(guid: %d)", this.guid);

                    if (akra.config.DEBUG) {
                        var sInfo = pWebGLContext.getProgramInfoLog(pWebGLProgram);

                        akra.logger.log("shader program errors: \n" + sInfo);

                        //+ "\n\nvertex code:\n"  + csVertex + "\n\n pixel code: " + csPixel);
                        if (akra.webgl.loadExtension(pWebGLContext, akra.webgl.WEBGL_DEBUG_SHADERS)) {
                            akra.logger.log("translated(from GLSL) VS shader: \n" + pWebGLContext.getExtension(akra.webgl.WEBGL_DEBUG_SHADERS).getTranslatedShaderSource(pWebGLVs) + "\ntranslated(from GLSL) PS shader: \n" + pWebGLContext.getExtension(akra.webgl.WEBGL_DEBUG_SHADERS).getTranslatedShaderSource(pWebGLFs));
                        }
                    }

                    return false;
                }

                pWebGLContext.validateProgram(pWebGLProgram);

                if (!this.isValid()) {
                    akra.logger.warn("GLSL program not valid(guid: %d)", this.guid);

                    akra.debug.log(pWebGLContext.getProgramInfoLog(pWebGLProgram));
                }

                this.obtainWebGLUniforms();
                this.obtainWebGLAttributes();

                this.notifyCreated();
                this.notifyRestored();

                return true;
            };

            WebGLShaderProgram.prototype.getTotalAttributes = function () {
                return this._iTotalAttributes;
            };

            WebGLShaderProgram.prototype._getActiveUniformNames = function () {
                return Object.keys(this._pWebGLUniformLocations);
            };

            WebGLShaderProgram.prototype._getActiveAttributeNames = function () {
                return Object.keys(this._pWebGLAttributeLocations);
            };

            WebGLShaderProgram.prototype._getActiveAttribLocations = function () {
                return this._pWebGLAttributeLocations;
            };

            WebGLShaderProgram.prototype.isLinked = function () {
                return akra.isDefAndNotNull(this._pWebGLProgram) && this._pWebGLContext.getProgramParameter(this._pWebGLProgram, 35714 /* LINK_STATUS */);
            };

            WebGLShaderProgram.prototype.isValid = function () {
                return akra.isDefAndNotNull(this._pWebGLProgram) && this._pWebGLContext.getProgramParameter(this._pWebGLProgram, 35715 /* VALIDATE_STATUS */);
            };

            WebGLShaderProgram.prototype.isActive = function () {
                return (akra.isDefAndNotNull(this._pWebGLProgram) && this._pWebGLContext.getParameter(35725 /* CURRENT_PROGRAM */) === this._pWebGLProgram);
            };

            WebGLShaderProgram.prototype.setFloat = function (sName, fValue) {
                this._pWebGLContext.uniform1f(this._pWebGLUniformLocations[sName], fValue);
            };

            WebGLShaderProgram.prototype.setInt = function (sName, iValue) {
                this._pWebGLContext.uniform1i(this._pWebGLUniformLocations[sName], iValue);
            };

            WebGLShaderProgram.prototype.setVec2 = function (sName, v2fValue) {
                this._pWebGLContext.uniform2f(this._pWebGLUniformLocations[sName], arguments[1].x, arguments[1].y);
            };

            WebGLShaderProgram.prototype.setVec2i = function (sName, v2iValue) {
                this._pWebGLContext.uniform2i(this._pWebGLUniformLocations[sName], arguments[1].x, arguments[1].y);
            };

            WebGLShaderProgram.prototype.setVec3 = function (sName, v3fValue) {
                this._pWebGLContext.uniform3f(this._pWebGLUniformLocations[sName], arguments[1].x, arguments[1].y, arguments[1].z);
            };

            WebGLShaderProgram.prototype.setVec3i = function (sName, v3iValue) {
                this._pWebGLContext.uniform3i(this._pWebGLUniformLocations[sName], arguments[1].x, arguments[1].y, arguments[1].z);
            };

            WebGLShaderProgram.prototype.setVec4 = function (sName, v4fValue) {
                this._pWebGLContext.uniform4f(this._pWebGLUniformLocations[sName], arguments[1].x, arguments[1].y, arguments[1].z, arguments[1].w);
            };

            WebGLShaderProgram.prototype.setVec4i = function (sName, v4iValue) {
                this._pWebGLContext.uniform4i(this._pWebGLUniformLocations[sName], arguments[1].x, arguments[1].y, arguments[1].z, arguments[1].w);
            };

            WebGLShaderProgram.prototype.setMat3 = function (sName, m3fValue) {
                this._pWebGLContext.uniformMatrix3fv(this._pWebGLUniformLocations[sName], false, m3fValue.data);
            };

            WebGLShaderProgram.prototype.setMat4 = function (sName, m4fValue) {
                this._pWebGLContext.uniformMatrix4fv(this._pWebGLUniformLocations[sName], false, m4fValue.data);
            };

            WebGLShaderProgram.prototype.setFloat32Array = function (sName, pValue) {
                this._pWebGLContext.uniform1fv(this._pWebGLUniformLocations[sName], pValue);
            };

            WebGLShaderProgram.prototype.setInt32Array = function (sName, pValue) {
                this._pWebGLContext.uniform1iv(this._pWebGLUniformLocations[sName], pValue);
            };

            WebGLShaderProgram.prototype.setVec2Array = function (sName, pValue) {
                var pBuffer = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 2);
                for (var i = 0, j = 0; j < pValue.length; i += 2, ++j) {
                    pBuffer[i] = pValue[j].x;
                    pBuffer[i + 1] = pValue[j].y;
                }

                this._pWebGLContext.uniform2fv(this._pWebGLUniformLocations[sName], pBuffer);
            };

            WebGLShaderProgram.prototype.setVec2iArray = function (sName, pValue) {
                var pBuffer = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 2);
                for (var i = 0, j = 0; j < pValue.length; i += 2, ++j) {
                    pBuffer[i] = pValue[j].x;
                    pBuffer[i + 1] = pValue[j].y;
                }

                this._pWebGLContext.uniform2iv(this._pWebGLUniformLocations[sName], pBuffer);
            };

            WebGLShaderProgram.prototype.setVec3Array = function (sName, pValue) {
                var pBuffer = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 3);
                for (var i = 0, j = 0; j < pValue.length; i += 3, ++j) {
                    pBuffer[i] = pValue[j].x;
                    pBuffer[i + 1] = pValue[j].y;
                    pBuffer[i + 2] = pValue[j].z;
                }

                this._pWebGLContext.uniform3fv(this._pWebGLUniformLocations[sName], pBuffer);
            };

            WebGLShaderProgram.prototype.setVec3iArray = function (sName, pValue) {
                var pBuffer = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 3);
                for (var i = 0, j = 0; j < pValue.length; i += 3, ++j) {
                    pBuffer[i] = pValue[j].x;
                    pBuffer[i + 1] = pValue[j].y;
                    pBuffer[i + 2] = pValue[j].z;
                }

                this._pWebGLContext.uniform3iv(this._pWebGLUniformLocations[sName], pBuffer);
            };

            WebGLShaderProgram.prototype.setVec4Array = function (sName, pValue) {
                var pBuffer = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 4);
                for (var i = 0, j = 0; j < pValue.length; i += 4, ++j) {
                    pBuffer[i] = pValue[j].x;
                    pBuffer[i + 1] = pValue[j].y;
                    pBuffer[i + 2] = pValue[j].z;
                    pBuffer[i + 3] = pValue[j].w;
                }

                this._pWebGLContext.uniform4fv(this._pWebGLUniformLocations[sName], pBuffer);
            };

            WebGLShaderProgram.prototype.setVec4iArray = function (sName, pValue) {
                var pBuffer = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 4);
                for (var i = 0, j = 0; j < pValue.length; i += 4, ++j) {
                    pBuffer[i] = pValue[j].x;
                    pBuffer[i + 1] = pValue[j].y;
                    pBuffer[i + 2] = pValue[j].z;
                    pBuffer[i + 3] = pValue[j].w;
                }

                this._pWebGLContext.uniform4iv(this._pWebGLUniformLocations[sName], pBuffer);
            };

            WebGLShaderProgram.prototype.setMat3Array = function (sName, pValue) {
                var pBuffer = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 9);
                for (var i = 0; i < pValue.length; i++) {
                    pBuffer.set(pValue[i].data, 9 * i);
                }
                this._pWebGLContext.uniformMatrix3fv(this._pWebGLUniformLocations[sName], false, pBuffer);
            };

            WebGLShaderProgram.prototype.setMat4Array = function (sName, pValue) {
                var pBuffer = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 16);
                for (var i = 0; i < pValue.length; i++) {
                    pBuffer.set(pValue[i].data, 16 * i);
                }
                this._pWebGLContext.uniformMatrix4fv(this._pWebGLUniformLocations[sName], false, pBuffer);
            };

            WebGLShaderProgram.prototype.setStruct = function (sName, pData) {
            };

            WebGLShaderProgram.prototype.setSampler = function (sName, pSampler) {
                var iSlot = this.applySamplerState(pSampler);
                this.setInt(sName, iSlot);
            };

            WebGLShaderProgram.prototype.setVertexBuffer = function (sName, pBuffer) {
                var iSlot = this._pWebGLRenderer.activateWebGLTextureInAutoSlot(3553 /* TEXTURE_2D */, pBuffer.getWebGLTexture());
                this.setInt(sName, iSlot);
            };

            WebGLShaderProgram.prototype.setSamplerArray = function (sName, pList) {
                var pBuffer = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pList.length);

                for (var i = 0; i < pList.length; ++i) {
                    pBuffer[i] = this.applySamplerState(pList[i]);
                }

                this.setInt32Array(sName, pBuffer);
            };

            WebGLShaderProgram.prototype.setTexture = function (sName, pData) {
            };

            WebGLShaderProgram.prototype.applySamplerState = function (pSampler) {
                var pTexture = pSampler.texture;

                if (akra.isNull(pTexture)) {
                    return;
                }

                var pTextureStateManager = this._pWebGLRenderer._getTextureStateManager();
                var pStates = pTextureStateManager.add(pTexture);
                var iSlot = this._pWebGLRenderer.activateWebGLTextureInAutoSlot(pTexture._getWebGLTextureTarget(), pTexture.getWebGLTexture());

                if (pSampler.min_filter) {
                    pTexture.setFilter(10241 /* MIN_FILTER */, pSampler.min_filter);
                } else {
                    pTexture.setFilter(10241 /* MIN_FILTER */, pStates[10241 /* MIN_FILTER */]);
                }

                if (pSampler.mag_filter) {
                    pTexture.setFilter(10240 /* MAG_FILTER */, pSampler.mag_filter);
                } else {
                    pTexture.setFilter(10240 /* MAG_FILTER */, pStates[10240 /* MAG_FILTER */]);
                }

                if (pSampler.wrap_s) {
                    pTexture.setWrapMode(10242 /* WRAP_S */, pSampler.wrap_s);
                } else {
                    pTexture.setWrapMode(10242 /* WRAP_S */, pStates[10242 /* WRAP_S */]);
                }

                if (pSampler.wrap_t) {
                    pTexture.setWrapMode(10243 /* WRAP_T */, pSampler.wrap_t);
                } else {
                    pTexture.setWrapMode(10243 /* WRAP_T */, pStates[10243 /* WRAP_T */]);
                }

                // logger.log("sampler states: ",
                // (<any>pSampler.min_filter).toString(16),
                // (<any>pSampler.mag_filter).toString(16),
                // (<any>pSampler.wrap_s).toString(16),
                // (<any>pSampler.wrap_t).toString(16)
                // );
                // logger.log("texture states: ",
                // (<any>pTexture.getFilter(ETextureParameters.MIN_FILTER)).toString(16),
                // (<any>pTexture.getFilter(ETextureParameters.MAG_FILTER)).toString(16),
                // (<any>pTexture.getWrapMode(ETextureParameters.WRAP_S)).toString(16),
                // (<any>pTexture.getWrapMode(ETextureParameters.WRAP_T)).toString(16)
                // );
                // pTexture._setFilterInternalTexture(ETextureParameters.MIN_FILTER, pSampler.min_filter || pTexture.getFilter(ETextureParameters.MIN_FILTER));
                // pTexture._setFilterInternalTexture(ETextureParameters.MAG_FILTER, pSampler.mag_filter || pTexture.getFilter(ETextureParameters.MAG_FILTER));
                // pTexture._setWrapModeInternalTexture(ETextureParameters.WRAP_S, pSampler.wrap_s || pTexture.getWrapMode(ETextureParameters.WRAP_S));
                // pTexture._setWrapModeInternalTexture(ETextureParameters.WRAP_T, pSampler.wrap_t || pTexture.getWrapMode(ETextureParameters.WRAP_T));
                // if(pSampler.min_filter){
                //     pTexture._setFilterInternalTexture(ETextureParameters.MIN_FILTER, pSampler.min_filter);
                // }
                // if(pSampler.mag_filter){
                //     pTexture._setFilterInternalTexture(ETextureParameters.MAG_FILTER, pSampler.mag_filter);
                // }
                // if(pSampler.wrap_s) {
                //     pTexture._setWrapModeInternalTexture(ETextureParameters.WRAP_S, pSampler.wrap_s);
                // }
                // if(pSampler.wrap_t) {
                //     pTexture._setWrapModeInternalTexture(ETextureParameters.WRAP_T, pSampler.wrap_t);
                // }
                return iSlot;
            };

            WebGLShaderProgram.prototype.applyVertexData = function (sName, pData) {
                var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                var pVertexBuffer = pData.getBuffer();
                var iStride = pData.getStride();

                if (pVertexBuffer.getType() !== 1 /* VBO */) {
                    return false;
                }

                var pVertexDecl = pData.getVertexDeclaration();
                var pVertexElement;
                var iLoc;

                for (var i = 0; i < pVertexDecl.getLength(); ++i) {
                    pVertexElement = pVertexDecl[i];
                    iLoc = this.getWebGLAttributeLocation(pVertexElement.usage);

                    if (iLoc < 0) {
                        akra.debug.warn("founded invalid GLSL attribute location(guid: %s): %s", this.guid, pVertexElement.usage);
                        continue;
                    }

                    pWebGLRenderer.bindWebGLBuffer(34962 /* ARRAY_BUFFER */, pVertexBuffer.getWebGLBuffer());
                    pWebGLContext.vertexAttribPointer(iLoc, pVertexElement.count, pVertexElement.type, false, iStride, pVertexElement.offset);
                }

                return true;
            };

            WebGLShaderProgram.prototype._setFloat = function (pWebGLUniformLocation, fValue) {
                this._pWebGLContext.uniform1f(pWebGLUniformLocation, fValue);
            };

            WebGLShaderProgram.prototype._setInt = function (pWebGLUniformLocation, iValue) {
                this._pWebGLContext.uniform1i(pWebGLUniformLocation, iValue);
            };

            WebGLShaderProgram.prototype._setVec2 = function (pWebGLUniformLocation, v2fValue) {
                this._pWebGLContext.uniform2f(pWebGLUniformLocation, v2fValue.x, v2fValue.y);
            };

            WebGLShaderProgram.prototype._setVec2i = function (pWebGLUniformLocation, v2iValue) {
                this._pWebGLContext.uniform2i(pWebGLUniformLocation, v2iValue.x, v2iValue.y);
            };

            WebGLShaderProgram.prototype._setVec3 = function (pWebGLUniformLocation, v3fValue) {
                this._pWebGLContext.uniform3f(pWebGLUniformLocation, v3fValue.x, v3fValue.y, v3fValue.z);
            };

            WebGLShaderProgram.prototype._setVec3i = function (pWebGLUniformLocation, v3iValue) {
                this._pWebGLContext.uniform3i(pWebGLUniformLocation, v3iValue.x, v3iValue.y, v3iValue.z);
            };

            WebGLShaderProgram.prototype._setVec4 = function (pWebGLUniformLocation, v4fValue) {
                this._pWebGLContext.uniform4f(pWebGLUniformLocation, v4fValue.x, v4fValue.y, v4fValue.z, v4fValue.w);
            };

            WebGLShaderProgram.prototype._setVec4i = function (pWebGLUniformLocation, v4iValue) {
                this._pWebGLContext.uniform4i(pWebGLUniformLocation, v4iValue.x, v4iValue.y, v4iValue.z, v4iValue.w);
            };

            WebGLShaderProgram.prototype._setMat3 = function (pWebGLUniformLocation, m3fValue) {
                this._pWebGLContext.uniformMatrix3fv(pWebGLUniformLocation, false, m3fValue.data);
            };

            WebGLShaderProgram.prototype._setMat4 = function (pWebGLUniformLocation, m4fValue) {
                this._pWebGLContext.uniformMatrix4fv(pWebGLUniformLocation, false, m4fValue.data);
            };

            WebGLShaderProgram.prototype._setFloat32Array = function (pWebGLUniformLocation, pValue) {
                this._pWebGLContext.uniform1fv(pWebGLUniformLocation, pValue);
            };

            WebGLShaderProgram.prototype._setInt32Array = function (pWebGLUniformLocation, pValue) {
                !akra.isNull(pValue) && this._pWebGLContext.uniform1iv(pWebGLUniformLocation, pValue);
            };

            WebGLShaderProgram.prototype._setVec2Array = function (pWebGLUniformLocation, pValue) {
                if (akra.isNull(pValue)) {
                    return;
                }

                var pBuffer = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 2);

                for (var i = 0, j = 0; j < pValue.length; i += 2, ++j) {
                    pBuffer[i] = pValue[j].x;
                    pBuffer[i + 1] = pValue[j].y;
                }

                this._pWebGLContext.uniform2fv(pWebGLUniformLocation, pBuffer);
            };

            WebGLShaderProgram.prototype._setVec2iArray = function (pWebGLUniformLocation, pValue) {
                var pBuffer = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 2);
                for (var i = 0, j = 0; j < pValue.length; i += 2, ++j) {
                    pBuffer[i] = pValue[j].x;
                    pBuffer[i + 1] = pValue[j].y;
                }

                this._pWebGLContext.uniform2iv(pWebGLUniformLocation, pBuffer);
            };

            WebGLShaderProgram.prototype._setVec3Array = function (pWebGLUniformLocation, pValue) {
                var pBuffer = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 3);
                for (var i = 0, j = 0; i < pValue.length; i += 3, ++j) {
                    pBuffer[i] = pValue[j].x;
                    pBuffer[i + 1] = pValue[j].y;
                    pBuffer[i + 2] = pValue[j].z;
                }

                this._pWebGLContext.uniform3fv(pWebGLUniformLocation, pBuffer);
            };

            WebGLShaderProgram.prototype._setVec3iArray = function (pWebGLUniformLocation, pValue) {
                var pBuffer = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 3);
                for (var i = 0, j = 0; i < pValue.length; i += 3, ++j) {
                    pBuffer[i] = pValue[j].x;
                    pBuffer[i + 1] = pValue[j].y;
                    pBuffer[i + 2] = pValue[j].z;
                }

                this._pWebGLContext.uniform3iv(pWebGLUniformLocation, pBuffer);
            };

            WebGLShaderProgram.prototype._setVec4Array = function (pWebGLUniformLocation, pValue) {
                var pBuffer = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 4);
                for (var i = 0, j = 0; i < pValue.length; i += 4, ++j) {
                    pBuffer[i] = pValue[j].x;
                    pBuffer[i + 1] = pValue[j].y;
                    pBuffer[i + 2] = pValue[j].z;
                    pBuffer[i + 3] = pValue[j].w;
                }

                this._pWebGLContext.uniform4fv(pWebGLUniformLocation, pBuffer);
            };

            WebGLShaderProgram.prototype._setVec4iArray = function (pWebGLUniformLocation, pValue) {
                var pBuffer = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 4);
                for (var i = 0, j = 0; i < pValue.length; i += 4, ++j) {
                    pBuffer[i] = pValue[j].x;
                    pBuffer[i + 1] = pValue[j].y;
                    pBuffer[i + 2] = pValue[j].z;
                    pBuffer[i + 3] = pValue[j].w;
                }

                this._pWebGLContext.uniform4iv(pWebGLUniformLocation, pBuffer);
            };

            WebGLShaderProgram.prototype._setMat3Array = function (pWebGLUniformLocation, pValue) {
                var pBuffer = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 9);
                for (var i = 0; i < pValue.length; i++) {
                    pBuffer.set(pValue[i].data, 9 * i);
                }
                this._pWebGLContext.uniformMatrix3fv(pWebGLUniformLocation, false, pBuffer);
            };

            WebGLShaderProgram.prototype._setMat4Array = function (pWebGLUniformLocation, pValue) {
                var pBuffer = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 16);
                for (var i = 0; i < pValue.length; i++) {
                    pBuffer.set(pValue[i].data, 16 * i);
                }
                this._pWebGLContext.uniformMatrix4fv(pWebGLUniformLocation, false, pBuffer);
            };

            WebGLShaderProgram.prototype._setSampler = function (pWebGLUniformLocation, pSampler) {
                var iSlot = this.applySamplerState(pSampler);
                this._setInt(pWebGLUniformLocation, iSlot);
            };

            WebGLShaderProgram.prototype._setVertexBuffer = function (pWebGLUniformLocation, pBuffer) {
                var iSlot = this._pWebGLRenderer.activateWebGLTextureInAutoSlot(3553 /* TEXTURE_2D */, pBuffer.getWebGLTexture());
                this._setInt(pWebGLUniformLocation, iSlot);
            };

            WebGLShaderProgram.prototype._setSamplerArray = function (pWebGLUniformLocation, pList) {
                var pBuffer = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pList.length);

                for (var i = 0; i < pList.length; ++i) {
                    pBuffer[i] = this.applySamplerState(pList[i]);
                }

                this._setInt32Array(pWebGLUniformLocation, pBuffer);
            };

            WebGLShaderProgram.prototype.applyBufferMap = function (pMap) {
                akra.logger.critical("WebGLShaderProgram::applyBufferMap() is uncompleted method!");
            };

            WebGLShaderProgram.prototype.getWebGLAttributeLocation = function (sName) {
                return akra.isDef(this._pWebGLAttributeLocations[sName]) ? this._pWebGLAttributeLocations[sName] : -1;
            };

            WebGLShaderProgram.prototype.getWebGLUniformLocations = function () {
                return this._pWebGLUniformLocations;
            };

            WebGLShaderProgram.prototype.getWebGLUniformLocation = function (sName) {
                if (akra.config.DEBUG) {
                    var iLoc = this._pWebGLUniformLocations[sName];

                    if (!akra.isDef(iLoc)) {
                        akra.logger.warn("could not find location for GLSL attribute(guid: %s): %s", this.guid, sName);
                    }

                    return iLoc;
                } else {
                    return this._pWebGLUniformLocations[sName] || null;
                }
            };

            WebGLShaderProgram.prototype.getWebGLProgram = function () {
                return this._pWebGLProgram;
            };

            WebGLShaderProgram.prototype.getTranslatedShaderCode = function (eWebGLType) {
                if (akra.config.DEBUG) {
                    var sReturn = "";
                    var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                    var pWebGLContext = pWebGLRenderer.getWebGLContext();

                    if (!akra.webgl.loadExtension(pWebGLContext, akra.webgl.WEBGL_DEBUG_SHADERS)) {
                        return null;
                    }

                    var pWebGLShaderList = pWebGLContext.getAttachedShaders(this._pWebGLProgram);

                    for (var i = 0; i < pWebGLShaderList.length; i++) {
                        var eShaderType = pWebGLContext.getShaderParameter(pWebGLShaderList[i], 35663 /* SHADER_TYPE */);

                        if (eShaderType === eWebGLType) {
                            sReturn = pWebGLContext.getExtension(akra.webgl.WEBGL_DEBUG_SHADERS).getTranslatedShaderSource(pWebGLShaderList[i]);
                            break;
                        }
                    }

                    return sReturn;
                } else {
                    return "";
                }
            };

            WebGLShaderProgram.prototype.printTranslatedShaderCode = function (eWebGLType) {
                if (typeof eWebGLType === "undefined") { eWebGLType = -1; }
                if (akra.config.DEBUG) {
                    if (eWebGLType === -1) {
                        akra.logger.log("translated(from GLSL) VS shader: \n" + this.getTranslatedShaderCode(35633 /* VERTEX_SHADER */));
                        akra.logger.log("translated(from GLSL) PS shader: \n" + this.getTranslatedShaderCode(35632 /* FRAGMENT_SHADER */));
                    } else {
                        akra.logger.log("translated(from GLSL) " + (eWebGLType === 35633 /* VERTEX_SHADER */ ? "VS" : "PS") + " shader: \n" + this.getTranslatedShaderCode(eWebGLType));
                    }
                }
            };

            WebGLShaderProgram.prototype.createWebGLShader = function (eType, csCode) {
                var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();
                var pWebGLShader = pWebGLContext.createShader(eType);

                pWebGLContext.shaderSource(pWebGLShader, csCode);
                pWebGLContext.compileShader(pWebGLShader);

                if (!pWebGLContext.getShaderParameter(pWebGLShader, 35713 /* COMPILE_STATUS */)) {
                    akra.logger.error("cannot compile GLSL shader(guid: %d)", this.guid);
                    if (akra.config.DEBUG) {
                        var sInfo = pWebGLContext.getShaderInfoLog(pWebGLShader);
                        var sCode = pWebGLContext.getShaderSource(pWebGLShader) || csCode;

                        akra.logger.log("shader errors: \n %s \n----------\n %s", sInfo, sCode);

                        if (akra.webgl.loadExtension(pWebGLContext, akra.webgl.WEBGL_DEBUG_SHADERS)) {
                            akra.logger.log("translated(from GLSL) " + (eType == 35633 /* VERTEX_SHADER */ ? "VS" : "PS") + " shader: \n" + pWebGLContext.getExtension(akra.webgl.WEBGL_DEBUG_SHADERS).getTranslatedShaderSource(pWebGLShader));
                        }
                    }

                    return null;
                }

                return pWebGLShader;
            };

            WebGLShaderProgram.prototype.obtainWebGLUniforms = function () {
                var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                var nUniforms = pWebGLContext.getProgramParameter(this._pWebGLProgram, 35718 /* ACTIVE_UNIFORMS */);
                var pUniformLocations = {};
                var iLoc;
                var pUniformInfo;

                for (var i = 0; i < nUniforms; ++i) {
                    pUniformInfo = pWebGLContext.getActiveUniform(this._pWebGLProgram, i);
                    iLoc = pWebGLContext.getUniformLocation(this._pWebGLProgram, pUniformInfo.name);
                    pUniformLocations[pUniformInfo.name] = iLoc;
                }

                this._pWebGLUniformLocations = pUniformLocations;
            };

            WebGLShaderProgram.prototype.obtainWebGLAttributes = function () {
                var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                var nAttributes = pWebGLContext.getProgramParameter(this._pWebGLProgram, 35721 /* ACTIVE_ATTRIBUTES */);
                var pAttributeLocations = {};
                var pAttributesInfo = [];
                var iLoc;
                var pAttributeInfo;

                for (var i = 0; i < nAttributes; ++i) {
                    pAttributeInfo = pWebGLContext.getActiveAttrib(this._pWebGLProgram, i);
                    iLoc = pWebGLContext.getAttribLocation(this._pWebGLProgram, pAttributeInfo.name);
                    if (akra.config.DEBUG) {
                        if (iLoc < 0 || !akra.isDef(iLoc)) {
                            akra.logger.warn("could not get GLSL attribute location(guid: %s): %s", this.guid, pAttributeInfo.name);
                        }
                    }

                    pAttributeLocations[pAttributeInfo.name] = iLoc;
                    pAttributesInfo[iLoc] = pAttributeInfo;
                }

                this._pWebGLAttributeLocations = pAttributeLocations;
                this._pWebGLAttributesInfo = pAttributesInfo;
                this._iTotalAttributes = nAttributes;
            };
            WebGLShaderProgram.uniformBuffer = new ArrayBuffer(4096 * 16);
            return WebGLShaderProgram;
        })(akra.pool.ResourcePoolItem);
        webgl.WebGLShaderProgram = WebGLShaderProgram;
    })(akra.webgl || (akra.webgl = {}));
    var webgl = akra.webgl;
})(akra || (akra = {}));
//# sourceMappingURL=WebGLShaderProgram.js.map
