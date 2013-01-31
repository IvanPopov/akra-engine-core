#include "inc/akra.ts"

module akra {
	var pEngine = createEngine();
	var pSceneManager: ISceneManager = pEngine.getSceneManager();
	var pScene3D: IScene3d = pSceneManager.createScene3D();

	var pOctree: IOcTree = new scene.OcTree();
	pOctree.create(new geometry.Rect3d(1000,1000,1000),1,100);

	var i: int = pScene3D.addDisplayList(pOctree);
	debug_assert(i == DL_DEFAULT, "invalid default list index");

	var pObject: ISceneObject = new scene.SceneObject(pScene3D);
	pObject.accessLocalBounds().set(-100,100,-100,100,-100,100);
	pObject.attachToParent(pScene3D.getRootNode());

	pScene3D.recursiveUpdate();
	
	// i = pScene3D.addDisplayList(new scene.LightGraph());
	// debug_assert(i == DL_LIGHTING, "invalid lighting list index");
	// console.log(pObject);
	// console.log(pScene3D);
	// console.log(pOctree);
//	console.log(util.Entity._pEvenetTable);
	console.log(pOctree);
	console.log(pObject);
	console.log(scene.SceneObject._pEvenetTable);
}