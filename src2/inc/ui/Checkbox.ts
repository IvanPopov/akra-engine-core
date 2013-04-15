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
			var bPrev: bool = this.isChecked();
			
			this._setValue(bValue);

			if (bValue != bPrev) {
				this.changed(bValue);
			}
		}

		inline get text(): string { return this.$text.html(); }
		inline set text(sValue: string) { this.$text.html(sValue); }

		_setValue(bValue: bool): void {
			if (bValue) {
				this.$element.addClass("active");
			}
			else {
				this.$element.removeClass("active");
			}

			this._bChecked = bValue; 
		}

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
			this.handleEvent("click");
		}

		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);
			this.text = $comp.attr("text");

			if (isDef($comp.attr("checked"))) {
				this.checked = true;
			}

			var sImage: string = $comp.attr("img");
			if (isString(sImage)) {
				this.$text.before("<img src='" + sImage + "' />");
			}
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
