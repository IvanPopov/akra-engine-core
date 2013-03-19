#ifndef IUILAYOUT_TS
#define IUILAYOUT_TS

#include "IUIHTMLNode.ts"

module akra {
	export enum EUILayouts {
		UNKNOWN,
		HORIZONTAL,
		VERTICAL
	}

	export interface IUILayoutAttributes {
		comment?: string;
	}

	export interface IUILayout extends IUIHTMLNode {
		layoutType: EUILayouts;

		setAttributes(pAttrs: IUILayoutAttributes): void;
		attr(sAttr: string): any;
	}
}

#endif

