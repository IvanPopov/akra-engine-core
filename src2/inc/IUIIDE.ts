#ifndef IUIIDE_TS
#define IUIIDE_TS

#include "IUIComponent.ts"

module akra {
	IFACE(IEngine);
	IFACE(IResourcePoolManager);
	IFACE(IScene3d);
	IFACE(IViewport);
	IFACE(ICamera);
	IFACE(ICanvas3d);
	IFACE(IKeyMap);

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


		LOAD_COLLADA
	}


	export interface IUIIDE extends IUIComponent {
		//системные объект для быстрого доступа к основным функциям API
		_apiEntry: any;

		getEngine(): IEngine;
		getResourceManager(): IResourcePoolManager;
		getScene(): IScene3d;
		getViewport(): IViewport;
		getCamera(): ICamera;
		getCanvas(): ICanvas3d;
		getKeymap(): IKeyMap;

		cmd(eCommand: ECMD, ...argv: any[]): bool;
	}

	export var ide: IUIIDE = null;
}

#endif