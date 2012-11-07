#ifndef SCENENODE_TS
#define SCENENODE_TS

#include "IEngine.ts"
#include "ISceneNode.ts"
#include "scene/Node.ts"

module akra.scene {
	export class SceneNode extends Node implements ISceneNode {
		private pEngine: IEngine = null;
		
		constructor (pEngine: IEngine) {
			super();

			this.pEngine = pEngine;
		}
	}
}

#endif