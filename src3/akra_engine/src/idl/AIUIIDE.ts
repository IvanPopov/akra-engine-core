// AIUIIDE interface
// [write description here...]

/// <reference path="AIUIComponent.ts" />


/// <reference path="AIEngine.ts" />
/// <reference path="AIResourcePoolManager.ts" />
/// <reference path="AIScene3d.ts" />
/// <reference path="AIViewport.ts" />
/// <reference path="AICamera.ts" />
/// <reference path="AICanvas3d.ts" />
/// <reference path="AIKeyMap.ts" />

enum AECMD {
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


interface AIUIIDE extends AIUIComponent {
	//системные объект для быстрого доступа к основным функциям API
	_apiEntry: any;

	selectedObject: AISceneObject;

	getEngine(): AIEngine;
	getResourceManager(): AIResourcePoolManager;
	getScene(): AIScene3d;
	getViewport(): AIViewport;
	getCamera(): AICamera;
	getCanvas(): AICanvas3d;

	cmd(eCommand: AECMD, ...argv: any[]): boolean;

	signal created(): void;
}

var ide: AIUIIDE = null;