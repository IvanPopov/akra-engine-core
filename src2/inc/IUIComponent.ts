#ifndef IUICOMPONENT_TS
#define IUICOMPONENT_TS

#include "IUIDNDNode.ts"

module akra {
	export interface IUIComponentType {
		new (...argv: any[]): IUIComponent;
	}

	export interface IUIComponentOptions {
		show?: bool;
		name?: string;
		html?: string;
		css?: any;
		class?: string;
		width?: uint;
		height?: uint;
		draggable?: bool;
		//string, jQuery/HTMLElement or IUIHTMLNode
		renderTo?: any;
		//string like parent/window/document or array [x, y, w, h]
		dragZone?: any;

		generic?: string;

		//string/EUILayouts/Layout
		layout?: any;
	}

	export enum EUIComponents {
		UNKNOWN,

		WINDOW,

		BUTTON,
		PANEL,
		LABEL,
		TREE,
		CANVAS,
		SLIDER,
		CHECKBOX,
		CHECKBOX_LIST,
		
		GRAPH,
		GRAPH_NODE,
		GRAPH_CONNECTOR,
		GRAPH_CONTROLS,
		GRAPH_CONNECTIONAREA
	}

	export interface IUIComponent extends IUIDNDNode {
		readonly componentType: EUIComponents;
		readonly genericType: string;

		readonly layout: IUILayout;

		isGeneric(): bool;

		setLayout(eType: EUILayouts): bool;
		setLayout(sType: string): bool;
	}
}

#endif

