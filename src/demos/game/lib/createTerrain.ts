/// <reference path="../../../../built/Lib/akra.d.ts"/>

module akra {
	export function createTerrain(pScene: IScene3d, bShowMegaTex: boolean = true): ITerrain {
		var pRmgr: IResourcePoolManager = pScene.getManager().getEngine().getResourceManager();
		var pTerrain: ITerrain = pScene.createTerrain("Terrain");

		var pTerrainMap: ITerrainMaps = { height: null, normal: null, shadow: null};

		pTerrainMap["height"] = <IImg>pRmgr.getImagePool().findResource("TERRAIN_HEIGHT_MAP");
		pTerrainMap["normal"] = <IImg>pRmgr.getImagePool().findResource("TERRAIN_NORMAL_MAP");
		pTerrainMap["shadow"] = <IImg>pRmgr.getImagePool().findResource("TERRAIN_SHADOW_MAP");

		// pTerrain.manualMegaTextureInit = !bShowMegaTex;
		if (pTerrain.getType() === EEntityTypes.TERRAIN_ROAM) {
			(<ITerrainROAM>pTerrain).setUseTessellationThread(false);
		}
		var isCreate: boolean = pTerrain.init(pTerrainMap, new geometry.Rect3d(-250, 250, -250, 250, 0, 150), 6, 4, 4, "main");
		pTerrain.attachToParent(pScene.getRootNode());
		pTerrain.setInheritance(ENodeInheritance.ALL);

		pTerrain.setRotationByXYZAxis(-Math.PI / 2, 0., 0.);
		pTerrain.setPosition(11, -109, -109.85);

		var pMinLevel: IImg = <IImg>pRmgr.getImagePool().findResource("MEGATEXTURE_MIN_LEVEL");
		if (pMinLevel)
			pTerrain.getMegaTexture().setMinLevelTexture(pMinLevel);

		pTerrain.setShowMegaTexture(bShowMegaTex);
		
		return pTerrain;
	}
}