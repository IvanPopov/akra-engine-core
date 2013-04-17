#ifndef UIPOPUP_TS
#define UIPOPUP_TS

#include "Component.ts"
#include "IUILayout.ts"

module akra.ui {
	export class Popup extends Component {
		protected $title: JQuery;

		inline get title(): string {
			return this.$title.find("span:first").html();
		}

		inline set title(sTitle: string) {
			this.$title.find("span:first").html(sTitle || "");
		}


		constructor (parent, options?, eType: EUIComponents = EUIComponents.POPUP) {
			super(parent, mergeOptions({layout: EUILayouts.UNKNOWN}, options), eType, 
				$("<div class=\"component-popup\">\
						<div class='title'>\
							<span />\
						</div>\
					</div>"));

			this.$title = this.el.find("div.title:first");

			if (isDefAndNotNull(options)) {
				if (isString(options.title)) {
					this.title = options.title;
				}
			}

			this.setDraggable(true);
		}

		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);
			this.title = $comp.attr("title");
		}
	}

	register("Popup", Popup);
}

#endif