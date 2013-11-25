
/// <reference path="IMap.ts" />

//RID - renderable ID, for fast searching renderable object

module akra {
	interface IRIDTable {
	    [iSceneObjectGuid: int]: IIntMap;
	}
	
	interface IRIDPair {
		renderable: IRenderableObject;
		object: ISceneObject;
	}
	
	interface IRIDMap {
		[rid: int]: IRIDPair;
	}
	
	
	
}
