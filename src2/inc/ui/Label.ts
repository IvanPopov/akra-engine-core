#ifndef UILABEL_TS
#define UILABEL_TS

#include "IUILabel.ts"
#include "Component.ts"

module akra.ui {
	export class Label extends Component implements IUILabel {
		protected $text: JQuery;
		protected $input: JQuery;

		protected _bEditable: bool = false;

		inline get text(): string { return this.$text.html(); }
		inline set text(x: string) { this.$text.html(x); }

		constructor (ui, options?, eType: EUIComponents = EUIComponents.LABEL) {
			super(ui, options, eType, 
			 $("<div>\
					<div class='label-text'></div>\
					<input \
					onfocus=\"this.style.width = ((this.value.length + 1) * 6) + 'px';\" \
					onkeyup=\"this.style.width = ((this.value.length + 1) * 6) + 'px';\" class='label-input' style='display:none;' type='text' value=''/>\
				</div>"));

			this.$text = this.$element.find(".label-text");
			this.$input = this.$element.find(".label-input");

			this.text = isObject(options)? options.text || "": "";
			this.editable(isObject(options)? options.editable || false: false);
		}

		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);

			this.text = $comp.attr("text");
			this.editable($comp.attr("editable") || false);
		}

		inline isEditable(): bool {
			return this._bEditable;
		}

		editable(bValue: bool = true): void {
			this._bEditable = bValue;

			if (bValue) {
				this.handleEvent("click keydown focusout");
				this.el.addClass("editable");
			}
			else {
				this.el.removeClass("editable");
				this.disableEvent("click keydown focusout");
			}
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-label");
		}

		click(e: IUIEvent): void {
			this.$text.css("display", "none");
			this.$input.val(this.text);
			this.$input.css("display", "inline-block").focus();

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
			this.$text.css("display", "inline-block");
			this.$input.css("display", "none");

			if (isChanged) {
				this.changed(sText);
			}

			super.focusout(e);
		}

		BROADCAST(changed, CALL(value));
	}

	register("Label", Label);
}

#endif
