/// <reference path="../../../build/akra.d.ts" />
/// <reference path="../../../build/addons/base3dObjects.addon.d.ts" />
/// <reference path="../../../build/addons/navigation.addon.d.ts" />
/// <reference path="../../../build/addons/progress.addon.d.ts" />
/// <reference path="../../../build/addons/filedrop.addon.d.ts" />

/// <reference path="../std/std.ts" />

/// <reference path="../idl/3d-party/dat.gui.d.ts" />

declare var RESOURCES: akra.IDep;

module akra {

	var pProgress = new addons.Progress(document.getElementById("progress"))

	var pRenderOpts: IRendererOptions = {
		premultipliedAlpha: false,
		//for screenshoting
		preserveDrawingBuffer: true,
		//for black background & and avoiding composing with other html
	};


	var pOptions: IEngineOptions = {
		renderer: pRenderOpts,
		progress: pProgress.getListener(),
		deps: { files: [RESOURCES], root: "./", deps: addons.getNavigationDependences() }
		//deps: {
		//	files: [
		//		{path: "grammars/HLSL.gr"}
		//	],
		//	deps: {
		//		files: [
		//			{path: "effects/custom/arteries2.afx"},
		//			{path: "textures/arteries/AG/arteries.ara"},
		//		]
		//	}
		//}
	};

	var pEngine: IEngine = createEngine(pOptions);


	var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	var pCamera: ICamera = null;
	var pViewport: IViewport = null;
	var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
	var pScene: IScene3d = pEngine.getScene();

	var pCoordsSrc: IVec3[];
	var pCoordsDst: IVec3[];


	function main(pEngine: IEngine): void {
		std.setup(pCanvas);

		pCamera = pScene.createCamera();
		pCamera.attachToParent(pScene.getRootNode());
		pCamera.setPosition(4., 4., 3.5);
		pCamera.lookAt(Vec3.temp(0., 1., 0.));

		window["camera"] = pCamera;

		pViewport = new render.DSViewport(pCamera);

		pCanvas.addViewport(pViewport);
		pCanvas.resize(window.innerWidth, window.innerHeight);

		window.onresize = () => {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		addons.navigation(pViewport, { rotationPoint: new Vec3(0., 1., 0.) });

		std.createSceneEnvironment(pScene, false, true, 2);
		pEngine.exec();

		var pLight: IProjectLight = <IProjectLight>pScene.createLightPoint(ELightTypes.PROJECT);
		pLight.attachToParent(pCamera);
		pLight.setInheritance(ENodeInheritance.ALL);
		pLight.getParams().ambient.set(0.05);
		pLight.getParams().diffuse.set(0.25);
		pLight.getParams().specular.set(.05);
		pLight.getParams().attenuation.set(0.25, 0, 0);

		if (config.DEBUG && false) {

			var pTex: ITexture = <ITexture>pViewport["_pDeferredColorTextures"][0];
			var pColorViewport: render.TextureViewport = <any>pCanvas.addViewport(new render.TextureViewport(pTex, 0.05, 0.05, .30, .30, 40.));
			var pNormalViewport: render.TextureViewport = <any>pCanvas.addViewport(new render.TextureViewport(pTex, 0.05, 0.40, .30, .30, 50.));

			function onResize(pViewport: IViewport) {
				pColorViewport.setMapping(0., 0., pViewport.getActualWidth() / pTex.getWidth(), pViewport.getActualHeight() / pTex.getHeight());
				pNormalViewport.setMapping(0., 0., pViewport.getActualWidth() / pTex.getWidth(), pViewport.getActualHeight() / pTex.getHeight());
			}

			onResize(pViewport);

			pViewport.viewportDimensionsChanged.connect(onResize);

			pColorViewport.getEffect().addComponent("akra.system.display_consistent_colors");
			pNormalViewport.getEffect().addComponent("akra.system.display_normals");
		}

		var pCube: ISceneModel = addons.lineCube(pScene);
		pCube.attachToParent(pScene.getRootNode());
		pCube.setPosition(0., 1., 0.);

		var pGUI = new dat.GUI();

		var fSliceStep: float = 0.00781102 * (100. / 125.); /*m*/
		var pSlices: ITexture[] = [];
		for (var i = 1, t = 0; i <= 41; ++i) {
			var n: string = "ar.";

			if (i < 10) {
				n += "0";
			}

			n += String(i);

			var pTex: ITexture = <ITexture>pRmgr.getTexturePool().loadResource(n);

			pTex.setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);
			pTex.setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);

			pSlices.push(pTex);
		}

		addons.filedrop.addHandler(document.body, {
			drop: (file: File, content, format, e: DragEvent): void => {
				var pModel: ICollada = <ICollada>pRmgr.getColladaPool().createResource("dynamic" + guid());
				pModel.parse(content, { wireframe: true, debug: true });
				pModel.notifyLoaded();

				var pRoot: ISceneNode = pModel.attachToScene(pScene);
				var pRootJoint: ISceneNode = <ISceneNode>pRoot.findEntity("joint0");
				var pContainer: ISceneModel = <ISceneModel>pRoot.findEntity("joint0[mesh-container]");

				// pContainer.getMesh().getSubset(0).setVisible(false);

				// console.log(pRootJoint);
				pRootJoint.explore((pJoint: IJoint) => {
					if (!scene.Joint.isJoint(pJoint)) {
						return true;
					}

					var b: ISceneModel = addons.basis(pScene);
					b.scale(.01);
					pJoint.update();
					// b.setPosition(pJoint.worldPosition);
					b.setInheritance(ENodeInheritance.ALL);
					b.attachToParent(pJoint);
					// console.log(pJoint.worldMatrix.transpose(mat4()).toArray());
				});


				var pParam: IAnimationParameter = createSpline(pCoordsDst);

				var pPrev: IVec3[] = [];
				var pNext: IVec3[] = [];
				var pJoints: ISceneNode[] = [];

				for (var k: int = 0; k < pCoordsSrc.length; k++) {
					//параметр на оригинальной кривой, именно его будем сопоставлять с новой кривой
					var t: float = <float>k / <float>pCoordsSrc.length;
					//новый центр координат
					var s: IVec3 = (<IPositionFrame>pParam.frame(t)).translation;


					var pJoint: ISceneNode = <ISceneNode>pRoot.findEntity("joint" + k);
					var vTrans: IVec3 = pJoint.getLocalMatrix().getTranslation(Vec3.temp());
					pJoint.setLocalMatrix(Mat4.temp(1));
					pJoint.setPosition(vTrans);
					pJoint.update();
					pJoint.setInheritance(ENodeInheritance.NONE);
					pJoint.setPosition(pJoint.getWorldPosition());
					pJoint.update();

					pPrev.push(new Vec3(pJoint.getWorldPosition()));
					pNext.push(new Vec3(s));
					pJoints.push(pJoint);


					// (function (joint: ISceneNode, from: IVec3, to: IVec3) {
					// 	var i: int = 0;
					// 	// pJoint.setPosition(s);

					// 	var t = setInterval(function () {
					// 		var k = i / 100;

					// 		var s = from.scale(1. - k, Vec3.temp()).add(to.scale(k, Vec3.temp()));
					// 		joint.setPosition(s);

					// 		i ++;

					// 		if (i == 100) {
					// 			// clearInterval(t);
					// 			i = 0;
					// 		}

					// 	}, 50);
					// }) (pJoint, new Vec3(pJoint.worldPosition), new Vec3(s));
				}

				(<dat.NumberControllerSlider>pGUI.add({ "transform": 0. }, "transform")).min(0.).max(1.).step(0.005).onChange(function (k: float) {
					for (var i = 0; i < pJoints.length; ++i) {
						var from = pPrev[i];
						var to = pNext[i];
						var joint = pJoints[i];
						var s = from.scale(1. - k, Vec3.temp()).add(to.scale(k, Vec3.temp()));
						joint.setPosition(s);
					}
				});
			}
		});


		var pArteriesModelObj: IModel = pRmgr.loadModel("ARTERIES_HP.OBJ",
			{
				shadows: false,
				axis: {
					x: { index: 0, inverse: false },
					y: { index: 2, inverse: false },
					z: { index: 1, inverse: false }
				}
			});

		var pArteriesMeshObj: IMesh = null;
		var pArteriesObj: IModelEntry = null;
		var pArteriesSceneModelObj: ISceneModel = null;

		function parsePoydaFileCurveFromGodunov(content: string): IVec3[] {
			var lines: string[] = content.split("\n");
			var format: string[] = lines[0].split(",");

			if (format[0] !== "Mx" || format[1] !== "My" || format[2] !== "Mz") {
				alert("wrong coords format: " + lines[0]);
				return;
			}

			var vDelta: IVec3 = Vec3.temp(1.0588, -1.7443, -1.8989);
			// vDelta.set(0);

			var fTopZcoord: float = parseFloat(lines[lines.length - 2].split(',')[2]);/*note: last line is empty!!*/
			var pCoords: IVec3[] = [];

			for (var i = 1; i < lines.length; ++i) {
				if (lines[i].length < 3) continue;

				var coords: string[] = lines[i].split(",");

				pCoords.push(new Vec3(parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(coords[2])));

				var v: IVec3 = pCoords[i - 1];
				var vn: IVec3 = Vec3.temp();

				vn.x = v.y;
				vn.y = v.z;
				vn.z = v.x;

				v.set(vn);
			}

			return pCoords;
		}

		function createSpline(pCoords: IVec3[], pParent: ISceneNode = null, bDebug: boolean = false): IAnimationParameter {
			var pParam: IAnimationParameter = animation.createParameter();
			var pFrame: IFrame;
			var m: IMat4;
			var v: IVec3;

			for (var i = 0; i < pCoords.length; ++i) {
				v = pCoords[i];

				if (pParent) {
					v.set(pParent.getWorldMatrix().multiplyVec4(Vec4.temp(v, 1.)).clone('xyz'));
				}

				m = Mat4.temp(1.);
				m.setTranslation(v);

				pFrame = new animation.PositionFrame(i / (pCoords.length - 1), m);
				pParam.keyFrame(pFrame);

				if (bDebug) {
					console.log(i / (pCoords.length - 1), v.toString());
				}
			}

			return pParam;
		}

		function visualizeCurve(pNode: ISceneNode, pCoords: IVec3[], fScale: float = .1): void {
			for (var i = 0; i < pCoords.length; ++i) {
				var v: IVec3 = pCoords[i];
				var pBasis: ISceneModel = addons.basis(pScene);
				// pBasis.attachToParent(pArteriesSceneModelHP);
				pBasis.attachToParent(pNode);
				pBasis.setInheritance(ENodeInheritance.ALL);
				pBasis.scale(fScale);
				pBasis.setPosition(v);
			}
		}


		function parsePoydaFileCurveFromAG(content: string): IVec3[] {
			var lines: string[] = content.split("\n");
			var format: string[] = lines[0].split(",");

			if (format[0] !== "Mx" || format[1] !== "My" || format[2] !== "Mz") {
				alert("wrong coords format: " + lines[0]);
				return;
			}

			var vDelta: IVec3 = Vec3.temp(1.0588, -1.7443, -1.8989);
			// vDelta.set(0);

			var fTopZcoord: float = parseFloat(lines[lines.length - 2].split(',')[2]);/*note: last line is empty!!*/
			var pCoords: IVec3[] = [];

			for (var i = 1; i < lines.length; ++i) {
				if (lines[i].length < 3) continue;

				var coords: string[] = lines[i].split(",");

				pCoords.push(new Vec3(parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(coords[2])));

				var v: IVec3 = pCoords[i - 1];
				var vn: IVec3 = Vec3.temp();
				var fScale: float = (100. / 125.) * 0.01;
				vn.x = ((v.y + 31.25) * fScale - 1.);
				vn.z = ((v.x) * fScale - 1.);
				vn.y = v.z * fScale + 1.;
				// / fTopZcoord * pSlices.length * fSliceStep + 1.;

				v.set(vn);
			}

			return pCoords;
		}

		function findClosestVertex(pCoords: IVec3[], v: IVec3): uint {
			var l: float = -1;
			var c: uint = 0;

			for (var i: int = 0; i < pCoords.length; ++i) {
				var f: float = pCoords[i].subtract(v, Vec3.temp()).length();

				if (l < 0 || f < l) {
					c = i;
					l = f;
				}
			}

			return c;
		}

		/**
		 * Функция для создания модели по вершинам  из атласа с центральной линией pDest.
		 * @param  {IVec3[]} pSrc Оригинальная центральная линия
		 * @param  {IVec3[]} pDst Центральная линия к которой стремимся
		 * @param  {Float32Array} pPositions вершины оригинальной модели
		 * @param  {Float32Array} pIndexes индексы вершин
		 * @return {IModel}  Результирующая модель
		 */
		function constructTransformedReal(pSrc: IVec3[], pDst: IVec3[], pPositions: Float32Array, pIndexes: Float32Array): void {
			var pParam: IAnimationParameter = createSpline(pDst);
			var n: uint = 0;

			for (var i: int = 0; i < pPositions.length; i += 3) {
				var v: IVec3 = Vec3.temp(pPositions[i], pPositions[i + 1], pPositions[i + 2]);
				var k: uint = findClosestVertex(pSrc, v);
				//параметр на оригинальной кривой, именно его будем сопоставлять с новой кривой
				var t: float = <float>k / <float>pSrc.length;
				//ближайшая точки на оригинальной центральной линии, наш центр локальных координат
				var o: IVec3 = pSrc[k];
				//координаты точки в системе координат центральной линии оригинальнйо кривой
				var l: IVec3 = v.subtract(o, Vec3.temp());
				//новый центр координат
				var s: IVec3 = (<IPositionFrame>pParam.frame(t)).translation;
				//новое положение вершины
				var m: IVec3 = s.add(l, Vec3.temp());

				pPositions[i] = m.x;
				pPositions[i + 1] = m.y;
				pPositions[i + 2] = m.z;

				//////
				/*if (n < 300) {
					var b: ISceneModel = util.basis(pScene);
					b.scale(.01);
					b.attachToParent(pScene.getRootNode()); 
					b.setPosition(m);
					n ++;
				}*/
			}

			var pModel: IObj = <IObj>pRmgr.getObjPool().createResource("modified_artery");
			(<any>pModel).setOptions({ shadows: false });
			(<any>pModel).uploadVertexes(pPositions, pIndexes);
			var pNode: ISceneNode = pModel.attachToScene(pScene);
		}

		io.fopen("data/coords/coord_real_ag.txt", "r").read((err, data) => {
			var pCoords: IVec3[] = parsePoydaFileCurveFromAG(data);

			pCoordsDst = pCoords;

			visualizeCurve(pScene.getRootNode(), pCoords, 0.01);
		});

		//DATA + "models/tof_multislab_tra_2.obj"
		function loadObjFromMATLAB(sPath: string, fnCallback?: Function): void {
			var sName: string = path.parse(sPath).getFileName();
			var pRealArtery: IModel = pRmgr.loadModel(sPath);
			var pRealArteryObj: ISceneNode = pRealArtery.attachToScene(pScene);
			pRealArteryObj.setLocalMatrix(Mat4.temp(
					[1, 0, 0, 0],
					[0, 0, 1, 0],
					[0, 1, 0, 0],
					[0, 0, 0, 1]));

			//1m / 125mm
			pRealArteryObj.scale(1. / 125);
			pRealArteryObj.setPosition(-.75, 1., -1);

			var gui = pGUI.addFolder(sName);
			var wireframe = gui.add({ mode: "edged faces" }, "mode", ["colored", "wireframe", "edged faces"]);
			var visible = gui.add({ visible: false }, "visible");

			visible.onChange((bValue: boolean) => {
				(<ISceneModel>pRealArteryObj.getChild()).getMesh().getSubset(0).setVisible(bValue);
			});

			(<ISceneModel>pRealArteryObj.getChild()).getMesh().getSubset(0).setVisible(false);

			wireframe.onChange((sMode: string) => {
				switch (sMode) {
					case "colored": (<ISceneModel>pRealArteryObj.getChild()).getMesh().getSubset(0).wireframe(false); break;
					case "wireframe": (<ISceneModel>pRealArteryObj.getChild()).getMesh().getSubset(0).wireframe(true, false); break;
					case "edged faces": (<ISceneModel>pRealArteryObj.getChild()).getMesh().getSubset(0).wireframe(true); break;
				}
			});

			var pColor: IColor = color.random(true);
			(<IColor>(<ISceneModel>pRealArteryObj.getChild()).getMesh().getSubset(0).getMaterial().diffuse).set(pColor);
			(<IColor>(<ISceneModel>pRealArteryObj.getChild()).getMesh().getSubset(0).getMaterial().ambient).set(pColor);
			(<IColor>(<ISceneModel>pRealArteryObj.getChild()).getMesh().getSubset(0).getMaterial().specular).set(0.25);

			gui.open();

			fnCallback && fnCallback();

		}

		loadObjFromMATLAB("TOF_MULTISLAB_TRA_2-TAN.SPLINE.2N_POYDA.OBJ");
		loadObjFromMATLAB("TOF_MULTISLAB_TRA_2-TAN.SPLINE_SMOOTHED.2N.OBJ");
		loadObjFromMATLAB("TOF_MULTISLAB_TRA_2.OBJ");
		loadObjFromMATLAB("CAROID_ARTERY_FOR_DEFORMATION_STEP0.1-TAN.SPLINE.2N.FITTED.OBJ");

		pArteriesModelObj.loaded.connect(() => {
			var pParent: ISceneNode = pScene.createNode();
			pParent.attachToParent(pScene.getRootNode());

			pArteriesObj = pArteriesModelObj.attachToScene(pParent);
			pArteriesObj.setInheritance(ENodeInheritance.ALL);

			pParent.scale(0.0525);
			// pParent.setRotationByXYZAxis(-math.PI / 2, -math.PI/2, -math.PI / 2);
			pParent.setPosition(0.0415, 1.099, -0.026);
			pParent.update();

			io.fopen("data/coords/coord4.txt", "r").read((err, data) => {
				var pCoords: IVec3[] = parsePoydaFileCurveFromGodunov(data);
				// var pParam: IAnimationParameter = createSpline(pCoords, pParent, true);

				for (var i: int = 0; i < pCoords.length; ++i) {
					var v: IVec4 = pParent.getWorldMatrix().multiplyVec4(Vec4.temp(pCoords[i], 1.));
					pCoords[i].set(v.clone('xyz'));
				};

				pCoordsSrc = pCoords;
				// visualizeCurve(pScene.getRootNode(), pCoords, 0.01);
			});



			var gui = pGUI.addFolder('modeled carotid artery');


			var wireframe = gui.add({ mode: "edged faces" }, "mode", ["colored", "wireframe", "edged faces"]);
			var visible = gui.add({ visible: false }, "visible");
			visible.onChange((bValue: boolean) => {
				(<ISceneModel>pArteriesObj.getChild()).getMesh().getSubset(0).setVisible(bValue);
			});

			(<ISceneModel>pArteriesObj.getChild()).getMesh().getSubset(0).setVisible(false);

			wireframe.onChange((sMode: string) => {
				switch (sMode) {
					case "colored": (<ISceneModel>pArteriesObj.getChild()).getMesh().getSubset(0).wireframe(false); break;
					case "wireframe": (<ISceneModel>pArteriesObj.getChild()).getMesh().getSubset(0).wireframe(true, false); break;
					case "edged faces": (<ISceneModel>pArteriesObj.getChild()).getMesh().getSubset(0).wireframe(true); break;
				}

			});

			// gui.open();

			window["arteries_obj"] = pParent;
		});

		var pArteriesModelHP: IModel = null;
		var pArteriesMeshHP: IMesh = null;
		var pArteriesHP: IModelEntry = null;
		var pArteriesSceneModelHP: ISceneModel = null;


		//AKRA
		//X - вправо
		//Y - вверх
		//Z - на нас

		//MATLAB
		//Z - вверх 
		//X - вправо
		//Y - от нас

		var pSprite: ISprite = pScene.createSprite();
		var fSlice: float = 0.;
		var fKL: float = 0.;
		var iA: int = 0.;
		var iB: int = 1;
		var fSliceK: float = 0.;
		var fOpacity: float = 0.0;

		pSprite.attachToParent(pScene.getRootNode());
		pSprite.setRotationByXYZAxis(math.PI / 2., 0., 0.);
		pSprite.setPosition(0., 1., 0.);
		pSprite.setTexture(pSlices[0]);

		window["billboard"] = pSprite;

		var gui = pGUI.addFolder('slice');
		var slice = (<dat.NumberControllerSlider>gui.add({ slice: 0. }, 'slice')).min(0.).max(1.).step(.005);
		var opacity = (<dat.NumberControllerSlider>gui.add({ opacity: fOpacity }, 'opacity')).min(0.0).max(1.).step(.01);



		opacity.onChange(function (fValue: float) {
			fOpacity = fValue;
		});

		slice.onChange(function (fValue: float) {
			pSprite.setPosition(0., fValue * pSlices.length * fSliceStep + 1., 0.);
			// console.log(fValue * pSlices.length * fSliceStep + 1.)

			fSlice = fValue;
			fKL = fSlice * (pSlices.length - 1.);
			iA = math.floor(fKL);
			iB = iA + 1;
			fSliceK = (fKL - iA) / (iB - iA);
		});

		pSprite.getRenderable().getRenderMethodDefault().getEffect().addComponent("akra.custom.arteries_slice");
		pSprite.getRenderable().beforeRender.connect((pRenderable, pViewport, pMethod) => {
			pMethod.setTexture("SLICE_A", pSlices[iA]);
			pMethod.setTexture("SLICE_B", pSlices[iB] || null);
			pMethod.setUniform("SLICE_K", fSliceK);
			pMethod.setUniform("SLICE_OPACITY", fOpacity);
		});


		var pProjCam: ICamera = pScene.createCamera();
		var fDelta: float = 0.01;
		pProjCam.setOrthoParams(2., 2., -fDelta, fDelta);
		pProjCam.attachToParent(pSprite);
		pProjCam.setInheritance(ENodeInheritance.ALL);
		pProjCam.setPosition(0., 0., 0.);
		pProjCam.setRotationByXYZAxis(math.PI, 0., 0.);
		window["projCam"] = pProjCam;


		var pTexTarget: ITexture = pRmgr.createTexture("slice");
		var iRes: int = 2048;
		pTexTarget.create(iRes, iRes, 1, null, ETextureFlags.RENDERTARGET, 0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.R8G8B8);
		pTexTarget.getBuffer().getRenderTarget()
			.addViewport(new render.DSViewport(pProjCam));

		pCanvas.addViewport(new render.TextureViewport(pTexTarget, 0.05, 0.05, .5 * 512 / pViewport.getActualWidth(), .5 * 512 / pViewport.getActualHeight(), 5.));

		pViewport.setClearEveryFrame(true);
		pViewport.setBackgroundColor(color.BLACK);
		pProgress.destroy();
	}

	pEngine.ready(main);
}