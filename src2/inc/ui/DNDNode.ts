#ifndef UIDNDNODE_TS
#define UIDNDNODE_TS

#include "IUIDNDNode.ts"
#include "HTMLNode.ts"
#include "math/global.ts"

module akra.ui {
	
	var pTempPos: IPoint = {x: 0, y: 0};

	export function computePosition(pElement: HTMLElement): IPoint {

		var pBoundingBox = pElement.getBoundingClientRect();
		
		pTempPos.x = pBoundingBox.left + window.pageXOffset;
		pTempPos.y = pBoundingBox.top + window.pageYOffset;

		return pTempPos;
	}

	export function computeMouseOffset(pElement: HTMLElement, iPageX: uint, iPageY: uint, ppMouseOffset: IOffset): void {
		var pPosition: IPoint  = computePosition(pElement);

		ppMouseOffset.x = iPageX - pPosition.x, 
		ppMouseOffset.y = iPageY - pPosition.y
	}

	export interface IUIListenersMap {
		[event: string]: IUIEventListener;
	}

	export class DNDNode extends HTMLNode implements IUIDNDNode {
		protected _bDraggable: bool = false;

		protected _pMouseOffset: IOffset = {x: 0, y: 0};
		protected _pMouseDownAt: IPoint = {x: 0, y: 0};

		protected _pDocumentRedirectors: IUIListenersMap = {
			mouseup: null,
			mousedown: null,
			dragstart: null,
			selectstart: null
		};

		/**
		 * Флаг того что элемент находится в движении. 
		 * Выставляется после начала движения и снимается после события mouseUp.
		 */
		protected _bMoving: bool = false;
		protected _pDragZone: IUIZone = null;

		//protected _pStartPoint: IPoint = {x: 0, y: 0};
		protected _pDragBarier: IOffset = {x: 10, y: 10};

		constructor (pUI: IUI, pElement: HTMLElement) {
			super(pUI, pElement, EEntityTypes.UI_DNDNODE);

			var pNode: DNDNode = this;

			var pRedirectors: IUIListenersMap = this._pDocumentRedirectors;

			// эти обработчики отслеживают процесс и окончание переноса
			pRedirectors["onmouseup"] = function (e: Event) { pNode._mouseUp(e); };
			pRedirectors["onmousemove"] = function (e: Event) { pNode._mouseMove(e); }

			// отменить перенос и выделение текста при клике на тексте
			pRedirectors["ondragstart"] = function (e: Event) { return false; }
			pRedirectors["onselectstart"] = function (e: Event) { return false; }
		}

		inline get dragBarier(): IOffset { return this._pDragBarier; }
		

		setDragZone(): bool;
		setDragZone(pZone: IUIZone): bool;
		setDragZone(iWidth: uint, iHeight: uint): bool;
		setDragZone(x: uint, y: uint, iWidth: uint, iHeight: uint): bool;
		setDragZone(top?, right?, bottom?, left?): bool {
			switch(arguments.length) {
				case 0:
					if (containsHTMLElement(this.parent)) {
						this._pDragZone = <IUIZone>(<IUIDNDNode>this.parent);
					}

					return false;
				case 1:
					this._pDragZone = <IUIZone>arguments[0];
					break;
				case 2:
					this._pDragZone = {
						x:   0,
						y:   0,
						width:  <uint>arguments[0],
						height: <uint>arguments[1]
					};
					break;
				case 4:
					this._pDragZone = {
						x:    	<uint>arguments[0],
						y:  	<uint>arguments[1],
						width: 	<uint>arguments[2],
						height: <uint>arguments[3]
					};
					break;
			}

			return true;
		}

		inline isDraggable(): bool {
			return this._bDraggable;
		}

		inline isMoving(): bool {
			return this._bMoving;
		}

		setDraggable(bValue: bool = true): void {

			this._bDraggable = bValue;
			
			if (this.isDraggable()) {
				var pElement: HTMLElement = this.getHTMLElement();
				var pComputedStyle: CSSStyleDeclaration = this.getComputedStyle();
				var sCurrentPosition: string = pComputedStyle.getPropertyValue("position");
				var sParentPosition: string = null;
				var pParent: HTMLElement = <HTMLElement>pElement.parentNode;

				if (sCurrentPosition !== "absolute") {
					pElement.style.position = "absolute";
					//FIXME: originally sParentPosition computed from pElement, see DragnDrop.js fore details..
					pComputedStyle =  window.getComputedStyle(pParent, null);
					sParentPosition = pComputedStyle.getPropertyValue("position");
					
					if(sParentPosition === "absolute" || sParentPosition === "relative"){
						pElement.style.top  = "0px";
						pElement.style.left = "0px";
					}
					else{
						pElement.style.top  = pParent.offsetTop + "px";
						pElement.style.left = pParent.offsetLeft + "px";
					}
				}
			}
		}

		_mouseMove(pEvent: Event): bool {
			var e: IUIEvent = fixEvent(pEvent);

			var pElement: HTMLElement = this.getHTMLElement();
			var pParent: HTMLElement = <HTMLElement>pElement.parentNode;
			var pComputedStyle: CSSStyleDeclaration = window.getComputedStyle(pParent, null);
			var sParentPosition: string = pComputedStyle.getPropertyValue("position");
			var pDragZone: IUIZone = this._pDragZone;

			 
			if (Math.abs(this._pMouseDownAt.x - e.pageX) < this._pDragBarier.x && 
				Math.abs(this._pMouseDownAt.y - e.pageY) < this._pDragBarier.y) {
				// слишком близко, возможно это клик
				return false;
			}

			computeMouseOffset(pElement, this._pMouseDownAt.x, this._pMouseDownAt.y, this._pMouseOffset);

			//Чтобы после начала движения элемент перепрыгнул относительно мыши в то место где был клик.
			this._bMoving = true;


			this.dragStart(e);

			var iTop: int = 0;
			var iLeft: int = 0;
			var iScrollX: int = window.pageXOffset;
			var iScrollY: int = window.pageYOffset;
			var bMoved: bool = false;
			var pBoundingBox: ClientRect = pParent.getBoundingClientRect();

			if(sParentPosition == "absolute" || sParentPosition == "relative") {
				iTop = e.pageY - (pBoundingBox.top  + iScrollY) - this._pMouseOffset.y;
				iLeft = e.pageX - (pBoundingBox.left + iScrollX) - this._pMouseOffset.x;
			}
			else {
				iTop = e.pageY - this._pMouseOffset.y;
				iLeft = e.pageX - this._pMouseOffset.x;
			}

			//Если есть dragzone необходимо проверить что элемент из нее не вылез

			if(!isNull(pDragZone)) {
				var iElementHeight: int = parseInt(pElement.style.height || pElement.offsetHeight);
				var iElementWidth: int = parseInt(pElement.style.width || pElement.offsetWidth);
				var pDragNode: IUIDNDNode = null;
				var iMinTop: int  = 0;
				var iMinLeft: int = 0;
				var iMaxTop: int  = 0;
				var iMaxLeft: int = 0;

				//TODO: check type of drag zone..
				if(isDef((<any>pDragZone).type)) {
					pDragNode = <IUIDNDNode>pDragZone;
					if(sParentPosition == "absolute" || sParentPosition == "relative"){
						iMinTop  = 0;
						iMinLeft = 0;
						iMaxTop  = pDragNode.height - iElementHeight;
						iMaxLeft = pDragNode.width - iElementWidth;
					}
					else{
						iMinTop  = pBoundingBox.top  + iScrollY;
						iMinLeft = pBoundingBox.left + iScrollX;
						iMaxTop  = pDragNode.height + pBoundingBox.top  - iElementHeight;
						iMaxLeft = pDragNode.width  + pBoundingBox.left - iElementWidth;
					}
				}
				else {
					//TODO: if zone if not UINode
				}

				iTop = math.clamp(iTop, iMinTop, iMaxTop);
				iLeft = math.clamp(iLeft, iMinLeft, iMaxLeft);
			}

			pElement.style.left = iLeft + 'px';
			pElement.style.top  = iTop  + 'px';

			this.dragMove(null);

			return false;
		}


		_mouseUp(pEvent: Event) {
			var e: IUIEvent = fixEvent(pEvent);
			// очистить обработчики, т.к перенос закончен
			document.onmousemove        = null;
			document.onmouseup          = null;
			document.ondragstart        = null;
			document.body.onselectstart = null;

			if (this.isMoving()) {
				//Событие on Drag Stop
				this.dragStop(e);
				this._bMoving = false;
			}
		}

		private dragInit(pEvent: IUIEvent): bool {
			var pMouseDownAt: IPoint = this._pMouseDownAt;
			var pMouseOffset: IOffset = this._pMouseOffset;
			var pElement: HTMLElement = this.getHTMLElement();

			if (pEvent.which != 1) {
				return true;
			}

			pMouseDownAt.x = pEvent.pageX;
			pMouseDownAt.y = pEvent.pageY;

			computeMouseOffset(pElement, pEvent.pageX, pEvent.pageY, pMouseOffset);

			var pRedirectors: IUIListenersMap = this._pDocumentRedirectors;

			// эти обработчики отслеживают процесс и окончание переноса
			document.onmousemove = pRedirectors["onmousemove"];
			document.onmouseup = pRedirectors["onmouseup"];

			// отменить перенос и выделение текста при клике на тексте
			document.ondragstart        = pRedirectors["dragstart"];
			document.body.onselectstart = pRedirectors["onselectstart"];

			return false;
		}

		mousedown(e: IUIEvent): void {
			if (this.isDraggable()) {
				this.dragInit(e);
			}

			super.mousedown(e);
		}

		BEGIN_EVENT_TABLE(DNDNode);
			BROADCAST(dragStart, CALL(e));
			BROADCAST(dragStop, CALL(e));
			BROADCAST(dragMove, CALL(e));
		END_EVENT_TABLE();
	}
}

#endif
