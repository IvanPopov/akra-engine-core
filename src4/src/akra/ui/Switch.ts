/// <reference path="../idl/IUISwitch.ts" />
/// <reference path="../guid.ts" />
/// <reference path="Component.ts" />

module akra.ui {
	export class Switch extends Component implements IUISwitch {
		changed: ISignal<{ (pSwitch: IUISwitch, bValue: boolean): void; }>;

		private $checkbox: JQuery;

		get value(): boolean {
			return this.isOn();
		}

		set value(bValue: boolean) {
			if (bValue != this.value) {
				this._setValue(bValue);
				this.changed.emit(bValue);
			}
		}

		constructor(parent, options?, eType: EUIComponents = EUIComponents.SWITCH) {
			super(parent, options, eType, $((
				"<div class=\"component-switch\">" +
				"<input type=\"checkbox\" id=\"slider-$1\" />" +
				"<label for=\"slider-$1\"></label>" +
				"</div>"
				).replace(/\$1/g, String(guid()))
				));

			// this.handleEvent("click");
			this.$checkbox = this.el.find("input[type=checkbox]");

			this.$checkbox.click((e: IUIEvent) => {
				e.stopPropagation();
				this.changed.emit(this.value);
			});
		}

		protected setupSignals(): void {
			this.changed = this.changed || new Signal(<any>this);
			super.setupSignals();
		}

		_setValue(bValue: boolean): void {
			this.$checkbox.prop('checked', bValue);
		}

		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);

			this.value = isDef($comp.attr("on"));
		}

		isOn(): boolean {
			return this.$checkbox.is(':checked');
		}
	}

	register("Switch", Switch);
}

