///<reference path="../akra.ts" />

module akra.info {
	export function canvas(pCanvas: HTMLCanvasElement): ICanvasInfo;
	export function canvas(id: string): ICanvasInfo;
	export function canvas(id): ICanvasInfo {
		var pCanvas: HTMLCanvasElement = isString(id) ? document.getElementById(id) : id;

		return {
			width: isInt(pCanvas.width) ? pCanvas.width : parseInt(pCanvas.style.width),
			height: isInt(pCanvas.height) ? pCanvas.height : parseInt(pCanvas.style.height),
			id: pCanvas.id
		};
	}

	export var browser: IBrowserInfo = new util.BrowserInfo;
	export var api: IApiInfo = new util.ApiInfo;
	export var screen: IScreenInfo = new util.ScreenInfo;

	export var uri: IURI = parseURI(document.location.href);

	module is {
		/**
         * show status - online or offline
         */
		export var online;
		/**
         * perform test on mobile device
         */
		export var mobile: bool = (/mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i)
			.test(navigator.userAgent.toLowerCase());
		export var linux: bool = browser.os === 'Linux';
		export var windows: bool = browser.os === 'Windows';
		export var mac: bool = browser.os === 'Mac';
		export var iPhone: bool = browser.os === 'iPhone';
	}


	//TODO: move it to [akra.info.is] module, when typescript access this.
	Object.defineProperty(is, 'online', {
		get: function () {
			return navigator.onLine;
		}
	});
}