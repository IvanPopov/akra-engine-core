/// <reference path="../idl/IUIButton.ts" />

/// <reference path="Component.ts" />

module akra.ui {
	class ClickSignal extends Signal<{ (pNode: IUIComponent, e: IUIEvent): void; }, IUIComponent> {
		emit(e?: IUIEvent): void {
			e.stopPropagation();
			super.emit(e);
		}
	}

	export class Button extends Component implements IUIButton {
		 get text(): string { return this.el.html(); }
		 set text(x: string) { this.el.html(x); }

		constructor (ui, options?, eType: EUIComponents = EUIComponents.BUTTON) {
			super(ui, options, eType, $("<button class=\"component-button\"/>"));

			this.handleEvent("click");
		}

		protected setupSignals(): void {
			this.click = this.click || new ClickSignal(this);
			super.setupSignals();
		}

		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);

			var sImage: string = $comp.attr("img");

			if (isString(sImage)) {
				this.text = ("<img src='" + sImage + "' />");
			}
			else {
				this.text = $comp.attr("text") || (sImage? "": "push");
			}
		}

		protected applyOptions(pOptions: IUIButtonOptions): void {
			super.applyOptions(pOptions);
			this.text = pOptions.text || "push";
		}

		static ClickSignal = ClickSignal;
	}

	register("Button", Button);
}
