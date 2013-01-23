#ifndef ISCENEMODEL_TS
#define ISCENEMODEL_TS

module akra {
	export interface ISceneModel extends ISceneObject {
		getMesh(): IMesh;
		
	}
}

#endif

