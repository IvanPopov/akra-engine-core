#ifndef UIBUTTON_TS
#define UIBUTTON_TS

#include "IUIButton.ts"
#include "Component.ts"

module akra.ui {
	export class Button extends Component implements IUIButton {
		inline get text(): string { return this.el.html(); }
		inline set text(x: string) { this.el.html(x); }

		constructor (ui, options?, eType: EUIComponents = EUIComponents.BUTTON) {
			super(ui, options, eType, $("<button />"));

			this.handleEvent("click");
		}

		protected applyOptions(pOptions: IUIButtonOptions): void {
			super.applyOptions(pOptions);
			this.text = pOptions.text || "push";
		}

		rendered(): void {
			super.rendered();
			
			this.el.addClass("component-button");
		}
	}

	register("Button", Button);
}

#endif
