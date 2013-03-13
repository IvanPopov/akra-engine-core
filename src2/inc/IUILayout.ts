#ifndef IUILAYOUT_TS
#define IUILAYOUT_TS

#include "IUINode.ts"

module akra {
	export enum EUILayouts {
		UNKNOWN,
		HORIZONTAL,
		VERTICAL
	}

	export interface IUILayout extends IUINode {
		layoutType: EUILayouts;
	}
}

#endif

