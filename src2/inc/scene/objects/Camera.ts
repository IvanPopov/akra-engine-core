#ifndef CAMERA_TS
#define CAMERA_TS

#include "IScene3d.ts"
#include "ICamera.ts"
#include "../SceneObject.ts"

module akra.scene.objects {
	export class Camera extends SceneObject implements ICamera {
		constructor (pScene: IScene3d) {
			super(pScene);

			this.type = EEntityTypes.CAMERA;
		}
	}
}

#endif