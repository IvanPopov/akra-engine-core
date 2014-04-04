/// <reference path="../../../../built/Lib/akra.d.ts"/>

module akra {
	export function fetchAllCameras(pScene: IScene3d): ICamera[] {
		var pCameras: ICamera[] = [];
		pScene.getRootNode().explore((pEntity: IEntity): boolean => {
			if (scene.objects.Camera.isCamera(pEntity) && !scene.light.ShadowCaster.isShadowCaster(pEntity)) {
				pCameras.push(<ICamera>pEntity);
			}

			return true;
		});

		return pCameras;
	}
}
