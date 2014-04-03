/// <reference path="../../../built/Lib/akra.d.ts" />

declare var AE_PROGRESS_DEPENDENCIES: { path: string; type: string; };

module akra.addons {

	import addons = config.addons;

	addons['progress'] = addons['progress'] || { "css": null };
	addons['progress']["css"] = addons['progress']["css"] || (uri.currentPath() + "/progress/" + (AE_DEBUG? "debug": "release") + "/progress.css");

	debug.log("config['addons']['progress'] = ", JSON.stringify(addons['progress']));

	if (document.createStyleSheet) {
		document.createStyleSheet(addons['progress']["css"]);
	}
	else {
		var sStyles: string = "@import url(' " + addons['progress']["css"] + " ');";
		var pLink: HTMLLinkElement = <HTMLLinkElement>document.createElement('link');

		pLink.rel = 'stylesheet';
		pLink.href = 'data:text/css,' + escape(sStyles);
		document.getElementsByTagName("head")[0].appendChild(pLink);
	}

	var code = AE_DEBUG ?
		"<div class='ae-preloader'>" +
			"<div class='ae-title'>" +
				"LOADING" +
			"</div>" +
			"<div class='ae-circle'>" +
				"<div id='' class='circle_1 circle'></div>" +
				"<div id='' class='circle_2 circle'></div>" +
				"<div id='' class='circle_3 circle'></div>" +
				"<div id='' class='circle_4 circle'></div>" +
				"<div id='' class='circle_5 circle'></div>" +
				"<div id='' class='circle_6 circle'></div>" +
				"<div id='' class='circle_7 circle'></div>" +
				"<div class='clearfix'></div>" +
			"</div>" +
			"<div class='ae-progress' style='margin-bottom: 20px;'>" +
				"<span class='ae-string'>Acquiring&nbsp;</span>" +
				"<span class='ae-string ae-tip'></span>" +
				"<div class='ae-bar'>" +
					"<div class='ae-complete'>" +
					"</div>" +
				"</div>" +
			"</div>" +
			"<div class='ae-progress' style='margin-bottom: 20px;'>" +
				"<span class='ae-string'>Applying&nbsp;</span>" +
				"<span class='ae-string ae-tip'></span>" +
				"<div class='ae-bar'>" +
					"<div class='ae-complete'>" +
					"</div>" +
				"</div>" +
			"</div>" +
		"</div>" :
		"<div class='ae-preloader'>" +
			"<div class='ae-progress'>" +
				"<div class='ae-bar'>" +
					"<div class='ae-complete'>" +
					"</div>" +
				"</div>" +
			"</div>" +
		"</div>"


	export class Progress {
		private acquiring: HTMLDivElement;
		private acquiringTip: HTMLSpanElement;

		private applying: HTMLDivElement;
		private applyingTip: HTMLSpanElement;

		constructor(private element: HTMLElement = null, bRender: boolean = true) {

			if (bRender) {
				this.render();
			}
		}

		render(): void {
			var el = akra.conv.parseHTML(code)[0];
			if (isNull(this.element)) {
				this.element = <HTMLElement>el;
				document.body.appendChild(this.element);
			}
			else {
				this.element.appendChild(el);
			}


			var pBars: HTMLDivElement[] = <HTMLDivElement[]><any>document.getElementsByClassName('ae-complete');
			var pTips: HTMLSpanElement[] = <HTMLSpanElement[]><any>document.getElementsByClassName('ae-tip');

			if (AE_DEBUG) {
				this.acquiring = pBars[0];
				this.acquiringTip = pTips[0];


				this.applying = pBars[1];
				this.applyingTip = pTips[1];
			}
			else {
				this.applying = pBars[0];
			}
		}

		destroy(): void {
			if (AE_DEBUG) {
				this.element.className += " bounceOutRight";
				setTimeout(() => {
					this.element.parentNode.removeChild(this.element);
				}, 2000);
			}
			else {
				this.element.parentNode.removeChild(this.element);
			}
		}

		getListener(): (e: IDepEvent) => void {
			return (e: IDepEvent): void => {

				if (AE_DEBUG) {
					this.setAcquiring(e.bytesLoaded / e.bytesTotal);
					this.setAcquiringTip((e.bytesLoaded / 1000).toFixed(0) + ' / ' + (e.bytesTotal / 1000).toFixed(0) + ' kb');
					this.setApplyingTip(e.loaded + ' / ' + e.total);
				}

				this.setApplying(e.unpacked);

				// if (e.loaded === e.total) {
					//this.destroy();
				// }
			}
		}

		private setAcquiring(fValue: float): void {
			this.acquiring.style.width = (fValue * 100).toFixed(3) + '%';
		}

		private setApplying(fValue: float): void {
			this.applying.style.width = (fValue * 100).toFixed(3) + '%';
		}

		private setApplyingTip(sTip: string): void {
			this.applyingTip.innerHTML = sTip;
		}

		private setAcquiringTip(sTip: string): void {
			this.acquiringTip.innerHTML = sTip;
		}
	}
}