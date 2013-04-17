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
		//string, string[]
		events?: any;
		parent?: IUIComponent;
		template?: string;
	}

	export enum EUIComponents {
		UNKNOWN,

		WINDOW,

		BUTTON,
		SWITCH,
		PANEL,
		POPUP,
		TABS,
		LABEL,
		VECTOR,
		MENU,
		TREE,
		TREE_NODE,
		CANVAS,
		SLIDER,
		CHECKBOX,
		CHECKBOX_LIST,
		VIEWPORT_STATS,
		
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

		createComponent(sType: string, pOptions?: IUIComponentOptions): IUIComponent;

		_createdFrom($component: JQuery): void;

		template(sURL: string, pData?: any): void;
		fromStringTemplate(sTpl: string, pData?: any): void;
	}
}

#endif

