#ifndef IUICOMPONENT_TS
#define IUICOMPONENT_TS

#include "IUIDNDNode.ts"

module akra {
	export interface IUIComponentOptions {
		show?: bool;
		name?: string;
		html?: string;
		css?: string;
		width?: uint;
		height?: uint;
		draggable?: bool;
		//string, jQuery/HTMLElement or IUIHTMLNode
		renderTo?: any;
		//string like parent/window/document or array [x, y, w, h]
		dragZone?: any;
	}

	export enum EUIComponents {
		UNKNOWN,
		
		BUTTON,
		LABEL,
		TREE,
		CANVAS,
		SLIDER,
		CHECKBOX,
		CHECKBOX_LIST
	}

	export interface IUIComponent extends IUIDNDNode {
		readonly componentType: EUIComponents;
	}
}

#endif

