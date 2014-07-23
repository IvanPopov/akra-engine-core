/// <reference path="../../../../built/Lib/akra.d.ts"/>

module akra {
	export function createSky(pScene: IScene3d, fTime: number = 14.0): model.Sky {
		var pEngine: IEngine = pScene.getManager().getEngine();
		var pSky = new model.Sky(pEngine, 32, 32, 1000.0);
		pSky.setTime(fTime);
		pSky.skyDome.attachToParent(pScene.getRootNode());
		return pSky;
	}
}