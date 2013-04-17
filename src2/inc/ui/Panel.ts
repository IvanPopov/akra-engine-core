#ifndef UIPANEL_TS
#define UIPANEL_TS

#include "IUIPanel.ts"
#include "Component.ts"

module akra.ui {
	export class Panel extends Component implements IUIPanel {
		index: int = -1;
		
		protected $title: JQuery;
		protected $controls: JQuery = null;

		inline get collapsed(): bool {
			return this.el.hasClass("collapsed");
		}

		inline get title(): string {
			return this.$title.find("span:first").html();
		}

		inline set title(sTitle: string) {
			this.$title.find("span:first").html(sTitle || "");
			this.titleUpdated(sTitle);
		}

		constructor (parent, options?, eType: EUIComponents = EUIComponents.PANEL) {
			super(parent, mergeOptions({layout: EUILayouts.UNKNOWN}, options), eType, 
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

			if (isDefAndNotNull(options)) {
				if (isString(options.title)) {
					this.title = options.title;
				}
			}
		}

		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);
			this.title = $comp.attr('title');
			
			if (isDef($comp.attr("collapsible"))) {
				this.setCollapsible($comp.attr("collapsible").toLowerCase() !== "false");
			}

			var sCollapsed: string = $comp.attr("collapsed");

			if (isString(sCollapsed) && sCollapsed.toLowerCase() !== "false") {
				this.el.addClass("collapsed");
				this.layout.hide();
			}
		}

		collapse(bValue: bool = true): void {
			if (bValue === this.collapsed) {
				return;
			}

			this.collapsed? this.el.removeClass("collapsed"): this.el.addClass("collapsed");

			var $element = this.layout.el;
			
			$element.animate({
				height: 'toggle'
			}, 500);
		}


		rendered(): void {
			super.rendered();
			this.el.addClass("component-panel");
		}

		inline isCollapsible(): bool {
			return this.el.hasClass("collapsible");
		}

		setCollapsible(bValue: bool = true): void {
			if (bValue === this.isCollapsible()) {
				return;
			}

			this.el.addClass("collapsible");
			var pPanel = this;
			
			this.$controls.click((e: IUIEvent) => {
				pPanel.collapse(!this.collapsed);
			});
		}

		BROADCAST(titleUpdated, CALL(sTitle));
	}

	register("Panel", Panel);

	export function isPanel(pEntity: IEntity): bool {
		return isComponent(pEntity, EUIComponents.PANEL);
	}
}

#endif

