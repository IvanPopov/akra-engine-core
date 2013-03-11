#ifndef UIHTMLNODE_TS
#define UIHTMLNODE_TS

#include "IUIHTMLNode.ts"
#include "Node.ts"

module akra.ui {

	export function fixEvent(event: Event = <Event><any>window.event): IUIEvent {
		var e: IUIEvent = <IUIEvent>event;

	    if (e.isFixed) {
	      return e
	    }

	    e.isFixed = true 
	  
	    e.preventDefault 	= e.preventDefault || () => { this.returnValue = false; }
	    e.stopPropagation 	= e.stopPropagation || () => { this.cancelBubble = true; }
	    
	    if (!isDefAndNotNull(e.target)) {
	        e.target = e.srcElement;
	    }
	  
	    if (isDefAndNotNull(e.relatedTarget) && isDefAndNotNull(e.fromElement)) {
	        e.relatedTarget = e.fromElement == e.target ? e.toElement : e.fromElement;
	    }
	  
	    if ( e.pageX == null && e.clientX != null ) {
	        var html: HTMLElement = document.documentElement, 
	        	body: HTMLElement = document.body;

	        e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
	        e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
	    }
	  
	    if ( !e.which && e.button ) {
	        e.which = (e.button & 1 ? 1 : ( e.button & 2 ? 3 : ( e.button & 4 ? 2 : 0 ) ));
	    }
		
		return e;
	}
	
	export class HTMLNode extends Node implements IUIHTMLNode {
		protected _pHTMLElement: HTMLElement = null;
		protected _fnEventRedirector: IUIEventListener = null;

		get x(): uint {
			var pElement: HTMLElement = this.getHTMLElement();
			var pParent: HTMLElement = <HTMLElement>pElement.parentNode;

			if (isNull(pParent)) {
				return 0;
			}

			var iX: int = 0;
			var pComputedStyle: CSSStyleDeclaration = window.getComputedStyle(pParent, null);
			var sParentPosition: string = pComputedStyle.getPropertyValue("position");

			if(sParentPosition === "absolute" || sParentPosition === "relative"){
				iX += pElement.offsetLeft;
			}
			else{
				iX += pElement.offsetLeft;
				iX -= pParent.offsetLeft;
			}	

			return iX;
		}

		inline get x(): uint { return this._pElement.x; }
		inline get y(): uint { return this._pElement.y; }
		inline get width(): uint { return this._pElement.width; }
		inline get height(): uint { return this._pElement.height; }

		inline set x(x: uint) { this._pElement.x = x; }
		inline set y(y: uint) { this._pElement.y = y; }
		inline set width(w: uint) { this._pElement.width = w; }
		inline set height(h: uint) { this._pElement.height = h; }
		
		inline get absoluteX(): uint { return this._pElement.absoluteX; }
		inline get absoluteY(): uint { return this._pElement.absoluteY; }

		constructor (pUI: IUI, pElement: HTMLElement, eType: EEntityTypes = EEntityTypes.UI_HTMLNODE) {
			super(pUI, eType);

			var pNode: HTMLNode = this;

			this._pHTMLElement = pElement;
			this._fnEventRedirector = (e: Event): void => {
				if (isDef(e)) {
					pNode._commonEventHandler(e);
				}
			};

			for (var i: int = 0; i < HTMLNode.EVENTS.length; ++ i) {
				this.grabEvent(HTMLNode.EVENTS[i]);
			}
		}

		inline getHTMLElement(): HTMLElement {
			return this._pHTMLElement;
		}

		inline getComputedStyle(): CSSStyleDeclaration {
			return window.getComputedStyle(this._pHTMLElement, null);
		}

		private grabEvent(sEvent: string): void {
			var pElement: HTMLElement = this.getHTMLElement();
			var fnRedirector: IUIEventListener = this._fnEventRedirector;
			
			if (isNull(pElement)) {
				return;
			}

			if (isDef(pElement.addEventListener)) {
				pElement.addEventListener(sEvent, fnRedirector, false)
			}
			else if (isDef(pElement.attachEvent)) {
				pElement.attachEvent("on" + sEvent, fnRedirector)
			}
		}

		_commonEventHandler(event: Event): void {
			var e: IUIEvent = fixEvent(event);

			if (HTMLNode.EVENTS.indexOf(e.type) == -1) {
				return;
			}

	     	var bNext: any = (<any>this)[e.type](e);
	     	
	     	if (bNext === false) {
	        	e.preventDefault();
	        	e.stopPropagation();
	    	}
		}

	
		BEGIN_EVENT_TABLE(HTMLNode);

			BROADCAST(click, CALL(e));
			BROADCAST(dblclick, CALL(e));
			
			BROADCAST(mousemove, CALL(e));
			BROADCAST(mouseup, CALL(e));
			BROADCAST(mousedown, CALL(e));
			BROADCAST(mouseover, CALL(e));
			BROADCAST(mouseout, CALL(e));
			
			BROADCAST(focusin, CALL(e));
			BROADCAST(focusout, CALL(e));
			
			BROADCAST(blur, CALL(e));
			BROADCAST(change, CALL(e));

			BROADCAST(keydown, CALL(e));
			BROADCAST(keyup, CALL(e));

		END_EVENT_TABLE();

		static EVENTS: string[] = [
			"click",
			"dblclick",
			"mousemove",
			"mouseup",
			"mouseover",
			"mouseout",
			"focusin",
			"focusout",
			"blur",
			"change",
			"keydown",
			"keyup"
		];
	}
}

#endif