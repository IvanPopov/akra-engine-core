#ifndef LIGHTGRAPH_TS
#define LIGHTGRAPH_TS

#include "ILightGraph.ts"
#include "DisplayList.ts"
#include "light/LightPoint.ts"

module akra.scene {
	export class LightGraph extends DisplayList implements ILightGraph{
		
		constructor () {
			super();
			this.name = "LightGraph";
		}	

		protected attachObject(pNode: ISceneNode): void {
			if(light.isLightPoint(pNode)){
				console.error("light here", pNode);
			}
		}

		protected detachObject(pNode: ISceneNode): void {
			
		}
	}
}

#endif