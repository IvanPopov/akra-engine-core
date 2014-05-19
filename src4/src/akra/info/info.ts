/// <reference path="../idl/ICanvasInfo.ts" />
/// <reference path="../idl/IURI.ts" />
/// <reference path="../path/path.ts" />
/// <reference path="../uri/uri.ts" />

/// <reference path="BrowserInfo.ts" />
/// <reference path="ApiInfo.ts" />
/// <reference path="ScreenInfo.ts" />
/// <reference path="VisibilityInfo.ts" />

module akra.info {

	export function canvas(pCanvas: HTMLCanvasElement): ICanvasInfo;
	export function canvas(id: string): ICanvasInfo;
	export function canvas(id): ICanvasInfo {
		var pCanvas: HTMLCanvasElement = isString(id) ? document.getElementById(id) : id;

		return {
			width: pCanvas.offsetWidth,
			height: pCanvas.offsetHeight,
			id: pCanvas.id
		};
	}
	
	export var browser: IBrowserInfo = new BrowserInfo;
	export var api: IApiInfo = new ApiInfo;
	export var screen: IScreenInfo = new ScreenInfo;
	export var visibility = new VisibilityInfo;
	export var uri: IURI = akra.uri.parse(document.location.href);

	export module is {
		/**
		 * show status - online or offline
		 */
		var online;
		/**
		 * perform test on mobile device
		 */
		var mobile: boolean = (/mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i)
			.test(navigator.userAgent.toLowerCase());
		var linux: boolean = browser.getOS() === 'Linux';
		var windows: boolean = browser.getOS() === 'Windows';
		var mac: boolean = browser.getOS() === 'Mac';
		var iPhone: boolean = browser.getOS() === 'iPhone';

		var Opera: boolean = browser.getName() === "Opera";
	}



	//TODO: move it to [akra.info.is] module, when typescript access this.
	Object.defineProperty(akra.info.is, 'online', {
		get: function () {
			return navigator.onLine;
		}
	});

}