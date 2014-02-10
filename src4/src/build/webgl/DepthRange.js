var akra;
(function (akra) {
    /// <reference path="../render/Viewport.ts" />
    /// <reference path="WebGLRenderer.ts" />
    /// <reference path="WebGLInternalTexture.ts" />
    /// <reference path="../math/Vec2.ts" />
    (function (webgl) {
        var Vec2 = akra.math.Vec2;

        var sFloatToVec4Func = "\
			vec4 floatToVec4(float value){						\n\
				float data = value;								\n\
				vec4 result = vec4(0.);							\n\
																\n\
				if(data == 0.){									\n\
					float signedZeroTest = 1./value;			\n\
					if(signedZeroTest < 0.){					\n\
						result.x = 128.;						\n\
					}											\n\
					return result/255.;							\n\
				}												\n\
																\n\
				if(data < 0.){									\n\
					result.x=128.;								\n\
					data = -data;								\n\
				}												\n\
																\n\
				float power = 0.;								\n\
				bool isFinish = false;							\n\
																\n\
				for(int i = 0; i < 128; i++) {					\n\
				  if(isFinish){									\n\
					break;										\n\
				  }												\n\
																\n\
				  if(data >= 2.) {								\n\
					if(!isFinish){								\n\
					  data = data * 0.5;						\n\
					  power += 1.;								\n\
					  if (power == 127.) {						\n\
						isFinish = true;						\n\
					  }											\n\
					}											\n\
				  }												\n\
				  else if(data < 1.) {							\n\
					if(!isFinish){								\n\
					  data = data * 2.;							\n\
					  power -= 1.;								\n\
					  if (power == -126.) {						\n\
						isFinish = true;						\n\
					  }											\n\
					}											\n\
				  }												\n\
				  else {										\n\
					isFinish = true;							\n\
				  }												\n\
				}												\n\
																\n\
				if(power == -126. && data < 1.){				\n\
					power = 0.;									\n\
				}												\n\
				else{											\n\
					power = power+127.;							\n\
					data = data - 1.;							\n\
				}												\n\
																\n\
				result.x+=floor(power/2.);						\n\
				result.y = mod(power,2.)*128.;					\n\
																\n\
				data *= 128.;									\n\
																\n\
				result.y += floor(data);						\n\
																\n\
				data -= floor(data);							\n\
				data *= 256.;									\n\
																\n\
				result.z = floor(data);							\n\
																\n\
				data -= floor(data);							\n\
				data *= 256.;									\n\
																\n\
				result.w = floor(data);							\n\
																\n\
				return result/255.;								\n\
			}													\n";

        var sPixelCode = "										\n\
				#ifdef GL_ES                        				\n\
					precision highp float;          				\n\
				#endif												\n\
				varying vec2 texPosition;              				\n\
																	\n\
				uniform sampler2D srcTexture;						\n\
				uniform vec2 halfSrcTexureStep;						\n\
				uniform int selector;								\n\
																	\n\
				" + sFloatToVec4Func + "							\n\
																	\n\
				void main(void) {  									\n\
					if(selector == 0){								\n\
						float depth_NW = texture2D(srcTexture, texPosition + vec2(-halfSrcTexureStep.x, halfSrcTexureStep.y)).x;	\n\
						float depth_NE = texture2D(srcTexture, texPosition + vec2(halfSrcTexureStep.x, halfSrcTexureStep.y)).x;		\n\
						float depth_SW = texture2D(srcTexture, texPosition + vec2(-halfSrcTexureStep.x, -halfSrcTexureStep.y)).x;	\n\
						float depth_SE = texture2D(srcTexture, texPosition + vec2(halfSrcTexureStep.x, -halfSrcTexureStep.y)).x;	\n\
																																	\n\
						float fMaxDepth = -1.;														\n\
						float fMinDepth = min(depth_NW, min(depth_NE, min(depth_SW, depth_SE)));	\n\
																									\n\
						if(depth_NW != 1.){ //clear Depth value										\n\
							fMaxDepth = max(fMaxDepth, depth_NW);									\n\
						}																			\n\
						if(depth_NE != 1.){ //clear Depth value										\n\
							fMaxDepth = max(fMaxDepth, depth_NE);									\n\
						}																			\n\
						if(depth_SW != 1.){ //clear Depth value										\n\
							fMaxDepth = max(fMaxDepth, depth_SW);									\n\
						}																			\n\
						if(depth_SE != 1.){ //clear Depth value										\n\
							fMaxDepth = max(fMaxDepth, depth_SE);									\n\
						}																			\n\
																									\n\
						if(fMaxDepth == -1.){														\n\
							fMaxDepth = 1.;															\n\
						}																			\n\
																									\n\
						gl_FragColor = vec4(fMaxDepth, fMinDepth, 0., 1.);							\n\
					}																				\n\
					else if(selector == 1){															\n\
						vec2 depth_NW = texture2D(srcTexture, texPosition + vec2(-halfSrcTexureStep.x, halfSrcTexureStep.y)).xy;	\n\
						vec2 depth_NE = texture2D(srcTexture, texPosition + vec2(halfSrcTexureStep.x, halfSrcTexureStep.y)).xy;		\n\
						vec2 depth_SW = texture2D(srcTexture, texPosition + vec2(-halfSrcTexureStep.x, -halfSrcTexureStep.y)).xy;	\n\
						vec2 depth_SE = texture2D(srcTexture, texPosition + vec2(halfSrcTexureStep.x, -halfSrcTexureStep.y)).xy;	\n\
																																	\n\
						//x - max depth 																							\n\
						//y - min depth 																							\n\
																																	\n\
						float fMaxDepth = -1.;																						\n\
						float fMinDepth = min(depth_NW.y, min(depth_NE.y, min(depth_SW.y, depth_SE.y)));							\n\
																																	\n\
						if(depth_NW.x != 1.){ //clear Depth value																	\n\
							fMaxDepth = max(fMaxDepth, depth_NW.x);																	\n\
						}																											\n\
						if(depth_NE.x != 1.){ //clear Depth value																	\n\
							fMaxDepth = max(fMaxDepth, depth_NE.x);																	\n\
						}																											\n\
						if(depth_SW.x != 1.){ //clear Depth value																	\n\
							fMaxDepth = max(fMaxDepth, depth_SW.x);																	\n\
						}																											\n\
						if(depth_SE.x != 1.){ //clear Depth value																	\n\
							fMaxDepth = max(fMaxDepth, depth_SE.x);																	\n\
						}																											\n\
																																	\n\
						if(fMaxDepth == -1.){																						\n\
							fMaxDepth = 1.;																							\n\
						}																											\n\
																																	\n\
						gl_FragColor = vec4(fMaxDepth, fMinDepth, 0., 1.);															\n\
					}																												\n\
					else{																											\n\
						// 1x1 float texture with depth to two point with decomposed float 											\n\
						vec2 depth = texture2D(srcTexture, vec2(0.5, 0.5)).xy;														\n\
						if(texPosition.x < 0.5){																					\n\
							//first pixel																							\n\
							vec4 value = floatToVec4(depth.x);																		\n\
							gl_FragColor = vec4(value.w, value.b, value.g, value.r);												\n\
						}																											\n\
						else{																										\n\
							//second pixel																							\n\
							vec4 value = floatToVec4(depth.y);																		\n\
							gl_FragColor = vec4(value.w, value.b, value.g, value.r);												\n\
						}																											\n\
					}																												\n\
				}                                   																				\n\
				";

        var sVertexCode = "																						\n\
				attribute vec2 POSITION;																			\n\
																													\n\
				varying vec2 texPosition;																			\n\
																													\n\
				void main(void){																					\n\
					texPosition = (POSITION + 1.)/2.;																\n\
					gl_Position = vec4(POSITION, 0., 1.);															\n\
				}																									\n\
				";

        var pF32ScreenCoords = new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]);
        var pU8Destination = new Uint8Array(8);
        var pF32Destination = new Float32Array(pU8Destination.buffer);

        function getDepthRange(pDepthTexture) {
            var pEngine = pDepthTexture.getEngine();
            var pResourceManager = pEngine.getResourceManager();
            var pWebGLRenderer = pEngine.getRenderer();
            var pWebGLContext = pWebGLRenderer.getWebGLContext();

            var pWebGLDepthTexture = pDepthTexture.getWebGLTexture();

            var pWebGLProgram = pResourceManager.getShaderProgramPool().findResource(".WEBGL_depth_range");

            if (akra.isNull(pWebGLProgram)) {
                pWebGLProgram = pResourceManager.getShaderProgramPool().createResource(".WEBGL_depth_range");

                pWebGLProgram.create(sVertexCode, sPixelCode);
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

            var iPositionAttribLocation = pWebGLProgram.getWebGLAttributeLocation("POSITION");

            pWebGLContext.enableVertexAttribArray(iPositionAttribLocation);

            var pPositionBuffer = pWebGLContext.createBuffer();
            pWebGLRenderer.bindWebGLBuffer(34962 /* ARRAY_BUFFER */, pPositionBuffer);
            pWebGLContext.bufferData(34962 /* ARRAY_BUFFER */, pF32ScreenCoords, 35044 /* STATIC_DRAW */);
            pWebGLContext.vertexAttribPointer(iPositionAttribLocation, 2, 5126 /* FLOAT */, false, 0, 0);

            var iSrcTextureSizeX = pDepthTexture.getWidth();
            var iSrcTextureSizeY = pDepthTexture.getHeight();

            var pWebGLTexture1 = pWebGLContext.createTexture();
            var pWebGLTexture2 = pWebGLContext.createTexture();

            var pWebGLRenderTexture = pWebGLTexture1;
            var pWebGLSrcTexture = pWebGLDepthTexture;

            var iSelector = 0;

            var iRenderTextureSizeX = 0;
            var iRenderTextureSizeY = 0;

            if (iSrcTextureSizeX == 1 && iSrcTextureSizeY == 1) {
                iSelector = 2;

                iRenderTextureSizeX = 2;
                iRenderTextureSizeY = 1;

                pWebGLRenderer.activateWebGLTexture(33984 /* TEXTURE0 */);
                pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, pWebGLRenderTexture);

                pWebGLContext.texImage2D(3553 /* TEXTURE_2D */, 0, 6408 /* RGBA */, 2, 1, 0, 6408 /* RGBA */, 5121 /* UNSIGNED_BYTE */, null);
            } else {
                iSelector = 0;

                iRenderTextureSizeX = akra.math.pow(2, akra.math.floor(akra.math.log(iSrcTextureSizeX) / akra.math.log(2)));
                iRenderTextureSizeY = akra.math.pow(2, akra.math.floor(akra.math.log(iSrcTextureSizeY) / akra.math.log(2)));

                if (iRenderTextureSizeX == iSrcTextureSizeX) {
                    iRenderTextureSizeX = iSrcTextureSizeX / 2;
                }
                if (iRenderTextureSizeY == iSrcTextureSizeY) {
                    iRenderTextureSizeY = iSrcTextureSizeY / 2;
                }

                if (iRenderTextureSizeX > iRenderTextureSizeY) {
                    iRenderTextureSizeY = iRenderTextureSizeX;
                } else {
                    iRenderTextureSizeX = iRenderTextureSizeY;
                }

                pWebGLRenderer.activateWebGLTexture(33984 /* TEXTURE0 */);
                pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, pWebGLRenderTexture);

                pWebGLContext.texImage2D(3553 /* TEXTURE_2D */, 0, 6408 /* RGBA */, iRenderTextureSizeX, iRenderTextureSizeY, 0, 6408 /* RGBA */, 5126 /* FLOAT */, null);
            }

            do {
                pWebGLRenderer.activateWebGLTexture(33985 /* TEXTURE1 */);
                pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, pWebGLRenderTexture);
                pWebGLContext.texParameteri(3553 /* TEXTURE_2D */, 10242 /* TEXTURE_WRAP_S */, 33071 /* CLAMP_TO_EDGE */);
                pWebGLContext.texParameteri(3553 /* TEXTURE_2D */, 10243 /* TEXTURE_WRAP_T */, 33071 /* CLAMP_TO_EDGE */);
                pWebGLContext.texParameteri(3553 /* TEXTURE_2D */, 10241 /* TEXTURE_MIN_FILTER */, 9728 /* NEAREST */);
                pWebGLContext.texParameteri(3553 /* TEXTURE_2D */, 10240 /* TEXTURE_MAG_FILTER */, 9728 /* NEAREST */);

                pWebGLContext.framebufferTexture2D(36160 /* FRAMEBUFFER */, 36064 /* COLOR_ATTACHMENT0 */, 3553 /* TEXTURE_2D */, pWebGLRenderTexture, 0);

                pWebGLRenderer.activateWebGLTexture(33984 /* TEXTURE0 */);
                pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, pWebGLSrcTexture);

                pWebGLProgram.setInt("selector", iSelector);
                pWebGLProgram.setInt("srcTexture", 0);
                pWebGLProgram.setVec2("halfSrcTexureStep", Vec2.temp(0.5 / iSrcTextureSizeX, 0.5 / iSrcTextureSizeY));

                pWebGLContext.viewport(0, 0, iRenderTextureSizeX, iRenderTextureSizeY);

                pWebGLContext.drawArrays(5 /* TRIANGLE_STRIP */, 0, 4);

                if (iSelector == 2) {
                    break;
                }

                iSelector = 1;

                if (iRenderTextureSizeX === 1 && iRenderTextureSizeY === 1) {
                    iSelector = 2;

                    iRenderTextureSizeX = 2;
                    iRenderTextureSizeY = 1;

                    pWebGLSrcTexture = pWebGLRenderTexture;

                    pWebGLRenderTexture = (pWebGLRenderTexture === pWebGLTexture1) ? pWebGLTexture2 : pWebGLTexture1;

                    pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, pWebGLRenderTexture);

                    pWebGLContext.texImage2D(3553 /* TEXTURE_2D */, 0, 6408 /* RGBA */, iRenderTextureSizeX, iRenderTextureSizeY, 0, 6408 /* RGBA */, 5121 /* UNSIGNED_BYTE */, null);
                } else {
                    iSrcTextureSizeX = iRenderTextureSizeX;
                    iSrcTextureSizeY = iRenderTextureSizeY;

                    iRenderTextureSizeX = iSrcTextureSizeX / 2;
                    iRenderTextureSizeY = iSrcTextureSizeY / 2;

                    pWebGLSrcTexture = pWebGLRenderTexture;

                    pWebGLRenderTexture = (pWebGLRenderTexture === pWebGLTexture1) ? pWebGLTexture2 : pWebGLTexture1;

                    pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, pWebGLRenderTexture);

                    pWebGLContext.texImage2D(3553 /* TEXTURE_2D */, 0, 6408 /* RGBA */, iRenderTextureSizeX, iRenderTextureSizeY, 0, 6408 /* RGBA */, 5126 /* FLOAT */, null);
                }
            } while(1);

            pWebGLContext.readPixels(0, 0, 2, 1, 6408 /* RGBA */, 5121 /* UNSIGNED_BYTE */, pU8Destination);

            pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, pOldFrameBuffer);
            pWebGLRenderer.deleteWebGLFramebuffer(pWebGLFramebuffer);

            pWebGLContext.disableVertexAttribArray(iPositionAttribLocation);
            pWebGLContext.deleteBuffer(pPositionBuffer);
            pWebGLContext.deleteTexture(pWebGLTexture1);
            pWebGLContext.deleteTexture(pWebGLTexture2);

            pWebGLRenderer.enable(2929 /* DEPTH_TEST */);

            // pWebGLContext.disable(gl.SCISSOR_TEST);
            // pWebGLContext.disable(gl.BLEND);
            // pWebGLContext.disable(gl.CULL_FACE);
            pWebGLRenderer.bindWebGLBuffer(34962 /* ARRAY_BUFFER */, null);
            pWebGLRenderer._setViewport(null);

            // console.log("depth range:", pF32Destination[1], pF32Destination[0]);
            return { min: pF32Destination[1], max: pF32Destination[0] };
        }
        webgl.getDepthRange = getDepthRange;
    })(akra.webgl || (akra.webgl = {}));
    var webgl = akra.webgl;
})(akra || (akra = {}));
//# sourceMappingURL=DepthRange.js.map
