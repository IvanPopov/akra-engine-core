// AIRID interface
// [write description here...]

/// <reference path="AIMap.ts" />

//RID - renderable ID, for fast searching renderable object

interface AIRIDTable {
    [iSceneObjectGuid: int]: AIIntMap;
}

interface AIRIDPair {
	renderable: AIRenderableObject;
	object: AISceneObject;
}

interface AIRIDMap {
	[rid: int]: AIRIDPair;
}


