#ifndef UTILNAVIGATION_TS
#define UTILNAVIGATION_TS

module akra.util {
	export function navigation(pGeneralViewport: IViewport): void {
		var pCanvas: webgl.WebGLCanvas = <webgl.WebGLCanvas>pGeneralViewport.getTarget();
		var pEngine: IEngine = pCanvas.getRenderer().getEngine();
		var pSceneMgr: ISceneManager = pEngine.getSceneManager();
		var pScene: IScene3d = pSceneMgr.createScene3D(".3d-box");
		var pGeneralScene: IScene3d = pEngine.getScene();
		var pRmgr: IResourcePoolManager = pEngine.getResourceManager();

		//scene with cube backend
		var pModel: ICollada = <ICollada>pRmgr.loadModel(DATA + "/models/ocube/cube.DAE", {shadows: false});

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
		
		//detection of center point

		var pPlaneXZ: IPlane3d = new geometry.Plane3d(vec3(1., 0., 0.), vec3(0.), vec3(0., 0., 1.));
		var pCameraDir: IRay3d = new geometry.Ray3d;

		function detectCenterPoint(pGeneralViewport: IViewport): IVec3 {
			var vDest: IVec3 = vec3(0.);
			var fDistXY: float;
			var fUnprojDist: float;
			var pCamera: ICamera = pGeneralViewport.getCamera();

			if (ide && ide.selectedObject) {
				vDest.set(ide.selectedObject.worldPosition);
				return vDest;
			}

			pGeneralViewport.unprojectPoint(
				pGeneralViewport.actualWidth / 2., 
				pGeneralViewport.actualHeight / 2., vDest);

			fUnprojDist = vDest.subtract(pCamera.worldPosition, vec3()).length();
			
			if (fUnprojDist >= pCamera.farPlane) {

				pCameraDir.point = pCamera.worldPosition;
				pCameraDir.normal = pCamera.localOrientation.multiplyVec3(vec3(0., 0., -1.0));

				if (!pPlaneXZ.intersectRay3d(pCameraDir, vDest)) {
					vDest.set(pCameraDir.normal.scale(10., vec3()).add(pCameraDir.point));
				}
			}
			
			return vDest;
		}

		function detectSpeedRation(pGeneralViewport: IViewport): float {
			var pCamera: ICamera = pGeneralViewport.getCamera();
			var fLength: float = detectCenterPoint(pGeneralViewport).subtract(pCamera.worldPosition).length();
			var fSpeedRation: float = detectCenterPoint(pGeneralViewport).subtract(pCamera.worldPosition).length() / 5.;
			return fSpeedRation;
		}

		//zoom backend
		pCanvas.onmousewheel = (pCanvas: ICanvas3d, x: uint, y: uint, fDelta: float) => {
			pGeneralViewport.getCamera().addRelPosition(0., 0., math.sign(-fDelta) * detectSpeedRation(pGeneralViewport));
		}

		//movemenet backend!
		pGeneralViewport.enableSupportFor3DEvent(E3DEventTypes.DRAGSTART | E3DEventTypes.DRAGSTOP);

		var vWorldPosition: IVec3 = new Vec3;
		var pStartPos: IPoint = {x: 0, y: 0};
		var fDragSpeedRatio: float = 1.;

		pGeneralViewport.ondragstart = (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void => {
			if (eBtn !== EMouseButton.MIDDLE) {
				return;
			}

			pCanvas.setCursor("move");
			
			vWorldPosition.set(pViewport.getCamera().worldPosition);
			pStartPos.x = x;
			pStartPos.y = y;
			fDragSpeedRatio = detectSpeedRation(pGeneralViewport);
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
			var vDiff: IVec3 = vec3(-(x - pStartPos.x), -(y - pStartPos.y), 0.).scale(0.05 * fDragSpeedRatio);
			
			pCamera.setPosition(vWorldPosition.add(pCamera.localOrientation.multiplyVec3(vDiff), vec3()));
		}

		//cube alpha 
		var eSrcBlend: ERenderStateValues = ERenderStateValues.SRCALPHA;
		var eDestBlend: ERenderStateValues = ERenderStateValues.DESTALPHA;

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

				pPass.setRenderState(ERenderStates.SRCBLEND, eSrcBlend);
 				pPass.setRenderState(ERenderStates.DESTBLEND, eDestBlend);
			}
		});

		pViewport.enableSupportFor3DEvent(
			E3DEventTypes.CLICK | E3DEventTypes.MOUSEOVER | 
			E3DEventTypes.MOUSEOUT | E3DEventTypes.DRAGSTART | E3DEventTypes.DRAGSTOP | E3DEventTypes.MOUSEWHEEL);

		//cube scene synchronization backend

		function syncCubeWithCamera(pGeneralViewport: IViewport, pViewport: IViewport, pCenterPoint): void {
			var pSceneCam: ICamera = pGeneralViewport.getCamera();
			ASSERT (pSceneCam.parent === pSceneCam.root, "only general camera may be used.");
			
			var pCubeCam: ICamera = pViewport.getCamera();
			var vPos: IVec3 = pSceneCam.worldPosition.subtract(pCenterPoint, vec3()).normalize().scale(5.5);
			
			pCubeCam.setPosition(vPos);
			pCubeCam.lookAt(vec3(0.), pSceneCam.localOrientation.multiplyVec3(vec3(0., 1., 0.)));
		}

		pModel.bind(SIGNAL(loaded), (): void => {
			var pModelRoot: IModelEntry = pModel.attachToScene(pScene);

			var pCubeModel: ISceneModel = <ISceneModel>pModelRoot.child;
			var pMesh: IMesh = pCubeModel.mesh;

			var pStartPos: IPoint = {x: 0, y: 0};
			var pCenterPoint: IVec3 = new Vec3(0.);
			var bDragStarted: bool = false;

			var vWorldPosition: IVec3 = new Vec3;
			var vLocalPosition: IVec3 = new Vec3;
			var qLocalOrientation: IQuat4 = new Quat4;
			
			

			pGeneralViewport.bind(SIGNAL(viewportCameraChanged), () => {
				syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint)
			});

			syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint);


			pCubeModel.ondragstart = (pObject: ISceneObject, pViewport: IDSViewport, pRenderable: IRenderableObject, x: uint, y: uint) => {
				var pCamera: ICamera = pGeneralViewport.getCamera();
				
				pStartPos.x = x;
				pStartPos.y = y;

				bDragStarted = true;
				pViewport.highlight(pCubeModel, null);	

				pCanvas.hideCursor();

				pCenterPoint.set(detectCenterPoint(pGeneralViewport));
				

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


			function orbitRotation2(pNode: INode, vCenter, vFrom: IVec3, fX, fY, bLookAt: bool = true): void {
				if (isNull(vFrom)) {
					vFrom = pNode.worldPosition;
				}

				var qOrient: IQuat4;

				var vDistance: IVec3 = vFrom.subtract(vCenter, vec3());

				qOrient = Quat4.fromYawPitchRoll(fY, 0., 0., quat4());					
				
				pNode.setPosition(qOrient.multiplyVec3(vDistance, vec3()).add(vCenter));
	    		pNode.setRotation(qOrient.multiply(qLocalOrientation, quat4()));

	    		qOrient = Quat4.fromAxisAngle(pNode.localOrientation.multiplyVec3(vec3(1., 0., 0.)), -fX);

	    		vDistance = pNode.localPosition.subtract(vCenter, vec3());
				
				pNode.setPosition(qOrient.multiplyVec3(vDistance, vec3()).add(vCenter));
	    		pNode.setRotation(qOrient.multiply(pNode.localOrientation, quat4()));
			}

			pCubeModel.ondragging = <any>(pObject: ISceneObject, pViewport: IDSViewport, pRenderable: IRenderableObject, x: uint, y: uint) => {

				var pCamera: ICamera = pGeneralViewport.getCamera();
				var fdX: float = (x - pStartPos.x) / 100;
				var fdY: float = (y - pStartPos.y) / 100;

				orbitRotation2(pCamera, pCenterPoint, vWorldPosition, -fdY, -fdX);

				syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint);
			}

		/*	function softAlignTo(vDir: IVec3, vUp: IVec3): void {
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
			}*/

			function alignTo(vDir: IVec3, vUp: IVec3): void {
				pCenterPoint.set(detectCenterPoint(pGeneralViewport));

			 	var pCamera: ICamera = pGeneralViewport.getCamera();
				var fDist: float = pCamera.worldPosition.length();

				pCamera.setPosition(pCenterPoint.add(vDir.normalize().scale(fDist), vec3()));
				pCamera.lookAt(pCenterPoint, vUp);
				pCamera.update();



				syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint);
			}

			for (var i: int = 0; i < pMesh.length; ++ i) {
				var pSubset: IMeshSubset = pMesh.getSubset(i);
				// pSubset.wireframe(true);

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
					var pCamera: ICamera = pGeneralViewport.getCamera();

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

					syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint);
				}
			}
		});	
				
	}
}

#endif