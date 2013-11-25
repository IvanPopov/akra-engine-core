
/// <reference path="IEventProvider.ts" />
/// <reference path="ISceneManager.ts" />

module akra {
	enum ESceneTypes {
		TYPE_3D,
		TYPE_2D
	}
	
	interface IScene extends IEventProvider {
		type: ESceneTypes;
		name: string;
	
		getManager(): ISceneManager;
	}
	
	
}
