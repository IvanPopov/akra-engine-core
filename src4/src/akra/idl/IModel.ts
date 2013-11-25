
/// <reference path="ICollada.ts" />


/// <reference path="IAnimationBase.ts" />
/// <reference path="ISceneNode.ts" />
/// <reference path="IScene3d.ts" />
/// <reference path="ISkeleton.ts" />
/// <reference path="IMesh.ts" />

module akra {
	enum EModelFormats {
		UNKNOWN,
		COLLADA = 0x1000,
		OBJ = 0x2000
	}
	
	interface IModelLoadOptions {
	
	}
	
	interface IModel extends IResourcePoolItem {
		byteLength: uint;
	
		modelFormat: EModelFormats;
	
		loadResource(sFilename?: string, pOptions?: IModelLoadOptions): boolean;
		attachToScene(pNode: ISceneNode): IModelEntry;
		attachToScene(pScene: IScene3d): IModelEntry;
	}
}
