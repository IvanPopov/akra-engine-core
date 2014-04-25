/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="../../../built/Lib/progress.addon.d.ts" />
/// <reference path="../../../built/Lib/base3dobjects.addon.d.ts" />

/// <reference path="../std/std.ts" />

declare var AE_RESOURCES: akra.IDep;

module akra {
	var pProgress = new addons.Progress(document.getElementById("progress"));

	export var pEngine = createEngine({
		deps: { files: [AE_RESOURCES], root: "./" },
		progress: pProgress.getListener(),
		renderer: {
			alpha: false
		}
	});
	var pScene = pEngine.getScene();
	var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	var pCamera: ICamera = null;
	var pViewport: IViewport = null;
	var pRmgr: IResourcePoolManager = pEngine.getResourceManager();


	class SimpleSceneObject extends akra.scene.SceneObject {
		protected _pRenderable: IRenderableObject = null;
		static renderable: IRenderableObject = null;
		constructor(pScene: IScene3d, eType: EEntityTypes = EEntityTypes.SCENE_OBJECT) {
			super(pScene, eType);

			this._pLocalBounds.set(-1, 1, -1, 1, -1, 1);

			if (!SimpleSceneObject.renderable) {
				var pRenderable: IRenderableObject = new render.RenderableObject();
				var pCollection: IRenderDataCollection = pEngine.createRenderDataCollection(0);
				var pData: IRenderData = pCollection.getEmptyRenderData(EPrimitiveTypes.TRIANGLELIST);

				pData.allocateAttribute(akra.data.VertexDeclaration.normalize([akra.data.VertexElement.float3(akra.data.Usages.POSITION)]),
					new Float32Array([
						// Front face
						-1.0, -1.0, 1.0,
						1.0, -1.0, 1.0,
						1.0, 1.0, 1.0,
						-1.0, 1.0, 1.0,

						// Back face
						-1.0, -1.0, -1.0,
						-1.0, 1.0, -1.0,
						1.0, 1.0, -1.0,
						1.0, -1.0, -1.0,

						// Top face
						-1.0, 1.0, -1.0,
						-1.0, 1.0, 1.0,
						1.0, 1.0, 1.0,
						1.0, 1.0, -1.0,

						// Bottom face
						-1.0, -1.0, -1.0,
						1.0, -1.0, -1.0,
						1.0, -1.0, 1.0,
						-1.0, -1.0, 1.0,

					// Right face
						1.0, -1.0, -1.0,
						1.0, 1.0, -1.0,
						1.0, 1.0, 1.0,
						1.0, -1.0, 1.0,

						// Left face
						-1.0, -1.0, -1.0,
						-1.0, -1.0, 1.0,
						-1.0, 1.0, 1.0,
						-1.0, 1.0, -1.0,
					]));

				pData.allocateAttribute(akra.data.VertexDeclaration.normalize([akra.data.VertexElement.float3(akra.data.Usages.NORMAL)]),
					new Float32Array([
					// Front face
						0.0, 0.0, 1.0,
						0.0, 0.0, 1.0,
						0.0, 0.0, 1.0,
						0.0, 0.0, 1.0,

					// Back face
						0.0, 0.0, -1.0,
						0.0, 0.0, -1.0,
						0.0, 0.0, -1.0,
						0.0, 0.0, -1.0,

					// Top face
						0.0, 1.0, 0.0,
						0.0, 1.0, 0.0,
						0.0, 1.0, 0.0,
						0.0, 1.0, 0.0,

					// Bottom face
						0.0, -1.0, 0.0,
						0.0, -1.0, 0.0,
						0.0, -1.0, 0.0,
						0.0, -1.0, 0.0,

					// Right face
						1.0, 0.0, 0.0,
						1.0, 0.0, 0.0,
						1.0, 0.0, 0.0,
						1.0, 0.0, 0.0,

						// Left face
						-1.0, 0.0, 0.0,
						-1.0, 0.0, 0.0,
						-1.0, 0.0, 0.0,
						-1.0, 0.0, 0.0,
					]));

				var pMap: IBufferMap = pData["_pMap"];
				var pIndexBuffer: IIndexBuffer = pRmgr.createIndexBuffer("simple-cube-indecies");
				pIndexBuffer.create(36, EHardwareBufferFlags.BACKUP_COPY | EHardwareBufferFlags.STATIC);

				pMap.setIndex(pIndexBuffer.allocateData(EPrimitiveTypes.TRIANGLELIST, EDataTypes.UNSIGNED_SHORT, new Uint16Array([
					0, 1, 2, 0, 2, 3,    // Front face
					4, 5, 6, 4, 6, 7,    // Back face
					8, 9, 10, 8, 10, 11,  // Top face
					12, 13, 14, 12, 14, 15, // Bottom face
					16, 17, 18, 16, 18, 19, // Right face
					20, 21, 22, 20, 22, 23  // Left face
				])));

				pRenderable._setRenderData(pData);
				pRenderable._setup(pEngine.getRenderer());

				pRenderable.getEffect().addComponent("akra.system.mesh_geometry");
				pRenderable.getEffect().addComponent("akra.system.mesh_texture");

				pRenderable.getMaterial().emissive = new color.Color(0., 0., 0., 1.);
				pRenderable.getMaterial().ambient = new color.Color(1., 1., 1., 1.);
				pRenderable.getMaterial().diffuse = new color.Color(1., 0., 0., 1.);
				pRenderable.getMaterial().specular = new color.Color(1., 0., 0., 1.);
				pRenderable.getMaterial().shininess = 20;

				SimpleSceneObject.renderable = pRenderable;
			}

			this._pRenderable = SimpleSceneObject.renderable;;
		}

		getTotalRenderable(): uint {
			return 1;
		}

		getRenderable(i?: uint): IRenderableObject {
			return this._pRenderable;
		}
	}

	function createSimpleCube(sName: string = null): ISceneObject {
		var pCube = new SimpleSceneObject(pScene);

		pCube.create();

		pCube.setName(sName);
		pCube.attached.connect(pScene.nodeAttachment);
		pCube.detached.connect(pScene.nodeDetachment);

		pCube.attachToParent(pScene.getRootNode());

		pScene.beforeUpdate.connect(() => {
			pCube.addRelRotationByXYZAxis(0.00, 0.01, 0);
		});

		return pCube;
	}

	function loadModel(sPath, fnCallback?: Function): ISceneNode {
		var pModel: ICollada = <ICollada>pEngine.getResourceManager().loadModel(sPath);

		var pModelRoot: ISceneNode = pModel.extractModel(pModelRoot);
		pModelRoot.attachToParent(pScene.getRootNode());

		pScene.beforeUpdate.connect(() => {
			pModelRoot.addRelRotationByXYZAxis(0.00, 0.01, 0);
		});

		if (isFunction(fnCallback)) {
			fnCallback(pModelRoot);
		}

		return pModelRoot;
	}

	function loadManyModels(nCount: uint, sPath: string): void {
		var iRow: uint = 0;
		var iCountInRow: uint = 0;

		var fDX: float = 2.;
		var fDZ: float = 2.;

		var fShiftX: float = 0.;
		var fShiftZ: float = 0.;

		loadModel(sPath, (pCube: ISceneNode) => {
			for (var i: uint = 0; i < nCount; i++) {
				if (iCountInRow > iRow) {
					iCountInRow = 0;
					iRow++;

					fShiftX = -iRow * fDX / 2;
					fShiftZ = -iRow * fDZ;
				}

				pCube = i === 0 ? pCube : loadModel(sPath);
				pCube.setPosition(fShiftX, 0.8, fShiftZ - 2.);
				pCube.scale(0.1);

				fShiftX += fDX;
				iCountInRow++;
			}
		});
	}

	function loadManySimpleCubes(nCount: uint): void {
		var iRow: uint = 0;
		var iCountInRow: uint = 0;

		var fDX: float = 2.;
		var fDZ: float = 2.;

		var fShiftX: float = 0.;
		var fShiftZ: float = 0.;
		var pCube: ISceneObject = null;

		for (var i: uint = 0; i < nCount; i++) {
			if (iCountInRow > iRow) {
				iCountInRow = 0;
				iRow++;

				fShiftX = -iRow * fDX / 2;
				fShiftZ = -iRow * fDZ;
			}

			pCube = createSimpleCube();
			pCube.setPosition(fShiftX, 0.8, fShiftZ - 2.);
			pCube.scale(0.5);

			fShiftX += fDX;
			iCountInRow++;
		}
	}

	//function loadModel2(sPath, fnCallback?: Function): ISceneNode {
	//	var pModelRoot: ISceneNode = pScene.createNode();
	//	var pModel: ICollada = <ICollada>pRmgr.loadModel(sPath);

	//	pModelRoot.attachToParent(pScene.getRootNode());

	//	function fnLoadModel(pModel: ICollada): void {
	//		pModel.attachToScene(pModelRoot);

	//		if (pModel.isAnimationLoaded()) {
	//			var pController: IAnimationController = pEngine.createAnimationController();
	//			var pContainer: IAnimationContainer = animation.createContainer();
	//			var pAnimation: IAnimation = pModel.extractAnimation(0);

	//			pController.attach(pModelRoot);

	//			pContainer.setAnimation(pAnimation);
	//			pContainer.useLoop(true);
	//			pController.addAnimation(pContainer);
	//		}

	//		if (isFunction(fnCallback)) {
	//			fnCallback(pModelRoot);
	//		}
	//	}

	//	if (pModel.isResourceLoaded()) {
	//		fnLoadModel(pModel);
	//	}
	//	else {
	//		pModel.loaded.connect(fnLoadModel);
	//	}

	//	return pModelRoot;
	//}

	function main(pEngine: IEngine) {
		std.setup(pCanvas);

		pCamera = std.createCamera(pScene);
		pCamera.setPosition(Vec3.temp(0., 7., 10.));
		pCamera.lookAt(Vec3.temp(0, 0.8, -15));

		pViewport = new render.LPPViewport(pCamera, 0., 0., 1., 1., 1);

		pCanvas.addViewport(pViewport);
		//pCanvas.addViewport(new render.DSViewport(pCamera, 0.5, 0., 0.5, 1., 2));

		pCanvas.resize(window.innerWidth, window.innerHeight);

		window.onresize = () => {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		pViewport.setBackgroundColor(color.DARK_BLUE);
		pViewport.setClearEveryFrame(true);

		std.createKeymap(pViewport);

		//std.createSceneEnvironment(pScene, true, false, 100);
		//var pModel: ISceneModel;

		//loadModel2("WOODSOLDIER.DAE").addPosition(0., 1.1, 0.).explore((pNode: IEntity): boolean => {
		//	if (scene.SceneModel.isModel(pNode)) {
		//		pModel = <ISceneModel>pNode;

		//		var pSubset = <model.MeshSubset>pModel.getMesh().getSubset(0);

		//		for (var i = 0; i < pSubset.getTotalBones(); ++i) {
		//			if (!pSubset.getBoneLocalBound(i)) {
		//				continue;
		//			}

		//			var pBox = pSubset.getBoneLocalBound(i);
		//			var pBone = pSubset.getSkin().getAffectedNode(i);

		//			var pCube = addons.lineCube(pScene);
		//			pCube.attachToParent(pBone);
		//			pCube.setInheritance(ENodeInheritance.ALL);
		//			pCube.setLocalScale(pBox.size(Vec3.temp())).scale(.5);
		//			pCube.setPosition(pBox.midPoint(Vec3.temp()));
		//			(<IColor>pCube.getMesh().getSubset(0).getMaterial().emissive).set(color.random(true));
		//		}

		//		return false;
		//	}
		//});

		
		//var pLibeCube = addons.lineCube(pScene);
		//pLibeCube.attachToParent(pScene.getRootNode());
		//pScene.beforeUpdate.connect(() => {
		//	var pBB = geometry.Rect3d.temp(pModel.getWorldBounds());

		//	pLibeCube.setLocalScale(pBB.size(Vec3.temp())).scale(.5);
		//	pLibeCube.setPosition(pBB.midPoint(Vec3.temp()));
		//});


		var pLight: ILightPoint = std.createLighting(pScene, ELightTypes.OMNI, Vec3.temp(1, 5, 3));
		pLight.setShadowCaster(false);

		//var pLight2: ILightPoint = std.createLighting(pScene, ELightTypes.OMNI, Vec3.temp(1, 6, 3));
		//pLight2.setShadowCaster(false);

		//var pLight3: ILightPoint = std.createLighting(pScene, ELightTypes.PROJECT, Vec3.temp(0, 2, 5));
		//pLight3.setShadowCaster(true);

		//var pLight4: ILightPoint = std.createLighting(pScene, ELightTypes.PROJECT, Vec3.temp(1, 5, 3));
		//pLight4.setShadowCaster(false);

		//var pDepthTextures: ITexture[] = (<IOmniLight>pLight).getDepthTextureCube();
		//var pShowedDepthRange: IVec2 = new Vec2(0.9, 1.);
		//for(var i: uint = 0; i < pDepthTextures.length; i++){
		//	var pTextureViewport = new render.TextureViewport(pDepthTextures[i], 0.01, 0.01 + i*0.16, 0.15, 0.15, 1. + i);
		//	pCanvas.addViewport(pTextureViewport);
		//	pTextureViewport.getEffect().addComponent("akra.system.display_depth");
		//	pTextureViewport.render.connect((pViewport: IViewport, pTechnique: IRenderTechnique, iPass: uint)=>{
		//		pTechnique.getPass(iPass).setUniform("depthRange", pShowedDepthRange);
		//	});
		//}
		loadManySimpleCubes(1000);
		//loadManyModels(400, "CUBE.DAE");
		pProgress.destroy();
		pEngine.exec();
	}

	pEngine.ready(main);
}