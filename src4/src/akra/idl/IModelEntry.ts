
/// <reference path="ISceneNode.ts" />


/// <reference path="IModel.ts" />
/// <reference path="IAnimationController.ts" />

module akra {
	interface IModelEntry extends ISceneNode {
		resource: IModel;
	}
}
