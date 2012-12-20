#ifndef DSBUILD_TS
#define DSBUILD_TS

#define PREPARE_DEFERRED_SHADING_AFX 			"prepare_deferred_shading.afx"
#define BASIC_DEFERRED_SHADING_AFX 				"base_deferred_shading.afx"
#define LIGHTS_AND_SHADOWS_DEFERRED_SHADING_AFX "lights_and_shadows_deferred_shading.afx"

#define uniformOmni() UniformOmni.stackCeil
#define IShadowSampler ISampler2d

module akra.build {

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

	export class DeferredBuild extends BuildScenario implements ISceneBuilder {

		private _pCamera: ICamera = null;
		private _pDeferredView: IRenderableObject = null;
		private _pLightPoints: ILightPoint[] = null;
		private _pLightingUnifoms: UniformMap = {
	        omni           	: [],
	        project        	: [],
	        omniShadows    	: [],
	        projectShadows 	: [],
	        textures       	: [],
	        samplersOmni  	: [],
	        samplersProject : []
	    };

		create(): bool {
			if (!super.create()) {
				return false;
			}

			var pDefferedView: IRenderableObject = this._pDeferredView = new render.RenderableObject();
			var pResMgr: IResourcePoolManager = this.getEngine().getResourceManager();

			pResMgr.loadAFXEffect(PREPARE_DEFERRED_SHADING_AFX);
			pResMgr.loadAFXEffect(BASIC_DEFERRED_SHADING_AFX);
			pResMgr.loadAFXEffect(LIGHTS_AND_SHADOWS_DEFERRED_SHADING_AFX);

			var pAssembleMethod: IRenderMethod  = pResMgr.createRenderMethod(".deferred_shading");
			var pAssembleEffect: IEffect 		= pResMgr.createEffect(".deferred_shading");


			pAssembleEffect.addCompoennt("akra.system.deferredShading");
			pAssembleEffect.addCompoennt("akra.system.omniLighting");
			pAssembleEffect.addCompoennt("akra.system.projectLighting");
			pAssembleEffect.addCompoennt("akra.system.omniShadowsLighting");
			pAssembleEffect.addCompoennt("akra.system.projectShadowsLighting");

			pAssembleMethod.effect = pAssembleEffect;
			pDefferedView.renderMethod = pAssembleMethod;

			this.connect(pDefferedView, SIGNAL(passActivated), SLOT(_onPassActivation));

			return true;
		}

		destroy(): void {
			super.destroy();
			this._pDeferredView.destroy();
			this._pDeferredView = null;
		}

		build(pCamera: ICamera, pViewport: IViewport): bool {
			this.prepareShadows(pCamera);
			this.prepareLighting(pCamera);
			this.assemble(pCamera);
		}

		prepareShadows(pCamera: ICamera): void {
		    var pLights: ILightPoint[] = this.findLightSources(pCamera);
		    for (var i: int = 0; i < pLights.length; i++) {
		        pLights[i].calculateShadows();
		    }

		    this._pLightPoints = pLights;
		}

		prepareLighting(pCamera: ICamera): void {
			var pVisibleObjects: ISceneObject[] = this.findVisibleObjects(pCamera);
			var pRenderable: IRenderableObject;

			for (var i: int = 0; i < pVisibleObjects.length; ++ i) {
				pRenderable = pVisibleObjects[i].getRenderable();

				if (pRenderable.switchRenderMethod(PREPARE_DEFERRED_RENDER_METHOD)) {
					pRenderable.render();
				}
			}

		}

		assemble(pCamera: ICamera): void {
			this._pCamera = pCamera;
			this._pDeferredView.render();
		}

		_onPassActivation(pRenderable: IRenderableObject, iPass: int): void {
			switch (iPass) {
				case 0:
					this.createLightingUniforms(this._pCamera, this._pLightPoints, this._pLightingUnifoms);
					break;
				case 1;
			}
		}

		private createLightingUniforms(pCamera: ICamera, pLightPoints: ILightPoint[], pUniforms: UniformMap): void {
			var pLight: ILightPoint;
		    var i: int, j: int;
		    var pUniformData: IUniform;
		    var pCameraView: IMat4 = pCamera.viewMatrix;

		    var v4fLightPosition: IVec4 = vec4();
		    var v3fLightTransformPosition: IVec3 = vec3();
		    var v4fTemp: IVec4 = vec4();

		    var pLightCamera;
		    var m4fShadow, m4fToLightSpace;

		    var iLastTextureIndex = 0;
		    var sTexture = "TEXTURE";

		    pUniforms.omni.length = 0;
		    pUniforms.project.length = 0;
		    pUniforms.omniShadows.length = 0;
		    pUniforms.projectShadows.length = 0;
		    pUniforms.textures.length = 0;
		    pUniforms.samplers_project.length = 0;
		    pUniforms.samplers_omni.length = 0;

		    for (i = 0; i < pLightPoints.length; i++) {
		        pLight = pLightPoints[i];
		        if (!pLight.isActive) {
		            continue;
		        }
		        v4fLightPosition.set(pLight.worldPosition(), 1.);
		        v3fLightTransformPosition.set(pCameraView.multiply(v4fLightPosition, v4fTemp));
		        if (pLight.isOmnidirectional) {
		            if (pLight._haveShadows) {
		                pUniformData = a.UniformOmniShadow();
		                pUniformData.setLightData(pLight.lightParameters, v3fLightTransformPosition);
		                var pDepthCube = pLight.depthTextureCube;
		                var pCameraCube = pLight.cameraCube;
		                var pOptimizedProjCube = pLight.optimizedProjectionCube;
		                for (j = 0; j < 6; j++) {
		                    pLightCamera = pCameraCube[j];
		                    m4fToLightSpace = pLightCamera.viewMatrix().multiply(pCamera.worldMatrix(), Mat4());
		                    pUniforms.textures.push(pDepthCube[j]);
		                    sTexture = "TEXTURE" + (pUniforms.textures.length - 1);
		                    pUniformData.setSampler(sTexture, j);
		                    pUniforms.samplers_omni.push(pUniformData.SHADOW_SAMPLER[j]);
		                    pUniformData.setMatrix(m4fToLightSpace,pOptimizedProjCube[j], j);
		                }
		                pUniforms.omniShadows.push(pUniformData);
		            }
		            else {
		                pUniformData = a.UniformOmni();
		                pUniformData.setLightData(pLight.lightParameters, v3fLightTransformPosition);
		                pUniforms.omni.push(pUniformData);
		            }
		        }
		        else {
		            if (pLight._haveShadows) {
		                pUniformData = a.UniformProjectShadow();
		                pUniformData.setLightData(pLight.lightParameters, v3fLightTransformPosition);
		                pLightCamera = pLight.camera;
		                m4fToLightSpace = pLightCamera.viewMatrix().multiply(pCamera.worldMatrix(), Mat4());
		                pUniforms.textures.push(pLight.depthTexture);
		                sTexture = "TEXTURE" + (pUniforms.textures.length - 1);
		                pUniformData.setSampler(sTexture);
		                pUniforms.samplers_project.push(pUniformData.SHADOW_SAMPLER);
		                pUniformData.setMatrix(m4fToLightSpace, pLightCamera.projectionMatrix(), pLight.optimizedProjection);
		                pUniforms.projectShadows.push(pUniformData);
		            }
		            else {
		                pUniformData = a.UniformProject();
		                pUniformData.setLightData(pLight.lightParameters, v3fLightTransformPosition);
		                pLightCamera = pLight.camera;
		                m4fShadow = pLightCamera.projViewMatrix().multiply(pCamera.worldMatrix(), Mat4());
		                pUniformData.setMatrix(m4fShadow);
		                pUniforms.project.push(pUniformData);
		            }
		        }
		    }
		}
	}
}

#endif

