#ifndef IUIIDE_TS
#define IUIIDE_TS

#include "IUIComponent.ts"

module akra {
	export enum ECMD {
		SET_PREVIEW_RESOLUTION,
		SET_PREVIEW_FULLSCREEN,
		
		INSPECT_SCENE_NODE,
		INSPECT_ANIMATION_NODE,

		EDIT_ANIMATION_CONTROLLER,

		CHANGE_AA
	}

	export interface IUIIDE extends IUIComponent {
		cmd(eCommand: ECMD, ...argv: any[]): bool;
	}

	export var ide: IUIIDE = null;
}

#endif