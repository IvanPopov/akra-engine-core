
/// <reference path="IUIDNDNode.ts" />

module akra {
	export interface IUIComponentOptions {
	    show?: boolean;
	    name?: string;
	    html?: string;
	    css?: any;
	    class?: string;
	    width?: uint;
	    height?: uint;
	    draggable?: boolean;
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
	
	    CODE_EDITOR,
	    // LISTENER_EDITOR,
	
	    COLLADA_ANIMATION,
	
	    GRAPH,
	    GRAPH_NODE,
	    GRAPH_CONNECTOR,
	    GRAPH_CONTROLS,
	    GRAPH_CONNECTIONAREA
	}
	
	export interface IUIComponent extends IUIDNDNode {
	    getComponentType(): EUIComponents;
	    getGenericType(): string;
	    isGeneric(): boolean;
	
	    getLayout(): IUILayout;	
	    setLayout(eType: EUILayouts): boolean;
	    setLayout(sType: string): boolean;
	
	    createComponent(sType: string, pOptions?: IUIComponentOptions): IUIComponent;
	
	    _createdFrom($component: JQuery): void;
	
	    template(sURL: string, pData?: any): void;
	    fromStringTemplate(sTpl: string, pData?: any): void;
	}
	
	
	
}
