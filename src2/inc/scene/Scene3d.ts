#ifndef SCENE3D_TS
#define SCENE3D_TS

#include "IScene3d.ts"
#include "IDisplay3d.ts"

module akra.scene {
	export class Scene3d implements IScene3d {
		constructor (pDisplay: IDisplay3d) {

		}

		recursivePreUpdate(): void {

		}

		recursiveUpdate(): void {

		}

		updateCamera(): bool {
			return false;
		}

		updateScene(): bool {
			return false;
		}
	}
}

#endif
