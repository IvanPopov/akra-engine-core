#include "akra.ts"

module akra {
	var pEngine: IEngine = createEngine();
	var pDmgr: IDisplayManager = pEngine.getDisplayManager();

	var pView: IDisplay3d = pDmgr.createDisplay3D();
	var pScene: IScene3d = pView.getScene();


	pScene.bind(SIGNAL(nodeAttachment), function (pScene: IScene3d, pNode: ISceneNode) {
		console.log(pNode.name, "node attached");
	});

	pScene.bind(SIGNAL(nodeDetachment), function (pScene: IScene3d, pNode: ISceneNode) {
		console.log(pNode.name, "node detached");
	});

	var pRoot: ISceneNode = pScene.getRootNode();
	var pTestNode: ISceneNode = pScene.createSceneNode("test-node");

	pTestNode.attachToParent(pRoot);
	pTestNode.detachFromParent();

}