/// <reference path="../idl/IUISwitch.ts" />
/// <reference path="../guid.ts" />
/// <reference path="Component.ts" />

module akra.ui {
	export class Switch extends Component implements IUISwitch {
		changed: ISignal<{ (pSwitch: IUISwitch, bValue: boolean): void; }>;

		private $checkbox: JQuery;

		getValue(): boolean {
			return this.isOn();
		}

		setValue(bValue: boolean) {
			if (bValue != this.getValue()) {
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
			this.$checkbox = this.getElement().find("input[type=checkbox]");

			this.$checkbox.click((e: IUIEvent) => {
				e.stopPropagation();
				this.changed.emit(this.getValue());
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

			this.setValue(isDef($comp.attr("on")));
		}

		isOn(): boolean {
			return this.$checkbox.is(':checked');
		}
	}

	register("Switch", Switch);
}

