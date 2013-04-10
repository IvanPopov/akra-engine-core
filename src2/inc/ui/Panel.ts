#ifndef UIPANEL_TS
#define UIPANEL_TS

#include "IUIPanel.ts"
#include "Component.ts"

module akra.ui {
	export class Panel extends Component implements IUIPanel {
		protected $title: JQuery;
		protected $controls: JQuery = null;

		constructor (parent, options?, eType: EUIComponents = EUIComponents.PANEL) {
			super(parent, mergeOptions({layout: EUILayouts.VERTICAL}, options), eType, 
				$("<div>\
						<div class='panel-title'>\
							<div class=\"controls\">\
								<input type=\"checkbox\" />\
							</div>\
							<span />\
						</div>\
					</div>"));

			this.$title = this.el.find("div.panel-title:first");
			this.$controls = this.el.find("div.controls:first");
		}

		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);
			this.$title.find("span:first").html($comp.attr('title') || "");
			if (isDef($comp.attr("collapsible"))) {
				this.setCollapsible($comp.attr("collapsible").toLowerCase() !== "false");
			}
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-panel");
		}

		setCollapsible(bValue: bool = true): void {
			this.el.addClass("collapsible");

			var $element = this.layout.el;
			this.$controls.click((e: IUIEvent) => {
				$element.animate({
					height: 'toggle'
				}, 500);
			});
		}
	}

	register("Panel", Panel);
}

#endif

