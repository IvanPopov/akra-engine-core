#ifndef UISWITCH_TS
#define UISWITCH_TS

#include "IUISwitch.ts"
#include "Component.ts"

module akra.ui {
	export class Switch extends Component implements IUISwitch {
		private $checkbox: JQuery;

		inline get value(): bool {
			return this.isOn();
		}

		inline set value(bValue: bool) {
			if (bValue != this.value) {
				this.$checkbox.attr("checked", bValue);
				this.changed(bValue);
			}
		}

		constructor (parent, options?, eType: EUIComponents = EUIComponents.SWITCH) {
			super(parent, options, eType, $((
				"<div class=\"component-switch\">" + 
					"<input type=\"checkbox\" id=\"slider-$1\" />" + 
					"<label for=\"slider-$1\"></label>" + 
				"</div>"
				).replace(/\$1/g, sid())
				));

			// this.handleEvent("click");
			this.$checkbox = this.el.find("input[type=checkbox]");
			
			this.$checkbox.click((e: IUIEvent) => {
				e.stopPropagation();
				this.changed(this.value);
			});
		}

		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);

			this.value = isDef($comp.attr("on"));
		}

		inline isOn(): bool {
			return this.$checkbox.is(':checked');
		}


		BROADCAST(changed, CALL(bValue));
	}

	register("Switch", Switch);
}

#endif
