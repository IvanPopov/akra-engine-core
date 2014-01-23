/// <reference path="../idl/IUIPanel.ts" />
/// <reference path="Component.ts" />

module akra.ui {
	export class Panel extends Component implements IUIPanel {

		//BROADCAST(titleUpdated, CALL(sTitle));
		//BROADCAST(selected, VOID);

		titleUpdated: ISignal<{ (pPabel: IUIPanel, sTitle: string): void; }>;
		selected: ISignal<{ (pPabel: IUIPanel): void; }>;

		index: int = -1;
		
		protected $title: JQuery;
		protected $controls: JQuery = null;

		 get collapsed(): boolean {
			return this.el.hasClass("collapsed");
		}

		 get title(): string {
			return this.$title.find("span:first").html();
		}

		 set title(sTitle: string) {
			this.$title.find("span:first").html(sTitle || "");
			this.titleUpdated.emit(sTitle);
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

		protected setupSignals(): void {
			this.titleUpdated = this.titleUpdated || new Signal(<any>this);
			this.selected = this.selected || new Signal(<any>this);

			super.setupSignals();
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

		collapse(bValue: boolean = true): void {
			if (bValue === this.collapsed) {
				return;
			}

			this.collapsed? this.el.removeClass("collapsed"): this.el.addClass("collapsed");

			var $element = this.layout.el;
			
			$element.animate({
				height: 'toggle'
			}, 500);
		}


		protected finalizeRender(): void {
			super.finalizeRender();
			this.el.addClass("component-panel");
		}

		 isCollapsible(): boolean {
			return this.el.hasClass("collapsible");
		}

		setCollapsible(bValue: boolean = true): void {
			if (bValue === this.isCollapsible()) {
				return;
			}

			this.el.addClass("collapsible");
			var pPanel = this;
			
			this.$controls.click((e: IUIEvent) => {
				pPanel.collapse(!this.collapsed);
			});
		}
	}

	register("Panel", Panel);

	export function isPanel(pEntity: IEntity): boolean {
		return isComponent(pEntity, EUIComponents.PANEL);
	}
}

