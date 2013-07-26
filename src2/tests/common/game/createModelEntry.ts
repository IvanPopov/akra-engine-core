function createModelEntry(pScene: IScene3d, sResource: string): IModelEntry {
	var pRmgr: IResourcePoolManager = pScene.getManager().getEngine().getResourceManager();
	var pModel: ICollada = <ICollada>pRmgr.colladaPool.findResource(sResource);
	var pModelRoot: IModelEntry = pModel.attachToScene(pScene);

	return pModelRoot;
}