function createTerrain(pScene: IScene3d): ITerrain {
	var pRmgr: IResourcePoolManager = pScene.getManager().getEngine().getResourceManager();
	var pTerrain: ITerrain = pScene.createTerrainROAM("Terrain");

	var pTerrainMap: IImageMap = <IImageMap>{};

	pTerrainMap["height"] = <IImg>pRmgr.imagePool.findResource("TERRAIN_HEIGHT_MAP");
	pTerrainMap["normal"] = <IImg>pRmgr.imagePool.findResource("TERRAIN_NORMAL_MAP");
		
	var isCreate: bool = pTerrain.init(pTerrainMap, new geometry.Rect3d(-250, 250, -250, 250, 0, 150), 6, 4, 4, "main");
	pTerrain.attachToParent(pScene.getRootNode());
	pTerrain.setInheritance(ENodeInheritance.ALL);

	pTerrain.setRotationByXYZAxis(-Math.PI/2, 0., 0.);
	pTerrain.setPosition(11, -109, -109.85);

	return pTerrain;
}