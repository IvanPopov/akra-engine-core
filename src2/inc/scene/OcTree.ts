#ifndef OCTREE_TS
#define OCTREE_TS

#include "DisplayList.ts"

module akra.scene {
	export class OcTree extends DisplayList {
		
		constructor () {
			super();
			this.name = "OcTree";
		}	

		protected attachObject(pObject: ISceneObject): void {
			
		}

		protected detachObject(pObject: ISceneObject): void {
			
		}
	}
}

#endif