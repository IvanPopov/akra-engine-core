/// <reference path="../../../../built/Lib/akra.d.ts"/>

module akra {
	export function createModelEntry(pScene: IScene3d, sResource: string): IModelEntry {
		var pRmgr: IResourcePoolManager = pScene.getManager().getEngine().getResourceManager();
		var pModel: ICollada = <ICollada>pRmgr.getColladaPool().findResource(sResource);
		var pModelRoot: IModelEntry = pModel.attachToScene(pScene);

		return pModelRoot;
	}
}