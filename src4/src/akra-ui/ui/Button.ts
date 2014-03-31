/// <reference path="../idl/IUIButton.ts" />

/// <reference path="Component.ts" />

module akra.ui {
	class ClickSignal extends Signal<IUIComponent> {
		emit(e: IUIEvent): void {
			e.stopPropagation();
			super.emit(e);
		}
	}

	export class Button extends Component implements IUIButton {
		getText(): string { return this.getElement().html(); }
		setText(x: string) { this.getElement().html(x); }

		constructor(ui, options?, eType: EUIComponents = EUIComponents.BUTTON) {
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
				this.setText(("<img src='" + sImage + "' />"));
			}
			else {
				this.setText($comp.attr("text") || (sImage ? "" : "push"));
			}
		}

		protected applyOptions(pOptions: IUIButtonOptions): void {
			super.applyOptions(pOptions);
			this.setText(pOptions.text || "push");
		}

		static ClickSignal = ClickSignal;
	}

	register("Button", Button);
}
