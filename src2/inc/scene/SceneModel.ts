#ifndef SCENEMODEL_TS
#define SCENEMODEL_TS

#include "ISceneModel.ts"
#include "model/Mesh.ts"

module akra {
	export class SceneModel implements ISceneModel {
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