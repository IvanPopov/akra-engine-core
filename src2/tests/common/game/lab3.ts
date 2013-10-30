#include "def.ts"
#include "util/navigation.ts"

#include "dat.gui.d.ts"

module akra {

	#include "setup.ts"
	#include "createProgress.ts"
	#include "createCameras.ts"
	#include "createSceneEnvironment.ts"
	#include "createViewports.ts"
	#include "createModelEntry.ts"

	var pProgress: IProgress = createProgress();

	var pRenderOpts: IRendererOptions = {
		premultipliedAlpha: false,
		//for screenshoting
		preserveDrawingBuffer: true,
		//for black background & and avoiding composing with other html
	};

	
	var pControllerData: IDocument = null;
	var pLoader = {
		changed: (pManager: IDepsManager, pFile: IDep, pInfo: any): void => {
			var sText: string = "";

			switch (pFile.status) {
				case EDependenceStatuses.LOADING: 
					sText += "Loading "; 
					break;
				case EDependenceStatuses.UNPACKING: 
					sText += "Unpacking "; 
					break;
			}

			switch (pFile.status) {
				case EDependenceStatuses.LOADING: 
				case EDependenceStatuses.UNPACKING: 
					sText += ("resource " + path.info(path.uri(pFile.path).path).basename);
				
					if (!isNull(pInfo)) {
						sText += " (" + (pInfo.loaded / pInfo.total * 100).toFixed(2) + "%)";
					}

					pProgress.drawText(sText);
					break;
				case EDependenceStatuses.LOADED:
					pProgress.total[pFile.deps.depth] = pFile.deps.total;
					pProgress.element = pFile.deps.loaded;
					pProgress.depth = pFile.deps.depth;
					pProgress.draw();
					break;
			}
		},
		loaded: (pManager: IDepsManager): void => {
			pProgress.cancel();
			document.body.removeChild(pProgress.canvas);
		}
	};

	var pOptions: IEngineOptions = {
		renderer: pRenderOpts,
		loader: pLoader,
		deps: {
			files: [
				{path: "grammars/HLSL.gr"}
			],
			deps: {
				files: [
					{path: "effects/custom/arteries2.afx"},
					{path: "textures/arteries/AG/arteries.ara"},
				]
			}
		}
	};

	var pEngine: IEngine = createEngine(pOptions);
	
	
	var pUI: IUI 						= pEngine.getSceneManager().createUI();
	var pCanvas: ICanvas3d 				= pEngine.getRenderer().getDefaultCanvas();
	var pCamera: ICamera 				= null;
	var pViewport: IViewport 			= null;
	var pIDE: ui.IDE 					= null;
	var pRmgr: IResourcePoolManager 	= pEngine.getResourceManager();
	var pScene: IScene3d 				= pEngine.getScene();


	function main(pEngine: IEngine): void {
		setup(pCanvas, pUI);

		pCamera = pScene.createCamera();
		pCamera.attachToParent(pScene.getRootNode());
		pCamera.setPosition(4., 4., 3.5);
		pCamera.lookAt(vec3(0., 1., 0.));

		window["camera"] = pCamera;

		



		pViewport = createViewports(new render.DSViewport(pCamera), pCanvas, pUI);

		util.navigation(pViewport, new Vec3(0., 1., 0.));

		createSceneEnvironment(pScene, true, false, 2);
		pEngine.exec();

		var pLight: IProjectLight = <IProjectLight>pScene.createLightPoint(ELightTypes.PROJECT);
		pLight.attachToParent(pCamera);
		pLight.setInheritance(ENodeInheritance.ALL);
		pLight.params.ambient.set(0.0, 0.0, 0.0, 1);
		pLight.params.diffuse.set(1.);
		pLight.params.specular.set(.1);
		pLight.params.attenuation.set(0.5, 0, 0);


		var pCube: ISceneModel = util.lineCube(pScene);
		pCube.attachToParent(pScene.getRootNode());
		pCube.setPosition(0., 1., 0.);

		var pGUI = new dat.GUI();


	    
	    // pGUI.add(pViewer, 'threshold', 0, 1.);
	    // pGUI.add(pViewer, 'colored');
	    // pGUI.add(pViewer, 'waveStripStep', 1, 25).step(1);
	    // pGUI.add(pViewer, 'waveStripWidth', 1, 10).step(1);
	    // pGUI.addColor(pViewer, 'waveColor');
	    // pGUI.addColor(pViewer, 'waveStripColor');
	    var fSliceStep: float = 0.00781102 * (100. / 125.); /*m*/
	    var pSlices: ITexture[] = [];
	    for (var i = 1, t = 0; i <= 41; ++ i) {
	    	var n: string = "ar.";

	    	if (i < 10) {
	    		n += "0";
	    	}

	    	n += String(i);
	    	
	    	var pTex: ITexture = <ITexture>pRmgr.texturePool.loadResource(n);
	    	
	    	pTex.setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);
			pTex.setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
	    	
	    	pSlices.push(pTex);
	    }

	    var pArteriesModelObj: IModel = pRmgr.loadModel(DATA + "models/arteries_hp.obj", 
	    	{
	    		shadows: false,
	    		axis: {
	    			x: {index: 0, inverse: false},
					y: {index: 2, inverse: false},
					z: {index: 1, inverse: false}
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

			var vDelta: IVec3 = vec3(1.0588, -1.7443, -1.8989);
			// vDelta.set(0);

			var fTopZcoord: float = parseFloat(lines[lines.length-2].split(',')[2]);/*note: last line is empty!!*/
			var pCoords: IVec3[] = [];

			for (var i = 1; i < lines.length; ++ i) {
				if (lines[i].length < 3) continue;

				var coords: string[] = lines[i].split(",");
				
				pCoords.push(new Vec3(parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(coords[2])));
				
				var v: IVec3 = pCoords[i - 1];
				var vn: IVec3 = vec3();

				vn.x = v.y;
				vn.y = v.z;
				vn.z = v.x;

				v.set(vn);
			}

			return pCoords;
	    }

	    function createSpline(pCoords: IVec3[], pParent: ISceneNode = null, bDebug: bool = false): IAnimationParameter {
	    	var pParam: IAnimationParameter = animation.createParameter();
	    	var pFrame: IFrame;
	    	var m: IMat4;
	    	var v: IVec3;

			for (var i = 0; i < pCoords.length; ++ i) {
				v = pCoords[i];

				if (pParent) {
                	v.set(pParent.worldMatrix.multiplyVec4(vec4(v, 1.)).xyz);
                }

                m = mat4(1.);
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
	    	for (var i = 0; i < pCoords.length; ++ i) {
				var v: IVec3 = pCoords[i];
				var pBasis: ISceneModel = util.basis(pScene);
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

			var vDelta: IVec3 = vec3(1.0588, -1.7443, -1.8989);
			// vDelta.set(0);

			var fTopZcoord: float = parseFloat(lines[lines.length-2].split(',')[2]);/*note: last line is empty!!*/
			var pCoords: IVec3[] = [];

			for (var i = 1; i < lines.length; ++ i) {
				if (lines[i].length < 3) continue;

				var coords: string[] = lines[i].split(",");
				
				pCoords.push(new Vec3(parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(coords[2])));
				
				var v: IVec3 = pCoords[i - 1];
				var vn: IVec3 = vec3();
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

			for (var i: int = 0; i < pCoords.length; ++ i) {
				var f: float = pCoords[i].subtract(v, vec3()).length();

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
	    		var v: IVec3 = vec3(pPositions[i], pPositions[i + 1], pPositions[i + 2]);
	    		var k: uint = findClosestVertex(pSrc, v);
	    		//параметр на оригинальной кривой, именно его будем сопоставлять с новой кривой
	    		var t: float = <float>k / <float>pSrc.length;
	    		//ближайшая точки на оригинальной центральной линии, наш центр локальных координат
	    		var o: IVec3 = pSrc[k];
	    		//координаты точки в системе координат центральной линии оригинальнйо кривой
	    		var l: IVec3 = v.subtract(o, vec3());
	    		//новый центр координат
	    		var s: IVec3 = (<IPositionFrame>pParam.frame(t)).translation;
	    		//новое положение вершины
	    		var m: IVec3 = s.add(l, vec3());

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

	    	var pModel: IObj = <IObj>pRmgr.objPool.createResource("modified_artery");
	    	(<any>pModel).setOptions({shadows: false});
	    	pModel.uploadVertexes(pPositions, pIndexes);
	    	var pNode: ISceneNode = pModel.attachToScene(pScene);
	    }

	    fopen(DATA + "/models/coord_real_ag.txt", "r").read((err, data) => {
			var pCoords: IVec3[] = parsePoydaFileCurveFromAG(data);



			visualizeCurve(pScene.getRootNode(), pCoords, 0.01);
		});


		var pRealArtery: IModel = pRmgr.loadModel(DATA + "models/tof_multislab_tra_2.obj", {
			shadows: false,
			axis: {
				x: {index: 0, inverse: false},
				y: {index: 2, inverse: false},
				z: {index: 1, inverse: false}
			}
		});


	    pArteriesModelObj.bind("loaded", () => {
	    	var pParent: ISceneNode = pScene.createNode();
	    	pParent.attachToParent(pScene.getRootNode());

			pArteriesObj = pArteriesModelObj.attachToScene(pParent);
			pArteriesObj.setInheritance(ENodeInheritance.ALL);

			pParent.scale(0.0525);
			// pParent.setRotationByXYZAxis(-math.PI / 2, -math.PI/2, -math.PI / 2);
			pParent.setPosition(0.0415, 1.099, -0.026);
			pParent.update();

			fopen(DATA + "/models/coord4.txt", "r").read((err, data) => {
				var pCoords: IVec3[] = parsePoydaFileCurveFromGodunov(data);
				// var pParam: IAnimationParameter = createSpline(pCoords, pParent, true);
				 
				for (var i: int = 0; i < pCoords.length; ++ i) {
					var v: IVec4 = pParent.worldMatrix.multiplyVec4(vec4(pCoords[i], 1.));
					pCoords[i].set(v.xyz);
				};

				// visualizeCurve(pScene.getRootNode(), pCoords, 0.01);

				pGUI.add({"transform to real": () => {
					var pArteriesNode: ISceneModel = (<ISceneModel>pArteriesObj.child);
					var pArteriesMesh: IMesh = pArteriesNode.mesh;
					var pSubset: IMeshSubset = pArteriesMesh.getSubset(0);
					var pPosVd: IVertexData = pSubset.data._getData("POSITION");
					// var pNormVd: IVertexData = pSubset.data._getData("NORMAL");

					var pPosInd: Float32Array = <Float32Array>pSubset.data.getIndexFor("POSITION");
					// var pNormInd: Float32Array = <Float32Array>pSubset.data.getIndexFor("NORMAL");

					var iStride: int = pPosVd.stride;
					var iAddition: int = pPosVd.byteOffset;
					var iTypeSize: int = EDataTypeSizes.BYTES_PER_FLOAT;


					for (var i = 0; i < pPosInd.length; ++ i) {
						pPosInd[i] = (pPosInd[i] * iTypeSize - iAddition) / iStride;
					}

					// var iStride: int = pNormVd.stride;
					// var iAddition: int = pNormVd.byteOffset;
					// var iTypeSize: int = EDataTypeSizes.BYTES_PER_FLOAT;

					// for (var i = 0; i < pNormInd.length; ++ i) {
					// 	pNormInd[i] = (pNormInd[i] * iTypeSize - iAddition) / iStride;
					// }
					console.log(pPosVd.toString())
					var pPos: Float32Array = new Float32Array(pPosVd.getData());
					// var pNorm: Float32Array = new Float32Array(pNormVd.getData());

					var pPosNew: Float32Array = new Float32Array(pPos.length);

					pArteriesNode.update();

					var m4World: IMat4 = pArteriesNode.worldMatrix;


					var count: int = iStride / 4;
					for (var i = 0; i < pPos.length; i += count) {
						
						var vPos: IVec3 = vec3(pPos[i], pPos[i + 1], pPos[i + 2]);
						var vWorldPos: IVec4 = m4World.multiplyVec4(vec4(vPos, 1.));

						pPosNew[i] = vWorldPos.x;
						pPosNew[i + 1] = vWorldPos.y;
						pPosNew[i + 2] = vWorldPos.z;
					}

					fopen(DATA + "/models/coord_real_ag.txt", "r").read((err, data) => {
						//данные восстановленные по ангионрафии
						var pDestCoords: IVec3[] = parsePoydaFileCurveFromAG(data);
						//данные востановленные годуновым по сосуду из атласа
						var pSrcCoords: IVec3[] = pCoords;

						constructTransformedReal(pSrcCoords, pDestCoords, pPosNew, pPosInd);
					});

					// pPosVd.setData(pPosNew, 0, 16);

				}}, "transform to real");
			});

		

			var gui = pGUI.addFolder('modeled carotid artery');


			var wireframe = gui.add({mode: "edged faces"}, "mode", [ "colored", "wireframe", "edged faces" ] );
			var visible = gui.add({visible: true}, "visible");
			visible.onChange((bValue: bool) => {
				(<ISceneModel>pArteriesObj.child).mesh.getSubset(0).setVisible(bValue);;
			});

			wireframe.onChange((sMode: string) => {
				switch (sMode) {
					case "colored": (<ISceneModel>pArteriesObj.child).mesh.getSubset(0).wireframe(false); break;
					case "wireframe": (<ISceneModel>pArteriesObj.child).mesh.getSubset(0).wireframe(true, false); break;
					case "edged faces": (<ISceneModel>pArteriesObj.child).mesh.getSubset(0).wireframe(true); break;
				}
				
			});




			window["arteries_obj"] = pParent;
		});

		var pArteriesModelHP: IModel = null;
	    var pArteriesMeshHP: IMesh = null;
	    var pArteriesHP: IModelEntry = null;
	    var pArteriesSceneModelHP: ISceneModel = null;

	    pRealArtery.bind("loaded", () => {
			var pRealArteryObj: ISceneNode = pRealArtery.attachToScene(pScene);

			// console.log("pRealArteryObj >> ", pRealArteryObj);
			//1m / 125mm
			pRealArteryObj.scale(1. / 125);
			pRealArteryObj.setPosition(-.75, 1., -1);

			var gui = pGUI.addFolder('real carotid artery');
			var wireframe = gui.add({mode: "edged faces"}, "mode", [ "colored", "wireframe", "edged faces" ] );
			var visible = gui.add({visible: true}, "visible");
			visible.onChange((bValue: bool) => {
				(<ISceneModel>pRealArteryObj.child).mesh.getSubset(0).setVisible(bValue);;
			});

			wireframe.onChange((sMode: string) => {
				switch (sMode) {
					case "colored": (<ISceneModel>pRealArteryObj.child).mesh.getSubset(0).wireframe(false); break;
					case "wireframe": (<ISceneModel>pRealArteryObj.child).mesh.getSubset(0).wireframe(true, false); break;
					case "edged faces": (<ISceneModel>pRealArteryObj.child).mesh.getSubset(0).wireframe(true); break;
				}
				
			});

			// pParent.setRotationByXYZAxis(-math.PI / 2, -math.PI/2, -math.PI / 2);

			window["arteries_real"] = pRealArteryObj;

			pArteriesModelHP = pRmgr.loadModel(DATA + "models/arteries_hp.DAE", {shadows: false});
			pArteriesModelHP.bind("loaded", loadTestArteryForShrinkCallback);
		});

	   

	    //AKRA
	    //X - вправо
	    //Y - вверх
	    //Z - на нас

	    //MATLAB
	    //Z - вверх 
	    //X - вправо
	    //Y - от нас

	    function loadTestArteryForShrinkCallback () => {
			pArteriesHP = pArteriesModelHP.attachToScene(pScene);
			pArteriesHP.setRotationByXYZAxis(0., math.PI, 0.);


			
			// var pBasis: ISceneModel = util.basis(pScene);
			// pBasis.scale(.25);
			// pBasis.attachToParent((<ISceneModel>pArteriesHP.child));
			// console.log(pArteriesHP.findEntity("node-main_arteries_L01").toString(true));
			pArteriesSceneModelHP = (<ISceneModel>pArteriesHP.findEntity("node-main_arteries_L01").child);
			pArteriesMeshHP = pArteriesSceneModelHP.mesh;


			/////
			var pSubset: IMeshSubset = pArteriesMeshHP.getSubset(0);
			var pPosVd: IVertexData = pSubset.data._getData("POSITION");
			var pNormVd: IVertexData = pSubset.data._getData("NORMAL");

			var pPosInd: Float32Array = <Float32Array>pSubset.data.getIndexFor("POSITION");
			var pNormInd: Float32Array = <Float32Array>pSubset.data.getIndexFor("NORMAL");

			var iStride: int = pPosVd.stride;
			var iAddition: int = pPosVd.byteOffset;
			var iTypeSize: int = EDataTypeSizes.BYTES_PER_FLOAT;


			for (var i = 0; i < pPosInd.length; ++ i) {
				pPosInd[i] = (pPosInd[i] * iTypeSize - iAddition) / iStride;
			}

			var iStride: int = pNormVd.stride;
			var iAddition: int = pNormVd.byteOffset;
			var iTypeSize: int = EDataTypeSizes.BYTES_PER_FLOAT;

			for (var i = 0; i < pNormInd.length; ++ i) {
				pNormInd[i] = (pNormInd[i] * iTypeSize - iAddition) / iStride;
			}

			var pPos: Float32Array = new Float32Array(pPosVd.getData());
			var pNorm: Float32Array = new Float32Array(pNormVd.getData());

			var gui = pGUI.addFolder('shrink deformation');
			var shrink = (<dat.NumberControllerSlider>gui.add({shrink: 0.0}, 'shrink')).min(-1.0).max(1.0).step(.01);
			var visible = gui.add({visible: false}, 'visible');
			pArteriesMeshHP.getSubset(0).setVisible(false);
			visible.onChange((bValue: bool) => {
				pArteriesMeshHP.getSubset(0).setVisible(bValue);;
			});

			var pNormAvg: Float32Array = new Float32Array(pPos.length);
			var pNormCount: Float32Array = new Float32Array(pPos.length / 4);

			// for (var i: int = 0; i < pPosInd.length; ++ i) {
			// 	if (pPosInd[i] < 100) {
			// 		console.log(pPosInd[i], "<<<<");
			// 	}
			// }

			for (var i = 0; i < pPosInd.length; i ++) {
				var n: int = pNormInd[i] * 4;
				var v: int = pPosInd[i] * 4;
				
				// var vPos: IVec3 = vec3(pPos[v], pPos[v + 1], pPos[v + 2]);
				var vNorm: IVec3 = vec3(pNorm[n], pNorm[n + 1], pNorm[n + 2]);
				var vNormAvg: IVec3 = vec3(pNormAvg[v], pNormAvg[v + 1], pNormAvg[v + 2]);
				// console.log(vNorm.toString(), "norm");
				vNormAvg.add(vNorm);
				pNormCount[v / 4] ++;


				pNormAvg[v] = vNormAvg.x;
				pNormAvg[v + 1] = vNormAvg.y;
				pNormAvg[v + 2] = vNormAvg.z;

				// console.log(vNormAvg.toString(), "norm avg.")
			}

			for (var i = 0; i < pNormCount.length; i ++) {
				var n = i * 4;
				var c = pNormCount[i];
				if (!(pNormAvg[n] == 0 && pNormAvg[n + 1] == 0 && pNormAvg[n + 2] == 0)) {
					pNormAvg[n] /= c;
					pNormAvg[n + 1] /= c;
					pNormAvg[n + 2] /= c;
				}
			}

			var pPosNew: Float32Array = new Float32Array(pPos.length);
			shrink.onChange(function(fValue: float) {
				for (var i = 0; i < pPos.length; i += 4) {
					
					var vPos: IVec3 = vec3(pPos[i], pPos[i + 1], pPos[i + 2]);

					var vNorm: IVec3 = vec3(pNormAvg[i], pNormAvg[i + 1], pNormAvg[i + 2]);
					vNorm.normalize();
					vPos.add(vNorm.scale(fValue));

					pPosNew[i] = vPos.x;
					pPosNew[i + 1] = vPos.y;
					pPosNew[i + 2] = vPos.z;
				}

				/*var pPoints: IVec4[] = [];
				var nPointStep: float = 50;
				for (var i = 0; i < pPosInd.length; i += nPointStep) {

					var vA: IVec3 = vec3(0.);
					var fN: float = math.min(i + nPointStep, pPosInd.length);
					var nT: int = 0;

					for (var j = i; j < fN; ++ j) {
						var k: int = pPosInd[j];
						var v: float = k * 4;
						var vPos: IVec3 = vec3(pPosNew[v], pPosNew[v + 1], pPosNew[v + 2]);
						vA.add(vPos);
						nT ++;
					}

					vA.scale(1. / nT);

					var v4fWorldPos: IVec4 = pArteriesSceneModelHP.worldMatrix.multiplyVec4(vec4(vA, 1.), vec4());

					// var pBasis: ISceneModel = util.basis(pScene);
					// pBasis.attachToParent(pScene.getRootNode());
					// pBasis.scale(.02);
					// pBasis.setPosition(v4fWorldPos.xyz);
					pPoints.push(new Vec4(v4fWorldPos));
				}

				for (var i = 1; i < pPoints.length; ++ i) {
					if (pPoints[i].subtract(pPoints[i - 1], vec4()).length() > .075) {
						pPoints[i] = null;
						i ++;
					}
				}

				for (var i: int = 0; i < pPoints.length; ++ i) {
					if (isNull(pPoints[i])) continue;

					var pBasis: ISceneModel = util.basis(pScene);
					pBasis.attachToParent(pScene.getRootNode());
					pBasis.scale(.005);
					pBasis.setPosition(pPoints[i].xyz);

					console.log(pPoints[i].toString())
				}
*/
				// console.log(pPosNew);
				pPosVd.setData(pPosNew, 0, 16);
			});


			// pArteriesMeshHP.showBoundingBox();
			pArteriesMeshHP.getSubset(0).wireframe(true, false);

			pArteriesHP.scale(2.25);

			pArteriesHP.localScale.y *= 1.15;
			pArteriesHP.setPosition(-0.017, 1.1275, -0.20);
			(<ISceneNode>pArteriesHP.child).addRotationByXYZAxis(0., Math.PI/2, 0.);

			// var pBasis: ISceneModel = util.basis(pScene);
			// pBasis.attachToParent(pArteriesHP);

			window["arteries_hp"] = pArteriesHP;
		};

		
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
		var slice = (<dat.NumberControllerSlider>gui.add({slice: 0.}, 'slice')).min(0.).max(1.).step(.005);
		var opacity = (<dat.NumberControllerSlider>gui.add({opacity: fOpacity}, 'opacity')).min(0.0).max(1.).step(.01);



		opacity.onChange(function(fValue: float) {
			fOpacity = fValue;
		});

		slice.onChange(function(fValue: float) {
			pSprite.setPosition(0., fValue * pSlices.length * fSliceStep + 1., 0.);
			// console.log(fValue * pSlices.length * fSliceStep + 1.)
			
			fSlice = fValue;
			fKL = fSlice * (pSlices.length - 1.);
			iA = math.floor(fKL);
			iB = iA + 1;
			fSliceK = (fKL - iA) / (iB - iA);
		});

		pSprite.getRenderable().getRenderMethodDefault().effect.addComponent("akra.custom.arteries_slice");
		pSprite.getRenderable().bind("beforeRender", (pRenderable, pViewport, pMethod) => {
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

		pCanvas.addViewport(new render.TextureViewport(pTexTarget, 0.05, 0.05, .5 * 512/pViewport.actualWidth, .5 * 512/pViewport.actualHeight, 5.));

		// pGUI.add({"save intersection": () => {
		// 	saveAs(util.dataURItoBlob(this.getCanvasElement().toDataURL("image/png")), "screen.png");
		// }}, "save intersection");
		
	}

	pEngine.bind("depsLoaded", main);	
}