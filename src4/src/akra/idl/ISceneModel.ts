
/// <reference path="ISceneObject.ts" />
/// <reference path="IMesh.ts" />

module akra {
	export interface ISceneModel extends ISceneObject {
		getVisible(): boolean;
		setVisible(bValue: boolean): void;

		getMesh(): IMesh;
		setMesh(pMesh: IMesh): void;

		isVisible(): boolean;
	}
	
	
	
}
