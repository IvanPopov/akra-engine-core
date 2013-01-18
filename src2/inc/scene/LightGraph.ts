#ifndef LIGHTGRAPH_TS
#define LIGHTGRAPH_TS

#include "DisplayList.ts"

module akra.scene {
	export class LightGraph extends DisplayList {
		
		constructor () {
			super();
			this.name = "LightGraph";
		}	

		protected attachObject(pObject: ISceneObject): void {
			
		}

		protected detachObject(pObject: ISceneObject): void {
			
		}
	}
}

#endif