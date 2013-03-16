#ifndef LIGHTGRAPH_TS
#define LIGHTGRAPH_TS

#include "ILightGraph.ts"
#include "DisplayList.ts"
#include "light/LightPoint.ts"
#include "util/ObjectList.ts"
#include "common.ts"

module akra.scene {
	export class LightGraph extends DisplayList implements ILightGraph{
		
		protected _pLightPoints: IObjectList = new util.ObjectList();

		constructor () {
			super();
			this.name = "LightGraph";
		};

		_findObjects(pCamera: ICamera, 
				pResultArray?: IObjectArray = new util.ObjectArray(),
				bFastSearch: bool = false): IObjectArray{
			//while we ignore second parametr
			//don't have normal implementation

			pResultArray.clear();

			var pList: IObjectList = this._pLightPoints;

			var pLightPoint: ILightPoint = pList.first;

			while(isDefAndNotNull(pLightPoint)){
				
				if(pLightPoint._prepareForLighting(pCamera)){
					// LOG("light point added");
					pResultArray.push(pLightPoint);
				}

				pLightPoint = pList.next();
			}

			return pResultArray;
		};

		protected attachObject(pNode: ISceneNode): void {
			if(light.isLightPoint(pNode)){
				this._pLightPoints.push(pNode);
			}
		};

		protected detachObject(pNode: ISceneNode): void {
			if(light.isLightPoint(pNode)){
				var iPosition: int = this._pLightPoints.indexOf(pNode);
				if(iPosition != -1 ){
					this._pLightPoints.takeAt(iPosition);
				}
				else{
					debug_assert(false, "cannot find light point");
				}
			}
		};
	}
}

#endif