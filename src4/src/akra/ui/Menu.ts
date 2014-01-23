/// <reference path="Component.ts" />
/// <reference path="Button.ts" />

module akra.ui {
	class MouseleaveSignal extends Signal<{ (pNode: IUIComponent, e: IUIEvent): void; }, IUIComponent> {
		emit(e?: IUIEvent): void {
			super.emit(e);
			(<Menu>this.getSender()).layout.hide();
		}
	}

	class MouseenterSignal extends Signal<{ (pNode: IUIComponent, e: IUIEvent): void; }, IUIComponent> {
		emit(e?: IUIEvent): void {
			super.emit(e);
			(<Menu>this.getSender()).layout.show();
		}
	}


	export class Menu extends Component {
		protected $title: JQuery;

		 get text(): string { return this.$title.html(); }
		 set text(s: string) {
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

		protected setupSignals(): void {
			this.mouseleave = this.mouseleave || new MouseleaveSignal(this);
			this.mouseenter = this.mouseenter || new MouseenterSignal(this);

			super.setupSignals();
		}

		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);

			var sText: string = $comp.attr("text");
			
			if (isString(sText)) {
				this.text = sText;
			}
		}


		static MouseleaveSignal = MouseleaveSignal;
		static MouseenterSignal = MouseenterSignal;
	}

	register("Menu", Menu);
}

