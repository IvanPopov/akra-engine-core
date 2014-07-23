/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="../../../built/Lib/base3dObjects.addon.d.ts" />

module akra.std {
	/**
	 * Append canvas element to DOM. Default to document.body.
	 * By default canvas will be appended with "position: fixed;"  style.
	 *
	 * @param pCanvas Canvas.
	 * @param pParent Parent HTML element.
	 */
	export function setup(pCanvas: ICanvas3d, pParent: HTMLElement = document.body): void {
		var pCanvasElement: HTMLCanvasElement = (<webgl.WebGLCanvas>pCanvas).getElement();
		var pDiv: HTMLDivElement = <HTMLDivElement>document.createElement("div");

		pParent.appendChild(pDiv);
		pDiv.appendChild(pCanvasElement);
		pDiv.style.position = "fixed";
	}

	/**
	 * Ñreate a camera at @vPos, and looks into center of the stage.
	 * @param pScene Scene.
	 * @param vPos Camera position.
	 * @return Created camera.
	 */
	export function createCamera(pScene: IScene3d, vPos: IVec3 = Vec3.temp(0., 0., .0)): ICamera {
		var pCamera: ICamera = pScene.createCamera();

		pCamera.attachToParent(pScene.getRootNode());
		pCamera.setPosition(vPos);
		pCamera.lookAt(Vec3.temp(0., 0., 0.));

		pCamera.update();

		return pCamera;
	}

	/**
	 * Create light point at @vPos and look at @vTarget.
	 * @param pScene Scene.
	 * @param eType Type of light.
	 * @return Light point;
	 */
	export function createLighting(pScene: IScene3d, eType: ELightTypes = ELightTypes.OMNI, vPos: IVec3 = null, vTarget: IVec3 = null): ILightPoint {
		var pLight: ILightPoint = pScene.createLightPoint(eType, true, 512, "omni-light-" + guid());

		pLight.attachToParent(pScene.getRootNode());
		pLight.setEnabled(true);

		switch (eType) {
			case ELightTypes.OMNI:
			case ELightTypes.PROJECT:
				//IOmniParameters & IProjectParameters same.
				var pParams: IOmniParameters = <IOmniParameters>pLight.getParams();
				pParams.ambient.set(0.1, 0.1, 0.1, 1);
				pParams.diffuse.set(0.5);
				pParams.specular.set(1, 1, 1, 1);
				pParams.attenuation.set(1, 0, 0);
		}

		if (!isNull(vPos)) {
			pLight.setPosition(vPos);
		}

		if (!isNull(vTarget)) {
			pLight.lookAt(vTarget);
		}

		return pLight;
	}


	/**
	 * Create keymap. Control camera via W,S,A,D and mouse.
	 * @param pViewport Viewport where keymap will be work.
	 * @param pCamera. If camera not specified, will be used camera from @pViewport.
	 */
	export function createKeymap(pViewport: IViewport, pCamera: ICamera = null): IKeyMap {
		var pCanvas: ICanvas3d = pViewport.getTarget().getRenderer().getDefaultCanvas();
		var pKeymap: IKeyMap = control.createKeymap();

		if (isNull(pCamera)) {
			pCamera = pViewport.getCamera();
		}

		pKeymap.captureMouse((<webgl.WebGLCanvas>pCanvas).getElement());
		pKeymap.captureKeyboard(document);

		var pScene: IScene3d = pCamera.getScene();

		pScene.beforeUpdate.connect(() => {
			if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
				var v2fMouseShift: IOffset = pKeymap.getMouseShift();

				var fdX = v2fMouseShift.x / pViewport.getActualWidth() * 10.0;
				var fdY = v2fMouseShift.y / pViewport.getActualHeight() * 10.0;

				pCamera.setRotationByXYZAxis(-fdY, -fdX, 0);

				var fSpeed: float = 0.1 * 10;
				if (pKeymap.isKeyPress(EKeyCodes.W)) {
					pCamera.addRelPosition(0, 0, -fSpeed);
				}
				if (pKeymap.isKeyPress(EKeyCodes.S)) {
					pCamera.addRelPosition(0, 0, fSpeed);
				}
				if (pKeymap.isKeyPress(EKeyCodes.A)) {
					pCamera.addRelPosition(-fSpeed, 0, 0);
				}
				if (pKeymap.isKeyPress(EKeyCodes.D)) {
					pCamera.addRelPosition(fSpeed, 0, 0);
				}
			}
		});

		return pKeymap;
	}

	/**
	 * Create default scene objects: scene surface, scene plane.
	 */
	export function createSceneEnvironment(pScene: IScene3d,
		bCreateQuad: boolean = true,
		bCreateSurface: boolean = true,
		fSize: float = 100): void {

		if (bCreateQuad) {
			var pSceneQuad: ISceneModel = addons.createQuad(pScene, fSize * 5.);
			pSceneQuad.attachToParent(pScene.getRootNode());
		}

		if (bCreateSurface) {
			var pSceneSurface: ISceneModel = addons.createSceneSurface(pScene, fSize);

			pSceneSurface.addPosition(0, -0.01, 0);
			pSceneSurface.attachToParent(pScene.getRootNode());
		}
	}

	/** Create model entry from Collada pool by name @sResource */
	export function createModelEntry(pScene: IScene3d, sResource: string): IModelEntry {
		var pRmgr: IResourcePoolManager = pScene.getManager().getEngine().getResourceManager();
		var pModel: ICollada = <ICollada>pRmgr.getColladaPool().findResource(sResource);
		var pModelRoot: IModelEntry = pModel.attachToScene(pScene);

		return pModelRoot;
	}

	export function createSky(pScene: IScene3d, fTime: number = 14.0): model.Sky {
		var pEngine: IEngine = pScene.getManager().getEngine();
		var pSky = new model.Sky(pEngine, 32, 32, 1000.0);
		pSky.setTime(fTime);
		pSky.skyDome.attachToParent(pScene.getRootNode());
		return pSky;
	}
}
