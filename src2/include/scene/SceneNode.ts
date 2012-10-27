///<reference path="../akra.ts" />

module akra.scene {
	export class SceneNode extends Node implements ISceneNode {
		private pEngine: IEngine = null;
		
		constructor (pEngine: IEngine) {
			super();

			this.pEngine = pEngine;
		}
	}
}