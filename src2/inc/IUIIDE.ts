#ifndef IUIIDE_TS
#define IUIIDE_TS

#include "IUIComponent.ts"

module akra {
	export enum ECMD {
		SET_PREVIEW_RESOLUTION,
		SET_PREVIEW_FULLSCREEN,
		SELECT_SCENE_NODE,

		EDIT_ANIMATION_CONTROLLER,
		EDIT_ANIMATION_MASK_NODE,

		CHANGE_AA
	}

	export interface IUIIDE extends IUIComponent {
		cmd(eCommand: ECMD, ...argv: any[]): bool;
	}

	export var ide: IUIIDE = null;
}

#endif