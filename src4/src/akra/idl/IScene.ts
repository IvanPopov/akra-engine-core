
/// <reference path="IEventProvider.ts" />
/// <reference path="ISceneManager.ts" />

module akra {
	export enum ESceneTypes {
		TYPE_3D,
		TYPE_2D
	}
	
	export interface IScene extends IEventProvider {
		type: ESceneTypes;
		name: string;
	
		getManager(): ISceneManager;
	}
	
	
}
