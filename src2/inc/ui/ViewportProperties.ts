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
		protected _pLookAtBtn: IUIButton;

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
			this._pLookAtBtn		= <IUIButton>this.findEntity("lookat");


			this.connect(this._pResolutionCbl, SIGNAL(changed), SLOT(_previewResChanged));
			this.connect(this._pFXAASwh, 	   SIGNAL(changed), SLOT(_fxaaChanged));
			this.connect(this._pScreenshotBtn, SIGNAL(click), SLOT(_screenshot));
			this.connect(this._pFullscreenBtn, SIGNAL(click), SLOT(_fullscreen));
			// this.connect(this._pLookAt, SIGNAL(click), SLOT(_lookat));

			this._previewResChanged(this._pResolutionCbl, this._pResolutionCbl.checked);

			this.setupFileDropping();
		}

		_fullscreen(): void {
			akra.ide.cmd(akra.ECMD.SET_PREVIEW_FULLSCREEN);
		}

		_screenshot(): void {
			ide.cmd(akra.ECMD.SCREENSHOT);
		}

		// _lookat(): void {

		// }

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

			var pCamera: ICamera = pScene.createCamera();
			pCamera.attachToParent(pScene.getRootNode());

			var pLight: IProjectLight = <IProjectLight>pScene.createLightPoint(ELightTypes.PROJECT);
			pLight.attachToParent(pCamera);
			pLight.setInheritance(ENodeInheritance.ALL);
			pLight.params.ambient.set(0.0, 0.0, 0.0, 1);
			pLight.params.diffuse.set(1.);
			pLight.params.specular.set(.1);
			pLight.params.attenuation.set(0.5, 0, 0);


			var pViewport: IDSViewport = <IDSViewport>pGeneralViewport.getTarget().addViewport(new render.DSViewport(pCamera, .7, .05, .25, .25, 100));

			var eSrcBlend: ERenderStateValues = ERenderStateValues.SRCALPHA;
			var eDestBlend: ERenderStateValues = ERenderStateValues.DESTALPHA;

			var pCanvas: webgl.WebGLCanvas = <webgl.WebGLCanvas>pGeneralViewport.getTarget();

			pCanvas.onmousewheel = (pCanvas: ICanvas3d, x: uint, y: uint, fDelta: float) => {
				pGeneralViewport.getCamera().addRelPosition(0., 0., math.sign(-fDelta));
			}

			pGeneralViewport.enableSupportFor3DEvent(E3DEventTypes.DRAGSTART | E3DEventTypes.DRAGSTOP);


			var vWorldPosition: IVec3 = new Vec3;
			var pStartPos: IPoint = {x: 0, y: 0};

			pGeneralViewport.ondragstart = (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void => {
				if (eBtn !== EMouseButton.MIDDLE) {
					return;
				}

				pCanvas.setCursor("move");
				
				vWorldPosition.set(pViewport.getCamera().worldPosition);
				pStartPos.x = x;
				pStartPos.y = y;
			}

			pGeneralViewport.ondragstop = (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void => {
				if (eBtn !== EMouseButton.MIDDLE) {
					return;
				}

				pCanvas.setCursor("auto");
			}

			pGeneralViewport.ondragging = (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void => {
				if (eBtn !== EMouseButton.MIDDLE) {
					return;
				}

				var pCamera: ICamera = pViewport.getCamera();
				var vDiff: IVec3 = vec3(-(x - pStartPos.x), -(y - pStartPos.y), 0.).scale(0.05);
				
				pCamera.setPosition(vWorldPosition.add(pCamera.localOrientation.multiplyVec3(vDiff), vec3()));
			}

			pViewport.bind(SIGNAL(render), (
				pViewport: IViewport, 
				pTechnique: IRenderTechnique, 
				iPass: uint, 
				pRenderable: IRenderableObject, 
				pSceneObject: ISceneObject): void => {

				var pPass: IRenderPass = pTechnique.getPass(iPass);

				if (pTechnique.isLastPass(iPass)) {
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
				E3DEventTypes.MOUSEOUT | E3DEventTypes.DRAGSTART | E3DEventTypes.DRAGSTOP | E3DEventTypes.MOUSEWHEEL);

			pModel.bind(SIGNAL(loaded), (): void => {
				var pModelRoot: IModelEntry = pModel.attachToScene(pScene);


				function syncCubeWithCamera(pGeneralViewport: IViewport): void {
					var pSceneCam: ICamera = pGeneralViewport.getCamera();
					ASSERT (pSceneCam.parent === pSceneCam.root, "only general camera may be used.");
					
					var pCubeCam: ICamera = pViewport.getCamera();


					var vPos: IVec3 = pSceneCam.worldPosition.normalize(vec3()).scale(5.5);
					
					pCubeCam.setPosition(vPos);
					pCubeCam.lookAt(vec3(0.), pSceneCam.localOrientation.multiplyVec3(vec3(0., 1., 0.)));
				}

				pGeneralViewport.bind(SIGNAL(viewportCameraChanged), syncCubeWithCamera);

				syncCubeWithCamera(pGeneralViewport);

				var pCubeModel: ISceneModel = <ISceneModel>pModelRoot.child;
				var pMesh: IMesh = pCubeModel.mesh;

				var pStartPos: IPoint = {x: 0, y: 0};
				var pCenterPoint: IVec3 = new Vec3(0.);
				var bDragStarted: bool = false;

				var vWorldPosition: IVec3 = new Vec3;
				var vLocalPosition: IVec3 = new Vec3;
				var qLocalOrientation: IQuat4 = new Quat4;



				pCubeModel.ondragstart = (pObject: ISceneObject, pViewport: IDSViewport, pRenderable: IRenderableObject, x: uint, y: uint) => {
					var pCamera: ICamera = pGeneralViewport.getCamera();
					
					pStartPos.x = x;
					pStartPos.y = y;

					bDragStarted = true;
					pViewport.highlight(pCubeModel, null);	

					pCanvas.hideCursor();

					// pGeneralViewport.unprojectPoint(
					// 	pGeneralViewport.actualWidth / 2., 
					// 	pGeneralViewport.actualHeight / 2., pCenterPoint);
					pCenterPoint.set(0.);

					vWorldPosition.set(pCamera.worldPosition);
					vLocalPosition.set(pCamera.localPosition);
					qLocalOrientation.set(pCamera.localOrientation);
				}

				pCubeModel.ondragstop = <any>(pObject: ISceneObject, pViewport: IDSViewport, pRenderable: IRenderableObject, x: uint, y: uint) => {
					bDragStarted = false;
					(<webgl.WebGLCanvas>pViewport.getTarget()).hideCursor(false);

					eSrcBlend = ERenderStateValues.SRCALPHA;
					eDestBlend = ERenderStateValues.DESTALPHA;
					pViewport.highlight(null, null);
					pViewport.touch();
				}

				function orbitRotation(pNode: INode, v3fCenter, v3fFrom: IVec3, fPitchRotation, fYawRotation, bLookAt: bool = true): void {
					var qPitchRot: IQuat4;
					var qYawRot: IQuat4;

					if (isNull(v3fFrom)) {
						v3fFrom = pNode.worldPosition;
					}

					var v3fDistance: IVec3;

					var pNodeWorldData: Float32Array = pNode.worldMatrix.data;
				    var v3fNodeDir: IVec3 = vec3(-pNodeWorldData[__13], 0., -pNodeWorldData[__33]).normalize();
				    var v3fNodeOrtho: IVec3 = vec3(v3fNodeDir.z, 0., -v3fNodeDir.x);

				    //rotation around X-axis
				    qPitchRot = Quat4.fromAxisAngle(v3fNodeOrtho, fPitchRotation, quat4());

				    v3fDistance = v3fFrom.subtract(v3fCenter, vec3());
				    pNode.localPosition = qPitchRot.multiplyVec3(v3fDistance, vec3()).add(v3fCenter);
				    pNode.update();

				    //rotate around Y-axis
				    qYawRot = Quat4.fromYawPitchRoll(fYawRotation, 0., 0., quat4());
				   
				    v3fDistance = pNode.worldPosition.subtract(v3fCenter, vec3());
				    pNode.localPosition = qYawRot.multiplyVec3(v3fDistance, vec3()).add(v3fCenter);
				    pNode.update();

				    //look ata target
				    if (bLookAt && 0) {
				    	
				    	var vUp: IVec3 = pNode.localOrientation.multiplyVec3(vec3(0., 1., 0.));

				    	pNode.lookAt(v3fCenter, vUp);
				    }
				}

				function orbitRotation2(pNode: INode, vCenter, vFrom: IVec3, fX, fY, bLookAt: bool = true): void {
					if (isNull(vFrom)) {
						vFrom = pNode.worldPosition;
					}

					var qOrient: IQuat4;

					qOrient = Quat4.fromYawPitchRoll(fY, 0., 0., quat4());					
					
					pNode.setPosition(qOrient.multiplyVec3(vWorldPosition, vec3()));
		    		pNode.setRotation(qOrient.multiply(qLocalOrientation, quat4()));

		    		qOrient = Quat4.fromAxisAngle(pNode.localOrientation.multiplyVec3(vec3(1., 0., 0.)), -fX);
					
					pNode.setPosition(qOrient.multiplyVec3(pNode.localPosition, vec3()));
		    		pNode.setRotation(qOrient.multiply(pNode.localOrientation, quat4()));
				}

				pCubeModel.ondragging = <any>(pObject: ISceneObject, pViewport: IDSViewport, pRenderable: IRenderableObject, x: uint, y: uint) => {

					var pCamera: ICamera = pGeneralViewport.getCamera();
					var fdX: float = (x - pStartPos.x) / 100;
					var fdY: float = (y - pStartPos.y) / 100;

					orbitRotation2(pCamera, pCenterPoint, vWorldPosition, -fdY, -fdX);

					syncCubeWithCamera(pGeneralViewport);
				}

				function softAlignTo(vDir: IVec3, vUp: IVec3): void {
					var pCamera: ICamera = pGeneralViewport.getCamera();
					var qDest: IQuat4 = Quat4.fromForwardUp(vDir, vUp, quat4());
				 	var qSrc: IQuat4 = Quat4.fromForwardUp(pCamera.worldPosition.normalize(), 
				 		pCamera.localOrientation.multiplyVec3(vec3(0., 1., 0.), vec3()), quat4());
				 	var fDelta: float = 0.0;
				 	
				 	var i = setInterval(() => {
				 		if (fDelta >= 1.) {
				 			clearInterval(i);
				 			return;
				 		}

				 		fDelta = 1.0;

				 		var q = qDest;
				 		//qSrc.smix(qDest, fDelta, quat4());
				 		
				 		var vDistance: IVec3 = pCamera.worldPosition.subtract(pCenterPoint, vec3());
					    pCamera.localPosition = q.multiplyVec3(vDistance, vec3()).add(pCenterPoint);
				 		pCamera.lookAt(pCenterPoint, vUp);
						pCamera.update();

				 		fDelta += 0.05;

				 		syncCubeWithCamera(pGeneralViewport);
				 	}, 18);
				}

				function alignTo(vDir: IVec3, vUp: IVec3): void {

				 	var pCamera: ICamera = pGeneralViewport.getCamera();
					var fDist: float = pCamera.worldPosition.length();

					pCamera.setPosition(vDir.normalize().scale(fDist));
					pCamera.lookAt(pCenterPoint, vUp);
					pCamera.update();



					syncCubeWithCamera(pGeneralViewport);
				}

				for (var i = 0; i < pMesh.length; ++ i) {
					var pSubset: IMeshSubset = pMesh.getSubset(i);

					pSubset.onmouseover = (pRenderable: IRenderableObject, pViewport: IDSViewport, pObject: ISceneObject) => {
						pViewport.highlight(pCubeModel, bDragStarted? null: pRenderable);	
						eSrcBlend = ERenderStateValues.ONE;
						eDestBlend = ERenderStateValues.INVSRCALPHA;
					}

					pSubset.onmouseout = (pRenderable: IRenderableObject, pViewport: IDSViewport, pObject: ISceneObject) => {
						if (bDragStarted) {
							pViewport.highlight(pCubeModel, null);	
							eSrcBlend = ERenderStateValues.ONE;
							eDestBlend = ERenderStateValues.INVSRCALPHA;
						}
						else {
							pViewport.highlight(null, null);
							eSrcBlend = ERenderStateValues.SRCALPHA;
							eDestBlend = ERenderStateValues.DESTALPHA;
						}
					}

					pSubset.onclick = <any>(pSubset: IMeshSubset) => {
						// var pCamera: ICamera = pGeneralViewport.getCamera();
						// var v3fRotation: IVec3 = pCamera.localOrientation.toYawPitchRoll(vec3());
						// var alignTo = softAlignTo;
						switch (pSubset.name) {
							case "submesh-0": 
								alignTo(vec3(0., -1., 0.), vec3(0., 0., 1.));
								console.log("bottom"); 
								break;
							case "submesh-1": 
								alignTo(vec3(1., 0., 0.), vec3(0., 1., 0.));
								console.log("right"); 
								break;
							case "submesh-2": 
								console.log("left"); 
								alignTo(vec3(-1., 0., 0.), vec3(0., 1., 0.));
								break;
							case "submesh-3": 
								console.log("top"); 
								alignTo(vec3(0., 1., 0.), vec3(0., 0., -1.));
								break;
							case "submesh-4": 
								console.log("front"); 
								alignTo(vec3(0., 0., 1.), vec3(0., 1., 0.));
								break;

							case "submesh-5": 
								alignTo(vec3(0., 0., -1.), vec3(0., 1., 0.));
								console.log("back"); 
								break;
						}

						// syncCubeWithCamera(pGeneralViewport);
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

