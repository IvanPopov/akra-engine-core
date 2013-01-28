#ifndef ISCENEMODEL_TS
#define ISCENEMODEL_TS

#include "ISceneObject.ts"

module akra {
	IFACE (IMesh);

	export interface ISceneModel extends ISceneObject {
		mesh: IMesh;

	}
}

#endif

