// #include "scene/OcTree.ts"
// #include "ISceneManager.ts"
// #include "core/Engine.ts"
#include "scene/OcTree.ts"
#include "akra.ts"

module akra {
	var pEngine = createEngine();
	var pSceneManager: ISceneManager = pEngine.getSceneManager();
	var pScene3D: IScene3d = pSceneManager.createScene3D();

	var pOctree: IOcTree = new scene.OcTree();
	pOctree.create(new geometry.Rect3d(1000,1000,1000),3,100);

	var i: int = pScene3D.addDisplayList(pOctree);
	debug_assert(i == DL_DEFAULT, "invalid default list index");

	var pObject: ISceneObject = new scene.SceneObject(pScene3D);
	pObject.accessLocalBounds().set(0,100,0,100,0,100);
	console.log('----local bounds----->',pObject.localBounds, pObject.worldBounds,'<----world bounds----');
	pObject.attachToParent(pScene3D.getRootNode());

	//pScene3D.recursiveUpdate();

	var pObject2: ISceneObject = new scene.SceneObject(pScene3D);
	pObject2.accessLocalBounds().set(0,200,0,200,0,200);
	console.log('----local bounds----->',pObject2.localBounds, pObject2.worldBounds,'<----world bounds----');
	pObject2.attachToParent(pScene3D.getRootNode());

	var pObject3: ISceneObject = new scene.SceneObject(pScene3D);
	pObject3.accessLocalBounds().set(250,400,250,400,250,400);
	console.log('----local bounds----->',pObject3.localBounds, pObject3.worldBounds,'<----world bounds----');
	pObject3.attachToParent(pScene3D.getRootNode());

	var pObject4: ISceneObject = new scene.SceneObject(pScene3D);
	pObject4.accessLocalBounds().set(375,450,375,450,375,450);
	console.log('----local bounds----->',pObject4.localBounds, pObject4.worldBounds,'<----world bounds----');
	pObject4.attachToParent(pScene3D.getRootNode());

	pScene3D.recursiveUpdate();
	
	console.log('----local bounds----->',pObject.localBounds, pObject.worldBounds,'<----world bounds----');
	console.log('----local bounds----->',pObject2.localBounds, pObject2.worldBounds,'<----world bounds----');
	console.log('----local bounds----->',pObject3.localBounds, pObject3.worldBounds,'<----world bounds----');
	console.log('----local bounds----->',pObject4.localBounds, pObject4.worldBounds,'<----world bounds----');
	
	// i = pScene3D.addDisplayList(new scene.LightGraph());
	// debug_assert(i == DL_LIGHTING, "invalid lighting list index");
	// console.log(pObject);
	// console.log(pScene3D);
	// console.log(pOctree);
	//	console.log(util.Entity._pEvenetTable);
	console.log(pOctree);
	console.log(pObject);
	console.log(pObject2);
	console.log(scene.SceneObject._pEvenetTable);
}