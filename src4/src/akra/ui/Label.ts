/// <reference path="../idl/IUILabel.ts" />
/// <reference path="Component.ts" />

module akra.ui {
	class ClickSignal extends Signal<{ (pNode: IUIComponent, e: IUIEvent): void; }, IUIComponent> {
		emit(e?: IUIEvent): void {
			var pLabel: Label = <Label>this.getSender();

			pLabel.$text.css("display", "none");
			pLabel.$input.val(pLabel.getText());
			pLabel.$input.css("display", "-block").focus();

			super.emit(e);
		}
	}

	class FocusoutSignal extends Signal<{ (pNode: IUIComponent, e: IUIEvent): void; }, IUIComponent> {
		emit(e?: IUIEvent): void {
			var pLabel: Label = <Label>this.getSender();

			var sText: string = pLabel.$input.val();
			var isChanged: boolean = (pLabel.getText() !== sText);

			pLabel.setText(sText);
			pLabel.$text.css("display", "block");
			pLabel.$input.css("display", "none");

			if (isChanged) {
				pLabel.changed.emit(sText);
			}

			super.emit(e);
		}
	}

	class KeydownSignal extends Signal<{ (pNode: IUIComponent, e: IUIEvent): void; }, IUIComponent> {
		emit(e?: IUIEvent): void {
			var pLabel: Label = <Label>this.getSender();

			if (pLabel.$input.is(":focus")) {
				if ((<KeyboardEvent><any>e).keyCode == EKeyCodes.ENTER) {
					pLabel.focusout.emit(e);
				}
			}

			super.emit(e);
		}
	}

	export class Label extends Component implements IUILabel {
		changed: ISignal<{ (pLabel: IUILabel, sValue: string): void; }>;

		protected $text: JQuery;
		protected $input: JQuery;

		protected _bEditable: boolean = false;
		protected _sPostfix: string = null;

		getText(): string {
			var s: string = this.$text.html();
			return s.substr(0, s.length - (this._sPostfix || "").length);
		}

		setText(x: string) { this.$text.html(x + (this._sPostfix || "")); }
		setPostfix(s: string) { this._sPostfix = s; }
		getPostfix(): string { return this._sPostfix; }

		constructor(ui, options?, eType: EUIComponents = EUIComponents.LABEL) {
			super(ui, options, eType,
				$("<div>\
					<div class='label-text'></div>\
					<input \
					onfocus=\"this.style.width = ((this.value.length + 1) * 6) + 'px';\" \
					onkeyup=\"this.style.width = ((this.value.length + 1) * 6) + 'px';\" class='label-input' style='display:none;' type='text' value=''/>\
				</div>"));

			this.$text = this.$element.find(".label-text");
			this.$input = this.$element.find(".label-input");

			this.setText(isObject(options) ? options.text || "" : "");
			this.editable(isObject(options) ? options.editable || false : false);
		}

		protected setupSignals(): void {
			this.click = this.click || new ClickSignal(<any>this);
			this.changed = this.changed || new Signal(<any>this);
			this.focusout = this.focusout || new FocusoutSignal(this);
			this.keydown = this.keydown || new KeydownSignal(this);

			super.setupSignals();
		}

		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);

			this.setText($comp.attr("text"));
			this.editable(isDef($comp.attr("editable")) || false);
			this.setPostfix($comp.attr("postfix"));
		}

		isEditable(): boolean {
			return this._bEditable;
		}

		editable(bValue: boolean = true): void {
			this._bEditable = bValue;

			if (bValue) {
				this.handleEvent("click keydown focusout");
				this.getElement().addClass("editable");
			}
			else {
				this.getElement().removeClass("editable");
				this.disableEvent("click keydown focusout");
			}
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.getElement().addClass("component-label");
		}


		static ClickSignal = ClickSignal;
		static FocusoutSignal = FocusoutSignal;
		static KeydownSignal = KeydownSignal;
	}

	register("Label", Label);
}
