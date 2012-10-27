///<reference path="../akra.ts" />

module akra.scene {
	export class SceneObject extends SceneNode implements ISceneObject {
		constructor (pEngine: IEngine) {
			super(pEngine);
		}
	}
}