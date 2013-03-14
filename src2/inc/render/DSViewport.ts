#ifndef DSVIEWPORT_TS
#define DSVIEWPORT_TS


#define PREPARE_DEFERRED_SHADING_AFX 			"prepare_deferred_shading.afx"
#define BASIC_DEFERRED_SHADING_AFX 				"base_deferred_shading.afx"
#define LIGHTS_AND_SHADOWS_DEFERRED_SHADING_AFX "lights_and_shadows_deferred_shading.afx"
#define SKYBOX_DEFERRED_SHADING_AFX 			"skybox_deferred_shading.afx"
#define FXAA_DEFERRED_SHADING_AFX 				"fxaa_deferred_shading.afx"

#define uniformOmni() UniformOmni.stackCeil
#define uniformProject() UniformProject.stackCeil
#define uniformProjectShadow() UniformProjectShadow.stackCeil
#define uniformOmniShadow() UniformOmniShadow.stackCeil

#define IShadowSampler ISampler2d

module akra.render {

	interface IUniform {

	}

	struct LightData {
		DIFFUSE: IVec4 = new Vec4();
		AMBIENT: IVec4 = new Vec4();
		SPECULAR: IVec4 = new Vec4();
		POSITION: IVec4 = new Vec4();

		set(pLightParam: ILightParameters, v3fPosition: IVec3): LightData {
		    
		    this.DIFFUSE.set(pLightParam.diffuse);
		    this.AMBIENT.set(pLightParam.ambient);
		    this.SPECULAR.set(pLightParam.specular);
		    this.ATTENUATION.set(pLightParam.attenuation);
		    this.POSITION.set(v3fPosition);

		    return this;
		}
	};

	struct UniformOmni implements IUniform {
		LIGHT_DATA: LightData = new LightData();

		setLightData(pLightParam: ILightParameters, v3fPosition: IVec3): UniformOmni {
			this.LIGHT_DATA.set(pLightParam, v3fPosition);
			
			return this;
		}

		ALLOCATE_STORAGE(UniformOmni, 200);
	};

	struct UniformProject implements IUniform {
		LIGHT_DATA: LightData = new LightData();
    	SHADOW_MATRIX: IMat4 = new Mat4();

    	setLightData(pLightParam: ILightParameters, v3fPosition: IVec3): UniformProject {
			this.LIGHT_DATA.set(pLightParam, v3fPosition);
			
			return this;
		}

		setMatrix(m4fMatrix: IMat4): UniformProject {
			this.SHADOW_MATRIX.set(m4fMatrix);

			return this;
		}

    	ALLOCATE_STORAGE(UniformProject, 200);	
	};


	struct UniformProjectShadow implements IUniform {
		LIGHT_DATA: LightData = new a.LightData();
	    TO_LIGHT_SPACE: IMat4 = new Mat4();
	    REAL_PROJECTION_MATRIX: IMat4 = new Mat4();
	    OPTIMIZED_PROJECTION_MATRIX: IMat4 = new Mat4();
	    SHADOW_SAMPLER: IShadowSampler = {TEXTURE: null};

	    setLightData(pLightParam: ILightParameters, v3fPosition: IVec3): UniformProjectShadow {
	    	this.LIGHT_DATA.set(pLightParam, v3fPosition);
	    	return this;
	    }

	    setMatrix(m4fToLightSpace: IMat4, m4fRealProj: IMat4, m4fOptimizedProj: IMat4): UniformProjectShadow {
	    	this.TO_LIGHT_SPACE.set(m4fToLightSpace);
		    this.REAL_PROJECTION_MATRIX.set(m4fRealProj);
		    this.OPTIMIZED_PROJECTION_MATRIX.set(m4fOptimizedProj);

	    	return this;
	    }

	    setSampler(sTexture: string): UniformProjectShadow {
	    	this.SHADOW_SAMPLER.TEXTURE = sTexture;
	    	return this;
	    }

	    ALLOCATE_STORAGE(UniformProjectShadow, 20);
	}

	struct UniformOmniShadow implements IUniform {
		LIGHT_DATA: LightData = new LightData();
		TO_LIGHT_SPACE: IMat4[] = 
		[
			new Mat4, new Mat4, new Mat4, 
			new Mat4, new Mat4, new Mat4
		];

		OPTIMIZED_PROJECTION_MATRIX: IMat4[] = 
		[
			new Mat4, new Mat4, new Mat4, 
			new Mat4, new Mat4, new Mat4
		];
		
		SHADOW_SAMPLER: IShadowSampler[] = 
		[
			{"TEXTURE" : null}, {"TEXTURE" : null}, {"TEXTURE" : null},
	        {"TEXTURE" : null}, {"TEXTURE" : null}, {"TEXTURE" : null}
	    ];

	    setLightData(pLightParam: LightData, v3fPosition: IVec3): UniformOmniShadow {
		    this.LIGHT_DATA.set(pLightParam, v3fPosition);
		    return this;
		};

		setMatrix(m4fToLightSpace: IMat4, m4fOptimizedProj: IMat4, index: int): UniformOmniShadow {
		    this.TO_LIGHT_SPACE[index].set(m4fToLightSpace);
		    this.OPTIMIZED_PROJECTION_MATRIX[index].set(m4fOptimizedProj);
		    return this;
		};

		setSampler(sTexture: string, index: int): UniformOmniShadow {
		    this.SHADOW_SAMPLER[index].TEXTURE = sTexture;
		    return this;
		};

	    ALLOCATE_STORAGE(UniformOmniShadow, 3);
	}

	interface UniformMap {
		omni: UniformOmni[];
        project: UniformProject[];
        omniShadows: UniformOmniShadow[];
        projectShadows: UniformProjectShadow[];
        textures: ITexture[][],
        samplersOmni: IShadowSampler[],
        samplersProject: IShadowSampler[]
	}

	export class DSViewport extends Viewport implements IDSViewport  {
		private _pDefferedColorTextures: ITexture[];
		private _pDeferredDepthTexture: ITexture;
		private _pDeferredView: IRenderableObject = null;
		private _pDeferredSkyTexture: ITexture = null;

		private _pLightingUnifoms: UniformMap = {
	        omni           	: [],
	        project        	: [],
	        omniShadows    	: [],
	        projectShadows 	: [],
	        textures       	: [],
	        samplersOmni  	: [],
	        samplersProject : []
	    };

	    private _pLightPoints: ILightPoint[] = null;

		constructor() {
			super();

			var pEngine: IEngine = this.getTarget().getRenderer().getEngine();
			var pResMgr: IResourcePoolManager = this.getEngine().getResourceManager();
			var pDeferredData: IRenderTarget = new Array(2);
			var pDeferredTextures: ITexture[] = new Array(2);
			var pDepthTexture: ITexture;
			var pDefferedView: IRenderableObject = this._pDeferredView = new render.RenderableObject();
			var iGuid: int = sid();
			var iWidth: uint = math.ceilingPowerOfTwo(this.actualWidth);
    		var iHeight: uint = math.ceilingPowerOfTwo(this.actualHeight);

    		if (info.browser.name === 'Firefox') {
		        iWidth = math.min(iWidth, 1024);
		        iHeight = math.min(iHeight, 1024);
		    }

			pDepthTexture = this._pDeferredDepthTexture = pResMgr.createTexture("deferred-depth-texture-" + iGuid);
			pDepthTexture.create(iWidth, iHeight, 1, 0, 0, 
					ETextureTypes.TEXTURE_2D, EPixelFormats.FLOAT32_DEPTH);

			for (var i = 0; i < 2; ++ i) {
				pDeferredTextures[i] = this._pDefferedColorTextures[i] = 
					pResMgr.createTexture("deferred-color-texture-" + i + "-" +  iGuid);
				pDeferredTextures[i].create(iWidth, iHeight, 1, 0, 0, 
					ETextureTypes.TEXTURE_2D, EPixelFormats.FLOAT32_RGBA);

				pDeferredData[i] = pDeferredTextures[i].getBuffer().getRenderTarget();
				pDeferredData[i].addViewport(this.getCamera(), "deferred_shading_pass_" + i);

				pDeferredData[i].attachDepthTexture(pDepthTexture);
			}

			pResMgr.loadAFXEffect(PREPARE_DEFERRED_SHADING_AFX);
			pResMgr.loadAFXEffect(BASIC_DEFERRED_SHADING_AFX);
			pResMgr.loadAFXEffect(LIGHTS_AND_SHADOWS_DEFERRED_SHADING_AFX);
			pResMgr.loadAFXEffect(SKYBOX_DEFERRED_SHADING_AFX);
			pResMgr.loadAFXEffect(FXAA_DEFERRED_SHADING_AFX);

			var pDSMethod: IRenderMethod  	= pResMgr.createRenderMethod(".deferred_shading");
			var pDSEffect: IEffect 			= pResMgr.createEffect(".deferred_shading");

			// pDSEffect.addCompoennt("akra.system.prepareForDeferredShading");
			pDSEffect.addCompoennt("akra.system.deferredShading");
			pDSEffect.addCompoennt("akra.system.omniLighting");
			pDSEffect.addCompoennt("akra.system.projectLighting");
			pDSEffect.addCompoennt("akra.system.omniShadowsLighting");
			pDSEffect.addCompoennt("akra.system.projectShadowsLighting");
			pDSEffect.addCompoennt("akra.system.skybox", 1);

			pDSMethod.effect = pDSEffect;
			pDefferedView.renderMethod = pDSMethod;

			this.connect(pDefferedView, SIGNAL(passActivated), SLOT(_onPassActivation));
		}

		update (): bool {

			this.prepareShadows();
			this.prepareLighting();

			this._pDeferredView.render();	
		}

		setSkybox(pSkyTexture: ITexture): bool {
			if (pSkyTexture.textureType !== ETextureTypes.TEXTURE_CUBE_MAP) {
				return null;
			}

			this._pDeferredSkyTexture = pSkyTexture;

			return true;
		}

		setFXAA(bValue: bool = true): void {
			var pEffect: IEffect = this._pDeferredView.renderMethod.effect;
			
			if (bValue) {
				pEffect.addComponent("akra.system.fxaa", 2);
			}
			else {
				pEffect.delComponent("akra.system.fxaa", 2);
			}
		}

		protected prepareShadows(): void {
		    var pLights: ILightPoint[] = this.findLightSources();
		    
		    for (var i: int = 0; i < pLights.length; i++) {
		        pLights[i].calculateShadows();
		    }

		    this._pLightPoints = pLights;
		}

		protected prepareLighting(): void {
			for (var i: int = 0; i < 2; ++ i) {
				this._pDefferedColorTextures[i].getBuffer().getRenderTarget().update();
			};
		}

		destroy(): void {
			super.destroy();
			
			this._pDeferredDepthTexture.destroy();

			this._pDefferedColorTextures[0].destroy();
			this._pDefferedColorTextures[1].destroy();

			this._pDeferredView.destroy();
			this._pDeferredView = null;

			this._pDeferredSkyTexture = null;
		}



		_onPassActivation(pRenderable: IRenderableObject, iPass: int): void {
			switch (iPass) {
				case 2:
					var pLightUniforms: UniformMap = this._pLightingUnifoms;
					var pLightPoints: ILightPoint[] = this._pLightPoints;
					var pCamera: ICamera = this.getCamer();

					this.createLightingUniforms(pCamera, pLightPoints, pLightUniforms);

					pRenderable.setState("lights.omni", pLightUniforms.omni.length);
					pRenderable.setState("lights.project", pLightUniforms.project.length);
					pRenderable.setState("lights.omniShadows", pLightUniforms.omniShadows.length);
					pRenderable.setState("lights.projectShadows", pLightUniforms.projectShadows.length);

					pRenderable.setForeign("nOmni", pLightUniforms.omni.length);
				    pRenderable.setForeign("nProject", pLightUniforms.project.length);
				    pRenderable.setForeign("nOmniShadows", pLightUniforms.omniShadows.length);
				    pRenderable.setForeign("nProjectShadows", pLightUniforms.projectShadows.length);

				    pRenderable.setStruct("points_omni", pLightUniforms.omni);
				    pRenderable.setStruct("points_project", pLightUniforms.project);
				    pRenderable.setStruct("points_omni_shadows", pLightUniforms.omniShadows);
				    pRenderable.setStruct("points_project_shadows", pLightUniforms.projectShadows);

				    for (i = 0; i < pLightUniforms.textures.length; i++) {
				        pRenderable.setTextureBySemantics("TEXTURE" + i, pLightUniforms.textures[i]);
				    }

				    pRenderable.setShadowSamplerArray("project_shadow_sampler", pLightUniforms.samplersProject);
    				pRenderable.setShadowSamplerArray("omni_shadow_sampler", pLightUniforms.samplersOmni);

    				pRenderable.setVec2BySemantic("SCREEN_TEXTURE_RATIO",
                                     vec2(pCanvas.width / pDepthTexture.width, pCanvas.height / pDepthTexture.height));
				    
				    pRenderable.setTextureBySemantics("DEFERRED_TEXTURE0", pDeferredTextures[0]);
				    pRenderable.setTextureBySemantics("DEFERRED_TEXTURE1", pDeferredTextures[1]);
				    pRenderable.setTextureBySemantics("SCENE_DEPTH_TEXTURE", pDepthTexture);

					break;
				case 1;
			}
		}

		private inline resetUniforms(): void {
			pUniforms.omni.clear();
		    pUniforms.project.clear();
		    pUniforms.omniShadows.clear();
		    pUniforms.projectShadows.clear();
		    pUniforms.textures.clear();
		    pUniforms.samplersProject.clear();
		    pUniforms.samplersOmni.clear();
		}

		private createLightingUniforms(pCamera: ICamera, pLightPoints: ILightPoint[], pUniforms: UniformMap): void {
			var pLight: ILightPoint;
			var pOmniLight: IOmniLight;
			var pProjectLight: IProjectLight;
		    var i: int, j: int;
		    var pUniformData: IUniform;
		    var pCameraView: IMat4 = pCamera.viewMatrix;

		    var v4fLightPosition: IVec4 = vec4();
		    var v3fLightTransformPosition: IVec3 = vec3();
		    var v4fTemp: IVec4 = vec4();

		    var pShadowCaster: IShadowCaster;
		    var m4fShadow: IMat4, m4fToLightSpace: IMat4;

		    var iLastTextureIndex: int = 0;
		    var sTexture: string = "TEXTURE";

		    this.resetUniforms();

		    for (i = 0; i < pLightPoints.length; i++) {
		        pLight = pLightPoints[i];

		        if (!pLight.isEnabled()) {
		            continue;
		        }
		        
		        v4fLightPosition.set(pLight.worldPosition, 1.);
		        v3fLightTransformPosition.set(pCameraView.multiply(v4fLightPosition, v4fTemp));

		        if (pLight.type === ELightPointTypes.OMNI_DIRECTIONAL) {
		        	
		        	pOmniLight = <IOmniLight>pLight;

		            if (pLight.isShadowCaster()) {
		                pUniformData = uniformOmniShadow();
		                pUniformData.setLightData(pLight.params, v3fLightTransformPosition);
		                
		                var pDepthCube: ITexture[] 					= pOmniLight.getDepthTextureCube();
		                var pShadowCasterCube: IShadowCasterCube 	= pOmniLight.getShadowCaster();
		                var pOptimizedProjCube: IMat4[] 			= pOmniLight.optimizedProjectionCube;
		                
		                for (j = 0; j < 6; ++ j) {
		                    pShadowCaster = pShadowCasterCube[j];
		                    m4fToLightSpace = pShadowCaster.viewMatrix().multiply(pCamera.worldMatrix, mat4());
		                    pUniforms.textures.push(pDepthCube[j]);
		                    sTexture = "TEXTURE" + (pUniforms.textures.length - 1);
		                    
		                    pUniformData.setSampler(sTexture, j);
		                    pUniforms.samplersOmni.push(pUniformData.SHADOW_SAMPLER[j]);
		                    pUniformData.setMatrix(m4fToLightSpace,pOptimizedProjCube[j], j);
		                }

		                pUniforms.omniShadows.push(pUniformData);
		            }
		            else {
		                pUniformData = uniformOmni();
		                pUniformData.setLightData(pLight.params, v3fLightTransformPosition);
		                pUniforms.omni.push(pUniformData);
		            }
		        }
		        else if (pLight.type === ELightPointTypes.PROJECT) {
		        	pProjectLight = <IProjectLight>pLight;

		            if (pLight.isShadowCaster()) {
		                pUniformData = uniformProjectShadow();
		                pUniformData.setLightData(pLight.params, v3fLightTransformPosition);
		                
		                pShadowCaster = pLight.camera;
		                m4fToLightSpace = pShadowCaster.viewMatrix().multiply(pCamera.worldMatrix, mat4());
		                pUniforms.textures.push(pLight.depthTexture);
		                sTexture = "TEXTURE" + (pUniforms.textures.length - 1);

		                pUniformData.setSampler(sTexture);
		                pUniforms.samplersProject.push(pUniformData.SHADOW_SAMPLER);
		                pUniformData.setMatrix(m4fToLightSpace, pShadowCaster.projectionMatrix(), pLight.optimizedProjection);
		                pUniforms.projectShadows.push(pUniformData);
		            }
		            else {
		                pUniformData = uniformProject();
		                pUniformData.setLightData(pLight.params, v3fLightTransformPosition);
		                pShadowCaster = pLight.getShadowCaster();
		                m4fShadow = pShadowCaster.projViewMatrix.multiply(pCamera.worldMatrix, mat4());
		                pUniformData.setMatrix(m4fShadow);
		                pUniforms.project.push(pUniformData);
		            }

		        }
		        else {
		        	CRITICAL("Invalid light point type detected.");
		        }
		    }
		}
	}
}

#endif

