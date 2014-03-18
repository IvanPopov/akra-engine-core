/// <reference path="../../../built/Lib/akra.d.ts" />

declare var AE_PROGRESS_DEPENDENCIES: { path: string; type: string; };

module akra.addons {

	import addons = config.addons;

	addons['progress'] = addons['progress'] || { css: null };
	addons['progress'].css = addons['progress'].css || (uri.currentPath() + "/progress/css/progress.css");

	debug.log("config['addons']['progress'] = ", JSON.stringify(addons['progress']));

	if (document.createStyleSheet) {
		document.createStyleSheet(addons['progress'].css);
	}
	else {
		var sStyles: string = "@import url(' " + addons['progress'].css + " ');";
		var pLink: HTMLLinkElement = <HTMLLinkElement>document.createElement('link');

		pLink.rel = 'stylesheet';
		pLink.href = 'data:text/css,' + escape(sStyles);
		document.getElementsByTagName("head")[0].appendChild(pLink);
	}

	/*
	<div>
		<div class="ae-loader bounceInLeft greenPulse" >
			<img src="logo2.png" class="ae-loader-logo" width = "67" height = "67" >
			<h2 class="ae-caption" >{{caption}}< / h2 >

			<div class="ae-progress" style = "margin-bottom: 20px;" >

				<span class="ae-string" >{{process}}:< / span >
				<div class="ae-bar" >
					<div class="ae-complete" >< / div >
					<span class="ae-string ae-tip" >{{tip}}< / span >
				< / div >
			< / div >

			<div class="ae-slider" >
				<div class="line" >< / div >
				<div class="break dot1" >< / div >
				<div class="break dot2" >< / div >
				<div class="break dot3" >< / div >
			< / div >
			<div class="ae-footer" >< / div >
		< / div >
	< / div >*/

	var code = {
		div: [
			{
				$: { "class": "ae-loader bounceInLeft greenPulse", "id": "ae-loader" },

				"h2": [
					{
						$: { "class": "ae-caption" }, _: "Loading"
					}
				],

				"div": [
					{
						$: { "class": "ae-progress", "style": "margin-bottom: 20px;" },
						"span": [
							{
								$: { "class": "ae-string" },
								_: "Acquiring"
							}
						],
						"div": [
							{
								$: { "class": "ae-bar" },
								"div": [
									{
										$: { "class": "ae-complete" }
									}
								],
								"span": [
									{
										$: { "class": "ae-string ae-tip" },
										_: "{{tip}}"
									}
								],
							}
						]
					},
					{
						$: { "class": "ae-progress", "style": "margin-bottom: 20px;" },
						"span": [
							{
								$: { "class": "ae-string" },
								_: "Applying"
							}
						],
						"div": [
							{
								$: { "class": "ae-bar" },
								"div": [
									{
										$: { "class": "ae-complete" }
									}
								],
								"span": [
									{
										$: { "class": "ae-string ae-tip" },
										_: "{{tip}}"
									}
								],
							}
						]
					},
					{
						$: { "class": "ae-slider" },
						div: [
							{
								$: { "class": "line" }
							},
							{
								$: { "class": "break dot1" }
							},
							{
								$: { "class": "break dot2" }
							},
							{
								$: { "class": "break dot3" }
							}
						]
					},
					{
						$: { "class": "ae-footer" }
					}
				],
			}
		]
	};

	export class Progress {
		private acquiring: HTMLDivElement;
		private acquiringTip: HTMLSpanElement;

		private applying: HTMLDivElement;
		private applyingTip: HTMLSpanElement;

		constructor(private element: HTMLElement = null, bRender: boolean = true) {
			if (isNull(element)) {
				this.element = document.body;
			}

			if (bRender) {
				this.render();
			}
		}

		render(): void {
			Progress.js2html(code, this.element);
			var pBars: HTMLDivElement[] = <HTMLDivElement[]><any>document.getElementsByClassName('ae-complete');
			var pTips: HTMLSpanElement[] = <HTMLSpanElement[]><any>document.getElementsByClassName('ae-tip');

			this.acquiring = pBars[0];
			this.acquiringTip = pTips[0];

			this.applying = pBars[1];
			this.applyingTip = pTips[1];
		}

		destroy(): void {
			var pNode: HTMLDivElement = <HTMLDivElement>document.getElementById("ae-loader");
			pNode.className += " bounceOutRight";
		}

		getListener(): (e: IDepEvent) => void {
			return (e: IDepEvent): void => {

				this.setAcquiring(e.bytesLoaded / e.bytesTotal);
				this.setAcquiringTip((e.bytesLoaded / 1000).toFixed(0) + ' / ' + (e.bytesTotal / 1000).toFixed(0) + ' kb');

				this.setApplying(e.unpacked);
				this.setApplyingTip(e.loaded + ' / ' + e.total);

				if (e.loaded === e.total) {
					//this.destroy();
				}
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

		private static js2html(pObject, pElement: HTMLElement = document.createElement("div")): Element {
			var pKeys: string[] = Object.keys(pObject);

			for (var i = 0; i < pKeys.length; ++i) {
				switch (pKeys[i]) {
					case '$':
						for (var sAttr in pObject["$"]) {
							pElement.setAttribute(sAttr, pObject["$"][sAttr]);
						}
						break;
					case '_':
						pElement.innerHTML = pObject["_"];
						break;
					default:
						var sTag: string = pKeys[i];
						for (var j = 0; j < pObject[sTag].length; ++j) {
							var pChild: HTMLElement = document.createElement(sTag);

							if (pElement) {
								pElement.appendChild(pChild);
							}

							Progress.js2html(pObject[sTag][j], pChild);
						}
				}
			}

			return pElement;
		}
	}
}