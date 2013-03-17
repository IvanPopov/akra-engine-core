#include "ui/UI.ts"
#include "util/testutils.ts"

var ui = akra.ui;
var anim = ui.animation;

var pUI = new ui.UI();
var pRoot = null, 
	pControls = null;

test("ui basics", () => {

	pRoot = new ui.HTMLNode(pUI);
	pRoot.render();

	pControls = new anim.Controls(pRoot, pEngine);

	createEngine().bind(SIGNAL(depsLoaded), (pEngine: IEngine) => {
		var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
		var pModel: ICollada = <ICollada>pRmgr.loadModel("../../../data/models/WoodSoldier/WoodSoldier.DAE");
		var pScene: IScene3d = pEngine.getScene();

		pModel.bind(SIGNAL(loaded), (pModel: ICollada) => {
			pControls.graph.setTimer(pEngine.getTimer());			
		});
	});
});