#ifndef DOM_TS
#define DOM_TS

#include "util/ObjectArray.ts"

module akra.ui {
	export class DOMList {
		constructor () {

		}
	}

	export class DOM {



		inline get tag(): string {
			return this.element.tagName.toLowerCase();
		}

		inline get val(): any {
			return this.element.value;
		}

		inline set val(value: any) {
			this.element.value = value;
		}

		set x(iX: uint) {
			var pElement: HTMLElement = this.element;
			var pParent: HTMLElement = <HTMLElement>pElement.parentNode;
			var pComputedStyle: CSSStyleDeclaration = window.getComputedStyle(pParent, null);
			var sParentPosition: string = pComputedStyle.getPropertyValue("position");

			pElement.style.position = "absolute";

			if(sParentPosition === "absolute" || sParentPosition === "relative"){
				pElement.style.left = iX + "px";
			}
			else{
				iX += pParent.offsetLeft;
				pElement.style.left = iX + "px";
			}
		}

		get y(): uint {
			var pElement: HTMLElement = this.element;
			var pParent: HTMLElement = <HTMLElement>pElement.parentNode;

			if (isNull(pParent)) {
				return 0;
			}

			var iY: int = 0;
			var pComputedStyle: CSSStyleDeclaration = window.getComputedStyle(pParent, null);
			var sParentPosition: string = pComputedStyle.getPropertyValue("position");

			if(sParentPosition === "absolute" || sParentPosition === "relative"){
				iY += pElement.offsetTop;
			}
			else{
				iY += pElement.offsetTop;
				iY -= pParent.offsetTop;
			}	

			return iY;
		}

		set y(iY: uint) {
			var pElement: HTMLElement = this.element;
			var pParent: HTMLElement = <HTMLElement>pElement.parentNode;
			var pComputedStyle: CSSStyleDeclaration = window.getComputedStyle(pParent, null);
			var sParentPosition: string = pComputedStyle.getPropertyValue("position");

			pElement.style.position = "absolute";
			if(sParentPosition === "absolute" || sParentPosition === "relative"){
				pElement.style.top = iY + "px";
			}
			else{
				iY += pParent.offsetTop;
				pElement.style.top = iY + "px";
			}
		}

		get absoluteX(): uint {
			var iScrollX: int = window.pageXOffset;
			var pBoundingBox: ClientRect = this.element.getBoundingClientRect();

			return iScrollX + pBoundingBox.left;
		}

		get absoluteY(): uint {
			var iScrollY: int = window.pageYOffset;
			var pBoundingBox: ClientRect = this.element.getBoundingClientRect();

			return iScrollY + pBoundingBox.top;
		}

		get width(): uint {
			return parseInt(this._pHTMLElement.style.width || this._pHTMLElement.offsetWidth); 
		}

		set width(width) {
			this._pHTMLElement.style.width = isString(width) ? <string>width : <uint>width + "px";
		}

		get height(): uint {
			return parseInt(this._pHTMLElement.style.height || this._pHTMLElement.offsetHeight); 
		}

		set height(height) {
			this._pHTMLElement.style.height = isString(height) ? height : height + "px";
		}

		constructor (public element: HTMLElement) {

		}

		inline find(sSelector: string): DOM {
			return DOM.find(sSelector);
		}

		inline getComputedStyle(): CSSStyleDeclaration {
			return window.getComputedStyle(this.element, null);
		}

		getCoordsOffset(): IPoint {
			var iScrollX: int = window.pageXOffset;
		    var iScrollY: int = window.pageYOffset;

			var pBoundingBox: ClientRect = pElement.element.getBoundingClientRect();

			return {
				x: x - iScrollX - pBoundingBox.left,
				y: y - iScrollY - pBoundingBox.top
			}
		}

		getAbsolutePosition(pFrom: DOM): IPoint {
			//TODO Разобраться почему
		    var iScrollX: uint = 0;/*window.pageXOffset;*/
		    var iScrollY: uint = 0;/*window.pageYOffset;*/
			var pBoundingBox: ClientRect = this.element.getBoundingClientRect();

			if(!isDef(pFrom)) {
				return {
					x: iScrollX + pBoundingBox.left, 
					y: iScrollY + pBoundingBox.top
				};
			}
			else {
				var pFromBoundingBox = pFrom.element.getBoundingClientRect();
				return {
					x: iScrollX + pBoundingBox.left - pFromBoundingBox.left, 
					y: iScrollY + pBoundingBox.top - pFromBoundingBox.top
				};
			}
		}

		inline setPosition(x: uint, y: uint): void {
			(this.x = x) && (this.y = y);
		}

		valueOf(): HTMLElement {
			return this.element;
		}

		static inline _find(pWhere: NodeSelector, sSelector: string): DOM {
			return DOMList.create(pWhere.querySelectorAll(sWhat));
		}

		static inline find(sSelector: string): DOM {
			return DOM._find(document, sSelector);
		}

		static inline _create(pElement: HTMLElement): DOM {
			return DOM.pool.length? (<DOM>)DOM.pool.pop().set(pElement): DOM._allocate(pElement);
		}

		static _allocate(pElement: HTMLElement): DOM {
			for(var i: int = 0; i < DOM.PACK_SIZE; i++){
				DOM.pool.push(new DOM);
			} 

			return DOM._create(pElement);
		}

		static inline create(sElement?: string): DOM {
			return DOM._create(document.createElement(sElement || "div"));
		}

		static private pool: ObjectArray = new util.ObjectArray;
		static private PACK_SIZE: uint = 16;

	}
}

#endif
