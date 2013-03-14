// #include "scene/OcTree.ts"
// #include "ISceneManager.ts"
// #include "core/Engine.ts"
#include "scene/OcTree.ts"
#include "scene/LightGraph.ts"
#include "scene/light/ProjectLight.ts"
#include "scene/light/OmniLight.ts"
#include "akra.ts"

module akra {
	var pEngine: IEngine = createEngine();
	var pSceneManager: ISceneManager = pEngine.getSceneManager();
	var pScene3D: IScene3d = pSceneManager.createScene3D();

	// if (pEngine.getRenderer().debug(true, true)) {
	// 	LOG("context debugging enabled");
	// }

	var iLevel: uint = 6;
	var iWorldSizeX: uint = 1024;
	var iWorldSizeY: uint = 1024;
	var iWorldSizeZ: uint = 1024;

	var pOctree: IOcTree = new scene.OcTree();
	pOctree.create(new geometry.Rect3d(iWorldSizeX, iWorldSizeY, iWorldSizeZ),iLevel,100);

	var i: int = pScene3D.addDisplayList(pOctree);
	debug_assert(i == DL_DEFAULT, "invalid default list index");

	var pLightGraph: ILightGraph = new scene.LightGraph();

	i = pScene3D.addDisplayList(pLightGraph);
	debug_assert(i == DL_LIGHTING, "invalid default list index");

	var pObject: ISceneObject;

	var iMax: uint = 1 << iLevel;

	var iStepX: uint = iWorldSizeX/iMax;
	var iStepZ: uint = iWorldSizeZ/iMax;

	for(var i=0; i<iMax; i++){
		for(var j=0; j<iMax; j++){
			pObject = new scene.SceneObject(pScene3D);
			pObject.create();
			pObject.accessLocalBounds().set(-iWorldSizeX/2 + i*iStepX, -iWorldSizeX/2 + (i+1)*iStepX,
											-10,10,
											-iWorldSizeZ/2 + j*iStepZ, -iWorldSizeZ/2 + (j+1)*iStepZ);
			pObject.attachToParent(pScene3D.getRootNode());

			pObject.hasShadows = true;
		}
	}

	// var pObject: ISceneObject = new scene.SceneObject(pScene3D);
	// pObject.create();
	// pObject.accessLocalBounds().set(0,100,0,100,0,100);
	// pObject.attachToParent(pScene3D.getRootNode());

	//pScene3D.recursiveUpdate();

	// var pObject2: ISceneObject = new scene.SceneObject(pScene3D);
	// pObject2.create();
	// pObject2.accessLocalBounds().set(0,10,0,10,-500,-400);
	// pObject2.attachToParent(pScene3D.getRootNode());

	// var pObject3: ISceneObject = new scene.SceneObject(pScene3D);
	// pObject3.create();
	// pObject3.accessLocalBounds().set(0,10,0,10,-500,-475);
	// pObject3.attachToParent(pScene3D.getRootNode());

	// var pObject4: ISceneObject = new scene.SceneObject(pScene3D);
	// pObject4.create();
	// pObject4.accessLocalBounds().set(0,10,0,10,-475,-450);
	// pObject4.attachToParent(pScene3D.getRootNode());

	// var pObject5: ISceneObject = new scene.SceneObject(pScene3D);
	// pObject5.create();
	// pObject5.accessLocalBounds().set(0,10,0,10,-300,-100);
	// pObject5.attachToParent(pScene3D.getRootNode());

	pScene3D.recursiveUpdate();
	//pScene3D.recursiveUpdate();

	var pCamera: ICamera = new scene.objects.Camera(pScene3D);
	pCamera.create();
	pCamera.attachToParent(pScene3D.getRootNode());

	pScene3D.recursiveUpdate();

	var pLight: IProjectLight = new scene.light.ProjectLight(pScene3D, false, 512);
	pLight.create();
	pLight.attachToParent(pScene3D.getRootNode());
	pLight.addPosition(-300, 0, 0);

	pLight.isShadowCaster = false;

	// pLight.localMatrix = Mat4.fromYawPitchRoll(0*math.PI/6,0.,0.);

	pScene3D.recursiveUpdate();

	var iCanvasSize: uint = 512;

	var pCanvas: any = document.createElement('canvas');
	pCanvas.width = iCanvasSize;
	pCanvas.height = iCanvasSize;
	document.body.appendChild(pCanvas);

	//display results

	var pResult: any, pResult2: any;

	function displayResult(){
		var iStep: float = iCanvasSize/ (1 << iLevel);

		var pContext2d = pCanvas.getContext('2d');

		//clear
		pContext2d.clearRect(0, 0, iCanvasSize, iCanvasSize);

		//draw objects

		pContext2d.beginPath();

		pContext2d.strokeStyle = "rgb(255,0,0)";
		pContext2d.lineWidth = 1;

		for(var i:int = 0; i<pResult.length; i++){

			var pObject: ISceneObject = pResult.value(i);

			var pRect: IRect3d  = pObject.worldBounds;

			var fX0: float = (pRect.x0 + iWorldSizeX/2)/iWorldSizeX * iCanvasSize;
			var fX1: float = (pRect.x1 + iWorldSizeX/2)/iWorldSizeX * iCanvasSize;
			var fY0: float = (pRect.z0 + iWorldSizeZ/2)/iWorldSizeZ * iCanvasSize;
			var fY1: float = (pRect.z1 + iWorldSizeZ/2)/iWorldSizeZ * iCanvasSize;


			pContext2d.moveTo(fX0,fY0);
			pContext2d.lineTo(fX0,fY1);
			pContext2d.lineTo(fX1,fY1);
			pContext2d.lineTo(fX1,fY0);
			pContext2d.lineTo(fX0,fY0);
			pContext2d.stroke();
		
		}

		pContext2d.closePath();

		//draw camera frusum
		
		pContext2d.beginPath();
		pContext2d.strokeStyle = "rgb(0,255,0)";
		pContext2d.lineWidth = 3;

		var pFrustumVertices: IVec3[] = pCamera.frustum.frustumVertices;

		var pVertex0: IVec3 = new Vec3();
		var pVertex1: IVec3 = new Vec3();
		var pVertex2: IVec3 = new Vec3();
		var pVertex3: IVec3 = new Vec3();
		pFrustumVertices[0].add(pFrustumVertices[2], pVertex0).scale(0.5);
		pFrustumVertices[1].add(pFrustumVertices[3], pVertex1).scale(0.5);
		pFrustumVertices[4].add(pFrustumVertices[6], pVertex2).scale(0.5);
		pFrustumVertices[5].add(pFrustumVertices[7], pVertex3).scale(0.5);

		pVertex0.add(vec3(iWorldSizeX/2, iWorldSizeY/2, iWorldSizeZ/2));
		pVertex1.add(vec3(iWorldSizeX/2, iWorldSizeY/2, iWorldSizeZ/2));
		pVertex2.add(vec3(iWorldSizeX/2, iWorldSizeY/2, iWorldSizeZ/2));
		pVertex3.add(vec3(iWorldSizeX/2, iWorldSizeY/2, iWorldSizeZ/2));

		pVertex0.x*=iCanvasSize/iWorldSizeX;
		pVertex0.y*=iCanvasSize/iWorldSizeY;
		pVertex0.z*=iCanvasSize/iWorldSizeZ;

		pVertex1.x*=iCanvasSize/iWorldSizeX;
		pVertex1.y*=iCanvasSize/iWorldSizeY;
		pVertex1.z*=iCanvasSize/iWorldSizeZ;

		pVertex2.x*=iCanvasSize/iWorldSizeX;
		pVertex2.y*=iCanvasSize/iWorldSizeY;
		pVertex2.z*=iCanvasSize/iWorldSizeZ;

		pVertex3.x*=iCanvasSize/iWorldSizeX;
		pVertex3.y*=iCanvasSize/iWorldSizeY;
		pVertex3.z*=iCanvasSize/iWorldSizeZ;

		pContext2d.moveTo(pVertex0.x,pVertex0.z);
		pContext2d.lineTo(pVertex1.x,pVertex1.z);
		pContext2d.lineTo(pVertex3.x,pVertex3.z);
		pContext2d.lineTo(pVertex2.x,pVertex2.z);
		pContext2d.lineTo(pVertex0.x,pVertex0.z);
		pContext2d.stroke();

		pContext2d.closePath();

		//////////////////////////////////////

		for(var j: uint=0;j<pResult2.length;j++){

			var pActiveLight: any = pResult2.value(j);

			//draw light affected objects

			pContext2d.beginPath();

			pContext2d.strokeStyle = "rgb(128,0,128)";
			pContext2d.lineWidth = 2;

			var pAffectedObjects: IObjectArray = pActiveLight.getShadowCaster().affectedObjects;

			for(var i:int = 0; i<pAffectedObjects.length; i++){
				var pObject: ISceneObject = pAffectedObjects.value(i);

				var pRect: IRect3d  = pObject.worldBounds;

				var fX0: float = (pRect.x0 + iWorldSizeX/2)/iWorldSizeX * iCanvasSize;
				var fX1: float = (pRect.x1 + iWorldSizeX/2)/iWorldSizeX * iCanvasSize;
				var fY0: float = (pRect.z0 + iWorldSizeZ/2)/iWorldSizeZ * iCanvasSize;
				var fY1: float = (pRect.z1 + iWorldSizeZ/2)/iWorldSizeZ * iCanvasSize;


				pContext2d.moveTo(fX0,fY0);
				pContext2d.lineTo(fX0,fY1);
				pContext2d.lineTo(fX1,fY1);
				pContext2d.lineTo(fX1,fY0);
				pContext2d.lineTo(fX0,fY0);
				pContext2d.stroke();
			
			}

			pContext2d.closePath();

			//draw light frusum
			
			pContext2d.beginPath();
			pContext2d.strokeStyle = "rgb(0,0,255)";
			pContext2d.lineWidth = 3;

			var pFrustumVertices: IVec3[] = pActiveLight.getShadowCaster().frustum.frustumVertices;

			var pVertex0: IVec3 = new Vec3();
			var pVertex1: IVec3 = new Vec3();
			var pVertex2: IVec3 = new Vec3();
			var pVertex3: IVec3 = new Vec3();
			pFrustumVertices[0].add(pFrustumVertices[2], pVertex0).scale(0.5);
			pFrustumVertices[1].add(pFrustumVertices[3], pVertex1).scale(0.5);
			pFrustumVertices[4].add(pFrustumVertices[6], pVertex2).scale(0.5);
			pFrustumVertices[5].add(pFrustumVertices[7], pVertex3).scale(0.5);

			pVertex0.add(vec3(iWorldSizeX/2, iWorldSizeY/2, iWorldSizeZ/2));
			pVertex1.add(vec3(iWorldSizeX/2, iWorldSizeY/2, iWorldSizeZ/2));
			pVertex2.add(vec3(iWorldSizeX/2, iWorldSizeY/2, iWorldSizeZ/2));
			pVertex3.add(vec3(iWorldSizeX/2, iWorldSizeY/2, iWorldSizeZ/2));

			pVertex0.x*=iCanvasSize/iWorldSizeX;
			pVertex0.y*=iCanvasSize/iWorldSizeY;
			pVertex0.z*=iCanvasSize/iWorldSizeZ;

			pVertex1.x*=iCanvasSize/iWorldSizeX;
			pVertex1.y*=iCanvasSize/iWorldSizeY;
			pVertex1.z*=iCanvasSize/iWorldSizeZ;

			pVertex2.x*=iCanvasSize/iWorldSizeX;
			pVertex2.y*=iCanvasSize/iWorldSizeY;
			pVertex2.z*=iCanvasSize/iWorldSizeZ;

			pVertex3.x*=iCanvasSize/iWorldSizeX;
			pVertex3.y*=iCanvasSize/iWorldSizeY;
			pVertex3.z*=iCanvasSize/iWorldSizeZ;

			pContext2d.moveTo(pVertex0.x,pVertex0.z);
			pContext2d.lineTo(pVertex1.x,pVertex1.z);
			pContext2d.lineTo(pVertex3.x,pVertex3.z);
			pContext2d.lineTo(pVertex2.x,pVertex2.z);
			pContext2d.lineTo(pVertex0.x,pVertex0.z);
			pContext2d.stroke();

			pContext2d.closePath();
		}
	};

	console.log(pOctree);
	// console.log(pOctree._toSimpleObject());
	// console.warn(pCamera);

	// console.error(pCamera.display(DL_LIGHTING));
	

	window.setInterval(function(){
		
		var pDate1: any = new Date();
		pResult = pCamera.display(DL_DEFAULT);
		var pDate2: any = new Date();
		pResult2 = pCamera.display(DL_LIGHTING);
		var pDate3: any = new Date();

		console.error(pDate2 - pDate1, pDate3 - pDate2);

		displayResult();

		pCamera.addRelRotationByEulerAngles(0.1, 0, 0);
		pScene3D.recursiveUpdate();
								}
								, 3000)


}

