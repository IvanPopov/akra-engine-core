/// <reference path="../../../build/akra.d.ts" />

module akra.addons {
	import Vec3 = math.Vec3;
	import Quat4 = math.Quat4;
	import addons = config.addons;

	addons['navigation'] = addons['navigation'] || { path: null };
	addons['navigation'].path = addons['navigation'].path || document.currentScript.src

	export interface INavigationsParameters {
		//path to resources
		path?: string;
		rotationPoint?: IVec3;
	}

	function _navigation(
		pGeneralViewport: IViewport,
		pParameters: INavigationsParameters,
		pCallback: (e: Error) => void): void {

		var pCanvas: webgl.WebGLCanvas = <webgl.WebGLCanvas>pGeneralViewport.getTarget();
		var pEngine: IEngine = pCanvas.getRenderer().getEngine();
		var pSceneMgr: ISceneManager = pEngine.getSceneManager();
		var pScene: IScene3d = pSceneMgr.createScene3D(".3d-box");
		var pGeneralScene: IScene3d = pEngine.getScene();
		var pRmgr: IResourcePoolManager = pEngine.getResourceManager();

		var pRotationPoint: IVec3 = pParameters.rotationPoint;

		//scene with cube backend
		var pCamera: ICamera = pScene.createCamera();
		var pLight: IProjectLight = <IProjectLight>pScene.createLightPoint(ELightTypes.PROJECT);
		var pParams: IProjectParameters = pLight.getParams();
		var pModel: ICollada =
			<ICollada>pRmgr.getModelPoolByFormat(EModelFormats.COLLADA).findResource("akra.navigation.ORIENTATION_CUBE");

		pModel.setOptions({ shadows: false });

		pCamera.attachToParent(pScene.getRootNode());

		pLight.attachToParent(pCamera);
		pLight.setInheritance(ENodeInheritance.ALL);

		pParams.ambient.set(0.0, 0.0, 0.0, 1);
		pParams.diffuse.set(1.);
		pParams.specular.set(.1);
		pParams.attenuation.set(0.5, 0, 0);


		var pViewport: IDSViewport = <IDSViewport>pGeneralViewport.getTarget().addViewport(new render.DSViewport(pCamera, .7, .05, .25, .25, 100));

		//detection of center point

		var pPlaneXZ: IPlane3d = new geometry.Plane3d(Vec3.temp(1., 0., 0.), Vec3.temp(0.), Vec3.temp(0., 0., 1.));
		var pCameraDir: IRay3d = new geometry.Ray3d;

		function detectCenterPoint(pGeneralViewport: IViewport): IVec3 {
			var vDest: IVec3 = Vec3.temp(0.);
			var fDistXY: float;
			var fUnprojDist: float;
			var pCamera: ICamera = pGeneralViewport.getCamera();

			var ui: any = akra["ui"];

			if (config.UI && ui.ide && ui.ide.getSelectedObject()) {
				vDest.set(ui.ide.getSelectedObject().getWorldPosition());
				return vDest;
			}

			if (pRotationPoint) {
				vDest.set(pRotationPoint);
				return vDest;
			}

			pGeneralViewport.unprojectPoint(
				pGeneralViewport.getActualWidth() / 2.,
				pGeneralViewport.getActualHeight() / 2., vDest);

			fUnprojDist = vDest.subtract(pCamera.getWorldPosition(), Vec3.temp()).length();

			if (fUnprojDist >= pCamera.getFarPlane()) {

				pCameraDir.point = pCamera.getWorldPosition();
				pCameraDir.normal = pCamera.getLocalOrientation().multiplyVec3(Vec3.temp(0., 0., -1.0));

				if (!pPlaneXZ.intersectRay3d(pCameraDir, vDest)) {
					vDest.set(pCameraDir.normal.scale(10., Vec3.temp()).add(pCameraDir.point));
				}
			}

			return vDest;
		}

		function detectSpeedRation(pGeneralViewport: IViewport): float {
			var pCamera: ICamera = pGeneralViewport.getCamera();
			var fLength: float = detectCenterPoint(pGeneralViewport).subtract(pCamera.getWorldPosition()).length();
			var fSpeedRation: float = detectCenterPoint(pGeneralViewport).subtract(pCamera.getWorldPosition()).length() / 5.;
			return fSpeedRation;
		}

		//zoom backend
		pCanvas.mousewheel.connect((pCanvas: ICanvas3d, x: uint, y: uint, fDelta: float) => {
			pGeneralViewport.getCamera().addRelPosition(0., 0., math.sign(-fDelta) * detectSpeedRation(pGeneralViewport));
		});

		//movemenet backend!
		pGeneralViewport.enableSupportFor3DEvent(E3DEventTypes.DRAGSTART | E3DEventTypes.DRAGSTOP);

		var vWorldPosition: IVec3 = new Vec3;
		var pStartPos: IPoint = { x: 0, y: 0 };
		var fDragSpeedRatio: float = 1.;

		pGeneralViewport.dragstart.connect((pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void => {
			if (eBtn !== EMouseButton.MIDDLE) {
				return;
			}

			pCanvas.setCursor("move");

			vWorldPosition.set(pViewport.getCamera().getWorldPosition());
			pStartPos.x = x;
			pStartPos.y = y;
			fDragSpeedRatio = detectSpeedRation(pGeneralViewport);
		});

		pGeneralViewport.dragstop.connect((pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void => {
			if (eBtn !== EMouseButton.MIDDLE) {
				return;
			}

			pCanvas.setCursor("auto");
		});

		pGeneralViewport.dragging.connect((pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void => {
			if (eBtn !== EMouseButton.MIDDLE) {
				return;
			}

			var pCamera: ICamera = pViewport.getCamera();
			var vDiff: IVec3 = Vec3.temp(-(x - pStartPos.x), -(y - pStartPos.y), 0.).scale(0.05 * fDragSpeedRatio);

			pCamera.setPosition(vWorldPosition.add(pCamera.getLocalOrientation().multiplyVec3(vDiff), Vec3.temp()));
		});

		//cube alpha 
		var eSrcBlend: ERenderStateValues = ERenderStateValues.SRCALPHA;
		var eDestBlend: ERenderStateValues = ERenderStateValues.DESTALPHA;

		pViewport.render.connect((
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
			// logger.assert (pSceneCam.parent === pSceneCam.root, "only general camera may be used.");

			pViewport.hide(pSceneCam.getParent() !== pSceneCam.getRoot());

			var pCubeCam: ICamera = pViewport.getCamera();
			var vPos: IVec3 = pSceneCam.getWorldPosition().subtract(pCenterPoint, Vec3.temp()).normalize().scale(5.5);

			pCubeCam.setPosition(vPos);
			pCubeCam.lookAt(Vec3.temp(0.), pSceneCam.getLocalOrientation().multiplyVec3(Vec3.temp(0., 1., 0.)));
		}

		var pModelRoot: IModelEntry = pModel.attachToScene(pScene);

		var pCubeModel: ISceneModel = <ISceneModel>pModelRoot.getChild();
		var pMesh: IMesh = pCubeModel.getMesh();

		var pStartPos: IPoint = { x: 0, y: 0 };
		var pCenterPoint: IVec3 = new Vec3(0.);
		var bDragStarted: boolean = false;

		var vWorldPosition: IVec3 = new Vec3;
		var vLocalPosition: IVec3 = new Vec3;
		var qLocalOrientation: IQuat4 = new Quat4;



		pGeneralViewport.viewportCameraChanged.connect(() => {
			syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint)
			});

		syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint);


		pCubeModel.dragstart.connect((pObject: ISceneObject, pViewport: IDSViewport, pRenderable: IRenderableObject, x: uint, y: uint) => {
			var pCamera: ICamera = pGeneralViewport.getCamera();

			pStartPos.x = x;
			pStartPos.y = y;

			bDragStarted = true;
			pViewport.highlight(pCubeModel, null);

			pCanvas.hideCursor();

			pCenterPoint.set(detectCenterPoint(pGeneralViewport));


			vWorldPosition.set(pCamera.getWorldPosition());
			vLocalPosition.set(pCamera.getLocalPosition());
			qLocalOrientation.set(pCamera.getLocalOrientation());
		});

		pCubeModel.dragstop.connect(<any>(pObject: ISceneObject, pViewport: IDSViewport, pRenderable: IRenderableObject, x: uint, y: uint) => {
			bDragStarted = false;
			(<webgl.WebGLCanvas>pViewport.getTarget()).hideCursor(false);

			eSrcBlend = ERenderStateValues.SRCALPHA;
			eDestBlend = ERenderStateValues.DESTALPHA;
			pViewport.highlight(null, null);
			pViewport.touch();
		});


		function orbitRotation2(pNode: INode, vCenter, vFrom: IVec3, fX, fY, bLookAt: boolean = true): void {
			if (isNull(vFrom)) {
				vFrom = pNode.getWorldPosition();
			}

			var qOrient: IQuat4;

			var vDistance: IVec3 = vFrom.subtract(vCenter, Vec3.temp());

			qOrient = Quat4.fromYawPitchRoll(fY, 0., 0., Quat4.temp());

			pNode.setPosition(qOrient.multiplyVec3(vDistance, Vec3.temp()).add(vCenter));
			pNode.setRotation(qOrient.multiply(qLocalOrientation, Quat4.temp()));

			qOrient = Quat4.fromAxisAngle(pNode.getLocalOrientation().multiplyVec3(Vec3.temp(1., 0., 0.)), -fX);

			vDistance = pNode.getLocalPosition().subtract(vCenter, Vec3.temp());

			pNode.setPosition(qOrient.multiplyVec3(vDistance, Vec3.temp()).add(vCenter));
			pNode.setRotation(qOrient.multiply(pNode.getLocalOrientation(), Quat4.temp()));
		}

		pCubeModel.dragging.connect(<any>(pObject: ISceneObject, pViewport: IDSViewport, pRenderable: IRenderableObject, x: uint, y: uint) => {

			var pCamera: ICamera = pGeneralViewport.getCamera();
			var fdX: float = (x - pStartPos.x) / 100;
			var fdY: float = (y - pStartPos.y) / 100;

			orbitRotation2(pCamera, pCenterPoint, vWorldPosition, -fdY, -fdX);

			syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint);
		});

		/*	function softAlignTo(vDir: IVec3, vUp: IVec3): void {
				var pCamera: ICamera = pGeneralViewport.getCamera();
				var qDest: IQuat4 = Quat4.fromForwardUp(vDir, vUp, Quat4.temp());
				var qSrc: IQuat4 = Quat4.fromForwardUp(pCamera.getWorldPosition().normalize(), 
					pCamera.getLocalOrientation().multiplyVec3(Vec3.temp(0., 1., 0.), Vec3.temp()), Quat4.temp());
				var fDelta: float = 0.0;
				
				var i = setInterval(() => {
					if (fDelta >= 1.) {
						clearInterval(i);
						return;
					}

					fDelta = 1.0;

					var q = qDest;
					//qSrc.smix(qDest, fDelta, Quat4.temp());
					
					var vDistance: IVec3 = pCamera.getWorldPosition().subtract(pCenterPoint, Vec3.temp());
					pCamera.localPosition = q.multiplyVec3(vDistance, Vec3.temp()).add(pCenterPoint);
					pCamera.lookAt(pCenterPoint, vUp);
					pCamera.update();

					fDelta += 0.05;

					syncCubeWithCamera(pGeneralViewport);
				}, 18);
			}*/

		function alignTo(vDir: IVec3, vUp: IVec3): void {
			pCenterPoint.set(detectCenterPoint(pGeneralViewport));

			var pCamera: ICamera = pGeneralViewport.getCamera();
			var fDist: float = pCamera.getWorldPosition().length();

			pCamera.setPosition(pCenterPoint.add(vDir.normalize().scale(fDist), Vec3.temp()));
			pCamera.lookAt(pCenterPoint, vUp);
			pCamera.update();



			syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint);
		}

		for (var i: int = 0; i < pMesh.getLength(); ++i) {
			var pSubset: IMeshSubset = pMesh.getSubset(i);
			// pSubset.wireframe(true);

			pSubset.mouseover.connect((pRenderable: IRenderableObject, pViewport: IDSViewport, pObject: ISceneObject) => {
				pViewport.highlight(pCubeModel, bDragStarted ? null : pRenderable);
				eSrcBlend = ERenderStateValues.ONE;
				eDestBlend = ERenderStateValues.INVSRCALPHA;
			});

			pSubset.mouseout.connect((pRenderable: IRenderableObject, pViewport: IDSViewport, pObject: ISceneObject) => {
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
			});

			pSubset.click.connect(<any>(pSubset: IMeshSubset) => {
				var pCamera: ICamera = pGeneralViewport.getCamera();

				switch (pSubset.getName()) {
					case "submesh-0":
						alignTo(Vec3.temp(0., -1., 0.), Vec3.temp(0., 0., 1.));
						console.log("bottom");
						break;
					case "submesh-1":
						alignTo(Vec3.temp(1., 0., 0.), Vec3.temp(0., 1., 0.));
						console.log("right");
						break;
					case "submesh-2":
						console.log("left");
						alignTo(Vec3.temp(-1., 0., 0.), Vec3.temp(0., 1., 0.));
						break;
					case "submesh-3":
						console.log("top");
						alignTo(Vec3.temp(0., 1., 0.), Vec3.temp(0., 0., -1.));
						break;
					case "submesh-4":
						console.log("front");
						alignTo(Vec3.temp(0., 0., 1.), Vec3.temp(0., 1., 0.));
						break;

					case "submesh-5":
						alignTo(Vec3.temp(0., 0., -1.), Vec3.temp(0., 1., 0.));
						console.log("back");
						break;
				}

				syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint);
			});
		}


		pCallback(null);
	}

	/**
	 * @param pGeneralViewport Target viewport.
	 * @param pParameters Parameters.
	 * @param pCallback Loading callback.
	 */
	export function navigation(
		pGeneralViewport: IViewport,
		pParameters: INavigationsParameters = null,
		pCallback: (e: Error) => void = null): void {

		if (isNull(pParameters)) {
			//TODO: user default parameters from config.addons.navigation
			pParameters = {};
		}

		if (isNull(pCallback)) {
			pCallback = (e: Error) => {
				throw e;
			}
		}

		deps.load(
			pGeneralViewport.getTarget().getRenderer().getEngine(),
			deps.createDependenceByPath("{ %orientation_cube% }"),
			pParameters.path || <string>addons['navigation'].path,
			(e: Error, pDep: IDependens): void => {
				if (!isNull(e)) {
					pCallback(new Error("Could not load resources for akra.addon.navigation"));
				}

				_navigation(pGeneralViewport, pParameters, pCallback);
			});
	}
}
