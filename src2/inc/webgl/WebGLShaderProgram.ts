#ifndef WEBGLSHADERPROGRAM_TS
#define WEBGLSHADERPROGRAM_TS

#include "math/math.ts"
#include "IAFXSamplerState.ts"
#include "core/pool/ResourcePoolItem.ts"
#include "IShaderProgram.ts"
#include "IBufferMap.ts"

#define ZERO_SAMPLER_SLOT

module akra.webgl {

    export interface WebGLUniformLocationMap {
        [index: string]: WebGLUniformLocation;
    }

	export class WebGLShaderProgram extends core.pool.ResourcePoolItem implements IShaderProgram {
        protected _pWebGLRenderer: WebGLRenderer;
        protected _pWebGLContext: WebGLRenderingContext;
		protected _pWebGLProgram: WebGLProgram;
		protected _pWebGLUniformLocations: WebGLUniformLocationMap;
		protected _pWebGLAttributeLocations: IntMap;

		protected _pWebGLAttributesInfo: WebGLActiveInfo[];

        protected _iTotalAttributes: uint = 0;

		create(csVertex?: string, csPixel?: string): bool {
			if (arguments.length > 0) {
				return this.compile(csVertex || GLSL_VS_SHADER_MIN, csPixel || GLSL_FS_SHADER_MIN);
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

    	compile(csVertex: string = GLSL_VS_SHADER_MIN, csPixel: string = GLSL_FS_SHADER_MIN): bool {
    		var pWebGLRenderer: WebGLRenderer = this._pWebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = this._pWebGLContext =pWebGLRenderer.getWebGLContext();
			var pWebGLProgram: WebGLProgram = this._pWebGLProgram = pWebGLRenderer.createWebGLProgram();

			var pWebGLVs: WebGLShader = this.createWebGLShader(GL_VERTEX_SHADER, csVertex);
			var pWebGLFs: WebGLShader = this.createWebGLShader(GL_FRAGMENT_SHADER, csPixel);

			/** because, if not all units correctly activated, can obtained wronf link status */
			pWebGLRenderer._disableAllTextureUnits();

			pWebGLContext.attachShader(pWebGLProgram, pWebGLVs);
			pWebGLContext.attachShader(pWebGLProgram, pWebGLFs);
			
			pWebGLContext.linkProgram(pWebGLProgram);

            // LOG("================================", this.findResourceName());
            // LOG(pWebGLContext.getShaderSource(pWebGLVs));
            // LOG(pWebGLContext.getShaderSource(pWebGLFs));

			if (!this.isLinked()) {
				ERROR("cannot link GLSL program(guid: %d)", this.getGuid());

#ifdef DEBUG
                var sInfo: string = pWebGLContext.getProgramInfoLog(pWebGLProgram);

                LOG("shader program errors: \n" + sInfo );
                //+ "\n\nvertex code:\n"  + csVertex + "\n\n pixel code: " + csPixel);

				if (loadExtension(pWebGLContext, WEBGL_DEBUG_SHADERS)) {
					LOG("translated(from GLSL) VS shader: \n" + 
                        pWebGLContext.getExtension(WEBGL_DEBUG_SHADERS).getTranslatedShaderSource(pWebGLVs) +
                        "\ntranslated(from GLSL) PS shader: \n" +
						pWebGLContext.getExtension(WEBGL_DEBUG_SHADERS).getTranslatedShaderSource(pWebGLFs));
				}
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

        inline get totalAttributes(): uint {
            return this._iTotalAttributes;
        }

        inline _getActiveUniformNames(): string[] {
            return Object.keys(this._pWebGLUniformLocations);
        }

        inline _getActiveAttributeNames(): string[] {
            return Object.keys(this._pWebGLAttributeLocations);
        }

        inline _getActiveAttribLocations(): IntMap {
            return this._pWebGLAttributeLocations;
        }

    	isLinked(): bool {
    		return isDefAndNotNull(this._pWebGLProgram) && 
    			<bool>this._pWebGLContext.getProgramParameter(this._pWebGLProgram, GL_LINK_STATUS);
    	}
    	
    	isValid(): bool {
    		return isDefAndNotNull(this._pWebGLProgram) && 
    			<bool>this._pWebGLContext.getProgramParameter(this._pWebGLProgram, GL_VALIDATE_STATUS);
    	}

    	isActive(): bool {
    		return (isDefAndNotNull(this._pWebGLProgram) && 
    			<WebGLProgram>this._pWebGLContext.getParameter(GL_CURRENT_PROGRAM) === this._pWebGLProgram);
    	}

    	inline setFloat(sName: string, fValue: float): void {
    		this._pWebGLContext.uniform1f(this._pWebGLUniformLocations[sName], fValue);
    	}

    	inline setInt(sName: string, iValue: int): void {
    		this._pWebGLContext.uniform1i(this._pWebGLUniformLocations[sName], iValue);
    	}

        // inline setBool(sName: string, bValue: bool): void {
        //     this.setInt(sName, bValue )
        // }
        
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

    	
    	// setVec2(sName: string, v2fValue: IVec2): void;
    	// setVec2(sName: string, x: float, y: float): void;
    	// inline setVec2(sName: string, x?, y?): void {
    	// 	(arguments.length == 2)?
    	// 	  this._pWebGLContext.uniform2f(this._pWebGLUniformLocations[sName], arguments[1].x, arguments[1].y):
    	// 	  this._pWebGLContext.uniform2f(this._pWebGLUniformLocations[sName], arguments[1], arguments[2]);
    	// }

    	
    	// setVec2i(sName: string, v2iValue: IVec2): void;
    	// setVec2i(sName: string, x: int, y: int): void;
    	// inline setVec2i(sName: string, x?, y?): void {
    	// 	(arguments.length == 2)?
    	// 	  this._pWebGLContext.uniform2i(this._pWebGLUniformLocations[sName], arguments[1].x, arguments[1].y):
    	// 	  this._pWebGLContext.uniform2i(this._pWebGLUniformLocations[sName], arguments[1], arguments[2]);
    	// }

    	// setVec3(sName: string, v3fValue: IVec3): void;
    	// setVec3(sName: string, x: float, y: float, z: float): void;
    	// inline setVec3(sName: string, x?, y?, z?): void {
    	// 	(arguments.length == 2)?
    	// 	  this._pWebGLContext.uniform3f(this._pWebGLUniformLocations[sName], arguments[1].x, arguments[1].y, arguments[1].z):
    	// 	  this._pWebGLContext.uniform3f(this._pWebGLUniformLocations[sName], arguments[1], arguments[2], arguments[3]);
    	// }
    	
    	// setVec3i(sName: string, v3iValue: IVec3): void;
    	// setVec3i(sName: string, x: int, y: int, z: int): void;
    	// inline setVec3i(sName: string, x?, y?, z?): void {
    	// 	(arguments.length == 2)?
    	// 		this._pWebGLContext.uniform3i(this._pWebGLUniformLocations[sName], arguments[1].x, arguments[1].y, arguments[1].z):
    	// 		this._pWebGLContext.uniform3i(this._pWebGLUniformLocations[sName], arguments[1], arguments[2], arguments[3]);
    	// }

    	// setVec4(sName: string, v4fValue: IVec4): void;
    	// setVec4(sName: string, x: float, y: float, z: float, w: float): void;
    	// inline setVec4(sName: string, x?, y?, z?, w?): void {
    	// 	(arguments.length == 2) ?
    	// 	  this._pWebGLContext.uniform4f(this._pWebGLUniformLocations[sName], arguments[1].x, arguments[1].y, arguments[1].z, arguments[1].w):
    	// 	  this._pWebGLContext.uniform4f(this._pWebGLUniformLocations[sName], arguments[1], arguments[2], arguments[3], arguments[3]);
    	// }

    	// setVec4i(sName: string, v4iValue: IVec4): void;
    	// setVec4i(sName: string, x: int, y: int, z: int, w: int): void;
    	// inline setVec4i(sName: string, x?, y?, z?, w?): void {
    	// 	(arguments.length == 2)?
    	// 		this._pWebGLContext.uniform4i(this._pWebGLUniformLocations[sName], arguments[1].x, arguments[1].y, arguments[1].z, arguments[1].w):
    	// 		this._pWebGLContext.uniform4i(this._pWebGLUniformLocations[sName], arguments[1], arguments[2], arguments[3], arguments[3])
    	// }
 
#ifdef IMAT2_TS    	
    	inline setMat2(sName: string, m2fValue: IMat2): void {
    		this._pWebGLContext.uniformMatrix2fv(this._pWebGLUniformLocations[sName], false, m2fValue.data);
    	}
#endif        

    	inline setMat3(sName: string, m3fValue: IMat3): void {
    		this._pWebGLContext.uniformMatrix3fv(this._pWebGLUniformLocations[sName], false, m3fValue.data);
    	}

    	setMat4(sName: string, m4fValue: IMat4): void {
    		this._pWebGLContext.uniformMatrix4fv(this._pWebGLUniformLocations[sName], false, m4fValue.data);
    	}

    	inline setFloat32Array(sName: string, pValue: Float32Array): void {
    		this._pWebGLContext.uniform1fv(this._pWebGLUniformLocations[sName], pValue);
    	}

    	inline setInt32Array(sName: string, pValue: Int32Array): void {
    		this._pWebGLContext.uniform1iv(this._pWebGLUniformLocations[sName], pValue);
    	}

        static uniformBuffer: ArrayBuffer = new ArrayBuffer(4096 * 16);

    	inline setVec2Array(sName: string, pValue: IVec2[]): void {
    		var pBuffer: Float32Array = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 2);
            for (var i: int = 0, j: int = 0; j < pValue.length; i += 2, ++ j) {
                pBuffer[i    ] = pValue[j].x;
                pBuffer[i + 1] = pValue[j].y;
            }

            this._pWebGLContext.uniform2fv(this._pWebGLUniformLocations[sName], pBuffer);
    	}

    	inline setVec2iArray(sName: string, pValue: IVec2[]): void {
    		var pBuffer: Int32Array = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 2);
            for (var i: int = 0, j: int = 0; j < pValue.length; i += 2, ++ j) {
                pBuffer[i    ] = pValue[j].x;
                pBuffer[i + 1] = pValue[j].y;
            }

            this._pWebGLContext.uniform2iv(this._pWebGLUniformLocations[sName], pBuffer);
    	}

    	inline setVec3Array(sName: string, pValue: IVec3[]): void {
    		var pBuffer: Float32Array = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 3);
            for (var i: int = 0, j: int = 0; j < pValue.length; i += 3, ++ j) {
                pBuffer[i    ] = pValue[j].x;
                pBuffer[i + 1] = pValue[j].y;
                pBuffer[i + 2] = pValue[j].z;
            }

            this._pWebGLContext.uniform3fv(this._pWebGLUniformLocations[sName], pBuffer);
    	}

    	inline setVec3iArray(sName: string, pValue: IVec3[]): void {
    		var pBuffer: Int32Array = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 3);
            for (var i: int = 0, j: int = 0; j < pValue.length; i += 3, ++ j) {
                pBuffer[i    ] = pValue[j].x;
                pBuffer[i + 1] = pValue[j].y;
                pBuffer[i + 2] = pValue[j].z;
            }

            this._pWebGLContext.uniform3iv(this._pWebGLUniformLocations[sName], pBuffer);
    	}

    	inline setVec4Array(sName: string, pValue: IVec4[]): void {
    		var pBuffer: Float32Array = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 4);
            for (var i: int = 0, j: int = 0; j < pValue.length; i += 4, ++ j) {
                pBuffer[i    ] = pValue[j].x;
                pBuffer[i + 1] = pValue[j].y;
                pBuffer[i + 2] = pValue[j].z;
                pBuffer[i + 3] = pValue[j].w;
            }

            this._pWebGLContext.uniform4fv(this._pWebGLUniformLocations[sName], pBuffer);
    	}

    	inline setVec4iArray(sName: string, pValue: IVec4[]): void {
    		var pBuffer: Int32Array = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 4);
            for (var i: int = 0, j: int = 0; j < pValue.length; i += 4, ++ j) {
                pBuffer[i    ] = pValue[j].x;
                pBuffer[i + 1] = pValue[j].y;
                pBuffer[i + 2] = pValue[j].z;
                pBuffer[i + 3] = pValue[j].w;
            }

            this._pWebGLContext.uniform4iv(this._pWebGLUniformLocations[sName], pBuffer);
    	}

#ifdef IMAT2_TS
    	inline setMat2Array(sName: string, pValue: IMat2[]): void {

    	}
#endif

    	inline setMat3Array(sName: string, pValue: IMat3[]): void {
            var pBuffer: Int32Array = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 9);
            for (var i: int = 0; i < pValue.length; i ++) {
                pBuffer.set(pValue[i].data, 9*i);
            }
    		this._pWebGLContext.uniformMatrix3fv(this._pWebGLUniformLocations[sName], false, pBuffer);
    	}

    	inline setMat4Array(sName: string, pValue: IMat4[]): void {
    		var pBuffer: Int32Array = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 16);
            for (var i: int = 0; i < pValue.length; i ++) {
                pBuffer.set(pValue[i].data, 16*i);
            }
            this._pWebGLContext.uniformMatrix4fv(this._pWebGLUniformLocations[sName], false, pBuffer);
    	}

    	inline setStruct(sName: string, pData: Object): void {
    		
    	}

    	inline setSampler(sName: string, pSampler: IAFXSamplerState): void {
           var iSlot: int = this.applySamplerState(pSampler);
           this.setInt(sName, iSlot);
    	}

        inline setVertexBuffer(sName: string, pBuffer: IVertexBuffer): void {
            // var iSlot: uint = this._pWebGLRenderer.getNextTextureSlot();
            // this._pWebGLRenderer.activateWebGLTexture(iSlot + GL_TEXTURE0);
            // WARNING(iSlot);
            // var iSlot: uint = this._pWebGLRenderer.activateWebGLTextureInAutoSlot(GL_TEXTURE_2D, null);
            // this._pWebGLRenderer.bindWebGLTexture(GL_TEXTURE_2D, (<WebGLVertexTexture>pBuffer).getWebGLTexture());
            var iSlot: uint = this._pWebGLRenderer.activateWebGLTextureInAutoSlot(GL_TEXTURE_2D, (<WebGLVertexTexture>pBuffer).getWebGLTexture());
            this.setInt(sName, iSlot);
        }

        inline setSamplerArray(sName: string, pList: IAFXSamplerState[]): void {
            var pBuffer: Int32Array = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pList.length);
            
            for (var i: int = 0; i < pList.length; ++ i) {
                pBuffer[i] = this.applySamplerState(pList[i]);                
            }
            
            this.setInt32Array(sName, pBuffer);
        }


    	inline setTexture(sName: string, pData: ITexture): void {
    		
    	}

        private applySamplerState(pSampler: IAFXSamplerState): int {
            var pTexture: WebGLInternalTexture = <WebGLInternalTexture>pSampler.texture;
            
            if(isNull(pTexture)){
                return ZERO_SAMPLER_SLOT;
            }

            var iSlot: int = this._pWebGLRenderer.activateWebGLTextureInAutoSlot(pTexture._getWebGLTextureTarget(), pTexture.getWebGLTexture());

            // var iSlot: int = this._pWebGLRenderer.getNextTextureSlot();
            // this._pWebGLRenderer.activateWebGLTexture(iSlot + GL_TEXTURE0);

            // this._pWebGLRenderer.bindWebGLTexture(pTexture._getWebGLTextureTarget(), null);
            // this._pWebGLRenderer.bindWebGLTexture(pTexture._getWebGLTextureTarget(), pTexture.getWebGLTexture());

            pTexture._setFilterInternalTexture(ETextureParameters.MAG_FILTER, pSampler.mag_filter);
            pTexture._setFilterInternalTexture(ETextureParameters.MIN_FILTER, pSampler.min_filter);

            pTexture._setWrapModeInternalTexture(ETextureParameters.WRAP_S, pSampler.wrap_s);
            pTexture._setWrapModeInternalTexture(ETextureParameters.WRAP_T, pSampler.wrap_t);

            return iSlot;
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


        inline _setFloat(pWebGLUniformLocation: WebGLUniformLocation, fValue: float): void {
            this._pWebGLContext.uniform1f(pWebGLUniformLocation, fValue);
        }

        inline _setInt(pWebGLUniformLocation: WebGLUniformLocation, iValue: int): void {
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

#ifdef IMAT2_TS     
        inline _setMat2(pWebGLUniformLocation: WebGLUniformLocation, m2fValue: IMat2): void {
            this._pWebGLContext.uniformMatrix2fv(pWebGLUniformLocation, false, m2fValue.data);
        }
#endif        

        inline _setMat3(pWebGLUniformLocation: WebGLUniformLocation, m3fValue: IMat3): void {
            this._pWebGLContext.uniformMatrix3fv(pWebGLUniformLocation, false, m3fValue.data);
        }

        _setMat4(pWebGLUniformLocation: WebGLUniformLocation, m4fValue: IMat4): void {
            this._pWebGLContext.uniformMatrix4fv(pWebGLUniformLocation, false, m4fValue.data);
        }

        inline _setFloat32Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: Float32Array): void {
            this._pWebGLContext.uniform1fv(pWebGLUniformLocation, pValue);
        }

        inline _setInt32Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: Int32Array): void {
            this._pWebGLContext.uniform1iv(pWebGLUniformLocation, pValue);
        }

        inline _setVec2Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: IVec2[]): void {
            var pBuffer: Float32Array = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 2);
            for (var i: int = 0, j: int = 0; i < pValue.length; i += 2, ++ j) {
                pBuffer[i    ] = pValue[j].x;
                pBuffer[i + 1] = pValue[j].y;
            }

            this._pWebGLContext.uniform2fv(pWebGLUniformLocation, pBuffer);
        }

        inline _setVec2iArray(pWebGLUniformLocation: WebGLUniformLocation, pValue: IVec2[]): void {
            var pBuffer: Int32Array = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 2);
            for (var i: int = 0, j: int = 0; i < pValue.length; i += 2, ++ j) {
                pBuffer[i    ] = pValue[j].x;
                pBuffer[i + 1] = pValue[j].y;
            }

            this._pWebGLContext.uniform2iv(pWebGLUniformLocation, pBuffer);
        }

        inline _setVec3Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: IVec3[]): void {
            var pBuffer: Float32Array = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 3);
            for (var i: int = 0, j: int = 0; i < pValue.length; i += 3, ++ j) {
                pBuffer[i    ] = pValue[j].x;
                pBuffer[i + 1] = pValue[j].y;
                pBuffer[i + 2] = pValue[j].z;
            }

            this._pWebGLContext.uniform3fv(pWebGLUniformLocation, pBuffer);
        }

        inline _setVec3iArray(pWebGLUniformLocation: WebGLUniformLocation, pValue: IVec3[]): void {
            var pBuffer: Int32Array = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 3);
            for (var i: int = 0, j: int = 0; i < pValue.length; i += 3, ++ j) {
                pBuffer[i    ] = pValue[j].x;
                pBuffer[i + 1] = pValue[j].y;
                pBuffer[i + 2] = pValue[j].z;
            }

            this._pWebGLContext.uniform3iv(pWebGLUniformLocation, pBuffer);
        }

        inline _setVec4Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: IVec4[]): void {
            var pBuffer: Float32Array = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 4);
            for (var i: int = 0, j: int = 0; i < pValue.length; i += 4, ++ j) {
                pBuffer[i    ] = pValue[j].x;
                pBuffer[i + 1] = pValue[j].y;
                pBuffer[i + 2] = pValue[j].z;
                pBuffer[i + 3] = pValue[j].w;
            }

            this._pWebGLContext.uniform4fv(pWebGLUniformLocation, pBuffer);
        }

        inline _setVec4iArray(pWebGLUniformLocation: WebGLUniformLocation, pValue: IVec4[]): void {
            var pBuffer: Int32Array = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 4);
            for (var i: int = 0, j: int = 0; i < pValue.length; i += 4, ++ j) {
                pBuffer[i    ] = pValue[j].x;
                pBuffer[i + 1] = pValue[j].y;
                pBuffer[i + 2] = pValue[j].z;
                pBuffer[i + 3] = pValue[j].w;
            }

            this._pWebGLContext.uniform4iv(pWebGLUniformLocation, pBuffer);
        }

#ifdef IMAT2_TS
        inline _setMat2Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: IMat2[]): void {

        }
#endif

        inline _setMat3Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: IMat3[]): void {
            var pBuffer: Int32Array = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 9);
            for (var i: int = 0; i < pValue.length; i ++) {
                pBuffer.set(pValue[i].data, 9*i);
            }
            this._pWebGLContext.uniformMatrix3fv(pWebGLUniformLocation, false, pBuffer);
        }

        inline _setMat4Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: IMat4[]): void {
            var pBuffer: Int32Array = new Float32Array(WebGLShaderProgram.uniformBuffer, 0, pValue.length * 16);
            for (var i: int = 0; i < pValue.length; i ++) {
                pBuffer.set(pValue[i].data, 16*i);
            }
            this._pWebGLContext.uniformMatrix4fv(pWebGLUniformLocation, false, pBuffer);
        }

        inline _setSampler(pWebGLUniformLocation: WebGLUniformLocation, pSampler: IAFXSamplerState): void {
           var iSlot: int = this.applySamplerState(pSampler);
           this._setInt(pWebGLUniformLocation, iSlot);
        }

        inline _setVertexBuffer(pWebGLUniformLocation: WebGLUniformLocation, pBuffer: IVertexBuffer): void {
            // var iSlot: uint = this._pWebGLRenderer.getNextTextureSlot();
            // this._pWebGLRenderer.activateWebGLTexture(iSlot + GL_TEXTURE0);
            // WARNING(iSlot);
            // var iSlot: uint = this._pWebGLRenderer.activateWebGLTextureInAutoSlot(GL_TEXTURE_2D, null);
            // this._pWebGLRenderer.bindWebGLTexture(GL_TEXTURE_2D, (<WebGLVertexTexture>pBuffer).getWebGLTexture());
            var iSlot: uint = this._pWebGLRenderer.activateWebGLTextureInAutoSlot(GL_TEXTURE_2D, (<WebGLVertexTexture>pBuffer).getWebGLTexture());
            this._setInt(pWebGLUniformLocation, iSlot);
        }

        inline _setSamplerArray(pWebGLUniformLocation: WebGLUniformLocation, pList: IAFXSamplerState[]): void {
            var pBuffer: Int32Array = new Int32Array(WebGLShaderProgram.uniformBuffer, 0, pList.length);
            
            for (var i: int = 0; i < pList.length; ++ i) {
                pBuffer[i] = this.applySamplerState(pList[i]);                
            }
            
            this._setInt32Array(pWebGLUniformLocation, pBuffer);
        }


        inline applyBufferMap(pMap: IBufferMap): void {
            CRITICAL("WebGLShaderProgram::applyBufferMap() is uncompleted method!");
        }


    	inline getWebGLAttributeLocation(sName: string): int {
    		return isDef(this._pWebGLAttributeLocations[sName]) ? this._pWebGLAttributeLocations[sName] : -1;
    	}

        inline getWebGLUniformLocations(): WebGLUniformLocationMap {
            return this._pWebGLUniformLocations;
        }

    	inline getWebGLUniformLocation(sName: string): WebGLUniformLocation {
#ifdef DEBUG
			var iLoc: WebGLUniformLocation = this._pWebGLUniformLocations[sName];

			if (!isDef(iLoc)) {
				WARNING("could not find location for GLSL attribute(guid: %s): %s", this.getGuid(), sName);	
			}

			return iLoc;
#else
    		return this._pWebGLUniformLocations[sName] || null;
#endif
    	}

    	inline getWebGLProgram(): WebGLProgram {
    		return this._pWebGLProgram;
    	}

#ifdef DEBUG
        getTranslatedShaderCode(eWebGLType: int): string {
            var sReturn: string = "";
            var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
            var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

            if(!loadExtension(pWebGLContext, WEBGL_DEBUG_SHADERS)) {
                return null;
            }

            var pWebGLShaderList: WebGLShader[] = pWebGLContext.getAttachedShaders(this._pWebGLProgram);

            for(var i: uint = 0; i < pWebGLShaderList.length; i++){
                var eShaderType: int = <int>pWebGLContext.getShaderParameter(pWebGLShaderList[i], GL_SHADER_TYPE);
                
                if(eShaderType === eWebGLType) {
                    sReturn = pWebGLContext.getExtension(WEBGL_DEBUG_SHADERS).getTranslatedShaderSource(pWebGLShaderList[i]);
                    break;
                }
            }

            return sReturn;
        }

        printTranslatedShaderCode(eWebGLType?: int = -1): void {
            if(eWebGLType === -1){
                LOG("translated(from GLSL) VS shader: \n" + this.getTranslatedShaderCode(GL_VERTEX_SHADER));
                LOG("translated(from GLSL) PS shader: \n" + this.getTranslatedShaderCode(GL_FRAGMENT_SHADER));
            }
            else {
                LOG("translated(from GLSL) " + (eWebGLType === GL_VERTEX_SHADER? "VS": "PS") + " shader: \n" + 
                    this.getTranslatedShaderCode(eWebGLType));
            }
        }
#endif

    	protected createWebGLShader(eType: int, csCode: string): WebGLShader {
    		var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
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

                if (loadExtension(pWebGLContext, WEBGL_DEBUG_SHADERS)) {
                    LOG("translated(from GLSL) " + (eType == GL_VERTEX_SHADER? "VS": "PS") + " shader: \n" + 
                        pWebGLContext.getExtension(WEBGL_DEBUG_SHADERS).getTranslatedShaderSource(pWebGLShader));
                }				
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
    			pUniformInfo = pWebGLContext.getActiveUniform(this._pWebGLProgram, i);
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
            this._iTotalAttributes = nAttributes;
    	}
	}
}

#endif