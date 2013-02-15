// #include "scene/OcTree.ts"
// #include "ISceneManager.ts"
// #include "core/Engine.ts"
#include "scene/OcTree.ts"
#include "scene/LightGraph.ts"
#include "scene/light/ProjectLight.ts"
#include "akra.ts"

module akra {
	var pEngine = createEngine();
	var pSceneManager: ISceneManager = pEngine.getSceneManager();
	var pScene3D: IScene3d = pSceneManager.createScene3D();

	var pOctree: IOcTree = new scene.OcTree();
	pOctree.create(new geometry.Rect3d(1000,1000,1000),5,100);

	var i: int = pScene3D.addDisplayList(pOctree);
	debug_assert(i == DL_DEFAULT, "invalid default list index");

	var pLightGraph: ILightGraph = new scene.LightGraph();

	i = pScene3D.addDisplayList(pLightGraph);
	debug_assert(i == DL_LIGHTING, "invalid default list index");

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

	var pObject5: ISceneObject = new scene.SceneObject(pScene3D);
	pObject5.create();
	pObject5.accessLocalBounds().set(0,10,0,10,-300,-100);
	pObject5.attachToParent(pScene3D.getRootNode());

	pScene3D.recursiveUpdate();
	//pScene3D.recursiveUpdate();

	var pCamera: ICamera = new scene.objects.Camera(pScene3D);
	pCamera.create();
	pCamera.attachToParent(pScene3D.getRootNode());

	pScene3D.recursiveUpdate();

	var pLight: IProjectLight = new scene.light.ProjectLight(pScene3D);
	pLight.create();
	pLight.attachToParent(pScene3D.getRootNode());

	//var pResult: any = pOctree._buildSearchResults(pCamera.searchRect, pCamera.frustum);
	var pResult: any = pCamera.display(DL_DEFAULT);

	console.log(pOctree);
	console.log(pOctree._toSimpleObject());
	console.warn(pResult);
	console.warn(pCamera);
	console.log(scene.objects.Camera._pEventTable);
}