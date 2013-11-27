
/// <reference path="IMap.ts" />

//RID - renderable ID, for fast searching renderable object

module akra {
	export interface IRIDTable {
	    [iSceneObjectGuid: int]: IIntMap;
	}
	
	export interface IRIDPair {
		renderable: IRenderableObject;
		object: ISceneObject;
	}
	
	export interface IRIDMap {
		[rid: int]: IRIDPair;
	}
	
	
	
}
