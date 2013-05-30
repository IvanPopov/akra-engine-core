#ifndef IRID_TS
#define IRID_TS

module akra {
	//RID - renderable ID, for fast searching renderable object

	export interface IRIDTable {
		[iSceneObjectGuid: int]: IntMap;
	}

	export interface IRIDPair {
		renderable: IRenderableObject;
		object: ISceneObject;
	}

	export interface IRIDMap {
		[rid: int]: IRIDPair;
	}
}

#endif