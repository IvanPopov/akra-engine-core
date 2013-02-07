#ifndef WEBGLSHADERPROGRAM_TS
#define WEBGLSHADERPROGRAM_TS

#include "math/math.ts"
#include "ISampler2d.ts"
#include "core/pool/ResourcePoolItem.ts"
#include "IShaderProgram.ts"
#include "IBufferMap.ts"

#define CHECK_WEBGL_LOCATION(iLoc, sName)\
	var iLoc: WebGLUniformLocation = this._pWebGLUniformLocations[sName]; \
	if (!isDef(iLoc)) { \
		return false; \
	}

module akra.webgl {

    export interface WebGLUniformLocationMap {
        [index: string]: WebGLUniformLocation;
    }

	export class WebGLShaderProgram extends core.pool.ResourcePoolItem implements IShaderProgram {
		protected _pWebGLProgram: WebGLProgram;
		protected _pWebGLUniformLocations: WebGLUniformLocationMap;
		protected _pWebGLAttributeLocations: IntMap;

		protected _pWebGLAttributesInfo: WebGLActiveInfo[];

		create(csVertex?: string, csPixel?: string): bool {
			if (arguments.length > 0) {
				return this.compile(csVertex || GLSL_VS_SHADER_MIN, csPixel || GLSL_FS_SHADER_MIN);
			}

            return false;
		}

        destroy(): void {
            var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getManager().getEngine().getRenderer();

            pWebGLRenderer.deleteWebGLProgram(this._pWebGLProgram);

            this._pWebGLUniformLocations = null;
            this._pWebGLAttributeLocations = null;
            this._pWebGLAttributesInfo = null;

            this.notifyDestroyed();
            this.notifyDisabled();
        }

    	compile(csVertex: string = GLSL_VS_SHADER_MIN, csPixel: string = GLSL_FS_SHADER_MIN): bool {
    		var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
			var pWebGLProgram: WebGLProgram = this._pWebGLProgram = pWebGLRenderer.createWebGLProgram();

			var pWebGLVs: WebGLShader = this.createWebGLShader(GL_VERTEX_SHADER, csVertex);
			var pWebGLFs: WebGLShader = this.createWebGLShader(GL_FRAGMENT_SHADER, csPixel);

			/** because, if not all units correctly activated, can obtained wronf link status */
			pWebGLRenderer._disableAllTextureUnits();

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
    	inline setVec2(sName: string, x?, y?): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		if (arguments.length == 2) {
    			pWebGLContext.uniform2f(iLoc, arguments[1].x, arguments[1].y);
    		}
    		else {
    			pWebGLContext.uniform2f(iLoc, arguments[1], arguments[2]);
    		}

    		return true;
    	}

    	
    	setVec2i(sName: string, v2iValue: IVec2): bool;
    	setVec2i(sName: string, x: int, y: int): bool;
    	inline setVec2i(sName: string, x?, y?): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		if (arguments.length == 2) {
    			pWebGLContext.uniform2i(iLoc, arguments[1].x, arguments[1].y);
    		}
    		else {
    			pWebGLContext.uniform2i(iLoc, arguments[1], arguments[2]);
    		}

    		return true;
    	}

    	setVec3(sName: string, v3fValue: IVec3): bool;
    	setVec3(sName: string, x: float, y: float, z: float): bool;
    	inline setVec3(sName: string, x?, y?, z?): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		if (arguments.length == 2) {
    			pWebGLContext.uniform3f(iLoc, arguments[1].x, arguments[1].y, arguments[1].z);
    		}
    		else {
    			pWebGLContext.uniform3f(iLoc, arguments[1], arguments[2], arguments[3]);
    		}

    		return true;
    	}
    	
    	setVec3i(sName: string, v3iValue: IVec3): bool;
    	setVec3i(sName: string, x: int, y: int, z: int): bool;
    	inline setVec3i(sName: string, x?, y?, z?): bool {
			CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		if (arguments.length == 2) {
    			pWebGLContext.uniform3i(iLoc, arguments[1].x, arguments[1].y, arguments[1].z);
    		}
    		else {
    			pWebGLContext.uniform3i(iLoc, arguments[1], arguments[2], arguments[3]);
    		}

    		return true;
    	}

    	setVec4(sName: string, v4fValue: IVec4): bool;
    	setVec4(sName: string, x: float, y: float, z: float, w: float): bool;
    	inline setVec4(sName: string, x?, y?, z?, w?): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		if (arguments.length == 2) {
    			pWebGLContext.uniform4f(iLoc, arguments[1].x, arguments[1].y, arguments[1].z, arguments[1].w);
    		}
    		else {
    			pWebGLContext.uniform4f(iLoc, arguments[1], arguments[2], arguments[3], arguments[3]);
    		}

    		return true;
    	}

    	setVec4i(sName: string, v4iValue: IVec4): bool;
    	setVec4i(sName: string, x: int, y: int, z: int, w: int): bool;
    	inline setVec4i(sName: string, x?, y?, z?, w?): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		if (arguments.length == 2) {
    			pWebGLContext.uniform4i(iLoc, arguments[1].x, arguments[1].y, arguments[1].z, arguments[1].w);
    		}
    		else {
    			pWebGLContext.uniform4i(iLoc, arguments[1], arguments[2], arguments[3], arguments[3]);
    		}

    		return true;
    	}
#ifdef IMAT2_TS    	
    	inline setMat2(sName: string, m2fValue: IMat2): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		pWebGLContext.uniformMatrix2fv(iLoc, false, m2fValue.data);
    		
    		return true;
    	}
#endif        

    	inline setMat3(sName: string, m3fValue: IMat3): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		pWebGLContext.uniformMatrix3fv(iLoc, false, m3fValue.data);
    		
    		return true;
    	}

    	setMat4(sName: string, m4fValue: IMat4): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		pWebGLContext.uniformMatrix4fv(iLoc, false, m4fValue.data);
    		
    		return true;
    	}

    	inline setFloat32Array(sName: string, pValue: Float32Array): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		pWebGLContext.uniform1fv(iLoc, pValue);
    		
    		return true;
    	}

    	inline setInt32Array(sName: string, pValue: Int32Array): bool {
    		CHECK_WEBGL_LOCATION(iLoc, sName);
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		pWebGLContext.uniform1iv(iLoc, pValue);
    		
    		return true;
    	}

    	inline setVec2Array(sName: string, pValue: IVec2[]): bool {
    		return false;
    	}

    	inline setVec2iArray(sName: string, pValue: IVec2[]): bool {
    		return false;
    	}

    	inline setVec3Array(sName: string, pValue: IVec3[]): bool {
    		return false;
    	}

    	inline setVec3iArray(sName: string, pValue: IVec3[]): bool {
    		return false;
    	}

    	inline setVec4Array(sName: string, pValue: IVec4[]): bool {
    		return false;
    	}

    	inline setVec4iArray(sName: string, pValue: IVec4[]): bool {
    		return false;
    	}

#ifdef IMAT2_TS
    	inline setMat2Array(sName: string, pValue: IMat2[]): bool {
    		return false;
    	}
#endif

    	inline setMat3Array(sName: string, pValue: IMat3[]): bool {
    		return false;
    	}

    	inline setMat4Array(sName: string, pValue: IMat4[]): bool {
    		return false;
    	}

    	inline setStruct(sName: string, pData: Object): bool {
    		return false;
    	}

    	inline setSampler2D(sName: string, pData: ISampler2d): bool {
    		return false;
    	}

    	inline setSampler2DToStruct(sName: string, pData: ISampler2d): bool {
    		return false;
    	}

    	inline setTexture(sName: string, pData: ITexture): bool {
    		return false;
    	}

    	//applyVertexBuffer(sName: string, pBuffer: IVertexBuffer);
    	applyVertexData(sName: string, pData: IVertexData): bool {
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		var pVertexBuffer: IVertexBuffer = <IVertexBuffer>pData.buffer;
    		var iStride: uint = pData.stride;

    		if (pVertexBuffer.type !== EVertexBufferTypes.VBO) {
    			return false
    		}

    		var pVertexDecl: IVertexDeclaration = pData.getVertexDeclaration();
    		var pVertexElement: IVertexElement;
    		var iLoc: int;

    		for (var i: int = 0; i < pVertexDecl.length; ++ i) {
    			pVertexElement = pVertexDecl[i];
    			iLoc = this.getWebGLAttributeLocation(pVertexElement.usage);

    			if (iLoc < 0) {
    				debug_warning("founded invalid GLSL attribute location(guid: %s): %s", 
    					this.getGuid(), 
    					pVertexElement.usage);
    				continue;
    			}

    			pWebGLRenderer.bindWebGLBuffer(GL_ARRAY_BUFFER, (<WebGLVertexBuffer>pVertexBuffer).getWebGLBuffer());
    			pWebGLContext.vertexAttribPointer(iLoc, 
    											  pVertexElement.count,
    											  pVertexElement.type,
    											  false,
    											  iStride,
    											  pVertexElement.offset);
    		}

    		return true;
    	}


        inline applyBufferMap(pMap: IBufferMap): void {
            CRITICAL("WebGLShaderProgram::applyBufferMap() is uncompleted method!");
        }


    	inline getWebGLAttributeLocation(sName: string): int {
    		return this._pWebGLAttributeLocations[sName] || -1;
    	}

    	inline getWebGLUniformLocation(sName: string): WebGLUniformLocation {
#ifdef DEBUG
			var iLoc: WebGLUniformLocation = this._pWebGLUniformLocations[sName];

			if (!isDef(iLoc)) {
				WARNING("could not find location for GLSL attribute(guid: %s): %s", this.getGuid(), sName);	
			}

			return null;
#else
    		return this._pWebGLUniformLocations[sName] || null;
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

			return pWebGLShader;
    	}

    	protected obtainWebGLUniforms(): void {
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		var nUniforms: uint = pWebGLContext.getProgramParameter(this._pWebGLProgram, GL_ACTIVE_UNIFORMS);
    		var pUniformLocations: WebGLUniformLocationMap = {};
    		var iLoc: WebGLUniformLocation;
    		var pUniformInfo: WebGLActiveInfo;

    		for (var i: int = 0; i < nUniforms; ++ i) {
    			pUniformInfo = pWebGLContext. getActiveUniform(this._pWebGLProgram, i);
				iLoc = pWebGLContext.getUniformLocation(this._pWebGLProgram, pUniformInfo.name);
				pUniformLocations[pUniformInfo.name] = iLoc;
    		}

    		this._pWebGLUniformLocations = pUniformLocations;
    	}

    	protected obtainWebGLAttributes(): void {
    		GET_RPI_WEBGL_RENDERER_CONTEXT(pWebGLRenderer, pWebGLContext);

    		var nAttributes: uint = pWebGLContext.getProgramParameter(this._pWebGLProgram, GL_ACTIVE_ATTRIBUTES);
    		var pAttributeLocations: IntMap = <IntMap>{};
    		var pAttributesInfo: WebGLActiveInfo[] = [];
    		var iLoc: int;
    		var pAttributeInfo: WebGLActiveInfo;

    		for (var i: int = 0; i < nAttributes; ++ i) {
    			pAttributeInfo = pWebGLContext.getActiveAttrib(this._pWebGLProgram, i);
				iLoc = pWebGLContext.getAttribLocation(this._pWebGLProgram, pAttributeInfo.name);
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