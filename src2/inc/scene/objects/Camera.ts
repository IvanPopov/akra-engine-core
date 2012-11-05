#ifndef CAMERA_TS
#define CAMERA_TS

#include "IEngine.ts"
#include "ICamera.ts"
#include "../SceneObject.ts"

module akra.scene.objects {
	export class Camera extends SceneObject implements ICamera {
		constructor (pEngine: IEngine) {
			super(pEngine);
		}
	}
}

#endif