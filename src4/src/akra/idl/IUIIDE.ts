
/// <reference path="IUIComponent.ts" />


/// <reference path="IEngine.ts" />
/// <reference path="IResourcePoolManager.ts" />
/// <reference path="IScene3d.ts" />
/// <reference path="IViewport.ts" />
/// <reference path="ICamera.ts" />
/// <reference path="ICanvas3d.ts" />
/// <reference path="IKeyMap.ts" />

module akra {
	export enum ECMD {
		SET_PREVIEW_RESOLUTION,
		SET_PREVIEW_FULLSCREEN,
		
		INSPECT_SCENE_NODE,
		INSPECT_ANIMATION_NODE,
		INSPECT_ANIMATION_CONTROLLER,
	
		
		EDIT_ANIMATION_CONTROLLER,
	
		//меняем антиалисинг
		CHANGE_AA,
	
		//редактируем код происходящие на событие eventprovider'a
		EDIT_EVENT,
		//редактируем основной код демо 
		EDIT_MAIN_SCRIPT,
	
	
		LOAD_COLLADA,
	
		CHANGE_CAMERA,
	
		SCREENSHOT
	}
	
	
	export interface IUIIDE extends IUIComponent {
		//системные объект для быстрого доступа к основным функциям API
		_apiEntry: any;

		selectedObject: ISceneObject;

		getEngine(): IEngine;
		getResourceManager(): IResourcePoolManager;
		getScene(): IScene3d;
		getViewport(): IViewport;
		getCamera(): ICamera;
		getCanvas(): ICanvas3d;

		cmd(eCommand: ECMD, ...argv: any[]): boolean;

		created: ISignal<{ (pIDE: IUIIDE): void; }>;
	}
	
	//var ide: IUIIDE = null;
}
