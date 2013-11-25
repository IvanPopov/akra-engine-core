
/// <reference path="ISceneObject.ts" />
/// <reference path="IMesh.ts" />

module akra {
	interface ISceneModel extends ISceneObject {
		visible: boolean;
		mesh: IMesh;
		isVisible(): boolean;
	}
	
	
	
}
