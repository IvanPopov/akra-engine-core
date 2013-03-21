#include "akra.ts"
#include "util/testutils.ts"


var ui = akra.ui;
var anim = ui.animation;

var pUI = new ui.UI();
var pRoot = null, 
	pControls = null;

test("ui basics", () => {

	pRoot = new ui.HTMLNode(pUI);/*ui.Window(pUI);*/
	pControls = new anim.Controls(pRoot);

	pRoot.render();

	akra.createEngine().bind(SIGNAL(depsLoaded), (pEngine: akra.IEngine) => {
		var pRmgr = pEngine.getResourceManager();
		var pModel = <akra.ICollada>pRmgr.loadModel("../../../data/models/WoodSoldier/WoodSoldier.DAE");
		var pScene = pEngine.getScene();
		var pController = akra.animation.createController();

		

		pModel.bind(SIGNAL(loaded), (pModel: akra.ICollada) => {
			pModel.attachToScene(pScene, pController);
			
			pControls.graph.capture(pController);
			pControls.graph.setTimer(pEngine.getTimer());			
		});
	});
});