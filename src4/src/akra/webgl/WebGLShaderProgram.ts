/// <reference path="../idl/IShaderProgram.ts" />
/// <reference path="../idl/IBufferMap.ts" />
/// <reference path="../idl/IAFXSamplerState.ts" />
/// <reference path="../pool/ResourcePoolItem.ts" />

/// <reference path="../math/math.ts" />

module akra.webgl {

	export interface WebGLUniformLocationMap {
		[index: string]: WebGLUniformLocation;
	}

	export class WebGLShaderProgram extends pool.ResourcePoolItem implements IShaderProgram {
		protected _pWebGLRenderer: WebGLRenderer;
		protected _pWebGLContext: WebGLRenderingContext;
		protected _pWebGLProgram: WebGLProgram;
		protected _pWebGLUniformLocations: WebGLUniformLocationMap;
		protected _pWebGLAttributeLocations: IMap<int>;

		protected _pWebGLAttributesInfo: WebGLActiveInfo[];

		protected _iTotalAttributes: uint = 0;

		create(csVertex?: string, csPixel?: string): boolean {
			if (arguments.length > 0) {
				return this.compile(csVertex, csPixel);
			}

			return false;
		}

		destroy(): void {
			this._pWebGLRenderer.deleteWebGLProgram(this._pWebGLProgram);

			this._pWebGLUniformLocations = null;
			this._pWebGLAttributeLocations = null;
			this._pWebGLAttributesInfo = null;

			this.notifyDestroyed();
			this.notifyDisabled();
		}

		compile(csVertex: string = GLSL_VS_SHADER_MIN, csPixel: string = GLSL_FS_SHADER_MIN): boolean {
			var pWebGLRenderer: WebGLRenderer = this._pWebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = this._pWebGLContext =pWebGLRenderer.getWebGLContext();
			var pWebGLProgram: WebGLProgram = this._pWebGLProgram = pWebGLRenderer.createWebGLProgram();

			var pWebGLVs: WebGLShader = this.createWebGLShader(gl.VERTEX_SHADER, csVertex);
			var pWebGLFs: WebGLShader = this.createWebGLShader(gl.FRAGMENT_SHADER, csPixel);

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
				logger.error("cannot link GLSL program(guid: %d)", this.guid);

				if (config.DEBUG) {
					var sInfo: string = pWebGLContext.getProgramInfoLog(pWebGLProgram);

					logger.log("shader program errors: \n" + sInfo);
					//+ "\n\nvertex code:\n"  + csVertex + "\n\n pixel code: " + csPixel);

					if (loadExtension(pWebGLContext, WEBGL_DEBUG_SHADERS)) {
						logger.log("translated(from GLSL) VS shader: \n" +
							pWebGLContext.getExtension(WEBGL_DEBUG_SHADERS).getTranslatedShaderSource(pWebGLVs) +
							"\ntranslated(from GLSL) PS shader: \n" +
							pWebGLContext.getExtension(WEBGL_DEBUG_SHADERS).getTranslatedShaderSource(pWebGLFs));
					}
				}			

				return false;
			}

			pWebGLContext.validateProgram(pWebGLProgram);

			if (!this.isValid()) {
				logger.warn("GLSL program not valid(guid: %d)", this.guid);

				debug.log(pWebGLContext.getProgramInfoLog(pWebGLProgram));
			}

			this.obtainWebGLUniforms();
			this.obtainWebGLAttributes();

			this.notifyCreated();
			this.notifyRestored();

			return true;
		}

		 get totalAttributes(): uint {
			return this._iTotalAttributes;
		}

		 _getActiveUniformNames(): string[] {
			return Object.keys(this._pWebGLUniformLocations);
		}

		 _getActiveAttributeNames(): string[] {
			return Object.keys(this._pWebGLAttributeLocations);
		}

		 _getActiveAttribLocations(): IMap<int> {
			return this._pWebGLAttributeLocations;
		}

		isLinked(): boolean {
			return isDefAndNotNull(this._pWebGLProgram) && 
				<boolean>this._pWebGLContext.getProgramParameter(this._pWebGLProgram, gl.LINK_STATUS);
		}
		
		isValid(): boolean {
			return isDefAndNotNull(this._pWebGLProgram) && 
				<boolean>this._pWebGLContext.getProgramParameter(this._pWebGLProgram, gl.VALIDATE_STATUS);
		}

		isActive(): boolean {
			return (isDefAndNotNull(this._pWebGLProgram) && 
				<WebGLProgram>this._pWebGLContext.getParameter(gl.CURRENT_PROGRAM) === this._pWebGLProgram);
		}

		 setFloat(sName: string, fValue: float): void {
			this._pWebGLContext.uniform1f(this._pWebGLUniformLocations[sName], fValue);
		}

		 setInt(sName: string, iValue: int): void {
			this._pWebGLContext.uniform1i(this._pWebGLUniformLocations[sName], iValue);
		}

		setVec2(sName: string, v2fValue: IVec2): void {
			this._pWebGLContext.uniform2f(this._pWebGLUniformLocations[sName], arguments[1].x, arguments[1].y);
		}

		
		setVec2i(sName: string, v2iValue: IVec2): void {
			this._pWebGLContext.uniform2i(this._pWebGLUniformLocations[sName], arguments[1].x, arguments[1].y);
		}

		setVec3(sName: string, v3fValue: IVec3): void {
			this._pWebGLContext.uniform3f(this._pWebGLUniformLocations[sName], arguments[1].x, arguments[1].y, arguments[1].z);
		}
		
		setVec3i(sName: string, v3iValue: IVec3): void {
			this._pWebGLContext.uniform3i(this._pWebGLUniformLocations[sName], arguments[1].x, arguments[1].y, arguments[1].z);
		}

		setVec4(sName: string, v4fValue: IVec4): void {
			this._pWebGLContext.uniform4f(this._pWebGLUniformLocations[sName], arguments[1].x, arguments[1].y, arguments[1].z, arguments[1].w);
		}

		setVec4i(sName: string, v4iValue: IVec4): void {
			this._pWebGLContext.uniform4i(this._pWebGLUniformLocations[sName], arguments[1].x, arguments[1].y, arguments[1].z, arguments[1].w);
		}
 
		setMat3(sName: string, m3fValue: IMat3): void {
			this._pWebGLContext.uniformMatrix3fv(this._pWebGLUniformLocations[sName], false, m3fValue.data);
		}

		setMat4(sName: string, m4fValue: IMat4): void {
			this._pWebGLContext.uniformMatrix4fv(this._pWebGLUniformLocations[sName], false, m4fValue.data);
		}

		setFloat32Array(sName: string, pValue: Float32Array): void {
			this._pWebGLContext.uniform1fv(this._pWebGLUniformLocations[sName], pValue);
		}

		setInt32Array(sName: string, pValue: Int32Array): void {
			this._pWebGLContext.uniform1iv(this._pWebGLUniformLocations[sName], pValue);
		}

		static uniformBuffer: ArrayBuffer = new ArrayBuffer(4096 * 16);

		setVec2Array(sName: string, pValue: IVec2[]): void {
			var pBuffer: Float32Array = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 2);
			for (var i: int = 0, j: int = 0; j < pValue.length; i += 2, ++ j) {
				pBuffer[i    ] = pValue[j].x;
				pBuffer[i + 1] = pValue[j].y;
			}
			
			this._pWebGLContext.uniform2fv(this._pWebGLUniformLocations[sName], pBuffer);
		}

		setVec2iArray(sName: string, pValue: IVec2[]): void {
			var pBuffer: Int32Array = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 2);
			for (var i: int = 0, j: int = 0; j < pValue.length; i += 2, ++ j) {
				pBuffer[i    ] = pValue[j].x;
				pBuffer[i + 1] = pValue[j].y;
			}

			this._pWebGLContext.uniform2iv(this._pWebGLUniformLocations[sName], pBuffer);
		}

		setVec3Array(sName: string, pValue: IVec3[]): void {
			var pBuffer: Float32Array = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 3);
			for (var i: int = 0, j: int = 0; j < pValue.length; i += 3, ++ j) {
				pBuffer[i    ] = pValue[j].x;
				pBuffer[i + 1] = pValue[j].y;
				pBuffer[i + 2] = pValue[j].z;
			}

			this._pWebGLContext.uniform3fv(this._pWebGLUniformLocations[sName], pBuffer);
		}

		setVec3iArray(sName: string, pValue: IVec3[]): void {
			var pBuffer: Int32Array = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 3);
			for (var i: int = 0, j: int = 0; j < pValue.length; i += 3, ++ j) {
				pBuffer[i    ] = pValue[j].x;
				pBuffer[i + 1] = pValue[j].y;
				pBuffer[i + 2] = pValue[j].z;
			}

			this._pWebGLContext.uniform3iv(this._pWebGLUniformLocations[sName], pBuffer);
		}

		setVec4Array(sName: string, pValue: IVec4[]): void {
			var pBuffer: Float32Array = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 4);
			for (var i: int = 0, j: int = 0; j < pValue.length; i += 4, ++ j) {
				pBuffer[i    ] = pValue[j].x;
				pBuffer[i + 1] = pValue[j].y;
				pBuffer[i + 2] = pValue[j].z;
				pBuffer[i + 3] = pValue[j].w;
			}

			this._pWebGLContext.uniform4fv(this._pWebGLUniformLocations[sName], pBuffer);
		}

		setVec4iArray(sName: string, pValue: IVec4[]): void {
			var pBuffer: Int32Array = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 4);
			for (var i: int = 0, j: int = 0; j < pValue.length; i += 4, ++ j) {
				pBuffer[i    ] = pValue[j].x;
				pBuffer[i + 1] = pValue[j].y;
				pBuffer[i + 2] = pValue[j].z;
				pBuffer[i + 3] = pValue[j].w;
			}

			this._pWebGLContext.uniform4iv(this._pWebGLUniformLocations[sName], pBuffer);
		}


		 setMat3Array(sName: string, pValue: IMat3[]): void {
			var pBuffer: Int32Array = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 9);
			for (var i: int = 0; i < pValue.length; i ++) {
				pBuffer.set(pValue[i].data, 9*i);
			}
			this._pWebGLContext.uniformMatrix3fv(this._pWebGLUniformLocations[sName], false, pBuffer);
		}

		 setMat4Array(sName: string, pValue: IMat4[]): void {
			var pBuffer: Int32Array = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 16);
			for (var i: int = 0; i < pValue.length; i ++) {
				pBuffer.set(pValue[i].data, 16*i);
			}
			this._pWebGLContext.uniformMatrix4fv(this._pWebGLUniformLocations[sName], false, pBuffer);
		}

		 setStruct(sName: string, pData: Object): void {
			
		}

		 setSampler(sName: string, pSampler: IAFXSamplerState): void {
		   var iSlot: int = this.applySamplerState(pSampler);
		   this.setInt(sName, iSlot);
		}

		 setVertexBuffer(sName: string, pBuffer: IVertexBuffer): void {
			var iSlot: uint = this._pWebGLRenderer.activateWebGLTextureInAutoSlot(gl.TEXTURE_2D, (<WebGLVertexTexture>pBuffer).getWebGLTexture());
			this.setInt(sName, iSlot);
		}

		 setSamplerArray(sName: string, pList: IAFXSamplerState[]): void {
			var pBuffer: Int32Array = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pList.length);
			
			for (var i: int = 0; i < pList.length; ++ i) {
				pBuffer[i] = this.applySamplerState(pList[i]);                
			}
			
			this.setInt32Array(sName, pBuffer);
		}


		 setTexture(sName: string, pData: ITexture): void {
			
		}

		private applySamplerState(pSampler: IAFXSamplerState): int {
			var pTexture: WebGLInternalTexture = <WebGLInternalTexture>pSampler.texture;
			
			if(isNull(pTexture)){
				return ;
			}

			var pTextureStateManager: WebGLInternalTextureStateManager = this._pWebGLRenderer._getTextureStateManager();
			var pStates: IMap<int> = pTextureStateManager.add(pTexture);
			var iSlot: int = this._pWebGLRenderer.activateWebGLTextureInAutoSlot(pTexture._getWebGLTextureTarget(), pTexture.getWebGLTexture());

			if(pSampler.min_filter){
				pTexture.setFilter(ETextureParameters.MIN_FILTER, pSampler.min_filter);
			}
			else {
				pTexture.setFilter(ETextureParameters.MIN_FILTER, pStates[ETextureParameters.MIN_FILTER]);
			}

			if(pSampler.mag_filter){
				pTexture.setFilter(ETextureParameters.MAG_FILTER, pSampler.mag_filter);
			}
			else {
				pTexture.setFilter(ETextureParameters.MAG_FILTER, pStates[ETextureParameters.MAG_FILTER]);
			}

			if(pSampler.wrap_s){
				pTexture.setWrapMode(ETextureParameters.WRAP_S, pSampler.wrap_s);
			}
			else {
				pTexture.setWrapMode(ETextureParameters.WRAP_S, pStates[ETextureParameters.WRAP_S]);
			}

			if(pSampler.wrap_t){
				pTexture.setWrapMode(ETextureParameters.WRAP_T, pSampler.wrap_t);
			}
			else {
				pTexture.setWrapMode(ETextureParameters.WRAP_T, pStates[ETextureParameters.WRAP_T]);
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
		}

		applyVertexData(sName: string, pData: IVertexData): boolean {
			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

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
					debug.warn("founded invalid GLSL attribute location(guid: %s): %s", 
						this.guid, 
						pVertexElement.usage);
					continue;
				}

				pWebGLRenderer.bindWebGLBuffer(gl.ARRAY_BUFFER, (<WebGLVertexBuffer>pVertexBuffer).getWebGLBuffer());
				pWebGLContext.vertexAttribPointer(iLoc, 
												  pVertexElement.count,
												  pVertexElement.type,
												  false,
												  iStride,
												  pVertexElement.offset);
			}

			return true;
		}


		 _setFloat(pWebGLUniformLocation: WebGLUniformLocation, fValue: float): void {
			this._pWebGLContext.uniform1f(pWebGLUniformLocation, fValue);
		}

		 _setInt(pWebGLUniformLocation: WebGLUniformLocation, iValue: int): void {
			this._pWebGLContext.uniform1i(pWebGLUniformLocation, iValue);
		}
		
		_setVec2(pWebGLUniformLocation: WebGLUniformLocation, v2fValue: IVec2): void {
			this._pWebGLContext.uniform2f(pWebGLUniformLocation, v2fValue.x, v2fValue.y);
		}

		
		_setVec2i(pWebGLUniformLocation: WebGLUniformLocation, v2iValue: IVec2): void {
			this._pWebGLContext.uniform2i(pWebGLUniformLocation, v2iValue.x, v2iValue.y);
		}

		_setVec3(pWebGLUniformLocation: WebGLUniformLocation, v3fValue: IVec3): void {
			this._pWebGLContext.uniform3f(pWebGLUniformLocation, v3fValue.x, v3fValue.y, v3fValue.z);
		}
		
		_setVec3i(pWebGLUniformLocation: WebGLUniformLocation, v3iValue: IVec3): void {
			this._pWebGLContext.uniform3i(pWebGLUniformLocation, v3iValue.x, v3iValue.y, v3iValue.z);
		}

		_setVec4(pWebGLUniformLocation: WebGLUniformLocation, v4fValue: IVec4): void {
			this._pWebGLContext.uniform4f(pWebGLUniformLocation, v4fValue.x, v4fValue.y, v4fValue.z, v4fValue.w);
		}

		_setVec4i(pWebGLUniformLocation: WebGLUniformLocation, v4iValue: IVec4): void {
			this._pWebGLContext.uniform4i(pWebGLUniformLocation, v4iValue.x, v4iValue.y, v4iValue.z, v4iValue.w);
		}      

		_setMat3(pWebGLUniformLocation: WebGLUniformLocation, m3fValue: IMat3): void {
			this._pWebGLContext.uniformMatrix3fv(pWebGLUniformLocation, false, m3fValue.data);
		}

		_setMat4(pWebGLUniformLocation: WebGLUniformLocation, m4fValue: IMat4): void {
			this._pWebGLContext.uniformMatrix4fv(pWebGLUniformLocation, false, m4fValue.data);
		}

		_setFloat32Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: Float32Array): void {
			this._pWebGLContext.uniform1fv(pWebGLUniformLocation, pValue);
		}

		_setInt32Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: Int32Array): void {
			!isNull(pValue) && this._pWebGLContext.uniform1iv(pWebGLUniformLocation, pValue);
		}

		_setVec2Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: IVec2[]): void {
			if (isNull(pValue)) {
				return;
			}

			var pBuffer: Float32Array = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 2);

			for (var i: int = 0, j: int = 0; j < pValue.length; i += 2, ++ j) {
				pBuffer[i    ] = pValue[j].x;
				pBuffer[i + 1] = pValue[j].y;
			}

			this._pWebGLContext.uniform2fv(pWebGLUniformLocation, pBuffer);
		}

		_setVec2iArray(pWebGLUniformLocation: WebGLUniformLocation, pValue: IVec2[]): void {
			var pBuffer: Int32Array = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 2);
			for (var i: int = 0, j: int = 0; j < pValue.length; i += 2, ++ j) {
				pBuffer[i    ] = pValue[j].x;
				pBuffer[i + 1] = pValue[j].y;
			}

			this._pWebGLContext.uniform2iv(pWebGLUniformLocation, pBuffer);
		}

		_setVec3Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: IVec3[]): void {
			var pBuffer: Float32Array = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 3);
			for (var i: int = 0, j: int = 0; i < pValue.length; i += 3, ++ j) {
				pBuffer[i    ] = pValue[j].x;
				pBuffer[i + 1] = pValue[j].y;
				pBuffer[i + 2] = pValue[j].z;
			}

			this._pWebGLContext.uniform3fv(pWebGLUniformLocation, pBuffer);
		}

		_setVec3iArray(pWebGLUniformLocation: WebGLUniformLocation, pValue: IVec3[]): void {
			var pBuffer: Int32Array = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 3);
			for (var i: int = 0, j: int = 0; i < pValue.length; i += 3, ++ j) {
				pBuffer[i    ] = pValue[j].x;
				pBuffer[i + 1] = pValue[j].y;
				pBuffer[i + 2] = pValue[j].z;
			}

			this._pWebGLContext.uniform3iv(pWebGLUniformLocation, pBuffer);
		}

		_setVec4Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: IVec4[]): void {
			var pBuffer: Float32Array = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 4);
			for (var i: int = 0, j: int = 0; i < pValue.length; i += 4, ++ j) {
				pBuffer[i    ] = pValue[j].x;
				pBuffer[i + 1] = pValue[j].y;
				pBuffer[i + 2] = pValue[j].z;
				pBuffer[i + 3] = pValue[j].w;
			}

			this._pWebGLContext.uniform4fv(pWebGLUniformLocation, pBuffer);
		}

		_setVec4iArray(pWebGLUniformLocation: WebGLUniformLocation, pValue: IVec4[]): void {
			var pBuffer: Int32Array = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 4);
			for (var i: int = 0, j: int = 0; i < pValue.length; i += 4, ++ j) {
				pBuffer[i    ] = pValue[j].x;
				pBuffer[i + 1] = pValue[j].y;
				pBuffer[i + 2] = pValue[j].z;
				pBuffer[i + 3] = pValue[j].w;
			}

			this._pWebGLContext.uniform4iv(pWebGLUniformLocation, pBuffer);
		}

		_setMat3Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: IMat3[]): void {
			var pBuffer: Int32Array = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 9);
			for (var i: int = 0; i < pValue.length; i ++) {
				pBuffer.set(pValue[i].data, 9*i);
			}
			this._pWebGLContext.uniformMatrix3fv(pWebGLUniformLocation, false, pBuffer);
		}

		_setMat4Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: IMat4[]): void {
			var pBuffer: Int32Array = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 16);
			for (var i: int = 0; i < pValue.length; i ++) {
				pBuffer.set(pValue[i].data, 16*i);
			}
			this._pWebGLContext.uniformMatrix4fv(pWebGLUniformLocation, false, pBuffer);
		}

		_setSampler(pWebGLUniformLocation: WebGLUniformLocation, pSampler: IAFXSamplerState): void {
			var iSlot: int = this.applySamplerState(pSampler);
			this._setInt(pWebGLUniformLocation, iSlot);
		}

		_setVertexBuffer(pWebGLUniformLocation: WebGLUniformLocation, pBuffer: IVertexBuffer): void {
			var iSlot: uint = this._pWebGLRenderer.activateWebGLTextureInAutoSlot(gl.TEXTURE_2D, (<WebGLVertexTexture>pBuffer).getWebGLTexture());
			this._setInt(pWebGLUniformLocation, iSlot);
		}

		_setSamplerArray(pWebGLUniformLocation: WebGLUniformLocation, pList: IAFXSamplerState[]): void {
			var pBuffer: Int32Array = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pList.length);
			
			for (var i: int = 0; i < pList.length; ++ i) {
				pBuffer[i] = this.applySamplerState(pList[i]);                
			}
			
			this._setInt32Array(pWebGLUniformLocation, pBuffer);
		}


		applyBufferMap(pMap: IBufferMap): void {
			logger.critical("WebGLShaderProgram::applyBufferMap() is uncompleted method!");
		}


		getWebGLAttributeLocation(sName: string): int {
			return isDef(this._pWebGLAttributeLocations[sName]) ? this._pWebGLAttributeLocations[sName] : -1;
		}

		getWebGLUniformLocations(): WebGLUniformLocationMap {
			return this._pWebGLUniformLocations;
		}

		getWebGLUniformLocation(sName: string): WebGLUniformLocation {
			if (config.DEBUG) {
				var iLoc: WebGLUniformLocation = this._pWebGLUniformLocations[sName];

				if (!isDef(iLoc)) {
					logger.warn("could not find location for GLSL attribute(guid: %s): %s", this.guid, sName);
				}

				return iLoc;
			}
			else {
				return this._pWebGLUniformLocations[sName] || null;
			}
		}

		getWebGLProgram(): WebGLProgram {
			return this._pWebGLProgram;
		}

		getTranslatedShaderCode(eWebGLType: int): string {
			if (config.DEBUG) {
				var sReturn: string = "";
				var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
				var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

				if (!loadExtension(pWebGLContext, WEBGL_DEBUG_SHADERS)) {
					return null;
				}

				var pWebGLShaderList: WebGLShader[] = pWebGLContext.getAttachedShaders(this._pWebGLProgram);

				for (var i: uint = 0; i < pWebGLShaderList.length; i++) {
					var eShaderType: int = <int>pWebGLContext.getShaderParameter(pWebGLShaderList[i], gl.SHADER_TYPE);

					if (eShaderType === eWebGLType) {
						sReturn = pWebGLContext.getExtension(WEBGL_DEBUG_SHADERS).getTranslatedShaderSource(pWebGLShaderList[i]);
						break;
					}
				}

				return sReturn;
			}
			else {
				return "";
			}
		}

		printTranslatedShaderCode(eWebGLType: int = -1): void {
			if (config.DEBUG) {
				if (eWebGLType === -1) {
					logger.log("translated(from GLSL) VS shader: \n" + this.getTranslatedShaderCode(gl.VERTEX_SHADER));
					logger.log("translated(from GLSL) PS shader: \n" + this.getTranslatedShaderCode(gl.FRAGMENT_SHADER));
				}
				else {
					logger.log("translated(from GLSL) " + (eWebGLType === gl.VERTEX_SHADER ? "VS" : "PS") + " shader: \n" +
						this.getTranslatedShaderCode(eWebGLType));
				}
			}
		}

		protected createWebGLShader(eType: int, csCode: string): WebGLShader {
			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
			var pWebGLShader: WebGLShader = pWebGLContext.createShader(eType);

			pWebGLContext.shaderSource(pWebGLShader, csCode);
			pWebGLContext.compileShader(pWebGLShader);

			if (!pWebGLContext.getShaderParameter(pWebGLShader, gl.COMPILE_STATUS)) {
				logger.error("cannot compile GLSL shader(guid: %d)", this.guid);
				if (config.DEBUG) {
					var sInfo: string = pWebGLContext.getShaderInfoLog(pWebGLShader);
					var sCode: string = pWebGLContext.getShaderSource(pWebGLShader) || csCode;

					logger.log("shader errors: \n %s \n----------\n %s", sInfo, sCode);

					if (loadExtension(pWebGLContext, WEBGL_DEBUG_SHADERS)) {
						logger.log("translated(from GLSL) " + (eType == gl.VERTEX_SHADER ? "VS" : "PS") + " shader: \n" +
							pWebGLContext.getExtension(WEBGL_DEBUG_SHADERS).getTranslatedShaderSource(pWebGLShader));
					}
				}

				return null;
			}

			return pWebGLShader;
		}

		protected obtainWebGLUniforms(): void {
			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

			var nUniforms: uint = pWebGLContext.getProgramParameter(this._pWebGLProgram, gl.ACTIVE_UNIFORMS);
			var pUniformLocations: WebGLUniformLocationMap = {};
			var iLoc: WebGLUniformLocation;
			var pUniformInfo: WebGLActiveInfo;

			for (var i: int = 0; i < nUniforms; ++ i) {
				pUniformInfo = pWebGLContext.getActiveUniform(this._pWebGLProgram, i);
				iLoc = pWebGLContext.getUniformLocation(this._pWebGLProgram, pUniformInfo.name);
				pUniformLocations[pUniformInfo.name] = iLoc;
			}

			this._pWebGLUniformLocations = pUniformLocations;
		}

		protected obtainWebGLAttributes(): void {
			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

			var nAttributes: uint = pWebGLContext.getProgramParameter(this._pWebGLProgram, gl.ACTIVE_ATTRIBUTES);
			var pAttributeLocations: IMap<int> = <IMap<int>>{};
			var pAttributesInfo: WebGLActiveInfo[] = [];
			var iLoc: int;
			var pAttributeInfo: WebGLActiveInfo;

			for (var i: int = 0; i < nAttributes; ++ i) {
				pAttributeInfo = pWebGLContext.getActiveAttrib(this._pWebGLProgram, i);
				iLoc = pWebGLContext.getAttribLocation(this._pWebGLProgram, pAttributeInfo.name);
				if (config.DEBUG) {
					if (iLoc < 0 || !isDef(iLoc)) {
						logger.warn("could not get GLSL attribute location(guid: %s): %s", this.guid, pAttributeInfo.name);
					}
				}

				pAttributeLocations[pAttributeInfo.name] = iLoc;
				pAttributesInfo[iLoc] = pAttributeInfo;
			}

			this._pWebGLAttributeLocations = pAttributeLocations;
			this._pWebGLAttributesInfo = pAttributesInfo;
			this._iTotalAttributes = nAttributes;
		}
	}
}