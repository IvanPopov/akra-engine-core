function putOnTerrain(pNode: ISceneNode, pTerrain: ITerrain, v3fPlace?: IVec3): void {
	if (!isDef(v3fPlace)) {
		v3fPlace = pNode.worldPosition;
	}

	var v3fsp: IVec3 = new Vec3;

	if (pTerrain.projectPoint(v3fPlace, v3fsp)) {
		pNode.setPosition(v3fsp);
	}
}