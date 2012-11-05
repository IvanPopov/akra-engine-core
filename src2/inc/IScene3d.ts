#ifndef ISCENE3D_TS
#define ISCENE3D_TS

#include "IScene.ts"

module akra {
	export interface IScene3d extends IScene {
		recursivePreUpdate(): void;
		updateCamera(): bool;
		updateScene(): bool;
		recursiveUpdate(): void;
	}
}

#endif