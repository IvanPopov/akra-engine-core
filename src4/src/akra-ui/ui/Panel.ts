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

		isCollapsed(): boolean {
			return this.getElement().hasClass("collapsed");
		}

		getTitle(): string {
			return this.$title.find("span:first").html();
		}

		setTitle(sTitle: string) {
			this.$title.find("span:first").html(sTitle || "");
			this.titleUpdated.emit(sTitle);
		}

		constructor(parent, options?, eType: EUIComponents = EUIComponents.PANEL) {
			super(parent, mergeOptions({ layout: EUILayouts.UNKNOWN }, options), eType,
				$("<div>\
						<div class='panel-title'>\
							<div class=\"controls\">\
								<input type=\"checkbox\" />\
							</div>\
							<span />\
						</div>\
					</div>"));

			this.$title = this.getElement().find("div.panel-title:first");
			this.$controls = this.getElement().find("div.controls:first");

			if (isDefAndNotNull(options)) {
				if (isString(options.title)) {
					this.setTitle(options.title);
				}
			}
		}

		protected setupSignals(): void {
			this.titleUpdated = this.titleUpdated || new Signal(this);
			this.selected = this.selected || new Signal(this);

			super.setupSignals();
		}

		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);
			this.setTitle($comp.attr('title'));

			if (isDef($comp.attr("collapsible"))) {
				this.setCollapsible($comp.attr("collapsible").toLowerCase() !== "false");
			}

			var sCollapsed: string = $comp.attr("collapsed");

			if (isString(sCollapsed) && sCollapsed.toLowerCase() !== "false") {
				this.getElement().addClass("collapsed");
				this.getLayout().hide();
			}
		}

		collapse(bValue: boolean = true): void {
			if (bValue === this.isCollapsed()) {
				return;
			}

			this.isCollapsed() ? this.getElement().removeClass("collapsed") : this.getElement().addClass("collapsed");

			var $element = this.getLayout().getElement();

			$element.animate({
				height: 'toggle'
			}, 500);
		}


		protected finalizeRender(): void {
			super.finalizeRender();
			this.getElement().addClass("component-panel");
		}

		isCollapsible(): boolean {
			return this.getElement().hasClass("collapsible");
		}

		setCollapsible(bValue: boolean = true): void {
			if (bValue === this.isCollapsible()) {
				return;
			}

			this.getElement().addClass("collapsible");
			var pPanel = this;

			this.$controls.click((e: IUIEvent) => {
				pPanel.collapse(!this.isCollapsed());
			});
		}
	}

	register("Panel", Panel);

	export function isPanel(pEntity: IEntity): boolean {
		return isComponent(pEntity, EUIComponents.PANEL);
	}
}

