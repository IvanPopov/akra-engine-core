#ifndef UICHECKBOX_TS
#define UICHECKBOX_TS

#include "IUICheckbox.ts"
#include "IUICheckboxList.ts"
#include "Component.ts"

module akra.ui {
	export class Checkbox extends Component implements IUICheckbox {
		protected _bChecked: bool = false;
		protected $text: JQuery;

		inline get checked(): bool { return this.isChecked(); }
		inline set checked(bValue: bool) {
			if (bValue) {
				this.$element.addClass("active");
			}
			else {
				this.$element.removeClass("active");
			}

			this._bChecked = bValue;
		}

		inline get text(): string { return this.$text.html(); }
		inline set text(sValue: string) { this.$text.html(sValue); }

		constructor (parent, options?: IUICheckboxOptions, eType?: EUIComponents);
		constructor (parent, name?: string, eType?: EUIComponents);
		constructor (parent, options?, eType: EUIComponents = EUIComponents.CHECKBOX) {
			super(getUI(parent), options, eType, $("<div><span class=\"checkbox-item-text\"></span></div>"));

			this.$text = this.$element.find(".checkbox-item-text:first");

			if (isDefAndNotNull(options) && isString(options.text)) {
				this.text = <string>options.text;
			}

			if (!isUI(parent)) {
				this.attachToParent(parent);
			}

			this.text = isObject(options)? options.text || "": "";
		}

		_createdFrom($comp: JQuery): void {
			this.text = $comp.attr("text");
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-checkbox");
		}


		inline isChecked(): bool {
			return this._bChecked;
		}

		click(e: IUIEvent): void {
			this.checked = !this.checked;

			this.changed(this.isChecked());
			
			super.click(e);
		}

#ifdef DEBUG
		toString(isRecursive: bool = false, iDepth: int = 0): string {
			if (!isRecursive) {
		        return '<checkbox' + (this.name? " " + this.name: "") + '>';
		    }

		    return super.toString(isRecursive, iDepth);
		}
#endif

		BROADCAST(changed, CALL(value));
	}

	export inline function isCheckbox(pEntity: IEntity): bool {
		return isComponent(pEntity, EUIComponents.CHECKBOX);
	}

	register("Checkbox", Checkbox);
}

#endif
