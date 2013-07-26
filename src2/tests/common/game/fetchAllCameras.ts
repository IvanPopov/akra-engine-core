function fetchAllCameras(pScene: IScene3d): ICamera[] {
	var pCameras: ICamera[] = [];
	pScene.getRootNode().explore((pEntity: IEntity): bool => {
		if (scene.objects.isCamera(pEntity) && !scene.light.isShadowCaster(pEntity)) {
			pCameras.push(<ICamera>pEntity);
		}

		return true;
	});

	return pCameras;
}