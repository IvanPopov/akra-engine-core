
/// <reference path="IMap.ts" />
/// <reference path="IRenderableObject.ts" />
/// <reference path="ISceneObject.ts" />

//RID - renderable ID, for fast searching renderable object
module akra {
	export interface IRIDTable {
	    [iSceneObjectGuid: int]: IMap<int>;
	}
	
	export interface IRIDPair {
		renderable: IRenderableObject;
		object: ISceneObject;
	}
	
	export interface IRIDMap {
		[rid: int]: IRIDPair;
	}
}
