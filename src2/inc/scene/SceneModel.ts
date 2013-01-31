#ifndef SCENEMODEL_TS
#define SCENEMODEL_TS

#include "ISceneModel.ts"
#include "model/Mesh.ts"
#include "SceneObject.ts"


module akra.scene {
	export class SceneModel extends SceneObject implements ISceneModel {
		mesh: IMesh = null;

		inline get totalRenderable(): uint {
			return this.mesh? this.mesh.length: 0;
		}

		inline getRenderable(i: uint = 0): IRenderableObject {
			//return this.mesh
			return null;
		}
	}	
}

#endif