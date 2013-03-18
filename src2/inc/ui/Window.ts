#ifndef UIWINDOW_TS
#define UIWINDOW_TS

#include "IUIWindow.ts"
#include "Component.ts"

module akra.ui {
	export class Window extends Component implements IUIWindow {
		protected _pWindow;
		protected $document;

		constructor (pUI: IUI, options?: IUIWindowOptions) {
			super(pUI, options, EUIComponents.WINDOW);

			this._pWindow = window.open("", "", "height=480, width=640", false);
			this.$document = $(this._pWindow.document);
			this.$element = this.$document.find("body");

			this.$document.find("head").append($document.find("link"));

			//clear window content
			this.$element.html("");
		}

		label(): string {
			return "Window";
		}
	}

	Component.register("Window", Window);
}

#endif
