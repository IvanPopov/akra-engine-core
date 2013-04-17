#ifndef UIMENU_TS
#define UIMENU_TS

#include "Component.ts"
#include "Button.ts"

module akra.ui {
	export class Menu extends Component {
		protected $title: JQuery;

		inline get text(): string { return this.$title.html(); }
		inline set text(s: string) {
			this.$title.html(s);
		}

		constructor (parent, options?, eType: EUIComponents = EUIComponents.MENU) {
			super(parent, mergeOptions({layout: EUILayouts.VERTICAL}, options), eType, $(
				"<div class=\"component-menu\">\
					<div class=\"menu-title\"></div>\
				</div>"));

			this.$title = this.el.find(".menu-title:first");
			
			this.handleEvent("mouseenter mouseleave");
		}

		mouseleave(e: IUIEvent): void {
			super.mouseenter(e);
			this.layout.hide();
		}

		mouseenter(e: IUIEvent): void {
			super.mouseenter(e);
			this.layout.show();
		}

		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);

			var sText: string = $comp.attr("text");
			
			if (isString(sText)) {
				this.text = sText;
			}
		}
	}

	register("Menu", Menu);
}

#endif
