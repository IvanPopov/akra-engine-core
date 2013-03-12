#ifndef IUIHTMLNODE_TS
#define IUIHTMLNODE_TS

#include "IUINode.ts"

module akra {
	export interface IUIEvent extends JQueryEventObject {}


	export interface IUIHTMLNode extends IUINode  {
		$element: JQuery;

		getHTMLElement(): HTMLElement;

		isFocused(): bool;
		isRendered(): bool;

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
	}
}

#endif
