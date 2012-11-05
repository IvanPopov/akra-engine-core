#ifndef SCENEOBJECT_TS
#define SCENEOBJECT_TS

#include "IEngine.ts"
#include "ISceneObject.ts"
#include "SceneNode.ts"

module akra.scene {
	export class SceneObject extends SceneNode implements ISceneObject {
		constructor (pEngine: IEngine) {
			super(pEngine);
		}
	}
}

#endif
