#ifndef UILABEL_TS
#define UILABEL_TS

#include "IUILabel.ts"
#include "Component.ts"
#include "IKeymap.ts"

module akra.ui {
	export class Label extends Component implements IUILabel {
		protected $text: JQuery;
		protected $input: JQuery;

		inline get text(): string { return this.$text.html(); }
		inline set text(x: string) { this.$text.html(x); }

		constructor (ui, options?, eType: EUIComponents = EUIComponents.LABEL) {
			super(ui, options, eType);

			this.$text = this.$element.find(".label-text");
			this.$input = this.$element.find(".label-input");

			if (isDefAndNotNull(options) && isString(options.text)) {
				this.text = <string>options.text;
			}
		}

		_applyEntry($entry: JQuery): void {
			super._applyEntry($entry);

			this.text = $entry.attr("text");
		}

		protected label(): string {
			return "Label";
		}

		click(e: IUIEvent): void {
			this.$text.hide();
			this.$input.val(this.text);
			this.$input.show().focus();

			super.click(e);
		}

		keydown(e: IUIEvent): void {
			if (this.$input.is(":focus")) {
				if ((<KeyboardEvent><any>e).keyCode == EKeyCodes.ENTER) {
					this.focusout(e);
				}
			}

			super.keydown(e);
		}

		focusout(e: IUIEvent): void {
			var sText: string = this.$input.val();
			var isChanged: bool = (this.$text.html() !== sText);

			this.$text.html(sText);
			this.$text.show();
			this.$input.hide();

			if (isChanged) {
				this.changed(sText);
			}

			super.focusout(e);
		}

		BROADCAST(changed, CALL(value));
	}

	Component.register("Label", Label);
}

#endif
