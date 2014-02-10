/// <reference path="../model/MeshSubset.ts" />
/// <reference path="../config/config.ts" />
var akra;
(function (akra) {
    /// <reference path="WebGLRenderer.ts" />
    (function (webgl) {
        var Vec2 = akra.math.Vec2;
        function calculateSkin(pMeshSubset) {
            var pRenderData = pMeshSubset.getData();

            var isOk = pRenderData.selectIndexSet(".update_skinned_position");

            if (!isOk) {
                return false;
            }

            var pEngine = pRenderData.getBuffer().getEngine();
            var pResourceManager = pEngine.getResourceManager();
            var pWebGLRenderer = pEngine.getRenderer();
            var pWebGLContext = pWebGLRenderer.getWebGLContext();

            var pWebGLVertexTexture = pRenderData.getBuffer().getBuffer();
            var pWebGLTexture = pWebGLVertexTexture.getWebGLTexture();

            /*update skinned position program*/
            var pWebGLProgram = pResourceManager.getShaderProgramPool().findResource(".WEBGL_skinning_update");
            if (akra.isNull(pWebGLProgram)) {
                pWebGLProgram = pResourceManager.getShaderProgramPool().createResource(".WEBGL_skinning_update");
                pWebGLProgram.create("																																\n\
				#ifndef A_VB_COMPONENT3																											\n\
				#define A_VB_COMPONENT4																											\n\
				#endif																															\n\
				#ifdef A_VB_COMPONENT4																											\n\
				#define A_VB_ELEMENT_SIZE 4.																									\n\
				#endif																															\n\
				#ifdef A_VB_COMPONENT3																											\n\
				#define A_VB_ELEMENT_SIZE 3.																									\n\
				#endif																															\n\
				#define A_tex2D(S, H, X, Y) texture2D(S, vec2(H.stepX * X , H.stepY * Y))														\n\
				#define A_tex2Dv(S, H, V) texture2D(S, V)																						\n\
																																				\n\
				struct A_TextureHeader { float width; float height; float stepX; float stepY; };												\n\
																																				\n\
				void A_extractTextureHeader(const sampler2D src, out A_TextureHeader header){													\n\
					vec4 v = texture2D(src, vec2(0.00001));																						\n\
					header = A_TextureHeader(v.r, v.g, v.b, v.a);																				\n\
				}																																\n\
																																				\n\
				vec2 A_findPixel(const A_TextureHeader header, const float offset){																\n\
					float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE);																		\n\
				return vec2(header.stepX * (mod(pixelNumber, header.width) + .5),																\n\
					 header.stepY * (floor(pixelNumber / header.width) + .5));																	\n\
				}																																\n\
																																				\n\
				vec2 A_extractVec2(const sampler2D sampler, const A_TextureHeader header, const float offset){									\n\
					vec2 pPos = A_findPixel(header, offset);																					\n\
					int shift = int(mod(offset, A_VB_ELEMENT_SIZE));																			\n\
																																				\n\
					#ifdef A_VB_COMPONENT4																										\n\
																																				\n\
					if(shift == 0) return A_tex2Dv(sampler, header, pPos).rg;																	\n\
					else if(shift == 1) return A_tex2Dv(sampler, header, pPos).gb;																\n\
					else if(shift == 2) return A_tex2Dv(sampler, header, pPos).ba;																\n\
					else if(shift == 3) {																										\n\
						if(int(pPos.x*header.width) == int(header.width - 1.)){																	\n\
							return vec2(A_tex2Dv(sampler, header, pPos).a,																		\n\
								A_tex2Dv(sampler, header, vec2(0.5 * header.stepX, pPos.y + header.stepY)).r);									\n\
						}																														\n\
						else{																													\n\
							return vec2(A_tex2Dv(sampler, header, pPos).a, A_tex2Dv(sampler, header, vec2(pPos.x + header.stepX, pPos.y)).r);	\n\
						}																														\n\
					}																															\n\
					#endif																														\n\
																																				\n\
					return vec2(0.);																											\n\
				}																																\n\
																																				\n\
				vec4 A_extractVec4(const sampler2D sampler, const A_TextureHeader header, const float offset){									\n\
					vec2 pPos = A_findPixel(header, offset);																					\n\
					int shift = int(mod(offset, A_VB_ELEMENT_SIZE));																			\n\
																																				\n\
					#ifdef A_VB_COMPONENT4																										\n\
																																				\n\
					if(shift == 0) return A_tex2Dv(sampler, header, pPos);																		\n\
					else if(shift == 1){																										\n\
						if(int(pPos.x*header.width) == int(header.width - 1.)){																	\n\
							return vec4(A_tex2Dv(sampler, header, pPos).gba,																	\n\
								A_tex2Dv(sampler, header, vec2(0.5 * header.stepX, pPos.y + header.stepY)).r);									\n\
						}																														\n\
						else{																													\n\
							return vec4(A_tex2Dv(sampler, header, pPos).gba, A_tex2Dv(sampler, header, vec2(pPos.x + header.stepX, pPos.y)).r);	\n\
						}																														\n\
					}																															\n\
					else if(shift == 2){																										\n\
						if(int(pPos.x*header.width) == int(header.width - 1.)){																	\n\
							return vec4(A_tex2Dv(sampler, header, pPos).ba,																		\n\
								A_tex2Dv(sampler, header, vec2(0.5 * header.stepX, pPos.y + header.stepY)).rg);									\n\
						}																														\n\
						else{																													\n\
							return vec4(A_tex2Dv(sampler, header, pPos).ba, A_tex2Dv(sampler, header, vec2(pPos.x + header.stepX, pPos.y)).rg);	\n\
						}																														\n\
					}																															\n\
					else if(shift == 3){																										\n\
						if(int(pPos.x*header.width) == int(header.width - 1.)){																	\n\
							return vec4(A_tex2Dv(sampler, header, pPos).a,																		\n\
								A_tex2Dv(sampler, header, vec2(0.5 * header.stepX, pPos.y + header.stepY)).rgb);								\n\
						}																														\n\
						else{																													\n\
							return vec4(A_tex2Dv(sampler, header, pPos).a, A_tex2Dv(sampler, header, vec2(pPos.x + header.stepX, pPos.y)).rgb);	\n\
						}																														\n\
					}																															\n\
																																				\n\
					#endif																														\n\
																																				\n\
					#ifdef A_VB_COMPONENT3																										\n\
					#endif																														\n\
																																				\n\
					return vec4(0.);																											\n\
				}																																\n\
																																				\n\
				mat4 A_extractMat4(const sampler2D sampler, const A_TextureHeader header, const float offset){									\n\
					return mat4(A_tex2Dv(sampler, header, A_findPixel(header, offset)),															\n\
								A_tex2Dv(sampler, header, A_findPixel(header, offset + 4.)),													\n\
								A_tex2Dv(sampler, header, A_findPixel(header, offset + 8.)),													\n\
								A_tex2Dv(sampler, header, A_findPixel(header, offset + 12.)));													\n\
				}																																\n\
																																				\n\
				attribute float positionIndex;																									\n\
				attribute float normalIndex;																									\n\
				attribute float destinationIndex;																								\n\
																																				\n\
				uniform sampler2D videoBuffer;																									\n\
				uniform vec2 frameBufferSize;																									\n\
				uniform int type;																												\n\
				uniform mat4 bind_matrix;																										\n\
																																				\n\
				varying vec4 data;																												\n\
																																				\n\
				void main(void){																												\n\
					A_TextureHeader header;																										\n\
					A_extractTextureHeader(videoBuffer, header);																				\n\
																																				\n\
					vec4 position = A_extractVec4(videoBuffer, header, positionIndex);															\n\
					vec2 meta_data = A_extractVec2(videoBuffer, header, position.w);															\n\
																																				\n\
					float number_matrix = meta_data.x;																							\n\
					float bone_inf_ptr = meta_data.y;																							\n\
																																				\n\
					mat4 bone_matrix = mat4(0.);																								\n\
					float weight;																												\n\
																																				\n\
					mat4 result_mat = mat4(0.);																									\n\
																																				\n\
					for(float i = 0.; i < 16.; i++) {																							\n\
						if(i < number_matrix){																									\n\
							//get data about matrix and weight																					\n\
							vec2 bone_inf = A_extractVec2(videoBuffer, header, bone_inf_ptr + i * 2.);											\n\
																																				\n\
							bone_matrix = A_extractMat4(videoBuffer, header, bone_inf.x);														\n\
							weight = bone_inf.y;																								\n\
																																				\n\
							result_mat += bone_matrix * weight;																					\n\
						}																														\n\
						else {																													\n\
							break;																												\n\
						}																														\n\
					}																															\n\
																																				\n\
					result_mat = result_mat * bind_matrix;																						\n\
																																				\n\
					if(type == 0){																												\n\
						data = result_mat * vec4(position.xyz, 1.);																				\n\
					}																															\n\
					else if(type == 1){																											\n\
						vec4 normal = A_extractVec4(videoBuffer, header, normalIndex);															\n\
						data = vec4((result_mat * vec4(normal.xyz, 0.)).xyz, normal.w);															\n\
					}																															\n\
																																				\n\
					vec2 outPixelPosition = vec2((mod(destinationIndex/4., frameBufferSize.x) + 0.5)/frameBufferSize.x,							\n\
												 (floor(destinationIndex/4./frameBufferSize.x) + 0.5)/frameBufferSize.y);						\n\
																																				\n\
					gl_Position = vec4(outPixelPosition*2. - 1., 0. ,1.);																		\n\
					gl_PointSize = 1.;																											\n\
				}																																\n\
																																				\n\
				", "																																\n\
				#ifdef GL_ES                        																							\n\
					precision highp float;          																							\n\
				#endif																															\n\
				varying vec4 data;                  																							\n\
																																				\n\
				void main(void) {                   																							\n\
					gl_FragColor = data;            																							\n\
				}                                   																							\n\
				");
            }

            var pOldFrameBuffer = pWebGLRenderer.getParameter(36006 /* FRAMEBUFFER_BINDING */);

            var pWebGLFramebuffer = pWebGLRenderer.createWebGLFramebuffer();

            pWebGLRenderer.disableAllWebGLVertexAttribs();

            pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, pWebGLFramebuffer);
            pWebGLRenderer.useWebGLProgram(pWebGLProgram.getWebGLProgram());

            pWebGLRenderer.disable(2929 /* DEPTH_TEST */);
            pWebGLRenderer.disable(3089 /* SCISSOR_TEST */);
            pWebGLRenderer.disable(3042 /* BLEND */);
            pWebGLRenderer.disable(2884 /* CULL_FACE */);

            var iPositionAttribLocation = pWebGLProgram.getWebGLAttributeLocation("positionIndex");
            var iNormalAttribLocation = pWebGLProgram.getWebGLAttributeLocation("normalIndex");
            var iDestinationAttribLocation = pWebGLProgram.getWebGLAttributeLocation("destinationIndex");

            pWebGLContext.enableVertexAttribArray(iPositionAttribLocation);
            pWebGLContext.enableVertexAttribArray(iNormalAttribLocation);
            pWebGLContext.enableVertexAttribArray(iDestinationAttribLocation);

            pWebGLContext.framebufferTexture2D(36160 /* FRAMEBUFFER */, 36064 /* COLOR_ATTACHMENT0 */, 3553 /* TEXTURE_2D */, pWebGLTexture, 0);

            //get data from renderData for position update
            pRenderData.selectIndexSet(".update_skinned_position");
            var pIndexData = pRenderData.getIndices();
            var pBuffer = pIndexData.getBuffer();
            var pDeclaration = pIndexData.getVertexDeclaration();

            //LOG(pIndexData.toString());
            var iStride = pDeclaration.stride;
            var iPositionOffset = pDeclaration.findElement("UPP_INDEX").offset;
            var iDestinationOffset = pDeclaration.findElement("DESTINATION_SP").offset;
            var iNormalOffset = 0.;

            pWebGLRenderer.bindWebGLBuffer(34962 /* ARRAY_BUFFER */, pBuffer.getWebGLBuffer());
            pWebGLContext.vertexAttribPointer(iPositionAttribLocation, 1, 5126 /* FLOAT */, false, iStride, iPositionOffset);
            pWebGLContext.vertexAttribPointer(iDestinationAttribLocation, 1, 5126 /* FLOAT */, false, iStride, iDestinationOffset);

            /////////////////////////////////////////////////////////////////////////
            //просто подаем данные чтобы можно было порендерить, мы все равно ими не пользуемся
            pWebGLContext.vertexAttribPointer(iNormalAttribLocation, 1, 5126 /* FLOAT */, false, iStride, iPositionOffset);

            //
            /////////////////////////////////////////////////////////////////////////
            pWebGLRenderer.activateWebGLTexture(33984 /* TEXTURE0 */);
            pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, pWebGLTexture);

            var iWidth = pWebGLVertexTexture._getWidth();
            var iHeight = pWebGLVertexTexture._getHeight();

            pWebGLProgram.setInt("videoBuffer", 0);
            pWebGLProgram.setVec2("frameBufferSize", Vec2.temp(iWidth, iHeight));
            pWebGLProgram.setInt("type", 0);
            pWebGLProgram.setMat4("bind_matrix", pMeshSubset.getSkin().getBindMatrix());

            pWebGLContext.viewport(0, 0, iWidth, iHeight);

            //PASS 1
            ///////////////////////////////////////////////
            pWebGLContext.drawArrays(0 /* POINTS */, pIndexData.getByteOffset() / iStride, pIndexData.getLength());

            ///////////////////////////////////////////////
            //get data from renderData for normal update
            pRenderData.selectIndexSet(".update_skinned_normal");
            pIndexData = pRenderData.getIndices();
            pBuffer = pIndexData.getBuffer();
            pDeclaration = pIndexData.getVertexDeclaration();

            //LOG(pIndexData.toString());
            iStride = pDeclaration.stride;
            iPositionOffset = pDeclaration.findElement("UNP_INDEX").offset;
            iNormalOffset = pDeclaration.findElement("UNN_INDEX").offset;
            iDestinationOffset = pDeclaration.findElement("DESTINATION_SN").offset;

            pWebGLRenderer.bindWebGLBuffer(34962 /* ARRAY_BUFFER */, pBuffer.getWebGLBuffer());
            pWebGLContext.vertexAttribPointer(iPositionAttribLocation, 1, 5126 /* FLOAT */, false, iStride, iPositionOffset);
            pWebGLContext.vertexAttribPointer(iNormalAttribLocation, 1, 5126 /* FLOAT */, false, iStride, iNormalOffset);
            pWebGLContext.vertexAttribPointer(iDestinationAttribLocation, 1, 5126 /* FLOAT */, false, iStride, iDestinationOffset);

            pWebGLProgram.setInt("type", 1);

            //PASS 2
            ///////////////////////////////////////////////
            pWebGLContext.drawArrays(0 /* POINTS */, pIndexData.getByteOffset() / iStride, pIndexData.getLength());

            ///////////////////////////////////////////////
            pWebGLContext.flush();

            pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, pOldFrameBuffer);
            pWebGLRenderer.deleteWebGLFramebuffer(pWebGLFramebuffer);

            pWebGLContext.disableVertexAttribArray(iPositionAttribLocation);
            pWebGLContext.disableVertexAttribArray(iNormalAttribLocation);
            pWebGLContext.disableVertexAttribArray(iDestinationAttribLocation);

            pWebGLRenderer.bindWebGLBuffer(34962 /* ARRAY_BUFFER */, null);
            pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, null);
            pWebGLRenderer._setViewport(null);

            return true;
        }
        webgl.calculateSkin = calculateSkin;
    })(akra.webgl || (akra.webgl = {}));
    var webgl = akra.webgl;
})(akra || (akra = {}));
//# sourceMappingURL=CalculateSkin.js.map
