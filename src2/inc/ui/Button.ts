#ifndef UIBUTTON_TS
#define UIBUTTON_TS

#include "IUIButton.ts"
#include "Component.ts"

module akra.ui {
	export class Button extends Component implements IUIButton {
		inline get text(): string { return this.el.html(); }
		inline set text(x: string) { this.el.html(x); }

		constructor (ui, options?, eType: EUIComponents = EUIComponents.BUTTON) {
			super(ui, options, eType, $("<button class=\"component-button\"/>"));

			this.handleEvent("click");
		}

		click(e: IUIEvent): void {
			e.stopPropagation();
			super.click(e);
		}

		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);

			var sImage: string = $comp.attr("img");
			var sClick: string = $comp.attr("onclick");

			if (isString(sImage)) {
				this.text = ("<img src='" + sImage + "' />");
			}
			else {
				this.text = $comp.attr("text") || (sImage? "": "push");
			}

			this.el.attr("onclick", sClick);
		}

		protected applyOptions(pOptions: IUIButtonOptions): void {
			super.applyOptions(pOptions);
			this.text = pOptions.text || "push";
		}
	}

	register("Button", Button);
}

#endif
