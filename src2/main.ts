#include "inc/akra.ts"

module akra {
	var engine: IEngine = createEngine();
	var dmgr: IDisplayManager = engine.getDisplayManager();
	var view: IDisplay3d = dmgr.createDisplay3D();
	var scene: IScene = view.getScene();
}