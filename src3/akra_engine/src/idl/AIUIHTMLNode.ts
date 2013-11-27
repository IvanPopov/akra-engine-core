// AIUIHTMLNode interface
// [write description here...]

/// <reference path="AIUINode.ts" />
/// <reference path="3d-party/jquery.d.ts" />

interface IUIEvent extends JQueryEventObject {}

interface AIUIHTMLNode extends AIUINode  {
	$element: JQuery;
	el: JQuery;

	getHTMLElement(): HTMLElement;

	isFocused(): boolean;
	isRendered(): boolean;

	width(): uint;
	height(): uint;

	attachToParent(pParent: AIUINode, bRender?: boolean): boolean;

	handleEvent(sEvent: string): boolean;
	disableEvent(sEvent: string): void;

	show(): void;
	hide(): void;

	signal click(e: IUIEvent): void;
	signal dblclick(e: IUIEvent): void;
	
	signal mousemove(e: IUIEvent): void;
	signal mouseup(e: IUIEvent): void;
	signal mousedown(e: IUIEvent): void;
	signal mouseover(e: IUIEvent): void;
	signal mouseout(e: IUIEvent): void;
	
	signal focusin(e: IUIEvent): void;
	signal focusout(e: IUIEvent): void;

	signal blur(e: IUIEvent): void;
	signal change(e: IUIEvent): void;

	signal keydown(e: IUIEvent): void;
	signal keyup(e: IUIEvent): void;

	signal rendered(): void;
	signal beforeRender(): void;
}
