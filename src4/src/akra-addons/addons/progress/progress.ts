/// <reference path="../../../../build/akra.d.ts" />

module akra.addons {

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
				$: { "class": "ae-loader bounceInLeft greenPulse" },

				"img": [
					{
						$: { "src": "logo2.png", "class": "ae-loader-logo", "width": "67", "height": "67" }
					}
				],

				"h2": [
					{
						$: { "class": "ae-caption" }, _: "{{caption}}"
					}
				],

				"div": [
					{
						$: { "class": "ae-progress", "style": "margin-bottom: 20px;" },
						"span": [
							{
								$: { "class": "ae-string" },
								_: "{{process}}"
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

	export class Loader {

		render(pElement: HTMLElement = null): void {
			if (isNull(pElement)) {
				pElement = document.body;
			}

			Loader.js2html(code, pElement);
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

							Loader.js2html(pObject[sTag][j], pChild);
						}
				}
			}

			return pElement;
		}
	}
}