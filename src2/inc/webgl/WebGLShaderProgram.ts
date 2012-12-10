#ifndef WEBGLSHADERPROGRAM_TS
#ifndef WEBGLSHADERPROGRAM_TS

#define CHECK_WEBGL_LOCATION(iLoc, sName)\
	var iLoc: int = this._pWebGLUniformLocations[sName]; \
	if (!isDef(iLoc)) { \
		return false; \
	}

module akra.webgl {
	export WebGLShaderProgram extends ResourcePoolItem implements IWebGLShaderProgram {
		protected _pWebGLProgram: WebGLProgram;
		protected _pWebGLUniformLocations: IntMap;
		protected _pWebGLAttributeLocations: IntMap;

		protected _pWebGLUniformsInfo: WebGLActiveInfo[];
		protected _pWebGLAttributesInfo: WebGLActiveInfo[];

		create(csVertex?: string, csPixel?: string): bool {
			this._csGLSLVertex = csVertex;
			this._csGLSLFragment = csPixel;

			if (arguments.length > 0) {
				this.compile(csVertex || GLSL_VS_SHADER_MIN, csPixel || GLSL_FS_SHADER_MIN);
			}
		}

    	compile(csVertex: string = GLSL_VS_SHADER_MIN, csPixel: string = GLSL_FS_SHADER_MIN): bool {
    		var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
			var pWebGLProgram: WebGLProgram = this._pWebGLProgram = pWebGLContext.createProgram();

			var pWebGLVs: WebGLShader = this.createWebGLShader(GL_VERTEX_SHADER, csVertex);
			var pWebGLFs: WebGLShader = this.createWebGLShader(GL_FRAGMENT_SHADER, csPixel);

			/** because, if not all units correctly activated, can obtained wronf link status */
			pWebGLRenderer.disableAllTextureUnits();

			pWebGLContext.attachShader(pWebGLProgram, pWebGLVs);
			pWebGLContext.attachShader(pWebGLProgram, pWebGLFs);
			
			pWebGLContext.linkProgram(pWebGLProgram);

			if (!this.isLinked()) {
				ERROR("cannot link GLSL program(guid: %d)", this.getGuid());

#ifdef DEBUG
				if (hasExtension(WEBGL_DEBUG_SHADERS)) {
					LOG("translated(from GLSL) VS shader: \n %s\ntranslated(from GLSL) PS shader: \n%s",
						pWebGLContext.getTranslatedShaderSource(pWebGLVs),
						pWebGLContext.getTranslatedShaderSource(pWebGLFs));
				}

				var sInfo: string = pWebGLContext.getProgramInfoLog(pWebGLProgram);

				LOG("shader program errors: \n %s\n\nvertex code:\n %s\n\n pixel code: %s", sInfo, csVertex, csPixel);
#endif				

				return false;
			}

			pWebGLContext.validateProgram(pWebGLProgram);

			if (!this.isValid()) {
				WARNING("GLSL program not valid(guid: %d)", this.getGuid());

				debug_print(pWebGLContext.getProgramInfoLog(pWebGLProgram));
			}

			this.obtainWebGLUniforms();
			this.obtainWebGLAttributes();

			this.notifyCreated();
			this.notifyRestored();

			return true;
    	}

    	isLinked(): bool {
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);
    		return isDefAndNotNull(this._pWebGLProgram) && 
    			<bool>pWebGLContext.getProgramParameter(this._pWebGLProgram, GL_LINK_STATUS);
    	}
    	
    	isValid(): bool {
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);
    		return isDefAndNotNull(this._pWebGLProgram) && 
    			<bool>pWebGLContext.getProgramParameter(this._pWebGLProgram, GL_VALIDATE_STATUS);
    	}

    	isActive(): bool {
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);
    		return (isDefAndNotNull(this._pWebGLProgram) && 
    			<WebGLProgram>pWebGLContext.getParameter(GL_CURRENT_PROGRAM) === this._pWebGLProgram);
    	}

    	setFloat(sName: string, fValue: float): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
			GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);
    		pWebGLContext.uniform1f(iLoc, fValue);
    		return true;
    	}

    	setInt(sName: string, iValue: int): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
			GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);
    		pWebGLContext.uniform1i(iLoc, iValue);

    		return true;
    	}
    	
    	setVec2(sName: string, v2fValue: IVec2): bool;
    	setVec2(sName: string, x: float, y: float): bool;
    	setVec2(sName: string, x?, y?): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		if (arguments.length == 2) {
    			pDevice.uniform2f(iLoc, arguments[1].x, arguments[1].y);
    		}
    		else {
    			pDevice.uniform2f(iLoc, arguments[1], arguments[2]);
    		}

    		return true;
    	}

    	
    	setVec2i(sName: string, v2iValue: IVec2): bool;
    	setVec2i(sName: string, x: int, y: int): bool;
    	setVec2i(sName: string, x?, y?): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		if (arguments.length == 2) {
    			pDevice.uniform2i(iLoc, arguments[1].x, arguments[1].y);
    		}
    		else {
    			pDevice.uniform2i(iLoc, arguments[1], arguments[2]);
    		}

    		return true;
    	}

    	setVec3(sName: string, v3fValue: IVec3): bool;
    	setVec3(sName: string, x: float, y: float, z: float): bool;
    	setVec3(sName: string, x?, y?, z?): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		if (arguments.length == 2) {
    			pDevice.uniform3f(iLoc, arguments[1].x, arguments[1].y, arguments[1].z);
    		}
    		else {
    			pDevice.uniform3f(iLoc, arguments[1], arguments[2], arguments[3]);
    		}

    		return true;
    	}
    	
    	setVec3i(sName: string, v3iValue: IVec3): bool;
    	setVec3i(sName: string, x: int, y: int, z: int): bool;
    	setVec3i(sName: string, x?, y?, z?): bool {
			CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		if (arguments.length == 2) {
    			pDevice.uniform3i(iLoc, arguments[1].x, arguments[1].y, arguments[1].z);
    		}
    		else {
    			pDevice.uniform3i(iLoc, arguments[1], arguments[2], arguments[3]);
    		}

    		return true;
    	}

    	setVec4(sName: string, v4fValue: IVec4): bool;
    	setVec4(sName: string, x: float, y: float, z: float, w: float): bool;
    	setVec4(sName: string, x?, y?, z?, w?): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		if (arguments.length == 2) {
    			pDevice.uniform4f(iLoc, arguments[1].x, arguments[1].y, arguments[1].z, arguments[1].w);
    		}
    		else {
    			pDevice.uniform4f(iLoc, arguments[1], arguments[2], arguments[3], arguments[3]);
    		}

    		return true;
    	}

    	setVec4i(sName: string, v4iValue: IVec4): bool;
    	setVec4i(sName: string, x: int, y: int, z: int, w: int): bool;
    	setVec4i(sName: string, x?, y?, z?, w?): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		if (arguments.length == 2) {
    			pDevice.uniform4i(iLoc, arguments[1].x, arguments[1].y, arguments[1].z, arguments[1].w);
    		}
    		else {
    			pDevice.uniform4i(iLoc, arguments[1], arguments[2], arguments[3], arguments[3]);
    		}

    		return true;
    	}
    	
    	setMat2(sName: string, m2fValue: IMat2): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		pDevice.uniformMatrix2fv(iLoc, false, m2fValue.data);
    		
    		return true;
    	}

    	setMat3(sName: string, m3fValue: IMat3): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		pDevice.uniformMatrix3fv(iLoc, false, m2fValue.data);
    		
    		return true;
    	}

    	setMat4(sName: string, m4fValue: IMat4): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		pDevice.uniformMatrix4fv(iLoc, false, m2fValue.data);
    		
    		return true;
    	}

    	setFloat32Array(sName: string, pValue: Float32Array): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		pDevice.uniformMatrix1fv(iLoc, false, pValue);
    		
    		return true;
    	}

    	setInt32Array(sName: string, pValue: Int32Array): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		pDevice.uniformMatrix1iv(iLoc, false, pValue);
    		
    		return true;
    	}

    	setVec2Array(sName: string, pValue: IVec2[]): bool {
    		return false;
    	}

    	setVec2iArray(sName: string, pValue: IVec2[]): bool {
    		return false;
    	}

    	setVec3Array(sName: string, pValue: IVec3[]): bool {
    		return false;
    	}

    	setVec3iArray(sName: string, pValue: IVec3[]): bool {
    		return false;
    	}

    	setVec4Array(sName: string, pValue: IVec4[]): bool {
    		return false;
    	}

    	setVec4iArray(sName: string, pValue: IVec4[]): bool {
    		return false;
    	}

    	setMat2Array(sName: string, pValue: IMat2[]): bool {
    		return false;
    	}

    	setMat3Array(sName: string, pValue: IMat3[]): bool {
    		return false;
    	}

    	setMat4Array(sName: string, pValue: IMat4[]): bool {
    		return false;
    	}

    	setStruct(sName: string, pData: Object): bool {
    		return false;
    	}

    	setSampler2D(sName: string, pData: ISampler2D): bool {
    		return false;
    	}

    	setSampler2DToStruct(sName: string, pData: ISampler2D): bool {
    		return false;
    	}

    	setTexture(sName: string, pData: ITexture): bool {
    		return false;
    	}

    	//applyVertexBuffer(sName: string, pBuffer: IVertexBuffer);
    	applyVertexData(sName: string, pData: IVertexData): bool {
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		var pVertexBuffer: IVertexBuffer = pData.buffer;
    		var iStride: uint = pVertexData.stride;

    		if (pVertexBuffer.type !== EVertexBufferTypes.VBO) {
    			return false
    		}

    		var pVertexDecl: IVertexDeclaration = pData.getVertexDeclaration();
    		var pVertexElement: IVertexElement;
    		var iLoc: int;

    		for (var i: int = 0; i < pDecl.length; ++ i) {
    			pVertexElement = pVertexDecl[i];
    			iLoc = this.getWebGLAttributeLocation(pVertexElement.usage);

    			if (!iLoc < 0) {
    				debug_warning("founded invalid GLSL attribute location(guid: %s): %s", 
    					this.getGuid(), 
    					pVertexElement.usage);
    				continue;
    			}

    			pWebGLRenderer.bindWebGLBuffer(<WebGLVertexBuffer>pVertexBuffer.getWebGLBuffer());
    			pWebGLContext.vertexAttribPointer(iLoc, 
    											  pVertexElement.count,
    											  pVertexElement.type,
    											  false,
    											  iStride,
    											  pVertexElement.offset);
    		}

    		return true;
    	}



    	inline getWebGLAttributeLocation(sName: string): int {
    		return this._pWebGLAttributeLocations[sName] || -1;
    	}

    	inline getWebGLUniformLocation(sName: string): int {
#ifdef DEBUG
			var iLoc: int = this._pWebGLUniformLocations[sName];

			if (!isDef(iLoc)) {
				WARNING("could not find location for GLSL attribute(guid: %s): %s", this.getGuid(), sName);	
			}

			return -1;
#else
    		return this._pWebGLUniformLocations[sName] || -1;
#endif
    	}

    	inline getWebGLProgram(): WebGLProgram {
    		return this._pWebGLProgram;
    	}

    	protected createWebGLShader(eType: int, csCode: string): WebGLShader {
    		var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
			var pWebGLShader: WebGLShader = pWebGLContext.createShader(eType);

			pWebGLContext.shaderSource(pWebGLShader, csCode);
			pWebGLContext.compileShader(pWebGLShader);

			if (!pWebGLContext.getShaderParameter(pWebGLShader, GL_COMPILE_STATUS)) {
				ERROR("cannot compile GLSL shader(guid: %d)", this.getGuid());
#ifdef DEBUG
				var sInfo: string = pWebGLContext.getShaderInfoLog(pWebGLShader);
				var sCode: string = pWebGLContext.getShaderSource(pWebGLShader) || csCode;

				LOG("shader errors: \n %s \n----------\n %s", sInfo, sCode);
#endif
				return null;
			}

			return pShader;
    	}

    	protected obtainWebGLUniforms(): void {
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		var nUniforms: uint = pWebGLContext.getProgramParameter(this._pWebGLProgram, GL_ACTIVE_UNIFORMS);
    		var pUniformLocations: IntMap = {};
    		var pUniformsInfo: WebGLActiveInfo[] = [];
    		var iLoc: int;
    		var pUniformInfo: WebGLActiveInfo;

    		for (var i: int = 0; i < nUniforms; ++ i) {
    			pUniformInfo = pWebGLContext.getActiveAttrib(this._pWebGLProgram, i);
				iLoc = pWebGLContext.getUniformLocation(this._pWebGLProgram, pUniformInfo.name);
				pUniformLocations[pUniformInfo.name] = iLoc;
				pUniformsInfo[iLoc] = pUniformInfo;
    		}

    		this._pWebGLUniformLocations = pUniformLocations;
    		this._pWebGLUniformsInfo = pUniformsInfo;
    	}

    	protected obtainWebGLAttributes(): void {
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		var nAttributes: uint = pWebGLContext.getProgramParameter(this._pWebGLProgram, GL_ACTIVE_ATTRIBUTES);
    		var pAttributeLocations: IntMap = {};
    		var pAttributesInfo: WebGLActiveInfo[] = [];
    		var iLoc: int;
    		var pAttributeInfo: WebGLActiveInfo;

    		for (var i: int = 0; i < nAttributes; ++ i) {
    			pAttributeInfo = pWebGLContext.getActiveAttrib(this._pWebGLProgram, i);
				iLoc = pWebGLContext.getAttributeLocation(this._pWebGLProgram, pAttributeInfo.name);
#ifdef DEBUG
				if (iLoc < 0 || !isDef(iLoc)) {
					WARNING("could not get GLSL attribute location(guid: %s): %s", this.getGuid(), pAttributeInfo.name);
				}
#endif

				pAttributeLocations[pAttributeInfo.name] = iLoc;
				pAttributesInfo[iLoc] = pAttributeInfo;
    		}

    		this._pWebGLAttributeLocations = pAttributeLocations;
    		this._pWebGLAttributesInfo = pAttributesInfo;
    	}
	}
}

#endif