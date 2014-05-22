/// <reference path="../idl/IEventProvider.ts" />
/// <reference path="../events.ts" />
/// <reference path="../guid.ts" />

module akra.info {
	var C_HIDDEN: string,
		C_VISIBILITYCHANGE: string;

	if (typeof document['hidden'] !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
		C_HIDDEN = "hidden";
		C_VISIBILITYCHANGE = "visibilitychange";
	} else if (typeof document['mozHidden'] !== "undefined") {
		C_HIDDEN = "mozHidden";
		C_VISIBILITYCHANGE = "mozvisibilitychange";
	} else if (typeof document['msHidden'] !== "undefined") {
		C_HIDDEN = "msHidden";
		C_VISIBILITYCHANGE = "msvisibilitychange";
	} else if (typeof document['webkitHidden'] !== "undefined") {
		C_HIDDEN = "webkitHidden";
		C_VISIBILITYCHANGE = "webkitvisibilitychange";
	}

	/**
	 * @see https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API
	 */
	export final class VisibilityInfo implements IEventProvider {
		guid: uint = guid();
		visibilityChanged: ISignal<{ (pInfo: VisibilityInfo, bVisible: boolean): void; }>;

		private _bDocumentVisible: boolean = true;

		constructor() {
			if (!this.isSupported()) {
				return;
			}

			this.setupSignals();

			// Handle page visibility change   
			document.addEventListener(C_VISIBILITYCHANGE, () => {
				this._onVisibilityChange(!document[C_HIDDEN]);
			}, false);
		}

		protected setupSignals() {
			this.visibilityChanged = new Signal(this);
		}

		/** Is visibility api supported? */
		isSupported(): boolean {
			debug.assert(isDef(C_HIDDEN) && isDef(document.addEventListener),
				"This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");

			return isDef(C_HIDDEN) && isDef(document.addEventListener);
		}

		/** Indicate, whether page visible. */
		isVisible(): boolean {
			return this._bDocumentVisible;
		}

		_onVisibilityChange(bVisible: boolean): void {
			this._bDocumentVisible = bVisible;

			debug.log("PAGE VISIBLE: ", bVisible? "TRUE": "FALSE"); 

			this.visibilityChanged.emit(bVisible);
		}

		/** Indicates whether the HTML element visible. */
		static isHTMLElementVisible(pElement: HTMLElement): boolean {
			if (pElement.offsetParent === null) {
				return false;
			}

			var pStyle: CSSStyleDeclaration = window.getComputedStyle(pElement);
			if (pStyle.display === 'none') {
				return false;
			}

			return !pElement.hidden;
		}
	}
}