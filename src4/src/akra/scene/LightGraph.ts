/// <reference path="../idl/ILightGraph.ts" />
/// <reference path="../util/ObjectList.ts" />
/// <reference path="../common.ts" />

/// <reference path="light/LightPoint.ts" />
/// <reference path="DisplayList.ts" />

module akra.scene {

	import LightPoint = light.LightPoint;

	export class LightGraph extends DisplayList<ILightPoint> implements ILightGraph {
		protected _pLightPoints: IObjectList<ILightPoint> = new util.ObjectList<ILightPoint>();

		constructor() {
			super("LightGraph");
		}

		_findObjects(pCamera: ICamera,
			pResultArray: IObjectArray<ILightPoint> = null,
			bFastSearch: boolean = false): IObjectArray<ILightPoint> {

			if (isNull(pResultArray)) {
				pResultArray = new util.ObjectArray<ILightPoint>();
			}

			//while we ignore second parametr
			//don't have normal implementation

			pResultArray.clear();

			var pList: IObjectList<ILightPoint> = this._pLightPoints;

			var pLightPoint: ILightPoint = pList.getFirst();

			while (isDefAndNotNull(pLightPoint)) {

				if (pLightPoint._prepareForLighting(pCamera)) {
					// LOG("light point added");
					pResultArray.push(pLightPoint);
				}

				pLightPoint = pList.next();
			}

			return pResultArray;
		}

		protected attachObject(pNode: ISceneNode): void {
			if (LightPoint.isLightPoint(pNode)) {
				this._pLightPoints.push(<ILightPoint>pNode);
			}
		}

		protected detachObject(pNode: ISceneNode): void {
			if (LightPoint.isLightPoint(pNode)) {
				var iPosition: int = this._pLightPoints.indexOf(<ILightPoint>pNode);
				if (iPosition != -1) {
					this._pLightPoints.takeAt(iPosition);
				}
				else {
					debug.assert(false, "cannot find light point");
				}
			}
		}
	}
}
