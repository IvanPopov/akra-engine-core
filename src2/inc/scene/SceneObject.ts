#ifndef SCENEOBJECT_TS
#define SCENEOBJECT_TS

#include "ISceneObject.ts"
#include "SceneNode.ts"

module akra.scene {
	export class SceneObject extends SceneNode implements ISceneObject {
		constructor (pScene: IScene3d) {
			super(pScene);
		}
	}
}

#endif
