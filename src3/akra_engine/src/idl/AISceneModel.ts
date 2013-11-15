// AISceneModel interface
// [write description here...]

/// <reference path="AISceneObject.ts" />
/// <reference path="AIMesh.ts" />

interface AISceneModel extends AISceneObject {
	visible: boolean;
	mesh: AIMesh;
	isVisible(): boolean;
}


