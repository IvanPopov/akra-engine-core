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

	export var uri:IUri = uri(document.location.href);

	module is {
		/**
         * show status - online or offline
         */
        online  : function () {
            return navigator.onLine;
        },
        /**
         * perform test on mobile device
         */
        mobile  : (/mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i)
            .test(navigator.userAgent.toLowerCase()),
        linux   : a.browser.os == 'Linux',
        windows : a.browser.os == 'Windows',
        mac     : a.browser.os == 'Mac',
        iPhone  : a.browser.os == 'iPhone'
	}
}