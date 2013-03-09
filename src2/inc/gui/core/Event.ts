#ifndef GUI_EVENTHANDLER_TS
#define GUI_EVENTHANDLER_TS

module akra.gui.core {

	interface IExtendedEventListener extends EventListener {
		id?: number;
	}

	interface IEventMap {
		[type: string]: {
			[id: handler]: IExtendedEventListener;
		}
	}

	interface IExtendedHTMLElement extends HTMLElement {
		events: IEventMap;
		handler: EventHandler;
	}

	class EventHandler {
		protected _pDomElement: IExtendedHTMLElement;

		constructor (pElement: HTMLElement = null) {
			this._pDomElement = <IExtendedHTMLElement>pElement;
		}

		inline getHTMLElement(): HTMLElement {
			return this._pDomElement;
		}

		addEvent(sType: string, fnHandler: EventListener): int {
			var pElement: IExtendedHTMLElement = <IExtendedHTMLElement>this.getHTMLElement();
			var pEventHandler: Event = this;
			var fn: IExtendedEventListener = <IExtendedEventListener>fnHandler;
			
			if (isNull(pElement)) {
				return 0;
			}

			if ((<any>pElement).setInterval && (<any>pElement != window) && !(<any>pElement).frameElement) {
				this._pDomElement = window;
			}

			if (!isDef(fn.id)) {
				fn.id = ++ EventHandler.lastEventHandlerUId;
			}

			if (!isDef(pElement.events[sType])) {
				pElement.events[sType] = {}        

				if (isDef(pElement.addEventListener)) {
					pElement.addEventListener(sType, pElement.handle, false)
				}else if (isDef(pElement.attachEvent)) {
					pElement.attachEvent("on" + sType, pElement.handle)
				}
			}

			pElement.events[sType][fnHandler.id] = fnHandler;

			return fn.id;
		}

		static private lastEventHandlerUId = 0;
	}

}

#endif