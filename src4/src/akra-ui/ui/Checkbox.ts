/// <reference path="../idl/IUICheckbox.ts" />
/// <reference path="../idl/IUICheckboxList.ts" />
/// <reference path="Component.ts" />

module akra.ui {

	class ClickSignal extends Signal<IUIComponent> {
		emit(e: IUIEvent): void {
			var pChb: Checkbox = <Checkbox>this.getSender();
			pChb.setChecked(!pChb.isChecked());
			e.stopPropagation();
			super.emit(e);
		}
	}

	export class Checkbox extends Component implements IUICheckbox {
		changed: ISignal<{ (pChekbox: IUICheckbox, bValue: boolean): void; }>;


		protected _bChecked: boolean = false;
		protected $text: JQuery;

		setChecked(bValue: boolean) {
			var bPrev: boolean = this.isChecked();

			this._setValue(bValue);

			if (bValue != bPrev) {
				this.changed.emit(bValue);
			}
		}

		getText(): string { return this.$text.html(); }
		setText(sValue: string) { this.$text.html(sValue); }

		_setValue(bValue: boolean): void {
			if (bValue) {
				this.$element.addClass("active");
			}
			else {
				this.$element.removeClass("active");
			}

			this._bChecked = bValue;
		}

		constructor(parent, options?: IUICheckboxOptions, eType?: EUIComponents);
		constructor(parent, name?: string, eType?: EUIComponents);
		constructor(parent, options?, eType: EUIComponents = EUIComponents.CHECKBOX) {
			super(getUI(parent), options, eType, $("<div><span class=\"checkbox-item-text\"></span></div>"));

			this.$text = this.$element.find(".checkbox-item-text:first");

			if (isDefAndNotNull(options) && isString(options.text)) {
				this.setText(<string>options.text);
			}

			if (!isUI(parent)) {
				this.attachToParent(parent);
			}

			this.setText(isObject(options) ? options.text || "" : "");
			this.handleEvent("click");
		}

		protected setupSignals(): void {
			this.changed = this.changed || new Signal(this);
			super.setupSignals();
		}


		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);
			this.setText($comp.attr("text"));

			if (isDef($comp.attr("checked"))) {
				this.setChecked(true);
			}

			var sImage: string = $comp.attr("img");
			if (isString(sImage)) {
				this.$text.before("<img src='" + sImage + "' />");
			}
		}

		finalizeRender(): void {
			super.finalizeRender();
			this.getElement().addClass("component-checkbox");
		}


		isChecked(): boolean {
			return this._bChecked;
		}

		toString(isRecursive: boolean = false, iDepth: int = 0): string {
			if (!isRecursive) {
				return '<checkbox' + (this.getName() ? " " + this.getName(): "") + '>';
			}

			return super.toString(isRecursive, iDepth);
		}

		static ClickSignal = ClickSignal;
	}

	export function isCheckbox(pEntity: IEntity): boolean {
		return isComponent(pEntity, EUIComponents.CHECKBOX);
	}

	register("Checkbox", Checkbox);
}

