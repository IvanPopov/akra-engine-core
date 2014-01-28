/// <reference path="IManager.ts" />
/// <reference path="IScene.ts" />
/// <reference path="IEngine.ts" />
/// <reference path="IEngine.ts" />
/// <reference path="IScene3d.ts" />
/// <reference path="IScene2d.ts" />

module akra {
	export interface ISceneManager extends IManager {
		createScene3D(sName?: string): IScene3d;
		// createScene2D(): IScene2d;
	
		createUI(): IScene2d;
	
		getEngine(): IEngine;
	
		getScene3D(): IScene3d;
		getScene3D(sName: string): IScene3d;
		getScene3D(iScene: uint): IScene3d;
	
		getScene2D(): IScene2d;
		getScene2D(sName: string): IScene2d;
		getScene2D(iScene: uint): IScene2d;
	
		getScene(iScene?: uint, eType?: ESceneTypes): IScene;
	
		update(): void;
		// preUpdate(): void;
		notifyUpdateScene(): void;
		notifyPreUpdateScene(): void;
	}	
	
}
