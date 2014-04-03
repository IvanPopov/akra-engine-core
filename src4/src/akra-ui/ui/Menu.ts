/// <reference path="Component.ts" />
/// <reference path="Button.ts" />

module akra.ui {
	class MouseleaveSignal extends Signal<IUIComponent> {
		emit(e: IUIEvent): void {
			super.emit(e);
			(<Menu>this.getSender()).getLayout().hide();
		}
	}

	class MouseenterSignal extends Signal<IUIComponent> {
		emit(e: IUIEvent): void {
			super.emit(e);
			(<Menu>this.getSender()).getLayout().show();
		}
	}


	export class Menu extends Component {
		protected $title: JQuery;

		constructor(parent, options?, eType: EUIComponents = EUIComponents.MENU) {
			super(parent, mergeOptions({ layout: EUILayouts.VERTICAL }, options), eType, $(
				"<div class=\"component-menu\">\
					<div class=\"menu-title\"></div>\
				</div>"));

			this.$title = this.getElement().find(".menu-title:first");

			this.handleEvent("mouseenter mouseleave");
		}

		protected setupSignals(): void {
			this.mouseleave = this.mouseleave || new MouseleaveSignal(this);
			this.mouseenter = this.mouseenter || new MouseenterSignal(this);

			super.setupSignals();
		}

		getText(): string { return this.$title.html(); }
		setText(s: string): void {
			this.$title.html(s);
		}

		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);

			var sText: string = $comp.attr("text");

			if (isString(sText)) {
				this.setText(sText);
			}
		}


		static MouseleaveSignal: typeof Signal = MouseleaveSignal;
		static MouseenterSignal: typeof Signal = MouseenterSignal;
	}

	register("Menu", Menu);
}

