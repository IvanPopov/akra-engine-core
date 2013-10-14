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
					{path: "textures/arteries/AG/arteries.ara"}
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
	    var fSliceStep: float = 0.008; /*m*/
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

		var pArteriesModel: IModel = pRmgr.loadModel(DATA + "/models/arteries_segment_with_bones.DAE", {shadows: false});
		var pArteriesMesh: IMesh = null;
		var pArteries: IModelEntry = null;

		pArteriesModel.bind("loaded", () => {
			pArteries = pArteriesModel.attachToScene(pScene);
			pArteries.setRotationByXYZAxis(0., math.PI, 0.);

			var pBasis: ISceneModel = util.basis(pScene);
			pBasis.scale(.25);
			pBasis.attachToParent((<ISceneModel>pArteries.child));

			var pArteriesSceneModel: ISceneModel = (<ISceneModel>pArteries.findEntity("node-Bone001[mesh-container]"));
			pArteriesMesh = pArteriesSceneModel.mesh;
			// pArteriesMesh.showBoundingBox();
			pArteriesMesh.getSubset(0).wireframe(true, false);



			(<IColor> pArteriesMesh.getSubset(0).material.emissive).set(0., 0., 0., 0.);
			(<IColor>pArteriesMesh.getSubset(0).material.ambient).set(0., 0., 0., 0.);
			(<IColor>pArteriesMesh.getSubset(0).material.diffuse).set(1., 0., 0., 0.);
			pArteries.scale(2.25);
			// pArteries.setPosition(0.03, 1.22, -0.15);

			pArteries.localScale.y *= 1.15;
			pArteries.setPosition(-0.017, 1.1275, -0.20);
			(<ISceneNode>pArteries.child).addRotationByXYZAxis(0., Math.PI/2, 0.);

			var pBasis: ISceneModel = util.basis(pScene);
			pBasis.attachToParent(pArteries);
			pBasis.scale(.1);


			pArteriesMesh.getSubset(0).getRenderMethodDefault().effect.addComponent("akra.custom.highlight_mri_slice");

			pArteriesMesh.getSubset(0).bind("beforeRender", (pRenderable, pViewportCurrent, pMethod) => {
				// console.log(pSprite.worldMatrix.multiplyVec4(vec4(0., 0., -1., 1.)).xyz);
				pMethod.setUniform("SPLICE_NORMAL", vec3(0., -1., 0.));
				pMethod.setUniform("SPLICE_D", pSprite.worldPosition.y);
			});

			var pSkeleton: ISkeleton = pArteriesMesh.skeleton;

			if (pSkeleton) {
				var pJoints: IJointMap = pSkeleton.getJointMap();
				// var pKeys: string[] = Object.keys(pJoints);

				// pKeys.sort(function (a, b) {
				//     return parseInt((/^joint([\d]+)$/g).exec(a)[1]) < parseInt((/^joint([\d]+)$/g).exec(b)[1])? -1: 1;
				// });

				// console.log(pKeys);

				for (var i in pJoints) {
					var pJoint: IJoint = pJoints[i];
					var pParent: INode = <INode>pJoint.parent;

					// var vWp: IVec3 = vec3(pJoint.worldPosition);
					// pJoint.setInheritance(ENodeInheritance.ROTPOSITION);
					// pJoint.setPosition(vWp);
					
					if (isNull(pParent)) {
						continue;
					}

					var pBone: ISceneModel = util.bone(pJoint);
					if (pParent !== pArteries)
						pBone.attachToParent(pParent);
					// console.log(pBone);

					var pBasis: ISceneModel = util.basis(pScene);
					pBasis.attachToParent(pJoint);
					pBasis.scale(.01);
				}
			}

			window["arteries_mesh"] = pArteriesMesh;
			
			window["arteries"] = pArteries;

			var gui = pGUI.addFolder('arteries');
			var controller = gui.add({visible: true}, 'visible');

			controller.onChange(function(value) {
				pArteriesMesh.getSubset(0).setVisible(value);
			});

			controller = gui.add({wireframe: true}, 'wireframe');

			controller.onChange(function(value) {
				pArteriesMesh.getSubset(0).wireframe(value, false);
			});
		});
		

		io.createFileDropArea(document.body, {
			drop: (file: File, content, format, e: DragEvent): void => {
					var pName: IPathinfo = path.info(file.name);
					var sExt: string = pName.ext.toUpperCase();

					var lines: string[] = content.split("\n");
					var format: string[] = lines[0].split(",");

					if (format[0] !== "Mx" || format[1] !== "My" || format[2] !== "Mz") {
						alert("wrong coords format: " + lines[0]);
						return;
					}

					var fTopZcoord: float = parseFloat(lines[lines.length-2].split(',')[2]);/*note: last line is empty!!*/

					var pCoords: IVec3[] = [];
					for (var i = 1; i < lines.length; ++ i) {
						if (lines[i].length < 3) continue;
						var coords: string[] = lines[i].split(",");
						
						pCoords.push(new Vec3(parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(coords[2])));
						
						var v: IVec3 = pCoords[i - 1];
						var vn: IVec3 = vec3();
						
						vn.x = (v.y * 0.01 - 1.);
						vn.z = (v.x * 0.01 - 1.) - 26 * 0.01;/*31,25 = 64 * 0,48828125 = ((512 - 384) / 2.) * (25cm / 512px)*/
						vn.y = v.z / fTopZcoord * pSlices.length * fSliceStep + 1.;
						// vn.y = v.z * 0.01 + 1.;

						v.set(vn);
					}

					// console.log(content);
					// console.log(pCoords);

					var pParam: IAnimationParameter = animation.createParameter();
					var pPoints: INode[] = [];

					for (var i = 0; i < pCoords.length; ++ i) {
						var v: IVec3 = pCoords[i];
						var pBasis: ISceneModel = util.basis(pScene);
						pBasis.attachToParent(pScene.getRootNode());
						pBasis.scale(.01);
						pBasis.setPosition(v);
						pPoints.push(pBasis);

						
                        var m: IMat4 = mat4(1.);
                        m.setTranslation(v);
                  		var pFrame: IFrame = new animation.PositionFrame(i / (pCoords.length - 1), m);
                  		// console.log(pFrame);
                        pParam.keyFrame(pFrame);
                        // console.log(">>");
					}

					pGUI.add({"apply": () => {
						
					var pSkeleton: ISkeleton = pArteriesMesh.skeleton;

					function moveJoint(j: IJoint, v: IVec3): void {
						var Au = new akra.Mat4(1.);
						Au.setTranslation(new akra.Vec3(v));
						// console.log("Au", Au.toString());
						// console.log("P0", pPoints[0].worldMatrix.toString());

						// var A0 = new akra.Mat4(j.worldMatrix);
						var A0 = new akra.Mat4(1.);
						A0.setTranslation(new akra.Vec3(j.worldPosition));
						var A0inv = A0.inverse(new akra.Mat4);
						var C = Au.multiply(A0inv, new akra.Mat4);

						// console.log(C.multiply(A0, new akra.Mat4).toString(), "C * A0");
						// console.log(Au.toString(), "Au");

						var Mp = new akra.Mat4(j.parent.worldMatrix);
						var Mo = new akra.Mat4;

						//assemble local orientaion matrix
						j.localOrientation.toMat4(Mo);
				        Mo.setTranslation(j.localPosition);
				        Mo.scaleRight(j.localScale);

						var Ml = new akra.Mat4(j.localMatrix);

						// console.log(A0.toString(), "A0");
						// console.log(Mp.multiply(Mo, new akra.Mat4).multiply(Ml).toString(), "Mp * Mo * Ml");

						var Mpinv = Mp.inverse(new akra.Mat4);
						var Moinv = Mo.inverse(new akra.Mat4);
						var Cc = Moinv.multiply(Mpinv, new akra.Mat4).multiply(C).multiply(Mp).multiply(Mo);
						var Mlc = Cc.multiply(Ml, new akra.Mat4);

						// j.localMatrix = Mlc;
						j.localMatrix = j.localMatrix.setTranslation(Mlc.getTranslation());
						j.update();
						j.recursiveUpdate();

						// console.log(j.worldPosition.toString(), "< after");
					}

					if (pSkeleton) {
						var pJoints: IJointMap = pSkeleton.getJointMap();
						var total: int = Object.keys(pJoints).length - 1;
						var n = 0;
						for (var i in pJoints) {
							var pJoint: IJoint = pJoints[i];
							var pFrame: IPositionFrame = <IPositionFrame>pParam.frame(n/total);
							moveJoint(pJoint, pFrame.translation);
							
							n ++;
						}
					}	

					

					}}, "apply");

				}
		});

		
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
			console.log(fValue * pSlices.length * fSliceStep + 1.)
			
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

		
	}

	pEngine.bind("depsLoaded", main);	
}