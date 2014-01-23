
/// <reference path="IUINode.ts" />
/// <reference path="3d-party/jquery.d.ts" />
/// <reference path="IEventProvider.ts" />

module akra {
	export interface IUIEvent extends JQueryEventObject {}
	
	export interface IUIHTMLNode extends IUINode {
		$element: JQuery;
		el: JQuery;
	
		getHTMLElement(): HTMLElement;
	
		isFocused(): boolean;
		isRendered(): boolean;
	
		width(): uint;
		height(): uint;
	
		attachToParent(pParent: IUIHTMLNode, bRender?: boolean): boolean;
	
		handleEvent(sEvent: string): boolean;
		disableEvent(sEvent: string): void;
	
		show(): void;
		hide(): void;
	
		click: ISignal<{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;
		dblclick: ISignal <{ (pNode: IUIHTMLNode, e: IUIEvent): void ; }>;

		mousemove: ISignal <{(pNode: IUIHTMLNode, e: IUIEvent): void; }>;
		mouseup: ISignal <{ (pNode: IUIHTMLNode, e: IUIEvent): void ; }>;
		mousedown: ISignal <{ (pNode: IUIHTMLNode, e: IUIEvent): void ; }>;
		mouseover: ISignal <{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;
		mouseout: ISignal <{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;
		mouseenter: ISignal <{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;
		mouseleave: ISignal <{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;

		focusin: ISignal <{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;
		focusout: ISignal <{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;

		blur: ISignal <{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;
		change: ISignal <{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;

		keydown: ISignal <{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;
		keyup: ISignal <{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;

		resize: ISignal <{ (pNode: IUIHTMLNode): void; }>;
		rendered: ISignal <{ (pNode: IUIHTMLNode): void; }>;
		beforeRender: ISignal <{ (pNode: IUIHTMLNode): void; }>;
	}
	
}
