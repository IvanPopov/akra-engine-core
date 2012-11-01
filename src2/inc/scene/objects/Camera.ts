///<reference path="../../akra.ts" />

module akra.scene.objects {
	export class Camera extends SceneObject implements ICamera {
		constructor (pEngine: IEngine) {
			super(pEngine);
		}
	}
}