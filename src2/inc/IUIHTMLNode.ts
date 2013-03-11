#ifndef IUIHTMLNODE_TS
#define IUIHTMLNODE_TS

#include "IUINode.ts"

module akra {
	export interface IUIEventListener {
		(e: Event): any;
	}

	export interface IUIEvent extends Event, MSEventObj {
		isFixed?: bool;
		target?: Element;
		relatedTarget?: Element;
		fromElement?: Element;
		which?: int;

		pageX?: int;
		pageY?: int;
	}

	export interface IUIZone {
		x: uint;
		y: uint;
		width: uint;
		height: uint;
	}

	export interface IUIHTMLNode extends IUINode, IPoint, IUIZone  {
		tag: string;
		value: any;
		html: string;

		setHtml(sHTML: string): void;

		getPosition(): IPoint;
		setPosition(x: uint, y: uint): void;

		getAbsolutePosition(): IPoint;
		getCoordsOffset(): IOffset;

		getHTMLElement(): HTMLElement;
		getComputedStyle(): CSSStyleDeclaration;

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
	}
}

#endif
