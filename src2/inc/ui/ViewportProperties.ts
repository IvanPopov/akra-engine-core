#ifndef UIVIEWPORTPROPERTIES_TS
#define UIVIEWPORTPROPERTIES_TS

#include "Component.ts"
#include "IUILabel.ts"
#include "IUIButton.ts"
#include "IUISwitch.ts"
#include "IViewport.ts"
#include "IUICheckboxList.ts"
#include "IUIRenderTargetStats.ts"
#include "render/DSViewport.ts"

module akra.ui {


	export class ViewportProperties extends Component {
		protected _pViewport: IViewport = null;
		protected _pStats: IUIRenderTargetStats;
		protected _pFullscreenBtn: IUIButton;
		protected _pResolutionCbl: IUICheckboxList;
		protected _pFXAASwh: IUISwitch;
		protected _pSkyboxLb: IUILabel;
		protected _pScreenshotBtn: IUIButton;

		inline get viewport(): IViewport {
			return this._pViewport;
		}

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("ViewportProperties.tpl");

			this._pStats 			= <IUIRenderTargetStats>this.findEntity("stats");
			this._pFullscreenBtn 	= <IUIButton>this.findEntity("fullscreen");
			this._pFXAASwh 			= <IUISwitch>this.findEntity("FXAA");
			this._pResolutionCbl 	= <IUICheckboxList>this.findEntity("resolution-list");
			this._pSkyboxLb 		= <IUILabel>this.findEntity("skybox");
			this._pScreenshotBtn 	= <IUIButton>this.findEntity("screenshot");


			this.connect(this._pResolutionCbl, SIGNAL(changed), SLOT(_previewResChanged));
			this.connect(this._pFXAASwh, 	   SIGNAL(changed), SLOT(_fxaaChanged));
			this.connect(this._pScreenshotBtn, SIGNAL(click), SLOT(_screenshot));
			this.connect(this._pFullscreenBtn, SIGNAL(click), SLOT(_fullscreen));

			this._previewResChanged(this._pResolutionCbl, this._pResolutionCbl.checked);

			this.setupFileDropping();
		}

		_fullscreen(): void {
			akra.ide.cmd(akra.ECMD.SET_PREVIEW_FULLSCREEN);
		}

		_screenshot(): void {
			ide.cmd(akra.ECMD.SCREENSHOT);
		}

		private setupFileDropping(): void {
			var pViewportProperties = this;
			var pRmgr: IResourcePoolManager = ide.getResourceManager();
			var pSkyboxLb: IUILabel = this._pSkyboxLb;
			var $el = pSkyboxLb.el.find(".label-text:first");

			io.createFileDropArea(null, {
				drop: (file: File, content, format, e: DragEvent): void => {
					pSkyboxLb.el.removeClass("file-drag-over");

					var pName: IPathinfo = path.info(file.name);

				    pSkyboxLb.text = pName.toString();
 					
 					var sName: string = ".skybox - " + pName.toString();
 					var pSkyBoxTexture: ITexture = <ITexture>pRmgr.texturePool.findResource(sName);

				    if (!pSkyBoxTexture) {

					    var pSkyboxImage = pRmgr.createImg(sName);
				    	var pSkyBoxTexture = pRmgr.createTexture(sName);


						pSkyboxImage.load(new Uint8Array(content));
			    		pSkyBoxTexture.loadImage(pSkyboxImage);
		    		}

		    		if (pViewportProperties.getViewport().type === EViewportTypes.DSVIEWPORT) {
						(<render.DSViewport>(pViewportProperties.getViewport())).setSkybox(pSkyBoxTexture);
					}	
		    	},

		    	verify: (file: File, e: DragEvent): bool => {
		    		if (e.target !== $el[0] && e.target !== pViewportProperties.getCanvasElement()) {
						return false;
					}

					var pName: IPathinfo = path.info(file.name);

				    if (pName.ext.toUpperCase() !== "DDS") {
				    	alert("unsupported format used: " + file.name);
				    	return false;
				    }

					return true;
		    	},
		    	// dragenter: (e) => {
		    	// 	pSkyboxLb.el.addClass("file-drag-over");
		    	// },

		    	dragover: (e) => {
		    		pSkyboxLb.el.addClass("file-drag-over");
		    	},

		    	dragleave: (e) => {
		    		pSkyboxLb.el.removeClass("file-drag-over");
		    	},

		    	format: EFileDataTypes.ARRAY_BUFFER
			});
		}

		_fxaaChanged(pSw: IUISwitch, bValue: bool): void {
			ide.cmd(akra.ECMD.CHANGE_AA, bValue);
		}

		_previewResChanged(pCbl: IUICheckboxList, pCb: IUICheckbox): void {
			if (pCb.checked) {
				switch (pCb.name) {
					case "r800":
						ide.cmd(akra.ECMD.SET_PREVIEW_RESOLUTION, 800, 600);
						return;
					case "r640":
						ide.cmd(akra.ECMD.SET_PREVIEW_RESOLUTION, 640, 480);
						return;
					case "r320":
						ide.cmd(akra.ECMD.SET_PREVIEW_RESOLUTION, 320, 240);
						return;
				}
			}
		}

		setViewport(pViewport: IViewport): void {
			debug_assert(isNull(this._pViewport), "viewport cannot be changed");

			this._pViewport = pViewport;

			this.el.find("div[name=preview]").append(this.getCanvasElement());

			var pStats: IUIRenderTargetStats = this._pStats;
			pStats.target = pViewport.getTarget();

			ide.cmd(akra.ECMD.CHANGE_AA, this._pFXAASwh.value);

			if (pViewport.type === EViewportTypes.DSVIEWPORT) {
				if ((<IDSViewport>pViewport).getSkybox()) {
					this._pSkyboxLb.text = (<IDSViewport>pViewport).getSkybox().findResourceName();
				}
			}

			this.connect(pViewport, SIGNAL(addedSkybox), SLOT(_addedSkybox));

			this.setup(pViewport);
		}


		protected setup(pGeneralViewport: IViewport): void {

			var pSceneMgr: ISceneManager = this.getEngine().getSceneManager();
			var pScene: IScene3d = pSceneMgr.createScene3D(".3d-box");

			// var pBasis: ISceneModel = util.basis(pScene);
			// pBasis.attachToParent(pScene.getRootNode());
			// pBasis.scale(5.);

			var pRmgr: IResourcePoolManager = this.getEngine().getResourceManager();
			var pModel: ICollada = <ICollada>pRmgr.colladaPool.loadResource(DATA + "/models/ocube/cube.DAE");
			var pLight: IProjectLight = <IProjectLight>pScene.createLightPoint(ELightTypes.PROJECT);

			pLight.attachToParent(pScene.getRootNode());
			pLight.setPosition(0., 0, 100.);
			pLight.lookAt(vec3(0.));

			pLight.params.ambient.set(0.0, 0.0, 0.0, 1);
			pLight.params.diffuse.set(1.);
			pLight.params.specular.set(.1);
			pLight.params.attenuation.set(0.5, 0, 0);


			var pCamera: ICamera = pScene.createCamera();

			pCamera.attachToParent(pScene.getRootNode());
			pCamera.setPosition(0., 0, 5.5);
			pCamera.lookAt(vec3(0.));

			var pViewport: IDSViewport = <IDSViewport>pGeneralViewport.getTarget().addViewport(new render.DSViewport(pCamera, .7, .05, .25, .25, 100));

			pViewport.setFXAA(true);

			var eSrcBlend: ERenderStateValues = ERenderStateValues.SRCALPHA;
			var eDestBlend: ERenderStateValues = ERenderStateValues.DESTALPHA;

			pViewport.bind(SIGNAL(render), (
				pViewport: IViewport, 
				pTechnique: IRenderTechnique, 
				iPass: uint, 
				pRenderable: IRenderableObject, 
				pSceneObject: ISceneObject): void => {

				var pPass: IRenderPass = pTechnique.getPass(iPass);

				if(pTechnique.isLastPass(iPass)){
					pPass.setRenderState(ERenderStates.ZENABLE, ERenderStateValues.FALSE);
					pPass.setRenderState(ERenderStates.BLENDENABLE, ERenderStateValues.TRUE);

					// pPass.setRenderState(ERenderStates.SRCBLEND, ERenderStateValues.ONE);
					// pPass.setRenderState(ERenderStates.DESTBLEND, ERenderStateValues.INVSRCALPHA);

					pPass.setRenderState(ERenderStates.SRCBLEND, eSrcBlend);
     				pPass.setRenderState(ERenderStates.DESTBLEND, eDestBlend);
				}
			});
			
			pViewport.enableSupportFor3DEvent(
				E3DEventTypes.CLICK | E3DEventTypes.MOUSEOVER | 
				E3DEventTypes.MOUSEOUT | E3DEventTypes.MOUSEDOWN | E3DEventTypes.MOUSEUP);

			pModel.bind(SIGNAL(loaded), (): void => {
				var pModelRoot: IModelEntry = pModel.attachToScene(pScene);

				// pScene.bind(SIGNAL(beforeUpdate), () => { 
				// 	pModelRoot.addRelRotationByXYZAxis(0.01, 0.01, 0.); 
				// });

				var fnSyncCubeWithCamera = (pViewport: IViewport) => {
					pModelRoot.setRotation(pViewport.getCamera().localOrientation.conjugate(quat4()));
				}

				pGeneralViewport.bind(SIGNAL(viewportCameraChanged), fnSyncCubeWithCamera);

				fnSyncCubeWithCamera(pGeneralViewport);

				var pCubeModel: ISceneModel = <ISceneModel>pModelRoot.child;
				var pMesh: IMesh = pCubeModel.mesh;

				var bDrag: bool = false;
				var bSkipClick: bool = false;
				var pStartPos: IPoint = {x: 0, y: 0};
				var pStartAngle: IQuat4 = new Quat4;

				pCubeModel.onmouseover = pCubeModel.onmouseout = pCubeModel.onmouseup = <any>() => {
					bDrag = false;
					bSkipClick = false;
				}

				pCubeModel.onmousedown = (pObject: ISceneObject, pViewport: IDSViewport, pRenderable: IRenderableObject, x: uint, y: uint) => {
					bDrag = true;
					pStartPos.x = x;
					pStartPos.y = y;

					var pCamera: ICamera = pGeneralViewport.getCamera();

					pStartAngle.set(pCamera.localOrientation);
				}

				pCubeModel.onmousemove = <any>(pObject: ISceneObject, pViewport: IDSViewport, pRenderable: IRenderableObject, x: uint, y: uint) => {
					if (bDrag) {
						bSkipClick = true;
						
						var fdX = (x - pStartPos.x) / pViewport.actualWidth / 10.;
						var fdY = (y - pStartPos.y) / pViewport.actualHeight / 10.;

						var pCamera: ICamera = pGeneralViewport.getCamera();
						pCamera.addRelRotationByEulerAngles(-fdX, -fdY, 0);

						fnSyncCubeWithCamera(pGeneralViewport);
					}
				}

				for (var i = 0; i < pMesh.length; ++ i) {
					var pSubset: IMeshSubset = pMesh.getSubset(i);

					pSubset.onmouseover = (pRenderable: IRenderableObject, pViewport: IDSViewport, pObject: ISceneObject) => {
						pViewport.highlight(pObject, pRenderable);	
						eSrcBlend = ERenderStateValues.ONE;
						eDestBlend = ERenderStateValues.INVSRCALPHA;
					}

					pSubset.onmouseout = (pRenderable: IRenderableObject, pViewport: IDSViewport, pObject: ISceneObject) => {
						pViewport.highlight(null, null);	
						eSrcBlend = ERenderStateValues.SRCALPHA;
						eDestBlend = ERenderStateValues.DESTALPHA;
					}

					pSubset.onclick = <any>(pSubset: IMeshSubset) => {
						if (bSkipClick) {
							return;
						}

						var pCamera: ICamera = pGeneralViewport.getCamera();
						var v3fRotation: IVec3 = pCamera.localOrientation.toYawPitchRoll(vec3());


						switch (pSubset.name) {
							case "submesh-0": 
								pCamera.setRotationByXYZAxis(-math.PI / 2, 0, 0);
								console.log("bottom"); 
								break;
							case "submesh-1": 
								pCamera.setRotationByXYZAxis(0, math.PI / 2, 0);
								console.log("right"); 
								break;
							case "submesh-2": 
								console.log("left"); 
								pCamera.setRotationByXYZAxis(0, -math.PI / 2, 0);
								break;
							case "submesh-3": 
								console.log("top"); 
								pCamera.setRotationByXYZAxis(math.PI / 2, 0, 0);
								break;
							case "submesh-4": 
								pCamera.setRotationByXYZAxis(0, 0, 0);
								console.log("front"); 
								break;

							case "submesh-5": 
								pCamera.setRotationByXYZAxis(0, math.PI, 0);
								console.log("back"); 
								break;
						}

						fnSyncCubeWithCamera(pGeneralViewport);
					}

					pSubset.onmousedown = <any>() => {
						console.log("mousedown");
					}

					pSubset.onmouseup = <any>() => {
						console.log("mouseup");
					}
				}
			});
						
		}

		_addedSkybox(pViewport: IViewport, pSkyTexture: ITexture): void {
			this._pSkyboxLb.text = pSkyTexture.findResourceName();
		}

		inline getRenderer(): IRenderer { return this._pViewport.getTarget().getRenderer(); }
		inline getEngine(): IEngine { return this.getRenderer().getEngine(); }
		inline getComposer(): IAFXComposer { return this.getEngine().getComposer(); }
		inline getCanvas(): ICanvas3d { return this.getRenderer().getDefaultCanvas(); }
		inline getCanvasElement(): HTMLCanvasElement { return (<any>this.getCanvas())._pCanvas; }
		inline getViewport(): IViewport { return this._pViewport; }

		rendered(): void {
			super.rendered();
			this.el.addClass("component-viewportproperties");
		}
	}

	register("ViewportProperties", ViewportProperties);
}

#endif

