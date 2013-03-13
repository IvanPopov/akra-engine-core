#ifndef UIBUTTON_TS
#define UIBUTTON_TS

#include "IUIButton.ts"
#include "Component.ts"

module akra.ui {
	export class Button extends Component implements IUIButton {
		inline get text(): string { return this.$element.html(); }
		inline set text(x: string) { this.$element.html(x); }

		constructor (ui, options?, eType: EUIComponents = EUIComponents.BUTTON) {
			super(ui, options, eType, $("<button />"));
		}

		protected inline label(): string {
			return "Button";
		}
	}
}

#endif
